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
_yuitest_coverage["build/node-style/node-style.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/node-style/node-style.js",
    code: []
};
_yuitest_coverage["build/node-style/node-style.js"].code=["YUI.add('node-style', function (Y, NAME) {","","(function(Y) {","/**"," * Extended Node interface for managing node styles."," * @module node"," * @submodule node-style"," */","","Y.mix(Y.Node.prototype, {","    /**","     * Sets a style property of the node.","     * Use camelCase (e.g. 'backgroundColor') for multi-word properties.","     * @method setStyle","     * @param {String} attr The style attribute to set. ","     * @param {String|Number} val The value. ","     * @chainable","     */","    setStyle: function(attr, val) {","        Y.DOM.setStyle(this._node, attr, val);","        return this;","    },","","    /**","     * Sets multiple style properties on the node.","     * Use camelCase (e.g. 'backgroundColor') for multi-word properties.","     * @method setStyles","     * @param {Object} hash An object literal of property:value pairs. ","     * @chainable","     */","    setStyles: function(hash) {","        Y.DOM.setStyles(this._node, hash);","        return this;","    },","","    /**","     * Returns the style's current value.","     * Use camelCase (e.g. 'backgroundColor') for multi-word properties.","     * @method getStyle","     * @for Node","     * @param {String} attr The style attribute to retrieve. ","     * @return {String} The current value of the style property for the element.","     */","","     getStyle: function(attr) {","        return Y.DOM.getStyle(this._node, attr);","     },","","    /**","     * Returns the computed value for the given style property.","     * Use camelCase (e.g. 'backgroundColor') for multi-word properties.","     * @method getComputedStyle","     * @param {String} attr The style attribute to retrieve. ","     * @return {String} The computed value of the style property for the element.","     */","     getComputedStyle: function(attr) {","        return Y.DOM.getComputedStyle(this._node, attr);","     }","});","","/**"," * Returns an array of values for each node."," * Use camelCase (e.g. 'backgroundColor') for multi-word properties."," * @method getStyle"," * @for NodeList"," * @see Node.getStyle"," * @param {String} attr The style attribute to retrieve. "," * @return {Array} The current values of the style property for the element."," */","","/**"," * Returns an array of the computed value for each node."," * Use camelCase (e.g. 'backgroundColor') for multi-word properties."," * @method getComputedStyle"," * @see Node.getComputedStyle"," * @param {String} attr The style attribute to retrieve. "," * @return {Array} The computed values for each node."," */","","/**"," * Sets a style property on each node."," * Use camelCase (e.g. 'backgroundColor') for multi-word properties."," * @method setStyle"," * @see Node.setStyle"," * @param {String} attr The style attribute to set. "," * @param {String|Number} val The value. "," * @chainable"," */","","/**"," * Sets multiple style properties on each node."," * Use camelCase (e.g. 'backgroundColor') for multi-word properties."," * @method setStyles"," * @see Node.setStyles"," * @param {Object} hash An object literal of property:value pairs. "," * @chainable"," */","","// These are broken out to handle undefined return (avoid false positive for","// chainable)","","Y.NodeList.importMethod(Y.Node.prototype, ['getStyle', 'getComputedStyle', 'setStyle', 'setStyles']);","})(Y);","","","}, '3.7.3', {\"requires\": [\"dom-style\", \"node-base\"]});"];
_yuitest_coverage["build/node-style/node-style.js"].lines = {"1":0,"3":0,"10":0,"20":0,"21":0,"32":0,"33":0,"46":0,"57":0,"102":0};
_yuitest_coverage["build/node-style/node-style.js"].functions = {"setStyle:19":0,"setStyles:31":0,"getStyle:45":0,"getComputedStyle:56":0,"(anonymous 2):3":0,"(anonymous 1):1":0};
_yuitest_coverage["build/node-style/node-style.js"].coveredLines = 10;
_yuitest_coverage["build/node-style/node-style.js"].coveredFunctions = 6;
_yuitest_coverline("build/node-style/node-style.js", 1);
YUI.add('node-style', function (Y, NAME) {

_yuitest_coverfunc("build/node-style/node-style.js", "(anonymous 1)", 1);
_yuitest_coverline("build/node-style/node-style.js", 3);
(function(Y) {
/**
 * Extended Node interface for managing node styles.
 * @module node
 * @submodule node-style
 */

_yuitest_coverfunc("build/node-style/node-style.js", "(anonymous 2)", 3);
_yuitest_coverline("build/node-style/node-style.js", 10);
Y.mix(Y.Node.prototype, {
    /**
     * Sets a style property of the node.
     * Use camelCase (e.g. 'backgroundColor') for multi-word properties.
     * @method setStyle
     * @param {String} attr The style attribute to set. 
     * @param {String|Number} val The value. 
     * @chainable
     */
    setStyle: function(attr, val) {
        _yuitest_coverfunc("build/node-style/node-style.js", "setStyle", 19);
_yuitest_coverline("build/node-style/node-style.js", 20);
Y.DOM.setStyle(this._node, attr, val);
        _yuitest_coverline("build/node-style/node-style.js", 21);
return this;
    },

    /**
     * Sets multiple style properties on the node.
     * Use camelCase (e.g. 'backgroundColor') for multi-word properties.
     * @method setStyles
     * @param {Object} hash An object literal of property:value pairs. 
     * @chainable
     */
    setStyles: function(hash) {
        _yuitest_coverfunc("build/node-style/node-style.js", "setStyles", 31);
_yuitest_coverline("build/node-style/node-style.js", 32);
Y.DOM.setStyles(this._node, hash);
        _yuitest_coverline("build/node-style/node-style.js", 33);
return this;
    },

    /**
     * Returns the style's current value.
     * Use camelCase (e.g. 'backgroundColor') for multi-word properties.
     * @method getStyle
     * @for Node
     * @param {String} attr The style attribute to retrieve. 
     * @return {String} The current value of the style property for the element.
     */

     getStyle: function(attr) {
        _yuitest_coverfunc("build/node-style/node-style.js", "getStyle", 45);
_yuitest_coverline("build/node-style/node-style.js", 46);
return Y.DOM.getStyle(this._node, attr);
     },

    /**
     * Returns the computed value for the given style property.
     * Use camelCase (e.g. 'backgroundColor') for multi-word properties.
     * @method getComputedStyle
     * @param {String} attr The style attribute to retrieve. 
     * @return {String} The computed value of the style property for the element.
     */
     getComputedStyle: function(attr) {
        _yuitest_coverfunc("build/node-style/node-style.js", "getComputedStyle", 56);
_yuitest_coverline("build/node-style/node-style.js", 57);
return Y.DOM.getComputedStyle(this._node, attr);
     }
});

/**
 * Returns an array of values for each node.
 * Use camelCase (e.g. 'backgroundColor') for multi-word properties.
 * @method getStyle
 * @for NodeList
 * @see Node.getStyle
 * @param {String} attr The style attribute to retrieve. 
 * @return {Array} The current values of the style property for the element.
 */

/**
 * Returns an array of the computed value for each node.
 * Use camelCase (e.g. 'backgroundColor') for multi-word properties.
 * @method getComputedStyle
 * @see Node.getComputedStyle
 * @param {String} attr The style attribute to retrieve. 
 * @return {Array} The computed values for each node.
 */

/**
 * Sets a style property on each node.
 * Use camelCase (e.g. 'backgroundColor') for multi-word properties.
 * @method setStyle
 * @see Node.setStyle
 * @param {String} attr The style attribute to set. 
 * @param {String|Number} val The value. 
 * @chainable
 */

/**
 * Sets multiple style properties on each node.
 * Use camelCase (e.g. 'backgroundColor') for multi-word properties.
 * @method setStyles
 * @see Node.setStyles
 * @param {Object} hash An object literal of property:value pairs. 
 * @chainable
 */

// These are broken out to handle undefined return (avoid false positive for
// chainable)

_yuitest_coverline("build/node-style/node-style.js", 102);
Y.NodeList.importMethod(Y.Node.prototype, ['getStyle', 'getComputedStyle', 'setStyle', 'setStyles']);
})(Y);


}, '3.7.3', {"requires": ["dom-style", "node-base"]});
