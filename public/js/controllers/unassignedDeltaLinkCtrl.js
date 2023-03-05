/**
 * @description
 * Controller for unassigned deltalink
 */
(function (angular) {
    "use strict";
    angular.module('dataVINEApp').controller('unassignedDeltaLinkCtrl',
        ["$scope","$uibModal", "$state", "$rootScope", '$filter',
        '$timeout', 'DeviceService', 'ParseService', 'refreshservice',
        'commonService', '$templateCache','DeviceMappingService', '$sessionStorage',
            function ($scope, $uibModal, $state, $rootScope, $filter, $timeout, deviceService, parseService, refreshservice, commonService, $templateCache,deviceMappingService,$sessionStorage) {
                let currentDefaultTablePageSize = objCacheDetails.grid.paginationPageSize;
                var arrMeterData = [];
                let deltaLinkData = [];
                var modalInstance = null;
                $scope.isSelected = false;
                $scope.mySelectedRows = [];
                $scope.searchTerm = '';
                let logsData = [];
                $scope.pagination = {
                    totalRecordsInDBCount: 0,
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
                // let modalInstance = null;
                let modalInstanceNested = null;
                $scope.currentURL = $state;
                    //init();
                   /**
                 * Initializes the controller data
                 */
                function init() {
                    var pageNum = 1;
                    var limit = 15;
                    $scope.datagridMessage = 'Loading';
                    angular.element(document.querySelector("div.ui-grid-selection-row-header-buttons")).removeClass("ui-grid-all-selected");
                    arrMeterData = [];
                    var insertDeltalinkData = [];
                    $scope.searchTerm = "";
                    if (!$sessionStorage.get('selectedMeter')) {
                        $state.go('system.meterDeltalink');
                    } else {
                        var meterID = "null";
                        deviceService.fetchspecificmetertoDeltaLinkList($scope.searchTerm,pageNum,limit,meterID)
                        .then(function (objData) {
                            if(objData.DeltalinkDetailSelected != undefined){
                                $scope.pagination.currentTotalItems = objData.DeltalinkDetailSelected.results.length;
                                $scope.pagination.apiCurrentPage = pageNum;
                                $scope.pagination.totalRecordsInDBCount = objData.DeltalinkDetailSelected.totalRecords;
                                $scope.pagination.totalTablePages = Math.ceil($scope.pagination.totalRecordsInDBCount / $scope.pagination.currentTablePaginationSize);
                                let btnFlags = commonService.getBtnStatus($scope.pagination.currentTablePage, $scope.pagination.totalTablePages);
                                $scope.disableNxtBtn = btnFlags.disableNxtBtn;
                                $scope.disablePrvBtn = btnFlags.disablePrvBtn;
                                $scope.disableFirstBtn = btnFlags.disableFirstBtn;
                                $scope.disableLastBtn = btnFlags.disableLastBtn;
                                for (var i = 0; i < objData.DeltalinkDetailSelected.results.length; i++) {
                                    let objToInsert = {};
                                    objToInsert["SerialNumber"] = objData.DeltalinkDetailSelected.results[i].DeltalinkSerialNumber;
                                    objToInsert["version"] = angular.isUndefinedOrNull(objData.DeltalinkDetailSelected.results[i].DeltaLinks_DeviceDetails.DeltalinkVersion) || objData.DeltalinkDetailSelected.results[i].DeltaLinks_DeviceDetails.DeltalinkVersion === 'null' ? '-' : objData.DeltalinkDetailSelected.results[i].DeltaLinks_DeviceDetails.DeltalinkVersion;
                                    objToInsert["macID"] = objData.DeltalinkDetailSelected.results[i].DeltaLinks_Communications.MAC_ID_WiFi;
                                    objToInsert["bandwidth"] = (objData.DeltalinkDetailSelected.results[i].Bandwidth).toString();
                                    objToInsert["downloadBandwidth"] = objData.DeltalinkDetailSelected.results[i].DownloadBandwidth;
                                    objToInsert["uploadBandwidth"] = objData.DeltalinkDetailSelected.results[i].UploadBandwidth;
                                    objToInsert["DeltalinkID"] = objData.DeltalinkDetailSelected.results[i].DeltalinkID;
                                    objToInsert["IsMaster"] = (objData.DeltalinkDetailSelected.results[i].IsMaster ? 'Master' : 'Slave');
                                    insertDeltalinkData.push(objToInsert);
                                }
                                $scope.deltaLinkGrid.data = insertDeltalinkData;
                            } else if (objData.type == false) {
                                // $scope.datagridMessage = 'Empty List! There are no Meters assigned to this service. Please group a DeltaLink.';
                                $scope.deltaLinkGrid.data = insertDeltalinkData;  
                                $rootScope.commonMsg = "No data found!";
                            } else {
                                $rootScope.commonMsg = "";
                            }
                    });
                    }
                }

                $scope.initializeDeltaLinkTable = function (pageNum) {
                    $scope.deltaLinkGrid = angular.copy(objCacheDetails.grid);
                    $scope.deltaLinkGrid.data = [];
                    $scope.deltaLinkGrid.exporterPdfOrientation = 'landscape';
                    $scope.deltaLinkGrid.exporterPdfMaxGridWidth = 640;
                    angular.element(document.querySelector("div.ui-grid-selection-row-header-buttons")).removeClass("ui-grid-all-selected");       
                    $scope.deltaLinkGrid.exporterCsvFilename = 'file.csv';
                    $scope.deltaLinkGrid.columnDefs = [
                        {
                            field: 'SerialNumber',
                            displayName: 'Serial Number', enableHiding: false,
                            sortingAlgorithm: commonService.getSortByString, width: 180
                        },
                        {
                            field: 'version',
                            displayName: 'Hardware Version',
                            enableHiding: false,
                            sortingAlgorithm: commonService.getSortByString
                        },
                        {
                            field: 'IsMaster',
                            displayName: 'Type',
                            enableHiding: false,
                            sortingAlgorithm: commonService.getSortByString
                        },
                        
                        {
                            field: 'Actions',
                            cellTemplate: '<div class="ui-grid-cell-contents">' +
                                '<button type="button" ' +
                                'class="btn btn-xs btn-primary cellBtn"' +
                                ' ng-click="grid.appScope.viewDeltaLinkEntry(row)" title="View">' +
                                '  <i class="fa fa-eye"></i></button></div> ',
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
                    let meterID = "null";
                    deviceService.fetchspecificmetertoDeltaLinkList($scope.searchTerm,pageNum,limit,meterID)
                        .then(function (apiData) {
                            if (!angular.isUndefinedOrNull(apiData) && apiData.type) {
                                deltaLinkData.length = 0;
                                $scope.pagination.currentTotalItems = apiData.DeltalinkDetailSelected.results.length;
                                $scope.pagination.apiCurrentPage = pageNum;
                                $scope.pagination.totalRecordsInDBCount = apiData.DeltalinkDetailSelected.totalRecords;
                                $scope.pagination.totalTablePages = Math.ceil($scope.pagination.totalRecordsInDBCount / $scope.pagination.currentTablePaginationSize);

                                $scope.changeBtnStatus();
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
                                    objToInsert["DeltalinkID"] = apiData[i].DeltalinkID;
                                    objToInsert["IsMaster"] = (apiData[i].IsMaster ? 'Master' : 'Slave');
                                    deltaLinkData.push(objToInsert);
                                }
                                $scope.deltaLinkGrid.data = deltaLinkData;
                            } else if (apiData.type == false) {
                                $scope.disableNxtBtn = true;
                                $scope.disablePrvBtn = true;
                                $scope.disableFirstBtn = true;
                                $scope.disableLastBtn = true;
                                $scope.pagination.totalRecordsInDBCount = 0;
                                $scope.pagination.totalTablePages = 1;
                                $rootScope.commonMsg = "No data found!";
                            } else {
                                $rootScope.commonMsg = "";
                            }
                        });
                }

                $scope.changeBtnStatus = function () {
                    if ($scope.pagination.currentTablePage === 1) {
                        if ($scope.pagination.currentTablePage === 1 && $scope.pagination.currentTablePage === $scope.pagination.totalTablePages) {
                            $scope.disableNxtBtn = true;
                            $scope.disablePrvBtn = true;
                            $scope.disableFirstBtn = true;
                            $scope.disableLastBtn = true;
                        } else if ($scope.pagination.currentTablePage === 1 && $scope.pagination.currentTablePage < $scope.pagination.totalTablePages) {
                            $scope.disableNxtBtn = false;
                            $scope.disablePrvBtn = true;
                            $scope.disableFirstBtn = true;
                            $scope.disableLastBtn = false;
                        } else if ($scope.pagination.currentTablePage === 1 && $scope.pagination.currentTablePage > $scope.pagination.totalTablePages) {
                        }
                    } else if ($scope.pagination.currentTablePage > 1) {
                        if ($scope.pagination.currentTablePage > 1 && $scope.pagination.currentTablePage === $scope.pagination.totalTablePages) {
                            $scope.disableNxtBtn = true;
                            $scope.disablePrvBtn = false;
                            $scope.disableFirstBtn = false;
                            $scope.disableLastBtn = true;

                        } else if ($scope.pagination.currentTablePage > 1 && $scope.pagination.currentTablePage < $scope.pagination.totalTablePages) {
                            $scope.disableNxtBtn = false;
                            $scope.disablePrvBtn = false;
                            $scope.disableFirstBtn = false;
                            $scope.disableLastBtn = false;

                        } else if ($scope.pagination.currentTablePage > 1 && $scope.pagination.currentTablePage > $scope.pagination.totalTablePages) {
                            $scope.disableNxtBtn = true;
                            $scope.disablePrvBtn = false;
                            $scope.disableFirstBtn = false;
                            $scope.disableLastBtn = true;
                        }
                    } else {
                        console.log('else')
                    }
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
                $scope.searchGrid = function (searchTerm) {
                       if(searchTerm) {
                           $scope.searchTerm = searchTerm;
                           $scope.pagination.currentTablePage = 1;
                           $scope.initializeDeltaLinkTable($scope.pagination.currentTablePage, $scope.pagination.currentTablePaginationSize);
                       } else {
                           $scope.searchTerm = '';
                           $scope.initializeDeltaLinkTable($scope.pagination.currentTablePage, $scope.pagination.currentTablePaginationSize);
                       }
                       angular.element(document.querySelector("div.ui-grid-selection-row-header-buttons")).removeClass("ui-grid-all-selected");
                       $scope.mySelectedRows.length = 0;
                   };

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
                    modalInstance = $uibModal.open({
                        templateUrl: '/templates/viewDeltaLinkEntry.html',
                        controller: 'viewDeltaLinkCtrl',
                        size: 'lg',
                        backdrop: 'static',
                        keyboard: true
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
                                for (var i = 0; i < $scope.mySelectedRows.length; i++) {
                                    selectedDeltaLinks.push($scope.mySelectedRows[i].DeltalinkID);
                                }
                            }
                            deviceService.deleteDeltaLinks(selectedDeltaLinks)
                                .then(function (objData) {
                                    swal(objData);
                                    $scope.mySelectedRows.length = 0;
                                    $scope.initializeDeltaLinkTable($scope.pagination.apiCurrentPage, currentDefaultTablePageSize);
                                    $scope.searchterm = "";
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
                    }, function () {
                        $scope.mySelectedRows.length = 0;
                        $scope.initializeDeltaLinkTable($scope.pagination.apiCurrentPage, currentDefaultTablePageSize);
                    });
                    $scope.dynamicPopover.isOpen = false;
                };

                 /**
                 * @description
                  * Assigns a deltalink to a meter
                 *
                 * @param Nil
                 * @return Nil
                
                 */
                $scope.assignDeltalinkToMeter = function () {
                    var pageNum = 1;
                    var limit = 15;
                    var selectedDeltalink = [];
                    for (var i = 0; i < $scope.gridApi.selection.getSelectedRows().length; i++) {
                        selectedDeltalink.push($scope.gridApi.selection.getSelectedRows()[i].DeltalinkID);
                    }
                    let selectedMeterdata = $sessionStorage.get('selectedMeter');
                    deviceService.fetchspecificmetertoDeltaLinkList($scope.searchTerm,pageNum,limit, selectedMeterdata)
                    .then(function (objData) {
                        if(objData.DeltalinkDetailSelected != undefined){
                        let records = objData.DeltalinkDetailSelected.totalRecords;
                        if(records == 2){
                            swal({
                                html: true,
                                title: "This meter is already linked with two DeltaLINK&trade;!!",
                                showCancelButton: false,
                                cancelButtonText: "Cancel",
                                cancelButtonColor: 'white',
                            })
                        }else if(records < selectedDeltalink.length ){
                            swal({
                                html: true,
                                title: "More than two DeltaLINK&trade; Linking is not allowed!!",
                                showCancelButton: false,
                                cancelButtonText: "Cancel",
                                cancelButtonColor: 'white',
                            })
                        }else if (selectedDeltalink.length > 0) {
                                swal({
                                    html: true,
                                    title: "Link DeltaLINK&trade;",
                                    text: "Do you really want to link DeltaLINK&trade; to this Meter ?",
                                    showCancelButton: true,
                                    confirmButtonColor: 'black',
                                    confirmButtonText: 'Link',
                                    cancelButtonText: "Cancel",
                                    cancelButtonColor: 'white',
                                }, function (isConfirm) {
                                    if (isConfirm) {
                                            deviceMappingService
                                            .addDeltalinkToMeter($sessionStorage.get('selectedMeter'), selectedDeltalink)
                                            .then(function (objData) {
                                                swal(commonService.addTrademark(objData));
                                                $scope.pagination.currentTablePage = 1;
                                                init();
                                                $scope.searchterm = "";
                                            });
                                    }
                                });
                            }                           
                            
                            else {
                                swal({
                                    html: true,
                                    title: 'Warning',
                                    text: 'Please select a DeltaLINK&trade; to map',
                                    type: "warning"
                                });
                            }
                    }else{
                        if (selectedDeltalink.length <=2 ) {
                            if (selectedDeltalink.length > 0) {
                                swal({
                                    html: true,
                                    title: "Link DeltaLINK&trade;",
                                    text: "Do you really want to link DeltaLINK&trade; to this Meter ?",
                                    showCancelButton: true,
                                    confirmButtonColor: 'black',
                                    confirmButtonText: 'Link',
                                    cancelButtonText: "Cancel",
                                    cancelButtonColor: 'white',
                                }, function (isConfirm) {
                                    if (isConfirm) {
                                            deviceMappingService
                                            .addDeltalinkToMeter($sessionStorage.get('selectedMeter'), selectedDeltalink)
                                            .then(function (objData) {
                                                swal(commonService.addTrademark(objData));
                                                $scope.pagination.currentTablePage = 1;
                                                init();
                                                $scope.searchterm = "";
                                            });
                                    }
                                });
                            }                           
                            
                            else {
                                swal({
                                    html: true,
                                    title: 'Warning',
                                    text: 'Please select a DeltaLINK&trade; to map',
                                    type: "warning"
                                });
                            }
                        }else{
                            swal({
                                html: true,
                                title: "You can not add more than two DeltaLINK&trade;!!",
                                showCancelButton: false,
                                showConfirmButton: true,
                                confirmButtonColor: 'black',
                                confirmButtonText: 'OK',
                                cancelButtonColor: 'white',
                                allowEscapeKey : false,
                                allowOutsideClick: false
                            })
                        } 
                    }
                    });
                };
                $scope.searchMeterGrouping = 'all';

               
                    
                    /**
                 *  @description
                 * Go back to the parent meterDeltalink
                 *
                 * @param Nil
                 * @return Nil
                 
                 */
                $scope.goBack = function () {
                    $state.go('system.meterDeltalink');
                };
                $scope.$on('$destroy', function () {
                    $templateCache.put('ui-grid/pagination', commonService.setDefaultTable());
                });
                }]);
})(window.angular);