/**
 * This handles hypersprout configuration services
 */
(function (angular) {
    "use strict";
    angular
        .module('dataVINEApp')
        .service('hypersproutMgmtService', ['$q', 'NetworkUtilService',
            function ($q, networkUtilService) {
                var HSGroupConfigGroupList;

                /**
                 * Returns the tag discrepencies
                 */
                this.getTagDiscrepencies = function (endpoint, fromDate, toDate) {
                    var arrDate = [fromDate, toDate]
                    var des = $q.defer();
                    networkUtilService
                        .createHttpRequestAndGetResponse(endpoint, arrDate)
                        .then(function (objData) {
                            des.resolve(objData);
                        });
                    return des.promise;
                };

                /**
                 * Returns the job status
                 */
                this.getJobStatus = function (arrayParams, endpoint) {
                    var des = $q.defer();
                    networkUtilService
                        .createHttpRequestAndGetResponse(endpoint, arrayParams)
                        .then(function (objData) {
                            des.resolve(objData);
                        });
                    return des.promise;
                };

                /**
                 * Returns config data
                 */
                this.getConfigData = function () {
                    var des = $q.defer();
                    networkUtilService
                        .createHttpRequestAndGetResponse("HSMConf")
                        .then(function (objData) {
                            des.resolve(objData);
                        });
                    return des.promise;
                };

                /**
                 * Save new configuration
                 */
                this.ConfNewConfSave = function (name, deviceClass, description, confprogram, type) {
                    var des = $q.defer();
                    var arrInputData = [name, deviceClass, description, confprogram, type];
                    networkUtilService.createHttpRequestAndGetResponse("ConfNewConfSave", arrInputData).then(function (objData) {
                        des.resolve(objData);
                    });
                    return des.promise;
                };

                /**
                 * Returns configuration data
                 */
                this.getConfigDataForEdit = function (ConfigID) {
                    var des = $q.defer();
                    var arrInputData = [ConfigID];
                    networkUtilService
                        .createHttpRequestAndGetResponse("HSMConfEdit", arrInputData)
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
                        .createHttpRequestAndGetResponse("HSMGrpMgmt?Page=" + pageNum + "&Limit=" + limit )
                        .then(function (objData) {
                            des.resolve(objData);
                        });
                    return des.promise;
                };

                /**
                 * TBD
                 */
                this.HSMGrpMgmtAssignGrpMembershipCreateAppGrp = function (groupName, Description, type) {
                    var des = $q.defer();
                    var arrInputData = [groupName, Description, type];
                    networkUtilService
                        .createHttpRequestAndGetResponse("HSMGrpMgmtAssignGrpMembershipCreateAppGrp", arrInputData)
                        .then(function (objData) {
                            des.resolve(objData);
                        });
                    return des.promise;
                };

                /**
                 * TBD
                 */
                this.HSMOrMMConfNewImportSave = function (endpoint, selectedGroup, objImportedData, action) {
                    var des = $q.defer();
                    var arrHSID = objImportedData.trim().split(/[\n,\r]+/);
                    var arrInputData = [selectedGroup, arrHSID, action];
                    networkUtilService
                        .createHttpRequestAndGetResponse(endpoint, arrInputData)
                        .then(function (objData) {
                            des.resolve(objData);
                        });
                    return des.promise;
                };

                this.deltaLinkAssignGrpMembership = function (endpoint, selectedGroup, objImportedData, action, type) {
                    var des = $q.defer();
                    var Ids = objImportedData.trim().split(/[\n,\r]+/);
                    var arrInputData = [selectedGroup, action,Ids, type];
                    networkUtilService
                        .createHttpRequestAndGetResponse(endpoint, arrInputData)
                        .then(function (objData) {
                            des.resolve(objData);
                        });
                    return des.promise;
                };

                /**
                 * TBD
                 */
                this.HSMOrMMGrpMgmtAssignGrpMembershipAssignEndpoint = function (endpoint, selectedGroup, selectedAction, objImportedData, type) {
                    var des = $q.defer();
                    var arrHSID = objImportedData.trim().split(/[\n,\r]+/);
                    var arrInputData = [selectedGroup, selectedAction, arrHSID, type];
                    networkUtilService
                        .createHttpRequestAndGetResponse(endpoint, arrInputData)
                        .then(function (objData) {
                            des.resolve(objData);
                        });
                    return des.promise;
                };

                /**
                 * TBD
                 */
                this.HSMDownDownloadConfSave = function (groupName, SerialNumber) {
                    var des = $q.defer();
                    var arrInputData = [groupName, SerialNumber];
                    networkUtilService
                        .createHttpRequestAndGetResponse("HSMDownDownloadConfSave", arrInputData)
                        .then(function (objData) {
                            des.resolve(objData);
                        });
                    return des.promise;
                };

                /**
                 * Saves configuration after editing
                 */
                this.HSMConfEditSave = function (updatevalues) {
                    var des = $q.defer();
                    var arrInputData = [updatevalues];
                    networkUtilService
                        .createHttpRequestAndGetResponse("HSMConfEditSave", arrInputData)
                        .then(function (objData) {
                            des.resolve(objData);
                        });
                    return des.promise;
                };

                /**
                 * Deletes a hypersprout group
                 */
                this.HSGroupDelete = function (id, grpType, deviceType) {
                    var des = $q.defer();
                    var arrInputData = [id, grpType, deviceType];
                    networkUtilService
                        .createHttpRequestAndGetResponse("HSGroupDelete", arrInputData)
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
                 * Deletes configuration programs
                 */
                this.ConfigProgramsDelete = function (name, type) {
                    var des = $q.defer();
                    var arrInputData = [name, type];
                    networkUtilService
                        .createHttpRequestAndGetResponse("ConfigProgramsDelete", arrInputData)
                        .then(function (objData) {
                            des.resolve(objData);
                        });
                    return des.promise;
                };

                /**
                 * Edits configuration program
                 */
                this.ConfigProgramsEdit = function (name, type) {
                    var des = $q.defer();
                    var arrInputData = [name, type];
                    networkUtilService
                        .createHttpRequestAndGetResponse("ConfigProgramsEdit", arrInputData)
                        .then(function (objData) {
                            des.resolve(objData);
                        });
                    return des.promise;
                };

                /**
                 * Uploads a configuration program
                 */
                this.ConfUploadConfigProgram = function (name, details, description, type) {
                    var des = $q.defer();
                    var arrInputData = [name, details, description, type];
                    networkUtilService
                        .createHttpRequestAndGetResponse("ConfUploadConfigProgram", arrInputData)
                        .then(function (objData) {
                            des.resolve(objData);
                        });
                    return des.promise;
                };

                /**
                 * Returns list of devices attached to a configuration
                 */
                this.ListDevicesAttached = function (configId, type, grouptype) {
                    var des = $q.defer();
                    var arrInputData = [configId, type, grouptype];
                    networkUtilService
                        .createHttpRequestAndGetResponse("ListDevicesAttached", arrInputData)
                        .then(function (objData) {
                            des.resolve(objData);
                        });
                    return des.promise;
                };

                /**
                 * Downloads a hypersprout management group
                 */
                this.HsmGroupDownload = function (endPoint, arrayRes) {
                    var des = $q.defer();
                    var arrInputData = arrayRes;
                    networkUtilService
                        .createHttpRequestAndGetResponse(endPoint, arrInputData)
                        .then(function (objData) {
                            des.resolve(objData);
                        });
                    return des.promise;
                };

                this.createAppGrpForDeltaLink = function (groupName, Description, type) {
                    var des = $q.defer();
                    var arrInputData = [groupName, Description, type];
                    networkUtilService
                        .createHttpRequestAndGetResponse("DLMGrpMgmtAssignGrpMembershipCreateAppGrp", arrInputData)
                        .then(function (objData) {
                            des.resolve(objData);
                        });
                    return des.promise;
                };

                this.fetchFirmwareGroupList = function (deviceType) {
                    var des = $q.defer();
                    networkUtilService
                        .createHttpRequestAndGetResponse("FirmwareGroupLists?DeviceType=" + deviceType, [deviceType])
                        .then(function (objData) {
                            des.resolve(objData);
                        });
                    return des.promise;
                };

            }]);
})(window.angular);

