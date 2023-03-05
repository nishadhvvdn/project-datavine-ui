/**
 * @description
 * Controller for Saving Configuration Program
 */
(function (angular) {
    "use strict";
    angular.module('dataVINEApp').controller('saveAsConfigPrgmCtrl_meter',
        ['$scope', '$modalInstance', function ($scope, $modalInstance) {

            /**
             * Function to close pop-up
             */
            $scope.cancel = function () {
                $modalInstance.dismiss();
            };
        }]);
})(window.angular);