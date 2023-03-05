/**
 * Controller for Health management
 * @description
 */
(function (angular) {
    "use strict";
    angular.module('dataVINEApp')
        .controller('dataVineHealthCtrl', ['$scope', '$uibModal', '$state', '$location',
            function ($scope, $uibModal, $state, $location) {
                $location.path('/system/networkStatistics/servers_networkStatistics');
            }]);
})(window.angular);