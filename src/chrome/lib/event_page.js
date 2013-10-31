/**
 * @fileoverview Magic Gestures event page script file.
 * @author sunny@magicgestures.org {Sunny}
 * @version 0.0.1.5
 */

/*global chrome: false, MagicGestures: true */
/*jshint strict: true, globalstrict: true */

"use strict";

/**
 * Definition of MagicGestures.Background.
 */
Object.defineProperty(MagicGestures, "Background", {
    value: Object.create(null, {

        /**
         * Some event handler.
         */
        handler: {
            value: Object.create(null, {

                /**
                 * Handle chrome.tabs.onUpdate event.
                 * After update, I will inject some js and distribute config.
                 */
                onTabUpdated: {
                    value: function(tabId, changeInfo, tab) {
                        // ToDo: Check whether URL is in black/whitelist or not.
                        if (changeInfo.status === "loading" || changeInfo.url) {
                            MagicGestures.logging.info("We have a new tab!!!");
                            chrome.pageAction.show(tabId);
                            chrome.tabs.executeScript(tabId, {file: "lib/magicgestures.js", allFrames: true, runAt: "document_start"}, function() {
                                chrome.tabs.executeScript(tabId, {file: "lib/gesture_engine.js",allFrames: true, runAt: "document_start"}, function() {
                                    chrome.tabs.executeScript(tabId, {file: "lib/content_script.js", allFrames: true, runAt: "document_start"}, function() {
                                        MagicGestures.runtime.sendTabMessage(tabId, "distribute_current_profile", MagicGestures.ProfileManager.activedProfile);
                                    });
                                });
                            });
                        }
                    }
                }
            })
        }

    })
});

/**
 * Implement MagicGestures.runtime.messenger.action
 */
MagicGestures.runtime.messenger.action = function(type, msg, sender, sendResponse) {
    switch(type) {
        case "ACTION":
            MagicGestures.logging.debug(msg);
            if (msg in MagicGestures.Preset.Actions) {
                MagicGestures.Preset.Actions[msg].call(null, sender.tab);
            } else {
                MagicGestures.logging.warn("Action", msg, "doesn't support yet");
            }
            break;
        default:
            break;
    }
};

MagicGestures.init = function() {
    MagicGestures.logging.log("Initializing MagicGestures...");
    MagicGestures.runtime.init("background");
    MagicGestures.ProfileManager.init();

    chrome.tabs.onUpdated.addListener(MagicGestures.Background.handler.onTabUpdated);
};

chrome.runtime.onInstalled.addListener(function() {
    MagicGestures.logging.debug("MagicGestures onInstalled!!");
    MagicGestures.runtime.runOnce();
    MagicGestures.ProfileManager.runOnce();
});

MagicGestures.init();