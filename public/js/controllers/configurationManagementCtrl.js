/**
 * Controller for Configuration management
 * @description
 */
(function (angular) {
    'use strict';
    angular.module('dataVINEApp')
        .controller('configurationManagementCtrl', ['$location', '$state', 
            function ($location, $state) {
                if (!angular.isUndefinedOrNull($state.current) && $state.current.name === 'hyperSprout.configurationManagement') {
                    $location.path('/hyperSprout/configurationManagement/configPrgm');
                }
            }]);
})(window.angular);