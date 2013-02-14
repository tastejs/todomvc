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
_yuitest_coverage["build/anim-xy/anim-xy.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/anim-xy/anim-xy.js",
    code: []
};
_yuitest_coverage["build/anim-xy/anim-xy.js"].code=["YUI.add('anim-xy', function (Y, NAME) {","","/**"," * Adds support for the <code>xy</code> property in <code>from</code> and "," * <code>to</code> attributes."," * @module anim"," * @submodule anim-xy"," */","","var NUM = Number;","","Y.Anim.behaviors.xy = {","    set: function(anim, att, from, to, elapsed, duration, fn) {","        anim._node.setXY([","            fn(elapsed, NUM(from[0]), NUM(to[0]) - NUM(from[0]), duration),","            fn(elapsed, NUM(from[1]), NUM(to[1]) - NUM(from[1]), duration)","        ]);","    },","    get: function(anim) {","        return anim._node.getXY();","    }","};","","","","}, '3.7.3', {\"requires\": [\"anim-base\", \"node-screen\"]});"];
_yuitest_coverage["build/anim-xy/anim-xy.js"].lines = {"1":0,"10":0,"12":0,"14":0,"20":0};
_yuitest_coverage["build/anim-xy/anim-xy.js"].functions = {"set:13":0,"get:19":0,"(anonymous 1):1":0};
_yuitest_coverage["build/anim-xy/anim-xy.js"].coveredLines = 5;
_yuitest_coverage["build/anim-xy/anim-xy.js"].coveredFunctions = 3;
_yuitest_coverline("build/anim-xy/anim-xy.js", 1);
YUI.add('anim-xy', function (Y, NAME) {

/**
 * Adds support for the <code>xy</code> property in <code>from</code> and 
 * <code>to</code> attributes.
 * @module anim
 * @submodule anim-xy
 */

_yuitest_coverfunc("build/anim-xy/anim-xy.js", "(anonymous 1)", 1);
_yuitest_coverline("build/anim-xy/anim-xy.js", 10);
var NUM = Number;

_yuitest_coverline("build/anim-xy/anim-xy.js", 12);
Y.Anim.behaviors.xy = {
    set: function(anim, att, from, to, elapsed, duration, fn) {
        _yuitest_coverfunc("build/anim-xy/anim-xy.js", "set", 13);
_yuitest_coverline("build/anim-xy/anim-xy.js", 14);
anim._node.setXY([
            fn(elapsed, NUM(from[0]), NUM(to[0]) - NUM(from[0]), duration),
            fn(elapsed, NUM(from[1]), NUM(to[1]) - NUM(from[1]), duration)
        ]);
    },
    get: function(anim) {
        _yuitest_coverfunc("build/anim-xy/anim-xy.js", "get", 19);
_yuitest_coverline("build/anim-xy/anim-xy.js", 20);
return anim._node.getXY();
    }
};



}, '3.7.3', {"requires": ["anim-base", "node-screen"]});
