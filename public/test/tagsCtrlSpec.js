'use strict';
describe('discrepanciesCtrl testing', function () {
    var scope, discrepanciesCtrl,timeout,httpBackend,hypersproutMgmtService,filter,rootScope, refreshservice ;
    var obj={"styles":{"headerStyle":{}}};
    beforeEach(angular.mock.module('dataVINEApp'));
    beforeEach(function () {
        inject(function ($injector, $controller, $rootScope,$sessionStorage,$httpBackend) {    
            objCacheDetails={"userDetails":{"timeZone":"America/Adak"}};
            rootScope = $rootScope;
            scope = $rootScope.$new(); //scope = $injector.get('$rootScope')
            filter = $injector.get('$filter');
            timeout = $injector.get('$timeout');
            $sessionStorage.put('loginName','a');
            $sessionStorage.put('password','a');  
            objCacheDetails.webserviceUrl = '/'; 
            objCacheDetails.endpoints = {
                'HSMTagDiscrepancies': {
                    'name': 'HSMTagDiscrepancies',
                    "method": "post"
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

                    httpBackend.whenPOST('/HSMTagDiscrepancies')
                .respond(function(method, url, data, headers){
                  var res={"type":true,"TagDiscrepanciesSelected":[{"_id":"58cb843580972bb01707480b","TagID":"SydxTVVWFjg","SerialNumber":"000000000000000CELL3_TEST","TagDiscrepanciesDevice":"HyperSprout","ConfigurationTab":"LowVoltageThreshold:40","DiscrepantTag":"LowVoltageThreshold:200","FirstFoundTime":"2017-03-17T06:37:41.193Z","IsCorrected":"N"}]};
                    return [200,res,{}];
                    
            }); 
            hypersproutMgmtService = $injector.get('hypersproutMgmtService');
            refreshservice = $injector.get('refreshservice');
           // tagData=[{"Start Time":"Thu Nov 17 2016 12:47:32 GMT+0530 (India Standard Time)"}]
            discrepanciesCtrl = $controller('discrepanciesCtrl', {
                '$scope': scope,
                '$timeout':timeout,
                'hypersproutMgmtService': hypersproutMgmtService,
                '$filter': filter,
                'refreshservice' : refreshservice,
                'endpoint':'HSMTagDiscrepancies'
            });
        }); // end of inject
    }); // end of beforeEach
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
         scope.printCart ();
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
        scope.startingDate = "Thu Nov 17 2016 12:47:00 GMT+0530 (India Standard Time)";
        scope.endingDate = "Tue Sep 27 2016 12:47:00 GMT+0530 (India Standard Time)";
        scope.compareDates();
        expect(scope.invalidDate).toBeFalsy;
        expect(scope.invalidTime).toBeFalsy;
     });
     it('positive testing open  function', function () {
       
        scope.tagOptions.exporterPdfFooter(2,15);
         
          scope.tagOptions.exporterPdfCustomFormatter(obj);
          //scope.tagOptions.onRegisterApi(obj);
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
         scope.startingDate = "Thu Nov 17 2016 12:47:00 GMT+0530 (India Standard Time)";
         scope.endingDate = "Tue Sep 27 2016 12:47:00 GMT+0530 (India Standard Time)";
         scope.compareTimes();
         expect(scope.invalidTime).toBeFalsy();
     });
      it('testing for setDate function', function () {
        scope.setDate(2016, 9,26);
     });
      it('testing for tag filter config function', function () {
          scope.object.correctedState = "correctedOnly";
          scope.tagFilterConfig();
          //console.log('testffhgff',scope.tagOptions.data);
     });
      it('testing for tag filter config function', function () {
          scope.object.correctedState = "discrepentOnly";
          scope.tagFilterConfig();
     });
     it('testing for tag filter config function', function () {
          scope.object.correctedState = "all";
          scope.tagFilterConfig();
     });
     /*it('testing for object function', function () {
       // objData={"JobStatusHSMSelected":{"JobID":22121212}};
    });*/

   /* it('test case for karma rejected',function(done){
        scope.x(function(e){
            expect(e.message).toBe('Unauthorized access');
            return done();
        });
        rootScope.$digest();
    });*/
    it('testing for tags function', function () {
        scope.tags ();
        expect(scope.invalidSelection).toBeFalsy();
     });

});
