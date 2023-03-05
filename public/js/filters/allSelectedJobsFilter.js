/**
 * Filter for selected jobs
 */
(function (angular) {
    "use strict";
    angular
        .module('dataVINEApp')
        .filter('allSelectedJobsFilter', [
            function () {
                return function (arrInputData, allSelectedJobsCheck) {
                    if (!angular.isUndefined(arrInputData) && !angular.isUndefined(allSelectedJobsCheck)) {
                        var arrOutputData = [];
                        angular.forEach(arrInputData,
                            function (objectData) {
                                var jobStatus = objectData.Description;
                                if (jobStatus === "HS Download" || jobStatus === "Downloading HS Configuration" ||
                                    jobStatus === "" || jobStatus === "" || jobStatus === "") {
                                    arrOutputData.push(objectData);
                                }
                            });
                        return arrOutputData;
                    }
                    return arrInputData;
                };
            }]);
})(window.angular);