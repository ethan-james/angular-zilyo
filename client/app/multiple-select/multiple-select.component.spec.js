'use strict';

describe('Directive: multipleSelect', function () {

  // load the directive's module and view
  beforeEach(module('angularZilyoApp'));
  beforeEach(module('app/multiple-select/multiple-select.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<multiple-select></multiple-select>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the multipleSelect directive');
  }));
});