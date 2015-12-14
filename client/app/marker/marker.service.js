'use strict';

angular.module('angularZilyoApp').factory('Marker', function () {
  return {
    create : function (json) {
      return new google.maps.Marker({
        "id" : json.id,
        "title" : json.attr.heading,
        "position" : new google.maps.LatLng(json.latLng[0], json.latLng[1]),
        "guests" : json.attr.occupancy,
        "numofbedrooms" : json.attr.bedrooms,
        "nightly" : json.price.nightly,
        "provider" : json.provider.cid,
        "availability" : json.availability
      });
    }
  };
});
