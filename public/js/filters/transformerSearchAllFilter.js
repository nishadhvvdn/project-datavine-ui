/**
 * Filter for transformers
 */
(function (angular) {
    "use strict";
    angular
        .module('dataVINEApp')
        .filter('transformerSearchAllFilter', ['commonService',
            function (commonService) {
                return function (arrInputData, transformerSearchValue) {
                    if (!angular.isUndefined(arrInputData) && !angular.isUndefined(transformerSearchValue)) {
                        var arrOutputData = [];
                        transformerSearchValue = transformerSearchValue.toLowerCase();
                        angular.forEach(arrInputData,
                            function (objectData) {
                                var transformerSl = (commonService.convert(objectData.transformerSl)).toLowerCase();
                                var kvaRating = (commonService.convert(objectData.kvaRating)).toLowerCase();
                                var hypSl = (commonService.convert(objectData.hypSl)).toLowerCase();
                                var transformerID = (commonService.convert(objectData.HypersproutMake)).toLowerCase();
                                var HypersproutVersion = (commonService.convert(objectData.HypersproutVersion)).toLowerCase();
                                var latitude = (commonService.convert(objectData.latitude)).toLowerCase();
                                var longitude = (commonService.convert(objectData.longitude)).toLowerCase();
                                if (transformerSl.indexOf(transformerSearchValue) >= 0 ||
                                    transformerID.indexOf(transformerSearchValue) >= 0 ||
                                    kvaRating.indexOf(transformerSearchValue) >= 0 ||
                                    hypSl.indexOf(transformerSearchValue) >= 0 ||
                                    transformerID.indexOf(transformerSearchValue) >= 0 ||
                                    HypersproutVersion.indexOf(transformerSearchValue) >= 0 ||
                                    latitude.indexOf(transformerSearchValue) >= 0 ||
                                    longitude.indexOf(transformerSearchValue) >= 0) {
                                    arrOutputData.push(objectData);
                                }
                            });
                        return arrOutputData;
                    }
                    return arrInputData;
                };
            }]);
})(window.angular);