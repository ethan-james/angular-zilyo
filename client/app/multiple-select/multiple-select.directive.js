'use strict';

angular.module('angularZilyoApp')
  .directive('multipleSelect', function () {
    return {
      templateUrl : 'app/multiple-select/multiple-select.html',
      scope : {
        options : "="
      },
      restrict : 'E',
      link : function (scope, element, attrs) {
      }
    };
  });