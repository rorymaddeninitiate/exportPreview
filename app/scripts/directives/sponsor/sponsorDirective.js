'use strict';

angular.module('sponsorDirective', [])
// .controller('Controller', ['$scope', function($scope) {
//   $scope.customer = {
//     name: 'Naomi',
//     address: '1600 Amphitheatre'
//   };
// }])
.directive('sponsorBox', function() {
  return {
    restrict: 'E',
    scope: {
      sponsor: '='
    },
    templateUrl: 'scripts/directives/sponsor/sponsorBox.html'
  };
});
