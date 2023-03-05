/**
 * @description
 * Controller for circuit entry modal
 */
(function (angular) {
    "use strict";
    angular.module('dataVINEApp').controller('viewCircuitEntryCtrl',
        ['$scope', '$modalInstance', '$state',
            function ($scope, $modalInstance, $state) {
                init();

                /**
                 *   @description
                 * Initialize the modal controls
                 *
                 * @param Nil
                 * @return Nil
                 
                 */
                function init() {
                    if (!angular.isUndefinedOrNull(objCacheDetails.data.selectedData)) {
                        var retrievedData = objCacheDetails.data.selectedData;
                        $scope.circuitId = retrievedData.circuitId;
                        $scope.kvaRating = retrievedData.kvaRating;
                        $scope.substationId = retrievedData.substationId;
                        $scope.substationName = retrievedData.substationName;
                        $scope.substationAdd = retrievedData.substationAdd;
                        $scope.country = retrievedData.country;
                        $scope.state = retrievedData.state;
                        $scope.city = retrievedData.city;
                        $scope.zipcode = retrievedData.zipcode;
                        $scope.latitude = retrievedData.Latitude;
                        $scope.longitude = retrievedData.Longitude;
                        objCacheDetails.data.selectedData = null;
                    }
                }

                /**
                 * Dismiss the modal
                 */
                $scope.ok = function () {
                    $modalInstance.dismiss(false);
                };

            }]);
})(window.angular);