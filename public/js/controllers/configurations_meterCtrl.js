/**
 * Controller for Meter configuration
 * @description
 */
(function (angular) {
    "use strict";
    angular.module('dataVINEApp')
        .controller('configurations_meterCtrl',
            ['$scope', '$uibModal', '$timeout',
                '$state', 'MeterMgmtService', '$filter',
                'hypersproutMgmtService', 'refreshservice',
                '$controller', 'commonService', function ($scope, $uibModal,
                    $timeout, $state, MeterMgmtService, $filter,
                    hypersproutConfigService, refreshservice, $controller, commonService) {
                    $scope.meterconfigOptions = {};
                    $scope.startingDate = null;
                    $scope.endingDate = null;
                    $scope.invalidDate = false;
                    $scope.invalidTime = false;
                    var meterconfigurationData = [];
                    var objConfigMemberInfo = {};
                    var userTimeZone = angular.isUndefinedOrNull(objCacheDetails.userDetails) ? undefined : objCacheDetails.userDetails.timeZone;
                    if (angular.isUndefined(userTimeZone)) {
                        refreshservice.refresh().then(function () {
                            userTimeZone = objCacheDetails.userDetails.timeZone;
                            init();
                        });
                    } else {
                        init();
                    }
                    $scope.meterconfigOptions = angular.copy(objCacheDetails.grid);
                    $scope.meterconfigOptions.data = [];
                    $scope.meterconfigOptions.exporterPdfOrientation = 'landscape',
                    $scope.meterconfigOptions.exporterPdfMaxGridWidth = 640;
                    $scope.meterconfigOptions.columnDefs = [
                        { field: 'Name', width: '17%', cellTemplate: '<div class="ui-grid-cell-contents"><a class="anchorUIGrid" ng-click="grid.appScope.nameDetails(row)">{{row.entity.Name}} </a> </div>', enableHiding: false },
                        { field: 'Description', width: '27%', enableHiding: false },
                        { field: 'Members', width: '9%', enableHiding: false },
                        { field: 'Device_Class', width: '9%', enableHiding: false },
                        { field: 'Config_program', width: '17%', enableHiding: false },
                        { field: 'Edit Time', width: '12%', enableHiding: false },
                        { field: 'Action', cellTemplate: '<div class="ui-grid-cell-contents"><button type="button" class="btn btn-xs btn-primary cellBtn" ng-if="row.entity.ID !== 2" ng-click="grid.appScope.editConfiguration_meter(row)">  <i class="fa fa-edit"></i></button><span ng-if="row.entity.ID !== 2">&nbsp;|&nbsp;</span><button type="button" class="btn btn-xs btn-primary cellBtn" ng-if="row.entity.ID !== 2 && row.entity.Members<=0" ng-click="grid.appScope.deleteConfiguration(row)">  <i class="fa fa-remove"></i></button> </div>', enableColumnMenu: false, enableHiding: false, enableSorting: false }
                    ];

                    /**
                     * Function to initialize the configuration data
                     */
                    function init() {
                        MeterMgmtService.getConfigData().then(function (objData) {
                            $scope.startingDate =
                                new Date(moment.tz(userTimeZone).format('YYYY-MM-DD HH:mm'));
                            $scope.startingDate
                                .setDate($scope.startingDate.getDate() -
                                    objCacheDetails.userDetails.DefaultDataDisplayPeriod);
                            $scope.endingDate =
                                new Date(moment.tz(userTimeZone).format('YYYY-MM-DD HH:mm'));
                            $scope.endingDate = $scope.endingDate
                                .setMinutes($scope.endingDate.getMinutes() + 1);
                            if (!angular.isUndefinedOrNull(objData) &&
                                !angular.isUndefinedOrNull(objData.memberInfo)) {
                                for (var count in objData.memberInfo) {
                                    objConfigMemberInfo[objData.memberInfo[count]["configID"]] =
                                        {
                                            "Members": objData.memberInfo[count]["Members"],
                                            "NonMembers": objData.memberInfo[count]["NonMembers"]
                                        };
                                }
                            }
                            if (!angular.isUndefinedOrNull(objData) &&
                                !angular.isUndefinedOrNull(objData.meterData)) {
                                for (var cnt in objData.meterData) {
                                    if (objData.meterData.hasOwnProperty(cnt)) {
                                        var objToInsert = {};
                                        objToInsert["ID"] = objData.meterData[cnt].ConfigID;
                                        objToInsert["Name"] = objData.meterData[cnt].ConfigName;
                                        objToInsert["Description"] = objData.meterData[cnt].Description;
                                        objToInsert["Members"] =
                                            angular.isUndefinedOrNull(
                                                objConfigMemberInfo[objToInsert["ID"]]) ? '' : objConfigMemberInfo[objToInsert["ID"]].Members;
                                        objToInsert["Device_Class"] = objData.meterData[cnt].ClassName;
                                        objToInsert["Config_program"] =
                                            objData.meterData[cnt].ConfigProgramName;
                                        objToInsert["Version"] = objData.meterData[cnt].Version;
                                        objToInsert["Edit Time"] =
                                            moment.tz(objData.meterData[cnt].EditTime, userTimeZone)
                                                .format('YYYY-MM-DD HH:mm');
                                        meterconfigurationData.push(objToInsert);
                                    }
                                }
                                $scope.meterconfigOptions.data =
                                    $filter('dateFilter')(meterconfigurationData, "Edit Time", $scope.startingDate, $scope.endingDate);
                                objCacheDetails.data.configurationDetails = meterconfigurationData;
                            }
                        });
                    }
                    $scope.isCollapsed = false;
                    $scope.boolEdit = true;
                    $scope.dynamicPopover = {
                        templateUrl: '/templates/settings_MeterConfigurations.html',
                        content: '',
                        open: function () {
                            $scope.dynamicPopover.isOpen = true;
                        },
                        close: function () {
                            $scope.dynamicPopover.isOpen = false;
                        }
                    };

                    /**
                     * @description
                     * Function to clear start and end dates
                     *
                     * @param nil
                     * @return Nil
                     
                     */
                    $scope.clear = function () {
                        $scope.startingDate = null;
                        $scope.endingDate = null;
                    };

                    /**
                     * * @description
                     * Function to filter meter configuration
                     *
                     * @param nil
                     * @return Nil
                     */
                    $scope.filterMeterConf = function () {
                        $scope.invalidDate = false;
                        $scope.invalidTime = false;
                        $scope.meterconfigOptions.data =
                            $filter('dateFilter')(meterconfigurationData,
                                "Edit Time", $scope.startingDate, $scope.endingDate);
                        $timeout(function () {
                            $scope.$apply();
                        }, 300, false);
                        $scope.dynamicPopover.isOpen = false;
                    };
                    $controller('dateCommonCtrl', { $scope: $scope });

                    /**
                     * @description
                     * Function to edit meter configurations
                     * by opening a pop-up
                     *
                     * @param row
                     * @return Nil
                     
                     */
                    $scope.editConfiguration_meter = function (row) {
                        objCacheDetails.data.ID = row.entity.ID;
                        $uibModal.open({
                            templateUrl: '/templates/editConfigGroup_meter.html',
                            controller: 'editConfigGroupCtrl',
                            size: 'lg',
                            backdrop: 'static',
                            keyboard: true,
                            resolve: {
                                record: function () {
                                    return row;
                                },
                                type: function () {
                                    return "Meter";
                                }
                            }
                        });
                    };

                    /**
                     * @description
                     * Function to delete configuration
                     *
                     * @param row
                     * @return Nil
                     
                     
                     */
                    $scope.deleteConfiguration = function (row) {
                        var groupType = 'Configuration Group';
                        swal({
                            title: "Warning!", text: "Are you sure you want to delete?",
                            type: "warning",
                            showCancelButton: true,
                            confirmButtonText: 'Yes',
                            cancelButtonText: "No",
                        }, function (confirm) {
                            if (confirm === true) {
                                var deviceType = 'Meter';
                                hypersproutConfigService
                                    .HSGroupDelete(row.entity.ID, groupType, deviceType)
                                    .then(function (objData) {
                                        if (!angular.isUndefinedOrNull(objData) &&
                                            (objData.type === true)) {
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
                     * @description
                     * Function to name details
                     *
                     * @param row
                     * @return Nil
                     
                     
                     */
                    $scope.nameDetails = function (row) {
                        if (angular.isUndefinedOrNull(
                            objCacheDetails.data.configurationDetails)) {
                            objCacheDetails.data.configurationDetails = {};
                        }
                        objCacheDetails.data.configurationDetails.selectedRow =
                            row.entity;
                        $uibModal.open({
                            templateUrl: '/templates/groupConfigurationDetails.html',
                            controller: 'groupConfigurationDetailsCtrl',
                            size: 'md',
                            backdrop: 'static',
                            keyboard: true,
                            resolve: {
                                data: hypersproutConfigService
                                    .ListDevicesAttached(row.entity.ID,
                                        'Meter', 'Configuration Group')
                                    .then(function (resObj) {
                                        var objArray = [];
                                        if (resObj.hasOwnProperty('SerialNumbers')) {
                                            for (var i = 0; i < resObj.SerialNumbers.length; i++) {
                                                objArray.push(resObj.SerialNumbers[i]);
                                            }
                                            return $scope.HyperSproutList = objArray;
                                        }
                                        return ['No Serial numbers found'];
                                    }),
                                type: function () {
                                    return 'Meter';
                                }
                            }
                        });
                    };

                    $scope.status = {
                        isopen: false
                    };

                    /**
                     * @description
                     * Function to Toggle dropdown
                     *
                     * @param event
                     * @return Nil
                     
                     */
                    $scope.toggleDropdown = function ($event) {
                        $event.preventDefault();
                        $event.stopPropagation();
                        $scope.status.isopen = !$scope.status.isopen;
                    };

                    /**
                     * @description
                     * Function to import meter configuration by 
                     * opening a pop-up
                     *
                     * @param size
                     * @return Nil
                     
                    
                     */
                    $scope.openImportConfiguration_Meter = function (size) {
                        $uibModal.open({
                            templateUrl: '/templates/importConfiguration_meter.html',
                            controller: 'importConfigurationCtrl',
                            size: size,
                            backdrop: 'static',
                            keyboard: true,
                            resolve: {
                                data: function () {
                                    return $scope.meterconfigOptions.data;
                                },
                                type: function () {
                                    return 'Meter';
                                }
                            }
                        });
                        $scope.dynamicPopover.isOpen = false;
                    };

                    /**
                     *  @description
                     * Function to create a new meter configuration
                     * by opening a pop-up
                     *
                     * @param size
                     * @return Nil
                     
                    
                     
                     */
                    $scope.openNewConfiguration_Meter = function (size) {
                        objCacheDetails.data.deviceClass = $scope.meterconfigurationData;
                        $uibModal.open({
                            templateUrl: '/templates/newConfiguration_meter.html',
                            controller: 'newConfigurationCtrl',
                            size: size,
                            backdrop: 'static',
                            keyboard: true,
                            resolve: {
                                data: hypersproutConfigService.configPrograms('Meter').then(function (objData) {
                                    if (!angular.isUndefinedOrNull(objData) && !angular.isUndefinedOrNull(objData.configProgramData)) {
                                        var configurationDatas = [];
                                        for (var c in objData.configProgramData) {
                                            if (objData.configProgramData.hasOwnProperty(c)) {
                                                var objToInserts = {};
                                                objToInserts["Names"] = objData.configProgramData[c].Name;
                                                configurationDatas.push(objToInserts);
                                            }
                                        }
                                        objCacheDetails.data.configPrgmData = configurationDatas;
                                        return true;
                                    }
                                }),
                                type: function () {
                                    return "Meter";
                                }
                            }
                        });
                        $scope.dynamicPopover.isOpen = false;
                    };

                    /**
                     *  @description
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