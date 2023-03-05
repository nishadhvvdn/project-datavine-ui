/**
 * @description
 * Controller for UI grid table of unassigned meters
 */
(function (angular) {
    "use strict";
    angular.module('dataVINEApp').controller('deviceHypersproutConfigurationManagementCtrl',
        ['$scope', '$uibModal', '$state', '$rootScope',
            '$filter', '$timeout', 'DeviceService', 'ParseService',
            'DeviceMappingService', '$sessionStorage','deviceType', 'Upload','firmwareManagementService',
            function ($scope, $uibModal, $state, $rootScope,
                $filter, $timeout, deviceService, parseService,
                deviceMappingService, $sessionStorage, deviceType, Upload, firmwareManagementService) {
                var vm = this;
                $scope.type = (deviceType === 'HyperSprout') ? 'hs' :'hh' ;
                $scope.deviceID = '';
                $scope.configurationDetails = [];
                $scope.setPreviousConfigurationDetails = [];
                $scope.Alarms = [];
                $scope.path = "2.4";
                $scope.subnetCIDR= '';
                $scope.subnetFirst= '';
                $scope.subnetLast= '';
                $scope.ipAddressCheck= '^192.168.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$';
                var ipV4RegStartIP = new RegExp($scope.ipAddressCheck);
                $scope.selectedDHCPType = '192.168.x.x!';
                $scope.passwordIconOne = "password";
                $scope.passwordIconTwo = "password";
                $scope.passwordIconThree = "password";
                $scope.passwordIconFour = "password";
                $scope.frontHaulConfigdetails = {};
                $scope.backHaulConfigdetails = {};
                $scope.hideWirelessSetting = false;
                $scope.hideWirelessSetting51h = false;
                $scope.hideWirelessSetting52h = false;
                $scope.hideWirelessSettingDirty = false;
                $scope.hideWirelessSetting5hDirty = false;
                $scope.alarmsavebutton = true;
                  /**
                 *  @description
                 * change tab content onclick
                 *
                 * @param link
                 * @return Nil
                 
                 */
                $scope.changeTab = function (link, tabName) {
                    $scope.path = link;
                    if (tabName === 'cellular') {
                        $scope.backhaulCellularForm.$setPristine();
                    } else if (tabName === 'ethernet') {
                        $scope.backhaulEthernetForm.$setPristine();
                    } else if (tabName === 'advanced') {
                        $scope.backhaulAdvancedForm.$setPristine();
                    } else if (tabName === 'twofour') {
                        $scope.fronthaulRadio2_4Form.$setPristine();
                    } else if (tabName === 'fivelow') {
                        $scope.fronthaulRadio5lForm.$setPristine();
                    } else if (tabName === 'fivehigh') {
                        $scope.fronthaulRadio5hForm.$setPristine();
                    } else if (tabName === 'meshtwofour') {
                        $scope.fronthaulMesh2_4Form.$setPristine();
                    } else if (tabName === 'meshfive') {
                        $scope.fronthaulMesh5Form.$setPristine();
                    } else if (tabName === 'hotspottwofour') {
                        $scope.fronthaulHotspot2_4Form.$setPristine();
                    } else if (tabName === 'hotspotfive') {
                        $scope.fronthaulHotspot5_hForm.$setPristine();
                    }
                    init();
                };
                init();

                /**
                 * Initialize the controller data
                 */
                function init() {
                        if (!$sessionStorage.get('selectedDeviceIdConfig')) {
                            if (deviceType === 'hs') {
                                $state.go('system.registration.transformerEntry');
                            } else {
                                $state.go('system.registration.hyperHubEntry');
                            }
                        } else {
                            let currentPageName = ($scope.currentURL.current.name).split(".")[2];
                            if(currentPageName === 'frontHaulRadio') {
                                if($sessionStorage.get('selectedCountry')) {
                                    $scope.selectedCounrty = $sessionStorage.get('selectedCountry');
                                } else {
                                    $scope.selectedCounrty = $scope.configurationDetails.SettingsCountry;
                                }
                            }
                            $scope.configurationDetails = [];
                            $scope.setPreviousConfigurationDetails = [];
                            $scope.carrierNameList = [];
                            $scope.ipAddressCheck= '';
                            ipV4RegStartIP = '';
                            $scope.selectedDHCPType = '';
                            $scope.hideWirelessSettingDirty = false;
                            $scope.hideWirelessSetting5hDirty = false;
                            var today = new Date();
                            $scope.time = today.getHours() + ":" + today.getMinutes();
                            $scope.radioModes2 = ["11b", "11ng", "11g", "11axg"];
                            $scope.radioModes5 = ["11a", "11na", "11ac", "11axa"];
                            $scope.countries = ["INDIA", "USA", "CANADA", "SINGAPORE", "MEXICO", "RUSSIA", "UZBEKISTAN", "SOUTH AFRICA", "PHILIPPINES"];
                            $scope.configurationDetails.FronthaulRadio2_4RadioMode = $scope.radioModes2[1];
                            $scope.configurationDetails.FronthaulRadio5lRadioMode = $scope.radioModes5[1];
                            $scope.configurationDetails.FronthaulRadio5hRadioMode = $scope.radioModes5[1];
                            $scope.deviceID = $sessionStorage.get('selectedDeviceIdConfig');
                            $scope.deviceStatus = $sessionStorage.get('selectedDeviceStatusConfig');
                            deviceService.getSysteminformationDetails($scope.deviceID, $scope.type)
                            .then(function (objData) {
                                $scope.configurationDetails = parseService.getParsedHSConfigData(objData);
                                $scope.setPreviousConfigurationDetails = parseService.getParsedHSConfigData(objData);
                                $sessionStorage.put('selectedCountry', $scope.configurationDetails.SettingsCountry);
                                $scope.ipAddressCheck = $scope.configurationDetails.FronthaulDHCPType === '1' ? '^172.16.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$' : '^192.168.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$';
                                ipV4RegStartIP = new RegExp($scope.ipAddressCheck);
                                $scope.selectedDHCPType = $scope.configurationDetails.FronthaulDHCPType === '1' ? '172.16.x.x!' : '192.168.x.x!';
                                fetchDefaultCountryDetails();
                                $scope.Alarms = [
                                    { Name: "Over Voltage", Selected: $scope.configurationDetails.OverVoltage },
                                    { Name: "Under Voltage", Selected: $scope.configurationDetails.UnderVoltage },
                                    { Name: "Over Load Line 1(MD Alarm)", Selected: $scope.configurationDetails.OverLoadLine1_MD_Alarm },
                                    { Name: "Over Load Line 2(MD Alarm)", Selected: $scope.configurationDetails.OverLoadLine2_MD_Alarm },
                                    { Name: "Over Load Line 3(MD Alarm)", Selected: $scope.configurationDetails.OverLoadLine3_MD_Alarm },
                                    { Name: "Over Frequency", Selected: $scope.configurationDetails.OverFrequency },
                                    { Name: "Under Frequency", Selected: $scope.configurationDetails.UnderFrequency },
                                    { Name: "Power Failure", Selected: $scope.configurationDetails.PowerFailure },
                                    { Name: "CT Open", Selected: $scope.configurationDetails.CTOpen },
                                    { Name: "PT Open", Selected: $scope.configurationDetails.PTOpen },
                                    { Name: "Oil Level Sensor Failure", Selected: $scope.configurationDetails.OilLevelSensorFailure },
                                    { Name: "Tamper Lid", Selected: $scope.configurationDetails.TamperLid },
                                    { Name: "Tamper Box", Selected: $scope.configurationDetails.TamperBox },
                                    { Name: "Low Oil Level", Selected: $scope.configurationDetails.LowOilLevel },
                                    { Name: "High Oil Temperature", Selected: $scope.configurationDetails.HighOilTemperature },
                                    { Name: "Low Battery Voltage", Selected: $scope.configurationDetails.LowBatteryVoltage },
                                    { Name: "Battery Failure", Selected: $scope.configurationDetails.BatteryFailure },
                                    { Name: "Battery Removed", Selected: $scope.configurationDetails.BatteryRemoved },
                                    { Name: "Primary Power Up", Selected: $scope.configurationDetails.PrimaryPowerUp },
                                    { Name: "Primary Power Down", Selected: $scope.configurationDetails.PrimaryPowerDown },
                                    { Name: "Non Technical Loss", Selected: $scope.configurationDetails.NonTechnicalLoss },
                                    { Name: "Meter Connected", Selected: $scope.configurationDetails.MeterConnected },
                                    { Name: "Meter Disconnected", Selected: $scope.configurationDetails.MeterDisconnected },
                                    { Name: "Wi-Fi Communication Loss", Selected: $scope.configurationDetails.WiFiCommunicationLoss },
                                    { Name: "3G/4G/LTE Communication Loss", Selected: $scope.configurationDetails.LTECommunicationLoss_3G_4G },
                                    { Name: "Communication attempts exceeded", Selected: $scope.configurationDetails.Communicationattemptsexceeded },
                                    { Name: "UnAuthenticated Connection Request", Selected: $scope.configurationDetails.UnAuthenticatedConnectionRequest } 
                                    ];
                                if (objData !== null) {
                                    radioModeChange('2_4');
                                    radioModeChange('5_l');
                                    radioModeChange('5_h');
                                $scope.configurationDetails.FronthaulMesh2SecurityType = ($scope.configurationDetails.FronthaulMesh2SecurityType.toLowerCase() === 'open' || $scope.configurationDetails.FronthaulMesh2SecurityType.toLowerCase() === 'none') ? 'Open' : $scope.configurationDetails.FronthaulMesh2SecurityType.toUpperCase();
                                $scope.configurationDetails.FronthaulMesh5hSecurityType = ($scope.configurationDetails.FronthaulMesh5hSecurityType.toLowerCase() === 'open' || $scope.configurationDetails.FronthaulMesh5hSecurityType.toLowerCase() === 'none') ? 'Open' : $scope.configurationDetails.FronthaulMesh5hSecurityType.toUpperCase();
                                $scope.configurationDetails.FronthaulHotspot2WirelessSecurity = ($scope.configurationDetails.FronthaulHotspot2WirelessSecurity.toLowerCase() === 'open' || $scope.configurationDetails.FronthaulHotspot2WirelessSecurity.toLowerCase() === 'none') ? 'Open' : $scope.configurationDetails.FronthaulHotspot2WirelessSecurity.toUpperCase();
                                $scope.configurationDetails.FronthaulHotspot21WirelessSecurity = ($scope.configurationDetails.FronthaulHotspot21WirelessSecurity.toLowerCase() === 'open' || $scope.configurationDetails.FronthaulHotspot21WirelessSecurity.toLowerCase() === 'none') ? 'Open' : $scope.configurationDetails.FronthaulHotspot21WirelessSecurity.toUpperCase();
                                $scope.configurationDetails.FronthaulHotspot51WirelessSecurity = ($scope.configurationDetails.FronthaulHotspot51WirelessSecurity.toLowerCase() === 'open' || $scope.configurationDetails.FronthaulHotspot51WirelessSecurity.toLowerCase() === 'none') ? 'Open' : $scope.configurationDetails.FronthaulHotspot51WirelessSecurity.toUpperCase();
                                $scope.configurationDetails.FronthaulHotspot52WirelessSecurity = ($scope.configurationDetails.FronthaulHotspot52WirelessSecurity.toLowerCase() === 'open' || $scope.configurationDetails.FronthaulHotspot52WirelessSecurity.toLowerCase() === 'none') ? 'Open' : $scope.configurationDetails.FronthaulHotspot52WirelessSecurity.toUpperCase();
                                $scope.carrierNameList = $scope.configurationDetails.BackhaulCellularCarrierList;
                                $scope.hideWirelessSetting = !!$scope.setPreviousConfigurationDetails.FronthaulHotspot21SSID ?  true : false;
                                $scope.hideWirelessSetting51h = !!$scope.setPreviousConfigurationDetails.FronthaulHotspot51SSID  ?  true : false;
                                $scope.hideWirelessSetting52h = !!$scope.setPreviousConfigurationDetails.FronthaulHotspot52SSID  ?  true : false;
                                    $scope.CheckUncheckHeader();
                            }
                            });

                        }
               }
                function fetchDefaultCountryDetails() {
                     deviceService.fetchcountryDefaultValues($scope.configurationDetails.SettingsCountry)
                    .then(function (objData) { 
                            if (objData !== null) {
                                $scope.defaultValues = angular.isUndefinedOrNull(objData.details[0].Config) ? "" : objData.details[0].Config; 
                                $scope.channels2_4 = ($scope.defaultValues.two_four.Channels).map(String);
                                $scope.channels5_l = ($scope.defaultValues.five_low.Channels).map(String);
                                $scope.channels5_h = angular.isUndefinedOrNull($scope.defaultValues.five_high) ? [] : ($scope.defaultValues.five_high.Channels).map(String);;
                                $scope.setChannels5_h = angular.isUndefinedOrNull($scope.defaultValues.five_high) ? [] : ($scope.defaultValues.five_high.Channels).map(String);;
                                $scope.timezoneList = $scope.defaultValues.Timezone;
                                $scope.updateChannelWidth();
                                if ($scope.configurationDetails.SettingsCountry !== $scope.setPreviousConfigurationDetails.SettingsCountry) {
                                    $scope.configurationDetails.SettingsTimezone = $scope.timezoneList[0];
                                } else {
                                    $scope.configurationDetails.SettingsTimezone = $scope.setPreviousConfigurationDetails.SettingsTimezone;
                                }
                                $scope.validateHypersproutDetails();
                            }
                    });
                }

                $scope.saveFronthaulRadioConfig = function (selectedtab) {
                    var saveConfig = {};
                        if(selectedtab === '2_4') {
                            saveConfig = {   RadioMode: $scope.configurationDetails.FronthaulRadio2_4RadioMode,
                                ChannelWidth: $scope.configurationDetails.FronthaulRadio2_4ChannelWidth,
                                Channel: parseInt($scope.configurationDetails.FronthaulRadio2_4Channel),
                                TransmitPower: parseInt($scope.configurationDetails.FronthaulRadio2_4TransmitPower),
                                GuardInterval: $scope.configurationDetails.FronthaulRadio2_4GuardInterval,
                                StreamSelection: $scope.configurationDetails.FronthaulRadio2_4StreamSelection
                            }
                            $scope.fronthaulRadio2_4Form.$setPristine();
                        } else if (selectedtab === '5_L') {
                            saveConfig = {   RadioMode: $scope.configurationDetails.FronthaulRadio5lRadioMode,
                                ChannelWidth: $scope.configurationDetails.FronthaulRadio5lChannelWidth,
                                Channel: parseInt($scope.configurationDetails.FronthaulRadio5lChannel),
                                TransmitPower: parseInt($scope.configurationDetails.FronthaulRadio5lTransmitPower),
                                GuardInterval: $scope.configurationDetails.FronthaulRadio5lGuardInterval,
                                StreamSelection: $scope.configurationDetails.FronthaulRadio5lStreamSelection
                            }
                            $scope.fronthaulRadio5lForm.$setPristine();
                        } else if (selectedtab === '5_H') {
                            saveConfig = {   RadioMode: $scope.configurationDetails.FronthaulRadio5hRadioMode,
                                ChannelWidth: $scope.configurationDetails.FronthaulRadio5hChannelWidth,
                                Channel: parseInt($scope.configurationDetails.FronthaulRadio5hChannel),
                                TransmitPower: parseInt($scope.configurationDetails.FronthaulRadio5hTransmitPower),
                                GuardInterval: $scope.configurationDetails.FronthaulRadio5hGuardInterval,
                                StreamSelection: $scope.configurationDetails.FronthaulRadio5hStreamSelection
                            }
                            $scope.fronthaulRadio5hForm.$setPristine();
                        }
                            deviceService.setConfigDetails("FrontHaulConfigurations", $scope.deviceID, $scope.configurationDetails.DeviceSerialNumber, 'Radio', selectedtab, $scope.type, saveConfig)
                                .then(function (objData) {
                                    swal(objData);
                                    init();
                            });
                };

                $scope.saveFronthaulMeshConfig = function (selectedtab) {
                    var saveConfig = {};
                        if(selectedtab === '2_4') {
                            if ($scope.setPreviousConfigurationDetails.FronthaulMesh2MeshID) {
                                $scope.meshprimaction = 2;
                            } else {
                                $scope.meshprimaction = 1;
                            }
                            saveConfig = {   
                                mesh_vap_action: $scope.meshprimaction,
                                MeshID: $scope.configurationDetails.FronthaulMesh2MeshID,
                                SecurityType: $scope.configurationDetails.FronthaulMesh2SecurityType,
                                PSK: $scope.configurationDetails.FronthaulMesh2PresharedKey
                            }
                            $scope.fronthaulMesh2_4Form.$setPristine();
                        } else if (selectedtab === '5_H') {
                            if ($scope.setPreviousConfigurationDetails.FronthaulMesh5hMeshID) {
                                $scope.meshsecaction = 2;
                            } else {
                                $scope.meshsecaction = 1;
                            }
                            saveConfig = {   
                                mesh_vap_action: $scope.meshsecaction,
                                MeshID: $scope.configurationDetails.FronthaulMesh5hMeshID,
                                SecurityType: $scope.configurationDetails.FronthaulMesh5hSecurityType,
                                PSK: $scope.configurationDetails.FronthaulMesh5hPresharedKey
                            }
                            $scope.fronthaulMesh5Form.$setPristine();
                        }
                        deviceService.setConfigDetails("FrontHaulConfigurations" ,$scope.deviceID, $scope.configurationDetails.DeviceSerialNumber, 'Mesh', selectedtab, $scope.type, saveConfig)
                            .then(function (objData) {
                                swal(objData);
                                init();
                        });
                };

                $scope.saveFronthaulHotspotConfig = function (selectedtab) {
                    var saveConfig = {};
                        if(selectedtab === '2_4') {
                            if ($scope.configurationDetails.FronthaulHotspot2Password !== $scope.setPreviousConfigurationDetails.FronthaulHotspot2Password ||
                                $scope.configurationDetails.FronthaulHotspot2SSID !== $scope.setPreviousConfigurationDetails.FronthaulHotspot2SSID) {
                                $scope.hotspot1action = 3;
                            } else {
                                $scope.hotspot1action = 0;
                            }
                            if (!$scope.setPreviousConfigurationDetails.FronthaulHotspot21SSID && !$scope.hideWirelessSetting) {
                                $scope.hotspot2action = 0;
                                $scope.hotspot2availability = 0;
                            } else if (!$scope.setPreviousConfigurationDetails.FronthaulHotspot21SSID && $scope.hideWirelessSetting) {
                                $scope.hotspot2action = 1;
                                $scope.hotspot2availability = 1;
                            } else if (!!$scope.setPreviousConfigurationDetails.FronthaulHotspot21SSID && !$scope.hideWirelessSetting) {
                                $scope.hotspot2action = 2;
                                $scope.hotspot2availability = 0;
                            } else if ($scope.configurationDetails.FronthaulHotspot21Status !== $scope.setPreviousConfigurationDetails.FronthaulHotspot21Status ||
                                $scope.configurationDetails.FronthaulHotspot21SSID !== $scope.setPreviousConfigurationDetails.FronthaulHotspot21SSID || 
                                $scope.configurationDetails.FronthaulHotspot21Password !== $scope.setPreviousConfigurationDetails.FronthaulHotspot21Password) {
                                $scope.hotspot2action = 3;
                                $scope.hotspot2availability = 1;
                            } else {
                                $scope.hotspot2action = 0;
                                $scope.hotspot2availability = 1;
                            }
                            var save2_4 = [];
                            save2_4 = $scope.hideWirelessSetting ? [{ 
                                vap_availabililty: $scope.hotspot2availability,
                                vap_action: $scope.hotspot2action,
                                Status: $scope.configurationDetails.FronthaulHotspot21Status === true ? 1 : 0,
                                SSID: $scope.configurationDetails.FronthaulHotspot21SSID,
                                WirelessSecurity: $scope.configurationDetails.FronthaulHotspot21WirelessSecurity,
                                Password: $scope.configurationDetails.FronthaulHotspot21Password }] : [{vap_availabililty: $scope.hotspot2availability,
                                    vap_action: $scope.hotspot2action}];
                            saveConfig = {   vap_availabililty: 1,
                                vap_action: $scope.hotspot1action,
                                Status: $scope.configurationDetails.FronthaulHotspot2Status === true ? 1 : 0,
                                SSID: $scope.configurationDetails.FronthaulHotspot2SSID,
                                WirelessSecurity: $scope.configurationDetails.FronthaulHotspot2WirelessSecurity,
                                Password: $scope.configurationDetails.FronthaulHotspot2Password,
                                vap_details: save2_4
                            };
                            $scope.fronthaulHotspot2_4Form.$setPristine();
                            $scope.hideWirelessSettingDirty = false;
                        } else if (selectedtab === '5') {
                            if (!$scope.setPreviousConfigurationDetails.FronthaulHotspot51SSID && !$scope.hideWirelessSetting51h) {
                                $scope.hotspot3action = 0;
                                $scope.hotspot3availability = 0;
                            } else if (!$scope.setPreviousConfigurationDetails.FronthaulHotspot51SSID && $scope.hideWirelessSetting51h) {
                                $scope.hotspot3action = 1;
                                $scope.hotspot3availability = 1;
                            } else if (!!$scope.setPreviousConfigurationDetails.FronthaulHotspot51SSID && !$scope.hideWirelessSetting51h) {
                                $scope.hotspot3action = 2;
                                $scope.hotspot3availability = 0;
                            } else if ($scope.configurationDetails.FronthaulHotspot51Status !== $scope.setPreviousConfigurationDetails.FronthaulHotspot51Status ||
                                $scope.configurationDetails.FronthaulHotspot51SSID !== $scope.setPreviousConfigurationDetails.FronthaulHotspot51SSID || 
                                $scope.configurationDetails.FronthaulHotspot51Password !== $scope.setPreviousConfigurationDetails.FronthaulHotspot51Password) {
                                $scope.hotspot3action = 3;
                                $scope.hotspot3availability = 1;
                            } else {
                                $scope.hotspot3action = 0;
                                $scope.hotspot3availability = 1;
                            }
                            if (!$scope.setPreviousConfigurationDetails.FronthaulHotspot52SSID && !$scope.hideWirelessSetting52h) {
                                $scope.hotspot4action = 0;
                                $scope.hotspot4availability = 0;
                            } else if (!$scope.setPreviousConfigurationDetails.FronthaulHotspot52SSID && $scope.hideWirelessSetting52h) {
                                $scope.hotspot4action = 1;
                                $scope.hotspot4availability = 1;
                            } else if (!!$scope.setPreviousConfigurationDetails.FronthaulHotspot52SSID && !$scope.hideWirelessSetting52h) {
                                $scope.hotspot4action = 2;
                                $scope.hotspot4availability = 0;
                            } else if ($scope.configurationDetails.FronthaulHotspot52Status !== $scope.setPreviousConfigurationDetails.FronthaulHotspot52Status ||
                                $scope.configurationDetails.FronthaulHotspot52SSID !== $scope.setPreviousConfigurationDetails.FronthaulHotspot52SSID || 
                                $scope.configurationDetails.FronthaulHotspot52Password !== $scope.setPreviousConfigurationDetails.FronthaulHotspot52Password) {
                                $scope.hotspot4action = 3;
                                $scope.hotspot4availability = 1;
                            } else {
                                $scope.hotspot4action = 0;
                                $scope.hotspot4availability = 1;
                            }
                            var save5_1h = [];
                            var save5_2h = [];
                            save5_1h = $scope.hideWirelessSetting51h ? [{ 
                                vap_availabililty: $scope.hotspot3availability, vap_action: $scope.hotspot3action,
                                Status: $scope.configurationDetails.FronthaulHotspot51Status === true ? 1 : 0,
                                SSID: $scope.configurationDetails.FronthaulHotspot51SSID,
                                WirelessSecurity: $scope.configurationDetails.FronthaulHotspot51WirelessSecurity,
                                Password: $scope.configurationDetails.FronthaulHotspot51Password }] : [{vap_availabililty: $scope.hotspot3availability, vap_action: $scope.hotspot3action}];
                            save5_2h = $scope.hideWirelessSetting52h ? [{ 
                                vap_availabililty: $scope.hotspot4availability, vap_action: $scope.hotspot4action,
                                Status: $scope.configurationDetails.FronthaulHotspot52Status === true ? 1 : 0,
                                SSID: $scope.configurationDetails.FronthaulHotspot52SSID,
                                WirelessSecurity: $scope.configurationDetails.FronthaulHotspot52WirelessSecurity,
                                Password: $scope.configurationDetails.FronthaulHotspot52Password }] : [{vap_availabililty: $scope.hotspot4availability, vap_action: $scope.hotspot4action}];
                            saveConfig = {  vap_details: save5_1h.concat(save5_2h)};
                            $scope.fronthaulHotspot5_hForm.$setPristine();
                            $scope.hideWirelessSetting5hDirty = false;
                        }
                        deviceService.setConfigDetails("FrontHaulConfigurations" ,$scope.deviceID, $scope.configurationDetails.DeviceSerialNumber, 'Hotspot', selectedtab, $scope.type, saveConfig)
                            .then(function (objData) {
                                swal(objData);
                                init();
                        });
                };
                $scope.saveFronthaulDHCPConfig = function () {
                    var saveConfig = {};
                      saveConfig = {   
                        Type: parseInt($scope.configurationDetails.FronthaulDHCPType),  
                        Status: $scope.configurationDetails.FronthaulDHCPStatus === true ? 1 : 0,
                        StartAddress: $scope.configurationDetails.FronthaulDHCPStartAddress,
                        EndAddress: $scope.configurationDetails.FronthaulDHCPEndAddress,
                        Subnet: $scope.configurationDetails.FronthaulDHCPSubnetMask,
                        Gateway: $scope.configurationDetails.FronthaulDHCPDefaultGateway,
                        Primary_DNS: $scope.configurationDetails.FronthaulDHCPPrimaryDNS,
                        Secondary_DNS: $scope.configurationDetails.FronthaulDHCPSecondaryDNS
                    }
                      deviceService.setConfigDetails("FrontHaulConfigurations" ,$scope.deviceID, $scope.configurationDetails.DeviceSerialNumber, 'DHCP', '', $scope.type, saveConfig)
                          .then(function (objData) {
                                swal(objData);
                                init();
                                $scope.fronthaulDHCPForm.$setPristine();
                      });
                };
                $scope.saveBandwidthLimitationsConfig = function () {
                    var saveConfig = {};
                    let bandwidthModifiedFlag = 'N'
                    if(($scope.configurationDetails.BandwidthStatus != $scope.setPreviousConfigurationDetails.BandwidthStatus || $scope.configurationDetails.DownloadBandwidth != $scope.setPreviousConfigurationDetails.DownloadBandwidth || $scope.configurationDetails.UploadBandwidth != $scope.setPreviousConfigurationDetails.UploadBandwidth) && $scope.deviceStatus === 'Registered') {
                        bandwidthModifiedFlag = 'Y';
                    } else {
                        bandwidthModifiedFlag = 'N';
                    }
                      saveConfig = {   Status: $scope.configurationDetails.BandwidthStatus === true ? "1" : "0",
                        DownloadBandwidth: $scope.configurationDetails.DownloadBandwidth,
                        UploadBandwidth: $scope.configurationDetails.UploadBandwidth,
                        BandwidthFlag: bandwidthModifiedFlag
                    }
                      deviceService.setConfigDetails("BandwidthLimitations" ,$scope.deviceID, $scope.configurationDetails.DeviceSerialNumber, 'BandwidthLimitations', '', deviceType, saveConfig)
                          .then(function (objData) {
                                swal(objData);
                                init();
                                $scope.advancedBandwidthForm.$setPristine();
                      });
                };
                $scope.saveBackhaulConfig = function (selectedtab) {
                    var saveConfig = {};
                        if(selectedtab === 'Cellular') {
                            saveConfig = {   UserName: $scope.configurationDetails.BackhaulCellularUserName,
                                Password: $scope.configurationDetails.BackhaulCellularPassword,
                                SimPin: $scope.configurationDetails.BackhaulCellularSimPin,
                                NetworkSelection: parseInt($scope.configurationDetails.BackhaulCellularNetworkSelection),
                                Carrier: $scope.configurationDetails.BackhaulCellularCarrierName,
                                CarrierList: $scope.configurationDetails.BackhaulCellularNetworkSelection === '1' ? $scope.carrierNameList : []
                            }
                            $scope.backhaulCellularForm.$setPristine();
                        } else if (selectedtab === 'Ethernet') {
                            saveConfig = {   Mode: $scope.configurationDetails.BackhaulEthernetIPType === true ? 1 : 0,
                                IP: $scope.configurationDetails.BackhaulEthernetIPAddress,
                                Primary_DNS: $scope.configurationDetails.BackhaulEthernetPrimaryDNS,
                                Gateway: $scope.configurationDetails.BackhaulEthernetGateWay,
                                Secondary_DNS: $scope.configurationDetails.BackhaulEthernetSecondaryDNS,
                                Subnet: $scope.configurationDetails.BackhaulEthernetSubnetMask
                            }
                            $scope.backhaulEthernetForm.$setPristine();
                        } else if (selectedtab === 'Advanced') {
                            saveConfig = {  
                                Primary_Backhaul: parseInt($scope.configurationDetails.BackhaulAdvancedPrimary),
                                Auto_Switchover: $scope.configurationDetails.BackhaulAdvancedAutoSwitch === true ? 1 : 0
                            }
                            $scope.backhaulAdvancedForm.$setPristine();
                        }
                      deviceService.setConfigDetails("BackHaulConfigurations", $scope.deviceID, $scope.configurationDetails.DeviceSerialNumber, 'BackHaul', selectedtab, $scope.type, saveConfig)
                          .then(function (objData) {
                              swal(objData);
                              init();
                      });
                };

                $scope.saveCloudConnectivityConfig = function() {
                    deviceService.setCloudConnectivityDetails($scope.deviceID, $scope.configurationDetails.DeviceSerialNumber, 'CloudConnect', '', $scope.type , $scope.fileMod, $scope.configurationDetails.CloudHostName, $scope.configurationDetails.CloudSharedAccessKey)
                    .then(function (objData) {
                        swal(objData);
                        document.getElementById("cloudResetForm").reset();
                        $scope.isFileBrowsed = false;
                        init();
                    });
                };
                $scope.saveAlarmsConfig = function() {
                    var saveConfig = {};
                    saveConfig = {
                        OverVoltage: $scope.Alarms[0].Selected, UnderVoltage: $scope.Alarms[1].Selected, OverLoadLine1_MD_Alarm: $scope.Alarms[2].Selected,
                        OverLoadLine2_MD_Alarm: $scope.Alarms[3].Selected, OverLoadLine3_MD_Alarm: $scope.Alarms[4].Selected,
                        OverFrequency: $scope.Alarms[5].Selected, UnderFrequency: $scope.Alarms[6].Selected, PowerFailure: $scope.Alarms[7].Selected,
                        CTOpen: $scope.Alarms[8].Selected, PTOpen: $scope.Alarms[9].Selected, OilLevelSensorFailure: $scope.Alarms[10].Selected,
                        TamperLid: $scope.Alarms[11].Selected, TamperBox: $scope.Alarms[12].Selected, LowOilLevel: $scope.Alarms[13].Selected,
                        HighOilTemperature: $scope.Alarms[14].Selected, LowBatteryVoltage: $scope.Alarms[15].Selected, BatteryFailure: $scope.Alarms[16].Selected,
                        BatteryRemoved: $scope.Alarms[17].Selected, PrimaryPowerUp: $scope.Alarms[18].Selected, PrimaryPowerDown: $scope.Alarms[19].Selected,
                        NonTechnicalLoss: $scope.Alarms[20].Selected, MeterConnected: $scope.Alarms[21].Selected, MeterDisconnected: $scope.Alarms[22].Selected,
                        WiFiCommunicationLoss: $scope.Alarms[23].Selected, LTECommunicationLoss_3G_4G: $scope.Alarms[24].Selected,
                        Communicationattemptsexceeded: $scope.Alarms[25].Selected, UnAuthenticatedConnectionRequest: $scope.Alarms[26].Selected
                    };
                    deviceService.setAlarmConfigDetails($scope.deviceID, $scope.configurationDetails.DeviceSerialNumber, $scope.type, saveConfig)
                        .then(function (objData) {
                            swal(objData);
                            $scope.alarmsavebutton = true;
                            init();
                    });
                };
                $scope.saveSystemSettingsConfig = function () {
                    var saveConfig = {};
                        saveConfig = {   SystemName: $scope.configurationDetails.SettingsSystemName,
                            Country: $scope.configurationDetails.SettingsCountry,
                            Timezone: $scope.configurationDetails.SettingsTimezone
                        }
                        deviceService.setConfigDetails("SystemSettingsConfigurations", $scope.deviceID, $scope.configurationDetails.DeviceSerialNumber, 'SystemSetting', '', $scope.type, saveConfig)
                            .then(function (objData) {
                                swal(objData);
                                $scope.systemSettingsForm.$setPristine();
                                init();
                        });
                };
                var containsSpace = /\s/;
                let pattern = /^[a-zA-Z0-9\s]+$/;
                let numberPattern = /^[0-9]+$/;
                var ipV4Reg = new RegExp('^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$');
                var ipV4RegSubnet = new RegExp('^255.255.255.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$');
                var pskRegex = /^[A-Za-z0-9^~!@#$%\^&*()_+={}|[\]\\:;"<>?,./]+(?:\s?[A-Za-z0-9^~!@#$%\^&*()_+={}|[\]\\:;"<>?,./]+)?$/;
                var meshidRegex = /^[A-Za-z0-9]+[A-Za-z0-9^!@#$%\^&*()_+={}|[\]\\;:?./]*(?:\s?[A-Za-z0-9^!@#$%\^&*()_+={}|[\]\\;:?./]*[A-Za-z0-9]+)?$/;
                var ssidRegex = /^[A-Za-z0-9]+[A-Za-z0-9^!@#$%\^&*()_+={}|[\-\]\\;:?./]*(?:\s?[A-Za-z0-9^!@#$%\^&*()_+={}|[\-\]\\;:?./]*[A-Za-z0-9]+)?$/;
                var ipV4RegSubnetA = new RegExp('^255.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?).0.0$');
                var ipV4RegSubnetB = new RegExp('^255.255.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?).0$');
                var ipV4RegSubnetC = new RegExp('^255.255.255.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$');
                var subnetrange = ["0", "00", "000", "128", "192", "224", "240", "248", "252" , "255"];
                var nameRegex = /^[A-Za-z0-9^`~!@#$%\^&*()_+={}|[\]\\:';"<>?,./]+(?:\s?[A-Za-z0-9^`~!@#$%\^&*()_+={}|[\]\\:';"<>?,./]+)*$/;
                /**
                 *  @description
                 * Function to validate Configuration data
                 *
                 * @param field
                 * @return Nil
                 */
                $scope.focusValidate = function (field) {
                   if (field === 'transmitPower2_4') {
                    if($scope.configurationDetails.FronthaulRadio2_4TransmitPower) {
                        if(!containsSpace.test($scope.configurationDetails.FronthaulRadio2_4TransmitPower)) {
                                if ($scope.configurationDetails.FronthaulRadio2_4TransmitPower === undefined ||
                                    $scope.configurationDetails.FronthaulRadio2_4TransmitPower.trim().length === 0) {
                                    $scope.errorTransmitPower2_4Message = 'Transmit Power is required!';
                                    $scope.errorTransmitPower2_4 = true;
                                    $scope.fronthaulRadio2_4Form.transmitPower.$valid = false;
                                } else if (!numberPattern.test($scope.configurationDetails.FronthaulRadio2_4TransmitPower)) {
                                    $scope.errorTransmitPower2_4Message = 'Invalid Transmit Power!';
                                    $scope.errorTransmitPower2_4 = true;
                                    $scope.fronthaulRadio2_4Form.transmitPower.$valid = false;
                                } else if ($scope.configurationDetails.FronthaulRadio2_4TransmitPower <= 0 || $scope.configurationDetails.FronthaulRadio2_4TransmitPower > $scope.defaultValues.two_four.TransmitPower) {
                                    $scope.errorTransmitPower2_4Message = 'Transmit Power value range should be from 1 to ' +$scope.defaultValues.two_four.TransmitPower+'!';
                                    $scope.errorTransmitPower2_4 = true;
                                    $scope.fronthaulRadio2_4Form.transmitPower.$valid = false;
                                }  else {
                                    $scope.errorTransmitPower2_4 = false;
                                    $scope.fronthaulRadio2_4Form.transmitPower.$valid = true;
                                }
                            } else {
                                $scope.errorTransmitPower2_4Message = 'Invalid Transmit Power!';
                                $scope.errorTransmitPower2_4 = true;
                                $scope.fronthaulRadio2_4Form.transmitPower.$valid = false;
                            }
                    } else {
                        $scope.errorTransmitPower2_4Message = 'Transmit Power is required!';
                        $scope.errorTransmitPower2_4 = true;
                        $scope.fronthaulRadio2_4Form.transmitPower.$valid = false;
                    }
                    } else if (field === 'transmitPower5l') {
                        if($scope.configurationDetails.FronthaulRadio5lTransmitPower) {
                            if(!containsSpace.test($scope.configurationDetails.FronthaulRadio5lTransmitPower)) {
                                    if ($scope.configurationDetails.FronthaulRadio5lTransmitPower === undefined ||
                                        $scope.configurationDetails.FronthaulRadio5lTransmitPower.trim().length === 0) {
                                        $scope.errorTransmitPower5lMessage = 'Transmit Power is required!';
                                        $scope.errorTransmitPower5l = true;
                                        $scope.fronthaulRadio5lForm.transmitPower.$valid = false;
                                    } else if (!numberPattern.test($scope.configurationDetails.FronthaulRadio5lTransmitPower)) {
                                        $scope.errorTransmitPower5lMessage = 'Invalid Transmit Power!';
                                        $scope.errorTransmitPower5l = true;
                                        $scope.fronthaulRadio5lForm.transmitPower.$valid = false;
                                    } else if ($scope.configurationDetails.FronthaulRadio5lTransmitPower <= 0 || $scope.configurationDetails.FronthaulRadio5lTransmitPower > $scope.defaultValues.five_low.TransmitPower) {
                                        $scope.errorTransmitPower5lMessage = 'Transmit Power value range should be from 1 to ' +$scope.defaultValues.five_low.TransmitPower+'!';
                                        $scope.errorTransmitPower5l = true;
                                        $scope.fronthaulRadio5lForm.transmitPower.$valid = false;
                                    }  else {
                                        $scope.errorTransmitPower5l = false;
                                        $scope.fronthaulRadio5lForm.transmitPower.$valid = true;
                                    }
                                } else {
                                    $scope.errorTransmitPower5lMessage = 'Invalid Transmit Power!';
                                    $scope.errorTransmitPower5l = true;
                                    $scope.fronthaulRadio5lForm.transmitPower.$valid = false;
                                }
                        } else {
                            $scope.errorTransmitPower5lMessage = 'Transmit Power is required!';
                            $scope.errorTransmitPower5l = true;
                            $scope.fronthaulRadio5lForm.transmitPower.$valid = false;
                        }
                    } else if (field === 'transmitPower5h') {
                        if($scope.configurationDetails.FronthaulRadio5hTransmitPower) {
                            if(!containsSpace.test($scope.configurationDetails.FronthaulRadio5hTransmitPower)) {
                                    if ($scope.configurationDetails.FronthaulRadio5hTransmitPower === undefined ||
                                        $scope.configurationDetails.FronthaulRadio5hTransmitPower.trim().length === 0) {
                                        $scope.errorTransmitPower5hMessage = 'Transmit Power is required!';
                                        $scope.errorTransmitPower5h = true;
                                        $scope.fronthaulRadio5hForm.transmitPower.$valid = false;
                                    } else if (!numberPattern.test($scope.configurationDetails.FronthaulRadio5hTransmitPower)) {
                                        $scope.errorTransmitPower5hMessage = 'Invalid Transmit Power!';
                                        $scope.errorTransmitPower5h = true;
                                        $scope.fronthaulRadio5hForm.transmitPower.$valid = false;
                                    } else if ($scope.configurationDetails.FronthaulRadio5hTransmitPower <= 0 || $scope.configurationDetails.FronthaulRadio5hTransmitPower > $scope.defaultValues.five_high.TransmitPower) {
                                        $scope.errorTransmitPower5hMessage = 'Transmit Power value range should be from 1 to ' +$scope.defaultValues.five_high.TransmitPower+'!';
                                        $scope.errorTransmitPower5h = true;
                                        $scope.fronthaulRadio5hForm.transmitPower.$valid = false;
                                    }  else {
                                        $scope.errorTransmitPower5h = false;
                                        $scope.fronthaulRadio5hForm.transmitPower.$valid = true;
                                    }
                                } else {
                                    $scope.errorTransmitPower5hMessage = 'Invalid Transmit Power!';
                                    $scope.errorTransmitPower5h = true;
                                    $scope.fronthaulRadio5hForm.transmitPower.$valid = false;
                                }
                        } else {
                            $scope.errorTransmitPower5hMessage = 'Transmit Power is required!';
                            $scope.errorTransmitPower5h = true;
                            $scope.fronthaulRadio5hForm.transmitPower.$valid = false;
                        }
                    } else if (field === 'meshID2_4') {
                        if($scope.configurationDetails.FronthaulMesh2MeshID) {
                            if(!containsSpace.test($scope.configurationDetails.FronthaulMesh2MeshID)) {
                                    if ($scope.configurationDetails.FronthaulMesh2MeshID === undefined || $scope.configurationDetails.FronthaulMesh2MeshID.trim().length === 0) {
                                        $scope.errorMeshID2_4Message = 'Mesh ID is required!';
                                        $scope.errorMeshID2_4 = true;
                                        $scope.fronthaulMesh2_4Form.meshID.$valid = false;
                                    } else if (!meshidRegex.test($scope.configurationDetails.FronthaulMesh2MeshID)) {
                                        $scope.errorMeshID2_4Message = 'Invalid Mesh ID!';
                                        $scope.errorMeshID2_4 = true;
                                        $scope.fronthaulMesh2_4Form.meshID.$valid = false;
                                    } else if ($scope.configurationDetails.FronthaulMesh2MeshID.length < 8 || $scope.configurationDetails.FronthaulMesh2MeshID.length > 32) {
                                        $scope.errorMeshID2_4Message = 'Length of Mesh ID range should be from 8 to 32!';
                                        $scope.errorMeshID2_4 = true;
                                        $scope.fronthaulMesh2_4Form.meshID.$valid = false;
                                    } else if ($scope.configurationDetails.FronthaulMesh5hMeshID) {
                                        if ($scope.configurationDetails.FronthaulMesh2MeshID.toLowerCase() === $scope.configurationDetails.FronthaulMesh5hMeshID.toLowerCase()) {
                                            $scope.errorMeshID2_4Message = 'Mesh ID name cannot be same!';
                                            $scope.errorMeshID2_4 = true;
                                            $scope.fronthaulMesh2_4Form.meshID.$valid = false;
                                        } else {
                                            $scope.errorMeshID2_4 = false;
                                            $scope.fronthaulMesh2_4Form.meshID.$valid = true;
                                        }
                                    } else {
                                        $scope.errorMeshID2_4 = false;
                                        $scope.fronthaulMesh2_4Form.meshID.$valid = true;
                                    }
                                } else {
                                    $scope.errorMeshID2_4Message = 'Invalid Mesh ID!';
                                    $scope.errorMeshID2_4 = true;
                                    $scope.fronthaulMesh2_4Form.meshID.$valid = false;
                                }
                        } else {
                            $scope.errorMeshID2_4Message = 'Mesh ID is required!';
                            $scope.errorMeshID2_4 = true;
                            $scope.fronthaulMesh2_4Form.meshID.$valid = false;
                        }
                    } else if (field === 'meshID5h') {
                        if ($scope.configurationDetails.FronthaulMesh5hMeshID) {
                            if (!containsSpace.test($scope.configurationDetails.FronthaulMesh5hMeshID)) {
                                    if ($scope.configurationDetails.FronthaulMesh5hMeshID === undefined || $scope.configurationDetails.FronthaulMesh5hMeshID.trim().length === 0) {
                                        $scope.errorMeshID5hMessage = 'Mesh ID is required!';
                                        $scope.errorMeshID5h = true;
                                        $scope.fronthaulMesh5Form.meshID.$valid = false;
                                    } else if (!meshidRegex.test($scope.configurationDetails.FronthaulMesh5hMeshID)) {
                                        $scope.errorMeshID5hMessage = 'Invalid Mesh ID!';
                                        $scope.errorMeshID5h = true;
                                        $scope.fronthaulMesh5Form.meshID.$valid = false;
                                    } else if ($scope.configurationDetails.FronthaulMesh5hMeshID.length < 8 || $scope.configurationDetails.FronthaulMesh5hMeshID.length > 32) {
                                        $scope.errorMeshID5hMessage = 'Length of Mesh ID range should be from 8 to 32!';
                                        $scope.errorMeshID5h = true;
                                        $scope.fronthaulMesh5Form.meshID.$valid = false;
                                    } else if ($scope.configurationDetails.FronthaulMesh2MeshID) {
                                        if ($scope.configurationDetails.FronthaulMesh2MeshID.toLowerCase() === $scope.configurationDetails.FronthaulMesh5hMeshID.toLowerCase()) {
                                            $scope.errorMeshID5hMessage = 'Mesh ID name cannot be same!';
                                            $scope.errorMeshID5h = true;
                                            $scope.fronthaulMesh5Form.meshID.$valid = false;
                                        } else {
                                            $scope.errorMeshID5h = false;
                                            $scope.fronthaulMesh5Form.meshID.$valid = true;
                                        }
                                    } else {
                                        $scope.errorMeshID5h = false;
                                        $scope.fronthaulMesh5Form.meshID.$valid = true;
                                    }
                                } else {
                                    $scope.errorMeshID5hMessage = 'Invalid Mesh ID!';
                                    $scope.errorMeshID5h = true;
                                    $scope.fronthaulMesh5Form.meshID.$valid = false;
                                }
                        } else {
                            $scope.errorMeshID5hMessage = 'Mesh ID is required!';
                            $scope.errorMeshID5h = true;
                            $scope.fronthaulMesh5Form.meshID.$valid = false;
                        }
                    } else if (field === 'psk2_4') {
                        if ($scope.configurationDetails.FronthaulMesh2PresharedKey) {
                            if (!containsSpace.test($scope.configurationDetails.FronthaulMesh2PresharedKey)) {
                                if ($scope.configurationDetails.FronthaulMesh2PresharedKey === undefined || $scope.configurationDetails.FronthaulMesh2PresharedKey.trim().length === 0) {
                                    $scope.errorPreSharedKey2_4Message = 'Pre shared key is required!';
                                    $scope.errorPreSharedKey2_4 = true;
                                    $scope.fronthaulMesh2_4Form.preSharedKey.$valid = false;
                                } else if (!pskRegex.test($scope.configurationDetails.FronthaulMesh2PresharedKey)) {
                                    $scope.errorPreSharedKey2_4Message = 'Invalid Pre shared key!';
                                    $scope.errorPreSharedKey2_4 = true;
                                    $scope.fronthaulMesh2_4Form.preSharedKey.$valid = false;
                                } else if ($scope.configurationDetails.FronthaulMesh2PresharedKey.length < 8 || $scope.configurationDetails.FronthaulMesh2PresharedKey.length > 63) {
                                    $scope.errorPreSharedKey2_4Message = 'Length of Pre shared key range should be from 8 to 63!';
                                    $scope.errorPreSharedKey2_4 = true;
                                    $scope.fronthaulMesh2_4Form.preSharedKey.$valid = false;
                                } else {
                                    $scope.errorPreSharedKey2_4 = false;
                                    $scope.fronthaulMesh2_4Form.preSharedKey.$valid = true;
                                }
                            } else {
                                $scope.errorPreSharedKey2_4Message = 'Invalid Pre shared key!';
                                $scope.errorPreSharedKey2_4 = true;
                                $scope.fronthaulMesh2_4Form.preSharedKey.$valid = false;
                            }
                        } else {
                            $scope.errorPreSharedKey2_4Message = 'Pre shared key is required!';
                            $scope.errorPreSharedKey2_4 = true;
                            $scope.fronthaulMesh2_4Form.preSharedKey.$valid = false;
                        }
                    } else if (field === 'psk5h') {
                        if ($scope.configurationDetails.FronthaulMesh5hPresharedKey) {
                            if (!containsSpace.test($scope.configurationDetails.FronthaulMesh5hPresharedKey)) {
                                    if ($scope.configurationDetails.FronthaulMesh5hPresharedKey === undefined || $scope.configurationDetails.FronthaulMesh5hPresharedKey.trim().length === 0) {
                                        $scope.errorPreSharedKey5hMessage = 'Pre shared key is required!';
                                        $scope.errorPreSharedKey5h = true;
                                        $scope.fronthaulMesh5Form.preSharedKey.$valid = false;
                                    } else if (!pskRegex.test($scope.configurationDetails.FronthaulMesh5hPresharedKey)) {
                                        $scope.errorPreSharedKey5hMessage = 'Invalid Pre shared key!';
                                        $scope.errorPreSharedKey5h = true;
                                        $scope.fronthaulMesh5Form.preSharedKey.$valid = false;
                                    } else if ($scope.configurationDetails.FronthaulMesh5hPresharedKey.length < 8 || $scope.configurationDetails.FronthaulMesh5hPresharedKey.length > 63) {
                                        $scope.errorPreSharedKey5hMessage = 'Length of Pre shared key range should be from 8 to 63!';
                                        $scope.errorPreSharedKey5h = true;
                                        $scope.fronthaulMesh5Form.preSharedKey.$valid = false;
                                    } else {
                                        $scope.errorPreSharedKey5h = false;
                                        $scope.fronthaulMesh5Form.preSharedKey.$valid = true;
                                    }   
                                } else {
                                    $scope.errorPreSharedKey5hMessage = 'Invalid Pre shared key!';
                                    $scope.errorPreSharedKey5h = true;
                                    $scope.fronthaulMesh5Form.preSharedKey.$valid = false;
                                }
                            } else {
                                $scope.errorPreSharedKey5hMessage = 'Pre shared key is required!';
                                $scope.errorPreSharedKey5h = true;
                                $scope.fronthaulMesh5Form.preSharedKey.$valid = false;
                            }
                    }  else if (field === 'startAddressDHCP') {
                        $scope.subnetFirst= '';
                        $scope.subnetLast= '';
                        if ($scope.configurationDetails.FronthaulDHCPStartAddress === undefined ||
                            $scope.configurationDetails.FronthaulDHCPStartAddress.trim().length === 0) {
                            $scope.errorStartAddressDHCPMessage = 'Start Address is required!';
                            $scope.errorStartAddressDHCP = true;
                            $scope.fronthaulDHCPForm.startAddress.$valid = false;
                        } else if (!ipV4Reg.exec($scope.configurationDetails.FronthaulDHCPStartAddress)) {
                            $scope.errorStartAddressDHCPMessage = 'Invalid Start Address!';
                            $scope.errorStartAddressDHCP = true;
                            $scope.fronthaulDHCPForm.startAddress.$valid = false;
                        } else if (!ipV4RegStartIP.exec($scope.configurationDetails.FronthaulDHCPStartAddress)) {
                            $scope.errorStartAddressDHCPMessage = 'Start Address should start with ' +$scope.selectedDHCPType;
                            $scope.errorStartAddressDHCP = true;
                            $scope.fronthaulDHCPForm.startAddress.$valid = false;
                        } else if ($scope.configurationDetails.FronthaulDHCPEndAddress !== undefined && !!ipV4RegStartIP.exec($scope.configurationDetails.FronthaulDHCPEndAddress)) {
                            if ($scope.atoi($scope.configurationDetails.FronthaulDHCPStartAddress) >= $scope.atoi($scope.configurationDetails.FronthaulDHCPEndAddress)) {
                                    $scope.errorStartAddressDHCPMessage = 'Start Address should be less than End Address';
                                    $scope.errorStartAddressDHCP = true;
                                    $scope.fronthaulDHCPForm.startAddress.$valid = false;
                                } else if ($scope.configurationDetails.FronthaulDHCPDefaultGateway && $scope.subnetCIDR) {
                                    if (!!ipV4Reg.exec($scope.configurationDetails.FronthaulDHCPDefaultGateway) && !!ipV4RegStartIP.exec($scope.configurationDetails.FronthaulDHCPDefaultGateway)) {     
                                        subnetfirst();getLastHost();
                                            if ($scope.atoi($scope.configurationDetails.FronthaulDHCPStartAddress) < $scope.atoi($scope.subnetFirst) ||
                                                $scope.atoi($scope.configurationDetails.FronthaulDHCPStartAddress) > $scope.atoi($scope.subnetLast)) {
                                                $scope.errorStartAddressDHCPMessage = 'Start Address should be in the range from ' +$scope.subnetFirst+ ' to '+$scope.subnetLast;
                                                $scope.errorStartAddressDHCP = true;
                                                $scope.fronthaulDHCPForm.startAddress.$valid = false;
                                            } else {
                                                $scope.errorStartAddressDHCP = false;
                                                $scope.fronthaulDHCPForm.startAddress.$valid = true;
                                                    if ($scope.atoi($scope.configurationDetails.FronthaulDHCPEndAddress) < $scope.atoi($scope.subnetFirst) ||
                                                        $scope.atoi($scope.configurationDetails.FronthaulDHCPEndAddress) > $scope.atoi($scope.subnetLast)) {
                                                            $scope.errorEndAddressDHCPMessage = 'End Address should be in the range from ' +$scope.subnetFirst+ ' to '+$scope.subnetLast;
                                                            $scope.errorEndAddressDHCP = true;
                                                            $scope.fronthaulDHCPForm.endAddress.$valid = false;
                                                    } else {
                                                        $scope.errorEndAddressDHCP = false;
                                                        $scope.fronthaulDHCPForm.endAddress.$valid = true;
                                                    }
                                            }
                                    } else {
                                    $scope.errorStartAddressDHCP = false;
                                    $scope.fronthaulDHCPForm.startAddress.$valid = true;
                                    $scope.errorEndAddressDHCP = false;
                                    $scope.fronthaulDHCPForm.endAddress.$valid = true;
                                    }
                                } else {
                                    $scope.errorStartAddressDHCP = false;
                                    $scope.fronthaulDHCPForm.startAddress.$valid = true;
                                    $scope.errorEndAddressDHCP = false;
                                    $scope.fronthaulDHCPForm.endAddress.$valid = true;
                                }
                        } else if ($scope.configurationDetails.FronthaulDHCPDefaultGateway && $scope.subnetCIDR) {
                            if (!!ipV4Reg.exec($scope.configurationDetails.FronthaulDHCPDefaultGateway) && !!ipV4RegStartIP.exec($scope.configurationDetails.FronthaulDHCPDefaultGateway)) {
                                subnetfirst();getLastHost();
                                if ($scope.atoi($scope.configurationDetails.FronthaulDHCPStartAddress) < $scope.atoi($scope.subnetFirst) ||
                                        $scope.atoi($scope.configurationDetails.FronthaulDHCPStartAddress) > $scope.atoi($scope.subnetLast)) {
                                        $scope.errorStartAddressDHCPMessage = 'Start Address should be in the range from ' +$scope.subnetFirst+ ' to '+$scope.subnetLast;
                                        $scope.errorStartAddressDHCP = true;
                                        $scope.fronthaulDHCPForm.startAddress.$valid = false;
                                } else {
                                        $scope.errorStartAddressDHCP = false;
                                        $scope.fronthaulDHCPForm.startAddress.$valid = true;
                                }
                            }
                        }
                        else {
                          $scope.errorStartAddressDHCP = false;
                          $scope.fronthaulDHCPForm.startAddress.$valid = true;
                        }
                    } else if (field === 'endAddressDHCP') {
                        $scope.subnetFirst= '';
                        $scope.subnetLast= '';
                        if ($scope.configurationDetails.FronthaulDHCPEndAddress === undefined ||
                            $scope.configurationDetails.FronthaulDHCPEndAddress.trim().length === 0) {
                            $scope.errorEndAddressDHCPMessage = 'End Address is required!';
                            $scope.errorEndAddressDHCP = true;
                            $scope.fronthaulDHCPForm.endAddress.$valid = false;
                        } else if (!ipV4Reg.exec($scope.configurationDetails.FronthaulDHCPEndAddress)) {
                            $scope.errorEndAddressDHCPMessage = 'Invalid End Address!';
                            $scope.errorEndAddressDHCP = true;
                            $scope.fronthaulDHCPForm.endAddress.$valid = false;
                        } else if (!ipV4RegStartIP.exec($scope.configurationDetails.FronthaulDHCPEndAddress)) {
                            $scope.errorEndAddressDHCPMessage = 'End Address should start with ' +$scope.selectedDHCPType;
                            $scope.errorEndAddressDHCP = true;
                            $scope.fronthaulDHCPForm.endAddress.$valid = false;
                        } else if ($scope.configurationDetails.FronthaulDHCPStartAddress !== undefined && !!ipV4RegStartIP.exec($scope.configurationDetails.FronthaulDHCPStartAddress)) {
                            if ($scope.atoi($scope.configurationDetails.FronthaulDHCPStartAddress) >= $scope.atoi($scope.configurationDetails.FronthaulDHCPEndAddress)) {
                                    $scope.errorEndAddressDHCPMessage = 'End Address should be greater than Start Address';
                                    $scope.errorEndAddressDHCP = true;
                                    $scope.fronthaulDHCPForm.endAddress.$valid= false;
                                } else if ($scope.configurationDetails.FronthaulDHCPDefaultGateway && $scope.subnetCIDR) {
                                    if (!!ipV4Reg.exec($scope.configurationDetails.FronthaulDHCPDefaultGateway) && !!ipV4RegStartIP.exec($scope.configurationDetails.FronthaulDHCPDefaultGateway)) {     
                                        subnetfirst();getLastHost();
                                            if ($scope.atoi($scope.configurationDetails.FronthaulDHCPEndAddress) < $scope.atoi($scope.subnetFirst) ||
                                                $scope.atoi($scope.configurationDetails.FronthaulDHCPEndAddress) > $scope.atoi($scope.subnetLast)) {
                                                $scope.errorEndAddressDHCPMessage = 'End Address should be in the range from ' +$scope.subnetFirst+ ' to '+$scope.subnetLast;
                                                $scope.errorEndAddressDHCP = true;
                                                $scope.fronthaulDHCPForm.endAddress.$valid = false;
                                            } else {
                                                $scope.errorEndAddressDHCP = false;
                                                $scope.fronthaulDHCPForm.endAddress.$valid = true;
                                                if ($scope.atoi($scope.configurationDetails.FronthaulDHCPStartAddress) < $scope.atoi($scope.subnetFirst) ||
                                                        $scope.atoi($scope.configurationDetails.FronthaulDHCPStartAddress) > $scope.atoi($scope.subnetLast)) {
                                                        $scope.errorStartAddressDHCPMessage = 'Start Address should be in the range from ' +$scope.subnetFirst+ ' to '+$scope.subnetLast;
                                                        $scope.errorStartAddressDHCP = true;
                                                        $scope.fronthaulDHCPForm.startAddress.$valid = false;
                                                } else {
                                                    $scope.errorStartAddressDHCP = false;
                                                    $scope.fronthaulDHCPForm.startAddress.$valid = true;
                                                }
                                            }
                                    } else {
                                        $scope.errorEndAddressDHCP = false;
                                        $scope.fronthaulDHCPForm.endAddress.$valid = true;
                                        $scope.errorStartAddressDHCP = false;
                                        $scope.fronthaulDHCPForm.startAddress.$valid = true;
                                    }
                                } else {
                                    $scope.errorEndAddressDHCP = false;
                                    $scope.fronthaulDHCPForm.endAddress.$valid = true;
                                    $scope.errorStartAddressDHCP = false;
                                    $scope.fronthaulDHCPForm.startAddress.$valid = true;
                                }
                        } else if ($scope.configurationDetails.FronthaulDHCPDefaultGateway && $scope.subnetCIDR) {
                            if (!!ipV4Reg.exec($scope.configurationDetails.FronthaulDHCPDefaultGateway) && !!ipV4RegStartIP.exec($scope.configurationDetails.FronthaulDHCPDefaultGateway)) {
                                subnetfirst();getLastHost();
                                if ($scope.atoi($scope.configurationDetails.FronthaulDHCPEndAddress) < $scope.atoi($scope.subnetFirst) ||
                                        $scope.atoi($scope.configurationDetails.FronthaulDHCPEndAddress) > $scope.atoi($scope.subnetLast)) {
                                        $scope.errorEndAddressDHCPMessage = 'End Address should be in the range from ' +$scope.subnetFirst+ ' to '+$scope.subnetLast;
                                        $scope.errorEndAddressDHCP = true;
                                        $scope.fronthaulDHCPForm.endAddress.$valid = false;
                                } else {
                                        $scope.errorEndAddressDHCP = false;
                                        $scope.fronthaulDHCPForm.endAddress.$valid = true;
                                }
                            }
                        } else {
                          $scope.errorEndAddressDHCP = false;
                          $scope.fronthaulDHCPForm.endAddress.$valid = true;
                        }
                    }else if (field === 'defaultGatewayDHCP') {
                        $scope.subnetFirst= '';
                        $scope.subnetLast= '';
                        $scope.subnetCIDR = '';
                        if ($scope.configurationDetails.FronthaulDHCPDefaultGateway === undefined ||
                            $scope.configurationDetails.FronthaulDHCPDefaultGateway.trim().length === 0) {
                            $scope.errorDefaultGatewayDHCPMessage = 'Default Gateway is required!';
                            $scope.errorDefaultGatewayDHCP = true;
                            $scope.fronthaulDHCPForm.defaultGateway.$valid = false;
                        } else if (!ipV4Reg.exec($scope.configurationDetails.FronthaulDHCPDefaultGateway)) {
                            $scope.errorDefaultGatewayDHCPMessage = 'Invalid Default Gateway!';
                            $scope.errorDefaultGatewayDHCP = true;
                            $scope.fronthaulDHCPForm.defaultGateway.$valid = false;
                        } else if (!ipV4RegStartIP.exec($scope.configurationDetails.FronthaulDHCPDefaultGateway)) {
                            $scope.errorDefaultGatewayDHCPMessage = 'Default Gateway should start with ' +$scope.selectedDHCPType;
                            $scope.errorDefaultGatewayDHCP = true;
                            $scope.fronthaulDHCPForm.defaultGateway.$valid = false;
                        } else if ($scope.configurationDetails.FronthaulDHCPSubnetMask) {
                            subnetfirst();getLastHost();
                            if (!!ipV4Reg.exec($scope.configurationDetails.FronthaulDHCPSubnetMask) && !!ipV4RegSubnet.exec($scope.configurationDetails.FronthaulDHCPSubnetMask) && !!subnetrange.includes(($scope.configurationDetails.FronthaulDHCPSubnetMask).split(".")[3])) {
                                $scope.subnetCIDR = getsubnetcidr($scope.configurationDetails.FronthaulDHCPSubnetMask);
                                $scope.errorDefaultGatewayDHCP = false;
                                $scope.fronthaulDHCPForm.defaultGateway.$valid = true;
                                if($scope.configurationDetails.FronthaulDHCPStartAddress) {
                                    $scope.focusValidate('startAddressDHCP');
                                }
                                if($scope.configurationDetails.FronthaulDHCPEndAddress) {
                                    $scope.focusValidate('endAddressDHCP');
                                }
                            } else {
                                $scope.errorDefaultGatewayDHCP = false;
                                $scope.fronthaulDHCPForm.defaultGateway.$valid = true;
                            }
                        } else {
                          $scope.errorDefaultGatewayDHCP = false;
                          $scope.fronthaulDHCPForm.defaultGateway.$valid = true;
                          subnetfirst();getLastHost();
                        }
                    }else if (field === 'subnetMaskDHCP') {
                        $scope.subnetFirst= '';
                        $scope.subnetLast= '';
                        $scope.subnetCIDR = '';
                        if ($scope.configurationDetails.FronthaulDHCPSubnetMask === undefined ||
                            $scope.configurationDetails.FronthaulDHCPSubnetMask.trim().length === 0) {
                            $scope.errorSubnetMaskDHCPMessage = 'Subnet Mask is required!';
                            $scope.errorSubnetMaskDHCP = true;
                            $scope.fronthaulDHCPForm.subnetMask.$valid = false;
                        } else if (!ipV4Reg.exec($scope.configurationDetails.FronthaulDHCPSubnetMask)) {
                            $scope.errorSubnetMaskDHCPMessage = 'Invalid Subnet Mask!';
                            $scope.errorSubnetMaskDHCP = true;
                            $scope.fronthaulDHCPForm.subnetMask.$valid = false;
                        } else if (!ipV4RegSubnet.exec($scope.configurationDetails.FronthaulDHCPSubnetMask)) {
                            $scope.errorSubnetMaskDHCPMessage = 'Subnet Mask should start with 255.255.255.x!';
                            $scope.errorSubnetMaskDHCP = true;
                            $scope.fronthaulDHCPForm.subnetMask.$valid = false;
                        } else if (!subnetrange.includes(($scope.configurationDetails.FronthaulDHCPSubnetMask).split(".")[3])) {
                            $scope.errorSubnetMaskDHCPMessage = 'Last octet of Subnet Mask should contain 0/128/192/224/240/248/252/255';
                            $scope.errorSubnetMaskDHCP = true;
                            $scope.fronthaulDHCPForm.subnetMask.$valid = false;
                        } else if ($scope.configurationDetails.FronthaulDHCPDefaultGateway) {
                            $scope.subnetCIDR = getsubnetcidr($scope.configurationDetails.FronthaulDHCPSubnetMask);
                            if (!!ipV4Reg.exec($scope.configurationDetails.FronthaulDHCPDefaultGateway) && !!ipV4RegStartIP.exec($scope.configurationDetails.FronthaulDHCPDefaultGateway)) {
                                subnetfirst();getLastHost();
                                $scope.errorSubnetMaskDHCP = false;
                                $scope.fronthaulDHCPForm.subnetMask.$valid = true;
                                    if($scope.configurationDetails.FronthaulDHCPStartAddress) {
                                        $scope.focusValidate('startAddressDHCP');
                                    }
                                    if($scope.configurationDetails.FronthaulDHCPEndAddress) {
                                        $scope.focusValidate('endAddressDHCP');
                                    }
                            } else {
                                $scope.errorSubnetMaskDHCP = false;
                                $scope.fronthaulDHCPForm.subnetMask.$valid = true;
                            }
                        } else {
                          $scope.errorSubnetMaskDHCP = false;
                          $scope.fronthaulDHCPForm.subnetMask.$valid = true;
                          $scope.subnetCIDR = getsubnetcidr($scope.configurationDetails.FronthaulDHCPSubnetMask);
                        }
                    } else if (field === 'primaryDNSDHCP') {
                        $scope.ipAddressValidation($scope.configurationDetails.FronthaulDHCPPrimaryDNS, 'Primary DNS');
                        $scope.errorPrimaryDNSDHCP = $scope.errorIpAdd;
                        $scope.errorPrimaryDNSDHCPMessage = $scope.IpAddMessage;
                        $scope.fronthaulDHCPForm.primaryDNS.$valid = $scope.ipValid;
                    } else if (field === 'secondaryDNSDHCP') {
                        $scope.ipAddressValidation($scope.configurationDetails.FronthaulDHCPSecondaryDNS, 'Secondary DNS');
                        $scope.errorSecondaryDNSDHCP = $scope.errorIpAdd;
                        $scope.errorSecondaryDNSDHCPMessage = $scope.IpAddMessage;
                        $scope.fronthaulDHCPForm.secondaryDNS.$valid = $scope.ipValid;
                    } else if (field === 'ipAddress') {
                        if ($scope.configurationDetails.BackhaulEthernetIPAddress === undefined ||
                            $scope.configurationDetails.BackhaulEthernetIPAddress.trim().length === 0) {
                            $scope.errorBackhaulIpAddressMessage = 'IP Address is required!';
                            $scope.errorBackhaulIpAddress = true;
                            $scope.backhaulEthernetForm.ipAddress.$valid = false;
                        } else if (!ipV4Reg.exec($scope.configurationDetails.BackhaulEthernetIPAddress)) {
                            $scope.errorBackhaulIpAddressMessage = 'Invalid IP Address!';
                            $scope.errorBackhaulIpAddress = true;
                            $scope.backhaulEthernetForm.ipAddress.$valid = false;
                        } else if (($scope.atoi($scope.configurationDetails.BackhaulEthernetIPAddress) < $scope.atoi("1.0.0.1") ||
                            $scope.atoi($scope.configurationDetails.BackhaulEthernetIPAddress) > $scope.atoi("126.255.255.254")) &&
                            ($scope.atoi($scope.configurationDetails.BackhaulEthernetIPAddress) < $scope.atoi("128.1.0.1") ||
                            $scope.atoi($scope.configurationDetails.BackhaulEthernetIPAddress) > $scope.atoi("191.255.255.254")) &&
                            ($scope.atoi($scope.configurationDetails.BackhaulEthernetIPAddress) < $scope.atoi("192.0.1.1") ||
                            $scope.atoi($scope.configurationDetails.BackhaulEthernetIPAddress) > $scope.atoi("223.255.255.254"))) {
                            $scope.errorBackhaulIpAddressMessage = 'Invalid IP Address';
                            $scope.errorBackhaulIpAddress = true;
                            $scope.backhaulEthernetForm.ipAddress.$valid = false;
                        } else {
                          $scope.errorBackhaulIpAddress = false;
                          $scope.backhaulEthernetForm.ipAddress.$valid = true;
                          if ($scope.configurationDetails.BackhaulEthernetSubnetMask !== undefined && $scope.configurationDetails.BackhaulEthernetSubnetMask) {
                            $scope.focusValidate('subnetMask');
                          }
                          if ($scope.configurationDetails.BackhaulEthernetGateWay !== undefined && $scope.configurationDetails.BackhaulEthernetGateWay) {
                            $scope.focusValidate('gateway');
                          }
                        }
                    } else if (field === 'primaryDNS') {
                        $scope.ipAddressValidation($scope.configurationDetails.BackhaulEthernetPrimaryDNS, 'Primary DNS');
                        $scope.errorBackhaulPrimaryDNS = $scope.errorIpAdd;
                        $scope.errorBackhaulPrimaryDNSMessage = $scope.IpAddMessage;
                        $scope.backhaulEthernetForm.primaryDNS.$valid = $scope.ipValid;
                    } else if (field === 'gateway') {
                        if ($scope.configurationDetails.BackhaulEthernetGateWay === undefined ||
                            $scope.configurationDetails.BackhaulEthernetGateWay.trim().length === 0) {
                            $scope.errorBackhaulGatewayMessage = 'Default Gateway is required!';
                            $scope.errorBackhaulGateway = true;
                            $scope.backhaulEthernetForm.gateway.$valid = false;
                        } else if (!ipV4Reg.exec($scope.configurationDetails.BackhaulEthernetGateWay)) {
                            $scope.errorBackhaulGatewayMessage = 'Invalid Default Gateway!';
                            $scope.errorBackhaulGateway = true;
                            $scope.backhaulEthernetForm.gateway.$valid = false;
                        } else if ($scope.configurationDetails.BackhaulEthernetIPAddress !== undefined) {
                            if ($scope.atoi($scope.configurationDetails.BackhaulEthernetIPAddress) >= $scope.atoi("1.0.0.1") &&
                                $scope.atoi($scope.configurationDetails.BackhaulEthernetIPAddress) <= $scope.atoi("126.255.255.254")) {
                                if ($scope.atoi($scope.configurationDetails.BackhaulEthernetIPAddress) === $scope.atoi($scope.configurationDetails.BackhaulEthernetGateWay)) {
                                    $scope.errorBackhaulGatewayMessage = 'Default Gateway should not be equal to IP Address!';
                                    $scope.errorBackhaulGateway = true;
                                    $scope.backhaulEthernetForm.gateway.$valid = false;
                                } else if($scope.atoi($scope.configurationDetails.BackhaulEthernetGateWay) >= $scope.atoi("1.0.0.1") &&
                                    $scope.atoi($scope.configurationDetails.BackhaulEthernetGateWay) <= $scope.atoi("126.255.255.254")) {
                                    $scope.errorBackhaulGateway = false;
                                    $scope.backhaulEthernetForm.gateway.$valid = true;
                                } else {
                                    $scope.errorBackhaulGatewayMessage = 'Default Gateway range should be 1.0.0.1 to 126.255.255.254!';
                                    $scope.errorBackhaulGateway = true;
                                    $scope.backhaulEthernetForm.gateway.$valid = false;
                                }
                            } else if ($scope.atoi($scope.configurationDetails.BackhaulEthernetIPAddress) >= $scope.atoi("128.1.0.1") &&
                                $scope.atoi($scope.configurationDetails.BackhaulEthernetIPAddress) <= $scope.atoi("191.255.255.254")) {
                                    if ($scope.atoi($scope.configurationDetails.BackhaulEthernetIPAddress) === $scope.atoi($scope.configurationDetails.BackhaulEthernetGateWay)) {
                                        $scope.errorBackhaulGatewayMessage = 'Default Gateway should not be equal to IP Address!';
                                        $scope.errorBackhaulGateway = true;
                                        $scope.backhaulEthernetForm.gateway.$valid = false;
                                    } else if($scope.atoi($scope.configurationDetails.BackhaulEthernetGateWay) >= $scope.atoi("128.1.0.1") &&
                                        $scope.atoi($scope.configurationDetails.BackhaulEthernetGateWay) <= $scope.atoi("191.255.255.254")) {
                                        $scope.errorBackhaulGateway = false;
                                        $scope.backhaulEthernetForm.gateway.$valid = true;
                                    } else {
                                        $scope.errorBackhaulGatewayMessage = 'Default Gateway range should be 128.1.0.1 to 191.255.255.254!';
                                        $scope.errorBackhaulGateway = true;
                                        $scope.backhaulEthernetForm.gateway.$valid = false;
                                    }
                            } else if ($scope.atoi($scope.configurationDetails.BackhaulEthernetIPAddress) >= $scope.atoi("192.0.1.1") &&
                            $scope.atoi($scope.configurationDetails.BackhaulEthernetIPAddress) <= $scope.atoi("223.255.255.254")) {
                                if ($scope.atoi($scope.configurationDetails.BackhaulEthernetIPAddress) === $scope.atoi($scope.configurationDetails.BackhaulEthernetGateWay)) {
                                    $scope.errorBackhaulGatewayMessage = 'Default Gateway should not be equal to IP Address!';
                                    $scope.errorBackhaulGateway = true;
                                    $scope.backhaulEthernetForm.gateway.$valid = false;
                                } else if($scope.atoi($scope.configurationDetails.BackhaulEthernetGateWay) >= $scope.atoi("192.0.1.1") &&
                                    $scope.atoi($scope.configurationDetails.BackhaulEthernetGateWay) <= $scope.atoi("223.255.255.254")) {
                                    $scope.errorBackhaulGateway = false;
                                    $scope.backhaulEthernetForm.gateway.$valid = true;
                                } else {
                                    $scope.errorBackhaulGatewayMessage = 'Default Gateway range should be 192.0.1.1 to 223.255.255.254!';
                                    $scope.errorBackhaulGateway = true;
                                    $scope.backhaulEthernetForm.gateway.$valid = false;
                                }
                            }
                    } else {
                          $scope.errorBackhaulGateway = false;
                          $scope.backhaulEthernetForm.gateway.$valid = true;
                        }
                    }else if (field === 'secondaryDNS') {
                        $scope.ipAddressValidation($scope.configurationDetails.BackhaulEthernetSecondaryDNS, 'Secondary DNS');
                        $scope.errorBackhaulSecondaryDNS = $scope.errorIpAdd;
                        $scope.errorBackhaulSecondaryDNSMessage = $scope.IpAddMessage;
                        $scope.backhaulEthernetForm.secondaryDNS.$valid = $scope.ipValid;
                    } else if (field === 'subnetMask') {
                        if ($scope.configurationDetails.BackhaulEthernetSubnetMask === undefined ||
                            $scope.configurationDetails.BackhaulEthernetSubnetMask.trim().length === 0) {
                            $scope.errorBackhaulSubnetMaskMessage = 'Subnet Mask is required!';
                            $scope.errorBackhaulSubnetMask = true;
                            $scope.backhaulEthernetForm.subnetMask.$valid = false;
                        } else if (!ipV4Reg.exec($scope.configurationDetails.BackhaulEthernetSubnetMask)) {
                            $scope.errorBackhaulSubnetMaskMessage = 'Invalid Subnet Mask!';
                            $scope.errorBackhaulSubnetMask = true;
                            $scope.backhaulEthernetForm.subnetMask.$valid = false;
                        } else if ($scope.configurationDetails.BackhaulEthernetIPAddress !== undefined) {
                            if ($scope.atoi($scope.configurationDetails.BackhaulEthernetIPAddress) >= $scope.atoi("1.0.0.1") &&
                            $scope.atoi($scope.configurationDetails.BackhaulEthernetIPAddress) <= $scope.atoi("126.255.255.254")) {
                                if (ipV4RegSubnetA.exec($scope.configurationDetails.BackhaulEthernetSubnetMask) || ipV4RegSubnetB.exec($scope.configurationDetails.BackhaulEthernetSubnetMask) || ipV4RegSubnetC.exec($scope.configurationDetails.BackhaulEthernetSubnetMask)) {
                                    if (subnetrange.includes(($scope.configurationDetails.BackhaulEthernetSubnetMask).split(".")[3])) {
                                        $scope.errorBackhaulSubnetMask = false;
                                        $scope.backhaulEthernetForm.subnetMask.$valid = true;
                                    } else {
                                        $scope.errorBackhaulSubnetMaskMessage = '2nd, 3rd or 4th octet of Subnet Mask should contain 0/128/192/224/240/248/252/255';
                                        $scope.errorBackhaulSubnetMask = true;
                                        $scope.backhaulEthernetForm.subnetMask.$valid = false;
                                    }
                                } else {
                                    $scope.errorBackhaulSubnetMaskMessage = 'Subnet Mask should 255.x.0.0 / 255.255.x.0 / 255.255.255.x format!';
                                    $scope.errorBackhaulSubnetMask = true;
                                    $scope.backhaulEthernetForm.subnetMask.$valid = false;
                                }
                            } else if ($scope.atoi($scope.configurationDetails.BackhaulEthernetIPAddress) >= $scope.atoi("128.1.0.1") &&
                            $scope.atoi($scope.configurationDetails.BackhaulEthernetIPAddress) <= $scope.atoi("191.255.255.254")) {
                                if (ipV4RegSubnetB.exec($scope.configurationDetails.BackhaulEthernetSubnetMask) || ipV4RegSubnetC.exec($scope.configurationDetails.BackhaulEthernetSubnetMask)) {
                                    if (subnetrange.includes(($scope.configurationDetails.BackhaulEthernetSubnetMask).split(".")[1]) || subnetrange.includes(($scope.configurationDetails.BackhaulEthernetSubnetMask).split(".")[2]) || subnetrange.includes(($scope.configurationDetails.BackhaulEthernetSubnetMask).split(".")[3])) {
                                        $scope.errorBackhaulSubnetMask = false;
                                        $scope.backhaulEthernetForm.subnetMask.$valid = true;
                                    } else {
                                        $scope.errorBackhaulSubnetMaskMessage = '3rd or Last octet of subnet Mask should contain 0/128/192/224/240/248/252/255';
                                        $scope.errorBackhaulSubnetMask = true;
                                        $scope.backhaulEthernetForm.subnetMask.$valid = false;
                                    }
                                } else {
                                    $scope.errorBackhaulSubnetMaskMessage = 'Subnet Mask should 255.255.x.0 / 255.255.255.x format!';
                                    $scope.errorBackhaulSubnetMask = true;
                                    $scope.backhaulEthernetForm.subnetMask.$valid = false;
                                }
                            } else if ($scope.atoi($scope.configurationDetails.BackhaulEthernetIPAddress) >= $scope.atoi("192.0.1.1") &&
                            $scope.atoi($scope.configurationDetails.BackhaulEthernetIPAddress) <= $scope.atoi("223.255.255.254")) {
                                if (ipV4RegSubnetC.exec($scope.configurationDetails.BackhaulEthernetSubnetMask)) {
                                    if (subnetrange.includes(($scope.configurationDetails.BackhaulEthernetSubnetMask).split(".")[3])) {
                                        $scope.errorBackhaulSubnetMask = false;
                                        $scope.backhaulEthernetForm.subnetMask.$valid = true;
                                    } else {
                                        $scope.errorBackhaulSubnetMaskMessage = 'Last octet of Subnet Mask should Contain 0/128/192/224/240/248/252/255';
                                        $scope.errorBackhaulSubnetMask = true;
                                        $scope.backhaulEthernetForm.subnetMask.$valid = false;
                                    }
                                } else {
                                    $scope.errorBackhaulSubnetMaskMessage = 'Subnet Mask should 255.255.255.x format!';
                                    $scope.errorBackhaulSubnetMask = true;
                                    $scope.backhaulEthernetForm.subnetMask.$valid = false;
                                }
                            }
                    } else {
                          $scope.errorBackhaulSubnetMask = false;
                          $scope.backhaulEthernetForm.subnetMask.$valid = true;
                        }
                    } else if (field === 'username') {
                        if ($scope.configurationDetails.BackhaulCellularUserName) {
                            if (!containsSpace.test($scope.configurationDetails.BackhaulCellularUserName)) {
                                    if ($scope.configurationDetails.BackhaulCellularUserName === undefined || $scope.configurationDetails.BackhaulCellularUserName.trim().length === 0) {
                                        $scope.errorUsernameMessage = 'Username is required!';
                                        $scope.errorUsername = true;
                                        $scope.backhaulCellularForm.username.$valid = false;
                                    } else if (!pattern.test($scope.configurationDetails.BackhaulCellularUserName)) {
                                        $scope.errorUsernameMessage = 'Invalid Username!';
                                        $scope.errorUsername = true;
                                        $scope.backhaulCellularForm.username.$valid = false;
                                    } else if ($scope.configurationDetails.BackhaulCellularUserName.length < 4 || $scope.configurationDetails.BackhaulCellularUserName.length > 32) {
                                        $scope.errorUsernameMessage = 'Length of Username range should be from 4 to 32!';
                                        $scope.errorUsername = true;
                                        $scope.backhaulCellularForm.username.$valid = false;
                                    } else {
                                        $scope.errorUsername = false;
                                        $scope.backhaulCellularForm.username.$valid = true;
                                    }
                                } else {
                                    $scope.errorUsernameMessage = 'Invalid Username!';
                                    $scope.errorUsername = true;
                                    $scope.backhaulCellularForm.username.$valid = false;
                                }
                            } else {
                                $scope.errorUsernameMessage = 'Username is required!';
                                $scope.errorUsername = true;
                                $scope.backhaulCellularForm.username.$valid = false;
                            }
                    } else if (field === 'BackhaulPassword') {
                        if ($scope.configurationDetails.BackhaulCellularPassword) {
                            if (!containsSpace.test($scope.configurationDetails.BackhaulCellularPassword)) {
                                    if ($scope.configurationDetails.BackhaulCellularPassword === undefined || $scope.configurationDetails.BackhaulCellularPassword.trim().length === 0) {
                                        $scope.errorPasswordMessage = 'Password is required!';
                                        $scope.errorPassword = true;
                                        $scope.backhaulCellularForm.password.$valid = false;
                                    } else if (!pattern.test($scope.configurationDetails.BackhaulCellularPassword)) {
                                        $scope.errorPasswordMessage = 'Invalid Password!';
                                        $scope.errorPassword = true;
                                        $scope.backhaulCellularForm.password.$valid = false;
                                    } else if ($scope.configurationDetails.BackhaulCellularPassword.length < 4 || $scope.configurationDetails.BackhaulCellularPassword.length > 32) {
                                        $scope.errorPasswordMessage = 'Length of Password range should be from 4 to 32!';
                                        $scope.errorPassword = true;
                                        $scope.backhaulCellularForm.password.$valid = false;
                                    } else {
                                        $scope.errorPassword = false;
                                        $scope.backhaulCellularForm.password.$valid = true;
                                    }
                                } else {
                                    $scope.errorPasswordMessage = 'Invalid Password!';
                                    $scope.errorPassword = true;
                                    $scope.backhaulCellularForm.password.$valid = false;
                                }
                            } else {
                                $scope.errorPasswordMessage = 'Password is required!';
                                $scope.errorPassword = true;
                                $scope.backhaulCellularForm.password.$valid = false;
                            }
                    } else if (field === 'simPin') {
                        if ($scope.configurationDetails.BackhaulCellularSimPin) {
                            if (!containsSpace.test($scope.configurationDetails.BackhaulCellularSimPin)) {
                                    if ($scope.configurationDetails.BackhaulCellularSimPin === undefined || $scope.configurationDetails.BackhaulCellularSimPin.trim().length === 0) {
                                        $scope.errorSimPinMessage = 'Sim Pin is required!';
                                        $scope.errorSimPin = true;
                                        $scope.backhaulCellularForm.simPin.$valid = false;
                                    } else if (!numberPattern.test($scope.configurationDetails.BackhaulCellularSimPin)) {
                                        $scope.errorSimPinMessage = 'Invalid Sim Pin!';
                                        $scope.errorSimPin = true;
                                        $scope.backhaulCellularForm.simPin.$valid = false;
                                    } else if ($scope.configurationDetails.BackhaulCellularSimPin.trim().length < 4 || $scope.configurationDetails.BackhaulCellularSimPin.trim().length > 4) {
                                        $scope.errorSimPinMessage = 'Length of Sim Pin range should be 4!';
                                        $scope.errorSimPin = true;
                                        $scope.backhaulCellularForm.simPin.$valid = false;
                                    } else {
                                        $scope.errorSimPin = false;
                                        $scope.backhaulCellularForm.simPin.$valid = true;
                                    }
                                } else {
                                    $scope.errorSimPinMessage = 'Invalid Sim Pin!';
                                    $scope.errorSimPin = true;
                                    $scope.backhaulCellularForm.simPin.$valid = false;
                                }
                            } else {
                                $scope.errorSimPinMessage = 'Sim Pin is required!';
                                $scope.errorSimPin = true;
                                $scope.backhaulCellularForm.simPin.$valid = false;
                            }
                    } else if (field === 'ssid') {
                        if ($scope.configurationDetails.FronthaulHotspot2SSID) {
                            if (!containsSpace.test($scope.configurationDetails.FronthaulHotspot2SSID)) {
                                    if ($scope.configurationDetails.FronthaulHotspot2SSID === undefined || $scope.configurationDetails.FronthaulHotspot2SSID.trim().length === 0) {
                                        $scope.errorSsidMessage = 'SIID is required!';
                                        $scope.errorSSID = true;
                                        $scope.fronthaulHotspot2_4Form.ssid.$valid = false;
                                    } else if (!ssidRegex.test($scope.configurationDetails.FronthaulHotspot2SSID)) {
                                        $scope.errorSsidMessage = 'Invalid SSID!';
                                        $scope.errorSSID = true;
                                        $scope.fronthaulHotspot2_4Form.ssid.$valid = false;
                                    } else if ($scope.configurationDetails.FronthaulHotspot2SSID.length < 8 || $scope.configurationDetails.FronthaulHotspot2SSID.length > 33) {
                                        $scope.errorSsidMessage = 'Length of SSID range should be from 8 to 33!';
                                        $scope.errorSSID = true;
                                        $scope.fronthaulHotspot2_4Form.ssid.$valid = false;
                                    } else if ($scope.configurationDetails.FronthaulHotspot21SSID) {
                                        if ($scope.configurationDetails.FronthaulHotspot2SSID.toLowerCase() === $scope.configurationDetails.FronthaulHotspot21SSID.toLowerCase()) {
                                            $scope.errorSsidMessage = 'SSID name cannot be same!';
                                            $scope.errorSSID = true;
                                            $scope.fronthaulHotspot2_4Form.ssid.$valid = false;
                                        } else {
                                            $scope.errorSSID = false;
                                            $scope.fronthaulHotspot2_4Form.ssid.$valid = true;
                                            if (!!ssidRegex.test($scope.configurationDetails.FronthaulHotspot21SSID) && !($scope.configurationDetails.FronthaulHotspot21SSID.length < 8 || $scope.configurationDetails.FronthaulHotspot21SSID.length > 33)) {
                                                $scope.errorSsid2Message = '';
                                                $scope.errorSSID2 = false;
                                                $scope.fronthaulHotspot2_4Form.ssid_2.$valid = true;
                                            }
                                        }
                                    } else if ($scope.configurationDetails.FronthaulHotspot51SSID) {
                                        if ($scope.configurationDetails.FronthaulHotspot2SSID.toLowerCase() === $scope.configurationDetails.FronthaulHotspot51SSID.toLowerCase()) {
                                            $scope.errorSsidMessage = 'SSID name cannot be same!';
                                            $scope.errorSSID = true;
                                            $scope.fronthaulHotspot2_4Form.ssid.$valid = false;
                                        } else {
                                            $scope.errorSSID = false;
                                            $scope.fronthaulHotspot2_4Form.ssid.$valid = true;
                                        }
                                    } else if ($scope.configurationDetails.FronthaulHotspot52SSID) {
                                        if ($scope.configurationDetails.FronthaulHotspot2SSID.toLowerCase() === $scope.configurationDetails.FronthaulHotspot52SSID.toLowerCase()) {
                                            $scope.errorSsidMessage = 'SSID name cannot be same!';
                                            $scope.errorSSID = true;
                                            $scope.fronthaulHotspot2_4Form.ssid.$valid = false;
                                        } else {
                                            $scope.errorSSID = false;
                                            $scope.fronthaulHotspot2_4Form.ssid.$valid = true;
                                        }
                                    } else {
                                        $scope.errorSSID = false;
                                        $scope.fronthaulHotspot2_4Form.ssid.$valid = true;
                                    }     
                                } else {
                                    $scope.errorSsidMessage = 'Invalid SSID!';
                                    $scope.errorSSID = true;
                                    $scope.fronthaulHotspot2_4Form.ssid.$valid = false;
                                }
                            } else {
                                $scope.errorSsidMessage = 'SIID is required!';
                                $scope.errorSSID = true;
                                $scope.fronthaulHotspot2_4Form.ssid.$valid = false;
                            }
                    } else if (field === 'password') {
                        if ($scope.configurationDetails.FronthaulHotspot2Password) {
                            if (!containsSpace.test($scope.configurationDetails.FronthaulHotspot2Password)) {
                                    if ($scope.configurationDetails.FronthaulHotspot2Password === undefined || $scope.configurationDetails.FronthaulHotspot2Password.trim().length === 0) {
                                        $scope.errorpassword2Message = 'Password is required!';
                                        $scope.errorpassword2d = true;
                                        $scope.fronthaulHotspot2_4Form.password.$valid = false;
                                    } else if (!pskRegex.test($scope.configurationDetails.FronthaulHotspot2Password)) {
                                        $scope.errorpassword2Message = 'Invalid Password!';
                                        $scope.errorpassword2d = true;
                                        $scope.fronthaulHotspot2_4Form.password.$valid = false;
                                    } else if ($scope.configurationDetails.FronthaulHotspot2Password.length < 8 || $scope.configurationDetails.FronthaulHotspot2Password.length > 63) {
                                        $scope.errorpassword2Message = 'Length of Password range should be from 8 to 63!';
                                        $scope.errorpassword2d = true;
                                        $scope.fronthaulHotspot2_4Form.password.$valid = false;
                                    } else {
                                        $scope.errorpassword2d = false;
                                        $scope.fronthaulHotspot2_4Form.password.$valid = true;
                                    }   
                                } else {
                                    $scope.errorpassword2Message = 'Invalid Password!';
                                    $scope.errorpassword2d = true;
                                    $scope.fronthaulHotspot2_4Form.password.$valid = false;
                                }
                            } else {
                                $scope.errorpassword2Message = 'Password is required!';
                                $scope.errorpassword2d = true;
                                $scope.fronthaulHotspot2_4Form.password.$valid = false;
                            }
                    } else if (field === 'ssid_2') {
                        if ($scope.configurationDetails.FronthaulHotspot21SSID) {
                            if (!containsSpace.test($scope.configurationDetails.FronthaulHotspot21SSID)) {
                                    if ($scope.configurationDetails.FronthaulHotspot21SSID === undefined || $scope.configurationDetails.FronthaulHotspot21SSID.trim().length === 0) {
                                        $scope.errorSsid2Message = 'SIID is required!';
                                        $scope.errorSSID2 = true;
                                        $scope.fronthaulHotspot2_4Form.ssid_2.$valid = false;
                                    } else if (!ssidRegex.test($scope.configurationDetails.FronthaulHotspot21SSID)) {
                                        $scope.errorSsid2Message = 'Invalid SSID!';
                                        $scope.errorSSID2 = true;
                                        $scope.fronthaulHotspot2_4Form.ssid_2.$valid = false;
                                    } else if ($scope.configurationDetails.FronthaulHotspot21SSID.length < 8 || $scope.configurationDetails.FronthaulHotspot21SSID.length > 33) {
                                        $scope.errorSsid2Message = 'Length of SSID range should be from 8 to 33!';
                                        $scope.errorSSID2 = true;
                                        $scope.fronthaulHotspot2_4Form.ssid_2.$valid = false;
                                    } else if ($scope.configurationDetails.FronthaulHotspot2SSID) {
                                        if ($scope.configurationDetails.FronthaulHotspot21SSID.toLowerCase() === $scope.configurationDetails.FronthaulHotspot2SSID.toLowerCase()) {
                                            $scope.errorSsid2Message = 'SSID name cannot be same';
                                            $scope.errorSSID2 = true;
                                            $scope.fronthaulHotspot2_4Form.ssid_2.$valid = false;
                                        } else {
                                            $scope.errorSSID2 = false;
                                            $scope.fronthaulHotspot2_4Form.ssid_2.$valid = true;
                                            if (!!ssidRegex.test($scope.configurationDetails.FronthaulHotspot2SSID) && !($scope.configurationDetails.FronthaulHotspot2SSID.length < 8 || $scope.configurationDetails.FronthaulHotspot2SSID.length > 33)) {
                                                $scope.errorSsidMessage = '';
                                                $scope.errorSSID = false;
                                                $scope.fronthaulHotspot2_4Form.ssid.$valid = true;
                                            }
                                        }
                                    } else if ($scope.configurationDetails.FronthaulHotspot51SSID) {
                                        if ($scope.configurationDetails.FronthaulHotspot21SSID.toLowerCase() === $scope.configurationDetails.FronthaulHotspot51SSID.toLowerCase()) {
                                            $scope.errorSsid2Message = 'SSID name cannot be same';
                                            $scope.errorSSID2 = true;
                                            $scope.fronthaulHotspot2_4Form.ssid_2.$valid = false;
                                        } else {
                                            $scope.errorSSID2 = false;
                                            $scope.fronthaulHotspot2_4Form.ssid_2.$valid = true;
                                        }
                                    } else if ($scope.configurationDetails.FronthaulHotspot52SSID) {
                                        if ($scope.configurationDetails.FronthaulHotspot21SSID.toLowerCase() === $scope.configurationDetails.FronthaulHotspot52SSID.toLowerCase()) {
                                            $scope.errorSsid2Message = 'SSID name cannot be same';
                                            $scope.errorSSID2 = true;
                                            $scope.fronthaulHotspot2_4Form.ssid_2.$valid = false;
                                        } else {
                                            $scope.errorSSID2 = false;
                                            $scope.fronthaulHotspot2_4Form.ssid_2.$valid = true;
                                        }
                                    } else {
                                        $scope.errorSSID2 = false;
                                        $scope.fronthaulHotspot2_4Form.ssid_2.$valid = true;
                                    }     
                                } else {
                                    $scope.errorSsid2Message = 'Invalid SSID!';
                                    $scope.errorSSID2 = true;
                                    $scope.fronthaulHotspot2_4Form.ssid_2.$valid = false;
                                }
                            } else {
                                $scope.errorSsid2Message = 'SIID is required!';
                                $scope.errorSSID2 = true;
                                $scope.fronthaulHotspot2_4Form.ssid_2.$valid = false;
                            }
                    } else if (field === 'password_2') {
                        if ($scope.configurationDetails.FronthaulHotspot21Password) {
                            if (!containsSpace.test($scope.configurationDetails.FronthaulHotspot21Password)) {
                                    if ($scope.configurationDetails.FronthaulHotspot21Password === undefined || $scope.configurationDetails.FronthaulHotspot21Password.trim().length === 0) {
                                        $scope.errorpassword21Message = 'Password is required!';
                                        $scope.errorpassword21 = true;
                                        $scope.fronthaulHotspot2_4Form.password_2.$valid = false;
                                    }  else if (!pskRegex.test($scope.configurationDetails.FronthaulHotspot21Password)) {
                                        $scope.errorpassword21Message = 'Invalid Password!';
                                        $scope.errorpassword21 = true;
                                        $scope.fronthaulHotspot2_4Form.password_2.$valid = false;
                                    } else if ($scope.configurationDetails.FronthaulHotspot21Password.length < 8 || $scope.configurationDetails.FronthaulHotspot21Password.length > 63) {
                                        $scope.errorpassword21Message = 'Length of Password range should be from 8 to 63!';
                                        $scope.errorpassword21 = true;
                                        $scope.fronthaulHotspot2_4Form.password_2.$valid = false;
                                    } else {
                                        $scope.errorpassword21 = false;
                                        $scope.fronthaulHotspot2_4Form.password_2.$valid = true;
                                    } 
                                } else {
                                    $scope.errorpassword21Message = 'Invalid Password!';
                                    $scope.errorpassword21 = true;
                                    $scope.fronthaulHotspot2_4Form.password_2.$valid = false;
                                }
                            } else {
                                $scope.errorpassword21Message = 'Password is required!';
                                $scope.errorpassword21 = true;
                                $scope.fronthaulHotspot2_4Form.password_2.$valid = false;
                            }  
                    } else if (field === 'ssid_51') {
                        if ($scope.configurationDetails.FronthaulHotspot51SSID) {
                            if (!containsSpace.test($scope.configurationDetails.FronthaulHotspot51SSID)) {
                                    if ($scope.configurationDetails.FronthaulHotspot51SSID === undefined || $scope.configurationDetails.FronthaulHotspot51SSID.trim().length === 0) {
                                        $scope.errorSsid51Message = 'SIID is required!';
                                        $scope.errorSSID51 = true;
                                        $scope.fronthaulHotspot5_hForm.ssid_51.$valid = false;
                                    } else if (!ssidRegex.test($scope.configurationDetails.FronthaulHotspot51SSID)) {
                                        $scope.errorSsid51Message = 'Invalid SSID!';
                                        $scope.errorSSID51 = true;
                                        $scope.fronthaulHotspot5_hForm.ssid_51.$valid = false;
                                    } else if ($scope.configurationDetails.FronthaulHotspot51SSID.length < 8 || $scope.configurationDetails.FronthaulHotspot51SSID.length > 33) {
                                        $scope.errorSsid51Message = 'Length of SSID range should be from 8 to 33!';
                                        $scope.errorSSID51 = true;
                                        $scope.fronthaulHotspot5_hForm.ssid_51.$valid = false;
                                    } else if ($scope.configurationDetails.FronthaulHotspot2SSID) {
                                        if ($scope.configurationDetails.FronthaulHotspot51SSID.toLowerCase() === $scope.configurationDetails.FronthaulHotspot2SSID.toLowerCase()) {
                                            $scope.errorSsid51Message = 'SSID name cannot be same';
                                            $scope.errorSSID51 = true;
                                            $scope.fronthaulHotspot5_hForm.ssid_51.$valid = false;
                                        } else {
                                            $scope.errorSSID51 = false;
                                            $scope.fronthaulHotspot5_hForm.ssid_51.$valid = true;
                                        }
                                    } else if ($scope.configurationDetails.FronthaulHotspot21SSID) {
                                        if ($scope.configurationDetails.FronthaulHotspot51SSID.toLowerCase() === $scope.configurationDetails.FronthaulHotspot21SSID.toLowerCase()) {
                                            $scope.errorSsid51Message = 'SSID name cannot be same';
                                            $scope.errorSSID51 = true;
                                            $scope.fronthaulHotspot5_hForm.ssid_51.$valid = false;
                                        } else {
                                            $scope.errorSSID51 = false;
                                            $scope.fronthaulHotspot5_hForm.ssid_51.$valid = true;
                                        }
                                    } else if ($scope.configurationDetails.FronthaulHotspot52SSID) {
                                        if ($scope.configurationDetails.FronthaulHotspot51SSID.toLowerCase() === $scope.configurationDetails.FronthaulHotspot52SSID.toLowerCase()) {
                                            $scope.errorSsid51Message = 'SSID name cannot be same';
                                            $scope.errorSSID51 = true;
                                            $scope.fronthaulHotspot5_hForm.ssid_51.$valid = false;
                                        } else {
                                            $scope.errorSSID51 = false;
                                            $scope.fronthaulHotspot5_hForm.ssid_51.$valid = true;
                                            if (!!ssidRegex.test($scope.configurationDetails.FronthaulHotspot52SSID) && !($scope.configurationDetails.FronthaulHotspot52SSID.length < 8 || $scope.configurationDetails.FronthaulHotspot52SSID.length > 33)) {
                                                $scope.errorSsid52Message = '';
                                                $scope.errorSSID52 = false;
                                                $scope.fronthaulHotspot5_hForm.ssid_52.$valid = true;
                                            }
                                        }
                                    } else {
                                        $scope.errorSSID51 = false;
                                        $scope.fronthaulHotspot5_hForm.ssid_51.$valid = true;
                                    }     
                                } else {
                                    $scope.errorSsid51Message = 'Invalid SSID!';
                                    $scope.errorSSID51 = true;
                                    $scope.fronthaulHotspot5_hForm.ssid_51.$valid = false;
                                }
                            } else {
                                $scope.errorSsid51Message = 'SIID is required!';
                                $scope.errorSSID51 = true;
                                $scope.fronthaulHotspot5_hForm.ssid_51.$valid = false;
                            }
                    } else if (field === 'password_51') {
                        if ($scope.configurationDetails.FronthaulHotspot51Password) {
                            if (!containsSpace.test($scope.configurationDetails.FronthaulHotspot51Password)) {
                                    if ($scope.configurationDetails.FronthaulHotspot51Password === undefined || $scope.configurationDetails.FronthaulHotspot51Password.trim().length === 0) {
                                        $scope.errorpassword51Message = 'Password is required!';
                                        $scope.errorpassword51 = true;
                                        $scope.fronthaulHotspot5_hForm.password_51.$valid = false;
                                    } else if (!pskRegex.test($scope.configurationDetails.FronthaulHotspot51Password)) {
                                        $scope.errorpassword51Message = 'Invalid Password!';
                                        $scope.errorpassword51 = true;
                                        $scope.fronthaulHotspot5_hForm.password_51.$valid = false;
                                    } else if ($scope.configurationDetails.FronthaulHotspot51Password.length < 8 || $scope.configurationDetails.FronthaulHotspot51Password.length > 63) {
                                        $scope.errorpassword51Message = 'Length of Password range should be from 8 to 63!';
                                        $scope.errorpassword51 = true;
                                        $scope.fronthaulHotspot5_hForm.password_51.$valid = false;
                                    } else {
                                        $scope.errorpassword51 = false;
                                        $scope.fronthaulHotspot5_hForm.password_51.$valid = true;
                                    }   
                                } else {
                                    $scope.errorpassword51Message = 'Invalid Password!';
                                    $scope.errorpassword51 = true;
                                    $scope.fronthaulHotspot5_hForm.password_51.$valid = false;
                                }
                            } else {
                                $scope.errorpassword51Message = 'Password is required!';
                                $scope.errorpassword51 = true;
                                $scope.fronthaulHotspot5_hForm.password_51.$valid = false;
                            }
                    } else if (field === 'ssid_52') {
                        if ($scope.configurationDetails.FronthaulHotspot52SSID) {
                            if (!containsSpace.test($scope.configurationDetails.FronthaulHotspot52SSID)) {
                                    if ($scope.configurationDetails.FronthaulHotspot52SSID === undefined || $scope.configurationDetails.FronthaulHotspot52SSID.trim().length === 0) {
                                        $scope.errorSsid52Message = 'SIID is required!';
                                        $scope.errorSSID52 = true;
                                        $scope.fronthaulHotspot5_hForm.ssid_52.$valid = false;
                                    } else if (!ssidRegex.test($scope.configurationDetails.FronthaulHotspot52SSID)) {
                                        $scope.errorSsid52Message = 'Invalid SSID!';
                                        $scope.errorSSID52 = true;
                                        $scope.fronthaulHotspot5_hForm.ssid_52.$valid = false;
                                    } else if ($scope.configurationDetails.FronthaulHotspot52SSID.length < 8 || $scope.configurationDetails.FronthaulHotspot52SSID.length > 33) {
                                        $scope.errorSsid52Message = 'Length of SSID range should be from 8 to 33!';
                                        $scope.errorSSID52 = true;
                                        $scope.fronthaulHotspot5_hForm.ssid_52.$valid = false;
                                    } else if ($scope.configurationDetails.FronthaulHotspot2SSID) {
                                        if ($scope.configurationDetails.FronthaulHotspot52SSID.toLowerCase() === $scope.configurationDetails.FronthaulHotspot2SSID.toLowerCase()) {
                                            $scope.errorSsid52Message = 'SSID name cannot be same!';
                                            $scope.errorSSID52 = true;
                                            $scope.fronthaulHotspot5_hForm.ssid_52.$valid = false;
                                        } else {
                                            $scope.errorSSID52 = false;
                                            $scope.fronthaulHotspot5_hForm.ssid_52.$valid = true;
                                        }
                                    } else if ($scope.configurationDetails.FronthaulHotspot21SSID) {
                                        if ($scope.configurationDetails.FronthaulHotspot52SSID.toLowerCase() === $scope.configurationDetails.FronthaulHotspot21SSID.toLowerCase()) {
                                            $scope.errorSsid52Message = 'SSID name cannot be same!';
                                            $scope.errorSSID52 = true;
                                            $scope.fronthaulHotspot5_hForm.ssid_52.$valid = false;
                                        } else {
                                            $scope.errorSSID52 = false;
                                            $scope.fronthaulHotspot5_hForm.ssid_52.$valid = true;
                                        }
                                    } else if ($scope.configurationDetails.FronthaulHotspot51SSID) {
                                        if ($scope.configurationDetails.FronthaulHotspot52SSID.toLowerCase() === $scope.configurationDetails.FronthaulHotspot51SSID.toLowerCase()) {
                                            $scope.errorSsid52Message = 'SSID name cannot be same!';
                                            $scope.errorSSID52 = true;
                                            $scope.fronthaulHotspot5_hForm.ssid_52.$valid = false;
                                        } else {
                                            $scope.errorSSID52 = false;
                                            $scope.fronthaulHotspot5_hForm.ssid_52.$valid = true;
                                            if (!!ssidRegex.test($scope.configurationDetails.FronthaulHotspot51SSID) && !($scope.configurationDetails.FronthaulHotspot51SSID.length < 8 || $scope.configurationDetails.FronthaulHotspot51SSID.length > 33)) {
                                                $scope.errorSsid51Message = '';
                                                $scope.errorSSID51 = false;
                                                $scope.fronthaulHotspot5_hForm.ssid_51.$valid = true;
                                            }
                                        }
                                    } else {
                                        $scope.errorSSID52 = false;
                                        $scope.fronthaulHotspot5_hForm.ssid_52.$valid = true;
                                    }     
                                } else {
                                    $scope.errorSsid52Message = 'Invalid SSID!';
                                        $scope.errorSSID52 = true;
                                        $scope.fronthaulHotspot5_hForm.ssid_52.$valid = false;
                                }
                            } else {
                                $scope.errorSsid52Message = 'SIID is required!';
                                $scope.errorSSID52 = true;
                                $scope.fronthaulHotspot5_hForm.ssid_52.$valid = false;
                            }
                    } else if (field === 'password_52') {
                        if ($scope.configurationDetails.FronthaulHotspot52Password) {
                            if (!containsSpace.test($scope.configurationDetails.FronthaulHotspot52Password)) {
                                    if ($scope.configurationDetails.FronthaulHotspot52Password === undefined || $scope.configurationDetails.FronthaulHotspot52Password.trim().length === 0) {
                                        $scope.errorpassword52Message = 'Password is required!';
                                        $scope.errorpassword52 = true;
                                        $scope.fronthaulHotspot5_hForm.password_52.$valid = false;
                                    } else if (!pskRegex.test($scope.configurationDetails.FronthaulHotspot52Password)) {
                                        $scope.errorpassword52Message = 'Invalid Password!';
                                        $scope.errorpassword52 = true;
                                        $scope.fronthaulHotspot5_hForm.password_52.$valid = false;
                                    } else if ($scope.configurationDetails.FronthaulHotspot52Password.length < 8 || $scope.configurationDetails.FronthaulHotspot52Password.length > 63) {
                                        $scope.errorpassword52Message = 'Length of Password range should be from 8 to 63!';
                                        $scope.errorpassword52 = true;
                                        $scope.fronthaulHotspot5_hForm.password_52.$valid = false;
                                    } else {
                                        $scope.errorpassword52 = false;
                                        $scope.fronthaulHotspot5_hForm.password_52.$valid = true;
                                    }   
                                } else {
                                    $scope.errorpassword52Message = 'Invalid Password!';
                                    $scope.errorpassword52 = true;
                                    $scope.fronthaulHotspot5_hForm.password_52.$valid = false;
                                }
                            } else {
                                $scope.errorpassword52Message = 'Password is required!';
                                $scope.errorpassword52 = true;
                                $scope.fronthaulHotspot5_hForm.password_52.$valid = false;
                            }
                    } else if (field === 'systemName') {
                        if ($scope.configurationDetails.SettingsSystemName) {
                            if (nameRegex.test($scope.configurationDetails.SettingsSystemName)) {
                                    if ($scope.configurationDetails.SettingsSystemName === undefined || $scope.configurationDetails.SettingsSystemName.trim().length === 0) {
                                        $scope.errorSystemNameMessage = 'System Name is required!';
                                        $scope.errorSystemName = true;
                                        $scope.systemSettingsForm.systemName.$valid = false;
                                    } else if ($scope.configurationDetails.SettingsSystemName.length > 16) {
                                        $scope.errorSystemNameMessage = 'Length of System Name must not be more than 16!';
                                        $scope.errorSystemName = true;
                                        $scope.systemSettingsForm.systemName.$valid = false;
                                    }  else {
                                        $scope.errorSystemName = false;
                                        $scope.systemSettingsForm.systemName.$valid = true;
                                    }     
                                } else {
                                    $scope.errorSystemNameMessage = 'Invalid System Name!';
                                    $scope.errorSystemName = true;
                                    $scope.systemSettingsForm.systemName.$valid = false;
                                }
                            } else {
                                $scope.errorSystemNameMessage = 'System Name is required!';
                                $scope.errorSystemName = true;
                                $scope.systemSettingsForm.systemName.$valid = false;
                            }
                    } else if (field === 'uploadLimit') {
                        if ($scope.configurationDetails.UploadBandwidth) {
                            if (!containsSpace.test($scope.configurationDetails.UploadBandwidth)) {
                                    if ($scope.configurationDetails.UploadBandwidth === undefined || $scope.configurationDetails.UploadBandwidth.trim().length === 0) {
                                        $scope.errorUploadMessage = 'Upload Bandwidth is required!';
                                        $scope.errorUpload = true;
                                        $scope.advancedBandwidthForm.uploadLimit.$valid = false;
                                    } else if (!numberPattern.test($scope.configurationDetails.UploadBandwidth)) {
                                        $scope.errorUploadMessage = 'Invalid Upload Bandwidth!';
                                        $scope.errorUpload = true;
                                        $scope.advancedBandwidthForm.uploadLimit.$valid = false;
                                    } else if ($scope.configurationDetails.UploadBandwidth < 1 || $scope.configurationDetails.UploadBandwidth > 2402) {
                                        $scope.errorUploadMessage = 'Upload Bandwidth value range should be from 1 to 2402!';
                                        $scope.errorUpload = true;
                                        $scope.advancedBandwidthForm.uploadLimit.$valid = false;
                                    } else {
                                        $scope.errorUpload = false;
                                        $scope.advancedBandwidthForm.uploadLimit.$valid = true;
                                    }
                                } else {
                                    $scope.errorUploadMessage = 'Invalid Upload Bandwidth!';
                                    $scope.errorUpload = true;
                                    $scope.advancedBandwidthForm.uploadLimit.$valid = false;
                                }
                            } else {
                                $scope.errorUploadMessage = 'Upload Bandwidth is required!';
                                $scope.errorUpload = true;
                                $scope.advancedBandwidthForm.uploadLimit.$valid = false;
                            }
                    } else if (field === 'downloadLimit') {
                        if ($scope.configurationDetails.DownloadBandwidth) {
                            if (!containsSpace.test($scope.configurationDetails.DownloadBandwidth)) {
                                    if ($scope.configurationDetails.DownloadBandwidth === undefined || $scope.configurationDetails.DownloadBandwidth.trim().length === 0) {
                                        $scope.errorDownloadMessage = 'Download Bandwidth is required!';
                                        $scope.errorDownload = true;
                                        $scope.advancedBandwidthForm.downloadLimit.$valid = false;
                                    } else if (!numberPattern.test($scope.configurationDetails.DownloadBandwidth)) {
                                        $scope.errorDownloadMessage = 'Invalid Download Bandwidth!';
                                        $scope.errorDownload = true;
                                        $scope.advancedBandwidthForm.downloadLimit.$valid = false;
                                    } else if ($scope.configurationDetails.DownloadBandwidth < 1 || $scope.configurationDetails.DownloadBandwidth > 2402) {
                                        $scope.errorDownloadMessage = 'Download Bandwidth value range should be from 1 to 2402!';
                                        $scope.errorDownload = true;
                                        $scope.advancedBandwidthForm.downloadLimit.$valid = false;
                                    } else {
                                        $scope.errorDownload = false;
                                        $scope.advancedBandwidthForm.downloadLimit.$valid = true;
                                    }
                                } else {
                                    $scope.errorDownloadMessage = 'Invalid Download Bandwidth!';
                                    $scope.errorDownload = true;
                                    $scope.advancedBandwidthForm.downloadLimit.$valid = false;
                                }
                            } else {
                                $scope.errorDownloadMessage = 'Download Bandwidth is required!';
                                $scope.errorDownload = true;
                                $scope.advancedBandwidthForm.downloadLimit.$valid = false;
                            }
                    } else if (field === 'securityTypeMesh2' && $scope.configurationDetails.FronthaulMesh2SecurityType) {
                        if($scope.configurationDetails.FronthaulMesh2SecurityType.toLowerCase() === 'open') {
                            $scope.configurationDetails.FronthaulMesh2PresharedKey = $scope.setPreviousConfigurationDetails.FronthaulMesh2PresharedKey;
                            $scope.errorPreSharedKey2_4 = false;
                        } else if ($scope.configurationDetails.FronthaulMesh2PresharedKey) {
                            $scope.focusValidate('psk2_4');
                        } else {
                            $scope.errorPreSharedKey2_4 = true;
                            $scope.errorPreSharedKey2_4Message = '';
                        }
                    } else if (field === 'securityTypeMesh5' && $scope.configurationDetails.FronthaulMesh5hSecurityType) {
                        if($scope.configurationDetails.FronthaulMesh5hSecurityType.toLowerCase() === 'open') {
                            $scope.configurationDetails.FronthaulMesh5hPresharedKey = $scope.setPreviousConfigurationDetails.FronthaulMesh5hPresharedKey;
                            $scope.errorPreSharedKey5h = false;
                        } else if ($scope.configurationDetails.FronthaulMesh5hPresharedKey) {
                            $scope.focusValidate('psk5h');
                        } else {
                            $scope.errorPreSharedKey5h = true;
                            $scope.errorPreSharedKey5hMessage = '';
                        }
                    } else if (field === 'securityTypeHotspot21' && $scope.configurationDetails.FronthaulHotspot2WirelessSecurity) {
                        if($scope.configurationDetails.FronthaulHotspot2WirelessSecurity.toLowerCase() === 'open') {
                            $scope.configurationDetails.FronthaulHotspot2Password = $scope.setPreviousConfigurationDetails.FronthaulHotspot2Password;
                            $scope.errorpassword2d = false;
                        } else if ($scope.configurationDetails.FronthaulHotspot2Password)  {
                            $scope.focusValidate('password');
                        } else {
                            $scope.errorpassword2d = true;
                            $scope.errorpassword2Message = '';
                        }
                    } else if (field === 'securityTypeHotspot22' && $scope.configurationDetails.FronthaulHotspot21WirelessSecurity) {
                        if($scope.configurationDetails.FronthaulHotspot21WirelessSecurity.toLowerCase() === 'open') {
                            $scope.configurationDetails.FronthaulHotspot21Password = $scope.setPreviousConfigurationDetails.FronthaulHotspot21Password;
                            $scope.errorpassword21 = false;
                        } else if ($scope.configurationDetails.FronthaulHotspot21Password)  {
                            $scope.focusValidate('password_2');
                        } else {
                            $scope.errorpassword21 = true;
                            $scope.errorpassword21Message = '';
                        }
                    } else if (field === 'securityTypeHotspot51' && $scope.configurationDetails.FronthaulHotspot51WirelessSecurity) {
                        if($scope.configurationDetails.FronthaulHotspot51WirelessSecurity.toLowerCase() === 'open') {
                            $scope.configurationDetails.FronthaulHotspot51Password = $scope.setPreviousConfigurationDetails.FronthaulHotspot51Password;
                            $scope.errorpassword51 = false;
                        } else if ($scope.configurationDetails.FronthaulHotspot51Password)  {
                            $scope.focusValidate('password_51');
                        } else {
                            $scope.errorpassword51 = true;
                            $scope.errorpassword51Message = '';
                        }
                    } else if (field === 'securityTypeHotspot52' && $scope.configurationDetails.FronthaulHotspot52WirelessSecurity) {
                        if($scope.configurationDetails.FronthaulHotspot52WirelessSecurity.toLowerCase() === 'open') {
                            $scope.configurationDetails.FronthaulHotspot52Password = $scope.setPreviousConfigurationDetails.FronthaulHotspot52Password;
                            $scope.errorpassword52 = false;
                        } else if ($scope.configurationDetails.FronthaulHotspot52Password)  {
                            $scope.focusValidate('password_52');
                        } else {
                            $scope.errorpassword52 = true;
                            $scope.errorpassword52Message = '';
                        }
                    }
                    $scope.set_radio2_4_valid = $scope.errorTransmitPower2_4;
                    $scope.set_radio5l_valid = $scope.errorTransmitPower5l;
                    $scope.set_radio5h_valid = $scope.errorTransmitPower5h;
                    $scope.set_mesh2_4_valid = $scope.errorMeshID2_4 || $scope.errorPreSharedKey2_4;
                    $scope.set_mesh5h_valid = $scope.errorMeshID5h || $scope.errorPreSharedKey5h;
                    $scope.set_DHCP_valid = $scope.errorSecondaryDNSDHCP || $scope.errorDefaultGatewayDHCP || $scope.errorPrimaryDNSDHCP || $scope.errorSubnetMaskDHCP || $scope.errorEndAddressDHCP || $scope.errorStartAddressDHCP || !$scope.configurationDetails.FronthaulDHCPStartAddress || !$scope.configurationDetails.FronthaulDHCPEndAddress || !$scope.configurationDetails.FronthaulDHCPDefaultGateway;
                    $scope.set_Ethernet_valid = $scope.errorBackhaulIpAddress || $scope.errorBackhaulPrimaryDNS || $scope.errorBackhaulGateway || $scope.errorBackhaulSecondaryDNS || $scope.errorBackhaulSubnetMask;
                    $scope.set_cellular_valid = $scope.errorUsername || $scope.errorPassword || $scope.errorSimPin;
                    $scope.set_hotspot21_valid = $scope.errorSSID || $scope.errorpassword2d || !$scope.configurationDetails.FronthaulHotspot2WirelessSecurity;
                    $scope.set_hotspot22_valid =  $scope.hideWirelessSetting ? ($scope.errorSSID2 || $scope.errorpassword21 || !$scope.configurationDetails.FronthaulHotspot21WirelessSecurity || !$scope.configurationDetails.FronthaulHotspot21SSID) : false;
                    $scope.set_hotspot51_valid = $scope.hideWirelessSetting51h ? ($scope.errorSSID51 || $scope.errorpassword51 || !$scope.configurationDetails.FronthaulHotspot51WirelessSecurity || !$scope.configurationDetails.FronthaulHotspot51SSID) : false;
                    $scope.set_hotspot52_valid = $scope.hideWirelessSetting52h ? ($scope.errorSSID52 || $scope.errorpassword52 || !$scope.configurationDetails.FronthaulHotspot52WirelessSecurity || !$scope.configurationDetails.FronthaulHotspot52SSID) : false;
                    $scope.set_systemsettings_valid = $scope.errorSystemName;
                    $scope.set_advance_bandwidth_valid = $scope.errorDownload || $scope.errorUpload;
                };
                $scope.atoi = function (addr) {
                    var parts = addr.split('.').map(function(str) {
                      return parseInt(str); 
                    });
                  
                    return (parts[0] ? parts[0] << 24 : 0) +
                           (parts[1] ? parts[1] << 16 : 0) +
                           (parts[2] ? parts[2] << 8  : 0) +
                            parts[3];
                  };
            function getsubnetcidr(subnet) {
                    var maskNodes = subnet.match(/(\d+)/g);
                    var cidr = 0;
                    for(var i in maskNodes){
                        cidr += (((maskNodes[i] >>> 0).toString(2)).match(/1/g) || []).length;
                    }
                    return cidr
            };
            function subnetfirst() {
                    var firsthost = "";
                    var netbinary=subnetfirstda().replace(/\./g,'');
                    var netmask=$scope.subnetCIDR;
                    for(i=0;i<netbinary.length;i++) {
                      if(i>0 && i%8==0){
                        firsthost=firsthost+".";
                      }
                      if(i < (32-(32-netmask))){
                        firsthost = firsthost+netbinary[i];
                      } else {
                        if(i == netbinary.length-1){
                          firsthost = firsthost+"1";
                        }else{
                          firsthost = firsthost+"0";
                        }
                      }
                    }
                    $scope.subnetFirst= dottedBinToDe(firsthost);
            };
            function subnetfirstda() {
                  var dottedArray = $scope.configurationDetails.FronthaulDHCPDefaultGateway.split(".");
                  var finalres = "";
                  for (var i = 0; i < dottedArray.length; i++) {
                    if(i < dottedArray.length -1){
                      finalres = finalres+decTobin(dottedArray[i])+".";
                    }else{
                      finalres = finalres+decTobin(dottedArray[i]);
                    }
                  }
                return finalres;
            };
            function decTobin(number) { 
                var result = Math.floor(number / 2);
                var mod = String(number % 2);
                while(result != 0){
                    mod = String(result % 2)+mod
                    result = Math.floor(result / 2);
                }
                while(mod.length != 8){
                    mod = "0"+mod
                }
                return mod;
            }
            function dottedBinToDe(binary) {
               var dottedArrayip =binary.split(".");
                var finalresip = "";
                    for (var i = 0; i < dottedArrayip.length; i++) {
                        if(i < dottedArrayip.length -1) {
                            finalresip = finalresip+binTodec(dottedArrayip[i])+".";
                        } else {
                            finalresip = finalresip+binTodec(dottedArrayip[i]);
                        }
                    }
                return finalresip;
            }
            function binTodec(binary) {  
               var binary = binary.split("").reverse().join("");
               var decimal = 0;
                for(i=0;i<binary.length;i++) {
                  if(binary[i] == 1) {
                    decimal = decimal + Math.pow(2,i)
                  }
                }
                return decimal;
            }
            function getLastHost(){ 
                var lasthost = "";
                var netbinary=subnetfirstda().replace(/\./g,'');
                    var netmask=$scope.subnetCIDR;
                for(i=0;i<netbinary.length;i++)
                {
                  if(i>0 && i%8==0)
                  {
                    lasthost=lasthost+".";
                  }
                    if (i < (32-(32-netmask))){
                      lasthost = lasthost+netbinary[i];
                    } else {
                        if(i == netbinary.length-1){
                            lasthost = lasthost+"0";
                        } else {
                            lasthost = lasthost+"1";
                        }
                    }
                }
                $scope.subnetLast= dottedBinToDe(lasthost);
            }
                $scope.ipAddressValidation = function (value, fieldname) {
                    var ipV4Reg = new RegExp('^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$');
                    if(value === undefined || value.trim().length === 0) {
                        $scope.IpAddMessage = fieldname + ' is required!';
                        $scope.errorIpAdd = true;
                        $scope.ipValid = false;
                    } else if(!ipV4Reg.exec(value)) {
                        $scope.IpAddMessage = 'Invalid ' + fieldname + '!';
                        $scope.errorIpAdd = true;
                        $scope.ipValid = false;
                    } else if(parseInt(value.split(".")[3], 2).toString(10) === '0' || value.split(".")[3] === '255') {
                        $scope.IpAddMessage = fieldname + ' should not end with 0 or 255!';
                        $scope.errorIpAdd = true;
                        $scope.ipValid = false;
                    } else {
                      $scope.errorIpAdd = false;
                        $scope.ipValid = true;
                    }
                };
                $scope.onchangeDHCP = function (dhcpStatus) {
                    if(dhcpStatus) {
                        $scope.configurationDetails.FronthaulDHCPStartAddress = $scope.setPreviousConfigurationDetails.FronthaulDHCPStatus ? $scope.setPreviousConfigurationDetails.FronthaulDHCPStartAddress : '';
                        $scope.configurationDetails.FronthaulDHCPEndAddress = $scope.setPreviousConfigurationDetails.FronthaulDHCPStatus ? $scope.setPreviousConfigurationDetails.FronthaulDHCPEndAddress : '';
                        $scope.configurationDetails.FronthaulDHCPSubnetMask = $scope.setPreviousConfigurationDetails.FronthaulDHCPSubnetMask;
                        $scope.configurationDetails.FronthaulDHCPPrimaryDNS = $scope.setPreviousConfigurationDetails.FronthaulDHCPPrimaryDNS;
                        $scope.configurationDetails.FronthaulDHCPDefaultGateway = $scope.setPreviousConfigurationDetails.FronthaulDHCPStatus ? $scope.setPreviousConfigurationDetails.FronthaulDHCPDefaultGateway : '';
                        $scope.configurationDetails.FronthaulDHCPSecondaryDNS = $scope.setPreviousConfigurationDetails.FronthaulDHCPSecondaryDNS;
                        $scope.validateHypersproutDetails();
                    } else {
                        $scope.configurationDetails.FronthaulDHCPStartAddress = "192.168.20.1";
                        $scope.configurationDetails.FronthaulDHCPEndAddress = "";
                        $scope.configurationDetails.FronthaulDHCPSubnetMask = "255.255.255.0";
                        $scope.configurationDetails.FronthaulDHCPPrimaryDNS = "8.8.8.8";
                        $scope.configurationDetails.FronthaulDHCPDefaultGateway = "192.168.20.1";
                        $scope.configurationDetails.FronthaulDHCPSecondaryDNS = "4.4.4.4";
                    }
                }
                $scope.onchangeEthernet = function () {
                        $scope.configurationDetails.BackhaulEthernetIPAddress = $scope.setPreviousConfigurationDetails.BackhaulEthernetIPAddress;
                        $scope.configurationDetails.BackhaulEthernetPrimaryDNS = $scope.setPreviousConfigurationDetails.BackhaulEthernetPrimaryDNS;
                        $scope.configurationDetails.BackhaulEthernetGateWay = $scope.setPreviousConfigurationDetails.BackhaulEthernetGateWay;
                        $scope.configurationDetails.BackhaulEthernetSecondaryDNS = $scope.setPreviousConfigurationDetails.BackhaulEthernetSecondaryDNS;
                        $scope.configurationDetails.BackhaulEthernetSubnetMask = $scope.setPreviousConfigurationDetails.BackhaulEthernetSubnetMask;
                        $scope.validateHypersproutDetails();
                }
                $scope.onchangeBandwidthStatus = function () {
                    if ($scope.configurationDetails.BandwidthStatus) {
                        $scope.configurationDetails.DownloadBandwidth = $scope.setPreviousConfigurationDetails.DownloadBandwidth;
                        $scope.configurationDetails.UploadBandwidth = $scope.setPreviousConfigurationDetails.UploadBandwidth;    
                    } else {
                        $scope.configurationDetails.DownloadBandwidth = "1";
                        $scope.configurationDetails.UploadBandwidth = "1";    
                    
                    }
                    $scope.validateHypersproutDetails();
                }
                function radioModeChange(mode) {
                    if (mode === '2_4') {
                        if ($scope.configurationDetails.FronthaulRadio2_4RadioMode === '11axg') {
                            $scope.streamSelections2_4 = ["1x1", "2x2", "3x3", "4x4"];
                            $scope.guardIntervals2_4 = ["800ns", "1600ns", "3200ns"];
                            $scope.channelWidths2_4 = ["20MHz", "40MHz"];
                            if ($scope.configurationDetails.FronthaulRadio2_4GuardInterval === '400ns') {
                                $scope.configurationDetails.FronthaulRadio2_4GuardInterval = "800ns";
                            }
                        } else if ($scope.configurationDetails.FronthaulRadio2_4RadioMode === '11ng') {
                            $scope.streamSelections2_4 = ["1x1", "2x2", "3x3", "4x4"];
                            $scope.guardIntervals2_4 = ["400ns", "800ns"];
                            $scope.channelWidths2_4 = ["20MHz", "40MHz"];
                            if ($scope.configurationDetails.FronthaulRadio2_4GuardInterval !== '400ns' && $scope.configurationDetails.FronthaulRadio2_4GuardInterval !== '800ns') {
                                $scope.configurationDetails.FronthaulRadio2_4GuardInterval = "400ns";
                            }
                        } else {
                            $scope.streamSelections2_4 = ["1x1"];
                            $scope.guardIntervals2_4 = ["800ns"];
                            $scope.channelWidths2_4 = ["20MHz"];
                            $scope.configurationDetails.FronthaulRadio2_4StreamSelection = "1x1";
                            $scope.configurationDetails.FronthaulRadio2_4GuardInterval = "800ns";
                            $scope.configurationDetails.FronthaulRadio2_4ChannelWidth = "20MHz";
                        }
                    } else if (mode === '5_l') {
                        if ($scope.configurationDetails.FronthaulRadio5lRadioMode === '11axa') {
                            $scope.streamSelections5l = ["1x1", "2x2", "3x3", "4x4"];
                            $scope.guardIntervals5l = ["800ns", "1600ns", "3200ns"];
                            $scope.channelWidths5l = ["20MHz", "40MHz", "80MHz"];
                            if ($scope.configurationDetails.FronthaulRadio5lGuardInterval === '400ns') {
                                $scope.configurationDetails.FronthaulRadio5lGuardInterval = "800ns";
                            }
                        } else if ($scope.configurationDetails.FronthaulRadio5lRadioMode === '11na') {
                            $scope.streamSelections5l = ["1x1", "2x2", "3x3", "4x4"];
                            $scope.guardIntervals5l = ["400ns", "800ns"];
                            $scope.channelWidths5l = ["20MHz", "40MHz"];
                            if ($scope.configurationDetails.FronthaulRadio5lChannelWidth !== '20MHz' && $scope.configurationDetails.FronthaulRadio5lChannelWidth !== '40MHz') {
                                $scope.configurationDetails.FronthaulRadio5lChannelWidth = "20MHz";
                            }
                            if ($scope.configurationDetails.FronthaulRadio5lGuardInterval !== '400ns' && $scope.configurationDetails.FronthaulRadio5lGuardInterval !== '800ns') {
                                $scope.configurationDetails.FronthaulRadio5lGuardInterval = "400ns";
                            }
                        } else if ($scope.configurationDetails.FronthaulRadio5lRadioMode === '11ac') {
                            $scope.streamSelections5l = ["1x1", "2x2", "3x3", "4x4"];
                            $scope.guardIntervals5l = ["400ns", "800ns"];
                            $scope.channelWidths5l = ["20MHz", "40MHz", "80MHz"];
                            if ($scope.configurationDetails.FronthaulRadio5lGuardInterval !== '400ns' && $scope.configurationDetails.FronthaulRadio5lGuardInterval !== '800ns') {
                                $scope.configurationDetails.FronthaulRadio5lGuardInterval = "400ns";
                            }
                        } else {
                            $scope.streamSelections5l = ["1x1"];
                            $scope.guardIntervals5l = ["800ns"];
                            $scope.channelWidths5l = ["20MHz"];
                            $scope.configurationDetails.FronthaulRadio5lStreamSelection = "1x1";
                            $scope.configurationDetails.FronthaulRadio5lGuardInterval = "800ns";
                            $scope.configurationDetails.FronthaulRadio5lChannelWidth = "20MHz";
                        }
                    } else {
                        if ($scope.configurationDetails.FronthaulRadio5hRadioMode === '11axa') {
                            $scope.streamSelections5h = ["1x1", "2x2", "3x3", "4x4"];
                            $scope.guardIntervals5h = ["800ns"];
                            $scope.channelWidths5h = ["20MHz", "40MHz", "80MHz"];
                            $scope.configurationDetails.FronthaulRadio5hGuardInterval = "800ns";
                        } else if ($scope.configurationDetails.FronthaulRadio5hRadioMode === '11na') {
                            $scope.streamSelections5h = ["1x1", "2x2", "3x3", "4x4"];
                            $scope.guardIntervals5h = ["400ns", "800ns"];
                            $scope.channelWidths5h = ["20MHz", "40MHz"];
                            if ($scope.configurationDetails.FronthaulRadio5hChannelWidth !== '20MHz' && $scope.configurationDetails.FronthaulRadio5hChannelWidth !== '40MHz') {
                                $scope.configurationDetails.FronthaulRadio5hChannelWidth = "20MHz";
                            }
                        } else if ($scope.configurationDetails.FronthaulRadio5hRadioMode === '11ac') {
                            $scope.streamSelections5h = ["1x1", "2x2", "3x3", "4x4"];
                            $scope.guardIntervals5h = ["400ns", "800ns"];
                            $scope.channelWidths5h = ["20MHz", "40MHz", "80MHz"];
                        } else {
                            $scope.streamSelections5h = ["1x1"];
                            $scope.guardIntervals5h = ["800ns"];
                            $scope.channelWidths5h = ["20MHz"];
                            $scope.configurationDetails.FronthaulRadio5hStreamSelection = "1x1";
                            $scope.configurationDetails.FronthaulRadio5hGuardInterval = "800ns";
                            $scope.configurationDetails.FronthaulRadio5hChannelWidth = "20MHz";
                        }
                    }
                }
                $scope.resetDetails = function (field) {
                    if (field === 'settings') {
                        $scope.systemSettingsForm.$setPristine();
                    } else if  (field === 'alarms') {
                        $scope.alarmsavebutton = true;
                    } else if (field === 'cellular') {
                        $scope.backhaulCellularForm.$setPristine();
                    } else if (field === 'ethernet') {
                        $scope.backhaulEthernetForm.$setPristine();
                    } else if (field === 'advanced') {
                        $scope.backhaulAdvancedForm.$setPristine();
                    } else if (field === 'twofour') {
                        $scope.fronthaulRadio2_4Form.$setPristine();
                    } else if (field === 'fivelow') {
                        $scope.fronthaulRadio5lForm.$setPristine();
                    } else if (field === 'fivehigh') {
                        $scope.fronthaulRadio5hForm.$setPristine();
                    } else if (field === 'meshtwofour') {
                        $scope.fronthaulMesh2_4Form.$setPristine();
                    } else if (field === 'meshfive') {
                        $scope.fronthaulMesh5Form.$setPristine();
                    } else if (field === 'hotspottwofour') {
                        $scope.fronthaulHotspot2_4Form.$setPristine();
                        $scope.hideWirelessSettingDirty = false;
                    } else if (field === 'hotspotfive') {
                        $scope.fronthaulHotspot5_hForm.$setPristine();
                        $scope.hideWirelessSetting5hDirty = false;
                    } else if (field === 'dhcp') {
                        $scope.fronthaulDHCPForm.$setPristine();
                    } else if (field === 'cloudConnect') {
                        document.getElementById("cloudResetForm").reset();
                        $scope.isFileBrowsed = false;
                        $scope.fileErrMessage = '';
                        $scope.invalidFile = false;
                    } else if (field === 'bandwidth') {
                        $scope.advancedBandwidthForm.$setPristine();
                    }
                    init();
                };
        
                $scope.CheckUncheckHeader = function () {
                    $scope.IsAllChecked = true;
                    for (var i = 0; i < $scope.Alarms.length; i++) {
                        if (!$scope.Alarms[i].Selected) {
                            $scope.IsAllChecked = false;
                            break;
                        }
                    };
                };
 
                $scope.CheckUncheckAll = function () {
                    for (var i = 0; i < $scope.Alarms.length; i++) {
                        $scope.Alarms[i].Selected = $scope.IsAllChecked;
                    }
                };
            $scope.showWirelessSettings = function () {
              $scope.hideWirelessSetting = !$scope.hideWirelessSetting;
              $scope.set_hotspot22_valid = false;
              $scope.hideWirelessSettingDirty = true;
              $scope.configurationDetails.FronthaulHotspot21Status = false;
              $scope.configurationDetails.FronthaulHotspot21SSID = '';
              $scope.configurationDetails.FronthaulHotspot21WirelessSecurity = "Open";
              $scope.configurationDetails.FronthaulHotspot21Password = '';
              $scope.validateHypersproutDetails();
            };
            $scope.showWirelessSettings5h = function (action) {
                if (action === 'add') {
                    if (!$scope.hideWirelessSetting51h && !$scope.hideWirelessSetting52h) {
                        $scope.hideWirelessSetting51h = true;
                    } else if ($scope.hideWirelessSetting51h && !$scope.hideWirelessSetting52h) {
                        $scope.hideWirelessSetting52h = true;
                    } else {
                        $scope.hideWirelessSetting51h = true;
                    }
                } else if (action === 'delete1') {
                    $scope.hideWirelessSetting51h = false;
                    $scope.set_hotspot51_valid = false;
                    $scope.hideWirelessSetting5hDirty = true;
                    $scope.configurationDetails.FronthaulHotspot51Status = false;
                    $scope.configurationDetails.FronthaulHotspot51SSID = '';
                    $scope.configurationDetails.FronthaulHotspot51WirelessSecurity = "Open";
                    $scope.configurationDetails.FronthaulHotspot51Password = '';
                } else if (action === 'delete2') {
                    $scope.hideWirelessSetting52h = false;
                    $scope.set_hotspot52_valid = false;
                    $scope.hideWirelessSetting5hDirty = true;
                    $scope.configurationDetails.FronthaulHotspot52Status = false;
                    $scope.configurationDetails.FronthaulHotspot52SSID = '';
                    $scope.configurationDetails.FronthaulHotspot52WirelessSecurity = "Open";
                    $scope.configurationDetails.FronthaulHotspot52Password = '';
                }
            };
            $scope.getTimezoneListByCountry = function () {
                fetchDefaultCountryDetails();
            };
            $scope.updateRadioMode = function (mode) {
                radioModeChange(mode);
                $scope.updateChannelWidth();
            };
            $scope.updateChannelWidth = function () {
                if ($scope.configurationDetails.FronthaulRadio5hChannelWidth !== '20MHz') {
                    $scope.abc = [];
                        $scope.channels5_h = angular.isUndefinedOrNull($scope.defaultValues.five_high) ? [] : ($scope.defaultValues.five_high.Channels).map(String);
                        var index = $scope.channels5_h.indexOf("165");
                        if (index > -1) {
                            $scope.channels5_h.splice(index, 1);
                            if($scope.configurationDetails.FronthaulRadio5hChannel === '165') {
                                $scope.configurationDetails.FronthaulRadio5hChannel = $scope.channels5_h[0];
                            }
                        }
                } else {
                        $scope.channels5_h = angular.isUndefinedOrNull($scope.defaultValues.five_high) ? [] : ($scope.defaultValues.five_high.Channels).map(String);
                }
            };
            $scope.buttondisable = function () {
                $scope.alarmsavebutton = false;
            };
            $scope.fileValidation = false;
            $scope.isFileBrowsed = false;
            $scope.fileNameChanged = function(file) {
                    if(file && file[0].name.includes('.')) {
                        var type = file[0].name.substring(file[0].name.lastIndexOf(".") + 1);
                        if (type === 'pem' && file.size !== 0) {
                            $scope.fileErrMessage = '';
                            $scope.invalidFile = false;
                            $scope.isFileBrowsed = !!file.length;
                            $scope.fileValidation = !(file[0] !== undefined && file[0].size !== 0);
                        } else {
                            $scope.fileErrMessage = 'Only .pem file format supported!';
                            $scope.invalidFile = true;
                            $scope.isFileBrowsed = false;
                        }
                    } else {
                        $scope.fileErrMessage = 'Select file only .pem extension';
                        $scope.invalidFile = true;
                        $scope.isFileBrowsed = false;
                    }
             };
             function fetchCarrierListDetails() {
                    deviceService.fetchCarrierListDetails($scope.deviceID)
                    .then(function (objData) { 
                            if (objData !== null) {
                                if (objData.type) {
                                    $scope.carrierNameList = [];
                                    $scope.carrierNameList = objData.Message.Carrier;
                                } else {
                                    swal(objData.Message);
                                }
                            }
                    });
           }
           $scope.onchangeNetworkSelection = function () {
            if ($scope.configurationDetails.BackhaulCellularNetworkSelection === '1') {
                fetchCarrierListDetails();
            }
           };
             $scope.validateHypersproutDetails = function () {
                $scope.hypersproutFields = []; 
                $scope.currentURL = $state;
                var currentPage = ($scope.currentURL.current.name).split(".")[2];
                if (currentPage == 'frontHaulRadio') {
                    $scope.hypersproutFields = ["transmitPower2_4" , "transmitPower5l"];
                    if ($scope.configurationDetails.SettingsCountry !== 'UZBEKISTAN') {
                        $scope.hypersproutFields.push("transmitPower5h");
                    }
                } else if (currentPage == 'systemSettings') {
                    $scope.hypersproutFields = ["systemName"]; 
                } else if (currentPage == 'frontHaulMesh') {
                    $scope.hypersproutFields = ["securityTypeMesh2" , "securityTypeMesh5"];
                    if ($scope.configurationDetails.FronthaulMesh2MeshID) {
                        $scope.hypersproutFields.push("meshID2_4");
                    } else {
                        $scope.errorMeshID2_4Message = '';
                    }
                    if ($scope.configurationDetails.FronthaulMesh5hMeshID) {
                        $scope.hypersproutFields.push("meshID5h");
                    } else {
                        $scope.errorMeshID5hMessage = '';
                    }
                } else if (currentPage == 'backHaul') {
                    if ($scope.configurationDetails.BackhaulEthernetIPAddress) {
                        $scope.hypersproutFields.push("ipAddress");
                    } else {
                        $scope.errorBackhaulIpAddressMessage = '';
                        $scope.errorBackhaulIpAddress = true;
                    }
                    if ($scope.configurationDetails.BackhaulEthernetPrimaryDNS) {
                        $scope.hypersproutFields.push("primaryDNS");
                    } else {
                        $scope.errorBackhaulPrimaryDNSMessage = '';
                        $scope.errorBackhaulPrimaryDNS = false;
                        $scope.set_Ethernet_valid = true;
                    }
                    if ($scope.configurationDetails.BackhaulEthernetGateWay) {
                        $scope.hypersproutFields.push("gateway");
                    } else {
                        $scope.errorBackhaulGatewayMessage = '';
                        $scope.errorBackhaulGateway = true;
                    }
                    if ($scope.configurationDetails.BackhaulEthernetSecondaryDNS) {
                        $scope.hypersproutFields.push("secondaryDNS");
                    } else {
                        $scope.errorBackhaulSecondaryDNSMessage = '';
                        $scope.errorBackhaulSecondaryDNS = true;
                    }
                    if ($scope.configurationDetails.BackhaulEthernetSubnetMask) {
                        $scope.hypersproutFields.push("subnetMask");
                    } else {
                        $scope.errorBackhaulSubnetMaskMessage = '';
                        $scope.errorBackhaulSubnetMask = true;
                    }
                    if ($scope.configurationDetails.BackhaulCellularUserName) {
                        $scope.hypersproutFields.push("username");
                    } else {
                        $scope.errorUsernameMessage = '';
                    }
                    if ($scope.configurationDetails.BackhaulCellularPassword) {
                        $scope.hypersproutFields.push("BackhaulPassword");
                    } else {
                        $scope.errorPasswordMessage = '';
                    }
                    if ($scope.configurationDetails.BackhaulCellularSimPin) {
                        $scope.hypersproutFields.push("simPin");
                    } else {
                        $scope.errorSimPinMessage = '';
                    }
                } else if (currentPage == 'frontHaulHotspot') {
                    $scope.hypersproutFields = ["ssid" , "securityTypeHotspot21" , "securityTypeHotspot22" , "securityTypeHotspot51" , "securityTypeHotspot52"]; 
                    if ($scope.hideWirelessSetting && $scope.configurationDetails.FronthaulHotspot21SSID) {
                        $scope.hypersproutFields.push("ssid_2");
                    } else {
                        $scope.errorSsid2Message = '';
                    }
                    if ($scope.hideWirelessSetting51h && $scope.configurationDetails.FronthaulHotspot51SSID) {
                        $scope.hypersproutFields.push("ssid_51");
                    } else {
                        $scope.errorSsid51Message = '';
                    }
                    if ($scope.hideWirelessSetting52h && $scope.configurationDetails.FronthaulHotspot52SSID) {
                        $scope.hypersproutFields.push("ssid_52");
                    } else {
                        $scope.errorSsid52Message = '';
                    }
                } else if (currentPage == 'frontHaulDhcp') {
                    $scope.hypersproutFields = ["subnetMaskDHCP", "primaryDNSDHCP", "secondaryDNSDHCP"]; 
                    if ($scope.configurationDetails.FronthaulDHCPStartAddress) {
                        $scope.hypersproutFields.push("startAddressDHCP");
                    } else {
                        $scope.errorStartAddressDHCPMessage = '';
                    }
                    if ($scope.configurationDetails.FronthaulDHCPEndAddress) {
                        $scope.hypersproutFields.push("endAddressDHCP");
                    } else {
                        $scope.errorEndAddressDHCPMessage = '';
                    }
                    if ($scope.configurationDetails.FronthaulDHCPDefaultGateway) {
                        $scope.hypersproutFields.push("defaultGatewayDHCP");
                    } else {
                        $scope.errorDefaultGatewayDHCPMessage = '';
                    }
                } else if (currentPage == 'bandwidthLimitations') {
                    if ($scope.configurationDetails.DownloadBandwidth) {
                        $scope.hypersproutFields.push("downloadLimit");
                    } else {
                        $scope.errorDownloadMessage = '';
                        $scope.errorDownload = false;
                    }
                    if ($scope.configurationDetails.UploadBandwidth) {
                        $scope.hypersproutFields.push("uploadLimit");
                    } else {
                        $scope.errorUploadMessage = '';
                        $scope.errorUpload = false;
                        $scope.set_advance_bandwidth_valid = true;
                    }
                }
                if ($scope.hypersproutFields.length > 0) {
                    for (var i = 0; i < $scope.hypersproutFields.length; i++) {
                        $scope.focusValidate($scope.hypersproutFields[i]);
                    }
                }
                };
                $scope.onchangeType = function () {
                    $scope.ipAddressCheck = '';
                    ipV4RegStartIP = '';
                    $scope.selectedDHCPType = '';
                    $scope.ipAddressCheck = $scope.configurationDetails.FronthaulDHCPType === '1' ? '^172.16.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$': '^192.168.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$';
                    ipV4RegStartIP = new RegExp($scope.ipAddressCheck);
                    $scope.selectedDHCPType = $scope.configurationDetails.FronthaulDHCPType === '1' ? '172.16.x.x!' : '192.168.x.x!';
                    if ($scope.configurationDetails.FronthaulDHCPType === '1') {
                        $scope.configurationDetails.FronthaulDHCPStatus = true;
                        $scope.configurationDetails.FronthaulDHCPStartAddress = $scope.setPreviousConfigurationDetails.FronthaulDHCPMeshStartAddress;
                        $scope.configurationDetails.FronthaulDHCPEndAddress = $scope.setPreviousConfigurationDetails.FronthaulDHCPMeshEndAddress;
                        $scope.configurationDetails.FronthaulDHCPSubnetMask = $scope.setPreviousConfigurationDetails.FronthaulDHCPMeshSubnetMask;
                        $scope.configurationDetails.FronthaulDHCPPrimaryDNS = $scope.setPreviousConfigurationDetails.FronthaulDHCPMeshPrimaryDNS;
                        $scope.configurationDetails.FronthaulDHCPDefaultGateway = $scope.setPreviousConfigurationDetails.FronthaulDHCPMeshDefaultGateway;
                        $scope.configurationDetails.FronthaulDHCPSecondaryDNS = $scope.setPreviousConfigurationDetails.FronthaulDHCPMeshSecondaryDNS;                
                    } else {
                        $scope.configurationDetails.FronthaulDHCPStatus = $scope.setPreviousConfigurationDetails.FronthaulDHCPStatus;
                        $scope.configurationDetails.FronthaulDHCPStartAddress = $scope.setPreviousConfigurationDetails.FronthaulDHCPStartAddress;
                        $scope.configurationDetails.FronthaulDHCPEndAddress = $scope.setPreviousConfigurationDetails.FronthaulDHCPEndAddress;
                        $scope.configurationDetails.FronthaulDHCPSubnetMask = $scope.setPreviousConfigurationDetails.FronthaulDHCPSubnetMask;
                        $scope.configurationDetails.FronthaulDHCPPrimaryDNS = $scope.setPreviousConfigurationDetails.FronthaulDHCPPrimaryDNS;
                        $scope.configurationDetails.FronthaulDHCPDefaultGateway = $scope.setPreviousConfigurationDetails.FronthaulDHCPDefaultGateway;
                        $scope.configurationDetails.FronthaulDHCPSecondaryDNS = $scope.setPreviousConfigurationDetails.FronthaulDHCPSecondaryDNS;            
                    }
                    $scope.validateHypersproutDetails();
                } 
            }]);
})(window.angular);