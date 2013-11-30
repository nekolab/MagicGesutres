/**
 * @fileoverview Magic Gestures neural network train web worker.
 * @author sunny@magicgestures.org {Sunny}
 * @version 0.0.1.5
 */

/*jshint strict: true, globalstrict: true, worker: true */

"use strict";

var Constants = {
    LEARN_RATE: 0.3,
    RESPONSE: 1,
    SSE_THRESHOLD: 0.001,
    MOMENTUM: 0.9
};

var Utils = {
    randWeight: function() {
        return Math.random() * 2 - 1;
    }
};

var sigmoid = function(activation) {
    return (1 / (1 + Math.exp(-activation / Constants.RESPONSE)));
};

var generateOutputs = function(length, index) {
    var template = [];
    for(var len = length - 1; len >= 0; --len)
        template.push(0);
    if (index !== undefined)
        template.splice(index, 1, 1);
    return template;
};

var generateChecksum = function(vectors) {
    return vectors.toString();
};

var prepareGestures = function(actionList, gestureMap) {
    var outputCount = actionList.length;
    var preparedInputs = [], preparedExpectedOutputs = [];

    var checksumMap = Object.create(null);

    actionList.forEach(function(action) {
        gestureMap[action].forEach(function(gesture) {
            if (gesture.featureVectors.length !== 0) {
                var inputsContent = gesture.featureVectors.slice();
                inputsContent.push(0, (gesture.dependency == "link") ? 1 : 0);
                var checksum = generateChecksum(inputsContent);

                if (checksum in checksumMap) {
                    preparedExpectedOutputs[checksumMap[checksum]] = generateOutputs(outputCount, actionList.indexOf(action));
                } else if (gesture.dependency) {
                    preparedInputs.push(inputsContent.slice());
                    preparedExpectedOutputs.push(generateOutputs(outputCount, actionList.indexOf(action)));
                    checksumMap[generateChecksum(inputsContent)] = preparedInputs.length - 1;
                    inputsContent.splice(-1, 1, 0);
                    preparedInputs.push(inputsContent.slice());
                    preparedExpectedOutputs.push(generateOutputs(outputCount));
                    checksumMap[generateChecksum(inputsContent)] = preparedInputs.length - 1;
                } else {
                    preparedInputs.push(inputsContent.slice());
                    preparedExpectedOutputs.push(generateOutputs(outputCount, actionList.indexOf(action)));
                    checksumMap[generateChecksum(inputsContent)] = preparedInputs.length - 1;
                    inputsContent.splice(-1, 1, 1);
                    preparedInputs.push(inputsContent.slice());
                    preparedExpectedOutputs.push(generateOutputs(outputCount, actionList.indexOf(action)));
                    checksumMap[generateChecksum(inputsContent)] = preparedInputs.length - 1;
                }
            }
        });
    });
    
    return [preparedInputs, preparedExpectedOutputs];
};

