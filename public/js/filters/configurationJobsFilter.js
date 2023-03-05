/**
 * Filter for configurations
 */
(function (angular) {
    "use strict";
    angular
        .module('dataVINEApp')
        .filter('configurationJobsFilter', [
            function () {
                return function (arrInputData, configurationJobsCheck) {
                    if (!angular.isUndefined(arrInputData) &&
                        !angular.isUndefined(configurationJobsCheck)) {
                        var arrOutputData = [];
                        angular.forEach(arrInputData,
                            function (objectData) {
                                var jobStatus = objectData.Group;
                                if (jobStatus === "Configuration Job") {
                                    arrOutputData.push(objectData);
                                }
                            });
                        return arrOutputData;
                    }
                    return arrInputData;
                };
            }]);
})(window.angular);