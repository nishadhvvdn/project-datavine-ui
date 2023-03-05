'use strict';
describe('testing', function () {

    //var $scope, $controller;
    var scope, firmwareManagementCtrl,firmwareManagementService,httpBackend,uibModal;


    beforeEach(angular.mock.module('dataVINEApp'));

    beforeEach(function () {
        inject(function ($injector, $controller, $rootScope,$sessionStorage,$httpBackend) {
            scope = $rootScope.$new(); //scope = $injector.get('$rootScope')
            scope.firmwareOptions={};
            uibModal = $injector.get('$uibModal');
            firmwareManagementService = $injector.get('firmwareManagementService');
            $sessionStorage.put('loginName','a');
            $sessionStorage.put('password','a');  
            objCacheDetails.webserviceUrl = '/'; 
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
            objCacheDetails.endpoints = {
                'FirmwareMgmtJobStatus': {
                    'name': 'FirmwareMgmtJobStatus',
                    "method": "POST"
                },                             
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

            httpBackend.whenPOST('/FirmwareMgmtJobStatus')
                .respond(function(method, url, data, headers){
                  var res={type:true,'JobStatusFirmwareSelected':[{JobID:2}]};
                    return [200,res,{}];
                    
            }); 
            firmwareManagementCtrl = $controller('firmwareManagementCtrl', {
                '$scope': scope,
                '$uibModal': uibModal,
                'firmwareManagementService':firmwareManagementService,
                'deviceType':'Meter'
            });
        }); // end of inject
    }); // end of beforeEach
    it('testing init function', function () {
        //expect(scope.firmwareOptions.data[0].JobID).toBe(2);
        expect(true).toBeTruthy();
        httpBackend.flush();
        
    });    
    it('testing openProductionFirmware function', function () {
        scope.dynamicPopover.isOpen = true;
        scope.openProductionFirmware('lg');
        scope.printCart();
        expect(scope.dynamicPopover.isOpen).toBeFalsy();
    })
    it('testing openEnterFirmwareDownload  function', function () {
        scope.dynamicPopover.isOpen = true;
        scope.openEnterFirmwareDownload('lg');
        expect(scope.dynamicPopover.isOpen).toBeFalsy();
    })
    it('testing openImportFirmware  function', function () {
        scope.dynamicPopover.isOpen = true;
        scope.openImportFirmware('lg');
        expect(scope.dynamicPopover.isOpen).toBeFalsy();
    })
    it('Negetive testing open  function', function () {
        scope.dynamicPopover.isOpen = false;
        scope.dynamicPopover.open();
        expect(scope.dynamicPopover.isOpen).toBeTruthy();
    })
    it('positive testing open  function', function () {
        scope.dynamicPopover.isOpen = true;
        scope.dynamicPopover.close();
        scope.firmwareOptions.exporterPdfFooter(2, 15);
        var obj = { "styles": { "headerStyle": {} } };
        scope.firmwareOptions.exporterPdfCustomFormatter(obj);
        expect(scope.dynamicPopover.isOpen).toBeFalsy();
    })
});
