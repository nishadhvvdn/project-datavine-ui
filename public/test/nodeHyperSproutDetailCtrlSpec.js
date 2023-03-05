'use strict';
describe('nodeHyperSproutDetailCtrl testing', function () {

    //var $scope, $controller;
    var scope, nodeHyperSproutDetailCtrl, modalInstanceMock;


    beforeEach(angular.mock.module('dataVINEApp'));
    beforeEach(function () {
        inject(function ($injector, $controller, $rootScope) {

            scope = $rootScope.$new(); //scope = $injector.get('$rootScope')

            modalInstanceMock = {
                dismiss: function (result) {

                },
                open: function (result) {

                }
            };
            spyOn(modalInstanceMock, "dismiss", "open");

            nodeHyperSproutDetailCtrl = $controller('nodeHyperSproutDetailCtrl', {
                '$scope': scope,
                '$modalInstance': modalInstanceMock,
            });
        }); // end of inject
    });
    it('testing cancel  function', function () {
        scope.cancel();
        expect(modalInstanceMock.dismiss).toHaveBeenCalled();
    });
});