/**
 * @fileoverview Magic Gestures identification engine.
 * @author sunny@magicgestures.org {Sunny}
 * @version 0.0.0.5
 */

/*global MagicGestures: true */
/*jshint strict: true, globalstrict: true, forin: false */

"use strict";

Object.defineProperty(MagicGestures, "DirectionEngine", {
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
        },

        /**
         * Useage: Generate gesture trie for specific profile.
         * ToDo: Optimize this function's performance.
         * @param {object} profile MagicGestures.Profile.
         * @return {object} Gesture trie.
         */
        generateTrie: {
            value: function(profile) {
                var gestureTrie = Object.create(null);

                var createSubTrie = function(gesture) {
                    var currentRoot = gestureTrie;

                    if (gesture.dependency === "wheel" || gesture.dependency === "link") {
                        var prefix = gesture.dependency[0];
                        if (!(prefix in currentRoot)) {
                            currentRoot[prefix] = Object.create(null);
                        }
                        currentRoot = currentRoot[prefix];
                    }

                    for (var i = 0; i < gesture.code.length; i++) {
                        var ch = gesture.code.charAt(i);
                        if (!(ch in currentRoot)) {
                            currentRoot[ch] = Object.create(null);
                        }
                        currentRoot = currentRoot[ch];
                    }
                    currentRoot.command = action;
                };

                for (var action in profile.gestureMap) {
                    profile.gestureMap[action].forEach(createSubTrie);
                }

                return gestureTrie;
            }
        }
    })
});

Object.defineProperty(MagicGestures, "NeuralNetEngine", {
    value: Object.create(null, {
        rebuildNetwork: function(neunetInfo) {
            var Network = function(details) {
                this.inputCount = details.inputCount;
                this.hiddenCount = details.hiddenCount;
                this.outputCount = details.outputCount;
                this.hiddenWeights = details.hiddenWeights;
                this.outputWeights = details.outputWeights;
                this.outputActions = details.outputActions;

                this.think = function(inputs) {

                    //Check length
                    if (inputs.length !== this.inputCount)
                        throw "Not a vaild input for neural network engine.";

                    //Calculate hidden output
                    var i, j;
                    var hiddenOutputs = [];
                    for (i = this.hiddenCount - 1; i >= 0; --i) {
                        var hiddenOutput = 0;
                        hiddenOutput += this.hiddenWeights[(i + 1) * (this.inputCount + 1) - 1] * -1;
                        for (j = this.inputCount - 1; j >= 0; --j) {
                            hiddenOutput += this.hiddenWeights[i * (this.inputCount + 1) + j] * inputs[j];
                        }
                        hiddenOutputs.append(hiddenOutput);
                    }

                    //Calculate final output
                    var outputOutputs = [];
                    for (i = this.outputCount - 1; i >= 0; --i) {
                        var outputOutput = 0;
                        outputOutput += this.outputWeights[(i + 1) * (this.hiddenCount + 1) - 1] * -1;
                        for (j = this.hiddenCount - 1; j >= 0; --j) {
                            outputOutput += this.outputWeights[i * (this.hiddenCount + 1) + j] * hiddenOutputs[j];
                        }
                        outputOutputs.append(outputOutput);
                    }

                    return this.outputActions[outputOutputs.indexOf(Math.max(outputOutputs))];
                };
            };
            
            return new Network(neunetInfo);
        }
    })
});