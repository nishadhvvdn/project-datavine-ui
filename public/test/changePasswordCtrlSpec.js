'use strict';
describe('changePasswordCtrl testing', function () {

    //var $scope, $controller;
    var scope, state,changePasswordCtrl,httpBackend,modalInstanceMock, toolsService,obj,type,controller,administrationService;
type=1
obj={};
obj.userId='Delta';

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
            controller=$controller;
            spyOn(modalInstanceMock, "dismiss");
            state = $injector.get('$state');
            toolsService = $injector.get('toolsService');
            //obj = $injector.get('obj');
            //type = $injector.get('type');
            objCacheDetails.endpoints = {
                'UpdatedPasswordSettings': {
                    'name': 'UpdatedPasswordSettings',
                    "method": "GET"
                } 
            };
            httpBackend.whenGET('/UpdatedPasswordSettings')
                .respond(function(method, url, data, headers){
                    var saveRes={output:[{Type:{Settings:{EnablePasswordPolicy:true,MinimumPasswordLength:6}}}]};
                    return [200,saveRes,{}];
            });
            administrationService = $injector.get('administrationService');
            //uibModal=$injector.get('$uibModal');
            spyOn(state, 'reload'); 
            changePasswordCtrl = $controller('changePasswordCtrl', {
                '$scope': scope,
                '$modalInstance': modalInstanceMock,
                '$state': state,
                'toolsService':toolsService,
                'obj':obj,
                'type':type,
                '$controller':controller,
                'administrationService':administrationService
            });
        }); // end of inject
    });
    it('testing UpdatedPasswordSettings api call functionality', function () {
        httpBackend.flush();
        expect(scope.changePass.length).toBe(6);
    });   
    it('testing save function', function () {
        objCacheDetails.endpoints = {
                'ChangePassword': {
                    'name': 'ChangePassword',
                    "method": "POST"
                } 
        };
        httpBackend.whenPOST('/ChangePassword')
            .respond(function(method, url, data, headers){
                var saveRes={type :true};
                return [200,saveRes,{}];
        });
        scope.Save();
        httpBackend.flush();
       expect(scope.changePass.length).toBe(6);
    }); 
    it('testing cancel function', function () {
        scope.cancel();
        expect(modalInstanceMock.dismiss).toHaveBeenCalled();
    });            
});