'use strict';
var objCacheDetails;
describe('unassignedHyperHubListCtrl testing', function () {

    var scope,filter,unassignedHyperHubListCtrl,DeviceMappingService, ParseService,state, httpBackend, uibModal, modalInstance, modalInstanceMock, DeviceService;
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
                'AddingHyperHubToTransformer': {
                    'name': 'AddingHyperHubToTransformer',
                    "method": "POST"
                }
            };
            objCacheDetails.data={selectedTransformer:2,selectedCircuit:4};
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
            state = $injector.get('$state');
            DeviceMappingService = $injector.get('DeviceMappingService');
            filter = $injector.get('$filter');
            // set up fake methods
            spyOn(modalInstanceMock, "dismiss");
            spyOn(state, "go");
            unassignedHyperHubListCtrl = $controller('unassignedHyperHubListCtrl', {
                '$scope': scope,
                '$uibModal': uibModal,
                '$state':state,
                '$rootScope':$rootScope,
                '$filter':filter,
                'deviceService': DeviceService,
                'parseService': ParseService,
                'deviceMappingService':DeviceMappingService
            });
        });
    });
    it('testing initHyperHub function', function () {
        httpBackend.flush();
        expect(scope.hyperHubUnAssignedGrid.data[0].HyperHubID).toBe(1);
    });

    it('testing AddingHyperHubToTransformer for bulk', function () {
        objCacheDetails.data={selectedTransformer:2,selectedCircuit:4};
        scope.gridApi={
            selection:{getSelectedRows:function(){
                return [{HypersproutID:1},{HypersproutID:1}]
            }
        }
        }
        scope.mySelectedRows=[{HyperHubID:1},{HyperHubID:4}];
        httpBackend.whenPOST('/AddingHyperHubToTransformer')
            .respond(function (method, url, data, headers) {
                var saveRes = { type: true, HyperHubDetailSelected: [{ HypersproutID: 1, HardwareVersion: 3, HypersproutSerialNumber: 6, HypersproutName: 'abc', Hypersprout_Communications: { Latitude: 123, Longitude: 3, IP_address_WiFi: 5, AccessPointPassword: 4444, SimCardNumber: 4444444, MAC_ID_GPRS: 4444, MAC_ID_WiFi: 666666 } }] };
                return [200, saveRes, {}];
            });
        scope.assignHyperHubToTransformer();
        httpBackend.flush();

    });       
    it('testing goBack function', function () {
        scope.goToBack();
        expect(state.go).toHaveBeenCalled();
    }); 
    it('testing searchGridGroupping  function', function () {
        scope.searchGridGroupping(1);
    });        
     
});
