/**
 * @description
 * Controller for configure Group Details
 */
(function (angular) {
    "use strict";
    angular.module('dataVINEApp').controller('groupConfigurationDetails_groupManagementCtrl', 
    ['$scope', '$modalInstance', 'data', 'type',
        function ($scope, $modalInstance, data, type) {
            init();
            function init() {
                if (!angular.isUndefinedOrNull(
                    objCacheDetails.data.configgroupDetails.selectedRow)
                ) {
                    $scope.groupName =
                        objCacheDetails.data
                            .configgroupDetails.selectedRow["Group_Name"];
                    $scope.groupType =
                        (type === 'HyperSprout') ? objCacheDetails.data
                            .configgroupDetails.selectedRow["Group Type"] : objCacheDetails
                                .data.configgroupDetails.selectedRow["Group_Type"];
                    $scope.description = objCacheDetails.data.configgroupDetails
                        .selectedRow["Description"];
                    $scope.Ids = data;
                    $scope.type = type;
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