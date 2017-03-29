angular.module('app.services', [])

.factory('FlightService', function($http) {

  var access_token;
  var client_id = "ypmd2w7dmmbeecdekft2f5t7";
  var client_secret = "Zn3zKQdZbH";
  var currentAirport;

  var BASE_URL = "https://api.lufthansa.com/v1";

  // after receiving token, this is gonna be the new http.get header
  var auth_header;

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

        console.log("auth in service:");
        console.log(data);
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

    getAirport: function() {
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

    getNameByIATA: function(iata) {
      $http.get(BASE_URL + "/references/airlines/" + iata + "?limit=20&offset=0", auth_header).success(function(data) {
        console.log(data);

        console.log(data.AirlineResource.Airlines.Airline.Names.Name.$);
        alert(data.AirlineResource.Airlines.Airline.Names.Name.$);
        return data.AirlineResource.Airlines.Airline.Names.Name.$;

      }).catch(function(error) {
        console.log(error);
      })
    },

    getDepartures: function(from, datetime, limit) {
      console.log(from + "/" + datetime + "/" + limit);
      //https://api.lufthansa.com/v1/operations/flightstatus/departures/VIE/2017-03-27T21:08

      return $http.get(BASE_URL + "/operations/flightstatus/departures/" + from + "/" + datetime, auth_header);

    },

    getFlightSchedules: function(from, to, datetime, direct) {

      $http.get(BASE_URL + "/operations/schedules/" + from + "/" + to + "/" + datetime + "?directFlights=" + direct, auth_header).success(function(data) {
        console.log(data);

        return data;

      }).catch(function(error) {
        console.log(error);
      });


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