/**
 * @fileoverview Magic Gestures event page script file.
 * @author sunny@magicgestures.org {Sunny}
 * @version 0.0.1.9
 */

/*global chrome: false, MagicGestures: true */
/*jshint strict: true, globalstrict: true */

"use strict";

MagicGestures.init = function() {
    MagicGestures.logging.log("Initializing MagicGestures...");
    MagicGestures.runtime.init("background");
    MagicGestures.ProfileManager.init();
    // TODO: Reload content script for each tab.

    MagicGestures.runtime.messenger.addListener("gesture ACTION", function(msg, sender, sendResponse) {
        MagicGestures.logging.debug(msg);
        if (msg.command in MagicGestures.Preset.Actions) {
            MagicGestures.Preset.Actions[msg.command].action.call(null, sender.tab, msg.data);
        } else {
            MagicGestures.logging.warn("Gesture action", msg.command, "doesn't support yet");
        }
    });

    MagicGestures.runtime.messenger.addListener("page_action ACTION", function(msg, sender, sendResponse) {
        switch(msg.command) {
            case "show":
                chrome.pageAction.show(sender.tab ? sender.tab.id : 0);
                break;
            default:
                break;
        }
    });

    MagicGestures.runtime.messenger.addListener("neuralGestureChanged PMEVENT", function(msg, sender, sendResponse) {
        var neuralnetTrainScheduled = MagicGestures.runtime.get("neuralnetTrainScheduled").neuralnetTrainScheduled;
        if (!msg.trainWhenIdle) {
            MagicGestures.NeuralNetEngine.trainNeuralNet();
        } else if (!neuralnetTrainScheduled) {
            // chrome.idle.setDetectionInterval(15);
            chrome.idle.onStateChanged.addListener(MagicGestures.NeuralNetEngine.trainNeuralNet);
            MagicGestures.runtime.set({neuralnetTrainScheduled: true});
        }
    });
};

chrome.runtime.onInstalled.addListener(function() {
    MagicGestures.logging.debug("MagicGestures onInstalled!!");
    MagicGestures.runtime.runOnce();
    MagicGestures.ProfileManager.runOnce();
});

MagicGestures.init();