/**
 * Directive to restrict spaces in input text fields.
 */
(function (angular) {
    "use strict";
    angular
        .module('dataVINEApp')
        .directive('disallowSpace', function () {
        return function (scope, element, attrs) {
            element.bind("keydown keypress", function (event) {
                if(event.keyCode === 32) {
                    scope.$apply(function (){
                        scope.$eval(attrs.myEnter);
                    });
                    event.preventDefault();
                }
            });
        };
    });
})(window.angular);
