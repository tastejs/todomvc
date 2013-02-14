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
_yuitest_coverage["build/attribute-complex/attribute-complex.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/attribute-complex/attribute-complex.js",
    code: []
};
_yuitest_coverage["build/attribute-complex/attribute-complex.js"].code=["YUI.add('attribute-complex', function (Y, NAME) {","","    /**","     * Adds support for attribute providers to handle complex attributes in the constructor","     *","     * @module attribute","     * @submodule attribute-complex","     * @for Attribute","     */","","    var O = Y.Object,","        DOT = \".\";","","    Y.Attribute.Complex = function() {};","    Y.Attribute.Complex.prototype = {","","        /**","         * Utility method to split out simple attribute name/value pairs (\"x\") ","         * from complex attribute name/value pairs (\"x.y.z\"), so that complex","         * attributes can be keyed by the top level attribute name.","         *","         * @method _normAttrVals","         * @param {Object} valueHash An object with attribute name/value pairs","         *","         * @return {Object} An object literal with 2 properties - \"simple\" and \"complex\",","         * containing simple and complex attribute values respectively keyed ","         * by the top level attribute name, or null, if valueHash is falsey.","         *","         * @private","         */","        _normAttrVals : function(valueHash) {","            var vals = {},","                subvals = {},","                path,","                attr,","                v, k;","","            if (valueHash) {","                for (k in valueHash) {","                    if (valueHash.hasOwnProperty(k)) {","                        if (k.indexOf(DOT) !== -1) {","                            path = k.split(DOT);","                            attr = path.shift();","                            v = subvals[attr] = subvals[attr] || [];","                            v[v.length] = {","                                path : path,","                                value: valueHash[k]","                            };","                        } else {","                            vals[k] = valueHash[k];","                        }","                    }","                }","                return { simple:vals, complex:subvals };","            } else {","                return null;","            }","        },","","        /**","         * Returns the initial value of the given attribute from","         * either the default configuration provided, or the ","         * over-ridden value if it exists in the set of initValues ","         * provided and the attribute is not read-only.","         *","         * @param {String} attr The name of the attribute","         * @param {Object} cfg The attribute configuration object","         * @param {Object} initValues The object with simple and complex attribute name/value pairs returned from _normAttrVals","         *","         * @return {Any} The initial value of the attribute.","         *","         * @method _getAttrInitVal","         * @private","         */","        _getAttrInitVal : function(attr, cfg, initValues) {","","            var val = cfg.value,","                valFn = cfg.valueFn,","                tmpVal,","                initValSet = false,","                simple,","                complex,","                i,","                l,","                path,","                subval,","                subvals;","","            if (!cfg.readOnly && initValues) {","                // Simple Attributes","                simple = initValues.simple;","                if (simple && simple.hasOwnProperty(attr)) {","                    val = simple[attr];","                    initValSet = true;","                }","            }","","            if (valFn && !initValSet) {","                if (!valFn.call) {","                    valFn = this[valFn];","                }","                if (valFn) {","                    tmpVal = valFn.call(this, attr);","                    val = tmpVal;","                }","            }","","            if (!cfg.readOnly && initValues) {","","                // Complex Attributes (complex values applied, after simple, in case both are set)","                complex = initValues.complex;","","                if (complex && complex.hasOwnProperty(attr) && (val !== undefined) && (val !== null)) {","                    subvals = complex[attr];","                    for (i = 0, l = subvals.length; i < l; ++i) {","                        path = subvals[i].path;","                        subval = subvals[i].value;","                        O.setValue(val, path, subval);","                    }","                }","            }","","            return val;","        }","    };","","    Y.mix(Y.Attribute, Y.Attribute.Complex, true, null, 1);","","    // Consistency with the rest of the Attribute addons for now. ","    Y.AttributeComplex = Y.Attribute.Complex;","","","}, '3.7.3', {\"requires\": [\"attribute-base\"]});"];
_yuitest_coverage["build/attribute-complex/attribute-complex.js"].lines = {"1":0,"11":0,"14":0,"15":0,"32":0,"38":0,"39":0,"40":0,"41":0,"42":0,"43":0,"44":0,"45":0,"50":0,"54":0,"56":0,"77":0,"89":0,"91":0,"92":0,"93":0,"94":0,"98":0,"99":0,"100":0,"102":0,"103":0,"104":0,"108":0,"111":0,"113":0,"114":0,"115":0,"116":0,"117":0,"118":0,"123":0,"127":0,"130":0};
_yuitest_coverage["build/attribute-complex/attribute-complex.js"].functions = {"_normAttrVals:31":0,"_getAttrInitVal:75":0,"(anonymous 1):1":0};
_yuitest_coverage["build/attribute-complex/attribute-complex.js"].coveredLines = 39;
_yuitest_coverage["build/attribute-complex/attribute-complex.js"].coveredFunctions = 3;
_yuitest_coverline("build/attribute-complex/attribute-complex.js", 1);
YUI.add('attribute-complex', function (Y, NAME) {

    /**
     * Adds support for attribute providers to handle complex attributes in the constructor
     *
     * @module attribute
     * @submodule attribute-complex
     * @for Attribute
     */

    _yuitest_coverfunc("build/attribute-complex/attribute-complex.js", "(anonymous 1)", 1);
_yuitest_coverline("build/attribute-complex/attribute-complex.js", 11);
var O = Y.Object,
        DOT = ".";

    _yuitest_coverline("build/attribute-complex/attribute-complex.js", 14);
Y.Attribute.Complex = function() {};
    _yuitest_coverline("build/attribute-complex/attribute-complex.js", 15);
Y.Attribute.Complex.prototype = {

        /**
         * Utility method to split out simple attribute name/value pairs ("x") 
         * from complex attribute name/value pairs ("x.y.z"), so that complex
         * attributes can be keyed by the top level attribute name.
         *
         * @method _normAttrVals
         * @param {Object} valueHash An object with attribute name/value pairs
         *
         * @return {Object} An object literal with 2 properties - "simple" and "complex",
         * containing simple and complex attribute values respectively keyed 
         * by the top level attribute name, or null, if valueHash is falsey.
         *
         * @private
         */
        _normAttrVals : function(valueHash) {
            _yuitest_coverfunc("build/attribute-complex/attribute-complex.js", "_normAttrVals", 31);
_yuitest_coverline("build/attribute-complex/attribute-complex.js", 32);
var vals = {},
                subvals = {},
                path,
                attr,
                v, k;

            _yuitest_coverline("build/attribute-complex/attribute-complex.js", 38);
if (valueHash) {
                _yuitest_coverline("build/attribute-complex/attribute-complex.js", 39);
for (k in valueHash) {
                    _yuitest_coverline("build/attribute-complex/attribute-complex.js", 40);
if (valueHash.hasOwnProperty(k)) {
                        _yuitest_coverline("build/attribute-complex/attribute-complex.js", 41);
if (k.indexOf(DOT) !== -1) {
                            _yuitest_coverline("build/attribute-complex/attribute-complex.js", 42);
path = k.split(DOT);
                            _yuitest_coverline("build/attribute-complex/attribute-complex.js", 43);
attr = path.shift();
                            _yuitest_coverline("build/attribute-complex/attribute-complex.js", 44);
v = subvals[attr] = subvals[attr] || [];
                            _yuitest_coverline("build/attribute-complex/attribute-complex.js", 45);
v[v.length] = {
                                path : path,
                                value: valueHash[k]
                            };
                        } else {
                            _yuitest_coverline("build/attribute-complex/attribute-complex.js", 50);
vals[k] = valueHash[k];
                        }
                    }
                }
                _yuitest_coverline("build/attribute-complex/attribute-complex.js", 54);
return { simple:vals, complex:subvals };
            } else {
                _yuitest_coverline("build/attribute-complex/attribute-complex.js", 56);
return null;
            }
        },

        /**
         * Returns the initial value of the given attribute from
         * either the default configuration provided, or the 
         * over-ridden value if it exists in the set of initValues 
         * provided and the attribute is not read-only.
         *
         * @param {String} attr The name of the attribute
         * @param {Object} cfg The attribute configuration object
         * @param {Object} initValues The object with simple and complex attribute name/value pairs returned from _normAttrVals
         *
         * @return {Any} The initial value of the attribute.
         *
         * @method _getAttrInitVal
         * @private
         */
        _getAttrInitVal : function(attr, cfg, initValues) {

            _yuitest_coverfunc("build/attribute-complex/attribute-complex.js", "_getAttrInitVal", 75);
_yuitest_coverline("build/attribute-complex/attribute-complex.js", 77);
var val = cfg.value,
                valFn = cfg.valueFn,
                tmpVal,
                initValSet = false,
                simple,
                complex,
                i,
                l,
                path,
                subval,
                subvals;

            _yuitest_coverline("build/attribute-complex/attribute-complex.js", 89);
if (!cfg.readOnly && initValues) {
                // Simple Attributes
                _yuitest_coverline("build/attribute-complex/attribute-complex.js", 91);
simple = initValues.simple;
                _yuitest_coverline("build/attribute-complex/attribute-complex.js", 92);
if (simple && simple.hasOwnProperty(attr)) {
                    _yuitest_coverline("build/attribute-complex/attribute-complex.js", 93);
val = simple[attr];
                    _yuitest_coverline("build/attribute-complex/attribute-complex.js", 94);
initValSet = true;
                }
            }

            _yuitest_coverline("build/attribute-complex/attribute-complex.js", 98);
if (valFn && !initValSet) {
                _yuitest_coverline("build/attribute-complex/attribute-complex.js", 99);
if (!valFn.call) {
                    _yuitest_coverline("build/attribute-complex/attribute-complex.js", 100);
valFn = this[valFn];
                }
                _yuitest_coverline("build/attribute-complex/attribute-complex.js", 102);
if (valFn) {
                    _yuitest_coverline("build/attribute-complex/attribute-complex.js", 103);
tmpVal = valFn.call(this, attr);
                    _yuitest_coverline("build/attribute-complex/attribute-complex.js", 104);
val = tmpVal;
                }
            }

            _yuitest_coverline("build/attribute-complex/attribute-complex.js", 108);
if (!cfg.readOnly && initValues) {

                // Complex Attributes (complex values applied, after simple, in case both are set)
                _yuitest_coverline("build/attribute-complex/attribute-complex.js", 111);
complex = initValues.complex;

                _yuitest_coverline("build/attribute-complex/attribute-complex.js", 113);
if (complex && complex.hasOwnProperty(attr) && (val !== undefined) && (val !== null)) {
                    _yuitest_coverline("build/attribute-complex/attribute-complex.js", 114);
subvals = complex[attr];
                    _yuitest_coverline("build/attribute-complex/attribute-complex.js", 115);
for (i = 0, l = subvals.length; i < l; ++i) {
                        _yuitest_coverline("build/attribute-complex/attribute-complex.js", 116);
path = subvals[i].path;
                        _yuitest_coverline("build/attribute-complex/attribute-complex.js", 117);
subval = subvals[i].value;
                        _yuitest_coverline("build/attribute-complex/attribute-complex.js", 118);
O.setValue(val, path, subval);
                    }
                }
            }

            _yuitest_coverline("build/attribute-complex/attribute-complex.js", 123);
return val;
        }
    };

    _yuitest_coverline("build/attribute-complex/attribute-complex.js", 127);
Y.mix(Y.Attribute, Y.Attribute.Complex, true, null, 1);

    // Consistency with the rest of the Attribute addons for now. 
    _yuitest_coverline("build/attribute-complex/attribute-complex.js", 130);
Y.AttributeComplex = Y.Attribute.Complex;


}, '3.7.3', {"requires": ["attribute-base"]});
