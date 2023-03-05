
/**
 * Filter for common statistics
 */
(function (angular) {
    "use strict";
    angular
        .module('dataVINEApp')
        .filter('communicationsStatistics', [
            function () {
                return function (arrInputData, strKeyNameToFilter, startDate) {
                    if (!angular.isUndefined(arrInputData) && !angular.isUndefined(startDate) ||
                        !angular.isUndefined(arrInputData)) {
                        var arrOutputData = [];
                        angular.forEach(arrInputData,
                            function (objData) {
                                var editTimeVal = new Date(objData[strKeyNameToFilter]);
                                if (editTimeVal <= startDate) {
                                    arrOutputData.push(objData);
                                }
                            });
                        return arrOutputData;
                    }
                    return arrInputData;
                };
            }]);
})(window.angular);