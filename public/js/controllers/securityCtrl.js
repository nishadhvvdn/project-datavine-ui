/**
 * @description
 * Controller for handling Security Group
 */
(function (angular) {
    "use strict";
    angular.module('dataVINEApp').controller('securityCtrl', ['$scope',
        '$timeout', '$uibModal', 'administrationService', 'commonService','$templateCache', '$rootScope',
        function ($scope, $timeout, $uibModal, administrationService, commonService, $templateCache, $rootScope) {
            let currentDefaultTablePageSize = objCacheDetails.grid.paginationPageSize;
            var SecurityGroupData = [];
            var objConfigMemberInfo = {};
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
            $scope.initializeTable = function (pageNum) {
                $scope.securityOptions = angular.copy(objCacheDetails.grid);
                $scope.securityOptions.data = [];
                $scope.securityOptions.exporterPdfOrientation = 'landscape',
                $scope.securityOptions.exporterPdfMaxGridWidth = 640;
                $scope.securityOptions.columnDefs = [
                    {
                        field: 'SecurityGroupID', displayName: 'Security Group ID',
                        cellTemplate: '<div class="ui-grid-cell-contents">' +
                            '<a class="anchorUIGrid"' +
                            ' ng-click="grid.appScope.groupIDDetails(row,\'view\')">' +
                            '{{row.entity.SecurityGroupID}}</a></div>',
                        enableHiding: false
                    },
                    { field: 'Description', enableHiding: false },
                    { field: 'No of Users', enableHiding: false, type: 'number' },
                    {
                        field: 'Action',
                        cellTemplate: '<div class="ui-grid-cell-contents">' +
                            '<button type="button" class="btn btn-xs btn-primary cellBtn"' +
                            ' ng-class="row.entity.SecurityGroupID!==\'Administrator\' ? \'allow\' : \'not-allow\'" ' +
                            'ng-click="row.entity.SecurityGroupID!==\'Administrator\'&&' +
                            'grid.appScope.groupIDDetails(row,\'edit\')" title="Edit"> ' +
                            '<i class="fa fa-edit"></i></button> &nbsp;|&nbsp;' +
                            '<button type="button" class="btn btn-xs btn-primary cellBtn" ' +
                            'ng-hide="row.entity.Members>0" ' +
                            'ng-class="row.entity.SecurityGroupID!==\'Administrator\' ? \'allow\' : \'not-allow\'" ' +
                            'ng-click="row.entity.SecurityGroupID!==\'Administrator\'&&grid.appScope.deleteGroupID(row)"  title="Delete">  ' +
                            '<i class="fa fa-remove"></i></button> </div>',
                        enableColumnMenu: false, enableHiding: false, enableSorting: false
                    }
                ];
                $scope.securityOptions.onRegisterApi = function (gridApi) {
                    $scope.gridApi = gridApi;
                    gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {
                        $scope.pagination.currentTablePaginationSize = pageSize;
                        $scope.pagination.totalTablePages = Math.ceil($scope.pagination.currentTotalItems / pageSize);
                        pageNum = 1;
                        $scope.pagination.currentTablePage = 1;
                        init(pageNum, $scope.pagination.currentTablePaginationSize);
                    });
                };
                init(pageNum, $scope.pagination.currentTablePaginationSize);
                $templateCache.put('ui-grid/pagination', commonService.getModifiedTable());
            }

            $scope.initializeTable($scope.pagination.apiCurrentPage, currentDefaultTablePageSize);
            /**
             * Function to initialize security group data
             */
            function init(pageNum, limit) {
                SecurityGroupData = [];
                administrationService.GetSecurityGroups(pageNum, limit)
                    .then(function (objData) {
                        if (!angular.isUndefinedOrNull(objData) &&
                            !angular.isUndefinedOrNull(objData.membersInfo)) {
                            for (var i in objData.membersInfo) {
                                objConfigMemberInfo[objData
                                    .membersInfo[i]["SecurityID"]] = {
                                        "Members": objData.membersInfo[i]["Count"]
                                    };
                            }
                        }
                        if (!angular.isUndefinedOrNull(objData) &&
                            !angular.isUndefinedOrNull(objData.output)) {
                                SecurityGroupData.length = 0;
                                $scope.pagination.currentTotalItems = objData.output.results.length;
                                $scope.pagination.apiCurrentPage = pageNum;
                                $scope.pagination.totalRecordsInDBCount = objData.output.totalRecords;
                                $scope.pagination.totalTablePages = Math.ceil($scope.pagination.totalRecordsInDBCount / $scope.pagination.currentTablePaginationSize);
                                let btnFlags = commonService.getBtnStatus($scope.pagination.currentTablePage, $scope.pagination.totalTablePages);
                                $scope.disableNxtBtn = btnFlags.disableNxtBtn;
                                $scope.disablePrvBtn = btnFlags.disablePrvBtn;
                                $scope.disableFirstBtn = btnFlags.disableFirstBtn;
                                $scope.disableLastBtn = btnFlags.disableLastBtn;

                            for (var count in objData.output.results) {
                                if (objData.output.results.hasOwnProperty(count)) {
                                    var objToInsert = {};
                                    objToInsert["SecurityGroupID"] =
                                        objData.output.results[count].SecurityID;
                                    objToInsert["Description"] =
                                        objData.output.results[count].Description;
                                    objToInsert["No of Users"] =
                                        angular.isUndefinedOrNull(
                                            objConfigMemberInfo[objToInsert["SecurityGroupID"]]) ? '' : objConfigMemberInfo[objToInsert["SecurityGroupID"]].Members;
                                    objToInsert["Functions"] =
                                        objData.output.results[count].Functions;
                                    SecurityGroupData.push(objToInsert);
                                }
                            }
                            $scope.securityOptions.data = SecurityGroupData;
                            objCacheDetails.data.securityGroupDetails = SecurityGroupData;
                        }  else if (objData.type == false) {
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
                /**
                 *  @description
                 * Function to open pop-up for adding or editing
                 * security group
                 *
                 * @param row
                 * @param type
                 * @return Nil
                 
                 */
                $scope.groupIDDetails = function (row, type) {
                    $uibModal.open({
                        templateUrl: '/templates/editSecurityGroup.html',
                        controller: 'addOrEditSecurityGroupCtrl',
                        size: 'md',
                        backdrop: 'static',
                        keyboard: true,
                        resolve: {
                            record: function () {
                                return row;
                            },
                            securityGroupDropDown: administrationService
                                .ListSecurityID().then(function (objData) {
                                    return objData;
                                }),
                            type: function () {
                                return type;
                            }
                        }
                    });
                };

                /**
                 * @description
                 * Function to open pop-up for deleting security group
                 *
                 * @param row
                 * @return Nil
                 
                 */
                $scope.deleteGroupID = function (row) {
                    swal({
                        title: "Warning!",
                        text: "Are you sure you want to delete?",
                        type: "warning",
                        showCancelButton: true,
                        confirmButtonText: 'Yes',
                        cancelButtonText: "No",
                    }, function (confirm) {
                        if (confirm === true) {
                            administrationService
                                .DeleteSecurityGroups(row.entity.SecurityGroupID)
                                .then(function (objData) {
                                    if (!angular
                                        .isUndefinedOrNull(objData) &&
                                        (objData.type === true)) {
                                        swal(objData.output);
                                        let pagenum = 1;
                                        $scope.pagination.currentTablePage = 1;
                                        $scope.initializeTable(pagenum, currentDefaultTablePageSize);
                                    } else {
                                        swal(objData.Message);
                                    }
                                });
                        }
                    });
                };

                /**
                 * @description
                 * Function to open pop-up for password settings
                 *
                 * @param size
                 * @return Nil
                
                 */
                $scope.openPasswordSettings = function (size) {
                    $uibModal.open({
                        templateUrl: '/templates/passwordSettings.html',
                        controller: 'passwordSettingsCtrl',
                        size: size,
                        backdrop: 'static',
                        keyboard: true
                    });
                };

                /**
                 *  @description
                 * Function to open pop-up for adding security group
                 *
                 * @param size
                 * @param type
                 * @return Nil
                 
                 */
                $scope.addSecurityGroup = function (size, type) {
                    $uibModal.open({
                        templateUrl: '/templates/addSecurityGroup.html',
                        controller: 'addOrEditSecurityGroupCtrl',
                        size: size,
                        backdrop: 'static',
                        keyboard: true,
                        resolve: {
                            record: function () {
                                return [];
                            },
                            securityGroupDropDown: function () {
                                return [];
                            },
                            type: function () {
                                return type;
                            }
                        }
                    }).result.then(function () {
                        $scope.initializeTable($scope.pagination.apiCurrentPage, currentDefaultTablePageSize);
                    }, function (callApi) {                        
                        if(callApi) {
                            $scope.initializeTable($scope.pagination.apiCurrentPage, currentDefaultTablePageSize);
                        }
                    });
                };

                /**
                 *  @description
                 * Function to print
                 *
                 * @param Nil
                 * @return Nil
                
                 */
                $scope.printCart = function () {
                    window.print();
                };
                $scope.$on('$destroy', function () {
                    $templateCache.put('ui-grid/pagination', commonService.setDefaultTable());
                });
            }
        }]);
})(window.angular);