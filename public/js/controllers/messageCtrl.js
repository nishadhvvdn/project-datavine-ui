/**
 * @description
 * Controller for registration of transformer
 */
(function (angular) {
  "use strict";
  angular.module("dataVINEApp").controller("messageCtrl", [
    "$scope",
    "$uibModal",
    "$state",
    "$rootScope",
    "$timeout",
    "$filter",
    "DeviceService",
    "ParseService",
    "refreshservice",
    "commonService",
    "$sessionStorage",
    "$templateCache",
    function (
      $scope,
      $uibModal,
      $state,
      $rootScope,
      $timeout,
      $filter,
      deviceService,
      parseService,
      refreshservice,
      commonService,
      $sessionStorage,
      $templateCache
    ) {
      $scope.messageData = [];
      $scope.showMessageDetails = false;
      $scope.messageSelectedItem = {};
      $scope.page = 1;

      // Initial API call for Messages
      $scope.initMessageDetails = function (page) {
        deviceService.getAllMessage(page, 10).then(function (apiData) {
          if($scope.page === page){
            if(apiData.type){
              $scope.messageData = apiData.output.results;
            }
          }else {
            var oldData = $scope.messageData;
            $scope.messageData = [...oldData,...apiData.output.results];
            $scope.page = $scope.page + 1;
          }            
        });
      };
      $scope.initMessageDetails($scope.page);

      $scope.getFormatedDate = function (date) {
        return moment(date).format("h:mm a,DD MMM YYYY");
      };
      $scope.getMessageItemDetails = function (item) {
        deviceService
          .getAllMessageById(item.message_id)
          .then(function (apiData) {
            if (apiData && apiData.MessageDetailsById && apiData.MessageDetailsById.length > 0) {
              $scope.showMessageDetails = true;
              $scope.messageSelectedItem = apiData.MessageDetailsById[0];
              if(!apiData.MessageDetailsById[0].is_read){
                $scope.updateMessageItem("list",apiData.MessageDetailsById[0]);
              }
            } else {
              swal(apiData.Message);
            }
          });
      };
      $scope.updateMessageItem = function (type, item) {
        var id,is_read;
        if (type == "list") {
          id = item.message_id;
          is_read = !item.is_read;
        } else {
          id = $scope.messageSelectedItem.message_id;
          is_read = !$scope.messageSelectedItem.is_read;
        }

        deviceService.updateMessageById(id, is_read).then(function (apiData) {
          if(apiData.output == "Message status updated"){
            var updateData = $scope.messageData.filter(function (message) {
              if(message.message_id == id){
                message.is_read = !message.is_read;
                $scope.messageSelectedItem = message;
                return message;
              }
              return message;
            });
            $scope.messageData = updateData;            
          }          
        });
      };
      $scope.deleteMessageItem = function (type, item) {
        var id;
        if (type == "list") {
          id = item.message_id;
        } else {
          id = $scope.messageSelectedItem.message_id;
        }
        console.log(item,$scope.messageSelectedItem);
        deviceService.deleteMessageById(id).then(function (apiData) {
          if(apiData.output == "Message Deleted"){
            var deletedData = $scope.messageData.filter(function (message) {
              if(message.message_id != id){
                return message;
              }
            });
            $scope.messageData = deletedData;
            $scope.showMessageDetails = false;
          } else {
            swal(apiData.Message);
          }
        });
      };

      document.getElementById("m-card").addEventListener("scroll",function(e){        
        var scrollTop = e.currentTarget.scrollTop;
        var scrollHeight = e.currentTarget.scrollHeight;
        var clientHeight = e.currentTarget.clientHeight;
        if (scrollHeight - scrollTop === clientHeight) {
          $scope.initMessageDetails($scope.page + 1);
        }
      });     
    },
  ]);
})(window.angular);
