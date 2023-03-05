/**
 * Filter for technical loss
 */
(function (angular) {
    "use strict";
    angular
        .module('dataVINEApp')
        .filter('technicalLossSearchFilter', [
            function () {
                return function (arrInputData, technicalLossSearchItem) {
                    if (!angular.isUndefined(arrInputData) && !angular.isUndefined(technicalLossSearchItem)) {
                        var filteredData = [];
                        angular.forEach(arrInputData,
                            function (data) {
                                var item = (data.Name).toLowerCase();
                                if (item.indexOf(technicalLossSearchItem.toLowerCase()) >= 0) {
                                    filteredData.push(data);
                                }
                            });
                        return filteredData;
                    }
                    return arrInputData;
                };
            }]);
})(window.angular);
