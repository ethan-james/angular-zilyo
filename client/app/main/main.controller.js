'use strict';

function MainCtrl($scope, $compile, googleMap, zilyo, Marker, RESULT_FILTERS) {
  this.markers = [];
  this.map = googleMap;
  this.zilyo = zilyo;

  this.params = { 
    guests : 1,
    numofbedrooms : 0,
    provider : [],
    pricemin : 0,
    pricemax : 1000,
    stimestamp : new Date(),
    etimestamp : new Date(new Date().getTime() + 86400000)
  };

  $scope.$watch(_.bind(function () { return this.params; }, this), _.bind(_.debounce(function (params) {
    if (this.markerClusterer) {
      this.updateMarkers(this.delta());
    }
  }, 500), this), true);

  this.providers = ["airbnb", "alwaysonvacation", "apartmentsapart", "bedycasa", "bookingpal", "citiesreference", "edomizil", "geronimo", "gloveler", "holidayvelvet", "homeaway", "homestay", "hostelworld", "housetrip", "interhome", "nflats", "roomorama", "stopsleepgo", "theotherhome", "travelmob", "vacationrentalpeople", "vaycayhero", "waytostay", "webchalet", "zaranga"];
  this.filters = RESULT_FILTERS;

  var params = {
    element : document.getElementById("map"),
    callbacks : {
      onBoundsChanged : _.debounce(this.refresh.bind(this), 1000)
    },
    controls : {
      "TOP_LEFT" : [
        document.getElementById('github-wrapper'),
        document.getElementById('pac-input')
      ],
      "TOP_RIGHT" : [document.getElementById('filters')]
    }
  };

  googleMap.makeSearchBox(document.getElementById('pac-input'));

  navigator.geolocation.getCurrentPosition(function (position) {
    googleMap.loadMap(angular.extend(params, { lat : position.coords.latitude, lng : position.coords.longitude }));
  }, function () {
    googleMap.loadMap(angular.extend(params, { lat : 37.3175, lng : -122.0419 }));
  });

  this.callbacks = {
    onCountResults: function (data) {
      this.preloaded = true;
      this.loading = data.result.totalResults;
    },
    onFetch: function (data) {
      this.addMarkers(_.map(data.result, function (result, index) {
        var infoWindow;
        var scope = angular.extend($scope.$new(), { listing : result });
        var $content = $compile('<listing-info-window listing="listing"></listing-info-window>')(scope);
        var marker = Marker.create(result);

        marker.addListener("click", _.bind(function () {
          if (!!infoWindow && !!infoWindow.getMap()) {
            infoWindow.close();
          } else {
            if (!infoWindow) {
              infoWindow = new google.maps.InfoWindow({ content : $content[0] });
            }

            infoWindow.open(this.map.map, marker);
          }
        }, this));

        return marker;
      }, this));

      if (!this.markerClusterer) {
        this.markerClusterer = new MarkerClusterer(this.map.map, [], {});        
      }

      this.updateMarkers(this.delta(false));
      this.loading = this.loading - data.result.length;
    }
  };
};

MainCtrl.prototype.filterMarkers = function filterMarkers(results) {
  return _.filter(this.markers, function (result) {
    return _.reduce(this.params, function (accumulator, value, key) {
      if (this.filters[key]) {
        return accumulator && this.filters[key](result, this.params[key]);
      } else if (key == "stimestamp" || key == "etimestamp") {
        return accumulator && this.filters.availability(result, this.params);
      }
      return accumulator;
    }, true, this);
  }, this);
};

MainCtrl.prototype.difference = function difference(markers, exclude) {
  return _.filter(markers, function (marker) {
    return _.every(exclude, function (e) { return e.id !== marker.id; });
  });
};

MainCtrl.prototype.addMarkers = function addMarkers(markers) {
  this.markers = this.markers.concat(this.difference(markers, this.markers));
};

MainCtrl.prototype.updateMarkers = function updateMarkers(delta) {
  this.markerClusterer.addMarkers(delta.add);
  this.markerClusterer.removeMarkers(delta.remove);
  this.showing = this.markerClusterer.getTotalMarkers();
};

MainCtrl.prototype.delta = function delta(remove) {
  var markers = this.markerClusterer.getMarkers();
  var filtered = this.filterMarkers();

  return {
    add : this.difference(filtered, markers),
    remove : (remove === false) ? [] : this.difference(markers, filtered)
  };
};

MainCtrl.prototype.refresh = function refresh() {
  var bounds = this.map.getBounds();

  this.zilyo.refresh({
    nelatitude : bounds.N.j,
    nelongitude : bounds.j.N,
    swlatitude : bounds.N.N,
    swlongitude : bounds.j.j
  }, this.callbacks, this);
};

MainCtrl.$inject = ["$scope", "$compile", "googleMap", "zilyo", "Marker", "RESULT_FILTERS"];
angular.module('angularZilyoApp').controller('MainCtrl', MainCtrl);
