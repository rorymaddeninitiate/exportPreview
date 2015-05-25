'use strict';

angular.module('speakerDirective', [])
// .controller('speakerBoxController', ['$scope', function($scope) {

//   $scope.getClass = function () {
//     if ($scope.speakers.length === 1) return 'col-xs-12 col-sm-12 col-md-12 col-lg-12';
//     if ($scope.speakers.length === 2) return 'col-xs-6 col-sm-6 col-md-6 col-lg-6';
//     if ($scope.speakers.length === 3) return 'col-xs-4 col-sm-4 col-md-4 col-lg-4';
//     if ($scope.speakers.length >= 4) return 'col-xs-6 col-sm-6 col-md-3 col-lg-3';
//   }
// }])
.directive('speakerBox', function() {
  return {
    restrict: 'E',
    scope: {
      speaker: '='
    },
//     controller: 'speakerBoxController',
    templateUrl: 'scripts/directives/speaker/speakerBox.html'
  };
});
