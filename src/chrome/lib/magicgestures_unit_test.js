/**
 * @fileoverview Magic Gestures object unit tests.
 * @author sunny@magicgestures.org {Sunny}
 * @version 0.0.0.2
 */

/*global MagicGestures: false*/
/*jshint devel: true, strict: true, globalstrict: true */

"use strict";

// Test for logging module.
var loggingTest =function() {
    console.group("Testing MagicGestures.logging module");

    MagicGestures.logging.assert(true, "You should not see this message.", {obj: "ect"});
    MagicGestures.logging.assert(false, "You should see this message.", {obj: "ect"});

    MagicGestures.logging.debug("This is a", "debug message.");

    MagicGestures.logging.dir({bio: "I'm an object", say: "hello world"});

    MagicGestures.logging.error("This is an", "error message.");

    MagicGestures.logging.log("This is a", "log message.");

    MagicGestures.logging.info("This is an", "info message.");

    MagicGestures.logging.warn("This is a", "warn message");

    console.groupEnd();
};

// Test for initialize runtime enviroment.
var runtimeInitTest = function() {
    console.group("Testing for initialize MagicGestures.runtime");

    var ContentScriptMagicGestures = Object.create(MagicGestures);
    var BackgroundMagicGestures = Object.create(MagicGestures);
    var OptionsMagicGestures = Object.create(MagicGestures);
    var InvaildMagicGestures = Object.create(MagicGestures);
    var PopupMagicGestures = Object.create(MagicGestures);

    ContentScriptMagicGestures.runOnce();
    ContentScriptMagicGestures.init("content script");

    BackgroundMagicGestures.runOnce();
    BackgroundMagicGestures.init("background");

    OptionsMagicGestures.runOnce();
    OptionsMagicGestures.init("options");

    PopupMagicGestures.runOnce();
    PopupMagicGestures.init("popup");

    InvaildMagicGestures.runOnce();
    InvaildMagicGestures.init("invaild data");

    ["get", "set", "clear", "remove", "tabBroadcast", "sendTabMessage"].forEach(function(func) {
        if (func in ContentScriptMagicGestures.runtime) {
            MagicGestures.logging.error(func, "should not in content script magicgestures runtime");
        }
    });

    console.groupEnd();
};

// Test for runtime.get.
var runtimeGetTest =  function() {
    console.group("Testing MagicGestures.runtime.get");
    localStorage.setItem("runtime", JSON.stringify({hello: "world", world: "hello", chromium: "browser"}));

    var result = MagicGestures.runtime.get("hello");
    MagicGestures.logging.assert(Object.keys(result).length === 1, "Not correct properties count.", result);
    MagicGestures.logging.assert(result.hello === "world", "Name string get failed.", result);

    result = MagicGestures.runtime.get(["hello", "world"]);
    MagicGestures.logging.assert(Object.keys(result).length === 2, "Not correct properties count.", result);
    MagicGestures.logging.assert(result.hello === "world" && result.world === "hello", "Name list get failed.", result);

    result = MagicGestures.runtime.get({chromium: "test", google: "chrome"});
    MagicGestures.logging.assert(Object.keys(result).length === 2, "Not correct properties count.", result);
    MagicGestures.logging.assert(result.chromium === "browser" && result.google === "chrome", "Name object get failed.", result);

    result = MagicGestures.runtime.get(null);
    MagicGestures.logging.assert(Object.keys(result).length === 3, "Not correct properties count.", result);
    MagicGestures.logging.assert(result.hello === "world" && result.world === "hello" && result.chromium === "browser", "Null name get failed.", result);

    console.groupEnd();
};

// Test for runtime.set.
var runtimeSetTest = function() {
    console.group("Testing for MagicGestures.runtime.set");

    MagicGestures.runtime.set({hello: "chromium", test: "only", func: function(){}});
    var result = MagicGestures.runtime.get(["hello", "world", "chromium", "test", "func"]);
    MagicGestures.logging.assert(Object.keys(result).length === 4, "Not correct properties count.", result, Object.keys(result).length);
    //MagicGestures.logging.assert(Object.keys(result.func).length === 0, "Deserialize function to empty object failed.", result);
    MagicGestures.logging.assert(result.hello === "chromium" && result.world === "hello" &&
        result.chromium === "browser" && result.test === "only", "Merge items in set function failed.", result);

    console.groupEnd();
};

var runtimeRemoveTest = function() {
    console.group("Testing for MagicGestures.runtime.remove");

    MagicGestures.runtime.remove("func");
    var result = MagicGestures.runtime.get("func");
    MagicGestures.logging.assert(typeof result.func === "undefined", "Remove string of name failed.", result);

    MagicGestures.runtime.remove(["hello", "world"]);
    result = MagicGestures.runtime.get(["hello", "world"]);
    MagicGestures.logging.assert(typeof result.hello === "undefined" && typeof result.world === "undefined", "Remove list of names failed.", result);

    console.groupEnd();
};

var runtimeClearTest = function() {
    console.group("Testing for MagicGestures.runtime.clear");

    MagicGestures.runtime.clear();
    var result = MagicGestures.runtime.get(null);
    MagicGestures.logging.assert(Object.keys(result).length === 0, "Clear runtime failed.", result);

    console.groupEnd();
};

loggingTest();
runtimeInitTest;
runtimeGetTest();
runtimeSetTest();
runtimeRemoveTest();
runtimeClearTest();