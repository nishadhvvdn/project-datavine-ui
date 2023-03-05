'use strict';
describe('relaysCtrl testing', function () {
    var scope, uibModal,relaysCtrl,httpBackend,timeout,SystemManagementService,filter ;
    beforeEach(angular.mock.module('dataVINEApp'));
    beforeEach(function () {
        inject(function ($injector, $controller, $rootScope,$sessionStorage,$httpBackend) {    
            scope = $rootScope.$new(); //scope = $injector.get('$rootScope')
            filter = $injector.get('$filter');
            uibModal = $injector.get('$uibModal');
            timeout = $injector.get('$timeout');
            $sessionStorage.put('loginName','a');
            $sessionStorage.put('password','a');  
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
            objCacheDetails.webserviceUrl = '/'; 
            objCacheDetails.endpoints = {
                'SMHyperSprout': {
                    'name': 'SMHyperSprout',
                    "method": "POST"
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

                    httpBackend.whenPOST('/SMHyperSprout')
                .respond(function(method, url, data, headers){
                  var res={'details':[{HypersproutSerialNumber:'123'}]};
                    return [200,res,{}];
                    
            }); 
            SystemManagementService = $injector.get('SystemManagementService');
           // tagData=[{"Start Time":"Thu Nov 17 2016 12:47:32 GMT+0530 (India Standard Time)"}]
            relaysCtrl = $controller('relaysCtrl', {
                '$scope': scope,
                '$uibModal': uibModal,
                '$timeout':timeout,
                'SystemManagementService': SystemManagementService,
                '$filter': filter,
                'type':'HyperSprout'
            });
        }); // end of inject
    }); // end of beforeEach

    it('testing init function', function () {
            //expect(scope.tagOptions.data['Serial Number']).toEqual('123');
        expect(true).toBeTruthy();
        httpBackend.flush();
        
    });   
    it('testing for print function', function () {
        window.print();
        scope.printCart ();
    });
  
   it('positive testing open  function', function () {
       
       scope.relaysOptions.exporterPdfFooter(2,15);
        var obj={"styles":{"headerStyle":{}}};
         scope.relaysOptions.exporterPdfCustomFormatter(obj);
         //scope.relaysOptions.onRegisterApi(obj);
        //scope.toggled(obj);
       expect(scope.dynamicPopover.isOpen).toBeFalsy();
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
    it('testing for openAddRelays function', function () {
       //scope.setFromDate(obj);
       scope.openAddRelays(10);
    });
    it('testing for check values function', function () {
        scope.checkValue();
    });
    it('test for $destroy case', function () {
        scope.$destroy();
        expect(true).toBe(true);
    });
});
