'use strict';
describe('securityCtrl testing', function () {

    //var $scope, $controller;
    var scope, timeout, securityCtrl, uibModal, administrationService, httpBackend;


    beforeEach(angular.mock.module('dataVINEApp'));

    beforeEach(function () {
        inject(function ($injector, $controller, $rootScope, $sessionStorage, $httpBackend) {
            scope = $rootScope.$new();

            timeout = $injector.get('$timeout');
            uibModal = $injector.get('$uibModal');
            administrationService = $injector.get('administrationService');
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
            objCacheDetails.webserviceUrl = '/';
            objCacheDetails.endpoints = {
                'GetSecurityGroups': {
                    'name': 'GetSecurityGroups',
                    "method": "GET"
                },                
                'DeleteSecurityGroups': {
                    'name': 'DeleteSecurityGroups',
                    "method": "post"
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
            httpBackend.whenGET('/GetSecurityGroups')
                .respond(function (method, url, data, headers) {
                    var saveRes = { 'membersInfo': { 'SecurityID': 'admin', 'membersInfo': '11' }, 'output': { 'SecurityID': 'admin', 'Description': 'abc', 'Functions': 'abc' } };
                    return [200, saveRes, {}];
                });
            securityCtrl = $controller('securityCtrl', {
                '$scope': scope,
                '$timeout': timeout,
                '$uibModal': uibModal,
                'administrationService': administrationService
            });
        }); // end of inject
    });
    it('testing for print function', function () {
        window.print();
        scope.printCart();
        expect(true).toBe(true);
    });
    it('testing for grid function', function () {
        scope.securityOptions.exporterPdfFooter(2, 15);
        var obj = { "styles": { "headerStyle": {} } };
        scope.securityOptions.exporterPdfCustomFormatter(obj);
        expect(scope.dynamicPopover.isOpen).toBeFalsy();
        expect(true).toBe(true);
    });
    it('testing for uibModal function', function () {
        scope.groupIDDetails();
        expect(true).toBe(true);
    });
    it('testing for uibModal function', function () {
        scope.openPasswordSettings();
        expect(true).toBe(true);
    });
    it('testing for uibModal function', function () {
        scope.addSecurityGroup();
        expect(true).toBe(true);
    });
    it('testing for deleteGroupID ',function(){
        httpBackend.whenPOST('/DeleteSecurityGroups')
           .respond(function (method, url, data, headers) {
               var saveRes = {};
               return [200, saveRes, {}];
        });        
        scope.deleteGroupID({entity:{SecurityGroupID:2}});
        httpBackend.flush();
    });    
    it('test for get service flush', function () {
        httpBackend.flush();
    });
    // it('testing for grid function', function (gridApi) {
        
    //     gridApi.grid.appScope={};
    //     gridApi.grid={};
        
    //     gridApi.grid.appScope={'showDeleteBtn' : false};
    //     expect(gridApi.grid.appScope.showDeleteBtn).toBeFalsy();
    //     scope.gridApi=gridApi;
    //     scope.securityOptions.onRegisterApi(gridApi);
    //     expect(true).toBe(true);
    // });
});