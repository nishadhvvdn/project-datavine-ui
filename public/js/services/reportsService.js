/**
 * This handles report realted services
 */
(function (angular) {
    "use strict";
    angular
        .module('dataVINEApp')
        .service('reportsService', ['$q', 'NetworkUtilService',
            function ($q, networkUtilService) {

                /**
                 * Returns communication statistics
                 */
                this.communicationStatistics = function (endpoint, isHyperhub, pageNum, limit, searchTerm) {
                    var des = $q.defer();
                    var arrInputData = (isHyperhub === undefined) ? [] : [isHyperhub];
                    networkUtilService
                        .createHttpRequestAndGetResponse(endpoint + '?Page=' + pageNum + '&Limit=' + limit, arrInputData)
                        .then(function (objData) {
                            des.resolve(objData);
                        });
                    return des.promise;
                };

                /**
                 * Returns a report between 2 dates
                 */
                this.NewAccountReport = function (pageNum, limit, searchTerm,time) {
                    if(searchTerm == ""){
                        var des = $q.defer();
                        networkUtilService
                            .createHttpRequestAndGetResponse("NewAccountReport?Page="+pageNum+"&Limit="+limit+time)
                            .then(function (objData) {
                                des.resolve(objData);
                            });
                        return des.promise;
                    }else{
                    var des = $q.defer();
                    networkUtilService
                        .createHttpRequestAndGetResponse("NewAccountReport?Page="+pageNum+"&Limit="+limit+time+"&search="+searchTerm)
                        .then(function (objData) {
                            des.resolve(objData);
                        });
                    return des.promise;
                }
                };

                /**
                 * Returns datavine health stats
                 */
                this.datavineHealth = function (param) {
                    var des = $q.defer();
                    var arrInputData = [param];
                    networkUtilService
                        .createHttpRequestAndGetResponse("DataVINEHealthReport", arrInputData)
                        .then(function (objData) {
                            des.resolve(objData);
                        });
                    return des.promise;
                };

                /**
                 * Returns report of system logs
                 */
                this.systemLog = function (pageNum, limit, searchTerm,time) {
                    if(searchTerm == ""){
                        var des = $q.defer();
                        networkUtilService
                            .createHttpRequestAndGetResponse("SystemLogReport?Page="+pageNum+"&Limit="+limit+time)
                            .then(function (objData) {
                                des.resolve(objData);
                            });
                        return des.promise;
                    }else{
                        var des = $q.defer();
                        networkUtilService
                            .createHttpRequestAndGetResponse("SystemLogReport?Page="+pageNum+"&Limit="+limit+time+"&search="+searchTerm)
                            .then(function (objData) {
                                des.resolve(objData);
                            });
                        return des.promise;
                    }
                };

                /**
                 * Returns report of device firmware versions
                 */
                this.deviceFirmwareVersions = function (pageNum,limit,searchTerm,type) {
                    if(searchTerm ==  ""){  
                    var des = $q.defer();
                    networkUtilService
                        .createHttpRequestAndGetResponse("DeviceFirmwareVersionReport?Page="+pageNum+"&Limit="+limit+"&DeviceType="+type)
                        .then(function (objData) {
                            des.resolve(objData);
                        });
                    return des.promise;
                    }else{
                        var des = $q.defer();
                        networkUtilService
                            .createHttpRequestAndGetResponse("DeviceFirmwareVersionReport?Page="+pageNum+"&Limit="+limit+"&search="+searchTerm+"&DeviceType="+type)
                            .then(function (objData) {
                                des.resolve(objData);
                            });
                        return des.promise;
                    }
                };

                /**
                 * Returns report of device registration
                 */
                this.deviceRegistrationStatus = function () {
                    var des = $q.defer();
                    networkUtilService
                        .createHttpRequestAndGetResponse("deviceRegistrationStatus")
                        .then(function (objData) {
                            des.resolve(objData);
                        });
                    return des.promise;
                };

                /**
                 * Returns report of user audit logs
                 */
                this.auditLog = function (pageNum, limit, searchTerm,time) {
                        var des = $q.defer();
                        networkUtilService
                            .createHttpRequestAndGetResponse("SystemAuditLogReport?Page="+pageNum+"&Limit="+limit+time)
                            .then(function (objData) {
                                des.resolve(objData);
                            });
                        return des.promise;
                };

            }]);
})(window.angular);
