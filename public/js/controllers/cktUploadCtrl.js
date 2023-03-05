/**
 * Controller to upload circuit
 * @description
 * Controller to Add User
 */
(function (angular) {
    'use strict';
    angular.module('dataVINEApp').controller('uploadCtrl',
        ['$scope',  '$uibModal','$modalInstance',
            'fileUpload', 'csvparser', 'DeviceService', 'uploadParam',
            function ($scope, $uibModal , $modalInstance,
                fileUpload, csvparser, deviceService, uploadParam) {
                $scope.duplicateIds = [];
                $scope.csvData = [];
                $scope.type = uploadParam.type;
                $scope.status = '';
                $scope.importStatus = false;
                $scope.circuitSelection = undefined;
                $scope.isSelected = false;
                $scope.mySelectedRows = [];
                $scope.csvDetails = angular.copy(objCacheDetails.grid);
                $scope.csvDetails.data = [];
                $scope.csvDetails.exporterPdfOrientation = 'landscape',
                $scope.csvDetails.exporterPdfMaxGridWidth = 1000;
                $scope.uploadStatus = false;
                $scope.csvDetails.columnDefs = [
                    { field: 'Serial No', displayName: uploadParam.type === 'endpointReg' ? 'MAC ID' : uploadParam.type === 'circuit'? 'DTC ID' :'Serial Number', width: 180},
                    { field: 'Status', displayName: 'Status'},
                    {
                        field: 'Comment', enableHiding: false,
                        cellTemplate: '<div style= "line-height: 15px;margin: 1px 4px 5px 0px;padding: 4px 7px 7px 6px;">' +
                            '{{row.entity.Comment}}  </div>'
                    }
                ];
                var modalInstance1 = null;
                $scope.circuitList =
                    (uploadParam.type === 'endpointReg') ? objCacheDetails.data.endpointData.circuitList : [];
                /**
                    * @description
                    * Function to upload file
                    *
                    * @param Nil
                    * @return Nil

                 */
                $scope.$watch('fileMod', function (newVal) {
                    if (newVal) {
                        $scope.checkFileExtension(newVal);
                    }
                });
                //Dynamic heading change in upload page
                var currenturl = window.location.href;
                var currenturlsplit = currenturl.split("/");
                $scope.headertext = currenturlsplit[currenturlsplit.length - 1];
                if(uploadParam.type === 'hyperhubConfig'){
                    $scope.ModalHeader =  "HyperHUB\u2122 Configurations";
                    $scope.ConfigUploadType =  "HyperHub";
                }else if(uploadParam.type === 'transformerConfig'){
                    $scope.ModalHeader =  "Transformer Configurations";
                    $scope.ConfigUploadType =  "HyperSprout";
                }else if(uploadParam.type === 'meterConfig'){
                    $scope.ModalHeader =  "Meter Configurations";
                }else if(currenturlsplit[currenturlsplit.length - 1] == "hyperHubEntry"){
                    $scope.ModalHeader =  "HyperHUB\u2122";
                }else  if(currenturlsplit[currenturlsplit.length - 1] == "meterEntry"){
                    $scope.ModalHeader =  "Meter"
                }else  if(currenturlsplit[currenturlsplit.length - 1] == "circuitEntry"){
                    $scope.ModalHeader =  "DTC"
                }else  if(currenturlsplit[currenturlsplit.length - 1] == "transformerEntry"){
                    $scope.ModalHeader =  "Transformer";
                }else  if(currenturlsplit[currenturlsplit.length - 1] == "deltaLinkEntry"){
                    $scope.ModalHeader =  "DeltaLINK\u2122"
                }else  if(currenturlsplit[currenturlsplit.length - 1] == "endpointEntry"){
                    $scope.ModalHeader =  "Endpoint"
                }
                $scope.invalidFile = false;
                var fileName ='';
                $scope.checkFileExtension = function (file) {
                    fileName = file.name;
                    if(file && file.name.includes('.')) {
                        var type = file.name.substring(file.name.lastIndexOf(".") + 1);
                        if (type === 'csv' && file.size !== 0) {
                            $scope.fileErrMessage = '';
                            $scope.invalidFile = false;
                        } else if(type === 'csv' && file.size === 0) {
                            $scope.fileErrMessage = 'File is empty!';
                            $scope.invalidFile = true;
                        } else {
                            $scope.fileErrMessage = 'Only .csv file format supported!';
                            $scope.invalidFile = true;
                        }
                    } else {
                        $scope.fileErrMessage = 'Select file only .csv extension';
                        $scope.invalidFile = true;
                    }
                };
                var dtcCircuitFields = ["CircuitID", "KVARating", "SubstationID", "Address", "SubstationName", "Country", "State", "City", "ZipCode", "Latitude", "Longitude"];
                var endpointFields = ["MacID", "Owner", "Description","DeviceType"];
                var hyperHubFields = ["HubSerialNumber", "HubName", "HardwareVersion", "GprsMacID", "WifiMacID", "WifiIPAddress", "WifiAccessPointPassword", "SimCardNumber", "Latitude", "Longitude","GroupTransformerSerialNo"];
                var meterFields = ["MeterSerialNumber","MeterApptype","MeterVersion","MeterInstallationLocation","MeterCTRatio","MeterPTRatio","MeterNumberOfPhases","MeterRatedFrequency","MeterRatedVoltage","MeterNominalCurrent","MeterMaximumCurrent","MeterAccuracy","MeterCompliantToStandards","MeterWiFiIpAddress","MeterWiFiAccessPointPassword","MeterAdminPassword","MeterLatitude","MeterLongitude","MeterConsumerNumber","MeterConsumerName","MeterConsumerAddress","MeterConsumerContactNumber","MeterBillingCycleDate","MeterBillingTime","MeterDemandResetDate","MeterMake","MeterDisconnector","MeterConsumerCountry","MeterConsumerState","MeterConsumerCity","MeterConsumerZipCode","MeterWiFiMacID","ImpulseCountKWh","ImpulseCountKVARh","SealID","BiDirectional","EVMeter","SolarPanel","GroupTransformerSerialNo"];
                var transformerFields = ["TFMRSerialNumber","TFMRName","TFMRMake","TFMRRatingCapacity","TFMRHighLineVoltage","TFMRLowLineVoltage","TFMRHighLineCurrent","TFMRLowLineCurrent","TFMRType","HypersproutSerialNumber","HypersproutVersion","HypersproutMake","HSCTRatio","HSPTRatio","HSRatedVoltage","HSNumberOfPhases","HSRatedFrequency","HSAccuracy","HSDemandResetDate","HSCompliantToStandards","HSMaxDemandWindow","HSMaxDemandSlidingWindowInterval","HSSensorDetails","HSGPRSMacID","HSWiFiMacID","HSWiFiIpAddress","HSSimCardNumber","HSLatitude","HSLongitude","WireSize","MaxOilTemp","MinOilTemp","CameraConnect","HSWiFiAccessPointPassword","GroupCircuitID"];
                var deltaLinkFields = ["DeltalinkSerialNumber","DeltalinkVersion","DeltalinkWiFiMacID","Bandwidth","DownloadBandwidth","UploadBandwidth","GroupMeterSerialNo"];
                var technicalLossFields = ["Name", "TransformerSerialNo", "Metered", "UsagePerDay", "NoOfConnectedItems", "UsageTime", "StartHour", "EndHour"];
                var transformerConfigFields = ["SerialNumber", "RadioMode2_4", "ChannelWidth2_4", "Channel2_4", "TransmitPower2_4", "GuardInterval2_4", "StreamSelection2_4", "RadioMode5_L", "ChannelWidth5_L", "Channel5_L", "TransmitPower5_L", "GuardInterval5_L", "StreamSelection5_L", "RadioMode5_H", "ChannelWidth5_H", "Channel5_H", "TransmitPower5_H", "GuardInterval5_H", "StreamSelection5_H", "MeshID2_4", "SecurityType2_4", "PreSharedKey2_4", "MeshID5_H", "SecurityType5_H", "PreSharedKey5_H", "HotspotStatus2_4_1", "SSID2_4_1", "WirelessSecurity2_4_1", "Password2_4_1", "HotspotStatus2_4_2", "SSID2_4_2", "WirelessSecurity2_4_2", "Password2_4_2", "HotspotStatus5_H_1", "SSID5_H_1", "WirelessSecurity5_H_1", "Password5_H_1", "HotspotStatus5_H_2", "SSID5_H_2", "WirelessSecurity5_H_2", "Password5_H_2", "DHCPStatus", "StartAddress", "EndAddress", "PrimaryDNS", "SecondaryDNS", "DefaultGateway", "SubnetMask", "UserName", "Password", "SimPin", "NetworkSelection", "CarrierName", "EthernetStatus", "EthernetIPAddress", "EthernetPrimaryDNS", "EthernetSecondaryDNS", "EthernetDefaultGateway", "EthernetSubnetMask", "PrimaryBackhaul", "AutoSwitchOver", "BandwidthStatus", "DownloadBandwidth", "UploadBandwidth", "SystemName", "Country", "TimeZone"];
                var meterConfigFields = ["SerialNumber", "RadioBand", "ChannelWidth", "Channel", "TransmitPower", "RadioMode", "StreamSelection", "PrimaryMeshID", "PrimarySecurityType", "PrimaryPreSharedKey", "PrimaryMacAddress", "PrimarySerialNumber", "PrimaryDeviceType", "SecondaryMeshID", "SecondarySecurityType", "SecondaryPreSharedKey", "SecondaryMacAddress", "SecondarySerialNumber", "SecondaryDeviceType", "SSID", "WirelessSecurity", "Password", "DHCPStatus", "StartAddress", "EndAddress", "PrimaryDNS", "SecondaryDNS", "DefaultGateway", "SubnetMask", "UtilityID", "CertificateNumber", "CircuitID", "ESN", "BandwidthStatus", "DownloadBandwidth",  "UploadBandwidth", "SystemName", "Country", "TimeZone"];
                var checkFlag = false;
                $scope.uploadFile = function () {
                    var objFileValid = csvparser.validateFiles($scope.fileContent);
                    if (!objFileValid.valid) {
                        swal(objFileValid.message);
                        return;
                    }
                    var objContent = CSVToArray($scope.fileContent.content);
                    if(objContent[0][11] == "HS Name"){
                        objContent[0][11] = objContent[0][11].replace("HS Name" , "HypersproutMake");
                    }
                    if (uploadParam.type === 'circuit') {
                        checkFlag = JSON.stringify(objContent[0]) == JSON.stringify(dtcCircuitFields);
                    } else if(uploadParam.type === 'meter') {
                        checkFlag = JSON.stringify(objContent[0]) == JSON.stringify(meterFields);
                    } else if(uploadParam.type === 'endpointReg') {
                        checkFlag = JSON.stringify(objContent[0]) == JSON.stringify(endpointFields);
                    } else if(uploadParam.type === 'transformer') {
                        checkFlag = JSON.stringify(objContent[0]) == JSON.stringify(transformerFields);
                    } else if(uploadParam.type === 'hyperHub') {
                        checkFlag = JSON.stringify(objContent[0]) == JSON.stringify(hyperHubFields);
                    } else if(uploadParam.type === 'deltaLink'){
                        checkFlag = JSON.stringify(objContent[0]) == JSON.stringify(deltaLinkFields);
                    } else if(uploadParam.type === 'technicalLoss'){
                        checkFlag = JSON.stringify(objContent[0]) == JSON.stringify(technicalLossFields);
                    } else if(uploadParam.type === 'transformerConfig' || uploadParam.type === 'hyperhubConfig'){
                        checkFlag = JSON.stringify(objContent[0]) == JSON.stringify(transformerConfigFields);
                    } else if(uploadParam.type === 'meterConfig'){
                        checkFlag = JSON.stringify(objContent[0]) == JSON.stringify(meterConfigFields);
                    } else {
                        return;
                    }
                    if(checkFlag) {
                        var objResult = csvparser.parseCSVConent(objContent);
                        var arrayData;
                        if (uploadParam.type === 'circuit') {
                            arrayData = ["Upload", objResult.CircuitID,
                                objResult.KVARating, objResult.SubstationID,
                                objResult.SubstationName,
                                objResult.Address, objResult.Country, objResult.State,
                                objResult.City, objResult.ZipCode,
                                objResult.Latitude, objResult.Longitude,
                                objResult["CircuitNote"]];
                        } else if (uploadParam.type === 'meter') {
                            arrayData = ["Upload", objResult.MeterSerialNumber,
                                objResult.MeterApptype, objResult.MeterVersion,
                                objResult.MeterInstallationLocation,
                                objResult.MeterCTRatio, objResult.MeterPTRatio,
                                objResult.MeterNumberOfPhases, objResult.MeterRatedFrequency,
                                objResult.MeterRatedVoltage, objResult.MeterNominalCurrent,
                                objResult.MeterMaximumCurrent, objResult.MeterAccuracy,
                                objResult.MeterCompliantToStandards,
                                objResult.MeterWiFiIpAddress, objResult.MeterWiFiAccessPointPassword,
                                objResult.MeterAdminPassword, objResult.MeterLatitude,
                                objResult.MeterLongitude, objResult.MeterConsumerNumber,
                                objResult.MeterConsumerName, objResult.MeterConsumerAddress,
                                objResult.MeterConsumerContactNumber, objResult.MeterBillingCycleDate,
                                objResult.MeterBillingTime, objResult.MeterDemandResetDate,
                                objResult.MeterMake, objResult.MeterDisconnector,
                                objResult.MeterConsumerCountry, objResult.MeterConsumerState,
                                objResult.MeterConsumerCity, objResult.MeterConsumerZipCode,
                                objResult.MeterWiFiMacID, objResult.ImpulseCountKWh,
                                objResult.ImpulseCountKVARh, objResult.SealID,
                                objResult.BiDirectional, objResult.EVMeter,
                                objResult.SolarPanel,objResult.GroupTransformerSerialNo];
                        } else if (uploadParam.type === 'endpointReg') {
                            arrayData = ["Upload", objResult.Owner,
                                objResult.MacID, objResult.Description,
                                $scope.circuitSelection.circuitId, objResult.DeviceType];
                        } else if (uploadParam.type === 'transformer') {
                            arrayData = ["Upload", objResult.TFMRSerialNumber,
                                objResult.TFMRName,
                                objResult.TFMRMake, objResult.TFMRRatingCapacity,
                                objResult.TFMRHighLineVoltage,
                                objResult.TFMRLowLineVoltage, objResult.TFMRHighLineCurrent,
                                objResult.TFMRLowLineCurrent, objResult.TFMRType,
                                objResult.HypersproutSerialNumber, objResult.HypersproutVersion,
                                objResult.HypersproutMake, objResult.HSCTRatio,
                                objResult.HSPTRatio, objResult.HSRatedVoltage,
                                objResult.HSNumberOfPhases, objResult.HSRatedFrequency,
                                objResult.HSAccuracy,
                                objResult.HSDemandResetDate, objResult.HSCompliantToStandards,
                                objResult.HSMaxDemandWindow,
                                objResult.HSMaxDemandSlidingWindowInterval,
                                objResult.HSSensorDetails, objResult.HSGPRSMacID,
                                objResult.HSWiFiMacID, objResult.HSWiFiIpAddress,
                                objResult.HSWiFiAccessPointPassword, objResult.HSSimCardNumber,
                                objResult.HSLatitude, objResult.HSLongitude,
                                objResult.MaxOilTemp, objResult.MinOilTemp,
                                objResult.WireSize, objResult.CameraConnect,objResult.GroupCircuitID];
                        } else if (uploadParam.type === 'hyperHub') {
                            arrayData = [objResult.HubSerialNumber, objResult.HubName,
                                objResult.HardwareVersion, objResult.GprsMacID,
                                objResult.WifiMacID, objResult.WifiIPAddress,
                                objResult.WifiAccessPointPassword,
                                objResult.Latitude, objResult.Longitude,
                                objResult.SimCardNumber,objResult.GroupTransformerSerialNo,"Upload"];
                        } else if (uploadParam.type === 'deltaLink') {
                            arrayData = ["Upload", objResult.DeltalinkSerialNumber, objResult.DeltalinkVersion,objResult.DeltalinkWiFiMacID,objResult.Bandwidth,objResult.DownloadBandwidth,objResult.UploadBandwidth,objResult.GroupMeterSerialNo];
                        } else if (uploadParam.type === 'transformerConfig' || uploadParam.type === 'hyperhubConfig') {
                            arrayData = ["Upload", $scope.ConfigUploadType, objResult.SerialNumber, objResult.RadioMode2_4, objResult.ChannelWidth2_4, objResult.Channel2_4, objResult.TransmitPower2_4, objResult.GuardInterval2_4, objResult.StreamSelection2_4, objResult.RadioMode5_L, objResult.ChannelWidth5_L, objResult.Channel5_L, objResult.TransmitPower5_L, objResult.GuardInterval5_L, objResult.StreamSelection5_L, objResult.RadioMode5_H, objResult.ChannelWidth5_H, objResult.Channel5_H, objResult.TransmitPower5_H, objResult.GuardInterval5_H, objResult.StreamSelection5_H, objResult.MeshID2_4, objResult.SecurityType2_4, objResult.PreSharedKey2_4, objResult.MeshID5_H, objResult.SecurityType5_H, objResult.PreSharedKey5_H, objResult.HotspotStatus2_4_1, objResult.SSID2_4_1, objResult.WirelessSecurity2_4_1, objResult.Password2_4_1, objResult.HotspotStatus2_4_2, objResult.SSID2_4_2, objResult.WirelessSecurity2_4_2, objResult.Password2_4_2, objResult.HotspotStatus5_H_1, objResult.SSID5_H_1, objResult.WirelessSecurity5_H_1, objResult.Password5_H_1, objResult.HotspotStatus5_H_2, objResult.SSID5_H_2, objResult.WirelessSecurity5_H_2, objResult.Password5_H_2, objResult.DHCPStatus, objResult.StartAddress, objResult.EndAddress, objResult.PrimaryDNS, objResult.SecondaryDNS, objResult.DefaultGateway, objResult.SubnetMask, objResult.UserName, objResult.Password, objResult.SimPin, objResult.NetworkSelection, objResult.CarrierName, objResult.EthernetStatus, objResult.EthernetIPAddress, objResult.EthernetPrimaryDNS, objResult.EthernetSecondaryDNS, objResult.EthernetDefaultGateway, objResult.EthernetSubnetMask, objResult.PrimaryBackhaul, objResult.AutoSwitchOver, objResult.BandwidthStatus, objResult.DownloadBandwidth, objResult.UploadBandwidth, objResult.SystemName, objResult.Country, objResult.TimeZone];
                        } else if (uploadParam.type === 'meterConfig') {
                            arrayData = ["Upload", "Meter", objResult.SerialNumber, objResult.RadioMode, objResult.ChannelWidth, objResult.Channel, objResult.TransmitPower, objResult.RadioBand, objResult.StreamSelection, objResult.PrimaryMeshID, objResult.PrimarySecurityType, objResult.PrimaryPreSharedKey, objResult.PrimaryMacAddress, objResult.PrimarySerialNumber , objResult.PrimaryDeviceType, objResult.SecondaryMeshID, objResult.SecondarySecurityType, objResult.SecondaryPreSharedKey, objResult.SecondaryMacAddress, objResult.SecondarySerialNumber, objResult.SecondaryDeviceType, objResult.SSID, objResult.WirelessSecurity, objResult.Password, objResult.DHCPStatus, objResult.StartAddress, objResult.EndAddress, objResult.PrimaryDNS, objResult.SecondaryDNS, objResult.DefaultGateway, objResult.SubnetMask, objResult.UtilityID, objResult.CertificateNumber, objResult.CircuitID, objResult.ESN, objResult.BandwidthStatus, objResult.DownloadBandwidth, objResult.UploadBandwidth, objResult.SystemName, objResult.Country, objResult.TimeZone];
                        } else {
                            arrayData = ["Upload", objResult.Name, objResult.TransformerSerialNo, objResult.Metered, objResult.UsagePerDay, objResult.NoOfConnectedItems, objResult.UsageTime, objResult.StartHour, objResult.EndHour];
                        }
                        if (!angular.isUndefinedOrNull(objResult) && objContent.length > 502) { 
                            $scope.fileErrMessage = 'Total number of records should not be more than 500';
                            $scope.invalidFile = true;
                        } else if (!angular.isUndefinedOrNull(objResult) &&
                                    objContent.length > 1 && objContent[1] != "") {
                            deviceService.create(uploadParam.endPoint, arrayData, 'upload')
                                .then(function (obj) {
                                    $scope.uploadStatus = true;
                                    $scope.duplicateIds = obj.Errors;
                                    $scope.ResultArry = obj.Result;
                                    $scope.status = obj.Message;
                                    $scope.importStatus = true;
                                    $scope.message = obj.Message;
                                    //$scope.type = obj.type;
                                    $scope.payloaderror = obj.PayloadErrors;
                                    //for showing data in grid after successfully csv file submission
                                    $scope.csvDetails = angular.copy(objCacheDetails.grid);
                                    $scope.csvDetails.data = [];
                                    let csvData = [];
                                    $scope.csvDetails.exporterPdfOrientation = 'landscape',
                                    $scope.csvDetails.exporterPdfMaxGridWidth = 1000;
                                    $scope.csvDetails.columnDefs = [
                                        { field: 'SerialNumber', displayName: uploadParam.type === 'endpointReg' ? 'MAC ID' : uploadParam.type === 'circuit'? 'DTC ID' :'Serial Number', width: 170},
                                        { field: 'Status', displayName: 'Status', width: 60},
                                        {
                                            field: 'Comment', enableHiding: false,
                                            cellTemplate: '<div style= "line-height: 15px;margin: 1px 4px 5px 0px;padding: 4px 7px 7px 6px;">' +
                                                '{{row.entity.Comment}}  </div>'
                                        }
                                    ];
                                    //For blank field validation
                                    if (obj.PayloadErrors != undefined){
                                    for(var i = 0; i< obj.PayloadErrors.length ; i++){
                                        //for required fields only
                                        //if in api respose type is "any.required"
                                        if(obj.PayloadErrors[i].type == "any.required"){
                                            let requiredField= (obj.PayloadErrors[i].path[0]).toLowerCase();
                                            //if the required field validation is already done
                                            if(csvData.length >0){
                                                for(var p = 0; p< csvData.length; p++){
                                                var  csvComment = csvData[p].Comment.toLowerCase();
                                                var n = csvComment.includes(requiredField);
                                                    if(n == false){
                                                    for(var l=1; l< objContent.length-1 ; l++){
                                                        if(objContent[l] != ""){
                                                            for(var k=0 ; k< objContent[0].length; k++){
                                                                if(objContent[0][k].toLowerCase() == obj.PayloadErrors[i].path[0].toLowerCase()){
                                                                    if(objContent[l][k] == ""){
                                                                        $scope.filestatus = true;
                                                                        let objToInsert = {};
                                                                        var check = 0;
                                                                        //for duplicate serial number in response
                                                                    if(csvData.length >0){
                                                                        for (var j = 0; j < csvData.length; j++) {
                                                                            if(objContent[l][0] === csvData[j].SerialNumber)
                                                                            {
                                                                                if(objContent[0][k] == "HypersproutMake"){
                                                                                    objContent[0][k] = objContent[0][k].replace("HypersproutMake" , " HS Name");
                                                                                }
                                                                                check =1;                                                        
                                                                                csvData[j].Comment = csvData[j].Comment+', \n ' +  objContent[0][k] + " is blank "; 
                                                                                break;
                                                                            }                                                    
                                                                        }     
                                                                    }  
                                                                    if(check==0){
                                                                        if(objContent[0][k] == "HypersproutMake"){
                                                                            objContent[0][k] = objContent[0][k].replace("HypersproutMake" , " HS Name");
                                                                        }
                                                                        objToInsert["SerialNumber"] = objContent[l][0];
                                                                        objToInsert["Status"] = "Fail";
                                                                        objToInsert["Comment"] =  objContent[0][k] + " is blank ";
                                                                        csvData.push(objToInsert);
                                                                    }
                                                                    }
                                                                }
                                                               
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                            }//end of if the required field validation is already done
                                            //for the new field validation
                                            else{
                                            for(var l=1; l< objContent.length-1 ; l++){
                                                if(objContent[l] != ""){
                                                    for(var k=0 ; k< objContent[0].length; k++){
                                                        if(objContent[0][k].toLowerCase() == obj.PayloadErrors[i].path[0].toLowerCase()){
                                                            if(objContent[l][k] == ""){
                                                                $scope.filestatus = true;
                                                                let objToInsert = {};
                                                                var check = 0;
                                                                //for duplicate serial number in response
                                                            if(csvData.length >0){
                                                                for (var j = 0; j < csvData.length; j++) {
                                                                    if(objContent[l][0] === csvData[j].SerialNumber)
                                                                    {
                                                                        if(objContent[0][k] == "HypersproutMake"){
                                                                            objContent[0][k] = objContent[0][k].replace("HypersproutMake" , " HS Name");
                                                                        }
                                                                        check =1;                                                        
                                                                        csvData[j].Comment = csvData[j].Comment+', \n ' +  objContent[0][k] + " is blank "; 
                                                                        break;
                                                                    }                                                    
                                                                }     
                                                            }  
                                                            if(check==0){
                                                                if(objContent[0][k] == "HypersproutMake"){
                                                                    objContent[0][k] = objContent[0][k].replace("HypersproutMake" , " HS Name");
                                                                }
                                                                objToInsert["SerialNumber"] = objContent[l][0];
                                                                objToInsert["Status"] = "Fail";
                                                                objToInsert["Comment"] =  objContent[0][k] + " is blank ";
                                                                csvData.push(objToInsert);
                                                            }
                                                            }
                                                        }
                                                       
                                                    }
                                                }
                                            }
                                        }
                                        } else if(obj.PayloadErrors[i].type == "any.allowOnly"){
                                        //any.allowOnly validation
                                            let requiredField= (obj.PayloadErrors[i].path[0]).toLowerCase();
                                            //if the required field validation is already done
                                            if(csvData.length >0){
                                                for(var p = 0; p< csvData.length; p++){
                                                var  csvComment = csvData[p].Comment.toLowerCase();
                                                var n = csvComment.includes(requiredField);
                                                    if(n == false){
                                                        for(var l=1; l< objContent.length-1 ; l++){
                                                            if(objContent[l] != ""){
                                                                for(var k=0 ; k< objContent[0].length; k++){
                                                                    if(objContent[0][k].toLowerCase() == obj.PayloadErrors[i].path[0].toLowerCase()){
                                                                          //validation for bandwidth
                                                                        if(obj.PayloadErrors[i].path[0] == "Bandwidth"){
                                                                            if(objContent[l][k] == 0 || objContent[l][k]== 1 ){
                                                                                continue;
                                                                            }else{
                                                                                $scope.filestatus = true;
                                                                                let objToInsert = {};
                                                                                var check = 0;
                                                                                  //for duplicate serial number in response
                                                                                  if(csvData.length >0){
                                                                                    for (var j = 0; j < csvData.length; j++) {
                                                                                        if(objContent[l][0] === csvData[j].SerialNumber)
                                                                                        {
                                                                                            check =1;                                                        
                                                                                            csvData[j].Comment = csvData[j].Comment+', \n ' +  objContent[0][k] + " is incorrect "; 
                                                                                            break;
                                                                                        }                                                    
                                                                                    }     
                                                                                }  
                                                                                if(check==0){
                                                                                    objToInsert["SerialNumber"] = objContent[l][0];
                                                                                    objToInsert["Status"] = "Fail";
                                                                                    objToInsert["Comment"] =  objContent[0][k] + " is not correct ";
                                                                                    csvData.push(objToInsert);
                                                                                    break;
                                                                                }
                                                                            }
                                                                        }//end of validation for bandwidth
                                                                        else if(obj.PayloadErrors[i].path[0] === "DeviceType"){
                                                                            if(objContent[l][k] === "Roaming Devices"  || objContent[l][k]== "Secondary Network" ){
                                                                              continue;
                                                                              }else{
                                                                                  $scope.filestatus = true;
                                                                                  let objToInsert = {};
                                                                                  var check = 0;
                                                                                    //for duplicate serial number in response
                                                                                    if(csvData.length >0){
                                                                                      for (var j = 0; j < csvData.length; j++) {
                                                                                          if(objContent[l][0] === csvData[j].SerialNumber)
                                                                                          {
                                                                                              check =1;                                                        
                                                                                              csvData[j].Comment = csvData[j].Comment+', \n ' +  objContent[0][k] + " is incorrect "; 
                                                                                              break;
                                                                                          }                                                    
                                                                                      }     
                                                                                  }  
                                                                                  if(check==0){
                                                                                      objToInsert["SerialNumber"] = objContent[l][0];
                                                                                      objToInsert["Status"] = "Fail";
                                                                                      objToInsert["Comment"] =  objContent[0][k] + " is not correct ";
                                                                                      csvData.push(objToInsert);
                                                                                      break;
                                                                                  }
                                                                              }
                                                                        }else{
                                                                            $scope.filestatus = true;
                                                                                  let objToInsert = {};
                                                                                  var check = 0;
                                                                                    //for duplicate serial number in response
                                                                                    if(csvData.length >0){
                                                                                      for (var j = 0; j < csvData.length; j++) {
                                                                                          if(objContent[l][0] === csvData[j].SerialNumber)
                                                                                          {
                                                                                              check =1;                                                        
                                                                                              csvData[j].Comment = csvData[j].Comment+', \n ' +  objContent[0][k] + " is incorrect "; 
                                                                                              break;
                                                                                          }                                                    
                                                                                      }     
                                                                                  }  
                                                                                  if(check==0){
                                                                                      objToInsert["SerialNumber"] = objContent[l][0];
                                                                                      objToInsert["Status"] = "Fail";
                                                                                      objToInsert["Comment"] =  objContent[0][k] + " is not correct ";
                                                                                      csvData.push(objToInsert);
                                                                                      break;
                                                                                  }
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }//end of if the allow field validation is already done
                                            else{
                                            for(var l=1; l< objContent.length-1 ; l++){
                                                if(objContent[l] != ""){
                                                    for(var k=0 ; k< objContent[0].length; k++){
                                                        if(objContent[0][k].toLowerCase() == obj.PayloadErrors[i].path[0].toLowerCase()){
                                                            //validation for bandwidth
                                                            if(obj.PayloadErrors[i].path[0] == "Bandwidth"){
                                                                if(objContent[l][k] == 0 || objContent[l][k]== 1 ){
                                                                    continue;
                                                                }else{
                                                                    $scope.filestatus = true;
                                                                    let objToInsert = {};
                                                                    var check = 0;
                                                                      //for duplicate serial number in response
                                                                      if(csvData.length >0){
                                                                        for (var j = 0; j < csvData.length; j++) {
                                                                            if(objContent[l][0] === csvData[j].SerialNumber)
                                                                            {
                                                                                check =1;                                                        
                                                                                csvData[j].Comment = csvData[j].Comment+', \n ' +  objContent[0][k] + " is incorrect "; 
                                                                                break;
                                                                            }                                                    
                                                                        }     
                                                                    }  
                                                                    if(check==0){
                                                                        objToInsert["SerialNumber"] = objContent[l][0];
                                                                        objToInsert["Status"] = "Fail";
                                                                        objToInsert["Comment"] =  objContent[0][k] + " is not correct ";
                                                                        csvData.push(objToInsert);
                                                                        break;
                                                                    }
                                                                }
                                                            }//end of alidation for bandwidth
                                                          else if(obj.PayloadErrors[i].path[0] === "DeviceType"){
                                                              if(objContent[l][k] === "Roaming Devices"  || objContent[l][k]== "Secondary Network" ){
                                                                continue;
                                                                }else{
                                                                    $scope.filestatus = true;
                                                                    let objToInsert = {};
                                                                    var check = 0;
                                                                      //for duplicate serial number in response
                                                                      if(csvData.length >0){
                                                                        for (var j = 0; j < csvData.length; j++) {
                                                                            if(objContent[l][0] === csvData[j].SerialNumber)
                                                                            {
                                                                                check =1;                                                        
                                                                                csvData[j].Comment = csvData[j].Comment+', \n ' +  objContent[0][k] + " is incorrect "; 
                                                                                break;
                                                                            }                                                    
                                                                        }     
                                                                    }  
                                                                    if(check==0){
                                                                        objToInsert["SerialNumber"] = objContent[l][0];
                                                                        objToInsert["Status"] = "Fail";
                                                                        objToInsert["Comment"] =  objContent[0][k] + " is not correct ";
                                                                        csvData.push(objToInsert);
                                                                        break;
                                                                    }
                                                                }
                                                            }else{
                                                                $scope.filestatus = true;
                                                                                  let objToInsert = {};
                                                                                  var check = 0;
                                                                                    //for duplicate serial number in response
                                                                                    if(csvData.length >0){
                                                                                      for (var j = 0; j < csvData.length; j++) {
                                                                                          if(objContent[l][0] === csvData[j].SerialNumber)
                                                                                          {
                                                                                              check =1;                                                        
                                                                                              csvData[j].Comment = csvData[j].Comment+', \n ' +  objContent[0][k] + " is incorrect "; 
                                                                                              break;
                                                                                          }                                                    
                                                                                      }     
                                                                                  }  
                                                                                  if(check==0){
                                                                                      objToInsert["SerialNumber"] = objContent[l][0];
                                                                                      objToInsert["Status"] = "Fail";
                                                                                      objToInsert["Comment"] =  objContent[0][k] + " is not correct ";
                                                                                      csvData.push(objToInsert);
                                                                                      break;
                                                                                  }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                        }
                                         //if in api respose type is "any.empty"
                                        else if(obj.PayloadErrors[i].type == "any.empty"){
                                            let requiredField= (obj.PayloadErrors[i].path[0]).toLowerCase();
                                            //if the required field validation is already done
                                            if(csvData.length >0){
                                                for(var p = 0; p< csvData.length; p++){
                                                var  csvComment = csvData[p].Comment.toLowerCase();
                                                var n = csvComment.includes(requiredField);
                                                    if(n == false){
                                                    for(var l=1; l< objContent.length-1 ; l++){
                                                        if(objContent[l] != ""){
                                                            for(var k=0 ; k< objContent[0].length; k++){
                                                                if(objContent[0][k].toLowerCase() == obj.PayloadErrors[i].path[0].toLowerCase()){
                                                                    if(objContent[l][k] == ""){
                                                                        $scope.filestatus = true;
                                                                        let objToInsert = {};
                                                                        var check = 0;
                                                                        //for duplicate serial number in response
                                                                    if(csvData.length >0){
                                                                        for (var j = 0; j < csvData.length; j++) {
                                                                            if(objContent[l][0] === csvData[j].SerialNumber)
                                                                            {
                                                                                check =1;                                                        
                                                                                csvData[j].Comment = csvData[j].Comment+', \n ' +  objContent[0][k] + " is blank "; 
                                                                                break;
                                                                            }                                                    
                                                                        }     
                                                                    }  
                                                                    if(check==0){
                                                                        objToInsert["SerialNumber"] = objContent[l][0];
                                                                        objToInsert["Status"] = "Fail";
                                                                        objToInsert["Comment"] =  objContent[0][k] + " is blank ";
                                                                        csvData.push(objToInsert);
                                                                    }
                                                                    }
                                                                }
                                                               
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                            }//end of if the required field validation is already done
                                            //for the new field validation
                                            else{
                                            for(var l=1; l< objContent.length-1 ; l++){
                                                if(objContent[l] != ""){
                                                    for(var k=0 ; k< objContent[0].length; k++){
                                                        if(objContent[0][k].toLowerCase() == obj.PayloadErrors[i].path[0].toLowerCase()){
                                                            if(objContent[l][k] == ""){
                                                                $scope.filestatus = true;
                                                                let objToInsert = {};
                                                                var check = 0;
                                                                //for duplicate serial number in response
                                                            if(csvData.length >0){
                                                                for (var j = 0; j < csvData.length; j++) {
                                                                    if(objContent[l][0] === csvData[j].SerialNumber)
                                                                    {
                                                                        check =1;                                                        
                                                                        csvData[j].Comment = csvData[j].Comment+', \n ' +  objContent[0][k] + " is blank "; 
                                                                        break;
                                                                    }                                                    
                                                                }     
                                                            }  
                                                            if(check==0){
                                                                objToInsert["SerialNumber"] = objContent[l][0];
                                                                objToInsert["Status"] = "Fail";
                                                                objToInsert["Comment"] =  objContent[0][k] + " is blank ";
                                                                csvData.push(objToInsert);
                                                            }
                                                            }
                                                        }
                                                       
                                                    }
                                                }
                                            }
                                        }
                                        }//end of if in api respose type is "any.empty"
                                        //validation null invalid and undefined value  any.invalid
                                        else if(obj.PayloadErrors[i].type == "any.invalid"){
                                            let invalidField= (obj.PayloadErrors[i].path[0]).toLowerCase();
                                            //if the required field validation is already done
                                            if(csvData.length >0){
                                                for(var p = 0; p< csvData.length; p++){
                                                var  csvComment = csvData[p].Comment.toLowerCase();
                                                var n = csvComment.includes(invalidField);
                                                    if(n == false){
                                                    for(var l=1; l< objContent.length-1 ; l++){
                                                        if(objContent[l] != ""){
                                                            for(var k=0 ; k< objContent[0].length; k++){
                                                                if(objContent[0][k].toLowerCase() == obj.PayloadErrors[i].path[0].toLowerCase()){
                                                                    if(objContent[l][k] == "null" || objContent[l][k] == "undefined" || objContent[l][k] == true ||  objContent[l][k] == false || objContent[l][k] == "true" || objContent[l][k] == "true" ){
                                                                        $scope.filestatus = true;
                                                                        let objToInsert = {};
                                                                        var check = 0;
                                                                        //for duplicate serial number in response
                                                                    if(csvData.length >0){
                                                                        for (var j = 0; j < csvData.length; j++) {
                                                                            if(objContent[l][0] === csvData[j].SerialNumber)
                                                                            {
                                                                                if(objContent[0][k] == "HypersproutMake"){
                                                                                    objContent[0][k] = objContent[0][k].replace("HypersproutMake" , " HS Name");
                                                                                }
                                                                                check =1;                                                        
                                                                                csvData[j].Comment = csvData[j].Comment+', \n ' +  objContent[0][k] + " is invalid "; 
                                                                                break;
                                                                            }                                                    
                                                                        }     
                                                                    }  
                                                                    if(check==0){
                                                                        if(objContent[0][k] == "HypersproutMake"){
                                                                            objContent[0][k] = objContent[0][k].replace("HypersproutMake" , " HS Name");
                                                                        }
                                                                        objToInsert["SerialNumber"] = objContent[l][0];
                                                                        objToInsert["Status"] = "Fail";
                                                                        objToInsert["Comment"] =  objContent[0][k] + " is invalid ";
                                                                        csvData.push(objToInsert);
                                                                    }
                                                                    }
                                                                }
                                                               
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                            }//end of if the required field validation is already done
                                            //for the new field validation
                                            else{
                                            for(var l=1; l< objContent.length-1 ; l++){
                                                if(objContent[l] != ""){
                                                    for(var k=0 ; k< objContent[0].length; k++){
                                                        if(objContent[0][k].toLowerCase() == obj.PayloadErrors[i].path[0].toLowerCase()){
                                                            if(objContent[l][k] == "null" || objContent[l][k] == "undefined" || objContent[l][k] == true ||  objContent[l][k] == false || objContent[l][k] == "true" || objContent[l][k] == "true" ){
                                                                $scope.filestatus = true;
                                                                let objToInsert = {};
                                                                var check = 0;
                                                                //for duplicate serial number in response
                                                            if(csvData.length >0){
                                                                for (var j = 0; j < csvData.length; j++) {
                                                                    if(objContent[l][0] === csvData[j].SerialNumber)
                                                                    {
                                                                        if(objContent[0][k] == "HypersproutMake"){
                                                                            objContent[0][k] = objContent[0][k].replace("HypersproutMake" , " HS Name");
                                                                        }
                                                                        check =1;                                                        
                                                                        csvData[j].Comment = csvData[j].Comment+', \n ' +  objContent[0][k] + " is invalid "; 
                                                                        break;
                                                                    }                                                    
                                                                }     
                                                            }  
                                                            if(check==0){
                                                                if(objContent[0][k] == "HypersproutMake"){
                                                                    objContent[0][k] = objContent[0][k].replace("HypersproutMake" , " HS Name");
                                                                }
                                                                objToInsert["SerialNumber"] = objContent[l][0];
                                                                objToInsert["Status"] = "Fail";
                                                                objToInsert["Comment"] =  objContent[0][k] + " is invalid ";
                                                                csvData.push(objToInsert);
                                                            }
                                                            }
                                                        }
                                                       
                                                    }
                                                }
                                            }
                                        }
                                        } else if(obj.PayloadErrors[i].type == "string.regex.base"){
                                            if(obj.PayloadErrors.length > 1){
                                                $scope.filestatus = true;
                                                let objToInsert = {};
                                                var check = 0;
                                                if(check==0){
                                                    objToInsert["SerialNumber"] = objContent[obj.PayloadErrors[i].path[1]+1][0];
                                                    objToInsert["Status"] = "Fail";
                                                    objToInsert["Comment"] =  obj.PayloadErrors[i].path[0] + " is invalid ";
                                                    csvData.push(objToInsert);
                                                }

                                            }
                                        }
                                    }
                                }
                                        //for error message showing in grid and duplicate serial number restriction
                                        if (obj.Result != undefined){
                                            for (var i = 0; i < obj.Result.length; i++) {
                                                let objToInsert = {};
                                                var check = 0;
                                                //for duplicate serial number in response
                                                if(csvData.length >0){
                                                    for (var j = 0; j < csvData.length; j++) {
                                                        if(obj.Result[i].SerialNumber === csvData[j].SerialNumber)
                                                        {
                                                            check =1;                                                        
                                                            csvData[j].Comment = csvData[j].Comment+', \n ' + obj.Result[i].Comment; 
                                                            break;
                                                        }                                                    
                                                    }     
                                                }  
                                                if(check==0)
                                                {
                                                    objToInsert["SerialNumber"] = obj.Result[i].SerialNumber;
                                                    objToInsert["Status"] = obj.Result[i].Status;
                                                    objToInsert["Comment"] = obj.Result[i].Comment;
                                                    csvData.push(objToInsert);
                                                }
                                                
                                            }
                                        }
                                    $scope.csvDetails.data = csvData;
                                });
                        } else {
                            swal('Uploaded csv file is empty');
                            $scope.importStatus = true;
                        }
                    } else {
                        $scope.fileErrMessage = 'Uploaded csv file is not valid!';
                        $scope.invalidFile = true;
                    }
                };

                /**
                    * @description
                    * Function to close pop-u
                    *
                    * @param Nil
                    * @return Nil

                 */
                $scope.cancel = function () {
                    if($scope.uploadStatus) {
                        $modalInstance.dismiss(true);
                    } else {
                        $modalInstance.dismiss(false);
                    }                  
                };
            }]);
})(window.angular);
