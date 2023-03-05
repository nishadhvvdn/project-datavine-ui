/**
 * Filter for date tags
 */
(function (angular) {
    "use strict";
    angular
        .module('dataVINEApp')
        .filter('tagsDateFilter', [
            function () {
                return function (arrInputData, startDate, endDate) {
                    if (!angular.isUndefined(arrInputData) &&
                        !angular.isUndefined(startDate) ||
                        !angular.isUndefined(arrInputData) &&
                        !angular.isUndefined(endDate)) {
                        var arrOutputData = [];
                        startDate = moment(startDate).format('YYYY-MM-DD');
                        endDate = moment(endDate).format('YYYY-MM-DD');
                        angular.forEach(arrInputData,
                            function (objData) {
                                var editTimeVal = moment(objData["First Found Time"]).format('YYYY-MM-DD');
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