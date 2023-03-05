'use strict';
var objCacheDetails;
describe('newConfigurationCtrl testing', function () {

    var scope, type, newConfigurationCtrl,httpBackend,HypersproutMgmtService, timeout,state, modalInstanceMock,commonService;


    beforeEach(angular.mock.module('dataVINEApp'));

    beforeEach(function () {
        inject(function ($injector, $controller, $rootScope,$sessionStorage,$httpBackend) {
            scope = $rootScope.$new(); //scope = $injector.get('$rootScope')
            timeout = $injector.get('$timeout');
            $sessionStorage.put('loginName','a');
            $sessionStorage.put('password','a');            
            objCacheDetails.userDetails = {};
            objCacheDetails.data = {"configurationDetails": [{ "Name": "Demo" }],"configPrgmData":[{"Name":"conf1"}]};
            objCacheDetails.webserviceUrl = '/'; 
            objCacheDetails.endpoints = {
                'ConfNewConfSave': {
                    'name': 'ConfNewConfSave',
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
            modalInstanceMock = {
                dismiss: function (result) {

                }
            };
            state = $injector.get('$state');
            spyOn(state, 'reload');
            commonService = $injector.get('commonService');
            HypersproutMgmtService = $injector.get('hypersproutMgmtService');
            // set up fake methods
            spyOn(modalInstanceMock, "dismiss");
            newConfigurationCtrl = $controller('newConfigurationCtrl', {
                '$scope': scope,
                '$timeout':timeout,
                '$modalInstance': modalInstanceMock,
                '$state': state,
                'hypersproutMgmtService': HypersproutMgmtService,
                'commonService': commonService,
                'type':'HyperSprout',
            });
        }); // end of inject
    }); // end of beforeEach  
    it('testing check function', function () {
        scope.name='Demo';
        scope.check();
        expect(scope.msg).toEqual('Name already exist!');
        //expect(scope.isCollapsed).toBeFalsy();
    });
    it('testing check function with input as number', function () {
        scope.name='2';
        scope.check();
        expect(scope.name).toBe(undefined);
        //expect(scope.isCollapsed).toBeFalsy();
    });
    it('testing check function with input as special Charecter', function () {
        scope.name='@';
        scope.check();
       expect(scope.specialChar).toBeTruthy();
        //expect(scope.isCollapsed).toBeFalsy();
    });
    it('testing for wordCheck function', function () {
        scope.description= 'hchyjsgfhsdghsdgfhysgfhsgfhseg';
        scope.wordCheck ();
        expect(scope.wordMsg).toBe('A word should not contain more than 20 character');
    });
    
        it('positive testing on check function', function () {
        scope.name='demo1';
        scope.check();
        expect(scope.name).toBe('demo1');
        //expect(scope.isCollapsed).toBeFalsy();
    });
    it('positive testing on check function', function () {
        scope.deviceClass='g1';
        httpBackend.whenPOST('/ConfNewConfSave')
            .respond(function(method, url, data, headers){
               var saveRes={Status:"a",type:true};
               return [200,saveRes,{}];
        }); 
        scope.Save();
        httpBackend.flush();
    }); 
    it('Negetive testing on check function', function () {
        httpBackend.whenPOST('/ConfNewConfSave')
            .respond(function(method, url, data, headers){
               return [200,'',{}];
        }); 
        scope.Save();
        httpBackend.flush();
    });        
});
