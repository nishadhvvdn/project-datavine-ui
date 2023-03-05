/**
 * Cached details object holds the reference of the required objects
 */
'use strict';

function CacheDetails() {
}

CacheDetails.prototype = {
};
var objCacheDetails = new CacheDetails();
objCacheDetails.timeout = 180000;
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
    exporterPdfDefaultStyle: { fontSize: 7 },
    exporterPdfTableStyle: { margin: [5, 5, 5, 5] },
    exporterPdfTableHeaderStyle: { fontSize: 10, bold: true, italics: true, color: 'red' },
    exporterPdfHeader: {},
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
    onRegisterApi: function (gridApi) {
    }
}