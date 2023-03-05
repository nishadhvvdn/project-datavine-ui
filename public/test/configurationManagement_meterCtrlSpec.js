'use strict';
describe('configurationManagement_meterCtrl testing', function () {

    var scope, configurationManagement_meterCtrl,state,location;


    beforeEach(angular.mock.module('dataVINEApp'));

    beforeEach(function () {
        inject(function ($injector, $controller, $rootScope) {
            scope = $rootScope.$new(); //scope = $injector.get('$rootScope')
            state = $injector.get('$state');
            location = $injector.get('$location');
            state={go:function(){},current:{name:'meter.configurationManagement'}};
            spyOn(state,'go');
            configurationManagement_meterCtrl = $controller('configurationManagement_meterCtrl', {
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