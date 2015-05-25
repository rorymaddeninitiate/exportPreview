'use strict';

angular.module('sponsorDirective', [])
.controller('sponsorBoxController', ['$scope', function($scope) {

  $scope.getClass = function () {
    if ($scope.sponsors.length === 1) return 'col-xs-12 col-sm-12 col-md-12 col-lg-12';
    if ($scope.sponsors.length === 2) return 'col-xs-6 col-sm-6 col-md-6 col-lg-6';
    if ($scope.sponsors.length === 3) return 'col-xs-4 col-sm-4 col-md-4 col-lg-4';
    if ($scope.sponsors.length >= 4) return 'col-xs-6 col-sm-6 col-md-3 col-lg-3';
  }
}])
.directive('sponsorBox', function() {
  return {
    restrict: 'E',
    scope: {
      sponsors: '=',
      level: '@'
    },
    controller: 'sponsorBoxController',
    templateUrl: 'scripts/directives/sponsor/sponsorBox.html'
  };
});
