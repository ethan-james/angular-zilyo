'use strict';

describe('Service: RESULTFILTERS', function () {

  // load the service's module
  beforeEach(module('angularZilyoApp'));

  // instantiate service
  var RESULTFILTERS;
  beforeEach(inject(function (_RESULTFILTERS_) {
    RESULTFILTERS = _RESULTFILTERS_;
  }));

  it('should do something', function () {
    expect(!!RESULTFILTERS).toBe(true);
  });

});
