/**
 * @fileoverview Magic Gestures identification engine.
 * @author sunny@magicgestures.org {Sunny}
 * @version 0.0.3.2
 */

/* global MagicGestures: true, chrome: false */
/* jshint strict: true, globalstrict: true, forin: false, debug: true */

"use strict";

Object.defineProperty(MagicGestures, "GestureEngine", {
    value: Object.create(null, {
        
        /**
         * MagicGestures.GestureEngine.recognize
         * Recognize gesture which user input.
         * Currently, we use a conservative strategy to balance the direction engine and neural network.
         */
        recognize: {
            value: function() {
                MagicGestures.NeuralNetEngine.pointFilter(MagicGestures.tab.gesture.points);
                var normalizedPoints = MagicGestures.NeuralNetEngine.normalize(MagicGestures.tab.gesture.points);
                var neuralNetworkResult = MagicGestures.tab.gesture.neuralNetwork.think(normalizedPoints, MagicGestures.tab.gesture.dependency);

                if (MagicGestures.tab.gesture.dependency in MagicGestures.tab.gesture.possibleNext) {
                    MagicGestures.tab.gesture.possibleNext =
                        MagicGestures.tab.gesture.possibleNext[MagicGestures.tab.gesture.dependency];
                }

                var msg;
                if (neuralNetworkResult[1] >= 0.975 && MagicGestures.runtime.currentProfile.trained === true) {
                    msg = {
                        data: MagicGestures.tab.gesture.data,
                        command: neuralNetworkResult[0]
                    };
                    MagicGestures.logging.debug(msg, "Recognized by neural network:", neuralNetworkResult,
                        "Direction engine:", MagicGestures.tab.gesture.possibleNext.command);
                    if (msg.command in MagicGestures.Actions && MagicGestures.Actions[msg.command].isNativeJSAction)
                        MagicGestures.Actions[msg.command].action(msg.data);
                    else
                        MagicGestures.runtime.sendRuntimeMessage("background", "gesture ACTION", msg);
                } else if (MagicGestures.tab.gesture.possibleNext.command) {
                    msg = {
                        data: MagicGestures.tab.gesture.data,
                        command: MagicGestures.tab.gesture.possibleNext.command
                    };
                    MagicGestures.logging.debug(msg, "Recognized by direction engine:",
                        MagicGestures.tab.gesture.possibleNext.command, "Neural Network:", neuralNetworkResult);
                    if (msg.command in MagicGestures.Actions && MagicGestures.Actions[msg.command].isNativeJSAction)
                        MagicGestures.Actions[msg.command].action(msg.data);
                    else
                        MagicGestures.runtime.sendRuntimeMessage("background", "gesture ACTION", msg);
                } else {
                    MagicGestures.logging.debug("Not recognized, Neural network:", neuralNetworkResult);
                }
            }
        }
    })
});

