/**
 * @description
 * Controller for Transformer Configuration
 */
(function (angular) {
    "use strict";
    angular.module('dataVINEApp').controller('newXfmerConfigurationCtrl',
        ['$modalInstance', '$uibModalStack',
            '$scope', '$uibModal', '$state', '$rootScope',
            'DeviceService', 'refreshservice', '$sessionStorage','message', 'commonService',
            function ($modalInstance, $uibModalStack,
                $scope, $uibModal, $state, $rootScope,
                deviceService, refreshservice, $sessionStorage,message, commonService) {
                var temprature = $sessionStorage.get('temprature');
                $scope.unit = (temprature === 'Fahrenheit') ? 'F' : 'C';

                if($scope.unit === 'C') {
                    $scope.minAllowedTemp = 30.00;
                    $scope.maxAllowedTemp = 300.00;
                } else {
                    $scope.minAllowedTemp = 86.00;
                    $scope.maxAllowedTemp = 572.00;
                }

                $scope.transfomerdetails = {};
                var configurationData = null;
                $scope.ConnectedCameraBoolean = false;
                // API call data set to variable
                $scope.coilLists1 = [];
                $scope.coilLists2 = [];
                $scope.coilLists3 = [];
                $scope.otpModal;
                deviceService.fetchPhaseData()
                .then(function (apiData) {
                    $scope.coilLists1 = [{_id:"",coil_name:"Select Coil 1"},...apiData.data]; // set placeholder for coil 1
                    $scope.coilLists2 = [{_id:"",coil_name:"Select Coil 2"},...apiData.data]; // set placeholder for coil 2
                    $scope.coilLists3 = [{_id:"",coil_name:"Select Coil 3"},...apiData.data]; // set placeholder for coil 3
                });
                // Coil Changes ------------------------------
                /**
                 *  @description
                 * Function to convert celsius to fahrenheit
                 *
                 * @param value
                 * @return Nil

                 */
                function getTemprature(value) {
                        return ($scope.unit === 'C') ? ((value * 9 / 5) + 32).toFixed(2) : (parseFloat(value).toFixed(2)).toString();
                }

                /**
                 *  @description
                 * Function to convert fahrenheit to celsius
                 *
                 * @param value
                 * @return Nil

                 */
                function revTemprature(value) {
                        return ($scope.unit === 'C') ? (((value - 32) * 5 / 9).toFixed(2)).toString() : (parseFloat(value).toFixed(2)).toString();
                }
                function populateProperData(key) {
                    return (key) ? {
                        id: true, value: 'True'
                    } : {
                            id: false, value: 'False'
                        };
                }

                var hypherSproutPassword = null;
                $scope.transfomerdetails = {};
                $scope.types = ["Pad Mounted", "Pole Mounted"];
                $scope.transfomerdetails.type = $scope.types[1];
                $scope.transfomerdetails.ConnectedCamera = populateProperData(true);
                $scope.phases = {
                    1: 'Single Phase, Single Drop',
                    2: 'Single Phase, Double Drop',
                    3: 'Three Phase'
                };
                // functinality to show, hide set value for dropdown and send value to API
                $scope.selectedCoilLists = [];
                $scope.otp = '';
                $scope.phaseTypeSingle = true;
                $scope.phaseTypeDouble = true;
                $scope.phaseTypeTriple = true;
                $scope.transfomerdetails.coil1 = '';
                $scope.transfomerdetails.coil2 = '';
                $scope.transfomerdetails.coil3 = '';
                $scope.getphasedetails = function (phaseType) {                                        
                    if(phaseType == "Single Phase, Single Drop"){
                        $scope.phaseTypeSingle = true;
                        $scope.phaseTypeDouble = false;
                        $scope.phaseTypeTriple = false;
                        $scope.phaseSelection = 1;
                        $scope.selectedCoilLists.splice(1,2); // remove old datas using splice
                        $scope.transfomerdetails.coil2 = ''; // set coil 2 select option to empty
                        $scope.transfomerdetails.coil3 = '';// set coil 3 select option to empty
                    }else if(phaseType == "Single Phase, Double Drop"){
                        $scope.phaseTypeSingle = true;
                        $scope.phaseTypeDouble = true;
                        $scope.phaseTypeTriple = false;
                        $scope.selectedCoilLists.splice(2,1);// remove old datas using splice
                        $scope.phaseSelection = 2;
                        $scope.transfomerdetails.coil3 = ''; // set coil 3 select option to empty
                    }else if(phaseType == "Three Phase"){
                        $scope.phaseTypeSingle = true;
                        $scope.phaseTypeDouble = true;
                        $scope.phaseTypeTriple = true;
                        $scope.phaseSelection = 3;
                    }
                }
                $scope.getCoilDetails = function(type,ifArray,array,id){                    
                    if(ifArray){
                        let arr = array.filter(function(e){ return e._id == id});
                        let filteredArray = arr.length > 0 ? arr[0] : {_id:"",coil_name:"",manufacturer:"",rating:"",multiplier:""};     
                        let _id = filteredArray._id,
                            coil_name = filteredArray.coil_name,
                            manufacturer = filteredArray.manufacturer,
                            rating = filteredArray.rating,
                            multiplier = filteredArray.multiplier; 
                        if(type== 'coil1'){ 
                            $scope.selectedCoilLists[0] = {"_id":_id,"coil_name":coil_name,"manufacturer":manufacturer,"rating":rating,"multiplier":multiplier};   //set values in coil 1 select option  
                        }else if(type== 'coil2'){  
                            $scope.selectedCoilLists[1] = {"_id":_id,"coil_name":coil_name,"manufacturer":manufacturer,"rating":rating,"multiplier":multiplier};   
                        }else if(type== 'coil3'){  
                            $scope.selectedCoilLists[2] = {"_id":_id,"coil_name":coil_name,"manufacturer":manufacturer,"rating":rating,"multiplier":multiplier};
                        }                        
                    }else {
                        let filteredArray = objCacheDetails.fetchedCoils.filter(function(e) {return e._id == $scope.transfomerdetails[type]})[0];                        
                        let _id = filteredArray._id,
                                coil_name = filteredArray.coil_name,
                                manufacturer = filteredArray.manufacturer,
                                rating = filteredArray.rating,
                                multiplier = filteredArray.multiplier; 
                        if(type == "coil1"){
                            $scope.selectedCoilLists[0] = {"_id":_id,"coil_name":coil_name,"manufacturer":manufacturer,"rating":rating,"multiplier":multiplier};
                        }else if(type == "coil2"){
                            $scope.selectedCoilLists[1] = {"_id":_id,"coil_name":coil_name,"manufacturer":manufacturer,"rating":rating,"multiplier":multiplier};
                        }else if(type == "coil3"){
                            $scope.selectedCoilLists[2] = {"_id":_id,"coil_name":coil_name,"manufacturer":manufacturer,"rating":rating,"multiplier":multiplier};
                        }
                    }
                }                
                // Coil Changes ------------------------------
                $scope.transfomerdetails.phases = $scope.phases[3];
                $scope.phaseSelection = 3;
                $scope.accuracy = ["0.5", "1"];
                $scope.transfomerdetails.accuracy = $scope.accuracy[1];
                $scope.ratedVoltage = [110, 220, 240];
                $scope.transfomerdetails.ratedVoltage = $scope.ratedVoltage[1];
                $scope.frequency = [50, 60];
                $scope.transfomerdetails.frequency = $scope.frequency[1];
                $scope.complaintStandard = ["UL", "CE", "CSA"];
                $scope.transfomerdetails.complaintStandard = $scope.complaintStandard[1];
                $scope.maxDemand = ["Sliding", "Fixed"];
                $scope.transfomerdetails.maxDemand = $scope.maxDemand[1];
                $scope.maxDemandSWI = [15, 30];
                $scope.transfomerdetails.maxDemandSWI = $scope.maxDemandSWI[1];
                $scope.resetDate = (function () {
                    let resetDateArr = [];
                    for (let index = 0; index < 31; index++) {
                        resetDateArr[index] = parseInt(index + 1, 10);
                    }
                    return resetDateArr;
                })();
                $scope.transfomerdetails.resetDate = $scope.resetDate[1];
                $scope.demandDate = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12,
                    13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28];
                $scope.streetLightHours = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12,
                        13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24];
                $scope.transfomerdetails.demandDate = $scope.demandDate[1];
                $scope.showTranSrlErrorMsg = true;
                $scope.saveMessage = "";
                $scope.updateMessage = "";
                configurationData = angular.copy(objCacheDetails.data.configurationData);
                objCacheDetails.data.configurationData = null;
                $scope.changeStreetLightsSetting = function (value) {
                };

                $scope.changeConnectedCamera = function () {
                    $scope.ConnectedCameraBoolean = !$scope.ConnectedCameraBoolean;
                };
                setTimeout(function () {
                    $scope.transformerCreation.$dirty = false;
                }, 300);
                $scope.changeStreetLightsSetting(populateProperData(
                    $scope.transfomerdetails.ConnectedCamera));
                if ($state.current.name === 'editTransformer' &&
                    angular.isUndefinedOrNull(objCacheDetails.data.selectedData)) {
                    $state.go('system.registration.transformerEntry');
                    return;
                }
                if (angular.isUndefinedOrNull(objCacheDetails.data.selectedData)) {
                    $scope.createUpdateStatus = true;
                    $scope.editWifi = false;
                    $scope.transfomerStatus = 'NotRegistered';
                    $scope.transfomerdetails.wifiAccessPwd = '00000000';
                } else {
                    $scope.editWifi = true;
                    var transformerData = objCacheDetails.data.selectedData;
                    $scope.transfomerStatus = angular.isUndefinedOrNull(transformerData.Status) ? "NotRegistered" : transformerData.Status;
                    hypherSproutPassword = transformerData.wifiAccessPwd;
                    $scope.transfomerdetails.TransformerID =
                        transformerData.TransformerID;
                    $scope.transfomerdetails.HypersproutID =
                        transformerData.HypersproutID;
                    $scope.transfomerdetails.transformerSl =
                        (transformerData.transformerSl).toString();
                    $scope.transfomerdetails.TFMRName =
                        (transformerData.TFMRName);
                    $scope.transfomerdetails.kvaRating = (transformerData.kvaRating).toString();
                    $scope.transfomerdetails.type = transformerData.type;
                    $scope.transfomerdetails.hvlv = transformerData.hvlv;
                    $scope.transfomerdetails.hypSl = (transformerData.hypSl).toString();
                    $scope.transfomerdetails.latitude =
                        (transformerData.latitude).toString();
                    $scope.transfomerdetails.longitude =
                        (transformerData.longitude).toString();
                    $scope.transfomerdetails.ctRatio = (transformerData.ctRatio).toString();
                    $scope.transfomerdetails.ptRatio = (transformerData.ptRatio).toString();
                    $scope.transfomerdetails.ratedVoltage =
                        parseInt(transformerData.ratedVoltage);
                    $scope.transfomerdetails.phases =
                        $scope.phases[transformerData.phases];
                        if(transformerData.phases == 1){
                            $scope.phaseTypeSingle = true;
                            $scope.phaseTypeDouble = false;
                            $scope.phaseTypeTriple = false;
                            $scope.phaseSelection = 1;
                        }else if(transformerData.phases == 2){
                            $scope.phaseTypeSingle = true;
                            $scope.phaseTypeDouble = true;
                            $scope.phaseTypeTriple = false;
                            $scope.phaseSelection = 2;
                        }else if(transformerData.phases == 3){
                            $scope.phaseTypeSingle = true;
                            $scope.phaseTypeDouble = true;
                            $scope.phaseTypeTriple = true;
                            $scope.phaseSelection = 3;
                        } // set values according to phases
                    
                    // Values set to Dropdown while updating Transformer API                    
                    if(transformerData.Coils.length == 1){
                        $scope.phaseTypeSingle = true;
                        $scope.phaseTypeDouble = false;
                        $scope.phaseTypeTriple = false;
                        $scope.transfomerdetails.coil1 =  transformerData.Coils[0]._id;
                        $scope.phaseSelection = 1;
                        $scope.getCoilDetails('coil1',true, objCacheDetails.fetchedCoils,transformerData.Coils[0]._id);
                    }else if(transformerData.Coils.length == 2){
                        $scope.phaseTypeSingle = true;
                        $scope.phaseTypeDouble = true;
                        $scope.phaseTypeTriple = false;
                        $scope.transfomerdetails.coil1 = transformerData.Coils[0]._id;
                        $scope.transfomerdetails.coil2 = transformerData.Coils[1]._id;
                        $scope.phaseSelection = 2;
                        $scope.getCoilDetails('coil1',true, objCacheDetails.fetchedCoils,transformerData.Coils[0]._id);
                        $scope.getCoilDetails('coil2',true, objCacheDetails.fetchedCoils,transformerData.Coils[1]._id);
                    }else if(transformerData.Coils.length == 3){
                        $scope.phaseTypeSingle = true;
                        $scope.phaseTypeDouble = true;
                        $scope.phaseTypeTriple = true;
                        $scope.transfomerdetails.coil1 = transformerData.Coils[0]._id;
                        $scope.transfomerdetails.coil2 = transformerData.Coils[1]._id;
                        $scope.transfomerdetails.coil3 = transformerData.Coils[2]._id;
                        $scope.phaseSelection = 3;
                        $scope.getCoilDetails('coil1',true, objCacheDetails.fetchedCoils,transformerData.Coils[0]._id);
                        $scope.getCoilDetails('coil2',true, objCacheDetails.fetchedCoils,transformerData.Coils[1]._id);
                        $scope.getCoilDetails('coil3',true, objCacheDetails.fetchedCoils,transformerData.Coils[2]._id);
                    }
                    // Coil Changes ------------------------------
                    $scope.transfomerdetails.maxDemand = transformerData.maxDemand;
                    $scope.transfomerdetails.frequency =
                        parseInt(transformerData.frequency);
                    $scope.transfomerdetails.measurementClass =
                        transformerData.measurementClass;
                    $scope.transfomerdetails.complaintStandard =
                        transformerData.complaintStandard;
                    $scope.transfomerdetails.gprs = transformerData.gprs;
                    $scope.transfomerdetails.wifiMacId = transformerData.wifiMacId;
                    $scope.transfomerdetails.wifiIpAdd = (transformerData.wifiIpAdd).toString();
                    $scope.transfomerdetails.wifiAccessPwd =
                        transformerData.wifiAccessPwd;
                    $scope.transfomerdetails.simCard = (transformerData.simCard).toString();
                    $scope.transfomerdetails.sensorRating = transformerData.sensorRating;
                    if(message.testlength == 1 && message.viewtestlength < 0){
                        $scope.transfomerdetails.maxOil =
                        revTemprature(transformerData.MaxOilTemp);
                         $scope.transfomerdetails.lowOil =
                        revTemprature(transformerData.MinOilTemp);
                    }else if(message.testlength == 1 && message.viewtestlength > 0){
                        $scope.transfomerdetails.maxOil =
                        (transformerData.MaxOilTemp);
                        $scope.transfomerdetails.lowOil =
                       (transformerData.MinOilTemp);
                    }else if(message.message == false){
                        $scope.transfomerdetails.maxOil =
                        revTemprature(transformerData.MaxOilTemp);
                         $scope.transfomerdetails.lowOil =
                        revTemprature(transformerData.MinOilTemp);
                    }else if(message.message == true && message.viewtestlength == 0){
                        $scope.transfomerdetails.maxOil =
                        revTemprature(transformerData.MaxOilTemp);
                         $scope.transfomerdetails.lowOil =
                        revTemprature(transformerData.MinOilTemp);
                    }
                    else{
                        $scope.transfomerdetails.maxOil =
                        (transformerData.MaxOilTemp);
                        $scope.transfomerdetails.lowOil =
                       (transformerData.MinOilTemp);
                    }
                   
                    $scope.transfomerdetails.make = (transformerData.Make).toString();
                    $scope.transfomerdetails.highLineV = (transformerData.HighLineVoltage).toString();
                    $scope.transfomerdetails.lowLineV = (transformerData.LowLineVoltage).toString();
                    $scope.transfomerdetails.highLineCurrent =
                        (transformerData.HighLineCurrent).toString();
                    $scope.transfomerdetails.lowLineCurrent =
                        (transformerData.LowLineCurrent).toString();
                    $scope.transfomerdetails.hypersproutVersion =
                        (transformerData.HypersproutVersion).toString();
                    $scope.transfomerdetails.hypersproutMake =
                        (transformerData.HypersproutMake).toString();
                    $scope.transfomerdetails.accuracy = transformerData.Accuracy;
                    $scope.transfomerdetails.resetDate =
                        parseInt(transformerData.HSDemandResetDate);
                    $scope.transfomerdetails.maxDemandSWI =
                        parseInt(transformerData.MaxDemandSlidingWindowInterval);
                    $scope.transfomerdetails.WireSize = (transformerData.WireSize).toString();
                    $scope.transfomerdetails.ConnectedCamera =
                        populateProperData(transformerData.CameraConnect);

                    $scope.createUpdateStatus = false;
                    objCacheDetails.data.selectedData = null;
                    setTimeout(function () {
                            $scope.ConnectedCameraBoolean = true;
                    }, 100);
                }
                if (!$scope.createUpdateStatus) {
                    setTimeout(function () {
                        $scope.updateTransformerCheck();
                    }, 200);
                }
                /**
                 * @description
                 * Function to Updated Transformer data
                 *
                 * @param Nil
                 * @return Nil

                 */
                $scope.updateTransformerCheck = function () {
                    $scope.transformerFields = ['transformerSl' , 'TFMRName', 'maxOil' , 'lowOil' , 'make' , 'kvaRatingXmer' , 'highLineV' , 'lowLineV'
                                            , 'highLineCurrent', 'lowLineCurrent' , 'WireSize' , 'hypSl' , 'hypersproutMake' , 'latitude' , 'longitude' ,
                                            'wifiIpAdd', 'simCard', 'wifiMacId','gprs', 'ptRatio','ctRatio', 'hypersproutVersion'];
                    if ($scope.transfomerStatus==='Registered') {
                        $scope.transformerFields.push("wifiAccessPwd");
                    }
                    if (!$scope.createUpdateStatus && $scope.transfomerStatus==='Registered') {
                        $scope.transformerFields.push("simCard");
                    }
                    if ($scope.transformerFields.length > 0) {
                        for (var i = 0; i < $scope.transformerFields.length; i++) {
                            $scope.focusValidate($scope.transformerFields[i]);
                        }
                    }
                    if($scope.transfomerdetails.sensorRating) {
                        $scope.sensorInputValidation($scope.transfomerdetails.sensorRating);
                    }
                    };

                    $scope.updateTransformer = function () {
                    var HypersproutWifiFlag =
                        $scope.transfomerdetails.wifiAccessPwd === hypherSproutPassword ? 'N' : 'Y';
                    if (angular.isUndefinedOrNull(
                        $scope.transfomerdetails.sensorRating)) {
                        $scope.transfomerdetails.sensorRating = '';
                    }
                    deviceService
                        .editTransformer(($scope.transfomerdetails.TransformerID).toString(),
                            ($scope.transfomerdetails.HypersproutID).toString(),
                            ($scope.transfomerdetails.transformerSl).toString(), 
                            ($scope.transfomerdetails.TFMRName),                           
                            ($scope.transfomerdetails.make).toString(),
                            ($scope.transfomerdetails.kvaRating).toString(),
                            ($scope.transfomerdetails.highLineV).toString(),
                            ($scope.transfomerdetails.lowLineV).toString(),
                            ($scope.transfomerdetails.highLineCurrent).toString(),
                            ($scope.transfomerdetails.lowLineCurrent).toString(),
                            ($scope.transfomerdetails.type).toString(),
                            ($scope.transfomerdetails.hypSl).toString(),
                            ($scope.transfomerdetails.hypersproutVersion).toString(),
                            ($scope.transfomerdetails.hypersproutMake).toString(),
                            ($scope.transfomerdetails.ctRatio).toString(),
                            ($scope.transfomerdetails.ptRatio).toString(),
                            ($scope.transfomerdetails.ratedVoltage).toString(),
                            ($scope.transformPhases($scope.transfomerdetails.phases)).toString(),
                            ($scope.transfomerdetails.frequency).toString(),
                            ($scope.transfomerdetails.accuracy).toString(),
                            ($scope.transfomerdetails.resetDate).toString(),
                            ($scope.transfomerdetails.complaintStandard).toString(),
                            ($scope.transfomerdetails.maxDemand).toString(),
                            ($scope.transfomerdetails.maxDemandSWI).toString(),
                            ($scope.transfomerdetails.sensorRating).toString(),
                            $scope.transfomerdetails.gprs,
                            $scope.transfomerdetails.wifiMacId,
                            $scope.transfomerdetails.wifiIpAdd,
                            $scope.transfomerdetails.wifiAccessPwd ? $scope.transfomerdetails.wifiAccessPwd : 'null',
                            $scope.transfomerdetails.simCard,
                            parseFloat($scope.transfomerdetails.latitude).toString(),
                            parseFloat($scope.transfomerdetails.longitude).toString(),
                            getTemprature($scope.transfomerdetails.maxOil).toString(),
                            getTemprature($scope.transfomerdetails.lowOil).toString(),
                            ($scope.transfomerdetails.WireSize).toString(),
                            HypersproutWifiFlag,
                            ($scope.transfomerdetails.ConnectedCamera.id).toString(),
                            $scope.selectedCoilLists,
                            $scope.otp // Coil List new field for Update
                            )
                        .then(function (objData) {
                            if(objData.Message == "Failed: OTP does not match!"){
                                swal(objData.Message);
                            }
                            var isSuccess = deviceService.validateSuccess(objData);
                            if(isSuccess) {
                                if(objData.Message) {                                    
                                    if(objData.result == "OTP updated"){
                                        $scope.updateMessage = objData.Message;
                                        $scope.otpModelShow();
                                    }else if(objData.Message == "Transformer Details Successfully Updated!"){   
                                        swal(commonService.addTrademark(objData.Message));                                     
                                        $modalInstance.dismiss(true);
                                        $uibModalStack.clearFocusListCache();
                                        $state.reload();
                                    }else {
                                        swal(commonService.addTrademark(objData.Message));
                                    }
                                } else {
                                    swal(deviceService.handleDisplayMessageEditDevice(objData));
                                }                                
                            } else {
                                swal(deviceService.handleDisplayMessageEditDevice(objData));
                            }
                        });
                };

                /**
                 * @description
                 * Function to close pop-up
                 *
                 * @param Nil
                 * @return Nil

                 */
                $scope.cancel = function () {                    
                    $modalInstance.dismiss(false);
                    $uibModalStack.clearFocusListCache();
                };
                
                /**
                 * @description
                 * Function to Create Transformer
                 *
                 * @param Nil
                 * @return Nil

                 */                
                $scope.saveTransformer = function () {  
                    if (angular.isUndefinedOrNull(
                        $scope.transfomerdetails.sensorRating)) {
                        $scope.transfomerdetails.sensorRating = '';
                    }
                    deviceService
                        .create('NewTransformerHypersproutEntry',
                            ['Add', [($scope.transfomerdetails.transformerSl).toString()], 
                                [($scope.transfomerdetails.TFMRName)],                                                       
                                [($scope.transfomerdetails.make).toString()],
                                [($scope.transfomerdetails.kvaRating).toString()],
                                [($scope.transfomerdetails.highLineV).toString()],
                                [($scope.transfomerdetails.lowLineV).toString()],
                                [($scope.transfomerdetails.highLineCurrent).toString()],
                                [($scope.transfomerdetails.lowLineCurrent).toString()],
                                [$scope.transfomerdetails.type],
                                [$scope.transfomerdetails.hypSl],
                                [($scope.transfomerdetails.hypersproutVersion).toString()],
                                [($scope.transfomerdetails.hypersproutMake).toString()],
                                [($scope.transfomerdetails.ctRatio).toString()],
                                [($scope.transfomerdetails.ptRatio).toString()],
                                [($scope.transfomerdetails.ratedVoltage).toString()],
                                [($scope.transformPhases($scope.transfomerdetails.phases)).toString()],
                                [($scope.transfomerdetails.frequency).toString()],
                                [$scope.transfomerdetails.accuracy.toString()],
                                [($scope.transfomerdetails.resetDate).toString()],
                                [$scope.transfomerdetails.complaintStandard],
                                [$scope.transfomerdetails.maxDemand],
                                [($scope.transfomerdetails.maxDemandSWI).toString()],
                                [$scope.transfomerdetails.sensorRating],
                                [$scope.transfomerdetails.gprs],
                                [$scope.transfomerdetails.wifiMacId],
                                [$scope.transfomerdetails.wifiIpAdd],
                                [$scope.transfomerdetails.wifiAccessPwd],
                                [$scope.transfomerdetails.simCard],
                                [parseFloat($scope.transfomerdetails.latitude).toString()],
                                [parseFloat($scope.transfomerdetails.longitude).toString()],
                                [getTemprature($scope.transfomerdetails.maxOil).toString()],
                                [getTemprature($scope.transfomerdetails.lowOil).toString()],
                                [($scope.transfomerdetails.WireSize).toString()],
                                [($scope.transfomerdetails.ConnectedCamera.id).toString()],[],
                                $scope.selectedCoilLists, // Coil List new field for New Transformer Create
                                $scope.otp // OTP Field
                            ])
                        .then(function (objData) {    
                            if(objData.Message == "Failed: OTP does not match!"){
                                swal(objData.Message);
                            }                        
                            var isSuccess = deviceService.validateSuccess(objData);
                            if(isSuccess) {
                                if(objData.Message) {                                     
                                    if(Object.keys(objData.Result[0]).includes('Otpmessage')){
                                        if(objData.Result[0].Otpmessage == "OTP generated successfully"){
                                            $scope.saveMessage = objData.Message;
                                            $scope.otpModelShow();
                                        }
                                    }else if(Object.keys(objData.Result[0]).includes('Comment')){
                                        if(objData.Result[0].Comment == "OTP verified successfully & Details Added"){
                                            swal(commonService.addTrademark(objData.Message)); 
                                            $modalInstance.dismiss(true);
                                            $uibModalStack.clearFocusListCache();
                                            $state.reload(); 
                                        }                                        
                                    }else {
                                        swal(commonService.addTrademark(objData.Message));                                        
                                    }
                                } else {
                                    swal(deviceService.handleDisplayMessageAddDevice(objData));
                                }                                
                            } else {                                
                                swal(deviceService.handleDisplayMessageAddDevice(objData));
                            }
                        });
                };


                $scope.otpModelShow = function () {
                    $scope.otpModal = $uibModal.open({
                        templateUrl: '/templates/createTransformerOTP.html',
                        size: 'lg',
                        scope: $scope,
                        backdrop: 'static',
                        keyboard: true,                        
                    });
                }

                $scope.otpValidation = function(otpFromFunction) {                    
                    if(otpFromFunction.length == 4){
                        $scope.otp = otpFromFunction;
                        if($scope.createUpdateStatus){
                            $scope.saveTransformer();
                        }else {
                            $scope.updateTransformer();
                        }
                    }else {
                        swal("Please enter valid OTP");
                    }
                }

                $scope.cancelOtp = function (){
                    if($scope.createUpdateStatus){
                        swal(commonService.addTrademark($scope.saveMessage));
                    }else {
                        swal(commonService.addTrademark($scope.updateMessage));
                    }
                    $scope.otpModal.dismiss(true);
                    $modalInstance.dismiss(true);
                    $uibModalStack.clearFocusListCache();
                    $state.reload();
                }

                $scope.showPassword = false;

                /**
                 *  @description
                 * Function to toggle pasword field to show/hide characters
                 *
                 * @param Nil
                 * @return Nil

                 */
                $scope.toggleShowPassword = function () {
                    $scope.showPassword = !$scope.showPassword;
                };
                $scope.errorKvaRating = false;
                var regMac = new RegExp(objCacheDetails.regEx.MAC_ID, "i");
                var regMac64 = /^([0-9a-fA-F]{2}[:]){7}([0-9a-fA-F]{2})$/;
                var ipV4Reg = new RegExp('^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$');
                var regLat = new RegExp("^(\\+|-)?(?:90(?:(?:\\.0{1,6})?)|(?:[0-9]|[1-8][0-9])(?:(?:\\.[0-9]{1,6})?))$");
                var regLon = new RegExp("^(\\+|-)?(?:180(?:(?:\\.0{1,6})?)|(?:[0-9]|[1-9][0-9]|1[0-7][0-9])(?:(?:\\.[0-9]{1,6})?))$");
                // var tempRegex = /^(([-]?(?!(00))[0-9]{1,4}))([.][0-9]{1,2})?$/;
                var tempRegex = /^(((?!(00))[0-9]{1,3}))([.][0-9]{1,2})?$/;
                var hsVerFormat = /^(?:^(?!0)\d{1,3})(?:\.\d{1,3})?$/;
                var ctptRatioFormat = /^(?:^(?!0)\d{1,4})(?:\.\d{1,2})?$/;
                var containsSpace = /\s/;
                var wireRegex = /^[\d]{1,6}$/;
                let pattern = /^[a-zA-Z0-9\s]+$/;
                let nameRegex = /^[A-Za-z0-9]+(?:\s?[A-Za-z0-9]+)*$/;

                /**
                 *  @description
                 * Function to validate transformer data
                 *
                 * @param field
                 * @return Nil

                 */
                $scope.focusValidate = function (field) {
                    if (field === 'transformerSl') {
                        if($scope.transfomerdetails.transformerSl) {
                            if(!containsSpace.test($scope.transfomerdetails.transformerSl)) {
                                if ($scope.transfomerdetails.transformerSl === undefined ||
                                    $scope.transfomerdetails.transformerSl.trim().length === 0) {
                                    $scope.errorXmerSlMessage = 'Transformer Serial is required!';
                                    $scope.errorXmerSl = true;
                                    $scope.transformerCreation.transformerSl.$valid = false;
                                } else if ($scope.transfomerdetails.transformerSl.length < 10 || $scope.transfomerdetails.transformerSl.length > 25) {
                                    $scope.errorXmerSlMessage =
                                        'Length of Transformer Serial Number range should be from 10 to 25!';
                                    $scope.errorXmerSl = true;
                                    $scope.transformerCreation.transformerSl.$valid = false;
                                } else if (!pattern.test($scope.transfomerdetails.transformerSl)) {
                                    $scope.errorXmerSlMessage = 'Invalid Serial Number!';
                                    $scope.errorXmerSl = true;
                                    $scope.transformerCreation.transformerSl.$valid = false;
                                } else if ($scope.transfomerdetails.hypSl !== $scope.transfomerdetails.transformerSl) {
                                    $scope.errorXmerSlMessage = 'HS and Transformer Serial Number should be same!';
                                    $scope.errorXmerSl = true;
                                    $scope.transformerCreation.transformerSl.$valid = false;
                                } else {
                                    $scope.errorXmerSl = false;
                                    $scope.transformerCreation.transformerSl.$valid = true;
                                    $scope.errorhypSl = false;
                                    $scope.transformerCreation.hypSl.$valid = true;
                                }
                            }
                            else {
                                $scope.errorXmerSlMessage = 'Invalid Serial Number!';
                                $scope.errorXmerSl = true;
                                $scope.transformerCreation.transformerSl.$valid = false;
                            }
                        } else {
                          $scope.errorXmerSlMessage = 'Transformer Serial is required!';
                          $scope.errorXmerSl = true;
                          $scope.transformerCreation.transformerSl.$valid = false;
                        }
                    }
                    else if(field === 'wifiMacId') {
                        $scope.transfomerdetails.wifiMacId = angular.isUndefinedOrNull($scope.transfomerdetails.wifiMacId)? $scope.transfomerdetails.wifiMacId : $scope.transfomerdetails.wifiMacId.toLowerCase();
                        if ($scope.transfomerdetails.wifiMacId === undefined ||
                            $scope.transfomerdetails.wifiMacId.trim().length === 0) {
                            $scope.errorwifiMacIdMessage = 'Wifi MAC ID is required!';
                            $scope.errorwifiMacId = true;
                            $scope.transformerCreation.wifiMacId.$valid = false;
                        } else if ($scope.transfomerdetails.wifiMacId.length > 30) {
                            $scope.errorwifiMacIdMessage = 'Length of Wifi MAC ID must not be greater than 30!';
                            $scope.errorwifiMacId = true;
                            $scope.transformerCreation.wifiMacId.$valid = false;
                        } else if (!(regMac.test($scope.transfomerdetails.wifiMacId) ||
                            regMac64.test($scope.transfomerdetails.wifiMacId))) {
                            $scope.errorwifiMacIdMessage = 'Invalid Wifi MAC ID!';
                            $scope.errorwifiMacId = true;
                            $scope.transformerCreation.wifiMacId.$valid = false;
                        } else if (deviceService.checkMulticastMAC($scope.transfomerdetails.wifiMacId)) {
                            $scope.errorwifiMacIdMessage = 'Invalid MAC ID (Multicast)!';
                            $scope.errorwifiMacId = true;
                            $scope.transformerCreation.wifiMacId.$valid = false;
                        } else if ($scope.transfomerdetails.wifiMacId === $scope.transfomerdetails.gprs) {
                            $scope.errorwifiMacIdMessage = 'WIFI and GPRS MAC ID should not be same!';
                            $scope.errorwifiMacId = true;
                            $scope.transformerCreation.wifiMacId.$valid = false;
                        }
                        else {
                            $scope.errorwifiMacId = false;
                            $scope.transformerCreation.wifiMacId.$valid = true;
                            if($scope.transfomerdetails.gprs && (regMac.test($scope.transfomerdetails.gprs) || regMac64.test($scope.transfomerdetails.gprs))){
                                if(deviceService.checkMulticastMAC($scope.transfomerdetails.gprs)) {
                                    $scope.errorgprsMessage = 'Invalid MAC ID (Multicast)!';
                                    $scope.transformerCreation.gprs.$valid = false;
                                    $scope.errorgprs = true;
                                } else {
                                    $scope.transformerCreation.gprs.$valid = true;
                                    $scope.errorgprs = false;
                                }
                            } else {
                                $scope.transformerCreation.gprs.$valid = false;
                                $scope.errorgprs = true;
                            }
                        }
                    }
                    else if(field === 'gprs') {
                        $scope.transfomerdetails.gprs = angular.isUndefinedOrNull($scope.transfomerdetails.gprs) ? $scope.transfomerdetails.gprs :$scope.transfomerdetails.gprs.toLowerCase();
                        if ($scope.transfomerdetails.gprs === undefined ||
                            $scope.transfomerdetails.gprs.trim().length === 0) {
                            $scope.errorgprsMessage = 'GPRS MAC ID is required!';
                            $scope.errorgprs = true;
                            $scope.transformerCreation.gprs.$valid = false;
                        } else if ($scope.transfomerdetails.gprs.length > 30) {
                            $scope.errorgprsMessage = 'Length of GPRS MAC ID must be greater than 30!';
                            $scope.errorgprs = true;
                            $scope.transformerCreation.gprs.$valid = false;
                        } else if (!(regMac.test($scope.transfomerdetails.gprs) || regMac64.test($scope.transfomerdetails.gprs))) {
                            $scope.errorgprsMessage = 'Invalid GPRS MAC ID!';
                            $scope.errorgprs = true;
                            $scope.transformerCreation.gprs.$valid = false;
                        } else if (deviceService.checkMulticastMAC($scope.transfomerdetails.gprs)) {
                            $scope.errorgprsMessage = 'Invalid MAC ID (Multicast)!';
                            $scope.errorgprs = true;
                            $scope.transformerCreation.gprs.$valid = false;
                        } else if ($scope.transfomerdetails.gprs === $scope.transfomerdetails.wifiMacId) {
                            $scope.errorgprsMessage = 'GPRS and WIFI MAC ID should not be same!';
                            $scope.errorgprs = true;
                            $scope.transformerCreation.gprs.$valid = false;
                        }
                        else {
                            $scope.errorgprs = false;
                            $scope.transformerCreation.gprs.$valid = true;
                            if($scope.transfomerdetails.wifiMacId && (regMac.test($scope.transfomerdetails.wifiMacId) || regMac64.test($scope.transfomerdetails.wifiMacId))) {
                                if(deviceService.checkMulticastMAC($scope.transfomerdetails.wifiMacId)) {
                                    $scope.errorgprsMessage = 'Invalid MAC ID (Multicast)!';
                                    $scope.transformerCreation.wifiMacId.$valid = false;
                                    $scope.errorwifiMacId = true;
                                } else {
                                    $scope.transformerCreation.wifiMacId.$valid = true;
                                    $scope.errorwifiMacId = false;
                                }
                                // $scope.transformerCreation.wifiMacId.$valid = true;
                                // $scope.errorwifiMacId = false;
                            } else {
                                $scope.transformerCreation.wifiMacId.$valid = false;
                                $scope.errorwifiMacId = true;
                            }
                        }
                    } else if(field === 'ptRatio') {
                        if ($scope.transfomerdetails.ptRatio ) {
                            if (ctptRatioFormat.test($scope.transfomerdetails.ptRatio)) {
                                if($scope.transfomerdetails.ptRatio.includes('.')) {
                                    if (($scope.transfomerdetails.ptRatio.match(/\./g)).length === 1) {
                                        let data = $scope.transfomerdetails.ptRatio.split('.');
                                        let majorVer = data[0];
                                        if (majorVer > 0 && majorVer <= 1000) {
                                            $scope.errorptRatio = false;
                                            $scope.errorptRatioMessage = '';
                                            $scope.transformerCreation.ptRatio.$valid = true;
                                        } else {
                                            $scope.errorptRatio = true;
                                            $scope.errorptRatioMessage = 'Invalid PT Ratio!';
                                            $scope.transformerCreation.ptRatio.$valid = false;
                                        }
                                    }
                                }
                                else {
                                    if ($scope.transfomerdetails.ptRatio > 0 && $scope.transfomerdetails.ptRatio <= 1000) {
                                        $scope.errorptRatio = false;
                                        $scope.errorptRatioMessage = '';
                                        $scope.transformerCreation.ptRatio.$valid = true;
                                    } else {
                                        $scope.errorptRatio = true;
                                        $scope.errorptRatioMessage = 'Invalid PT Ratio!';
                                        $scope.transformerCreation.ptRatio.$valid = false;
                                    }
                                }
                            } else {
                                $scope.errorptRatio = true;
                                $scope.errorptRatioMessage = 'Invalid PT Ratio!';
                                $scope.transformerCreation.ptRatio.$valid = false;
                            }
                        } else {
                            $scope.errorptRatio = true;
                            $scope.errorptRatioMessage = 'PT Ratio is required!';
                            $scope.transformerCreation.ptRatio.$valid = false;
                        }
                    } else if (field === 'ctRatio') {
                        if ($scope.transfomerdetails.ctRatio) {
                            if (ctptRatioFormat.test($scope.transfomerdetails.ctRatio)) {
                                if($scope.transfomerdetails.ctRatio.includes('.')) {
                                    if (($scope.transfomerdetails.ctRatio.match(/\./g)).length === 1) {
                                        let data = $scope.transfomerdetails.ctRatio.split('.');
                                        let majorVer = data[0];
                                        if (majorVer > 0 && majorVer <= 1000) {
                                            $scope.errorctRatio = false;
                                            $scope.errorctRatioMessage = '';
                                            $scope.transformerCreation.ctRatio.$valid = true;
                                        } else {
                                            $scope.errorctRatio = true;
                                            $scope.errorctRatioMessage = 'Invalid CT Ratio!';
                                            $scope.transformerCreation.ctRatio.$valid = false;
                                        }
                                    }
                                }
                                else {
                                    if ($scope.transfomerdetails.ctRatio > 0 && $scope.transfomerdetails.ctRatio <= 1000) {
                                        $scope.errorctRatio = false;
                                        $scope.errorctRatioMessage = '';
                                        $scope.transformerCreation.ctRatio.$valid = true;
                                    } else {
                                        $scope.errorctRatio = true;
                                        $scope.errorctRatioMessage = 'Invalid CT Ratio!';
                                        $scope.transformerCreation.ctRatio.$valid = false;
                                    }
                                }
                            } else {
                                $scope.errorctRatio = true;
                                $scope.errorctRatioMessage = 'Invalid CT Ratio!';
                                $scope.transformerCreation.ctRatio.$valid = false;
                            }
                        } else {
                            $scope.errorctRatio = true;
                            $scope.errorctRatioMessage = 'CT Ratio is required!';
                            $scope.transformerCreation.ctRatio.$valid = false;
                        }
                    } else if(field === 'hypersproutVersion') {
                        if ($scope.transfomerdetails.hypersproutVersion) {
                            if (hsVerFormat.test($scope.transfomerdetails.hypersproutVersion)) {
                                if ($scope.transfomerdetails.hypersproutVersion.includes('.')) {
                                    if (($scope.transfomerdetails.hypersproutVersion.match(/\./g)).length === 1) {
                                        let data = $scope.transfomerdetails.hypersproutVersion.split('.');
                                        let majorVer = data[0];
                                        let minorVer = data[1];
                                        if (majorVer == 255 && minorVer <= 255) {
                                            $scope.errorhypersproutVersion = false;
                                            $scope.errorhypersproutVersionMessage = '';
                                            $scope.transformerCreation.hypersproutVersion.$valid = true;
                                        } else if (majorVer > 0 && majorVer <= 254) {
                                            $scope.errorhypersproutVersion = false;
                                            $scope.errorhypersproutVersionMessage = '';
                                            $scope.transformerCreation.hypersproutVersion.$valid = true;
                                        } else {
                                            $scope.errorhypersproutVersion = true;
                                            $scope.errorhypersproutVersionMessage = 'Invalid version number!';
                                            $scope.transformerCreation.hypersproutVersion.$valid = false;
                                        }
                                    } else {
                                        $scope.errorhypersproutVersion = true;
                                        $scope.errorhypersproutVersionMessage = 'Invalid version number!';
                                        $scope.transformerCreation.hypersproutVersion.$valid = false;
                                    }
                                } else {
                                    if ($scope.transfomerdetails.hypersproutVersion > 0 && $scope.transfomerdetails.hypersproutVersion <= 255) {
                                        $scope.errorhypersproutVersion = false;
                                        $scope.errorhypersproutVersionMessage = '';
                                        $scope.transformerCreation.hypersproutVersion.$valid = true;
                                    } else {
                                        $scope.errorhypersproutVersion = true;
                                        $scope.errorhypersproutVersionMessage = 'Invalid version number!';
                                        $scope.transformerCreation.hypersproutVersion.$valid = false;
                                    }
                                }
                            } else {
                                $scope.errorhypersproutVersion = true;
                                $scope.errorhypersproutVersionMessage = 'Invalid version number!';
                                $scope.transformerCreation.hypersproutVersion.$valid = false;
                            }
                        } else {
                            $scope.errorhypersproutVersion = true;
                            $scope.errorhypersproutVersionMessage = 'HyperSPROUT\u2122 Version is required!';
                            $scope.transformerCreation.hypersproutVersion.$valid = false;
                        }
                    }
                    else if(field === 'maxOil') {
                        if($scope.transfomerdetails.maxOil) {
                            if(tempRegex.test($scope.transfomerdetails.maxOil) && !$scope.transfomerdetails.maxOil.includes('-0') && $scope.transfomerdetails.maxOil >= $scope.minAllowedTemp && $scope.transfomerdetails.maxOil <= $scope.maxAllowedTemp){
                                $scope.errormaxOilMessage ='';
                                $scope.errormaxOil = false;
                                $scope.transformerCreation.maxOil.$valid = true;
                                if($scope.transfomerdetails.lowOil && parseFloat($scope.transfomerdetails.maxOil) === parseFloat($scope.transfomerdetails.lowOil)) {
                                    $scope.errormaxOilMessage ="Max and Min Oil temp can't be same, Max Oil temp must be higher!";
                                    $scope.errormaxOil = true;
                                    $scope.transformerCreation.maxOil.$valid = false;
                                }else if($scope.transfomerdetails.lowOil && parseFloat($scope.transfomerdetails.maxOil) <= parseFloat($scope.transfomerdetails.lowOil)) {
                                        $scope.errormaxOilMessage ="Max Oil temp must be higher than Min oil temp!";
                                        $scope.errormaxOil = true;
                                        $scope.transformerCreation.maxOil.$valid = false;
                                } else if($scope.transfomerdetails.lowOil && parseFloat($scope.transfomerdetails.maxOil) > parseFloat($scope.transfomerdetails.lowOil)) {
                                    $scope.errormaxOilMessage = '';
                                    $scope.errormaxOil = false;
                                    $scope.transformerCreation.maxOil.$valid = true;

                                    $scope.errorlowOilMessage = '';
                                    $scope.errorlowOil = false;
                                    $scope.transformerCreation.lowOil.$valid = true;
                                }
                                else {
                                    $scope.errormaxOilMessage = '';
                                    $scope.errormaxOil = false;
                                    $scope.transformerCreation.maxOil.$valid = true;
                                }
                            } else {
                                $scope.errormaxOilMessage = 'Invalid Max Oil Temperature!';
                                $scope.errormaxOil = true;
                                $scope.transformerCreation.maxOil.$valid = false;
                            }
                        } else {
                            $scope.errormaxOilMessage = 'Max Oil Temperature is required!';
                            $scope.errormaxOil = true;
                            $scope.transformerCreation.maxOil.$valid = false;
                        }

                    } else if (field === 'lowOil') {
                        if($scope.transfomerdetails.lowOil) {
                            if(tempRegex.test($scope.transfomerdetails.lowOil) && !$scope.transfomerdetails.lowOil.includes('-0') && $scope.transfomerdetails.lowOil >= $scope.minAllowedTemp && $scope.transfomerdetails.lowOil <= $scope.maxAllowedTemp){
                                $scope.errormaxOilMessage ='';
                                $scope.errormaxOil = false;
                                $scope.transformerCreation.lowOil.$valid = true;
                                if($scope.transfomerdetails.maxOil && parseFloat($scope.transfomerdetails.lowOil) === parseFloat($scope.transfomerdetails.maxOil)) {
                                    $scope.errorlowOilMessage = "Min and Max oil temp can't be same, Min Oil temp be lower!";
                                    $scope.errorlowOil = true;
                                    $scope.transformerCreation.lowOil.$valid = false;
                                } else if($scope.transfomerdetails.maxOil && parseFloat($scope.transfomerdetails.lowOil) >= parseFloat($scope.transfomerdetails.maxOil)) {
                                        $scope.errorlowOilMessage = "Min Oil temp must be lower than Max oil temp!";
                                        $scope.errorlowOil = true;
                                        $scope.transformerCreation.lowOil.$valid = false;
                                } else if($scope.transfomerdetails.maxOil && parseFloat($scope.transfomerdetails.lowOil) < parseFloat($scope.transfomerdetails.maxOil)) {
                                    $scope.errormaxOilMessage = '';
                                    $scope.errormaxOil = false;
                                    $scope.transformerCreation.maxOil.$valid = true;

                                    $scope.errorlowOilMessage = '';
                                    $scope.errorlowOil = false;
                                    $scope.transformerCreation.lowOil.$valid = true;
                                } else {
                                    $scope.errorlowOilMessage = '';
                                    $scope.errorlowOil = false;
                                    $scope.transformerCreation.lowOil.$valid = true;
                                }
                            } else {
                                    $scope.errorlowOilMessage = 'Invalid Min Oil Temperature!';
                                    $scope.errorlowOil = true;
                                    $scope.transformerCreation.lowOil.$valid = false;
                            }
                        } else {
                            $scope.errorlowOilMessage = 'Min Oil Temperature is required!';
                            $scope.errorlowOil = true;
                            $scope.transformerCreation.lowOil.$valid = false;
                        }
                    }
                    else if (field === 'make') {
                        $scope.errorMake = false;
                        $scope.transformerCreation.make.$valid = true;
                        if ($scope.transfomerdetails.make === undefined ||
                            $scope.transfomerdetails.make.trim().length === 0) {
                            $scope.errorMakeMessage = 'Make is required!';
                            $scope.errorMake = true;
                            $scope.transformerCreation.make.$valid = false;
                        } else if (!pattern.test($scope.transfomerdetails.make)) {
                            $scope.errorMakeMessage = 'Invalid Make!';
                            $scope.errorMake = true;
                            $scope.transformerCreation.make.$valid = false;
                        } else if ($scope.transfomerdetails.make.length > 50) {
                            $scope.errorMakeMessage =
                                'Length of Make must not be more than 50!';
                            $scope.errorMake = true;
                            $scope.transformerCreation.make.$valid = false;
                        } else {
                            $scope.errorMake = false;
                            $scope.transformerCreation.make.$valid = true;
                        }
                    } else if (field === 'kvaRatingXmer') {
                        if ($scope.transfomerdetails.kvaRating === undefined ||
                            $scope.transfomerdetails.kvaRating.trim().length === 0) {
                            $scope.errorKvaRatingMessage = 'KVA Rating is required!';
                            $scope.errorKvaRating = true;
                        } else if ($scope.transfomerdetails.kvaRating <= 0 || $scope.transfomerdetails.kvaRating > 65535) {
                            $scope.errorKvaRatingMessage = 'Invalid KVA Rating!';
                            $scope.errorKvaRating = true;
                        } else {
                            $scope.errorKvaRating = false;
                        }
                    } else if (field === 'highLineV') {
                        $scope.errorhighLineV = false;
                        $scope.transformerCreation.highLineV.$valid = true;
                        if ($scope.transfomerdetails.highLineV === undefined ||
                            $scope.transfomerdetails.highLineV.trim().length === 0) {
                            $scope.errorhighLineVMessage =
                                'High Line Voltage is required!';
                            $scope.errorhighLineV = true;
                            $scope.transformerCreation.highLineV.$valid = false;
                        } else if ($scope.transfomerdetails.highLineV <= 0) {
                            $scope.errorhighLineVMessage =
                                'Invalid High Line Voltage!';
                            $scope.errorhighLineV = true;
                            $scope.transformerCreation.highLineV.$valid = false;
                        } else if (($scope.transfomerdetails.lowLineV !== undefined) &&
                            (parseInt($scope.transfomerdetails.highLineV, 10) <= parseInt($scope.transfomerdetails.lowLineV, 10))) {
                            $scope.errorhighLineVMessage =
                                'Must be higher than Low Line Voltage!';
                            $scope.errorhighLineV = true;
                            $scope.transformerCreation.highLineV.$valid = false;
                        } else {
                            $scope.errorhighLineV = false;
                            $scope.transformerCreation.highLineV.$valid = true;

                            if (($scope.transfomerdetails.lowLineV !== undefined && $scope.transfomerdetails.lowLineV > 0) &&
                            (parseInt($scope.transfomerdetails.highLineV, 10) > parseInt($scope.transfomerdetails.lowLineV, 10))) {
                                $scope.errorlowLineV = false;
                                $scope.transformerCreation.lowLineV.$valid = true;
                            }
                        }
                    } else if (field === 'lowLineV') {
                        $scope.errorlowLineV = false;
                        $scope.transformerCreation.lowLineV.$valid = true;
                        if ($scope.transfomerdetails.lowLineV === undefined ||
                            $scope.transfomerdetails.lowLineV.trim().length === 0) {
                            $scope.errorlowLineVMessage = 'Low Line Voltage is required!';
                            $scope.errorlowLineV = true;
                            $scope.transformerCreation.lowLineV.$valid = false;
                        } else if ($scope.transfomerdetails.lowLineV <= 0) {
                            $scope.errorlowLineVMessage =
                                'Invalid Low Line Voltage!';
                            $scope.errorlowLineV = true;
                            $scope.transformerCreation.lowLineV.$valid = false;
                        } else if (($scope.transfomerdetails.highLineV !== undefined) && (parseInt($scope.transfomerdetails.lowLineV, 10) >= parseInt($scope.transfomerdetails.highLineV, 10))) {
                            $scope.errorlowLineVMessage =
                                'Must be lower than High Line Voltage!';
                            $scope.errorlowLineV = true;
                            $scope.transformerCreation.lowLineV.$valid = false;
                        } else {
                            $scope.errorlowLineV = false;
                            $scope.transformerCreation.lowLineV.$valid = true;

                            if (($scope.transfomerdetails.highLineV !== undefined && $scope.transfomerdetails.highLineV > 0) &&
                            (parseInt($scope.transfomerdetails.highLineV, 10) > parseInt($scope.transfomerdetails.lowLineV, 10))) {
                                $scope.errorhighLineV = false;
                                $scope.transformerCreation.highLineV.$valid = true;
                            }
                        }
                    } else if (field === 'highLineCurrent') {
                        $scope.errorhighLineCurrent = false;
                        $scope.transformerCreation.highLineCurrent.$valid = true;
                        if ($scope.transfomerdetails.highLineCurrent === undefined ||
                            $scope.transfomerdetails.highLineCurrent.trim().length === 0) {
                            $scope.errorhighLineCurrentMessage =
                                'High Line Current is required!';
                            $scope.errorhighLineCurrent = true;
                            $scope.transformerCreation.highLineCurrent.$valid = false;
                        } else if ($scope.transfomerdetails.highLineCurrent <= 0 || $scope.transfomerdetails.highLineCurrent.length > 6) {
                            $scope.errorhighLineCurrentMessage =
                                'Invalid High Line Current!';
                            $scope.errorhighLineCurrent = true;
                            $scope.transformerCreation.highLineCurrent.$valid = false;
                        } else if ($scope.transfomerdetails.lowLineCurrent !== undefined &&
                            parseInt($scope.transfomerdetails.highLineCurrent) <= parseInt($scope.transfomerdetails.lowLineCurrent)) {
                            $scope.errorhighLineCurrentMessage = 'Must be higher than Low Line Current';
                            $scope.errorhighLineCurrent = true;
                            $scope.transformerCreation.highLineCurrent.$valid = false;
                        } else {
                            $scope.errorhighLineCurrent = false;
                            $scope.transformerCreation.highLineCurrent.$valid = true;

                            if (($scope.transfomerdetails.lowLineCurrent !== undefined && $scope.transfomerdetails.lowLineCurrent > 0 ) &&
                            (parseInt($scope.transfomerdetails.highLineCurrent, 10) > parseInt($scope.transfomerdetails.lowLineCurrent, 10))) {
                                $scope.errorlowLineCurrent = false;
                                $scope.transformerCreation.lowLineCurrent.$valid = true;
                            }
                        }
                    } else if (field === 'lowLineCurrent') {
                        $scope.errorlowLineCurrent = false;
                        $scope.transformerCreation.lowLineCurrent.$valid = true;
                        if ($scope.transfomerdetails.lowLineCurrent === undefined ||
                            $scope.transfomerdetails.lowLineCurrent.trim().length === 0) {
                            $scope.errorlowLineCurrentMessage =
                                'Low Line Current is required!';
                            $scope.errorlowLineCurrent = true;
                            $scope.transformerCreation.lowLineCurrent.$valid = false;
                        } else if ($scope.transfomerdetails.lowLineCurrent <= 0 || $scope.transfomerdetails.lowLineCurrent.length > 6) {
                            $scope.errorlowLineCurrentMessage =
                                'Invalid Low Line Current!';
                            $scope.errorlowLineCurrent = true;
                            $scope.transformerCreation.lowLineCurrent.$valid = false;
                        } else if ($scope.transfomerdetails.lowLineCurrent !== undefined &&
                            parseInt($scope.transfomerdetails.lowLineCurrent) >= parseInt($scope.transfomerdetails.highLineCurrent)) {
                            $scope.errorlowLineCurrentMessage =
                                'Must be lower than High Line Current';
                            $scope.errorlowLineCurrent = true;
                            $scope.transformerCreation.lowLineCurrent.$valid = false;
                        } else {
                            $scope.errorlowLineCurrent = false;
                            $scope.transformerCreation.lowLineCurrent.$valid = true;

                            if (($scope.transfomerdetails.highLineCurrent !== undefined ) && $scope.transfomerdetails.highLineCurrent > 0  &&
                            (parseInt($scope.transfomerdetails.highLineCurrent, 10) > parseInt($scope.transfomerdetails.lowLineCurrent, 10))) {
                                $scope.errorhighLineCurrent = false;
                                $scope.transformerCreation.highLineCurrent.$valid = true;
                            }
                        }
                    } else if (field === 'WireSize') {
                      if ($scope.transfomerdetails.WireSize) {
                        if (wireRegex.test($scope.transfomerdetails.WireSize)) {
                          if ($scope.transfomerdetails.WireSize === undefined ||
                              $scope.transfomerdetails.WireSize.trim().length === 0) {
                              $scope.errorWireSizeMessage = 'Wire Size is required!';
                              $scope.errorWireSize = true;
                              $scope.transformerCreation.WireSize.$valid = false;
                          } else if ($scope.transfomerdetails.WireSize <= 0) {
                              $scope.errorWireSizeMessage = 'Invalid Wire Size!';
                              $scope.errorWireSize = true;
                              $scope.transformerCreation.WireSize.$valid = false;
                          } else {
                              $scope.errorWireSize = false;
                              $scope.transformerCreation.WireSize.$valid = true;
                          }
                        } else {
                          $scope.errorWireSizeMessage = 'Invalid Wire Size!';
                          $scope.errorWireSize = true;
                          $scope.transformerCreation.WireSize.$valid = false;
                        }
                      } else {
                        $scope.errorWireSizeMessage = 'Wire Size is required!';
                        $scope.errorWireSize = true;
                        $scope.transformerCreation.WireSize.$valid = false;
                      }

                    }
                    else if (field === 'hypSl') {
                      if($scope.transfomerdetails.hypSl) {
                        if(!containsSpace.test($scope.transfomerdetails.hypSl)) {
                          if ($scope.transfomerdetails.hypSl === undefined ||
                              $scope.transfomerdetails.hypSl.trim().length === 0) {
                              $scope.errorhypSlMessage = 'HyperSPROUT\u2122 Serial is required!';
                              $scope.errorhypSl = true;
                              $scope.transformerCreation.hypSl.$valid = false;
                          } else if (!pattern.test($scope.transfomerdetails.hypSl)) {
                              $scope.errorhypSlMessage = 'Invalid HyperSPROUT\u2122 Serial Number!';
                              $scope.errorhypSl = true;
                              $scope.transformerCreation.hypSl.$valid = false;
                          } else if ($scope.transfomerdetails.hypSl.length < 10 || $scope.transfomerdetails.hypSl.length > 25) {
                              $scope.errorhypSlMessage =
                                  'Length of HyperSPROUT\u2122 Serial Number range should be from 10 to 25!';
                              $scope.errorhypSl = true;
                              $scope.transformerCreation.hypSl.$valid = false;
                          } else if ($scope.transfomerdetails.hypSl !== $scope.transfomerdetails.transformerSl) {
                              $scope.errorhypSlMessage =
                              'HS and Transformer Serial Number should be same';
                              $scope.errorhypSl = true;
                              $scope.transformerCreation.hypSl.$valid = false;
                          } else {
                              $scope.errorhypSl = false;
                              $scope.transformerCreation.hypSl.$valid = true;
                              $scope.errorXmerSl = false;
                              $scope.transformerCreation.transformerSl.$valid = true;
                          }
                        } else {
                          $scope.errorhypSlMessage = 'Invalid HyperSPROUT\u2122 Serial Number!';
                          $scope.errorhypSl = true;
                          $scope.transformerCreation.hypSl.$valid = false;
                        }
                      } else {
                        $scope.errorhypSlMessage = 'HyperSPROUT\u2122 Serial is required!';
                        $scope.errorhypSl = true;
                        $scope.transformerCreation.hypSl.$valid = false;
                      }
                    } else if (field === 'hypersproutMake') {
                        if($scope.transfomerdetails.hypersproutMake) {
                            if (nameRegex.test($scope.transfomerdetails.hypersproutMake)) {
                                if ($scope.transfomerdetails.hypersproutMake === undefined ||
                                    $scope.transfomerdetails.hypersproutMake.trim().length === 0) {
                                    $scope.errorhypersproutMakeMessage = 'HyperSPROUT\u2122 Name is required!';
                                    $scope.errorhypersproutMake = true;
                                    $scope.transformerCreation.hypersproutMake.$valid = false;
                                } else if (!pattern.test($scope.transfomerdetails.hypersproutMake)) {
                                    $scope.errorhypersproutMakeMessage = 'Invalid HyperSPROUT\u2122 Name!';
                                    $scope.errorhypersproutMake = true;
                                    $scope.transformerCreation.hypersproutMake.$valid = false;
                                } else if ($scope.transfomerdetails.hypersproutMake.length > 30) {
                                    $scope.errorhypersproutMakeMessage =
                                        'Length of HyperSPROUT\u2122 Name should not exceed 30!';
                                    $scope.errorhypersproutMake = true;
                                    $scope.transformerCreation.hypersproutMake.$valid = false;
                                } else {
                                    $scope.errorhypersproutMake = false;
                                    $scope.transformerCreation.hypersproutMake.$valid = true;
                                }
                            } else {
                                $scope.errorhypersproutMakeMessage ='Invalid HyperSPROUT\u2122 Name!';
                                $scope.errorhypersproutMake = true;
                                $scope.transformerCreation.hypersproutMake.$valid = false;
                            }
                        } else {
                            $scope.errorhypersproutMakeMessage ='HyperSPROUT\u2122 Name is required!';
                            $scope.errorhypersproutMake = true;
                            $scope.transformerCreation.hypersproutMake.$valid = false;
                        }
                    } else if (field === 'latitude') {
                        if ($scope.transfomerdetails.latitude === undefined ||
                            $scope.transfomerdetails.latitude.trim().length === 0) {
                            $scope.errorlatitudeMessage = 'Latitude is required!';
                            $scope.errorlatitude = true;
                            $scope.transformerCreation.latitude.$valid = false;
                        } else if (regLat.exec($scope.transfomerdetails.latitude)) {
                            $scope.errorlatitude = false;
                            $scope.transformerCreation.latitude.$valid = true;
                        } else {
                            $scope.errorlatitudeMessage =
                                'Invalid Latitude! The range of latitude is 0 to +/- 90';
                            $scope.errorlatitude = true;
                            $scope.transformerCreation.latitude.$valid = false;
                        }
                    } else if (field === 'longitude') {
                        if ($scope.transfomerdetails.longitude === undefined ||
                            $scope.transfomerdetails.longitude.trim().length === 0) {
                            $scope.errorlongitudeMessage = 'Longitude is required!';
                            $scope.errorlongitude = true;
                            $scope.transformerCreation.longitude.$valid = false;
                        } else if (regLon.exec($scope.transfomerdetails.longitude)) {
                            $scope.errorlongitude = false;
                            $scope.transformerCreation.longitude.$valid = true;
                        } else {
                            $scope.errorlongitudeMessage =
                                'Invalid Longitude! The range of longitude is 0 to +/- 180';
                            $scope.errorlongitude = true;
                            $scope.transformerCreation.longitude.$valid = false;
                        }
                    }  else if (field === 'wifiIpAdd') {
                        if ($scope.transfomerdetails.wifiIpAdd === undefined ||
                            $scope.transfomerdetails.wifiIpAdd.trim().length === 0) {
                            $scope.errorwifiIpAddMessage = 'Wifi IP Address is required!';
                            $scope.errorwifiIpAdd = true;
                            $scope.transformerCreation.wifiIpAdd.$valid = false;
                        } else if (ipV4Reg.exec($scope.transfomerdetails.wifiIpAdd)) {
                            $scope.errorwifiIpAdd = false;
                            $scope.transformerCreation.wifiIpAdd.$valid = true;
                        } else {
                            $scope.errorwifiIpAddMessage = 'Invalid Wifi IP Address!';
                            $scope.errorwifiIpAdd = true;
                            $scope.transformerCreation.wifiIpAdd.$valid = false;
                        }
                    } else if (field === 'wifiAccessPwd') {
                        if ($scope.transfomerdetails.wifiAccessPwd === undefined ||
                            $scope.transfomerdetails.wifiAccessPwd.trim().length === 0) {
                            $scope.errorwifiAccessPwdMessage = 'Password is required!';
                            $scope.errorwifiAccessPwd = true;
                            $scope.transformerCreation.wifiAccessPwd.$valid = false;
                        } else if ($scope.transfomerdetails.wifiAccessPwd.length < 8 || $scope.transfomerdetails.wifiAccessPwd.length > 20) {
                            $scope.errorwifiAccessPwdMessage =
                                'Length of password should between 8 to 20!';
                            $scope.errorwifiAccessPwd = true;
                            $scope.transformerCreation.wifiAccessPwd.$valid = false;
                        } else {
                            $scope.errorwifiAccessPwd = false;
                            $scope.transformerCreation.wifiAccessPwd.$valid = true;
                        }
                        var spc = ' ()-_+~,.?=`/\{}[]^';
                        if (!angular.isUndefinedOrNull($scope.transfomerdetails.wifiAccessPwd)) {
                            for (var i = 0; i < spc.length; i++) {
                                if ($scope.transfomerdetails.wifiAccessPwd.indexOf(spc[i]) !== 'undefined' && $scope.transfomerdetails.wifiAccessPwd.indexOf(spc[i]) > -1) {
                                    $scope.errorwifiAccessPwdMessage =
                                        'The character allowed for password' +
                                        ' are a-z, A-Z, 0-9 and !,@,#,$,%,&,*';
                                    $scope.errorwifiAccessPwd = true;
                                    $scope.transformerCreation.wifiAccessPwd.$valid = false;
                                    break;
                                }
                            }
                        }
                    } else if (field === 'simCard') {
                        if ($scope.transfomerdetails.simCard === undefined) {
                            $scope.errorsimCardMessage = 'Sim Card is required!';
                            $scope.errorsimCard = true;
                            $scope.transformerCreation.simCard.$valid = false;
                        } else if ($scope.transfomerdetails.simCard.length !== 10) {
                            $scope.errorsimCardMessage = 'SIM Card length should be 10!';
                            $scope.errorsimCard = true;
                            $scope.transformerCreation.simCard.$valid = false;
                        } else {
                            $scope.errorsimCard = false;
                            $scope.transformerCreation.simCard.$valid = true;
                        }
                    } else if (field === 'TFMRName') {
                        if($scope.transfomerdetails.TFMRName) {
                            if (nameRegex.test($scope.transfomerdetails.TFMRName)) {
                                if ($scope.transfomerdetails.TFMRName === undefined ||
                                    $scope.transfomerdetails.TFMRName.trim().length === 0) {
                                    $scope.errorhTFMRNameMessage = 'Transformer Name is required!';
                                    $scope.errorTFMRName = true;
                                    $scope.transformerCreation.TFMRName.$valid = false;
                                } else if (!pattern.test($scope.transfomerdetails.TFMRName)) {
                                    $scope.errorTFMRNameMessage = 'Invalid Transformer Name!';
                                    $scope.errorTFMRName = true;
                                    $scope.transformerCreation.TFMRName.$valid = false;
                                } else if ($scope.transfomerdetails.TFMRName.length > 30) {
                                    $scope.errorTFMRNameMessage =
                                        'Length of Transformer Name should not exceed 30!';
                                    $scope.errorTFMRName = true;
                                    $scope.transformerCreation.TFMRName.$valid = false;
                                } else {
                                    $scope.errorTFMRName = false;
                                    $scope.transformerCreation.TFMRName.$valid = true;
                                }
                            } else {
                                $scope.errorTFMRNameMessage ='Invalid Transformer Name!';
                                $scope.errorTFMRName = true;
                                $scope.transformerCreation.TFMRName.$valid = false;
                            }
                        } else {
                            $scope.errorTFMRNameMessage ='Transformer Name is required!';
                            $scope.errorTFMRName = true;
                            $scope.transformerCreation.TFMRName.$valid = false;
                        }                            

                    }
                    $scope.create_transformer_valid = $scope.errorXmerSl || $scope.errorMake || $scope.errorKvaRating ||
                        $scope.errorhighLineV || $scope.errorlowLineV || $scope.errorhighLineCurrent ||
                        $scope.errorlowLineCurrent || $scope.errorWireSize || $scope.errormaxOil || $scope.errorlowOil || $scope.errorhypSl ||
                        $scope.errorhypersproutMake || $scope.errorhypersproutVersion || $scope.errorctRatio ||
                        $scope.errorptRatio || $scope.errorgprs || $scope.errorlatitude ||
                        $scope.errorlongitude || $scope.errorwifiMacId || $scope.errorwifiIpAdd ||
                        $scope.errorwifiAccessPwd || $scope.errorsimCard;
                };

                /**
                 *  @description
                 * Event handler invoked when controller is destroyed
                 *
                 * @param field
                 * @return Nil

                 */
                $scope.$on('$destroy', function () {
                    if (!angular.isUndefinedOrNull(configurationData)) {
                        configurationData = null;
                    }
                });
                $scope.oneAtATime = true;
                $scope.status = {
                    isCustomHeaderOpen: false,
                    isFirstOpen: true,
                    isFirstDisabled: false
                };
                $scope.sensorErrorFlag = false;
                $scope.sensorInputValidation = function (e) {
                    if(e) {
                        $scope.sensorErrorFlag = !(e.length >= 1 && e.length < 251);
                    } else {
                        $scope.sensorErrorFlag = false;
                    }
                };

                $scope.transformPhases = function (phase) {
                    return Object.keys($scope.phases).find(key => $scope.phases[key] === phase);
                }
            }]);
})(window.angular);