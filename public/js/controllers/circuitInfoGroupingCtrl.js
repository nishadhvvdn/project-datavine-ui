/**
  * @this vm
  * @ngdoc controller
  * @name dataVINEApp.controller:circuitInfoGroupingCtrl
  *
  * @description
  * Controller to Group circuit information
*/
(function (angular) {
    "use strict";
    angular.module('dataVINEApp').controller('circuitInfoGroupingCtrl', 
    ['$scope', '$uibModal', '$state', '$rootScope', '$modalInstance', 
        function ($scope, $uibModal, $state, $rootScope, $modalInstance) {
            init();
            /**
              * @description
              * Function to initialize Group Circuit information
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
                    $scope.latitude = retrievedData.latitude;
                    $scope.longitude = retrievedData.longitude;
                    objCacheDetails.data.selectedData = null;
                }
            }
            /**
              * @description
              * Function to close pop-up
              *
              * @param Nil
              * @return Nil
            */
            $scope.ok = function () {
                $modalInstance.dismiss();
            };
        }]);
})(window.angular);