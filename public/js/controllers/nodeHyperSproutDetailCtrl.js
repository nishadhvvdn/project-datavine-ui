/**
 * @description
 * Controller for displaying Hypersprout details
 */
(function (angular) {
    "use strict";
    angular.module('dataVINEApp').controller('nodeHyperSproutDetailCtrl', ['$scope', '$modalInstance',
        function ($scope, $modalInstance) {
            $scope.cancel = function () {
                $modalInstance.dismiss();
            };
        }]);
})(window.angular);