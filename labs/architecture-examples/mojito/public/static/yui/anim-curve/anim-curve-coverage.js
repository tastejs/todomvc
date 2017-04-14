/*
YUI 3.7.3 (build 5687)
Copyright 2012 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/
if (typeof _yuitest_coverage == "undefined"){
    _yuitest_coverage = {};
    _yuitest_coverline = function(src, line){
        var coverage = _yuitest_coverage[src];
        if (!coverage.lines[line]){
            coverage.calledLines++;
        }
        coverage.lines[line]++;
    };
    _yuitest_coverfunc = function(src, name, line){
        var coverage = _yuitest_coverage[src],
            funcId = name + ":" + line;
        if (!coverage.functions[funcId]){
            coverage.calledFunctions++;
        }
        coverage.functions[funcId]++;
    };
}
_yuitest_coverage["build/anim-curve/anim-curve.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/anim-curve/anim-curve.js",
    code: []
};
_yuitest_coverage["build/anim-curve/anim-curve.js"].code=["YUI.add('anim-curve', function (Y, NAME) {","","/**"," * Adds support for the <code>curve</code> property for the <code>to</code> "," * attribute.  A curve is zero or more control points and an end point."," * @module anim"," * @submodule anim-curve"," */","","Y.Anim.behaviors.curve = {","    set: function(anim, att, from, to, elapsed, duration, fn) {","        from = from.slice.call(from);","        to = to.slice.call(to);","        var t = fn(elapsed, 0, 100, duration) / 100;","        to.unshift(from);","        anim._node.setXY(Y.Anim.getBezier(to, t));","    },","","    get: function(anim, att) {","        return anim._node.getXY();","    }","};","","/**"," * Get the current position of the animated element based on t."," * Each point is an array of \"x\" and \"y\" values (0 = x, 1 = y)"," * At least 2 points are required (start and end)."," * First point is start. Last point is end."," * Additional control points are optional.     "," * @for Anim"," * @method getBezier"," * @static"," * @param {Array} points An array containing Bezier points"," * @param {Number} t A number between 0 and 1 which is the basis for determining current position"," * @return {Array} An array containing int x and y member data"," */","Y.Anim.getBezier = function(points, t) {  ","    var n = points.length;","    var tmp = [];","","    for (var i = 0; i < n; ++i){","        tmp[i] = [points[i][0], points[i][1]]; // save input","    }","    ","    for (var j = 1; j < n; ++j) {","        for (i = 0; i < n - j; ++i) {","            tmp[i][0] = (1 - t) * tmp[i][0] + t * tmp[parseInt(i + 1, 10)][0];","            tmp[i][1] = (1 - t) * tmp[i][1] + t * tmp[parseInt(i + 1, 10)][1]; ","        }","    }","","    return [ tmp[0][0], tmp[0][1] ]; ","","};","","","}, '3.7.3', {\"requires\": [\"anim-xy\"]});"];
_yuitest_coverage["build/anim-curve/anim-curve.js"].lines = {"1":0,"10":0,"12":0,"13":0,"14":0,"15":0,"16":0,"20":0,"37":0,"38":0,"39":0,"41":0,"42":0,"45":0,"46":0,"47":0,"48":0,"52":0};
_yuitest_coverage["build/anim-curve/anim-curve.js"].functions = {"set:11":0,"get:19":0,"getBezier:37":0,"(anonymous 1):1":0};
_yuitest_coverage["build/anim-curve/anim-curve.js"].coveredLines = 18;
_yuitest_coverage["build/anim-curve/anim-curve.js"].coveredFunctions = 4;
_yuitest_coverline("build/anim-curve/anim-curve.js", 1);
YUI.add('anim-curve', function (Y, NAME) {

/**
 * Adds support for the <code>curve</code> property for the <code>to</code> 
 * attribute.  A curve is zero or more control points and an end point.
 * @module anim
 * @submodule anim-curve
 */

_yuitest_coverfunc("build/anim-curve/anim-curve.js", "(anonymous 1)", 1);
_yuitest_coverline("build/anim-curve/anim-curve.js", 10);
Y.Anim.behaviors.curve = {
    set: function(anim, att, from, to, elapsed, duration, fn) {
        _yuitest_coverfunc("build/anim-curve/anim-curve.js", "set", 11);
_yuitest_coverline("build/anim-curve/anim-curve.js", 12);
from = from.slice.call(from);
        _yuitest_coverline("build/anim-curve/anim-curve.js", 13);
to = to.slice.call(to);
        _yuitest_coverline("build/anim-curve/anim-curve.js", 14);
var t = fn(elapsed, 0, 100, duration) / 100;
        _yuitest_coverline("build/anim-curve/anim-curve.js", 15);
to.unshift(from);
        _yuitest_coverline("build/anim-curve/anim-curve.js", 16);
anim._node.setXY(Y.Anim.getBezier(to, t));
    },

    get: function(anim, att) {
        _yuitest_coverfunc("build/anim-curve/anim-curve.js", "get", 19);
_yuitest_coverline("build/anim-curve/anim-curve.js", 20);
return anim._node.getXY();
    }
};

/**
 * Get the current position of the animated element based on t.
 * Each point is an array of "x" and "y" values (0 = x, 1 = y)
 * At least 2 points are required (start and end).
 * First point is start. Last point is end.
 * Additional control points are optional.     
 * @for Anim
 * @method getBezier
 * @static
 * @param {Array} points An array containing Bezier points
 * @param {Number} t A number between 0 and 1 which is the basis for determining current position
 * @return {Array} An array containing int x and y member data
 */
_yuitest_coverline("build/anim-curve/anim-curve.js", 37);
Y.Anim.getBezier = function(points, t) {  
    _yuitest_coverfunc("build/anim-curve/anim-curve.js", "getBezier", 37);
_yuitest_coverline("build/anim-curve/anim-curve.js", 38);
var n = points.length;
    _yuitest_coverline("build/anim-curve/anim-curve.js", 39);
var tmp = [];

    _yuitest_coverline("build/anim-curve/anim-curve.js", 41);
for (var i = 0; i < n; ++i){
        _yuitest_coverline("build/anim-curve/anim-curve.js", 42);
tmp[i] = [points[i][0], points[i][1]]; // save input
    }
    
    _yuitest_coverline("build/anim-curve/anim-curve.js", 45);
for (var j = 1; j < n; ++j) {
        _yuitest_coverline("build/anim-curve/anim-curve.js", 46);
for (i = 0; i < n - j; ++i) {
            _yuitest_coverline("build/anim-curve/anim-curve.js", 47);
tmp[i][0] = (1 - t) * tmp[i][0] + t * tmp[parseInt(i + 1, 10)][0];
            _yuitest_coverline("build/anim-curve/anim-curve.js", 48);
tmp[i][1] = (1 - t) * tmp[i][1] + t * tmp[parseInt(i + 1, 10)][1]; 
        }
    }

    _yuitest_coverline("build/anim-curve/anim-curve.js", 52);
return [ tmp[0][0], tmp[0][1] ]; 

};


}, '3.7.3', {"requires": ["anim-xy"]});
