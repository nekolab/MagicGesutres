/**
 * @fileoverview Magic Gestures content script file.
 * @author sunny@magicgestures.org {Sunny}
 * @version 0.0.0.2
 */

Object.defineProperties(MagicGestures, {
    gesture: { value: Object.create(null), writable: true },
    tabs:    { value: Object.create(null), writable: true }
});

Object.defineProperties(MagicGestures.gesture, {
    code:     { value: "", writable: true },
    distance: { value: 0 , writable: true },
    locus:    { value: Object.create(null), writable: true },
    reset:    { value: function(){
            MagicGestures.gesture.code = "";
            MagicGestures.gesture.distance = 0;
            MagicGestures.gesture.locus.points = [];
            MagicGestures.gesture.locus.gestureTrie = MagicGestures.runtime.gestureTrie;
            MagicGestures.gesture.locus.startPoint = {x: 0, y: 0};
        },
        writable: false
    }
});

Object.defineProperties(MagicGestures.gesture.locus, {
    points:      { value: [], writable: true },
    gestureTrie: { value: [], writable: true },
    startPoint:  { value: {x: 0, y: 0}, writable: true }
});

Object.defineProperties(MagicGestures.tabs, {
    clientWidth: {
        value: document.documentElement.clientWidth,
        writable: true
    },
    clientHeight: {
        value: document.documentElement.clientHeight,
        writable: true
    },
    divInserted: {
        value: false,
        writable: true
    },
    _pointWaitlist: {
        value: [],
        writable: true,
        enumerable: false
    },
    _asyncDraw: {
        value: function(){
            if (this._asyncDraw.timeout) return;
            this._asyncDraw.timeout = setTimeout(function(){
                var len = MagicGestures.tabs._pointWaitlist.length;
                for (var i = 0; i < len; i++) {
                    MagicGestures.tabs.insertedPolyline.points.appendItem(MagicGestures.tabs._pointWaitlist[i]);
                }
                MagicGestures.tabs._pointWaitlist.length = 0;
                MagicGestures.tabs._asyncDraw.timeout = undefined;
            }, 10);
        },
        writable: false,
        enumerable: false
    },
    addGestureLayer: {
        value: function(){
            this.insertedDiv = document.createElement("div");
            this.insertedDiv.setAttribute("style", "position: fixed; left: 0px; top: 0px;\
                display: block; z-index: 999999; border: none; background-color: transparent;");
            this.insertedDiv.setAttribute("width", MagicGestures.tabs.clientWidth);
            this.insertedDiv.setAttribute("height", MagicGestures.tabs.clientHeight);

            this.insertedSVG = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            this.insertedSVG.style.position = "fixed";
            this.insertedSVG.style.top = "0px";
            this.insertedSVG.style.left = "0px";
            this.insertedSVG.style.zIndex = 999999;
            this.insertedSVG.setAttribute("width", MagicGestures.tabs.clientWidth);
            this.insertedSVG.setAttribute("height", MagicGestures.tabs.clientHeight);

            this.insertedPolyline = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
            this.insertedPolyline.setAttribute("stroke", MagicGestures.settings.lineColor);
            this.insertedPolyline.setAttribute("stroke-width", MagicGestures.settings.lineWidth);
            this.insertedPolyline.setAttribute("fill", "none");

            this.insertedSVG.appendChild(this.insertedPolyline);
            this.insertedDiv.appendChild(this.insertedSVG);
            document.body.appendChild(this.insertedDiv);
            this.divInserted = true;
            MagicGestures.tabs.oncontextmenuBak = document.oncontextmenu;
            document.oncontextmenu = MagicGestures.tabs.disableContext;
        },
        writable: false
    },
    appendGesturePoint: {
        value: function(point){
            var svgPoint = this.insertedSVG.createSVGPoint();
            svgPoint.x = point.x;
            svgPoint.y = point.y;
            // Disable asynchronous gesture draw.
            // this._pointWaitlist.push(svgPoint);
            // this._asyncDraw();
            this.insertedPolyline.points.appendItem(svgPoint);
        },
        writable: false
    },
    disableContext: {
        value: function(e){
            e.preventDefault();
            MagicGestures.info("Right-Click Disabled!!!");
        },
        writable: false
    },
    removeGestureLayer: {
        value: function(){
            document.body.removeChild(this.insertedDiv);
            this.divInserted = false;
        },
        writable: false
    }
});

