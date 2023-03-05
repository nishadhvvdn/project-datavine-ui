/**
  * @this vm
  * @ngdoc controller
  * @name dataVINEApp.controller:changePasswordCtrl
  *
  * @description
  * Controller for Changing Password
*/
(function (angular) {
    "use strict";
    angular.module('dataVINEApp')
        .controller('changePasswordCtrl',
            ['$scope', '$modalInstance', '$state',
                'toolsService', 'obj', 'type', '$controller',
                'administrationService',
                function ($scope, $modalInstance, $state,
                    toolsService, obj, type, $controller,
                    administrationService) {
                    $scope.changePass = {};
                    $scope.changePassBeforeLogin = {};
                    $scope.userId = obj.usedID;
                    $scope.changePass.userId = obj.usedID;
                    $scope.type = type;
                    administrationService.UpdatedPasswordSettings()
                        .then(function (objData) {
                            if (!angular.isUndefinedOrNull(objData) &&
                                !angular.isUndefinedOrNull(objData.output)) {
                                $scope.changePass.length = 6;
                                $scope.changePass.EnablePasswordPolicy = objData.output[0].Type.Settings.EnablePasswordPolicy;
                                if (objData.output[0].Type.Settings.EnablePasswordPolicy)
                                    $scope.changePass.length = objData.output[0].Type.Settings.MinimumPasswordLength;
                            }
                        });

                    $scope.passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,10}$/;
                    $scope.validatePassword = function (field) {
                        if(field === 'oldPassword') {
                            if($scope.changePass.oldPswd) {
                                $scope.errorOldPasswordMessage = '';
                                $scope.errorOldPassword = false;
                                $scope.changePassWordForm.oldPswd.$valid = true;
                            } else {
                                $scope.errorOldPasswordMessage = 'Old Password is required!';
                                $scope.errorOldPassword = true;
                                $scope.changePassWordForm.oldPswd.$valid = false;
                            }
                        } else if (field === 'newPassword') {
                            if ($scope.changePass.newPswd) {
                                if ($scope.changePass.newPswd.length >= $scope.changePass.length) {
                                    if ($scope.passwordRegex.test($scope.changePass.newPswd)) {
                                        if($scope.changePass.oldPswd && $scope.changePass.newPswd
                                            && ($scope.changePass.oldPswd === $scope.changePass.newPswd)){
                                            $scope.errorNewPasswordMessage = `Old and new password can't be same`;
                                            $scope.errorNewPassword = true;
                                            $scope.changePassWordForm.newPswd.$valid = false;
                                        } else {
                                            $scope.errorNewPasswordMessage = '';
                                            $scope.errorNewPassword = true;
                                            $scope.changePassWordForm.newPswd.$valid = true;
                                            if($scope.changePass.newPswdConf) {
                                                this.validatePassword('newConfirmPassword');
                                            }
                                        }
                                    } else {
                                        $scope.errorNewPasswordMessage = 'Password should contain at least one number and 1 special character!';
                                        $scope.errorNewPassword = true;
                                        $scope.changePassWordForm.newPswd.$valid = false;
                                    }
                                } else if ($scope.changePass.newPswd.length < $scope.changePass.length) {
                                    $scope.errorNewPasswordMessage = `Minimum password length should be ${$scope.changePass.length}`;
                                    $scope.errorNewPassword = true;
                                    $scope.changePassWordForm.newPswd.$valid = false;
                                } else {}
                            } else {
                                $scope.errorNewPasswordMessage = 'New Password is required!';
                                $scope.errorNewPassword = true;
                                $scope.changePassWordForm.newPswd.$valid = false;
                            }
                        }
                        else if(field === 'newConfirmPassword') {
                            if ($scope.changePass.newPswdConf) {
                                if($scope.changePass.newPswd && $scope.changePass.newPswdConf
                                    && ($scope.changePass.newPswd.trim().length !== 0 && $scope.changePass.newPswdConf.trim().length !== 0)
                                    && ($scope.changePass.newPswd === $scope.changePass.newPswdConf)) {
                                    $scope.errorNewConfirmPasswordMessage = '';
                                    $scope.errorNewConfirmPassword = false;
                                    $scope.changePassWordForm.newPswdConf.$valid = true;
                                } else {
                                    $scope.errorNewConfirmPasswordMessage = 'Confirm Password mismatch!';
                                    $scope.errorNewConfirmPassword = true;
                                    $scope.changePassWordForm.newPswdConf.$valid = false;
                                }
                            } else {
                                $scope.errorNewConfirmPasswordMessage = 'Confirm Password is required!';
                                $scope.errorNewConfirmPassword = true;
                                $scope.changePassWordForm.newPswdConf.$valid = false;
                            }
                        }
                    };
                    /**
                      * @description
                      * Function to Save the Password
                      *
                      * @param Nil
                      * @return Nil
                    */
                    $scope.Save = function () {
                        toolsService.ChangePassword($scope.changePass.userId,
                            $scope.changePass.oldPswd, $scope.changePass.newPswd,
                            obj.loginId, (type === 2) ? true : false)
                            .then(function (objData) {
                                if (!angular.isUndefinedOrNull(objData) &&
                                    (objData.type)) {
                                    $modalInstance.dismiss();
                                    if (type === 1) {
                                        swal(objData.output);
                                        $state.reload();
                                    } else {
                                        $controller('loginCtrl', { $scope: $scope });
                                        $scope.email = $scope.changePass.userId;
                                        $scope.password = $scope.changePass.newPswd;
                                        $scope.loginForm();
                                    }
                                } else {
                                    swal(objData.Message);
                                }
                            });
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
                }]);
})(window.angular);
