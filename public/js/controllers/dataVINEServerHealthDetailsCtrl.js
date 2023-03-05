
/**
 * Controller for Server Health Details
 * @description
 */
(function (angular) {
    "use strict";
    angular.module('dataVINEApp')
        .controller('dataVINEServerHealthDetailsCtrl', ['$scope', '$modalInstance',
            function ($scope, $modalInstance) {
                $scope.cancel = function () {
                    $modalInstance.dismiss();
                };
            }]);
})(window.angular);