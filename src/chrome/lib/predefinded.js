/**
 * @fileoverview This is an externs file provides predefinded contents.
 * @author sunny@magicgestures.org {Sunny}
 * @version 0.0.1.0
 */

var PRE_GESTURES = {
    MagicGestures: {
        L:     "history_back",
        R:     "history_forward",
        DR:    "close_tab",
        UD:    "reload_tab",
        LU:    "undo_close_tab",
        UDU:   "reload_tab_bypass_cache",
        URD:   "close_window",
        UL:    "prev_tab",
        UR:    "next_tab",
        RUD:   "minimize_window",
        RDU:   "maximize_window",
        DU:    "goto_parent_dir",               //Not Supported Yet
        LDR:   "view_current_frame_only",       //Not Supported Yet
        LDRU:  "view_current_frame_in_new_tab", //Not Supported Yet
        lDU:   "open_in_newtab_background",     //Not Supported Yet
        lU:    "open_in_newtab",                //Not Supported Yet
        wU:    "scroll_to_top",                 //Not Supported Yet
        wD:    "scroll_to_bottom",              //Not Supported Yet
        RDLUR: "open_options",                  //Not Supported Yet
        RDLD:  "open_status"                    //Not Supported Yet
    },
    Opera: {
        L:     "history_back",
        R:     "history_forward",
        UL:    "goto_parent_dir",               //Not Supported Yet
        UD:    "reload_tab",
        U:     "stop_loading",
        D:     "new_tab",
        DU:    "duplicate_tab",
        UR:    "maximize_window",
        DL:    "minimize_window",
        DR:    "close_tab",
        RLR:   "close_tab",
        lD:    "open_in_newtab",                //Not Supported Yet
        lDU:   "open_in_newtab_background",     //Not Supported Yet
    },
    FireGestures: {
        L:     "history_back",
        R:     "history_forward",
        UD:    "reload_tab",
        UDU:   "reload_tab_bypass_cache",
        DU:    "goto_parent_dir",               //Not Supported Yet
        DRU:   "new_window",
        URD:   "close_window",
        RUD:   "minimize_window",
        RDU:   "maximize_window",
        LR:    "new_tab",
        DR:    "close_tab",
        RL:    "undo_close_tab",
        UL:    "prev_tab",
        UR:    "next_tab",
        LRU:   "zoom_in_text",                  //Not Supported Yet
        LRD:   "zoom_out_text",                 //Not Supported Yet
        LRUD:  "reset_text_zoom",               //Not Supported Yet
        LU:    "scroll_to_top",                 //Not Supported Yet
        LD:    "scroll_to_bottom",              //Not Supported Yet
        LDR:   "view_current_frame_only",       //Not Supported Yet
        LDRU:  "view_current_frame_in_new_tab", //Not Supported Yet
        lD:    "open_in_newtab_background",     //Not Supported Yet
        lU:    "open_in_newtab",                //Not Supported Yet
        LDRUL: "open_options"                   //Not Supported Yet
    },
    SmoothGestures: {
        U:     "new_tab",
        lU:    "open_in_newtab",                //Not Supported Yet
        D:     "toggle_pin_tab",
        L:     "history_back",
        R:     "history_forward",
        UL:    "prev_tab",
        UR:    "next_tab",
        wU:    "scroll_to_top",                 //Not Supported Yet
        wD:    "scroll_to_bottom",              //Not Supported Yet
        DR:    "close_tab",
        LU:    "undo_close_tab",
        DU:    "duplicate_tab",
        lDU:   "open_in_newtab_background",     //Not Supported Yet
        UD:    "reload_tab",
        UDU:   "reload_tab_bypass_cache",
        URD:   "view_source",
        UDR:   "split_tabs",
        UDL:   "merge_tabs",                    //Not Supported Yet
        LDR:   "list_cookies",                  //Not Supported Yet
        RDLUR: "open_options",                  //Not Supported Yet
        RDLD:  "open_status"                    //Not Supported Yet
    }
};

