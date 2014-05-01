/**
 * @fileoverview Magic Gestures neural network train web worker.
 * @author sunny@magicgestures.org {Sunny}
 * @version 0.0.3.3
 */

/* jshint strict: true, globalstrict: true, worker: true */

"use strict";

var Constants = {
    LEARN_RATE: 0.2,
    RESPONSE: 1,
    SSE_THRESHOLD: 0.0001,
    MOMENTUM: 0.9,
    ANGLEOFFSET: 1 * (Math.PI / 180),
    SAMPLESCOUNT: 300
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

var generateFeatureVectorSamples = function(featureVectors) {
    var newVector = [];
    for (var index = 0; index < featureVectors.length; index += 2) {
        var angle = Math.tan(1.45 * (Math.random() * 2 - 1)) / /*tan(1.45) = */8.2381 * Constants.ANGLEOFFSET;
        newVector.push(featureVectors[index] * Math.cos(angle) + featureVectors[index + 1] * Math.sin(angle));
        newVector.push(-featureVectors[index] * Math.sin(angle) + featureVectors[index + 1] * Math.cos(angle));
    }
    return newVector;
};

var prepareGestures = function(gestures) {

    var networkGestures = gestures.filter(function(gesture) {
        return gesture.featureVectors.length;
    });

    var outputCount = networkGestures.length;
    var preparedInputs = [], preparedExpectedOutputs = [], actionsList = [];

    for (var index = 0; index < networkGestures.length; ++index) {
        if (networkGestures[index].enabled) {
            actionsList.push(networkGestures[index].actions);
            preparedInputs.push(networkGestures[index].featureVectors);
            preparedExpectedOutputs.push(generateOutputs(outputCount, index));
        }
    }

    for (var count = Constants.SAMPLESCOUNT; count >= 0; --count) {
        for (index = 0; index < networkGestures.length; ++index) {
            if (networkGestures[index].enabled) {
                preparedInputs.push(generateFeatureVectorSamples(networkGestures[index].featureVectors));
                preparedExpectedOutputs.push(generateOutputs(outputCount, index));
            }
        }
    }
    
    return [preparedInputs, preparedExpectedOutputs, actionsList];
};

var Network = function(inputCount, outputCount, hiddenCount) {

    this.inputCount  = inputCount;
    this.outputCount = outputCount;
    this.hiddenCount = (hiddenCount) ? hiddenCount : Math.round(Math.sqrt(this.inputCount + this.outputCount) + 6);

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

        var ipt_index = 0, percent = 0, sse, max_sse, sse_delta;

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
            var outputOutputs = []/*, expTot = 0*/;
            for (i = this.outputCount - 1; i >= 0; --i) {
                var outputOutput = this.outputWeights[(i + 1) * (this.hiddenCount + 1) - 1] * -1;
                for (j = this.hiddenCount - 1; j >= 0; --j) {
                    outputOutput += this.outputWeights[i * (this.hiddenCount + 1) + j] * hiddenOutputs[j];
                }
                // outputOutput = Math.exp(outputOutput);
                // expTot += outputOutput;
                outputOutput = sigmoid(outputOutput);
                outputOutputs.unshift(outputOutput);
            }
            // for (i = this.outputCount - 1; i >= 0; --i)
            //     outputOutputs[i] /= expTot;

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

            max_sse = (sse > max_sse) ? sse : max_sse;

            if ((ipt_index = (++ipt_index) % inputs.length) === 0) {
                if (!sse_delta && max_sse < 15 * Constants.SSE_THRESHOLD)
                    sse_delta = max_sse - Constants.SSE_THRESHOLD;
                if (percent < Math.floor((sse_delta + Constants.SSE_THRESHOLD - max_sse) / sse_delta * 100)) {
                    percent = Math.floor((sse_delta + Constants.SSE_THRESHOLD - max_sse) / sse_delta * 100);
                    self.postMessage({progress: percent});
                }
            }

        } while(ipt_index !== 0 || max_sse >= Constants.SSE_THRESHOLD);
    };
};


self.addEventListener("message", function(e) {
    switch(e.data && e.data.command) {
        case "train":
            var networkInfo = e.data.networkInfo;
            var preparedTrainInfo = prepareGestures(networkInfo.gestures);
            var network = new Network(64, preparedTrainInfo[2].length);
            network.train(preparedTrainInfo[0], preparedTrainInfo[1]);
            self.postMessage({
                inputCount:     network.inputCount,
                hiddenCount:    network.hiddenCount,
                outputCount:    network.outputCount,
                actionsList:    preparedTrainInfo[2],
                hiddenWeights:  network.hiddenWeights,
                outputWeights:  network.outputWeights
            });
            break;
        default:
            console.error("Not a vaild command.", e);
            break;
    }
}, false);