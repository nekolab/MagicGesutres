/**
 * @fileoverview This is preset profiles and actions file.
 * @author sunny@magicgestures.org {Sunny}
 * @version 0.0.1.4
 */

/*global chrome: false, MagicGestures: true */
/*jshint strict: true, globalstrict: true */

"use strict";

/**
 * Definition of MagicGestures.Preset.
 */
Object.defineProperty(MagicGestures, "Preset", {
    value: Object.create(null),
    enumerable: true
});

/**
 * Preset profiles includes MagicGestures, FireGestures, SmoothGestures and Opera.
 * Actions includes many default actions.
 */
Object.defineProperties(MagicGestures.Preset, {
    Profiles: {
        value: Object.create(null),
        enumerable: true
    },
    Actions: {
        value: Object.create(null),
        enumerable: true
    }
});

MagicGestures.Preset.Profiles.MagicGestures = function() {
    return new MagicGestures.Profile({
        id: "b8980ce9f43e35f2",
        name: "MagicGestures",
        description: "MagicGestures style profile.",
        enable: true,
        sync: false,
        readOnly: true,
        locusColor: [255, 0, 0, 1],
        gestureMap: {
            "history_back": [
                new MagicGestures.Gesture({
                    code: "L",
                    featureVectors: [-1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1,
                        0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0,
                        -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0]
                })
            ],
            "history_forward": [
                new MagicGestures.Gesture({
                    code: "R",
                    featureVectors: [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1,
                        0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1,
                        0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0]
                })
            ],
            "close_tab": [
                new MagicGestures.Gesture({
                    code: "DR",
                    featureVectors: [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0,
                        1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1,
                        0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0]
                })
            ],
            "reload_tab": [
                new MagicGestures.Gesture({
                    code: "UD",
                    featureVectors: [0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1,
                        0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1,
                        0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1]
                })
            ],
            "undo_close_tab": [
                new MagicGestures.Gesture({
                    // ToDo: Not Supported Yet
                    code: "LU",
                    featureVectors: [-1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0,
                        -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1,
                        0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1]
                })
            ],
            "reload_tab_bypass_cache": [
                new MagicGestures.Gesture({
                    code: "UDU",
                    featureVectors: [0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1,
                        0, -1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, -1, 0, -1, 0,
                        -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1]
                })
            ],
            "close_window": [
                new MagicGestures.Gesture({
                    code: "URD",
                    featureVectors: [0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1,
                        0, -1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1,
                        0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1]
                })
            ],
            "prev_tab": [
                new MagicGestures.Gesture({
                    code: "UL",
                    featureVectors: [0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1,
                        0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0,
                        -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0]
                })
            ],
            "next_tab": [
                new MagicGestures.Gesture({
                    code: "UR",
                    featureVectors: [0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1,
                        0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0,
                        1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0]
                })
            ],
            "minimize_window": [
                new MagicGestures.Gesture({
                    code: "RUD",
                    featureVectors: [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0,
                        -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, 1, 0, 1, 0,
                        1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1]
                })
            ],
            "maximize_window": [
                new MagicGestures.Gesture({
                    code: "RDU",
                    featureVectors: [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 1,
                        0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, -1, 0, -1, 0, -1, 0, -1, 0,
                        -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1]
                })
            ],
            "goto_parent_dir": [
                new MagicGestures.Gesture({
                    // ToDo: Not Supported Yet
                    code: "DU",
                    featureVectors: [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0,
                        1, 0, 1, 0, 1, 0, 1, 0, 1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1,
                        0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1]
                })
            ],
            "view_current_frame_only": [
                new MagicGestures.Gesture({
                    // ToDo: Not Supported Yet
                    code: "LDR",
                    featureVectors: [-1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0,
                        -1, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0,
                        1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0]
                })
            ],
            "view_current_frame_in_new_tab": [
                new MagicGestures.Gesture({
                    // ToDo: Not Supported Yet
                    code: "LDRU",
                    featureVectors: [-1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, 0, 1, 0, 1, 0,
                        1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0,
                        -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1]
                })
            ],
            "open_in_newtab_background": [
                new MagicGestures.Gesture({
                    code: "DU",
                    dependency: "link",
                    featureVectors: [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1,
                        0, 1, 0, 1, 0, 1, 0, 1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1,
                        0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1]
                })
            ],
            "open_in_newtab": [
                new MagicGestures.Gesture({
                    code: "U",
                    dependency: "link",
                    featureVectors: [0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0,
                        -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1,
                        0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1]
                })
            ],
            "scroll_to_top": [
                new MagicGestures.Gesture({
                    code: "U",
                    dependency: "wheel"
                })
            ],
            "scroll_to_bottom": [
                new MagicGestures.Gesture({
                    code: "D",
                    dependency: "wheel"
                })
            ],
            "open_options": [
                new MagicGestures.Gesture({
                    // ToDo: Not Supported Yet
                    code: "RDLUR",
                    featureVectors: [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1,
                        0, 1, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0,
                        -1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0]
                })
            ],
            "open_status": [
                new MagicGestures.Gesture({
                    // ToDo: Not Supported Yet
                    code: "RDLD",
                    featureVectors: [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0, 1,
                        0, 1, 0, 1, 0, 1, 0, 1, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, 0, 1,
                        0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1]
                })
            ]
        }
    });
};

