'use strict';
describe('downloadConfigurationCtrl testing', function () {

    var scope, downloadConfigurationCtrl,httpBackend,HypersproutMgmtService,state, modalInstanceMock;


    beforeEach(angular.mock.module('dataVINEApp'));

    beforeEach(function () {
        inject(function ($injector, $controller, $rootScope,$sessionStorage,$httpBackend) {
            scope = $rootScope.$new(); //scope = $injector.get('$rootScope')
            modalInstanceMock = {
                dismiss: function (result) {

                }
            };
            state = $injector.get('$state');
            HypersproutMgmtService = $injector.get('hypersproutMgmtService');
            // set up fake methods
            spyOn(modalInstanceMock, "dismiss");
            $sessionStorage.put('loginName','a');
            $sessionStorage.put('password','a');  
            objCacheDetails.webserviceUrl = '/'; 
            objCacheDetails.endpoints = {
                'HSMConf': {
                    'name': 'HSMConf',
                    "method": "POST"
                },
              'ListDevicesAttached': {
                  'name': 'ListDevicesAttached',
                  "method": "POST"
              },
              'HSMDownDownloadConfSave': {
                  'name': 'HSMDownDownloadConfSave',
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

            httpBackend.whenPOST('/HSMConf')
                .respond(function(method, url, data, headers){
                  var res={'memberInfo':[{Members:2}],"hyperSproutData":[{ConfigName:'abc'}]};
                    return [200,res,{}];
                    
            });             
            downloadConfigurationCtrl = $controller('downloadConfigurationCtrl', {
                '$scope': scope,
                '$modalInstance': modalInstanceMock,
                '$state': state,
                'hypersproutMgmtService': HypersproutMgmtService,
            });
        }); // end of inject
        
    }); 
    it('testing init function', function () {
            //expect(scope.tagOptions.data['Serial Number']).toEqual('123');
        httpBackend.flush();
     
    });
    it('testing LoadListDevicesAttached  function', function () {
            //expect(scope.tagOptions.data['Serial Number']).toEqual('123');
        httpBackend.whenPOST('/ListDevicesAttached')
            .respond(function(method, url, data, headers){
                var res1={SerialNumbers:[2]};
                return [200,res1,{}];
                    
        });  
        scope.LoadListDevicesAttached({ConfId:123});        
        httpBackend.flush();
        expect(scope.HyperSproutList[0].label).toBe(2);
    });
    it('testing downloadConfig function', function () {
            //expect(scope.tagOptions.data['Serial Number']).toEqual('123');
        scope.HyperSproutList=[{id:1,label:2}];
        scope.selectedItems=[{id:1}]    
        httpBackend.whenPOST('/HSMDownDownloadConfSave')
            .respond(function(method, url, data, headers){
                var res1={SerialNumbers:[{HypersproutSerialNumber:2}]};
                return [200,res1,{}];
                    
        });  
        scope.downloadConfig('conf1');        
        httpBackend.flush();
        //expect(scope.HyperSproutList[0].label).toBe(2);
    });         
});    