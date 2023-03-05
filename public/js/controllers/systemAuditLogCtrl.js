/**
 * @description
 * Controller for handling System Audit Logs
 */
(function (angular) {
    "use strict";
    angular.module('dataVINEApp').controller('systemAuditLogCtrl',
        ['$scope', '$rootScope', 'commonService', 'reportsService', '$controller', '$sessionStorage', '$templateCache',
            '$controller', '$filter',
            function ($scope, $rootScope, commonService, reportsService, $controller, $sessionStorage, $templateCache) {
                let currentDefaultTablePageSize = objCacheDetails.grid.paginationPageSize;
                let userTimeZone = angular.isUndefinedOrNull(objCacheDetails.userDetails) ? undefined : objCacheDetails.userDetails.timeZone;
                if (angular.isUndefined(userTimeZone)) {
                    userTimeZone = $sessionStorage.get('userTimeZone');
                }
                window.onbeforeunload = function () {
                    $sessionStorage.put('userTimeZone', userTimeZone);
                };
                $scope.startingDate = null;
                $scope.endingDate = null;
                $scope.queryParamForAPI = '';
                $scope.invalidDate = false;
                $scope.invalidTime = false;
                $scope.auditLogOptions = {};
                var arrData = [];
                $scope.mySelectedRows = [];
                $scope.invalidSelection = false;
                $scope.loading = true;
                $scope.searchTerm = "";
                let customStartDate = '';
                let customEndDate = '';
                let userNameMatrix = {
                    'All': 'All',
                    'Admin': 'Admin'
                }

                //for pagination
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

                $scope.dynamicPopover = {
                    templateUrl: '/templates/auditLogSettings.html',
                    content: '',
                    open: function () {
                        $scope.dynamicPopover.isOpen = true;
                    },
                    close: function () {
                        $scope.dynamicPopover.isOpen = false;
                    }
                };

                /** checkbox for select users */
                $scope.userCheckbox = [{
                    label: "All",
                    isSelected: true
                },
                {
                    label: "Admin",
                    isSelected: true
                }];
                $controller('dateCommonCtrl', { $scope: $scope });
                initializeDate();

                function initializeDate() {
                    $scope.startingDate = new Date(moment.tz(userTimeZone).format('YYYY-MM-DD HH:mm'));
                    $scope.endingDate = new Date(moment.tz(userTimeZone).format('YYYY-MM-DD HH:mm'));

                    let startDate = moment.utc($scope.startingDate).subtract(2, 'days').format('YYYY-MM-DDTHH:mm:ss.SSS') + 'Z';
                    $scope.startingDate = startDate;
                    let endDate = moment.utc($scope.endingDate).format('YYYY-MM-DDTHH:mm:ss.SSS') + 'Z';
                    let filtersArray = extractFilterData();
                    if (!filtersArray) {
                        $scope.queryParamForAPI = `&StartTime=${startDate}&EndTime=${endDate}`;
                    } else {
                        $scope.queryParamForAPI = `&StartTime=${startDate}&EndTime=${endDate}&filter=${filtersArray ? 'true' : 'none'}`;
                    }
                }

                /**
                 *  @description
                 * Function to initialize audit logs data
                 * based on date
                 *
                 * @param flag
                 * @return Nil
                 
                 */
                $scope.initializeTable = function (pageNum) {
                    $scope.auditLogOptions.data = [];
                    $scope.auditLogOptions = angular.copy(objCacheDetails.grid);
                    $scope.auditLogOptions.exporterPdfOrientation = 'landscape',
                        $scope.auditLogOptions.exporterPdfMaxGridWidth = 640;
                    $scope.auditLogOptions.columnDefs = [
                        { field: 'User id', displayName: 'User ID', enableHiding: false },
                        {
                            field: 'EventDate/Time',
                            enableHiding: false
                        },
                        { field: 'Event', enableHiding: false },
                        { field: 'SuperUser', enableHiding: true, visible: false }
                    ];
                    $scope.auditLogOptions.exporterSuppressColumns = ['Actions'];
                    $scope.auditLogOptions.onRegisterApi = function (gridApi) {
                        $scope.gridApi = gridApi;
                        // commonService.getGridApi($scope, gridApi);
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
                $scope.initializeTable($scope.pagination.apiCurrentPage, currentDefaultTablePageSize);

                function initData(pageNum, limit) {
                    arrData.length = 0;
                    reportsService
                        .auditLog(pageNum, limit, $scope.searchTerm, $scope.queryParamForAPI)
                        .then(function (apiData) {
                            if (!angular.isUndefinedOrNull(apiData) && apiData.type && apiData.Details.results) {
                                arrData.length = 0;
                                $scope.pagination.currentTotalItems = apiData.Details.results.length;
                                $scope.pagination.apiCurrentPage = pageNum;
                                $scope.pagination.totalRecordsInDBCount = apiData.Details.totalRecords;
                                $scope.pagination.totalTablePages = Math.ceil($scope.pagination.totalRecordsInDBCount / $scope.pagination.currentTablePaginationSize);

                                let btnFlags = commonService.getBtnStatus($scope.pagination.currentTablePage, $scope.pagination.totalTablePages);
                                $scope.disableNxtBtn = btnFlags.disableNxtBtn;
                                $scope.disablePrvBtn = btnFlags.disablePrvBtn;
                                $scope.disableFirstBtn = btnFlags.disableFirstBtn;
                                $scope.disableLastBtn = btnFlags.disableLastBtn;

                                apiData = apiData.Details.results;
                                $rootScope.commonMsg = "";
                                for (let i = 0; i < apiData.length; i++) {
                                    let objToInsert = {};
                                    objToInsert['User id'] = apiData[i].UserID;
                                    objToInsert['EventDate/Time'] = moment.tz(apiData[i].EventDateTime, userTimeZone).format('YYYY-MM-DD HH:mm:ss');
                                    objToInsert['Event'] = commonService.addTrademark(apiData[i].EventDescription);
                                    objToInsert['SuperUser'] = apiData[i].SuperUser;
                                    arrData.push(objToInsert);
                                }
                                $scope.auditLogOptions.data = arrData;
                            } else if (apiData.type == false) {
                                $scope.disableNxtBtn = true;
                                $scope.disablePrvBtn = true;
                                $scope.disableFirstBtn = true;
                                $scope.disableLastBtn = true;
                                $scope.pagination.totalRecordsInDBCount = 0;
                                $scope.pagination.totalTablePages = 1;
                                $rootScope.commonMsg = "No data found!";
                            } else {
                                $rootScope.commonMsg = 'No data found!';
                            }
                        });
                }

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
                    if ($scope.pagination.currentTablePage) {
                        $scope.initializeTable($scope.pagination.currentTablePage, $scope.pagination.currentTablePaginationSize);
                    } else {
                        $scope.pagination.currentTablePage = 1;
                        $scope.initializeTable($scope.pagination.currentTablePage, $scope.pagination.currentTablePaginationSize);
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
                //filtering the data over date
                $scope.auditLogFilter = function () {
                    customStartDate = moment.utc($scope.startingDate).format('YYYY-MM-DDTHH:mm:ss.SSS') + 'Z';
                    customEndDate = moment.utc($scope.endingDate).format('YYYY-MM-DDTHH:mm:ss.SSS') + 'Z';
                    $scope.pagination.currentTablePage = 1;
                    let filtersArray = extractFilterData();
                    if (filtersArray == undefined) {
                        $scope.queryParamForAPI = `&StartTime=${customStartDate}&EndTime=${customEndDate}`;
                    } else {
                        $scope.queryParamForAPI = `&StartTime=${customStartDate}&EndTime=${customEndDate}&filter=${filtersArray ? 'true' : 'none'}`;
                    }
                    $scope.initializeTable(1);
                    $scope.dynamicPopover.isOpen = false;
                };

                function extractFilterData() {
                    let arrayList = [];
                    for (let i = 0, len = $scope.userCheckbox.length; i < len; i++) {
                        if ($scope.userCheckbox[i].isSelected === true) {
                            arrayList.push(userNameMatrix[$scope.userCheckbox[i].label]);
                        }
                    }
                    if (arrayList[0] != "All")
                        return arrayList;
                }
                $scope.errorUpdate = function () {
                    $scope.invalidSelection = !(
                    $scope.userCheckbox[0].isSelected ||
                    $scope.userCheckbox[1].isSelected
                    )
                };
                $scope.$on('$destroy', function () {
                    $templateCache.put('ui-grid/pagination', commonService.setDefaultTable());
                });
            }]);
})(window.angular);