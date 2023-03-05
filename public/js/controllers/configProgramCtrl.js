/**
 * Controller to config program
 * @description
 * Controller to Add User
 */
(function (angular) {
    "use strict";


    angular.module('dataVINEApp')
        .controller('configProgramCtrl',
            ['$scope', '$rootScope', '$uibModal', '$timeout',
                '$state', 'hypersproutMgmtService',
                'type', 'commonService', function ($scope, $rootScope, $uibModal,
                    $timeout, $state, hypersproutMgmtService, type, commonService) {
                    init();
                    $scope.configPrgmOptions = {};
                    $scope.configPrgmOptions = angular.copy(objCacheDetails.grid);
                    $scope.configPrgmOptions.data = [];
                    $scope.configPrgmOptions.exporterPdfOrientation = 'landscape',
                    $scope.configPrgmOptions.exporterPdfMaxGridWidth = 640;
                    $scope.configPrgmOptions.columnDefs = [
                        { field: 'Name', width: '25%', enableHiding: false },
                        { field: 'Description', width: '50%', enableHiding: false },
                        { field: 'Members', enableHiding: false, width: '10%' },
                        { field: 'Action', cellTemplate: '<div class="ui-grid-cell-contents"><button type="button" class="btn btn-xs btn-primary cellBtn" ng-click="grid.appScope.vm.editConfiguration(row)">  <i class="fa fa-save As"></i></button> &nbsp;|&nbsp;<button type="button" class="btn btn-xs btn-primary cellBtn" ng-hide="row.entity.Members>0" ng-click="grid.appScope.vm.deleteConfiguration(row)">  <i class="fa fa-remove"></i></button> </div>', enableColumnMenu: false, enableHiding: false, enableSorting: false }
                    ];

                    /**
                     * Function to initialize config program
                     */
                    function init() {
                        var configurationData = [];
                        var objConfigMemberInfo = {};
                        hypersproutMgmtService.configPrograms(type)
                            .then(function (objData) {
                                if (!angular.isUndefinedOrNull(objData) &&
                                    !angular.isUndefinedOrNull(objData.memberInfo)) {
                                    for (var count in objData.memberInfo) {
                                        objConfigMemberInfo[objData
                                            .memberInfo[count]["configProgram"]] =
                                            {
                                                "Members": objData
                                                    .memberInfo[count]["Members"]
                                            };
                                    }
                                }
                                if (!angular.isUndefinedOrNull(objData) &&
                                    !angular.isUndefinedOrNull(objData.configProgramData)) {
                                    for (var cnt in objData.configProgramData) {
                                        if (objData.configProgramData.hasOwnProperty(cnt)) {
                                            var objToInsert = {};
                                            objToInsert["Name"] =
                                                objData.configProgramData[cnt].Name;
                                            objToInsert["Description"] =
                                                objData.configProgramData[cnt].Description;
                                            objToInsert["Members"] =
                                                angular.isUndefinedOrNull(
                                                    objConfigMemberInfo[objToInsert["Name"]]) ? '' : objConfigMemberInfo[objToInsert["Name"]].Members;
                                            configurationData.push(objToInsert);
                                        }
                                    }
                                    $scope.configPrgmOptions.data = configurationData;
                                    objCacheDetails.data.configPrgmDatas = configurationData;
                                }

                                if(angular.isUndefinedOrNull(objData) || ( (!objData.configProgramData || objData.configProgramData.length === 0)  && (!objData.memberInfo || objData.memberInfo.length === 0) ) ){
                                    $rootScope.commonMsg = 'No data found!';
                                }
                            });
                    }

                    var vm = this;
                    /** 
                     * @description
                     * Function to Edit configuration by opening a pop-up
                     *
                     * @param row - selected row
                     * @return Nil
                     
                     */
                    vm.editConfiguration = function (row) {
                        $uibModal.open({
                            templateUrl: (type === 'HyperSprout') ? '/templates/editConfiguration.html' : '/templates/editConfiguration_meter.html',
                            controller: 'EditHyperSproutOrMeterCtrl',
                            size: 'lg',
                            backdrop: 'static',
                            keyboard: true,
                            resolve: {
                                record: function () {
                                    return row;
                                },
                                list: function () {
                                    return $scope.configPrgmOptions.data;
                                },
                                type: function () {
                                    return type;
                                }
                            }
                        });
                    };

                    /**
                     * * @description
                     * Function to delete configuration by opening a pop-up
                     *
                     * @param row - selected row
                     * @return Nil
                     
                     */
                    vm.deleteConfiguration = function (row) {
                        swal({
                            title: "Warning!", text: "Are you sure you want to delete?",
                            type: "warning",
                            showCancelButton: true,
                            confirmButtonText: 'Yes',
                            cancelButtonText: "No",
                        }, function (confirm) {
                            if (confirm) {
                                hypersproutMgmtService.ConfigProgramsDelete(row.entity.Name, type).then(function (objData) {
                                    if (!angular.isUndefinedOrNull(objData) && (objData.type)) {
                                        swal(commonService.addTrademark(objData.Result));
                                    } else {
                                        swal(commonService.addTrademark(objData.Message));
                                    }
                                    $state.reload();
                                });
                            }
                        });
                    };

                    /**
                     * * @description
                     * Function to print
                     *
                     * @param nil 
                     * @return Nil
                     
                     */
                    $scope.printCart = function () {
                        window.print();
                    };

                    /**
                     * 
                     * @description
                     * Function to Config program by opening a pop-up
                     *
                     * @param row - selected row
                     * @return Nil
                     
                    
                     */
                    $scope.openConfigPrgm = function (size) {
                        $uibModal.open({
                            templateUrl: '/templates/uploadConfigPrgm.html',
                            controller: 'uploadConfigProgramCtrl',
                            size: size,
                            backdrop: 'static',
                            keyboard: true,
                            resolve: {
                                list: function () {
                                    return $scope.configPrgmOptions.data;
                                },
                                configType: function () {
                                    return type;
                                }
                            }
                        });
                    };
                }]);
})(window.angular);