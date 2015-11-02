'use strict';

angular.module('angularZilyoApp').controller('MainCtrl', function ($http, $scope, uiGmapGoogleMapApi) {
  $scope.map = { center: { latitude: 40.72911, longitude: -73.9517664 }, zoom: 16 };

  uiGmapGoogleMapApi.then(function(maps) {
    var url = "/api/v1/listings?latitude=" + $scope.map.center.latitude + "&longitude=" + $scope.map.center.longitude;

    $http.get(url).then(function(response) {
      var data = JSON.parse(response.data);

      $scope.map.markers = _.map(data.result, function (result, index) {
        return { "id" : result.id, "latitude" : result.latLng[0], "longitude" : result.latLng[1] };
      });

    }, function(response) {
      console.log(response);
    });
  });
});
