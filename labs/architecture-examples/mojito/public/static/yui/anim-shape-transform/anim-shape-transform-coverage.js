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
_yuitest_coverage["build/anim-shape-transform/anim-shape-transform.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/anim-shape-transform/anim-shape-transform.js",
    code: []
};
_yuitest_coverage["build/anim-shape-transform/anim-shape-transform.js"].code=["YUI.add('anim-shape-transform', function (Y, NAME) {","","/**"," * Adds support for the <code>transform</code> attribute of <code>Graphic</code>"," * <code>Shape</code> instances."," * @module anim"," * @submodule anim-shape-transform"," */","    var NUM = Number,","        TO,","        TOSTRING;","","    Y.Anim.behaviors.transform = {","        set: function(anim, att, from, to, elapsed, duration, fn) {","            var node = anim._node,","                transform = \"\",","                transformTo,","                transformFrom,","                toArgs,","                fromArgs,","                i = 0,","                j,","                argLen,","                len;","            to = TO;","            len = TO.length;","            for(; i < len; ++i)","            {","                toArgs = to[i].concat();","                fromArgs = from[i].concat();","                transformTo = toArgs.shift();","                transformFrom = fromArgs.shift();","                argLen = toArgs.length;","                transform += transformTo + \"(\";","                for(j = 0; j < argLen; ++j)","                {","                    transform += fn(elapsed, NUM(fromArgs[j]), NUM(toArgs[j]) - NUM(fromArgs[j]), duration);","                    if(j < argLen - 1)","                    {","                        transform += \", \";","                    }","                }","                transform += \");\";","            }","            if(transform)","            {","                node.set('transform', transform);","            }","            node._transform = TOSTRING;","        },","        ","        get: function(anim) {","            var node = anim._node,","                fromMatrix = node.matrix,","                toAttr = anim.get(\"to\") || {},","                toString = anim.get(\"to\").transform,","                fromString = node.get(\"transform\"),","                toArray = Y.MatrixUtil.getTransformArray(toString),","                fromArray = fromString ? Y.MatrixUtil.getTransformArray(fromString) : null,","                toMatrix,","                i,","                len,","                transformFunction,","                from;","            if(toArray)","            {","                if(!fromArray || fromArray.length < 1)","                {","                    fromArray = [];","                    len = toArray.length;","                    for(i = 0; i < len; ++i)","                    {","                        transformFunction = toArray[i][0];","                        fromArray[i] = Y.MatrixUtil.getTransformFunctionArray(transformFunction);","                    }","                    TO = toArray;","                    from = fromArray;","                }","                else if(Y.MatrixUtil.compareTransformSequence(toArray, fromArray))","                {","                    TO = toArray;","                    from = fromArray;","                }","                else","                {","                    toMatrix = new Y.Matrix();","                    len = toArray.length;","                    for(i = 0; i < len; ++i)","                    {","                        transformFunction = toArray[i].shift();","                        transformFunction = transformFunction == \"matrix\" ? \"multiply\" : transformFunction;","                        toMatrix[transformFunction].apply(toMatrix, toArray[i]); ","                    }","","                    TO = toMatrix.decompose();","                    from = fromMatrix.decompose();","                }","            }","            TOSTRING = toString;","            return from;","        }","    };  ","","","","}, '3.7.3', {\"requires\": [\"anim-base\", \"anim-easing\", \"matrix\"]});"];
_yuitest_coverage["build/anim-shape-transform/anim-shape-transform.js"].lines = {"1":0,"9":0,"13":0,"15":0,"25":0,"26":0,"27":0,"29":0,"30":0,"31":0,"32":0,"33":0,"34":0,"35":0,"37":0,"38":0,"40":0,"43":0,"45":0,"47":0,"49":0,"53":0,"65":0,"67":0,"69":0,"70":0,"71":0,"73":0,"74":0,"76":0,"77":0,"79":0,"81":0,"82":0,"86":0,"87":0,"88":0,"90":0,"91":0,"92":0,"95":0,"96":0,"99":0,"100":0};
_yuitest_coverage["build/anim-shape-transform/anim-shape-transform.js"].functions = {"set:14":0,"get:52":0,"(anonymous 1):1":0};
_yuitest_coverage["build/anim-shape-transform/anim-shape-transform.js"].coveredLines = 44;
_yuitest_coverage["build/anim-shape-transform/anim-shape-transform.js"].coveredFunctions = 3;
_yuitest_coverline("build/anim-shape-transform/anim-shape-transform.js", 1);
YUI.add('anim-shape-transform', function (Y, NAME) {

/**
 * Adds support for the <code>transform</code> attribute of <code>Graphic</code>
 * <code>Shape</code> instances.
 * @module anim
 * @submodule anim-shape-transform
 */
    _yuitest_coverfunc("build/anim-shape-transform/anim-shape-transform.js", "(anonymous 1)", 1);
_yuitest_coverline("build/anim-shape-transform/anim-shape-transform.js", 9);
var NUM = Number,
        TO,
        TOSTRING;

    _yuitest_coverline("build/anim-shape-transform/anim-shape-transform.js", 13);
Y.Anim.behaviors.transform = {
        set: function(anim, att, from, to, elapsed, duration, fn) {
            _yuitest_coverfunc("build/anim-shape-transform/anim-shape-transform.js", "set", 14);
_yuitest_coverline("build/anim-shape-transform/anim-shape-transform.js", 15);
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
            _yuitest_coverline("build/anim-shape-transform/anim-shape-transform.js", 25);
to = TO;
            _yuitest_coverline("build/anim-shape-transform/anim-shape-transform.js", 26);
len = TO.length;
            _yuitest_coverline("build/anim-shape-transform/anim-shape-transform.js", 27);
for(; i < len; ++i)
            {
                _yuitest_coverline("build/anim-shape-transform/anim-shape-transform.js", 29);
toArgs = to[i].concat();
                _yuitest_coverline("build/anim-shape-transform/anim-shape-transform.js", 30);
fromArgs = from[i].concat();
                _yuitest_coverline("build/anim-shape-transform/anim-shape-transform.js", 31);
transformTo = toArgs.shift();
                _yuitest_coverline("build/anim-shape-transform/anim-shape-transform.js", 32);
transformFrom = fromArgs.shift();
                _yuitest_coverline("build/anim-shape-transform/anim-shape-transform.js", 33);
argLen = toArgs.length;
                _yuitest_coverline("build/anim-shape-transform/anim-shape-transform.js", 34);
transform += transformTo + "(";
                _yuitest_coverline("build/anim-shape-transform/anim-shape-transform.js", 35);
for(j = 0; j < argLen; ++j)
                {
                    _yuitest_coverline("build/anim-shape-transform/anim-shape-transform.js", 37);
transform += fn(elapsed, NUM(fromArgs[j]), NUM(toArgs[j]) - NUM(fromArgs[j]), duration);
                    _yuitest_coverline("build/anim-shape-transform/anim-shape-transform.js", 38);
if(j < argLen - 1)
                    {
                        _yuitest_coverline("build/anim-shape-transform/anim-shape-transform.js", 40);
transform += ", ";
                    }
                }
                _yuitest_coverline("build/anim-shape-transform/anim-shape-transform.js", 43);
transform += ");";
            }
            _yuitest_coverline("build/anim-shape-transform/anim-shape-transform.js", 45);
if(transform)
            {
                _yuitest_coverline("build/anim-shape-transform/anim-shape-transform.js", 47);
node.set('transform', transform);
            }
            _yuitest_coverline("build/anim-shape-transform/anim-shape-transform.js", 49);
node._transform = TOSTRING;
        },
        
        get: function(anim) {
            _yuitest_coverfunc("build/anim-shape-transform/anim-shape-transform.js", "get", 52);
_yuitest_coverline("build/anim-shape-transform/anim-shape-transform.js", 53);
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
            _yuitest_coverline("build/anim-shape-transform/anim-shape-transform.js", 65);
if(toArray)
            {
                _yuitest_coverline("build/anim-shape-transform/anim-shape-transform.js", 67);
if(!fromArray || fromArray.length < 1)
                {
                    _yuitest_coverline("build/anim-shape-transform/anim-shape-transform.js", 69);
fromArray = [];
                    _yuitest_coverline("build/anim-shape-transform/anim-shape-transform.js", 70);
len = toArray.length;
                    _yuitest_coverline("build/anim-shape-transform/anim-shape-transform.js", 71);
for(i = 0; i < len; ++i)
                    {
                        _yuitest_coverline("build/anim-shape-transform/anim-shape-transform.js", 73);
transformFunction = toArray[i][0];
                        _yuitest_coverline("build/anim-shape-transform/anim-shape-transform.js", 74);
fromArray[i] = Y.MatrixUtil.getTransformFunctionArray(transformFunction);
                    }
                    _yuitest_coverline("build/anim-shape-transform/anim-shape-transform.js", 76);
TO = toArray;
                    _yuitest_coverline("build/anim-shape-transform/anim-shape-transform.js", 77);
from = fromArray;
                }
                else {_yuitest_coverline("build/anim-shape-transform/anim-shape-transform.js", 79);
if(Y.MatrixUtil.compareTransformSequence(toArray, fromArray))
                {
                    _yuitest_coverline("build/anim-shape-transform/anim-shape-transform.js", 81);
TO = toArray;
                    _yuitest_coverline("build/anim-shape-transform/anim-shape-transform.js", 82);
from = fromArray;
                }
                else
                {
                    _yuitest_coverline("build/anim-shape-transform/anim-shape-transform.js", 86);
toMatrix = new Y.Matrix();
                    _yuitest_coverline("build/anim-shape-transform/anim-shape-transform.js", 87);
len = toArray.length;
                    _yuitest_coverline("build/anim-shape-transform/anim-shape-transform.js", 88);
for(i = 0; i < len; ++i)
                    {
                        _yuitest_coverline("build/anim-shape-transform/anim-shape-transform.js", 90);
transformFunction = toArray[i].shift();
                        _yuitest_coverline("build/anim-shape-transform/anim-shape-transform.js", 91);
transformFunction = transformFunction == "matrix" ? "multiply" : transformFunction;
                        _yuitest_coverline("build/anim-shape-transform/anim-shape-transform.js", 92);
toMatrix[transformFunction].apply(toMatrix, toArray[i]); 
                    }

                    _yuitest_coverline("build/anim-shape-transform/anim-shape-transform.js", 95);
TO = toMatrix.decompose();
                    _yuitest_coverline("build/anim-shape-transform/anim-shape-transform.js", 96);
from = fromMatrix.decompose();
                }}
            }
            _yuitest_coverline("build/anim-shape-transform/anim-shape-transform.js", 99);
TOSTRING = toString;
            _yuitest_coverline("build/anim-shape-transform/anim-shape-transform.js", 100);
return from;
        }
    };  



}, '3.7.3', {"requires": ["anim-base", "anim-easing", "matrix"]});
