angular.module('app.controllers', [])

.filter("getAirline", function($http,FlightService){
   return function(input){

           return FlightService.getAirlineByID(input).Airline;

    /*

     $http.get("airline.json").success(function(data) {
       console.log(data[input][0].Airline);
       this.res = data[input][0].Airline;
     })
     .error(function(err) {
       console.log(err.message);
       return err.message;
     });

     console.log(this.res);
     return res;
   }*/
   return "bla";
 }
})

.controller('abflugCtrl', ['$scope', '$stateParams', '$filter', 'FlightService', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, $filter, FlightService) {
  var date = new Date();

  FlightService.getDepartures(FlightService.getAirport(), $filter('date')(date, "yyyy-MM-ddTHH:mm"), 50).success(function(data) {
    console.log(data);
    $scope.flights = data.FlightStatusResource.Flights.Flight;
  })
}])

.controller('ankunftCtrl', ['$scope', '$stateParams', '$filter', 'FlightService', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, $filter, FlightService) {

  FlightService.auth().success(function(data) {

    /*FlightService.getAirlineByID("OS").success(function(data) {
      console.log(data);
    })
    .error(function(error) {
      console.log(error);
    });*/

    FlightService.setAirport("VIE");

    var date = new Date();

    console.log($filter('date')(date, "yyyy-MM-ddTHH:mm"));

    FlightService.getArrivals(FlightService.getAirport(), $filter('date')(date, "yyyy-MM-ddTHH:mm")).success(function(data) {
        console.log(data);
        $scope.flights = data.FlightStatusResource.Flights.Flight;
    });
  });


  $scope.reload = function() {
    FlightService.getArrivals("VIE" ,"2017-03-24T21:13").success(function(data) {

      $scope.flights = data.FlightStatusResource.Flights.Flight;

      console.log(data);
    })
    .catch(function(error) {
      console.log(error);
    });
  }



}])

.controller('flughafenAirportCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams) {


}])

.controller('fluginformationCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams) {


}])

.controller('loungesCtrl', ['$scope', '$stateParams', 'FlightService', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, FlightService) {
  FlightService.getLounges(FlightService.getAirport()).success(function(data) {
      console.log(data);
      $scope.lounges = data.LoungeResource.Lounges.Lounge;
  });

}])

.controller('flughafenAuswHlenCtrl', ['$scope', '$stateParams', 'FlightService', 'geoProvider', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, FlightService, geoProvider) {

  $scope.searchField = {};

  $scope.selectAirport = function(which) {
    // select airport
    FlightService.setAirport(which);
  }

  FlightService.auth().success(function(data) {


    FlightService.getClosestAirport(48.241284, 16.303782).success(function(data) {
        console.log(data);
        $scope.airports = data.NearestAirportResource.Airports.Airport;
    });
  });




  $scope.onSearchChanged = function() {
    console.log($scope.searchField.search);
    FlightService.getAllAirports().success(function(data) {
      $scope.airports = "";
    })
  }


}])

.controller('verbindungSuchenCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams) {


}])
