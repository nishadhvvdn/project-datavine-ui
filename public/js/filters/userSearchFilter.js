/**
 * Filter for deltalink
 */
(function (angular) {
    "use strict";
    angular
        .module('dataVINEApp')
        .filter('userSearchFilter', [
            function () {
                return function (arrInputData, deltaLinkSearchValue) {
                    if (!angular.isUndefined(arrInputData) && !angular.isUndefined(deltaLinkSearchValue)) {
                        var filteredData = [];
                        angular.forEach(arrInputData,
                            function (data) {
                                var endPointData = (data.UserID).toLowerCase();
                                if (endPointData.indexOf(deltaLinkSearchValue.toLowerCase()) >= 0) {
                                    filteredData.push(data);
                                }
                            });
                        return filteredData;
                    }
                    return arrInputData;
                };
            }]);
})(window.angular);
