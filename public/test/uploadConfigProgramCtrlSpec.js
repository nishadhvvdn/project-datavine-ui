'use strict';
describe('uploadConfigProgramCtrl testing', function () {

    var scope, uploadConfigProgramCtrl,formatXmlContent,httpBackend,HypersproutMgmtService, timeout,state, modalInstanceMock,commonService;


    beforeEach(angular.mock.module('dataVINEApp'));

    beforeEach(function () {
        inject(function ($injector, $controller, $rootScope,$sessionStorage,$httpBackend) {
            scope = $rootScope.$new(); //scope = $injector.get('$rootScope')
            modalInstanceMock = {
                dismiss: function (result) {

                }
            };
            state = $injector.get('$state');
            formatXmlContent = $injector.get('formatXmlContent');
            commonService = $injector.get('commonService');
            HypersproutMgmtService = $injector.get('hypersproutMgmtService');
            // set up fake methods
            spyOn(modalInstanceMock, "dismiss");
            $sessionStorage.put('loginName','a');
            $sessionStorage.put('password','a');  
            objCacheDetails.webserviceUrl = '/'; 
            objCacheDetails.endpoints = {
                'ConfUploadConfigProgram': {
                    'name': 'ConfUploadConfigProgram',
                    "method": "POST"
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
                .respond(function(method, url, data, headers){
                  var res={};
                    return [200,res,{}];
                    
            });
            spyOn(state, 'reload');           
            uploadConfigProgramCtrl = $controller('uploadConfigProgramCtrl', {
                '$scope': scope,
                '$modalInstance': modalInstanceMock,
                '$state': state,
                'hypersproutMgmtService': HypersproutMgmtService,
                'list':[{ "Name": "Demo" }],
                'commonService':commonService,
                'formatXmlContent':formatXmlContent,
                'configType':'Meter'
            });
        }); // end of inject
    }); // end of beforeEach  
    it('testing check function', function () {
        scope.uploadObj={"name":'demo'};
        scope.check();
        expect(scope.msg).toEqual('Name already exist!');
        //expect(scope.isCollapsed).toBeFalsy();
    });
    it('testing check function with input as number', function () {
        scope.uploadObj={"name":'2'};
        scope.check();
        expect(scope.uploadObj.name).toBe(undefined);
        //expect(scope.isCollapsed).toBeFalsy();
    });
    it('testing check function with input as special Charecter', function () {
        scope.uploadObj={"name":'@'};
        scope.specialChar=false;
        scope.check();
        expect(scope.specialChar).toBeTruthy();
        //expect(scope.isCollapsed).toBeFalsy();
    });
        it('positive testing on check function', function () {
        scope.uploadObj={"name":'demo1'};
        scope.check();
        expect(scope.uploadObj.name).toBe('demo1');
        //expect(scope.isCollapsed).toBeFalsy();
    });
    it('testing Save  function', function () {
    scope.fileContent={};
    scope.fileContent.name='HS_ConfigPrograms.xml';
    scope.fileContent.validData=false;
    scope.fileContent.content="<Config_info><Energy>Wh delivered</Energy><Demand>Max W delivered</Demand><DemandIntervalLength>15</DemandIntervalLength><NumberofSubIntervals>5</NumberofSubIntervals><ColdLoadPickupTimes>15</ColdLoadPickupTimes><PowerOutageRecognitionTime>45</PowerOutageRecognitionTime><TestModeDemandIntervalLength>Quantity1</TestModeDemandIntervalLength><NumberofTestModeSubintervals>Quantity2</NumberofTestModeSubintervals><TimetoremaininTestMode>20</TimetoremaininTestMode><Quantity1>Wh delivered</Quantity1><Quantity2>Wh delivered</Quantity2><Quantity3>Wh delivered</Quantity3><Quantity4>Wh delivered</Quantity4><IntervalLength>60</IntervalLength><OutageLength>15</OutageLength><PulseWeight2>20</PulseWeight2><PulseWeight3>30</PulseWeight3><PulseWeight4>4</PulseWeight4><PulseWeight1>20</PulseWeight1><AllEvents>true</AllEvents><BillingDateCleard>false</BillingDateCleard><BillingScheduleExpiration>false</BillingScheduleExpiration><DemandResetOccured>false</DemandResetOccured><HistoryLogCleared>true</HistoryLogCleared><ConfigurationErrorDetected>true</ConfigurationErrorDetected><LoadProfileError>false</LoadProfileError><LowBatteryDetected>true</LowBatteryDetected><PrimaryPowerDown>false</PrimaryPowerDown><CTMultiplier>20</CTMultiplier><VTMultiplier>30</VTMultiplier><RegisterMultiplier>30</RegisterMultiplier><EnableVoltageMonitor>false</EnableVoltageMonitor><PhaseSelection>Phase B</PhaseSelection><IntervalLengthVoltage>5 minutes</IntervalLengthVoltage><RMSVoltLoadThreshold>20</RMSVoltLoadThreshold><RMSVoltHighThreshold>30</RMSVoltHighThreshold><LowVoltageThreshold>40</LowVoltageThreshold><LowVoltageThresholdDeviation>30</LowVoltageThresholdDeviation><HighVoltageThresholdDeviation>40</HighVoltageThresholdDeviation><LinkFailure>true</LinkFailure><LinkMetric>true</LinkMetric><InterrogationSendSucceeded>false</InterrogationSendSucceeded><SendResponseFailed>true</SendResponseFailed><DeregistrationResult>true</DeregistrationResult><ReceivedMessageFrom>false</ReceivedMessageFrom><DataVineHyperSproutChange>true</DataVineHyperSproutChange><DataVineSyncFatherChange>true</DataVineSyncFatherChange><ZigbeeSETunnelingMessage>true</ZigbeeSETunnelingMessage><ZigbeeSimpleMeteringMessage>false</ZigbeeSimpleMeteringMessage><TableSendRequestFailed>true</TableSendRequestFailed></Config_info>";
        httpBackend.whenPOST('/ConfUploadConfigProgram')
            .respond(function(method, url, data, headers){
                var res1={Status:'success',type:true};
                return [200,res1,{}];
                    
        });  
        scope.Save();        
        httpBackend.flush();
        //expect(scope.HyperSproutList[0].label).toBe(2);
    });
    // it('positive testing for checkfileExtension function', function () {
    //     var obj={"name":'conf.xml'};
    //     scope.checkfileExtension(obj);
    //     expect(scope.errMessage).toEqual('');
    // });
    // it('negetive testing for checkfileExtension function', function () {
    //     var obj={"name":'conf.doc'};
    //     scope.checkfileExtension(obj);
    //     expect(scope.errMessage).toEqual('Select files only with .xml extension');
    // });         
    it('testing openNewConfiguration  function', function () {
        scope.cancel();
        expect(modalInstanceMock.dismiss).toHaveBeenCalled();
    });
    it('testing for wordCheck function', function () {
        scope.description= 'hchyjsgfhsdghsdgfhysgfhsgfhseg';
        scope.wordCheck ();
        expect(scope.wordMsg).toBe('A word should not contain more than 20 character');
    });         
});
