/**
 * @description
 * Controller for Circuit Registration
 */
(function (angular) {
    "use strict";
    angular.module('dataVINEApp')
        .controller('meterDeviceConfigCtrl',
        ['$state', '$scope', '$sessionStorage',
            function ($state, $scope, $sessionStorage) {
                if (!angular.isUndefinedOrNull($state.current) &&
                    $state.current.name === 'system.meterconfig') {
                    $state.go('system.meterconfig.systeminformation');
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
                    $state.go('system.registration.meterEntry');
                };
            }]);
})(window.angular);