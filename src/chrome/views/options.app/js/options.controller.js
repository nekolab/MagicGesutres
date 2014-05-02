var GesturesCtrl = function($scope, SettingService) {
    $scope.selectedProfile = SettingService.selectedProfile;
    if (SettingService.activedProfile.id == $scope.selectedProfile.id) {
        $scope.activedProfile = SettingService.activedProfile = $scope.selectedProfile;
    } else {
        $scope.activedProfile = SettingService.activedProfile;
    }

    $scope.actions = MagicGestures.Actions;

    $scope.isTrainingGestures = ($scope.selectedProfile.trained === "training");

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
            $scope.$apply('createdGesture.timestamp = ' + Date.now());
        };
        MagicGestures.runtime.currentProfile = (newValue) ? $scope.selectedProfile : $scope.activedProfile;
    });

    var simpleDiffCheck = function() {
        var ourProfile = $scope.selectedProfile;
        var theirProfile = MagicGestures.ProfileManager.profileMap[$scope.selectedProfile.id];
        if (ourProfile.gestures.length !== theirProfile.gestures.length) return true;
        for (var i = ourProfile.gestures.length - 1; i >= 0; --i) {
            var ourGesture = ourProfile.gestures[i], theirGesture = theirProfile.gestures[i];
            if (ourGesture.code !== theirGesture.code) return true;
            if (ourGesture.enabled !== theirGesture.enabled) return true;
            if (ourGesture.featureVectors.toString() !== theirGesture.featureVectors.toString()) return true;
            if (ourGesture.actions.length !== theirGesture.actions.length) return true;
            for (var j = ourGesture.actions.length - 1; j >= 0; --j) {
                var ourAction = ourGesture.actions[j], theirAction = theirGesture.actions[j];
                if (ourAction.name !== theirAction.name) return true;
                if (ourAction.dependency !== theirAction.dependency) return true;
            }
        }
        return false;
    };

    $scope.saveGestures = function(e){
        if (simpleDiffCheck() || !e){
            $scope.selectedProfile.trained = false;
            $scope.selectedProfile.gestureTrie = MagicGestures.DirectionEngine.generateTrie($scope.selectedProfile);
            MagicGestures.ProfileManager.updateProfile($scope.selectedProfile);
            MagicGestures.runtime.sendRuntimeMessage('background', 'neuralGestureChanged PMEVENT', {
                trainWhenIdle: !!e
            });
        }
    };

    var saveScheduleID = window.setInterval($scope.saveGestures, 3000, "dummy event");

    $scope.$on('$locationChangeStart', $scope.saveGestures);

    var onTrainingNeuralNet = function(msg, sender, sendResponse) {
        if (msg.trainingProfile === $scope.selectedProfile.id)
            $scope.$apply("isTrainingGestures=true");
    };
    MagicGestures.runtime.messenger.addListener("trainingNeuralNet PMEVENT", onTrainingNeuralNet);

    var onNeuralNetTrained = function(msg, sender, sendResponse) {
        if (msg.trainedProfile === $scope.selectedProfile.id)
            $scope.$apply("isTrainingGestures=false");
    };
    MagicGestures.runtime.messenger.addListener("neuralNetTrained PMEVENT", onNeuralNetTrained);

    $scope.$on('$destroy', function() {
        window.clearInterval(saveScheduleID);
        MagicGestures.runtime.messenger.removeListener("neuralNetTrained PMEVENT", onNeuralNetTrained);
        MagicGestures.runtime.messenger.removeListener("trainingNeuralNet PMEVENT", onTrainingNeuralNet);
    });
};

