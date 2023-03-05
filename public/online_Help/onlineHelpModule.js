(function (angular) {

    "use strict";

    angular.module('onlineHelp', ['ui.router', 'ui.bootstrap', 'ncy-angular-breadcrumb'])

        // configure our routes
        .config(function ($stateProvider, $urlRouterProvider) {
            $urlRouterProvider.otherwise("/home");
            $stateProvider
                .state('help', {
                    abstarct: true,
                    url: '/help',
                    templateUrl: 'online_Help/onlineHelpHome.html',
                    controller: 'onlineHelpCtrl'
                }).state('help.home', {
                    url: '/home',
                    templateUrl: 'online_Help/home.html',
                    controller: function ($scope) {
                        $scope.tabChange = function () {

                        }
                    }
                })
                //----------------------administration route-------------------------------------------
                .state('help.administration', {
                    url: '/administration',
                    templateUrl: 'online_Help/Administration/administration.html',
                    controller:'onlineHelpCtrl'
                })
                .state('help.security', {
                    url: '/security',
                    templateUrl: 'online_Help/Administration/security.html',
                    controller: 'onlineHelpCtrl'
                })

                .state('help.systemSetting', {
                    url: '/systemSetting',
                    templateUrl: 'online_Help/Administration/systemSetting.html',
                    controller: 'onlineHelpCtrl'
                })
                .state('help.defineUser', {
                    url: '/defineUser',
                    templateUrl: 'online_Help/Administration/defineUser.html',
                    controller:'onlineHelpCtrl'
                })
                .state('help.dashboard', {
                    url: '/dashboard',
                    templateUrl: 'online_Help/Administration/dashboard.html',
                    controller:'onlineHelpCtrl'
                })

                //-----------------Report Route Start-------------------------//
                .state('help.report', {
                    url: '/report',
                    templateUrl: 'online_Help/Report/report.html',
                    controller: 'onlineHelpCtrl' 
                })

                .state('help.communicationStatistics', {
                    url: '/communicationStatistics',
                    templateUrl: 'online_Help/Report/communicationStatistics.html',
                    controller: 'onlineHelpCtrl'
                })
                .state('help.dataVINEHealth', {
                    url: '/dataVINEHealth',
                    templateUrl: 'online_Help/Report/dataVINEHealth.html',
                    controller: 'onlineHelpCtrl'
                })
                .state('help.systemLog', {
                    url: '/systemLog',
                    templateUrl: 'online_Help/Report/systemLog.html',
                    controller: 'onlineHelpCtrl'
                })
                .state('help.newAccounts', {
                    url: '/newAccounts',
                    templateUrl: 'online_Help/Report/newAccounts.html',
                    controller: 'onlineHelpCtrl'
                })
                // .state('help.batteryLife', {
                //     url: '/batteryLife',
                //     templateUrl: 'online_Help/Report/batteryLife.html',
                //     controller: 'onlineHelpCtrl'
                // })
                .state('help.deviceFirmware', {
                    url: '/deviceFirmware',
                    templateUrl: 'online_Help/Report/deviceFirmware.html',
                    controller: 'onlineHelpCtrl'
                })
                .state('help.systemUpdate', {
                    url: '/systemUpdate',
                    templateUrl: 'online_Help/Report/systemUpdate.html',
                    controller: 'onlineHelpCtrl'
                })
                // .state('help.deviceRegistrationStatus', {
                //     url: '/deviceRegistrationStatus',
                //     templateUrl: 'online_Help/Report/deviceRegistrationStatus.html',
                //     controller: 'onlineHelpCtrl'
                // })
                .state('help.systemAuditLog', {
                    url: '/systemAuditLog',
                    templateUrl: 'online_Help/Report/systemAuditLog.html',
                    controller: 'onlineHelpCtrl'
                })

                //-----------------------------------Hypersprout management route----------------------------
                .state('help.hyperSprout', {
                    url: '/hyperSprout',
                    templateUrl: 'online_Help/HyperSproutManagement/hyperSprout.html',
                    controller: 'onlineHelpCtrl'
                })
                .state('help.hyperConfiguration', {
                    url: '/hyperConfiguration',
                    templateUrl: 'online_Help/HyperSproutManagement/hyperConfiguration.html',
                    controller:'onlineHelpCtrl'
                })
                .state('help.hyperGroup', {
                    url: '/hyperGroup',
                    templateUrl: 'online_Help/HyperSproutManagement/hyperGroup.html',
                    controller: 'onlineHelpCtrl'
                })
                .state('help.hypersecurity', {
                    url: '/hypersecurity',
                    templateUrl: 'online_Help/HyperSproutManagement/hypersecurity.html',
                    controller: 'onlineHelpCtrl'
                })
                .state('help.hyperFirmware', {
                    url: '/hyperFirmware',
                    templateUrl: 'online_Help/HyperSproutManagement/hyperFirmware.html',
                    controller: 'onlineHelpCtrl'
                })
                .state('help.hyperJob', {
                    url: '/hyperJob',
                    templateUrl: 'online_Help/HyperSproutManagement/hyperJob.html',
                    controller: 'onlineHelpCtrl'
                })
                //----------------------------Meter management route Start----------------------
                .state('help.meterManage', {
                    url: '/meterManage',
                    templateUrl: 'online_Help/MeterManagement/meterManage.html',
                    controller: 'onlineHelpCtrl'
                })
                .state('help.meterConfiguration', {
                    url: '/meterConfiguration',
                    templateUrl: 'online_Help/MeterManagement/meterConfiguration.html',
                    controller: 'onlineHelpCtrl'
                })
                .state('help.meterGroup', {
                    url: '/meterGroup',
                    templateUrl: 'online_Help/MeterManagement/meterGroup.html',
                    controller:'onlineHelpCtrl'
                })
                .state('help.meterSecurity', {
                    url: '/meterSecurity',
                    templateUrl: 'online_Help/MeterManagement/meterSecurity.html',
                    controller: 'onlineHelpCtrl'
                })
                .state('help.meterFirmware', {
                    url: '/meterFirmware',
                    templateUrl: 'online_Help/MeterManagement/meterFirmware.html',
                    controller: 'onlineHelpCtrl'
                })
                .state('help.meterJob', {
                    url: '/meterJob',
                    templateUrl: 'online_Help/MeterManagement/meterJob.html',
                    controller: 'onlineHelpCtrl'
                })
                .state('help.meterBulk', {
                    url: '/meterBulk',
                    templateUrl: 'online_Help/MeterManagement/meterBulk.html',
                    controller: 'onlineHelpCtrl'
                })
                .state('help.deltalinkManage', {
                    url: '/deltalinkManage',
                    templateUrl: 'online_Help/DeltaLinkManagement/deltalinkManage.html',
                    controller: 'onlineHelpCtrl'
                })
                .state('help.deltalinkGroup', {
                    url: '/deltalinkGroup',
                    templateUrl: 'online_Help/DeltaLinkManagement/deltalinkGroup.html',
                    controller:'onlineHelpCtrl'
                })
                .state('help.deltalinkFirmware', {
                    url: '/deltalinkFirmware',
                    templateUrl: 'online_Help/DeltaLinkManagement/deltalinkFirmware.html',
                    controller: 'onlineHelpCtrl'
                })
                .state('help.deltalinkJob', {
                    url: '/deltalinkJob',
                    templateUrl: 'online_Help/DeltaLinkManagement/deltalinkJob.html',
                    controller: 'onlineHelpCtrl'
                })
                //----------------------------------System Management route Start-------------------
                .state('help.systemManage', {
                    url: '/systemManage',
                    templateUrl: 'online_Help/SystemManagement/systemManage.html',
                    controller:'onlineHelpCtrl'
                })
                .state('help.systemDevice', {
                    url: '/systemDevice',
                    templateUrl: 'online_Help/SystemManagement/systemDevice.html',
                    controller: 'onlineHelpCtrl'
                })
                .state('help.systemJob', {
                    url: '/systemJob',
                    templateUrl: 'online_Help/SystemManagement/systemJob.html',
                    controller: 'onlineHelpCtrl'
                })
                .state('help.systemNetwork', {
                    url: '/systemNetwork',
                    templateUrl: 'online_Help/SystemManagement/systemNetwork.html',
                    controller: 'onlineHelpCtrl'
                })
                .state('help.systemRegistration', {
                    url: '/systemRegistration',
                    templateUrl: 'online_Help/SystemManagement/systemRegistration.html',
                    controller: 'onlineHelpCtrl'
                })
                .state('help.systemGrouping', {
                    url: '/systemGrouping',
                    templateUrl: 'online_Help/SystemManagement/systemGrouping.html',
                    controller: 'onlineHelpCtrl'
                })
                //-----------------------------Tools route Start-----------------------
                .state('help.tools', {
                    url: '/tools',
                    templateUrl: 'online_Help/Tools/tools.html',
                    controller: 'onlineHelpCtrl'
                })
                .state('help.mySettings', {
                    url: '/mySettings',
                    templateUrl: 'online_Help/Tools/mySettings.html',
                    controller: function ($scope, onlineHelpService) {
                        $scope.tabs = {};
                        $scope.tabs.changingAccount = true;
                        $scope.tabChange = function (tabValue) {
                            $scope.tabs = onlineHelpService.tabSet(tabValue);
                        }
                    }
                })
                .state('help.hsmConfig', {
                    url: '/hsmConfig',
                    templateUrl: 'online_Help/HyperSproutManagement/configProgram.html',
                    controller:'onlineHelpCtrl'
                })
                .state('help.hsmconfiguration', {
                    url: '/hsmconfiguration',
                    templateUrl: 'online_Help/HyperSproutManagement/hsmConfiguration.html',
                    controller: 'onlineHelpCtrl'
                })
                .state('help.hsmDownload', {
                    url: '/hsmDownload',
                    templateUrl: 'online_Help/HyperSproutManagement/hsmDownload.html',
                    controller: 'onlineHelpCtrl'
                })
                .state('help.hsmTag', {
                    url: '/hsmTag',
                    templateUrl: 'online_Help/HyperSproutManagement/hsmTag.html',
                    controller: 'onlineHelpCtrl'
                })
                .state('help.mmConfigProg', {
                    url: '/mmConfigProg',
                    templateUrl: 'online_Help/MeterManagement/mmConfigProg.html',
                    controller: 'onlineHelpCtrl'
                })
                .state('help.mmConfiguration', {
                    url: '/mmConfiguration',
                    templateUrl: 'online_Help/MeterManagement/mmConfiguration.html',
                    controller: 'onlineHelpCtrl'
                })
                .state('help.mmDownload', {
                    url: '/mmDownload',
                    templateUrl: 'online_Help/MeterManagement/mmDownload.html',
                    controller: 'onlineHelpCtrl'
                })
                .state('help.mmTag', {
                    url: '/mmTag',
                    templateUrl: 'online_Help/MeterManagement/mmTag.html',
                    controller: 'onlineHelpCtrl'
                })



        })

})(window.angular);
