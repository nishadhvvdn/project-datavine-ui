/**
 * Gives a set of functions common across controllers
 * @description
 * Controller to Add User
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
             * code to get data for grids field
             * type - device type
             * objData- data 
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
             * 
             *  @description
             * Function to close pop-u
             *
             * @param arg
             * @return Nil
             * Clones the value of a variable and returns the string value of it
             */
            this.convert = function (arg) {
                return (new String(arg)).valueOf();
            }

            /**
             * code check the file extension of uploaded file
             *
             * @param newVal - file name with extension
             * @param requiredtype- file type required
             * @return Nil
 

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
             * 
             * @description
             * Function to close pop-u
             *
             * @param Nil
             * @return Nil
             * TBD
             */
            this.getAssignEndPointArray = function () {
                return [
                    {
                        "key": 'File Name',
                        "value": 'N/A'
                    }, {
                        "key": 'Application Group Name',
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
              * @description
              * check description char length
              *
              * @param description
              * @return Nil
             
             */
            this.charCheck = function(description) {
                var wordMsg = '';
                if(description !== undefined && description.trim().length > 100) {
                    wordMsg = 'description should not contain more than 100 character';
                }
                return { "wordMsg": wordMsg };
            }

            /**
             * * @description
              * Verifies the word length specification
              *
              * @param description
              * @return Nil
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
              * @description
              * Verifies the word length specification
              *
              * @param pdfObj
              * @param type
              * @param callback
              * @return Nil
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
              * @description
              * Returns an object by it's ID
              *
              * @param rrayData
              * @param id
              * @return retObj
             
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
             * @description
              * Returns an object by it's ID
              *
              * @param arrayData
              * @param value
              * @return retObj
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
              * @description
              * Validates the PDF file
              *
              * @param input
              * @return Obj
            
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
             * @description
              * Opens PDF information
              *
              * @param resData
              * @param pdfData
              * @return nil
            
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
              * @description
              * Downloads the CSV file
              *
              * @param args
              * @return Obj
             
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
              * @description
              * Returns the data in the tree structure
              *
              * @param nil
              * @return treeArray
            
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
                },                
                {
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
                for (var i = 0; i < objChecked.length; i++) {
                    var objCurrentSelected = objChecked[i];
                    if (angular.isUndefinedOrNull(objCurrentSelected.parentId) &&
                        objCurrentSelected.text === 'Tools') {
                        if (objCurrentSelected.state.checked) {
                            treeArray[0].Tools = "true";
                        }
                        for (var j = 0; j < objCurrentSelected.nodes.length; j++) {
                            if (!angular.isUndefinedOrNull(objCurrentSelected.nodes[j]) &&
                                !angular.isUndefinedOrNull(objCurrentSelected.nodes[j].id)) {
                                treeArray[0].values[objCurrentSelected.nodes[j].id] = "true";
                            }
                        }
                    } else {
                        if (objChecked[i].parentId === 0) {
                            treeArray[0].values[objChecked[i].id] = "true";
                        }
                    }
                    if (angular.isUndefinedOrNull(objCurrentSelected.parentId) &&
                        objCurrentSelected.text === 'Meter Management') {
                        if (objCurrentSelected.state.checked) {
                            treeArray[2].MeterManagement = "true";
                        }
                        for (var k = 0; k < objCurrentSelected.nodes.length; k++) {
                            if (!angular.isUndefinedOrNull(objCurrentSelected.nodes[k]) &&
                                !angular.isUndefinedOrNull(objCurrentSelected.nodes[k].id)) {
                                treeArray[2].values[objCurrentSelected.nodes[k].id] = "true";
                            }
                        }
                    } else {
                        if (objChecked[i].parentId === 8) {
                            treeArray[2].values[objChecked[i].id] = "true";
                        }
                    }
                    if (angular.isUndefinedOrNull(objCurrentSelected.parentId) &&
                        objCurrentSelected.text === 'Hypersprout Management') {
                        if (objCurrentSelected.state.checked) {
                            treeArray[1].HypersproutManagement = "true";
                        }
                        for (var m = 0; m < objCurrentSelected.nodes.length; m++) {
                            if (!angular.isUndefinedOrNull(objCurrentSelected.nodes[m]) &&
                                !angular.isUndefinedOrNull(objCurrentSelected.nodes[m].id)) {
                                treeArray[1].values[objCurrentSelected.nodes[m].id] = "true";
                            }
                        }
                    } else {
                        if (objChecked[i].parentId === 2) {
                            treeArray[1].values[objChecked[i].id] = "true";
                        }
                    }
                    if (angular.isUndefinedOrNull(objCurrentSelected.parentId) &&
                        objCurrentSelected.text === 'Administration') {
                        if (objCurrentSelected.state.checked) {
                            treeArray[3].Administration = "true";
                        }
                        for (var n = 0; n < objCurrentSelected.nodes.length; n++) {
                            if (!angular.isUndefinedOrNull(objCurrentSelected.nodes[n]) &&
                                !angular.isUndefinedOrNull(objCurrentSelected.nodes[n].id)) {
                                treeArray[3].values[objCurrentSelected.nodes[n].id] = "true";
                            }
                        }
                    } else {
                        if (objChecked[i].parentId === 14) {
                            treeArray[3].values[objChecked[i].id] = "true";
                        }
                    }
                    if (angular.isUndefinedOrNull(objCurrentSelected.parentId) &&
                        objCurrentSelected.text === 'System Management') {
                        if (objCurrentSelected.state.checked) {
                            treeArray[5].SystemManagement = "true";
                        }
                        for (var p = 0; p < objCurrentSelected.nodes.length; p++) {
                            if (!angular.isUndefinedOrNull(objCurrentSelected.nodes[p]) &&
                                !angular.isUndefinedOrNull(objCurrentSelected.nodes[p].id)) {
                                treeArray[5].values[objCurrentSelected.nodes[p].id] = "true";
                            }
                        }
                    } else {
                        if (objChecked[i].parentId === 26) {
                            treeArray[5].values[objChecked[i].id] = "true";
                        }
                    }
                    if (angular.isUndefinedOrNull(objCurrentSelected.parentId) &&
                        objCurrentSelected.text === 'Reports') {
                        if (objCurrentSelected.state.checked) {
                            treeArray[4].Reports = "true";
                        }
                        for (var q = 0; q < objCurrentSelected.nodes.length; q++) {
                            if (!angular.isUndefinedOrNull(objCurrentSelected.nodes[q]) &&
                                !angular.isUndefinedOrNull(objCurrentSelected.nodes[q].id)) {
                                treeArray[4].values[objCurrentSelected.nodes[q].id] = "true";
                            }
                        }
                    } else {
                        if (objChecked[i].parentId === 16) {
                            treeArray[4].values[objChecked[i].id] = "true";
                        }
                    }
                    if (angular.isUndefinedOrNull(objCurrentSelected.parentId) &&
                    objCurrentSelected.text === 'Delta Link Management') {
                    if (objCurrentSelected.state.checked) {
                        treeArray[6].DeltaLinkManagement = "true";
                    }
                    for (var q = 0; q < objCurrentSelected.nodes.length; q++) {
                        if (!angular.isUndefinedOrNull(objCurrentSelected.nodes[q]) &&
                            !angular.isUndefinedOrNull(objCurrentSelected.nodes[q].id)) {
                            treeArray[6].values[objCurrentSelected.nodes[q].id] = "true";
                        }
                    }
                } else {
                    if (objChecked[i].parentId === 29) {
                        treeArray[6].values[objChecked[i].id] = "true";
                    }
                }
                }
                
                return treeArray;
            };

            /**
                 * @description
                 * Initialize the tree structure
                 *
                 * @param objFunctions
                 * @return Nil
             
             */
            this.initTree = function (objFunctions) {
                var tree = [{
                    text: "Tools",
                    icon: "glyphicon glyphicon-stop",
                    selectable: true,
                    state: {
                        checked: (!angular.isUndefinedOrNull(objFunctions)) &&
                            objFunctions[0].Tools === 'true' ? true : false,
                        expanded: false,
                        selected: true
                    }, nodes: [{
                        text: "My Settings",
                        id: "ViewJobStatus",
                        icon: "glyphicon glyphicon-stop",
                        state: {
                            checked: (!angular.isUndefinedOrNull(objFunctions) &&
                                objFunctions[0].values.ViewJobStatus === 'true') ? true : false,
                            expanded: true
                        }
                    }]
                }, {
                    text: "Hypersprout Management",
                    icon: "glyphicon glyphicon-stop",
                    selectable: true,
                    state: {
                        checked: (!angular.isUndefinedOrNull(objFunctions)) &&
                            objFunctions[1].HypersproutManagement === 'true' ? true : false,
                        expanded: false
                    }, nodes: [ {
                        text: "Group Management",
                        id: "ModifyHypersproutFirmware",
                        icon: "glyphicon glyphicon-stop",
                        state: {
                            checked: (!angular.isUndefinedOrNull(objFunctions) &&
                                objFunctions[1].values.ModifyHypersproutFirmware === 'true') ? true : false,
                            expanded: true
                        }
                    }, {
                        text: "Firmware Management",
                        id: "HypersproutFirmwareManagement",
                        icon: "glyphicon glyphicon-stop",
                        state: {
                            checked: (!angular.isUndefinedOrNull(objFunctions) &&
                                objFunctions[1].values.HypersproutFirmwareManagement === 'true') ? true : false,
                            expanded: true
                        }
                    }, {
                        text: "Hypersprout Job Status",
                        id: "HypersproutJobStatus",
                        icon: "glyphicon glyphicon-stop",
                        state: {
                            checked: (!angular.isUndefinedOrNull(objFunctions) &&
                                objFunctions[1].values.HypersproutJobStatus === 'true') ? true : false,
                            expanded: true
                        }
                    }]
                }, {
                    text: "Meter Management",
                    icon: "glyphicon glyphicon-stop",
                    selectable: true,
                    state: {
                        checked: (!angular.isUndefinedOrNull(objFunctions)) &&
                            objFunctions[2].MeterManagement === 'true' ? true : false,
                        expanded: false
                    }, nodes: [{
                        text: "Group Management",
                        id: "ModifyMeterFirmware",
                        icon: "glyphicon glyphicon-stop",
                        state: {
                            checked: (!angular.isUndefinedOrNull(objFunctions) &&
                                objFunctions[2].values.ModifyMeterFirmware === 'true') ? true : false,
                            expanded: true
                        }
                    }, {
                        text: "Firmware Management",
                        id: "MeterFirmwareManagement",
                        icon: "glyphicon glyphicon-stop",
                        state: {
                            checked: (!angular.isUndefinedOrNull(objFunctions) &&
                                objFunctions[2].values.MeterFirmwareManagement === 'true') ? true : false,
                            expanded: true
                        }
                    }, {
                        text: "Meter Job Status",
                        id: "MeterJobStatus",
                        icon: "glyphicon glyphicon-stop",
                        state: {
                            checked: (!angular.isUndefinedOrNull(objFunctions) &&
                                objFunctions[2].values.MeterJobStatus === 'true') ? true : false,
                            expanded: true
                        }
                    },{
                        text: "Meter Bulk Operation",
                        id: "MeterBulkOperation",
                        icon: "glyphicon glyphicon-stop",
                        state: {
                            checked: (!angular.isUndefinedOrNull(objFunctions) &&
                                objFunctions[2].values.MeterBulkOperation === 'true') ? true : false,
                            expanded: true
                        }
                    }]
                }, {
                    text: "Administration",
                    icon: "glyphicon glyphicon-stop",
                    selectable: true,
                    state: {
                        checked: (!angular.isUndefinedOrNull(objFunctions)) &&
                            objFunctions[3].Administration === 'true' ? true : false,
                        expanded: false
                    }, nodes: [{
                        text: "Security",
                        id: "ModifySecurity",
                        icon: "glyphicon glyphicon-stop",
                        state: {
                            checked: (!angular.isUndefinedOrNull(objFunctions) &&
                                objFunctions[3].values.ModifySecurity === 'true') ? true : false,
                            expanded: true
                        }
                    }, {
                        text: "System Settings",
                        id: "ModifySystemSettings",
                        icon: "glyphicon glyphicon-stop",
                        state: {
                            checked: (!angular.isUndefinedOrNull(objFunctions) &&
                                objFunctions[3].values.ModifySystemSettings === 'true') ? true : false,
                            expanded: true
                        }
                    }, {
                        text: "Users",
                        id: "ModifyUsers",
                        icon: "glyphicon glyphicon-stop",
                        state: {
                            checked: (!angular.isUndefinedOrNull(objFunctions)
                                && objFunctions[3].values.ModifyUsers === 'true') ? true : false,
                            expanded: true
                        }
                    }]
                }, {
                    text: "Reports",
                    icon: "glyphicon glyphicon-stop",
                    selectable: true,
                    state: {
                        checked: (!angular.isUndefinedOrNull(objFunctions)) &&
                            objFunctions[4].Reports === 'true' ? true : false,
                        expanded: false
                    }, nodes: [{
                        text: "Communication Statistics",
                        id: "CommunicationStatistics",
                        icon: "glyphicon glyphicon-stop",
                        state: {
                            checked: (!angular.isUndefinedOrNull(objFunctions) &&
                                objFunctions[4].values.CommunicationStatistics === 'true') ? true : false,
                            expanded: true
                        }
                    }, {
                        text: "System Log",
                        id: "SystemLog",
                        icon: "glyphicon glyphicon-stop",
                        state: {
                            checked: (!angular.isUndefinedOrNull(objFunctions) &&
                                objFunctions[4].values.SystemLog === 'true') ? true : false,
                            expanded: true
                        }
                    }, {
                        text: "Device Firmware Versions",
                        id: "DeviceFirmwareVersions",
                        icon: "glyphicon glyphicon-stop",
                        state: {
                            checked: (!angular.isUndefinedOrNull(objFunctions) &&
                                objFunctions[4].values.DeviceFirmwareVersions === 'true') ? true : false,
                            expanded: true
                        }
                    }, {
                        text: "New Accounts",
                        id: "NewAccountsReport",
                        icon: "glyphicon glyphicon-stop",
                        state: {
                            checked: (!angular.isUndefinedOrNull(objFunctions) &&
                                objFunctions[4].values.NewAccountsReport === 'true') ? true : false,
                            expanded: true
                        }
                    }, {
                        text: "System Audit Log",
                        id: "SystemAuditLog",
                        icon: "glyphicon glyphicon-stop",
                        state: {
                            checked: (!angular.isUndefinedOrNull(objFunctions) &&
                                objFunctions[4].values.SystemAuditLog === 'true') ? true : false,
                            expanded: true
                        }
                    }]
                }, {
                    text: "System Management",
                    icon: "glyphicon glyphicon-stop",
                    selectable: true,
                    state: {
                        checked: (!angular.isUndefinedOrNull(objFunctions)) &&
                            objFunctions[5].SystemManagement === 'true' ? true : false,
                        expanded: false
                    }, nodes: [{
                        text: "Device Management",
                        id: "DeviceManagement",
                        icon: "glyphicon glyphicon-stop",
                        state: {
                            checked: (!angular.isUndefinedOrNull(objFunctions) &&
                                objFunctions[5].values.DeviceManagement === 'true') ? true : false,
                            expanded: true
                        }
                    }, {
                        text: "Job Status",
                        id: "JobStatus",
                        icon: "glyphicon glyphicon-stop",
                        state: {
                            checked: (!angular.isUndefinedOrNull(objFunctions) &&
                                objFunctions[5].values.JobStatus === 'true') ? true : false,
                            expanded: true
                        }
                    }, {
                        text: "Add Devices",
                        id: "Registration",
                        icon: "glyphicon glyphicon-stop",
                        state: {
                            checked: (!angular.isUndefinedOrNull(objFunctions) &&
                                objFunctions[5].values.Registration === 'true') ? true : false,
                            expanded: true
                        }
                    }, {
                        text: "Grouping",
                        id: "Grouping",
                        icon: "glyphicon glyphicon-stop",
                        state: {
                            checked: (!angular.isUndefinedOrNull(objFunctions) &&
                                objFunctions[5].values.Grouping === 'true') ? true : false,
                            expanded: true
                        }
                    }]
                },
                {
                    text: "Delta Link Management",
                    icon: "glyphicon glyphicon-stop",
                    selectable: true,
                    state: {
                        checked: (!angular.isUndefinedOrNull(objFunctions)) &&
                            objFunctions[6].DeltaLinkManagement === 'true' ? true : false,
                        expanded: false
                    }, nodes: [{
                        text: "Delta Link Group Management",
                        id: "deltaLinkGroupManagement",
                        icon: "glyphicon glyphicon-stop",
                        state: {
                            checked: (!angular.isUndefinedOrNull(objFunctions) &&
                                objFunctions[6].values.deltaLinkGroupManagement === 'true') ? true : false,
                            expanded: true
                        }
                    }, {
                        text: "Delta Link Firmware Management",
                        id: "DeltaLinkFirmwareManagement",
                        icon: "glyphicon glyphicon-stop",
                        state: {
                            checked: (!angular.isUndefinedOrNull(objFunctions) &&
                                objFunctions[6].values.DeltaLinkFirmwareManagement === 'true') ? true : false,
                            expanded: true
                        }
                    }, {
                        text: "Delta Link Job Status",
                        id: "DeltaLinkJobStatus",
                        icon: "glyphicon glyphicon-stop",
                        state: {
                            checked: (!angular.isUndefinedOrNull(objFunctions) &&
                                objFunctions[6].values.DeltaLinkJobStatus === 'true') ? true : false,
                            expanded: true
                        }
                    }]
                }
            ];
                return tree;
            };
            /**
             * Sort list on basis of String length comparison
             */
            this.getSortByString = function(a, b) {
                if(a.length > b.length) {
                    return 1;
                } else if(a.length === b.length) {
                    return 0;
                } else {
                    return -1;
                }
            } 
            /**
             * Sort list on basis of value if row has Number 
             */
            this.getSortByNumber = function(a, b) {
                if(a > b) {
                    return 1;
                } else if(a === b) {
                    return 0;
                } else {
                    return -1;
                }
            } 

        }]);
})(window.angular);