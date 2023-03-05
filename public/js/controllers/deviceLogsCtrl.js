/**
 * @this vm
 * @ngdoc controller
 * @name dataVINEApp.controller:deviceLogsCtrl
 *
 * @description
 * Controller for device logs
 */
(function (angular) {
    "use strict";
    angular.module('dataVINEApp').controller('deviceLogsCtrl',
        ["$scope", "$uibModal", "$state", "$rootScope","commonService","SystemManagementService","$sessionStorage", "deviceType","DeviceService","$templateCache", "$timeout",
            function ($scope, $uibModal, $state, $rootScope,commonService, SystemManagementService,$sessionStorage, deviceType, deviceService, $templateCache, $timeout) {
                let deviceID = $sessionStorage.get('selectedDeviceForLogs');
                $scope.deviceInfo = $sessionStorage.get('selectedDeviceForLogsIsRegistered');

                $scope.mySelectedRows = [];
                let userTimeZone = angular.isUndefinedOrNull(objCacheDetails.userDetails) ? undefined : objCacheDetails.userDetails.timeZone;
                let currentDefaultTablePageSize = objCacheDetails.grid.paginationPageSize;
                let logsData = [];
                let moveToPrevUrl = {
                    hypersprout: 'system.deviceManagement.relays',
                    hyperhub: 'system.deviceManagement.hyperhub',
                    meter: 'system.deviceManagement.meters',
                    deltalink: 'system.deviceManagement.deltaLink'
                };
                let logs_verbosity = {
                    "info": true,
                    "warning": true,
                    "error": true,
                    "debug": false
                };
                let getParsedValue = {
                    meter: "Meter",
                    hyperhub: "HyperHub",
                    hypersprout: "HyperSprout",
                    deltalink: "DeltaLink"
                }
                $scope.activeDeviceType = commonService.addTrademark(getParsedValue[deviceType]);
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
                let modalInstance = null;
                let modalInstanceNested = null;

                $scope.initializeTable = function(pageNum) {
                    $scope.logsGrid = angular.copy(objCacheDetails.grid);
                    $scope.logsGrid.data = [];
                    $scope.logsGrid.exporterPdfOrientation = 'landscape';
                    $scope.logsGrid.exporterPdfMaxGridWidth = 640;
                    $scope.logsGrid.exporterCsvFilename = 'file.csv';
                    $scope.logsGrid.columnDefs = [
                        {field: 'Name', enableHiding: false},
                        {field: 'Date and Time', enableHiding: false},
                        {field: 'Link', visible: false},
                        {
                            field: 'Actions',
                            cellTemplate: '<div class="ui-grid-cell-contents"><button type="button" ' +
                                'class="btn btn-xs btn-primary cellBtn" ' +
                                'ng-click="grid.appScope.downloadLogs(row)" title="Download">  ' +
                                '<i class="fa fa-download" aria-hidden="true"></i></button>' +
                                '|&nbsp <button type="button" class="btn btn-xs ' +
                                'btn-primary cellBtn" ng-click="grid.appScope.deleteSelectedLogs(row,\'single\')" title="Delete">' +
                                ' <i class="fa fa-trash-o" aria-hidden="true"></i>' +
                                '</button>' +
                                '</div>',
                            enableColumnMenu: false, enableSorting: false, enableHiding: false, width: 150
                        }
                    ];
                    $scope.logsGrid.exporterSuppressColumns = ['Actions'];
                    $scope.logsGrid.onRegisterApi = function (gridApi) {
                        $scope.gridApi = gridApi;
                        commonService.getGridApi($scope, gridApi);
                        gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {
                            $scope.pagination.currentTablePaginationSize = pageSize;
                            $scope.pagination.totalTablePages = Math.ceil($scope.pagination.currentTotalItems / pageSize);
                            pageNum = 1;
                            $scope.pagination.currentTablePage = 1;
                            initDeviceLogs(deviceID,deviceType, pageNum, $scope.pagination.currentTablePaginationSize);
                        });
                    };

                    initDeviceLogs(deviceID,deviceType, pageNum, $scope.pagination.currentTablePaginationSize);

                    $templateCache.put('ui-grid/pagination', commonService.getModifiedTable());
                }

                $scope.initializeTable($scope.pagination.apiCurrentPage, currentDefaultTablePageSize);

                function initDeviceLogs(deviceID, deviceType, pageNum, limit) {
                    logsData.length = 0;
                    deviceService.getLogsDetails(deviceID, getParsedValue[deviceType], pageNum, limit)
                        .then(function (apiData) {
                            if (!angular.isUndefinedOrNull(apiData) && apiData.type) {
                                $scope.pagination.currentTotalItems = apiData.DeviceLogLists.results.length;
                                $scope.pagination.apiCurrentPage = pageNum;
                                $scope.pagination.totalRecordsInDBCount = apiData.DeviceLogLists.totalRecords;
                                $scope.pagination.totalTablePages = Math.ceil($scope.pagination.totalRecordsInDBCount / $scope.pagination.currentTablePaginationSize);

                                let btnFlags = commonService.getBtnStatus($scope.pagination.currentTablePage, $scope.pagination.totalTablePages);
                                $scope.disableNxtBtn = btnFlags.disableNxtBtn;
                                $scope.disablePrvBtn = btnFlags.disablePrvBtn;
                                $scope.disableFirstBtn = btnFlags.disableFirstBtn;
                                $scope.disableLastBtn = btnFlags.disableLastBtn;

                                apiData = apiData.DeviceLogLists.results;
                                for (var i = 0; i < apiData.length; i++) {
                                    let objToInsert = {};
                                    objToInsert["Name"] = apiData[i].FileName;
                                    objToInsert["Link"] = apiData[i].Url;
                                    objToInsert["Date and Time"] = moment.tz(apiData[i].CreatedDate, userTimeZone).format('YYYY-MM-DD HH:mm:ss');
                                    objToInsert["LogID"] = apiData[i].LogID;
                                    logsData.push(objToInsert);
                                }
                                $scope.logsGrid.data = logsData;
                            } else if(apiData.type == false) {
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
                            deviceService.deleteDeviceLogs('DeleteDeviceLogsDetails',getParsedValue[deviceType], deviceID, selectedLogsFiles)
                                .then(function (objData) {
                                    swal({
                                        title: objData
                                    }, function (isConfirm) {
                                        $scope.mySelectedRows.length = 0;
                                        $scope.initializeTable($scope.pagination.apiCurrentPage, currentDefaultTablePageSize);
                                    });
                            });
                        } else {
                            $scope.mySelectedRows.length = 0;
                            $scope.initializeTable($scope.pagination.apiCurrentPage, currentDefaultTablePageSize);
                        }
                    });
                };

                $scope.nxtPageBtnClick = function () {
                    if($scope.pagination.currentTablePage < $scope.pagination.totalTablePages && $scope.pagination.totalTablePages > 0) {
                        let nextAPIPage = ++$scope.pagination.currentTablePage;
                        $scope.disablePrvBtn = false;
                        $scope.initializeTable(nextAPIPage, $scope.pagination.currentTablePaginationSize);
                    } else {
                        $scope.disableNxtBtn = true;
                        $scope.disablePrvBtn = false;
                        $scope.disableLastBtn = true;
                    }
                }

                $scope.prvPageBtnClick = function () {
                    if($scope.pagination.currentTablePage > 1 && $scope.pagination.currentTablePage <= $scope.pagination.totalTablePages) {
                            let prevAPIPage = --$scope.pagination.currentTablePage;
                            $scope.disableNxtBtn = false;
                            $scope.initializeTable(prevAPIPage, $scope.pagination.currentTablePaginationSize);
                    } else {
                        {
                            $scope.disablePrvBtn = true;
                            $scope.disableNxtBtn = false;
                            $scope.disableFirstBtn = true;
                        }
                    }

                }

                $scope.firstPageBtnClick = function () {
                    if($scope.pagination.currentTablePage > 1 && $scope.pagination.currentTablePage <= $scope.pagination.totalTablePages) {
                        $scope.pagination.currentTablePage = 1;
                        let firstPage = 1;
                        $scope.disableNxtBtn = false;
                        $scope.disableFirstBtn = true;
                        $scope.initializeTable(firstPage, $scope.pagination.currentTablePaginationSize);
                    } else {
                        {
                            $scope.disablePrvBtn = true;
                            $scope.disableNxtBtn = false;
                        }
                    }
                }

                $scope.lastPageBtnClick = function () {
                    if($scope.pagination.currentTablePage >= 1 && $scope.pagination.currentTablePage <= $scope.pagination.totalTablePages) {
                        $scope.pagination.currentTablePage = $scope.pagination.totalTablePages;
                        let lastPage = $scope.pagination.totalTablePages;
                        $scope.disableNxtBtn = false;
                        $scope.disableLastBtnBtn = true;
                        $scope.initializeTable(lastPage, $scope.pagination.currentTablePaginationSize);
                    } else {
                        {
                            $scope.disablePrvBtn = true;
                            $scope.disableNxtBtn = false;
                        }
                    }
                }

                $scope.downloadLogs = function (row) {
                    if(row.entity.Link) {
                        window.open(row.entity.Link, "_blank");
                    } else {
                        swal({
                                title: "File link is not valid!", text: "",
                                showCancelButton: false,
                                showConfirmButton: true,
                                confirmButtonColor: 'black',
                                confirmButtonText: 'OK',
                                cancelButtonColor: 'white',
                                allowEscapeKey : false,
                                allowOutsideClick: false
                            }
                        );
                    }
                };

                $scope.setLogsVerbosity = function () {
                    $uibModal.open({
                        templateUrl: 'templates/editLogsVerbosity.html',
                        controller: 'editLogsVerbosityCtrl',
                        size: 'sm',
                        backdrop: 'static',
                        title: 'log Verbosity',
                        windowClass: 'centermodal',
                        keyboard: true,
                        resolve: {
                            deviceType: function () {
                                return deviceType;
                            },
                            logs_verbosity : function () {
                                return logs_verbosity;
                            }
                        }
                    }).result.then( function () {
                        console.log('B');
                    });
                }

                $scope.clearDeviceLog = function () {
                    swal({
                        title: "Clear Device Log",
                        text: "Are you sure to clear the log?",
                        showCancelButton: true,
                        confirmButtonColor: 'black',
                        confirmButtonText: 'Yes',
                        cancelButtonText: "No",
                        cancelButtonColor: 'white',
                    }, function (isConfirm) {
                        if (isConfirm) {
                            modalInstance = deviceService.openModalForLogs('Device Clear log in Process...', false);
                            deviceService.clearDeviceLogs('ClearLogs',getParsedValue[deviceType], deviceID)
                                .then(function (objData) {
                                    modalInstance.dismiss();
                                    if(objData && objData.type) {
                                        modalInstance.close();
                                        modalInstanceNested = deviceService.openModalForLogs(objData.Message, true);
                                        modalInstanceNested.result.then(function () {
                                            $state.reload();
                                        });
                                    } else {
                                        swal({
                                            title: objData.Message
                                        }, function () {
                                            $scope.mySelectedRows.length = 0;
                                            $scope.initializeTable($scope.pagination.apiCurrentPage, currentDefaultTablePageSize);
                                        });
                                    }
                                });
                        } else {
                            console.log('cancel');
                        }
                    });
                }

                $scope.fetchLogs = function () {
                    swal({
                        title: "Fetch Device Logs",
                        text: "Do you want to download the Device Logs?",
                        showCancelButton: true,
                        confirmButtonColor: 'black',
                        confirmButtonText: 'Yes',
                        cancelButtonText: "No",
                        cancelButtonColor: 'white',
                    }, function (isConfirm) {
                        if (isConfirm) {
                            modalInstance = deviceService.openModalForLogs('Device Log Fetch in Process...', false);
                            deviceService.fetchDeviceLogs('FetchDeviceLog',getParsedValue[deviceType], deviceID)
                                .then(function (objData) {
                                    modalInstance.dismiss();
                                        if(objData && objData.type) {
                                                modalInstance.close();
                                                modalInstanceNested = deviceService.openModalForLogs(objData.Message, true);
                                                modalInstanceNested.result.then(function () {
                                                    $state.reload();
                                                });
                                        } else {
                                            swal({
                                                title: objData.Message
                                            }, function () {
                                                $scope.mySelectedRows.length = 0;
                                                $scope.initializeTable($scope.pagination.apiCurrentPage, currentDefaultTablePageSize);
                                            });
                                        }
                                });
                        }
                    });
                }


                $scope.goToDeviceManagement = function () {
                    $state.go(moveToPrevUrl[deviceType]);
                }

                $scope.printCart = function () {
                    window.print();
                };

                $scope.$on('$destroy', function () {
                    $templateCache.put('ui-grid/pagination', commonService.setDefaultTable());
                });

            }]);
})(window.angular);
