'use strict';

describe('meterDownloadsCtrl testing', function () {

    var scope, meterDownloadsCtrl, uibModal, timeout, MeterMgmtService, filter,refreshservice, httpBackend;


    beforeEach(angular.mock.module('dataVINEApp'));

    beforeEach(function () {
        inject(function ($injector, $controller, $rootScope, $sessionStorage, $httpBackend) {
            objCacheDetails = { "userDetails": { "timeZone": "Asia/Kolkata"}};
            scope = $rootScope.$new();
            uibModal = $injector.get('$uibModal');
            timeout = $injector.get('$timeout');
            MeterMgmtService = $injector.get('MeterMgmtService');
            refreshservice = $injector.get('refreshservice');
            filter = $injector.get('$filter');

            $sessionStorage.put('loginName', 'a');
            $sessionStorage.put('password', 'a');
            objCacheDetails.webserviceUrl = '/';
            objCacheDetails.endpoints = {
                'ListDownloadJobs': {
                    'name': 'ListDownloadJobs',
                    "method": "POST"
                },
                // 'ResetPassword': {
                //     'name': 'ResetPassword',
                //     "method": "POST"
                // }
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
            httpBackend.whenPOST('/ListDownloadJobs')
            .respond(function(method, url, data, headers){
               var saveRes={'Download Jobs':[{'JobType':'MTRDown','JobID':1}]};
               return [200,saveRes,{}];
        }); 

            meterDownloadsCtrl = $controller('meterDownloadsCtrl', {
                '$scope': scope,
                '$uibModal': uibModal,
                '$timeout': timeout,
                'MeterMgmtService': MeterMgmtService,
                '$filter': filter,
                'refreshservice': refreshservice
            });
        });
    });
    it('test for get flush function',function(){
        httpBackend.flush();
    });
    it('testing for grid function', function () {
        scope.downloadOptions_meter.exporterPdfFooter(2, 15);
        var obj = { "styles": { "headerStyle": {} } };
        scope.downloadOptions_meter.exporterPdfCustomFormatter(obj);
        expect(scope.dynamicPopover.isOpen).toBeFalsy();
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
    it('testing for open1 popup',function(){
        scope.open1();
        expect(scope.popup1.opened).toBeTruthy();
    });
    it('testing for open2 popup',function(){
        scope.open2();
        expect(scope.popup2.opened).toBeTruthy();
    });
    it('testing for printCart ',function(){
        window.print();
        scope.printCart ();
    });
    it('test for setStartTime function',function(){
        scope.setStartTime();
    });
    it('test for compareTimes  function',function(){
        scope.startingDate=2;
        scope.endingDate=1;
        scope.compareTimes ();
    });
    it('test for compareDates   function',function(){
        scope.startingDate=2;
        scope.endingDate=1;
        scope.compareDates ();
    });
    it('test for setToTime function',function(){
        scope.setToTime();
    });
    it('test for setDate  function',function(){
        scope.setDate (obj);
    });
    it('test for downloadFilterConfig  function',function(){
        scope.downloadFilterConfig (obj);
    });
    it('test for compareDates  function',function(){
        scope.startingDate=2;
        scope.endingDate=1;
        scope.compareDates  ();
    });
    it('test for setToTime function',function(){
        scope.setToTime(obj);
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
    it('test for $destroy case', function () {
        scope.$destroy();
        expect(true).toBe(true);
    });      
});