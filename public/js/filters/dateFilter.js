/**
 * Filter for date
 */
(function (angular) {
    "use strict";
    angular
        .module('dataVINEApp')
        .filter('dateFilter', [
            function () {
                return function (arrInputData, strKeyNameToFilter, startDate, endDate) {
                    if (!angular.isUndefined(arrInputData) && !angular.isUndefined(startDate) ||
                        !angular.isUndefined(arrInputData) && !angular.isUndefined(endDate)) {
                        var arrOutputData = [];
                        angular.forEach(arrInputData,
                            function (objData) {
                                var editTimeVal = new Date(objData[strKeyNameToFilter]);
                                if (editTimeVal >= startDate && editTimeVal <= endDate) {
                                    arrOutputData.push(objData);
                                }
                            });
                        return arrOutputData;
                    }
                    return arrInputData;
                };
            }]);
})(window.angular);