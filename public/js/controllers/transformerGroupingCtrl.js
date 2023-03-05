/**
 * Controller for showing UI grid table data for transformer groupings
 */
(function (angular) {
    "use strict";
    angular.module('dataVINEApp').controller('transformerGroupingCtrl',
        ['$scope', '$uibModal', '$state', '$rootScope',
            '$filter', '$timeout', 'DeviceService', 'ParseService',
            'DeviceMappingService', 'commonService','$sessionStorage','$templateCache',
            function ($scope, $uibModal, $state, $rootScope,
                $filter, $timeout, deviceService, parseService,
                deviceMappingService, commonService,$sessionStorage,$templateCache) {
                let currentDefaultTablePageSize = objCacheDetails.grid.paginationPageSize;
                var vm = this;
                var transfomerData;
                $scope.mySelectedRows = [];
                $scope.isSelected = false;
                $scope.isCollapsed = false;
                $scope.searchTerm = '';
                $scope.transformerGroupingOptions = {};

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
                 /**
                 * Function to display Transformer details in UI Grid
                 */
                $scope.initializeTransformerTable = function (pageNum) {
                    $scope.transformerGroupingOptions.data = [];
                    $scope.transformerGroupingOptions = angular.copy(objCacheDetails.grid);
                    $scope.transformerGroupingOptions.exporterPdfOrientation = 'landscape',
                    $scope.transformerGroupingOptions.exporterPdfMaxGridWidth = 640;
                    $scope.transformerGroupingOptions.exporterCsvFilename = 'file.csv';
                    $scope.transformerGroupingOptions.exporterMenuCsv = true;
                    angular.element(document.querySelector("div.ui-grid-selection-row-header-buttons")).removeClass("ui-grid-all-selected");
                    $scope.transformerGroupingOptions.columnDefs = [
                        { field: 'transformerSl', displayName: 'Transformer Serial Number', enableHiding: false, width: 180 },
                    { field: 'kvaRating', displayName: 'KVA Rating', type: 'number', enableHiding: false },
                    { field: 'hypSl', displayName: 'HS Serial Number', enableHiding: false, width: 180 },
                    { field: 'HypersproutMake', displayName: 'HS Name', enableHiding: false, visible: true },
                    { field: 'HypersproutVersion', displayName: 'Hardware Version', type: 'number', enableHiding: false },
                    { field: 'noOfMeters', displayName: 'No. of Meters', type: 'number', enableHiding: false },
                    { field: 'latitude', displayName: 'Latitude', enableHiding: false },
                    { field: 'longitude', displayName: 'Longitude', enableHiding: false },
                    { field: 'type', displayName: 'Type', enableHiding: false, visible: false },
                    { field: 'hvlv', displayName: 'HV/LV', enableHiding: false, visible: false },
                    { field: 'ctRatio', displayName: 'CT ratio', type: 'number', enableHiding: false, visible: false },
                    { field: 'ptRatio', displayName: 'PT Ratio', type: 'number', enableHiding: false, visible: false },
                    { field: 'ratedVoltage', displayName: 'Rated Voltage', type: 'number', enableHiding: false, visible: false },
                    { field: 'phases', displayName: 'Phases', type: 'number', enableHiding: false, visible: false },
                    { field: 'maxDemand', displayName: 'Max Demand', type: 'number', enableHiding: false, visible: false },
                    { field: 'frequency', displayName: 'Frequency', type: 'number', enableHiding: false, visible: false },
                    { field: 'measurementClass', displayName: 'Measurement Class', enableHiding: false, visible: false },
                    { field: 'complaintStandard', displayName: 'Compliant of Standard.', enableHiding: false, visible: false },
                    { field: 'gprs', displayName: 'GPRS', enableHiding: false, visible: false },
                    { field: 'wifiMacId', displayName: 'Wifi Mac ID', enableHiding: false, visible: false },
                    { field: 'wifiIpAdd', displayName: 'Wifi IP', enableHiding: false, visible: false },
                    { field: 'wifiAccessPwd', displayName: 'WIfi Access Point Password', enableHiding: false, visible: false },
                    { field: 'simCard', displayName: 'SIM Card Number', enableHiding: false, visible: false },
                    { field: 'sensorRating', displayName: 'Sensor Min/Max Rating', enableHiding: false, visible: false },
                    {
                        field: 'Actions',
                        cellTemplate: '<div class="ui-grid-cell-contents"><button type="button" class="btn btn-xs btn-primary cellBtn" ng-click="grid.appScope.vm.viewTransformerInfo(row)" title="View"><i class="fa fa-eye"></i></button> &nbsp |&nbsp <button class="btn btn-xs btn-primary cellBtn" ng-click="grid.appScope.vm.mapHyperHub(row)" title="Group HyperHUB\u2122"> <img height="12px" width="15px" src="/assets/images/transformer.png"></button>&nbsp &nbsp <button class="btn btn-xs btn-primary cellBtn" ng-click="grid.appScope.vm.mapMeterInfo(row)" title="Group Meter"> <img height="12px" width="15px" src="/assets/images/hyperHub.png"></img></button>&nbsp |&nbsp <button class="btn btn-xs btn-primary cellBtn" ng-click="grid.appScope.vm.removeTransformer(row)" title="Ungroup Transformer"><i class="fa fa-times" aria-hidden="true"></i></button></div>',
                        enableColumnMenu: false, enableHiding: false, width: 170
                    }
                    ]
                    $scope.transformerGroupingOptions.exporterSuppressColumns = ['Actions'];
                    $scope.transformerGroupingOptions.onRegisterApi = function (gridApi) {
                        $scope.gridApi = gridApi;
                        commonService.getGridApi($scope, gridApi);
                        gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {
                            $scope.pagination.currentTablePaginationSize = pageSize;
                            $scope.pagination.totalTablePages = Math.ceil($scope.pagination.currentTotalItems / pageSize);
                            pageNum = 1;
                            $scope.pagination.currentTablePage = 1;
                            initTransformerDetails(pageNum, $scope.pagination.currentTablePaginationSize);
                        });
                    };
                    initTransformerDetails(pageNum, $scope.pagination.currentTablePaginationSize);
                    $templateCache.put('ui-grid/pagination', commonService.getModifiedTable());
                }
                $scope.initializeTransformerTable($scope.pagination.apiCurrentPage, currentDefaultTablePageSize);
                  /**
                 * Function to initialize transformer details
                 */
                function initTransformerDetails(pageNum, limit) {
                    transfomerData = [];
                    if (!$sessionStorage.get('selectedCircuit')) {
                        $state.go('system.grouping.circuitGrouping');
                    } else{
                    deviceService.getGroupedTransformers($scope.searchTransformerGrouping,$scope.searchTerm, pageNum, limit,$sessionStorage.get('selectedCircuit'))
                        .then(function (apiData) {
                            if (!angular.isUndefinedOrNull(apiData) && apiData.type) {
                                transfomerData.length = 0;
                                $scope.pagination.currentTotalItems = apiData.hypersproutAndTransformerDetails.results.length;
                                $scope.pagination.apiCurrentPage = pageNum;
                                $scope.pagination.totalRecordsInDBCount = apiData.hypersproutAndTransformerDetails.totalRecords;
                                $scope.pagination.totalTablePages = Math.ceil($scope.pagination.totalRecordsInDBCount / $scope.pagination.currentTablePaginationSize);

                                let btnFlags = commonService.getBtnStatus($scope.pagination.currentTablePage, $scope.pagination.totalTablePages);
                                $scope.disableNxtBtn = btnFlags.disableNxtBtn;
                                $scope.disablePrvBtn = btnFlags.disablePrvBtn;
                                $scope.disableFirstBtn = btnFlags.disableFirstBtn;
                                $scope.disableLastBtn = btnFlags.disableLastBtn;

                                apiData = apiData.hypersproutAndTransformerDetails.results;
                                $scope.commonMsg = "";
                                for (let i = 0; i < apiData.length; i++) {
                                    let objToInsert = {};
                                    objToInsert["transformerSl"] = apiData[i].TransformerSerialNumber;
                                    objToInsert["TFMRName"] = apiData[i].TFMRName;
                                    objToInsert["kvaRating"] = apiData[i].RatingCapacity;
                                    objToInsert["type"] = apiData[i].Type;
                                    objToInsert["hypSl"] = apiData[i].HypersproutSerialNumber;
                                    objToInsert["HypersproutMake"] = apiData[i].Hypersprout_DeviceDetails.HypersproutMake;
                                    objToInsert["HypersproutVersion"] = apiData[i].Hypersprout_DeviceDetails.HypersproutVersion;
                                    objToInsert["latitude"] = apiData[i].Hypersprout_Communications.Latitude;
                                    objToInsert["longitude"] = apiData[i].Hypersprout_Communications.Longitude;
                                    objToInsert["ctRatio"] = apiData[i].Hypersprout_DeviceDetails.CT_Ratio;
                                    objToInsert["ptRatio"] = apiData[i].Hypersprout_DeviceDetails.PT_Ratio;
                                    objToInsert["ratedVoltage"] = apiData[i].Hypersprout_DeviceDetails.ratedVoltage;
                                    objToInsert["maxDemand"] = apiData[i].Hypersprout_DeviceDetails.MaxDemandWindow;
                                    objToInsert["frequency"] = apiData[i].Hypersprout_DeviceDetails.Frequency;
                                    objToInsert["complaintStandard"] = apiData[i].Hypersprout_DeviceDetails.HSCompliantToStandards;
                                    objToInsert["gprs"] = apiData[i].Hypersprout_Communications.MAC_ID_GPRS;
                                    objToInsert["wifiMacId"] = apiData[i].Hypersprout_Communications.MAC_ID_WiFi;
                                    objToInsert["wifiIpAdd"] = apiData[i].Hypersprout_Communications.IP_address_WiFi;
                                    objToInsert["wifiAccessPwd"] = apiData[i].Hypersprout_Communications.AccessPointPassword;
                                    objToInsert["simCard"] = apiData[i].Hypersprout_Communications.SimCardNumber;
                                    objToInsert["ratedVoltage"] = apiData[i].Hypersprout_DeviceDetails.RatedVoltage;
                                    objToInsert["sensorRating"] = apiData[i].Hypersprout_DeviceDetails["Sensor Details"];
                                    objToInsert["MaxOilTemp"] = apiData[i].MaxOilTemp;
                                    objToInsert["MinOilTemp"] = apiData[i].MinOilTemp;
                                    objToInsert["CameraConnect"] = apiData[i].CameraConnect;
                                    objToInsert["StreetlightsMetered"] = apiData[i].StreetlightsMetered;
                                    objToInsert["Make"] = apiData[i].Make;
                                    objToInsert["HighLineVoltage"] = apiData[i].HighLineVoltage;
                                    objToInsert["LowLineVoltage"] = apiData[i].LowLineVoltage;
                                    objToInsert["HighLineCurrent"] = apiData[i].HighLineCurrent;
                                    objToInsert["LowLineCurrent"] = apiData[i].LowLineCurrent;
                                    objToInsert["Accuracy"] = apiData[i].Hypersprout_DeviceDetails.Accuracy;
                                    objToInsert["WireSize"] = apiData[i].WireSize;
                                    objToInsert["TransformerID"] = apiData[i].TransformerID;
                                    objToInsert["HypersproutID"] = apiData[i].HypersproutID;
                                    objToInsert["phases"] = apiData[i].Hypersprout_DeviceDetails.Phase;
                                    objToInsert["MaxDemandSlidingWindowInterval"] = apiData[i].Hypersprout_DeviceDetails.MaxDemandSlidingWindowInterval;
                                    objToInsert["HSDemandResetDate"] = apiData[i].Hypersprout_DeviceDetails.HSDemandResetDate;
                                    objToInsert["StreetlightUsage"] = apiData[i].StreetlightUsage;
                                    objToInsert["NoOfConnectedStreetlights"] = apiData[i].NoOfConnectedStreetlights;
                                    objToInsert["ConnectedStreetlights"] = apiData[i].ConnectedStreetlights;
                                    objToInsert["StreetLightStartTime"] = apiData[i].StreetLightStartTime;
                                    objToInsert["StreetLightEndTime"] = apiData[i].StreetLightEndTime;
                                    objToInsert["Status"] = apiData[i].Status;
                                    objToInsert["noOfMeters"] = apiData[i].NoOfMeterAllocated;
                                    transfomerData.push(objToInsert);
                                }
                                $scope.transformerGroupingOptions.data = transfomerData;
                            } else if (apiData.type == false) {
                                $scope.disableNxtBtn = true;
                                $scope.disablePrvBtn = true;
                                $scope.disableFirstBtn = true;
                                $scope.disableLastBtn = true;
                                $scope.pagination.totalRecordsInDBCount = 0;
                                $scope.pagination.totalTablePages = 1;
                                $scope.commonMsg = "No data found!";
                            } else {
                                $scope.commonMsg = '';
                            }
                        });
                    }
                }
                $scope.nxtPageBtnClick = function () {
                    if ($scope.pagination.currentTablePage < $scope.pagination.totalTablePages && $scope.pagination.totalTablePages > 0) {
                        let nextAPIPage = ++$scope.pagination.currentTablePage;
                        $scope.disablePrvBtn = false;
                        $scope.initializeTransformerTable(nextAPIPage, $scope.pagination.currentTablePaginationSize);
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
                        $scope.initializeTransformerTable(prevAPIPage, $scope.pagination.currentTablePaginationSize);
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
                        $scope.initializeTransformerTable(firstPage, $scope.pagination.currentTablePaginationSize);
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
                        $scope.initializeTransformerTable(lastPage, $scope.pagination.currentTablePaginationSize);
                    } else {
                        {
                            $scope.disablePrvBtn = true;
                            $scope.disableNxtBtn = false;
                        }
                    }
                }

                $scope.paginationBoxChanges = function () {
                    if ($scope.pagination.currentTablePage) {
                        $scope.initializeTransformerTable($scope.pagination.currentTablePage, $scope.pagination.currentTablePaginationSize);
                    } else {
                        $scope.pagination.currentTablePage = 1;
                        $scope.initializeTransformerTable($scope.pagination.currentTablePage, $scope.pagination.currentTablePaginationSize);
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

                /**
                 * Open a modal for viewing transformer information
                 */
                var testArray = [];
                var checkflag;
                vm.viewTransformerInfo = function (row) {
                    objCacheDetails.data.ID = null;
                    objCacheDetails.data.ID = row.entity.TransformerID;
                    objCacheDetails.data.selectedData = row.entity;
                    testArray.push(objCacheDetails.data.ID);
                    //$sessionStorage.put('selectedTransformer',testArray);
                    if(testArray.length > 1){
                    for(var i= 0; i< testArray.length-1; i++){
                        if(objCacheDetails.data.ID == testArray[i]){
                             checkflag = true;
                             break;
                        }else{
                             checkflag = false;
                        }
                    }
                }else{
                    checkflag = false;
                }
                    $uibModal.open({
                        templateUrl: '/templates/viewTransformerEntry.html',
                        controller: 'viewTransformerEntryCtrl',
                        size: 'lg',
                        backdrop: 'static',
                        keyboard: true,
                        resolve: {
                            messageview: function () {
                                return {
                                    messageview: checkflag,
                                };
                            }
                        }
                    });
                };

                /**
                 * Route back to the state transformerMeterGrouping
                 */
                vm.mapMeterInfo = function (row) {
                    objCacheDetails.data.selectedTransformer = row.entity.TransformerID;
                    $sessionStorage.put('selectedTransformer',row.entity.TransformerID);
                    $state.go('system.grouping.transformerMeterGrouping');
                };

                /**
                 * Route back ti the state hyperHubGrouping
                 */
                vm.mapHyperHub = function (row) {
                    objCacheDetails.data.selectedTransformer = row.entity.TransformerID;
                    $sessionStorage.put('selectedTransformer',row.entity.TransformerID);
                    $state.go('system.grouping.hyperHubGrouping');
                };

                /**
                 * Control for deletion of a transformer entry from the UI grid
                 */
                vm.removeTransformer = function (row) {
                    var selectedTransformers = [row.entity.TransformerID];
                    swal({
                        title: "Un-Group Transformer",
                        text: "Do you really want to un-group the device?",
                        showCancelButton: true,
                        confirmButtonColor: 'black',
                        confirmButtonText: 'Un-Group',
                        cancelButtonText: "Cancel",
                        cancelButtonColor: 'white',
                    }, function (isConfirm) {
                        if (isConfirm) {
                            deviceMappingService
                                .removeTransformerFromCircuit($sessionStorage.get('selectedCircuit'), selectedTransformers)
                                .then(function (objData) {
                                    swal(objData);
                                    $scope.pagination.currentTablePage = 1;
                                    $scope.initializeTransformerTable($scope.pagination.currentTablePage, $scope.pagination.currentTablePaginationSize);
                                });
                        }
                    });
                };

                /**
                 * Route to the unassignedTransformer tab
                 */
                $scope.openTransformersList = function () {
                    $state.go('system.grouping.unassignedTransformers');
                };

                /**
                 * Control to delete set of selected transformers
                 */
                $scope.removeSelectedTransformers = function () {
                    var selectedTransformers = [];
                    for (var i = 0; i < $scope.gridApi.selection.getSelectedRows().length; i++) {
                        selectedTransformers.push($scope.gridApi.selection.getSelectedRows()[i].TransformerID);
                    }
                    
                    if (selectedTransformers.length > 0) {
                        swal({
                            title: "Un-Group Transformer",
                            text: "Do you really like to Un-Group ?",
                            showCancelButton: true,
                            confirmButtonColor: 'black',
                            confirmButtonText: 'Un-Group',
                            cancelButtonText: "Cancel",
                            cancelButtonColor: 'white',
                        }, function (isConfirm) {
                            if (isConfirm) {
                                deviceMappingService
                                    .removeTransformerFromCircuit($sessionStorage.get('selectedCircuit'), selectedTransformers)
                                    .then(function (objData) {
                                        swal(objData);
                                        $scope.pagination.currentTablePage = 1;
                                        $scope.initializeTransformerTable($scope.pagination.currentTablePage, $scope.pagination.currentTablePaginationSize);
                                    });
                            }
                        });
                    } else {
                        swal({
                            title: 'Warning',
                            text: 'Please select a transfomer to Un-Group',
                            type: "warning"
                        });
                    }
                };

                $scope.searchTransformerGrouping = 'tsn';
                     /**
                     * Function to clear the  circuit entry
                     */
                    $scope.searchButtonClear =  function (searchtermInCircuitEntry) {
                        if(searchtermInCircuitEntry == ""){
                            $scope.searchTerm = '';
                            $scope.initializeTransformerTable($scope.pagination.currentTablePage, $scope.pagination.currentTablePaginationSize);
                        }
                    }

                /**
                 * Filter data in the UI grid
                 */
                $scope.searchButton = function (searchValue) {
                    if (searchValue) {
                        $scope.searchTerm = searchValue;
                        $scope.pagination.currentTablePage = 1;
                            $scope.initializeTransformerTable($scope.pagination.currentTablePage, $scope.pagination.currentTablePaginationSize);
                    } else {
                        $scope.searchTerm = '';
                        $scope.initializeTransformerTable($scope.pagination.currentTablePage, $scope.pagination.currentTablePaginationSize);
                    }
                    angular.element(document.querySelector("div.ui-grid-selection-row-header-buttons")).removeClass("ui-grid-all-selected");
                    $scope.mySelectedRows.length = 0;
                };

                /**
                 * Dismiss the modal
                 */
                $scope.ok = function () {
                    $modalInstance.dismiss();
                };

            }]);
})(window.angular);
