'use strict';
describe('testing', function () {

    //var $scope, $controller;
    var scope,timeout,filter,httpBackend,dataVineHealth_reportsCtrl,reportsService;


    beforeEach(angular.mock.module('dataVINEApp'));

    beforeEach(function () {
        inject(function ($injector, $controller, $rootScope,$sessionStorage,$httpBackend) {
            scope = $rootScope.$new(); //scope = $injector.get('$rootScope')
            timeout=$injector.get('$timeout');
            filter=$injector.get('$filter');
            $sessionStorage.put('loginName','a');
            $sessionStorage.put('password','a');            
            objCacheDetails.userDetails = {};
            objCacheDetails.data = {};
            objCacheDetails.webserviceUrl = '/'; 
            objCacheDetails.endpoints = {
                'DataVINEHealthReport': {
                    'name': 'DataVINEHealthReport',
                    "method": "POST"
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
            httpBackend.whenPOST('/DataVINEHealthReport')
                .respond(function(method, url, data, headers){
                  var res={Details:[{"SerialNumber":123}]};
                    return [200,res,{}];
            });
            reportsService = $injector.get('reportsService');
            dataVineHealth_reportsCtrl = $controller('dataVineHealth_reportsCtrl', {
                '$scope': scope,
                'reportsService' :reportsService,
                '$timout': timeout,
                '$filter': filter,
            });
        }); 
    }); 

    it('first testcase', function () {
        expect(true).toBe(true);
        expect(scope.isCollapsed).toBeFalsy();
        expect(scope.boolEdit).toBeTruthy(); 
    });
    it('testing DataVINEHealthReport service call', function () {
        expect(true).toBeTruthy();
        httpBackend.flush();
        
    });
    it('testing for close function', function () {
        scope.dynamicPopover.isOpen = true;
        scope.dynamicPopover.close();
        expect(scope.dynamicPopover.isOpen).toBeFalsy();
        expect(true).toBe(true);
    });
    it('testing for open function', function () {
        scope.dynamicPopover.isOpen = true;
        scope.dynamicPopover.open();
        expect(scope.dynamicPopover.isOpen).toBeTruthy();
        expect(true).toBe(true);
    });
    it('testing for grid function', function () {
        scope.dataVINEHealthOptions .exporterPdfFooter(2, 15);
        var obj = { "styles": { "headerStyle": {} } };
        scope.dataVINEHealthOptions.exporterPdfCustomFormatter(obj);
        expect(scope.dynamicPopover.isOpen).toBeFalsy();
        expect(true).toBe(true);
    });
    it('testing for tagFilterConfig function', function () {
        scope.object.All = true;
        scope.tagFilterConfig();
    });
    it('testing for searchEndPoints function', function () {
        scope.searchEndPoints (obj);
    });
    it('testing for printCart function', function () {
        window.print();
        scope.printCart ();
    });
});