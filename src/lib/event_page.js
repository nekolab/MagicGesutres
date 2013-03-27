//Magic Gestures event page script file.

var gestureList = {
    "L":    "history-back",
    "R":    "history-forward",
    "DR":   "close-tab",
    "LU":   "undo-close-tab"
};

var action = {
    "close-tab": function(tab){
        chrome.tabs.remove(tab.id, function(){}) ;
    },
    "history-back": function(tab){
        chrome.tabs.executeScript(tab.id, {"code": "history.back();"}) ;
    },
    "history-forward": function(tab){
        chrome.tabs.executeScript(tab.id, {"code": "history.forward();"}) ;
    },
    "undo-close-tab": function(tab){
        chrome.sessionRestore.getRecentlyClosed({"maxResults": 1}, function(entries){
            chrome.sessionRestore.restore(entries[0].id) ;
        }) ;
    }
};

//Show page action.
chrome.tabs.onUpdated.addListener(function(id, changeInfo, tab){
    chrome.pageAction.show(id) ;
});


//Receive message from content scripts.
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
    console.log(sender.tab ? "从页面" + sender.tab.url + "的内容脚本中收到消息" : "从扩展中收到消息");

    if(sender.tab){
        var gesture = filterPoint(JSON.parse(request.pointList)).join("") ;
        console.log(gesture) ;
        action[gestureList[gesture]].call(null, sender.tab) ;
    }
    sendResponse({status: "Your message has been receieved."}) ;
});