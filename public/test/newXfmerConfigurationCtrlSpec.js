'use strict';
//var filter;
describe('newXfmerConfigurationCtrl testing', function () {
    var scope,uibModalStack,newXfmerConfigurationCtrl, state,refreshservice,deviceService, uibModal, modalInstanceMock, deviceService, httpBackend;
    beforeEach(angular.mock.module('dataVINEApp'));
    beforeEach(function () {
        inject(function ($injector, $controller, $rootScope, $sessionStorage, $httpBackend) {
            scope = $rootScope.$new(); //scope = $injector.get('$rootScope') 
            modalInstanceMock = {
                dismiss: function (result) {

                }
            };
            scope.meterdetails = {};
            spyOn(modalInstanceMock, "dismiss");
            uibModal = $injector.get('$uibModal');
            deviceService = $injector.get('DeviceService');
            refreshservice = $injector.get('refreshservice');
            uibModalStack = $injector.get('$uibModalStack');
            state = $injector.get('$state');
            $sessionStorage.put('loginName', 'a');
            $sessionStorage.put('password', 'a');
            objCacheDetails = { "userDetails": { "timeZone": "America/Adak" } };
            objCacheDetails.data = { "selectedData": { TransformerID: 1,'ratedVoltage':2,phases:4,frequency:4,maxDemandSWI:7,StreetlightsMetered:false,ConnectedStreetlights:false,ConnectedCamera:false,latitude:4,longitude:5} }
            objCacheDetails.webserviceUrl = '/';
            objCacheDetails.endpoints = {
                'EditTransformerHypersproutDetails': {
                    'name': 'EditTransformerHypersproutDetails',
                    "method": "post"
                },
                'NewTransformerHypersproutEntry': {
                    'name': 'NewTransformerHypersproutEntry',
                    "method": "post"
                }                
            };
            spyOn(state, 'reload');
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
            newXfmerConfigurationCtrl = $controller('newXfmerConfigurationCtrl', {
                '$modalInstance': modalInstanceMock,
                '$uibModalStack':uibModalStack,
                '$scope': scope,
                '$uibModal': uibModal,
                '$state': state,
                '$rootScope': $rootScope,
                'deviceService': deviceService,
                'refreshservice':refreshservice
            });

        }); // end of inject
    }); // end of beforeEach
    it('testing for meterdetails.TransformerID vairiable', function () {
        //httpBackend.flush();
        expect(scope.transfomerdetails.TransformerID).toBe(1);
    });
    it('testing for updateTransformer function', function () {
        scope.transfomerdetails={TransformerID:1,HypersproutID:2,ratedVoltage:3,phases:4,frequency:4,maxDemandSWI:7,StreetlightsMetered:false,ConnectedStreetlights:false,ConnectedCamera:false};
        httpBackend.whenPOST('/EditTransformerHypersproutDetails')
            .respond(function(method, url, data, headers){
                var res={};
                return [200,res,{}];          
        });        
        scope.updateTransformer();
        httpBackend.flush();
        expect(scope.transfomerdetails.sensorRating).toEqual('N/A');
        expect(modalInstanceMock.dismiss).toHaveBeenCalled();
        expect(state.reload).toHaveBeenCalled();
    }); 
    it('testing for saveTransformer function', function () {
        scope.transfomerdetails={transformerSl:1,make:'tr1',ratedVoltage:5,phases:4,frequency:4,maxDemandSWI:7,StreetlightsMetered:false,ConnectedStreetlights:false,ConnectedCamera:false};
        httpBackend.whenPOST('/NewTransformerHypersproutEntry')
            .respond(function(method, url, data, headers){
                var res={};
                return [200,res,{}];          
        });        
        scope.saveTransformer();
        httpBackend.flush();
        expect(scope.transfomerdetails.sensorRating).toEqual('N/A');
        expect(modalInstanceMock.dismiss).toHaveBeenCalled();
        expect(state.reload).toHaveBeenCalled();
    });      
    it('testing on focusValidate function with undefined input', function () {
        scope.transfomerdetails.transformerSl = undefined;
        scope.transformerCreation = { "transformerSl": {} };
        scope.focusValidate('transformerSl');
        expect(scope.errorXmerSl).toBeTruthy();
    });
    it('testing on focusValidate function with value and parameter is transformerSl', function () {
        scope.transfomerdetails.transformerSl = 'jhgghggh';
        scope.transformerCreation = { "transformerSl": {} };
        scope.focusValidate('transformerSl');
        expect(scope.errorXmerSl).toBeFalsy();
    });
    it('testing on focusValidate function with value length more than 30 and parameter is transformerSl', function () {
        scope.transfomerdetails.transformerSl = 'jhgghzdsadasdasdasdasdasdsadsadsadasdsadasdasdasdasdasdasdsadaggh';
        scope.transformerCreation = { "transformerSl": {} };
        scope.focusValidate('transformerSl');
        expect(scope.errorXmerSlMessage).toEqual('Length of Transformer Serial must be less than 30');
    }); 
    it('testing on focusValidate function with undefined input', function () {
        scope.transfomerdetails.make = undefined;
        scope.transformerCreation = { "make": {} };
        scope.focusValidate('make');
        expect(scope.errorMake).toBeTruthy();
    });
    it('testing on focusValidate function with value and parameter is make', function () {
        scope.transfomerdetails.make = 'jhgghggh';
        scope.transformerCreation = { "make": {} };
        scope.focusValidate('make');
        expect(scope.errorMake).toBeFalsy();
    });
    it('testing on focusValidate function with value length more than 30 and parameter is transformerSl', function () {
        scope.transfomerdetails.make = 'jhgghzdsadasdasdasdasdasdsadsadsadasdsadasdasdasdasdasdasdsadaggh';
        scope.transformerCreation = { "make": {} };
        scope.focusValidate('make');
        expect(scope.errorMakeMessage).toEqual('Length of Make should not exceed 30!');
    });   
    it('testing on focusValidate function with undefined input', function () {
        scope.transfomerdetails.kvaRating = undefined;
        scope.transformerCreation = { "kvaRating": {} };
        scope.focusValidate('kvaRatingXmer');
        expect(scope.errorKvaRating).toBeTruthy();
    });
    it('testing on focusValidate function with value and parameter is kvaRatingXmer', function () {
        scope.transfomerdetails.kvaRating = '222';
        scope.transformerCreation = { "kvaRating": {} };
        scope.focusValidate('kvaRatingXmer');
        expect(scope.errorKvaRating).toBeFalsy();
    });
    it('testing on focusValidate function with value length more than 10 and parameter is kvaRatingXmer', function () {
        scope.transfomerdetails.kvaRating = '22222222222222222222222222222222';
        scope.transformerCreation = { "kvaRating": {} };
        scope.focusValidate('kvaRatingXmer');
        expect(scope.errorKvaRatingMessage).toEqual('Length of KVA Rating should not exceed 10!');
    }); 
    it('testing on focusValidate function with undefined input', function () {
        scope.transfomerdetails.highLineV = undefined;
        scope.transformerCreation = { "highLineV": {} };
        scope.focusValidate('highLineV');
        expect(scope.errorhighLineV).toBeTruthy();
    });
    it('testing on focusValidate function with value and parameter is highLineV', function () {
        scope.transfomerdetails.highLineV = '222';
        scope.transformerCreation = { "highLineV": {} };
        scope.focusValidate('highLineV');
        expect(scope.errorhighLineV).toBeFalsy();
    });
    it('testing on focusValidate function with value length more than 6 and parameter is highLineV', function () {
        scope.transfomerdetails.highLineV = '22222222222222222222222222222222';
        scope.transformerCreation = { "highLineV": {} };
        scope.focusValidate('highLineV');
        expect(scope.errorhighLineVMessage).toEqual('Length of High Line Voltage should not exceed 6!');
    });    
    it('testing on focusValidate function with undefined input', function () {
        scope.transfomerdetails.lowLineV = undefined;
        scope.transformerCreation = { "lowLineV": {} };
        scope.focusValidate('lowLineV');
        expect(scope.errorlowLineV).toBeTruthy();
    });
    it('testing on focusValidate function with value and parameter is lowLineV', function () {
        scope.transfomerdetails.lowLineV = '222';
        scope.transformerCreation = { "lowLineV": {} };
        scope.focusValidate('lowLineV');
        expect(scope.errorlowLineV).toBeFalsy();
    });
    it('testing on focusValidate function with value length more than 4 and parameter is lowLineV', function () {
        scope.transfomerdetails.lowLineV = '2222222222222';
        scope.transformerCreation = { "lowLineV": {} };
        scope.focusValidate('lowLineV');
        expect(scope.errorlowLineVMessage).toEqual('Length of Low Line Voltage should not exceed 4!');
    });           
     it('testing on focusValidate function with undefined input', function () {
        scope.transfomerdetails.highLineCurrent = undefined;
        scope.transformerCreation = { "highLineCurrent": {} };
        scope.focusValidate('highLineCurrent');
        expect(scope.errorhighLineCurrent).toBeTruthy();
    });
    it('testing on focusValidate function with value and parameter is highLineCurrent', function () {
        scope.transfomerdetails.highLineCurrent = '222';
        scope.transformerCreation = { "highLineCurrent": {} };
        scope.focusValidate('highLineCurrent');
        expect(scope.errorhighLineCurrent).toBeFalsy();
    });
    it('testing on focusValidate function with value length more than 6 and parameter is highLineCurrent', function () {
        scope.transfomerdetails.highLineCurrent = '2222222222222';
        scope.transformerCreation = { "highLineCurrent": {} };
        scope.focusValidate('highLineCurrent');
        expect(scope.errorhighLineCurrentMessage).toEqual('Length of High Line Current should not exceed 6!');
    }); 
     it('testing on focusValidate function with undefined input', function () {
        scope.transfomerdetails.lowLineCurrent = undefined;
        scope.transformerCreation = { "lowLineCurrent": {} };
        scope.focusValidate('lowLineCurrent');
        expect(scope.errorlowLineCurrent).toBeTruthy();
    });
    it('testing on focusValidate function with value and parameter is lowLineCurrent', function () {
        scope.transfomerdetails.lowLineCurrent = '222';
        scope.transformerCreation = { "lowLineCurrent": {} };
        scope.focusValidate('lowLineCurrent');
        expect(scope.errorlowLineCurrent).toBeFalsy();
    });
    it('testing on focusValidate function with value length more than 4 and parameter is lowLineCurrent', function () {
        scope.transfomerdetails.lowLineCurrent = '2222222222222';
        scope.transformerCreation = { "lowLineCurrent": {} };
        scope.focusValidate('lowLineCurrent');
        expect(scope.errorlowLineCurrentMessage).toEqual('Length of Low Line Current should not exceed 4!');
    });   
     it('testing on focusValidate function with undefined input', function () {
        scope.transfomerdetails.WireSize = undefined;
        scope.transformerCreation = { "WireSize": {} };
        scope.focusValidate('WireSize');
        expect(scope.errorWireSize).toBeTruthy();
    });
    it('testing on focusValidate function with value and parameter is WireSize', function () {
        scope.transfomerdetails.WireSize ='555555';
        scope.transformerCreation = { "WireSize": {} };
        scope.focusValidate('WireSize');
        expect(scope.errorWireSize).toBeFalsy();
    });
    it('testing on focusValidate function with value length more than 4 and parameter is WireSize', function () {
        scope.transfomerdetails.WireSize = '2222222224444422225555555555555555555555555555555555555555';
        scope.transformerCreation = { "WireSize": {} };
        scope.focusValidate('WireSize');
        expect(scope.errorWireSizeMessage).toEqual('Length of Wire Size should not exceed 30!');
    });     
     it('testing on focusValidate function with undefined input', function () {
        scope.transfomerdetails.maxOil = undefined;
        scope.transformerCreation = { "maxOil": {} };
        scope.focusValidate('maxOil');
        expect(scope.errormaxOil).toBeTruthy();
    });
    it('testing on focusValidate function with value and parameter is maxOil', function () {
        scope.transfomerdetails.maxOil ='2';
        scope.transformerCreation = { "maxOil": {} };
        scope.focusValidate('maxOil');
        expect(scope.errormaxOil).toBeFalsy();
    });
    it('testing on focusValidate function with value length more than 3 and parameter is maxOil', function () {
        scope.transfomerdetails.maxOil = '33334';
        scope.transformerCreation = { "maxOil": {} };
        scope.focusValidate('maxOil');
        expect(scope.errormaxOilMessage).toEqual('Length of Max Oil Temperature should not exceed 3!');
    });  
     it('testing on focusValidate function with undefined input', function () {
        scope.transfomerdetails.lowOil = undefined;
        scope.transformerCreation = { "lowOil": {} };
        scope.focusValidate('lowOil');
        expect(scope.errorlowOil).toBeTruthy();
    });
    it('testing on focusValidate function with value and parameter is lowOil', function () {
        scope.transfomerdetails.lowOil ='2';
        scope.transformerCreation = { "lowOil": {} };
        scope.focusValidate('lowOil');
        expect(scope.errorlowOil).toBeFalsy();
    });
    it('testing on focusValidate function with value length more than 3 and parameter is lowOil', function () {
        scope.transfomerdetails.lowOil = '33334';
        scope.transformerCreation = { "lowOil": {} };
        scope.focusValidate('lowOil');
        expect(scope.errorlowOilMessage).toEqual('Length of Low Oil Temperature should not exceed 3!');
    });  
     it('testing on focusValidate function with undefined input', function () {
        scope.transfomerdetails.StreetlightUsage = undefined;
        scope.transformerCreation = { "StreetlightUsage": {} };
        scope.focusValidate('StreetlightUsage');
        expect(scope.errorStreetlightUsage).toBeTruthy();
    });
    it('testing on focusValidate function with value and parameter is StreetlightUsage', function () {
        scope.transfomerdetails.StreetlightUsage ='2';
        scope.transformerCreation = { "StreetlightUsage": {} };
        scope.focusValidate('StreetlightUsage');
        expect(scope.errorStreetlightUsage).toBeFalsy();
    });
    it('testing on focusValidate function with value length more than 8 and parameter is StreetlightUsage', function () {
        scope.transfomerdetails.StreetlightUsage = '3333444447';
        scope.transformerCreation = { "StreetlightUsage": {} };
        scope.focusValidate('StreetlightUsage');
        expect(scope.errorStreetlightUsageMessage).toEqual('Length of Street Light Usage should not exceed 8!');
    });  
     it('testing on focusValidate function with undefined input', function () {
        scope.transfomerdetails.hypSl = undefined;
        scope.transformerCreation = { "hypSl": {} };
        scope.focusValidate('hypSl');
        expect(scope.errorhypSl).toBeTruthy();
    });
    it('testing on focusValidate function with value and parameter is hypSl', function () {
        scope.transfomerdetails.hypSl ='2';
        scope.transformerCreation = { "hypSl": {} };
        scope.focusValidate('hypSl');
        expect(scope.errorhypSl).toBeFalsy();
    });
    it('testing on focusValidate function with value length more than 25 and parameter is hypSl', function () {
        scope.transfomerdetails.hypSl = '33334444sdsadsadsadasdsadsadasdasdsadsa47';
        scope.transformerCreation = { "hypSl": {} };
        scope.focusValidate('hypSl');
        expect(scope.errorhypSlMessage).toEqual('Length of HyperSPROUT\u2122 Serial should not exceed 25!');
    });      
     it('testing on focusValidate function with undefined input', function () {
        scope.transfomerdetails.hypSl = undefined;
        scope.transformerCreation = { "hypSl": {} };
        scope.focusValidate('hypSl');
        expect(scope.errorhypSl).toBeTruthy();
    });
    it('testing on focusValidate function with value and parameter is hypSl', function () {
        scope.transfomerdetails.hypSl ='2';
        scope.transformerCreation = { "hypSl": {} };
        scope.focusValidate('hypSl');
        expect(scope.errorhypSl).toBeFalsy();
    });
    it('testing on focusValidate function with value length more than 25 and parameter is hypSl', function () {
        scope.transfomerdetails.hypSl = '33334444sdsadsadsadasdsadsadasdasdsadsa47';
        scope.transformerCreation = { "hypSl": {} };
        scope.focusValidate('hypSl');
        expect(scope.errorhypSlMessage).toEqual('Length of HyperSPROUT\u2122 Serial should not exceed 25!');
    });    
     it('testing on focusValidate function with undefined input', function () {
        scope.transfomerdetails.hypersproutMake = undefined;
        scope.transformerCreation = { "hypersproutMake": {} };
        scope.focusValidate('hypersproutMake');
        expect(scope.errorhypersproutMake).toBeTruthy();
    });
    it('testing on focusValidate function with value and parameter is hypersproutMake', function () {
        scope.transfomerdetails.hypersproutMake ='2';
        scope.transformerCreation = { "hypersproutMake": {} };
        scope.focusValidate('hypersproutMake');
        expect(scope.errorhypersproutMake).toBeFalsy();
    });
    it('testing on focusValidate function with value length more than 30 and parameter is hypersproutMake', function () {
        scope.transfomerdetails.hypersproutMake = '33334444sdsadsadsadasdsadsadasdasdsadsarwerwerwer47';
        scope.transformerCreation = { "hypersproutMake": {} };
        scope.focusValidate('hypersproutMake');
        expect(scope.errorhypersproutMakeMessage).toEqual('Length of HyperSPROUT\u2122 Name should not exceed 30!');
    });
     it('testing on focusValidate function with undefined input', function () {
        scope.transfomerdetails.NoOfConnectedStreetlights = undefined;
        scope.transformerCreation = { "NoOfConnectedStreetlights": {} };
        scope.focusValidate('NoOfConnectedStreetlights');
        expect(scope.errorNoOfConnectedStreetlights).toBeTruthy();
    });
    it('testing on focusValidate function with value and parameter is NoOfConnectedStreetlights', function () {
        scope.transfomerdetails.NoOfConnectedStreetlights ='2';
        scope.transformerCreation = { "NoOfConnectedStreetlights": {} };
        scope.focusValidate('NoOfConnectedStreetlights');
        expect(scope.errorNoOfConnectedStreetlights).toBeFalsy();
    });
    it('testing on focusValidate function with value length more than 5 and parameter is NoOfConnectedStreetlights', function () {
        scope.transfomerdetails.NoOfConnectedStreetlights = '222222';
        scope.transformerCreation = { "NoOfConnectedStreetlights": {} };
        scope.focusValidate('NoOfConnectedStreetlights');
        expect(scope.errorNoOfConnectedStreetlightsMessage).toEqual('Length of No. of connected street lights should not exceed 5!');
    }); 
     it('testing on focusValidate function with undefined input', function () {
        scope.transfomerdetails.hypersproutVersion = undefined;
        scope.transformerCreation = { "hypersproutVersion": {} };
        scope.focusValidate('hypersproutVersion');
        expect(scope.errorhypersproutVersion).toBeTruthy();
    });
    it('testing on focusValidate function with value and parameter is hypersproutVersion', function () {
        scope.transfomerdetails.hypersproutVersion ='2';
        scope.transformerCreation = { "hypersproutVersion": {} };
        scope.focusValidate('hypersproutVersion');
        expect(scope.errorhypersproutVersion).toBeFalsy();
    });
    it('testing on focusValidate function with value length more than 20 and parameter is hypersproutVersion', function () {
        scope.transfomerdetails.hypersproutVersion = '222222333333322222222222545555555555555555';
        scope.transformerCreation = { "hypersproutVersion": {} };
        scope.focusValidate('hypersproutVersion');
        expect(scope.errorhypersproutVersionMessage).toEqual('Length of HyperSPROUT\u2122 Version should not exceed 20!');
    });  
     it('testing on focusValidate function with undefined input', function () {
        scope.transfomerdetails.ctRatio = undefined;
        scope.transformerCreation = { "ctRatio": {} };
        scope.focusValidate('ctRatio');
        expect(scope.errorctRatio).toBeTruthy();
    });
    it('testing on focusValidate function with value and parameter is ctRatio', function () {
        scope.transfomerdetails.ctRatio ='2';
        scope.transformerCreation = { "ctRatio": {} };
        scope.focusValidate('ctRatio');
        expect(scope.errorctRatio).toBeFalsy();
    });
    it('testing on focusValidate function with value length more than 8 and parameter is ctRatio', function () {
        scope.transfomerdetails.ctRatio = '2222223333333222222222225';
        scope.transformerCreation = { "ctRatio": {} };
        scope.focusValidate('ctRatio');
        expect(scope.errorctRatioMessage).toEqual('Length of CT Ratio should not exceed 8!');
    });
     it('testing on focusValidate function with undefined input', function () {
        scope.transfomerdetails.ptRatio = undefined;
        scope.transformerCreation = { "ptRatio": {} };
        scope.focusValidate('ptRatio');
        expect(scope.errorptRatio).toBeTruthy();
    });
    it('testing on focusValidate function with value and parameter is ptRatio', function () {
        scope.transfomerdetails.ptRatio ='2';
        scope.transformerCreation = { "ptRatio": {} };
        scope.focusValidate('ptRatio');
        expect(scope.errorptRatio).toBeFalsy();
    });
    it('testing on focusValidate function with value length more than 8 and parameter is ptRatio', function () {
        scope.transfomerdetails.ptRatio = '2222223333333222222222225';
        scope.transformerCreation = { "ptRatio": {} };
        scope.focusValidate('ptRatio');
        expect(scope.errorptRatioMessage).toEqual('Length of PT Ratio should not exceed 8!');
    }); 
     it('testing on focusValidate function with undefined input', function () {
        scope.transfomerdetails.sensorRating = undefined;
        scope.transformerCreation = { "sensorRating": {} };
        scope.focusValidate('sensorRating');
        expect(scope.errorsensorRating).toBeTruthy();
    });
    it('testing on focusValidate function with value and parameter is sensorRating', function () {
        scope.transfomerdetails.sensorRating ='2';
        scope.transformerCreation = { "sensorRating": {} };
        scope.focusValidate('sensorRating');
        expect(scope.errorsensorRating).toBeFalsy();
    });
    it('testing on focusValidate function with value length more than 30 and parameter is sensorRating', function () {
        scope.transfomerdetails.sensorRating = '2222223333333222222222225555555555555555555555555';
        scope.transformerCreation = { "sensorRating": {} };
        scope.focusValidate('sensorRating');
        expect(scope.errorsensorRatingMessage).toEqual('Length of Sensor Rating should not exceed 30!');
    }); 
     it('testing on focusValidate function with undefined input', function () {
        scope.transfomerdetails.gprs = undefined;
        scope.transformerCreation = { "gprs": {} };
        scope.focusValidate('gprs');
        expect(scope.errorgprs).toBeTruthy();
    });
    it('testing on focusValidate function with value and parameter is gprs', function () {
        scope.transfomerdetails.gprs ='23:33:33:33:33:33';
        scope.transformerCreation = { "gprs": {} };
        scope.focusValidate('gprs');
        expect(scope.errorgprs).toBeFalsy();
    });
    it('testing on focusValidate function with value length more than 30 and parameter is gprs', function () {
        scope.transfomerdetails.gprs = '2222223333333222222222225555555555555555555555555';
        scope.transformerCreation = { "gprs": {} };
        scope.focusValidate('gprs');
        expect(scope.errorgprsMessage).toEqual('Invalid GPRS MAC ID!');
    });  
     it('testing on focusValidate function with undefined input', function () {
        scope.transfomerdetails.latitude = undefined;
        scope.transformerCreation = { "latitude": {} };
        scope.focusValidate('latitude');
        expect(scope.errorlatitude).toBeTruthy();
    });
    it('testing on focusValidate function with value and parameter is latitude', function () {
        scope.transfomerdetails.latitude ='2';
        scope.transformerCreation = { "latitude": {} };
        scope.focusValidate('latitude');
        expect(scope.errorlatitude).toBeFalsy();
    });
    it('testing on focusValidate function with value length more than 30 and parameter is latitude', function () {
        scope.transfomerdetails.latitude = '22225555555555555';
        scope.transformerCreation = { "latitude": {} };
        scope.focusValidate('latitude');
        expect(scope.errorlatitudeMessage).toEqual('Invalid Latitude! The range of latitude is 0 to +/- 90');
    });      
     it('testing on focusValidate function with undefined input', function () {
        scope.transfomerdetails.longitude = undefined;
        scope.transformerCreation = { "longitude": {} };
        scope.focusValidate('longitude');
        expect(scope.errorlongitude).toBeTruthy();
    });
    it('testing on focusValidate function with value and parameter is longitude', function () {
        scope.transfomerdetails.longitude ='2';
        scope.transformerCreation = { "longitude": {} };
        scope.focusValidate('longitude');
        expect(scope.errorlongitude).toBeFalsy();
    });
    it('testing on focusValidate function with value length more than 30 and parameter is longitude', function () {
        scope.transfomerdetails.longitude = '222222555555555555555';
        scope.transformerCreation = { "longitude": {} };
        scope.focusValidate('longitude');
        expect(scope.errorlongitudeMessage).toEqual('Invalid Longitude! The range of longitude is 0 to +/- 180');
    });    
     it('testing on focusValidate function with undefined input', function () {
        scope.transfomerdetails.wifiMacId = undefined;
        scope.transformerCreation = { "wifiMacId": {} };
        scope.focusValidate('wifiMacId');
        expect(scope.errorwifiMacId).toBeTruthy();
    });
    it('testing on focusValidate function with value and parameter is wifiMacId', function () {
        scope.transfomerdetails.wifiMacId ='22:22:22:22:22:22';
        scope.transformerCreation = { "wifiMacId": {} };
        scope.focusValidate('wifiMacId');
        expect(scope.errorwifiMacId).toBeFalsy();
    });
    it('testing on focusValidate function with value length more than 30 and parameter is wifiMacId', function () {
        scope.transfomerdetails.wifiMacId = '22222255555555555555566666666666666';
        scope.transformerCreation = { "wifiMacId": {} };
        scope.focusValidate('wifiMacId');
        expect(scope.errorwifiMacIdMessage).toEqual('Invalid Wifi MAC ID!');
    });  
     it('testing on focusValidate function with undefined input', function () {
        scope.transfomerdetails.wifiIpAdd = undefined;
        scope.transformerCreation = { "wifiIpAdd": {} };
        scope.focusValidate('wifiIpAdd');
        expect(scope.errorwifiIpAdd).toBeTruthy();
    });
    it('testing on focusValidate function with value and parameter is wifiIpAdd', function () {
        scope.transfomerdetails.wifiIpAdd ='192.168.43.1';
        scope.transformerCreation = { "wifiIpAdd": {} };
        scope.focusValidate('wifiIpAdd');
        expect(scope.errorwifiIpAdd).toBeFalsy();
    });
    it('testing on focusValidate function with wrong wifiIpAdd value and parameter is wifiIpAdd', function () {
        scope.transfomerdetails.wifiIpAdd = '22222255555555555555566666666666666';
        scope.transformerCreation = { "wifiIpAdd": {} };
        scope.focusValidate('wifiIpAdd');
        expect(scope.errorwifiIpAddMessage).toEqual('Invalid Wifi IP Address!');
    });  
     it('testing on focusValidate function with undefined input', function () {
        scope.transfomerdetails.wifiAccessPwd = undefined;
        scope.transformerCreation = { "wifiAccessPwd": {} };
        scope.focusValidate('wifiAccessPwd');
        expect(scope.errorwifiAccessPwd).toBeTruthy();
    });
    it('testing on focusValidate function with value and parameter is wifiAccessPwd', function () {
        scope.transfomerdetails.wifiAccessPwd ='33333300';
        scope.transformerCreation = { "wifiAccessPwd": {} };
        scope.focusValidate('wifiAccessPwd');
        expect(scope.errorwifiAccessPwd).toBeFalsy();
    });
    it('testing on focusValidate function with wrong wifiAccessPwd value and parameter is wifiAccessPwd', function () {
        scope.transfomerdetails.wifiAccessPwd = '22225';
        scope.transformerCreation = { "wifiAccessPwd": {} };
        scope.focusValidate('wifiAccessPwd');
        expect(scope.errorwifiAccessPwdMessage).toEqual('Length of password should between 8 to 20!');
    }); 
     it('testing on focusValidate function with undefined input', function () {
        scope.transfomerdetails.simCard = undefined;
        scope.transformerCreation = { "simCard": {} };
        scope.focusValidate('simCard');
        expect(scope.errorsimCard).toBeTruthy();
    });
    it('testing on focusValidate function with value and parameter is simCard', function () {
        scope.transfomerdetails.simCard ='333333333344333';
        scope.transformerCreation = { "simCard": {} };
        scope.focusValidate('simCard');
        expect(scope.errorsimCard).toBeFalsy();
    });
    it('testing on focusValidate function with wrong simCard value and parameter is simCard', function () {
        scope.transfomerdetails.simCard = '2222225';
        scope.transformerCreation = { "simCard": {} };
        scope.focusValidate('simCard');
        expect(scope.errorsimCardMessage).toEqual('SIM Card length should be 15!');
    });
    it('testing for cancel function', function () {
        modalInstanceMock = {
            dismiss: function (result) {

            }
        };
        spyOn(modalInstanceMock, "dismiss");
        scope.cancel();
        //expect(true).toBe(true);
    });
    it('test for $destroy case', function () {
        scope.$destroy();
        expect(true).toBe(true);
    });                                                         
});
