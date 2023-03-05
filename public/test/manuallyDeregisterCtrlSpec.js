'use strict';
describe('manuallyDeregisterCtrl testing', function () {

    var scope, manuallyDeregisterCtrl,modalInstanceMock;


    beforeEach(angular.mock.module('dataVINEApp'));

    beforeEach(function () {
        inject(function ($injector, $controller, $rootScope) {
            scope = $rootScope.$new(); //scope = $injector.get('$rootScope')
             modalInstanceMock = {
                dismiss: function (result) {

                }
            };
            
            manuallyDeregisterCtrl = $controller('manuallyDeregisterCtrl', {
                '$scope': scope,
                '$modalInstance': modalInstanceMock, 
               
            });
        }); // end of inject
    }); // end of beforeEach  
    
    it('test case', function () {
        expect(true).toBe(true);
    });
    it('testing for cancel function', function () {
        modalInstanceMock = {
            dismiss: function (result) {

            }
        };
        spyOn(modalInstanceMock, "dismiss");
        scope.cancel();
        //expect(true).toBe(true);
    });
    it('testing for print function', function () {
        window.print();
        scope.printCart ();
        //expect(true).toBe(true);
    });
     
});