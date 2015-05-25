'use strict';

angular.module('genericServices', ['ngCookies'])
  .service('ParseService', ['$rootScope', '$http', '$q', 'server', '$cookies',
    function($rootScope, $http, $q, server, $cookies) {
    var appId = 'yWTZRz60WfymokTSxKeI11Lu7ZfZT0Ny3uT6GAV0';
    var jsKey = '7luLgXpWuaOMG8chT2UGGKV4FDcSheihVsM06r6Y';
    var restKey = 'Evs90NiRTkiT40wlSzmyPcO2gs5bjwQz8Gap4I7I';
    Parse.initialize(appId, jsKey);

    $http.defaults.headers.common['X-Parse-Application-Id'] = appId;
    $http.defaults.headers.common['X-Parse-REST-API-Key'] = restKey;

    var service = {
      setSession: function (session) {
        $http.defaults.headers.common['X-Parse-Session-Token'] = session;
      },
      getUserRoles: function (user) {
        var deferred = $q.defer();
        $http.post(server + '/functions/getRoles', user)
          .success(function (results) {
            // update the user with the roles
            user.roles = results.result.map(function (result) {
              return result.name;
            });
            $rootScope.currentUser = user;
            $rootScope.adminLoggedIn = true;
            $cookies.sessionToken = user.sessionToken || user.data.sessionToken;

            return deferred.resolve(user);

          })
          .error(function (err) {
            $rootScope.currentUser = null;
            return deferred.reject(err);
          });
        return deferred.promise;
      },
      loginFromToken: function () {
        var deferred = $q.defer();
        var sessionToken = $cookies.sessionToken;

        if(sessionToken && sessionToken !== 'undefined') {
          service.setSession(sessionToken);

          $http.get(server + '/users/me').then(function (user) {
            // service.getUserRoles(user).then(function () {
            //   return deferred.resolve(user);
            // })

            return deferred.resolve(service.getUserRoles(user));
          }, function () {
            // The token could not be validated.
            service.setSession(null);
            $rootScope.adminLoggedIn = false;
            deferred.resolve(null);
          });
        }
        else {
          deferred.resolve(null);
        }
        return deferred.promise;
      }
    };

    // set the $rootScope.currentUser
    if (Parse.User.current()) {
      service.getUserRoles(Parse.User.current());
    }
    else {
      service.loginFromToken();
    }

    return service;
  }])
  // .factory('speakerService', ['$http', '$q', 'server', function speakerService($http, $q, server) {

  //   // implementation
  //   function getSpeakers() {
  //       var def = $q.defer();

  //       $http.get(server + '/classes/Speaker')
  //           .success(function(data) {
  //               service.speakers = data;
  //               def.resolve(data);
  //           })
  //           .error(function() {
  //               def.reject('Failed to get speakers');
  //           });
  //       return def.promise;
  //   }

  //   // interface
  //   var service = {
  //       speakers: [],
  //       getSpeakers: getSpeakers
  //   };
  //   return service;
  // }])
  // .factory('sponsorService', ['$http', '$q', 'server', function speakerService($http, $q, server) {

  //   // implementation
  //   function getSponsors() {
  //       var def = $q.defer();

  //       $http.get(server + '/classes/Sponsor')
  //           .success(function(data) {
  //               service.sponsors = data;
  //               def.resolve(data);
  //           })
  //           .error(function() {
  //               def.reject('Failed to get sponsors');
  //           });
  //       return def.promise;
  //   }

  //   // interface
  //   var service = {
  //       sponsors: [],
  //       getSponsors: getSponsors
  //   };
  //   return service;
  // }])
  .factory('dataService',['$http', '$q', 'server', function dataService ($http, $q, server) {
    var data = {};
    function getClassName (className) {
      var def = $q.defer();
      
      if (data.className && data.className.length > 0) {
        def.resolve(data.className);
      }
      else {
        $http.get(server + '/classes/' + className).then(function (results) {
          data[className] = results.data.results;
          def.resolve(data[className]);
        }, 
        function (err) {
          data[className] = [];
          def.reject(err);
        });
      }
      return def.promise;
    }
    var service = {
      getClassName: getClassName
    };
    return service;
  }]);
