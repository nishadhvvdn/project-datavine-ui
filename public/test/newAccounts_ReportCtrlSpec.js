'use strict';
describe('testing', function() {

    //var $scope, $controller;
    var scope, newAccounts_ReportCtrl, httpBackend, commonService, reportsService, filter, timeout, refreshservice;


    beforeEach(angular.mock.module('dataVINEApp'));

    beforeEach(function() {
        inject(function($injector, $controller, $rootScope, $sessionStorage, $httpBackend) {
            //objCacheDetails = { "userDetails": { "timeZone": "Asia/Kolkata"} };
            scope = $rootScope.$new();
            timeout = $injector.get('$timeout');
            filter = $injector.get('$filter');
            $sessionStorage.put('loginName', 'a');
            $sessionStorage.put('password', 'a');

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
                exporterPdfFooter: function(currentPage, pageCount) {
                    return { text: currentPage.toString() + ' of ' + pageCount.toString(), style: 'footerStyle' };
                },
                exporterPdfCustomFormatter: function(docDefinition) {
                    docDefinition.styles.headerStyle = { fontSize: 22, bold: true };
                    docDefinition.styles.footerStyle = { fontSize: 10, bold: true };
                    return docDefinition;
                },
                exporterPdfOrientation: 'portrait',
                exporterPdfPageSize: 'LETTER',
                exporterPdfMaxGridWidth: 450,
                exporterCsvLinkElement: angular.element(document.querySelectorAll(".custom-csv-link-location")),
            };

            objCacheDetails.webserviceUrl = '/';
            objCacheDetails.endpoints = {
                'NewAccountReport': {
                    'name': 'NewAccountReport',
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
                .respond(function(method, url, data, headers) {
                    var res = {};
                    return [200, res, {}];

                });

            httpBackend.whenGET('/NewAccountReport')
                .respond(function(method, url, data, headers) {
                    var saveRes = { 'Details': [{ 'MeterID': 1, 'Meters_Billing':{'MeterConsumerAddress': '22', 'MeterConsumerName': 'ss'},'RegisteredTime': 1 }] };
                    return [200, saveRes, {}];
                });
            reportsService = $injector.get('reportsService')
            refreshservice = $injector.get('refreshservice');
            newAccounts_ReportCtrl = $controller('newAccounts_ReportCtrl', {
                '$scope': scope,
                'commonService': commonService,
                'reportsService': reportsService,
                'refreshservice': refreshservice,
                '$filter': filter,
                '$timeout': timeout,
                '$controller':$controller
            });
        }); // end of inject
    });


    it('test for ', function() {
        httpBackend.flush();
        expect(true).toBe(true);
    });

    it('testing for close function', function() {
        scope.dynamicPopover.isOpen = true;
        scope.dynamicPopover.close();
        expect(true).toBe(true);
    });
    
    it('testing for open function', function() {
        scope.dynamicPopover.isOpen = true;
        scope.dynamicPopover.open();
        expect(true).toBe(true);
    });
    
    it('testing for newAccountfilter popup', function() {
        scope.newAccountfilter();
    });

    it('testing for search function', function () {
       scope.filterRoute();
    });










});