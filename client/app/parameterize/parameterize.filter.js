'use strict';

angular.module('angularZilyoApp').filter('parameterize', function () {
  return function (input) {
    return _.reduce(input, function (arr, value, key) {
      if (value) {
        return arr.concat(key + "=" + value);
      }
      return arr;
    }, []).join("&");
  };
});
