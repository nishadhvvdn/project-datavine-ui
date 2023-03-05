/**
 * @description
 * Controller to handle New Configuration
 */
(function (angular) {
    "use strict";

    angular.module('dataVINEApp').controller('newConfigurationCtrl',
        ['$scope', '$timeout', '$modalInstance', '$state',
            'hypersproutMgmtService', 'commonService', 'type',
            function ($scope, $timeout, $modalInstance, $state,
                hypersproutMgmtService, commonService, type) {
                var deviceClassValue;
                var config_programs = [];
                var list = [];
                $scope.deviceClass = 'IEC';
                $scope.selectDeviceClass = "Meter_IEC";
                list = objCacheDetails.data.configurationDetails;
                $scope.msg = '';
                $scope.wordMsg = '';
                $scope.unique = true;

                /**
                 *  @description
                 * Function validate the Group name for 
                 * special characters, uniqueness
                 *
                 * @param Nil
                 * @return Nil
                 
                 */
                $scope.check = function () {
                    var groupObj = commonService.check(list, 'Name', $scope.name);
                    $scope.unique = groupObj.check;
                    $scope.name = groupObj.name;
                    $scope.msg = groupObj.msg;
                    $scope.specialChar = groupObj.checkSpecialChar;
                };

                /**
                 *  @description
                 * Function to validate the description
                 *
                 * @param Nil
                 * @return Nil
                 
                 */
                $scope.wordCheck = function () {
                    if ($scope.description) {
                        var checkword = commonService.wordCheck($scope.description);
                        $scope.wordMsg = checkword.wordMsg;
                    }
                };

                for (var count in objCacheDetails.data.configPrgmData) {
                    if (objCacheDetails.data.configPrgmData.hasOwnProperty(count)) {
                        config_programs.push(objCacheDetails.data.configPrgmData[count]['Names']);
                    }
                }
                if (type === 'HyperSprout') {
                    $scope.config_programs = config_programs;
                } else {
                    $scope.configPrograms = config_programs;
                }

                /**
                 *  @description
                 * Function to close the pop-up after confirmation
                 *
                 * @param Nil
                 * @return Nil
                 
                 */
                $scope.cancel = function () {
                    if (this.new_configForm.$dirty) {
                        swal({
                            title: "Warning!",
                            text: "If you click cancel you will loose " +
                                "your changes, Do you want to continue?",
                            type: "warning",
                            showCancelButton: true,
                            confirmButtonText: 'Yes',
                            cancelButtonText: "No"
                        }, function (isConfirm) {
                            if (isConfirm) {
                                $modalInstance.dismiss();
                            }
                        });
                    } else {
                        $state.reload();
                        $modalInstance.dismiss();
                    }
                };

                /**
                 *  @description
                 * Function to create new configuration
                 *
                 * @param Nil
                 * @return Nil
                 
                 */
                $scope.Save = function () {
                    hypersproutMgmtService
                        .ConfNewConfSave($scope.name,
                            (type === 'HyperSprout') ? $scope.deviceClass : $scope.selectDeviceClass,
                            $scope.description, type === 'HyperSprout' ? $scope.config_program : $scope.configProgram,
                            type)
                        .then(function (responseData) {
                            if (responseData) {
                                swal(commonService.addTrademark(responseData.Status));
                            } else {
                                swal(commonService.addTrademark(responseData.Message));
                            }
                            $state.reload();
                            $modalInstance.dismiss();
                        });
                };
            }]);
})(window.angular);