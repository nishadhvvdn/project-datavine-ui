'use strict';
describe('deviceManagementCtrl testing', function () {

    var scope, deviceManagementCtrl,state,location;


    beforeEach(angular.mock.module('dataVINEApp'));

    beforeEach(function () {
        inject(function ($injector, $controller, $rootScope) {
            scope = $rootScope.$new(); //scope = $injector.get('$rootScope')
            state = $injector.get('$state');
            location = $injector.get('$location');
            state={go:function(){},current:{name:'system.deviceManagement'}};
            spyOn(state,'go');

            deviceManagementCtrl = $controller('deviceManagementCtrl', {
                '$scope': scope,
                '$location': location,
                '$state': state
                
            });
        }); // end of inject
    }); // end of beforeEach  
    it('test case', function () {
        expect(true).toBe(true);
    });
     
});

