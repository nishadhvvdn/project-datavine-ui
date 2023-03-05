/**
 * This handles tools services
 */
(function (angular) {
    "use strict";
    angular
        .module('dataVINEApp')
        .service('toolsService', ['$q', 'NetworkUtilService',
            function ($q, networkUtilService) {

                /**
                 * Updates user information
                 */
                this.UpdateUserSettings = function (
                    userID, firstName, lastName, email, homePage, timeZone, oldPswd, loginId, temprature) {
                    var des = $q.defer();
                    var arrInputData = [
                        userID, firstName, lastName, email, homePage, timeZone, oldPswd, loginId, temprature];
                    networkUtilService
                        .createHttpRequestAndGetResponse("UpdateUserSettings", arrInputData)
                        .then(function (objData) {
                            des.resolve(objData);
                        });
                    return des.promise;
                };

                /**
                 * Returns user settings
                 */
                this.UserSettings = function (userID) {
                    var des = $q.defer();
                    var arrInputData = [userID];
                    networkUtilService
                        .createHttpRequestAndGetResponse("UserSettings", arrInputData)
                        .then(function (objData) {
                            des.resolve(objData);
                        });
                    return des.promise;
                };

                /**
                 * Update user password
                 */
                this.ChangePassword = function (userID, OldPassword, NewPassword, loginId, isPasswordExpired) {
                    var des = $q.defer();
                    var arrInputData = [userID, window.btoa(OldPassword), window.btoa(NewPassword), loginId, isPasswordExpired];
                    networkUtilService
                        .createHttpRequestAndGetResponse("ChangePassword", arrInputData)
                        .then(function (objData) {
                            des.resolve(objData);
                        });
                    return des.promise;
                };

            }]);
})(window.angular);
