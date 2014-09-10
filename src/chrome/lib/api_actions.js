/**
 * @fileoverview Actions which use chrome.* API.
 * @author sunny@magicgestures.org {Sunny}
 * @version 0.0.2.3
 */

/* global chrome: false, MagicGestures: true */
/* jshint strict: true, globalstrict: true */

"use strict";

Object.defineProperty(MagicGestures, "Actions", {
    value: (MagicGestures.Actions) ? MagicGestures.Actions : Object.create(Object.prototype),
    enumerable: true
});

Object.defineProperties(MagicGestures.Actions, {

    close_tab: {
        value: {
            category: "Tab",
            dependency: "none",
            description: "Close current tab",
            action: function(tab) {
                chrome.tabs.remove(tab.id);
            }
        },
        enumerable: true
    },

    close_other_tabs: {
        value: {
            category: "Tab",
            dependency: "none",
            description: "Close all tabs in current window, except for the current one",
            action: function(tab) {
                chrome.tabs.query({windowId: tab.windowId}, function(tabs) {
                    for (var i = tabs.length - 1; i >= 0; i--) {
                        if (!tabs[i].pinned && tabs[i].id !== tab.id) {
                            chrome.tabs.remove(tabs[i].id);
                        }
                    }
                });
            }
        },
        enumerable: true
    },

    close_tabs_to_the_left: {
        value: {
            category: "Tab",
            dependency: "none",
            description: "Close all tabs left to the current tab in current window",
            action: function(tab) {
                chrome.tabs.query({windowId: tab.windowId}, function(tabs) {
                    for (var i = tabs.length - 1; i >= 0; i--) {
                        if (tabs[i].index < tab.index && !tabs[i].pinned) {
                            chrome.tabs.remove(tabs[i].id);
                        }
                    }
                });
            }
        },
        enumerable: true
    },

    close_tabs_to_the_right: {
        value: {
            category: "Tab",
            dependency: "none",
            description: "Close all tabs right to the current tab in current window",
            action: function(tab) {
                chrome.tabs.query({windowId: tab.windowId}, function(tabs) {
                    for (var i = tabs.length - 1; i >= 0; i--) {
                        if (tabs[i].index > tab.index && !tabs[i].pinned) {
                            chrome.tabs.remove(tabs[i].id);
                        }
                    }
                });
            }
        },
        enumerable: true
    },

    close_window: {
        value: {
            category: "Window",
            dependency: "none",
            description: "Close current window",
            action: function(tab) {
                chrome.windows.remove(tab.windowId);
            }
        },
        enumerable: true
    },

    duplicate_tab: {
        value: {
            category: "Tab",
            dependency: "none",
            description: "Open a duplicated tab of the current tab",
            action: function(tab) {
                chrome.tabs.duplicate(tab.id);
            }
        },
        enumerable: true
    },

    full_screen: {
        value: {
            category: "Window",
            dependency: "none",
            description: "Make current window full screen",
            action: function(tab) {
                chrome.windows.update(tab.windowId, {state: "fullscreen"});
            }
        },
        enumerable: true
    },

    maximize_window: {
        value: {
            category: "Window",
            dependency: "none",
            description: "Maximize current window",
            action: function(tab) {
                chrome.windows.update(tab.windowId, {state: "maximized"});
            }
        },
        enumerable: true
    },

    minimize_window: {
        value: {
            category: "Window",
            dependency: "none",
            description: "Minimize current window",
            action: function(tab) {
                chrome.windows.update(tab.windowId, {state: "minimized"});
            }
        },
        enumerable: true
    },

    move_to_left: {
        value: {
            category: "Tab",
            dependency: "none",
            description: "Move current tab once to the left",
            action: function(tab) {
                chrome.tabs.move(tab.id, {index: 0});
            }
        },
        enumerable: true
    },

    move_to_right: {
        value: {
            category: "Tab",
            dependency: "none",
            description: "Move current tab once to the right",
            action: function(tab) {
                chrome.tabs.move(tab.id, {index: -1});
            }
        },
        enumerable: true
    },

    navigate_to_new_tab: {
        value: {
            category: "Navigation",
            dependency: "none",
            description: "Navigate to new tab page",
            action: function(tab) {
                chrome.tabs.update(tab.id, {url: "chrome://newtab"});
            }
        },
        enumerable: true
    },

    new_tab: {
        value: {
            category: "Tab",
            dependency: "none",
            description: "Open a new tab in current window",
            action: function(tab) {
                chrome.tabs.create({index: tab.index + 1, url: "chrome://newtab"});
            }
        },
        enumerable: true
    },

    new_window: {
        value: {
            category: "Window",
            dependency: "none",
            description: "Open a new window",
            action: function() {
                chrome.windows.create({});
            }
        },
        enumerable: true
    },

    next_tab: {
        value: {
            category: "Tab",
            dependency: "none",
            description: "Select the tab to the right of the current tab",
            action: function(tab) {
                chrome.tabs.query({windowId: tab.windowId}, function(tabs) {
                    // Assume all tab is sorted by index.
                    var index = (tab.index === tabs.length - 1) ? 0 : tab.index + 1;
                    chrome.tabs.update(tabs[index].id, {active: true});
                });
            }
        },
        enumerable: true
    },

    open_bookmarks: {
        value: {
            category: "Tools",
            dependency: "none",
            description: "Open bookmark manager in a new tab",
            action: function(tab) {
                chrome.tabs.create({index: tab.index + 1, url: "chrome://bookmarks/"});
            }
        },
        enumerable: true
    },

    open_downloads: {
        value: {
            category: "Tools",
            dependency: "none",
            description: "Open downloads manager in a new tab",
            action: function(tab) {
                chrome.tabs.create({index: tab.index + 1, url: "chrome://downloads/"});
            }
        },
        enumerable: true
    },

    open_extensions: {
        value: {
            category: "Tools",
            dependency: "none",
            description: "Open extensions manager in a new tab",
            action: function(tab) {
                chrome.tabs.create({index: tab.index + 1, url: "chrome://extensions/"});
            }
        },
        enumerable: true
    },

    open_history: {
        value: {
            category: "Tools",
            dependency: "none",
            description: "Open history manager in a new tab",
            action: function(tab) {
                chrome.tabs.create({index: tab.index + 1, url: "chrome://history/"});
            }
        },
        enumerable: true
    },

    open_in_newtab: {
        value: {
            category: "Link",
            dependency: "link",
            description: "Start a gesture on a link to open it in a new tab",
            action: function(tab, data) {
                chrome.tabs.create({index: tab.index + 1, url: data.href, openerTabId: tab.id});
            }
        },
        enumerable: true
    },

    open_in_newtab_background: {
        value: {
            category: "Link",
            dependency: "link",
            description: "Start a gesture on a link to open it in a new tab in background",
            action: function(tab, data) {
                chrome.tabs.create({index: tab.index + 1, url: data.href, active: false, openerTabId: tab.id});
            }
        },
        enumerable: true
    },

    open_options: {
        value: {
            category: "Settings",
            dependency: "none",
            description: "Open Magic Gestures options page",
            action: function(tab) {
                chrome.tabs.create({url: "chrome-extension://" + chrome.runtime.id + "/views/options.html"});
            }
        },
        enumerable: true
    },

    pin_tab: {
        value: {
            category: "Tab",
            dependency: "none",
            description: "Pin the current tab",
            action: function(tab) {
                chrome.tabs.update(tab.id, {pinned: true});
            }
        },
        enumerable: true
    },

    prev_tab: {
        value: {
            category: "Tab",
            dependency: "none",
            description: "Select the tab to the left of the current tab",
            action: function(tab) {
                chrome.tabs.query({windowId: tab.windowId}, function(tabs) {
                    // Assume all tab is sorted by index.
                    var index = (tab.index === 0) ? tabs.length - 1 : tab.index - 1;
                    chrome.tabs.update(tabs[index].id, {active: true});
                });
            }
        },
        enumerable: true
    },

    reload_all_tabs: {
        value: {
            category: "Tab",
            dependency: "none",
            description: "Reload all tabs in current window",
            action: function(tab) {
                chrome.tabs.query({windowId: tab.windowId}, function(tabs) {
                    for (var i = tabs.length - 1; i >= 0; i--) {
                        chrome.tabs.reload(tabs[i].id);
                    }
                });
            }
        },
        enumerable: true
    },

    reload_all_tabs_bypass_cache: {
        value: {
            category: "Tab",
            dependency: "none",
            description: "Reload all tabs (skip cache) in current window",
            action: function(tab) {
                chrome.tabs.query({windowId: tab.windowId}, function(tabs) {
                    for (var i = tabs.length - 1; i >= 0; i--) {
                        chrome.tabs.reload(tabs[i].id, {bypassCache: true});
                    }
                });
            }
        },
        enumerable: true
    },

    reload_tab: {
        value: {
            category: "Navigation",
            dependency: "none",
            description: "Reload current tab",
            action: function(tab) {
                chrome.tabs.reload(tab.id);
            }
        },
        enumerable: true
    },

    reload_tab_bypass_cache: {
        value: {
            category: "Navigation",
            dependency: "none",
            description: "Reload current tab (skip cache)",
            action: function(tab) {
                chrome.tabs.reload(tab.id, {bypassCache: true});
            }
        },
        enumerable: true
    },

    split_tabs: {
        value: {
            category: "Tab",
            dependency: "none",
            description: "Split all tabs to the right of (and including) the current tab into a new window",
            action: function(tab) {
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
            }
        },
        enumerable: true
    },

    toggle_pin_tab: {
        value: {
            category: "Tab",
            dependency: "none",
            description: "Toggle the pinned state of current tab",
            action: function(tab) {
                chrome.tabs.update(tab.id, {pinned: !tab.pinned});
            }
        },
        enumerable: true
    },

    toggle_window_states: {
        value: {
            category: "Window",
            dependency: "none",
            description: "Toggle current window states (maximized <=> normal)",
            action: function(tab) {
                var toggle = {maximized: "normal", normal: "maximized", fullscreen: "maximized", minimized: "normal"};
                chrome.windows.get(tab.windowId, null, function(window) {
                    chrome.windows.update(tab.windowId, {state: toggle[window.state]});
                });
            }
        },
        enumerable: true
    },

    undo_close_tab: {
        value: {
            category: "Tab",
            dependency: "none",
            description: "Open the last closed tab",
            action: function() {
                if (chrome.sessions) {
                    // Currently, chrome.sessions is only avaliable in Dev Channel (v36).
                    chrome.sessions.getRecentlyClosed(function(sessions) {
                        if (sessions[0]) {
                            var item = (sessions[0].tab) || (sessions[0].window);
                            chrome.sessions.restore(item.sessionId);
                        }
                    });
                } else {
                    var undo_info = MagicGestures.runtime.get(["current_tabs", "closedTabStack"]);
                    var last_closed_tab = (undo_info.closedTabStack||[]).pop();
                    if (last_closed_tab && undo_info.current_tabs[last_closed_tab]) {
                        var check_opener_tab = function(callback) {
                            if (! undo_info.current_tabs[last_closed_tab].openerTabId) {
                                delete undo_info.current_tabs[last_closed_tab].openerTabId;
                                callback();
                            } else {
                                chrome.tabs.get(undo_info.current_tabs[last_closed_tab].openerTabId, function(tab) {
                                    if (!tab)
                                        delete undo_info.current_tabs[last_closed_tab].openerTabId;
                                    callback();
                                });
                            }
                        };

                        var check_windowId = function(callback) {
                            chrome.windows.get(undo_info.current_tabs[last_closed_tab].windowId, function(w) {
                                if (!w)
                                    chrome.windows.create({}, function(nw) {
                                        undo_info.current_tabs[last_closed_tab].windowId = nw.id;
                                        callback();
                                    });
                                else
                                    callback();
                            });
                        };

                        check_opener_tab(function() {
                            check_windowId(function() {
                                undo_info.current_tabs[last_closed_tab].active = true;
                                chrome.tabs.create(undo_info.current_tabs[last_closed_tab], function() {
                                    chrome.windows.update(undo_info.current_tabs[last_closed_tab].windowId, {
                                        focused: true
                                    }, function() {
                                        delete undo_info.current_tabs[last_closed_tab];
                                        MagicGestures.runtime.set(undo_info);
                                    });
                                });
                            });
                        });

                        
                    }
                }
            }
        },
        enumerable: true
    },

    unpin_tab: {
        value: {
            category: "Tab",
            dependency: "none",
            description: "Unpin the current tab",
            action: function(tab) {
                chrome.tabs.update(tab.id, {pinned: false});
            }
        },
        enumerable: true
    },

    view_source: {
        value: {
            category: "Hybrid",
            dependency: "none",
            description: "View the source code of current page",
            action: function(tab) {
                chrome.tabs.create({index: tab.index + 1, url: "view-source:" + tab.url, openerTabId: tab.id});
            }
        },
        enumerable: true
    }
});

