/**
 * @fileoverview Magic Gestures content script file.
 * @author sunny@magicgestures.org {Sunny}
 * @version 0.0.1.8
 */

/*global MagicGestures: true, chrome: false */
/*jshint strict: true, globalstrict: true */

"use strict";

/**
 * Definition of MagicGestures.tab.
 */
Object.defineProperty(MagicGestures, "tab", {
    value: Object.create(null, {
        
        /**
         * Browser window width
         * @type {Number}
         */
        clientWidth: {
            value: document.documentElement.clientWidth,
            writable: true
        },

        /**
         * Browser window height
         * @type {Number}
         */
        clientHeight: {
            value: document.documentElement.clientHeight,
            writable: true
        },

        /**
         * Gesture canvas object
         * @type {Object}
         */
        gestureCanvas: {
            value: Object.create(null, {
                /**
                 * Current canvas element
                 * @type {HTMLDOMElement}
                 */
                element: {
                    value: undefined,
                    writable: true
                },

                /**
                 * Current canvas's contenxt
                 * @type {CanvasRenderingContext2D}
                 */
                context2D: {
                    value: undefined,
                    writable: true
                }
            })
        },

        /**
         * Initialize MagicGestures.tab
         * 
         */
        init: {
            value: function() {
                MagicGestures.tab.eventHandler.init();
                MagicGestures.tab.mouseHandler.init();
            }
        },

        /**
         * Create a canvas and insert it into web context.
         */
        createCanvas: {
            value: function() {
                if (!MagicGestures.tab.gestureCanvas.element) {
                    MagicGestures.tab.gestureCanvas.element = document.createElement("canvas");
                    MagicGestures.tab.gestureCanvas.element.setAttribute("id", "MagicGesturesDrawCanvas");
                    MagicGestures.tab.gestureCanvas.element.setAttribute("style", "position: fixed; left: 0px; " +
                        "top: 0px; display: block; z-index: 999999; border: none; background-color: transparent;");
                    MagicGestures.tab.gestureCanvas.element.setAttribute("width", MagicGestures.tab.clientWidth);
                    MagicGestures.tab.gestureCanvas.element.setAttribute("height", MagicGestures.tab.clientHeight);
                    document.body.appendChild(MagicGestures.tab.gestureCanvas.element);

                    MagicGestures.tab.gestureCanvas.context2D = MagicGestures.tab.gestureCanvas.element.getContext("2d");
                    MagicGestures.tab.gestureCanvas.context2D.lineWidth = MagicGestures.runtime.currentProfile.locusWidth;
                    MagicGestures.tab.gestureCanvas.context2D.lineCap = "round";
                    MagicGestures.tab.gestureCanvas.context2D.lineJoin = "round";
                    var lineColor = MagicGestures.runtime.currentProfile.locusColor;
                    MagicGestures.tab.gestureCanvas.context2D.strokeStyle = 
                        "rgba(" + lineColor[0] + "," + lineColor[1] + "," + lineColor[2] + "," + lineColor[3] + ")";
                }
            }
        },

        /**
         * Remove canvas from web context and destory it.
         */
        destoryCanvas: {
            value: function() {
                if (this.gestureCanvas) {
                    document.body.removeChild(MagicGestures.tab.gestureCanvas.element);
                    MagicGestures.tab.gestureCanvas.context2D = MagicGestures.tab.gestureCanvas.element = undefined;
                }               
            }
        },

        /**
         * Current drawn gesture.
         */
        gesture: {
            value: Object.create(null, {
                /**
                 * Points is an array of point like {x: xx, y:yy}
                 * Each point logged by mouse event will add into this list.
                 * @type {Array.<Object.<String, Number>>}
                 */
                points: { value: [] },

                /**
                 * Direction points is an array of point like {x: xx, y:yy}
                 * It stores points which used by direction engine.
                 * @type {Array.<Object.<String, number>>}
                 */
                directionPoints: { value: [] },

                /**
                 * Current gesture's code.
                 * Code is a group of character which indicate the direction of gesture.
                 * @type {String}
                 */ 
                code: { value: "", writable: true },

                /**
                 * Distance of current gesture.
                 * This is reserved for furture use.
                 * @type {Number}
                 */
                distance: { value: 0, writable: true },

                /**
                 * Possible next is a part of gesture tire which can indicate next possible direction or action.
                 * @type {Object}
                 */
                possibleNext: { value: undefined, writable: true },

                /**
                 * Last mouse event for draw use.
                 * @type {Event}
                 */
                lastEvent: {value: undefined, writable: true},

                /**
                 * Reset gesture object to empty.
                 */
                reset: {
                    value: function() {
                        MagicGestures.tab.gesture.code = "";
                        MagicGestures.tab.gesture.distance = 0;
                        MagicGestures.tab.gesture.points.length = 0;
                        MagicGestures.tab.gesture.lastEvent = undefined;
                        MagicGestures.tab.gesture.directionPoints.length = 0;
                        MagicGestures.tab.gesture.possibleNext = MagicGestures.runtime.currentProfile.gestureTrie;
                    }
                }
            })
        },

        /**
         * Event handler handle every event in MagicGestures.tab except mouse event.
         */
        eventHandler: {
            value: Object.create(null, {
                /**
                 * Register the event listener.
                 */
                init: {
                    value: function() {
                        window.addEventListener("resize", MagicGestures.tab.eventHandler.handle, true);
                    }
                },

                /**
                 * Handle function, all event will send to here.
                 */
                handle: {
                    value: function(event) {
                        switch(event.type) {
                            case "resize":
                                MagicGestures.logging.debug("Window resized!!!");
                                MagicGestures.tab.clientWidth  = document.documentElement.clientWidth;
                                MagicGestures.tab.clientHeight = document.documentElement.clientHeight;
                                break;
                            default:
                                MagicGestures.logging.error("Event handler: Invaild event.");
                                break;
                        }
                    }
                }
            })
        },

        /**
         * animationStroke is a auto draw manager.
         * It can draw(stroke) then begin a new path.
         * It will run forver until gesture canvas destoried.
         */
        animationStroke: {
            value: function() {
                if (MagicGestures.tab.gestureCanvas.context2D) {
                    window.requestAnimationFrame(MagicGestures.tab.animationStroke);
                    MagicGestures.tab.gestureCanvas.context2D.stroke();
                    MagicGestures.tab.gestureCanvas.context2D.beginPath();
                    MagicGestures.tab.gestureCanvas.context2D.moveTo(
                        MagicGestures.tab.gesture.lastEvent.clientX, MagicGestures.tab.gesture.lastEvent.clientY);
                }
            }
        },

        /**
         * Mouse handler handle every mouse event and process it.
         */
        mouseHandler: {
            value: Object.create(null, {
                /**
                 * Register event listeners and redirect event to event Adapter.
                 */
                init: {
                    value: function() {
                        document.addEventListener("mousedown", MagicGestures.tab.mouseHandler.eventAdapter, true);
                    }
                },

                /**
                 * Event adapter filter mouse event, only trigger button will be send to handle function.
                 * Also, event adapter will add points to current gesture's points.
                 */
                eventAdapter: {
                    value: function(event) {
                        if (event.button == MagicGestures.runtime.currentProfile.triggerButton) {
                            MagicGestures.tab.gesture.points.push({clientX: event.clientX, clientY: event.clientY});
                            MagicGestures.tab.gesture.lastEvent = event;
                            MagicGestures.tab.mouseHandler.handle(event);
                        }
                    }
                },

                /**
                 * Handel every type of mouse event.
                 */
                handle: {
                    value: function(event) {
                        switch(event.type) {
                            case "mousedown":
                                document.addEventListener("mousemove", MagicGestures.tab.mouseHandler.eventAdapter, true);
                                document.addEventListener("mouseup", MagicGestures.tab.mouseHandler.eventAdapter, true);
                                window.addEventListener("mousewheel", MagicGestures.tab.mouseHandler.handle, false);
                                MagicGestures.tab.gesture.directionPoints.push({clientX:event.clientX, clientY:event.clientY});
                                MagicGestures.tab.createCanvas();
                                MagicGestures.tab.gestureCanvas.context2D.beginPath();
                                MagicGestures.tab.gestureCanvas.context2D.moveTo(event.clientX, event.clientY);
                                window.requestAnimationFrame(MagicGestures.tab.animationStroke);
                                break;
                            case "mousewheel":
                                if (MagicGestures.tab.gesture.points.length <= 5) {
                                    document.removeEventListener("mousemove", MagicGestures.tab.mouseHandler.eventAdapter, true);
                                    var wheelActions = MagicGestures.runtime.currentProfile.gestureTrie.w;
                                    var action = (event.wheelDelta > 0) ? wheelActions.U : wheelActions.D;
                                    MagicGestures.logging.log(action.command);
                                    MagicGestures.runtime.sendRuntimeMessage("background", "gesture ACTION", {command: action.command});
                                    document.oncontextmenu = function(e) {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        document.oncontextmenu = null;
                                    };
                                    return false;
                                }
                                break;
                            case "mousemove":
                                MagicGestures.tab.gestureCanvas.context2D.lineTo(event.clientX, event.clientY);
                                MagicGestures.directionEngine.update(MagicGestures.tab.gesture, false);
                                break;
                            case "mouseup":
                                MagicGestures.directionEngine.update(MagicGestures.tab.gesture, true);
                                document.removeEventListener("mousemove", MagicGestures.tab.mouseHandler.eventAdapter, true);
                                document.removeEventListener("mouseup", MagicGestures.tab.mouseHandler.eventAdapter, true);
                                window.removeEventListener("mousewheel", MagicGestures.tab.mouseHandler.handle, false);
                                MagicGestures.tab.destoryCanvas();
                                if (MagicGestures.tab.gesture.points.length > 5) {
                                    MagicGestures.logging.log(MagicGestures.tab.gesture, MagicGestures.tab.gesture.possibleNext.command);
                                    if (MagicGestures.tab.gesture.possibleNext.command) {
                                        var msg = {command: MagicGestures.tab.gesture.possibleNext.command}
                                        MagicGestures.runtime.sendRuntimeMessage("background", "gesture ACTION", msg);
                                    }
                                    document.oncontextmenu = function(e) {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        document.oncontextmenu = null;
                                    };
                                }
                                MagicGestures.tab.gesture.reset();
                                break;
                            default:
                                MagicGestures.logging.error("Mouse handler: Invaild event.", event);
                                break;
                        }
                    }
                }
            })
        }
    })
});

/**
 * Initialize function of MagicGestures
 */
MagicGestures.init = function(){
    MagicGestures.logging.log("Initializing MagicGestures...");
    MagicGestures.runtime.init("content script");
    // Load settings from storage.local.
    chrome.storage.local.get("activedProfileCache", function(activedProfile) {
        MagicGestures.runtime.currentProfile = activedProfile.activedProfileCache;
        MagicGestures.tab.gesture.possibleNext = activedProfile.activedProfileCache.gestureTrie;
        // Initialize MagicGestures.tab after load the profile.
        MagicGestures.tab.init();
        // Show page action for current tab.
        MagicGestures.runtime.sendRuntimeMessage("background", "page_action ACTION", {command: "show"});

        // Auto update when activedProfileCache changed.
        chrome.storage.onChanged.addListener(function(changes, areaName) {
            if (areaName == "local" && "activedProfileCache" in changes) {
                MagicGestures.runtime.currentProfile = activedProfile.activedProfileCache;
                MagicGestures.tab.gesture.possibleNext = activedProfile.activedProfileCache.gestureTrie;
            }
        });
    });
};

MagicGestures.init();