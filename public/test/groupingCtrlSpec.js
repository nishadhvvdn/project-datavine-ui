'use strict';
describe('groupingCtrl testing', function () {

    //var $scope, $controller;
    var scope, state, uibModal, $location,groupingCtrl;


    beforeEach(angular.mock.module('dataVINEApp'));

    beforeEach(function () {
        inject(function ($injector, $controller, $rootScope) {
            scope = $rootScope.$new(); //scope = $injector.get('$rootScope')
           
            state = $injector.get('$state');
            uibModal = $injector.get('$uibModal');
            $location = $injector.get('$location');
            //uibModal=$injector.get('$uibModal');
            state={go:function(){},current:{name:'system.grouping'}};
            spyOn(state,'go');
            groupingCtrl = $controller('groupingCtrl', {
                '$scope': scope,
                '$uibModal': uibModal,                
                '$state': state,
                '$location':$location
            });
        }); // end of inject
    });
     it('test case', function () {
        expect(true).toBe(true);
    });    
});