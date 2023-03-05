'use strict';
describe('registrationCtrl testing', function () {

    var scope, registrationCtrl,state,location;


    beforeEach(angular.mock.module('dataVINEApp'));

    beforeEach(function () {
        inject(function ($injector, $controller, $rootScope) {
            scope = $rootScope.$new(); //scope = $injector.get('$rootScope')
            state = $injector.get('$state');
             location = $injector.get('$location');
            state={go:function(){},current:{name:'system.registration'}};
            spyOn(state,'go');
            

            registrationCtrl = $controller('registrationCtrl', {
                '$scope': scope,
                '$state': state,
                '$location': location,
                
            });
            
        }); // end of inject
    }); // end of beforeEach  
    it('test case', function () {
        expect(true).toBe(true);
    });
     
});


