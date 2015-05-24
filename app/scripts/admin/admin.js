'use strict';

angular.module('admin', [])
     // .config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
  .config(['$stateProvider', function ($stateProvider) {
    $stateProvider
      .state('admin', {
        url: '/admin',
        templateUrl: 'scripts/admin/admin.html',
        controller: 'AdminCtrl as admin',
        data: {
          roles: 'admin'
        },
        resolve: {
          $title: function () { return 'Admin'; }
        }
      })
      .state('admin.speakers', {
        url: '/speakers',
        templateUrl: 'scripts/admin/speakers.html',
        controller: 'AdminSpeakersCtrl as adminSpeakers',
        data: {
          roles: 'admin'
        },
        resolve: {
          $title: function () { return 'Admin: Speakers'; },
          speakers: ['adminService', function (adminService) {
            return adminService.getClassName('Speaker');
          }]
        }
      })
      .state('admin.sponsors', {
        url: '/sponsors',
        templateUrl: 'scripts/admin/sponsors.html',
        controller: 'AdminSponsorsCtrl as adminSponsors',
        data: {
          roles: 'admin'
        },
        resolve: {
          $title: function () { return 'Admin: Sponsors'; },
          speakers: ['adminService', function (adminService) {
            return adminService.getClassName('Sponsor');
          }]
        }
      })
      ;
  }])
  .service('adminService', ['server', '$http', function (server, $http) {
    return {
      getClassName: function (className) {
         return $http.get(server + '/classes/' + className).then(function (results) {
           return results.data.results;
         }, function () {
           return [];
         });
      }
    };
  }])
  .controller('AdminCtrl', ['userService', '$rootScope', function (userService, $rootScope) {
    $rootScope.adminLoggedIn = true;

    this.logout = function () {
      $rootScope.adminLoggedIn = false;
      userService.logout();
    };
  }])
  .controller('AdminSpeakersCtrl', ['speakers', function (speakers) {
    var self = this;
    this.speakers = speakers;
    this.speaker = {};

    this.addSpeaker = function () {
      self.speaker = {};
      self.showSpeakerForm = !self.showSpeakerForm;
    };

    this.updateSpeaker = function (speaker) {
      self.showSpeakerForm = !self.showSpeakerForm;
      self.speaker = speaker;
    };

    this.createOrUpdate = function () {

    };
  }])
  .controller('AdminSponsorsCtrl', ['sponsors', function (sponsors) {
    this.sponsors = sponsors;
  }])
  .controller('AdminSessionsCtrl', ['locations', 'sessions', function (locations, sessions) {
    this.locations = locations;
    this.sessions = sessions;
  }])
  .controller('AdminSubscribersCtrl', ['subscribers', function (subscribers) {
    this.subscribers = subscribers;
  }]);
