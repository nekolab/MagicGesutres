/**
 * @fileoverview Magic Gestures object.
 * @author sunny@magicgestures.org {Sunny}
 * @version 0.0.1.9
 */

/*global chrome: false */
/*jshint devel: true, esnext: true, forin: false, curly: false, strict: true, globalstrict: true */

"use strict";

var DIR = true, DEBUG = true, INFO = true;
var LOG = true, ERROR = true, WARN = true, ASSERT = true;

var MagicGestures = Object.create(null);

/**
 * Basic MagicGestures object define.
 * Inclueds:
 *  - logging: Wrap the console log function and use constant to control visiable.
 *  - runtime: Runtime is the object which provides communication 
 *             and basic data share between background and content script.
 */
Object.defineProperties(MagicGestures, {
    logging: {
        value: Object.create(null)
    },
    runtime: {
        value: Object.create(null)
    }
});

/**
 * Implemention of MagicGestures.logging module.
 */
Object.defineProperties(MagicGestures.logging, {
    assert: {
        value: function(){
            if (ASSERT)
                console.assert.apply(console, arguments);
        }
    },
    debug: {
        value: function(){
            if (DEBUG)
                console.debug.apply(console, arguments);
        }
    },
    dir: {
        value: function(object){
            if (DIR)
                console.dir(object);
        }
    },
    error: {
        value: function(){
            if (ERROR)
                console.error.apply(console, arguments);
        }
    },
    log: {
        value: function(){
            if (LOG)
                console.log.apply(console, arguments);
        }
    },
    info: {
        value: function(){
            if (INFO)
                console.info.apply(console, arguments);
        }
    },
    warn: {
        value: function(){
            if (WARN)
                console.warn.apply(console, arguments);
        }
    }
});

/**
 * Implemention of MagicGestures.runtime module.
 */
Object.defineProperties(MagicGestures.runtime, {
    /**
     * Enviroment's name.
     * Value should be either "content script" or "background".
     * @type {string}
     */
    envName: {
        value: null,
        writable: true
    },

    /**
     * Initialize function.
     * Initialize the speak and listener for content script / background page.
     * @param {string} envName Enviroment's name. Should be either "content script" or "background".
     * @param {runtime~initCallback} Callback will be invoked after initialized.
     *
     * @callback {runtime~initCallback}
     */
    init: {
        value: function(envName, callback, isStartup) {
            if (envName !== "content script" && envName !== "background") {
                MagicGestures.logging.error("Wrong syntax \"" + envName + "\" for MagicGestures runtime init!!!");
                return void(0);
            }
            MagicGestures.logging.info("Initializing", envName, "MagicGestures runtime module...");

            var internalInit = function() {
                MagicGestures.runtime.envName = envName;
                if (envName === "content script") {
                    MagicGestures.runtime.speak = function(type, msg, responseCallback) {
                        if (type.length !== 5)
                            throw "Not a vaild type.";
                        chrome.runtime.sendMessage(chrome.runtime.id, "RUNTIME:" + type + ":" + msg, responseCallback);
                    };
                } else {
                    MagicGestures.runtime.speak = function(tabId, type, msg, responseCallback) {
                        if (type.length !== 5)
                            throw "Not a vaild type.";
                        chrome.tabs.sendMessage(tabId, "RUNTIME:" + type + ":" + msg, responseCallback);
                    };
                }
                chrome.runtime.onMessage.addListener(MagicGestures.runtime.listener.execute);
                if (callback)
                    callback.call(null);
            };

            chrome.storage.local.get("runtime", function(runtimeItems) {
                if (!runtimeItems.runtime || isStartup) {
                    MagicGestures.runtime.clear(internalInit)
                } else {
                    internalInit();
                }
            });
        }
    },

    /**
     * Get one or more items storage in runtime storage.
     * @param {(string|Array.<string>|Object.<string, string>)} keys -
     *      A single key to get, list of keys to get or object to get which define default value.
     *      Pass null will get the total content of runtime storage.
     * @param {runtime~getCallback} callback Callback will be invoked after request data is ready.
     * 
     * @callback {runtime~getCallback}
     * @param {object} result The data your request.
     */
    get: {
        value: function(keys, callback) {
            chrome.storage.local.get("runtime", function(runtimeItems) {
                if (runtimeItems.runtime) {
                    runtimeItems = runtimeItems.runtime;
                } else {
                    return MagicGestures.logging.error("No runtime module in storage.local!!!");
                }
                var result = Object.create(null);
                if (typeof keys === "undefined" || keys === null) {
                    result = runtimeItems;
                } else if (Object.prototype.toString.call(keys) === "[object Object]") {
                    // Find one or more items in runtime object
                    for (var key in keys) {
                        //Check own property
                        if (keys.hasOwnProperty(key)) {
                            result[key] = (key in runtimeItems) ? runtimeItems[key] : keys[key];
                        }
                    }
                } else {
                    // Convert string type key to array type keys
                    if (typeof keys === "string") {
                        keys = [keys];
                    }
                    // Find one or more items in runtime object
                    for (var i = keys.length - 1; i >= 0; i--) {
                        if(keys[i] in runtimeItems) {
                            result[keys[i]] = runtimeItems[keys[i]];
                        }
                    }
                }
                if (callback)
                    callback.call(null, result);
            });
        }
    },

    /**
     * Set one or more items from object into runtime storage.
     * @param {object.<string, object>} items -
     *      Object specifying items to augment storage with.
     *      Values that cannot be serialized will be replaced as an empty object.
     * @param {runtime~setCallback} callback Callback on success, or on failure (in this case runtime.lastError will be set).
     *
     * @callback {runtime~setCallback}
     */
    set: {
        value: function(items, callback) {
            MagicGestures.runtime.get(null, function(runtimeItems) {
                MagicGestures.logging.debug("Original items:", items);
                MagicGestures.logging.debug("Original runtimeItems:", runtimeItems);
                // Merge two objects
                for (var item in items) {
                    runtimeItems[item] = items[item];
                }
                MagicGestures.logging.debug("After merge runtimeItems:", runtimeItems);
                chrome.storage.local.set({runtime: runtimeItems}, callback);
            });
        }
    },

    /**
     * Remove one or more items from runtime storage.
     * @param {(string|Array.<string>)} keys A single key or a list of keys for items to remove.
     * @param {runtime~removeCallback} Callback on success, or on failure (in which case runtime.lastError will be set).
     *
     * @callback {runtime~removeCallback}
     */
    remove: {
        value: function(keys, callback) {
            var MagicRuntime = MagicGestures.runtime;
            MagicRuntime.get(null, function(runtimeItems) {
                MagicRuntime.clear(function() {
                    // Convert string type key to array type keys
                    if (typeof keys === "string") {
                        keys = [keys];
                    }
                    // Delete keys from runtime storage.
                    for (var i = keys.length - 1; i >= 0; i--) {
                        delete runtimeItems[keys[i]];
                    }
                    MagicRuntime.set(runtimeItems, callback);
                });
            });
        }
    },

    /**
     * Clear the runtime storage.
     * @param {runtime~clearCallback} Callback on success, or on failure (in which case runtime.lastError will be set).
     *
     * @callback {runtime~clearCallback}
     */
    clear: {
        value: function(callback) {
            chrome.storage.local.set({runtime: Object.create(null)}, callback);
        }
    },

    // Listener is an object which provides runtime message management.
    listener: {
        value: Object.create(null)
    },

    /**
     * CurrentProfile is the profile which is actived.
     * "currentProfile" in runtime enviroment is a subset of current profile.
     * Eachtime we update the current profile, we will send a RUNTIME SYNC message named "currentProfileUpdated",
     *      every content script should listen this name event and update current profile reference in themselves.
     * @param {runtime~getCurrentProfileCallback} callback Will be invoked after current profile is ready.
     *
     * @callback {runtime~getCurrentProfileCallback}
     * @param {object} result - 
     *       The content of current profile.
     *       If there is no current profile in runtime storage, will return a empty object.
     */
    getCurrentProfile: {
        value: function(callback) {
            if (MagicGestures.runtime.envName === "background") {
                MagicGestures.logging.error("Background Page CANNOT read runtime current profile.");
                return;
            }
            MagicGestures.runtime.get({currentProfile: Object.create(null)}, function(result) {
                callback.call(null, result.currentProfile);
            });
        }
    },

    /**
     * Set current profile.
     * Use only for background page.
     * @param {object} value content of current profile.
     * @param {runtime~setCurrentProfileCallback} callback Callback will be invoked after set done.
     *
     * @callback {runtime~setCurrentProfileCallback}
     */
    setCurrentProfile: {
        value: function(value, callback) {
            if (MagicGestures.runtime.envName === "background") {
                MagicGestures.runtime.set({currentProfile: value}, function() {
                    chrome.tabs.query({}, function(tabs) {
                        tabs.forEach(function(tab) {
                            chrome.tabs.sendMessage(tab.id, "RUNTIME:SYNC :currentProfileUpdated");
                        });
                    });
                }, callback);
            } else {
                MagicGestures.logging.error("Content Script CANNOT set current profile.");
            }
        }
    }
});

