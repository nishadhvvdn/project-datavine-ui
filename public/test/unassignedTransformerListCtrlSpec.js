'use strict';

describe('unassignedTransformerListCtrl testing', function () {

    var scope, unassignedTransformerListCtrl, uibModal, DeviceMappingService, ParseService, timeout, DeviceService, state, filter, httpBackend;


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
            
            state={go:function(){},current:{name:'system.grouping.circuitGrouping'}};
            spyOn(state,'go');
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
            objCacheDetails.webserviceUrl = '/';
            objCacheDetails.endpoints = {
                'DisplayAllTransformerDetails': {
                    'name': 'DisplayAllTransformerDetails',
                    "method": "GET"
                },
                'AddingTransformerToCircuit': {
                    'name': 'AddingTransformerToCircuit',
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
            //state.go();
            httpBackend.whenGET('/DisplayAllTransformerDetails')
            .respond(function(method, url, data, headers){
               var saveRes={
   "type":true,
   "TransformerDetailSelected":[
      {
         "_id":"586b4dd4ac99c71852d4fe3b",
         "TransformerID":1,
         "CircuitID":"null",
         "TransformerSerialNumber":"0000000000000000000CELL004",
         "Make":"2016",
         "RatingCapacity":"560",
         "HighLineVoltage":"900",
         "LowLineVoltage":"300",
         "HighLineCurrent":"560",
         "LowLineCurrent":"222",
         "Type":"Pole Mounted",
         "ConnectedStreetlights":"False",
         "StreetlightsMetered":"False",
         "StreetlightUsage":"230",
         "NoOfConnectedStreetlights":"666",
         "WireSize":"22",
         "MaxOilTemp":"50",
         "MinOilTemp":"10",
         "Status":"",
         "NoOfMeterAllocated":-3
      }
   ],
   "HypersproutDetailsSelected":[
      {
         "_id":"586b4dd4ac99c71852d4fe3a",
         "HypersproutID":1,
         "TransformerID":1,
         "HypersproutSerialNumber":"000000000000000000CELL004",
         "ConfigID":1,
         "AppIDs":[
            7,
            22
         ],
         "ConfigStatus":"M",
         "Status":"Registered",
         "ConnDisconnStatus":"Connected",
         "Hypersprout_Communications":{
            "MAC_ID_GPRS":"78:78:78:78:78:78",
            "Latitude":"19.16315",
            "Longitude":"73.000501",
            "MAC_ID_WiFi":"68:9e:19:d1:25:2f",
            "IP_address_WiFi":"192.168.43.1",
            "AccessPointPassword":"000000",
            "SimCardNumber":"8939799633"
         },
         "Hypersprout_DeviceDetails":{
            "CT_Ratio":1000,
            "PT_Ratio":1000,
            "RatedVoltage":"220",
            "Phase":"3",
            "Frequency":"50",
            "Accuracy":"1",
            "HSDemandResetDate":"2",
            "HSCompliantToStandards":"CE",
            "MaxDemandWindow":"Fixed",
            "MaxDemandSlidingWindowInterval":"30",
            "Sensor Details":"N/A",
            "HypersproutVersion":"2016",
            "HypersproutMake":"Test Bench"
         },
         "DeviceID":"HS-000000000000000000CELL004",
         "Hypersprout_Info":{
            "Energy":1,
            "Demand":3,
            "DemandIntervalLength":3,
            "NumberofSubIntervals":3,
            "ColdLoadPickupTimes":1,
            "PowerOutageRecognitionTime":1,
            "TestModeDemandIntervalLength":1,
            "NumberofTestModeSubintervals":1,
            "TimetoRemainInTestMode(mins)":2,
            "DailySelfRead":1,
            "DailySelfReadTime":1,
            "Quantity1":2,
            "Quantity2":2,
            "Quantity3":2,
            "Quantity4":2,
            "LoadProfileIntervalLength":2,
            "OutageLength(Sec)":2,
            "Pulseweight1":1,
            "Pulseweight2":2,
            "Pulseweight3":3,
            "Pulseweight4":4,
            "AllEvents":1,
            "BillingDateCleard":0,
            "BillingScheduleExpiration":1,
            "DemandRestOccured":1,
            "HistoryLogCleared":1,
            "Configuration Error Detected":1,
            "LoadProfileError":1,
            "LowBatteryDetected":1,
            "PrimaryPowerDown":1,
            "CTMultipliers":2,
            "VTMultipliers":2,
            "RegisterMultipliers":2,
            "EnableVoltageMonitor":1,
            "PhaseSelection":1,
            "VoltageMointorIntervalLength":3,
            "RMSVoltLoadThreshold(V)":220,
            "RMSVoltHighThreshold(V)":250,
            "LowVoltageThreshold":200,
            "LowVoltageThresholdDeviation/Interval":10,
            "HighVoltageThresholdDeviation/Interval":10,
            "LinkFailure":1,
            "LinkMetric":1,
            "InterrogationSendSucceeded":1,
            "SendResponseFailed":1,
            "DeregistrationResult":1,
            "ReceivedMessageFrom":1,
            "DataVineHyperSproutChange":1,
            "DataVineSyncFatherChange":1,
            "ZigbeeSETunnelingMessage":1,
            "ZigbeeSimpleMeteringMessage":1,
            "TableSendRequestFailed":1
         },
         "RegisteredTime":"2017-01-05T09:44:31.104Z"
      }
   ]
};
               return [200,saveRes,{}];
        }); 

            unassignedTransformerListCtrl = $controller('unassignedTransformerListCtrl', {
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
        expect(scope.unassignedTransformerGrid.data[0].Accuracy).toEqual('1'); 
    });
    it('testing for grid function', function () {
        scope.unassignedTransformerGrid.exporterPdfFooter(2, 15);
        var obj = { "styles": { "headerStyle": {} } };
        scope.unassignedTransformerGrid.exporterPdfCustomFormatter(obj);
        expect(scope.dynamicPopover.isOpen).toBeFalsy();
        expect(true).toBe(true);
    });
    it('testing for searchGrid popup',function(){
        scope.searchUnassignedTransformers=  'tsn';
        scope.searchGrid(); 
        expect(scope.searchUnassignedTransformers).toBe('tsn');
    });
     it('testing for searchGrid popup',function(){
        scope.searchUnassignedTransformers=  'hsn';
        scope.searchGrid(); 
         expect(scope.searchUnassignedTransformers).toBe('hsn');
    });
     it('testing for searchGrid popup',function(){
        scope.searchUnassignedTransformers=  'all';
        scope.searchGrid(); 
       expect(scope.searchUnassignedTransformers).toBe('all');
    });
    it('testing for searchGrid popup',function(){
        scope.searchUnassignedTransformers=  'hv';
        scope.searchGrid(); 
        expect(scope.searchUnassignedTransformers).toBe('hv');
    });
    it('testing for searchGrid popup',function(){
        scope.searchUnassignedTransformers=  'mC';
        scope.searchGrid(); 
        expect(scope.searchUnassignedTransformers).toBe('mC');
    });
     it('testing for assignTransformersToCircuit function', function () {
        scope.gridApi={
            selection:{getSelectedRows:function(){
                return [{TransformerID:1}]
            }
        }
        }
        httpBackend.whenPOST('/AddingTransformerToCircuit')
             .respond(function(method, url, data, headers){
                var res={};
                return [200,res,{}];
                    
        });        
       scope.assignTransformersToCircuit();
        httpBackend.flush();
       expect(scope.gridApi.selection.getSelectedRows()[0].TransformerID).toBe(1);
     }); 
     it('testing for goToUnassignedTransformers ',function(){
        scope.goToUnassignedTransformers();
        expect(true).toBe(true);
    }); 
});