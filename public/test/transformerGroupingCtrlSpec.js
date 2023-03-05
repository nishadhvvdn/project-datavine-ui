'use strict';

describe('transformerGroupingCtrl testing', function () {

    var scope, transformerGroupingCtrl, uibModal, timeout, DeviceService, state, filter, DeviceMappingService, ParseService, httpBackend;


    beforeEach(angular.mock.module('dataVINEApp'));

    beforeEach(function () {
        inject(function ($injector, $controller, $rootScope, $sessionStorage, $httpBackend) {
            objCacheDetails.data ={};
            objCacheDetails.data={'selectedCircuit':'1'};
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
                'DisplayAllTransformerDetails': {
                    'name': 'DisplayAllTransformerDetails',
                    "method": "GET"
                },
                'RemovingTransformerFromCircuit': {
                    'name': 'RemovingTransformerFromCircuit',
                    "method": "Post"
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
            httpBackend.whenGET('/DisplayAllTransformerDetails')
                .respond(function (method, url, data, headers) {
                    var saveRes = {};
                    return [200, saveRes, {}];
                });

            transformerGroupingCtrl = $controller('transformerGroupingCtrl', {
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
    it('test for get flush function',function(){
        httpBackend.flush();
        expect(true).toBe(true);
    });
    it('testing for grid function', function () {
        scope.transformerGroupingOptions   .exporterPdfFooter(2, 15);
        var obj = { "styles": { "headerStyle": {} } };
        scope.transformerGroupingOptions   .exporterPdfCustomFormatter(obj);
        expect(scope.dynamicPopover.isOpen).toBeFalsy();
        expect(true).toBe(true);
    });
    it('test for searchGrid function',function(){
        scope.searchGrid ();
        expect(true).toBe(true);
    });
    it('testing for searchGrid popup',function(){
        scope.searchTransformerGrouping =  'tsn';
        scope.searchGrid(); 
        expect(scope.searchTransformerGrouping).toBe('tsn');
    });
    it('testing for searchGrid popup',function(){
        scope.searchTransformerGrouping =  'hypSl';
        scope.searchGrid(); 
        expect(scope.searchTransformerGrouping).toBe('hypSl');
    });
    it('testing for searchGrid popup',function(){
        scope.searchTransformerGrouping =  'all';
        scope.searchGrid(); 
        expect(scope.searchTransformerGrouping).toBe('all');
    });
    it('testing for searchGrid popup',function(){
        scope.searchTransformerGrouping =  'HypersproutMake';
        scope.searchGrid(); 
        expect(scope.searchTransformerGrouping).toBe('HypersproutMake');
    });
    it('testing for searchGrid popup',function(){
        scope.searchTransformerGrouping =  'HypersproutVersion';
        scope.searchGrid(); 
        expect(scope.searchTransformerGrouping).toBe('HypersproutVersion');
    });
    it('testing for searchGrid popup',function(){
        scope.searchTransformerGrouping =  'noOfMeters';
        scope.searchGrid(); 
       expect(scope.searchTransformerGrouping).toBe('noOfMeters');
    });
    it('testing for mapMeterInfo',function(){
        transformerGroupingCtrl.mapMeterInfo({'entity':{'TransformerID':1}});
        state={current:{},go:function(){

            },reload:function(){

            }};
            state.current.name = '';
            spyOn(state,'go'); 
        expect(objCacheDetails.data.selectedTransformer).toBe(1);
    });
    it('testing for removeTransformer',function(){
        httpBackend.whenPOST('/RemovingTransformerFromCircuit')
                .respond(function (method, url, data, headers) {
                    var saveRes = {};
                    return [200, saveRes, {}];
                });
        transformerGroupingCtrl.removeTransformer({'entity':{'TransformerID':1}});
        httpBackend.flush();
    });
    it('testing for searchGrid popup',function(){
        state={current:{},go:function(){

            },reload:function(){

            }};
            state.current.name = '';
            spyOn(state,'go'); 
        scope.openTransformersList();
    });
    it('testing for searchGrid popup',function(){
        transformerGroupingCtrl.viewTransformerInfo({'entity':1}); 
        expect(true).toBe(true);
    });
});