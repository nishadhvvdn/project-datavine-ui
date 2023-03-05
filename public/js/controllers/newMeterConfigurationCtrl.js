/**
 * @description
 * Controller for New Meter Configuration
 */
(function (angular) {
    "use strict";
    angular.module('dataVINEApp').controller('newMeterConfigurationCtrl',
        ["$uibModalStack", "$modalInstance",
            "$scope", "$uibModal", "$state", "$rootScope", "DeviceService",
            function ($uibModalStack, $modalInstance, $scope, $uibModal,
                      $state, $rootScope, deviceService) {
                $scope.meterdetails = {};
                var meterPassword = null;
                $scope.SolarPanelBoolean = false;
                $scope.EVMeterBoolean = false;
                $scope.BiDirectionalBoolean = false;
                var userTimeZone = objCacheDetails.userDetails.timeZone;
                $scope.meterdetails.billingTime = new Date(moment
                    .tz(userTimeZone)
                    .format('YYYY-MM-DD HH:mm'));
                $scope.make = ["Tatung", "Vision"];
                $scope.meterdetails.make = $scope.make[1];
                function populateProperData(key) {
                    return (key) ? {
                        id: true, value: 'True'
                    } : {
                        id: false, value: 'False'
                    };
                }
                $scope.phases = [1, 3];
                $scope.meterdetails.phases = $scope.phases[1];
                $scope.applicationType = ["Residential", "Commercial",
                    "Industrial", "Electric Vehicle", "Street Light Load"];
                $scope.meterdetails.applicationType = $scope.applicationType[0];
                $scope.installationType = ["In Door", "Out Door"];
                $scope.meterdetails.installationType = $scope.installationType[1];
                $scope.ratedVoltage = [110, 220, 240];
                $scope.meterdetails.ratedVoltage = $scope.ratedVoltage[1];
                $scope.frequency = [50, 60];
                $scope.meterdetails.frequency = $scope.frequency[1];
                $scope.complaintStandardMeter = ["IEC", "ANSI"];
                $scope.meterdetails.complaintStandardMeter =
                    $scope.complaintStandardMeter[0];
                let listDays = function () {
                    let dayIndex = 0;
                    let daysArr = [];
                    for (dayIndex; dayIndex < 31; dayIndex++) {
                        daysArr[dayIndex] = parseInt(dayIndex + 1, 10);
                    }
                    return daysArr;
                }
                let codeMatrix = {
                    'IN (+91)' : '+91',
                    'SA (+27)' : '+27',
                    'USA (+1)' : '+1'
                }
                let revCodeMatrix = {
                    '+91': 'IN',
                    '+27': 'SA',
                    '+1' : 'USA'
                }
                $scope.countriesCode = ['IN (+91)', 'SA (+27)','USA (+1)'];
                $scope.meterDisconnector = ["Yes", "No"];
                $scope.meterdetails.meterDisconnector = $scope.meterDisconnector[1];
                $scope.meterdetails.BiDirectional = populateProperData(false);
                $scope.billingDate = listDays();
                $scope.meterdetails.billingDate = $scope.billingDate[1];
                $scope.demandDate = listDays();
                $scope.meterdetails.demandDate = $scope.demandDate[1];
                $scope.measurementClass = ["0.5", "1", "2"];
                $scope.meterdetails.measurementClass = $scope.measurementClass[1];
                $scope.meterdetails.EVMeter = populateProperData(false);
                $scope.meterdetails.SolarPanel = populateProperData(false);
                if (angular.isUndefinedOrNull(objCacheDetails.data.selectedData)) {
                    $scope.createUpdateStatus = true;
                    $scope.meterdetails.wifiAccessPwd = '00000000';
                    $scope.meterdetails.meterAdminPwd = '00000000000000000000';
                    $scope.meterStatus = 'NotRegistered';
                    $scope.editWifi = false;
                    $scope.meterdetails.countryCode = 'USA (+1)';
                } else {
                    $scope.editWifi = true;
                    var meterData = objCacheDetails.data.selectedData;
                    $scope.meterStatus = meterData.DeviceStatus;
                    meterPassword = meterData.wifiAccessPwdMeter;
                    $scope.meterdetails.MeterID = (meterData.MeterID).toString();
                    $scope.meterdetails.meterSl = (meterData.meterSl).toString();
                    $scope.meterdetails.SealID = (meterData.SealID).toString();
                    $scope.meterdetails.BiDirectional = populateProperData(meterData.BiDirectional);
                    $scope.meterdetails.EVMeter = populateProperData(meterData.EVMeter);
                    $scope.meterdetails.SolarPanel = populateProperData(meterData.SolarPanel);
                    $scope.meterdetails.applicationType = meterData.applicationType;
                    $scope.meterdetails.installationType = meterData.installationLocation;
                    $scope.meterdetails.ctRatio = (meterData.ctRatioMeter).toString();
                    $scope.meterdetails.ptRatio = (meterData.ptRatioMeter).toString();
                    $scope.meterdetails.phases = parseInt(meterData.phasesMeter);
                    $scope.meterdetails.frequency = parseInt(meterData.ratedFrequencyMeter);
                    $scope.meterdetails.ratedVoltage = parseInt(meterData.ratedVoltageMeter);
                    $scope.meterdetails.nominalCurrent = (meterData.nominalCurrent).toString();
                    $scope.meterdetails.maximumCurrent = (meterData.maximumCurrent).toString();
                    $scope.meterdetails.complaintStandardMeter = meterData.complaintStandardMeter;
                    $scope.meterdetails.wifiIpAdd = (meterData.wifiIpAddMeter).toString();
                    $scope.meterdetails.wifiMacId = (meterData.wifiMacIdMeter).toString();
                    $scope.meterdetails.wifiAccessPwd = meterData.wifiAccessPwdMeter;
                    $scope.meterdetails.meterAdminPwd = meterData.meterAdminPwd;
                    $scope.meterdetails.latitude = (meterData.latitudeMeter).toString();
                    $scope.meterdetails.longitude = (meterData.longitudeMeter).toString();
                    $scope.meterdetails.consumerNumber = (meterData.consumerNumber).toString();
                    $scope.meterdetails.consumerName = (meterData.consumerName).toString();
                    if(meterData.contactNumber.split('-')[1]) {
                        let cCode =  meterData.contactNumber.split('-')[0];
                        $scope.meterdetails.contactNumber = (meterData.contactNumber.split('-')[1]).toString();
                        $scope.meterdetails.countryCode =  revCodeMatrix[cCode]+ ' ' +'('+ cCode +')';
                    } else {
                        $scope.meterdetails.countryCode = 'USA (+1)';
                    $scope.meterdetails.contactNumber = (meterData.contactNumber).toString();
                    }
                    $scope.meterdetails.consumerAddress = (meterData.consumerAddress).toString();
                    $scope.meterdetails.consumerContact = (meterData.contactNumber).toString();
                    $scope.meterdetails.consumerCountry = (meterData.consumerCountry).toString();
                    $scope.meterdetails.consumerState = meterData.consumerState === 'N/A' ? undefined : (meterData.consumerState).toString();
                    $scope.meterdetails.consumerCity = (meterData.consumerCity).toString();
                    $scope.meterdetails.consumerZipcode = (meterData.consumerZipcode).toString();
                    $scope.meterdetails.billingDate = parseInt(meterData.billingDate);
                    $scope.meterdetails.billingTime = meterData.billingTime;
                    $scope.meterdetails.demandDate = parseInt(meterData.demandResetDate);
                    $scope.meterdetails.make = (meterData.meterMake).toString();
                    $scope.meterdetails.meterDisconnector = meterData.meterDisconnector;
                    $scope.meterdetails.impulseCountKW = (meterData.ImpulseCountperKWh).toString();
                    $scope.meterdetails.impulseCountKV = (meterData.ImpulseCountPerKVARh).toString();
                    $scope.meterdetails.measurementClass = meterData.MeasurementClass;
                    $scope.meterdetails.meterVersion = (meterData.MeterVersion).toString();
                    $scope.createUpdateStatus = false;
                    objCacheDetails.data.selectedData = null;
                }

                if (!$scope.createUpdateStatus) {
                    setTimeout(function () {
                        $scope.updateMeterCheck();
                    }, 100);
                }
                /**
                 * @description
                 * Function to create meter
                 *
                 * @param Nil
                 * @return Nil

                 */
                $scope.updateMeterCheck = function () {
                    $scope.meterFields = ['meterSl' , 'meterVersion' , 'nominalCurrent' , 'maximumCurrent' , 'SealID' ,
                                        'consumerName' , 'consumerNumber' , 'consumerAddress' , 'contactNumber'
                                        , 'impulseCountKW' , 'impulseCountKV' , 'consumerCountry' , 'consumerState'
                                        , 'consumerCity' , 'ctRatio' , 'ptRatio' , 'latitude' , 'longitude' , 'wifiMacId'
                                        , 'wifiIpAdd' , 'consumerZipcode'];
                    if ($scope.meterStatus == 'Registered') {
                        $scope.meterFields.push("wifiAccessPwd");
                    }
                    if ($scope.meterFields.length > 0) {
                        for (var i = 0; i < $scope.meterFields.length; i++) {
                            $scope.focusValidate($scope.meterFields[i]);
                        }
                    }
                };
                $scope.saveMeter = function () {
                    deviceService.create('NewMeterEntry',
                        ['Add', [($scope.meterdetails.meterSl).toString()],
                            [$scope.meterdetails.applicationType],
                            [parseFloat($scope.meterdetails.meterVersion).toString()],
                            [$scope.meterdetails.installationType],
                            [($scope.meterdetails.ctRatio).toString()],
                            [($scope.meterdetails.ptRatio).toString()],
                            [($scope.meterdetails.phases).toString()],
                            [($scope.meterdetails.frequency).toString()],
                            [($scope.meterdetails.ratedVoltage).toString()],
                            [parseInt($scope.meterdetails.nominalCurrent).toString()],
                            [parseInt($scope.meterdetails.maximumCurrent).toString()],
                            [$scope.meterdetails.measurementClass],
                            [$scope.meterdetails.complaintStandardMeter],
                            [$scope.meterdetails.wifiIpAdd],
                            [$scope.meterdetails.wifiAccessPwd],
                            [$scope.meterdetails.meterAdminPwd],
                            [parseFloat($scope.meterdetails.latitude).toString()],
                            [parseFloat($scope.meterdetails.longitude).toString()],
                            [$scope.meterdetails.consumerNumber],
                            [$scope.meterdetails.consumerName],
                            [$scope.meterdetails.consumerAddress],
                            [(codeMatrix[$scope.meterdetails.countryCode] + '-' + $scope.meterdetails.contactNumber).toString()],
                            [parseInt($scope.meterdetails.billingDate).toString()],
                            [$scope.meterdetails.billingTime],
                            [parseInt($scope.meterdetails.demandDate).toString()],
                            [($scope.meterdetails.make).toString()],
                            [$scope.meterdetails.meterDisconnector],
                            [$scope.meterdetails.consumerCountry],
                            [angular.isUndefinedOrNull(
                                $scope.meterdetails.consumerState) ? 'N/A' : $scope.meterdetails.consumerState], [$scope.meterdetails.consumerCity], [$scope.meterdetails.consumerZipcode], [$scope.meterdetails.wifiMacId],
                            [parseInt($scope.meterdetails.impulseCountKW).toString()],
                            [parseInt($scope.meterdetails.impulseCountKV).toString()],
                            [($scope.meterdetails.SealID).toString()],
                            [($scope.meterdetails.BiDirectional.id).toString()],
                            [($scope.meterdetails.EVMeter.id).toString()],
                            [($scope.meterdetails.SolarPanel.id).toString()],[]]
                    ).then(function (objData) {
                        var isSuccess = deviceService.validateSuccess(objData);
                            if(isSuccess) {
                                if(objData.Message) {
                                    swal(objData.Message);
                                    $modalInstance.dismiss(true);
                                    $uibModalStack.clearFocusListCache();
                                    $state.reload();
                                } else {
                                    swal(deviceService.handleDisplayMessageAddDevice(objData));
                                }                                
                            } else {
                                swal(deviceService.handleDisplayMessageAddDevice(objData));
                            }
                    });
                };

                /**
                 * @description
                 * Function to update meter details
                 *
                 * @param Nil
                 * @return Nil

                 */
                $scope.updateMeter = function () {
                    var meterFlag = $scope.meterdetails.wifiAccessPwd === meterPassword ? 'N' : 'Y';
                    var wifiPassword = $scope.meterdetails.wifiAccessPwd === null ? 'null' : $scope.meterdetails.wifiAccessPwd.toString();

                    deviceService.editMeter(
                        ($scope.meterdetails.MeterID).toString(),
                        ($scope.meterdetails.meterSl).toString(),
                        ($scope.meterdetails.applicationType).toString(),
                        ($scope.meterdetails.meterVersion).toString(),
                        $scope.meterdetails.installationType,
                        ($scope.meterdetails.ctRatio).toString(),
                        ($scope.meterdetails.ptRatio).toString(),
                        ($scope.meterdetails.phases).toString(),
                        ($scope.meterdetails.frequency).toString(),
                        ($scope.meterdetails.ratedVoltage).toString(),
                        ($scope.meterdetails.nominalCurrent).toString(),
                        ($scope.meterdetails.maximumCurrent).toString(),
                        $scope.meterdetails.measurementClass,
                        $scope.meterdetails.complaintStandardMeter,
                        $scope.meterdetails.wifiIpAdd,
                        wifiPassword,
                        $scope.meterdetails.meterAdminPwd,
                        parseFloat($scope.meterdetails.latitude).toString(),
                        parseFloat($scope.meterdetails.longitude).toString(),
                        $scope.meterdetails.consumerNumber,
                        $scope.meterdetails.consumerName,
                        $scope.meterdetails.consumerAddress,
                        (codeMatrix[$scope.meterdetails.countryCode] + '-' + $scope.meterdetails.contactNumber).toString(),
                        parseInt($scope.meterdetails.billingDate).toString(),
                        $scope.meterdetails.billingTime,
                        parseInt($scope.meterdetails.demandDate).toString(),
                        $scope.meterdetails.make,
                        $scope.meterdetails.meterDisconnector,
                        $scope.meterdetails.consumerCountry,
                        angular
                            .isUndefinedOrNull($scope.meterdetails.consumerState) ? 'N/A' : $scope.meterdetails.consumerState,
                        $scope.meterdetails.consumerCity,
                        $scope.meterdetails.consumerZipcode,
                        $scope.meterdetails.wifiMacId,
                        $scope.meterdetails.impulseCountKW.toString(),
                        $scope.meterdetails.impulseCountKV.toString(),
                        $scope.meterdetails.SealID,
                        ($scope.meterdetails.BiDirectional.id).toString(),
                        ($scope.meterdetails.EVMeter.id).toString(),
                        ($scope.meterdetails.SolarPanel.id).toString(),
                        meterFlag)
                        .then(function (objData) {
                            var isSuccess = deviceService.validateSuccess(objData);
                            if(isSuccess) {
                                if(objData.Message) {
                                    swal(objData.Message);
                                    $modalInstance.dismiss(true);
                                    $uibModalStack.clearFocusListCache();
                                    $state.reload();
                                } else {
                                    swal(deviceService.handleDisplayMessageEditDevice(objData));
                                }                                
                            } else {
                                swal(deviceService.handleDisplayMessageEditDevice(objData));
                            }
                        });
                };

                /**
                 *  @description
                 * Function to close pop-up
                 *
                 * @param Nil
                 * @return Nil

                 */
                $scope.changeBiDirectional = function () {
                    $scope.BiDirectionalBoolean = !$scope.BiDirectionalBoolean;
                };
                $scope.changeEVMeter = function () {
                    $scope.EVMeterBoolean = !$scope.EVMeterBoolean;
                };
                $scope.changeSolarPanel = function () {
                    $scope.SolarPanelBoolean = !$scope.SolarPanelBoolean;
                };

                setTimeout(function () {
                    $scope.meterCreation.$dirty = false;
                }, 300);

                $scope.cancel = function () {
                    $modalInstance.dismiss(false);
                    $uibModalStack.clearFocusListCache();
                };

                /**
                 *  @description
                 * Function to navigate to Transformer Meter Grouping
                 *
                 * @param Nil
                 * @return Nil

                 */
                $scope.goBack = function () {
                    $state.go('system.transformerMeterGrouping');

                };
                $scope.oneAtATime = true;
                $scope.status = {
                    isCustomHeaderOpen: false,
                    isFirstOpen: true,
                    isFirstDisabled: false
                };

                $scope.showPassword = false;
                var regMac = new RegExp(objCacheDetails.regEx.MAC_ID, "i");
                var regMac64 = /^([0-9a-fA-F]{2}[:]){7}([0-9a-fA-F]{2})$/;
                var ipV4Reg = new RegExp('^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$');
                var regLat = new RegExp("^(\\+|-)?(?:90(?:(?:\\.0{1,6})?)|(?:[0-9]|[1-8][0-9])(?:(?:\\.[0-9]{1,6})?))$");
                var regLon = new RegExp("^(\\+|-)?(?:180(?:(?:\\.0{1,6})?)|(?:[0-9]|[1-9][0-9]|1[0-7][0-9])(?:(?:\\.[0-9]{1,6})?))$");
                var meterVerRegex = /^(?:^(?!0)\d{1,3})(?:\.\d{1,3})?$/;
                var ctptRatioFormat = /^(?:^(?!0)\d{1,4})(?:\.\d{1,2})?$/;
                var zipCodeRegex = /^((?!0{4,6})[A-Za-z0-9]{4,6})?$/;
                let pattern = /^[a-zA-Z0-9\s]+$/;
                let meterConsumerNameRegex = /^[A-Za-z]+(?:\s?[A-Za-z]+)*$/;
                let meterCountryStateCityAddressRegex = /^[A-Za-z0-9]+(?:\s?[A-Za-z0-9]+)*$/;
                var containsSpace = /\s/;

                /**
                 * @description
                 * Function to validate the Meter details
                 *
                 * @param field
                 * @return Nil

                 */
                $scope.focusValidate = function (field) {
                    if (field === 'meterSl') {
                        if($scope.meterdetails.meterSl) {
                            if(!containsSpace.test($scope.meterdetails.meterSl)) {
                                if ($scope.meterdetails.meterSl === undefined || $scope.meterdetails.meterSl.trim().length === 0) {
                                    $scope.errormeterSlMessage = 'Meter Serial is required!';
                                    $scope.errormeterSl = true;
                                    $scope.meterCreation.meterSl.$valid = false;
                                } else if ($scope.meterdetails.meterSl.length < 10 || $scope.meterdetails.meterSl.length > 25) {
                                    $scope.errormeterSlMessage = 'Length of Meter Serial Number range should be from 10 to 25!';
                                    $scope.errormeterSl = true;
                                    $scope.meterCreation.meterSl.$valid = false;
                                } else if (!pattern.test($scope.meterdetails.meterSl)) {
                                    $scope.errormeterSlMessage = 'Invalid Meter Serial Number!';
                                    $scope.errormeterSl = true;
                                    $scope.meterCreation.meterSl.$valid = false;
                                } else {
                                    $scope.errormeterSl = false;
                                    $scope.meterCreation.meterSl.$valid = true;
                                }
                            } else {
                                $scope.errormeterSlMessage = 'Invalid Meter Serial Number!';
                                $scope.errormeterSl = true;
                                $scope.meterCreation.meterSl.$valid = false;
                            }
                        } else {
                            $scope.errormeterSlMessage = 'Meter Serial Number is required!';
                            $scope.errormeterSl = true;
                            $scope.meterCreation.meterSl.$valid = false;
                        }
                    } else if (field === 'meterVersion') {
                        if ($scope.meterdetails.meterVersion) {
                            if (meterVerRegex.test($scope.meterdetails.meterVersion)) {
                                if ($scope.meterdetails.meterVersion.includes('.')) {
                                    if (($scope.meterdetails.meterVersion.match(/\./g)).length === 1) {
                                        let data = $scope.meterdetails.meterVersion.split('.');
                                        let majorVer = data[0];
                                        let minorVer = data[1];
                                        if (majorVer == 255 && minorVer <= 255) {
                                            $scope.errormeterVersion = false;
                                            $scope.errormeterVersionMessage = '';
                                            $scope.meterCreation.meterVersion.$valid = true;
                                        } else if (majorVer > 0 && majorVer <= 254) {
                                            $scope.errormeterVersion = false;
                                            $scope.errormeterVersionMessage = '';
                                            $scope.meterCreation.meterVersion.$valid = true;
                                        } else {
                                            $scope.errormeterVersion = true;
                                            $scope.errormeterVersionMessage = 'Invalid version number!';
                                            $scope.meterCreation.meterVersion.$valid = false;
                                        }
                                    } else {
                                        $scope.errormeterVersion = true;
                                        $scope.errormeterVersionMessage = 'Invalid version number!';
                                        $scope.meterCreation.meterVersion.$valid = false;
                                    }
                                } else {
                                    if ($scope.meterdetails.meterVersion > 0 && $scope.meterdetails.meterVersion <= 255) {
                                        $scope.errormeterVersion = false;
                                        $scope.errormeterVersionMessage = '';
                                        $scope.meterCreation.meterVersion.$valid = true;
                                    } else {
                                        $scope.errormeterVersion = true;
                                        $scope.errormeterVersionMessage = 'Invalid version number!';
                                        $scope.meterCreation.meterVersion.$valid = false;
                                    }
                                }
                            } else {
                                $scope.errormeterVersion = true;
                                $scope.errormeterVersionMessage = 'Invalid version number!';
                                $scope.meterCreation.meterVersion.$valid = false;
                            }
                        } else {
                            $scope.errormeterVersion = true;
                            $scope.errormeterVersionMessage = 'Meter Version is required!';
                            $scope.meterCreation.meterVersion.$valid = false;
                        }

                    } else if (field === 'nominalCurrent') {
                        if ($scope.meterdetails.nominalCurrent === undefined || $scope.meterdetails.nominalCurrent.trim().length === 0) {
                            $scope.errornominalCurrentMessage = 'Nominal Current is required!';
                            $scope.errornominalCurrent = true;
                            $scope.meterCreation.nominalCurrent.$valid = false;
                        } else if ($scope.meterdetails.nominalCurrent <= 0) {
                            $scope.errornominalCurrentMessage = 'Invalid Nominal Current!';
                            $scope.errornominalCurrent = true;
                            $scope.meterCreation.nominalCurrent.$valid = false;
                        } else if ($scope.meterdetails.maximumCurrent !== undefined &&
                            parseInt($scope.meterdetails.nominalCurrent) >= parseInt($scope.meterdetails.maximumCurrent)) {
                            $scope.errornominalCurrentMessage = 'Should be lower than Maximum current!';
                            $scope.errornominalCurrent = true;
                            $scope.meterCreation.nominalCurrent.$valid = false;
                        } else {
                            $scope.errornominalCurrent = false;
                            $scope.meterCreation.nominalCurrent.$valid = true;
                            if ($scope.meterdetails.maximumCurrent !== undefined) {
                                $scope.errormaximumCurrent = false;
                                $scope.meterCreation.maximumCurrent.$valid = true;
                            }
                        }
                    } else if (field === 'maximumCurrent') {
                        if ($scope.meterdetails.maximumCurrent === undefined || $scope.meterdetails.maximumCurrent.trim().length === 0) {
                            $scope.errormaximumCurrentMessage = 'Maximum Current is required!';
                            $scope.errormaximumCurrent = true;
                            $scope.meterCreation.maximumCurrent.$valid = false;
                        } else if ($scope.meterdetails.maximumCurrent <= 0) {
                            $scope.errormaximumCurrentMessage = 'Invalid Maximum Current!';
                            $scope.errormaximumCurrent = true;
                            $scope.meterCreation.maximumCurrent.$valid = false;
                        } else if ($scope.meterdetails.nominalCurrent !== undefined &&
                            parseInt($scope.meterdetails.maximumCurrent) <= parseInt($scope.meterdetails.nominalCurrent)) {
                            $scope.errormaximumCurrentMessage = 'Should be higher than Nominal Current!';
                            $scope.errormaximumCurrent = true;
                            $scope.meterCreation.maximumCurrent.$valid = false;
                        } else {
                            $scope.errormaximumCurrent = false;
                            $scope.meterCreation.maximumCurrent.$valid = true;
                            if ($scope.meterdetails.nominalCurrent !== undefined) {
                                $scope.errornominalCurrent = false;
                                $scope.meterCreation.nominalCurrent.$valid = true;
                            }
                        }
                    } else if (field === 'SealID') {
                        if ($scope.meterdetails.SealID === undefined || $scope.meterdetails.SealID.trim().length === 0) {
                            $scope.errorSealIDMessage = 'Seal ID is required!';
                            $scope.errorSealID = true;
                            $scope.meterCreation.SealID.$valid = false;
                        } else if ($scope.meterdetails.SealID.length > 30) {
                            $scope.errorSealID = true;
                            $scope.errorSealIDMessage = 'Length of Seal ID should not' +
                                ' exceed 30!';
                            $scope.meterCreation.SealID.$valid = false;
                        } else if (!pattern.test($scope.meterdetails.SealID)) {
                            $scope.errorSealID = true;
                            $scope.errorSealIDMessage = 'Invalid Seal ID!';
                            $scope.meterCreation.SealID.$valid = false;
                        } else {
                            $scope.errorSealID = false;
                            $scope.meterCreation.SealID.$valid = true;
                        }
                    } else if (field === 'consumerName') {
                        if($scope.meterdetails.consumerName) {
                            if (meterConsumerNameRegex.test($scope.meterdetails.consumerName)) {
                                if ($scope.meterdetails.consumerName === undefined || $scope.meterdetails.consumerName.trim().length === 0) {
                                    $scope.errorconsumerNameMessage = 'Consumer Name is required!';
                                    $scope.errorconsumerName = true;
                                    $scope.meterCreation.consumerName.$valid = false;
                                } else if ($scope.meterdetails.consumerName.length > 50) {
                                    $scope.errorconsumerNameMessage = 'Length of Consumer Name' +
                                        ' should not exceed 50!';
                                    $scope.errorconsumerName = true;
                                    $scope.meterCreation.consumerName.$valid = false;
                                } else if (!pattern.test($scope.meterdetails.consumerName)) {
                                    $scope.errorconsumerNameMessage = 'Invalid Consumer Name!';
                                    $scope.errorconsumerName = true;
                                    $scope.meterCreation.consumerName.$valid = false;
                                } else {
                                    $scope.errorconsumerName = false;
                                    $scope.meterCreation.consumerName.$valid = true;
                                }
                            } else {
                                $scope.errorconsumerNameMessage = 'Invalid Consumer Name!';
                                $scope.errorconsumerName = true;
                                $scope.meterCreation.consumerName.$valid = false;
                            }
                        } else {
                            $scope.errorconsumerNameMessage = 'Consumer Name is required!';
                            $scope.errorconsumerName = true;
                            $scope.meterCreation.consumerName.$valid = false;
                        }
                    } else if (field === 'consumerNumber') {
                        if ($scope.meterdetails.consumerNumber === undefined || $scope.meterdetails.consumerNumber.trim().length === 0) {
                            $scope.errorconsumerNumberMessage = 'Consumer Number is required!';
                            $scope.errorconsumerNumber = true;
                            $scope.meterCreation.consumerNumber.$valid = false;
                        } else if ($scope.meterdetails.consumerNumber.length > 20) {
                            $scope.errorconsumerNumberMessage = 'Length of Consumer Number should not exceed 20!';
                        }
                        else if (!pattern.test($scope.meterdetails.consumerNumber)) {
                            $scope.errorconsumerNumberMessage = 'Invalid Consumer Number!';
                            $scope.errorconsumerNumber = true;
                            $scope.meterCreation.consumerNumber.$valid = false;
                        } else {
                            $scope.errorconsumerNumber = false;
                            $scope.meterCreation.consumerNumber.$valid = true;
                        }
                    } else if (field === 'consumerAddress') {
                        if($scope.meterdetails.consumerAddress) {
                            if (meterCountryStateCityAddressRegex.test($scope.meterdetails.consumerAddress)) {
                                if ($scope.meterdetails.consumerAddress === undefined || $scope.meterdetails.consumerAddress.trim().length === 0) {
                                    $scope.errorconsumerAddressMessage = 'Consumer Address is required!';
                                    $scope.errorconsumerAddress = true;
                                    $scope.meterCreation.consumerAddress.$valid = false;
                                } else if ($scope.meterdetails.consumerAddress.length > 100) {
                                    $scope.errorconsumerAddressMessage = 'Length of Consumer Address should not exceed 100!';
                                    $scope.errorconsumerAddress = true;
                                    $scope.meterCreation.consumerAddress.$valid = false;
                                } else {
                                    $scope.errorconsumerAddress = false;
                                    $scope.meterCreation.consumerAddress.$valid = true;
                                }
                            } else {
                                $scope.errorconsumerAddressMessage = 'Invalid Consumer Address!';
                                $scope.errorconsumerAddress = true;
                                $scope.meterCreation.consumerAddress.$valid = false;
                            }
                        } else {
                            $scope.errorconsumerAddressMessage = 'Consumer Address is required!';
                            $scope.errorconsumerAddress = true;
                            $scope.meterCreation.consumerAddress.$valid = false;
                        }

                    } else if (field === 'contactNumber') {
                        if ($scope.meterdetails.contactNumber === undefined || $scope.meterdetails.contactNumber.trim().length === 0) {
                            $scope.errorcontactNumberMessage =
                                'Contact Number is required!';
                            $scope.errorcontactNumber = true;
                            $scope.meterCreation.contactNumber.$valid = false;
                        } else if ($scope.meterdetails.contactNumber.length < 9) {
                            $scope.errorcontactNumberMessage ='Contact Number should not be less than 9 digits!';
                            $scope.errorcontactNumber = true;
                            $scope.meterCreation.contactNumber.$valid = false;
                        } else if (!pattern.test($scope.meterdetails.contactNumber)) {
                            $scope.errorcontactNumberMessage = 'Invalid Contact Number!';
                            $scope.errorcontactNumber = true;
                            $scope.meterCreation.contactNumber.$valid = false;
                        } else {
                            $scope.errorcontactNumber = false;
                            $scope.meterCreation.contactNumber.$valid = true;
                        }
                    } else if (field === 'impulseCountKW') {
                        $scope.errorimpulseCountKW = false;
                        $scope.meterCreation.impulseCountKW.$valid = true;
                        if ($scope.meterdetails.impulseCountKW === undefined || $scope.meterdetails.impulseCountKW.trim().length === 0) {
                            $scope.errorimpulseCountKWMessage = 'Impulse Count (per kWh) is required!';
                            $scope.errorimpulseCountKW = true;
                            $scope.meterCreation.impulseCountKW.$valid = false;
                        } else if ($scope.meterdetails.impulseCountKW <= 0) {
                            $scope.errorimpulseCountKWMessage = 'Invalid Impulse Count (per kWh)!';
                            $scope.errorimpulseCountKW = true;
                            $scope.meterCreation.impulseCountKW.$valid = false;
                        } else {
                            $scope.errorimpulseCountKW = false;
                            $scope.meterCreation.impulseCountKW.$valid = true;
                        }
                    } else if (field === 'impulseCountKV') {
                        $scope.errorimpulseCountKV = false;
                        $scope.meterCreation.impulseCountKV.$valid = true;
                        if ($scope.meterdetails.impulseCountKV === undefined || $scope.meterdetails.impulseCountKV.trim().length === 0) {
                            $scope.errorimpulseCountKVMessage = 'Impulse Count (per kVArh) is required!';
                            $scope.errorimpulseCountKV = true;
                            $scope.meterCreation.impulseCountKV.$valid = false;
                        } else if ($scope.meterdetails.impulseCountKV <= 0) {
                            $scope.errorimpulseCountKVMessage = 'Invalid Impulse Count (per kVArh)!';
                            $scope.errorimpulseCountKV = true;
                            $scope.meterCreation.impulseCountKV.$valid = false;
                        } else {
                            $scope.errorimpulseCountKV = false;
                            $scope.meterCreation.impulseCountKV.$valid = true;
                        }
                    } else if (field === 'consumerCountry') {
                        if($scope.meterdetails.consumerCountry) {
                            if (meterCountryStateCityAddressRegex.test($scope.meterdetails.consumerCountry)) {
                                if ($scope.meterdetails.consumerCountry === undefined || $scope.meterdetails.consumerCountry.trim().length === 0) {
                                    $scope.errorconsumerCountryMessage = 'Country is required!';
                                    $scope.errorconsumerCountry = true;
                                    $scope.meterCreation.consumerCountry.$valid = false;
                                } else if ($scope.meterdetails.consumerCountry.length > 50) {
                                    $scope.errorconsumerCountryMessage =
                                        'Length of Country should not exceed 50!';
                                    $scope.errorconsumerCountry = true;
                                    $scope.meterCreation.consumerCountry.$valid = false;
                                } else {
                                    $scope.errorconsumerCountry = false;
                                    $scope.meterCreation.consumerCountry.$valid = true;
                                }
                            } else {
                                $scope.errorconsumerCountryMessage = 'Invalid Country!';
                                $scope.errorconsumerCountry = true;
                                $scope.meterCreation.consumerCountry.$valid = false;
                            }
                        } else {
                            $scope.errorconsumerCountryMessage = 'Country is required!';
                            $scope.errorconsumerCountry = true;
                            $scope.meterCreation.consumerCountry.$valid = false;
                        }
                    } else if (field === 'consumerState') {
                        if($scope.meterdetails.consumerState) {
                            if (meterCountryStateCityAddressRegex.test($scope.meterdetails.consumerState)) {
                                if ($scope.meterdetails.consumerState === undefined || $scope.meterdetails.consumerState.trim().length === 0) {
                                    $scope.errorconsumerStateMessage = 'State is required!';
                                    $scope.errorconsumerState = true;
                                    $scope.meterCreation.consumerState.$valid = false;
                                } else if ($scope.meterdetails.consumerState.length > 50) {
                                    $scope.errorconsumerStateMessage =
                                        'Length of State should not exceed 50!';
                                    $scope.errorconsumerState = true;
                                    $scope.meterCreation.consumerState.$valid = false;
                                }  else {
                                    $scope.errorconsumerState = false;
                                    $scope.meterCreation.consumerState.$valid = true;
                                }
                            } else {
                                $scope.errorconsumerStateMessage = 'Invalid State!';
                                $scope.errorconsumerState = true;
                                $scope.meterCreation.consumerState.$valid = false;
                            }
                        } else {
                            $scope.errorconsumerStateMessage = 'State is required!';
                            $scope.errorconsumerState = true;
                            $scope.meterCreation.consumerState.$valid = false;
                        }
                    } else if (field === 'consumerCity') {
                        if($scope.meterdetails.consumerCity) {
                            if (meterCountryStateCityAddressRegex.test($scope.meterdetails.consumerCity)) {
                                if ($scope.meterdetails.consumerCity === undefined || $scope.meterdetails.consumerCity.trim().length === 0) {
                                    $scope.errorconsumerCityMessage = 'City is required!';
                                    $scope.errorconsumerCity = true;
                                    $scope.meterCreation.consumerCity.$valid = false;
                                } else if ($scope.meterdetails.consumerCity.length > 50) {
                                    $scope.errorconsumerCityMessage =
                                        'Length of City should not exceed 50!';
                                    $scope.errorconsumerCity = true;
                                    $scope.meterCreation.consumerCity.$valid = false;
                                } else if (!pattern.test($scope.meterdetails.consumerCity)) {
                                    $scope.errorconsumerCityMessage = 'Invalid City!';
                                    $scope.errorconsumerCity = true;
                                    $scope.meterCreation.consumerCity.$valid = false;
                                } else {
                                    $scope.errorconsumerCity = false;
                                    $scope.meterCreation.consumerCity.$valid = true;
                                }
                            } else {
                                $scope.errorconsumerCityMessage = 'Invalid City!';
                                $scope.errorconsumerCity = true;
                                $scope.meterCreation.consumerCity.$valid = false;
                            }
                        } else {
                            $scope.errorconsumerCityMessage = 'City is required!';
                            $scope.errorconsumerCity = true;
                            $scope.meterCreation.consumerCity.$valid = false;
                        }
                    } else if (field === 'ctRatio') {
                        if ($scope.meterdetails.ctRatio) {
                            if (ctptRatioFormat.test($scope.meterdetails.ctRatio)) {
                                if($scope.meterdetails.ctRatio.includes('.')){
                                    if (($scope.meterdetails.ctRatio.match(/\./g)).length === 1) {
                                        let data = $scope.meterdetails.ctRatio.split('.');
                                        let majorVer = data[0];
                                        if (majorVer > 0 && majorVer <= 1000) {
                                            $scope.errorctRatio = false;
                                            $scope.errorctRatioMessage = '';
                                            $scope.meterCreation.ctRatio.$valid = true;
                                        } else {
                                            $scope.errorctRatio = true;
                                            $scope.errorctRatioMessage = 'Invalid CT Ratio!';
                                            $scope.meterCreation.ctRatio.$valid = false;
                                        }
                                    }
                                }
                                else {
                                    if ($scope.meterdetails.ctRatio > 0 && $scope.meterdetails.ctRatio <= 1000) {
                                        $scope.errorctRatio = false;
                                        $scope.errorctRatioMessage = '';
                                        $scope.meterCreation.ctRatio.$valid = true;
                                    } else {
                                        $scope.errorctRatio = true;
                                        $scope.errorctRatioMessage = 'Invalid CT Ratio!';
                                        $scope.meterCreation.ctRatio.$valid = false;
                                    }
                                }
                            } else {
                                $scope.errorctRatio = true;
                                $scope.errorctRatioMessage = 'Invalid CT Ratio!';
                                $scope.meterCreation.ctRatio.$valid = false;
                            }
                        } else {
                            $scope.errorctRatio = true;
                            $scope.errorctRatioMessage = 'CT Ratio is required!';
                            $scope.meterCreation.ctRatio.$valid = false;
                        }
                    } else if (field === 'ptRatio') {
                        if ($scope.meterdetails.ptRatio) {
                            if (ctptRatioFormat.test($scope.meterdetails.ptRatio)) {
                                if($scope.meterdetails.ptRatio.includes('.')){
                                    if (($scope.meterdetails.ptRatio.match(/\./g)).length === 1) {
                                        let data = $scope.meterdetails.ptRatio.split('.');
                                        let majorVer = data[0];
                                        if (majorVer > 0 && majorVer <= 1000) {
                                            $scope.errorptRatio = false;
                                            $scope.errorptRatioMessage = '';
                                            $scope.meterCreation.ptRatio.$valid = true;
                                        } else {
                                            $scope.errorptRatio = true;
                                            $scope.errorptRatioMessage = 'Invalid PT Ratio!';
                                            $scope.meterCreation.ptRatio.$valid = false;
                                        }
                                    }
                                }
                                else {
                                    if ($scope.meterdetails.ptRatio > 0 && $scope.meterdetails.ptRatio <= 1000) {
                                        $scope.errorptRatio = false;
                                        $scope.errorptRatioMessage = '';
                                        $scope.meterCreation.ptRatio.$valid = true;
                                    } else {
                                        $scope.errorptRatio = true;
                                        $scope.errorptRatioMessage = 'Invalid PT Ratio!';
                                        $scope.meterCreation.ptRatio.$valid = false;
                                    }
                                }
                            } else {
                                $scope.errorptRatio = true;
                                $scope.errorptRatioMessage = 'Invalid PT Ratio!';
                                $scope.meterCreation.ptRatio.$valid = false;
                            }
                        } else {
                            $scope.errorptRatio = true;
                            $scope.errorptRatioMessage = 'PT Ratio is required!';
                            $scope.meterCreation.ptRatio.$valid = false;
                        }

                    } else if (field === 'gprs') {
                        if ($scope.meterdetails.gprs === undefined || $scope.meterdetails.gprs.trim().length === 0) {
                            $scope.errorgprsMessage = 'GPRS is required!';
                            $scope.errorgprs = true;
                            $scope.meterCreation.gprs.$valid = false;
                        } else if ($scope.meterdetails.gprs.length > 30) {
                            $scope.errorgprsMessage =
                                'Length of GPRS should not exceed 30!';
                            $scope.errorgprs = true;
                            $scope.meterCreation.gprs.$valid = false;
                        } else {
                            $scope.errorgprs = false;
                            $scope.meterCreation.gprs.$valid = true;
                        }
                    } else if (field === 'latitude') {
                        if ($scope.meterdetails.latitude === undefined || $scope.meterdetails.latitude.trim().length === 0) {
                            $scope.errorlatitudeMessage = 'Latitude is required!';
                            $scope.errorlatitude = true;
                            $scope.meterCreation.latitude.$valid = false;
                        } else if (regLat.exec($scope.meterdetails.latitude)) {
                            $scope.errorlatitude = false;
                            $scope.meterCreation.latitude.$valid = true;
                        } else {
                            $scope.errorlatitudeMessage = 'Invalid Latitude! The range of latitude is 0 to +/- 90';
                            $scope.errorlatitude = true;
                            $scope.meterCreation.latitude.$valid = false;

                        }
                    } else if (field === 'longitude') {
                        if ($scope.meterdetails.longitude === undefined || $scope.meterdetails.longitude.trim().length === 0) {
                            $scope.errorlongitudeMessage = 'Longitude is required!';
                            $scope.errorlongitude = true;
                            $scope.meterCreation.longitude.$valid = false;
                        } else if (regLon.exec($scope.meterdetails.longitude)) {
                            $scope.errorlongitude = false;
                            $scope.meterCreation.longitude.$valid = true;
                        } else {
                            $scope.errorlongitudeMessage =
                                'Invalid Longitude! The range of' +
                                ' longitude is 0 to +/- 180';
                            $scope.errorlongitude = true;
                            $scope.meterCreation.longitude.$valid = false;
                        }
                    } else if (field === 'wifiMacId') {
                        $scope.meterdetails.wifiMacId = angular.isUndefinedOrNull($scope.meterdetails.wifiMacId) ? $scope.meterdetails.wifiMacId : $scope.meterdetails.wifiMacId.toLowerCase();
                        if ($scope.meterdetails.wifiMacId === undefined || $scope.meterdetails.wifiMacId.trim().length === 0) {
                            $scope.errorwifiMacIdMessage = 'Wifi MAC ID is required!';
                            $scope.errorwifiMacId = true;
                            $scope.meterCreation.wifiMacId.$valid = false;
                        } else if ($scope.meterdetails.wifiMacId.trim().length > 30) {
                            $scope.errorwifiMacIdMessage = 'Length of Wifi MAC ID must not be greater than 30!';
                            $scope.errorwifiMacId = true;
                            $scope.meterCreation.wifiMacId.$valid = false;
                        } else if (!(regMac.test($scope.meterdetails.wifiMacId) || regMac64.test($scope.meterdetails.wifiMacId))) {
                            $scope.errorwifiMacIdMessage = 'Invalid Wifi MAC ID!';
                            $scope.errorwifiMacId = true;
                            $scope.meterCreation.wifiMacId.$valid = false;
                        } else if (deviceService.checkMulticastMAC($scope.meterdetails.wifiMacId)) {
                            $scope.errorwifiMacIdMessage = 'Invalid MAC ID (Multicast)!';
                            $scope.errorwifiMacId = true;
                            $scope.meterCreation.wifiMacId.$valid = false;
                        } else {
                            $scope.errorwifiMacId = false;
                            $scope.meterCreation.wifiMacId.$valid = true;
                        }
                    } else if (field === 'wifiIpAdd') {
                        if ($scope.meterdetails.wifiIpAdd === undefined || $scope.meterdetails.wifiIpAdd.trim().length === 0) {
                            $scope.errorwifiIpAddMessage = 'Wifi IP Address is required!';
                            $scope.errorwifiIpAdd = true;
                            $scope.meterCreation.wifiIpAdd.$valid = false;
                        } else if (ipV4Reg.exec($scope.meterdetails.wifiIpAdd)) {
                            $scope.errorwifiIpAdd = false;
                            $scope.meterCreation.wifiIpAdd.$valid = true;
                        } else {
                            $scope.errorwifiIpAddMessage = 'Invalid Wifi IP Address!';
                            $scope.errorwifiIpAdd = true;
                            $scope.meterCreation.wifiIpAdd.$valid = false;
                        }
                    } else if (field === 'meterAdminPwd') {
                        if ($scope.meterdetails.meterAdminPwd === undefined || $scope.meterdetails.meterAdminPwd.trim().length === 0) {
                            $scope.errormeterAdminPwdMessage =
                                'Meter Admin Password is required!';
                            $scope.errormeterAdminPwd = true;
                            $scope.meterCreation.meterAdminPwd.$valid = false;
                        } else if ($scope.meterdetails.meterAdminPwd.length !== 20) {
                            $scope.errormeterAdminPwdMessage =
                                'Length of Meter Admin Password should be 20!';
                            $scope.errormeterAdminPwd = true;
                            $scope.meterCreation.meterAdminPwd.$valid = false;
                        } else {
                            $scope.errormeterAdminPwd = false;
                            $scope.meterCreation.meterAdminPwd.$valid = true;
                        }
                    } else if (field === 'wifiAccessPwd') {
                        if ($scope.meterdetails.wifiAccessPwd === undefined || $scope.meterdetails.wifiAccessPwd.trim().length === 0) {
                            $scope.errorwifiAccessPwdMessage =
                                'WiFi Access Password is required!';
                            $scope.errorwifiAccessPwd = true;
                            $scope.meterCreation.wifiAccessPwd.$valid = false;
                        } else if ($scope.meterdetails.wifiAccessPwd.length < 8 || $scope.meterdetails.wifiAccessPwd.length > 20) {
                            $scope.errorwifiAccessPwdMessage =
                                'Length of password should between 8 to 20!';
                            $scope.errorwifiAccessPwd = true;
                            $scope.meterCreation.wifiAccessPwd.$valid = false;
                        } else {
                            $scope.errorwifiAccessPwd = false;
                            $scope.meterCreation.wifiAccessPwd.$valid = true;
                        }
                        var spc = ' ()-_+~,.?=`/\{}[]^';
                        if (!angular.isUndefinedOrNull($scope.meterdetails.wifiAccessPwd)) {
                            for (var i = 0; i < spc.length; i++) {
                                if ($scope.meterdetails.wifiAccessPwd.indexOf(spc[i]) !== 'undefined' && $scope.meterdetails.wifiAccessPwd.indexOf(spc[i]) > -1) {
                                    $scope.errorwifiAccessPwdMessage = 'The character allowed for password are a-z, A-Z, 0-9 and !,@,#,$,%,&,*';
                                    $scope.errorwifiAccessPwd = true;
                                    $scope.meterCreation.wifiAccessPwd.$valid = false;
                                    break;
                                }
                            }
                        }
                    }
                    else if (field === 'consumerZipcode') {
                        if ($scope.meterdetails.consumerZipcode) {
                            if(zipCodeRegex.test($scope.meterdetails.consumerZipcode)) {
                                if ($scope.meterdetails.consumerZipcode.length < 4) {
                                  $scope.errorconsumerZipcodeMessage = 'Minimum Zip Code length should be 4!';
                                  $scope.errorconsumerZipcode = true;
                                  $scope.meterCreation.consumerZipcode.$valid = false;
                                } else {
                                  $scope.errorconsumerZipcodeMessage = '';
                                  $scope.errorconsumerZipcode = false;
                                  $scope.meterCreation.consumerZipcode.$valid = true;
                                }
                            } else {
                                $scope.errorconsumerZipcodeMessage = 'Invalid Zip Code!';
                                $scope.errorconsumerZipcode = true;
                                $scope.meterCreation.consumerZipcode.$valid = false;
                            }
                        } else {
                          $scope.errorconsumerZipcodeMessage = 'Zip Code is required!';
                          $scope.errorconsumerZipcode = true;
                          $scope.meterCreation.consumerZipcode.$valid = false;
                        }
                    } else if (field === 'billingTime') {
                        if ($scope.meterdetails.billingTime === undefined) {
                            swal('Undefined');
                        } else {
                            swal('Defined');
                        }
                    }
                    $scope.create_meter_valid = $scope.errormeterSl ||
                        $scope.errormeterVersion || $scope.errornominalCurrent ||
                        $scope.errormaximumCurrent || $scope.errorSealID ||
                        $scope.errorconsumerName || $scope.errorconsumerNumber ||
                        $scope.errorimpulseCountKW || $scope.errorimpulseCountKV ||
                        $scope.errorconsumerCountry || $scope.errorconsumerCity ||
                        $scope.errorctRatio || $scope.errorptRatio ||
                        $scope.errorgprs || $scope.errorlatitude ||
                        $scope.errorlongitude || $scope.errorwifiMacId ||
                        $scope.errorwifiIpAdd || $scope.errormeterAdminPwd ||
                        $scope.errorwifiAccessPwd || $scope.errorconsumerZipcode ||
                        $scope.errorcontactNumber || $scope.errorconsumerState || $scope.errorconsumerAddress;
                };

                /**
                 * @description
                 * Function to toggle password to hide/show the characters
                 *
                 * @param Nil
                 * @return Nil

                 */
                $scope.toggleShowPassword = function () {
                    $scope.showPassword = !$scope.showPassword;
                };

                $scope.showPassword2 = false;

                /**
                 * @description
                 * Function to toggle password to hide/show the characters
                 *
                 * @param Nil
                 * @return Nil

                */
                $scope.toggleShowPassword2 = function () {
                    $scope.showPassword2 = !$scope.showPassword2;
                };
                $scope.hstep = 1;
                $scope.mstep = 15;
                $scope.options = {
                    hstep: [1, 2, 3],
                    mstep: [1, 5, 10, 15, 25, 30]
                };
                $scope.ismeridian = true;

                /**
                 * @description
                 * Function to toggle meridian to AM/PM
                 *
                 * @param Nil
                 * @return Nil

                 */
                $scope.toggleMode = function () {
                    $scope.ismeridian = !$scope.ismeridian;
                };

                /**
                 * @description
                  * Function to update hours and minutes
                 *
                 * @param Nil
                 * @return Nil

                 */
                $scope.update = function () {
                    var d = new Date();
                    d.setHours(14);
                    d.setMinutes(0);
                    $scope.billingTime = d;
                };

                $scope.clear = function () {
                    $scope.billingTime;
                };
            }]);
})(window.angular);
