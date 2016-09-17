var demo = angular.module("demo", ["ngRoute"]);

demo.config(['$routeProvider', function ($routeProvider) {

    $routeProvider.

    when('/home', {

        templateUrl: 'Templates/Home.html',

        controller: 'HomeController'

    }).
    when('/contact', {

        templateUrl: 'Templates/Contact.html',

        controller: 'ContactController'

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

demo.controller('ContactController', function ($scope) {

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
            var index;
            for (i = 0; i < $scope.flights.length; i++) {
                index = $scope.flights[i].id.indexOf($scope.searchId);
                if (index != -1) {
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

        }();

    });

});





demo.controller('FlightsController', function ($scope, flightSvc) {

    flightSvc.async().then(function (flights) {

        $scope.flights = flights;

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

        for (i = 0; i < $scope.flights.length; i++) {

            var dateString = $scope.flights[i].localDepartureTime;

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

        return output;

    };

})



.filter('dateFilter', function () {

    return function (arr, field) {

        var filtered = [];

        angular.forEach(arr, function (item) {

            var dateString = item.localDepartureTime;

            var dt = dateString.split(/\-|\s/);

            var newDt = dt[2].substring(0, 2) + '/' + dt[1] + '/' + dt[0];

            if ((newDt).indexOf(field) > -1)

                filtered.push(item);

        });

        
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
