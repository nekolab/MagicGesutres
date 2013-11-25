/**
 * @fileoverview Magic Gestures neural network train web worker.
 * @author sunny@magicgestures.org {Sunny}
 * @version 0.0.1.0
 */

/*jshint strict: true, globalstrict: true, worker: true */

"use strict";

var Utils = {
    randWeight: function() {
        return Math.random() * 2 - 1;
    }
};

var Constants = {
    LEARN_RATE: 0.5,
    RESPONSE: 1,
    SSE_THRESHOLD: 0.003
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
    var checksum = 0;
    for (var i = vectors.length - 1; i >= 0; --i) {
        checksum += vectors[i] * (i + 1);
    }
    return checksum;
};

var Network = function(gestureMap) {
    
    this.gestureMap  = gestureMap;

    this.inputCount = 66;
    this.outputCount = Object.keys(gestureMap).length;
    this.hiddenCount = Math.round(Math.sqrt(this.inputCount + this.outputCount) + 2);

    this.hiddenWeights = [];
    this.outputWeights = [];

    var i;
    for (i = (this.inputCount + 1) * this.hiddenCount - 1; i >= 0; --i) {
        this.hiddenWeights[i] = Utils.randWeight();
    }
    for (i = (this.hiddenCount + 1) * this.outputCount - 1; i >= 0; --i) {
        this.outputWeights[i] = Utils.randWeight();
    }

    this.prepareGestures = function() {
        this.actionList = Object.keys(this.gestureMap);
        this.preparedInputs = [];
        this.preparedExpectedOutputs = [];

        var checksumMap = Object.create(null);

        var NetworkThis = this;
        this.actionList.forEach(function(action) {
            NetworkThis.gestureMap[action].forEach(function(gesture) {
                if (gesture.featureVectors.length !== 0) {
                    var inputsContent = gesture.featureVectors.slice();
                    inputsContent.push(0, (gesture.dependency == "link") ? 1 : 0);
                    var checksum = generateChecksum(inputsContent);

                    if (checksum in checksumMap) {
                        NetworkThis.preparedExpectedOutputs[checksumMap[checksum]] = generateOutputs(
                            NetworkThis.outputCount, NetworkThis.actionList.indexOf(action));
                    } else if (gesture.dependency) {
                        NetworkThis.preparedInputs.push(inputsContent.slice());
                        NetworkThis.preparedExpectedOutputs.push(generateOutputs(NetworkThis.outputCount, NetworkThis.actionList.indexOf(action)));
                        checksumMap[generateChecksum(inputsContent)] = NetworkThis.preparedInputs.length - 1;
                        inputsContent.splice(-1, 1, 0);
                        NetworkThis.preparedInputs.push(inputsContent.slice());
                        NetworkThis.preparedExpectedOutputs.push(generateOutputs(NetworkThis.outputCount));
                        checksumMap[generateChecksum(inputsContent)] = NetworkThis.preparedInputs.length - 1;
                    } else {
                        NetworkThis.preparedInputs.push(inputsContent.slice());
                        NetworkThis.preparedExpectedOutputs.push(generateOutputs(NetworkThis.outputCount, NetworkThis.actionList.indexOf(action)));
                        checksumMap[generateChecksum(inputsContent)] = NetworkThis.preparedInputs.length - 1;
                        inputsContent.splice(-1, 1, 1);
                        NetworkThis.preparedInputs.push(inputsContent.slice());
                        NetworkThis.preparedExpectedOutputs.push(generateOutputs(NetworkThis.outputCount, NetworkThis.actionList.indexOf(action)));
                        checksumMap[generateChecksum(inputsContent)] = NetworkThis.preparedInputs.length - 1;
                    }
                }
            });
        });
    };

    this.train = function(inputs, expectedOutputs) {

        var ipt_index = 0, sse, max_sse;

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
                outputOutput = sigmoid(outputOutput);
                outputOutputs.unshift(outputOutput);
            }

            var EkList = [];
            sse = 0;

            // Adjust output layer.
            for (k = this.outputCount - 1; k >= 0 ; --k) {
                ok = outputOutputs[k];
                var Ek = (expectedOutputs[ipt_index][k] - ok) * (ok - ok * ok);
                sse += (expectedOutputs[ipt_index][k] - ok) * (expectedOutputs[ipt_index][k] - ok);
                EkList.unshift(Ek);
                // Adjust weights per output neural.
                this.outputWeights[k * (this.hiddenCount + 1) + this.hiddenCount] += Constants.LEARN_RATE * Ek * -1;
                for (j = this.hiddenCount - 1; j >= 0; --j) {
                    this.outputWeights[k * (this.hiddenCount + 1) + j] += Constants.LEARN_RATE *  Ek * hiddenOutputs[j];
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
                this.hiddenWeights[j * (this.inputCount + 1) + this.inputCount] += Constants.LEARN_RATE * Ej * -1;
                for (i = this.inputCount - 1; i >= 0; --i) {
                    this.hiddenWeights[j * (this.inputCount + 1) + i] += Constants.LEARN_RATE * Ej * inputs[ipt_index][i];
                }
            }

            ipt_index = (++ipt_index) % inputs.length;

            max_sse = (sse > max_sse) ? sse : max_sse;
            if (ipt_index !== 0)
                continue;

        } while(max_sse >= Constants.SSE_THRESHOLD);
    };
};


self.addEventListener('message', function(e) {
    switch(e.data && e.data.command) {
        case "train":
            var networkInfo = e.data.networkInfo;
            var network = new Network(networkInfo.gestureMap);
            network.prepareGestures();
            network.train(network.preparedInputs, network.preparedExpectedOutputs);
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