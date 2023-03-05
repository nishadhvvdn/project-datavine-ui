'use strict';
describe('importConfigurationCtrl testing', function () {

    //var $scope, $controller;
    var scope,commonService, importConfigurationCtrl,fileUpload,modalInstanceMock,timeout,uibModal,httpBackend, state, hypersproutMgmtService;


    beforeEach(angular.mock.module('dataVINEApp'));
    beforeEach(function () {
        inject(function ($injector, $controller, $rootScope,$sessionStorage,$httpBackend) {

            scope = $rootScope.$new(); //scope = $injector.get('$rootScope')
            state = $injector.get('$state');
            modalInstanceMock = {
                dismiss: function (result) {

                },
                open:function(result){

                }
            };
            $sessionStorage.put('loginName','a');
            $sessionStorage.put('password','a');
            objCacheDetails.webserviceUrl = '/'; 
            objCacheDetails.endpoints = {
                'HSMConfImportConfSave': {
                    'name': 'HSMConfImportConfSave',
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
            spyOn(state, 'reload');                          
            spyOn(modalInstanceMock, "dismiss","open");
            hypersproutMgmtService = $injector.get('hypersproutMgmtService');
            uibModal = $injector.get('$uibModal');
            timeout = $injector.get('$timeout');
            fileUpload = $injector.get('fileUpload');
            commonService = $injector.get('commonService');
            var data=[{'Device Class':'d'}];
            importConfigurationCtrl = $controller('importConfigurationCtrl', {
                '$scope': scope,
                'fileUpload':fileUpload,
                '$modalInstance':modalInstanceMock,
                '$uibModal':uibModal,
                '$timeout':timeout,
                '$state': state,
                'hypersproutMgmtService': hypersproutMgmtService,
                'data':data,
                'commonService':commonService,
                'type':'HyperSprout'
            });
        }); // end of inject
    });
    it('testing openNewConfiguration function', function () {
        scope.openNewConfiguration();
    });  
    // it('positive testing for checkfileExtension function', function () {
    //     var obj={"name":'conf.txt'};
    //     scope.checkfileExtension(obj);
    //     expect(scope.errMessage).toEqual('');
    // });
    // it('negetive testing for checkfileExtension function', function () {
    //     var obj={"name":'conf.doc'};
    //     scope.checkfileExtension(obj);
    //     expect(scope.errMessage).toEqual('Select files only with .txt extension');
    // });         
    it('testing cancel  function', function () {
        scope.cancel();
        expect(modalInstanceMock.dismiss).toHaveBeenCalled();
    });       
    it('testing uploadFile function', function () {
        scope.selectedTestGroup={};
        scope.selectedTestGroup.Name='g1';
        scope.fileContent={"content":'sadsadsadsa'}
        httpBackend.whenPOST('/HSMConfImportConfSave')
           .respond(function(method, url, data, headers){
              var res={};
              return [200,res,{}];      
        });         
        scope.uploadFile();
        httpBackend.flush();
       expect(scope.imports[1].value).toEqual('g1')
    });
    it('testing for print function', function () {
        window.print();
        scope.printCart ();
        //expect(true).toBe(true);
    });
    
                                            
});  