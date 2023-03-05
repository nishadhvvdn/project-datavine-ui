/**
 * TBD
 */
(function (angular) {
    "use strict";
    angular
        .module('dataVINEApp')
        .directive('logout', ['logoutservice', '$state',
            function (logoutservice, $state) {
                return {
                    restrict: 'A',
                    templateUrl: 'pages/logout.html',
                    controller: function ($scope) {

                        $scope.logout = function () {
                            logoutservice.logout()
                                .then(function () {
                                    $state.go('login');
                                });
                        };

                    }
                };
            }]);
})(window.angular);