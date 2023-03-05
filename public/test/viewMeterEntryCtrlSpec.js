'use strict';
var objCacheDetails;
describe('userSettingsCtrl testing', function () {

    var scope, viewMeterEntryCtrl, modalInstanceMock, state;


    beforeEach(angular.mock.module('dataVINEApp'));

    beforeEach(function () {
        inject(function ($injector, $controller, $rootScope) {
            scope = $rootScope.$new();
            objCacheDetails.data = {};
            objCacheDetails = { 'data': { 'selectedData': { 'MeterID': 1, 'meterSl': '1', 'applicationType': '1', 'installationLocation': 'aa', 'ctRatioMeter': '1', 'ptRatioMeter': 'usa', 'phasesMeter': 'hassan', 'ratedFrequencyMeter': 'mysore', 'ratedVoltageMeter': '1', 'nominalCurrent': '1', 'maximumCurrent': 1,'complaintStandardMeter': 1, 'wifiIpAddMeter': '1', 'wifiMacIdMeter': '1', 'wifiAccessPwdMeter': 'aa', 'meterAdminPwd': '1', 'latitudeMeter': 'usa', 'longitudeMeter': 'hassan', 'consumerNumber': 'mysore', 'consumerName': '1', 'contactNumber': '1', 'consumerAddress': 1,'consumerState': '1', 'consumerCity': 'aa', 'consumerZipcode': '1', 'billingDate': 'usa', 'billingTime': 'hassan', 'demandResetDate': 'mysore', 'meterMake': '1', 'meterDisconnector': '1', 'ImpulseCountperKWh': 1, 'ImpulseCountPerKVARh': '1', 'MeasurementClass': 'aa', 'MeterVersion': '1', 'SealID': 'usa', 'BiDirectional': 'hassan'}}};
            modalInstanceMock = {
                dismiss: function (result) {

                }
            };
            spyOn(modalInstanceMock, "dismiss");
            state = $injector.get('$state');
            viewMeterEntryCtrl = $controller('viewMeterEntryCtrl', {
                '$scope': scope,
                '$modalInstance': modalInstanceMock,
                '$state': state
            });
        });
    });
    it('test for pageload', function () {
        modalInstanceMock = {
            dismiss: function (result) {

            }
        };
        spyOn(modalInstanceMock, "dismiss");
        scope.ok();
    });
    it('testing for init function', function () {
        expect(scope.meterdetails.BiDirectional).toBe('hassan');
    });
});