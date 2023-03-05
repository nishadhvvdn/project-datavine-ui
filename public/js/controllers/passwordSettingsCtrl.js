/**
 * @description
 * Controller for setting password
 */
(function (angular) {
    "use strict";
    angular.module('dataVINEApp').controller('passwordSettingsCtrl',
        ['$scope', '$modalInstance', '$state', 'administrationService',
            function ($scope, $modalInstance, $state, administrationService) {
                init();

                /**
                 * Function to initialize password settings
                 */
                function init() {
                    administrationService.UpdatedPasswordSettings()
                        .then(function (objData) {
                            if (!angular.isUndefinedOrNull(objData) &&
                                !angular.isUndefinedOrNull(objData.output)) {
                                $scope.passwordPolicy =
                                    objData.output[0].Type.Settings.EnablePasswordPolicy;
                                $scope.minPasswordAge =
                                    objData.output[0].Type.Settings.MinimumPasswordAge;
                                $scope.maxPasswordAge =
                                    objData.output[0].Type.Settings.MaximumPasswordAge;
                                $scope.passwordsToStore =
                                    objData.output[0].Type.Settings
                                        .NumberofPasswordstoStore;
                                $scope.logonFailures =
                                    objData.output[0].Type.Settings
                                        .MaximumLogonFailuresbeforeLockout;
                                $scope.lockoutDuration =
                                    objData.output[0].Type.Settings.LockoutDuration;
                                $scope.minPassLength =
                                    objData.output[0].Type.Settings.MinimumPasswordLength;
                            }
                        });
                }

                /**
                 * @description
                 * Function to close pop-up
                 *
                 * @param nil 
                 * @return Nil
                 
                 */
                $scope.cancel = function () {
                    $modalInstance.dismiss();
                };
                $scope.passValidation = {};

                /**
                 *  @description
                 * Function to validate password
                 *
                 * @param evt 
                 * @param type 
                 * @return Nil
                 
                 */
                $scope.check = function (evt, type) {
                    if (type === 'minPassLength') {
                        $scope.passValidation.minPassLength = true;
                        if (parseInt($scope.minPassLength) >= 6 &&
                            parseInt($scope.minPassLength) <= 10) {
                            $scope.passValidation.minPassLength = false;
                        }
                    } else if (type === 'lockoutDuration') {
                        $scope.passValidation.lockoutDuration = true;
                        if (parseInt($scope.lockoutDuration) >= 1 &&
                            parseInt($scope.lockoutDuration) <= 999) {
                            $scope.passValidation.lockoutDuration = false;
                        }
                    } else if (type === 'logonFailures') {
                        $scope.passValidation.logonFailures = true;
                        if (parseInt($scope.logonFailures) >= 0 &&
                            parseInt($scope.logonFailures) <= 20) {
                            $scope.passValidation.logonFailures = false;
                        }
                    } else if (type === 'passwordsToStore') {
                        $scope.passValidation.passwordsToStore = true;
                        if (parseInt($scope.passwordsToStore) >= 1 &&
                            parseInt($scope.passwordsToStore) <= 10) {
                            $scope.passValidation.passwordsToStore = false;
                        }
                    } else if (type === 'maxPasswordAge') {
                        $scope.passValidation.maxPasswordAge = true;
                        if (parseInt($scope.maxPasswordAge) >= 10 &&
                            parseInt($scope.maxPasswordAge) <= 999) {
                            $scope.passValidation.maxPasswordAge = false;
                        }
                    }
                };

                /**
                 *  @description
                 * Function to Reset the default password settings
                 *
                 * @param resetForm 
                 * @return Nil
                 
                 */
                $scope.restoreDefaults = function (resetForm) {
                    administrationService.RestoreDefaultPasswordSettings()
                        .then(function (objData) {
                            if (!angular.isUndefinedOrNull(objData) &&
                                (objData.type)) {
                                $scope.passwordPolicy =
                                    objData.output[0].EnablePasswordPolicy;
                                $scope.minPasswordAge =
                                    objData.output[0].Type.Settings.MinimumPasswordAge;
                                $scope.maxPasswordAge =
                                    objData.output[0].Type.Settings.MaximumPasswordAge;
                                $scope.passwordsToStore =
                                    objData.output[0].Type.Settings
                                        .NumberofPasswordstoStore;
                                $scope.logonFailures =
                                    objData.output[0].Type.Settings
                                        .MaximumLogonFailuresbeforeLockout;
                                $scope.lockoutDuration =
                                    objData.output[0].Type.Settings.LockoutDuration;
                                $scope.minPassLength =
                                    objData.output[0].Type.Settings
                                        .MinimumPasswordLength;
                                swal('Restored successfully!');
                            } else {
                                swal(objData.Message);
                            }
                            $state.reload();
                        });
                    angular.copy({}, resetForm);
                };

                /**
                 * @description
                 * Function to save new password
                 *
                 * @param resetForm 
                 * @return Nil
                 
                 */
                $scope.Save = function () {
                    var passwordSettings = {
                        MaximumPasswordAge: parseInt($scope.maxPasswordAge),
                        NumberofPasswordstoStore: parseInt($scope.passwordsToStore),
                        MaximumLogonFailuresbeforeLockout: parseInt($scope.logonFailures),
                        LockoutDuration: parseInt($scope.lockoutDuration),
                        MinimumPasswordLength: parseInt($scope.minPassLength),
                        EnablePasswordPolicy: $scope.passwordPolicy
                    };
                    administrationService.SavePasswordSettings(passwordSettings)
                        .then(function (objData) {
                            if (!angular.isUndefinedOrNull(objData) && (objData.type)) {
                                swal(objData.output);
                            } else {
                                swal(objData.Message);
                            }
                            $state.reload();
                            $modalInstance.dismiss();
                        });
                };
            }]);
})(window.angular);