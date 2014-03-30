/**
 * @fileoverview Magic Gestures object.
 * @author sunny@magicgestures.org {Sunny}
 * @version 0.0.2.2
 */

/* global chrome: false */
/* jshint devel: true, esnext: true, forin: false, curly: false, strict: true, globalstrict: true */

"use strict";

var DIR = true, DEBUG = true, INFO = true;
var LOG = true, ERROR = true, WARN = true, ASSERT = true;

var MagicGestures = Object.create(null);

/**
 * Definition of basic MagicGestures object.
 * Inclueds:
 *  - logging: Wrap the console log function and use constant to control visiable.
 *  - runtime: Runtime is the object which provides communication between background
 *              and content script and provides basic background runtime presistant.
 */
Object.defineProperties(MagicGestures, {
    
    logging: {
        value: Object.create(null)
    },

    runtime: {
        value: Object.create(null)
    },

    /**
     * MagicGestures.osType
     * Indicate current operate system's type,
     * could be "windows", "MacOS" or "Linux",
     * if not detected, will be "Unknow OS".
     *
     * @type {string}
     */
    osType: {
        value: (function() {
            var osType="Unknown OS";
            if (navigator.appVersion.indexOf("Win") !=-1 ) osType = "Windows";
            if (navigator.appVersion.indexOf("Mac") !=-1 ) osType = "MacOS";
            if (navigator.appVersion.indexOf("Linux") !=-1 ) osType = "Linux";
            return osType;
        }())
    },

    /**
     * MagicGestures.isGTKChrome
     * Due to GTK version Chrome have some wired behavior,
     * so we need to detect it and add some workaround.
     *
     * @type {boolean}
     */
    isGTKChrome: {
        value: (function() {
            return navigator.appVersion.indexOf("Mac") != -1 || navigator.appVersion.indexOf("Linux") != -1;
        }())
    }
});

/**
 * Implemention of MagicGestures.logging module.
 */
Object.defineProperties(MagicGestures.logging, {
    assert: {
        value: function() {
            if (ASSERT)
                console.assert.apply(console, arguments);console.trace();
        }
    },
    debug: {
        value: function() {
            if (DEBUG)
                console.debug.apply(console, arguments);console.trace();
        }
    },
    dir: {
        value: function(object) {
            if (DIR)
                console.dir(object);
        }
    },
    error: {
        value: function() {
            if (ERROR)
                console.error.apply(console, arguments);console.trace();
        }
    },
    log: {
        value: function() {
            if (LOG)
                console.log.apply(console, arguments);
        }
    },
    info: {
        value: function() {
            if (INFO)
                console.info.apply(console, arguments);
        }
    },
    warn: {
        value: function() {
            if (WARN)
                console.warn.apply(console, arguments);console.trace();
        }
    }
});

/**
 * Implemention of MagicGestures.runtime module.
 */
