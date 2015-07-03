'use strict';

angular.module('sessionLogoDirective', [])
.controller('SessionLogoController', ['$scope', function($scope) {
  $scope.logos = $scope.speakers.map(function (speaker) {
    return speaker.companyPhoto.url
  });
}])
.directive('sessionLogo', function() {
  return {
    restrict: 'E',
    scope: {
      speakers: '='
    },
    controller: 'SessionLogoController',
    templateUrl: 'scripts/directives/sessionLogo/sessionLogo.html'
  };
});
