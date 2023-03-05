(function (angular) {

    "use strict";

    angular.module('onlineHelp').service('onlineHelpService', function () {
        this.tabSet = function (tab) {
            var obj = {
                'readingReport': false,
                'exportingReport': false,
                'filterReport': false,
                'printReport': false,
                'sortReport': false,
                'changingAccount': false,
                'changingPassword': false,
                'setReport': false,
                'editReport': false,
                'addReport': false,
                'deleteReport': false,
                'resetReport': false,
                'configurationIcon': false,
                'deltalinkmeterIcon': false,
                'technicallossIcon': false,
                'factoryresetIcon': false,
                'rebootdeviceIcon': false,
                'logsIcon': false,
                'lockunlockIcon': false
            };
            if ('readingReport' === tab) {
                obj.readingReport = true;
            } else if ('exportingReport' === tab) {
                obj.exportingReport = true;
            } else if ('filterReport' === tab) {
                obj.filterReport = true;
            } else if ('printReport' === tab) {
                obj.printReport = true;
            } else if ('sortReport' === tab) {
                obj.sortReport = true;
            } else if ('changingAccount' === tab) {
                obj.changingAccount = true;
            } else if ('changingPassword' === tab) {
                obj.changingPassword = true;
            } else if ('setReport' === tab) {
                obj.setReport = true;
            } else if ('editReport' === tab) {
                obj.editReport = true;
            } else if ('addReport' === tab) {
                obj.addReport = true;
            } else if ('deleteReport' === tab) {
                obj.deleteReport = true;
            } else if ('resetReport' === tab) {
                obj.resetReport = true;
            } else if ('configurationIcon' === tab) {
                obj.configurationIcon = true;
            } else if ('deltalinkmeterIcon' === tab) {
                obj.deltalinkmeterIcon = true;
            } else if ('technicallossIcon' === tab) {
                obj.technicallossIcon = true;
            } else if ('factoryresetIcon' === tab) {
                obj.factoryresetIcon = true;
            } else if ('rebootdeviceIcon' === tab) {
                obj.rebootdeviceIcon = true;
            } else if ('logsIcon' === tab) {
                obj.logsIcon = true;
            } else if ('lockunlockIcon' === tab) {
                obj.lockunlockIcon = true;
            }
            return obj;
        }
    })

})(window.angular);
