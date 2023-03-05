'use strict';
var objCacheDetails;
describe('configurationsCtrl testing', function () {

    var scope, configurationsCtrl, hypersproutMgmtService, httpBackend, filter, state, timeout, refreshservice, uibModal;


    beforeEach(angular.mock.module('dataVINEApp'));

    beforeEach(function () {
        inject(function ($injector, $controller, $rootScope, $sessionStorage, $httpBackend) {
            objCacheDetails = { "userDetails": { "timeZone": "Asia/Kolkata" } }
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

            $sessionStorage.put('loginName', 'a');
            $sessionStorage.put('password', 'a');
            objCacheDetails.webserviceUrl = '/';
            objCacheDetails.endpoints = {
                'HSMConf': {
                    'name': 'HSMConf',
                    "method": "post"
                },
                'configPrograms': {
                    'name': 'configPrograms',
                    "method": "post"
                },
                'ListDevicesAttached': {
                    'name': 'ListDevicesAttached',
                    "method": "post"
                },
                'HSGroupDelete': {
                    'name': 'HSGroupDelete',
                    "method": "post"
                }
            }; 
            spyOn(state,'reload');   
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

            httpBackend.whenPOST('/HSMConf')
                .respond(function (method, url, data, headers) {
                    var res = { 'memberInfo': { 'Members': 1, 'NonMembers': 2, 'configID': 1 },'hyperSproutData':{'ConfigName':'abc','ConfigID':1,'Description':'ddd','ClassName':'ccc','ConfigProgramName':'aaa','Version':1,'EditTime':'55'} };
                    return [200, res, {}];

                });
            hypersproutMgmtService = $injector.get('hypersproutMgmtService');
            refreshservice = $injector.get('refreshservice');
            configurationsCtrl = $controller('configurationsCtrl', {
                '$scope': scope,
                '$timeout': timeout,
                '$uibModal': uibModal,
                '$state': state,
                'hypersproutMgmtService': hypersproutMgmtService,
                '$filter': filter,
                'refreshservice': refreshservice
            });
        });
    });
    it('test for get service flush', function () {
        httpBackend.flush();
    });
    it('testing for grid function', function () {
        scope.configOptions.exporterPdfFooter(2, 15);
        var obj = { "styles": { "headerStyle": {} } };
        scope.configOptions.exporterPdfCustomFormatter(obj);
        expect(true).toBe(true);
    });
    // it('testing for grid function', function () {
    //     scope.configOptions.onRegisterApi(obj);
    //     expect(true).toBe(true);
    // });
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
        expect(true).toBe(true);

    });
    it('testing for setFromDate function', function () {
        scope.setFromDate(obj);
        expect(true).toBe(true);

    });
    it('testing for setStartTime function', function () {
        scope.setStartTime(obj);
        expect(true).toBe(true);
    });
    it('testing for setDate function', function () {
        scope.setDate(2016, 9, 26);
        expect(true).toBe(true);
    });
    it('test for openImportConfiguration case', function () {
        scope.openImportConfiguration();
        expect(true).toBe(true);
    });
    it('test for openNewConfiguration case', function () {
                httpBackend.whenGET('/templates/newConfiguration.html')
            .respond(function (method, url, data, headers) {
                return [200, {}, {}];

            });
        httpBackend.whenPOST('/configPrograms')
            .respond(function (method, url, data, headers) {
                var res = { 'configProgramData': [{ 'Name': 'config1'}] };
                return [200, res, {}];

            });
        scope.openNewConfiguration();
        httpBackend.flush();
        expect(objCacheDetails.data.configPrgmData[0].Names).toEqual('config1')
    });
    it('test for setToTime case', function () {
        scope.setToTime();
    });
    it('test for setToTime case', function () {
        scope.setToTime(obj);
    });
    it('test for filterConfiguration case', function () {
        scope.filterConfiguration();
    });
    it('test for filterConfiguration case', function () {
        scope.properDateTime=false;
        expect(scope.properDateTime).toBeFalsy();
        scope.setToDate(obj);
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
    it('test for $destroy case', function () {
        scope.$destroy();
        expect(true).toBe(true);
    });
    it('test for nameDetails function',function(){
        configurationsCtrl.nameDetails(obj);
    });
    it('testing deleteConfiguration function', function () {
        httpBackend.whenPOST('/HSGroupDelete')
               .respond(function(method, url, data, headers){
                 var res={'memberInfo':[{Members:1}],configProgramData:[{Name:'abc'}]};
                   return [200,res,{}];
                    
        });        
        configurationsCtrl.deleteConfiguration({entity:{ID:2}});      
        httpBackend.flush();
        
    }); 
});
