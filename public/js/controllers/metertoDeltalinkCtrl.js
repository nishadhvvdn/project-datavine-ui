

/**
 * @description
 * Controller for Meter Registration
 */
(function (angular) {
    "use strict";
    angular.module('dataVINEApp').controller('metertoDeltalinkCtrl',
        ["$scope","$uibModal", "$state", "$rootScope", '$filter',
        '$timeout', 'DeviceService', 'ParseService', 'refreshservice',
        'commonService', '$templateCache','DeviceMappingService', '$sessionStorage',
            function ($scope, $uibModal, $state, $rootScope, $filter, $timeout, deviceService, parseService, refreshservice, commonService, $templateCache,deviceMappingService,$sessionStorage) {
                let currentDefaultTablePageSize = objCacheDetails.grid.paginationPageSize;
                $scope.meterData = $sessionStorage.get('selectedMeterDetails');
                var arrMeterData = [];
                let deltaLinkData = [];
                var modalInstance = null;
                $scope.isSelected = false;
                $scope.mySelectedRows = [];
                $scope.searchTerm = '';
                var vm = this;
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
                //init();

                   /**
                 * Initializes the controller data
                 */
                function init() {
                    var pageNum = 1;
                    var limit = 15;
                    $scope.datagridMessage = 'Loading';
                    arrMeterData = [];
                    var insertData = [];
                    $scope.searchTerm = "";
                    if (!$sessionStorage.get('selectedMeter')) {
                        $state.go('system.registration.meterEntry');
                    } else {
                        deviceService.fetchspecificmetertoDeltaLinkList($scope.searchTerm,pageNum,limit,$sessionStorage.get('selectedMeter'))
                            .then(function (objData) {
                                if(objData.DeltalinkDetailSelected){
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
                                    insertData.push(objToInsert);
                                }
                                $scope.deltaLinkGrid.data = insertData;
                                if(insertData.length >= 2){
                                    document.getElementById("findDeltalinkbutton").style.visibility = "hidden";
                                }else{
                                    document.getElementById("findDeltalinkbutton").style.visibility = "visible";
                                }
                            }else if (objData.type == false) {
                                $scope.deltaLinkGrid.data = insertData;
                                $rootScope.commonMsg = 'No data found!';
                                document.getElementById("findDeltalinkbutton").style.visibility = "visible";
                            }else {
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
                                '  <i class="fa fa-eye"></i></button>| &nbsp ' +
                                ' <button class="btn btn-xs btn-primary cellBtn" ' +
                                ' ng-click="grid.appScope.removeSpeificDeltalink(row,\'single\')" title="Unlink DeltaLINK\u2122">' +
                                ' <i class="fa fa-times" aria-hidden="true">' +
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
               
                //list of only grouped deltalinkl
                function initDeltaLinkList(pageNum, limit) {
                    deviceService.fetchspecificmetertoDeltaLinkList($scope.searchTerm,pageNum, limit, $sessionStorage.get('selectedMeter'))
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
                                    if( apiData[i].MeterID == $sessionStorage.get('selectedMeter')){
                                        deltaLinkData.push(objToInsert);
                                    }
                                    // a meter can not grouped with ore than two deltalink
                                    if((deltaLinkData.length) >= 2){
                                        document.getElementById("findDeltalinkbutton").style.visibility = "hidden";
                                    }
                                }
                                $scope.deltaLinkGrid.data = deltaLinkData;
                            } else if (apiData.type == false) {
                                $scope.disableNxtBtn = true;
                                $scope.disablePrvBtn = true;
                                $scope.disableFirstBtn = true;
                                $scope.disableLastBtn = true;
                                $scope.pagination.totalRecordsInDBCount = 0;
                                $scope.pagination.totalTablePages = 1;
                                $rootScope.commonMsg = 'No data found!';
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
                                    //$scope.initializeDeltaLinkTable($scope.pagination.apiCurrentPage, currentDefaultTablePageSize);
                                    $scope.searchterm = "";
                                });
                        }
                    });
                };
                /**For unlink  a single delta link from meter  */
                $scope.removeSpeificDeltalink = function (row,type) {
                    var selectedDeltalink = [];
                    if (type === 'single') {
                        selectedDeltalink = [row.entity.DeltalinkID];
                    }
                    swal({
                        html: true,
                        title: "Unlink DeltaLINK&trade;",
                        text: "Do you really want to Unlink the device?",
                        showCancelButton: true,
                        confirmButtonColor: 'black',
                        confirmButtonText: 'Unlink',
                        cancelButtonText: "Cancel",
                        cancelButtonColor: 'white',
                        title: "Unlink DeltaLINK&trade;",
                        text: "Do you really want to Unlink the device?",
                        showCancelButton: true,
                        confirmButtonColor: 'black',
                        confirmButtonText: 'Unlink',
                        cancelButtonText: "Cancel",
                        cancelButtonColor: 'white',
                    }, function (isConfirm) {
                        if (isConfirm) {
                            deviceService
                                .removeDeltalinkFromMeter(
                                    $sessionStorage.get('selectedMeter'),
                                    selectedDeltalink
                                ).then(function (objData) {
                                    swal(commonService.addTrademark(objData));
                                    //$state.go('system.registration.meterEntry');
                                    init();
                                    angular.element(document.querySelector("div.ui-grid-selection-row-header-buttons")).removeClass("ui-grid-all-selected");
                                    $scope.searchterm = "";
                                });
                        }
                    })
                }
                        /**
                 * Control for deleting the set of selected meters from the UI grid
                 */
                $scope.removeSelectedDeltalink = function () {
                    var selectedDeltalink = [];
                    // var selectedDeltalink = {};
                    var selectedRows = $scope.gridApi.selection.getSelectedRows();
                    for (var i = 0; i < selectedRows.length; i++) {
                        selectedDeltalink.push($scope.gridApi.selection.getSelectedRows()[i].DeltalinkID);
                        // selectedMeters.push($scope.gridApi.selection.getSelectedRows()[i].DeltalinkID);
                    }
                    if (Object.keys(selectedDeltalink).length > 0) {
                        swal({
                            html: true,
                            title: "Unlink DeltaLINK&trade;",
                            text: "Do you really want to Unlink the device?",
                            showCancelButton: true,
                            confirmButtonColor: 'black',
                            confirmButtonText: 'Unlink',
                            cancelButtonText: "Cancel",
                            cancelButtonColor: 'white',
                        }, function (isConfirm) {
                            if (isConfirm) {
                                deviceService
                                    .removeDeltalinkFromMeter(
                                        $sessionStorage.get('selectedMeter'),
                                        selectedDeltalink
                                    ).then(function (objData) {
                                        swal(commonService.addTrademark(objData));
                                        //$state.go('system.registration.meterEntry');
                                        init();
                                        angular.element(document.querySelector("div.ui-grid-selection-row-header-buttons")).removeClass("ui-grid-all-selected");
                                        $scope.searchterm = "";
                                    });
                            }
                        })
                    } else {
                        swal({
                            html: true,
                            title: 'Warning',
                            text: 'Please select a DeltaLINK&trade; to Unlink',
                            type: "warning"
                        });
                    }
                };

                /**
                 * Route back to the Unassigned deltalink state
                 */
                $scope.openNewDeltalinkConfiguration = function () {
                    $state.go('system.unassignedDeltaLink');
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

                $scope.createOrEditDeltaLink = function (type, row) {
                    objCacheDetails.data.deltaLinkData = (type === 'edit') ? angular.copy(row.entity) : {};
                    console.log('sender', objCacheDetails.data.deltaLinkData);
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
                        $scope.searchterm = "";
                        $scope.initializeDeltaLinkTable($scope.pagination.apiCurrentPage, currentDefaultTablePageSize);
                    }, function () {
                        $scope.mySelectedRows.length = 0;
                        $scope.searchterm = "";
                        $scope.initializeDeltaLinkTable($scope.pagination.apiCurrentPage, currentDefaultTablePageSize);
                    });
                };

                

              
                $scope.goToURL = function () {
                    $state.go('system.registration.meterEntry');
                }
                $scope.$on('$destroy', function () {
                    $templateCache.put('ui-grid/pagination', commonService.setDefaultTable());
                });
            }]);
})(window.angular);
