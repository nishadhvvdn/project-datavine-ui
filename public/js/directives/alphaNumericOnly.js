/**
 * Directive to check if the alphabets are alpha-numeric
 */
(function (angular) {
    "use strict";
    angular
        .module('dataVINEApp')
        .directive('allowPattern', [allowPatternDirective]);

    function allowPatternDirective() {
        return {
            restrict: "A",
            compile: function (tElement, tAttrs) {
                return function (scope, element, attrs) {
                    element.bind("keypress", function (event) {
                        var keyCode = event.which || event.keyCode;
                        var keyCodeChar = String.fromCharCode(keyCode);
                        if (!keyCodeChar.match(new RegExp(attrs.allowPattern, "i"))) {
                            event.preventDefault();
                            return false;
                        }

                    });
                };
            }
        };
    }

})(window.angular);