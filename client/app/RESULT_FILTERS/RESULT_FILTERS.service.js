'use strict';

angular.module('angularZilyoApp').constant('RESULT_FILTERS', {
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
});
