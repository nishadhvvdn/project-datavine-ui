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
        .controller('bulkOperationsCtrl', ['$scope',
            'fileUpload', '$modalInstance', '$filter',  '$uibModal',
            '$timeout', 'MeterMgmtService', 
            'commonService', 'type',
            function ($scope, fileUpload, $modalInstance, $filter,  
                $uibModal, $timeout, MeterMgmtService,
                commonService, type) {
                $scope.applicationGroupList = [];
                $scope.configurationGroupList = [];
                $scope.apiStatus = false;
                init();
                var modalInstance = null;
                $scope.assignEndpoints = [{
                    "key": 'File Name',
                    "value": 'N/A'
                }, {
                    "key": 'Operation Type',
                    "value": 'N/A'
                }, {
                    "key": 'Result',
                    "value": 'N/A'
                }];

                /**
                  * @description
                  * Function to initialize Group list
                  *
                  * @param Nil
                  * @return Nil
                */
                function init() {
                    $scope.selectAction = "Read";                    
                }

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
                        if (objData.type === false) {
                            $scope.assignEndpoints[0].value = $scope.fileContent.name;
                            $scope.assignEndpoints[1].value = $scope.selectAction;
                            $scope.assignEndpoints[2].value = objData.Message ? objData.Message : 'Failed to import';
                        } else {
                            $scope.assignEndpoints[0].value = $scope.fileContent.name;
                            $scope.assignEndpoints[1].value = $scope.selectAction;
                            $scope.assignEndpoints[2].value = 'File Uploaded Successfully!';
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
                $scope.uploadBulkOperationfile = function () {
                    $scope.errMessage = '';
                    if ($scope.fileContent) {
                        MeterMgmtService.UploadMeterData(
                            "UploadMeterData",$scope.fileContent.content,$scope.selectAction)
                            .then(function (objData) {                            
                                formatData(objData);
                            });
                    }                   
                };

                /**
                  * @description
                  * Function to Assign Endpoints data
                  *
                  * @param  Nil
                  * @return {type} Nil
                */
                $scope.downloadSampleFile = function () {
                    let CsvString = "MMtest10" + "\r\n" + "MMtest11" + "\r\n" + "MMtest12" ;
                    CsvString = "data:application/csv," + encodeURIComponent(CsvString);
                    let x = document.createElement("A");
                    x.setAttribute("href", CsvString);
                    x.setAttribute("download", "Bulk Operation - sample format file.txt");
                    document.body.appendChild(x);
                    x.click();
                };

           
                /**
                  * @description
                  * Function to close pop-up
                  *
                  * @param Nil
                  * @return Nil
                */
                $scope.cancel = function () {
                    if($scope.apiStatus) {
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
