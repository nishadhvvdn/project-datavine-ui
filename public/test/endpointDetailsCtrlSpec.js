'use strict';
describe('endpointDetailsCtrl testing', function () {

    //var $scope, $controller;
    var scope,endpointDetailsCtrl,modalInstanceMock;


    beforeEach(angular.mock.module('dataVINEApp'));

    beforeEach(function () {
        inject(function ($injector, $controller, $rootScope) {
            modalInstanceMock = {
                dismiss: function (result) {

                }
            };
            scope = $rootScope.$new(); //scope = $injector.get('$rootScope')
spyOn(modalInstanceMock, "dismiss");
            endpointDetailsCtrl = $controller('endpointDetailsCtrl', {
                '$scope': scope,
                '$modalInstance': modalInstanceMock,
            });
        }); // end of inject
    });

      

     it('testing for cancel function', function () {
        scope.cancel();
        expect(modalInstanceMock.dismiss).toHaveBeenCalled();
    });  
});