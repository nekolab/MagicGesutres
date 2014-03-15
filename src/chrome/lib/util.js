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
         * MagicGestures.Util.generateId
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
        }
    }),
    enumerable: true
});