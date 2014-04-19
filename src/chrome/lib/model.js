/**
 * @fileoverview Profile and Gesture model.
 * @author sunny@magicgestures.org {Sunny}
 * @version 0.0.2.7
 */

/*global MagicGestures: true */
/*jshint strict: true, globalstrict: true */

"use strict";

/**
 * Represents an action.
 * @constructor
 */
MagicGestures.Action = function(action) {

    /**
     * Indicates action's name
     * @type {string}
     */
    this.name = "";

    /**
     * Indicates gesutre's dependency of other condition.
     * Currently only accept either "wheel" or "link".
     * Empty string indicates no dependency.
     * @type {string}
     */
    this.dependency = "";

    if (action) {
        for (var item in action) {
            if (this.hasOwnProperty(item)) {
                this[item] = action[item];
            } else {
                MagicGestures.logging.warn("Not a vaild action member:", item);
            }
        }
    }
};

/**
 * Represents a gesture.
 * @constructor
 */
MagicGestures.Gesture = function(gesture) {

    /**
     * Indicates gesture's direction.
     * Use U(p), D(own), L(eft), R(ight) represent direction.
     * @type {string}
     */
    this.code = "";

    /**
     * Store the point information for neural network use.
     * @type {Array.<Array.<number>>}
     */
    this.featureVectors = [];

    /**
     * Indicates whether this gesture is enabled or not.
     */
    this.enabled = true;

    /**
     * Store each action in gesture.
     * Each dependency has ONLY one action.
     * @type {Array.<MagicGestures.Action>}
     */
    this.actions = [];

    if (gesture) {
        for (var item in gesture) {
            if (this.hasOwnProperty(item)) {
                this[item] = gesture[item];
            } else {
                MagicGestures.logging.warn("Not a vaild gesture member:", item);
            }
        }
    }
};

/**
 * Represents a profile.
 * @constructor
 */
MagicGestures.Profile = function(profile) {
    /**
     * Profile's ID.
     * Should be unique.
     * @type {string}
     */
    this.id = "";

    /**
     * Profile's name.
     * @type {string}
     */
    this.name = "";

    /**
     * Profile's description.
     * @type {string}
     */
    this.description = "";

    /**
     * Profile's timestamp.
     * Indicate the last time when profile be edited.
     * @type {number}
     */
    this.timestamp = new Date().getTime();

    /**
     * Indicate the whole profile is enabled or not.
     * If a profile is set as not enabled,
     * it shouldn't be inserted into content script.
     * @type {boolean}
     */
    this.enable = true;

    /**
     * Indicate whether the profile is synced or not.
     * @type {boolean}
     */
    this.sync = true;

    /**
     * Indicate the profile is readonly or not.
     * @type {boolean}
     */
    this.readOnly = false;

    /**
     * Indicate the type of filter list,
     * Should be one of the Profile.Types.BLACKLIST or Profile.Types.WHITELIST.
     * Default to value Profile.Types.BLACKLIST
     * @type {string}
     */
    this.listType = 0xc02;

    /**
     * Indicate the content of filter list.
     * Should be array of string.
     * @type {Array.<string>}
     */
    this.listContent = [];

    /**
     * Indicate which button can trigger the gesture.
     * Value can be one of the Profile.Types.LEFT, Profile.Types.RIGHT or Profile.Types.MIDDLE
     * Default to value Profile.Types.RIGHT
     * @type {string}
     */
    this.triggerButton = 2;

    /**
     * Disable mouse gesture temporary when specific key was pressed.
     * Key "when" accept "Alt" and "Ctrl".
     * @type {Object.<string, string|boolean>}
     */
    this.disableGesture = {
        when: "Alt",
        enabled: false
    };

    /**
     * Indicate whether to draw the gesture locus or not.
     * @type {boolean}
     */
    this.drawLocus = true;

    /**
     * Indicate the color of locus.
     * Color will be stored as array with the order RGBA.
     * Default to black.
     * @type {Array.<number>}
     */
    this.locusColor = [255, 255, 255, 1];

    /**
     * Locus color visitor.
     * Can parse string to number.
     * All changes will be reflected on this.locusColor.
     */
    this.lineColor = Object.create(null);
    var MagicProfile = this;
    Object.defineProperties(this.lineColor, {
        red: {
            get: function() {
                return MagicProfile.locusColor[0];
            },
            set: function(value) {
                MagicProfile.locusColor[0] = parseFloat(value);
            }
        },
        green: {
            get: function() {
                return MagicProfile.locusColor[1];
            },
            set: function(value) {
                MagicProfile.locusColor[1] = parseFloat(value);
            }
        },
        blue: {
            get: function() {
                return MagicProfile.locusColor[2];
            },
            set: function(value) {
                MagicProfile.locusColor[2] = parseFloat(value);
            }
        },
        alpha: {
            get: function() {
                return MagicProfile.locusColor[3];
            },
            set: function(value) {
                MagicProfile.locusColor[3] = parseFloat(value);
            }
        }
    });

    /**
     * Indicate the width of locus.
     * Unit is px, default to 2.
     * @type {number}
     */
    var locusWidth = 2;
    this.__defineGetter__("locusWidth", function() {
        return locusWidth;
    });
    this.__defineSetter__("locusWidth", function(value) {
        locusWidth = parseFloat(value);
    });

    /**
     * Locus time to live (ttl) means gesture will be canceled after specified seconds with no action.
     * @type {Object.<string, number|boolean>}
     */
    this.ttl = {
        value: 3,
        enabled: false
    };

    /**
     * An array which store gestures.
     * @type {Array.<MagicGestures.Gesture>}
     */
    this.gestures = [];

    /**
     * Since I just want to support only up and down wheel gestures currently,
     * Use an object store action name with key "U" and "D" is a good solution.
     * @type {Object.<String, String>}
     */
    this.wheelGestures = {
        U: {
            enabled: false,
            command: "scroll_to_top"
        },
        D: {
            enabled: false,
            command: "scroll_to_bottom"
        }
        // Furture link support.
    };

    /**
     * This varible is the place to cache the gesture tire which complied from gestures. 
     * @type {object.<string, object.<string, object|string|boolean>>}
     */
    this.gestureTrie = undefined;

    /**
     * Indicate whether the neural network is trained or not.
     * @type {boolean}
     */
    this.trained = true;

    /**
     * NeuralNet is the object which stores info about neural network.
     * @type {string|object}
     */
    this.neuralNetInfo = '{"inputCount":0,"hiddenCount":0,"outputCount":0,"actionsList":[],"hiddenWeights":[],"outputWeights":[]}';

    if (profile) {
        for (var item in profile) {
            if (this.hasOwnProperty(item)) {
                if (item !== "lineColor")
                    this[item] = profile[item];
            } else {
                MagicGestures.logging.warn("Not a vaild profile member:", item);
            }
        }
    }
};

/**
 * Types enum in Profile.
 * @enum {number}
 */
MagicGestures.Profile.Types = {
    LEFT     : 0,
    MIDDLE   : 1,
    RIGHT    : 2,
    WHITELIST: 0xc01,
    BLACKLIST: 0xc02
};