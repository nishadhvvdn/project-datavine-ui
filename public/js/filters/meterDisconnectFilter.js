/**
 * Filter for disconnected meters
 */
(function (angular) {
    "use strict";
    angular
        .module('dataVINEApp')
        .filter('meterDisconnected', [
            function () {
                return function (arrInputData, disConnectCheck) {
                    if (!angular.isUndefined(arrInputData) && !angular.isUndefined(disConnectCheck)) {
                        var arrOutputData = [];
                        angular.forEach(arrInputData,
                            function (objectData) {
                                var jobStatus = objectData.Status;
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