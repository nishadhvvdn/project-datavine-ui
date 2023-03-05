'use strict';
var objCacheDetails;
describe('addOrEditEndpointCtrl testing', function () {

    var scope, addOrEditEndpointCtrl, httpBackend, modalInstance, state, modalInstanceMock, DeviceService;
    beforeEach(angular.mock.module('dataVINEApp'));

    beforeEach(function () {
        inject(function ($injector, $controller, $rootScope, $sessionStorage, $httpBackend) {
            scope = $rootScope.$new(); 
            state = $injector.get('$state');

            modalInstanceMock = {
                dismiss: function (result) {

                }
            };
            $sessionStorage.put('loginName', 'a');
            objCacheDetails.webserviceUrl = '/';

            objCacheDetails.data={"endpointData":{EndpointID:"2",Owner:'xyz',MacID:5,Description:'abc',CircuitId:'123',circuitList:[{circuitId:"123"}]}};
            
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
            addOrEditEndpointCtrl = $controller('addOrEditEndpoint', {
                '$scope': scope,
                'deviceService': DeviceService,
                'type':'edit',
                '$modalInstance': modalInstanceMock,
                '$state': state
            });
        }); // end of inject
    }); // end of beforeEach
    it('testing saveEndpoint function', function () {
        objCacheDetails.endpoints = {
            'NewEndpointEntry': {
                'name': 'NewEndpointEntry',
                "method": "POST"
            }
        };
        

        httpBackend.whenPOST('/NewEndpointEntry')
            .respond(function (method, url, data, headers) {
                var saveRes = { Status: "a", type: true };
                return [200, saveRes, {}];
            });
        scope.saveEndpointDetails({EndpointID:"2",Owner:'xyz',MacID:5,Description:'abc',circuitSelection:{circuitId:"123"}});
        httpBackend.flush();
        expect(modalInstanceMock.dismiss).toHaveBeenCalled();
    });
    it('testing updateEndpointDetails function', function () {
        scope.endpointDetails={EndpointID:"2",Owner:'xyz',MacID:5,Description:'abc',circuitSelection:{circuitId:"123"}};
        objCacheDetails.endpoints = {
            'EditEndpointDetails': {
                'name': 'EditEndpointDetails',
                "method": "POST"
            }
        };

        httpBackend.whenPOST('/EditEndpointDetails')
            .respond(function (method, url, data, headers) {
                var saveRes = { Status: "a", type: true };
                return [200, saveRes, {}];
            });
        scope.updateEndpointDetails();
        httpBackend.flush();
        expect(modalInstanceMock.dismiss).toHaveBeenCalled();
    });    

     it('testing for cancel ModalWindow  function', function () {
        scope.cancelModalWindow();
        expect(modalInstanceMock.dismiss).toHaveBeenCalled();
    });
});



