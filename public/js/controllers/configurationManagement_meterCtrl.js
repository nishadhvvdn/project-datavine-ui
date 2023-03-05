/**
 * Controller for configuration management
 * @description
 */
(function (angular) {
    'use strict';
    angular.module('dataVINEApp')
        .controller('configurationManagement_meterCtrl', ['$location', '$state', 
            function ($location, $state) {
                if (!angular.isUndefinedOrNull($state.current) && $state.current.name === 'meter.configurationManagement') {
                    $location.path('meter/meterconfigurationManagement/configPrgm');
                }
            }]);
})(window.angular);