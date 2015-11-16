'use strict';

angular.module('angularZilyoApp')
  .directive('listingInfoWindow', function () {
    return {
      templateUrl : 'app/listing-info-window/listing-info-window.html',
      restrict : 'E',
      scope : {
        listing : "="
      },
      link: function (scope, element, attrs) {
        scope.amenities = _.map(scope.listing.amenities, function (amenity) { return amenity.text; }).join(", ");
      }
    };
  });