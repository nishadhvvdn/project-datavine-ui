/**
 * @description
 * Controller for UI grid table of unassigned transformers
 */
(function (angular) {
    "use strict";
    angular.module('dataVINEApp').controller('unassignedTransformerListCtrl',
        ['$scope', '$uibModal', '$state', '$rootScope',
            '$filter', '$timeout', 'DeviceService', 'ParseService',
            'DeviceMappingService', '$sessionStorage','$templateCache','commonService',
            function ($scope, $uibModal, $state, $rootScope,
                $filter, $timeout, deviceService, parseService,
                deviceMappingService, $sessionStorage,$templateCache,commonService) {
                    let currentDefaultTablePageSize = objCacheDetails.grid.paginationPageSize;
                    var vm = this;
                    var transfomerData;
                    $scope.mySelectedRows = [];
                    $scope.isSelected = false;
                    $scope.isCollapsed = false;
                    $scope.searchTerm = '';
                    $scope.unassignedTransformerGrid = {};
                    $scope.searchUnassignedTransformers = 'tsn'

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
                    $scope.unassignedTransformerGrid.data = [];
                    $scope.unassignedTransformerGrid = angular.copy(objCacheDetails.grid);
                    $scope.unassignedTransformerGrid.exporterPdfOrientation = 'landscape',
                    $scope.unassignedTransformerGrid.exporterPdfMaxGridWidth = 640;
                    $scope.unassignedTransformerGrid.exporterCsvFilename = 'file.csv';
                    $scope.unassignedTransformerGrid.exporterMenuCsv = true;
                    angular.element(document.querySelector("div.ui-grid-selection-row-header-buttons")).removeClass("ui-grid-all-selected");
                    $scope.unassignedTransformerGrid.columnDefs = [
                    { field: 'transformerSl', displayName: 'Transformer Serial Number', enableHiding: false, width: 180 },
                    { field: 'kvaRating', displayName: 'KVA Rating', type: 'number', enableHiding: false },
                    { field: 'hypSl', displayName: 'HS Serial Number', enableHiding: false, width: 180 },
                    { field: 'HypersproutMake', displayName: 'HS Name', enableHiding: false , width: 180},
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
                        cellTemplate: '<div class="ui-grid-cell-contents-info">&nbsp; &nbsp<button type="button" class="btn btn-xs btn-primary cellBtn" ng-click="grid.appScope.vm.viewTransformerInfo(row)" title="View"><i class="fa fa-eye"></i></button></div>',
                        enableColumnMenu: false, enableHiding: false, width: 150
                    }
                    ]
                    $scope.unassignedTransformerGrid.exporterSuppressColumns = ['Actions'];
                    $scope.unassignedTransformerGrid.onRegisterApi = function (gridApi) {
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
                        deviceService.getUnassignedTransformers($scope.searchUnassignedTransformers,$scope.searchTerm, pageNum, limit,$sessionStorage.get('selectedCircuit'))
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
                                $scope.datagridMessage = "";
                                for (let i = 0; i < apiData.length; i++) {
                                    let objToInsert = {};
                                    objToInsert["transformerSl"] = apiData[i].TransformerSerialNumber;
                                    objToInsert["TFMRName"] = apiData[i].TFMRName;
                                    objToInsert["kvaRating"] = apiData[i].RatingCapacity;
                                    objToInsert["type"] = apiData[i].Type;
                                    objToInsert["hypSl"] = apiData[i].HypersproutSerialNumber ? apiData[i].HypersproutSerialNumber : 'NA';
                                    objToInsert["HypersproutMake"] = apiData[i].Hypersprout_DeviceDetails ? apiData[i].Hypersprout_DeviceDetails.HypersproutMake : 'NA';
                                    objToInsert["HypersproutVersion"] = apiData[i].Hypersprout_DeviceDetails ? apiData[i].Hypersprout_DeviceDetails.HypersproutVersion : 'NA';
                                    objToInsert["latitude"] = apiData[i].Hypersprout_Communications ? apiData[i].Hypersprout_Communications.Latitude : 'NA';
                                    objToInsert["longitude"] = apiData[i].Hypersprout_Communications ? apiData[i].Hypersprout_Communications.Longitude : 'NA';
                                    objToInsert["ctRatio"] = apiData[i].Hypersprout_DeviceDetails ? apiData[i].Hypersprout_DeviceDetails.CT_Ratio : 'NA';
                                    objToInsert["ptRatio"] = apiData[i].Hypersprout_DeviceDetails ? apiData[i].Hypersprout_DeviceDetails.PT_Ratio : 'NA';
                                    objToInsert["ratedVoltage"] = apiData[i].Hypersprout_DeviceDetails ? apiData[i].Hypersprout_DeviceDetails.ratedVoltage : 'NA';
                                    objToInsert["maxDemand"] = apiData[i].Hypersprout_DeviceDetails ? apiData[i].Hypersprout_DeviceDetails.MaxDemandWindow : 'NA';
                                    objToInsert["frequency"] = apiData[i].Hypersprout_DeviceDetails ? apiData[i].Hypersprout_DeviceDetails.Frequency : 'NA';
                                    objToInsert["complaintStandard"] = apiData[i].Hypersprout_DeviceDetails ? apiData[i].Hypersprout_DeviceDetails.HSCompliantToStandards : 'NA';
                                    objToInsert["gprs"] = apiData[i].Hypersprout_Communications ? apiData[i].Hypersprout_Communications.MAC_ID_GPRS : 'NA';
                                    objToInsert["wifiMacId"] = apiData[i].Hypersprout_Communications ? apiData[i].Hypersprout_Communications.MAC_ID_WiFi : 'NA';
                                    objToInsert["wifiIpAdd"] = apiData[i].Hypersprout_Communications ? apiData[i].Hypersprout_Communications.IP_address_WiFi : 'NA';
                                    objToInsert["wifiAccessPwd"] = apiData[i].Hypersprout_Communications ? apiData[i].Hypersprout_Communications.AccessPointPassword : 'NA';
                                    objToInsert["simCard"] = apiData[i].Hypersprout_Communications ? apiData[i].Hypersprout_Communications.SimCardNumber : 'NA';
                                    objToInsert["ratedVoltage"] = apiData[i].Hypersprout_DeviceDetails ? apiData[i].Hypersprout_DeviceDetails.RatedVoltage : 'NA';
                                    objToInsert["sensorRating"] = apiData[i].Hypersprout_DeviceDetails ? apiData[i].Hypersprout_DeviceDetails["Sensor Details"] : 'NA';
                                    objToInsert["MaxOilTemp"] = apiData[i].MaxOilTemp;
                                    objToInsert["MinOilTemp"] = apiData[i].MinOilTemp;
                                    objToInsert["CameraConnect"] = apiData[i].CameraConnect;
                                    objToInsert["StreetlightsMetered"] = apiData[i].StreetlightsMetered;
                                    objToInsert["Make"] = apiData[i].Make;
                                    objToInsert["HighLineVoltage"] = apiData[i].HighLineVoltage;
                                    objToInsert["LowLineVoltage"] = apiData[i].LowLineVoltage;
                                    objToInsert["HighLineCurrent"] = apiData[i].HighLineCurrent;
                                    objToInsert["LowLineCurrent"] = apiData[i].LowLineCurrent;
                                    objToInsert["Accuracy"] = apiData[i].Hypersprout_DeviceDetails ? apiData[i].Hypersprout_DeviceDetails.Accuracy : '';
                                    objToInsert["WireSize"] = apiData[i].WireSize;
                                    objToInsert["TransformerID"] = apiData[i].TransformerID;
                                    objToInsert["HypersproutID"] = apiData[i].HypersproutID;
                                    objToInsert["phases"] = apiData[i].Hypersprout_DeviceDetails ? apiData[i].Hypersprout_DeviceDetails.Phase : '';
                                    objToInsert["MaxDemandSlidingWindowInterval"] = apiData[i].Hypersprout_DeviceDetails ? apiData[i].Hypersprout_DeviceDetails.MaxDemandSlidingWindowInterval : '';
                                    objToInsert["HSDemandResetDate"] = apiData[i].Hypersprout_DeviceDetails ? apiData[i].Hypersprout_DeviceDetails.HSDemandResetDate : '';
                                    objToInsert["StreetlightUsage"] = apiData[i].StreetlightUsage;
                                    objToInsert["NoOfConnectedStreetlights"] = apiData[i].NoOfConnectedStreetlights;
                                    objToInsert["ConnectedStreetlights"] = apiData[i].ConnectedStreetlights;
                                    objToInsert["StreetLightStartTime"] = apiData[i].StreetLightStartTime;
                                    objToInsert["StreetLightEndTime"] = apiData[i].StreetLightEndTime;
                                    objToInsert["Status"] = apiData[i].Status;
                                    objToInsert["noOfMeters"] = apiData[i].NoOfMeterAllocated;
                                    transfomerData.push(objToInsert);
                                }
                                $scope.unassignedTransformerGrid.data = transfomerData;
                            } else if (apiData.type == false) {
                                $scope.disableNxtBtn = true;
                                $scope.disablePrvBtn = true;
                                $scope.disableFirstBtn = true;
                                $scope.disableLastBtn = true;
                                $scope.pagination.totalRecordsInDBCount = 0;
                                $scope.pagination.totalTablePages = 1;
                                $scope.datagridMessage = "No data found!";
                            } else {
                                $scope.datagridMessage = '';
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
                 *  @description
                 * Open a modal to view the transformer information
                 *
                 * @param row
                 * @return Nil
                 
                 */
                var testArray = [];
                var checkflag;
                vm.viewTransformerInfo = function (row) {
                    objCacheDetails.data.ID = null;
                    objCacheDetails.data.ID = row.entity.TransformerID;
                    objCacheDetails.data.selectedData = row.entity;
                    $sessionStorage.put('selectedTransformer', row.entity);
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
                 *  @description
                 * Change the route to transformer grouping
                 *
                 * @param Nil
                 * @return Nil
                 
                 */
                $scope.goToUnassignedTransformers = function () {
                    $state.go('system.grouping.transformerGrouping');
                };

                /**
                 * @description
                 * Adds transformer to a circuit
                 *
                 * @param Nil
                 * @return Nil
                 
                 */
                $scope.assignTransformersToCircuit = function () {
                    var selectedTransformers = [];
                    for (var i = 0; i < $scope.gridApi.selection.getSelectedRows().length; i++) {
                        selectedTransformers.push($scope.gridApi.selection.getSelectedRows()[i].TransformerID);
                    }
                    if (selectedTransformers.length > 0) {
                        swal({
                            title: "Group Transformer",
                            text: "Do you really want to group Transformer to this DTC ?",
                            showCancelButton: true,
                            confirmButtonColor: 'black',
                            confirmButtonText: 'Group',
                            cancelButtonText: "Cancel",
                            cancelButtonColor: 'white',
                        }, function (isConfirm) {
                            if (isConfirm) {
                                deviceMappingService
                                    .addTransformerToCircuit($sessionStorage.get('selectedCircuit'), selectedTransformers)
                                    .then(function (objData) {
                                        swal(objData);
                                        angular.element(document.querySelector("div.ui-grid-selection-row-header-buttons")).removeClass("ui-grid-all-selected");
                                        $scope.pagination.currentTablePage = 1;
                                        $scope.initializeTransformerTable($scope.pagination.currentTablePage, $scope.pagination.currentTablePaginationSize);
                                    });
                            }
                        })
                    } else {
                        swal({
                            title: 'Warning',
                            text: 'Please select a transformer to map',
                            type: "warning"
                        });
                    }
                };

                /**
                 *  @description
                 * Dismiss the modal
                 *
                 * @param Nil
                 * @return Nil
                 
                 */
                $scope.ok = function () {
                    $modalInstance.dismiss();
                };

            }]);
})(window.angular);