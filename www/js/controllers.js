angular.module('app.controllers', [])

.filter("getAirline", function($http,FlightService){
   return function(input){

    return FlightService.getAirlineByID(input).Airline;
   // return "bla";
 }
})

.filter("getAirportName", function($http, FlightService) {
    return function(input){
  //    console.log(FlightService.getCityByCode(input)[0]);
      return FlightService.getCityByCode(input)[0].name;
  }
})

.filter("getCountryNameByISO", function($http, FlightService) {
  return function(input) {
    console.log(FlightService.getCountryByISO(input));
    return FlightService.getCountryByISO(input).Name;
  }
})

.filter("getCountryNameByIATA", function($http, FlightService) {
  return function(input) {
    //console.log(FlightService.getCountryIsoByIATA(input));
    return FlightService.getCountryIsoByIATA(input)[0].Name;
  }
})

.filter("getCountryCodeByIATA", function($http, FlightService) {
  return function(input) {
    console.log(FlightService.getCountryIsoByIATA(input));
    return FlightService.getCountryIsoByIATA(input)[0].Code;
  }
})

.filter("formatDate", function($filter) {
  return function(date) {
    return $filter('date')(date, "dd.MM.yyyy HH:mm"); //yyyy-MM-ddTHH:mm"
  }
})

.controller('abflugCtrl', ['$scope', '$stateParams', '$filter', 'FlightService', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, $filter, FlightService) {

  function loadDepartures() {
    var date = new Date();

    FlightService.getDepartures(FlightService.getAirport(), $filter('date')(date, "yyyy-MM-ddTHH:mm"), 50).success(function(data) {
      console.log(data);
      $scope.flights = data.FlightStatusResource.Flights.Flight;
    });
  }

  loadDepartures();


  $scope.refreshDeparture = function() {
    loadDepartures();
    $scope.$broadcast('scroll.refreshComplete');
  }

}])

.controller('ankunftCtrl', ['$scope', '$stateParams', '$filter', '$ionicLoading', '$ionicFilterBar', 'FlightService', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, $filter, $ionicLoading, $ionicFilterBar, FlightService) {

  $ionicLoading.show({
   template: 'Bitte warten...'
  });

 FlightService.auth().success(function(data) {
   FlightService.setAirport("VIE");
   $ionicLoading.hide();

   loadArrivals();

 });

  function loadArrivals() {
     var date = new Date();

     FlightService.getArrivals(FlightService.getAirport(), $filter('date')(date, "yyyy-MM-ddTHH:mm")).success(function(data) {
         $scope.flights = data.FlightStatusResource.Flights.Flight;
         $scope.$broadcast('scroll.refreshComplete');

         console.log($scope.flights);
     });
     $ionicLoading.hide();

   }

   // prepared for later
   /*$scope.showFilterBar = function () {
     console.log($scope.flights);
     filterBarInstance = $ionicFilterBar.show({
       items: $scope.flights,
       filterProperties: [''], //restaurant Name
       update: function (filteredItems, filterText) {
         $scope.flights = filteredItems;
         if (filterText) {
           console.log(filterText);
         }
       }
     });
   };*/

  $scope.refreshArrival = function() {
    loadArrivals();
  }
}])

.controller('flughafenAirportCtrl', ['$scope', '$stateParams', '$ionicLoading', 'FlightService', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, $ionicLoading, FlightService) {


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