MagicGestures.Preset.Profiles.Opera = function() {
    return new MagicGestures.Profile({
        id: "af72c225f1d7ee4d",
        name: "Opera",
        description: "Opera style profile.",
        enable: true,
        sync: false,
        readOnly: true,
        locusColor: [255, 255, 255, 1],
        gestureMap: {
            "history_back": [
                new MagicGestures.Gesture({
                    code: "L",
                    featureVectors: [-1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0,
                        -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0,
                        -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0]
                })
            ],
            "history_forward": [
                new MagicGestures.Gesture({
                    code: "R",
                    featureVectors: [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1,
                        0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1,
                        0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0]
                })
            ],
            "goto_parent_dir": [
                new MagicGestures.Gesture({
                    // ToDo: Not Supported Yet
                    code: "UL",
                    featureVectors: [0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1,
                        0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0,
                        -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0]
                })
            ],
            "reload_tab": [
                new MagicGestures.Gesture({
                    code: "UD",
                    featureVectors: [0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1,
                        0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1,
                        0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1]
                })
            ],
            "stop_loading": [
                new MagicGestures.Gesture({
                    code: "U",
                    featureVectors: [0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1,
                        0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1,
                        0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1]
                })
            ],
            "new_tab": [
                new MagicGestures.Gesture({
                    code: "D",
                    featureVectors: [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0,
                        1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0,
                        1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1]
                })
            ],
            "duplicate_tab": [
                new MagicGestures.Gesture({
                    code: "DU",
                    featureVectors: [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0,
                        1, 0, 1, 0, 1, 0, 1, 0, 1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1,
                        0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1]
                })
            ],
            "maximize_window": [
                new MagicGestures.Gesture({
                    code: "UR",
                    featureVectors: [0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1,
                        0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0,
                        1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0]
                })
            ],
            "minimize_window": [
                new MagicGestures.Gesture({
                    code: "DL",
                    featureVectors: [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0,
                        1, 0, 1, 0, 1, 0, 1, 0, 1, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0,
                        -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0]
                })
            ],
            "close_tab": [
                new MagicGestures.Gesture({
                    code: "DR",
                    featureVectors: [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0,
                        1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1,
                        0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0]
                }),
                new MagicGestures.Gesture({
                    code: "RLR",
                    featureVectors: [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, -1,
                        0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, 1, 0, 1, 0, 1, 0,
                        1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0]
                })
            ],
            "open_in_newtab": [
                new MagicGestures.Gesture({
                    code: "D",
                    dependency: "link",
                    featureVectors: [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0,
                        1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0,
                        1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1]
                })
            ],
            "open_in_newtab_background": [
                new MagicGestures.Gesture({
                    code: "DU",
                    dependency: "link",
                    featureVectors: [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0,
                        1, 0, 1, 0, 1, 0, 1, 0, 1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1,
                        0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1]
                })
            ]
        }
    });
};

