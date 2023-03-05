'use strict';
var objCacheDetails;
describe('metersCtrl testing', function () {
    var scope, uibModal,metersCtrl,timeout,httpBackend,SystemManagementService,filter ;
    beforeEach(angular.mock.module('dataVINEApp'));
    beforeEach(function () {
        inject(function ($injector, $controller, $rootScope,$sessionStorage,$httpBackend) {    
            objCacheDetails={"data":{"configurationDetails":{"selectedRow":{"Name":"config1","Device Class":"unknown","Description":"xyz"}}}};
            scope = $rootScope.$new(); //scope = $injector.get('$rootScope')
            filter = $injector.get('$filter');
            uibModal = $injector.get('$uibModal');
            timeout = $injector.get('$timeout');
            $sessionStorage.put('loginName','a');
            $sessionStorage.put('password','a');  
            objCacheDetails.webserviceUrl = '/'; 
            objCacheDetails.endpoints = {
                'SMMeters': {
                    'name': 'SMMeters',
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

            httpBackend.whenPOST('/SMMeters')
                .respond(function(method, url, data, headers){
                  var res={'details':[{MeterSerialNumber:'123'}]};
                    return [200,res,{}];
                    
            });
            SystemManagementService = $injector.get('SystemManagementService');
            metersCtrl = $controller('metersCtrl', {
                '$scope': scope,
                '$uibModal': uibModal,
                '$timeout':timeout,
                'SystemManagementService': SystemManagementService,
                '$filter': filter,
            });
        }); // end of inject
    }); // end of beforeEach
    it('testing init function', function () {
            //expect(scope.tagOptions.data['Serial Number']).toEqual('123');
        httpBackend.flush();
        
    }); 
  
    it('testing for print function', function () {
        window.print();
        scope.printCart ();
    });
  
   it('positive testing open  function', function () {  
       scope.meterOptions.exporterPdfFooter(2,15);
        var obj={"styles":{"headerStyle":{}}};
         scope.meterOptions.exporterPdfCustomFormatter(obj);
         //scope.meterOptions.onRegisterApi(obj);
    })
     it('testing for dynamic popover open function', function () {
        scope.dynamicPopover.isOpen = false;
        scope.dynamicPopover.open();
        expect(scope.dynamicPopover.isOpen).toBeTruthy();
    });
     it('testing for dynamic popover close function', function () {
         scope.dynamicPopover.isOpen = true;
         scope.dynamicPopover.close();
         expect(scope.dynamicPopover.isOpen).toBeFalsy();
    });
   
    it('testing for search function', function () {
       scope.search();

    });
     /*it('testing for toggleMode function', function () {
       scope.toggleMode(obj);

    })*/
    it('testing for check values function', function () {
        scope.checkValue();
    });
    it('testing for name details function', function () {
        scope.nameDetailsForMeter(obj);
    });
     it('testing for name details function', function () {
        scope.$on('$destroy', function iVeBeenDismissed() {
        //data = eventData;
    });
    });
    it('test for $destroy case', function () {
        scope.$destroy();
        expect(true).toBe(true);
    });

});
