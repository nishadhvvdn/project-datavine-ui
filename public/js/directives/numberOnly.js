/**
 * Directive to check if all the charecters are numbers
 */
(function (angular) {
    "use strict";
    angular
        .module('dataVINEApp')
        .directive('numbersOnly', function () {
            let allowedCharacters = [48,49,50,51,52,53,54,55,56,57,96,97,98,99,9,10,100,101,102,103,104,105,8,86,39,46,37,39];
            return function (scope, element, attrs) {
                    element.bind("keydown keyup keypress", function (event) {
                        if(!allowedCharacters.includes(event.keyCode) || event.key === '%' || event.key === 'V') {
                            scope.$apply(function (){
                                scope.$eval(attrs.myEnter);
                            });
                            return false;
                        }
                    });
                };
            });
})(window.angular);
