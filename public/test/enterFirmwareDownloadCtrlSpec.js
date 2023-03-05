'use strict';
describe('enterFirmwareDownloadCtrl testing', function () {

    var scope, enterFirmwareDownloadCtrl,httpBackend,uibModal,modalInstanceMock,firmwareManagementService;


    beforeEach(angular.mock.module('dataVINEApp'));

    beforeEach(function () {
        inject(function ($injector, $controller, $rootScope,$sessionStorage,$httpBackend) {
            scope = $rootScope.$new(); //scope = $injector.get('$rootScope')
            modalInstanceMock = {
                dismiss: function (result) {

                }
            };
            uibModal = $injector.get('$uibModal');
            firmwareManagementService = $injector.get('firmwareManagementService');
            // set up fake methods
            spyOn(modalInstanceMock, "dismiss");
            $sessionStorage.put('loginName','a');
            $sessionStorage.put('password','a');  
            objCacheDetails.webserviceUrl = '/'; 
            objCacheDetails.endpoints = {
                'FirmwareMgmtFirmGroup': {
                    'name': 'FirmwareMgmtFirmGroup',
                    "method": "POST"
                },
                'FirmwareMgmtFirmGroupSubmit': {
                    'name': 'FirmwareMgmtFirmGroupSubmit',
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
            httpBackend.whenPOST('/FirmwareMgmtFirmGroup')
                .respond(function(method, url, data, headers){
                    var saveRes={'FirmwareDetailsSelected':[{'SerialNumber':1}]};
                return [200,saveRes,{}];
            });                      
            enterFirmwareDownloadCtrl = $controller('enterFirmwareDownloadCtrl', {
                '$scope': scope,
                '$modalInstance': modalInstanceMock,
                '$uibModal':uibModal,
                'type':'HyperSprout',
                'firmwareManagementService': firmwareManagementService,
            });
        }); // end of inject
    }); // end of beforeEach  
    it('testing FirmwareMgmtFirmGroup service call', function () {
        httpBackend.flush();
        expect(scope.selectFirmwareDropDown.length).toBe(1);
    });
    it('testing cancel function', function () {
        scope.cancel();
        expect(modalInstanceMock.dismiss).toHaveBeenCalled();  
    });
    it('testing openImportFirmware function', function () {
        scope.openImportFirmware();
    });    
    it('testing enterFirmwareDownload function', function () {
        var selectedFirmware={'GroupID':1};
        var SelectedGroup={'GroupID':2};
        httpBackend.whenPOST('/FirmwareMgmtFirmGroupSubmit')
            .respond(function(method, url, data, headers){
                var saveRes={'FirmwareJobCreated':{'n':1}};
            return [200,saveRes,{}];
        });         
        scope.enterFirmwareDownload(selectedFirmware,SelectedGroup);
        httpBackend.flush();
        expect(modalInstanceMock.dismiss).toHaveBeenCalled();  
    });  
    it('negetive testing enterFirmwareDownload function', function () {
        var selectedFirmware={'GroupID':1};
        var SelectedGroup={'GroupID':2};
        httpBackend.whenPOST('/FirmwareMgmtFirmGroupSubmit')
            .respond(function(method, url, data, headers){
                var saveRes={'FirmwareJobCreated':{'n':0}};
            return [200,saveRes,{}];
        });         
        scope.enterFirmwareDownload(selectedFirmware,SelectedGroup);
        httpBackend.flush();
        expect(modalInstanceMock.dismiss).toHaveBeenCalled();  
    });            
});
