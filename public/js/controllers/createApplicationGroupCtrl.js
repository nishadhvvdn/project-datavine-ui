/**
 * Controller to Create application group
 * @description
 */
(function (angular) {
    "use strict";
    angular.module('dataVINEApp')
        .controller('createApplicationGroupCtrl',
            ['$scope', '$modalInstance', '$state', 'hypersproutMgmtService', 'commonService', 'type', 'MeterMgmtService', 'DeviceService',
                function ($scope, $modalInstance, $state, hypersproutMgmtService, commonService, type, MeterMgmtService, deviceService) {
                    var list = [];
                    //modal header change for new button
                    if(type === "DeltaLink"){
                        $scope.name= "DeltaLINK\u2122"
                    }else if(type === "Meter"){
                        $scope.name= "Meter"
                    }else if(type === "HyperSprout"){
                        $scope.name= "HyperSPROUT\u2122"
                    }
                    if(type === "DeltaLink") {
                        list = objCacheDetails.data.deltaLinkGroupData ? objCacheDetails.data.deltaLinkGroupData : [];
                    } else {
                        list = (type === 'HyperSprout') ? objCacheDetails.data.groupDatas : objCacheDetails.data.groupList;
                    }

                    $scope.groupData = {};

                    /**
                     *  @description
                     * Function to validate group name and description
                     *
                     * @param field
                     * @return Nil
                     
                     */
                    $scope.exists = false;
                    $scope.groupNameRegex = /^[A-Za-z0-9]+(?:\s?[A-Za-z0-9]+)*$/;
                    $scope.groupDescriptionRegex = /^[A-Za-z0-9^`~!@#$%\^&*()_+={}|[\]\\:';"<>?,./]+(?:\s?[A-Za-z0-9^`~!@#$%\^&*()_+={}|[\]\\:';"<>?,./]+)*$/;
                    $scope.validateGroup = function (field) {
                        if (field === 'groupName') {
                            if ($scope.groupData.groupID) {
                                if ($scope.groupNameRegex.test($scope.groupData.groupID)) {
                                    if ($scope.groupData.groupID.length < 5) {
                                        $scope.errorGroupName = true;
                                        $scope.errorGroupNameMessage = 'Minimum 5 characters required';
                                        $scope.createGroupForm.groupName.$valid = false;
                                    } else {
                                        this.checkIfGroupNameAlreadyExists($scope.groupData.groupID);
                                        if ($scope.exists) {
                                            $scope.errorGroupName = true;
                                            $scope.errorGroupNameMessage = 'Group Name already exists!';
                                            $scope.createGroupForm.groupName.$valid = false;
                                        } else {
                                            $scope.errorGroupName = false;
                                            $scope.errorGroupNameMessage = '';
                                            $scope.createGroupForm.groupName.$valid = true;
                                        }
                                    }
                                } else {
                                    $scope.errorGroupName = true;
                                    $scope.errorGroupNameMessage = 'Invalid Group Name!';
                                    $scope.createGroupForm.groupName.$valid = false;
                                }
                            } else {
                                $scope.errorGroupName = true;
                                $scope.errorGroupNameMessage = 'Group Name is required!';
                                $scope.createGroupForm.groupName.$valid = false;
                            }
                        } else if (field === 'description') {
                            if ($scope.groupData.description) {
                                if ($scope.groupDescriptionRegex.test($scope.groupData.description)) {
                                    $scope.errorGroupDescription = false;
                                    $scope.errorGroupDescriptionMessage = '';
                                    $scope.createGroupForm.groupDescription.$valid = true;
                                } else {
                                    $scope.errorGroupDescription = true;
                                    $scope.errorGroupDescriptionMessage = 'Invalid Description!';
                                    $scope.createGroupForm.groupDescription.$valid = false;
                                }
                            } else {
                                $scope.errorGroupDescription = true;
                                $scope.errorGroupDescriptionMessage = 'Description is required!';
                                $scope.createGroupForm.groupDescription.$valid = false;
                            }
                        }
                    };

                    $scope.checkIfGroupNameAlreadyExists = function (inputGrpID) {
                        // if (list && list.length) {
                        //     for (let i = 0; i < list.length; i++) {
                        //         if (list[i]['Group_Name'].toLowerCase() === inputGrpID.toLowerCase()) {
                        //             console.log(list[i]['Group_Name'])
                        //             $scope.exists = true;
                        //             break;
                        //         } else {
                        //             $scope.exists = false;
                        //         }
                        //     }
                        // } else {
                        //     $scope.exists = false;
                        // }
                    };

                    /**
                     *  @description
                     * Function to create a application group
                     *
                     * @param nil
                     * @return Nil
                     
                     
                     */
                    $scope.Save = function () {
                        if(type === "DeltaLink") {
                            hypersproutMgmtService.createAppGrpForDeltaLink($scope.groupData.groupID.trim(), $scope.groupData.description, type).then(function (responseData) {
                                if (responseData) {
                                    swal(commonService.addTrademark(responseData.Status));
                                    $modalInstance.close($scope.groupData.groupID);
                                } else {
                                    swal(commonService.addTrademark(responseData.Status));
                                    $modalInstance.close(null);
                                }
                            });
                        } else {
                            hypersproutMgmtService.HSMGrpMgmtAssignGrpMembershipCreateAppGrp($scope.groupData.groupID.trim(), $scope.groupData.description, type).then(function (responseData) {
                                if (responseData) {
                                    swal(commonService.addTrademark(responseData.Status));
                                    $modalInstance.close($scope.groupData.groupID);
                                } else {
                                    swal(commonService.addTrademark(responseData.Status));
                                    $modalInstance.close(null);
                                }
                            });
                        }
                    };

                    /**
                     * *  @description
                     * Function to close pop-up
                     *
                     * @param nil
                     * @return Nil
    
                     */
                    $scope.cancel = function () {
                        $modalInstance.dismiss(false);
                    };

                    /**
                     * Function to print
                     */
                    $scope.printCart = function () {
                        window.print();
                    };
                }]);
})(window.angular);
