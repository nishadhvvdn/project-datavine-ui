'use strict';
describe('testing', function () {

    //var $scope, $controller;
    var scope, saveAsConfigPrgmCtrl_meter, modalInstanceMock;


    beforeEach(angular.mock.module('dataVINEApp'));

    beforeEach(function () {
        inject(function ($injector, $controller, $rootScope) {
            scope = $rootScope.$new(); //scope = $injector.get('$rootScope')
            modalInstanceMock = {
                dismiss: function (result) {

                }
            };
            spyOn(modalInstanceMock, "dismiss");
           
            //uibModal=$injector.get('$uibModal');
            saveAsConfigPrgmCtrl_meter = $controller('saveAsConfigPrgmCtrl_meter', {
                '$scope': scope,
                '$modalInstance': modalInstanceMock
                
            });
        }); // end of inject
    });
    it('testing for cancel function', function () {
        scope.cancel();
        expect(modalInstanceMock.dismiss).toHaveBeenCalled();
    });
});