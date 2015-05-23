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
  }])
  .factory('userService', ['$q', '$rootScope', 'ParseService', '$state', function ( $q, $rootScope, ParseService, $state) {
    return {
      login: function (username, password) {
        var deferred = $q.defer();
        Parse.User.logIn(username, password, {
          success: function (user) {
            $rootScope.currentUser = user;
            deferred.resolve(true);
          },
          error: function (user, err) {
            $rootScope.currentUser = null;
            deferred.reject(err);
          }
        });
        return deferred.promise;
      },
      logout: function() {
        $rootScope.currentUser = null;
        Parse.User.logOut();
      },
      isInAnyRole: function (role) {
        if (!$rootScope.currentUser) return false;
        return $rootScope.currentUser.attributes.roles && $rootScope.currentUser.attributes.roles.indexOf(role) != -1;
      },
      authorize: function(event) {
        var isAuthenticated = !!$rootScope.currentUser;

        if ($rootScope.toState.roles && $rootScope.toState.roles.length > 0 && !this.isInAnyRole($rootScope.toState.roles)) {
          if (isAuthenticated) {
            event.preventDefault();
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
       }
    }
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
          if ($rootScope.returnToState) return $state.go($rootScope.returnToState, $rootScope.returnToStateParams)
          else return $state.go('admin');
        }, function (err) {
          $scope.loginForm.errors = {
            login: err 
          };
        });
    };
  }]);