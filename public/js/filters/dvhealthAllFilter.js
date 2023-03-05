/**
 * Filter for DV health
 */
(function (angular) {
    "use strict";
    angular
        .module('dataVINEApp')
        .filter('dvhealthAllFilter', [
            function () {
                return function (arrInputData, statusList) {
                    if (!angular.isUndefined(arrInputData) && !angular.isUndefined(statusList)) {
                        var arrOutputData = [];
                        if (statusList[0].isSelected) {
                            return arrInputData;
                        }
                        for (var i = 1; i < statusList.length; i++) {
                            if (statusList[i].isSelected) {
                                pushData(statusList[i].name, arrInputData, arrOutputData);
                            }
                        }
                        return arrOutputData;
                    }
                    return arrInputData;
                };

                /**
                 * TBD
                 */
                function pushData(status, originalData, arrayList) {
                    angular.forEach(originalData,
                        function (objectData) {
                            var jobStatus = objectData['Health Status'];
                            if (jobStatus.toLowerCase() === status.toLowerCase()) {
                                arrayList.push(objectData);
                            }
                        });
                }

            }]);
})(window.angular);