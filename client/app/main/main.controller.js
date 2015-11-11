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
    var countUrl = "/api/v1/listings/count";
    var bounds = map.getBounds();
    var params = angular.extend({
      nelatitude : bounds.O.j,
      nelongitude : bounds.j.O,
      swlatitude : bounds.O.O,
      swlongitude : bounds.j.j,
      resultsperpage : 5, // 10,
      page : 1
    });

    $http.get(countUrl + "?" + $scope.parameterize(params)).then(function(response) {
      var data = JSON.parse(response.data);

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

      var data = JSON.parse(response.data);
      var markers = _.map(data.result, function (result, index) {
        var infoWindow = new google.maps.InfoWindow({ content : result.attr.heading });
        var marker = new google.maps.Marker({ 
          "id" : result.id,
          "title" : result.attr.heading,
          "position" : new google.maps.LatLng(result.latLng[0], result.latLng[1])
        });

        marker.addListener("click", function () {
          if (!!infoWindow.getMap()) {
            infoWindow.close();
          } else {
            infoWindow.open($scope.map, marker);
          }
        });

        return marker;
      });

      $scope.markers = _.union($scope.markers, markers);
      $scope.markerClusterer = new MarkerClusterer($scope.map, $scope.markers, {});

    }, function(response) {
      console.log(response); // log error
    });
  };

  NgMap.getMap().then(function (map) {

    var input = document.getElementById('pac-input');
    var searchBox = new google.maps.places.SearchBox(input);
    var markers = [];

    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
    map.addListener("bounds_changed", _.debounce($scope.refresh.bind(this, map), 1000));
    map.addListener('bounds_changed', function() { searchBox.setBounds(map.getBounds()); });

    searchBox.addListener('places_changed', function() {
      var places = searchBox.getPlaces();
      var bounds = new google.maps.LatLngBounds();

      if (places.length == 0) {
        return;
      }

      places.forEach(function(place) { bounds.extend(place.geometry.location); });
      map.fitBounds(bounds);
    });

    $scope.refresh(map);
  });

  // navigator.geolocation.getCurrentPosition(function (position) {
  //   $scope.map.center.latitude = position.coords.latitude;
  //   $scope.map.center.longitude = position.coords.longitude;
  // }, function () {
  //   alert("Cannot get current position.");
  // });
});