/**
 * MagicGestures.runtime.listener module is a module which provides runtime message management.
 * This listener will check all message passed by chrome.runtime.onMessage and pick
 * the event name start with "RUNTIME:" and find event registed in event pool.
 */
Object.defineProperties(MagicGestures.runtime.listener, {
    /**
     * eventPool is a pool object which maintain the name-callback relationship.
     * @type {object.<string, event>}
     */
    eventPool: {
        value: Object.create(null)
    },

    /**
     * Put event into event pool.
     * @param {string} type Event's type. 
     * @param {runtime.listener~addCallback} callback Callback should be invoked when specified event fired.
     *
     * In content script, callback will only receive the messsage send from background,
     * So we provide two syntaxs: "msg" is message provide by event and "sendResponse" to send response to background.
     *
     * In background page, it will receive message from multi tabs,
     * so expect above syntaxs, callback will be passed a syntax which can identify which tab sent this message.
     *
     * @callback {runtime.listener~addCallback}
     * @param {string} msg Message carried by event.
     * @param {function} sendResponse It's a function which can reply this event, you can pass any message to it.
     * @param {MessageSender} sender Message sender (only avaliable to background page).
     */
    add: {
        value: function(type, callback) {
            if (type in MagicGestures.runtime.listener.eventPool) {
                delete MagicGestures.runtime.listener.eventPool[type];
            }
            MagicGestures.runtime.listener.eventPool[type] = callback;
        }
    },

    /**
     * Remove event from event pool.
     * @param {string} type Event's type.
     */
    remove: {
        value: function(type) {
            delete MagicGestures.runtime.listener.eventPool[type];
        }
    },

    /**
     * Function "execute" should be registed in chrome.runtime.onMessage
     * If it receive a message equals event's name, it will call the callback function.
     */
    execute: {
        value: function(request, sender, sendResponse) {
            if (typeof(request) === "string") {
                if (request.indexOf("RUNTIME:") === 0 && request.slice(8, 13).trim() in MagicGestures.runtime.listener.eventPool) {
                    MagicGestures.runtime.listener.eventPool[request.slice(8, 13).trim()].apply(null,
                        sender.tab ? [request.slice(14), sendResponse, sender] : [request.slice(14), sendResponse]);
                }
            }
        }
    }
});
