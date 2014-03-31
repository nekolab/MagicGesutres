var GesturesCtrl = function($scope, $route) {

};

var SettingsCtrl = function($scope, $route) {
    $scope.profileMap = MagicGestures.ProfileManager.profileMap;
    $scope.selectedProfile = new MagicGestures.Profile(MagicGestures.ProfileManager.activedProfile);
    $scope.activedProfile = new MagicGestures.Profile(MagicGestures.ProfileManager.activedProfile);
    $scope.selectProfile = function(profileId) {
        $scope.selectedProfile = new MagicGestures.Profile(MagicGestures.ProfileManager.profileMap[profileId]);
    };
    $scope.activeProfile = function(profileId) {
        $scope.selectedProfile = new MagicGestures.Profile(MagicGestures.ProfileManager.profileMap[profileId]);
        $scope.activedProfile = new MagicGestures.Profile(MagicGestures.ProfileManager.profileMap[profileId]);
    };
    $scope.createdProfle = {
        name: "",
        description: "",
        copyFromAnotherProfile: false,
        copyFrom: $scope.selectedProfile.id
    };
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