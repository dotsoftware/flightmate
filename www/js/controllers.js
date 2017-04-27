angular.module('app.controllers', [])

.filter("getAirline", function($http,FlightService){
   return function(input){
     if(input==null) return null;
    return FlightService.getAirlineByID(input).Airline;
   // return "bla";
 }
})

.filter("getAirportName", function($http, FlightService) {
    return function(input){
  //    console.log(FlightService.getCityByCode(input)[0]);
      if(input==null) return null;
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

    FlightService.getDepartures(FlightService.getCurrentAirport(), $filter('date')(date, "yyyy-MM-ddTHH:mm"), 50).success(function(data) {
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

     FlightService.getArrivals(FlightService.getCurrentAirport(), $filter('date')(date, "yyyy-MM-ddTHH:mm")).success(function(data) {
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

  $scope.$on('$ionicView.enter', function () {

    $scope.airport = FlightService.getCurrentAirport();

  });
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
  FlightService.getLounges(FlightService.getCurrentAirport()).success(function(data) {
      console.log(data);
      $scope.lounges = data.LoungeResource.Lounges.Lounge;
  });

}])

.controller('flughafenAuswHlenCtrl', ['$scope', '$stateParams', '$ionicPopup', 'FlightService', 'geoProvider', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, $ionicPopup, FlightService, geoProvider) {

  $scope.searchField = {};

  $scope.selectAirport = function(which) {
    // select airport
    FlightService.setAirport(which);

    var alertPopup = $ionicPopup.alert({
     title: 'Flughafen ' + which + ' ausgwählt'
   });

   alertPopup.then(function(res) {
     // redirect somewhere

   });
  }


  // load closest airports
  FlightService.getClosestAirport(48.241284, 16.303782).success(function(data) {
      console.log(data);
      $scope.airports = data.NearestAirportResource.Airports.Airport;
  });





  $scope.onSearchChanged = function() {
    console.log($scope.searchField.search);
    FlightService.getAllAirports().success(function(data) {
    //  $scope.airports = "";
    })
  }


}])

.controller('verbindungSuchenCtrl', ['$scope', '$stateParams', 'ionicDatePicker', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, ionicDatePicker) {

  var ipObj1 = {
     callback: function (val) {  //Mandatory
       console.log('Return value from the datepicker popup is : ' + val, new Date(val));
     },
     disabledDates: [            //Optional
       new Date(2016, 2, 16),
       new Date(2015, 3, 16),
       new Date(2015, 4, 16),
       new Date(2015, 5, 16),
       new Date('Wednesday, August 12, 2015'),
       new Date("08-16-2016"),
       new Date(1439676000000)
     ],
     from: new Date(2012, 1, 1), //Optional
     to: new Date(2016, 10, 30), //Optional
     inputDate: new Date(),      //Optional
     mondayFirst: true,          //Optional
     disableWeekdays: [0],       //Optional
     closeOnSelect: false,       //Optional
     templateType: 'modal'       //Optional
   };

   $scope.openDatePicker = function(){
     ionicDatePicker.openDatePicker(ipObj1);
   };


}])
