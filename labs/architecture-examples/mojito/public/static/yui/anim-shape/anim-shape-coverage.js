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
_yuitest_coverage["build/anim-shape/anim-shape.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/anim-shape/anim-shape.js",
    code: []
};
_yuitest_coverage["build/anim-shape/anim-shape.js"].code=["YUI.add('anim-shape', function (Y, NAME) {","","/**"," * Adds support for the <code>transform</code> attribute of <code>Graphic</code>"," * <code>Shape</code> instances."," * @module anim"," * @submodule anim-shape-transform"," * @deprecated Use anim-shape instead."," */","/**"," * Adds support for the <code>transform</code>, <code>fill</code>, and <code> attributes of <code>Graphic</code>"," * <code>Shape</code> instances. The <code>anim-shape</code> submodule can be used for all animations involving"," * <code>Graphic</code> <code>Shape</code> attributes. "," * "," * @module anim"," * @submodule anim-shape"," */","    var NUM = Number,","    TO,","    TOSTRING,","    COLOR = \"color\",","    STOPS = \"stops\",","    TYPE = \"type\",","    GETUPDATEDSTOPS = function(anim, from, to, elapsed, duration, fn)","    {","        var i = 0,","            getUpdatedColorValue = Y.Anim.getUpdatedColorValue,","            toStop,","            fromStop,","            prop,","            len = to.length,","            color,","            opacity,","            offset,","            rotation,","            r,","            fx,","            fy,","            cx,","            cy,","            stops = [],","            stop;","        for(; i < len; i = i + 1)","        {","            toStop = to[i];","            fromStop = from[i];","            stop = {};","            for(prop in toStop)","            {","                if(toStop.hasOwnProperty(prop))","                {","                    if(prop == COLOR)","                    {","                        stop[prop] = Y.Color.toHex(getUpdatedColorValue(Y.Color.toHex(fromStop[prop]), Y.Color.toHex(toStop[prop]), elapsed, duration, fn));","                    }","                    else","                    {","                        stop[prop] = fn(elapsed, NUM(fromStop[prop]), NUM(toStop[prop]) - NUM(fromStop[prop]), duration);","                    }","                }","            }","            stops.push(stop);","        }","        return stops;","    },","    FILLANDSTROKEBEHAVIOR = {","        set: function(anim, att, from, to, elapsed, duration, fn) {","            var i,","            updated = {},","            getUpdatedColorValue = Y.Anim.getUpdatedColorValue,","            getUpdatedStops = GETUPDATEDSTOPS;","            for(i in to)","            {","                if(to.hasOwnProperty(i) && i != TYPE)","                {","                    switch(i)","                    {","                        case COLOR :","                            updated[i] = getUpdatedColorValue(from[i], to[i], elapsed, duration, fn);","                        break;","                        case STOPS :","                            updated[i] = getUpdatedStops(anim, from[i], to[i], elapsed, duration, fn);","                        break;","                        default :","                            updated[i] = fn(elapsed, NUM(from[i]), NUM(to[i]) - NUM(from[i]), duration);","                        break;","                    }","                }","            }","            anim._node.set(att, updated);","        }","    };","    Y.Anim.behaviors.fill = FILLANDSTROKEBEHAVIOR;","    Y.Anim.behaviors.stroke = FILLANDSTROKEBEHAVIOR; ","","    Y.Anim.behaviors.transform = {","        set: function(anim, att, from, to, elapsed, duration, fn) {","            var node = anim._node,","                transform = \"\",","                transformTo,","                transformFrom,","                toArgs,","                fromArgs,","                i = 0,","                j,","                argLen,","                len;","            to = TO;","            len = TO.length;","            for(; i < len; ++i)","            {","                toArgs = to[i].concat();","                fromArgs = from[i].concat();","                transformTo = toArgs.shift();","                transformFrom = fromArgs.shift();","                argLen = toArgs.length;","                transform += transformTo + \"(\";","                for(j = 0; j < argLen; ++j)","                {","                    transform += fn(elapsed, NUM(fromArgs[j]), NUM(toArgs[j]) - NUM(fromArgs[j]), duration);","                    if(j < argLen - 1)","                    {","                        transform += \", \";","                    }","                }","                transform += \");\";","            }","            if(transform)","            {","                node.set('transform', transform);","            }","            node._transform = TOSTRING;","        },","        ","        get: function(anim) {","            var node = anim._node,","                fromMatrix = node.matrix,","                toAttr = anim.get(\"to\") || {},","                toString = anim.get(\"to\").transform,","                fromString = node.get(\"transform\"),","                toArray = Y.MatrixUtil.getTransformArray(toString),","                fromArray = fromString ? Y.MatrixUtil.getTransformArray(fromString) : null,","                toMatrix,","                i,","                len,","                transformFunction,","                from;","            if(toArray)","            {","                if(!fromArray || fromArray.length < 1)","                {","                    fromArray = [];","                    len = toArray.length;","                    for(i = 0; i < len; ++i)","                    {","                        transformFunction = toArray[i][0];","                        fromArray[i] = Y.MatrixUtil.getTransformFunctionArray(transformFunction);","                    }","                    TO = toArray;","                    from = fromArray;","                }","                else if(Y.MatrixUtil.compareTransformSequence(toArray, fromArray))","                {","                    TO = toArray;","                    from = fromArray;","                }","                else","                {","                    toMatrix = new Y.Matrix();","                    len = toArray.length;","                    for(i = 0; i < len; ++i)","                    {","                        transformFunction = toArray[i].shift();","                        transformFunction = transformFunction == \"matrix\" ? \"multiply\" : transformFunction;","                        toMatrix[transformFunction].apply(toMatrix, toArray[i]); ","                    }","","                    TO = toMatrix.decompose();","                    from = fromMatrix.decompose();","                }","            }","            TOSTRING = toString;","            return from;","        }","    };  ","","","","}, '3.7.3', {\"requires\": [\"anim-base\", \"anim-easing\", \"anim-color\", \"matrix\"]});"];
_yuitest_coverage["build/anim-shape/anim-shape.js"].lines = {"1":0,"18":0,"26":0,"43":0,"45":0,"46":0,"47":0,"48":0,"50":0,"52":0,"54":0,"58":0,"62":0,"64":0,"68":0,"72":0,"74":0,"76":0,"79":0,"80":0,"82":0,"83":0,"85":0,"86":0,"90":0,"93":0,"94":0,"96":0,"98":0,"108":0,"109":0,"110":0,"112":0,"113":0,"114":0,"115":0,"116":0,"117":0,"118":0,"120":0,"121":0,"123":0,"126":0,"128":0,"130":0,"132":0,"136":0,"148":0,"150":0,"152":0,"153":0,"154":0,"156":0,"157":0,"159":0,"160":0,"162":0,"164":0,"165":0,"169":0,"170":0,"171":0,"173":0,"174":0,"175":0,"178":0,"179":0,"182":0,"183":0};
_yuitest_coverage["build/anim-shape/anim-shape.js"].functions = {"GETUPDATEDSTOPS:24":0,"set:67":0,"set:97":0,"get:135":0,"(anonymous 1):1":0};
_yuitest_coverage["build/anim-shape/anim-shape.js"].coveredLines = 69;
_yuitest_coverage["build/anim-shape/anim-shape.js"].coveredFunctions = 5;
_yuitest_coverline("build/anim-shape/anim-shape.js", 1);
YUI.add('anim-shape', function (Y, NAME) {

/**
 * Adds support for the <code>transform</code> attribute of <code>Graphic</code>
 * <code>Shape</code> instances.
 * @module anim
 * @submodule anim-shape-transform
 * @deprecated Use anim-shape instead.
 */
/**
 * Adds support for the <code>transform</code>, <code>fill</code>, and <code> attributes of <code>Graphic</code>
 * <code>Shape</code> instances. The <code>anim-shape</code> submodule can be used for all animations involving
 * <code>Graphic</code> <code>Shape</code> attributes. 
 * 
 * @module anim
 * @submodule anim-shape
 */
    _yuitest_coverfunc("build/anim-shape/anim-shape.js", "(anonymous 1)", 1);
_yuitest_coverline("build/anim-shape/anim-shape.js", 18);
var NUM = Number,
    TO,
    TOSTRING,
    COLOR = "color",
    STOPS = "stops",
    TYPE = "type",
    GETUPDATEDSTOPS = function(anim, from, to, elapsed, duration, fn)
    {
        _yuitest_coverfunc("build/anim-shape/anim-shape.js", "GETUPDATEDSTOPS", 24);
_yuitest_coverline("build/anim-shape/anim-shape.js", 26);
var i = 0,
            getUpdatedColorValue = Y.Anim.getUpdatedColorValue,
            toStop,
            fromStop,
            prop,
            len = to.length,
            color,
            opacity,
            offset,
            rotation,
            r,
            fx,
            fy,
            cx,
            cy,
            stops = [],
            stop;
        _yuitest_coverline("build/anim-shape/anim-shape.js", 43);
for(; i < len; i = i + 1)
        {
            _yuitest_coverline("build/anim-shape/anim-shape.js", 45);
toStop = to[i];
            _yuitest_coverline("build/anim-shape/anim-shape.js", 46);
fromStop = from[i];
            _yuitest_coverline("build/anim-shape/anim-shape.js", 47);
stop = {};
            _yuitest_coverline("build/anim-shape/anim-shape.js", 48);
for(prop in toStop)
            {
                _yuitest_coverline("build/anim-shape/anim-shape.js", 50);
if(toStop.hasOwnProperty(prop))
                {
                    _yuitest_coverline("build/anim-shape/anim-shape.js", 52);
if(prop == COLOR)
                    {
                        _yuitest_coverline("build/anim-shape/anim-shape.js", 54);
stop[prop] = Y.Color.toHex(getUpdatedColorValue(Y.Color.toHex(fromStop[prop]), Y.Color.toHex(toStop[prop]), elapsed, duration, fn));
                    }
                    else
                    {
                        _yuitest_coverline("build/anim-shape/anim-shape.js", 58);
stop[prop] = fn(elapsed, NUM(fromStop[prop]), NUM(toStop[prop]) - NUM(fromStop[prop]), duration);
                    }
                }
            }
            _yuitest_coverline("build/anim-shape/anim-shape.js", 62);
stops.push(stop);
        }
        _yuitest_coverline("build/anim-shape/anim-shape.js", 64);
return stops;
    },
    FILLANDSTROKEBEHAVIOR = {
        set: function(anim, att, from, to, elapsed, duration, fn) {
            _yuitest_coverfunc("build/anim-shape/anim-shape.js", "set", 67);
_yuitest_coverline("build/anim-shape/anim-shape.js", 68);
var i,
            updated = {},
            getUpdatedColorValue = Y.Anim.getUpdatedColorValue,
            getUpdatedStops = GETUPDATEDSTOPS;
            _yuitest_coverline("build/anim-shape/anim-shape.js", 72);
for(i in to)
            {
                _yuitest_coverline("build/anim-shape/anim-shape.js", 74);
if(to.hasOwnProperty(i) && i != TYPE)
                {
                    _yuitest_coverline("build/anim-shape/anim-shape.js", 76);
switch(i)
                    {
                        case COLOR :
                            _yuitest_coverline("build/anim-shape/anim-shape.js", 79);
updated[i] = getUpdatedColorValue(from[i], to[i], elapsed, duration, fn);
                        _yuitest_coverline("build/anim-shape/anim-shape.js", 80);
break;
                        case STOPS :
                            _yuitest_coverline("build/anim-shape/anim-shape.js", 82);
updated[i] = getUpdatedStops(anim, from[i], to[i], elapsed, duration, fn);
                        _yuitest_coverline("build/anim-shape/anim-shape.js", 83);
break;
                        default :
                            _yuitest_coverline("build/anim-shape/anim-shape.js", 85);
updated[i] = fn(elapsed, NUM(from[i]), NUM(to[i]) - NUM(from[i]), duration);
                        _yuitest_coverline("build/anim-shape/anim-shape.js", 86);
break;
                    }
                }
            }
            _yuitest_coverline("build/anim-shape/anim-shape.js", 90);
anim._node.set(att, updated);
        }
    };
    _yuitest_coverline("build/anim-shape/anim-shape.js", 93);
Y.Anim.behaviors.fill = FILLANDSTROKEBEHAVIOR;
    _yuitest_coverline("build/anim-shape/anim-shape.js", 94);
Y.Anim.behaviors.stroke = FILLANDSTROKEBEHAVIOR; 

    _yuitest_coverline("build/anim-shape/anim-shape.js", 96);
Y.Anim.behaviors.transform = {
        set: function(anim, att, from, to, elapsed, duration, fn) {
            _yuitest_coverfunc("build/anim-shape/anim-shape.js", "set", 97);
_yuitest_coverline("build/anim-shape/anim-shape.js", 98);
var node = anim._node,
                transform = "",
                transformTo,
                transformFrom,
                toArgs,
                fromArgs,
                i = 0,
                j,
                argLen,
                len;
            _yuitest_coverline("build/anim-shape/anim-shape.js", 108);
to = TO;
            _yuitest_coverline("build/anim-shape/anim-shape.js", 109);
len = TO.length;
            _yuitest_coverline("build/anim-shape/anim-shape.js", 110);
for(; i < len; ++i)
            {
                _yuitest_coverline("build/anim-shape/anim-shape.js", 112);
toArgs = to[i].concat();
                _yuitest_coverline("build/anim-shape/anim-shape.js", 113);
fromArgs = from[i].concat();
                _yuitest_coverline("build/anim-shape/anim-shape.js", 114);
transformTo = toArgs.shift();
                _yuitest_coverline("build/anim-shape/anim-shape.js", 115);
transformFrom = fromArgs.shift();
                _yuitest_coverline("build/anim-shape/anim-shape.js", 116);
argLen = toArgs.length;
                _yuitest_coverline("build/anim-shape/anim-shape.js", 117);
transform += transformTo + "(";
                _yuitest_coverline("build/anim-shape/anim-shape.js", 118);
for(j = 0; j < argLen; ++j)
                {
                    _yuitest_coverline("build/anim-shape/anim-shape.js", 120);
transform += fn(elapsed, NUM(fromArgs[j]), NUM(toArgs[j]) - NUM(fromArgs[j]), duration);
                    _yuitest_coverline("build/anim-shape/anim-shape.js", 121);
if(j < argLen - 1)
                    {
                        _yuitest_coverline("build/anim-shape/anim-shape.js", 123);
transform += ", ";
                    }
                }
                _yuitest_coverline("build/anim-shape/anim-shape.js", 126);
transform += ");";
            }
            _yuitest_coverline("build/anim-shape/anim-shape.js", 128);
if(transform)
            {
                _yuitest_coverline("build/anim-shape/anim-shape.js", 130);
node.set('transform', transform);
            }
            _yuitest_coverline("build/anim-shape/anim-shape.js", 132);
node._transform = TOSTRING;
        },
        
        get: function(anim) {
            _yuitest_coverfunc("build/anim-shape/anim-shape.js", "get", 135);
_yuitest_coverline("build/anim-shape/anim-shape.js", 136);
var node = anim._node,
                fromMatrix = node.matrix,
                toAttr = anim.get("to") || {},
                toString = anim.get("to").transform,
                fromString = node.get("transform"),
                toArray = Y.MatrixUtil.getTransformArray(toString),
                fromArray = fromString ? Y.MatrixUtil.getTransformArray(fromString) : null,
                toMatrix,
                i,
                len,
                transformFunction,
                from;
            _yuitest_coverline("build/anim-shape/anim-shape.js", 148);
if(toArray)
            {
                _yuitest_coverline("build/anim-shape/anim-shape.js", 150);
if(!fromArray || fromArray.length < 1)
                {
                    _yuitest_coverline("build/anim-shape/anim-shape.js", 152);
fromArray = [];
                    _yuitest_coverline("build/anim-shape/anim-shape.js", 153);
len = toArray.length;
                    _yuitest_coverline("build/anim-shape/anim-shape.js", 154);
for(i = 0; i < len; ++i)
                    {
                        _yuitest_coverline("build/anim-shape/anim-shape.js", 156);
transformFunction = toArray[i][0];
                        _yuitest_coverline("build/anim-shape/anim-shape.js", 157);
fromArray[i] = Y.MatrixUtil.getTransformFunctionArray(transformFunction);
                    }
                    _yuitest_coverline("build/anim-shape/anim-shape.js", 159);
TO = toArray;
                    _yuitest_coverline("build/anim-shape/anim-shape.js", 160);
from = fromArray;
                }
                else {_yuitest_coverline("build/anim-shape/anim-shape.js", 162);
if(Y.MatrixUtil.compareTransformSequence(toArray, fromArray))
                {
                    _yuitest_coverline("build/anim-shape/anim-shape.js", 164);
TO = toArray;
                    _yuitest_coverline("build/anim-shape/anim-shape.js", 165);
from = fromArray;
                }
                else
                {
                    _yuitest_coverline("build/anim-shape/anim-shape.js", 169);
toMatrix = new Y.Matrix();
                    _yuitest_coverline("build/anim-shape/anim-shape.js", 170);
len = toArray.length;
                    _yuitest_coverline("build/anim-shape/anim-shape.js", 171);
for(i = 0; i < len; ++i)
                    {
                        _yuitest_coverline("build/anim-shape/anim-shape.js", 173);
transformFunction = toArray[i].shift();
                        _yuitest_coverline("build/anim-shape/anim-shape.js", 174);
transformFunction = transformFunction == "matrix" ? "multiply" : transformFunction;
                        _yuitest_coverline("build/anim-shape/anim-shape.js", 175);
toMatrix[transformFunction].apply(toMatrix, toArray[i]); 
                    }

                    _yuitest_coverline("build/anim-shape/anim-shape.js", 178);
TO = toMatrix.decompose();
                    _yuitest_coverline("build/anim-shape/anim-shape.js", 179);
from = fromMatrix.decompose();
                }}
            }
            _yuitest_coverline("build/anim-shape/anim-shape.js", 182);
TOSTRING = toString;
            _yuitest_coverline("build/anim-shape/anim-shape.js", 183);
return from;
        }
    };  



}, '3.7.3', {"requires": ["anim-base", "anim-easing", "anim-color", "matrix"]});
