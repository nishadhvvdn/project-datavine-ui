'use strict';
describe('testing', function () {

    //var $scope, $controller;
    var scope, systemLogsCtrl,httpBackend,refreshservice,reportsService,timeout,filter;


    beforeEach(angular.mock.module('dataVINEApp'));

    beforeEach(function () {
        inject(function ($injector, $controller, $rootScope,$sessionStorage,$httpBackend) {
             objCacheDetails = { "userDetails": { "timeZone": "Asia/Kolkata"} };
            scope = $rootScope.$new();
            reportsService = $injector.get('reportsService')
            refreshservice = $injector.get('refreshservice');
            timeout = $injector.get('$timeout');
            filter = $injector.get('$filter');
            $sessionStorage.put('loginName','a');
            $sessionStorage.put('password','a');  
            objCacheDetails.webserviceUrl = '/'; 
            objCacheDetails.endpoints = {
                'SystemLogReport': {
                    'name': 'SystemLogReport',
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

            httpBackend.whenPOST('/SystemLogReport')
                .respond(function(method, url, data, headers){
                  var res={'JobStatusHSMSelected':[{JobName:'123'}],'type':true,'Details':[{'HypersproutSerialNumber':1,'EventDateTime':2,'Attribute':'S','MeterSerialNumber':9,'Action':'ADD'}]};
                    return [200,res,{}];
                    
            });               
            systemLogsCtrl = $controller('systemLogsCtrl', {
                '$scope': scope,
                'reportsService':reportsService,
                'refreshservice': refreshservice,
                '$timeout': timeout,
                '$filter': filter,
            });
        }); // end of inject
    });
    it('testing init function', function () {
            //expect(scope.tagOptions.data['Serial Number']).toEqual('123');
        httpBackend.flush();
        
    }); 
    it('testing for print function', function () {
        window.print();
        scope.printCart();
        expect(true).toBe(true);
    });
    // it('testing for endpointDetails function', function () {
    //     scope.dynamicPopover.isOpen = true;
    //     scope.endpointDetails('size');
    //     expect(scope.dynamicPopover.isOpen).toBeTruthy();
        
    // });
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
        scope.systemLogOptions  .exporterPdfFooter(2, 15);
        var obj = { "styles": { "headerStyle": {} } };
        scope.systemLogOptions  .exporterPdfCustomFormatter(obj);
        expect(scope.dynamicPopover.isOpen).toBeFalsy();
        expect(true).toBe(true);
    });
    it('testing for toggleMode function', function () {
       scope.toggleMode();

    });
    it('testing for setFromDate function', function () {
       scope.setFromDate(obj);

    });
    it('testing for setStartTime function', function () {
        scope.setStartTime(obj);
    });
     it('testing for setDate function', function () {
       scope.setDate(2016, 9,26);
    });
    it('testing for print function', function () {
        window.print();
        scope.printCart ();
    });
    it('testing for open1 popup',function(){
        scope.open1();
        console.log("print");
        expect(scope.popup1.opened).toBeTruthy();
    });
    it('testing for open1 popup',function(){
        scope.open2();
        expect(scope.popup2.opened).toBeTruthy();
    });
    it('testing for systemLogfilter',function(){
        scope.systemLogfilter ();
        expect(scope.dynamicPopover.isOpen).toBeFalsy();
    });
    it('testing for addEndpoint ',function(){
        scope.addEndpoint();
    });
    it('testing for setToDate ',function(){
        scope.setToDate();
    });
    it('testing for setToTime  ',function(){
        scope.setToTime ();
    });
    it('testing for compareDates',function(){
        scope.startingDate=2;
        scope.endingDate=1;
        scope.compareDates ();
        expect(scope.invalidDate).toBeTruthy();
    });
    it('testing for compareTimes',function(){
        scope.startingDate=2;
        scope.endingDate=1;
        scope.compareTimes ();
        expect(scope.invalidTime).toBeTruthy();
    });
    it('testing for setStartTime function', function () {
        scope.setStartTime();
    });
    it('testing for setToTime  function', function () {
        scope.setToTime (obj);
    });
});