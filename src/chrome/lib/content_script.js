/**
 * @fileoverview Magic Gestures content script file.
 * @author sunny@magicgestures.org {Sunny}
 * @version 0.0.3.7
 */

/* global MagicGestures: true, chrome: false */
/* jshint strict: true, globalstrict: true */

"use strict";

/**
 * Definition of MagicGestures.tab.
 */
Object.defineProperty(MagicGestures, "tab", {
    value: Object.create(null, {
        
        /**
         * MagicGestures.tab.clientWidth
         * Return browser window width
         * @return {Number}
         */
        clientWidth: {
            get: function() {
                return document.documentElement.clientWidth;  
            }
        },

        /**
         * MagicGestures.tab.clientHeight
         * Return browser window height
         * @return {Number}
         */
        clientHeight: {
            get: function() {
                return document.documentElement.clientHeight;  
            }
        },

        /**
         * MagicGestures.tab.gestureCanvas
         * Gesture canvas object
         * @type {Object}
         */
        gestureCanvas: {
            value: Object.create(null, {
                /**
                 * MagicGestures.tab.gestureCanvas.element
                 * Current canvas element
                 * @type {HTMLDOMElement}
                 */
                element: {
                    value: undefined,
                    writable: true
                },

                /**
                 * MagicGestures.tab.gestureCanvas.context2D
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
         * MagicGestures.tab.lastRightClick
         * A timestamp record the last right click event,
         * which will be used on GTK chrome to enable compatibility right click mode.
         * @type {number}
         */
        lastRightClick: {
            value: 0,
            writable: true
        },

        /**
         * MagicGestures.tab.init
         * Initialize MagicGestures.tab
         */
        init: {
            value: function() {
                MagicGestures.tab.mouseHandler.init();
            }
        },

        /**
         * MagicGestures.tab.createCanvas
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
         * MagicGestures.tab.destoryCanvas
         * Remove canvas from web context and destory it.
         */
        destoryCanvas: {
            value: function() {
                if (MagicGestures.tab.gestureCanvas.element) {
                    document.body.removeChild(MagicGestures.tab.gestureCanvas.element);
                    MagicGestures.tab.gestureCanvas.context2D = MagicGestures.tab.gestureCanvas.element = undefined;
                }
            }
        },

        /**
         * MagicGestures.tab.gesture
         * Current drawn gesture.
         */
        gesture: {
            value: Object.create(null, {

                /**
                 * MagicGestures.tab.gesture.data
                 * Data which current gesture carries.
                 * @type {any}
                 */
                data: { value: undefined, writable: true },

                /**
                 * MagicGestures.tab.gesture.points
                 * Points is an array of point like [x,y,x,y,....,x,y].
                 * Each point logged by mouse event will add into this list.
                 * @type {Array.<Number>}
                 */
                points: { value: [] },

                /**
                 * MagicGestures.tab.gesture.dependency
                 * Gesture's dependency.
                 * Currently we accept "wheel", "link" or "".
                 * @type {string}
                 */
                dependency: {value: "", writable: true },

                /**
                 * MagicGestures.tab.gesture.directionPoints
                 * Direction points is an array of point like {x: xx, y:yy}
                 * It stores points which used by direction engine.
                 * @type {Array.<Object.<String, number>>}
                 */
                directionPoints: { value: [] },

                /**
                 * MagicGestures.tab.gesture.code
                 * Current gesture's code.
                 * Code is a group of character which indicate the direction of gesture.
                 * @type {String}
                 */
                code: { value: "", writable: true },

                /**
                 * MagicGestures.tab.gesture.distance
                 * Distance of current gesture.
                 * This is reserved for furture use.
                 * @type {Number}
                 */
                distance: { value: 0, writable: true },

                /**
                 * MagicGestures.tab.gesture.possibleNext
                 * Possible next is a part of gesture tire which can indicate next possible direction or action.
                 * @type {Object}
                 */
                possibleNext: { value: undefined, writable: true },

                /**
                 * MagicGestures.tab.gesture.lastEvent
                 * Last mouse event for draw use.
                 * @type {Event}
                 */
                lastEvent: {value: undefined, writable: true},

                /**
                 * MagicGestures.tab.gesture.neuralNetwork
                 * Neural network.
                 * @type {Network}
                 */
                neuralNetwork: {value: undefined, writable: true},

                /**
                 * MagicGestures.tab.gesture.reset
                 * Reset gesture object to empty.
                 */
                reset: {
                    value: function() {
                        MagicGestures.tab.gesture.code = "";
                        MagicGestures.tab.gesture.distance = 0;
                        MagicGestures.tab.gesture.dependency = "";
                        MagicGestures.tab.gesture.data = undefined;
                        MagicGestures.tab.gesture.points.length = 0;
                        MagicGestures.tab.gesture.lastEvent = undefined;
                        MagicGestures.tab.gesture.directionPoints.length = 0;
                        MagicGestures.tab.gesture.possibleNext = MagicGestures.runtime.currentProfile.gestureTrie;
                    }
                }
            })
        },

        /**
         * MagicGestures.tab.disableContextMenu
         * Function which can disable context menu once.
         */
        disableContextMenu: {
            value: function(e) {
                e.preventDefault();
                e.stopPropagation();
                document.oncontextmenu = null;
            }
        },

        /**
         * MagicGestures.tab.animationStroke
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
         * MagicGestures.tab.mouseHandler
         * Mouse handler handle every mouse event and process it.
         */
        mouseHandler: {
            value: Object.create(null, {
                /**
                 * MagicGestures.tab.mouseHandler.init
                 * Register event listeners and redirect event to event Adapter.
                 */
                init: {
                    value: function() {
                        document.addEventListener("mousedown", MagicGestures.tab.mouseHandler.eventAdapter, true);
                    }
                },

                /**
                 * MagicGestures.tab.mouseHandler.eventAdapter
                 * Event adapter filter mouse event, only trigger button will be send to transition function.
                 * Also, event adapter will add points to current gesture's points.
                 */
                eventAdapter: {
                    value: function(event) {
                        if (event.button == MagicGestures.runtime.currentProfile.triggerButton) {
                            MagicGestures.tab.gesture.points.push(event.clientX, event.clientY);
                            MagicGestures.tab.gesture.lastEvent = event;
                            MagicGestures.tab.mouseHandler.transition(event);
                        }
                    }
                },

                /**
                 * MagicGestures.tab.mouseHandler.currentState
                 * Current FSM state, default to free.
                 * @type {string}
                 */
                currentState: {
                    value: "free",
                    writable: true
                },

                /**
                 * MagicGestures.tab.mouseHandler.resetFSM
                 * Clear gestrue states, remove canvas and reset FSM states when invaild event happend.
                 */
                resetFSM: {
                    value: function() {
                        document.removeEventListener("mousemove", MagicGestures.tab.mouseHandler.eventAdapter, true);
                        document.removeEventListener("mouseup", MagicGestures.tab.mouseHandler.eventAdapter, true);
                        window.removeEventListener("mousewheel", MagicGestures.tab.mouseHandler.transition, false);
                        MagicGestures.tab.gesture.reset();
                        MagicGestures.tab.destoryCanvas();
                        MagicGestures.tab.mouseHandler.currentState = "free";
                    }
                },

                /**
                 * MagicGestures.tab.mouseHandler.transition
                 * Transit FSM state
                 */
                transition: {
                    value: function(event) {
                        switch(MagicGestures.tab.mouseHandler.currentState) {
                            case "free":
                                if (event.type == "mousedown") {
                                    if (MagicGestures.isGTKChrome && new Date().getTime() - MagicGestures.tab.lastRightClick <= 300) {
                                        MagicGestures.tab.lastRightClick = new Date().getTime();
                                        break;
                                    } else if (MagicGestures.isGTKChrome) {
                                        document.oncontextmenu = MagicGestures.tab.disableContextMenu;
                                        MagicGestures.tab.lastRightClick = new Date().getTime();
                                    }

                                    document.addEventListener("mousemove", MagicGestures.tab.mouseHandler.eventAdapter, true);
                                    document.addEventListener("mouseup", MagicGestures.tab.mouseHandler.eventAdapter, true);
                                    window.addEventListener("mousewheel", MagicGestures.tab.mouseHandler.transition, false);

                                    if (event.srcElement.tagName === "A") {
                                        //MagicGestures.tab.gesture.code = "l";
                                        MagicGestures.tab.gesture.dependency = "link";
                                        MagicGestures.tab.gesture.data = {
                                            href: event.srcElement.href
                                        };
                                    }
                                    MagicGestures.tab.gesture.directionPoints.push({clientX:event.clientX, clientY:event.clientY});

                                    MagicGestures.tab.mouseHandler.currentState = "pushed";
                                } else {
                                    MagicGestures.logging.error("FSM: Invaild event while free:", event);
                                    MagicGestures.tab.mouseHandler.resetFSM();
                                }
                                break;
                            case "pushed":
                                switch(event.type) {
                                    case "mousewheel":
                                        event.preventDefault();
                                        MagicGestures.tab.gesture.dependency = "wheel";
                                        var wheelActions = MagicGestures.runtime.currentProfile.gestureTrie.wheel;
                                        var action = (event.wheelDelta > 0) ? wheelActions.U : wheelActions.D;
                                        MagicGestures.logging.log(action.command);
                                        MagicGestures.runtime.sendRuntimeMessage("background", "gesture ACTION", {command: action.command});
                                        if (!MagicGestures.isGTKChrome)
                                            document.oncontextmenu = MagicGestures.tab.disableContextMenu;
                                        break;
                                    case "mouseup":
                                        document.removeEventListener("mousemove", MagicGestures.tab.mouseHandler.eventAdapter, true);
                                        document.removeEventListener("mouseup", MagicGestures.tab.mouseHandler.eventAdapter, true);
                                        window.removeEventListener("mousewheel", MagicGestures.tab.mouseHandler.transition, false);
                                        MagicGestures.tab.gesture.reset();

                                        MagicGestures.tab.mouseHandler.currentState = "free";
                                        break;
                                    case "mousemove":
                                        // Workaround for chrome-side issue 5598. (See http://crbug.com/5598)
                                        if (event.clientX != MagicGestures.tab.gesture.points[0] &&
                                                event.clientY != MagicGestures.tab.gesture.points[1]) {
                                            window.removeEventListener("mousewheel", MagicGestures.tab.mouseHandler.transition, false);
                                            MagicGestures.DirectionEngine.update(MagicGestures.tab.gesture, false);
                                            MagicGestures.tab.mouseHandler.currentState = "ready";
                                        }
                                        
                                        break;
                                    default:
                                        MagicGestures.logging.error("FSM: Invaild event while pushed:", event);
                                        MagicGestures.tab.mouseHandler.resetFSM();
                                        break;
                                }
                                break;
                            case "ready":
                                switch (event.type) {
                                    case "mousemove":
                                        MagicGestures.DirectionEngine.update(MagicGestures.tab.gesture, false);
                                        if (MagicGestures.tab.gesture.points.length > 10) {
                                            MagicGestures.tab.createCanvas();
                                            MagicGestures.tab.gestureCanvas.context2D.beginPath();
                                            var firstPoint = MagicGestures.tab.gesture.points;
                                            MagicGestures.tab.gestureCanvas.context2D.moveTo(firstPoint[0], firstPoint[1]);
                                            MagicGestures.tab.gestureCanvas.context2D.lineTo(event.clientX, event.clientY);
                                            window.requestAnimationFrame(MagicGestures.tab.animationStroke);
                                            MagicGestures.tab.mouseHandler.currentState = "working";
                                        }
                                        break;
                                    case "mouseup":
                                        document.removeEventListener("mousemove", MagicGestures.tab.mouseHandler.eventAdapter, true);
                                        document.removeEventListener("mouseup", MagicGestures.tab.mouseHandler.eventAdapter, true);
                                        window.removeEventListener("mousewheel", MagicGestures.tab.mouseHandler.transition, false);
                                        MagicGestures.tab.gesture.reset();

                                        MagicGestures.tab.mouseHandler.currentState = "free";
                                        break;
                                    default:
                                        MagicGestures.logging.error("FSM: Invaild event while ready:", event);
                                        MagicGestures.tab.mouseHandler.resetFSM();
                                        break;
                                }
                                break;
                            case "working":
                                switch (event.type) {
                                    case "mousemove":
                                        MagicGestures.tab.gestureCanvas.context2D.lineTo(event.clientX, event.clientY);
                                        MagicGestures.DirectionEngine.update(MagicGestures.tab.gesture, false);
                                        break;
                                    case "mouseup":
                                        MagicGestures.tab.gestureCanvas.context2D.lineTo(event.clientX, event.clientY);
                                        MagicGestures.DirectionEngine.update(MagicGestures.tab.gesture, true);
                                        document.removeEventListener("mousemove", MagicGestures.tab.mouseHandler.eventAdapter, true);
                                        document.removeEventListener("mouseup", MagicGestures.tab.mouseHandler.eventAdapter, true);
                                        window.removeEventListener("mousewheel", MagicGestures.tab.mouseHandler.transition, false);
                                        MagicGestures.tab.destoryCanvas();
                                        MagicGestures.GestureEngine.recognize();

                                        if (!MagicGestures.isGTKChrome)
                                            document.oncontextmenu = MagicGestures.tab.disableContextMenu;
                                        MagicGestures.tab.gesture.reset();
                                        MagicGestures.tab.mouseHandler.currentState = "free";
                                        break;
                                    default:
                                        MagicGestures.logging.error("FSM: Invaild event while working:", event);
                                        MagicGestures.tab.mouseHandler.resetFSM();
                                        break;
                                }
                                break;
                            default:
                                MagicGestures.logging.error("FSM: Invaild state:", MagicGestures.tab.mouseHandler.currentState);
                                break;
                        }
                    }
                }
            })
        }
    })
});

/**
 * Initialize MagicGestures on each page.
 */
MagicGestures.init = function(){
    MagicGestures.logging.log("Initializing MagicGestures...");
    MagicGestures.runtime.init("content script");
    // Load settings from storage.local.
    chrome.storage.local.get("activedProfileCache", function(activedProfile) {
        activedProfile = activedProfile.activedProfileCache;
        MagicGestures.runtime.currentProfile = activedProfile;
        MagicGestures.tab.gesture.possibleNext = activedProfile.gestureTrie;
        MagicGestures.tab.gesture.neuralNetwork = MagicGestures.NeuralNetEngine.rebuildNetwork(activedProfile.neuralNetInfo);
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