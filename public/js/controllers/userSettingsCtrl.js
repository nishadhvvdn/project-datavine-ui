/**
 * @description
 * Controller for updating user settings
 */
(function (angular) {
    "use strict";
    angular.module('dataVINEApp').controller('userSettingsCtrl',
        ['InitService', '$scope', '$state', 'toolsService',
            '$uibModal', 'refreshservice', '$rootScope',
            function (initService, $scope, $state, toolsService,
                $uibModal, refreshservice, $rootScope) {
                var usedID;
                usedID = (angular.isUndefinedOrNull(objCacheDetails) || angular.isUndefinedOrNull(objCacheDetails.userDetails)) ? undefined : objCacheDetails.userDetails.userID;
                if (angular.isUndefinedOrNull(usedID)) {
                    refreshservice.refresh()
                        .then(function () {
                            usedID = objCacheDetails.userDetails.userID;
                            $rootScope.userName = objCacheDetails.userDetails.username;
                            init();
                        });
                } else init();
                $scope.newPswd = '';
                let formattedPage = {
                    'Homepage': 'Home Page',
                    'Reports': 'Reports',
                    'HypersproutManagement': 'HyperSPROUT\u2122 Management',
                    'MeterManagement': 'Meter Management',
                    'SystemManagement': 'System Management',
                    'Tools': 'Tools',
                    'Administration': 'Administration',
                    'DeltaLinkManagement': 'DeltaLINK\u2122 Management'
                };
                let unformattedPage = {
                    'Home Page':'Homepage',
                    'Reports': 'Reports',
                    'HyperSPROUT\u2122 Management': 'HypersproutManagement',
                    'Meter Management': 'MeterManagement',
                    'System Management': 'SystemManagement',
                    'Tools': 'Tools',
                    'Administration': 'Administration',
                    'DeltaLINK\u2122 Management': 'DeltaLinkManagement'
                };

                /**
                 * Initialize user data
                 */
                function init() {
                    $scope.dynamicPopover.isOpen = false;
                    $scope.oldPswd = '';
                    toolsService.UserSettings(usedID)
                        .then(function (objData) {
                            if (!angular.isUndefinedOrNull(objData) && (objData.type === true)) {
                                $scope.allowedPages = [];
                                let allowedPagesCopy =  [...objCacheDetails.functionDetails];
                                for (let item of allowedPagesCopy) {
                                    let key = Object.keys(item)[0] === 'values'?Object.keys(item)[1]:Object.keys(item)[0];
                                    item[key] = Object.values(item['values']).includes('true');
                                }
                                for (let z=0; z < allowedPagesCopy.length; z++) {
                                    if(allowedPagesCopy[z][Object.keys(allowedPagesCopy[z])[0]] === 'true' || allowedPagesCopy[z][Object.keys(allowedPagesCopy[z])[0]] === true) {
                                        $scope.allowedPages.push(formattedPage[Object.getOwnPropertyNames(allowedPagesCopy[z])[0]]);
                                    }
                                }
                                $scope.allowedPages.unshift(formattedPage["Homepage"]);
                                $scope.firstName = objData.Details[0].FirstName;
                                $scope.lastName = objData.Details[0].LastName;
                                $scope.email = objData.Details[0].EmailAddress;
                                $scope.homePage = objData.Details[0].HomePage;
                                if( $scope.homePage == "MeterManagement"){
                                    $scope.homePage = "Meter Management"
                                }else  if( $scope.homePage == "SystemManagement"){
                                    $scope.homePage = "System Management"
                                }else  if( $scope.homePage == "HypersproutManagement"){
                                    $scope.homePage = "Hypersprout Management"
                                }else  if( $scope.homePage == "DeltaLinkManagement"){
                                    $scope.homePage = "Delta Link Management"
                                }else  if( $scope.homePage == "Homepage"){
                                    $scope.homePage = "Home Page"
                                } else if($scope.homePage == "Delta Link Management") {
                                    $scope.homePage = "DeltaLINK\u2122 Management"
                                } else if($scope.homePage == "Hypersprout Management") {
                                    $scope.homePage = "HyperSPROUT\u2122 Management"
                                }
                                $scope.timezone = objData.Details[0].TimeZone;
                                $scope.temprature = objData.Details[0].Temprature;
                            }
                        });
                }

                /**
                 *  @description
                 * Opens a modal for update password
                 *
                 * @param Nil
                 * @return Nil
                 
                 */
                $scope.changePassWord = function () {
                    $uibModal.open({
                        templateUrl: '/templates/changePassword.html',
                        controller: 'changePasswordCtrl',
                        size: 'md',
                        backdrop: 'static',
                        keyboard: true,
                        resolve: {
                            obj: function () {
                                return {
                                    "usedID": usedID,
                                    "loginId": objCacheDetails.userDetails.loginId
                                };
                            },
                            type: function () {
                                return 1;
                            }
                        }
                    });
                };

                /**
                 *  @description
                 * Invoke service to update user settings
                 *
                 * @param Nil
                 * @return Nil
                 
                 */
                $scope.submit = function () {
                    if( $scope.homePage == "MeterManagement"){
                        $scope.homePage = "Meter Management"
                    }else  if( $scope.homePage == "SystemManagement"){
                        $scope.homePage = "System Management"
                    }else  if( $scope.homePage == "HypersproutManagement"){
                        $scope.homePage = "Hypersprout Management"
                    }else  if( $scope.homePage == "DeltaLinkManagement"){
                        $scope.homePage = "Delta Link Management"
                    }else  if( $scope.homePage == "Homepage"){
                        $scope.homePage = "Home Page"
                    } else if($scope.homePage == "DeltaLINK\u2122 Management") {
                        $scope.homePage = "Delta Link Management"
                    } else if($scope.homePage == "HyperSPROUT\u2122 Management") {
                        $scope.homePage = "Hypersprout Management"
                    }
                    toolsService
                        .UpdateUserSettings(
                            usedID, $scope.firstName, $scope.lastName, $scope.email,
                         $scope.homePage, $scope.timezone, $scope.oldPswd,
                            objCacheDetails.userDetails.loginId, $scope.temprature)
                        .then(function (objData) {
                            if (!angular.isUndefinedOrNull(objData) && (objData.type)) {
                                swal({
                                    'title': objData.output
                                }, function (isConfirm) {
                                    initService
                                        .initializeApp()
                                        .then(
                                            function (responseData) {
                                                $state.reload();
                                            });
                                });
                            } else {
                                swal(objData.Message);
                            }
                        });
                };

            }]);
})(window.angular);
