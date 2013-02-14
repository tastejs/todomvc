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
_yuitest_coverage["build/anim-color/anim-color.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/anim-color/anim-color.js",
    code: []
};
_yuitest_coverage["build/anim-color/anim-color.js"].code=["YUI.add('anim-color', function (Y, NAME) {","","/**"," * Adds support for color properties in <code>to</code>"," * and <code>from</code> attributes."," * @module anim"," * @submodule anim-color"," */","","var NUM = Number;","","Y.Anim.getUpdatedColorValue = function(fromColor, toColor, elapsed, duration,  fn)","{","    fromColor = Y.Color.re_RGB.exec(Y.Color.toRGB(fromColor));","    toColor = Y.Color.re_RGB.exec(Y.Color.toRGB(toColor));","","    if (!fromColor || fromColor.length < 3 || !toColor || toColor.length < 3) {","        Y.error('invalid from or to passed to color behavior');","    }","","    return 'rgb(' + [","        Math.floor(fn(elapsed, NUM(fromColor[1]), NUM(toColor[1]) - NUM(fromColor[1]), duration)),","        Math.floor(fn(elapsed, NUM(fromColor[2]), NUM(toColor[2]) - NUM(fromColor[2]), duration)),","        Math.floor(fn(elapsed, NUM(fromColor[3]), NUM(toColor[3]) - NUM(fromColor[3]), duration))","    ].join(', ') + ')';","};","","Y.Anim.behaviors.color = {","    set: function(anim, att, from, to, elapsed, duration, fn) {","        anim._node.setStyle(att, Y.Anim.getUpdatedColorValue(from, to, elapsed, duration, fn)); ","    },","    ","    // TODO: default bgcolor const","    get: function(anim, att) {","        var val = anim._node.getComputedStyle(att);","        val = (val === 'transparent') ? 'rgb(255, 255, 255)' : val;","        return val;","    }","};","","Y.each(['backgroundColor',","        'borderColor',","        'borderTopColor',","        'borderRightColor', ","        'borderBottomColor', ","        'borderLeftColor'],","        function(v, i) {","            Y.Anim.behaviors[v] = Y.Anim.behaviors.color;","        }",");","","","}, '3.7.3', {\"requires\": [\"anim-base\"]});"];
_yuitest_coverage["build/anim-color/anim-color.js"].lines = {"1":0,"10":0,"12":0,"14":0,"15":0,"17":0,"18":0,"21":0,"28":0,"30":0,"35":0,"36":0,"37":0,"41":0,"48":0};
_yuitest_coverage["build/anim-color/anim-color.js"].functions = {"getUpdatedColorValue:12":0,"set:29":0,"get:34":0,"(anonymous 2):47":0,"(anonymous 1):1":0};
_yuitest_coverage["build/anim-color/anim-color.js"].coveredLines = 15;
_yuitest_coverage["build/anim-color/anim-color.js"].coveredFunctions = 5;
_yuitest_coverline("build/anim-color/anim-color.js", 1);
YUI.add('anim-color', function (Y, NAME) {

/**
 * Adds support for color properties in <code>to</code>
 * and <code>from</code> attributes.
 * @module anim
 * @submodule anim-color
 */

_yuitest_coverfunc("build/anim-color/anim-color.js", "(anonymous 1)", 1);
_yuitest_coverline("build/anim-color/anim-color.js", 10);
var NUM = Number;

_yuitest_coverline("build/anim-color/anim-color.js", 12);
Y.Anim.getUpdatedColorValue = function(fromColor, toColor, elapsed, duration,  fn)
{
    _yuitest_coverfunc("build/anim-color/anim-color.js", "getUpdatedColorValue", 12);
_yuitest_coverline("build/anim-color/anim-color.js", 14);
fromColor = Y.Color.re_RGB.exec(Y.Color.toRGB(fromColor));
    _yuitest_coverline("build/anim-color/anim-color.js", 15);
toColor = Y.Color.re_RGB.exec(Y.Color.toRGB(toColor));

    _yuitest_coverline("build/anim-color/anim-color.js", 17);
if (!fromColor || fromColor.length < 3 || !toColor || toColor.length < 3) {
        _yuitest_coverline("build/anim-color/anim-color.js", 18);
Y.error('invalid from or to passed to color behavior');
    }

    _yuitest_coverline("build/anim-color/anim-color.js", 21);
return 'rgb(' + [
        Math.floor(fn(elapsed, NUM(fromColor[1]), NUM(toColor[1]) - NUM(fromColor[1]), duration)),
        Math.floor(fn(elapsed, NUM(fromColor[2]), NUM(toColor[2]) - NUM(fromColor[2]), duration)),
        Math.floor(fn(elapsed, NUM(fromColor[3]), NUM(toColor[3]) - NUM(fromColor[3]), duration))
    ].join(', ') + ')';
};

_yuitest_coverline("build/anim-color/anim-color.js", 28);
Y.Anim.behaviors.color = {
    set: function(anim, att, from, to, elapsed, duration, fn) {
        _yuitest_coverfunc("build/anim-color/anim-color.js", "set", 29);
_yuitest_coverline("build/anim-color/anim-color.js", 30);
anim._node.setStyle(att, Y.Anim.getUpdatedColorValue(from, to, elapsed, duration, fn)); 
    },
    
    // TODO: default bgcolor const
    get: function(anim, att) {
        _yuitest_coverfunc("build/anim-color/anim-color.js", "get", 34);
_yuitest_coverline("build/anim-color/anim-color.js", 35);
var val = anim._node.getComputedStyle(att);
        _yuitest_coverline("build/anim-color/anim-color.js", 36);
val = (val === 'transparent') ? 'rgb(255, 255, 255)' : val;
        _yuitest_coverline("build/anim-color/anim-color.js", 37);
return val;
    }
};

_yuitest_coverline("build/anim-color/anim-color.js", 41);
Y.each(['backgroundColor',
        'borderColor',
        'borderTopColor',
        'borderRightColor', 
        'borderBottomColor', 
        'borderLeftColor'],
        function(v, i) {
            _yuitest_coverfunc("build/anim-color/anim-color.js", "(anonymous 2)", 47);
_yuitest_coverline("build/anim-color/anim-color.js", 48);
Y.Anim.behaviors[v] = Y.Anim.behaviors.color;
        }
);


}, '3.7.3', {"requires": ["anim-base"]});
