'use strict';

angular.module('speakerDirective', [])
// .controller('Controller', ['$scope', function($scope) {
//   $scope.customer = {
//     name: 'Naomi',
//     address: '1600 Amphitheatre'
//   };
// }])
.directive('speakerBox', function() {
  return {
    restrict: 'E',
    scope: {
      speaker: '='
    },
    templateUrl: 'scripts/directives/speaker/speakerBox.html'
  };
});
