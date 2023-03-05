/**
 * Gives a set of functions common across controllers
 */
(function (angular) {
    "use strict";
    angular.module('dataVINEApp').service('commonService', ['$uibModal',
        function ($uibModal) {
            var unique = true;

            /**
             * Opens a modal window
             */
            this.modalWindow = function (templatePath, ctrlName, type, row) {
                if (angular.isUndefinedOrNull(objCacheDetails.data.systmDeviceMgmtDetails)) {
                    objCacheDetails.data.systmDeviceMgmtDetails = {};
                }
                objCacheDetails.data.systmDeviceMgmtDetails.selectedRow = row.entity;
                $uibModal.open({
                    templateUrl: templatePath,
                    controller: ctrlName,
                    size: 'md',
                    backdrop: 'static',
                    keyboard: true,
                    resolve: {
                        type: function () {
                            return type;
                        }
                    }
                });
            };
   /**
             * Opens a modal window
             */
            this.confirmationModalWindow = function (templatePath, ctrlName, type, row) {
                if (angular.isUndefinedOrNull(objCacheDetails.data.systmDeviceMgmtDetails)) {
                    objCacheDetails.data.systmDeviceMgmtDetails = {};
                }
                objCacheDetails.data.systmDeviceMgmtDetails.selectedRow = row.entity;
                $uibModal.open({
                    templateUrl: templatePath,
                    controller: ctrlName,
                    size: 'sm',
                    backdrop: 'static',
                    windowClass: 'centermodal',
                    keyboard: true,
                    resolve: {
                        type: function () {
                            return type;
                        }
                    }
                });
            };
            /**
             * Adds data to the table in UI grid
             */
            this.getGridApi = function (scope, gridApi) {

                gridApi.selection.on.rowSelectionChanged(scope, function () {
                    scope.mySelectedRows = gridApi.selection.getSelectedRows();
                });
                gridApi.selection.on.rowSelectionChangedBatch(scope, function (rows) {
                    var temp = [];
                    for (var i = 0; i < rows.length; i++) {
                        if (rows[i].isSelected) {
                            temp.push(rows[i].entity);
                        }
                    }
                    scope.mySelectedRows = temp;
                });
            };

            /**
             * TBD
             */
            this.getData = function (type, objData) {
                var objGroupCount = {};
                var objAppCount = {};
                var arrayOfObj = [];
                if (!angular.isUndefinedOrNull(objData) && !angular.isUndefinedOrNull(objData.appGroupCount)) {
                    for (var count in objData.appGroupCount) {
                        objAppCount[objData.appGroupCount[count]["AppID"]] = {
                            "Members": objData.appGroupCount[count]["Members"],
                        };
                    }
                }
                if (!angular.isUndefinedOrNull(objData) && !angular.isUndefinedOrNull(objData.configGroupCount)) {
                    for (var count1 in objData.configGroupCount) {
                        objGroupCount[objData.configGroupCount[count1]["configID"]] = {
                            "Members": objData.configGroupCount[count1]["Members"],
                        };
                    }
                }
                if (!angular.isUndefinedOrNull(objData) && !angular.isUndefinedOrNull(objData.dataFromConfigGrps)) {
                    for (var i in objData.dataFromConfigGrps) {
                        if (objData.dataFromConfigGrps.hasOwnProperty(i)) {
                            var objToInsertConfGroup;
                            objToInsertConfGroup = (type === 'HyperSprout') ? { "Group Type": 'Configuration Group' } : { "Group_Type": 'Configuration Group' };
                            objToInsertConfGroup["Group_Name"] = objData.dataFromConfigGrps[i].ConfigName;
                            objToInsertConfGroup["Description"] = objData.dataFromConfigGrps[i].Description;
                            objToInsertConfGroup["ID"] = objData.dataFromConfigGrps[i].ConfigID;
                            objToInsertConfGroup["ClassName"] = objData.dataFromConfigGrps[i].ClassName;
                            objToInsertConfGroup["Members"] = angular.isUndefinedOrNull(objGroupCount[objToInsertConfGroup["ID"]]) ? '' : objGroupCount[objToInsertConfGroup["ID"]].Members;
                            arrayOfObj.push(objToInsertConfGroup);
                        }
                    }
                }
                if (!angular.isUndefinedOrNull(objData) && !angular.isUndefinedOrNull(objData.dataFromAppGrps)) {
                    for (var j in objData.dataFromAppGrps) {
                        if (objData.dataFromAppGrps.hasOwnProperty(j)) {
                            var objToInsert;
                            objToInsert = (type === 'HyperSprout') ? { "Group Type": 'Application Group' } : { "Group_Type": 'Application Group' };
                            objToInsert["Group_Name"] = objData.dataFromAppGrps[j].GroupName;
                            objToInsert["Description"] = objData.dataFromAppGrps[j].Description;
                            objToInsert["ID"] = objData.dataFromAppGrps[j].GroupID;
                            objToInsert["Members"] = angular.isUndefinedOrNull(objAppCount[objToInsert["ID"]]) ? '' : objAppCount[objToInsert["ID"]].Members;
                            arrayOfObj.push(objToInsert);
                        }
                    }
                }
                return arrayOfObj;
            }

            /**
             * Clones the value of a variable and returns the string value of it
             */
            this.convert = function (arg) {
                return (new String(arg)).valueOf();
            }

            /**
             * Verifies the file extension of the file
             */
            this.checkfileExtension = function (newVal, requiredType, callBack) {
                var extObj = {};
                var type = newVal.name.substring(newVal.name.lastIndexOf(".") + 1);
                if (type !== requiredType) {
                    extObj.errMessage = 'Select files only with .' + requiredType + ' extension';
                    extObj.fileUploadStatus = true;
                } else {
                    extObj.errMessage = '';
                    extObj.fileUploadStatus = false;
                }
                callBack(extObj);
            };

            /**
             * TBD
             */
            this.getAssignEndPointArray = function () {
                return [
                    {
                        "key": 'File Name',
                        "value": 'N/A'
                    }, {
                        "key": 'Firmware Group Name',
                        "value": 'N/A'
                    }, {
                        "key": 'Operation Type',
                        "value": 'N/A'
                    }, {
                        "key": 'Result',
                        "value": 'N/A'
                    },

                ];
            }

            /**
             * TBD
             */
            this.check = function (list, key, name) {
                var msg = '';

                function is_numeric(str) {
                    var d = str.split("")[0];
                    return /^\d+$/.test(d);
                }

                if (!angular.isUndefinedOrNull(name) || name === '') {
                    var specialChars = " <>@!#$%^&*()_+[]{}?:;|'\"\\,./~`-=";

                    var checkForSpecialChar = function (st) {
                        for (var i = 0; i < specialChars.length; i++) {
                            if (st.indexOf(specialChars[i]) !== 'undefined' &&
                                st.indexOf(specialChars[i]) > -1) {
                                return true;
                            }
                        }
                        return false;
                    };

                    var checkChar = checkForSpecialChar(name);
                    if (is_numeric(name) || checkChar) {
                        var arr = (name).split("");
                        if (parseInt(arr[0]) &&
                            angular.isNumber(parseInt(arr[0])) !== parseInt(arr[0]) &&
                            angular.isNumber(parseInt(arr[0])) ||
                            !checkChar) {
                            name = undefined;
                        }
                    } else {
                        unique = false;
                        var len = !angular.isUndefinedOrNull(list) ? list.length : 0;
                        for (var j = 0; j < len; j++) {
                            if ((list[j][key]).toLowerCase() === (name).toLowerCase()) {
                                unique = true;
                                msg = 'Name already exist!';
                                break;
                            } else {
                                unique = false;
                                msg = '';
                            }
                        }
                    }
                }
                return {
                    "name": name,
                    "check": unique,
                    "msg": msg,
                    "checkSpecialChar": checkChar
                };
            }
            /**
             * check group name validation
             */

            this.checkGroupName = function (list, key, name) {
                var msg = '';
                if (!angular.isUndefinedOrNull(name) || name === '') {
                    var specialChars = " <>@!#$%^&*()_+[]{}?:;|'\"\\,./~`-=";

                    var checkForSpecialChar = function (st) {
                        for (var i = 0; i < specialChars.length; i++) {
                            if (st.indexOf(specialChars[i]) !== 'undefined' &&
                                st.indexOf(specialChars[i]) > -1) {
                                return true;
                            }
                        }
                        return false;
                    };
                    var checkChar = checkForSpecialChar(name);
                    var unique = false;
                    var len = !angular.isUndefinedOrNull(list) ? list.length : 0;
                    for (var j = 0; j < len; j++) {
                        if ((list[j][key]).toLowerCase() === (name).toLowerCase()) {
                            unique = true;
                            msg = 'Name already exist!';
                            break;
                        } else {
                            unique = false;
                            msg = '';
                        }
                    }
                }
                return {
                    "name": name,
                    "check": unique,
                    "msg": msg,
                    "checkSpecialChar": checkChar
                };
            }

            /**
             * check description char length
             */
            this.charCheck = function(description) {
                var wordMsg = '';
                if(description !== undefined && description.trim().length > 100) {
                    wordMsg = 'description should not contain more than 100 character';
                }
                return { "wordMsg": wordMsg };
            }

            /**
             * Verifies the word length specification
             */
            this.wordCheck = function (description) {
                var wordMsg = '';
                var all_words = description.split(" ");
                for (var i = 0; i < all_words.length; i++) {
                    if (all_words[i].length > 20) {
                        wordMsg = 'Description should contain word with not more than 20 characters';
                        break;
                    }
                }
                return { "wordMsg": wordMsg };
            }

            /**
             * TBD
             */
            this.pdfPrintData = function (pdfObj, type, callback) {
                pdfObj.ConfigGroups_Info.Quantity1 = pdfObj.ConfigGroups_Info.Quantity1.value;
                pdfObj.ConfigGroups_Info.Quantity2 = pdfObj.ConfigGroups_Info.Quantity2.value;
                pdfObj.ConfigGroups_Info.Quantity3 = pdfObj.ConfigGroups_Info.Quantity3.value;
                pdfObj.ConfigGroups_Info.Quantity4 = pdfObj.ConfigGroups_Info.Quantity4.value;
                pdfObj.ConfigGroups_Info.DemandIntervalLength = pdfObj.ConfigGroups_Info.DemandIntervalLength.value;
                pdfObj.ConfigGroups_Info.ColdLoadPickupTimes = pdfObj.ConfigGroups_Info.ColdLoadPickupTimes.value;
                pdfObj.ConfigGroups_Info.PowerOutageRecognitionTime = pdfObj.ConfigGroups_Info.PowerOutageRecognitionTime.value;
                pdfObj.ConfigGroups_Info.TestModeDemandIntervalLength = pdfObj.ConfigGroups_Info.TestModeDemandIntervalLength.value;
                pdfObj.ConfigGroups_Info.NumberofTestModeSubintervals = pdfObj.ConfigGroups_Info.NumberofTestModeSubintervals.value;
                pdfObj.ConfigGroups_Info.NumberofSubIntervals = pdfObj.ConfigGroups_Info.NumberofSubIntervals.value;
                pdfObj.ConfigGroups_Info.IntervalLength = pdfObj.ConfigGroups_Info.IntervalLength.value;
                pdfObj.ConfigGroups_Info.PhaseSelection = pdfObj.ConfigGroups_Info.PhaseSelection.value;
                pdfObj.ConfigGroups_Info.Demand = pdfObj.ConfigGroups_Info.Demand.value;
                pdfObj.ConfigGroups_Info.OutageLength = pdfObj.ConfigGroups_Info.OutageLength.value;
                if (type === 'HyperSprout') {
                    pdfObj.ConfigGroups_Info.Energy = pdfObj.ConfigGroups_Info.Energy.value;
                    pdfObj.ConfigGroups_Info.IntervalLengthVoltage = pdfObj.ConfigGroups_Info.IntervalLengthVoltage.value;
                } else {
                    pdfObj.ConfigGroups_Info.Energy1 = pdfObj.ConfigGroups_Info.Energy1.value;
                    pdfObj.ConfigGroups_Info.Energy2 = pdfObj.ConfigGroups_Info.Energy2.value;
                    pdfObj.ConfigGroups_Info.Energy3 = pdfObj.ConfigGroups_Info.Energy3.value;
                    pdfObj.ConfigGroups_Info.Energy4 = pdfObj.ConfigGroups_Info.Energy4.value;
                    pdfObj.ConfigGroups_Info.VoltageMointorIntervalLength = pdfObj.ConfigGroups_Info.VoltageMointorIntervalLength.value;
                    pdfObj.ConfigGroups_Info.LoadControlDisconnectThreshold = pdfObj.ConfigGroups_Info.LoadControlDisconnectThreshold.value;
                    pdfObj.ConfigGroups_Info.ReconnectMethod = pdfObj.ConfigGroups_Info.ReconnectMethod.value;

                }
                callback(pdfObj.ConfigGroups_Info);
            };

            /**
             * Returns an object by it's ID
             */
            this.getObjectById = function (arrayData, id) {
                var retObj = {};
                for (var i = 0; i < arrayData.length; i++) {
                    if (arrayData[i].id === id) {
                        retObj = arrayData[i];
                        break;
                    }
                }
                return retObj
            };

            /**
             * Returns an object by its value
             */
            this.getObjectByValue = function (arrayData, value) {
                var retObj = {};
                for (var i = 0; i < arrayData.length; i++) {
                    if (arrayData[i].value === value) {
                        retObj = arrayData[i];
                        break;
                    }
                }
                return retObj;
            };

            /**
             * Validates the PDF file
             */
            this.loadPrfileValidation = function (input) {
                var obj = {};
                obj.pulse1 = true;
                if (parseInt(input.PulseWeight1) >= 0 && parseInt(input.PulseWeight1) <= 65535) {
                    obj.pulse1 = false;
                }
                obj.pulse2 = true;
                if (parseInt(input.PulseWeight2) >= 0 && parseInt(input.PulseWeight2) <= 65535) {
                    obj.pulse2 = false;
                }
                obj.pulse3 = true;
                if (parseInt(input.PulseWeight3) >= 0 && parseInt(input.PulseWeight3) <= 65535) {
                    obj.pulse3 = false;
                }
                obj.pulse4 = true;
                if (parseInt(input.PulseWeight4) >= 0 && parseInt(input.PulseWeight4) <= 65535) {
                    obj.pulse4 = false;
                }
                return obj;
            };

            /**
             * Opens PDF information
             */
            this.openPDF = function (resData, pdfData) {
                var doc = new jsPDF();
                var parameter = resData;
                var cnt = 0;
                var pageHeight = doc.internal.pageSize.height;
                doc.page = 1;

                /**
                 * Generate footer information
                 */
                function footer() {
                    doc.text(150, 285, 'page ' + doc.page);
                    doc.page++;
                    return;
                };

                for (var j in parameter) {
                    if (parameter.hasOwnProperty(j)) {
                        doc.setFontSize(10);
                        if (cnt === 0) footer();
                        cnt += 10;
                        if (cnt >= pageHeight) {
                            doc.addPage();
                            footer();
                            cnt = 10;
                        }
                        doc.text(25, cnt, j + '   ' + ':' + '   ' + parameter[j]);
                    }
                }
                if (pdfData === 'pdf') {
                    doc.save(Date.now() + "config_Prog.pdf");
                } else {
                    doc.autoPrint();
                    window.open(doc.output('bloburl'), '_blank', "toolbar=no,status=no,menubar=no,scrollbars=no,resizable=no,modal=yes,top=100,left=250,width=800,height=600");
                }
            };

            /**
             * Converts an array of JSON objects to CSV data
             */
            function convertArrayOfObjectsToCSV(args, callback) {
                var result, ctr, keys, columnDelimiter, lineDelimiter, data;
                var arr = [];
                data = args || null;
                arr.push(data);
                if (arr === null || !arr.length) return null;
                columnDelimiter = arr.columnDelimiter || ',';
                lineDelimiter = arr.lineDelimiter || '\n';
                keys = Object.keys(arr[0]);
                result = '';
                result += keys.join(columnDelimiter);
                result += lineDelimiter;
                arr.forEach(
                    function (item) {
                        ctr = 0;
                        keys.forEach(function (key) {
                            if (ctr > 0) result += columnDelimiter;
                            result += item[key];
                            ctr++;
                        });
                        result += lineDelimiter;
                    });
                callback(result);
            };

            /**
             * Downloads the CSV file
             */
            this.downloadCSV = function (args) {
                var data, filename, link;
                convertArrayOfObjectsToCSV(args, function (calBackResult) {
                    var csv = calBackResult;
                    if (csv === null) return;
                    filename = args.filename || Date.now() + 'configuration.csv';
                    if (!csv.match(/^data:text\/csv/i)) {
                        csv = 'data:text/csv;charset=utf-8,' + csv;
                    }
                    data = encodeURI(csv);
                    link = document.createElement('a');
                    link.setAttribute('href', data);
                    link.setAttribute('download', filename);
                    link.click();
                });
            };

            /**
             * Returns the data in the tree structure
             */
            this.getTreeData = function () {
                var objChecked = $('#tree').treeview('getChecked');
                var treeArray = [{
                    "Tools": "false",
                    "values": {
                        "PerformInteractiveRead": "false",
                        "ViewJobStatus": "false"
                    }
                }, {
                    "HypersproutManagement": "false",
                    "values": {
                        "ModifyHypersproutFirmware": "false",
                        "HypersproutFirmwareManagement": "false",
                        "HypersproutJobStatus": "false",
                    }
                }, {
                    "MeterManagement": "false",
                    "values": {
                        "ModifyMeterFirmware": "false",
                        "MeterFirmwareManagement": "false",
                        "MeterJobStatus": "false",
                        "MeterBulkOperation": "false"
                    }
                }, {
                    "Administration": "false",
                    "values": {
                        "ModifySecurity": "false",
                        "ModifySystemSettings": "false",
                        "ModifyUsers": "false",
                    }
                }, {
                    "Reports": "false",
                    "values": {
                        "CommunicationStatistics": "false",
                        "SystemLog": "false",
                        "DeviceFirmwareVersions": "false",
                        "DeviceRegistrationStatus": "false",
                        "NewAccountsReport":"false",
                        "SystemAuditLog": "false",
                    }
                }, {
                    "SystemManagement": "false",
                    "values": {
                        "DeviceManagement": "false",
                        "JobStatus": "false",
                        "Registration": "false",
                        "Grouping": "false"
                    }
                },{
                    "DeltaLinkManagement": "false",
                    "values": {
                        "deltaLinkGroupManagement": "false",
                        "DeltaLinkFirmwareManagement": "false",
                        "DeltaLinkJobStatus": "false"
                }
            }];
                let Tools = ["My Settings"];
                let HypersproutManagement = ["HyperSPROUT\u2122 Group Management","HyperSPROUT\u2122 Firmware Management","HyperSPROUT\u2122 Job Status"];
                let MeterManagement = ["Meter Group Management","Meter Firmware Management","Meter Job Status"];
                let SystemManagement = ["Device Management","Job Status","Add Devices","Grouping"];
                let Reports = ["Communication Statistics","System Log","Device Firmware Versions","New Accounts","System Audit Log"];
                let Administration = ["Security","System Settings","Users"];
                let DeltaLinkManagement = ["DeltaLINK\u2122 Group Management","DeltaLINK\u2122 Firmware Management","DeltaLINK\u2122 Job Status"]
                for (var i = 0; i < objChecked.length; i++) {
                    var objCurrentSelected = objChecked[i];
                     if (angular.isUndefinedOrNull(objCurrentSelected.parentId) && objCurrentSelected.text === 'Tools') {
                        if (objCurrentSelected.state.checked) {
                            treeArray[0].Tools = "true";
                            for (var j = 0; j < objCurrentSelected.nodes.length; j++) {
                                    treeArray[0].values[objCurrentSelected.nodes[j].id] = "true";
                            }
                        }
                    }
                    else if (angular.isUndefinedOrNull(objCurrentSelected.parentId) && objCurrentSelected.text === 'HyperSPROUT\u2122 Management') {
                        if (objCurrentSelected.state.checked) {
                            treeArray[1].HypersproutManagement = "true";
                            for (var j = 0; j < objCurrentSelected.nodes.length; j++) {
                                    treeArray[1].values[objCurrentSelected.nodes[j].id] = "true";
                            }
                        }
                    }
                    else if (angular.isUndefinedOrNull(objCurrentSelected.parentId) && objCurrentSelected.text === 'Meter Management') {
                        if (objCurrentSelected.state.checked) {
                            treeArray[2].MeterManagement = "true";
                            for (var j = 0; j < objCurrentSelected.nodes.length; j++) {
                                    treeArray[2].values[objCurrentSelected.nodes[j].id] = "true";
                            }
                        }
                    }
                    else if (angular.isUndefinedOrNull(objCurrentSelected.parentId) && objCurrentSelected.text === 'Administration') {
                        if (objCurrentSelected.state.checked) {
                            treeArray[3].Administration = "true";
                            for (var j = 0; j < objCurrentSelected.nodes.length; j++) {
                                    treeArray[3].values[objCurrentSelected.nodes[j].id] = "true";
                            }
                        }
                    }
                    else if (angular.isUndefinedOrNull(objCurrentSelected.parentId) && objCurrentSelected.text === 'Reports') {
                        if (objCurrentSelected.state.checked) {
                            treeArray[4].Reports = "true";
                            for (var j = 0; j < objCurrentSelected.nodes.length; j++) {
                                    treeArray[4].values[objCurrentSelected.nodes[j].id] = "true";
                            }
                        }
                    }
                    else if (angular.isUndefinedOrNull(objCurrentSelected.parentId) && objCurrentSelected.text === 'System Management') {
                        if (objCurrentSelected.state.checked) {
                            treeArray[5].SystemManagement = "true";
                            for (var j = 0; j < objCurrentSelected.nodes.length; j++) {
                                    treeArray[5].values[objCurrentSelected.nodes[j].id] = "true";
                            }
                        }
                    }else if (angular.isUndefinedOrNull(objCurrentSelected.parentId) && objCurrentSelected.text === 'DeltaLINK\u2122 Management') {
                        if (objCurrentSelected.state.checked) {
                            treeArray[6].DeltaLinkManagement = "true";
                            for (var j = 0; j < objCurrentSelected.nodes.length; j++) {
                                    treeArray[6].values[objCurrentSelected.nodes[j].id] = "true";
                            }
                        }
                    }
                    else {
                        if(DeltaLinkManagement.includes(objCurrentSelected.text)) {
                            if(objCurrentSelected.text == 'DeltaLINK\u2122 Group Management') {
                                treeArray[6].values['deltaLinkGroupManagement'] = "true";
                            } else if(objCurrentSelected.text == 'DeltaLINK\u2122 Firmware Management') {
                                treeArray[6].values['DeltaLinkFirmwareManagement'] = "true";
                            } else if(objCurrentSelected.text == 'DeltaLINK\u2122 Job Status') {
                                treeArray[6].values['DeltaLinkJobStatus'] = "true";
                            } 
                        } else if(SystemManagement.includes(objCurrentSelected.text)) {
                            if(objCurrentSelected.text == 'Device Management') {
                                treeArray[5].values['DeviceManagement'] = "true";
                            } else if(objCurrentSelected.text == 'Job Status') {
                                treeArray[5].values['JobStatus'] = "true";
                            } else if(objCurrentSelected.text == 'Grouping') {
                                treeArray[5].values['Grouping'] = "true";
                            } else if(objCurrentSelected.text == 'Add Devices') {
                                treeArray[5].values['Registration'] = "true";
                            }
                        } else if(Reports.includes(objCurrentSelected.text)) {
                            if(objCurrentSelected.text == 'Communication Statistics') {
                                treeArray[4].values['CommunicationStatistics'] = "true";
                            } else if(objCurrentSelected.text == 'System Log') {
                                treeArray[4].values['SystemLog'] = "true";
                            } else if(objCurrentSelected.text == 'Device Firmware Versions') {
                                treeArray[4].values['DeviceFirmwareVersions'] = "true";
                            } else if(objCurrentSelected.text == 'New Accounts') {
                                treeArray[4].values['NewAccountsReport'] = "true";
                            } else if(objCurrentSelected.text == 'System Audit Log') {
                                treeArray[4].values['SystemAuditLog'] = "true";
                            }
                        } else if(Administration.includes(objCurrentSelected.text)) {
                            if(objCurrentSelected.text == 'Security') {
                                treeArray[3].values['ModifySecurity'] = "true";
                            } else if(objCurrentSelected.text == 'System Settings') {
                                treeArray[3].values['ModifySystemSettings'] = "true";
                            } else if(objCurrentSelected.text == 'Users') {
                                treeArray[3].values['ModifyUsers'] = "true";
                            }
                        } else if(MeterManagement.includes(objCurrentSelected.text)) {
                            if(objCurrentSelected.text == 'Meter Group Management') {
                                treeArray[2].values['ModifyMeterFirmware'] = "true";
                            } else if(objCurrentSelected.text == 'Meter Firmware Management') {
                                treeArray[2].values['MeterFirmwareManagement'] = "true";
                            } else if(objCurrentSelected.text == 'Meter Job Status') {
                                treeArray[2].values['MeterJobStatus'] = "true";
                            } else if(objCurrentSelected.text == 'Meter Bulk Operation') {
                                treeArray[2].values['MeterBulkOperation'] = "true";
                            }
                        } else if(HypersproutManagement.includes(objCurrentSelected.text)) {
                          if(objCurrentSelected.text == 'HyperSPROUT\u2122 Group Management') {
                                treeArray[1].values['ModifyHypersproutFirmware'] = "true";
                            } else if(objCurrentSelected.text == 'HyperSPROUT\u2122 Firmware Management') {
                                treeArray[1].values['HypersproutFirmwareManagement'] = "true";
                            } else if(objCurrentSelected.text == 'HyperSPROUT\u2122 Job Status') {
                                treeArray[1].values['HypersproutJobStatus'] = "true";
                            }
                        }
                    }
                }
                return treeArray;
            };

            /**
             * Initialize the tree structure
             */
            this.initTree = function (objFunctions) {
                var tree = [
                //     {
                //     text: "Tools",
                //     icon: "glyphicon glyphicon-stop",
                //     selectable: true,
                //     state: {
                //         checked: (!angular.isUndefinedOrNull(objFunctions)) &&
                //             objFunctions[0].Tools === 'true',
                //         expanded: false,
                //         selected: true
                //     }, nodes: [{
                //         text: "My Settings",
                //         id: "ViewJobStatus",
                //         icon: "glyphicon glyphicon-stop",
                //         state: {
                //             checked: (!angular.isUndefinedOrNull(objFunctions) &&
                //                 objFunctions[0].values.ViewJobStatus === 'true') ? true : false,
                //             expanded: true
                //         }
                //     }]
                // },
                    {
                    text: "HyperSPROUT\u2122 Management",
                    icon: "glyphicon glyphicon-stop",
                    selectable: true,
                    state: {
                        checked: (!angular.isUndefinedOrNull(objFunctions)) &&
                            objFunctions[1].HypersproutManagement === 'true',
                        expanded: false
                    }, nodes: [{
                        text: "HyperSPROUT\u2122 Group Management",
                        id: "ModifyHypersproutFirmware",
                        icon: "glyphicon glyphicon-stop",
                        state: {
                            checked: (!angular.isUndefinedOrNull(objFunctions) &&
                                objFunctions[1].values.ModifyHypersproutFirmware === 'true'),
                            expanded: true
                        }
                    }, {
                        text: "HyperSPROUT\u2122 Firmware Management",
                        id: "HypersproutFirmwareManagement",
                        icon: "glyphicon glyphicon-stop",
                        state: {
                            checked: (!angular.isUndefinedOrNull(objFunctions) &&
                                objFunctions[1].values.HypersproutFirmwareManagement === 'true'),
                            expanded: true
                        }
                    }, {
                        text: "HyperSPROUT\u2122 Job Status",
                        id: "HypersproutJobStatus",
                        icon: "glyphicon glyphicon-stop",
                        state: {
                            checked: (!angular.isUndefinedOrNull(objFunctions) &&
                                objFunctions[1].values.HypersproutJobStatus === 'true'),
                            expanded: true
                        }
                    }]
                }, {
                    text: "Meter Management",
                    icon: "glyphicon glyphicon-stop",
                    selectable: true,
                    state: {
                        checked: (!angular.isUndefinedOrNull(objFunctions)) &&
                            objFunctions[2].MeterManagement === 'true',
                        expanded: false
                    }, nodes: [{
                        text: "Meter Group Management",
                        id: "ModifyMeterFirmware",
                        icon: "glyphicon glyphicon-stop",
                        state: {
                            checked: (!angular.isUndefinedOrNull(objFunctions) &&
                                objFunctions[2].values.ModifyMeterFirmware === 'true'),
                            expanded: true
                        }
                    }, {
                        text: "Meter Firmware Management",
                        id: "MeterFirmwareManagement",
                        icon: "glyphicon glyphicon-stop",
                        state: {
                            checked: (!angular.isUndefinedOrNull(objFunctions) &&
                                objFunctions[2].values.MeterFirmwareManagement === 'true'),
                            expanded: true
                        }
                    }, {
                        text: "Meter Job Status",
                        id: "MeterJobStatus",
                        icon: "glyphicon glyphicon-stop",
                        state: {
                            checked: (!angular.isUndefinedOrNull(objFunctions) &&
                                objFunctions[2].values.MeterJobStatus === 'true'),
                            expanded: true
                        }
                    },
                    {
                        text: "Meter Bulk Operation",
                        id: "MeterBulkOperation",
                        icon: "glyphicon glyphicon-stop",
                        state: {
                            checked: (!angular.isUndefinedOrNull(objFunctions) &&
                                objFunctions[2].values.MeterBulkOperation === 'true'),
                            expanded: true
                        }
                    }]
                }, {
                    text: "Administration",
                    icon: "glyphicon glyphicon-stop",
                    selectable: true,
                    state: {
                        checked: (!angular.isUndefinedOrNull(objFunctions)) &&
                            objFunctions[3].Administration === 'true',
                        expanded: false
                    }, nodes: [{
                        text: "Security",
                        id: "ModifySecurity",
                        icon: "glyphicon glyphicon-stop",
                        state: {
                            checked: (!angular.isUndefinedOrNull(objFunctions) &&
                                objFunctions[3].values.ModifySecurity === 'true'),
                            expanded: true
                        }
                    }, {
                        text: "System Settings",
                        id: "ModifySystemSettings",
                        icon: "glyphicon glyphicon-stop",
                        state: {
                            checked: (!angular.isUndefinedOrNull(objFunctions) &&
                                objFunctions[3].values.ModifySystemSettings === 'true'),
                            expanded: true
                        }
                    }, {
                        text: "Users",
                        id: "ModifyUsers",
                        icon: "glyphicon glyphicon-stop",
                        state: {
                            checked: (!angular.isUndefinedOrNull(objFunctions)
                                && objFunctions[3].values.ModifyUsers === 'true'),
                            expanded: true
                        }
                    }]
                }, {
                    text: "Reports",
                    icon: "glyphicon glyphicon-stop",
                    selectable: true,
                    state: {
                        checked: (!angular.isUndefinedOrNull(objFunctions)) &&
                            objFunctions[4].Reports === 'true',
                        expanded: false
                    }, nodes: [{
                        text: "Communication Statistics",
                        id: "CommunicationStatistics",
                        icon: "glyphicon glyphicon-stop",
                        state: {
                            checked: (!angular.isUndefinedOrNull(objFunctions) &&
                                objFunctions[4].values.CommunicationStatistics === 'true'),
                            expanded: true
                        }
                    }, {
                        text: "System Log",
                        id: "SystemLog",
                        icon: "glyphicon glyphicon-stop",
                        state: {
                            checked: (!angular.isUndefinedOrNull(objFunctions) &&
                                objFunctions[4].values.SystemLog === 'true'),
                            expanded: true
                        }
                    }, {
                        text: "Device Firmware Versions",
                        id: "DeviceFirmwareVersions",
                        icon: "glyphicon glyphicon-stop",
                        state: {
                            checked: (!angular.isUndefinedOrNull(objFunctions) &&
                                objFunctions[4].values.DeviceFirmwareVersions === 'true'),
                            expanded: true
                        }
                    }, {
                        text: "New Accounts",
                        id: "NewAccountsReport",
                        icon: "glyphicon glyphicon-stop",
                        state: {
                            checked: (!angular.isUndefinedOrNull(objFunctions) &&
                                objFunctions[4].values.NewAccountsReport === 'true'),
                            expanded: true
                        }
                    }, {
                        text: "System Audit Log",
                        id: "SystemAuditLog",
                        icon: "glyphicon glyphicon-stop",
                        state: {
                            checked: (!angular.isUndefinedOrNull(objFunctions) &&
                                objFunctions[4].values.SystemAuditLog === 'true'),
                            expanded: true
                        }
                    }]
                }, {
                    text: "System Management",
                    icon: "glyphicon glyphicon-stop",
                    selectable: true,
                    state: {
                        checked: (!angular.isUndefinedOrNull(objFunctions)) &&
                            objFunctions[5].SystemManagement === 'true',
                        expanded: false
                    }, nodes: [{
                        text: "Device Management",
                        id: "DeviceManagement",
                        icon: "glyphicon glyphicon-stop",
                        state: {
                            checked: (!angular.isUndefinedOrNull(objFunctions) &&
                                objFunctions[5].values.DeviceManagement === 'true'),
                            expanded: true
                        }
                    }, {
                        text: "Job Status",
                        id: "JobStatus",
                        icon: "glyphicon glyphicon-stop",
                        state: {
                            checked: (!angular.isUndefinedOrNull(objFunctions) &&
                                objFunctions[5].values.JobStatus === 'true'),
                            expanded: true
                        }
                    }, {
                        text: "Add Devices",
                        id: "Registration",
                        icon: "glyphicon glyphicon-stop",
                        state: {
                            checked: (!angular.isUndefinedOrNull(objFunctions) &&
                                objFunctions[5].values.Registration === 'true'),
                            expanded: true
                        }
                    }, {
                        text: "Grouping",
                        id: "Grouping",
                        icon: "glyphicon glyphicon-stop",
                        state: {
                            checked: (!angular.isUndefinedOrNull(objFunctions) &&
                                objFunctions[5].values.Grouping === 'true'),
                            expanded: true
                        }
                    }]
                },	{
                    text: "DeltaLINK\u2122 Management",
                    icon: "glyphicon glyphicon-stop",
                    selectable: true,
                    state: {
                        checked: (!angular.isUndefinedOrNull(objFunctions)) &&
                            objFunctions[6].DeltaLinkManagement === 'true',
                        expanded: false
                    }, nodes: [{
                        text: "DeltaLINK\u2122 Group Management",
                        id: "deltaLinkGroupManagement",
                        icon: "glyphicon glyphicon-stop",
                        state: {
                            checked: (!angular.isUndefinedOrNull(objFunctions) &&
                                objFunctions[6].values.deltaLinkGroupManagement === 'true'),
                            expanded: true
                        }
                    }, {
                        text: "DeltaLINK\u2122 Firmware Management",
                        id: "DeltaLinkFirmwareManagement",
                        icon: "glyphicon glyphicon-stop",
                        state: {
                            checked: (!angular.isUndefinedOrNull(objFunctions) &&
                                objFunctions[6].values.DeltaLinkFirmwareManagement === 'true'),
                            expanded: true
                        }
                    }, {
                        text: "DeltaLINK\u2122 Job Status",
                        id: "DeltaLinkJobStatus",
                        icon: "glyphicon glyphicon-stop",
                        state: {
                            checked: (!angular.isUndefinedOrNull(objFunctions) &&
                                objFunctions[6].values.DeltaLinkJobStatus === 'true'),
                            expanded: true
                        }
                    }]
                }];
                return tree;
            };

            this.jobNameMatrix = {
                'Firmware Job': 'Firmware Job',
                'Interval Read Job': 'Interval Read Job',
                "OnDemand": "OnDemand",
                "Remote Disconnect Jobs": "Remote Disconnect Job",
                "Remote Connect Jobs": "Remote Connect Job",
                "Registration Job": "Registration Job",
                "Node Ping": "Node Ping",
                "Reboot Job": "Reboot Job",
                "FrontHaul Job": "FrontHaul Job",
                "BackHaul Job": "BackHaul Job",
                "Cloud Connectivity Job": "Cloud Connectivity Job",
                "System Settings Job": "System Settings Job",
                "LOCK Job": "Lock Job",
                "UNLOCK Job": "Unlock Job",
                "Fetch Logs": "Fetch Log",
                "Clear Logs": "Clear Log",
                "Factory Reset Job" : "Factory Reset Job",
                "Verbosity Logs": "Verbosity Log",
                "Historical Job": "Historical Job",
                "Running Jobs": "Running Job"
            }

            this.getModifiedTable = function () {
                return "<div role=\"contentinfo\" class=\"ui-grid-pager-panel\" ui-grid-pager " +
                    "ng-show=\"grid.options.enablePaginationControls\"><div role=\"navigation\" class=\"ui-grid-pager-container\">" +
                    "<div role=\"menubar\" class=\"ui-grid-pager-control\"><button type=\"button\" role=\"menuitem\" class=\"ui-grid-pager-first\"" +
                    " ui-grid-one-bind-title=\"aria.pageToFirst\" ui-grid-one-bind-aria-label=\"aria.pageToFirst\" " +
                    "ng-click=\"pageFirstPageClick(); grid.appScope.firstPageBtnClick();\" ng-disabled=\"grid.appScope.disableFirstBtn\">" +
                    "<div ng-class=\"grid.isRTL() ? 'last-triangle' : 'first-triangle'\"><div ng-class=\"grid.isRTL() ? 'last-bar-rtl' : 'first-bar'\">" +
                    "</div></div></button> <button type=\"button\" role=\"menuitem\" class=\"ui-grid-pager-previous\" ui-grid-one-bind-title=\"aria.pageBack\"" +
                    " ui-grid-one-bind-aria-label=\"aria.pageBack\" ng-click=\"pagePreviousPageClick(); grid.appScope.prvPageBtnClick();\"" +
                    " ng-disabled=\"grid.appScope.disablePrvBtn\"><div ng-class=\"grid.isRTL() ? 'last-triangle prev-triangle' : 'first-triangle prev-triangle'\"></div></button>" +
                    "<input type=\"number\" ng-disabled=\"false\" ui-grid-one-bind-title=\"aria.pageSelected\" ui-grid-one-bind-aria-label=\"aria.pageSelected\" " +
                    "class=\"ui-grid-pager-control-input\" ng-change = \"grid.appScope.paginationBoxChanges()\"  ng-model=\"grid.appScope.pagination.currentTablePage\" min=\"1\" max=\"{{ grid.appScope.pagination.totalTablePages }}\">" +
                    " <span class=\"ui-grid-pager-max-pages-number\" ng-show=\"paginationApi.getTotalPages() > 0\"><abbr ui-grid-one-bind-title=\"paginationOf\">/</abbr>" +
                    " {{ grid.appScope.pagination.totalTablePages }}</span> <button type=\"button\" role=\"menuitem\" class=\"ui-grid-pager-next\" " +
                    "ui-grid-one-bind-title=\"aria.pageForward\" ui-grid-one-bind-aria-label=\"aria.pageForward\" " +
                    "ng-click=\"grid.appScope.nxtPageBtnClick(); pageNextPageClick();\" ng-disabled=\"grid.appScope.disableNxtBtn\">" +
                    "<div ng-class=\"grid.isRTL() ? 'first-triangle next-triangle' : 'last-triangle next-triangle'\"></div></button>" +
                    " <button type=\"button\" role=\"menuitem\" class=\"ui-grid-pager-last\" ui-grid-one-bind-title=\"aria.pageToLast\" " +
                    "ui-grid-one-bind-aria-label=\"aria.pageToLast\" ng-click=\"pageLastPageClick(); grid.appScope.lastPageBtnClick();\" " +
                    "ng-disabled=\"grid.appScope.disableLastBtn\"><div ng-class=\"grid.isRTL() ? 'first-triangle' : 'last-triangle'\"><div ng-class=\"grid.isRTL() ? 'first-bar-rtl' : 'last-bar'\">" +
                    "</div></div></button></div><div class=\"ui-grid-pager-row-count-picker\" ng-if=\"grid.options.paginationPageSizes.length > 1\">" +
                    "<select ui-grid-one-bind-aria-labelledby-grid=\"'items-per-page-label'\" ng-model=\"grid.options.paginationPageSize\" " +
                    "ng-options=\"o as o for o in grid.options.paginationPageSizes\"></select><span ui-grid-one-bind-id-grid=\"'items-per-page-label'\" " +
                    "class=\"ui-grid-pager-row-count-label\">&nbsp;{{sizesLabel}}</span></div><span ng-if=\"grid.options.paginationPageSizes.length <= 1\" " +
                    "class=\"ui-grid-pager-row-count-label\">{{grid.options.paginationPageSize}}&nbsp;{{sizesLabel}}</span></div><div class=\"ui-grid-pager-count-container\">" +
                    "<div class=\"ui-grid-pager-count\"><span ng-show=\"grid.options.totalItems > 0\">{{showingLow}} <abbr ui-grid-one-bind-title=\"paginationThrough\">-</abbr>" +
                    " {{showingHigh}} {{paginationOf}} {{grid.options.totalItems}} {{totalItemsLabel}}</span></div></div></div>";
            }
            this.setDefaultTable = function () {
                return "<div role=\"contentinfo\" class=\"ui-grid-pager-panel\" ui-grid-pager ng-show=\"grid.options.enablePaginationControls\"><div role=\"navigation\" class=\"ui-grid-pager-container\"><div role=\"menubar\" class=\"ui-grid-pager-control\"><button type=\"button\" role=\"menuitem\" class=\"ui-grid-pager-first\" ui-grid-one-bind-title=\"aria.pageToFirst\" ui-grid-one-bind-aria-label=\"aria.pageToFirst\" ng-click=\"pageFirstPageClick();\" ng-disabled=\"cantPageBackward()\"><div ng-class=\"grid.isRTL() ? 'last-triangle' : 'first-triangle'\"><div ng-class=\"grid.isRTL() ? 'last-bar-rtl' : 'first-bar'\"></div></div></button> <button type=\"button\" role=\"menuitem\" class=\"ui-grid-pager-previous\" ui-grid-one-bind-title=\"aria.pageBack\" ui-grid-one-bind-aria-label=\"aria.pageBack\" ng-click=\"pagePreviousPageClick();\" ng-disabled=\"cantPageBackward()\"><div ng-class=\"grid.isRTL() ? 'last-triangle prev-triangle' : 'first-triangle prev-triangle'\"></div></button> <input type=\"number\" ui-grid-one-bind-title=\"aria.pageSelected\" ui-grid-one-bind-aria-label=\"aria.pageSelected\" class=\"ui-grid-pager-control-input\" ng-model=\"grid.options.paginationCurrentPage\" min=\"1\" max=\"{{ paginationApi.getTotalPages() }}\" required> <span class=\"ui-grid-pager-max-pages-number\" ng-show=\"paginationApi.getTotalPages() > 0\"><abbr ui-grid-one-bind-title=\"paginationOf\">/</abbr> {{ paginationApi.getTotalPages() }}</span> <button type=\"button\" role=\"menuitem\" class=\"ui-grid-pager-next\" ui-grid-one-bind-title=\"aria.pageForward\" ui-grid-one-bind-aria-label=\"aria.pageForward\" ng-click=\"pageNextPageClick();\" ng-disabled=\"cantPageForward()\"><div ng-class=\"grid.isRTL() ? 'first-triangle next-triangle' : 'last-triangle next-triangle'\"></div></button> <button type=\"button\" role=\"menuitem\" class=\"ui-grid-pager-last\" ui-grid-one-bind-title=\"aria.pageToLast\" ui-grid-one-bind-aria-label=\"aria.pageToLast\" ng-click=\"pageLastPageClick();\" ng-disabled=\"cantPageToLast()\"><div ng-class=\"grid.isRTL() ? 'first-triangle' : 'last-triangle'\"><div ng-class=\"grid.isRTL() ? 'first-bar-rtl' : 'last-bar'\"></div></div></button></div><div class=\"ui-grid-pager-row-count-picker\" ng-if=\"grid.options.paginationPageSizes.length > 1\"><select ui-grid-one-bind-aria-labelledby-grid=\"'items-per-page-label'\" ng-model=\"grid.options.paginationPageSize\" ng-options=\"o as o for o in grid.options.paginationPageSizes\"></select><span ui-grid-one-bind-id-grid=\"'items-per-page-label'\" class=\"ui-grid-pager-row-count-label\">&nbsp;{{sizesLabel}}</span></div><span ng-if=\"grid.options.paginationPageSizes.length <= 1\" class=\"ui-grid-pager-row-count-label\">{{grid.options.paginationPageSize}}&nbsp;{{sizesLabel}}</span></div><div class=\"ui-grid-pager-count-container\"><div class=\"ui-grid-pager-count\"><span ng-show=\"grid.options.totalItems > 0\">{{showingLow}} <abbr ui-grid-one-bind-title=\"paginationThrough\">-</abbr> {{showingHigh}} {{paginationOf}} {{grid.options.totalItems}} {{totalItemsLabel}}</span></div></div></div>"
            }

            this.getBtnStatus = function (currentTablePage, totalTablePages) {
                if (currentTablePage === 1) {
                    if (currentTablePage === 1 && currentTablePage === totalTablePages) {
                       return {
                           disableNxtBtn : true,
                           disablePrvBtn : true,
                           disableFirstBtn : true,
                           disableLastBtn : true,
                       }
                    } else if (currentTablePage === 1 && currentTablePage < totalTablePages) {
                        return {
                        disableNxtBtn :  false,
                        disablePrvBtn :  true,
                        disableFirstBtn : true,
                        disableLastBtn  : false
                        }
                    } else if (currentTablePage === 1 && currentTablePage > totalTablePages) {
                    }
                } else if (currentTablePage > 1) {
                    if (currentTablePage > 1 && currentTablePage === totalTablePages) {
                        return {
                            disableNxtBtn : true,
                            disablePrvBtn : false,
                            disableFirstBtn : false,
                            disableLastBtn : true,
                        }
                    } else if (currentTablePage > 1 && currentTablePage < totalTablePages) {
                        return {
                            disableNxtBtn : false,
                            disablePrvBtn : false,
                            disableFirstBtn : false,
                            disableLastBtn : false,
                        }
                    } else if (currentTablePage > 1 && currentTablePage > totalTablePages) {
                        return {
                            disableNxtBtn : true,
                            disablePrvBtn : false,
                            disableFirstBtn : false,
                            disableLastBtn : true,
                        }
                    }
                }
            }

            this.trademarkObject = {
                'hyperhub': 'HyperHUB\u2122',
                'hypersprout': 'HyperSPROUT\u2122',
                'deltalink': 'DeltaLINK\u2122',
                'datavine': 'DataVINE\u2122',
                'collection engine': 'CollectionEngine\u2122'
            }

            this.addTrademark = function (data) {
                Object.entries(this.trademarkObject).forEach(([key, value]) => {
                    var initial = new RegExp(key, 'ig');
                    data = data.replace(initial, value);
                })
                if(data.toLowerCase().includes('delta link'))
                        data = data.replace(/delta link/ig, 'DeltaLINK\u2122');
                return data;
            }

        }]);
})(window.angular);
