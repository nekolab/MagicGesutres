/**
 * @fileoverview Magic Gestures content script file.
 * @author sunny@magicgestures.org {Sunny}
 * @version 0.0.1.0
 */

/*global MagicGestures: true */
/*jshint strict: true, globalstrict: true */

"use strict";

Object.defineProperty(MagicGestures, "tab", {
    value: Object.create(null, {
        clientWidth: {
            value: document.documentElement.clientWidth,
            writable: true
        },
        clientHeight: {
            value: document.documentElement.clientHeight,
            writable: true
        },
        gestureCanvas: {
            value: Object.create(null, {
                element: {
                    value: undefined,
                    writable: true
                },
                context2D: {
                    value: undefined,
                    writable: true
                }
            })
        },
        init: {
            value: function() {
                MagicGestures.runtime.getCurrentProfile(function(result) {
                    MagicGestures.runtime.currentProfile = result;
                    MagicGestures.tab.eventHandler.init();
                    MagicGestures.tab.mouseHandler.init();
                    MagicGestures.tab.gesture.possibleNext = result.gestureTrie;
                });
            }
        },
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
                    MagicGestures.tab.gestureCanvas.context2D.strokeStyle="#" + lineColor[0].toString(16) +
                        lineColor[1].toString(16) + lineColor[2].toString(16) + lineColor[3].toString(16);
                }
            }
        },
        destoryCanvas: {
            value: function() {
                if (this.gestureCanvas) {
                    document.body.removeChild(MagicGestures.tab.gestureCanvas.element);
                    MagicGestures.tab.gestureCanvas.context2D = MagicGestures.tab.gestureCanvas.element = undefined;
                }               
            }
        },
        gesture: {
            value: Object.create(null, {
                points: { value: [] },
                code: { value: "", writable: true },
                distance: { value: 0, writable: true },
                possibleNext: { value: undefined, writable: true },
                reset: {
                    value: function() {
                        MagicGestures.tab.gesture.code = "";
                        MagicGestures.tab.gesture.distance = 0;
                        MagicGestures.tab.gesture.points.length = 0;
                        MagicGestures.tab.gesture.possibleNext = MagicGestures.runtime.currentProfile.gestureTrie;
                    }
                }
            })
        },
        eventHandler: {
            value: Object.create(null, {
                init: {
                    value: function() {
                        window.addEventListener("resize", MagicGestures.tab.eventHandler.handle, true);
                    }
                },
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
        mouseHandler: {
            value: Object.create(null, {
                init: {
                    value: function() {
                        document.addEventListener("mousedown", MagicGestures.tab.mouseHandler.eventAdapter, true);
                    }
                },
                eventAdapter: {
                    value: function(event) {
                        if (event.button == MagicGestures.runtime.currentProfile.triggerButton) {
                            MagicGestures.tab.gesture.points.push({clientX: event.clientX, clientY: event.clientY});
                            MagicGestures.tab.mouseHandler.handle(event);
                        }
                    }
                },
                animationStroke: {
                    value: function() {
                        if (MagicGestures.tab.gestureCanvas.context2D) {
                            window.requestAnimationFrame(MagicGestures.tab.mouseHandler.animationStroke);
                            MagicGestures.tab.gestureCanvas.context2D.stroke();
                            MagicGestures.tab.gestureCanvas.context2D.beginPath();
                            var previousEvent = MagicGestures.tab.gesture.points.slice(-1)[0];
                            MagicGestures.tab.gestureCanvas.context2D.moveTo(previousEvent.clientX, previousEvent.clientY);
                        }
                    }
                },
                handle: {
                    value: function(event) {
                        switch(event.type) {
                            case "mousedown":
                                document.addEventListener("mousemove", MagicGestures.tab.mouseHandler.eventAdapter, true);
                                document.addEventListener("mouseup", MagicGestures.tab.mouseHandler.eventAdapter, true);
                                MagicGestures.tab.createCanvas();
                                MagicGestures.tab.gestureCanvas.context2D.beginPath();
                                MagicGestures.tab.gestureCanvas.context2D.moveTo(event.clientX, event.clientY);
                                window.requestAnimationFrame(MagicGestures.tab.mouseHandler.animationStroke);
                                break;
                            case "mousemove":
                                MagicGestures.tab.gestureCanvas.context2D.lineTo(event.clientX, event.clientY);
                                MagicGestures.directionEngine.update(MagicGestures.tab.gesture);
                                break;
                            case "mouseup":
                                document.removeEventListener("mousemove", MagicGestures.tab.mouseHandler.eventAdapter, true);
                                document.removeEventListener("mouseup", MagicGestures.tab.mouseHandler.eventAdapter, true);
                                MagicGestures.tab.destoryCanvas();
                                if (MagicGestures.tab.gesture.points.length > 5) {
                                    console.log(MagicGestures.tab.gesture, MagicGestures.tab.gesture.possibleNext.command);
                                    if (MagicGestures.tab.gesture.possibleNext.command) {
                                        MagicGestures.runtime.speak("ACT  ", MagicGestures.tab.gesture.possibleNext.command);
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
                                MagicGestures.logging.error("Mouse handler: Invaild event.");
                                break;
                        }
                    }
                }
            })
        }
    })
});

MagicGestures.init = function(){
    MagicGestures.logging.log("Initializing MagicGestures...");
    MagicGestures.runtime.init("content script", function(){
        MagicGestures.tab.init();
        MagicGestures.runtime.listener.add("SYNC", function(msg) {
            MagicGestures.runtime.getCurrentProfile(function(result) {
                MagicGestures.runtime.currentProfile = result;
            });
        });
    });
};

MagicGestures.init();