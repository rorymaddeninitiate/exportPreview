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
            return dataService.getClassName('Speaker', []);
          }]
        }
      })
      .state('admin.streams', {
        url: '/streams',
        templateUrl: 'scripts/admin/streams.html',
        controller: 'AdminStreamsCtrl as adminStreams',
        data: {
          roles: 'admin'
        },
        resolve: {
          $title: function () { return 'Admin: Streams'; },
          streams: ['dataService', function (dataService) {
            return dataService.getClassName('Stream', []);
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
          partners: ['dataService', function (dataService) {
            return dataService.getClassName('Sponsor', ['include=stream']);
          }],
          streams: ['dataService', function (dataService) {
            return dataService.getClassName('Stream', []);
          }]
        }
      })
      .state('admin.locations', {
        url: '/locations',
        templateUrl: 'scripts/admin/locations.html',
        controller: 'AdminLocationsCtrl as adminLocations',
        data: {
          roles: 'admin'
        },
        resolve: {
          $title: function () { return 'Admin: Locations'; },
          locations: ['dataService', function (dataService) {
            return dataService.getClassName('Location', []);
          }]
        }
      })
      .state('admin.media', {
        url: '/media',
        templateUrl: 'scripts/admin/media.html',
        controller: 'AdminMediaCtrl as adminMedia',
        data: {
          roles: 'admin'
        },
        resolve: {
          $title: function () { return 'Admin: Media'; },
          media: ['dataService', function (dataService) {
            return dataService.getClassName('Media', []);
          }]
        }
      })
      .state('admin.eventSessions', {
        url: '/eventSessions',
        templateUrl: 'scripts/admin/eventSessions.html',
        controller: 'AdminEventSessionsCtrl as adminEventSessions',
        data: {
          roles: 'admin'
        },
        resolve: {
          $title: function () { return 'Admin: EventSessions'; },
          eventSessions: ['dataService', function (dataService) {
            return dataService.getClassName('EventSession', ['include=location,stream,speakers']);
          }],
          locations: ['dataService', function (dataService) {
            return dataService.getClassName('Location', []);
          }],
          streams: ['dataService', function (dataService) {
            return dataService.getClassName('Stream', []);
          }],
          speakers: ['dataService', function (dataService) {
            return dataService.getClassName('Speaker', []);
          }]
        }
      })
      ;
  }])
  .controller('AdminCtrl', ['ParseService', '$rootScope', '$state', 'angularLoad',
    function (ParseService, $rootScope, $state, angularLoad) {

    angularLoad.loadScript('https://widget.cloudinary.com/global/all.js');
    $rootScope.adminLoggedIn = true;

    $rootScope.logout = function () {
      $rootScope.adminLoggedIn = false;
      ParseService.logout();
      $state.go('home');
    };

  }])
  .controller('AdminSpeakersCtrl', ['speakers', 'countries', 'imageService', 'server', '$http', '$window',
  function (speakers, countries, imageService, server, $http, $window) {

    var self = this;
    this.countries = countries;
    this.speakers = speakers;

    this.addSpeaker = function (speaker) {
      self.speaker = speaker || {};
      self.showSpeakerForm = !self.showSpeakerForm;
      self.formError = false;
    };

    // set the cloudinary values - see if this can be fixed
    this.uploadImage = function (speaker, fieldName) {
      imageService.uploadImage({
        className: 'Speaker',
        fieldName: fieldName || 'photo',
        alt: speaker.first + ' ' + speaker.last + ': ' + speaker.company,
        object: speaker
      });
    }

    this.removeImage = function (speaker, fieldName) {
      imageService.removeImage({
        object: speaker,
        fieldName: fieldName || 'photo',
        name: speaker.first
      });
    }

    this.createOrUpdate = function () {
      var existingId = false;
      var speaker = {
        first: this.speaker.first,
        last: this.speaker.last,
        jobTitle: this.speaker.jobTitle,
        company: this.speaker.company,
        country: this.speaker.country,
        linkedIn: this.speaker.linkedIn,
        twitter: this.speaker.twitter,
        active: this.speaker.active !== undefined ? this.speaker.active: false
      };

      // is this an update of creation
      var query;
      if(this.speaker.objectId) {
        existingId = self.speaker.objectId;
        query = $http.put(server + '/classes/Speaker/' + this.speaker.objectId, speaker);
      }
      else {
        existingId = null;
        query = $http.post(server + '/classes/Speaker', speaker);
      }
      query
        .success(function (speakerObject) {
          // for a new object set the objectId
          speaker.objectId = existingId || speakerObject.objectId;
          if (!existingId) {
            //add a new speaker
            self.speakers.push(speaker);
          }

          self.speaker = {};
          self.showSpeakerForm = false;
        })
        .error(function (err) {
          self.formError = true;
        });
    };

    this.toggleSpeaker = function (speaker) {
      var action = speaker.active ? 'delete ' : 'restore ';
      if($window.confirm('Are you sure you want to ' + action + speaker.first + '?')){
        this.speaker = speaker;
        this.speaker.active = !this.speaker.active;
        this.createOrUpdate();
      }
    }
  }])
  .controller('AdminPartnersCtrl', ['partners', 'streams', 'partnerLevels', 'imageService', '$window', '$http', 'server',
    function (partners, streams, partnerLevels, imageService, $window, $http, server) {
    this.partners = partners;
    this.streams = streams;

    this.levels = partnerLevels;

    var self = this;

    this.addPartner = function (partner) {
      self.partner = partner || {};
      self.showPartnerForm = !self.showPartnerForm;
      self.formError = false;

      // create a separate stream copy
      if(partner && partner.stream) {
        self.streamOption = angular.copy(partner.stream);
      }
    };

    // set the cloudinary values - see if this can be fixed
    this.uploadImage = function (partner) {
      imageService.uploadImage({
        className: 'Sponsor',
        alt: partner.name,
        object: partner
      });
    }

    this.removeImage = function (partner) {
      imageService.removeImage({
        object: partner,
        name: partner.name
      });
    }

    this.removeStream = function (partner) {
      var action = partner.stream ? 'delete ' : 'add ';
      if($window.confirm('Are you sure you want to ' + action + ' the stream?')){
        $http.put(server + '/classes/Sponsor/' + partner.objectId, {
            stream: {
              __op: 'Delete'
            }
          })
          .success(function () {
            partner.stream = undefined;
          })
          .error(function (err) {
            self.formError = true;
            console.log(err);
          })
      }
    }

    this.createOrUpdate = function () {
      var existingId = false;
      var partner = {
        name: this.partner.name,
        level: this.partner.level,
        url: this.partner.url,
        active: this.partner.active !== undefined ? this.partner.active: false
      };

      if (this.streamOption) {
        partner.stream = {
          __type: 'Pointer',
          className: 'Stream',
          objectId: this.streamOption.objectId
        };
      }

      // is this an update of creation
      var query;
      if(this.partner.objectId) {
        existingId = self.partner.objectId;
        query = $http.put(server + '/classes/Sponsor/' + this.partner.objectId, partner);
      }
      else {
        existingId = null;
        query = $http.post(server + '/classes/Sponsor', partner);
      }
      query
        .success(function (partnerObject) {
          // for a new object set the objectId
          partner.objectId = existingId || partnerObject.objectId;

          if (!existingId) {
            if (self.streamOption) {
              // set it to the stream value

              partner.stream = self.streams.filter(function (stream) {
                return stream.objectId === self.streamOption.objectId;
              })[0];
            }

            //add a new partner
            self.partners.push(partner);
          }
          else {
            // check if the stream is set?
            if (self.streamOption) {
              // set it to the stream value

              self.partner.stream = self.streams.filter(function (stream) {
                return stream.objectId === self.streamOption.objectId;
              })[0];
            }
          }

          self.partner = {};
          self.showPartnerForm = false;
          self.streamOption = undefined;

        })
        .error(function (err) {
          self.formError = true;
          console.log(err);
        });
    };

    this.togglePartner = function (partner) {
      var action = partner.active ? 'delete ' : 'restore ';
      if($window.confirm('Are you sure you want to ' + action + partner.name + '?')){
        this.partner = partner;
        this.partner.active = !this.partner.active;
        this.createOrUpdate();
      }
    }
  }])
  .controller('AdminStreamsCtrl', ['streams', '$window', '$http', 'server', 'imageService',
    function (streams, $window, $http, server, imageService) {
    this.streams = streams;
    var self = this;

    this.addStream = function (stream) {
      self.stream = stream || {};
      self.showStreamForm = !self.showStreamForm;
      self.formError = false;
    };

    this.createOrUpdate = function () {
      var existingId = false;
      var stream = {
        name: this.stream.name,
        description: this.stream.description,
        icon: this.stream.icon,
        order: parseInt(this.stream.order,10),
        active: this.stream.active !== undefined ? this.stream.active: false
      };

      // is this an update of creation
      var query;
      if(this.stream.objectId) {
        existingId = self.stream.objectId;
        query = $http.put(server + '/classes/Stream/' + this.stream.objectId, stream);
      }
      else {
        existingId = null;
        query = $http.post(server + '/classes/Stream', stream);
      }
      query
        .success(function (streamObject) {
          // for a new object set the objectId
          stream.objectId = existingId || streamObject.objectId;
          if (!existingId) {
            //add a new stream
            self.streams.push(stream);
          }

          self.stream = {};
          self.showStreamForm = false;
        })
        .error(function (err) {
          self.formError = true;
        });
    };

        // set the cloudinary values - see if this can be fixed
    this.uploadImage = function (stream) {
      imageService.uploadImage({
        className: 'Stream',
        alt: stream.name,
        object: stream
      });
    }

    this.removeImage = function (stream) {
      imageService.removeImage({
        object: stream,
        name: stream.name
      });
    }

    this.toggleStream = function (stream) {
      var action = stream.active ? 'delete ' : 'restore ';
      if($window.confirm('Are you sure you want to ' + action + stream.name + '?')){
        this.stream = stream;
        this.stream.active = !this.stream.active;
        this.createOrUpdate();
      }
    }
  }])
  .controller('AdminLocationsCtrl', ['locations', '$window', '$http', 'server', function (locations, $window, $http, server) {
    this.locations = locations;
    var self = this;

    this.addLocation = function (location) {
      self.location = location || {};
      self.showLocationForm = !self.showLocationForm;
      self.formError = false;
    };

    this.createOrUpdate = function () {
      var existingId = false;
      var location = {
        name: this.location.name,
        capacity: parseInt(this.location.capacity,10),
        active: this.location.active !== undefined ? this.location.active: false
      };

      // is this an update of creation
      var query;
      if(this.location.objectId) {
        existingId = self.location.objectId;
        query = $http.put(server + '/classes/Location/' + this.location.objectId, location);
      }
      else {
        existingId = null;
        query = $http.post(server + '/classes/Location', location);
      }
      query
        .success(function (locationObject) {
          // for a new object set the objectId
          location.objectId = existingId || locationObject.objectId;
          if (!existingId) {
            //add a new location
            self.locations.push(location);
          }

          self.location = {};
          self.showLocationForm = false;
        })
        .error(function (err) {
          self.formError = true;
        });
    };

    this.toggleLocation = function (location) {
      var action = location.active ? 'delete ' : 'restore ';
      if($window.confirm('Are you sure you want to ' + action + location.name + '?')){
        this.location = location;
        this.location.active = !this.location.active;
        this.createOrUpdate();
      }
    }
  }])
  .controller('AdminMediaCtrl', ['media', '$window', '$http', 'server', 'countries',
  function (media, $window, $http, server, countries) {
    this.mediaList = media;
    this.countries = countries;
    var self = this;

    this.addMedia = function (media) {
      self.media = media || {};
      self.showMediaForm = !self.showMediaForm;
      self.formError = false;
    };

    this.createOrUpdate = function () {
      var existingId = false;
      var media = {
        first: this.media.first,
        last: this.media.last,
        email: this.media.email,
        jobTitle: this.media.jobTitle,
        company: this.media.company,
        country: this.media.country,
        phone: this.media.phone,
        twitter: this.media.twitter,
        active: this.media.active !== undefined ? this.media.active: false
      };

      // is this an update of creation
      var query;
      if(this.media.objectId) {
        existingId = self.media.objectId;
        query = $http.put(server + '/classes/Media/' + this.media.objectId, media);
      }
      else {
        existingId = null;
        query = $http.post(server + '/classes/Media', media);
      }
      query
        .success(function (mediaObject) {
          // for a new object set the objectId
          media.objectId = existingId || mediaObject.objectId;
          if (!existingId) {
            //add a new media
            self.mediaList.push(media);
          }

          self.media = {};
          self.showMediaForm = false;
        })
        .error(function (err) {
          self.formError = true;
        });
    };

    this.toggleMedia = function (media) {
      var action = media.active ? 'delete ' : 'restore ';
      if($window.confirm('Are you sure you want to ' + action + media.first + '?')){
        this.media = media;
        this.media.active = !this.media.active;
        this.createOrUpdate();
      }
    }
  }])
  .controller('AdminEventSessionsCtrl', ['eventSessions', '$window', '$http', 'server', 'streams', 'locations', 'eventTimeZone', 'dataService', 'speakers',
  function (eventSessions, $window, $http, server, streams, locations, eventTimeZone, dataService, speakers) {
    this.eventSessions = eventSessions;
    this.streams = streams;
    this.locations = locations;
    this.speakers = speakers;
    this.eventTimeZone = eventTimeZone;
    var self = this;

    this.streamOption;
    this.locationOption;
    this.speakerOptions;
    this.startDate;
    this.endDate;

    // manage dates
    var offset = new Date().getTimezoneOffset();
    var eventTimeZoneMinutes = (eventTimeZone.substring(0,3) * 60) + (eventTimeZone.substring(3,5) * 1);
    var userTimeZoneOffset = offset - eventTimeZoneMinutes;
    var manageDates = function(date) {
      // UTC date
      var eventDate = date.getTime() + (userTimeZoneOffset * 60 * 1000);
      return {
        __type: 'Date',
        iso: new Date(eventDate).toISOString()
      };
    };

    // need to be able to add multiple speakers
    self.addNewSpeaker = function(speaker) {
      var id = self.selectedSpeakers.length;
      self.selectedSpeakers.push({objectId:id});
    };


    this.addEventSession = function (eventSession) {
      self.eventSession = eventSession || {};
      self.showEventSessionForm = !self.showEventSessionForm;
      self.formError = false;

      // create a separate stream copy
      if(eventSession && eventSession.stream) {
        self.streamOption = angular.copy(eventSession.stream);
      }

      // create a separate location copy
      if(eventSession && eventSession.location) {
        self.locationOption = angular.copy(eventSession.location);
      }

      // create a separate start date
      if(eventSession && eventSession.start) {
        self.startDate = new Date(eventSession.start.iso);
      }

      // create a separate end date
      if(eventSession && eventSession.end) {
        self.endDate = new Date(eventSession.end.iso);
      }

      // create a separate speakers copy
      self.speakerOptions = angular.copy(speakers);
      if (eventSession && eventSession.speakers && eventSession.speakers.length > 0) {
        self.selectedSpeakers = angular.copy(eventSession.speakers);
      }
      else {
        self.selectedSpeakers = [{objectId: 0}];
      }
    };

    this.createOrUpdate = function () {
      var existingId = false;
      var eventSession = {
        name: this.eventSession.name,
        description: this.eventSession.description,
        start: manageDates(this.startDate),
        end: manageDates(this.endDate),

        active: this.eventSession.active !== undefined ? this.eventSession.active: false
      };

      if (this.streamOption) {

        if (this.stream && this.stream.objectId) {
          eventSession.stream = {
            __type: 'Pointer',
            className: 'Stream',
            objectId: this.streamOption.objectId
          };
        }
        else {
          eventSession.stream = undefined;
        }
      }

      if (this.locationOption) {
        if (this.location && this.location.objectId) {
          eventSession.location = {
            __type: 'Pointer',
            className: 'Location',
            objectId: this.locationOption.objectId
          };
        }
        else {
          eventSession.location = undefined;
        }

      }

      if (this.selectedSpeakers) {
        eventSession.speakers = [];
        this.selectedSpeakers.forEach(function(speaker) {
          if (speaker.objectId && speaker.objectId.length > 4) {
            eventSession.speakers.push({
              __type: 'Pointer',
              className: 'Speaker',
              objectId: speaker.objectId
            });
          }
        });
      }

      // is this an update of creation
      var query;
      if(this.eventSession.objectId) {
        existingId = self.eventSession.objectId;
        query = $http.put(server + '/classes/EventSession/' + existingId, eventSession);
      }
      else {
        existingId = null;
        query = $http.post(server + '/classes/EventSession', eventSession);
      }
      query
        .success(function (eventSessionObject) {
          // for a new object set the objectId
          eventSession.objectId = existingId || eventSessionObject.objectId;

          // hydrate the pointers
           if (self.streamOption) {
            // set it to the stream value

            self.eventSession.stream = eventSession.stream = self.streams.filter(function (stream) {
              return stream.objectId === self.streamOption.objectId;
            })[0];
          }
          // check if the location is set?
          if (self.locationOption) {
            // set it to the location value

            self.eventSession.location = eventSession.location = self.locations.filter(function (location) {
              return location.objectId === self.locationOption.objectId;
            })[0];
          }
          // check if the speakers is set?
          if (self.selectedSpeakers) {
            // set it to the speakers value
            var speakerObjects = [];
            eventSession.speakers.forEach(function (speaker) {
              self.speakers.forEach(function (sp) {
                if (sp.objectId === speaker.objectId) {
                  speakerObjects.push(sp);
                }
              });
            });
            self.eventSession.speakers = eventSession.speakers = speakerObjects;
          }

          if (!existingId) {
            //add a new eventSession
            self.eventSessions.push(eventSession);
          }

          self.eventSession = {};
          self.showEventSessionForm = false;
          self.streamOption = undefined;
          self.locationOption = undefined;
          self.startDate = undefined;
          self.endDate = undefined;
          self.selectedSpeakers = undefined;
          self.speakerOptions = undefined;


        })
        .error(function (err) {
          self.formError = true;
        });
    };

    this.removeStream = function (session) {
      var action = session.stream ? 'delete ' : 'add ';
      if($window.confirm('Are you sure you want to ' + action + 'the Stream?')){
        $http.put(server + '/classes/EventSession/' + session.objectId, {
            stream: {
              __op: 'Delete'
            }
          })
          .success(function () {
            session.stream = undefined;
          })
          .error(function (err) {
            self.formError = true;
            console.log(err);
          })
      }
    }

    this.toggleEventSession = function (eventSession) {
      var action = eventSession.active ? 'delete ' : 'restore ';
      if($window.confirm('Are you sure you want to ' + action + eventSession.first + '?')){
        this.eventSession = eventSession;
        this.eventSession.active = !this.eventSession.active;
        this.createOrUpdate();
      }
    }
  }])

  .filter('partnerLevel', ['partnerLevels', function(partnerLevels) {
    return function(level) {
      return partnerLevels.filter(function(l) {
        return l.code === level;
      })[0].name;
    }
  }])

  .filter('speakerNames', [function() {
    return function(speakers) {
      if (!speakers) return '';
      var names = '';
      speakers.forEach(function(speaker, count) {
        names += speaker.first + ' '  + speaker.last;
        if (count > 0) names += ','
      });
      // remove the last comma
      if (names.slice(-1) === ',') {
        names = names.substring(0, names.length -1);
      }
      return names;
    }
  }]);
