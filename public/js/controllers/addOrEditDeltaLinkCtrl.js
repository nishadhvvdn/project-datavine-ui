/**
 * @this vm
 * @ngdoc controller
 * @name dataVINEApp.controller:addOrEditDeltaLinkCtrl
 *
 * @description
 * Controller to Adding / Editing DeltaLinks
 */
(function (angular) {
    "use strict";
    angular.module('dataVINEApp')
        .controller('addOrEditDeltaLinkCtrl', ['$scope', 'DeviceService', 'type', '$modalInstance', '$state', 'commonService',
            function ($scope, deviceService, type, $modalInstance, $state, commonService) {
                $scope.type = type;

                let containsSpace = /\s/;
                var regMac = new RegExp(objCacheDetails.regEx.MAC_ID, "i");
                let regMac64 = /^([0-9a-fA-F]{2}[:]){7}([0-9a-fA-F]{2})$/;
                let deltaVerFormat = /^(?:^(?!0)\d{1,3})(?:\.\d{1,3})?$/;
                let pattern = /^[a-zA-Z0-9\s]+$/;
                let isNumbers = /^[0-9]+$/;
                if (type === 'edit') {
                    setTimeout(function () {
                        $scope.updateDeltaLinkDetailsCheck();
                    }, 100);
                }

                $scope.deltalinkDetails = {};
                if (type === 'edit') {
                    objCacheDetails.data.deltaLinkData.macID = objCacheDetails.data.deltaLinkData.macID.toLowerCase();
                    objCacheDetails.data.deltaLinkData.version = objCacheDetails.data.deltaLinkData.version === '-' ? '' : objCacheDetails.data.deltaLinkData.version;
                    $scope.deltalinkDetails = angular.copy(objCacheDetails.data.deltaLinkData);
                } else {
                    $scope.deltalinkDetails.bandwidth = '0';
                    $scope.deltalinkDetails.downloadBandwidth = '1';
                    $scope.deltalinkDetails.uploadBandwidth = '1';
                }
                setTimeout(function () {
                    $scope.deltalinkDetails.$dirty = false;
                }, 100);
                $scope.status = {
                    isFirstOpen: true
                };

                $scope.deltaLinkValidation = function (field) {
                    if (field === 'macID') {
                        $scope.deltalinkDetails.macID = angular.isUndefinedOrNull($scope.deltalinkDetails.macID) ? $scope.deltalinkDetails.macID : $scope.deltalinkDetails.macID.toLowerCase();
                        if ($scope.deltalinkDetails.macID) {
                            if (regMac.test($scope.deltalinkDetails.macID) || regMac64.test($scope.deltalinkDetails.macID)) {
                                if (deviceService.checkMulticastMAC($scope.deltalinkDetails.macID)) {
                                    $scope.errorMacIDMessage = 'Invalid MAC ID (Multicast)!';
                                    $scope.errorMacid = true;
                                    $scope.deltalinkForm.macID.$valid = false;
                                } else {
                                    $scope.errorMacid = false;
                                    $scope.errorMacIDMessage = '';
                                    $scope.deltalinkForm.macID.$valid = true;
                                }
                            } else {
                                $scope.errorMacIDMessage = 'Invalid WIFI MAC ID!';
                                $scope.errorMacid = true;
                                $scope.deltalinkForm.macID.$valid = false;
                            }
                        } else {
                            $scope.errorMacIDMessage = 'WIFI MAC ID is required!';
                            $scope.errorMacid = true;
                            $scope.deltalinkForm.macID.$valid = false;
                        }
                    } else if (field === 'deltaSl') {
                        if ($scope.deltalinkDetails.SerialNumber) {
                            if (!containsSpace.test($scope.deltalinkDetails.SerialNumber)) {
                                if (!pattern.test($scope.deltalinkDetails.SerialNumber)) {
                                    $scope.errorDeltaSlMessage = 'Invalid Serial Number!';
                                    $scope.errorDeltaSl = true;
                                    $scope.deltalinkForm.deltaSl.$valid = false;
                                } else if ($scope.deltalinkDetails.SerialNumber.length < 10 || $scope.deltalinkDetails.SerialNumber.length > 25) {
                                    $scope.errorDeltaSlMessage = 'Length of Serial Number range should be from 10 to 25!';
                                    $scope.errorDeltaSl = true;
                                    $scope.deltalinkForm.deltaSl.$valid = false;
                                }  else {
                                    $scope.errorDeltaSl = false;
                                    $scope.deltalinkForm.deltaSl.$valid = true;
                                }
                            } else {
                                $scope.errorDeltaSlMessage = 'Invalid Serial Number!';
                                $scope.errorDeltaSl = true;
                                $scope.deltalinkForm.deltaSl.$valid = false;
                            }
                        } else {
                            $scope.errorDeltaSlMessage = 'Serial Number is required!';
                            $scope.errorDeltaSl = true;
                            $scope.deltalinkForm.deltaSl.$valid = false;
                        }
                    } else if (field === 'version') {
                        if ($scope.deltalinkDetails.version) {
                            if (deltaVerFormat.test($scope.deltalinkDetails.version)) {
                                if ($scope.deltalinkDetails.version.includes('.')) {
                                    if (($scope.deltalinkDetails.version.match(/\./g)).length === 1) {
                                        let data = $scope.deltalinkDetails.version.split('.');
                                        let majorVer = data[0];
                                        let minorVer = data[1];
                                        if (majorVer == 255 && minorVer <= 255) {
                                            $scope.errorVersion = false;
                                            $scope.errorVersionMessage = '';
                                            $scope.deltalinkForm.version.$valid = true;
                                        } else if (majorVer > 0 && majorVer <= 254) {
                                            $scope.errorVersion = false;
                                            $scope.errorVersionMessage = '';
                                            $scope.deltalinkForm.version.$valid = true;
                                        } else {
                                            $scope.errorVersion = true;
                                            $scope.errorVersionMessage = 'Invalid version number!';
                                            $scope.deltalinkForm.version.$valid = false;
                                        }
                                    } else {
                                        $scope.errorVersion = true;
                                        $scope.errorVersionMessage = 'Invalid version number!';
                                        $scope.deltalinkForm.version.$valid = false;
                                    }
                                } else {
                                    if ($scope.deltalinkDetails.version > 0 && $scope.deltalinkDetails.version <= 255) {
                                        $scope.errorVersion = false;
                                        $scope.errorVersionMessage = '';
                                        $scope.deltalinkForm.version.$valid = true;
                                    } else {
                                        $scope.errorVersion = true;
                                        $scope.errorVersionMessage = 'Invalid version number!';
                                        $scope.deltalinkForm.version.$valid = false;
                                    }
                                }
                            } else {
                                $scope.errorVersion = true;
                                $scope.errorVersionMessage = 'Invalid version number!';
                                $scope.deltalinkForm.version.$valid = false;
                            }
                        } else {
                            $scope.errorVersion = false;
                            $scope.errorVersionMessage = '';
                            $scope.deltalinkForm.version.$valid = true;
                        }
                    } else if (field === 'downloadBandwidth') {
                        if ($scope.deltalinkDetails.downloadBandwidth) {
                            if(isNumbers.test($scope.deltalinkDetails.downloadBandwidth)) {
                                if ($scope.deltalinkDetails.downloadBandwidth <= 0 || $scope.deltalinkDetails.downloadBandwidth > 1000) {
                                    $scope.errorDownloadBandwidthMessage = 'Download bandwidth range should be in between 1-1000!';
                                    $scope.errorDownloadBandwidth = true;
                                    $scope.deltalinkForm.downloadBandwidth.$valid = false;
                                } else {
                                    $scope.errorDownloadBandwidthMessage = '';
                                    $scope.errorDownloadBandwidth = false;
                                    $scope.deltalinkForm.downloadBandwidth.$valid = true;
                                }
                            } else {
                                $scope.errorDownloadBandwidthMessage = 'Invalid Download bandwidth!';
                                $scope.errorDownloadBandwidth = true;
                                $scope.deltalinkForm.downloadBandwidth.$valid = false;
                            }
                        } else {
                            $scope.errorDownloadBandwidthMessage = 'Download Bandwidth is required!';
                            $scope.errorDownloadBandwidth = true;
                            $scope.deltalinkForm.downloadBandwidth.$valid = false;
                        }
                    }  else if (field === 'uploadBandwidth') {
                        if ($scope.deltalinkDetails.uploadBandwidth) {
                            if(isNumbers.test($scope.deltalinkDetails.uploadBandwidth)) {
                                if ($scope.deltalinkDetails.uploadBandwidth <= 0 || $scope.deltalinkDetails.uploadBandwidth > 1000) {
                                    $scope.errorUploadBandwidthMessage = 'Upload bandwidth range should be in between 1-1000!';
                                    $scope.errorUploadBandwidth = true;
                                    $scope.deltalinkForm.uploadBandwidth.$valid = false;
                                } else {
                                    $scope.errorUploadBandwidthMessage = '';
                                    $scope.errorUploadBandwidth = false;
                                    $scope.deltalinkForm.uploadBandwidth.$valid = true;
                                }
                            } else {
                                $scope.errorUploadBandwidthMessage = 'Invalid Upload bandwidth!';
                                $scope.errorUploadBandwidth = true;
                                $scope.deltalinkForm.uploadBandwidth.$valid = false;
                            }
                        } else {
                            $scope.errorUploadBandwidthMessage = 'Upload Bandwidth is required!';
                            $scope.errorUploadBandwidth = true;
                            $scope.deltalinkForm.uploadBandwidth.$valid = false;
                        }
                    }
                    $scope.deltaLink_valid = $scope.errorDeltaSl || $scope.errorVersion || $scope.errorMacid || $scope.errorDownloadBandwidth || $scope.errorUploadBandwidth;
                };

                $scope.btnDisable = true;
                $scope.$watch('deltalinkDetails', function() {
                    if (type === 'edit') {
                        delete $scope.deltalinkDetails.$dirty
                        $scope.btnDisable = JSON.stringify($scope.deltalinkDetails) === JSON.stringify(objCacheDetails.data.deltaLinkData);
                    }
                }, true);
                /**
                 * @description
                 *  Function to save the deltaLink details
                 *
                 * @param data - data to be saved
                 * @return Nil
                 */

                $scope.saveDeltaLinkDetails = function (data) {
                    deviceService.create('NewDeltalinkEntry', ['Add',
                        [$scope.deltalinkDetails.SerialNumber], [$scope.deltalinkDetails.version],
                        [$scope.deltalinkDetails.macID],
                        [$scope.deltalinkDetails.bandwidth],
                        [$scope.deltalinkDetails.downloadBandwidth],
                        [$scope.deltalinkDetails.uploadBandwidth],[]])
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
                 * Function to update the deltaLink details
                 *
                 * @return Nil
                 */
                let bandwidthModifiedFlag = 'N'
                $scope.updateDeltaLinkDetails = function () {
                    if(($scope.deltalinkDetails.bandwidth != objCacheDetails.data.deltaLinkData.bandwidth || $scope.deltalinkDetails.downloadBandwidth != objCacheDetails.data.deltaLinkData.downloadBandwidth || $scope.deltalinkDetails.uploadBandwidth != objCacheDetails.data.deltaLinkData.uploadBandwidth) && objCacheDetails.data.deltaLinkData.Registered === 'Yes') {
                        bandwidthModifiedFlag = 'Y';
                    } else {
                        bandwidthModifiedFlag = 'N';
                    }
                    deviceService.editDeltaLinkDetails('EditDeltalinkDetails',
                        [$scope.deltalinkDetails.DeltalinkID.toString(),
                            $scope.deltalinkDetails.SerialNumber,
                            $scope.deltalinkDetails.version,
                            $scope.deltalinkDetails.macID,
                            $scope.deltalinkDetails.bandwidth,
                            $scope.deltalinkDetails.downloadBandwidth,
                            $scope.deltalinkDetails.uploadBandwidth,
                            bandwidthModifiedFlag])
                        .then(function (objData) {
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

                $scope.updateDeltaLinkDetailsCheck = function () {
                    $scope.endPointFields = ['deltaSl', 'macID', 'version', 'downloadBandwidth', 'uploadBandwidth'];
                    if ($scope.endPointFields.length > 0) {
                        for (var i = 0; i < $scope.endPointFields.length; i++) {
                            $scope.deltaLinkValidation($scope.endPointFields[i]);
                        }
                    }
                };

                /**
                 * @description
                 * Function to close the modal
                 *
                 * @return Nil
                 */
                $scope.cancelModalWindow = function () {
                    $modalInstance.dismiss(false);
                };
                $scope.onchangeBandwidth = function (bandwidth) {
                    if(bandwidth === '1') {
                        if (type === 'edit') {
                            $scope.deltalinkDetails.downloadBandwidth = objCacheDetails.data.deltaLinkData.downloadBandwidth;
                            $scope.deltalinkDetails.uploadBandwidth = objCacheDetails.data.deltaLinkData.uploadBandwidth;
                            $scope.deltaLinkValidation('downloadBandwidth');
                            $scope.deltaLinkValidation('uploadBandwidth');
                        } else {
                            $scope.deltalinkDetails.downloadBandwidth = '1';
                            $scope.deltalinkDetails.uploadBandwidth = '1';
                        }
                    } else {
                        $scope.deltalinkDetails.downloadBandwidth = '1';
                        $scope.deltalinkDetails.uploadBandwidth = '1';
                        $scope.deltaLinkValidation('downloadBandwidth');
                        $scope.deltaLinkValidation('uploadBandwidth');
                    }
                }
            }
        ]);
})(window.angular);
