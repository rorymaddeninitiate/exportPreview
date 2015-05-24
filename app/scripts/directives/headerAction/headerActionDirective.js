'use strict';

angular.module('headerActionDirective', [])
// .controller('Controller', ['$scope', function($scope) {
//   $scope.customer = {
//     name: 'Naomi',
//     address: '1600 Amphitheatre'
//   };
// }])
.directive('headerAction', function() {
  return {
    restrict: 'E',
    // template: '<h1>Hi</h1>'
    templateUrl: 'scripts/directives/headerAction/headerAction.html'
  };
});
