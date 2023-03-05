/**
 * Filter for locked users
 */
(function (angular) {
    "use strict";
    angular
        .module('dataVINEApp')
        .filter('lockedUserFilter', [
            function () {
                return function (userDetails, lockedUser) {
                    if (!angular.isUndefined(userDetails) && !angular.isUndefined(lockedUser)) {
                        var arrOutputData = [];
                        angular.forEach(userDetails,
                            function (objectData) {
                                if (lockedUser && objectData['Account Locked']) {
                                    arrOutputData.push(objectData);
                                }
                            });
                        return arrOutputData;
                    }
                    return userDetails;
                };
            }]);
})(window.angular);