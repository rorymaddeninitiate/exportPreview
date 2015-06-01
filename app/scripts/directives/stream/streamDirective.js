'use strict';

angular.module('streamDirective', [])
.directive('streamBox', function() {
  return {
    restrict: 'E',
    scope: {
      stream: '='
    },
    templateUrl: 'scripts/directives/stream/streamBox.html'
  };
});
