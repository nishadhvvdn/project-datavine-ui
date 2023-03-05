
/**
 * @description
 * Controller for Production Firmware
 */
(function (angular) {
    angular.module('dataVINEApp').controller('productionFirmwareCtrl',
        ['$scope', '$modalInstance', function ($scope, $modalInstance) {

            /**
             * Function to close pop-up
             */
            $scope.cancel = function () {
                $modalInstance.dismiss();
            };
            $scope.endpointCommModule = {
                "type": "select",
                "name": "commModule",
                "values": ["3.14", "4.14", "1.14", "4.16", "6.12"]
            };
            $scope.endpointHANModule = {
                "type": "select",
                "name": "hanMod",
                "values": ["0.2", "1.2", "2.2", "3.2", "4.2"]
            };
            $scope.endpointRegister = {
                "type": "select",
                "name": "endRegister",
                "values": ["1.0", "2.0", "3.0", "4.0", "5.0"]
            };
            $scope.relayRegister = {
                "type": "select",
                "name": "hyperRegister",
                "values": ["2.0", "5.0", "7.0", "9.0", "11.0"]
            };
        }]);
})(window.angular);