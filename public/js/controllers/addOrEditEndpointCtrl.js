/**
  * @this vm
  * @ngdoc controller
  * @name dataVINEApp.controller:addOrEditEndpoint
  *
  * @description
  * Controller to Adding / Editing Endpoints
*/
(function (angular) {
    "use strict";
    angular.module('dataVINEApp')
        .controller('addOrEditEndpoint', ['$scope', 'DeviceService',
            'type', '$modalInstance', '$state', 'commonService',
            function ($scope, deviceService, type, $modalInstance,
                $state, commonService) {
                $scope.type = type;
                if (type === 'edit') {
                    setTimeout(function () {
                        $scope.updateEndpointDetailsCheck();
                    }, 100);
                }
                $scope.circuitList = deviceService.getListOfCircuit();
                var regMac = new RegExp(objCacheDetails.regEx.MAC_ID, "i");
                var regMac64 = /^([0-9a-fA-F]{2}[:]){7}([0-9a-fA-F]{2})$/;
                let endpointOwnerRegex = /^[A-Za-z0-9]+(?:\s?[A-Za-z0-9]+)*$/;
                let endpointDescriptionRegex = /^[A-Za-z0-9^`~!@#$%\^&*()_+={}|[\]\\:';"<>?,./]+(?:\s?[A-Za-z0-9^`~!@#$%\^&*()_+={}|[\]\\:';"<>?,./]+)*$/;
                // $scope.circuitList = objCacheDetails.data.endpointData.circuitList;
                $scope.endpointDetails = {};
                $scope.endpointDetails.circuitSelection = undefined;
                $scope.circuitSelectionBoolean = false;
                $scope.count = 0;
                if (type === 'edit') {
                    $scope.endpointDetails = angular.copy(objCacheDetails.data.endpointData);
                    $scope.endpointDetails.DeviceType = objCacheDetails.data.endpointData.DeviceType;
                    for (var i = 0; i < $scope.circuitList.length; i++) {
                        if ($scope.endpointDetails.CircuitID === $scope.circuitList[i].circuitId) {
                            $scope.endpointDetails.circuitSelection = $scope.circuitList[i];
                            break;
                        }
                    }
                }
                setTimeout(function () {
                    $scope.endpoint.$dirty = false;
                }, 100);
                $scope.status = {
                    isFirstOpen: true
                };

                $scope.changecircuitSelection = function () {
                    $scope.count++;
                    if ($scope.count > 1) {
                        $scope.circuitSelectionBoolean = false;
                    } else {
                        $scope.circuitSelectionBoolean = true;
                    }
                };
                /**
                  * @description
                  * Function to validate MAC ID
                  *
                  * @param field - field name
                  * @return Nil
                */
                $scope.endpointValidation = function (field) {
                    if (field === 'macid') {
                        $scope.endpointDetails.MacID = angular.isUndefinedOrNull($scope.endpointDetails.MacID) ? $scope.endpointDetails.MacID : $scope.endpointDetails.MacID.toLowerCase();
                        if ($scope.endpointDetails.MacID === undefined ||
                            $scope.endpointDetails.MacID.trim().length === 0) {
                            $scope.errorMacIDMessage = 'MAC ID is required!';
                            $scope.errorMacid = true;
                            $scope.endpoint.macId.$valid = false;
                        } else if ($scope.endpointDetails.MacID.length > 30) {
                            $scope.errorMacIDMessage = 'Length of MAC ID must not be greater than 30!';
                            $scope.errorMacid = true;
                            $scope.endpoint.macId.$valid = false;
                        } else if (regMac.test($scope.endpointDetails.MacID) || regMac64.test($scope.endpointDetails.MacID)) {
                            if (deviceService.checkMulticastMAC($scope.endpointDetails.MacID)) {
                                $scope.errorMacIDMessage = 'Invalid MAC ID (Multicast)!';
                                $scope.errorMacid = true;
                                $scope.endpoint.macId.$valid = false;
                            } else {
                                $scope.errorMacid = false;
                                $scope.endpoint.macId.$valid = true;
                            }
                        } else {
                            $scope.errorMacIDMessage = 'Invalid MAC ID!';
                            $scope.errorMacid = true;
                            $scope.endpoint.macId.$valid = false;
                        }
                    } else if (field === 'owner') {
                        if ($scope.endpointDetails.Owner) {
                            if (endpointOwnerRegex.test($scope.endpointDetails.Owner)) {
                                if ($scope.endpointDetails.Owner === undefined ||
                                    $scope.endpointDetails.Owner.trim().length === 0) {
                                    $scope.errorOwnerMessage = 'Owner is required!';
                                    $scope.errorOwner = true;
                                    $scope.endpoint.owner.$valid = false;
                                } else if ($scope.endpointDetails.Owner.length > 15) {
                                    $scope.errorOwnerMessage = 'Length of Owner must not be more than 15';
                                    $scope.errorOwner = true;
                                    $scope.endpoint.owner.$valid = false;
                                } else {
                                    $scope.errorOwner = false;
                                    $scope.endpoint.owner.$valid = true;
                                }
                            } else {
                                $scope.errorOwnerMessage = 'Invalid Owner!';
                                $scope.errorOwner = true;
                                $scope.endpoint.owner.$valid = false;
                            }
                        } else {
                            $scope.errorOwnerMessage = 'Owner is required!';
                            $scope.errorOwner = true;
                            $scope.endpoint.owner.$valid = false;
                        }
                    }
                    else if (field === 'description') {
                        if ($scope.endpointDetails.Description) {
                            if (endpointDescriptionRegex.test($scope.endpointDetails.Description)) {
                                if ($scope.endpointDetails.Description === undefined ||
                                    $scope.endpointDetails.Description.trim().length === 0) {
                                    $scope.errorDescriptionMessage = 'Description is required!';
                                    $scope.errorDescription = true;
                                    $scope.endpoint.description.$valid = false;
                                } else {
                                    $scope.errorDescription = false;
                                    $scope.endpoint.description.$valid = true;
                                }
                            } else {
                                $scope.errorDescriptionMessage = 'Invalid Description!';
                                $scope.errorDescription = true;
                                $scope.endpoint.description.$valid = false;
                            }
                        } else {
                            $scope.errorDescriptionMessage = 'Description is required!';
                            $scope.errorDescription = true;
                            $scope.endpoint.description.$valid = false;
                        }
                    }
                    $scope.create_endpoint_valid = $scope.errorMacid || $scope.errorOwner || $scope.errorDescription;
                };
                if (type != 'edit'){
                    $scope.endpointDetails.DeviceType = "Roaming Devices";
                }
                /**
                  * @description
                  *  Function to save the endpoint details
                  *
                  * @param data - data to be saved
                  * @return Nil
                */
                $scope.saveEndpointDetails = function (data) {
                    $scope.endpointDetails = data;
                    deviceService.create('NewEndpointEntry', ['Add',
                        [$scope.endpointDetails.Owner], [$scope.endpointDetails.MacID],
                        [$scope.endpointDetails.Description],
                        $scope.endpointDetails.circuitSelection.circuitId, [$scope.endpointDetails.DeviceType]])
                        .then(function (objData) {
                            var isSuccess = deviceService.validateSuccess(objData);
                            if(isSuccess) {
                                if(objData.Message) {
                                    swal(commonService.addTrademark(objData.Message));
                                    $modalInstance.dismiss(true);
                                    $state.reload();
                                } else {
                                    swal(deviceService.handleDisplayMessageAddDevice(objData));
                                }                                
                            } else {
                                swal(deviceService.handleDisplayMessageAddDevice(objData));
                            }
                        });
                };
                /**
                  * @description
                  * Function to update the endpoint details
                  *
                  * @param Nil
                  * @return Nil
                */
                $scope.updateEndpointDetailsCheck = function () {
                    $scope.endPointFields = ['macid', 'owner', 'description'];
                    if ($scope.endPointFields.length > 0) {
                        for (var i = 0; i < $scope.endPointFields.length; i++) {
                            $scope.endpointValidation($scope.endPointFields[i]);
                        }
                    }
                };
                $scope.updateEndpointDetails = function () {
                    $scope.endpointDetails.CircuitID = $scope.endpointDetails.circuitSelection.circuitId;
                    deviceService.editEndpoint($scope.endpointDetails)
                        .then(function (objData) {
                            var isSuccess = deviceService.validateSuccess(objData);
                            if(isSuccess) {
                                if(objData.Message) {
                                    swal(commonService.addTrademark(objData.Message));
                                    $modalInstance.dismiss(true);
                                    $state.reload();
                                } else {
                                    swal(deviceService.handleDisplayMessageEditDevice(objData));
                                }                                
                            } else {
                                swal(deviceService.handleDisplayMessageEditDevice(objData));
                            }
                        });
                };
                /**
                  * @description
                  * Function to close the modal
                  *
                  * @param Nil
                  * @return Nil
                */
                $scope.cancelModalWindow = function () {
                    $modalInstance.dismiss(false);
                };
            }
        ]);
})(window.angular);
