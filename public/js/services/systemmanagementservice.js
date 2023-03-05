/**
 * This handles System management services
 */
(function (angular) {
    "use strict";
    angular
        .module('dataVINEApp')
        .service('SystemManagementService', ['$q', 'NetworkUtilService',
            function ($q, networkUtilService) {

                /**
                 * Returns job status
                 */
                this.getJobStatus = function () {
                    var des = $q.defer();
                    networkUtilService
                        .createHttpRequestAndGetResponse("SMNetworkJobStatus")
                        .then(function (objData) {
                            des.resolve(objData);
                        });
                    return des.promise;
                };

                /**
                 * Returns Hypersprout details
                 */
                this.getSMHypersproutDetails = function (param,type,searchTerm, pageNum, limit, devicesType,searchBy) {
                    if(searchTerm == ""){
                        var des = $q.defer();
                        var arrInputData = [param, type];
                        networkUtilService
                            .createHttpRequestAndGetResponse("SMHyperSprout?Page=" + pageNum+ "&Limit="+ limit + devicesType, arrInputData)
                            .then(function (objData) {
                                des.resolve(objData);
                            });
                        return des.promise;
                    }else{
                        var des = $q.defer();
                        var arrInputData = [param, type];
                        if(searchBy == "all"){
                        networkUtilService
                            .createHttpRequestAndGetResponse("SMHyperSprout?Page=" + pageNum+ "&Limit="+ limit +  devicesType + "&search1=" + searchTerm, arrInputData)
                            .then(function (objData) {
                                des.resolve(objData);
                            });
                        return des.promise;
                        }else if(searchBy == "srchname"){
                        networkUtilService
                            .createHttpRequestAndGetResponse("SMHyperSprout?Page=" + pageNum+ "&Limit="+ limit + "&searchByHypersproutSerialNumberOrName=" + searchTerm +  devicesType , arrInputData)
                            .then(function (objData) {
                                des.resolve(objData);
                            });
                        return des.promise;
                        }else if(searchBy == "srchid"){
                        networkUtilService
                            .createHttpRequestAndGetResponse("SMHyperSprout?Page=" + pageNum+ "&Limit="+ limit + "&searchByHypersproutID=" + searchTerm +  devicesType , arrInputData)
                            .then(function (objData) {
                                des.resolve(objData);
                            });
                        return des.promise;
                        }
                    }
                };

                /**
                 * Returns Meter details
                 */
                this.getSMMeterDetails = function (param,searchTerm, pageNum, limit, devicesType,searchBy) {
                    if(searchTerm == ""){
                        var des = $q.defer();
                        var arrInputData = [param];
                        networkUtilService
                            .createHttpRequestAndGetResponse("SMMeters?Page=" + pageNum+ "&Limit="+ limit + devicesType, arrInputData)
                            .then(function (objData) {
                                des.resolve(objData);
                            });
                        return des.promise;
                    }else{
                        var des = $q.defer();
                        var arrInputData = [param];
                        if(searchBy == "all"){
                        networkUtilService
                            .createHttpRequestAndGetResponse("SMMeters?Page=" + pageNum+ "&Limit="+ limit + devicesType + "&search1=" + searchTerm, arrInputData)
                            .then(function (objData) {
                                des.resolve(objData);
                            });
                        return des.promise;
                        }else if(searchBy == "srchname"){
                        networkUtilService
                            .createHttpRequestAndGetResponse("SMMeters?Page=" + pageNum+ "&Limit="+ limit + devicesType +  "&searchByMeterSerialNumberOrName=" + searchTerm, arrInputData)
                            .then(function (objData) {
                                des.resolve(objData);
                            });
                        return des.promise;
                        }else if(searchBy == "srchid"){
                        networkUtilService
                            .createHttpRequestAndGetResponse("SMMeters?Page=" + pageNum+ "&Limit="+ limit + devicesType + "&searchByMeterID=" + searchTerm, arrInputData)
                            .then(function (objData) {
                                des.resolve(objData);
                            });
                        return des.promise;
                        }
                    }
                };

                /**
                 * Returns node ping details
                 */
                this.getNodePingDetails = function (serialId, type) {
                    var des = $q.defer();
                    var arrInputData = [serialId, type];
                    networkUtilService
                        .createHttpRequestAndGetResponse((type === 'HyperSprout') ? 'SMNodePing' : 'SMMeterNodePing',
                            arrInputData)
                        .then(function (objData) {
                            des.resolve(objData);
                        });
                    return des.promise;
                };

                this.getDeltaLinkNodePingDetails = function (serialId) {
                    let des = $q.defer();
                    networkUtilService
                        .createHttpRequestAndGetResponse("SMDeltalinkNodePing", [serialId])
                        .then(function (objData) {
                            des.resolve(objData);
                        });
                    return des.promise;
                };

                 /**
                 * Send request for Lock or unlock Device UI
                 */
                this.lockUnlockDeviceUI = function (lockunlockArray) {
                    var des = $q.defer();
                    networkUtilService
                        .createHttpRequestAndGetResponse("LockUnlockDevice", lockunlockArray)
                        .then(function (objData) {
                            des.resolve(handleDisplayMessage(objData));
                        });
                    return des.promise;
                };
                 /**
                 * Send request for Device Reboot
                 */
                this.deviceReboot = function (devicerebootArray) {
                    var des = $q.defer();
                    networkUtilService
                        .createHttpRequestAndGetResponse("remoteRebootDevice", devicerebootArray)
                        .then(function (objData) {
                            des.resolve(handleDisplayMessage(objData));
                        });
                    return des.promise;
                };
                        /**
                 * Send request for Device Factory Reset
                 */
                this.deviceFacoryReset = function (deviceFactoryResetArray) {
                    var des = $q.defer();
                    networkUtilService
                        .createHttpRequestAndGetResponse("FactoryReset", deviceFactoryResetArray)
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
                        return objData;
                    }
                    return "Failed to perform operation !! Try again";
                }

            }]);
})(window.angular);
