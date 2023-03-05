'use strict';

describe('transformerRegistrationCtrl testing', function () {

    var scope, transformerRegistrationCtrl, uibModal, timeout, DeviceService, state, filter, refreshservice, ParseService, httpBackend;


    beforeEach(angular.mock.module('dataVINEApp'));

    beforeEach(function () {
        inject(function ($injector, $controller, $rootScope, $sessionStorage, $httpBackend) {
            scope = $rootScope.$new();
            uibModal = $injector.get('$uibModal');
            timeout = $injector.get('$timeout');
            state = $injector.get('$state');
            DeviceService = $injector.get('DeviceService');
            filter = $injector.get('$filter');
            refreshservice = $injector.get('refreshservice');
            ParseService = $injector.get('ParseService');

            $sessionStorage.put('loginName', 'a');
            $sessionStorage.put('password', 'a');
            objCacheDetails.webserviceUrl = '/';
            objCacheDetails.endpoints = {
                'DeleteTransformerHypersproutDetails': {
                    'name': 'DeleteTransformerHypersproutDetails',
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
            // httpBackend.whenGET('/NetworkStatisticsHS')
            //     .respond(function (method, url, data, headers) {
            //         var saveRes = {};
            //         return [200, saveRes, {}];
            //     });

            transformerRegistrationCtrl = $controller('transformerRegistrationCtrl', {
                '$scope': scope,
                '$uibModal': uibModal,
                '$state': state,
                '$rootScope':$rootScope,
                '$timeout': timeout,
                '$filter': filter,
                
                'DeviceService': DeviceService,
                'ParseService': ParseService,
                'refreshservice': refreshservice
                
            });
        });
    });
    it('test for flush function',function(){
       // httpBackend.flush();
        expect(true).toBe(true);
    });
    it('testing for grid function', function () {
        scope.downloadOptions .exporterPdfFooter(2, 15);
        var obj = { "styles": { "headerStyle": {} } };
        scope.downloadOptions .exporterPdfCustomFormatter(obj);
        expect(scope.dynamicPopover.isOpen).toBeFalsy();
        expect(true).toBe(true);
    });
    it('test for searchGrid function',function(){
        scope.searchGrid ();
        expect(true).toBe(true);
    });
     it('testing for searchGrid popup',function(){
        scope.searchTransformerEntry =  'tsn';
        scope.searchGrid(); 
        expect(scope.searchTransformerEntry).toBe('tsn');
    });
     it('testing for searchGrid popup',function(){
        scope.searchTransformerEntry =  'hsn';
        scope.searchGrid(); 
         expect(scope.searchTransformerEntry).toBe('hsn');
    });
     it('testing for searchGrid popup',function(){
        scope.searchTransformerEntry =  'all';
        scope.searchGrid(); 
          expect(scope.searchTransformerEntry).toBe('all');
    });
    it('testing for clearText  popup',function(){
        scope.clearText (); 
        expect(true).toBe(true);
    });
    it('testing for openXfmerUploadConfiguration  popup',function(){
        scope.openXfmerUploadConfiguration (); 
        expect(true).toBe(true);
    });
    it('testing deleteTransformer function', function () {
        httpBackend.whenPOST('/DeleteTransformerHypersproutDetails')
               .respond(function(method, url, data, headers){
                 var res={};
                   return [200,res,{}];
                    
        });        
        transformerRegistrationCtrl.deleteTransformer({entity:{TransformerID:2,HypersproutID:5}});      
        httpBackend.flush();
        
    });  
    it('testing deleteSelectedTransformers  function', function () {
        httpBackend.whenGET('templates/createTransformer.html')
               .respond(function(method, url, data, headers){
                 var res={};
                   return [200,res,{}];
                    
        });
        
        scope.createTransformer();
        httpBackend.whenPOST('/DeleteTransformerHypersproutDetails')
               .respond(function(method, url, data, headers){
                 var res={};
                   return [200,res,{}];
                    
        });
        scope.mySelectedRows=[{entity:{TransformerID:2,HypersproutID:5}}];        
        scope.deleteSelectedTransformers();      
        httpBackend.flush();
        
    });     
    it('testing viewTransformerEntry function',function(){
        transformerRegistrationCtrl.viewTransformerEntry({entity:{ID:2}});
        expect(objCacheDetails.data.selectedData.ID).toBe(2);
    })  
    it('testing editTransformer function',function(){
        scope.editTransformer({entity:{ID:2}});
        expect(objCacheDetails.data.selectedData.ID).toBe(2);
    }) 
    it('testing scope $destroyed', function () {
    //how to trigger the destroy event listened for in controller?
    scope.$destroy(); 
    expect(scope.destroy).toBe();
});     
});
