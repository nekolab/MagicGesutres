/**
 * @fileoverview Magic Gestures direction engine.
 * @author sunny@magicgestures.org {Sunny}
 * @version 0.0.0.2
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

Object.defineProperty(MagicGestures, "NeuralNetEngine", {
    value: Object.create(null, {
        rebuildNetwork: function(neunetInfo) {
            var network = function(details) {
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
                    var hiddenOutputs = [];
                    for (var i = this.hiddenCount - 1; i >= 0; --i) {
                        var hiddenOutput = 0;
                        hiddenOutput += hiddenWeights[(i + 1) * (this.inputCount + 1) - 1] * -1;
                        for (var j = this.inputCount - 1; j >= 0; --j) {
                            hiddenOutput += hiddenWeights[i * (this.inputCount + 1) + j] * inputs[j];
                        }
                        hiddenOutputs.append(hiddenOutput);
                    }

                    //Calculate final output
                    var outputOutputs = [];
                    for (var i = this.outputCount - 1; i >= 0; --i) {
                        var outputOutput = 0;
                        outputOutput += outputWeights[(i + 1) * (this.hiddenCount + 1) - 1] * -1;
                        for (var j = this.hiddenCount - 1; j >= 0; --j) {
                            outputOutput += outputWeights[i * (this.hiddenCount + 1) + j] * hiddenOutputs[j];
                        }
                        outputOutputs.append(outputOutput);
                    }

                    return outputActions[outputOutputs.indexOf(Math.max(outputOutputs))];
                }
            };
            
            return new network(neunetInfo);
        }
    })
});