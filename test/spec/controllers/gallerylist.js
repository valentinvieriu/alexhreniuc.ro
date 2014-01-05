'use strict';

describe('Controller: GallerylistCtrl', function () {

  // load the controller's module
  beforeEach(module('angularFlickrApp'));

  var GallerylistCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    GallerylistCtrl = $controller('GallerylistCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
