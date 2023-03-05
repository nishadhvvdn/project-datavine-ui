/**
 * @description
 * Controller for deltaLink
 */
(function (angular) {
    "use strict";
    angular.module('dataVINEApp').controller('deltaLinkCtrl',
        ["$scope", "$uibModal", "$state", "$rootScope", '$filter', '$timeout', 'DeviceService', 'ParseService', 'refreshservice', 'commonService', '$templateCache', '$sessionStorage',
            function ($scope, $uibModal, $state, $rootScope, $filter, $timeout, deviceService, parseService, refreshservice, commonService, $templateCache, $sessionStorage) {
                let currentDefaultTablePageSize = objCacheDetails.grid.paginationPageSize;
                $scope.isSelected = false;
                $scope.searchTerm = "";
                $scope.mySelectedRows = [];
                let deltaLinkData = [];
                $scope.deltaLink = {};
                $scope.deltaLink.deltaLinkCheckbox = false;
                $scope.dynamicPopover = {
                    templateUrl: '/templates/deltaLinkSetting.html',
                    content: '',
                    open: function () {
                        $scope.dynamicPopover.isOpen = true;
                    },
                    close: function () {
                        $scope.dynamicPopover.isOpen = false;
                    }
                };

                $scope.deviceTypeForAPI = 'registered';

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

                $scope.initializeDeltaLinkTable = function (pageNum) {
                    $scope.deltaLinkGrid = angular.copy(objCacheDetails.grid);
                    $scope.deltaLinkGrid.data = [];
                    $scope.deltaLinkGrid.exporterPdfOrientation = 'landscape';
                    $scope.deltaLinkGrid.exporterPdfMaxGridWidth = 640;
                    $scope.deltaLinkGrid.exporterCsvFilename = 'file.csv';
                    $scope.deltaLinkGrid.columnDefs = [
                        {
                            field: 'SerialNumber',
                            cellTemplate: '<div class="ui-grid-cell-contents">' +
                                '<a class="anchorUIGrid" ' +
                                'ng-click="grid.appScope.detailsForDeltaLink(row)">' +
                                '{{row.entity.SerialNumber}} </a> </div>',
                            displayName: 'Serial Number', enableHiding: false,
                            sortingAlgorithm: commonService.getSortByString, width: 180
                        },
                        {
                            field: 'version',
                            displayName: 'Hardware Version',
                            enableHiding: false,
                            sortingAlgorithm: commonService.getSortByString
                        }, {
                            field: 'Registered',
                            displayName: 'Registered',
                            enableHiding: false,
                            sortingAlgorithm: commonService.getSortByString
                        }, {
                            field: 'Actions',
                            cellTemplate: '<div class="ui-grid-cell-contents">' +
                                '<button ng-if=row.entity.Registered===\'Yes\' type="button" class="btn btn-xs btn-primary cellBtn imgactionBtn" ' +
                                'ng-click="grid.appScope.deviceFactoryReset(row)" title="Factory Reset">  ' +
                                '<img alt="#" src="../assets/images/reset.png" /></button> <span ng-if=row.entity.Registered===\'Yes\'> | </span> ' +
                                '<button type="button" class="btn btn-xs btn-primary cellBtn" ' +
                                'ng-click="grid.appScope.viewDeltaLinkLogs(row)" title="Device Logs">  ' +
                                '<i class="fa fa-file-text-o" aria-hidden="true"></i></button> <span ng-if=row.entity.Registered===\'Yes\'> | </span> ' +
                                '<button ng-if=row.entity.Registered===\'Yes\' class="btn btn-xs btn-primary cellBtn imgactionBtn"' +
                                'ng-click="grid.appScope.deviceReboot(row)" title="Reboot"> ' +
                                '<img alt="#" src="../assets/images/reboot.png" /></button>' +
                                '</div>',
                            enableColumnMenu: false, enableSorting: false,
                            enableHiding: false, width: 150
                        }
                    ];
                    $scope.deltaLinkGrid.exporterSuppressColumns = ['Actions'];
                    $scope.deltaLinkGrid.onRegisterApi = function (gridApi) {
                        $scope.gridApi = gridApi;
                        // commonService.getGridApi($scope, gridApi);
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
                    deviceService.fetchDeltaLinkList($scope.searchTerm, pageNum, limit, $scope.deviceTypeForAPI)
                        .then(function (apiData) {
                            if (!angular.isUndefinedOrNull(apiData) && apiData.type) {
                                deltaLinkData.length = 0;

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
                                    objToInsert["bandwidth"] = apiData[i].Bandwidth;
                                    objToInsert["DeltalinkID"] = apiData[i].DeltalinkID;
                                    objToInsert["CreatedOn"] = angular.isUndefinedOrNull(apiData[i].RegisteredTime) ? '' : apiData[i].RegisteredTime;
                                    objToInsert["Registered"] = apiData[i].Status === "NotRegistered" ? "No" : "Yes";
                                    objToInsert["DeviceID"] = apiData[i].DeltalinkID;
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

                $scope.checkValueOfCheckbox = function () {
                    $scope.searchTerm = "";
                    if ($scope.deltaLink.deltaLinkCheckbox) {
                        $scope.deviceTypeForAPI = 'nonRegistered';
                        $scope.pagination.currentTablePage = 1;
                        $scope.initializeDeltaLinkTable(1, $scope.pagination.currentTablePaginationSize);
                    } else {
                        $scope.deviceTypeForAPI = 'registered';
                        $scope.pagination.currentTablePage = 1;
                        $scope.initializeDeltaLinkTable(1, $scope.pagination.currentTablePaginationSize);
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

                $scope.toggleDropdown = function ($event) {
                    $event.preventDefault();
                    $event.stopPropagation();
                    $scope.status.isopen = !$scope.status.isopen;
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

                $scope.viewDeltaLinkLogs = function (row) {
                    $sessionStorage.put('selectedDeviceForLogs', row.entity.DeltalinkID);
                    objCacheDetails.data.selectedDeviceForLogs = row.entity.DeltalinkID;
                    $sessionStorage.put('selectedDeviceForLogsIsRegistered', row.entity.Registered);
                    $sessionStorage.put('selectedDeviceForLogsIsRegistered', { isRegistered: row.entity.Registered, serialNum : row.entity.SerialNumber });
                    $state.go('system.deltalinklogs');
                };

                /**
                 *  @description
                 * Function to view deltaLink in grid by
                 * opening a pop-up
                 *
                 * @param row
                 * @return Nil

                 */
                $scope.detailsForDeltaLink = function (row) {
                    let data = objCacheDetails.data.deltaLinkData = row.entity;
                    commonService.modalWindow('/templates/deltaLinkDetails.html', 'deltaLinkDetailsCtrl', 'DeltaLink', data);
                };


                $scope.$on('$destroy', function () {
                    $templateCache.put('ui-grid/pagination', commonService.setDefaultTable());
                });

                $scope.deviceReboot = function (row) {
                    commonService.confirmationModalWindow(
                        '/templates/deviceReboot.html',
                        'deviceRebootCtrl',
                        'deltalink', row);
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
                        'DeltaLink', row);
                };
            }]);
})(window.angular);