/**
  * @this vm
  * @ngdoc controller
  * @name dataVINEApp.controller:addOrEditHyperHubCtrl
  *
  * @description
  *  Controller for Adding / Editing Hyperhub
*/
(function (angular) {
    "use strict";
    angular.module('dataVINEApp')
        .controller('addOrEditHyperHubCtrl', ['$scope', 'DeviceService',
            'type', '$modalInstance', '$state', 'commonService',
            function ($scope, deviceService, type, $modalInstance, $state, commonService) {
                $scope.type = type;
                $scope.oneAtATime = true;
                var hypherSproutPassword = null;
                if (type === 'edit') {
                    setTimeout(function () {
                        $scope.updateHyperHubCheck();
                    }, 100);
                }
                $scope.hyperHubDetails = {};

                var regMac = new RegExp(objCacheDetails.regEx.MAC_ID, "i");
                var regMac64 = /^([0-9a-fA-F]{2}[:]){7}([0-9a-fA-F]{2})$/;
                var ipV4Reg = new RegExp('^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$');
                var regLat = new RegExp("^(\\+|-)?(?:90(?:(?:\\.0{1,6})?)|(?:[0-9]|[1-8][0-9])(?:(?:\\.[0-9]{1,6})?))$");
                var regLon = new RegExp("^(\\+|-)?(?:180(?:(?:\\.0{1,6})?)|(?:[0-9]|[1-9][0-9]|1[0-7][0-9])(?:(?:\\.[0-9]{1,6})?))$");
                var hardwareVerRegex = /^(?:^(?!0)\d{1,3})(?:\.\d{1,3})?$/;
                let pattern = /^[a-zA-Z0-9\s]+$/;
                let HyperhubNameRegex = /^[A-Za-z0-9]+(?:\s?[A-Za-z0-9]+)*$/;
                var containsSpace = /\s/;
                if (type === 'edit') {
                    $scope.editWifi = true;
                    $scope.hyperHubDetails = angular.copy(objCacheDetails.data.hyperHubData);
                    hypherSproutPassword = objCacheDetails.data.hyperHubData.WifiAccessPointPassword;
                    $scope.hyperHubDetails.Latitude = ($scope.hyperHubDetails.Latitude).toString();
                    $scope.hyperHubDetails.Longitude = ($scope.hyperHubDetails.Longitude).toString();
                    $scope.hyperHubStatus = $scope.hyperHubDetails.Status;
                } else {
                    $scope.editWifi = false;
                    $scope.hyperHubDetails.WifiAccessPointPassword = '00000000';
                    $scope.hyperHubStatus = 'NonRegistered';
                }
                $scope.status = {
                    isCustomHeaderOpen: false,
                    isFirstOpen: true,
                    isFirstDisabled: false
                };
                /**
                  * @description
                  * Function to add Hyperhub
                  *
                  * @param data - Hyperhub data
                  * @return Nil
                */
                $scope.saveHyperHub = function (data) {
                    $scope.hyperHubDetails = data;
                    deviceService.create('NewHyperHubEntry', [[$scope.hyperHubDetails.HubSerialNumber],
                    [$scope.hyperHubDetails.HubName], [$scope.hyperHubDetails.HardwareVersion],
                    [$scope.hyperHubDetails.GprsMacID], [$scope.hyperHubDetails.WifiMacID],
                    [$scope.hyperHubDetails.WifiIPAddress],
                    [$scope.hyperHubDetails.WifiAccessPointPassword],
                    [parseFloat($scope.hyperHubDetails.Latitude).toString()],
                    [parseFloat($scope.hyperHubDetails.Longitude).toString()],
                    [$scope.hyperHubDetails.SimCardNumber],[], 'Add'])
                        .then(function (objData) {
                            var isSuccess = deviceService.validateSuccess(objData);
                            if(isSuccess) {
                                if(objData.Message) {
                                    swal(commonService.addTrademark(objData.Message));
                                    $modalInstance.dismiss(true);
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
                 * Function to update Hyperhub details
                 *
                 * @param Nil
                 * @return Nil
               */
                $scope.updateHyperHubCheck = function () {
                    $scope.hyperHubFields = ['hyperSerial' , 'HubName' , 'HardwareVersion' , 'longitude' , 'latitude' ,
                                        'macid' , 'gprsMacID' , 'ip' , 'simCardNumber'];
                    if ($scope.hyperHubStatus === 'Registered') {
                        $scope.hyperHubFields.push("wifi");
                    }
                    if ($scope.hyperHubFields.length > 0) {
                        for (var i = 0; i < $scope.hyperHubFields.length; i++) {
                            $scope.hyperHubValidation($scope.hyperHubFields[i]);
                        }
                    }
                };

                $scope.updateHyperHub = function () {
                    $scope.hyperHubDetails.HHWifiPassFlag =
                        $scope.hyperHubDetails.WifiAccessPointPassword === hypherSproutPassword ? 'N' : 'Y';
                    $scope.hyperHubDetails.Longitude = ($scope.hyperHubDetails.Longitude).toString();
                    $scope.hyperHubDetails.Latitude = ($scope.hyperHubDetails.Latitude).toString();
                    deviceService.editHyperHub($scope.hyperHubDetails).then(function (objData) {
                        var isSuccess = deviceService.validateSuccess(objData);
                        if(isSuccess) {
                            if(objData.Message) {
                                swal(commonService.addTrademark(objData.Message));
                                $modalInstance.dismiss(true);
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
                 * @description
                 * Function to close the pop-up
                 *
                 * @param Nil
                 * @return Nil
               */
                $scope.cancelModalWindow = function () {
                    $modalInstance.dismiss(false);
                };
                /**
                  * @description
                  * Function to validate Hyperhub details
                  *
                  * @param field - field name
                  * @return Nil
                */
                $scope.hyperHubValidation = function (field) {
                    if (field === 'hyperSerial') {
                        if($scope.hyperHubDetails.HubSerialNumber) {
                            if(!containsSpace.test($scope.hyperHubDetails.HubSerialNumber)) {
                                if ($scope.hyperHubDetails.HubSerialNumber === undefined ||
                                    $scope.hyperHubDetails.HubSerialNumber.trim().length === 0) {
                                    $scope.errorMessageHHSl = 'HyperHUB\u2122 Serial is required!';
                                    $scope.errorHHSl = true;
                                    $scope.hyperHub.hyperSerial.$valid = false;
                                } else if (!pattern.test($scope.hyperHubDetails.HubSerialNumber)) {
                                    $scope.errorMessageHHSl = 'Invalid HyperHUB\u2122 Serial!';
                                    $scope.errorHHSl = true;
                                    $scope.hyperHub.hyperSerial.$valid = false;
                                } else if ($scope.hyperHubDetails.HubSerialNumber.length < 10 || $scope.hyperHubDetails.HubSerialNumber.length > 25) {
                                    $scope.errorMessageHHSl =
                                        'Length of HyperHUB\u2122 Serial Number range should be from 10 to 25!';
                                    $scope.errorHHSl = true;
                                    $scope.hyperHub.hyperSerial.$valid = false;
                                } else {
                                    $scope.errorHHSl = false;
                                    $scope.hyperHub.hyperSerial.$valid = true;
                                }
                            } else {
                                $scope.errorMessageHHSl = 'Invalid HyperHUB\u2122 Serial!';
                                $scope.errorHHSl = true;
                                $scope.hyperHub.hyperSerial.$valid = false;
                            }
                        } else {
                            $scope.errorMessageHHSl = 'HyperHUB\u2122 Serial is required!';
                            $scope.errorHHSl = true;
                            $scope.hyperHub.hyperSerial.$valid = false;
                        }

                    } else if (field === 'HubName') {
                        if($scope.hyperHubDetails.HubName) {
                            if(HyperhubNameRegex.test($scope.hyperHubDetails.HubName)) {
                                if ($scope.hyperHubDetails.HubName === undefined ||
                                    $scope.hyperHubDetails.HubName.trim().length === 0) {
                                    $scope.errorMessageHubName = 'Hub Name is required!';
                                    $scope.errorHubName = true;
                                    $scope.hyperHub.HubName.$valid = false;
                                } else if ($scope.hyperHubDetails.HubName.length > 25) {
                                    $scope.errorMessageHubName =
                                        'Length of Hub Name must not be more than 25!';
                                    $scope.errorHubName = true;
                                    $scope.hyperHub.HubName.$valid = false;
                                } else {
                                    $scope.errorHubName = false;
                                    $scope.hyperHub.HubName.$valid = true;
                                }
                            } else {
                                $scope.errorMessageHubName = 'Invalid Hub Name!';
                                $scope.errorHubName = true;
                                $scope.hyperHub.HubName.$valid = false;
                                }
                            } else {
                            $scope.errorMessageHubName = 'Hub Name is required!';
                            $scope.errorHubName = true;
                            $scope.hyperHub.HubName.$valid = false;
                            }
                    }
                    else if (field === 'HardwareVersion') {
                        if ($scope.hyperHubDetails.HardwareVersion) {
                            if (hardwareVerRegex.test($scope.hyperHubDetails.HardwareVersion)) {
                                if ($scope.hyperHubDetails.HardwareVersion.includes('.')) {
                                    if (($scope.hyperHubDetails.HardwareVersion.match(/\./g)).length === 1) {
                                        let data = $scope.hyperHubDetails.HardwareVersion.split('.');
                                        let majorVer = data[0];
                                        let minorVer = data[1];
                                        if (majorVer == 255 && minorVer <= 255) {
                                            $scope.errorHardwareVersion = false;
                                            $scope.errorMessageHardwareVersion = '';
                                            $scope.hyperHub.HardwareVersion.$valid = true;
                                        } else if (majorVer > 0 && majorVer <= 254) {
                                            $scope.errorHardwareVersion = false;
                                            $scope.errorMessageHardwareVersion = '';
                                            $scope.hyperHub.HardwareVersion.$valid = true;
                                        } else {
                                            $scope.errorHardwareVersion = true;
                                            $scope.errorMessageHardwareVersion = 'Invalid version number!';
                                            $scope.hyperHub.HardwareVersion.$valid = false;
                                        }
                                    } else {
                                        $scope.errorHardwareVersion = true;
                                        $scope.errorMessageHardwareVersion = 'Invalid version number!';
                                        $scope.hyperHub.HardwareVersion.$valid = false;
                                    }
                                } else {
                                    if ($scope.hyperHubDetails.HardwareVersion > 0 && $scope.hyperHubDetails.HardwareVersion <= 255) {
                                        $scope.errorHardwareVersion = false;
                                        $scope.errorMessageHardwareVersion = '';
                                        $scope.hyperHub.HardwareVersion.$valid = true;
                                    } else {
                                        $scope.errorHardwareVersion = true;
                                        $scope.errorMessageHardwareVersion = 'Invalid version number!';
                                        $scope.hyperHub.HardwareVersion.$valid = false;
                                    }
                                }
                            } else {
                                $scope.errorHardwareVersion = true;
                                $scope.errorMessageHardwareVersion = 'Invalid version number!';
                                $scope.hyperHub.HardwareVersion.$valid = false;
                            }
                        } else {
                            $scope.errorHardwareVersion = true;
                            $scope.errorMessageHardwareVersion = 'Hardware Version is required!';
                            $scope.hyperHub.HardwareVersion.$valid = false;
                        }
                    }
                    else if (field === 'longitude') {
                        if ($scope.hyperHubDetails.Longitude === undefined ||
                            $scope.hyperHubDetails.Longitude.trim().length === 0) {
                            $scope.errorlongitudeMessage = 'Longitude is required!';
                            $scope.errorlongitude = true;
                            $scope.hyperHub.longitude.$valid = false;
                        } else if (regLon.exec($scope.hyperHubDetails.Longitude)) {
                            $scope.errorlongitude = false;
                            $scope.hyperHub.longitude.$valid = true;
                        } else {
                            $scope.errorlongitudeMessage = 'Invalid Longitude! The range ' +
                                'of longitude is 0 to +/- 180';
                            $scope.errorlongitude = true;
                            $scope.hyperHub.longitude.$valid = false;
                        }
                    } else if (field === 'latitude') {
                        if ($scope.hyperHubDetails.Latitude === undefined ||
                            $scope.hyperHubDetails.Latitude.trim().length === 0) {
                            $scope.errorlatitudeMessage = 'Latitude is required!';
                            $scope.errorlatitude = true;
                            $scope.hyperHub.latitude.$valid = false;
                        } else if (regLat.exec($scope.hyperHubDetails.Latitude)) {
                            $scope.errorlatitude = false;
                            $scope.hyperHub.latitude.$valid = true;
                        } else {
                            $scope.errorlatitudeMessage =
                                'Invalid Latitude! The range of latitude is 0 to +/- 90';
                            $scope.errorlatitude = true;
                            $scope.hyperHub.latitude.$valid = false;
                        }
                    }
                    if (field === 'macid') {
                        $scope.hyperHubDetails.WifiMacID = angular.isUndefinedOrNull($scope.hyperHubDetails.WifiMacID) ? $scope.hyperHubDetails.WifiMacID : $scope.hyperHubDetails.WifiMacID.toLowerCase();
                        if (!$scope.hyperHubDetails.WifiMacID || $scope.hyperHubDetails.WifiMacID.trim().length === 0) {
                            $scope.errorMacIDMessage = 'Wifi MAC ID is required!';
                            $scope.errorMacid = true;
                            $scope.hyperHub.WifiMacID.$valid = false;
                        } else if (!(regMac.test($scope.hyperHubDetails.WifiMacID) || regMac64.test($scope.hyperHubDetails.WifiMacID))) {
                            $scope.errorMacIDMessage = 'Invalid Wifi MAC ID!';
                            $scope.errorMacid = true;
                            $scope.hyperHub.WifiMacID.$valid = false;
                        } else if (deviceService.checkMulticastMAC($scope.hyperHubDetails.WifiMacID)) {
                            $scope.errorMacIDMessage = 'Invalid MAC ID (Multicast)!';
                            $scope.errorMacid = true;
                            $scope.hyperHub.WifiMacID.$valid = false;
                        } else if ($scope.hyperHubDetails.WifiMacID === $scope.hyperHubDetails.GprsMacID) {
                            $scope.errorMacIDMessage = 'WIFI and GPRS MAC ID should not be same!';
                            $scope.errorMacid = true;
                            $scope.hyperHub.WifiMacID.$valid = false;
                        }
                        else {
                            $scope.errorMacid = false;
                            $scope.hyperHub.WifiMacID.$valid = true;
                            if($scope.hyperHubDetails.GprsMacID && (regMac.test($scope.hyperHubDetails.GprsMacID) || regMac64.test($scope.hyperHubDetails.GprsMacID))) {
                                if(deviceService.checkMulticastMAC($scope.hyperHubDetails.GprsMacID)) {
                                    $scope.errorgprsMacIDMessage = 'Invalid MAC ID (Multicast)!';
                                    $scope.hyperHub.GprsMacID.$valid = false;
                                    $scope.errorgprsMacid = true;
                                } else {
                                    $scope.hyperHub.GprsMacID.$valid = true;
                                    $scope.errorgprsMacid = false;
                                }
                            } else {
                                $scope.hyperHub.GprsMacID.$valid = false;
                                $scope.errorgprsMacid = true;
                            }
                        }
                    }
                    if (field === 'gprsMacID') {
                        $scope.hyperHubDetails.GprsMacID = angular.isUndefinedOrNull($scope.hyperHubDetails.GprsMacID) ? $scope.hyperHubDetails.GprsMacID : $scope.hyperHubDetails.GprsMacID.toLowerCase();
                        if (!$scope.hyperHubDetails.GprsMacID || $scope.hyperHubDetails.GprsMacID.trim().length === 0) {
                            $scope.errorgprsMacIDMessage = 'GPRS MAC ID is required!';
                            $scope.errorgprsMacid = true;
                            $scope.hyperHub.GprsMacID.$valid = false;
                        } else if (!(regMac.test($scope.hyperHubDetails.GprsMacID) || regMac64.test($scope.hyperHubDetails.GprsMacID))) {
                            $scope.errorgprsMacIDMessage = 'Invalid GPRS MAC ID!';
                            $scope.errorgprsMacid = true;
                            $scope.hyperHub.GprsMacID.$valid = false;
                        } else if (deviceService.checkMulticastMAC($scope.hyperHubDetails.GprsMacID)) {
                            $scope.errorgprsMacIDMessage = 'Invalid MAC ID (Multicast)!';
                            $scope.errorgprsMacid = true;
                            $scope.hyperHub.GprsMacID.$valid = false;
                        } else if ($scope.hyperHubDetails.GprsMacID === $scope.hyperHubDetails.WifiMacID) {
                            $scope.errorgprsMacIDMessage = 'GPRS and WIFI MAC ID should not be same!';
                            $scope.errorgprsMacid = true;
                            $scope.hyperHub.GprsMacID.$valid = false;
                        }
                        else {
                            $scope.errorgprsMacid = false;
                            $scope.hyperHub.GprsMacID.$valid = true;
                            if($scope.hyperHubDetails.WifiMacID && (regMac.test($scope.hyperHubDetails.WifiMacID) || regMac64.test($scope.hyperHubDetails.WifiMacID))){
                                if(deviceService.checkMulticastMAC($scope.hyperHubDetails.WifiMacID)) {
                                    $scope.errorgprsMacIDMessage = 'Invalid MAC ID (Multicast)!';
                                    $scope.hyperHub.WifiMacID.$valid = false;
                                    $scope.errorMacid = true;
                                } else {
                                    $scope.hyperHub.WifiMacID.$valid = true;
                                    $scope.errorMacid = false;
                                }
                            } else {
                                $scope.hyperHub.WifiMacID.$valid = false;
                                $scope.errorMacid = true;
                            }
                        }
                    }
                    if (field === 'ip') {
                        if ($scope.hyperHubDetails.WifiIPAddress === undefined ||
                            $scope.hyperHubDetails.WifiIPAddress.trim().length === 0) {
                            $scope.erroripMessage = 'Wifi IP Address is required!';
                            $scope.errorip = true;
                            $scope.hyperHub.WifiIPAddress.$valid = false;
                        } else if (ipV4Reg.exec($scope.hyperHubDetails.WifiIPAddress)) {
                            $scope.errorip = false;
                            $scope.hyperHub.WifiIPAddress.$valid = true;
                        } else {
                            $scope.erroripMessage = 'Invalid Wifi IP Address!';
                            $scope.errorip = true;
                            $scope.hyperHub.WifiIPAddress.$valid = false;
                        }
                    } else if (field === 'simCardNumber') {
                        if (!$scope.hyperHubDetails.SimCardNumber) {
                            $scope.errorsimCardMessage = 'Sim Card is required!';
                            $scope.errorsimCard = true;
                            $scope.hyperHub.SimCardNumber.$valid = false;
                        } else if ($scope.hyperHubDetails.SimCardNumber.length < 10 ||
                            $scope.hyperHubDetails.SimCardNumber.length > 10) {
                            $scope.errorsimCardMessage = 'SIM Card length should be 10!';
                            $scope.errorsimCard = true;
                            $scope.hyperHub.SimCardNumber.$valid = false;
                        } else {
                            $scope.errorsimCard = false;
                            $scope.hyperHub.SimCardNumber.$valid = true;
                        }
                    } else if (field === 'wifi') {
                        if ($scope.hyperHubDetails.WifiAccessPointPassword === undefined ||
                            $scope.hyperHubDetails.WifiAccessPointPassword.trim().length === 0) {
                            $scope.errorwifiAccessPwdMessage = 'Password is required!';
                            $scope.errorWifiAccessPwd = true;
                            $scope.hyperHub.WifiAccessPointPassword.$valid = false;
                        } else if ($scope.hyperHubDetails.WifiAccessPointPassword.length < 8 ||
                            $scope.hyperHubDetails.WifiAccessPointPassword.length > 20) {
                            $scope.errorwifiAccessPwdMessage = 'Length of password should between 8 to 20!';
                            $scope.errorWifiAccessPwd = true;
                            $scope.hyperHub.WifiAccessPointPassword.$valid = false;
                        } else {
                            $scope.errorWifiAccessPwd = false;
                            $scope.hyperHub.WifiAccessPointPassword.$valid = true;
                        }
                        var spclist = ' ()-_+~,.?=`/\{}[]^';
                        if (!angular.isUndefinedOrNull($scope.hyperHubDetails.wifiAccessPwd)) {
                            for (var i = 0; i < spclist.length; i++) {
                                if ($scope.hyperHubDetails.WifiAccessPointPassword
                                    .indexOf(spclist[i]) !== 'undefined' &&
                                    $scope.hyperHubDetails.WifiAccessPointPassword
                                        .indexOf(spclist[i]) > -1) {
                                    $scope.errorwifiAccessPwdMessage = 'The character ' +
                                        'allowed for password are a-z, A-Z, 0-9 and !,@,#,$,%,&,*';
                                    $scope.errorWifiAccessPwd = true;
                                    $scope.hyperHub.WifiAccessPointPassword.$valid = false;
                                    break;
                                }
                            }
                        }
                    }
                    $scope.create_hyperhub_valid = $scope.errorHHSl || $scope.errorWifiAccessPwd || $scope.errorHardwareVersion ||
                        $scope.errorsimCard || $scope.errorip || $scope.errorgprsMacid || $scope.errorHubName ||
                        $scope.errorMacid || $scope.errorlongitude || $scope.errorlatitude;
                };

                /**
                 * Function to toggle the display and hide of password field
                 * for wifi password
                 */
                $scope.showWifiPassword = false;
                /**
                  * @description
                  * Description
                  * Function to toggle the display and hide of password field
                  * for wifi password
                  * @param Nil
                  * @return Nil
                */
                $scope.toggleWifiPassword = function () {
                    $scope.showWifiPassword = !$scope.showWifiPassword;
                };
            }
        ]);
})(window.angular);
