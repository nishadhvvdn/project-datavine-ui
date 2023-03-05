/**
 * @description
 * Controller for UI grid table of unassigned meters
 */
(function (angular) {
    "use strict";
    angular.module('dataVINEApp').controller('deviceMeterConfigurationManagementCtrl',
        ['$scope', '$uibModal', '$state', '$rootScope',
            '$filter', '$timeout', 'DeviceService', 'ParseService',
            'DeviceMappingService', '$sessionStorage',
            function ($scope, $uibModal, $state, $rootScope,
                $filter, $timeout, deviceService, parseService,
                deviceMappingService, $sessionStorage) {
                var vm = this;
                $scope.meterConfigurationDetails = [];
                $scope.setPreviousMeterConfigurationDetails = [];
                $scope.Alarms = [];
                $scope.defaultValues = [];
                $scope.path = "2.4";
                $scope.passwordIconOne = "password";
                $scope.passwordIconTwo = "password";
                $scope.alarmsavebutton = true;
                $scope.subnetCIDR= '';
                $scope.subnetFirst= '';
                $scope.subnetLast= '';
                  /**
                 *  @description
                 * change tab content onclick
                 *
                 * @param link
                 * @return Nil
                 
                 */
                $scope.changeTab = function (link, tabName) {
                    $scope.path = link;
                    if (tabName === 'mesh') {
                        $scope.fronthaulMeshForm.$setPristine();
                    }
                    init();
                };
                init();

                /**
                 * Initialize the controller data
                 */
                    function init() {
                        if (!$sessionStorage.get('selectedDeviceIdConfig')) {
                                $state.go('system.registration.meterEntry');
                        } else {
                            $scope.meterConfigurationDetails = [];
                            $scope.setPreviousMeterConfigurationDetails = [];
                            var today = new Date();
                            $scope.time = today.getHours() + ":" + today.getMinutes();
                            $scope.primaryBackhaul = ["Cellular", "Ethernet"];
                            $scope.countries = ["INDIA", "USA", "CANADA", "SINGAPORE", "MEXICO", "RUSSIA", "UZBEKISTAN", "SOUTH AFRICA", "PHILIPPINES"];
                            $scope.radioBands = ["2.4 GHz" , "5 GHz"];
                            $scope.meterConfigurationDetails.FronthaulRadioRadioBand = $scope.radioBands[1];
                            $scope.deviceID = $sessionStorage.get('selectedDeviceIdConfig');
                            $scope.deviceStatus = $sessionStorage.get('selectedDeviceStatusConfig');
                            deviceService.getSysteminformationDetails($scope.deviceID, 'meter')
                            .then(function (objData) {
                                $scope.meterConfigurationDetails = parseService.getParsedMeterConfigData(objData);
                                $scope.setPreviousMeterConfigurationDetails = parseService.getParsedMeterConfigData(objData); 
                                fetchDefaultCountryDetails();
                                if (objData !== null) {
                                    $scope.meterConfigurationDetails.FronthaulHotspotWirelessSecurity = ($scope.meterConfigurationDetails.FronthaulHotspotWirelessSecurity.toLowerCase() === 'open' || $scope.meterConfigurationDetails.FronthaulHotspotWirelessSecurity.toLowerCase() === 'none') ? 'Open' : $scope.meterConfigurationDetails.FronthaulHotspotWirelessSecurity.toUpperCase();
                                    $scope.meterConfigurationDetails.FronthaulPrimSecurityType = ($scope.meterConfigurationDetails.FronthaulPrimSecurityType.toLowerCase() === 'open' || $scope.meterConfigurationDetails.FronthaulPrimSecurityType.toLowerCase() === 'none') ? 'Open' : $scope.meterConfigurationDetails.FronthaulPrimSecurityType.toUpperCase();
                                    $scope.meterConfigurationDetails.FronthaulSecSecurityType = ($scope.meterConfigurationDetails.FronthaulSecSecurityType.toLowerCase() === 'open' || $scope.meterConfigurationDetails.FronthaulSecSecurityType.toLowerCase() === 'none') ? 'Open' : $scope.meterConfigurationDetails.FronthaulSecSecurityType.toUpperCase();
                                    $scope.Alarms = [
                                        { Name: "Voltage Sag Line 1", Selected: $scope.meterConfigurationDetails.VoltageSagLine1 },
                                        { Name: "Voltage Sag Line 2", Selected: $scope.meterConfigurationDetails.VoltageSagLine2 },
                                        { Name: "Voltage Sag Line 3", Selected: $scope.meterConfigurationDetails.VoltageSagLine3 },
                                        { Name: "Voltage Swell Line 1", Selected: $scope.meterConfigurationDetails.VoltageSwellLine1 },
                                        { Name: "Voltage Swell Line 2", Selected: $scope.meterConfigurationDetails.VoltageSwellLine2 },
                                        { Name: "Voltage Swell Line 3", Selected: $scope.meterConfigurationDetails.VoltageSwellLine3 },
                                        { Name: "Voltage Unbalance", Selected: $scope.meterConfigurationDetails.VoltageUnbalance },
                                        { Name: "Voltage Cable Loss Line 1", Selected: $scope.meterConfigurationDetails.VoltageCablelossLine1 },
                                        { Name: "Voltage Cable Loss Line 2", Selected: $scope.meterConfigurationDetails.VoltageCablelossLine2 },
                                        { Name: "Voltage Cable Loss Line 3", Selected: $scope.meterConfigurationDetails.VoltageCablelossLine3 },
                                        { Name: "Voltage THD Over Limit Line 1", Selected: $scope.meterConfigurationDetails.VoltageTHDOverLimitLine1 },
                                        { Name: "Voltage THD Over Limit Line 2", Selected: $scope.meterConfigurationDetails.VoltageTHDOverLimitLine2 },
                                        { Name: "Voltage THD Over Limit Line 3", Selected: $scope.meterConfigurationDetails.VoltageTHDOverLimitLine3 },
                                        { Name: "Current THD Over Limit Line 1", Selected: $scope.meterConfigurationDetails.CurrentTHDOverLimitLine1 },
                                        { Name: "Current THD Over Limit Line 2", Selected: $scope.meterConfigurationDetails.CurrentTHDOverLimitLine2 },
                                        { Name: "Current THD Over Limit Line 3", Selected: $scope.meterConfigurationDetails.CurrentTHDOverLimitLine3 },
                                        { Name: "Primary Power Up", Selected: $scope.meterConfigurationDetails.PrimaryPowerUp },
                                        { Name: "Primary Power Down", Selected: $scope.meterConfigurationDetails.PrimaryPowerDown },
                                        { Name: "Long Outage Detection", Selected: $scope.meterConfigurationDetails.LongOutagedetection },
                                        { Name: "Short Outage Detection", Selected: $scope.meterConfigurationDetails.ShortOutagedetection },
                                        { Name: "Nonvolatile Memory Failed", Selected: $scope.meterConfigurationDetails.NonvolatileMemoryFailed },
                                        { Name: "Clock Error Detected", Selected: $scope.meterConfigurationDetails.Clockerrordetected },
                                        { Name: "Low Battery Voltage", Selected: $scope.meterConfigurationDetails.LowBatteryVoltage },
                                        { Name: "Flash Memory Failed", Selected: $scope.meterConfigurationDetails.FlashMemoryFailed },
                                        { Name: "Firmware Upgraded", Selected: $scope.meterConfigurationDetails.Firmwareupgraded },
                                        { Name: "Demand Reset", Selected: $scope.meterConfigurationDetails.Demandreset },
                                        { Name: "Time Synchronized", Selected: $scope.meterConfigurationDetails.TimeSynchronized },
                                        { Name: "History Log Cleared", Selected: $scope.meterConfigurationDetails.Historylogcleared },
                                        { Name: "Cover Removal", Selected: $scope.meterConfigurationDetails.Coverremoval },
                                        { Name: "Terminal Cover Removal", Selected: $scope.meterConfigurationDetails.Terminalcoverremoval },
                                        { Name: "Meter Disconnected", Selected: $scope.meterConfigurationDetails.MeterDisconnected },
                                        { Name: "Meter Connected", Selected: $scope.meterConfigurationDetails.MeterConnected },
                                        { Name: "Demand Response of Import act pwr(kW+)", Selected: $scope.meterConfigurationDetails.DemandresponseofimportactpwrkWplus },
                                        { Name: "Demand Response of Export act pwr(kW-)", Selected: $scope.meterConfigurationDetails.DemandresponseofexportactpwrkWminus },
                                        { Name: "Demand Response of Import react pwr(kVar+)", Selected: $scope.meterConfigurationDetails.DemandresponseofimportreactpwrkVarplus },
                                        { Name: "Demand Response of Export react pwr(kVar-)", Selected: $scope.meterConfigurationDetails.DemandresponseofexportreactpwrkVarminus }
                                    ];  
                                    $scope.CheckUncheckHeader();
                                }
                            });
                            
                        }
                };

                function fetchDefaultCountryDetails() {
                    deviceService.fetchcountryDefaultValues($scope.meterConfigurationDetails.SettingsCountry)
                   .then(function (objData) {
                        if (objData !== null) {
                            $scope.defaultValues = angular.isUndefinedOrNull(objData.details[0].Config) ? "" : objData.details[0].Config;
                            $scope.channels2_4 = ($scope.defaultValues.two_four.Channels).map(String);
                            $scope.channels5 = (($scope.defaultValues.five_low.Channels).map(String)).concat((angular.isUndefinedOrNull($scope.defaultValues.five_high) ? [] : ($scope.defaultValues.five_high.Channels).map(String)));
                            $scope.setChannels = ($scope.defaultValues.two_four.Channels).map(String);
                            $scope.timezoneList = $scope.defaultValues.Timezone;
                            if ($scope.meterConfigurationDetails.SettingsCountry !== $scope.setPreviousMeterConfigurationDetails.SettingsCountry) {
                                $scope.meterConfigurationDetails.SettingsTimezone = $scope.timezoneList[0];
                            } else {
                                $scope.meterConfigurationDetails.SettingsTimezone = $scope.setPreviousMeterConfigurationDetails.SettingsTimezone;
                            }
                            radioBandChange();
                            $scope.validateMeterDetails();
                        }   
                   });
               }

                $scope.saveFronthaulConfig = function (selectedtab) {
                    var saveConfig = {};
                    if(selectedtab === 'Radio') {
                        saveConfig = { 
                            RadioBand: $scope.meterConfigurationDetails.FronthaulRadioRadioBand,
                            RadioMode: $scope.meterConfigurationDetails.FronthaulRadioRadioMode,
                            ChannelWidth: $scope.meterConfigurationDetails.FronthaulRadioChannelWidth,
                            Channel: parseInt($scope.meterConfigurationDetails.FronthaulRadioChannel),
                            TransmitPower: parseInt($scope.meterConfigurationDetails.FronthaulRadioTransmitPower),
                            StreamSelection: $scope.meterConfigurationDetails.FronthaulRadioStreamSelection
                        }
                        $scope.fronthaulRadioForm.$setPristine();
                    } else if (selectedtab === 'Hotspot') {
                        if ($scope.meterConfigurationDetails.FronthaulHotspotSSID !== $scope.setPreviousMeterConfigurationDetails.FronthaulHotspotSSID ||
                            $scope.meterConfigurationDetails.FronthaulHotspotPassword !== $scope.setPreviousMeterConfigurationDetails.FronthaulHotspotPassword) {
                            $scope.hotspotaction = 3;
                        } else {
                            $scope.hotspotaction = 0;
                        }
                        saveConfig = { vap_availabililty: 1,
                            vap_action: $scope.hotspotaction,
                            SSID: $scope.meterConfigurationDetails.FronthaulHotspotSSID,
                            WirelessSecurity: $scope.meterConfigurationDetails.FronthaulHotspotWirelessSecurity,
                            Password: $scope.meterConfigurationDetails.FronthaulHotspotPassword
                        }
                        $scope.fronthaulHotspotForm.$setPristine();
                    } else if (selectedtab === 'Mesh') {
                        saveConfig = {  MeshID_Prim: $scope.meterConfigurationDetails.FronthaulPrimMeshID,
                            SecurityType_Prim: $scope.meterConfigurationDetails.FronthaulPrimSecurityType,
                            PSK_Prim: $scope.meterConfigurationDetails.FronthaulPrimPresharedKey,
                            Mac_Prim: $scope.meterConfigurationDetails.FronthaulPrimMacAddress,
                            DeviceType_Prim: parseInt($scope.meterConfigurationDetails.FronthaulPrimDeviceType),
                            SerialNumber_Prim: $scope.meterConfigurationDetails.FronthaulPrimSerialNumber,
                            MeshID_Sec: $scope.meterConfigurationDetails.FronthaulSecMeshID,
                            SecurityType_Sec: $scope.meterConfigurationDetails.FronthaulSecSecurityType,
                            PSK_Sec: $scope.meterConfigurationDetails.FronthaulSecPresharedKey,
                            Mac_Sec: $scope.meterConfigurationDetails.FronthaulSecMACAddress,
                            DeviceType_Sec: parseInt($scope.meterConfigurationDetails.FronthaulSecDeviceType),
                            SerialNumber_Sec: $scope.meterConfigurationDetails.FronthaulSecSerialNumber
                        }
                        $scope.fronthaulMeshForm.$setPristine();
                    } else if (selectedtab === 'DHCP') {
                        saveConfig = { Status: $scope.meterConfigurationDetails.FronthaulDHCPStatus === true ? 1 : 0,
                            StartAddress: $scope.meterConfigurationDetails.FronthaulDHCPStartAddress,
                            EndAddress: $scope.meterConfigurationDetails.FronthaulDHCPEndAddress,
                            Subnet: $scope.meterConfigurationDetails.FronthaulDHCPSubnetMask,
                            Gateway: $scope.meterConfigurationDetails.FronthaulDHCPDefaultGateway,
                            Primary_DNS: $scope.meterConfigurationDetails.FronthaulDHCPPrimaryDNS,
                            Secondary_DNS: $scope.meterConfigurationDetails.FronthaulDHCPSecondaryDNS
                        }
                        $scope.fronthaulDHCPForm.$setPristine();
                    }
                      deviceService.setConfigDetails("FrontHaulConfigurations", $scope.deviceID, $scope.meterConfigurationDetails.DeviceSerialNumber, selectedtab, '', 'meter', saveConfig)
                          .then(function (objData) {
                            swal(objData);
                            init();
                      });
                };
                $scope.scanMeshProfile = function () {
                    $scope.availableMeshProfiles = [];
                    deviceService.scanMeshProfileDetails($scope.deviceID, $scope.meterConfigurationDetails.DeviceSerialNumber, 'meter')
                          .then(function (objData) {
                            $scope.responseArray = [];
                            if (!angular.isUndefinedOrNull(objData) && !angular.isUndefinedOrNull(objData.type)) {
                                if (objData.type) {
                                    var meshProfiles = [];
                                    meshProfiles = objData.scanList;
                                    for (var i = 0; i < meshProfiles.length; i++) {
                                        var obj = {};
                                        obj['MeshID'] = angular.isUndefinedOrNull(meshProfiles[i].mesh_id) ? "" : meshProfiles[i].mesh_id;
                                        obj['Device'] = angular.isUndefinedOrNull(meshProfiles[i].device) ? "" : meshProfiles[i].device;
                                        obj['MacAddress'] = angular.isUndefinedOrNull(meshProfiles[i].mac_addr) ? "" : meshProfiles[i].mac_addr;
                                        obj['Encryption'] = angular.isUndefinedOrNull(meshProfiles[i].encryption) ? "" : (meshProfiles[i].encryption.toLowerCase() === 'open' || meshProfiles[i].encryption.toLowerCase() === 'none') ? 'Open' : meshProfiles[i].encryption.toUpperCase()
                                        obj['RSSI'] = angular.isUndefinedOrNull(meshProfiles[i].rssi) ? "" : meshProfiles[i].rssi;
                                        obj['Score'] = angular.isUndefinedOrNull(meshProfiles[i].discovery_score) ? "": meshProfiles[i].discovery_score;
                                        obj['SelfHealing'] = angular.isUndefinedOrNull(meshProfiles[i].self_heal) ? "" : meshProfiles[i].self_heal === 0 ? 'Disable' : 'Enable';
                                        obj['SerialNumber'] = angular.isUndefinedOrNull(meshProfiles[i].serialNumber) ? "" : meshProfiles[i].serialNumber;
                                        obj['Channel'] = angular.isUndefinedOrNull(meshProfiles[i].channel) ? "" : meshProfiles[i].channel;
                                        $scope.responseArray.push(obj);
                                    }
                                } else {
                                    swal(objData.Message);
                                }
                            }    
                            $scope.availableMeshProfiles = $scope.responseArray;
                      });
                };
                $scope.saveMeterConfig = function () {
                    var saveConfig = {};
                      saveConfig = {   UtilityID: parseInt($scope.meterConfigurationDetails.MeterUtilityID),
                        CircuitID: parseInt($scope.meterConfigurationDetails.MeterCircuitID),
                        CertificationNumber: parseInt($scope.meterConfigurationDetails.MeterCertificationNumber),
                        MeterESN: $scope.meterConfigurationDetails.MeterESN
                    }
                      deviceService.setConfigDetails("MeterConfigurations", $scope.deviceID, $scope.meterConfigurationDetails.DeviceSerialNumber, 'MeterConfig', '', 'meter', saveConfig)
                          .then(function (objData) {
                            swal(objData);
                            $scope.meterConfigForm.$setPristine();
                            init();
                      });
                };

                $scope.saveAlarmsConfig = function() {
                    var saveConfig = {};
                    saveConfig = {
                        VoltageSagLine1: $scope.Alarms[0].Selected, VoltageSagLine2: $scope.Alarms[1].Selected,
                        VoltageSagLine3: $scope.Alarms[2].Selected, VoltageSwellLine1: $scope.Alarms[3].Selected,
                        VoltageSwellLine2: $scope.Alarms[4].Selected, VoltageSwellLine3: $scope.Alarms[5].Selected,
                        VoltageUnbalance: $scope.Alarms[6].Selected, VoltageCablelossLine1: $scope.Alarms[7].Selected,
                        VoltageCablelossLine2: $scope.Alarms[8].Selected, VoltageCablelossLine3: $scope.Alarms[9].Selected,
                        VoltageTHDOverLimitLine1: $scope.Alarms[10].Selected, VoltageTHDOverLimitLine2: $scope.Alarms[11].Selected,
                        VoltageTHDOverLimitLine3: $scope.Alarms[12].Selected, CurrentTHDOverLimitLine1: $scope.Alarms[13].Selected,
                        CurrentTHDOverLimitLine2: $scope.Alarms[14].Selected, CurrentTHDOverLimitLine3: $scope.Alarms[15].Selected,
                        PrimaryPowerUp: $scope.Alarms[16].Selected, PrimaryPowerDown: $scope.Alarms[17].Selected,
                        LongOutagedetection: $scope.Alarms[18].Selected, ShortOutagedetection: $scope.Alarms[19].Selected,
                        NonvolatileMemoryFailed: $scope.Alarms[20].Selected, Clockerrordetected: $scope.Alarms[21].Selected,
                        LowBatteryVoltage: $scope.Alarms[22].Selected, FlashMemoryFailed: $scope.Alarms[23].Selected,
                        Firmwareupgraded: $scope.Alarms[24].Selected, Demandreset: $scope.Alarms[25].Selected, 
                        TimeSynchronized: $scope.Alarms[26].Selected, Historylogcleared: $scope.Alarms[27].Selected, 
                        Coverremoval: $scope.Alarms[28].Selected, Terminalcoverremoval: $scope.Alarms[29].Selected, 
                        MeterDisconnected: $scope.Alarms[30].Selected, MeterConnected: $scope.Alarms[31].Selected, 
                        DemandresponseofimportactpwrkWplus: $scope.Alarms[32].Selected, DemandresponseofexportactpwrkWminus: $scope.Alarms[33].Selected,
                        DemandresponseofimportreactpwrkVarplus: $scope.Alarms[34].Selected, DemandresponseofexportreactpwrkVarminus: $scope.Alarms[35].Selected
                    };
                 
                    deviceService.setAlarmConfigDetails($scope.deviceID, $scope.meterConfigurationDetails.DeviceSerialNumber, 'meter', saveConfig)
                        .then(function (objData) {
                            swal(objData);
                            $scope.alarmsavebutton = true;
                            init();
                    });
                }; 
                $scope.saveBandwidthLimitationsConfig = function () {
                    var saveConfig = {};
                    let bandwidthModifiedFlag = 'N'
                    if(($scope.meterConfigurationDetails.BandwidthStatus != $scope.setPreviousMeterConfigurationDetails.BandwidthStatus || $scope.meterConfigurationDetails.DownloadBandwidth != $scope.setPreviousMeterConfigurationDetails.DownloadBandwidth || $scope.meterConfigurationDetails.UploadBandwidth != $scope.setPreviousMeterConfigurationDetails.UploadBandwidth) && $scope.deviceStatus === 'Registered') {
                        bandwidthModifiedFlag = 'Y';
                    } else {
                        bandwidthModifiedFlag = 'N';
                    }
                      saveConfig = {   Status: $scope.meterConfigurationDetails.BandwidthStatus === true ? "1" : "0",
                        DownloadBandwidth: $scope.meterConfigurationDetails.DownloadBandwidth,
                        UploadBandwidth: $scope.meterConfigurationDetails.UploadBandwidth,
                        BandwidthFlag: bandwidthModifiedFlag
                    }
                      deviceService.setConfigDetails("BandwidthLimitations" ,$scope.deviceID, $scope.meterConfigurationDetails.DeviceSerialNumber, 'BandwidthLimitations', '', 'Meter', saveConfig)
                          .then(function (objData) {
                                swal(objData);
                                init();
                                $scope.advancedBandwidthForm.$setPristine();
                      });
                };
                $scope.saveSystemSettingsConfig = function () {
                    var saveConfig = {};
                    saveConfig = {   SystemName: $scope.meterConfigurationDetails.SettingsSystemName,
                        Country: $scope.meterConfigurationDetails.SettingsCountry,
                        Timezone: $scope.meterConfigurationDetails.SettingsTimezone
                    }
                    deviceService.setConfigDetails("SystemSettingsConfigurations", $scope.deviceID, $scope.meterConfigurationDetails.DeviceSerialNumber, 'SystemSetting', '', 'meter', saveConfig)
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
                var ipV4RegStartIP = new RegExp('^192.168.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$');
                var ipV4RegSubnet = new RegExp('^255.255.255.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$');
                var pskRegex = /^[A-Za-z0-9^~!@#$%\^&*()_+={}|[\]\\:;"<>?,./]+(?:\s?[A-Za-z0-9^~!@#$%\^&*()_+={}|[\]\\:;"<>?,./]+)?$/;
                var meshidRegex = /^[A-Za-z0-9]+[A-Za-z0-9^!@#$%\^&*()_+={}|[\]\\;:?./]*(?:\s?[A-Za-z0-9^!@#$%\^&*()_+={}|[\]\\;:?./]*[A-Za-z0-9]+)?$/;
                var subnetrange = ["0", "00", "000", "128", "192", "224", "240", "248", "252" , "255"];
                var regMac = new RegExp(objCacheDetails.regEx.MAC_ID, "i");
                var regMac64 = /^([0-9a-fA-F]{2}[:]){7}([0-9a-fA-F]{2})$/;
                var nameRegex = /^[A-Za-z0-9^`~!@#$%\^&*()_+={}|[\]\\:';"<>?,./]+(?:\s?[A-Za-z0-9^`~!@#$%\^&*()_+={}|[\]\\:';"<>?,./]+)*$/;
                /**
                 *  @description
                 * Function to validate Configuration data
                 *
                 * @param field
                 * @return Nil

                 */
                $scope.focusValidate = function (field) {
                    if (field === 'transmitPower') {
                        if($scope.meterConfigurationDetails.FronthaulRadioTransmitPower) {
                                if(!containsSpace.test($scope.meterConfigurationDetails.FronthaulRadioTransmitPower)) {
                                    if ($scope.meterConfigurationDetails.FronthaulRadioTransmitPower === undefined ||
                                        $scope.meterConfigurationDetails.FronthaulRadioTransmitPower.trim().length === 0) {
                                        $scope.errorTransmitPowerMessage = 'Transmit Power is required!';
                                        $scope.errorTransmitPower = true;
                                        $scope.fronthaulRadioForm.transmitPower.$valid = false;
                                    } else if (!numberPattern.test($scope.meterConfigurationDetails.FronthaulRadioTransmitPower)) {
                                        $scope.errorTransmitPowerMessage = 'Invalid Transmit Power!';
                                        $scope.errorTransmitPower = true;
                                        $scope.fronthaulRadioForm.transmitPower.$valid = false;
                                    } else if ($scope.meterConfigurationDetails.FronthaulRadioTransmitPower <= 0 || $scope.meterConfigurationDetails.FronthaulRadioTransmitPower > $scope.transmitPower) {
                                        $scope.errorTransmitPowerMessage = 'Transmit Power value range should be from 1 to ' +$scope.transmitPower+'!';
                                        $scope.errorTransmitPower = true;
                                        $scope.fronthaulRadioForm.transmitPower.$valid = false;
                                    }  else {
                                        $scope.errorTransmitPower = false;
                                        $scope.fronthaulRadioForm.transmitPower.$valid = true;
                                    }
                                } else {
                                    $scope.errorTransmitPowerMessage = 'Invalid Transmit Power!';
                                    $scope.errorTransmitPower = true;
                                    $scope.fronthaulRadioForm.transmitPower.$valid = false;
                                }
                        } else {
                            $scope.errorTransmitPowerMessage = 'Transmit Power is required!';
                            $scope.errorTransmitPower = true;
                            $scope.fronthaulRadioForm.transmitPower.$valid = false;
                        }
                    } else if (field === 'startAddress') {
                            $scope.subnetFirst= '';
                            $scope.subnetLast= '';
                        if ($scope.meterConfigurationDetails.FronthaulDHCPStartAddress === undefined ||
                            $scope.meterConfigurationDetails.FronthaulDHCPStartAddress.trim().length === 0) {
                            $scope.errorStartAddressMessage = 'Start Address is required!';
                            $scope.errorStartAddress = true;
                            $scope.fronthaulDHCPForm.startAddress.$valid = false;
                        } else if (!ipV4Reg.exec($scope.meterConfigurationDetails.FronthaulDHCPStartAddress)) {
                            $scope.errorStartAddressMessage = 'Invalid Start Address!';
                            $scope.errorStartAddress = true;
                            $scope.fronthaulDHCPForm.startAddress.$valid = false;
                        } else if (!ipV4RegStartIP.exec($scope.meterConfigurationDetails.FronthaulDHCPStartAddress)) {
                            $scope.errorStartAddressMessage = 'Start Address should start with 192.168.x.x!';
                            $scope.errorStartAddress = true;
                            $scope.fronthaulDHCPForm.startAddress.$valid = false;
                        } else if ($scope.meterConfigurationDetails.FronthaulDHCPEndAddress !== undefined && !!ipV4RegStartIP.exec($scope.meterConfigurationDetails.FronthaulDHCPEndAddress)) {
                            if ($scope.atoi($scope.meterConfigurationDetails.FronthaulDHCPStartAddress) >= $scope.atoi($scope.meterConfigurationDetails.FronthaulDHCPEndAddress)) {
                                    $scope.errorStartAddressMessage = 'Start Address should be less than End Address';
                                    $scope.errorStartAddress = true;
                                    $scope.fronthaulDHCPForm.startAddress.$valid = false;
                                } else if ($scope.meterConfigurationDetails.FronthaulDHCPDefaultGateway && $scope.subnetCIDR) {
                                    if (!!ipV4Reg.exec($scope.meterConfigurationDetails.FronthaulDHCPDefaultGateway) && !!ipV4RegStartIP.exec($scope.meterConfigurationDetails.FronthaulDHCPDefaultGateway)) {     
                                        subnetfirst();getLastHost();
                                            if ($scope.atoi($scope.meterConfigurationDetails.FronthaulDHCPStartAddress) < $scope.atoi($scope.subnetFirst) ||
                                                $scope.atoi($scope.meterConfigurationDetails.FronthaulDHCPStartAddress) > $scope.atoi($scope.subnetLast)) {
                                                $scope.errorStartAddressMessage = 'Start Address should be in the range from ' +$scope.subnetFirst+ ' to '+$scope.subnetLast;
                                                $scope.errorStartAddress = true;
                                                $scope.fronthaulDHCPForm.startAddress.$valid = false;
                                            } else {
                                                $scope.errorStartAddress = false;
                                                $scope.fronthaulDHCPForm.startAddress.$valid = true;
                                                    if ($scope.atoi($scope.meterConfigurationDetails.FronthaulDHCPEndAddress) < $scope.atoi($scope.subnetFirst) ||
                                                        $scope.atoi($scope.meterConfigurationDetails.FronthaulDHCPEndAddress) > $scope.atoi($scope.subnetLast)) {
                                                            $scope.errorEndAddressMessage = 'End Address should be in the range from ' +$scope.subnetFirst+ ' to '+$scope.subnetLast;
                                                            $scope.errorEndAddress = true;
                                                            $scope.fronthaulDHCPForm.endAddress.$valid = false;
                                                    } else {
                                                        $scope.errorEndAddress = false;
                                                        $scope.fronthaulDHCPForm.endAddress.$valid = true;
                                                    }
                                            }
                                    } else {
                                    $scope.errorStartAddress = false;
                                    $scope.fronthaulDHCPForm.startAddress.$valid = true;
                                    $scope.errorEndAddress = false;
                                    $scope.fronthaulDHCPForm.endAddress.$valid = true;
                                    }
                                } else {
                                    $scope.errorStartAddress = false;
                                    $scope.fronthaulDHCPForm.startAddress.$valid = true;
                                    $scope.errorEndAddress = false;
                                    $scope.fronthaulDHCPForm.endAddress.$valid = true;
                                }
                        } else if ($scope.meterConfigurationDetails.FronthaulDHCPDefaultGateway && $scope.subnetCIDR) {
                            if (!!ipV4Reg.exec($scope.meterConfigurationDetails.FronthaulDHCPDefaultGateway) && !!ipV4RegStartIP.exec($scope.meterConfigurationDetails.FronthaulDHCPDefaultGateway)) {
                                subnetfirst();getLastHost();
                                if ($scope.atoi($scope.meterConfigurationDetails.FronthaulDHCPStartAddress) < $scope.atoi($scope.subnetFirst) ||
                                        $scope.atoi($scope.meterConfigurationDetails.FronthaulDHCPStartAddress) > $scope.atoi($scope.subnetLast)) {
                                        $scope.errorStartAddressMessage = 'Start Address should be in the range from ' +$scope.subnetFirst+ ' to '+$scope.subnetLast;
                                        $scope.errorStartAddress = true;
                                        $scope.fronthaulDHCPForm.startAddress.$valid = false;
                                } else {
                                        $scope.errorStartAddress = false;
                                        $scope.fronthaulDHCPForm.startAddress.$valid = true;
                                }
                            }
                        } 
                        else {
                          $scope.errorStartAddress = false;
                          $scope.fronthaulDHCPForm.startAddress.$valid = true;
                        }
                    } else if (field === 'endAddress') {
                        $scope.subnetFirst= '';
                        $scope.subnetLast= '';
                        if ($scope.meterConfigurationDetails.FronthaulDHCPEndAddress === undefined ||
                            $scope.meterConfigurationDetails.FronthaulDHCPEndAddress.trim().length === 0) {
                            $scope.errorEndAddressMessage = 'End Address is required!';
                            $scope.errorEndAddress = true;
                            $scope.fronthaulDHCPForm.endAddress.$valid = false;
                        } else if (!ipV4Reg.exec($scope.meterConfigurationDetails.FronthaulDHCPEndAddress)) {
                            $scope.errorEndAddressMessage = 'Invalid End Address!';
                            $scope.errorEndAddress = true;
                            $scope.fronthaulDHCPForm.endAddress.$valid = false;
                        } else if (!ipV4RegStartIP.exec($scope.meterConfigurationDetails.FronthaulDHCPEndAddress)) {
                            $scope.errorEndAddressMessage = 'End Address should start with 192.168.x.x!';
                            $scope.errorEndAddress = true;
                            $scope.fronthaulDHCPForm.endAddress.$valid = false;
                        } else if ($scope.meterConfigurationDetails.FronthaulDHCPStartAddress !== undefined && !!ipV4RegStartIP.exec($scope.meterConfigurationDetails.FronthaulDHCPStartAddress)) {
                            if ($scope.atoi($scope.meterConfigurationDetails.FronthaulDHCPStartAddress) >= $scope.atoi($scope.meterConfigurationDetails.FronthaulDHCPEndAddress)) {
                                    $scope.errorEndAddressMessage = 'End Address should be greater than Start Address';
                                    $scope.errorEndAddress = true;
                                    $scope.fronthaulDHCPForm.endAddress.$valid= false;
                                } else if ($scope.meterConfigurationDetails.FronthaulDHCPDefaultGateway && $scope.subnetCIDR) {
                                    if (!!ipV4Reg.exec($scope.meterConfigurationDetails.FronthaulDHCPDefaultGateway) && !!ipV4RegStartIP.exec($scope.meterConfigurationDetails.FronthaulDHCPDefaultGateway)) {     
                                        subnetfirst();getLastHost();
                                            if ($scope.atoi($scope.meterConfigurationDetails.FronthaulDHCPEndAddress) < $scope.atoi($scope.subnetFirst) ||
                                                $scope.atoi($scope.meterConfigurationDetails.FronthaulDHCPEndAddress) > $scope.atoi($scope.subnetLast)) {
                                                $scope.errorEndAddressMessage = 'End Address should be in the range from ' +$scope.subnetFirst+ ' to '+$scope.subnetLast;
                                                $scope.errorEndAddress = true;
                                                $scope.fronthaulDHCPForm.endAddress.$valid = false;
                                            } else {
                                                $scope.errorEndAddress = false;
                                                $scope.fronthaulDHCPForm.endAddress.$valid = true;
                                                if ($scope.atoi($scope.meterConfigurationDetails.FronthaulDHCPStartAddress) < $scope.atoi($scope.subnetFirst) ||
                                                        $scope.atoi($scope.meterConfigurationDetails.FronthaulDHCPStartAddress) > $scope.atoi($scope.subnetLast)) {
                                                        $scope.errorStartAddressMessage = 'Start Address should be in the range from ' +$scope.subnetFirst+ ' to '+$scope.subnetLast;
                                                        $scope.errorStartAddress = true;
                                                        $scope.fronthaulDHCPForm.startAddress.$valid = false;
                                                } else {
                                                    $scope.errorStartAddress = false;
                                                    $scope.fronthaulDHCPForm.startAddress.$valid = true;
                                                }
                                            }
                                    } else {
                                        $scope.errorEndAddress = false;
                                        $scope.fronthaulDHCPForm.endAddress.$valid = true;
                                        $scope.errorStartAddress = false;
                                        $scope.fronthaulDHCPForm.startAddress.$valid = true;
                                    }
                                } else {
                                    $scope.errorEndAddress = false;
                                    $scope.fronthaulDHCPForm.endAddress.$valid = true;
                                    $scope.errorStartAddress = false;
                                    $scope.fronthaulDHCPForm.startAddress.$valid= true;
                                }
                        } else if ($scope.meterConfigurationDetails.FronthaulDHCPDefaultGateway && $scope.subnetCIDR) {
                            if (!!ipV4Reg.exec($scope.meterConfigurationDetails.FronthaulDHCPDefaultGateway) && !!ipV4RegStartIP.exec($scope.meterConfigurationDetails.FronthaulDHCPDefaultGateway)) {
                                subnetfirst();getLastHost();
                                if ($scope.atoi($scope.meterConfigurationDetails.FronthaulDHCPEndAddress) < $scope.atoi($scope.subnetFirst) ||
                                        $scope.atoi($scope.meterConfigurationDetails.FronthaulDHCPEndAddress) > $scope.atoi($scope.subnetLast)) {
                                        $scope.errorEndAddressMessage = 'End Address should be in the range from ' +$scope.subnetFirst+ ' to '+$scope.subnetLast;
                                        $scope.errorEndAddress = true;
                                        $scope.fronthaulDHCPForm.endAddress.$valid = false;
                                } else {
                                        $scope.errorEndAddress = false;
                                        $scope.fronthaulDHCPForm.endAddress.$valid = true;
                                }
                            }
                        }  else {
                          $scope.errorEndAddress = false;
                          $scope.fronthaulDHCPForm.endAddress.$valid = true;
                        }
                    } else if (field === 'subnetMaskDHCP') {
                            $scope.subnetFirst= '';
                            $scope.subnetLast= '';
                            $scope.subnetCIDR = '';
                        if ($scope.meterConfigurationDetails.FronthaulDHCPSubnetMask === undefined ||
                            $scope.meterConfigurationDetails.FronthaulDHCPSubnetMask.trim().length === 0) {
                            $scope.errorSubnetMaskDHCPMessage = 'Subnet Mask is required!';
                            $scope.errorSubnetMaskDHCP = true;
                            $scope.fronthaulDHCPForm.subnetMask.$valid = false;
                        } else if (!ipV4Reg.exec($scope.meterConfigurationDetails.FronthaulDHCPSubnetMask)) {
                            $scope.errorSubnetMaskDHCPMessage = 'Invalid Subnet Mask!';
                            $scope.errorSubnetMaskDHCP = true;
                            $scope.fronthaulDHCPForm.subnetMask.$valid = false;
                        } else if (!ipV4RegSubnet.exec($scope.meterConfigurationDetails.FronthaulDHCPSubnetMask)) {
                            $scope.errorSubnetMaskDHCPMessage = 'Subnet Mask should start with 255.255.255.x!';
                            $scope.errorSubnetMaskDHCP = true;
                            $scope.fronthaulDHCPForm.subnetMask.$valid = false;
                        } else if (!subnetrange.includes(($scope.meterConfigurationDetails.FronthaulDHCPSubnetMask).split(".")[3])) {
                            $scope.errorSubnetMaskDHCPMessage = 'Last octet of Subnet Mask should contain 0/128/192/224/240/248/252/255';
                            $scope.errorSubnetMaskDHCP = true;
                            $scope.fronthaulDHCPForm.subnetMask.$valid = false;
                        } else if ($scope.meterConfigurationDetails.FronthaulDHCPDefaultGateway) {
                            $scope.subnetCIDR = getsubnetcidr($scope.meterConfigurationDetails.FronthaulDHCPSubnetMask);
                            if (!!ipV4Reg.exec($scope.meterConfigurationDetails.FronthaulDHCPDefaultGateway) && !!ipV4RegStartIP.exec($scope.meterConfigurationDetails.FronthaulDHCPDefaultGateway)) {
                                subnetfirst();getLastHost();
                                $scope.errorSubnetMaskDHCP = false;
                                $scope.fronthaulDHCPForm.subnetMask.$valid = true;
                                    if($scope.meterConfigurationDetails.FronthaulDHCPStartAddress) {
                                        $scope.focusValidate('startAddress');
                                    }
                                    if($scope.meterConfigurationDetails.FronthaulDHCPEndAddress) {
                                        $scope.focusValidate('endAddress');
                                    }
                            } else {
                                $scope.errorSubnetMaskDHCP = false;
                                $scope.fronthaulDHCPForm.subnetMask.$valid = true;
                            }
                        } else {
                          $scope.errorSubnetMaskDHCP = false;
                          $scope.fronthaulDHCPForm.subnetMask.$valid = true;
                          $scope.subnetCIDR = getsubnetcidr($scope.meterConfigurationDetails.FronthaulDHCPSubnetMask);
                        }
                    } else if (field === 'primaryDNSDHCP') {
                        $scope.ipAddressValidation($scope.meterConfigurationDetails.FronthaulDHCPPrimaryDNS, 'Primary DNS');
                        $scope.errorPrimaryDNSDHCP = $scope.errorIpAdd;
                        $scope.errorPrimaryDNSDHCPMessage = $scope.IpAddMessage;
                        $scope.fronthaulDHCPForm.primaryDNS.$valid = $scope.ipValid;
                    } else if (field === 'defaultGatewayDHCP') {
                            $scope.subnetFirst= '';
                            $scope.subnetLast= '';
                            $scope.subnetCIDR = '';
                        if ($scope.meterConfigurationDetails.FronthaulDHCPDefaultGateway === undefined ||
                            $scope.meterConfigurationDetails.FronthaulDHCPDefaultGateway.trim().length === 0) {
                            $scope.errorDefaultGatewayDHCPMessage = 'Default Gateway is required!';
                            $scope.errorDefaultGatewayDHCP = true;
                            $scope.fronthaulDHCPForm.defaultGateway.$valid = false;
                        } else if (!ipV4Reg.exec($scope.meterConfigurationDetails.FronthaulDHCPDefaultGateway)) {
                            $scope.errorDefaultGatewayDHCPMessage = 'Invalid Default Gateway!';
                            $scope.errorDefaultGatewayDHCP = true;
                            $scope.fronthaulDHCPForm.defaultGateway.$valid = false;
                        } else if (!ipV4RegStartIP.exec($scope.meterConfigurationDetails.FronthaulDHCPDefaultGateway)) {
                            $scope.errorDefaultGatewayDHCPMessage = 'Default Gateway should start with 192.168.x.x!';
                            $scope.errorDefaultGatewayDHCP = true;
                            $scope.fronthaulDHCPForm.defaultGateway.$valid = false;
                        } else if ($scope.meterConfigurationDetails.FronthaulDHCPSubnetMask) {
                                subnetfirst();getLastHost();
                            if (!!ipV4Reg.exec($scope.meterConfigurationDetails.FronthaulDHCPSubnetMask) && !!ipV4RegSubnet.exec($scope.meterConfigurationDetails.FronthaulDHCPSubnetMask) && !!subnetrange.includes(($scope.meterConfigurationDetails.FronthaulDHCPSubnetMask).split(".")[3])) {
                                $scope.subnetCIDR = getsubnetcidr($scope.meterConfigurationDetails.FronthaulDHCPSubnetMask);
                                $scope.errorDefaultGatewayDHCP = false;
                                $scope.fronthaulDHCPForm.defaultGateway.$valid = true;
                                if($scope.meterConfigurationDetails.FronthaulDHCPStartAddress) {
                                    $scope.focusValidate('startAddress');
                                }
                                if($scope.meterConfigurationDetails.FronthaulDHCPEndAddress) {
                                    $scope.focusValidate('endAddress');
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
                    } else if (field === 'secondaryDNSDHCP') {
                        $scope.ipAddressValidation($scope.meterConfigurationDetails.FronthaulDHCPSecondaryDNS, 'Secondary DNS');
                        $scope.errorSecondaryDNSDHCP = $scope.errorIpAdd;
                        $scope.errorSecondaryDNSDHCPMessage = $scope.IpAddMessage;
                        $scope.fronthaulDHCPForm.secondaryDNS.$valid = $scope.ipValid;
                    } else if (field === 'meshIDPrim') {
                        if($scope.meterConfigurationDetails.FronthaulPrimMeshID) {
                            if(!containsSpace.test($scope.meterConfigurationDetails.FronthaulPrimMeshID)) {
                                    if ($scope.meterConfigurationDetails.FronthaulPrimMeshID === undefined || $scope.meterConfigurationDetails.FronthaulPrimMeshID.trim().length === 0) {
                                        $scope.errorMeshIDPrimMessage = 'Mesh ID is required!';
                                        $scope.errorMeshIDPrim = true;
                                        $scope.fronthaulMeshForm.meshID.$valid = false;
                                    } else if (!meshidRegex.test($scope.meterConfigurationDetails.FronthaulPrimMeshID)) {
                                        $scope.errorMeshIDPrimMessage = 'Invalid Mesh ID!';
                                        $scope.errorMeshIDPrim = true;
                                        $scope.fronthaulMeshForm.meshID.$valid = false;
                                    } else if ($scope.meterConfigurationDetails.FronthaulPrimMeshID.length < 8 || $scope.meterConfigurationDetails.FronthaulPrimMeshID.length > 32) {
                                        $scope.errorMeshIDPrimMessage = 'Length of Mesh ID range should be from 8 to 32!';
                                        $scope.errorMeshIDPrim = true;
                                        $scope.fronthaulMeshForm.meshID.$valid = false;
                                    } else if ($scope.meterConfigurationDetails.FronthaulSecMeshID) {
                                        if ($scope.meterConfigurationDetails.FronthaulPrimMeshID.toLowerCase() === $scope.meterConfigurationDetails.FronthaulSecMeshID.toLowerCase()) {
                                            $scope.errorMeshIDPrimMessage = 'Mesh ID name cannot be same!';
                                            $scope.errorMeshIDPrim = true;
                                            $scope.fronthaulMeshForm.meshID.$valid = false;
                                        } else {
                                            $scope.errorMeshIDPrim = false;
                                            $scope.fronthaulMeshForm.meshID.$valid = true;
                                            if (!!meshidRegex.test($scope.meterConfigurationDetails.FronthaulSecMeshID) && !($scope.meterConfigurationDetails.FronthaulSecMeshID.length < 8 || $scope.meterConfigurationDetails.FronthaulSecMeshID.length > 32)) {
                                                $scope.errorMeshIDSecMessage = '';
                                                $scope.errorMeshIDSec = false;
                                                $scope.fronthaulMeshForm.meshIDSec.$valid = true;
                                            }
                                        }
                                    } else {
                                        $scope.errorMeshIDPrim = false;
                                        $scope.fronthaulMeshForm.meshID.$valid = true;
                                    } 
                                } else {
                                    $scope.errorMeshIDPrimMessage = 'Invalid Mesh ID!';
                                    $scope.errorMeshIDPrim = true;
                                    $scope.fronthaulMeshForm.meshID.$valid = false;
                                }
                        } else {
                            $scope.errorMeshIDPrimMessage = 'Mesh ID is required!';
                            $scope.errorMeshIDPrim = true;
                            $scope.fronthaulMeshForm.meshID.$valid = false;
                        }    
                    } else if (field === 'pskPrim') {
                        if($scope.meterConfigurationDetails.FronthaulPrimPresharedKey) {
                            if(!containsSpace.test($scope.meterConfigurationDetails.FronthaulPrimPresharedKey)) {
                                    if ($scope.meterConfigurationDetails.FronthaulPrimPresharedKey === undefined || $scope.meterConfigurationDetails.FronthaulPrimPresharedKey.trim().length === 0) {
                                        $scope.errorPreSharedKeyPrimMessage = 'Pre shared key is required!';
                                        $scope.errorPreSharedKeyPrim = true;
                                        $scope.fronthaulMeshForm.preSharedKey.$valid = false;
                                    } else if (!pskRegex.test($scope.meterConfigurationDetails.FronthaulPrimPresharedKey)) {
                                        $scope.errorPreSharedKeyPrimMessage = 'Invalid Pre shared key!';
                                        $scope.errorPreSharedKeyPrim = true;
                                        $scope.fronthaulMeshForm.preSharedKey.$valid = false;
                                    } else if ($scope.meterConfigurationDetails.FronthaulPrimPresharedKey.length < 8 || $scope.meterConfigurationDetails.FronthaulPrimPresharedKey.length > 63) {
                                        $scope.errorPreSharedKeyPrimMessage = 'Length of Pre shared key range should be from 8 to 63!';
                                        $scope.errorPreSharedKeyPrim = true;
                                        $scope.fronthaulMeshForm.preSharedKey.$valid = false;
                                    } else {
                                        $scope.errorPreSharedKeyPrim = false;
                                        $scope.fronthaulMeshForm.preSharedKey.$valid = true;
                                    }   
                                } else {
                                    $scope.errorPreSharedKeyPrimMessage = 'Invalid Pre shared key!';
                                    $scope.errorPreSharedKeyPrim = true;
                                    $scope.fronthaulMeshForm.preSharedKey.$valid = false;
                                }
                        } else {
                            $scope.errorPreSharedKeyPrimMessage = 'Pre shared key is required!';
                            $scope.errorPreSharedKeyPrim = true;
                            $scope.fronthaulMeshForm.preSharedKey.$valid = false;
                        }
                    } else if (field === 'meshIDSec') {
                        if($scope.meterConfigurationDetails.FronthaulSecMeshID) {
                            if(!containsSpace.test($scope.meterConfigurationDetails.FronthaulSecMeshID)) {
                                    if ($scope.meterConfigurationDetails.FronthaulSecMeshID === undefined || $scope.meterConfigurationDetails.FronthaulSecMeshID.trim().length === 0) {
                                        $scope.errorMeshIDSecMessage = 'Mesh ID is required!';
                                        $scope.errorMeshIDSec = true;
                                        $scope.fronthaulMeshForm.meshIDSec.$valid = false;
                                    } else if (!meshidRegex.test($scope.meterConfigurationDetails.FronthaulSecMeshID)) {
                                        $scope.errorMeshIDSecMessage = 'Invalid Mesh ID!';
                                        $scope.errorMeshIDSec = true;
                                        $scope.fronthaulMeshForm.meshIDSec.$valid = false;
                                    } else if ($scope.meterConfigurationDetails.FronthaulSecMeshID.length < 8 || $scope.meterConfigurationDetails.FronthaulSecMeshID.length > 32) {
                                        $scope.errorMeshIDSecMessage = 'Length of Mesh ID range should be from 8 to 32!';
                                        $scope.errorMeshIDSec = true;
                                        $scope.fronthaulMeshForm.meshIDSec.$valid = false;
                                    } else if ($scope.meterConfigurationDetails.FronthaulPrimMeshID) {
                                        if ($scope.meterConfigurationDetails.FronthaulPrimMeshID.toLowerCase() === $scope.meterConfigurationDetails.FronthaulSecMeshID.toLowerCase()) {
                                            $scope.errorMeshIDSecMessage = 'Mesh ID name cannot be same!';
                                            $scope.errorMeshIDSec = true;
                                            $scope.fronthaulMeshForm.meshIDSec.$valid = false;
                                        } else {
                                            $scope.errorMeshIDSec = false;
                                            $scope.fronthaulMeshForm.meshIDSec.$valid = true;
                                            if (!!meshidRegex.test($scope.meterConfigurationDetails.FronthaulPrimMeshID) && !($scope.meterConfigurationDetails.FronthaulPrimMeshID.length < 8 || $scope.meterConfigurationDetails.FronthaulPrimMeshID.length > 32)) {
                                                $scope.errorMeshIDPrimMessage = '';
                                                $scope.errorMeshIDPrim = false;
                                                $scope.fronthaulMeshForm.meshID.$valid = true;
                                            }
                                        }
                                    }  else {
                                        $scope.errorMeshIDSec = false;
                                        $scope.fronthaulMeshForm.meshIDSec.$valid = true;
                                    }     
                                } else {
                                    $scope.errorMeshIDSecMessage = 'Invalid Mesh ID!';
                                    $scope.errorMeshIDSec = true;
                                    $scope.fronthaulMeshForm.meshIDSec.$valid = false;
                                }
                        } else {
                            $scope.errorMeshIDSecMessage = 'Mesh ID is required!';
                            $scope.errorMeshIDSec = true;
                            $scope.fronthaulMeshForm.meshIDSec.$valid = false;
                        }
                    } else if (field === 'preSharedKeySec') {
                        if($scope.meterConfigurationDetails.FronthaulSecPresharedKey) {
                            if(!containsSpace.test($scope.meterConfigurationDetails.FronthaulSecPresharedKey)) {
                                    if ($scope.meterConfigurationDetails.FronthaulSecPresharedKey === undefined || $scope.meterConfigurationDetails.FronthaulSecPresharedKey.trim().length === 0) {
                                        $scope.errorPreSharedKeySecMessage = 'Pre shared key is required!';
                                        $scope.errorPreSharedKeySec = true;
                                        $scope.fronthaulMeshForm.preSharedKeySec.$valid = false;
                                    } else if (!pskRegex.test($scope.meterConfigurationDetails.FronthaulSecPresharedKey)) {
                                        $scope.errorPreSharedKeySecMessage = 'Invalid Pre shared key';
                                        $scope.errorPreSharedKeySec = true;
                                        $scope.fronthaulMeshForm.preSharedKeySec.$valid = false;
                                    } else if ($scope.meterConfigurationDetails.FronthaulSecPresharedKey.length < 8 || $scope.meterConfigurationDetails.FronthaulSecPresharedKey.length > 63) {
                                        $scope.errorPreSharedKeySecMessage = 'Length of Pre shared key range should be from 8 to 63!';
                                        $scope.errorPreSharedKeySec = true;
                                        $scope.fronthaulMeshForm.preSharedKeySec.$valid = false;
                                    } else {
                                        $scope.errorPreSharedKeySec = false;
                                        $scope.fronthaulMeshForm.preSharedKeySec.$valid = true;
                                    }   
                                } else {
                                    $scope.errorPreSharedKeySecMessage = 'Invalid Pre shared key';
                                    $scope.errorPreSharedKeySec = true;
                                    $scope.fronthaulMeshForm.preSharedKeySec.$valid = false;
                                }
                        } else {
                            $scope.errorPreSharedKeySecMessage = 'Pre shared key is required!';
                            $scope.errorPreSharedKeySec = true;
                            $scope.fronthaulMeshForm.preSharedKeySec.$valid = false;
                        }
                    } else if (field === 'macAddressPrim') {
                        $scope.meterConfigurationDetails.FronthaulPrimMacAddress = angular.isUndefinedOrNull($scope.meterConfigurationDetails.FronthaulPrimMacAddress) ? $scope.meterConfigurationDetails.FronthaulPrimMacAddress : $scope.meterConfigurationDetails.FronthaulPrimMacAddress.toLowerCase();
                        if($scope.meterConfigurationDetails.FronthaulPrimMacAddress) {
                            if(!containsSpace.test($scope.meterConfigurationDetails.FronthaulPrimMacAddress)) {
                                    if ($scope.meterConfigurationDetails.FronthaulPrimMacAddress === undefined || $scope.meterConfigurationDetails.FronthaulPrimMacAddress.trim().length === 0) {
                                        $scope.errorMacAddressPrimMessage = 'Mac Address is required!';
                                        $scope.errorMacAddressPrim = true;
                                        $scope.fronthaulMeshForm.macAddress.$valid = false;
                                    } else if (!(regMac.test($scope.meterConfigurationDetails.FronthaulPrimMacAddress) || regMac64.test($scope.meterConfigurationDetails.FronthaulPrimMacAddress))) {
                                        $scope.errorMacAddressPrimMessage = 'Invalid MAC Address!';
                                        $scope.errorMacAddressPrim = true;
                                        $scope.fronthaulMeshForm.macAddress.$valid = false;
                                    } else if ($scope.meterConfigurationDetails.FronthaulSecMACAddress) {
                                        if ($scope.meterConfigurationDetails.FronthaulPrimMacAddress === $scope.meterConfigurationDetails.FronthaulSecMACAddress) {
                                            $scope.errorMacAddressPrimMessage = 'Primary and Secondary MAC Address should not be same!';
                                            $scope.errorMacAddressPrim = true;
                                            $scope.fronthaulMeshForm.macAddress.$valid = false;
                                        } else {
                                            $scope.errorMacAddressPrim = false;
                                            $scope.fronthaulMeshForm.macAddress.$valid = true;
                                            if (!(regMac.test($scope.meterConfigurationDetails.FronthaulSecMACAddress) && regMac64.test($scope.meterConfigurationDetails.FronthaulSecMACAddress))) {
                                                $scope.errorMACAddressSecMessage = '';
                                                $scope.errorMACAddressSec = false;
                                                $scope.fronthaulMeshForm.macAddressSec.$valid = true;
                                            }
                                        }
                                    } else {
                                        $scope.errorMacAddressPrim = false;
                                        $scope.fronthaulMeshForm.macAddress.$valid = true;
                                    }   
                                } else {
                                    $scope.errorMacAddressPrimMessage = 'Invalid Mac Address';
                                    $scope.errorMacAddressPrim = true;
                                    $scope.fronthaulMeshForm.macAddress.$valid = false;
                                }
                        } else {
                            $scope.errorMacAddressPrimMessage = 'Mac Address is required!';
                            $scope.errorMacAddressPrim = true;
                            $scope.fronthaulMeshForm.macAddress.$valid = false;
                        }
                    } else if (field === 'serialNumberPrim') {
                        if($scope.meterConfigurationDetails.FronthaulPrimSerialNumber) {
                            if(!containsSpace.test($scope.meterConfigurationDetails.FronthaulPrimSerialNumber)) {
                                    if ($scope.meterConfigurationDetails.FronthaulPrimSerialNumber === undefined || $scope.meterConfigurationDetails.FronthaulPrimSerialNumber.trim().length === 0) {
                                        $scope.errorSerialNumberPrimMessage = 'Serial Number is required!';
                                        $scope.errorSerialNumberPrim = true;
                                        $scope.fronthaulMeshForm.serialNumber.$valid = false;
                                    } else if (!pattern.test($scope.meterConfigurationDetails.FronthaulPrimSerialNumber)) {
                                        $scope.errorSerialNumberPrimMessage = 'Invalid Serial Number!';
                                        $scope.errorSerialNumberPrim = true;
                                        $scope.fronthaulMeshForm.serialNumber.$valid = false;
                                    } else if ($scope.meterConfigurationDetails.FronthaulPrimSerialNumber.length < 10 || $scope.meterConfigurationDetails.FronthaulPrimSerialNumber.length > 25) {
                                        $scope.errorSerialNumberPrimMessage = 'Length of Serial Number range should be from 10 to 25!';
                                        $scope.errorSerialNumberPrim = true;
                                        $scope.fronthaulMeshForm.serialNumber.$valid = false;
                                    } else if ($scope.meterConfigurationDetails.FronthaulSecSerialNumber) {
                                        if ($scope.meterConfigurationDetails.FronthaulPrimSerialNumber === $scope.meterConfigurationDetails.FronthaulSecSerialNumber) {
                                            $scope.errorSerialNumberPrimMessage = 'Primary and Secondary Serial Number should not be same!';
                                            $scope.errorSerialNumberPrim = true;
                                            $scope.fronthaulMeshForm.serialNumber.$valid = false;
                                        } else {
                                            $scope.errorSerialNumberPrim = false;
                                            $scope.fronthaulMeshForm.serialNumber.$valid = true;
                                            if (!!pattern.test($scope.meterConfigurationDetails.FronthaulSecSerialNumber) && !($scope.meterConfigurationDetails.FronthaulSecSerialNumber.length < 10 || $scope.meterConfigurationDetails.FronthaulSecSerialNumber.length > 25)) {
                                                $scope.errorSerialNumberSecMessage = '';
                                                $scope.errorSerialNumberSec = false;
                                                $scope.fronthaulMeshForm.serialNumberSec.$valid = true;
                                            }
                                        }
                                    } else {
                                        $scope.errorSerialNumberPrim = false;
                                        $scope.fronthaulMeshForm.serialNumber.$valid = true;
                                    }   
                                } else {
                                    $scope.errorSerialNumberPrimMessage = 'Invalid Serial Number';
                                    $scope.errorSerialNumberPrim = true;
                                    $scope.fronthaulMeshForm.serialNumber.$valid = false;
                                }
                        } else {
                            $scope.errorSerialNumberPrimMessage = 'Serial Number is required!';
                            $scope.errorSerialNumberPrim = true;
                            $scope.fronthaulMeshForm.serialNumber.$valid = false;
                        }
                    } else if (field === 'macAddressSec') {
                        $scope.meterConfigurationDetails.FronthaulSecMACAddress = angular.isUndefinedOrNull($scope.meterConfigurationDetails.FronthaulSecMACAddress) ? $scope.meterConfigurationDetails.FronthaulSecMACAddress : $scope.meterConfigurationDetails.FronthaulSecMACAddress.toLowerCase();
                        if($scope.meterConfigurationDetails.FronthaulSecMACAddress) {
                            if(!containsSpace.test($scope.meterConfigurationDetails.FronthaulSecMACAddress)) {
                                    if ($scope.meterConfigurationDetails.FronthaulSecMACAddress === undefined || $scope.meterConfigurationDetails.FronthaulSecMACAddress.trim().length === 0) {
                                        $scope.errorMACAddressSecMessage = 'Mac Address is required!';
                                        $scope.errorMACAddressSec = true;
                                        $scope.fronthaulMeshForm.macAddressSec.$valid = false;
                                    } else if (!(regMac.test($scope.meterConfigurationDetails.FronthaulSecMACAddress) || regMac64.test($scope.meterConfigurationDetails.FronthaulSecMACAddress))) {
                                        $scope.errorMACAddressSecMessage = 'Invalid MAC Address!';
                                        $scope.errorMACAddressSec = true;
                                        $scope.fronthaulMeshForm.macAddressSec.$valid = false;
                                    } else if ($scope.meterConfigurationDetails.FronthaulPrimMacAddress) {
                                        if ($scope.meterConfigurationDetails.FronthaulPrimMacAddress === $scope.meterConfigurationDetails.FronthaulSecMACAddress) {
                                            $scope.errorMACAddressSecMessage = 'Primary and Secondary MAC ID should not be same!';
                                            $scope.errorMACAddressSec = true;
                                            $scope.fronthaulMeshForm.macAddressSec.$valid = false;
                                        } else {
                                            $scope.errorMACAddressSec = false;
                                            $scope.fronthaulMeshForm.macAddressSec.$valid = true;
                                            if (!(regMac.test($scope.meterConfigurationDetails.FronthaulPrimMacAddress) && regMac64.test($scope.meterConfigurationDetails.FronthaulPrimMacAddress))) {
                                                $scope.errorMacAddressPrimMessage = '';
                                                $scope.errorMacAddressPrim = false;
                                                $scope.fronthaulMeshForm.macAddress.$valid = true;
                                            }
                                        }
                                    } else {
                                        $scope.errorMACAddressSec = false;
                                        $scope.fronthaulMeshForm.macAddressSec.$valid = true;
                                    }   
                                } else {
                                    $scope.errorMACAddressSecMessage = 'Invalid Mac Address';
                                    $scope.errorMACAddressSec = true;
                                    $scope.fronthaulMeshForm.macAddressSec.$valid = false;
                                }
                        } else {
                            $scope.errorMACAddressSecMessage = 'Mac Address is required!';
                            $scope.errorMACAddressSec = true;
                            $scope.fronthaulMeshForm.macAddressSec.$valid = false;
                        }
                    } else if (field === 'serialNumberSec') {
                        if($scope.meterConfigurationDetails.FronthaulSecSerialNumber) {
                            if(!containsSpace.test($scope.meterConfigurationDetails.FronthaulSecSerialNumber)) {
                                    if ($scope.meterConfigurationDetails.FronthaulSecSerialNumber === undefined || $scope.meterConfigurationDetails.FronthaulSecSerialNumber.trim().length === 0) {
                                        $scope.errorSerialNumberSecMessage = 'Serial Number is required!';
                                        $scope.errorSerialNumberSec = true;
                                        $scope.fronthaulMeshForm.serialNumberSec.$valid = false;
                                    } else if (!pattern.test($scope.meterConfigurationDetails.FronthaulSecSerialNumber)) {
                                        $scope.errorSerialNumberSecMessage = 'Invalid Serial Number!';
                                        $scope.errorSerialNumberSec = true;
                                        $scope.fronthaulMeshForm.serialNumberSec.$valid = false;
                                    } else if ($scope.meterConfigurationDetails.FronthaulSecSerialNumber.length < 10 || $scope.meterConfigurationDetails.FronthaulSecSerialNumber.length > 25) {
                                        $scope.errorSerialNumberSecMessage = 'Length of Serial Number range should be from 10 to 25!';
                                        $scope.errorSerialNumberSec = true;
                                        $scope.fronthaulMeshForm.serialNumberSec.$valid = false;
                                    } else if ($scope.meterConfigurationDetails.FronthaulPrimSerialNumber) {
                                        if ($scope.meterConfigurationDetails.FronthaulPrimSerialNumber === $scope.meterConfigurationDetails.FronthaulSecSerialNumber) {
                                            $scope.errorSerialNumberSecMessage = 'Primary and Secondary Serial Number should not be same!';
                                            $scope.errorSerialNumberSec = true;
                                            $scope.fronthaulMeshForm.serialNumberSec.$valid = false;
                                        } else {
                                            $scope.errorSerialNumberSec = false;
                                            $scope.fronthaulMeshForm.serialNumberSec.$valid = true;
                                            if (!!pattern.test($scope.meterConfigurationDetails.FronthaulPrimSerialNumber) && !($scope.meterConfigurationDetails.FronthaulPrimSerialNumber.length < 10 || $scope.meterConfigurationDetails.FronthaulPrimSerialNumber.length > 25)) {
                                                $scope.errorSerialNumberPrimMessage = '';
                                                $scope.errorSerialNumberPrim = false;
                                                $scope.fronthaulMeshForm.serialNumber.$valid = true;
                                            }
                                        }
                                    } else {
                                        $scope.errorSerialNumberSec = false;
                                        $scope.fronthaulMeshForm.serialNumberSec.$valid = true;
                                    }   
                                } else {
                                    $scope.errorSerialNumberSecMessage = 'Invalid Serial Number';
                                    $scope.errorSerialNumberSec = true;
                                    $scope.fronthaulMeshForm.serialNumberSec.$valid = false;
                                }
                        } else {
                            $scope.errorSerialNumberSecMessage = 'Serial Number is required!';
                            $scope.errorSerialNumberSec = true;
                            $scope.fronthaulMeshForm.serialNumberSec.$valid = false;
                        }
                    } else if (field === 'ssid') {
                        if($scope.meterConfigurationDetails.FronthaulHotspotSSID) {
                            if(!containsSpace.test($scope.meterConfigurationDetails.FronthaulHotspotSSID)) {
                                    if ($scope.meterConfigurationDetails.FronthaulHotspotSSID === undefined || $scope.meterConfigurationDetails.FronthaulHotspotSSID.trim().length === 0) {
                                        $scope.errorSsidMessage = 'SSID is required!';
                                        $scope.errorSsid = true;
                                        $scope.fronthaulHotspotForm.ssid.$valid = false;
                                    }  else if (!meshidRegex.test($scope.meterConfigurationDetails.FronthaulHotspotSSID)) {
                                        $scope.errorSsidMessage = 'Invalid SSID!';
                                        $scope.errorSsid = true;
                                        $scope.fronthaulHotspotForm.ssid.$valid = false;
                                    } else if ($scope.meterConfigurationDetails.FronthaulHotspotSSID.length < 8 || $scope.meterConfigurationDetails.FronthaulHotspotSSID.length > 32) {
                                        $scope.errorSsidMessage = 'Length of SSID range should be from 8 to 32!';
                                        $scope.errorSsid = true;
                                        $scope.fronthaulHotspotForm.ssid.$valid = false;
                                    } else {
                                        $scope.errorSsid = false;
                                        $scope.fronthaulHotspotForm.ssid.$valid = true;
                                    }   
                                } else {
                                    $scope.errorSsidMessage = 'Invalid SSID!';
                                    $scope.errorSsid = true;
                                    $scope.fronthaulHotspotForm.ssid.$valid = false;
                                }
                        } else {
                            $scope.errorSsidMessage = 'SSID is required!';
                            $scope.errorSsid = true;
                            $scope.fronthaulHotspotForm.ssid.$valid = false;
                        }  
                    } else if (field === 'password') {
                        if($scope.meterConfigurationDetails.FronthaulHotspotPassword) {
                            if(!containsSpace.test($scope.meterConfigurationDetails.FronthaulHotspotPassword)) {
                                    if ($scope.meterConfigurationDetails.FronthaulHotspotPassword === undefined || $scope.meterConfigurationDetails.FronthaulHotspotPassword.trim().length === 0) {
                                        $scope.errorpasswordMessage = 'Password is required!';
                                        $scope.errorpassword = true;
                                        $scope.fronthaulHotspotForm.password.$valid = false;
                                    } else if (!pskRegex.test($scope.meterConfigurationDetails.FronthaulHotspotPassword)) {
                                        $scope.errorpasswordMessage = 'Invalid Password!';
                                        $scope.errorpassword = true;
                                        $scope.fronthaulHotspotForm.password.$valid = false;
                                    } else if ($scope.meterConfigurationDetails.FronthaulHotspotPassword.length < 8 || $scope.meterConfigurationDetails.FronthaulHotspotPassword.length > 63) {
                                        $scope.errorpasswordMessage = 'Length of Password range should be from 8 to 63!';
                                        $scope.errorpassword = true;
                                        $scope.fronthaulHotspotForm.password.$valid = false;
                                    } else {
                                        $scope.errorpassword = false;
                                        $scope.fronthaulHotspotForm.password.$valid = true;
                                    }   
                                } else {
                                    $scope.errorpasswordMessage = 'Invalid Password!';
                                    $scope.errorpassword = true;
                                    $scope.fronthaulHotspotForm.password.$valid = false;
                                }
                        } else {
                            $scope.errorpasswordMessage = 'Password is required!';
                            $scope.errorpassword = true;
                            $scope.fronthaulHotspotForm.password.$valid = false;
                        }
                    } else if (field === 'systemName') {
                        if($scope.meterConfigurationDetails.SettingsSystemName) {
                            if(nameRegex.test($scope.meterConfigurationDetails.SettingsSystemName)) {
                                    if ($scope.meterConfigurationDetails.SettingsSystemName === undefined || $scope.meterConfigurationDetails.SettingsSystemName.trim().length === 0) {
                                        $scope.errorSystemNameMessage = 'System Name is required!';
                                        $scope.errorSystemName = true;
                                        $scope.systemSettingsForm.systemName.$valid = false;
                                    } else if ($scope.meterConfigurationDetails.SettingsSystemName.length > 16) {
                                        $scope.errorSystemNameMessage = 'Length of System Name must not be more than 16!';
                                        $scope.errorSystemName = true;
                                        $scope.systemSettingsForm.systemName.$valid = false;
                                    } else {
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
                    }  else if (field === 'uploadLimit') {
                        if ($scope.meterConfigurationDetails.UploadBandwidth) {
                            if (!containsSpace.test($scope.meterConfigurationDetails.UploadBandwidth)) {
                                    if ($scope.meterConfigurationDetails.UploadBandwidth === undefined || $scope.meterConfigurationDetails.UploadBandwidth.trim().length === 0) {
                                        $scope.errorUploadMessage = 'Upload Bandwidth is required!';
                                        $scope.errorUpload = true;
                                        $scope.advancedBandwidthForm.uploadLimit.$valid = false;
                                    } else if (!numberPattern.test($scope.meterConfigurationDetails.UploadBandwidth)) {
                                        $scope.errorUploadMessage = 'Invalid Upload Bandwidth!';
                                        $scope.errorUpload = true;
                                        $scope.advancedBandwidthForm.uploadLimit.$valid = false;
                                    } else if ($scope.meterConfigurationDetails.UploadBandwidth < 1 || $scope.meterConfigurationDetails.UploadBandwidth > 300) {
                                        $scope.errorUploadMessage = 'Upload Bandwidth value range should be from 1 to 300!';
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
                        if ($scope.meterConfigurationDetails.DownloadBandwidth) {
                            if (!containsSpace.test($scope.meterConfigurationDetails.DownloadBandwidth)) {
                                    if ($scope.meterConfigurationDetails.DownloadBandwidth === undefined || $scope.meterConfigurationDetails.DownloadBandwidth.trim().length === 0) {
                                        $scope.errorDownloadMessage = 'Download Bandwidth is required!';
                                        $scope.errorDownload = true;
                                        $scope.advancedBandwidthForm.downloadLimit.$valid = false;
                                    } else if (!numberPattern.test($scope.meterConfigurationDetails.DownloadBandwidth)) {
                                        $scope.errorDownloadMessage = 'Invalid Download Bandwidth!';
                                        $scope.errorDownload = true;
                                        $scope.advancedBandwidthForm.downloadLimit.$valid = false;
                                    } else if ($scope.meterConfigurationDetails.DownloadBandwidth < 1 || $scope.meterConfigurationDetails.DownloadBandwidth > 300) {
                                        $scope.errorDownloadMessage = 'Download Bandwidth value range should be from 1 to 300!';
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
                    } else if (field === 'utilityID') {
                        if($scope.meterConfigurationDetails.MeterUtilityID) {
                            if(!containsSpace.test($scope.meterConfigurationDetails.MeterUtilityID)) {
                                    if ($scope.meterConfigurationDetails.MeterUtilityID === undefined || $scope.meterConfigurationDetails.MeterUtilityID.trim().length === 0) {
                                        $scope.errorUtilityIDMessage = 'Utility ID is required!';
                                        $scope.errorUtilityID = true;
                                        $scope.meterConfigForm.utilityID.$valid = false;
                                    } else if (!numberPattern.test($scope.meterConfigurationDetails.MeterUtilityID)) {
                                        $scope.errorUtilityIDMessage = 'Invalid Utility ID!';
                                        $scope.errorUtilityID = true;
                                        $scope.meterConfigForm.utilityID.$valid = false;
                                    } else {
                                        $scope.errorUtilityID = false;
                                        $scope.meterConfigForm.utilityID.$valid = true;
                                    }     
                                    } else {
                                        $scope.errorUtilityIDMessage = 'Invalid Utility ID!';
                                        $scope.errorUtilityID = true;
                                        $scope.meterConfigForm.utilityID.$valid = false;
                                    }
                            } else {
                                $scope.errorUtilityIDMessage = 'Utility ID is required!';
                                $scope.errorUtilityID = true;
                                $scope.meterConfigForm.utilityID.$valid = false;
                            }
                    } else if (field === 'circuitID') {
                        if($scope.meterConfigurationDetails.MeterCircuitID) {
                            if(!containsSpace.test($scope.meterConfigurationDetails.MeterCircuitID)) {
                                    if ($scope.meterConfigurationDetails.MeterCircuitID === undefined || $scope.meterConfigurationDetails.MeterCircuitID.trim().length === 0) {
                                        $scope.errorCircuitIDMessage = 'Circuit ID is required!';
                                        $scope.errorCircuitID = true;
                                        $scope.meterConfigForm.circuitID.$valid = false;
                                    } else if (!numberPattern.test($scope.meterConfigurationDetails.MeterCircuitID)) {
                                        $scope.errorCircuitIDMessage = 'Invalid Circuit ID!';
                                        $scope.errorCircuitID = true;
                                        $scope.meterConfigForm.circuitID.$valid = false;
                                    } else {
                                        $scope.errorCircuitID = false;
                                        $scope.meterConfigForm.circuitID.$valid = true;
                                    }     
                                } else {
                                    $scope.errorCircuitIDMessage = 'Invalid Circuit ID!';
                                    $scope.errorCircuitID = true;
                                    $scope.meterConfigForm.circuitID.$valid = false;
                                }
                        } else {
                            $scope.errorCircuitIDMessage = 'Circuit ID is required!';
                            $scope.errorCircuitID = true;
                            $scope.meterConfigForm.circuitID.$valid = false;
                        }
                    } else if (field === 'certificateNo') {
                        if($scope.meterConfigurationDetails.MeterCertificationNumber) {
                            if(!containsSpace.test($scope.meterConfigurationDetails.MeterCertificationNumber)) {
                                    if ($scope.meterConfigurationDetails.MeterCertificationNumber === undefined || $scope.meterConfigurationDetails.MeterCertificationNumber.trim().length === 0) {
                                        $scope.errorCertificateNoMessage = 'Certificate Number is required!';
                                        $scope.errorCertificateNo  = true;
                                        $scope.meterConfigForm.certificateNo.$valid = false;
                                    } else if (!numberPattern.test($scope.meterConfigurationDetails.MeterCertificationNumber)) {
                                        $scope.errorCertificateNoMessage = 'Invalid Certificate Number!';
                                        $scope.errorCertificateNo = true;
                                        $scope.meterConfigForm.certificateNo.$valid = false;
                                    } else {
                                        $scope.errorCertificateNo = false;
                                        $scope.meterConfigForm.certificateNo.$valid = true;
                                    }     
                                } else {
                                    $scope.errorCertificateNoMessage = 'Invalid Certificate Number!';
                                    $scope.errorCertificateNo = true;
                                    $scope.meterConfigForm.certificateNo.$valid = false;
                                }
                        } else {
                            $scope.errorCertificateNoMessage = 'Certificate Number is required!';
                            $scope.errorCertificateNo  = true;
                            $scope.meterConfigForm.certificateNo.$valid = false;
                        }
                    } else if (field === 'meterESN') {
                        if($scope.meterConfigurationDetails.MeterESN) {
                            if(!containsSpace.test($scope.meterConfigurationDetails.MeterESN)) {
                                    if ($scope.meterConfigurationDetails.MeterESN === undefined || $scope.meterConfigurationDetails.MeterESN.trim().length === 0) {
                                        $scope.errorMeterESNMessage = 'ESN is required!';
                                        $scope.errorMeterESN  = true;
                                        $scope.meterConfigForm.meterESN.$valid = false;
                                    } else if (!numberPattern.test($scope.meterConfigurationDetails.MeterESN)) {
                                        $scope.errorMeterESNMessage = 'Invalid ESN!';
                                        $scope.errorMeterESN = true;
                                        $scope.meterConfigForm.meterESN.$valid = false;
                                    } else {
                                        $scope.errorMeterESN = false;
                                        $scope.meterConfigForm.meterESN.$valid = true;
                                    }   
                                } else {
                                    $scope.errorMeterESNMessage = 'Invalid ESN!';
                                    $scope.errorMeterESN = true;
                                    $scope.meterConfigForm.meterESN.$valid = false;
                                }
                        } else {
                            $scope.errorMeterESNMessage = 'ESN is required!';
                            $scope.errorMeterESN  = true;
                            $scope.meterConfigForm.meterESN.$valid = false;
                        }  
                    } else if (field === 'securityTypeHotspot' && $scope.meterConfigurationDetails.FronthaulHotspotWirelessSecurity) {
                        if($scope.meterConfigurationDetails.FronthaulHotspotWirelessSecurity.toLowerCase() === 'open') {
                            $scope.meterConfigurationDetails.FronthaulHotspotPassword = '';
                            $scope.errorpassword = false;
                        } else if($scope.meterConfigurationDetails.FronthaulHotspotPassword) {
                            $scope.focusValidate('password');
                        } else {
                            $scope.errorpasswordMessage = '';
                            $scope.errorpassword = true;
                        }
                    } else if (field === 'securityTypeMesh21' && $scope.meterConfigurationDetails.FronthaulPrimSecurityType) {
                        if($scope.meterConfigurationDetails.FronthaulPrimSecurityType.toLowerCase() === 'open') {
                            $scope.meterConfigurationDetails.FronthaulPrimPresharedKey = '';
                            $scope.errorPreSharedKeyPrim = false;
                        } else if($scope.meterConfigurationDetails.FronthaulPrimPresharedKey) {
                            $scope.focusValidate('pskPrim');
                        } else {
                            $scope.errorPreSharedKeyPrimMessage = '';
                            $scope.errorPreSharedKeyPrim = true;
                        }
                    } else if (field === 'securityTypeMesh22' && $scope.meterConfigurationDetails.FronthaulSecSecurityType) {
                        if($scope.meterConfigurationDetails.FronthaulSecSecurityType.toLowerCase() === 'open') {
                            $scope.meterConfigurationDetails.FronthaulSecPresharedKey = '';
                            $scope.errorPreSharedKeySec = false;
                        } else if($scope.meterConfigurationDetails.FronthaulSecPresharedKey) {
                            $scope.focusValidate('preSharedKeySec');
                        } else {
                            $scope.errorPreSharedKeySecMessage = '';
                            $scope.errorPreSharedKeySec = true;
                        }
                    }

                    $scope.set_radio_valid = $scope.errorTransmitPower;
                    $scope.set_DHCP_valid = $scope.errorStartAddress || $scope.errorEndAddress || $scope.errorSubnetMaskDHCP || $scope.errorPrimaryDNSDHCP || $scope.errorDefaultGatewayDHCP || $scope.errorSecondaryDNSDHCP || !$scope.meterConfigurationDetails.FronthaulDHCPStartAddress || !$scope.meterConfigurationDetails.FronthaulDHCPEndAddress || !$scope.meterConfigurationDetails.FronthaulDHCPDefaultGateway;
                    $scope.set_mesh_valid = $scope.errorMeshIDPrim || $scope.errorPreSharedKeyPrim || $scope.errorMeshIDSec || $scope.errorPreSharedKeySec || !$scope.meterConfigurationDetails.FronthaulSecSecurityType || !$scope.meterConfigurationDetails.FronthaulPrimSecurityType || $scope.errorMacAddressPrim || $scope.errorSerialNumberPrim || $scope.errorMACAddressSec || $scope.errorSerialNumberSec;
                    $scope.set_hotspot_valid = $scope.errorSsid || $scope.errorpassword || !$scope.meterConfigurationDetails.FronthaulHotspotWirelessSecurity;
                    $scope.set_systemsettings_valid = $scope.errorSystemName;
                    $scope.set_meterConfig_valid = $scope.errorUtilityID || $scope.errorCircuitID || $scope.errorCertificateNo || $scope.errorMeterESN;
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
                  var dottedArray = $scope.meterConfigurationDetails.FronthaulDHCPDefaultGateway.split(".");
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
                    $scope.errorbool = false;
                    $scope.testnn = true;
                    if (value === undefined ||
                        value.trim().length === 0) {
                        $scope.IpAddMessage = fieldname + ' is required!';
                        $scope.errorIpAdd = true;
                        $scope.ipValid = false;
                    } else if (!ipV4Reg.exec(value)) {
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
                        $scope.meterConfigurationDetails.FronthaulDHCPStartAddress = $scope.setPreviousMeterConfigurationDetails.FronthaulDHCPStatus ? $scope.setPreviousMeterConfigurationDetails.FronthaulDHCPStartAddress : '';
                        $scope.meterConfigurationDetails.FronthaulDHCPEndAddress = $scope.setPreviousMeterConfigurationDetails.FronthaulDHCPStatus ? $scope.setPreviousMeterConfigurationDetails.FronthaulDHCPEndAddress: '';
                        $scope.meterConfigurationDetails.FronthaulDHCPSubnetMask = $scope.setPreviousMeterConfigurationDetails.FronthaulDHCPSubnetMask;
                        $scope.meterConfigurationDetails.FronthaulDHCPPrimaryDNS = $scope.setPreviousMeterConfigurationDetails.FronthaulDHCPPrimaryDNS;
                        $scope.meterConfigurationDetails.FronthaulDHCPDefaultGateway = $scope.setPreviousMeterConfigurationDetails.FronthaulDHCPStatus ? $scope.setPreviousMeterConfigurationDetails.FronthaulDHCPDefaultGateway: '';
                        $scope.meterConfigurationDetails.FronthaulDHCPSecondaryDNS = $scope.setPreviousMeterConfigurationDetails.FronthaulDHCPSecondaryDNS;
                        $scope.validateMeterDetails();
                    } else {
                        $scope.meterConfigurationDetails.FronthaulDHCPStartAddress = "192.168.30.1";
                        $scope.meterConfigurationDetails.FronthaulDHCPEndAddress = "";
                        $scope.meterConfigurationDetails.FronthaulDHCPSubnetMask = "255.255.255.0";
                        $scope.meterConfigurationDetails.FronthaulDHCPPrimaryDNS = "8.8.8.8";
                        $scope.meterConfigurationDetails.FronthaulDHCPDefaultGateway = "192.168.30.1";
                        $scope.meterConfigurationDetails.FronthaulDHCPSecondaryDNS = "8.8.4.4";
                    }
                }
                $scope.onchangeBandwidthStatus = function () {
                    if ($scope.meterConfigurationDetails.BandwidthStatus) {
                        $scope.meterConfigurationDetails.DownloadBandwidth = $scope.setPreviousMeterConfigurationDetails.DownloadBandwidth;
                        $scope.meterConfigurationDetails.UploadBandwidth = $scope.setPreviousMeterConfigurationDetails.UploadBandwidth;    
                    } else {
                        $scope.meterConfigurationDetails.DownloadBandwidth = "1";
                        $scope.meterConfigurationDetails.UploadBandwidth = "1";    
                    
                    }
                    $scope.validateMeterDetails();
                }
                $scope.resetDetails = function (field) {
                    if (field === 'settings') {
                        $scope.systemSettingsForm.$setPristine();
                    } else if  (field === 'alarms') {
                        $scope.alarmsavebutton = true;
                    } else if (field === 'meter') {
                        $scope.meterConfigForm.$setPristine();
                    } else if (field === 'radio') {
                        $scope.fronthaulRadioForm.$setPristine();
                    } else if (field === 'mesh') {
                        $scope.fronthaulMeshForm.$setPristine();
                    } else if (field === 'hotspot') {
                        $scope.fronthaulHotspotForm.$setPristine();
                    } else if (field === 'dhcp') {
                        $scope.fronthaulDHCPForm.$setPristine();
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
                $scope.buttondisable = function () {
                    $scope.alarmsavebutton = false;
                };
                $scope.getTimezoneListByCountry = function () {
                    fetchDefaultCountryDetails();
                };
                $scope.updateRadioMode = function () {
                    radioModeChange();
                };
                $scope.updateRadioBand = function () {
                    radioBandChange();
                };
                $scope.validateMeterDetails = function () {
                    $scope.meterFields = []; 
                    $scope.currentURL = $state;
                    var currentPage = ($scope.currentURL.current.name).split(".")[2];
                    if (currentPage == 'frontHaulRadio') {
                        $scope.meterFields = ["transmitPower"]; 
                    } else if (currentPage == 'systemSettings') {
                        if ($scope.meterConfigurationDetails.SettingsSystemName) {
                            $scope.meterFields.push("systemName");
                        } else {
                            $scope.errorSystemNameMessage = '';
                        }
                    } else if (currentPage == 'frontHaulMesh') {
                        $scope.meterFields = ["securityTypeMesh21" , "securityTypeMesh22"];
                        if ($scope.meterConfigurationDetails.FronthaulPrimMeshID) {
                            $scope.meterFields.push("meshIDPrim");
                        } else {
                            $scope.errorMeshIDPrimMessage = '';
                        }
                        if ($scope.meterConfigurationDetails.FronthaulSecMeshID) {
                            $scope.meterFields.push("meshIDSec");
                        } else {
                            $scope.errorMeshIDSecMessage = '';
                        }
                        if ($scope.meterConfigurationDetails.FronthaulPrimMacAddress) {
                            $scope.meterFields.push("macAddressPrim");
                        } else {
                            $scope.errorMacAddressPrimMessage = '';
                        }
                        if ($scope.meterConfigurationDetails.FronthaulPrimSerialNumber) {
                            $scope.meterFields.push("serialNumberPrim");
                        } else {
                            $scope.errorSerialNumberPrimMessage = '';
                        }
                        if ($scope.meterConfigurationDetails.FronthaulSecMACAddress) {
                            $scope.meterFields.push("macAddressSec");
                        } else {
                            $scope.errorMACAddressSecMessage = '';
                        }
                        if ($scope.meterConfigurationDetails.FronthaulSecSerialNumber) {
                            $scope.meterFields.push("serialNumberSec");
                        } else {
                            $scope.errorSerialNumberSecMessage = '';
                        }
                    } else if (currentPage == 'frontHaulHotspot') {
                        $scope.meterFields = ["ssid" , "securityTypeHotspot"]; 
                    } else if (currentPage == 'frontHaulDhcp') {
                        $scope.meterFields = ["subnetMaskDHCP", "primaryDNSDHCP", "secondaryDNSDHCP"]; 
                        if ($scope.meterConfigurationDetails.FronthaulDHCPStartAddress) {
                            $scope.meterFields.push("startAddress");
                        } else {
                            $scope.errorStartAddressMessage = '';
                        }
                        if ($scope.meterConfigurationDetails.FronthaulDHCPEndAddress) {
                            $scope.meterFields.push("endAddress");
                        } else {
                            $scope.errorEndAddressMessage = '';
                        }
                        if ($scope.meterConfigurationDetails.FronthaulDHCPDefaultGateway) {
                            $scope.meterFields.push("defaultGatewayDHCP");
                        } else {
                            $scope.errorDefaultGatewayDHCPMessage = '';
                        }
                    } else if (currentPage == 'configurations') {
                        $scope.meterFields = ["utilityID" , "circuitID", "certificateNo", "meterESN"]; 
                    } else if (currentPage == 'bandwidthLimitations') {
                        if ($scope.meterConfigurationDetails.UploadBandwidth) {
                            $scope.meterFields.push("downloadLimit");
                        } else {
                            $scope.errorDownloadMessage = '';
                            $scope.errorDownload = false;
                        }
                        if ($scope.meterConfigurationDetails.UploadBandwidth) {
                            $scope.meterFields.push("uploadLimit");
                        } else {
                            $scope.errorUploadMessage = '';
                            $scope.errorUpload = false;
                            $scope.set_advance_bandwidth_valid = true;
                        }
                    }
                    if ($scope.meterFields.length > 0) {
                        for (var i = 0; i < $scope.meterFields.length; i++) {
                            $scope.focusValidate($scope.meterFields[i]);
                        }
                    }
                };
                function radioModeChange() {
                        if ($scope.meterConfigurationDetails.FronthaulRadioRadioMode === '11ng') {
                            $scope.channelWidths = ["Auto", "20MHz", "40MHz"];
                            if ($scope.meterConfigurationDetails.FronthaulRadioChannelWidth === '20MHz') {
                                $scope.streamSelections = ["1x1", "2x2"];
                            } else {
                                $scope.streamSelections = ["1x1"];
                                $scope.meterConfigurationDetails.FronthaulRadioStreamSelection = "1x1";
                            }
                        } else if ($scope.meterConfigurationDetails.FronthaulRadioRadioMode === '11na') {
                            $scope.channelWidths = ["Auto", "20MHz", "40MHz"];
                            $scope.streamSelections = ["1x1"];
                            $scope.meterConfigurationDetails.FronthaulRadioStreamSelection = "1x1";
                        } else {
                            $scope.channelWidths = ["20MHz"];
                            $scope.meterConfigurationDetails.FronthaulRadioChannelWidth = "20MHz";
                            $scope.streamSelections = ["1x1"];
                            $scope.meterConfigurationDetails.FronthaulRadioStreamSelection = "1x1";
                        }
                            $scope.updateChannelWidth();
                }
                function radioBandChange() {
                    $scope.channels = [];
                    $scope.transmitPower = $scope.defaultValues.two_four.TransmitPower;
                    if ($scope.meterConfigurationDetails.FronthaulRadioRadioBand === '2.4 GHz') {
                        $scope.radioModes = ["11b", "11g", "11ng"];
                        $scope.channels = $scope.channels2_4;
                        $scope.transmitPower = $scope.defaultValues.two_four.TransmitPower;
                        if ($scope.setPreviousMeterConfigurationDetails.FronthaulRadioRadioBand !== '2.4 GHz') {
                            $scope.meterConfigurationDetails.FronthaulRadioChannel = $scope.channels[0];
                        } else {
                            $scope.meterConfigurationDetails.FronthaulRadioChannel = $scope.setPreviousMeterConfigurationDetails.FronthaulRadioChannel;
                        }
                        if ($scope.setPreviousMeterConfigurationDetails.FronthaulRadioRadioMode === '11a' || $scope.setPreviousMeterConfigurationDetails.FronthaulRadioRadioMode === '11na') {
                            $scope.meterConfigurationDetails.FronthaulRadioRadioMode = "11b";
                        } else {
                            $scope.meterConfigurationDetails.FronthaulRadioRadioMode = $scope.setPreviousMeterConfigurationDetails.FronthaulRadioRadioMode;
                        }
                    } else {
                        $scope.radioModes = ["11a", "11na"];
                        $scope.channels = $scope.channels5;
                        $scope.transmitPower = $scope.defaultValues.five_low.TransmitPower;
                        if ($scope.setPreviousMeterConfigurationDetails.FronthaulRadioRadioBand !== '5 GHz') {
                            $scope.meterConfigurationDetails.FronthaulRadioChannel = $scope.channels[0];
                        } else {
                            $scope.meterConfigurationDetails.FronthaulRadioChannel = $scope.setPreviousMeterConfigurationDetails.FronthaulRadioChannel;
                        }
                        if ($scope.setPreviousMeterConfigurationDetails.FronthaulRadioRadioMode !== '11a' && $scope.setPreviousMeterConfigurationDetails.FronthaulRadioRadioMode !== '11na') {
                            $scope.meterConfigurationDetails.FronthaulRadioRadioMode = "11a";
                        } else {
                            $scope.meterConfigurationDetails.FronthaulRadioRadioMode = $scope.setPreviousMeterConfigurationDetails.FronthaulRadioRadioMode;
                        }
                            $scope.updateChannelWidth();
                    }
                    radioModeChange();
                }
                $scope.updateChannelWidth = function () {
                    if ($scope.meterConfigurationDetails.FronthaulRadioRadioBand === '5 GHz') {
                        if ($scope.meterConfigurationDetails.FronthaulRadioChannelWidth !== '20MHz') {
                                $scope.channels = (($scope.defaultValues.five_low.Channels).map(String)).concat((angular.isUndefinedOrNull($scope.defaultValues.five_high) ? [] : ($scope.defaultValues.five_high.Channels).map(String)));
                                var index = $scope.channels.indexOf("165");
                                if (index > -1) {
                                    $scope.channels.splice(index, 1);
                                    if($scope.meterConfigurationDetails.FronthaulRadioChannel === '165') {
                                        $scope.meterConfigurationDetails.FronthaulRadioChannel = $scope.channels[0];
                                    }
                                }
                        } else {
                                $scope.channels = (($scope.defaultValues.five_low.Channels).map(String)).concat((angular.isUndefinedOrNull($scope.defaultValues.five_high) ? [] : ($scope.defaultValues.five_high.Channels).map(String)));
                        }
                    }
                };
            }]);
})(window.angular);