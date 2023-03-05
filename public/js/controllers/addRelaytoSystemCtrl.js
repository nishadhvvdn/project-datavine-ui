/**
  * @this vm
  * @ngdoc controller
  * @name dataVINEApp.controller:addRelaytoSystemCtrl
  *
  * @description
  * Controller to Add Relay to System
*/
(function (angular) {
    "use strict";
    angular.module('dataVINEApp')
        .controller('addRelaytoSystemCtrl',
            ['$scope', 'fileUpload', '$modalInstance',
                function ($scope, fileUpload, $modalInstance) {
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
                      * Function to close the pop-up
                      *
                      * @param Nil
                      * @return Nil
                    */
                    $scope.cancel = function () {
                        $modalInstance.dismiss();
                    };

                    $scope.addRelay = [{
                        "key": 'File Name',
                        "value": 'N/A'
                    }, {
                        "key": 'Results',
                        "value": 'Meter not added yet'
                    }, {
                        "key": '# Meters Entries',
                        "value": 'N/A'
                    }, {
                        "key": '# Meters Added Successfully',
                        "value": 'N/A'
                    }, {
                        "key": '# Unknown Device Class',
                        "value": 'N/A'
                    }, {
                        "key": '# Invalid Electronic Serial Number',
                        "value": 'N/A'
                    }, {
                        "key": '# Failed Meters',
                        "value": 'N/A'
                    }, {
                        "key": '# Duplicate Meter Entries in System',
                        "value": 'N/A'
                    }];
                    /**
                      * @description
                      * Function to Print
                      *
                      * @param Nil
                      * @return Nil
                    */
                    $scope.printCart = function () {
                        window.print();
                    };
                }]);
})(window.angular);
