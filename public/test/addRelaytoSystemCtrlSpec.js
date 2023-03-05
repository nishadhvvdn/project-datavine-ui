'use strict';
describe('testing', function () {

    //var $scope, $controller;
    var scope, addRelaytoSystemCtrl, modalInstanceMock, fileUpload;


    beforeEach(angular.mock.module('dataVINEApp'));

    beforeEach(function () {
        inject(function ($injector, $controller, $rootScope) {
            scope = $rootScope.$new(); //scope = $injector.get('$rootScope')
            modalInstanceMock = {
                dismiss: function (result) {

                }
            };
            spyOn(modalInstanceMock, "dismiss");
            fileUpload = $injector.get('fileUpload');
            //uibModal=$injector.get('$uibModal');
            addRelaytoSystemCtrl = $controller('addRelaytoSystemCtrl', {
                '$scope': scope,
                '$modalInstance': modalInstanceMock,
                'fileUpload': fileUpload
            });
        }); // end of inject
    });
    it('testing for upload function', function () {
        scope.myFile = 'sdsd';
        scope.uploadFile();

        //scope.Save();
        expect(scope.myFile).toBe('sdsd');


    });
    // 
    it('testing for cancel modalInstanceMock function', function () {
        scope.cancel();
        expect(modalInstanceMock.dismiss).toHaveBeenCalled();
    });
     it('testing for print function', function () {
        window.print();
        scope.printCart ();
        //expect(true).toBe(true);
    });
});