MagicGestures.handler = {
    mousedown: function(e){
        if (e.button == MagicGestures.settings.holdBtn) {
            MagicGestures.gesture.reset();
            MagicGestures.gesture.locus.startPoint = {x: e.clientX, y: e.clientY};
            MagicGestures.gesture.locus.points.push({x: e.clientX, y: e.clientY});
            MagicGestures.info("Right Mouse Down!!! X @ " + e.clientX + " , Y @ " + e.clientY);
            if (document.oncontextmenu == MagicGestures.tabs.disableContext) {
                document.oncontextmenu = MagicGestures.tabs.oncontextmenuBak; }
            MagicGestures.info("Right-Click Enabled!!!");
        }
    },
    mousemove: function(e){
        if (e.button == MagicGestures.settings.holdBtn && e.clientX !== MagicGestures.gesture.locus.startPoint.x && e.clientY !== MagicGestures.gesture.locus.startPoint.y) {
            if (! MagicGestures.tabs.divInserted) {
                MagicGestures.tabs.addGestureLayer();
            }
            MagicGestures.tabs.appendGesturePoint({x: e.clientX, y: e.clientY});

            var current = {x: e.clientX, y: e.clientY};
            var prev = MagicGestures.gesture.locus.points.slice(-1)[0];
            MagicGestures.gesture.locus.points.push(current);
            // MagicGestures.gesture.distance calc distance

            var deltaX = current.x - prev.x;
            var deltaY = current.y - prev.y;

            var prevDir = (MagicGestures.gesture.code === "") ? "" : MagicGestures.gesture.code.substr(-1,1);
            var currDir = undefined;

            var isDiagonal = false;
            if (Math.abs(deltaX) > Math.abs(deltaY)) {
                currDir = (deltaX > 0) ? "R" : "L";
            } else if (Math.abs(deltaX) < Math.abs(deltaY)) {
                currDir = (deltaY > 0) ? "D" : "U";
            }
            /* Beacuse lack of way to check is diagonal or not
             * so I disable it temporary
             else if (deltaY < 0) {
                isDiagonal = true;
                currDir = (deltaX < 0) ? "7" : "9";
            } else {
                isDiagonal = true;
                currDir = (deltaX < 0) ? "1" : "3";
            }
            */

            if ((Math.abs(deltaX) > 15 || Math.abs(deltaY) > 15) && (currDir !== prevDir)) {

                if (MagicGestures.gesture.locus.gestureTrie) {
                    MagicGestures.gesture.locus.gestureTrie = MagicGestures.gesture.locus.gestureTrie[currDir];
                    MagicGestures.gesture.code += currDir;
                } else {
                    //TODO: endGesture
                }
            }
        }
    },
    mouseup: function(e){
        MagicGestures.info("Mouse UP!!!");
        if (e.button == MagicGestures.settings.holdBtn && MagicGestures.tabs.divInserted) {
            MagicGestures.tabs.removeGestureLayer();
            MagicGestures.info("Right Mouse Up!!!   X @ " + e.clientX + " , Y @ " + e.clientY);
            MagicGestures.log(MagicGestures.gesture.code);
            MagicGestures.debug(MagicGestures.gesture.locus.gestureTrie);
            if (MagicGestures.gesture.locus.gestureTrie && "check" in MagicGestures.gesture.locus.gestureTrie) {
                chrome.runtime.sendMessage({
                    command: MagicGestures.gesture.locus.gestureTrie.command
                }, function(response){
                    MagicGestures.debug(response.status);
                });
            }
            MagicGestures.gesture.reset();
        }
    },
    onresize: function(e){
        MagicGestures.debug("Window resized!!!");
        MagicGestures.tabs.clientWidth  = document.documentElement.clientWidth;
        MagicGestures.tabs.clientHeight = document.documentElement.clientHeight;
    }
};

MagicGestures.settings.init = function(callback){
    MagicGestures.log("Initializing settings environment...");
    MagicGestures.settings.storage.init(function(){
        MagicGestures.settings.storage.get(["enable", "holdBtn", "lineWidth", "lineColor"], function(items){
            MagicGestures.settings.enable    = items.enable;
            MagicGestures.settings.holdBtn   = items.holdBtn;
            MagicGestures.settings.lineWidth = items.lineWidth;
            MagicGestures.settings.lineColor = items.lineColor;
            MagicGestures.runtime.get("gestureTrie", function(item){
                MagicGestures.runtime.gestureTrie = item.gestureTrie;
                MagicGestures.gesture.locus.gestureTrie = item.gestureTrie;
                if (callback !== undefined) { callback.call(null); }
            });
        });
    });
};

MagicGestures.runtime.init = function(callback){
    MagicGestures.log("Initializing runtime environment...");
    MagicGestures.runtime.get("storage_backend", function(item){
        if (item.storage_backend === "sync") {
            MagicGestures.runtime.storage_backend = chrome.storage.sync;
        } else if (item.storage_backend === "local") {
            MagicGestures.runtime.storage_backend = chrome.storage.local;
        }
        if (callback !== undefined) { callback.call(null); }
    });
}

MagicGestures.init = function(){
    MagicGestures.log("Initializing MagicGestures...");
    MagicGestures.runtime.init(function(){
        MagicGestures.settings.init(function(){
            if (MagicGestures.settings.enable) {
                MagicGestures.log("Initializing action listener...");
                document.addEventListener("mousedown", MagicGestures.handler.mousedown, true);
                document.addEventListener("mousemove", MagicGestures.handler.mousemove, true);
                document.addEventListener("mouseup",   MagicGestures.handler.mouseup,   true);
                window.addEventListener  ("resize",    MagicGestures.handler.onresize,  true);
            }
        });
    });
};

MagicGestures.init();