var Network = function(inputCount, outputCount, actionList, hiddenCount) {

    this.inputCount  = inputCount;
    this.outputCount = outputCount;
    this.actionList  = actionList;
    this.hiddenCount = (hiddenCount) ? hiddenCount : Math.round(Math.sqrt(this.inputCount + this.outputCount) + 2);

    this.hiddenWeights = [];
    this.outputWeights = [];

    var i;
    for (i = (this.inputCount + 1) * this.hiddenCount - 1; i >= 0; --i) {
        this.hiddenWeights.push(Utils.randWeight());
    }
    for (i = (this.hiddenCount + 1) * this.outputCount - 1; i >= 0; --i) {
        this.outputWeights.push(Utils.randWeight());
    }

    this.train = function(inputs, expectedOutputs) {

        var c, hiddenPrevWeights = [], outputPrevWeights = [];
        for (c = (this.inputCount + 1) * this.hiddenCount - 1; c >= 0; --c) {
            hiddenPrevWeights.push(0);
        }
        for (c = (this.hiddenCount + 1) * this.outputCount - 1; c >= 0; --c) {
            outputPrevWeights.push(0);
        }

        var ipt_index = 0, sse, max_sse;
        // var expTot;
        // var reduce_sum = function(pv, cv) { return pv + cv; };
        // var map_output = function(output) { return output / expTot; };

        do {
            if (ipt_index === 0)
                max_sse = 0;

            // Check length
            if (inputs[ipt_index].length !== this.inputCount)
                throw inputs[ipt_index].length + "is not a vaild input for neural network engine.";

            // Calculate hidden output
            var i, j, k, oj, ok;
            var hiddenOutputs = [];
            for (i = this.hiddenCount - 1; i >= 0; --i) {
                var hiddenOutput = this.hiddenWeights[(i + 1) * (this.inputCount + 1) - 1] * -1;
                for (j = this.inputCount - 1; j >= 0; --j) {
                    hiddenOutput += this.hiddenWeights[i * (this.inputCount + 1) + j] * inputs[ipt_index][j];
                }
                hiddenOutput = sigmoid(hiddenOutput);
                hiddenOutputs.unshift(hiddenOutput);
            }

            // Calculate final output
            var outputOutputs = [];
            for (i = this.outputCount - 1; i >= 0; --i) {
                var outputOutput = this.outputWeights[(i + 1) * (this.hiddenCount + 1) - 1] * -1;
                for (j = this.hiddenCount - 1; j >= 0; --j) {
                    outputOutput += this.outputWeights[i * (this.hiddenCount + 1) + j] * hiddenOutputs[j];
                }
                // outputOutput = Math.exp(outputOutput);
                outputOutput = sigmoid(outputOutput);
                outputOutputs.unshift(outputOutput);
            }
            // expTot = outputOutputs.reduce(reduce_sum, 0);
            // outputOutputs = outputOutputs.map(map_output);

            var weightUpdate, EkList = [];
            sse = 0;

            // Adjust output layer.
            for (k = this.outputCount - 1; k >= 0 ; --k) {
                ok = outputOutputs[k];
                var Ek = (expectedOutputs[ipt_index][k] - ok) * (ok - ok * ok);
                sse += (expectedOutputs[ipt_index][k] - ok) * (expectedOutputs[ipt_index][k] - ok);
                EkList.unshift(Ek);

                // Adjust weights per output neural.
                weightUpdate = Constants.LEARN_RATE * Ek * -1;
                this.outputWeights[k * (this.hiddenCount + 1) + this.hiddenCount] += weightUpdate +
                    outputPrevWeights[k * (this.hiddenCount + 1) + this.hiddenCount] * Constants.MOMENTUM;
                outputPrevWeights[k * (this.hiddenCount + 1) + this.hiddenCount] = weightUpdate;

                for (j = this.hiddenCount - 1; j >= 0; --j) {
                    weightUpdate = Constants.LEARN_RATE *  Ek * hiddenOutputs[j];
                    this.outputWeights[k * (this.hiddenCount + 1) + j] += weightUpdate +
                        outputPrevWeights[k * (this.hiddenCount + 1) + j] * Constants.MOMENTUM;
                    outputPrevWeights[k * (this.hiddenCount + 1) + j] = weightUpdate;
                }
            }

            // Adjust hidden layer.
            for (j = this.hiddenCount - 1; j >= 0; --j) {
                oj = hiddenOutputs[j];
                // Calculate error per hidden neural.
                var Ej = 0;
                for (k = this.outputCount - 1; k >= 0; --k) {
                    Ej += EkList[k] * this.outputWeights[k * (this.hiddenCount + 1) + j];
                }
                Ej *= oj * (1 - oj);

                // Adjust weights per hidden neural.
                weightUpdate = Constants.LEARN_RATE * Ej * -1;
                this.hiddenWeights[j * (this.inputCount + 1) + this.inputCount] += weightUpdate +
                    hiddenPrevWeights[j * (this.inputCount + 1) + this.inputCount] * Constants.MOMENTUM;
                hiddenPrevWeights[j * (this.inputCount + 1) + this.inputCount] = weightUpdate;

                for (i = this.inputCount - 1; i >= 0; --i) {
                    weightUpdate = Constants.LEARN_RATE * Ej * inputs[ipt_index][i];
                    this.hiddenWeights[j * (this.inputCount + 1) + i] += weightUpdate +
                        hiddenPrevWeights[j * (this.inputCount + 1) + i] * Constants.MOMENTUM;
                    hiddenPrevWeights[j * (this.inputCount + 1) + i] = weightUpdate;
                }
            }

            ipt_index = (++ipt_index) % inputs.length;

            max_sse = (sse > max_sse) ? sse : max_sse;

        } while(ipt_index !== 0 || max_sse >= Constants.SSE_THRESHOLD);
    };
};


self.addEventListener("message", function(e) {
    switch(e.data && e.data.command) {
        case "train":
            var networkInfo = e.data.networkInfo;
            var actionList = Object.keys(networkInfo.gestureMap);
            var preparedTrainInfo = prepareGestures(actionList, networkInfo.gestureMap);
            var network = new Network(66, actionList.length, actionList);
            network.train(preparedTrainInfo[0], preparedTrainInfo[1]);
            self.postMessage({
                actionList: network.actionList,
                inputCount: network.inputCount,
                hiddenCount: network.hiddenCount,
                outputCount: network.outputCount,
                hiddenWeights: network.hiddenWeights,
                outputWeights: network.outputWeights
            });
            break;
        default:
            console.error("Not a vaild command.", e);
            break;
    }
}, false);