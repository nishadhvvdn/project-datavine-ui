/**
 * Filter for endpoints
 */
(function (angular) {
    "use strict";
    angular
        .module('dataVINEApp')
        .filter('endPointSearchFilter', [
            function () {
                return function (arrInputData, endPointsSearchValue) {
                    if (!angular.isUndefined(arrInputData) &&
                        !angular.isUndefined(endPointsSearchValue)) {
                        var arrOutputData = [];
                        angular.forEach(arrInputData,
                            function (objectData) {
                                var endPointData = (objectData.SerialNumber).toLowerCase();
                                var meterKeyCheck = 'meter' in objectData; 
                                if(meterKeyCheck) { var endPointMeterData = (objectData.meter).toLowerCase();
                                    if (endPointData.indexOf(endPointsSearchValue.toLowerCase()) >= 0 ||
                                        endPointMeterData.indexOf(endPointsSearchValue.toLowerCase()) >= 0) {
                                        arrOutputData.push(objectData);
                                    }}else{
                                        var endPointData = (objectData.SerialNumber).toLowerCase();
                                        if (endPointData.indexOf(endPointsSearchValue.toLowerCase()) >= 0 ) {
                                        arrOutputData.push(objectData);
                                    }
                                    }
                            });
                        return arrOutputData;
                    }
                    return arrInputData;
                };
            }]);
})(window.angular);