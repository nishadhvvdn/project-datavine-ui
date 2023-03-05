/**
 * Filter for meter grouping
 */
(function (angular) {
    "use strict";
    angular
        .module('dataVINEApp')
        .filter('meterGroupingSearch', ['commonService',
            function (commonService) {
                return function (arrInputData, meterSearchValue) {
                    if (!angular.isUndefined(arrInputData) && !angular.isUndefined(meterSearchValue)) {
                        var arrOutputData = [];
                        angular.forEach(arrInputData, function (objectData) {
                            var meterSl = (commonService.convert(objectData.meterSl)).toLowerCase();
                            var meterMake = (commonService.convert(objectData.meterMake)).toLowerCase();
                            var consumerNumber = (commonService.convert(objectData.consumerNumber)).toLowerCase();
                            var phasesMeter = (commonService.convert(objectData.phasesMeter)).toLowerCase();
                            var latitude = (commonService.convert(objectData.latitudeMeter)).toLowerCase();
                            var longitude = (commonService.convert(objectData.longitudeMeter)).toLowerCase();
                            if (meterSl.indexOf(meterSearchValue.toLowerCase()) >= 0 ||
                                meterMake.indexOf(meterSearchValue.toLowerCase()) >= 0 ||
                                consumerNumber.indexOf(meterSearchValue.toLowerCase()) >= 0 ||
                                phasesMeter.indexOf(meterSearchValue.toLowerCase()) >= 0 ||
                                latitude.indexOf(meterSearchValue.toLowerCase()) >= 0 ||
                                longitude.indexOf(meterSearchValue.toLowerCase()) >= 0) {
                                arrOutputData.push(objectData);
                            }
                        });
                        return arrOutputData;
                    }
                    return arrInputData;
                };
            }]);
})(window.angular);