/**
 *  @description
 * Controller for downloading meter configuration
 */
(function (angular) {
    "use strict";
    angular.module('dataVINEApp').controller('downloadConfiguration_meterCtrl', 
    ['$scope', '$modalInstance', 'MeterMgmtService', 'hypersproutMgmtService',
        function ($scope, $modalInstance, MeterMgmtService,
            hypersproutMgmtService) {
            init();
            $scope.selectedItems = [];
            $scope.downloadGroupsList = [];
            $scope.meterSerialNumberList = [];
            var configurationData = [];
            var objConfigMemberInfo = {};

            /**
             * Function to initialize with list of groups for download
             */
            function init() {
                configurationData = [];
                objConfigMemberInfo = {};
                MeterMgmtService.getConfigData()
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
                        if (!angular.isUndefinedOrNull(objData) &&
                            !angular.isUndefinedOrNull(objData.meterData)) {
                            for (var cnt in objData.meterData) {
                                if (objData.meterData.hasOwnProperty(cnt)) {
                                    var objToInsert = {};
                                    objToInsert["name"] = objData
                                        .meterData[cnt].ConfigName;
                                    objToInsert["ConfId"] = objData
                                        .meterData[cnt].ConfigID; // assuming that its the Unique value.
                                    objToInsert["Members"] = angular
                                        .isUndefinedOrNull(
                                            objConfigMemberInfo[objToInsert["ConfId"]]) ? '' : objConfigMemberInfo[objToInsert["ConfId"]].Members;
                                    if (objToInsert.Members > 0 &&
                                        objData.meterData[cnt].ClassName !== 'unknown') {
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
             * @description
             * Function to list devices attached
             * 
             * @param ConfiGObject
             * @return Nil
             
             */
            $scope.LoadListDevicesAttached = function (ConfiGObject) {
                $scope.meterSerialNumberList = [];
                if (!angular.isUndefinedOrNull(ConfiGObject) ||
                    !angular.isUndefinedOrNull(ConfiGObject.ConfId))
                    type = "Meter";
                hypersproutMgmtService.ListDevicesAttached(
                    ConfiGObject.ConfId, type, "Configuration Group")
                    .then(function (resObj) {
                        var objArray = [];
                        for (var i = 0; i < resObj.SerialNumbers.length; i++) {
                            objArray.push({ "id": i + 1, "label": resObj.SerialNumbers[i] })
                        }
                        $scope.meterSerialNumberList = objArray;
                    });
            };

            /**
             *  @description
             * Function to download configuration
             * 
             * @param ConfiGObject
             * @return Nil
             
             */
            $scope.downloadConfig = function (confName, serialNumber) {
                var meterSerialList = [];
                for (var i = 0; i < $scope.selectedItems.length; i++) {
                    for (var j = 0; j < $scope.meterSerialNumberList.length; j++) {
                        if ($scope.meterSerialNumberList[j].id ===
                            $scope.selectedItems[i].id) {
                            meterSerialList.push(
                                $scope.meterSerialNumberList[j].label
                            );
                            break;
                        }
                    }
                }
                MeterMgmtService.mmDownDownloadConfSave(
                    confName, meterSerialList
                ).then(function (objData) {
                    if (objData && objData.type) {
                        swal(objData.Status);
                    } else {
                        swal(objData.Message);
                    }
                    $scope.cancel();
                });
            };

            /**
             *  @description
             * Function to close pop-up
             * 
             * @param ConfiGObject
             * @return Nil
             
             */
            $scope.cancel = function () {
                $modalInstance.dismiss();
            };
        }]);
})(window.angular);