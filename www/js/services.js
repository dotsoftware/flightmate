angular.module('app.services', [])

.factory('authInterceptor', function ($rootScope, $q, $window, FlightService) {
  return {
    request: function (config) {
      config.headers = config.headers || {};
      if ($window.sessionStorage.token) {
        config.headers.Authorization = 'Bearer ' + $window.sessionStorage.token;
      }
      return config;
    },
    response: function (response) {
      if (response.status === 401) {
        console.log("reauthenticating");

        FlightService.auth().success(function(data) {
          return deferred.promise.then(function() {
              return $http(response.config);
          });
        });
      }
      return response || $q.when(response);
    }
  };
})

.factory('FlightService', function($http, $window) {

  var access_token;
  var client_id = "ypmd2w7dmmbeecdekft2f5t7";
  var client_secret = "Zn3zKQdZbH";
  var currentAirport = "VIE";

  // preloaded data
  var airlines;
  var airports;
  var iso_countries;

  var BASE_URL = "https://api.lufthansa.com/v1";

  // after receiving token, this is gonna be the new http.get header
  var auth_header;

  // load local json Airline names
  function loadAirlines() {
    console.log("lade airlines");
    $http.get("airline.json").success(function(data) {
      airlines = data;
    });
  }

  //load local json IATA Codes
  function loadCityNames() {

    $http.get("airports.json").success(function(data) {
      airports = data;

    });
  }

  function loadCountriesIso() {
    $http.get("iso_countries.json").success(function(data) {
      iso_countries = data;
    });
  }

  loadAirlines();
  loadCityNames();
  loadCountriesIso();

  // reauthenticate if no token available
  function reAuth() {
    var config = {
         headers : {
             'Content-Type': 'application/x-www-form-urlencoded'
         }
       };

    var data = "client_id=" + encodeURIComponent(client_id) + "&client_secret=" + encodeURIComponent(client_secret) + "&grant_type=client_credentials";
   //$http.post("https://api.lufthansa.com/v1/oauth/token", data, config).success(function(data, status) {
    return $http.post(BASE_URL + "/oauth/token", data, config);
  }

  var FlightService = {
    // https://api.lufthansa.com/v1/operations/flightstatus/OS351/2017-03-22

    // Build a request
    // https://{hostname} /{version} /{area} /{root resource name} [/{resource key}]  [/{sub-resource name} [/{sub-resource key}]* ][?{option_key}={option_value}]


    getToken: function() {
      return access_token;
    },

    getCurrentAirport: function() {
      return current_airport;
    },

    auth: function() {

     var config = {
      headers : {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      };

     var data = "client_id=" + encodeURIComponent(client_id) + "&client_secret=" + encodeURIComponent(client_secret) + "&grant_type=client_credentials";

     return $http.post(BASE_URL + "/oauth/token", data, config).success(function(data) {
        access_token = data.access_token;

        auth_header =  {
             headers : {
                'Authorization': 'Bearer ' + access_token,
                'Content-Type': 'application/x-www-form-urlencoded'
             }
           };

        $window.sessionStorage.token = data.access_token;
     })
     .error(function(err) {
         console.log(err);
         return false;
         //$scope.hello = err;
     });

    },

    getToken: function() {
      return access_token;
    },

    setAirport: function(which) {
      this.currentAirport = which;

    },

    getCurrentAirport: function() {
      if(!this.currentAirport) this.currentAirport = "VIE";
      return this.currentAirport;
    },

    getFlightStatus: function(flightNumber, date) {
      return $http.get(BASE_URL + "/operations/flightstatus/" + flightNumber + "/" + date, auth_header);
    },

    getArrivals: function(airport, datetime) {
      return $http.get(BASE_URL + "/operations/flightstatus/arrivals/" + airport + "/" + datetime, auth_header);

    },

    getAllAirports: function (limit) {
      //https://api.lufthansa.com/v1/references/airports/?limit=20&offset=0&LHoperated=0
      if(access_token.length == 0) reAuth().success(function(data) {
        getAllAirports();
      });
      else return $http.get(BASE_URL + "/references/airports/?limit=20&offset=0&LHoperated=0", auth_header);
    },

    getClosestAirport: function(lat, lng) {
      return $http.get(BASE_URL + "/references/airports/nearest/" + lat + "," + lng, auth_header);

    },

    getAirlineByID: function(id) {

      return airlines[id][0];
    },

    getCityByCode: function(code) {
      return airports.filter(
        function(airports) { return airports.iata == code });
    },

    getCountryByISO: function(iso) {
      return iso_countries.filter(
        function(airports) { return airports.iso == iso });
    },

    getCountryIsoByIATA: function(airport) {
      var airport_iso;

      airport_iso = airports.filter(
        function(airports) { return airports.iata == airport })[0].iso;

        return iso_countries.filter(
          function(iso_countries) {
            // console.log(iso_countries.Code + " -> " + airport_iso);
            return iso_countries.Code == airport_iso;
         });

    },

    getDepartures: function(from, datetime, limit) {
      return $http.get(BASE_URL + "/operations/flightstatus/departures/" + from + "/" + datetime, auth_header);

    },

    getFlightSchedules: function(from, to, datetime, direct) {

      return $http.get(BASE_URL + "/operations/schedules/" + from + "/" + to + "/" + datetime + "?directFlights=" + direct, auth_header);

    },

    getLounges: function(airport) {
      return $http.get(BASE_URL + "/offers/lounges/" + airport, auth_header);
    }
  }

  return FlightService;
})

.factory('geoProvider', function($ionicPopup) {
  var currentLat = 0;
  var currentLon = 0;

  var currentLatLng;
  var watchID = 0;

  var deg2rad = function (x) {
      return x * Math.PI / 180;
  }

  function startWatcher() {
    var watchID = navigator.geolocation.watchPosition(onSuccess, onError, { timeout: 30000 });

    function onSuccess(position) {
      currentLat = position.coords.latitude;
      currentLon = position.coords.longitude;

      console.log("Position changed: " + currentLat + ":" + currentLon);
    }
  }

  function onError(error) {
    var msg = "Zugriff auf Standort nicht möglich: ";

    switch(error.code) {
      case error.PERMISSION_DENIED:
          msg += "Berechtigung für Standortzugriff wurde untersagt."
          break;
      case error.POSITION_UNAVAILABLE:
          msg += "Es liegen keine Standortpositionen vor. Bitte Sichtkontakt mit Satelliten herstellen oder Mobilfunknetz aktivieren."
          break;
      case error.TIMEOUT:
          msg +="Zeitüberschreitung bei Standortabfrage."
          break;
      case error.UNKNOWN_ERROR:
          msg +=" Es ist ein unbekannter Fehler aufgetreten."
          break;

          alert(msg);
    }
  }

  function stopWatcher() {
    navigator.geolocation.clearWatch(watchID);
  }
  function getLocation() {
    navigator.geolocation.getCurrentPosition(function(pos) {
          currentLat = pos.coords.latitude;
          currentLon = pos.coords.longitude;

          startWatcher();

        }, function(error) {
          console.log(error.code);
          if (error.code == error.PERMISSION_DENIED) {

            var gpsPopup = $ionicPopup.show({
              title: 'Ortungseinstellung',
              template: 'Sicher, dass die Ortung deaktiviert werden soll? Der Großteil der App wird nicht funktionieren!',
              buttons: [{
                 text: 'Deaktivieren'
              }, {
                 text: '<b>Aktivieren</b>',
                 type: 'button-balanced',

                 onTap: function(e) {
                   getLocation();

                  }
              } ]
            });
          }

        });
  }

  return {

    getLocation: function() {
      console.log("geoprovider: bin in getLocation");
      getLocation();
    },
    getCurrentLat: function() {
      return currentLat;
    },
    getCurrentLon: function() {
      return currentLon;
    },
    setCurrentLatLon: function(lat,lng) {
      currentLat = lat;
      currentLon = lng;
    },
    calculateDistance: function (lat1, lon1, lat2, lon2) {
        var radius = 6371;

        var lat = deg2rad(lat2 - lat1);
        var lon = deg2rad(lon2- lon1);

        var a = Math.sin(lat / 2) * Math.sin(lat / 2) + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(lon / 2) * Math.sin(lon / 2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = radius * c;

        return (d*1000).toFixed(0);
    }
  }

})
