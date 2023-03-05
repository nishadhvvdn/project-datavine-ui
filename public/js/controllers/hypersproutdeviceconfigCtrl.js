/**
 * @description
 * Controller for Circuit Registration
 */
(function (angular) {
    "use strict";
    angular.module('dataVINEApp')
        .controller('hypersproutdeviceconfigCtrl',
        ['$state', '$scope', 'deviceType', '$sessionStorage',
        function ($state, $scope, deviceType,$sessionStorage) {
            if (deviceType === 'HyperSprout') {
                if (!angular.isUndefinedOrNull($state.current) &&
                    $state.current.name === 'system.hypersproutconfig') {
                    $state.go('system.hypersproutconfig.systeminformation');
                }
            } else {
                if (!angular.isUndefinedOrNull($state.current) &&
                $state.current.name === 'system.hyperhubconfig') {
                $state.go('system.hyperhubconfig.systeminformation');
            }
            }
            if ($sessionStorage.get('selectedSerialNumberConfig')) { 
                $scope.serialNumber = $sessionStorage.get('selectedSerialNumberConfig');
            } else {
                    $scope.serialNumber = "" ;
            }
                 /**
                 *  @description
                 * Go back to the parent transformer meter grouping
                 *
                 * @param Nil
                 * @return Nil
                 
                 */
                $scope.goBack = function () {
                    if (deviceType === 'HyperSprout') {
                        $state.go('system.registration.transformerEntry');
                    } else {
                        $state.go('system.registration.hyperHubEntry');
                    }
                    
                };
            }]);
})(window.angular);