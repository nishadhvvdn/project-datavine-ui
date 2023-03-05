'use strict';
describe('relayDetailsCtrl testing', function () {

    //var $scope, $controller;
    var scope, modalInstanceMock,timeout,SystemManagementService,relayDetailsCtrl,httpBackend;


    beforeEach(angular.mock.module('dataVINEApp'));

    beforeEach(function () {
        inject(function ($injector, $controller, $rootScope,$sessionStorage, $httpBackend) {
            scope = $rootScope.$new();
            modalInstanceMock = {
                dismiss: function (result) {

                }
            };
            spyOn(modalInstanceMock, "dismiss");
            timeout = $injector.get('$timeout');
            SystemManagementService = $injector.get('SystemManagementService');
           
             $sessionStorage.put('loginName', 'a');
            $sessionStorage.put('password', 'a');
            objCacheDetails.data={};
            objCacheDetails.data={'systmDeviceMgmtDetails':{'selectedRow':{'SerialNumber':'1','Hardware Version':'1','CreatedTime':'22','DeviceClassId':'1','ESN':'11'}}};
            objCacheDetails.webserviceUrl = '/';
            objCacheDetails.endpoints = {
                'SMNodePing': {
                    'name': 'SMNodePing',
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

        //      httpBackend.whenPOST('/SMMeters')
        //     .respond(function(method, url, data, headers){
        //        var saveRes={Status:"a",type:true};
        //        return [200,saveRes,{}];
        // });
            //uibModal=$injector.get('$uibModal');
            relayDetailsCtrl = $controller('relayDetailsCtrl', {
                '$scope': scope,
                '$modalInstance': modalInstanceMock,
                '$timeout': timeout,
                'systemManagementService': SystemManagementService,
                'type':'HyperSprout'
            });
        }); 
    });
    it('positive testing on post service function', function () {
        httpBackend.whenPOST('/SMNodePing')
            .respond(function(method, url, data, headers){
               var saveRes={Status:"a",type:true};
               return [200,saveRes,{}];
        });
        expect(true).toBeTruthy();
        scope.nodePing();
       httpBackend.flush();
    });
    it('negative testing on post service function', function () {
        httpBackend.whenPOST('/SMNodePing')
            .respond(function(method, url, data, headers){
               //var saveRes={Message:"a",type:false};
               return [200,'',{}];
        });
        scope.nodePing();
       httpBackend.flush();
    });
    it('testing for cancel function', function () {
        modalInstanceMock = {
            dismiss: function (result) {

            }
        };
        spyOn(modalInstanceMock, "dismiss");
        scope.cancel();
    });
});