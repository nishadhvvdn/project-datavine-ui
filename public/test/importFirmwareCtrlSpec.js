'use strict';
describe('importFirmwareCtrl testing', function () {

    //var $scope, $controller;
    var scope, importFirmwareCtrl,modalInstanceMock;


    beforeEach(angular.mock.module('dataVINEApp'));
    beforeEach(function () {
        inject(function ($injector, $controller, $rootScope,$sessionStorage,$httpBackend) {

            scope = $rootScope.$new(); //scope = $injector.get('$rootScope')
           
            modalInstanceMock = {
                dismiss: function (result) {

                },
                open:function(result){

                }
            };
                                     
            spyOn(modalInstanceMock, "dismiss","open");
          
            importFirmwareCtrl = $controller('importFirmwareCtrl', {
                '$scope': scope,
                '$modalInstance':modalInstanceMock,
               
            });
        }); // end of inject
    });
   it('testing cancel  function', function () {
        scope.cancel();
        expect(modalInstanceMock.dismiss).toHaveBeenCalled();
    });
    it('testing uploadFile  function', function () {
        scope.fileContent={'content':'fdfd'};
        scope.uploadFile();
       
    });


});