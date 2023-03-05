/**
 * Controller for common date
 * @description
 */
(function (angular) {
    "use strict";
    angular.module('dataVINEApp')
        .controller('dateCommonCtrl', ['$scope', function ($scope) {
            $scope.inlineOptions = {
                customClass: getDayClass,
                minDate: new Date(),
                showWeeks: true
            };

            $scope.open1 = function () {
                $scope.popup1.opened = true;
            };
            $scope.open2 = function () {
                $scope.popup2.opened = true;
            };

            /**
             *   @description
             * Function to set date in the date picker
             *
             * @param year
             * @param month
             * @param day
             * @return Nil
                     
             */
            $scope.setDate = function (year, month, day) {
                $scope.startingDate = new Date(year, month, day);
                $scope.endingDate = new Date(year, month, day);
            };

            $scope.popup1 = {
                opened: false
            };
            $scope.popup2 = {
                opened: false
            };

            var tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            var afterTomorrow = new Date();
            afterTomorrow.setDate(tomorrow.getDate() + 1);
            $scope.events = [{
                date: tomorrow,
                status: 'full'
            }, {
                date: afterTomorrow,
                status: 'partially'
            }];

            /**
             * Function to get day from date
             */
            function getDayClass(data) {
                var date = data.date,
                    mode = data.mode;
                if (mode === 'day') {
                    var dayToCheck = new Date(date).setHours(0, 0, 0, 0);
                    for (var i = 0; i < $scope.events.length; i++) {
                        var currentDay = new Date($scope.events[i].date)
                            .setHours(0, 0, 0, 0);
                        if (dayToCheck === currentDay) {
                            return $scope.events[i].status;
                        }
                    }
                }
                return '';
            }

            $scope.status = {
                isopen: false
            };
            $scope.hstep = 1;
            $scope.mstep = 1;
            $scope.ismeridian = true;

            /**
             *  @description
             * Function to toggle meridian option
             *
             * @param nil
             * @return Nil
             
             */
            $scope.toggleMode = function () {
                $scope.ismeridian = !$scope.ismeridian;
            };

            /**
             * @description
             * Function to compare date
             *
             * @param nil
             * @return Nil
             
             */
            $scope.compareDates = function () {
                if ($scope.startingDate > $scope.endingDate) {
                    $scope.invalidDate = true;
                    return 0;
                }
                $scope.invalidDate = false;
                $scope.invalidTime = false;
            };

            /**
             *  @description
             * Function to compare time
             *
             * @param nil
             * @return Nil
             
           
             */
            $scope.compareTimes = function () {
                if ($scope.startingDate >= $scope.endingDate) {
                    $scope.invalidTime = true;
                    return 0;
                }
                $scope.invalidTime = false;
                $scope.invalidDate = false;
            };

            /**
             *  @description
             * Function to set FROM date in date picker
             *
             * @param fromDate
             * @return Nil
             
             */
            $scope.setFromDate = function (fromDate) {
                $scope.startingDate = fromDate;
                $scope.properDateTime = false;
                $scope.compareDates();
                $scope.compareTimes();
            };

            $scope.invalidDate = false;
            /**
             *  @description
             * Function to set TO date in date picker
             *
             * @param toDate
             * @return Nil
             
             */
            $scope.setToDate = function (toDate) {
                $scope.endingDate = toDate;
                $scope.properDateTime = false;
                $scope.compareDates();
                $scope.compareTimes();
            };

            /**
             *  @description
             * Function to set FROM time
             *
             * @param fromTime
             * @return Nil
            
             */
            $scope.setStartTime = function (fromTime) {
                $scope.startingDate = fromTime;
                if (angular.isUndefinedOrNull(fromTime)) {
                    $scope.properDateTime = true;
                    $scope.invalidTime = false;
                    $scope.invalidDate = false;
                    return 0;
                }
                $scope.properDateTime = false;
                $scope.compareTimes();
            };

            $scope.invalidTime = false;

            /**
             * @description
             * Function to set TO time
             *
             * @param toTime
             * @return Nil
             
             */
            $scope.setToTime = function (toTime) {
                $scope.endingDate = toTime;
                if (angular.isUndefinedOrNull(toTime)) {
                    $scope.properDateTime = true;
                    $scope.invalidTime = false;
                    $scope.invalidDate = false;
                    return 0;
                }
                $scope.properDateTime = false;
                $scope.compareTimes();
            };
        }]);
})(window.angular);