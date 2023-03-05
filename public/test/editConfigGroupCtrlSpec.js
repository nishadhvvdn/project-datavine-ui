'use strict';
describe('editConfigGroupCtrl testing', function() {

    var scope, httpBackend,type, editConfigGroupCtrl, HypersproutMgmtService, timeout, state, modalInstanceMock, commonService;
    var httpBackend;
    beforeEach(angular.mock.module('dataVINEApp'));

    beforeEach(function() {
        inject(function($injector, $controller, $rootScope, $httpBackend, $sessionStorage) {
            scope = $rootScope.$new(); //scope = $injector.get('$rootScope')
            $sessionStorage.put('loginName', 'a');
            $sessionStorage.put('password', 'a');
            objCacheDetails.userDetails = {};
            objCacheDetails.data = {};
            objCacheDetails.webserviceUrl = '/';
            objCacheDetails.endpoints = {
                'configPrograms': {
                    'name': 'configPrograms',
                    "method": "POST"
                },
                'HSMConfEdit': {
                    'name': 'HSMConfEdit',
                    "method": "POST"
                },
                'HSMConfEditSave': {
                    'name': 'HSMConfEditSave',
                    "method": "POST"
                },
                'ConfigProgramsEdit': {
                    'name': 'ConfigProgramsEdit',
                    "method": "POST"
                }
            };
            //objCacheDetails.data = {a: 'a'}
            modalInstanceMock = {
                dismiss: function(result) {

                }
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
                .respond(function(method, url, data, headers) {
                    var res = {};
                    return [200, res, {}];

                });
            httpBackend.whenPOST('/configPrograms')
                .respond(function(method, url, data, headers) {
                    var res = { 'configProgramData': [{ 'Name': 'ss' }] };
                    return [200, res, {}];
                });
            httpBackend.whenPOST('/HSMConfEdit')
                .respond(function(method, url, data, headers) {
                    var res = { 'Docs': [{ 'ConfigProgramName': { 'Name': 'dd' } }] };
                    return [200, res, {}];
                });
            httpBackend.whenPOST('/ConfigProgramsEdit')
                .respond(function(method, url, data, headers) {
     var res = {
                        'Docs': [{
                            'ConfigGroups_Info': {
                                "Energy": 1,
                                "Demand": 3,
                                "DemandIntervalLength": 5,
                                "NumberofSubIntervals": 3,
                                "ColdLoadPickupTimes": 3,
                                "PowerOutageRecognitionTime": 2,
                                "TestModeDemandIntervalLength": 2,
                                "NumberofTestModeSubintervals": 3,
                                "TimetoremaininTestMode": 20,
                                "DailySelfReadTime": 1,
                                "Quantity1": 2,
                                "Quantity2": 2,
                                "Quantity3": 2,
                                "Quantity4": 2,
                                "IntervalLength": 2,
                                "OutageLength": 3,
                                "PulseWeight1": 201,
                                "PulseWeight2": 202,
                                "PulseWeight3": 203,
                                "PulseWeight4": 204,
                                "AllEvents": 1,
                                "BillingDateCleard": 1,
                                "BillingScheduleExpiration": 1,
                                "DemandResetOccured": 1,
                                "HistoryLogCleared": 1,
                                "ConfigurationErrorDetected": 1,
                                "LoadProfileError": 1,
                                "LowBatteryDetected": 1,
                                "PrimaryPowerDown": 1,
                                "CTMultiplier": 2,
                                "VTMultiplier": 2,
                                "RegisterMultiplier": 2,
                                "EnableVoltageMonitor": 1,
                                "PhaseSelection": 1,
                                "IntervalLengthVoltage": 4,
                                "RMSVoltLoadThreshold": 220,
                                "RMSVoltHighThreshold": 250,
                                "LowVoltageThreshold": 200,
                                "LowVoltageThresholdDeviation": 10,
                                "HighVoltageThresholdDeviation": 10,
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
                                "TableSendRequestFailed": 1
                            }
                        }]
                    };
                    return [200, res, {}];
                });
            state = $injector.get('$state');
            timeout = $injector.get('$timeout');
            HypersproutMgmtService = $injector.get('hypersproutMgmtService');
            commonService = $injector.get('commonService');
            // set up fake methods
            spyOn(modalInstanceMock, "dismiss");
            spyOn(state, 'reload');

            editConfigGroupCtrl = $controller('editConfigGroupCtrl', {
                '$scope': scope,
                '$timeout': timeout,
                '$modalInstance': modalInstanceMock,
                'hypersproutMgmtService': HypersproutMgmtService,
                'record': { 'entity': { "Name": 'Test' } },
                'list': [{ "Name": "Demo" }],
                '$state': state,
                'commonService': commonService,
                'type':'Meter'
            });

        });
    });
    it('testing init function', function() {
        expect(true).toBeTruthy();
        httpBackend.flush();
    });
    it('testing HSMConfEditSave function', function() {
        httpBackend.whenPOST('/HSMConfEditSave')
            .respond(function(method, url, data, headers) {
                var res = { type: true };
                return [200, res, {}];
            });
        scope.Save();
        httpBackend.flush();
    });
    it('testing negative HSMConfEditSave function', function() {
        httpBackend.whenPOST('/HSMConfEditSave')
            .respond(function(method, url, data, headers) {
                return [200, '', {}];
            });
        scope.Save();
        httpBackend.flush();
    });
    it('testing positive excel function', function() {
        scope.configObj = { 'ConfigGroups_Info': [{ 'PulseWeight4': 4 }] };
        scope.excel();
    });
});
