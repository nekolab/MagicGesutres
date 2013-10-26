/**
 * @fileoverview MagicGestures profile manager.
 * @author sunny@magicgestures.org {Sunny}
 * @version 0.0.0.1
 */

/*global chrome: false, MagicGestures: true */
/*jshint strict: true, globalstrict: true */

"use strict";

Object.defineProperty(MagicGestures, "ProfileManager", {
    value: Object.create(null, {
        activedProfile: {
            get: function() {
                return this._activedProfile;
            },
            set: function(profileId) {
                this._activedProfile = profileId;
                this.syncCenter.update("activedProfile", profileId);
                chrome.storage.local.set({active: profileId});
                MagicGestures.runtime.set({active: profileId});
            }
        },
        profileMap: {
            get: function() {
                return this._profileMap;
            },
            set: function(value) {
                this._profileMap = value;
                this.syncCenter.update("profileMap", value);
                MagicGestures.runtime.set({profileMap: value});
            }
        },
        /**
         * Function which initialzie MagicGestures Profile Mananger.
         *
         * @callback callback Callback will be called after initialize.
         */ 
        init: {
            value: function(callback) {
                
                var profileMap = {};
                var MagicProfileManager = this;

                MagicProfileManager.syncCenter.init();
                MagicProfileManager.syncCenter.watch("profileMap", function(value) {
                    MagicProfileManager._profileMap = value;
                });
                MagicProfileManager.syncCenter.watch("activedProfile", function(id) {
                    MagicProfileManager._activedProfile = id;
                });

                var getLocalProfileMap = function(callback) {
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
                                profile.gestureTrie = MagicGestures.Util.generateTrie(profile);
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
                            callback();
                    });
                };

                var getRemoteProfileMap = function(callback) {
                    chrome.storage.sync.get("profileMap", function(result) {
                        for (var id in result.profileMap) {
                            MagicGestures.logging.info("Loading profile from sync storage...", result.profileMap);
                            if (id in profileMap) {
                                profileMap[id] = MagicProfileManager.mergeManager(profileMap[id], result.profileMap[id]);
                            } else {
                                profileMap[id] = result.profileMap[id];
                            }
                        }
                        if (callback)
                            callback();
                    });
                };

                MagicGestures.runtime.get(["profileMap", "active"], function(result) {
                    if (Object.keys(result).length !== 0) {
                        MagicGestures.logging.info("Loading ProfileManager from runtime...");
                        MagicProfileManager._profileMap = result.profileMap;
                        MagicProfileManager._activedProfile = result.active;
                    } else {
                        getLocalProfileMap(function() {
                            getRemoteProfileMap(function() {
                                MagicProfileManager.profileMap = profileMap;

                                chrome.storage.local.get("active", function(result) {
                                    if (!result.active || !(result.active in profileMap)) {
                                        chrome.storage.local.set({active: "b8980ce9f43e35f2"});
                                        result.active = "b8980ce9f43e35f2";
                                    }
                                    MagicProfileManager._activedProfile = result.active;
                                    MagicGestures.runtime.setCurrentProfile(profileMap[result.active]);
                                });
                            });
                        });
                    }
                    callback();
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
                this.activedProfile = profileId;
            }
        },
        /**
         * Sync Center can sync internal variable between different instance of profile manager.
         */
        syncCenter: {
            value: Object.create(null, {
                /**
                 * Watch map is a map to store variable name and callback.
                 * @type {object.<string, function>}
                 */
                watchMap: {
                    value: Object.create(null)
                },
                /**
                 * Initialize function.
                 * Add runtime.onMessage listener to listen message from other manager.
                 */
                init: {
                    value: function() {
                        var MagicProfileManagerSyncCenter = this;
                        chrome.runtime.onMessage.addListener(function(request) {
                            if (typeof(request) != "string") {
                                Object.getOwnPropertyNames(request).forEach(function(message) {
                                    if (message.indexOf("PMSC Sync: ") === 0) {
                                        if (message.substr(11) in MagicProfileManagerSyncCenter.watchMap) {
                                            MagicProfileManagerSyncCenter.watchMap[message.substr(11)](request[message]);
                                        }
                                    }
                                });
                            }
                        });
                    }
                },
                /**
                 * Register the variable to sync center.
                 * Each time the variable has changed by outer profile mananger,
                 * callback function will be called.
                 *
                 * @param {string} varName Variable's name.
                 *
                 * @callback callback Callback will be called after change happend.
                 * @param {object} value Changed value.
                 */
                watch: {
                    value: function(varName, callback) {
                        this.watchMap[varName] = callback;
                    }
                },
                /**
                 * Remove registered watcher by variable name.
                 *
                 * @param {string} varName Variable's name.
                 */
                remove: {
                    value: function(varName) {
                        delete this.watchMap[varName];
                    }
                },
                /**
                 * Send update message to other sync center.
                 * parameter "value" should be searializable.
                 *
                 * @param {string} varName Variable's name.
                 * @param {object} value Value should be updated.
                 */
                update: {
                    value: function(varName, value) {
                        var message = {};
                        message["PMSC Sync: " + varName] = value;
                        chrome.runtime.sendMessage(message);
                    }
                }
            })
        }
    }),
    enumerable: true
});