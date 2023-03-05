/**
 * @description
 * Controller for handling Discrepancies
 */
(function (angular) {
    "use strict";
    angular.module('dataVINEApp').controller('discrepanciesCtrl',
        ['$scope', '$timeout', 'hypersproutMgmtService', '$filter',
            'refreshservice', '$controller', 'endpoint', 'formatDate',
            function ($scope, $timeout, hypersproutConfigService,
                $filter, refreshservice, $controller, endpoint, formatDate) {
                $scope.tagOptions = {};
                $scope.startingDate = null;
                $scope.endingDate = null;
                $scope.invalidDate = false;
                $scope.invalidTime = false;
                var tagData = [];
                $scope.object = {};
                $scope.object.correctedState = 'all';
                var userTimeZone = angular
                    .isUndefinedOrNull(objCacheDetails.userDetails) ? undefined : objCacheDetails
                        .userDetails.timeZone;
                if (angular.isUndefined(userTimeZone)) {
                    refreshservice.refresh().then(function () {
                        userTimeZone = objCacheDetails.userDetails.timeZone;
                        initTagDate(false);
                    });
                } else {
                    initTagDate(false);
                }

                /**
                 *  @description
                 * Function to initialize tag data based on date
                 *
                 * @param flag
                 * @return Nil
                 
                 */
                function initTagDate(flag) {
                    if (!flag) {
                        $scope.startingDate = new Date(moment
                            .tz(userTimeZone).format('YYYY-MM-DD HH:mm'));
                        $scope.endingDate = new Date(moment.tz(userTimeZone)
                            .format('YYYY-MM-DD HH:mm'));
                        formatDate.getFormatedDate($scope, 'jobstatus',
                            function (fDate, tDate, tZone) {
                                userTimeZone = tZone;
                                init(fDate, tDate, flag);
                            });
                    } else {
                        init(moment
                            .utc($scope.startingDate)
                            .format('YYYY-MM-DDTHH:mm:ss.SSS') + 'Z',
                            moment
                                .utc($scope.endingDate)
                                .format('YYYY-MM-DDTHH:mm:ss.SSS') + 'Z', flag);
                    }
                }
                $scope.tagOptions = angular.copy(objCacheDetails.grid);
                $scope.tagOptions.data = [];
                $scope.tagOptions.exporterPdfOrientation = 'landscape',
                    $scope.tagOptions.exporterPdfMaxGridWidth = 600;
                $scope.tagOptions.columnDefs = [
                    {
                        field: 'Serial Number', width: '30%',
                        enableHiding: false, type: 'number'
                    },
                    { field: 'Configuration Tag', width: '25%', enableHiding: false },
                    { field: 'Discrepent Tag', width: '25%', enableHiding: false },
                    { field: 'First Found Time', width: '10%', enableHiding: false },
                    { field: 'Corrected Time', width: '10%', enableHiding: false }
                ];

                function init(fromDate, toDate, flag) {
                    hypersproutConfigService
                        .getTagDiscrepencies(endpoint, fromDate, toDate)
                        .then(function (objData) {
                            tagData = [];
                            if (!angular.isUndefinedOrNull(objData) &&
                                !angular
                                    .isUndefinedOrNull(objData.TagDiscrepanciesSelected)) {
                                for (var i = 0; i < objData.TagDiscrepanciesSelected.length; i++) {
                                    var objTagDiscrepency =
                                        objData.TagDiscrepanciesSelected[i];
                                    objTagDiscrepency.FirstFoundTime =
                                        moment
                                            .tz(objTagDiscrepency.FirstFoundTime,
                                                userTimeZone)
                                            .format('YYYY-MM-DD HH:mm');
                                    if (!angular.isUndefinedOrNull(objTagDiscrepency.CorrectTime)) {
                                        objTagDiscrepency.CorrectTime =
                                            moment
                                                .tz(objTagDiscrepency.CorrectTime,
                                                    userTimeZone)
                                                .format('YYYY-MM-DD HH:mm');
                                    }
                                    var objToInsert = {};
                                    objToInsert["Serial Number"] =
                                        objTagDiscrepency.SerialNumber;
                                    objToInsert["Configuration Tag"] =
                                        objTagDiscrepency.ConfigurationTab;
                                    objToInsert["Device Class"] =
                                        objTagDiscrepency.TagDiscrepanciesDevice;
                                    objToInsert["Discrepent Tag"] =
                                        objTagDiscrepency.DiscrepantTag;
                                    objToInsert["First Found Time"] =
                                        objTagDiscrepency.FirstFoundTime;
                                    objToInsert["Corrected Time"] =
                                        objTagDiscrepency.CorrectTime;
                                    objToInsert["IsCorrected"] =
                                        objTagDiscrepency.IsCorrected;
                                    tagData.push(objToInsert);
                                }
                            }
                            $scope.tagOptions.data = tagData;
                            if (flag)
                                filterTag(tagData);
                        });
                }

                /**
                 * @description
                 * Function to filter tag data
                 *
                 * @param tagOptionsTimeData
                 * @return Nil
                 
                 */
                function filterTag(tagOptionsTimeData) {
                    $scope.invalidSelection = true;
                    if ($scope.object.correctedState === "correctedOnly" ||
                        $scope.object.correctedState === "discrepentOnly" ||
                        $scope.object.correctedState === "all") {
                        $scope.invalidSelection = false;
                        if ($scope.object.correctedState === "correctedOnly") {
                            $scope.tagOptions.data =
                                $filter('tagFilter')(tagOptionsTimeData,
                                    $scope.object.correctedState, 'correctedOnly');
                        } else if ($scope.object.correctedState === "discrepentOnly") {
                            $scope.tagOptions.data =
                                $filter('tagFilter')(tagOptionsTimeData,
                                    $scope.object.correctedState, 'discrepentOnly');
                        } else if ($scope.object.correctedState === "all") {
                            $scope.tagOptions.data = tagOptionsTimeData;
                        }
                    }
                    if ($scope.invalidSelection) {
                        $scope.dynamicPopover.isOpen = true;
                    } else {
                        $scope.dynamicPopover.isOpen = false;
                        $scope.invalidSelection = false;
                    }
                }

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

                $scope.dynamicPopover = {
                    templateUrl: '/templates/tagSettings.html',
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
                 * Function to validate selection
                 *
                 * @param event
                 * @return Nil
                
                 */
                $scope.tags = function () {
                    if ($scope.object.correctedState === "correctedOnly" ||
                        $scope.object.correctedState === "discrepentOnly" ||
                        $scope.object.correctedState === "all") {
                        $scope.invalidSelection = false;
                    } else {
                        $scope.invalidSelection = true;
                    }
                };

                /**
                 * @description
                 * Function to filter tag config
                 *
                 * @param Nil
                 * @return Nil
                 
                 */
                $scope.tagFilterConfig = function () {
                    initTagDate(true);
                };
                $controller('dateCommonCtrl', { $scope: $scope });

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
            }]);
})(window.angular);