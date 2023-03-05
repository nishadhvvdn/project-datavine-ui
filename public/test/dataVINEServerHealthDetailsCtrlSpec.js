'use strict';
describe('dataVINEServerHealthDetailsCtrl testing', function () {

    var scope, dataVINEServerHealthDetailsCtrl, modalInstanceMock;


    beforeEach(angular.mock.module('dataVINEApp'));

    beforeEach(function () {
        
        inject(function ($injector, $controller, $rootScope) {
            scope = $rootScope.$new();
            modalInstanceMock = {
                dismiss: function (result) {

                }
            };
            spyOn(modalInstanceMock, "dismiss");
            dataVINEServerHealthDetailsCtrl = $controller('dataVINEServerHealthDetailsCtrl', {
                '$scope': scope,
                '$modalInstance': modalInstanceMock
            });
        });
    });
    it('test for pageload', function () {
        scope.cancel();
    });
});