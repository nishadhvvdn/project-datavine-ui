/**
 * Controller for Network Statistics
 * @description
 */
(function (angular) {
    "use strict";
    angular.module('dataVINEApp')
        .controller('dataVINENetworkStatisticsCtrl', ['$scope', '$modalInstance', '$uibModal',
            function ($scope, $modalInstance, $uibModal) {
                $scope.cancel = function () {
                    $modalInstance.dismiss();
                };
            }]);
})(window.angular);