'use strict';
describe('changePasswordCtrl testing', function () {

    //var $scope, $controller;
    var scope, changePasswordCtrl,negetiveCheckFunctionDetails,httpBackend,modalInstanceMock, permissionService,refreshservice;

    beforeEach(angular.mock.module('dataVINEApp'));

    beforeEach(function () {
        inject(function ($injector, $controller, $rootScope,$sessionStorage,$httpBackend) {
            scope = $rootScope.$new(); //scope = $injector.get('$rootScope')
            modalInstanceMock = {
                dismiss: function (result) {

                }
            };
            $sessionStorage.put('loginName','a');
            $sessionStorage.put('password','a');            
            objCacheDetails.userDetails = {};
            objCacheDetails.data = { "configurationDetails": [{ "Name": "Demo" }], "configPrgmData": [{ "Name": "conf1" }] };
            objCacheDetails.webserviceUrl = '/'; 
            httpBackend = $httpBackend; 
objCacheDetails.functionDetails=[
            {
                "Tools": "true",
                "values": {
                    "PerformInteractiveRead": "true",
                    "ViewJobStatus": "true"
                }
            },
            {
                "HypersproutManagement": "true",
                "values": {
                    "ModifyHypersproutConfigurations": "true",
                    "ModifyHypersproutFirmware": "true",
                    "HypersproutSecurityCodeManagement": "true",
                    "HypersproutFirmwareManagement": "true",
                    "HypersproutJobStatus": "true"
                }
            },
            {
                "MeterManagement": "true",
                "values": {
                    "ModifyMeterConfigurations": "true",
                    "ModifyMeterFirmware": "true",
                    "MeterSecurityCodeManagement": "true",
                    "MeterFirmwareManagement": "true",
                    "MeterJobStatus": "true"
                }
            },
            {
                "Administration": "true",
                "values": {
                    "ModifySecurity": "true",
                    "ModifySystemSettings": "true",
                    "ModifyUsers": "true"
                }
            },
            {
                "Reports": "true",
                "values": {
                    "CommunicationStatistics": "true",
                    "DataVINEHealth": "true",
                    "SystemLog": "true",
                    "BatteryLife": "true",
                    "DeviceFirmwareVersions": "true",
                    "SystemUpdates": "true",
                    "DeviceRegistrationStatus": "true",
                    "SystemAuditLog": "true"
                }
            },
            {
                "SystemManagement": "true",
                "values": {
                    "DeviceManagement": "true",
                    "JobStatus": "true",
                    "NetworkStatistics": "true",
                    "EndpointCleanup": "true",
                    "Registration": "true",
                    "Grouping": "true"
                }
            }
        ];

        negetiveCheckFunctionDetails=[
            {
                "Tools": "false",
                "values": {
                    "PerformInteractiveRead": "false",
                    "ViewJobStatus": "false"
                }
            },
            {
                "HypersproutManagement": "false",
                "values": {
                    "ModifyHypersproutConfigurations": "false",
                    "ModifyHypersproutFirmware": "false",
                    "HypersproutSecurityCodeManagement": "false",
                    "HypersproutFirmwareManagement": "false",
                    "HypersproutJobStatus": "false"
                }
            },
            {
                "MeterManagement": "false",
                "values": {
                    "ModifyMeterConfigurations": "false",
                    "ModifyMeterFirmware": "false",
                    "MeterSecurityCodeManagement": "false",
                    "MeterFirmwareManagement": "false",
                    "MeterJobStatus": "false"
                }
            },
            {
                "Administration": "false",
                "values": {
                    "ModifySecurity": "false",
                    "ModifySystemSettings": "false",
                    "ModifyUsers": "false"
                }
            },
            {
                "Reports": "false",
                "values": {
                    "CommunicationStatistics": "false",
                    "DataVINEHealth": "false",
                    "SystemLog": "false",
                    "BatteryLife": "false",
                    "DeviceFirmwareVersions": "false",
                    "SystemUpdates": "false",
                    "DeviceRegistrationStatus": "false",
                    "SystemAuditLog": "false"
                }
            },
            {
                "SystemManagement": "false",
                "values": {
                    "DeviceManagement": "false",
                    "JobStatus": "false",
                    "NetworkStatistics": "false",
                    "EndpointCleanup": "false",
                    "Registration": "false",
                    "Grouping": "false"
                }
            }
        ];
            permissionService = $injector.get('permissionService');

            refreshservice = $injector.get('refreshservice');
        }); // end of inject
    });
    it('testing checkPermission function with state name as login', function () {
        permissionService.checkPermission({name:'login'},function(check){
            expect(check).toBe(true);
        });
    });
    it('testing checkPermission function with state name as hyperSprout.configurationManagement', function () {
        permissionService.checkPermission({name:'hyperSprout.configurationManagement'},function(check){
            expect(check).toBe(true);
        });
    });  
    it('testing checkPermission function state name as hyperSprout.configurationManagement.configurations', function () {
        permissionService.checkPermission({name:'hyperSprout.configurationManagement.configPrgm'},function(check){
            expect(check).toBe(true);
        });
    });   
    it('testing checkPermission function state name as hyperSprout.configurationManagement.configurations', function () {
        permissionService.checkPermission({name:'hyperSprout.configurationManagement.configurations'},function(check){
            expect(check).toBe(true);
        });
    }); 
    it('testing checkPermission function state name as hyperSprout.configurationManagement.downloads', function () {
        permissionService.checkPermission({name:'hyperSprout.configurationManagement.downloads'},function(check){
            expect(check).toBe(true);
        });
    }); 
    it('testing checkPermission function state name as hyperSprout.configurationManagement.discrepancies', function () {
        permissionService.checkPermission({name:'hyperSprout.configurationManagement.discrepancies'},function(check){
            expect(check).toBe(true);
        });
    }); 
    it('testing checkPermission function state name as hyperSprout.groupManagement', function () {
        permissionService.checkPermission({name:'hyperSprout.groupManagement'},function(check){
            expect(check).toBe(true);
        });
    }); 
    it('testing checkPermission function state name as hyperSprout.securityCodeManagement', function () {
        permissionService.checkPermission({name:'hyperSprout.securityCodeManagement'},function(check){
            expect(check).toBe(true);
        });
    }); 
    it('testing checkPermission function state name as hyperSprout.hyperSproutJobStatus', function () {
        permissionService.checkPermission({name:'hyperSprout.hyperSproutJobStatus'},function(check){
            expect(check).toBe(true);
        });
    }); 
    it('testing checkPermission function state name as hyperSprout.firmwareManagement', function () {
        permissionService.checkPermission({name:'hyperSprout.firmwareManagement'},function(check){
            expect(check).toBe(true);
        });
    }); 
    it('testing checkPermission function state name as meter.configurationManagement', function () {
        permissionService.checkPermission({name:'meter.configurationManagement'},function(check){
            expect(check).toBe(true);
        });
    }); 
    it('testing checkPermission function state name as meter.configurationManagement.configPrgm', function () {
        permissionService.checkPermission({name:'meter.configurationManagement.configPrgm'},function(check){
            expect(check).toBe(true);
        });
    }); 
    it('testing checkPermission function state name as meter.configurationManagement.configurations', function () {
        permissionService.checkPermission({name:'meter.configurationManagement.configurations'},function(check){
            expect(check).toBe(true);
        });
    }); 
    it('testing checkPermission function state name as meter.configurationManagement.downloads', function () {
        permissionService.checkPermission({name:'meter.configurationManagement.downloads'},function(check){
            expect(check).toBe(true);
        });
    }); 
    it('testing checkPermission function state name as meter.configurationManagement.discrepancies', function () {
        permissionService.checkPermission({name:'meter.configurationManagement.discrepancies'},function(check){
            expect(check).toBe(true);
        });
    });    
    it('testing checkPermission function state name as meter.groupManagement', function () {
        permissionService.checkPermission({name:'meter.groupManagement'},function(check){
            expect(check).toBe(true);
        });
    });  
    it('testing checkPermission function state name as meter.securityCodeManagement', function () {
        permissionService.checkPermission({name:'meter.securityCodeManagement'},function(check){
            expect(check).toBe(true);
        });
    }); 
    it('testing checkPermission function state name as meter.firmwareManagement', function () {
        permissionService.checkPermission({name:'meter.firmwareManagement'},function(check){
            expect(check).toBe(true);
        });
    });  
    it('testing checkPermission function state name as meter.JobStatus', function () {
        permissionService.checkPermission({name:'meter.JobStatus'},function(check){
            expect(check).toBe(true);
        });
    }); 
    it('testing checkPermission function state name as system.deviceManagement', function () {
        permissionService.checkPermission({name:'system.deviceManagement'},function(check){
            expect(check).toBe(true);
        });
    });  
    it('testing checkPermission function state name as system.deviceManagement.relays', function () {
        permissionService.checkPermission({name:'system.deviceManagement.relays'},function(check){
            expect(check).toBe(true);
        });
    }); 
    it('testing checkPermission function state name as system.deviceManagement.meters', function () {
        permissionService.checkPermission({name:'system.deviceManagement.meters'},function(check){
            expect(check).toBe(true);
        });
    });  
    it('testing checkPermission function state name as system.networkJobStatus', function () {
        permissionService.checkPermission({name:'system.networkJobStatus'},function(check){
            expect(check).toBe(true);
        });
    }); 
    it('testing checkPermission function state name as system.networkStatistics', function () {
        permissionService.checkPermission({name:'system.networkStatistics'},function(check){
            expect(check).toBe(true);
        });
    });  
    it('testing checkPermission function state name as system.networkStatistics.servers_networkStatistics', function () {
        permissionService.checkPermission({name:'system.networkStatistics.servers_networkStatistics'},function(check){
            expect(check).toBe(true);
        });
    }); 

    it('testing checkPermission function state name as system.endpointCleanup', function () {
        permissionService.checkPermission({name:'system.endpointCleanup'},function(check){
            expect(check).toBe(true);
        });
    }); 
    it('testing checkPermission function state name as system.deviceManagement.hyphersprout', function () {
        permissionService.checkPermission({name:'system.deviceManagement.hyphersprout'},function(check){
            expect(check).toBe(true);
        });
    });  
    it('testing checkPermission function state name as system.deviceManagement.meter', function () {
        permissionService.checkPermission({name:'system.deviceManagement.meter'},function(check){
            expect(check).toBe(true);
        });
    }); 
    it('testing checkPermission function state name as administration.security', function () {
        permissionService.checkPermission({name:'administration.security'},function(check){
            expect(check).toBe(true);
        });
    });  
    it('testing checkPermission function state name as administration.systemSettings', function () {
        permissionService.checkPermission({name:'administration.systemSettings'},function(check){
            expect(check).toBe(true);
        });
    }); 
    it('testing checkPermission function state name as administration.defineUsers', function () {
        permissionService.checkPermission({name:'administration.defineUsers'},function(check){
            expect(check).toBe(true);
        });
    });  
    it('testing checkPermission function state name as reports.communicationStatistics', function () {
        permissionService.checkPermission({name:'reports.communicationStatistics'},function(check){
            expect(check).toBe(true);
        });
    }); 
    it('testing checkPermission function state name as reports.dataVineHealth', function () {
        permissionService.checkPermission({name:'reports.dataVineHealth'},function(check){
            expect(check).toBe(true);
        });
    });  
    it('testing checkPermission function state name as reports.systemLogs', function () {
        permissionService.checkPermission({name:'reports.systemLogs'},function(check){
            expect(check).toBe(true);
        });
    });   

    it('testing checkPermission function state name as reports.batteryLife', function () {
        permissionService.checkPermission({name:'reports.batteryLife'},function(check){
            expect(check).toBe(true);
        });
    });  
    it('testing checkPermission function state name as reports.deviceFirmwareVersions', function () {
        permissionService.checkPermission({name:'reports.deviceFirmwareVersions'},function(check){
            expect(check).toBe(true);
        });
    }); 
    it('testing checkPermission function state name as reports.systemUpdates', function () {
        permissionService.checkPermission({name:'reports.systemUpdates'},function(check){
            expect(check).toBe(true);
        });
    });  
    it('testing checkPermission function state name as reports.deviceRegistrationStatus', function () {
        permissionService.checkPermission({name:'reports.deviceRegistrationStatus'},function(check){
            expect(check).toBe(true);
        });
    }); 
    it('testing checkPermission function state name as reports.systemAuditLog', function () {
        permissionService.checkPermission({name:'reports.systemAuditLog'},function(check){
            expect(check).toBe(true);
        });
    });  
    it('testing checkPermission function state name as system.grouping', function () {
        permissionService.checkPermission({name:'system.grouping'},function(check){
            expect(check).toBe(true);
        });
    }); 
    it('testing checkPermission function state name as system.registration', function () {
        permissionService.checkPermission({name:'system.registration'},function(check){
            expect(check).toBe(true);
        });
    });  
    it('testing checkPermission function state name as system.registration.circuitEntry', function () {
        permissionService.checkPermission({name:'system.registration.circuitEntry'},function(check){
            expect(check).toBe(true);
        });
    }); 
    it('testing checkPermission function state name as system.registration.transformerEntry', function () {
        permissionService.checkPermission({name:'system.registration.transformerEntry'},function(check){
            expect(check).toBe(true);
        });
    });  
    it('testing checkPermission function state name as system.registration.meterEntry', function () {
        permissionService.checkPermission({name:'system.registration.meterEntry'},function(check){
            expect(check).toBe(true);
        });
    });  

//------------------------------------negetive test                                                                           

    it('testing checkPermission function with state name as hyperSprout.configurationManagement', function () {
        objCacheDetails.functionDetails=negetiveCheckFunctionDetails;
        permissionService.checkPermission({name:'hyperSprout.configurationManagement'},function(check){
            expect(check).toBe(false);
        });

    });  
    it('testing checkPermission function state name as hyperSprout.configurationManagement.configurations', function () {
        objCacheDetails.functionDetails=negetiveCheckFunctionDetails;
        permissionService.checkPermission({name:'hyperSprout.configurationManagement.configPrgm'},function(check){
            expect(check).toBe(false);
        });

    });   
    it('testing checkPermission function state name as hyperSprout.configurationManagement.configurations', function () {
        objCacheDetails.functionDetails=negetiveCheckFunctionDetails;
        permissionService.checkPermission({name:'hyperSprout.configurationManagement.configurations'},function(check){
            expect(check).toBe(false);
        });

    }); 
    it('testing checkPermission function state name as hyperSprout.configurationManagement.downloads', function () {
        objCacheDetails.functionDetails=negetiveCheckFunctionDetails;
        permissionService.checkPermission({name:'hyperSprout.configurationManagement.downloads'},function(check){
            expect(check).toBe(false);
        });

    }); 
    it('testing checkPermission function state name as hyperSprout.configurationManagement.discrepancies', function () {
        objCacheDetails.functionDetails=negetiveCheckFunctionDetails;
        permissionService.checkPermission({name:'hyperSprout.configurationManagement.discrepancies'},function(check){
            expect(check).toBe(false);
        });
    }); 
    it('testing checkPermission function state name as hyperSprout.groupManagement', function () {
        objCacheDetails.functionDetails=negetiveCheckFunctionDetails;
        permissionService.checkPermission({name:'hyperSprout.groupManagement'},function(check){
            expect(check).toBe(false);
        });

    }); 
    it('testing checkPermission function state name as hyperSprout.securityCodeManagement', function () {
        objCacheDetails.functionDetails=negetiveCheckFunctionDetails;
        permissionService.checkPermission({name:'hyperSprout.securityCodeManagement'},function(check){
            expect(check).toBe(false);
        });

    }); 
    it('testing checkPermission function state name as hyperSprout.hyperSproutJobStatus', function () {
        objCacheDetails.functionDetails=negetiveCheckFunctionDetails;
        permissionService.checkPermission({name:'hyperSprout.hyperSproutJobStatus'},function(check){
            expect(check).toBe(false);
        });
    }); 
    it('testing checkPermission function state name as hyperSprout.firmwareManagement', function () {
        objCacheDetails.functionDetails=negetiveCheckFunctionDetails;
        permissionService.checkPermission({name:'hyperSprout.firmwareManagement'},function(check){
            expect(check).toBe(false);
        });
    }); 
    it('testing checkPermission function state name as meter.configurationManagement', function () {
        objCacheDetails.functionDetails=negetiveCheckFunctionDetails;
        permissionService.checkPermission({name:'meter.configurationManagement'},function(check){
            expect(check).toBe(false);
        });
    }); 
    it('testing checkPermission function state name as meter.configurationManagement.configPrgm', function () {
        objCacheDetails.functionDetails=negetiveCheckFunctionDetails;
        permissionService.checkPermission({name:'meter.configurationManagement.configPrgm'},function(check){
            expect(check).toBe(false);
        });
    }); 
    it('testing checkPermission function state name as meter.configurationManagement.configurations', function () {
        objCacheDetails.functionDetails=negetiveCheckFunctionDetails;
        permissionService.checkPermission({name:'meter.configurationManagement.configurations'},function(check){
            expect(check).toBe(false);
        });
    }); 
    it('testing checkPermission function state name as meter.configurationManagement.downloads', function () {
        objCacheDetails.functionDetails=negetiveCheckFunctionDetails;
        permissionService.checkPermission({name:'meter.configurationManagement.downloads'},function(check){
            expect(check).toBe(false);
        });
    }); 
    it('testing checkPermission function state name as meter.configurationManagement.discrepancies', function () {
        objCacheDetails.functionDetails=negetiveCheckFunctionDetails;
        permissionService.checkPermission({name:'meter.configurationManagement.discrepancies'},function(check){
            expect(check).toBe(false);
        });
    });    
    it('testing checkPermission function state name as meter.groupManagement', function () {
        objCacheDetails.functionDetails=negetiveCheckFunctionDetails;
        permissionService.checkPermission({name:'meter.groupManagement'},function(check){
            expect(check).toBe(false);
        });
    });  
    it('testing checkPermission function state name as meter.securityCodeManagement', function () {
        objCacheDetails.functionDetails=negetiveCheckFunctionDetails;
        permissionService.checkPermission({name:'meter.securityCodeManagement'},function(check){
            expect(check).toBe(false);
        });
    }); 
    it('testing checkPermission function state name as meter.firmwareManagement', function () {
        objCacheDetails.functionDetails=negetiveCheckFunctionDetails;
        permissionService.checkPermission({name:'meter.firmwareManagement'},function(check){
            expect(check).toBe(false);
        });
    });  
    it('testing checkPermission function state name as meter.JobStatus', function () {
        objCacheDetails.functionDetails=negetiveCheckFunctionDetails;
        permissionService.checkPermission({name:'meter.JobStatus'},function(check){
            expect(check).toBe(false);
        });
    }); 
    it('testing checkPermission function state name as system.deviceManagement', function () {
        objCacheDetails.functionDetails=negetiveCheckFunctionDetails;
        permissionService.checkPermission({name:'system.deviceManagement'},function(check){
            expect(check).toBe(false);
        });
    });  
    it('testing checkPermission function state name as system.deviceManagement.relays', function () {
        objCacheDetails.functionDetails=negetiveCheckFunctionDetails;
        permissionService.checkPermission({name:'system.deviceManagement.relays'},function(check){
            expect(check).toBe(false);
        });
    }); 
    it('testing checkPermission function state name as system.deviceManagement.meters', function () {
        objCacheDetails.functionDetails=negetiveCheckFunctionDetails;
        permissionService.checkPermission({name:'system.deviceManagement.meters'},function(check){
            expect(check).toBe(false);
        });
    });  
    it('testing checkPermission function state name as system.networkJobStatus', function () {
        objCacheDetails.functionDetails=negetiveCheckFunctionDetails;
        permissionService.checkPermission({name:'system.networkJobStatus'},function(check){
            expect(check).toBe(false);
        });
    }); 
    it('testing checkPermission function state name as system.networkStatistics', function () {
        objCacheDetails.functionDetails=negetiveCheckFunctionDetails;
        permissionService.checkPermission({name:'system.networkStatistics'},function(check){
            expect(check).toBe(false);
        });
    });  

    it('testing checkPermission function state name as system.endpointCleanup', function () {
        objCacheDetails.functionDetails=negetiveCheckFunctionDetails;
        permissionService.checkPermission({name:'system.endpointCleanup'},function(check){
            expect(check).toBe(false);
        });
    }); 
    it('testing checkPermission function state name as system.deviceManagement.hyphersprout', function () {
        objCacheDetails.functionDetails=negetiveCheckFunctionDetails;
        permissionService.checkPermission({name:'system.deviceManagement.hyphersprout'},function(check){
            expect(check).toBe(false);
        });
    });  
    it('testing checkPermission function state name as system.deviceManagement.meter', function () {
        objCacheDetails.functionDetails=negetiveCheckFunctionDetails;
        permissionService.checkPermission({name:'system.deviceManagement.meter'},function(check){
            expect(check).toBe(false);
        });
    }); 
    it('testing checkPermission function state name as administration.security', function () {
        objCacheDetails.functionDetails=negetiveCheckFunctionDetails;
        permissionService.checkPermission({name:'administration.security'},function(check){
            expect(check).toBe(false);
        });
    });  
    it('testing checkPermission function state name as administration.systemSettings', function () {
        objCacheDetails.functionDetails=negetiveCheckFunctionDetails;
        permissionService.checkPermission({name:'administration.systemSettings'},function(check){
            expect(check).toBe(false);
        });
    }); 
    it('testing checkPermission function state name as administration.defineUsers', function () {
        objCacheDetails.functionDetails=negetiveCheckFunctionDetails;
        permissionService.checkPermission({name:'administration.defineUsers'},function(check){
            expect(check).toBe(false);
        });
    });  
    it('testing checkPermission function state name as reports.communicationStatistics', function () {
        objCacheDetails.functionDetails=negetiveCheckFunctionDetails;
        permissionService.checkPermission({name:'reports.communicationStatistics'},function(check){
            expect(check).toBe(false);
        });
    }); 
    it('testing checkPermission function state name as reports.dataVineHealth', function () {
        objCacheDetails.functionDetails=negetiveCheckFunctionDetails;
        permissionService.checkPermission({name:'reports.dataVineHealth'},function(check){
            expect(check).toBe(false);
        });
    });  
    it('testing checkPermission function state name as reports.systemLogs', function () {
        objCacheDetails.functionDetails=negetiveCheckFunctionDetails;
        permissionService.checkPermission({name:'reports.systemLogs'},function(check){
            expect(check).toBe(false);
        });
    });   

    it('testing checkPermission function state name as reports.batteryLife', function () {
        objCacheDetails.functionDetails=negetiveCheckFunctionDetails;
        permissionService.checkPermission({name:'reports.batteryLife'},function(check){
            expect(check).toBe(false);
        });
    });  
    it('testing checkPermission function state name as reports.deviceFirmwareVersions', function () {
        objCacheDetails.functionDetails=negetiveCheckFunctionDetails;
        permissionService.checkPermission({name:'reports.deviceFirmwareVersions'},function(check){
            expect(check).toBe(false);
        });
    }); 
    it('testing checkPermission function state name as reports.systemUpdates', function () {
        objCacheDetails.functionDetails=negetiveCheckFunctionDetails;
        permissionService.checkPermission({name:'reports.systemUpdates'},function(check){
            expect(check).toBe(false);
        });
    });  
    it('testing checkPermission function state name as reports.deviceRegistrationStatus', function () {
        objCacheDetails.functionDetails=negetiveCheckFunctionDetails;
        permissionService.checkPermission({name:'reports.deviceRegistrationStatus'},function(check){
            expect(check).toBe(false);
        });
    }); 
    it('testing checkPermission function state name as reports.systemAuditLog', function () {
        objCacheDetails.functionDetails=negetiveCheckFunctionDetails;
        permissionService.checkPermission({name:'reports.systemAuditLog'},function(check){
            expect(check).toBe(false);
        });
    });  
    it('testing checkPermission function state name as system.grouping', function () {
        objCacheDetails.functionDetails=negetiveCheckFunctionDetails;
        permissionService.checkPermission({name:'system.grouping'},function(check){
            expect(check).toBe(false);
        });
    }); 
    it('testing checkPermission function state name as system.registration', function () {
        objCacheDetails.functionDetails=negetiveCheckFunctionDetails;
        permissionService.checkPermission({name:'system.registration'},function(check){
            expect(check).toBe(false);
        });
    });  
    it('testing checkPermission function state name as system.registration.circuitEntry', function () {
        objCacheDetails.functionDetails=negetiveCheckFunctionDetails;
        permissionService.checkPermission({name:'system.registration.circuitEntry'},function(check){
            expect(check).toBe(false);
        });
    }); 
    it('testing checkPermission function state name as system.registration.transformerEntry', function () {
        objCacheDetails.functionDetails=negetiveCheckFunctionDetails;
        permissionService.checkPermission({name:'system.registration.transformerEntry'},function(check){
            expect(check).toBe(false);
        });
    });  
    it('testing checkPermission function state name as system.registration.meterEntry', function () {
        objCacheDetails.functionDetails=negetiveCheckFunctionDetails;
        permissionService.checkPermission({name:'system.registration.meterEntry'},function(check){
            expect(check).toBe(false);
        });
    });            
});