'use strict';

/* Directives */
Array.prototype.diff = function(a) {
    return this.filter(function(i) {return a.indexOf(i) < 0;});
};

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
                zoom: '=',
                center: '=',
                zoomChangedListener: '&zoomChanged',
                centerChangedListener: '&centerChanged',
                boundsChangedListener: '&boundsChanged',
                fitBounds: '='
            },
            controller: function ($scope) {

                $scope._gMarkers = [];
                $scope.markersMap = {};

                $scope.getTitle = function (item) {
                    var t = "";
                    if (item.title) {
                        t += item.title;
                    }
                    return t;
                };

                $scope.zoomChanged = function (zoomLevel) {
                    $scope.zoomChangedListener = $scope.zoomChangedListener || function () {
                    };
                    $scope.zoomChangedListener({zoom: zoomLevel});
                };

                $scope.centerChanged = function (center) {
                    $scope.centerChangedListener = $scope.centerChangedListener || function () {
                    };
                    $scope.centerChangedListener({center: {lat: center.lat(), lng: center.lng()}});
                };

                $scope.boundsChanged = function (bounds) {
                    $scope.boundsChangedListener = $scope.boundsChangedListener || function () {
                    };
                    var ne = bounds.getNorthEast();
                    var sw = bounds.getSouthWest();
                    $scope.boundsChangedListener({
                        bounds: {
                            northEast: {lat: ne.lat(), lng: ne.lng()},
                            southWest: {lat: sw.lat(), lng: sw.lng()}
                        }
                    });
                };

                $scope.updateMarkers = function () {

                    var newMarkersMap = {};
                    var newMarkers = [];
                    $scope.bounds = new google.maps.LatLngBounds();

                    angular.forEach($scope.markerData, function (item) {

                        var coords = item.coordinates;
                        var marker;

                        // REUSE OR CREATE
                        if ($scope.markersMap[coords.lat] && $scope.markersMap[coords.lat][coords.lng]) {
                            marker = $scope.markersMap[coords.lat][coords.lng];
                            marker.setMap($scope.map);
                        } else {
                            marker = new google.maps.Marker({
                                position: new google.maps.LatLng(coords.lat, coords.lng),
                                map: $scope.map,
                                title: $scope.getTitle(item)
                            });
                        }

                        // BOUNDS, REMEBERING MARKERS
                        newMarkersMap[coords.lat] = newMarkersMap[coords.lat] || {};
                        newMarkersMap[coords.lat][coords.lng] = marker;
                        newMarkers.push(marker);
                        $scope.bounds.extend(marker.position);

                        // INFO WINDOW
                        var contentString = '<p>' + item.description.replace(/\n/g, "<br />") + '</p>';

                        google.maps.event.addListener(marker, 'click', function (content) {
                            return function () {
                                $scope.infowindow.setContent(content);//set the content
                                $scope.infowindow.open($scope.map, this);
                            }
                        }(contentString));
                    });

                    var hideMarkers = $scope._gMarkers.diff(newMarkers);

                    angular.forEach(hideMarkers, function (m) {
                        m.setMap(null);
                    });

                    $scope._gMarkers = newMarkers;

                    $scope.markersMap = newMarkersMap;

                    if ($scope.fitBounds === true) {
                        $scope.map.fitBounds($scope.bounds);
                    }

                    $scope.boundsChanged($scope.bounds);
                };

                $scope.updateZoom = function () {
                    $scope.map.setZoom($scope.zoom || 0);
                };

                $scope.updateCenter = function () {
                    var center = $scope.center || {lat: 0, lng: 0};
                    $scope.map.setCenter(new google.maps.LatLng(center.lat || 0, center.lng || 0));
                };

                $scope.$watch('markerData', function () {
                    $scope.updateMarkers();
                });

                $scope.$watch('zoom', function () {
                    $scope.updateZoom();
                });

                $scope.$watch('center', function () {
                    $scope.updateCenter();
                });

            },
            link: function ($scope, $elm, $attrs) {

                var center = $scope.center || {lat: 0, lng: 0};

                $scope.map = new google.maps.Map($elm[0], {
                    center: new google.maps.LatLng(center.lat, center.lng),
                    zoom: parseInt($scope.zoom) || 0,
                    mapTypeId: $scope.mapType || google.maps.MapTypeId.ROADMAP
                });

                google.maps.event.addListener($scope.map, 'zoom_changed', function () {
                    $scope.zoomChanged($scope.map.getZoom());
                });

                google.maps.event.addListener($scope.map, 'center_changed', function () {
                    $scope.centerChanged($scope.map.getCenter());
                });

                google.maps.event.addListener($scope.map, 'bounds_changed', function () {
                    $scope.boundsChanged($scope.map.getBounds());
                });

                $scope.infowindow = new google.maps.InfoWindow();
            },
            restrict: 'E',
            template: '<div class="gmaps"></div>',
            replace: true
        }
    }]);
