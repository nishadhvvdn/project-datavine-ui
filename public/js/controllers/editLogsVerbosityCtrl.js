/**
 * @this vm
 * @ngdoc controller
 * @name dataVINEApp.controller:editLogsVerbosityCtrl
 *
 * @description
 * Controller to Editing logs verbosity
 */
(function (angular) {
    "use strict";
    angular.module('dataVINEApp')
        .controller('editLogsVerbosityCtrl', ['$scope', 'DeviceService',
            'deviceType', '$modalInstance', '$state', 'logs_verbosity', '$sessionStorage', 'commonService',
            function ($scope, deviceService, deviceType, $modalInstance,
                      $state, logs_verbosity, $sessionStorage, commonService) {
                let deviceID = $sessionStorage.get('selectedDeviceForLogs');
                $scope.verbosityLevel = "";
                let msgMatrix = {
                    1: 'Error - Enables only Error Logs',
                    2: 'Warning - Enable Error and Warning Logs',
                    3: 'Info - Enables Error, Warning and Info Logs',
                    4: 'Debug - Enables Error, Warning, Info and Debug Logs'
                }
                $scope.verbosity = 'error';
                let getParsedValue = {
                    meter: "Meter",
                    hyperhub: "HyperHub",
                    hypersprout: "HyperSprout",
                    deltalink: "DeltaLink"
                }
                let modalInstance = null;
                let modalInstanceNested = null;
                $scope.copyData = {};
                function initDeviceVerbosity(deviceType, deviceID) {
                    deviceService.getDeviceVerbosityDetails(getParsedValue[deviceType], deviceID)
                        .then(function (apiData) {
                            if (apiData && apiData.LogType && apiData.type ) {
                                $scope.verbosity = parseInt(apiData.LogType);
                                $scope.copyData = apiData.LogType.toString(10);
                            } else {
                                swal({
                                    title: commonService.addTrademark(apiData.message)
                                }, function () {
                                    $state.reload();
                                });
                            }
                        });
                }

                $scope.btnDisable = true;


                $scope.$watch('verbosity', function () {
                    $scope.verbosityLevel = msgMatrix[$scope.verbosity];
                    $scope.btnDisable = $scope.verbosity == $scope.copyData;
                }, true);

                initDeviceVerbosity(deviceType, deviceID);

                $scope.saveVerbosityDetails = function () {
                    $modalInstance.dismiss();
                    modalInstance = deviceService.openModalForLogs('Device Log Verbosity in Process...', false);
                    deviceService.setDeviceLogsVerbosity('VerbosityLogs', [
                        getParsedValue[deviceType],
                        deviceID,
                        parseInt($scope.verbosity)])
                        .then(function (objData) {
                            modalInstance.dismiss();
                            if (objData && objData.type) {
                                modalInstance.dismiss();
                                modalInstanceNested = deviceService.openModalForLogs(objData.Message, true)
                                modalInstanceNested.result.then(function () {
                                    $state.reload();
                                });
                            } else {
                                swal({
                                    title: commonService.addTrademark(objData.Message)
                                }, function () {
                                    $state.reload();
                                });
                            }
                        });
                };

                $scope.cancelModalWindow = function () {
                    $modalInstance.dismiss();
                };
            }
        ]);
})(window.angular);
