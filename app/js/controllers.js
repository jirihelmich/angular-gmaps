'use strict';

/* Controllers */

angular.module('myApp.controllers', [])
    .controller('MyCtrl1', ['$scope', function ($scope) {

        $scope.zoom = 0;
        $scope.center = {lat: 49, lng: 15};

        $scope.markers = [
            {
                coordinates: {lat: 50, lng: 14},
                description: "nice one"
            },
            {
                coordinates: {lat: 14, lng: 50},
                description: "nice one"
            }
        ];

        $scope.otherMarkers = function () {
            $scope.markers = [
                {
                    coordinates: {lat: 60, lng: 4},
                    description: "nice one"
                },
                {
                    coordinates: {lat: 4, lng: 60},
                    description: "nice one"
                },
                {
                    coordinates: {lat: 14, lng: 50},
                    description: "nice one"
                }
            ];
        };

        $scope.changeCenter = function(){
            $scope.center = {lat: 33, lng: 12};
        };

        $scope.zoomOut = function(){
            $scope.zoom = Math.max(0,$scope.zoom-1);
        };

        $scope.zoomIn = function(){
            $scope.zoom = Math.min(20,$scope.zoom+1);
        };

        $scope.zoomChanged = function(zoom){
            console.log(zoom);
        };

        $scope.centerChanged = function(center){
            console.log(center);
        };

        $scope.boundsChanged = function(bounds){
            console.log(bounds);
        };

    }])
    .controller('MyCtrl2', ['$scope', function ($scope) {

    }]);
