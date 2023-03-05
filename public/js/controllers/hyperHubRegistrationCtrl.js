/**
 * @description
 * Controller for Registering Hyperhub
 */
(function (angular) {
    "use strict";
    angular.module('dataVINEApp').controller('hyperHubRegistrationCtrl',
        ['$scope', '$rootScope', '$uibModal', 'DeviceService', 'ParseService', '$filter',
            'commonService', '$sessionStorage', '$state', '$templateCache',
            function ($scope, $rootScope, $uibModal,
                deviceService, parseService,
                $filter, commonService, $sessionStorage, $state, $templateCache) {
                let currentDefaultTablePageSize = objCacheDetails.grid.paginationPageSize;
                var modalInstance = null;
                var hyperHubData = [];
                $scope.mySelectedRows = [];
                $scope.isSelected = false;
                var vm = this;
                $scope.isCollapsed = false;
                $scope.searchTerm = '';
                $scope.hypherGrid = {};

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
                 /**
                 * Function to display hyperhub details in UI Grid
                 */
                $scope.initializeHyperhubTable = function (pageNum) {
                    $scope.hypherGrid.data = [];
                    $scope.hypherGrid = angular.copy(objCacheDetails.grid);
                    $scope.hypherGrid.exporterPdfOrientation = 'landscape';
                    $scope.hypherGrid.exporterPdfMaxGridWidth = 640;
                    $scope.hypherGrid.exporterCsvFilename = 'file.csv';
                    $scope.hypherGrid.exporterMenuCsv = true;
                    angular.element(document.querySelector("div.ui-grid-selection-row-header-buttons")).removeClass("ui-grid-all-selected");
                    $scope.hypherGrid.columnDefs = [
                        {
                            field: 'HubSerialNumber',
                            displayName: 'HyperHUB\u2122 Serial Number', enableHiding: false,
                            sortingAlgorithm: commonService.getSortByString, width: 180
                        },
                        {
                            field: 'HubName',
                            displayName: 'Hub Name',
                            enableHiding: false,
                            sortingAlgorithm: commonService.getSortByString
                        },
                        {
                            field: 'HardwareVersion',
                            displayName: 'Hardware Version',
                            enableHiding: false,
                            sortingAlgorithm: commonService.getSortByString
                        },
                        {
                            field: 'Latitude', displayName:
                                'Latitude', enableHiding: false,
                            sortingAlgorithm: commonService.getSortByNumber
                        },
                        {
                            field: 'Longitude', displayName: 'Longitude',
                            enableHiding: false, sortingAlgorithm: commonService.getSortByNumber
                        },
                        {
                            field: 'GprsMacID', displayName: 'GPRS MAC ID',
                            enableHiding: false, visible: false
                        },
                        {
                            field: 'WifiIPAddress', displayName: 'Wifi IP Address',
                            enableHiding: false, visible: false
                        },
                        {
                            field: 'WifiMacID', displayName: 'Wifi MAC ID',
                            enableHiding: false, visible: false
                        },
                        {
                            field: 'SimCardNumber', displayName: 'Sim Card Number',
                            enableHiding: false, visible: false
                        },
                        {
                            field: 'WifiAccessPointPassword', displayName: 'Wifi Access Point Password',
                            enableHiding: false, visible: false
                        },
                        {
                            field: 'HyperHubID', displayName: 'HyperHubID',
                            enableHiding: false, visible: false
                        },
                        {
                            field: 'Actions',
                            cellTemplate: '<div class="ui-grid-cell-contents">' +
                                '<button type="button" class="btn btn-xs btn-primary cellBtn" ' +
                                'ng-click="grid.appScope.viewhyperHub(row)" title="View">' +
                                ' <i class="fa fa-eye" aria-hidden="true"></i>' +
                                '</button> | <button type="button" ' +
                                'class="btn btn-xs btn-primary cellBtn" ' +
                                'ng-click="grid.appScope.createOrEditHyperHub(\'edit\',row)" title="Edit">' +
                                ' <i class="fa fa-pencil-square-o" aria-hidden="true"></i>' +
                                '</button> | <button class="btn btn-xs btn-primary cellBtn imgactionBtn"' +
                                ' ng-click="grid.appScope.configuration(row)" title="Device Configuration"> ' +
                                '<img alt="#" src="../assets/images/config.png" /></button> | <button class="btn btn-xs btn-primary cellBtn"' +
                                ' ng-click="grid.appScope.deleteHyperHub(row,\'single\')" title="Delete"> ' +
                                '<i class="fa fa-trash-o" aria-hidden="true"></i>' +
                                '</button></div>',
                            enableColumnMenu: false, enableSorting: false,
                            enableHiding: false, width: 150
                        }
                    ];
                    $scope.hypherGrid.exporterSuppressColumns = ['Actions'];
                    $scope.hypherGrid.onRegisterApi = function (gridApi) {
                        $scope.gridApi = gridApi;
                        commonService.getGridApi($scope, gridApi);
                        gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {
                            $scope.pagination.currentTablePaginationSize = pageSize;
                            $scope.pagination.totalTablePages = Math.ceil($scope.pagination.currentTotalItems / pageSize);
                            pageNum = 1;
                            $scope.pagination.currentTablePage = 1;
                            initHyperhubDetails(pageNum, $scope.pagination.currentTablePaginationSize);
                        });
                    };
                    initHyperhubDetails(pageNum, $scope.pagination.currentTablePaginationSize);
                    $templateCache.put('ui-grid/pagination', commonService.getModifiedTable());
                }
                $scope.initializeHyperhubTable($scope.pagination.apiCurrentPage, currentDefaultTablePageSize);
                /**
                 * Function to initialize hyperhub details
                 */
                function initHyperhubDetails(pageNum, limit) {
                    hyperHubData = [];
                    deviceService.getAllhyperHub('All', $scope.searchTerm, pageNum, limit)
                        .then(function (apiData) {
                            if (!angular.isUndefinedOrNull(apiData) && apiData.type) {
                                hyperHubData.length = 0;
                                $scope.pagination.currentTotalItems = apiData.HyperHubDetailSelected.results.length;
                                $scope.pagination.apiCurrentPage = pageNum;
                                $scope.pagination.totalRecordsInDBCount = apiData.HyperHubDetailSelected.totalRecords;
                                $scope.pagination.totalTablePages = Math.ceil($scope.pagination.totalRecordsInDBCount / $scope.pagination.currentTablePaginationSize);

                                let btnFlags = commonService.getBtnStatus($scope.pagination.currentTablePage, $scope.pagination.totalTablePages);
                                $scope.disableNxtBtn = btnFlags.disableNxtBtn;
                                $scope.disablePrvBtn = btnFlags.disablePrvBtn;
                                $scope.disableFirstBtn = btnFlags.disableFirstBtn;
                                $scope.disableLastBtn = btnFlags.disableLastBtn;

                                apiData = apiData.HyperHubDetailSelected.results;
                                $scope.commonMsg = "";
                                for (let i = 0; i < apiData.length; i++) {
                                    let objToInsert = {};
                                    objToInsert["HubSerialNumber"] = apiData[i].HypersproutSerialNumber;
                                    objToInsert["HubName"] = apiData[i].HypersproutName;
                                    objToInsert["HardwareVersion"] = apiData[i].HardwareVersion;
                                    objToInsert["Latitude"] = apiData[i].Hypersprout_Communications.Latitude;
                                    objToInsert["Longitude"] = apiData[i].Hypersprout_Communications.Longitude;
                                    objToInsert["GprsMacID"] = apiData[i].Hypersprout_Communications.MAC_ID_GPRS;
                                    objToInsert["WifiIPAddress"] = apiData[i].Hypersprout_Communications.IP_address_WiFi;
                                    objToInsert["WifiMacID"] = apiData[i].Hypersprout_Communications.MAC_ID_WiFi;
                                    objToInsert["SimCardNumber"] = apiData[i].Hypersprout_Communications.SimCardNumber;
                                    objToInsert["WifiAccessPointPassword"] = apiData[i].Hypersprout_Communications.AccessPointPassword;
                                    objToInsert["HyperHubID"] = apiData[i].HypersproutID;
                                    objToInsert["Status"] = apiData[i].Status;
                                    hyperHubData.push(objToInsert);
                                }
                                $scope.hypherGrid.data = hyperHubData;
                            } else if (apiData.type == false) {
                                $scope.disableNxtBtn = true;
                                $scope.disablePrvBtn = true;
                                $scope.disableFirstBtn = true;
                                $scope.disableLastBtn = true;
                                $scope.pagination.totalRecordsInDBCount = 0;
                                $scope.pagination.totalTablePages = 1;
                                $scope.commonMsg = "No data found!";
                            } else {
                                $scope.commonMsg = '';
                            }
                        });
                }
                $scope.nxtPageBtnClick = function () {
                    if ($scope.pagination.currentTablePage < $scope.pagination.totalTablePages && $scope.pagination.totalTablePages > 0) {
                        let nextAPIPage = ++$scope.pagination.currentTablePage;
                        $scope.disablePrvBtn = false;
                        $scope.initializeHyperhubTable(nextAPIPage, $scope.pagination.currentTablePaginationSize);
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
                        $scope.initializeHyperhubTable(prevAPIPage, $scope.pagination.currentTablePaginationSize);
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
                        $scope.initializeHyperhubTable(firstPage, $scope.pagination.currentTablePaginationSize);
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
                        $scope.initializeHyperhubTable(lastPage, $scope.pagination.currentTablePaginationSize);
                    } else {
                        {
                            $scope.disablePrvBtn = true;
                            $scope.disableNxtBtn = false;
                        }
                    }
                }

                $scope.paginationBoxChanges = function () {
                    if ($scope.pagination.currentTablePage) {
                        $scope.initializeHyperhubTable($scope.pagination.currentTablePage, $scope.pagination.currentTablePaginationSize);
                    } else {
                        $scope.pagination.currentTablePage = 1;
                        $scope.initializeHyperhubTable($scope.pagination.currentTablePage, $scope.pagination.currentTablePaginationSize);
                    }
                }

                /**
                 *  @description
                 * Function to toggle dropdown
                 *
                 * @param event
                 * @return Nil
 
                 */
                $scope.toggleDropdown = function ($event) {
                    $event.preventDefault();
                    $event.stopPropagation();
                    $scope.status.isopen = !$scope.status.isopen;
                };
                $scope.toggle = function () {
                    $scope.isSelected = true;
                    $scope.ticked = !$scope.ticked;
                };

                /**
             * @description
             * Function to view Hyperhub data by
             * opening a pop-up
             *
             * @param row
             * @return Nil
            
             */
                $scope.viewhyperHub = function (row) {
                    $uibModal.open({
                        template: '<div id="print-content">' +
                            '<div class="modal-header">' +
                            '<h4 class="modal-title">' +
                            '<strong>HyperHUB\u2122 Details</strong></h4></div> ' +
                            '<div class="container-fluid modalBackground">' +
                            '<div class="modal-body">' +
                            '<div class="container-fluid"><div class="row">' +
                            '<form name="billingDetails_form"novalidate>' +
                            '<div class="col-md-12">' +
                            '<table class="table table-hover">' +
                            '<tr><td><label>Hub Serial Numbers</label></td><td>' +
                            '<label><span ng-bind="viewHyperHubDetails.HubSerialNumber"></span></label>' +
                            '</td></tr> <tr><td>' +
                            '<label>Hub Name</label>' +
                            '</td><td><label><span ng-bind="viewHyperHubDetails.HubName"></span>' +
                            '</label></td></tr><tr><td><label>Hardware Version</label></td><td><label>' +
                            '<span ng-bind="viewHyperHubDetails.HardwareVersion"></span>' +
                            '</label></td> </tr><tr><td><label>GPRS MAC ID</label></td><td><label>' +
                            '<span ng-bind="viewHyperHubDetails.GprsMacID"></span>' +
                            '</label></td></tr><tr><td><label>Wifi MAC ID</label>' +
                            '</td><td><label><span ng-bind="viewHyperHubDetails.WifiMacID"></span></label></td>' +
                            '</tr><tr><td><label>Wifi IP Address</label></td><td><label>' +
                            '<span ng-bind="viewHyperHubDetails.WifiIPAddress"></span>' +
                            '</label></td> </tr><tr ng-if="viewHyperHubDetails.WifiAccessPointPassword"><td><label>Wifi Access Point Password</label>' +
                            '</td><td><label><span ng-bind="viewHyperHubDetails.WifiAccessPointPassword"></span></label></td>' +
                            '</tr>' +
                            '<tr><td><label>Latitude</label></td><td>' +
                            '<label><span ng-bind="viewHyperHubDetails.Latitude"></span></label>' +
                            '</td></tr><tr><td><label>Longitude</label></td><td>' +
                            '<label><span ng-bind="viewHyperHubDetails.Longitude"></span></label>' +
                            '</td></tr><tr><td><label>Sim Card Number</label></td><td>' +
                            '<label><span ng-bind="viewHyperHubDetails.SimCardNumber"></span></label>' +
                            '</td></tr></table></div></form></div></div></div> ' +
                            '</div><div class="modal-footer">' +
                            '<button type="button" class="btn btn-default btnDefault" ng-click="closeWindow()">OK</button>' +
                            '</div>' +
                            '</div>',
                        controller: function ($scope, $modalInstance) {
                            $scope.viewHyperHubDetails = row.entity;
                            $scope.closeWindow = function () {
                                $modalInstance.dismiss();
                            };
                        },
                        size: 'lg',
                        backdrop: 'static',
                        keyboard: true,
                    }).result.then(function () {
                        $scope.mySelectedRows.length = 0;
                        $scope.initializeHyperhubTable($scope.pagination.apiCurrentPage, currentDefaultTablePageSize);
                    }, function (callApi) {
                        if (callApi) {
                            $scope.mySelectedRows.length = 0;
                            $scope.initializeHyperhubTable($scope.pagination.apiCurrentPage, currentDefaultTablePageSize);
                        }
                    });
                };
                /**
                 * @description
                 * Function to create / edit Hyperhub by
                 * opening a pop-up
                 *
                 * @param type
                 * @param row
                 * @return Nil
                
                 */
                $scope.createOrEditHyperHub = function (type, row) {
                    objCacheDetails.data.hyperHubData = type === 'edit' ? row.entity : undefined;
                    $uibModal.open({
                        templateUrl: 'templates/createHyperHub.html',
                        controller: 'addOrEditHyperHubCtrl',
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
                        $scope.initializeHyperhubTable($scope.pagination.apiCurrentPage, currentDefaultTablePageSize);
                    }, function (callApi) {
                        if (callApi) {
                            $scope.mySelectedRows.length = 0;
                            $scope.initializeHyperhubTable($scope.pagination.apiCurrentPage, currentDefaultTablePageSize);
                        }
                    });
                };

                /**
                 *  @description
                 * Function to delete a Hyperhub after confirmation
                 *
                 * @param type
                 * @param row
                 * @return Nil
                 
                 */
                $scope.deleteHyperHub = function (row, type) {
                    swal({
                        html: true,
                        title: "Delete HyperHUB&trade;",
                        text: "Are you sure you want to remove ?",
                        showCancelButton: true,
                        confirmButtonColor: 'black',
                        confirmButtonText: 'Delete',
                        cancelButtonText: "Cancel",
                        cancelButtonColor: 'white',
                    }, function (isConfirm) {
                        if (isConfirm) {
                            var selectedHyperHub = [];
                            if (type === 'single') {
                                selectedHyperHub = [row.entity.HyperHubID]
                            } else {
                                for (var i = 0; i < $scope.mySelectedRows.length; i++) {
                                    selectedHyperHub.push($scope.mySelectedRows[i].HyperHubID);
                                }
                            }
                            deviceService.deleteHyperHub(selectedHyperHub).then(function (objData) {
                                $scope.mySelectedRows.length = 0;
                                swal(objData);
                                $scope.mySelectedRows.length = 0;
                                $scope.initializeHyperhubTable($scope.pagination.apiCurrentPage, currentDefaultTablePageSize);
                                //$scope.searchterm = "";
                            });
                        }
                    });
                };

                /**
                 * @description
                 * Function to upload Hyperhub by
                 * opening a pop-up
                 *
                 * @param size
                 * @return Nil
                
                 */
                $scope.uploadHyperHub = function (size) {
                    $uibModal.open({
                        templateUrl: '/templates/openUploadConfiguration.html',
                        controller: 'uploadCtrl',
                        size: size,
                        backdrop: 'static',
                        keyboard: true,
                        resolve: {
                            uploadParam: function () {
                                return {
                                    type: 'hyperHub',
                                    endPoint: 'NewHyperHubEntry'
                                };
                            }
                        }
                    }).result.then(function () {
                        $scope.mySelectedRows.length = 0;
                        $scope.initializeHyperhubTable($scope.pagination.apiCurrentPage, currentDefaultTablePageSize);
                    }, function (callApi) {
                        if (callApi) {
                            $scope.mySelectedRows.length = 0;
                            $scope.initializeHyperhubTable($scope.pagination.apiCurrentPage, currentDefaultTablePageSize);
                        }
                    });
                };
                $scope.uploadHyperhubConfiguration = function (size) {
                    modalInstance = $uibModal.open({
                        templateUrl: '/templates/openUploadConfiguration.html',
                        controller: 'uploadCtrl',
                        size: size,
                        backdrop: 'static',
                        keyboard: true,
                        resolve: {
                            uploadParam: function () {
                                return { type: 'hyperhubConfig', endPoint: 'ConfigUploadHyperSprout' };
                            }
                        }
                    });
                    modalInstance.result.then(function () {
                        $scope.mySelectedRows.length = 0;
                        $scope.initializeHyperhubTable($scope.pagination.apiCurrentPage, currentDefaultTablePageSize);
                    }, function (callApi) {                        
                        if(callApi) {
                            $scope.mySelectedRows.length = 0;
                            $scope.initializeHyperhubTable($scope.pagination.apiCurrentPage, currentDefaultTablePageSize);
                        }
                    });
                    $scope.dynamicPopover.isOpen = false;
                };
                 /**
                     * Function to clear the  deltalink entry search
                     */
                    $scope.searchButtonClear =  function (searchTerm) {
                        if(searchTerm == ""){
                            $scope.searchTerm = '';
                            $scope.initializeHyperhubTable($scope.pagination.currentTablePage, $scope.pagination.currentTablePaginationSize);
                        }
                    }
                /**
                * @description
                * Function to search items
                *
                * @param searchValue
                * @return Nil
                
                */
                $scope.searchButton = function (searchValue) {
                    if (searchValue) {
                        $scope.searchTerm = searchValue;
                        $scope.pagination.currentTablePage = 1;
                        $scope.initializeHyperhubTable($scope.pagination.currentTablePage, $scope.pagination.currentTablePaginationSize);
                    } else {
                        $scope.searchTerm = '';
                        $scope.initializeHyperhubTable($scope.pagination.currentTablePage, $scope.pagination.currentTablePaginationSize);
                    }
                    angular.element(document.querySelector("div.ui-grid-selection-row-header-buttons")).removeClass("ui-grid-all-selected");
                    $scope.mySelectedRows.length = 0;
                };

                /**
                * @description
                * Device Configuration
                *
                * @param row
                * @return Nil
                */
                $scope.configuration = function (row) {
                    $sessionStorage.put('selectedDeviceIdConfig', row.entity.HyperHubID);
                    $sessionStorage.put('selectedSerialNumberConfig', row.entity.HubSerialNumber);
                    $sessionStorage.put('selectedDeviceStatusConfig', row.entity.Status);
                    $state.go('system.hyperhubconfig');
                };
            }]);
})(window.angular);