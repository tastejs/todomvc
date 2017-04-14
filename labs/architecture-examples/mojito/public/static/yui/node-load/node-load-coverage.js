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
_yuitest_coverage["build/node-load/node-load.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/node-load/node-load.js",
    code: []
};
_yuitest_coverage["build/node-load/node-load.js"].code=["YUI.add('node-load', function (Y, NAME) {","","/**"," * Extended Node interface with a basic IO API."," * @module node"," * @submodule node-load"," */","","/**"," * The default IO complete handler."," * @method _ioComplete"," * @protected"," * @for Node"," * @param {String} code The response code."," * @param {Object} response The response object."," * @param {Array} args An array containing the callback and selector"," */","","Y.Node.prototype._ioComplete = function(code, response, args) {","    var selector = args[0],","        callback = args[1],","        tmp,","        content;","","    if (response && response.responseText) {","        content = response.responseText;","        if (selector) {","            tmp = Y.DOM.create(content);","            content = Y.Selector.query(selector, tmp);","        }","        this.setContent(content);","    }","    if (callback) {","        callback.call(this, code, response);","    }","};","","/**"," * Loads content from the given url and replaces the Node's"," * existing content with the remote content."," * @method load"," * @param {String} url The URL to load via XMLHttpRequest."," * @param {String} selector An optional selector representing a subset of an HTML document to load."," * @param {Function} callback An optional function to run after the content has been loaded."," * @chainable"," */","Y.Node.prototype.load = function(url, selector, callback) {","    if (typeof selector == 'function') {","        callback = selector;","        selector = null;","    }","    var config = {","        context: this,","        on: {","            complete: this._ioComplete","        },","        arguments: [selector, callback]","    };","","    Y.io(url, config);","    return this;","};","","","}, '3.7.3', {\"requires\": [\"node-base\", \"io-base\"]});"];
_yuitest_coverage["build/node-load/node-load.js"].lines = {"1":0,"19":0,"20":0,"25":0,"26":0,"27":0,"28":0,"29":0,"31":0,"33":0,"34":0,"47":0,"48":0,"49":0,"50":0,"52":0,"60":0,"61":0};
_yuitest_coverage["build/node-load/node-load.js"].functions = {"_ioComplete:19":0,"load:47":0,"(anonymous 1):1":0};
_yuitest_coverage["build/node-load/node-load.js"].coveredLines = 18;
_yuitest_coverage["build/node-load/node-load.js"].coveredFunctions = 3;
_yuitest_coverline("build/node-load/node-load.js", 1);
YUI.add('node-load', function (Y, NAME) {

/**
 * Extended Node interface with a basic IO API.
 * @module node
 * @submodule node-load
 */

/**
 * The default IO complete handler.
 * @method _ioComplete
 * @protected
 * @for Node
 * @param {String} code The response code.
 * @param {Object} response The response object.
 * @param {Array} args An array containing the callback and selector
 */

_yuitest_coverfunc("build/node-load/node-load.js", "(anonymous 1)", 1);
_yuitest_coverline("build/node-load/node-load.js", 19);
Y.Node.prototype._ioComplete = function(code, response, args) {
    _yuitest_coverfunc("build/node-load/node-load.js", "_ioComplete", 19);
_yuitest_coverline("build/node-load/node-load.js", 20);
var selector = args[0],
        callback = args[1],
        tmp,
        content;

    _yuitest_coverline("build/node-load/node-load.js", 25);
if (response && response.responseText) {
        _yuitest_coverline("build/node-load/node-load.js", 26);
content = response.responseText;
        _yuitest_coverline("build/node-load/node-load.js", 27);
if (selector) {
            _yuitest_coverline("build/node-load/node-load.js", 28);
tmp = Y.DOM.create(content);
            _yuitest_coverline("build/node-load/node-load.js", 29);
content = Y.Selector.query(selector, tmp);
        }
        _yuitest_coverline("build/node-load/node-load.js", 31);
this.setContent(content);
    }
    _yuitest_coverline("build/node-load/node-load.js", 33);
if (callback) {
        _yuitest_coverline("build/node-load/node-load.js", 34);
callback.call(this, code, response);
    }
};

/**
 * Loads content from the given url and replaces the Node's
 * existing content with the remote content.
 * @method load
 * @param {String} url The URL to load via XMLHttpRequest.
 * @param {String} selector An optional selector representing a subset of an HTML document to load.
 * @param {Function} callback An optional function to run after the content has been loaded.
 * @chainable
 */
_yuitest_coverline("build/node-load/node-load.js", 47);
Y.Node.prototype.load = function(url, selector, callback) {
    _yuitest_coverfunc("build/node-load/node-load.js", "load", 47);
_yuitest_coverline("build/node-load/node-load.js", 48);
if (typeof selector == 'function') {
        _yuitest_coverline("build/node-load/node-load.js", 49);
callback = selector;
        _yuitest_coverline("build/node-load/node-load.js", 50);
selector = null;
    }
    _yuitest_coverline("build/node-load/node-load.js", 52);
var config = {
        context: this,
        on: {
            complete: this._ioComplete
        },
        arguments: [selector, callback]
    };

    _yuitest_coverline("build/node-load/node-load.js", 60);
Y.io(url, config);
    _yuitest_coverline("build/node-load/node-load.js", 61);
return this;
};


}, '3.7.3', {"requires": ["node-base", "io-base"]});
