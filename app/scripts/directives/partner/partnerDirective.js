'use strict';

angular.module('partnerDirective', [])
.controller('partnerBoxController', ['$scope', function($scope) {

  $scope.getClass = function () {
    if ($scope.partners.length === 1) return 'col-xs-12 col-sm-12 col-md-12 col-lg-12';
    if ($scope.partners.length === 2) return 'col-xs-6 col-sm-6 col-md-6 col-lg-6';
    if ($scope.partners.length === 3) return 'col-xs-4 col-sm-4 col-md-4 col-lg-4';
    if ($scope.partners.length >= 4) return 'col-xs-6 col-sm-6 col-md-3 col-lg-3';
  }
}])
.directive('partnerBox', function() {
  return {
    restrict: 'E',
    scope: {
      partners: '=',
      level: '@'
    },
    controller: 'partnerBoxController',
    templateUrl: 'scripts/directives/partner/partnerBox.html'
  };
});
