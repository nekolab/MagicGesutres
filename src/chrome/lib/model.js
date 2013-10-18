/**
 * @fileoverview Profile and Gesture model.
 * @author sunny@magicgestures.org {Sunny}
 * @version 0.0.0.5
 */

/*global MagicGestures: true */
/*jshint strict: true, globalstrict: true */

"use strict";

MagicGestures.Gesture = function(gesture) {
    /**
     * Indicates gesture's direction.
     * Use U(p), D(own), L(eft), R(ight) represent direction.
     * @type {string}
     */
    this.dir = "";

    /**
     * Indicates gesture's name.
     * @type {string}
     */
    this.name = "";

    /**
     * Store the point information for furture use.
     * @type {Array.<Array.<number>, Array.<number>>}
     */
    this.pointInfo = [];

    if (gesture) {
        for (var item in gesture) {
            if (this.hasOwnProperty(item)) {
                this[item] = gesture[item];
            }
        }
    }
};


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
     * @type {string}
     */
    this.listType = "blacklist";

    /**
     * Indicate the content of filter list.
     * Should be array of string.
     * @type {Array.<string>}
     */
    this.listContent = [];

    /**
     * Indicate which button can trigger the gesture.
     * Value can be one of the Profile.Types.LEFT, Profile.Types.RIGHT or Profile.Types.MIDDLE
     * @type {string}
     */
    this.triggerButton = "right";

    /**
     * Indicate whether disable gesture when alt pressed or not.
     * @type {boolean}
     */
    this.disableWhenAlt = false;

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
     * Indicate the width of locus.
     * Unit is px, default to 2.
     * @type {number}
     */
    this.locusWidth = 2;

    /**
     * Locus time to live (ttl) means gesture will be canceled after specified seconds with no action.
     * Set to 0 means disable this option and alway show locus.
     * @type {number}
     */
    this.ttl = 0;

    /**
     * Varible gesutres store a list of gesture.
     * @type {Array.<MagicGestures.Gesture>}
     */
    this.gestures = [];

    /**
     * This varible is the place to cache the gesture tire which complied from gestures. 
     * @type {object.<string, object.<string, object|string|boolean>>}
     */
    this.gestureTrie = undefined;

    /**
     * NeuralNet is the object which stores info about neural network.
     * @type {object}
     */
    this.neuralNet = undefined;

    if (profile) {
        for (var item in profile) {
            if (this.hasOwnProperty(item)) {
                this[item] = profile[item];
            }
        }
    }
};

/**
 * Types enum in Profile.
 * @enum {string}
 */
MagicGestures.Profile.Types = {
    BLACKLIST: "blacklist",
    WHITELIST: "whitelist",
    LEFT     : "left",
    RIGHT    : "right",
    MIDDLE   : "middle"
};