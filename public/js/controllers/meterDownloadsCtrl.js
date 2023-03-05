/**
 * @description
 * Controller to download meter
 */
(function (angular) {
    "use strict";
    angular.module('dataVINEApp').controller('meterDownloadsCtrl',
        ['$scope', '$uibModal', '$timeout',
            'hypersproutMgmtService', '$filter',
            'refreshservice', '$controller',
            'formatDate',
            function ($scope, $uibModal,
                $timeout, hypersproutMgmtService,
                $filter, refreshservice, $controller, formatDate) {
                $scope.downloadOptions_meter = {};
                $scope.startingDate = null;
                $scope.endingDate = null;
                var modalInstance = null;
                var downloadData_meter = [];
                $scope.invalidDate = false;
                $scope.invalidTime = false;
                var userTimeZone = angular
                    .isUndefinedOrNull(objCacheDetails
                        .userDetails) ? undefined : objCacheDetails
                            .userDetails.timeZone;
                if (angular.isUndefined(userTimeZone)) {
                    refreshservice.refresh().then(function () {
                        userTimeZone = objCacheDetails.userDetails.timeZone;
                        initializeDateForMeterDownload(false);
                    });
                } else {
                    initializeDateForMeterDownload(false);
                }

                /**
                 *  @description
                 * Function to initialize data for meter download 
                 * based on date
                 *
                 * @param flag
                 * @return Nil
                 
                 */
                function initializeDateForMeterDownload(flag) {
                    if (!flag) {
                        $scope.startingDate = new Date(moment
                            .tz(userTimeZone).format('YYYY-MM-DD HH:mm'));
                        $scope.endingDate = new Date(moment
                            .tz(userTimeZone)
                            .format('YYYY-MM-DD HH:mm'));
                        formatDate.getFormatedDate($scope, 'download',
                            function (fDate, tDate, tZone) {
                                userTimeZone = tZone;
                                init(fDate, tDate);
                            });
                    } else {
                        init(moment.utc($scope.startingDate)
                            .format('YYYY-MM-DDTHH:mm:ss.SSS') + 'Z',
                            moment.utc($scope.endingDate)
                                .format('YYYY-MM-DDTHH:mm:ss.SSS') + 'Z');
                    }
                }
                $scope.downloadOptions_meter = angular.copy(objCacheDetails.grid);
                $scope.downloadOptions_meter.data = [];
                $scope.downloadOptions_meter.exporterPdfOrientation = 'landscape',
                $scope.downloadOptions_meter.exporterPdfMaxGridWidth = 640;
                $scope.downloadOptions_meter.columnDefs = [
                    { field: 'Job Id', enableHiding: false },
                    {
                        field: 'Name', displayName:
                            'Description', enableHiding: false
                    },
                    { field: 'Group', enableHiding: false },
                    {
                        field: 'SerialNumber',
                        displayName: 'Serial Number', enableHiding: false, width: 200
                    }, {
                        field: 'Status', enableHiding: false,
                        cellTemplate: '<div style="margin-top: 5px;margin-left:5px" ' +
                            ' ng-class="{ statusColor:row.entity.Status==\'Failed\'}">' +
                            '{{row.entity.Status}}  </div>'
                    }, {
                        field: 'Start Time', sort: { direction: 'desc' },
                        enableHiding: false
                    }, {
                        field: 'Edit Time',
                        displayName: 'End Time', enableHiding: false
                    }];

                /**
                 * @description
                 * Function to initialize meter data
                 *
                 * @param fromDate
                 * @param toDate
                 * @return Nil
                 
                 */
                function init(fromDate, toDate) {
                    downloadData_meter = [];
                    hypersproutMgmtService.getJobStatus(['Meter',
                        fromDate, toDate], 'ListDownloadJobs')
                        .then(function (objData) {
                            if (!angular.isUndefinedOrNull(objData) &&
                                !angular.isUndefinedOrNull
                                    (objData['Download Jobs'])
                            ) {
                                var arrayDownloadJobs = objData['Download Jobs'];
                                for (var c in arrayDownloadJobs) {
                                    if (arrayDownloadJobs.hasOwnProperty(c)) {
                                        var objToInsert = {};
                                        objToInsert["Job Id"] = arrayDownloadJobs[c].JobID;
                                        objToInsert["Name"] = arrayDownloadJobs[c].JobType;
                                        objToInsert["SerialNumber"] = arrayDownloadJobs[c]
                                            .SerialNumber;
                                        objToInsert["Status"] = arrayDownloadJobs[c].Status;
                                        objToInsert["Group"] = arrayDownloadJobs[c].Group;
                                        objToInsert["Start Time"] =
                                            angular.isUndefinedOrNull(
                                                arrayDownloadJobs[c].CreatedDateTimestamp
                                            ) ? '' : moment
                                                .tz(
                                                    arrayDownloadJobs[c]
                                                        .CreatedDateTimestamp, userTimeZone)
                                                .format('YYYY-MM-DD HH:mm:ss');
                                        objToInsert["Edit Time"] = angular
                                            .isUndefinedOrNull(
                                                arrayDownloadJobs[c].EndTime) ? '' : moment
                                                    .tz(
                                                        arrayDownloadJobs[c].EndTime,
                                                        userTimeZone
                                                    ).format('YYYY-MM-DD HH:mm:ss');
                                        objToInsert["No of endpoints"] = 1;
                                        downloadData_meter.push(objToInsert);
                                    }
                                }
                            }
                            $scope.downloadOptions_meter.data = downloadData_meter;
                        });
                }

                $scope.dynamicPopover = {
                    templateUrl: '/templates/downloadSettings_meter.html',
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
                 * Function to filter config data
                 *
                 * @param Nil
                 * @return Nil
                 
                 */
                $scope.downloadFilterConfig = function () {
                    initializeDateForMeterDownload(true);
                    $scope.dynamicPopover.isOpen = false;
                };

                $controller('dateCommonCtrl', { $scope: $scope });

                /**
                 * @description
                 * Function to download meter configuration by
                 * opening a pop-up
                 *
                 * @param size
                 * @return Nil
                 
                 */
                $scope.openDownloadConfiguration_meter = function (size) {
                    modalInstance = $uibModal.open({
                        templateUrl: '/templates/downloadConfiguration_meter.html',
                        controller: 'downloadConfiguration_meterCtrl',
                        size: size,
                        backdrop: 'static',
                        keyboard: true
                    });
                    $scope.dynamicPopover.isOpen = false;
                    modalInstance.result.then(function () {
                        initializeDateForMeterDownload(false);
                    }, function () {
                        initializeDateForMeterDownload(false);
                    });
                };

                /**
                 * @description
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
                 * Event handler invoked while controller is destroyed
                 * to close all the pop-up if any open
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