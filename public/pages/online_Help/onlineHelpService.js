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
                'resetReport': false
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
            }
            return obj;
        }
    })

})(window.angular);
