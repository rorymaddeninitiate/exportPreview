'use strict';

angular.module('actionButtonDirective', [])
.directive('actionButton', function() {
  return {
    restrict: 'E',
    transclude: true,
    templateUrl: 'scripts/directives/actionButton/actionButton.html'
  };
});
