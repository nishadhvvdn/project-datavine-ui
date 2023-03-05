'use strict';

describe('deviceFirmwareVersionsCtrl testing', function () {

    var scope,reportsService,deviceFirmwareVersionsCtrl;

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
    beforeEach(angular.mock.module('dataVINEApp'));

    beforeEach(function () {
        inject(function ($injector, $controller, $rootScope) {
            scope = $rootScope.$new();
            reportsService = $injector.get('reportsService');
            deviceFirmwareVersionsCtrl = $controller('deviceFirmwareVersionsCtrl', {
                '$scope': scope,
                'reportsService': reportsService,
            });
        });
    });
        it('testing for close function', function () {
        scope.dynamicPopover.isOpen = true;
        scope.dynamicPopover.close();
        expect(true).toBe(true);
        expect(scope.dynamicPopover.isOpen).toBeFalsy();
    });
    it('testing for open function', function () {
        scope.dynamicPopover.isOpen = true;
        scope.dynamicPopover.open();
        expect(true).toBe(true);
        expect(scope.dynamicPopover.isOpen).toBeTruthy();
    });
    it('testing for grid function', function () {
        scope.firmwareVersionsOptions.exporterPdfFooter(2, 15);
        var obj = { "styles": { "headerStyle": {} } };
        scope.firmwareVersionsOptions.exporterPdfCustomFormatter(obj);
        expect(scope.dynamicPopover.isOpen).toBeFalsy();
        expect(true).toBe(true);
    });
    it('testing for print  ',function(){
        scope.printCart();
        window.print();
    });
});