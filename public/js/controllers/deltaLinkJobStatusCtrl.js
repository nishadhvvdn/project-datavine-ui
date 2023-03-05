/**
 * @description
 * Controller for handling Job status
 */
(function (angular) {
    "use strict";
    angular.module('dataVINEApp').controller('deltaLinkJobStatusCtrl',
        ['$scope', '$rootScope', '$uibModal', '$timeout', 'hypersproutMgmtService',
            '$filter', 'refreshservice', '$controller', 'type',
            'formatDate', 'DeviceService', '$templateCache', 'commonService', '$sessionStorage',
            function ($scope, $rootScope, $uibModal, $timeout, hypersproutConfigService, $filter,
                      refreshservice, $controller, type, formatDate, deviceService, $templateCache, commonService, $sessionStorage) {
                let currentDefaultTablePageSize = objCacheDetails.grid.paginationPageSize;
                let userTimeZone = angular.isUndefinedOrNull(objCacheDetails.userDetails) ? undefined : objCacheDetails.userDetails.timeZone;
                if (angular.isUndefined(userTimeZone)) {
                    userTimeZone = $sessionStorage.get('userTimeZone');
                }
                window.onbeforeunload = function () {
                    $sessionStorage.put('userTimeZone', userTimeZone);
                };
                $scope.loading = true;
                $scope.startingDate = null;
                $scope.endingDate = null;
                $scope.queryParamForAPI = '';

                $scope.invalidSelection = false;
                $scope.invalidDate = false;
                $scope.invalidTime = false;

                let deltaLinkData = [];
                let jobsNameMatrix = {
                    'Firmware Jobs' : 'Firmware Job',
                    'Interval Read Jobs' : 'Interval Read Job',
                    'Registration Jobs' : 'Registration Job',
                    'Running Jobs' : 'Running Jobs',
                    'Historical Jobs': 'Historical Job'
                }
                let customStartDate = '';
                let customEndDate = '';

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
                    templateUrl: 'templates/deltaLinkJobStatusFilters.html',
                    content: '',
                    open: function () {
                        $scope.dynamicPopover.isOpen = true;
                    },
                    close: function () {
                        $scope.dynamicPopover.isOpen = false;
                    }
                };

                $scope.ListOfJobItems = [
                    {
                        isSelected: true,
                        desc: "Firmware Jobs"
                    }, {
                        isSelected: true,
                        desc: "Interval Read Jobs"
                    }, {
                        isSelected: true,
                        desc: "Registration Jobs"
                    }];
                $scope.jobsObject = [{
                        isSelected: false,
                        desc: "Running Jobs"
                    }, {
                        isSelected: false,
                        desc: "Historical Jobs"
                    }];
                $controller('dateCommonCtrl', {$scope: $scope});
                $scope.AllSelectedJobs = false;
                $scope.NoSelectedJobs = false;

                initializeDate();

                function initializeDate() {
                    $scope.startingDate = new Date(moment.tz(userTimeZone).format('YYYY-MM-DD HH:mm'));
                    $scope.endingDate = new Date(moment.tz(userTimeZone).format('YYYY-MM-DD HH:mm'));

                    let startDate = moment.utc($scope.startingDate).subtract(2, 'days').format('YYYY-MM-DDTHH:mm:ss.SSS') + 'Z';
                    $scope.startingDate = startDate;
                    let endDate = moment.utc($scope.endingDate).format('YYYY-MM-DDTHH:mm:ss.SSS') + 'Z';
                    let filtersArray = extractFilterData();
                    $scope.queryParamForAPI = `&StartTime=${startDate}&EndTime=${endDate}&filter=${filtersArray ? filtersArray.toString() : 'none'}`;
                }

                $scope.initializeTable = function (pageNum) {
                    $scope.jobStatusGrid = angular.copy(objCacheDetails.grid);
                    $scope.jobStatusGrid.data = [];
                    $scope.jobStatusGrid.exporterPdfOrientation = 'landscape';
                    $scope.jobStatusGrid.exporterPdfMaxGridWidth = 640;
                    $scope.jobStatusGrid.exporterCsvFilename = 'file.csv';
                    $scope.jobStatusGrid.columnDefs = [
                        {field: 'Job ID', displayName: 'Job ID', enableHiding: false},
                        {field: 'Description', enableHiding: false},
                        {
                            field: 'Status', enableHiding: false,
                            cellTemplate: '<div class="ui-grid-cell-contents"' +
                                ' ng-class="{ statusColor:row.entity.Status==\'Failed\'}">' +
                                '{{row.entity.Status}}  </div>'
                        },
                        {field: 'Group', displayName: 'Job Name', enableHiding: false},
                        {
                            field: 'SerialNumber',
                            displayName: 'Serial Number', enableHiding: false, width: 180
                        },
                        {
                            field: 'Start Time', sort: {direction: 'desc'},
                            enableHiding: false
                        },
                        {field: 'End Time', enableHiding: false}
                    ];
                    $scope.jobStatusGrid.exporterSuppressColumns = ['Actions'];
                    $scope.jobStatusGrid.onRegisterApi = function (gridApi) {
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
                    deltaLinkData.length = 0;
                    deviceService.fetchDeltaLinkJobStatus(pageNum, limit, $scope.queryParamForAPI)
                        .then(function (apiData) {
                            if (!angular.isUndefinedOrNull(apiData) && apiData.type) {

                                $scope.pagination.currentTotalItems = apiData.JobsArray.results.length;
                                $scope.pagination.apiCurrentPage = pageNum;
                                $scope.pagination.totalRecordsInDBCount = apiData.JobsArray.totalRecords;
                                $scope.pagination.totalTablePages = Math.ceil($scope.pagination.totalRecordsInDBCount / $scope.pagination.currentTablePaginationSize);

                                let btnFlags = commonService.getBtnStatus($scope.pagination.currentTablePage, $scope.pagination.totalTablePages);
                                $scope.disableNxtBtn = btnFlags.disableNxtBtn;
                                $scope.disablePrvBtn = btnFlags.disablePrvBtn;
                                $scope.disableFirstBtn = btnFlags.disableFirstBtn;
                                $scope.disableLastBtn = btnFlags.disableLastBtn;

                                apiData = apiData.JobsArray.results;
                                $rootScope.commonMsg = "";
                                for (let i = 0; i < apiData.length; i++) {
                                    let objToInsert = {};
                                    objToInsert["Job ID"] = apiData[i].JobID;
                                    objToInsert["Description"] = commonService.addTrademark(apiData[i].JobType);
                                    objToInsert["Status"] = apiData[i].Status;
                                    objToInsert["SerialNumber"] = apiData[i].SerialNumber ? apiData[i].SerialNumber : '-';
                                    objToInsert["Group"] = apiData[i].JobName;
                                    objToInsert["Start Time"] = moment.tz(apiData[i].CreatedDateTimestamp, userTimeZone).format('YYYY-MM-DD HH:mm:ss');
                                    objToInsert["End Time"] = angular.isUndefinedOrNull(apiData[i].EndTime) ? '-' : moment.tz(apiData[i].EndTime, userTimeZone).format('YYYY-MM-DD HH:mm:ss');
                                    objToInsert["type"] = apiData.JobType;
                                    deltaLinkData.push(objToInsert);
                                }
                                $scope.jobStatusGrid.data = deltaLinkData;
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

                function extractFilterData() {
                    let arrayList = [];
                    for (let i = 0, len = $scope.ListOfJobItems.length; i < len; i++) {
                        if ($scope.ListOfJobItems[i].isSelected === true) {
                            arrayList.push(jobsNameMatrix[$scope.ListOfJobItems[i].desc]);
                        }
                    }
                    for (let i = 0, len = $scope.jobsObject.length; i < len; i++) {
                        if ($scope.jobsObject[i].isSelected === true) {
                            arrayList.push(jobsNameMatrix[$scope.jobsObject[i].desc]);
                        }
                    }
                    return arrayList;
                }

                $scope.submitFilterConfig = function () {
                    customStartDate = moment.utc($scope.startingDate).format('YYYY-MM-DDTHH:mm:ss.SSS') + 'Z';
                    customEndDate =  moment.utc($scope.endingDate).format('YYYY-MM-DDTHH:mm:ss.SSS') + 'Z';
                    let arrayList = extractFilterData();
                    $scope.queryParamForAPI = `&StartTime=${customStartDate}&EndTime=${customEndDate}&filter=${arrayList ? arrayList.toString() : 'none'}`;
                    $scope.pagination.currentTablePage = 1;
                    $scope.initializeTable(1);
                    $scope.dynamicPopover.isOpen = false;
                };


                $scope.errorUpdate = function () {
                    $scope.invalidSelection = !($scope.ListOfJobItems[0].isSelected ||
                        $scope.ListOfJobItems[1].isSelected ||
                        $scope.ListOfJobItems[2].isSelected ||
                        $scope.jobsObject[0].isSelected ||
                        $scope.jobsObject[1].isSelected);
                };

                $scope.printCart = function () {
                    window.print();
                };

                $scope.$on('$destroy', function () {
                    $templateCache.put('ui-grid/pagination', commonService.setDefaultTable());
                });

            }])
})(window.angular);
