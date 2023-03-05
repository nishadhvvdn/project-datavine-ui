(function (angular) {
    "use strict";
    angular.module('dataVINEApp')
        .controller('restrictSplChars', ['$scope',
            function ($scope) {
                $scope.regex = /^[^`~!@#$%\^&*()_+={}|[\]\\:';"<>?,./]*$/;
            }
        ]).directive('restrictSplChars', function() {
        function link(scope, elem, attrs, ngModel) {
            ngModel.$parsers.push(function(viewValue) {
                var reg = /^[^`~!@#$%\^&*()_+={}|[\]\\:';"<>?,./]*$/;
                // if view values matches regexp, update model value
                if (viewValue.match(reg)) {
                    return viewValue;
                }
                var transformedValue = ngModel.$modelValue;
                ngModel.$setViewValue(transformedValue);
                ngModel.$render();
                return transformedValue;
            });
        }

        return {
            restrict: 'A',
            require: 'ngModel',
            link: link
        };
    });
})(window.angular);
