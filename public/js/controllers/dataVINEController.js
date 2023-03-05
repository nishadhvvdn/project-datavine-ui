/**
 * Controller for main page
 * @description
 */
(function (angular) {

    "use strict";

    angular.module('dataVINEApp', ['ui.router',
        'onlineHelp', 'ngMessages', 'file-model',
        'ngIdle', 'ngAnimate', 'ui.bootstrap',
        'ui.grid', 'ngTouch', 'ui.grid.selection',
        'ui.grid.exporter', 'ui.grid.resizeColumns',
        'ui.grid.pagination', 'ncy-angular-breadcrumb',
        'angular-country-timezone-picker',
        'angularjs-dropdown-multiselect',
        'angular-timezone-selector', 'ngFileUpload',
        'swxSessionStorage'])

        .config(['$stateProvider',
        '$urlRouterProvider', 'IdleProvider',
        'KeepaliveProvider', '$httpProvider', function ($stateProvider,
            $urlRouterProvider, IdleProvider,
            KeepaliveProvider, $httpProvider) {

            IdleProvider.idle(900);
            IdleProvider.timeout(60);
            KeepaliveProvider.interval(600);

            $urlRouterProvider.otherwise("/login");
            $httpProvider.defaults.withCredentials = true;
            $stateProvider

                .state('login', {
                    url: '/login',
                    templateUrl: 'pages/login.html',
                    controller: 'loginCtrl'

                })

                .state('master', {
                    url: '/master',
                    templateUrl: 'pages/homescreen.html',
                    controller: 'homeCtrl'
                })

                .state('hyperSprout', {
                    abstract: true,
                    url: "/hyperSprout",
                    templateUrl: "pages/hyperSproutManagement_mainview.html",
                    controller: 'hyperSproutManagement_mainviewCtrl'
                })
                .state('hyperSprout.hyperSproutJobStatus', {
                    url: '/hyperSproutJobStatus',
                    templateUrl: 'pages/hyperSproutJobStatus.html',
                    controller: 'jobStatusCtrl',
                    resolve: {
                        type: function () {
                            return 'HyperSprout';
                        }
                    }
                })
                .state('hyperSprout.configurationManagement.configPrgm', {
                    url: '/configPrgm',
                    views: {
                        '@hyperSprout.configurationManagement': {
                            templateUrl: 'pages/configProgram.html',
                            controller: 'configProgramCtrl',
                            controllerAs: 'vm',
                            resolve: {
                                type: function () {
                                    return 'HyperSprout';
                                }
                            }
                        }
                    }
                })


                .state('hyperSprout.configurationManagement.configurations', {
                    url: '/configurations',
                    views: {
                        '@hyperSprout.configurationManagement': {
                            templateUrl: 'pages/configurations.html',
                            controller: 'configurationsCtrl',
                            controllerAs: 'vm'
                        }
                    }
                })


                .state('hyperSprout.groupManagement', {
                    url: '/groupManagement',
                    templateUrl: 'pages/groupManagement.html',
                    controller: 'groupManagementCtrl',
                    controllerAs: 'vm'
                })


                .state('hyperSprout.firmwareManagement', {
                    url: '/firmwareManagement',
                    templateUrl: 'pages/firmwareManagement.html',
                    controller: 'firmwareManagementCtrl',
                    resolve: {
                        deviceType: function () {
                            return 'HyperSprout';
                        }
                    }
                })

                .state('meter.firmwareManagement', {
                    url: '/meterfirmwareManagement',
                    templateUrl: 'pages/firmwareManagement_meter.html',
                    controller: 'firmwareManagementCtrl',
                    resolve: {
                        deviceType: function () {
                            return 'Meter';
                        }
                    }
                })
                .state('hyperSprout.configurationManagement.downloads', {
                    url: '/downloads',
                    views: {
                        '@hyperSprout.configurationManagement': {
                            templateUrl: 'pages/hyperSproutDownloads.html',
                            controller: 'hyperSproutDownloadsCtrl'
                        }
                    }
                })

                .state('hyperSprout.configurationManagement.discrepancies', {
                    url: '/discrepancies',
                    views: {
                        '@hyperSprout.configurationManagement': {
                            templateUrl: 'pages/tags.html',
                            controller: 'discrepanciesCtrl',
                            resolve: {
                                endpoint: function () {
                                    return 'HSMTagDiscrepancies';
                                }
                            }
                        }
                    }
                })

                .state('meter', {
                    abstract: true,
                    url: "/meter",
                    templateUrl: "pages/meterManagement_mainview.html",
                    controller: 'meterManagement_mainviewCtrl'
                })
                .state('meter.configurationManagement.configPrgm', {
                    url: '/configPrgm',
                    views: {
                        '@meter.configurationManagement': {
                            templateUrl: 'pages/configProgram_meter.html',
                            controller: 'configProgramCtrl',
                            controllerAs: 'vm',
                            resolve: {
                                type: function () {
                                    return 'Meter';
                                }
                            }
                        }
                    }
                })

                .state('meter.configurationManagement.configurations', {
                    url: '/meterconfigurations',
                    views: {
                        '@meter.configurationManagement': {
                            templateUrl: 'pages/configurations_meter.html',
                            controller: 'configurations_meterCtrl',
                        }
                    }
                })


                .state('meter.configurationManagement.discrepancies', {
                    url: '/meterdiscrepancies',
                    views: {
                        '@meter.configurationManagement': {
                            templateUrl: 'pages/tags_meter.html',
                            controller: 'discrepanciesCtrl',
                            resolve: {
                                endpoint: function () {
                                    return 'MMTagDiscrepancies';
                                }
                            }
                        }
                    }
                })

                .state('meter.configurationManagement.downloads', {
                    url: '/meterdownloads',
                    views: {
                        '@meter.configurationManagement': {
                            templateUrl: 'pages/meterDownloads.html',
                            controller: 'meterDownloadsCtrl'
                        }
                    }
                })

                .state('meter.groupManagement', {
                    url: '/metergroupManagement',
                    templateUrl: 'pages/groupManagement_meter.html',
                    controller: 'groupManagement_meterCtrl',
                    controllerAs: 'vm'
                })

                .state('meter.JobStatus', {
                    url: '/meterJobStatus',
                    templateUrl: 'pages/meterJobStatus.html',
                    controller: 'jobStatusCtrl',
                    resolve: {
                        type: function () {
                            return 'Meter';
                        }
                    }
                })
                .state('meter.MeterBulkOperation', {
                    url: '/meterBulkOperation',
                    templateUrl: 'pages/meterBulkOperation.html',
                    controller: 'meterBulkOperationCtrl',
                })

                .state('dashboard', {
                   url: "/dashboard",
                    templateUrl: "pages/dashboard.html",
                    controller: 'dashboardCtrl',
                    resolve: {
                        type: function () {
                            return 'Meter';
                        }
                    }
                })

                .state('deltaLink', {
                    abstract: true,
                    url: "/deltaLink",
                    templateUrl: "pages/deltaLinkManagement_mainview.html",
                    controller: 'meterManagement_mainviewCtrl'
                })

                .state('deltaLink.groupManagement', {
                    url: '/deltaLinkGroupManagement',
                    templateUrl: 'pages/groupManagement_DeltaLink.html',
                    controller: 'groupManagement_DeltaLinkCtrl',
                    controllerAs: 'vm'
                })

                .state('deltaLink.firmwareManagement', {
                    url: '/deltaLinkFirmwareManagement',
                    templateUrl: 'pages/firmwareManagement_DeltaLink.html',
                    controller: 'deltaLinkFirmwareManagementCtrl',
                    resolve: {
                        deviceType: function () {
                            return 'DeltaLink';
                        }
                    }
                })

                .state('deltaLink.JobStatus', {
                    url: '/deltaLinkJobStatus',
                    templateUrl: 'pages/deltaLinkJobStatus.html',
                    controller: 'deltaLinkJobStatusCtrl',
                    resolve: {
                        type: function () {
                            return 'DeltaLink';
                        }
                    }
                })

                .state('system', {
                    abstract: true,
                    url: "/system",
                    templateUrl: "pages/systemManagement_mainview.html",
                    controller: "systemManagement_mainviewCtrl"
                })
                .state('system.technicalLossEntry', {
                    url: "/technicalLossEntry",
                    templateUrl: "pages/technicalLoss.html",
                    controller: 'technicalLossEntryCtrl',
                    controllerAs: 'vm'
                })
                .state('system.meterDeltalink', {
                    url: "/meterDeltalink",
                    templateUrl: "pages/metertoDeltalink.html",
                    controller: 'metertoDeltalinkCtrl',
                    controllerAs: 'vm'
                })
                .state('system.unassignedDeltaLink', {
                    url: '/unassignedDeltaLink',
                    templateUrl: 'pages/unassignedDeltaLink.html',
                    controller: 'unassignedDeltaLinkCtrl',
                    controllerAs: 'vm'
                })
                .state('system.hyperhublogs', {
                    url: "/hyperhublogs",
                    templateUrl: "pages/devicelogs.html",
                    controller: 'deviceLogsCtrl',
                    resolve: {
                        deviceType: function () {
                            return 'hyperhub';
                        }
                    }
                }).state('system.hypersproutlogs', {
                    url: "/hypersproutlogs",
                    templateUrl: "pages/devicelogs.html",
                    controller: 'deviceLogsCtrl',
                    resolve: {
                        deviceType: function () {
                            return 'hypersprout';
                        }
                    }
                }).state('system.meterlogs', {
                    url: "/meterlogs",
                    templateUrl: "pages/devicelogs.html",
                    controller: 'deviceLogsCtrl',
                    resolve: {
                        deviceType: function () {
                            return 'meter';
                        }
                    }
                }).state('system.deltalinklogs', {
                    url: "/deltalinklogs",
                    templateUrl: "pages/devicelogs.html",
                    controller: 'deviceLogsCtrl',
                    resolve: {
                        deviceType: function () {
                            return 'deltalink';
                        }
                    }
                })
                .state('system.deviceManagement', {
                    url: "/deviceManagement",
                    templateUrl: "pages/deviceManagement.html",
                    controller: 'deviceManagementCtrl'
                })
                .state('system.deviceManagement.relays', {
                    url: "/relays",
                    views: {
                        '@system.deviceManagement': {
                            templateUrl: "pages/relays.html",
                            controller: 'relaysCtrl',
                            resolve: {
                                type: function () {
                                    return 'HyperSprout';
                                }
                            }
                        }
                    }
                })
                .state('system.deviceManagement.hyperhub', {
                    url: "/hyperhub",
                    views: {
                        '@system.deviceManagement': {
                            templateUrl: "pages/relays.html",
                            controller: 'relaysCtrl',
                            resolve: {
                                type: function () {
                                    return 'Hyperhub';
                                }
                            }
                        }
                    }
                })

                .state('system.deviceManagement.meters', {
                    url: "/meters",
                    views: {
                        '@system.deviceManagement': {
                            templateUrl: "pages/meters.html",
                            controller: 'metersCtrl'
                        }
                    }
                })
                .state('system.deviceManagement.deltaLink', {
                    url: "/deltaLinks",
                    views: {
                        '@system.deviceManagement': {
                            templateUrl: "pages/deltaLink.html",
                            controller: 'deltaLinkCtrl'
                        }
                    },
                    ncyBreadcrumb: {
                        label: 'DeltaLINK\u2122'
                    }
                })

                .state('system.networkJobStatus', {
                    url: "/JobStatus",
                    templateUrl: "pages/systemUpdates.html",
                    controller: "systemUpdatesCtrl",
                    resolve: {
                        type: function () {
                            return 'netWorkJobStatus';
                        }
                    }
                })

                .state('system.networkStatistics', {
                    url: "/networkStatistics",
                    templateUrl: "pages/dataVineHealth.html",
                    controller: 'dataVineHealthCtrl',
                    ncyBreadcrumb: {
                        skip: true
                    }
                })

                .state('system.networkStatistics.cellEndpoints_networkStatistics', {
                    url: "/cellEndpoints_networkStatistics",
                    views: {
                        '@system': {
                            templateUrl: "pages/cellEndpoints_DataVINEHealth.html",
                            controller: 'home',
                            controllerAs: "vm",
                        }
                    },
                    ncyBreadcrumb: {
                        label: 'Endpoints',
                        parent: function ($scope) {
                            return $scope.from || 'system.networkStatistics.cellRelays_networkStatistics';
                        }
                    }
                })

                .state('system.registration', {
                    url: "/registration",
                    templateUrl: "pages/registration.html",
                    controller: 'registrationCtrl',
                    ncyBreadcrumb: {
                        skip: true
                    }
                })

                .state('system.registration.circuitEntry', {
                    url: "/circuitEntry",
                    views: {
                        '@system.registration': {
                            templateUrl: "pages/circuitRegistration.html",
                            controller: 'circuitRegistrationCtrl',
                            controllerAs: 'vm',
                        }
                    },
                    ncyBreadcrumb: {
                        label: 'List of Circuits',
                    }
                })


                .state('system.registration.transformerEntry', {
                    url: "/transformerEntry",
                    views: {
                        '@system.registration': {
                            templateUrl: "pages/transformerRegistration.html",
                            controller: 'transformerRegistrationCtrl',
                            controllerAs: 'vm',
                        }
                    },
                    ncyBreadcrumb: {
                        label: 'Transformer'
                    }
                })                
                .state('system.registration.meterEntry', {
                    url: "/meterEntry",
                    views: {
                        '@system.registration': {
                            templateUrl: "pages/meterRegistration.html",
                            controller: 'meterRegistrationCtrl',
                            controllerAs: 'vm',
                            
                        }
                    },
                    ncyBreadcrumb: {
                        label: 'Meter Level'
                    }
                })
                .state('system.registration.deltaLinkEntry', {
                    url: "/deltaLinkEntry",
                    views: {
                        '@system.registration': {
                            templateUrl: "pages/deltaLinkRegistration.html",
                            controller: 'deltaLinkRegistrationCtrl',
                            controllerAs: 'vm',
                        }
                    },
                    ncyBreadcrumb: {
                        label: 'DeltaLINK\u2122'
                    }
                })

                .state('system.grouping', {
                    url: "/grouping",
                    templateUrl: "pages/grouping.html",
                    controller: 'groupingCtrl',
                    ncyBreadcrumb: {
                        skip: true
                    }
                })
                .state('system.grouping.circuitGrouping', {
                    url: "/circuitGrouping",
                    templateUrl: "pages/circuitGrouping.html",
                    controller: 'circuitGroupingCtrl',
                    controllerAs: 'vm',
                    ncyBreadcrumb: {
                        label: 'DTC Level'
                    }
                })
                .state('system.grouping.transformerGrouping', {
                    url: "/transformerGrouping",
                    templateUrl: "pages/transformerGrouping.html",
                    controller: 'transformerGroupingCtrl',
                    controllerAs: 'vm',
                    ncyBreadcrumb: {
                        label: 'Transformer Level',
                        parent: function ($scope) {
                            return $scope.from || 'system.grouping.circuitGrouping';
                        }
                    }
                })

                .state('system.grouping.transformerMeterGrouping', {
                    url: "/transformerMeterGrouping",
                    templateUrl: "pages/transformerMeterGrouping.html",
                    controller: 'transformerMeterGroupingCtrl',
                    controllerAs: 'vm',
                    ncyBreadcrumb: {
                        label: 'Meter Level',
                        parent: function ($scope) {
                            return $scope.from || 'system.grouping.transformerGrouping';
                        }
                    }
                })
                .state('system.grouping.unassignedTransformers', {
                    url: "/unassignedTransformers",
                    templateUrl: "pages/unassignedTransformerList.html",
                    controller: 'unassignedTransformerListCtrl',
                    controllerAs: 'vm',
                })

                .state('system.grouping.unassignedMeterList', {

                    url: '/unassignedMeterList',
                    templateUrl: 'pages/unassignedMeterList.html',
                    controller: 'unassignedMeterListCtrl',
                    controllerAs: 'vm',
                    ncyBreadcrumb: {
                        label: 'Info',
                        parent: 'system.grouping.transformerMeterGrouping'

                    }
                })


                .state('createCircuit', {
                    url: '/createCircuit',
                    templateUrl: 'templates/createCircuit.html',
                    controller: 'newCircuitConfigurationCtrl',
                    controllerAs: 'vm',
                    ncyBreadcrumb: {
                        label: 'Circuit Creation',
                        parent: 'system.registration.circuitEntry'

                    }
                })

                .state('editCircuit', {

                    url: '/editCircuit',
                    templateUrl: 'templates/createCircuit.html',
                    controller: 'newCircuitConfigurationCtrl',
                    controllerAs: 'vm',
                })

                .state('createTransformer', {
                    url: '/createTransformer',
                    templateUrl: 'templates/createTransformer.html',
                    controller: 'newXfmerConfigurationCtrl',
                    ncyBreadcrumb: {
                        parent: 'system.registration.transformerEntry'

                    },
                })

                .state('editTransformer', {
                    url: '/editTransformer',
                    templateUrl: 'templates/createTransformer.html',
                    controller: 'newXfmerConfigurationCtrl',
                    controllerAs: 'vm',
                })

                .state('otpModelShow', {
                    url: '/otpModelShow',
                    templateUrl: 'templates/createTransformerOTP.html',
                    controller: 'newXfmerConfigurationCtrl',
                    controllerAs: 'vm',
                })

                .state('tools', {
                    abstract: true,
                    url: "/tools",
                    templateUrl: "pages/tools_mainview.html",
                })

                .state('tools.userSettings', {
                    url: '/userSettings',
                    templateUrl: 'pages/userSettings.html',
                    controller: 'userSettingsCtrl'
                })

                .state('administration', {
                    abstract: true,
                    url: "/administration",
                    templateUrl: "pages/administration_mainview.html",
                })


                .state('administration.security', {
                    url: "/security",
                    templateUrl: "pages/security.html",
                    controller: 'securityCtrl'
                })


                .state('administration.systemSettings', {
                    url: "/systemSettings",
                    templateUrl: "pages/systemSettings.html",
                    controller: 'systemSettingsCtrl'
                })


                .state('administration.defineUsers', {
                    url: "/defineUsers",
                    templateUrl: "pages/defineUsers.html",
                    controller: 'defineUsersCtrl'
                })

                .state('reports', {
                    abstract: true,
                    url: "/reports",
                    templateUrl: "pages/reports_mainview.html",
                    controller: function ($scope,DeviceService) {
                        $scope.messageCount = 0;
                        DeviceService.GetMessageCount().then(function (apiData) {
                            if(apiData.type){
                                $scope.messageCount = apiData.data;
                            } else {
                              swal(apiData.Message);
                            }                    
                        });
                        $scope.selectHypersproutComm = function () {
                            $('#communication').click();
                        };
                    }
                })


                .state('reports.communicationStatistics', {
                    url: "/communicationStatistics",
                    templateUrl: "pages/communicationStatistics.html",
                    controller: "communicationStatisticsCtrl"
                })

                .state('reports.communicationStatistics.hypersproutEntry', {
                    url: "/hypersproutEntry",
                    views: {
                        '@reports.communicationStatistics': {
                            templateUrl: "pages/hypersproutComm.html",
                            controller: 'hypersproutCommCtrl',
                            resolve: {
                                type: function () {
                                    return 'HyperSprout';
                                }
                            }
                        }
                    }
                })
                .state('reports.communicationStatistics.hyperhubEntry', {
                    url: "/hyperhubEntry",
                    views: {
                        '@reports.communicationStatistics': {
                            templateUrl: "pages/hypersproutComm.html",
                            controller: 'hypersproutCommCtrl',
                            resolve: {
                                type: function () {
                                    return 'Hyperhub';
                                }
                            }
                        }
                    }
                })

                .state('reports.communicationStatistics.meterEntry', {
                    url: "/meterEntry",
                    views: {
                        '@reports.communicationStatistics': {
                            templateUrl: "pages/hypersproutComm.html",
                            controller: 'hypersproutCommCtrl',
                            resolve: {
                                type: function () {
                                    return 'Meter';
                                }
                            }
                        }
                    }
                })




                // .state('reports.dataConsumption', {
                //     url: "/dataConsumption",
                //     templateUrl: "pages/dataConsumption.html",
                //     controller: "dataConsumptionCtrl"
                // })


                .state('reports.dataVineHealth', {
                    url: "/dataVineHealth",
                    templateUrl: "pages/dataVineHealth_reports.html",
                    controller: "dataVineHealth_reportsCtrl"
                })


                .state('reports.systemLogs', {
                    url: "/systemLogs",
                    templateUrl: "pages/systemLog.html",
                    controller: "systemLogsCtrl"
                })

                .state('reports.deviceFirmwareVersions', {
                    url: "/deviceFirmwareVersions",
                    templateUrl: "pages/deviceFirmwareVersions.html",
                    controller: "deviceFirmwareVersionsCtrl"
                })
                .state('reports.deviceFirmwareVersions.hypersproutEntry', {
                    url: "/hypersproutEntry",
                    views: {
                        '@reports.deviceFirmwareVersions': {
                            templateUrl: "pages/hypersproutDeviceFirmware.html",
                            controller: 'hypersproutDeviceFirmwareCtrl',
                            resolve: {
                                type: function () {
                                    return 'HyperSprout';
                                }
                            }
                        }
                    }
                })
                .state('reports.deviceFirmwareVersions.hyperhubEntry', {
                    url: "/hyperhubEntry",
                    views: {
                        '@reports.deviceFirmwareVersions': {
                            templateUrl: "pages/hypersproutDeviceFirmware.html",
                            controller: 'hypersproutDeviceFirmwareCtrl',
                            resolve: {
                                type: function () {
                                    return 'Hyperhub';
                                }
                            }
                        }
                    }
                })

                .state('reports.deviceFirmwareVersions.meterEntry', {
                    url: "/meterEntry",
                    views: {
                        '@reports.deviceFirmwareVersions': {
                            templateUrl: "pages/hypersproutDeviceFirmware.html",
                            controller: 'hypersproutDeviceFirmwareCtrl',
                            resolve: {
                                type: function () {
                                    return 'Meter';
                                }
                            }
                        }
                    }
                })


                .state('reports.newAccounts_Report', {
                    url: "/newAccounts_Report",
                    templateUrl: "pages/newAccounts_Report.html",
                    controller: "newAccounts_ReportCtrl"
                })
                .state('reports.systemAuditLog', {
                    url: "/systemAuditLog",
                    templateUrl: "pages/systemAuditLog.html",
                    controller: "systemAuditLogCtrl"
                })
                .state('reports.message', {
                    url: "/message",
                    templateUrl: "pages/Message.html",
                    controller: 'messageCtrl',                    
                        
                })
                .state('system.registration.hyperHubEntry', {
                    url: "/hyperHubEntry",
                    views: {
                        '@system.registration': {
                            templateUrl: "pages/hyperHubRegistration.html",
                            controller: 'hyperHubRegistrationCtrl',
                            controllerAs: 'vm',
                        }
                    },
                    ncyBreadcrumb: {
                        label: 'List of HyperHUBs\u2122',
                    }
                })
                .state('system.registration.endpointEntry', {
                    url: "/endpointEntry",
                    views: {
                        '@system.registration': {
                            templateUrl: "pages/endpointRegistration.html",
                            controller: 'endpointRegistrationCtrl',
                            controllerAs: 'vm',
                        }
                    },
                    ncyBreadcrumb: {
                        label: 'List of HyperHUBs\u2122',
                    }
                })
                .state('system.grouping.hyperHubGrouping', {
                    url: "/hyperHubGrouping",
                    templateUrl: "pages/hyperHubGrouping.html",
                    controller: 'hyperHubGroupingCtrl',
                    controllerAs: 'vm',
                    ncyBreadcrumb: {
                        label: 'HyperHUB\u2122 Level',
                        parent: function ($scope) {
                            return $scope.from || 'system.grouping.transformerGrouping';
                        }
                    }
                })

                .state('system.grouping.unassignedHyperHubList', {

                    url: '/unassignedHyperHubList',
                    templateUrl: 'pages/unAssignedHyperHubList.html',
                    controller: 'unassignedHyperHubListCtrl',
                    controllerAs: 'vm',
                    ncyBreadcrumb: {
                        label: 'Info',
                        parent: 'system.grouping.hyperHubGrouping'

                    }
                })

                .state('system.hypersproutconfig', {
                    url: "/hypersproutconfig",
                    templateUrl: "pages/device_config/hypersprout/deviceConfigurationManagement.html",
                    controller: "hypersproutdeviceconfigCtrl", 
                    resolve: {
                        deviceType: function () {
                            return 'HyperSprout';
                        }
                    }
                })
                .state('system.hypersproutconfig.systeminformation', {
                    url: "/systeminformation",
                    templateUrl: "pages/device_config/hypersprout/sytemInformation_config.html",
                    controller: "deviceHypersproutConfigurationManagementCtrl", 
                    resolve: {
                        deviceType: function () {
                            return 'HyperSprout';
                        }
                    }
                })
                .state('system.hypersproutconfig.frontHaulRadio', {
                    url: "/frontHaulRadio",
                    templateUrl: "pages/device_config/hypersprout/frontHaulRadioConfiguration.html",
                    controller: "deviceHypersproutConfigurationManagementCtrl", 
                    resolve: {
                        deviceType: function () {
                            return 'HyperSprout';
                        }
                    }
                })
                .state('system.hypersproutconfig.frontHaulMesh', {
                    url: "/frontHaulMesh",
                    templateUrl: "pages/device_config/hypersprout/frontHaulMeshConfiguration.html",
                    controller: "deviceHypersproutConfigurationManagementCtrl", 
                    resolve: {
                        deviceType: function () {
                            return 'HyperSprout';
                        }
                    }
                })
                .state('system.hypersproutconfig.frontHaulHotspot', {
                    url: "/frontHaulHotspot",
                    templateUrl: "pages/device_config/hypersprout/frontHaulHotspotConfiguration.html",
                    controller: "deviceHypersproutConfigurationManagementCtrl", 
                    resolve: {
                        deviceType: function () {
                            return 'HyperSprout';
                        }
                    }
                })
                .state('system.hypersproutconfig.frontHaulDhcp', {
                    url: "/frontHaulDhcp",
                    templateUrl: "pages/device_config/hypersprout/frontHaulDhcpConfiguration.html",
                    controller: "deviceHypersproutConfigurationManagementCtrl", 
                    resolve: {
                        deviceType: function () {
                            return 'HyperSprout';
                        }
                    }
                })
                .state('system.hypersproutconfig.backHaul', {
                    url: "/backHaul",
                    templateUrl: "pages/device_config/hypersprout/backHaulConfiguration.html",
                    controller: "deviceHypersproutConfigurationManagementCtrl", 
                    resolve: {
                        deviceType: function () {
                            return 'HyperSprout';
                        }
                    }
                })
                .state('system.hypersproutconfig.cloudConnectivity', {
                    url: "/cloudConnectivity",
                    templateUrl: "pages/device_config/hypersprout/cloudConnctivityConfiguration.html",
                    controller: "deviceHypersproutConfigurationManagementCtrl", 
                    resolve: {
                        deviceType: function () {
                            return 'HyperSprout';
                        }
                    }
                })
                .state('system.hypersproutconfig.alarms', {
                    url: "/alarms",
                    templateUrl: "pages/device_config/hypersprout/alarmsConfiguration.html",
                    controller: "deviceHypersproutConfigurationManagementCtrl", 
                    resolve: {
                        deviceType: function () {
                            return 'HyperSprout';
                        }
                    }
                })
                .state('system.hypersproutconfig.bandwidthLimitations', {
                    url: "/bandwidthLimitations",
                    templateUrl: "pages/device_config/hypersprout/bandwidthLimitations.html",
                    controller: "deviceHypersproutConfigurationManagementCtrl", 
                    resolve: {
                        deviceType: function () {
                            return 'HyperSprout';
                        }
                    }
                })
                .state('system.hypersproutconfig.systemSettings', {
                    url: "/systemSettings",
                    templateUrl: "pages/device_config/hypersprout/systemSettingsConfiguration.html",
                    controller: "deviceHypersproutConfigurationManagementCtrl", 
                    resolve: {
                        deviceType: function () {
                            return 'HyperSprout';
                        }
                    }
                })
                .state('system.hyperhubconfig', {
                    url: "/hyperhubconfig",
                    templateUrl: "pages/device_config/hyperhub/deviceConfigurationManagement.html",
                    controller: "hypersproutdeviceconfigCtrl", 
                    resolve: {
                        deviceType: function () {
                            return 'HyperHub';
                        }
                    }
                })
                .state('system.hyperhubconfig.systeminformation', {
                    url: "/systeminformation",
                    templateUrl: "pages/device_config/hypersprout/sytemInformation_config.html",
                    controller: "deviceHypersproutConfigurationManagementCtrl", 
                    resolve: {
                        deviceType: function () {
                            return 'HyperHub';
                        }
                    }
                })
                .state('system.hyperhubconfig.frontHaulRadio', {
                    url: "/frontHaulRadio",
                    templateUrl: "pages/device_config/hypersprout/frontHaulRadioConfiguration.html",
                    controller: "deviceHypersproutConfigurationManagementCtrl", 
                    resolve: {
                        deviceType: function () {
                            return 'HyperHub';
                        }
                    }
                })
                .state('system.hyperhubconfig.frontHaulMesh', {
                    url: "/frontHaulMesh",
                    templateUrl: "pages/device_config/hypersprout/frontHaulMeshConfiguration.html",
                    controller: "deviceHypersproutConfigurationManagementCtrl", 
                    resolve: {
                        deviceType: function () {
                            return 'HyperHub';
                        }
                    }
                })
                .state('system.hyperhubconfig.frontHaulHotspot', {
                    url: "/frontHaulHotspot",
                    templateUrl: "pages/device_config/hypersprout/frontHaulHotspotConfiguration.html",
                    controller: "deviceHypersproutConfigurationManagementCtrl", 
                    resolve: {
                        deviceType: function () {
                            return 'HyperHub';
                        }
                    }
                })
                .state('system.hyperhubconfig.frontHaulDhcp', {
                    url: "/frontHaulDhcp",
                    templateUrl: "pages/device_config/hypersprout/frontHaulDhcpConfiguration.html",
                    controller: "deviceHypersproutConfigurationManagementCtrl", 
                    resolve: {
                        deviceType: function () {
                            return 'HyperHub';
                        }
                    }
                })
                .state('system.hyperhubconfig.backHaul', {
                    url: "/backHaul",
                    templateUrl: "pages/device_config/hypersprout/backHaulConfiguration.html",
                    controller: "deviceHypersproutConfigurationManagementCtrl", 
                    resolve: {
                        deviceType: function () {
                            return 'HyperHub';
                        }
                    }
                })
                .state('system.hyperhubconfig.cloudConnectivity', {
                    url: "/cloudConnectivity",
                    templateUrl: "pages/device_config/hypersprout/cloudConnctivityConfiguration.html",
                    controller: "deviceHypersproutConfigurationManagementCtrl", 
                    resolve: {
                        deviceType: function () {
                            return 'HyperHub';
                        }
                    }
                })
                .state('system.hyperhubconfig.alarms', {
                    url: "/alarms",
                    templateUrl: "pages/device_config/hypersprout/alarmsConfiguration.html",
                    controller: "deviceHypersproutConfigurationManagementCtrl", 
                    resolve: {
                        deviceType: function () {
                            return 'HyperHub';
                        }
                    }
                })
                .state('system.hyperhubconfig.systemSettings', {
                    url: "/systemSettings",
                    templateUrl: "pages/device_config/hypersprout/systemSettingsConfiguration.html",
                    controller: "deviceHypersproutConfigurationManagementCtrl", 
                    resolve: {
                        deviceType: function () {
                            return 'HyperHub';
                        }
                    }
                })
                .state('system.hyperhubconfig.bandwidthLimitations', {
                    url: "/bandwidthLimitations",
                    templateUrl: "pages/device_config/hypersprout/bandwidthLimitations.html",
                    controller: "deviceHypersproutConfigurationManagementCtrl", 
                    resolve: {
                        deviceType: function () {
                            return 'HyperHub';
                        }
                    }
                })
                .state('system.meterconfig', {
                    url: "/meterconfig",
                    templateUrl: "pages/device_config/meter/deviceConfigurationManagement.html",
                    controller: "meterDeviceConfigCtrl"
                })
                .state('system.meterconfig.systeminformation', {
                    url: "/systeminformation",
                    templateUrl: "pages/device_config/meter/sytemInformation_config.html",
                    controller: "deviceMeterConfigurationManagementCtrl"
                })
                .state('system.meterconfig.frontHaulRadio', {
                    url: "/frontHaulRadio",
                    templateUrl: "pages/device_config/meter/frontHaulRadioConfiguration.html",
                    controller: "deviceMeterConfigurationManagementCtrl"
                })
                .state('system.meterconfig.frontHaulMesh', {
                    url: "/frontHaulMesh",
                    templateUrl: "pages/device_config/meter/frontHaulMeshConfiguration.html",
                    controller: "deviceMeterConfigurationManagementCtrl"
                })
                .state('system.meterconfig.frontHaulHotspot', {
                    url: "/frontHaulHotspot",
                    templateUrl: "pages/device_config/meter/frontHaulHotspotConfiguration.html",
                    controller: "deviceMeterConfigurationManagementCtrl"
                })
                .state('system.meterconfig.frontHaulDhcp', {
                    url: "/frontHaulDhcp",
                    templateUrl: "pages/device_config/meter/frontHaulDhcpConfiguration.html",
                    controller: "deviceMeterConfigurationManagementCtrl"
                })
                .state('system.meterconfig.configurations', {
                    url: "/configurations",
                    templateUrl: "pages/device_config/meter/meterConfigurations.html",
                    controller: "deviceMeterConfigurationManagementCtrl"
                })
                .state('system.meterconfig.alarms', {
                    url: "/alarms",
                    templateUrl: "pages/device_config/meter/alarmsConfiguration.html",
                    controller: "deviceMeterConfigurationManagementCtrl"
                })
                .state('system.meterconfig.systemSettings', {
                    url: "/systemSettings",
                    templateUrl: "pages/device_config/meter/systemSettingsConfiguration.html",
                    controller: "deviceMeterConfigurationManagementCtrl"
                })
                .state('system.meterconfig.bandwidthLimitations', {
                    url: "/bandwidthLimitations",
                    templateUrl: "pages/device_config/meter/bandwidthLimitations.html",
                    controller: "deviceMeterConfigurationManagementCtrl"
                })
        }])

        .controller('dataVINECtrl', ['$sessionStorage', '$rootScope', '$scope', '$http', '$state', 'InitService',
            'refreshservice', 'logoutservice',
            function ($sessionStorage, $rootScope, $scope, $http, $state, initService, refreshservice, logoutservice) {
                $scope.currentURL = $state;
                init();                
                $rootScope.callMqtt = function (){
                    var url = objCacheDetails.mqttHost;
                    var options = {                   
                        // clientId: userDetails.mqtt_client_id,
                        clientId: `datavine_${Math.random().toString(16).substr(2, 8)}`,
                        username: objCacheDetails.mqttUsername,
                        password: objCacheDetails.mqttPassword
                    };
                    $rootScope.mqttClient = mqtt.connect(url, options);
                }

                $rootScope.commonMsg = 'Loading...';

                $scope.logout = function () {
                    logoutservice.logout().then(function () {
                        $state.go('login');
                    })
                };
                $rootScope.dynamicPopover = {
                    templateUrl: '/templates/profilePopUp.html',

                    content: '',
                    open: function () {
                        $scope.dynamicPopover.isOpen = true;
                    },
                    close: function () {
                        $scope.dynamicPopover.isOpen = false;
                    }
                };
                $rootScope.dynamicPopover.isOpen = false;
                objCacheDetails.grid.paginationPageSize = $sessionStorage.get('displayItemPerpage');
                /**
              * Function to initialize application
              */
                function init() {
                    initService.initializeApp().then(function () {
                        if ($state.current.name !== 'login') {
                            refreshservice.refresh().then(function () {
                                $rootScope.userName = !angular.isUndefinedOrNull(objCacheDetails.userDetails) ? objCacheDetails.userDetails.username : '';
                            });
                        }
                    });
                };
                /**
                 *  @description
                 * Function to redirect to settings
                 *
                 * @param nil
                 * @return Nil
    
              */
                $scope.redirectToSettings = function () {
                    $state.go('tools.userSettings');
                }

                /**
                 *  @description
                 * Function to navigate to help screen
                 *
                 * @param nil
                 * @return Nil
                 
                 */
                $scope.open = function () {
                    var url = $state.href('help', { absolute: true });
                    window.open(url);
                }
            }])

        /**
                * Controller for Hypersprout Management
                */
        .controller('hyperSproutManagement_mainviewCtrl', ['$scope', function ($scope) {

            $scope.selectConfigurationTab = function () {
                $('#configurationManagement').click();
            };
        }])

        /**
         * Function for Meter Management
         */
        .controller('meterManagement_mainviewCtrl', ['$scope', function ($scope) {

            $scope.selectConfigurationTab = function () {
                $('#configurationManagement').click();
            };
        }])
        .service('fileUpload', ['$http', function ($http) {
            this.uploadFileToUrl = function (file, uploadUrl) {
                var fd = new FormData();
                fd.append('file', file);
                $http.post(uploadUrl, fd, {
                    transformRequest: angular.identity,
                    headers: { 'Content-Type': undefined }
                })
                    .success(function () {
                    })
                    .error(function () {
                    });
            }
        }])
        .controller('systemManagement_mainviewCtrl', ['$scope', '$state', '$rootScope', '$timeout', function ($scope, $state, $rootScope, $timeout) {
            $rootScope.$on('$stateChangeStart', function (e, toState, toParams, fromState, fromParams) {
                if ((fromState.name === 'system.networkStatistics.servers_networkStatistics' ||
                    fromState.name === 'system.networkStatistics.cellRelays_networkStatistics'
                ) && toState.name === 'system.networkStatistics') {
                    e.preventDefault();
                    $state.go('^.servers_networkStatistics');
                }
                if ((fromState.name === 'system.grouping.circuitGrouping' ||
                    fromState.name === 'system.grouping.transformerGrouping' ||
                    fromState.name === 'system.grouping.transformerMeterGrouping' ||
                    fromState.name === 'system.grouping.hyperHubGrouping' ||
                    fromState.name === 'system.grouping.unassignedTransformers' ||
                    fromState.name === 'system.grouping.unassignedMeterList'
                ) && toState.name === 'system.grouping') {
                    e.preventDefault();
                    $state.go('^.circuitGrouping');
                }
            });
            /**
           * Function to select device tab
           */
            $scope.selectDeviceTab = function () {
                $('#deviceManagement').click();
            };
            /**
               * Function to select registration
               */
              $scope.selectRegistration = function () {
                $timeout(function(){
                     $('#registration').click();
                 },100)
            };
            /**
               * Function to select registration
               */
              $scope.selectConfiguration = function (configDevice) {
                $timeout(function(){
                    if (configDevice === 'hs') {
                        $state.go('system.registration.transformerEntry');
                    } else if(configDevice === 'hh') {
                        $state.go('system.registration.hyperHubEntry');
                    } else {
                        $state.go('system.registration.meterEntry');
                    }
                },50)
            };
        }])
        /**
        * Function to monitor the whole application
        * used for session
        */
        .run(['$state', '$rootScope', 'permissionService', '$uibModalStack', 'Idle','logoutservice', function ($state, $rootScope, permissionService, $uibModalStack, Idle, logoutservice) {
            $rootScope.$on('IdleStart', function () {
                $uibModalStack.dismissAll();
            });
            $rootScope.$on('IdleTimeout', function() {
                $uibModalStack.dismissAll();
                swal('Session Expired!! Please Login to continue...');
                Idle.unwatch();
                logoutservice
                    .logout()
                    .then(function () {
                        $state.go('login');
                    });
            });
            $rootScope.$on('$stateChangeStart', function (e, toState, toParams, fromState, fromParams) {
                $rootScope.dynamicPopover.isOpen = false;
                var top = $uibModalStack.getTop();
                if (top) {
                    $uibModalStack.dismiss(top.key);
                }
                if (fromState.name !== '') {
                    permissionService.checkPermission(toState, function (check) {
                        if (!check) {
                            if (fromState.name === 'login' || fromState.name === '') {

                                e.preventDefault();
                                $state.go('master');

                            } else {

                                e.preventDefault();
                                $state.go(fromState.name);
                                swal("You don't have access here");

                            }

                        }
                    });
                }
            });
        }])
    angular.isUndefinedOrNull = function (val) {
        return angular.isUndefined(val) || val === null;
    };
})(window.angular);

