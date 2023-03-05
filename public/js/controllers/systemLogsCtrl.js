/**
 * @description
 * Controller to handle system logs
 */
(function (angular) {
    'use strict';
    angular.module('dataVINEApp').controller('systemLogsCtrl',
    ['$scope', '$rootScope', 'commonService', 'reportsService', '$controller', '$sessionStorage', '$templateCache',
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
                $scope.invalidSelection = false;
                $scope.invalidDate = false;
                $scope.invalidTime = false;
                $scope.systemLogOptions = {};
                var arrData = [];
                $scope.mySelectedRows = [];
                $scope.invalidSelection = false;
                $scope.loading = true;
                $scope.searchTerm = "";
                let customStartDate = '';
                let customEndDate = '';
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
                    templateUrl: '/templates/systemLogSettings.html',
                    content: '',
                    open: function () {
                        $scope.dynamicPopover.isOpen = true;
                    },
                    close: function () {
                        $scope.dynamicPopover.isOpen = false;
                    }
                };
                $controller('dateCommonCtrl', {$scope: $scope});
                initializeDate();

                function initializeDate() {
                    $scope.startingDate = new Date(moment.tz(userTimeZone).format('YYYY-MM-DD HH:mm'));
                    $scope.endingDate = new Date(moment.tz(userTimeZone).format('YYYY-MM-DD HH:mm'));

                    let startDate = moment.utc($scope.startingDate).subtract(2, 'days').format('YYYY-MM-DDTHH:mm:ss.SSS') + 'Z';
                    $scope.startingDate = startDate;
                    let endDate = moment.utc($scope.endingDate).format('YYYY-MM-DDTHH:mm:ss.SSS') + 'Z';
                    $scope.queryParamForAPI = `&StartTime=${startDate}&EndTime=${endDate}`;
                }
                $scope.initializeTable = function (pageNum) {
                    $scope.systemLogOptions.data = [];
                    $scope.systemLogOptions = angular.copy(objCacheDetails.grid);
                    $scope.systemLogOptions.exporterPdfOrientation = 'landscape',
                    $scope.systemLogOptions.exporterPdfMaxGridWidth = 640;                    
                    $scope.systemLogOptions.columnDefs =  [
                        {
                            field: 'SerialNumber', displayName: 'HS Serial Number',
                            enableHiding: false,
                            width: 280
                        },
                        { field: 'meter', displayName: 'Meter Serial Number', enableHiding: false , width: 180},
                        { field: 'EventDate/Time', displayName: 'Event Date/Time', enableHiding: false, width: 180},
                        { field: 'Message', displayName: 'Message', enableHiding: false }
                        // { field: 'Action', displayName: 'Action', enableHiding: false }
                        ];
                    $scope.systemLogOptions.exporterSuppressColumns = ['Actions'];
                    $scope.systemLogOptions.onRegisterApi = function (gridApi) {
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
                        .systemLog(pageNum, limit, $scope.searchTerm, $scope.queryParamForAPI)
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
                                    objToInsert['SerialNumber'] = (apiData[i].HypersproutSerialNumber) ? ((apiData[i].HypersproutSerialNumber)== "")? "NA" : apiData[i].HypersproutSerialNumber : "NA";
                                    objToInsert['meter'] = (apiData[i].MeterSerialNumber) ? ((apiData[i].MeterSerialNumber)== "")? "NA" : apiData[i].MeterSerialNumber : "NA";
                                    objToInsert['EventDate/Time'] = moment.tz(apiData[i].EventDateTime, userTimeZone).format('YYYY-MM-DD HH:mm:ss');
                                    objToInsert['Message'] = objToInsert['Message'] = (angular.isUndefinedOrNull(apiData[i].Attribute) ? '-' : apiData[i].Attribute) + ' / ' + (angular.isUndefinedOrNull(apiData[i].Action) ? '-' : apiData[i].Action);
                                    //objToInsert['Action'] = apiData[i].Action;
                                    arrData.push(objToInsert);
                                }
                                $scope.systemLogOptions.data = arrData;
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
                $scope.newAccountfilter = function () {
                    customStartDate = moment.utc($scope.startingDate).format('YYYY-MM-DDTHH:mm:ss.SSS') + 'Z';
                    customEndDate =  moment.utc($scope.endingDate).format('YYYY-MM-DDTHH:mm:ss.SSS') + 'Z';
                    $scope.queryParamForAPI = `&StartTime=${customStartDate}&EndTime=${customEndDate}`;
                    $scope.pagination.currentTablePage = 1;
                    $scope.initializeTable(1);
                    $scope.dynamicPopover.isOpen = false;
                };
                //searching the data
                $scope.searchButtonClear =  function (searchTerm) {
                    if(searchTerm == ""){
                        $scope.searchTerm = '';
                        $scope.initializeTable($scope.pagination.currentTablePage, $scope.pagination.currentTablePaginationSize);
                    }
                }
                $scope.addEndpoint = function (searchTerm) {
                    if(searchTerm) {
                        $scope.searchTerm = searchTerm;
                        $scope.pagination.currentTablePage = 1;
                        $scope.initializeTable($scope.pagination.currentTablePage, $scope.pagination.currentTablePaginationSize);
                    } else {
                        $scope.searchTerm = '';
                        $scope.initializeTable($scope.pagination.currentTablePage, $scope.pagination.currentTablePaginationSize);
                    }
                    angular.element(document.querySelector("div.ui-grid-selection-row-header-buttons")).removeClass("ui-grid-all-selected");
                    $scope.mySelectedRows.length = 0;
                };      
                $scope.$on('$destroy', function () {
                    $templateCache.put('ui-grid/pagination', commonService.setDefaultTable());
                });
    }]);
})(window.angular);