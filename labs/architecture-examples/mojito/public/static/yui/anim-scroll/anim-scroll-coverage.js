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
_yuitest_coverage["build/anim-scroll/anim-scroll.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/anim-scroll/anim-scroll.js",
    code: []
};
_yuitest_coverage["build/anim-scroll/anim-scroll.js"].code=["YUI.add('anim-scroll', function (Y, NAME) {","","/**"," * Adds support for the <code>scroll</code> property in <code>to</code>"," * and <code>from</code> attributes."," * @module anim"," * @submodule anim-scroll"," */","","var NUM = Number;","","//TODO: deprecate for scrollTop/Left properties?","Y.Anim.behaviors.scroll = {","    set: function(anim, att, from, to, elapsed, duration, fn) {","        var","            node = anim._node, ","            val = ([","            fn(elapsed, NUM(from[0]), NUM(to[0]) - NUM(from[0]), duration),","            fn(elapsed, NUM(from[1]), NUM(to[1]) - NUM(from[1]), duration)","        ]);","","        if (val[0]) {","            node.set('scrollLeft', val[0]);","        }","","        if (val[1]) {","            node.set('scrollTop', val[1]);","        }","    },","    get: function(anim) {","        var node = anim._node;","        return [node.get('scrollLeft'), node.get('scrollTop')];","    }","};","","","","}, '3.7.3', {\"requires\": [\"anim-base\"]});"];
_yuitest_coverage["build/anim-scroll/anim-scroll.js"].lines = {"1":0,"10":0,"13":0,"15":0,"22":0,"23":0,"26":0,"27":0,"31":0,"32":0};
_yuitest_coverage["build/anim-scroll/anim-scroll.js"].functions = {"set:14":0,"get:30":0,"(anonymous 1):1":0};
_yuitest_coverage["build/anim-scroll/anim-scroll.js"].coveredLines = 10;
_yuitest_coverage["build/anim-scroll/anim-scroll.js"].coveredFunctions = 3;
_yuitest_coverline("build/anim-scroll/anim-scroll.js", 1);
YUI.add('anim-scroll', function (Y, NAME) {

/**
 * Adds support for the <code>scroll</code> property in <code>to</code>
 * and <code>from</code> attributes.
 * @module anim
 * @submodule anim-scroll
 */

_yuitest_coverfunc("build/anim-scroll/anim-scroll.js", "(anonymous 1)", 1);
_yuitest_coverline("build/anim-scroll/anim-scroll.js", 10);
var NUM = Number;

//TODO: deprecate for scrollTop/Left properties?
_yuitest_coverline("build/anim-scroll/anim-scroll.js", 13);
Y.Anim.behaviors.scroll = {
    set: function(anim, att, from, to, elapsed, duration, fn) {
        _yuitest_coverfunc("build/anim-scroll/anim-scroll.js", "set", 14);
_yuitest_coverline("build/anim-scroll/anim-scroll.js", 15);
var
            node = anim._node, 
            val = ([
            fn(elapsed, NUM(from[0]), NUM(to[0]) - NUM(from[0]), duration),
            fn(elapsed, NUM(from[1]), NUM(to[1]) - NUM(from[1]), duration)
        ]);

        _yuitest_coverline("build/anim-scroll/anim-scroll.js", 22);
if (val[0]) {
            _yuitest_coverline("build/anim-scroll/anim-scroll.js", 23);
node.set('scrollLeft', val[0]);
        }

        _yuitest_coverline("build/anim-scroll/anim-scroll.js", 26);
if (val[1]) {
            _yuitest_coverline("build/anim-scroll/anim-scroll.js", 27);
node.set('scrollTop', val[1]);
        }
    },
    get: function(anim) {
        _yuitest_coverfunc("build/anim-scroll/anim-scroll.js", "get", 30);
_yuitest_coverline("build/anim-scroll/anim-scroll.js", 31);
var node = anim._node;
        _yuitest_coverline("build/anim-scroll/anim-scroll.js", 32);
return [node.get('scrollLeft'), node.get('scrollTop')];
    }
};



}, '3.7.3', {"requires": ["anim-base"]});
