angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider) {

  function authenticate($location, FlightService) {
  //  console.log("bin in auth");
    //console.log("token:" + FlightService.access_token);

    if(!angular.isDefined(FlightService.getToken())) {
      console.log("gehe zur startseite");
      $location.path("/menu/arrival");
    }
  }

  $stateProvider
      .state('flughafenAirport.abflug', {
    url: '/departures',
    views: {
      'menu': {
        templateUrl: 'templates/abflug_funky.html',
        controller: 'abflugCtrl',
        resolve: { authenticate: authenticate }
      }
    }
  })


  .state('flughafenAirport.ankunft', {
    url: '/arrival',
    views: {
      'menu': {
        templateUrl: 'templates/ankunft_funky.html',
        controller: 'ankunftCtrl',
        resolve: { authenticate: authenticate }
      }
    }
  })

  .state('flughafenAirport', {
    url: '/menu',
    templateUrl: 'templates/flughafenAirport.html',
    controller: 'flughafenAirportCtrl'
  })

  .state('flughafenAirport.fluginformation', {
    url: '/fight_info',
    views: {
      'menu': {
        templateUrl: 'templates/fluginformation.html',
        controller: 'fluginformationCtrl',
        resolve: { authenticate: authenticate }
      }
    }
  })

  .state('flughafenAirport.lounges', {
    url: '/lounges',
    views: {
      'menu': {
        templateUrl: 'templates/lounges.html',
        controller: 'loungesCtrl',
        resolve: { authenticate: authenticate }
      }
    }
  })

  .state('flughafenAirport.flughafenAuswHlen', {
    url: '/choose_airport',
    views: {
      'menu': {
        templateUrl: 'templates/flughafenAuswHlen.html',
        controller: 'flughafenAuswHlenCtrl',
        resolve: { authenticate: authenticate }
      }
    }
  })

  .state('flughafenAirport.verbindungSuchen', {
    url: '/findFlight',
    views: {
      'menu': {
        templateUrl: 'templates/verbindungSuchen.html',
        controller: 'verbindungSuchenCtrl',
        resolve: { authenticate: authenticate }
      }
    }
  })

$urlRouterProvider.otherwise('/menu/arrival')




});
