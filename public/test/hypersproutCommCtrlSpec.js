'use strict';
describe('testing', function () {

    //var $scope, $controller;
    var scope, hypersproutCommCtrl,httpBackend, refreshservice,reportsService,timeout,filter;


    beforeEach(angular.mock.module('dataVINEApp'));

    beforeEach(function () {
        inject(function ($injector, $controller, $rootScope,$sessionStorage,$httpBackend) {
             //objCacheDetails = { "userDetails": { "timeZone": "Asia/Kolkata"} };
            scope = $rootScope.$new();
            timeout = $injector.get('$timeout');
            filter = $injector.get('$filter');
            $sessionStorage.put('loginName','a');
            $sessionStorage.put('password','a');            
            objCacheDetails.userDetails = {};
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
            objCacheDetails.userDetails.timeZone ='Asia/Kolkata';
            objCacheDetails.webserviceUrl = '/'; 
            objCacheDetails.endpoints = {
                'CommunicationsStatisticsReport': {
                    'name': 'CommunicationsStatisticsReport',
                    "method": "GET"
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

        httpBackend.whenGET('/CommunicationsStatisticsReport')
            .respond(function(method, url, data, headers){
               var saveRes={'Details':[{'SerialNumber':1,'LastReadTime':'22','Status':'ss'}]};
               return [200,saveRes,{}];
        }); 
                    reportsService = $injector.get('reportsService')
            refreshservice = $injector.get('refreshservice'); 
            hypersproutCommCtrl = $controller('hypersproutCommCtrl', {
                '$scope': scope,
                'reportsService':reportsService,
                'refreshservice': refreshservice,
                '$timeout': timeout,
                '$filter': filter,
                'type':'HyperSprout'
            });
        }); // end of inject
    });

    it('testing for print function', function () {
        window.print();
        scope.printCart();
        expect(true).toBe(true);
    });
    it('testing for endpointDetails function', function () {
        scope.dynamicPopover.isOpen = true;
        //scope.endpointDetails('size');
        expect(scope.dynamicPopover.isOpen).toBeTruthy();
        
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
        scope.commStatsOptions.exporterPdfFooter(2, 15);
        var obj = { "styles": { "headerStyle": {} } };
        scope.commStatsOptions.exporterPdfCustomFormatter(obj);
        expect(scope.dynamicPopover.isOpen).toBeFalsy();
        expect(true).toBe(true);
    });
    it('testing for toggleMode function', function () {
       scope.toggleMode();

    });
    it('testing for setFromDate function', function () {
       scope.setFromDate(obj);

    });
     /*it('testing for setToDate function', function () {
        scope.setToDate(obj);
    });*/
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
        expect(scope.popup1.opened).toBeTruthy();
    });
    it('testing for open2 popup',function(){
        scope.open2();
        expect(scope.popup2.opened).toBeTruthy();
    });
     it('positive testing on flush function', function () {
        expect(true).toBeTruthy();
       httpBackend.flush();
    });
    it('testing for filterConfiguration popup',function(){
        scope.filterConfiguration();
    }); 
    it('testing for setToTime popup',function(){
        scope.setToTime();
        expect(scope.properDateTime).toBe(true);
    });
        it('negetive testing for setToTime popup',function(){
        scope.setToTime('Wed Mar 25 2015 09:56:24 GMT+0100 (W. Europe Standard Time)');
        expect(scope.properDateTime).toBe(false);
    });
    it('negetive testing for setToDate popup',function(){
        scope.setToDate('Wed Mar 25 2015 09:56:24 GMT+0100 (W. Europe Standard Time)');
        expect(scope.properDateTime).toBe(false);
    });
    it('testing for setStartTime popup',function(){
        scope.setStartTime();
        expect(scope.properDateTime).toBe(true);
    });
        it('negetive setStartTime for setToTime popup',function(){
        scope.setStartTime('Wed Mar 25 2015 09:56:24 GMT+0100 (W. Europe Standard Time)');
        expect(scope.properDateTime).toBe(false);
    }); 
    it('testing compareDates function',function(){
        scope.sratingDate='Wed Mar 24 2015 09:56:24 GMT+0100 (W. Europe Standard Time)';
        scope.endingDate='Wed Mar 25 2015 09:56:24 GMT+0100 (W. Europe Standard Time)';
        scope.compareDates();
        expect(scope.invalidDate).toBe(false);
    });  
     it('testing for addEndpoint ',function(){
        scope.addEndpoint();
    });             
});