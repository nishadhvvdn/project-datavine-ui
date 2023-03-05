'use strict';
var objCacheDetails;
var actionType,obj;
describe('addUserCtrl testing', function () {

    var scope, addUserCtrl,httpBackend,modalInstance, state,modalInstanceMock,AdministrationService;
    actionType='Edit';
    beforeEach(angular.mock.module('dataVINEApp'));

    beforeEach(function () {
        inject(function ($injector, $controller,$rootScope,$sessionStorage,$httpBackend) {
            scope = $rootScope.$new(); //scope = $injector.get('$rootScope')
            state = $injector.get('$state');
            obj={"entity":{"UserID":"admin","Name":"Admin","LastName":"L","E-Mail Address":"abc@gmail.com","Account Locked":"true","HomePage":"Master","Security Group":"Administation","TimeZone":{"countryModel":"India","timezoneModel":"Dheli"}}};

        modalInstanceMock = {
            dismiss: function (result) {
 
            }
        };
            $sessionStorage.put('loginName','a');
            $sessionStorage.put('password','a');            
            objCacheDetails.userDetails={"security_groupName":"Administrator","data":{"configurationDetails":{"selectedRow":{"Name":"config1","Device Class":"unknown","Description":"xyz"}}}};
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
            spyOn(state, 'reload'); 
        AdministrationService=$injector.get('administrationService');
 
        // set up fake methods
        spyOn(modalInstanceMock, "dismiss");
            addUserCtrl = $controller('addUserCtrl', {
                '$scope': scope,
                '$modalInstance': modalInstanceMock,
                '$state': state,
                'administrationService':AdministrationService,
                'actionType':actionType,
                'record':obj,
                'securityGroupDropDown':[],
                'userIdsList':[{"UserID":"admini"}]
            });
        }); // end of inject
    }); // end of beforeEach

    it('testing negetive test case for check', function () {
        scope.userCheck=false;
        scope.check();
        expect(scope.userCheck).toBeFalsy();
        httpBackend.flush();
    });
    it('positive testing in edit mode on save function', function () {
        actionType='Edit'
                    objCacheDetails.endpoints = {
                'EditUser': {
                    'name': 'EditUser',
                    "method": "POST"
                } 
            }; 
        scope.userObj={};
        scope.userObj.userID='a';
        scope.userObj.firstName='delta';
        scope.userObj.lastName='delta2'
        scope.userObj.email='a@gmail.com';
        httpBackend.whenPOST('/EditUser')
            .respond(function(method, url, data, headers){
               var saveRes={Status:"a",type:true};
               return [200,saveRes,{}];
        }); 
        scope.Save();
        httpBackend.flush();
    }); 
    it('negative testing in edit mode on save function', function () {
        actionType='Edit'
        scope.userObj={};
        scope.userObj.userID='a';
        scope.userObj.firstName='delta';
        scope.userObj.lastName='delta2'
        scope.userObj.email='a@gmail.com';
        httpBackend.whenPOST('/EditUser')
            .respond(function(method, url, data, headers){
               return [200,'',{}];
        }); 
        scope.Save();
        httpBackend.flush();
        actionType='Add';
    });     
    it('positive testing in add mode on save function', function () {
        objCacheDetails.endpoints = {
             'AddUser': {
                  'name': 'AddUser',
                  "method": "POST"
              } 
        };
        scope.userObj={};
        scope.userObj.userID='a';
        scope.userObj.firstName='delta';
        scope.userObj.lastName='delta2'
        scope.userObj.email='a@gmail.com';
        httpBackend.whenPOST('/AddUser')
            .respond(function(method, url, data, headers){
               var saveRes={Status:"a",type:true};
               return [200,saveRes,{}];
        }); 
        scope.Save();
        httpBackend.flush();
    }); 
    it('negative testing in add mode on save function', function () {
        objCacheDetails.endpoints = {
             'AddUser': {
                  'name': 'AddUser',
                  "method": "POST"
              } 
        };
        scope.userObj={};
        scope.userObj.userID='a';
        scope.userObj.firstName='delta';
        scope.userObj.lastName='delta2'
        scope.userObj.email='a@gmail.com';
        httpBackend.whenPOST('/AddUser')
            .respond(function(method, url, data, headers){
               return [200,'',{}];
        }); 
        scope.Save();
        httpBackend.flush();
    });     
    it('testin cancel function', function () {
        scope.cancel();
    });    
});
