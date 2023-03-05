'use strict';
describe('EditHyperSproutOrMeterCtrl testing', function () {

    var scope, EditHyperSproutOrMeterCtrl, httpBackend,formatXmlContent,HypersproutMgmtService, timeout, state, modalInstanceMock, commonService;


    beforeEach(angular.mock.module('dataVINEApp'));

    beforeEach(function () {
        inject(function ($injector, $controller, $rootScope, $httpBackend, $sessionStorage) {
            scope = $rootScope.$new();
            commonService = $injector.get('commonService');
            formatXmlContent = $injector.get('formatXmlContent');
            $sessionStorage.put('loginName', 'a');
            $sessionStorage.put('password', 'a');
            objCacheDetails.userDetails = {};
            objCacheDetails.data = {};
            objCacheDetails.webserviceUrl = '/';
            objCacheDetails.endpoints = {
                'ConfigProgramsEdit': {
                    'name': 'ConfigProgramsEdit',
                    "method": "POST"
                }
            };
            modalInstanceMock = {
                dismiss: function (result) {

                },
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
            httpBackend.whenGET('pages/login.html')
                .respond(function (method, url, data, headers) {
                    var res = {};
                    return [200, res, {}];

                });
            httpBackend.whenPOST('/ConfigProgramsEdit')
                .respond(function (method, url, data, headers) {
                    var res = {
                        'Docs': [
                            {
                                'ConfigGroups_Info': {
                                    "Energy1": 2,
                                    "Energy2": 2,
                                    "Energy3": 2,
                                    "Energy4": 2,
                                    "LoadControlDisconnectThreshold": 1,
                                    "ReconnectMethod": 3,
                                    "Demand": 2,
                                    "DemandIntervalLength": 3,
                                    "NumberofSubIntervals": 2,
                                    "ColdLoadPickupTimes": 3,
                                    "PowerOutageRecognitionTime": 4,
                                    "TestModeDemandIntervalLength": 2,
                                    "NumberofTestModeSubintervals": 3,
                                    "TimetoremaininTestMode": 20,
                                    "DailySelfReadTime": 1,
                                    "Quantity1": 2,
                                    "Quantity2": 2,
                                    "Quantity3": 2,
                                    "Quantity4": 2,
                                    "IntervalLength": 3,
                                    "OutageLength": 2,
                                    "PulseWeight1": 20,
                                    "PulseWeight2": 20,
                                    "PulseWeight3": 30,
                                    "PulseWeight4": 40,
                                    "AllEvents": 1,
                                    "BillingDateCleard": 1,
                                    "BillingScheduleExpiration": 1,
                                    "DemandResetOccured": 1,
                                    "HistoryLogCleared": 1,
                                    "ConfigurationErrorDetected": 1,
                                    "LoadProfileError": 1,
                                    "LowBatteryDetected": 1,
                                    "PrimaryPowerDown": 1,
                                    "OTMultiplier": 20,
                                    "VTMultiplier": 30,
                                    "RegisterMultiplier": 30,
                                    "EnableVoltageMonitor": 1,
                                    "PhaseSelection": 1,
                                    "VoltageMointorIntervalLength": 2,
                                    "RMSVoltLoadThreshold": 230,
                                    "RMSVoltHighThreshold": 230,
                                    "LowVoltageThreshold": 230,
                                    "LowVoltageThresholdDeviation": 230,
                                    "HighVoltageThresholdDeviation": 230,
                                    "LinkFailure": 1,
                                    "LinkMetric": 1,
                                    "InterrogationSendSucceeded": 1,
                                    "SendResponseFailed": 1,
                                    "DeregistrationResult": 1,
                                    "ReceivedMessageFrom": 1,
                                    "DataVineHyperSproutChange": 1,
                                    "DataVineSyncFatherChange": 1,
                                    "ZigbeeSETunnelingMessage": 1,
                                    "ZigbeeSimpleMeteringMessage": 1,
                                    "TableSendRequestFailed": 1,
                                    "LockoutLoginattemptsOptical": "1",
                                    "LockoutLogoutminutesOptical": "1",
                                    "LockoutLoginattemptsLAN": "1",
                                    "LockoutLogoutminutesLAN": "1",
                                    "ConsecutiveLAN": "1",
                                    "LanLinkMetric": "1"
                                }
                            }
                        ]
                    };
                    return [200, res, {}];
                });
            state = $injector.get('$state');
            timeout = $injector.get('$timeout');

            HypersproutMgmtService = $injector.get('hypersproutMgmtService');
            // set up fake methods
            spyOn(modalInstanceMock, "dismiss");
            spyOn(state, 'reload');
            EditHyperSproutOrMeterCtrl = $controller('EditHyperSproutOrMeterCtrl', {
                '$scope': scope,
                '$timeout': timeout,
                '$modalInstance': modalInstanceMock,
                '$state': state,
                'hypersproutMgmtService': HypersproutMgmtService,
                'record': { 'entity': { "Name": 'Test' } },
                'list': [{ "Name": "Demo" }],
                'commonService': commonService,
                'formatXmlContent':formatXmlContent,
                'type':'Meter'
            });
        });
    });

    it('testing check function', function () {
        scope.configObj = { "Name": 'demo' };
        scope.check();
        expect(scope.msg).toEqual('Name already exist!');
    });
    it('testing check function with input as number', function () {
        scope.configObj = { "Name": '2' };
        scope.check();
        expect(scope.configObj.Name).toBe(undefined);
    });
    it('testing check function with input as special Charecter', function () {
        scope.specialChar = false;
        scope.configObj = { "Name": '@' };
        scope.check();
        expect(scope.specialChar).toBeTruthy();
    });
    it('positive testing on check function', function () {
        scope.configObj = { "Name": 'demo1' };
        scope.check();
        expect(scope.configObj.Name).toBe('demo1');
    });
    it('testing init function', function () {
        expect(true).toBeTruthy();
        httpBackend.flush();

    });
    it('positive testing save function', function () {
        scope.configObj = { "ConfigGroups_Info": {} };
        scope.configObj.ConfigGroups_Info.Energy1 = { "id": 1 };
        scope.configObj.ConfigGroups_Info.Energy2 = { "id": 1 };
        scope.configObj.ConfigGroups_Info.Energy3 = { "id": 1 };
        scope.configObj.ConfigGroups_Info.Energy4 = { "id": 1 };
        scope.configObj.ConfigGroups_Info.DemandIntervalLength = { "id": 1 };
        scope.configObj.ConfigGroups_Info.ColdLoadPickupTimes = { "id": 1 };
        scope.configObj.ConfigGroups_Info.PowerOutageRecognitionTime = { "id": 1 };
        scope.configObj.ConfigGroups_Info.TestModeDemandIntervalLength = { "id": 1 };
        scope.configObj.ConfigGroups_Info.NumberofTestModeSubintervals = { "id": 1 };
        scope.configObj.ConfigGroups_Info.Demand = { "id": 1 };
        scope.configObj.ConfigGroups_Info.Quantity1 = { "id": 1 };
        scope.configObj.ConfigGroups_Info.Quantity2 = { "id": 1 };
        scope.configObj.ConfigGroups_Info.Quantity3 = { "id": 1 };
        scope.configObj.ConfigGroups_Info.Quantity4 = { "id": 1 };
        scope.configObj.ConfigGroups_Info.NumberofSubIntervals = { "id": 1 };
        scope.configObj.ConfigGroups_Info.IntervalLength = { "id": 1 };
        scope.configObj.ConfigGroups_Info.PhaseSelection = { "id": 1 };
        scope.configObj.ConfigGroups_Info.VoltageMointorIntervalLength = { "id": 1 };
        scope.configObj.ConfigGroups_Info.OutageLength = { "id": 1 };
        scope.configObj.ConfigGroups_Info.LoadControlDisconnectThreshold = { "id": 1 };
        scope.configObj.ConfigGroups_Info.ReconnectMethod = { "id": 1 };
        scope.configObj.ConfigGroups_Info.PulseWeight1 = 3;
        scope.configObj.ConfigGroups_Info.PulseWeight1 = 3;
        scope.configObj.ConfigGroups_Info.PulseWeight1 = 3;
        scope.configObj.ConfigGroups_Info.PulseWeight1 = 3;
        httpBackend.whenPOST('/ConfUploadConfigProgram')
            .respond(function (method, url, data, headers) {
                var saveRes = { Status: "a", type: true };
                return [200, saveRes, {}];
            });
        scope.Save();
        httpBackend.flush();

    });
    it('negetive testing save function', function () {
        scope.configObj = { "ConfigGroups_Info": {} };
        scope.configObj.ConfigGroups_Info.Energy1 = { "id": 1 };
        scope.configObj.ConfigGroups_Info.Energy2 = { "id": 1 };
        scope.configObj.ConfigGroups_Info.Energy3 = { "id": 1 };
        scope.configObj.ConfigGroups_Info.Energy4 = { "id": 1 };
        scope.configObj.ConfigGroups_Info.DemandIntervalLength = { "id": 1 };
        scope.configObj.ConfigGroups_Info.ColdLoadPickupTimes = { "id": 1 };
        scope.configObj.ConfigGroups_Info.PowerOutageRecognitionTime = { "id": 1 };
        scope.configObj.ConfigGroups_Info.TestModeDemandIntervalLength = { "id": 1 };
        scope.configObj.ConfigGroups_Info.NumberofTestModeSubintervals = { "id": 1 };
        scope.configObj.ConfigGroups_Info.Demand = { "id": 1 };
        scope.configObj.ConfigGroups_Info.Quantity1 = { "id": 1 };
        scope.configObj.ConfigGroups_Info.Quantity2 = { "id": 1 };
        scope.configObj.ConfigGroups_Info.Quantity3 = { "id": 1 };
        scope.configObj.ConfigGroups_Info.Quantity4 = { "id": 1 };
        scope.configObj.ConfigGroups_Info.NumberofSubIntervals = { "id": 1 };
        scope.configObj.ConfigGroups_Info.IntervalLength = { "id": 1 };
        scope.configObj.ConfigGroups_Info.PhaseSelection = { "id": 1 };
        scope.configObj.ConfigGroups_Info.VoltageMointorIntervalLength = { "id": 1 };
        scope.configObj.ConfigGroups_Info.OutageLength = { "id": 1 };
        scope.configObj.ConfigGroups_Info.LoadControlDisconnectThreshold = { "id": 1 };
        scope.configObj.ConfigGroups_Info.ReconnectMethod = { "id": 1 };
        scope.configObj.ConfigGroups_Info.PulseWeight1 = 3;
        scope.configObj.ConfigGroups_Info.PulseWeight1 = 3;
        scope.configObj.ConfigGroups_Info.PulseWeight1 = 3;
        scope.configObj.ConfigGroups_Info.PulseWeight1 = 3;
        httpBackend.whenPOST('/ConfUploadConfigProgram')
            .respond(function (method, url, data, headers) {
                return [200, '', {}];
            });
        scope.Save();
        httpBackend.flush();

    });
    it('testing for print function', function () {
        window.print();
        scope.configObj = { "ConfigGroups_Info": {} };
        scope.configObj.ConfigGroups_Info.Energy1 = { "id": 1 };
        scope.configObj.ConfigGroups_Info.Energy2 = { "id": 1 };
        scope.configObj.ConfigGroups_Info.Energy3 = { "id": 1 };
        scope.configObj.ConfigGroups_Info.Energy4 = { "id": 1 };
        scope.configObj.ConfigGroups_Info.DemandIntervalLength = { "id": 1 };
        scope.configObj.ConfigGroups_Info.ColdLoadPickupTimes = { "id": 1 };
        scope.configObj.ConfigGroups_Info.PowerOutageRecognitionTime = { "id": 1 };
        scope.configObj.ConfigGroups_Info.TestModeDemandIntervalLength = { "id": 1 };
        scope.configObj.ConfigGroups_Info.NumberofTestModeSubintervals = { "id": 1 };
        scope.configObj.ConfigGroups_Info.Demand = { "id": 1 };
        scope.configObj.ConfigGroups_Info.Quantity1 = { "id": 1 };
        scope.configObj.ConfigGroups_Info.Quantity2 = { "id": 1 };
        scope.configObj.ConfigGroups_Info.Quantity3 = { "id": 1 };
        scope.configObj.ConfigGroups_Info.Quantity4 = { "id": 1 };
        scope.configObj.ConfigGroups_Info.NumberofSubIntervals = { "id": 1 };
        scope.configObj.ConfigGroups_Info.IntervalLength = { "id": 1 };
        scope.configObj.ConfigGroups_Info.PhaseSelection = { "id": 1 };
        scope.configObj.ConfigGroups_Info.VoltageMointorIntervalLength = { "id": 1 };
        scope.configObj.ConfigGroups_Info.OutageLength = { "id": 1 };
        scope.configObj.ConfigGroups_Info.LoadControlDisconnectThreshold = { "id": 1 };
        scope.configObj.ConfigGroups_Info.ReconnectMethod = { "id": 1 };
        scope.configObj.ConfigGroups_Info.PulseWeight1 = 3;
        scope.configObj.ConfigGroups_Info.PulseWeight1 = 3;
        scope.configObj.ConfigGroups_Info.PulseWeight1 = 3;
        scope.configObj.ConfigGroups_Info.PulseWeight1 = 3;
        scope.printCart();
    });
    it('positive testing on customValidation function', function () {
        scope.configObj = { ConfigGroups_Info: { PulseWeight1: 10 } }
        scope.customValidation()
    });
    it('positive testing on customValidation function', function () {
        scope.configObj = { ConfigGroups_Info: { PulseWeight2: 10 } }
        scope.customValidation()
    });
    it('positive testing on customValidation function', function () {
        scope.configObj = { ConfigGroups_Info: { PulseWeight3: 10 } }
        scope.customValidation()
    });
    it('positive testing on customValidation function', function () {
        scope.configObj = { ConfigGroups_Info: { PulseWeight4: 10 } }
        scope.customValidation()
    });
    it('positive testing on excel function', function () {
        scope.configObj = { "ConfigGroups_Info": {} };
        scope.configObj.ConfigGroups_Info.Energy1 = { "id": 1 };
        scope.configObj.ConfigGroups_Info.Energy2 = { "id": 1 };
        scope.configObj.ConfigGroups_Info.Energy3 = { "id": 1 };
        scope.configObj.ConfigGroups_Info.Energy4 = { "id": 1 };
        scope.configObj.ConfigGroups_Info.DemandIntervalLength = { "id": 1 };
        scope.configObj.ConfigGroups_Info.ColdLoadPickupTimes = { "id": 1 };
        scope.configObj.ConfigGroups_Info.PowerOutageRecognitionTime = { "id": 1 };
        scope.configObj.ConfigGroups_Info.TestModeDemandIntervalLength = { "id": 1 };
        scope.configObj.ConfigGroups_Info.NumberofTestModeSubintervals = { "id": 1 };
        scope.configObj.ConfigGroups_Info.Demand = { "id": 1 };
        scope.configObj.ConfigGroups_Info.Quantity1 = { "id": 1 };
        scope.configObj.ConfigGroups_Info.Quantity2 = { "id": 1 };
        scope.configObj.ConfigGroups_Info.Quantity3 = { "id": 1 };
        scope.configObj.ConfigGroups_Info.Quantity4 = { "id": 1 };
        scope.configObj.ConfigGroups_Info.NumberofSubIntervals = { "id": 1 };
        scope.configObj.ConfigGroups_Info.IntervalLength = { "id": 1 };
        scope.configObj.ConfigGroups_Info.PhaseSelection = { "id": 1 };
        scope.configObj.ConfigGroups_Info.VoltageMointorIntervalLength = { "id": 1 };
        scope.configObj.ConfigGroups_Info.OutageLength = { "id": 1 };
        scope.configObj.ConfigGroups_Info.LoadControlDisconnectThreshold = { "id": 1 };
        scope.configObj.ConfigGroups_Info.ReconnectMethod = { "id": 1 };
        scope.configObj.ConfigGroups_Info.PulseWeight1 = 3;
        scope.configObj.ConfigGroups_Info.PulseWeight1 = 3;
        scope.configObj.ConfigGroups_Info.PulseWeight1 = 3;
        scope.configObj.ConfigGroups_Info.PulseWeight1 = 3;
        scope.excel();
    });
});
