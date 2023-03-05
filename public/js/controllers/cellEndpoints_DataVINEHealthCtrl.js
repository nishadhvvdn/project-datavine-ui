/**
  * @this vm
  * @ngdoc controller
  * @name dataVINEApp.controller:cellEndpoints_DataVINEHealthCtrl
  *
  * @description
  * Controller for Cell Endpoints in Health
*/
(function (angular) {
    "use strict";
    angular.module('dataVINEApp')
        .controller('cellEndpoints_DataVINEHealthCtrl', ['$scope', '$state', '$uibModal', 
            function ($scope, $state, $uibModal) {
                var vm = this;
                $scope.cellEndpoints_DataVINEHealthData = [{
                    "SerialNumber": "M-001"
                }, {
                    "SerialNumber": "M-002"
                }, {
                    "SerialNumber": "M-003"
                }];
                $scope.cellEndpoints_DataVINEHealthOptions = angular.copy(objCacheDetails.grid);
                $scope.cellEndpoints_DataVINEHealthOptions.data = [];
                $scope.cellEndpoints_DataVINEHealthOptions.columnDefs = [
                    { field: 'SerialNumber', enableHiding: false },
                    { field: 'Device Info', enableColumnMenu: false, cellTemplate: '<div class="ui-grid-cell-contents"><button type="button" class="btn btn-xs btn-default" ng-click="grid.appScope.vm.openNetworkStatistics(row)"><i class="glyphicon glyphicon-info-sign"></i></button></div>', enableHiding: false, enableSorting: false }
                ];

                /**
                  * @description
                  * Function to open pop-up for Network Statistics
                  *
                  * @param Nil
                  * @return Nil
                */
                vm.openNetworkStatistics = function () {
                    $uibModal.open({
                        templateUrl: '/templates/dataVINENetworkStatistics.html',
                        controller: 'dataVINENetworkStatisticsCtrl',
                        size: 'lg',
                        backdrop: 'static',
                        keyboard: true
                    });
                };
                /**
                  * @description
                  * Function to print
                  *
                  * @param Nil
                  * @return Nil
                */
                $scope.printCart = function () {
                    window.print();
                };
            }]);
})(window.angular);