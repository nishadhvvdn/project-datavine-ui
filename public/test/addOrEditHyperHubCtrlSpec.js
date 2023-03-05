'use strict';
var objCacheDetails;
describe('addOrEditHyperHubCtrl testing', function () {

    var scope, addOrEditHyperHubCtrl, httpBackend, modalInstance, state, modalInstanceMock, DeviceService;
    beforeEach(angular.mock.module('dataVINEApp'));

    beforeEach(function () {
        inject(function ($injector, $controller, $rootScope, $sessionStorage, $httpBackend) {
            scope = $rootScope.$new(); //scope = $injector.get('$rootScope')
            state = $injector.get('$state');

            modalInstanceMock = {
                dismiss: function (result) {

                }
            };
            $sessionStorage.put('loginName', 'a');
            objCacheDetails.webserviceUrl = '/';
            objCacheDetails.data={"hyperHubData":{HyperHubID:"2",HardwareVersion:3,HubSerialNumber:3333,HubName:'abc',Latitude:2.3,Longitude:3.4,WifiIPAddress:'abc',WifiAccessPointPassword:12345,SimCardNumber:4444444,GprsMacID:44,WifiMacID:5}};
            
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
                .respond(function (method, url, data, headers) {
                    var res = {};
                    return [200, res, {}];

                });
            spyOn(state, 'reload');
            DeviceService = $injector.get('DeviceService');

            // set up fake methods
            spyOn(modalInstanceMock, "dismiss");
            addOrEditHyperHubCtrl = $controller('addOrEditHyperHubCtrl', {
                '$scope': scope,
                'deviceService': DeviceService,
                'type':'edit',
                '$modalInstance': modalInstanceMock,
                '$state': state
            });
        }); // end of inject
    }); // end of beforeEach
    it('testing saveHyperHub function', function () {
        objCacheDetails.endpoints = {
            'NewHyperHubEntry': {
                'name': 'NewHyperHubEntry',
                "method": "POST"
            }
        };

        httpBackend.whenPOST('/NewHyperHubEntry')
            .respond(function (method, url, data, headers) {
                var saveRes = { Status: "a", type: true };
                return [200, saveRes, {}];
            });
        scope.saveHyperHub({HyperHubID:"2",HardwareVersion:3,HubSerialNumber:3333,HubName:'abc',Latitude:2.3,Longitude:3.4,WifiIPAddress:'abc',WifiAccessPointPassword:12345,SimCardNumber:4444444,GprsMacID:44,WifiMacID:5});
        httpBackend.flush();
        expect(modalInstanceMock.dismiss).toHaveBeenCalled();
    });
    it('testing saveHyperHub function', function () {
        objCacheDetails.endpoints = {
            'EditHyperHubDetails': {
                'name': 'EditHyperHubDetails',
                "method": "POST"
            }
        };

        httpBackend.whenPOST('/EditHyperHubDetails')
            .respond(function (method, url, data, headers) {
                var saveRes = { Status: "a", type: true };
                return [200, saveRes, {}];
            });
        scope.updateHyperHub();
        httpBackend.flush();
        expect(modalInstanceMock.dismiss).toHaveBeenCalled();
    }); 

    it('testing for cancel ModalWindow  function', function () {
        scope.cancelModalWindow();
        expect(modalInstanceMock.dismiss).toHaveBeenCalled();
    });   
});
