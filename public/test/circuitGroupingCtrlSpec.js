'use strict';

describe('circuitGroupingCtrl testing', function () {

    var scope, circuitGroupingCtrl,httpBackend,uibModal, state,timeout,filter,deviceService,refreshservice;


    beforeEach(angular.mock.module('dataVINEApp'));

    beforeEach(function () {
        inject(function ($injector, $controller, $rootScope,$sessionStorage,$httpBackend) {
            objCacheDetails.data={"selectedData":{'circuitId':1}};
            scope = $rootScope.$new();
            uibModal = $injector.get('$uibModal');
            state = $injector.get('$state');
            timeout = $injector.get('$timeout');
            filter = $injector.get('$filter');
            deviceService = $injector.get('DeviceService'); 
            refreshservice = $injector.get('refreshservice');
            $sessionStorage.put('loginName', 'a');
            $sessionStorage.put('password', 'a');
            objCacheDetails.webserviceUrl = '/';
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
            objCacheDetails.endpoints = {
                'DisplayAllCircuitDetails': {
                    'name': 'DisplayAllCircuitDetails',
                    "method": "GET"
                }
            };
            httpBackend=$httpBackend;
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
            httpBackend.whenGET('/DisplayAllCircuitDetails')
                .respond(function(method, url, data, headers){
                    var saveRes={"type":true,"CircuitDetailSelected":[{"_id":"586b4f30aba3ab7ffe795eaf","CircuitID":"Lab5_TestBench","CircuitNumber":1,"KVARating":"5000","SubstationID":"123","SubstationName":"Airoli","Address":"Airoli","Country":"India","State":"Maharstra","City":"Navi Mumbai","ZipCode":"400708","Latitude":"19.16315","Longitude":"73.000501","CircuitNote":"","Status":"","NoOfTransformerAllocated":4},{"_id":"586b6397aba3ab7ffe795ec0","CircuitID":"CRAIROLI","CircuitNumber":2,"KVARating":"600","SubstationID":"456","SubstationName":"Airoli","Address":"Airoli","Country":"India","State":"Maharashtra","City":"Navi Mumbai","ZipCode":"400708","Latitude":"19.16332","Longitude":"73.000506","CircuitNote":"","Status":"","NoOfTransformerAllocated":1},{"_id":"586b63ccaba3ab7ffe795ec1","CircuitID":"CRPOWAI","CircuitNumber":3,"KVARating":"800","SubstationID":"789","SubstationName":"Powai","Address":"Powai","Country":"India","State":"Maharashtra","City":"Mumbai","ZipCode":"400074","Latitude":"19.126597","Longitude":"72.893179","CircuitNote":"","Status":"","NoOfTransformerAllocated":1},{"_id":"586b6941aba3ab7ffe795ec2","CircuitID":"CRTEST","CircuitNumber":4,"KVARating":"500","SubstationID":"1234","SubstationName":"Test","Address":"Test","Country":"India","State":"Maharashtra","City":"Navi Mumbai","ZipCode":"400708","Latitude":"19.1626","Longitude":"73.0005","CircuitNote":"","Status":"","NoOfTransformerAllocated":2},{"_id":"5870920c71031e58af26390a","CircuitID":"lfdgjklfd","CircuitNumber":5,"KVARating":"32444","SubstationID":"1","SubstationName":"1","Address":"1","Country":"jksdlhfjksd","State":"ksdjhkja","City":"jksdhjk","ZipCode":"266464","Latitude":"12","Longitude":"14","CircuitNote":"","Status":"","NoOfTransformerAllocated":2},{"_id":"58905d10528521f2c64f9fda","CircuitID":"Lnt","CircuitNumber":6,"KVARating":"1","SubstationID":"Mysore","SubstationName":"Lnt","Address":"Hebbal","Country":"India","State":"Karnataka","City":"Mysore","ZipCode":"482330","Latitude":"10","Longitude":"14","CircuitNote":"","Status":"","NoOfTransformerAllocated":0},{"_id":"5891dd03528521f2c64fa060","CircuitID":"54","CircuitNumber":7,"KVARating":"54","SubstationID":"54","SubstationName":"54","Address":"54","Country":"54","State":"54","City":"54","ZipCode":"54","Latitude":"54","Longitude":"54","CircuitNote":"54","Status":"","NoOfTransformerAllocated":-2},{"_id":"5891dd03528521f2c64fa061","CircuitID":"65","CircuitNumber":8,"KVARating":"65","SubstationID":"65","SubstationName":"65","Address":"65","Country":"65","State":"65","City":"65","ZipCode":"65","Latitude":"65","Longitude":"65","CircuitNote":"65","Status":"","NoOfTransformerAllocated":0},{"_id":"5891dd03528521f2c64fa062","CircuitID":"76","CircuitNumber":9,"KVARating":"76","SubstationID":"76","SubstationName":"76","Address":"76","Country":"76","State":"76","City":"76","ZipCode":"76","Latitude":"76","Longitude":"76","CircuitNote":"76","Status":"","NoOfTransformerAllocated":0},{"_id":"589b1ad3528521f2c64fa0ee","CircuitID":"87","CircuitNumber":10,"KVARating":"87","SubstationID":"87","SubstationName":"87","Address":"87","Country":"87","State":"87","City":"87","ZipCode":"87","Latitude":"87","Longitude":"87","CircuitNote":"87","Status":"","NoOfTransformerAllocated":0}]};
                    return [200,saveRes,{}];
            });            
            circuitGroupingCtrl = $controller('circuitGroupingCtrl', {
                '$scope': scope,
                '$uibModal': uibModal,
                '$state': state,
                '$rootScope':$rootScope,
                '$timeout': timeout,
                '$filter':filter,
                'deviceService': deviceService,
                'refreshservice': refreshservice                          
            });
        });
    });

    it('testing for grid function', function () {
        scope.circuitGroupingOptions .exporterPdfFooter(2, 15);
        var obj = { "styles": { "headerStyle": {} } };
        scope.circuitGroupingOptions .exporterPdfCustomFormatter(obj);
        expect(true).toBe(true);
    });
    it('test for ', function () {
        httpBackend.flush();
        expect(scope.circuitGroupingOptions.data[0].circuitId).toEqual('Lab5_TestBench');
    });    
    it('test for viewCircuitInfo', function () {
        circuitGroupingCtrl.viewCircuitInfo({entity:{id:2}});
        expect(objCacheDetails.data.selectedData.id).toBe(2);
    });   
    it('test for mapTransformerInfo', function () {
        circuitGroupingCtrl.mapTransformerInfo({entity:{circuitId:2}});
        expect(objCacheDetails.data.selectedCircuit).toBe(2);
    });  
    it('test for mapTransformerInfo', function () {
            httpBackend.whenGET('/DisplayAllCircuitDetails')
                .respond(function(method, url, data, headers){
                    var saveRes={"type":true,"CircuitDetailSelected":[{"_id":"586b4f30aba3ab7ffe795eaf","CircuitID":"Lab5_TestBench","CircuitNumber":1,"KVARating":"5000","SubstationID":"123","SubstationName":"Airoli","Address":"Airoli","Country":"India","State":"Maharstra","City":"Navi Mumbai","ZipCode":"400708","Latitude":"19.16315","Longitude":"73.000501","CircuitNote":"","Status":"","NoOfTransformerAllocated":4},{"_id":"589b1ad3528521f2c64fa0ee","CircuitID":"87","CircuitNumber":10,"KVARating":"87","SubstationID":"87","SubstationName":"87","Address":"87","Country":"87","State":"87","City":"87","ZipCode":"87","Latitude":"87","Longitude":"87","CircuitNote":"87","Status":"","NoOfTransformerAllocated":0}]};
                    return [200,saveRes,{}];
            });     
        httpBackend.flush();       
        scope.searchCircuitGroupingGrid('Lab5_TestBench');
        expect(scope.circuitGroupingOptions.data[0].circuitId).toEqual('Lab5_TestBench');
    });               
});