Object.defineProperties(MagicGestures.runtime, {
    /**
     * MagicGestures.runtime.envName
     * Enviroment's name.
     * Value should be either "content script" or "background".
     * @type {string}
     */
    envName: {
        value: "",
        writable: true
    },

    /**
     * MagicGestures.runtime.runOnce
     * Initialize runtime enviroment.
     * THIS FUNCTION SHOULD BE INVOKED ONLY ONCE.
     */
    runOnce: {
        value: function() {
            MagicGestures.runtime.clear();
        }
    },

    /**
     * MagicGestures.runtime.init
     * Initialize magicgesutres runtime.
     * Initialize the commnuication function.
     * @param {string} envName Enviroment's name. Should be one of the "content script", "background", "options" or "popup".
     */
    init: {
        value: function(envName) {
            if (!(envName === "content script" || envName === "background" || envName === "options" || envName === "popup")) {
                MagicGestures.logging.error("Wrong syntax \"" + envName + "\" for MagicGestures runtime init!!!");
                return void(0);
            }
            MagicGestures.logging.info("Initializing MagicGestures runtime module for", envName, "...");

            MagicGestures.runtime.envName = envName;
            if (envName === "content script") {
                delete MagicGestures.runtime.get;
                delete MagicGestures.runtime.set;
                delete MagicGestures.runtime.clear;
                delete MagicGestures.runtime.remove;
                delete MagicGestures.runtime.tabBroadcast;
                delete MagicGestures.runtime.sendTabMessage;
            }
            chrome.runtime.onMessage.addListener(MagicGestures.runtime.messenger.messageReceiver);
        }
    },

    /**
     * MagicGestures.runtime.msgPacker
     * Message Packer is a packer to pack communication packet.
     * @param {string} dest Packet destination.
     * @param {string} type Packet type.
     * @param {object} msg  Anything you want to carry in packet.
     * @return {object} Packet.
     */
    msgPacker: {
        value: function(dest, type, msg) {
            if (dest !== "content script" && dest !== "background" && dest !== "options" && dest != "popup") {
                throw "Not a vaild destination";
            }
            return {
                dest: dest,
                type: type,
                msg : msg
            };
        }
    },

    /**
     * MagicGestures.runtime.tabBroadcast
     * Asynchronize function.
     * Broadcast packet to every tab.
     * This function will be disabled when magicgesture is initialized by content script.
     * @param {string} type Message type.
     * @param {any} msg Message content.
     * @param {function} responseCallback Response callback will be invoked if peer wants to reply you.
     */
    tabBroadcast: {
        value: function(type, msg, responseCallback) {
            var tabMessage = MagicGestures.runtime.msgPacker("content script", type, msg);
            chrome.tabs.query({}, function(result) {
                result.forEach(function(tab) {
                    chrome.tabs.sendMessage(tab.id, tabMessage, responseCallback);
                });
            });
        },
        configurable: true
    },

    /**
     * MagicGestures.runtime.sendTabMessage
     * Send message to specific tab.
     * This function will be disabled when magicgesture is initialized by content script.
     * @param {number} tabId ID of specific Tab.
     * @param {string} type Message type.
     * @param {any} msg Message content.
     * @param {function} responseCallback Response callback will be invoked if peer wants to reply you.
     */
    sendTabMessage: {
        value: function(tabId, type, msg, responseCallback) {
            var tabMessage = MagicGestures.runtime.msgPacker("content script", type, msg);
            chrome.tabs.sendMessage(tabId, tabMessage, responseCallback);
        },
        configurable: true
    },

    /**
     * MagicGestures.runtime.sendRuntimeMessage
     * Send message to everywhere (without content script).
     * This function can be used for every enviroment.
     * @param {string} dest -
     *      Destination of packet. Accept "content script", "background", "options" or "popup",
     *      You can use | to specific two or more destination or use "*" to specific all destination.
     * @param {string} type Message type.
     * @param {any} msg Message content.
     * @param {function} responseCallback Response callback will be invoked if peer wants to reply you. 
     */
    sendRuntimeMessage: {
        value: function(dest, type, msg, responseCallback) {
            var runtimeMessage = MagicGestures.runtime.msgPacker(dest, type, msg);
            chrome.runtime.sendMessage(runtimeMessage, responseCallback);
        }
    },

    /**
     * MagicGestures.runtime.get
     * Get one or more items storage in runtime storage.
     * @param {(string|Array.<string>|Object.<string, string>|null)} keys -
     *      A single key to get, list of keys to get or object to get which define default value.
     *      Pass null will get the total content of runtime storage.
     *
     * @returns {Object} Object which contains query result.
     */
    get: {
        value: function(keys) {
            var runtimeItems = localStorage.getItem("runtime");
            if (runtimeItems) {
                runtimeItems = JSON.parse(runtimeItems);
            } else {
                return MagicGestures.logging.error("No runtime module in localstorage!!!");
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
            return result;
        },
        configurable: true
    },

    /**
     * MagicGestures.runtime.set
     * Set one or more items from object into runtime storage.
     * @param {object.<string, object>} items -
     *      Object specifying items to augment storage with.
     *      Values that cannot be serialized will be replaced as an empty object.
     */
    set: {
        value: function(items) {
            var runtimeItems = JSON.parse(localStorage.getItem("runtime"));
            MagicGestures.logging.debug("Original items:", items);
            MagicGestures.logging.debug("Original runtimeItems:", runtimeItems);

            // Merge two objects
            for (var item in items) {
                runtimeItems[item] = items[item];
            }

            MagicGestures.logging.debug("After merge runtimeItems:", runtimeItems);
            localStorage.setItem("runtime", JSON.stringify(runtimeItems));
        },
        configurable: true
    },

    /**
     * MagicGestures.runtime.remove
     * Remove one or more items from runtime storage.
     * @param {(string|Array.<string>)} keys A single key or a list of keys for items to remove.
     */
    remove: {
        value: function(keys) {
            var runtimeItems = JSON.parse(localStorage.getItem("runtime"));
            localStorage.removeItem("runtime");

            // Convert string type key to array type keys
            if (typeof keys === "string") {
                keys = [keys];
            }
            // Delete keys from runtime storage.
            for (var i = keys.length - 1; i >= 0; i--) {
                delete runtimeItems[keys[i]];
            }

            localStorage.setItem("runtime", JSON.stringify(runtimeItems));
        },
        configurable: true
    },

    /**
     * MagicGestures.runtime.clear
     * Clear the runtime storage.
     */
    clear: {
        value: function() {
            localStorage.setItem("runtime", "{}");
        },
        configurable: true
    },

    /**
     * MagicGestures.runtime.messenger module is a module which provides basic message management.
     * This messenger will check all message passed by chrome.runtime.onMessage and pick
     * the message which destination is correct (or "*") and call action to handle it.
     * MagicGestures.runtime.messenger.action is an interface and should be implement in any enviroment.
     */
    messenger: {
        value: Object.create(null, {
            messageReceiver: {
                value: function(message, sender, sendResponse) {
                    if (message && message.dest && (message.dest.indexOf(MagicGestures.runtime.envName) >= 0 || message.dest.dest === "*")) {
                        MagicGestures.runtime.messenger.action(message.type, message.msg, sender, sendResponse);
                    }
                }
            },

            /**
             * MagicGestures.runtime.messenger.action is an interface which is writable and should be implemented.
             * Every message which destination is "*" or current enviroment's name will be send to here. 
             */
            action: {
                value: function(type, msg, sender, sendResponse) {},
                writable: true
            }
        })
    }

});
