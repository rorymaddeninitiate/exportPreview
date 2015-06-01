'use strict';

angular.module('footerBlockDirective', [])
.directive('footerBlock', function() {
  return {
    restrict: 'E',
    transclude: true,
    templateUrl: 'scripts/directives/footerBlock/footerBlock.html'
  };
});
