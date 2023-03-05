/**
 * @description
 * Controller to handle Relay Details
 */
(function (angular) {
    'use strict';
    angular.module('dataVINEApp').controller('deviceFactoryResetCtrl',
        ['$scope', '$modalInstance', '$uibModalStack', '$timeout',
            'SystemManagementService', 'type', '$state', 'commonService',
            function ($scope, $modalInstance, $uibModalStack, 
                $timeout, systemManagementService, type, $state, commonService) {
                
                $scope.deviceType = type;
                $scope.resetType = 'shallow';
                /**
                 * Function to initialize data for relay
                 */
                function init() {
                    if (!angular.isUndefinedOrNull(
                        objCacheDetails.data.systmDeviceMgmtDetails.selectedRow)) {
                            $scope.serialNumber =
                            objCacheDetails.data.systmDeviceMgmtDetails
                                .selectedRow['SerialNumber'];
                        $scope.deviceId =
                            objCacheDetails.data.systmDeviceMgmtDetails
                                .selectedRow['DeviceID'];
                        $scope.deviceRegistered =
                                objCacheDetails.data.systmDeviceMgmtDetails
                                    .selectedRow['Registered'];   
                    }
                }

                init();

                /**
                 *  @description
                 * Function to close pop-up
                 *
                 * @param Nil 
                 * @return Nil
                
                 */
                $scope.cancel = function () {
                    $modalInstance.dismiss();
                };

                /**
                 * @description
                 * Function to check the node status
                 *
                 * @param Nil 
                 * @return Nil
                 
                 */
                $scope.deviceReboot = function () {
                    if ($scope.deviceRegistered === 'Yes') {
                    $modalInstance.dismiss();
                    var arrInputData = [$scope.deviceId, $scope.serialNumber, $scope.deviceType, $scope.resetType];
                    swal('Device Factory Reset in Process..');
                            systemManagementService
                            .deviceFacoryReset(arrInputData)
                            .then(function (objData) {
                                if (angular.isUndefinedOrNull(objData.type)) {
                                    swal(objData);
                                } else if (objData.type) {
                                    $state.reload();
                                } else if (!objData.type) {
                                    swal(commonService.addTrademark(objData.Message));
                                    $state.reload();
                                }
                            });
                    } else {
                        swal('Device Not Registerd');
                        $modalInstance.dismiss();
                    }
                };
            }]);
})(window.angular);