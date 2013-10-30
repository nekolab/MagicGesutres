/**
 * @fileoverview Magic Gestures direction engine.
 * @author sunny@magicgestures.org {Sunny}
 * @version 0.0.0.1
 */

/*global MagicGestures: true */
/*jshint strict: true, globalstrict: true */

"use strict";

Object.defineProperty(MagicGestures, "directionEngine", {
    value: Object.create(null, {
        update: {
            value: function(gesturePtr) {
                var last2point = gesturePtr.points.slice(-2);

                var deltaX = last2point[1].clientX - last2point[0].clientX;
                var deltaY = last2point[1].clientY - last2point[0].clientY;
                var prevDir = (gesturePtr.code === "") ? "" : gesturePtr.code[gesturePtr.code.length - 1];
                var currentDir;

                if (Math.abs(deltaX) >= Math.abs(deltaY)) {
                    currentDir = (deltaX > 0) ? "R" : "L";
                } else if (Math.abs(deltaX) < Math.abs(deltaY)) {
                    currentDir = (deltaY > 0) ? "D" : "U";
                }

                //gesturePtr.distance += Math.sqrt(deltaX * deltaX + deltaY * deltaY);

                if ((Math.abs(deltaX) > 15 || Math.abs(deltaY) > 15) && (currentDir !== prevDir)) {
                    gesturePtr.code += currentDir;

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