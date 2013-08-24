/**
 * @fileoverview Magic Gestures runtime and settings storage template.
 * @author sunny@magicgestures.org {Sunny}
 * @version 0.0.0.5
 */

const ASSERT = true; const DEBUG = true;
const ERROR  = true; const LOG   = true;
const INFO   = true; const WARN  = true;

var MagicGestures = Object.create(null);

Object.defineProperties(MagicGestures, {
    runtime: {
        value: Object.create(null),
        writable: true
    },
    settings: {
        value: Object.create(null),
        writable: true
    },
    assert: {
        value: function(bool, msg){
            if (ASSERT) console.assert(bool, msg);
        },
        writable: false
    },
    debug: {
        value: function(msg){
            if (DEBUG) console.debug(msg);
        },
        writable: false
    },
    error: {
        value: function(msg){
            if (ERROR) console.error(msg);
        },
        writable: false
    },
    log: {
        value: function(msg){
            if (LOG) console.log(msg);
        },
        writable: false
    },
    info: {
        value: function(msg){
            if (INFO) console.info(msg);
        },
        writable: false
    },
    warn: {
        value: function(msg){
            if (WARN) console.warn(msg);
        },
        writable: false
    }
});

// Runtime environment should be initialized only once...
Object.defineProperties(MagicGestures.runtime, {
    gestureTrie: {
        get: function(){return gestureTrie;},
        set: function(value){
            gestureTrie = value;
            MagicGestures.runtime.set({gestureTrie: value});
        }
    },
    storage_backend: {
        get: function(){
            if (typeof storage_backend !== "undefined") {
                if (storage_backend === "sync") {
                    return chrome.storage.sync;}
                if (storage_backend === "local") {
                    return chrome.storage.local;}
            }
            return undefined;
        },
        set: function(value){
            storage_backend = (value === chrome.storage.sync) ? "sync" : "local";
            MagicGestures.runtime.set({storage_backend: storage_backend});
        }
    },
    get: {
        value: function(keys, callback){
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
        writable: false
    },
    set: {
        value: function(items, callback){
            chrome.storage.local.get("runtime", function(runtimeItems){
                for (var k in items) {
                    runtimeItems.runtime[k] = items[k];
                };
                chrome.storage.local.set(runtimeItems, callback);
            });
            return void(0);
        },
        writable: false
    },
    remove: {
        value: function(key, callback){
            chrome.storage.local.get("runtime", function(runtimeItems){
                delete runtimeItems.runtime[key];
                chrome.storage.local.set(runtimeItems, callback);
            });
            return void(0);
        },
        writable: false
    }
});

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
    },
    storage: {
        value: Object.create(null),
        writable: true
    }
});

// Settings storage environment should be initialized only once.
Object.defineProperties(MagicGestures.settings.storage, {
    _backend: {
        get: function(){
            if (typeof _backend !== "undefined") { return _backend; }
            if (MagicGestures.runtime.storage_backend) {
                _backend = MagicGestures.runtime.storage_backend;
                return MagicGestures.runtime.storage_backend;}
            return undefined;
        },
        set: function(value){
            MagicGestures.runtime.storage_backend = _backend = value;
        }
    },
    init: {
        value: function(callback){
            MagicGestures.log("Initializing settings storage environment...");
            if (! MagicGestures.runtime.storage_backend) {
                chrome.storage.local.get("settings", function(items){
                    if ("settings" in items) {
                        if ("type" in items.settings && items.settings.type === "local") {
                            MagicGestures.settings.storage._backend = chrome.storage.local;
                        } else if ("type" in items.settings && items.settings.type === "sync") {
                            MagicGestures.settings.storage._backend = chrome.storage.sync;
                        } else {
                            items.type = "local";
                            chrome.storage.local.set(items);
                            MagicGestures.settings.storage._backend = chrome.storage.local;
                        }
                        if (callback !== undefined) { callback.call(null); }
                    } else {
                        MagicGestures.settings.storage._backend = chrome.storage.local;
                        chrome.storage.local.set({settings: {type: "local"}}, callback);
                    }
                });
            } else {
                MagicGestures.settings.storage._backend = MagicGestures.runtime.storage_backend;
                if (callback !== undefined) { callback.call(null); }
            }
            return void(0);
        },
        writable: false
    },
    get: {
        value: function(keys, callback){
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
        writable: false
    },
    set: {
        value: function(items, callback){
            var storage = this;
            this._backend.get("settings", function(settingItems){
                for (var k in items){
                    settingItems.settings[k] = items[k];
                };
                storage._backend.set(settingItems, callback);
            });
            return void(0);
        },
        writable: false
    },
    remove: {
        value: function(key, callback){
            this._backend.get("settings", function(settingItems){
                delete settingItems.settings[key];
                this._backend.set(settingItems, callback);
            });
            return void(0);
        },
        writable: false
    },
    clear: {
        value: function(callback){
            this._backend.set({settings: {}}, callback);
            return void(0);
        },
        writable: false
    }
});
