/**
 * @fileoverview Magic Gestures event page script file.
 * @author sunny@magicgestures.org {Sunny}
 * @version 0.0.1.15
 */

/* global chrome: false, MagicGestures: true */
/* jshint strict: true, globalstrict: true */

"use strict";

MagicGestures.init = function() {
    MagicGestures.logging.log("Initializing MagicGestures...");
    MagicGestures.runtime.init("background");
    MagicGestures.ProfileManager.init();

    // chrome.idle.setDetectionInterval(15);

    MagicGestures.runtime.messenger.addListener("gesture ACTION", function(msg, sender, sendResponse) {
        MagicGestures.logging.debug(msg);
        if (msg.command in MagicGestures.Actions) {
            MagicGestures.Actions[msg.command].action.call(null, sender.tab, msg.data);
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
        if (!msg.trainWhenIdle) {
            MagicGestures.NeuralNetEngine.trainNeuralNet();
        } else if (!MagicGestures.runtime.get("neuralnetTrainScheduled").neuralnetTrainScheduled) {
            chrome.idle.onStateChanged.addListener(MagicGestures.NeuralNetEngine.trainNeuralNet);
            MagicGestures.runtime.set({neuralnetTrainScheduled: true});
        }
    });

    chrome.alarms.onAlarm.addListener(function(alarm) {
        if (alarm.name === "syncStorage") {
            if (MagicGestures.runtime.get('syncStorageScheduled').syncStorageScheduled) {
                MagicGestures.runtime.set({syncStorageScheduled: false});
                chrome.alarms.clear("syncStorage");
            }
            MagicGestures.ProfileManager.syncStorage();
        }
    });
};

chrome.runtime.onStartup.addListener(function() {
    if (MagicGestures.runtime.get('syncStorageScheduled').syncStorageScheduled) {
        MagicGestures.runtime.set({syncStorageScheduled: false});
        MagicGestures.ProfileManager.syncStorage();
    }

    if (MagicGestures.runtime.get("neuralnetTrainScheduled").neuralnetTrainScheduled) {
        chrome.idle.onStateChanged.addListener(MagicGestures.NeuralNetEngine.trainNeuralNet);
    }

    MagicGestures.runtime.set({current_tabs: {}, closedTabStack: []});
});

chrome.runtime.onInstalled.addListener(function() {
    MagicGestures.logging.debug("MagicGestures onInstalled!!");

    chrome.alarms.clearAll();
    if (MagicGestures.runtime.get('syncStorageScheduled').syncStorageScheduled) {
        MagicGestures.runtime.set({syncStorageScheduled: false});
        MagicGestures.ProfileManager.syncStorage();
    }

    var neuralnetTrainScheduled = MagicGestures.runtime.get("neuralnetTrainScheduled").neuralnetTrainScheduled;

    MagicGestures.runtime.runOnce();
    MagicGestures.Actions.runOnce(function() {
        MagicGestures.ProfileManager.runOnce(function() {
            MagicGestures.runtime.set({neuralnetTrainScheduled: neuralnetTrainScheduled});
        });
    });


    // Reload content script for each tab.
    chrome.tabs.query({}, function(tabs) {
        tabs.forEach(function(tab) {
            chrome.tabs.executeScript(tab.id, {file: "lib/magicgestures.js", allFrames: true, runAt: "document_start"}, function() {
                chrome.tabs.executeScript(tab.id, {file: "lib/js_actions.js", allFrames: true, runAt: "document_start"}, function() { 
                    chrome.tabs.executeScript(tab.id, {file: "lib/gesture_engine.js", allFrames: true, runAt: "document_start"}, function() {
                        chrome.tabs.executeScript(tab.id, {file: "lib/gesture_canvas.js", allFrames: true, runAt: "document_start"}, function() {
                            chrome.tabs.executeScript(tab.id, {file: "lib/content_script.js", allFrames: true, runAt: "document_start"});
                        });
                    });
                });
            });
        });
    });
});

MagicGestures.init();