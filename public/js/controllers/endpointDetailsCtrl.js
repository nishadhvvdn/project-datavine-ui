/**
 * @description
 * Controller to display endpoint details
 */
(function (angular) {
    "use strict";
    angular.module('dataVINEApp')
        .controller('endpointDetailsCtrl',
            ['$scope', '$modalInstance',
                function ($scope, $modalInstance) {
                    /**
                     * Function to close pop-up
                     */
                    $scope.cancel = function () {
                        $modalInstance.dismiss();
                    };
                }]);
})(window.angular);