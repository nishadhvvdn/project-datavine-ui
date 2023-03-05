/**
 * @description
 * Controller for Meter Registration
 */
(function (angular) {
    "use strict";
    angular.module('dataVINEApp').controller('meterRegistrationCtrl',
        ["$scope", "$uibModal", "$state", "$rootScope", '$filter','DeviceService',
            'commonService','$sessionStorage','$templateCache',
            function ($scope, $uibModal, $state, $rootScope, $filter,deviceService,commonService,$sessionStorage,$templateCache) {
                let currentDefaultTablePageSize = objCacheDetails.grid.paginationPageSize;
                var modalInstance = null;
                $scope.searchMeterEntry = 'all';
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
                /**
                 * Function to display meter details in UI Grid
                 */
                $scope.initializeMeterTable = function (pageNum) {
                    $scope.meterGrid.data = [];
                    $scope.meterGrid = angular.copy(objCacheDetails.grid);
                    $scope.meterGrid.exporterPdfOrientation = 'landscape';
                    $scope.meterGrid.exporterPdfMaxGridWidth = 640;
                    $scope.meterGrid.exporterCsvFilename = 'file.csv';
                    $scope.meterGrid.exporterMenuCsv = true;
                    angular.element(document.querySelector("div.ui-grid-selection-row-header-buttons")).removeClass("ui-grid-all-selected");
                    $scope.meterGrid.columnDefs = [
                        {
                            field: 'meterSl', displayName: 'Meter Serial Number',
                            enableHiding: false,sortingAlgorithm: commonService.getSortByString, width : 180
                        },
                        { field: 'MeterID', displayName: 'Meter ID', enableHiding: false,sortingAlgorithm: commonService.getSortByNumber
                        },
                        { field: 'meterMake', displayName: 'Make', enableHiding: false,sortingAlgorithm: commonService.getSortByString},
                        {
                            field: 'applicationType', displayName: 'Application Type',
                            enableHiding: false, visible: false,
                        },
                        {
                            field: 'consumerNumber',
                            displayName: 'Consumer Number',
                            enableHiding: false, visible: true,
                            sortingAlgorithm: commonService.getSortByString
                        },
                        {
                            field: 'installationLocation',
                            displayName: 'Installation Location',
                            enableHiding: false, visible: false,
                        },
                        {
                            field: 'ctRatioMeter', displayName: 'CT Ratio',
                            type: 'number', enableHiding: false, visible: false
                        },
                        {
                            field: 'ptRatioMeter', displayName: 'PT Ratio',
                            type: 'number', enableHiding: false, visible: false
                        },
                        {
                            field: 'ratedVoltageMeter',
                            displayName: 'Rated Voltage',
                            enableHiding: false, visible: false
                        },
                        {
                            field: 'phasesMeter',
                            displayName: 'No of Phases',
                            type: 'number', enableHiding: false,
                            sortingAlgorithm: commonService.getSortByNumber
                        },
                        {
                            field: 'ratedFrequencyMeter',
                            displayName: 'Rated Frequency',
                            type: 'number', enableHiding: false, visible: false
                        },
                        {
                            field: 'nominalCurrent',
                            displayName: 'Nominal Current',
                            type: 'number', enableHiding: false, visible: false
                        },
                        {
                            field: 'maximumCurrent',
                            displayName: 'Maximum Current',
                            type: 'number', enableHiding: false, visible: false
                        },
                        {
                            field: 'complaintStandardMeter',
                            displayName: 'Compliant of Standard',
                            enableHiding: false, visible: false
                        },
                        {
                            field: 'wifiMacIdMeter',
                            displayName: 'Wifi Mac ID',
                            enableHiding: false, visible: false
                        },
                        {
                            field: 'wifiIpAddMeter',
                            displayName: 'Wifi IP Address',
                            enableHiding: false, visible: false
                        },
                        {
                            field: 'wifiAccessPwdMeter',
                            displayName: 'Wifi Access Pt PWD',
                            enableHiding: false, visible: false
                        },
                        {
                            field: 'meterAdminPwd',
                            displayName: 'Meter Admin PWD',
                            enableHiding: false, visible: false
                        },
                        {
                            field: 'latitudeMeter',
                            displayName: 'Latitude', enableHiding: false,
                            sortingAlgorithm: commonService.getSortByNumber
                        },
                        {
                            field: 'longitudeMeter',
                            displayName: 'Longitude', enableHiding: false,
                            sortingAlgorithm: commonService.getSortByNumber
                        },
                        {
                            field: 'consumerName',
                            displayName: 'Consumer Name',
                            enableHiding: false, visible: false
                        },
                        {
                            field: 'contactNumber',
                            displayName: 'Contact Number',
                            enableHiding: false, visible: false
                        },
                        {
                            field: 'consumerAddress',
                            displayName: 'Address',
                            enableHiding: false, visible: false
                        },
                        {
                            field: 'consumerCountry',
                            displayName: 'Country',
                            enableHiding: false, visible: false
                        },
                        {
                            field: 'consumerState',
                            displayName: 'State', enableHiding: false, visible: false
                        },
                        {
                            field: 'consumerCity',
                            displayName: 'City', enableHiding: false, visible: false
                        },
                        {
                            field: 'consumerZipcode',
                            displayName: 'Zipcode',
                            enableHiding: false, visible: false
                        },
                        {
                            field: 'billingDate',
                            displayName: 'Billing Cycle Day',
                            type: 'number', enableHiding: false, visible: false
                        },
                        {
                            field: 'billingTime',
                            displayName: 'Billing Time',
                            enableHiding: false, visible: false
                        },
                        {
                            field: 'demandResetDate',
                            displayName: 'Demand Reset Day',
                            type: 'number', enableHiding: false, visible: false
                        }, 
                        {
                            field: 'SealID',
                            displayName: 'Seal ID', enableHiding: false, visible: false
                        },
                        {
                            field: 'ImpulseCountPerKVARh',
                            displayName: 'Impulse Count (per kVArh)', enableHiding: false, visible: false
                        },
                        {
                            field: 'ImpulseCountperKWh',
                            displayName: 'Impulse Count (per kWh)', enableHiding: false, visible: false
                        },
                        {
                            field: 'BiDirectional',
                            displayName: 'Bi-Directional', enableHiding: false, visible: false
                        },
                        {
                            field: 'EVMeter',
                            displayName: 'EV Meter', enableHiding: false, visible: false
                        },
                        {
                            field: 'SolarPanel',
                            displayName: 'Solar Return', enableHiding: false, visible: false
                        },
                        {
                            field: 'MeasurementClass',
                            displayName: 'Accuracy', enableHiding: false, visible: false
                        },
                        {
                            field: 'meterDisconnector',
                            displayName: 'Disconnector Available', enableHiding: false, visible: false
                        },
                        {
                            field: 'MeterVersion',
                            displayName: 'MeterVersion', enableHiding: false, visible: false
                        },
                        {
                            field: 'Actions',
                            cellTemplate: '<div class="ui-grid-cell-contents">' +
                                '<button type="button" ' +
                                'class="btn btn-xs btn-primary cellBtn"' +
                                ' ng-click="grid.appScope.vm.viewMeterEntry(row)" title="View">' +
                                '  <i class="fa fa-eye"></i></button>' +
                                ' | <button type="button"' +
                                ' class="btn btn-xs btn-primary cellBtn"' +
                                ' ng-click="grid.appScope.editMeter(row)" title="Edit">' +
                                ' <i class="fa fa-pencil-square-o"' +
                                ' aria-hidden="true"></i></button> | ' +
                                '<button type="button" ' +
                                'class="btn btn-xs btn-primary cellBtn"' +
                                ' ng-click="grid.appScope.vm.viewMetertoDeltalinkInfo(row)" title="Link DeltaLINK\u2122">' +
                                '  <img height="12px" width="12px" src="/assets/images/deltalink-icon-white.png"></img></button> | ' +
                                ' <button class="btn btn-xs btn-primary cellBtn imgactionBtn" ' +
                                ' ng-click="grid.appScope.vm.configuration(row)" title="Device Configuration">' +
                                ' <img alt="#" src="../assets/images/config.png" />' +
                                '</button> | ' +
                                ' <button class="btn btn-xs btn-primary cellBtn" ' +
                                ' ng-click="grid.appScope.vm.deleteMeter(row)" title="Delete">' +
                                ' <i class="fa fa-trash-o" aria-hidden="true">' +
                                '</i></button></div>',
                            enableColumnMenu: false, enableSorting: false,
                            enableHiding: false, width: 180
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
                    deviceService.getAllMeters('All',$scope.searchMeterEntry,$scope.searchTerm,pageNum,limit)
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
                                $scope.commonMsg = "";
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
                                    objToInsert["DeviceStatus"] = apiData[i].Status;
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
                 * Route back to the state meterdeltalink
                 */
                vm.viewMetertoDeltalinkInfo = function (row) {
                    objCacheDetails.data.selectedMeter = row.entity.MeterID;
                    objCacheDetails.data.selectedMeterName = row.entity.meterSl;
                    $sessionStorage.put('selectedMeter',row.entity.MeterID);
                    $sessionStorage.put('selectedMeterName',row.entity.meterSl);
                    $sessionStorage.put('selectedMeterDetails', row.entity);
                    $state.go('system.meterDeltalink');
                }
                 /**
                     * Function to clear the  deltalink entry search
                     */
                    $scope.searchButtonClear =  function (searchTerm) {
                        if(searchTerm == ""){
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
                        console.log($scope.searchMeterEntry);
                        if ($scope.searchMeterEntry === 'tsn') {
                            $scope.pagination.currentTablePage = 1;
                            $scope.initializeMeterTable($scope.pagination.currentTablePage, $scope.pagination.currentTablePaginationSize);
                        }
                        else if ($scope.searchMeterEntry === 'hsn') {
                            $scope.pagination.currentTablePage = 1;
                            $scope.initializeMeterTable($scope.pagination.currentTablePage, $scope.pagination.currentTablePaginationSize);
                        } else if ($scope.searchMeterEntry === 'all') {
                            $scope.pagination.currentTablePage = 1;
                            $scope.initializeMeterTable($scope.pagination.currentTablePage, $scope.pagination.currentTablePaginationSize);
                        }
                    } else {
                        $scope.searchTerm = '';
                        $scope.initializeMeterTable($scope.pagination.currentTablePage, $scope.pagination.currentTablePaginationSize);
                    }
                    angular.element(document.querySelector("div.ui-grid-selection-row-header-buttons")).removeClass("ui-grid-all-selected");
                    $scope.mySelectedRows.length = 0;
                };

                /**
                 *  @description
                 * Function to view meter in grid by
                 * opening a pop-up
                 *
                 * @param row
                 * @return Nil
                 
                 */
                vm.viewMeterEntry = function (row) {
                    objCacheDetails.data.ID = row.entity.ID;
                    objCacheDetails.data.selectedData = row.entity;
                    modalInstance = $uibModal.open({
                        templateUrl: '/templates/viewMeterEntry.html',
                        controller: 'viewMeterEntryCtrl',
                        size: 'lg',
                        backdrop: 'static',
                        keyboard: true
                    });
                    modalInstance.result.then(function () {
                        $scope.mySelectedRows.length = 0;
                        $scope.initializeMeterTable($scope.pagination.apiCurrentPage, currentDefaultTablePageSize);
                    }, function (callApi) {                        
                        if(callApi) {
                            $scope.mySelectedRows.length = 0;
                            $scope.initializeMeterTable($scope.pagination.apiCurrentPage, currentDefaultTablePageSize);
                        }
                    });
                };

                /**
                 *   @description
                 * Function to delete meter
                 *
                 * @param row
                 * @return Nil
                 
                 */
                vm.deleteMeter = function (row) {
                    swal({
                        title: "Delete Meter",
                        text: "Deleting the Meter will remove connection " +
                            "between the devices.Are you sure you want to remove?",
                        showCancelButton: true,
                        confirmButtonColor: 'black',
                        confirmButtonText: 'Delete',
                        cancelButtonText: "Cancel",
                        cancelButtonColor: 'white',
                    }, function (isConfirm) {
                        if (isConfirm) {
                            var arrInputData = [row.entity.MeterID];
                            deviceService.deleteMeters(arrInputData)
                                .then(function (objData) {
                                    swal(objData);
                                    $scope.mySelectedRows.length = 0;
                                    $scope.initializeMeterTable($scope.pagination.apiCurrentPage, currentDefaultTablePageSize);
                                });
                        }
                    });
                };

                /**
                 *  @description
                 * Function to delete selected meters
                 *
                 * @param Nil
                 * @return Nil
                 
                 */
                $scope.deleteSelectedMeters = function () {
                    swal({
                        title: "Delete Meter",
                        text: "Deleting the Meter will remove connection " +
                            "between the devices. Are you sure you want to remove ?",
                        showCancelButton: true,
                        confirmButtonColor: 'black',
                        confirmButtonText: 'Delete',
                        cancelButtonText: "Cancel",
                        cancelButtonColor: 'white',
                    }, function (isConfirm) {
                        if (isConfirm) {
                            var selectedMeters = [];
                            for (var i = 0; i < $scope.mySelectedRows.length; i++) {
                                selectedMeters.push($scope.mySelectedRows[i].MeterID);
                            }
                            deviceService
                                .deleteMeters(selectedMeters)
                                .then(function (objData) {
                                    swal(objData);
                                    $scope.mySelectedRows.length = 0;
                                    $scope.initializeMeterTable($scope.pagination.apiCurrentPage, currentDefaultTablePageSize);
                                });
                        } else {
                            swal({
                                title: 'Warning',
                                text: 'Please select a meter to delete',
                                type: "warning"
                            });
                        }
                    });
                };

                /**
                 *  @description
                 * Function to open pop-up for uploading configuration
                 *
                 * @param size
                 * @return Nil
                 
                 */
                $scope.openUploadMeterConfiguration = function (size) {
                    modalInstance = $uibModal.open({
                        templateUrl: '/templates/openUploadConfiguration.html',
                        controller: 'uploadCtrl',
                        size: size,
                        backdrop: 'static',
                        keyboard: true,
                        resolve: {
                            uploadParam: function () {
                                return { type: 'meter', endPoint: 'NewMeterEntry' };
                            }
                        }
                    });
                    modalInstance.result.then(function () {
                        $scope.mySelectedRows.length = 0;
                        $scope.initializeMeterTable($scope.pagination.apiCurrentPage, currentDefaultTablePageSize);
                    }, function (callApi) {                        
                        if(callApi) {
                            $scope.mySelectedRows.length = 0;
                            $scope.initializeMeterTable($scope.pagination.apiCurrentPage, currentDefaultTablePageSize);
                        }
                    });
                    $scope.dynamicPopover.isOpen = false;
                };
                $scope.uploadMeterConfiguration = function (size) {
                    modalInstance = $uibModal.open({
                        templateUrl: '/templates/openUploadConfiguration.html',
                        controller: 'uploadCtrl',
                        size: size,
                        backdrop: 'static',
                        keyboard: true,
                        resolve: {
                            uploadParam: function () {
                                return { type: 'meterConfig', endPoint: 'ConfigUploadMeters' };
                            }
                        }
                    });
                    modalInstance.result.then(function () {
                        $scope.mySelectedRows.length = 0;
                        $scope.initializeMeterTable($scope.pagination.apiCurrentPage, currentDefaultTablePageSize);
                    }, function (callApi) {                        
                        if(callApi) {
                            $scope.mySelectedRows.length = 0;
                            $scope.initializeMeterTable($scope.pagination.apiCurrentPage, currentDefaultTablePageSize);
                        }
                    });
                    $scope.dynamicPopover.isOpen = false;
                };
                /**
                 *   @description
                 * Function to edit meter by
                 * opening a pop-up
                 *
                 * @param row
                 * @return Nil
                 
                 */
                $scope.editMeter = function (row) {
                    objCacheDetails.data.selectedData = row.entity;
                    modalInstance = $uibModal.open({
                        templateUrl: 'templates/createMeter.html',
                        controller: 'newMeterConfigurationCtrl',
                        size: 'lg',
                        backdrop: 'static',
                        keyboard: true
                    });
                    modalInstance.result.then(function () {
                        $scope.mySelectedRows.length = 0;
                        $scope.initializeMeterTable($scope.pagination.apiCurrentPage, currentDefaultTablePageSize);
                    }, function (callApi) {                        
                        if(callApi){
                            $scope.mySelectedRows.length = 0;
                            $scope.initializeMeterTable($scope.pagination.apiCurrentPage, currentDefaultTablePageSize);
                        }
                    });
                };

                /**
                 *  @description
                 * Function to create new meter configuration by
                 * opening a pop-up
                 *
                 * @param Nil
                 * @return Nil
                 
                 */
                $scope.create = function () {
                    modalInstance = $uibModal.open({
                        templateUrl: 'templates/createMeter.html',
                        controller: 'newMeterConfigurationCtrl',
                        size: 'lg',
                        backdrop: 'static',
                        keyboard: true
                    });
                    modalInstance.result.then(function () {
                        $scope.mySelectedRows.length = 0;
                        $scope.initializeMeterTable($scope.pagination.apiCurrentPage, currentDefaultTablePageSize);
                    }, function (callApi) {                        
                        if(callApi) {
                            $scope.mySelectedRows.length = 0;
                            $scope.initializeMeterTable($scope.pagination.apiCurrentPage, currentDefaultTablePageSize);
                        }
                    });
                };
                /**
                 * @description
                 * Device Configuration
                 *
                 * @param row
                 * @return Nil
                 */
                vm.configuration = function (row) {
                    $sessionStorage.put('selectedDeviceIdConfig', row.entity.MeterID);
                    $sessionStorage.put('selectedSerialNumberConfig', row.entity.meterSl);
                    $sessionStorage.put('selectedDeviceStatusConfig', row.entity.DeviceStatus);
                    $state.go('system.meterconfig');
                };
            }]);
})(window.angular);
