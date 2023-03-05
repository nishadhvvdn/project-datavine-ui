/**
 * @description
 * Controller for configure Group Details
 */
(function (angular) {
    "use strict";
    angular.module('dataVINEApp').controller('deltaLinkGroupConfigurationDetailsCtrl', 
    ['$scope', '$modalInstance', 'data', 'type',
        function ($scope, $modalInstance, data, type) {
            init();
            function init() {
                if (!angular.isUndefinedOrNull(objCacheDetails.data.selectedDeltaLinkFirmwareGroupInfo)) {
                    $scope.groupName = objCacheDetails.data.selectedDeltaLinkFirmwareGroupInfo["Group_Name"];
                    $scope.description = objCacheDetails.data.selectedDeltaLinkFirmwareGroupInfo["Description"];
                    $scope.Ids = data;
                    $scope.type = type;
                    $scope.deviceClass = "Delta Link";
                }
            }

            /**
             * @description
             * Function to close pop-up
             *
             * @param Nil
             * @return Nil

             */
            $scope.cancel = function () {
                $modalInstance.dismiss();
            };
        }]);
})(window.angular);