Object.defineProperty(MagicGestures, "DirectionEngine", {
    value: Object.create(null, {

        /**
         * MagicGestures.DirectionEngine.update
         * Update from current point list.
         * Need to be invoked per mouse move.
         * @param {object} gesturePtr Pointer point to MagicGestures.tab.gesture object.
         * @param {boolean} endForce Set to false when invoked by mousemove, set to true when invoked by mouseup.
         * No return.
         */
        update: {
            value: function(gesturePtr, endForce) {
                var previousPoint = gesturePtr.directionPoints[gesturePtr.directionPoints.length - 1];
                var lastPoint = gesturePtr.lastEvent;

                var deltaX = lastPoint.clientX - previousPoint.clientX;
                var deltaY = lastPoint.clientY - previousPoint.clientY;

                var prevDir = (gesturePtr.code === "") ? "" : gesturePtr.code[gesturePtr.code.length - 1];
                
                var currentDir;
                if (Math.abs(deltaX) >= (endForce ? 1 : 3) * Math.abs(deltaY)) {
                    currentDir = (deltaX > 0) ? "R" : "L";
                } else if ((endForce ? 1 : 3) * Math.abs(deltaX) < Math.abs(deltaY)) {
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
         * MagicGestures.DirectionEngine.generateTrie
         * Useage: Generate gesture trie for specific profile.
         * ToDo: Optimize this function's performance.
         * @param {object} profile MagicGestures.Profile.
         * @return {object} Gesture trie.
         */
        generateTrie: {
            value: function(profile) {
                var gestureTrie = Object.create(null);

                var createSubTrie = function(action) {
                    var currentRoot = gestureTrie;

                    for (var i = 0; i < gesture.code.length; i++) {
                        var ch = gesture.code.charAt(i);
                        if (!(ch in currentRoot)) {
                            currentRoot[ch] = Object.create(null);
                        }
                        currentRoot = currentRoot[ch];
                    }
                    
                    if (action.dependency === "link") {
                        currentRoot.link = Object.create(null);
                        currentRoot = currentRoot.link;
                    }
                    currentRoot.command = action.name;
                };

                for (var gesture in profile.gestures) {
                    gesture = profile.gestures[gesture];
                    if (gesture.enabled)
                        gesture.actions.forEach(createSubTrie);
                }

                if (profile.wheelGestures.U && profile.wheelGestures.U.enabled) {
                    gestureTrie.wheel = gestureTrie.wheel ? gestureTrie.wheel : {};
                    gestureTrie.wheel.U = {command: profile.wheelGestures.U.command};
                }

                if (profile.wheelGestures.D && profile.wheelGestures.D.enabled) {
                    gestureTrie.wheel = gestureTrie.wheel ? gestureTrie.wheel : {};
                    gestureTrie.wheel.D = {command: profile.wheelGestures.D.command};
                }

                return gestureTrie;
            }
        }
    })
});

Object.defineProperty(MagicGestures, "NeuralNetEngine", {
    value: Object.create(null, {

        /**
         * MagicGestures.NeuralNetEngine.pointFilter
         * Filter point to a fixed length (64).
         * Need to be invoked after gesture end.
         * @param {Array.<Number>} pointsPtr Pointer point to MagicGestures.tab.gesture.points object.
         * No returns, changes will be effected on MagicGestures.tab.gesture.points.
         */
        pointFilter: {
            value: function(pointsPtr) {

                var i, loopCount = 0;
                var getDistanceArray = function(pointsArray) {
                    var distanceArray = [];

                    for (var i = 0; i < pointsArray.length / 2 - 1; ++i) {
                        distanceArray.push(Math.sqrt(
                            Math.pow(pointsArray[2 * (i + 1)] - pointsArray[2 * i], 2) +
                            Math.pow(pointsArray[2 * (i + 1) + 1] - pointsArray[2 * i + 1], 2)
                        ));
                    }

                    return distanceArray;
                };

                while (pointsPtr.length >= 132) {
                    if (pointsPtr.length % 4 !== 0)
                        pointsPtr.push(pointsPtr[pointsPtr.length - 2], pointsPtr[pointsPtr.length - 1]);

                    for (i = 0; i < pointsPtr.length / 2; i += 2) {
                        pointsPtr[i] = (pointsPtr[2 * i] + pointsPtr[2 * (i + 1)]) / 2;
                        pointsPtr[i + 1] = (pointsPtr[2 * i + 1] + pointsPtr[2 * i + 3]) / 2;
                    }
                    pointsPtr.length /= 2;
                    
                    if (++loopCount > 60) {
                        MagicGestures.logging.error("Infinite loop detected!!!!");
                        debugger;
                        break;
                    }
                }

                loopCount = 0;
                for(i = pointsPtr.length / 2 - 1; i >= 1; --i) {
                    if (pointsPtr[i * 2] === pointsPtr[i * 2 - 2] && pointsPtr[i * 2 + 1] === pointsPtr[i * 2 - 1]) {
                        if (i !== 1) {
                            if (pointsPtr[i * 2] === pointsPtr[i * 2 - 4] && pointsPtr[i * 2 + 1] === pointsPtr[i * 2 - 3]) {
                                pointsPtr.splice(2 * i - 2, 2);
                            } else {
                                pointsPtr.splice(2 * i - 2, 2,
                                    (pointsPtr[2 * i] + pointsPtr[2 * i - 4]) / 2,
                                    (pointsPtr[2 * i + 1] + pointsPtr[2 * i - 3]) / 2
                                );
                            }
                            ++i;
                            continue;
                        } else {
                            pointsPtr.splice(0, 2);
                        }
                    }

                    if (++loopCount > 200) {
                        MagicGestures.logging.error("Infinite loop detected!!!!");
                        debugger;
                        break;
                    }
                }

                loopCount = 0;
                var distanceArray = getDistanceArray(pointsPtr);
                while (pointsPtr.length >= 4 && pointsPtr.length != 66) {
                    if (pointsPtr.length <= 64) {
                        var maxDistance = Math.max.apply(null, distanceArray);
                        var maxAt = distanceArray.indexOf(maxDistance);
                        pointsPtr.splice(2 * maxAt + 2, 0,
                            (pointsPtr[2 * maxAt] + pointsPtr[2 * maxAt + 2]) / 2,
                            (pointsPtr[2 * maxAt + 1] + pointsPtr[2 * maxAt + 3]) / 2
                        );
                        distanceArray.splice(maxAt, 1, maxDistance / 2, maxDistance / 2);
                    } else {
                        var minDistance = Math.min.apply(null, distanceArray);
                        var minAt = distanceArray.indexOf(minDistance);
                        if (minAt === 0) {
                            pointsPtr.splice(2, 2);
                            distanceArray.splice(0, 2, Math.sqrt(
                                Math.pow(pointsPtr[2] - pointsPtr[0], 2) +
                                Math.pow(pointsPtr[3] - pointsPtr[1], 2)
                            ));
                        } else if (minAt === distanceArray.length - 1) {
                            pointsPtr.splice(-4, 2);
                            var pointsLength = pointsPtr.length;
                            distanceArray.splice(-2, 2, Math.sqrt(
                                Math.pow(pointsPtr[pointsLength - 2] - pointsPtr[pointsLength - 4], 2) +
                                Math.pow(pointsPtr[pointsLength - 1] - pointsPtr[pointsLength - 3], 2)
                            ));
                        } else {
                            pointsPtr.splice(2 * minAt, 4,
                                (pointsPtr[2 * minAt] + pointsPtr[2 * minAt + 2]) / 2,
                                (pointsPtr[2 * minAt + 1] + pointsPtr[2 * minAt + 3]) /2
                            );
                            distanceArray.splice(minAt - 1, 3,
                                Math.sqrt(
                                    Math.pow(pointsPtr[2 * minAt] - pointsPtr[2 * minAt - 2], 2) +
                                    Math.pow(pointsPtr[2 * minAt + 1] - pointsPtr[2 * minAt - 1], 2)
                                ),
                                Math.sqrt(
                                    Math.pow(pointsPtr[2 * minAt + 2] - pointsPtr[2 * minAt], 2) +
                                    Math.pow(pointsPtr[2 * minAt + 3] - pointsPtr[2 * minAt + 1], 2)
                                )
                            );
                        }
                    }

                    if (++loopCount > 60) {
                        MagicGestures.logging.error("Infinite loop detected!!!!");
                        debugger;
                        break;
                    }
                }
            }
        },

        /**
         * MagicGestures.NeuralNetEngine.normalize
         * Normalize points to unit vector
         * @param {Array.<Number>} pointsPtr Point points to points array.
         * 
         * @return {Array.<Number>} Normalized vectors.
         */
        normalize: {
            value: function(pointsPtr) {
                var normalizedVectors = [];

                for (var i = 0; i < pointsPtr.length - 2; i += 2) {
                    var vectorX = pointsPtr[i + 2] - pointsPtr[i], vectorY = pointsPtr[i + 3] - pointsPtr[i + 1];
                    var invSqrt = 1 / Math.sqrt(vectorX * vectorX + vectorY * vectorY);
                    // Check if two points are same
                    if (invSqrt !== Infinity){
                        normalizedVectors.push(vectorX * invSqrt, vectorY * invSqrt);
                    } else {
                        normalizedVectors.push(
                            normalizedVectors[normalizedVectors.length - 2],
                            normalizedVectors[normalizedVectors.length - 1]
                        );
                    }
                }

                return normalizedVectors;
            }
        },

        /**
         * MagicGestures.NeuralNetEngine.rebuildNetwork
         * Rebuild neural network by using neural network information.
         * @param {object} neunetInfo Neural network information.
         * @return {Network}
         */
        rebuildNetwork: {
            value: function(neunetInfo) {
                var Network = function(details) {
                    this.inputCount    = details.inputCount;
                    this.actionsList   = details.actionsList;
                    this.hiddenCount   = details.hiddenCount;
                    this.outputCount   = details.outputCount;
                    this.hiddenWeights = details.hiddenWeights;
                    this.outputWeights = details.outputWeights;

                    var sigmoid = function(activation, response) {
                        return (1 / (1 + Math.exp(-activation / response)));
                    };

                    this.think = function(inputs, dependency) {

                        // Check if no neural network
                        if (this.inputCount === 0) return ["no neural network", 0, []];

                        // Check length
                        if (inputs.length !== this.inputCount)
                            MagicGestures.logging.error("Not a vaild input for neural network engine.", inputs);

                        // Calculate hidden output
                        var i, j;
                        var hiddenOutputs = [];
                        for (i = this.hiddenCount - 1; i >= 0; --i) {
                            var hiddenOutput = this.hiddenWeights[(i + 1) * (this.inputCount + 1) - 1] * -1;
                            for (j = this.inputCount - 1; j >= 0; --j) {
                                hiddenOutput += this.hiddenWeights[i * (this.inputCount + 1) + j] * inputs[j];
                            }
                            hiddenOutput = sigmoid(hiddenOutput, 1);
                            if (isNaN(hiddenOutput)) {debugger;}
                            hiddenOutputs.unshift(hiddenOutput);
                        }

                        // Calculate final output
                        var outputOutputs = []/*, expTot*/;
                        for (i = this.outputCount - 1; i >= 0; --i) {
                            var outputOutput = this.outputWeights[(i + 1) * (this.hiddenCount + 1) - 1] * -1;
                            for (j = this.hiddenCount - 1; j >= 0; --j) {
                                outputOutput += this.outputWeights[i * (this.hiddenCount + 1) + j] * hiddenOutputs[j];
                            }
                            outputOutput = sigmoid(outputOutput, 1);
                            if (isNaN(outputOutput)) {debugger;}
                            // outputOutput = Math.exp(outputOutput);
                            // expTot += outputOutput;
                            outputOutputs.unshift({probability: outputOutput, actions: this.actionsList[i]});
                        }
                        // for (i = this.outputCount - 1; i >= 0; --i)
                        //     outputOutputs[i] /= expTot;

                        outputOutputs.sort(function(lp, rp) {
                            return rp.probability - lp.probability;
                        });

                        if (outputOutputs[0].probability < 0.975 || outputOutputs[0].probability - outputOutputs[1].probability < 0.08) {
                            return ["failed - " + outputOutputs[0].probability + ", " + outputOutputs[1].probability,
                                outputOutputs[0].probability, outputOutputs];
                        }

                        var actions = outputOutputs[0].actions, action_index;
                        for (action_index = 0; action_index < actions.length; ++action_index) {
                            if (actions[action_index].dependency === dependency) {
                                return [actions[action_index].name, outputOutputs[0].probability, outputOutputs];
                            }
                        }

                        // Backward compatible for gesture on link but not with link
                        for (action_index = 0; action_index < actions.length; ++action_index) {
                            if (actions[action_index].dependency === "" && dependency === "link") {
                                return [actions[action_index].name, outputOutputs[0].probability, outputOutputs];
                            }
                        }

                        return ["error", 0, outputOutputs];
                    };
                };
                
                return new Network((typeof neunetInfo === "string") ? JSON.parse(neunetInfo) : neunetInfo);
            }
        },

        /**
         * MagicGestures.NeuralNetEngine.trainNeuralNet
         * Train neural network and use notification center show notifications.
         * @param {string} state State for chrome.idle API. (Optional)
         */
        trainNeuralNet: {
            value: function(state) {
                if (state && state !== "idle") return; // See http://crbug.com/366580 for more details.
                if (state) chrome.idle.onStateChanged.removeListener(MagicGestures.NeuralNetEngine.trainNeuralNet);
                MagicGestures.runtime.set({neuralnetTrainScheduled: false});
                var profileMap = MagicGestures.ProfileManager.profileMap;

                var trainProfile = function(profileID) {
                    var notificationID;
                    chrome.notifications.create('', {
                        type: "progress",
                        title: "MagicGestures",
                        iconUrl: "res/img/48.png",
                        message: "Unlocking magic for " + profileMap[profileID].name,
                        progress: 2
                    }, function(nid) {
                        notificationID = nid;
                    });

                    profileMap[profileID].trained = "training";
                    MagicGestures.ProfileManager.updateProfile(profileMap[profileID]);
                    MagicGestures.runtime.sendRuntimeMessage("*", "trainingNeuralNet PMEVENT");
                    MagicGestures.runtime.sendRuntimeMessage("options", "cancelReloadRequest UIEVENT");

                    var worker = new Worker('lib/train_worker.js');
                    worker.addEventListener('message', function(e) {
                        if ("actionsList" in e.data) {
                            profileMap[profileID].trained = true;
                            profileMap[profileID].neuralNetInfo = e.data;
                            MagicGestures.ProfileManager.updateProfile(profileMap[profileID]);
                            MagicGestures.runtime.sendRuntimeMessage("*", "neuralNetTrained PMEVENT");
                            MagicGestures.runtime.sendRuntimeMessage("options", "cancelReloadRequest UIEVENT");
                            chrome.notifications.clear(notificationID, function(){});
                            chrome.notifications.create('', {
                                type: "basic",
                                title: "MagicGestures",
                                iconUrl: "res/img/48.png",
                                message: profileMap[profileID].name + ": Magic Unlocked!"
                            }, function(nid){
                                notificationID = nid;
                            });
                        }
                        if ("progress" in e.data && notificationID) {
                            chrome.notifications.update(notificationID, {
                                progress: Math.round(50 * Math.log(1.01 - 0.01 * e.data.progress) / Math.log(0.1))
                            }, function(){});
                        }
                    }, false);

                    worker.postMessage({
                        command: "train",
                        networkInfo: {
                            gestures: profileMap[profileID].gestures
                        }
                    });
                };

                for (var profileID in profileMap) {
                    if (profileMap.hasOwnProperty(profileID) && !profileMap[profileID].trained) {
                        trainProfile(profileID);
                    }
                }
            }
        }
    })
});