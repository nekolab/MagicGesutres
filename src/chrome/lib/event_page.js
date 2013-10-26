/**
 * @fileoverview Magic Gestures event page script file.
 * @author sunny@magicgestures.org {Sunny}
 * @version 0.0.1.0
 */

/*global chrome: false, MagicGestures: true */
/*jshint strict: true, globalstrict: true */

"use strict";

MagicGestures.handler = {
    pageAction: function(id, changeInfo, tab){
        chrome.pageAction.show(id);
    },
    tabMessage: function(request, sender, sendResponse){
        MagicGestures.debug(sender.tab ? "从页面" + sender.tab.url + "的内容脚本中收到消息" : "从扩展中收到消息");

        if(sender.tab){
            MagicGestures.debug(request.command);
            MagicGestures.Preset.Actions[request.command].call(null, sender.tab);
        }
        sendResponse({status: "Your message has been receieved."});
    }
};

MagicGestures.init = function(isStartup) {
    MagicGestures.logging.log("Initializing MagicGestures...");
    MagicGestures.runtime.init("background", function() {
        MagicGestures.ProfileManager.init(function() {
            MagicGestures.logging.log("Initializing pageAction and onMessage listener...");
            //Show page action.
            //chrome.tabs.onUpdated.addListener(MagicGestures.handler.pageAction);
            //Receive message from content scripts.
            //chrome.runtime.onMessage.addListener(MagicGestures.handler.tabMessage);
            MagicGestures.runtime.listener.add("ACT", function(msg, sendResponse, sender) {
                MagicGestures.logging.debug(msg);
                //alert(msg);
                MagicGestures.Preset.Actions[msg].call(null, sender.tab);
            });
        });
    }, isStartup);
};

MagicGestures.init(false);

chrome.runtime.onStartup.addListener(function() {
    MagicGestures.logging.debug("Stratup init");
    //MagicGestures.init(true);
});