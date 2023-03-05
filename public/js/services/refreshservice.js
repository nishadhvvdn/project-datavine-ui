/**
 * This handles Session Check in Each Controller
 */
(function (angular) {
    "use strict";
    angular
        .module('dataVINEApp')
        .service('refreshservice', [
            '$q', '$sessionStorage', 'logoutservice', 'AuthService',
            'InitService', 'administrationService', '$state',
            function ($q, $sessionStorage, logoutservice, authService,
                initService, administrationService, $state) {

                /**
                 * Check if the session exists
                 * If it does, login to page again
                 * If not, log him out
                 */
                this.refresh = function () {
                    var des = $q.defer();
                    if ((angular.isUndefinedOrNull($sessionStorage.get('loginName')))) {
                        logoutservice
                            .logout()
                            .then(function () {
                                $state.go('login');
                                des.resolve();
                            });
                    } else {
                        if (angular.isUndefinedOrNull(objCacheDetails.userDetails) ||
                            angular.isUndefinedOrNull(objCacheDetails.userDetails.username)) {
                            initService
                                .initializeApp()
                                .then(function (responseData) {
                                    administrationService
                                        .UserDetails()
                                        .then(function (obj) {
                                            authService.setData(obj, des);
                                        });
                                });
                        } else {
                            des.resolve();
                        }
                    }
                    return des.promise;
                };

            }]);
})(window.angular);