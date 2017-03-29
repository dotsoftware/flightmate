angular.module('app.controllers', [])

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

    FlightService.setAirport("VIE");

    var date = new Date();
    console.log(date);
    console.log(date | 'yyyy-MM-ddTHH:mm');
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
