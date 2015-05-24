'use strict';

/**
 * @ngdoc function
 * @name exportApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the exportApp
 */
angular.module('exportApp')
  .controller('MainCtrl', ['speakerService', 'sponsorService', 'uiGmapGoogleMapApi',
  function (speakerService, sponsorService,uiGmapGoogleMapApi) {
    var self = this;
    self.map = {};

    uiGmapGoogleMapApi.then(function(maps) {
      self.map = {
        center: {
          latitude: 53.360907,
          longitude: -6.251166
        },
        zoom: 15
      };
    });


    speakerService.getSpeakers()
      .then(function () {
        self.speakers = speakerService.speakers;
      }, function (err) {
        //TODO: show error
        console.log(err);
      });

    sponsorService.getSponsors()
      .then(function () {
        self.sponsors = sponsorService.sponsors;
      }, function (err) {
        //TODO: show error
        console.log(err);
      });
  }]);
