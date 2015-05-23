'use strict';

angular.module('admin', [])
     // .config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
  .config(['$stateProvider', function ($stateProvider) {
    $stateProvider
      .state('admin', {
        url: '/admin',
        templateUrl: 'scripts/admin/admin.html',
        controller: 'AdminCtrl',
        // roles: ['Admin'],
        resolve: {
          $title: function () { return 'Admin'; }
        }
      })
      .state('admin.users', {
        url: '/users',
        templateUrl: 'scripts/admin/users.html',
        controller: 'AdminUsersCtrl',
        controllerAs: 'adminUsers',
        // roles: ['Admin'],
        resolve: {
          $title: function () { return 'Admin: Users'; },
          users: ['adminService', function (adminService) {
            return adminService.getUsers()
          }]
        }
      })
  }])
  .service('adminService', ['server', '$http', function (server, $http) {
    return {
      getUsers: function () {
         $http.get(server + '/sessions').then(function (users) {
           return users;
         }, function () {
           return [];
         });
      }
    }
  }])
  .controller('AdminCtrl', [function () {
      
  }])
  .controller('AdminUsersCtrl', [function () {
    
  }])