/**
 * Filter for server jobs
 */
(function (angular) {
    "use strict";
    angular
        .module('dataVINEApp')
        .filter('serverJobsFilter', [
            function () {
                return function (arrInputData, serverJobsCheck) {
                    if (!angular.isUndefined(arrInputData) && !angular.isUndefined(serverJobsCheck)) {
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