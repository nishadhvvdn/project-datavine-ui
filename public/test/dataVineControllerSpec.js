'use strict';
describe('testing dataVINECtrl', function () {

    //var $scope, $controller;
    var scope,state,dataVINECtrl,httpBackend,permissionService, uibModal,initService,Refreshservice,http,idle;


    beforeEach(angular.mock.module('dataVINEApp'));

    beforeEach(function () {
        inject(function ($injector, $controller, $rootScope,$httpBackend) {
            scope = $rootScope.$new(); //scope = $injector.get('$rootScope')
            $rootScope.dynamicPopover = {
                open: function open() {
                    $scope.dynamicPopover.isOpen = true;
                },
                close: function close() {
                    $scope.dynamicPopover.isOpen = false;
                }
            };   
            httpBackend=$httpBackend;
            httpBackend.whenGET('pages/login.html')
                .respond(function(method, url, data, headers){
                  var res={};
                    return [200,res,{}];
                    
            });
$rootScope.$broadcast(
    '$stateChangeStart',
    { name: 'master'}, // toState
    {}, // toParams                   
    {name:'login'}, // fromState
    {}  // fromParams
);
            state = $injector.get('$state');
            idle = $injector.get('Idle');
            http = $injector.get('$http');
            initService = $injector.get('InitService');
            Refreshservice = $injector.get('refreshservice');
            permissionService=$injector.get('permissionService');
            dataVINECtrl = $controller('dataVINECtrl', {
                '$rootScope':$rootScope,
                '$scope': scope,
                '$http':http,
                '$state':state,
                'InitService':initService,
                'refreshservice':Refreshservice,
                'Idle':idle
            });
        }); // end of inject
                
    });
    it('testing check function with input as special Charecter', function () {
        state={};
        state.name='login';
       expect(state.name).toBe('login');
        //expect(scope.isCollapsed).toBeFalsy();
    });
});