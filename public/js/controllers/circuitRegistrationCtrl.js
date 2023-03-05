/**
  * @this vm
  * @ngdoc controller
  * @name dataVINEApp.controller:circuitRegistrationCtrl
  *
  * @description
  * Controller to Register circuit
*/
(function (angular) {
    "use strict";
    angular.module('dataVINEApp')

        .controller('circuitRegistrationCtrl',
            ['$scope', '$rootScope', '$uibModal', '$state',
                '$filter', '$timeout', 'DeviceService', 'refreshservice',
                'commonService', '$templateCache',
                function ($scope, $rootScope,
                    $uibModal, $state, $filter, $timeout,
                    deviceService, refreshservice, commonService, $templateCache) {
                    let currentDefaultTablePageSize = objCacheDetails.grid.paginationPageSize;
                    var modalInstance = null;
                    var configurationData = [];
                    $scope.isSelected = false;
                    $scope.mySelectedRows = [];
                    var vm = this;
                    $scope.isCollapsed = false;
                    $scope.searchTerm = '';
                    var arrData = [];
                    $scope.configOptions = {};

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

                    $scope.initializeDTCTable = function (pageNum) {
                        $scope.configOptions.data = [];
                        $scope.configOptions = angular.copy(objCacheDetails.grid);
                        $scope.configOptions.exporterPdfOrientation = 'landscape';
                        $scope.configOptions.exporterPdfMaxGridWidth = 640;
                        $scope.configOptions.exporterCsvFilename = 'file.csv';
                        $scope.configOptions.exporterMenuCsv = true;
                        angular.element(document.querySelector("div.ui-grid-selection-row-header-buttons")).removeClass("ui-grid-all-selected");
                        $scope.configOptions.columnDefs = [{
                            field: 'circuitId', displayName: 'DTC ID',
                            enableHiding: false,
                            sortingAlgorithm: commonService.getSortByString, width: 180
                        }, {
                            field: 'kvaRating', displayName: 'KVA Rating',
                            type: 'number', enableHiding: false,
                            sortingAlgorithm: commonService.getSortByString
                        }, {
                            field: 'substationId', displayName: 'Sub-Station ID',
                            enableHiding: false,
                            sortingAlgorithm: commonService.getSortByString
                        }, {
                            field: 'substationAdd', displayName: 'Sub-Station Address',
                            enableHiding: false,
                            sortingAlgorithm: commonService.getSortByString
                        }, {
                            field: 'substationName', displayName: 'Sub-Station Name',
                            enableHiding: false, visible: false,
                            sortingAlgorithm: commonService.getSortByString
                        }, {
                            field: 'country', displayName: 'Country', enableHiding: false,
                            visible: false
                        }, {
                            field: 'state', displayName: 'State', enableHiding: false,
                            visible: false
                        }, {
                            field: 'city', displayName: 'City', enableHiding: false,
                            visible: false
                        }, {
                            field: 'zipcode', displayName: 'Zip Code', enableHiding: false,
                            visible: false
                        }, {
                            field: 'Latitude', displayName: 'Latitude', enableHiding: false,
                            visible: false
                        }, {
                            field: 'Longitude', displayName: 'Longitude', enableHiding: false,
                            visible: false
                        }, {
                            field: 'Actions',
                            cellTemplate: '<div class="ui-grid-cell-contents"><button type="button" ' +
                                'class="btn btn-xs btn-primary cellBtn" ' +
                                'ng-click="grid.appScope.vm.viewCircuitEntry(row)" title="View">  ' +
                                '<i class="fa fa-eye" aria-hidden="true"></i></button> ' +
                                '&nbsp |&nbsp <button type="button" class="btn btn-xs ' +
                                'btn-primary cellBtn" ng-click="grid.appScope.editCircuit(row)" title="Edit">' +
                                ' <i class="fa fa-pencil-square-o" aria-hidden="true"></i>' +
                                '</button>&nbsp | &nbsp <button class="btn btn-xs btn-primary cellBtn" ' +
                                'ng-click="grid.appScope.vm.deleteCircuit(row)" title="Delete"> ' +
                                '<i class="fa fa-trash-o" aria-hidden="true"></i></button></div>',
                            enableColumnMenu: false, enableSorting: false, enableHiding: false, width: 150
                        }];
                        $scope.configOptions.exporterSuppressColumns = ['Actions'];
                        $scope.configOptions.onRegisterApi = function (gridApi) {
                            $scope.gridApi = gridApi;
                            commonService.getGridApi($scope, gridApi);
                            gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {
                                $scope.pagination.currentTablePaginationSize = pageSize;
                                $scope.pagination.totalTablePages = Math.ceil($scope.pagination.currentTotalItems / pageSize);
                                pageNum = 1;
                                $scope.pagination.currentTablePage = 1;
                                initDtcDetails(pageNum, $scope.pagination.currentTablePaginationSize);
                            });
                        };
                        initDtcDetails(pageNum, $scope.pagination.currentTablePaginationSize);
                        $templateCache.put('ui-grid/pagination', commonService.getModifiedTable());
                    }
                    $scope.initializeDTCTable($scope.pagination.apiCurrentPage, currentDefaultTablePageSize);
                    /**
                     * Function to initialize curcuit details
                     */
                    function initDtcDetails(pageNum, limit) {
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
                                    $scope.commonMsg = "";
                                    for (let i = 0; i < apiData.length; i++) {
                                        let objToInsert = {};
                                        objToInsert["CircuitNumber"] = apiData[i].CircuitNumber;
                                        objToInsert["circuitId"] = apiData[i].CircuitID;
                                        objToInsert["kvaRating"] = apiData[i].KVARating;
                                        objToInsert["substationId"] = apiData[i].SubstationID;
                                        objToInsert["substationAdd"] = apiData[i].Address;
                                        objToInsert["substationName"] = apiData[i].SubstationName;
                                        objToInsert["country"] = apiData[i].Country;
                                        objToInsert["state"] = apiData[i].State;
                                        objToInsert["city"] = apiData[i].City;
                                        objToInsert["zipcode"] = apiData[i].ZipCode;
                                        objToInsert["Latitude"] = apiData[i].Latitude;
                                        objToInsert["Longitude"] = apiData[i].Longitude;
                                        objToInsert["CircuitNote"] = apiData[i].CircuitNote;
                                        configurationData.push(objToInsert);
                                    }
                                    $scope.configOptions.data = configurationData;
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
                     * Function to create new circuit configuration
                     */
                    $scope.create = function () {
                        objCacheDetails.data.configurationData = configurationData;
                        modalInstance = $uibModal.open({
                            templateUrl: 'templates/createCircuit.html',
                            controller: 'newCircuitConfigurationCtrl',
                            size: 'lg',
                            backdrop: 'static',
                            keyboard: true
                        });
                        modalInstance.result.then(function () {
                            $scope.mySelectedRows.length = 0;
                            $scope.initializeDTCTable($scope.pagination.apiCurrentPage, currentDefaultTablePageSize);
                        }, function (callApi) {
                            if (callApi) {
                                $scope.mySelectedRows.length = 0;
                                $scope.initializeDTCTable($scope.pagination.apiCurrentPage, currentDefaultTablePageSize);
                            }
                        });
                    };

                    /**
                      * @description
                      * Function to view circuit entry in a pop-up
                      *
                      * @param row - selected row data
                      * @return Nil
                    */
                    vm.viewCircuitEntry = function (row) {
                        objCacheDetails.data.ID = row.entity.ID;
                        objCacheDetails.data.selectedData = row.entity;
                        modalInstance = $uibModal.open({
                            templateUrl: '/templates/viewCircuitEntry.html',
                            controller: 'viewCircuitEntryCtrl',
                            size: 'lg',
                            backdrop: 'static',
                            keyboard: true,
                        });
                        modalInstance.result.then(function () {
                            $scope.mySelectedRows.length = 0;
                            init();
                        }, function (callApi) {
                            if (callApi) {
                                $scope.mySelectedRows.length = 0;
                                init();
                            }
                        });
                    };

                    /**
                     * Function to edit circuit details
                     */
                    $scope.editCircuit = function (row) {
                        objCacheDetails.data.configurationData = configurationData;
                        objCacheDetails.data.selectedData = row.entity;
                        modalInstance = $uibModal.open({
                            templateUrl: 'templates/createCircuit.html',
                            controller: 'newCircuitConfigurationCtrl',
                            size: 'lg',
                            backdrop: 'static',
                            keyboard: true
                        });
                        modalInstance.result.then(function () {
                            $scope.mySelectedRows.length = 0;
                            $scope.initializeDTCTable($scope.pagination.apiCurrentPage, currentDefaultTablePageSize);
                        }, function (callApi) {
                            if (callApi) {
                                $scope.mySelectedRows.length = 0;
                                $scope.initializeDTCTable($scope.pagination.apiCurrentPage, currentDefaultTablePageSize);
                            }
                        });
                    };

                    /**
                     * Function to create a new circuit
                     */
                    $scope.openNewConfiguration = function () {
                        objCacheDetails.data.configurationData = configurationData;
                        $state.go('createCircuit');
                    };

                    /**                      
                     * Function to upload configuration                     
                     */
                    $scope.openUploadConfiguration = function (size) {
                        modalInstance = $uibModal.open({
                            templateUrl: '/templates/openUploadConfiguration.html',
                            controller: 'uploadCtrl',
                            size: size,
                            backdrop: 'static',
                            keyboard: true,
                            resolve: {
                                uploadParam: function () {
                                    return { type: 'circuit', endPoint: 'NewCircuitEntry' };
                                }
                            }
                        });
                        modalInstance.result.then(function () {
                            $scope.mySelectedRows.length = 0;
                            $scope.initializeDTCTable($scope.pagination.apiCurrentPage, currentDefaultTablePageSize);
                        }, function (callApi) {
                            if (callApi) {
                                $scope.mySelectedRows.length = 0;
                                $scope.initializeDTCTable($scope.pagination.apiCurrentPage, currentDefaultTablePageSize);
                            }
                        });
                    };

                    /**
                     * Function to delete circuit
                     */
                    $scope.deleteSelectedCircuits = function () {
                        swal({
                            title: "Delete DTC", text: "Deleting the DTC's will remove connection between the devices. Are you sure you want to remove ?",
                            showCancelButton: true,
                            confirmButtonColor: 'black',
                            confirmButtonText: 'Delete',
                            cancelButtonText: "Cancel",
                            cancelButtonColor: 'white',
                        }, function (isConfirm) {
                            if (isConfirm) {
                                var selectedCircuits = [];
                                for (var i = 0; i < $scope.mySelectedRows.length; i++) {
                                    selectedCircuits.push($scope.mySelectedRows[i].circuitId);
                                }
                                deviceService.deleteCircuit(selectedCircuits).then(function (objData) {
                                    swal(objData);
                                    $scope.mySelectedRows.length = 0;
                                    $scope.initializeDTCTable($scope.pagination.apiCurrentPage, currentDefaultTablePageSize);
                                });
                            } else {
                                swal({ title: 'Warning', text: 'Please select a DTC to delete', type: "warning" });
                            }
                        });
                    };

                    /**
                      * @description
                      * Function to Delete Circuit by opening a pop-up
                      *
                      * @param row - selected row data
                      * @return Nil
                    */
                    vm.deleteCircuit = function (row) {
                        swal({
                            title: "Delete DTC", text: "Deleting the DTC's will remove connection between the devices. Are you sure you want to remove ?",
                            showCancelButton: true,
                            confirmButtonColor: 'black',
                            confirmButtonText: 'Delete',
                            cancelButtonText: "Cancel",
                            cancelButtonColor: 'white',
                        }, function (isConfirm) {
                            if (isConfirm) {
                                var arrInputData = [row.entity.circuitId];
                                deviceService.deleteCircuit(arrInputData).then(function (objData) {
                                    swal(objData);
                                    $scope.mySelectedRows.length = 0;
                                    $scope.initializeDTCTable($scope.pagination.apiCurrentPage, currentDefaultTablePageSize);
                                });
                            }
                        });
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
                         * Function to search circuit entry
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
                        }
                    /**
                      * @description
                      * Function to view group configuration details in a pop-up
                      *
                      * @param Nil
                      * @return Nil
                    */
                    vm.nameDetails = function () {
                        modalInstance = $uibModal.open({
                            templateUrl: '/templates/groupConfigurationDetail.html',
                            controller: 'groupConfigurationDetailCtrl',
                            size: 'md',
                            backdrop: 'static',
                            keyboard: true
                        });
                    };
                }]);
})(window.angular);