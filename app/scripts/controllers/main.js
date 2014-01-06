'use strict';

angular.module('angularFlickrApp')
  .controller('MainCtrl', function ($rootScope, $scope, $routeParams, Flickr, facebookConfig) {
  	$rootScope.currentPhotoset = $routeParams.photoset_id || '72157627503614426';

  	// check if we have the information cacched
  	if ($rootScope.photosets && $rootScope.photosets[$rootScope.currentPhotoset]) {
  		$scope.photoset = $rootScope.photosets[$rootScope.currentPhotoset];
  	}
  	else {
	  	Flickr.getSet($rootScope.currentPhotoset,'url_l')
	  		.then(function(data){
          $scope.photoset                                  = data.photoset;
          $rootScope.photosets[$rootScope.currentPhotoset] = data.photoset;
	  		});
  		
  	}

    $scope.sharePictureFacebook = function sharePicture(photo_url,photo_title) {
      FB.ui({
          method: 'feed',
          link: window.location.href,
          picture: photo_url,
          name:photo_title,
          caption: facebookConfig.caption,
          description: facebookConfig.description
      });
    };    

    $scope.sharePicturePinterest = function sharePicture(photo_url,photo_title) {
      window.open(
        'http://www.pinterest.com/pin/create/button/'+
        '?url='+encodeURIComponent(window.location.href)+
        '&media='+encodeURIComponent(photo_url)+
        '&description='+encodeURIComponent(photo_title),
        'Share on Pinterest',
        'width=700,height=300,top='+(screen.height-300)/2+',left='+(screen.width-700)/2);
    };

  });