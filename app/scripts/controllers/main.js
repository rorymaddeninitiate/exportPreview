'use strict';

/**
 * @ngdoc function
 * @name exportApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the exportApp
 */
angular.module('exportApp')
  .controller('MainCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
