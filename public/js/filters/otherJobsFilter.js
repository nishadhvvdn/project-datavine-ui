/**
 * Filter for other jobs
 */
(function (angular) {
    "use strict";
    angular
        .module('dataVINEApp')
        .filter('otherJobsFilter', [
            function () {
                return function (arrInputData, otherJobsCheck) {
                    if (!angular.isUndefined(arrInputData) && !angular.isUndefined(otherJobsCheck)) {
                        var arrOutputData = [];
                        angular.forEach(arrInputData,
                            function (objectData) {
                                var jobStatus = objectData.Description;
                                if (jobStatus === " ") {
                                    arrOutputData.push(objectData);
                                }
                            });
                        return arrOutputData;
                    }
                    return arrInputData;
                };
            }]);
})(window.angular);