MagicGestures.Preset.Profiles.FireGestures = function() {
    return new MagicGestures.Profile({
        id: "c69b0a6f7786ef4e",
        name: "FireGestures",
        description: "FireGestures style profile.",
        enable: true,
        sync: false,
        readOnly: true,
        locusColor: [0, 255, 0, 1],
        gestureMap: {
            "history_back": [
                new MagicGestures.Gesture({
                    code: "L",
                    featureVectors: [-1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1,
                        0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0,
                        -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0]
                })
            ],
            "history_forward": [
                new MagicGestures.Gesture({
                    code: "R",
                    featureVectors: [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0,
                        1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1,
                        0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0]
                })
            ],
            "reload_tab": [
                new MagicGestures.Gesture({
                    code: "UD",
                    featureVectors: [0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0,
                        -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0,
                        1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1]
                })
            ],
            "reload_tab_bypass_cache": [
                new MagicGestures.Gesture({
                    code: "UDU",
                    featureVectors: [0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0,
                        -1, 0, -1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, -1, 0,
                        -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1]
                })
            ],
            "goto_parent_dir": [
                new MagicGestures.Gesture({
                    // ToDo: Not Supported Yet
                    code: "DU",
                    featureVectors: [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0,
                        1, 0, 1, 0, 1, 0, 1, 0, 1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1,
                        0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1]
                })
            ],
            "new_window": [
                new MagicGestures.Gesture({
                    code: "DRU",
                    featureVectors: [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1,
                        0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, -1, 0, -1, 0, -1, 0,
                        -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1]
                })
            ],
            "close_window": [
                new MagicGestures.Gesture({
                    code: "URD",
                    featureVectors: [0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1,
                        0, -1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1,
                        0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1]
                })
            ],
            "minimize_window": [
                new MagicGestures.Gesture({
                    code: "RUD",
                    featureVectors: [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0,
                        -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, 1, 0, 1, 0,
                        1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1]
                })
            ],
            "maximize_window": [
                new MagicGestures.Gesture({
                    code: "RDU",
                    featureVectors: [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0,
                        1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, -1, 0, -1, 0, -1, 0, -1,
                        0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1]
                })
            ],
            "new_tab": [
                new MagicGestures.Gesture({
                    code: "LR",
                    featureVectors: [-1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0,
                        -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0,
                        , 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0]
                })
            ],
            "close_tab": [
                new MagicGestures.Gesture({
                    code: "DR",
                    featureVectors: [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0,
                        1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1,
                        0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0]
                })
            ],
            "undo_close_tab": [
                new MagicGestures.Gesture({
                    // ToDo: Not Supported Yet
                    code: "RL",
                    featureVectors: [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1,
                        0, 1, 0, 1, 0, 1, 0, 1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0,
                        -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0]
                })
            ],
            "prev_tab": [
                new MagicGestures.Gesture({
                    code: "UL",
                    featureVectors:[0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0,
                        -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1,
                        0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0]
                })
            ],
            "next_tab": [
                new MagicGestures.Gesture({
                    code: "UR",
                    featureVectors: [0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1,
                        0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0,
                        1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0]
                })
            ],
            "zoom_in_text": [
                new MagicGestures.Gesture({
                    // ToDo: Not Supported Yet
                    code: "LRU",
                    featureVectors: [-1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0,
                        -1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, -1, 0, -1, 0,
                        -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1]
                })
            ],
            "zoom_out_text": [
                new MagicGestures.Gesture({
                    // ToDo: Not Supported Yet
                    code: "LRD",
                    featureVectors: [-1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0,
                        -1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0,
                        1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1]
                })
            ],
            "reset_text_zoom": [
                new MagicGestures.Gesture({
                    // ToDo: Not Supported Yet
                    code: "LRUD",
                    featureVectors: [-1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, 1, 0, 1, 0, 1,
                        0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0,
                        -1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1]
                })
            ],
            "scroll_to_top": [
                new MagicGestures.Gesture({
                    code: "LU",
                    featureVectors: [-1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0,
                        -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1,
                        0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1]
                })
            ],
            "scroll_to_bottom": [
                new MagicGestures.Gesture({
                    code: "LD",
                    featureVectors: [-1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0,
                        -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1,
                        0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1]
                })
            ],
            "view_current_frame_only": [
                new MagicGestures.Gesture({
                    // ToDo: Not Supported Yet
                    code: "LDR",
                    featureVectors: [-1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1,
                        0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0, 1, 0,
                        1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0]
                })
            ],
            "view_current_frame_in_new_tab": [
                new MagicGestures.Gesture({
                    // ToDo: Not Supported Yet
                    code: "LDRU",
                    featureVectors: [-1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, 0, 1, 0, 1, 0, 1,
                        0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, -1, 0,
                        -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1]
                })
            ],
            "open_in_newtab_background": [
                new MagicGestures.Gesture({
                    code: "D",
                    dependency: "link",
                    featureVectors: [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0,
                        1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0,
                        1, 0, 1, 0, 1, 0, 1, 0, 1]
                })
            ],
            "open_in_newtab": [
                new MagicGestures.Gesture({
                    code: "U",
                    dependency: "link",
                    featureVectors: [0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1,
                        0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1,
                        0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1]
                })
            ],
            "open_options": [
                new MagicGestures.Gesture({
                    // ToDo: Not Supported Yet
                    code: "LDRUL",
                    featureVectors: [-1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1,
                        0, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, -1, 0,
                        -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0]
                })
            ]
        }
    });
};

