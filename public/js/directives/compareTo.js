/**
 * Directive for comparing password
 */
(function (angular) {
  "use strict";
  angular
    .module('dataVINEApp')
    .directive("compareTo",
      function () {
        return {
          require: "ngModel",
          scope: {
            confirmPasswordValue: "=compareTo"
          },
          link: function (scope, element, attributes, ngModel) {
            ngModel.$validators.passStrengthAndCompareTo = function (newPasswordValue) {
              return newPasswordValue === scope.confirmPasswordValue;
            };
            scope.$watch("confirmPasswordValue", function () {
              ngModel.$validate();
            });
          }
        };
      });
})(window.angular);
