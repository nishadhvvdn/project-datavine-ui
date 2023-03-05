/**
 * Filter for historical jobs
 */
(function (angular) {
    "use strict";
    angular
        .module('dataVINEApp')
        .filter('historicalJobsFilter', [
            function () {
                return function (arrInputData, runningJobsCheck) {
                    if (!angular.isUndefined(arrInputData) && !angular.isUndefined(runningJobsCheck)) {
                        var arrOutputData = [];
                        angular.forEach(arrInputData,
                            function (objectData) {
                                var jobStatus = objectData.Status;
                                if (jobStatus === "Completed") {
                                    arrOutputData.push(objectData);
                                }
                            });
                        return arrOutputData;
                    }
                    return arrInputData;
                };
            }]);
})(window.angular);