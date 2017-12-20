var app = angular.module('drama', ['ngMaterial']);

app.controller('main', function ($scope, $http, $timeout, $mdSidenav) {
    getDramaDetail = function (id) {
        $http({
            method: 'GET',
            url: 'http://api.tvmaze.com/shows/' + id,
        }).then(function successCallback(response) {
            $scope.mydramas.push(response.data);
            saveSelectedCities();
        }, function errorCallback(response) {
        });
    }
    var dramas = {
        dramaid: []
    }
    $scope.mydramas = new Array();
    if (localStorage.dramas) {
        dramas = JSON.parse(localStorage.dramas);
        console.log(dramas);
        if (dramas.dramaid) {
            dramas.dramaid.forEach(function (id) {
                getDramaDetail(id);
            });
        }
    }
    $scope.togglesearch = buildToggler('searchside');
    function buildToggler(componentId) {
        return function () {
            $mdSidenav(componentId).toggle();
        };
    }
    $scope.search = function () {
        $http({
            method: 'GET',
            url: 'http://api.tvmaze.com/search/shows',
            params: { 'q': $scope.dramaname }
        }).then(function successCallback(response) {
            $scope.dramas = response.data;
        }, function errorCallback(response) {
        });
    }

    $scope.choose = function (id) {
        dramas.dramaid.push(id);
        saveSelectedCities();
        getDramaDetail(id);
    }
   
    saveSelectedCities = function () {
        localStorage.dramas = JSON.stringify(dramas);
    };
});
