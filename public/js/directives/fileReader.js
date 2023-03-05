/**
 * Directive for reading attributes of file
 */
(function (angular) {
    "use strict";
    angular
        .module('dataVINEApp')
        .directive('fileReader',
            function () {
                return {
                    scope: {
                        fileReader: "="
                    },
                    link: function (scope, element) {
                        $(element).on('change',
                            function (changeEvent) {
                                var files = changeEvent.target.files;
                                if (files.length) {
                                    var r = new FileReader();
                                    r.onload = function (e) {
                                        var contents = e.target.result;
                                        var validData = true;
                                        var contentsArray = contents.trim().split("\n");
                                        for (var index in contentsArray) {
                                            if (contentsArray[index].trim().length !== 5) {
                                                validData = false;
                                                break;
                                            }
                                        }
                                        scope.$apply(function () {
                                            scope.fileReader = {
                                                'name': files[0].name,
                                                'content': contents, validData: validData
                                            };
                                        });
                                    };
                                    r.readAsText(files[0]);
                                }
                            });
                    }
                };
            });
})(window.angular);