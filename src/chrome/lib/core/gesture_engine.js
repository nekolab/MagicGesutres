//Magic Gestures classic gesture engine.

var THRESHOLD = 1 / 15 ;
var ANGLE_LIST = [{"min": 130, "max": 140, "Direct": "1"}, {"min": 50, "max": 130, "Direct": "D"}, {"min": 40, "max": 50, "Direct": "3"},
                  {"min": -40, "max": 40, "Direct": "R"}, {"min": -50, "max": -40, "Direct": "9"}, {"min": -130, "max": -50, "Direct": "U"},
                  {"min": -140, "max": -130, "Direct": "7"}, {"min": 140, "max": 181, "Direct": "L"}, {"min": -180, "max": -140, "Direct": "L"}] ;

Math.getMaxOfArray = function(numArray){
    return Math.max.apply(null, numArray);
} ;

Math.getMinOfArray = function(numArray){
    return Math.min.apply(null, numArray);
}

var Point = function(x, y){
    this.x = x ;
    this.y = y ;

    this.toString = function(){return "x: " + x + ", y: " + y + "\n";}
} ;

var Vector = function(x, y){
    this.x = x ;
    this.y = y ;

    this.mod = function(){return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2)) ;}

    this.angle2 = function(vect){
        var dot = this.x * vect.x + this.y * vect.y ;
        var plus = Math.sqrt((Math.pow(this.x, 2) + Math.pow(this.y, 2)) * (Math.pow(vect.x, 2) + Math.pow(vect.y, 2))) ;
        return Math.acos(dot / plus) ;
    }

    this.angle = function(){
        return (this.y >= 0) ? this.angle2(new Vector(1, 0)) : -1 * this.angle2(new Vector(1,0)) ;
    }
}
Vector.R2D = function(r){return r * 180 / Math.PI ;}

filterPoint = function(pointlist){
    //preformace fix needed
    var xArr = pointlist.map(function(e, i, a){return e.x}) ;
    var yArr = pointlist.map(function(e, i, a){return e.y}) ;

    var gestureWidth = Math.getMaxOfArray(xArr) - Math.getMinOfArray(xArr) ;
    var gestureHeigth = Math.getMaxOfArray(yArr) - Math.getMinOfArray(yArr) ;

    var minWidth = gestureWidth * THRESHOLD ;
    var minHeight = gestureHeigth * THRESHOLD ;
    var minLength = Math.sqrt(Math.pow(minWidth, 2) + Math.pow(minHeight, 2)) ;
    //console.log("minLength = " + minLength);

    var first = pointlist.shift() , second ;
    var gestureList = new Array() ;

    do{
        second = pointlist.shift() ;
        if(second == undefined){break ;}
        var vect = new Vector(second.x - first.x, second.y - first.y) ;
        if(vect.mod() < minLength){continue ;}
        //console.log(first + " and " + second + "mod" + vect.mod()) ;
        var angle = Vector.R2D(vect.angle()) ;
        //console.log(angle) ;
        var direct = ANGLE_LIST.filter(function(e, i, a){return e.min <= angle && angle < e.max ;})[0].Direct ;
        var temp = gestureList.pop() ;
        if (direct == temp || temp == undefined){
            gestureList.push(direct) ;
        } else{
            gestureList.push(temp);
            gestureList.push(direct) ;
        }
        first = second ;
    }while(true) ;
    return gestureList ;
} ;