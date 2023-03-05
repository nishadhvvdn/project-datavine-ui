/**
 * @description
 * Controller to handle Relay Details
 */
(function (angular) {
    "use strict";
    angular.module('dataVINEApp').controller('deltaLinkDetailsCtrl',
        ['$scope', '$modalInstance', '$timeout', 'SystemManagementService',
            function ($scope, $modalInstance, $timeout, systemManagementService) {
                $scope.status = "Unknown";
                $scope.deviceType = "DeltaLINK\u2122";
                $scope.buttonTitle = 'Node Ping';
                let userTimeZone = angular.isUndefinedOrNull(objCacheDetails.userDetails) ? undefined : objCacheDetails.userDetails.timeZone;
                if (angular.isUndefined(userTimeZone)) {
                    refreshservice.refresh().then(function () {
                        userTimeZone = objCacheDetails.userDetails.timeZone;
                        init();
                    });
                } else {
                    init();
                }

                /**
                 * Function to initialize data for deltaLink
                 */
                function init() {
                    if (!angular.isUndefinedOrNull(objCacheDetails.data.deltaLinkData)) {
                        $scope.serialNumber = objCacheDetails.data.deltaLinkData["SerialNumber"];
                        $scope.hardwareVersion = objCacheDetails.data.deltaLinkData["version"];
                        $scope.deltaLinkID = objCacheDetails.data.deltaLinkData["DeltalinkID"];
                        $scope.createdDate = !objCacheDetails.data.deltaLinkData["CreatedOn"] ? '-' : moment
                            .tz(objCacheDetails.data.deltaLinkData["CreatedOn"], userTimeZone).format('YYYY-MM-DD HH:mm:ss');
                    }
                }

                /**
                 *  @description
                 * Function to close pop-up
                 *
                 * @return Nil

                 */
                $scope.cancel = function () {
                    $modalInstance.dismiss();
                };
                $scope.requesting = false;

                /**
                 * @description
                 * Function to check the node status
                 *
                 * @return Nil

                 */

                $scope.deltaLinkSerials = [];
                $scope.typeFlag = false;
                $scope.nodePing = function () {
                    $scope.requesting = true;
                    $scope.status = "Processing";
                    systemManagementService.getDeltaLinkNodePingDetails($scope.deltaLinkID)
                        .then(function (objData) {
                            if (!angular.isUndefinedOrNull(objData)) {
                                $scope.typeFlag = objData.type;
                                if (objData.type) {
                                    $scope.deltaLinkSerials = objData.Status
                                    $scope.requesting = false;
                                } else {
                                    $scope.status = objData.Message;
                                    $scope.requesting = false;
                                }
                            } else {
                                $scope.status = "Failed to perform operation !! Try again";
                                $scope.requesting = false;
                            }
                        });

                };
            }]);
})(window.angular);
