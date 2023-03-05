/**
  * @this vm
  * @ngdoc controller
  * @name dataVINEApp.controller:addOrEditSecurityGroupCtrl
  *
  * @description
  * Controller for Adding / Editing Security Group
*/
(function (angular) {
    "use strict";
    angular.module('dataVINEApp')
        .controller('addOrEditSecurityGroupCtrl',
            ['$scope', '$modalInstance', '$state',
                'securityGroupDropDown', 'record',
                'administrationService', 'type', 'commonService',
                function ($scope, $modalInstance, $state,
                    securityGroupDropDown, record,
                    administrationService, type, commonService) {
                    initTree();
                    $scope.disable = true;
                    $scope.cancel = function () {
                        $modalInstance.dismiss();
                    };
                    var list = [];
                    list = objCacheDetails.data.securityGroupDetails;
                    $scope.msg = '';
                    $scope.unique = false;
                    $scope.wordCheckButtonDisable = false;
                    $scope.wordMsg = '';
                    $scope.functionsCheckBoolean = true;
                    /**
                      * @description
                      * Function to validate Security Group ID
                      *
                      * @param Nil
                      * @return Nil
                    */
                    $scope.check = function () {
                        var groupObj = commonService
                            .checkGroupName(list, 'SecurityGroupID', $scope.securityGroupID);
                        $scope.unique = groupObj.check;
                        $scope.name = groupObj.name;
                        $scope.msg = groupObj.msg;
                        $scope.specialChar = groupObj.checkSpecialChar;
                    };
                    /**
                      * @description
                      * Function to validate description
                      *
                      * @param Nil
                      * @return Nil
                    */
                    $scope.wordCheck = function () {
                        if ($scope.description) {
                            var checkword = commonService.wordCheck($scope.description);
                            $scope.wordMsg = checkword.wordMsg;
                            if (!$scope.wordMsg) {
                                $scope.wordCheckButtonDisable = false;
                            } else {
                                $scope.wordCheckButtonDisable = true;
                            }
                        } else {
                            $scope.wordMsg = "";
                        }
                    };
                    $scope.viewMode = false;
                    $scope.securityGroupIDs = (type === 'edit' || type === 'view') ? securityGroupDropDown.output : [];
                    $scope.description = (type === 'edit' || type === 'view') ? record.entity["Description"] : $scope.description;
                    $scope.securityGroupID = (type === 'add') ? $scope.securityGroupID : record.entity["SecurityGroupID"];
                    if (type === 'view') {
                        populateData($scope.securityGroupID);
                        $scope.viewMode = true;
                    }
                    /**
                      * @description
                      * Function to splice security Group id if it Administrator
                      *
                      * @param Nil
                      * @return Nil
                    */
                    $scope.treeDivInitialized = function () {
                        initTree();
                        if (type === 'edit') {
                            for (var s = 0; s < $scope.securityGroupIDs.length; s++) {
                                if ($scope.securityGroupIDs[s] === 'Administrator') {
                                    $scope.securityGroupIDs.splice(s, 1);
                                    break;
                                }
                            }
                            populateData($scope.securityGroupID);
                        }
                    };
                    /**
                      * @description
                      * Function to populate data inside the tree rendered
                      *
                      * @param securityId - id
                      * @return Nil
                    */
                    function populateData(securityId) {
                        administrationService.returnSecurityGroups(securityId).then(function (objData) {
                            if (!angular.isUndefinedOrNull(objData) &&
                                !angular.isUndefinedOrNull(objData.output) &&
                                objData.output.length > 0) {
                                objData = objData.output[0];
                                initTree(objData.Functions);
                            }
                        });
                    }
                    /**
                      * @description
                      * Function to change the security and populate data
                      *
                      * @param securityId - id
                      * @return Nil
                    */
                    $scope.changeSecurityFunction = function (securityId) {
                        for (var i = 0; i < list.length; i++) {
                            if (list[i].SecurityGroupID === securityId) {
                                $scope.description = list[i].Description;
                                break;
                            }
                        }
                        populateData(securityId);
                    };
                    /**
                      * @description
                      * Function to save / edit the Security Group data
                      *
                      * @param Nil
                      * @return Nil
                    */
                    $scope.SaveOrEditSecurityGroup = function () {
                        var treeArray = commonService.getTreeData();
                        if (type === 'edit') {
                            administrationService.EditSecurityGroups($scope.securityGroupID,
                                $scope.description, treeArray)
                                .then(function (objData) {
                                    if (objData.type) {
                                        swal(commonService.addTrademark(objData.output));
                                    } else {
                                        swal(commonService.addTrademark(objData.Message));
                                    }
                                    $state.reload();
                                    $modalInstance.dismiss();
                                });
                        } else {
                            administrationService.AddSecurityGroups($scope.securityGroupID, $scope.description, treeArray).then(function (objData) {
                                if (objData.type) {
                                    swal(commonService.addTrademark(objData.output));
                                } else {
                                    swal(commonService.addTrademark(objData.Message));
                                }
                                $state.reload();
                                $modalInstance.dismiss();
                            });
                        }
                    };

                    var checkableTree = null;
                    var tree = [];
                    /**
                      * @description
                      * Function to generate Tree View
                      *
                      * @param objFunctions - object of tree view
                      * @return Nil
                    */
                    function initTree(objFunctions) {
                        tree = commonService.initTree(objFunctions);
                        checkableTree = $('#tree').treeview({
                            data: tree,
                            showIcon: false,
                            showCheckbox: true
                        });
                        check();
                        function check() {
                            var obj = $('#tree').treeview('getChecked');
                            $scope.disable = true;
                            if (obj.length > 0)
                                $scope.disable = false;
                            setTimeout(function () {
                                $scope.$apply($scope.disable); //this triggers a $digest
                            }, 1000);
                        }
                        function adjustParent(node) {
                            var parent = checkableTree.treeview('getParent', node);
                            if (parent !== checkableTree) {
                                var checked = 0;
                                for (var i in parent.nodes) {
                                    if (parent.nodes.hasOwnProperty(i) &&
                                        parent.nodes[i].state.checked) {
                                        checked++;
                                    }
                                }
                                if ((parent.nodes.length === checked) !==
                                    parent.state.checked) {
                                    checkableTree.treeview(parent.state.checked ? 'uncheckNode' : 'checkNode',
                                        [parent.nodeId, { silent: true }]);
                                }
                                adjustParent(parent);
                            }
                        }
                        var inEvent = 0;
                        checkableTree.on('nodeChecked ', function (ev, node) {
                            $scope.functionsCheckBoolean = false;
                            inEvent++;
                            if (node.nodes !== undefined) {
                                for (var i in node.nodes) {
                                    if (node.nodes.hasOwnProperty(i))
                                        checkableTree.treeview('checkNode', node.nodes[i].nodeId);
                                }
                            }
                            inEvent--;
                            if (inEvent === 0) {
                                adjustParent(node);
                            }
                            check();
                        }).on('nodeUnchecked ', function (ev, node) {
                            $scope.functionsCheckBoolean = false;
                            inEvent++;
                            if (node.nodes !== undefined) {
                                for (var i in node.nodes) {
                                    if (node.nodes.hasOwnProperty(i))
                                        checkableTree.treeview('uncheckNode', node.nodes[i].nodeId);
                                }
                            }
                            inEvent--;
                            if (inEvent === 0) {
                                adjustParent(node);
                            }
                            check();
                        });
                    }
                }]);
})(window.angular);
