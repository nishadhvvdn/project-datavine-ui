/**
 * @description
 * Controller for configuring Group details
 */
(function (angular) {
    "use strict";
    angular.module('dataVINEApp').controller('groupConfigurationDetailsCtrl',
        ['$scope', '$modalInstance', '$state', 'data', 'type',
        function ($scope, $modalInstance, $state, data, type) {
            init();

            /**
             * Function to initialize group details
             */
            function init() {
                if (!angular.isUndefinedOrNull(
                    objCacheDetails.data.configurationDetails.selectedRow)
                ) {
                    $scope.groupName = objCacheDetails.data
                        .configurationDetails.selectedRow["Name"];
                    $scope.deviceClass =
                        (type === 'HyperSprout') ? objCacheDetails
                            .data.configurationDetails
                            .selectedRow["Device Class"] : objCacheDetails
                                .data.configurationDetails.selectedRow["Device_Class"];
                    $scope.description = objCacheDetails.data
                        .configurationDetails.selectedRow["Description"];
                    $scope.Ids = data;
                    $scope.type = type;
                }
            }

            /**
             *  @description
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