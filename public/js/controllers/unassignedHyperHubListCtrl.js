/**
 * @description
 * Controller for UI grid table of unassigned Hyperhubs
 */
(function (angular) {
    "use strict";
    angular.module('dataVINEApp').controller('unassignedHyperHubListCtrl',
        ['$scope', '$uibModal', '$state',
            '$rootScope', '$filter', 'DeviceService',
            'ParseService', 'DeviceMappingService', 'commonService', '$sessionStorage','$templateCache',
            function ($scope, $uibModal, $state, $rootScope,
                $filter, deviceService, parseService,
                deviceMappingService, commonService, $sessionStorage,$templateCache) {
                let currentDefaultTablePageSize = objCacheDetails.grid.paginationPageSize;
                var vm = this;
                var hyperHubData;
                $scope.mydisabled = true;
                $scope.mySelectedRows = [];
                $scope.unAssignedhyperHubData = [];
                $scope.mySelectedRows = [];
                $scope.isSelected = false;
                $scope.isCollapsed = false;
                $scope.searchTerm = '';
                $scope.hyperHubUnAssignedGrid = {};

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
                 * Function to display unassignedhyperhub details in UI Grid
                 */
                $scope.initializeHyperhubTable = function (pageNum) {
                    $scope.hyperHubUnAssignedGrid.data = [];
                    $scope.hyperHubUnAssignedGrid = angular.copy(objCacheDetails.grid);
                    $scope.hyperHubUnAssignedGrid.exporterPdfOrientation = 'landscape';
                    $scope.hyperHubUnAssignedGrid.exporterPdfMaxGridWidth = 640;
                    $scope.hyperHubUnAssignedGrid.exporterCsvFilename = 'file.csv';
                    $scope.hyperHubUnAssignedGrid.exporterMenuCsv = true;
                    angular.element(document.querySelector("div.ui-grid-selection-row-header-buttons")).removeClass("ui-grid-all-selected");
                    $scope.hyperHubUnAssignedGrid.columnDefs = [
                        { field: 'HubSerialNumber', displayName: 'HyperHUB\u2122 Serial Number', enableHiding: false, width: 180 },
                        { field: 'HubName', displayName: 'Hub Name', enableHiding: false },
                        { field: 'HardwareVersion', displayName: 'Hardware Version', enableHiding: false },
                        { field: 'Latitude', displayName: 'Latitude', enableHiding: false },
                        { field: 'Longitude', displayName: 'Longitude', enableHiding: false },
                        {
                            field: 'HyperHubID', displayName: 'HyperHubID',
                            enableHiding: false, visible: false
                        },
                    ];
                    $scope.hyperHubUnAssignedGrid.exporterSuppressColumns = ['Actions'];
                    $scope.hyperHubUnAssignedGrid.onRegisterApi = function (gridApi) {
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
                 * Function to initialize unassignedhyperhub details
                 */
                function initHyperhubDetails(pageNum, limit) {
                    if (!$sessionStorage.get('selectedTransformer') || !$sessionStorage.get('selectedCircuit')) {
                        $state.go('system.grouping.circuitGrouping');
                    } else {
                     hyperHubData = [];
                    deviceService.getAllhyperHub('UnAssigned', $scope.searchTerm, pageNum, limit)
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
                                    objToInsert["HyperHubID"] = apiData[i].HypersproutID;
                                    hyperHubData.push(objToInsert);
                                }
                                $scope.hyperHubUnAssignedGrid.data = hyperHubData;
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
                 *  @description
                 * TBD
                 *
                 * @param data
                 * @param callback
                 * @return Nil
                 
                 */
                $rootScope.updateMeterConfigOptions = function (data, callback) {
                    callback();
                };

                /**
                 *  @description
                 * Assign a hyperhub to a transformer
                 *
                 * @param Nil
                 * @return Nil
                 
                 */
                $scope.assignHyperHubToTransformer = function () {
                    var selectedHyperHubList = [];
                    for (var i = 0; i < $scope.gridApi.selection.getSelectedRows().length; i++) {
                        selectedHyperHubList.push($scope.gridApi.selection.getSelectedRows()[i].HyperHubID);
                    }
                    if (selectedHyperHubList.length > 0) {
                        swal({
                            html: true,
                            title: "Group HyperHUB&trade;",
                            text: "Do you really want to group HyperHUB&trade; to this Transformer ?",
                            showCancelButton: true,
                            confirmButtonColor: 'black',
                            confirmButtonText: 'Group',
                            cancelButtonText: "Cancel",
                            cancelButtonColor: 'white',
                        }, function (isConfirm) {       
                            if (isConfirm) {
                                deviceMappingService
                                    .addHyperHubToTransformer($sessionStorage.get('selectedTransformer'), selectedHyperHubList)
                                    .then(function (objData) {
                                        swal(objData);
                                        $scope.pagination.currentTablePage = 1;
                                        $scope.initializeHyperhubTable($scope.pagination.currentTablePage, $scope.pagination.currentTablePaginationSize);
                                    });
                                 }
                                });
                    } else {
                        swal({
                            html: true,
                            title: 'Warning',
                            text: 'Please select a HyperHUB&trade; to map',
                            type: "warning"
                        });
                    }
                };
                 /**
                     * Function to clear the  circuit entry
                     */
                    $scope.searchButtonClear =  function (searchtermInCircuitEntry) {
                        if(searchtermInCircuitEntry == ""){
                            $scope.searchTerm = '';
                            $scope.initializeHyperhubTable($scope.pagination.currentTablePage, $scope.pagination.currentTablePaginationSize);
                        }
                    }

                /**
                 * Filter data in the UI grid
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
                $scope.goToBack = function () {
                    $state.go('system.grouping.hyperHubGrouping');
                };
            }]);
})(window.angular);
