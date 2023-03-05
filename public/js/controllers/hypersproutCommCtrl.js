/**
 * @description
 * Controller for Hypersprout communication
 */
(function (angular) {
    "use strict";
    angular.module('dataVINEApp')
        .controller('hypersproutCommCtrl',
            ['$scope', 'reportsService', 'refreshservice',
                '$timeout', '$filter', '$controller', 'type', 'commonService', '$templateCache', '$sessionStorage',
                function ($scope, reportsService, refreshservice,
                    $timeout, $filter, $controller, type, commonService, $templateCache, $sessionStorage) {
                    
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

                    $scope.commStatsOptions = {};
                    var arrData = [];
                    $scope.searchTerm = '';
                    
                    // $scope.isCollapsed = false;
                    // $scope.boolEdit = true;
                    // let currentDefaultTablePageSize = objCacheDetails.grid.paginationPageSize;
                    
                    $scope.title = type;
                    if (type === 'Hyperhub')
                        $scope.title = 'HyperHUB\u2122';
                    else if(type === 'HyperSprout')
                        $scope.title = 'HyperSPROUT\u2122';
                    $scope.commStatMsg = 'Loading...';
                    $scope.properDateTime = false;
                    

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
                        templateUrl: '/templates/commStatsSettings.html',
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
                        $scope.commStatsOptions.data = [];
                        $scope.commStatsOptions = angular.copy(objCacheDetails.grid);
                        $scope.commStatsOptions.exporterPdfOrientation = 'landscape';
                        $scope.commStatsOptions.exporterPdfMaxGridWidth = 640;
                        $scope.commStatsOptions.columnDefs = [
                            { field: 'serialNumber',displayName: 'Serial Number', enableHiding: false , width: 200 },
                            { field: 'lastReadTime',displayName: 'Last Read Time', enableHiding: false },
                            {
                                field: 'Status', enableHiding: false,
                                cellTemplate: '<div style="margin-top: 5px;margin-left:5px"' +
                                    ' ng-class="{ statusColor:row.entity.Status==\'Failed\'||' +
                                    'row.entity.Status==\'Communication Fault\' }">' +
                                    '{{row.entity.Status}}</div>'
                            }
                        ];
                        $scope.commStatsOptions.exporterSuppressColumns = ['Actions'];
                        $scope.commStatsOptions.onRegisterApi = function (gridApi) {
                            $scope.gridApi = gridApi;
                            // commonService.getGridApi($scope, gridApi);
                            gridApi.pagination.on.paginationChanged($scope, function(newPage, pageSize) {
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
                        reportsService.communicationStatistics(
                            (type === 'HyperSprout' || type === 'Hyperhub') ? 'CommunicationsStatisticsReport' : 'MeterCommunicationsStatisticsReport', type === 'HyperSprout' ? false : (type === 'Hyperhub' ? true : undefined), pageNum, limit, $scope.searchTerm
                        ).then(function (objData) {
                            if (!angular.isUndefinedOrNull(objData) && objData.type &&
                                !angular.isUndefinedOrNull(objData.Details)) {
                                arrData.length = 0;
                                $scope.pagination.currentTotalItems = objData.Details.results.length;
                                $scope.pagination.apiCurrentPage = pageNum;
                                $scope.pagination.totalRecordsInDBCount = objData.Details.totalRecords;
                                $scope.pagination.totalTablePages = Math.ceil($scope.pagination.totalRecordsInDBCount / $scope.pagination.currentTablePaginationSize);

                                let btnFlags = commonService.getBtnStatus($scope.pagination.currentTablePage, $scope.pagination.totalTablePages);
                                $scope.disableNxtBtn = btnFlags.disableNxtBtn;
                                $scope.disablePrvBtn = btnFlags.disablePrvBtn;
                                $scope.disableFirstBtn = btnFlags.disableFirstBtn;
                                $scope.disableLastBtn = btnFlags.disableLastBtn;

                                var communicationStatisticsData = objData.Details.results;
                                for (var i = 0; i < communicationStatisticsData.length; i++) {
                                    var CMSObject = {};
                                    CMSObject['serialNumber'] = communicationStatisticsData[i].SerialNumber;
                                    CMSObject['lastReadTime'] = communicationStatisticsData[i].LastReadTime === 'NA' ? 'NA' : moment.tz(communicationStatisticsData[i].LastReadTime, userTimeZone).format('YYYY-MM-DD HH:mm:ss');
                                    CMSObject['Status'] = communicationStatisticsData[i].Status;
                                    arrData.push(CMSObject);
                                }
                                $scope.commStatMsg = '';
                                $scope.commStatsOptions.data = arrData;
                            } else if(objData.type === false) {
                                $scope.disableNxtBtn = true;
                                $scope.disablePrvBtn = true;
                                $scope.disableFirstBtn = true;
                                $scope.disableLastBtn = true;
                                $scope.pagination.totalRecordsInDBCount = 0;
                                $scope.pagination.totalTablePages = 1;
                                $scope.commStatMsg = 'No Data found!';
                            } else {
                                $scope.commStatMsg = 'No Data found!';
                            }
                        });
                    }

                    $scope.nxtPageBtnClick = function() {
                        if($scope.pagination.currentTablePage < $scope.pagination.totalTablePages && $scope.pagination.totalTablePages > 0) {
                            let nextAPIPage = ++$scope.pagination.currentTablePage;
                            $scope.disablePrvBtn = false;
                            $scope.initializeTable(nextAPIPage, $scope.pagination.currentTablePaginationSize);
                        } else {
                            $scope.disableNxtBtn = true;
                            $scope.disablePrvBtn = false;
                            $scope.disableLastBtn = true;
                        }
                    }

                    $scope.prvPageBtnClick = function() {
                        if($scope.pagination.currentTablePage > 1 && $scope.pagination.currentTablePage <= $scope.pagination.totalTablePages) {
                            let prevAPIPage = --$scope.pagination.currentTablePage;
                            $scope.disableNxtBtn = false;
                            $scope.initializeTable(prevAPIPage, $scope.pagination.currentTablePaginationSize);
                        } else {
                            $scope.disablePrvBtn = true;
                            $scope.disableNxtBtn = false;
                            $scope.disableFirstBtn = true;
                        }
                    }

                    $scope.firstPageBtnClick = function() {
                        if($scope.pagination.currentTablePage > 1 && $scope.pagination.currentTablePage <= $scope.pagination.totalTablePages) {
                            $scope.pagination.currentTablePage = 1;
                            let firstPage = 1;
                            $scope.disableNxtBtn = false;
                            $scope.disableFirstBtn = true;
                            $scope.initializeTable(firstPage, $scope.pagination.currentTablePaginationSize);
                        } else {
                            $scope.disablePrvBtn = true;
                            $scope.disableNxtBtn = false;
                        }
                    }

                    $scope.lastPageBtnClick = function() {
                        if($scope.pagination.currentTablePage >= 1 && $scope.pagination.currentTablePage <= $scope.pagination.totalTablePages) {
                            $scope.pagination.currentTablePage = $scope.pagination.totalTablePages;
                            let lastPage = $scope.pagination.totalTablePages;
                            $scope.disableNxtBtn = false;
                            $scope.disableLastBtn = true;
                            $scope.initializeTable(lastPage, $scope.pagination.currentTablePaginationSize);
                        } else {
                            $scope.disablePrvBtn = true;
                            $scope.disableNxtBtn = false;
                        }
                    }

                    $scope.paginationBoxChanges = function() {
                        if($scope.pagination.currentTablePage) {
                            $scope.initializeDate($scope.pagination.currentTablePage, $scope.pagination.currentTablePaginationSize);
                        } else {
                            $scope.pagination.currentTablePage = 1;
                            $scope.initializeTable($scope.pagination.currentTablePage, $scope.pagination.currentTablePaginationSize);
                        }
                    }

                    

                    /**
                     * @description
                     * Function to register grid
                     *
                     * @param searchValue
                     * @return Nil
                     
                     */
                    /* $scope.commStatsOptions.onRegisterApi = function (gridApi) {
                        $scope.gridApi = gridApi;
                        $scope.gridApi.core.refresh();
                    }; */

                    /**
                     * Function to initialize communication statistics data
                     */
                    /* function init() {
                        // console.log($scope.pagination.apiCurrentPage)
                        arrData = [];
                        $scope.commStatsOptions.data = [];
                        $scope.startingDate = null;
                        $scope.endingDate = null;
                        $scope.startingDate = new Date(moment.tz(userTimeZone)
                            .format('YYYY-MM-DD HH:mm'));
                        $scope.startingDate.setDate(
                            $scope.startingDate.getDate() -
                            objCacheDetails.userDetails.DefaultDataDisplayPeriod);
                        $scope.endingDate = new Date(moment.tz(userTimeZone)
                            .format('YYYY-MM-DD HH:mm'));
                        $scope.endingDate = $scope.endingDate
                            .setMinutes($scope.endingDate.getMinutes() + 1);
                        reportsService.communicationStatistics(
                            (type === 'HyperSprout' || type === 'Hyperhub') ? 'CommunicationsStatisticsReport' : 'MeterCommunicationsStatisticsReport', type === 'HyperSprout' ? false : (type === 'Hyperhub' ? true : undefined)).then(function (objData) {
                                if (!angular.isUndefinedOrNull(objData) &&
                                    !angular.isUndefinedOrNull(objData.Details)) {
                                    var communicationStatisticsData = objData.Details;
                                    for (var i = 0; i < communicationStatisticsData.length; i++) {
                                        var CMSObject = {};
                                        CMSObject['serialNumber'] = communicationStatisticsData[i].SerialNumber;
                                        CMSObject['lastReadTime'] = communicationStatisticsData[i].LastReadTime === 'NA' ? 'NA' : moment.tz(communicationStatisticsData[i].LastReadTime, userTimeZone).format('YYYY-MM-DD HH:mm:ss');
                                        CMSObject['Status'] = communicationStatisticsData[i].Status;
                                        arrData.push(CMSObject);
                                    }
                                    $scope.commStatMsg = '';
                                }
                                $scope.commStatsOptions.data = arrData;
                            $scope.commStatMsg = 'No Data found!';
                            $timeout(function () {
                                $scope.$apply();
                            }, 300, false);
                            });

                    } */
                    

                    /**
                     * @description
                     * Function to add endpoint
                     *
                     * @param endPoints
                     * @return Nil
                     
                     */
                    $scope.filterReportsData = function (searchID) {
                        if(searchID && arrData && arrData.length > 0){
                            $scope.commStatsOptions.data = $filter('serialIDFilter')(arrData, searchID);
                        } else {
                            $scope.commStatsOptions.data = arrData;
                        }
                    };

                    /**
                     *  @description
                     * Function to filter configuration data on date
                     *
                     * @param nil
                     * @return Nil
                     
                     */
                    $scope.filterConfiguration = function () {
                        $scope.commStatsOptions.data = $filter('dateFilter')(arrData, "lastReadTime", $scope.startingDate, $scope.endingDate);
                        $scope.dynamicPopover.isOpen = false;
                    };

                    $controller('dateCommonCtrl', { $scope: $scope });
                    $scope.formats = ['yyyy-MM-dd'];

                    /**
                     *  @description
                     * Function to print
                     *
                     * @param nil
                     * @return Nil
                     
                     */
                    $scope.printCart = function () {
                        window.print();
                    };

                    /**
                     *   @description
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

                    $scope.toggle = function() {
                        $scope.isSelected = true;
                        $scope.ticked = !$scope.ticked;
                    }
                }]);
})(window.angular);
