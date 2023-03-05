'use strict';
//objCacheDetails.userDetails={userID:2};
describe('passwordSettingsCtrl testing', function () {

    var scope, passwordSettingsCtrl,httpBackend,state, modalInstanceMock,administrationService;


    beforeEach(angular.mock.module('dataVINEApp'));
    beforeEach(function () {
        inject(function ($injector, $controller, $rootScope,$sessionStorage,$httpBackend) {
            scope = $rootScope.$new(); //scope = $injector.get('$rootScope')
            state = $injector.get('$state');
            administrationService = $injector.get('administrationService');
            $sessionStorage.put('loginName','a');
            $sessionStorage.put('password','a');
            objCacheDetails.webserviceUrl = '/'; 
            modalInstanceMock = {
                dismiss: function (result) {

                }
            };
            objCacheDetails.endpoints = {
                'UpdatedPasswordSettings': {
                    'name': 'UpdatedPasswordSettings',
                    "method": "get"
                },        
                'RestoreDefaultPasswordSettings': {
                    'name': 'RestoreDefaultPasswordSettings',
                    "method": "get"
                },
                'SavePasswordSettings': {
                    'name': 'SavePasswordSettings',
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
            httpBackend.whenGET('/UpdatedPasswordSettings')
                .respond(function(method, url, data, headers){
                  var res={"type":true,"output":[{"_id":"586a51b27e5e887d9176fba2","Type":{"Status":"Updated","Settings":{"MaximumPasswordAge":999,"NumberofPasswordstoStore":4,"MaximumLogonFailuresbeforeLockout":6,"LockoutDuration":4,"MinimumPasswordLength":5,"EnablePasswordPolicy":true}}}]};
                    return [200,res,{}];
                    
            }); 
            spyOn(modalInstanceMock, "dismiss");      
            passwordSettingsCtrl = $controller('passwordSettingsCtrl', {
                '$scope': scope,
                '$modalInstance': modalInstanceMock,
                '$state': state,
                'administrationService':administrationService
            });
        }); // end of inject
    }); // end of beforeEach

    it('testing init function', function () {
        httpBackend.flush();
        expect(scope.minPassLength).toBe(5);
    });
    it('testing cancel function', function () {
        scope.cancel();
        expect(modalInstanceMock.dismiss).toHaveBeenCalled();
    });
    it('Positive testing for restoreDefaults function', function (){
        scope.maxPasswordAge=2;
        scope.passwordsToStore=100;
        scope.logonFailures=3;
        scope.lockoutDuration=5;
        scope.minPassLength=8;
        scope.passwordPolicy=true;
        httpBackend.whenGET('/RestoreDefaultPasswordSettings')
            .respond(function(method, url, data, headers){
                var res={"type":true,"output":[{"_id":"586a51a27e5e887d9176fba1","Type":{"Status":"Default","Settings":{"EnablePasswordPolicy":"false","MinimumPasswordAge":0,"MaximumPasswordAge":999,"NumberofPasswordstoStore":0,"MaximumLogonFailuresbeforeLockout":5,"LockoutDuration":1,"MinimumPasswordLength":6}}}]};
                return [200,res,{}];
                    
        });
        scope.restoreDefaults();
        httpBackend.flush();
        expect(state.reload).toHaveBeenCalled();
        expect(scope.minPassLength).toBe(6);

    });
    it('Negative testing for restoreDefaults function', function (){
        scope.maxPasswordAge=2;
        scope.passwordsToStore=100;
        scope.logonFailures=3;
        scope.lockoutDuration=5;
        scope.minPassLength=8;
        scope.passwordPolicy=true;
        httpBackend.whenGET('/RestoreDefaultPasswordSettings')
            .respond(function(method, url, data, headers){
                var res={"type":false,"Message":'Failed'};
                return [200,res,{}];
                    
        });
        scope.restoreDefaults();
        httpBackend.flush();
        expect(state.reload).toHaveBeenCalled();
    });                     
    it('positive testing for Save function', function (){
        scope.maxPasswordAge=2;
        scope.passwordsToStore=100;
        scope.logonFailures=3;
        scope.lockoutDuration=5;
        scope.minPassLength=8;
        scope.passwordPolicy=true;
        httpBackend.whenPOST('/SavePasswordSettings')
            .respond(function(method, url, data, headers){
                var res={type:true,'output':'success'};
                return [200,res,{}];
                    
        });
        scope.Save();
        httpBackend.flush();
        expect(modalInstanceMock.dismiss).toHaveBeenCalled();
        //expect(true).toBe(true)

    });
    it('negetive testing for Save function', function (){
        scope.maxPasswordAge=2;
        scope.passwordsToStore=100;
        scope.logonFailures=3;
        scope.lockoutDuration=5;
        scope.minPassLength=8;
        scope.passwordPolicy=true;
        httpBackend.whenPOST('/SavePasswordSettings')
            .respond(function(method, url, data, headers){
                var res={type:false,'output':'fail'};
                return [200,res,{}];
                    
        });
        scope.Save();
        httpBackend.flush();
        expect(modalInstanceMock.dismiss).toHaveBeenCalled();
        //expect(true).toBe(true)

    });  
    it('positive test for Save function with parameter minPassLength and value is 7', function (){
        scope.minPassLength=7;
        scope.passValidation = {};
        scope.check('click','minPassLength');
        expect(scope.passValidation.minPassLength).toBeFalsy();
    });  
    it('negative test for Save function with parameter minPassLength and value is 5', function (){
        scope.minPassLength=5;
        scope.passValidation = {};
        scope.check('click','minPassLength');
        expect(scope.passValidation.minPassLength).toBeTruthy();
    });
    it('positive test for Save function with parameter lockoutDuration and value is 3', function (){
        scope.lockoutDuration=3;
        scope.passValidation = {};
        scope.check('click','lockoutDuration');
        expect(scope.passValidation.lockoutDuration).toBeFalsy();
    });  
    it('negative test for Save function with parameter lockoutDuration and value is 0', function (){
        scope.lockoutDuration=0;
        scope.passValidation = {};
        scope.check('click','lockoutDuration');
        expect(scope.passValidation.lockoutDuration).toBeTruthy();
    });    
    it('positive test for Save function with parameter logonFailures and value is 19', function (){
        scope.logonFailures=19;
        scope.passValidation = {};
        scope.check('click','logonFailures');
        expect(scope.passValidation.logonFailures).toBeFalsy();
    });  
    it('negative test for Save function with parameter logonFailures and value is 25', function (){
        scope.logonFailures=25;
        scope.passValidation = {};
        scope.check('click','logonFailures');
        expect(scope.passValidation.logonFailures).toBeTruthy();
    });
    it('positive test for Save function with parameter passwordsToStore and value is 19', function (){
        scope.passwordsToStore=1;
        scope.passValidation = {};
        scope.check('click','passwordsToStore');
        expect(scope.passValidation.passwordsToStore).toBeFalsy();
    });  
    it('negative test for Save function with parameter passwordsToStore and value is 25', function (){
        scope.passwordsToStore=25;
        scope.passValidation = {};
        scope.check('click','passwordsToStore');
        expect(scope.passValidation.passwordsToStore).toBeTruthy();
    }); 
    it('positive test for Save function with parameter maxPasswordAge and value is 10', function (){
        scope.maxPasswordAge=10;
        scope.passValidation = {};
        scope.check('click','maxPasswordAge');
        expect(scope.passValidation.maxPasswordAge).toBeFalsy();
    });  
    it('negative test for Save function with parameter maxPasswordAge and value is 1001', function (){
        scope.maxPasswordAge=1001;
        scope.passValidation = {};
        scope.check('click','maxPasswordAge');
        expect(scope.passValidation.maxPasswordAge).toBeTruthy();
    });                      
 
});
