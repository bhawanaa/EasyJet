var demo = angular.module("demo", ["ngRoute"]);

demo.config(['$routeProvider', function ($routeProvider) {

    $routeProvider.

    when('/home', {

        templateUrl: 'Templates/Home.html',

        controller: 'HomeController'

    }).

    when('/flights', {

        templateUrl: 'Templates/Flights.html',

        controller: 'FlightsController',

    }).

    when('/flightDetails/:id/:ad/:ch/:in/:pay', {

        templateUrl: 'Templates/FlightDetails.html',

        controller: 'FlightDetailsController',

    })

    .otherwise({

        redirectTo: '/home',

    });

}]);

demo.factory('flightSvc', function ($http) {

    var flightSvc = {

        async: function () {

            var promise = $http.get('http://ejtestbed.herokuapp.com/flights').then(function (response) {

                console.log(response.data);

                return response.data;

            });

            return promise;

        }

    };

    return flightSvc;

});



demo.factory('dateSvc', function ($http) {

    var dateString2Date = function (dateString) {

        var dt = dateString.split(/\-|\s/);

        return new Date(dt.slice(0, 3).reverse().join('-') + ' ' + dt[3]);

    }

    return flightSvc;

});





demo.controller('HomeController', function ($scope) {

});

demo.controller('FlightDetailsController', function ($scope, flightSvc, $routeParams) {

    flightSvc.async().then(function (flights) {

        $scope.flights = flights;

        $scope.searchId = $routeParams.id;

        $scope.adultCount = $routeParams.ad;

        $scope.childCount = $routeParams.ch;

        $scope.infantCount = $routeParams.in;

        $scope.paymentType = $routeParams.pay;

        
        $scope.price;

        $scope.totalPrice = function () {
            console.log("inside function");
            var index;
            for (i = 0; i < $scope.flights.length; i++) {
                index = $scope.flights[i].id.indexOf($scope.searchId);
                if (index != -1) {
                    console.log(($scope.adultCount * $scope.flights[i].prices.adult.value));
                    console.log(($scope.childCount * $scope.flights[i].prices.child.value));
                    if ($scope.paymentType == "Normal")
                        $scope.price = ($scope.adultCount * $scope.flights[i].prices.adult.value) + ($scope.childCount * $scope.flights[i].prices.child.value) + (($scope.flights[i].prices.infant == undefined) ? 0 :($scope.infantCount * $scope.flights[i].prices.infant.value))
                    else if ($scope.paymentType == "Debit")
                        $scope.price = ($scope.adultCount * $scope.flights[i].prices.adult.valueWithDebitCard) + ($scope.childCount * $scope.flights[i].prices.child.valueWithDebitCard) + (($scope.flights[i].prices.infant == undefined) ? 0 : ($scope.infantCount * $scope.flights[i].prices.infant.valueWithDebitCard))
                    else if ($scope.paymentType == "Credit")
                        $scope.price = ($scope.adultCount * $scope.flights[i].prices.adult.valueWithCreditCard) + ($scope.childCount * $scope.flights[i].prices.child.valueWithCreditCard) + (($scope.flights[i].prices.infant == undefined) ? 0 : ($scope.infantCount * $scope.flights[i].prices.infant.valueWithCreditCard))
                    index = -1;
                    break;
                }
            }
            console.log("index=" + index);
            console.log("outside for");
            
            /*index = -1;
            if (index != -1) {
                if ($scope.paymentType == "Normal")
                    $scope.price = ($scope.adultCount * $scope.flights[index].prices.adult.value) + ($scope.childCount * $scope.flights[index].prices.child.value) + ($scope.infantCount * $scope.flights[index].prices.infant.value)
                else if ($scope.paymentType == "Debit")
                    $scope.price = ($scope.adultCount * $scope.flights[index].prices.adult.valueWithDebitCard) + ($scope.childCount * $scope.flights[index].prices.child.valueWithDebitCard) + ($scope.infantCount * $scope.flights[index].prices.infant.valueWithDebitCard)
                else if ($scope.paymentType == "Credit")
                    $scope.price = ($scope.adultCount * $scope.flights[index].prices.adult.valueWithCreditCard) + ($scope.childCount * $scope.flights[index].prices.child.valueWithCreditCard) + ($scope.infantCount * $scope.flights[index].prices.infant.valueWithCreditCard)

            }*/

            console.log("price="+$scope.price)


        }();

    });

});





