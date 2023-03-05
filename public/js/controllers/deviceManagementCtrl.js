/**
 * @description
 * Controller for Device Management
 */
(function (angular) {
    'use strict';
    angular.module('dataVINEApp')
        .controller('deviceManagementCtrl', ['$location', '$state',
            function ($location, $state) {
                if (!angular.isUndefinedOrNull($state.current) && $state.current.name === 'system.deviceManagement') {
                    $location.path('/system/deviceManagement/relays');
                }
            }]);
})(window.angular);