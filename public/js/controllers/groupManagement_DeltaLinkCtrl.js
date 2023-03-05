/**
 * @description
 * Controller for Group management for meter
 */
(function (angular) {
    "use strict";
    angular.module('dataVINEApp').controller('groupManagement_DeltaLinkCtrl',
        ["$scope", "$uibModal", "$state", "$rootScope", '$filter', '$timeout', 'DeviceService', 'ParseService', 'refreshservice', 'commonService', '$templateCache', '$sessionStorage', 'hypersproutMgmtService',
            function ($scope, $uibModal, $state, $rootScope, $filter, $timeout, deviceService, parseService, refreshservice, commonService, $templateCache, $sessionStorage, hypersproutMgmtService) {
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
                let modalInstance = null;

                $scope.initializeTable = function (pageNum) {
                    $scope.deltaLinkGroupGrid = angular.copy(objCacheDetails.grid);
                    $scope.deltaLinkGroupGrid.data = [];
                    $scope.deltaLinkGroupGrid.exporterPdfOrientation = 'landscape';
                    $scope.deltaLinkGroupGrid.exporterPdfMaxGridWidth = 640;
                    $scope.deltaLinkGroupGrid.exporterCsvFilename = 'file.csv';
                    $scope.deltaLinkGroupGrid.columnDefs = [
                        {
                            field: 'Group_Name', width: '17%',
                            displayName: 'Group Name',
                            cellTemplate: '<div class="ui-grid-cell-contents">' +
                                '<a class="anchorUIGrid" ' +
                                'ng-click="grid.appScope.deltaLinkGroupDetails(row)">' +
                                '{{row.entity.Group_Name}} </a> </div>',
                            enableHiding: false
                        },
                        // {
                        //     field: 'Group_Type', width: '17%',
                        //     displayName: 'Group Type', enableHiding: false
                        // },
                        { field: 'Members', width: '17%', enableHiding: false },
                        { field: 'Description', enableHiding: false },
                        {
                            field: 'Action', width: '20%',
                            enableColumnMenu: false,
                            cellTemplate: '<div class="ui-grid-cell-contents">' +
                                '<button type="button" ' +
                                'class="btn btn-xs btn-primary cellBtn" ' +
                                'ng-class="!(row.entity.Members>0)? \'allow\' : \'not-allow\'" ' +
                                'ng-click="!(row.entity.Members>0)&&grid.appScope.deleteConfiguration(row)" title="Delete">' +
                                '  <i class="fa fa-remove" aria-hidden="true"></i>' +
                                '</button> </div>',
                            enableHiding: false,
                            enableSorting: false
                        }
                    ];
                    $scope.deltaLinkGroupGrid.exporterSuppressColumns = ['Action'];
                    $scope.deltaLinkGroupGrid.onRegisterApi = function (gridApi) {
                        $scope.gridApi = gridApi;
                        gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {
                            $scope.pagination.currentTablePaginationSize = pageSize;
                            $scope.pagination.totalTablePages = Math.ceil($scope.pagination.currentTotalItems / pageSize);
                            pageNum = 1;
                            $scope.pagination.currentTablePage = 1;
                            initDeltaGroupList(pageNum, $scope.pagination.currentTablePaginationSize);
                        });
                    };

                    initDeltaGroupList(pageNum, $scope.pagination.currentTablePaginationSize);

                    $templateCache.put('ui-grid/pagination', commonService.getModifiedTable());
                }

                $scope.initializeTable($scope.pagination.apiCurrentPage, currentDefaultTablePageSize);

                function initDeltaGroupList(pageNum, limit) {
                    deltaLinkData.length = 0;
                    deviceService.fetchDeltaLinkGroupList(pageNum, limit)
                        .then(function (apiData) {
                            if (!angular.isUndefinedOrNull(apiData) && !angular.isUndefinedOrNull(apiData.appGroupCount) && apiData.type) {
                                $scope.pagination.currentTotalItems = apiData.dataFromAppGrps.results.length;
                                $scope.pagination.apiCurrentPage = pageNum;
                                $scope.pagination.totalRecordsInDBCount = apiData.dataFromAppGrps.totalRecords;
                                $scope.pagination.totalTablePages = Math.ceil($scope.pagination.totalRecordsInDBCount / $scope.pagination.currentTablePaginationSize);

                                let btnFlags = commonService.getBtnStatus($scope.pagination.currentTablePage, $scope.pagination.totalTablePages);
                                $scope.disableNxtBtn = btnFlags.disableNxtBtn;
                                $scope.disablePrvBtn = btnFlags.disablePrvBtn;
                                $scope.disableFirstBtn = btnFlags.disableFirstBtn;
                                $scope.disableLastBtn = btnFlags.disableLastBtn;

                                let groupData = apiData.dataFromAppGrps.results;
                                $rootScope.commonMsg = "";
                                for (var i = 0; i < groupData.length; i++) {
                                    let objToInsert = {};
                                    objToInsert["Group_Name"] = groupData[i].GroupName;
                                    objToInsert["Group_Type"] = "Application Group";
                                    objToInsert["Description"] = groupData[i].Description;
                                    objToInsert["AppID"] = groupData[i].GroupID;
                                    apiData.appGroupCount.forEach(element => {
                                        if(element.AppID === objToInsert.AppID) {
                                            objToInsert["Members"] =  element.Members
                                        }
                                    });
                                    deltaLinkData.push(objToInsert);
                                }
                                $scope.deltaLinkGroupGrid.data = deltaLinkData;
                                objCacheDetails.data.deltaLinkGroupData = deltaLinkData;
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

                $scope.status = {
                    isopen: false
                };

                $scope.nxtPageBtnClick = function () {
                    if ($scope.pagination.currentTablePage < $scope.pagination.totalTablePages && $scope.pagination.totalTablePages > 0) {
                        let nextAPIPage = ++$scope.pagination.currentTablePage;
                        $scope.disablePrvBtn = false;
                        $scope.initializeTable(nextAPIPage, $scope.pagination.currentTablePaginationSize);
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
                        $scope.initializeTable(prevAPIPage, $scope.pagination.currentTablePaginationSize);
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
                        $scope.initializeTable(firstPage, $scope.pagination.currentTablePaginationSize);
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
                        $scope.initializeTable(lastPage, $scope.pagination.currentTablePaginationSize);
                    } else {
                        {
                            $scope.disablePrvBtn = true;
                            $scope.disableNxtBtn = false;
                        }
                    }
                }

                $scope.paginationBoxChanges = function () {
                    if($scope.pagination.currentTablePage) {
                        $scope.initializeTable($scope.pagination.currentTablePage, $scope.pagination.currentTablePaginationSize);
                    } else {
                        $scope.pagination.currentTablePage = 1;
                        $scope.initializeTable($scope.pagination.currentTablePage, $scope.pagination.currentTablePaginationSize);
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


                /**
                 * @description
                 * Function to search data in grid
                 *
                 * @param searchTerm
                 * @return Nil

                 */
                $scope.searchGrid = function (searchTerm) {
                    $scope.deltaLinkGroupGrid.data = $filter('deltaLinkSearchFilter')(deltaLinkData, searchTerm);
                    $scope.searchterm = searchTerm;
                };

                $scope.viewDeltaLinkLogs = function (row) {
                    if (row.entity.Status === "Registered") {
                        $sessionStorage.put('selectedDeviceForLogs', row.entity.DeltalinkID);
                        objCacheDetails.data.selectedDeviceForLogs = row.entity.DeltalinkID;
                        $state.go('system.deltalinklogs');
                    } else {
                        swal('Device Not Registered');
                    }
                };

                $scope.openCreateApplicationGroup = function (size) {
                    objCacheDetails.data.deltaLinkGroupData = deltaLinkData
                    modalInstance = $uibModal.open({
                        templateUrl: '/templates/createApplicationGroup.html',
                        controller: 'createApplicationGroupCtrl',
                        size: size,
                        backdrop: 'static',
                        keyboard: true,
                        resolve: {
                            type: function () {
                                return 'DeltaLink';
                            }
                        }
                    });
                    modalInstance.result.then(function (createdItem) {
                        $scope.pagination.currentTablePage = 1;
                        $scope.initializeTable($scope.pagination.currentTablePage, $scope.pagination.currentTablePaginationSize);
                        $scope.groupList = [];
                        if (!angular.isUndefinedOrNull(createdItem)) {
                            var objToInsert = createdItem;
                            $scope.groupList.push(objToInsert);
                            $scope.selectGroup = objToInsert;
                        }
                    }, function (callApi) {
                        if(callApi) {
                            $scope.pagination.currentTablePage = 1;
                        $scope.initializeTable($scope.pagination.currentTablePage, $scope.pagination.currentTablePaginationSize);
                        }                        
                    });
                };

                $scope.deleteConfiguration = function (row) {
                    swal({
                        title: "Warning!",
                        text: "Are you sure you want to delete?",
                        type: "warning",
                        showCancelButton: true,
                        confirmButtonText: 'Yes',
                        cancelButtonText: "No",
                    }, function (confirm) {
                        if (confirm === true) {
                            hypersproutMgmtService.HSGroupDelete(row.entity.AppID, row.entity.Group_Type, 'DeltaLink')
                                .then(function (objData) {
                                    if (!angular.isUndefinedOrNull(objData) &&
                                        (objData.type)) {
                                        swal(commonService.addTrademark(objData.output));
                                    } else {
                                        swal(commonService.addTrademark(objData.Message));
                                    }
                                    $scope.pagination.currentTablePage = 1;
                        $scope.initializeTable($scope.pagination.currentTablePage, $scope.pagination.currentTablePaginationSize);
                                });
                        }
                    });
                };

                $scope.openAssignEndpoint = function (size) {
                    modalInstance = $uibModal.open({
                        templateUrl: '/templates/assignEndpoint.html',
                        controller: 'assignEndpointCtrl',
                        size: size,
                        backdrop: 'static',
                        keyboard: true,
                        resolve: {
                            type: function () {
                                return 'DeltaLink';
                            }
                        }
                    });
                    modalInstance.result.then(function () {
                        $scope.pagination.currentTablePage = 1;
                        $scope.initializeTable($scope.pagination.currentTablePage, $scope.pagination.currentTablePaginationSize);
                    }, function (callApi) {
                        if(callApi) {
                            $scope.pagination.currentTablePage = 1;
                        $scope.initializeTable($scope.pagination.currentTablePage, $scope.pagination.currentTablePaginationSize);
                        }                        
                    });
                    $scope.dynamicPopover.isOpen = false;
                };

                $scope.detailsForDeltaLink = function (row) {
                    let data = objCacheDetails.data.deltaLinkData = row.entity;
                    commonService.modalWindow('/templates/deltaLinkDetails.html', 'deltaLinkDetailsCtrl', 'DeltaLink', data);
                };

                $scope.deltaLinkGroupDetails = function (row) {
                    objCacheDetails.data.selectedDeltaLinkFirmwareGroupInfo = row.entity;

                    modalInstance = $uibModal.open({
                        templateUrl: '/templates/deltaLinkGroupConfigurationDetail.html',
                        controller: 'deltaLinkGroupConfigurationDetailsCtrl',
                        size: 'md',
                        backdrop: 'static',
                        keyboard: true,
                        resolve: {
                            data: hypersproutMgmtService.ListDevicesAttached(row.entity.AppID, 'DeltaLink', row.entity.Group_Type)
                                .then(function (resObj) {
                                    var objArray = [];
                                    if (resObj.hasOwnProperty('SerialNumbers')) {
                                        for (let i = 0; i < resObj.SerialNumbers.length; i++) {
                                            objArray.push(resObj.SerialNumbers[i]);
                                        }
                                        return objArray;
                                    }
                                    return ['No Serial numbers found'];
                                }),
                            type: function () {
                                return 'DeltaLink';
                            }
                        }
                    });
                };


                $scope.$on('$destroy', function () {
                    $templateCache.put('ui-grid/pagination', commonService.setDefaultTable());
                });
            }]);
})(window.angular);
