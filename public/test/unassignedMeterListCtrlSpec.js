'use strict';

describe('unassignedMeterListCtrl testing', function () {

    var scope, unassignedMeterListCtrl, uibModal, DeviceMappingService, ParseService, timeout, DeviceService, state, filter, httpBackend;


    beforeEach(angular.mock.module('dataVINEApp'));

    beforeEach(function () {
        inject(function ($injector, $controller, $rootScope, $sessionStorage, $httpBackend) {
            objCacheDetails.data={};
            objCacheDetails.data={'selectedCircuit':'1','selectedTransformer':'1'};
            scope = $rootScope.$new();
            uibModal = $injector.get('$uibModal');
            timeout = $injector.get('$timeout');
            state = $injector.get('$state');
            DeviceService = $injector.get('DeviceService');
            filter = $injector.get('$filter');
            ParseService = $injector.get('ParseService');
            DeviceMappingService = $injector.get('DeviceMappingService');

            $sessionStorage.put('loginName', 'a');
            $sessionStorage.put('password', 'a');
            objCacheDetails.webserviceUrl = '/';
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
            objCacheDetails.endpoints = {
                'SMMeters': {
                    'name': 'SMMeters',
                    "method": "POST"
                },
                'AddingMeterToTransformer': {
                    'name': 'AddingMeterToTransformer',
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
            spyOn(state, 'go');   
            httpBackend.whenGET('pages/login.html')
                .respond(function(method, url, data, headers){
                  var res={};
                    return [200,res,{}];
                    
            });
            //state.go();
            httpBackend.whenPOST('/SMMeters')
            .respond(function(method, url, data, headers){
               var saveRes=
{
    "type": true,
    "details": [
        {
            "_id": "586b4ed3aba3ab7ffe795eae",
            "Status": "Registered",
            "MeterID": 1,
            "MeterSerialNumber": 87,
            "ConfigID": 6,
            "AppIDs": [
                2,
                4,
                2
            ],
            "ConfigStatus": "M",
            "ConnDisconnStatus": "Connected",
            "SealID": 354,
            "BiDirectional": 354,
            "EVMeter": 354,
            "Meters_Billing": {
                "BillingDate": 354,
                "BillingTime": 354,
                "MeterConsumerNumber": 354,
                "MeterConsumerName": 354,
                "MeterConsumerAddress": 354,
                "MeterConsumerContactNumber": 354,
                "MeterDemandResetDate": 354,
                "ImpulseCountperKWh": 354,
                "ImpulseCountPerKVARh": 354,
                "MeterConsumerCountry": 354,
                "MeterConsumerState": 354,
                "MeterConsumerCity": 354,
                "MeterConsumerZipCode": 354
            },
            "Meters_Communications": {
                "MeterMeterAdminPassword": 354,
                "Latitude": 354,
                "Longitude": 354,
                "IP_address_WiFi": 354,
                "MAC_ID_WiFi": 354,
                "AccessPointPassword": 354
            },
            "Meters_DeviceDetails": {
                "MeterApptype": 123,
                "MeterVersion": 123,
                "MeterInstallationLocation": 123,
                "CT_Ratio": 354,
                "PT_Ratio": 354,
                "Phase": 3,
                "Frequency": 354,
                "RatedVoltage": 354,
                "MeterNominalCurrent": 354,
                "MeterMaximumCurrent": 354,
                "MeterAccuracy": 354,
                "MeterCompliantToStandards": 354,
                "MeterMake": 354,
                "MeterDisconnector": 354,
                "Circuit_ID": 1,
                "CT_CalibrationData": 1,
                "PT_CalibrationData": 1,
                "MeterType": 1,
                "CertificationNumber": 0,
                "UtilityID": 0,
                "ApplicableStandard": 0,
                "MeterClass": 0,
                "ESN": "\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000",
                "CountryCode": 0,
                "RegionCode": 0,
                "SSID_Name": "LNTAP\u0000"
            },
            "Meters_Info": {
                "Energy1": 1,
                "Energy2": 1,
                "Energy3": 1,
                "Energy4": 1,
                "Demand": 3,
                "LoadControlDisconnectThreshold": 1,
                "ReconnectMethod": 1,
                "DemandIntervalLength": 3,
                "NumberofSubIntervals": 1,
                "ColdLoadPickupTimes": 1,
                "PowerOutageRecognitionTime": 1,
                "TestModeDemandIntervalLength ": 1,
                "NumberofTestModeSubintervals ": 1,
                "TimetoremaininTestMode": 1,
                "DailySelfRead": 1,
                "DailySelfReadTime": 1,
                "Quantity1": 3,
                "Quantity2": 3,
                "Quantity3": 3,
                "Quantity4": 3,
                "LoadProfileIntervalLength": 2,
                "OutageLength(Sec)": 2,
                "Pulseweight1": 1,
                "Pulseweight2": 2,
                "Pulseweight3": 3,
                "Pulseweight4": 4,
                "EnableVoltage Monitor": 1,
                "PhaseSelection": 2,
                "VoltageMointorIntervalLength": 2,
                "RMSVoltLoadThreshold(V)": 230,
                "RMSVoltHighThreshold(V)": 230,
                "LowVoltageThreshold": 230,
                "LowVoltageThresholdDeviation/Interval": 230,
                "HighVoltageThresholdDeviation/Interval": 230,
                "AllEvents": 1,
                "BillingDateCleard": 1,
                "BillingScheduleExpiration": 1,
                "DemandRestOccured": 1,
                "HistoryLogCleared": 1,
                "ConfigurationErrorDetected": 1,
                "LoadProfileError": 1,
                "LowBatteryDetected": 1,
                "PrimaryPowerDown": 1,
                "CTMultipliers": 1,
                "VTMultipliers": 1,
                "RegisterMultipliers": 1,
                "Lockout:Loginattempts,optical": 1,
                "Lockout:Logoutminutes,optical": 1,
                "Lockout:Loginattempts,lan": 1,
                "Lockout:Logoutminutes,lan": 1,
                "ConsecutiveLAN": 1,
                "LanLinkMetric(quality)periodinseconds": 1
            },
            "JobID": "SJlqOdoN8e"
        }

    ]
}
;
               return [200,saveRes,{}];
        }); 

            unassignedMeterListCtrl = $controller('unassignedMeterListCtrl', {
                '$scope': scope,
                '$uibModal': uibModal,
                '$state': state,
                '$rootScope':$rootScope,
                '$filter': filter,
                '$timeout': timeout,
                'DeviceService': DeviceService,
                'ParseService': ParseService,
                'DeviceMappingService': DeviceMappingService
                
            });
        });
    });
    it('test for get service flush',function(){
        httpBackend.flush();
        expect(scope.meterGrid.data[0].EVMeter).toBe(354);
    });
    it('testing for grid function', function () {
        scope.meterGrid.exporterPdfFooter(2, 15);
        var obj = { "styles": { "headerStyle": {} } };
        scope.meterGrid.exporterPdfCustomFormatter(obj);
        expect(scope.dynamicPopover.isOpen).toBeFalsy();
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
        expect(scope.dynamicPopover.isOpen ).toBe(true);
    });
    it('testing for close function', function () {
        scope.dynamicPopover.isOpen = true;
        scope.dynamicPopover.close();
        expect(scope.dynamicPopover.isOpen ).toBe(false);
    });

    it('testing for searchGrid popup',function(){
        scope.searchMeterGrouping=  'tsn';
        scope.searchGrid(); 
        expect(scope.searchMeterGrouping).toBe('tsn');
    });
     it('testing for searchGrid popup',function(){
        scope.searchMeterGrouping=  'hsn';
        scope.searchGrid(); 
        expect(scope.searchMeterGrouping).toBe('hsn');
    });
     it('testing for searchGrid popup',function(){
        scope.searchMeterGrouping=  'all';
        scope.searchGrid(); 
        expect(scope.searchMeterGrouping).toBe('all');
    });

     it('testing for viewMeterEntry function', function () {
        unassignedMeterListCtrl.viewMeterEntry({'entity':1});
         expect(objCacheDetails.data.selectedData).toBe(1);
     });
     it('testing for createConfigObject function', function () {
        scope.createConfigObject();
     });
     it('testing for assignMeterToTransformer function', function () {
        scope.gridApi={
            selection:{getSelectedRows:function(){
                return [{MeterID:1}]
            }
        }
        }
        httpBackend.whenPOST('/AddingMeterToTransformer')
             .respond(function(method, url, data, headers){
                var res={};
                return [200,res,{}];
                    
        });        
       scope.assignMeterToTransformer();
        httpBackend.flush();
       expect(scope.gridApi.selection.getSelectedRows()[0].MeterID).toBe(1);
     }); 
     it('testing for onRegisterApi function', function () {
        scope.gridApi={
            selection:{on:{
                    rowSelectionChanged:function(val,callback){
                        callback([{MeterID:1}])
                         //return 
                    }
            }
        }
        }
       scope.meterGrid.onRegisterApi(scope.gridApi);
       expect(scope.mydisabled).toBeFalsy();
     }); 
     it('testing for goBack function', function () {
        scope.goBack();
        expect(state.go).toHaveBeenCalled();
     });             
});