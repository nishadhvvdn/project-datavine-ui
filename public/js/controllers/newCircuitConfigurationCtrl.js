/**
 * @description
 * Controller for Creating new Circuit Configuration
 */
(function (angular) {
    "use strict";
    angular.module('dataVINEApp').controller('newCircuitConfigurationCtrl',
        ["$uibModalStack", "$modalInstance",
            "$scope", "$rootScope", "$uibModal",
            "$state", "DeviceService",
            function ($uibModalStack, $modalInstance,
                $scope, $rootScope, $uibModal, $state, deviceService) {
                var configurationData = null;
                var retrievedData = null;
                $scope.editDTCId = false;
                init();

                /**
                 * Function to initialize meter data
                 */
                function init() {
                    $scope.meterdetails = {};
                    if ($state.current.name === 'editCircuit' &&
                        angular.isUndefinedOrNull(
                            objCacheDetails.data.selectedData)
                    ) {
                        $state.go('system.registration.circuitEntry');
                        return;
                    }

                    $scope.showCktIdErrorMsg = true;
                    configurationData = angular
                        .copy(objCacheDetails.data.configurationData);
                    objCacheDetails.data.configurationData = null;
                    if (angular
                        .isUndefinedOrNull(objCacheDetails.data.selectedData)) {
                        $scope.createUpdateStatus = true;
                        $scope.editDTCId = false;
                    } else {
                        $scope.editDTCId = true;
                        retrievedData = objCacheDetails.data.selectedData;
                        $scope.meterdetails.CircuitNumber = (retrievedData.CircuitNumber).toString();
                        $scope.meterdetails.circuitId = (retrievedData.circuitId).toString();
                        $scope.meterdetails.kvaRating = (retrievedData.kvaRating).toString();
                        $scope.meterdetails.substationId = (retrievedData.substationId).toString();
                        $scope.meterdetails.substationName = (retrievedData.substationName).toString();
                        $scope.meterdetails.substationAdd = (retrievedData.substationAdd).toString();
                        $scope.meterdetails.country = (retrievedData.country).toString();
                        $scope.meterdetails.state = retrievedData.state === 'N/A' ? undefined : (retrievedData.state).toString();
                        $scope.meterdetails.city = (retrievedData.city).toString();
                        $scope.meterdetails.zipcode = retrievedData.zipcode;
                        $scope.meterdetails.latitude = (retrievedData.Latitude).toString();
                        $scope.meterdetails.longitude = (retrievedData.Longitude).toString();
                        $scope.createUpdateStatus = false;
                        objCacheDetails.data.selectedData = null;
                    }
                }
                if (!$scope.createUpdateStatus) {
                    setTimeout(function () {
                        $scope.updateCircuitCheck();
                    }, 100);
                }
                /**
                 * @description
                 * Function to update edited circuit data
                 *
                 * @param Nil
                 * @return Nil

                 */
                $scope.updateCircuitCheck = function () {
                    $scope.circuitFields = ['circuitId' , 'kvaRating' , 'latitude' , 'longitude' , 'substationId' ,
                                            'substationName' , 'substationAdd' , 'country' , 'state' , 'city'];
                        if ($scope.circuitFields.length > 0) {
                            for (var i = 0; i < $scope.circuitFields.length; i++) {
                                $scope.focusValidate($scope.circuitFields[i]);
                            }
                        }
                };

                $scope.update = function () {
                    deviceService.editCircuit(($scope.meterdetails.CircuitNumber).toString(),
                        ($scope.meterdetails.circuitId).toString(),
                        $scope.meterdetails.kvaRating,
                        ($scope.meterdetails.substationId).toString(),
                        $scope.meterdetails.substationName,
                        $scope.meterdetails.substationAdd,
                        $scope.meterdetails.country,
                        angular.isUndefinedOrNull($scope.meterdetails.state) ? 'N/A' : $scope.meterdetails.state,
                        $scope.meterdetails.city,
                        $scope.meterdetails.zipcode,
                        parseFloat($scope.meterdetails.latitude).toString(),
                        parseFloat($scope.meterdetails.longitude).toString()
                        )
                        .then(function (objData) {
                            var isSuccess = deviceService.validateSuccess(objData);
                            if(isSuccess) {
                                if(objData.Message) {
                                    swal(objData.Message);
                                    $modalInstance.dismiss(true);
                                    $uibModalStack.clearFocusListCache();
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
                 * Function to close pop-up
                 *
                 * @param Nil
                 * @return Nil

                 */
                $scope.cancel = function () {
                    $modalInstance.dismiss(false);
                    //$uibModalStack.clearFocusListCache();
                };

                /**
                 * @description
                 * Function to create new circuit entry
                 *
                 * @param Nil
                 * @return Nil

                 */
                $scope.save = function () {
                    deviceService.create('NewCircuitEntry', ['Add', [$scope.meterdetails.circuitId], [$scope.meterdetails.kvaRating], [$scope.meterdetails.substationId],
                        [$scope.meterdetails.substationName], [$scope.meterdetails.substationAdd], [$scope.meterdetails.country],
                        [angular.isUndefinedOrNull($scope.meterdetails.state) ? 'N/A' : $scope.meterdetails.state], [$scope.meterdetails.city], [$scope.meterdetails.zipcode],
                        [parseFloat($scope.meterdetails.latitude).toString()], [parseFloat($scope.meterdetails.longitude).toString()]]).then(function (objData) {
                            var isSuccess = deviceService.validateSuccess(objData);
                            if(isSuccess) {
                                if(objData.Message) {
                                    swal(objData.Message);
                                    $modalInstance.dismiss(true);
                                    $uibModalStack.clearFocusListCache();
                                    $state.reload();
                                } else {
                                    swal(deviceService.handleDisplayMessageAddDevice(objData));
                                }                                
                            } else {
                                swal(deviceService.handleDisplayMessageAddDevice(objData));
                            }
                        });
                };

                $scope.oneAtATime = true;
                $scope.status = {
                    isCustomHeaderOpen: false,
                    isFirstOpen: true,
                    isFirstDisabled: false
                };
                var regLat = new RegExp("^(\\+|-)?(?:90(?:(?:\\.0{1,6})?)|(?:[0-9]|[1-8][0-9])(?:(?:\\.[0-9]{1,6})?))$");
                var regLon = new RegExp("^(\\+|-)?(?:180(?:(?:\\.0{1,6})?)|(?:[0-9]|[1-9][0-9]|1[0-7][0-9])(?:(?:\\.[0-9]{1,6})?))$");
                var zipCodeRegex = /^((?!0{4,6})[A-Za-z0-9]{4,6})?$/;
                /**
                 *  @description
                 * Function to validate the circuit entry values
                 *
                 * @param field
                 * @return Nil

                 */
                var containsSpace = /\s/;
                $scope.focusValidate = function (field) {
                    let pattern = /^[a-zA-Z0-9\s]+$/;
                    let subStationCountryStateCityAddressRegex = /^[A-Za-z0-9]+(?:\s?[A-Za-z0-9]+)*$/;
                    if (field === 'circuitId') {
                      if($scope.meterdetails.circuitId) {
                        if(!containsSpace.test($scope.meterdetails.circuitId)) {
                          if ($.isEmptyObject($scope.circuitEdit.circuitId.$error) ===
                              false || $scope.meterdetails.circuitId.trim().length === 0) {
                              $scope.errorMessageCktId = 'DTC ID is required!';
                              $scope.errorCktId = true;
                              $scope.circuitEdit.circuitId.$valid = false;
                          } else if ($scope.meterdetails.circuitId.length > 30) {
                              $scope.errorMessageCktId = 'Length of DTC ID must not be more than 30!';
                              $scope.errorCktId = true;
                              $scope.circuitEdit.circuitId.$valid = false;
                          } else if (!pattern.test($scope.meterdetails.circuitId.trim())) {
                              $scope.errorMessageCktId = 'Invalid DTC ID!';
                              $scope.errorCktId = true;
                              $scope.circuitEdit.circuitId.$valid = false;
                          } else {
                              $scope.errorCktId = false;
                              $scope.circuitEdit.circuitId.$valid = true;
                          }
                        } else {
                          $scope.errorMessageCktId = 'Invalid DTC ID!';
                          $scope.errorCktId = true;
                          $scope.circuitEdit.circuitId.$valid = false;
                        }
                      } else {
                        $scope.errorMessageCktId = 'DTC ID is required!';
                        $scope.errorCktId = true;
                        $scope.circuitEdit.circuitId.$valid = false;
                      }
                    } else if (field === 'kvaRating') {
                        if (!$.isEmptyObject($scope.circuitEdit.kvaRating.$error) ||
                            $scope.meterdetails.kvaRating.trim().length === 0) {
                            $scope.errorMessageKvaRating = 'KVA Rating is required!';
                            $scope.errorKvaRating = true;
                            $scope.circuitEdit.kvaRating.$valid = false;
                        } else if (isNaN($scope.meterdetails.kvaRating.trim())) {
                            $scope.errorMessageKvaRating = 'Invalid KVA Rating!';
                            $scope.errorKvaRating = true;
                            $scope.circuitEdit.kvaRating.$valid = false;
                        } else if ($scope.meterdetails.kvaRating <= 0) {
                            $scope.errorMessageKvaRating = 'Invalid KVA Rating!';
                            $scope.errorKvaRating = true;
                            $scope.circuitEdit.kvaRating.$valid = false;
                        } else {
                            $scope.errorKvaRating = false;
                            $scope.circuitEdit.kvaRating.$valid = true;
                        }
                    } else if (field === 'latitude') {
                        if (!$.isEmptyObject($scope.circuitEdit.latitude.$error) ||
                            $scope.meterdetails.latitude.trim().length === 0) {
                            $scope.errorMessageLatitude = 'Latitude is required!';
                            $scope.errorLatitude = true;
                            $scope.circuitEdit.latitude.$valid = false;
                        }
                        else if (regLat.exec($scope.meterdetails.latitude)) {
                            $scope.errorLatitude = false;
                            $scope.circuitEdit.latitude.$valid = true;
                        } else {
                            $scope.errorMessageLatitude = 'Invalid Latitude! ' +
                                'The range of latitude is 0 to +/- 90';
                            $scope.errorLatitude = true;
                            $scope.circuitEdit.latitude.$valid = false;
                        }
                    } else if (field === 'longitude') {
                        if (!$.isEmptyObject($scope.circuitEdit.longitude.$error) ||
                            $scope.meterdetails.longitude.trim().length === 0) {
                            $scope.errorMessageLongitude = 'Longitude is required!';
                            $scope.errorLongitude = true;
                            $scope.circuitEdit.longitude.$valid = false;
                        }
                        else if (regLon.exec($scope.meterdetails.longitude)) {
                            $scope.errorLongitude = false;
                            $scope.circuitEdit.longitude.$valid = true;
                        } else {
                            $scope.errorMessageLongitude = 'Invalid Longitude!' +
                                ' The range of longitude is 0 to +/- 180';
                            $scope.errorLongitude = true;
                            $scope.circuitEdit.longitude.$valid = false;
                        }
                    } else if (field === 'substationId') {
                      if($scope.meterdetails.substationId) {
                        if (!containsSpace.test($scope.meterdetails.substationId)) {
                          if (!$.isEmptyObject($scope.circuitEdit.substationId.$error) ||
                              $scope.meterdetails.substationId.trim().length === 0) {
                              $scope.errorMessageSubstnId = 'Sub-station ID is required';
                              $scope.errorSubstnId = true;
                              $scope.circuitEdit.substationId.$valid = false;
                          } else if ($scope.meterdetails.substationId.length > 30) {
                              $scope.errorMessageSubstnId = 'Length of Sub-station ID must not be more than 30!';
                              $scope.errorSubstnId = true;
                              $scope.circuitEdit.substationId.$valid = false;
                          } else if (!pattern.test($scope.meterdetails.substationId.trim())) {
                              $scope.errorMessageSubstnId = 'Invalid Sub-station ID!';
                              $scope.errorSubstnId = true;
                              $scope.circuitEdit.substationId.$valid = false;
                          } else {
                              $scope.errorSubstnId = false;
                              $scope.circuitEdit.substationId.$valid = true;
                          }
                        } else {
                          $scope.errorMessageSubstnId = 'Invalid Sub-station ID!';
                          $scope.errorSubstnId = true;
                          $scope.circuitEdit.substationId.$valid = false;
                        }
                      } else {
                        $scope.errorMessageSubstnId = 'Sub-station ID is required';
                        $scope.errorSubstnId = true;
                        $scope.circuitEdit.substationId.$valid = false;
                      }
                    } else if (field === 'substationName') {
                        if($scope.meterdetails.substationName) {
                            if(subStationCountryStateCityAddressRegex.test($scope.meterdetails.substationName)) {
                                if (!$.isEmptyObject($scope.circuitEdit.substationName.$error) ||
                                    $scope.meterdetails.substationName.trim().length === 0) {
                                    $scope.errorMessageSubstnName = 'Sub-station name is required!';
                                    $scope.errorSubstnName = true;
                                    $scope.circuitEdit.substationName.$valid = false;
                                } else if ($scope.meterdetails.substationName.length > 30) {
                                    $scope.errorMessageSubstnName = 'Length of Sub-station name must not be more than 30!';
                                    $scope.errorSubstnName = true;
                                    $scope.circuitEdit.substationName.$valid = false;
                                } else {
                                    $scope.errorSubstnName = false;
                                    $scope.circuitEdit.substationName.$valid = true;
                                }
                            } else {
                                $scope.errorMessageSubstnName = 'Invalid Sub-station name!';
                                $scope.errorSubstnName = true;
                                $scope.circuitEdit.substationName.$valid = false;
                            }
                        } else {
                            $scope.errorMessageSubstnName = 'Sub-station name is required!';
                            $scope.errorSubstnName = true;
                            $scope.circuitEdit.substationName.$valid = false;
                        }
                    } else if (field === 'substationAdd') {
                        if($scope.meterdetails.substationAdd) {
                            if(subStationCountryStateCityAddressRegex.test($scope.meterdetails.substationAdd)) {
                                if (!$.isEmptyObject($scope.circuitEdit.substationAdd.$error) ||
                                    $scope.meterdetails.substationAdd.trim().length === 0) {
                                    $scope.errorMessagesubstationAdd = 'Sub-station Address is required!';
                                    $scope.errorsubstationAdd = true;
                                    $scope.circuitEdit.substationAdd.$valid = false;
                                } else if ($scope.meterdetails.substationAdd.length > 100) {
                                    $scope.errorMessagesubstationAdd = 'Length of Sub-station address must not be more than 100!';
                                    $scope.errorsubstationAdd = true;
                                    $scope.circuitEdit.substationAdd.$valid = false;
                                } else if (!pattern.test($scope.meterdetails.substationAdd.trim())) {
                                    $scope.errorMessagesubstationAdd = 'Invalid Sub-station Address!';
                                    $scope.errorsubstationAdd = true;
                                    $scope.circuitEdit.substationAdd.$valid = false;
                                } else {
                                    $scope.errorsubstationAdd = false;
                                    $scope.circuitEdit.substationAdd.$valid = true;
                                }
                            }  else {
                                $scope.errorMessagesubstationAdd = 'Invalid Sub-station Address!';
                                $scope.errorsubstationAdd = true;
                                $scope.circuitEdit.substationAdd.$valid = false;
                            }
                        } else {
                            $scope.errorMessagesubstationAdd = 'Sub-station Address is required!';
                            $scope.errorsubstationAdd = true;
                            $scope.circuitEdit.substationAdd.$valid = false;
                        }
                    } else if (field === 'country') {
                        if ($scope.meterdetails.country) {
                            if (subStationCountryStateCityAddressRegex.test($scope.meterdetails.country)) {
                                if (!$.isEmptyObject($scope.circuitEdit.country.$error) ||
                                    $scope.meterdetails.country.trim().length === 0) {
                                    $scope.errorMessageCountry = 'Country is required!';
                                    $scope.errorCountry = true;
                                    $scope.circuitEdit.country.$valid = false;
                                } else if ($scope.meterdetails.country.length > 50) {
                                    $scope.errorMessageCountry = 'Length of Country must not be more than 50!';
                                    $scope.errorCountry = true;
                                    $scope.circuitEdit.country.$valid = false;
                                } else {
                                    $scope.errorCountry = false;
                                    $scope.circuitEdit.country.$valid = true;
                                }
                            } else {
                                $scope.errorMessageCountry = 'Invalid Country!';
                                $scope.errorCountry = true;
                                $scope.circuitEdit.country.$valid = false;
                            }
                        } else {
                            $scope.errorMessageCountry = 'Country is required!';
                            $scope.errorCountry = true;
                            $scope.circuitEdit.country.$valid = false;

                        }
                    } else if (field === 'state') {
                        if ($scope.meterdetails.state) {
                            if (subStationCountryStateCityAddressRegex.test($scope.meterdetails.state)) {
                                if (!$.isEmptyObject($scope.circuitEdit.state.$error) ||
                                    $scope.meterdetails.state.trim().length === 0) {
                                    $scope.errorMessageState = 'State is required!';
                                    $scope.errorState = true;
                                    $scope.circuitEdit.state.$valid = false;
                                } else if ($scope.meterdetails.state.length > 50) {
                                    $scope.errorMessageState = 'Length of State must not be more than 50!';
                                    $scope.errorState = true;
                                    $scope.circuitEdit.state.$valid = false;
                                } else {
                                    $scope.errorState = false;
                                    $scope.circuitEdit.state.$valid = true;
                                }
                            } else {
                                    $scope.errorMessageState = 'Invalid State!';
                                    $scope.errorState = true;
                                    $scope.circuitEdit.state.$valid = false;
                                }
                        } else {
                            $scope.errorMessageState = 'State is required!';
                            $scope.errorState = true;
                            $scope.circuitEdit.state.$valid = false;
                        }
                    } else if (field === 'city') {
                        if ($scope.meterdetails.city) {
                            if (subStationCountryStateCityAddressRegex.test($scope.meterdetails.city)) {
                                if (!$.isEmptyObject($scope.circuitEdit.city.$error) ||
                                    $scope.meterdetails.city.trim().length === 0) {
                                    $scope.errorMessageCity = 'City is required!';
                                    $scope.errorCity = true;
                                    $scope.circuitEdit.city.$valid = false;
                                } else if ($scope.meterdetails.city.length > 50) {
                                    $scope.errorMessageCity = 'Length of City must not be more than 50!';
                                    $scope.errorCity = true;
                                    $scope.circuitEdit.city.$valid = false;
                                } else {
                                    $scope.errorCity = false;
                                    $scope.circuitEdit.city.$valid = true;
                                }
                            } else {
                                $scope.errorMessageCity = 'Invalid City!';
                                $scope.errorCity = true;
                                $scope.circuitEdit.city.$valid = false;
                            }
                        } else {
                            $scope.errorMessageCity = 'City is required!';
                            $scope.errorCity = true;
                            $scope.circuitEdit.city.$valid = false;
                        }
                    } else if (field === 'zipcode') {
                        if ($scope.meterdetails.zipcode) {
                            if (zipCodeRegex.test($scope.meterdetails.zipcode)) {
                                if ($scope.meterdetails.zipcode.length < 4) {
                                    $scope.errorZipcodeMessage = 'Minimum Zip Code length should be 4!';
                                    $scope.errorZipcode = true;
                                    $scope.circuitEdit.zipcode.$valid = false;
                                } else {
                                    $scope.errorZipcodeMessage = '';
                                    $scope.errorZipcode = false;
                                    $scope.circuitEdit.zipcode.$valid = true;
                                }
                            } else {
                                $scope.errorZipcodeMessage = 'Invalid Zip Code!';
                                $scope.errorZipcode = true;
                                $scope.circuitEdit.zipcode.$valid = false;
                            }
                        } else {
                            $scope.errorZipcodeMessage = 'Zip Code is required!';
                            $scope.errorZipcode = true;
                            $scope.circuitEdit.zipcode.$valid = false;
                        }
                    }
                    $scope.create_circuit_valid = $scope.errorCktId || $scope.errorKvaRating || $scope.errorLatitude || $scope.errorLongitude || $scope.errorLongitude || $scope.errorSubstnId ||
                        $scope.errorSubstnName || $scope.errorCountry || $scope.errorCity || $scope.errorState || $scope.errorCity || $scope.errorsubstationAdd || $scope.errorZipcode;
                };

                /**
                 *  @description
                 * Event handler invoked when controller is destroyed
                 *
                 * @param Nil
                 * @return Nil

                 */
                $scope.$on('$destroy', function () {
                    if (!angular.isUndefinedOrNull(configurationData)) {
                        configurationData = null;
                    }
                });
            }]);
})(window.angular);
