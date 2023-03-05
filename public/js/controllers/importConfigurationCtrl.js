/**
 * @description
 * Controller for importing configuration
 */
(function (angular) {
    "use strict";
    angular.module('dataVINEApp')
        .controller('importConfigurationCtrl',
            ['$scope', 'fileUpload', '$modalInstance',
                '$uibModal', '$timeout', '$state',
                'hypersproutMgmtService', 'data', 'commonService',
                'type', function ($scope, fileUpload, $modalInstance,
                    $uibModal, $timeout, $state, hypersproutMgmtService,
                    data, commonService, type) {
                    $scope.configurationDetails = []
                    $scope.fileUploadStatus = true;
                    for (var count in data) {
                        if ((type === 'HyperSprout') ? (data[count]['Device Class'] !== 'unknown') : (data[count]['Device_Class'] !== 'unknown')) {
                            $scope.configurationDetails.push(data[count]);
                        }
                    }
                    $scope.imports = [{
                        "key": 'Configuration File Name',
                        "value": 'N/A'
                    }, {
                        "key": 'Configuration Group',
                        "value": 'N/A'
                    }, {
                        "key": 'Configuration Group Version',
                        "value": 'N/A'
                    }, {
                        "key": 'Import Result',
                        "value": 'Configuration Not Imported Yet'
                    }];

                    $scope.imports[0].value = $scope.file;
                    $scope.validation = false;
                    $scope.fileUploadHyper = {};

                    /**
                     * @description
                     * Event handler to watch on the file extension
                     *
                     * @param nVal
                     * @return Nil
                     
                     */
                    $scope.$watch('fileMod', function (nVal) {
                        if (nVal) {
                            commonService.checkfileExtension(nVal,
                                'txt', function (resObj) {
                                    $scope.fileUploadHyper = resObj;
                                });
                        }
                    });

                    /**
                     *  @description
                     * Function to upload file
                     *
                     * @param Nil
                     * @return Nil
                     
                     */
                    $scope.uploadFile = function () {
                        $scope.errMessage = '';
                        var action = "Add";
                        hypersproutMgmtService
                            .HSMOrMMConfNewImportSave(
                                (type === 'HyperSprout') ? 'HSMConfImportConfSave' : 'MMConfImportConfSave', $scope.selectedTestGroup.Name, $scope.fileContent.content, action).then(function (objData) {
                                    if (!angular.isUndefinedOrNull(objData)) {
                                        $scope.imports[0].value =
                                            $scope.fileContent.name;
                                        $scope.imports[1].value =
                                            $scope.selectedTestGroup.Name;
                                        $scope.imports[2].value =
                                            angular.isUndefinedOrNull(
                                                $scope.selectedTestGroup.Version) ? 'NA' : $scope.selectedTestGroup.Version;
                                        $scope.imports[3].value =
                                            angular.isUndefinedOrNull(
                                                objData.Status) ? 'Failed to import' : objData.Status;
                                    }
                                });
                    };

                    /**
                     * @description
                     * Function to reload the page and 
                     * close pop-up if any opened
                     *
                     * @param Nil
                     * @return Nil
                     
                     */
                    $scope.cancel = function () {
                        $state.reload();
                        $modalInstance.dismiss();
                    };

                    /**
                     *  @description
                     * Function to create new configuration by
                     * opening a pop-up
                     *
                     * @param size
                     * @return Nil
                     
                     */
                    $scope.openNewConfiguration = function (size) {
                        $uibModal.open({
                            templateUrl: '/templates/newConfiguration.html',
                            controller: 'newConfigurationCtrl',
                            size: size,
                            backdrop: 'static',
                            keyboard: true,
                            resolve: {
                                data: hypersproutMgmtService
                                    .configPrograms(type)
                                    .then(function (objData) {
                                        if (!angular
                                            .isUndefinedOrNull(objData) &&
                                            !angular
                                                .isUndefinedOrNull(
                                                    objData.configProgramData)
                                        ) {
                                            var configurationDatas = [];
                                            for (var count in objData.configProgramData) {
                                                if (objData.configProgramData
                                                    .hasOwnProperty(count)) {
                                                    var objToInserts = {};
                                                    objToInserts["Names"] =
                                                        objData.configProgramData[count]
                                                            .Name;
                                                    configurationDatas.push(objToInserts);
                                                }
                                            }
                                            objCacheDetails.data.configPrgmData =
                                                configurationDatas;
                                            return true;
                                        }
                                    }),
                                type: function () {
                                    return type;
                                }
                            }
                        });
                    };
                /**
                 * @description
                 * Function to validate the file type
                 *
                 * @param size 1
                 * @return Nil
                 */
                $scope.fileUploadStatus = true;
                let fileName = 'N/A';
                $scope.checkFileExtension = function (newVal) {
                    fileName = newVal.name;
                    var type = newVal.name.substring(newVal.name.lastIndexOf(".") + 1);
                    if (type === 'txt' || type === 'csv') {
                        $scope.errMessage = '';
                        $scope.fileUploadStatus = false;
                        if(newVal.size === 0) {
                            $scope.errMessage = 'File is empty!';
                            $scope.fileUploadStatus = true;
                        }
                    } else {
                        $scope.errMessage = 'Select files only with .text or .csv extension';
                        $scope.fileUploadStatus = true;
                    }
                };
                /**
                 * @description
                 * Event handler to watch the file extension
                 *
                 * @param newVal
                 * @return Nil

                 */
                $scope.$watch('fileMod', function (newVal) {
                    if (newVal) {
                        $scope.checkFileExtension(newVal);

                    }
                });

                    /**
                     * @description
                      * Function to print
                     *
                     * @param size
                     * @return Nil
                    
                     */
                    $scope.printCart = function () {
                        window.print();
                    };
                }]);
})(window.angular);
