/**
 * @fileoverview MagicGestures profile manager.
 * @author sunny@magicgestures.org {Sunny}
 * @version 0.0.0.5
 */

/*global chrome: false, MagicGestures: true */
/*jshint strict: true, globalstrict: true, forin: false */

"use strict";

/**
 * Definition of MagicGestures.ProfileManager.
 */
Object.defineProperty(MagicGestures, "ProfileManager", {
    value: Object.create(null, {

        activedProfile: {
            get: function() {
                return MagicGestures.runtime.get("activedProfile").activedProfile;
            }
        },

        profileMap: {
            get: function() {
                return MagicGestures.runtime.get("profileMap").profileMap;
            }
        },

        runOnce: {
            value: function(callback) {

                // ToDo: We will introduce a update adapter in the furture.

                var profileMap = Object.create(null);
                MagicGestures.ProfileManager.loadLocalProfile(profileMap, function() {
                    MagicGestures.ProfileManager.loadSyncedProfile(profileMap, function() {
                        chrome.storage.local.get("active", function(result) {
                            if (!result.active || !(result.active in profileMap)) {
                                chrome.storage.local.set({active: "b8980ce9f43e35f2"});
                                result.active = "b8980ce9f43e35f2";
                            }
                            MagicGestures.runtime.set({activedProfile: profileMap[result.active], profileMap: profileMap});
                            chrome.storage.local.set({activedProfileCache: profileMap[result.active]}, callback);
                        });
                    });
                });
            }
        },

        /**
         * Function which initialzie MagicGestures Profile Mananger.
         *
         */ 
        init: {
            value: function() {

            }
        },

        /**
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
                            profile.gestureTrie = MagicGestures.directionEngine.generateTrie(profile);
                            profileMap[profile.id] = profile;
                        });
                        chrome.storage.local.set({profileMap: profileMap});
                    } else {
                        MagicGestures.logging.info("Loading profile from local storage...", result.profileMap);
                        for (var id in result.profileMap) {
                            profileMap[id] = result.profileMap[id];
                        }
                    }
                    if (callback)
                        callback(profileMap);
                });
            }
        },

        /**
         * Load profile from chrome.storage.sync
         */
        loadSyncedProfile: {
            value: function(profileMap, callback) {
                chrome.storage.sync.get("profileMap", function(result) {
                    for (var id in result.profileMap) {
                        MagicGestures.logging.info("Loading profile from sync storage...", result.profileMap);
                        profileMap[id] = result.profileMap[id];
                    }
                    if (callback)
                        callback(profileMap);
                });
            }
        },

        /**
         * Merge manager is a feature for furture use.
         */ 
        mergeManager: {
            value: function(localVersion, syncVersion) {
                return syncVersion;
            }
        },
        /**
         * Use this function to active one profile.
         * @param {string} profileId Profile's id should be actived.
         */
        active: {
            value: function(profileId) {
            }
        }
    })
});