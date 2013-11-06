/**
 * @fileoverview This is preset profiles and actions file.
 * @author sunny@magicgestures.org {Sunny}
 * @version 0.0.0.6
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
        gestures: [
            new MagicGestures.Gesture({
                dir: "L",
                name: "history_back"
            }),
            new MagicGestures.Gesture({
                dir: "R",
                name: "history_forward"
            }),
            new MagicGestures.Gesture({
                dir: "DR",
                name: "close_tab"
            }),
            new MagicGestures.Gesture({
                dir: "UD",
                name: "reload_tab"
            }),
            new MagicGestures.Gesture({
                dir: "LU",
                name: "undo_close_tab"
            }),
            new MagicGestures.Gesture({
                dir: "UDU",
                name: "reload_tab_bypass_cache"
            }),
            new MagicGestures.Gesture({
                dir: "URD",
                name: "close_window"
            }),
            new MagicGestures.Gesture({
                dir: "UL",
                name: "prev_tab"
            }),
            new MagicGestures.Gesture({
                dir: "UR",
                name: "next_tab"
            }),
            new MagicGestures.Gesture({
                dir: "RUD",
                name: "minimize_window"
            }),
            new MagicGestures.Gesture({
                dir: "RDU",
                name: "maximize_window"
            }),
            new MagicGestures.Gesture({
                // ToDo: Not Supported Yet
                dir: "DU",
                name: "goto_parent_dir"
            }),
            new MagicGestures.Gesture({
                // ToDo: Not Supported Yet
                dir: "LDR",
                name: "view_current_frame_only"
            }),
            new MagicGestures.Gesture({
                // ToDo: Not Supported Yet
                dir: "LDRU",
                name: "view_current_frame_in_new_tab"
            }),
            new MagicGestures.Gesture({
                dir: "lDU",
                name: "open_in_newtab_background"
            }),
            new MagicGestures.Gesture({
                dir: "lU",
                name: "open_in_newtab"
            }),
            new MagicGestures.Gesture({
                // ToDo: Not Supported Yet
                dir: "wU",
                name: "scroll_to_top"
            }),
            new MagicGestures.Gesture({
                // ToDo: Not Supported Yet
                dir: "wD",
                name: "scroll_to_bottom"
            }),
            new MagicGestures.Gesture({
                // ToDo: Not Supported Yet
                dir: "RDLUR",
                name: "open_options"
            }),
            new MagicGestures.Gesture({
                // ToDo: Not Supported Yet
                dir: "RDLD",
                name: "open_status"
            })
        ]
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
        gestures: [
            new MagicGestures.Gesture({
                dir: "L",
                name: "history_back"
            }),
            new MagicGestures.Gesture({
                dir: "R",
                name: "history_forward"
            }),
            new MagicGestures.Gesture({
                // ToDo: Not Supported Yet
                dir: "UL",
                name: "goto_parent_dir"
            }),
            new MagicGestures.Gesture({
                dir: "UD",
                name: "reload_tab"
            }),
            new MagicGestures.Gesture({
                dir: "U",
                name: "stop_loading"
            }),
            new MagicGestures.Gesture({
                dir: "D",
                name: "new_tab"
            }),
            new MagicGestures.Gesture({
                dir: "DU",
                name: "duplicate_tab"
            }),
            new MagicGestures.Gesture({
                dir: "UR",
                name: "maximize_window"
            }),
            new MagicGestures.Gesture({
                dir: "DL",
                name: "minimize_window"
            }),
            new MagicGestures.Gesture({
                dir: "DR",
                name: "close_tab"
            }),
            new MagicGestures.Gesture({
                dir: "RLR",
                name: "close_tab"
            }),
            new MagicGestures.Gesture({
                dir: "lD",
                name: "open_in_newtab"
            }),
            new MagicGestures.Gesture({
                dir: "lDU",
                name: "open_in_newtab_background"
            })
        ]
    });
};

MagicGestures.Preset.Profiles.FireGestures = function() {
    return new MagicGestures.Profile({
        id: "92bf41973bdb709e",
        name: "FireGestures",
        description: "FireGestures style profile.",
        enable: true,
        sync: false,
        readOnly: true,
        locusColor: [0, 255, 0, 1],
        gestures: [
            new MagicGestures.Gesture({
                dir: "L",
                name: "history_back"
            }),
            new MagicGestures.Gesture({
                dir: "R",
                name: "history_forward"
            }),
            new MagicGestures.Gesture({
                dir: "UD",
                name: "reload_tab"
            }),
            new MagicGestures.Gesture({
                dir: "UDU",
                name: "reload_tab_bypass_cache"
            }),
            new MagicGestures.Gesture({
                // ToDo: Not Supported Yet
                dir: "DU",
                name: "goto_parent_dir"
            }),
            new MagicGestures.Gesture({
                dir: "DRU",
                name: "new_window"
            }),
            new MagicGestures.Gesture({
                dir: "URD",
                name: "close_window"
            }),
            new MagicGestures.Gesture({
                dir: "RUD",
                name: "minimize_window"
            }),
            new MagicGestures.Gesture({
                dir: "RDU",
                name: "maximize_window"
            }),
            new MagicGestures.Gesture({
                dir: "LR",
                name: "new_tab"
            }),
            new MagicGestures.Gesture({
                dir: "DR",
                name: "close_tab"
            }),
            new MagicGestures.Gesture({
                dir: "RL",
                name: "undo_close_tab"
            }),
            new MagicGestures.Gesture({
                // ToDo: Not Supported Yet
                dir: "UL",
                name: "prev_tab"
            }),
            new MagicGestures.Gesture({
                // ToDo: Not Supported Yet
                dir: "UR",
                name: "next_tab"
            }),
            new MagicGestures.Gesture({
                // ToDo: Not Supported Yet
                dir: "LRU",
                name: "zoom_in_text"
            }),
            new MagicGestures.Gesture({
                // ToDo: Not Supported Yet
                dir: "LRD",
                name: "zoom_out_text"
            }),
            new MagicGestures.Gesture({
                // ToDo: Not Supported Yet
                dir: "LRUD",
                name: "reset_text_zoom"
            }),
            new MagicGestures.Gesture({
                // ToDo: Not Supported Yet
                dir: "LU",
                name: "scroll_to_top"
            }),
            new MagicGestures.Gesture({
                // ToDo: Not Supported Yet
                dir: "LD",
                name: "scroll_to_bottom"
            }),
            new MagicGestures.Gesture({
                // ToDo: Not Supported Yet
                dir: "LDR",
                name: "view_current_frame_only"
            }),
            new MagicGestures.Gesture({
                // ToDo: Not Supported Yet
                dir: "LDRU",
                name: "view_current_frame_in_new_tab"
            }),
            new MagicGestures.Gesture({
                dir: "lD",
                name: "open_in_newtab_background"
            }),
            new MagicGestures.Gesture({
                dir: "lU",
                name: "open_in_newtab"
            }),
            new MagicGestures.Gesture({
                // ToDo: Not Supported Yet
                dir: "LDRUL",
                name: "open_options"
            })
        ]
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
        gestures: [
            new MagicGestures.Gesture({
                dir: "U",
                name: "new_tab"
            }),
            new MagicGestures.Gesture({
                dir: "lU",
                name: "open_in_newtab"
            }),
            new MagicGestures.Gesture({
                dir: "D",
                name: "toggle_pin_tab"
            }),
            new MagicGestures.Gesture({
                dir: "L",
                name: "history_back"
            }),
            new MagicGestures.Gesture({
                dir: "R",
                name: "history_forward"
            }),
            new MagicGestures.Gesture({
                dir: "UL",
                name: "prev_tab"
            }),
            new MagicGestures.Gesture({
                dir: "UR",
                name: "next_tab"
            }),
            new MagicGestures.Gesture({
                // ToDo: Not Supported Yet
                dir: "wU",
                name: "scroll_to_top"
            }),
            new MagicGestures.Gesture({
                // ToDo: Not Supported Yet
                dir: "wD",
                name: "scroll_to_bottom"
            }),
            new MagicGestures.Gesture({
                dir: "DR",
                name: "close_tab"
            }),
            new MagicGestures.Gesture({
                dir: "LU",
                name: "undo_close_tab"
            }),
            new MagicGestures.Gesture({
                dir: "DU",
                name: "duplicate_tab"
            }),
            new MagicGestures.Gesture({
                dir: "lDU",
                name: "open_in_newtab_background"
            }),
            new MagicGestures.Gesture({
                dir: "UD",
                name: "reload_tab"
            }),
            new MagicGestures.Gesture({
                dir: "UDU",
                name: "reload_tab_bypass_cache"
            }),
            new MagicGestures.Gesture({
                dir: "URD",
                name: "view_source"
            }),
            new MagicGestures.Gesture({
                dir: "UDR",
                name: "split_tabs"
            }),
            new MagicGestures.Gesture({
                // ToDo: Not Supported Yet
                dir: "UDL",
                name: "merge_tabs"
            }),
            new MagicGestures.Gesture({
                // ToDo: Not Supported Yet
                dir: "LDR",
                name: "list_cookies"
            }),
            new MagicGestures.Gesture({
                // ToDo: Not Supported Yet
                dir: "RDLUR",
                name: "open_options"
            }),
            new MagicGestures.Gesture({
                // ToDo: Not Supported Yet
                dir: "RDLD",
                name: "open_status"
            })
        ]
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

    undo_close_tab: {
        value: function(tab) {
            // Currently, chrome.sessions is only avaliable in Dev Channel (v32).
            chrome.sessions.getRecentlyClosed(function(sessions) {
                if (sessions[0]) {
                    var item = (sessions[0].tab) || (sessions[0].window);
                    chrome.sessions.restore(item.sessionId);
                }
            });
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