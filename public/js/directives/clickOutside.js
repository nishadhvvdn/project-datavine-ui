/**
 * Directive to check if the mouse is clicked outside an element
 */
(function (angular) {
    "use strict";
    angular
        .module('dataVINEApp')
        .directive('clickOutside', ['$parse', '$timeout',
            function ($parse, $timeout) {
                return {
                    link: function (scope, element, attrs) {
                        function handler(event) {
                            if (!$(event.target).closest(element).length) {
                                scope.$apply(function () {
                                    $parse(attrs.clickOutside)(scope);
                                });
                            }
                        }
                        $timeout(function () {
                            // Timeout is to prevent the click handler from 
                            // immediately firing upon opening the popover.
                            $(document).on("click", handler);
                        });
                        scope.$on("$destroy", function () {
                            $(document).off("click", handler);
                        });
                    }
                }
            }]);
})(window.angular);