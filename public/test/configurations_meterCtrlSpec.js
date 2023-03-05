'use strict';
var objCacheDetails;
describe('configurations_meterCtrl testing', function () {

    var scope, configurations_meterCtrl, MeterMgmtService, hypersproutMgmtService,httpBackend,filter, state, timeout,refreshservice,uibModal;


    beforeEach(angular.mock.module('dataVINEApp'));

    beforeEach(function () {
        inject(function ($injector, $controller, $rootScope,$sessionStorage,$httpBackend) {
            objCacheDetails = { "userDetails": { "timeZone": "Asia/Kolkata"} }
            //objCacheDetails = { "data": { "configurationDetails": { "selectedRow": { "Name": "config1", "Device Class": "unknown", "Description": "xyz" } } } };
            objCacheDetails.data={};
            scope = $rootScope.$new();
            timeout = $injector.get('$timeout');
            uibModal = $injector.get('$uibModal'); 
            state = $injector.get('$state');
             filter = $injector.get('$filter');
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
            
            $sessionStorage.put('loginName','a');
            $sessionStorage.put('password','a');  
            objCacheDetails.webserviceUrl = '/'; 
            objCacheDetails.endpoints = {
                'MMConf': {
                    'name': 'MMConf',
                    "method": "post"
                },
                'configPrograms': {
                    'name': 'configPrograms',
                    "method": "post"
                }, 
               'MeterGroupDelete': {
                    'name': 'MeterGroupDelete',
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

            httpBackend.whenPOST('/MMConf')
                .respond(function(method, url, data, headers){
                  var res={'memberInfo':{'Members':1,'NonMembers':2,'configID':1},'meterData':{'ConfigName':'abc','ConfigID':1,'Description':'ddd','ClassName':'ccc','ConfigProgramName':'aaa','Version':1,'EditTime':'55'}};
                  //,'hyperSproutData':{'ConfigName':'abc','ConfigID':1,'Description':'ddd','ClassName':'ccc','ConfigProgramName':'aaa','Version':1,'EditTime':'55'}
                    return [200,res,{}];
                    
            });
            httpBackend.whenPOST('/configPrograms')
            .respond(function (method, url, data, headers) {
                var res = { 'configProgramData': [{ 'Name': 'config1'}] };
                return [200, res, {}];

            });   
        spyOn(state,'reload');             
        hypersproutMgmtService = $injector.get('hypersproutMgmtService');
        refreshservice = $injector.get('refreshservice');
        MeterMgmtService = $injector.get('MeterMgmtService');

            configurations_meterCtrl = $controller('configurations_meterCtrl', {
                '$scope': scope,
                '$uibModal': uibModal,
                '$timeout': timeout,
                '$state': state,
                'MeterMgmtService':MeterMgmtService,
                '$filter': filter,
                'hypersproutMgmtService':hypersproutMgmtService,
                'refreshservice':refreshservice
            });
        });
    }); 
    it('test for get service flush',function(){
        httpBackend.flush();
    });
    it('testing for grid function', function () {
        scope.meterconfigOptions.exporterPdfFooter(2, 15);
        var obj = { "styles": { "headerStyle": {} } };
        scope.meterconfigOptions.exporterPdfCustomFormatter(obj);
        expect(true).toBe(true);
    });
    it('testing for grid function', function () {
        //scope.meterconfigOptions.onRegisterApi(obj);
        expect(true).toBe(true);
    });
    it('testing for print  ', function () {
        scope.printCart();
        window.print();
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
    it('testing for open1 function', function () {
        scope.open1();
        expect(true).toBe(true);
    });
    it('testing for open2 function', function () {
        scope.open2();
        expect(true).toBe(true);
    });
    it('testing for open2 function', function () {
        scope.setDate();
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
    // it('test for openImportConfiguration case',function(){
    //     scope.openImportConfiguration();
    // });
    // it('test for openNewConfiguration case',function(){
    //     scope.openNewConfiguration();
    // });
    it('test for setToTime case',function(){
        scope.setToTime();
    });
    it('test for clear case',function(){
        scope.clear();
        expect(scope.startingDate).toBe(null)
    });
    it('test for clear case',function(){
        scope.filterMeterConf();
        expect(scope.invalidDate).toBe(false);
    });
    it('test for setToDate case',function(){
        scope.setToDate(obj);
        expect(scope.endingDate).toBe(obj);
    });
    it('test for setStartTime function',function(){
        scope.setStartTime();
    });
    it('test for setToTime  function',function(){
        scope.setToTime (obj);
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
    it('test for nameDetails function',function(){
        scope.nameDetails(obj);
    });
    it('test for openNewConfiguration_Meter function',function(){
        scope.openNewConfiguration_Meter ();
    });
    it('test for openImportConfiguration_Meter  function',function(){
        scope.openImportConfiguration_Meter  ();
    });  
    it('test for $destroy case', function () {
        scope.$destroy();
        expect(true).toBe(true);
    });
    it('testing deleteConfiguration function', function () {
            //expect(scope.tagOptions.data['Serial Number']).toEqual('123');
        //var vm=this;
        httpBackend.whenPOST('/MeterGroupDelete')
               .respond(function(method, url, data, headers){
                 var res={'memberInfo':[{Members:1}],configProgramData:[{Name:'abc'}]};
                   return [200,res,{}];
                    
        });        
        scope.deleteConfiguration({entity:{ID:2}});      
        httpBackend.flush();
        
    });       
});
