'use strict';

/**
 * @ngdoc overview
 * @name exportApp
 * @description
 * # exportApp
 *
 * Main module of the application.
 */
angular
  .module('exportApp', [
    'ngAnimate',
    'ngCookies',
    'ngMessages',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'ui.router',
    'ui.router.title',
    'smart-table',

    'genericServices',
    'config',

    'user',
    'admin'
  ])
  // .config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
  .config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
    // $locationProvider.html5Mode(true)
    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        resolve: {
          $title: function () { return 'Home'; }
        }
      });

      // For any unmatched url, redirect to /
      $urlRouterProvider.otherwise('/');
  }])

  .run(['$rootScope', '$state', '$stateParams', 'userService',
    function($rootScope, $state, $stateParams, userService) {
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;


    // check for correct priviledges
    $rootScope.$on('$stateChangeStart', function(event, toState, toStateParams) {
      // track the state the user wants to go to; authorization service needs this
      $rootScope.toState = toState;
      $rootScope.toStateParams = toStateParams;
      // if the principal is resolved, do an authorization check immediately. otherwise,
      // it'll be done when the state it resolved.

      userService.authorize(event);
    });
  }]);
