/**
  * @this vm
  * @ngdoc controller
  * @name dataVINEApp.controller:assignEndpointCtrl
  *
  * @description
  * Controller to Assign Endpoints
*/
(function (angular) {
    "use strict";
    angular.module('dataVINEApp')
        .controller('assignEndpointCtrl', ['$scope', 'fileUpload', '$modalInstance', '$uibModal', '$timeout', 'hypersproutMgmtService', 'commonService', 'type',
            function ($scope, fileUpload, $modalInstance, $uibModal, $timeout, hypersproutMgmtService, commonService, type) {
                $scope.type = type;

                let deviceTypeMatrix ={
                    DeltaLink : "DeltaLINK\u2122",
                    Meter : "Meter",
                    HyperSprout : "HyperSPROUT\u2122"
                }
                $scope.name= deviceTypeMatrix[type];

                if(type === "DeltaLink") {
                    $scope.groupTypeList = 'application group';
                }
                $scope.applicationGroupList = [];
                $scope.apiStatus = false;
                init();
                var modalInstance = null;
                $scope.groupList = [];
                /**
                 * @description
                 * Function to initialize Group list
                 *
                 * @return Nil
                 */
                function init() {
                    $scope.selectAction = "Add";
                    hypersproutMgmtService.fetchFirmwareGroupList(type)
                        .then(function (apiData) {
                            if(apiData && apiData.FirmwareList) {
                                for (let i = 0; i < apiData.FirmwareList.length; i++) {
                                    $scope.groupList.push(apiData.FirmwareList[i].GroupName);
                                }
                            } else  {
                                $scope.groupList.length = 0;
                            }
                        });
                }

                $scope.assignEndpoints = commonService.getAssignEndPointArray();
                /**
                  * @description
                  * Function to format data of endpoint
                  *
                  * @param objData - data of endpoint
                  * @return Nil
                */
                function formatData(objData) {
                    if (!angular.isUndefinedOrNull(objData)) {
                        $scope.apiStatus = true;
                        if (objData.type === true) {
                            $scope.assignEndpoints[0].value = $scope.fileContent.name;
                            $scope.assignEndpoints[1].value = $scope.selectGroup;
                            $scope.assignEndpoints[2].value = $scope.selectAction;
                            $scope.assignEndpoints[3].value = angular
                                .isUndefinedOrNull(objData.Status) ? 'Failed to import' : objData.Status;
                        } else {
                            $scope.assignEndpoints[0].value = $scope.fileContent.name;
                            $scope.assignEndpoints[1].value = $scope.selectGroup;
                            $scope.assignEndpoints[2].value = $scope.selectAction;
                            $scope.assignEndpoints[3].value = objData.Message;
                        }
                        $timeout(function () {
                            $scope.$apply();
                        }, 300, false);
                    }
                }
                /**
                  * @description
                  * Function to Assign Endpoints data
                  *
                  * @param  Nil
                  * @return {type} Nil
                */

                $scope.assignEndPoints = function () {
                    $scope.errMessage = '';
                    if (type === "DeltaLink") {
                        if ($scope.selectGroup && $scope.fileContent) {
                            hypersproutMgmtService.deltaLinkAssignGrpMembership("DLMGrpMgmtAssignGrpMembershipAssignEndpoint",
                                $scope.selectGroup,
                                $scope.fileContent.content,
                                $scope.selectAction,
                                type)
                                .then(function (objData) {
                                    formatData(objData);
                                });
                        }
                    } else {
                        hypersproutMgmtService.HSMOrMMGrpMgmtAssignGrpMembershipAssignEndpoint(
                            (type === 'HyperSprout') ? 'HSMGrpMgmtAssignGrpMembershipAssignEndpoint' : 'MMGrpMgmtAssignGrpMembershipAssignEndpoint',
                            $scope.selectGroup,
                            $scope.selectAction,
                            $scope.fileContent.content,
                            type)
                            .then(function (objData) {
                                formatData(objData);
                            });
                    }
                };
                /**
                  * @description
                  * Function to close pop-up
                  *
                  * @param Nil
                  * @return Nil
                */
                $scope.cancel = function () {
                    if($scope.apiStatus){
                        $modalInstance.dismiss(true);
                    } else {
                        $modalInstance.dismiss(false);
                    }                    
                };
                /**
                  * @description
                  * Function to close pop-up on click on save
                  *
                  * @param Nil
                  * @return Nil
                */
                $scope.Save = function () {
                    $modalInstance.dismiss(true);
                };

                $scope.status = {
                    isopen: false
                };
                /**
                  * @description
                  * Function to open pop-up to create Application group
                  *
                  * @param size - size of modal
                */
                $scope.openCreateApplicationGroup = function (size) {
                    modalInstance = $uibModal.open({
                        templateUrl: '/templates/createApplicationGroup.html',
                        controller: 'createApplicationGroupCtrl',
                        size: size,
                        backdrop: 'static',
                        keyboard: true,
                        resolve: {
                            type: function () {
                                return type;
                            }
                        }
                    });
                    modalInstance.result.then(function (createdItem) {
                        init();
                        if (!angular.isUndefinedOrNull(createdItem)) {
                            $scope.groupList.push(createdItem);
                            $scope.selectGroup = createdItem;
                        }
                    }, function (callApi) {
                        if(callApi) {
                            init();
                        }
                    });
                };
                $scope.validation = false;
                $scope.isFileBrowsed = false;
                $scope.browsedFileName = '';
                $scope.fileUpload = {};
                /**
                  * @description
                  * Watcher to determine the type of file based
                  * on extension while selecting the file
                  *
                  * @param newVal - selected file
                  * @return Nil
                */
                $scope.$watch('fileMod', function (newVal) {
                    if (newVal) {
                        commonService.checkfileExtension(newVal, 'txt', function (result) {
                            $scope.fileUpload = result;
                        });
                    }
                });

                /**
                  * @description
                  * Function to upload file
                  *
                  * @param Nil
                  * @return Nil
                */
                $scope.uploadFile = function () {
                    var file = $scope.myFile;
                    var uploadUrl = "/fileUpload";
                    fileUpload.uploadFileToUrl(file, uploadUrl);
                };

                /**
                  * @description
                  * Function to print
                  *
                  * @param Nil
                  * @return Nil
                */
                $scope.printCart = function () {
                    window.print();
                };

                /**
                  * @description
                  * Destroys all the pop-up's
                  *
                  * @param Nil
                  * @return Nil
                */
                $scope.$on('$destroy', function () {
                    if (!angular.isUndefinedOrNull(modalInstance)) {
                        modalInstance.dismiss(true);
                        modalInstance = null;
                    }
                });
                $scope.fileValidation = false;
                $scope.fileExtensionValidation = false;
                $scope.fileNameChanged = function(file) {
                   $scope.isFileBrowsed = !!file.length;
                   $scope.browsedFileName = file && file[0] ? file[0].name :'';
                   $scope.fileValidation = !(file[0] !== undefined && file[0].size !== 0);
                }
            }]);
})(window.angular);
