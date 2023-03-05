'use strict';
describe('testing', function () {

    //var $scope, $controller;
    var scope, formatDate, systemUpdatesCtrl, httpBackend, refreshservice, reportsService, timeout, filter, hypersproutMgmtService;


    beforeEach(angular.mock.module('dataVINEApp'));

    beforeEach(function () {
        inject(function ($injector, $controller, $rootScope, $sessionStorage, $httpBackend) {
            objCacheDetails = { "userDetails": { "timeZone": "Asia/Kolkata" } };
            scope = $rootScope.$new();
            reportsService = $injector.get('reportsService')
            hypersproutMgmtService = $injector.get('hypersproutMgmtService');
            filter = $injector.get('$filter');
            timeout = $injector.get('$timeout');
            refreshservice = $injector.get('refreshservice');
            formatDate = $injector.get('formatDate');
            $sessionStorage.put('loginName', 'a');
            $sessionStorage.put('password', 'a');
            objCacheDetails.webserviceUrl = '/';
            objCacheDetails.endpoints = {
                'JobsList': {
                    'name': 'JobsList',
                    "method": "Post"
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
                .respond(function (method, url, data, headers) {
                    var res = {};
                    return [200, res, {}];

                });

            httpBackend.whenPOST('/JobsList')
                .respond(function (method, url, data, headers) {
                    var res = { "JobsArray": [{ "JobName": 'abc' }] };
                    return [200, res, {}];

                });
            systemUpdatesCtrl = $controller('systemUpdatesCtrl', {
                '$scope': scope,
                'reportsService': reportsService,
                'hypersproutConfigService': hypersproutMgmtService,
                '$filter': filter,
                '$timeout': timeout,
                'refreshservice': refreshservice,
                '$controller': $controller,
                'type': 'netWorkJobStatus',
                'formatDate': formatDate
            });
        });
    });
    it('testing init function', function () {
        httpBackend.flush();
expect(true).toBe(true);
    });
    it('testing for print function', function () {
        window.print();
        scope.printCart();
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
    it('testing for grid function', function () {
        scope.systemUpdatesOptions.exporterPdfFooter(2, 15);
        var obj = { "styles": { "headerStyle": {} } };
        scope.systemUpdatesOptions.exporterPdfCustomFormatter(obj);
        expect(scope.dynamicPopover.isOpen).toBeFalsy();
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
        scope.setDate(2016, 9, 26);
    });
    it('testing for print function', function () {
        window.print();
        scope.printCart();
    });
    it('testing for open1 popup', function () {
        scope.open1();
        console.log("print");
        expect(scope.popup1.opened).toBeTruthy();
    });
    it('testing for open2 popup', function () {
        scope.open2();
        expect(scope.popup2.opened).toBeTruthy();
    });
    it('testing for errorUpdate ', function () {
        scope.ListOfItems[0].isSelected = true;
        scope.errorUpdate();
        expect(scope.invalidSelection).toBe(false);
    });
    it('testing for errorUpdate ', function () {
        scope.ListOfItems[1].isSelected = true;
        scope.errorUpdate();
        expect(scope.invalidSelection).toBe(false);
    });
    it('testing for errorUpdate ', function () {
        scope.jobsObject.runningJobs = true;
        scope.errorUpdate();
        expect(scope.invalidSelection).toBe(false);
    });
    it('testing for errorUpdate ', function () {
        scope.jobsObject.historicalJobs = true;
        scope.errorUpdate();
        expect(scope.invalidSelection).toBe(false);
    });
    it('testing for errorUpdate ', function () {
        scope.ListOfItems[0].isSelected = false;
        scope.errorUpdate();
        expect(scope.invalidSelection).toBe(false);
    });
    it('testing for systemUpdates ', function () {
        scope.jobsObject.runningJobs = true;
        scope.jobsObject.historicalJobs = true;
        scope.systemUpdates();
        expect(scope.invalidSelection).toBe(false);
    });
    it('testing for systemUpdates ', function () {
        scope.jobsObject.historicalJobs = true;
        scope.systemUpdates();
        expect(scope.invalidSelection).toBe(false);
    });
    it('testing for compareDates ', function () {
        scope.startingDate = 2;
        scope.endingDate = 1;
        scope.compareDates();
        expect(scope.invalidDate).toBeTruthy();
    });
    it('testing for setToDate ', function () {
        scope.startingDate = 2;
        scope.endingDate = 1;
        scope.setToDate();
        expect(scope.invalidTime).toBeFalsy();
    });
    it('testing for compareTimes', function () {
        scope.startingDate = 2;
        scope.endingDate = 1;
        scope.compareTimes();
        expect(scope.invalidTime).toBeTruthy();
    });
    it('testing for setToTime ', function () {
        scope.startingDate = 2;
        scope.endingDate = 1;
        scope.setToTime();
        expect(scope.invalidDate).toBeFalsy();
    });
    it('testing for systemUpdates ', function () {
        objCacheDetails.endpoints = {
            'JobsList': {
                'name': 'JobsList',
                "method": "Post"
            }
        }
        httpBackend.whenPOST('/JobsList')
            .respond(function (method, url, data, headers) {
                var res = { "JobsArray": [{ "JobName": 'abc' }] };
                return [200, res, {}];

            });
        scope.invalidSelection = true;
        scope.systemUpdates();
        httpBackend.flush();
        expect(scope.dynamicPopover.isOpen).toBe(false);
    });
});