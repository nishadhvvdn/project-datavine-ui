/**
 * This handles registering the device details
 */
(function (angular) {
    'use strict';
    angular
        .module('dataVINEApp')
        .service('DeviceService', ['$q', 'NetworkUtilService','$uibModal','$state', '$timeout','NetworkService',
            function ($q, networkUtilService, $uibModal, $state, $timeout, networkService) {

            let modalInstance = null;
            this.openModalForLogs = function(operation, showBtn) {
               return modalInstance = $uibModal.open({
                   template: '<div class="container-fluid" id="readlogsverbosity">' +
                       '        <div class="log-status-msg">' +
                       '            <h3 class="status-grey"><br>{{operation}}</h3>' +
                       '<div ng-if="!showBtn">' + '<br>' + ' <br>' +'<br>' + ' <br>' + '</div>'+
                       '    <div class="row">' +
                       '        <div class="popupbtn-blk text-center">' +
                       '            <button type="button" class="" ng-if="showBtn" ng-click="closeWindow()"> OK</button>' +
                       '        </div>' +
                       '    </div>' +
                       '</div>',
                    controller: function ($scope, $modalInstance, operation, okBtn) {
                       $scope.operation = operation;
                       $scope.showBtn = okBtn;
                       $scope.closeWindow = function () {
                           $modalInstance.dismiss();
                           $state.reload();
                       };
                    },
                    size: 'sm',
                    backdrop: 'static',
                    keyboard: false,
                    windowClass: 'centermodal',
                    resolve: {
                       operation: function () {
                           return operation;
                       },
                       okBtn: function () {
                           return showBtn;
                       }
                   }
                });
            }
                this.checkMulticastMAC = function(macAddress) {
                    var firstOctet = (macAddress).split(":")[0];
                    var checkLastBit = ("00000000" + (parseInt(firstOctet, 16)).toString(2)).substr(-8);
                    return parseInt(checkLastBit[checkLastBit.length - 1]);
                }

                /**
                 * Edits information of hyperhub
                 */
                this.editHyperHub = function (hyperHubObject) {
                    var des = $q.defer();
                    var arrInputData = [
                        (hyperHubObject.HyperHubID).toString(), hyperHubObject.HubSerialNumber, hyperHubObject.HubName,
                        hyperHubObject.HardwareVersion, hyperHubObject.GprsMacID, hyperHubObject.WifiMacID,
                        hyperHubObject.WifiIPAddress, hyperHubObject.WifiAccessPointPassword,
                        hyperHubObject.Latitude, hyperHubObject.Longitude, hyperHubObject.SimCardNumber, hyperHubObject.HHWifiPassFlag];
                    networkUtilService
                        .createHttpRequestAndGetResponse("EditHyperHubDetails", arrInputData)
                        .then(function (objData) {
                            des.resolve(objData);
                        });
                    return des.promise;
                };

                /**
                 * Returns all the hyperhubs
                 */
                this.getAllhyperHub = function (type,searchTerm,pageNum, limit) {
                    var des = $q.defer();
                    var arrInputData = [type];
                    if(searchTerm == ""){
                        networkUtilService
                        .createHttpRequestAndGetResponse("DisplayAllHyperHubDetails?Page="+ pageNum+ "&Limit="+ limit,arrInputData)
                        .then(function (objData) {
                            des.resolve(objData);
                        });
                    return des.promise;
                    }else{
                        networkUtilService
                        .createHttpRequestAndGetResponse("DisplayAllHyperHubDetails?Page="+ pageNum+ "&Limit="+ limit + "&search=" + searchTerm,arrInputData)
                        .then(function (objData) {
                            des.resolve(objData);
                        });
                    return des.promise;
                    }
                };

                /**
                 * Deletes a hyperhub
                 */
                this.deleteHyperHub = function (hyperHubIDarray) {
                    var des = $q.defer();
                    var arrInputData = [hyperHubIDarray];
                    networkUtilService
                        .createHttpRequestAndGetResponse("DeleteHyperHubDetails", arrInputData)
                        .then(function (objData) {
                            des.resolve(handleDisplayMessage(objData));
                        });
                    return des.promise;
                };

                /**
                 * TBD
                 */
                this.create = function (endPoint, arrInputData, type) {
                    var des = $q.defer();
                    networkUtilService
                        .createHttpRequestAndGetResponse(endPoint, arrInputData)
                        .then(function (objData) {
                            //des.resolve(type === 'upload' ? objData : handleDisplayMessageAddDevice(objData));
                            des.resolve(objData);
                        });
                    return des.promise;
                };

                this.getLogsDetails = function (id, type, pageNum, limit) {
                    let des = $q.defer();
                    networkUtilService
                        .createHttpRequestAndGetResponse("DeviceLogsList?DeviceType="+ type + "&DeviceId="+ id +"&Page=" + pageNum+ "&Limit="+ limit)
                        .then(function (objData) {
                            des.resolve(objData);
                        });
                    return des.promise;
                }

                this.setDeviceLogsVerbosity = function (endPoint, arrInputData) {
                    let des = $q.defer();
                        networkUtilService
                            .createHttpRequestAndGetResponse(endPoint, arrInputData)
                            .then(function (objData) {
                                des.resolve(objData);
                            });
                    return des.promise;
                };
                this.clearDeviceLogs = function (endPoint, deviceType, deviceID) {
                    let des = $q.defer();
                    let arrInputData = [deviceType, deviceID];
                    networkUtilService
                        .createHttpRequestAndGetResponse(endPoint, arrInputData)
                        .then(function (objData) {
                            des.resolve(objData);
                        });
                    return des.promise;
                };
                this.deleteDeviceLogs = function (endPoint, deviceType, deviceID, files) {
                    let des = $q.defer();
                    let arrInputData = [deviceType, deviceID, files];
                    networkUtilService
                        .createHttpRequestAndGetResponse(endPoint, arrInputData)
                        .then(function (objData) {
                            des.resolve(handleDisplayMessage(objData));
                        });
                    return des.promise;
                };
                this.fetchDeviceLogs = function (endPoint, deviceType, deviceID) {
                    let des = $q.defer();
                    var arrInputData = [deviceType, deviceID];
                    networkUtilService
                        .createHttpRequestAndGetResponse(endPoint, arrInputData)
                        .then(function (objData) {
                            des.resolve((objData));
                        });
                    return des.promise;
                };

                this.getDeviceVerbosityDetails = function (deviceType, deviceId) {
                    let des = $q.defer();
                    networkUtilService
                        .createHttpRequestAndGetResponse("VerbosityDetails?DeviceType="+ deviceType +"&DeviceId="+ deviceId)
                        .then(function (objData) {
                            des.resolve((objData));
                        });
                    return des.promise;
                }
                let deltaLinkAPIUrl = '';
                this.fetchDeltaLinkList = function (searchTerm, pageNum, limit, devicesType) {
                    let des = $q.defer();
                    if(devicesType ===  'registered') {
                        deltaLinkAPIUrl =   "DisplayAllDeltalinkDetails?deviceStatus=registered&Page=" + pageNum+ "&Limit="+ limit + "&search=" + searchTerm;
                    } else if(devicesType ===  'nonRegistered') {
                        deltaLinkAPIUrl =   "DisplayAllDeltalinkDetails?deviceStatus=notRegistered&Page=" + pageNum+ "&Limit="+ limit + "&search=" + searchTerm;
                    } else {
                        deltaLinkAPIUrl =   "DisplayAllDeltalinkDetails?deviceStatus=all&Page=" + pageNum+ "&Limit="+ limit + "&search=" + searchTerm;
                    }
                    networkUtilService
                        .createHttpRequestAndGetResponse(deltaLinkAPIUrl)
                        .then(function (objData) {
                            des.resolve(objData);
                        });
                    return des.promise;
                }

                this.editDeltaLinkDetails = function (endPoint, arrInputData) {
                    let des = $q.defer();
                    networkUtilService
                        .createHttpRequestAndGetResponse(endPoint, arrInputData)
                        .then(function (objData) {
                            des.resolve(objData);
                        });
                    return des.promise;
                };

                this.deleteDeltaLinks = function (deltLinkIds) {
                    var des = $q.defer();
                    networkUtilService
                        .createHttpRequestAndGetResponse("DeleteDeltalinkDetails", [deltLinkIds])
                        .then(function (objData) {
                            des.resolve(handleDisplayMessage(objData));
                        });
                    return des.promise;
                };

                this.fetchDeltaLinkGroupList = function (pageNum, limit) {
                    let des = $q.defer();
                    networkUtilService
                        .createHttpRequestAndGetResponse("DLMGrpMgmt?Page=" + pageNum+ "&Limit="+ limit)
                        .then(function (objData) {
                            des.resolve(objData);
                        });
                    return des.promise;
                }

                this.fetchDeltaLinkJobStatus = function (pageNum, limit, urlQueryParam) {
                    let des = $q.defer();
                        networkUtilService.createHttpRequestAndGetResponse("DeltalinkJobList?DeviceType=DeltaLink&Page=" + pageNum+ "&Limit="+ limit + urlQueryParam)
                            .then(function (objData) {
                                des.resolve(objData);
                            });
                        return des.promise;
                    }

                this.fetchTechnicalLossData = function (searchTerm, serialNum, pageNum, limit) {
                    let des = $q.defer();
                    networkUtilService.createHttpRequestAndGetResponse("DisplayAllTechnicalLossItems?TransformerSN="+serialNum+"&Page=" + pageNum+ "&Limit="+ limit +"&search=" + searchTerm)
                        .then(function (objData) {
                            des.resolve(objData);
                        });
                    return des.promise;
                }

                this.editTechnicalLossDetails = function (arrInputData) {
                    let des = $q.defer();
                    networkUtilService
                        .createHttpRequestAndGetResponse("EditTransformerTechItemsEntry", arrInputData)
                        .then(function (objData) {
                            des.resolve(objData);
                        });
                    return des.promise;
                };

                this.deleteTechnicalLossDetails = function (technicalItemIds) {
                    var des = $q.defer();
                    networkUtilService
                        .createHttpRequestAndGetResponse("DeleteTransformerTechItems", [technicalItemIds])
                        .then(function (objData) {
                            des.resolve(handleDisplayMessage(objData));
                        });
                    return des.promise;
                };

                this.fetchJobStatus = function (deviceType, pageNum, limit, urlQueryParam) {
                    let des = $q.defer();
                    networkUtilService.createHttpRequestAndGetResponse("DeltalinkJobList?DeviceType=" + deviceType +"&Page=" + pageNum+ "&Limit="+ limit + urlQueryParam)
                        .then(function (objData) {
                            des.resolve(objData);
                        });
                    return des.promise;
                }


                /**
                 * Edits information about a circuit
                 */
                this.editCircuit = function (
                    CircuitNumber, circuitID, kvaRating, substationId, substationName, substationAdd,
                    country, state, city, zipcode, latitude, longitude) {
                    var des = $q.defer();
                    var arrInputData = [CircuitNumber, circuitID, kvaRating, substationId, substationName,
                        substationAdd, country, state, city, zipcode, latitude, longitude];
                    networkUtilService
                        .createHttpRequestAndGetResponse("EditCircuitDetails", arrInputData)
                        .then(function (objData) {
                            des.resolve(objData);
                        });
                    return des.promise;
                };

                /**
                 * Deletes a circuit
                 */
                this.deleteCircuit = function (arrCircuitId) {
                    var des = $q.defer();
                    var arrInputData = [arrCircuitId];
                    networkUtilService
                        .createHttpRequestAndGetResponse("DeleteCircuitDetails", arrInputData)
                        .then(function (objData) {
                            des.resolve(handleDisplayMessage(objData));
                        });
                    return des.promise;
                };

                /**
                 * Returns information about all the circuits
                 */
                this.getAllCircuits = function (searchTerm,pageNum, limit) {
                    var des = $q.defer();
                    if(searchTerm == ""){
                        networkUtilService
                        .createHttpRequestAndGetResponse("DisplayAllCircuitDetails?Page="+ pageNum+ "&Limit="+ limit)
                        .then(function (objData) {
                            des.resolve(objData);
                        });
                    return des.promise;
                    }else{
                        networkUtilService
                        .createHttpRequestAndGetResponse("DisplayAllCircuitDetails?Page="+ pageNum+ "&Limit="+ limit + "&search=" + searchTerm)
                        .then(function (objData) {
                            des.resolve(objData);
                        });
                    return des.promise;
                    }
                };

                /**
                 * Edits information about a meter
                 */
                this.editMeter = function (
                    MeterId, MeterSerialNumber, MeterApptype, MeterVersion, MeterInstallationLocation,
                    MeterCTRatio, MeterPTRatio, MeterNumberOfPhases, MeterRatedFrequency, MeterRatedVoltage,
                    MeterNominalCurrent, MeterMaximumCurrent, MeterMeasurementClass, MeterCompliantToStandards,
                    MeterWiFiIpAddress, MeterWiFiAccessPointPassword, MeterAdminPassword, MeterLatitude,
                    MeterLongitude, MeterConsumerNumber, MeterConsumerName, MeterConsumerAddress,
                    MeterConsumerContactNumber, MeterBillingCycleDate, MeterBillingTime, MeterDemandResetDate,
                    MeterMake, MeterDisconnector, MeterConsumerCountry, MeterConsumerState, MeterConsumerCity,
                    MeterConsumerZipCode, MeterWiFiMacID, ImpulseCountKWh, ImpulseCountKVARh, SealID,
                    BiDirectional, EVMeter, SolarPanel, MeterWifiPassFlag) {
                    var des = $q.defer();
                    var arrInputData = [
                        MeterId, MeterSerialNumber, MeterApptype, MeterVersion, MeterInstallationLocation,
                        MeterCTRatio, MeterPTRatio, MeterNumberOfPhases, MeterRatedFrequency, MeterRatedVoltage,
                        MeterNominalCurrent, MeterMaximumCurrent, MeterMeasurementClass, MeterCompliantToStandards,
                        MeterWiFiIpAddress, MeterWiFiAccessPointPassword, MeterAdminPassword, MeterLatitude,
                        MeterLongitude, MeterConsumerNumber, MeterConsumerName, MeterConsumerAddress,
                        MeterConsumerContactNumber, MeterBillingCycleDate, MeterBillingTime, MeterDemandResetDate,
                        MeterMake, MeterDisconnector, MeterConsumerCountry, MeterConsumerState, MeterConsumerCity,
                        MeterConsumerZipCode, MeterWiFiMacID, ImpulseCountKWh, ImpulseCountKVARh, SealID,
                        BiDirectional, EVMeter, SolarPanel, MeterWifiPassFlag];
                    networkUtilService
                        .createHttpRequestAndGetResponse("EditMeterDetails", arrInputData)
                        .then(function (objData) {
                            des.resolve(objData);
                        });
                    return des.promise;
                };

                /**
                 * Deletes a meter based on the ID passed
                 */
                this.deleteMeters = function (arrMeterId) {
                    var des = $q.defer();
                    var arrInputData = [arrMeterId];
                    networkUtilService
                        .createHttpRequestAndGetResponse("DeleteMeterDetails", arrInputData)
                        .then(function (objData) {
                            des.resolve(handleDisplayMessage(objData));
                        });
                    return des.promise;
                };

                /**
                 * Returns a list of all meters
                 */
                this.getAllMeters = function (type,searchMeterEntry,searchTerm,pageNum, limit) {
                    var des = $q.defer();
                    var arrInputData = [type];
                    if(searchTerm == ""){
                        networkUtilService
                        .createHttpRequestAndGetResponse("SMMeters?Page="+ pageNum+ "&Limit="+ limit,arrInputData)
                        .then(function (objData) {
                            des.resolve(objData);
                        });
                    return des.promise;
                    }else{
                        if(searchMeterEntry == "tsn"){
                            networkUtilService
                            .createHttpRequestAndGetResponse("SMMeters?Page="+ pageNum+ "&Limit="+ limit + "&searchByMeterSerialNumber=" + searchTerm,arrInputData)
                            .then(function (objData) {
                                des.resolve(objData);
                            });
                            return des.promise;
                        }else  if(searchMeterEntry == "hsn"){
                            networkUtilService
                            .createHttpRequestAndGetResponse("SMMeters?Page="+ pageNum+ "&Limit="+ limit + "&searchByMeterConsumerNumber=" + searchTerm,arrInputData)
                            .then(function (objData) {
                                des.resolve(objData);
                            });
                            return des.promise;
                        }else{
                            networkUtilService
                            .createHttpRequestAndGetResponse("SMMeters?Page="+ pageNum+ "&Limit="+ limit+"&search1="+searchTerm,arrInputData)
                            .then(function (objData) {
                                des.resolve(objData);
                            });
                            return des.promise;
                        }
                    }
                };
                /**
                 * Returns a list of getAllgroupedMeters meters
                 */
                this.getAllgroupedMeters = function (type,searchMeterEntry,searchTerm,pageNum, limit,selectedTransformerID) {
                    var des = $q.defer();
                    var arrInputData = [type];
                    if(searchTerm == ""){
                        networkUtilService
                        .createHttpRequestAndGetResponse("SMMeters?Page="+ pageNum+ "&Limit="+ limit + "&IsGrouping=true&TID=" + selectedTransformerID + "&groupedMeter=true",arrInputData)
                        .then(function (objData) {
                            des.resolve(objData);
                        });
                    return des.promise;
                    }else{
                        if(searchMeterEntry == "tsn"){
                            networkUtilService
                            .createHttpRequestAndGetResponse("SMMeters?Page="+ pageNum+ "&Limit="+ limit + "&searchByMeterSerialNumber=" + searchTerm + "&IsGrouping=true&TID=" + selectedTransformerID + "&groupedMeter=true",arrInputData)
                            .then(function (objData) {
                                des.resolve(objData);
                            });
                            return des.promise;
                        }else  if(searchMeterEntry == "hsn"){
                            networkUtilService
                            .createHttpRequestAndGetResponse("SMMeters?Page="+ pageNum+ "&Limit="+ limit + "&searchByMeterConsumerNumber=" + searchTerm + "&IsGrouping=true&TID=" + selectedTransformerID + "&groupedMeter=true",arrInputData)
                            .then(function (objData) {
                                des.resolve(objData);
                            });
                            return des.promise;
                        }else{
                            networkUtilService
                            .createHttpRequestAndGetResponse("SMMeters?Page="+ pageNum+ "&Limit="+ limit+"&IsGrouping=true&search1="+searchTerm + "&TID=" + selectedTransformerID + "&groupedMeter=true",arrInputData)
                            .then(function (objData) {
                                des.resolve(objData);
                            });
                            return des.promise;
                        }
                    }
                };
                this.getUnassignedMeters = function (type,searchMeterEntry,searchTerm,pageNum, limit) {
                    var des = $q.defer();
                    var arrInputData = [type];
                    if(searchTerm == ""){
                        networkUtilService
                        .createHttpRequestAndGetResponse("SMMeters?Page="+ pageNum+ "&Limit="+ limit + "&IsGrouping=true",arrInputData)
                        .then(function (objData) {
                            des.resolve(objData);
                        });
                    return des.promise;
                    }else{
                        if(searchMeterEntry == "tsn"){
                            networkUtilService
                            .createHttpRequestAndGetResponse("SMMeters?Page="+ pageNum+ "&Limit="+ limit + "&searchByMeterSerialNumber=" + searchTerm + "&IsGrouping=true",arrInputData)
                            .then(function (objData) {
                                des.resolve(objData);
                            });
                            return des.promise;
                        }else  if(searchMeterEntry == "hsn"){
                            networkUtilService
                            .createHttpRequestAndGetResponse("SMMeters?Page="+ pageNum+ "&Limit="+ limit + "&searchByMeterConsumerNumber=" + searchTerm + "&IsGrouping=true",arrInputData)
                            .then(function (objData) {
                                des.resolve(objData);
                            });
                            return des.promise;
                        }else{
                            networkUtilService
                            .createHttpRequestAndGetResponse("SMMeters?Page="+ pageNum+ "&Limit="+ limit+"&IsGrouping=true&search1="+searchTerm ,arrInputData)
                            .then(function (objData) {
                                des.resolve(objData);
                            });
                            return des.promise;
                        }
                    }
                }
                this.fetchDeltaLinkListAll = function (searchTerm, pageNum, limit) {
                    let des = $q.defer();
                    networkUtilService
                        .createHttpRequestAndGetResponse("DisplayAllDeltalinkDetails?deviceStatus=all&Page=" + pageNum+ "&Limit="+ limit + "&search=" + searchTerm)
                        .then(function (objData) {
                            des.resolve(objData);
                        });
                    return des.promise;
                }

                this.fetchmetertoDeltaLinkList = function (pageNum, limit) {
                    let des = $q.defer();
                    networkUtilService
                        .createHttpRequestAndGetResponse("DisplayAllDeltalinkDetails?Page=" + pageNum+ "&Limit="+ limit + "&deviceStatus=all")
                        .then(function (objData) {
                            des.resolve(objData);
                        });
                    return des.promise;
                }

                 /**
                 * Returns a list of all deltalinlk
                 */
                this.getAlldeltalinlk = function (pageNum, limit) {
                    var des = $q.defer();
                    var arrInputData = ["All"];
                    networkUtilService
                        .createHttpRequestAndGetResponse("DisplayAllDeltalinkDetails?Page=" + pageNum+ "&Limit="+ limit + "&deviceStatus=all", arrInputData)
                        .then(function (objData) {
                            if (!angular.isUndefinedOrNull(objData) && objData.type) {
                                des.resolve(objData.details);
                            } else {
                                des.resolve(null);
                            }
                        });
                    return des.promise;
                };

                 /**
                 * Removes a deltalink from a meter
                 */
                this.removeDeltalinkFromMeter = function (meterID, deltalinkID) {
                    var des = $q.defer();
                    var arrInputData = [meterID,deltalinkID];
                    networkUtilService
                        .createHttpRequestAndGetResponse("RemovingDeltalinkFromMeter", arrInputData)
                        .then(function (objData) {
                            des.resolve(handleDisplayMessage(objData));
                        });
                    return des.promise;
                };

                /**
                 * Returns a list of all transformers
                 */
                this.getAllTransformers = function (searchTerm,pageNum, limit) {
                    var des = $q.defer();
                    if(searchTerm == ""){
                        networkUtilService
                        .createHttpRequestAndGetResponse("DisplayAllTransformerDetails?Page="+ pageNum+ "&Limit="+ limit)
                        .then(function (objData) {
                            des.resolve(objData);
                        });
                    return des.promise;
                }else{
                            networkUtilService
                            .createHttpRequestAndGetResponse("DisplayAllTransformerDetails?Page="+ pageNum+ "&Limit="+ limit+"&search="+searchTerm)
                            .then(function (objData) {
                                des.resolve(objData);
                            });
                            return des.promise;
                        }
                };
                /**
                 * Returns a list of grouped  transformers for a specific DTC
                 */
                this.getGroupedTransformers = function (searchTransformerEntry,searchTerm,pageNum, limit,curcuitID) {
                    var des = $q.defer();
                    if(searchTerm == ""){
                        networkUtilService
                        .createHttpRequestAndGetResponse("DisplayAllTransformerDetails?Page="+ pageNum+ "&Limit="+ limit+"&IsGrouping=true&CID="+curcuitID)
                        .then(function (objData) {
                            des.resolve(objData);
                        });
                             return des.promise;
                    }else{
                        if(searchTransformerEntry == "tsn"){
                            networkUtilService
                            .createHttpRequestAndGetResponse("DisplayAllTransformerDetails?Page="+ pageNum+ "&Limit="+ limit +"&IsGrouping=true&searchByHypersproutSerialNumber=" + searchTerm +"&CID="+curcuitID)
                            .then(function (objData) {
                                des.resolve(objData);
                            });
                            return des.promise;
                        }else if(searchTransformerEntry == "all"){
                            networkUtilService
                            .createHttpRequestAndGetResponse("DisplayAllTransformerDetails?Page="+ pageNum+ "&Limit="+ limit + "&search=" + searchTerm+"&CID="+curcuitID)
                            .then(function (objData) {
                                des.resolve(objData);
                            });
                            return des.promise;
                        }else if(searchTransformerEntry == "HypersproutMake"){
                            networkUtilService
                            .createHttpRequestAndGetResponse("DisplayAllTransformerDetails?Page="+ pageNum+ "&Limit="+ limit + "&IsGrouping=true&searchByHypersproutName=" + searchTerm+"&CID="+curcuitID)
                            .then(function (objData) {
                                des.resolve(objData);
                            });
                            return des.promise;
                        }else if(searchTransformerEntry == "HypersproutVersion"){
                            networkUtilService
                            .createHttpRequestAndGetResponse("DisplayAllTransformerDetails?Page="+ pageNum+ "&Limit="+ limit + "&IsGrouping=true&searchByHypersproutHarwareVersion=" + searchTerm +"&CID="+curcuitID)
                            .then(function (objData) {
                                des.resolve(objData);
                            });
                            return des.promise;
                        }else if(searchTransformerEntry == "noOfMeters"){
                            networkUtilService
                            .createHttpRequestAndGetResponse("DisplayAllTransformerDetails?Page="+ pageNum+ "&Limit="+ limit + "&IsGrouping=true&searchByNoOfMeters=" + searchTerm+"&CID="+curcuitID)
                            .then(function (objData) {
                                des.resolve(objData);
                            });
                            return des.promise;
                        }
                    }
                };

                /**
                 * Returns a list of unassigned transformers for a specific DTC
                 */
                this.getUnassignedTransformers = function (searchBy,searchTerm ,pageNum, limit) {
                    var des = $q.defer();
                    if(searchTerm == ""){
                        networkUtilService
                        .createHttpRequestAndGetResponse("DisplayAllTransformerDetails?Page="+ pageNum+ "&Limit="+ limit+"&IsGrouping=true")
                        .then(function (objData) {
                            des.resolve(objData);
                        });
                             return des.promise;
                    }else{
                        if(searchBy == "tsn"){
                            networkUtilService
                            .createHttpRequestAndGetResponse("DisplayAllTransformerDetails?Page="+ pageNum+ "&Limit="+ limit +"&IsGrouping=true&searchByHypersproutSerialNumber=" + searchTerm)
                            .then(function (objData) {
                                des.resolve(objData);
                            });
                            return des.promise;
                        }else if(searchBy == "hsName"){
                            networkUtilService
                            .createHttpRequestAndGetResponse("DisplayAllTransformerDetails?Page="+ pageNum+ "&Limit="+ limit + "&IsGrouping=true&searchByHypersproutName=" + searchTerm)
                            .then(function (objData) {
                                des.resolve(objData);
                            });
                            return des.promise;
                        }else if(searchBy == "hv"){
                            networkUtilService
                            .createHttpRequestAndGetResponse("DisplayAllTransformerDetails?Page="+ pageNum+ "&Limit="+ limit + "&IsGrouping=true&searchByHypersproutHarwareVersion=" + searchTerm)
                            .then(function (objData) {
                                des.resolve(objData);
                            });
                            return des.promise;
                        }else if(searchBy == "mC"){
                            networkUtilService
                            .createHttpRequestAndGetResponse("DisplayAllTransformerDetails?Page="+ pageNum+ "&Limit="+ limit + "&IsGrouping=true&searchByNoOfMeters=" + searchTerm)
                            .then(function (objData) {
                                des.resolve(objData);
                            });
                            return des.promise;
                        }
                    }
                };


                /**
                 * Edits information about a transformer
                 */
                this.editTransformer = function (
                    TransformerID, HypersproutID, TFMRSerialNumber, TFMRName, TFMRMake, TFMRRatingCapacity, TFMRHighLineVoltage,
                    TFMRLowLineVoltage, TFMRHighLineCurrent, TFMRLowLineCurrent, TFMRType, HypersproutSerialNumber,
                    HypersproutVersion, HypersproutMake, HSCTRatio, HSPTRatio, HSRatedVoltage, HSNumberOfPhases,
                    HSRatedFrequency, HSAccuracy, HSDemandResetDate, HSCompliantToStandards, HSMaxDemandWindow,
                    HSMaxDemandSlidingWindowInterval, HSSensorDetails, HSGPRSMacID, HSWiFiMacID, HSWiFiIpAddress,
                    HSWiFiAccessPointPassword, HSSimCardNumber, HSLatitude, HSLongitude, ConnectedStreetlights,
                    StreetlightsMetered, MaxOilTemp, MinOilTemp, StreetlightUsage, HSCoils,Otp,NoOfConnectedStreetlights, // Added Coil field in function parameter
                    WireSize, HSWifiPassFlag, ConnectedCamera, StreetLightStartTime, StreetLightEndTime) {
                    var des = $q.defer();
                    var arrInputData = [
                        TransformerID, HypersproutID, TFMRSerialNumber, TFMRName, TFMRMake, TFMRRatingCapacity, TFMRHighLineVoltage,
                        TFMRLowLineVoltage, TFMRHighLineCurrent, TFMRLowLineCurrent, TFMRType, HypersproutSerialNumber,
                        HypersproutVersion, HypersproutMake, HSCTRatio, HSPTRatio, HSRatedVoltage, HSNumberOfPhases,
                        HSRatedFrequency, HSAccuracy, HSDemandResetDate, HSCompliantToStandards, HSMaxDemandWindow,
                        HSMaxDemandSlidingWindowInterval, HSSensorDetails, HSGPRSMacID, HSWiFiMacID, HSWiFiIpAddress,
                        HSWiFiAccessPointPassword, HSSimCardNumber, HSLatitude, HSLongitude, ConnectedStreetlights,
                        StreetlightsMetered, MaxOilTemp, MinOilTemp, StreetlightUsage, HSCoils,Otp,NoOfConnectedStreetlights, // Pushing coil data with the array
                        WireSize, HSWifiPassFlag, ConnectedCamera, StreetLightStartTime, StreetLightEndTime];
                    networkUtilService
                        .createHttpRequestAndGetResponse("EditTransformerHypersproutDetails", arrInputData)
                        .then(function (objData) {
                            des.resolve(objData);
                        });
                    return des.promise;
                };

                /**
                 * Deletes transformer based on the ID passed
                 */
                this.deleteTransformers = function (transformerId, hypersproutId) {
                    var des = $q.defer();
                    var arrInputData = [transformerId, hypersproutId];
                    networkUtilService
                        .createHttpRequestAndGetResponse("DeleteTransformerHypersproutDetails", arrInputData)
                        .then(function (objData) {
                            des.resolve(handleDisplayMessage(objData));
                        });
                    return des.promise;
                };
                this.getCircuitList = function() {
                    var des = $q.defer();
                    networkUtilService
                    .createHttpRequestAndGetResponse("GetCircuitIDLists")
                    .then(function (objData) {
                        des.resolve(objData);
                    });
                return des.promise;
                }

                var circuitList = [];
                this.getCircuitList().then(function (objData) {
                        circuitList = [];
                        if (!angular.isUndefinedOrNull(objData)) {
                            for (var i = 0; i < objData.CircuitDetails.length; i++) {
                                var objToInsert = {};
                                objToInsert["CircuitNumber"] =
                                    objData.CircuitDetails[i].CircuitNumber;
                                objToInsert["circuitId"] =
                                    objData.CircuitDetails[i].CircuitID;
                                circuitList.push(objToInsert);
                            }
                        }
                    });

                this.getListOfCircuit = function (){
                    return circuitList;
                };

                /**
                 * Returns list of all endpoints
                 */
                this.getAllEndPointDetails = function (searchTerm,pageNum, limit) {
                    var des = $q.defer();
                    if(searchTerm == ""){
                        networkUtilService
                        .createHttpRequestAndGetResponse("DisplayAllEndpointDetails?Page="+ pageNum+ "&Limit="+ limit)
                        .then(function (objData) {
                            des.resolve(objData);
                        });
                    return des.promise;
                    }else{
                        networkUtilService
                        .createHttpRequestAndGetResponse("DisplayAllEndpointDetails?Page="+ pageNum+ "&Limit="+ limit + "&search=" + searchTerm)
                        .then(function (objData) {
                            des.resolve(objData);
                        });
                    return des.promise;
                    }
                };

                /**
                 * Edits information about an endpoint
                 */
                this.editEndpoint = function (endpointObject) {
                    var des = $q.defer();
                    var arrInputData = [endpointObject.EndpointID.toString(), endpointObject.Owner,
                    endpointObject.MacID, endpointObject.Description, endpointObject.CircuitID,endpointObject.DeviceType];
                    networkUtilService
                        .createHttpRequestAndGetResponse("EditEndpointDetails", arrInputData)
                        .then(function (objData) {
                            des.resolve(objData);
                        });
                    return des.promise;
                };

                /**
                 * Deletes an endpoint based on the ID passed
                 */
                this.deleteEndPointDetails = function (endPointIdArray) {
                    var des = $q.defer();
                    var arrInputData = [endPointIdArray];
                    networkUtilService
                        .createHttpRequestAndGetResponse("DeleteEndpointDetails", arrInputData)
                        .then(function (objData) {
                            des.resolve(handleDisplayMessage(objData));
                        });
                    return des.promise;
                };

                /**
                 * Returns a list of all meters
                 */
                this.getSysteminformationDetails = function (deviceID, type) {
                    var des = $q.defer();
                    var arrInputData = [deviceID, type];
                    networkUtilService
                        .createHttpRequestAndGetResponse("fetchSystemInformation", arrInputData)
                        .then(function (objData) {
                            if (!angular.isUndefinedOrNull(objData) && objData.type) {
                                des.resolve(objData);
                            } else {
                                des.resolve(null);
                            }
                        });
                    return des.promise;
                };
                     /**
                 * Returns a list of all meters
                 */
                this.setConfigDetails = function (apiName, deviceID, serialNumber, configType, type, deviceType, saveConfigDetails) {
                    var des = $q.defer();
                    var arrInputData = [deviceID, serialNumber, configType, type, deviceType, saveConfigDetails];
                    networkUtilService
                        .createHttpRequestAndGetResponse(apiName, arrInputData)
                        .then(function (objData) {
                            des.resolve(handleDisplayMessage(objData));
                        });
                    return des.promise;
                };
                        /**
                 * Returns a list of all meters
                 */
                this.setAlarmConfigDetails = function (deviceID, serialNumber, deviceType, saveConfigDetails) {
                    var des = $q.defer();
                    var arrInputData = [deviceID, serialNumber, deviceType, saveConfigDetails];
                    networkUtilService
                        .createHttpRequestAndGetResponse("AlarmsEvents", arrInputData)
                        .then(function (objData) {
                            des.resolve(handleDisplayMessage(objData));
                        });
                    return des.promise;
                };
                /**
                 * Upload firmware
                 */
                this.setCloudConnectivityDetails = function (deviceID, serialNumber, configType, type, deviceType, configBinary, hostname, sak) {
                    var des = $q.defer();
                   var saveConfig = {   deviceId: deviceID,
                        serialNumber: serialNumber,
                        ConfigType: configType,
                        Type: type,
                        DeviceType: deviceType,
                        Hostname: hostname,
                        SAK: sak
                  }
                    var file = new FormData();
                    file.append('FileBinary', configBinary);
                    file.append('DeviceDetails', JSON.stringify(saveConfig));
                    networkService.openURL(objCacheDetails.webserviceUrl + "CloudConnectivity",
                        "POST",
                        {DeviceId: deviceID,
                            Hostname: hostname,
                            SAK: sak},
                        { "Content-Type": undefined },
                        file
                    ).then(function (objData) {
                        des.resolve(handleDisplayMessage(objData.data));
                    });
                    return des.promise;
                };
                this.fetchcountryDefaultValues = function (country) {
                    var des = $q.defer();
                    var arrInputData = [country, 1];
                   networkUtilService
                        .createHttpRequestAndGetResponse("fetchCountryDefaults", arrInputData)
                        .then(function (objData) {
                            if (!angular.isUndefinedOrNull(objData) && objData.type) {
                                des.resolve(objData);
                            } else {
                                des.resolve(null);
                            }
                        });
                    return des.promise;
                };
                this.fetchCarrierListDetails = function (deviceID) {
                        var des = $q.defer();
                        var arrInputData = [deviceID];
                        networkUtilService
                            .createHttpRequestAndGetResponse("carrierList", arrInputData)
                            .then(function (objData) {
                                if (!angular.isUndefinedOrNull(objData)) {
                                    des.resolve(objData);
                                } else {
                                    des.resolve(null);
                                }
                            });
                        return des.promise;
                };
                this.scanMeshProfileDetails = function (deviceID, serialNumber, deviceType) {
                    var des = $q.defer();
                    var arrInputData = [deviceID, serialNumber, deviceType];
                   networkUtilService
                        .createHttpRequestAndGetResponse("ScanAvailableMeshProfiles", arrInputData)
                        .then(function (objData) {
                            if (!angular.isUndefinedOrNull(objData) && objData.type) {
                                des.resolve(objData);
                            } else {
                                des.resolve(objData);
                            }
                        });
                    return des.promise;
                };
                
                /**
                 * Displays the handler's message
                 */
                function handleDisplayMessage(objData) {
                    if (!angular.isUndefinedOrNull(objData) &&
                        !angular.isUndefinedOrNull(objData.Message)) {
                        return objData.Message;
                    }
                    return "Failed to perform operation !! Try again";
                }

                this.handleDisplayMessageAddDevice = function(objData) {
                    if (!angular.isUndefinedOrNull(objData) &&
                            !angular.isUndefinedOrNull(objData.Message) && !angular.isUndefinedOrNull(objData.Errors)) {
                            if (objData.Errors.length > 0) {
                                if(objData.Errors.length > 1) {
                                    var errMsg = '';
                                    for(var i=0; i < objData.Errors.length; i++) {
                                        if(i === 0) {
                                            errMsg = '\u2022 ' + objData.Errors[i];
                                        } else { 
                                            errMsg = errMsg + '\n\u2022 ' + objData.Errors[i];
                                        }
                                    }
                                    return errMsg ? errMsg : "Failed to Add/Upload !!";
                                } else {
                                    return (objData.Errors[0] ? objData.Errors[0] : "Failed to Add/Upload !!");
                                }
                            } else if (objData.type === false) {
                                return (objData.Message ? objData.Message : "Failed to Add/Upload !!");
                            } else {
                                return objData.Message;
                            } 
                    } else if (!angular.isUndefinedOrNull(objData) &&
                            !angular.isUndefinedOrNull(objData.Message)) {
                            if (objData.type === false) {
                                return (objData.Message ? objData.Message : "Failed to Add/Upload !!");
                            } else {
                                return objData.Message;
                            } 
                    }
                        return "Failed to perform operation !! Try again";
                }
                    
                this.handleDisplayMessageEditDevice = function(objData) {
                    if (!angular.isUndefinedOrNull(objData) &&
                            !angular.isUndefinedOrNull(objData.Message) && !angular.isUndefinedOrNull(objData.Errors)) {
                            if (objData.Errors.length > 0) {
                                if(objData.Errors.length > 1) {
                                    var errMsg = '';
                                    for(var i=0; i < objData.Errors.length; i++) {
                                        if(i === 0){
                                            errMsg = '\u2022 ' + objData.Errors[i];
                                        }
                                        else {
                                            errMsg = errMsg + '\n\u2022 ' + objData.Errors[i];
                                        }
                                    }
                                    return errMsg ? errMsg : "Failed to Add/Upload !!";
                                } else {
                                    return (objData.Errors[0] ? objData.Errors[0] : "Failed to Add/Upload !!");
                                }
                                //return (objData.Errors[0] ? objData.Errors[0] : "Failed to Update !!");
                            } else if (objData.type === false) {
                                return (objData.Message ? objData.Message : "Failed to Update !!");
                            } else {
                                return objData.Message;
                            } 
                    } else if (!angular.isUndefinedOrNull(objData) &&
                            !angular.isUndefinedOrNull(objData.Message)) {
                            if (objData.type === false) {
                                return (objData.Message ? objData.Message : "Failed to Update !!");
                            } else {
                                return objData.Message;
                            } 
                    }
                        return "Failed to perform operation !! Try again";
                }

                /*fetching deltalink details for specific meter*/ 
                this.fetchspecificmetertoDeltaLinkList = function (searchTerm,pageNum, limit, meterID) {
                    let des = $q.defer();
                    networkUtilService
                        .createHttpRequestAndGetResponse("DisplayAllDeltalinkDetails?Page=" + pageNum+ "&Limit="+ limit + "&deviceStatus=all&MeterID="+meterID+ "&search=" + searchTerm)
                        .then(function (objData) {
                            des.resolve(objData);
                        });
                    return des.promise;
                }

                this.getExportAllDeltalinkDetails = function() {
                    let des = $q.defer();
                    networkUtilService
                        .createHttpRequestAndGetResponse("ExportAllDeltalinkDetails")
                        .then(function (objData) {
                            des.resolve(objData);
                        });
                    return des.promise;
                }


                this.validateSuccess = function(objData){                
                    if(objData.type === true) {
                        if(objData.Result && objData.Result.length > 0 && objData.Result[0].Status === 'Pass') {
                            return true;
                        } else if(objData.Message && objData.Errors && objData.Errors.length === 0 ) {
                            return true;
                        } else if(objData.Message && !objData.Errors && !objData.Result) {
                            return true;
                        } else {
                            return false;
                        }              
                    } else {
                        if((objData.Errors) || (objData.type === false)) {
                            return false;
                        }
                    }
                }

                // New API service for Coil List API
                this.fetchPhaseData = function () {
                    var des = $q.defer();
                    networkUtilService
                        .createHttpRequestAndGetResponse("ListCoils")
                        .then(function (objData) {
                            des.resolve(objData);
                        });                    
                    return des.promise;
                };
                // Get all messages
                this.getAllMessage = function (page, limit, search, filter) {
                    var des = $q.defer();
                    networkUtilService
                    .createHttpRequestAndGetResponse("GetMessages?Page="+ page + "&Limit="+ limit+"&search&filter")
                    .then(function (objData) {
                        des.resolve(objData);
                    });
                    return des.promise;
                };
                // Get all messages by id
                this.getAllMessageById = function (id) {
                    var des = $q.defer();
                    networkUtilService
                    .createHttpRequestAndGetResponse("GetMessageById?message_id="+id)
                    .then(function (objData) {
                        des.resolve(objData);
                    });
                    return des.promise;
                };
                // update messages by id
                this.updateMessageById = function (id, is_read) {
                    var des = $q.defer();
                    networkUtilService
                    .createHttpRequestAndGetResponse("EditMessageStatus?message_id="+id, [is_read])
                    .then(function (objData) {
                        des.resolve(objData);
                    });
                    return des.promise;
                };
                // delete messages by id
                this.deleteMessageById = function (id) {
                    var des = $q.defer();
                    networkUtilService
                    .createHttpRequestAndGetResponse("DeleteMessage", [id])
                    .then(function (objData) {
                        des.resolve(objData);
                    });
                    return des.promise;
                };
                // delete messages by id
                this.GetMessageCount = function (id) {
                    var des = $q.defer();
                    networkUtilService
                    .createHttpRequestAndGetResponse("GetMessageCount")
                    .then(function (objData) {
                        des.resolve(objData);
                    });
                    return des.promise;
                };
            }]);
})(window.angular);
