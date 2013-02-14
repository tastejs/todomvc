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
_yuitest_coverage["build/dom-deprecated/dom-deprecated.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/dom-deprecated/dom-deprecated.js",
    code: []
};
_yuitest_coverage["build/dom-deprecated/dom-deprecated.js"].code=["YUI.add('dom-deprecated', function (Y, NAME) {","","","Y.mix(Y.DOM, {","    // @deprecated","    children: function(node, tag) {","        var ret = [];","        if (node) {","            tag = tag || '*';","            ret = Y.Selector.query('> ' + tag, node); ","        }","        return ret;","    },","","    // @deprecated","    firstByTag: function(tag, root) {","        var ret;","        root = root || Y.config.doc;","","        if (tag && root.getElementsByTagName) {","            ret = root.getElementsByTagName(tag)[0];","        }","","        return ret || null;","    },","","    /*","     * Finds the previous sibling of the element.","     * @method previous","     * @deprecated Use elementByAxis","     * @param {HTMLElement} element The html element.","     * @param {Function} fn optional An optional boolean test to apply.","     * The optional function is passed the current DOM node being tested as its only argument.","     * If no function is given, the first sibling is returned.","     * @param {Boolean} all optional Whether all node types should be scanned, or just element nodes.","     * @return {HTMLElement | null} The matching DOM node or null if none found. ","     */","    previous: function(element, fn, all) {","        return Y.DOM.elementByAxis(element, 'previousSibling', fn, all);","    },","","    /*","     * Finds the next sibling of the element.","     * @method next","     * @deprecated Use elementByAxis","     * @param {HTMLElement} element The html element.","     * @param {Function} fn optional An optional boolean test to apply.","     * The optional function is passed the current DOM node being tested as its only argument.","     * If no function is given, the first sibling is returned.","     * @param {Boolean} all optional Whether all node types should be scanned, or just element nodes.","     * @return {HTMLElement | null} The matching DOM node or null if none found. ","     */","    next: function(element, fn, all) {","        return Y.DOM.elementByAxis(element, 'nextSibling', fn, all);","    }","","});","","","","}, '3.7.3', {\"requires\": [\"dom-base\"]});"];
_yuitest_coverage["build/dom-deprecated/dom-deprecated.js"].lines = {"1":0,"4":0,"7":0,"8":0,"9":0,"10":0,"12":0,"17":0,"18":0,"20":0,"21":0,"24":0,"39":0,"54":0};
_yuitest_coverage["build/dom-deprecated/dom-deprecated.js"].functions = {"children:6":0,"firstByTag:16":0,"previous:38":0,"next:53":0,"(anonymous 1):1":0};
_yuitest_coverage["build/dom-deprecated/dom-deprecated.js"].coveredLines = 14;
_yuitest_coverage["build/dom-deprecated/dom-deprecated.js"].coveredFunctions = 5;
_yuitest_coverline("build/dom-deprecated/dom-deprecated.js", 1);
YUI.add('dom-deprecated', function (Y, NAME) {


_yuitest_coverfunc("build/dom-deprecated/dom-deprecated.js", "(anonymous 1)", 1);
_yuitest_coverline("build/dom-deprecated/dom-deprecated.js", 4);
Y.mix(Y.DOM, {
    // @deprecated
    children: function(node, tag) {
        _yuitest_coverfunc("build/dom-deprecated/dom-deprecated.js", "children", 6);
_yuitest_coverline("build/dom-deprecated/dom-deprecated.js", 7);
var ret = [];
        _yuitest_coverline("build/dom-deprecated/dom-deprecated.js", 8);
if (node) {
            _yuitest_coverline("build/dom-deprecated/dom-deprecated.js", 9);
tag = tag || '*';
            _yuitest_coverline("build/dom-deprecated/dom-deprecated.js", 10);
ret = Y.Selector.query('> ' + tag, node); 
        }
        _yuitest_coverline("build/dom-deprecated/dom-deprecated.js", 12);
return ret;
    },

    // @deprecated
    firstByTag: function(tag, root) {
        _yuitest_coverfunc("build/dom-deprecated/dom-deprecated.js", "firstByTag", 16);
_yuitest_coverline("build/dom-deprecated/dom-deprecated.js", 17);
var ret;
        _yuitest_coverline("build/dom-deprecated/dom-deprecated.js", 18);
root = root || Y.config.doc;

        _yuitest_coverline("build/dom-deprecated/dom-deprecated.js", 20);
if (tag && root.getElementsByTagName) {
            _yuitest_coverline("build/dom-deprecated/dom-deprecated.js", 21);
ret = root.getElementsByTagName(tag)[0];
        }

        _yuitest_coverline("build/dom-deprecated/dom-deprecated.js", 24);
return ret || null;
    },

    /*
     * Finds the previous sibling of the element.
     * @method previous
     * @deprecated Use elementByAxis
     * @param {HTMLElement} element The html element.
     * @param {Function} fn optional An optional boolean test to apply.
     * The optional function is passed the current DOM node being tested as its only argument.
     * If no function is given, the first sibling is returned.
     * @param {Boolean} all optional Whether all node types should be scanned, or just element nodes.
     * @return {HTMLElement | null} The matching DOM node or null if none found. 
     */
    previous: function(element, fn, all) {
        _yuitest_coverfunc("build/dom-deprecated/dom-deprecated.js", "previous", 38);
_yuitest_coverline("build/dom-deprecated/dom-deprecated.js", 39);
return Y.DOM.elementByAxis(element, 'previousSibling', fn, all);
    },

    /*
     * Finds the next sibling of the element.
     * @method next
     * @deprecated Use elementByAxis
     * @param {HTMLElement} element The html element.
     * @param {Function} fn optional An optional boolean test to apply.
     * The optional function is passed the current DOM node being tested as its only argument.
     * If no function is given, the first sibling is returned.
     * @param {Boolean} all optional Whether all node types should be scanned, or just element nodes.
     * @return {HTMLElement | null} The matching DOM node or null if none found. 
     */
    next: function(element, fn, all) {
        _yuitest_coverfunc("build/dom-deprecated/dom-deprecated.js", "next", 53);
_yuitest_coverline("build/dom-deprecated/dom-deprecated.js", 54);
return Y.DOM.elementByAxis(element, 'nextSibling', fn, all);
    }

});



}, '3.7.3', {"requires": ["dom-base"]});
