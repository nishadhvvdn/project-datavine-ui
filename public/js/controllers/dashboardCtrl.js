/**
 * @description
 * Controller for handling Job status
 */

 (function (angular) {
    "use strict";
    angular.module('dataVINEApp').controller('dashboardCtrl',
        ['$scope', '$uibModal', '$state', '$rootScope', 'commonService', 'MeterMgmtService',
            '$filter', 'refreshservice', '$controller',
            'formatDate', '$sessionStorage', '$templateCache', '$timeout', 'uiGridExporterService', 'uiGridExporterConstants',  function ($scope, $uibModal,
                $state, $rootScope, commonService,
                MeterMgmtService, $filter, refreshservice,
                $controller, formatDate, $sessionStorage, $templateCache, $timeout, uiGridExporterService, uiGridExporterConstants) {

                $scope.customdata = [];

                $scope.statusOptions = {};
                $scope.hs3Data = {};
                $scope.loading = true;
                $scope.startingDate = null;
                $scope.endingDate = null;
                let tagData = [];
                let tagDatahs = [];
                let tagDatahs3 = [];
                $scope.jobsObject = [];
                $scope.Timeinterval = 1;
                let intervalhs1;
                let intervalhs2;
                let intervalhs3;
                // $scope.cellIdHS1 = 30; //FOR DEV
                // $scope.HS1MetersList = ["562", "563", "564", "565", "566", "567", "568", "569"];  //FOR DEV
                // $scope.cellIdHS2 = 28;  //FOR DEV
                // $scope.HS2MetersList = ["562", "563"];  //FOR DEV
                // $scope.cellIdHS3 = 3; // FOR DEV
                // $scope.HS3MetersList = ["10", "11"]; //FOR DEV

                $scope.cellIdHS1 = 1; //FOR QA
                $scope.HS1MetersList = ["1", "3", "6", "7"]; //FOR QA
                $scope.cellIdHS2 = 4; // FOR QA"'
                $scope.HS2MetersList = ["8", "9", "18", "19"]; //FOR QA
                $scope.cellIdHS3 = 3; // FOR QA
                $scope.HS3MetersList = ["10", "11"]; //FOR QA
                

                // $scope.cellIdHS1 = 1; //FOR Prod
                // $scope.HS1MetersList = ["2", "3", "4", "5", "6", "7","8","9", "13"]; //FOR Prod
                // $scope.cellIdHS2 = 2; // FOR Prod
                // $scope.HS2MetersList = ["1"]; //FOR Prod
                // $scope.cellIdHS3 = 3; // FOR Prod
                // $scope.HS3MetersList = ["10", "11"]; //FOR Prod
                $scope.HS1LastConnectionDetails = {};
                $scope.HS2LastConnectionDetails = {};
                $scope.HS3LastConnectionDetails = {};

                $scope.HS1Status = "";
                $scope.HS2Status = "";
                $scope.HS3Status = "";



                // let userTimeZone = angular.isUndefinedOrNull(objCacheDetails.userDetails) ? undefined : objCacheDetails.userDetails.timeZone;
                // if (angular.isUndefined(userTimeZone)) {
                //     refreshservice.refresh().then(function () {
                //         userTimeZone = objCacheDetails.userDetails.timeZone;
                //     });
                // }

                /**
                 * Function to return true if two meters have same value continuesly FOR HS-1
                 */
                $scope.parseMeterDataHS1 = function (data, row, id) {
                    var customPageID = (($scope.statusOptions.paginationCurrentPage - 1) * $scope.statusOptions.paginationPageSize) + id;
                    if($scope.statusOptions.data[customPageID] && $scope.statusOptions.data[customPageID + 1] &&
                        ($scope.statusOptions.data[customPageID][row] === $scope.statusOptions.data[customPageID + 1][row])){
                        return true;
                    } else {
                        return false;
                    }
                };

                /**
                 * Function to return true if two meters have same value continuesly for HS-2
                 */
                $scope.parseMeterDataHS2 = function (data, row, id) {
                    var customPageID = (($scope.hsData.paginationCurrentPage - 1) * $scope.hsData.paginationPageSize) + id;
                    if($scope.hsData.data[customPageID] && $scope.hsData.data[customPageID + 1] &&
                        ($scope.hsData.data[customPageID][row] === $scope.hsData.data[customPageID + 1][row])){
                        return true;
                    } else {
                        return false;
                    }
                };

                /**
                 * Function to return true if two meters have same value continuesly for HS-3
                 */
                $scope.parseMeterDataHS3 = function (data, row, id) {
                    var customPageID = (($scope.hs3Data.paginationCurrentPage - 1) * $scope.hs3Data.paginationPageSize) + id;
                    if($scope.hs3Data.data[customPageID] && $scope.hs3Data.data[customPageID + 1] &&
                        ($scope.hs3Data.data[customPageID][row] === $scope.hs3Data.data[customPageID + 1][row])){
                        return true;
                    } else {
                        return false;
                    }
                };

                /**
                 * Function to return true if two Transformers have same value continuesly for HS-1
                 */
                $scope.parseTransformerDataHS1 = function (data, id) {
                    var customPageID = (($scope.statusOptions.paginationCurrentPage - 1) * $scope.statusOptions.paginationPageSize) + id;
                    if($scope.statusOptions.data[customPageID] && $scope.statusOptions.data[customPageID + 1] &&
                        $scope.statusOptions.data[customPageID].ActiveReceivedCumulativeRate_Total !== 'NA' &&
                        ($scope.statusOptions.data[customPageID].ActiveReceivedCumulativeRate_Total === $scope.statusOptions.data[customPageID + 1].ActiveReceivedCumulativeRate_Total)){
                        return true;
                    } else {
                        return false;
                    }
                };

                 /**
                 * Function to return true if two Transformers have same value continuesly for HS-2
                 */
                $scope.parseTransformerDataHS2 = function (data, id) {
                    var customPageID = (($scope.hsData.paginationCurrentPage - 1) * $scope.hsData.paginationPageSize) + id;
                    if($scope.hsData.data[customPageID] && $scope.hsData.data[customPageID + 1] &&
                        $scope.hsData.data[customPageID].ActiveReceivedCumulativeRate_Total !== 'NA' &&
                        ($scope.hsData.data[customPageID].ActiveReceivedCumulativeRate_Total === $scope.hsData.data[customPageID + 1].ActiveReceivedCumulativeRate_Total)){
                            return true;
                    } else {
                        return false;
                    }
                };

                 /**
                 * Function to return true if two Transformers have same value continuesly for HS-3
                 */
                $scope.parseTransformerDataHS3 = function (data, id) {
                    var customPageID = (($scope.hs3Data.paginationCurrentPage - 1) * $scope.hs3Data.paginationPageSize) + id;
                    if($scope.hs3Data.data[customPageID] && $scope.hs3Data.data[customPageID + 1] &&
                        $scope.hs3Data.data[customPageID].ActiveReceivedCumulativeRate_Total !== 'NA' &&
                        ($scope.hs3Data.data[customPageID].ActiveReceivedCumulativeRate_Total === $scope.hs3Data.data[customPageID + 1].ActiveReceivedCumulativeRate_Total)){
                            return true;
                    } else {
                        return false;
                    }
                };


                $scope.initializeTable = function() {
                    $scope.statusOptions = angular.copy(objCacheDetails.grid);
                    $scope.statusOptions.data = [];
                    $scope.statusOptions.exporterPdfOrientation = 'landscape';
                    $scope.statusOptions.exporterPdfMaxGridWidth = 640;
                    $scope.statusOptions.enableRowHeaderSelection = false;
                    $scope.statusOptions.exporterMenuCsv =  true;

                    $scope.statusOptions.columnDefs = [];
                    $scope.statusOptions.columnDefs.push( { field: 'TimeStamp', displayName: 'TimeStamp(IST)', enableHiding: false,  width: 160 });
                        //$scope.statusOptions.columnDefs.push( { field: 'ActiveReceivedCumulativeRate_Total', displayName: 'TRF Reading', enableHiding: false });
                        $scope.statusOptions.columnDefs.push({
                            name: 'ActiveReceivedCumulativeRate_Total',  displayName: 'TRF Reading',
                            cellTemplate: '<div class="ui-grid-cell-contents" ng-class="{ \'color-class\': grid.appScope.parseTransformerDataHS1(row, '+
                            'grid.renderContainers.body.visibleRowCache.indexOf(row))}"> {{row.entity.ActiveReceivedCumulativeRate_Total}}</div>'
                        });
                        for(var j=0;j < $scope.HS1MetersList.length ; j++){
                            var customColumn = {
                                name: $scope.HS1MetersList[j],  displayName: 'MeterID '+$scope.HS1MetersList[j],
                                cellTemplate: '<div class="ui-grid-cell-contents" ng-class="{ \'color-class\': grid.appScope.parseMeterDataHS1(row, '+ $scope.HS1MetersList[j]+
                                ', grid.renderContainers.body.visibleRowCache.indexOf(row))}"> {{row.entity['+$scope.HS1MetersList[j]+'] == 0 ? 0 : row.entity['+$scope.HS1MetersList[j]+'] ? row.entity['+$scope.HS1MetersList[j]+'] : "NA"}}</div>'
                            };
                            //var customColumn = { field:  $scope.HS1MetersList[j], displayName: 'MeterID '+[$scope.HS1MetersList[j]], enableHiding: false };
                            $scope.statusOptions.columnDefs.push(customColumn);
                        }

                    $scope.statusOptions.exporterSuppressColumns = ['Download'];
                    $scope.statusOptions.onRegisterApi = function (gridApi) {
                        //$scope.gridApi = gridApi;
                        commonService.getGridApi($scope, gridApi);
                    };

                }
                $scope.initializeSecondTable = function() {
                    $scope.hsData = angular.copy(objCacheDetails.grid);
                    $scope.hsData.data = [];
                    $scope.hsData.exporterPdfOrientation = 'landscape';
                    $scope.hsData.exporterPdfMaxGridWidth = 640;
                    $scope.hsData.enableRowHeaderSelection = false;
                    $scope.hsData.exporterMenuCsv =  true;

                    $scope.hsData.columnDefs = [];
                    $scope.hsData.columnDefs.push( { field: 'TimeStamp', displayName: 'TimeStamp(IST)', enableHiding: false });
                        //$scope.hsData.columnDefs.push( { field: 'ActiveReceivedCumulativeRate_Total', displayName: 'TRF Reading', enableHiding: false });
                        $scope.hsData.columnDefs.push({
                            name: 'ActiveReceivedCumulativeRate_Total',  displayName: 'TRF Reading',
                            cellTemplate: '<div class="ui-grid-cell-contents" ng-class="{ \'color-class\': grid.appScope.parseTransformerDataHS2(row, '+
                            'grid.renderContainers.body.visibleRowCache.indexOf(row))}"> {{row.entity.ActiveReceivedCumulativeRate_Total}}</div>'
                        });
                        for(var j=0;j < $scope.HS2MetersList.length ; j++){
                            //var customColumn = { field:  $scope.HS2MetersList[j], displayName: 'MeterID '+[$scope.HS2MetersList[j]], enableHiding: false };
                            var customColumn = {
                                name: $scope.HS2MetersList[j],  displayName: 'MeterID '+$scope.HS2MetersList[j],
                                cellTemplate: '<div class="ui-grid-cell-contents" ng-class="{ \'color-class\': grid.appScope.parseMeterDataHS2(row, '+$scope.HS2MetersList[j]+
                                ', grid.renderContainers.body.visibleRowCache.indexOf(row)) }"> {{row.entity['+$scope.HS2MetersList[j]+'] == 0 ? 0 : row.entity['+$scope.HS2MetersList[j]+'] ? row.entity['+$scope.HS2MetersList[j]+'] : "NA"}}</div>'
                            };
                            $scope.hsData.columnDefs.push(customColumn);
                        }

                    $scope.hsData.exporterSuppressColumns = ['Download'];
                    $scope.hsData.onRegisterApi = function (gridApi) {
                       // $scope.gridApi = gridApi;
                        commonService.getGridApi($scope, gridApi);
                    };

                }
                $scope.initializeThirdTable = function() {
                    $scope.hs3Data = angular.copy(objCacheDetails.grid);
                    $scope.hs3Data.data = [];
                    $scope.hs3Data.exporterPdfOrientation = 'landscape';
                    $scope.hs3Data.exporterPdfMaxGridWidth = 640;
                    $scope.hs3Data.enableRowHeaderSelection = false;
                    $scope.hs3Data.exporterMenuCsv =  true;

                    $scope.hs3Data.columnDefs = [];
                    $scope.hs3Data.columnDefs.push( { field: 'TimeStamp', displayName: 'TimeStamp(IST)', enableHiding: false });
                       $scope.hs3Data.columnDefs.push({
                            name: 'ActiveReceivedCumulativeRate_Total',  displayName: 'TRF Reading',
                            cellTemplate: '<div class="ui-grid-cell-contents" ng-class="{ \'color-class\': grid.appScope.parseTransformerDataHS3(row, '+
                            'grid.renderContainers.body.visibleRowCache.indexOf(row))}"> {{row.entity.ActiveReceivedCumulativeRate_Total}}</div>'
                        });
                        for(var j=0;j < $scope.HS3MetersList.length ; j++){
                            var customColumn = {
                                name: $scope.HS3MetersList[j],  displayName: 'MeterID '+$scope.HS3MetersList[j],
                                cellTemplate: '<div class="ui-grid-cell-contents" ng-class="{ \'color-class\': grid.appScope.parseMeterDataHS3(row, '+$scope.HS3MetersList[j]+
                                ', grid.renderContainers.body.visibleRowCache.indexOf(row)) }"> {{row.entity['+$scope.HS3MetersList[j]+'] == 0 ? 0 : row.entity['+$scope.HS3MetersList[j]+'] ? row.entity['+$scope.HS3MetersList[j]+'] : "NA"}}</div>'
                            };
                            $scope.hs3Data.columnDefs.push(customColumn);
                        }

                    $scope.hs3Data.exporterSuppressColumns = ['Download'];
                    $scope.hs3Data.onRegisterApi = function (gridApi) {
                        //$scope.gridApi = gridApi;
                        commonService.getGridApi($scope, gridApi);
                    };

                }
                initHS1();
                initHS2();
             //   initHS3();
                $scope.initializeTable();
                $scope.initializeSecondTable();
                $scope.initializeThirdTable();

                /**
                 *  @description
                 * Function to initialize the job status data
                 *
                 * @return Nil

                 */
                function initHS1() {
                    clearInterval(intervalhs1);
                    statusHS1();
                    MeterMgmtService.getDashboardData(
                        $scope.Timeinterval,  $scope.cellIdHS1)
                        .then(function (objData) {
                            if (!angular.isUndefinedOrNull(objData) && !angular.isUndefinedOrNull(objData.message) && !angular.isUndefinedOrNull(objData.message.length > 0) && objData.type) {
                              tagData.length = 0;
                                    let arrayData = objData.message;

                                    //if(objData.type === true){

                                        for(var l=0; l < arrayData.length; l++) {
                                            if(l === 0){
                                                $scope.HS1LastConnectionDetails.DBTimestamp = angular
                                                    .isUndefinedOrNull(arrayData[l].DBTimestamp) ? '' : moment
                                                        .tz(arrayData[l].DBTimestamp,
                                                            "Asia/Kolkata"
                                                        ).format('YYYY-MM-DD HH:mm:ss');
                                                if(arrayData[l].result && arrayData[l].result.meters) {
                                                    $scope.HS1LastConnectionDetails.connectedMeterCount = arrayData[l].result.meters.length;
                                                }
                                            }

                                            var objToInsert = {};
                                            if(arrayData[l].result && arrayData[l].result.meters && arrayData[l].result.meters.length > 0) {
                                                for(var k=0; k < arrayData[l].result.meters.length ; k++) {
                                                if($scope.HS1MetersList.includes((arrayData[l].result.meters[k].DeviceID).toString()) ) {
                                                    if(arrayData[l].result.meters[k].ActiveReceivedCumulativeRate_Total) {
                                                        objToInsert[arrayData[l].result.meters[k].DeviceID] = arrayData[l].result.meters[k].ActiveReceivedCumulativeRate_Total
                                                    } else {
                                                        objToInsert[arrayData[l].result.meters[k].DeviceID] = arrayData[l].result.meters[k].ActiveReceivedCumulativeRate_Total === 0 ? arrayData[l].result.meters[k].ActiveReceivedCumulativeRate_Total : 'NA';
                                                    }

                                                    }
                                                }
                                            }

                                            objToInsert["TimeStamp"] = angular
                                            .isUndefinedOrNull(arrayData[l].DBTimestamp) ? '' : moment
                                                    .tz(arrayData[l].DBTimestamp,
                                                        "Asia/Kolkata"
                                                    ).format('YYYY-MM-DD HH:mm:ss');

                                            if(arrayData[l].result && arrayData[l].result.Transformer) {
                                                if(arrayData[l].result.Transformer.ActiveReceivedCumulativeRate_Total) {
                                                    objToInsert["ActiveReceivedCumulativeRate_Total"] = arrayData[l].result.Transformer.ActiveReceivedCumulativeRate_Total;
                                                } else {
                                                    objToInsert["ActiveReceivedCumulativeRate_Total"] = arrayData[l].result.Transformer.ActiveReceivedCumulativeRate_Total === 0 ? arrayData[l].result.Transformer.ActiveReceivedCumulativeRate_Total : 'NA';
                                                }
                                            }
                                            tagData.push(objToInsert);
                                        }
                                        $scope.statusOptions.data = tagData;
                                    // } else {
                                    //     $rootScope.commonMsg = 'No data found!';
                                    // }
                            }  else if(objData.type === false) {
                                $scope.commonMsg = "No data found!";
                            }
                        });
                        intervalhs1 = setInterval(initHS1, 120000);
                    }
                    /**
                 *  @description
                 * Function to initialize the job status data
                 *
                 * @return Nil

                 */
                function initHS2() {
                    clearInterval(intervalhs2);
                    statusHS2();
                    MeterMgmtService.getDashboardData(
                         $scope.Timeinterval,  $scope.cellIdHS2)
                        .then(function (objData) {
                            if (!angular.isUndefinedOrNull(objData) &&
                                !angular.isUndefinedOrNull(objData.message) && !angular.isUndefinedOrNull(objData.message.length > 0) && objData.type) {
                                tagDatahs.length = 0;
                                let hs2arrayData = objData.message;
                                    for(var l=0; l < hs2arrayData.length; l++) {
                                        if(l === 0){
                                            $scope.HS2LastConnectionDetails.DBTimestamp = angular
                                                .isUndefinedOrNull(hs2arrayData[l].DBTimestamp) ? '' : moment
                                                    .tz(hs2arrayData[l].DBTimestamp,
                                                        "Asia/Kolkata"
                                                    ).format('YYYY-MM-DD HH:mm:ss');
                                            if(hs2arrayData[l].result && hs2arrayData[l].result.meters) {
                                                $scope.HS2LastConnectionDetails.connectedMeterCount = hs2arrayData[l].result.meters.length;
                                            }
                                        }
                                        var objToInserths2 = {};
                                        if(hs2arrayData[l].result && hs2arrayData[l].result.meters && hs2arrayData[l].result.meters.length > 0) {
                                            for(var k=0; k < hs2arrayData[l].result.meters.length ; k++) {
                                                if($scope.HS2MetersList.includes((hs2arrayData[l].result.meters[k].DeviceID).toString()) ) {
                                                    if(hs2arrayData[l].result.meters[k].ActiveReceivedCumulativeRate_Total) {
                                                        objToInserths2[hs2arrayData[l].result.meters[k].DeviceID] = hs2arrayData[l].result.meters[k].ActiveReceivedCumulativeRate_Total
                                                    } else {
                                                        objToInserths2[hs2arrayData[l].result.meters[k].DeviceID] =  hs2arrayData[l].result.meters[k].ActiveReceivedCumulativeRate_Total === 0 ? hs2arrayData[l].result.meters[k].ActiveReceivedCumulativeRate_Total : 'NA';
                                                    }

                                                }
                                            }
                                        }

                                        objToInserths2["TimeStamp"] = angular
                                        .isUndefinedOrNull(hs2arrayData[l].DBTimestamp) ? '' : moment
                                                .tz(hs2arrayData[l].DBTimestamp,
                                                    "Asia/Kolkata"
                                                ).format('YYYY-MM-DD HH:mm:ss');

                                        if(hs2arrayData[l].result && hs2arrayData[l].result.Transformer) {
                                            if(hs2arrayData[l].result.Transformer.ActiveReceivedCumulativeRate_Total) {
                                                objToInserths2["ActiveReceivedCumulativeRate_Total"] = hs2arrayData[l].result.Transformer.ActiveReceivedCumulativeRate_Total;
                                            } else {
                                                objToInserths2["ActiveReceivedCumulativeRate_Total"] = hs2arrayData[l].result.Transformer.ActiveReceivedCumulativeRate_Total === 0 ? hs2arrayData[l].result.Transformer.ActiveReceivedCumulativeRate_Total : 'NA';
                                            }
                                        }
                                        tagDatahs.push(objToInserths2);
                                    }

                                    $scope.commonMsghs = '';
                                } else {
                                    $scope.commonMsghs = "No data found!";
                                }
                            $scope.hsData.data = tagDatahs;
                        });
                        intervalhs2 = setInterval(initHS2, 120000);
                    }

                 /**
                 *  @description
                 * Function to initialize the job status data
                 *
                 * @return Nil

                 */
                function initHS3() {
                    clearInterval(intervalhs3);
                    statusHS3();
                    MeterMgmtService.getDashboardData(
                         $scope.Timeinterval,  $scope.cellIdHS3)
                        .then(function (objData) {
                            if (!angular.isUndefinedOrNull(objData) &&
                                !angular.isUndefinedOrNull(objData.message) && !angular.isUndefinedOrNull(objData.message.length > 0) && objData.type) {
                                tagDatahs3.length = 0;
                                let hs3arrayData = objData.message;
                                    for(var l=0; l < hs3arrayData.length; l++) {
                                        if(l === 0){
                                            $scope.HS3LastConnectionDetails.DBTimestamp = angular
                                                .isUndefinedOrNull(hs3arrayData[l].DBTimestamp) ? '' : moment
                                                    .tz(hs3arrayData[l].DBTimestamp,
                                                        "Asia/Kolkata"
                                                    ).format('YYYY-MM-DD HH:mm:ss');
                                            if(hs3arrayData[l].result && hs3arrayData[l].result.meters) {
                                                $scope.HS3LastConnectionDetails.connectedMeterCount = hs3arrayData[l].result.meters.length;
                                            }
                                        }
                                        var objToInserths3 = {};
                                        if(hs3arrayData[l].result && hs3arrayData[l].result.meters && hs3arrayData[l].result.meters.length > 0) {
                                            for(var k=0; k < hs3arrayData[l].result.meters.length ; k++) {
                                                if($scope.HS3MetersList.includes((hs3arrayData[l].result.meters[k].DeviceID).toString()) ) {
                                                    if(hs3arrayData[l].result.meters[k].ActiveReceivedCumulativeRate_Total) {
                                                        objToInserths3[hs3arrayData[l].result.meters[k].DeviceID] = hs3arrayData[l].result.meters[k].ActiveReceivedCumulativeRate_Total
                                                    } else {
                                                        objToInserths3[hs3arrayData[l].result.meters[k].DeviceID] =  hs3arrayData[l].result.meters[k].ActiveReceivedCumulativeRate_Total === 0 ? hs3arrayData[l].result.meters[k].ActiveReceivedCumulativeRate_Total : 'NA';
                                                    }

                                                }
                                            }
                                        }

                                        objToInserths3["TimeStamp"] = angular
                                        .isUndefinedOrNull(hs3arrayData[l].DBTimestamp) ? '' : moment
                                                .tz(hs3arrayData[l].DBTimestamp,
                                                    "Asia/Kolkata"
                                                ).format('YYYY-MM-DD HH:mm:ss');

                                        if(hs3arrayData[l].result && hs3arrayData[l].result.Transformer) {
                                            if(hs3arrayData[l].result.Transformer.ActiveReceivedCumulativeRate_Total) {
                                                objToInserths3["ActiveReceivedCumulativeRate_Total"] = hs3arrayData[l].result.Transformer.ActiveReceivedCumulativeRate_Total;
                                            } else {
                                                objToInserths3["ActiveReceivedCumulativeRate_Total"] = hs3arrayData[l].result.Transformer.ActiveReceivedCumulativeRate_Total === 0 ? hs3arrayData[l].result.Transformer.ActiveReceivedCumulativeRate_Total : 'NA';
                                            }
                                        }
                                        tagDatahs3.push(objToInserths3);
                                    }

                                    $scope.commonMsghs = '';
                                } else {
                                    $scope.commonMsghs = "No data found!";
                                }
                            $scope.hs3Data.data = tagDatahs3;
                        });
                        intervalhs3 = setInterval(initHS3, 120000);
                    }


                function statusHS1(){
                    MeterMgmtService.getLiveconnection($scope.cellIdHS1)
                    .then(function (objData) {
                        if(objData && objData.message){
                            $scope.HS1Status = commonService.addTrademark(objData.message);
                        }
                    });
                }


                function statusHS2(){
                    MeterMgmtService.getLiveconnection($scope.cellIdHS2)
                    .then(function (objData) {
                        if(objData.message){
                            $scope.HS2Status = commonService.addTrademark(objData.message);
                        }
                    });
                }

                //FOR HS-3
                function statusHS3(){
                    MeterMgmtService.getLiveconnection($scope.cellIdHS3)
                    .then(function (objData) {
                        if(objData.message){
                            $scope.HS3Status = commonService.addTrademark(objData.message);
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
                $scope.refreshHS1 = function () {
                    initHS1();
                    initHS2();
                   // initHS3();
                };

                $controller('dateCommonCtrl', { $scope: $scope });
                $scope.$on('$destroy', function () {
                    clearInterval(intervalhs1);
                    clearInterval(intervalhs2);
                    clearInterval(intervalhs3);
                });
            }])

})(window.angular);