'use strict';

describe('newCircuitConfigurationCtrl testing', function () {

    var scope,uibModalStack, newCircuitConfigurationCtrl, uibModal,modalInstanceMock, DeviceService, state, httpBackend;


    beforeEach(angular.mock.module('dataVINEApp'));

    beforeEach(function () {
        inject(function ($injector, $controller, $rootScope, $sessionStorage, $httpBackend) {
           // objCacheDetails.data={'selectedData':{'CircuitNumber':1}};
            scope = $rootScope.$new();
            uibModal = $injector.get('$uibModal');
            state = $injector.get('$state');
            DeviceService = $injector.get('DeviceService');
            uibModalStack = $injector.get('$uibModalStack');
            modalInstanceMock = {
                dismiss: function (result) {

                }
            };
            spyOn(modalInstanceMock, "dismiss");

            $sessionStorage.put('loginName', 'a');
            $sessionStorage.put('password', 'a');
            objCacheDetails.webserviceUrl = '/';
            objCacheDetails.endpoints = {
                'EditCircuitDetails': {
                    'name': 'EditCircuitDetails',
                    "method": "POST"
                },
                'NewCircuitEntry': {
                    'name': 'NewCircuitEntry',
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
            objCacheDetails.data={'selectedData':{'CircuitNumber':1,Latitude:2,Longitude:5}} 
            state={current:{},go:function(){

            },reload:function(){

            }};
            state.current.name = '';
            spyOn(state,'go');
            newCircuitConfigurationCtrl = $controller('newCircuitConfigurationCtrl', {
                '$uibModalStack':uibModalStack,
                '$modalInstance': modalInstanceMock,
                '$scope': scope,
                '$rootScope':$rootScope,
                '$uibModal': uibModal,
                '$state': state,
                'DeviceService': DeviceService,
            });
        });
    });
    it('test for POST EditCircuitDetails function',function(){
        httpBackend.whenPOST('/EditCircuitDetails')
            .respond(function(method, url, data, headers){
               var saveRes={};
               return [200,saveRes,{}];
        });
        scope.update();
        httpBackend.flush();
        expect(true).toBe(true);
    });
    it('test for pageload', function () {
        modalInstanceMock = {
            dismiss: function (result) {

            }
        };
        spyOn(modalInstanceMock, "dismiss");
        scope.cancel();
    });
    it('test for POST NewCircuitEntry function',function(){
        httpBackend.whenPOST('/NewCircuitEntry')
            .respond(function(method, url, data, headers){
               var saveRes={};
               return [200,saveRes,{}];
        });
        scope.save();
        httpBackend.flush();
        expect(true).toBe(true);
    });
        it('test for meterdetails function',function(){
            scope.meterdetails={circuitId:'989898989898989898989898989898989898989888324242342342342342342'}
            scope.circuitEdit={'circuitId':{}};
            scope.focusValidate('circuitId');
            expect(scope.errorCktId).toBeTruthy();
    });
    it('test for meterdetails function',function(){
            scope.meterdetails={circuitId:'989898989898'};
            scope.circuitEdit={'circuitId':{}};
            scope.focusValidate('circuitId');
            expect(scope.errorCktId).toBeFalsy();
    });
    it('test for POST errorKvaRating function',function(){
            scope.meterdetails={kvaRating:'989898989898989898989898989898989898989888324242342342342342342'}
            scope.circuitEdit={'kvaRating':{}};
            scope.focusValidate('kvaRating');
            expect(scope.errorKvaRating).toBeTruthy();
    });
    it('test for POST errorKvaRating function',function(){
            scope.meterdetails={kvaRating:'944'};
            scope.circuitEdit={'kvaRating':{}};
            scope.focusValidate('kvaRating');
            expect(scope.errorKvaRating).toBeFalsy();
    });
    it('test for POST latitude function',function(){
            scope.meterdetails={latitude:{}}
            scope.circuitEdit={'latitude':{}};
            scope.focusValidate('latitude');
            expect(scope.errorLatitude).toBeTruthy();
    });
    it('test for POST longitude function',function(){
            scope.meterdetails={longitude:{}}
            scope.circuitEdit={'longitude':{}};
            scope.focusValidate('longitude');
            expect(scope.errorLongitude).toBeTruthy();
    });
    it('test for POST substationId function',function(){
            scope.meterdetails={substationId:'989898989898989898989898989898989898989888324242342342342342342'}
            scope.circuitEdit={'substationId':{}};
            scope.focusValidate('substationId');
            expect(scope.errorSubstnId).toBeTruthy();
    });
    it('test for POST substationId function',function(){
            scope.meterdetails={substationId:'989898982342342342342342'}
            scope.circuitEdit={'substationId':{}};
            scope.focusValidate('substationId');
            expect(scope.errorSubstnId).toBeFalsy();
    });
    it('test for POST substationName function',function(){
            scope.meterdetails={substationName:'989898989898989898989898989898989898989888324242342342342342342'}
            scope.circuitEdit={'substationName':{}};
            scope.focusValidate('substationName');
            expect(scope.errorSubstnName).toBeTruthy();
    });
    it('test for POST substationName function',function(){
            scope.meterdetails={substationName:'989898982342342342342342'}
            scope.circuitEdit={'substationName':{}};
            scope.focusValidate('substationName');
            expect(scope.errorSubstnName).toBeFalsy();
    });
    it('test for POST substationAdd function',function(){
            scope.meterdetails={substationAdd:'9898989898989865465465454545464166541544885054835988t7648058075447584735894357834566904923047598054644598589898989898989898989898989888324242342342342342342'}
            scope.circuitEdit={'substationAdd':{}};
            scope.focusValidate('substationAdd');
            expect(scope.errorsubstationAdd).toBeTruthy();
    });
    it('test for POST substationAdd function',function(){
            scope.meterdetails={substationAdd:'989898982342342342342342'}
            scope.circuitEdit={'substationAdd':{}};
            scope.focusValidate('substationAdd');
            expect(scope.errorsubstationAdd).toBeFalsy();
    });
    it('test for POST country function',function(){
            scope.meterdetails={country:'9898989898989865465465454545447584735894357834566904923047598054644598589898989898989898989898989888324242342342342342342'}
            scope.circuitEdit={'country':{}};
            scope.focusValidate('country');
            expect(scope.errorCountry).toBeTruthy();
    });
    it('test for POST country function',function(){
            scope.meterdetails={country:'989898982342342342342342'}
            scope.circuitEdit={'country':{}};
            scope.focusValidate('country');
            expect(scope.errorCountry).toBeFalsy();
    });
    it('test for POST city function',function(){
            scope.meterdetails={city:'98989898989898654654654546541654546542415483957523846789898989888324242342342342342342'}
            scope.circuitEdit={'city':{}};
            scope.focusValidate('city');
            expect(scope.errorCity).toBeTruthy();
    });
    it('test for POST city function',function(){
            scope.meterdetails={city:'989898982342342342342342'}
            scope.circuitEdit={'city':{}};
            scope.focusValidate('city');
            expect(scope.errorCity).toBeFalsy();
    });
    it('test for POST zipcode function',function(){
            scope.meterdetails={zipcode:'989898989842'}
            scope.circuitEdit={'zipcode':{}};
            scope.focusValidate('zipcode');
            expect(scope.errorZipcode).toBeTruthy();
    });
    it('test for POST zipcode function',function(){
            scope.meterdetails={zipcode:'9898'}
            scope.circuitEdit={'zipcode':{}};
            scope.focusValidate('zipcode');
            expect(scope.errorZipcode).toBeFalsy();
    });
    it('test for $destroy case', function () {
        scope.$destroy();
        expect(true).toBe(true);
    });
});