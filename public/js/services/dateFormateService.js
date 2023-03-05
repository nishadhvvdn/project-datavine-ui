/**
 * This handles administration services
 */
(function (angular) {
    "use strict";
    angular
        .module('dataVINEApp')
        .service('formatDate', ['refreshservice',
            function (refreshservice) {

                /**
                 * This returns the Date in the required format
                 */
                this.getFormatedDate = function (scope, type, callBack) {
                    var firstDate = null;
                    var lastDate = null;
                    var userTimeZone = angular.isUndefinedOrNull(objCacheDetails.userDetails) ? undefined : objCacheDetails.userDetails.timeZone;
                    if (angular.isUndefined(userTimeZone)) {
                        refreshservice.refresh().then(
                            function () {
                                userTimeZone = objCacheDetails.userDetails.timeZone;
                                scope.startingDate = new Date(moment.tz(userTimeZone).format('YYYY-MM-DD HH:mm'));
                                scope.endingDate = new Date(moment.tz(userTimeZone).format('YYYY-MM-DD HH:mm'));
                                scope.endingDate = scope.endingDate.setMinutes(scope.endingDate.getMinutes() + 1);
                                firstDate = angular.copy(scope.startingDate);
                                firstDate = moment
                                    .utc(firstDate)
                                    .subtract(
                                        type === 'newAccount' ? objCacheDetails.userDetails.newAccountReportTimePeriod : objCacheDetails.userDetails.DefaultDataDisplayPeriod,
                                        'days');
                                firstDate = moment.utc(firstDate).format('YYYY-MM-DDTHH:mm:ss.SSS') + 'Z';
                                lastDate = scope.endingDate;
                                scope.startingDate = new Date(firstDate);
                                scope.responseArray = [];
                                lastDate = moment.utc(lastDate).format('YYYY-MM-DDTHH:mm:ss.SSS') + 'Z';
                                callBack(firstDate, lastDate);
                            });
                    } else {
                        scope.startingDate = new Date(moment.tz(userTimeZone).format('YYYY-MM-DD HH:mm'));
                        scope.endingDate = new Date(moment.tz(userTimeZone).format('YYYY-MM-DD HH:mm'));
                        scope.endingDate = scope.endingDate.setMinutes(scope.endingDate.getMinutes() + 1);
                        firstDate = angular.copy(scope.startingDate);
                        firstDate = moment.utc(firstDate)
                            .subtract(
                                type === 'newAccount' ? objCacheDetails.userDetails.newAccountReportTimePeriod : objCacheDetails.userDetails.DefaultDataDisplayPeriod,
                                'days');
                        firstDate = moment.utc(firstDate).format('YYYY-MM-DDTHH:mm:ss.SSS') + 'Z';
                        scope.startingDate = new Date(firstDate);
                        lastDate = scope.endingDate;
                        scope.responseArray = [];
                        lastDate = moment.utc(lastDate).format('YYYY-MM-DDTHH:mm:ss.SSS') + 'Z';
                        callBack(firstDate, lastDate, userTimeZone);
                    }
                };

            }]);
})(window.angular);

