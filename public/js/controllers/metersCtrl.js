/**
 * @description
 * Controller for Meters Management
 */
(function (angular) {
    "use strict";
    angular.module('dataVINEApp').controller('metersCtrl',
        ['$scope', '$rootScope', '$uibModal', '$timeout',
            'SystemManagementService', '$filter',
            'commonService', '$sessionStorage', '$state', 'refreshservice','$templateCache',
            function ($scope, $rootScope, $uibModal,
                      $timeout, systemManagementService,
                      $filter, commonService, $sessionStorage, $state, refreshservice,$templateCache) {
                var userTimeZone = angular.isUndefinedOrNull(objCacheDetails.userDetails) ? undefined : objCacheDetails.userDetails.timeZone;
                let currentDefaultTablePageSize = objCacheDetails.grid.paginationPageSize;
                var arrData = [];
                var filterData = [];
                $scope.isSelected = false;
                $scope.mySelectedRows = [];
                var vm = this;
                $scope.isCollapsed = false;
                $scope.datatableMessage = 'Loading';
                $scope.searchObj = {};
                $scope.searchObj.searchParam = 'all';
                $scope.searchType = '';
                $scope.meterOptions = {};
                $scope.seachitem = '';
                $scope.meterDetails = {};
                $scope.meterDetails.meterCheckbox = false;
                $scope.dynamicPopover = {
                    templateUrl: '/templates/meterSettings.html',
                    content: '',
                    open: function () {
                        $scope.dynamicPopover.isOpen = true;
                    },
                    close: function () {
                        $scope.dynamicPopover.isOpen = false;
                    }
                };
                $scope.deviceTypeForAPI = '&IsRegistered=true';

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
                let modalInstanceNested = null;
                
                $scope.initializeMeterTable = function (pageNum) {
                    $scope.meterOptions = angular.copy(objCacheDetails.grid);
                    $scope.meterOptions.data = [];
                    $scope.meterOptions.exporterPdfOrientation = 'landscape';
                    $scope.meterOptions.exporterPdfMaxGridWidth = 640;
                    $scope.meterOptions.exporterCsvFilename = 'file.csv';
                    $scope.meterOptions.columnDefs =[
                        {
                            field: 'SerialNumber',
                            type: 'number',
                            cellTemplate: '<div class="ui-grid-cell-contents">' +
                                '<a class="anchorUIGrid" ' +
                                'ng-click="grid.appScope.nameDetailsForMeter(row)">' +
                                '{{row.entity.SerialNumber}} </a> </div>',
                            enableHiding: false, width: 180
                        },
                        {field: 'DeviceID', type: 'number', displayName: 'Meter ID', enableHiding: false },
                        {field: 'Name', enableHiding: false},
                        {field: 'Hardware Version', enableHiding: false},
                        {field: 'Registered', enableHiding: false},
                        {
                            field: 'Action',
                            cellTemplate: '<div class="ui-grid-cell-contents">' +
                                '<button ng-if=row.entity.Registered===\'Yes\' type="button" class="btn btn-xs btn-primary cellBtn"' +
                                ' ng-click="grid.appScope.lockUnlockDeviceUI(row)" title="Lock/Unlock Device">' +
                                ' <i class="fa" ng-class="(row.entity.DeviceUIStatus===1)? \'fa-lock\' : \'fa-unlock\'"></i>' +
                                '</button> <span ng-if=row.entity.Registered===\'Yes\'> | </span> ' +
                                '<button ng-if=row.entity.Registered===\'Yes\' type="button" class="btn btn-xs btn-primary cellBtn imgactionBtn" ' +
                                'ng-click="grid.appScope.deviceFactoryReset(row)" title="Factory Reset">  ' +
                                '<img alt="#" src="../assets/images/reset.png" /></button> <span ng-if=row.entity.Registered===\'Yes\'> | </span> ' +
                                '<button type="button" class="btn btn-xs btn-primary cellBtn" ' +
                                'ng-click="grid.appScope.viewMeterLogs(row)" title="Device Logs">  ' +
                                '<i class="fa fa-file-text-o" aria-hidden="true"></i></button> <span ng-if=row.entity.Registered===\'Yes\'> | </span> ' +
                                '<button ng-if=row.entity.Registered===\'Yes\' class="btn btn-xs btn-primary cellBtn imgactionBtn"' +
                                'ng-click="grid.appScope.deviceReboot(row)" title="Reboot"> ' +
                                '<img alt="#" src="../assets/images/reboot.png" /></button>' +
                                '</div>',
                            enableColumnMenu: false,
                            enableHiding: false, width: 150
                        }
                    ]
                    $scope.meterOptions.exporterSuppressColumns = ['Actions'];
                    $scope.meterOptions.onRegisterApi = function (gridApi) {
                        $scope.gridApi = gridApi;
                        // commonService.getGridApi($scope, gridApi);
                        gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {
                            $scope.pagination.currentTablePaginationSize = pageSize;
                            $scope.pagination.totalTablePages = Math.ceil($scope.pagination.currentTotalItems / pageSize);
                            pageNum = 1;
                            $scope.pagination.currentTablePage = 1;
                            initMeterList(pageNum, $scope.pagination.currentTablePaginationSize);
                        });
                    };

                    initMeterList(pageNum, $scope.pagination.currentTablePaginationSize);

                    $templateCache.put('ui-grid/pagination', commonService.getModifiedTable());
                }
                $scope.initializeMeterTable($scope.pagination.apiCurrentPage, currentDefaultTablePageSize);
                function initMeterList(pageNum, limit) {
                    arrData = [];
                    systemManagementService.getSMMeterDetails('All',$scope.seachitem, pageNum, limit, $scope.deviceTypeForAPI, $scope.searchObj.searchParam)
                        .then(function (apiData) {
                            if (!angular.isUndefinedOrNull(apiData) && apiData.type) {
                                arrData.length = 0;
                                $scope.pagination.currentTotalItems = apiData.details.results.length;
                                $scope.pagination.apiCurrentPage = pageNum;
                                $scope.pagination.totalRecordsInDBCount = apiData.details.totalRecords;
                                $scope.pagination.totalTablePages = Math.ceil($scope.pagination.totalRecordsInDBCount / $scope.pagination.currentTablePaginationSize);

                                let btnFlags = commonService.getBtnStatus($scope.pagination.currentTablePage, $scope.pagination.totalTablePages);
                                $scope.disableNxtBtn = btnFlags.disableNxtBtn;
                                $scope.disablePrvBtn = btnFlags.disablePrvBtn;
                                $scope.disableFirstBtn = btnFlags.disableFirstBtn;
                                $scope.disableLastBtn = btnFlags.disableLastBtn;

                                apiData = apiData.details.results;
                                $rootScope.commonMsg = "";
                                for (var i = 0; i < apiData.length; i++) {
                                    let objToInsert = {};
                                    objToInsert["SerialNumber"] = apiData[i].MeterSerialNumber;
                                    objToInsert["Hardware Version"] =angular.isUndefinedOrNull(apiData[i].Meters_DeviceDetails) ? '' : apiData[i].Meters_DeviceDetails.MeterVersion;
                                    objToInsert["Registered"] =
                                            apiData[i].Status === "NotRegistered" ? "No" : "Yes";
                                        objToInsert["CreatedTime"] = angular.isUndefinedOrNull(apiData[i].RegisteredTime) ? '' : moment
                                            .tz(apiData[i].RegisteredTime, userTimeZone).format('YYYY-MM-DD HH:mm:ss');
                                        objToInsert["MeterID"] =
                                            apiData[i].MeterID;
                                        objToInsert["DeviceID"] =
                                            apiData[i].MeterID;
                                        objToInsert["DeviceClassId"] =
                                            apiData[i].DeviceClass;
                                        objToInsert["DeviceUIStatus"] = angular.isUndefinedOrNull(
                                            apiData[i].device_lock) ? 0 : apiData[i].device_lock;
                                        objToInsert["ESN"] = angular
                                            .isUndefinedOrNull(
                                                apiData[i].Meters_DeviceDetails) ? '' : apiData[i].Meters_DeviceDetails.ESN;
                                        objToInsert["Name"] = angular
                                            .isUndefinedOrNull(
                                                apiData[i].Meters_DeviceDetails) ? '' : apiData[i].Meters_DeviceDetails.MeterMake;
                                        arrData.push(objToInsert);
                                }
                                $scope.meterOptions.data = arrData;
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
                $scope.checkValue = function () {
                    $scope.seachitem = "";
                    if ($scope.meterDetails.meterCheckbox) {
                        $scope.deviceTypeForAPI = '&IsRegistered=false&filter=NotRegistered';
                        $scope.pagination.currentTablePage = 1;
                        $scope.initializeMeterTable(1, $scope.pagination.currentTablePaginationSize);
                    } else {
                        $scope.deviceTypeForAPI = '&IsRegistered=true';
                        $scope.pagination.currentTablePage = 1;
                        $scope.initializeMeterTable(1, $scope.pagination.currentTablePaginationSize);
                    }
                    $scope.dynamicPopover.isOpen = false;
                };
                
                $scope.status = {
                    isopen: false
                };
                $scope.nxtPageBtnClick = function () {
                    if ($scope.pagination.currentTablePage < $scope.pagination.totalTablePages && $scope.pagination.totalTablePages > 0) {
                        let nextAPIPage = ++$scope.pagination.currentTablePage;
                        $scope.disablePrvBtn = false;
                        $scope.initializeMeterTable(nextAPIPage, $scope.pagination.currentTablePaginationSize);
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
                        $scope.initializeMeterTable(prevAPIPage, $scope.pagination.currentTablePaginationSize);
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
                        $scope.initializeMeterTable(firstPage, $scope.pagination.currentTablePaginationSize);
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
                        $scope.initializeMeterTable(lastPage, $scope.pagination.currentTablePaginationSize);
                    } else {
                        {
                            $scope.disablePrvBtn = true;
                            $scope.disableNxtBtn = false;
                        }
                    }
                }

                $scope.paginationBoxChanges = function () {
                    if ($scope.pagination.currentTablePage) {
                        $scope.initializeMeterTable($scope.pagination.currentTablePage, $scope.pagination.currentTablePaginationSize);
                    } else {
                        $scope.pagination.currentTablePage = 1;
                        $scope.initializeMeterTable($scope.pagination.currentTablePage, $scope.pagination.currentTablePaginationSize);
                    }
                }


                $scope.printCart = function () {
                    window.print();
                };

                $scope.toggleDropdown = function ($event) {
                    $event.preventDefault();
                    $event.stopPropagation();
                    $scope.status.isopen = !$scope.status.isopen;
                };
                //searching the data
                $scope.searchButtonClear = function (seachitem) {
                    if (seachitem == "") {
                        $scope.seachitem = '';
                        $scope.initializeMeterTable($scope.pagination.currentTablePage, $scope.pagination.currentTablePaginationSize);
                    }
                }
                /**
                * @description
                * Function to search data in grid
                *
                * @param seachitem
                * @return Nil

                */
                $scope.searchButton = function (seachitem) {
                    if (seachitem) {
                        $scope.seachitem = seachitem;
                        $scope.pagination.currentTablePage = 1;
                        $scope.initializeMeterTable($scope.pagination.currentTablePage, $scope.pagination.currentTablePaginationSize);
                    } else {
                        $scope.seachitem = '';
                        $scope.initializeMeterTable($scope.pagination.currentTablePage, $scope.pagination.currentTablePaginationSize);
                    }
                    angular.element(document.querySelector("div.ui-grid-selection-row-header-buttons")).removeClass("ui-grid-all-selected");
                    $scope.mySelectedRows.length = 0;
                };

                $scope.viewMeterLogs = function (row) {
                        objCacheDetails.data.selectedDeviceForLogs = row.entity.MeterID;
                        objCacheDetails.data.selectedDeviceForLogsIsRegistered = row.entity.Registered;
                        $sessionStorage.put('selectedDeviceForLogs', row.entity.MeterID);
                        $sessionStorage.put('selectedMeterDetails', row.entity);
                        $sessionStorage.put('selectedDeviceForLogsIsRegistered', { isRegistered: row.entity.Registered, serialNum : row.entity.SerialNumber });
                    $state.go('system.meterlogs');
                };

                /**
                 * @description
                 * Function to open pop-up to view details of realy
                 * @param rowData
                 * @return Nil
                 */
                $scope.nameDetailsForMeter = function (rowData) {
                    commonService.modalWindow(
                        '/templates/relayDetails.html',
                        'relayDetailsCtrl',
                        'Meter', rowData);
                };
                /**
                 * @description
                 * Function to open pop-up to view details of realy
                 *
                 * @param row
                 * @return Nil

                 */
                $scope.lockUnlockDeviceUI = function (row) {
                    commonService.confirmationModalWindow(
                        '/templates/lockUnLockUI.html',
                        'lockUnLockUICtrl',
                        'meter', row);
                };
                /**
                 * @description
                 * Function to open pop-up to view details of realy
                 *
                 * @param row
                 * @return Nil

                 */
                $scope.deviceReboot = function (row) {
                    commonService.confirmationModalWindow(
                        '/templates/deviceReboot.html',
                        'deviceRebootCtrl',
                        'meter', row);
                };
                /**
                 * @description
                 * Function to open pop-up to Device Reset
                 *
                 * @param row
                 * @return Nil

                 */
                $scope.deviceFactoryReset = function (row) {
                    commonService.confirmationModalWindow(
                        '/templates/deviceFactoryReset.html',
                        'deviceFactoryResetCtrl',
                        'Meter', row);
                };
            }]);
})(window.angular);
