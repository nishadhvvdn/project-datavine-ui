(function (angular) {

    "use strict";

    angular.module('dataVINEApp').controller('onlineHelpCtrl', function ($scope, $state,onlineHelpService) {

        /*---------------------------for vertical menu------------------------ */
        $scope.showReport = true;
        $scope.showHyper = true;
        $scope.showMeter = true;
        $scope.showSystem = true;
        $scope.showTools = true;
        $scope.showAdministration = true;
        $scope.showconfig = true;
        $scope.showMMconfig = true;
        $scope.tabs = {};
        $scope.tabs.changingAccount = true;
        $scope.tabs.readingReport = true;
        $scope.tabChange = function (tabValue) {
            $scope.tabs = onlineHelpService.tabSet(tabValue);
        }
        $scope.displayReport = function () {
            $scope.showReport = !$scope.showReport;
            $scope.showHyper = true;
            $scope.showMeter = true;
            $scope.showSystem = true;
            $scope.showTools = true;
            $scope.showAdministration = true;
            $scope.showconfig = true;
            $scope.showMMconfig = true;
            $scope.tabs.changingAccount = true;
            $scope.tabs = {};
            $scope.tabs.readingReport = true;
            $scope.tabChange = function (tabValue) {
                $scope.tabs = onlineHelpService.tabSet(tabValue);
            }
        }


        $scope.displayHypersprout = function () {
            $scope.showHyper = !$scope.showHyper;
            $scope.showMeter = true;
            $scope.showSystem = true;
            $scope.showTools = true;
            $scope.showAdministration = true;
            $scope.showReport = true;
            $scope.showconfig = true;
            $scope.showMMconfig = true;
            $scope.tabs.changingAccount = true;
            $scope.tabs = {};
            $scope.tabs.readingReport = true;
            $scope.tabChange = function (tabValue) {
                $scope.tabs = onlineHelpService.tabSet(tabValue);
            }

        }
        $scope.displayMeter = function () {
            $scope.showMeter = !$scope.showMeter;
            $scope.showReport = true;
            $scope.showHyper = true;
            $scope.showSystem = true;
            $scope.showTools = true;
            $scope.showAdministration = true;
            $scope.showconfig = true;
            $scope.showMMconfig = true;
            $scope.tabs.changingAccount = true;
            $scope.tabs = {};
            $scope.tabs.readingReport = true;
            $scope.tabChange = function (tabValue) {
                $scope.tabs = onlineHelpService.tabSet(tabValue);
            }

        }
        $scope.displaySystem = function () {
            $scope.showSystem = !$scope.showSystem;
            $scope.showReport = true;
            $scope.showHyper = true;
            $scope.showMeter = true;
            $scope.showTools = true;
            $scope.showAdministration = true;
            $scope.showconfig = true;
            $scope.showMMconfig = true;
            $scope.tabs = {};
            $scope.tabs.readingReport = true;
            $scope.tabChange = function (tabValue) {
                $scope.tabs = onlineHelpService.tabSet(tabValue);
            }

        }
        $scope.displayTools = function () {
            $scope.showTools = !$scope.showTools;
            $scope.showReport = true;
            $scope.showHyper = true;
            $scope.showMeter = true;
            $scope.showSystem = true;
            $scope.showAdministration = true;
            $scope.showconfig = true;
            $scope.showMMconfig = true;
            $scope.tabs = {};
            $scope.tabs.readingReport = true;
            $scope.tabChange = function (tabValue) {
                $scope.tabs = onlineHelpService.tabSet(tabValue);
            }

        }
        $scope.displayAdministration = function () {
            $scope.showAdministration = !$scope.showAdministration;
            $scope.showReport = true;
            $scope.showHyper = true;
            $scope.showMeter = true;
            $scope.showSystem = true;
            $scope.showTools = true;
            $scope.showconfig = true;
            $scope.showMMconfig = true;
            $scope.tabs = {};
            $scope.tabs.readingReport = true;
            $scope.tabChange = function (tabValue) {
                $scope.tabs = onlineHelpService.tabSet(tabValue);
            }

        }
        $scope.gotoConfigurationManagement = function () {
            $scope.showconfig = !$scope.showconfig;
            $scope.showReport = true;
            //$scope.showHyper = true;
            $scope.showMeter = true;
            $scope.showSystem = true;
            $scope.showTools = true;
            $scope.showAdministration = true;
            $scope.showMMconfig = true;
            $scope.tabs = {};
            $scope.tabs.readingReport = true;
            $scope.tabChange = function (tabValue) {
                $scope.tabs = onlineHelpService.tabSet(tabValue);
            }

        }
        $scope.gotoMeterManagement = function () {
            $scope.showMMconfig = !$scope.showMMconfig;
            $scope.showReport = true;
            $scope.showHyper = true;
            //$scope.showMeter = true;
            $scope.showSystem = true;
            $scope.showTools = true;
            $scope.showAdministration = true;
            $scope.showconfig = true;
            $scope.showconfig = true;
            $scope.tabs = {};
            $scope.tabs.readingReport = true;
            $scope.tabChange = function (tabValue) {
                $scope.tabs = onlineHelpService.tabSet(tabValue);
            }
        }
        $scope.homePage = function () {
            $scope.showReport = true;
            $scope.showHyper = true;
            $scope.showMeter = true;
            $scope.showSystem = true;
            $scope.showTools = true;
            $scope.showAdministration = true;
            $scope.showconfig = true;
            $scope.showMMconfig = true;
            $scope.tabs = {};
            $scope.tabs.readingReport = true;
            $scope.tabChange = function (tabValue) {
                $scope.tabs = onlineHelpService.tabSet(tabValue);
            }
        }
        if (!angular.isUndefinedOrNull($state.current) &&
            $state.current.name === 'help') {
            $state.go('help.home');
            // $location.path('/system/registration/circuitEntry');
        }


    })
})(window.angular);