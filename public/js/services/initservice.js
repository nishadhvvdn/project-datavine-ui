/**
 * This handles loading the required configuration data to cache
 */
(function (angular) {
    "use strict";
    angular
        .module('dataVINEApp')
        .service('InitService', ['$q', 'NetworkService',
            function ($q, networkService) {

                /**
                 * Initializes by invoking loadConfigurations
                 */

                this.initializeApp = function () {
                    var des = $q.defer();
                    loadConfigurations().then(function (responseData) {
                        des.resolve(responseData);
                    });
                    return des.promise;
                };

                /**
                 * Loads configuration to add to cache
                 */
                function loadConfigurations() {
                    var des = $q.defer();
                    networkService
                        .openURL(
                            Constants.CONFIGURATION_FILEPATH,
                            Constants.HTTPMETHOD_GET,
                            {},
                            {}
                        ).then(
                            function (objResponse) {
                                networkService
                                    .openURL(
                                        Constants.getEnv,
                                        Constants.HTTPMETHOD_GET,
                                        {},
                                        {}
                                    ).then(
                                        function (resEnv) {
                                            if (!angular.isUndefinedOrNull(objResponse.data) &&
                                                !angular.isUndefinedOrNull(resEnv.data.webservicehost)) {
                                                objCacheDetails.userDetails = {};
                                                objCacheDetails.timeout = objResponse.data.timeout;
                                                objCacheDetails.data = {};
                                                objCacheDetails.allowedFirmwareFileSize = parseFloat(objResponse.data.allowedFirmwareFileSize).toFixed(2);
                                                objCacheDetails.protocol = resEnv.data.protocol;
                                                objCacheDetails.env = resEnv.data.envName;
                                                objCacheDetails.webservicehost = resEnv.data.webservicehost;
                                                objCacheDetails.webserviceport = resEnv.data.webserviceport;
                                                objCacheDetails.webserviceUrl = objCacheDetails.protocol + "://" + objCacheDetails.webservicehost + "/";
                                                objCacheDetails.mqttHost = resEnv.data.mqttHost;
                                                objCacheDetails.mqttUsername = resEnv.data.mqttUsername;
                                                objCacheDetails.mqttPassword = resEnv.data.mqttPassword;
                                                objCacheDetails.endpoints = objResponse.data.endpoints;
                                                objCacheDetails.regEx = objResponse.data.regEx;
                                                des.resolve(true);
                                            } else {
                                                des.resolve(false);
                                            }
                                        });
                            });
                    return des.promise;
                }

            }]);
})(window.angular);
