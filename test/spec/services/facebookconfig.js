'use strict';

describe('Service: facebookConfig', function () {

  // load the service's module
  beforeEach(module('angularFlickrApp'));

  // instantiate service
  var facebookConfig;
  beforeEach(inject(function (_facebookConfig_) {
    facebookConfig = _facebookConfig_;
  }));

  it('should do something', function () {
    expect(!!facebookConfig).toBe(true);
  });

});