MagicGestures.Preset.Profiles.SmoothGestures = function() {
    return new MagicGestures.Profile({
        id: "a18e20513ba94779",
        name: "SmoothGestures",
        description: "SmoothGestures style profile.",
        enable: true,
        sync: false,
        readOnly: true,
        locusColor: [255, 0, 0, 1],
        gestureMap: {
            "new_tab": [
                new MagicGestures.Gesture({
                    code: "U",
                    featureVectors: [0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1,
                        0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1,
                        0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1]
                })
            ],
            "open_in_newtab": [
                new MagicGestures.Gesture({
                    code: "U",
                    dependency: "link",
                    featureVectors: [0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1,
                        0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1,
                        0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1]
                })
            ],
            "toggle_pin_tab": [
                new MagicGestures.Gesture({
                    code: "D",
                    featureVectors: [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1,
                        0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0,
                        1, 0, 1, 0, 1, 0, 1]
                })
            ],
            "history_back": [
                new MagicGestures.Gesture({
                    code: "L",
                    featureVectors: [-1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0,
                        -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0,
                        -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0]
                })
            ],
            "history_forward": [
                new MagicGestures.Gesture({
                    code: "R",
                    featureVectors: [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0,
                        1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0,
                        1, 0, 1, 0, 1, 0, 1, 0]
                })
            ],
            "prev_tab": [
                new MagicGestures.Gesture({
                    code: "UL",
                    featureVectors: [0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1,
                        0, -1, 0, -1, 0, -1, 0, -1, 0, -1, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0,
                        -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0]
                })
            ],
            "next_tab": [
                new MagicGestures.Gesture({
                    code: "UR",
                    featureVectors: [0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1,
                        0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1,
                        0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0]
                })
            ],
            "scroll_to_top": [
                new MagicGestures.Gesture({
                    code: "U",
                    dependency: "wheel"
                })
            ],
            "scroll_to_bottom": [
                new MagicGestures.Gesture({
                    code: "D",
                    dependency: "wheel"
                })
            ],
            "close_tab": [
                new MagicGestures.Gesture({
                    code: "DR",
                    featureVectors: [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0,
                        1, 0, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0,
                        1, 0, 1, 0, 1, 0, 1, 0, 1, 0]
                })
            ],
            "undo_close_tab": [
                new MagicGestures.Gesture({
                    // ToDo: Not Supported Yet
                    code: "LU",
                    featureVectors: [-1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0,
                        -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1,
                        0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1]
                })
            ],
            "duplicate_tab": [
                new MagicGestures.Gesture({
                    code: "DU",
                    featureVectors: [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1,
                        0, 1, 0, 1, 0, 1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0,
                        -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1]
                })
            ],
            "open_in_newtab_background": [
                new MagicGestures.Gesture({
                    code: "DU",
                    dependency: "link",
                    featureVectors: [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1,
                        0, 1, 0, 1, 0, 1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0,
                        -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1]
                })
            ],
            "reload_tab": [
                new MagicGestures.Gesture({
                    code: "UD",
                    featureVectors: [0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1,
                        0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0,
                        1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1]
                })
            ],
            "reload_tab_bypass_cache": [
                new MagicGestures.Gesture({
                    code: "UDU",
                    featureVectors: [0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1,
                        0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, -1, 0, -1, 0, -1, 0, -1, 0,
                        -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1]
                })
            ],
            "view_source": [
                new MagicGestures.Gesture({
                    code: "URD",
                    featureVectors: [0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1,
                        1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1,
                        0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1]
                })
            ],
            "split_tabs": [
                new MagicGestures.Gesture({
                    code: "UDR",
                    featureVectors: [0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1,
                        0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0,
                        1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0]
                })
            ],
            "merge_tabs": [
                new MagicGestures.Gesture({
                    // ToDo: Not Supported Yet
                    code: "UDL",
                    featureVectors: [0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1,
                        0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, -1, 0, -1, 0, -1, 0, -1, 0, -1,
                        0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0]
                })
            ],
            "list_cookies": [
                new MagicGestures.Gesture({
                    // ToDo: Not Supported Yet
                    code: "LDR",
                    featureVectors: [-1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0,
                        0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0,
                        1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0]
                })
            ],
            "open_options": [
                new MagicGestures.Gesture({
                    // ToDo: Not Supported Yet
                    code: "RDLUR",
                    featureVectors: [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1,
                        -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 1, 0,
                        1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0]
                })
            ],
            "open_status": [
                new MagicGestures.Gesture({
                    // ToDo: Not Supported Yet
                    code: "RDLD",
                    featureVectors: [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1,
                        0, 1, 0, 1, 0, 1, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, -1, 0, 0, 1, 0, 1, 0, 1,
                        0, 1, 0, 1, 0, 1, 0, 1, 0, 1]
                })
            ]
        }
    });
};

