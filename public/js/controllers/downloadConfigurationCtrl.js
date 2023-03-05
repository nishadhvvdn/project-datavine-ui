/**
 * * @description
 * Controller to download configuration
 */
(function (angular) {
    "use strict";
    angular.module('dataVINEApp')
        .controller('downloadConfigurationCtrl',
            ['$scope', '$modalInstance', '$state',
                'hypersproutMgmtService',
                function ($scope, $modalInstance,
                    $state, hypersproutMgmtService) {
                    init();
                    $scope.downloadGroupsList = [];
                    $scope.selectedItems = [];
                    $scope.HyperSproutList = [];
                    var configurationData = [];
                    var objConfigMemberInfo = {};

                    /**
                     * Function to initialize with list of groups for download 
                     */
                    function init() {
                        configurationData = [];
                        objConfigMemberInfo = {};
                        hypersproutMgmtService.getConfigData()
                            .then(function (objData) {
                                if (!angular.isUndefinedOrNull(objData) &&
                                    !angular.isUndefinedOrNull(objData.memberInfo)) {
                                    for (var count in objData.memberInfo) {
                                        if (objData.memberInfo.hasOwnProperty(count)) {
                                            objConfigMemberInfo[objData
                                                .memberInfo[count]["configID"]] = {
                                                    "Members": objData
                                                        .memberInfo[count]["Members"],
                                                    "NonMembers": objData
                                                        .memberInfo[count]["NonMembers"]
                                                };
                                        }
                                    }
                                }
                                if (!angular.isUndefinedOrNull(objData) && !angular.isUndefinedOrNull(objData.hyperSproutData)) {
                                    for (var cnt in objData.hyperSproutData) {
                                        if (objData.hyperSproutData.hasOwnProperty(cnt)) {
                                            var objToInsert = {};
                                            objToInsert["name"] = objData.hyperSproutData[cnt].ConfigName;
                                            objToInsert["ConfId"] = objData.hyperSproutData[cnt].ConfigID; // assuming that its the Unique value.
                                            objToInsert["Members"] = angular.isUndefinedOrNull(objConfigMemberInfo[objToInsert["ConfId"]]) ? '' : objConfigMemberInfo[objToInsert["ConfId"]].Members;
                                            if (objToInsert.Members > 0 && objData.hyperSproutData[cnt].ClassName !== 'unknown') {
                                                configurationData.push(objToInsert);
                                            }
                                        }
                                    }
                                    $scope.downloadGroupsList = configurationData;
                                }
                            });
                    }

                    var type = "";

                    /**
                     *  @description
                     * Function to list devices attached
                     * 
                     * @param ConfiGObject
                     * @return Nil
             
                    
                    */
                    $scope.LoadListDevicesAttached = function (ConfiGObject) {
                        $scope.HyperSproutList = [];
                        if (!angular.isUndefinedOrNull(ConfiGObject) ||
                            !angular.isUndefinedOrNull(ConfiGObject.ConfId))
                            type = "HyperSprout";
                        hypersproutMgmtService.ListDevicesAttached(
                            ConfiGObject.ConfId, type, "Configuration Group"
                        ).then(function (resObj) {
                            var objArray = [];
                            for (var i = 0; i < resObj.SerialNumbers.length; i++) {
                                objArray.push({
                                    "id": i + 1,
                                    "label": resObj.SerialNumbers[i]
                                });
                            }
                            $scope.HyperSproutList = objArray;
                        });
                    };

                    /**
                     *  @description
                     * Function to download configuration
                     * 
                     * @param confName
                     * @return Nil
                     
                     */
                    $scope.downloadConfig = function (confName) {
                        var hSSerialList = [];
                        for (var i = 0; i < $scope.selectedItems.length; i++) {
                            for (var j = 0; j < $scope.HyperSproutList.length; j++) {
                                if ($scope.HyperSproutList[j].id ===
                                    $scope.selectedItems[i].id) {
                                    hSSerialList.push($scope.HyperSproutList[j].label);
                                    break;
                                }
                            }
                        }
                        hypersproutMgmtService.HSMDownDownloadConfSave(
                            confName, hSSerialList
                        ).then(function (objData) {
                            if (objData) {
                                swal(objData.Status);
                            }
                            $scope.cancel();
                        });
                    };

                    /**
                     *  @description
                     * Function to download configuration
                     * 
                     * @param nil
                     * @return Nil
                     * Function to close pop-up
                     */
                    $scope.cancel = function () {
                        $modalInstance.dismiss();
                    };
                }]);
})(window.angular);