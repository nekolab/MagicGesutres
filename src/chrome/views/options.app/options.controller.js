var GesturesCtrl = function($scope, $route) {

};

var SettingsCtrl = function($scope, $route) {

};

var NavContrller = function($scope, $route) {
	$scope.$route = $route;
	$scope.$on('$routeChangeStart', function() {
		$scope.isSelected = false;
	});
	$scope.viewRendered = function() {
		$scope.isSelected = true;
	};
};

NavContrller.resolve = {
	delay: function($q, $timeout) {
	    var delay = $q.defer();
	    $timeout(delay.resolve, 100);
	    return delay.promise;
	}
};