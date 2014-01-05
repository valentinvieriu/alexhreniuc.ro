'use strict';

angular.module('angularFlickrApp')
  .controller('GallerylistCtrl', function ($rootScope, $scope, Flickr) {

	$scope.currentGallery = null;

	$scope.setCurrentGallery = function (gallery) {
	$scope.currentGallery = gallery;
	};

	$scope.isCurrentGallery = function (gallery) {
	return $rootScope.currentPhotoset === gallery;
	}

	Flickr.getCollections()
	.then(function(data) {
	  $scope.collections = data.collections;
	});
  });
