/**
 * @description
 * Controller for HS Group Management
 */
(function (angular) {
    "use strict";
    angular.module('dataVINEApp').controller('groupManagementCtrl',
        ['$scope', '$rootScope', '$timeout', '$uibModal', '$state',
            'hypersproutMgmtService', 'commonService','$filter', '$templateCache' ,
            function ($scope, $rootScope, $timeout, $uibModal,
                $state, hypersproutConfigService, commonService, $filter, $templateCache) {
                var vm = this;
                var modalInstance = null;
                let currentDefaultTablePageSize = objCacheDetails.grid.paginationPageSize;
                let tableData = [];

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

                $scope.initTable = function (pageNum) {
                    $scope.groupOptions = angular.copy(objCacheDetails.grid);
                    $scope.groupOptions.data = [];
                    $scope.groupOptions.exporterPdfOrientation = 'landscape';
                    $scope.groupOptions.exporterPdfMaxGridWidth = 640;
                    $scope.groupOptions.exporterCsvFilename = 'file.csv';
                    $scope.groupOptions.columnDefs = [
                        {
                            field: 'Group_Name', width: '17%',
                            cellTemplate: '<div class="ui-grid-cell-contents">' +
                                '<a class="anchorUIGrid" ' +
                                ' ng-click="grid.appScope.vm.groupDetails(row)">' +
                                '{{row.entity.Group_Name}} </a> </div>',
                            enableHiding: false
                        },
                        // { field: 'Group Type', width: '17%', enableHiding: false },
                        { field: 'Members', width: '17%', enableHiding: false },
                        { field: 'Description', enableHiding: false },
                        {
                            field: 'Action', enableColumnMenu: false,
                            width: '10%',
                            cellTemplate: '<div class="ui-grid-cell-contents" ' +
                                'ng-hide="row.entity.ClassName=== \'unknown\'">' +
                                '<button type="button" ' +
                                ' class="btn btn-xs btn-primary cellBtn" ' +
                                'ng-class="(row.entity.Members>0)? \'allow\' : \'not-allow\'" ' +
                                ' ng-click="(row.entity.Members>0)&&grid.appScope.vm.downloadConfigurations(row)" title="Download"> ' +
                                '  <i class="fa fa-download" aria-hidden="true"></i></button> ' +
                                '&nbsp|&nbsp; <button type="button" ' +
                                'class="btn btn-xs btn-primary cellBtn" ' +
                                'ng-class="!(row.entity.Members>0)? \'allow\' : \'not-allow\'" ' +
                                'ng-click="!(row.entity.Members>0)&&grid.appScope.vm.deleteConfiguration(row)" title="Delete"> ' +
                                '  <i class="fa fa-remove" aria-hidden="true"></i></button></div>',
                            enableHiding: false, enableSorting: false
                        }
                    ];
                    $scope.groupOptions.exporterSuppressColumns = ['Actions'];
                    $scope.groupOptions.onRegisterApi = function (gridApi) {
                        $scope.gridApi = gridApi;
                        gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {
                            $scope.pagination.currentTablePaginationSize = pageSize;
                            $scope.pagination.totalTablePages = Math.ceil($scope.pagination.currentTotalItems / pageSize);
                            pageNum = 1;
                            $scope.pagination.currentTablePage = 1;
                            initData(pageNum, $scope.pagination.currentTablePaginationSize);
                        });
                    };

                    initData(pageNum, $scope.pagination.currentTablePaginationSize);

                    $templateCache.put('ui-grid/pagination', commonService.getModifiedTable());
                }

                $scope.initTable($scope.pagination.apiCurrentPage, currentDefaultTablePageSize);

                function initData(pageNum, limit) {
                    hypersproutConfigService.getGroupManagementData(pageNum, limit)
                        .then(function (apiData) {
                            if (!angular.isUndefinedOrNull(apiData) && apiData.type) {
                                tableData.length = 0;
                                $scope.pagination.currentTotalItems = apiData.ApplicationIDs.results.length;
                                $scope.pagination.apiCurrentPage = pageNum;
                                $scope.pagination.totalRecordsInDBCount = apiData.ApplicationIDs.totalRecords;
                                $scope.pagination.totalTablePages = Math.ceil($scope.pagination.totalRecordsInDBCount / $scope.pagination.currentTablePaginationSize);

                                let btnFlags = commonService.getBtnStatus($scope.pagination.currentTablePage, $scope.pagination.totalTablePages);
                                $scope.disableNxtBtn = btnFlags.disableNxtBtn;
                                $scope.disablePrvBtn = btnFlags.disablePrvBtn;
                                $scope.disableFirstBtn = btnFlags.disableFirstBtn;
                                $scope.disableLastBtn = btnFlags.disableLastBtn;

                                apiData = apiData.ApplicationIDs.results;
                                $rootScope.commonMsg = "";
                                for (var i = 0; i < apiData.length; i++) {
                                    let objToInsert = {};
                                    objToInsert["Group_Name"] = apiData[i].GroupName;
                                    objToInsert["Group_Type"] = apiData[i].Type;
                                    objToInsert["GroupID"] = apiData[i].GroupID;
                                    objToInsert["Members"] = apiData[i].Members;
                                    objToInsert["Description"] = apiData[i].Description;
                                    tableData.push(objToInsert);
                                }
                                $scope.groupOptions.data = tableData;
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

                $scope.$on('$destroy', function () {
                    $templateCache.put('ui-grid/pagination', commonService.setDefaultTable());
                });

                vm.groupDetails = function (row) {
                    if (angular.isUndefinedOrNull(
                        objCacheDetails.data.configgroupDetails)) {
                        objCacheDetails.data.configgroupDetails = {};
                    }
                    objCacheDetails.data.configgroupDetails.selectedRow = row.entity;
                    modalInstance = $uibModal.open({
                        templateUrl: '/templates/groupConfigurationDetails_groupManagement.html',
                        controller: 'groupConfigurationDetails_groupManagementCtrl',
                        size: 'md',
                        backdrop: 'static',
                        keyboard: true,
                        resolve: {
                            data: hypersproutConfigService.ListDevicesAttached(
                                row.entity.GroupID,
                                'HyperSprout',
                                'Application Group').then(function (resObj) {
                                    var objArray = [];
                                    if (resObj.hasOwnProperty('SerialNumbers')) {
                                        return $scope.HyperSproutList = resObj.SerialNumbers;
                                    } return ['No Serial numbers found'];
                                }),
                            type: function () {
                                return 'HyperSprout';
                            }
                        }
                    });
                };

                /**
                 *  @description
                 * Function to add endpoint by
                 * opening a pop-up
                 *
                 * @param size
                 * @return Nil
                 
                 */
                $scope.openAddEndpoint = function (size) {
                    modalInstance = $uibModal.open({
                        templateUrl: '/templates/addEndpoint.html',
                        controller: 'addEndpointCtrl',
                        size: size,
                        backdrop: 'static',
                        keyboard: true
                    });
                    $scope.dynamicPopover.isOpen = false;
                };

                /**
                 *  @description
                 * Function to assign endpoint by
                 * opening a pop-up
                 *
                 * @param size
                 * @return Nil
                 
                 */
                $scope.openAssignEndpoint = function (size) {
                    modalInstance = $uibModal.open({
                        templateUrl: '/templates/assignEndpoint.html',
                        controller: 'assignEndpointCtrl',
                        size: size,
                        backdrop: 'static',
                        keyboard: true,
                        resolve: {
                            type: function () {
                                return 'HyperSprout';
                            }
                        }
                    });
                    modalInstance.result.then(function () {
                        $scope.pagination.currentTablePage = 1;
                        $scope.initTable($scope.pagination.currentTablePage, $scope.pagination.currentTablePaginationSize);
                    }, function (callApi) {
                        if(callApi){
                            $scope.pagination.currentTablePage = 1;
                        $scope.initTable($scope.pagination.currentTablePage, $scope.pagination.currentTablePaginationSize);
                        }
                    });
                    $scope.dynamicPopover.isOpen = false;
                };

                /**
                 * @description
                 * Function to print
                 *
                 * @param Nil
                 * @return Nil
                 
                 */
                $scope.printCart = function () {
                    window.print();
                };

                /**
                 * @description
                 * Function to download configuration
                 *
                 * @param row
                 * @return Nil
                 
                 */
                vm.downloadConfigurations = function (row) {
                    hypersproutConfigService.HsmGroupDownload("AppGroupDownload", [row.entity.GroupID, 'HyperSprout']).then(function (objData) {
                        if (objData.type) {
                            swal(commonService.addTrademark(objData.Status));
                        } else {
                            swal(commonService.addTrademark(objData.Message));
                        }
                    });
                };

                /**
                 * @description
                 * Function to delete configuration by
                 * opening pop-up
                 *
                 * @param row
                 * @return Nil
                 
                 */
                vm.deleteConfiguration = function (row) {
                    swal({
                        title: "Warning!", text: "Are you sure you want to delete?",
                        type: "warning",
                        showCancelButton: true,
                        confirmButtonText: 'Yes',
                        cancelButtonText: "No",
                    }, function (confirm) {
                        if (confirm === true) {
                            hypersproutConfigService.HSGroupDelete(row.entity.GroupID, 'Application Group', 'HyperSprout').then(function (objData) {
                                if (!angular.isUndefinedOrNull(objData) && (objData.type)) {
                                    swal(commonService.addTrademark(objData.output));
                                } else {
                                    swal(commonService.addTrademark(objData.Message));
                                }
                                $scope.pagination.currentTablePage = 1;
                        $scope.initTable($scope.pagination.currentTablePage, $scope.pagination.currentTablePaginationSize);
                            });
                        }
                    });
                };

                /**
                 * @description
                 * Function to create application group by
                 * opening a pop-up
                 *
                 * @param size
                 * @return Nil
                 
                 */
                $scope.openCreateApplicationGroup = function (size) {
                    modalInstance = $uibModal.open({
                        templateUrl: '/templates/createApplicationGroup.html',
                        controller: 'createApplicationGroupCtrl',
                        size: size,
                        backdrop: 'static',
                        keyboard: true,
                        resolve: {
                            type: function () {
                                return 'HyperSprout';
                            }
                        }
                    });
                    modalInstance.result.then(function (createdItem) {

                        $scope.pagination.currentTablePage = 1;
                        $scope.initTable($scope.pagination.currentTablePage, $scope.pagination.currentTablePaginationSize);
                        $scope.groupList = [];
                        if (!angular.isUndefinedOrNull(createdItem)) {
                            var objToInsert = createdItem;
                            $scope.groupList.push(objToInsert);
                            $scope.selectGroup = objToInsert;
                        }
                    }, function (callApi) {

                        if(callApi){
                            $scope.pagination.currentTablePage = 1;
                        $scope.initTable($scope.pagination.currentTablePage, $scope.pagination.currentTablePaginationSize);
                        }
                    });
                };
            }]);
})(window.angular);
