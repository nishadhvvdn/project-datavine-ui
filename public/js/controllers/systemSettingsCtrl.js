/**
 * @description
 * Controller for System Settings
 */
(function (angular) {
    "use strict";
    angular.module('dataVINEApp').controller('systemSettingsCtrl',
        ['$sessionStorage', '$scope', '$rootScope', '$state', 'administrationService', 'commonService',
            function ($sessionStorage, $scope, $rootScope, $state, administrationService, commonService) {
                $scope.forms= {};
                $scope.configDisc = ['Correct'];
                let decimalPointPattern = /^\d+(\.\d{1,4})?$/;
                let decimalPointPatternLineLoss = /^\d+(\.\d{1,2})?$/;
                init();
                $scope.obj = {};
                $scope.objMisc = {};
                $scope.objReport = {};
                $scope.obj.HypersproutTransactionPoolingInterval = 15;
                $scope.obj.RetryAttemtCEtoHS = 3;
                $scope.objReport.newAccountReportTimePeriod = 30;
                $scope.objMisc.DefaultDataDisplayPeriod = 30;

                /**
                 * Function to initialize system settings data
                 */
                function init() {
                    $scope.resetValues = 5;
                    administrationService.UpdatedSystemSettings()
                        .then(function (objData) {
                            if (!angular.isUndefinedOrNull(objData) &&
                                !angular.isUndefinedOrNull(objData.output)) {
                                var systemSettingUpdate = objData.output[0].Type.Values;
                                var systemMiscelaneousSetting =
                                    objData.output[4].Type.Values;
                                var systemReportSetting = objData.output[6].Type.Values;
                                $scope.obj.configDiscrepancy =
                                    systemSettingUpdate.ConfigurationDescrepancyHandling;
                                $scope.obj.HypersproutTransactionPoolingInterval =
                                    systemSettingUpdate.HypersproutTransactionPoolingInterval;
                                $scope.obj.RetryAttemtCEtoHS =
                                    systemSettingUpdate.RetryAttemtCEtoHS;
                                $scope.obj.lineLossFactor =
                                ((systemSettingUpdate.LineLossFactor * 100).toFixed(2)).toString();
                                $scope.obj.hyperSproutLoss =
                                    (systemSettingUpdate.HyperSproutLoss * 1000).toString();
                                $scope.obj.hyperHubLoss =
                                    (systemSettingUpdate.HyperHubLoss * 1000).toString();
                                $scope.objReport.noOfDecimalPlaces =
                                    systemReportSetting.NumberofDecimalPlaces;
                                $scope.objReport.newAccountReportTimePeriod =
                                    systemReportSetting.newAccountReportTimePeriod;
                                $scope.objMisc.noOfRows =
                                    systemMiscelaneousSetting.NumberofRowstoDisplayPerPage;
                                $scope.objMisc.DefaultDataDisplayPeriod =
                                    systemMiscelaneousSetting.DefaultDataDisplayPeriod;
                                
                                $rootScope.commonMsg = '';
                            }
                        });
                }

                $scope.defaultHypersproutTransactionPoolingInterval = 15;
                $scope.defaultRetryAttemtCEtoHS = 3;
                $scope.defaultConfigDiscrepancy = 'Flag';
                $scope.defaultDataDisplayPeriod = 30;
                $scope.defaultNumberofRowstoDisplayPerPage = 100;
                $scope.defaultNewAccountReportTimePeriod = 30;
                $scope.defaultLineLossFactor = 1;
                $scope.defaultHyperSproutLoss = 14.95;
                $scope.defaultHyperHubLoss = 14.95;

                /**
                 *  @description
                 * Function to Restore system settings to default settings
                 *
                 * @param resetForm
                 * @return Nil
                
                 */
                $scope.restoreDefaults = function (resetForm) {
                    var tabHeading = 'Communications';
                    administrationService.RestoreDefaultSettings(tabHeading)
                        .then(function (objData) {
                            if (!angular.isUndefinedOrNull(objData) &&
                                (objData.type)) {
                                var systemSettingUpdate = objData.output[0].Type.Values;
                                $scope.obj.RetryAttemtCEtoHS =
                                    $scope.defaultRetryAttemtCEtoHS;
                                $scope.obj.configDiscrepancy =
                                    $scope.defaultConfigDiscrepancy;
                                $scope.obj.HypersproutTransactionPoolingInterval =
                                    $scope.defaultHypersproutTransactionPoolingInterval;
                                $scope.obj.lineLossFactor =
                                    ($scope.defaultLineLossFactor).toString();
                                $scope.obj.hyperSproutLoss =
                                    ($scope.defaultHyperSproutLoss).toString();
                                $scope.obj.hyperHubLoss =
                                    ($scope.defaultHyperHubLoss).toString();
                                    setTimeout(function () {
                                        $scope.validateFields('lineLossFactor');
                                        $scope.validateFields('hyperSproutLoss');
                                        $scope.validateFields('hyperHubLoss');
                                    }, 100);
                                   
                                $rootScope.commonMsg = '';
                                swal(commonService.addTrademark(objData.output));
                            } else {
                                $rootScope.commonMsg = 'No data found!';
                                swal(commonService.addTrademark(objData.Message));
                            }
                        });
                    angular.copy({}, resetForm);
                };

                /**
                 * @description
                 * Function tp Restore Miscellaneous default settings
                 *
                 * @param resetForm
                 * @return Nil
                 
                 */
                $scope.restoreMiscDefaults = function (resetForm) {
                    var tabHeading = 'Miscellaneous';
                    administrationService.RestoreDefaultSettings(tabHeading)
                        .then(function (objData) {
                            if (!angular.isUndefinedOrNull(objData) &&
                                (objData.type)) {
                                var systemMiscelaneousSetting =
                                    objData.output[0].Type.Values;
                                $scope.objMisc.restrictedMenuItems =
                                    systemMiscelaneousSetting.DisplayRestrictedMenuItems;
                                $scope.objMisc.noOfRows =
                                    $scope.defaultNumberofRowstoDisplayPerPage;
                                $scope.objMisc.DefaultDataDisplayPeriod =
                                    $scope.defaultDataDisplayPeriod;
                                swal(commonService.addTrademark(objData.output));
                            } else {
                                swal(commonService.addTrademark(objData.Message));
                            }
                        });
                    angular.copy({}, resetForm);
                };

                /**
                 *  @description
                 * Function to Restore Reporting default settings
                 *
                 * @param resetForm
                 * @return Nil
                 
                 */
                $scope.restoreReportingDefaults = function (resetForm) {
                    var tabHeading = 'Reporting';
                    administrationService.RestoreDefaultSettings(tabHeading).
                        then(function (objData) {
                            if (!angular.isUndefinedOrNull(objData) &&
                                (objData.type)) {
                                var systemReportSetting =
                                    objData.output[0].Type.Values;
                                $scope.objReport.noOfDecimalPlaces =
                                    systemReportSetting.NumberofDecimalPlaces;
                                $scope.objReport.newAccountReportTimePeriod =
                                    $scope.defaultNewAccountReportTimePeriod;
                                swal(commonService.addTrademark(objData.output));
                            } else {
                                swal(commonService.addTrademark(objData.Message));
                            }
                        });
                    angular.copy({}, resetForm);
                };

                /**
                 * @description
                 * Function to create settings for communication
                 *
                 * @param Nil
                 * @return Nil
                 
                 */
                $scope.Save = function () {
                    var tabHeading = 'Communications';
                    var saveSettings = {
                        RetryAttemtCEtoHS: $scope.obj.RetryAttemtCEtoHS,
                        ConfigurationDescrepancyHandling: $scope.obj.configDiscrepancy,
                        HypersproutTransactionPoolingInterval: $scope
                            .obj.HypersproutTransactionPoolingInterval,
                        LineLossFactor: parseFloat($scope.obj.lineLossFactor/100),
                        HyperSproutLoss: parseFloat($scope.obj.hyperSproutLoss/1000),
                        HyperHubLoss: parseFloat($scope.obj.hyperHubLoss/1000)
                    };
                    administrationService
                        .SaveSystemSettings(tabHeading, saveSettings)
                        .then(function (objData) {
                            if (!angular.isUndefinedOrNull(objData) &&
                                (objData.type)) {
                                swal(commonService.addTrademark(objData.output));
                                init();
                            } else {
                                swal(commonService.addTrademark(objData.Message));
                            }
                        });
                };
                /**
                 * @description
                 * Function to create settings for Miscellaneous
                 *
                 * @param Nil
                 * @return Nil
                 
                 */
                $scope.SaveMisc = function () {
                    var tabHeading = 'Miscellaneous';
                    var saveSettings = {
                        NumberofRowstoDisplayPerPage: $scope.objMisc.noOfRows,
                        DefaultDataDisplayPeriod: $scope.objMisc.DefaultDataDisplayPeriod
                    };
                    administrationService
                        .SaveSystemSettings(tabHeading, saveSettings)
                        .then(function (objData) {
                            if (!angular.isUndefinedOrNull(objData) &&
                                (objData.type)) {
                                $sessionStorage.put('displayPerpage',
                                    $scope.objMisc.noOfRows);
                                objCacheDetails.grid.paginationPageSize =
                                    $scope.objMisc.noOfRows;
                                objCacheDetails.userDetails.DefaultDataDisplayPeriod =
                                    $scope.objMisc.DefaultDataDisplayPeriod;
                                swal(commonService.addTrademark(objData.output));
                                init();
                            } else {
                                swal(commonService.addTrademark(objData.Message));
                            }
                        });
                };

                /**
                 * @description
                 * Function to create settings for Reporting
                 *
                 * @param Nil
                 * @return Nil
                 
                 */
                $scope.SaveRport = function () {
                    var tabHeading = 'Reporting';
                    var saveSettings = {
                        newAccountReportTimePeriod: $scope
                            .objReport.newAccountReportTimePeriod,
                    };
                    administrationService
                        .SaveSystemSettings(tabHeading, saveSettings)
                        .then(function (objData) {
                            if (!angular.isUndefinedOrNull(objData) &&
                                (objData.type)) {
                                objCacheDetails.userDetails
                                    .newAccountReportTimePeriod = $scope
                                        .objReport.newAccountReportTimePeriod;
                                swal(commonService.addTrademark(objData.output));
                                init();
                            } else {
                                swal(commonService.addTrademark(objData.Message));
                            }
                        });
                };
                /**
                 *  @description
                 * Function to Restore Reporting default settings
                 *
                 * @param resetPreviousValues
                 * @return Nil
                 
                 */
                $scope.resetPreviousValues = function () {
                    init();
                    setTimeout(function () {
                        $scope.validateFields('lineLossFactor');
                        $scope.validateFields('hyperSproutLoss');
                        $scope.validateFields('hyperHubLoss');
                    }, 100);
                }

                      /**
                 *  @description
                 * Function to validate transformer data
                 *
                 * @param field
                 * @return Nil

                 */
                $scope.validateFields = function (field) {
                    if (field === 'lineLossFactor') {
                        $scope.errorLineLossFactor = false;
                        $scope.forms.commSettingsForm.lineLossFactor.$valid = true;
                        if ($scope.obj.lineLossFactor === undefined ||
                            $scope.obj.lineLossFactor.trim().length === 0) {
                            $scope.errorLineLossFactorMessage = 'Line Loss Factor is required!';
                            $scope.errorLineLossFactor = true;
                            $scope.forms.commSettingsForm.lineLossFactor.$valid = false;
                        } else if (!decimalPointPatternLineLoss.test($scope.obj.lineLossFactor)) {
                            $scope.errorLineLossFactorMessage = 'Invalid Line Loss Factor!';
                            $scope.errorLineLossFactor = true;
                            $scope.forms.commSettingsForm.lineLossFactor.$valid = false;
                        } else if ($scope.obj.lineLossFactor < 0 || $scope.obj.lineLossFactor > 100) {
                            $scope.errorLineLossFactorMessage = 'Invalid Line Loss Factor! The range of Line Loss Factor is 0 to 100';
                            $scope.errorLineLossFactor = true;
                            $scope.forms.commSettingsForm.lineLossFactor.$valid = false;
                        } else {
                            $scope.errorLineLossFactor = false;
                            $scope.forms.commSettingsForm.lineLossFactor.$valid = true;
                        }
                    } else  if (field === 'hyperSproutLoss') {
                        $scope.errorHyperSproutLoss = false;
                        $scope.forms.commSettingsForm.hyperSproutLoss.$valid = true;
                        if ($scope.obj.hyperSproutLoss === undefined ||
                            $scope.obj.hyperSproutLoss.trim().length === 0) {
                            $scope.errorHyperSproutLossMessage = 'HyperSPROUT\u2122 Loss is required!';
                            $scope.errorHyperSproutLoss = true;
                            $scope.forms.commSettingsForm.hyperSproutLoss.$valid = false;
                        } else if (!decimalPointPattern.test($scope.obj.hyperSproutLoss)) {
                            $scope.errorHyperSproutLossMessage = 'Invalid HyperSPROUT\u2122 Loss!';
                            $scope.errorHyperSproutLoss = true;
                            $scope.forms.commSettingsForm.hyperSproutLoss.$valid = false;
                        } else if ($scope.obj.hyperSproutLoss < 10 || $scope.obj.hyperSproutLoss > 60) {
                            $scope.errorHyperSproutLossMessage = 'Invalid HyperSPROUT\u2122 Loss! The range of HyperSPROUT\u2122 Loss is 10 to 60';
                            $scope.errorHyperSproutLoss = true;
                            $scope.forms.commSettingsForm.hyperSproutLoss.$valid = false;
                        } else {
                            $scope.errorHyperSproutLoss = false;
                            $scope.forms.commSettingsForm.hyperSproutLoss.$valid = true;
                        }
                    } else  if (field === 'hyperHubLoss') {
                        $scope.errorHyperHubLoss = false;
                        $scope.forms.commSettingsForm.hyperHubLoss.$valid = true;
                        if ($scope.obj.hyperHubLoss === undefined ||
                            $scope.obj.hyperHubLoss.trim().length === 0) {
                            $scope.errorHyperHubLossMessage = 'HyperHUB\u2122 Loss is required!';
                            $scope.errorHyperHubLoss = true;
                            $scope.forms.commSettingsForm.hyperHubLoss.$valid = false;
                        } else if (!decimalPointPattern.test($scope.obj.hyperHubLoss)) {
                            $scope.errorHyperHubLossMessage = 'Invalid HyperHUB\u2122 Loss!';
                            $scope.errorHyperHubLoss = true;
                            $scope.forms.commSettingsForm.hyperHubLoss.$valid = false;
                        } else if ($scope.obj.hyperHubLoss < 10 || $scope.obj.hyperHubLoss > 60) {
                            $scope.errorHyperHubLossMessage = 'Invalid HyperHUB\u2122 Loss! The range of HyperHUB\u2122 Loss is 10 to 60';
                            $scope.errorHyperHubLoss = true;
                            $scope.forms.commSettingsForm.hyperHubLoss.$valid = false;
                        } else {
                            $scope.errorHyperHubLoss = false;
                            $scope.forms.commSettingsForm.hyperHubLoss.$valid = true;
                        }
                    }
                    $scope.system_setting_valid = $scope.errorLineLossFactor || $scope.errorHyperSproutLoss || $scope.errorHyperHubLoss;
                };
            }]);
})(window.angular);
