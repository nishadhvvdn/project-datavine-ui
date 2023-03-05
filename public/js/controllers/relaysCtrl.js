/**
 * @description
 * Controller to handle Relay 
 */
(function (angular) {
    "use strict";
    angular.module('dataVINEApp').controller('relaysCtrl',
        ['$scope', '$rootScope', '$uibModal', '$timeout', 'SystemManagementService',
            '$filter', 'commonService', 'type', '$state', '$sessionStorage', 'refreshservice', '$templateCache',
            function ($scope, $rootScope, $uibModal,
                $timeout, systemManagementService,
                $filter, commonService, type, $state, $sessionStorage, refreshservice, $templateCache) {
                $scope.title = (type === 'HyperSprout') ? 'HyperSPROUT\u2122' : 'HyperHUB\u2122';
                $scope.deviceType = $scope.title === 'HyperSPROUT\u2122' ? 'hs' : 'hh';
                let currentDefaultTablePageSize = objCacheDetails.grid.paginationPageSize;
                var userTimeZone = angular.isUndefinedOrNull(objCacheDetails.userDetails) ? undefined : objCacheDetails.userDetails.timeZone;
                $scope.isSelected = false;
                $scope.mySelectedRows = [];
                var vm = this;
                $scope.isCollapsed = false;
                $scope.seachitem = '';
                $scope.relaysOptions = {};
                var arrData = [];
                $scope.relayDetails = {};
                $scope.relayDetails.relayCheckbox = false;
                $scope.searchObj = {};
                $scope.searchObj.searchParam = 'all'
                $scope.dynamicPopover = {
                    templateUrl: '/templates/relaySettings.html',
                    content: '',
                    open: function () {
                        $scope.dynamicPopover.isOpen = true;
                    },
                    close: function () {
                        $scope.dynamicPopover.isOpen = false;
                    }
                };
                $scope.deviceTypeForAPI = '';

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

                $scope.initializeHSTable = function (pageNum) {
                    $scope.relaysOptions = angular.copy(objCacheDetails.grid);
                    $scope.relaysOptions.data = [];
                    $scope.relaysOptions.exporterPdfOrientation = 'landscape';
                    $scope.relaysOptions.exporterPdfMaxGridWidth = 640;
                    $scope.relaysOptions.exporterCsvFilename = 'file.csv';
                    $scope.relaysOptions.columnDefs = [
                        { field: 'SerialNumber', cellTemplate: '<div class="ui-grid-cell-contents"><a class="anchorUIGrid" ng-click="grid.appScope.nameDetails(row)">{{row.entity.SerialNumber}} </a> </div>', enableHiding: false, width: 180 },
                        { field: 'DeviceID', type: 'number', displayName: $scope.title + ' ID', enableHiding: false },
                        { field: 'Name', enableHiding: false },
                        { field: 'Hardware Version', enableHiding: false },
                        { field: 'Registered', enableHiding: false },
                        { field: 'CreatedTime', enableHiding: false, visible: false },
                        { field: 'DeviceClassId', enableHiding: false, visible: false },
                        { field: 'DeviceUIStatus', enableHiding: false, visible: false },
                        { field: 'ESN', enableHiding: false, visible: false },
                        {
                            field: 'Action',
                            cellTemplate: '<div class="ui-grid-cell-contents"><button ng-if=row.entity.Registered===\'Yes\' type="button" class="btn btn-xs btn-primary cellBtn"' +
                                ' ng-click="grid.appScope.lockUnlockDeviceUI(row)" title="Lock/Unlock Device">' +
                                ' <i class="fa" ng-class="(row.entity.DeviceUIStatus===1)? \'fa-lock\' : \'fa-unlock\'" ></i>' +
                                '</button> <span ng-if=row.entity.Registered===\'Yes\'> | </span> ' +
                                '<button ng-if=row.entity.Registered===\'Yes\' type="button" class="btn btn-xs btn-primary cellBtn imgactionBtn" ' +
                                'ng-click="grid.appScope.deviceFactoryReset(row)" title="Factory Reset">  ' +
                                '<img alt="#" src="../assets/images/reset.png" /></button> <span ng-if=row.entity.Registered===\'Yes\'> | </span> ' +
                                '<button type="button" class="btn btn-xs btn-primary cellBtn" ' +
                                'ng-click="grid.appScope.viewDeviceLogs(row)" title="Device Logs">  ' +
                                '<i class="fa fa-file-text-o" aria-hidden="true"></i></button> <span ng-if=row.entity.Registered===\'Yes\'> | </span> ' +
                                '<button ng-if=row.entity.Registered===\'Yes\' class="btn btn-xs btn-primary cellBtn imgactionBtn"' +
                                'ng-click="grid.appScope.deviceReboot(row)" title="Reboot"> ' +
                                '<img alt="#" src="../assets/images/reboot.png" /></button></div>',
                            enableColumnMenu: false,
                            enableHiding: false, width: 150
                        }
                    ];
                    $scope.relaysOptions.exporterSuppressColumns = ['Actions'];
                    $scope.relaysOptions.onRegisterApi = function (gridApi) {
                        $scope.gridApi = gridApi;
                        // commonService.getGridApi($scope, gridApi);
                        gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {
                            $scope.pagination.currentTablePaginationSize = pageSize;
                            $scope.pagination.totalTablePages = Math.ceil($scope.pagination.currentTotalItems / pageSize);
                            pageNum = 1;
                            $scope.pagination.currentTablePage = 1;
                            initHSList(pageNum, $scope.pagination.currentTablePaginationSize);
                        });
                    };

                    initHSList(pageNum, $scope.pagination.currentTablePaginationSize);

                    $templateCache.put('ui-grid/pagination', commonService.getModifiedTable());
                }
                $scope.initializeHSTable($scope.pagination.apiCurrentPage, currentDefaultTablePageSize);
                function initHSList(pageNum, limit) {
                    arrData = [];
                    systemManagementService.getSMHypersproutDetails('All', type, $scope.seachitem, pageNum, limit, $scope.deviceTypeForAPI, $scope.searchObj.searchParam)
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
                                    objToInsert["SerialNumber"] = apiData[i].HypersproutSerialNumber;
                                    objToInsert["DeviceID"] = apiData[i].HypersproutID;
                                    objToInsert["Name"] = (type === 'HyperSprout') ? (angular.isUndefinedOrNull(apiData[i].Hypersprout_DeviceDetails) ? '' : apiData[i].Hypersprout_DeviceDetails.HypersproutMake) : apiData[i].HypersproutName;
                                    objToInsert["Hardware Version"] = (type === 'HyperSprout') ? (angular.isUndefinedOrNull( apiData[i].Hypersprout_DeviceDetails) ? '' :  apiData[i].Hypersprout_DeviceDetails.HypersproutVersion) :  apiData[i].HardwareVersion;
                                    objToInsert["Registered"] = apiData[i].Status === "NotRegistered" ? "No" : "Yes";
                                    objToInsert["CreatedTime"] = angular.isUndefinedOrNull(apiData[i].RegisteredTime) ? '' : moment
                                    .tz(apiData[i].RegisteredTime, userTimeZone).format('YYYY-MM-DD HH:mm:ss');
                                    objToInsert["DeviceClassId"] = apiData[i].DeviceID;
                                    objToInsert["DeviceUIStatus"] = angular.isUndefinedOrNull(apiData[i].device_lock) ? 0 : apiData[i].device_lock;
                                    objToInsert["ESN"] = angular.isUndefinedOrNull(apiData[i].Hypersprout_DeviceDetails) ? '' : apiData[i].Hypersprout_DeviceDetails.ESN;
                                    arrData.push(objToInsert);
                                }
                                $scope.relaysOptions.data = arrData;
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
                    if ($scope.relayDetails.relayCheckbox) {
                        $scope.deviceTypeForAPI = '&filter=NotRegistered';
                        $scope.pagination.currentTablePage = 1;
                        $scope.initializeHSTable(1, $scope.pagination.currentTablePaginationSize);
                    } else {
                        $scope.deviceTypeForAPI = 'Registered';
                        $scope.pagination.currentTablePage = 1;
                        $scope.initializeHSTable(1, $scope.pagination.currentTablePaginationSize);
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
                        $scope.initializeHSTable(nextAPIPage, $scope.pagination.currentTablePaginationSize);
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
                        $scope.initializeHSTable(prevAPIPage, $scope.pagination.currentTablePaginationSize);
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
                        $scope.initializeHSTable(firstPage, $scope.pagination.currentTablePaginationSize);
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
                        $scope.initializeHSTable(lastPage, $scope.pagination.currentTablePaginationSize);
                    } else {
                        {
                            $scope.disablePrvBtn = true;
                            $scope.disableNxtBtn = false;
                        }
                    }
                }

                $scope.paginationBoxChanges = function () {
                    if ($scope.pagination.currentTablePage) {
                        $scope.initializeHSTable($scope.pagination.currentTablePage, $scope.pagination.currentTablePaginationSize);
                    } else {
                        $scope.pagination.currentTablePage = 1;
                        $scope.initializeHSTable($scope.pagination.currentTablePage, $scope.pagination.currentTablePaginationSize);
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
                        $scope.initializeHSTable($scope.pagination.currentTablePage, $scope.pagination.currentTablePaginationSize);
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
                        $scope.initializeHSTable($scope.pagination.currentTablePage, $scope.pagination.currentTablePaginationSize);
                    } else {
                        $scope.seachitem = '';
                        $scope.initializeHSTable($scope.pagination.currentTablePage, $scope.pagination.currentTablePaginationSize);
                    }
                    angular.element(document.querySelector("div.ui-grid-selection-row-header-buttons")).removeClass("ui-grid-all-selected");
                    $scope.mySelectedRows.length = 0;
                };

                /**
                 *  @description
                 * Function to see the logs files for devices.
                 *
                 * @param param
                 * @param type
                 * @return Nil

                 */
                $scope.viewDeviceLogs = function (row) {
                    $sessionStorage.put('selectedDeviceForLogs', row.entity.DeviceID);
                    $sessionStorage.put('selectedDeviceForLogsIsRegistered', { isRegistered: row.entity.Registered, serialNum: row.entity.SerialNumber });
                    objCacheDetails.data.selectedDeviceForLogsIsRegistered = row.entity.Registered;
                    objCacheDetails.data.selectedDeviceForLogs = row.entity.DeviceID;
                    if (type === "HyperSprout") {
                        $state.go('system.hypersproutlogs');
                    } else {
                        $state.go('system.hyperhublogs');
                    }
                };
                /**
                 *  @description
                 * Function to open a pop-up with Relay details
                 *
                 * @param row
                 * @return Nil
                 
                 */
                $scope.nameDetails = function (row) {
                    commonService.modalWindow('/templates/relayDetails.html',
                        'relayDetailsCtrl', type, row);
                };
                $scope.status = {
                    isopen: false
                }
                /**
                *  @description
                * Function to Add Relay by
                * opening a pop-up
                *
                * @param size
                * @return Nil
                
                */
                $scope.openAddRelays = function (size) {
                    modalInstance = $uibModal.open({
                        templateUrl: '/templates/addRelaysToSystem.html',
                        controller: 'addRelaytoSystemCtrl',
                        size: size,
                        backdrop: 'static',
                        keyboard: true
                    });
                    $scope.dynamicPopover.isOpen = false;
                };

                /**
                 *  @description
                 * Function to print
                 *
                 * @param Nil
                 * @return Nil
                 
                 */
                $scope.printCart = function () {
                    window.print();
                };

                /**
                 *  @description
                 * Event handler invoked when controller is destroyed
                 * to close all the pop-up's if any open
                 *
                 * @param Nil
                 * @return Nil
                 
                 */
                $scope.$on('$destroy', function () {
                    $templateCache.put('ui-grid/pagination', commonService.setDefaultTable());
                });

                /**
                * @description
                * Function to open pop-up to send request
                *
                * @param row
                * @return Nil
                
                */
                $scope.lockUnlockDeviceUI = function (row) {
                    commonService.confirmationModalWindow(
                        '/templates/lockUnLockUI.html',
                        'lockUnLockUICtrl',
                        $scope.deviceType, row);
                };
                /**
              * @description
              * Function to open pop-up to send request
              *
              * @param row
              * @return Nil
              
              */
                $scope.deviceReboot = function (row) {
                    commonService.confirmationModalWindow(
                        '/templates/deviceReboot.html',
                        'deviceRebootCtrl',
                        $scope.deviceType, row);
                };
                /**
      * @description
      * Function to open pop-up to Device Factory Reset
      *
      * @param row
      * @return Nil
      
      */
                $scope.deviceFactoryReset = function (row) {
                    commonService.confirmationModalWindow(
                        '/templates/deviceFactoryReset.html',
                        'deviceFactoryResetCtrl',
                        $scope.title === 'HyperSPROUT\u2122' ? 'HyperSprout' : 'HyperHub', row);
                };
            }]);
})(window.angular);
