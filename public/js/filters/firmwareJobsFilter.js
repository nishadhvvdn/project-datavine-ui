/**
 * Filter for firmware jobs
 */
(function (angular) {
    "use strict";
    angular
        .module('dataVINEApp')
        .filter('firmwareJobsFilter', [
            function () {
                return function (arrInputData, firmwareJobsCheck, type) {
                    var arrOutputData = [];
                    if (!angular.isUndefined(arrInputData) && !angular.isUndefined(firmwareJobsCheck)) {
                        arrOutputData = [];
                        angular.forEach(arrInputData, function (objectData) {
                            var jobStatus = objectData.Group;
                            if (jobStatus === ((type === 'firmware') ? "Firmware Job" : (type === 'ondemandRead') ? 'OnDemand' : (type === 'registration') ? 'Registration Job' : (type === 'remoteDisconnect') ? 'Remote Disconnect Jobs' : (type === 'remoteConnect') ? 'Remote Connect Jobs' : (type === 'nodeping') ? 'Node Ping' : (type === 'intervalJob') ? 'Interval Read Job' : (type === 'lockJob') ? 'LOCK Job' : (type === 'fetchlog') ? 'Fetch Logs' : (type === 'clearlog') ? 'Clear Logs' : (type === 'rebootjob') ? 'Reboot Job'  : (type === 'unlockjob') ? 'Unlock Job' : ' ')) {
                                arrOutputData.push(objectData);
                            }
                        });
                        return arrOutputData;
                    }
                    return arrInputData;
                };
            }]);
})(window.angular);