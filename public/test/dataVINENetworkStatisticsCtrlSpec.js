'use strict';
describe('dataVINENetworkStatisticsCtrl testing', function () {

    var scope, dataVINENetworkStatisticsCtrl,uibModal, modalInstanceMock;


    beforeEach(angular.mock.module('dataVINEApp'));

    beforeEach(function () {
        
        inject(function ($injector, $controller, $rootScope) {
            scope = $rootScope.$new();
            modalInstanceMock = {
                dismiss: function (result) {

                }
            };
            spyOn(modalInstanceMock, "dismiss");
            uibModal = $injector.get('$uibModal');
            dataVINENetworkStatisticsCtrl = $controller('dataVINENetworkStatisticsCtrl', {
                '$scope': scope,
                '$modalInstance': modalInstanceMock,
                '$uibModal':uibModal
            });
        });
    });
    it('test for pageload', function () {
        scope.cancel();
    });
});