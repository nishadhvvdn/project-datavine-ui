'use strict';
var objCacheDetails;
describe('groupConfigurationDetailsCtrl testing', function () {

    var scope, groupConfigurationDetailsCtrl, modalInstance, state, modalInstanceMock;


    beforeEach(angular.mock.module('dataVINEApp'));

    beforeEach(function () {
        inject(function ($injector, $controller, $rootScope) {
            objCacheDetails = { "data": { "configurationDetails": { "selectedRow": { "Name": "config1", "Device Class": "unknown", "Description": "xyz" } } } };
            scope = $rootScope.$new(); //scope = $injector.get('$rootScope')
            state = $injector.get('$state');
            modalInstanceMock = {
                dismiss: function (result) {

                }
            };

            // set up fake methods
            spyOn(modalInstanceMock, "dismiss");
            groupConfigurationDetailsCtrl = $controller('groupConfigurationDetailsCtrl', {
                '$scope': scope,
                '$modalInstance': modalInstanceMock,
                '$state': state,
                'data': ['100002333333'],
                'type':'HyperSprout'
            });
        }); // end of inject
    }); // end of beforeEach

    it('testing for init', function () {

        expect(scope.groupName).toEqual('config1');

    });
    it('testing for cancel function', function () {
        scope.cancel();
    });
});
