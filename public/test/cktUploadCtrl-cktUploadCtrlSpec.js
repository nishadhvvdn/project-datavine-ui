'use strict';
describe('uploadCtrl testing', function () {

    var scope, uploadCtrl,fileUpload,httpBackend,csvparser,deviceService,state, modalInstanceMock;


    beforeEach(angular.mock.module('dataVINEApp'));

    beforeEach(function () {
        inject(function ($injector, $controller, $rootScope,$sessionStorage,$httpBackend) {
            scope = $rootScope.$new(); //scope = $injector.get('$rootScope')
            modalInstanceMock = {
                dismiss: function (result) {

                }
            };
           
            state = $injector.get('$state');
            fileUpload = $injector.get('fileUpload');
            deviceService = $injector.get('DeviceService');
            csvparser = $injector.get('csvparser');
            // set up fake methods
            spyOn(modalInstanceMock, "dismiss");
            $sessionStorage.put('loginName','a');
            $sessionStorage.put('password','a');  
            objCacheDetails.webserviceUrl = '/'; 
            objCacheDetails.endpoints = {
                'NewCircuitEntry': {
                    'name': 'NewCircuitEntry',
                    "method": "POST"
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
                .respond(function(method, url, data, headers){
                  var res={};
                    return [200,res,{}];
                    
            }); 
            uploadCtrl = $controller('uploadCtrl', {
                '$scope': scope,
                '$modalInstance': modalInstanceMock,
                '$state': state,
                'csvparser':csvparser,
                'deviceService': deviceService,
                'uploadParam':{"type":'circuit','endPoint':'NewCircuitEntry'}
            });
        }); // end of inject
        
    }); 
    it('testing uploadFile function', function () {
        scope.fileContent={content:"TFMRSerialNumber,TFMRMake,TFMRRatingCapacity,TFMRHighLineVoltage,TFMRLowLineVoltage,TFMRHighLineCurrent,TFMRLowLineCurrent,TFMRType,HypersproutSerialNumber,HypersproutVersion,HypersproutMake,HSCTRatio,HSPTRatio,HSRatedVoltage,HSNumberOfPhases,HSRatedFrequency,HSAccuracy,HSDemandResetDate,HSCompliantToStandards,HSMaxDemandWindow,HSMaxDemandSlidingWindowInterval,HSSensorDetails,HSGPRSMacID,HSWiFiMacID,HSWiFiIpAddress,HSWiFiAccessPointPassword,HSSimCardNumber,HSLatitude,HSLongitude,ConnectedStreetlights,StreetlightsMetered,StreetlightUsage,NoOfConnectedStreetlights,WireSize,MaxOilTemp,MinOilTemp'\n'2,3,3,3,4,5,6,7,8,9,0,6,7,8,9,0,,,,,,,,,,,,,,,,,,,,'\n'"};
        httpBackend.whenPOST('/NewCircuitEntry')
            .respond(function(method, url, data, headers){
                var res={};
                return [200,res,{}];
                    
        });
        scope.uploadFile();        
            //expect(scope.tagOptions.data['Serial Number']).toEqual('123');
        httpBackend.flush();
        //expect(modalInstanceMock.dismiss).toHaveBeenCalled(); 
     
    });
    it('testing cancel function', function () {
        scope.cancel();
        expect(modalInstanceMock.dismiss).toHaveBeenCalled();  
    });    
});    