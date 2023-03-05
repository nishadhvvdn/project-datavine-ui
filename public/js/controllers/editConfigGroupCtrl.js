/**
 * * @description
 * Controller for Editing the Group Configuration
 */
(function (angular) {
    "use strict";
    angular.module('dataVINEApp')
        .controller('editConfigGroupCtrl',
            ['$scope', '$timeout', '$modalInstance',
                'hypersproutMgmtService', 'record', '$state',
                'commonService', 'formatXmlContent', 'type',
                function ($scope, $timeout, $modalInstance,
                    hypersproutMgmtService, record, $state,
                    commonService, formatXmlContent, type) {

                    /**
                     *  @description
                     * Function to close pop-up after confirmation
                     * 
                     * @param nil
                     * @return Nil
                     
                     */
                    $scope.cancel = function () {
                        if (this.config_form.$dirty) {
                            swal({
                                title: "Warning!", text: "If you click " +
                                    "cancel you will loose your changes, " +
                                    "Do you want to continue?",
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
                    init(loadData);
                    $scope.configObj = {};
                    var dropDownObj = formatXmlContent.getDropDownData();
                    $scope.quantities_energy = dropDownObj.energyDataValues;
                    $scope.quantities_demand = dropDownObj.demandDataValues;
                    $scope.demandIntervalLength_values =
                        dropDownObj.intervalLengthValues;
                    $scope.subInterval_values = dropDownObj.intervalLengthValues;
                    $scope.coldPickuptime_values =
                        dropDownObj.coldPickuptimeValues;
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
                    $scope.intervalLengthLoad_values = dropDownObj.intervalLengthLoadValues;
                    $scope.phaseSelection_values = dropDownObj.phaseSelectionValues;
                    $scope.voltageIntervalLength_values =
                        dropDownObj.voltageIntervalLengthValues;

                    /**
                     * Function to initialize config programs
                     */
                    function init(callback) {
                        var configProgDetails = [];
                        hypersproutMgmtService.configPrograms(type)
                            .then(function (resObjData) {
                                if (!angular.isUndefinedOrNull(resObjData) &&
                                    !angular.isUndefinedOrNull(resObjData
                                        .configProgramData)) {
                                    for (var count in resObjData.configProgramData) {
                                        if (resObjData.configProgramData
                                            .hasOwnProperty(count)) {
                                            configProgDetails.push(
                                                resObjData.configProgramData[count].Name
                                            );
                                        }
                                    }
                                    $scope.config_programs = configProgDetails;
                                }
                                callback();
                            });
                    }

                    /**
                     * Function to load configuration data
                     */
                    function loadData() {
                        hypersproutMgmtService.getConfigDataForEdit(
                            record.entity.ID).then(function (resObj) {
                                if (!angular.isUndefinedOrNull(
                                    resObj.Docs[0].ConfigProgramName)) {
                                    $scope.changeConfigProgram(
                                        resObj.Docs[0].ConfigProgramName);
                                }
                                $scope.configObj["ConfigName"] = record.entity.Name;
                                $scope.configObj["Description"] = record.entity.Description;
                                $scope.config_program = record.entity.Config_program;
                            });
                    }

                    /**
                     *  @description
                    * Function to change Config Program
                     * 
                     * @param value
                     * @return Nil
                     
                    
                     */
                    $scope.changeConfigProgram = function (value) {
                        hypersproutMgmtService.ConfigProgramsEdit(value, type)
                            .then(function (objData) {
                                if (!angular.isUndefinedOrNull(objData) &&
                                    !angular.isUndefinedOrNull(objData.Docs)) {
                                    $scope.configObj = {};
                                    $scope.configObj["ConfigName"] = record.entity.Name;
                                    $scope.configObj["Description"] = record.entity.Description;
                                    $scope.configObj["ConfigGroups_Info"] = {};
                                    $scope.configObj["ConfigGroups_Info"]["Demand"] =
                                        commonService.getObjectById(
                                            dropDownObj.demandDataValues,
                                            objData.Docs[0].ConfigGroups_Info.Demand).value;
                                    $scope.configObj["ConfigGroups_Info"]["Quantity1"] =
                                        commonService.getObjectById(
                                            dropDownObj.energyDataValues_q,
                                            objData.Docs[0].ConfigGroups_Info.Quantity1).value;
                                    $scope.configObj["ConfigGroups_Info"]["Quantity2"] =
                                        commonService.getObjectById(
                                            dropDownObj.energyDataValues_q,
                                            objData.Docs[0].ConfigGroups_Info.Quantity2).value;
                                    $scope.configObj["ConfigGroups_Info"]["Quantity3"] =
                                        commonService.getObjectById(
                                            dropDownObj.energyDataValues_q,
                                            objData.Docs[0].ConfigGroups_Info.Quantity3).value;
                                    $scope.configObj["ConfigGroups_Info"]["Quantity4"] =
                                        commonService.getObjectById(
                                            dropDownObj.energyDataValues_q,
                                            objData.Docs[0].ConfigGroups_Info.Quantity4).value;
                                    $scope.configObj["ConfigGroups_Info"]["RMSVoltLoadThreshold"] =
                                        objData.Docs[0].ConfigGroups_Info.RMSVoltLoadThreshold;
                                    $scope.configObj["ConfigGroups_Info"]["RMSVoltHighThreshold"] =
                                        objData.Docs[0].ConfigGroups_Info.RMSVoltHighThreshold;
                                    $scope.configObj["ConfigGroups_Info"]["LowVoltageThreshold"] =
                                        objData.Docs[0].ConfigGroups_Info.LowVoltageThreshold;
                                    $scope.configObj["ConfigGroups_Info"]["LowVoltageThresholdDeviation"] =
                                        objData.Docs[0].ConfigGroups_Info.LowVoltageThresholdDeviation;
                                    $scope.configObj["ConfigGroups_Info"]["HighVoltageThresholdDeviation"] =
                                        objData.Docs[0].ConfigGroups_Info.HighVoltageThresholdDeviation;
                                    $scope.configObj["ConfigGroups_Info"]["VTMultiplier"] =
                                        objData.Docs[0].ConfigGroups_Info.VTMultiplier;
                                    $scope.configObj["ConfigGroups_Info"]["RegisterMultiplier"] =
                                        objData.Docs[0].ConfigGroups_Info.RegisterMultiplier;
                                    $scope.configObj["ConfigGroups_Info"]["IntervalLength"] =
                                        commonService.getObjectById(
                                            dropDownObj.intervalLengthLoadValues,
                                            objData.Docs[0].ConfigGroups_Info.IntervalLength).value;
                                    $scope.configObj["ConfigGroups_Info"]["OutageLength"] =
                                        commonService.getObjectById(
                                            dropDownObj.outageLengthDropDown,
                                            objData.Docs[0].ConfigGroups_Info.OutageLength).value;
                                    $scope.configObj["ConfigGroups_Info"]["PulseWeight1"] =
                                        objData.Docs[0].ConfigGroups_Info.PulseWeight1;
                                    $scope.configObj["ConfigGroups_Info"]["PulseWeight2"] =
                                        objData.Docs[0].ConfigGroups_Info.PulseWeight2;
                                    $scope.configObj["ConfigGroups_Info"]["PulseWeight3"] =
                                        objData.Docs[0].ConfigGroups_Info.PulseWeight3;
                                    $scope.configObj["ConfigGroups_Info"]["PulseWeight4"] =
                                        objData.Docs[0].ConfigGroups_Info.PulseWeight4;
                                    $scope.configObj["ConfigGroups_Info"]["PhaseSelection"] =
                                        commonService.getObjectById(
                                            dropDownObj.phaseSelectionValues,
                                            objData.Docs[0].ConfigGroups_Info.PhaseSelection).value;
                                    $scope.configObj["ConfigGroups_Info"]["TimetoremaininTestMode"] =
                                        objData.Docs[0].ConfigGroups_Info.TimetoremaininTestMode;
                                    $scope.configObj["ConfigGroups_Info"]["NumberofSubIntervals"] =
                                        commonService.getObjectById(
                                            dropDownObj.intervalLengthValues,
                                            objData.Docs[0].ConfigGroups_Info.NumberofSubIntervals).value;
                                    $scope.configObj["ConfigGroups_Info"]["ColdLoadPickupTimes"] =
                                        commonService.getObjectById(
                                            dropDownObj.coldPickuptimeValues,
                                            objData.Docs[0].ConfigGroups_Info.ColdLoadPickupTimes).value;
                                    $scope.configObj["ConfigGroups_Info"]["PowerOutageRecognitionTime"] =
                                        commonService.getObjectById(dropDownObj.powerOutageRecognitionTimeValues,
                                            objData.Docs[0].ConfigGroups_Info.PowerOutageRecognitionTime).value;
                                    $scope.configObj["ConfigGroups_Info"]["TestModeDemandIntervalLength"] =
                                        commonService.getObjectById(
                                            dropDownObj.quantityValues,
                                            objData.Docs[0].ConfigGroups_Info.TestModeDemandIntervalLength).value;
                                    $scope.configObj["ConfigGroups_Info"]["NumberofTestModeSubintervals"] =
                                        commonService.getObjectById(
                                            dropDownObj.quantityValues,
                                            objData.Docs[0].ConfigGroups_Info
                                                .NumberofTestModeSubintervals).value;
                                    $scope.configObj["ConfigGroups_Info"]["DemandIntervalLength"] =
                                        commonService.getObjectById(
                                            dropDownObj.intervalLengthValues,
                                            objData.Docs[0]
                                                .ConfigGroups_Info.DemandIntervalLength).value;

                                    $scope.configObj["ConfigGroups_Info"]["DailySelfReadTime"] =
                                        (objData.Docs[0].
                                            ConfigGroups_Info.DailySelfReadTime === 1) ? true : false;
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
                                        (objData.Docs[0]
                                            .ConfigGroups_Info.ConfigurationErrorDetected === 1) ? true : false;
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
                                        objData.Docs[0].ConfigGroups_Info.OTMultiplier;
                                    $scope.configObj["ConfigGroups_Info"]["EnableVoltageMonitor"] =
                                        (objData.Docs[0]
                                            .ConfigGroups_Info.EnableVoltageMonitor === 1) ? true : false;
                                    $scope.configObj["ConfigGroups_Info"]["LinkFailure"] =
                                        (objData.Docs[0].ConfigGroups_Info.LinkFailure === 1) ? true : false;
                                    $scope.configObj["ConfigGroups_Info"]["LinkMetric"] =
                                        (objData.Docs[0].ConfigGroups_Info.LinkMetric === 1) ? true : false;
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
                                    $scope.configObj["ConfigGroups_Info"]["TableSendRequestFailed"] =
                                        (objData.Docs[0]
                                            .ConfigGroups_Info.TableSendRequestFailed === 1) ? true : false;

                                    if (type === 'Meter') {
                                        $scope.configObj["ConfigGroups_Info"]["Energy1"] =
                                            commonService.getObjectById(
                                                dropDownObj.energyDataValues,
                                                objData.Docs[0].ConfigGroups_Info.Energy1).value;
                                        $scope.configObj["ConfigGroups_Info"]["Energy2"] =
                                            commonService.getObjectById(
                                                dropDownObj.energyDataValues,
                                                objData.Docs[0].ConfigGroups_Info.Energy2).value;
                                        $scope.configObj["ConfigGroups_Info"]["Energy3"] =
                                            commonService.getObjectById(
                                                dropDownObj.energyDataValues,
                                                objData.Docs[0].ConfigGroups_Info.Energy3).value;
                                        $scope.configObj["ConfigGroups_Info"]["Energy4"] =
                                            commonService.getObjectById(
                                                dropDownObj.energyDataValues,
                                                objData.Docs[0].ConfigGroups_Info.Energy4).value;
                                        $scope.configObj["ConfigGroups_Info"]["IntervalLengthVoltage"] =
                                            commonService.getObjectById(
                                                dropDownObj.voltageIntervalLengthValues,
                                                objData.Docs[0].ConfigGroups_Info.VoltageMointorIntervalLength).value;
                                        $scope.configObj["ConfigGroups_Info"]["LoadControlDisconnectThresholdMaxDemand"] =
                                            commonService.getObjectById(
                                                dropDownObj.quantities_loadControlValues,
                                                objData.Docs[0]
                                                    .ConfigGroups_Info.LoadControlDisconnectThreshold).value;
                                        $scope.configObj["ConfigGroups_Info"]["ReconnectMethod"] =
                                            commonService.getObjectById(
                                                dropDownObj.reconnectMethod_Values,
                                                objData.Docs[0].ConfigGroups_Info.ReconnectMethod).value;
                                        $scope.configObj["ConfigGroups_Info"]["Loginattemptsoptical"] =
                                            objData.Docs[0].ConfigGroups_Info.LockoutLoginattemptsOptical;
                                        $scope.configObj["ConfigGroups_Info"]["Logoutattemptsoptical"] =
                                            objData.Docs[0].ConfigGroups_Info.LockoutLogoutminutesOptical;
                                        $scope.configObj["ConfigGroups_Info"]["LoginattemptsIan"] =
                                            objData.Docs[0].ConfigGroups_Info.LockoutLoginattemptsLAN;
                                        $scope.configObj["ConfigGroups_Info"]["LogoutattemptsIan"] =
                                            objData.Docs[0].ConfigGroups_Info.LockoutLogoutminutesLAN;
                                        $scope.configObj["ConfigGroups_Info"]["ConsecutiveLANmsgFailureLimit"] =
                                            objData.Docs[0].ConfigGroups_Info.ConsecutiveLAN;
                                        $scope.configObj["ConfigGroups_Info"]["LANLinkMetricQuality"] =
                                            objData.Docs[0].ConfigGroups_Info.LanLinkMetric;
                                    } else {
                                        $scope.configObj["ConfigGroups_Info"]["Energy"] =
                                            commonService.getObjectById(
                                                dropDownObj.energyDataValues,
                                                objData.Docs[0].ConfigGroups_Info.Energy).value;
                                        $scope.configObj["ConfigGroups_Info"]["CTMultiplier"] =
                                            objData.Docs[0].ConfigGroups_Info.CTMultiplier;
                                        $scope.configObj["ConfigGroups_Info"]["IntervalLengthVoltage"] =
                                            commonService.getObjectById(
                                                dropDownObj.voltageIntervalLengthValues,
                                                objData.Docs[0].ConfigGroups_Info.IntervalLengthVoltage).value;
                                    }
                                }
                            });
                    }

                    /**
                     *  @description
                     * Function to print
                     * 
                     * @param nil
                     * @return Nil
                    
                     */
                    $scope.printCart = function () {
                        commonService.openPDF(
                            $scope.configObj.ConfigGroups_Info, "print"
                        );
                    };

                    /**
                     *  @description
                     * Function to create and open PDF
                     * 
                     * @param nil
                     * @return Nil
                     
                     */
                    $scope.pdf = function () {
                        commonService.openPDF(
                            $scope.configObj.ConfigGroups_Info, "pdf"
                        );
                    }

                    /**
                     *  @description
                     * Function to create and open Excel
                     * 
                     * @param nill
                     * @return Nil
                    
                     */
                    $scope.excel = function () {
                        var para = $scope.configObj.ConfigGroups_Info;
                        commonService.downloadCSV(para);
                    }

                    /**
                     *  @description
                     * Function to save edited configuration
                     * 
                     * @param nill
                     * @return Nil
        
                     */
                    $scope.Save = function () {
                        var updatevalues = {
                            ConfigID: record.entity.ID,
                            ConfigProgramName: $scope.config_program,
                            Type: type
                        };
                        hypersproutMgmtService.HSMConfEditSave(updatevalues)
                            .then(function (objData) {
                                if (!angular.isUndefinedOrNull(objData) &&
                                    (objData.type)) {
                                    $state.reload();
                                    swal(commonService.addTrademark(objData.Message));
                                } else {
                                    swal(commonService.addTrademark(objData.Message));
                                }
                                $modalInstance.dismiss();
                            });
                    }
                }]);
})(window.angular);