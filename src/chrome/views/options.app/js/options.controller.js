var GesturesCtrl = function($scope, $route, SettingService) {
    $scope.selectedProfile = SettingService.selectedProfile;

    $scope.actions = MagicGestures.Preset.Actions;
};

var SettingsCtrl = function($scope, $route, SettingService) {
    $scope.profileMap = MagicGestures.ProfileManager.profileMap;
    $scope.selectedProfile = SettingService.selectedProfile;
    $scope.activedProfile = SettingService.activedProfile;

    $scope.selectProfile = function(profileId) {
        SettingService.selectedProfile = $scope.selectedProfile = new MagicGestures.Profile(MagicGestures.ProfileManager.profileMap[profileId]);
    };

    $scope.activeProfile = function(profileId) {
        SettingService.selectedProfile = $scope.selectedProfile = new MagicGestures.Profile(MagicGestures.ProfileManager.profileMap[profileId]);
        SettingService.activedProfile = $scope.activedProfile = new MagicGestures.Profile(MagicGestures.ProfileManager.profileMap[profileId]);
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