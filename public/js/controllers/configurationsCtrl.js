/**
 * Controller for Configuration
 * @description
 */
(function (angular) {
    "use strict";
    angular.module('dataVINEApp')
        .controller('configurationsCtrl',
            ['$scope', '$timeout', '$uibModal', '$state',
                'hypersproutMgmtService', '$filter', 'refreshservice',
                '$controller', 'commonService',
                function ($scope, $timeout, $uibModal,
                    $state, hypersproutMgmtService, $filter,
                    refreshservice, $controller, commonService) {
                    $scope.configOptions = {};
                    $scope.startingDate = null;
                    $scope.endingDate = null;
                    $scope.invalidDate = false;
                    $scope.invalidTime = false;
                    var userTimeZone = angular.isUndefinedOrNull(objCacheDetails.userDetails) ? undefined : objCacheDetails.userDetails.timeZone;
                    if (angular.isUndefined(userTimeZone)) {
                        refreshservice.refresh().then(function () {
                            userTimeZone = objCacheDetails.userDetails.timeZone;
                            init();
                        });
                    } else {
                        init();
                    }
                    var configurationData = [];
                    var objConfigMemberInfo = {};
                    $scope.configOptions = angular.copy(objCacheDetails.grid);
                    $scope.configOptions.data = [];
                    $scope.configOptions.exporterPdfOrientation = 'landscape',
                    $scope.configOptions.exporterPdfMaxGridWidth = 640;
                    $scope.configOptions.columnDefs = [
                        { field: 'Name', width: '17%', cellTemplate: '<div class="ui-grid-cell-contents"><a class="anchorUIGrid" title="{{row.entity.Name}}" ng-click="grid.appScope.vm.nameDetails(row)">{{row.entity.Name}} </a> </div>', enableHiding: false },
                        { field: 'Description', width: '20%', enableHiding: false },
                        { field: 'Members', enableHiding: false },
                        { field: 'Device Class', enableHiding: false },
                        { field: 'Config_program', width: '18%', enableHiding: false },
                        { field: 'Edit Time', enableHiding: false },
                        { field: 'Action', cellTemplate: '<div class="ui-grid-cell-contents"><button type="button" class="btn btn-xs btn-primary cellBtn" ng-if="row.entity.ID !== 1" ng-click="grid.appScope.vm.editConfiguration(row)">  <i class="fa fa-edit"></i></button> <span ng-if="row.entity.ID !== 1">&nbsp;|&nbsp;</span><button type="button" class="btn btn-xs btn-primary cellBtn" ng-if="row.entity.ID !== 1 && row.entity.Members<=0" ng-click="grid.appScope.vm.deleteConfiguration(row)">  <i class="fa fa-remove"></i></button> </div>', enableColumnMenu: false, enableHiding: false, enableSorting: false }
                    ];

                    /**
                     * Function to initialize the configuration data
                     */
                    function init() {
                        $scope.startingDate =
                            new Date(moment.tz(userTimeZone)
                                .format('YYYY-MM-DD HH:mm'));
                        $scope.startingDate.setDate(
                            $scope.startingDate.getDate() -
                            objCacheDetails.userDetails.DefaultDataDisplayPeriod);
                        $scope.endingDate = new Date(
                            moment.tz(userTimeZone)
                                .format('YYYY-MM-DD HH:mm'));
                        $scope.endingDate = $scope.endingDate
                            .setMinutes($scope.endingDate.getMinutes() + 1);
                        configurationData = [];
                        objConfigMemberInfo = {};
                        hypersproutMgmtService.getConfigData()
                            .then(function (objData) {
                                if (!angular.isUndefinedOrNull(objData) &&
                                    !angular.isUndefinedOrNull(objData.memberInfo)) {
                                    for (var count in objData.memberInfo) {
                                        if (objData.memberInfo.hasOwnProperty(count)) {
                                            objConfigMemberInfo[objData.memberInfo[count]["configID"]] =
                                                {
                                                    "Members": objData.memberInfo[count]["Members"],
                                                    "NonMembers": objData.memberInfo[count]["NonMembers"]
                                                };
                                        }
                                    }
                                }
                                if (!angular.isUndefinedOrNull(objData) &&
                                    !angular.isUndefinedOrNull(objData.hyperSproutData)) {
                                    for (var cnt in objData.hyperSproutData) {
                                        if (objData.hyperSproutData.hasOwnProperty(cnt)) {
                                            var objToInsert = {};
                                            objToInsert["Name"] =
                                                objData.hyperSproutData[cnt].ConfigName;
                                            objToInsert["ID"] = objData.hyperSproutData[cnt].ConfigID;
                                            objToInsert["Description"] =
                                                objData.hyperSproutData[cnt].Description;
                                            objToInsert["Members"] = angular.isUndefinedOrNull(
                                                objConfigMemberInfo[objToInsert["ID"]]) ? '' : objConfigMemberInfo[objToInsert["ID"]].Members;
                                            objToInsert["Device Class"] =
                                                objData.hyperSproutData[cnt].ClassName;
                                            objToInsert["Config_program"] =
                                                objData.hyperSproutData[cnt].ConfigProgramName;
                                            objToInsert["Version"] =
                                                objData.hyperSproutData[cnt].Version;
                                            objToInsert["Edit Time"] =
                                                moment.tz(
                                                    objData.hyperSproutData[cnt].EditTime,
                                                    userTimeZone).format('YYYY-MM-DD HH:mm');
                                            configurationData.push(objToInsert);
                                        }
                                    }
                                    $scope.configOptions.data = $filter('dateFilter')(configurationData,
                                        "Edit Time", $scope.startingDate, $scope.endingDate);
                                    objCacheDetails.data.configurationDetails = configurationData;
                                }
                            });
                    }

                    var vm = this;
                    $scope.isCollapsed = false;
                    $scope.boolEdit = true;
                    $scope.dynamicPopover = {
                        templateUrl: '/templates/settings.html',
                        content: '',
                        open: function () {
                            $scope.dynamicPopover.isOpen = true;
                        },
                        close: function () {
                            $scope.dynamicPopover.isOpen = false;
                        }

                    };

                    /**
                     *  @description
                     * Function to edit configuration by
                     * opening a pop-up
                     *
                     * @param row
                     * @return Nil 
                     
                     */
                    vm.editConfiguration = function (row) {
                        objCacheDetails.data.ID = row.entity.ID;
                        $uibModal.open({
                            templateUrl: '/templates/editConfigGroup.html',
                            controller: 'editConfigGroupCtrl',
                            size: 'lg',
                            backdrop: 'static',
                            keyboard: true,
                            resolve: {
                                record: function () {
                                    return row;
                                },
                                type: function () {
                                    return "HyperSprout";
                                }
                            }
                        });
                    };

                    /**
                     *  @description
                     * Function to delete configuration by 
                     * opening a pop-up
                     *
                     * @param row
                     * @return Nil 
                     
                     */
                    vm.deleteConfiguration = function (row) {
                        var groupType = 'Configuration Group';
                        swal({
                            title: "Warning!", text: "Are you sure you want to delete?",
                            type: "warning",
                            showCancelButton: true,
                            confirmButtonText: 'Yes',
                            cancelButtonText: "No",
                        }, function (confirm) {
                            if (confirm === true) {
                                var deviceType = 'HyperSprout';
                                hypersproutMgmtService.HSGroupDelete(row.entity.ID, groupType, deviceType).then(function (objData) {
                                    if (!angular.isUndefinedOrNull(objData) && (objData.type === true)) {
                                        swal(commonService.addTrademark(objData.output));
                                    } else {
                                        swal(commonService.addTrademark(objData.Message));
                                    }
                                    $state.reload();
                                });
                            }
                        });
                    };

                    /**
                     *  @description
                     * Function to name details by
                     * opening a pop-up
                     *
                     * @param row
                     * @return Nil 
                     
                     
                     */
                    vm.nameDetails = function (row) {
                        if (angular.isUndefinedOrNull(objCacheDetails.data.configurationDetails)) {
                            objCacheDetails.data.configurationDetails = {};
                        }
                        objCacheDetails.data.configurationDetails.selectedRow = row.entity;
                        $uibModal.open({
                            templateUrl: '/templates/groupConfigurationDetails.html',
                            controller: 'groupConfigurationDetailsCtrl',
                            size: 'md',
                            backdrop: 'static',
                            keyboard: true,
                            resolve: {
                                data: hypersproutMgmtService.ListDevicesAttached(row.entity.ID, 'HyperSprout', 'Configuration Group').then(function (resObj) {
                                    var objArray = [];
                                    if (resObj.hasOwnProperty('SerialNumbers')) {
                                        for (var i = 0; i < resObj.SerialNumbers.length; i++) {
                                            objArray.push(resObj.SerialNumbers[i])
                                        }
                                        return $scope.HyperSproutList = objArray;
                                    } else return ['No Serial numbers found'];
                                }),
                                type: function () {
                                    return 'HyperSprout';
                                }
                            }
                        });
                    };

                    /**
                     *  @description
                     * Function to toggle dropdown
                     *
                     * @param row
                     * @return Nil 
                    
                     */
                    $scope.toggleDropdown = function ($event) {
                        $event.preventDefault();
                        $event.stopPropagation();
                        $scope.status.isopen = !$scope.status.isopen;
                    };

                    /**
                     *  @description
                     * Function to toggle dropdown
                     *
                     * @param nil
                     * @return Nil 
                    
                     * Function to filter configuration
                     */
                    $scope.filterConfiguration = function () {
                        $scope.configOptions.data = $filter('dateFilter')(
                            configurationData, "Edit Time",
                            $scope.startingDate, $scope.endingDate);
                        $timeout(function () {
                            $scope.$apply();
                        }, 300, false);
                        $scope.dynamicPopover.isOpen = false;
                    };
                    $controller('dateCommonCtrl', { $scope: $scope });

                    /**
                     *  @description
                     * Function to import configuration by
                     * opening a pop-up
                     *
                     * @param size
                     * @return Nil
                     
                     */
                    $scope.openImportConfiguration = function (size) {
                        $uibModal.open({
                            templateUrl: '/templates/importConfiguration.html',
                            controller: 'importConfigurationCtrl',
                            size: size,
                            backdrop: 'static',
                            keyboard: true,
                            resolve: {

                                data: function () {
                                    return $scope.configOptions.data;
                                },
                                type: function () {
                                    return 'HyperSprout';
                                }
                            }
                        });
                        $scope.dynamicPopover.isOpen = false;
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
                                data: hypersproutMgmtService.configPrograms('HyperSprout').then(function (objData) {
                                    if (!angular.isUndefinedOrNull(objData) && !angular.isUndefinedOrNull(objData.configProgramData)) {
                                        var configurationDatas = [];
                                        for (var count in objData.configProgramData) {
                                            if (objData.configProgramData.hasOwnProperty(count)) {
                                                var objToInserts = {};
                                                objToInserts["Names"] = objData.configProgramData[count].Name;
                                                configurationDatas.push(objToInserts);
                                            }
                                        }
                                        objCacheDetails.data.configPrgmData = configurationDatas;
                                        return true;
                                    }
                                }),
                                type: function () {
                                    return "HyperSprout";
                                }
                            }
                        });
                        $scope.dynamicPopover.isOpen = false;
                    };

                    /**
                     *  @description
                     * Function to print
                     *
                     * @param nil
                     * @return Nil
                     
                     */
                    $scope.printCart = function () {
                        window.print();
                    };
                }]);
})(window.angular);
