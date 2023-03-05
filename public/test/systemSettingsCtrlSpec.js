'use strict';
describe('systemSettingsCtrl testing', function () {

    //var $scope, $controller;
    var scope, systemSettingsCtrl, modalInstanceMock,httpBackend, state, administrationService;


    beforeEach(angular.mock.module('dataVINEApp'));

    beforeEach(function () {
        inject(function ($injector, $controller, $rootScope,$sessionStorage,$httpBackend) {

            scope = $rootScope.$new(); //scope = $injector.get('$rootScope')
            state = $injector.get('$state');
            modalInstanceMock = {
                dismiss: function (result) {

                }
            };
            $sessionStorage.put('loginName','a');
            $sessionStorage.put('password','a');
            objCacheDetails.webserviceUrl = '/'; 
            objCacheDetails.endpoints = {
                'UpdatedSystemSettings': {
                    'name': 'UpdatedSystemSettings',
                    "method": "get"
                },
                'RestoreDefaultSettings': {
                    'name': 'RestoreDefaultSettings',
                    "method": "POST"
                },
                'SaveSystemSettings': {
                    'name': 'SaveSystemSettings',
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
        httpBackend.whenGET('/UpdatedSystemSettings')
           .respond(function(method, url, data, headers){
              var res={"type":true,"output":[{"_id":"586a520f7e5e887d9176fba4","Settings":"Communications","Type":{"Status":"Updated","Values":{"AsynchronousJobResponseTimeut":3,"AsynchronousJobRetryNumber":1,"ConfigurationDescrepancyHandling":"Flag","EnableAutomaticApplicationGroupDownload":true,"FailedSendRetransmitDelay":600,"FirstMessageDelay":10,"IntermittentDelay":85,"IntermittentPeriod":30000,"InterrogationWindowEndPointBuffer":10,"InterrogationWindowEndPointRelay":75,"cellReMaximumCellRelayLoadlayLoad":99,"MaximumFailedEndpointMessagesReported":10000,"MaximumFirstMessageRetryDelay":10,"MaximumServerLoad":20000,"MaximumSimultaneousMessgaes":5,"MaximumTransmissionDelay":15,"MessageBusRetryNumber":10,"MessageBusRetryDelay":3,"SynchronousJobResponseTimeut":8}}},{"_id":"586a522d7e5e887d9176fba6","Settings":"Control","Type":{"Status":"Updated","Values":{"AutomatedProcessruntime":"01:00","DaysbetweenTOUpendingseasonretries":1,"Disconnectperioddurationinseconds":3600,"InteractiveReadtorelayperioddurationinseconds":3600,"Interrogationtorelayperioddurationinseconds":3600,"Nodepingperioddurationinseconds":3600,"ProcessTOUpendingseasonupdates":true,"Numberofdisconnectsallowedperperiod":10,"Numberofendpointsallowedinaninterrogationrequesttoasinglerelayperperiod":3600,"Numberofnodepingrequestsallowedperrelayperperiod":3600,"Numberofsimultaneousconfigurationdownloadjobsallowed":2,"NumberofInteractiveReadsallowedtoasinglerelayperperiod":3600}}},{"_id":"586a52417e5e887d9176fba8","Settings":"DataProcessing","Type":{"Status":"Updated","Values":{"DataSpoolerCacheLocation":"Cache","DataSpoolerDeliveryBatchSize":20,"DataSpoolerDiskCacheSize":1000,"DataSpoolerMemoryCacheSize":1001}}},{"_id":"586a52507e5e887d9176fbaa","Settings":"Firmware","Type":{"Status":"Updated","Values":{"CommonBlockCountResend":5,"FirmwareDownloadBlockSize":64,"IncludeBuildNumberInFirmwareVersion":true,"MissingBlockCountRecovery":500,"MulticastFirmwareJobAdditionalSends":0,"MulticastFirmwareJobDelay":181}}},{"_id":"586a52617e5e887d9176fbac","Settings":"Miscellaneous","Type":{"Status":"Updated","Values":{"DisplayRestrictedMenuItems":true,"NumberofRowstoDisplayPerPage":99}}},{"_id":"586a526c7e5e887d9176fbae","Settings":"Registration","Type":{"Status":"Updated","Values":{"AutonaticDeregistrationPeriod":0,"RegistrationDelay":60,"RegistrationPeriod":1}}},{"_id":"586a527b7e5e887d9176fbb0","Settings":"Reporting","Type":{"Status":"Updated","Values":{"ContactAttemptResultCount":10,"FailedReadDays":30,"LastReadCriticalThreshold":120,"LastReadWarningThreshold":72,"NumberofDecimalPlaces":3,"RFLANHealthCriticalThreshold":35,"RFLANHealthWarningThreshold":60,"TimeonBatteryThreshold":3651}}}]};
              return [200,res,{}];      
        });                        
            spyOn(modalInstanceMock, "dismiss");
            administrationService = $injector.get('administrationService');
            systemSettingsCtrl = $controller('systemSettingsCtrl', {
                '$scope': scope,
                '$state': state,
                'administrationService': administrationService,
            });
        }); // end of inject
    });
    it('testing init function', function () {
   
        httpBackend.flush();
        expect(scope.objMisc.noOfRows).toBe(99)
    });
    it('testing Save function', function () {
        httpBackend.whenPOST('/SaveSystemSettings')
        .respond(function(method, url, data, headers){
            var res2={"type":true};
            return [200,res2,{}];      
        });
        scope.Save();
        httpBackend.flush();
        //expect(scope.objReport.contactAttempt).toBe(10);
    });

    it('testing SaveMisc function', function () {
        httpBackend.whenPOST('/SaveSystemSettings')
        .respond(function(method, url, data, headers){
            var res2={"type":true};
            return [200,res2,{}];      
        });
        scope.SaveMisc();
        httpBackend.flush();
        //expect(scope.objReport.contactAttempt).toBe(10);
    });
    it('testing SaveRport function', function () {
        httpBackend.whenPOST('/SaveSystemSettings')
        .respond(function(method, url, data, headers){
            var res2={"type":true};
            return [200,res2,{}];      
        });
        scope.SaveRport();
        httpBackend.flush();
        //expect(scope.objReport.contactAttempt).toBe(10);
    });                        
    it('testing restoreDefaults function', function () {
        httpBackend.whenPOST('/RestoreDefaultSettings')
        .respond(function(method, url, data, headers){
            var res2={"type":true,"output":[{"_id":"586a520f7e5e887d9176fba4","Settings":"Communications","Type":{"Status":"Updated","Values":{"AsynchronousJobResponseTimeut":3,"AsynchronousJobRetryNumber":1,"ConfigurationDescrepancyHandling":"Error","EnableAutomaticApplicationGroupDownload":true,"FailedSendRetransmitDelay":600,"FirstMessageDelay":10,"IntermittentDelay":85,"IntermittentPeriod":30000,"InterrogationWindowEndPointBuffer":10,"InterrogationWindowEndPointRelay":75,"cellReMaximumCellRelayLoadlayLoad":99,"MaximumFailedEndpointMessagesReported":10000,"MaximumFirstMessageRetryDelay":10,"MaximumServerLoad":20000,"MaximumSimultaneousMessgaes":5,"MaximumTransmissionDelay":15,"MessageBusRetryNumber":10,"MessageBusRetryDelay":3,"SynchronousJobResponseTimeut":8}}}]};
            return [200,res2,{}];      
        });
        scope.restoreDefaults();
        httpBackend.flush();
        //expect(scope.obj.ConfigurationDescrepancyHandling).toEqual('Error');
    });
    it('testing restoreMiscDefaults function', function () {
        httpBackend.whenPOST('/RestoreDefaultSettings')
        .respond(function(method, url, data, headers){
            var res2={"type":true,"output":[{"_id":"586a52617e5e887d9176fbac","Settings":"Miscellaneous","Type":{"Status":"Updated","Values":{"DisplayRestrictedMenuItems":true,"NumberofRowstoDisplayPerPage":99}}}]};
            return [200,res2,{}];      
        });
        scope.restoreMiscDefaults();
        httpBackend.flush();
        expect(scope.objMisc.restrictedMenuItems).toBeTruthy();
    }); 
    it('testing restoreReportingDefaults function', function () {
        httpBackend.whenPOST('/RestoreDefaultSettings')
        .respond(function(method, url, data, headers){
            var res2={"type":true,"output":[{"_id":"586a527b7e5e887d9176fbb0","Settings":"Reporting","Type":[{"Status":"Updated","Values":{"ContactAttemptResultCount":10,"FailedReadDays":30,"LastReadCriticalThreshold":120,"LastReadWarningThreshold":72,"NumberofDecimalPlaces":3,"RFLANHealthCriticalThreshold":35,"RFLANHealthWarningThreshold":60,"TimeonBatteryThreshold":3651}}]}]};
            return [200,res2,{}];      
        });
        scope.restoreReportingDefaults();
        httpBackend.flush();
        //expect(scope.objReport.NumberofDecimalPlaces).toBe(3);
    });                                              
});  