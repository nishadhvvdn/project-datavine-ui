/**
 * @description
 * Controller to handle Relay Details
 */
(function (angular) {
    "use strict";
    angular.module('dataVINEApp').controller('deviceRebootCtrl',
        ['$scope', '$modalInstance', '$timeout',"$uibModalStack",
            'SystemManagementService', 'type', "$state",
            function ($scope, $modalInstance, $uibModalStack, 
                $timeout, systemManagementService, type, $state) {
                init();
                $scope.deviceType = type;
                /**
                 * Function to initialize data for relay
                 */
                function init() {
                    if (!angular.isUndefinedOrNull(
                        objCacheDetails.data.systmDeviceMgmtDetails.selectedRow)) {
                            $scope.serialNumber =
                            objCacheDetails.data.systmDeviceMgmtDetails
                                .selectedRow["SerialNumber"];
                        $scope.deviceId =
                            objCacheDetails.data.systmDeviceMgmtDetails
                                .selectedRow["DeviceID"];
                        $scope.deviceRegistered =
                                objCacheDetails.data.systmDeviceMgmtDetails
                                    .selectedRow["Registered"];   
                    }
                }

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
                    if ($scope.deviceRegistered === "Yes") {
                    $modalInstance.dismiss();
                    var arrInputData = [$scope.deviceId, $scope.serialNumber, $scope.deviceType];
                    swal('Device Reboot in Process..');
                            systemManagementService
                            .deviceReboot(arrInputData)
                            .then(function (objData) {
                                if (angular.isUndefinedOrNull(objData.type)) {
                                    swal(objData);
                                } else if (objData.type) {
                                    swal(objData.Message);
                                    $modalInstance.dismiss();
                                    $state.reload();
                                } else if (!objData.type) {
                                    swal(objData.Message);
                                    $state.reload();
                                }
                            });
                    } else {
                        swal('Device Not Registered');
                        $modalInstance.dismiss();
                    }
                };
            }]);
})(window.angular);