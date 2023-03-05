/**
 * @description
 * Controller for downloading Hypersprouts
 */
(function (angular) {
    "use strict";
    angular.module('dataVINEApp').controller('hyperSproutDownloadsCtrl',
        ['$scope', '$uibModal', '$timeout',
            'hypersproutMgmtService', '$filter',
            'refreshservice', '$controller', 'formatDate',
            function ($scope, $uibModal, $timeout, hypersproutMgmtService, $filter, refreshservice, $controller, formatDate) {
                $scope.downloadOptions = {};
                $scope.startingDate = null;
                $scope.endingDate = null;
                $scope.invalidDate = false;
                $scope.invalidTime = false;
                var modalInstance = null;
                var downloadData = [];
                var userTimeZone = angular.isUndefinedOrNull(objCacheDetails.userDetails) ? undefined : objCacheDetails.userDetails.timeZone;
                if (angular.isUndefined(userTimeZone)) {
                    refreshservice.refresh().then(function () {
                        userTimeZone = objCacheDetails.userDetails.timeZone;
                        initializeDateForHyerSproutDownload(false);
                    });
                } else {
                    initializeDateForHyerSproutDownload(false);
                }
                $controller('dateCommonCtrl', { $scope: $scope });

                /**
                 * Function to initialize Date downloading Hypersprout
                 */
                function initializeDateForHyerSproutDownload(flag) {
                    if (!flag) {
                        $scope.startingDate = new Date(moment
                            .tz(userTimeZone)
                            .format('YYYY-MM-DD HH:mm'));
                        $scope.endingDate = new Date(moment
                            .tz(userTimeZone)
                            .format('YYYY-MM-DD HH:mm'));
                        formatDate.getFormatedDate(
                            $scope, 'download',
                            function (fDate, tDate, tZone) {
                                userTimeZone = tZone;
                                init(fDate, tDate);
                            });
                    } else {
                        init(moment
                            .utc($scope.startingDate)
                            .format('YYYY-MM-DDTHH:mm:ss.SSS') + 'Z',
                            moment.utc($scope.endingDate)
                                .format('YYYY-MM-DDTHH:mm:ss.SSS') + 'Z');
                    }
                }
                $scope.downloadOptions = angular.copy(objCacheDetails.grid);
                $scope.downloadOptions.data = [];
                $scope.downloadOptions.exporterPdfOrientation = 'landscape',
                $scope.downloadOptions.exporterPdfMaxGridWidth = 640;
                $scope.downloadOptions.columnDefs = [
                    { field: 'Job Id', enableHiding: false },
                    {
                        field: 'Name', displayName: ' Description',
                        enableHiding: false
                    },
                    { field: 'Group', enableHiding: false },
                    {
                        field: 'SerialNumber', displayName: 'Serial Number',
                        enableHiding: false, width: 200
                    },
                    {
                        field: 'Status', enableHiding: false,
                        cellTemplate: '<div style="margin-top: 5px;margin-left:5px" ' +
                            ' ng-class="{ statusColor:row.entity.Status==\'Failed\'}"' +
                            ' >{{row.entity.Status}}  </div>'
                    },
                    {
                        field: 'Start Time', sort: { direction: 'desc' },
                        enableHiding: false
                    },
                    {
                        field: 'Edit Time', displayName: 'End Time',
                        enableHiding: false
                    }
                ];

                /**
                 * Function to initialize data based on date range
                 */
                function init(fromDate, toDate) {
                    downloadData = [];
                    hypersproutMgmtService.getJobStatus(['HyperSprout',
                        fromDate, toDate], 'ListDownloadJobs')
                        .then(function (objData) {
                            if (!angular.isUndefinedOrNull(objData) &&
                                !angular.isUndefinedOrNull(objData['Download Jobs'])) {
                                var JobStatusForHSDown = objData['Download Jobs'];
                                for (var cnt in JobStatusForHSDown) {
                                    if (!angular
                                        .isUndefinedOrNull(
                                            JobStatusForHSDown[cnt].CommitTimestamp)
                                    ) {
                                        JobStatusForHSDown[cnt].CommitTimestamp =
                                            moment.tz(
                                                JobStatusForHSDown[cnt]
                                                    .CommitTimestamp, userTimeZone
                                            ).format('YYYY-MM-DD HH:mm');
                                    }
                                    var objToInsert = {};
                                    objToInsert["Job Id"] = JobStatusForHSDown[cnt].JobID;
                                    objToInsert["Name"] =
                                        JobStatusForHSDown[cnt].JobType;
                                    objToInsert["SerialNumber"] =
                                        JobStatusForHSDown[cnt].SerialNumber;
                                    objToInsert["Group"] =
                                        JobStatusForHSDown[cnt].Group;
                                    objToInsert["Status"] =
                                        JobStatusForHSDown[cnt].Status;
                                    objToInsert["Start Time"] =
                                        angular.isUndefinedOrNull(
                                            JobStatusForHSDown[cnt]
                                                .CreatedDateTimestamp) ? '' : moment
                                                    .tz(
                                                        JobStatusForHSDown[cnt]
                                                            .CreatedDateTimestamp,
                                                        userTimeZone
                                                    )
                                                    .format('YYYY-MM-DD HH:mm:ss');
                                    objToInsert["Edit Time"] = angular
                                        .isUndefinedOrNull(
                                            JobStatusForHSDown[cnt]
                                                .EndTime) ? '' : moment
                                                    .tz(
                                                        JobStatusForHSDown[cnt]
                                                            .EndTime, userTimeZone
                                                    )
                                                    .format('YYYY-MM-DD HH:mm:ss');
                                    objToInsert["No of endpoints"] = 1;
                                    downloadData.push(objToInsert);
                                }
                            }
                            $scope.downloadOptions.data = downloadData;
                        });
                }

                $scope.dynamicPopover = {
                    templateUrl: '/templates/downloadSettings.html',
                    content: '',
                    open: function () {
                        $scope.dynamicPopover.isOpen = true;
                    },
                    close: function () {
                        $scope.dynamicPopover.isOpen = false;
                    }
                };

                /**
                 *  @description
                 * Function to filter download config
                 *
                 * @param Nil
                 * @return Nil
                 
                 */
                $scope.downloadFilterConfig = function () {
                    initializeDateForHyerSproutDownload(true);
                    $scope.dynamicPopover.isOpen = false;
                };

                /**
                 * @description
                 * Function to download configuration
                 *
                 * @param size
                 * @return Nil
                 
                 */
                $scope.openDownloadConfiguration = function (size) {
                    modalInstance = $uibModal.open({
                        templateUrl: '/templates/downloadConfiguration.html',
                        controller: 'downloadConfigurationCtrl',
                        size: size,
                        backdrop: 'static',
                        keyboard: true
                    });
                    modalInstance.result.then(function () {
                        initializeDateForHyerSproutDownload(false);
                    }, function () {
                        initializeDateForHyerSproutDownload(false);
                    });
                    $scope.dynamicPopover.isOpen = false;
                };

                /**
                 * @description
                 * Function to print
                 *
                 * @param size
                 * @return Nil
                 
                 */
                $scope.printCart = function () {
                    window.print();
                };

                /**
                 *  @description
                 * Event handler on destroying the controller to
                 * close all pop-up instances
                 *
                 * @param Nil
                 * @return Nil
                 
                 */
                $scope.$on('$destroy', function () {
                    if (!angular.isUndefinedOrNull(modalInstance)) {
                        modalInstance.dismiss();
                        modalInstance = null;
                    }
                });
            }]);
})(window.angular);