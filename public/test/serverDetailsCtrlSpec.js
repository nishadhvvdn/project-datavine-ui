'use strict';
describe('serverDetailsCtrl testing', function () {

    var scope, serverDetailsCtrl, modalInstanceMock;


    beforeEach(angular.mock.module('dataVINEApp'));

    beforeEach(function () {
        
        inject(function ($injector, $controller, $rootScope) {
            scope = $rootScope.$new();
            modalInstanceMock = {
                dismiss: function (result) {

                }
            };
            spyOn(modalInstanceMock, "dismiss");
            serverDetailsCtrl = $controller('serverDetailsCtrl', {
                '$scope': scope,
                '$modalInstance': modalInstanceMock
            });
        });
    });
    it('test for pageload', function () {
        scope.cancel();
    });
});