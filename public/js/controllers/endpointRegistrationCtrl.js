/**
 * @description
 * Controller for Registering endpoint
 */
(function (angular) {
    "use strict";
    angular.module('dataVINEApp').controller('endpointRegistrationCtrl',
        ["$scope", "$uibModal","$rootScope", 
            'DeviceService',
            'commonService','$templateCache' ,
            function ($scope, $uibModal,$rootScope,deviceService,commonService,$templateCache) {
                let currentDefaultTablePageSize = objCacheDetails.grid.paginationPageSize;
                var modalInstance = null;
                var endPointArray = [];
                $scope.isSelected = false;
                $scope.mySelectedRows = [];
                var circuitList = [];
                $scope.endpointRegOption = {};
                $scope.searchTerm = '';
                var arrData = [];

                $scope.pagination = {
                    totalRecordsInDBCount : 0,
                    currentTotalItems: 0,
                    apiCurrentPage: 1,
                    apiNextPage: 0,
                    currentTablePage: 1,
                    currentTablePaginationSize: objCacheDetails.grid.paginationPageSize,
                    totalTablePages: 1
                }
                $scope.circuitList = deviceService.getListOfCircuit();
                $scope.disableNxtBtn = true;
                $scope.disablePrvBtn = true;
                $scope.disableFirstBtn = true;
                $scope.disableLastBtn = true;

                $scope.initializeEndpointTable = function (pageNum)  {
                $scope.endpointRegOption.data = [];
                $scope.endpointRegOption = angular.copy(objCacheDetails.grid);
                $scope.endpointRegOption.exporterPdfOrientation = 'landscape',
                $scope.endpointRegOption.exporterPdfMaxGridWidth = 640;
                $scope.endpointRegOption.exporterCsvFilename = 'file.csv';                    
                $scope.endpointRegOption.exporterMenuCsv =  true;
                angular.element(document.querySelector("div.ui-grid-selection-row-header-buttons")).removeClass("ui-grid-all-selected");
                $scope.endpointRegOption.columnDefs = [
                    {
                        field: 'MacID',
                        displayName: 'MAC ID',
                        enableHiding: false,
                        sortingAlgorithm:commonService.getSortByString
                    },
                    {
                        field: 'CircuitID',
                        displayName: 'DTC',
                        enableHiding: false,
                        sortingAlgorithm: commonService.getSortByString, width: 180
                    },
                    {
                         field: 'Owner',
                         enableHiding: false,
                         sortingAlgorithm: commonService.getSortByString
                    },
                    {
                        field: 'Description',
                        enableHiding: false,
                        sortingAlgorithm: commonService.getSortByString
                    },
                    {
                        field: 'DeviceType',
                        displayName: 'Type',
                        enableHiding: false,
                        sortingAlgorithm: commonService.getSortByString
                    },
                    {
                        field: 'EndpointID',
                        enableHiding: true,
                        visible: false,
                        sortingAlgorithm: commonService.getSortByString
                    },
                    {
                        field: 'Actions',
                        cellTemplate: '<div class="ui-grid-cell-contents">' +
                            '<button type="button" class="btn ' +
                            'btn-xs btn-primary cellBtn" ' +
                            'ng-click="grid.appScope.viewEndPoint(row)" title="View"> ' +
                            ' <i class="fa fa-eye"></i></button> ' +
                            '&nbsp|&nbsp <button type="button" ' +
                            'class="btn btn-xs btn-primary cellBtn" ' +
                            'ng-click="grid.appScope.createOrEditEndPoint(\'edit\',row)" title="Edit">' +
                            ' <i class="fa fa-pencil-square-o" aria-hidden="true">' +
                            '</i></button> | &nbsp <button class="btn btn-xs btn-primary ' +
                            'cellBtn" ng-click="grid.appScope.deleteEndPointDetails(row,\'single\')" title="Delete">' +
                            ' <i class="fa fa-trash-o" aria-hidden="true"></i></button></div>',
                        enableColumnMenu: false, enableSorting: false,
                        enableHiding: false, width: 150
                    }
                ];
                $scope.endpointRegOption.exporterSuppressColumns = ['Actions'];
                $scope.endpointRegOption.onRegisterApi = function (gridApi) {
                    $scope.gridApi = gridApi;
                    commonService.getGridApi($scope, gridApi);
                    gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {
                        $scope.pagination.currentTablePaginationSize = pageSize;
                        $scope.pagination.totalTablePages = Math.ceil($scope.pagination.currentTotalItems / pageSize);
                        pageNum = 1;
                        $scope.pagination.currentTablePage = 1;
                        initEndpointDetails(pageNum, $scope.pagination.currentTablePaginationSize);
                    });
                };
                initEndpointDetails(pageNum, $scope.pagination.currentTablePaginationSize);

                $templateCache.put('ui-grid/pagination', commonService.getModifiedTable());
            }
            $scope.initializeEndpointTable($scope.pagination.apiCurrentPage, currentDefaultTablePageSize);
                /**
                 * Function to initialize endpoint details
                 */
                function initEndpointDetails(pageNum, limit) {
                    arrData.length = 0;
                    //$scope.searchterm = '';
                    $scope.endpointRegOption.data = [];
                    endPointArray = [];
                    deviceService.getAllEndPointDetails($scope.searchTerm, pageNum, limit)
                        .then(function (apiData) {
                            if (!angular.isUndefinedOrNull(apiData) && apiData.type) {
                                arrData.length = 0;
                                $scope.pagination.currentTotalItems = apiData.EndpointDetails.results.length;
                                $scope.pagination.apiCurrentPage = pageNum;
                                $scope.pagination.totalRecordsInDBCount = apiData.EndpointDetails.totalRecords;
                                $scope.pagination.totalTablePages = Math.ceil($scope.pagination.totalRecordsInDBCount / $scope.pagination.currentTablePaginationSize);

                                let btnFlags = commonService.getBtnStatus($scope.pagination.currentTablePage, $scope.pagination.totalTablePages);
                                $scope.disableNxtBtn = btnFlags.disableNxtBtn;
                                $scope.disablePrvBtn = btnFlags.disablePrvBtn;
                                $scope.disableFirstBtn = btnFlags.disableFirstBtn;
                                $scope.disableLastBtn = btnFlags.disableLastBtn;

                                apiData = apiData.EndpointDetails.results;
                                $scope.commonMsg = "";
                                for (let i = 0; i < apiData.length; i++) {
                                    let objToInsert = {};
                                    objToInsert['MacID'] = apiData[i].MacID;
                                    objToInsert['CircuitID'] = apiData[i].CircuitID;
                                    objToInsert['Owner'] = apiData[i].Owner;
                                    objToInsert['Description'] = apiData[i].Description;
                                    objToInsert['DeviceType'] = apiData[i].DeviceType;
                                    objToInsert['EndpointID'] = apiData[i].EndpointID;
                                    arrData.push(objToInsert);
                                }
                                $scope.endpointRegOption.data = arrData;
                            } else if (apiData.type == false) {
                                $scope.disableNxtBtn = true;
                                $scope.disablePrvBtn = true;
                                $scope.disableFirstBtn = true;
                                $scope.disableLastBtn = true;
                                $scope.pagination.totalRecordsInDBCount = 0;
                                $scope.pagination.totalTablePages = 1;
                                $scope.commonMsg = "No data found!";
                            } else {
                                $scope.commonMsg = "";
                            }
                        });
                }
                $scope.nxtPageBtnClick = function () {
                    if ($scope.pagination.currentTablePage < $scope.pagination.totalTablePages && $scope.pagination.totalTablePages > 0) {
                        let nextAPIPage = ++$scope.pagination.currentTablePage;
                        $scope.disablePrvBtn = false;
                        $scope.initializeEndpointTable(nextAPIPage, $scope.pagination.currentTablePaginationSize);
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
                        $scope.initializeEndpointTable(prevAPIPage, $scope.pagination.currentTablePaginationSize);
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
                        $scope.initializeEndpointTable(firstPage, $scope.pagination.currentTablePaginationSize);
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
                        $scope.initializeEndpointTable(lastPage, $scope.pagination.currentTablePaginationSize);
                    } else {
                        {
                            $scope.disablePrvBtn = true;
                            $scope.disableNxtBtn = false;
                        }
                    }
                }

                $scope.paginationBoxChanges = function () {
                    if ($scope.pagination.currentTablePage) {
                        $scope.initializeEndpointTable($scope.pagination.currentTablePage, $scope.pagination.currentTablePaginationSize);
                    } else {
                        $scope.pagination.currentTablePage = 1;
                        $scope.initializeEndpointTable($scope.pagination.currentTablePage, $scope.pagination.currentTablePaginationSize);
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
                 * Function to create or edit endpoint  by
                 * opening a pop-up
                 * 
                 * @param type
                 * @param row
                 * @return Nil
                
                 */
                $scope.createOrEditEndPoint = function (type, row) {
                    objCacheDetails.data.endpointData =
                        (type === 'edit') ? angular.copy(row.entity) : {};
                    objCacheDetails.data.endpointData.circuitList = $scope.circuitList;
                    $uibModal.open({
                        templateUrl: 'templates/createEndpoint.html',
                        controller: 'addOrEditEndpoint',
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
                        $scope.initializeEndpointTable($scope.pagination.apiCurrentPage, currentDefaultTablePageSize);
                    }, function (callApi) {                        
                        if(callApi) {
                        $scope.mySelectedRows.length = 0;
                        $scope.initializeEndpointTable($scope.pagination.apiCurrentPage, currentDefaultTablePageSize);
                        }
                    });
                };

                /**
                 * @description
                 * Function to view endpoint in a pop-up
                 *
                 * @param row
                 * @return Nil
                 
                 */
                $scope.viewEndPoint = function (row) {
                    $uibModal.open({
                        template: '<div id="print-content">' +
                            '<div class="modal-header">' +
                            '<h4 class="modal-title">' +
                            '<strong>Endpoint Details (MAC ID - {{viewEndopintData.MacID}})</strong>' +
                            '</h4></div> <div class="container-fluid ' +
                            'modalBackground"><div class="modal-body">' +
                            '<div class="container-fluid">' +
                            '<div class="row"><form name="billingDetails_form" ' +
                            ' novalidate><div class="col-md-12">' +
                            '<table class="table table-hover"><tr><td>' +
                            '<label>DTC</label></td><td><label>' +
                            '<span ng-bind="viewEndopintData.CircuitID">' +
                            '</span></label></td></tr> <tr><td>' +
                            '<label>Owner</label></td><td><label>' +
                            '<span ng-bind="viewEndopintData.Owner">' +
                            '</span></label></td></tr><tr><td>' +
                            '<label>Mac ID</label></td><td><label>' +
                            '<span ng-bind="viewEndopintData.MacID">' +
                            '</span></label></td> </tr><tr><td>' +
                            '<label>Description</label></td><td><label>' +
                            '<span ng-bind="viewEndopintData.Description">' +
                            '</span></label></td> </tr><tr><td>' +
                            '<label>Type</label></td><td><label>' +
                            '<span ng-bind="viewEndopintData.DeviceType">' +
                            '</span></label></td></tr></table></div>' +
                            '</form></div></div></div> </div>' +
                            '<div class="modal-footer"><button type="button" ' +
                            'class="btn btn-default btnDefault" ' +
                            'ng-click="closeWindow()">OK</button></div></div>',
                        controller: function ($scope, $modalInstance) {
                            $scope.viewEndopintData = row.entity;
                            $scope.closeWindow = function () {
                                $modalInstance.dismiss();
                            };
                        },
                        size: 'lg',
                        backdrop: 'static',
                        keyboard: true,
                    }).result.then(function () {
                        $scope.mySelectedRows.length = 0;
                        $scope.initializeEndpointTable($scope.pagination.apiCurrentPage, currentDefaultTablePageSize);
                    }, function (callApi) {                        
                        if(callApi) {
                            $scope.mySelectedRows.length = 0;
                            $scope.initializeEndpointTable($scope.pagination.apiCurrentPage, currentDefaultTablePageSize);
                        }
                    });
                };

                /**
                 * @description
                 * Function to upload endpoint details
                 *
                 * @param size
                 * @return Nil
                
                 */
                $scope.uploadEndpointDetails = function (size) {
                    objCacheDetails.data.endpointData = {};
                    deviceService.getCircuitList().then(function (objData) {
                        circuitList = [];
                        if (!angular.isUndefinedOrNull(objData)) {
                            for (var i = 0; i < objData.CircuitDetails.length; i++) {
                                var objToInsert = {};
                                objToInsert["CircuitNumber"] =
                                    objData.CircuitDetails[i].CircuitNumber;
                                objToInsert["circuitId"] =
                                    objData.CircuitDetails[i].CircuitID;
                                circuitList.push(objToInsert);
                            }
                        }
                        objCacheDetails.data.endpointData.circuitList = circuitList;
                        $uibModal.open({
                            templateUrl: '/templates/openUploadConfiguration.html',
                            controller: 'uploadCtrl',
                            size: size,
                            backdrop: 'static',
                            keyboard: true,
                            resolve: {
                                uploadParam: function () {
                                    return {
                                        type: 'endpointReg',
                                        endPoint: 'NewEndpointEntry'
                                    };
                                }
                            }
                        }).result.then(function () {
                            $scope.mySelectedRows.length = 0;
                            $scope.initializeEndpointTable($scope.pagination.apiCurrentPage, currentDefaultTablePageSize);
                        }, function (callApi) {                        
                            if(callApi) {
                                $scope.mySelectedRows.length = 0;
                            $scope.initializeEndpointTable($scope.pagination.apiCurrentPage, currentDefaultTablePageSize);
                            }
                        });
                    });
                };

                /**
                 * @description
                 * Function to delete endpoint details after confirmation by 
                 * opening a pop-up
                 *
                 * @param row
                 * @param type
                 * @return Nil
                
                 */
                $scope.deleteEndPointDetails = function (row, type) {
                    swal({
                        title: "Delete Endpoint",
                        text: "Are you sure you want to remove ?",
                        showCancelButton: true,
                        confirmButtonColor: 'black',
                        confirmButtonText: 'Delete',
                        cancelButtonText: "Cancel",
                        cancelButtonColor: 'white',
                    }, function (isConfirm) {
                        if (isConfirm) {
                            var selectedEndpoint = [];
                            if (type === 'single') {
                                selectedEndpoint = [row.entity.EndpointID];
                            } else {
                                for (var i = 0; i < $scope.mySelectedRows.length; i++) {
                                    selectedEndpoint.push(
                                        $scope.mySelectedRows[i].EndpointID
                                    );
                                }
                            }
                            deviceService.deleteEndPointDetails(selectedEndpoint)
                                .then(function (objData)
                                {
                                    swal(objData);
                                    $scope.mySelectedRows.length = 0;
                                    let pagenum = 1;
                                    $scope.pagination.currentTablePage = 1;
                                    $scope.initializeEndpointTable(pagenum, currentDefaultTablePageSize);
                                });
                        } else {
                            $scope.mySelectedRows.length = 0;
                            $scope.initializeEndpointTable($scope.pagination.apiCurrentPage, currentDefaultTablePageSize);
                        }
                    });
                };
                 /**
                     * Function to clear the  endpoint entry search
                     */
                    $scope.searchButtonClear =  function (searchtermInCircuitEntry) {
                        if(searchtermInCircuitEntry == ""){
                            $scope.searchTerm = '';
                            $scope.initializeEndpointTable($scope.pagination.currentTablePage, $scope.pagination.currentTablePaginationSize);
                        }
                    }

                /**
                 * @description
                 * Function to search endpoints in grid
                 *
                 * @param searchValue
                 * @return Nil
                
                 */
                $scope.searchButton = function (searchtermInCircuitEntry) {
                    if (searchtermInCircuitEntry) {
                        $scope.searchTerm = searchtermInCircuitEntry;
                        $scope.pagination.currentTablePage = 1;
                        $scope.initializeEndpointTable($scope.pagination.currentTablePage, $scope.pagination.currentTablePaginationSize);
                    } else {
                        $scope.searchTerm = '';
                        $scope.initializeEndpointTable($scope.pagination.currentTablePage, $scope.pagination.currentTablePaginationSize);
                    }
                    angular.element(document.querySelector("div.ui-grid-selection-row-header-buttons")).removeClass("ui-grid-all-selected");
                    $scope.mySelectedRows.length = 0;
                }
            }]);
})(window.angular);
