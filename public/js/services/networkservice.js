/**
 * This handles communicating to network
 */
(function (angular) {
    "use strict";
    angular
        .module('dataVINEApp')
        .service('NetworkService', ['$q', '$http', '$rootScope', 'Idle','$location',
            function ($q, $http, $rootScope, Idle, $location) {
                let currentUrl = $location.url();
                if(currentUrl !== '/login'){
                    Idle.watch();
                } else {
                    Idle.unwatch();
                }
                /**
                 * Opens a URL by passing the necessary parameters
                 */
                this.openURL = function (strPath, strMethod, objQueryParam, objHeaders, dataObject) {
                    // console.log("Cookies", document.cookie);
                    if (angular.isUndefinedOrNull(strMethod)) {
                        strMethod = 'GET';
                    }
                    if (angular.isUndefinedOrNull(objQueryParam)) {
                        objQueryParam = {};
                    }
                    if (angular.isUndefinedOrNull(objHeaders)) {
                        objHeaders = {};
                        objHeaders["Content-Type"] = "application/json";
                    }
                    var des = $q.defer();
                    $rootScope.enableLoading = true;
                    if (navigator.onLine) {
                        objHeaders["Cache-Control"] = "no-cache, no-store, must-revalidate";
                        objHeaders["Pragma"] = "no-cache";
                        objHeaders["Expires"] = "0";
                        var objNetworkData = {
                            method: strMethod,
                            url: strPath, params: objQueryParam,
                            timeout: objCacheDetails.timeout,
                            headers: objHeaders,
                            cache: false
                        };
                        if (!angular.isUndefinedOrNull(dataObject)) {
                            objNetworkData['data'] = dataObject;
                        }
                        try {
                            $http(objNetworkData)
                                .success(
                                    function (data, status, headers, config) {
                                        $rootScope.enableLoading = false;
                                        var objResponse = {
                                            "data": data,
                                            "status": status,
                                            "headers": headers,
                                            "config": config
                                        };
                                        des.resolve(objResponse);
                                    })
                                .error(
                                    function (data, status, headers, config) {
                                        handleErrorsStatus(status);                                        
                                        var objResponse = {
                                            "data": data,
                                            "status": status,
                                            "headers": headers,
                                            "config": config
                                        };
                                        $rootScope.enableLoading = false;
                                        des.resolve(objResponse);
                                    });
                        } catch (e) {
                            $rootScope.enableLoading = false;
                        }
                    } else {
                        des.resolve(null);
                    }
                    return des.promise;
                };

                /**
                 * @description
                 * Function to handle 500 internale server error with some message
                 * @return Nil                 
                 */
                function handleErrorsStatus(status){
                    if(status === 500) {
                        swal('Something went wrong, Please try after some time...');
                    }
                }

            }]);
})(window.angular);
