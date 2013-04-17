/**
 * @fileoverview Magic Gestures event page script file.
 * @author sunny@magicgestures.org {Sunny}
 * @version 0.0.0.3
 */

MagicGestures.runtime.init = function(callback){
    MagicGestures.log("Initializing runtime environment...");
    chrome.storage.local.set({runtime: {}});
    chrome.storage.local.get("settings", function(items) {
        if ("settings" in items && "type" in items.settings) {
            MagicGestures.runtime.storage_backend = (items.settings.type === "sync") ? chrome.storage.sync : chrome.storage.local;
        }
        if (callback !== undefined) { callback.call(null); }
    });
    return void(0);
};

MagicGestures.settings.storage.switchBackend = function(type, callback){
    chrome.storage.local.get("settings", function(items){
        items.settings.type = type;
        chrome.storage.local.set(items, callback);
    });
    MagicGestures.settings.storage._backend = (type === "sync") ? chrome.storage.sync : chrome.storage.local;
    return void(0);
};

MagicGestures.settings.init = function(callback){
    MagicGestures.log("Initializing settings environment...");
    MagicGestures.settings.storage.init(function(){
        var gestureTrie = Object.create(null);
        for (var key in PRE_GESTURES.MagicGestures) {
            var currentRoot = gestureTrie;
            for(var i = 0 ; i < key.length ; i++){
                var ch = key.charAt(i);
                if (!(ch in currentRoot)) {currentRoot[ch] = Object.create(null);}
                currentRoot = currentRoot[ch];
            }
            currentRoot.check = true;
            currentRoot.command = PRE_GESTURES.MagicGestures[key];
        }
        MagicGestures.runtime.gestureTrie = gestureTrie;
        if (callback !== undefined) { callback.call(null); }
    });
};

MagicGestures.handler = {
    pageAction: function(id, changeInfo, tab){
        chrome.pageAction.show(id);
    },
    tabMessage: function(request, sender, sendResponse){
        MagicGestures.debug(sender.tab ? "从页面" + sender.tab.url + "的内容脚本中收到消息" : "从扩展中收到消息");

        if(sender.tab){
            MagicGestures.debug(request.command);
            PRE_ACTIONS[request.command].call(null, sender.tab);
        }
        sendResponse({status: "Your message has been receieved."});
    }
};

MagicGestures.init = function(){
    MagicGestures.log("Initializing MagicGestures...");
    MagicGestures.runtime.init(function(){
        MagicGestures.settings.init(function(){
            MagicGestures.log("Initializing pageAction and onMessage listener...");
            //Show page action.
            chrome.tabs.onUpdated.addListener(MagicGestures.handler.pageAction);
            //Receive message from content scripts.
            chrome.runtime.onMessage.addListener(MagicGestures.handler.tabMessage);
        });
    });
};

MagicGestures.init();