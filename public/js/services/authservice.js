/**
 * This handles authenticate user
 */

(function (angular) {
    "use strict";
    angular.module('dataVINEApp').service('AuthService', ['$q', 'NetworkUtilService', '$sessionStorage',
        function ($q, networkUtilService, $sessionStorage) {
            var ref = this;

            /**
             * Sets user details
             */
            this.setData = function (objData, des) {
                if (!angular.isUndefinedOrNull(objData) && objData.type) {
                    objCacheDetails.userDetails.username = objData['User Details'].FirstName + ' ' + objData['User Details'].LastName;
                    objCacheDetails.userDetails.userID = objData['User Details'].UserID;
                    objCacheDetails.functionDetails = objData['Security Group Details'].Functions;
                    objCacheDetails.userDetails.security_groupName = objData['User Details'].SecurityGroup;
                    objCacheDetails.userDetails.loginId = objData['User Details'].LoginID;
                    objCacheDetails.userDetails.mqtt_client_id = 'datavine_'+objData['User Details']._id;
                    objCacheDetails.userDetails.timeZone = objData['User Details'].TimeZone;
                    objCacheDetails.userDetails.DefaultDataDisplayPeriod = angular.isUndefinedOrNull(objData['System Settings'][1].Type.Values.DefaultDataDisplayPeriod) ? 0 : objData['System Settings'][1].Type.Values.DefaultDataDisplayPeriod;
                    objCacheDetails.userDetails.newAccountReportTimePeriod = angular.isUndefinedOrNull(objData['System Settings'][2].Type.Values.newAccountReportTimePeriod) ? 0 : objData['System Settings'][2].Type.Values.newAccountReportTimePeriod;
                    $sessionStorage.put('superUser', objData['User Details'].SuperUser);
                    $sessionStorage.put('temprature', objData['User Details'].Temprature);
                    $sessionStorage.put('displayItemPerpage', angular.isUndefinedOrNull(objData['System Settings'][1].Type.Values.NumberofRowstoDisplayPerPage) ? 0 : objData['System Settings'][1].Type.Values.NumberofRowstoDisplayPerPage);
                    objCacheDetails.grid.paginationPageSize = angular.isUndefinedOrNull(objData['System Settings'][1].Type.Values.NumberofRowstoDisplayPerPage) ? 0 : objData['System Settings'][1].Type.Values.NumberofRowstoDisplayPerPage;
                    objData.authStatus = true;
                    des.resolve(objData);
                } else {
                    objData = angular.isUndefinedOrNull(objData) ? {} : objData;
                    objData.authStatus = false;
                    des.resolve(objData);
                }
            };

            /**
             * Authenticates user
             */
            this.authenticateUser = function (username, password) {
                var des = $q.defer();
                var arrInputData = [username, window.btoa(password)];
                networkUtilService.createHttpRequestAndGetResponse("login", arrInputData)
                    .then(function (obj) {
                        ref.setData(obj, des);
                    });
                return des.promise;
            };

        }]);
})(window.angular);
