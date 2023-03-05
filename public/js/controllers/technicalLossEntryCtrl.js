/**
 * @description
 * Controller for Technical loss Configuration
 */
(function (angular) {
    "use strict";
    angular.module('dataVINEApp').controller('technicalLossEntryCtrl',
        ['$scope', '$uibModal', '$state', '$rootScope',
            '$filter', '$timeout', 'DeviceService', 'ParseService',
            'DeviceMappingService', 'commonService', '$sessionStorage', '$templateCache',
            function ($scope, $uibModal, $state, $rootScope,
                      $filter, $timeout, deviceService, parseService,
                      deviceMappingService, commonService, $sessionStorage, $templateCache) {
                $scope.transformerData = $sessionStorage.get('selectedTransformerForTechnicalLoss');
                let currentDefaultTablePageSize = objCacheDetails.grid.paginationPageSize;
                $scope.isSelected = false;
                $scope.mySelectedRows = [];
                let technicalLossData = [];
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
                let modalInstance = null;
                $scope.searchTerm = '';

                $scope.initTable = function (pageNum) {
                    $scope.technicalLossGrid = angular.copy(objCacheDetails.grid);
                    $scope.technicalLossGrid.data = [];
                    $scope.technicalLossGrid.exporterPdfOrientation = 'landscape';
                    $scope.technicalLossGrid.exporterPdfMaxGridWidth = 640;
                    angular.element(document.querySelector("div.ui-grid-selection-row-header-buttons")).removeClass("ui-grid-all-selected");
                    $scope.technicalLossGrid.exporterCsvFilename = 'file.csv';
                    $scope.technicalLossGrid.columnDefs = [
                        {
                            field: 'Name',
                            displayName: 'Name', enableHiding: false,
                            sortingAlgorithm: commonService.getSortByString, width: 180
                        },
                        {
                            field: 'Metered',
                            displayName: 'Metered', enableHiding: false,
                            sortingAlgorithm: commonService.getSortByString
                        },
                        {
                            field: 'UsagePerDay',
                            displayName: 'Usage Per Day (kW)',
                            enableHiding: false,
                            sortingAlgorithm: commonService.getSortByString
                        },
                        {
                            field: 'ConnectedItems',
                            displayName: 'No. of Connected Items',
                            enableHiding: false,
                            sortingAlgorithm: commonService.getSortByString
                        },
                        {
                            field: 'UsageTime',
                            displayName: 'Usage Time',
                            enableHiding: false,
                            sortingAlgorithm: commonService.getSortByString
                        }, {
                            field: 'StartHour',
                            displayName: 'Start Hour',
                            enableHiding: false,
                            sortingAlgorithm: commonService.getSortByString
                        }, {
                            field: 'EndHour',
                            displayName: 'End Hour',
                            enableHiding: false,
                            sortingAlgorithm: commonService.getSortByString
                        },
                        {
                            field: 'Actions',
                            cellTemplate: '<div class="ui-grid-cell-contents">' +
                                '<button type="button" ' +
                                'class="btn btn-xs btn-primary cellBtn"' +
                                ' ng-click="grid.appScope.viewTechnicalItemEntry(row)" title="View">' +
                                '  <i class="fa fa-eye"></i></button>' +
                                ' &nbsp|&nbsp <button type="button"' +
                                ' class="btn btn-xs btn-primary cellBtn"' +
                                ' ng-click="grid.appScope.createOrEditTechnicalLoss(\'edit\',row)" title="Edit">' +
                                ' <i class="fa fa-pencil-square-o"' +
                                ' aria-hidden="true"></i></button> | &nbsp ' +
                                ' <button class="btn btn-xs btn-primary cellBtn" ' +
                                ' ng-click="grid.appScope.deleteTechnicalItems(row,\'single\')" title="Delete">' +
                                ' <i class="fa fa-trash-o" aria-hidden="true">' +
                                '</i></button></div>',
                            enableColumnMenu: false, enableSorting: false,
                            enableHiding: false, width: 150
                        }
                    ];
                    $scope.technicalLossGrid.exporterSuppressColumns = ['Actions'];
                    $scope.technicalLossGrid.onRegisterApi = function (gridApi) {
                        $scope.gridApi = gridApi;
                        commonService.getGridApi($scope, gridApi);
                        gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {
                            $scope.pagination.currentTablePaginationSize = pageSize;
                            $scope.pagination.totalTablePages = Math.ceil($scope.pagination.currentTotalItems / pageSize);
                            pageNum = 1;
                            $scope.pagination.currentTablePage = 1;
                            initTechnicalList(pageNum, $scope.pagination.currentTablePaginationSize);
                        });
                    };
                    initTechnicalList(pageNum, $scope.pagination.currentTablePaginationSize);

                    $templateCache.put('ui-grid/pagination', commonService.getModifiedTable());
                }

                $scope.initTable($scope.pagination.apiCurrentPage, currentDefaultTablePageSize);

                let payloadFormatter = {
                    "All Day" : "allDay",
                    "allDay" : "All Day",
                    "custom" : "Custom",
                    "Custom" : "custom"
                }

                function initTechnicalList(pageNum, limit) {
                    technicalLossData.length = 0;
                    deviceService.fetchTechnicalLossData($scope.searchTerm,$scope.transformerData.transformerSl, pageNum, limit)
                        .then(function (apiData) {
                            if (!angular.isUndefinedOrNull(apiData) && apiData.type) {
                                technicalLossData.length = 0;
                                $scope.pagination.currentTotalItems = apiData.TechnicalItemDetailSelected.results.length;
                                $scope.pagination.apiCurrentPage = pageNum;
                                $scope.pagination.totalRecordsInDBCount = apiData.TechnicalItemDetailSelected.totalRecords;
                                $scope.pagination.totalTablePages = Math.ceil($scope.pagination.totalRecordsInDBCount / $scope.pagination.currentTablePaginationSize);
                                let btnFlags = commonService.getBtnStatus($scope.pagination.currentTablePage, $scope.pagination.totalTablePages);
                                $scope.disableNxtBtn = btnFlags.disableNxtBtn;
                                $scope.disablePrvBtn = btnFlags.disablePrvBtn;
                                $scope.disableFirstBtn = btnFlags.disableFirstBtn;
                                $scope.disableLastBtn = btnFlags.disableLastBtn;

                                apiData = apiData.TechnicalItemDetailSelected.results;
                                $rootScope.commonMsg = "";
                                for (var i = 0; i < apiData.length; i++) {
                                    let objToInsert = {};
                                    objToInsert["Name"] = apiData[i].Name;
                                    objToInsert["Metered"] = apiData[i].Metered;
                                    objToInsert["UsagePerDay"] = apiData[i].UsagePerDay;
                                    objToInsert["ConnectedItems"] = apiData[i].NoOfConnectedItems;
                                    objToInsert["UsageTime"] = payloadFormatter[apiData[i].UsageTime];
                                    objToInsert["StartHour"] = apiData[i].StartHour;
                                    objToInsert["EndHour"] = apiData[i].EndHour;
                                    objToInsert["TechnicalItemID"] = apiData[i].TechitemID;
                                    technicalLossData.push(objToInsert);
                                }
                                $scope.technicalLossGrid.data = technicalLossData;
                            } else if (apiData.type == false) {
                                $scope.disableNxtBtn = true;
                                $scope.disablePrvBtn = true;
                                $scope.disableFirstBtn = true;
                                $scope.disableLastBtn = true;
                                $scope.pagination.totalRecordsInDBCount = 0;
                                $rootScope.commonMsg = "No data found!";
                            } else {
                                $rootScope.commonMsg = "";
                            }
                        });
                }

                $scope.nxtPageBtnClick = function () {
                    if ($scope.pagination.currentTablePage < $scope.pagination.totalTablePages && $scope.pagination.totalTablePages > 0) {
                        let nextAPIPage = ++$scope.pagination.currentTablePage;
                        $scope.disablePrvBtn = false;
                        $scope.initTable(nextAPIPage, $scope.pagination.currentTablePaginationSize);
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
                        $scope.initTable(prevAPIPage, $scope.pagination.currentTablePaginationSize);
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
                        $scope.initTable(firstPage, $scope.pagination.currentTablePaginationSize);
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
                        $scope.initTable(lastPage, $scope.pagination.currentTablePaginationSize);
                    } else {
                        {
                            $scope.disablePrvBtn = true;
                            $scope.disableNxtBtn = false;
                        }
                    }
                }
                 $scope.paginationBoxChanges = function () {
                    if($scope.pagination.currentTablePage) {
                        $scope.initTable($scope.pagination.currentTablePage, $scope.pagination.currentTablePaginationSize);
                    } else {
                        $scope.pagination.currentTablePage = 1;
                        $scope.initTable($scope.pagination.currentTablePage, $scope.pagination.currentTablePaginationSize);
                    }
                }

                $scope.createOrEditTechnicalLoss = function (type, row) {
                    objCacheDetails.data.technicalLossData = (type === 'edit') ? angular.copy(row.entity) : {};
                    $uibModal.open({
                        templateUrl: 'templates/createTechnicalLoss.html',
                        controller: 'newTechnicalLossConfigurationCtrl',
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
                        $scope.initTable($scope.pagination.apiCurrentPage, currentDefaultTablePageSize);
                    }, function (callApi) {
                        if(callApi) {
                            $scope.mySelectedRows.length = 0;
                            $scope.searchterm = "";
                            $scope.initTable($scope.pagination.apiCurrentPage, currentDefaultTablePageSize);
                        }
                    });
                };

                $scope.openUploadTechnicalLoss = function (size) {
                    modalInstance = $uibModal.open({
                        templateUrl: '/templates/openUploadConfiguration.html',
                        controller: 'uploadCtrl',
                        size: size,
                        backdrop: 'static',
                        keyboard: true,
                        resolve: {
                            uploadParam: function () {
                                return {type: 'technicalLoss', endPoint: 'NewTransformerTechItemsEntry'};
                            }
                        }
                    });
                    modalInstance.result.then(function () {
                        $scope.mySelectedRows.length = 0;
                        $scope.initTable($scope.pagination.apiCurrentPage, currentDefaultTablePageSize);
                    }, function (callApi) {
                        if(callApi) {
                            $scope.mySelectedRows.length = 0;
                            $scope.initTable($scope.pagination.apiCurrentPage, currentDefaultTablePageSize);
                        }
                    });
                    $scope.dynamicPopover.isOpen = false;
                };

                $scope.deleteTechnicalItems = function (row, type) {
                    swal({
                        title: "Delete Technical Loss Item",
                        text: "Are you sure you want to remove ?",
                        showCancelButton: true,
                        confirmButtonColor: 'black',
                        confirmButtonText: 'Delete',
                        cancelButtonText: "Cancel",
                        cancelButtonColor: 'white',
                    }, function (isConfirm) {
                        if (isConfirm) {
                            let selectedTechnicalItems = [];
                            if (type === 'single') {
                                selectedTechnicalItems = [row.entity.TechnicalItemID];
                            } else {
                                $scope.mySelectedRows = $scope.gridApi.selection.getSelectedRows();
                                for (var i = 0; i < $scope.mySelectedRows.length; i++) {
                                    selectedTechnicalItems.push($scope.mySelectedRows[i].TechnicalItemID);
                                }
                            }
                            deviceService.deleteTechnicalLossDetails(selectedTechnicalItems)
                                .then(function (objData) {
                                    swal(objData);
                                    $scope.mySelectedRows.length = 0;
                                    $scope.initTable($scope.pagination.apiCurrentPage, currentDefaultTablePageSize);
                                    $scope.searchterm = "";
                                });
                        }
                    });
                };


                $scope.viewTechnicalItemEntry = function (row) {
                    objCacheDetails.data.technicalLossData = row.entity;
                    $uibModal.open({
                        templateUrl: '/templates/technicalLossItemDetails.html',
                        controller: 'technicalLossItemCtrl',
                        size: 'md',
                        backdrop: 'static',
                        keyboard: true
                    });
                };
                //searching the data
                $scope.searchButtonClear =  function (searchTerm) {
                    if(searchTerm == ""){
                        $scope.searchTerm = '';
                        initTechnicalList($scope.pagination.currentTablePage, $scope.pagination.currentTablePaginationSize);
                    }
                }
                $scope.searchTechnicalLossGrid = function (searchTerm) {
                    if(searchTerm) {
                        $scope.searchTerm = searchTerm;
                        $scope.pagination.currentTablePage = 1;
                        initTechnicalList($scope.pagination.currentTablePage, $scope.pagination.currentTablePaginationSize);
                    } else {
                        $scope.searchTerm = '';
                        initTechnicalList($scope.pagination.currentTablePage, $scope.pagination.currentTablePaginationSize);
                    }
                    angular.element(document.querySelector("div.ui-grid-selection-row-header-buttons")).removeClass("ui-grid-all-selected");
                        $scope.mySelectedRows.length = 0;
                };

                $scope.$on('$destroy', function () {
                    $templateCache.put('ui-grid/pagination', commonService.setDefaultTable());
                });

                $scope.goToURL = function () {
                    $state.go('system.registration.transformerEntry');
                }

            }]);
})(window.angular);
