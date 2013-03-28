var preDefindedActions = {
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
        chrome.tabs.duplicate()
    },
    history_back: function(tab){
        chrome.tabs.executeScript(tab.id, {code: "history.back();"});
    },
    history_forward: function(tab){
        chrome.tabs.executeScript(tab.id, {code: "history.forward();"});
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