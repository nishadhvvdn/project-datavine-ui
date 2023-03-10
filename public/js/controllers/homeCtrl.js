/**
 * @description
 * Controller set the default session timeout parameter
 */
(function (angular) {
    "use strict";

    angular.module('dataVINEApp')
        .controller('homeCtrl', ['$rootScope',
            '$scope', '$state', 'refreshservice',
            'logoutservice', 'Idle', 'toolsService', '$sessionStorage',
            function ($rootScope, $scope,
                      $state, refreshservice, logoutservice, Idle, toolsService, $sessionStorage) {
                refreshservice.refresh().then(function () {
                    init();
                    $scope.date = new Date();
                    // $scope.messageDetails = {};
                    $rootScope.userName = objCacheDetails.userDetails.username;
                    $scope.Obj = objCacheDetails.functionDetails;
                    var insertdetails = [];
                    var funDetail = objCacheDetails.functionDetails;
                    $scope.dynamicPopover.isOpen = false;
                    // $rootScope.callMqtt();
                    // $scope.connectMqtt();
                    var obj = {};
                    for (var count in funDetail) {
                        if (funDetail.hasOwnProperty(count)) {
                            insertdetails.push(funDetail[count]);
                            for (var key in insertdetails[count].values) {
                                obj[key] = insertdetails[count].values[key];
                            }
                        }
                    }
                });
                // $scope.connectMqtt = function () {      
                //     $rootScope.mqttClient.on('connect', function() {
                //         console.log("Connected to MQTT");
                //     });
                //     $rootScope.mqttClient.on('message', function(topic, message) {                
                //         var message = JSON.parse(message);
                //         // $scope.messageDetails = message;
                //         // console.log("Message: " + $scope.messageDetails, message);
                //         document.getElementById("messageDetails-recipient").innerHTML = message.recipient;
                //         document.getElementById("messageDetails-date").innerHTML = getFormatedDate(message.date);
                //         document.getElementById("messageDetails-message").innerHTML = message.message;
                //         var x = document.getElementById("toast");
                //         x.classList.add("show");
                //         // setTimeout(function(){ x.classList.remove("show"); }, 3000);
                //     });
                //     $rootScope.mqttClient.subscribe('admin/common', { qos: 0 }, function(error) {
                //         if (error) {
                //             console.log('Subscribe to topics error', error);
                //             return;
                //         }
                //     });
                // }                
                
                function getFormatedDate (date) {
                    if(date){
                        return moment(date).format("h:mm a, MMM YYYY");
                    }else {
                        return "Invalid Date";
                    }
                };
                
                /**
                 * @description
                 * Function to navigate to help screen
                 *
                 * @param Nil
                 * @return Nil

                 */
                $scope.open = function () {
                    var url = $state.href('help', {absolute: true});
                    window.open(url);
                };

                /**
                 * @description
                 * Function to redirect
                 *
                 * @param state
                 * @return Nil

                 */
                $scope.redirect = function (state) {
                    $state.go(state);
                };

                /**
                 * @description
                 * Init function to redirect to login page if user is not logged in.
                 *
                 * @param Nil
                 * @return Nil
                 */

                function init() {                
                    toolsService.UserSettings($sessionStorage.get('loginName'));
                }
            }]);
})(window.angular);
