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
    'ngSanitize',
    'ui.router',
    'ui.router.title',
    'uiGmapgoogle-maps',
    'angularLoad',

    'templates-main',

    'genericServices',
    'conferenceDirectives',
    'config',

    'user',
    'admin'
  ])
  // .config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
  .config(['$stateProvider', '$urlRouterProvider', 'uiGmapGoogleMapApiProvider', '$uiViewScrollProvider',
    function ($stateProvider, $urlRouterProvider, uiGmapGoogleMapApiProvider,$uiViewScrollProvider) {
    uiGmapGoogleMapApiProvider.configure({
      key: 'AIzaSyCTXMd0kGPwANDXeUPXQSdLS-C9dWbkJC0',
      v: '3.17',
      // libraries: 'weather,geometry,visualization'
    });
    // $locationProvider.html5Mode(true)
    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: 'views/main.html',
        controller: 'MainCtrl as main',
        resolve: {
          $title: function () { return 'Home'; },
          speakers: ['dataService', function (dataService) {
            return dataService.getClassName('Speaker', ['where={"active": true}']);
          }] ,
          partners: ['dataService', function (dataService) {
            return dataService.getClassName('Sponsor', ['include=stream&where={"active": true}']);
          }],
          streams: ['dataService', function (dataService) {
            return dataService.getClassName('Stream', ['order:order&where={"active": true}']);
          }],
          sessions: ['dataService', function (dataService) {
            return dataService.getClassName('EventSession',  ['include=stream,speakers,location&where={"active": true}']);
          }],
          news: ['$http', '$location', function ($http, $location) {
            var options = {
              responseType: 'json',
              'Content-Type': 'application/json'
            }
            return $http.jsonp('https://ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=4&q=http%3A%2F%2Fblog.exportleadership.com%2Frss%2Findex.xml&callback=JSON_CALLBACK');
          }]
        }
      })
//       .state('speakers', {
//         url: '/speakers',
//         controller: 'SpeakerController as main',
//         templateUrl: 'views/speakers.html',
//         resolve: {
//           $title: function () { return 'Speakers'; },
//           speakers: ['dataService', function (dataService) {
//             return dataService.getClassName('Speaker', ['where={"active": true}']);
//           }]
//         }
//       })
//       .state('streams', {
//         url: '/streams',
//         controller: 'StreamController as main',
//         templateUrl: 'views/streams.html',
//         resolve: {
//           $title: function () { return 'Streams'; },
//           streams: ['dataService', function (dataService) {
//             return dataService.getClassName('Stream', ['where={"active": true}']);
//           }]
//         }
//       })
//       .state('partners', {
//         url: '/partners',
//         controller: 'PartnerController as main',
//         templateUrl: 'views/partners.html',
//         resolve: {
//           $title: function () { return 'Partners'; },
//           partners: ['dataService', function (dataService) {
//             return dataService.getClassName('Sponsor', ['include=stream&where={"active": true}']);
//           }]
//         }
//       })

//       .state('venue', {
//         url: '/venue',
//         controller: 'VenueController as main',
//         templateUrl: 'views/venue.html',
//         resolve: {
//           $title: function () { return 'Venue'; },
//         }
//       })
      .state('contact', {
        url: '/contact',
        controller: 'ContactController as contact',
        templateUrl: 'views/contact.html',
        resolve: {
          $title: function () { return 'Contact Us'; },
        }
      })
      .state('terms', {
        url: '/terms',
        templateUrl: 'views/terms.html',
        resolve: {
          $title: function () { return 'Terms and Conditions'; },
        }
      })
      .state('anti-harassment-policy', {
        url: '/anti-harassment-policy',
        templateUrl: 'views/anti-harassment.html',
        resolve: {
          $title: function () { return 'Anti-Harassment Policy'; },
        }
      })
      .state('faq', {
        url: '/faq',
        templateUrl: 'views/faq.html',
        resolve: {
          $title: function () { return 'FAQ'; },
        }
      })
      .state('media', {
        url: '/media',
        controller: 'MediaController as media',
        templateUrl: 'views/media.html',
        resolve: {
          $title: function () { return 'Media'; },
        }
      })
//       .state('tickets', {
//         url: '/tickets',
//         controller: 'TicketsController as tickets',
//         templateUrl: 'views/tickets.html',
//         resolve: {
//           $title: function () { return 'Tickets'; },
//         }
//       })

      // TODO
//       .state('speaker', {
//         url: '/speaker/:id',
//         templateUrl: 'views/speaker.html'
//       })
      // TODO - do we have a separate page for each partner?
//       .state('partner', {
//         url: '/partner/:id',
//         controller: 'PartnerController as main',
//         templateUrl: 'views/partner.html'
//       })
      // TODO: Agenda
      .state('agenda', {
        url: '/agenda',
        controller: 'AgendaController as agenda',
        templateUrl: 'views/agenda.html',
        resolve: {
          $title: function () { return 'Agenda'; },
          sessions: ['dataService', function (dataService) {
            return dataService.getClassName('EventSession',  ['include=speakers,stream,location&where={"active": true}&order=start']);
          }],
        }
      })

      // For any unmatched url, redirect to /
      $urlRouterProvider.otherwise('/');

//       $uiViewScrollProvider.useAnchorScroll();
  }])

  .run(['$rootScope', '$state', '$stateParams', 'userService', '$window', '$location', '$anchorScroll',
    function($rootScope, $state, $stateParams, userService, $window, $location, $anchorScroll) {
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;

    // check for correct priviledges
    $rootScope.$on('$stateChangeStart', function(event, toState, toStateParams) {
      if(toState.name === 'home') {
        $rootScope.navClass = 'top';
      }
      else $rootScope.navClass = 'notTop';
//       $anchorScroll();

      // track the state the user wants to go to; authorization service needs this
      $rootScope.toState = toState;
      $rootScope.toStateParams = toStateParams;
      // if the principal is resolved, do an authorization check immediately. otherwise,
      // it'll be done when the state it resolved.

      userService.authorize(event);
    });

    // google analytics
    $rootScope.$on('$stateChangeSuccess',
      function(event){
        if (!$window.ga)
          return;

        $window.ga('send', 'pageview', { page: $location.path() });
      });
  }])
  .controller('AppCtrl', ['$window', '$scope', '$state', '$rootScope', '$location', 
    function ($window, $scope, $state, $rootScope, $location) {
     this.isCollapsed = true;
     var self = this;
     angular.element($window).bind('scroll', function() {
       if(window.pageYOffset >= 100) {
         $rootScope.navClass = 'notTop';
         $location.hash();
       } else if($state.current.name === 'home') {
         $rootScope.navClass = 'top';
       }
       $scope.$apply();
     });


  }])
  .controller('MainCtrl', ['uiGmapGoogleMapApi', 'speakers', 'partners', '$filter', 'streams', 'mapDetails', 'sessions', 'news',
    function ( uiGmapGoogleMapApi, speakers, partners, $filter, streams, mapDetails, sessions, news) {

      var self = this;
      this.speakers = speakers;
      this.streams = streams;
      this.news = news.data.responseData.feed.entries;

      var filterPartners = function (level) {
        return $filter('filter')(partners, {level: level});
      };
      this.partners = {
        platinum: filterPartners(1),
        gold: filterPartners(2)
      };

      // maps
      self.map = {};
      uiGmapGoogleMapApi.then(function() {
        self.map = mapDetails.map;

        self.marker = mapDetails.crokeParkLocation;
      });
  }])
  .controller('SpeakerController', ['speakers', function (speakers) {
    this.speakers = speakers;
  }])
  .controller('StreamController', ['streams', function (streams) {
    this.streams = streams;
  }])
  .controller('TicketsController', ['angularLoad', function (angularLoad) {
    angularLoad.loadScript('https://js.tito.io/v1')
  }])
  .controller('AgendaController', ['sessions', 'eventTimeZone', '$filter', function (sessions, eventTimeZone, $filter) {
    var self = this;
    this.eventTimeZone = eventTimeZone;

    // sort the sessions by time
    this.sessions = {};
    this.times = {};
    this.days = [];
    var timesIndex = {};
    sessions.forEach(function (session) {
      if (session.start && session.start.iso) {
        var dayString = $filter('date')(new Date(session.start.iso), 'EEE d MMM y', eventTimeZone);
        var dayIndex = Object.keys(timesIndex).indexOf(dayString);
        if (dayIndex === -1) {
          timesIndex[dayString] = {};
          self.days.push(dayString);
          self.sessions[dayString] = [];
          self.times[dayString] = [];
        }

        var index = Object.keys(timesIndex[dayString]).indexOf(session.start.iso);
        if (index === -1) {
          timesIndex[dayString][session.start.iso] = timesIndex[dayString].length;
          self.sessions[dayString].push([session]);
          self.times[dayString].push(session.start.iso);          
        }
        else {
          self.sessions[dayString][index].push(session);
        }
      }
    });

    // we need to order the sessions in each sessions
    this.days.forEach(function (day) {
      self.sessions[day].forEach(function (time) {
        if (time.length > 1) {
          //sort the array on the stream.order value
          time = time.sort(function (a, b) {
            return a.stream.order - b.stream.order;
          });
        }
      });
    });

    var visibleHeaders = {};
    this.showStreamName = function (day, stream) {
      if (Object.keys(visibleHeaders).indexOf(day) === -1) {
        visibleHeaders[day] = {};
      }

      // does the stream exist
      if (!visibleHeaders[day][stream] && stream) {
        visibleHeaders[day][stream] = true;
        return true;
      }
      else return false;
    }
  }])
  .controller('PartnerController', ['partners', '$filter', function (partners, $filter) {
    var filterPartners = function (level) {
      return $filter('filter')(partners, {level: level});
    };
    this.partners = {
      platinum: filterPartners(1),
      gold: filterPartners(2)
    };
  }])
  .controller('VenueController', ['uiGmapGoogleMapApi', 'mapDetails', function (uiGmapGoogleMapApi, mapDetails) {
    // maps
    var self = this;
    self.map = {};
    uiGmapGoogleMapApi.then(function() {
      self.map = mapDetails.map;

      self.marker = mapDetails.crokeParkLocation;
    });
  }])
  .controller('ContactController', ['$http', 'server', function ($http, server) {
    var self = this;
    this.showForm = true;
    this.formError = false;
    this.processing = false;

    this.zipRegex = /(?!.*)/;
    this.sendContact = function () {
      self.processing = true;
      // validate the form
      this.contactForm.subject = 'Website Form';
      $http.post(server + '/functions/contact', this.contactForm)
        .success(function () {
          self.showForm = false;
          self.processing = false;
        })
        .error(function (err) {
          console.log(err);
          self.formError = true;
          self.processing = false;
        });
    };
  }])
  .controller('MediaController', ['$http', 'server', 'countries', function ($http, server, countries) {
    var self = this;
    this.countries = countries;
    this.showForm = true;
    this.formError = false;
    this.processing = false;

    this.zipRegex = /(?!.*)/;
    this.sendMedia = function () {
      //validate the form
      if(!self.mediaForm.first || !self.mediaForm.last || !self.mediaForm.email || !self.mediaForm.jobTitle || !self.mediaForm.country || !self.mediaForm.phone) {
        self.formError = true;
      }
      else {
        self.processing = true;

        var media = {
          first: self.mediaForm.first,
          last: self.mediaForm.last,
          email: self.mediaForm.email,
          jobTitle: self.mediaForm.jobTitle,
          company: self.mediaForm.company,
          country: self.mediaForm.country.code,
          twitter: self.mediaForm.twitter,
          phone: self.mediaForm.phone,
          active: true
        };
        // save the media request
        $http.post(server + '/classes/Media', media)
          .success(function () {
            // send an email
            var email = {
              subject: 'Media Request',
              message: '<h1>New Media Request</h1>' +
                '<h3>Job Title:</h3> ' + media.jobTitle +
                '<h3>Company:</h3> ' + media.company +
                '<h3>Country:</h3> ' + media.country +
                '<h3>Email:</h3> ' + media.email +
                '<h3>Twitter:</h3> ' + media.twitter +
                '<h3>Phone:</h3> ' + media.phone,
              email: media.email,
              name: media.first + ' ' + media.last
            };


            $http.post(server + '/functions/contact', email)
              .success(function () {
                self.showForm = false;
                self.processing = false;
              })
              .error(function (err) {
                console.log(err);
                self.formError = true;
                self.processing = false;
              });
          })
          .error(function (err) {
            console.log(err);
            self.formError = true;
            self.processing = false;
          });
      }
    };
  }])
  .filter('filterArray', [function () {
    return function (arr, field, unique) {
      var results = [];
      if (arr) {
        arr.forEach(function (item) {
          var resultItem = item[field];

          if (results.indexOf(resultItem) === -1 || !unique) {
            results.push(resultItem);
          }
        });

        return results
      }
      else {
        return;
      }
      
    }
  }]);
