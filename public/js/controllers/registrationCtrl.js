/**
 * @description
 * Controller for Circuit Registration
 */
(function (angular) {
    'use strict';
    angular.module('dataVINEApp')
        .controller('registrationCtrl', ['$state',
            function ($state) {
                if (!angular.isUndefinedOrNull($state.current) && $state.current.name === 'system.registration') {
                    $state.go('system.registration.circuitEntry');
                }                
            }]);
})(window.angular);