/**
 * @description
 * Controller for UI grid table of unassigned meters
 */
(function (angular) {
    "use strict";
    angular.module('dataVINEApp').controller('unassignedMeterListCtrl',
        ['$scope', '$uibModal', '$state', '$rootScope',
            '$filter', '$timeout', 'DeviceService', 'ParseService',
            'DeviceMappingService', '$sessionStorage','$templateCache','commonService',
            function ($scope, $uibModal, $state, $rootScope,
                $filter, $timeout, deviceService, parseService,
                deviceMappingService, $sessionStorage,$templateCache,commonService) {
                    let currentDefaultTablePageSize = objCacheDetails.grid.paginationPageSize;
                    var modalInstance = null;
                    $scope.searchMeterGrouping = 'all';
                    var arrMeterData = [];
                    $scope.isSelected = false;
                    $scope.mySelectedRows = [];
                    var vm = this;
                    $scope.isCollapsed = false;
                    $scope.searchTerm = '';
                    $scope.meterGrid = {};

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

                    $scope.initializeMeterTable = function (pageNum) {
                        $scope.meterGrid.data = [];
                        $scope.meterGrid = angular.copy(objCacheDetails.grid);
                        $scope.meterGrid.exporterPdfOrientation = 'landscape';
                        $scope.meterGrid.exporterPdfMaxGridWidth = 640;
                        $scope.meterGrid.exporterCsvFilename = 'file.csv';
                        $scope.meterGrid.exporterMenuCsv = true;
                        angular.element(document.querySelector("div.ui-grid-selection-row-header-buttons")).removeClass("ui-grid-all-selected");
                        $scope.meterGrid.columnDefs = [
                            { field: 'meterSl', displayName: 'Meter Serial Number', type: 'number', enableHiding: false, width: 180 },
                            { field: 'meterMake', displayName: 'Make', enableHiding: false },
                            { field: 'consumerNumber', displayName: 'Consumer Number', enableHiding: false, width: 180 },
                            { field: 'phasesMeter', displayName: 'No of Phases', type: 'number', enableHiding: false },
                            { field: 'applicationType', displayName: 'Application Type', enableHiding: false, visible: false },
                            { field: 'installationLocation', displayName: 'Installation Location', enableHiding: false, visible: false },
                            { field: 'ctRatioMeter', displayName: 'CT Ratio', type: 'number', enableHiding: false, visible: false },
                            { field: 'ptRatioMeter', displayName: 'PT Ratio', type: 'number', enableHiding: false, visible: false },
                            { field: 'ratedVoltageMeter', displayName: 'Rated Voltage', type: 'number', enableHiding: false, visible: false },
                            { field: 'ratedFrequencyMeter', displayName: 'Rated Frequency', type: 'number', enableHiding: false, visible: false },
                            { field: 'nominalCurrent', displayName: 'Nominal Current', type: 'number', enableHiding: false, visible: false },
                            { field: 'maximumCurrent', displayName: 'Maximum Current', type: 'number', enableHiding: false, visible: false },
                            { field: 'complaintStandardMeter', displayName: 'Compliant of Standard', enableHiding: false, visible: false },
                            { field: 'wifiMacIdMeter', displayName: 'Wifi Mac ID', enableHiding: false, visible: false },
                            { field: 'wifiIpAddMeter', displayName: 'Wifi IP Address', enableHiding: false, visible: false },
                            { field: 'wifiAccessPwdMeter', displayName: 'Wifi Access Pt PWD', enableHiding: false, visible: false },
                            { field: 'meterAdminPwd', displayName: 'Meter Admin PWD', enableHiding: false, visible: false },
                            { field: 'latitudeMeter', displayName: 'Latitude', enableHiding: false },
                            { field: 'longitudeMeter', displayName: 'Longitude', enableHiding: false },
                            { field: 'consumerName', displayName: 'Consumer Name', enableHiding: false, visible: false },
                            { field: 'contactNumber', displayName: 'Contact Number', enableHiding: false, visible: false },
                            { field: 'consumerAddress', displayName: 'Address', enableHiding: false, visible: false },
                            { field: 'consumerCountry', displayName: 'Country', enableHiding: false, visible: false },
                            { field: 'consumerState', displayName: 'State', enableHiding: false, visible: false },
                            { field: 'consumerCity', displayName: 'City', enableHiding: false, visible: false },
                            { field: 'consumerZipcode', displayName: 'Zipcode', enableHiding: false, visible: false },
                            { field: 'billingDate', displayName: 'Billing Cycle Day', type: 'number', enableHiding: false, visible: false },
                            { field: 'billingTime', displayName: 'Billing Time', enableHiding: false, visible: false },
                            { field: 'demandResetDate', displayName: 'Demand Reset Day', type: 'number', enableHiding: false, visible: false },
                            {
                                field: 'Actions',
                                cellTemplate: '<div class="ui-grid-cell-contents"><button type="button" class="btn btn-xs btn-primary cellBtn" ng-click="grid.appScope.vm.viewMeterEntry(row)" title="View">  <i class="fa fa-eye"></i></button></div>',
                                enableColumnMenu: false,
                                enableHiding: false, width: 150
                            }
                        ];
                        $scope.meterGrid.exporterSuppressColumns = ['Actions'];
                        $scope.meterGrid.onRegisterApi = function (gridApi) {
                            $scope.gridApi = gridApi;
                            commonService.getGridApi($scope, gridApi);
                            gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {
                                $scope.pagination.currentTablePaginationSize = pageSize;
                                $scope.pagination.totalTablePages = Math.ceil($scope.pagination.currentTotalItems / pageSize);
                                pageNum = 1;
                                $scope.pagination.currentTablePage = 1;
                                initMeterDetails(pageNum, $scope.pagination.currentTablePaginationSize);
                            });
                        };
                        initMeterDetails(pageNum, $scope.pagination.currentTablePaginationSize);
                        $templateCache.put('ui-grid/pagination', commonService.getModifiedTable());
                    }

                    $scope.initializeMeterTable($scope.pagination.apiCurrentPage, currentDefaultTablePageSize);
                    /**
                 * Function to initialize meter details
                 */
                function initMeterDetails(pageNum, limit) {
                    arrMeterData = [];
                    if (!$sessionStorage.get('selectedCircuit') || !$sessionStorage.get('selectedTransformer')) {
                        $state.go('system.grouping.circuitGrouping');
                    }else{
                    deviceService.getUnassignedMeters('All',$scope.searchMeterGrouping,$scope.searchTerm,pageNum,limit)
                        .then(function (apiData) {
                            if (!angular.isUndefinedOrNull(apiData) && apiData.type) {
                                arrMeterData.length = 0;
                                $scope.pagination.currentTotalItems = apiData.details.results.length;
                                $scope.pagination.apiCurrentPage = pageNum;
                                $scope.pagination.totalRecordsInDBCount = apiData.details.totalRecords;
                                $scope.pagination.totalTablePages = Math.ceil($scope.pagination.totalRecordsInDBCount / $scope.pagination.currentTablePaginationSize);

                                let btnFlags = commonService.getBtnStatus($scope.pagination.currentTablePage, $scope.pagination.totalTablePages);
                                $scope.disableNxtBtn = btnFlags.disableNxtBtn;
                                $scope.disablePrvBtn = btnFlags.disablePrvBtn;
                                $scope.disableFirstBtn = btnFlags.disableFirstBtn;
                                $scope.disableLastBtn = btnFlags.disableLastBtn;

                                apiData = apiData.details.results;
                                $scope.datagridMessage = "";
                                for (let i = 0; i < apiData.length; i++) {
                                    let objToInsert = {};
                                    objToInsert["meterSl"] = apiData[i].MeterSerialNumber;
                                    objToInsert["MeterID"] = apiData[i].MeterID;
                                    objToInsert["meterMake"] = apiData[i].Meters_DeviceDetails.MeterMake;
                                    objToInsert["applicationType"] = apiData[i].Meters_DeviceDetails.MeterApptype;
                                    objToInsert["consumerNumber"] = apiData[i].Meters_Billing.MeterConsumerNumber;
                                    objToInsert["installationLocation"] = apiData[i].Meters_DeviceDetails.MeterInstallationLocation;
                                    objToInsert["ctRatioMeter"] = apiData[i].Meters_DeviceDetails.CT_Ratio;
                                    objToInsert["ptRatioMeter"] = apiData[i].Meters_DeviceDetails.PT_Ratio;
                                    objToInsert["ratedVoltageMeter"] = apiData[i].Meters_DeviceDetails.RatedVoltage;
                                    objToInsert["phasesMeter"] = apiData[i].Meters_DeviceDetails.Phase;
                                    objToInsert["ratedFrequencyMeter"] = apiData[i].Meters_DeviceDetails.Frequency;
                                    objToInsert["nominalCurrent"] = apiData[i].Meters_DeviceDetails.MeterNominalCurrent;
                                    objToInsert["maximumCurrent"] = apiData[i].Meters_DeviceDetails.MeterMaximumCurrent;
                                    objToInsert["complaintStandardMeter"] = apiData[i].Meters_DeviceDetails.MeterCompliantToStandards;
                                    objToInsert["wifiMacIdMeter"] = apiData[i].Meters_Communications.MAC_ID_WiFi;
                                    objToInsert["wifiIpAddMeter"] = apiData[i].Meters_Communications.IP_address_WiFi;
                                    objToInsert["wifiAccessPwdMeter"] = apiData[i].Meters_Communications.AccessPointPassword;
                                    objToInsert["meterAdminPwd"] = apiData[i].Meters_Communications.MeterAdminPassword;
                                    objToInsert["latitudeMeter"] = apiData[i].Meters_Communications.Latitude;
                                    objToInsert["longitudeMeter"] = apiData[i].Meters_Communications.Longitude;
                                    objToInsert["consumerName"] = apiData[i].Meters_Billing.MeterConsumerName;
                                    objToInsert["contactNumber"] = apiData[i].Meters_Billing.MeterConsumerContactNumber;
                                    objToInsert["consumerAddress"] = apiData[i].Meters_Billing.MeterConsumerAddress;
                                    objToInsert["consumerCountry"] = apiData[i].Meters_Billing.MeterConsumerCountry;
                                    objToInsert["consumerState"] = apiData[i].Meters_Billing.MeterConsumerState;
                                    objToInsert["consumerCity"] = apiData[i].Meters_Billing.MeterConsumerCity;
                                    objToInsert["consumerZipcode"] = apiData[i].Meters_Billing.MeterConsumerZipCode;
                                    objToInsert["billingDate"] = apiData[i].Meters_Billing.BillingDate;
                                    objToInsert["billingTime"] = apiData[i].Meters_Billing.BillingTime;
                                    objToInsert["demandResetDate"] = apiData[i].Meters_Billing.MeterDemandResetDate;
                                    objToInsert["SealID"] = apiData[i].SealID;
                                    objToInsert["ImpulseCountPerKVARh"] = apiData[i].Meters_Billing.ImpulseCountPerKVARh;
                                    objToInsert["ImpulseCountperKWh"] = apiData[i].Meters_Billing.ImpulseCountperKWh;
                                    objToInsert["BiDirectional"] = apiData[i].BiDirectional;
                                    objToInsert["EVMeter"] = apiData[i].EVMeter;
                                    objToInsert["SolarPanel"] = apiData[i].SolarPanel;
                                    objToInsert["MeterVersion"] = apiData[i].Meters_DeviceDetails.MeterVersion;
                                    objToInsert["MeasurementClass"] = apiData[i].Meters_DeviceDetails.MeterAccuracy;
                                    objToInsert["meterDisconnector"] = apiData[i].Meters_DeviceDetails.MeterDisconnector;
                                    arrMeterData.push(objToInsert);
                                }
                                $scope.meterGrid.data = arrMeterData;
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
                        $scope.initializeMeterTable(nextAPIPage, $scope.pagination.currentTablePaginationSize);
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
                        $scope.initializeMeterTable(prevAPIPage, $scope.pagination.currentTablePaginationSize);
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
                        $scope.initializeMeterTable(firstPage, $scope.pagination.currentTablePaginationSize);
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
                        $scope.initializeMeterTable(lastPage, $scope.pagination.currentTablePaginationSize);
                    } else {
                        {
                            $scope.disablePrvBtn = true;
                            $scope.disableNxtBtn = false;
                        }
                    }
                }

                $scope.paginationBoxChanges = function () {
                    if ($scope.pagination.currentTablePage) {
                        $scope.initializeMeterTable($scope.pagination.currentTablePage, $scope.pagination.currentTablePaginationSize);
                    } else {
                        $scope.pagination.currentTablePage = 1;
                        $scope.initializeMeterTable($scope.pagination.currentTablePage, $scope.pagination.currentTablePaginationSize);
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
                 * Open and close functions for the popover
                 */
                $scope.dynamicPopover = {
                    templateUrl: '/templates/tagSettings.html',
                    content: '',
                    open: function open() {
                        $scope.dynamicPopover.isOpen = true;
                    }, close: function close() {
                        $scope.dynamicPopover.isOpen = false;
                    }
                };

                /**
                 * 
                 */
                $rootScope.updateMeterConfigOptions = function (data, callback) {
                    callback();
                };

                /**
                 * @description
                 * Opens modal for editting meter information
                 *
                 * @param Nil
                 * @return Nil
                 
                 */
                vm.editMeter = function () {
                    $uibModal.open({
                        templateUrl: '/templates/meterInfo.html',
                        controller: 'newMeterConfigurationCtrl',
                        size: 'lg',
                        backdrop: 'static',
                        keyboard: true
                    });
                };

                /**
                 *  @description
                 * Opens modal for viewing meter entry
                 *
                 * @param row
                 * @return Nil
                 
                 */
                vm.viewMeterEntry = function (row) {
                    objCacheDetails.data.selectedData = row.entity;
                    $uibModal.open({
                        templateUrl: '/templates/viewMeterEntry.html',
                        controller: 'viewMeterEntryCtrl',
                        size: 'lg',
                        backdrop: 'static',
                        keyboard: true
                    });
                };

                /**
                 *  @description
                 * Creates a new configuration object
                 *
                 * @param row
                 * @return Nil
                 
                 */
                $scope.createConfigObject = function () {
                    var configOb = {
                        'circuitId': $scope.circuitId,
                        'kvaRating': $scope.kvaRating,
                        'substationId': $scope.substationId,
                        'substationName': $scope.substationName,
                        'substationAdd': $scope.substationAdd,
                        'country': $scope.country,
                        'state': $scope.state,
                        'city': $scope.city,
                        'zipcode': $scope.zipcode
                    };
                    return configOb;
                };

                /**
                 * @description
                  * Assigns a meter to a transformer
                 *
                 * @param Nil
                 * @return Nil
                
                 */
                $scope.assignMeterToTransformer = function () {
                    var selectedMeters = [];
                    for (var i = 0; i < $scope.gridApi.selection.getSelectedRows().length; i++) {
                        selectedMeters.push($scope.gridApi.selection.getSelectedRows()[i].MeterID);
                    }
                    if (selectedMeters.length > 0) {
                        swal({
                            title: "Group Meter",
                            text: "Do you really want to group Meter to this Transformer ?",
                            showCancelButton: true,
                            confirmButtonColor: 'black',
                            confirmButtonText: 'Group',
                            cancelButtonText: "Cancel",
                            cancelButtonColor: 'white',
                        }, function (isConfirm) {
                            if (isConfirm) {
                                deviceMappingService
                                    .addMeterToTransformer($sessionStorage.get('selectedTransformer'), selectedMeters)
                                    .then(function (objData) {
                                        swal(objData);
                                        $scope.pagination.currentTablePage = 1;
                                        $scope.initializeMeterTable($scope.pagination.currentTablePage, $scope.pagination.currentTablePaginationSize);;
                                    });
                            }
                        });
                    } else {
                        swal({
                            title: 'Warning',
                            text: 'Please select a meter to map',
                            type: "warning"
                        });
                    }
                };

                $scope.searchMeterGrouping = 'all';
                 /**
                     * Function to clear the  circuit entry
                     */
                    $scope.searchButtonClear =  function (searchtermInCircuitEntry) {
                        if(searchtermInCircuitEntry == ""){
                            $scope.searchTerm = '';
                            $scope.initializeMeterTable($scope.pagination.currentTablePage, $scope.pagination.currentTablePaginationSize);
                        }
                    }
                    /**
                 * @description
                 * Function to search data in grid
                 *
                 * @param searchTerm
                 * @return Nil
                
                 */
                $scope.searchButton = function (searchValue) {
                    if (searchValue) {
                        $scope.searchTerm = searchValue;
                            $scope.pagination.currentTablePage = 1;
                            $scope.initializeMeterTable($scope.pagination.currentTablePage, $scope.pagination.currentTablePaginationSize);
                    } else {
                        $scope.searchTerm = '';
                        $scope.initializeMeterTable($scope.pagination.currentTablePage, $scope.pagination.currentTablePaginationSize);
                    }
                    angular.element(document.querySelector("div.ui-grid-selection-row-header-buttons")).removeClass("ui-grid-all-selected");
                    $scope.mySelectedRows.length = 0;
                };

                /**
                 *  @description
                 * Refresh the UI grid data
                 *
                 * @param gridApi
                 * @return Nil
                 
                 */
                $scope.meterGrid.onRegisterApi = function (gridApi) {
                    $scope.gridApi = gridApi;
                    gridApi.selection.on.rowSelectionChanged($scope,
                        function (row) {
                            $scope.mydisabled = false;
                        });
                };

                /**
                 *  @description
                 * Go back to the parent transformer meter grouping
                 *
                 * @param Nil
                 * @return Nil
                 
                 */
                $scope.goBack = function () {
                    $state.go('system.grouping.transformerMeterGrouping');
                };
            }]);
})(window.angular);