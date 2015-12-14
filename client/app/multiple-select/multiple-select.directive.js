'use strict';

angular.module('angularZilyoApp').directive('multipleSelect', function () {
  return {
    templateUrl : 'app/multiple-select/multiple-select.html',
    restrict : 'E',
    require: "ngModel",
    scope : {
      options : "="
    },
    link : function (scope, element, attrs, ngModel) {
      scope.$watch(function() { return ngModel.$modelValue; }, function(modelValue) {
        scope.select = scope.options.reduce(function (object, option) {
          object[option] = (modelValue.indexOf(option) !== -1)
          return object;
        }, {});
      });

      scope.$watch("select", function (object) {

        scope.value = _.reduce(object, function (array, value, key) { 
          return object[key] ? array.concat(key) : array;
        }, []);

        ngModel.$setViewValue(scope.value);

      }, true);

      scope.toggle = function toggle($event, option) {
        $event.stopPropagation();
        scope.select[option] = !scope.select[option];
      };
    }
  };
});