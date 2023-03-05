/**
 * Filter for connected meters
 */
(function (angular) {
    "use strict";
    angular
        .module('dataVINEApp')
        .filter('meterConnected', [
            function () {
                return function (arrInputData, connectCheck) {
                    if (!angular.isUndefined(arrInputData) && !angular.isUndefined(connectCheck)) {
                        var arrOutputData = [];
                        angular.forEach(arrInputData,
                            function (objectData) {
                                var jobStatus = objectData.Status;
                                if (jobStatus === "Connected") {
                                    arrOutputData.push(objectData);
                                }
                            });
                        return arrOutputData;
                    }
                    return arrInputData;
                };
            }]);
})(window.angular);