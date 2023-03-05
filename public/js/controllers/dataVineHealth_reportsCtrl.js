/**
 * Controller for Health Reports
 * @description
 */
(function (angular) {
    "use strict";
    angular.module('dataVINEApp')
        .controller('dataVineHealth_reportsCtrl',
            ['$scope', 'reportsService', '$timeout', '$filter',
                function ($scope, reportsService, $timeout, $filter) {
                    $scope.isCollapsed = false;
                    $scope.boolEdit = true;
                    var arrData = [];
                    init();
                    $scope.dynamicPopover = {
                        templateUrl: '/templates/DataVINEHealthSettings.html',
                        content: '',
                        open: function () {
                            $scope.dynamicPopover.isOpen = true;
                        },
                        close: function () {
                            $scope.dynamicPopover.isOpen = false;
                        }
                    };

                    /** 
                     * Function to initialize health data
                     */
                    function init() {
                        arrData = [];
                        var type = "HyperSprout";
                        reportsService.datavineHealth(type).then(function (objData) {
                            if (!angular.isUndefinedOrNull(objData.Details)) {
                                for (var i in objData.Details) {
                                    if (objData.Details.hasOwnProperty(i)) {
                                        var objDataToInsert = objData.Details[i];
                                        var objToInsert = {};
                                        objToInsert["SerialNumber"] = objDataToInsert.SerialNumber;
                                        objToInsert["Health Status"] = objDataToInsert.HealthStatus;
                                        objToInsert["Current Month’s Avg Throughput"] = objDataToInsert.CurrentMonthAvgThroughput;
                                        objToInsert["Last Year’s Avg Throughput"] = objDataToInsert.LastYearAvgThroughput;
                                        objToInsert["Current Month’s Contact Success Rate"] = objDataToInsert.CurrentMonthContactSuccessRate;
                                        objToInsert["Last Year’s Avg Contact Success Rate"] = objDataToInsert.LastYearAvgContactSuccessRate;
                                        arrData.push(objToInsert);
                                    }
                                }
                                $scope.dataVINEHealthOptions.data = arrData;
                            }
                        });
                    }

                    $scope.list = [{
                        isSelected: true,
                        name: "All"
                    }, {
                        isSelected: true,
                        name: "Error"
                    }, {
                        isSelected: true,
                        name: "Ok"
                    }, {
                        isSelected: true,
                        name: "Unknown"
                    }, {
                        isSelected: true,
                        name: "Warning"
                    }];
                    $scope.dataVINEHealthOptions = angular.copy(objCacheDetails.grid);
                    $scope.dataVINEHealthOptions.data = [];
                    $scope.dataVINEHealthOptions.exporterPdfOrientation = 'landscape',
                    $scope.dataVINEHealthOptions.exporterPdfMaxGridWidth = 640;
                    $scope.dataVINEHealthOptions.columnDefs = [
                        { field: 'SerialNumber', enableHiding: false , width: 180},
                        { field: 'Health Status', enableHiding: false },
                        { field: 'Current Month’s Avg Throughput', displayName: 'Current Month’s Avg Throughput', enableHiding: false },
                        { field: 'Last Year’s Avg Throughput', displayName: 'Last Year’s Avg Throughput', enableHiding: false },
                        { field: 'Current Month’s Contact Success Rate', displayName: 'Current Month’s Contact Success Rate', enableHiding: false },
                        { field: 'Last Year’s Avg Contact Success Rate', displayName: 'Last Year’s Avg Contact Success Rate', enableHiding: false },
                    ];
                    $scope.object = {};

                    /**
                     * @description
                     * Function to tag filter configuration
                     *
                     * @param nil
                     * @return Nil
                
                     */
                    $scope.tagFilterConfig = function () {
                        $scope.dataVINEHealthOptions.data =
                            $filter('dvhealthAllFilter')(arrData, $scope.list);
                        $scope.dynamicPopover.isOpen = false;
                    };

                    /**
                     *  @description
                      * Function to search endpoints
                     *
                     * @param endPoints
                     * @return Nil
                    
                     */
                    $scope.searchEndPoints = function (endPoints) {
                        $scope.dataVINEHealthOptions.data =
                            $filter('endPointSearchFilter')(arrData, endPoints);
                        $scope.endPoints = endPoints;
                    };

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
                     *  @description
                     * Function to select all values
                     *
                     * @param bool
                     * @param type
                     * @return Nil
                     
                     */
                    $scope.selectAll = function (bool, type) {
                        if (type === 'All') {
                            if (bool) {
                                for (var i = 0; i < $scope.list.length; i++) {
                                    $scope.list[i].isSelected = true;
                                }
                            } else {
                                for (var k = 0; k < $scope.list.length; k++) {
                                    $scope.list[k].isSelected = false;
                                }
                            }
                        } else {
                            var check = true;
                            for (var j = 1; j < $scope.list.length; j++) {
                                if (!$scope.list[j].isSelected) {
                                    check = false;
                                    break;
                                }
                            }
                            $scope.list[0].isSelected = check ? true : false;
                        }
                    };
                }]);
})(window.angular);