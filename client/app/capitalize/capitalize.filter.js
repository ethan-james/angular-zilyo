'use strict';

angular.module('angularZilyoApp').filter('capitalize', function () {
  return function (input) {
    return input[0].toLocaleUpperCase() + input.substr(1);
  };
});
