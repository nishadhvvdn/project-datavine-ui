/**
 * This handles parsing the data
 */
(function (angular) {
    "use strict";
    angular
        .module('dataVINEApp')
        .service('ParseService', [
            function () {

                /**
                 * Returns parsed transformer data
                 */
                this.getParsedTransformerData = function (objData, circuitId, fetchUnAssigned) {
                    var transfomerData = [];
                    var objHSData = {};
                    if (!angular.isUndefinedOrNull(objData) &&
                        !angular.isUndefinedOrNull(objData.HypersproutDetailsSelected)) {
                        for (var i = 0; i < objData.HypersproutDetailsSelected.length; i++) {
                            var objInputData = objData.HypersproutDetailsSelected[i];
                            if (!objInputData.IsHyperHub) {
                                objHSData[objInputData.TransformerID] = {};
                                objHSData[objInputData.TransformerID]["SerialNumber"] = objInputData.HypersproutSerialNumber;
                                objHSData[objInputData.TransformerID]["MAC_ID_GPRS"] = angular.isUndefinedOrNull(objInputData.Hypersprout_Communications) ? "" : objInputData.Hypersprout_Communications.MAC_ID_GPRS;
                                objHSData[objInputData.TransformerID]["Latitude"] = angular.isUndefinedOrNull(objInputData.Hypersprout_Communications) ? "" : objInputData.Hypersprout_Communications.Latitude;
                                objHSData[objInputData.TransformerID]["Longitude"] = angular.isUndefinedOrNull(objInputData.Hypersprout_Communications) ? "" : objInputData.Hypersprout_Communications.Longitude;
                                objHSData[objInputData.TransformerID]["MAC_ID_WiFi"] = angular.isUndefinedOrNull(objInputData.Hypersprout_Communications) ? "" : objInputData.Hypersprout_Communications.MAC_ID_WiFi;
                                objHSData[objInputData.TransformerID]["IP_address_WiFi"] = angular.isUndefinedOrNull(objInputData.Hypersprout_Communications) ? "" : objInputData.Hypersprout_Communications.IP_address_WiFi;
                                objHSData[objInputData.TransformerID]["AccessPointPassword"] = angular.isUndefinedOrNull(objInputData.Hypersprout_Communications) ? "" : objInputData.Hypersprout_Communications.AccessPointPassword;
                                objHSData[objInputData.TransformerID]["SimCardNumber"] = angular.isUndefinedOrNull(objInputData.Hypersprout_Communications) ? "" : objInputData.Hypersprout_Communications.SimCardNumber;
                                objHSData[objInputData.TransformerID]["CT_Ratio"] = angular.isUndefinedOrNull(objInputData.Hypersprout_DeviceDetails) ? "" : objInputData.Hypersprout_DeviceDetails.CT_Ratio;
                                objHSData[objInputData.TransformerID]["PT_Ratio"] = angular.isUndefinedOrNull(objInputData.Hypersprout_DeviceDetails) ? "" : objInputData.Hypersprout_DeviceDetails.PT_Ratio;
                                objHSData[objInputData.TransformerID]["RatedVoltage"] = angular.isUndefinedOrNull(objInputData.Hypersprout_DeviceDetails) ? "" : objInputData.Hypersprout_DeviceDetails.RatedVoltage;
                                objHSData[objInputData.TransformerID]["Phase"] = angular.isUndefinedOrNull(objInputData.Hypersprout_DeviceDetails) ? "" : objInputData.Hypersprout_DeviceDetails.Phase;
                                objHSData[objInputData.TransformerID]["Frequency"] = angular.isUndefinedOrNull(objInputData.Hypersprout_DeviceDetails) ? "" : objInputData.Hypersprout_DeviceDetails.Frequency;
                                objHSData[objInputData.TransformerID]["Accuracy"] = angular.isUndefinedOrNull(objInputData.Hypersprout_DeviceDetails) ? "" : objInputData.Hypersprout_DeviceDetails.Accuracy;
                                objHSData[objInputData.TransformerID]["HSDemandResetDate"] = angular.isUndefinedOrNull(objInputData.Hypersprout_DeviceDetails) ? "" : objInputData.Hypersprout_DeviceDetails.HSDemandResetDate;
                                objHSData[objInputData.TransformerID]["HSCompliantToStandards"] = angular.isUndefinedOrNull(objInputData.Hypersprout_DeviceDetails) ? "" : objInputData.Hypersprout_DeviceDetails.HSCompliantToStandards;
                                objHSData[objInputData.TransformerID]["MaxDemandWindow"] = angular.isUndefinedOrNull(objInputData.Hypersprout_DeviceDetails) ? "" : objInputData.Hypersprout_DeviceDetails.MaxDemandWindow;
                                objHSData[objInputData.TransformerID]["MaxDemandSlidingWindowInterval"] = angular.isUndefinedOrNull(objInputData.Hypersprout_DeviceDetails) ? "" : objInputData.Hypersprout_DeviceDetails.MaxDemandSlidingWindowInterval;
                                objHSData[objInputData.TransformerID]["Sensor Details"] = angular.isUndefinedOrNull(objInputData.Hypersprout_DeviceDetails) ? "" : objInputData.Hypersprout_DeviceDetails["Sensor Details"];
                                objHSData[objInputData.TransformerID]["HypersproutVersion"] = angular.isUndefinedOrNull(objInputData.Hypersprout_DeviceDetails) ? "" : objInputData.Hypersprout_DeviceDetails["HypersproutVersion"];
                                objHSData[objInputData.TransformerID]["HypersproutMake"] = angular.isUndefinedOrNull(objInputData.Hypersprout_DeviceDetails) ? "" : objInputData.Hypersprout_DeviceDetails["HypersproutMake"];
                                objHSData[objInputData.TransformerID]["Status"] = angular.isUndefinedOrNull(objInputData.Hypersprout_DeviceDetails) ? "" : objInputData["Status"];
                                objHSData[objInputData.TransformerID]["HypersproutID"] = angular.isUndefinedOrNull(objInputData.HypersproutID) ? "" : objInputData["HypersproutID"];
                           }
                        }
                    }
                    if (!angular.isUndefinedOrNull(objData) &&
                        !angular.isUndefinedOrNull(objData.TransformerDetailSelected)) {
                        for (var j = 0; j < objData.TransformerDetailSelected.length; j++) {
                            var objInputData1 = objData.TransformerDetailSelected[j];
                            var objInputHSData = objHSData[objInputData1.TransformerID];
                            if (!angular.isUndefinedOrNull(circuitId) && circuitId !== objInputData1.CircuitID) {
                                continue;
                            }
                            if (fetchUnAssigned && !angular.isUndefinedOrNull(objInputData1.CircuitID === "null" ? null : objInputData1.CircuitID)) {
                                continue;
                            }
                            var objToInsert = {};
                            objToInsert["TransformerID"] = objInputData1.TransformerID;
                            objToInsert["HypersproutID"] = objInputHSData.HypersproutID;
                            objToInsert["transformerSl"] = objInputData1.TransformerSerialNumber;
                            objToInsert["TFMRName"] = objInputData1.TFMRName;
                            objToInsert["kvaRating"] = objInputData1.RatingCapacity;
                            objToInsert["HighLineVoltage"] = objInputData1.HighLineVoltage;
                            objToInsert["LowLineVoltage"] = objInputData1.LowLineVoltage;
                            objToInsert["HighLineCurrent"] = objInputData1.HighLineCurrent;
                            objToInsert["LowLineCurrent"] = objInputData1.LowLineCurrent;
                            objToInsert["Make"] = objInputData1.Make;
                            objToInsert["ConnectedStreetlights"] = objInputData1.ConnectedStreetlights;
                            objToInsert["CameraConnect"] = objInputData1.CameraConnect;
                            objToInsert["StreetlightsMetered"] = objInputData1.StreetlightsMetered;
                            objToInsert["StreetlightUsage"] = objInputData1.StreetlightUsage;
                            objToInsert["NoOfConnectedStreetlights"] = objInputData1.NoOfConnectedStreetlights;
                            objToInsert["StreetLightStartTime"] = objInputData1.StreetLightStartTime;
                            objToInsert["StreetLightEndTime"] = objInputData1.StreetLightEndTime;
                            objToInsert["WireSize"] = objInputData1.WireSize;
                            objToInsert["noOfMeters"] = objInputData1.NoOfMeterAllocated;
                            objToInsert["MaxOilTemp"] = objInputData1["MaxOilTemp"];
                            objToInsert["MinOilTemp"] = objInputData1["MinOilTemp"];
                            objToInsert["type"] = objInputData1.Type;
                            objToInsert["hvlv"] = 'HV';
                            if (!angular.isUndefinedOrNull(objInputHSData)) {
                                objToInsert["hypSl"] = objInputHSData.SerialNumber;
                                objToInsert["latitude"] = objInputHSData.Latitude;
                                objToInsert["longitude"] = objInputHSData.Longitude;
                                objToInsert["ctRatio"] = objInputHSData.CT_Ratio;
                                objToInsert["ptRatio"] = objInputHSData.PT_Ratio;
                                objToInsert["ratedVoltage"] = objInputHSData.RatedVoltage;
                                objToInsert["phases"] = objInputHSData.Phase;
                                objToInsert["maxDemand"] = objInputHSData.MaxDemandWindow;
                                objToInsert["MaxDemandSlidingWindowInterval"] = objInputHSData.MaxDemandSlidingWindowInterval;
                                objToInsert["frequency"] = objInputHSData.Frequency;
                                objToInsert["measurementClass"] = 'TBD'
                                objToInsert["complaintStandard"] = objInputHSData.HSCompliantToStandards;
                                objToInsert["gprs"] = objInputHSData.MAC_ID_GPRS;
                                objToInsert["wifiMacId"] = objInputHSData.MAC_ID_WiFi;
                                objToInsert["wifiIpAdd"] = objInputHSData.IP_address_WiFi;
                                objToInsert["wifiAccessPwd"] = objInputHSData.AccessPointPassword;
                                objToInsert["simCard"] = objInputHSData.SimCardNumber;
                                objToInsert["sensorRating"] = objInputHSData["Sensor Details"];
                                objToInsert["Accuracy"] = objInputHSData["Accuracy"];
                                objToInsert["HypersproutVersion"] = objInputHSData["HypersproutVersion"];
                                objToInsert["HypersproutMake"] = objInputHSData["HypersproutMake"];
                                objToInsert["HSDemandResetDate"] = objInputHSData["HSDemandResetDate"];
                                objToInsert["Status"] = objInputHSData["Status"];
                            }
                            transfomerData.push(objToInsert);
                        }
                    }
                    return transfomerData;
                };

                /**
                 * Returns parsed meter data
                 */
                this.getParsedMeterData = function (objData, transformerId, fetchUnAssigned) {
                    var arrMeterData = [];
                    if (!angular.isUndefinedOrNull(objData)) {
                        for (var i = 0; i < objData.length; i++) {
                            var objInputData = objData[i];
                            if (!angular.isUndefinedOrNull(transformerId) &&
                                transformerId !== objInputData.TransformerID) {
                                continue;
                            }
                            if (fetchUnAssigned &&
                                !angular.isUndefinedOrNull(objInputData.TransformerID === "null" ? null : objInputData.TransformerID)) {
                                continue;
                            }
                            var objToInsert = {};
                            if (objInputData.Meters_Communications["AccessPointPassword"] === undefined) {
                                objInputData.Meters_Communications["AccessPointPassword"] = objInputData.Meters_Communications["AccessPointPassword"];
                            }
                            objToInsert["MeterID"] = objInputData.MeterID;
                            objToInsert["HypersproutID"] = objInputData.HypersproutID;
                            objToInsert["status"] = objInputData.Status;
                            objToInsert["meterSl"] = objInputData.MeterSerialNumber;
                            objToInsert["SealID"] = objInputData.SealID;
                            objToInsert["BiDirectional"] = objInputData.BiDirectional;
                            objToInsert["EVMeter"] = objInputData.EVMeter;
                            objToInsert["SolarPanel"] = objInputData.SolarPanel;
                            objToInsert["applicationType"] = angular.isUndefinedOrNull(objInputData.Meters_DeviceDetails) ? "" : objInputData.Meters_DeviceDetails.MeterApptype;
                            objToInsert["installationLocation"] = angular.isUndefinedOrNull(objInputData.Meters_DeviceDetails) ? "" : objInputData.Meters_DeviceDetails.MeterInstallationLocation;
                            objToInsert["MeasurementClass"] = angular.isUndefinedOrNull(objInputData.Meters_DeviceDetails) ? "" : objInputData.Meters_DeviceDetails.MeterAccuracy;
                            objToInsert["MeterVersion"] = angular.isUndefinedOrNull(objInputData.Meters_DeviceDetails) ? "" : objInputData.Meters_DeviceDetails.MeterVersion;
                            objToInsert["ctRatioMeter"] = angular.isUndefinedOrNull(objInputData.Meters_DeviceDetails) ? "" : objInputData.Meters_DeviceDetails.CT_Ratio;
                            objToInsert["ptRatioMeter"] = angular.isUndefinedOrNull(objInputData.Meters_DeviceDetails) ? "" : objInputData.Meters_DeviceDetails.PT_Ratio;
                            objToInsert["ratedVoltageMeter"] = angular.isUndefinedOrNull(objInputData.Meters_DeviceDetails) ? "" : objInputData.Meters_DeviceDetails.RatedVoltage;
                            objToInsert["phasesMeter"] = angular.isUndefinedOrNull(objInputData.Meters_DeviceDetails) ? "" : objInputData.Meters_DeviceDetails.Phase;
                            objToInsert["ratedFrequencyMeter"] = angular.isUndefinedOrNull(objInputData.Meters_DeviceDetails) ? "" : objInputData.Meters_DeviceDetails.Frequency;
                            objToInsert["nominalCurrent"] = angular.isUndefinedOrNull(objInputData.Meters_DeviceDetails) ? "" : objInputData.Meters_DeviceDetails.MeterNominalCurrent;
                            objToInsert["maximumCurrent"] = angular.isUndefinedOrNull(objInputData.Meters_DeviceDetails) ? "" : objInputData.Meters_DeviceDetails.MeterMaximumCurrent;
                            objToInsert["complaintStandardMeter"] = angular.isUndefinedOrNull(objInputData.Meters_DeviceDetails) ? "" : objInputData.Meters_DeviceDetails.MeterCompliantToStandards;
                            objToInsert["wifiMacIdMeter"] = angular.isUndefinedOrNull(objInputData.Meters_Communications) ? "" : objInputData.Meters_Communications.MAC_ID_WiFi;
                            objToInsert["wifiIpAddMeter"] = angular.isUndefinedOrNull(objInputData.Meters_Communications) ? "" : objInputData.Meters_Communications.IP_address_WiFi;
                            objToInsert["wifiAccessPwdMeter"] = angular.isUndefinedOrNull(objInputData.Meters_Communications) ? "" : objInputData.Meters_Communications["AccessPointPassword"];
                            objToInsert["meterAdminPwd"] = angular.isUndefinedOrNull(objInputData.Meters_Communications) ? "" : objInputData.Meters_Communications.MeterAdminPassword;
                            objToInsert["latitudeMeter"] = angular.isUndefinedOrNull(objInputData.Meters_Communications) ? "" : objInputData.Meters_Communications.Latitude;
                            objToInsert["longitudeMeter"] = angular.isUndefinedOrNull(objInputData.Meters_Communications) ? "" : objInputData.Meters_Communications.Longitude;
                            objToInsert["consumerNumber"] = angular.isUndefinedOrNull(objInputData.Meters_Billing) ? "" : objInputData.Meters_Billing.MeterConsumerNumber;
                            objToInsert["consumerName"] = angular.isUndefinedOrNull(objInputData.Meters_Billing) ? "" : objInputData.Meters_Billing.MeterConsumerName;
                            objToInsert["contactNumber"] = angular.isUndefinedOrNull(objInputData.Meters_Billing) ? "" : objInputData.Meters_Billing.MeterConsumerContactNumber;
                            objToInsert["consumerAddress"] = angular.isUndefinedOrNull(objInputData.Meters_Billing) ? "" : objInputData.Meters_Billing.MeterConsumerAddress;
                            objToInsert["consumerCountry"] = angular.isUndefinedOrNull(objInputData.Meters_Billing) ? "" : objInputData.Meters_Billing.MeterConsumerCountry;
                            objToInsert["consumerState"] = angular.isUndefinedOrNull(objInputData.Meters_Billing) ? "" : objInputData.Meters_Billing.MeterConsumerState;
                            objToInsert["consumerCity"] = angular.isUndefinedOrNull(objInputData.Meters_Billing) ? "" : objInputData.Meters_Billing.MeterConsumerCity;
                            objToInsert["consumerState"] = angular.isUndefinedOrNull(objInputData.Meters_Billing) ? "" : objInputData.Meters_Billing.MeterConsumerState;
                            objToInsert["consumerZipcode"] = angular.isUndefinedOrNull(objInputData.Meters_Billing) ? "" : objInputData.Meters_Billing.MeterConsumerZipCode;
                            objToInsert["billingDate"] = angular.isUndefinedOrNull(objInputData.Meters_Billing) ? "" : objInputData.Meters_Billing.BillingDate;
                            objToInsert["billingTime"] = angular.isUndefinedOrNull(objInputData.Meters_Billing) ? "" : objInputData.Meters_Billing.BillingTime;
                            objToInsert["demandResetDate"] = angular.isUndefinedOrNull(objInputData.Meters_Billing) ? "" : objInputData.Meters_Billing.MeterDemandResetDate;
                            objToInsert["ImpulseCountperKWh"] = angular.isUndefinedOrNull(objInputData.Meters_Billing) ? "" : objInputData.Meters_Billing.ImpulseCountperKWh;
                            objToInsert["ImpulseCountPerKVARh"] = angular.isUndefinedOrNull(objInputData.Meters_Billing) ? "" : objInputData.Meters_Billing.ImpulseCountPerKVARh;
                            objToInsert["meterMake"] = angular.isUndefinedOrNull(objInputData.Meters_DeviceDetails) ? "" : objInputData.Meters_DeviceDetails.MeterMake;
                            objToInsert["meterDisconnector"] = angular.isUndefinedOrNull(objInputData.Meters_DeviceDetails) ? "" : objInputData.Meters_DeviceDetails.MeterDisconnector;
                            arrMeterData.push(objToInsert);
                        }
                    }
                    return arrMeterData;
                }

                /**
                 * Returns parsed hub data
                 */
                this.getParsedHubData = function (objData, callBack) {
                    var hubData = [];
                    if (!angular.isUndefinedOrNull(objData.type) && objData.type) {
                        for (var i = 0; i < objData.HyperHubDetailSelected.length; i++) {
                            var obj = {};
                            obj.HyperHubID = objData.HyperHubDetailSelected[i].HypersproutID;
                            obj.HardwareVersion = objData.HyperHubDetailSelected[i].HardwareVersion;
                            obj.HubSerialNumber = objData.HyperHubDetailSelected[i].HypersproutSerialNumber;
                            obj.HubName = objData.HyperHubDetailSelected[i].HypersproutName;
                            obj.Latitude = objData.HyperHubDetailSelected[i].Hypersprout_Communications.Latitude;
                            obj.Longitude = objData.HyperHubDetailSelected[i].Hypersprout_Communications.Longitude;
                            obj.WifiIPAddress = objData.HyperHubDetailSelected[i].Hypersprout_Communications.IP_address_WiFi;
                            obj.WifiAccessPointPassword = objData.HyperHubDetailSelected[i].Hypersprout_Communications.AccessPointPassword;
                            obj.SimCardNumber = objData.HyperHubDetailSelected[i].Hypersprout_Communications.SimCardNumber;
                            obj.GprsMacID = objData.HyperHubDetailSelected[i].Hypersprout_Communications.MAC_ID_GPRS;
                            obj.WifiMacID = objData.HyperHubDetailSelected[i].Hypersprout_Communications.MAC_ID_WiFi;
                            obj.Status = objData.HyperHubDetailSelected[i].Status;
                            hubData.push(obj);
                        }
                    }
                    callBack(hubData);
                };
                       /**
                 * Returns parsed HS data
                 */
                this.getParsedHSConfigData = function (objData) {
                    var objConfigData = {};
                    if (!angular.isUndefinedOrNull(objData) &&
                        !angular.isUndefinedOrNull(objData.details[0])) {
                            var configDetails = objData.details[0];
                            objConfigData["SystemName"] = angular.isUndefinedOrNull(configDetails.System_Settings) ? "" : configDetails.System_Settings.sysname;
                            objConfigData["DeviceSerialNumber"] = configDetails.HypersproutSerialNumber;
                            objConfigData["EthernetMACAddress"] = angular.isUndefinedOrNull(configDetails.System_Info) ? "" : configDetails.System_Info.eth_mac;
                            objConfigData["CellularMACAddress"] = angular.isUndefinedOrNull(configDetails.System_Info) ? "" : configDetails.System_Info.cellular_mac;
                            objConfigData["WirelessMACAddress2_4"] = angular.isUndefinedOrNull(configDetails.System_Info) ? "" : configDetails.System_Info.wifi_mac_2;
                            objConfigData["WirelessMACAddress5"] = angular.isUndefinedOrNull(configDetails.System_Info) ? "" : configDetails.System_Info.wifi_mac_5;
                            objConfigData["PowerSource"] = angular.isUndefinedOrNull(configDetails.System_Info) ? "" : configDetails.System_Info.power_src;
                            objConfigData["Country"] = angular.isUndefinedOrNull(configDetails.System_Info) ? "" : configDetails.System_Info.country;
                            objConfigData["CurrentFirmwareVersion"] = angular.isUndefinedOrNull(configDetails.System_Info) ? "" : configDetails.System_Info.current_fw;
                            objConfigData["BackupFirmwareVersion"] = angular.isUndefinedOrNull(configDetails.System_Info) ? "" : configDetails.System_Info.backup_fw;
                            objConfigData["CloudStatus"] = angular.isUndefinedOrNull(configDetails.System_Info) ? "" : configDetails.System_Info.cloud_status;
                            objConfigData["UpTime"] = angular.isUndefinedOrNull(configDetails.System_Info) ? "" : configDetails.System_Info.up_time;

                            objConfigData["EthernetStatus"] = angular.isUndefinedOrNull(configDetails.System_Info) ? "" : configDetails.System_Info.eth_status;
                            objConfigData["EthernetIPv4Address"] = angular.isUndefinedOrNull(configDetails.System_Info) ? "" : configDetails.System_Info.eth_ipv4;
                            objConfigData["EthernetSubnetMask"] = angular.isUndefinedOrNull(configDetails.System_Info) ? "" : configDetails.System_Info.eth_subnet;
                            objConfigData["EthernetDefaultGateway"] = angular.isUndefinedOrNull(configDetails.System_Info) ? "" : configDetails.System_Info.eth_gw;
                            objConfigData["EthernetPrimaryDNS"] = angular.isUndefinedOrNull(configDetails.System_Info) ? "" : configDetails.System_Info.eth_pridns;
                            objConfigData["EthernetSecondaryDNS"] = angular.isUndefinedOrNull(configDetails.System_Info) ? "" : configDetails.System_Info.eth_secdns;
                            objConfigData["EthernetConfigurationType"] = angular.isUndefinedOrNull(configDetails.System_Info) ? "" : configDetails.System_Info.eth_conf_type;
                            objConfigData["EthernetLinkSpeed"] = angular.isUndefinedOrNull(configDetails.System_Info) ? "" : configDetails.System_Info.eth_link_speed;

                            objConfigData["CellularStatus"] = angular.isUndefinedOrNull(configDetails.System_Info) ? "" : configDetails.System_Info.cellular_state;;
                            objConfigData["CellularIPv4Address"] = angular.isUndefinedOrNull(configDetails.System_Info) ? "" : configDetails.System_Info.cellular_ipv4;;
                            objConfigData["CellularDefaultGateway"] = angular.isUndefinedOrNull(configDetails.System_Info) ? "" : configDetails.System_Info.cellular_gw;;
                            objConfigData["CellularSignalStrength"] = angular.isUndefinedOrNull(configDetails.System_Info) ? "" : configDetails.System_Info.cellular_sig_strength;;
                            objConfigData["CellularCarrierName"] = angular.isUndefinedOrNull(configDetails.System_Info) ? "" : configDetails.System_Info.cellular_carrier;


                            objConfigData["ITMStatus"] = angular.isUndefinedOrNull(configDetails.System_Info) ? "" : configDetails.System_Info.itm_status;
                            objConfigData["ITMSerialNumber"] = angular.isUndefinedOrNull(configDetails.System_Info) ? "" : configDetails.System_Info.itm_serial_num;
                            objConfigData["ITMModelNumber"] = angular.isUndefinedOrNull(configDetails.System_Info) ? "" : configDetails.System_Info.itm_model_num;
                            objConfigData["ITMFirmwareVersion"] = angular.isUndefinedOrNull(configDetails.System_Info) ? "" : configDetails.System_Info.itm_fw_version;
                            objConfigData["PhaseType"] = angular.isUndefinedOrNull(configDetails.System_Info) ? "" : configDetails.System_Info.itm_phase_type;

                            objConfigData["SettingsSystemName"] = angular.isUndefinedOrNull(configDetails.System_Settings) ? "" : configDetails.System_Settings.sysname;
                            objConfigData["SettingsCountry"] = angular.isUndefinedOrNull(configDetails.System_Settings.country) ? "" : configDetails.System_Settings.country.toUpperCase();
                            objConfigData["SettingsTimezone"] = angular.isUndefinedOrNull(configDetails.System_Settings) ? "" : configDetails.System_Settings.timezone;

                            objConfigData["BandwidthStatus"] =  angular.isUndefinedOrNull(configDetails.Bandwidth_Details) ? "" : configDetails.Bandwidth_Details.Bandwidth === 1 ? true : false;
                            objConfigData["DownloadBandwidth"] =  angular.isUndefinedOrNull(configDetails.Bandwidth_Details) ? "" : (configDetails.Bandwidth_Details.DownloadBandwidth).toString();
                            objConfigData["UploadBandwidth"] =  angular.isUndefinedOrNull(configDetails.Bandwidth_Details) ? "" : (configDetails.Bandwidth_Details.UploadBandwidth).toString();
                            
                            objConfigData["CloudHostName"] = angular.isUndefinedOrNull(configDetails.Cloud_Connectivity_Settings) ? "" : configDetails.Cloud_Connectivity_Settings.Hostname;
                            objConfigData["CloudSharedAccessKey"] = angular.isUndefinedOrNull(configDetails.Cloud_Connectivity_Settings) ? "" : configDetails.Cloud_Connectivity_Settings.SAK;

                            objConfigData["BackhaulCellularUserName"] = angular.isUndefinedOrNull(configDetails.BackHaul.Cellular) ? "" : configDetails.BackHaul.Cellular.username;
                            objConfigData["BackhaulCellularPassword"] = angular.isUndefinedOrNull(configDetails.BackHaul.Cellular) ? "" : configDetails.BackHaul.Cellular.password;
                            objConfigData["BackhaulCellularSimPin"] = angular.isUndefinedOrNull(configDetails.BackHaul.Cellular) ? "" : configDetails.BackHaul.Cellular.sim_pin;
                            objConfigData["BackhaulCellularNetworkSelection"] = angular.isUndefinedOrNull(configDetails.BackHaul.Cellular) ? "" : (configDetails.BackHaul.Cellular.network_selection).toString();
                            objConfigData["BackhaulCellularCarrierName"] = angular.isUndefinedOrNull(configDetails.BackHaul.Cellular.carrier) ? "" : configDetails.BackHaul.Cellular.carrier;
                            objConfigData["BackhaulCellularCarrierList"] = angular.isUndefinedOrNull(configDetails.BackHaul.Cellular.carrierList) ? [] : configDetails.BackHaul.Cellular.carrierList;

                            objConfigData["BackhaulEthernetIPType"] = angular.isUndefinedOrNull(configDetails.BackHaul.Ethernet) ? "" : configDetails.BackHaul.Ethernet.mode === 1 ? true : false;
                            objConfigData["BackhaulEthernetIPAddress"] = angular.isUndefinedOrNull(configDetails.BackHaul.Ethernet) ? "" : configDetails.BackHaul.Ethernet.ip;
                            objConfigData["BackhaulEthernetGateWay"] = angular.isUndefinedOrNull(configDetails.BackHaul.Ethernet) ? "" : configDetails.BackHaul.Ethernet.gateway;
                            objConfigData["BackhaulEthernetPrimaryDNS"] = angular.isUndefinedOrNull(configDetails.BackHaul.Ethernet) ? "" : configDetails.BackHaul.Ethernet.primary_dns;
                            objConfigData["BackhaulEthernetSecondaryDNS"] = angular.isUndefinedOrNull(configDetails.BackHaul.Ethernet) ? "" : configDetails.BackHaul.Ethernet.secondary_dns;
                            objConfigData["BackhaulEthernetSubnetMask"] = angular.isUndefinedOrNull(configDetails.BackHaul.Ethernet) ? "" : configDetails.BackHaul.Ethernet.subnet;

                            objConfigData["BackhaulAdvancedPrimary"] =  angular.isUndefinedOrNull(configDetails.BackHaul.Advanced) ? "" : (configDetails.BackHaul.Advanced.primary_backhaul).toString();
                            objConfigData["BackhaulAdvancedAutoSwitch"] =  angular.isUndefinedOrNull(configDetails.BackHaul.Advanced) ? "" : configDetails.BackHaul.Advanced.auto_switchover === 1 ? true : false;

                            objConfigData["FronthaulRadio2_4RadioMode"] = angular.isUndefinedOrNull(configDetails.FrontHaul.Radio_Configuration.two_four) ? "" : configDetails.FrontHaul.Radio_Configuration.two_four.radio_mode;
                            objConfigData["FronthaulRadio2_4ChannelWidth"] = angular.isUndefinedOrNull(configDetails.FrontHaul.Radio_Configuration.two_four) ? "" : configDetails.FrontHaul.Radio_Configuration.two_four.chan_bw;
                            objConfigData["FronthaulRadio2_4Channel"] = angular.isUndefinedOrNull(configDetails.FrontHaul.Radio_Configuration.two_four) ? "" : (configDetails.FrontHaul.Radio_Configuration.two_four.channel).toString();
                            objConfigData["FronthaulRadio2_4TransmitPower"] = angular.isUndefinedOrNull(configDetails.FrontHaul.Radio_Configuration.two_four) ? "" : (configDetails.FrontHaul.Radio_Configuration.two_four.txpower).toString();
                            objConfigData["FronthaulRadio2_4StreamSelection"] = angular.isUndefinedOrNull(configDetails.FrontHaul.Radio_Configuration.two_four) ? "" : configDetails.FrontHaul.Radio_Configuration.two_four.stream_selection;
                            objConfigData["FronthaulRadio2_4GuardInterval"] = angular.isUndefinedOrNull(configDetails.FrontHaul.Radio_Configuration.two_four) ? "" : configDetails.FrontHaul.Radio_Configuration.two_four.guard_interval;

                            objConfigData["FronthaulRadio5lRadioMode"] = angular.isUndefinedOrNull(configDetails.FrontHaul.Radio_Configuration.five_low) ? "" : configDetails.FrontHaul.Radio_Configuration.five_low.radio_mode;
                            objConfigData["FronthaulRadio5lChannelWidth"] = angular.isUndefinedOrNull(configDetails.FrontHaul.Radio_Configuration.five_low) ? "" : configDetails.FrontHaul.Radio_Configuration.five_low.chan_bw;
                            objConfigData["FronthaulRadio5lChannel"] = angular.isUndefinedOrNull(configDetails.FrontHaul.Radio_Configuration.five_low) ? "" : (configDetails.FrontHaul.Radio_Configuration.five_low.channel).toString();
                            objConfigData["FronthaulRadio5lTransmitPower"] = angular.isUndefinedOrNull(configDetails.FrontHaul.Radio_Configuration.five_low) ? "" : (configDetails.FrontHaul.Radio_Configuration.five_low.txpower).toString();
                            objConfigData["FronthaulRadio5lStreamSelection"] = angular.isUndefinedOrNull(configDetails.FrontHaul.Radio_Configuration.five_low) ? "" : configDetails.FrontHaul.Radio_Configuration.five_low.stream_selection;
                            objConfigData["FronthaulRadio5lGuardInterval"] = angular.isUndefinedOrNull(configDetails.FrontHaul.Radio_Configuration.five_low) ? "" : configDetails.FrontHaul.Radio_Configuration.five_low.guard_interval;

                            objConfigData["FronthaulRadio5hRadioMode"] = angular.isUndefinedOrNull(configDetails.FrontHaul.Radio_Configuration.five_high) ? "" : configDetails.FrontHaul.Radio_Configuration.five_high.radio_mode;
                            objConfigData["FronthaulRadio5hChannelWidth"] = angular.isUndefinedOrNull(configDetails.FrontHaul.Radio_Configuration.five_high) ? "" : configDetails.FrontHaul.Radio_Configuration.five_high.chan_bw;
                            objConfigData["FronthaulRadio5hChannel"] = angular.isUndefinedOrNull(configDetails.FrontHaul.Radio_Configuration.five_high) ? "" : (configDetails.FrontHaul.Radio_Configuration.five_high.channel).toString();
                            objConfigData["FronthaulRadio5hTransmitPower"] = angular.isUndefinedOrNull(configDetails.FrontHaul.Radio_Configuration.five_high) ? "" : (configDetails.FrontHaul.Radio_Configuration.five_high.txpower).toString();
                            objConfigData["FronthaulRadio5hStreamSelection"] = angular.isUndefinedOrNull(configDetails.FrontHaul.Radio_Configuration.five_high) ? "" : configDetails.FrontHaul.Radio_Configuration.five_high.stream_selection;
                            objConfigData["FronthaulRadio5hGuardInterval"] = angular.isUndefinedOrNull(configDetails.FrontHaul.Radio_Configuration.five_high) ? "" : configDetails.FrontHaul.Radio_Configuration.five_high.guard_interval;

                            objConfigData["FronthaulMesh2MeshID"] = angular.isUndefinedOrNull(configDetails.FrontHaul.Mesh_Configuration.two_four) ? "" : configDetails.FrontHaul.Mesh_Configuration.two_four.meshID;
                            objConfigData["FronthaulMesh2SecurityType"] = angular.isUndefinedOrNull(configDetails.FrontHaul.Mesh_Configuration.two_four.securityType) ? 'Open' : configDetails.FrontHaul.Mesh_Configuration.two_four.securityType;
                            objConfigData["FronthaulMesh2PresharedKey"] = angular.isUndefinedOrNull(configDetails.FrontHaul.Mesh_Configuration.two_four) ? "" : configDetails.FrontHaul.Mesh_Configuration.two_four.PSK;
                           
                            objConfigData["FronthaulMesh5hMeshID"] = angular.isUndefinedOrNull(configDetails.FrontHaul.Mesh_Configuration.five_high) ? "" : configDetails.FrontHaul.Mesh_Configuration.five_high.meshID;
                            objConfigData["FronthaulMesh5hSecurityType"] = angular.isUndefinedOrNull(configDetails.FrontHaul.Mesh_Configuration.five_high.securityType) ? 'Open' : configDetails.FrontHaul.Mesh_Configuration.five_high.securityType;
                            objConfigData["FronthaulMesh5hPresharedKey"] = angular.isUndefinedOrNull(configDetails.FrontHaul.Mesh_Configuration.five_high) ? "" : configDetails.FrontHaul.Mesh_Configuration.five_high.PSK;

                            objConfigData["FronthaulHotspot2Status"] = angular.isUndefinedOrNull(configDetails.FrontHaul.Hotspot_Configuration.two_four) ? "" : configDetails.FrontHaul.Hotspot_Configuration.two_four.status === 1 ? true : false;
                            objConfigData["FronthaulHotspot2SSID"] = angular.isUndefinedOrNull(configDetails.FrontHaul.Hotspot_Configuration.two_four) ? "" : configDetails.FrontHaul.Hotspot_Configuration.two_four.ssid;
                            objConfigData["FronthaulHotspot2WirelessSecurity"] = angular.isUndefinedOrNull(configDetails.FrontHaul.Hotspot_Configuration.two_four.security) ? 'Open' : configDetails.FrontHaul.Hotspot_Configuration.two_four.security;
                            objConfigData["FronthaulHotspot2Password"] = angular.isUndefinedOrNull(configDetails.FrontHaul.Hotspot_Configuration.two_four) ? "" : configDetails.FrontHaul.Hotspot_Configuration.two_four.password;
                            var hotspotDetails = angular.isUndefinedOrNull(configDetails.FrontHaul.Hotspot_Configuration.two_four.vap_details) ? "" : configDetails.FrontHaul.Hotspot_Configuration.two_four.vap_details;
                            objConfigData["hotspotDetailsStatus"] = angular.isUndefinedOrNull(hotspotDetails) ? "" : hotspotDetails;
                            objConfigData["FronthaulHotspot21Status"] = angular.isUndefinedOrNull(hotspotDetails) ? "" : hotspotDetails.length > 0 ?  (hotspotDetails[0].status === 1 ? true : false) : false;
                            objConfigData["FronthaulHotspot21SSID"] = angular.isUndefinedOrNull(hotspotDetails) ? "" : hotspotDetails.length > 0 ?  hotspotDetails[0].ssid : "";
                            objConfigData["FronthaulHotspot21WirelessSecurity"] = angular.isUndefinedOrNull(hotspotDetails) ? 'Open' : hotspotDetails.length > 0 ?  hotspotDetails[0].security: "Open";
                            objConfigData["FronthaulHotspot21Password"] = angular.isUndefinedOrNull(hotspotDetails) ? "" : hotspotDetails.length > 0 ?  hotspotDetails[0].password: "";
                            var hotspotDetails5_h = angular.isUndefinedOrNull(configDetails.FrontHaul.Hotspot_Configuration.five.vap_details) ? "" : configDetails.FrontHaul.Hotspot_Configuration.five.vap_details;
                            objConfigData["hotspotDetails5hStatus"] = angular.isUndefinedOrNull(hotspotDetails5_h) ? "" : hotspotDetails5_h;
                            objConfigData["FronthaulHotspot51Status"] = angular.isUndefinedOrNull(hotspotDetails5_h) ? "" : hotspotDetails5_h.length > 0 ?  (hotspotDetails5_h[0].status === 1 ? true : false) : false;
                            objConfigData["FronthaulHotspot51SSID"] = angular.isUndefinedOrNull(hotspotDetails5_h) ? "" : hotspotDetails5_h.length > 0 ?  hotspotDetails5_h[0].ssid : "";
                            objConfigData["FronthaulHotspot51WirelessSecurity"] = angular.isUndefinedOrNull(hotspotDetails5_h) ? 'Open' : hotspotDetails5_h.length > 0 ?  hotspotDetails5_h[0].security : "Open";
                            objConfigData["FronthaulHotspot51Password"] = angular.isUndefinedOrNull(hotspotDetails5_h) ? "" : hotspotDetails5_h.length > 0 ?  hotspotDetails5_h[0].password: "";

                            objConfigData["FronthaulHotspot52Status"] = angular.isUndefinedOrNull(hotspotDetails5_h) ? "" : hotspotDetails5_h.length > 1 ?  (hotspotDetails5_h[1].status === 1 ? true : false) : false;
                            objConfigData["FronthaulHotspot52SSID"] = angular.isUndefinedOrNull(hotspotDetails5_h) ? "" : hotspotDetails5_h.length > 1 ?  hotspotDetails5_h[1].ssid : "";
                            objConfigData["FronthaulHotspot52WirelessSecurity"] = angular.isUndefinedOrNull(hotspotDetails5_h) ? 'Open' : hotspotDetails5_h.length > 1 ?  hotspotDetails5_h[1].security : "Open";
                            objConfigData["FronthaulHotspot52Password"] = angular.isUndefinedOrNull(hotspotDetails5_h) ? "" : hotspotDetails5_h.length > 1 ?  hotspotDetails5_h[1].password : "";
                            
                            objConfigData["FronthaulDHCPType"] = "0";
                            objConfigData["FronthaulDHCPStatus"] = angular.isUndefinedOrNull(configDetails.FrontHaul.DHCP.Hotspot) ? "" : configDetails.FrontHaul.DHCP.Hotspot.Status === 1 ? true : false;
                            objConfigData["FronthaulDHCPStartAddress"] = angular.isUndefinedOrNull(configDetails.FrontHaul.DHCP.Hotspot) ? "" : configDetails.FrontHaul.DHCP.Hotspot.StartIpAddr;
                            objConfigData["FronthaulDHCPEndAddress"] = angular.isUndefinedOrNull(configDetails.FrontHaul.DHCP.Hotspot) ? "" : configDetails.FrontHaul.DHCP.Hotspot.EndIpAddr;
                            objConfigData["FronthaulDHCPSubnetMask"] = angular.isUndefinedOrNull(configDetails.FrontHaul.DHCP.Hotspot) ? "" : configDetails.FrontHaul.DHCP.Hotspot.Subnet;
                            objConfigData["FronthaulDHCPPrimaryDNS"] = angular.isUndefinedOrNull(configDetails.FrontHaul.DHCP.Hotspot) ? "" : configDetails.FrontHaul.DHCP.Hotspot.PrimaryDNS;
                            objConfigData["FronthaulDHCPSecondaryDNS"] = angular.isUndefinedOrNull(configDetails.FrontHaul.DHCP.Hotspot) ? "" : configDetails.FrontHaul.DHCP.Hotspot.SecondaryDNS;
                            objConfigData["FronthaulDHCPDefaultGateway"] = angular.isUndefinedOrNull(configDetails.FrontHaul.DHCP.Hotspot) ? "" : configDetails.FrontHaul.DHCP.Hotspot.Gateway;
                            
                            objConfigData["FronthaulDHCPMeshStatus"] = angular.isUndefinedOrNull(configDetails.FrontHaul.DHCP.Mesh) ? "" : configDetails.FrontHaul.DHCP.Mesh.Status === 1 ? true : false;
                            objConfigData["FronthaulDHCPMeshStartAddress"] = angular.isUndefinedOrNull(configDetails.FrontHaul.DHCP.Mesh) ? "" : configDetails.FrontHaul.DHCP.Mesh.StartIpAddr;
                            objConfigData["FronthaulDHCPMeshEndAddress"] = angular.isUndefinedOrNull(configDetails.FrontHaul.DHCP.Mesh) ? "" : configDetails.FrontHaul.DHCP.Mesh.EndIpAddr;
                            objConfigData["FronthaulDHCPMeshSubnetMask"] = angular.isUndefinedOrNull(configDetails.FrontHaul.DHCP.Mesh) ? "" : configDetails.FrontHaul.DHCP.Mesh.Subnet;
                            objConfigData["FronthaulDHCPMeshPrimaryDNS"] = angular.isUndefinedOrNull(configDetails.FrontHaul.DHCP.Mesh) ? "" : configDetails.FrontHaul.DHCP.Mesh.PrimaryDNS;
                            objConfigData["FronthaulDHCPMeshSecondaryDNS"] = angular.isUndefinedOrNull(configDetails.FrontHaul.DHCP.Mesh) ? "" : configDetails.FrontHaul.DHCP.Mesh.SecondaryDNS;
                            objConfigData["FronthaulDHCPMeshDefaultGateway"] = angular.isUndefinedOrNull(configDetails.FrontHaul.DHCP.Mesh) ? "" : configDetails.FrontHaul.DHCP.Mesh.Gateway; 
                    
                            objConfigData["OverVoltage"] = angular.isUndefinedOrNull(configDetails.Alarm) ? "" : configDetails.Alarm.OverVoltage;
                            objConfigData["UnderVoltage"] = angular.isUndefinedOrNull(configDetails.Alarm) ? "" : configDetails.Alarm.UnderVoltage;
                            objConfigData["OverLoadLine1_MD_Alarm"] = angular.isUndefinedOrNull(configDetails.Alarm) ? "" : configDetails.Alarm.OverLoadLine1_MD_Alarm;
                            objConfigData["OverLoadLine2_MD_Alarm"] = angular.isUndefinedOrNull(configDetails.Alarm) ? "" : configDetails.Alarm.OverLoadLine2_MD_Alarm;
                            objConfigData["OverLoadLine3_MD_Alarm"] = angular.isUndefinedOrNull(configDetails.Alarm) ? "" : configDetails.Alarm.OverLoadLine3_MD_Alarm;
                            objConfigData["OverFrequency"] = angular.isUndefinedOrNull(configDetails.Alarm) ? "" : configDetails.Alarm.OverFrequency;
                            objConfigData["UnderFrequency"] = angular.isUndefinedOrNull(configDetails.Alarm) ? "" : configDetails.Alarm.UnderFrequency;
                            objConfigData["PowerFailure"] = angular.isUndefinedOrNull(configDetails.Alarm) ? "" : configDetails.Alarm.PowerFailure;
                            objConfigData["CTOpen"] = angular.isUndefinedOrNull(configDetails.Alarm) ? "" : configDetails.Alarm.CTOpen;
                            objConfigData["PTOpen"] = angular.isUndefinedOrNull(configDetails.Alarm) ? "" : configDetails.Alarm.PTOpen;
                            objConfigData["OilLevelSensorFailure"] = angular.isUndefinedOrNull(configDetails.Alarm) ? "" : configDetails.Alarm.OilLevelSensorFailure;
                            objConfigData["TamperLid"] = angular.isUndefinedOrNull(configDetails.Alarm) ? "" : configDetails.Alarm.TamperLid;
                            objConfigData["TamperBox"] = angular.isUndefinedOrNull(configDetails.Alarm) ? "" : configDetails.Alarm.TamperBox;
                            objConfigData["LowOilLevel"] = angular.isUndefinedOrNull(configDetails.Alarm) ? "" : configDetails.Alarm.LowOilLevel;
                            objConfigData["HighOilTemperature"] = angular.isUndefinedOrNull(configDetails.Alarm) ? "" : configDetails.Alarm.HighOilTemperature;
                            objConfigData["LowBatteryVoltage"] = angular.isUndefinedOrNull(configDetails.Alarm) ? "" : configDetails.Alarm.LowBatteryVoltage;
                            objConfigData["BatteryFailure"] = angular.isUndefinedOrNull(configDetails.Alarm) ? "" : configDetails.Alarm.BatteryFailure;
                            objConfigData["BatteryRemoved"] = angular.isUndefinedOrNull(configDetails.Alarm) ? "" : configDetails.Alarm.BatteryRemoved;
                            objConfigData["PrimaryPowerUp"] = angular.isUndefinedOrNull(configDetails.Alarm) ? "" : configDetails.Alarm.PrimaryPowerUp;
                            objConfigData["PrimaryPowerDown"] = angular.isUndefinedOrNull(configDetails.Alarm) ? "" : configDetails.Alarm.PrimaryPowerDown;
                            objConfigData["NonTechnicalLoss"] = angular.isUndefinedOrNull(configDetails.Alarm) ? "" : configDetails.Alarm.NonTechnicalLoss;
                            objConfigData["MeterConnected"] = angular.isUndefinedOrNull(configDetails.Alarm) ? "" : configDetails.Alarm.MeterConnected;
                            objConfigData["MeterDisconnected"] = angular.isUndefinedOrNull(configDetails.Alarm) ? "" : configDetails.Alarm.MeterDisconnected;
                            objConfigData["WiFiCommunicationLoss"] = angular.isUndefinedOrNull(configDetails.Alarm) ? "" : configDetails.Alarm.WiFiCommunicationLoss;
                            objConfigData["LTECommunicationLoss_3G_4G"] = angular.isUndefinedOrNull(configDetails.Alarm) ? "" : configDetails.Alarm.LTECommunicationLoss_3G_4G;
                            objConfigData["Communicationattemptsexceeded"] = angular.isUndefinedOrNull(configDetails.Alarm) ? "" : configDetails.Alarm.Communicationattemptsexceeded;
                            objConfigData["UnAuthenticatedConnectionRequest"] = angular.isUndefinedOrNull(configDetails.Alarm) ? "" : configDetails.Alarm.UnAuthenticatedConnectionRequest;
  
                        }
                    return objConfigData;
                };

                      /**
                 * Returns parsed Meter data
                 */
                this.getParsedMeterConfigData = function (objData) {
                    var objConfigMeterData = {};
                    if (!angular.isUndefinedOrNull(objData) &&
                        !angular.isUndefinedOrNull(objData.details[0])) {
                            var configMeterDetails = objData.details[0];
                            objConfigMeterData["SystemName"] = angular.isUndefinedOrNull(configMeterDetails.System_Settings) ? "" : configMeterDetails.System_Settings.sysname;
                            objConfigMeterData["DeviceSerialNumber"] = configMeterDetails.MeterSerialNumber;
                            objConfigMeterData["WirelessMACAddress2_4"] = angular.isUndefinedOrNull(configMeterDetails.System_Info) ? "" : configMeterDetails.System_Info.wifi_mac_2;
                            objConfigMeterData["WirelessMACAddress5"] = angular.isUndefinedOrNull(configMeterDetails.System_Info) ? "" : configMeterDetails.System_Info.wifi_mac_5;
                            objConfigMeterData["Country"] = angular.isUndefinedOrNull(configMeterDetails.System_Info) ? "" : configMeterDetails.System_Info.country;
                            objConfigMeterData["CurrentFirmwareVersion"] = angular.isUndefinedOrNull(configMeterDetails.System_Info) ? "" : configMeterDetails.System_Info.current_fw;
                            objConfigMeterData["BackupFirmwareVersion"] = angular.isUndefinedOrNull(configMeterDetails.System_Info) ? "" : configMeterDetails.System_Info.backup_fw;
                            objConfigMeterData["UpTime"] = angular.isUndefinedOrNull(configMeterDetails.System_Info) ? "" : configMeterDetails.System_Info.up_time;
                          
                            objConfigMeterData["MeterStatus"] = angular.isUndefinedOrNull(configMeterDetails.System_Info) ? "" : configMeterDetails.System_Info.Status;
                            objConfigMeterData["MeterSerialNumber"] = angular.isUndefinedOrNull(configMeterDetails.System_Info) ? "" : configMeterDetails.System_Info.Manufacturer_serial_number;
                            objConfigMeterData["MeterModelNumber"] = angular.isUndefinedOrNull(configMeterDetails.System_Info) ? "" : configMeterDetails.System_Info.Manufacturer_model;
                            objConfigMeterData["MeterType"] = angular.isUndefinedOrNull(configMeterDetails.System_Info) ? "" : configMeterDetails.System_Info.Device_type;
                            objConfigMeterData["MeterFirmwareVersion"] = angular.isUndefinedOrNull(configMeterDetails.System_Info) ? "" : configMeterDetails.System_Info.Firmware_version;
                            objConfigMeterData["MeteHardwareVersion"] = angular.isUndefinedOrNull(configMeterDetails.System_Info) ? "" : configMeterDetails.System_Info.Hardware_version;
                            objConfigMeterData["MeterPhaseType"] = angular.isUndefinedOrNull(configMeterDetails.System_Info) ? "" : configMeterDetails.System_Info.Phase_type;
                            objConfigMeterData["MeterStandardType"] = angular.isUndefinedOrNull(configMeterDetails.System_Info) ? "" : configMeterDetails.System_Info.Standard_type;
                          
                            objConfigMeterData["WirelessRadio"] = angular.isUndefinedOrNull(configMeterDetails.System_Info) ? "" : configMeterDetails.System_Info.wifi0_freq;
                            objConfigMeterData["WirelessAntena"] = angular.isUndefinedOrNull(configMeterDetails.System_Info) ? "" : configMeterDetails.System_Info.wifi0_antenna;
                            objConfigMeterData["WirelessMode"] = angular.isUndefinedOrNull(configMeterDetails.System_Info) ? "" : configMeterDetails.System_Info.wifi0_mode;
                            objConfigMeterData["WirelessChannel"] = angular.isUndefinedOrNull(configMeterDetails.System_Info) ? "" : configMeterDetails.System_Info.backup_fw;
                            objConfigMeterData["FronthaulRadioRadioBand"] = angular.isUndefinedOrNull(configMeterDetails.FrontHaul.Radio_Configuration.radio_band) ? "" : configMeterDetails.FrontHaul.Radio_Configuration.radio_band;
                            objConfigMeterData["FronthaulRadioRadioMode"] = angular.isUndefinedOrNull(configMeterDetails.FrontHaul.Radio_Configuration) ? "" : configMeterDetails.FrontHaul.Radio_Configuration.radio_mode;
                            objConfigMeterData["FronthaulRadioChannelWidth"] = angular.isUndefinedOrNull(configMeterDetails.FrontHaul.Radio_Configuration) ? "" : configMeterDetails.FrontHaul.Radio_Configuration.chan_bw;
                            objConfigMeterData["FronthaulRadioChannel"] = angular.isUndefinedOrNull(configMeterDetails.FrontHaul.Radio_Configuration) ? "" : (configMeterDetails.FrontHaul.Radio_Configuration.channel).toString();
                            objConfigMeterData["FronthaulRadioTransmitPower"] = angular.isUndefinedOrNull(configMeterDetails.FrontHaul.Radio_Configuration) ? "" : (configMeterDetails.FrontHaul.Radio_Configuration.txpower).toString();
                            objConfigMeterData["FronthaulRadioStreamSelection"] = angular.isUndefinedOrNull(configMeterDetails.FrontHaul.Radio_Configuration.stream_selection) ? "" : configMeterDetails.FrontHaul.Radio_Configuration.stream_selection;
                            objConfigMeterData["FronthaulPrimMeshID"] = angular.isUndefinedOrNull(configMeterDetails.FrontHaul.Mesh_Configuration.Primary) ? "" : configMeterDetails.FrontHaul.Mesh_Configuration.Primary.meshID;
                            objConfigMeterData["FronthaulPrimSecurityType"] = angular.isUndefinedOrNull(configMeterDetails.FrontHaul.Mesh_Configuration.Primary.securityType) ? 'Open' : configMeterDetails.FrontHaul.Mesh_Configuration.Primary.securityType;
                            objConfigMeterData["FronthaulPrimPresharedKey"] = angular.isUndefinedOrNull(configMeterDetails.FrontHaul.Mesh_Configuration.Primary) ? "" : configMeterDetails.FrontHaul.Mesh_Configuration.Primary.PSK;
                            objConfigMeterData["FronthaulPrimMacAddress"] = angular.isUndefinedOrNull(configMeterDetails.FrontHaul.Mesh_Configuration.Primary.Mac) ? "" : configMeterDetails.FrontHaul.Mesh_Configuration.Primary.Mac;
                            objConfigMeterData["FronthaulPrimSerialNumber"] = angular.isUndefinedOrNull(configMeterDetails.FrontHaul.Mesh_Configuration.Primary.SerialNumber) ? "" : configMeterDetails.FrontHaul.Mesh_Configuration.Primary.SerialNumber;
                            objConfigMeterData["FronthaulPrimDeviceType"] = angular.isUndefinedOrNull(configMeterDetails.FrontHaul.Mesh_Configuration.Primary.DeviceType) ? "" : (configMeterDetails.FrontHaul.Mesh_Configuration.Primary.DeviceType).toString();
                            objConfigMeterData["FronthaulSecMeshID"] = angular.isUndefinedOrNull(configMeterDetails.FrontHaul.Mesh_Configuration.Secondary) ? "" : configMeterDetails.FrontHaul.Mesh_Configuration.Secondary.meshID;
                            objConfigMeterData["FronthaulSecSecurityType"] = angular.isUndefinedOrNull(configMeterDetails.FrontHaul.Mesh_Configuration.Secondary.securityType) ? 'Open' : configMeterDetails.FrontHaul.Mesh_Configuration.Secondary.securityType;
                            objConfigMeterData["FronthaulSecPresharedKey"] = angular.isUndefinedOrNull(configMeterDetails.FrontHaul.Mesh_Configuration.Secondary) ? "" : configMeterDetails.FrontHaul.Mesh_Configuration.Secondary.PSK;
                            objConfigMeterData["FronthaulSecMACAddress"] = angular.isUndefinedOrNull(configMeterDetails.FrontHaul.Mesh_Configuration.Secondary.Mac) ? "" : configMeterDetails.FrontHaul.Mesh_Configuration.Secondary.Mac;
                            objConfigMeterData["FronthaulSecSerialNumber"] = angular.isUndefinedOrNull(configMeterDetails.FrontHaul.Mesh_Configuration.Secondary.SerialNumber) ? "" : configMeterDetails.FrontHaul.Mesh_Configuration.Secondary.SerialNumber;
                            objConfigMeterData["FronthaulSecDeviceType"] = angular.isUndefinedOrNull(configMeterDetails.FrontHaul.Mesh_Configuration.Secondary.DeviceType) ? "" : (configMeterDetails.FrontHaul.Mesh_Configuration.Secondary.DeviceType).toString();
                           
                            objConfigMeterData["FronthaulHotspotSSID"] = angular.isUndefinedOrNull(configMeterDetails.FrontHaul.Hotspot_Configuration) ? "" : configMeterDetails.FrontHaul.Hotspot_Configuration.ssid;
                            objConfigMeterData["FronthaulHotspotWirelessSecurity"] = angular.isUndefinedOrNull(configMeterDetails.FrontHaul.Hotspot_Configuration.security) ? 'Open' : configMeterDetails.FrontHaul.Hotspot_Configuration.security;
                            objConfigMeterData["FronthaulHotspotPassword"] = angular.isUndefinedOrNull(configMeterDetails.FrontHaul.Hotspot_Configuration) ? "" : configMeterDetails.FrontHaul.Hotspot_Configuration.password;

                            objConfigMeterData["FronthaulDHCPStatus"] = angular.isUndefinedOrNull(configMeterDetails.FrontHaul.DHCP) ? "" : configMeterDetails.FrontHaul.DHCP.Status === 1 ? true : false;
                            objConfigMeterData["FronthaulDHCPStartAddress"] = angular.isUndefinedOrNull(configMeterDetails.FrontHaul.DHCP) ? "" : configMeterDetails.FrontHaul.DHCP.StartIpAddr;
                            objConfigMeterData["FronthaulDHCPEndAddress"] = angular.isUndefinedOrNull(configMeterDetails.FrontHaul.DHCP) ? "" : configMeterDetails.FrontHaul.DHCP.EndIpAddr;
                            objConfigMeterData["FronthaulDHCPSubnetMask"] = angular.isUndefinedOrNull(configMeterDetails.FrontHaul.DHCP) ? "" : configMeterDetails.FrontHaul.DHCP.Subnet;
                            objConfigMeterData["FronthaulDHCPPrimaryDNS"] = angular.isUndefinedOrNull(configMeterDetails.FrontHaul.DHCP) ? "" : configMeterDetails.FrontHaul.DHCP.PrimaryDNS;
                            objConfigMeterData["FronthaulDHCPSecondaryDNS"] = angular.isUndefinedOrNull(configMeterDetails.FrontHaul.DHCP) ? "" : configMeterDetails.FrontHaul.DHCP.SecondaryDNS;
                            objConfigMeterData["FronthaulDHCPDefaultGateway"] = angular.isUndefinedOrNull(configMeterDetails.FrontHaul.DHCP) ? "" : configMeterDetails.FrontHaul.DHCP.Gateway;
                    
                            objConfigMeterData["MeterUtilityID"] = angular.isUndefinedOrNull(configMeterDetails.Meter_Configuration) ? "" : (configMeterDetails.Meter_Configuration.uti_ID).toString();
                            objConfigMeterData["MeterCircuitID"] = angular.isUndefinedOrNull(configMeterDetails.Meter_Configuration) ? "" : (configMeterDetails.Meter_Configuration.cir_ID).toString();
                            objConfigMeterData["MeterCertificationNumber"] = angular.isUndefinedOrNull(configMeterDetails.Meter_Configuration) ? "" : (configMeterDetails.Meter_Configuration.cer_num).toString();
                            objConfigMeterData["MeterESN"] = angular.isUndefinedOrNull(configMeterDetails.Meter_Configuration) ? "" : (configMeterDetails.Meter_Configuration.esn).toString();
                          
                            objConfigMeterData["SettingsSystemName"] = angular.isUndefinedOrNull(configMeterDetails.System_Settings) ? "" : configMeterDetails.System_Settings.sysname;
                            objConfigMeterData["SettingsCountry"] = angular.isUndefinedOrNull(configMeterDetails.System_Settings.country) ? "" : configMeterDetails.System_Settings.country.toUpperCase();
                            objConfigMeterData["SettingsTimezone"] = angular.isUndefinedOrNull(configMeterDetails.System_Settings) ? "" : configMeterDetails.System_Settings.timezone;
             
                            objConfigMeterData["BandwidthStatus"] =  angular.isUndefinedOrNull(configMeterDetails.Bandwidth_Details) ? "" : configMeterDetails.Bandwidth_Details.Bandwidth === 1 ? true : false;
                            objConfigMeterData["DownloadBandwidth"] =  angular.isUndefinedOrNull(configMeterDetails.Bandwidth_Details) ? "" : (configMeterDetails.Bandwidth_Details.DownloadBandwidth).toString();
                            objConfigMeterData["UploadBandwidth"] =  angular.isUndefinedOrNull(configMeterDetails.Bandwidth_Details) ? "" : (configMeterDetails.Bandwidth_Details.UploadBandwidth).toString();

                            objConfigMeterData["VoltageSagLine1"] = angular.isUndefinedOrNull(configMeterDetails.Alarm) ? "" : configMeterDetails.Alarm.VoltageSagLine1;
                            objConfigMeterData["VoltageSagLine2"] = angular.isUndefinedOrNull(configMeterDetails.Alarm) ? "" : configMeterDetails.Alarm.VoltageSagLine2;
                            objConfigMeterData["VoltageSagLine3"] = angular.isUndefinedOrNull(configMeterDetails.Alarm) ? "" : configMeterDetails.Alarm.VoltageSagLine3;
                            objConfigMeterData["VoltageSwellLine1"] = angular.isUndefinedOrNull(configMeterDetails.Alarm) ? "" : configMeterDetails.Alarm.VoltageSwellLine1;
                            objConfigMeterData["VoltageSwellLine2"] = angular.isUndefinedOrNull(configMeterDetails.Alarm) ? "" : configMeterDetails.Alarm.VoltageSwellLine2;
                            objConfigMeterData["VoltageSwellLine3"] = angular.isUndefinedOrNull(configMeterDetails.Alarm) ? "" : configMeterDetails.Alarm.VoltageSwellLine3;
                            objConfigMeterData["VoltageUnbalance"] = angular.isUndefinedOrNull(configMeterDetails.Alarm) ? "" : configMeterDetails.Alarm.VoltageUnbalance;
                            objConfigMeterData["VoltageCablelossLine1"] = angular.isUndefinedOrNull(configMeterDetails.Alarm) ? "" : configMeterDetails.Alarm.VoltageCablelossLine1;
                            objConfigMeterData["VoltageCablelossLine2"] = angular.isUndefinedOrNull(configMeterDetails.Alarm) ? "" : configMeterDetails.Alarm.VoltageCablelossLine2;
                            objConfigMeterData["VoltageCablelossLine3"] = angular.isUndefinedOrNull(configMeterDetails.Alarm) ? "" : configMeterDetails.Alarm.VoltageCablelossLine3;                    
                            objConfigMeterData["VoltageTHDOverLimitLine1"] = angular.isUndefinedOrNull(configMeterDetails.Alarm) ? "" : configMeterDetails.Alarm.VoltageTHDOverLimitLine1;
                            objConfigMeterData["VoltageTHDOverLimitLine2"] = angular.isUndefinedOrNull(configMeterDetails.Alarm) ? "" : configMeterDetails.Alarm.VoltageTHDOverLimitLine2;
                            objConfigMeterData["VoltageTHDOverLimitLine3"] = angular.isUndefinedOrNull(configMeterDetails.Alarm) ? "" : configMeterDetails.Alarm.VoltageTHDOverLimitLine3;
                            objConfigMeterData["CurrentTHDOverLimitLine1"] = angular.isUndefinedOrNull(configMeterDetails.Alarm) ? "" : configMeterDetails.Alarm.CurrentTHDOverLimitLine1;
                            objConfigMeterData["CurrentTHDOverLimitLine2"] = angular.isUndefinedOrNull(configMeterDetails.Alarm) ? "" : configMeterDetails.Alarm.CurrentTHDOverLimitLine2;
                            objConfigMeterData["CurrentTHDOverLimitLine3"] = angular.isUndefinedOrNull(configMeterDetails.Alarm) ? "" : configMeterDetails.Alarm.CurrentTHDOverLimitLine3;
                            objConfigMeterData["PrimaryPowerUp"] = angular.isUndefinedOrNull(configMeterDetails.Alarm) ? "" : configMeterDetails.Alarm.PrimaryPowerUp;
                            objConfigMeterData["PrimaryPowerDown"] = angular.isUndefinedOrNull(configMeterDetails.Alarm) ? "" : configMeterDetails.Alarm.PrimaryPowerDown;
                            objConfigMeterData["LongOutagedetection"] = angular.isUndefinedOrNull(configMeterDetails.Alarm) ? "" : configMeterDetails.Alarm.LongOutagedetection;
                            objConfigMeterData["ShortOutagedetection"] = angular.isUndefinedOrNull(configMeterDetails.Alarm) ? "" : configMeterDetails.Alarm.ShortOutagedetection;
                            objConfigMeterData["NonvolatileMemoryFailed"] = angular.isUndefinedOrNull(configMeterDetails.Alarm) ? "" : configMeterDetails.Alarm.NonvolatileMemoryFailed;
                            objConfigMeterData["Clockerrordetected"] = angular.isUndefinedOrNull(configMeterDetails.Alarm) ? "" : configMeterDetails.Alarm.Clockerrordetected;
                            objConfigMeterData["LowBatteryVoltage"] = angular.isUndefinedOrNull(configMeterDetails.Alarm) ? "" : configMeterDetails.Alarm.LowBatteryVoltage;
                            objConfigMeterData["FlashMemoryFailed"] = angular.isUndefinedOrNull(configMeterDetails.Alarm) ? "" : configMeterDetails.Alarm.FlashMemoryFailed;
                            objConfigMeterData["Firmwareupgraded"] = angular.isUndefinedOrNull(configMeterDetails.Alarm) ? "" : configMeterDetails.Alarm.Firmwareupgraded;
                            objConfigMeterData["Demandreset"] = angular.isUndefinedOrNull(configMeterDetails.Alarm) ? "" : configMeterDetails.Alarm.Demandreset;
                            objConfigMeterData["TimeSynchronized"] = angular.isUndefinedOrNull(configMeterDetails.Alarm) ? "" : configMeterDetails.Alarm.TimeSynchronized;
                            objConfigMeterData["Historylogcleared"] = angular.isUndefinedOrNull(configMeterDetails.Alarm) ? "" : configMeterDetails.Alarm.Historylogcleared;
                            objConfigMeterData["Coverremoval"] = angular.isUndefinedOrNull(configMeterDetails.Alarm) ? "" : configMeterDetails.Alarm.Coverremoval;
                            objConfigMeterData["Terminalcoverremoval"] = angular.isUndefinedOrNull(configMeterDetails.Alarm) ? "" : configMeterDetails.Alarm.Terminalcoverremoval;
                            objConfigMeterData["MeterDisconnected"] = angular.isUndefinedOrNull(configMeterDetails.Alarm) ? "" : configMeterDetails.Alarm.MeterDisconnected;
                            objConfigMeterData["MeterConnected"] = angular.isUndefinedOrNull(configMeterDetails.Alarm) ? "" : configMeterDetails.Alarm.MeterConnected;
                            objConfigMeterData["DemandresponseofimportactpwrkWplus"] = angular.isUndefinedOrNull(configMeterDetails.Alarm) ? "" : configMeterDetails.Alarm.DemandresponseofimportactpwrkWplus;
                            objConfigMeterData["DemandresponseofexportactpwrkWminus"] = angular.isUndefinedOrNull(configMeterDetails.Alarm) ? "" : configMeterDetails.Alarm.DemandresponseofexportactpwrkWminus;
                            objConfigMeterData["DemandresponseofimportreactpwrkVarplus"] = angular.isUndefinedOrNull(configMeterDetails.Alarm) ? "" : configMeterDetails.Alarm.DemandresponseofimportreactpwrkVarplus;
                            objConfigMeterData["DemandresponseofexportreactpwrkVarminus"] = angular.isUndefinedOrNull(configMeterDetails.Alarm) ? "" : configMeterDetails.Alarm.DemandresponseofexportreactpwrkVarminus;   
                        }
                    return objConfigMeterData;
                };

            }]);
})(window.angular);
