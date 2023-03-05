'use strict';
describe('dataVineHealthCtrl testing', function () {

    //var $scope, $controller;
    var scope,dataVineHealthCtrl,state, uibModal, location;


    beforeEach(angular.mock.module('dataVINEApp'));

    beforeEach(function () {
        inject(function ($injector, $controller, $rootScope) {
            scope = $rootScope.$new(); //scope = $injector.get('$rootScope')
           
            state = $injector.get('$state');
            uibModal = $injector.get('$uibModal');
            location = $injector.get('$location');
            //uibModal=$injector.get('$uibModal');
            dataVineHealthCtrl = $controller('dataVineHealthCtrl', {
                '$scope': scope,
                '$uibModal': uibModal,
                '$state': state,
                '$location':location
            });
        }); // end of inject
    });// end of beforeEach
     it('test case', function () {
        expect(true).toBe(true);
    });
     
});