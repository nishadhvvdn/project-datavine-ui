/**
 * * @description
 * Controller for Editing Hypersprout / Meter
 */
(function (angular) {
    "use strict";
    angular.module('dataVINEApp')
        .controller('EditHyperSproutOrMeterCtrl',
            ['$scope', '$modalInstance', '$timeout',
                '$state', 'hypersproutMgmtService', 'record',
                'list', 'commonService', 'formatXmlContent',
                'type',
                function ($scope, $modalInstance, $timeout,
                    $state, hypersproutMgmtService, record,
                    list, commonService, formatXmlContent, type) {
                    $scope.configObj = {};
                    init();
                    var dropDownObj = formatXmlContent.getDropDownData();
                    $scope.quantities_energy = dropDownObj.energyDataValues;
                    $scope.quantities_demand = dropDownObj.demandDataValues;
                    $scope.demandIntervalLength_values =
                        dropDownObj.intervalLengthValues;
                    $scope.subInterval_values = dropDownObj.intervalLengthValues;
                    $scope.coldPickuptime_values = dropDownObj.coldPickuptimeValues;
                    $scope.powerOutageRecognitionTime_values =
                        dropDownObj.powerOutageRecognitionTimeValues;
                    $scope.registerOperation_TestModeDemandIntervalLengths =
                        dropDownObj.quantityValues;
                    $scope.registerOperation_NumberofTestModeSubintervals =
                        dropDownObj.quantityValues;
                    $scope.quantity1_values = dropDownObj.energyDataValues_q;
                    $scope.quantity2_values = dropDownObj.energyDataValues_q;
                    $scope.quantity3_values = dropDownObj.energyDataValues_q;
                    $scope.quantity4_values = dropDownObj.energyDataValues_q;
                    $scope.intervalLengthLoad_values =
                        dropDownObj.intervalLengthLoadValues;
                    $scope.phaseSelection_values =
                        dropDownObj.phaseSelectionValues;
                    $scope.voltageIntervalLength_values =
                        dropDownObj.voltageIntervalLengthValues;
                    $scope.quantities_reconnect =
                        dropDownObj.reconnectMethod_Values;
                    $scope.quantities_loadControl =
                        dropDownObj.quantities_loadControlValues;
                    $scope.outageLengthDropDown =
                        dropDownObj.outageLengthDropDown;
                    $scope.msg = '';
                    $scope.unique = true;

                    /**
                     * @description
                     * Function validates the name
                     * 
                     * @param nill
                     * @return Nil
                     
                     */
                    $scope.check = function () {
                        var groupObj = commonService
                            .check(list, 'Name', $scope.configObj.Name);
                        $scope.unique = groupObj.check;
                        $scope.configObj.Name = groupObj.name;
                        $scope.msg = groupObj.msg;
                        $scope.specialChar = groupObj.checkSpecialChar;
                    };

                    /**
                     * @description
                     * Function validates the profile
                     * 
                     * @param nill
                     * @return Nil
                     
                     */
                    $scope.customValidation = function () {
                        $scope.loadProfieObj = commonService
                            .loadPrfileValidation(
                                $scope.configObj.ConfigGroups_Info
                            );
                    };

                    /**
                     * Function initializes Edited configuration programs
                     */
                    function init() {
                        hypersproutMgmtService.ConfigProgramsEdit(
                            record.entity.Name, type
                        ).then(function (objData) {
                            if (!angular.isUndefinedOrNull(objData) &&
                                !angular.isUndefinedOrNull(objData.Docs)) {
                                $scope.configObj = {};
                                $scope.configObj["Name"] = "";
                                $scope.configObj["Description"] = record.entity.Description;
                                $scope.configObj["ConfigGroups_Info"] = {};
                                $scope.configObj["ConfigGroups_Info"]["Demand"] =
                                    commonService.getObjectById(
                                        dropDownObj.demandDataValues,
                                        parseInt(objData.Docs[0].ConfigGroups_Info.Demand)
                                    );
                                $scope.configObj["ConfigGroups_Info"]["DemandIntervalLength"] =
                                    commonService.getObjectById(
                                        dropDownObj.intervalLengthValues,
                                        objData.Docs[0].ConfigGroups_Info.DemandIntervalLength);
                                $scope.configObj["ConfigGroups_Info"]["NumberofSubIntervals"] =
                                    commonService.getObjectById(
                                        dropDownObj.intervalLengthValues,
                                        objData.Docs[0].ConfigGroups_Info.NumberofSubIntervals);
                                $scope.configObj["ConfigGroups_Info"]["ColdLoadPickupTimes"] =
                                    commonService.getObjectById(
                                        dropDownObj.coldPickuptimeValues,
                                        objData.Docs[0].ConfigGroups_Info.ColdLoadPickupTimes);
                                $scope.configObj["ConfigGroups_Info"]["PowerOutageRecognitionTime"] =
                                    commonService.getObjectById(
                                        dropDownObj.powerOutageRecognitionTimeValues,
                                        objData.Docs[0].ConfigGroups_Info.PowerOutageRecognitionTime);
                                $scope.configObj["ConfigGroups_Info"]["TestModeDemandIntervalLength"] =
                                    commonService.getObjectById(
                                        dropDownObj.quantityValues,
                                        objData.Docs[0].ConfigGroups_Info.TestModeDemandIntervalLength);
                                $scope.configObj["ConfigGroups_Info"]["NumberofTestModeSubintervals"] =
                                    commonService.getObjectById(
                                        dropDownObj.quantityValues,
                                        objData.Docs[0].ConfigGroups_Info.NumberofTestModeSubintervals);
                                $scope.configObj["ConfigGroups_Info"]["TimetoremaininTestMode"] =
                                    parseInt(objData.Docs[0].ConfigGroups_Info.TimetoremaininTestMode);
                                $scope.configObj["ConfigGroups_Info"]["DailySelfReadTime"] =
                                    (objData.Docs[0].ConfigGroups_Info.DailySelfReadTime === 1) ? true : false;
                                $scope.configObj["ConfigGroups_Info"]["Quantity1"] =
                                    commonService.getObjectById(
                                        dropDownObj.energyDataValues_q,
                                        objData.Docs[0].ConfigGroups_Info.Quantity1);
                                $scope.configObj["ConfigGroups_Info"]["Quantity2"] =
                                    commonService.getObjectById(
                                        dropDownObj.energyDataValues_q,
                                        objData.Docs[0].ConfigGroups_Info.Quantity2);
                                $scope.configObj["ConfigGroups_Info"]["Quantity3"] =
                                    commonService.getObjectById(
                                        dropDownObj.energyDataValues_q,
                                        objData.Docs[0].ConfigGroups_Info.Quantity3);
                                $scope.configObj["ConfigGroups_Info"]["Quantity4"] =
                                    commonService.getObjectById(
                                        dropDownObj.energyDataValues_q,
                                        objData.Docs[0].ConfigGroups_Info.Quantity4);
                                $scope.configObj["ConfigGroups_Info"]["IntervalLength"] =
                                    commonService.getObjectById(
                                        dropDownObj.intervalLengthLoadValues,
                                        objData.Docs[0].ConfigGroups_Info.IntervalLength);
                                $scope.configObj["ConfigGroups_Info"]["OutageLength"] =
                                    commonService.getObjectById(
                                        dropDownObj.outageLengthDropDown,
                                        objData.Docs[0].ConfigGroups_Info.OutageLength);
                                $scope.configObj["ConfigGroups_Info"]["PulseWeight1"] =
                                    parseInt(objData.Docs[0].ConfigGroups_Info.PulseWeight1);
                                $scope.configObj["ConfigGroups_Info"]["PulseWeight2"] =
                                    parseInt(objData.Docs[0].ConfigGroups_Info.PulseWeight2);
                                $scope.configObj["ConfigGroups_Info"]["PulseWeight3"] =
                                    parseInt(objData.Docs[0].ConfigGroups_Info.PulseWeight3);
                                $scope.configObj["ConfigGroups_Info"]["PulseWeight4"] =
                                    parseInt(objData.Docs[0].ConfigGroups_Info.PulseWeight4);
                                $scope.configObj["ConfigGroups_Info"]["AllEvents"] =
                                    (objData.Docs[0]
                                        .ConfigGroups_Info.AllEvents === 1) ? true : false;
                                $scope.configObj["ConfigGroups_Info"]["BillingDateCleard"] =
                                    (objData.Docs[0]
                                        .ConfigGroups_Info.BillingDateCleard === 1) ? true : false;
                                $scope.configObj["ConfigGroups_Info"]["BillingScheduleExpiration"] =
                                    (objData.Docs[0]
                                        .ConfigGroups_Info.BillingScheduleExpiration === 1) ? true : false;
                                $scope.configObj["ConfigGroups_Info"]["DemandResetOccured"] =
                                    (objData.Docs[0]
                                        .ConfigGroups_Info.DemandResetOccured === 1) ? true : false;
                                $scope.configObj["ConfigGroups_Info"]["HistoryLogCleared"] =
                                    (objData.Docs[0]
                                        .ConfigGroups_Info.HistoryLogCleared === 1) ? true : false;
                                $scope.configObj["ConfigGroups_Info"]["ConfigurationErrorDetected"] =
                                    (objData.Docs[0].ConfigGroups_Info.ConfigurationErrorDetected === 1) ? true : false;
                                $scope.configObj["ConfigGroups_Info"]["LoadProfileError"] =
                                    (objData.Docs[0]
                                        .ConfigGroups_Info.LoadProfileError === 1) ? true : false;
                                $scope.configObj["ConfigGroups_Info"]["LowBatteryDetected"] =
                                    (objData.Docs[0]
                                        .ConfigGroups_Info.LowBatteryDetected === 1) ? true : false;
                                $scope.configObj["ConfigGroups_Info"]["PrimaryPowerDown"] =
                                    (objData.Docs[0]
                                        .ConfigGroups_Info.PrimaryPowerDown === 1) ? true : false;
                                $scope.configObj["ConfigGroups_Info"]["OTMultiplier"] =
                                    objData.Docs[0]
                                        .ConfigGroups_Info.OTMultiplier;
                                $scope.configObj["ConfigGroups_Info"]["VTMultiplier"] =
                                    objData.Docs[0]
                                        .ConfigGroups_Info.VTMultiplier;
                                $scope.configObj["ConfigGroups_Info"]["RegisterMultiplier"] =
                                    objData.Docs[0]
                                        .ConfigGroups_Info.RegisterMultiplier;
                                $scope.configObj["ConfigGroups_Info"]["EnableVoltageMonitor"] =
                                    (objData.Docs[0]
                                        .ConfigGroups_Info.EnableVoltageMonitor === 1) ? true : false;
                                $scope.configObj["ConfigGroups_Info"]["PhaseSelection"] =
                                    commonService.getObjectById(
                                        dropDownObj.phaseSelectionValues,
                                        objData.Docs[0]
                                            .ConfigGroups_Info.PhaseSelection);
                                $scope.configObj["ConfigGroups_Info"]["RMSVoltLoadThreshold"] =
                                    parseInt(objData.Docs[0]
                                        .ConfigGroups_Info.RMSVoltLoadThreshold);
                                $scope.configObj["ConfigGroups_Info"]["RMSVoltHighThreshold"] =
                                    parseInt(objData.Docs[0]
                                        .ConfigGroups_Info.RMSVoltHighThreshold);
                                $scope.configObj["ConfigGroups_Info"]["LowVoltageThreshold"] =
                                    parseInt(objData.Docs[0]
                                        .ConfigGroups_Info.LowVoltageThreshold);
                                $scope.configObj["ConfigGroups_Info"]["LowVoltageThresholdDeviation"] =
                                    parseInt(objData.Docs[0]
                                        .ConfigGroups_Info.LowVoltageThresholdDeviation);
                                $scope.configObj["ConfigGroups_Info"]["HighVoltageThresholdDeviation"] =
                                    parseInt(objData.Docs[0]
                                        .ConfigGroups_Info.HighVoltageThresholdDeviation);
                                $scope.configObj["ConfigGroups_Info"]["LinkFailure"] =
                                    (objData.Docs[0]
                                        .ConfigGroups_Info.LinkFailure === 1) ? true : false;
                                $scope.configObj["ConfigGroups_Info"]["LinkMetric"] =
                                    (objData.Docs[0]
                                        .ConfigGroups_Info.LinkMetric === 1) ? true : false;
                                $scope.configObj["ConfigGroups_Info"]["InterrogationSendSucceeded"] =
                                    (objData.Docs[0]
                                        .ConfigGroups_Info.InterrogationSendSucceeded === 1) ? true : false;
                                $scope.configObj["ConfigGroups_Info"]["SendResponseFailed"] =
                                    (objData.Docs[0]
                                        .ConfigGroups_Info.SendResponseFailed === 1) ? true : false;
                                $scope.configObj["ConfigGroups_Info"]["DeregistrationResult"] =
                                    (objData.Docs[0]
                                        .ConfigGroups_Info.DeregistrationResult === 1) ? true : false;
                                $scope.configObj["ConfigGroups_Info"]["ReceivedMessageFrom"] =
                                    (objData.Docs[0]
                                        .ConfigGroups_Info.ReceivedMessageFrom === 1) ? true : false;
                                $scope.configObj["ConfigGroups_Info"]["DataVineHyperSproutChange"] =
                                    (objData.Docs[0]
                                        .ConfigGroups_Info.DataVineHyperSproutChange === 1) ? true : false;
                                $scope.configObj["ConfigGroups_Info"]["DataVineSyncFatherChange"] =
                                    (objData.Docs[0]
                                        .ConfigGroups_Info.DataVineSyncFatherChange === 1) ? true : false;
                                $scope.configObj["ConfigGroups_Info"]["ZigbeeSETunnelingMessage"] =
                                    (objData.Docs[0]
                                        .ConfigGroups_Info.ZigbeeSETunnelingMessage === 1) ? true : false;
                                $scope.configObj["ConfigGroups_Info"]["ZigbeeSimpleMeteringMessage"] =
                                    (objData.Docs[0]
                                        .ConfigGroups_Info.ZigbeeSimpleMeteringMessage === 1) ? true : false;
                                $scope.configObj["ConfigGroups_Info"]["TableSendRequestFailed"] = (objData.Docs[0].ConfigGroups_Info.TableSendRequestFailed === 1) ? true : false;
                                if (type !== 'Meter') {
                                    $scope.configObj["ConfigGroups_Info"]["Energy"] =
                                        commonService.getObjectById(
                                            dropDownObj.energyDataValues,
                                            objData.Docs[0].ConfigGroups_Info.Energy);
                                    $scope.configObj["ConfigGroups_Info"]["CTMultiplier"] =
                                        objData.Docs[0].ConfigGroups_Info.CTMultiplier;
                                    $scope.configObj["ConfigGroups_Info"]["IntervalLengthVoltage"] =
                                        commonService.getObjectById(
                                            dropDownObj.voltageIntervalLengthValues,
                                            objData.Docs[0].ConfigGroups_Info.IntervalLengthVoltage);
                                } else {
                                    $scope.configObj["ConfigGroups_Info"]["Energy1"] =
                                        commonService.getObjectById(
                                            dropDownObj.energyDataValues,
                                            objData.Docs[0].ConfigGroups_Info.Energy1);
                                    $scope.configObj["ConfigGroups_Info"]["Energy2"] =
                                        commonService.getObjectById(
                                            dropDownObj.energyDataValues,
                                            objData.Docs[0].ConfigGroups_Info.Energy2);
                                    $scope.configObj["ConfigGroups_Info"]["Energy3"] =
                                        commonService.getObjectById(
                                            dropDownObj.energyDataValues,
                                            objData.Docs[0].ConfigGroups_Info.Energy3);
                                    $scope.configObj["ConfigGroups_Info"]["Energy4"] =
                                        commonService.getObjectById(
                                            dropDownObj.energyDataValues,
                                            objData.Docs[0].ConfigGroups_Info.Energy4);
                                    $scope.configObj["ConfigGroups_Info"]["LockoutLoginattemptsOptical"] =
                                        objData.Docs[0].ConfigGroups_Info.LockoutLoginattemptsOptical;
                                    $scope.configObj["ConfigGroups_Info"]["LockoutLogoutminutesOptical"] =
                                        objData.Docs[0].ConfigGroups_Info.LockoutLogoutminutesOptical;
                                    $scope.configObj["ConfigGroups_Info"]["LockoutLoginattemptsLAN"] =
                                        objData.Docs[0].ConfigGroups_Info.LockoutLoginattemptsLAN;
                                    $scope.configObj["ConfigGroups_Info"]["LockoutLogoutminutesLAN"] =
                                        objData.Docs[0].ConfigGroups_Info.LockoutLogoutminutesLAN;
                                    $scope.configObj["ConfigGroups_Info"]["ConsecutiveLAN"] =
                                        objData.Docs[0].ConfigGroups_Info.ConsecutiveLAN;
                                    $scope.configObj["ConfigGroups_Info"]["LanLinkMetric"] =
                                        objData.Docs[0].ConfigGroups_Info.LanLinkMetric;
                                    $scope.configObj["ConfigGroups_Info"]["VoltageMointorIntervalLength"] =
                                        commonService.getObjectById(
                                            dropDownObj.voltageIntervalLengthValues,
                                            objData.Docs[0].ConfigGroups_Info.VoltageMointorIntervalLength);
                                    $scope.configObj["ConfigGroups_Info"]["LoadControlDisconnectThreshold"] =
                                        commonService.getObjectById(
                                            dropDownObj.quantities_loadControlValues,
                                            parseInt(objData.Docs[0].ConfigGroups_Info.LoadControlDisconnectThreshold));
                                    $scope.configObj["ConfigGroups_Info"]["ReconnectMethod"] =
                                        commonService.getObjectById(
                                            dropDownObj.reconnectMethod_Values,
                                            parseInt(objData.Docs[0].ConfigGroups_Info.ReconnectMethod));
                                }
                            }
                        });
                    };

                    /**
                     * @description
                     * Function for creating and opening PDF
                     * 
                     * @param nill
                     * @return Nil
                     
                     */
                    $scope.pdf = function () {
                        var pdfObj = angular.copy($scope.configObj);
                        commonService.pdfPrintData(pdfObj, type, function (pdfObj) {
                            commonService.openPDF(pdfObj, "pdf");
                        });
                    };

                    /**
                     * @description
                     * Function for creating and opening Excel
                     * 
                     * @param nill
                     * @return Nil
                     
                     */
                    $scope.excel = function () {
                        var pdfObj = angular.copy($scope.configObj);
                        commonService.pdfPrintData(pdfObj, type, function (pdfObj) {
                            commonService.downloadCSV(pdfObj);
                        });
                    };

                    /**
                     * @description
                     * Function to print
                     * 
                     * @param nill
                     * @return Nil
                     
                     */
                    $scope.printCart = function () {
                        var pdfObj = angular.copy($scope.configObj);
                        commonService.pdfPrintData(pdfObj, type, function (pdfObj) {
                            commonService.openPDF(pdfObj, "print");
                        });
                    };

                    /**
                     * @description
                     * Function to save edited hypersprout and Meter data
                     * 
                     * @param nill
                     * @return Nil
                     
                     */
                    $scope.Save = function () {
                        var obj = angular.copy($scope.configObj);
                        obj.ConfigGroups_Info.Demand = obj.ConfigGroups_Info.Demand.id;
                        obj.ConfigGroups_Info.DemandIntervalLength =
                            obj.ConfigGroups_Info.DemandIntervalLength.id;
                        obj.ConfigGroups_Info.ColdLoadPickupTimes =
                            obj.ConfigGroups_Info.ColdLoadPickupTimes.id;
                        obj.ConfigGroups_Info.PowerOutageRecognitionTime =
                            obj.ConfigGroups_Info.PowerOutageRecognitionTime.id;
                        obj.ConfigGroups_Info.TestModeDemandIntervalLength =
                            obj.ConfigGroups_Info.TestModeDemandIntervalLength.id;
                        obj.ConfigGroups_Info.NumberofTestModeSubintervals =
                            obj.ConfigGroups_Info.NumberofTestModeSubintervals.id;
                        obj.ConfigGroups_Info.Quantity1 =
                            obj.ConfigGroups_Info.Quantity1.id;
                        obj.ConfigGroups_Info.Quantity2 =
                            obj.ConfigGroups_Info.Quantity2.id;
                        obj.ConfigGroups_Info.Quantity3 =
                            obj.ConfigGroups_Info.Quantity3.id;
                        obj.ConfigGroups_Info.Quantity4 =
                            obj.ConfigGroups_Info.Quantity4.id;
                        obj.ConfigGroups_Info.NumberofSubIntervals =
                            obj.ConfigGroups_Info.NumberofSubIntervals.id;
                        obj.ConfigGroups_Info.IntervalLength =
                            obj.ConfigGroups_Info.IntervalLength.id;
                        obj.ConfigGroups_Info.PhaseSelection =
                            obj.ConfigGroups_Info.PhaseSelection.id;
                        obj.ConfigGroups_Info.PulseWeight1 =
                            parseInt(obj.ConfigGroups_Info.PulseWeight1);
                        obj.ConfigGroups_Info.PulseWeight2 =
                            parseInt(obj.ConfigGroups_Info.PulseWeight2);
                        obj.ConfigGroups_Info.PulseWeight3 =
                            parseInt(obj.ConfigGroups_Info.PulseWeight3);
                        obj.ConfigGroups_Info.PulseWeight4 =
                            parseInt(obj.ConfigGroups_Info.PulseWeight4);
                        obj.ConfigGroups_Info.OutageLength =
                            obj.ConfigGroups_Info.OutageLength.id;
                        obj.ConfigGroups_Info.AllEvents =
                            obj.ConfigGroups_Info.AllEvents ? 1 : 0;
                        obj.ConfigGroups_Info.BillingDateCleard =
                            obj.ConfigGroups_Info.BillingDateCleard ? 1 : 0;
                        obj.ConfigGroups_Info.BillingScheduleExpiration =
                            obj.ConfigGroups_Info.BillingScheduleExpiration ? 1 : 0;
                        obj.ConfigGroups_Info.DemandResetOccured =
                            obj.ConfigGroups_Info.DemandResetOccured ? 1 : 0;
                        obj.ConfigGroups_Info.HistoryLogCleared =
                            obj.ConfigGroups_Info.HistoryLogCleared ? 1 : 0;
                        obj.ConfigGroups_Info.ConfigurationErrorDetected =
                            obj.ConfigGroups_Info.ConfigurationErrorDetected ? 1 : 0;
                        obj.ConfigGroups_Info.LoadProfileError =
                            obj.ConfigGroups_Info.LoadProfileError ? 1 : 0;
                        obj.ConfigGroups_Info.LowBatteryDetected =
                            obj.ConfigGroups_Info.LowBatteryDetected ? 1 : 0;
                        obj.ConfigGroups_Info.PrimaryPowerDown =
                            obj.ConfigGroups_Info.PrimaryPowerDown ? 1 : 0;
                        obj.ConfigGroups_Info.EnableVoltageMonitor =
                            obj.ConfigGroups_Info.EnableVoltageMonitor ? 1 : 0;
                        obj.ConfigGroups_Info.LinkFailure =
                            obj.ConfigGroups_Info.LinkFailure ? 1 : 0;
                        obj.ConfigGroups_Info.LinkMetric =
                            obj.ConfigGroups_Info.LinkMetric ? 1 : 0;
                        obj.ConfigGroups_Info.InterrogationSendSucceeded =
                            obj.ConfigGroups_Info.InterrogationSendSucceeded ? 1 : 0;
                        obj.ConfigGroups_Info.SendResponseFailed =
                            obj.ConfigGroups_Info.SendResponseFailed ? 1 : 0;
                        obj.ConfigGroups_Info.DeregistrationResult =
                            obj.ConfigGroups_Info.DeregistrationResult ? 1 : 0;
                        obj.ConfigGroups_Info.ReceivedMessageFrom =
                            obj.ConfigGroups_Info.ReceivedMessageFrom ? 1 : 0;
                        obj.ConfigGroups_Info.DataVineHyperSproutChange =
                            obj.ConfigGroups_Info.DataVineHyperSproutChange ? 1 : 0;
                        obj.ConfigGroups_Info.DataVineSyncFatherChange =
                            obj.ConfigGroups_Info.DataVineSyncFatherChange ? 1 : 0;
                        obj.ConfigGroups_Info.ZigbeeSETunnelingMessage =
                            obj.ConfigGroups_Info.ZigbeeSETunnelingMessage ? 1 : 0;
                        obj.ConfigGroups_Info.ZigbeeSimpleMeteringMessage =
                            obj.ConfigGroups_Info.ZigbeeSimpleMeteringMessage ? 1 : 0;
                        obj.ConfigGroups_Info.TableSendRequestFailed =
                            obj.ConfigGroups_Info.TableSendRequestFailed ? 1 : 0;

                        if (type !== 'Meter') {
                            obj.ConfigGroups_Info.Energy =
                                obj.ConfigGroups_Info.Energy.id;
                            obj.ConfigGroups_Info.IntervalLengthVoltage =
                                obj.ConfigGroups_Info.IntervalLengthVoltage.id;
                        } else {
                            obj.ConfigGroups_Info.Energy1 =
                                obj.ConfigGroups_Info.Energy1.id;
                            obj.ConfigGroups_Info.Energy2 =
                                obj.ConfigGroups_Info.Energy2.id;
                            obj.ConfigGroups_Info.Energy3 =
                                obj.ConfigGroups_Info.Energy3.id;
                            obj.ConfigGroups_Info.Energy4 =
                                obj.ConfigGroups_Info.Energy4.id;
                            obj.ConfigGroups_Info.VoltageMointorIntervalLength =
                                obj.ConfigGroups_Info.VoltageMointorIntervalLength.id;
                            obj.ConfigGroups_Info.LoadControlDisconnectThreshold =
                                obj.ConfigGroups_Info.LoadControlDisconnectThreshold.id;
                            obj.ConfigGroups_Info.ReconnectMethod =
                                obj.ConfigGroups_Info.ReconnectMethod.id;
                        }
                        delete obj.Name;
                        delete obj.Description;
                        hypersproutMgmtService.ConfUploadConfigProgram(
                            $scope.configObj.Name, obj.ConfigGroups_Info,
                            $scope.configObj.Description, type)
                            .then(function (objData) {
                                if (!angular.isUndefinedOrNull(objData)) {
                                    swal(commonService.addTrademark(objData.Status));
                                }
                                $state.reload();
                                $modalInstance.dismiss();
                            });
                    };

                    $scope.model = {
                        name: 'Tabs'
                    };

                    /**
                     * @description
                     * Function to close pop-up after confirmation
                     * 
                     * @param nill
                     * @return Nil
                     
                     */
                    $scope.cancel = function () {
                        if (this.config_form.$dirty) {
                            swal({
                                title: "Warning!",
                                text: "If you click cancel you will " +
                                    "loose your changes, Do you want to continue?",
                                type: "warning",
                                showCancelButton: true,
                                confirmButtonText: 'Yes',
                                cancelButtonText: "No",
                            }, function (isConfirm) {
                                if (isConfirm) {
                                    $modalInstance.dismiss();
                                }

                            });
                        } else {
                            $state.reload();
                            $modalInstance.dismiss();
                        }
                    };
                }]);
})(window.angular);