/**
 * @fileoverview Native JavaScript Actions. 
 * @author sunny@magicgestures.org {Sunny}
 * @version 0.0.2.0
 */

/* global MagicGestures: true */
/* jshint strict: true, globalstrict: true */

"use strict";

Object.defineProperty(MagicGestures, "Actions", {
    value: (MagicGestures.Actions) ? MagicGestures.Actions : Object.create(Object.prototype),
    enumerable: true
});

Object.defineProperties(MagicGestures.Actions, {

    history_back: {
        value: {
            category: "Navigation",
            dependency: "none",
            description: "Go back to the page in this tab's history",
            isNativeJSAction: true,
            action: function() {
                history.back();
            }
        },
        enumerable: true
    },

    history_forward: {
        value: {
            category: "Navigation",
            dependency: "none",
            description: "Go forward to the page in this tab's history",
            isNativeJSAction: true,
            action: function(tab) {
                history.forward();
            }
        },
        enumerable: true
    },

    print_tab: {
        value: {
            category: "Page",
            dependency: "none",
            description: "Print the current tab",
            isNativeJSAction: true,
            action: function(tab) {
                window.print();
            }
        },
        enumerable: true
    },

    stop_loading: {
        value: {
            category: "Navigation",
            dependency: "none",
            description: "Stop loading the current tab",
            isNativeJSAction: true,
            action: function(tab) {
                window.stop();
            }
        },
        enumerable: true
    },

    scroll_to_top: {
        value: {
            category: "Page",
            dependency: "none",
            description: "Scroll to the top of the page",
            isNativeJSAction: true,
            action: function(tab) {
                window.scroll(0, 0);
            }
        },
        enumerable: true
    },

    scroll_to_bottom: {
        value: {
            category: "Page",
            dependency: "none",
            description: "Scroll to the bottom of the page",
            isNativeJSAction: true,
            action: function(tab) {
                window.scrollTo(0, Math.max.apply(null, [document.documentElement.scrollHeight, document.body.scrollHeight]));
            }
        },
        enumerable: true
    }
});