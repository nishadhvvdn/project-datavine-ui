/**
 * @description
 * Controller for meter entry
 */
(function (angular) {
    "use strict";
    angular.module('dataVINEApp').controller('viewDeltaLinkCtrl',
        ['$scope', '$modalInstance', '$state',
            function ($scope, $modalInstance, $state) {
                $scope.deltaLinkDetails = {};
                init();

                /**
                 * Initialize the modal data
                 */
                function init() {
                    if (!angular.isUndefinedOrNull(objCacheDetails.data.deltaLinkData)) {
                        $scope.deltaLinkDetails = objCacheDetails.data.deltaLinkData;
                    }
                }

                /**
                 *  @description
                 * Dismiss the modal
                 *
                 * @param Nil
                 * @return Nil

                 */
                $scope.ok = function () {
                    $modalInstance.dismiss(false);
                };

            }]);
})(window.angular);
