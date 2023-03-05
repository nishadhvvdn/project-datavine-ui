'use strict';
describe('configurationManagementCtrl testing', function () {

    var scope, configurationManagementCtrl,state,location;


    beforeEach(angular.mock.module('dataVINEApp'));

    beforeEach(function () {
        inject(function ($injector, $controller, $rootScope) {
            scope = $rootScope.$new(); //scope = $injector.get('$rootScope')
            state = $injector.get('$state');
            location = $injector.get('$location');
            state={go:function(){},current:{name:'hyperSprout.configurationManagement'}};
            spyOn(state,'go');
            configurationManagementCtrl = $controller('configurationManagementCtrl', {
                '$scope': scope,
                '$location': location,
                '$state': state,
            });
        }); // end of inject
    }); // end of beforeEach  
    it('test case', function () {
        expect(true).toBe(true);
    });

      
     
});