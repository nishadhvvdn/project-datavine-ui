(function (angular) {
    "use strict";
    angular
        .module('dataVINEApp')
        .filter('serialIDFilter', [
            function () {
                return function (arrInputData, searchValue) {
                    if (!angular.isUndefined(arrInputData) &&
                        !angular.isUndefined(searchValue)) {
                        var arrOutputData = [];
                        angular.forEach(arrInputData,
                            function (data) {
                                var endPointData = (data.serialNumber).toLowerCase();
                                if (endPointData.indexOf(searchValue.toLowerCase()) >= 0) {
                                    arrOutputData.push(data);
                                }
                            });
                        return arrOutputData;
                    }
                    return arrInputData;
                };
            }]);
})(window.angular);
