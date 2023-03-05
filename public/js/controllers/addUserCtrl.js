/**
  * @this vm
  * @ngdoc controller
  * @name dataVINEApp.controller:addUserCtrl
  *
  * @description
  * Controller to Add User
*/
(function (angular) {
    "use strict";
    angular.module('dataVINEApp')
        .controller('addUserCtrl',
            ['$scope', '$modalInstance', '$state',
                'administrationService', 'actionType',
                'record', 'securityGroupDropDown', 'userIdsList',
                '$sessionStorage', function ($scope, $modalInstance,
                    $state, administrationService, actionType, record,
                    securityGroupDropDown, userIdsList, $sessionStorage) {
                    $scope.obj = {};
                    $scope.securityGroups = securityGroupDropDown.output;
                    $scope.editmode = false;
                    $scope.userObj = {};
                    $scope.userObj.accountLocked = false;
                    $scope.viewMode = false;
                    $scope.editEnable = false;
                    $scope.accessEdit = true;
                    /**
                      * @description
                      * Function to set user data
                      *
                      * @param obj - data containing user details
                      * @return Nil
                    */
                    function setUserdata(obj) {
                        $scope.userObj.userID = obj.entity.UserID;
                        $scope.userObj.firstName = obj.entity.Name;
                        $scope.userObj.lastName = obj.entity.LastName;
                        $scope.userObj.email = obj.entity['E-Mail Address'];
                        $scope.userObj.accountLocked = obj.entity['Account Locked'];
                        $scope.userObj.homePage = obj.entity.HomePage;
                        $scope.userObj.timezone = obj.entity.TimeZone;
                        $scope.userObj.securityGroup = obj.entity['Security Group'];
                        $scope.userObj.temprature = obj.entity.Temprature;
                        // if(obj.entity.MobileNumber.indexOf('') > -1) {
                            if(obj.entity.MobileNumber){
                                $scope.userObj.mobileNumber = obj.entity.MobileNumber.substring(2); //removing '+1' from MobileNumber 
                            }else {
                                $scope.userObj.mobileNumber = obj.entity.MobileNumber; //removing '+1' from MobileNumber 
                            }
                        // }
                        $scope.accessEdit = obj.entity.access;
                    }

                    if (actionType === 'Edit') {
                        $scope.editmode = true;
                        $scope.editEnable = true;
                        if (objCacheDetails.userDetails.security_groupName === 'Administrator') {
                            $scope.editEnable = false;
                        }
                        setUserdata(record);
                    } else if (actionType === 'View') {
                        $scope.viewMode = true;
                        setUserdata(record);
                    }

                    $scope.userCheck = false;
                    /**
                      * @description
                      * Function to validate User ID
                      *
                      * @param Nil
                      * @return Nil
                    */
                    $scope.check = function () {
                        for (var i = 0; i < userIdsList.length; i++) {
                            if (userIdsList[i].UserID === $scope.userObj.userID) {
                                $scope.userCheck = true;
                                break;
                            } else {
                                $scope.userCheck = false;
                            }
                        }
                    };
                    /**
                      * @description
                      * Function to close pop-up
                      *
                      * @param Nil
                      * @return Nil
                    */
                    $scope.cancel = function () {
                        $modalInstance.dismiss();
                    };
                    /**
                      * @description
                      * Function to reload the pop-up
                      *
                      * @param Nil
                      * @return Nil
                    */
                    function reload() {
                        $state.reload();
                        $modalInstance.dismiss();
                    }

                    /**
                      * @description
                      * Function to save user details
                      *
                      * @param Nil
                      * @return Nil
                    */
                    $scope.Save = function () {
                        var mobileNumber = "+1" + $scope.userObj.mobileNumber;
                        if (actionType === 'Edit') {
                            administrationService.EditUser($scope.userObj.userID,
                                $scope.userObj.firstName, $scope.userObj.lastName,
                                $scope.userObj.email, $scope.userObj.securityGroup,
                                $scope.userObj.homePage, $scope.userObj.timezone,
                                $scope.userObj.accountLocked, record.entity.loginID,
                                $scope.userObj.temprature,mobileNumber)
                                .then(function (objData) {
                                    if (!angular.isUndefinedOrNull(objData) &&
                                        (objData.type === true)) {
                                        $sessionStorage.put('temprature',
                                            $scope.userObj.temprature);
                                        if (objCacheDetails.userDetails.userID ===
                                            $scope.userObj.userID) {
                                            swal('User is Updated Successfully. ' +
                                                'Please re-login to reflect the changes!');
                                            $state.go('login');
                                        } else {
                                            swal(objData.output);
                                            reload();
                                        }
                                    } else {
                                        swal(objData.Message);
                                        reload();
                                    }
                                });
                        } else {
                            administrationService.AddUser($scope.userObj.userID,
                                $scope.userObj.firstName, $scope.userObj.lastName,
                                $scope.userObj.email, $scope.userObj.securityGroup,
                                $scope.userObj.homePage, $scope.userObj.timezone,
                                $scope.userObj.accountLocked, $scope.userObj.temprature,mobileNumber)
                                .then(function (objData) {
                                    if (!angular.isUndefinedOrNull(objData) && (objData.type === true)) {
                                        $sessionStorage.put('temprature', $scope.userObj.temprature);
                                        swal(objData.output);
                                    } else {
                                        swal(objData.Message);
                                    }
                                    $state.reload();
                                    $modalInstance.dismiss();
                                });
                        }
                    };
                }]);
})(window.angular);