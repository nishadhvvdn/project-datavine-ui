/**
 * Filter for Hyperhubs
 */
(function (angular) {
    "use strict";
    angular
        .module('dataVINEApp')
        .filter('interrogationJobsFilter', [
            function () {
                return function (arrInputData, interrogationJobsCheck) {
                    if (!angular.isUndefined(arrInputData) && !angular.isUndefined(interrogationJobsCheck)) {
                        var arrOutputData = [];
                        angular.forEach(arrInputData, function (objectData) {
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