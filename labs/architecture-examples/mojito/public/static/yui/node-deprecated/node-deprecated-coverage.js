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
_yuitest_coverage["build/node-deprecated/node-deprecated.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/node-deprecated/node-deprecated.js",
    code: []
};
_yuitest_coverage["build/node-deprecated/node-deprecated.js"].code=["YUI.add('node-deprecated', function (Y, NAME) {","","/**"," * @module node"," * @submodule node-deprecated"," * @deprecated"," */","","var Y_Node = Y.Node;","","/*"," * Flat data store for off-DOM usage"," * @config data"," * @type any"," * @deprecated Use getData/setData"," * @for Node"," */","Y_Node.ATTRS.data = {","    getter: function() {","        return this._dataVal;","    },","    setter: function(val) {","        this._dataVal = val;","        return val;","    },","    value: null","};","","/**"," * Returns a single Node instance bound to the node or the"," * first element matching the given selector."," * @method get"," * @for YUI"," * @deprecated Use Y.one"," * @static"," * @param {String | HTMLElement} node a node or Selector"," * @param {Node | HTMLElement} doc an optional document to scan. Defaults to Y.config.doc."," */","","/**"," * Returns a single Node instance bound to the node or the"," * first element matching the given selector."," * @method get"," * @for Node"," * @deprecated Use Y.one"," * @static"," * @param {String | HTMLElement} node a node or Selector"," * @param {Node | HTMLElement} doc an optional document to scan. Defaults to Y.config.doc."," */","Y.get = Y_Node.get = function() {","    return Y_Node.one.apply(Y_Node, arguments);","};","","","Y.mix(Y_Node.prototype, {","    /**","     * Retrieves a Node instance of nodes based on the given CSS selector.","     * @method query","     * @deprecated Use one()","     * @param {string} selector The CSS selector to test against.","     * @return {Node} A Node instance for the matching HTMLElement.","     */","    query: function(selector) {","        return this.one(selector);","    },","","    /**","     * Retrieves a nodeList based on the given CSS selector.","     * @method queryAll","     * @deprecated Use all()","     * @param {string} selector The CSS selector to test against.","     * @return {NodeList} A NodeList instance for the matching HTMLCollection/Array.","     */","    queryAll: function(selector) {","        return this.all(selector);","    },","","    /**","     * Applies the given function to each Node in the NodeList.","     * @method each","     * @deprecated Use NodeList","     * @param {Function} fn The function to apply","     * @param {Object} context optional An optional context to apply the function with","     * Default context is the NodeList instance","     * @chainable","     */","    each: function(fn, context) {","        context = context || this;","        return fn.call(context, this);","    },","","    /**","     * Retrieves the Node instance at the given index.","     * @method item","     * @deprecated Use NodeList","     *","     * @param {Number} index The index of the target Node.","     * @return {Node} The Node instance at the given index.","     */","    item: function(index) {","        return this;","    },","","    /**","     * Returns the current number of items in the Node.","     * @method size","     * @deprecated Use NodeList","     * @return {Int} The number of items in the Node.","     */","    size: function() {","        return this._node ? 1 : 0;","    }","","});","","","","","}, '3.7.3', {\"requires\": [\"node-base\"]});"];
_yuitest_coverage["build/node-deprecated/node-deprecated.js"].lines = {"1":0,"9":0,"18":0,"20":0,"23":0,"24":0,"50":0,"51":0,"55":0,"64":0,"75":0,"88":0,"89":0,"101":0,"111":0};
_yuitest_coverage["build/node-deprecated/node-deprecated.js"].functions = {"getter:19":0,"setter:22":0,"get:50":0,"query:63":0,"queryAll:74":0,"each:87":0,"item:100":0,"size:110":0,"(anonymous 1):1":0};
_yuitest_coverage["build/node-deprecated/node-deprecated.js"].coveredLines = 15;
_yuitest_coverage["build/node-deprecated/node-deprecated.js"].coveredFunctions = 9;
_yuitest_coverline("build/node-deprecated/node-deprecated.js", 1);
YUI.add('node-deprecated', function (Y, NAME) {

/**
 * @module node
 * @submodule node-deprecated
 * @deprecated
 */

_yuitest_coverfunc("build/node-deprecated/node-deprecated.js", "(anonymous 1)", 1);
_yuitest_coverline("build/node-deprecated/node-deprecated.js", 9);
var Y_Node = Y.Node;

/*
 * Flat data store for off-DOM usage
 * @config data
 * @type any
 * @deprecated Use getData/setData
 * @for Node
 */
_yuitest_coverline("build/node-deprecated/node-deprecated.js", 18);
Y_Node.ATTRS.data = {
    getter: function() {
        _yuitest_coverfunc("build/node-deprecated/node-deprecated.js", "getter", 19);
_yuitest_coverline("build/node-deprecated/node-deprecated.js", 20);
return this._dataVal;
    },
    setter: function(val) {
        _yuitest_coverfunc("build/node-deprecated/node-deprecated.js", "setter", 22);
_yuitest_coverline("build/node-deprecated/node-deprecated.js", 23);
this._dataVal = val;
        _yuitest_coverline("build/node-deprecated/node-deprecated.js", 24);
return val;
    },
    value: null
};

/**
 * Returns a single Node instance bound to the node or the
 * first element matching the given selector.
 * @method get
 * @for YUI
 * @deprecated Use Y.one
 * @static
 * @param {String | HTMLElement} node a node or Selector
 * @param {Node | HTMLElement} doc an optional document to scan. Defaults to Y.config.doc.
 */

/**
 * Returns a single Node instance bound to the node or the
 * first element matching the given selector.
 * @method get
 * @for Node
 * @deprecated Use Y.one
 * @static
 * @param {String | HTMLElement} node a node or Selector
 * @param {Node | HTMLElement} doc an optional document to scan. Defaults to Y.config.doc.
 */
_yuitest_coverline("build/node-deprecated/node-deprecated.js", 50);
Y.get = Y_Node.get = function() {
    _yuitest_coverfunc("build/node-deprecated/node-deprecated.js", "get", 50);
_yuitest_coverline("build/node-deprecated/node-deprecated.js", 51);
return Y_Node.one.apply(Y_Node, arguments);
};


_yuitest_coverline("build/node-deprecated/node-deprecated.js", 55);
Y.mix(Y_Node.prototype, {
    /**
     * Retrieves a Node instance of nodes based on the given CSS selector.
     * @method query
     * @deprecated Use one()
     * @param {string} selector The CSS selector to test against.
     * @return {Node} A Node instance for the matching HTMLElement.
     */
    query: function(selector) {
        _yuitest_coverfunc("build/node-deprecated/node-deprecated.js", "query", 63);
_yuitest_coverline("build/node-deprecated/node-deprecated.js", 64);
return this.one(selector);
    },

    /**
     * Retrieves a nodeList based on the given CSS selector.
     * @method queryAll
     * @deprecated Use all()
     * @param {string} selector The CSS selector to test against.
     * @return {NodeList} A NodeList instance for the matching HTMLCollection/Array.
     */
    queryAll: function(selector) {
        _yuitest_coverfunc("build/node-deprecated/node-deprecated.js", "queryAll", 74);
_yuitest_coverline("build/node-deprecated/node-deprecated.js", 75);
return this.all(selector);
    },

    /**
     * Applies the given function to each Node in the NodeList.
     * @method each
     * @deprecated Use NodeList
     * @param {Function} fn The function to apply
     * @param {Object} context optional An optional context to apply the function with
     * Default context is the NodeList instance
     * @chainable
     */
    each: function(fn, context) {
        _yuitest_coverfunc("build/node-deprecated/node-deprecated.js", "each", 87);
_yuitest_coverline("build/node-deprecated/node-deprecated.js", 88);
context = context || this;
        _yuitest_coverline("build/node-deprecated/node-deprecated.js", 89);
return fn.call(context, this);
    },

    /**
     * Retrieves the Node instance at the given index.
     * @method item
     * @deprecated Use NodeList
     *
     * @param {Number} index The index of the target Node.
     * @return {Node} The Node instance at the given index.
     */
    item: function(index) {
        _yuitest_coverfunc("build/node-deprecated/node-deprecated.js", "item", 100);
_yuitest_coverline("build/node-deprecated/node-deprecated.js", 101);
return this;
    },

    /**
     * Returns the current number of items in the Node.
     * @method size
     * @deprecated Use NodeList
     * @return {Int} The number of items in the Node.
     */
    size: function() {
        _yuitest_coverfunc("build/node-deprecated/node-deprecated.js", "size", 110);
_yuitest_coverline("build/node-deprecated/node-deprecated.js", 111);
return this._node ? 1 : 0;
    }

});




}, '3.7.3', {"requires": ["node-base"]});
