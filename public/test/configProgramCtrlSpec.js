'use strict';
var objCacheDetails;
describe('configProgramCtrl testing', function () {

    var scope, configProgramCtrl, HypersproutMgmtService,httpBackend, state, timeout, uibModal;


    beforeEach(angular.mock.module('dataVINEApp'));

    beforeEach(function () {
        inject(function ($injector, $controller, $rootScope,$sessionStorage,$httpBackend) {
            objCacheDetails = { "data": { "configurationDetails": { "selectedRow": { "Name": "config1", "Device Class": "unknown", "Description": "xyz" } } } };
            scope = $rootScope.$new(); //scope = $injector.get('$rootScope')
            state = $injector.get('$state');
            uibModal = $injector.get('$uibModal');
            timeout = $injector.get('$timeout');
            $sessionStorage.put('loginName','a');
            $sessionStorage.put('password','a');  
            objCacheDetails.webserviceUrl = '/'; 
            objCacheDetails.endpoints = {
                'configPrograms': {
                    'name': 'configPrograms',
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
}
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

            httpBackend.whenPOST('/configPrograms')
                .respond(function(method, url, data, headers){
                  var res={'memberInfo':[{Members:1}],configProgramData:[{Name:'abc'}]};
                    return [200,res,{}];
                    
            });
            spyOn(state,'reload');            
        HypersproutMgmtService = $injector.get('hypersproutMgmtService');
            configProgramCtrl = $controller('configProgramCtrl', {
                '$scope': scope,
                '$uibModal': uibModal,
                '$timeout': timeout,
                '$state': state,
                'hypersproutMgmtService':HypersproutMgmtService,
                'type':'HyperSprout'
            });
        }); // end of inject
    }); // end of beforeEach
    it('testing init function', function () {
            //expect(scope.tagOptions.data['Serial Number']).toEqual('123');
        httpBackend.flush();
        objCacheDetails.endpoints = {
                'ConfigProgramsDelete': {
                    'name': 'ConfigProgramsDelete',
                    "method": "post"
                } 
        };
    });
   it('positive testing open  function', function () {  
       scope.configPrgmOptions.exporterPdfFooter(2,15);
        var obj={"styles":{"headerStyle":{}}};
         scope.configPrgmOptions.exporterPdfCustomFormatter(obj);
         //scope.configPrgmOptions.onRegisterApi(obj);
    })    
    it('testing delete function', function () {
            //expect(scope.tagOptions.data['Serial Number']).toEqual('123');
        //var vm=this;
        httpBackend.whenPOST('/ConfigProgramsDelete')
               .respond(function(method, url, data, headers){
                 var res={'memberInfo':[{Members:1}],configProgramData:[{Name:'abc'}]};
                   return [200,res,{}];
                    
        });        
        configProgramCtrl.deleteConfiguration({entity:{Name:'conf'}});      
        httpBackend.flush();
        expect(state.reload).toHaveBeenCalled();
        
    });
    it('testing openConfigPrgm function', function () {
    scope.openConfigPrgm();
        
    });    
    it('testing editConfiguration function', function () {
    configProgramCtrl.editConfiguration();
        
    }); 
     it('testing for print function', function () {
        window.print();
        scope.printCart ();
        //expect(true).toBe(true);
    });   
           
});
