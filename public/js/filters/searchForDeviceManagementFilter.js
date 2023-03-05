/**
 * Filter for device management
 */
(function (angular) {
    "use strict";
    angular
        .module('dataVINEApp')
        .filter('searchForDeviceManagment', ['commonService',
            function (commonService) {
                return function (arrayInputData, searchByType, deviceSearchValue, hyperSproutCheck) {
                    var arrayOutputData = [];
                    if (!angular.isUndefined(arrayInputData) && !angular.isUndefined(deviceSearchValue)) {
                        angular.forEach(arrayInputData,
                            function (obj) {
                                var SerialNumber = (commonService.convert(obj.SerialNumber)).toLowerCase();
                                var Name = (commonService.convert(obj.Name)).toLowerCase();
                                var DeviceID = (commonService.convert(obj.DeviceID));
                                var Registered = commonService.convert(obj.Registered);
                                if(searchByType == 'srchname'){
                                    if (SerialNumber.indexOf(deviceSearchValue.toLowerCase()) >= 0 ||
                                    Name.indexOf(deviceSearchValue.toLowerCase()) >= 0 ){
                                        if ((Registered === "No" ? true : false) === hyperSproutCheck) {
                                            arrayOutputData.push(obj);
                                        }
                                    }
                                }else  if(searchByType == 'srchid'){
                                    if (DeviceID.indexOf(deviceSearchValue.toLowerCase()) >= 0){
                                        if ((Registered === "No" ? true : false) === hyperSproutCheck) {
                                            arrayOutputData.push(obj);
                                        }
                                    }
                                }else  if(searchByType == 'all'){
                                     if (SerialNumber.indexOf(deviceSearchValue.toLowerCase()) >= 0 ||
                                        Name.indexOf(deviceSearchValue.toLowerCase()) >= 0 || DeviceID.indexOf(deviceSearchValue.toLowerCase()) >= 0  ) {
                                    if ((Registered === "No" ? true : false) === hyperSproutCheck) {
                                        arrayOutputData.push(obj);
                                    }
                                    }
                                }else{
                                    if (SerialNumber.indexOf(deviceSearchValue.toLowerCase()) >= 0 ||
                                    Name.indexOf(deviceSearchValue.toLowerCase()) >= 0 || DeviceID.indexOf(deviceSearchValue.toLowerCase()) >= 0  ) {
                                    if ((Registered === "No" ? true : false) === hyperSproutCheck) {
                                        arrayOutputData.push(obj);
                                    }
                                }
                                }
                            });
                        return arrayOutputData;
                    } else {
                        angular.forEach(arrayInputData, function (obj) {
                            if ((commonService.convert(obj.Registered) === "No" ? true : false) === hyperSproutCheck)
                                arrayOutputData.push(obj);
                        });
                        return arrayOutputData;
                    }
                };
            }]);
})(window.angular);