var PRE_ACTIONS = {
    close_tab: function(tab){
        chrome.tabs.remove(tab.id);
    },
    close_other_tabs: function(tab){
        chrome.query({windowId: tab.windowId}, function(tabs){
            for (var i = tabs.length - 1; i >= 0; i--) {
                if (!tabs[i].pinned && tabs[i].id != tab.id) {
                    chrome.tabs.remove(tabs[i].id);
                };
            };
        });
    },
    close_tabs_to_the_left: function(tab){
        chrome.query({windowId: tab.windowId}, function(tabs){
            for (var i = tabs.length - 1; i >= 0; i--) {
                if (tabs[i].index < tab.index && !tabs[i].pinned) {
                    chrome.tabs.remove(tabs[i].id);
                };
            };
        });
    },
    close_tabs_to_the_right: function(tab){
        chrome.query({windowId: tab.windowId}, function(tabs){
            for (var i = tabs.length - 1; i >= 0; i--) {
                if (tabs[i].index > tab.index && !tabs[i].pinned) {
                    chrome.tabs.remove(tabs[i].id);
                }
            };
        });
    },
    close_window: function(tab){
        chrome.windows.remove(tab.windowId);
    },
    duplicate_tab: function(tab){
        chrome.tabs.duplicate(tab.id);
    },
    full_screen: function(tab){
        chrome.windows.update(tab.windowId, {state: "fullscreen"});
    },
    history_back: function(tab){
        chrome.tabs.executeScript(tab.id, {code: "history.back();"});
    },
    history_forward: function(tab){
        chrome.tabs.executeScript(tab.id, {code: "history.forward();"});
    },
    maximize_window: function(tab){
        var toggle = {maximized: "normal", normal: "maximized", fullscreen: "maximized", minimized: "normal"};
        chrome.windows.get(tab.windowId, null, function(window){
            chrome.windows.update(tab.windowId, {state: toggle[window.state]});
        });
    },
    minimize_window: function(tab){
        chrome.windows.update(tab.windowId, {state: "minimized"});
    },
    move_to_left: function(tab){
        chrome.tabs.move(tab.id, {index: 0});
    },
    move_to_right: function(tab){
        chrome.tabs.move(tab.id, {index: -1});
    },
    navigate_to_new_tab: function(tab){
        chrome.tabs.update(tab.id, {url: "chrome://newtab"});
    },
    new_tab: function(tab){
        chrome.tabs.create({index: tab.index + 1});
    },
    new_window: function(tab){
        chrome.windows.create({});
    },
    next_tab: function(tab){
        chrome.tabs.query({index: tab.index + 1, windowId: tab.windowId}, function(tabs){
            chrome.tabs.update(tabs[0].id, {active: true});
        });
    },
    open_bookmarks: function(tab){
        chrome.tabs.create({index: tab.index + 1, url: "chrome://bookmarks/"});
    },
    open_downloads: function(tab){
        chrome.tabs.create({index: tab.index + 1, url: "chrome://downloads/"});
    },
    open_extensions: function(tab){
        chrome.tabs.create({index: tab.index + 1, url: "chrome://extensions/"});
    },
    open_history: function(tab){
        chrome.tabs.create({index: tab.index + 1, url: "chrome://history/"});
    },
    pin_tab: function(tab){
        chrome.tabs.update(tab.id, {pinned: true});
    },
    prev_tab: function(tab){
        chrome.tabs.query({index: tab.index - 1, windowId: tab.windowId}, function(tabs){
            chrome.tabs.update(tabs[0].id, {active: true});
        });
    },
    print_tab: function(tab){
        chrome.tabs.executeScript(tab.id, {code: "window.print();"});
    },
    reload_all_tabs: function(tab){
        chrome.tabs.query({windowId: tab.windowId}, function(tabs){
            for (var i = tabs.length - 1; i >= 0; i--) {
                chrome.tabs.reload(tabs[i].id);
            };
        });
    },
    reload_all_tabs_bypass_cache: function(tab){
        chrome.tabs.query({windowId: tab.windowId}, function(tabs){
            for (var i = tabs.length - 1; i >= 0; i--) {
                chrome.tabs.reload(tabs[i].id, {bypassCache: true});
            };
        });
    },
    reload_tab: function(tab){
        chrome.tabs.reload(tab.id);
    },
    reload_tab_bypass_cache: function(tab){
        chrome.tabs.reload(tab.id, {bypassCache: true});
    },
    split_tabs: function(tab){
        chrome.windows.get(tab.windowId, {populate: true}, function(window){
            chrome.windows.create({
                focused: true, type: window.type,
                incognito: window.incognito, tabId: tab.id
            }, function(createdWindow){
                for (var i = window.tabs.length - 1; i >= 0; i--) {
                    if (window.tabs[i].index > tab.index) {
                        chrome.tabs.move(window.tabs[i].id, {windowId: createdWindow.id, index: window.tabs[i].index - tab.index});
                    }
                };
            });
        });
    },
    stop_loading: function(tab){
        chrome.tabs.executeScript(tab.id, {code: "window.stop();"});
    },
    toggle_pin_tab: function(tab){
        chrome.tabs.update(tab.id, {pinned: !tab.pinned});
    },
    undo_close_tab: function(tab){
        chrome.sessionRestore.getRecentlyClosed({maxResults: 1}, function(entries){
            chrome.sessionRestore.restore(entries[0].id);
        });
    },
    unpin_tab: function(tab){
        chrome.tabs.update(tab.id, {pinned: false});
    },
    view_source: function(tab){
        chrome.tabs.create({index: tab.index + 1, url: "view-source:" + tab.url, openerTabId: tab.id});
    }
};