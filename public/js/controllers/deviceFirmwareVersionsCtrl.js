/*
 * 
*/

(function (angular) {
    'use strict';
    angular.module('dataVINEApp')
        .controller('deviceFirmwareVersionsCtrl',
        ['$state', function ($state) {
            if (!angular.isUndefinedOrNull($state.current) && $state.current.name === 'reports.deviceFirmwareVersions') {
                $state.go('reports.deviceFirmwareVersions.hypersproutEntry');
            }
        }]);
})(window.angular);
