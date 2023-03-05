'use strict';

describe('demandSettingsCtrls testing', function () {

    var scope,demandSettingsCtrl;


    beforeEach(angular.mock.module('dataVINEApp'));

    beforeEach(function () {
        inject(function ($injector, $controller, $rootScope) {
            scope = $rootScope.$new(); //scope = $injector.get('$rootScope')
            demandSettingsCtrl = $controller('demandSettingsCtrl', {
                '$scope': scope
            });
        }); // end of inject
    });
    it('testing for search function', function () {
       scope.search();
    });
});