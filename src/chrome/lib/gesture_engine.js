/**
 * @fileoverview Magic Gestures direction engine.
 * @author sunny@magicgestures.org {Sunny}
 * @version 0.0.0.5
 */

/*global MagicGestures: true */
/*jshint strict: true, globalstrict: true */

"use strict";

Object.defineProperty(MagicGestures, "directionEngine", {
    value: Object.create(null, {
        update: {
            value: function(gesturePtr, endForce) {
                var previousPoint = gesturePtr.directionPoints[gesturePtr.directionPoints.length - 1];
                var lastPoint = gesturePtr.lastEvent;

                var deltaX = lastPoint.clientX - previousPoint.clientX;
                var deltaY = lastPoint.clientY - previousPoint.clientY;

                var prevDir = (gesturePtr.code === "") ? "" : gesturePtr.code[gesturePtr.code.length - 1];
                
                var currentDir;
                if (Math.abs(deltaX) >= (endForce ? 1 : 2) * Math.abs(deltaY)) {
                    currentDir = (deltaX > 0) ? "R" : "L";
                } else if ((endForce ? 1 : 2) * Math.abs(deltaX) < Math.abs(deltaY)) {
                    currentDir = (deltaY > 0) ? "D" : "U";
                }

                //gesturePtr.distance += Math.sqrt(deltaX * deltaX + deltaY * deltaY);

                if (currentDir && currentDir === prevDir) {
                    gesturePtr.directionPoints[gesturePtr.directionPoints.length - 1] = {clientX: lastPoint.clientX, clientY: lastPoint.clientY};
                }

                if ((Math.abs(deltaX) > 15 || Math.abs(deltaY) > 15) && (currentDir && currentDir !== prevDir)) {
                    gesturePtr.code += currentDir;
                    gesturePtr.directionPoints.push({clientX: lastPoint.clientX, clientY: lastPoint.clientY});

                    if (currentDir in gesturePtr.possibleNext) {
                        gesturePtr.possibleNext = gesturePtr.possibleNext[currentDir];
                    } else {
                        gesturePtr.possibleNext = {};
                    }
                }

            }
        }
    })
});