'use strict';

var Map = function Map() {
  this.map = null;
  this.center = null;
  this.mapElement = null;
};

Map.prototype.loadMap = function loadMap(params, callbacks) {
  this.params = params;

  this.map = new google.maps.Map(params.element, {
    center: { lat : params.lat, lng : params.lng },
    zoom: 17
  });

  google.maps.event.addListenerOnce(this.map, "idle", this.onMapLoaded.bind(this));
};

Map.prototype.onMapLoaded = function onMapLoaded() {

  _.each(this.params.controls, function (value, key) {
    _.each(value, function (control) {
      this.map.controls[google.maps.ControlPosition[key]].push(control);
    }, this);
  }, this);

  this.map.addListener("bounds_changed", this.params.callbacks.onBoundsChanged);
  
  this.map.addListener('bounds_changed', _.bind(function() { 
    this.searchBox.setBounds(this.map.getBounds());
  }, this));

  this.searchBox.addListener('places_changed', _.bind(function() {
    var places = this.searchBox.getPlaces();
    var bounds = new google.maps.LatLngBounds();

    if (places.length == 0) {
      return;
    }

    places.forEach(function(place) { bounds.extend(place.geometry.location); });
    this.map.fitBounds(bounds);
    this.map.setZoom(17);
  }, this));

  if (typeof this.params.callbacks.onBoundsChanged == "function") {
    this.params.callbacks.onBoundsChanged();
  }
};

Map.prototype.getBounds = function getBounds() {
  return this.map.getBounds();
};

Map.prototype.makeSearchBox = function makeSearchBox(input) {
  this.searchBox = new google.maps.places.SearchBox(input);
  return this.searchBox;
}

angular.module('angularZilyoApp').service('googleMap', Map);
