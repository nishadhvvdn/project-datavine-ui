/**
 * @description
 * Controller for registration of transformer
 */
(function (angular) {
    "use strict";
    angular.module('dataVINEApp').controller('transformerRegistrationCtrl',
        ['$scope', '$uibModal', '$state', '$rootScope',
            '$timeout', '$filter', 'DeviceService', 'ParseService',
            'refreshservice', 'commonService', '$sessionStorage','$templateCache',
            function ($scope, $uibModal, $state,
                $rootScope, $timeout, $filter, deviceService,
                parseService, refreshservice, commonService, $sessionStorage,$templateCache) {
                    let currentDefaultTablePageSize = objCacheDetails.grid.paginationPageSize;
                    var vm = this;
                    var transfomerData = [];
                    var configurationData;
                    var modalInstance = null;
                    $scope.isSelected = false;
                    $scope.mySelectedRows = [];
                    $scope.downloadOptions = {};
                    $scope.searchTerm = '';
    
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
                    $scope.downloadOptions.data = [];
                    $scope.downloadOptions = angular.copy(objCacheDetails.grid);
                    $scope.downloadOptions.exporterPdfOrientation = 'landscape',
                    $scope.downloadOptions.exporterPdfMaxGridWidth = 640;
                    $scope.downloadOptions.exporterCsvFilename = 'file.csv';
                    $scope.downloadOptions.exporterMenuCsv = true;
                    angular.element(document.querySelector("div.ui-grid-selection-row-header-buttons")).removeClass("ui-grid-all-selected");
                    $scope.downloadOptions.columnDefs = [
                        { field: 'transformerSl', displayName: 'Transformer SerialNumber', enableHiding: false,  sortingAlgorithm: commonService.getSortByString, width: 180},
                        { field: 'TFMRName', displayName: 'Transformer Name', enableHiding: false,  sortingAlgorithm: commonService.getSortByString, width: 120},
                        { field: 'kvaRating', displayName: 'KVA Rating', enableHiding: false,  sortingAlgorithm: commonService.getSortByString },
                        { field: 'type', displayName: 'Type', enableHiding: false, visible: false },
                        { field: 'hypSl', displayName: 'HS Serial Number', enableHiding: false,  sortingAlgorithm: commonService.getSortByString, width: 180},
                        { field: 'HypersproutMake', displayName: 'HS Name', enableHiding: false,  sortingAlgorithm: commonService.getSortByString},
                        { field: 'HypersproutVersion', displayName: 'HS Version', type: 'number', enableHiding: false,  sortingAlgorithm: commonService.getSortByString},
                        { field: 'latitude', displayName: 'Latitude', enableHiding: false , sortingAlgorithm: commonService.getSortByNumber },
                        { field: 'longitude', displayName: 'Longitude', enableHiding: false,  sortingAlgorithm: commonService.getSortByNumber},
                        { field: 'ctRatio', displayName: 'CT ratio', type: 'number', enableHiding: false, visible: false },
                        { field: 'ptRatio', displayName: 'PT Ratio', type: 'number', enableHiding: false, visible: false },
                        { field: 'ratedVoltage', displayName: 'Rated Voltage', enableHiding: false, visible: false },
                        { field: 'maxDemand', displayName: 'Max Demand', type: 'number', enableHiding: false, visible: false },
                        { field: 'frequency', displayName: 'Frequency', type: 'number', enableHiding: false, visible: false },
                        { field: 'complaintStandard', displayName: 'Compliant of Standard.', enableHiding: false, visible: false },
                        { field: 'gprs', displayName: 'GPRS', enableHiding: false, visible: false },
                        { field: 'wifiMacId', displayName: 'Wifi Mac ID', enableHiding: false, visible: false },
                        { field: 'wifiIpAdd', displayName: 'Wifi IP', enableHiding: false, visible: false },
                        { field: 'wifiAccessPwd', displayName: 'WIfi Access Point Password', enableHiding: false, visible: false },
                        { field: 'simCard', displayName: 'SIM Card Number', enableHiding: false, visible: false },
                        { field: 'sensorRating', displayName: 'Sensor Details', type: 'number', enableHiding: false, visible: false },
                        { field: 'MaxOilTemp', displayName: 'MaxOilTemp', type: 'number', enableHiding: false, visible: false },
                        { field: 'MinOilTemp', displayName: 'MinOilTemp', type: 'number', enableHiding: false, visible: false },
                        { field: 'CameraConnect', enableHiding: false, visible: false },
                        { field: 'StreetlightsMetered', enableHiding: false, visible: false },
                        { field: 'Make', displayName: 'Make', enableHiding: false, visible: false },
                        { field: 'HighLineVoltage', displayName: 'High Line Voltage', enableHiding: false, visible: false },
                        { field: 'LowLineVoltage', displayName: 'Low Line Voltage', enableHiding: false, visible: false },
                        { field: 'HighLineCurrent', displayName: 'High Line Current', enableHiding: false, visible: false },
                        { field: 'LowLineCurrent', displayName: 'Low Line Current', enableHiding: false, visible: false },
                        { field: 'Accuracy', displayName: 'Accuracy', enableHiding: false, visible: false },
                        { field: 'WireSize', displayName: 'Wire Size', enableHiding: false, visible: false },
                        { field: 'phases', displayName: 'Number of Phases', enableHiding: false, visible: false },
                        { field: 'MaxDemandSlidingWindowInterval', displayName: 'Max. Demand Sliding Window Interval ', enableHiding: false, visible: false },
                        { field: 'HSDemandResetDate', displayName: 'Demand Reset Day', enableHiding: false, visible: false },
                        { field: 'StreetlightUsage', displayName: 'Street Light Usage Per Day(Kw)', enableHiding: false, visible: false },
                        { field: 'NoOfConnectedStreetlights', displayName: 'No of Connected Street Lights', enableHiding: false, visible: false },
                        { field: 'ConnectedStreetlights', displayName: 'Connected Street Lights', enableHiding: false, visible: false },
                        { field: 'StreetLightStartTime', displayName: 'Street Light Start Hour', enableHiding: false, visible: false },
                        { field: 'StreetLightEndTime', displayName: 'Street Light End Hour', enableHiding: false, visible: false },
                        { field: 'Status', displayName: 'Status', enableHiding: false, visible: false },
                    {
                        field: 'Actions',
                        cellTemplate: '<div class="ui-grid-cell-contents"><button type="button" class="btn btn-xs btn-primary cellBtn" ng-click="grid.appScope.vm.viewTransformerEntry(row)" title="View">  <i class="fa fa-eye"></i></button> | <button type="button" class="btn btn-xs btn-primary cellBtn" ng-click="grid.appScope.editTransformer(row)" title="Edit"> <i class="fa fa-pencil-square-o" aria-hidden="true"></i></button> | <button class="btn btn-xs btn-primary cellBtn imgactionBtn" ng-click="grid.appScope.vm.technicalLoss(row)" title="Technical Loss"> <img alt="#" src="../assets/images/technical-loss-icon.png" /></button> | <button class="btn btn-xs btn-primary cellBtn imgactionBtn" ng-click="grid.appScope.vm.configuration(row)" title="Device Configuration"> <img alt="#" src="../assets/images/config.png" /></button> | <button class="btn btn-xs btn-primary cellBtn" ng-click="grid.appScope.vm.deleteTransformer(row)" title="Delete"> <i class="fa fa-trash-o" aria-hidden="true"></i></button> </div>',
                        enableColumnMenu: false, enableSorting: false, enableHiding: false, width: 175
                    }
                    ]
                    $scope.downloadOptions.exporterSuppressColumns = ['Actions'];
                    $scope.downloadOptions.onRegisterApi = function (gridApi) {
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
                    // API Call for Drop down list while updating the transformer record
                    deviceService.fetchPhaseData()
                    .then(function (apiData) {
                        objCacheDetails.fetchedCoils = apiData.data;
                    }); 
                    // Coil Changes ------------------------------
                    $templateCache.put('ui-grid/pagination', commonService.getModifiedTable());
                }
                $scope.initializeTransformerTable($scope.pagination.apiCurrentPage, currentDefaultTablePageSize);
                  /**
                 * Function to initialize transformer details
                 */
                function initTransformerDetails(pageNum, limit) {
                    transfomerData = [];
                    configurationData = [];
                    deviceService.getAllTransformers($scope.searchTerm, pageNum, limit)
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
                                    objToInsert["Coils"] = (apiData[i].Hypersprout_DeviceDetails.Coils ? apiData[i].Hypersprout_DeviceDetails.Coils : []);     // setting value to api params                                
                                    transfomerData.push(objToInsert);
                                }
                                $scope.downloadOptions.data = transfomerData;
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
                 * @description
                 * Opens a modal for viewing transformer
                 *
                 * @param row
                 * @return Nil
                 
                 */
                var testArray = [];
                var checkflag ;
                vm.viewTransformerEntry = function (row) {
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
                    modalInstance = $uibModal.open({
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
                    modalInstance.result.then(function () {
                        $scope.mySelectedRows.length = 0;
                        $scope.initializeTransformerTable($scope.pagination.apiCurrentPage, currentDefaultTablePageSize);
                    }, function (callApi) {                        
                        if(callApi) {
                            $scope.mySelectedRows.length = 0;
                            $scope.initializeTransformerTable($scope.pagination.apiCurrentPage, currentDefaultTablePageSize);
                        }                        
                    });
                };

                /**
                 *  @description
                 * Delete control for deleting a transformer
                 *
                 * @param row
                 * @return Nil
                 
                 */
                vm.deleteTransformer = function (row) {
                    swal({
                        title: "Delete Transformer",
                        text: "Deleting the Transformer will remove connection between the devices. Are you sure you want to remove ?",
                        showCancelButton: true,
                        confirmButtonColor: 'black',
                        confirmButtonText: 'Delete',
                        cancelButtonText: "Cancel",
                        cancelButtonColor: 'white',
                    }, function (isConfirm) {
                        if (isConfirm) {
                            var selectedTransformers = [row.entity.TransformerID];
                            var selectedHypersprouts = [row.entity.HypersproutID];
                            deviceService
                                .deleteTransformers(selectedTransformers, selectedHypersprouts)
                                .then(function (objData) {
                                    swal(objData);
                                    $scope.mySelectedRows.length = 0;
                                    $scope.initializeTransformerTable($scope.pagination.apiCurrentPage, currentDefaultTablePageSize);
                                });
                        }
                    });
                };

                vm.technicalLoss = function (row) {
                    objCacheDetails.data.selectedTransformerForTechnicalLoss = row.entity;
                    $sessionStorage.put('selectedTransformerForTechnicalLoss', row.entity);
                    $state.go('system.technicalLossEntry');
                };
                /**
                 *  @description
                 * Delete control for deleting selected multiple transformers
                 *
                 * @param Nil
                 * @return Nil
                 
                 */
                $scope.deleteSelectedTransformers = function () {
                    swal({
                        title: "Delete Transformer",
                        text: "Deleting the Transformer will remove connection between the devices. Are you sure you want to remove ?",
                        showCancelButton: true,
                        confirmButtonColor: 'black',
                        confirmButtonText: 'Delete',
                        cancelButtonText: "Cancel",
                        cancelButtonColor: 'white',
                    }, function (isConfirm) {
                        if (isConfirm) {
                            var selectedTransformers = [];
                            var selectedHypersprouts = [];
                            for (var i = 0; i < $scope.mySelectedRows.length; i++) {
                                selectedTransformers.push($scope.mySelectedRows[i].TransformerID);
                                selectedHypersprouts.push($scope.mySelectedRows[i].HypersproutID);
                            }
                            deviceService
                                .deleteTransformers(selectedTransformers, selectedHypersprouts)
                                .then(function (objData) {
                                    swal(objData);
                                    $scope.mySelectedRows.length = 0;
                                    $scope.initializeTransformerTable($scope.pagination.apiCurrentPage, currentDefaultTablePageSize);
                                });
                        }
                    });
                };

                /**
                 * @description
                 * Open a modal for editing transformer information
                 *
                 * @param row
                 * @return Nil
                 * 
                
                 */
                var testArray1 = [];
                var checkflag1 ;
                var testlength ;
                var viewtestlength ;
                $scope.editTransformer = function (row) {
                    objCacheDetails.data.ID = null;
                    objCacheDetails.data.ID = row.entity.TransformerID;
                    objCacheDetails.data.selectedData = row.entity;
                    objCacheDetails.Coils = row.entity.Coils; // Fetching Coils from table row
                    testArray1.push(objCacheDetails.data.ID);
                     testlength = testArray1.length;
                     viewtestlength = testArray.length;
                    if(testArray1.length > 1){
                    for(var i= 0; i< testArray1.length-1; i++){
                        if(objCacheDetails.data.ID == testArray1[i]){
                            checkflag1 = true;
                             break;
                        }else{
                            checkflag1 = false;
                        }
                    }
                }else{
                    checkflag1 = false;
                }
                    modalInstance = $uibModal.open({
                        templateUrl: 'templates/createTransformer.html',
                        controller: 'newXfmerConfigurationCtrl',
                        size: 'lg',
                        backdrop: 'static',
                        keyboard: true,
                        resolve: {
                            message: function () {
                                return {
                                    message: checkflag1, testlength,viewtestlength
                                };
                            }
                        }
                    });
                    modalInstance.result.then(function () {
                        $scope.mySelectedRows.length = 0;
                        console.log('a');
                        $scope.mySelectedRows.length = 0;
                        $scope.initializeTransformerTable($scope.pagination.apiCurrentPage, currentDefaultTablePageSize);
                    }, function (callApi) {                        
                        if(callApi){
                            $scope.mySelectedRows.length = 0;
                            $scope.initializeTransformerTable($scope.pagination.apiCurrentPage, currentDefaultTablePageSize);
                        }                        
                    });
                };

                /**
                 * @description
                 * Opens a modal for creation of new transformer
                 *
                 * @param row
                 * @return Nil
                 
                 */
                $scope.createTransformer = function () {
                    objCacheDetails.data.configurationData = configurationData;
                    modalInstance = $uibModal.open({
                        templateUrl: 'templates/createTransformer.html',
                        controller: 'newXfmerConfigurationCtrl',
                        size: 'lg',
                        backdrop: 'static',
                        keyboard: true,
                        resolve: {
                            message: function () {
                                return {
                                    message: checkflag1, testlength
                                };
                            }
                        }
                    });
                    modalInstance.result.then(function () {
                        $scope.mySelectedRows.length = 0;
                        $scope.initializeTransformerTable($scope.pagination.apiCurrentPage, currentDefaultTablePageSize);
                    }, function (callApi) {                       
                        if(callApi){
                            $scope.mySelectedRows.length = 0;
                            $scope.initializeTransformerTable($scope.pagination.apiCurrentPage, currentDefaultTablePageSize);
                        }
                    });
                };
                $scope.uploadHypersproutConfiguration = function (size) {
                    modalInstance = $uibModal.open({
                        templateUrl: '/templates/openUploadConfiguration.html',
                        controller: 'uploadCtrl',
                        size: size,
                        backdrop: 'static',
                        keyboard: true,
                        resolve: {
                            uploadParam: function () {
                                return {
                                    type: 'transformerConfig',
                                    endPoint: 'ConfigUploadHyperSprout'
                                };
                            }
                        }
                    });
                    modalInstance.result.then(function () {
                        $scope.mySelectedRows.length = 0;
                        $scope.initializeTransformerTable($scope.pagination.apiCurrentPage, currentDefaultTablePageSize);
                    }, function (callApi) {                       
                        if(callApi){
                            $scope.mySelectedRows.length = 0;
                            $scope.initializeTransformerTable($scope.pagination.apiCurrentPage, currentDefaultTablePageSize);
                        }
                    });
                };
                /**
                 * @description
                 * TBD
                 *
                 * @param size
                 * @return Nil
                 
                 */
                $scope.openXfmerUploadConfiguration = function (size) {
                    modalInstance = $uibModal.open({
                        templateUrl: '/templates/openUploadConfiguration.html',
                        controller: 'uploadCtrl',
                        size: size,
                        backdrop: 'static',
                        keyboard: true,
                        resolve: {
                            uploadParam: function () {
                                return {
                                    type: 'transformer',
                                    endPoint: 'NewTransformerHypersproutEntry'
                                };
                            }
                        }
                    });
                    modalInstance.result.then(function () {
                        $scope.mySelectedRows.length = 0;
                        $scope.initializeTransformerTable($scope.pagination.apiCurrentPage, currentDefaultTablePageSize);
                    }, function (callApi) {                       
                        if(callApi){
                            $scope.mySelectedRows.length = 0;
                            $scope.initializeTransformerTable($scope.pagination.apiCurrentPage, currentDefaultTablePageSize);
                        }
                    });
                };

                $scope.status = {
                    isopen: false
                };
                $scope.searchTransformerEntry = 'all';
                    /**
                     * Function to clear the  deltalink entry search
                     */
                    $scope.searchButtonClear =  function (searchTerm) {
                        if(searchTerm == ""){
                            $scope.searchTerm = '';
                            $scope.initializeTransformerTable($scope.pagination.currentTablePage, $scope.pagination.currentTablePaginationSize);
                        }
                    }
                /**
                 * @description
                 * Apply filter on the UI grid data
                 *
                 * @param searchTerm
                 * @return Nil
                 
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

                $scope.$on('$destroy', function () {
                });

                /**
                 *  @description
                 * Clear search textbox
                 *
                 * @param Nil
                 * @return Nil
                 
                 */
                $scope.clearText = function () {
                    $scope.searchterm = null;
                };
                /**
                 * @description
                 * Device Configuration
                 *
                 * @param row
                 * @return Nil
                 */
                vm.configuration = function (row) {
                    $sessionStorage.put('selectedDeviceIdConfig', row.entity.HypersproutID);
                    $sessionStorage.put('selectedSerialNumberConfig', row.entity.transformerSl);
                    $sessionStorage.put('selectedDeviceStatusConfig', row.entity.Status);
                    $state.go('system.hypersproutconfig');
                };
            }]);
})(window.angular);