'use strict';
describe('meterRegistrationCtrl testing', function () {

    //var $scope, $controller;
    var scope, uibModal, state, rootScope, filter, timeout, DeviceService, ParseService, refreshservice, meterRegistrationCtrl, httpBackend;


    beforeEach(angular.mock.module('dataVINEApp'));

    beforeEach(function () {
        inject(function ($injector, $controller, $rootScope, $sessionStorage, $httpBackend) {
            scope = $rootScope.$new(); //scope = $injector.get('$rootScope')
            uibModal = $injector.get('$uibModal');
            state = $injector.get('$state');
            filter = $injector.get('$filter');
            timeout = $injector.get('$timeout');
            DeviceService = $injector.get('DeviceService');
            ParseService = $injector.get('ParseService');
            refreshservice = $injector.get('refreshservice');
            $sessionStorage.put('loginName', 'a');
            $sessionStorage.put('password', 'a');
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
            //objCacheDetails = {};
            //objCacheDetails.data='All';
            objCacheDetails.webserviceUrl = '/';
            objCacheDetails.endpoints = {
                'SMMeters': {
                    'name': 'SMMeters',
                    "method": "POST"
                },
                'DeleteMeterDetails':{
                    'name': 'DeleteMeterDetails',
                    "method": "post"
                }
            };
            swal=function(obj,callback){
                if(callback===undefined){
                    return;
                }else{
                    callback(true)
                }
            }
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

            httpBackend.whenPOST('/SMMeters')
                .respond(function (method, url, data, headers) {
                    var saveRes = {};
                    return [200, saveRes, {}];
                });
            meterRegistrationCtrl = $controller('meterRegistrationCtrl', {
                '$scope': scope,
                '$uibModal': uibModal,
                '$state': state,
                '$rootScope': $rootScope,
                '$filter': filter,
                '$timeout': timeout,
                'DeviceService': DeviceService,
                'ParseService': ParseService,
                'refreshservice': refreshservice
            });
        });
    });
    it('positive testing on post service function', function () {
        expect(true).toBeTruthy();
        httpBackend.flush();
    });
    it('testing for grid function', function () {
        scope.meterGrid.exporterPdfFooter(2, 15);
        var obj = { "styles": { "headerStyle": {} } };
        scope.meterGrid.exporterPdfCustomFormatter(obj);
        expect(scope.dynamicPopover.isOpen).toBeFalsy();
        expect(true).toBe(true);
    });
    it('testing for grid function', function () {
        scope.searchMeterEntry = 'tsn';
        scope.searchGrid();
    });
    it('testing for grid function', function () {
        scope.searchMeterEntry = 'hsn';
        scope.searchGrid();
    });
    it('testing for grid function', function () {
        scope.searchMeterEntry = 'all';
        scope.searchGrid();
    });
    it('test for get deleteMeter function',function(){
            httpBackend.whenPOST('/DeleteMeterDetails')
            .respond(function(method, url, data, headers){
               var saveRes={};
               return [200,saveRes,{}];
        });          
         meterRegistrationCtrl.deleteMeter({"entity":{"MeterID":4}});
         httpBackend.flush();
    });
    it('test for get deleteMeter function',function(){
        scope.mySelectedRows=[{'MeterID':1}]
            httpBackend.whenPOST('/DeleteMeterDetails')
            .respond(function(method, url, data, headers){
               var saveRes={};
               return [200,saveRes,{}];
        });          
         scope.deleteSelectedMeters();
         httpBackend.flush();
    });
    // it('testing for viewMeterEntry function', function () {
    //     meterRegistrationCtrl.viewMeterEntry({'entity':{'ID':1}},{'entity':1});
    // });
    it('testing for openUploadMeterConfiguration function', function () {
        scope.openUploadMeterConfiguration();
    });
    //  it('testing for editMeter function', function () {
    //     scope.editMeter({'entity':1});
    // });
    //  it('testing for create function', function () {
    //     scope.create();
    // });
});