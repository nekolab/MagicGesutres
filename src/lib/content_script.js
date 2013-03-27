//Magic Gestures content script file.


/*
MagicGestures Class.
*/
var MagicGestures = function(config){

    this.clientWidth  = document.documentElement.clientWidth ;
    this.clientHeight = document.documentElement.clientHeight ;

    this._pointList = new Array() ;

    this.config = JSON.parse(config);

    //A java style hack to simulate OuterClass.this reference.
    var MagicGestures = {"this": this} ;

    this.init = function(){
        if(this.config.enable){
            document.addEventListener("mousedown", this._eventHandler.mousedown, true) ;
            document.addEventListener("mousemove", this._eventHandler.mousemove, true) ;
            document.addEventListener("mouseup",   this._eventHandler.mouseup,   true) ;
        }
    } ;

    var Point = function(x, y){
        this.x = x ;
        this.y = y ;

        this.toString = function(){return "x: " + x + ", y: " + y + "\n";}
    } ;

    this._eventHandler = {
        "divInserted": false,
        "insertedDiv": null,
        "insertedSVG": null,
        "insertedPolyline": null,
        "oncontextmenuBak": null,
        "disableContext": function(e){
            e.preventDefault() ;
            console.log("Right-Click Disabled!!!") ;
        },
        "mousedown": function(e){
            if(e.button == 2){
                this._startX = e.clientX ;
                this._startY = e.clientY ;
                console.log("Right Mouse Down!!! X @ " + e.clientX + " , Y @ " + e.clientY) ;
                if(document.oncontextmenu == MagicGestures.this._eventHandler.disableContext){
                    document.oncontextmenu = MagicGestures.this._eventHandler.oncontextmenuBak ;
                }
                console.log("Right-Click Enabled!!!") ;
            }
        },
        "mousemove": function(e){
            if(e.button == 2 && e.clientX != this._startX && e.clientY != this._startY){
                if(! this.divInserted){
                    this.insertedDiv = document.createElement("div") ;
                    this.insertedDiv.setAttribute("style", "position: fixed; left: 0px; top: 0px;\
                        display: block; z-index: 999999; border: none; background-color: transparent;") ;
                    this.insertedDiv.style.width = MagicGestures.this.clientWidth + "px" ;
                    this.insertedDiv.style.height = MagicGestures.this.clientHeight + "px" ;

                    this.insertedSVG = document.createElementNS("http://www.w3.org/2000/svg", "svg") ;
                    this.insertedSVG.style.position = "absolute" ;
                    this.insertedSVG.style.width = MagicGestures.this.clientWidth + "px" ;
                    this.insertedSVG.style.height = MagicGestures.this.clientHeight + "px" ;

                    this.insertedPolyline = document.createElementNS("http://www.w3.org/2000/svg", "polyline") ;
                    this.insertedPolyline.setAttribute("stroke", MagicGestures.this.config.lineColor) ;
                    this.insertedPolyline.setAttribute("stroke-width", MagicGestures.this.config.lineWidth) ;
                    this.insertedPolyline.setAttribute("fill", "none") ;

                    this.insertedSVG.appendChild(this.insertedPolyline) ;
                    this.insertedDiv.appendChild(this.insertedSVG) ;
                    document.body.appendChild(this.insertedDiv) ;
                    this.divInserted = true ;
                    MagicGestures.this._eventHandler.oncontextmenuBak = document.oncontextmenu ;
                    document.oncontextmenu = MagicGestures.this._eventHandler.disableContext ;
                }
                var svgPoint = this.insertedSVG.createSVGPoint();
                svgPoint.x = e.clientX ;
                svgPoint.y = e.clientY ;
                this.insertedPolyline.points.appendItem(svgPoint) ;

                MagicGestures.this._pointList.push(new Point(e.clientX, e.clientY)) ;

                //console.log("Right Mouse Move!!! X @ " + e.clientX + " , Y @ " + e.clientY) ;
            }
        },
        "mouseup": function(e){
            if(e.button == 2 && this.divInserted){
                document.body.removeChild(this.insertedDiv) ;
                this.divInserted = false ;
                console.log("Right Mouse Up!!!   X @ " + e.clientX + " , Y @ " + e.clientY) ;
                console.log("Gestures End, point list: " + MagicGestures.this._pointList) ;
                chrome.runtime.sendMessage({
                    "pointList": JSON.stringify(MagicGestures.this._pointList)
                }, function(response){
                    console.log(response.status) ;
                }) ;
                MagicGestures.this._pointList = new Array() ;
            }
        }
    } ;
} ;

var config = {
    "enable": true ,
    "lineColor": "rgba(18,89,199,0.8)" ,
    "lineWidth": 2
}

new MagicGestures(JSON.stringify(config)).init()