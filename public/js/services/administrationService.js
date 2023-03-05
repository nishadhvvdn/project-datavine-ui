/**
 * This handles administration services
 */

(function (angular) {
    "use strict";
    angular
        .module('dataVINEApp')
        .service('administrationService', ['$q', 'NetworkUtilService',
            function ($q, networkUtilService) {

                /**
                 *  Restores default settings
                 */
                this.RestoreDefaultSettings = function (tabHeading) {
                    var des = $q.defer();
                    var arrInputData = [tabHeading];
                    networkUtilService.createHttpRequestAndGetResponse("RestoreDefaultSettings", arrInputData)
                        .then(function (objData) {
                            des.resolve(objData);
                        });
                    return des.promise;
                };

                /**
                 * Gets set of security groups
                 */
                this.GetSecurityGroups = function (pageNum, limit) {
                    var des = $q.defer();
                    networkUtilService.createHttpRequestAndGetResponse("GetSecurityGroups?Page=" + pageNum+ "&Limit="+ limit)
                        .then(function (objData) {
                            des.resolve(objData);
                        });
                    return des.promise;
                };

                /**
                 * Returns a particular security group based on the ID passed
                 */
                this.returnSecurityGroups = function (securityID) {
                    var des = $q.defer();
                    var arrInputData = [securityID];
                    networkUtilService.createHttpRequestAndGetResponse("ReturnSecurityGroups", arrInputData)
                        .then(function (objData) {
                            des.resolve(objData);
                        });
                    return des.promise;
                };

                /**
                 * Deletes a particular security group based on the ID passed
                 */
                this.DeleteSecurityGroups = function (securityID) {
                    var des = $q.defer();
                    var arrInputData = [securityID];
                    networkUtilService.createHttpRequestAndGetResponse("DeleteSecurityGroups", arrInputData)
                        .then(function (objData) {
                            des.resolve(objData);
                        });
                    return des.promise;
                };

                /**
                 * Adds a new security group
                 */
                this.AddSecurityGroups = function (securityGroupID, description, functions) {
                    var des = $q.defer();
                    var arrInputData = [securityGroupID, description, functions];
                    networkUtilService.createHttpRequestAndGetResponse("AddSecurityGroups", arrInputData)
                        .then(function (objData) {
                            des.resolve(objData);
                        });
                    return des.promise;
                };

                /**
                 * Updates system settings
                 */
                this.UpdatedSystemSettings = function () {
                    var des = $q.defer();
                    networkUtilService.createHttpRequestAndGetResponse("UpdatedSystemSettings")
                        .then(function (objData) {
                            des.resolve(objData);
                        });
                    return des.promise;
                };

                /**
                 * Updates password settings
                 */
                this.UpdatedPasswordSettings = function () {
                    var des = $q.defer();
                    networkUtilService.createHttpRequestAndGetResponse("UpdatedPasswordSettings")
                        .then(function (objData) {
                            des.resolve(objData);
                        });
                    return des.promise;
                };

                /**
                 * Restores default password settings
                 */
                this.RestoreDefaultPasswordSettings = function () {
                    var des = $q.defer();
                    networkUtilService.createHttpRequestAndGetResponse("RestoreDefaultPasswordSettings")
                        .then(function (objData) {
                            des.resolve(objData);
                        });
                    return des.promise;
                };

                /**
                 * Saves password settings
                 */
                this.SavePasswordSettings = function (passwordSettings) {
                    var des = $q.defer();
                    var arrInputData = [passwordSettings];
                    networkUtilService.createHttpRequestAndGetResponse("SavePasswordSettings", arrInputData)
                        .then(function (objData) {
                            des.resolve(objData);
                        });
                    return des.promise;
                };

                /**
                 * Gets all users
                 */
                this.GetUsers = function (searchTerm, pageNum, limit, userstatus) {
                    let userAPIUrl = '';
                    var des = $q.defer();
                    if(userstatus) {
                        userAPIUrl ="GetUsers?Page=" + pageNum+ "&Limit="+ limit + "&search=" + searchTerm + "&filter=" + userstatus;
                    } else {
                        userAPIUrl ="GetUsers?Page=" + pageNum+ "&Limit="+ limit + "&search=" + searchTerm;
                    }
                    networkUtilService.createHttpRequestAndGetResponse(userAPIUrl)
                        .then(function (objData) {
                            des.resolve(objData);
                        });
                    return des.promise;
                };

                /**
                 * Adds a new user
                 */
                this.AddUser = function (userID, firstName, lastName, emailAdd,
                    securityGroup, homePage, timeZone, accountLocked, temprature,mobileNumber) { // added mobile number field as params
                    var des = $q.defer();
                    var arrInputData = [userID, firstName, lastName, emailAdd,
                        securityGroup, homePage, timeZone, accountLocked, temprature,mobileNumber]; // added mobile number to the array
                    networkUtilService.createHttpRequestAndGetResponse("AddUser", arrInputData)
                        .then(function (objData) {
                            des.resolve(objData);
                        });
                    return des.promise;
                };

                /**
                 * Saves system settings
                 */
                this.SaveSystemSettings = function (tabHeading, saveSettings) {
                    var des = $q.defer();
                    var arrInputData = [tabHeading, saveSettings];
                    networkUtilService.createHttpRequestAndGetResponse("SaveSystemSettings", arrInputData)
                        .then(function (objData) {
                            des.resolve(objData);
                        });
                    return des.promise;
                };

                /**
                 * Edits information about a user
                 */
                this.EditUser = function (userID, firstName, lastName, emailAdd,
                    securityGroup, homePage, timeZone, accountLocked, loginID, temprature,mobileNumber) { // added mobile number field as params
                    var des = $q.defer();
                    var arrInputData = [userID, firstName, lastName, emailAdd,
                        securityGroup, homePage, timeZone, accountLocked, loginID, temprature,mobileNumber]; // added mobile number to the array
                    networkUtilService.createHttpRequestAndGetResponse("EditUser", arrInputData)
                        .then(function (objData) {
                            des.resolve(objData);
                        });
                    return des.promise;
                };

                /**
                 * List all security IDs
                 */
                this.ListSecurityID = function () {
                    var des = $q.defer();
                    networkUtilService.createHttpRequestAndGetResponse("ListSecurityID")
                        .then(function (objData) {
                            des.resolve(objData);
                        });
                    return des.promise;
                };

                /**
                 * Edits a security group
                 */
                this.EditSecurityGroups = function (securityGroupId, description, functions) {
                    var des = $q.defer();
                    var arrInputData = [securityGroupId, description, functions];
                    networkUtilService.createHttpRequestAndGetResponse("EditSecurityGroups", arrInputData)
                        .then(function (objData) {
                            des.resolve(objData);
                        });
                    return des.promise;
                };

                /**
                 * Resets user password based on the user ID passed
                 */
                this.ResetPassword = function (userID) {
                    var des = $q.defer();
                    var arrInputData = [userID];
                    networkUtilService.createHttpRequestAndGetResponse("ResetPassword", arrInputData)
                        .then(function (objData) {
                            des.resolve(objData);
                        });
                    return des.promise;
                };

                /**
                 * Deletes a user based on the user ID passed
                 */
                this.DeleteUser = function (userID) {
                    var des = $q.defer();
                    var arrInputData = [userID];
                    networkUtilService.createHttpRequestAndGetResponse("DeleteUser", arrInputData)
                        .then(function (objData) {
                            des.resolve(objData);
                        });
                    return des.promise;
                };

                /**
                 * Returns the user details
                 */
                this.UserDetails = function () {
                    var des = $q.defer();
                    var arrInputData = [];
                    networkUtilService.createHttpRequestAndGetResponse("UserDetails", arrInputData)
                        .then(function (objData) {
                            des.resolve(objData);
                        });
                    return des.promise;
                };

            }]);
})(window.angular);

