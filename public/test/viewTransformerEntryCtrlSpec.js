'use strict';
var objCacheDetails;
describe('userSettingsCtrl testing', function () {

    var scope, viewTransformerEntryCtrl, modalInstanceMock, state;


    beforeEach(angular.mock.module('dataVINEApp'));

    beforeEach(function () {
        inject(function ($injector, $controller, $rootScope) {
            scope = $rootScope.$new();
            objCacheDetails.data = {};
            objCacheDetails = { 'data': { 'selectedData': { 'TransformerID': 1, 'HypersproutID': '1', 'transformerSl': '1', 'kvaRating': 'aa', 'type': '1', 'hvlv': 'usa', 'hypSl': 'hassan', 'latitude': 'mysore', 'longitude': '1', 'ctRatio': '1', 'ptRatio': 1,'ratedVoltage': 1, 'phases': '1', 'maxDemand': '1', 'frequency': 'aa', 'measurementClass': '1', 'complaintStandard': 'usa', 'gprs': 'hassan', 'wifiMacId': 'mysore', 'wifiIpAdd': '1', 'wifiAccessPwd': '1', 'simCard': 1,'sensorRating': '1', 'MaxOilTemp': 'aa', 'MinOilTemp': '1', 'Make': 'usa', 'HighLineVoltage': 'hassan', 'LowLineVoltage': 'mysore', 'HighLineCurrent': '1', 'LowLineCurrent': '1', 'HypersproutVersion': 1, 'HypersproutMake': '1', 'Accuracy': 'aa', 'HSDemandResetDate': '1', 'MaxDemandSlidingWindowInterval': 'usa', 'ConnectedStreetlights': 'hassan', 'StreetlightsMetered': '2', 'StreetlightUsage': '484', 'NoOfConnectedStreetlights': '55', 'WireSize': '44'}}};
            modalInstanceMock = {
                dismiss: function (result) {

                }
            };
            spyOn(modalInstanceMock, "dismiss");
            state = $injector.get('$state');
            viewTransformerEntryCtrl = $controller('viewTransformerEntryCtrl', {
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
        expect(scope.transfomerdetails.WireSize).toBe('44');
    });
});