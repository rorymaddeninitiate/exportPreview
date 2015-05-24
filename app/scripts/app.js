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
    'uiGmapgoogle-maps',

    'genericServices',
    'config',

    'user',
    'admin'
  ])
  // .config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
  .config(['$stateProvider', '$urlRouterProvider', 'uiGmapGoogleMapApiProvider',
    function ($stateProvider, $urlRouterProvider, uiGmapGoogleMapApiProvider) {
    uiGmapGoogleMapApiProvider.configure({
      //    key: 'your api key',
      v: '3.17',
      libraries: 'weather,geometry,visualization'
    });
    // $locationProvider.html5Mode(true)
    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        resolve: {
          $title: function () { return 'Home'; }
        }
      })
      .state('speakers', {
        url: '/speakers',
        templateUrl: 'views/main.html'
      })
      .state('speaker', {
        url: '/speaker/:id',
        templateUrl: 'views/main.html'
      })
      .state('sponsors', {
        url: '/sponsors',
        templateUrl: 'views/main.html'
      })
      .state('sponsor', {
        url: '/sponsor/:id',
        templateUrl: 'views/main.html'
      })
      .state('agenda', {
        url: '/agenda',
        templateUrl: 'views/main.html'
      })
      .state('venue', {
        url: '/venue',
        templateUrl: 'views/main.html'
      })
      .state('blog', {
        url: '/blog',
        templateUrl: 'views/main.html'
      })
      .state('contact', {
        url: '/contact',
        templateUrl: 'views/main.html'
      })
      .state('terms', {
        url: '/terms',
        templateUrl: 'views/main.html'
      })
      .state('anti-harassment', {
        url: '/anti-harassment-policy',
        templateUrl: 'views/main.html'
      })
      .state('faq', {
        url: '/faq',
        templateUrl: 'views/main.html'
      })
      .state('media', {
        url: '/media',
        templateUrl: 'views/main.html'
      })
      ;

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
