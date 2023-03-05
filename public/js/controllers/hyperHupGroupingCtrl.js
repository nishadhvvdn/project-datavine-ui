/**
 * @description
 * Controller for Hyperhub Grouping
 */
(function (angular) {
    "use strict";
    angular.module('dataVINEApp').controller('hyperHubGroupingCtrl',
        ['$scope', '$uibModal', '$state', '$filter', 'DeviceService',
            'ParseService', 'DeviceMappingService', 'commonService','$sessionStorage','$templateCache',
            function ($scope, $uibModal, $state, $filter,
                deviceService, parseService, deviceMappingService,
                commonService,$sessionStorage,$templateCache) {
                let currentDefaultTablePageSize = objCacheDetails.grid.paginationPageSize;
                var vm = this;
                $scope.hyperHubDataGrouping = [];
                $scope.mySelectedRows = [];
                $scope.isSelected = false;
                $scope.isCollapsed = false;
                $scope.searchTerm = '';
                var assignedhyperHub = [];
                $scope.hyperHubGrouping = {};
                var hyperhubData;
                
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
                 * Function to display HHTransformer details in UI Grid
                 */
                $scope.initializeHHTransformerTable = function (pageNum) {
                    $scope.hyperHubGrouping.data = [];
                    $scope.hyperHubGrouping = angular.copy(objCacheDetails.grid);
                    $scope.hyperHubGrouping.exporterPdfOrientation = 'landscape',
                    $scope.hyperHubGrouping.exporterPdfMaxGridWidth = 640;
                    $scope.hyperHubGrouping.exporterCsvFilename = 'file.csv';
                    $scope.hyperHubGrouping.exporterMenuCsv = true;
                    angular.element(document.querySelector("div.ui-grid-selection-row-header-buttons")).removeClass("ui-grid-all-selected");
                    $scope.hyperHubGrouping.columnDefs = [
                        {
                            field: 'HubSerialNumber',
                            displayName: 'HyperHUB\u2122 Serial Number', enableHiding: false, width: 180
                        },
                        {
                            field: 'GPRSMACID', enableHiding: false, width: 180,visible: false
                        },
                        {
                            field: 'WifiMACID', enableHiding: false, width: 180,visible: false
                        },
                        {
                            field: 'WifiIPAddress', enableHiding: false, width: 180,visible: false
                        },
                        {
                            field: 'WifiAccessPointPassword', enableHiding: false, width: 180,visible: false
                        },
                        {
                            field: 'SimCardNumber', enableHiding: false, width: 180,visible: false
                        },
                        {
                            field: 'HubName',
                            displayName: 'Hub Name', enableHiding: false
                        },
                        {
                            field: 'HardwareVersion',
                            displayName: 'Hardware Version', enableHiding: false
                        },
                        {
                            field: 'Latitude',
                            displayName: 'Latitude', enableHiding: false
                        },
                        {
                            field: 'Longitude',
                            displayName: 'Longitude', enableHiding: false
                        },
                        {
                            field: 'HyperHubID', displayName: 'HyperHubID',
                            enableHiding: false, visible: false
                        },
                        {
                            field: 'Actions',
                            cellTemplate: '<div class="ui-grid-cell-contents">' +
                                '<button type="button" class="btn btn-xs btn-primary cellBtn"' +
                                ' ng-click="grid.appScope.viewhyperHubInfo(row)" title="View">' +
                                ' <i class="fa fa-eye" aria-hidden="true"></i></button>' +
                                '| &nbsp <button class="btn btn-xs btn-primary cellBtn"' +
                                ' ng-click="grid.appScope.removeSelectedHyperHub(row,\'single\')" title="Ungroup HyperHUB\u2122"> ' +
                                '<i class="fa fa-times" aria-hidden="true"></i></button></div>',
                            enableColumnMenu: false,
                            enableHiding: false, width: 150
                        }
                    ]
                    $scope.hyperHubGrouping.exporterSuppressColumns = ['Actions'];
                    $scope.hyperHubGrouping.onRegisterApi = function (gridApi) {
                        $scope.gridApi = gridApi;
                        commonService.getGridApi($scope, gridApi);
                        gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {
                            $scope.pagination.currentTablePaginationSize = pageSize;
                            $scope.pagination.totalTablePages = Math.ceil($scope.pagination.currentTotalItems / pageSize);
                            pageNum = 1;
                            $scope.pagination.currentTablePage = 1;
                            initHHTransformerDetails(pageNum, $scope.pagination.currentTablePaginationSize);
                        });
                    };
                    initHHTransformerDetails(pageNum, $scope.pagination.currentTablePaginationSize);
                    $templateCache.put('ui-grid/pagination', commonService.getModifiedTable());
                }
                $scope.initializeHHTransformerTable($scope.pagination.apiCurrentPage, currentDefaultTablePageSize);
                  /**
                 * Function to initialize transformer details
                 */
                function initHHTransformerDetails(pageNum, limit) {
                    hyperhubData = [];
                    if (!$sessionStorage.get('selectedTransformer')) {
                        $state.go('system.grouping.circuitGrouping');
                    } else{
                        deviceMappingService.GetAllHyperHubAttachedToTransformer($scope.searchTerm,pageNum, limit,$sessionStorage.get('selectedTransformer'))
                        .then(function (apiData) {
                            if (!angular.isUndefinedOrNull(apiData) && apiData.type) {
                                hyperhubData.length = 0;
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
                                    objToInsert["GPRSMACID"] = apiData[i].Hypersprout_Communications.MAC_ID_GPRS;
                                    objToInsert["WifiMACID"] = apiData[i].Hypersprout_Communications.MAC_ID_WiFi;
                                    objToInsert["WifiIPAddress"] = apiData[i].Hypersprout_Communications.IP_address_WiFi;
                                    objToInsert["WifiAccessPointPassword"] = apiData[i].Hypersprout_Communications.AccessPointPassword;
                                    objToInsert["SimCardNumber"] = apiData[i].Hypersprout_Communications.SimCardNumber;
                                    objToInsert["HyperHubID"] = apiData[i].HypersproutID;
                                    hyperhubData.push(objToInsert);
                                }
                                $scope.hyperHubGrouping.data = hyperhubData;
                            } else if (apiData.type == false) {
                                $scope.disableNxtBtn = true;
                                $scope.disablePrvBtn = true;
                                $scope.disableFirstBtn = true;
                                $scope.disableLastBtn = true;
                                $scope.pagination.totalRecordsInDBCount = 0;
                                $scope.pagination.totalTablePages = 1;
                                $scope.datagridMessage = "No data found!";
                            } else {
                                $scope.datagridMessage = '';
                            }
                        });
                    }
                }
                
                $scope.isSelected = false;
                $scope.nxtPageBtnClick = function () {
                    if ($scope.pagination.currentTablePage < $scope.pagination.totalTablePages && $scope.pagination.totalTablePages > 0) {
                        let nextAPIPage = ++$scope.pagination.currentTablePage;
                        $scope.disablePrvBtn = false;
                        $scope.initializeHHTransformerTable(nextAPIPage, $scope.pagination.currentTablePaginationSize);
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
                        $scope.initializeHHTransformerTable(prevAPIPage, $scope.pagination.currentTablePaginationSize);
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
                        $scope.initializeHHTransformerTable(firstPage, $scope.pagination.currentTablePaginationSize);
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
                        $scope.initializeHHTransformerTable(lastPage, $scope.pagination.currentTablePaginationSize);
                    } else {
                        {
                            $scope.disablePrvBtn = true;
                            $scope.disableNxtBtn = false;
                        }
                    }
                }

                $scope.paginationBoxChanges = function () {
                    if ($scope.pagination.currentTablePage) {
                        $scope.initializeHHTransformerTable($scope.pagination.currentTablePage, $scope.pagination.currentTablePaginationSize);
                    } else {
                        $scope.pagination.currentTablePage = 1;
                        $scope.initializeHHTransformerTable($scope.pagination.currentTablePage, $scope.pagination.currentTablePaginationSize);
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
                 * Function to navigate to create new Hyperhub configuration
                 *
                 * @param nil
                 * @return Nil
                
                 */
                $scope.openNewHyerHubConfiguration = function () {
                    $state.go('system.grouping.unassignedHyperHubList');
                };

                /**
                 * @description
                 * Function to view Hyperhub information in a pop-up
                 *
                 * @param row
                 * @return Nil
                 
                 */
                $scope.viewhyperHubInfo = function (row) {
                    $uibModal.open({
                        template: '<div id="print-content">' +
                            '<div class="modal-header"><h4 class="modal-title">' +
                            '<strong>HyperHUB\u2122 Details</strong></h4>' +
                            '</div> <div class="container-fluid modalBackground">' +
                            '<div class="modal-body"><div class="container-fluid">' +
                            '<div class="row"><form name="billingDetails_form"novalidate>' +
                            '<div class="col-md-12"><table class="table table-hover">' +
                            '<tr><td><label>Hub Serial Number</label></td><td>' +
                            '<label><span ng-bind="viewHyperHubDetails.HubSerialNumber">' +
                            '</span></label></td></tr> <tr><td><label>Hub Name</label>' +
                            '</td><td><label><span ng-bind="viewHyperHubDetails.HubName">' +
                            '</span></label></td></tr><tr><td><label>Hardware ' +
                            'Version</label></td><td><label>' +
                            '<span ng-bind="viewHyperHubDetails.HardwareVersion">' +
                            '</span></label></td> </tr><tr><td><label>' +
                            'GPRS MAC ID</label></td><td><label>' +
                            '<span ng-bind="viewHyperHubDetails.GPRSMACID">' +
                            '</span></label></td></tr><tr><td><label>Wifi MAC ID</label>' +
                            '</td><td><label><span ng-bind="viewHyperHubDetails.WifiMACID">' +
                            '</span></label></td> </tr><tr><td>' +
                            '<label>Wifi IP Address</label></td><td><label>' +
                            '<span ng-bind="viewHyperHubDetails.WifiIPAddress">' +
                            '</span></label></td> </tr><tr><td><label>' +
                            'Wifi Access Point Password</label></td><td>' +
                            '<label><span ng-bind="viewHyperHubDetails.WifiAccessPointPassword">' +
                            '</span></label></td> </tr><tr><td><label>Latitude</label></td>' +
                            '<td><label><span ng-bind="viewHyperHubDetails.Latitude">' +
                            '</span></label></td></tr><tr><td><label>Longitude</label>' +
                            '</td><td><label><span ng-bind="viewHyperHubDetails.Longitude">' +
                            '</span></label></td></tr><tr><td><label>Sim Card Number</label>' +
                            '</td><td><label><span ng-bind="viewHyperHubDetails.SimCardNumber">' +
                            '</span></label></td></tr></table></div></form></div></div>' +
                            '</div> </div><div class="modal-footer"><button type="button" ' +
                            'class="btn btn-default btnDefault" ng-click="closeWindow()">' +
                            'OK</button></div></div>',
                        controller: function ($scope, $modalInstance) {
                            $scope.viewHyperHubDetails = row.entity;
                            $scope.closeWindow = function () {
                                $modalInstance.dismiss();
                            };
                        },
                        size: 'lg',
                        backdrop: 'static',
                        keyboard: true,
                    });
                };

                /**
                 * @description
                 * Function to remove selected Hyperhub
                 *
                 * @param row
                 * @param type
                 * @return Nil
                 
                 */
                $scope.removeSelectedHyperHub = function (row, type) {
                    var selectedHyperHub = [];
                    if (type === 'single') {
                        selectedHyperHub = [row.entity.HyperHubID]
                    } else {
                        for (var i = 0; i < $scope.gridApi.selection.getSelectedRows().length; i++) {
                            selectedHyperHub.push($scope.mySelectedRows[i].HyperHubID);
                        }
                    }
                    if (selectedHyperHub.length > 0) {
                        swal({
                            html: true,
                            title: "Un-Group HyperHUB&trade;", text: "Do you really want to un-group the device?",
                            showCancelButton: true,
                            confirmButtonColor: 'black',
                            confirmButtonText: 'Un-Group',
                            cancelButtonText: "Cancel",
                            cancelButtonColor: 'white',
                        }, function (isConfirm) {
                            if (isConfirm) {
                                deviceMappingService.RemovingHyperHubFromTransformer($sessionStorage.get('selectedTransformer'), selectedHyperHub).then(function (objData) {
                                    swal(objData);
                                    $scope.mySelectedRows = [];
                                    $scope.pagination.currentTablePage = 1;
                                    $scope.initializeHHTransformerTable($scope.pagination.currentTablePage, $scope.pagination.currentTablePaginationSize);;
                                });
                            }
                        });

                    } else {
                        swal({
                            html: true,
                            title: 'Warning',
                            text: 'Please select a HyperHUB&trade; to Un-Group',
                            type: "warning"
                        });
                    }

                };

                /**
                 * @description
                 * Function to navigate to Transformer Meter Grouping
                 *
                 * @param nil
                 * @return Nil
                 
                 */
                $scope.goBack = function () {
                    $state.go('system.grouping.transformerMeterGrouping');
                };
                /**
                     * Function to clear the  circuit entry
                     */
                    $scope.searchButtonClear =  function (searchtermInCircuitEntry) {
                        if(searchtermInCircuitEntry == ""){
                            $scope.searchTerm = '';
                            $scope.initializeHHTransformerTable($scope.pagination.currentTablePage, $scope.pagination.currentTablePaginationSize);
                        }
                    }

                /**
                 * @description
                 * Function to search assigned grouping
                 *
                 * @param searchValue
                 * @return Nil
                 
                 */
                $scope.searchButton = function (searchValue) {
                    if (searchValue) {
                        $scope.searchTerm = searchValue;
                        $scope.pagination.currentTablePage = 1;
                            $scope.initializeHHTransformerTable($scope.pagination.currentTablePage, $scope.pagination.currentTablePaginationSize);
                    } else {
                        $scope.searchTerm = '';
                        $scope.initializeHHTransformerTable($scope.pagination.currentTablePage, $scope.pagination.currentTablePaginationSize);
                    }
                    angular.element(document.querySelector("div.ui-grid-selection-row-header-buttons")).removeClass("ui-grid-all-selected");
                    $scope.mySelectedRows.length = 0;
                };
                // $scope.searchGridAssignedGroupping = function (searchValue) {
                //     $scope.hyperHubGrouping.data =
                //         $filter('hyperHubSearch')(assignedhyperHub,
                //             searchValue, 'hyperHub');
                //             if ($scope.hyperHubGrouping.data.length === 0 && searchValue.length > 0) {
                //                 $scope.datagridMessage = 'No data found!';
                //             } else {
                //                 $scope.datagridMessage = 'No data found!';
                //             }
                // };
            }]);
})(window.angular);
