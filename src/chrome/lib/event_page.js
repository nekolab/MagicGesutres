//Magic Gestures event page script file.

var predefined = {
    "Opera": {
        "L":    "history_back",
        "R":    "history_forward",
        "DR":   "close_tab",
        "LU":   "undo_close_tab"
    }
};

var gestureList = {
    "L":    "history_back",
    "R":    "history_forward",
    "DR":   "close_tab",
    "LU":   "undo_close_tab",
    "DUD":  "new_tab",
    "UL":   "prev_tab",
    "UR":   "next_tab",
    "UDR":  "split_tabs",
    "UDL":  "merge_tabs"
};

//Show page action.
chrome.tabs.onUpdated.addListener(function(id, changeInfo, tab){
    chrome.pageAction.show(id);
});


//Receive message from content scripts.
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
    console.log(sender.tab ? "从页面" + sender.tab.url + "的内容脚本中收到消息" : "从扩展中收到消息");

    if(sender.tab){
        var gesture = filterPoint(JSON.parse(request.pointList)).join("");
        console.log(gesture);
        preDefindedActions[gestureList[gesture]].call(null, sender.tab);
    }
    sendResponse({status: "Your message has been receieved."});
});