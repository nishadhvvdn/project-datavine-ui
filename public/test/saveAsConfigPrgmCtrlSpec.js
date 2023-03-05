'use strict';
describe('testing', function () {

    //var $scope, $controller;
    var scope, saveAsConfigPrgmCtrl, modalInstanceMock;


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
            saveAsConfigPrgmCtrl = $controller('saveAsConfigPrgmCtrl', {
                '$scope': scope,
                '$modalInstance': modalInstanceMock
                
            });
        }); // end of inject
    });
    // it('testing for upload function', function () {
    //     scope.myFile = 'sdsd';
    //     scope.uploadFile();

    //     //scope.Save();
    //     expect(true).toBe(true);


    // });
    it('testing for cancel function', function () {
        modalInstanceMock = {
            dismiss: function (result) {

            }
        };
        spyOn(modalInstanceMock, "dismiss");
        scope.cancel();
        //expect(true).toBe(true);
    });
    //  it('testing for print function', function () {
    //     window.print();
    //     scope.printCart ();
    //     //expect(true).toBe(true);
    // });
});