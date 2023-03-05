/*
 * 
*/

(function (angular) {
    'use strict';
    angular.module('dataVINEApp')
        .controller('hypersproutDeviceFirmwareCtrl',
        ['$scope', '$rootScope', 'commonService', 'reportsService', '$controller','type', '$sessionStorage', '$templateCache',
            function ($scope, $rootScope, commonService, reportsService, $controller, type, $sessionStorage, $templateCache) {
                let currentDefaultTablePageSize = objCacheDetails.grid.paginationPageSize;
                let userTimeZone = angular.isUndefinedOrNull(objCacheDetails.userDetails) ? undefined : objCacheDetails.userDetails.timeZone;
                if (angular.isUndefined(userTimeZone)) {
                    userTimeZone = $sessionStorage.get('userTimeZone');
                }
                window.onbeforeunload = function () {
                    $sessionStorage.put('userTimeZone', userTimeZone);
                };
                $scope.deviceFirmware_ReportOptions = {};
                var arrData = [];
                $scope.mySelectedRows = [];
                $scope.invalidSelection = false;
                $scope.loading = true;
                $scope.searchTerm = "";
                 //for pagination
                 $scope.pagination = {
                    totalRecordsInDBCount: 0,
                    currentTotalItems: 0,
                    apiCurrentPage: 1,
                    apiNextPage: 0,
                    currentTablePage: 1,
                    currentTablePaginationSize: objCacheDetails.grid.paginationPageSize,
                    totalTablePages: 1
                }
                $scope.disableNxtBtn = true;
                $scope.disablePrvBtn = true;
                $scope.disableFirstBtn = true;
                $scope.disableLastBtn = true;
                $scope.initializeTable = function (pageNum) {
                    $scope.deviceFirmware_ReportOptions.data = [];
                    $scope.deviceFirmware_ReportOptions = angular.copy(objCacheDetails.grid);
                    $scope.deviceFirmware_ReportOptions.exporterPdfOrientation = 'landscape',
                    $scope.deviceFirmware_ReportOptions.exporterPdfMaxGridWidth = 640;
                    if(type == "HyperSprout"){
                        $scope.deviceFirmware_ReportOptions.columnDefs = [
                            {
                                field: 'SerialNumber', displayName: 'Serial Number',
                                enableHiding: false
                            },
                            { field: 'FirmwareVersionitm', displayName: 'Firmware Version (iTM)',enableHiding: false },
                            { field: 'FirmwareVersioninc',displayName: 'Firmware Version (iNC)', enableHiding: false },
                            { field: 'HardwareVersionitm', displayName: 'Hardware Version (iTM)', enableHiding: false },
                            {field: 'HardwareVersioninc',displayName: 'Hardware Version (iNC)',enableHiding: false }
                        ];
                    }else if(type == "Hyperhub"){
                        $scope.deviceFirmware_ReportOptions.columnDefs = [
                            {
                                field: 'SerialNumber', displayName: 'Serial Number',
                                enableHiding: false
                            },
                            { field: 'FirmwareVersioninc', displayName: 'Firmware Version (iNC)', enableHiding: false },
                            {field: 'HardwareVersioninc', displayName: 'Hardware Version (iNC)',enableHiding: false }
                            ];
                    }else if(type == "Meter"){
                        $scope.deviceFirmware_ReportOptions.columnDefs = [
                            {
                                field: 'SerialNumber', displayName: 'Serial Number',
                                enableHiding: false
                            },
                            { field: 'FirmwareVersionMeshCard',displayName: 'Firmware Version (MeshCard)', enableHiding: false },
                            { field: 'HardwareVersionMeshCard',displayName: 'Hardware Version (MeshCard)', enableHiding: false }
                            ];
                    }
                    $scope.deviceFirmware_ReportOptions.exporterSuppressColumns = ['Actions'];
                    $scope.deviceFirmware_ReportOptions.onRegisterApi = function (gridApi) {
                        $scope.gridApi = gridApi;
                        // commonService.getGridApi($scope, gridApi);
                        gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {
                            $scope.pagination.currentTablePaginationSize = pageSize;
                            $scope.pagination.totalTablePages = Math.ceil($scope.pagination.currentTotalItems / pageSize);
                            pageNum = 1;
                            $scope.pagination.currentTablePage = 1;
                            initData(pageNum, $scope.pagination.currentTablePaginationSize);
                        });
                    };

                    initData(pageNum, $scope.pagination.currentTablePaginationSize);

                    $templateCache.put('ui-grid/pagination', commonService.getModifiedTable());
                }
                $scope.initializeTable($scope.pagination.apiCurrentPage, currentDefaultTablePageSize);
                function initData(pageNum, limit) {
                    arrData.length = 0;
                    if(type == "Hyperhub"){
                         type="HyperHub"
                    }
                    reportsService
                        .deviceFirmwareVersions(pageNum, limit, $scope.searchTerm, type)
                        .then(function (apiData) {
                            if (!angular.isUndefinedOrNull(apiData) && apiData.type && apiData.Details.results) {
                                arrData.length = 0;
                                $scope.pagination.currentTotalItems = apiData.Details.results.length;
                                $scope.pagination.apiCurrentPage = pageNum;
                                $scope.pagination.totalRecordsInDBCount = apiData.Details.totalRecords;
                                $scope.pagination.totalTablePages = Math.ceil($scope.pagination.totalRecordsInDBCount / $scope.pagination.currentTablePaginationSize);

                                let btnFlags = commonService.getBtnStatus($scope.pagination.currentTablePage, $scope.pagination.totalTablePages);
                                $scope.disableNxtBtn = btnFlags.disableNxtBtn;
                                $scope.disablePrvBtn = btnFlags.disablePrvBtn;
                                $scope.disableFirstBtn = btnFlags.disableFirstBtn;
                                $scope.disableLastBtn = btnFlags.disableLastBtn;

                                apiData = apiData.Details.results;
                                $rootScope.commonMsg = "";
                                if(type == "HyperSprout"){
                                    for (let i = 0; i < apiData.length; i++) {
                                        let objToInsert = {};
                                        objToInsert['SerialNumber'] = apiData[i].HypersproutSerialNumber;
                                        objToInsert['FirmwareVersionitm'] = apiData[i].Hypersprout_FirmwareDetails ? apiData[i].Hypersprout_FirmwareDetails.iTMFirmwareVersion: 'NA';
                                        objToInsert['FirmwareVersioninc'] = apiData[i].Hypersprout_FirmwareDetails? apiData[i].Hypersprout_FirmwareDetails.iNCFirmwareVersion :'NA';
                                        objToInsert['HardwareVersionitm'] = apiData[i].Hypersprout_FirmwareDetails ? apiData[i].Hypersprout_FirmwareDetails.iTMHardwareVersion: 'NA';
                                        objToInsert['HardwareVersioninc'] = apiData[i].Hypersprout_FirmwareDetails?apiData[i].Hypersprout_FirmwareDetails.iNCHardwareVersion:'NA'; 
                                        arrData.push(objToInsert);
                                    }
                                }else if(type == "HyperHub"){
                                    for (let i = 0; i < apiData.length; i++) {
                                        let objToInsert = {};
                                        objToInsert['SerialNumber'] = apiData[i].HypersproutSerialNumber;
                                        objToInsert['FirmwareVersioninc'] = apiData[i].Hypersprout_FirmwareDetails? apiData[i].Hypersprout_FirmwareDetails.iNCFirmwareVersion :'NA';
                                        objToInsert['HardwareVersioninc'] = apiData[i].Hypersprout_FirmwareDetails?apiData[i].Hypersprout_FirmwareDetails.iNCHardwareVersion:'NA'; 
                                        arrData.push(objToInsert);
                                    }
                                }else if(type == "Meter"){
                                    for (let i = 0; i < apiData.length; i++) {
                                        let objToInsert = {};
                                        objToInsert['SerialNumber'] = apiData[i].MeterSerialNumber;
                                        objToInsert['FirmwareVersionMeshCard'] = apiData[i].Meters_FirmwareDetails? apiData[i].Meters_FirmwareDetails.MeshCardFirmwareVersion :'NA';
                                        objToInsert['HardwareVersionMeshCard'] = apiData[i].Meters_FirmwareDetails?apiData[i].Meters_FirmwareDetails.MeshCardHardwareVersion:'NA'; 
                                        arrData.push(objToInsert);
                                    }
                                }
                                $scope.deviceFirmware_ReportOptions.data = arrData;
                            } else if (apiData.type == false) {
                                $scope.disableNxtBtn = true;
                                $scope.disablePrvBtn = true;
                                $scope.disableFirstBtn = true;
                                $scope.disableLastBtn = true;
                                $scope.pagination.totalRecordsInDBCount = 0;
                                $scope.pagination.totalTablePages = 1;
                                $rootScope.commonMsg = "No data found!";
                            } else {
                                $rootScope.commonMsg = 'No data found!';
                            }
                        });
                }
                $scope.nxtPageBtnClick = function () {
                    if ($scope.pagination.currentTablePage < $scope.pagination.totalTablePages && $scope.pagination.totalTablePages > 0) {
                        let nextAPIPage = ++$scope.pagination.currentTablePage;
                        $scope.disablePrvBtn = false;
                        $scope.initializeTable(nextAPIPage, $scope.pagination.currentTablePaginationSize);
                    } else {
                        $scope.disableNxtBtn = true;
                        $scope.disablePrvBtn = false;
                        $scope.disableLastBtn = true;
                    }
                }

                $scope.prvPageBtnClick = function () {
                    if ($scope.pagination.currentTablePage > 1 && $scope.pagination.currentTablePage <= $scope.pagination.totalTablePages) {
                        let prevAPIPage = --$scope.pagination.currentTablePage;
                        $scope.disableNxtBtn = false;
                        $scope.initializeTable(prevAPIPage, $scope.pagination.currentTablePaginationSize);
                    } else {
                        {
                            $scope.disablePrvBtn = true;
                            $scope.disableNxtBtn = false;
                            $scope.disableFirstBtn = true;
                        }
                    }
                }
                $scope.firstPageBtnClick = function () {
                    if ($scope.pagination.currentTablePage > 1 && $scope.pagination.currentTablePage <= $scope.pagination.totalTablePages) {
                        $scope.pagination.currentTablePage = 1;
                        let firstPage = 1;
                        $scope.disableNxtBtn = false;
                        $scope.disableFirstBtn = true;
                        $scope.initializeTable(firstPage, $scope.pagination.currentTablePaginationSize);
                    } else {
                        {
                            $scope.disablePrvBtn = true;
                            $scope.disableNxtBtn = false;
                        }
                    }
                }

                $scope.lastPageBtnClick = function () {
                    if ($scope.pagination.currentTablePage >= 1 && $scope.pagination.currentTablePage <= $scope.pagination.totalTablePages) {
                        $scope.pagination.currentTablePage = $scope.pagination.totalTablePages;
                        let lastPage = $scope.pagination.totalTablePages;
                        $scope.disableNxtBtn = false;
                        $scope.disableLastBtnBtn = true;
                        $scope.initializeTable(lastPage, $scope.pagination.currentTablePaginationSize);
                    } else {
                        {
                            $scope.disablePrvBtn = true;
                            $scope.disableNxtBtn = false;
                        }
                    }
                }

                $scope.paginationBoxChanges = function () {
                    if ($scope.pagination.currentTablePage) {
                        $scope.initializeTable($scope.pagination.currentTablePage, $scope.pagination.currentTablePaginationSize);
                    } else {
                        $scope.pagination.currentTablePage = 1;
                        $scope.initializeTable($scope.pagination.currentTablePage, $scope.pagination.currentTablePaginationSize);
                    }
                }

                /**
                 *  @description
                 * Function to toggle dropdown
                 *
                 * @param event
                 * @return Nil

                 */
                $scope.toggleDropdown = function ($event) {
                    $event.preventDefault();
                    $event.stopPropagation();
                    $scope.status.isopen = !$scope.status.isopen;
                };
                $scope.toggle = function () {
                    $scope.isSelected = true;
                    $scope.ticked = !$scope.ticked;
                };
                // //searching the data
                $scope.searchButtonClear =  function (searchTerm) {
                    if(searchTerm == ""){
                        $scope.searchTerm = '';
                        $scope.initializeTable($scope.pagination.currentTablePage, $scope.pagination.currentTablePaginationSize);
                    }
                }
                $scope.filterReportsData= function (searchTerm) {
                    if(searchTerm) {
                        $scope.searchTerm = searchTerm;
                        $scope.pagination.currentTablePage = 1;
                        $scope.initializeTable($scope.pagination.currentTablePage, $scope.pagination.currentTablePaginationSize);
                    } else {
                        $scope.searchTerm = '';
                        $scope.initializeTable($scope.pagination.currentTablePage, $scope.pagination.currentTablePaginationSize);
                    }
                    angular.element(document.querySelector("div.ui-grid-selection-row-header-buttons")).removeClass("ui-grid-all-selected");
                    $scope.mySelectedRows.length = 0;
                };      
                $scope.$on('$destroy', function () {
                    $templateCache.put('ui-grid/pagination', commonService.setDefaultTable());
                });
        }]);
})(window.angular);