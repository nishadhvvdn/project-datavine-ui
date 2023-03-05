/**
 * @description
 * Controller for handling Server details
 */
(function (angular) {
    "use strict";
    angular.module('dataVINEApp').controller('serverDetailsCtrl', 
    ['$scope', '$modalInstance', function ($scope, $modalInstance) {

        /**
         * Function to close pop-up
         */
        $scope.cancel = function () {
            $modalInstance.dismiss();
        };
    }]);
})(window.angular);