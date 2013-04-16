/**
 * @fileoverview Magic Gestures content script file.
 * @author sunny@magicgestures.org {Sunny}
 * @version 0.0.0.1
 */

Object.defineProperties(MagicGestures, {
    clientWidth:  {
        value: document.documentElement.clientWidth,
        writable: false
    },
    clientHeight: {
        value: document.documentElement.clientHeight,
        writable: false
    },
    gesture: { value: Object.create(null), writable: true }
});

Object.defineProperties(MagicGestures.gesture, {
    code:     { value: "", writable: true },
    distance: { value: 0 , writable: true },
    locus:    { value: Object.create(null), writable: true }
});

Object.defineProperties(MagicGestures.gesture.locus, {
    points:      { value: [], writable: true },
    gestureTrie: { value: [], writable: true },
    startPoint:  { value: {x: 0, y: 0}, writable: true }
});

MagicGestures.gesture.reset = function(){
    MagicGestures.gesture.code = "";
    MagicGestures.gesture.distance = 0;
    MagicGestures.gesture.locus.points = [];
    MagicGestures.gesture.locus.gestureTrie = MagicGestures.runtime.gestureTrie;
    MagicGestures.gesture.locus.startPoint = {x: 0, y: 0};
};

MagicGestures.handler = {
    disableContext: function(e){
        e.preventDefault();
        MagicGestures.debug("Right-Click Disabled!!!");
    },
    mousedown: function(e){
        MagicGestures.debug("Mouse Down!!!");
        if (e.button == MagicGestures.settings.holdBtn) {
            MagicGestures.gesture.reset();
            MagicGestures.gesture.locus.startPoint = {x: e.clientX, y: e.clientY};
            MagicGestures.gesture.locus.points.push({x: e.clientX, y: e.clientY});
            MagicGestures.debug("Right Mouse Down!!! X @ " + e.clientX + " , Y @ " + e.clientY);
            if (document.oncontextmenu == MagicGestures.handler.disableContext) {
                document.oncontextmenu = MagicGestures.handler.oncontextmenuBak; }
            MagicGestures.debug("Right-Click Enabled!!!");
        }
    },
    mousemove: function(e){
        if (e.button == MagicGestures.settings.holdBtn && e.clientX !== MagicGestures.gesture.locus.startPoint.x && e.clientY !== MagicGestures.gesture.locus.startPoint.y) {
            if (! this.divInserted) {
                this.insertedDiv = document.createElement("div");
                this.insertedDiv.setAttribute("style", "position: fixed; left: 0px; top: 0px;\
                    display: block; z-index: 999999; border: none; background-color: transparent;");
                this.insertedDiv.style.width = MagicGestures.clientWidth + "px";
                this.insertedDiv.style.height = MagicGestures.clientHeight + "px";

                this.insertedSVG = document.createElementNS("http://www.w3.org/2000/svg", "svg");
                this.insertedSVG.style.position = "absolute";
                this.insertedSVG.style.width = MagicGestures.clientWidth + "px";
                this.insertedSVG.style.height = MagicGestures.clientHeight + "px";

                this.insertedPolyline = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
                this.insertedPolyline.setAttribute("stroke", MagicGestures.settings.lineColor);
                this.insertedPolyline.setAttribute("stroke-width", MagicGestures.settings.lineWidth);
                this.insertedPolyline.setAttribute("fill", "none");

                this.insertedSVG.appendChild(this.insertedPolyline);
                this.insertedDiv.appendChild(this.insertedSVG);
                document.body.appendChild(this.insertedDiv);
                this.divInserted = true;
                MagicGestures.handler.oncontextmenuBak = document.oncontextmenu;
                document.oncontextmenu = MagicGestures.handler.disableContext;
            }
            var svgPoint = this.insertedSVG.createSVGPoint();
            svgPoint.x = e.clientX;
            svgPoint.y = e.clientY;
            this.insertedPolyline.points.appendItem(svgPoint);

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

                if (MagicGestures.gesture.locus.gestureTrie[currDir]) {
                    MagicGestures.gesture.locus.gestureTrie = MagicGestures.gesture.locus.gestureTrie[currDir];
                    MagicGestures.gesture.code += currDir;
                } else {
                    //TODO: endGesture
                }
            }
        }
    },
    mouseup: function(e){
        MagicGestures.debug("Mouse UP!!!");
        if (e.button == MagicGestures.settings.holdBtn && this.divInserted) {
            document.body.removeChild(this.insertedDiv);
            this.divInserted = false;
            MagicGestures.debug("Right Mouse Up!!!   X @ " + e.clientX + " , Y @ " + e.clientY);
            MagicGestures.debug(MagicGestures.gesture.code);
            MagicGestures.debug(MagicGestures.gesture.locus.gestureTrie);
            if (MagicGestures.gesture.locus.gestureTrie["check"]) {
                chrome.runtime.sendMessage({
                    command: MagicGestures.gesture.locus.gestureTrie.command
                }, function(response){
                    MagicGestures.debug(response.status);
                });
            }
            MagicGestures.gesture.reset();
        }
    }
};

MagicGestures.settings.init = function(callback){
    MagicGestures.debug("Initializing settings environment...");
    MagicGestures.settings.storage.init(function(){
        MagicGestures.settings.storage.get(["enable", "holdBtn", "lineWidth", "lineColor"], function(items){
            MagicGestures.settings.enable    = items.enable;
            MagicGestures.settings.holdBtn   = items.holdBtn;
            MagicGestures.settings.lineWidth = items.lineWidth;
            MagicGestures.settings.lineColor = items.lineColor;
            MagicGestures.runtime.get("gestureTrie", function(item){
                MagicGestures.runtime.gestureTrie = item.gestureTrie;
                MagicGestures.gesture.locus.gestureTrie = item.gestureTrie;
                if (callback !== undefined) {callback.call(null);}
            });
        });
    });
};

MagicGestures.init = function(){
    MagicGestures.settings.init(function(){
        if (MagicGestures.settings.enable) {
            MagicGestures.debug("Initializing action listener...");
            document.addEventListener("mousedown", MagicGestures.handler.mousedown, true);
            document.addEventListener("mousemove", MagicGestures.handler.mousemove, true);
            document.addEventListener("mouseup",   MagicGestures.handler.mouseup,   true);
        }
    });
};

MagicGestures.init();