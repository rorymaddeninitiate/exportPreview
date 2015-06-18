'use strict';

angular.module('adminMenuDirective', [])
.directive('adminMenu', function() {
  return {
    restrict: 'E',
    templateUrl: 'scripts/directives/adminMenu/adminMenu.html'
  };
});
