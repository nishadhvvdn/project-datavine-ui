/**
 * Filter for tags
 */
(function (angular) {
    "use strict";
    angular
        .module('dataVINEApp')
        .filter('tagFilter', [
            function () {
                return function (arrInputData, hyperSproutCheck, type) {
                    if (!angular.isUndefined(arrInputData) && !angular.isUndefined(hyperSproutCheck)) {
                        var arrOutputData = [];
                        angular.forEach(arrInputData,
                            function (objData) {
                                var registeredHyperSprout = objData.IsCorrected;
                                var isRegistered = (type === 'correctedOnly') ? (registeredHyperSprout === "Y" ? true : false) : (registeredHyperSprout === "N" ? true : false);
                                if (isRegistered) {
                                    arrOutputData.push(objData);
                                }
                            });
                        return arrOutputData;
                    }
                    return arrInputData;
                };
            }]);
})(window.angular);