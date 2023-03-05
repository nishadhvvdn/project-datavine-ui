'use strict';
var objCacheDetails;
describe('groupConfigurationDetails_groupManagementCtrl testing', function () {

    var scope, groupConfigurationDetails_groupManagementCtrl, modalInstance, state, modalInstanceMock;


    beforeEach(angular.mock.module('dataVINEApp'));

    beforeEach(function () {
        inject(function ($injector, $controller, $rootScope) {
            objCacheDetails = { "data": { "configgroupDetails": { "selectedRow": { "Group_Name": "gropu1", "Group_Type": "unknown", "Description": "xyz" } } } };
            scope = $rootScope.$new(); //scope = $injector.get('$rootScope')
            modalInstanceMock = {
                dismiss: function (result) {

                }
            };

            // set up fake methods
            spyOn(modalInstanceMock, "dismiss");
            groupConfigurationDetails_groupManagementCtrl = $controller('groupConfigurationDetails_groupManagementCtrl', {
                '$scope': scope,
                '$modalInstance': modalInstanceMock,
                'data': 3,
                'type':'Meter'
            });
        }); // end of inject
    }); // end of beforeEach

    it('testing for init', function () {

        expect(scope.groupName).toEqual('gropu1');

    });
    it('testing for cancel function', function () {
        scope.cancel();
    });
});
