/**
 * @description
 * Controller to handle Relay Details
 */
(function (angular) {
    "use strict";
    angular.module('dataVINEApp').controller('relayDetailsCtrl',
        ['$scope', '$modalInstance', '$timeout',
            'SystemManagementService', 'type',
            function ($scope, $modalInstance,
                $timeout, systemManagementService, type) {
                $scope.status = "Unknown";
                init();
                $scope.deviceType = type === 'HyperSprout' ? 'HyperSPROUT\u2122' : type === 'Hyperhub' ? 'HyperHUB\u2122' : type;
                if (type === 'Hyperhub')
                    type = 'HyperSprout';
                $scope.name = 'Node Ping';

                /**
                 * Function to initialize data for relay
                 */
                function init() {
                    if (!angular.isUndefinedOrNull(
                        objCacheDetails.data.systmDeviceMgmtDetails.selectedRow)) {
                        $scope.serialNumber =
                            objCacheDetails.data.systmDeviceMgmtDetails
                                .selectedRow["SerialNumber"];
                        $scope.hardwareVersion =
                            objCacheDetails.data.systmDeviceMgmtDetails
                                .selectedRow["Hardware Version"];
                        $scope.deviceClassId =
                            objCacheDetails.data.systmDeviceMgmtDetails
                                .selectedRow["DeviceClassId"];
                        $scope.esn = objCacheDetails.data
                            .systmDeviceMgmtDetails.selectedRow["ESN"];
                        $scope.createdDate = objCacheDetails.data
                            .systmDeviceMgmtDetails.selectedRow["CreatedTime"];
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
                $scope.requesting = false;

                /**
                 * @description
                 * Function to check the node status
                 *
                 * @param Nil 
                 * @return Nil
                 
                 */
                $scope.nodePing = function () {
                    $scope.requesting = true;
                    $scope.status = "Processing";
                    var serialNumber = (type === 'HyperSprout') ? objCacheDetails.data
                        .systmDeviceMgmtDetails.selectedRow["SerialNumber"] : objCacheDetails
                            .data.systmDeviceMgmtDetails.selectedRow["MeterID"];
                    if (objCacheDetails.env === 'clean') {
                        $timeout(function () {
                            $scope.status = "Connected";
                            $scope.requesting = false;
                        }, 3000);
                    } else {
                        systemManagementService
                            .getNodePingDetails(serialNumber, type)
                            .then(function (objData) {
                                if (!angular.isUndefinedOrNull(objData)) {
                                    if (objData.type) {
                                        $scope.status = objData.Output;
                                        $scope.requesting = false;
                                    } else {
                                        $scope.status = objData.Message;
                                        $scope.requesting = false;
                                    }
                                } else {
                                    $scope.status = "Failed to peform operation !! Try again";
                                    $scope.requesting = false;
                                }
                            });
                    }
                };
            }]);
})(window.angular);