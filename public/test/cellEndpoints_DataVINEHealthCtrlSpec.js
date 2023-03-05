'use strict';
var objCacheDetails;
describe('cellEndpoints_DataVINEHealthCtrl testing', function () {

    var cellEndpoints_DataVINEHealthCtrl, scope, state, uibModal;


    beforeEach(angular.mock.module('dataVINEApp'));
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
    beforeEach(function () {
        inject(function ($injector, $controller, $rootScope) {
            scope = $rootScope.$new();
            state=$injector.get('$state');
            uibModal=$injector.get('$uibModal');
            cellEndpoints_DataVINEHealthCtrl = $controller('cellEndpoints_DataVINEHealthCtrl', {
                '$scope': scope,
                '$uibModal':uibModal,
                '$state':state
            });
        });
    });
    it('test for ', function () {
expect(true).toBe(true);
    });
    it('testing for print function', function () {
        window.print();
        scope.printCart();
        expect(true).toBe(true);
    });
     it('testing for openNetworkStatistics function', function () {
        cellEndpoints_DataVINEHealthCtrl.openNetworkStatistics();
        });

    it('testing for exporterPdfFooter function', function () {
        scope.cellEndpoints_DataVINEHealthOptions.exporterPdfFooter(2, 15);
        var obj = { "styles": { "headerStyle": {} } };
        scope.cellEndpoints_DataVINEHealthOptions.exporterPdfCustomFormatter(obj);
       // expect(currentPage).toBe(2);
    });
    
     
});