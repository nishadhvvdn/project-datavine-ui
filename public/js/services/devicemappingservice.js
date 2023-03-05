/**
 * This handles registering the device details
 */
(function (angular) {
    "use strict";
    angular
        .module('dataVINEApp')
        .service('DeviceMappingService', ['$q', 'NetworkUtilService',
            function ($q, networkUtilService) {

                /**
                 * Adds transformer unit to the circuit
                 */
                this.addTransformerToCircuit = function (circuitID, transformerID) {
                    var des = $q.defer();
                    var arrInputData = [circuitID, transformerID];
                    networkUtilService
                        .createHttpRequestAndGetResponse("AddingTransformerToCircuit", arrInputData)
                        .then(function (objData) {
                            des.resolve(handleDisplayMessage(objData));
                        });
                    return des.promise;
                };

                /**
                 * Removes a transformer from a circuit
                 */
                this.removeTransformerFromCircuit = function (circuitID, transformerID) {
                    var des = $q.defer();
                    var arrInputData = [circuitID, transformerID];
                    networkUtilService
                        .createHttpRequestAndGetResponse("RemovingTransformerFromCircuit", arrInputData)
                        .then(function (objData) {
                            des.resolve(handleDisplayMessage(objData));
                        });
                    return des.promise;
                };
                /**
                 * Resened Job for Firmware Management
                 */
                  this.resendJobFirmware= function(JobID, CardType){
                       var des = $q.defer();
                    var arrInputData = [JobID, CardType];
                    networkUtilService
                        .createHttpRequestAndGetResponse("ResendFirmwareMgmntJob", arrInputData)
                        .then(function (objData) {
                            des.resolve(handleDisplayMessage(objData));
                        });
                    return des.promise;
                  }
                  
                /**
                 * Adds a meter to a transformer
                 */
                this.addMeterToTransformer = function (transformerID, meterID) {
                    var des = $q.defer();
                    var arrInputData = [transformerID, meterID];
                    networkUtilService
                        .createHttpRequestAndGetResponse("AddingMeterToTransformer", arrInputData)
                        .then(function (objData) {
                            des.resolve(handleDisplayMessage(objData));
                        });
                    return des.promise;
                };

                /**
                 * Removes a meter from a transformer
                 */
                 this.removeMeterFromTransformer = function (SelectedMeterID, IsForceGrouping) {
                    var des = $q.defer();
                    var arrInputData = [SelectedMeterID, IsForceGrouping];
                    networkUtilService
                        .createHttpRequestAndGetResponse("RemovingMeterFromTransformer", arrInputData)
                        .then(function (objData) {
                            des.resolve(objData);
                        });
                    return des.promise;
                };

                /**
                 * Returns all the hyperhubs attached to a transformer
                 */
                this.GetAllHyperHubAttachedToTransformer = function (searchterm,page,limit,transformerID) {
                    var des = $q.defer();
                    var arrInputData = [transformerID];
                    if(searchterm == ""){
                    networkUtilService
                        .createHttpRequestAndGetResponse("GetAllHyperHubAttachedToTransformer?Page=" + page + "&Limit=" + limit, arrInputData)
                        .then(function (objData) {
                            des.resolve(objData);
                        });
                    return des.promise;
                    }else{
                        networkUtilService
                        .createHttpRequestAndGetResponse("GetAllHyperHubAttachedToTransformer?Page=" + page + "&Limit=" + limit + "&search=" + searchterm , arrInputData)
                        .then(function (objData) {
                            des.resolve(objData);
                        });
                    return des.promise;
                    }
                };

                /**
                 * Adds a hyperhub to a transformer
                 */
                this.addHyperHubToTransformer = function (transformerID, HyperHubID) {
                    var des = $q.defer();
                    var arrInputData = [transformerID, HyperHubID];
                    networkUtilService
                        .createHttpRequestAndGetResponse("AddingHyperHubToTransformer", arrInputData)
                        .then(function (objData) {
                            des.resolve(handleDisplayMessage(objData));
                        });
                    return des.promise;
                };

                /**
                 * Removes a hyperhub from a transformer
                 */
                this.RemovingHyperHubFromTransformer = function (transformerID, HyperHubID) {
                    var des = $q.defer();
                    var arrInputData = [transformerID, HyperHubID];
                    networkUtilService
                        .createHttpRequestAndGetResponse("RemovingHyperHubFromTransformer", arrInputData)
                        .then(function (objData) {
                            des.resolve(handleDisplayMessage(objData));
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
                 /**
                 * Adds a Deltalink to a meter
                 */
                this.addDeltalinkToMeter = function ( meterID , deltalinkID) {
                    var des = $q.defer();
                    var arrInputData = [meterID,deltalinkID];
                    networkUtilService
                        .createHttpRequestAndGetResponse("AddingDeltalinkToMeter", arrInputData)
                        .then(function (objData) {
                            des.resolve(handleDisplayMessage(objData));
                        });
                    return des.promise;
                };

            }]);
})(window.angular);