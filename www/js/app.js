var forecast = angular.module("forecast", ["ionic"]);

forecast.service("forecastReader", ["$http", "$rootScope", forecastReader]);

forecast.controller("forecastController", ["$scope", "$sce", "$ionicLoading", "$ionicListDelegate", "$ionicPlatform", "forecastReader", forecastController]);

function forecastController($scope, $sce, $ionicLoading, $ionicListDelegate, $ionicPlatform, forecastReader) {

    $scope.deviceReady = false;

    $ionicPlatform.ready(function() {
        $scope.$apply(function() {
            $scope.deviceReady = true;
        });
    });

    $scope.tempi = [];
    $scope.params = {};

    $scope.$on("scicropApp.temperatura", function(_, result) {

        $scope.tempi.push({
            nome: result.name,
            temperatura: result.main.temp,
            pressure: result.main.pressure,
            humidity: result.main.humidity,
            icone:  result.weather[0].icon,
            vento: result.wind.speed,
            long: result.coord.lon,
            lat: result.coord.lat

        });

		$scope.$broadcast('loading:hide');
		//$scope.$broadcast("scroll.infiniteScrollComplete");
		$scope.$broadcast("scroll.refreshComplete");
    });

    $scope.loadMore = function() {
        forecastReader.carregaTempi($scope.params);
    }
    $scope.reload = function() {
        $scope.tempi = [];
        $scope.params = {};
        forecastReader.carregaTempi();
    }
}

function forecastReader($http, $rootScope) {
	this.carregaTempi = function(params) {

			url = "http://api.openweathermap.org/data/2.5/weather?lat=35&lon=139&units=metric&lang=pt";

			$http.get(url, {
				params : ""
			}).success(function(result) {
                console.log('Sucesso obter Temperatura');
				$rootScope.$broadcast("scicropApp.temperatura", result);
				$rootScope.$broadcast('mensagem:statusSucesso');
				$rootScope.$broadcast('loading:hide');
                // realizar o insert
			}).error(function(result) {
				console.log('Erro obter Temperatura');
				$rootScope.$broadcast('mensagem:statusErro');
				$rootScope.$broadcast('loading:hide');
                // realizar o select
			});

	}
}
