/**
 * @fileoverview MagicGestures profile manager.
 * @author sunny@magicgestures.org {Sunny}
 * @version 0.0.1.0
 */

/* global chrome: false, MagicGestures: true */
/* jshint strict: true, globalstrict: true, forin: false */

"use strict";

/**
 * Definition of MagicGestures.ProfileManager.
 */
Object.defineProperty(MagicGestures, "ProfileManager", {
    value: Object.create(null, {

        /**
         * MagicGestures.ProfileManager.instanceID
         * Each ProfileManager has a unique id to identify it.
         */
        instanceID: {
            get: function(){
                if (MagicGestures.ProfileManager._instanceID)
                    return MagicGestures.ProfileManager._instanceID;
                else
                    return MagicGestures.ProfileManager._instanceID = MagicGestures.ProfileManager.generateId();
            }
        },
        
        /**
         * MagicGestures.ProfileManager.activeProfile
         * Use this function to active one profile.
         * @param {string} profileID Profile's id should be actived.
         */
        activeProfile: {
            value: function(profileID) {
                if (profileID in MagicGestures.ProfileManager.profileMap) {
                    var activedProfile = MagicGestures.ProfileManager.profileMap[profileID];
                    MagicGestures.runtime.set({activedProfileID: profileID});
                    chrome.storage.local.set({activedProfileCache: activedProfile}, function(){
                        MagicGestures.runtime.sendRuntimeMessage('*', 'activedProfileChanged PMEVENT', {
                            changedTo: profileID,
                            pmInstanceID: MagicGestures.ProfileManager.instanceID
                        });
                    });
                }
            }
        },

        /**
         * MagicGestures.ProfileManager.activedProfile
         */
        activedProfile: {
            get: function() {
                var rs = MagicGestures.runtime.get(["activedProfileID", "profileMap"]);
                return rs.profileMap[rs.activedProfileID];
            }
        },

        /**
         * MagicGestures.ProfileManager.addProfile
         */
        addProfile: {
            value: function(createProfileSturct) {
                var profileMap = MagicGestures.ProfileManager.profileMap;
                var copiedFromProfile = (createProfileSturct.copyFromAnotherProfile) ? profileMap[createProfileSturct.copyFrom] : null;
                var createdProfile = new MagicGestures.Profile(copiedFromProfile);
                createdProfile.id = MagicGestures.ProfileManager.generateId();
                createdProfile.name = createProfileSturct.name;
                createdProfile.description = createProfileSturct.description;
                profileMap[createdProfile.id] = createdProfile;
                MagicGestures.ProfileManager.profileMap = profileMap;
            }
        },

        /**
         * MagicGestures.ProfileManager.updateProfile
         */
        updateProfile: {
            value: function(profile) {
                var profileMap = MagicGestures.ProfileManager.profileMap;
                profileMap[profile.id] = profile;
                MagicGestures.ProfileManager.profileMap = profileMap;
                MagicGestures.runtime.sendRuntimeMessage('*', 'profileUpdated PMEVENT', {
                    updatedProfileID: profile.id,
                    pmInstanceID: MagicGestures.ProfileManager.instanceID
                });
                if (profile.id == MagicGestures.runtime.get("activedProfileID").activedProfileID) {
                    chrome.storage.local.set({activedProfileCache: profile}, function(){
                        MagicGestures.runtime.sendRuntimeMessage('*', 'activedProfileUpdated PMEVENT', {
                            pmInstanceID: MagicGestures.ProfileManager.instanceID
                        });
                    });
                }
            }
        },

        /**
         * MagicGestures.ProfileManager.deleteProfile
         */
        deleteProfile: {
            value: function(profileID) {
                if (profileID in MagicGestures.ProfileManager.profileMap) {
                    var profileMap = MagicGestures.ProfileManager.profileMap;
                    delete profileMap[profileID];
                    MagicGestures.ProfileManager.profileMap = profileMap;
                    MagicGestures.runtime.sendRuntimeMessage('*', 'profileDeleted PMEVENT', {
                        deletedProfileID: profileID,
                        pmInstanceID: MagicGestures.ProfileManager.instanceID
                    });
                }
            }
        },

        /**
         * MagicGestures.ProfileManager.profileMap
         */
        profileMap: {
            get: function() {
                return MagicGestures.runtime.get("profileMap").profileMap;
            },
            set: function(newProfileMap) {
                MagicGestures.runtime.set({profileMap: newProfileMap});
                MagicGestures.runtime.sendRuntimeMessage('*', 'profileMapUpdated PMEVENT', {
                    pmInstanceID: MagicGestures.ProfileManager.instanceID
                });
            }
        },

        /**
         * MagicGestures.ProfileManager.runOnce
         */
        runOnce: {
            value: function(callback) {

                // ToDo: We will introduce a update adapter in the furture.

                var profileMap = Object.create(null);
                MagicGestures.ProfileManager.loadLocalProfile(profileMap, function() {
                    MagicGestures.ProfileManager.loadSyncedProfile(profileMap, function() {
                        chrome.storage.local.get("activedProfileID", function(result) {
                            if (!result.activedProfileID || !(result.activedProfileID in profileMap)) {
                                chrome.storage.local.set({activedProfileID: "b8980ce9f43e35f2"});
                                result.activedProfileID = "b8980ce9f43e35f2";
                            }
                            MagicGestures.runtime.set({activedProfileID: result.activedProfileID, profileMap: profileMap});
                            chrome.storage.local.set({activedProfileCache: profileMap[result.activedProfileID]}, callback);
                        });
                    });
                });
            }
        },

        /**
         * MagicGestures.ProfileManager.init
         * Function which initialzie MagicGestures Profile Mananger.
         */ 
        init: {
            value: function() {
                switch(MagicGestures.runtime.envName) {
                    case "options":
                        break;
                    default:
                        break;
                }
            }
        },

        /**
         * MagicGestures.ProfileManager.loadLocalProfile
         * Load profile from chrome.storage.local.
         * If there is no profile in chrome.storage.local, will generate some.
         */
        loadLocalProfile: {
            value: function(profileMap, callback) {
                chrome.storage.local.get("profileMap", function(result) {
                    if (Object.keys(result).length === 0) {
                        // Create default profile when local profile map is empty.
                        MagicGestures.logging.info("No default profile in local, genearte some...");
                        [
                            MagicGestures.Preset.Profiles.MagicGestures(),
                            MagicGestures.Preset.Profiles.FireGestures(),
                            MagicGestures.Preset.Profiles.Opera(),
                            MagicGestures.Preset.Profiles.SmoothGestures()
                        ].forEach(function(profile) {
                            profile.gestureTrie = MagicGestures.DirectionEngine.generateTrie(profile);
                            profileMap[profile.id] = profile;
                        });
                        chrome.storage.local.set({profileMap: profileMap});
                    } else {
                        MagicGestures.logging.info("Loading profile from local storage...", result.profileMap);
                        for (var id in result.profileMap) {
                            if (result.profileMap.hasOwnProperty(id))
                                profileMap[id] = result.profileMap[id];
                        }
                    }
                    if (callback)
                        callback(profileMap);
                });
            }
        },

        /**
         * MagicGestures.ProfileManager.loadSyncedProfile
         * Load profile from chrome.storage.sync
         */
        loadSyncedProfile: {
            value: function(profileMap, callback) {
                chrome.storage.sync.get("profileMap", function(result) {
                    for (var id in result.profileMap) {
                        if (result.profileMap.hasOwnProperty(id)) {
                            MagicGestures.logging.info("Loading profile from sync storage...", result.profileMap);
                            profileMap[id] = result.profileMap[id];
                        }
                    }
                    if (callback)
                        callback(profileMap);
                });
            }
        },

        /**
         * MagicGestures.ProfileManager.mergeManager
         * Merge manager is a feature for furture use.
         */ 
        mergeManager: {
            value: function(localVersion, syncVersion) {
                return syncVersion;
            }
        },

        /**
         * MagicGestures.ProfileManager.generateId
         * Useage: Generate hexdigital 16-character length random string.
         * @return {string} ID string. 
         */
        generateId: {
            value: function() {
                var s4 = function () {
                  return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
                };
                return s4() + s4() + s4() + s4();
            }
        }
    })
});