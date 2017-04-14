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
_yuitest_coverage["build/dom-core/dom-core.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/dom-core/dom-core.js",
    code: []
};
_yuitest_coverage["build/dom-core/dom-core.js"].code=["YUI.add('dom-core', function (Y, NAME) {","","var NODE_TYPE = 'nodeType',","    OWNER_DOCUMENT = 'ownerDocument',","    DOCUMENT_ELEMENT = 'documentElement',","    DEFAULT_VIEW = 'defaultView',","    PARENT_WINDOW = 'parentWindow',","    TAG_NAME = 'tagName',","    PARENT_NODE = 'parentNode',","    PREVIOUS_SIBLING = 'previousSibling',","    NEXT_SIBLING = 'nextSibling',","    CONTAINS = 'contains',","    COMPARE_DOCUMENT_POSITION = 'compareDocumentPosition',","    EMPTY_ARRAY = [],","    ","    // IE < 8 throws on node.contains(textNode)","    supportsContainsTextNode = (function() {","        var node = Y.config.doc.createElement('div'),","            textNode = node.appendChild(Y.config.doc.createTextNode('')),","            result = false;","        ","        try {","            result = node.contains(textNode);","        } catch(e) {}","","        return result;","    })(),","","/** "," * The DOM utility provides a cross-browser abtraction layer"," * normalizing DOM tasks, and adds extra helper functionality"," * for other common tasks. "," * @module dom"," * @main dom"," * @submodule dom-base"," * @for DOM"," *"," */","","/**"," * Provides DOM helper methods."," * @class DOM"," *"," */","    ","Y_DOM = {","    /**","     * Returns the HTMLElement with the given ID (Wrapper for document.getElementById).","     * @method byId         ","     * @param {String} id the id attribute ","     * @param {Object} doc optional The document to search. Defaults to current document ","     * @return {HTMLElement | null} The HTMLElement with the id, or null if none found. ","     */","    byId: function(id, doc) {","        // handle dupe IDs and IE name collision","        return Y_DOM.allById(id, doc)[0] || null;","    },","","    getId: function(node) {","        var id;","        // HTMLElement returned from FORM when INPUT name === \"id\"","        // IE < 8: HTMLCollection returned when INPUT id === \"id\"","        // via both getAttribute and form.id ","        if (node.id && !node.id.tagName && !node.id.item) {","            id = node.id;","        } else if (node.attributes && node.attributes.id) {","            id = node.attributes.id.value;","        }","","        return id;","    },","","    setId: function(node, id) {","        if (node.setAttribute) {","            node.setAttribute('id', id);","        } else {","            node.id = id;","        }","    },","","    /*","     * Finds the ancestor of the element.","     * @method ancestor","     * @param {HTMLElement} element The html element.","     * @param {Function} fn optional An optional boolean test to apply.","     * The optional function is passed the current DOM node being tested as its only argument.","     * If no function is given, the parentNode is returned.","     * @param {Boolean} testSelf optional Whether or not to include the element in the scan ","     * @return {HTMLElement | null} The matching DOM node or null if none found. ","     */","    ancestor: function(element, fn, testSelf, stopFn) {","        var ret = null;","        if (testSelf) {","            ret = (!fn || fn(element)) ? element : null;","","        }","        return ret || Y_DOM.elementByAxis(element, PARENT_NODE, fn, null, stopFn);","    },","","    /*","     * Finds the ancestors of the element.","     * @method ancestors","     * @param {HTMLElement} element The html element.","     * @param {Function} fn optional An optional boolean test to apply.","     * The optional function is passed the current DOM node being tested as its only argument.","     * If no function is given, all ancestors are returned.","     * @param {Boolean} testSelf optional Whether or not to include the element in the scan ","     * @return {Array} An array containing all matching DOM nodes.","     */","    ancestors: function(element, fn, testSelf, stopFn) {","        var ancestor = element,","            ret = [];","","        while ((ancestor = Y_DOM.ancestor(ancestor, fn, testSelf, stopFn))) {","            testSelf = false;","            if (ancestor) {","                ret.unshift(ancestor);","","                if (stopFn && stopFn(ancestor)) {","                    return ret;","                }","            }","        }","","        return ret;","    },","","    /**","     * Searches the element by the given axis for the first matching element.","     * @method elementByAxis","     * @param {HTMLElement} element The html element.","     * @param {String} axis The axis to search (parentNode, nextSibling, previousSibling).","     * @param {Function} fn optional An optional boolean test to apply.","     * @param {Boolean} all optional Whether all node types should be returned, or just element nodes.","     * The optional function is passed the current HTMLElement being tested as its only argument.","     * If no function is given, the first element is returned.","     * @return {HTMLElement | null} The matching element or null if none found.","     */","    elementByAxis: function(element, axis, fn, all, stopAt) {","        while (element && (element = element[axis])) { // NOTE: assignment","                if ( (all || element[TAG_NAME]) && (!fn || fn(element)) ) {","                    return element;","                }","","                if (stopAt && stopAt(element)) {","                    return null;","                }","        }","        return null;","    },","","    /**","     * Determines whether or not one HTMLElement is or contains another HTMLElement.","     * @method contains","     * @param {HTMLElement} element The containing html element.","     * @param {HTMLElement} needle The html element that may be contained.","     * @return {Boolean} Whether or not the element is or contains the needle.","     */","    contains: function(element, needle) {","        var ret = false;","","        if ( !needle || !element || !needle[NODE_TYPE] || !element[NODE_TYPE]) {","            ret = false;","        } else if (element[CONTAINS] &&","                // IE < 8 throws on node.contains(textNode) so fall back to brute.","                // Falling back for other nodeTypes as well.","                (needle[NODE_TYPE] === 1 || supportsContainsTextNode)) {","                ret = element[CONTAINS](needle);","        } else if (element[COMPARE_DOCUMENT_POSITION]) {","            // Match contains behavior (node.contains(node) === true).","            // Needed for Firefox < 4.","            if (element === needle || !!(element[COMPARE_DOCUMENT_POSITION](needle) & 16)) { ","                ret = true;","            }","        } else {","            ret = Y_DOM._bruteContains(element, needle);","        }","","        return ret;","    },","","    /**","     * Determines whether or not the HTMLElement is part of the document.","     * @method inDoc","     * @param {HTMLElement} element The containing html element.","     * @param {HTMLElement} doc optional The document to check.","     * @return {Boolean} Whether or not the element is attached to the document. ","     */","    inDoc: function(element, doc) {","        var ret = false,","            rootNode;","","        if (element && element.nodeType) {","            (doc) || (doc = element[OWNER_DOCUMENT]);","","            rootNode = doc[DOCUMENT_ELEMENT];","","            // contains only works with HTML_ELEMENT","            if (rootNode && rootNode.contains && element.tagName) {","                ret = rootNode.contains(element);","            } else {","                ret = Y_DOM.contains(rootNode, element);","            }","        }","","        return ret;","","    },","","   allById: function(id, root) {","        root = root || Y.config.doc;","        var nodes = [],","            ret = [],","            i,","            node;","","        if (root.querySelectorAll) {","            ret = root.querySelectorAll('[id=\"' + id + '\"]');","        } else if (root.all) {","            nodes = root.all(id);","","            if (nodes) {","                // root.all may return HTMLElement or HTMLCollection.","                // some elements are also HTMLCollection (FORM, SELECT).","                if (nodes.nodeName) {","                    if (nodes.id === id) { // avoid false positive on name","                        ret.push(nodes);","                        nodes = EMPTY_ARRAY; // done, no need to filter","                    } else { //  prep for filtering","                        nodes = [nodes];","                    }","                }","","                if (nodes.length) {","                    // filter out matches on node.name","                    // and element.id as reference to element with id === 'id'","                    for (i = 0; node = nodes[i++];) {","                        if (node.id === id  || ","                                (node.attributes && node.attributes.id &&","                                node.attributes.id.value === id)) { ","                            ret.push(node);","                        }","                    }","                }","            }","        } else {","            ret = [Y_DOM._getDoc(root).getElementById(id)];","        }","    ","        return ret;","   },","","","    isWindow: function(obj) {","        return !!(obj && obj.scrollTo && obj.document);","    },","","    _removeChildNodes: function(node) {","        while (node.firstChild) {","            node.removeChild(node.firstChild);","        }","    },","","    siblings: function(node, fn) {","        var nodes = [],","            sibling = node;","","        while ((sibling = sibling[PREVIOUS_SIBLING])) {","            if (sibling[TAG_NAME] && (!fn || fn(sibling))) {","                nodes.unshift(sibling);","            }","        }","","        sibling = node;","        while ((sibling = sibling[NEXT_SIBLING])) {","            if (sibling[TAG_NAME] && (!fn || fn(sibling))) {","                nodes.push(sibling);","            }","        }","","        return nodes;","    },","","    /**","     * Brute force version of contains.","     * Used for browsers without contains support for non-HTMLElement Nodes (textNodes, etc).","     * @method _bruteContains","     * @private","     * @param {HTMLElement} element The containing html element.","     * @param {HTMLElement} needle The html element that may be contained.","     * @return {Boolean} Whether or not the element is or contains the needle.","     */","    _bruteContains: function(element, needle) {","        while (needle) {","            if (element === needle) {","                return true;","            }","            needle = needle.parentNode;","        }","        return false;","    },","","// TODO: move to Lang?","    /**","     * Memoizes dynamic regular expressions to boost runtime performance. ","     * @method _getRegExp","     * @private","     * @param {String} str The string to convert to a regular expression.","     * @param {String} flags optional An optinal string of flags.","     * @return {RegExp} An instance of RegExp","     */","    _getRegExp: function(str, flags) {","        flags = flags || '';","        Y_DOM._regexCache = Y_DOM._regexCache || {};","        if (!Y_DOM._regexCache[str + flags]) {","            Y_DOM._regexCache[str + flags] = new RegExp(str, flags);","        }","        return Y_DOM._regexCache[str + flags];","    },","","// TODO: make getDoc/Win true privates?","    /**","     * returns the appropriate document.","     * @method _getDoc","     * @private","     * @param {HTMLElement} element optional Target element.","     * @return {Object} The document for the given element or the default document. ","     */","    _getDoc: function(element) {","        var doc = Y.config.doc;","        if (element) {","            doc = (element[NODE_TYPE] === 9) ? element : // element === document","                element[OWNER_DOCUMENT] || // element === DOM node","                element.document || // element === window","                Y.config.doc; // default","        }","","        return doc;","    },","","    /**","     * returns the appropriate window.","     * @method _getWin","     * @private","     * @param {HTMLElement} element optional Target element.","     * @return {Object} The window for the given element or the default window. ","     */","    _getWin: function(element) {","        var doc = Y_DOM._getDoc(element);","        return doc[DEFAULT_VIEW] || doc[PARENT_WINDOW] || Y.config.win;","    },","","    _batch: function(nodes, fn, arg1, arg2, arg3, etc) {","        fn = (typeof fn === 'string') ? Y_DOM[fn] : fn;","        var result,","            i = 0,","            node,","            ret;","","        if (fn && nodes) {","            while ((node = nodes[i++])) {","                result = result = fn.call(Y_DOM, node, arg1, arg2, arg3, etc);","                if (typeof result !== 'undefined') {","                    (ret) || (ret = []);","                    ret.push(result);","                }","            }","        }","","        return (typeof ret !== 'undefined') ? ret : nodes;","    },","","    generateID: function(el) {","        var id = el.id;","","        if (!id) {","            id = Y.stamp(el);","            el.id = id; ","        }   ","","        return id; ","    }","};","","","Y.DOM = Y_DOM;","","","}, '3.7.3', {\"requires\": [\"oop\", \"features\"]});"];
_yuitest_coverage["build/dom-core/dom-core.js"].lines = {"1":0,"3":0,"18":0,"22":0,"23":0,"26":0,"56":0,"60":0,"64":0,"65":0,"66":0,"67":0,"70":0,"74":0,"75":0,"77":0,"92":0,"93":0,"94":0,"97":0,"111":0,"114":0,"115":0,"116":0,"117":0,"119":0,"120":0,"125":0,"140":0,"141":0,"142":0,"145":0,"146":0,"149":0,"160":0,"162":0,"163":0,"164":0,"168":0,"169":0,"172":0,"173":0,"176":0,"179":0,"190":0,"193":0,"194":0,"196":0,"199":0,"200":0,"202":0,"206":0,"211":0,"212":0,"217":0,"218":0,"219":0,"220":0,"222":0,"225":0,"226":0,"227":0,"228":0,"230":0,"234":0,"237":0,"238":0,"241":0,"247":0,"250":0,"255":0,"259":0,"260":0,"265":0,"268":0,"269":0,"270":0,"274":0,"275":0,"276":0,"277":0,"281":0,"294":0,"295":0,"296":0,"298":0,"300":0,"313":0,"314":0,"315":0,"316":0,"318":0,"330":0,"331":0,"332":0,"338":0,"349":0,"350":0,"354":0,"355":0,"360":0,"361":0,"362":0,"363":0,"364":0,"365":0,"370":0,"374":0,"376":0,"377":0,"378":0,"381":0,"386":0};
_yuitest_coverage["build/dom-core/dom-core.js"].functions = {"(anonymous 2):17":0,"byId:54":0,"getId:59":0,"setId:73":0,"ancestor:91":0,"ancestors:110":0,"elementByAxis:139":0,"contains:159":0,"inDoc:189":0,"allById:210":0,"isWindow:254":0,"_removeChildNodes:258":0,"siblings:264":0,"_bruteContains:293":0,"_getRegExp:312":0,"_getDoc:329":0,"_getWin:348":0,"_batch:353":0,"generateID:373":0,"(anonymous 1):1":0};
_yuitest_coverage["build/dom-core/dom-core.js"].coveredLines = 113;
_yuitest_coverage["build/dom-core/dom-core.js"].coveredFunctions = 20;
_yuitest_coverline("build/dom-core/dom-core.js", 1);
YUI.add('dom-core', function (Y, NAME) {

_yuitest_coverfunc("build/dom-core/dom-core.js", "(anonymous 1)", 1);
_yuitest_coverline("build/dom-core/dom-core.js", 3);
var NODE_TYPE = 'nodeType',
    OWNER_DOCUMENT = 'ownerDocument',
    DOCUMENT_ELEMENT = 'documentElement',
    DEFAULT_VIEW = 'defaultView',
    PARENT_WINDOW = 'parentWindow',
    TAG_NAME = 'tagName',
    PARENT_NODE = 'parentNode',
    PREVIOUS_SIBLING = 'previousSibling',
    NEXT_SIBLING = 'nextSibling',
    CONTAINS = 'contains',
    COMPARE_DOCUMENT_POSITION = 'compareDocumentPosition',
    EMPTY_ARRAY = [],
    
    // IE < 8 throws on node.contains(textNode)
    supportsContainsTextNode = (function() {
        _yuitest_coverfunc("build/dom-core/dom-core.js", "(anonymous 2)", 17);
_yuitest_coverline("build/dom-core/dom-core.js", 18);
var node = Y.config.doc.createElement('div'),
            textNode = node.appendChild(Y.config.doc.createTextNode('')),
            result = false;
        
        _yuitest_coverline("build/dom-core/dom-core.js", 22);
try {
            _yuitest_coverline("build/dom-core/dom-core.js", 23);
result = node.contains(textNode);
        } catch(e) {}

        _yuitest_coverline("build/dom-core/dom-core.js", 26);
return result;
    })(),

/** 
 * The DOM utility provides a cross-browser abtraction layer
 * normalizing DOM tasks, and adds extra helper functionality
 * for other common tasks. 
 * @module dom
 * @main dom
 * @submodule dom-base
 * @for DOM
 *
 */

/**
 * Provides DOM helper methods.
 * @class DOM
 *
 */
    
Y_DOM = {
    /**
     * Returns the HTMLElement with the given ID (Wrapper for document.getElementById).
     * @method byId         
     * @param {String} id the id attribute 
     * @param {Object} doc optional The document to search. Defaults to current document 
     * @return {HTMLElement | null} The HTMLElement with the id, or null if none found. 
     */
    byId: function(id, doc) {
        // handle dupe IDs and IE name collision
        _yuitest_coverfunc("build/dom-core/dom-core.js", "byId", 54);
_yuitest_coverline("build/dom-core/dom-core.js", 56);
return Y_DOM.allById(id, doc)[0] || null;
    },

    getId: function(node) {
        _yuitest_coverfunc("build/dom-core/dom-core.js", "getId", 59);
_yuitest_coverline("build/dom-core/dom-core.js", 60);
var id;
        // HTMLElement returned from FORM when INPUT name === "id"
        // IE < 8: HTMLCollection returned when INPUT id === "id"
        // via both getAttribute and form.id 
        _yuitest_coverline("build/dom-core/dom-core.js", 64);
if (node.id && !node.id.tagName && !node.id.item) {
            _yuitest_coverline("build/dom-core/dom-core.js", 65);
id = node.id;
        } else {_yuitest_coverline("build/dom-core/dom-core.js", 66);
if (node.attributes && node.attributes.id) {
            _yuitest_coverline("build/dom-core/dom-core.js", 67);
id = node.attributes.id.value;
        }}

        _yuitest_coverline("build/dom-core/dom-core.js", 70);
return id;
    },

    setId: function(node, id) {
        _yuitest_coverfunc("build/dom-core/dom-core.js", "setId", 73);
_yuitest_coverline("build/dom-core/dom-core.js", 74);
if (node.setAttribute) {
            _yuitest_coverline("build/dom-core/dom-core.js", 75);
node.setAttribute('id', id);
        } else {
            _yuitest_coverline("build/dom-core/dom-core.js", 77);
node.id = id;
        }
    },

    /*
     * Finds the ancestor of the element.
     * @method ancestor
     * @param {HTMLElement} element The html element.
     * @param {Function} fn optional An optional boolean test to apply.
     * The optional function is passed the current DOM node being tested as its only argument.
     * If no function is given, the parentNode is returned.
     * @param {Boolean} testSelf optional Whether or not to include the element in the scan 
     * @return {HTMLElement | null} The matching DOM node or null if none found. 
     */
    ancestor: function(element, fn, testSelf, stopFn) {
        _yuitest_coverfunc("build/dom-core/dom-core.js", "ancestor", 91);
_yuitest_coverline("build/dom-core/dom-core.js", 92);
var ret = null;
        _yuitest_coverline("build/dom-core/dom-core.js", 93);
if (testSelf) {
            _yuitest_coverline("build/dom-core/dom-core.js", 94);
ret = (!fn || fn(element)) ? element : null;

        }
        _yuitest_coverline("build/dom-core/dom-core.js", 97);
return ret || Y_DOM.elementByAxis(element, PARENT_NODE, fn, null, stopFn);
    },

    /*
     * Finds the ancestors of the element.
     * @method ancestors
     * @param {HTMLElement} element The html element.
     * @param {Function} fn optional An optional boolean test to apply.
     * The optional function is passed the current DOM node being tested as its only argument.
     * If no function is given, all ancestors are returned.
     * @param {Boolean} testSelf optional Whether or not to include the element in the scan 
     * @return {Array} An array containing all matching DOM nodes.
     */
    ancestors: function(element, fn, testSelf, stopFn) {
        _yuitest_coverfunc("build/dom-core/dom-core.js", "ancestors", 110);
_yuitest_coverline("build/dom-core/dom-core.js", 111);
var ancestor = element,
            ret = [];

        _yuitest_coverline("build/dom-core/dom-core.js", 114);
while ((ancestor = Y_DOM.ancestor(ancestor, fn, testSelf, stopFn))) {
            _yuitest_coverline("build/dom-core/dom-core.js", 115);
testSelf = false;
            _yuitest_coverline("build/dom-core/dom-core.js", 116);
if (ancestor) {
                _yuitest_coverline("build/dom-core/dom-core.js", 117);
ret.unshift(ancestor);

                _yuitest_coverline("build/dom-core/dom-core.js", 119);
if (stopFn && stopFn(ancestor)) {
                    _yuitest_coverline("build/dom-core/dom-core.js", 120);
return ret;
                }
            }
        }

        _yuitest_coverline("build/dom-core/dom-core.js", 125);
return ret;
    },

    /**
     * Searches the element by the given axis for the first matching element.
     * @method elementByAxis
     * @param {HTMLElement} element The html element.
     * @param {String} axis The axis to search (parentNode, nextSibling, previousSibling).
     * @param {Function} fn optional An optional boolean test to apply.
     * @param {Boolean} all optional Whether all node types should be returned, or just element nodes.
     * The optional function is passed the current HTMLElement being tested as its only argument.
     * If no function is given, the first element is returned.
     * @return {HTMLElement | null} The matching element or null if none found.
     */
    elementByAxis: function(element, axis, fn, all, stopAt) {
        _yuitest_coverfunc("build/dom-core/dom-core.js", "elementByAxis", 139);
_yuitest_coverline("build/dom-core/dom-core.js", 140);
while (element && (element = element[axis])) { // NOTE: assignment
                _yuitest_coverline("build/dom-core/dom-core.js", 141);
if ( (all || element[TAG_NAME]) && (!fn || fn(element)) ) {
                    _yuitest_coverline("build/dom-core/dom-core.js", 142);
return element;
                }

                _yuitest_coverline("build/dom-core/dom-core.js", 145);
if (stopAt && stopAt(element)) {
                    _yuitest_coverline("build/dom-core/dom-core.js", 146);
return null;
                }
        }
        _yuitest_coverline("build/dom-core/dom-core.js", 149);
return null;
    },

    /**
     * Determines whether or not one HTMLElement is or contains another HTMLElement.
     * @method contains
     * @param {HTMLElement} element The containing html element.
     * @param {HTMLElement} needle The html element that may be contained.
     * @return {Boolean} Whether or not the element is or contains the needle.
     */
    contains: function(element, needle) {
        _yuitest_coverfunc("build/dom-core/dom-core.js", "contains", 159);
_yuitest_coverline("build/dom-core/dom-core.js", 160);
var ret = false;

        _yuitest_coverline("build/dom-core/dom-core.js", 162);
if ( !needle || !element || !needle[NODE_TYPE] || !element[NODE_TYPE]) {
            _yuitest_coverline("build/dom-core/dom-core.js", 163);
ret = false;
        } else {_yuitest_coverline("build/dom-core/dom-core.js", 164);
if (element[CONTAINS] &&
                // IE < 8 throws on node.contains(textNode) so fall back to brute.
                // Falling back for other nodeTypes as well.
                (needle[NODE_TYPE] === 1 || supportsContainsTextNode)) {
                _yuitest_coverline("build/dom-core/dom-core.js", 168);
ret = element[CONTAINS](needle);
        } else {_yuitest_coverline("build/dom-core/dom-core.js", 169);
if (element[COMPARE_DOCUMENT_POSITION]) {
            // Match contains behavior (node.contains(node) === true).
            // Needed for Firefox < 4.
            _yuitest_coverline("build/dom-core/dom-core.js", 172);
if (element === needle || !!(element[COMPARE_DOCUMENT_POSITION](needle) & 16)) { 
                _yuitest_coverline("build/dom-core/dom-core.js", 173);
ret = true;
            }
        } else {
            _yuitest_coverline("build/dom-core/dom-core.js", 176);
ret = Y_DOM._bruteContains(element, needle);
        }}}

        _yuitest_coverline("build/dom-core/dom-core.js", 179);
return ret;
    },

    /**
     * Determines whether or not the HTMLElement is part of the document.
     * @method inDoc
     * @param {HTMLElement} element The containing html element.
     * @param {HTMLElement} doc optional The document to check.
     * @return {Boolean} Whether or not the element is attached to the document. 
     */
    inDoc: function(element, doc) {
        _yuitest_coverfunc("build/dom-core/dom-core.js", "inDoc", 189);
_yuitest_coverline("build/dom-core/dom-core.js", 190);
var ret = false,
            rootNode;

        _yuitest_coverline("build/dom-core/dom-core.js", 193);
if (element && element.nodeType) {
            _yuitest_coverline("build/dom-core/dom-core.js", 194);
(doc) || (doc = element[OWNER_DOCUMENT]);

            _yuitest_coverline("build/dom-core/dom-core.js", 196);
rootNode = doc[DOCUMENT_ELEMENT];

            // contains only works with HTML_ELEMENT
            _yuitest_coverline("build/dom-core/dom-core.js", 199);
if (rootNode && rootNode.contains && element.tagName) {
                _yuitest_coverline("build/dom-core/dom-core.js", 200);
ret = rootNode.contains(element);
            } else {
                _yuitest_coverline("build/dom-core/dom-core.js", 202);
ret = Y_DOM.contains(rootNode, element);
            }
        }

        _yuitest_coverline("build/dom-core/dom-core.js", 206);
return ret;

    },

   allById: function(id, root) {
        _yuitest_coverfunc("build/dom-core/dom-core.js", "allById", 210);
_yuitest_coverline("build/dom-core/dom-core.js", 211);
root = root || Y.config.doc;
        _yuitest_coverline("build/dom-core/dom-core.js", 212);
var nodes = [],
            ret = [],
            i,
            node;

        _yuitest_coverline("build/dom-core/dom-core.js", 217);
if (root.querySelectorAll) {
            _yuitest_coverline("build/dom-core/dom-core.js", 218);
ret = root.querySelectorAll('[id="' + id + '"]');
        } else {_yuitest_coverline("build/dom-core/dom-core.js", 219);
if (root.all) {
            _yuitest_coverline("build/dom-core/dom-core.js", 220);
nodes = root.all(id);

            _yuitest_coverline("build/dom-core/dom-core.js", 222);
if (nodes) {
                // root.all may return HTMLElement or HTMLCollection.
                // some elements are also HTMLCollection (FORM, SELECT).
                _yuitest_coverline("build/dom-core/dom-core.js", 225);
if (nodes.nodeName) {
                    _yuitest_coverline("build/dom-core/dom-core.js", 226);
if (nodes.id === id) { // avoid false positive on name
                        _yuitest_coverline("build/dom-core/dom-core.js", 227);
ret.push(nodes);
                        _yuitest_coverline("build/dom-core/dom-core.js", 228);
nodes = EMPTY_ARRAY; // done, no need to filter
                    } else { //  prep for filtering
                        _yuitest_coverline("build/dom-core/dom-core.js", 230);
nodes = [nodes];
                    }
                }

                _yuitest_coverline("build/dom-core/dom-core.js", 234);
if (nodes.length) {
                    // filter out matches on node.name
                    // and element.id as reference to element with id === 'id'
                    _yuitest_coverline("build/dom-core/dom-core.js", 237);
for (i = 0; node = nodes[i++];) {
                        _yuitest_coverline("build/dom-core/dom-core.js", 238);
if (node.id === id  || 
                                (node.attributes && node.attributes.id &&
                                node.attributes.id.value === id)) { 
                            _yuitest_coverline("build/dom-core/dom-core.js", 241);
ret.push(node);
                        }
                    }
                }
            }
        } else {
            _yuitest_coverline("build/dom-core/dom-core.js", 247);
ret = [Y_DOM._getDoc(root).getElementById(id)];
        }}
    
        _yuitest_coverline("build/dom-core/dom-core.js", 250);
return ret;
   },


    isWindow: function(obj) {
        _yuitest_coverfunc("build/dom-core/dom-core.js", "isWindow", 254);
_yuitest_coverline("build/dom-core/dom-core.js", 255);
return !!(obj && obj.scrollTo && obj.document);
    },

    _removeChildNodes: function(node) {
        _yuitest_coverfunc("build/dom-core/dom-core.js", "_removeChildNodes", 258);
_yuitest_coverline("build/dom-core/dom-core.js", 259);
while (node.firstChild) {
            _yuitest_coverline("build/dom-core/dom-core.js", 260);
node.removeChild(node.firstChild);
        }
    },

    siblings: function(node, fn) {
        _yuitest_coverfunc("build/dom-core/dom-core.js", "siblings", 264);
_yuitest_coverline("build/dom-core/dom-core.js", 265);
var nodes = [],
            sibling = node;

        _yuitest_coverline("build/dom-core/dom-core.js", 268);
while ((sibling = sibling[PREVIOUS_SIBLING])) {
            _yuitest_coverline("build/dom-core/dom-core.js", 269);
if (sibling[TAG_NAME] && (!fn || fn(sibling))) {
                _yuitest_coverline("build/dom-core/dom-core.js", 270);
nodes.unshift(sibling);
            }
        }

        _yuitest_coverline("build/dom-core/dom-core.js", 274);
sibling = node;
        _yuitest_coverline("build/dom-core/dom-core.js", 275);
while ((sibling = sibling[NEXT_SIBLING])) {
            _yuitest_coverline("build/dom-core/dom-core.js", 276);
if (sibling[TAG_NAME] && (!fn || fn(sibling))) {
                _yuitest_coverline("build/dom-core/dom-core.js", 277);
nodes.push(sibling);
            }
        }

        _yuitest_coverline("build/dom-core/dom-core.js", 281);
return nodes;
    },

    /**
     * Brute force version of contains.
     * Used for browsers without contains support for non-HTMLElement Nodes (textNodes, etc).
     * @method _bruteContains
     * @private
     * @param {HTMLElement} element The containing html element.
     * @param {HTMLElement} needle The html element that may be contained.
     * @return {Boolean} Whether or not the element is or contains the needle.
     */
    _bruteContains: function(element, needle) {
        _yuitest_coverfunc("build/dom-core/dom-core.js", "_bruteContains", 293);
_yuitest_coverline("build/dom-core/dom-core.js", 294);
while (needle) {
            _yuitest_coverline("build/dom-core/dom-core.js", 295);
if (element === needle) {
                _yuitest_coverline("build/dom-core/dom-core.js", 296);
return true;
            }
            _yuitest_coverline("build/dom-core/dom-core.js", 298);
needle = needle.parentNode;
        }
        _yuitest_coverline("build/dom-core/dom-core.js", 300);
return false;
    },

// TODO: move to Lang?
    /**
     * Memoizes dynamic regular expressions to boost runtime performance. 
     * @method _getRegExp
     * @private
     * @param {String} str The string to convert to a regular expression.
     * @param {String} flags optional An optinal string of flags.
     * @return {RegExp} An instance of RegExp
     */
    _getRegExp: function(str, flags) {
        _yuitest_coverfunc("build/dom-core/dom-core.js", "_getRegExp", 312);
_yuitest_coverline("build/dom-core/dom-core.js", 313);
flags = flags || '';
        _yuitest_coverline("build/dom-core/dom-core.js", 314);
Y_DOM._regexCache = Y_DOM._regexCache || {};
        _yuitest_coverline("build/dom-core/dom-core.js", 315);
if (!Y_DOM._regexCache[str + flags]) {
            _yuitest_coverline("build/dom-core/dom-core.js", 316);
Y_DOM._regexCache[str + flags] = new RegExp(str, flags);
        }
        _yuitest_coverline("build/dom-core/dom-core.js", 318);
return Y_DOM._regexCache[str + flags];
    },

// TODO: make getDoc/Win true privates?
    /**
     * returns the appropriate document.
     * @method _getDoc
     * @private
     * @param {HTMLElement} element optional Target element.
     * @return {Object} The document for the given element or the default document. 
     */
    _getDoc: function(element) {
        _yuitest_coverfunc("build/dom-core/dom-core.js", "_getDoc", 329);
_yuitest_coverline("build/dom-core/dom-core.js", 330);
var doc = Y.config.doc;
        _yuitest_coverline("build/dom-core/dom-core.js", 331);
if (element) {
            _yuitest_coverline("build/dom-core/dom-core.js", 332);
doc = (element[NODE_TYPE] === 9) ? element : // element === document
                element[OWNER_DOCUMENT] || // element === DOM node
                element.document || // element === window
                Y.config.doc; // default
        }

        _yuitest_coverline("build/dom-core/dom-core.js", 338);
return doc;
    },

    /**
     * returns the appropriate window.
     * @method _getWin
     * @private
     * @param {HTMLElement} element optional Target element.
     * @return {Object} The window for the given element or the default window. 
     */
    _getWin: function(element) {
        _yuitest_coverfunc("build/dom-core/dom-core.js", "_getWin", 348);
_yuitest_coverline("build/dom-core/dom-core.js", 349);
var doc = Y_DOM._getDoc(element);
        _yuitest_coverline("build/dom-core/dom-core.js", 350);
return doc[DEFAULT_VIEW] || doc[PARENT_WINDOW] || Y.config.win;
    },

    _batch: function(nodes, fn, arg1, arg2, arg3, etc) {
        _yuitest_coverfunc("build/dom-core/dom-core.js", "_batch", 353);
_yuitest_coverline("build/dom-core/dom-core.js", 354);
fn = (typeof fn === 'string') ? Y_DOM[fn] : fn;
        _yuitest_coverline("build/dom-core/dom-core.js", 355);
var result,
            i = 0,
            node,
            ret;

        _yuitest_coverline("build/dom-core/dom-core.js", 360);
if (fn && nodes) {
            _yuitest_coverline("build/dom-core/dom-core.js", 361);
while ((node = nodes[i++])) {
                _yuitest_coverline("build/dom-core/dom-core.js", 362);
result = result = fn.call(Y_DOM, node, arg1, arg2, arg3, etc);
                _yuitest_coverline("build/dom-core/dom-core.js", 363);
if (typeof result !== 'undefined') {
                    _yuitest_coverline("build/dom-core/dom-core.js", 364);
(ret) || (ret = []);
                    _yuitest_coverline("build/dom-core/dom-core.js", 365);
ret.push(result);
                }
            }
        }

        _yuitest_coverline("build/dom-core/dom-core.js", 370);
return (typeof ret !== 'undefined') ? ret : nodes;
    },

    generateID: function(el) {
        _yuitest_coverfunc("build/dom-core/dom-core.js", "generateID", 373);
_yuitest_coverline("build/dom-core/dom-core.js", 374);
var id = el.id;

        _yuitest_coverline("build/dom-core/dom-core.js", 376);
if (!id) {
            _yuitest_coverline("build/dom-core/dom-core.js", 377);
id = Y.stamp(el);
            _yuitest_coverline("build/dom-core/dom-core.js", 378);
el.id = id; 
        }   

        _yuitest_coverline("build/dom-core/dom-core.js", 381);
return id; 
    }
};


_yuitest_coverline("build/dom-core/dom-core.js", 386);
Y.DOM = Y_DOM;


}, '3.7.3', {"requires": ["oop", "features"]});
