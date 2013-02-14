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
_yuitest_coverage["build/attribute-extras/attribute-extras.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/attribute-extras/attribute-extras.js",
    code: []
};
_yuitest_coverage["build/attribute-extras/attribute-extras.js"].code=["YUI.add('attribute-extras', function (Y, NAME) {","","    /**","     * The attribute module provides an augmentable Attribute implementation, which ","     * adds configurable attributes and attribute change events to the class being ","     * augmented. It also provides a State class, which is used internally by Attribute,","     * but can also be used independently to provide a name/property/value data structure to","     * store state.","     *","     * @module attribute","     */","","    /**","     * The attribute-extras submodule provides less commonly used attribute methods, and can ","     * be augmented/mixed into an implemention which used attribute-core.","     *","     * @module attribute","     * @submodule attribute-extras","     */","    var BROADCAST = \"broadcast\",","        PUBLISHED = \"published\",","        INIT_VALUE = \"initValue\",","","        MODIFIABLE = {","            readOnly:1,","            writeOnce:1,","            getter:1,","            broadcast:1","        };","","    /**","     * A augmentable implementation for AttributeCore, providing less frequently used ","     * methods for Attribute management such as modifyAttrs(), removeAttr and reset()   ","     *","     * @class AttributeExtras","     */","    function AttributeExtras() {}","","    AttributeExtras.prototype = {","","        /**","         * Updates the configuration of an attribute which has already been added.","         * <p>","         * The properties which can be modified through this interface are limited","         * to the following subset of attributes, which can be safely modified","         * after a value has already been set on the attribute: readOnly, writeOnce, ","         * broadcast and getter.","         * </p>","         * @method modifyAttr","         * @param {String} name The name of the attribute whose configuration is to be updated.","         * @param {Object} config An object with configuration property/value pairs, specifying the configuration properties to modify.","         */","        modifyAttr: function(name, config) {","            var host = this, // help compression","                prop, state;","","            if (host.attrAdded(name)) {","","                if (host._isLazyAttr(name)) {","                    host._addLazyAttr(name);","                }","","                state = host._state;","                for (prop in config) {","                    if (MODIFIABLE[prop] && config.hasOwnProperty(prop)) {","                        state.add(name, prop, config[prop]);","","                        // If we reconfigured broadcast, need to republish","                        if (prop === BROADCAST) {","                            state.remove(name, PUBLISHED);","                        }","                    }","                }","            }","","        },","","        /**","         * Removes an attribute from the host object","         *","         * @method removeAttr","         * @param {String} name The name of the attribute to be removed.","         */","        removeAttr: function(name) {","            this._state.removeAll(name);","        },","","        /**","         * Resets the attribute (or all attributes) to its initial value, as long as","         * the attribute is not readOnly, or writeOnce.","         *","         * @method reset","         * @param {String} name Optional. The name of the attribute to reset.  If omitted, all attributes are reset.","         * @return {Object} A reference to the host object.","         * @chainable","         */","        reset : function(name) {","            var host = this;  // help compression","","            if (name) {","                if (host._isLazyAttr(name)) {","                    host._addLazyAttr(name);","                }","                host.set(name, host._state.get(name, INIT_VALUE));","            } else {","                Y.each(host._state.data, function(v, n) {","                    host.reset(n);","                });","            }","            return host;","        },","","        /**","         * Returns an object with the configuration properties (and value)","         * for the given attribute. If attrName is not provided, returns the","         * configuration properties for all attributes.","         *","         * @method _getAttrCfg","         * @protected","         * @param {String} name Optional. The attribute name. If not provided, the method will return the configuration for all attributes.","         * @return {Object} The configuration properties for the given attribute, or all attributes.","         */","        _getAttrCfg : function(name) {","            var o,","                state = this._state;","","            if (name) {","                o = state.getAll(name) || {};","            } else {","                o = {};","                Y.each(state.data, function(v, n) {","                    o[n] = state.getAll(n);","                }); ","            }","","            return o;","        }","    };","","    Y.AttributeExtras = AttributeExtras;","","","}, '3.7.3', {\"requires\": [\"oop\"]});"];
_yuitest_coverage["build/attribute-extras/attribute-extras.js"].lines = {"1":0,"20":0,"37":0,"39":0,"54":0,"57":0,"59":0,"60":0,"63":0,"64":0,"65":0,"66":0,"69":0,"70":0,"85":0,"98":0,"100":0,"101":0,"102":0,"104":0,"106":0,"107":0,"110":0,"124":0,"127":0,"128":0,"130":0,"131":0,"132":0,"136":0,"140":0};
_yuitest_coverage["build/attribute-extras/attribute-extras.js"].functions = {"AttributeExtras:37":0,"modifyAttr:53":0,"removeAttr:84":0,"(anonymous 2):106":0,"reset:97":0,"(anonymous 3):131":0,"_getAttrCfg:123":0,"(anonymous 1):1":0};
_yuitest_coverage["build/attribute-extras/attribute-extras.js"].coveredLines = 31;
_yuitest_coverage["build/attribute-extras/attribute-extras.js"].coveredFunctions = 8;
_yuitest_coverline("build/attribute-extras/attribute-extras.js", 1);
YUI.add('attribute-extras', function (Y, NAME) {

    /**
     * The attribute module provides an augmentable Attribute implementation, which 
     * adds configurable attributes and attribute change events to the class being 
     * augmented. It also provides a State class, which is used internally by Attribute,
     * but can also be used independently to provide a name/property/value data structure to
     * store state.
     *
     * @module attribute
     */

    /**
     * The attribute-extras submodule provides less commonly used attribute methods, and can 
     * be augmented/mixed into an implemention which used attribute-core.
     *
     * @module attribute
     * @submodule attribute-extras
     */
    _yuitest_coverfunc("build/attribute-extras/attribute-extras.js", "(anonymous 1)", 1);
_yuitest_coverline("build/attribute-extras/attribute-extras.js", 20);
var BROADCAST = "broadcast",
        PUBLISHED = "published",
        INIT_VALUE = "initValue",

        MODIFIABLE = {
            readOnly:1,
            writeOnce:1,
            getter:1,
            broadcast:1
        };

    /**
     * A augmentable implementation for AttributeCore, providing less frequently used 
     * methods for Attribute management such as modifyAttrs(), removeAttr and reset()   
     *
     * @class AttributeExtras
     */
    _yuitest_coverline("build/attribute-extras/attribute-extras.js", 37);
function AttributeExtras() {}

    _yuitest_coverline("build/attribute-extras/attribute-extras.js", 39);
AttributeExtras.prototype = {

        /**
         * Updates the configuration of an attribute which has already been added.
         * <p>
         * The properties which can be modified through this interface are limited
         * to the following subset of attributes, which can be safely modified
         * after a value has already been set on the attribute: readOnly, writeOnce, 
         * broadcast and getter.
         * </p>
         * @method modifyAttr
         * @param {String} name The name of the attribute whose configuration is to be updated.
         * @param {Object} config An object with configuration property/value pairs, specifying the configuration properties to modify.
         */
        modifyAttr: function(name, config) {
            _yuitest_coverfunc("build/attribute-extras/attribute-extras.js", "modifyAttr", 53);
_yuitest_coverline("build/attribute-extras/attribute-extras.js", 54);
var host = this, // help compression
                prop, state;

            _yuitest_coverline("build/attribute-extras/attribute-extras.js", 57);
if (host.attrAdded(name)) {

                _yuitest_coverline("build/attribute-extras/attribute-extras.js", 59);
if (host._isLazyAttr(name)) {
                    _yuitest_coverline("build/attribute-extras/attribute-extras.js", 60);
host._addLazyAttr(name);
                }

                _yuitest_coverline("build/attribute-extras/attribute-extras.js", 63);
state = host._state;
                _yuitest_coverline("build/attribute-extras/attribute-extras.js", 64);
for (prop in config) {
                    _yuitest_coverline("build/attribute-extras/attribute-extras.js", 65);
if (MODIFIABLE[prop] && config.hasOwnProperty(prop)) {
                        _yuitest_coverline("build/attribute-extras/attribute-extras.js", 66);
state.add(name, prop, config[prop]);

                        // If we reconfigured broadcast, need to republish
                        _yuitest_coverline("build/attribute-extras/attribute-extras.js", 69);
if (prop === BROADCAST) {
                            _yuitest_coverline("build/attribute-extras/attribute-extras.js", 70);
state.remove(name, PUBLISHED);
                        }
                    }
                }
            }

        },

        /**
         * Removes an attribute from the host object
         *
         * @method removeAttr
         * @param {String} name The name of the attribute to be removed.
         */
        removeAttr: function(name) {
            _yuitest_coverfunc("build/attribute-extras/attribute-extras.js", "removeAttr", 84);
_yuitest_coverline("build/attribute-extras/attribute-extras.js", 85);
this._state.removeAll(name);
        },

        /**
         * Resets the attribute (or all attributes) to its initial value, as long as
         * the attribute is not readOnly, or writeOnce.
         *
         * @method reset
         * @param {String} name Optional. The name of the attribute to reset.  If omitted, all attributes are reset.
         * @return {Object} A reference to the host object.
         * @chainable
         */
        reset : function(name) {
            _yuitest_coverfunc("build/attribute-extras/attribute-extras.js", "reset", 97);
_yuitest_coverline("build/attribute-extras/attribute-extras.js", 98);
var host = this;  // help compression

            _yuitest_coverline("build/attribute-extras/attribute-extras.js", 100);
if (name) {
                _yuitest_coverline("build/attribute-extras/attribute-extras.js", 101);
if (host._isLazyAttr(name)) {
                    _yuitest_coverline("build/attribute-extras/attribute-extras.js", 102);
host._addLazyAttr(name);
                }
                _yuitest_coverline("build/attribute-extras/attribute-extras.js", 104);
host.set(name, host._state.get(name, INIT_VALUE));
            } else {
                _yuitest_coverline("build/attribute-extras/attribute-extras.js", 106);
Y.each(host._state.data, function(v, n) {
                    _yuitest_coverfunc("build/attribute-extras/attribute-extras.js", "(anonymous 2)", 106);
_yuitest_coverline("build/attribute-extras/attribute-extras.js", 107);
host.reset(n);
                });
            }
            _yuitest_coverline("build/attribute-extras/attribute-extras.js", 110);
return host;
        },

        /**
         * Returns an object with the configuration properties (and value)
         * for the given attribute. If attrName is not provided, returns the
         * configuration properties for all attributes.
         *
         * @method _getAttrCfg
         * @protected
         * @param {String} name Optional. The attribute name. If not provided, the method will return the configuration for all attributes.
         * @return {Object} The configuration properties for the given attribute, or all attributes.
         */
        _getAttrCfg : function(name) {
            _yuitest_coverfunc("build/attribute-extras/attribute-extras.js", "_getAttrCfg", 123);
_yuitest_coverline("build/attribute-extras/attribute-extras.js", 124);
var o,
                state = this._state;

            _yuitest_coverline("build/attribute-extras/attribute-extras.js", 127);
if (name) {
                _yuitest_coverline("build/attribute-extras/attribute-extras.js", 128);
o = state.getAll(name) || {};
            } else {
                _yuitest_coverline("build/attribute-extras/attribute-extras.js", 130);
o = {};
                _yuitest_coverline("build/attribute-extras/attribute-extras.js", 131);
Y.each(state.data, function(v, n) {
                    _yuitest_coverfunc("build/attribute-extras/attribute-extras.js", "(anonymous 3)", 131);
_yuitest_coverline("build/attribute-extras/attribute-extras.js", 132);
o[n] = state.getAll(n);
                }); 
            }

            _yuitest_coverline("build/attribute-extras/attribute-extras.js", 136);
return o;
        }
    };

    _yuitest_coverline("build/attribute-extras/attribute-extras.js", 140);
Y.AttributeExtras = AttributeExtras;


}, '3.7.3', {"requires": ["oop"]});
