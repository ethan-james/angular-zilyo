'use strict';
angular.module('angularZilyoApp').controller('MainCtrl', function ($http, $scope, NgMap) {

  $scope.map = null;
  $scope.center = { latitude: 40.72911, longitude: -73.9517664 };
  $scope.zoom = 15;

  $scope.params = { 
    guests : 1,
    numofbedrooms : 0,
    provider : null,
    pricemin : 0,
    pricemax : 0,
    stimestamp : 0,
    etimestamp : 0
  };

  $scope.providers = ["airbnb", "alwaysonvacation", "apartmentsapart", "bedycasa", "bookingpal", "citiesreference", "edomizil", "geronimo", "gloveler", "holidayvelvet", "homeaway", "homestay", "hostelworld", "housetrip", "interhome", "nflats", "roomorama", "stopsleepgo", "theotherhome", "travelmob", "vacationrentalpeople", "vaycayhero", "waytostay", "webchalet", "zaranga"];

  $scope.parameterize = function parameterize(params) {
    return _.reduce(params, function (arr, value, key) {
      if (value) {
        return arr.concat(key + "=" + value);
      }
      return arr;
    }, []).join("&");
  };

  $scope.refresh = function refresh(map) {
    var countUrl = "/api/v1/listings/count";
    var bounds = map.getBounds();
    var params = angular.extend($scope.params, {
      nelatitude : bounds.O.j,
      nelongitude : bounds.j.O,
      swlatitude : bounds.O.O,
      swlongitude : bounds.j.j
    });

    $http.get(countUrl + "?" + $scope.parameterize(params)).then(function(response) {
      var data = JSON.parse(response.data);
      $scope.markers = [];

      if ($scope.markerClusterer) {
        $scope.markerClusterer.clearMarkers();
      } else {
        $scope.markerClusterer = new MarkerClusterer(map, [], {});        
      }

      for (var i = 1; i <= data.result.totalPages; i++) {
        $scope.fetch(angular.extend(params, { resultsperpage : 20, page : i }));
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
        var infoWindow = new google.maps.InfoWindow({ 
          content : result.attr.heading + " <b>$" + result.price.nightly + "</b> / night"
        });
        var marker = new google.maps.Marker({ 
          "id" : result.id,
          "title" : result.attr.heading,
          "position" : new google.maps.LatLng(result.latLng[0], result.latLng[1])
        });

        // marker.addListener("click", function () {
        //   if (!!infoWindow.getMap()) {
        //     infoWindow.close();
        //   } else {
        //     infoWindow.open($scope.map, marker);
        //   }
        // });

        return marker;
      });

      $scope.markerClusterer.addMarkers(markers);

    }, function(response) {
      console.log(response); // log error
    });
  };

  NgMap.getMap().then(function (map) {

    var input = document.getElementById('pac-input');
    var searchBox = new google.maps.places.SearchBox(input);

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
