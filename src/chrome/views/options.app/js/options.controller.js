var GesturesCtrl = function($scope, SettingService) {
    $scope.activedProfile = SettingService.activedProfile;
    $scope.selectedProfile = SettingService.selectedProfile;

    $scope.actions = MagicGestures.Preset.Actions;

    $scope.addGesture = function(event) {
        delete $scope.createdGesture.timestamp;
        var createdGesture = new MagicGestures.Gesture($scope.createdGesture);
        $scope.selectedProfile.gestures.push(createdGesture);
    };

    $scope.editGesture = function(event) {
        $scope.editedGesture.code = $scope.createdGesture.code;
        $scope.editedGesture.featureVectors = $scope.createdGesture.featureVectors;
    };

    $scope.deleteGesture = function(gesture) {
        var confirmed = window.confirm("Remove this gesture?");
        var index = $scope.selectedProfile.gestures.indexOf(gesture);
        if (index != -1 && confirmed) {
            $scope.selectedProfile.gestures.splice(index, 1);
        }
    };

    $scope.createdGesture = new MagicGestures.Gesture({enabled: false});
    $scope.editedGesture = new MagicGestures.Gesture({enabled: false});

    $scope.resetTemporaryGesture = function() {
        $scope.createdGesture = new MagicGestures.Gesture({enabled: false});
        $scope.editedGesture = new MagicGestures.Gesture({enabled: false});
        $scope.$apply('createdGesture.timestamp = "";editedGesture.timestamp = ""');
        $scope.$broadcast('updateActionSelectReference');
    };

    $scope.$watch('isAddingNewGesture + isEditingGesture', function(newValue, oldValue) {
        MagicGestures.tab.recordMode.enabled = newValue;
        MagicGestures.tab.recordMode.callback = function() {
            MagicGestures.NeuralNetEngine.pointFilter(MagicGestures.tab.gesture.points);
            var normalizedPoints = MagicGestures.NeuralNetEngine.normalize(MagicGestures.tab.gesture.points);
            $scope.createdGesture.code = MagicGestures.tab.gesture.code;
            $scope.createdGesture.enabled = true;
            $scope.createdGesture.featureVectors = normalizedPoints;
            $scope.$apply('createdGesture.timestamp = ' + new Date().getTime());
        };
        MagicGestures.runtime.currentProfile = (newValue) ? $scope.selectedProfile : $scope.activedProfile;
    });
};

var SettingsCtrl = function($scope, SettingService) {
    $scope.profileMap = MagicGestures.ProfileManager.profileMap;
    $scope.selectedProfile = SettingService.selectedProfile;
    $scope.activedProfile = SettingService.activedProfile;

    $scope.selectProfile = function(profileId) {
        SettingService.selectedProfile = $scope.selectedProfile = new MagicGestures.Profile(MagicGestures.ProfileManager.profileMap[profileId]);
    };

    $scope.activeProfile = function(profileId) {
        SettingService.selectedProfile = $scope.selectedProfile = new MagicGestures.Profile(MagicGestures.ProfileManager.profileMap[profileId]);
        SettingService.activedProfile = $scope.activedProfile = new MagicGestures.Profile(MagicGestures.ProfileManager.profileMap[profileId]);
        MagicGestures.runtime.currentProfile = $scope.activedProfile;
    };

    $scope.createdProfle = {
        name: "",
        description: "",
        copyFromAnotherProfile: false,
        copyFrom: $scope.selectedProfile.id
    };

    $scope.actions = MagicGestures.Preset.Actions;
};

var NavContrller = function($scope, $route, SettingService) {
    $scope.$route = $route;
    $scope.$on('$routeChangeStart', function() {
        $scope.isSelected = false;
    });

    $scope.viewRendered = function() {
        $scope.isSelected = true;
    };

    MagicGestures.runtime.currentProfile = SettingService.activedProfile;
    MagicGestures.tab.init();
};

NavContrller.resolve = {
    delay: function($q, $timeout) {
        var delay = $q.defer();
        $timeout(delay.resolve, 100);
        return delay.promise;
    }
};