/**
 * Controller to define users
 * @description
 */
(function (angular) {
    "use strict";
    angular.module('dataVINEApp')
        .controller('defineUsersCtrl',
            ['$scope', '$rootScope', '$uibModal', '$timeout',
                '$state', 'administrationService',
                '$filter', '$sessionStorage', 'commonService','$templateCache',
                function ($scope, $rootScope, $uibModal,
                    $timeout, $state, administrationService,
                    $filter, $sessionStorage, commonService, $templateCache) {
                    let currentDefaultTablePageSize = objCacheDetails.grid.paginationPageSize;
                    $scope.usersOptions = {};
                    $scope.searchTerm = "";
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
                    $scope.superUser = false;
                    var userDetails = [];
                    $scope.define = {};
                    $scope.lockfilter = false;

                    /**
                     *  @description
                     * Function to set TO time
                     *
                     * @param val
                     * @return Nil
             
                     * Function to enable access for super user
                     */
                    $scope.access = function (val) {
                        if ($scope.superUser) {
                            return true;
                        } else {
                            if (val) {
                                return false;
                            } else {
                                return true;
                            }
                        }
                    };

                    $scope.initializeTable = function (pageNum) {
                    $scope.usersOptions = angular.copy(objCacheDetails.grid);
                    $scope.usersOptions.data = [];
                    $scope.usersOptions.exporterPdfOrientation = 'landscape',
                    $scope.usersOptions.exporterPdfMaxGridWidth = 640;
                    $scope.usersOptions.columnDefs = [
                        {
                            field: 'UserID', displayName: 'User ID',
                            cellTemplate: '<div class="ui-grid-cell-contents">' +
                                '<a class="anchorUIGrid" ng-click="grid.appScope.userIDDetails(' +
                                'row,\'View\')" >{{row.entity.UserID}} </a> </div>',
                            enableHiding: false, width: 180
                        },
                        { field: 'Name', enableHiding: false },
                        { field: 'E-Mail Address', enableHiding: false, width: 200 },
                        { field: 'Security Group', enableHiding: false },
                        { field: 'Account Locked', enableHiding: false },
                        { field: 'access', visible: false, enableHiding: false },
                        {
                            field: 'Action',
                            cellTemplate: '<div class="ui-grid-cell-contents">' +
                                '<button type="button" class="btn btn-xs btn-primary cellBtn" ' +
                                'ng-click="grid.appScope.userIDDetails(row,\'Edit\')" title="Edit"> ' +
                                ' <i class="fa fa-edit" aria-hidden="true"></i></button> &nbsp|&nbsp; ' +
                                '<button type="button" class="btn btn-xs btn-primary cellBtn" ' +
                                'ng-click="row.entity.access&&grid.appScope.deleteConfiguration(row)" ' +
                                'ng-class="row.entity.access? \'allow\' : \'not-allow\'" title="Delete"> ' +
                                ' <i class="fa fa-remove" aria-hidden="true"></i></button> &nbsp|&nbsp; ' +
                                '<button type="button" class="btn btn-xs btn-primary cellBtn"' +
                                ' ng-click="row.entity.access&&grid.appScope.passwordSettings(row)" ' +
                                'ng-class="row.entity.access? \'allow\' : \'not-allow\'" title="Password Reset"> ' +
                                ' <i class="fa fa-undo" aria-hidden="true"></button></div>',
                            enableColumnMenu: false,
                            enableHiding: false,
                            enableSorting: false
                        }
                    ];
                    $scope.usersOptions.onRegisterApi = function (gridApi) {
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
                     * Function to initialize users list
                     */
                    function init(pageNum, limit) {
                        administrationService.GetUsers($scope.searchTerm, pageNum, limit, $scope.lockfilter).then(function (objData) {
                            $scope.superUser = $sessionStorage.get('superUser');
                            if (!angular.isUndefinedOrNull(objData) && !angular.isUndefinedOrNull(objData.output)) {
                                userDetails.length = 0;
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
                                        objToInsert["UserID"] = objData.output.results[count].UserID;
                                        objToInsert["Name"] = objData.output.results[count].FirstName;
                                        objToInsert["E-Mail Address"] = objData.output.results[count].EmailAddress;
                                        objToInsert["Security Group"] = objData.output.results[count].SuperUser ? objData.output.results[count].SecurityGroup + ' (Super User)' : objData.output.results[count].SecurityGroup;
                                        objToInsert["Account Locked"] = objData.output.results[count].AccountLocked;
                                        objToInsert["LastName"] = objData.output.results[count].LastName;
                                        objToInsert["TimeZone"] = objData.output.results[count].TimeZone;
                                        objToInsert["HomePage"] = objData.output.results[count].HomePage;
                                        objToInsert["loginID"] = objData.output.results[count].LoginID;
                                        objToInsert["access"] = $scope.access(objData.output.results[count].SuperUser);
                                        objToInsert["Temprature"] = objData.output.results[count].Temprature;
                                        objToInsert["MobileNumber"] = objData.output.results[count].MobileNumber; //Mobile number field
                                        userDetails.push(objToInsert);
                                    }
                                    $scope.usersOptions.data = userDetails;
                                    $scope.filterData = {};
                                    $scope.filterData.data = userDetails;
                                    objCacheDetails.data.securityDetails = userDetails;
                                }
                                $rootScope.commonMsg = '';
                            } else if (objData.type == false) {
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

                    $scope.isCollapsed = false;
                    $scope.boolEdit = true;
                    $scope.dynamicPopover = {
                        templateUrl: '/templates/userFilter.html',
                        content: '',
                        open: function () {
                            $scope.dynamicPopover.isOpen = true;
                        },
                        close: function () {
                            $scope.dynamicPopover.isOpen = false;
                        }
                    };

                    /**
                     *   @description
                     * Function to display list of users whose account is locked
                     *
                     * @param val
                     * @return Nil
                     
                     */
                    $scope.showLockedUsers = function () {
                        $scope.searchTerm = "";
                        var lockedAccount = $scope.define.lockedUsers;
                        if (lockedAccount) {
                            $scope.lockfilter = true;
                            $scope.pagination.currentTablePage = 1;
                            $scope.initializeTable(1, $scope.pagination.currentTablePaginationSize);
                        } else {
                            $scope.lockfilter = false;
                            $scope.pagination.currentTablePage = 1;
                            $scope.initializeTable(1, $scope.pagination.currentTablePaginationSize);
                        }
                        $scope.dynamicPopover.isOpen = false;
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
                     *    @description
                     * Function to Add User by
                     * opening a pop-up
                     * 
                     * @param size
                     * @param type
                     * @return Nil
                     
                     */
                    $scope.openAddUser = function (size, type) {
                        $uibModal.open({
                            templateUrl: '/templates/addUser.html',
                            controller: 'addUserCtrl',
                            size: size,
                            backdrop: 'static',
                            keyboard: true,
                            resolve: {
                                actionType: function () {
                                    return type;
                                },
                                record: function () {
                                    return {};
                                },
                                securityGroupDropDown: administrationService
                                    .ListSecurityID()
                                    .then(function (objData) {
                                        return objData;
                                    }),
                                userIdsList: function () {
                                    return $scope.usersOptions.data;
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
                     * Function to list security ID of user by
                     * opening a pop-up
                     * 
                     * @param row
                     * @param type
                     * @return Nil
                    
                     */
                    $scope.userIDDetails = function (row, type) {
                        $uibModal.open({
                            templateUrl: '/templates/addUser.html',
                            controller: 'addUserCtrl',
                            size: 'md',
                            backdrop: 'static',
                            keyboard: true,
                            resolve: {
                                actionType: function () {
                                    return type;
                                },
                                record: function () {
                                    return row;
                                },
                                securityGroupDropDown: administrationService
                                    .ListSecurityID()
                                    .then(function (objData) {
                                        return objData;
                                    }),
                                userIdsList: function () {
                                    return {};
                                }
                            }
                        });
                    };
                    $scope.passwordSettings = function (row) {
                        swal({
                            title: "Warning!",
                            text: "Are you sure you want to reset password?",
                            type: "warning",
                            showCancelButton: true,
                            confirmButtonText: 'Yes',
                            cancelButtonText: "No",
                        }, function (confirm) {
                            if (confirm) {
                                administrationService
                                    .ResetPassword(row.entity.UserID)
                                    .then(function (objData) {
                                        if (!angular.isUndefinedOrNull(objData) &&
                                            (objData.type === true)) {
                                            swal(objData.output);
                                        } else {
                                            swal(objData.Message);
                                        }
                                        $state.reload();
                                    });
                            }
                        });
                    };

                    /**
                     *   @description
                     * Function to delete configuration
                     * 
                     * @param row
                     * @return Nil
                     
                     */
                    $scope.deleteConfiguration = function (row) {
                        var usetIds;
                        usetIds = objCacheDetails.userDetails.userID;
                        swal({
                            title: "Warning!",
                            text: "Are you sure you want to delete?",
                            type: "warning",
                            showCancelButton: true,
                            confirmButtonText: 'Yes',
                            cancelButtonText: "No",
                        }, function (confirm) {
                            if (confirm) {
                                if (row.entity.UserID === usetIds) {
                                    $timeout(function () {
                                        swal({
                                            title: "Warning!",
                                            text: "Can Not Delete Logged In User",
                                            type: "warning",
                                        });
                                    }, 400, false);
                                } else {
                                    administrationService
                                        .DeleteUser(row.entity.UserID)
                                        .then(function (objData) {
                                            if (!angular.isUndefinedOrNull(objData) &&
                                                (objData.type)) {
                                                swal(objData.output);
                                                let pagenum = 1;
                                                $scope.pagination.currentTablePage = 1;
                                                $scope.initializeTable(pagenum, currentDefaultTablePageSize);
                                            } else {
                                                swal(objData.Message);
                                            }
                                        });
                                }
                            }
                        });
                    };

                    /**
                     *  @description
                     * Function to print
                     * 
                     * @param row
                     * @return Nil
                     
                     
                     */
                    $scope.printCart = function () {
                        window.print();
                    };
                  //searching the data
                $scope.searchButtonClear =  function (searchTerm) {
                    if(searchTerm == ""){
                        $scope.searchTerm = '';
                        $scope.initializeTable($scope.pagination.currentTablePage, $scope.pagination.currentTablePaginationSize);
                    }
                }

                /**
                 * @description
                 * Function to search data in grid
                 *
                 * @param searchTerm
                 * @return Nil

                 */
                $scope.searchGrid = function (searchTerm) {
                    if(searchTerm) {
                        $scope.searchTerm = searchTerm;
                        $scope.pagination.currentTablePage = 1;
                        $scope.initializeTable($scope.pagination.currentTablePage, $scope.pagination.currentTablePaginationSize);
                    } else {
                        $scope.searchTerm = '';
                        $scope.initializeTable($scope.pagination.currentTablePage, $scope.pagination.currentTablePaginationSize);
                    }
                    angular.element(document.querySelector("div.ui-grid-selection-row-header-buttons")).removeClass("ui-grid-all-selected");
                };

                $scope.$on('$destroy', function () {
                    $templateCache.put('ui-grid/pagination', commonService.setDefaultTable());
                });
                }]);
})(window.angular);