'use strict';
//var filter;
describe('newMeterConfigurationCtrl testing', function () {
    var scope,uibModalStack,newMeterConfigurationCtrl, state, deviceService, uibModal, modalInstanceMock, deviceService, httpBackend;
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
            uibModalStack = $injector.get('$uibModalStack');
            state = $injector.get('$state');
            $sessionStorage.put('loginName', 'a');
            $sessionStorage.put('password', 'a');
            objCacheDetails = { "userDetails": { "timeZone": "America/Adak" } };
            objCacheDetails.data = { "selectedData": { MeterID: 1,latitudeMeter:2,longitudeMeter:5} }
            objCacheDetails.webserviceUrl = '/';
            objCacheDetails.endpoints = {
                'NewMeterEntry': {
                    'name': 'NewMeterEntry',
                    "method": "post"
                },
                'EditMeterDetails': {
                    'name': 'EditMeterDetails',
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
            newMeterConfigurationCtrl = $controller('newMeterConfigurationCtrl', {
                '$uibModalStack':uibModalStack,
                '$modalInstance': modalInstanceMock,
                '$scope': scope,
                '$uibModal': uibModal,
                '$state': state,
                '$rootScope': $rootScope,
                'deviceService': deviceService,
            });

        }); // end of inject
    }); // end of beforeEach
    it('testing for meterdetails.MeterID vairiable', function () {
        //httpBackend.flush();
        expect(scope.meterdetails.MeterID).toBe(1);
    });
    it('testing on saveMeter function', function () {
        httpBackend.whenPOST('/NewMeterEntry')
            .respond(function (method, url, data, headers) {
                var saveRes = { Status: "a", type: true };
                return [200, saveRes, {}];
            });
        scope.saveMeter();
        httpBackend.flush();
        expect(modalInstanceMock.dismiss).toHaveBeenCalled();
    });
    it('testing on updateMeter function', function () {
        httpBackend.whenPOST('/EditMeterDetails')
            .respond(function (method, url, data, headers) {
                var saveRes = { Status: "a", type: true };
                return [200, saveRes, {}];
            });
        scope.updateMeter();
        httpBackend.flush();
        expect(modalInstanceMock.dismiss).toHaveBeenCalled();
    });
    it('testing on cancel function', function () {
        scope.cancel();
        expect(modalInstanceMock.dismiss).toHaveBeenCalled();
    });
    it('testing on focusValidate function with undefined input', function () {
        scope.meterdetails.meterSl = undefined;
        scope.meterCreation = { "meterSl": {} };
        scope.focusValidate('meterSl');
        expect(scope.errormeterSl).toBeTruthy();
    });
    it('testing on focusValidate function with value and parameter is meterSl', function () {
        scope.meterdetails.meterSl = 'jhgghggh';
        scope.meterCreation = { "meterSl": {} };
        scope.focusValidate('meterSl');
        expect(scope.errormeterSl).toBeFalsy();
    });
    it('testing on focusValidate function with value length more than 30 and parameter is meterSl', function () {
        scope.meterdetails.meterSl = 'jhgghzdsadasdasdasdasdasdsadsadsadasdsadasdasdasdasdasdasdsadaggh';
        scope.meterCreation = { "meterSl": {} };
        scope.focusValidate('meterSl');
        expect(scope.errormeterSlMessage).toEqual('Length of Meter Serial must be less than 30');
    });
    it('testing on focusValidate function with undefined input', function () {
        scope.meterdetails.meterVersion = undefined;
        scope.meterCreation = { "meterVersion": {} };
        scope.focusValidate('meterVersion');
        expect(scope.errormeterVersion).toBeTruthy();
    });
    it('testing on focusValidate function with value and parameter is meterVersion', function () {
        scope.meterdetails.meterVersion = 'jhgghggh';
        scope.meterCreation = { "meterVersion": {} };
        scope.focusValidate('meterVersion');
        expect(scope.errormeterVersion).toBeFalsy();
    });
    it('testing on focusValidate function with value length more than 20 and parameter is meterVersion', function () {
        scope.meterdetails.meterVersion = 'jhgghzdsadasdasdasdasdasdsadsadsadasdsadasdasdasdasdasdasdsadaggh';
        scope.meterCreation = { "meterVersion": {} };
        scope.focusValidate('meterVersion');
        expect(scope.errormeterVersionMessage).toEqual('Length of Meter Version should not exceed 20!');
    });
    it('testing on focusValidate function with undefined input', function () {
        scope.meterdetails.nominalCurrent = undefined;
        scope.meterCreation = { "nominalCurrent": {} };
        scope.focusValidate('nominalCurrent');
        expect(scope.errornominalCurrent).toBeTruthy();
    });
    it('testing on focusValidate function with value and parameter is nominalCurrent', function () {
        scope.meterdetails.nominalCurrent = 'dd';
        scope.meterCreation = { "nominalCurrent": {} };
        scope.focusValidate('nominalCurrent');
        expect(scope.errornominalCurrent).toBeFalsy();
    });
    it('testing on focusValidate function with value length more than 4 and parameter is nominalCurrent', function () {
        scope.meterdetails.nominalCurrent = 'jhgghzdsadasdasdasdasdasdsadsadsadasdsadasdasdasdasdasdasdsadaggh';
        scope.meterCreation = { "nominalCurrent": {} };
        scope.focusValidate('nominalCurrent');
        expect(scope.errornominalCurrentMessage).toEqual('Length of Nominal Current should not exceed 4!');
    });
    it('testing on focusValidate function with undefined input', function () {
        scope.meterdetails.maximumCurrent = undefined;
        scope.meterCreation = { "maximumCurrent": {} };
        scope.focusValidate('maximumCurrent');
        expect(scope.errormaximumCurrent).toBeTruthy();
    });
    it('testing on focusValidate function with value and parameter is maximumCurrent', function () {
        scope.meterdetails.maximumCurrent = 'rr';
        scope.meterCreation = { "maximumCurrent": {} };
        scope.focusValidate('maximumCurrent');
        expect(scope.errormaximumCurrent).toBeFalsy();
    });
    it('testing on focusValidate function with value length more than 4 and parameter is maximumCurrent', function () {
        scope.meterdetails.maximumCurrent = 'jhgghzdsadasdasdasdasdasdsadsadsadasdsadasdasdasdasdasdasdsadaggh';
        scope.meterCreation = { "maximumCurrent": {} };
        scope.focusValidate('maximumCurrent');
        expect(scope.errormaximumCurrentMessage).toEqual('Length of Maximum Current should not exceed 4!');
    });
    it('testing on focusValidate function with undefined input', function () {
        scope.meterdetails.SealID = undefined;
        scope.meterCreation = { "SealID": {} };
        scope.focusValidate('SealID');
        expect(scope.errorSealID).toBeTruthy();
    });
    it('testing on focusValidate function with value and parameter is SealID', function () {
        scope.meterdetails.SealID = 'rr';
        scope.meterCreation = { "SealID": {} };
        scope.focusValidate('SealID');
        expect(scope.errorSealID).toBeFalsy();
    });
    it('testing on focusValidate function with value length more than 30 and parameter is SealID', function () {
        scope.meterdetails.SealID = 'jhgghzdsadasdasdasdasdasdsadsadsadasdsadasdasdasdasdasdasdsadaggh';
        scope.meterCreation = { "SealID": {} };
        scope.focusValidate('SealID');
        expect(scope.errorSealIDMessage).toEqual('Length of Seal ID should not exceed 30!');
    });
    it('testing on focusValidate function with undefined input', function () {
        scope.meterdetails.consumerName = undefined;
        scope.meterCreation = { "consumerName": {} };
        scope.focusValidate('consumerName');
        expect(scope.errorconsumerName).toBeTruthy();
    });
    it('testing on focusValidate function with value and parameter is consumerName', function () {
        scope.meterdetails.consumerName = 'rr';
        scope.meterCreation = { "consumerName": {} };
        scope.focusValidate('consumerName');
        expect(scope.errorconsumerName).toBeFalsy();
    });
    it('testing on focusValidate function with value length more than 50 and parameter is consumerName', function () {
        scope.meterdetails.consumerName = 'jhgghzdsadasdasdasdasdasdsadsadsadasdsadasdasdasdasdasdasdsadaggh';
        scope.meterCreation = { "consumerName": {} };
        scope.focusValidate('consumerName');
        expect(scope.errorconsumerNameMessage).toEqual('Length of Consumer Name should not exceed 50!');
    });
    it('testing on focusValidate function with undefined input', function () {
        scope.meterdetails.consumerName = undefined;
        scope.meterCreation = { "consumerNumber": {} };
        scope.focusValidate('consumerNumber');
        expect(scope.errorconsumerNumber).toBeTruthy();
    });
    it('testing on focusValidate function with value and parameter is consumerNumber', function () {
        scope.meterdetails.consumerNumber = 'rr';
        scope.meterCreation = { "consumerNumber": {} };
        scope.focusValidate('consumerNumber');
        expect(scope.errorconsumerNumber).toBeFalsy();
    });
    it('testing on focusValidate function with value length more than 20 and parameter is consumerNumber', function () {
        scope.meterdetails.consumerNumber = 'jhgghzdsadasdasdasdasdasdsadsadsadasdsadasdasdasdasdasdasdsadaggh';
        scope.meterCreation = { "consumerNumber": {} };
        scope.focusValidate('consumerNumber');
        expect(scope.errorconsumerNumberMessage).toEqual('Length of Consumer Number should not exceed 20!');
    });
    it('testing on focusValidate function with undefined input', function () {
        scope.meterdetails.consumerAddress = undefined;
        scope.meterCreation = { "consumerAddress": {} };
        scope.focusValidate('consumerAddress');
        expect(scope.errorconsumerAddress).toBeTruthy();
    });
    it('testing on focusValidate function with value and parameter is consumerAddress', function () {
        scope.meterdetails.consumerAddress = 'rr';
        scope.meterCreation = { "consumerAddress": {} };
        scope.focusValidate('consumerAddress');
        expect(scope.errorconsumerAddress).toBeFalsy();
    });
    it('testing on focusValidate function with value length more than 100 and parameter is consumerAddress', function () {
        scope.meterdetails.consumerAddress = 'jhgghzdsadasdasdasdahjgjhgjhgjhgjhghjghjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjgjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjsdasdsadsadsadasdsadasdasdasdasdasdasdsadagghjhgghzdsadasdasdasdahjgjhgjhgjhgjhghjghjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjgjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjsdasdsadsadsadasdsadasdasdasdasdasdasdsadaggh';
        scope.meterCreation = { "consumerAddress": {} };
        scope.focusValidate('consumerAddress');
        expect(scope.errorconsumerAddressMessage).toEqual('Length of Consumer Address should not exceed 100!');
    });
    it('testing on focusValidate function with undefined input', function () {
        scope.meterdetails.contactNumber = undefined;
        scope.meterCreation = { "contactNumber": {} };
        scope.focusValidate('contactNumber');
        expect(scope.errorcontactNumber).toBeTruthy();
    });
    it('testing on focusValidate function with value and parameter is contactNumber', function () {
        scope.meterdetails = {}
        scope.meterdetails.contactNumber = 222;
        scope.meterCreation = { "contactNumber": {} };
        scope.focusValidate('contactNumber');
        expect(scope.errorcontactNumber).toBeFalsy();
    });
    it('testing on focusValidate function with value length should be 15 and parameter is contactNumber', function () {
        scope.meterdetails.contactNumber = 'jhgghzdsadasdasdasdasdasdsadsadsadasdsadasdasdasdasdasdasdsadaggh';
        scope.meterCreation = { "contactNumber": {} };
        scope.focusValidate('contactNumber');
        expect(scope.errorcontactNumberMessage).toEqual('Contact Number should be 15!');
    });
    it('testing on focusValidate function with undefined input', function () {
        scope.meterdetails.impulseCountKW = undefined;
        scope.meterCreation = { "impulseCountKW": {} };
        scope.focusValidate('impulseCountKW');
        expect(scope.errorimpulseCountKW).toBeTruthy();
    });
    it('testing on focusValidate function with value and parameter is impulseCountKW', function () {
        scope.meterdetails = {}
        scope.meterdetails.impulseCountKW = 222;
        scope.meterCreation = { "impulseCountKW": {} };
        scope.focusValidate('impulseCountKW');
        expect(scope.errorimpulseCountKW).toBeFalsy();
    });
    it('testing on focusValidate function with value length 9 and parameter is impulseCountKW', function () {
        scope.meterdetails.impulseCountKW = 'jhgghzdsadasdasdasdasdasdsadsadsadasdsadasdasdasdasdasdasdsadaggh';
        scope.meterCreation = { "impulseCountKW": {} };
        scope.focusValidate('impulseCountKW');
        expect(scope.errorimpulseCountKWMessage).toEqual('Length of Impulse Count (per kWh) should not exceed 8!');
    });
    it('testing on focusValidate function with undefined input', function () {
        scope.meterdetails.impulseCountKV = undefined;
        scope.meterCreation = { "impulseCountKV": {} };
        scope.focusValidate('impulseCountKV');
        expect(scope.errorimpulseCountKV).toBeTruthy();
    });
    it('testing on focusValidate function with value and parameter is impulseCountKV', function () {
        scope.meterdetails = {}
        scope.meterdetails.impulseCountKV = 222;
        scope.meterCreation = { "impulseCountKV": {} };
        scope.focusValidate('impulseCountKV');
        expect(scope.errorimpulseCountKV).toBeFalsy();
    });
    it('testing on focusValidate function with value length 9 and parameter is impulseCountKV', function () {
        scope.meterdetails.impulseCountKV = 'jhgghzdsadasdasdasdasdasdsadsadsadasdsadasdasdasdasdasdasdsadaggh';
        scope.meterCreation = { "impulseCountKV": {} };
        scope.focusValidate('impulseCountKV');
        expect(scope.errorimpulseCountKVMessage).toEqual('Length of Impulse Count Impulse Count  should not exceed 8!');
    });
    it('testing on focusValidate function with undefined input', function () {
        scope.meterdetails.consumerCountry = undefined;
        scope.meterCreation = { "consumerCountry": {} };
        scope.focusValidate('consumerCountry');
        expect(scope.errorconsumerCountry).toBeTruthy();
    });
    it('testing on focusValidate function with value and parameter is consumerCountry', function () {
        scope.meterdetails = {}
        scope.meterdetails.consumerCountry = 222;
        scope.meterCreation = { "consumerCountry": {} };
        scope.focusValidate('consumerCountry');
        expect(scope.errorconsumerCountry).toBeFalsy();
    });
    it('testing on focusValidate function with value length 50 and parameter is consumerCountry', function () {
        scope.meterdetails.consumerCountry = 'jhgghzdsadasdasdjhgghzdsadasdasdasdasdasdsadsadsadasdsadasdasdasdasdasdasdsadagghasdasdasdsadsadsadasdsadasdasdasdasdasdasdsadaggh';
        scope.meterCreation = { "consumerCountry": {} };
        scope.focusValidate('consumerCountry');
        expect(scope.errorconsumerCountryMessage).toEqual('Length of Country should not exceed 50!');
    });

    it('testing on focusValidate function with undefined input', function () {
        scope.meterdetails.consumerCity = undefined;
        scope.meterCreation = { "consumerCity": {} };
        scope.focusValidate('consumerCity');
        expect(scope.errorconsumerCity).toBeTruthy();
    });
    it('testing on focusValidate function with value and parameter is consumerCity', function () {
        scope.meterdetails = {}
        scope.meterdetails.consumerCity = 'mys';
        scope.meterCreation = { "consumerCity": {} };
        scope.focusValidate('consumerCity');
        expect(scope.errorconsumerCity).toBeFalsy();
    });
    it('testing on focusValidate function with value length 50 and parameter is consumerCity', function () {
        scope.meterdetails.consumerCity = 'jhgghzdsadasdasdjhgghzdsadasdasdasdasdasdsadsadsadasdsadasdasdasdasdasdasdsadagghasdasdasdsadsadsadasdsadasdasdasdasdasdasdsadaggh';
        scope.meterCreation = { "consumerCity": {} };
        scope.focusValidate('consumerCity');
        expect(scope.errorconsumerCityMessage).toEqual('Length of City should not exceed 50!');
    });
    it('testing on focusValidate function with undefined input', function () {
        scope.meterdetails.ctRatio = undefined;
        scope.meterCreation = { "ctRatio": {} };
        scope.focusValidate('ctRatio');
        expect(scope.errorctRatio).toBeTruthy();
    });
    it('testing on focusValidate function with value and parameter is ctRatio', function () {
        scope.meterdetails = {}
        scope.meterdetails.ctRatio = 'mys';
        scope.meterCreation = { "ctRatio": {} };
        scope.focusValidate('ctRatio');
        expect(scope.errorctRatio).toBeFalsy();
    });
    it('testing on focusValidate function with value length 20 and parameter is ctRatio', function () {
        scope.meterdetails.ctRatio = 'dsadasdsadasdasdasdasdasdasdsadaggh';
        scope.meterCreation = { "ctRatio": {} };
        scope.focusValidate('ctRatio');
        expect(scope.errorctRatioMessage).toEqual('Length of CT Ratio should not exceed 20!');
    });
    it('testing on focusValidate function with undefined input', function () {
        scope.meterdetails.ptRatio = undefined;
        scope.meterCreation = { "ptRatio": {} };
        scope.focusValidate('ptRatio');
        expect(scope.errorptRatio).toBeTruthy();
    });
    it('testing on focusValidate function with value and parameter is ptRatio', function () {
        scope.meterdetails = {}
        scope.meterdetails.ptRatio = 'mys';
        scope.meterCreation = { "ptRatio": {} };
        scope.focusValidate('ptRatio');
        expect(scope.errorptRatio).toBeFalsy();
    });
    it('testing on focusValidate function with value length 20 and parameter is ptRatio', function () {
        scope.meterdetails.ptRatio = 'jhgghzdsadasdasdjhgghzdsadasdasdasdasdasdsadsadsadasdsadasdasdasdasdasdasdsadagghasdasdasdsadsadsadasdsadasdasdasdasdasdasdsadaggh';
        scope.meterCreation = { "ptRatio": {} };
        scope.focusValidate('ptRatio');
        expect(scope.errorptRatioMessage).toEqual('Length of PT Ratio should not exceed 20!');
    });
    it('testing on focusValidate function with undefined input', function () {
        scope.meterdetails.gprs = undefined;
        scope.meterCreation = { "gprs": {} };
        scope.focusValidate('gprs');
        expect(scope.errorgprs).toBeTruthy();
    });
    it('testing on focusValidate function with value and parameter is gprs', function () {
        scope.meterdetails = {}
        scope.meterdetails.gprs = 'mys';
        scope.meterCreation = { "gprs": {} };
        scope.focusValidate('gprs');
        expect(scope.errorgprs).toBeFalsy();
    });
    it('testing on focusValidate function with value length is more than 30 and parameter is gprs', function () {
        scope.meterdetails.gprs = 'jhgghzdsadasdasdjhgghzdsadasdasdasdasdasdsadsadsadasdsadasdasdasdasdasdasdsadagghasdasdasdsadsadsadasdsadasdasdasdasdasdasdsadaggh';
        scope.meterCreation = { "gprs": {} };
        scope.focusValidate('gprs');
        expect(scope.errorgprsMessage).toEqual('Length of GPRS should not exceed 30!');
    });
    it('testing on focusValidate function with undefined input', function () {
        scope.meterdetails.latitude = undefined;
        scope.meterCreation = { "latitude": {} };
        scope.focusValidate('latitude');
        expect(scope.errorlatitude).toBeTruthy();
    });
    it('testing on focusValidate function with value and parameter is latitude', function () {
        scope.meterdetails = {}
        scope.meterdetails.latitude = 2.777;
        scope.meterCreation = { "latitude": {} };
        scope.focusValidate('latitude');
        expect(scope.errorlatitude).toBeFalsy();
    });
    it('testing on focusValidate function with value 100 and parameter is latitude', function () {
        scope.meterdetails.latitude = 100;
        scope.meterCreation = { "latitude": {} };
        scope.focusValidate('latitude');
        expect(scope.errorlatitudeMessage).toEqual('Invalid Latitude! The range of latitude is 0 to +/- 90');
    });
    it('testing on focusValidate function with undefined input', function () {
        scope.meterdetails.longitude = undefined;
        scope.meterCreation = { "longitude": {} };
        scope.focusValidate('longitude');
        expect(scope.errorlongitude).toBeTruthy();
    });
    it('testing on focusValidate function with value and parameter is longitude', function () {
        scope.meterdetails = {}
        scope.meterdetails.longitude = 2.777;
        scope.meterCreation = { "longitude": {} };
        scope.focusValidate('longitude');
        expect(scope.errorlongitude).toBeFalsy();
    });
    it('testing on focusValidate function with value is 200 and parameter is longitude', function () {
        scope.meterdetails.longitude = 181;
        scope.meterCreation = { "longitude": {} };
        scope.focusValidate('longitude');
        expect(scope.errorlongitudeMessage).toEqual('Invalid Longitude! The range of longitude is 0 to +/- 180');
    });
    it('testing on focusValidate function with undefined input', function () {
        scope.meterdetails.wifiMacId = undefined;
        scope.meterCreation = { "wifiMacId": {} };
        scope.focusValidate('wifiMacId');
        expect(scope.errorwifiMacId).toBeTruthy();
    });
    it('testing on focusValidate function with value and parameter is wifiMacId', function () {
        scope.meterdetails = {}
        scope.meterdetails.wifiMacId = '68:9e:19:d1:25:2f';
        scope.meterCreation = { "wifiMacId": {} };
        scope.focusValidate('wifiMacId');
        expect(scope.errorwifiMacId).toBeFalsy();
    });
    it('testing on focusValidate function with value is 200 and parameter is wifiMacId', function () {
        scope.meterdetails.wifiMacId = '68:9e:19:d1:25:2fjjhjhjhkjhjkhjkjhjhjhkjhjkhjkhkh';
        scope.meterCreation = { "wifiMacId": {} };
        scope.focusValidate('wifiMacId');
        expect(scope.errorwifiMacIdMessage).toEqual('Invalid Wifi MAC ID!');
    });
    it('testing on focusValidate function with undefined input', function () {
        scope.meterdetails.wifiIpAdd = undefined;
        scope.meterCreation = { "wifiIpAdd": {} };
        scope.focusValidate('wifiIpAdd');
        expect(scope.errorwifiIpAdd).toBeTruthy();
    });
    it('testing on focusValidate function with value and parameter is wifiIpAdd', function () {
        scope.meterdetails = {};
        scope.meterdetails.wifiIpAdd = '192.168.43.1';
        scope.meterCreation = { "wifiIpAdd": {} };
        scope.focusValidate('wifiIpAdd');
        expect(scope.errorwifiIpAdd).toBeFalsy();
    });
    it('testing on focusValidate function with value is 200 and parameter is wifiIpAdd', function () {
        scope.meterdetails.wifiIpAdd = '181444444444444444444444444444444444444444444444444444444444444444';
        scope.meterCreation = { "wifiIpAdd": {} };
        scope.focusValidate('wifiIpAdd');
        expect(scope.errorwifiIpAddMessage).toEqual('Invalid Wifi IP Address!');
    });
    it('testing on focusValidate function with undefined input', function () {
        scope.meterdetails.meterAdminPwd = undefined;
        scope.meterCreation = { "meterAdminPwd": {} };
        scope.focusValidate('meterAdminPwd');
        expect(scope.errormeterAdminPwd).toBeTruthy();
    });
    it('testing on focusValidate function with value and parameter is meterAdminPwd', function () {
        scope.meterdetails = {};
        scope.meterdetails.meterAdminPwd = 'sdsdfsdfsdfsd';
        scope.meterCreation = { "meterAdminPwd": {} };
        scope.focusValidate('meterAdminPwd');
        expect(scope.errormeterAdminPwd).toBeTruthy();
    });
    it('testing on focusValidate function with value is 200 and parameter is meterAdminPwd', function () {
        scope.meterdetails.meterAdminPwd = '181444444444444444444444444444444444444444444444444444444444444444';
        scope.meterCreation = { "meterAdminPwd": {} };
        scope.focusValidate('meterAdminPwd');
        expect(scope.errormeterAdminPwdMessage).toEqual('Length of Meter Admin Password should be 20!');
    });
    it('testing on focusValidate function with undefined input', function () {
        scope.meterdetails.wifiAccessPwd = undefined;
        scope.meterCreation = { "wifiAccessPwd": {} };
        scope.focusValidate('wifiAccessPwd');
        expect(scope.errorwifiAccessPwd).toBeTruthy();
    });
    it('testing on focusValidate function with value and parameter is wifiAccessPwd', function () {
        scope.meterdetails = {};
        scope.meterdetails.wifiAccessPwd = 'sdsdfs33';
        scope.meterCreation = { "wifiAccessPwd": {} };
        scope.focusValidate('wifiAccessPwd');
        expect(scope.errorwifiAccessPwd).toBeFalsy();
    });
    it('testing on focusValidate function with value length is 6 and parameter is wifiAccessPwd', function () {
        scope.meterdetails.wifiAccessPwd = '55555';
        scope.meterCreation = { "wifiAccessPwd": {} };
        scope.focusValidate('wifiAccessPwd');
        expect(scope.errorwifiAccessPwdMessage).toEqual('Length of password should between 8 to 20!');
    });
    it('testing on focusValidate function with undefined input', function () {
        scope.meterdetails.consumerZipcode = undefined;
        scope.meterCreation = { "consumerZipcode": {} };
        scope.focusValidate('consumerZipcode');
        expect(scope.errorconsumerZipcode).toBeTruthy();
    });
    it('testing on focusValidate function with value and parameter is consumerZipcode', function () {
        scope.meterdetails = {};
        scope.meterdetails.consumerZipcode = 44444;
        scope.meterCreation = { "consumerZipcode": {} };
        scope.focusValidate('consumerZipcode');
        expect(scope.errorconsumerZipcode).toBeFalsy();
    });
    it('testing on focusValidate function with value is 44444444 and parameter is consumerZipcode', function () {
        scope.meterdetails.consumerZipcode = '577575754747457547474';
        scope.meterCreation = { "consumerZipcode": {} };
        scope.focusValidate('consumerZipcode');
        expect(scope.errorconsumerZipcodeMessage).toEqual('Zipcode length should be 6!');
    });
    it('testing on focusValidate function with  parameter is billingTime', function () {
        scope.meterdetails={billingTime:undefined};
        scope.focusValidate(undefined);
    });
    it('testing on focusValidate function with  parameter is billingTime', function () {
        scope.meterdetails={billingTime:'3:45'};
        scope.focusValidate('billingTime');
    });  
    it('testing on clear billingTime', function () {
        scope.clear();
        scope.billingTime='';
    }); 
});





  
