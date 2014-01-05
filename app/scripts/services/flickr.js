'use strict';

angular.module('FlickrAPI',[])
  .provider('Flickr', function FlickrProvider() {
    var restUrl = 'http://api.flickr.com/services/rest/?format=json';
    var api_key = '';
    var user_id = '';
    var extras  = 'url_l';

    this.setApiKey = function(key) {
      api_key = key || api_key;
    };    
    this.setUserId = function(id) {
      user_id = id || user_id;
    };

    // Service interface
    this.$get = function($q, $http) {
      var service = {
        getCollections: function() {
          var d = $q.defer();
          $http({
            method: 'JSONP',
            url: restUrl,
            params: {
              'api_key': api_key,
              'user_id': user_id,
              'jsoncallback': 'JSON_CALLBACK',
              'method':'flickr.collections.getTree'
            }
          }).success(function(data) {
            d.resolve(data);
          }).error(function(reason) {
            d.reject(reason);
          })
          return d.promise;
        },
        getSet: function(photoset_id, _extras) {
          var d = $q.defer();
          $http({
            method: 'JSONP',
            url: restUrl,
            params: {
              'api_key': api_key,
              'photoset_id': photoset_id,
              'jsoncallback': 'JSON_CALLBACK',
              'method':'flickr.photosets.getPhotos',
              'extras': _extras || extras
            }
          }).success(function(data) {
            d.resolve(data);
          }).error(function(reason) {
            d.reject(reason);
          })
          return d.promise;
        }
      };

      return service;
    }
  });
