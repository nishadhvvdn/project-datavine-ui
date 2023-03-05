/**
  * @this vm
  * @ngdoc controller
  * @name dataVINEApp.controller:circuitGroupingCtrl
  *
  * @description
  * Controller for Grouping Circuits
*/
(function (angular) {
    "use strict";
    angular.module('dataVINEApp').controller('circuitGroupingCtrl',
        ["$scope", "$uibModal", "$rootScope", "$state",
            '$filter', 'DeviceService',
            'commonService', '$sessionStorage','$templateCache',
            function ($scope, $uibModal, $rootScope,
                $state, $filter, deviceService,
                commonService, $sessionStorage,$templateCache) {
                let currentDefaultTablePageSize = objCacheDetails.grid.paginationPageSize;
                var modalInstance = null;
                var configurationData = [];
                $scope.mySelectedRows = [];
                $scope.isSelected = false;
                var vm = this;
                $scope.isCollapsed = false;
                $scope.searchTerm = '';
                $scope.circuitGroupingOptions = {};

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
                 * Function to display dtc details in UI Grid
                 */
                $scope.initializeDTCTable = function (pageNum) {
                    $scope.circuitGroupingOptions.data = [];
                    $scope.circuitGroupingOptions = angular.copy(objCacheDetails.grid);
                    $scope.circuitGroupingOptions.exporterPdfOrientation = 'landscape';
                    $scope.circuitGroupingOptions.exporterPdfMaxGridWidth = 640;
                    $scope.circuitGroupingOptions.exporterCsvFilename = 'file.csv';
                    $scope.circuitGroupingOptions.exporterMenuCsv = true;
                    angular.element(document.querySelector("div.ui-grid-selection-row-header-buttons")).removeClass("ui-grid-all-selected");
                    $scope.circuitGroupingOptions.columnDefs = [
                    { field: 'circuitId', displayName: 'DTC ID', type: 'numberStr', enableHiding: false, sortingAlgorithm: commonService.getSortByString, width: 180 },
                    { field: 'kvaRating', displayName: 'KVA Rating', type: 'number', enableHiding: false, sortingAlgorithm: commonService.getSortByString },
                    { field: 'numberOfTransformers', displayName: 'No. of Transformers', type: 'number', enableHiding: false, sortingAlgorithm: commonService.getSortByNumber },
                    { field: 'substationId', displayName: 'Substation ID', enableHiding: false, sortingAlgorithm: commonService.getSortByString },
                    { field: 'substationAdd', displayName: 'Substation Address', enableHiding: false, sortingAlgorithm: commonService.getSortByString },
                    { field: 'substationName', displayName: 'Sub-Station Name', enableHiding: false, visible: false },
                    { field: 'country', displayName: 'Country', enableHiding: false, visible: false },
                    { field: 'state', displayName: 'State', enableHiding: false, visible: false },
                    { field: 'city', displayName: 'City', enableHiding: false, visible: false },
                    { field: 'zipcode', displayName: 'Zip Code', enableHiding: false, visible: false },
                    {
                        field: 'latitude', displayName: 'Latitude', type: 'number', enableHiding: false,
                        sortingAlgorithm: function (a, b) {
                            if (a > b) {
                                return 1;
                            } else if (a === b) {
                                return 0;
                            } else {
                                return -1;
                            }
                        }
                    },
                    {
                        field: 'longitude', displayName: 'Longitude', type: 'number', enableHiding: false,
                        sortingAlgorithm: function (a, b) {
                            if (a > b) {
                                return 1;
                            } else if (a === b) {
                                return 0;
                            } else {
                                return -1;
                            }
                        }
                    },
                    {
                        field: 'Actions',
                        cellTemplate: '<div class="ui-grid-cell-contents"><button type="button" class="btn btn-xs btn-primary cellBtn" ng-click="grid.appScope.vm.viewCircuitInfo(row)" title="View"> <i class="fa fa-eye" aria-hidden="true"></i></button> &nbsp | &nbsp <button class="btn btn-xs btn-primary cellBtn" ng-click="grid.appScope.vm.mapTransformerInfo(row)" title="Group Transformer"> <img height="12px" width="15px" src="/assets/images/circuit.png"></img></button></ div > ',
                        enableColumnMenu: false, enableSorting: false, enableHiding: false, width: 150
                    }
                    ];
                    $scope.circuitGroupingOptions.exporterSuppressColumns = ['Actions'];
                    $scope.circuitGroupingOptions.onRegisterApi = function (gridApi) {
                        $scope.gridApi = gridApi;
                        commonService.getGridApi($scope, gridApi);
                        gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {
                            $scope.pagination.currentTablePaginationSize = pageSize;
                            $scope.pagination.totalTablePages = Math.ceil($scope.pagination.currentTotalItems / pageSize);
                            pageNum = 1;
                            $scope.pagination.currentTablePage = 1;
                            initDTCDetails(pageNum, $scope.pagination.currentTablePaginationSize);
                        });
                    };
                    initDTCDetails(pageNum, $scope.pagination.currentTablePaginationSize);
                    $templateCache.put('ui-grid/pagination', commonService.getModifiedTable());
                }
                $scope.initializeDTCTable($scope.pagination.apiCurrentPage, currentDefaultTablePageSize);
                 /**
                 * Function to initialize DTC details
                 */
                function initDTCDetails(pageNum, limit) {
                    configurationData = [];
                    deviceService.getAllCircuits($scope.searchTerm, pageNum, limit)
                        .then(function (apiData) {
                            if (!angular.isUndefinedOrNull(apiData) && apiData.type) {
                                configurationData.length = 0;
                                $scope.pagination.currentTotalItems = apiData.CircuitDetailSelected.results.length;
                                $scope.pagination.apiCurrentPage = pageNum;
                                $scope.pagination.totalRecordsInDBCount = apiData.CircuitDetailSelected.totalRecords;
                                $scope.pagination.totalTablePages = Math.ceil($scope.pagination.totalRecordsInDBCount / $scope.pagination.currentTablePaginationSize);

                                let btnFlags = commonService.getBtnStatus($scope.pagination.currentTablePage, $scope.pagination.totalTablePages);
                                $scope.disableNxtBtn = btnFlags.disableNxtBtn;
                                $scope.disablePrvBtn = btnFlags.disablePrvBtn;
                                $scope.disableFirstBtn = btnFlags.disableFirstBtn;
                                $scope.disableLastBtn = btnFlags.disableLastBtn;
                                apiData = apiData.CircuitDetailSelected.results;
                                $scope.datagridMessage = "";
                                for (let i = 0; i < apiData.length; i++) {
                                    var objInputData = apiData[i];
                                    let objToInsert = {};
                                    objToInsert["circuitId"] = objInputData.CircuitID;
                                    objToInsert["numberOfTransformers"] = objInputData.NoOfTransformerAllocated;
                                    objToInsert["substationId"] = objInputData.SubstationID;
                                    objToInsert["substationAdd"] = objInputData.Address;
                                    objToInsert["kvaRating"] = objInputData.KVARating;
                                    objToInsert["substationName"] = objInputData.SubstationName;
                                    objToInsert["country"] = objInputData.Country;
                                    objToInsert["state"] = objInputData.State;
                                    objToInsert["city"] = objInputData.City;
                                    objToInsert["zipcode"] = objInputData.ZipCode;
                                    objToInsert["latitude"] = objInputData.Latitude;
                                    objToInsert["longitude"] = objInputData.Longitude;
                                    configurationData.push(objToInsert);
                                }
                                $scope.circuitGroupingOptions.data = configurationData;
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
                $scope.nxtPageBtnClick = function () {
                    if ($scope.pagination.currentTablePage < $scope.pagination.totalTablePages && $scope.pagination.totalTablePages > 0) {
                        let nextAPIPage = ++$scope.pagination.currentTablePage;
                        $scope.disablePrvBtn = false;
                        $scope.initializeDTCTable(nextAPIPage, $scope.pagination.currentTablePaginationSize);
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
                        $scope.initializeDTCTable(prevAPIPage, $scope.pagination.currentTablePaginationSize);
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
                        $scope.initializeDTCTable(firstPage, $scope.pagination.currentTablePaginationSize);
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
                        $scope.initializeDTCTable(lastPage, $scope.pagination.currentTablePaginationSize);
                    } else {
                        {
                            $scope.disablePrvBtn = true;
                            $scope.disableNxtBtn = false;
                        }
                    }
                }

                $scope.paginationBoxChanges = function () {
                    if ($scope.pagination.currentTablePage) {
                        $scope.initializeDTCTable($scope.pagination.currentTablePage, $scope.pagination.currentTablePaginationSize);
                    } else {
                        $scope.pagination.currentTablePage = 1;
                        $scope.initializeDTCTable($scope.pagination.currentTablePage, $scope.pagination.currentTablePaginationSize);
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
                  * Function to View circuit information
                  *
                  * @param row - selected row
                  * @return Nil
                */
                vm.viewCircuitInfo = function (row) {
                    objCacheDetails.data.selectedData = row.entity;
                    $uibModal.open({
                        templateUrl: '/templates/circuitInfoGrouping.html',
                        controller: 'circuitInfoGroupingCtrl',
                        size: 'lg',
                        backdrop: 'static',
                        keyboard: true,
                    });
                };
                /**
                  * @description
                  * Function to Map transformer information
                  *
                  * @param row - selected row
                  * @return Nil
                */
                vm.mapTransformerInfo = function (row) {
                    objCacheDetails.data.selectedCircuit = row.entity.circuitId;
                    $sessionStorage.put('selectedCircuit', row.entity.circuitId);
                    $state.go('system.grouping.transformerGrouping');
                };
                     /**
                     * Function to clear the  circuit entry
                     */
                    $scope.searchButtonClear =  function (searchtermInCircuitEntry) {
                        if(searchtermInCircuitEntry == ""){
                            $scope.searchTerm = '';
                            $scope.initializeDTCTable($scope.pagination.currentTablePage, $scope.pagination.currentTablePaginationSize);
                        }
                    }

                /**
                  * @description
                  * Function to Search circuit Group
                  *
                  * @param searchtermInCircuitGrouping - entered circuit id
                  * @return Nil
                */
                $scope.searchButton = function (searchtermInCircuitEntry) {
                    if (searchtermInCircuitEntry) {
                        $scope.searchTerm = searchtermInCircuitEntry;
                        $scope.pagination.currentTablePage = 1;
                        $scope.initializeDTCTable($scope.pagination.currentTablePage, $scope.pagination.currentTablePaginationSize);
                    } else {
                        $scope.searchTerm = '';
                        $scope.initializeDTCTable($scope.pagination.currentTablePage, $scope.pagination.currentTablePaginationSize);
                    }
                    angular.element(document.querySelector("div.ui-grid-selection-row-header-buttons")).removeClass("ui-grid-all-selected");
                    $scope.mySelectedRows.length = 0;
                };
            }]);
})(window.angular);