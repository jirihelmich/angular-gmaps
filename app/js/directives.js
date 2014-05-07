'use strict';

/* Directives */


angular.module('myApp.directives', []).
    directive('appVersion', ['version', function (version) {
        return function (scope, elm, attrs) {
            elm.text(version);
        };
    }]).
    directive('gmaps', [function () {
        return {
            scope: {
                markerData: '=markers',
                mapType: '@',
                zoom: '@',
                center: '='
            },
            controller: function ($scope) {

                $scope._gMarkers = [];

                $scope.getTitle = function (item) {
                    var t = "";
                    if (item.title) {
                        t += item.title;
                    }
                    return t;
                };

                $scope.updateMarkers = function () {

                    angular.forEach($scope._gMarkers, function (m) {
                        m.setMap(null);
                    });

                    angular.forEach($scope.markerData, function (item, k) {

                        var marker = new google.maps.Marker({
                            position: new google.maps.LatLng(item.coordinates.lat, item.coordinates.lng),
                            map: $scope.map,
                            title: $scope.getTitle(item)
                        });

                        $scope._gMarkers.push(marker);

                        //$scope.addVisibilityListener(item, marker);

                        var contentString = '<p>' + item.description.replace(/\n/g, "<br />") + '</p>';

                        google.maps.event.addListener(marker, 'click', function (content) {
                            return function () {
                                $scope.infowindow.setContent(content);//set the content
                                $scope.infowindow.open($scope.map, this);
                            }
                        }(contentString));
                    });
                };

                $scope.$watch('markerData', function (oldval, newval) {
                    $scope.updateMarkers();
                });

            },
            link: function ($scope, $elm, $attrs) {

                var center = $scope.center || '[0,0]';
                var evalCenter = eval(center);

                $scope.map = new google.maps.Map($elm[0], {
                    center: new google.maps.LatLng(evalCenter[0], evalCenter[1]),
                    zoom: parseInt($scope.zoom) || 0,
                    mapTypeId: $scope.mapType || google.maps.MapTypeId.ROADMAP
                });

                $scope.infowindow = new google.maps.InfoWindow();
            },
            restrict: 'E',
            template: '<div class="gmaps"></div>',
            replace: true
        }
    }]);