Object.defineProperties(MagicGestures.Preset.Actions, {

    close_tab: {
        value: function(tab) {
            chrome.tabs.remove(tab.id);
        },
        enumerable: true
    },

    close_other_tabs: {
        value: function(tab) {
            chrome.tabs.query({windowId: tab.windowId}, function(tabs) {
                for (var i = tabs.length - 1; i >= 0; i--) {
                    if (!tabs[i].pinned && tabs[i].id !== tab.id) {
                        chrome.tabs.remove(tabs[i].id);
                    }
                }
            });
        },
        enumerable: true
    },

    close_tabs_to_the_left: {
        value: function(tab) {
            chrome.tabs.query({windowId: tab.windowId}, function(tabs) {
                for (var i = tabs.length - 1; i >= 0; i--) {
                    if (tabs[i].index < tab.index && !tabs[i].pinned) {
                        chrome.tabs.remove(tabs[i].id);
                    }
                }
            });
        },
        enumerable: true
    },

    close_tabs_to_the_right: {
        value: function(tab) {
            chrome.tabs.query({windowId: tab.windowId}, function(tabs) {
                for (var i = tabs.length - 1; i >= 0; i--) {
                    if (tabs[i].index > tab.index && !tabs[i].pinned) {
                        chrome.tabs.remove(tabs[i].id);
                    }
                }
            });
        },
        enumerable: true
    },

    close_window: {
        value: function(tab) {
            chrome.windows.remove(tab.windowId);
        },
        enumerable: true
    },

    duplicate_tab: {
        value: function(tab) {
            chrome.tabs.duplicate(tab.id);
        },
        enumerable: true
    },

    full_screen: {
        value: function(tab) {
            chrome.windows.update(tab.windowId, {state: "fullscreen"});
        },
        enumerable: true
    },

    history_back: {
        value: function(tab) {
            chrome.tabs.executeScript(tab.id, {code: "history.back();"});
        },
        enumerable: true
    },

    history_forward: {
        value: function(tab) {
            chrome.tabs.executeScript(tab.id, {code: "history.forward();"});
        },
        enumerable: true
    },

    maximize_window: {
        value: function(tab) {
            var toggle = {maximized: "normal", normal: "maximized", fullscreen: "maximized", minimized: "normal"};
            chrome.windows.get(tab.windowId, null, function(window) {
                chrome.windows.update(tab.windowId, {state: toggle[window.state]});
            });
        },
        enumerable: true
    },

    minimize_window: {
        value: function(tab) {
            chrome.windows.update(tab.windowId, {state: "minimized"});
        },
        enumerable: true
    },

    move_to_left: {
        value: function(tab) {
            chrome.tabs.move(tab.id, {index: 0});
        },
        enumerable: true
    },

    move_to_right: {
        value: function(tab) {
            chrome.tabs.move(tab.id, {index: -1});
        },
        enumerable: true
    },

    navigate_to_new_tab: {
        value: function(tab) {
            chrome.tabs.update(tab.id, {url: "chrome://newtab"});
        },
        enumerable: true
    },

    new_tab: {
        value: function(tab) {
            chrome.tabs.create({index: tab.index + 1});
        },
        enumerable: true
    },

    new_window: {
        value: function() {
            chrome.windows.create({});
        },
        enumerable: true
    },

    next_tab: {
        value: function(tab) {
            chrome.tabs.query({index: tab.index + 1, windowId: tab.windowId}, function(tabs) {
                if (tabs.length !== 0) {chrome.tabs.update(tabs[0].id, {active: true});}
            });
        },
        enumerable: true
    },

    open_bookmarks: {
        value: function(tab) {
            chrome.tabs.create({index: tab.index + 1, url: "chrome://bookmarks/"});
        },
        enumerable: true
    },

    open_downloads: {
        value: function(tab) {
            chrome.tabs.create({index: tab.index + 1, url: "chrome://downloads/"});
        },
        enumerable: true
    },

    open_extensions: {
        value: function(tab) {
            chrome.tabs.create({index: tab.index + 1, url: "chrome://extensions/"});
        },
        enumerable: true
    },

    open_history: {
        value: function(tab) {
            chrome.tabs.create({index: tab.index + 1, url: "chrome://history/"});
        },
        enumerable: true
    },

    open_in_newtab: {
        value: function(tab, data) {
            chrome.tabs.create({index: tab.index + 1, url: data.href, openerTabId: tab.id});
        }
    },

    open_in_newtab_background: {
        value: function(tab, data) {
            chrome.tabs.create({index: tab.index + 1, url: data.href, active: false, openerTabId: tab.id});
        }
    },

    pin_tab: {
        value: function(tab) {
            chrome.tabs.update(tab.id, {pinned: true});
        },
        enumerable: true
    },

    prev_tab: {
        value: function(tab) {
            chrome.tabs.query({index: tab.index - 1, windowId: tab.windowId}, function(tabs) {
                chrome.tabs.update(tabs[0].id, {active: true});
            });
        },
        enumerable: true
    },

    print_tab: {
        value: function(tab) {
            chrome.tabs.executeScript(tab.id, {code: "window.print();"});
        },
        enumerable: true
    },

    reload_all_tabs: {
        value: function(tab) {
            chrome.tabs.query({windowId: tab.windowId}, function(tabs) {
                for (var i = tabs.length - 1; i >= 0; i--) {
                    chrome.tabs.reload(tabs[i].id);
                }
            });
        },
        enumerable: true
    },

    reload_all_tabs_bypass_cache: {
        value: function(tab) {
            chrome.tabs.query({windowId: tab.windowId}, function(tabs) {
                for (var i = tabs.length - 1; i >= 0; i--) {
                    chrome.tabs.reload(tabs[i].id, {bypassCache: true});
                }
            });
        },
        enumerable: true
    },

    reload_tab: {
        value: function(tab) {
            chrome.tabs.reload(tab.id);
        },
        enumerable: true
    },

    reload_tab_bypass_cache: {
        value: function(tab) {
            chrome.tabs.reload(tab.id, {bypassCache: true});
        },
        enumerable: true
    },

    split_tabs: {
        value: function(tab) {
            chrome.windows.get(tab.windowId, {populate: true}, function(window) {
                chrome.windows.create({
                    focused: true, type: window.type,
                    incognito: window.incognito, tabId: tab.id
                }, function(createdWindow) {
                    for (var i = window.tabs.length - 1; i >= 0; i--) {
                        if (window.tabs[i].index > tab.index) {
                            chrome.tabs.move(window.tabs[i].id, {windowId: createdWindow.id, index: window.tabs[i].index - tab.index});
                        }
                    }
                });
            });
        },
        enumerable: true
    },

    stop_loading: {
        value: function(tab) {
            chrome.tabs.executeScript(tab.id, {code: "window.stop();"});
        },
        enumerable: true
    },

    scroll_to_top: {
        value: function(tab) {
            chrome.tabs.executeScript(tab.id, {code: "window.scroll(0, 0);"});
        },
        enumerable: true
    },

    scroll_to_bottom: {
        value: function(tab) {
            chrome.tabs.executeScript(tab.id, {
                code: "window.scrollTo(0, document.documentElement.scrollHeight);"
            });
        },
        enumerable: true
    },

    toggle_pin_tab: {
        value: function(tab) {
            chrome.tabs.update(tab.id, {pinned: !tab.pinned});
        },
        enumerable: true
    },

    unpin_tab: {
        value: function(tab) {
            chrome.tabs.update(tab.id, {pinned: false});
        },
        enumerable: true
    },

    view_source: {
        value: function(tab) {
            chrome.tabs.create({index: tab.index + 1, url: "view-source:" + tab.url, openerTabId: tab.id});
        },
        enumerable: true
    }
});