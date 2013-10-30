/**
 * @fileoverview MagicGestures profile manager.
 * @author sunny@magicgestures.org {Sunny}
 * @version 0.0.0.1
 */

/*global MagicGestures: true */
/*jshint strict: true, globalstrict: true */

"use strict";

Object.defineProperty(MagicGestures, "Util", {
    value: Object.create(null, {
        /**
         * Useage: Generate hexdigital 16-character length random string.
         * @return {string} ID string. 
         */
        generateId: {
            value: function() {
                var s4 = function () {
                  return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
                };
                return s4() + s4() + s4() + s4();
            }
        },
        /**
         * Useage: Generate gesture trie for specific profile.
         * @param {object} profile MagicGestures.Profile.
         * @return {object} Gesture trie.
         */
        generateTrie: {
            value: function(profile) {
                var gestureTrie = Object.create(null);
                profile.gestures.forEach(function(gesture) {
                    var currentRoot = gestureTrie;
                    for (var i = 0; i < gesture.dir.length; i++) {
                        var ch = gesture.dir.charAt(i);
                        if (!(ch in currentRoot)) {
                            currentRoot[ch] = Object.create(null);
                        }
                        currentRoot = currentRoot[ch];
                    }
                    currentRoot.command = gesture.name;
                });
                return gestureTrie;
            }
        }
    }),
    enumerable: true
});