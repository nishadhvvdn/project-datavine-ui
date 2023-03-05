/**
 * * @description
 * Controller to download firmware
 */
(function (angular) {
    "use strict";
    angular.module('dataVINEApp')
        .controller('enterFirmwareDownloadCtrl',
            ['$scope', '$modalInstance', '$uibModal',
                'type', 'firmwareManagementService',
                function ($scope, $modalInstance,
                    $uibModal, type, firmwareManagementService) {
                        //pop up heading change
                        if(type === "DeltaLink"){
                            $scope.name= "DeltaLINK\u2122"
                        }else if(type === "Meter"){
                            $scope.name= "Meter"
                        }else if(type === "HyperSprout"){
                            $scope.name= "HyperSPROUT\u2122"
                        }

                    $scope.typeOfDevice = type;
                    if($scope.typeOfDevice === 'Meter') {

                        $scope.deviceType = "MeshCard";
                    } else if($scope.typeOfDevice === 'HyperSprout'){
                        $scope.deviceType = "iNC";
                    } else {
                        $scope.deviceType = "DeltaLink";
                    }
                    $scope.selectFirmwareDropDown = [];
                    $scope.GroupDetailsDropDown = [];

                    $scope.iNCfirmwareList = [];
                    $scope.iTMfirmwareList = [];
                    $scope.cellularfirmwareList = [];
                    $scope.bluetoothfirmwareList = [];
                    $scope.meterMeshCardFirmwareList = [];
                    $scope.meterMeterCardFirmwareList = [];
                    $scope.deltaLinkCardFirmwareList = [];
                    init();
                    /**
                     * Function to get firmware management and 
                     * firmware group
                     */
                    function init() {
                        firmwareManagementService.FirmwareMgmtFirmGroup(type)
                            .then(function (objData) {
                                $scope.selectFirmwareDropDown = objData.FirmwareDetailsSelected;
                                $scope.GroupDetailsDropDown = objData.GroupDetailsSelected;
                                if (objData.FirmwareDetailsSelected) {
                                    objData.FirmwareDetailsSelected.forEach((firmware) => {
                                     if(firmware.CardType === "iTM") {
                                        $scope.iTMfirmwareList.push(firmware);
                                     } else if(firmware.CardType === "iNC") {
                                         $scope.iNCfirmwareList.push(firmware);
                                     } else if(firmware.CardType === "Cellular") {
                                        $scope.cellularfirmwareList.push(firmware);
                                     } else if(firmware.CardType === "Bluetooth") {
                                        $scope.bluetoothfirmwareList.push(firmware);
                                     } else if(firmware.CardType === "MeshCard"){
                                         $scope.meterMeshCardFirmwareList.push(firmware);
                                     } else if(firmware.CardType === "MeterCard"){
                                         $scope.meterMeterCardFirmwareList.push(firmware);
                                     } else {
                                         $scope.deltaLinkCardFirmwareList.push(firmware);
                                     }
                                    });
                                   $scope.deviceTypeChanged();
                                }
                            });
                    }
                    $scope.deviceTypeChanged = function() {
                        if($scope.deviceType === 'iTM') {
                            $scope.selectFirmwareDropDown = $scope.iTMfirmwareList;
                        } else if($scope.deviceType === 'iNC') {
                            $scope.selectFirmwareDropDown = $scope.iNCfirmwareList;
                        } else if($scope.deviceType === 'Cellular') {
                            $scope.selectFirmwareDropDown = $scope.cellularfirmwareList;
                        } else if($scope.deviceType === 'Bluetooth') {
                            $scope.selectFirmwareDropDown = $scope.bluetoothfirmwareList;
                        } else if($scope.deviceType === 'MeshCard') {
                            $scope.selectFirmwareDropDown = $scope.meterMeshCardFirmwareList;
                        } else if($scope.deviceType === 'MeterCard') {
                            $scope.selectFirmwareDropDown = $scope.meterMeterCardFirmwareList;
                        } else {
                            $scope.selectFirmwareDropDown = $scope.deltaLinkCardFirmwareList;
                        }
                    };

                    /**
                     * @description
                     * Function to close pop-up
                     *
                     * @param nil
                     * @return Nil
                     
                     */
                    $scope.cancel = function () {
                        $modalInstance.dismiss(false);
                    };

                    /**
                     *  @description
                     * Function to Create firmware
                     *
                     * @param selectedFirmware
                     * @param selectedGroup
                     * @return Nil
                    
                     */
                    $scope.enterFirmwareDownload =
                        function (selectedFirmware, selectedGroup) {
                            firmwareManagementService
                                .FirmwareMgmtFirmGroupSubmit(
                                    type, selectedFirmware.FirmwareID, selectedFirmware.FirmwareName,
                                    selectedGroup.GroupID, selectedFirmware.CardType
                                ).then(function (objData) {
                                      if (!angular.isUndefinedOrNull(objData) &&
                                     (objData.type)) {
                                        $state.reload();
                                          swal(objData.Message);
                                    } else {
                                     swal(objData.Message);
                                      } 
                                       $modalInstance.dismiss(true);
                                });
                        };
                }]);
})(window.angular);
