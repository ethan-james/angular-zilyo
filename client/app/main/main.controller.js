'use strict';
angular.module('angularZilyoApp').controller('MainCtrl', function ($http, $scope, NgMap) {

  $scope.map = null;
  $scope.center = { latitude: 40.72911, longitude: -73.9517664 };
  $scope.zoom = 15;
  $scope.markers = [];

  $scope.params = { 
    guests : 1,
    numofbedrooms : 0,
    provider : [],
    pricemin : 0,
    pricemax : 1000,
    stimestamp : new Date(),
    etimestamp : new Date(new Date().getTime() + 86400000)
  };

  $scope.$watch("params", _.debounce(function (params) {
    if ($scope.markerClusterer) {
      $scope.updateMarkers($scope.delta());
    }
  }, 500), true);

  $scope.providers = ["airbnb", "alwaysonvacation", "apartmentsapart", "bedycasa", "bookingpal", "citiesreference", "edomizil", "geronimo", "gloveler", "holidayvelvet", "homeaway", "homestay", "hostelworld", "housetrip", "interhome", "nflats", "roomorama", "stopsleepgo", "theotherhome", "travelmob", "vacationrentalpeople", "vaycayhero", "waytostay", "webchalet", "zaranga"];

  $scope.parameterize = function parameterize(params) {
    return _.reduce(params, function (arr, value, key) {
      if (value) {
        return arr.concat(key + "=" + value);
      }
      return arr;
    }, []).join("&");
  };

  $scope.filters = Object.create({
    guests : function (listing, param) {
      return listing.guests >= param;
    },
    numofbedrooms : function (listing, param) {
      return listing.numofbedrooms >= param;
    },
    pricemin : function (listing, param) {
      return listing.nightly >= param;
    },
    pricemax : function (listing, param) {
      return listing.nightly <= param;
    },
    provider : function (listing, param) {
      if (!param || !param.length) {
        return true;
      }
      return param.indexOf(listing.provider) !== -1;
    },
    availability : function (listing, param) {
      return _.some(listing.availability, function (availability) {
        return availability.start <= (param.stimestamp.getTime() / 1000) 
          && availability.end >= (param.etimestamp.getTime() / 1000);
      });
    }
  }, {});

  $scope.filterMarkers = function filter(results) {
    return _.filter($scope.markers, function (result) {
      return _.reduce($scope.params, function (accumulator, value, key) {
        if ($scope.filters[key]) {
          return accumulator && $scope.filters[key](result, $scope.params[key]);
        } else if (key == "stimestamp" || key == "etimestamp") {
          return accumulator && $scope.filters.availability(result, $scope.params);
        }
        return accumulator;
      }, true);
    });
  };

  $scope.difference = function difference(markers, exclude) {
    return _.filter(markers, function (marker) {
      return _.every(exclude, function (e) { return e.id !== marker.id; });
    });
  };

  $scope.addMarkers = function addMarkers(markers) {
    $scope.markers = $scope.markers.concat($scope.difference(markers, $scope.markers));
  };

  $scope.updateMarkers = function updateMarkers(delta) {
    $scope.markerClusterer.addMarkers(delta.add);
    $scope.markerClusterer.removeMarkers(delta.remove);
  };

  $scope.delta = function delta(remove) {
    var markers = $scope.markerClusterer.getMarkers();
    var filtered = $scope.filterMarkers();

    return {
      add : $scope.difference(filtered, markers),
      remove : (remove === false) ? [] : $scope.difference(markers, filtered)
    };
  };

  $scope.refresh = function refresh(map) {
    var countUrl = "/api/v1/listings/count";
    var bounds = map.getBounds();
    var params = {
      nelatitude : bounds.O.j,
      nelongitude : bounds.j.O,
      swlatitude : bounds.O.O,
      swlongitude : bounds.j.j
    };

    $http.get(countUrl + "?" + $scope.parameterize(params)).then(function(response) {
      var data = JSON.parse(response.data);

      $scope.loading = data.result.totalResults;

      _.times(data.result.totalPages, function (i) {
        return $scope.fetch(angular.extend(params, { resultsperpage : 20, page : i + 1 }));
      });

    }, function(response) {
      console.log(response); // log error
    });
  };

  $scope.fetch = function fetch(params) {
    var baseUrl = "/api/v1/listings";

    $http.get(baseUrl + "?" + $scope.parameterize(params)).then(function(response) {

      var data = JSON.parse(response.data);

      $scope.addMarkers(_.map(data.result, function (result, index) {
        var infoWindow = new google.maps.InfoWindow({ 
          content : result.attr.heading + " <b>$" + result.price.nightly + "</b> / night"
        });

        var marker = new google.maps.Marker({
          "id" : result.id,
          "title" : result.attr.heading,
          "position" : new google.maps.LatLng(result.latLng[0], result.latLng[1]),
          "guests" : result.attr.occupancy,
          "numofbedrooms" : result.attr.bedrooms,
          "nightly" : result.price.nightly,
          "provider" : result.provider.cid,
          "availability" : result.availability
        });

        marker.addListener("click", function () {
          if (!!infoWindow.getMap()) {
            infoWindow.close();
          } else {
            infoWindow.open($scope.map, marker);
          }
        });

        return marker;
      }));

      if (!$scope.markerClusterer) {
        $scope.markerClusterer = new MarkerClusterer($scope.map, [], {});        
      }

      $scope.updateMarkers($scope.delta(false));
      $scope.loading = $scope.loading - data.result.length;
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
