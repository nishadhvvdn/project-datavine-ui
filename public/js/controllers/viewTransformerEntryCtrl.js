/**
 * @description
 * Control for transformer entry modal
 */
(function (angular) {
    "use strict";
    angular.module('dataVINEApp').controller('viewTransformerEntryCtrl',
        ['$scope', '$modalInstance', '$sessionStorage','messageview',
            function ($scope, $modalInstance, $sessionStorage,messageview) {
                init();

                /**
                 * Initialize the controller data
                 */
                function init() {
                    $scope.transfomerdetails = {};
                    $scope.phases = {
                        1: 'Single Phase, Single Drop',
                        2: 'Single Phase, Double Drop',
                        3: 'Three Phase'
                    };
                    if (!angular.isUndefinedOrNull(objCacheDetails.data.selectedData)) {
                        var transformerData = objCacheDetails.data.selectedData;
                        $scope.unit = ($sessionStorage.get('temprature') === 'Fahrenheit') ? 'F' : 'C';
                        $scope.transfomerdetails = transformerData;
                        if(messageview.messageview == false){
                        $scope.transfomerdetails.phasesValue = $scope.phases[transformerData.phases];
                        $scope.transfomerdetails.MaxOilTemp = ($scope.unit === 'C') ? ((transformerData.MaxOilTemp - 32) * 5 / 9).toFixed(2) : parseFloat(transformerData.MaxOilTemp).toFixed(2);
                        $scope.transfomerdetails.MinOilTemp = ($scope.unit === 'C') ? ((transformerData.MinOilTemp - 32) * 5 / 9).toFixed(2) : parseFloat(transformerData.MinOilTemp).toFixed(2);
                        }else{
                            $scope.transfomerdetails.MaxOilTemp =  parseFloat(transformerData.MaxOilTemp).toFixed(2);
                                $scope.transfomerdetails.MinOilTemp = parseFloat(transformerData.MinOilTemp).toFixed(2);
                        }
                        objCacheDetails.data.selectedData = null;
                    }
                }
                /**
                 * @description
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