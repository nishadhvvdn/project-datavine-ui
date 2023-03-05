/**
 * @description
 * Controller for Firmware Management
 */
(function (angular) {
    "use strict";
    angular.module('dataVINEApp')
        .controller('firmwareManagementCtrl',
            ['$scope', '$rootScope', '$uibModal', 'firmwareManagementService',
                'deviceType', '$filter', 'refreshservice', 'DeviceMappingService', 'commonService', '$templateCache',
                function ($scope, $rootScope, $uibModal,
                    firmwareManagementService, deviceType, $filter, refreshservice, deviceMappingService, commonService, $templateCache) {
                    let currentDefaultTablePageSize = objCacheDetails.grid.paginationPageSize;
                    var modalInstance = null;
                    $scope.isCollapsed = false;
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
                    $scope.filterSelected = false;
                    $scope.firmwareOptions = {};
                    $scope.boolEdit = true;
                    var userTimeZone = angular.isUndefinedOrNull(objCacheDetails.userDetails) ? undefined : objCacheDetails.userDetails.timeZone;
                    if (angular.isUndefined(userTimeZone)) {
                        refreshservice.refresh().then(function () {
                            userTimeZone = objCacheDetails.userDetails.timeZone;
                        });
                    }
                    //init(deviceType);
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
                        $scope.firmwareOptions = angular.copy(objCacheDetails.grid);
                        $scope.firmwareOptions.data = [];
                        $scope.firmwareOptions.exporterPdfOrientation = 'landscape',
                        $scope.firmwareOptions.exporterPdfMaxGridWidth = 640;
                        $scope.firmwareOptions.columnDefs = [
                            { field: 'JobID', displayName: 'Job ID', enableHiding: false, width: 180 },
                            { field: 'Status', enableHiding: false },
                            { field: 'CardType', enableHiding: false },
                            { field: 'Version', enableHiding: false, type: 'number' },
                            { field: 'GroupName', enableHiding: false },
                            { field: 'DownloadDateTimestamp', enableHiding: false },
                            {
                                field: 'Action',
                                cellTemplate: '<div class="ui-grid-cell-contents"><button type="button" class="btn btn-xs btn-primary cellBtn"' +
                                    'ng-class="(row.entity.Status===\'Failed\')? \'allow\' : \'not-allow\'" ng-click="(row.entity.Status===\'Failed\')&&grid.appScope.resendJobs(row)" title="Resend Job">' +
                                    ' <i class="fa fa-repeat"></i></button></div>',
                                enableColumnMenu: false,
                                enableHiding: false, width: 70
                            }];
                            $scope.firmwareOptions.onRegisterApi = function (gridApi) {
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
                     * Function to initialize data of job status
                     */
                    function init(pageNum, limit) {
                        $scope.firmwareOptions.data = [];
                        firmwareManagementService.FirmwareMgmtJobStatus(deviceType, pageNum, limit , $scope.filterSelected)
                            .then(function (objData) {
                                if (objData.type) {
                                $scope.pagination.currentTotalItems = objData.JobStatusFirmwareSelected.results.length;
                                $scope.pagination.apiCurrentPage = pageNum;
                                $scope.pagination.totalRecordsInDBCount = objData.JobStatusFirmwareSelected.totalRecords;
                                $scope.pagination.totalTablePages = Math.ceil($scope.pagination.totalRecordsInDBCount / $scope.pagination.currentTablePaginationSize);
                                let btnFlags = commonService.getBtnStatus($scope.pagination.currentTablePage, $scope.pagination.totalTablePages);
                                $scope.disableNxtBtn = btnFlags.disableNxtBtn;
                                $scope.disablePrvBtn = btnFlags.disablePrvBtn;
                                $scope.disableFirstBtn = btnFlags.disableFirstBtn;
                                $scope.disableLastBtn = btnFlags.disableLastBtn;
                                    objData.JobStatusFirmwareSelected.results.forEach(function (data, index) {
                                        let objValue = {};
                                        objValue['JobID'] = data.JobID;
                                        objValue['Status'] = data.Status;
                                        objValue['DeviceType'] = data.DeviceType;
                                        objValue['Group'] = data.GroupID;
                                        objValue['GroupName'] = angular.isUndefined(objData.JobStatusFirmwareSelected.AppGroup) ? 'N/A' : objData.JobStatusFirmwareSelected.AppGroup.hasOwnProperty(data.GroupID) ? objData.JobStatusFirmwareSelected.AppGroup[data.GroupID] : 'N/A';
                                        objValue['Version'] = data.FirmwareID;
                                        objValue['CardType'] = data.CardType;
                                        objValue['DownloadDateTimestamp'] = moment.tz(data
                                            .CreatedDateTimestamp,
                                            userTimeZone).format('YYYY-MM-DD HH:mm:ss');
                                        $scope.firmwareOptions.data.push(objValue);
                                    });
                                    $rootScope.commonMsg = '';
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
                    }

                    $scope.status = {
                        isopen: false
                    };

                    /**
                     * @description
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

                    /**
                     * @description
                     * Function to import firmware by
                     * opening a pop-up
                     *
                     * @param size
                     * @return Nil
                     
                     */
                    $scope.openImportFirmware = function (size) {
                        modalInstance = $uibModal.open({
                            templateUrl: '/templates/importFirmware.html',
                            controller: 'importFirmwareCtrl',
                            size: size,
                            backdrop: 'static',
                            keyboard: true,
                            resolve: {
                                type: function () {
                                    return deviceType;
                                }
                            }
                        });
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
                     *  @description
                     * Function to download firmware by
                     * opening a pop-up
                     *
                     * @param size
                     * @return Nil
                     
                     */
                    $scope.openEnterFirmwareDownload = function (size) {
                        modalInstance = $uibModal.open({
                            templateUrl: '/templates/enterFirmwareDownload.html',
                            controller: 'enterFirmwareDownloadCtrl',
                            size: size,
                            backdrop: 'static',
                            keyboard: true,
                            resolve: {
                                type: function () {
                                    return deviceType;
                                }
                            }
                        });
                        modalInstance.result.then(function () {
                            $scope.initializeTable($scope.pagination.apiCurrentPage, currentDefaultTablePageSize);
                        }, function (callApi) {
                            if(callApi) {
                                $scope.initializeTable($scope.pagination.apiCurrentPage, currentDefaultTablePageSize);
                            }                            
                        });
                        $scope.dynamicPopover.isOpen = false;
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


                    /**
                     *  @description
                     * Function to Resend
                     *
                     * @param row
                     * @return Nil
                     
                     */
                    $scope.resendJobs = function (row) {
                        swal({
                            title: "Warning!!",
                            text: "Are you sure you want to Resend Job?",
                            type: "warning",
                            showCancelButton: true,
                            confirmButtonColor: '#DD6B55',
                            confirmButtonText: 'Yes',
                            cancelButtonText: "Cancel",
                        }, function (isConfirm) {
                            if (isConfirm) {
                                deviceMappingService
                                    .resendJobFirmware(row.entity.JobID, row.entity.CardType
                                    )
                                    .then(function (objData) {
                                        swal(objData);
                                        $scope.pagination.currentTablePage = 1;
                                        $scope.initializeTable(pagenum, currentDefaultTablePageSize);
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
                        $scope.filterSelected = firmwareRunning;
                        $scope.pagination.currentTablePage = 1;
                        $scope.initializeTable(1, $scope.pagination.currentTablePaginationSize);
                        $scope.dynamicPopover.isOpen = false;
                    }
                    $scope.$on('$destroy', function () {
                        $templateCache.put('ui-grid/pagination', commonService.setDefaultTable());
                    });
                }]);
})(window.angular);