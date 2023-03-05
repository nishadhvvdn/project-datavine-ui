'use strict';
var objCacheDetails;
describe('hyperHubRegistrationCtrl testing', function () {

    var scope, hyperHubRegistrationCtrl, ParseService, httpBackend, uibModal, modalInstance, modalInstanceMock, DeviceService;
    beforeEach(angular.mock.module('dataVINEApp'));

    beforeEach(function () {
        inject(function ($injector, $controller, $rootScope, $sessionStorage, $httpBackend) {
            scope = $rootScope.$new(); //scope = $injector.get('$rootScope')
            uibModal = $injector.get('$uibModal');
            httpBackend = $httpBackend;
            modalInstanceMock = {
                dismiss: function (result) {

                }
            };
            objCacheDetails.grid = {
                columnDefs: [],
                enableColumnMenus: false,
                exporterSuppressColumns: ['Action'],
                paginationPageSizes: [15, 30, 45, 60, 75, 90, 100],
                paginationPageSize: 15,
                data: [],
                enableColumnResizing: true,
                enableCellEdit: false,
                gridMenuShowHideColumns: false,
                enableGridMenu: true,
                enableSelectAll: true,
                exporterCsvFilename: 'myFile.csv',
                exporterPdfDefaultStyle: { fontSize: 9 },
                exporterPdfTableStyle: { margin: [30, 30, 30, 30] },
                exporterPdfTableHeaderStyle: { fontSize: 10, bold: true, italics: true, color: 'red' },
                exporterPdfHeader: { text: "Configurations", style: 'headerStyle' },
                exporterPdfFooter: function (currentPage, pageCount) {
                    return { text: currentPage.toString() + ' of ' + pageCount.toString(), style: 'footerStyle' };
                },
                exporterPdfCustomFormatter: function (docDefinition) {
                    docDefinition.styles.headerStyle = { fontSize: 22, bold: true };
                    docDefinition.styles.footerStyle = { fontSize: 10, bold: true };
                    return docDefinition;
                },
                exporterPdfOrientation: 'portrait',
                exporterPdfPageSize: 'LETTER',
                exporterPdfMaxGridWidth: 450,
                exporterCsvLinkElement: angular.element(document.querySelectorAll(".custom-csv-link-location")),
            }            
            $sessionStorage.put('loginName', 'a');
            objCacheDetails.webserviceUrl = '/';
            objCacheDetails.endpoints = {
                'DisplayAllHyperHubDetails': {
                    'name': 'DisplayAllHyperHubDetails',
                    "method": "POST"
                },
                'DeleteHyperHubDetails': {
                    'name': 'DeleteHyperHubDetails',
                    "method": "POST"
                }
            };

            httpBackend.whenPOST('/DisplayAllHyperHubDetails')
                .respond(function (method, url, data, headers) {
                    var saveRes = { type: true, HyperHubDetailSelected: [{ HypersproutID: 1, HardwareVersion: 3, HypersproutSerialNumber: 6, HypersproutName: 'abc', Hypersprout_Communications: { Latitude: 123, Longitude: 3, IP_address_WiFi: 5, AccessPointPassword: 4444, SimCardNumber: 4444444, MAC_ID_GPRS: 4444, MAC_ID_WiFi: 666666 } }] };
                    return [200, saveRes, {}];
                });

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
            DeviceService = $injector.get('DeviceService');
            ParseService = $injector.get('ParseService');

            // set up fake methods
            spyOn(modalInstanceMock, "dismiss");
            hyperHubRegistrationCtrl = $controller('hyperHubRegistrationCtrl', {
                '$scope': scope,
                '$uibModal': uibModal,
                'deviceService': DeviceService,
                'parseService': ParseService
            });
        });
    });
    it('testing initHyperHub function', function () {
        httpBackend.flush();
        expect(true).toBe(true);
    });
    it('testing delete function', function () {
        httpBackend.whenPOST('/DeleteHyperHubDetails')
            .respond(function (method, url, data, headers) {
                var saveRes = { type: true, HyperHubDetailSelected: [{ HypersproutID: 1, HardwareVersion: 3, HypersproutSerialNumber: 6, HypersproutName: 'abc', Hypersprout_Communications: { Latitude: 123, Longitude: 3, IP_address_WiFi: 5, AccessPointPassword: 4444, SimCardNumber: 4444444, MAC_ID_GPRS: 4444, MAC_ID_WiFi: 666666 } }] };
                return [200, saveRes, {}];
            });
        scope.deleteHyperHub({entity:{HyperHubID:2}},'single');
        httpBackend.flush();

    });
    it('testing delete for bulk', function () {
        scope.mySelectedRows=[{HyperHubID:1},{HyperHubID:4}];
        httpBackend.whenPOST('/DeleteHyperHubDetails')
            .respond(function (method, url, data, headers) {
                var saveRes = { type: true, HyperHubDetailSelected: [{ HypersproutID: 1, HardwareVersion: 3, HypersproutSerialNumber: 6, HypersproutName: 'abc', Hypersprout_Communications: { Latitude: 123, Longitude: 3, IP_address_WiFi: 5, AccessPointPassword: 4444, SimCardNumber: 4444444, MAC_ID_GPRS: 4444, MAC_ID_WiFi: 666666 } }] };
                return [200, saveRes, {}];
            });
        scope.deleteHyperHub([],'bulk');
        httpBackend.flush();

    });       
    it('testing createOrEditHyperHub for add', function () {
        scope.uploadHyperHub();
        scope.createOrEditHyperHub('add',undefined);
        expect(objCacheDetails.data.hyperHubData).toBe(undefined);
    });    
    it('testing createOrEditHyperHub for edit', function () {
        scope.createOrEditHyperHub('edit',{entity:{HyperHubID:1}});
        
        expect(objCacheDetails.data.hyperHubData.HyperHubID).toEqual(1);
    }); 
     it('testing  searchGridItems ', function () {
        scope.searchGridItems();
        expect(true).toBe(true);
    });       
});
