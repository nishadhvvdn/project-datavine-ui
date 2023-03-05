/**
 * Controller for communication statistics
 * @description
 * Controller to Add User
 */
(function (angular) {
    'use strict';
    angular
        .module('dataVINEApp')
        .controller('communicationStatisticsCtrl', 
        ['$state', function ($state) {
                if (!angular.isUndefinedOrNull($state.current) && $state.current.name === 'reports.communicationStatistics') {
                    $state.go('reports.communicationStatistics.hypersproutEntry');
                }
            }]);
})(window.angular);