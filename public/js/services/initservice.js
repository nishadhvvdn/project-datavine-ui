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
                                                function getFormatedDate (date) {
                                                    if(date){
                                                        return moment(date).format("h:mm a, MMM YYYY");
                                                    }else {
                                                        return "Invalid Date";
                                                    }
                                                };
                                                objCacheDetails.endpoints = objResponse.data.endpoints;
                                                objCacheDetails.regEx = objResponse.data.regEx;
                                                var url = resEnv.data.mqttHost;
                                                var options = {                   
                                                    clientId: `datavine_${Math.random().toString(16).substr(2, 8)}`,
                                                    username: resEnv.data.mqttUsername,
                                                    password: resEnv.data.mqttPassword
                                                };
                                                if(objCacheDetails.userDetails){
                                                    var mqttConnect = mqtt.connect(url, options);
                                                    mqttConnect.on('connect', function() {
                                                        console.log("Connected to MQTT");
                                                    });
                                                    mqttConnect.on('message', function(topic, message) {                                                                        
                                                        var message = JSON.parse(message);
                                                        if(document.getElementById("messageDetails-recipient")){                                                            
                                                            document.getElementById("messageDetails-recipient").innerHTML = message.sender;
                                                        }
                                                        if(document.getElementById("messageDetails-date")){
                                                            document.getElementById("messageDetails-date").innerHTML = getFormatedDate(message.date);
                                                        }
                                                        if(document.getElementById("messageDetails-message")){
                                                            document.getElementById("messageDetails-message").innerHTML = message.message;
                                                        }
                                                        if(document.getElementById("messageDetails-tenantID")){                                                            
                                                            document.getElementById("messageDetails-tenantID").innerHTML = message.tenantName;
                                                        }
                                                        if(document.getElementById("messageDetails-Icon")){
                                                            var src = "";
                                                            if(topic.includes("transformer")){
                                                                src = "../assets/images/Message/transformer-white.png";
                                                            }else if(topic.includes("meter")){
                                                                src = "../assets/images/Message/meter-white.png";
                                                            }else {
                                                                src = "../assets/images/Message/tenant-white.svg";
                                                            }
                                                            document.getElementById("messageDetails-Icon").src = src;
                                                        }
                                                        if(document.getElementById("toast")){
                                                            var x = document.getElementById("toast");
                                                            x.classList.add("show");
                                                            setTimeout(function(){ x.classList.remove("show"); }, 3000);
                                                        }
                                                        // console.log(message,'Message');
                                                    });
                                                    mqttConnect.subscribe(['admin/common','webalerts/message',('alarms/transformer/'+ resEnv.data.TENANT_NAME),('alarms/meter/'+ resEnv.data.TENANT_NAME)], { qos: 0 }, function(error) {
                                                        if (error) {
                                                            console.log('Subscribe to topics error', error);
                                                            return;
                                                        }
                                                    });
                                                }                                                
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
