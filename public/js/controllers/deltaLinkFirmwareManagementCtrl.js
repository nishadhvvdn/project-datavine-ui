/**
 * @description
 * Controller for Group management for meter
 */
(function (angular) {
    "use strict";
    angular.module('dataVINEApp').controller('deltaLinkFirmwareManagementCtrl',
        ["$scope", "$uibModal", "$state", "$rootScope", '$filter', '$timeout', 'DeviceService', 'ParseService', 'refreshservice', 'commonService',
            '$templateCache', '$sessionStorage', 'firmwareManagementService', 'DeviceMappingService',
            function ($scope, $uibModal, $state, $rootScope, $filter, $timeout, deviceService, parseService, refreshservice, commonService,
                      $templateCache, $sessionStorage, firmwareManagementService, DeviceMappingService) {
                let currentDefaultTablePageSize = objCacheDetails.grid.paginationPageSize;
                $scope.isSelected = false;
                $scope.ischecked = false;
                $scope.searchTerm = "";
                $scope.mySelectedRows = [];
                let deltaLinkData = [];
                $scope.deltaLink = {};
                let userTimeZone = angular.isUndefinedOrNull(objCacheDetails.userDetails) ? undefined : objCacheDetails.userDetails.timeZone;
                if (angular.isUndefined(userTimeZone)) {
                    userTimeZone = $sessionStorage.get('userTimeZone');
                }
                window.onbeforeunload = function () {
                    $sessionStorage.put('userTimeZone', userTimeZone);
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
                let modalInstanceNested = null;
                $scope.dynamicPopover = {
                    templateUrl: '/templates/firmwareSettings.html',
                    content: '',
                    open: function () {
                        $scope.dynamicPopover.isOpen = true;
                    },
                    close: function () {
                        $scope.dynamicPopover.isOpen = false;
                    }
                };
                $scope.initializeTable = function (pageNum) {
                    $scope.deltaLinkGroupGrid = angular.copy(objCacheDetails.grid);
                    $scope.deltaLinkGroupGrid.data = [];
                    $scope.deltaLinkGroupGrid.exporterPdfOrientation = 'landscape';
                    $scope.deltaLinkGroupGrid.exporterPdfMaxGridWidth = 640;
                    $scope.deltaLinkGroupGrid.exporterCsvFilename = 'file.csv';
                    $scope.deltaLinkGroupGrid.columnDefs = [
                        { field: 'JobID', displayName: 'Job ID', enableHiding: false, width: 180 },
                        { field: 'Status', enableHiding: false },
                        { field: 'CardType', enableHiding: false },
                        { field: 'Version', enableHiding: false},
                        { field: 'GroupName', enableHiding: false },
                        { field: 'DownloadDateTimestamp', enableHiding: false },
                        {
                            field: 'Action',
                            cellTemplate: '<div class="ui-grid-cell-contents"><button type="button" class="btn btn-xs btn-primary cellBtn"' +
                                ' ng-class="(row.entity.Status===\'Failed\')? \'allow\' : \'not-allow\'" ng-click="(row.entity.Status===\'Failed\')&&grid.appScope.resendJobs(row)" title="Resend Job">' +
                                ' <i class="fa fa-repeat"></i></button></div>',
                            enableColumnMenu: false,
                            enableHiding: false, width: 70
                        }];
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
                    firmwareManagementService.fetchDeltaLinkFirmwareList(pageNum, limit,  $scope.ischecked)
                        .then(function (apiData) {
                            if (!angular.isUndefinedOrNull(apiData) && apiData.type) {
                                $scope.pagination.currentTotalItems = apiData.JobStatusFirmwareSelected.results.length;
                                $scope.pagination.apiCurrentPage = pageNum;
                                $scope.pagination.totalRecordsInDBCount = apiData.JobStatusFirmwareSelected.totalRecords;
                                $scope.pagination.totalTablePages = Math.ceil($scope.pagination.totalRecordsInDBCount / $scope.pagination.currentTablePaginationSize);

                                let btnFlags = commonService.getBtnStatus($scope.pagination.currentTablePage, $scope.pagination.totalTablePages);
                                $scope.disableNxtBtn = btnFlags.disableNxtBtn;
                                $scope.disablePrvBtn = btnFlags.disablePrvBtn;
                                $scope.disableFirstBtn = btnFlags.disableFirstBtn;
                                $scope.disableLastBtn = btnFlags.disableLastBtn;

                                $rootScope.commonMsg = "";
                                let data = apiData.JobStatusFirmwareSelected.results;
                                for (var i = 0; i < data.length; i++) {
                                    let objToInsert = {};
                                    objToInsert['JobID'] = data[i].JobID;
                                    objToInsert['Status'] = data[i].Status;
                                    objToInsert['DeviceType'] = data[i].DeviceType;
                                    objToInsert['Group'] = data[i].GroupID;
                                    objToInsert['GroupName'] = angular.isUndefined(apiData.JobStatusFirmwareSelected.AppGroup) ? 'N/A' : 
                                    apiData.JobStatusFirmwareSelected.AppGroup.hasOwnProperty(data[i].GroupID) ? apiData.JobStatusFirmwareSelected.AppGroup[data[i].GroupID] : 'N/A';
                                    objToInsert['Version'] = data[i].FirmwareID ? data[i].FirmwareID : '-';
                                    objToInsert['CardType'] = commonService.addTrademark(data[i].CardType);
                                    objToInsert['DownloadDateTimestamp'] = moment.tz(data[i].CreatedDateTimestamp, userTimeZone).format('YYYY-MM-DD HH:mm:ss');
                                    deltaLinkData.push(objToInsert);
                                }
                                $scope.deltaLinkGroupGrid.data = deltaLinkData;
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

                $scope.openImportFirmware = function (size) {
                    modalInstance = $uibModal.open({
                        templateUrl: '/templates/importFirmware.html',
                        controller: 'importFirmwareCtrl',
                        size: size,
                        backdrop: 'static',
                        keyboard: true,
                        resolve: {
                            type: function () {
                                return 'DeltaLink';
                            }
                        }
                    });
                    $scope.dynamicPopover.isOpen = false;
                };

                $scope.openEnterFirmwareDownload = function (size) {
                    modalInstance = $uibModal.open({
                        templateUrl: '/templates/enterFirmwareDownload.html',
                        controller: 'enterFirmwareDownloadCtrl',
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
                        $state.reload();
                    }, function (apiCall) {
                        if(apiCall) {
                            $state.reload();
                        }                       
                    });
                    $scope.dynamicPopover.isOpen = false;
                };

                $scope.resendJobs = function (row) {
                    swal({
                        title: "Warning!!",
                        text: "Are you sure you want to Resend Job?",
                        type: "warning",
                        showCancelButton: true,
                        confirmButtonColor: '#DD6B55',
                        confirmButtonText: 'Yes',
                        cancelButtonText: "No",
                    }, function (isConfirm) {
                        if (isConfirm) {
                            DeviceMappingService.resendJobFirmware(row.entity.JobID, row.entity.CardType)
                                .then(function (objData) {
                                    swal(objData);
                                    initDeltaGroupList(1, $scope.pagination.currentTablePaginationSize);
                                });
                        }
                    });
                };
                 /**
                     * @description
                     *  Function to filter Running Job
                     *
                     * @param firmwareRunning
                     * @return Nil
                     
                     */
                    $scope.checkValue = function (firmwareRunning) {
                        if (firmwareRunning === true) {
                            $scope.ischecked = true;
                            $scope.pagination.currentTablePage = 1;
                        $scope.initializeTable($scope.pagination.currentTablePage, $scope.pagination.currentTablePaginationSize,$scope.ischecked);
                            //$scope.deltaLinkGroupGrid.data = $filter('filter')(deltaLinkData, { 'Status': "Running" }, undefined);
                        } else {
                            $scope.ischecked = false;
                            $scope.pagination.currentTablePage = 1;
                        $scope.initializeTable($scope.pagination.currentTablePage, $scope.pagination.currentTablePaginationSize,$scope.ischecked);
                        }
                    }
                $scope.$on('$destroy', function () {
                    $templateCache.put('ui-grid/pagination', commonService.setDefaultTable());
                });
            }]);
})(window.angular);
