/**
 * @description
 * Controller for Grouping
 */
(function (angular) {
    'use strict';
    angular.module('dataVINEApp')
        .controller('groupingCtrl',['$state', 
            function ($state) {
                if (!angular.isUndefinedOrNull($state.current) && $state.current.name === 'system.grouping') {
                    $state.go('system.grouping.circuitGrouping');
                }
            }]);
})(window.angular);