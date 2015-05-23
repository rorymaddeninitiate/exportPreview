'use strict';

/**
 * @ngdoc function
 * @name exportApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the exportApp
 */
angular.module('exportApp')
  .controller('AboutCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
