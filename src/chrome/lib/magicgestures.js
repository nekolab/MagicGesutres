/**
 * @fileoverview Magic Gestures object.
 * @author sunny@magicgestures.org {Sunny}
 * @version 0.0.1.1
 */

/*global chrome: false */
/*jshint devel: true, esnext: true, strict: true */

"use strict";

var DIR = true, DEBUG = true, INFO = true;
var LOG = true, ERROR = true, WARN = true, ASSERT = true;

var MagicGestures = Object.create(null);

//Basic MagicGestures Object
Object.defineProperties(MagicGestures, {
    logging: {
        value: Object.create(null),
        writable: true
    },
    runtime: {
        value: Object.create(null),
        writable: true
    },
    directionEngine: {
        value: Object.create(null),
        writable: true
    },
    AIEngine: {
        value: Object.create(null),
        writable: true
    }
});

//MagicGestures.logging module
Object.defineProperties(MagicGestures.logging, {
    assert: {
        value: function(){
            if (ASSERT) {
                console.assert.apply(null, arguments);
            }
        },
        writable: false
    },
    debug: {
        value: function(){
            if (DEBUG) {
                console.debug.apply(null, arguments);
            }
        },
        writable: false
    },
    dir: {
        value: function(object){
            if (DIR) {
                console.dir(object);
            }
        },
        writable: false
    },
    error: {
        value: function(){
            if (ERROR) {
                console.error.apply(null, arguments);
            }
        },
        writable: false
    },
    log: {
        value: function(){
            if (LOG) {
                console.log.apply(null, arguments);
            }
        },
        writable: false
    },
    info: {
        value: function(){
            if (INFO) {
                console.info.apply(null, arguments);
            }
        },
        writable: false
    },
    warn: {
        value: function(){
            if (WARN) {
                console.warn.apply(null, arguments);
            }
        },
        writable: false
    }
});

