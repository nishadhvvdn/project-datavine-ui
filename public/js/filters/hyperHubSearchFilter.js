/**
 * Filter for Hyperhubs
 */
(function (angular) {
    "use strict";
    angular
        .module('dataVINEApp')
        .filter('hyperHubSearch', [
            function () {
                return function (inputData, searchInput, type) {
                    if (!angular.isUndefined(inputData) && !angular.isUndefined(searchInput)) {
                        var oputPut = [];
                        angular.forEach(inputData,
                            function (obj) {
                                var field = (type === 'hyperHub') ? (obj.HubSerialNumber).toLowerCase() : (obj.Owner).toLowerCase();
                                if (field.indexOf(searchInput.toLowerCase()) >= 0) {
                                    oputPut.push(obj);
                                }
                            });
                        return oputPut;
                    }
                    return inputData;
                };
            }]);
})(window.angular);