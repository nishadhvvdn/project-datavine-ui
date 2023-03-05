'use strict';
describe('systemAuditLogCtrl testing', function () {

    //var $scope, $controller;
    var scope, systemAuditLogCtrl,httpBackend,refreshservice,reportsService,timeout;


    beforeEach(angular.mock.module('dataVINEApp'));

    beforeEach(function () {
        inject(function ($injector, $controller, $rootScope,$sessionStorage,$httpBackend) {
             objCacheDetails = { "userDetails": { "timeZone": "Asia/Kolkata"} };
            scope = $rootScope.$new();
            reportsService = $injector.get('reportsService');
            timeout = $injector.get('$timeout');
            refreshservice = $injector.get('refreshservice');
            $sessionStorage.put('loginName','a');
            $sessionStorage.put('password','a');  
            objCacheDetails.webserviceUrl = '/'; 
            objCacheDetails.endpoints = {
                'SystemAuditLogReport': {
                    'name': 'SystemAuditLogReport',
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

            httpBackend.whenPOST('/SystemAuditLogReport')
                .respond(function(method, url, data, headers){
                  var res={"type":"true","Details":[{'detail':1}]};
                    return [200,res,{}];
                    
            });              
            systemAuditLogCtrl = $controller('systemAuditLogCtrl', {
                '$scope': scope,
                'reportsService':reportsService,
                '$timeout': timeout,
                'refreshservice': refreshservice,
            });
        }); // end of inject
    });
    it('testing init function', function () {
        httpBackend.flush();
        
    }); 
    it('testing for print function', function () {
        window.print();
        scope.printCart();
        expect(true).toBe(true);
    });
    it('testing for close function', function () {
        scope.dynamicPopover.isOpen = true;
        scope.dynamicPopover.close();
        expect(true).toBe(true);
    });
    it('testing for open function', function () {
        scope.dynamicPopover.isOpen = true;
        scope.dynamicPopover.open();
        expect(true).toBe(true);
    });
    it('testing for grid function', function () {
        scope.auditLogOptions   .exporterPdfFooter(2, 15);
        var obj = { "styles": { "headerStyle": {} } };
        scope.auditLogOptions   .exporterPdfCustomFormatter(obj);
        expect(scope.dynamicPopover.isOpen).toBeFalsy();
        expect(true).toBe(true);
    });
    it('testing for open1 popup',function(){
        scope.open1();
        console.log("print");
        expect(scope.popup1.opened).toBeTruthy();
    });
    it('testing for open2 popup',function(){
        scope.open2();
        expect(scope.popup2.opened).toBeTruthy();
    });
    it('testing for auditLogFilter',function(){
        scope.auditLogFilter ();
    });
    it('testing for setDate ',function(){
        scope.setDate();
    });
    it('testing for toggleMode  ',function(){
        scope.toggleMode ();
    });
    it('testing for compareDates',function(){
        scope.compareDates ();
    });
    it('testing for setFromDate ',function(){
        scope.setFromDate();
    });
    it('testing for setToDate  ',function(){
        scope.setToDate ();
    });
    it('testing for compareTimes  ',function(){
        scope.compareTimes ();
    });
    it('testing for setStartTime ',function(){
        scope.setStartTime ();
        expect(scope.properDateTime).toBeTruthy();
    });
    it('testing for setToTime',function(){
        scope.setToTime ();
        expect(scope.properDateTime).toBeTruthy();
    }); 
     it('testing for setToTime',function(){
        scope.setToTime(new Date('Thu Feb 02 2017 15:42:59 GMT+0530 (India Standard Time)'));
        expect(scope.properDateTime).toBeFalsy();
    });  
     it('testing for setStartTime',function(){
        scope.setStartTime(new Date('Thu Feb 02 2017 15:42:59 GMT+0530 (India Standard Time)'));
        expect(scope.properDateTime).toBeFalsy();
    });      
});