var SettingsCtrl = function($scope, $window, SettingService) {
    $scope.actions = MagicGestures.Actions;
    $scope.selectedProfile = SettingService.selectedProfile;
    if (SettingService.activedProfile.id == $scope.selectedProfile.id) {
        $scope.activedProfile = SettingService.activedProfile = $scope.selectedProfile;
    } else {
        $scope.activedProfile = SettingService.activedProfile;
    }
    $scope.profileMap = MagicGestures.ProfileManager.profileMap;

    $scope.profileTemplate = {
        name: "",
        description: "",
        copyFromAnotherProfile: false,
        copyFrom: $scope.selectedProfile.id
    };

    $scope.activeProfile = function(profileID) {
        $scope.updateSeletctedProfileIfScheduled();
        MagicGestures.ProfileManager.activeProfile(profileID);
    };

    $scope.createProflile = function() {
        MagicGestures.ProfileManager.addProfile($scope.profileTemplate);
    };

    $scope.editProfileInfo = function(){
        if ($scope.profileTemplate.name)
            $scope.selectedProfile.name = $scope.profileTemplate.name;
        if ($scope.profileTemplate.description)
            $scope.selectedProfile.description = $scope.profileTemplate.description;
        MagicGestures.ProfileManager.updateProfile($scope.selectedProfile);
    };

    $scope.deleteProfile = function(profileID) {
        $scope.updateSeletctedProfileIfScheduled();
        if (profileID == $scope.activedProfile.id) {
            if (Object.keys($scope.profileMap).length == 1) {
                $window.alert("You cannot delete the last profile.");
                return;
            } else {
                var profileMapIDs = Object.keys($scope.profileMap);
                profileMapIDs.splice(profileMapIDs.indexOf(profileID), 1);
                MagicGestures.ProfileManager.activeProfile(profileMapIDs[0]);
            }
        } else if (profileID == $scope.selectedProfile.id) {
            $scope.selectedProfile = SettingService.selectedProfile = new MagicGestures.Profile($scope.activedProfile);
        }
        MagicGestures.ProfileManager.deleteProfile(profileID);
    };

    $scope.selectProfile = function(profileID) {
        $scope.updateSeletctedProfileIfScheduled();
        $scope.selectedProfile = SettingService.selectedProfile = new MagicGestures.Profile($scope.profileMap[profileID]);
        if ($scope.activedProfile.id == profileID)
            $scope.activedProfile = SettingService.activedProfile = $scope.selectedProfile;
    };

    $scope.resetTemporaryProfile = function() {
        $scope.profileTemplate.name = "";
        $scope.profileTemplate.description = "";
        $scope.profileTemplate.copyFromAnotherProfile = false;
        $scope.profileTemplate.copyFrom = $scope.selectedProfile.id;
    };

    var saveScheduleID;
    $scope.scheduleUpdateProfile = function() {
        if (!saveScheduleID) {
            saveScheduleID = window.setTimeout(function() {
                saveScheduleID = undefined;
                MagicGestures.ProfileManager.updateProfile($scope.selectedProfile);
            }, 3000);
        }
    };

    $scope.updateSeletctedProfileIfScheduled = function() {
        if (saveScheduleID) {
            MagicGestures.ProfileManager.updateProfile($scope.selectedProfile);
            window.clearTimeout(saveScheduleID);
            saveScheduleID = undefined;
        }
    };
    $scope.$on('$locationChangeStart', $scope.updateSeletctedProfileIfScheduled);

    $scope.updateSeletctedProfileTrie = function() {
        $scope.selectedProfile.gestureTrie = MagicGestures.DirectionEngine.generateTrie($scope.selectedProfile);
    };

    var onProfileMapUpdated = function(msg, sender, sendResponse) {
        $scope.$apply(function() {
            $scope.profileMap = MagicGestures.ProfileManager.profileMap;
        });
    };
    MagicGestures.runtime.messenger.addListener("profileMapUpdated PMEVENT", onProfileMapUpdated);

    var onActivedProfileChanged = function(msg, sender, sendResponse) {
        $scope.$apply(function() {
            $scope.selectedProfile = SettingService.selectedProfile = new MagicGestures.Profile(MagicGestures.ProfileManager.activedProfile);
            $scope.activedProfile  = SettingService.activedProfile  = $scope.selectedProfile;
            MagicGestures.runtime.currentProfile = $scope.activedProfile;
        });
    };
    MagicGestures.runtime.messenger.addListener("activedProfileChanged PMEVENT", onActivedProfileChanged);

    $scope.$on('$destroy', function() {
        window.clearTimeout(saveScheduleID);
        MagicGestures.runtime.messenger.removeListener("profileMapUpdated PMEVENT", onProfileMapUpdated);
        MagicGestures.runtime.messenger.removeListener("activedProfileChanged PMEVENT", onActivedProfileChanged);
    });
};

var NavContrller = function($scope, $route, $window, SettingService) {
    $scope.$route = $route;
    $scope.$on('$routeChangeStart', function() {
        $scope.isSelected = false;
    });

    $scope.viewRendered = function() {
        $scope.isSelected = true;
    };

    MagicGestures.runtime.init("options");
    MagicGestures.runtime.currentProfile = SettingService.activedProfile;
    MagicGestures.tab.init();
    MagicGestures.ProfileManager.init();

    $scope.reloadTab = function() {
        SettingService.activedProfile = new MagicGestures.Profile(MagicGestures.ProfileManager.activedProfile);
        SettingService.selectedProfile = new MagicGestures.Profile(MagicGestures.ProfileManager.activedProfile);
        $route.reload();
    };

    $scope.closeTab = function() {
        $window.close();
    };

    var onActivedProfileUpdated = function(msg, sender, sendResponse) {
        $scope.$apply(function() {
            MagicGestures.runtime.currentProfile = MagicGestures.ProfileManager.activedProfile;
        });
    };
    MagicGestures.runtime.messenger.addListener("activedProfileUpdated PMEVENT", onActivedProfileUpdated);

    var onProfileUpdated = function(msg, sender, sendResponse) {
        if (msg.updatedProfileID == SettingService.selectedProfile.id && msg.pmInstanceID != MagicGestures.ProfileManager.instanceID) {
            $scope.$apply("showRequestReloadModal = true");
        }
    };
    MagicGestures.runtime.messenger.addListener("profileUpdated PMEVENT", onProfileUpdated);

    var onCancelReloadRequest = function(msg, sender, sendResponse) {
        $scope.$apply("showRequestReloadModal = false");
    };
    MagicGestures.runtime.messenger.addListener("cancelReloadRequest UIEVENT", onCancelReloadRequest);

    $scope.$on('$destroy', function() {
        MagicGestures.runtime.messenger.removeListener("profileUpdated PMEVENT", onProfileUpdated);
        MagicGestures.runtime.messenger.removeListener("activedProfileUpdated PMEVENT", onActivedProfileUpdated);
        MagicGestures.runtime.messenger.removeListener("cancelReloadRequest UIEVENT", onCancelReloadRequest);
    });
};

NavContrller.resolve = {
    delay: function($q, $timeout) {
        var delay = $q.defer();
        $timeout(delay.resolve, 100);
        return delay.promise;
    }
};