//MagicGestures.runtime module
Object.defineProperties(MagicGestures.runtime, {
    // Enviroment name.
    // Value should be one of the "content script" or "background".
    envName: {
        value: null,
        writable: true
    },
    // Initialize function.
    // Initialize the speak and listener for content script / background page.
    // envName: Should be one of the "content script" or "background"
    init: {
        value: function(envName) {
            if (envName !== "content script" && envName !== "background") {
                MagicGestures.logging.error("Wrong syntax for MagicGestures init!!!");
            }
            MagicGestures.logging.info("Initializing", envName, "MagicGestures Module...");
            if (envName === "content script") {
                this.speak = function(msg, responseCallback) {
                    chrome.runtime.sendMessage(msg, responseCallback);
                };
            } else {
                this.speak = function(tabId, msg, responseCallback) {
                    chrome.tabs.sendMessage(tabId, msg, responseCallback);
                };
            }
            chrome.runtime.onMessage.addListener(this.listener.execute);
        },
        writable: false
    },
    // Get one or more items storage in runtime storage.
    // keys: A single key to get, list of keys to get.
    //       Pass null will get the total useage of runtime storage.
    // callback: With the object of names and theirs value as syntax.
    //           An empty list or object will return an empty result object.
    get: {
        value: function(keys, callback) {
            chrome.storage.local.get("runtime", function(runtimeItems) {
                if (typeof keys === "undefined" || keys === null) {
                    callback.call(null, runtimeItems);
                } else if (Object.keys(keys).length === 0) {
                    callback.call(null, Object.create(null));
                } else if (Object.prototype.toString.call(keys) === "[object Object]") {
                    // Find one or more items in runtime object
                    var result = Object.create(null);
                    for (var key in keys) {
                        //Check own property
                        if (keys.hasOwnProperty(key)) {
                            result[key] = (key in runtimeItems) ? runtimeItems[key] : keys[key];
                        }
                    }
                    callback.call(null, result);
                } else {
                    // Convert string type key to array type keys
                    if (typeof keys === "string") {
                        keys = [keys];
                    }
                    // Find one or more items in runtime object
                    var result = Object.create(null);
                    for (var i = keys.length - 1; i >= 0; i--) {
                        if(keys[i] in runtimeItems) {
                            result[keys[i]] = runtimeItems[keys[i]];
                        }
                    }
                    callback.call(null, result);
                }
            });
        },
        writable: false
    },
    // Set one or more items from object into runtime storage.
    // items: Object specifying items to augment storage with.
    //        Values that cannot be serialized (functions, etc) will be ignored.
    // callback: Callback on success, or on failure (in which case runtime.lastError will be set).
    set: {
        value: function(items, callback) {
            this.get(null, function(runtimeItems) {
                MagicGestures.logging.debug("Original items:");
                MagicGestures.logging.dir(items);
                MagicGestures.logging.debug("Original runtimeItems:");
                MagicGestures.logging.dir(runtimeItems);
                // Merge two objects
                for (var item in items) {
                    runtimeItems[item] = items[item];
                }
                MagicGestures.logging.debug("After merge runtimeItems:");
                MagicGestures.logging.dir(runtimeItems);
                chrome.storage.local.set({runtime: runtimeItems}, callback);
            });
        },
        writable: false
    },
    // Remove one or more items from runtime storage.
    // keys: A single key or a list of keys for items to remove.
    // callback: Callback on success, or on failure (in which case runtime.lastError will be set).
    remove: {
        value: function(keys, callback) {
            this.get(null, function(runtimeItems) {
                // Convert string type key to array type keys
                if (typeof keys === "string") {
                    keys = [keys];
                }
                // Delete keys from runtime storage.
                for (var i = keys.length - 1; i >= 0; i--) {
                    delete runtimeItems[keys[i]];
                }
                chrome.storage.local.set({runtime: runtimeItems}, callback);
            });
        },
        writable: false
    },
    // Clear the runtime storage.
    // callback: Callback on success, or on failure (in which case runtime.lastError will be set).
    clear: {
        value: function(callback) {
            chrome.storage.local.set({runtime: Object.create(null)}, callback);
        },
        writable: false
    },
    // Listener is an object which provides event management function.
    listener: {
        value: Object.create(null),
        writable: false
    },
    // Profile which is actived.
    // Use this property is for speed the read and make async oprate become sync.
    // Eachtime we update the current profile, we should send a message "currentProfileUpdated" to update it.
    currentProfile: {
        get: function() {
            if (this.envName === "background") {
                MagicGestures.logging.error("Background Page CANNOT read runtime current profile.");
                return;
            }
            if (typeof currentProfile === "undefined") {
                this.get({currentProfile: Object.create(null)}, function(result) {
                    // Make sure result.currentProfile is not undefined because it will stuck in while.
                    if (typeof result === "undefined" || typeof result.currentProfile === "undefined") {
                        currentProfile = Object.create(null);
                    } else {
                        currentProfile = result.currentProfile;
                    }
                });
                this.listener.add("currentProfileUpdated", function() {
                    currentProfile = undefined;
                });
                while(typeof currentProfile === "undefined");
            }
            return currentProfile;
        },
        // Set current profile.
        // Use only for background page.
        set: function(value) {
            if (this.envName === "background") {
                currentProfile = value;
                this.set({currentProfile: value}, function() {
                    chrome.tabs.query({}, function(tabs) {
                        tabs.forEach(function(tab) {
                            chrome.tabs.sendMessage(tab.id, "currentProfileUpdated");
                        });
                    });
                });
            } else {
                MagicGestures.logging.error("Content Script CANNOT set current profile.");
            }
        }
    }
});

//MagicGestures.runtime.listener module.
Object.defineProperties(MagicGestures.runtime.listener, {
    // eventPool is a pool object which maintain the name-callback relationship.
    eventPool: {
        value: Object.create(null),
        writable: false
    },
    // Function "add" puts event into event pool.
    // name: Event's name, should be same as chrome message name.
    // callback: The event's action function.
    //           In content script, callback will only receive the messsage send from background,
    //               So we provide only a syntax named sendResponse to send response to background.
    //               sendResponse's signature is sendResponse(any message)
    //           In background page, it will receive message from multi tabs,
    //               so callback will be passed a syntax which can identify which tab sent this message.
    //               also sendResponse will be passed to callback for optional send response.
    add: {
        value: function(name, callback) {
            if (name in this.eventPool) {
                delete this.eventPool[name];
            }
            this.eventPool[name] = callback;
        },
        writable: false
    },
    // Function "remove" removes event from event pool.
    // name: Event's name
    remove: {
        value: function(name) {
            delete this.eventPool[name];
        },
        writable: false
    },
    // Function "execute" should be registed in chrome.runtime.onMessage
    // If it receive a message equals event's name, it will call the callback function.
    execute: {
        value: function(request, sender, sendResponse) {
            if (request in this.eventPool) {
                this.eventPool[request].apply(null, sender.tab ? [sendResponse] : [sender.tab, sendResponse]);
            }
        },
        writable: false
    }
});
