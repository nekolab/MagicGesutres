/**
 * @fileoverview Magic Gestures content script file.
 * @author sunny@magicgestures.org {Sunny}
 * @version 0.0.1.1
 */

/* global MagicGestures: true, chrome: false */
/* jshint strict: true, globalstrict: true */

"use strict";

/**
 * Initialize MagicGestures on each page.
 */
MagicGestures.init = function(){
    MagicGestures.logging.log("Initializing MagicGestures...");
    MagicGestures.runtime.init("content script");
    // Load settings from storage.local.
    chrome.storage.local.get("activedProfileCache", function(activedProfile) {
        activedProfile = activedProfile.activedProfileCache;
        MagicGestures.runtime.currentProfile = activedProfile;
        // Initialize MagicGestures.tab after load the profile.
        MagicGestures.tab.init();
        // Show page action for current tab.
        MagicGestures.runtime.sendRuntimeMessage("background", "page_action ACTION", {command: "show"});

        // Auto update when activedProfileCache changed.
        chrome.storage.onChanged.addListener(function(changes, areaName) {
            if (areaName == "local" && "activedProfileCache" in changes) {
                MagicGestures.runtime.currentProfile = changes.activedProfileCache.newValue;
            }
        });
    });
};

MagicGestures.init();