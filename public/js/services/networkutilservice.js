/**
 * This makes HTTP(S) invokation to the backend
 */
(function (angular) {
    "use strict";
    angular
        .module('dataVINEApp')
        .service('NetworkUtilService', ['$rootScope',
            '$q', '$sessionStorage', '$state', 'NetworkService', 'InitService',
            function ($rootScope, $q, $sessionStorage, $state, networkService, InitService) {

                /**
                 * Creates an HTTP request with the provided parameters and
                 * returns the response via a promise
                 */
                this.createHttpRequestAndGetResponse = function (endpointName, arrInputData) {
                    var des = $q.defer();
                    if (endpointName !== 'login' &&
                        (angular.isUndefinedOrNull($sessionStorage.get('loginName')))) {
                        $state.go('login');
                    } else {
                        $rootScope.commonMsg = 'Loading...';
                        if (angular.isUndefinedOrNull(objCacheDetails.endpoints)) {                           
                            InitService.initializeApp()
                                .then(function () {
                                    request(des, endpointName, arrInputData);
                                });
                        } else {
                            request(des, endpointName, arrInputData);
                        }
                    }
                    return des.promise;
                };

                /**
                 * TBD
                 */
                function request(des, endpointName, arrInputData) {
                    let objLoginEndPoints;
                    let endpointNameWithQueryParam ;
                    if(endpointName.includes("?")) {
                        endpointNameWithQueryParam = endpointName;
                        let nameArray = endpointName.split('?');
                        endpointName = nameArray[0];
                    }
                    objLoginEndPoints = angular.copy(objCacheDetails.endpoints[endpointName]);
                    if (!angular.isUndefinedOrNull(objLoginEndPoints)) {
                        var objData = null;
                        if (!angular.isUndefinedOrNull(objLoginEndPoints.data) && !angular.isUndefinedOrNull(arrInputData)) {
                            objData = populateData(arrInputData, objLoginEndPoints.data);
                        }
                        if(endpointNameWithQueryParam && endpointNameWithQueryParam.includes('?')) {
                            networkService.openURL(objCacheDetails.webserviceUrl + endpointNameWithQueryParam,
                                objLoginEndPoints.method,
                                null,
                                null,
                                objData).then(function (objResponse) {
                                objLoginEndPoints = null;
                                if (angular.isUndefinedOrNull(objResponse)) {
                                    des.resolve(null);
                                } else {
                                    if (!angular.isUndefinedOrNull(objResponse.data) &&
                                        (objResponse.data.hasOwnProperty('Message') &&
                                            objResponse.data.Message === 'Login First')) {
                                                $rootScope.commonMsg = '';
                                                swal('Session Expired!! Please Login to continue...');
                                                $state.go('login');
                                    } else {                                            
                                        des.resolve(objResponse.data);
                                    }
                                }
                            });
                        } else {
                            networkService.openURL(objCacheDetails.webserviceUrl + objLoginEndPoints.name,
                                    objLoginEndPoints.method,
                                    null,
                                    null,
                                    objData
                                ).then(function (objResponse) {
                                    objLoginEndPoints = null;
                                    if (angular.isUndefinedOrNull(objResponse)) {
                                        des.resolve(null);
                                    } else {
                                        if (!angular.isUndefinedOrNull(objResponse.data) &&
                                            (objResponse.data.hasOwnProperty('Message') &&
                                                objResponse.data.Message === 'Login First')) {
                                                    $rootScope.commonMsg = '';
                                                    swal('Session Expired!! Please Login to continue...');
                                                    $state.go('login');
                                        } else {                                           
                                            des.resolve(objResponse.data);
                                        }
                                    }
                                });
                        }
                    } else {
                        des.resolve(false);
                    }
                }

                /**
                 * TBD
                 */
                function populateData(arrInputData, arrDataKey, inputIndex) {
                    inputIndex = angular.isUndefinedOrNull(inputIndex) ? 0 : inputIndex;
                    if (arrDataKey instanceof Object) {
                        getPopulatedObjectData(arrInputData, arrDataKey, inputIndex);
                    } else if (arrDataKey instanceof Array) {
                        for (var i = 0; i < arrDataKey.length; i++) {
                            if (arrDataKey[i] instanceof Object) {
                                getPopulatedObjectData(arrInputData, arrDataKey[i], inputIndex);
                            } else {
                                arrDataKey[i] = arrInputData[inputIndex++];
                            }
                        }
                    }
                    return arrDataKey;
                }

                /**
                 * TBD
                 */
                function getPopulatedObjectData(arrInputData, arrDataKey, inputIndex) {
                    inputIndex = angular.isUndefinedOrNull(inputIndex) ? 0 : inputIndex;
                    if (arrDataKey instanceof Object) {
                        for (var key in arrDataKey) {
                            if (arrDataKey[key] instanceof Array) {
                                getPopulatedData(arrInputData, arrDataKey[key], inputIndex);
                            } else if (arrDataKey[key] instanceof Object) {
                                getPopulatedObjectData(arrInputData, arrDataKey[key], inputIndex);
                            } else {
                                arrDataKey[key] = arrInputData[inputIndex++];
                            }
                        }
                    }
                    return arrDataKey;
                }

            }]);
})(window.angular);
