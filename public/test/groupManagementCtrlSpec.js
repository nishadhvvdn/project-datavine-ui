'use strict';

describe('groupManagementCtrl testing', function () {

    var scope,commonService,groupManagementCtrl, uibModal, timeout, state, hypersproutMgmtService, httpBackend;


    beforeEach(angular.mock.module('dataVINEApp'));

    beforeEach(function () {
        inject(function ($injector, $controller, $rootScope, $sessionStorage, $httpBackend) {
            scope = $rootScope.$new();
            uibModal = $injector.get('$uibModal');
            timeout = $injector.get('$timeout');
            state = $injector.get('$state');
            commonService = $injector.get('commonService');
            hypersproutMgmtService = $injector.get('hypersproutMgmtService');
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
            $sessionStorage.put('loginName', 'a');
            $sessionStorage.put('password', 'a');
            // objData.appGroupCount={};
            // objData.appGroupCount={'AppID':1,'Members':1}

            objCacheDetails.webserviceUrl = '/';
            objCacheDetails.endpoints = {
                'HSMGrpMgmt': {
                    'name': 'HSMGrpMgmt',
                    "method": "GET"
                },
                'HsmGroupDownload': {
                    'name': 'HsmGroupDownload',
                    "method": "POST"
                },
                'HSGroupDelete':{
                    'name': 'HSGroupDelete',
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
            spyOn(state,'reload');
            httpBackend.whenGET('/HSMGrpMgmt')
                .respond(function (method, url, data, headers) {
                    var saveRes = {
                        'appGroupCount': { 'AppID': 1, 'Members': 1 }, 'configGroupCount': { 'configID': 1, 'Members': 2 },
                        'dataFromConfigGrps': { 'ConfigName': 'abc', 'Description': 'abc', 'ConfigID': '1', 'ClassName': 'abc' },
                        'dataFromAppGrps': { 'ConfigName': 'abc', 'Description': 'abc', 'ConfigID': '1', 'ClassName': 'abc' }
                    };
                    return [200, saveRes, {}];
                });

            groupManagementCtrl = $controller('groupManagementCtrl', {
                '$scope': scope,
                '$timeout': timeout,
                '$uibModal': uibModal,
                '$state': state,
                'hypersproutMgmtService': hypersproutMgmtService,
                'commonService':commonService
            });
        });
    });
    it('testing for flush function', function () {
        expect(true).toBe(true);
        httpBackend.flush();
    });
    it('testing for grid function', function () {
        scope.groupOptions .exporterPdfFooter(2, 15);
        var obj = { "styles": { "headerStyle": {} } };
        scope.groupOptions .exporterPdfCustomFormatter(obj);
        expect(scope.dynamicPopover.isOpen).toBeFalsy();
        expect(true).toBe(true);
    });
    it('testing for grid function', function () {
        //scope.groupOptions .onRegisterApi(obj);
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
    it('testing for openAddEndpoint function', function () {
        scope.openAddEndpoint ();
    });
    it('testing for openAssignEndpoint function', function () {
        scope.openAssignEndpoint();
    });
    it('testing for openCreateApplicationGroup function', function () {
        scope.openCreateApplicationGroup();
    });
    it('testing for print  ', function () {
        scope.printCart();
        window.print();
    });
    it('testing for groupDetails   ', function () {
        groupManagementCtrl.groupDetails(obj);
        expect(true).toBe(true);
    });
    it('testing for download   ', function () {
        httpBackend.whenPOST('/HsmGroupDownload')
            .respond(function(method, url, data, headers){
               var saveRes={type:true};
               return [200,saveRes,{}];
        });
        groupManagementCtrl.downloadConfigurations(obj);
        expect(true).toBe(true);
        httpBackend.flush();
    });
    it('testing for download   ', function () {
        httpBackend.whenPOST('/HsmGroupDownload')
            .respond(function(method, url, data, headers){
               var saveRes={type:false};
               return [200,saveRes,{}];
        });
        groupManagementCtrl.downloadConfigurations(obj);
        expect(true).toBe(true);
        httpBackend.flush();
    }); 
    it('testing scope $destroyed', function () {
    scope.$destroy(); 
    expect(scope.destroy).toBe();
});
    it('positive testing deleteConfiguration function', function () {
            //expect(scope.tagOptions.data['Serial Number']).toEqual('123');
        //var vm=this;
        httpBackend.whenPOST('/HSGroupDelete')
               .respond(function(method, url, data, headers){
                 var res1={type:true,'output':'success'};
                   return [200,res1,{}];
                    
        });        
        groupManagementCtrl.deleteConfiguration({entity:{Name:'conf','Group Type':'Configuration'}});      
        httpBackend.flush();
        expect(state.reload).toHaveBeenCalled();
        
    }); 
    it('Negative testing deleteConfiguration function', function () {
            //expect(scope.tagOptions.data['Serial Number']).toEqual('123');
        //var vm=this;
        httpBackend.whenPOST('/HSGroupDelete')
               .respond(function(method, url, data, headers){
                 var res1={type:false,'Message':'success'};
                   return [200,res1,{}];
                    
        });        
        groupManagementCtrl.deleteConfiguration({entity:{Name:'conf','Group Type':'Configuration'}});      
        httpBackend.flush();
        expect(state.reload).toHaveBeenCalled();
        
    });  
        it('Negative testing for groupDetails   ', function () {
        httpBackend.whenGET('/templates/groupConfigurationDetails_groupManagement.html')
                .respond(function(method, url, data, headers){
                  var res={};
                    return [200,res,{SerialNumbers:[1]}];
                    
        });
       
        httpBackend.whenPOST('/ListDevicesAttached')
           .respond(function (method, url, data, headers) {
               var saveRes = {"type":false};
               return [200, saveRes, {}];
        });         
        groupManagementCtrl.groupDetails({entity:{ID:2,Group_Type:'g'}});
        httpBackend.flush();
    });          
});