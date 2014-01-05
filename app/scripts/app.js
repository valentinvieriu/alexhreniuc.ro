'use strict';

angular.module('angularFlickrApp', [
  'ngRoute',
  'FlickrAPI'
])
  .config(function ($routeProvider, FlickrProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/:photoset_title/:photoset_id', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });

    FlickrProvider.setApiKey('bab05ea17002c5f9f458a145df6ff286');
    FlickrProvider.setUserId('66052014@N08');

    
  })
  .run(function($rootScope) {
    $rootScope.photosets = [];
    $rootScope.about     =false;
    $rootScope.contact   =false;
  });
