/**
 * @description
 * Controller to handle Technical loss Details
 */
(function (angular) {
    "use strict";
    angular.module('dataVINEApp').controller('technicalLossItemCtrl',
        ['$scope', '$modalInstance', function ($scope, $modalInstance) {
                init();
                function init() {
                    if (!angular.isUndefinedOrNull(objCacheDetails.data.technicalLossData)) {
                        $scope.techLossData = objCacheDetails.data.technicalLossData;
                    }
                }

                $scope.ok = function () {
                    $modalInstance.dismiss();
                };
                $scope.requesting = false;
            }]);
})(window.angular);
