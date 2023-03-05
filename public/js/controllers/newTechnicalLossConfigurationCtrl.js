/**
 * @description
 * Controller for addition or editing of Technical loss Configuration
 */
(function (angular) {
    "use strict";
    angular.module('dataVINEApp').controller('newTechnicalLossConfigurationCtrl',
        ['$modalInstance', '$uibModalStack', '$scope', '$uibModal', '$state', 'DeviceService', '$sessionStorage', 'type',
            function ($modalInstance, $uibModalStack, $scope, $uibModal, $state, deviceService, $sessionStorage, type) {
                let nameRegex = /^[A-Za-z0-9]+(?:\s?[A-Za-z0-9]+)*$/;
                let isNumber = /^(?:[1-9][0-9]*)$/;
                let kwhRegex = /^(?:\d{1,5})(?:\.\d{1,3})?$/;
                let technicalLossRecord = objCacheDetails.data.technicalLossData;

                $scope.transformerData = objCacheDetails.data.selectedTransformerForTechnicalLoss ? objCacheDetails.data.selectedTransformerForTechnicalLoss : $sessionStorage.get('selectedTransformerForTechnicalLoss');
                $scope.createUpdateStatus = type;
                $scope.technicalLossDetails = {};
                $scope.technicalLossDetails.usageTime = 'All Day';
                $scope.technicalLossDetails.startHour = "0";
                $scope.technicalLossDetails.endHour = "23";
                $scope.technicalLossDetails.metered = "true";

                let payloadFormatter = {
                    "All Day": "allDay",
                    "allDay": "All Day",
                    true: "true",
                    false: "false",
                    "Custom": "custom"
                }

                $scope.streetLightHours = ['0','1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12',
                    '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'];

                if ($scope.createUpdateStatus === 'edit') {
                    $scope.technicalLossDetails.technicalLossName = technicalLossRecord.Name;
                    $scope.technicalLossDetails.metered = payloadFormatter[technicalLossRecord.Metered];
                    $scope.technicalLossDetails.usagePerDay = technicalLossRecord.UsagePerDay;
                    $scope.technicalLossDetails.connectedItems = technicalLossRecord.ConnectedItems;
                    $scope.technicalLossDetails.usageTime = technicalLossRecord.UsageTime;
                    $scope.technicalLossDetails.startHour = technicalLossRecord.StartHour;
                    $scope.technicalLossDetails.endHour = technicalLossRecord.EndHour;

                    $scope.hideHoursFields = $scope.technicalLossDetails.usageTime === "Custom";

                    setTimeout(function () {
                        $scope.updateTechnicalDataCheck();
                    }, 200);
                } else {
                    $scope.hideHoursFields = false;
                }

                $scope.updateTechnicalDataCheck = function () {
                    $scope.technicalLossFields = ['technicalLossName', 'usagePerDay', 'connectedItems', 'startHour', 'endHour'];
                    if ($scope.technicalLossFields.length > 0) {
                        for (let i = 0; i < $scope.technicalLossFields.length; i++) {
                            $scope.technicalLossValidation($scope.technicalLossFields[i]);
                        }
                    }
                };

                $scope.addTechnicalDetails = function () {
                    if ($scope.technicalLossDetails.usageTime === 'All Day') {
                        $scope.technicalLossDetails.startHour = '0';
                        $scope.technicalLossDetails.endHour = '23'
                    }
                    deviceService.create('NewTransformerTechItemsEntry',
                        ['Add', [$scope.technicalLossDetails.technicalLossName],
                            [$scope.transformerData.transformerSl],
                            [$scope.technicalLossDetails.metered],
                            [$scope.technicalLossDetails.usagePerDay],
                            [$scope.technicalLossDetails.connectedItems],
                            [payloadFormatter[$scope.technicalLossDetails.usageTime]],
                            [$scope.technicalLossDetails.startHour],
                            [$scope.technicalLossDetails.endHour]
                        ])
                        .then(function (objData) {
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

                $scope.updateTechnicalDetails = function () {
                    if ($scope.technicalLossDetails.usageTime === 'All Day') {
                        $scope.technicalLossDetails.startHour = '0';
                        $scope.technicalLossDetails.endHour = '23'
                    }
                    deviceService.editTechnicalLossDetails([
                        $scope.technicalLossDetails.technicalLossName,
                        technicalLossRecord.TechnicalItemID,
                        $scope.transformerData.transformerSl,
                        $scope.technicalLossDetails.metered,
                        $scope.technicalLossDetails.usagePerDay,
                        $scope.technicalLossDetails.connectedItems,
                        payloadFormatter[$scope.technicalLossDetails.usageTime],
                        $scope.technicalLossDetails.startHour,
                        $scope.technicalLossDetails.endHour,
                    ]).then(function (objData) {
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


                $scope.cancel = function () {
                    $modalInstance.dismiss();
                    $uibModalStack.clearFocusListCache();
                };

                $scope.$watch('technicalLossDetails.usageTime', function () {
                    $scope.hideHoursFields = $scope.technicalLossDetails.usageTime === "Custom";
                }, true);

                $scope.technicalLossValidation = function (field) {
                    if (field === 'technicalLossName') {
                        if ($scope.technicalLossDetails.technicalLossName) {
                            if (nameRegex.test($scope.technicalLossDetails.technicalLossName)) {
                                if ($scope.technicalLossDetails.technicalLossName.length > 25) {
                                    $scope.errorTechnicalLossNameMessage = 'Length of Name must not be more than 25!';
                                    $scope.errorTechnicalLossName = true;
                                    $scope.technicalLossForm.technicalLossName.$valid = false;
                                } else {
                                    $scope.errorTechnicalLossName = false;
                                    $scope.technicalLossForm.technicalLossName.$valid = true;
                                }
                            } else {
                                $scope.errorTechnicalLossNameMessage = 'Invalid Name!';
                                $scope.errorTechnicalLossName = true;
                                $scope.technicalLossForm.technicalLossName.$valid = false;
                            }
                        } else {
                            $scope.errorTechnicalLossNameMessage = 'Name is required!';
                            $scope.errorTechnicalLossName = true;
                            $scope.technicalLossForm.technicalLossName.$valid = false;
                        }
                    } else if (field === 'usagePerDay') {
                        if ($scope.technicalLossDetails.usagePerDay) {
                            if (kwhRegex.test($scope.technicalLossDetails.usagePerDay)) {
                                if ($scope.technicalLossDetails.usagePerDay.includes('.')) {
                                    if (($scope.technicalLossDetails.usagePerDay.match(/\./g)).length === 1) {
                                        let data = $scope.technicalLossDetails.usagePerDay.split('.');
                                        let majorVal = data[0];
                                        let minorVal = data[1];
                                        if (majorVal == 0 && minorVal > 0) {
                                            $scope.errorUsagePerDay = false;
                                            $scope.errorUsagePerDayMessage = '';
                                            $scope.technicalLossForm.usagePerDay.$valid = true;
                                        } else if (majorVal > 0 && majorVal <= 65535) {
                                            $scope.errorUsagePerDay = false;
                                            $scope.errorUsagePerDayMessage = '';
                                            $scope.technicalLossForm.usagePerDay.$valid = true;
                                        } else {
                                            $scope.errorUsagePerDay = true;
                                            $scope.errorUsagePerDayMessage = 'Invalid Usage Per Day (kW)! The range of Usage Per Day (kW) is 0.001-65535.999!';
                                            $scope.technicalLossForm.usagePerDay.$valid = false;
                                        }
                                    } else {
                                        $scope.errorUsagePerDay = true;
                                        $scope.errorUsagePerDayMessage = 'Invalid Usage Per Day (kW)! The range of Usage Per Day (kW) is 0.001-65535.999!';
                                        $scope.technicalLossForm.usagePerDay.$valid = false;
                                    }
                                } else {
                                    if ($scope.technicalLossDetails.usagePerDay > 0 && $scope.technicalLossDetails.usagePerDay <= 65535) {
                                        $scope.errorUsagePerDay = false;
                                        $scope.errorUsagePerDayMessage = '';
                                        $scope.technicalLossForm.usagePerDay.$valid = true;
                                    } else {
                                        $scope.errorUsagePerDay = true;
                                        $scope.errorUsagePerDayMessage = 'Invalid Usage Per Day (kW)! The range of Usage Per Day (kW) is 0.001-65535.999!';
                                        $scope.technicalLossForm.usagePerDay.$valid = false;
                                    }
                                }
                            } else {
                                $scope.errorUsagePerDay = true;
                                $scope.errorUsagePerDayMessage = 'Invalid Usage Per Day (kW)! The range of Usage Per Day (kW) is 0.001-65535.999!';
                                $scope.technicalLossForm.usagePerDay.$valid = false;

                            }
                        } else {
                            $scope.errorUsagePerDayMessage = 'Usage Per Day (kW) is required!';
                            $scope.errorUsagePerDay = true;
                            $scope.technicalLossForm.usagePerDay.$valid = false;
                        }
                    } else if (field === 'connectedItems') {
                        if ($scope.technicalLossDetails.connectedItems) {
                            if (isNumber.test($scope.technicalLossDetails.connectedItems)) {
                                if ($scope.technicalLossDetails.connectedItems <= 0 || $scope.technicalLossDetails.connectedItems > 99999) {
                                    $scope.errorConnectedItemsMessage = 'Connected items range should be in between 1-99999!';
                                    $scope.errorConnectedItems = true;
                                    $scope.technicalLossForm.connectedItems.$valid = false;
                                } else {
                                    $scope.errorConnectedItems = false;
                                    $scope.errorConnectedItemsMessage = '';
                                    $scope.technicalLossForm.connectedItems.$valid = true;
                                }
                            } else {
                                $scope.errorConnectedItemsMessage = 'Connected items range should be in between 1-99999';
                                $scope.errorConnectedItems = true;
                                $scope.technicalLossForm.connectedItems.$valid = false;
                            }
                        } else {
                            $scope.errorConnectedItemsMessage = 'Connected items is required!';
                            $scope.errorConnectedItems = true;
                            $scope.technicalLossForm.connectedItems.$valid = false;
                        }
                    } else if (field === 'startHour') {
                        if ($scope.technicalLossDetails.startHour) {
                            if ($scope.technicalLossDetails.startHour >= 0 && $scope.technicalLossDetails.startHour <= 23) {
                                $scope.errorStartHourMessage = '';
                                $scope.errorStartHour = false;
                                $scope.technicalLossForm.startHour.$valid = true;
                            } else {
                                $scope.errorStartHourMessage = 'Invalid Start Hour';
                                $scope.errorStartHour = true;
                                $scope.technicalLossForm.startHour.$valid = false;
                            }
                        } else {
                            $scope.errorStartHourMessage = 'Start Hour is required!';
                            $scope.errorStartHour = true;
                            $scope.technicalLossForm.startHour.$valid = false;
                        }
                    } else if (field === 'endHour') {
                        if ($scope.technicalLossDetails.endHour) {
                            if ($scope.technicalLossDetails.endHour >= 0 && $scope.technicalLossDetails.endHour <= 23) {
                                $scope.errorEndHourMessage = '';
                                $scope.errorEndHour = false;
                                $scope.technicalLossForm.endHour.$valid = true;
                            } else {
                                $scope.errorEndHourMessage = 'Invalid End Hour';
                                $scope.errorEndHour = true;
                                $scope.technicalLossForm.endHour.$valid = false;
                            }
                        } else {
                            $scope.errorEndHourMessage = 'End Hour is required!';
                            $scope.errorEndHour = true;
                            $scope.technicalLossForm.endHour.$valid = false;
                        }
                    }
                    $scope.vaild_entry =
                        $scope.errorTechnicalLossName ||
                        $scope.errorUsagePerDay ||
                        $scope.errorConnectedItems
                };

                $scope.formMsg = function () {
                    $scope.errorStartHourMessage = '';
                    $scope.errorEndHourMessage = '';
                    $scope.errorStartHour = false;
                    $scope.errorEndHour = false;
                    $scope.technicalLossForm.startHour.$valid = true;
                    $scope.technicalLossForm.endHour.$valid = true;
                }

                $scope.oneAtATime = true;
                $scope.status = {
                    isCustomHeaderOpen: false,
                    isFirstOpen: true,
                    isFirstDisabled: false
                };

            }]);
})(window.angular);
