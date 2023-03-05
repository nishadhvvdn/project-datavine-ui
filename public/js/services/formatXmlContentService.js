/**
 * Formats XML content
 */
(function (angular) {
    "use strict";
    angular
        .module('dataVINEApp')
        .service('formatXmlContent', ['commonService',
            function (commonService) {
                var energyDataValues = [{ "id": 1, "value": "None" }, { "id": 2, "value": "Wh delivered" }, { "id": 3, "value": "Wh received" }, { "id": 4, "value": "VAh delivered Arith" }, { "id": 5, "value": "VAh received Arith" }, { "id": 6, "value": "Wh Net" }, { "id": 7, "value": "Wh Uni-Directional" }, { "id": 8, "value": "Vh" }];
                var demandDataValues = [{ "id": 1, "value": "Max VA delivered Arith" }, { "id": 2, "value": "Max VA received Arith" }, { "id": 3, "value": "Max W delivered" }, { "id": 4, "value": "Max W received" }];
                var energyDataValues_q = [{ "id": 1, "value": "None" }, { "id": 2, "value": "Wh delivered" }, { "id": 3, "value": "Wh received" }, { "id": 4, "value": "VAh delivered Arith" }, { "id": 5, "value": "VAh received Arith" }, { "id": 6, "value": "Wh Net" }, { "id": 7, "value": "Wh Uni-Directional" }, { "id": 8, "value": "Vh" }];
                var intervalLengthValues = [{ "id": 1, "value": 1 }, { "id": 2, "value": 5 }, { "id": 3, "value": 15 }, { "id": 4, "value": 30 }, { "id": 5, "value": 60 }];
                var coldPickuptimeValues = [{ "id": 1, "value": 1 }, { "id": 2, "value": 15 }, { "id": 3, "value": 30 }, { "id": 4, "value": 45 }, { "id": 5, "value": 60 }, { "id": 6, "value": 75 }, { "id": 7, "value": 90 }, { "id": 8, "value": 105 }, { "id": 9, "value": 120 }];
                var powerOutageRecognitionTimeValues = [{ "id": 1, "value": 1 }, { "id": 2, "value": 15 }, { "id": 3, "value": 30 }, { "id": 4, "value": 45 }, { "id": 5, "value": 60 }, { "id": 6, "value": 75 }, { "id": 7, "value": 90 }, { "id": 8, "value": 105 }, { "id": 9, "value": 120 }];
                var intervalLengthLoadValues = [{ "id": 1, "value": 15 }, { "id": 2, "value": 30 }, { "id": 3, "value": 60 }];
                var quantityValues = [{ "id": 1, "value": "Default" }, { "id": 2, "value": "Quantity1" }, { "id": 3, "value": "Quantity2" }, { "id": 4, "value": "Quantity3" }];
                var phaseSelectionValues = [{ "id": 1, "value": "Phase A" }, { "id": 2, "value": "Phase B" }, { "id": 3, "value": "Phase C" }];
                var voltageIntervalLengthValues = [{ "id": 1, "value": "Default" }, { "id": 2, "value": "1 minute" }, { "id": 3, "value": "5 minutes" }, { "id": 4, "value": "15 minutes" }, { "id": 5, "value": "30 minutes" }, { "id": 6, "value": "60 minutes" }];
                var quantities_loadControlValues = [{ "id": 1, "value": "Disabled" }, { "id": 2, "value": "Enabled" }];
                var reconnectMethod_Values = [{ "id": 1, "value": "Option1" }, { "id": 2, "value": "Option2" }, { "id": 3, "value": "Option3" }];
                var outageLengthDropDown = [{ "id": 1, "value": 15 }, { "id": 2, "value": 30 }, { "id": 3, "value": 45 }, { "id": 4, "value": 60 }, { "id": 5, "value": 75 }, { "id": 6, "value": 90 }, { "id": 7, "value": 105 }, { "id": 8, "value": 120 }];

                /**
                 * Returns data from drop down menu
                 */
                this.getDropDownData = function () {
                    return {
                        'energyDataValues': energyDataValues,
                        'demandDataValues': demandDataValues,
                        'energyDataValues_q': energyDataValues_q,
                        'intervalLengthValues': intervalLengthValues,
                        'coldPickuptimeValues': coldPickuptimeValues,
                        'powerOutageRecognitionTimeValues': powerOutageRecognitionTimeValues,
                        'intervalLengthLoadValues': intervalLengthLoadValues,
                        'quantityValues': quantityValues,
                        'phaseSelectionValues': phaseSelectionValues,
                        'voltageIntervalLengthValues': voltageIntervalLengthValues,
                        'quantities_loadControlValues': quantities_loadControlValues,
                        'reconnectMethod_Values': reconnectMethod_Values,
                        'outageLengthDropDown': outageLengthDropDown
                    };
                };

                /**
                 * TBD
                 */
                this.validate = function (xmlContent) {
                    if (isNaN(xmlContent.PulseWeight1)) {
                        return {
                            "valid": false,
                            "msg": "Pulse Weight1 should be numeric"
                        };
                    } else {
                        if (!(parseInt(xmlContent.PulseWeight1) >= 0 &&
                            parseInt(xmlContent.PulseWeight1) <= 65535)) {
                            return {
                                "valid": false,
                                "msg": "Pulse Weight1 range should be in 0 to 65535"
                            };
                        }
                    }
                    if (isNaN(xmlContent.PulseWeight2)) {
                        return {
                            "valid": false,
                            "msg": "Pulse Weight2 should be numeric"
                        };
                    } else {
                        if (!(parseInt(xmlContent.PulseWeight2) >= 0 &&
                            parseInt(xmlContent.PulseWeight2) <= 65535)) {
                            return {
                                "valid": false,
                                "msg": "Pulse Weight2 range should be in 0 to 65535"
                            };
                        }
                    }
                    if (isNaN(xmlContent.PulseWeight3)) {
                        return {
                            "valid": false,
                            "msg": "Pulse Weight3 should be numeric"
                        };
                    } else {
                        if (!(parseInt(xmlContent.PulseWeight3) >= 0 &&
                            parseInt(xmlContent.PulseWeight3) <= 65535)) {
                            return {
                                "valid": false,
                                "msg": "Pulse Weight3 range should be in 0 to 65535"
                            };
                        }
                    }
                    if (isNaN(xmlContent.PulseWeight4)) {
                        return {
                            "valid": false,
                            "msg": "Pulse Weight4 should be numeric"
                        };
                    } else {
                        if (!(parseInt(xmlContent.PulseWeight4) >= 0 &&
                            parseInt(xmlContent.PulseWeight4) <= 65535)) {
                            return {
                                "valid": false,
                                "msg": "Pulse Weight4 range should be in 0 to 65535"
                            };
                        }
                    }
                    return {};
                };

                /**
                 * Format meter or hypersprout data
                 */
                this.formatMeterOrHyperSproutData = function (xmlContent, configType) {
                    var obj = {};
                    if (configType === 'Meter') {
                        xmlContent.Energy1 = commonService
                            .getObjectByValue(energyDataValues, xmlContent.Energy1).id;
                        xmlContent.Energy2 = commonService
                            .getObjectByValue(energyDataValues, xmlContent.Energy2).id;
                        xmlContent.Energy3 = commonService
                            .getObjectByValue(energyDataValues, xmlContent.Energy3).id;
                        xmlContent.Energy4 = commonService
                            .getObjectByValue(energyDataValues, xmlContent.Energy4).id;
                        xmlContent.LoadControlDisconnectThreshold = commonService
                            .getObjectByValue(quantities_loadControlValues, xmlContent.LoadControlDisconnectThreshold).id;
                        xmlContent.ReconnectMethod = commonService
                            .getObjectByValue(reconnectMethod_Values, xmlContent.ReconnectMethod).id;
                        xmlContent.VoltageMointorIntervalLength = commonService
                            .getObjectByValue(voltageIntervalLengthValues, xmlContent.VoltageMointorIntervalLength).id;
                        xmlContent.OTMultiplier = parseInt(xmlContent.OTMultiplier);
                    } else {
                        xmlContent.IntervalLengthVoltage = commonService
                            .getObjectByValue(voltageIntervalLengthValues, xmlContent.IntervalLengthVoltage).id;
                        xmlContent.CTMultiplier = parseInt(xmlContent.CTMultiplier);
                        xmlContent.Energy = commonService
                            .getObjectByValue(energyDataValues, xmlContent.Energy).id;
                    }
                    xmlContent.Demand = commonService
                        .getObjectByValue(demandDataValues, xmlContent.Demand).id;
                    xmlContent.DemandIntervalLength = commonService
                        .getObjectByValue(intervalLengthValues, parseInt(xmlContent.DemandIntervalLength)).id;
                    xmlContent.NumberofSubIntervals = commonService
                        .getObjectByValue(intervalLengthValues, parseInt(xmlContent.NumberofSubIntervals)).id;
                    xmlContent.ColdLoadPickupTimes = commonService
                        .getObjectByValue(coldPickuptimeValues, parseInt(xmlContent.ColdLoadPickupTimes)).id;
                    xmlContent.PowerOutageRecognitionTime = commonService
                        .getObjectByValue(powerOutageRecognitionTimeValues, parseInt(xmlContent.PowerOutageRecognitionTime)).id;
                    xmlContent.TestModeDemandIntervalLength = commonService
                        .getObjectByValue(quantityValues, xmlContent.TestModeDemandIntervalLength).id;
                    xmlContent.NumberofTestModeSubintervals = commonService
                        .getObjectByValue(quantityValues, xmlContent.NumberofTestModeSubintervals).id;
                    xmlContent.Quantity1 = commonService
                        .getObjectByValue(energyDataValues_q, xmlContent.Quantity1).id;
                    xmlContent.Quantity2 = commonService
                        .getObjectByValue(energyDataValues_q, xmlContent.Quantity2).id;
                    xmlContent.Quantity3 = commonService
                        .getObjectByValue(energyDataValues_q, xmlContent.Quantity3).id;
                    xmlContent.Quantity4 = commonService
                        .getObjectByValue(energyDataValues_q, xmlContent.Quantity4).id;
                    xmlContent.IntervalLength = commonService
                        .getObjectByValue(intervalLengthLoadValues, parseInt(xmlContent.IntervalLength)).id;
                    xmlContent.PhaseSelection = commonService
                        .getObjectByValue(phaseSelectionValues, xmlContent.PhaseSelection).id;
                    xmlContent.PulseWeight1 = parseInt(xmlContent.PulseWeight1);
                    xmlContent.PulseWeight2 = parseInt(xmlContent.PulseWeight2);
                    xmlContent.PulseWeight3 = parseInt(xmlContent.PulseWeight3);
                    xmlContent.PulseWeight4 = parseInt(xmlContent.PulseWeight4);
                    xmlContent.OutageLength = commonService
                        .getObjectByValue(outageLengthDropDown, parseInt(xmlContent.OutageLength)).id;
                    xmlContent.VTMultiplier = parseInt(xmlContent.VTMultiplier);
                    xmlContent.TimetoremaininTestMode = parseInt(xmlContent.TimetoremaininTestMode);
                    xmlContent.RegisterMultiplier = parseInt(xmlContent.RegisterMultiplier);
                    xmlContent.RMSVoltHighThreshold = parseInt(xmlContent.RMSVoltHighThreshold);
                    xmlContent.RMSVoltLoadThreshold = parseInt(xmlContent.RMSVoltLoadThreshold);
                    xmlContent.LowVoltageThreshold = parseInt(xmlContent.LowVoltageThreshold);
                    xmlContent.LowVoltageThresholdDeviation = parseInt(xmlContent.LowVoltageThresholdDeviation);
                    xmlContent.HighVoltageThresholdDeviation = parseInt(xmlContent.HighVoltageThresholdDeviation);
                    xmlContent.AllEvents = xmlContent.AllEvents === 'true' ? 1 : 0;
                    xmlContent.LinkFailure = xmlContent.LinkFailure === 'true' ? 1 : 0;
                    xmlContent.LinkMetric = xmlContent.LinkMetric === 'true' ? 1 : 0;
                    xmlContent.BillingDateCleard = xmlContent.BillingDateCleard === 'true' ? 1 : 0;
                    xmlContent.BillingScheduleExpiration = xmlContent.BillingScheduleExpiration === 'true' ? 1 : 0;
                    xmlContent.DemandResetOccured = xmlContent.DemandResetOccured === 'true' ? 1 : 0;
                    xmlContent.HistoryLogCleared = xmlContent.HistoryLogCleared === 'true' ? 1 : 0;
                    xmlContent.ConfigurationErrorDetected = xmlContent.ConfigurationErrorDetected === 'true' ? 1 : 0;
                    xmlContent.LoadProfileError = xmlContent.LoadProfileError === 'true' ? 1 : 0;
                    xmlContent.LowBatteryDetected = xmlContent.LowBatteryDetected === 'true' ? 1 : 0;
                    xmlContent.PrimaryPowerDown = xmlContent.PrimaryPowerDown === 'true' ? 1 : 0;
                    xmlContent.EnableVoltageMonitor = xmlContent.EnableVoltageMonitor === 'true' ? 1 : 0;
                    xmlContent.InterrogationSendSucceeded = xmlContent.InterrogationSendSucceeded === 'true' ? 1 : 0;
                    xmlContent.SendResponseFailed = xmlContent.SendResponseFailed === 'true' ? 1 : 0;
                    xmlContent.DeregistrationResult = xmlContent.DeregistrationResult === 'true' ? 1 : 0;
                    xmlContent.ReceivedMessageFrom = xmlContent.ReceivedMessageFrom === 'true' ? 1 : 0;
                    xmlContent.DataVineHyperSproutChange = xmlContent.DataVineHyperSproutChange === 'true' ? 1 : 0;
                    xmlContent.DataVineSyncFatherChange = xmlContent.DataVineSyncFatherChange === 'true' ? 1 : 0;
                    xmlContent.ZigbeeSETunnelingMessage = xmlContent.ZigbeeSETunnelingMessage === 'true' ? 1 : 0;
                    xmlContent.ZigbeeSimpleMeteringMessage = xmlContent.ZigbeeSimpleMeteringMessage === 'true' ? 1 : 0;
                    xmlContent.TableSendRequestFailed = xmlContent.TableSendRequestFailed === 'true' ? 1 : 0;
                    var msgObj = this.validate(xmlContent);
                    if (!angular.isUndefined(msgObj.valid)) return msgObj;
                    if (xmlContent.ColdLoadPickupTimes === null ||
                        xmlContent.ColdLoadPickupTimes === undefined ||
                        xmlContent.Demand === null ||
                        xmlContent.DemandIntervalLength === undefined ||
                        xmlContent.DemandIntervalLength === null ||
                        xmlContent.Energy === null ||
                        xmlContent.HighVoltageThresholdDeviation === null ||
                        xmlContent.IntervalLength === null ||
                        xmlContent.LowVoltageThreshold === null ||
                        xmlContent.LowVoltageThresholdDeviation === null ||
                        xmlContent.NumberofSubIntervals === null ||
                        xmlContent.NumberofTestModeSubintervals === null ||
                        xmlContent.OutageLength === undefined ||
                        xmlContent.OutageLength === null ||
                        xmlContent.PhaseSelection === null ||
                        xmlContent.PowerOutageRecognitionTime === undefined ||
                        xmlContent.PowerOutageRecognitionTime === null ||
                        xmlContent.PulseWeight1 === null ||
                        xmlContent.PulseWeight2 === null ||
                        xmlContent.PulseWeight3 === null ||
                        xmlContent.PulseWeight4 === null ||
                        xmlContent.Quantity1 === null ||
                        xmlContent.Quantity2 === null ||
                        xmlContent.Quantity3 === null ||
                        xmlContent.Quantity4 === null ||
                        xmlContent.RMSVoltHighThreshold === null ||
                        xmlContent.RMSVoltLoadThreshold === null ||
                        xmlContent.RegisterMultiplier === null ||
                        xmlContent.TestModeDemandIntervalLength === null ||
                        xmlContent.TimetoremaininTestMode === null ||
                        xmlContent.VTMultiplier === null ||
                        xmlContent.ColdLoadPickupTimes === "" ||
                        xmlContent.Demand === "" ||
                        xmlContent.DemandIntervalLength === "" ||
                        xmlContent.Energy === "" ||
                        xmlContent.HighVoltageThresholdDeviation === "" ||
                        xmlContent.IntervalLength === "" ||
                        xmlContent.LowVoltageThreshold === "" ||
                        xmlContent.LowVoltageThresholdDeviation === "" ||
                        xmlContent.NumberofSubIntervals === undefined ||
                        xmlContent.NumberofSubIntervals === "" ||
                        xmlContent.NumberofTestModeSubintervals === "" ||
                        xmlContent.OutageLength === "" ||
                        xmlContent.PhaseSelection === "" ||
                        xmlContent.PowerOutageRecognitionTime === "" ||
                        xmlContent.PulseWeight1 === "" ||
                        xmlContent.PulseWeight2 === "" ||
                        xmlContent.PulseWeight3 === "" ||
                        xmlContent.PulseWeight4 === "" ||
                        xmlContent.Quantity1 === "" ||
                        xmlContent.Quantity2 === "" ||
                        xmlContent.Quantity3 === "" ||
                        xmlContent.Quantity4 === "" ||
                        xmlContent.RMSVoltHighThreshold === "" ||
                        xmlContent.RMSVoltLoadThreshold === "" ||
                        xmlContent.RegisterMultiplier === "" ||
                        xmlContent.TestModeDemandIntervalLength === "" ||
                        xmlContent.TimetoremaininTestMode === "" ||
                        xmlContent.VTMultiplier === "") {
                        obj.valid = false;
                        return obj;
                    }
                    obj = xmlContent;
                    obj.valid = true;
                    return obj;
                };

            }]);
})(window.angular);