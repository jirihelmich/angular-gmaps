'use strict';

/* Controllers */

angular.module('myApp.controllers', [])
    .controller('MyCtrl1', ['$scope', function ($scope) {

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
                }
            ];
        }

    }])
    .controller('MyCtrl2', ['$scope', function ($scope) {

    }]);
