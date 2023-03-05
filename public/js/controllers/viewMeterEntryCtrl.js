/**
 * @description
 * Controller for meter entry
 */
(function (angular) {
    "use strict";
    angular.module('dataVINEApp').controller('viewMeterEntryCtrl',
        ['$scope', '$modalInstance', '$state',
            function ($scope, $modalInstance, $state) {
                init();

                /**
                 * Initialize the modal data
                 */
                function init() {
                    $scope.meterdetails = {};
                    if (!angular.isUndefinedOrNull(objCacheDetails.data.selectedData)) {
                        var meterData = objCacheDetails.data.selectedData;
                        $scope.meterdetails = meterData;
                        $scope.createUpdateStatus = false;
                        objCacheDetails.data.selectedData = null;
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