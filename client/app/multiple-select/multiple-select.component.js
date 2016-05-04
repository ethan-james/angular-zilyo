'use strict';

angular.module('angularZilyoApp').component('multipleSelect', {
  templateUrl : 'app/multiple-select/multiple-select.html',
  require : {
    ngModel: "ngModel"
  },
  bindings : {
    options : "<"
  },
  controller : ["$scope", function ($scope) {
    var $ctrl = this;

    function toggle($event, option) {
      $event.stopPropagation();
      $ctrl.select = Object.assign({}, $ctrl.select, {[option]: !$ctrl.select[option]});
    }

    $ctrl.$onInit = function () {
      $ctrl.select = {};
      $ctrl.toggle = toggle;
    }

    $scope.$watch(function () { return $ctrl.ngModel.$modelValue; }, function(modelValue) {
      $scope.select = $ctrl.options.reduce(function (object, option) {
        object[option] = (modelValue.indexOf(option) !== -1)
        return object;
      }, {});
    });

    $scope.$watch(function () { return $ctrl.select; }, function (object) {

      $scope.value = _.reduce(object, function (array, value, key) { 
        return object[key] ? array.concat(key) : array;
      }, []);

      $ctrl.ngModel.$setViewValue($scope.value);

    });
  }]
});