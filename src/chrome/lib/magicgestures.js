/**
 * @fileoverview Magic Gestures runtime and settings storage template.
 * @author sunny@magicgestures.org {Sunny}
 * @version 0.0.0.2
 */

const DEBUG = true;

var MagicGestures = Object.create(null);
MagicGestures.settings = Object.create(null);

MagicGestures.debug = function(msg){
    if (DEBUG) { console.debug(msg); }
};

// Runtime environment should be initialized only once...
MagicGestures.runtime = {
    get: function(keys, callback){
        chrome.storage.local.get("runtime", function(items){
            if (keys === null) {
                callback.call(null, items.runtime);
            } else {
                var result = {};
                if (keys instanceof Array) {
                    for (var i = keys.length - 1; i >= 0; i--) {
                        result[keys[i]] = items.runtime[keys[i]];
                    };
                } else {
                    result[keys] = items.runtime[keys];
                }
                callback.call(null, result);
            }
        });
        return void(0);
    },
    set: function(items, callback){
        chrome.storage.local.get("runtime", function(runtimeItems){
            for (var k in items) {
                runtimeItems.runtime[k] = items[k];
            };
            chrome.storage.local.set(runtimeItems, callback);
        });
        return void(0);
    },
    remove: function(key, callback){
        chrome.storage.local.get("runtime", function(runtimeItems){
            delete runtimeItems.runtime[key];
            chrome.storage.local.set(runtimeItems, callback);
        });
        return void(0);
    }
};

Object.defineProperty(MagicGestures.runtime, "gestureTrie", {
    get: function(){return gestureTrie;},
    set: function(value){
        gestureTrie = value;
        MagicGestures.runtime.set({gestureTrie: value});
    }
});

// Settings storage environment should be initialized only once.
// TODO: Settings storage beackend should be saved in MagicGestres.runtime.backend
MagicGestures.settings.storage = {
    _backend: chrome.storage.local,
    init: function(callback){
        MagicGestures.debug("Initializing settings storage environment...");
        chrome.storage.local.get("settings", function(items){
            if ("settings" in items ) {
                if ("type" in items.settings && items.settings.type === "sync"){
                    MagicGestures.settings.storage._backend = chrome.storage.sync;
                } else if (!("type" in items.settings)) {
                    items.settings.type = "local";
                    MagicGestures.settings.storage._backend.set(items);
                }
                if(callback != undefined) {callback.call(null);}
            } else {
                chrome.storage.local.set({settings: {type: "local"}}, callback);
            }
        });
        return void(0);
    },
    get: function(keys, callback){
        this._backend.get("settings", function(items){
            if (keys === null) {
                callback.call(null, items.settings);
            } else {
                var result = {};
                if (keys instanceof Array) {
                    for (var i = keys.length - 1; i >= 0; i--) {
                        result[keys[i]] = items.settings[keys[i]];
                    };
                } else {
                    result[keys] = items.settings[keys];
                }
                callback.call(null, result);
            }
        });
        return void(0);
    },
    set: function(items, callback){
        var storage = this;
        this._backend.get("settings", function(settingItems){
            for (var k in items){
                settingItems.settings[k] = items[k];
            };
            storage._backend.set(settingItems, callback);
        });
        return void(0);
    },
    remove: function(key, callback){
        this._backend.get("settings", function(settingItems){
            delete settingItems.settings[key];
            this._backend.set(settingItems, callback);
        });
        return void(0);
    },
    clear: function(callback){
        this._backend.set({settings: {}}, callback);
        return void(0);
    }
};

Object.defineProperties(MagicGestures.settings, {
    enable: {
        get: function(){return enable;},
        set: function(value){
            enable = value;
            MagicGestures.settings.storage.set({enable: value});
        }
    },
    holdBtn: {
        get: function(){return holdBtn;},
        set: function(value){
            holdBtn = value;
            MagicGestures.settings.storage.set({holdBtn: value});
        }
    },
    lineWidth: {
        get: function(){return lineWidth;},
        set: function(value){
            lineWidth = value;
            MagicGestures.settings.storage.set({lineWidth: value});
        }
    },
    lineColor: {
        get: function(){return lineColor;},
        set: function(value){
            lineColor = value;
            MagicGestures.settings.storage.set({lineColor: value});
        }
    }
});