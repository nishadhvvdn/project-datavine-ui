/**
 * @description
 * Controller for Meter Registration
 */
(function (angular) {
    "use strict";
    angular.module('dataVINEApp').controller('deltaLinkRegistrationCtrl',
        ["$scope", "$uibModal", "$state", "$rootScope", '$filter',
            '$timeout', 'DeviceService', 'ParseService', 'refreshservice',
            'commonService', '$templateCache' ,'uiGridExporterService', 'uiGridExporterConstants',
            function ($scope, $uibModal, $state, $rootScope, $filter, $timeout, deviceService, parseService, refreshservice, commonService, $templateCache, uiGridExporterService, uiGridExporterConstants) {
                let currentDefaultTablePageSize = objCacheDetails.grid.paginationPageSize;
                var modalInstance = null;
                $scope.isSelected = false;
                $scope.mySelectedRows = [];
                $scope.searchTerm = '';
                let logsData = [];

                $scope.pagination = {
                    totalRecordsInDBCount : 0,
                    currentTotalItems: 0,
                    apiCurrentPage: 1,
                    apiNextPage: 0,
                    currentTablePage: 1,
                    currentTablePaginationSize: objCacheDetails.grid.paginationPageSize,
                    totalTablePages: 1
                }
                $scope.disableNxtBtn = true;
                $scope.disablePrvBtn = true;
                $scope.disableFirstBtn = true;
                $scope.disableLastBtn = true;

                $scope.initializeDeltaLinkTable = function (pageNum) {
                    $scope.deltaLinkGrid = angular.copy(objCacheDetails.grid);
                    $scope.deltaLinkGrid.data = [];
                    $scope.deltaLinkGrid.exporterPdfOrientation = 'landscape';
                    $scope.deltaLinkGrid.exporterPdfMaxGridWidth = 640;
                    $scope.deltaLinkGrid.exporterCsvFilename = 'file.csv';                    
                    $scope.deltaLinkGrid.exporterMenuCsv =  false;  
                    angular.element(document.querySelector("div.ui-grid-selection-row-header-buttons")).removeClass("ui-grid-all-selected");       
                    $scope.deltaLinkGrid.gridMenuCustomItems = [                    
                    {
                        title: 'Export all data as csv',
                        action: function ($event) {
                        var uiExporter = uiGridExporterService;
                        var grid = $scope.gridApi.grid;
                            var exportColumnHeaders = uiExporter.getColumnHeaders(grid, uiGridExporterConstants.VISIBLE);
                            var selectionData = [];
                            deviceService.getExportAllDeltalinkDetails(
                            'ListAllBulkOperations')
                            .then(function (objData) {
                                var arrayData = objData.DeltalinkDetailSelected;
                                arrayData.forEach(function (entry) {
                                var innerData = [];
                                
                                entry.Status = entry.Status === 'NotRegistered' ? 'No' : 'Yes';
                                
                                for (var e in entry) { //create the inner data object array
                                    if (e !== '$$hashKey' && (e === 'DeltalinkSerialNumber' || 
                                        e === 'Status' || e === 'DeltaLinks_DeviceDetails')) {
                                            var selectObj = {};
                                            if(e === 'DeltaLinks_DeviceDetails') {
                                                selectObj = { value: entry[e].DeltalinkVersion }; 
                                            } else {
                                                selectObj = { value: entry[e] }; 
                                            }                                                                                    
                                        innerData.push(selectObj);
                                    }
                                }
                                selectionData.push(innerData); //push the inner object value array to the larger array as required by formatAsCsv
                                });
                                var csvContent = uiExporter.formatAsCsv(exportColumnHeaders, selectionData, grid.options.exporterCsvColumnSeparator);
                                uiExporter.downloadFile($scope.deltaLinkGrid.exporterCsvFilename, csvContent, grid.options.exporterOlderExcelCompatibility);
                            });                                                                                                                                                                                        
                        }
                    },
                    {
                        title: 'Export visible data as csv',
                        action: function ($event) {  
                            var grid = $scope.gridApi.grid;
                            var rowTypes = uiGridExporterConstants.ALL;
                            var colTypes = uiGridExporterConstants.ALL;
                            uiGridExporterService.csvExport(grid, rowTypes, colTypes);                                                                                                                                                                                              
                        }
                    }];

                    $scope.deltaLinkGrid.columnDefs = [
                        {
                            field: 'SerialNumber',
                            displayName: 'Serial Number', enableHiding: false,
                            sortingAlgorithm: commonService.getSortByString, width: 180
                        },
                        {
                            field: 'version',
                            displayName: 'Version',
                            enableHiding: false,
                            sortingAlgorithm: commonService.getSortByString
                        },{
                            field: 'Registered',
                            displayName: 'Registered',
                            enableHiding: false,
                            sortingAlgorithm: commonService.getSortByString
                        },
                        {
                            field: 'Actions',
                            cellTemplate: '<div class="ui-grid-cell-contents">' +
                                '<button type="button" ' +
                                'class="btn btn-xs btn-primary cellBtn"' +
                                ' ng-click="grid.appScope.viewDeltaLinkEntry(row)" title="View">' +
                                '  <i class="fa fa-eye"></i></button>' +
                                ' &nbsp|&nbsp <button type="button"' +
                                ' class="btn btn-xs btn-primary cellBtn"' +
                                ' ng-click="grid.appScope.createOrEditDeltaLink(\'edit\',row)" title="Edit">' +
                                ' <i class="fa fa-pencil-square-o"' +
                                ' aria-hidden="true"></i></button> | &nbsp ' +
                                ' <button class="btn btn-xs btn-primary cellBtn" ' +
                                ' ng-click="grid.appScope.deleteSelectedDeltaLink(row,\'single\')" title="Delete">' +
                                ' <i class="fa fa-trash-o" aria-hidden="true">' +
                                '</i></button></div>',
                            enableColumnMenu: false, enableSorting: false,
                            enableHiding: false, width: 150
                        }
                    ];
                    $scope.deltaLinkGrid.exporterSuppressColumns = ['Actions'];
                    $scope.deltaLinkGrid.onRegisterApi = function (gridApi) {
                        $scope.gridApi = gridApi;
                        commonService.getGridApi($scope, gridApi);
                        gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {
                            $scope.pagination.currentTablePaginationSize = pageSize;
                            $scope.pagination.totalTablePages = Math.ceil($scope.pagination.currentTotalItems / pageSize);
                            pageNum = 1;
                            $scope.pagination.currentTablePage = 1;
                            initDeltaLinkList(pageNum, $scope.pagination.currentTablePaginationSize);
                        });
                    };

                    initDeltaLinkList(pageNum, $scope.pagination.currentTablePaginationSize);

                    $templateCache.put('ui-grid/pagination', commonService.getModifiedTable());
                }

                $scope.initializeDeltaLinkTable($scope.pagination.apiCurrentPage, currentDefaultTablePageSize);

                function initDeltaLinkList(pageNum, limit) {
                    deviceService.fetchDeltaLinkListAll($scope.searchTerm, pageNum, limit)
                        .then(function (apiData) {
                            if (!angular.isUndefinedOrNull(apiData) && apiData.type) {
                                logsData.length = 0;
                                $scope.pagination.currentTotalItems = apiData.DeltalinkDetailSelected.results.length;
                                $scope.pagination.apiCurrentPage = pageNum;
                                $scope.pagination.totalRecordsInDBCount = apiData.DeltalinkDetailSelected.totalRecords;
                                $scope.pagination.totalTablePages = Math.ceil($scope.pagination.totalRecordsInDBCount / $scope.pagination.currentTablePaginationSize);

                                let btnFlags = commonService.getBtnStatus($scope.pagination.currentTablePage, $scope.pagination.totalTablePages);
                                $scope.disableNxtBtn = btnFlags.disableNxtBtn;
                                $scope.disablePrvBtn = btnFlags.disablePrvBtn;
                                $scope.disableFirstBtn = btnFlags.disableFirstBtn;
                                $scope.disableLastBtn = btnFlags.disableLastBtn;

                                apiData = apiData.DeltalinkDetailSelected.results;
                                $rootScope.commonMsg = "";
                                for (var i = 0; i < apiData.length; i++) {
                                    let objToInsert = {};
                                    objToInsert["SerialNumber"] = apiData[i].DeltalinkSerialNumber;
                                    objToInsert["version"] = angular.isUndefinedOrNull(apiData[i].DeltaLinks_DeviceDetails.DeltalinkVersion) || apiData[i].DeltaLinks_DeviceDetails.DeltalinkVersion === 'null' ? '-' : apiData[i].DeltaLinks_DeviceDetails.DeltalinkVersion;
                                    objToInsert["macID"] = apiData[i].DeltaLinks_Communications.MAC_ID_WiFi;
                                    objToInsert["bandwidth"] = (apiData[i].Bandwidth).toString();
                                    objToInsert["downloadBandwidth"] = apiData[i].DownloadBandwidth;
                                    objToInsert["uploadBandwidth"] = apiData[i].UploadBandwidth;
                                    objToInsert["Registered"] = apiData[i].Status === "NotRegistered" ? "No" : "Yes";
                                    objToInsert["DeltalinkID"] = apiData[i].DeltalinkID;
                                    logsData.push(objToInsert);
                                }
                                $scope.deltaLinkGrid.data = logsData;
                            } else if (apiData.type == false) {
                                $scope.disableNxtBtn = true;
                                $scope.disablePrvBtn = true;
                                $scope.disableFirstBtn = true;
                                $scope.disableLastBtn = true;
                                $scope.pagination.totalRecordsInDBCount = 0;
                                $rootScope.commonMsg = "No data found!";
                            } else {
                                $rootScope.commonMsg = "";
                            }
                        });
                }

                $scope.deleteSelectedLogs = function (row, type) {
                    swal({
                        title: "Delete Logs",
                        text: "Are you sure you want to delete?",
                        showCancelButton: true,
                        confirmButtonColor: 'black',
                        confirmButtonText: 'Yes',
                        cancelButtonText: "No",
                        cancelButtonColor: 'white',
                    }, function (isConfirm) {
                        if (isConfirm) {
                            let selectedLogsFiles = [];
                            if (type === 'single') {
                                selectedLogsFiles = [row.entity.LogID];
                            } else {
                                $scope.mySelectedRows = $scope.gridApi.selection.getSelectedRows();
                                for (let i = 0; i < $scope.mySelectedRows.length; i++) {
                                    selectedLogsFiles.push(
                                        $scope.mySelectedRows[i].LogID
                                    );
                                }
                            }
                            deviceService.deleteDeviceLogs('DeleteDeviceLogsDetails', selectedLogsFiles)
                                .then(function (objData) {
                                    swal({
                                        title: objData
                                    }, function (isConfirm) {
                                        $scope.mySelectedRows.length = 0;
                                        $scope.initializeDeltaLinkTable($scope.pagination.apiCurrentPage, currentDefaultTablePageSize);
                                    });
                                });
                        } else {
                            $scope.mySelectedRows.length = 0;
                            $scope.initializeDeltaLinkTable($scope.pagination.apiCurrentPage, currentDefaultTablePageSize);
                        }
                    });
                };

                $scope.nxtPageBtnClick = function () {
                    if ($scope.pagination.currentTablePage < $scope.pagination.totalTablePages && $scope.pagination.totalTablePages > 0) {
                        let nextAPIPage = ++$scope.pagination.currentTablePage;
                        $scope.disablePrvBtn = false;
                        $scope.initializeDeltaLinkTable(nextAPIPage, $scope.pagination.currentTablePaginationSize);
                    } else {
                        $scope.disableNxtBtn = true;
                        $scope.disablePrvBtn = false;
                        $scope.disableLastBtn = true;
                    }
                }

                $scope.prvPageBtnClick = function () {
                    if ($scope.pagination.currentTablePage > 1 && $scope.pagination.currentTablePage <= $scope.pagination.totalTablePages) {
                        let prevAPIPage = --$scope.pagination.currentTablePage;
                        $scope.disableNxtBtn = false;
                        $scope.initializeDeltaLinkTable(prevAPIPage, $scope.pagination.currentTablePaginationSize);
                    } else {
                        {
                            $scope.disablePrvBtn = true;
                            $scope.disableNxtBtn = false;
                            $scope.disableFirstBtn = true;
                        }
                    }

                }

                $scope.firstPageBtnClick = function () {
                    if ($scope.pagination.currentTablePage > 1 && $scope.pagination.currentTablePage <= $scope.pagination.totalTablePages) {
                        $scope.pagination.currentTablePage = 1;
                        let firstPage = 1;
                        $scope.disableNxtBtn = false;
                        $scope.disableFirstBtn = true;
                        $scope.initializeDeltaLinkTable(firstPage, $scope.pagination.currentTablePaginationSize);
                    } else {
                        {
                            $scope.disablePrvBtn = true;
                            $scope.disableNxtBtn = false;
                        }
                    }
                }

                $scope.lastPageBtnClick = function () {
                    if ($scope.pagination.currentTablePage >= 1 && $scope.pagination.currentTablePage <= $scope.pagination.totalTablePages) {
                        $scope.pagination.currentTablePage = $scope.pagination.totalTablePages;
                        let lastPage = $scope.pagination.totalTablePages;
                        $scope.disableNxtBtn = false;
                        $scope.disableLastBtnBtn = true;
                        $scope.initializeDeltaLinkTable(lastPage, $scope.pagination.currentTablePaginationSize);
                    } else {
                        {
                            $scope.disablePrvBtn = true;
                            $scope.disableNxtBtn = false;
                        }
                    }
                }

                $scope.paginationBoxChanges = function () {
                    if($scope.pagination.currentTablePage) {
                        $scope.initializeDeltaLinkTable($scope.pagination.currentTablePage, $scope.pagination.currentTablePaginationSize);
                    } else {
                        $scope.pagination.currentTablePage = 1;
                        $scope.initializeDeltaLinkTable($scope.pagination.currentTablePage, $scope.pagination.currentTablePaginationSize);
                    }
                }

                $scope.printCart = function () {
                    window.print();
                };
                //searching the data
                $scope.searchButtonClear =  function (searchTerm) {
                    if(searchTerm == ""){
                        $scope.searchTerm = '';
                        $scope.initializeDeltaLinkTable($scope.pagination.currentTablePage, $scope.pagination.currentTablePaginationSize);
                    }
                }

                /**
                 * @description
                 * Function to search data in grid
                 *
                 * @param searchTerm
                 * @return Nil

                 */
                $scope.searchButton = function (searchTerm) {
                    if (searchTerm) {
                        $scope.searchTerm = searchTerm;
                        $scope.pagination.currentTablePage = 1;
                        $scope.initializeDeltaLinkTable($scope.pagination.currentTablePage, $scope.pagination.currentTablePaginationSize);
                    } else {
                        $scope.searchTerm = '';
                        $scope.initializeDeltaLinkTable($scope.pagination.currentTablePage, $scope.pagination.currentTablePaginationSize);
                    }
                    angular.element(document.querySelector("div.ui-grid-selection-row-header-buttons")).removeClass("ui-grid-all-selected");
                    $scope.mySelectedRows.length = 0;
                }

                /**
                 *  @description
                 * Function to view meter in grid by
                 * opening a pop-up
                 *
                 * @param row
                 * @return Nil

                 */
                $scope.viewDeltaLinkEntry = function (row) {
                    objCacheDetails.data.deltaLinkData = row.entity;
                    $uibModal.open({
                        templateUrl: '/templates/viewDeltaLinkEntry.html',
                        controller: 'viewDeltaLinkCtrl',
                        size: 'lg',
                        backdrop: 'static',
                        keyboard: true
                    }).result.then(function () {
                        $scope.mySelectedRows.length = 0;
                        $scope.initializeDeltaLinkTable($scope.pagination.apiCurrentPage, currentDefaultTablePageSize);
                    }, function (callApi) {                        
                        if(callApi) {
                            $scope.mySelectedRows.length = 0;
                            $scope.initializeDeltaLinkTable($scope.pagination.apiCurrentPage, currentDefaultTablePageSize);
                        }
                    });
                };

                /**
                 *  @description
                 * Function to delete selected deltaLinks
                 *
                 * @return Nil

                 * @param row
                 * @param type
                 */
                $scope.deleteSelectedDeltaLink = function (row, type) {
                    swal({
                        html: true,
                        title: "Delete DeltaLINK&trade;",
                        text: "Deleting the DeltaLINK&trade; will remove connection " +
                            "between the devices. Are you sure you want to remove ?",
                        showCancelButton: true,
                        confirmButtonColor: 'black',
                        confirmButtonText: 'Delete',
                        cancelButtonText: "Cancel",
                        cancelButtonColor: 'white',
                    }, function (isConfirm) {
                        if (isConfirm) {
                            let selectedDeltaLinks = [];
                            if (type === 'single') {
                                selectedDeltaLinks = [row.entity.DeltalinkID];
                            } else {
                                $scope.mySelectedRows = $scope.gridApi.selection.getSelectedRows();
                                for (var i = 0; i < $scope.mySelectedRows.length; i++) {
                                    selectedDeltaLinks.push($scope.mySelectedRows[i].DeltalinkID);
                                }
                            }
                            deviceService.deleteDeltaLinks(selectedDeltaLinks)
                                .then(function (objData) {
                                    swal(objData);
                                    $scope.mySelectedRows.length = 0;
                                    let pagenum = 1;
                                    $scope.pagination.currentTablePage = 1;
                                    $scope.initializeDeltaLinkTable(pagenum, currentDefaultTablePageSize);
                                });
                        }
                    });
                };

                /**
                 *  @description
                 * Function to open pop-up for uploading configuration
                 *
                 * @param size
                 * @return Nil

                 */
                $scope.openUploadDeltaLinkConfiguration = function (size) {
                    modalInstance = $uibModal.open({
                        templateUrl: '/templates/openUploadConfiguration.html',
                        controller: 'uploadCtrl',
                        size: size,
                        backdrop: 'static',
                        keyboard: true,
                        resolve: {
                            uploadParam: function () {
                                return {type: 'deltaLink', endPoint: 'NewDeltalinkEntry'};
                            }
                        }
                    });
                    modalInstance.result.then(function () {
                        $scope.mySelectedRows.length = 0;
                        $scope.initializeDeltaLinkTable($scope.pagination.apiCurrentPage, currentDefaultTablePageSize);
                    }, function (callApi) {                       
                        if(callApi){
                            $scope.mySelectedRows.length = 0;
                            $scope.initializeDeltaLinkTable($scope.pagination.apiCurrentPage, currentDefaultTablePageSize);
                        }
                    });
                    $scope.dynamicPopover.isOpen = false;
                };

                $scope.createOrEditDeltaLink = function (type, row) {
                    objCacheDetails.data.deltaLinkData = (type === 'edit') ? angular.copy(row.entity) : {};
                    $uibModal.open({
                        templateUrl: 'templates/createOrEditDeltaLink.html',
                        controller: 'addOrEditDeltaLinkCtrl',
                        size: 'lg',
                        backdrop: 'static',
                        keyboard: true,
                        resolve: {
                            type: function () {
                                return type;
                            }
                        }
                    }).result.then(function () {
                        $scope.mySelectedRows.length = 0;
                        $scope.initializeDeltaLinkTable($scope.pagination.apiCurrentPage, currentDefaultTablePageSize);
                    }, function (callApi) {                        
                        if(callApi) {
                            $scope.mySelectedRows.length = 0;
                            $scope.initializeDeltaLinkTable($scope.pagination.apiCurrentPage, currentDefaultTablePageSize);
                        }
                    });
                };

                $scope.$on('$destroy', function () {
                    $templateCache.put('ui-grid/pagination', commonService.setDefaultTable());
                });
            }]);
})(window.angular);
