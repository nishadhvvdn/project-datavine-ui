/**
 * @description
 * Controller to handle login
 */
(function (angular) {
    "use strict";

    angular.module('dataVINEApp').controller('loginCtrl',
        ['$rootScope', '$scope', '$http', '$state',
            '$sessionStorage', 'InitService', 'AuthService',
            'NetworkService', 'logoutservice', '$uibModal', 'Idle',
            function ($rootScope, $scope, $http, $state,
                $sessionStorage, initService, authService,
                networkService, logoutservice, $uibModal, Idle) {
                $scope.date = new Date();
                init();
                var objRedirectDetails = {
                    'Default page': 'master',
                    'Reports': 'reports.communicationStatistics',
                    'Hypersprout Management': 'hyperSprout.groupManagement',
                    'HypersproutManagement': 'hyperSprout.groupManagement',
                    'Meter Management': 'meter.groupManagement',
                    'MeterManagement': 'meter.groupManagement',
                    'System Management': 'system.deviceManagement',
                    'SystemManagement': 'system.deviceManagement',
                    'Delta Link Management': 'deltaLink.groupManagement',
                    'DeltaLinkManagement': 'deltaLink.groupManagement',
                    'Administration': 'administration.security',
                };

                /**
                 * Function to initialize the login screen with 
                 * username and password if user details are cached
                 */
                function init() {
                    if ($sessionStorage.get('loginName') && $sessionStorage.get('password')) {
                        $scope.enableLoading = false;
                    }
                    $scope.rememberMe = $sessionStorage.get('rememberme');
                    if (!angular.isUndefinedOrNull($scope.rememberMe) &&
                        $scope.rememberMe === true) {
                        $scope.email = $sessionStorage.get('loginName');
                        $scope.password = ($sessionStorage.get('password') === null ||
                            $sessionStorage
                                .get('password') === undefined) ? undefined : window
                                    .atob($sessionStorage.get('password'));
                    }
                }

                /**
                 *  @description
                 * Function to handle login
                 *
                 * @param Nil
                 * @return Nil
                 
                 */
                $scope.loginForm = function () {
                    $scope.enableLoading = true;
                    if ($scope.rememberMe) {
                        $sessionStorage.put('password',
                            window.btoa($scope.password));
                    } else {
                        $sessionStorage.remove('password');
                    }
                    authService.authenticateUser
                        ($scope.email, $scope.password)
                        .then(function (objData) {
                            if (objData.authStatus) {
                                $scope.enableLoading = false;
                                $sessionStorage.put('loginName', $scope.email);
                                $sessionStorage.put('rememberme',
                                    $scope.rememberMe ? true : false);
                                $rootScope.userName =
                                    objCacheDetails.userDetails.username;
                                checkAndRedirect(objData);
                                Idle.watch();
                            } else {
                                $scope.enableLoading = false;
                                if (objData.Message === 101) {
                                    $sessionStorage.put('loginName', $scope.email);
                                    $uibModal.open({
                                        templateUrl: '/templates/changePassword.html',
                                        controller: 'changePasswordCtrl',
                                        size: 'md',
                                        backdrop: 'static',
                                        keyboard: true,
                                        resolve: {
                                            obj: function () {
                                                return { "usedID": $scope.email, "loginId": objData.LoginID };
                                            },
                                            type: function () {
                                                return 2;
                                            }
                                        }
                                    });
                                } else {
                                    swal(objData.Message);
                                }
                            }
                        });
                };

                /**
                 *   @description
                 * Function to validate user details and 
                 * navigate to home page
                 *
                 * @param objData
                 * @return Nil
                 
                 */
                function checkAndRedirect(objData) {
                    if (!angular.isUndefinedOrNull(objData["User Details"])) {
                        var strRedirectURL = objRedirectDetails[objData["User Details"].HomePage];
                        if (!angular.isUndefinedOrNull(strRedirectURL)) {
                            $state.go(strRedirectURL);
                        } else {
                            $state.go('master');
                        }
                    }
                }
                $('#textboxFocus').focus();
            }]);
})(window.angular);
