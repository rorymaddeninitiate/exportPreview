'use strict';

angular.module('speakerDirective', [])
.directive('speakerBox', function() {
  return {
    restrict: 'E',
    scope: {
      speaker: '='
    },
    templateUrl: 'scripts/directives/speaker/speakerBox.html'
  };
});
