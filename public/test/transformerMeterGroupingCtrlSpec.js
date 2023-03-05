'use strict';

describe('transformerMeterGroupingCtrl testing', function () {

    var scope, transformerMeterGroupingCtrl, uibModal, timeout, DeviceService, state, filter, DeviceMappingService, ParseService, httpBackend;


    beforeEach(angular.mock.module('dataVINEApp'));

    beforeEach(function () {
        inject(function ($injector, $controller, $rootScope, $sessionStorage, $httpBackend) {
            objCacheDetails.data ={};
            objCacheDetails.data={'selectedCircuit':'1','selectedTransformer':'2'};
            scope = $rootScope.$new();
            uibModal = $injector.get('$uibModal');
            timeout = $injector.get('$timeout');
            state = $injector.get('$state');
            DeviceService = $injector.get('DeviceService');
            filter = $injector.get('$filter');
            DeviceMappingService = $injector.get('DeviceMappingService');
            ParseService = $injector.get('ParseService');

            $sessionStorage.put('loginName', 'a');
            $sessionStorage.put('password', 'a');
            objCacheDetails.webserviceUrl = '/';
            objCacheDetails.endpoints = {
                'SMMeters': {
                    'name': 'SMMeters',
                    "method": "GET"
                },
                'RemovingMeterFromTransformer': {
                    'name': 'RemovingMeterFromTransformer',
                    "method": "post"
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
            httpBackend.whenGET('/SMMeters')
                .respond(function (method, url, data, headers) {
                    var saveRes = {};
                    return [200, saveRes, {}];
                });

            transformerMeterGroupingCtrl = $controller('transformerMeterGroupingCtrl', {
                '$scope': scope,
                '$uibModal': uibModal,
                '$state': state,
                '$rootScope':$rootScope,
                '$filter': filter,
                '$timeout': timeout,
                'DeviceService': DeviceService,
                'ParseService': ParseService,
                'DeviceMappingService': DeviceMappingService
                
            });
        });
    });
    it('test for flush function',function(){
        httpBackend.flush();
        expect(true).toBe(true);
    });
    it('testing for grid function', function () {
        scope.meterGridGrouping  .exporterPdfFooter(2, 15);
        var obj = { "styles": { "headerStyle": {} } };
        scope.meterGridGrouping  .exporterPdfCustomFormatter(obj);
        expect(scope.dynamicPopover.isOpen).toBeFalsy();
        expect(true).toBe(true);
    });
    it('test for searchGrid function',function(){
        scope.searchGrid ();
        expect(true).toBe(true);
    });
     it('testing for searchGrid popup',function(){
        scope.searchMeterGrouping  =  'tsn';
        scope.searchGrid(); 
        expect(scope.searchMeterGrouping).toBe('tsn');
    });
     it('testing for searchGrid popup',function(){
        scope.searchMeterGrouping  =  'hsn';
        scope.searchGrid(); 
        expect(scope.searchMeterGrouping).toBe('hsn');
    });
     it('testing for searchGrid popup',function(){
        scope.searchMeterGrouping  =  'all';
        scope.searchGrid(); 
        expect(scope.searchMeterGrouping).toBe('all');
    });

    it('testing for deleteMeter ',function(){
        httpBackend.whenPOST('/RemovingMeterFromTransformer')
           .respond(function (method, url, data, headers) {
               var saveRes = {};
               return [200, saveRes, {}];
        });        
        transformerMeterGroupingCtrl.deleteMeter({entity:{MeterID:2}});
        httpBackend.flush();
    });
    it('testing for viewMeterInfo',function(){
        transformerMeterGroupingCtrl.viewMeterInfo({'entity':1});
        expect(objCacheDetails.data.selectedData).toBe(1);
    });
    it('testing for removeMeter',function(){
        httpBackend.whenPOST('/RemovingMeterFromTransformer')
                .respond(function (method, url, data, headers) {
                    var saveRes = {};
                    return [200, saveRes, {}];
                });
        transformerMeterGroupingCtrl.removeMeter({'entity':{'MeterID':1}});
        httpBackend.flush();
    });
     it('testing for assignTransformersToCircuit function', function () {
        scope.gridApi={
            selection:{getSelectedRows:function(){
                return [{MeterID:1}]
            }
        }
        }
        httpBackend.whenPOST('/RemovingMeterFromTransformer')
             .respond(function(method, url, data, headers){
                var res={};
                return [200,res,{}];
                    
        });        
       scope.removeSelectedMeter();
        httpBackend.flush();
       expect(scope.gridApi.selection.getSelectedRows()[0].MeterID).toBe(1);
     });   
}); 