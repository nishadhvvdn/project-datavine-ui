'use strict';
describe('changePasswordCtrl testing', function () {

    //var $scope, $controller;
    var csvparser;

    beforeEach(angular.mock.module('dataVINEApp'));

    beforeEach(function () {
        inject(function ($injector) {
            csvparser=$injector.get('csvparser');

        }); // end of inject
    });
    it('testing validateFiles function if file is not upload', function () {
        var returnedData=csvparser.validateFiles(undefined);
        expect(returnedData.valid).toBe(false);
    });
    it('testing validateFiles function with no data', function () {
        var returnedData=csvparser.validateFiles({validData:false});
        expect(returnedData.valid).toBe(false);
    });
    it('testing validateFiles function with valid data', function () {
        var returnedData=csvparser.validateFiles({validData:true});
        expect(returnedData.valid).toBe(true);
    });    
    it('testing parseCSVConent function with valid data', function () {
        var returnedData=csvparser.parseCSVConent([['a','b'],['a','b']]);
        expect(returnedData.a[0]).toEqual('a');
    });      
    it('negative testing parseCSVConent function with invalid data', function () {
        var returnedData=csvparser.parseCSVConent(undefined);
        expect(Object.keys(returnedData).length === 0).toBeTruthy();
    }); 
    it('negative testing parseCSVConent function with blank data', function () {
        var returnedData=csvparser.parseCSVConent([[],['a','b']]);
        expect(Object.keys(returnedData).length === 0).toBeTruthy();
    });               
});