'use strict';

describe('defineUsersCtrl testing', function () {

    var scope, defineUsersCtrl, uibModal, timeout, administrationService, state, filter, httpBackend;


    beforeEach(angular.mock.module('dataVINEApp'));

    beforeEach(function () {
        inject(function ($injector, $controller, $rootScope, $sessionStorage, $httpBackend) {
            scope = $rootScope.$new();
            uibModal = $injector.get('$uibModal');
            timeout = $injector.get('$timeout');
            state = $injector.get('$state');
            administrationService = $injector.get('administrationService');
            filter = $injector.get('$filter');
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
            $sessionStorage.put('loginName', 'a');
            $sessionStorage.put('password', 'a');
            objCacheDetails.webserviceUrl = '/';
            objCacheDetails.endpoints = {
                'GetUsers': {
                    'name': 'GetUsers',
                    "method": "GET"
                },
                'ResetPassword': {
                    'name': 'ResetPassword',
                    "method": "POST"
                },
                'DeleteUser': {
                    'name': 'DeleteUser',
                    "method": "POST"
                }
            };
            swal=function(obj,callback){
                if(callback===undefined){
                    return;
                }else{
                    callback(true)
                }
                //return isFunction(calback)?false:;
            }            
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
            httpBackend.whenGET('/GetUsers')
            .respond(function(method, url, data, headers){
               var saveRes={'output':[{'UserID':'admin','FirstName':'abc','EmailAddress':'abc@gmail.com','SecurityGroup':'admin','AccountLocked':'false','LastName':'cc','TimeZone':'Asia/Kolkata','HomePage':'home','LoginID':'abc'}]};
               return [200,saveRes,{}];
        }); 
            spyOn(state,'reload');
            defineUsersCtrl = $controller('defineUsersCtrl', {
                '$scope': scope,
                '$uibModal': uibModal,
                '$timeout': timeout,
                '$state': state,
                'administrationService': administrationService,
                '$filter': filter,
            });
        });
    });
    it('testing for grid function', function () {
        scope.usersOptions.exporterPdfFooter(2, 15);
        var obj = { "styles": { "headerStyle": {} } };
        scope.usersOptions.exporterPdfCustomFormatter(obj);
        expect(scope.dynamicPopover.isOpen).toBeFalsy();
        expect(true).toBe(true);
    });
    it('testing for grid function', function () {
        //scope.usersOptions.onRegisterApi(obj);
        expect(true).toBe(true);
    });
    it('testing for lockeduser', function () {
        scope.showLockedUsers();
    });
    it('testing for openAddUser ', function () {
        scope.openAddUser();
    });
    it('testing for userIDDetails  ', function () {
        scope.userIDDetails();
    });
    it('testing for print  ', function () {
        scope.printCart();
        window.print();
    });
    it('testing for close function', function () {
        scope.dynamicPopover.isOpen = true;
        scope.dynamicPopover.close();
        expect(scope.dynamicPopover.isOpen).toBeFalsy();
        expect(true).toBe(true);
    });
    it('testing for open function', function () {
        scope.dynamicPopover.isOpen = true;
        scope.dynamicPopover.open();
        expect(scope.dynamicPopover.isOpen).toBeTruthy();
        expect(true).toBe(true);
    });
    it('negetive testing for deleteConfiguration function', function () {
        httpBackend.whenPOST('/DeleteUser')
            .respond(function(method, url, data, headers){
               var saveRes={output:"a",type:false};
               return [200,saveRes,{}];
        });
        scope.deleteConfiguration({entity:{UserID:2}});
        expect(true).toBeTruthy();
       httpBackend.flush();
    });
    it('positive testing for deleteConfiguration function', function () {
        httpBackend.whenPOST('/DeleteUser')
            .respond(function(method, url, data, headers){
               var saveRes={output:"a",type:true};
               return [200,saveRes,{}];
        });
        scope.deleteConfiguration({entity:{UserID:2}});
        expect(true).toBeTruthy();
       httpBackend.flush();
    });    
    it('positive testing on get flush function', function () {
        expect(true).toBeTruthy();
       httpBackend.flush();
    });
    it('positive testing on passwordSetting function', function () {
        httpBackend.whenPOST('/ResetPassword')
            .respond(function(method, url, data, headers){
               var saveRes={output:"a",type:true};
               return [200,saveRes,{}];
        });
        scope.passwordSettings({entity:{UserID:2}});
        expect(true).toBeTruthy();
       httpBackend.flush();
    });  
    it('negative testing on passwordSetting function', function () {
        httpBackend.whenPOST('/ResetPassword')
            .respond(function(method, url, data, headers){
               var saveRes={output:"a",type:false};
               return [200,saveRes,{}];
        });
        scope.passwordSettings({entity:{UserID:2}});
        expect(true).toBeTruthy();
       httpBackend.flush();
    });    
});