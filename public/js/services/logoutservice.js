/**
 * This used to manage the Logout related actvities
 */
(function (angular) {
    "use strict";
    angular
        .module('dataVINEApp')
        .service('logoutservice', ['$q', '$sessionStorage', '$state', 'NetworkUtilService','Idle', '$rootScope', 
            function ($q, $sessionStorage, $state, networkUtilService, Idle, $rootScope) {

                /**
                 * Clears all session and cache stored and logs out user
                 */
                this.logout = function () {
                    Idle.unwatch();
                    var des = $q.defer();
                    var arrInputData = [];
                    networkUtilService
                        .createHttpRequestAndGetResponse("logout", arrInputData)
                        .then(function (objData) {
                            $sessionStorage.remove("superUser");
                            if($rootScope.mqttClient){
                                $rootScope.mqttClient.end(function (){
                                    console.log("MQTT Disconnected");
                                });
                            }                            
                            des.resolve(objData);
                        });
                    return des.promise;
                };

            }]);
})(window.angular);
