'use strict';
angular.module('angularZilyoApp').controller('MainCtrl', function ($http, $scope, NgMap) {

  $scope.map = null;
  $scope.center = { latitude: 40.72911, longitude: -73.9517664 };
  $scope.markers = [];
  $scope.zoom = 15;

  $scope.parameterize = function parameterize(params) {
    return _.map(params, function (val, key) { return key + "=" + val; }).join("&");
  };

  $scope.refresh = function refresh(map) {
    var countUrl = "/api/v1/listings/count",
        bounds = map.getBounds(),
        params = angular.extend({
          nelatitude : bounds.O.j,
          nelongitude : bounds.j.O,
          swlatitude : bounds.O.O,
          swlongitude : bounds.j.j,
          resultsperpage : 5, // 10,
          page : 1
        });

    $http.get(countUrl + "?" + $scope.parameterize(params)).then(function(response) {
      var data = JSON.parse(response.data);

      console.log(data.result.totalResults);

      for (var i = 1; i <= data.result.totalPages; i++) {
        $scope.fetch(angular.extend(params, { page : i }));
      }

    }, function(response) {
      console.log(response); // log error
    });
  };

  $scope.fetch = function fetch(params) {
    var baseUrl = "/api/v1/listings";

    $http.get(baseUrl + "?" + $scope.parameterize(params)).then(function(response) {

      var data = JSON.parse(response.data),
          markers = _.map(data.result, function (result, index) {
            console.log(result.attr);
            return new google.maps.Marker({ 
              "id" : result.id,
              "title" : result.attr.heading,
              "position" : new google.maps.LatLng(result.latLng[0], result.latLng[1])
            });
          });

      $scope.markers = _.union($scope.markers, markers);
      $scope.markerClusterer = new MarkerClusterer($scope.map, $scope.markers, {});

    }, function(response) {
      console.log(response); // log error
    });
  };

  NgMap.getMap().then(function (map) {
    map.addListener("bounds_changed", _.debounce($scope.refresh.bind(this, map), 1000))
    $scope.refresh(map);
  });

  // navigator.geolocation.getCurrentPosition(function (position) {
  //   $scope.map.center.latitude = position.coords.latitude;
  //   $scope.map.center.longitude = position.coords.longitude;
  // }, function () {
  //   alert("Cannot get current position.");
  // });
});
