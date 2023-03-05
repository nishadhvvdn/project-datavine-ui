/**
 * This handles meter configuration services
 */
(function (angular) {
    "use strict";
    angular
        .module('dataVINEApp')
        .service('MeterMgmtService', ['$q', 'NetworkUtilService',
            function ($q, networkUtilService) {

                /**
                 * Return  meter configuration data
                 */
                this.getConfigData = function () {
                    var des = $q.defer();
                    networkUtilService
                        .createHttpRequestAndGetResponse("MMConf")
                        .then(function (objData) {
                            des.resolve(objData);
                        });
                    return des.promise;
                };

                /**
                 * TBD
                 */
                this.ConfNewConfSave = function (name, deviceClass, description, config_program, type) {
                    var des = $q.defer();
                    var arrInputData = [name, deviceClass, description, config_program, type];
                    networkUtilService
                        .createHttpRequestAndGetResponse("ConfNewConfSave", arrInputData)
                        .then(function (objData) {
                            des.resolve(objData);
                        });
                    return des.promise;
                };

                /**
                 * Returns group management data
                 */
                this.getGroupManagementData = function (pageNum, limit) {
                    var des = $q.defer();
                    networkUtilService
                        .createHttpRequestAndGetResponse("MMGrpMgmt?Page=" + pageNum + "&Limit=" + limit)
                        .then(function (objData) {
                            des.resolve(objData);
                        });
                    return des.promise;
                };

                /**
                 * TBD
                 */
                this.mmDownDownloadConfSave = function (groupName, serialNumber) {
                    var des = $q.defer();
                    var arrInputData = [groupName, serialNumber];
                    networkUtilService
                        .createHttpRequestAndGetResponse("MMDownDownloadConfSave", arrInputData)
                        .then(function (objData) {
                            des.resolve(objData);
                        });
                    return des.promise;
                };

                /**
                 * TBD
                 */
                this.MMGroupDownload = function (endPoint, arrayRes) {
                    var des = $q.defer();
                    var arrInputData = arrayRes;
                    networkUtilService
                        .createHttpRequestAndGetResponse(endPoint, arrInputData)
                        .then(function (objData) {
                            des.resolve(objData);
                        });
                    return des.promise;
                };

                /**
                 * TBD
                 */
                this.configPrograms = function (type) {
                    var des = $q.defer();
                    var arrInputData = [type];
                    networkUtilService
                        .createHttpRequestAndGetResponse("configPrograms", arrInputData)
                        .then(function (objData) {
                            des.resolve(objData);
                        });
                    return des.promise;
                };


                /**
                 * TBD
                 */
                this.UploadMeterData = function (endpoint, objImportedData, action) {
                    var des = $q.defer();
                    var arrMSID = objImportedData.trim().split(/[\n,\r]+/);
                    var arrInputData = [arrMSID, action];
                    //swal('Bulk Operation in Process...');
                    networkUtilService
                        .createHttpRequestAndGetResponse(endpoint, arrInputData)
                        .then(function (objData) {
                            des.resolve(objData);
                        });
                    return des.promise;
                };

                /**
                 * Return  meter bulk operations data
                 */
                this.getListOfJobBulkOperations = function (endPoint,  pageNum, limit, fromDate, toDate) {
                    var des = $q.defer();
                    networkUtilService
                        .createHttpRequestAndGetResponse(endPoint + "?Page=" + pageNum+ "&Limit="+ limit + "&startTime="+ fromDate + "&endTime="+ toDate)                        
                        .then(function (objData) {
                            des.resolve(objData);
                        });
                    return des.promise;
                };


                /**
                 * Return  meter bulk operations Results by date
                 */
                this.getListOfBulkOperationsByDate = function (endPoint,  startTime) {
                    //"ListOfJobBulkOperations"
                    var des = $q.defer();
                    networkUtilService
                        .createHttpRequestAndGetResponse(endPoint + "?startTime="+ startTime)                        
                        .then(function (objData) {
                            des.resolve(objData);
                        });
                    return des.promise;
                };

                

                /**
                 * Return  meter bulk All operations Results
                 */
                this.getListAllBulkOperations = function(endPoint){
                    var des = $q.defer();
                    networkUtilService
                        .createHttpRequestAndGetResponse(endPoint)                        
                        .then(function (objData) {
                            des.resolve(objData);
                        });
                    return des.promise;
                };   
                
                this.getDashboardData = function(time, id) {
                    var des = $q.defer();
                    networkUtilService
                        .createHttpRequestAndGetResponse("livedata?cellID=" + id+ "&time="+ time)                        
                        .then(function (objData) {
                            des.resolve(objData);
                        });
                    return des.promise;
                };

                this.getLiveconnection = function(cellID) {
                    var des = $q.defer();
                    networkUtilService
                        .createHttpRequestAndGetResponse("liveconnection?cellID=" + cellID)                        
                        .then(function (objData) {
                            des.resolve(objData);
                        });
                    return des.promise;
                };

            }]);
})(window.angular);