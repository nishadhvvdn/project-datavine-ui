'use strict';
var objCacheDetails;
describe('createApplicationGroupCtrl testing', function () {

    var scope,httpBackend,createApplicationGroupCtrl, HypersproutMgmtService, state,MeterMgmtService, modalInstanceMock,commonService;


    beforeEach(angular.mock.module('dataVINEApp'));

    beforeEach(function () {
        inject(function ($injector, $controller, $rootScope,$sessionStorage,$httpBackend) {
            scope = $rootScope.$new(); //scope = $injector.get('$rootScope')
            $sessionStorage.put('loginName','a');
            $sessionStorage.put('password','a');            
            objCacheDetails.data = {"groupDatas": [{ "Group_Name": "Demo" }] };
            objCacheDetails.webserviceUrl = '/'; 
            objCacheDetails.endpoints = {
                'HSMGrpMgmtAssignGrpMembershipCreateAppGrp': {
                    'name': 'HSMGrpMgmtAssignGrpMembershipCreateAppGrp',
                    "method": "post"
                },
                'MMGrpMgmtAssignGrpMembershipCreateAppGrp': {
                    'name': 'MMGrpMgmtAssignGrpMembershipCreateAppGrp',
                    "method": "post"
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
            modalInstanceMock = {
                dismiss: function (result) {

                },
                close: function (result) {

                }
            };
            state = $injector.get('$state');
            //type='HyperSprout';
            HypersproutMgmtService = $injector.get('hypersproutMgmtService');
            commonService = $injector.get('commonService');
            MeterMgmtService = $injector.get('MeterMgmtService');
            // set up fake methods
            spyOn(modalInstanceMock, "dismiss","close");
            createApplicationGroupCtrl = $controller('createApplicationGroupCtrl', {
                '$scope': scope,
                '$modalInstance': modalInstanceMock,
                '$state': state,
                'hypersproutMgmtService': HypersproutMgmtService,
                'commonService':commonService,
                'type':'HyperSprout',
                'MeterMgmtService':MeterMgmtService
            });
        }); // end of inject
    }); // end of beforeEach  

    it('testing check function', function () {
        scope.groupData = { "groupID": 'demo' };
        scope.check();
        expect(scope.msg).toEqual('Name already exist!');
    });
    it('testing for wordCheck function', function () {
        scope.groupData.description = 'hchyjsgfhsdghsdgfhysgfhsgfhseg';
        scope.wordCheck ();
        expect(scope.wordMsg).toBe('A word should not contain more than 20 character');
    });
   
    it('testing check function with input as number', function () {
        scope.groupData = { "groupID": '2' };
        scope.check();
        expect(scope.groupData.groupID).toBe(undefined);
        //expect(scope.isCollapsed).toBeFalsy();
    });
    it('testing check function with input as special Charecter', function () {
        scope.specialChar=false;
        scope.groupData = { "groupID": '@' };
        scope.check();
        expect(scope.specialChar).toBeTruthy();
        //expect(scope.isCollapsed).toBeFalsy();
    });
        it('positive testing on check function', function () {
        scope.groupData = { "groupID": 'Demo' };
        scope.check();
        expect(scope.groupData.groupID).toBe('Demo');
        //expect(scope.isCollapsed).toBeFalsy();
    });



    // it('testing for cancel function', function () {
    //     modalInstanceMock = {
    //         dismiss: function (result) {

    //         }
    //     };
    //     spyOn(modalInstanceMock, "dismiss");
    //     scope.cancel();
    //     expect(true).toBe(true);
    // });

     it('testing for cancel modalInstanceMock function', function () {
        scope.cancel();
        expect(modalInstanceMock.dismiss).toHaveBeenCalled();
    });
    it('testing for print function', function () {
        window.print();
        scope.printCart();
        expect(true).toBe(true);
    });
    it('positive testing Save function', function () {
        scope.groupData={};
        scope.groupData.groupID='group1';
        scope.groupData.description='abc';
        httpBackend.whenPOST('/HSMGrpMgmtAssignGrpMembershipCreateAppGrp')
            .respond(function(method, url, data, headers){
                 var res={'Status':'abc'};
                return [200,res,{}];
        });
        scope.Save();
        httpBackend.flush();
    });
    it('positive testing Save function', function () {
        scope.groupData={};
        scope.groupData.groupID='group1';
        scope.groupData.description='abc';
        httpBackend.whenPOST('/MMGrpMgmtAssignGrpMembershipCreateAppGrp')
            .respond(function(method, url, data, headers){
                return [200,'',{}];
        });        
        httpBackend.whenPOST('/HSMGrpMgmtAssignGrpMembershipCreateAppGrp')
            .respond(function(method, url, data, headers){
                return [200,'',{}];
        });
        scope.Save();
        httpBackend.flush();
        
    }); 
    it('positive testing Save function', function () {
        scope.groupData={};
        scope.groupData.groupID='group1';
        scope.groupData.description='abc';
        httpBackend.whenPOST('/MMGrpMgmtAssignGrpMembershipCreateAppGrp')
            .respond(function(method, url, data, headers){
                return [200,'',{}];
        });        
        httpBackend.whenPOST('/HSMGrpMgmtAssignGrpMembershipCreateAppGrp')
            .respond(function(method, url, data, headers){
                return [200,'',{}];
        });
        scope.Save();
        httpBackend.flush();
    });    
});
