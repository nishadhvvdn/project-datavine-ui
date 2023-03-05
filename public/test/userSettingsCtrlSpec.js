'use strict';
//objCacheDetails.userDetails={userID:2};
describe('userSettingsCtrl testing', function () {

    var scope, userSettingsCtrl,httpBackend,initService,uibModal, state, ToolsService,Refreshservice;


    beforeEach(angular.mock.module('dataVINEApp'));
    beforeEach(function () {
        inject(function ($injector, $controller, $rootScope,$sessionStorage,$httpBackend) {
            scope = $rootScope.$new(); //scope = $injector.get('$rootScope')
            state = $injector.get('$state');
            uibModal = $injector.get('$uibModal');
            ToolsService = $injector.get('toolsService');
            Refreshservice = $injector.get('refreshservice');
            initService = $injector.get('InitService');
            $sessionStorage.put('loginName','a');
            $sessionStorage.put('password','a');
          
            objCacheDetails = {
                userDetails : {
                     userID : 2
                }
            };
            objCacheDetails.webserviceUrl = '/'; 
            objCacheDetails.endpoints = {
                'UserSettings': {
                    'name': 'UserSettings',
                    "method": "post"
                },
                'UpdateUserSettings': {
                    'name': 'UpdateUserSettings',
                    "method": "post"
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
            httpBackend.whenPOST('/UserSettings')
                .respond(function(method, url, data, headers){
                  var res={type:true,'Details':[{FirstName:'delta'}]};
                    return [200,res,{}];
                    
            }); 

            scope.dynamicPopover = {
                    isOpen : false
            };                     
            userSettingsCtrl = $controller('userSettingsCtrl', {
                'initService':initService,
                '$scope': scope,
                '$state': state,
                'toolsService': ToolsService,
                '$uibModal': uibModal,
                'refreshservice':Refreshservice
            });
        }); // end of inject
    }); // end of beforeEach

    it('first testcase', function () {
        //console.log('reached inside', scope.isCollapsed);
        expect(true).toBe(true);

    });
    it('testing init function', function () {
        httpBackend.flush();
        expect(scope.firstName).toEqual('delta');
        //expect(scope.changePass.length).toBe(6);
    }); 
    it('testing for changePassWord function', function () {
        scope.homePage='homepage';
        // scope.GetValue(); 
        scope.changePassWord();
    });
        
    // it('testing for submit function', function () {
    //     httpBackend.whenPOST('/UpdateUserSettings')
    //         .respond(function(method, url, data, headers){
    //             var res={type:true,'Details':[{FirstName:'delta'}]};
    //             return [200,res,{}];
                    
    //     });
    //     scope.countryModel = "aa",
    //         scope.timezoneModel = "bb";

    //     var usedID = 'delta';
    //     scope.firstName = 'd', scope.lastNam = 'dd', scope.email = 'dd', scope.homePage = 'ddd', scope.oldPswd = 'dddd'
    //     scope.submit();
    //     httpBackend.flush();
    //     //expect(true).toBe(true)

    // });

});
