/**
 * @fileoverview Magic Gestures event page script file.
 * @author sunny@magicgestures.org {Sunny}
 */

var MagicGestures = Object.create(null);

const DEBUG = false;

MagicGestures.debug = function(msg){
    if (DEBUG) { console.debug(msg); }
}

MagicGestures.runtime = {
    storage: {
        init: function(){
            var storage = this;
            chrome.runtime.onStartup.addListener(function(){
                storage.clear();
            });
            MagicGestures.debug("Initializing runtime storage");
        },
        get: function(keys, callback){
            chrome.storage.local.get("runtime", function(items){
                if (keys === null) {callback.call(null, items["runtime"]);}
                else {callback.call(null, items["runtime"][keys]);}
            });
            return void(0);
        },
        set: function(items, callback){
            chrome.storage.local.get("runtime", function(runtimeItems){
                for (var k in items){
                    runtimeItems["runtime"][k] = items[k];
                }
                chrome.storage.local.set(runtimeItems, callback);
            });
            return void(0);
        },
        remove: function(keys, callback){
            chrome.storage.local.get("runtime", function(runtimeItems){
                delete runtimeItems["runtime"][keys];
                chrome.storage.local.set(runtimeItems, callback);
            });
            return void(0);
        },
        clear: function(callback){
            chrome.storage.local.set({runtime: {}}, callback);
        }
    }
};

MagicGestures.handler = {
    pageAction: function(id, changeInfo, tab){
        chrome.pageAction.show(id);
    },
    tabMessage: function(request, sender, sendResponse){
        MagicGestures.debug(sender.tab ? "从页面" + sender.tab.url + "的内容脚本中收到消息" : "从扩展中收到消息");

        if(sender.tab){
            var gesture = filterPoint(JSON.parse(request.pointList)).join("");
            MagicGestures.debug(gesture);
            preDefindedActions[preDefindedGestures.Opera[gesture]].call(null, sender.tab);
        }
        sendResponse({status: "Your message has been receieved."});
    }
}

MagicGestures.init = function(){
    console.debug("Initializing MagicGestures");
    MagicGestures.runtime.storage.init();
    //Show page action.
    chrome.tabs.onUpdated.addListener(MagicGestures.handler.pageAction);
    //Receive message from content scripts.
    chrome.runtime.onMessage.addListener(MagicGestures.handler.tabMessage);
};

MagicGestures.init();