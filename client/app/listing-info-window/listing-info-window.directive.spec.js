'use strict';

describe('Directive: listingInfoWindow', function () {

  // load the directive's module and view
  beforeEach(module('angularZilyoApp'));
  beforeEach(module('app/listing-info-window/listing-info-window.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<listing-info-window></listing-info-window>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the listingInfoWindow directive');
  }));
});