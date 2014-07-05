'use strict';

angular.module('angularFlickrApp')
  .controller('ContactformCtrl', function ($rootScope,$scope,$http) {
    $scope.formData = {};

    $scope.submit = function() {   
        // console.log(this.formData);

		$http({
		    method: 'POST',
		    url: 'send.php',
		    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
		    transformRequest: function(obj) {
		        var str = [];
		        for(var p in obj)
		        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
		        return str.join("&");
		    },
		    data: this.formData
		}).success(function (e) {
			$rootScope.contact=false;
			alert("Message sent! Thank you!")
		});


    };
  });
