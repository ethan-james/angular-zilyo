'use strict';

describe('Service: zilyo', function () {

  // load the service's module
  beforeEach(module('angularZilyoApp'));

  // instantiate service
  var zilyo;
  beforeEach(inject(function (_zilyo_) {
    zilyo = _zilyo_;
  }));

  it('should do something', function () {
    expect(!!zilyo).toBe(true);
  });

});
