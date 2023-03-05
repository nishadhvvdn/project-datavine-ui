/**
 * This handles CSV parsing
 */
(function (angular) {
    'use strict';
    angular
        .module('dataVINEApp')
        .service('csvparser', [
            function () {

                /**
                 * Validate the file
                 */
                this.validateFiles = function (fileContent) {
                    if (angular.isUndefinedOrNull(fileContent)) {
                        return { "valid": false, "message": 'Select a file to upload' };
                    }
                    if (!fileContent.validData) {
                        return { "valid": false, "message": 'Invalid file' };
                    }
                    return { "valid": true, "message": 'Valid file' };
                }

                /**
                 * Parse the CSV data in the file selected
                 */
                this.parseCSVConent = function (arrRows) {
                    var objResult = {};
                    if (!angular.isUndefinedOrNull(arrRows) && arrRows.length > 0) {
                        var arrHeaderCols = arrRows[0];
                        if (arrHeaderCols.length > 0) {
                            for (var index = 0; index < arrHeaderCols.length; index++) {
                                var strColName = arrHeaderCols[index].trim();
                                objResult[strColName] = [];
                            }
                            for (var index1 = 1; index1 < arrRows.length; index1++) {
                                var arrContentCols = arrRows[index1];
                                if (arrContentCols.length > 0) {
                                    if (arrContentCols.length === arrHeaderCols.length) {
                                        for (var colindex = 0; colindex < arrHeaderCols.length; colindex++) {
                                            var strColName1 = arrHeaderCols[colindex].trim();
                                            objResult[strColName1].push(arrContentCols[colindex]);
                                        }
                                    }
                                }
                            }
                        }
                    }
                    return objResult;
                };

            }]);
})(window.angular);