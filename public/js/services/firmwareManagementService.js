/**
 * This handles firmware management services
 */

(function (angular) {
    "use strict";
    angular
        .module('dataVINEApp')
        .service('firmwareManagementService', ['$q', 'NetworkUtilService', 'NetworkService','logoutservice',
            function ($q, networkUtilService, networkService, logoutservice) {


                this.fetchDeltaLinkFirmwareList = function (pageNum, limit,checked) {
                    var des = $q.defer();
                    networkUtilService
                        .createHttpRequestAndGetResponse("DeltalinkFirmwareMgmtJobStatus?DeviceType=DeltaLink&Page=" + pageNum+ "&Limit="+ limit+ "&Filter="+ checked)
                        .then(function (objData) {
                            des.resolve(objData);
                        });
                    return des.promise;
                };


                /**
                 * Returns status about firmware management
                 */
                this.FirmwareMgmtJobStatus = function (DeviceType, pageNum, limit, filtervalue) {
                    let firmwareAPIUrl = '';
                    var des = $q.defer();
                    if(filtervalue) {
                        firmwareAPIUrl ="FirmwareMgmtJobStatus?Page=" + pageNum+ "&Limit="+ limit+ "&filter="+ "DownloadInProgress";
                    } else {
                        firmwareAPIUrl ="FirmwareMgmtJobStatus?Page=" + pageNum+ "&Limit="+ limit;
                    }
                    var arrInputData = [DeviceType];
                    networkUtilService
                        .createHttpRequestAndGetResponse(firmwareAPIUrl, arrInputData)
                        .then(function (objData) {
                            des.resolve(objData);
                        });
                    return des.promise;
                };

                /**
                 * Returns information abou firmware group
                 */

                this.FirmwareMgmtFirmGroup = function (DeviceType) {
                    var des = $q.defer();
                    var arrInputData = [DeviceType];
                    networkUtilService
                        .createHttpRequestAndGetResponse("FirmwareMgmtFirmGroup", arrInputData)
                        .then(function (objData) {
                            des.resolve(objData);
                        });
                    return des.promise;
                };

                /**
                 * TBD
                 */

                this.FirmwareMgmtFirmGroupSubmit = function (DeviceType, ID, Url, GroupID, CardType) {
                    var des = $q.defer();
                    var arrInputData = [DeviceType, ID, Url, GroupID, CardType];
                    networkUtilService
                        .createHttpRequestAndGetResponse("FirmwareMgmtFirmGroupSubmit", arrInputData)
                        .then(function (objData) {
                            des.resolve(objData);
                        });
                    return des.promise;
                };


                /**
                 * Upload firmware
                 */
                this.FirmwareMgmtUpload = function (FirmwareBinary, DeviceType) {
                    var des = $q.defer();
                    var file = new FormData();
                    file.append('FirmwareBinary', FirmwareBinary);
                    file.append('DeviceType', DeviceType);
                    networkService.openURL(objCacheDetails.webserviceUrl + "FirmwareMgmtUpload",
                        "POST",
                        {DeviceType : DeviceType},
                        { "Content-Type": undefined },
                        file
                    ).then(function (objResponse) {
                        if(objResponse && objResponse.data.Message.toLowerCase() !== "login first") {
                            des.resolve(objResponse.data);
                        } else {
                            logoutservice.logout().then(function () {
                                swal('Session Expired!! Please Login to continue...');
                                $state.go('login');
                            })
                        }
                    });
                    return des.promise;
                };
            }]);
})(window.angular);

