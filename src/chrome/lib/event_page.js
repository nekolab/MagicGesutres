/**
 * @fileoverview Magic Gestures event page script file.
 * @author sunny@magicgestures.org {Sunny}
 * @version 0.0.1.7
 */

/*global chrome: false, MagicGestures: true */
/*jshint strict: true, globalstrict: true */

"use strict";

/**
 * Implement MagicGestures.runtime.messenger.action
 */
MagicGestures.runtime.messenger.action = function(type, msg, sender, sendResponse) {
    switch(type) {
        case "gesture ACTION":
            MagicGestures.logging.debug(msg);
            if (msg.command in MagicGestures.Preset.Actions) {
                MagicGestures.Preset.Actions[msg.command].action.call(null, sender.tab, msg.data);
            } else {
                MagicGestures.logging.warn("Gesture action", msg.command, "doesn't support yet");
            }
            break;
        case "page_action ACTION":
            switch(msg.command) {
                case "show":
                    chrome.pageAction.show(sender.tab ? sender.tab.id : 0);
                    break;
                default:
                    break;
            }
            break;
        default:
            MagicGestures.logging.debug("Cannot process", type, "type event.");
            break;
    }
};

MagicGestures.init = function() {
    MagicGestures.logging.log("Initializing MagicGestures...");
    MagicGestures.runtime.init("background");
    MagicGestures.ProfileManager.init();
    // TODO: Reload content script for each tab.
};

chrome.runtime.onInstalled.addListener(function() {
    MagicGestures.logging.debug("MagicGestures onInstalled!!");
    MagicGestures.runtime.runOnce();
    MagicGestures.ProfileManager.runOnce();
});

MagicGestures.init();