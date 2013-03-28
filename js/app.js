var d = {};
var app = angular.module('myApp', ["forma"]).config(function($routeProvider, $locationProvider){

	$routeProvider.when('/form/:id',{
		templateUrl:'test.html',
		onActivate: function(){ }
	});

});

var form = {},
settings = {};
settings.geo = {};

settings.geo.refresh = function(ref){
	var g = this;
	if (navigator.geolocation){
		navigator.geolocation.getCurrentPosition(function(geo){
		g.center = {lat:geo.coords.latitude, lng: geo.coords.longitude};
		if (ref != undefined){ ref = g.center; }
		});
	}
};
settings.geo.refresh();
settings.geo.center = {lat:0, lng:0};
settings.geo.zoom = 18;

function FormCtrl($scope, $http, $route) {
    "use strict";
    $scope.test = function() {
    	return $route;
    }
    $scope.url = 'content.json';
    $scope.update = function() {

    	var _compile = function(data, is_sub){
    		var x = 0;
    		for (x; x < data.length; x++){
				if (data[x]['type'] == 'subform'){
					var initial = data[x]['initial'];

					_compile(data[x]['fields']);
					if (initial != undefined){
						if (initial > 1){
							var count = initial--,
							i = 1;
							for (i; i<count; i++){
								var replace = jQuery.extend(true,{},data[x]);
								data.splice(x+1, 0, replace);
							}
						}
					} else {
						if (!is_sub){
							data[x]['hidden'] = true;
						}
					}		
					return data;
				}
    		}
    	}

        $http.get($scope.url).then( function(result) {
	        var data = _compile(result.data);
			$scope.original = jQuery.extend(true, [], data);
			form.currentForm = $scope;
			$scope.data = data;
        });
    }
    
	form.scope = $scope;
    $scope.update();
}

