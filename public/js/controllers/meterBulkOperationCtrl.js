/**
 * @description
 * Controller for handling Job status
 */

(function (angular) {
    "use strict";
    angular.module('dataVINEApp').controller('meterBulkOperationCtrl',
        ['$scope', '$uibModal', '$state', '$rootScope', 'commonService', 'MeterMgmtService', 
            '$filter', 'refreshservice', '$controller',  
            'formatDate', '$sessionStorage', '$templateCache', '$timeout', 'uiGridExporterService', 'uiGridExporterConstants',  function ($scope, $uibModal, 
                $state, $rootScope, commonService, 
                MeterMgmtService, $filter, refreshservice,  
                $controller, formatDate, $sessionStorage, $templateCache, $timeout, uiGridExporterService, uiGridExporterConstants) {
                   
                let currentDefaultTablePageSize = objCacheDetails.grid.paginationPageSize;
                let userTimeZone = angular.isUndefinedOrNull(objCacheDetails.userDetails) ? undefined : objCacheDetails.userDetails.timeZone;
                if (angular.isUndefined(userTimeZone)) {
                    userTimeZone = $sessionStorage.get('userTimeZone');
                }
                window.onbeforeunload = function () {
                    $sessionStorage.put('userTimeZone', userTimeZone);
                };
                let isFilterEnabled = false; 
                $scope.pagination = {
                    totalRecordsInDBCount : 0,
                    currentTotalItems: 0,
                    apiCurrentPage: 1,
                    apiNextPage: 0,
                    currentTablePage: 1,
                    currentTablePaginationSize: objCacheDetails.grid.paginationPageSize,
                    totalTablePages: 1
                };
                $scope.disableNxtBtn = true;
                $scope.disablePrvBtn = true;
                $scope.disableFirstBtn = true;
                $scope.disableLastBtn = true;
                let modalInstance = null;
                $scope.statusOptions = {};
                $scope.loading = true;
                $scope.startingDate = null;
                $scope.endingDate = null;
                let tagData = [];
                $scope.jobsObject = [];

                $scope.initializeTable = function(pageNum, currentDefaultTablePageSize) {
                    $scope.statusOptions = angular.copy(objCacheDetails.grid);
                    $scope.statusOptions.data = [];
                    $scope.statusOptions.exporterPdfOrientation = 'landscape';
                    $scope.statusOptions.exporterPdfMaxGridWidth = 640;
                    $scope.statusOptions.enableRowHeaderSelection = false;
                    $scope.statusOptions.exporterMenuCsv =  false;
         
                    $scope.statusOptions.gridMenuCustomItems = [                    
                    {
                        title: 'Export all data as csv',
                        action: function ($event) {
                            var uiExporter = uiGridExporterService;
                            var grid = $scope.gridApi.grid;
                            var exportColumnHeaders = uiExporter.getColumnHeaders(grid, uiGridExporterConstants.VISIBLE);
                            var selectionData = [];
                            MeterMgmtService.getListAllBulkOperations(
                            'ListAllBulkOperations')
                            .then(function (objData) {
                                var arrayData = objData.JobLists;
                                arrayData.forEach(function (entry) {
                                var innerData = [];
                                entry.CreatedDateTimestamp =  angular
                                .isUndefinedOrNull(
                                    entry.CreatedDateTimestamp) ? '' : moment
                                        .tz(entry.CreatedDateTimestamp,
                                            userTimeZone
                                        ).format('YYYY-MM-DD HH:mm:ss');
                                for (var e in entry) { //create the inner data object array
                                    if (e !== '$$hashKey') {
                                        var selectObj = { value: entry[e] };                                           
                                        innerData.push(selectObj);
                                    }
                                }
                                selectionData.push(innerData); //push the inner object value array to the larger array as required by formatAsCsv
                                });
                                var csvContent = uiExporter.formatAsCsv(exportColumnHeaders, selectionData, grid.options.exporterCsvColumnSeparator);
                                uiExporter.downloadFile($scope.statusOptions.exporterCsvFilename, csvContent, grid.options.exporterOlderExcelCompatibility);
                            });                                                                                                                                                                                          
                        }
                    },
                    {
                        title: 'Export visible data as csv',
                        action: function ($event) {  
                            var grid = $scope.gridApi.grid;
                            var rowTypes = uiGridExporterConstants.ALL;
                            var colTypes = uiGridExporterConstants.ALL;
                            uiGridExporterService.csvExport(grid, rowTypes, colTypes);                                                                                                                                                                                              
                        }
                    }];

                    $scope.statusOptions.columnDefs = [
                        { field: 'JobType', displayName: 'Name', enableHiding: false },
                        { field: 'DateAndTime', displayName: 'Date and Time', enableHiding: false },
                        {
                            field: 'Download', enableHiding: false,
                            cellTemplate: '<div class="ui-grid-cell-contents">' +
                                '<button class="btn btn-xs btn-primary cellBtn"' +
                                ' ng-click="grid.appScope.downloadBulkOperationList(row,\'single\')" title="Download"> ' +
                                ' <i class="fa fa-download" aria-hidden="true"></i></button></div>',
                        }
                    ];

                    $scope.statusOptions.exporterSuppressColumns = ['Download'];
                    $scope.statusOptions.onRegisterApi = function (gridApi) {
                        $scope.gridApi = gridApi;
                        commonService.getGridApi($scope, gridApi);
                        gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {
                            $scope.pagination.currentTablePaginationSize = pageSize;                            
                            $scope.pagination.totalTablePages = Math.ceil($scope.pagination.currentTotalItems / pageSize);
                            pageNum = 1;
                            $scope.pagination.currentTablePage = 1;
                           // filterWithDate(isFilterEnabled, pageNum);
                        });
                    };

                    filterWithDate(isFilterEnabled, pageNum);
                    $templateCache.put('ui-grid/pagination', commonService.getModifiedTable());
                };

                $scope.initializeTable($scope.pagination.apiCurrentPage, currentDefaultTablePageSize);

                /**
                 * @description
                 * Function to filter job status data based on date
                 *
                 * @param allow
                 * @return Nil                 
                 */
                function filterWithDate(allow, pageNum) {
                    if (!allow) {
                        $scope.startingDate = new Date(moment
                            .tz(userTimeZone).format('YYYY-MM-DD HH:mm'));
                        $scope.endingDate = new Date(moment
                            .tz(userTimeZone).format('YYYY-MM-DD HH:mm'));
                        formatDate.getFormatedDate($scope, 'jobstatus',
                            function (fDate, tDate, tZone) {
                               // userTimeZone = tZone;
                                init(fDate, tDate, allow, pageNum);
                            });
                    } else {
                        init(moment.utc($scope.startingDate)
                            .format('YYYY-MM-DDTHH:mm:ss.SSS') + 'Z',
                            moment.utc($scope.endingDate)
                                .format('YYYY-MM-DDTHH:mm:ss.SSS') + 'Z', allow, pageNum);
                    }
                }

                
                /**
                 *  @description
                 * Function to initialize the job status data
                 *
                 * @param fromDate
                 * @param toDate
                 * @param flag
                 * @return Nil
                 
                 */
                function init(fromDate, toDate, flag, pageNum) {
                    tagData = [];
                    if(!flag) {
                        fromDate = null;
                        toDate = null;
                    }
                    MeterMgmtService.getListOfJobBulkOperations(
                        'ListOfJobBulkOperations', pageNum, $scope.pagination.currentTablePaginationSize, fromDate, toDate)
                        .then(function (objData) {
                            if (!angular.isUndefinedOrNull(objData) &&
                                !angular.isUndefinedOrNull(objData.JobLists) && !angular.isUndefinedOrNull(objData.JobLists.results)) {
                               let arrayData = objData.JobLists.results;

                               $scope.pagination.apiCurrentPage = pageNum;
                               $scope.pagination.totalRecordsInDBCount = objData.JobLists.totalRecords;
                               $scope.pagination.totalTablePages = Math.ceil($scope.pagination.totalRecordsInDBCount / $scope.pagination.currentTablePaginationSize);

                                let btnFlags = commonService.getBtnStatus($scope.pagination.currentTablePage, $scope.pagination.totalTablePages);
                                $scope.disableNxtBtn = btnFlags.disableNxtBtn;
                                $scope.disablePrvBtn = btnFlags.disablePrvBtn;
                                $scope.disableFirstBtn = btnFlags.disableFirstBtn;
                                $scope.disableLastBtn = btnFlags.disableLastBtn;

                               for (var i = 0; i < arrayData.length; i++) {
                                    var objTagDiscrepency = arrayData[i];
                                    var objToInsert = {};
                                    objToInsert["dateTimeAsList"] = objTagDiscrepency.CreatedDateTimestamp;
                                    objToInsert["JobType"] = objTagDiscrepency.filename;
                                    objToInsert["DateAndTime"] = angular
                                        .isUndefinedOrNull(objTagDiscrepency
                                            .CreatedDateTimestamp) ? '' : moment
                                                .tz(objTagDiscrepency.CreatedDateTimestamp,
                                                    userTimeZone
                                                ).format('YYYY-MM-DD HH:mm:ss');
                                   
                                    tagData.push(objToInsert);
                                }
                                $scope.statusOptions.data = tagData;
                                $rootScope.commonMsg = '';
                            }  else if(objData.type === false) {
                                $scope.disableNxtBtn = true;
                                $scope.disablePrvBtn = true;
                                $scope.disableFirstBtn = true;
                                $scope.disableLastBtn = true;
                                $scope.pagination.totalTablePages = 1;
                                $scope.pagination.totalRecordsInDBCount = 0;
                                $rootScope.commonMsg = 'No data found!';
                            } else {
                                $rootScope.commonMsg = 'No data found!';
                            }
                        });
                }

                /**
                 *  @description
                 * Function to assign endpoint by
                 * opening a pop-up
                 *
                 * @param size
                 * @return Nil
                 
                 */
                $scope.openBulkOperation = function (size) {
                    objCacheDetails.data.groupList = $scope.groupData;
                    modalInstance = $uibModal.open({
                        templateUrl: '/templates/bulkOperation.html',
                        controller: 'bulkOperationsCtrl',
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
                        $scope.initializeTable($scope.pagination.currentTablePage, $scope.pagination.currentTablePaginationSize);
                    }, function (callApi) {
                        if(callApi) {
                            $scope.pagination.currentTablePage = 1;
                            $scope.initializeTable($scope.pagination.currentTablePage, $scope.pagination.currentTablePaginationSize);
                        }
                    });
                    $scope.dynamicPopover.isOpen = false;
                };

                $scope.nxtPageBtnClick = function () {
                    if($scope.pagination.currentTablePage < $scope.pagination.totalTablePages && $scope.pagination.totalTablePages > 0) {
                        let nextAPIPage = ++$scope.pagination.currentTablePage;
                        $scope.disablePrvBtn = false;
                        $scope.initializeTable(nextAPIPage, $scope.pagination.currentTablePaginationSize);
                    } else {
                        $scope.disableNxtBtn = true;
                        $scope.disablePrvBtn = false;
                        $scope.disableLastBtn = true;
                    }
                };

                $scope.prvPageBtnClick = function () {
                    if($scope.pagination.currentTablePage > 1 && $scope.pagination.currentTablePage <= $scope.pagination.totalTablePages) {
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

                };

                $scope.firstPageBtnClick = function () {
                    if($scope.pagination.currentTablePage > 1 && $scope.pagination.currentTablePage <= $scope.pagination.totalTablePages) {
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
                };

                $scope.lastPageBtnClick = function () {
                    if($scope.pagination.currentTablePage >= 1 && $scope.pagination.currentTablePage <= $scope.pagination.totalTablePages) {
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
                };

                $scope.paginationBoxChanges = function () {
                    if($scope.pagination.currentTablePage) {
                        $scope.initializeTable($scope.pagination.currentTablePage, $scope.pagination.currentTablePaginationSize);
                    } else {
                        $scope.pagination.currentTablePage = 1;
                        $scope.initializeTable($scope.pagination.currentTablePage, $scope.pagination.currentTablePaginationSize);
                    }
                };


                /**
                 * 
                 */
                $scope.downloadBulkOperationList = function(details) {
                    if(details && details.entity.dateTimeAsList) {
                        MeterMgmtService.getListOfBulkOperationsByDate(
                            'ListOfBulkOperationsByDate', details.entity.dateTimeAsList)
                        .then(function (objData) {
                          exportToCsv(objData.JobLists, details.entity.JobType);                              
                        });
                    }
                }

                /**
                 * 
                 * @param {*} Results 
                 * @param {*} fileName 
                 */
                function exportToCsv(Results, fileName) {
                    let CsvString = "";               
                    CsvString = "SERIAL NO , JOB TYPE, METER DATA, JOB STATUS, REMARK"; 
                    CsvString += "\r\n";   
                    for(let i=0;i<Results.length; i++) {
                        CsvString += Results[i].SerialNumber + ",";
                        CsvString += Results[i].JobType + ",";
                        CsvString += Results[i].ConnDisconnStatus + ",";                                              
                        CsvString += Results[i].JobStatus + ","; 
                        CsvString += Results[i].Remark + ",";
                        CsvString += "\r\n";
                    }
                    CsvString = "data:application/csv," + encodeURIComponent(CsvString);
                    let x = document.createElement("A");
                    x.setAttribute("href", CsvString);
                    x.setAttribute("download", fileName+".csv");
                    document.body.appendChild(x);
                    x.click();
                };

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

                $scope.dynamicPopover = {
                    templateUrl: 'templates/bulkOperationFilter.html',
                    content: '',
                    open: function () {
                        $scope.dynamicPopover.isOpen = true;
                    },
                    close: function () {
                        $scope.dynamicPopover.isOpen = false;
                    }
                };

                /**
                 * @description
                  * Function to filter configuration for
                  * job status, meter or Hypersprout
                  *
                  * @param Nil
                  * @return Nil
                
                 */
                $scope.systemUpdates = function () {
                    isFilterEnabled = true;
                    $scope.pagination.apiCurrentPage = 1;
                    $scope.pagination.currentTablePage = 1;
                    $scope.initializeTable($scope.pagination.apiCurrentPage, currentDefaultTablePageSize);
                };

                $scope.$on('$destroy', function () {
                    $templateCache.put('ui-grid/pagination', commonService.setDefaultTable());
                });
            

                $controller('dateCommonCtrl', { $scope: $scope });
                $scope.AllSelectedJobs = false;
                $scope.NoSelectedJobs = false;
                $scope.printCart = function () {
                    window.print();
                };
            }])
        
})(window.angular);
