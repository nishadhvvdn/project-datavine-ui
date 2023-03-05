/**
 * @description
 * Controller for modal that updates configuration
 */
(function (angular) {
    "use strict";
    angular.module('dataVINEApp').controller('uploadConfigProgramCtrl',
        ['$scope', '$state', '$modalInstance', 'hypersproutMgmtService',
            'list', 'commonService', 'formatXmlContent', 'configType',
            function ($scope, $state, $modalInstance,
                hypersproutMgmtService, list, commonService,
                formatXmlContent, configType) {
                $scope.fileUploadStatus = true;
                $scope.uploadObj = {};
                $scope.unique = true;
                $scope.wordMsg = '';

                /**
                 *   @description
                 * TBD
                 *
                 * @param Nil
                 * @return Nil
                 
                 */
                $scope.check = function () {
                    var groupObj = commonService.check(list, 'Name', $scope.uploadObj.name);
                    $scope.unique = groupObj.check;
                    $scope.uploadObj.name = groupObj.name;
                    $scope.msg = groupObj.msg;
                    $scope.specialChar = groupObj.checkSpecialChar;
                };

                /**
                 *   @description
                 * TBD
                 *
                 * @param Nil
                 * @return Nil
                
                 */
                $scope.wordCheck = function () {
                    if ($scope.description) {
                        var checkword = commonService.wordCheck($scope.description);
                        $scope.wordMsg = checkword.wordMsg;
                    }
                };

                $scope.validation = false;
                $scope.fileUploadHyper = {};
                $scope.$watch('fileMod', function (modifiedValue) {
                    if (modifiedValue) {
                        commonService.checkfileExtension(modifiedValue, 'xml',
                            function (resObject) {
                                $scope.uploadFileObject = resObject;
                            });
                    }
                });

                /**
                 *   @description
                 * Sava configuration data
                 *
                 * @param Nil
                 * @return Nil
                 
                 */
                $scope.Save = function () {
                    var xmlContent = formatXmlContent
                        .formatMeterOrHyperSproutData($.xml2json($scope.fileContent.content), configType);
                    if (!xmlContent.valid) {
                        swal({
                            title: "Error!",
                            text: angular.isUndefinedOrNull(xmlContent.msg) ? "Invalid Parameters." : xmlContent.msg,
                            type: "error",
                            confirmButtonText: "Ok"
                        });
                    } else {
                        hypersproutMgmtService
                            .ConfUploadConfigProgram(
                                $scope.uploadObj.name, xmlContent, $scope.description, configType)
                            .then(function (objData) {
                                if (!angular.isUndefinedOrNull(objData) && (objData.type)) {
                                    $state.reload();
                                    swal(objData.Status);
                                } else {
                                    swal(objData.Message);
                                }
                                $modalInstance.dismiss();
                            });
                    }
                };

                /**
                 *  @description
                 * Dismiss the modal
                 *
                 * @param Nil
                 * @return Nil
                 
                 */
                $scope.cancel = function () {
                    $state.reload();
                    $modalInstance.dismiss();
                };

            }]);
})(window.angular);