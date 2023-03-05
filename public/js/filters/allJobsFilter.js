/**
 * Filter for jobs
 */
(function (angular) {
    "use strict";
    angular
        .module('dataVINEApp')
        .filter('allJobsFilter', [
            function () {
                return function (arrInputData, allJobsCheck) {
                    if (!angular.isUndefined(arrInputData) && !angular.isUndefined(allJobsCheck)) {
                        var arrOutputData = [];
                        angular.forEach(arrInputData,
                            function (objectData) {
                                var jobStatus = objectData.Status;
                                if (jobStatus === "Pending" || jobStatus === "completed") {
                                    arrOutputData.push(objectData);
                                }
                            });
                        return arrOutputData;
                    }
                    return arrInputData;
                };
            }]);
})(window.angular);