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
          speakers: ['dataService', function (dataService) {
            return dataService.getClassName('Speaker');
          }]
        }
      })
      .state('admin.partners', {
        url: '/partners',
        templateUrl: 'scripts/admin/partners.html',
        controller: 'AdminPartnersCtrl as adminPartners',
        data: {
          roles: 'admin'
        },
        resolve: {
          $title: function () { return 'Admin: Partners'; },
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
  .controller('AdminCtrl', ['ParseService', '$rootScope', '$state',
    function (ParseService, $rootScope, $state) {
    $rootScope.adminLoggedIn = true;

    $rootScope.logout = function () {
      $rootScope.adminLoggedIn = false;
      ParseService.logout();
      $state.go('home');
    };
  }])
  .controller('AdminSpeakersCtrl', ['speakers', 'countries',
  function (speakers, countries) {

    var self = this;
    this.countries = countries;
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
  .controller('AdminPartnersCtrl', ['partners', function (partners) {
    this.partners = partners;
  }])
  .controller('AdminSessionsCtrl', ['locations', 'sessions', function (locations, sessions) {
    this.locations = locations;
    this.sessions = sessions;
  }])
  .controller('AdminSubscribersCtrl', ['subscribers', function (subscribers) {
    this.subscribers = subscribers;
  }]);