// Undo Close Tab support
if (!chrome.sessions) {
    chrome.tabs.onCreated.addListener(function(tab) {
        var current_tabs = MagicGestures.runtime.get("current_tabs").current_tabs || {};
        current_tabs[tab.id] = {
            url: tab.url,
            index: tab.index,
            pinned: tab.pinned,
            windowId: tab.windowId,
            openerTabId: tab.openerTabId
        };
        MagicGestures.runtime.set({current_tabs: current_tabs});
    });

    chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
        var current_tabs = MagicGestures.runtime.get("current_tabs").current_tabs || {};
        current_tabs[tabId] = {
            url: tab.url,
            index: tab.index,
            pinned: tab.pinned,
            windowId: tab.windowId,
            openerTabId: tab.openerTabId
        };
        MagicGestures.runtime.set({current_tabs: current_tabs});
    });

    chrome.tabs.onMoved.addListener(function (tabId, moveInfo) {
        var current_tabs = MagicGestures.runtime.get("current_tabs").current_tabs || {};
        if (!(tabId in current_tabs)) return;
        current_tabs[tabId].index = moveInfo.toIndex;
        current_tabs[tabId].windowId = moveInfo.windowId;
        MagicGestures.runtime.set({current_tabs: current_tabs});
    });

    chrome.tabs.onAttached.addListener(function(tabId, attachInfo) {
        var current_tabs = MagicGestures.runtime.get("current_tabs").current_tabs || {};
        if (!(tabId in current_tabs)) return;
        current_tabs[tabId].index = attachInfo.newPosition;
        current_tabs[tabId].windowId = attachInfo.newWindowId;
        MagicGestures.runtime.set({current_tabs: current_tabs});
    });

    chrome.tabs.onRemoved.addListener(function(tabId) {
        var undo_info = MagicGestures.runtime.get(["current_tabs", "closedTabStack"]);
        var closedTabStack = undo_info.closedTabStack || [];
        while (closedTabStack.length >= 20)
            delete undo_info.current_tabs[closedTabStack.shift()];
        closedTabStack.push(tabId);
        MagicGestures.runtime.set({closedTabStack: closedTabStack, current_tabs: undo_info.current_tabs});
    });

    Object.defineProperty(MagicGestures.Actions, "runOnce", {
        value: function(callback) {
            chrome.tabs.query({}, function(tabs) {
                var current_tabs = {};
                tabs.forEach(function(tab) {
                    current_tabs[tab.id] = {
                        url: tab.url,
                        index: tab.index,
                        pinned: tab.pinned,
                        windowId: tab.windowId,
                        openerTabId: tab.openerTabId
                    };
                });
                MagicGestures.runtime.set({current_tabs: current_tabs});
                callback();
            });
        }
    });
} else {
    MagicGestures.Actions.runOnce = function(callback) {
        callback.apply(null);
    }
}