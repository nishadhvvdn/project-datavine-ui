'use strict';
describe('jobStatusCtrl testing', function () {
    var scope, jobStatusCtrl, formatDate, uibModal, httpBackend, filter, hypersproutMgmtService, timeout, refreshservice;
    beforeEach(angular.mock.module('dataVINEApp'));
    beforeEach(function () {
        inject(function ($injector, $controller, $rootScope, $sessionStorage, $httpBackend) {
            objCacheDetails = { "userDetails": { "timeZone": "America/Adak" } };
            scope = $rootScope.$new(); //scope = $injector.get('$rootScope')
            filter = $injector.get('$filter');
            uibModal = $injector.get('$uibModal');
            timeout = $injector.get('$timeout');
            hypersproutMgmtService = $injector.get('hypersproutMgmtService');
            refreshservice = $injector.get('refreshservice');
            $sessionStorage.put('loginName', 'a');
            $sessionStorage.put('password', 'a');
            formatDate = $injector.get('formatDate');
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
                    var res = { 'JobsArray': [{ JobName: '123' }] };
                    return [200, res, {}];

                });
            // tagData=[{"Start Time":"Thu Nov 17 2016 12:47:32 GMT+0530 (India Standard Time)"}]
            jobStatusCtrl = $controller('jobStatusCtrl', {
                '$scope': scope,
                '$uibModal': uibModal,
                '$timeout': timeout,
                'hypersproutMgmtService': hypersproutMgmtService,
                '$filter': filter,
                'refreshservice': refreshservice,
                'type': 'Meter',
                'formatDate': formatDate
            });
        }); // end of inject
    }); // end of beforeEach

    /*  it('first testcase', function () {
          console.log('reached inside', scope.isCollapsed);
          expect(true).toBe(true);
      });*/
    it('testing init function', function () {
        //expect(scope.tagOptions.data['Serial Number']).toEqual('123');
        httpBackend.flush();

    });
    it('testing for open1 function', function () {
        scope.popup1.opened = false;
        scope.open1();
        expect(scope.popup1.opened).toBeTruthy();

    });
    it('testing for open2 function', function () {
        scope.popup2.opened = false;
        scope.open2();
        expect(scope.popup2.opened).toBeTruthy();
    });
    it('testing for print function', function () {
        window.print();
        scope.printCart();
    });
    it('testing for positive function', function () {
        // scope.dynamicPopover.isOpen = false;
        scope.startingDate = "Tue Sep 27 2016 12:47:00 GMT+0530 (India Standard Time)";
        scope.endingDate = "Thu Nov 17 2016 12:47:00 GMT+0530 (India Standard Time)";
        scope.compareDates();
        expect(scope.invalidDate).toBeTruthy;
        // expect( scope.dynamicPopover.isOpen).toBeTruthy();
    });
    it('testing for negitive function', function () {
        // scope.dynamicPopover.isOpen = false;
        scope.startingDate = "Thu Nov 17 2016 12:47:00 GMT+0530 (India Standard Time)";
        scope.endingDate = "Tue Sep 27 2016 12:47:00 GMT+0530 (India Standard Time)";
        scope.compareDates();
        expect(scope.invalidDate).toBeFalsy;
        expect(scope.invalidTime).toBeFalsy;
    });
    /*it('testing for jobFilter function', function () {
        scope.tagData=[{"Start Time":"Thu Nov 17 2016 12:47:32 GMT+0530 (India Standard Time)"}];
        scope.startingDate = "Thu Nov 17 2016 12:47:32 GMT+0530 (India Standard Time)";
        scope.endingDate = "Tue Sep 27 2016 12:47:32 GMT+0530 (India Standard Time)";
        // scope.dynamicPopover.isOpen = false;
        //var startDate =scope.startingDate;
        //scope.startingDate
        //var endDate = 2016-11-16T09:22:32.590Z;
        scope.jobStatusFilterConfig();
       //expect(startDate).toBeDefined();
        // expect( scope.dynamicPopover.isOpen).toBeTruthy();
     });*/
    it('positive testing open  function', function () {

        scope.statusOptions.exporterPdfFooter(2, 15);
        var obj = { "styles": { "headerStyle": {} } };
        scope.statusOptions.exporterPdfCustomFormatter(obj);
        //scope.statusOptions.onRegisterApi(obj);
        //scope.toggled(obj);
        // expect(scope.dynamicPopover.isOpen).toBeFalsy();
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
    it('testing for toggleMode function', function () {
        scope.toggleMode();

    });
    it('testing for setFromDate function', function () {
        scope.setFromDate(obj);
    });
    it('testing for setToDate function', function () {
        scope.setToDate(obj);
    });
    it('testing for setStartTime function', function () {
        scope.setStartTime(obj);
    });
    it('testing for setToTime function', function () {
        scope.setToTime(obj);
    });
    it('testing for comparePositiveTime function', function () {
        scope.startingDate = "Tue Sep 27 2016 12:47:00 GMT+0530 (India Standard Time)";
        scope.endingDate = "Thu Nov 17 2016 12:47:00 GMT+0530 (India Standard Time)";
        scope.compareTimes();
        expect(scope.invalidTime).toBeTruthy();
    });
    it('testing for compareNegitiveTime function', function () {
        scope.startingDate = "Thu Nov 17 2016 12:47:32 GMT+0530 (India Standard Time)";
        scope.endingDate = "Tue Sep 27 2016 12:47:32 GMT+0530 (India Standard Time)";
        scope.compareTimes();
        expect(scope.invalidTime).toBeFalsy();
    });
    it('testing for setDate function', function () {
        scope.setDate(2016, 9, 26);
    });
    it('testing for jobs  function', function () {
        scope.ListOfItems[0].isSelected = true
        scope.ListOfItems[1].isSelected = true
        scope.ListOfJobs[0].isSelected = true
        scope.ListOfJobs[1].isSelected = true
        expect(scope.allJobs).toBeFalsy();
        scope.jobs();
    });
    it('testing for jobs  function', function () {
        scope.ListOfItems[0].isSelected = true
        scope.ListOfItems[1].isSelected = true
        scope.jobs();
        expect(scope.selectedJobs).toBeFalsy();
    });
    it('testing for jobs  function', function () {
        scope.ListOfJobs[0].isSelected = true
        scope.ListOfJobs[1].isSelected = true
        scope.jobs();
        expect(scope.selectedJobs).toBeFalsy();
    });
    it('testing for jobs  function', function () {
        scope.ListOfItems[0].isSelected = false
        scope.ListOfItems[1].isSelected = false
        scope.ListOfJobs[0].isSelected = false
        scope.ListOfJobs[1].isSelected = false
        scope.jobs();
        expect(scope.selectedJobs).toBeFalsy();
    });
    it('testing for meterJobFilterConfig  function', function () {
        scope.ListOfItems[0].isSelected = true
        scope.ListOfItems[1].isSelected = true
        httpBackend.whenPOST('/JobsList')
            .respond(function (method, url, data, headers) {
                var res = { 'JobsArray': [{ JobName: '123' }] };
                return [200, res, {}];

        });
        scope.jobStatusMeterOrHyperSproutFilterConfig();
        httpBackend.flush();
    });

});