demo.controller('FlightsController', function ($scope, flightSvc) {

    flightSvc.async().then(function (flights) {

        $scope.flights = flights;

        console.log($scope.flights);

    });

    $scope.sortColumn;

    $scope.reverse = false;

    $scope.sortData = function (sortColumn) {

        $scope.sortColumn = sortColumn;

        $scope.reverse = ($scope.sortColumn == sortColumn) ? !$scope.reverse : false;

    }

    $scope.getClass = function (sortColumn) {

        if ($scope.sortColumn == sortColumn) {

            return $scope.reverse ? "arrow_down" : "arrow_up";

        }

        return '';

    }

    $scope.selectedArrivalDate;

    $scope.selectedDepartureDate;

    $scope.output = [];

    $scope.multipleSearch = function () {

        if ($scope.adultCount == undefined || 

            $scope.childCount == undefined ||

            $scope.infantCount == undefined ||

            $scope.paymentType == undefined) {
            return false;
        }

        $scope.output = [];

        console.log("inside button click");



        console.log($scope.selectedDepartureDate);

        console.log($scope.selectedArrivalDate);

        console.log($scope.selectedDeparture.departureAirport);

        console.log($scope.selectedArrival.arrivalAirport);



        console.log($scope.flights.length);



        for (i = 0; i < $scope.flights.length; i++) {

            var dateString = $scope.flights[i].localDepartureTime;

            console.log(dateString);

            var dt = dateString.split(/\-|\s/);

            var newDepDt = dt[2].substring(0, 2) + '/' + dt[1] + '/' + dt[0];



            var dateString = $scope.flights[i].localArrivalTime;

            var dt = dateString.split(/\-|\s/);

            var newArvDt = dt[2].substring(0, 2) + '/' + dt[1] + '/' + dt[0];



            if (

                ($scope.flights[i].arrivalAirport.toLowerCase().indexOf($scope.selectedArrival.arrivalAirport.toLowerCase()) != -1) &&

                ($scope.flights[i].departureAirport.toLowerCase().indexOf($scope.selectedDeparture.departureAirport.toLowerCase()) != -1) &&

                (newArvDt.indexOf($scope.selectedArrivalDate) != -1) &&

                (newDepDt.indexOf($scope.selectedDepartureDate) != -1)) {

                console.log($scope.flights[i].id);

                $scope.output.push($scope.flights[i]);

            }



        }

        console.log($scope.output);

        //return $scope.output;





        /* if ($scope.selectedDepartureDate != undefined) {
 
             var dateString = $scope.flights[0].localDepartureTime;
 
             console.log(dateString);
 
             var dt = dateString.split(/\-|\s/);
 
             var newDepDt = dt[2].substring(0, 2) + '/' + dt[1] + '/' + dt[0];
 
         }
 
  
 
         if ($scope.selectedArrivalDate != undefined) {
 
             var dateString = $scope.flights.localArrivalTime;
 
             var dt = dateString.split(/\-|\s/);
 
             var newArvDt = dt[2].substring(0, 2) + '/' + dt[1] + '/' + dt[0];
 
         }
 
  
 
         if (($scope.selectedDeparture != undefined) && ($scope.selectedArrival != undefined) && ($scope.selectedDepartureDate != undefined) && ($scope.selectedArrivalDate != undefined)) {
 
             if (
 
                 ($scope.flights.arrivalAirport.toLowerCase().indexOf($scope.selectedArrival.arrivalAirport.toLowerCase()) != -1) &&
 
                 ($scope.flights.departureAirport.toLowerCase().indexOf($scope.selectedDeparture.departureAirport.toLowerCase()) != -1) &&
 
                 (newArvDt.indexOf($scope.selectedArrivalDate) != -1) &&
 
                 (newDepDt.indexOf($scope.selectedDepartureDate) != -1)
 
                 ) {
 
                 return true;
 
             }*/

        /* $scope.multipleSearch = function (item) {

 //console.log("item" + item.departureAirport);







 /*console.log(newDt);

 console.log("selectd="+$scope.selectedDepartureDate);

 console.log("result=" + newDt.indexOf($scope.selectedDepartureDate) == -1)*/



        /* if ($scope.selectedArrival == undefined) {

             $scope.selectedArrival = 'tets'

             $scope.selectedArrival.arrivalAirport = 'test';

         }

         if ($scope.selectedDeparture == undefined) {

             $scope.selectedDeparture='test'

             $scope.selectedDeparture.departureAirport = 'test';

         }

         if ($scope.selectedArrivalDate == undefined)

             $scope.selectedArrivalDate = '';

         if ($scope.selectedDepartureDate == undefined)

             $scope.selectedDepartureDate = '';*/





        /*if ($scope.selectedArrival == undefined && $scope.selectedDeparture == undefined && $scope.selectedDepartureDate == undefined && $scope.selectedArrivalDate == undefined) {

            console.log("inside first if");

            return true;

            //return false;

        }

        



        else {





            if ($scope.selectedDepartureDate != undefined) {

                var dateString = item.localDepartureTime;

                var dt = dateString.split(/\-|\s/);

                var newDepDt = dt[2].substring(0, 2) + '/' + dt[1] + '/' + dt[0];

            }



            if ($scope.selectedArrivalDate != undefined) {

                var dateString = item.localArrivalTime;

                var dt = dateString.split(/\-|\s/);

                var newArvDt = dt[2].substring(0, 2) + '/' + dt[1] + '/' + dt[0];

            }



            if (($scope.selectedArrival != undefined) && ($scope.selectedDeparture == undefined) && ($scope.selectedDepartureDate == undefined) && ($scope.selectedArrivalDate == undefined)) {

                if ((item.arrivalAirport.toLowerCase().indexOf($scope.selectedArrival.arrivalAirport.toLowerCase()) != -1)) {

                    return true;

                }

            }



            else if (($scope.selectedDeparture != undefined) && ($scope.selectedArrival == undefined) && ($scope.selectedDepartureDate == undefined) && ($scope.selectedArrivalDate == undefined)) {

                if ((item.departureAirport.toLowerCase().indexOf($scope.selectedDeparture.departureAirport.toLowerCase()) != -1)) {

                    return true;

                }

            }



            else if (($scope.selectedDeparture == undefined) && ($scope.selectedArrival == undefined) && ($scope.selectedDepartureDate != undefined) && ($scope.selectedArrivalDate == undefined)) {

                if ((newDepDt.indexOf($scope.selectedDepartureDate) != -1)) {

                    return true;

                }

            }



            else if (($scope.selectedDeparture == undefined) && ($scope.selectedArrival == undefined) && ($scope.selectedDepartureDate == undefined) && ($scope.selectedArrivalDate != undefined)) {

                if ((newArvDt.indexOf($scope.selectedArrivalDate) != -1)) {

                    return true;

                }

            }



            else if (($scope.selectedDeparture != undefined) && ($scope.selectedArrival != undefined) && ($scope.selectedDepartureDate != undefined) && ($scope.selectedArrivalDate != undefined)) {

                if (

                    (item.arrivalAirport.toLowerCase().indexOf($scope.selectedArrival.arrivalAirport.toLowerCase()) != -1) &&

                    (item.departureAirport.toLowerCase().indexOf($scope.selectedDeparture.departureAirport.toLowerCase()) != -1) &&

                    (newArvDt.indexOf($scope.selectedArrivalDate) != -1) &&

                    (newDepDt.indexOf($scope.selectedDepartureDate) != -1)

                    ) {

                    return true;

                }

            }

            

            }



        /*else {

            if (item.departureAirport.toLowerCase().indexOf($scope.selectedDeparture.departureAirport.toLowerCase()) != -1 ||

            item.arrivalAirport.toLowerCase().indexOf($scope.selectedArrival.arrivalAirport.toLowerCase()) != -1) {

                //console.log("inside else");

                return true;

            }

        }*/



        //console.log("outise else")

        /*return false;

    }*/

        //}

    }

})

.filter('unique', function () {

    return function (collection, filterKey) {

        var output = [], keys = [];

        angular.forEach(collection, function (item) {

            var key = item[filterKey];

            if (keys.indexOf(key) == -1) {

                keys.push(key);

                output.push(item);

            }

        });

        //console.log(output);

        return output;

    };

})



.filter('dateFilter', function () {

    return function (arr, field) {

        var filtered = [];

        angular.forEach(arr, function (item) {

            //console.log("item:"+item.localDepartureTime);

            var dateString = item.localDepartureTime;

            var dt = dateString.split(/\-|\s/);

            var newDt = dt[2].substring(0, 2) + '/' + dt[1] + '/' + dt[0];

            //console.log(newDt);

            if ((newDt).indexOf(field) > -1)

                filtered.push(item);

        });

        //console.log(filtered);

        return filtered;

    }



})



.directive('mydatepicker', function () {

    return {

        restrict: 'A',

        require: 'ngModel',

        link: function (scope, element, attrs, ngModelCtrl) {

            element.datepicker({

                dateFormat: 'DD, d  MM, yy',

                onChange: function (date) {

                    scope.date = date;

                    scope.$apply();

                }

            });

        }

    };

});
