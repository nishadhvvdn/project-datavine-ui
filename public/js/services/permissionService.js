/**
 * This check permissions for operations
 */
(function (angular) {
    "use strict";
    angular
        .module('dataVINEApp')
        .service('permissionService', ['refreshservice',
            function (refreshservice) {

                /**
                 * This function checks permissions
                 */
                this.checkPermission = function (state, callback) {
                    var insertdetails = [];
                    var funDetail = objCacheDetails.functionDetails;
                    if (angular.isUndefined(objCacheDetails.functionDetails)) {
                        refreshservice.refresh().then(function () {
                            funDetail = objCacheDetails.functionDetails;
                            check();
                        });
                    } else check();

                    /**
                     * Checks if the user has permission for an operation
                     */
                    function check() {
                        var obj = {};
                        for (var count in funDetail) {
                            if (funDetail.hasOwnProperty(count)) {
                                insertdetails.push(funDetail[count]);
                                for (var key in insertdetails[count].values) {
                                    obj[key] = insertdetails[count].values[key];
                                }
                            }
                        }
                        // For Hypersprout
                        if (state.name === 'login') {
                            return callback(true);
                        }
                        if (state.name === 'hyperSprout.configurationManagement' ||
                            state.name === 'hyperSprout.configurationManagement.configPrgm' ||
                            state.name === 'hyperSprout.configurationManagement.configurations' ||
                            state.name === 'hyperSprout.configurationManagement.downloads' ||
                            state.name === 'hyperSprout.configurationManagement.discrepancies') {
                            if (obj.ModifyHypersproutConfigurations === true ||
                                obj.ModifyHypersproutConfigurations === "true") {
                                return callback(true);
                            }
                            return callback(false);
                        }
                        if (state.name === 'hyperSprout.groupManagement') {
                            if (obj.ModifyHypersproutFirmware === true ||
                                obj.ModifyHypersproutFirmware === "true") {
                                return callback(true);
                            }
                            return callback(false);
                        }
                        if (state.name === 'hyperSprout.hyperSproutJobStatus') {
                            if (obj.HypersproutJobStatus === true ||
                                obj.HypersproutJobStatus === "true") {
                                return callback(true);
                            }
                            return callback(false);
                        }                       
                        if (state.name === 'hyperSprout.firmwareManagement') {
                            if (obj.HypersproutFirmwareManagement === true ||
                                obj.HypersproutFirmwareManagement === "true") {
                                return callback(true);
                            }
                            return callback(false);
                        }
                        // For Meter
                        if (state.name === 'meter.configurationManagement' ||
                            state.name === 'meter.configurationManagement.configPrgm' ||
                            state.name === 'meter.configurationManagement.configurations' ||
                            state.name === 'meter.configurationManagement.downloads' ||
                            state.name === 'meter.configurationManagement.discrepancies') {
                            if (obj.ModifyMeterConfigurations === true ||
                                obj.ModifyMeterConfigurations === "true") {
                                return callback(true);
                            }
                            return callback(false);
                        }
                        if (state.name === 'meter.groupManagement') {
                            if (obj.ModifyMeterFirmware === true ||
                                obj.ModifyMeterFirmware === "true") {
                                return callback(true);
                            }
                            return callback(false);
                        }
                        if (state.name === 'meter.firmwareManagement') {
                            if (obj.MeterFirmwareManagement === true ||
                                obj.MeterFirmwareManagement === "true") {
                                return callback(true);
                            }
                            return callback(false);
                        }
                        if (state.name === 'meter.JobStatus') {
                            if (obj.MeterJobStatus === true ||
                                obj.MeterJobStatus === "true") {
                                return callback(true);
                            }
                            return callback(false);
                        }
                        if (state.name === 'meter.MeterBulkOperation') {
                            if (obj.MeterBulkOperation === true ||
                                obj.MeterBulkOperation === "true") {
                                return callback(true);
                            }
                            return callback(false);
                        }                        
                        // For System Management
                        if (state.name === 'system.deviceManagement' ||
                            state.name === 'system.deviceManagement.relays' ||
                            state.name === 'system.deviceManagement.meters') {
                            if (obj.DeviceManagement === true ||
                                obj.DeviceManagement === "true") {
                                return callback(true);
                            }
                            return callback(false);
                        }
                        if (state.name === 'system.networkJobStatus') {
                            if (obj.JobStatus === true || obj.JobStatus === "true") {
                                return callback(true);
                            }
                            return callback(false);
                        }
                        if (state.name === 'system.deviceManagement.hyphersprout' ||
                            state.name === 'system.deviceManagement.meter') {
                            if (obj.EndpointCleanup === true || obj.EndpointCleanup === "true") {
                                return callback(true);
                            }
                            return callback(false);
                        }
                        // For Delta link Management
                        if (state.name === 'deltaLink.groupManagement') {
                        if (obj.deltaLinkGroupManagement === true ||
                            obj.deltaLinkGroupManagement === "true") {
                            return callback(true);
                        }
                        return callback(false);
                    }
                    if (state.name === 'deltaLink.firmwareManagement') {
                        if (obj.DeltaLinkFirmwareManagement === true ||
                            obj.DeltaLinkFirmwareManagement === "true") {
                            return callback(true);
                        }
                        return callback(false);
                    }
                    if (state.name === 'deltaLink.JobStatus') {
                        if (obj.DeltaLinkJobStatus === true ||
                            obj.DeltaLinkJobStatus === "true") {
                            return callback(true);
                        }
                        return callback(false);
                    }
                        // For Administration
                        if (state.name === 'administration.security') {
                            if (obj.ModifySecurity === true ||
                                obj.ModifySecurity === "true") {
                                return callback(true);
                            }
                            return callback(false);
                        }
                        if (state.name === 'administration.systemSettings') {
                            if (obj.ModifySystemSettings === true ||
                                obj.ModifySystemSettings === "true") {
                                return callback(true);
                            }
                            return callback(false);
                        }
                        if (state.name === 'administration.defineUsers') {
                            if (obj.ModifyUsers === true || obj.ModifyUsers === "true") {
                                return callback(true);
                            }
                            return callback(false);
                        }
                        // For Report
                        if (state.name === 'reports.communicationStatistics' ||
                            state.name === 'reports.communicationStatistics.hypersproutEntry' ||
                            state.name === 'reports.communicationStatistics.hyperhubEntry' ||
                            state.name === 'reports.communicationStatistics.meterEntry') {
                            if (obj.CommunicationStatistics === true ||
                                obj.CommunicationStatistics === "true") {
                                return callback(true);
                            }
                            return callback(false);
                        }
                        if (state.name === 'reports.dataVineHealth') {
                            if (obj.DataVINEHealth === true || obj.DataVINEHealth === "true") {
                                return callback(true);
                            }
                            return callback(false);
                        }
                        if (state.name === 'reports.systemLogs') {
                            if (obj.SystemLog === true || obj.SystemLog === "true") {
                                return callback(true);
                            }
                            return callback(false);
                        }
                        if (state.name === 'reports.deviceFirmwareVersions') {
                            if (obj.DeviceFirmwareVersions === true ||
                                obj.DeviceFirmwareVersions === "true") {
                                return callback(true);
                            }
                            return callback(false);
                        }
                        if (state.name === 'reports.deviceRegistrationStatus') {
                            if (obj.DeviceRegistrationStatus === true ||
                                obj.DeviceRegistrationStatus === "true") {
                                return callback(true);
                            }
                            return callback(false);
                        }
                          if (state.name === 'reports.newAccounts_Report') {
                            if (obj.NewAccountsReport === true ||
                                obj.NewAccountsReport === "true") {
                                return callback(true);
                            }
                            return callback(false);
                        }
                        if (state.name === 'reports.systemAuditLog') {
                            if (obj.SystemAuditLog === true || obj.SystemAuditLog === "true") {
                                return callback(true);
                            }
                            return callback(false);
                        }
                        if (state.name === 'system.grouping') {
                            if (obj.Grouping === true || obj.Grouping === "true") {
                                return callback(true);
                            }
                            return callback(false);
                        }
                        if (state.name === 'system.registration' ||
                            (state.name === 'system.registration.hyperHubEntry' ||
                                state.name === 'system.registration.circuitEntry' ||
                                state.name === 'system.registration.transformerEntry' ||
                                state.name === 'system.registration.meterEntry')) {
                            if (obj.Registration === true || obj.Registration === "true") {
                                return callback(true);
                            }
                            return callback(false);
                        }
                    }
                }

            }]);
})(window.angular);