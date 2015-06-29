'use strict';

angular.module('user', [])
  .config(['$stateProvider', function ($stateProvider) {
    $stateProvider
      .state('login', {
        url: '/login',
        templateUrl: 'scripts/user/login.html',
        controller: 'UserCtrl',
        resolve: {
          $title: function () { return 'Login'; }
        }
      })
      .state('accessdenied', {
        url: '/accessdenied',
        templateUrl: 'scripts/user/accessdenied.html',
        resolve: {
          $title: function () { return 'Access Denied'; }
        }
      })
      ;
  }])
  .factory('userService', ['$q', '$rootScope', 'ParseService', '$state', '$http', 'server',
    function ( $q, $rootScope, ParseService, $state, $http, server) {
    var service = {
      login: function (username, password) {
        var deferred = $q.defer();
        var req = {
          method: 'GET',
          url: server + '/login?username=' + username + '&password=' + password,
          // headers: {
          //   'X-Parse-Revocable-Session': 1
          // },
        };
        $http(req)
          .success(function (user) {
            ParseService.setSession(user.sessionToken);
            // get the users roles
            ParseService.getUserRoles(user).then(function () {
              return deferred.resolve(true);
            }, function (err) {
              return deferred.reject(err);
            });
          })
          .error(function (err) {
            $rootScope.currentUser = null;
            return deferred.reject(err);
          });
        return deferred.promise;
      },
      isInAnyRole: function (role) {
        if (!$rootScope.currentUser) {
          return false;
        }
        return $rootScope.currentUser.roles && $rootScope.currentUser.roles.indexOf(role) !== -1;
      },
      authorize: function(event) {
        var self = this;
        ParseService.loginFromToken().then(function () {
          if ($rootScope.toState.data && $rootScope.toState.data.roles && $rootScope.toState.data.roles.length > 0 && !self.isInAnyRole($rootScope.toState.data.roles)) {

            event.preventDefault();
            // loginFromToken

            var isAuthenticated = !!$rootScope.currentUser;
            if (isAuthenticated) {
              $state.go('accessdenied'); // user is signed in but not authorized for desired state
            }
            else {
              // user is not authenticated. stow the state they wanted before you
              // send them to the signin state, so you can return them when you're done
              $rootScope.returnToState = $rootScope.toState;
              $rootScope.returnToStateParams = $rootScope.toStateParams;

              // now, send them to the signin state so they can log in
              $state.go('login');
            }
          }
        });
      }
    };
    return service;
  }])
  .controller('UserCtrl', ['$state', '$scope', 'userService', '$rootScope', function ($state, $scope, userService, $rootScope) {
    $scope.user = {};
    $scope.loginForm = {
     errors: {}
    };

    $scope.login = function () {
      userService.login($scope.user.username, $scope.user.password)
      .then(function () {
          $scope.loginForm.errors = {};
          if ($rootScope.returnToState) {
            return $state.go($rootScope.returnToState, $rootScope.returnToStateParams);
          }
          else {
            return $state.go('admin');
          }
        }, function (err) {
          $scope.loginForm.errors = {
            login: err
          };
        });
    };
  }]);
