'use strict';

describe('loginCtrl testing', function () {

    var scope, loginCtrl, http, rootScope, state, uibModal, logoutservice, authService, timeout, networkService, initService, filter, idle, httpBackend;


    beforeEach(angular.mock.module('dataVINEApp'));

    beforeEach(function () {
        inject(function ($injector, $controller, $rootScope, $sessionStorage, $httpBackend) {
            objCacheDetails = { "userDetails": { "timeZone": "Asia/Kolkata" } };
            scope = $rootScope.$new();
            uibModal = $injector.get('$uibModal');
            timeout = $injector.get('$timeout');
            http = $injector.get('$http');
            initService = $injector.get('InitService');
            authService = $injector.get('AuthService');
            networkService = $injector.get('NetworkService');
            logoutservice = $injector.get('logoutservice');
            idle = $injector.get('Idle');
            filter = $injector.get('$filter');
            state = $injector.get('$state');
            $sessionStorage.put('loginName', 'a');
            $sessionStorage.put('password', 'a');
            objCacheDetails.webserviceUrl = '/';
            objCacheDetails.endpoints = {
                'login': {
                    'name': 'login',
                    "method": "post"
                }
            };
            objCacheDetails.setData = function () {

            }
            objCacheDetails.grid = {
                columnDefs: [],
                enableColumnMenus: false,
                exporterSuppressColumns: ['Action'],
                paginationPageSizes: [15, 30, 45, 60, 75, 90, 100],
                paginationPageSize: 15,
                data: [],
                enableColumnResizing: true,
                enableCellEdit: false,
                gridMenuShowHideColumns: false,
                enableGridMenu: true,
                enableSelectAll: true,
                exporterCsvFilename: 'myFile.csv',
                exporterPdfDefaultStyle: { fontSize: 9 },
                exporterPdfTableStyle: { margin: [30, 30, 30, 30] },
                exporterPdfTableHeaderStyle: { fontSize: 10, bold: true, italics: true, color: 'red' },
                exporterPdfHeader: { text: "Configurations", style: 'headerStyle' },
                exporterPdfFooter: function (currentPage, pageCount) {
                    return { text: currentPage.toString() + ' of ' + pageCount.toString(), style: 'footerStyle' };
                },
                exporterPdfCustomFormatter: function (docDefinition) {
                    docDefinition.styles.headerStyle = { fontSize: 22, bold: true };
                    docDefinition.styles.footerStyle = { fontSize: 10, bold: true };
                    return docDefinition;
                },
                exporterPdfOrientation: 'portrait',
                exporterPdfPageSize: 'LETTER',
                exporterPdfMaxGridWidth: 450,
                exporterCsvLinkElement: angular.element(document.querySelectorAll(".custom-csv-link-location")),
            };
            httpBackend = $httpBackend;
            $rootScope.dynamicPopover = {
                open: function open() {
                    $scope.dynamicPopover.isOpen = true;
                },
                close: function close() {
                    $scope.dynamicPopover.isOpen = false;
                }
            };
            rootScope = $rootScope
            httpBackend.whenGET('pages/login.html')
                .respond(function (method, url, data, headers) {
                    var res = {};
                    return [200, res, {}];

                });
            httpBackend.whenGET('/configuration.json')
                .respond(function (method, url, data, headers) {

                    var saveRes = {
                        "timeout": "3000000",
                        "endpoints": {
                            "login": {
                                "name": "login",
                                "method": "post",
                                "data": {
                                    "email": "?",
                                    "password": "?"
                                }
                            },
                            "HSGroupDelete": {
                                "name": "HSGroupDelete",
                                "method": "post",
                                "data": {
                                    "ID": "?",
                                    "Type": "?"
                                }
                            },
                            "MeterGroupDelete": {
                                "name": "MeterGroupDelete",
                                "method": "post",
                                "data": {
                                    "ID": "?",
                                    "Type": "?"
                                }
                            },
                            "ConfNewConfSave": {
                                "name": "ConfNewConfSave",
                                "method": "post",
                                "data": {
                                    "configName": "?",
                                    "ClassName": "?",
                                    "Description": "?",
                                    "configProgramName": "?",
                                    "Type": "?"
                                }
                            },
                            "HSMDownDownloadConfSave": {
                                "name": "HSMDownDownloadConfSave",
                                "method": "post",
                                "data": {
                                    "configName": "?",
                                    "SerialNumber": "?"
                                }
                            },
                            "HSMGrpMgmtAssignGrpMembershipCreateAppGrp": {
                                "name": "HSMGrpMgmtAssignGrpMembershipCreateAppGrp",
                                "method": "post",
                                "data": {
                                    "GroupName": "?",
                                    "Description": "?"
                                }
                            },
                            "MMGrpMgmtAssignGrpMembershipCreateAppGrp": {
                                "name": "MMGrpMgmtAssignGrpMembershipCreateAppGrp",
                                "method": "post",
                                "data": {
                                    "GroupName": "?",
                                    "Description": "?"
                                }
                            },
                            "HSMSecurityAssignDeviceSecCodeSave": {
                                "name": "HSMSecurityAssignDeviceSecCodeSave",
                                "method": "post",
                                "data": {
                                    "updateHSMAssignDeviceSecCodeValues": {
                                        "DeviceClassID": "?",
                                        "SecurityCodeLevels": "?",
                                        "Primary": "?",
                                        "Secondary": "?",
                                        "Tertiary": "?",
                                        "Quarternary": "?"
                                    }
                                }
                            },
                            "MMSecurityAssignDeviceSecCodeSave": {
                                "name": "MMSecurityAssignDeviceSecCodeSave",
                                "method": "post",
                                "data": {
                                    "updateMMAssignDeviceSecCodeValues": {
                                        "DeviceClassID": "?",
                                        "SecurityCodeLevels": "?",
                                        "Primary": "?",
                                        "Secondary": "?",
                                        "Tertiary": "?",
                                        "Quarternary": "?"
                                    }
                                }
                            },
                            "HSMSecuritySave": {
                                "name": "HSMSecuritySave",
                                "method": "post",
                                "data": {
                                    "updateHSMSecuritySaveValues": {
                                        "DeviceClassID": "?",
                                        "EncryptionType1": "?",
                                        "EncryptionKeyID1": "?",
                                        "EncryptionKey1": "?",
                                        "EncryptionType2": "?",
                                        "EncryptionKeyID2": "?",
                                        "EncryptionKey2": "?",
                                        "EncryptionType3": "?",
                                        "EncryptionKeyID3": "?",
                                        "EncryptionKey3": "?"
                                    }
                                }
                            },
                            "MMSecuritySave": {
                                "name": "MMSecuritySave",
                                "method": "post",
                                "data": {
                                    "updateMMSecuritySaveValues": {
                                        "DeviceClassID": "?",
                                        "EncryptionType1": "?",
                                        "EncryptionKeyID1": "?",
                                        "EncryptionKey1": "?",
                                        "EncryptionType2": "?",
                                        "EncryptionKeyID2": "?",
                                        "EncryptionKey2": "?",
                                        "EncryptionType3": "?",
                                        "EncryptionKeyID3": "?",
                                        "EncryptionKey3": "?"
                                    }
                                }
                            },
                            "MMConfNewConfSave": {
                                "name": "MMConfNewConfSave",
                                "method": "post",
                                "data": {
                                    "configName": "?",
                                    "ClassName": "?",
                                    "Description": "?",
                                    "configProgramName": "?",
                                    "Type": "?"
                                }
                            },
                            "MMDownDownloadConfSave": {
                                "name": "MMDownDownloadConfSave",
                                "method": "post",
                                "data": {
                                    "configName": "?",
                                    "SerialNumber": "?"
                                }
                            },
                            "HSMConfEdit": {
                                "name": "HSMConfEdit",
                                "method": "post",
                                "data": {
                                    "ConfigID": "?"
                                }
                            },
                            "HSMConfEditSave": {
                                "name": "HSMConfEditSave",
                                "method": "post",
                                "data": {
                                    "updatevalues": "?"
                                }
                            },
                            "MMConfEdit": {
                                "name": "MMConfEdit",
                                "method": "post",
                                "data": {
                                    "ConfigID": "?"
                                }
                            },
                            "MMConfEditSave": {
                                "name": "MMConfEditSave",
                                "method": "post",
                                "data": {
                                    "updatevalues": "?"
                                }
                            },
                            "HSMTagDiscrepancies": {
                                "name": "HSMTagDiscrepancies",
                                "method": "get"
                            },
                            "MMTagDiscrepancies": {
                                "name": "MMTagDiscrepancies",
                                "method": "get"
                            },
                            "HSMJobStatus": {
                                "name": "HSMJobStatus",
                                "method": "get"
                            },
                            "MMJobStatus": {
                                "name": "MMJobStatus",
                                "method": "get"
                            },
                            "HSMConf": {
                                "name": "HSMConf",
                                "method": "get"
                            },
                            "MMConf": {
                                "name": "MMConf",
                                "method": "get"
                            },
                            "HSMGrpMgmt": {
                                "name": "HSMGrpMgmt",
                                "method": "get"
                            },
                            "MMGrpMgmt": {
                                "name": "MMGrpMgmt",
                                "method": "get"
                            },
                            "HSMSecurityCodeMgmt": {
                                "name": "HSMSecurityCodeMgmt",
                                "method": "get"
                            },
                            "MMSecurityCodeMgmt": {
                                "name": "MMSecurityCodeMgmt",
                                "method": "get"
                            },
                            "SMNetworkJobStatus": {
                                "name": "SMNetworkJobStatus",
                                "method": "get"
                            },
                            "SMHyperSprout": {
                                "name": "SMHyperSprout",
                                "method": "post",
                                "data": {
                                    "PartSerialNo": "?"
                                }
                            },
                            "SMMeters": {
                                "name": "SMMeters",
                                "method": "post",
                                "data": {
                                    "PartSerialNo": "?"
                                }
                            },
                            "DataVINEHealthReport": {
                                "name": "DataVINEHealthReport",
                                "method": "post",
                                "data": {
                                    "Type": "?"
                                }
                            },
                            "HSMConfImportConfSave": {
                                "name": "HSMConfImportConfSave",
                                "method": "post",
                                "data": {
                                    "configName": "?",
                                    "listHS": "?",
                                    "Action": "?",
                                    "Type": "?"
                                }
                            },
                            "MMConfImportConfSave": {
                                "name": "MMConfImportConfSave",
                                "method": "post",
                                "data": {
                                    "configName": "?",
                                    "listMeters": "?",
                                    "Action": "?"
                                }
                            },
                            "HSMGrpMgmtAssignGrpMembershipAssignEndpoint": {
                                "name": "HSMGrpMgmtAssignGrpMembershipAssignEndpoint",
                                "method": "post",
                                "data": {
                                    "GroupName": "?",
                                    "Action": "?",
                                    "listHS": "?",
                                    "Type": "?"
                                }
                            },
                            "MMGrpMgmtAssignGrpMembershipAssignEndpoint": {
                                "name": "MMGrpMgmtAssignGrpMembershipAssignEndpoint",
                                "method": "post",
                                "data": {
                                    "GroupName": "?",
                                    "Action": "?",
                                    "listMeters": "?",
                                    "Type": "?"
                                }
                            },
                            "SMEndpointCleanup": {
                                "name": "SMEndpointCleanup",
                                "method": "get"
                            },
                            "SMNodePing": {
                                "name": "SMNodePing",
                                "method": "post",
                                "data": {
                                    "SerialNumber": "?",
                                    "Type": "?"
                                }
                            },
                            "RestoreDefaultSettings": {
                                "name": "RestoreDefaultSettings",
                                "method": "post",
                                "data": {
                                    "tabHeading": "?"
                                }
                            },
                            "GetSecurityGroups": {
                                "name": "GetSecurityGroups",
                                "method": "get"
                            },
                            "ReturnSecurityGroups": {
                                "name": "ReturnSecurityGroups",
                                "method": "post",
                                "data": {
                                    "SecurityID": "?"
                                }
                            },
                            "DeleteSecurityGroups": {
                                "name": "DeleteSecurityGroups",
                                "method": "post",
                                "data": {
                                    "SecurityID": "?"
                                }
                            },
                            "AddSecurityGroups": {
                                "name": "AddSecurityGroups",
                                "method": "post",
                                "data": {
                                    "SecurityID": "?",
                                    "Description": "?",
                                    "Functions": "?"
                                }
                            },
                            "UpdatedSystemSettings": {
                                "name": "UpdatedSystemSettings",
                                "method": "get"
                            },
                            "UpdatedPasswordSettings": {
                                "name": "UpdatedPasswordSettings",
                                "method": "get"
                            },
                            "RestoreDefaultPasswordSettings": {
                                "name": "RestoreDefaultPasswordSettings",
                                "method": "get"
                            },
                            "SavePasswordSettings": {
                                "name": "SavePasswordSettings",
                                "method": "post",
                                "data": {
                                    "PasswordSettings": "?"
                                }
                            },
                            "GetUsers": {
                                "name": "GetUsers",
                                "method": "get"
                            },
                            "AddUser": {
                                "name": "AddUser",
                                "method": "post",
                                "data": {
                                    "UserID": "?",
                                    "FirstName": "?",
                                    "LastName": "?",
                                    "EmailAddress": "?",
                                    "SecurityGroup": "?",
                                    "HomePage": "?",
                                    "TimeZone": "?",
                                    "AccountLocked": "?",
                                    "MobileNumber": "?"
                                }
                            },
                            "SaveSystemSettings": {
                                "name": "SaveSystemSettings",
                                "method": "post",
                                "data": {
                                    "tabHeading": "?",
                                    "saveSettings": "?"
                                }
                            },
                            "UpdateUserSettings": {
                                "name": "UpdateUserSettings",
                                "method": "post",
                                "data": {
                                    "UserID": "?",
                                    "FirstName": "?",
                                    "LastName": "?",
                                    "EmailAddress": "?",
                                    "HomePage": "?",
                                    "TimeZone": "?",
                                    "Password": "?",
                                    "LoginID": "?"
                                }
                            },
                            "UserSettings": {
                                "name": "UserSettings",
                                "method": "post",
                                "data": {
                                    "UserID": "?"
                                }
                            },
                            "configPrograms": {
                                "name": "configPrograms",
                                "method": "post",
                                "data": {
                                    "Type": "?"
                                }
                            },
                            "ConfigProgramsDelete": {
                                "name": "ConfigProgramsDelete",
                                "method": "post",
                                "data": {
                                    "configProgramName": "?",
                                    "Type": "?"
                                }
                            },
                            "EditUser": {
                                "name": "EditUser",
                                "method": "post",
                                "data": {
                                    "UserID": "?",
                                    "FirstName": "?",
                                    "LastName": "?",
                                    "EmailAddress": "?",
                                    "SecurityGroup": "?",
                                    "HomePage": "?",
                                    "TimeZone": "?",
                                    "AccountLocked": "?",
                                    "LoginID": "?",
                                    "MobileNumber": "?"
                                }
                            },
                            "ListSecurityID": {
                                "name": "ListSecurityID",
                                "method": "get"
                            },
                            "ConfigProgramsEdit": {
                                "name": "ConfigProgramsEdit",
                                "method": "post",
                                "data": {
                                    "configProgramName": "?",
                                    "Type": "?"
                                }
                            },
                            "ConfUploadConfigProgram": {
                                "name": "ConfUploadConfigProgram",
                                "method": "post",
                                "data": {
                                    "configProgramName": "?",
                                    "configProgramDetails": "?",
                                    "Description": "?",
                                    "Type": "?"
                                }
                            },
                            "ChangePassword": {
                                "name": "ChangePassword",
                                "method": "post",
                                "data": {
                                    "UserID": "?",
                                    "OldPassword": "?",
                                    "NewPassword": "?",
                                    "LoginID": "?"
                                }
                            },
                            "ListDevicesAttached": {
                                "name": "ListDevicesAttached",
                                "method": "post",
                                "data": {
                                    "GroupID": "?",
                                    "Type": "?",
                                    "GroupType": "?"
                                }
                            },
                            "EditSecurityGroups": {
                                "name": "EditSecurityGroups",
                                "method": "post",
                                "data": {
                                    "SecurityID": "?",
                                    "Description": "?",
                                    "Functions": "?"
                                }
                            },
                            "HsmGroupDownload": {
                                "name": "HsmGroupDownload",
                                "method": "post",
                                "data": {
                                    "configName": "?"
                                }
                            },
                            "ResetPassword": {
                                "name": "ResetPassword",
                                "method": "post",
                                "data": {
                                    "UserID": "?"
                                }
                            },
                            "DeleteUser": {
                                "name": "DeleteUser",
                                "method": "post",
                                "data": {
                                    "UserID": "?"
                                }
                            },
                            "communicationStatistics": {
                                "name": "communicationStatistics",
                                "method": "get"
                            },
                            "datavineHealth": {
                                "name": "datavineHealth",
                                "method": "get"
                            },
                            "systemLog": {
                                "name": "systemLog",
                                "method": "get"
                            },
                            "batteryLife": {
                                "name": "batteryLife",
                                "method": "get"
                            },
                            "deviceFirmwareVersions": {
                                "name": "deviceFirmwareVersions",
                                "method": "get"
                            },
                            "systemUpdates": {
                                "name": "deviceFirmwareVersions",
                                "method": "get"
                            },
                            "deviceRegistrationStatus": {
                                "name": "deviceRegistrationStatus",
                                "method": "get"
                            },
                            "auditLog": {
                                "name": "auditLog",
                                "method": "get"
                            },
                            "EditCircuitDetails": {
                                "name": "EditCircuitDetails",
                                "method": "post",
                                "data": {
                                    "updateCircuitValues": {
                                        "CircuitNumber": "?",
                                        "CircuitID": "?",
                                        "KVARating": "?",
                                        "SubstationID": "?",
                                        "SubstationName": "?",
                                        "Address": "?",
                                        "Country": "?",
                                        "State": "?",
                                        "City": "?",
                                        "ZipCode": "?",
                                        "Latitude": "?",
                                        "Longitude": "?",
                                        "CircuitNote": "?"
                                    }
                                }
                            },
                            "NewMeterEntry": {
                                "name": "NewMeterEntry",
                                "method": "post",
                                "data": {
                                    "insertNewMeterDetails": {
                                        "MeterSerialNumber": "?",
                                        "MeterApptype": "?",
                                        "MeterVersion": "?",
                                        "MeterInstallationLocation": "?",
                                        "MeterCTRatio": "?",
                                        "MeterPTRatio": "?",
                                        "MeterNumberOfPhases": "?",
                                        "MeterRatedFrequency": "?",
                                        "MeterRatedVoltage": "?",
                                        "MeterNominalCurrent": "?",
                                        "MeterMaximumCurrent": "?",
                                        "MeterAccuracy": "?",
                                        "MeterCompliantToStandards": "?",
                                        "MeterWiFiIpAddress": "?",
                                        "MeterWiFiAccessPointPassword": "?",
                                        "MeterAdminPassword": "?",
                                        "MeterLatitude": "?",
                                        "MeterLongitude": "?",
                                        "MeterConsumerNumber": "?",
                                        "MeterConsumerName": "?",
                                        "MeterConsumerAddress": "?",
                                        "MeterConsumerContactNumber": "?",
                                        "MeterBillingCycleDate": "?",
                                        "MeterBillingTime": "?",
                                        "MeterDemandResetDate": "?",
                                        "MeterMake": "?",
                                        "MeterDisconnector": "?",
                                        "MeterConsumerCountry": "?",
                                        "MeterConsumerState": "?",
                                        "MeterConsumerCity": "?",
                                        "MeterConsumerZipCode": "?",
                                        "MeterWiFiMacID": "?",
                                        "ImpulseCountKWh": "?",
                                        "ImpulseCountKVARh": "?",
                                        "SealID": "?",
                                        "BiDirectional": "?",
                                        "EVMeter": "?"
                                    }
                                }
                            },
                            "DeleteMeterDetails": {
                                "name": "DeleteMeterDetails",
                                "method": "post",
                                "data": {
                                    "deleteMeterValues": {
                                        "MeterID": "?"
                                    }
                                }
                            },
                            "EditMeterDetails": {
                                "name": "EditMeterDetails",
                                "method": "post",
                                "data": {
                                    "updateMeterValues": {
                                        "MeterID": "?",
                                        "MeterSerialNumber": "?",
                                        "MeterApptype": "?",
                                        "MeterVersion": "?",
                                        "MeterInstallationLocation": "?",
                                        "MeterCTRatio": "?",
                                        "MeterPTRatio": "?",
                                        "MeterNumberOfPhases": "?",
                                        "MeterRatedFrequency": "?",
                                        "MeterRatedVoltage": "?",
                                        "MeterNominalCurrent": "?",
                                        "MeterMaximumCurrent": "?",
                                        "MeterAccuracy": "?",
                                        "MeterCompliantToStandards": "?",
                                        "MeterWiFiIpAddress": "?",
                                        "MeterWiFiAccessPointPassword": "?",
                                        "MeterMeterAdminPassword": "?",
                                        "MeterLatitude": "?",
                                        "MeterLongitude": "?",
                                        "MeterConsumerNumber": "?",
                                        "MeterConsumerName": "?",
                                        "MeterConsumerAddress": "?",
                                        "MeterConsumerContactNumber": "?",
                                        "MeterBillingCycleDate": "?",
                                        "MeterBillingTime": "?",
                                        "MeterDemandResetDate": "?",
                                        "MeterMake": "?",
                                        "MeterDisconnector": "?",
                                        "MeterConsumerCountry": "?",
                                        "MeterConsumerState": "?",
                                        "MeterConsumerCity": "?",
                                        "MeterConsumerZipCode": "?",
                                        "MeterWiFiMacID": "?",
                                        "ImpulseCountKWh": "?",
                                        "ImpulseCountKVARh": "?",
                                        "SealID": "?",
                                        "BiDirectional": "?",
                                        "EVMeter": "?"
                                    }
                                }
                            },
                            "DisplayAllCircuitDetails": {
                                "name": "DisplayAllCircuitDetails",
                                "method": "get",
                                "data": {}
                            },
                            "RemovingTransformerFromCircuit": {
                                "name": "RemovingTransformerFromCircuit",
                                "method": "post",
                                "data": {
                                    "removeTransformerFromCircuitValues": {
                                        "CircuitID": "?",
                                        "TransformerID": "?"
                                    }
                                }
                            },
                            "NetworkStatisticsHS": {
                                "name": "NetworkStatisticsHS",
                                "method": "get",
                                "data": {}
                            },
                            "DisplayAllTransformerDetails": {
                                "name": "DisplayAllTransformerDetails",
                                "method": "get",
                                "data": {}
                            },
                            "NewCircuitEntry": {
                                "name": "NewCircuitEntry",
                                "method": "post",
                                "data": {
                                    "insertNewCircuitDetails": {
                                        "CircuitID": "?",
                                        "KVARating": "?",
                                        "SubstationID": "?",
                                        "SubstationName": "?",
                                        "Address": "?",
                                        "Country": "?",
                                        "State": "?",
                                        "City": "?",
                                        "ZipCode": "?",
                                        "Latitude": "?",
                                        "Longitude": "?",
                                        "CircuitNote": "?"
                                    }
                                }
                            },
                            "DeleteCircuitDetails": {
                                "name": "DeleteCircuitDetails",
                                "method": "post",
                                "data": {
                                    "deleteCircuitValues": {
                                        "CircuitID": "?"
                                    }
                                }
                            },
                            "DeleteTransformerHypersproutDetails": {
                                "name": "DeleteTransformerHypersproutDetails",
                                "method": "post",
                                "data": {
                                    "deleteTransformerHypersproutValues": {
                                        "TransformerID": "?",
                                        "HypersproutID": "?"
                                    }
                                }
                            },
                            "EditTransformerHypersproutDetails": {
                                "name": "EditTransformerHypersproutDetails",
                                "method": "post",
                                "data": {
                                    "updateTransformerHypersproutValues": {
                                        "TransformerID": "?",
                                        "HypersproutID": "?",
                                        "TFMRSerialNumber": "?",
                                        "TFMRMake": "?",
                                        "TFMRRatingCapacity": "?",
                                        "TFMRHighLineVoltage": "?",
                                        "TFMRLowLineVoltage": "?",
                                        "TFMRHighLineCurrent": "?",
                                        "TFMRLowLineCurrent": "?",
                                        "TFMRType": "?",
                                        "HypersproutSerialNumber": "?",
                                        "HypersproutVersion": "?",
                                        "HypersproutMake": "?",
                                        "HSCTRatio": "?",
                                        "HSPTRatio": "?",
                                        "HSRatedVoltage": "?",
                                        "HSNumberOfPhases": "?",
                                        "HSRatedFrequency": "?",
                                        "HSAccuracy": "?",
                                        "HSDemandResetDate": "?",
                                        "HSCompliantToStandards": "?",
                                        "HSMaxDemandWindow": "?",
                                        "HSMaxDemandSlidingWindowInterval": "?",
                                        "HSSensorDetails": "?",
                                        "HSGPRSMacID": "?",
                                        "HSWiFiMacID": "?",
                                        "HSWiFiIpAddress": "?",
                                        "HSWiFiAccessPointPassword": "?",
                                        "HSSimCardNumber": "?",
                                        "HSLatitude": "?",
                                        "HSLongitude": "?",
                                        "ConnectedStreetlights": "?",
                                        "StreetlightsMetered": "?",
                                        "MaxOilTemp": "?",
                                        "MinOilTemp": "?",
                                        "StreetlightUsage": "?",
                                        "NoOfConnectedStreetlights": "?",
                                        "WireSize": "?"
                                    }
                                }
                            },
                            "NewTransformerHypersproutEntry": {
                                "name": "NewTransformerHypersproutEntry",
                                "method": "post",
                                "data": {
                                    "insertNewTransformerHypersproutDetails": {
                                        "TFMRSerialNumber": "?",
                                        "TFMRMake": "?",
                                        "TFMRRatingCapacity": "?",
                                        "TFMRHighLineVoltage": "?",
                                        "TFMRLowLineVoltage": "?",
                                        "TFMRHighLineCurrent": "?",
                                        "TFMRLowLineCurrent": "?",
                                        "TFMRType": "?",
                                        "HypersproutSerialNumber": "?",
                                        "HypersproutVersion": "?",
                                        "HypersproutMake": "?",
                                        "HSCTRatio": "?",
                                        "HSPTRatio": "?",
                                        "HSRatedVoltage": "?",
                                        "HSNumberOfPhases": "?",
                                        "HSRatedFrequency": "?",
                                        "HSAccuracy": "?",
                                        "HSDemandResetDate": "?",
                                        "HSCompliantToStandards": "?",
                                        "HSMaxDemandWindow": "?",
                                        "HSMaxDemandSlidingWindowInterval": "?",
                                        "HSSensorDetails": "?",
                                        "HSGPRSMacID": "?",
                                        "HSWiFiMacID": "?",
                                        "HSWiFiIpAddress": "?",
                                        "HSWiFiAccessPointPassword": "?",
                                        "HSSimCardNumber": "?",
                                        "HSLatitude": "?",
                                        "HSLongitude": "?",
                                        "ConnectedStreetlights": "?",
                                        "StreetlightsMetered": "?",
                                        "MaxOilTemp": "?",
                                        "MinOilTemp": "?",
                                        "StreetlightUsage": "?",
                                        "NoOfConnectedStreetlights": "?",
                                        "WireSize": "?"
                                    }
                                }
                            },
                            "AddingTransformerToCircuit": {
                                "name": "AddingTransformerToCircuit",
                                "method": "post",
                                "data": {
                                    "addTransformerToCircuitValues": {
                                        "CircuitID": "?",
                                        "TransformerID": "?"
                                    }
                                }
                            },
                            "AddingMeterToTransformer": {
                                "name": "AddingMeterToTransformer",
                                "method": "post",
                                "data": {
                                    "addMeterToTransformerValues": {
                                        "TransformerID": "?",
                                        "MeterID": "?"
                                    }
                                }
                            },
                            "RemovingMeterFromTransformer": {
                                "name": "RemovingMeterFromTransformer",
                                "method": "post",
                                "data": {
                                    "removeMeterFromTransformerValues": {
                                        "TransformerID": "?",
                                        "MeterID": "?"
                                    }
                                }
                            },
                            "FirmwareMgmtJobStatus": {
                                "name": "FirmwareMgmtJobStatus",
                                "method": "post",
                                "data": {
                                    "DeviceType": "?"
                                }
                            },
                            "FirmwareMgmtFirmGroup": {
                                "name": "FirmwareMgmtFirmGroup",
                                "method": "post",
                                "data": {
                                    "DeviceType": "?"
                                }
                            },
                            "FirmwareMgmtFirmGroupSubmit": {
                                "name": "FirmwareMgmtFirmGroupSubmit",
                                "method": "post",
                                "data": {
                                    "DeviceType": "?",
                                    "Firmware": "?",
                                    "Group": "?"
                                }
                            },
                            "DeviceFirmwareVersionReport": {
                                "name": "DeviceFirmwareVersionReport",
                                "method": "get"
                            },
                            "CommunicationsStatisticsReport": {
                                "name": "CommunicationsStatisticsReport",
                                "method": "get"
                            },
                            "MeterBillingUploadDisplay": {
                                "name": "MeterBillingUploadDisplay",
                                "method": "get",
                                "data": {
                                }
                            },
                            "SystemLogReport": {
                                "name": "SystemLogReport",
                                "method": "post",
                                "data": {
                                    "StartTime": "?",
                                    "EndTime": "?"
                                }
                            },
                            "SystemAuditLogReport": {
                                "name": "SystemAuditLogReport",
                                "method": "post",
                                "data": {
                                    "StartTime": "?",
                                    "EndTime": "?"
                                }
                            },
                            "MMGroupDownload": {
                                "name": "MMGroupDownload",
                                "method": "post",
                                "data": {
                                    "configName": "?"
                                }
                            }
                        }
                    };
                    return [200, saveRes, {}];
                });
            httpBackend.whenGET('/getEnv')
                .respond(function (method, url, data, headers) {
                    return [200, { "webservicehost": "collectionengineservicedev.azurewebsites.net", "webserviceport": "80", "protocol": "http" }, {}];
                });
            loginCtrl = $controller('loginCtrl', {
                '$rootScope': $rootScope,
                '$scope': scope,
                '$http': http,
                '$state': state,
                '$sessionStorage': $sessionStorage,
                'initService': initService,
                'authService': authService,
                'networkService': networkService,
                'logoutservice': logoutservice,
                '$uibModal': uibModal,
                'Idle': idle
            });
        });
    });
    it('test for get flush function', function () {
        httpBackend.flush();
    });

    it('test for get loginForm function', function () {
        httpBackend.whenGET('pages/homescreen.html')
            .respond(function (method, url, data, headers) {
                var res = {};
                return [200, res, {}];

            });
        scope.email = 'b@gmail.com';
        httpBackend.whenPOST('/login')
            .respond(function (method, url, data, headers) {
                var res = {
                    "type": true,
                    "User Details": {
                        "_id": "586a550b7e5e887d9176fbc1",
                        "UserID": "admin",
                        "FirstName": "admin",
                        "LastName": "VINE",
                        "EmailAddress": "chandrashekar.s@lnttechservices.com",
                        "SecurityGroup": "Administrator",
                        "HomePage": "Home Screen",
                        "TimeZone": "Asia/Kolkata",
                        "AccountLocked": false,
                        "AttemptsToLogin": 0,
                        "LoginID": "admin"
                    }, "System Settings": [{
                        "Type": {
                            "Values": {
                                "DefaultTimeZone": "(GMT-05:00)Eastern Time(US & Canada)",
                                "DisplayRestrictedMenuItems": false,
                                "NumberofRowstoDisplayPerPage": 100
                            }
                        }
                    }, {
                        "Type": {
                            "Values": {
                                "DefaultTimeZone": "(GMT-05:00)Eastern Time(US & Canada)",
                                "DisplayRestrictedMenuItems": false,
                                "NumberofRowstoDisplayPerPage": 100
                            }
                        }
                    }, {
                        "Type": {
                            "Values": {
                                "DefaultTimeZone": "(GMT-05:00)Eastern Time(US & Canada)",
                                "DisplayRestrictedMenuItems": false,
                                "newAccountReportTimePeriod": 100
                            }
                        }
                    }],
                    "Security Group Details": {
                        "_id": "586a817e999a37cb0f2653e5",
                        "SecurityID": "Administrator",
                        "Description": "Administrator",
                        "Functions": [
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
                        ]
                    }
                }
                    ;
                return [200, res, {}];

            });
        scope.loginForm();
        httpBackend.flush();
        expect(rootScope.userName).toEqual('admin VINE')
    });
    it('test for get loginForm function', function () {
        httpBackend.whenGET('pages/reports_mainview.html')
            .respond(function (method, url, data, headers) {
                var res = {};
                return [200, res, {}];

            });
        httpBackend.whenGET('pages/communicationStatistics.html')
            .respond(function (method, url, data, headers) {
                var res = {};
                return [200, res, {}];

            });
        scope.email = 'b@gmail.com';
        httpBackend.whenPOST('/login')
            .respond(function (method, url, data, headers) {
                var res = {
                    "type": true,
                    "System Settings": [{
                        "Type": {
                            "Values": {
                                "DefaultTimeZone": "(GMT-05:00)Eastern Time(US & Canada)",
                                "DisplayRestrictedMenuItems": false,
                                "NumberofRowstoDisplayPerPage": 100
                            }
                        }
                    }, {
                        "Type": {
                            "Values": {
                                "DefaultTimeZone": "(GMT-05:00)Eastern Time(US & Canada)",
                                "DisplayRestrictedMenuItems": false,
                                "NumberofRowstoDisplayPerPage": 100
                            }
                        }
                    }, {
                        "Type": {
                            "Values": {
                                "DefaultTimeZone": "(GMT-05:00)Eastern Time(US & Canada)",
                                "DisplayRestrictedMenuItems": false,
                                "newAccountReportTimePeriod": 100
                            }
                        }
                    }],
                    "User Details": {
                        "_id": "586a550b7e5e887d9176fbc1",
                        "UserID": "admin",
                        "FirstName": "admin",
                        "LastName": "VINE",
                        "EmailAddress": "chandrashekar.s@lnttechservices.com",
                        "SecurityGroup": "Administrator",
                        "HomePage": "Reports",
                        "TimeZone": "Asia/Kolkata",
                        "AccountLocked": false,
                        "AttemptsToLogin": 0,
                        "LoginID": "admin",
                        'Super User': true
                    },
                    "Security Group Details": {
                        "_id": "586a817e999a37cb0f2653e5",
                        "SecurityID": "Administrator",
                        "Description": "Administrator",
                        "Functions": [
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
                        ]
                    }
                }
                    ;
                return [200, res, {}];

            });
        scope.loginForm();
        httpBackend.flush();
        expect(rootScope.userName).toEqual('admin VINE')
    });
    it('testing loginForm function for enableLoading variable ', function () {
        objCacheDetails = {};
        scope.loginForm();
        expect(scope.enableLoading).toBeTruthy();
    });
});