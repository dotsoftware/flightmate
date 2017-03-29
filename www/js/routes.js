angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider



      .state('flughafenAirport.abflug', {
    url: '/departures',
    views: {
      'side-menu21': {
        templateUrl: 'templates/abflug.html',
        controller: 'abflugCtrl'
      }
    }
  })

  .state('flughafenAirport.ankunft', {
    url: '/arrival',
    views: {
      'side-menu21': {
        templateUrl: 'templates/ankunft.html',
        controller: 'ankunftCtrl'
      }
    }
  })

  .state('flughafenAirport', {
    url: '/side-menu21',
    templateUrl: 'templates/flughafenAirport.html',
    controller: 'flughafenAirportCtrl'
  })

  .state('flughafenAirport.fluginformation', {
    url: '/fight_info',
    views: {
      'side-menu21': {
        templateUrl: 'templates/fluginformation.html',
        controller: 'fluginformationCtrl'
      }
    }
  })

  .state('flughafenAirport.lounges', {
    url: '/lounges',
    views: {
      'side-menu21': {
        templateUrl: 'templates/lounges.html',
        controller: 'loungesCtrl'
      }
    }
  })

  .state('flughafenAirport.flughafenAuswHlen', {
    url: '/choose_airport',
    views: {
      'side-menu21': {
        templateUrl: 'templates/flughafenAuswHlen.html',
        controller: 'flughafenAuswHlenCtrl'
      }
    }
  })

  .state('flughafenAirport.verbindungSuchen', {
    url: '/findFlight',
    views: {
      'side-menu21': {
        templateUrl: 'templates/verbindungSuchen.html',
        controller: 'verbindungSuchenCtrl'
      }
    }
  })

$urlRouterProvider.otherwise('/side-menu21/arrival')



});
