/**
 * @description
 * Controller for importing firmware
 */
(function (angular) {
    "use strict";
    angular.module('dataVINEApp').controller('importFirmwareCtrl',
        ['$scope', '$modalInstance', 'firmwareManagementService','$timeout', 'type',
            function ($scope, $modalInstance, firmwareManagementService,$timeout, type) {
               
                //Pop up heading change dynamically
                if(type === "DeltaLink"){
                    $scope.name= "DeltaLINK\u2122"
                }else if(type === "Meter"){
                    $scope.name= "Meter"
                }else if(type === "HyperSprout"){
                    $scope.name= "HyperSPROUT\u2122"
                }


                $scope.fileUploadStatus = true;
                var fileName = 'N/A';
                var fileSize = 0;
                $scope.imports = [{
                    "key": 'Firmware File Name',
                    "value": 'N/A'
                }, {
                    "key": 'Import Result',
                    "value": 'Firmware not imported yet'
                }, {
                    "key": 'Device Class',
                    "value": 'N/A'
                }];

                /**
                 * @description
                 * Function to validate the file extension
                 *
                 * @param newVal
                 * @return Nil
                 
                 */
                $scope.checkfileExtension = function (newVal) {
                    fileName = newVal.name;
                    fileSize = (newVal.size/1024)/1024;
                    var type = newVal.name
                        .substring(newVal.name.lastIndexOf(".") + 1);
                    if (type === 'zip') {
                        $scope.errMessage = '';
                        $scope.fileUploadStatus = false;
                    } else {
                        $scope.errMessage = 'Select files only with .zip extension';
                        $scope.fileUploadStatus = true;
                    }
                    if(fileSize > objCacheDetails.allowedFirmwareFileSize) {
                        $scope.errMessage = 'Maximum file size upload allowed is 100 MB!';
                        $scope.fileUploadStatus = true;
                    }
                };

                /**
                 * @description
                 * Event handler to watch the file extension
                 *
                 * @param newVal
                 * @return Nil
                 
                 */
                $scope.$watch('fileMod', function (newVal) {
                    if (newVal) {
                        $scope.checkfileExtension(newVal);

                    }
                });
               function formatData(objData) {
                     $scope.fileUploadStatus = true;
                    if (!angular.isUndefinedOrNull(objData)) {
                        if (objData.type === true) {
                          $scope.imports[0].value = fileName;
                            $scope.imports[1].value = angular
                                .isUndefinedOrNull(objData.Message) ? 'Failed to import' : objData.Message;
                            $scope.imports[2].value =  $scope.deviceSelected;
                        } else {
                            $scope.imports[0].value = fileName;
                            $scope.imports[1].value = objData.Message;
                            $scope.imports[2].value = $scope.deviceSelected;
                        }
                        $timeout(function () {
                            $scope.$apply();
                        }, 300, false);
                    }
                }

                $scope.deviceType = function () {
                    if (type === 'HyperSprout') {
                        $scope.deviceTypeArray = [{
                            "id": 1, "deviceType": "iNC"
                        }, {
                            "id": 2, "deviceType": "iTM"
                        }, {
                            "id": 3, "deviceType": "Cellular"
                        }, {
                            "id": 4, "deviceType": "Bluetooth"
                        }];
                    } else if(type === 'Meter') {
                        $scope.deviceTypeArray = [{
                            "id": 1, "deviceType": "MeshCard"
                        },{
                            "id": 2, "deviceType": "MeterCard"
                        }];
                    } else {
                        $scope.deviceTypeArray = [{
                            "id": 1, "deviceType": "DeltaLINK\u2122"
                        }];
                    }
                };
                $scope.deviceType();
                $scope.selectedDeviceType = $scope.deviceTypeArray[0];
                $scope.deviceSelected = $scope.selectedDeviceType.deviceType;
                $scope.dataTypeChange = function () {
                    $scope.deviceSelected = $scope.selectedDeviceType.deviceType;
                };
                /**
                 * @description
                 * Function to upload file
                 *
                 * @param Nil
                 * @return Nil
                 
                 */
                $scope.uploadFile = function () {
                    firmwareManagementService
                        .FirmwareMgmtUpload($scope.fileMod,
                            $scope.deviceSelected === 'DeltaLINK\u2122' ? 'DeltaLink' : $scope.deviceSelected)
                        .then(function (resultMsg) {
                            formatData(resultMsg);
                        });
                };

                 /**
                 * Function to close pop-up
                 */
                $scope.cancel = function () {
                    if($scope.fileUploadStatus) {
                        $modalInstance.dismiss(true);
                    } else {
                        $modalInstance.dismiss(false);
                    }                    
                };

            }]);
})(window.angular);
