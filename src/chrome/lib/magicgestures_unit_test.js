/**
 * @fileoverview Magic Gestures object unit tests.
 * @author sunny@magicgestures.org {Sunny}
 * @version 0.0.0.1
 */

/*global MagicGestures: false, UNITTEST: true */
/*jshint devel: true, strict: true, globalstrict: true */

"use strict";

// Test for logging module.
var loggingTest =function(callback) {
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

	if(callback) {
		callback();
	}
};

// Test for initialize runtime enviroment.
var runtimeInitTest = function(callback) {
	console.group("Testing for initialize MagicGestures.runtime");
	var ContentScriptMagicGestures = Object.create(MagicGestures);
	var BackgroundMagicGestures = Object.create(MagicGestures);
	var InvaildMagicGestures = Object.create(MagicGestures);

	ContentScriptMagicGestures.runtime.init("content script", function() {
		BackgroundMagicGestures.runtime.init("background", function() {
			InvaildMagicGestures.runtime.init("invaild data", function() {
				MagicGestures.logging.error("You should not see this message.");
			});
			console.groupEnd();
			if(callback) {
				callback();
			}
		});
	});
};

// Test for runtime.get.
var runtimeGetTest =  function(callback) {
	console.group("Testing MagicGestures.runtime.get");
	MagicGestures.runtime.set({hello: "world", world: "hello", chromium: "browser"}, function() {
		MagicGestures.runtime.get("hello", function(result) {
			MagicGestures.logging.assert(Object.keys(result).length === 1, "Not correct properties count.", result);
			MagicGestures.logging.assert(result.hello === "world", "Name string get failed.", result);

			MagicGestures.runtime.get(["hello", "world"], function(result) {
				MagicGestures.logging.assert(Object.keys(result).length === 2, "Not correct properties count.", result);
				MagicGestures.logging.assert(result.hello === "world" && result.world === "hello", "Name list get failed.", result);

				MagicGestures.runtime.get({chromium: "test", google: "chrome"}, function(result) {
					MagicGestures.logging.assert(Object.keys(result).length === 2, "Not correct properties count.", result);
					MagicGestures.logging.assert(result.chromium === "browser" && result.google === "chrome", "Name object get failed.", result);

					MagicGestures.runtime.get(null, function(result) {
						MagicGestures.logging.assert(Object.keys(result).length === 3, "Not correct properties count.", result);
						MagicGestures.logging.assert(result.hello === "world" && result.world === "hello" &&
							result.chromium === "browser", "Null name get failed.", result);

						console.groupEnd();
						if(callback) {
							callback();
						}
					});
				});
			});
		});
	});
};

// Test for runtime.set.
var runtimeSetTest = function(callback) {
	console.group("Testing for MagicGestures.runtime.set");
	MagicGestures.runtime.set({hello: "chromium", test: "only", func: function(){}}, function() {
		MagicGestures.runtime.get(["hello", "world", "chromium", "test", "func"], function(result) {
			MagicGestures.logging.assert(Object.keys(result).length === 5, "Not correct properties count.");
			MagicGestures.logging.assert(Object.keys(result.func).length === 0, "Deserialize function to empty object failed.");
			MagicGestures.logging.assert(result.hello === "chromium" && result.world === "hello" &&
				result.chromium === "browser" && result.test === "only", "Merge items in set function failed.", result);

			console.groupEnd();
			if(callback) {
				callback();
			}
		});
	});
};

var runtimeRemoveTest = function(callback) {
	console.group("Testing for MagicGestures.runtime.remove");
	MagicGestures.runtime.remove("func", function() {
		MagicGestures.runtime.get("func", function(result) {
			MagicGestures.logging.assert(typeof result.func === "undefined", "Remove string of name failed.", result);

			MagicGestures.runtime.remove(["hello", "world"], function() {
				MagicGestures.runtime.get(["hello", "world"], function(result) {
					MagicGestures.logging.assert(typeof result.hello === "undefined" &&
						typeof result.world === "undefined", "Remove list of names failed.", result);

					console.groupEnd();
					if (callback) {
						callback();
					}
				});
			});
		});
	});
};

var runtimeClearTest = function(callback) {
	console.group("Testing for MagicGestures.runtime.clear");
	MagicGestures.runtime.clear(function() {
		MagicGestures.runtime.get(null, function(result) {
			MagicGestures.logging.assert(Object.keys(result).length === 0, "Clear runtime failed.", result);

			console.groupEnd();
			if (callback) {
				callback();
			}
		});
	});
};

if (UNITTEST) {
	loggingTest(function() {
		runtimeInitTest(function() {
			runtimeGetTest(function() {
				runtimeSetTest(function() {
					runtimeRemoveTest(function() {
						runtimeClearTest();
					});
				});
			});
		});
	});
}