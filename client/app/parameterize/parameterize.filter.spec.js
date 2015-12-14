'use strict';

describe('Filter: parameterize', function () {

  // load the filter's module
  beforeEach(module('angularZilyoApp'));

  // initialize a new instance of the filter before each test
  var parameterize;
  beforeEach(inject(function ($filter) {
    parameterize = $filter('parameterize');
  }));

  it('should return the input prefixed with "parameterize filter:"', function () {
    var text = 'angularjs';
    expect(parameterize(text)).toBe('parameterize filter: ' + text);
  });

});
