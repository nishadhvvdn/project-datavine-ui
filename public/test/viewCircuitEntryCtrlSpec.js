'use strict';
var objCacheDetails;
describe('userSettingsCtrl testing', function () {

    var scope, viewCircuitEntryCtrl, modalInstanceMock, state;


    beforeEach(angular.mock.module('dataVINEApp'));

    beforeEach(function () {
        inject(function ($injector, $controller, $rootScope) {
            scope = $rootScope.$new();
            objCacheDetails.data = {};
            objCacheDetails = { 'data': { 'selectedData': { 'circuitId': 1, 'kvaRating': '1', 'substationId': '1', 'substationName': 'aa', 'substationAdd': '1', 'country': 'usa', 'state': 'hassan', 'city': 'mysore', 'zipcode': '1', 'Latitude': '1', 'Longitude': 1 } } };
            modalInstanceMock = {
                dismiss: function (result) {

                }
            };
            spyOn(modalInstanceMock, "dismiss");
            state = $injector.get('$state');
            viewCircuitEntryCtrl = $controller('viewCircuitEntryCtrl', {
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
        expect(scope.longitude).toBe(1);
    });
});