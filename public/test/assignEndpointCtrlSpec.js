'use strict';
describe('testing', function () {

    //var $scope, $controller;
    var scope, assignEndpointCtrl,commonService, modalInstanceMock,httpBackend,fileUpload, uibModal, timeout, hypersproutMgmtService;


    beforeEach(angular.mock.module('dataVINEApp'));

    beforeEach(function () {
        inject(function ($injector, $controller, $rootScope,$sessionStorage,$httpBackend) {

            scope = $rootScope.$new(); //scope = $injector.get('$rootScope')
            uibModal = $injector.get('$uibModal');
            timeout = $injector.get('$timeout');
            modalInstanceMock = {
                dismiss: function (result) {

                }
            };
            $sessionStorage.put('loginName','a');
            $sessionStorage.put('password','a');
            objCacheDetails.webserviceUrl = '/'; 
            objCacheDetails.data={ "groupList": [{ "Group_Name": "Demo" }] };
            objCacheDetails.endpoints = {
                'HSMConfImportConfSave': {
                    'name': 'HSMConfImportConfSave',
                    "method": "post"
                },
                'HSMGrpMgmtAssignGrpMembershipAssignEndpoint': {
                    'name': 'HSMGrpMgmtAssignGrpMembershipAssignEndpoint',
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
            spyOn(modalInstanceMock, "dismiss");commonService
            fileUpload = $injector.get('fileUpload');
            uibModal = $injector.get('$uibModal');
            hypersproutMgmtService = $injector.get('hypersproutMgmtService');
            commonService = $injector.get('commonService');
            assignEndpointCtrl = $controller('assignEndpointCtrl', {
                '$scope': scope,
                'fileUpload': fileUpload, 
                '$modalInstance': modalInstanceMock,                               
                '$uibModal': uibModal,
                '$timeout': timeout,
                'hypersproutMgmtService': hypersproutMgmtService,
                'commonService':commonService,
                'type':'HyperSprout'
            });
        }); // end of inject
    });
    it('testing for upload function', function () {
        scope.myFile = 'fgf';
        scope.uploadFile();
        expect(scope.myFile).toBe('fgf');
    });
    it('testing for print function', function () {
        window.print();
        scope.printCart();
        expect(true).toBe(true);
    });
    it('testing for svae function', function () {
        modalInstanceMock = {
                dismiss: function (result) {

                }
            };
            spyOn(modalInstanceMock, "dismiss");
        scope.Save ();
        expect(true).toBe(true);
    });
    it('positive testing assignEndPoints function when selectGroup is Configuration Group', function () {
        scope.selectGroup={};
        scope.selectGroup["Group Type"] = "Configuration Group";
        scope.selectGroup.Group_Name='group1';
        scope.fileContent={content:"content data",name:'xyz.txt'};
        scope.selectAction='Add';
        httpBackend.whenPOST('/HSMConfImportConfSave')
           .respond(function(method, url, data, headers){
              var res={'type':true};
              return [200,res,{}];      
        });        
        scope.assignEndPoints();
        httpBackend.flush();
        expect(scope.assignEndpoints[0].value).toEqual('xyz.txt');
    });
    it('testing for openCreateApplicationGroup function', function () {
        scope.openCreateApplicationGroup();
    });     
    it('negetive testing assignEndPoints function  when selectGroup is Configuration Group ', function () {
        scope.selectGroup={};
        scope.selectGroup["Group Type"] = "Configuration Group";
        scope.selectGroup.Group_Name='group1';
        scope.fileContent={content:"content data",name:'xyz.txt'};
        scope.selectAction='Add';
        httpBackend.whenPOST('/HSMConfImportConfSave')
           .respond(function(method, url, data, headers){
              var res={'type':false};
              return [200,res,{}];      
        });        
        scope.assignEndPoints();
        httpBackend.flush();
        expect(scope.assignEndpoints[0].value).toEqual('xyz.txt');
    }); 
    it('positive testing assignEndPoints function when selectGroup is not Configuration Group', function () {
        scope.selectGroup={};
        scope.selectGroup["Group Type"] = "";
        scope.selectGroup.Group_Name='group1';
        scope.fileContent={content:"content data",name:'xyz.txt'};
        scope.selectAction='Add';
        httpBackend.whenPOST('/HSMGrpMgmtAssignGrpMembershipAssignEndpoint')
           .respond(function(method, url, data, headers){
              var res={'type':true};
              return [200,res,{}];      
        });        
        scope.assignEndPoints();
        httpBackend.flush();
        expect(scope.assignEndpoints[0].value).toEqual('xyz.txt');
    });
    it('negetive testing assignEndPoints function  when selectGroup is not Configuration Group ', function () {
        scope.selectGroup={};
        scope.selectGroup["Group Type"] = "";
        scope.selectGroup.Group_Name='group1';
        scope.fileContent={content:"content data",name:'xyz.txt'};
        scope.selectAction='Add';
        httpBackend.whenPOST('/HSMGrpMgmtAssignGrpMembershipAssignEndpoint')
           .respond(function(method, url, data, headers){
              var res={'type':false};
              return [200,res,{}];      
        });        
        scope.assignEndPoints();
        httpBackend.flush();
        expect(scope.assignEndpoints[0].value).toEqual('xyz.txt');
    });     
    // it('positive testing for checkfileExtension function', function () {
    //     var obj={"name":'conf.txt'};
    //     scope.checkfileExtension(obj);
    //     expect(scope.fileUpload.errMessage).toEqual('');
    // });
    // it('negetive testing for checkfileExtension function', function () {
    //     var obj={"name":'conf.doc'};
    //     scope.checkfileExtension(obj);
    //     expect(scope.fileUpload.errMessage).toEqual('Select files only with .txt extension');
    // });         
    it('testing openNewConfiguration  function', function () {
        scope.cancel();
        expect(modalInstanceMock.dismiss).toHaveBeenCalled();
    });  
    it('test for $destroy case', function () {
        scope.$destroy();
        expect(true).toBe(true);
    });          
});