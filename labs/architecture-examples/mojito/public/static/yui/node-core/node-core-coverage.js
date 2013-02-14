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
_yuitest_coverage["build/node-core/node-core.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/node-core/node-core.js",
    code: []
};
_yuitest_coverage["build/node-core/node-core.js"].code=["YUI.add('node-core', function (Y, NAME) {","","/**"," * The Node Utility provides a DOM-like interface for interacting with DOM nodes."," * @module node"," * @main node"," * @submodule node-core"," */","","/**"," * The Node class provides a wrapper for manipulating DOM Nodes."," * Node properties can be accessed via the set/get methods."," * Use `Y.one()` to retrieve Node instances."," *"," * <strong>NOTE:</strong> Node properties are accessed using"," * the <code>set</code> and <code>get</code> methods."," *"," * @class Node"," * @constructor"," * @param {DOMNode} node the DOM node to be mapped to the Node instance."," * @uses EventTarget"," */","","// \"globals\"","var DOT = '.',","    NODE_NAME = 'nodeName',","    NODE_TYPE = 'nodeType',","    OWNER_DOCUMENT = 'ownerDocument',","    TAG_NAME = 'tagName',","    UID = '_yuid',","    EMPTY_OBJ = {},","","    _slice = Array.prototype.slice,","","    Y_DOM = Y.DOM,","","    Y_Node = function(node) {","        if (!this.getDOMNode) { // support optional \"new\"","            return new Y_Node(node);","        }","","        if (typeof node == 'string') {","            node = Y_Node._fromString(node);","            if (!node) {","                return null; // NOTE: return","            }","        }","","        var uid = (node.nodeType !== 9) ? node.uniqueID : node[UID];","","        if (uid && Y_Node._instances[uid] && Y_Node._instances[uid]._node !== node) {","            node[UID] = null; // unset existing uid to prevent collision (via clone or hack)","        }","","        uid = uid || Y.stamp(node);","        if (!uid) { // stamp failed; likely IE non-HTMLElement","            uid = Y.guid();","        }","","        this[UID] = uid;","","        /**","         * The underlying DOM node bound to the Y.Node instance","         * @property _node","         * @type DOMNode","         * @private","         */","        this._node = node;","","        this._stateProxy = node; // when augmented with Attribute","","        if (this._initPlugins) { // when augmented with Plugin.Host","            this._initPlugins();","        }","    },","","    // used with previous/next/ancestor tests","    _wrapFn = function(fn) {","        var ret = null;","        if (fn) {","            ret = (typeof fn == 'string') ?","            function(n) {","                return Y.Selector.test(n, fn);","            } :","            function(n) {","                return fn(Y.one(n));","            };","        }","","        return ret;","    };","// end \"globals\"","","Y_Node.ATTRS = {};","Y_Node.DOM_EVENTS = {};","","Y_Node._fromString = function(node) {","    if (node) {","        if (node.indexOf('doc') === 0) { // doc OR document","            node = Y.config.doc;","        } else if (node.indexOf('win') === 0) { // win OR window","            node = Y.config.win;","        } else {","            node = Y.Selector.query(node, null, true);","        }","    }","","    return node || null;","};","","/**"," * The name of the component"," * @static"," * @type String"," * @property NAME"," */","Y_Node.NAME = 'node';","","/*"," * The pattern used to identify ARIA attributes"," */","Y_Node.re_aria = /^(?:role$|aria-)/;","","Y_Node.SHOW_TRANSITION = 'fadeIn';","Y_Node.HIDE_TRANSITION = 'fadeOut';","","/**"," * A list of Node instances that have been created"," * @private"," * @type Object"," * @property _instances"," * @static"," *"," */","Y_Node._instances = {};","","/**"," * Retrieves the DOM node bound to a Node instance"," * @method getDOMNode"," * @static"," *"," * @param {Node | HTMLNode} node The Node instance or an HTMLNode"," * @return {HTMLNode} The DOM node bound to the Node instance.  If a DOM node is passed"," * as the node argument, it is simply returned."," */","Y_Node.getDOMNode = function(node) {","    if (node) {","        return (node.nodeType) ? node : node._node || null;","    }","    return null;","};","","/**"," * Checks Node return values and wraps DOM Nodes as Y.Node instances"," * and DOM Collections / Arrays as Y.NodeList instances."," * Other return values just pass thru.  If undefined is returned (e.g. no return)"," * then the Node instance is returned for chainability."," * @method scrubVal"," * @static"," *"," * @param {any} node The Node instance or an HTMLNode"," * @return {Node | NodeList | Any} Depends on what is returned from the DOM node."," */","Y_Node.scrubVal = function(val, node) {","    if (val) { // only truthy values are risky","         if (typeof val == 'object' || typeof val == 'function') { // safari nodeList === function","            if (NODE_TYPE in val || Y_DOM.isWindow(val)) {// node || window","                val = Y.one(val);","            } else if ((val.item && !val._nodes) || // dom collection or Node instance","                    (val[0] && val[0][NODE_TYPE])) { // array of DOM Nodes","                val = Y.all(val);","            }","        }","    } else if (typeof val === 'undefined') {","        val = node; // for chaining","    } else if (val === null) {","        val = null; // IE: DOM null not the same as null","    }","","    return val;","};","","/**"," * Adds methods to the Y.Node prototype, routing through scrubVal."," * @method addMethod"," * @static"," *"," * @param {String} name The name of the method to add"," * @param {Function} fn The function that becomes the method"," * @param {Object} context An optional context to call the method with"," * (defaults to the Node instance)"," * @return {any} Depends on what is returned from the DOM node."," */","Y_Node.addMethod = function(name, fn, context) {","    if (name && fn && typeof fn == 'function') {","        Y_Node.prototype[name] = function() {","            var args = _slice.call(arguments),","                node = this,","                ret;","","            if (args[0] && args[0]._node) {","                args[0] = args[0]._node;","            }","","            if (args[1] && args[1]._node) {","                args[1] = args[1]._node;","            }","            args.unshift(node._node);","","            ret = fn.apply(node, args);","","            if (ret) { // scrub truthy","                ret = Y_Node.scrubVal(ret, node);","            }","","            (typeof ret != 'undefined') || (ret = node);","            return ret;","        };","    } else {","    }","};","","/**"," * Imports utility methods to be added as Y.Node methods."," * @method importMethod"," * @static"," *"," * @param {Object} host The object that contains the method to import."," * @param {String} name The name of the method to import"," * @param {String} altName An optional name to use in place of the host name"," * @param {Object} context An optional context to call the method with"," */","Y_Node.importMethod = function(host, name, altName) {","    if (typeof name == 'string') {","        altName = altName || name;","        Y_Node.addMethod(altName, host[name], host);","    } else {","        Y.Array.each(name, function(n) {","            Y_Node.importMethod(host, n);","        });","    }","};","","/**"," * Retrieves a NodeList based on the given CSS selector."," * @method all"," *"," * @param {string} selector The CSS selector to test against."," * @return {NodeList} A NodeList instance for the matching HTMLCollection/Array."," * @for YUI"," */","","/**"," * Returns a single Node instance bound to the node or the"," * first element matching the given selector. Returns null if no match found."," * <strong>Note:</strong> For chaining purposes you may want to"," * use <code>Y.all</code>, which returns a NodeList when no match is found."," * @method one"," * @param {String | HTMLElement} node a node or Selector"," * @return {Node | null} a Node instance or null if no match found."," * @for YUI"," */","","/**"," * Returns a single Node instance bound to the node or the"," * first element matching the given selector. Returns null if no match found."," * <strong>Note:</strong> For chaining purposes you may want to"," * use <code>Y.all</code>, which returns a NodeList when no match is found."," * @method one"," * @static"," * @param {String | HTMLElement} node a node or Selector"," * @return {Node | null} a Node instance or null if no match found."," * @for Node"," */","Y_Node.one = function(node) {","    var instance = null,","        cachedNode,","        uid;","","    if (node) {","        if (typeof node == 'string') {","            node = Y_Node._fromString(node);","            if (!node) {","                return null; // NOTE: return","            }","        } else if (node.getDOMNode) {","            return node; // NOTE: return","        }","","        if (node.nodeType || Y.DOM.isWindow(node)) { // avoid bad input (numbers, boolean, etc)","            uid = (node.uniqueID && node.nodeType !== 9) ? node.uniqueID : node._yuid;","            instance = Y_Node._instances[uid]; // reuse exising instances","            cachedNode = instance ? instance._node : null;","            if (!instance || (cachedNode && node !== cachedNode)) { // new Node when nodes don't match","                instance = new Y_Node(node);","                if (node.nodeType != 11) { // dont cache document fragment","                    Y_Node._instances[instance[UID]] = instance; // cache node","                }","            }","        }","    }","","    return instance;","};","","/**"," * The default setter for DOM properties"," * Called with instance context (this === the Node instance)"," * @method DEFAULT_SETTER"," * @static"," * @param {String} name The attribute/property being set"," * @param {any} val The value to be set"," * @return {any} The value"," */","Y_Node.DEFAULT_SETTER = function(name, val) {","    var node = this._stateProxy,","        strPath;","","    if (name.indexOf(DOT) > -1) {","        strPath = name;","        name = name.split(DOT);","        // only allow when defined on node","        Y.Object.setValue(node, name, val);","    } else if (typeof node[name] != 'undefined') { // pass thru DOM properties","        node[name] = val;","    }","","    return val;","};","","/**"," * The default getter for DOM properties"," * Called with instance context (this === the Node instance)"," * @method DEFAULT_GETTER"," * @static"," * @param {String} name The attribute/property to look up"," * @return {any} The current value"," */","Y_Node.DEFAULT_GETTER = function(name) {","    var node = this._stateProxy,","        val;","","    if (name.indexOf && name.indexOf(DOT) > -1) {","        val = Y.Object.getValue(node, name.split(DOT));","    } else if (typeof node[name] != 'undefined') { // pass thru from DOM","        val = node[name];","    }","","    return val;","};","","Y.mix(Y_Node.prototype, {","    DATA_PREFIX: 'data-',","","    /**","     * The method called when outputting Node instances as strings","     * @method toString","     * @return {String} A string representation of the Node instance","     */","    toString: function() {","        var str = this[UID] + ': not bound to a node',","            node = this._node,","            attrs, id, className;","","        if (node) {","            attrs = node.attributes;","            id = (attrs && attrs.id) ? node.getAttribute('id') : null;","            className = (attrs && attrs.className) ? node.getAttribute('className') : null;","            str = node[NODE_NAME];","","            if (id) {","                str += '#' + id;","            }","","            if (className) {","                str += '.' + className.replace(' ', '.');","            }","","            // TODO: add yuid?","            str += ' ' + this[UID];","        }","        return str;","    },","","    /**","     * Returns an attribute value on the Node instance.","     * Unless pre-configured (via `Node.ATTRS`), get hands","     * off to the underlying DOM node.  Only valid","     * attributes/properties for the node will be queried.","     * @method get","     * @param {String} attr The attribute","     * @return {any} The current value of the attribute","     */","    get: function(attr) {","        var val;","","        if (this._getAttr) { // use Attribute imple","            val = this._getAttr(attr);","        } else {","            val = this._get(attr);","        }","","        if (val) {","            val = Y_Node.scrubVal(val, this);","        } else if (val === null) {","            val = null; // IE: DOM null is not true null (even though they ===)","        }","        return val;","    },","","    /**","     * Helper method for get.","     * @method _get","     * @private","     * @param {String} attr The attribute","     * @return {any} The current value of the attribute","     */","    _get: function(attr) {","        var attrConfig = Y_Node.ATTRS[attr],","            val;","","        if (attrConfig && attrConfig.getter) {","            val = attrConfig.getter.call(this);","        } else if (Y_Node.re_aria.test(attr)) {","            val = this._node.getAttribute(attr, 2);","        } else {","            val = Y_Node.DEFAULT_GETTER.apply(this, arguments);","        }","","        return val;","    },","","    /**","     * Sets an attribute on the Node instance.","     * Unless pre-configured (via Node.ATTRS), set hands","     * off to the underlying DOM node.  Only valid","     * attributes/properties for the node will be set.","     * To set custom attributes use setAttribute.","     * @method set","     * @param {String} attr The attribute to be set.","     * @param {any} val The value to set the attribute to.","     * @chainable","     */","    set: function(attr, val) {","        var attrConfig = Y_Node.ATTRS[attr];","","        if (this._setAttr) { // use Attribute imple","            this._setAttr.apply(this, arguments);","        } else { // use setters inline","            if (attrConfig && attrConfig.setter) {","                attrConfig.setter.call(this, val, attr);","            } else if (Y_Node.re_aria.test(attr)) { // special case Aria","                this._node.setAttribute(attr, val);","            } else {","                Y_Node.DEFAULT_SETTER.apply(this, arguments);","            }","        }","","        return this;","    },","","    /**","     * Sets multiple attributes.","     * @method setAttrs","     * @param {Object} attrMap an object of name/value pairs to set","     * @chainable","     */","    setAttrs: function(attrMap) {","        if (this._setAttrs) { // use Attribute imple","            this._setAttrs(attrMap);","        } else { // use setters inline","            Y.Object.each(attrMap, function(v, n) {","                this.set(n, v);","            }, this);","        }","","        return this;","    },","","    /**","     * Returns an object containing the values for the requested attributes.","     * @method getAttrs","     * @param {Array} attrs an array of attributes to get values","     * @return {Object} An object with attribute name/value pairs.","     */","    getAttrs: function(attrs) {","        var ret = {};","        if (this._getAttrs) { // use Attribute imple","            this._getAttrs(attrs);","        } else { // use setters inline","            Y.Array.each(attrs, function(v, n) {","                ret[v] = this.get(v);","            }, this);","        }","","        return ret;","    },","","    /**","     * Compares nodes to determine if they match.","     * Node instances can be compared to each other and/or HTMLElements.","     * @method compareTo","     * @param {HTMLElement | Node} refNode The reference node to compare to the node.","     * @return {Boolean} True if the nodes match, false if they do not.","     */","    compareTo: function(refNode) {","        var node = this._node;","","        if (refNode && refNode._node) {","            refNode = refNode._node;","        }","        return node === refNode;","    },","","    /**","     * Determines whether the node is appended to the document.","     * @method inDoc","     * @param {Node|HTMLElement} doc optional An optional document to check against.","     * Defaults to current document.","     * @return {Boolean} Whether or not this node is appended to the document.","     */","    inDoc: function(doc) {","        var node = this._node;","        doc = (doc) ? doc._node || doc : node[OWNER_DOCUMENT];","        if (doc.documentElement) {","            return Y_DOM.contains(doc.documentElement, node);","        }","    },","","    getById: function(id) {","        var node = this._node,","            ret = Y_DOM.byId(id, node[OWNER_DOCUMENT]);","        if (ret && Y_DOM.contains(node, ret)) {","            ret = Y.one(ret);","        } else {","            ret = null;","        }","        return ret;","    },","","   /**","     * Returns the nearest ancestor that passes the test applied by supplied boolean method.","     * @method ancestor","     * @param {String | Function} fn A selector string or boolean method for testing elements.","     * If a function is used, it receives the current node being tested as the only argument.","     * If fn is not passed as an argument, the parent node will be returned.","     * @param {Boolean} testSelf optional Whether or not to include the element in the scan","     * @param {String | Function} stopFn optional A selector string or boolean","     * method to indicate when the search should stop. The search bails when the function","     * returns true or the selector matches.","     * If a function is used, it receives the current node being tested as the only argument.","     * @return {Node} The matching Node instance or null if not found","     */","    ancestor: function(fn, testSelf, stopFn) {","        // testSelf is optional, check for stopFn as 2nd arg","        if (arguments.length === 2 &&","                (typeof testSelf == 'string' || typeof testSelf == 'function')) {","            stopFn = testSelf;","        }","","        return Y.one(Y_DOM.ancestor(this._node, _wrapFn(fn), testSelf, _wrapFn(stopFn)));","    },","","   /**","     * Returns the ancestors that pass the test applied by supplied boolean method.","     * @method ancestors","     * @param {String | Function} fn A selector string or boolean method for testing elements.","     * @param {Boolean} testSelf optional Whether or not to include the element in the scan","     * If a function is used, it receives the current node being tested as the only argument.","     * @return {NodeList} A NodeList instance containing the matching elements","     */","    ancestors: function(fn, testSelf, stopFn) {","        if (arguments.length === 2 &&","                (typeof testSelf == 'string' || typeof testSelf == 'function')) {","            stopFn = testSelf;","        }","        return Y.all(Y_DOM.ancestors(this._node, _wrapFn(fn), testSelf, _wrapFn(stopFn)));","    },","","    /**","     * Returns the previous matching sibling.","     * Returns the nearest element node sibling if no method provided.","     * @method previous","     * @param {String | Function} fn A selector or boolean method for testing elements.","     * If a function is used, it receives the current node being tested as the only argument.","     * @return {Node} Node instance or null if not found","     */","    previous: function(fn, all) {","        return Y.one(Y_DOM.elementByAxis(this._node, 'previousSibling', _wrapFn(fn), all));","    },","","    /**","     * Returns the next matching sibling.","     * Returns the nearest element node sibling if no method provided.","     * @method next","     * @param {String | Function} fn A selector or boolean method for testing elements.","     * If a function is used, it receives the current node being tested as the only argument.","     * @return {Node} Node instance or null if not found","     */","    next: function(fn, all) {","        return Y.one(Y_DOM.elementByAxis(this._node, 'nextSibling', _wrapFn(fn), all));","    },","","    /**","     * Returns all matching siblings.","     * Returns all siblings if no method provided.","     * @method siblings","     * @param {String | Function} fn A selector or boolean method for testing elements.","     * If a function is used, it receives the current node being tested as the only argument.","     * @return {NodeList} NodeList instance bound to found siblings","     */","    siblings: function(fn) {","        return Y.all(Y_DOM.siblings(this._node, _wrapFn(fn)));","    },","","    /**","     * Retrieves a Node instance of nodes based on the given CSS selector.","     * @method one","     *","     * @param {string} selector The CSS selector to test against.","     * @return {Node} A Node instance for the matching HTMLElement.","     */","    one: function(selector) {","        return Y.one(Y.Selector.query(selector, this._node, true));","    },","","    /**","     * Retrieves a NodeList based on the given CSS selector.","     * @method all","     *","     * @param {string} selector The CSS selector to test against.","     * @return {NodeList} A NodeList instance for the matching HTMLCollection/Array.","     */","    all: function(selector) {","        var nodelist = Y.all(Y.Selector.query(selector, this._node));","        nodelist._query = selector;","        nodelist._queryRoot = this._node;","        return nodelist;","    },","","    // TODO: allow fn test","    /**","     * Test if the supplied node matches the supplied selector.","     * @method test","     *","     * @param {string} selector The CSS selector to test against.","     * @return {boolean} Whether or not the node matches the selector.","     */","    test: function(selector) {","        return Y.Selector.test(this._node, selector);","    },","","    /**","     * Removes the node from its parent.","     * Shortcut for myNode.get('parentNode').removeChild(myNode);","     * @method remove","     * @param {Boolean} destroy whether or not to call destroy() on the node","     * after removal.","     * @chainable","     *","     */","    remove: function(destroy) {","        var node = this._node;","","        if (node && node.parentNode) {","            node.parentNode.removeChild(node);","        }","","        if (destroy) {","            this.destroy();","        }","","        return this;","    },","","    /**","     * Replace the node with the other node. This is a DOM update only","     * and does not change the node bound to the Node instance.","     * Shortcut for myNode.get('parentNode').replaceChild(newNode, myNode);","     * @method replace","     * @param {Node | HTMLNode} newNode Node to be inserted","     * @chainable","     *","     */","    replace: function(newNode) {","        var node = this._node;","        if (typeof newNode == 'string') {","            newNode = Y_Node.create(newNode);","        }","        node.parentNode.replaceChild(Y_Node.getDOMNode(newNode), node);","        return this;","    },","","    /**","     * @method replaceChild","     * @for Node","     * @param {String | HTMLElement | Node} node Node to be inserted","     * @param {HTMLElement | Node} refNode Node to be replaced","     * @return {Node} The replaced node","     */","    replaceChild: function(node, refNode) {","        if (typeof node == 'string') {","            node = Y_DOM.create(node);","        }","","        return Y.one(this._node.replaceChild(Y_Node.getDOMNode(node), Y_Node.getDOMNode(refNode)));","    },","","    /**","     * Nulls internal node references, removes any plugins and event listeners.","     * Note that destroy() will not remove the node from its parent or from the DOM. For that","     * functionality, call remove(true).","     * @method destroy","     * @param {Boolean} recursivePurge (optional) Whether or not to remove listeners from the","     * node's subtree (default is false)","     *","     */","    destroy: function(recursive) {","        var UID = Y.config.doc.uniqueID ? 'uniqueID' : '_yuid',","            instance;","","        this.purge(); // TODO: only remove events add via this Node","","        if (this.unplug) { // may not be a PluginHost","            this.unplug();","        }","","        this.clearData();","","        if (recursive) {","            Y.NodeList.each(this.all('*'), function(node) {","                instance = Y_Node._instances[node[UID]];","                if (instance) {","                   instance.destroy();","                } else { // purge in case added by other means","                    Y.Event.purgeElement(node);","                }","            });","        }","","        this._node = null;","        this._stateProxy = null;","","        delete Y_Node._instances[this._yuid];","    },","","    /**","     * Invokes a method on the Node instance","     * @method invoke","     * @param {String} method The name of the method to invoke","     * @param {Any}  a, b, c, etc. Arguments to invoke the method with.","     * @return Whatever the underly method returns.","     * DOM Nodes and Collections return values","     * are converted to Node/NodeList instances.","     *","     */","    invoke: function(method, a, b, c, d, e) {","        var node = this._node,","            ret;","","        if (a && a._node) {","            a = a._node;","        }","","        if (b && b._node) {","            b = b._node;","        }","","        ret = node[method](a, b, c, d, e);","        return Y_Node.scrubVal(ret, this);","    },","","    /**","    * @method swap","    * @description Swap DOM locations with the given node.","    * This does not change which DOM node each Node instance refers to.","    * @param {Node} otherNode The node to swap with","     * @chainable","    */","    swap: Y.config.doc.documentElement.swapNode ?","        function(otherNode) {","            this._node.swapNode(Y_Node.getDOMNode(otherNode));","        } :","        function(otherNode) {","            otherNode = Y_Node.getDOMNode(otherNode);","            var node = this._node,","                parent = otherNode.parentNode,","                nextSibling = otherNode.nextSibling;","","            if (nextSibling === node) {","                parent.insertBefore(node, otherNode);","            } else if (otherNode === node.nextSibling) {","                parent.insertBefore(otherNode, node);","            } else {","                node.parentNode.replaceChild(otherNode, node);","                Y_DOM.addHTML(parent, node, nextSibling);","            }","            return this;","        },","","","    hasMethod: function(method) {","        var node = this._node;","        return !!(node && method in node &&","                typeof node[method] != 'unknown' &&","            (typeof node[method] == 'function' ||","                String(node[method]).indexOf('function') === 1)); // IE reports as object, prepends space","    },","","    isFragment: function() {","        return (this.get('nodeType') === 11);","    },","","    /**","     * Removes and destroys all of the nodes within the node.","     * @method empty","     * @chainable","     */","    empty: function() {","        this.get('childNodes').remove().destroy(true);","        return this;","    },","","    /**","     * Returns the DOM node bound to the Node instance","     * @method getDOMNode","     * @return {DOMNode}","     */","    getDOMNode: function() {","        return this._node;","    }","}, true);","","Y.Node = Y_Node;","Y.one = Y_Node.one;","/**"," * The NodeList module provides support for managing collections of Nodes."," * @module node"," * @submodule node-core"," */","","/**"," * The NodeList class provides a wrapper for manipulating DOM NodeLists."," * NodeList properties can be accessed via the set/get methods."," * Use Y.all() to retrieve NodeList instances."," *"," * @class NodeList"," * @constructor"," * @param nodes {String|element|Node|Array} A selector, DOM element, Node, list of DOM elements, or list of Nodes with which to populate this NodeList."," */","","var NodeList = function(nodes) {","    var tmp = [];","","    if (nodes) {","        if (typeof nodes === 'string') { // selector query","            this._query = nodes;","            nodes = Y.Selector.query(nodes);","        } else if (nodes.nodeType || Y_DOM.isWindow(nodes)) { // domNode || window","            nodes = [nodes];","        } else if (nodes._node) { // Y.Node","            nodes = [nodes._node];","        } else if (nodes[0] && nodes[0]._node) { // allow array of Y.Nodes","            Y.Array.each(nodes, function(node) {","                if (node._node) {","                    tmp.push(node._node);","                }","            });","            nodes = tmp;","        } else { // array of domNodes or domNodeList (no mixed array of Y.Node/domNodes)","            nodes = Y.Array(nodes, 0, true);","        }","    }","","    /**","     * The underlying array of DOM nodes bound to the Y.NodeList instance","     * @property _nodes","     * @private","     */","    this._nodes = nodes || [];","};","","NodeList.NAME = 'NodeList';","","/**"," * Retrieves the DOM nodes bound to a NodeList instance"," * @method getDOMNodes"," * @static"," *"," * @param {NodeList} nodelist The NodeList instance"," * @return {Array} The array of DOM nodes bound to the NodeList"," */","NodeList.getDOMNodes = function(nodelist) {","    return (nodelist && nodelist._nodes) ? nodelist._nodes : nodelist;","};","","NodeList.each = function(instance, fn, context) {","    var nodes = instance._nodes;","    if (nodes && nodes.length) {","        Y.Array.each(nodes, fn, context || instance);","    } else {","    }","};","","NodeList.addMethod = function(name, fn, context) {","    if (name && fn) {","        NodeList.prototype[name] = function() {","            var ret = [],","                args = arguments;","","            Y.Array.each(this._nodes, function(node) {","                var UID = (node.uniqueID && node.nodeType !== 9 ) ? 'uniqueID' : '_yuid',","                    instance = Y.Node._instances[node[UID]],","                    ctx,","                    result;","","                if (!instance) {","                    instance = NodeList._getTempNode(node);","                }","                ctx = context || instance;","                result = fn.apply(ctx, args);","                if (result !== undefined && result !== instance) {","                    ret[ret.length] = result;","                }","            });","","            // TODO: remove tmp pointer","            return ret.length ? ret : this;","        };","    } else {","    }","};","","NodeList.importMethod = function(host, name, altName) {","    if (typeof name === 'string') {","        altName = altName || name;","        NodeList.addMethod(name, host[name]);","    } else {","        Y.Array.each(name, function(n) {","            NodeList.importMethod(host, n);","        });","    }","};","","NodeList._getTempNode = function(node) {","    var tmp = NodeList._tempNode;","    if (!tmp) {","        tmp = Y.Node.create('<div></div>');","        NodeList._tempNode = tmp;","    }","","    tmp._node = node;","    tmp._stateProxy = node;","    return tmp;","};","","Y.mix(NodeList.prototype, {","    _invoke: function(method, args, getter) {","        var ret = (getter) ? [] : this;","","        this.each(function(node) {","            var val = node[method].apply(node, args);","            if (getter) {","                ret.push(val);","            }","        });","","        return ret;","    },","","    /**","     * Retrieves the Node instance at the given index.","     * @method item","     *","     * @param {Number} index The index of the target Node.","     * @return {Node} The Node instance at the given index.","     */","    item: function(index) {","        return Y.one((this._nodes || [])[index]);","    },","","    /**","     * Applies the given function to each Node in the NodeList.","     * @method each","     * @param {Function} fn The function to apply. It receives 3 arguments:","     * the current node instance, the node's index, and the NodeList instance","     * @param {Object} context optional An optional context to apply the function with","     * Default context is the current Node instance","     * @chainable","     */","    each: function(fn, context) {","        var instance = this;","        Y.Array.each(this._nodes, function(node, index) {","            node = Y.one(node);","            return fn.call(context || node, node, index, instance);","        });","        return instance;","    },","","    batch: function(fn, context) {","        var nodelist = this;","","        Y.Array.each(this._nodes, function(node, index) {","            var instance = Y.Node._instances[node[UID]];","            if (!instance) {","                instance = NodeList._getTempNode(node);","            }","","            return fn.call(context || instance, instance, index, nodelist);","        });","        return nodelist;","    },","","    /**","     * Executes the function once for each node until a true value is returned.","     * @method some","     * @param {Function} fn The function to apply. It receives 3 arguments:","     * the current node instance, the node's index, and the NodeList instance","     * @param {Object} context optional An optional context to execute the function from.","     * Default context is the current Node instance","     * @return {Boolean} Whether or not the function returned true for any node.","     */","    some: function(fn, context) {","        var instance = this;","        return Y.Array.some(this._nodes, function(node, index) {","            node = Y.one(node);","            context = context || node;","            return fn.call(context, node, index, instance);","        });","    },","","    /**","     * Creates a documenFragment from the nodes bound to the NodeList instance","     * @method toFrag","     * @return {Node} a Node instance bound to the documentFragment","     */","    toFrag: function() {","        return Y.one(Y.DOM._nl2frag(this._nodes));","    },","","    /**","     * Returns the index of the node in the NodeList instance","     * or -1 if the node isn't found.","     * @method indexOf","     * @param {Node | DOMNode} node the node to search for","     * @return {Int} the index of the node value or -1 if not found","     */","    indexOf: function(node) {","        return Y.Array.indexOf(this._nodes, Y.Node.getDOMNode(node));","    },","","    /**","     * Filters the NodeList instance down to only nodes matching the given selector.","     * @method filter","     * @param {String} selector The selector to filter against","     * @return {NodeList} NodeList containing the updated collection","     * @see Selector","     */","    filter: function(selector) {","        return Y.all(Y.Selector.filter(this._nodes, selector));","    },","","","    /**","     * Creates a new NodeList containing all nodes at every n indices, where","     * remainder n % index equals r.","     * (zero-based index).","     * @method modulus","     * @param {Int} n The offset to use (return every nth node)","     * @param {Int} r An optional remainder to use with the modulus operation (defaults to zero)","     * @return {NodeList} NodeList containing the updated collection","     */","    modulus: function(n, r) {","        r = r || 0;","        var nodes = [];","        NodeList.each(this, function(node, i) {","            if (i % n === r) {","                nodes.push(node);","            }","        });","","        return Y.all(nodes);","    },","","    /**","     * Creates a new NodeList containing all nodes at odd indices","     * (zero-based index).","     * @method odd","     * @return {NodeList} NodeList containing the updated collection","     */","    odd: function() {","        return this.modulus(2, 1);","    },","","    /**","     * Creates a new NodeList containing all nodes at even indices","     * (zero-based index), including zero.","     * @method even","     * @return {NodeList} NodeList containing the updated collection","     */","    even: function() {","        return this.modulus(2);","    },","","    destructor: function() {","    },","","    /**","     * Reruns the initial query, when created using a selector query","     * @method refresh","     * @chainable","     */","    refresh: function() {","        var doc,","            nodes = this._nodes,","            query = this._query,","            root = this._queryRoot;","","        if (query) {","            if (!root) {","                if (nodes && nodes[0] && nodes[0].ownerDocument) {","                    root = nodes[0].ownerDocument;","                }","            }","","            this._nodes = Y.Selector.query(query, root);","        }","","        return this;","    },","","    /**","     * Returns the current number of items in the NodeList.","     * @method size","     * @return {Int} The number of items in the NodeList.","     */","    size: function() {","        return this._nodes.length;","    },","","    /**","     * Determines if the instance is bound to any nodes","     * @method isEmpty","     * @return {Boolean} Whether or not the NodeList is bound to any nodes","     */","    isEmpty: function() {","        return this._nodes.length < 1;","    },","","    toString: function() {","        var str = '',","            errorMsg = this[UID] + ': not bound to any nodes',","            nodes = this._nodes,","            node;","","        if (nodes && nodes[0]) {","            node = nodes[0];","            str += node[NODE_NAME];","            if (node.id) {","                str += '#' + node.id;","            }","","            if (node.className) {","                str += '.' + node.className.replace(' ', '.');","            }","","            if (nodes.length > 1) {","                str += '...[' + nodes.length + ' items]';","            }","        }","        return str || errorMsg;","    },","","    /**","     * Returns the DOM node bound to the Node instance","     * @method getDOMNodes","     * @return {Array}","     */","    getDOMNodes: function() {","        return this._nodes;","    }","}, true);","","NodeList.importMethod(Y.Node.prototype, [","     /** ","      * Called on each Node instance. Nulls internal node references, ","      * removes any plugins and event listeners","      * @method destroy","      * @param {Boolean} recursivePurge (optional) Whether or not to ","      * remove listeners from the node's subtree (default is false)","      * @see Node.destroy","      */","    'destroy',","","     /** ","      * Called on each Node instance. Removes and destroys all of the nodes ","      * within the node","      * @method empty","      * @chainable","      * @see Node.empty","      */","    'empty',","","     /** ","      * Called on each Node instance. Removes the node from its parent.","      * Shortcut for myNode.get('parentNode').removeChild(myNode);","      * @method remove","      * @param {Boolean} destroy whether or not to call destroy() on the node","      * after removal.","      * @chainable","      * @see Node.remove","      */","    'remove',","","     /** ","      * Called on each Node instance. Sets an attribute on the Node instance.","      * Unless pre-configured (via Node.ATTRS), set hands","      * off to the underlying DOM node.  Only valid","      * attributes/properties for the node will be set.","      * To set custom attributes use setAttribute.","      * @method set","      * @param {String} attr The attribute to be set.","      * @param {any} val The value to set the attribute to.","      * @chainable","      * @see Node.set","      */","    'set'","]);","","// one-off implementation to convert array of Nodes to NodeList","// e.g. Y.all('input').get('parentNode');","","/** Called on each Node instance","  * @method get","  * @see Node","  */","NodeList.prototype.get = function(attr) {","    var ret = [],","        nodes = this._nodes,","        isNodeList = false,","        getTemp = NodeList._getTempNode,","        instance,","        val;","","    if (nodes[0]) {","        instance = Y.Node._instances[nodes[0]._yuid] || getTemp(nodes[0]);","        val = instance._get(attr);","        if (val && val.nodeType) {","            isNodeList = true;","        }","    }","","    Y.Array.each(nodes, function(node) {","        instance = Y.Node._instances[node._yuid];","","        if (!instance) {","            instance = getTemp(node);","        }","","        val = instance._get(attr);","        if (!isNodeList) { // convert array of Nodes to NodeList","            val = Y.Node.scrubVal(val, instance);","        }","","        ret.push(val);","    });","","    return (isNodeList) ? Y.all(ret) : ret;","};","","Y.NodeList = NodeList;","","Y.all = function(nodes) {","    return new NodeList(nodes);","};","","Y.Node.all = Y.all;","/**"," * @module node"," * @submodule node-core"," */","","var Y_NodeList = Y.NodeList,","    ArrayProto = Array.prototype,","    ArrayMethods = {","        /** Returns a new NodeList combining the given NodeList(s)","          * @for NodeList","          * @method concat","          * @param {NodeList | Array} valueN Arrays/NodeLists and/or values to","          * concatenate to the resulting NodeList","          * @return {NodeList} A new NodeList comprised of this NodeList joined with the input.","          */","        'concat': 1,","        /** Removes the last from the NodeList and returns it.","          * @for NodeList","          * @method pop","          * @return {Node} The last item in the NodeList.","          */","        'pop': 0,","        /** Adds the given Node(s) to the end of the NodeList.","          * @for NodeList","          * @method push","          * @param {Node | DOMNode} nodes One or more nodes to add to the end of the NodeList.","          */","        'push': 0,","        /** Removes the first item from the NodeList and returns it.","          * @for NodeList","          * @method shift","          * @return {Node} The first item in the NodeList.","          */","        'shift': 0,","        /** Returns a new NodeList comprising the Nodes in the given range.","          * @for NodeList","          * @method slice","          * @param {Number} begin Zero-based index at which to begin extraction.","          As a negative index, start indicates an offset from the end of the sequence. slice(-2) extracts the second-to-last element and the last element in the sequence.","          * @param {Number} end Zero-based index at which to end extraction. slice extracts up to but not including end.","          slice(1,4) extracts the second element through the fourth element (elements indexed 1, 2, and 3).","          As a negative index, end indicates an offset from the end of the sequence. slice(2,-1) extracts the third element through the second-to-last element in the sequence.","          If end is omitted, slice extracts to the end of the sequence.","          * @return {NodeList} A new NodeList comprised of this NodeList joined with the input.","          */","        'slice': 1,","        /** Changes the content of the NodeList, adding new elements while removing old elements.","          * @for NodeList","          * @method splice","          * @param {Number} index Index at which to start changing the array. If negative, will begin that many elements from the end.","          * @param {Number} howMany An integer indicating the number of old array elements to remove. If howMany is 0, no elements are removed. In this case, you should specify at least one new element. If no howMany parameter is specified (second syntax above, which is a SpiderMonkey extension), all elements after index are removed.","          * {Node | DOMNode| element1, ..., elementN","          The elements to add to the array. If you don't specify any elements, splice simply removes elements from the array.","          * @return {NodeList} The element(s) removed.","          */","        'splice': 1,","        /** Adds the given Node(s) to the beginning of the NodeList.","          * @for NodeList","          * @method unshift","          * @param {Node | DOMNode} nodes One or more nodes to add to the NodeList.","          */","        'unshift': 0","    };","","","Y.Object.each(ArrayMethods, function(returnNodeList, name) {","    Y_NodeList.prototype[name] = function() {","        var args = [],","            i = 0,","            arg,","            ret;","","        while (typeof (arg = arguments[i++]) != 'undefined') { // use DOM nodes/nodeLists","            args.push(arg._node || arg._nodes || arg);","        }","","        ret = ArrayProto[name].apply(this._nodes, args);","","        if (returnNodeList) {","            ret = Y.all(ret);","        } else {","            ret = Y.Node.scrubVal(ret);","        }","","        return ret;","    };","});","/**"," * @module node"," * @submodule node-core"," */","","Y.Array.each([","    /**","     * Passes through to DOM method.","     * @for Node","     * @method removeChild","     * @param {HTMLElement | Node} node Node to be removed","     * @return {Node} The removed node","     */","    'removeChild',","","    /**","     * Passes through to DOM method.","     * @method hasChildNodes","     * @return {Boolean} Whether or not the node has any childNodes","     */","    'hasChildNodes',","","    /**","     * Passes through to DOM method.","     * @method cloneNode","     * @param {Boolean} deep Whether or not to perform a deep clone, which includes","     * subtree and attributes","     * @return {Node} The clone","     */","    'cloneNode',","","    /**","     * Passes through to DOM method.","     * @method hasAttribute","     * @param {String} attribute The attribute to test for","     * @return {Boolean} Whether or not the attribute is present","     */","    'hasAttribute',","","    /**","     * Passes through to DOM method.","     * @method scrollIntoView","     * @chainable","     */","    'scrollIntoView',","","    /**","     * Passes through to DOM method.","     * @method getElementsByTagName","     * @param {String} tagName The tagName to collect","     * @return {NodeList} A NodeList representing the HTMLCollection","     */","    'getElementsByTagName',","","    /**","     * Passes through to DOM method.","     * @method focus","     * @chainable","     */","    'focus',","","    /**","     * Passes through to DOM method.","     * @method blur","     * @chainable","     */","    'blur',","","    /**","     * Passes through to DOM method.","     * Only valid on FORM elements","     * @method submit","     * @chainable","     */","    'submit',","","    /**","     * Passes through to DOM method.","     * Only valid on FORM elements","     * @method reset","     * @chainable","     */","    'reset',","","    /**","     * Passes through to DOM method.","     * @method select","     * @chainable","     */","     'select',","","    /**","     * Passes through to DOM method.","     * Only valid on TABLE elements","     * @method createCaption","     * @chainable","     */","    'createCaption'","","], function(method) {","    Y.Node.prototype[method] = function(arg1, arg2, arg3) {","        var ret = this.invoke(method, arg1, arg2, arg3);","        return ret;","    };","});","","/**"," * Passes through to DOM method."," * @method removeAttribute"," * @param {String} attribute The attribute to be removed"," * @chainable"," */"," // one-off implementation due to IE returning boolean, breaking chaining","Y.Node.prototype.removeAttribute = function(attr) {","    var node = this._node;","    if (node) {","        node.removeAttribute(attr, 0); // comma zero for IE < 8 to force case-insensitive","    }","","    return this;","};","","Y.Node.importMethod(Y.DOM, [","    /**","     * Determines whether the node is an ancestor of another HTML element in the DOM hierarchy.","     * @method contains","     * @param {Node | HTMLElement} needle The possible node or descendent","     * @return {Boolean} Whether or not this node is the needle its ancestor","     */","    'contains',","    /**","     * Allows setting attributes on DOM nodes, normalizing in some cases.","     * This passes through to the DOM node, allowing for custom attributes.","     * @method setAttribute","     * @for Node","     * @chainable","     * @param {string} name The attribute name","     * @param {string} value The value to set","     */","    'setAttribute',","    /**","     * Allows getting attributes on DOM nodes, normalizing in some cases.","     * This passes through to the DOM node, allowing for custom attributes.","     * @method getAttribute","     * @for Node","     * @param {string} name The attribute name","     * @return {string} The attribute value","     */","    'getAttribute',","","    /**","     * Wraps the given HTML around the node.","     * @method wrap","     * @param {String} html The markup to wrap around the node.","     * @chainable","     * @for Node","     */","    'wrap',","","    /**","     * Removes the node's parent node.","     * @method unwrap","     * @chainable","     */","    'unwrap',","","    /**","     * Applies a unique ID to the node if none exists","     * @method generateID","     * @return {String} The existing or generated ID","     */","    'generateID'","]);","","Y.NodeList.importMethod(Y.Node.prototype, [","/**"," * Allows getting attributes on DOM nodes, normalizing in some cases."," * This passes through to the DOM node, allowing for custom attributes."," * @method getAttribute"," * @see Node"," * @for NodeList"," * @param {string} name The attribute name"," * @return {string} The attribute value"," */","","    'getAttribute',","/**"," * Allows setting attributes on DOM nodes, normalizing in some cases."," * This passes through to the DOM node, allowing for custom attributes."," * @method setAttribute"," * @see Node"," * @for NodeList"," * @chainable"," * @param {string} name The attribute name"," * @param {string} value The value to set"," */","    'setAttribute',","","/**"," * Allows for removing attributes on DOM nodes."," * This passes through to the DOM node, allowing for custom attributes."," * @method removeAttribute"," * @see Node"," * @for NodeList"," * @param {string} name The attribute to remove"," */","    'removeAttribute',","/**"," * Removes the parent node from node in the list."," * @method unwrap"," * @chainable"," */","    'unwrap',","/**"," * Wraps the given HTML around each node."," * @method wrap"," * @param {String} html The markup to wrap around the node."," * @chainable"," */","    'wrap',","","/**"," * Applies a unique ID to each node if none exists"," * @method generateID"," * @return {String} The existing or generated ID"," */","    'generateID'","]);","","","}, '3.7.3', {\"requires\": [\"dom-core\", \"selector\"]});"];
_yuitest_coverage["build/node-core/node-core.js"].lines = {"1":0,"25":0,"38":0,"39":0,"42":0,"43":0,"44":0,"45":0,"49":0,"51":0,"52":0,"55":0,"56":0,"57":0,"60":0,"68":0,"70":0,"72":0,"73":0,"79":0,"80":0,"81":0,"83":0,"86":0,"90":0,"94":0,"95":0,"97":0,"98":0,"99":0,"100":0,"101":0,"102":0,"104":0,"108":0,"117":0,"122":0,"124":0,"125":0,"135":0,"146":0,"147":0,"148":0,"150":0,"164":0,"165":0,"166":0,"167":0,"168":0,"169":0,"171":0,"174":0,"175":0,"176":0,"177":0,"180":0,"194":0,"195":0,"196":0,"197":0,"201":0,"202":0,"205":0,"206":0,"208":0,"210":0,"212":0,"213":0,"216":0,"217":0,"233":0,"234":0,"235":0,"236":0,"238":0,"239":0,"275":0,"276":0,"280":0,"281":0,"282":0,"283":0,"284":0,"286":0,"287":0,"290":0,"291":0,"292":0,"293":0,"294":0,"295":0,"296":0,"297":0,"303":0,"315":0,"316":0,"319":0,"320":0,"321":0,"323":0,"324":0,"325":0,"328":0,"339":0,"340":0,"343":0,"344":0,"345":0,"346":0,"349":0,"352":0,"361":0,"365":0,"366":0,"367":0,"368":0,"369":0,"371":0,"372":0,"375":0,"376":0,"380":0,"382":0,"395":0,"397":0,"398":0,"400":0,"403":0,"404":0,"405":0,"406":0,"408":0,"419":0,"422":0,"423":0,"424":0,"425":0,"427":0,"430":0,"445":0,"447":0,"448":0,"450":0,"451":0,"452":0,"453":0,"455":0,"459":0,"469":0,"470":0,"472":0,"473":0,"477":0,"487":0,"488":0,"489":0,"491":0,"492":0,"496":0,"507":0,"509":0,"510":0,"512":0,"523":0,"524":0,"525":0,"526":0,"531":0,"533":0,"534":0,"536":0,"538":0,"556":0,"558":0,"561":0,"573":0,"575":0,"577":0,"589":0,"601":0,"613":0,"624":0,"635":0,"636":0,"637":0,"638":0,"650":0,"663":0,"665":0,"666":0,"669":0,"670":0,"673":0,"686":0,"687":0,"688":0,"690":0,"691":0,"702":0,"703":0,"706":0,"719":0,"722":0,"724":0,"725":0,"728":0,"730":0,"731":0,"732":0,"733":0,"734":0,"736":0,"741":0,"742":0,"744":0,"758":0,"761":0,"762":0,"765":0,"766":0,"769":0,"770":0,"782":0,"785":0,"786":0,"790":0,"791":0,"792":0,"793":0,"795":0,"796":0,"798":0,"803":0,"804":0,"811":0,"820":0,"821":0,"830":0,"834":0,"835":0,"852":0,"853":0,"855":0,"856":0,"857":0,"858":0,"859":0,"860":0,"861":0,"862":0,"863":0,"864":0,"865":0,"866":0,"869":0,"871":0,"880":0,"883":0,"893":0,"894":0,"897":0,"898":0,"899":0,"900":0,"905":0,"906":0,"907":0,"908":0,"911":0,"912":0,"917":0,"918":0,"920":0,"921":0,"922":0,"923":0,"928":0,"934":0,"935":0,"936":0,"937":0,"939":0,"940":0,"945":0,"946":0,"947":0,"948":0,"949":0,"952":0,"953":0,"954":0,"957":0,"959":0,"961":0,"962":0,"963":0,"964":0,"968":0,"979":0,"992":0,"993":0,"994":0,"995":0,"997":0,"1001":0,"1003":0,"1004":0,"1005":0,"1006":0,"1009":0,"1011":0,"1024":0,"1025":0,"1026":0,"1027":0,"1028":0,"1038":0,"1049":0,"1060":0,"1074":0,"1075":0,"1076":0,"1077":0,"1078":0,"1082":0,"1092":0,"1102":0,"1114":0,"1119":0,"1120":0,"1121":0,"1122":0,"1126":0,"1129":0,"1138":0,"1147":0,"1151":0,"1156":0,"1157":0,"1158":0,"1159":0,"1160":0,"1163":0,"1164":0,"1167":0,"1168":0,"1171":0,"1180":0,"1184":0,"1237":0,"1238":0,"1245":0,"1246":0,"1247":0,"1248":0,"1249":0,"1253":0,"1254":0,"1256":0,"1257":0,"1260":0,"1261":0,"1262":0,"1265":0,"1268":0,"1271":0,"1273":0,"1274":0,"1277":0,"1283":0,"1343":0,"1344":0,"1345":0,"1350":0,"1351":0,"1354":0,"1356":0,"1357":0,"1359":0,"1362":0,"1370":0,"1465":0,"1466":0,"1467":0,"1478":0,"1479":0,"1480":0,"1481":0,"1484":0,"1487":0,"1539":0};
_yuitest_coverage["build/node-core/node-core.js"].functions = {"Y_Node:37":0,"(anonymous 2):82":0,"}:85":0,"_wrapFn:78":0,"_fromString:97":0,"getDOMNode:146":0,"scrubVal:164":0,"]:196":0,"addMethod:194":0,"(anonymous 3):238":0,"importMethod:233":0,"one:275":0,"DEFAULT_SETTER:315":0,"DEFAULT_GETTER:339":0,"toString:360":0,"get:394":0,"_get:418":0,"set:444":0,"(anonymous 4):472":0,"setAttrs:468":0,"(anonymous 5):491":0,"getAttrs:486":0,"compareTo:506":0,"inDoc:522":0,"getById:530":0,"ancestor:554":0,"ancestors:572":0,"previous:588":0,"next:600":0,"siblings:612":0,"one:623":0,"all:634":0,"test:649":0,"remove:662":0,"replace:685":0,"replaceChild:701":0,"(anonymous 6):731":0,"destroy:718":0,"invoke:757":0,"(anonymous 7):781":0,"}:784":0,"hasMethod:802":0,"isFragment:810":0,"empty:819":0,"getDOMNode:829":0,"(anonymous 8):864":0,"NodeList:852":0,"getDOMNodes:893":0,"each:897":0,"(anonymous 9):911":0,"]:907":0,"addMethod:905":0,"(anonymous 10):939":0,"importMethod:934":0,"_getTempNode:945":0,"(anonymous 11):961":0,"_invoke:958":0,"item:978":0,"(anonymous 12):993":0,"each:991":0,"(anonymous 13):1003":0,"batch:1000":0,"(anonymous 14):1025":0,"some:1023":0,"toFrag:1037":0,"indexOf:1048":0,"filter:1059":0,"(anonymous 15):1076":0,"modulus:1073":0,"odd:1091":0,"even:1101":0,"refresh:1113":0,"size:1137":0,"isEmpty:1146":0,"toString:1150":0,"getDOMNodes:1179":0,"(anonymous 16):1253":0,"get:1237":0,"all:1273":0,"]:1344":0,"(anonymous 17):1343":0,"]:1465":0,"(anonymous 18):1464":0,"removeAttribute:1478":0,"(anonymous 1):1":0};
_yuitest_coverage["build/node-core/node-core.js"].coveredLines = 391;
_yuitest_coverage["build/node-core/node-core.js"].coveredFunctions = 85;
_yuitest_coverline("build/node-core/node-core.js", 1);
YUI.add('node-core', function (Y, NAME) {

/**
 * The Node Utility provides a DOM-like interface for interacting with DOM nodes.
 * @module node
 * @main node
 * @submodule node-core
 */

/**
 * The Node class provides a wrapper for manipulating DOM Nodes.
 * Node properties can be accessed via the set/get methods.
 * Use `Y.one()` to retrieve Node instances.
 *
 * <strong>NOTE:</strong> Node properties are accessed using
 * the <code>set</code> and <code>get</code> methods.
 *
 * @class Node
 * @constructor
 * @param {DOMNode} node the DOM node to be mapped to the Node instance.
 * @uses EventTarget
 */

// "globals"
_yuitest_coverfunc("build/node-core/node-core.js", "(anonymous 1)", 1);
_yuitest_coverline("build/node-core/node-core.js", 25);
var DOT = '.',
    NODE_NAME = 'nodeName',
    NODE_TYPE = 'nodeType',
    OWNER_DOCUMENT = 'ownerDocument',
    TAG_NAME = 'tagName',
    UID = '_yuid',
    EMPTY_OBJ = {},

    _slice = Array.prototype.slice,

    Y_DOM = Y.DOM,

    Y_Node = function(node) {
        _yuitest_coverfunc("build/node-core/node-core.js", "Y_Node", 37);
_yuitest_coverline("build/node-core/node-core.js", 38);
if (!this.getDOMNode) { // support optional "new"
            _yuitest_coverline("build/node-core/node-core.js", 39);
return new Y_Node(node);
        }

        _yuitest_coverline("build/node-core/node-core.js", 42);
if (typeof node == 'string') {
            _yuitest_coverline("build/node-core/node-core.js", 43);
node = Y_Node._fromString(node);
            _yuitest_coverline("build/node-core/node-core.js", 44);
if (!node) {
                _yuitest_coverline("build/node-core/node-core.js", 45);
return null; // NOTE: return
            }
        }

        _yuitest_coverline("build/node-core/node-core.js", 49);
var uid = (node.nodeType !== 9) ? node.uniqueID : node[UID];

        _yuitest_coverline("build/node-core/node-core.js", 51);
if (uid && Y_Node._instances[uid] && Y_Node._instances[uid]._node !== node) {
            _yuitest_coverline("build/node-core/node-core.js", 52);
node[UID] = null; // unset existing uid to prevent collision (via clone or hack)
        }

        _yuitest_coverline("build/node-core/node-core.js", 55);
uid = uid || Y.stamp(node);
        _yuitest_coverline("build/node-core/node-core.js", 56);
if (!uid) { // stamp failed; likely IE non-HTMLElement
            _yuitest_coverline("build/node-core/node-core.js", 57);
uid = Y.guid();
        }

        _yuitest_coverline("build/node-core/node-core.js", 60);
this[UID] = uid;

        /**
         * The underlying DOM node bound to the Y.Node instance
         * @property _node
         * @type DOMNode
         * @private
         */
        _yuitest_coverline("build/node-core/node-core.js", 68);
this._node = node;

        _yuitest_coverline("build/node-core/node-core.js", 70);
this._stateProxy = node; // when augmented with Attribute

        _yuitest_coverline("build/node-core/node-core.js", 72);
if (this._initPlugins) { // when augmented with Plugin.Host
            _yuitest_coverline("build/node-core/node-core.js", 73);
this._initPlugins();
        }
    },

    // used with previous/next/ancestor tests
    _wrapFn = function(fn) {
        _yuitest_coverfunc("build/node-core/node-core.js", "_wrapFn", 78);
_yuitest_coverline("build/node-core/node-core.js", 79);
var ret = null;
        _yuitest_coverline("build/node-core/node-core.js", 80);
if (fn) {
            _yuitest_coverline("build/node-core/node-core.js", 81);
ret = (typeof fn == 'string') ?
            function(n) {
                _yuitest_coverfunc("build/node-core/node-core.js", "(anonymous 2)", 82);
_yuitest_coverline("build/node-core/node-core.js", 83);
return Y.Selector.test(n, fn);
            } :
            function(n) {
                _yuitest_coverfunc("build/node-core/node-core.js", "}", 85);
_yuitest_coverline("build/node-core/node-core.js", 86);
return fn(Y.one(n));
            };
        }

        _yuitest_coverline("build/node-core/node-core.js", 90);
return ret;
    };
// end "globals"

_yuitest_coverline("build/node-core/node-core.js", 94);
Y_Node.ATTRS = {};
_yuitest_coverline("build/node-core/node-core.js", 95);
Y_Node.DOM_EVENTS = {};

_yuitest_coverline("build/node-core/node-core.js", 97);
Y_Node._fromString = function(node) {
    _yuitest_coverfunc("build/node-core/node-core.js", "_fromString", 97);
_yuitest_coverline("build/node-core/node-core.js", 98);
if (node) {
        _yuitest_coverline("build/node-core/node-core.js", 99);
if (node.indexOf('doc') === 0) { // doc OR document
            _yuitest_coverline("build/node-core/node-core.js", 100);
node = Y.config.doc;
        } else {_yuitest_coverline("build/node-core/node-core.js", 101);
if (node.indexOf('win') === 0) { // win OR window
            _yuitest_coverline("build/node-core/node-core.js", 102);
node = Y.config.win;
        } else {
            _yuitest_coverline("build/node-core/node-core.js", 104);
node = Y.Selector.query(node, null, true);
        }}
    }

    _yuitest_coverline("build/node-core/node-core.js", 108);
return node || null;
};

/**
 * The name of the component
 * @static
 * @type String
 * @property NAME
 */
_yuitest_coverline("build/node-core/node-core.js", 117);
Y_Node.NAME = 'node';

/*
 * The pattern used to identify ARIA attributes
 */
_yuitest_coverline("build/node-core/node-core.js", 122);
Y_Node.re_aria = /^(?:role$|aria-)/;

_yuitest_coverline("build/node-core/node-core.js", 124);
Y_Node.SHOW_TRANSITION = 'fadeIn';
_yuitest_coverline("build/node-core/node-core.js", 125);
Y_Node.HIDE_TRANSITION = 'fadeOut';

/**
 * A list of Node instances that have been created
 * @private
 * @type Object
 * @property _instances
 * @static
 *
 */
_yuitest_coverline("build/node-core/node-core.js", 135);
Y_Node._instances = {};

/**
 * Retrieves the DOM node bound to a Node instance
 * @method getDOMNode
 * @static
 *
 * @param {Node | HTMLNode} node The Node instance or an HTMLNode
 * @return {HTMLNode} The DOM node bound to the Node instance.  If a DOM node is passed
 * as the node argument, it is simply returned.
 */
_yuitest_coverline("build/node-core/node-core.js", 146);
Y_Node.getDOMNode = function(node) {
    _yuitest_coverfunc("build/node-core/node-core.js", "getDOMNode", 146);
_yuitest_coverline("build/node-core/node-core.js", 147);
if (node) {
        _yuitest_coverline("build/node-core/node-core.js", 148);
return (node.nodeType) ? node : node._node || null;
    }
    _yuitest_coverline("build/node-core/node-core.js", 150);
return null;
};

/**
 * Checks Node return values and wraps DOM Nodes as Y.Node instances
 * and DOM Collections / Arrays as Y.NodeList instances.
 * Other return values just pass thru.  If undefined is returned (e.g. no return)
 * then the Node instance is returned for chainability.
 * @method scrubVal
 * @static
 *
 * @param {any} node The Node instance or an HTMLNode
 * @return {Node | NodeList | Any} Depends on what is returned from the DOM node.
 */
_yuitest_coverline("build/node-core/node-core.js", 164);
Y_Node.scrubVal = function(val, node) {
    _yuitest_coverfunc("build/node-core/node-core.js", "scrubVal", 164);
_yuitest_coverline("build/node-core/node-core.js", 165);
if (val) { // only truthy values are risky
         _yuitest_coverline("build/node-core/node-core.js", 166);
if (typeof val == 'object' || typeof val == 'function') { // safari nodeList === function
            _yuitest_coverline("build/node-core/node-core.js", 167);
if (NODE_TYPE in val || Y_DOM.isWindow(val)) {// node || window
                _yuitest_coverline("build/node-core/node-core.js", 168);
val = Y.one(val);
            } else {_yuitest_coverline("build/node-core/node-core.js", 169);
if ((val.item && !val._nodes) || // dom collection or Node instance
                    (val[0] && val[0][NODE_TYPE])) { // array of DOM Nodes
                _yuitest_coverline("build/node-core/node-core.js", 171);
val = Y.all(val);
            }}
        }
    } else {_yuitest_coverline("build/node-core/node-core.js", 174);
if (typeof val === 'undefined') {
        _yuitest_coverline("build/node-core/node-core.js", 175);
val = node; // for chaining
    } else {_yuitest_coverline("build/node-core/node-core.js", 176);
if (val === null) {
        _yuitest_coverline("build/node-core/node-core.js", 177);
val = null; // IE: DOM null not the same as null
    }}}

    _yuitest_coverline("build/node-core/node-core.js", 180);
return val;
};

/**
 * Adds methods to the Y.Node prototype, routing through scrubVal.
 * @method addMethod
 * @static
 *
 * @param {String} name The name of the method to add
 * @param {Function} fn The function that becomes the method
 * @param {Object} context An optional context to call the method with
 * (defaults to the Node instance)
 * @return {any} Depends on what is returned from the DOM node.
 */
_yuitest_coverline("build/node-core/node-core.js", 194);
Y_Node.addMethod = function(name, fn, context) {
    _yuitest_coverfunc("build/node-core/node-core.js", "addMethod", 194);
_yuitest_coverline("build/node-core/node-core.js", 195);
if (name && fn && typeof fn == 'function') {
        _yuitest_coverline("build/node-core/node-core.js", 196);
Y_Node.prototype[name] = function() {
            _yuitest_coverfunc("build/node-core/node-core.js", "]", 196);
_yuitest_coverline("build/node-core/node-core.js", 197);
var args = _slice.call(arguments),
                node = this,
                ret;

            _yuitest_coverline("build/node-core/node-core.js", 201);
if (args[0] && args[0]._node) {
                _yuitest_coverline("build/node-core/node-core.js", 202);
args[0] = args[0]._node;
            }

            _yuitest_coverline("build/node-core/node-core.js", 205);
if (args[1] && args[1]._node) {
                _yuitest_coverline("build/node-core/node-core.js", 206);
args[1] = args[1]._node;
            }
            _yuitest_coverline("build/node-core/node-core.js", 208);
args.unshift(node._node);

            _yuitest_coverline("build/node-core/node-core.js", 210);
ret = fn.apply(node, args);

            _yuitest_coverline("build/node-core/node-core.js", 212);
if (ret) { // scrub truthy
                _yuitest_coverline("build/node-core/node-core.js", 213);
ret = Y_Node.scrubVal(ret, node);
            }

            _yuitest_coverline("build/node-core/node-core.js", 216);
(typeof ret != 'undefined') || (ret = node);
            _yuitest_coverline("build/node-core/node-core.js", 217);
return ret;
        };
    } else {
    }
};

/**
 * Imports utility methods to be added as Y.Node methods.
 * @method importMethod
 * @static
 *
 * @param {Object} host The object that contains the method to import.
 * @param {String} name The name of the method to import
 * @param {String} altName An optional name to use in place of the host name
 * @param {Object} context An optional context to call the method with
 */
_yuitest_coverline("build/node-core/node-core.js", 233);
Y_Node.importMethod = function(host, name, altName) {
    _yuitest_coverfunc("build/node-core/node-core.js", "importMethod", 233);
_yuitest_coverline("build/node-core/node-core.js", 234);
if (typeof name == 'string') {
        _yuitest_coverline("build/node-core/node-core.js", 235);
altName = altName || name;
        _yuitest_coverline("build/node-core/node-core.js", 236);
Y_Node.addMethod(altName, host[name], host);
    } else {
        _yuitest_coverline("build/node-core/node-core.js", 238);
Y.Array.each(name, function(n) {
            _yuitest_coverfunc("build/node-core/node-core.js", "(anonymous 3)", 238);
_yuitest_coverline("build/node-core/node-core.js", 239);
Y_Node.importMethod(host, n);
        });
    }
};

/**
 * Retrieves a NodeList based on the given CSS selector.
 * @method all
 *
 * @param {string} selector The CSS selector to test against.
 * @return {NodeList} A NodeList instance for the matching HTMLCollection/Array.
 * @for YUI
 */

/**
 * Returns a single Node instance bound to the node or the
 * first element matching the given selector. Returns null if no match found.
 * <strong>Note:</strong> For chaining purposes you may want to
 * use <code>Y.all</code>, which returns a NodeList when no match is found.
 * @method one
 * @param {String | HTMLElement} node a node or Selector
 * @return {Node | null} a Node instance or null if no match found.
 * @for YUI
 */

/**
 * Returns a single Node instance bound to the node or the
 * first element matching the given selector. Returns null if no match found.
 * <strong>Note:</strong> For chaining purposes you may want to
 * use <code>Y.all</code>, which returns a NodeList when no match is found.
 * @method one
 * @static
 * @param {String | HTMLElement} node a node or Selector
 * @return {Node | null} a Node instance or null if no match found.
 * @for Node
 */
_yuitest_coverline("build/node-core/node-core.js", 275);
Y_Node.one = function(node) {
    _yuitest_coverfunc("build/node-core/node-core.js", "one", 275);
_yuitest_coverline("build/node-core/node-core.js", 276);
var instance = null,
        cachedNode,
        uid;

    _yuitest_coverline("build/node-core/node-core.js", 280);
if (node) {
        _yuitest_coverline("build/node-core/node-core.js", 281);
if (typeof node == 'string') {
            _yuitest_coverline("build/node-core/node-core.js", 282);
node = Y_Node._fromString(node);
            _yuitest_coverline("build/node-core/node-core.js", 283);
if (!node) {
                _yuitest_coverline("build/node-core/node-core.js", 284);
return null; // NOTE: return
            }
        } else {_yuitest_coverline("build/node-core/node-core.js", 286);
if (node.getDOMNode) {
            _yuitest_coverline("build/node-core/node-core.js", 287);
return node; // NOTE: return
        }}

        _yuitest_coverline("build/node-core/node-core.js", 290);
if (node.nodeType || Y.DOM.isWindow(node)) { // avoid bad input (numbers, boolean, etc)
            _yuitest_coverline("build/node-core/node-core.js", 291);
uid = (node.uniqueID && node.nodeType !== 9) ? node.uniqueID : node._yuid;
            _yuitest_coverline("build/node-core/node-core.js", 292);
instance = Y_Node._instances[uid]; // reuse exising instances
            _yuitest_coverline("build/node-core/node-core.js", 293);
cachedNode = instance ? instance._node : null;
            _yuitest_coverline("build/node-core/node-core.js", 294);
if (!instance || (cachedNode && node !== cachedNode)) { // new Node when nodes don't match
                _yuitest_coverline("build/node-core/node-core.js", 295);
instance = new Y_Node(node);
                _yuitest_coverline("build/node-core/node-core.js", 296);
if (node.nodeType != 11) { // dont cache document fragment
                    _yuitest_coverline("build/node-core/node-core.js", 297);
Y_Node._instances[instance[UID]] = instance; // cache node
                }
            }
        }
    }

    _yuitest_coverline("build/node-core/node-core.js", 303);
return instance;
};

/**
 * The default setter for DOM properties
 * Called with instance context (this === the Node instance)
 * @method DEFAULT_SETTER
 * @static
 * @param {String} name The attribute/property being set
 * @param {any} val The value to be set
 * @return {any} The value
 */
_yuitest_coverline("build/node-core/node-core.js", 315);
Y_Node.DEFAULT_SETTER = function(name, val) {
    _yuitest_coverfunc("build/node-core/node-core.js", "DEFAULT_SETTER", 315);
_yuitest_coverline("build/node-core/node-core.js", 316);
var node = this._stateProxy,
        strPath;

    _yuitest_coverline("build/node-core/node-core.js", 319);
if (name.indexOf(DOT) > -1) {
        _yuitest_coverline("build/node-core/node-core.js", 320);
strPath = name;
        _yuitest_coverline("build/node-core/node-core.js", 321);
name = name.split(DOT);
        // only allow when defined on node
        _yuitest_coverline("build/node-core/node-core.js", 323);
Y.Object.setValue(node, name, val);
    } else {_yuitest_coverline("build/node-core/node-core.js", 324);
if (typeof node[name] != 'undefined') { // pass thru DOM properties
        _yuitest_coverline("build/node-core/node-core.js", 325);
node[name] = val;
    }}

    _yuitest_coverline("build/node-core/node-core.js", 328);
return val;
};

/**
 * The default getter for DOM properties
 * Called with instance context (this === the Node instance)
 * @method DEFAULT_GETTER
 * @static
 * @param {String} name The attribute/property to look up
 * @return {any} The current value
 */
_yuitest_coverline("build/node-core/node-core.js", 339);
Y_Node.DEFAULT_GETTER = function(name) {
    _yuitest_coverfunc("build/node-core/node-core.js", "DEFAULT_GETTER", 339);
_yuitest_coverline("build/node-core/node-core.js", 340);
var node = this._stateProxy,
        val;

    _yuitest_coverline("build/node-core/node-core.js", 343);
if (name.indexOf && name.indexOf(DOT) > -1) {
        _yuitest_coverline("build/node-core/node-core.js", 344);
val = Y.Object.getValue(node, name.split(DOT));
    } else {_yuitest_coverline("build/node-core/node-core.js", 345);
if (typeof node[name] != 'undefined') { // pass thru from DOM
        _yuitest_coverline("build/node-core/node-core.js", 346);
val = node[name];
    }}

    _yuitest_coverline("build/node-core/node-core.js", 349);
return val;
};

_yuitest_coverline("build/node-core/node-core.js", 352);
Y.mix(Y_Node.prototype, {
    DATA_PREFIX: 'data-',

    /**
     * The method called when outputting Node instances as strings
     * @method toString
     * @return {String} A string representation of the Node instance
     */
    toString: function() {
        _yuitest_coverfunc("build/node-core/node-core.js", "toString", 360);
_yuitest_coverline("build/node-core/node-core.js", 361);
var str = this[UID] + ': not bound to a node',
            node = this._node,
            attrs, id, className;

        _yuitest_coverline("build/node-core/node-core.js", 365);
if (node) {
            _yuitest_coverline("build/node-core/node-core.js", 366);
attrs = node.attributes;
            _yuitest_coverline("build/node-core/node-core.js", 367);
id = (attrs && attrs.id) ? node.getAttribute('id') : null;
            _yuitest_coverline("build/node-core/node-core.js", 368);
className = (attrs && attrs.className) ? node.getAttribute('className') : null;
            _yuitest_coverline("build/node-core/node-core.js", 369);
str = node[NODE_NAME];

            _yuitest_coverline("build/node-core/node-core.js", 371);
if (id) {
                _yuitest_coverline("build/node-core/node-core.js", 372);
str += '#' + id;
            }

            _yuitest_coverline("build/node-core/node-core.js", 375);
if (className) {
                _yuitest_coverline("build/node-core/node-core.js", 376);
str += '.' + className.replace(' ', '.');
            }

            // TODO: add yuid?
            _yuitest_coverline("build/node-core/node-core.js", 380);
str += ' ' + this[UID];
        }
        _yuitest_coverline("build/node-core/node-core.js", 382);
return str;
    },

    /**
     * Returns an attribute value on the Node instance.
     * Unless pre-configured (via `Node.ATTRS`), get hands
     * off to the underlying DOM node.  Only valid
     * attributes/properties for the node will be queried.
     * @method get
     * @param {String} attr The attribute
     * @return {any} The current value of the attribute
     */
    get: function(attr) {
        _yuitest_coverfunc("build/node-core/node-core.js", "get", 394);
_yuitest_coverline("build/node-core/node-core.js", 395);
var val;

        _yuitest_coverline("build/node-core/node-core.js", 397);
if (this._getAttr) { // use Attribute imple
            _yuitest_coverline("build/node-core/node-core.js", 398);
val = this._getAttr(attr);
        } else {
            _yuitest_coverline("build/node-core/node-core.js", 400);
val = this._get(attr);
        }

        _yuitest_coverline("build/node-core/node-core.js", 403);
if (val) {
            _yuitest_coverline("build/node-core/node-core.js", 404);
val = Y_Node.scrubVal(val, this);
        } else {_yuitest_coverline("build/node-core/node-core.js", 405);
if (val === null) {
            _yuitest_coverline("build/node-core/node-core.js", 406);
val = null; // IE: DOM null is not true null (even though they ===)
        }}
        _yuitest_coverline("build/node-core/node-core.js", 408);
return val;
    },

    /**
     * Helper method for get.
     * @method _get
     * @private
     * @param {String} attr The attribute
     * @return {any} The current value of the attribute
     */
    _get: function(attr) {
        _yuitest_coverfunc("build/node-core/node-core.js", "_get", 418);
_yuitest_coverline("build/node-core/node-core.js", 419);
var attrConfig = Y_Node.ATTRS[attr],
            val;

        _yuitest_coverline("build/node-core/node-core.js", 422);
if (attrConfig && attrConfig.getter) {
            _yuitest_coverline("build/node-core/node-core.js", 423);
val = attrConfig.getter.call(this);
        } else {_yuitest_coverline("build/node-core/node-core.js", 424);
if (Y_Node.re_aria.test(attr)) {
            _yuitest_coverline("build/node-core/node-core.js", 425);
val = this._node.getAttribute(attr, 2);
        } else {
            _yuitest_coverline("build/node-core/node-core.js", 427);
val = Y_Node.DEFAULT_GETTER.apply(this, arguments);
        }}

        _yuitest_coverline("build/node-core/node-core.js", 430);
return val;
    },

    /**
     * Sets an attribute on the Node instance.
     * Unless pre-configured (via Node.ATTRS), set hands
     * off to the underlying DOM node.  Only valid
     * attributes/properties for the node will be set.
     * To set custom attributes use setAttribute.
     * @method set
     * @param {String} attr The attribute to be set.
     * @param {any} val The value to set the attribute to.
     * @chainable
     */
    set: function(attr, val) {
        _yuitest_coverfunc("build/node-core/node-core.js", "set", 444);
_yuitest_coverline("build/node-core/node-core.js", 445);
var attrConfig = Y_Node.ATTRS[attr];

        _yuitest_coverline("build/node-core/node-core.js", 447);
if (this._setAttr) { // use Attribute imple
            _yuitest_coverline("build/node-core/node-core.js", 448);
this._setAttr.apply(this, arguments);
        } else { // use setters inline
            _yuitest_coverline("build/node-core/node-core.js", 450);
if (attrConfig && attrConfig.setter) {
                _yuitest_coverline("build/node-core/node-core.js", 451);
attrConfig.setter.call(this, val, attr);
            } else {_yuitest_coverline("build/node-core/node-core.js", 452);
if (Y_Node.re_aria.test(attr)) { // special case Aria
                _yuitest_coverline("build/node-core/node-core.js", 453);
this._node.setAttribute(attr, val);
            } else {
                _yuitest_coverline("build/node-core/node-core.js", 455);
Y_Node.DEFAULT_SETTER.apply(this, arguments);
            }}
        }

        _yuitest_coverline("build/node-core/node-core.js", 459);
return this;
    },

    /**
     * Sets multiple attributes.
     * @method setAttrs
     * @param {Object} attrMap an object of name/value pairs to set
     * @chainable
     */
    setAttrs: function(attrMap) {
        _yuitest_coverfunc("build/node-core/node-core.js", "setAttrs", 468);
_yuitest_coverline("build/node-core/node-core.js", 469);
if (this._setAttrs) { // use Attribute imple
            _yuitest_coverline("build/node-core/node-core.js", 470);
this._setAttrs(attrMap);
        } else { // use setters inline
            _yuitest_coverline("build/node-core/node-core.js", 472);
Y.Object.each(attrMap, function(v, n) {
                _yuitest_coverfunc("build/node-core/node-core.js", "(anonymous 4)", 472);
_yuitest_coverline("build/node-core/node-core.js", 473);
this.set(n, v);
            }, this);
        }

        _yuitest_coverline("build/node-core/node-core.js", 477);
return this;
    },

    /**
     * Returns an object containing the values for the requested attributes.
     * @method getAttrs
     * @param {Array} attrs an array of attributes to get values
     * @return {Object} An object with attribute name/value pairs.
     */
    getAttrs: function(attrs) {
        _yuitest_coverfunc("build/node-core/node-core.js", "getAttrs", 486);
_yuitest_coverline("build/node-core/node-core.js", 487);
var ret = {};
        _yuitest_coverline("build/node-core/node-core.js", 488);
if (this._getAttrs) { // use Attribute imple
            _yuitest_coverline("build/node-core/node-core.js", 489);
this._getAttrs(attrs);
        } else { // use setters inline
            _yuitest_coverline("build/node-core/node-core.js", 491);
Y.Array.each(attrs, function(v, n) {
                _yuitest_coverfunc("build/node-core/node-core.js", "(anonymous 5)", 491);
_yuitest_coverline("build/node-core/node-core.js", 492);
ret[v] = this.get(v);
            }, this);
        }

        _yuitest_coverline("build/node-core/node-core.js", 496);
return ret;
    },

    /**
     * Compares nodes to determine if they match.
     * Node instances can be compared to each other and/or HTMLElements.
     * @method compareTo
     * @param {HTMLElement | Node} refNode The reference node to compare to the node.
     * @return {Boolean} True if the nodes match, false if they do not.
     */
    compareTo: function(refNode) {
        _yuitest_coverfunc("build/node-core/node-core.js", "compareTo", 506);
_yuitest_coverline("build/node-core/node-core.js", 507);
var node = this._node;

        _yuitest_coverline("build/node-core/node-core.js", 509);
if (refNode && refNode._node) {
            _yuitest_coverline("build/node-core/node-core.js", 510);
refNode = refNode._node;
        }
        _yuitest_coverline("build/node-core/node-core.js", 512);
return node === refNode;
    },

    /**
     * Determines whether the node is appended to the document.
     * @method inDoc
     * @param {Node|HTMLElement} doc optional An optional document to check against.
     * Defaults to current document.
     * @return {Boolean} Whether or not this node is appended to the document.
     */
    inDoc: function(doc) {
        _yuitest_coverfunc("build/node-core/node-core.js", "inDoc", 522);
_yuitest_coverline("build/node-core/node-core.js", 523);
var node = this._node;
        _yuitest_coverline("build/node-core/node-core.js", 524);
doc = (doc) ? doc._node || doc : node[OWNER_DOCUMENT];
        _yuitest_coverline("build/node-core/node-core.js", 525);
if (doc.documentElement) {
            _yuitest_coverline("build/node-core/node-core.js", 526);
return Y_DOM.contains(doc.documentElement, node);
        }
    },

    getById: function(id) {
        _yuitest_coverfunc("build/node-core/node-core.js", "getById", 530);
_yuitest_coverline("build/node-core/node-core.js", 531);
var node = this._node,
            ret = Y_DOM.byId(id, node[OWNER_DOCUMENT]);
        _yuitest_coverline("build/node-core/node-core.js", 533);
if (ret && Y_DOM.contains(node, ret)) {
            _yuitest_coverline("build/node-core/node-core.js", 534);
ret = Y.one(ret);
        } else {
            _yuitest_coverline("build/node-core/node-core.js", 536);
ret = null;
        }
        _yuitest_coverline("build/node-core/node-core.js", 538);
return ret;
    },

   /**
     * Returns the nearest ancestor that passes the test applied by supplied boolean method.
     * @method ancestor
     * @param {String | Function} fn A selector string or boolean method for testing elements.
     * If a function is used, it receives the current node being tested as the only argument.
     * If fn is not passed as an argument, the parent node will be returned.
     * @param {Boolean} testSelf optional Whether or not to include the element in the scan
     * @param {String | Function} stopFn optional A selector string or boolean
     * method to indicate when the search should stop. The search bails when the function
     * returns true or the selector matches.
     * If a function is used, it receives the current node being tested as the only argument.
     * @return {Node} The matching Node instance or null if not found
     */
    ancestor: function(fn, testSelf, stopFn) {
        // testSelf is optional, check for stopFn as 2nd arg
        _yuitest_coverfunc("build/node-core/node-core.js", "ancestor", 554);
_yuitest_coverline("build/node-core/node-core.js", 556);
if (arguments.length === 2 &&
                (typeof testSelf == 'string' || typeof testSelf == 'function')) {
            _yuitest_coverline("build/node-core/node-core.js", 558);
stopFn = testSelf;
        }

        _yuitest_coverline("build/node-core/node-core.js", 561);
return Y.one(Y_DOM.ancestor(this._node, _wrapFn(fn), testSelf, _wrapFn(stopFn)));
    },

   /**
     * Returns the ancestors that pass the test applied by supplied boolean method.
     * @method ancestors
     * @param {String | Function} fn A selector string or boolean method for testing elements.
     * @param {Boolean} testSelf optional Whether or not to include the element in the scan
     * If a function is used, it receives the current node being tested as the only argument.
     * @return {NodeList} A NodeList instance containing the matching elements
     */
    ancestors: function(fn, testSelf, stopFn) {
        _yuitest_coverfunc("build/node-core/node-core.js", "ancestors", 572);
_yuitest_coverline("build/node-core/node-core.js", 573);
if (arguments.length === 2 &&
                (typeof testSelf == 'string' || typeof testSelf == 'function')) {
            _yuitest_coverline("build/node-core/node-core.js", 575);
stopFn = testSelf;
        }
        _yuitest_coverline("build/node-core/node-core.js", 577);
return Y.all(Y_DOM.ancestors(this._node, _wrapFn(fn), testSelf, _wrapFn(stopFn)));
    },

    /**
     * Returns the previous matching sibling.
     * Returns the nearest element node sibling if no method provided.
     * @method previous
     * @param {String | Function} fn A selector or boolean method for testing elements.
     * If a function is used, it receives the current node being tested as the only argument.
     * @return {Node} Node instance or null if not found
     */
    previous: function(fn, all) {
        _yuitest_coverfunc("build/node-core/node-core.js", "previous", 588);
_yuitest_coverline("build/node-core/node-core.js", 589);
return Y.one(Y_DOM.elementByAxis(this._node, 'previousSibling', _wrapFn(fn), all));
    },

    /**
     * Returns the next matching sibling.
     * Returns the nearest element node sibling if no method provided.
     * @method next
     * @param {String | Function} fn A selector or boolean method for testing elements.
     * If a function is used, it receives the current node being tested as the only argument.
     * @return {Node} Node instance or null if not found
     */
    next: function(fn, all) {
        _yuitest_coverfunc("build/node-core/node-core.js", "next", 600);
_yuitest_coverline("build/node-core/node-core.js", 601);
return Y.one(Y_DOM.elementByAxis(this._node, 'nextSibling', _wrapFn(fn), all));
    },

    /**
     * Returns all matching siblings.
     * Returns all siblings if no method provided.
     * @method siblings
     * @param {String | Function} fn A selector or boolean method for testing elements.
     * If a function is used, it receives the current node being tested as the only argument.
     * @return {NodeList} NodeList instance bound to found siblings
     */
    siblings: function(fn) {
        _yuitest_coverfunc("build/node-core/node-core.js", "siblings", 612);
_yuitest_coverline("build/node-core/node-core.js", 613);
return Y.all(Y_DOM.siblings(this._node, _wrapFn(fn)));
    },

    /**
     * Retrieves a Node instance of nodes based on the given CSS selector.
     * @method one
     *
     * @param {string} selector The CSS selector to test against.
     * @return {Node} A Node instance for the matching HTMLElement.
     */
    one: function(selector) {
        _yuitest_coverfunc("build/node-core/node-core.js", "one", 623);
_yuitest_coverline("build/node-core/node-core.js", 624);
return Y.one(Y.Selector.query(selector, this._node, true));
    },

    /**
     * Retrieves a NodeList based on the given CSS selector.
     * @method all
     *
     * @param {string} selector The CSS selector to test against.
     * @return {NodeList} A NodeList instance for the matching HTMLCollection/Array.
     */
    all: function(selector) {
        _yuitest_coverfunc("build/node-core/node-core.js", "all", 634);
_yuitest_coverline("build/node-core/node-core.js", 635);
var nodelist = Y.all(Y.Selector.query(selector, this._node));
        _yuitest_coverline("build/node-core/node-core.js", 636);
nodelist._query = selector;
        _yuitest_coverline("build/node-core/node-core.js", 637);
nodelist._queryRoot = this._node;
        _yuitest_coverline("build/node-core/node-core.js", 638);
return nodelist;
    },

    // TODO: allow fn test
    /**
     * Test if the supplied node matches the supplied selector.
     * @method test
     *
     * @param {string} selector The CSS selector to test against.
     * @return {boolean} Whether or not the node matches the selector.
     */
    test: function(selector) {
        _yuitest_coverfunc("build/node-core/node-core.js", "test", 649);
_yuitest_coverline("build/node-core/node-core.js", 650);
return Y.Selector.test(this._node, selector);
    },

    /**
     * Removes the node from its parent.
     * Shortcut for myNode.get('parentNode').removeChild(myNode);
     * @method remove
     * @param {Boolean} destroy whether or not to call destroy() on the node
     * after removal.
     * @chainable
     *
     */
    remove: function(destroy) {
        _yuitest_coverfunc("build/node-core/node-core.js", "remove", 662);
_yuitest_coverline("build/node-core/node-core.js", 663);
var node = this._node;

        _yuitest_coverline("build/node-core/node-core.js", 665);
if (node && node.parentNode) {
            _yuitest_coverline("build/node-core/node-core.js", 666);
node.parentNode.removeChild(node);
        }

        _yuitest_coverline("build/node-core/node-core.js", 669);
if (destroy) {
            _yuitest_coverline("build/node-core/node-core.js", 670);
this.destroy();
        }

        _yuitest_coverline("build/node-core/node-core.js", 673);
return this;
    },

    /**
     * Replace the node with the other node. This is a DOM update only
     * and does not change the node bound to the Node instance.
     * Shortcut for myNode.get('parentNode').replaceChild(newNode, myNode);
     * @method replace
     * @param {Node | HTMLNode} newNode Node to be inserted
     * @chainable
     *
     */
    replace: function(newNode) {
        _yuitest_coverfunc("build/node-core/node-core.js", "replace", 685);
_yuitest_coverline("build/node-core/node-core.js", 686);
var node = this._node;
        _yuitest_coverline("build/node-core/node-core.js", 687);
if (typeof newNode == 'string') {
            _yuitest_coverline("build/node-core/node-core.js", 688);
newNode = Y_Node.create(newNode);
        }
        _yuitest_coverline("build/node-core/node-core.js", 690);
node.parentNode.replaceChild(Y_Node.getDOMNode(newNode), node);
        _yuitest_coverline("build/node-core/node-core.js", 691);
return this;
    },

    /**
     * @method replaceChild
     * @for Node
     * @param {String | HTMLElement | Node} node Node to be inserted
     * @param {HTMLElement | Node} refNode Node to be replaced
     * @return {Node} The replaced node
     */
    replaceChild: function(node, refNode) {
        _yuitest_coverfunc("build/node-core/node-core.js", "replaceChild", 701);
_yuitest_coverline("build/node-core/node-core.js", 702);
if (typeof node == 'string') {
            _yuitest_coverline("build/node-core/node-core.js", 703);
node = Y_DOM.create(node);
        }

        _yuitest_coverline("build/node-core/node-core.js", 706);
return Y.one(this._node.replaceChild(Y_Node.getDOMNode(node), Y_Node.getDOMNode(refNode)));
    },

    /**
     * Nulls internal node references, removes any plugins and event listeners.
     * Note that destroy() will not remove the node from its parent or from the DOM. For that
     * functionality, call remove(true).
     * @method destroy
     * @param {Boolean} recursivePurge (optional) Whether or not to remove listeners from the
     * node's subtree (default is false)
     *
     */
    destroy: function(recursive) {
        _yuitest_coverfunc("build/node-core/node-core.js", "destroy", 718);
_yuitest_coverline("build/node-core/node-core.js", 719);
var UID = Y.config.doc.uniqueID ? 'uniqueID' : '_yuid',
            instance;

        _yuitest_coverline("build/node-core/node-core.js", 722);
this.purge(); // TODO: only remove events add via this Node

        _yuitest_coverline("build/node-core/node-core.js", 724);
if (this.unplug) { // may not be a PluginHost
            _yuitest_coverline("build/node-core/node-core.js", 725);
this.unplug();
        }

        _yuitest_coverline("build/node-core/node-core.js", 728);
this.clearData();

        _yuitest_coverline("build/node-core/node-core.js", 730);
if (recursive) {
            _yuitest_coverline("build/node-core/node-core.js", 731);
Y.NodeList.each(this.all('*'), function(node) {
                _yuitest_coverfunc("build/node-core/node-core.js", "(anonymous 6)", 731);
_yuitest_coverline("build/node-core/node-core.js", 732);
instance = Y_Node._instances[node[UID]];
                _yuitest_coverline("build/node-core/node-core.js", 733);
if (instance) {
                   _yuitest_coverline("build/node-core/node-core.js", 734);
instance.destroy();
                } else { // purge in case added by other means
                    _yuitest_coverline("build/node-core/node-core.js", 736);
Y.Event.purgeElement(node);
                }
            });
        }

        _yuitest_coverline("build/node-core/node-core.js", 741);
this._node = null;
        _yuitest_coverline("build/node-core/node-core.js", 742);
this._stateProxy = null;

        _yuitest_coverline("build/node-core/node-core.js", 744);
delete Y_Node._instances[this._yuid];
    },

    /**
     * Invokes a method on the Node instance
     * @method invoke
     * @param {String} method The name of the method to invoke
     * @param {Any}  a, b, c, etc. Arguments to invoke the method with.
     * @return Whatever the underly method returns.
     * DOM Nodes and Collections return values
     * are converted to Node/NodeList instances.
     *
     */
    invoke: function(method, a, b, c, d, e) {
        _yuitest_coverfunc("build/node-core/node-core.js", "invoke", 757);
_yuitest_coverline("build/node-core/node-core.js", 758);
var node = this._node,
            ret;

        _yuitest_coverline("build/node-core/node-core.js", 761);
if (a && a._node) {
            _yuitest_coverline("build/node-core/node-core.js", 762);
a = a._node;
        }

        _yuitest_coverline("build/node-core/node-core.js", 765);
if (b && b._node) {
            _yuitest_coverline("build/node-core/node-core.js", 766);
b = b._node;
        }

        _yuitest_coverline("build/node-core/node-core.js", 769);
ret = node[method](a, b, c, d, e);
        _yuitest_coverline("build/node-core/node-core.js", 770);
return Y_Node.scrubVal(ret, this);
    },

    /**
    * @method swap
    * @description Swap DOM locations with the given node.
    * This does not change which DOM node each Node instance refers to.
    * @param {Node} otherNode The node to swap with
     * @chainable
    */
    swap: Y.config.doc.documentElement.swapNode ?
        function(otherNode) {
            _yuitest_coverfunc("build/node-core/node-core.js", "(anonymous 7)", 781);
_yuitest_coverline("build/node-core/node-core.js", 782);
this._node.swapNode(Y_Node.getDOMNode(otherNode));
        } :
        function(otherNode) {
            _yuitest_coverfunc("build/node-core/node-core.js", "}", 784);
_yuitest_coverline("build/node-core/node-core.js", 785);
otherNode = Y_Node.getDOMNode(otherNode);
            _yuitest_coverline("build/node-core/node-core.js", 786);
var node = this._node,
                parent = otherNode.parentNode,
                nextSibling = otherNode.nextSibling;

            _yuitest_coverline("build/node-core/node-core.js", 790);
if (nextSibling === node) {
                _yuitest_coverline("build/node-core/node-core.js", 791);
parent.insertBefore(node, otherNode);
            } else {_yuitest_coverline("build/node-core/node-core.js", 792);
if (otherNode === node.nextSibling) {
                _yuitest_coverline("build/node-core/node-core.js", 793);
parent.insertBefore(otherNode, node);
            } else {
                _yuitest_coverline("build/node-core/node-core.js", 795);
node.parentNode.replaceChild(otherNode, node);
                _yuitest_coverline("build/node-core/node-core.js", 796);
Y_DOM.addHTML(parent, node, nextSibling);
            }}
            _yuitest_coverline("build/node-core/node-core.js", 798);
return this;
        },


    hasMethod: function(method) {
        _yuitest_coverfunc("build/node-core/node-core.js", "hasMethod", 802);
_yuitest_coverline("build/node-core/node-core.js", 803);
var node = this._node;
        _yuitest_coverline("build/node-core/node-core.js", 804);
return !!(node && method in node &&
                typeof node[method] != 'unknown' &&
            (typeof node[method] == 'function' ||
                String(node[method]).indexOf('function') === 1)); // IE reports as object, prepends space
    },

    isFragment: function() {
        _yuitest_coverfunc("build/node-core/node-core.js", "isFragment", 810);
_yuitest_coverline("build/node-core/node-core.js", 811);
return (this.get('nodeType') === 11);
    },

    /**
     * Removes and destroys all of the nodes within the node.
     * @method empty
     * @chainable
     */
    empty: function() {
        _yuitest_coverfunc("build/node-core/node-core.js", "empty", 819);
_yuitest_coverline("build/node-core/node-core.js", 820);
this.get('childNodes').remove().destroy(true);
        _yuitest_coverline("build/node-core/node-core.js", 821);
return this;
    },

    /**
     * Returns the DOM node bound to the Node instance
     * @method getDOMNode
     * @return {DOMNode}
     */
    getDOMNode: function() {
        _yuitest_coverfunc("build/node-core/node-core.js", "getDOMNode", 829);
_yuitest_coverline("build/node-core/node-core.js", 830);
return this._node;
    }
}, true);

_yuitest_coverline("build/node-core/node-core.js", 834);
Y.Node = Y_Node;
_yuitest_coverline("build/node-core/node-core.js", 835);
Y.one = Y_Node.one;
/**
 * The NodeList module provides support for managing collections of Nodes.
 * @module node
 * @submodule node-core
 */

/**
 * The NodeList class provides a wrapper for manipulating DOM NodeLists.
 * NodeList properties can be accessed via the set/get methods.
 * Use Y.all() to retrieve NodeList instances.
 *
 * @class NodeList
 * @constructor
 * @param nodes {String|element|Node|Array} A selector, DOM element, Node, list of DOM elements, or list of Nodes with which to populate this NodeList.
 */

_yuitest_coverline("build/node-core/node-core.js", 852);
var NodeList = function(nodes) {
    _yuitest_coverfunc("build/node-core/node-core.js", "NodeList", 852);
_yuitest_coverline("build/node-core/node-core.js", 853);
var tmp = [];

    _yuitest_coverline("build/node-core/node-core.js", 855);
if (nodes) {
        _yuitest_coverline("build/node-core/node-core.js", 856);
if (typeof nodes === 'string') { // selector query
            _yuitest_coverline("build/node-core/node-core.js", 857);
this._query = nodes;
            _yuitest_coverline("build/node-core/node-core.js", 858);
nodes = Y.Selector.query(nodes);
        } else {_yuitest_coverline("build/node-core/node-core.js", 859);
if (nodes.nodeType || Y_DOM.isWindow(nodes)) { // domNode || window
            _yuitest_coverline("build/node-core/node-core.js", 860);
nodes = [nodes];
        } else {_yuitest_coverline("build/node-core/node-core.js", 861);
if (nodes._node) { // Y.Node
            _yuitest_coverline("build/node-core/node-core.js", 862);
nodes = [nodes._node];
        } else {_yuitest_coverline("build/node-core/node-core.js", 863);
if (nodes[0] && nodes[0]._node) { // allow array of Y.Nodes
            _yuitest_coverline("build/node-core/node-core.js", 864);
Y.Array.each(nodes, function(node) {
                _yuitest_coverfunc("build/node-core/node-core.js", "(anonymous 8)", 864);
_yuitest_coverline("build/node-core/node-core.js", 865);
if (node._node) {
                    _yuitest_coverline("build/node-core/node-core.js", 866);
tmp.push(node._node);
                }
            });
            _yuitest_coverline("build/node-core/node-core.js", 869);
nodes = tmp;
        } else { // array of domNodes or domNodeList (no mixed array of Y.Node/domNodes)
            _yuitest_coverline("build/node-core/node-core.js", 871);
nodes = Y.Array(nodes, 0, true);
        }}}}
    }

    /**
     * The underlying array of DOM nodes bound to the Y.NodeList instance
     * @property _nodes
     * @private
     */
    _yuitest_coverline("build/node-core/node-core.js", 880);
this._nodes = nodes || [];
};

_yuitest_coverline("build/node-core/node-core.js", 883);
NodeList.NAME = 'NodeList';

/**
 * Retrieves the DOM nodes bound to a NodeList instance
 * @method getDOMNodes
 * @static
 *
 * @param {NodeList} nodelist The NodeList instance
 * @return {Array} The array of DOM nodes bound to the NodeList
 */
_yuitest_coverline("build/node-core/node-core.js", 893);
NodeList.getDOMNodes = function(nodelist) {
    _yuitest_coverfunc("build/node-core/node-core.js", "getDOMNodes", 893);
_yuitest_coverline("build/node-core/node-core.js", 894);
return (nodelist && nodelist._nodes) ? nodelist._nodes : nodelist;
};

_yuitest_coverline("build/node-core/node-core.js", 897);
NodeList.each = function(instance, fn, context) {
    _yuitest_coverfunc("build/node-core/node-core.js", "each", 897);
_yuitest_coverline("build/node-core/node-core.js", 898);
var nodes = instance._nodes;
    _yuitest_coverline("build/node-core/node-core.js", 899);
if (nodes && nodes.length) {
        _yuitest_coverline("build/node-core/node-core.js", 900);
Y.Array.each(nodes, fn, context || instance);
    } else {
    }
};

_yuitest_coverline("build/node-core/node-core.js", 905);
NodeList.addMethod = function(name, fn, context) {
    _yuitest_coverfunc("build/node-core/node-core.js", "addMethod", 905);
_yuitest_coverline("build/node-core/node-core.js", 906);
if (name && fn) {
        _yuitest_coverline("build/node-core/node-core.js", 907);
NodeList.prototype[name] = function() {
            _yuitest_coverfunc("build/node-core/node-core.js", "]", 907);
_yuitest_coverline("build/node-core/node-core.js", 908);
var ret = [],
                args = arguments;

            _yuitest_coverline("build/node-core/node-core.js", 911);
Y.Array.each(this._nodes, function(node) {
                _yuitest_coverfunc("build/node-core/node-core.js", "(anonymous 9)", 911);
_yuitest_coverline("build/node-core/node-core.js", 912);
var UID = (node.uniqueID && node.nodeType !== 9 ) ? 'uniqueID' : '_yuid',
                    instance = Y.Node._instances[node[UID]],
                    ctx,
                    result;

                _yuitest_coverline("build/node-core/node-core.js", 917);
if (!instance) {
                    _yuitest_coverline("build/node-core/node-core.js", 918);
instance = NodeList._getTempNode(node);
                }
                _yuitest_coverline("build/node-core/node-core.js", 920);
ctx = context || instance;
                _yuitest_coverline("build/node-core/node-core.js", 921);
result = fn.apply(ctx, args);
                _yuitest_coverline("build/node-core/node-core.js", 922);
if (result !== undefined && result !== instance) {
                    _yuitest_coverline("build/node-core/node-core.js", 923);
ret[ret.length] = result;
                }
            });

            // TODO: remove tmp pointer
            _yuitest_coverline("build/node-core/node-core.js", 928);
return ret.length ? ret : this;
        };
    } else {
    }
};

_yuitest_coverline("build/node-core/node-core.js", 934);
NodeList.importMethod = function(host, name, altName) {
    _yuitest_coverfunc("build/node-core/node-core.js", "importMethod", 934);
_yuitest_coverline("build/node-core/node-core.js", 935);
if (typeof name === 'string') {
        _yuitest_coverline("build/node-core/node-core.js", 936);
altName = altName || name;
        _yuitest_coverline("build/node-core/node-core.js", 937);
NodeList.addMethod(name, host[name]);
    } else {
        _yuitest_coverline("build/node-core/node-core.js", 939);
Y.Array.each(name, function(n) {
            _yuitest_coverfunc("build/node-core/node-core.js", "(anonymous 10)", 939);
_yuitest_coverline("build/node-core/node-core.js", 940);
NodeList.importMethod(host, n);
        });
    }
};

_yuitest_coverline("build/node-core/node-core.js", 945);
NodeList._getTempNode = function(node) {
    _yuitest_coverfunc("build/node-core/node-core.js", "_getTempNode", 945);
_yuitest_coverline("build/node-core/node-core.js", 946);
var tmp = NodeList._tempNode;
    _yuitest_coverline("build/node-core/node-core.js", 947);
if (!tmp) {
        _yuitest_coverline("build/node-core/node-core.js", 948);
tmp = Y.Node.create('<div></div>');
        _yuitest_coverline("build/node-core/node-core.js", 949);
NodeList._tempNode = tmp;
    }

    _yuitest_coverline("build/node-core/node-core.js", 952);
tmp._node = node;
    _yuitest_coverline("build/node-core/node-core.js", 953);
tmp._stateProxy = node;
    _yuitest_coverline("build/node-core/node-core.js", 954);
return tmp;
};

_yuitest_coverline("build/node-core/node-core.js", 957);
Y.mix(NodeList.prototype, {
    _invoke: function(method, args, getter) {
        _yuitest_coverfunc("build/node-core/node-core.js", "_invoke", 958);
_yuitest_coverline("build/node-core/node-core.js", 959);
var ret = (getter) ? [] : this;

        _yuitest_coverline("build/node-core/node-core.js", 961);
this.each(function(node) {
            _yuitest_coverfunc("build/node-core/node-core.js", "(anonymous 11)", 961);
_yuitest_coverline("build/node-core/node-core.js", 962);
var val = node[method].apply(node, args);
            _yuitest_coverline("build/node-core/node-core.js", 963);
if (getter) {
                _yuitest_coverline("build/node-core/node-core.js", 964);
ret.push(val);
            }
        });

        _yuitest_coverline("build/node-core/node-core.js", 968);
return ret;
    },

    /**
     * Retrieves the Node instance at the given index.
     * @method item
     *
     * @param {Number} index The index of the target Node.
     * @return {Node} The Node instance at the given index.
     */
    item: function(index) {
        _yuitest_coverfunc("build/node-core/node-core.js", "item", 978);
_yuitest_coverline("build/node-core/node-core.js", 979);
return Y.one((this._nodes || [])[index]);
    },

    /**
     * Applies the given function to each Node in the NodeList.
     * @method each
     * @param {Function} fn The function to apply. It receives 3 arguments:
     * the current node instance, the node's index, and the NodeList instance
     * @param {Object} context optional An optional context to apply the function with
     * Default context is the current Node instance
     * @chainable
     */
    each: function(fn, context) {
        _yuitest_coverfunc("build/node-core/node-core.js", "each", 991);
_yuitest_coverline("build/node-core/node-core.js", 992);
var instance = this;
        _yuitest_coverline("build/node-core/node-core.js", 993);
Y.Array.each(this._nodes, function(node, index) {
            _yuitest_coverfunc("build/node-core/node-core.js", "(anonymous 12)", 993);
_yuitest_coverline("build/node-core/node-core.js", 994);
node = Y.one(node);
            _yuitest_coverline("build/node-core/node-core.js", 995);
return fn.call(context || node, node, index, instance);
        });
        _yuitest_coverline("build/node-core/node-core.js", 997);
return instance;
    },

    batch: function(fn, context) {
        _yuitest_coverfunc("build/node-core/node-core.js", "batch", 1000);
_yuitest_coverline("build/node-core/node-core.js", 1001);
var nodelist = this;

        _yuitest_coverline("build/node-core/node-core.js", 1003);
Y.Array.each(this._nodes, function(node, index) {
            _yuitest_coverfunc("build/node-core/node-core.js", "(anonymous 13)", 1003);
_yuitest_coverline("build/node-core/node-core.js", 1004);
var instance = Y.Node._instances[node[UID]];
            _yuitest_coverline("build/node-core/node-core.js", 1005);
if (!instance) {
                _yuitest_coverline("build/node-core/node-core.js", 1006);
instance = NodeList._getTempNode(node);
            }

            _yuitest_coverline("build/node-core/node-core.js", 1009);
return fn.call(context || instance, instance, index, nodelist);
        });
        _yuitest_coverline("build/node-core/node-core.js", 1011);
return nodelist;
    },

    /**
     * Executes the function once for each node until a true value is returned.
     * @method some
     * @param {Function} fn The function to apply. It receives 3 arguments:
     * the current node instance, the node's index, and the NodeList instance
     * @param {Object} context optional An optional context to execute the function from.
     * Default context is the current Node instance
     * @return {Boolean} Whether or not the function returned true for any node.
     */
    some: function(fn, context) {
        _yuitest_coverfunc("build/node-core/node-core.js", "some", 1023);
_yuitest_coverline("build/node-core/node-core.js", 1024);
var instance = this;
        _yuitest_coverline("build/node-core/node-core.js", 1025);
return Y.Array.some(this._nodes, function(node, index) {
            _yuitest_coverfunc("build/node-core/node-core.js", "(anonymous 14)", 1025);
_yuitest_coverline("build/node-core/node-core.js", 1026);
node = Y.one(node);
            _yuitest_coverline("build/node-core/node-core.js", 1027);
context = context || node;
            _yuitest_coverline("build/node-core/node-core.js", 1028);
return fn.call(context, node, index, instance);
        });
    },

    /**
     * Creates a documenFragment from the nodes bound to the NodeList instance
     * @method toFrag
     * @return {Node} a Node instance bound to the documentFragment
     */
    toFrag: function() {
        _yuitest_coverfunc("build/node-core/node-core.js", "toFrag", 1037);
_yuitest_coverline("build/node-core/node-core.js", 1038);
return Y.one(Y.DOM._nl2frag(this._nodes));
    },

    /**
     * Returns the index of the node in the NodeList instance
     * or -1 if the node isn't found.
     * @method indexOf
     * @param {Node | DOMNode} node the node to search for
     * @return {Int} the index of the node value or -1 if not found
     */
    indexOf: function(node) {
        _yuitest_coverfunc("build/node-core/node-core.js", "indexOf", 1048);
_yuitest_coverline("build/node-core/node-core.js", 1049);
return Y.Array.indexOf(this._nodes, Y.Node.getDOMNode(node));
    },

    /**
     * Filters the NodeList instance down to only nodes matching the given selector.
     * @method filter
     * @param {String} selector The selector to filter against
     * @return {NodeList} NodeList containing the updated collection
     * @see Selector
     */
    filter: function(selector) {
        _yuitest_coverfunc("build/node-core/node-core.js", "filter", 1059);
_yuitest_coverline("build/node-core/node-core.js", 1060);
return Y.all(Y.Selector.filter(this._nodes, selector));
    },


    /**
     * Creates a new NodeList containing all nodes at every n indices, where
     * remainder n % index equals r.
     * (zero-based index).
     * @method modulus
     * @param {Int} n The offset to use (return every nth node)
     * @param {Int} r An optional remainder to use with the modulus operation (defaults to zero)
     * @return {NodeList} NodeList containing the updated collection
     */
    modulus: function(n, r) {
        _yuitest_coverfunc("build/node-core/node-core.js", "modulus", 1073);
_yuitest_coverline("build/node-core/node-core.js", 1074);
r = r || 0;
        _yuitest_coverline("build/node-core/node-core.js", 1075);
var nodes = [];
        _yuitest_coverline("build/node-core/node-core.js", 1076);
NodeList.each(this, function(node, i) {
            _yuitest_coverfunc("build/node-core/node-core.js", "(anonymous 15)", 1076);
_yuitest_coverline("build/node-core/node-core.js", 1077);
if (i % n === r) {
                _yuitest_coverline("build/node-core/node-core.js", 1078);
nodes.push(node);
            }
        });

        _yuitest_coverline("build/node-core/node-core.js", 1082);
return Y.all(nodes);
    },

    /**
     * Creates a new NodeList containing all nodes at odd indices
     * (zero-based index).
     * @method odd
     * @return {NodeList} NodeList containing the updated collection
     */
    odd: function() {
        _yuitest_coverfunc("build/node-core/node-core.js", "odd", 1091);
_yuitest_coverline("build/node-core/node-core.js", 1092);
return this.modulus(2, 1);
    },

    /**
     * Creates a new NodeList containing all nodes at even indices
     * (zero-based index), including zero.
     * @method even
     * @return {NodeList} NodeList containing the updated collection
     */
    even: function() {
        _yuitest_coverfunc("build/node-core/node-core.js", "even", 1101);
_yuitest_coverline("build/node-core/node-core.js", 1102);
return this.modulus(2);
    },

    destructor: function() {
    },

    /**
     * Reruns the initial query, when created using a selector query
     * @method refresh
     * @chainable
     */
    refresh: function() {
        _yuitest_coverfunc("build/node-core/node-core.js", "refresh", 1113);
_yuitest_coverline("build/node-core/node-core.js", 1114);
var doc,
            nodes = this._nodes,
            query = this._query,
            root = this._queryRoot;

        _yuitest_coverline("build/node-core/node-core.js", 1119);
if (query) {
            _yuitest_coverline("build/node-core/node-core.js", 1120);
if (!root) {
                _yuitest_coverline("build/node-core/node-core.js", 1121);
if (nodes && nodes[0] && nodes[0].ownerDocument) {
                    _yuitest_coverline("build/node-core/node-core.js", 1122);
root = nodes[0].ownerDocument;
                }
            }

            _yuitest_coverline("build/node-core/node-core.js", 1126);
this._nodes = Y.Selector.query(query, root);
        }

        _yuitest_coverline("build/node-core/node-core.js", 1129);
return this;
    },

    /**
     * Returns the current number of items in the NodeList.
     * @method size
     * @return {Int} The number of items in the NodeList.
     */
    size: function() {
        _yuitest_coverfunc("build/node-core/node-core.js", "size", 1137);
_yuitest_coverline("build/node-core/node-core.js", 1138);
return this._nodes.length;
    },

    /**
     * Determines if the instance is bound to any nodes
     * @method isEmpty
     * @return {Boolean} Whether or not the NodeList is bound to any nodes
     */
    isEmpty: function() {
        _yuitest_coverfunc("build/node-core/node-core.js", "isEmpty", 1146);
_yuitest_coverline("build/node-core/node-core.js", 1147);
return this._nodes.length < 1;
    },

    toString: function() {
        _yuitest_coverfunc("build/node-core/node-core.js", "toString", 1150);
_yuitest_coverline("build/node-core/node-core.js", 1151);
var str = '',
            errorMsg = this[UID] + ': not bound to any nodes',
            nodes = this._nodes,
            node;

        _yuitest_coverline("build/node-core/node-core.js", 1156);
if (nodes && nodes[0]) {
            _yuitest_coverline("build/node-core/node-core.js", 1157);
node = nodes[0];
            _yuitest_coverline("build/node-core/node-core.js", 1158);
str += node[NODE_NAME];
            _yuitest_coverline("build/node-core/node-core.js", 1159);
if (node.id) {
                _yuitest_coverline("build/node-core/node-core.js", 1160);
str += '#' + node.id;
            }

            _yuitest_coverline("build/node-core/node-core.js", 1163);
if (node.className) {
                _yuitest_coverline("build/node-core/node-core.js", 1164);
str += '.' + node.className.replace(' ', '.');
            }

            _yuitest_coverline("build/node-core/node-core.js", 1167);
if (nodes.length > 1) {
                _yuitest_coverline("build/node-core/node-core.js", 1168);
str += '...[' + nodes.length + ' items]';
            }
        }
        _yuitest_coverline("build/node-core/node-core.js", 1171);
return str || errorMsg;
    },

    /**
     * Returns the DOM node bound to the Node instance
     * @method getDOMNodes
     * @return {Array}
     */
    getDOMNodes: function() {
        _yuitest_coverfunc("build/node-core/node-core.js", "getDOMNodes", 1179);
_yuitest_coverline("build/node-core/node-core.js", 1180);
return this._nodes;
    }
}, true);

_yuitest_coverline("build/node-core/node-core.js", 1184);
NodeList.importMethod(Y.Node.prototype, [
     /** 
      * Called on each Node instance. Nulls internal node references, 
      * removes any plugins and event listeners
      * @method destroy
      * @param {Boolean} recursivePurge (optional) Whether or not to 
      * remove listeners from the node's subtree (default is false)
      * @see Node.destroy
      */
    'destroy',

     /** 
      * Called on each Node instance. Removes and destroys all of the nodes 
      * within the node
      * @method empty
      * @chainable
      * @see Node.empty
      */
    'empty',

     /** 
      * Called on each Node instance. Removes the node from its parent.
      * Shortcut for myNode.get('parentNode').removeChild(myNode);
      * @method remove
      * @param {Boolean} destroy whether or not to call destroy() on the node
      * after removal.
      * @chainable
      * @see Node.remove
      */
    'remove',

     /** 
      * Called on each Node instance. Sets an attribute on the Node instance.
      * Unless pre-configured (via Node.ATTRS), set hands
      * off to the underlying DOM node.  Only valid
      * attributes/properties for the node will be set.
      * To set custom attributes use setAttribute.
      * @method set
      * @param {String} attr The attribute to be set.
      * @param {any} val The value to set the attribute to.
      * @chainable
      * @see Node.set
      */
    'set'
]);

// one-off implementation to convert array of Nodes to NodeList
// e.g. Y.all('input').get('parentNode');

/** Called on each Node instance
  * @method get
  * @see Node
  */
_yuitest_coverline("build/node-core/node-core.js", 1237);
NodeList.prototype.get = function(attr) {
    _yuitest_coverfunc("build/node-core/node-core.js", "get", 1237);
_yuitest_coverline("build/node-core/node-core.js", 1238);
var ret = [],
        nodes = this._nodes,
        isNodeList = false,
        getTemp = NodeList._getTempNode,
        instance,
        val;

    _yuitest_coverline("build/node-core/node-core.js", 1245);
if (nodes[0]) {
        _yuitest_coverline("build/node-core/node-core.js", 1246);
instance = Y.Node._instances[nodes[0]._yuid] || getTemp(nodes[0]);
        _yuitest_coverline("build/node-core/node-core.js", 1247);
val = instance._get(attr);
        _yuitest_coverline("build/node-core/node-core.js", 1248);
if (val && val.nodeType) {
            _yuitest_coverline("build/node-core/node-core.js", 1249);
isNodeList = true;
        }
    }

    _yuitest_coverline("build/node-core/node-core.js", 1253);
Y.Array.each(nodes, function(node) {
        _yuitest_coverfunc("build/node-core/node-core.js", "(anonymous 16)", 1253);
_yuitest_coverline("build/node-core/node-core.js", 1254);
instance = Y.Node._instances[node._yuid];

        _yuitest_coverline("build/node-core/node-core.js", 1256);
if (!instance) {
            _yuitest_coverline("build/node-core/node-core.js", 1257);
instance = getTemp(node);
        }

        _yuitest_coverline("build/node-core/node-core.js", 1260);
val = instance._get(attr);
        _yuitest_coverline("build/node-core/node-core.js", 1261);
if (!isNodeList) { // convert array of Nodes to NodeList
            _yuitest_coverline("build/node-core/node-core.js", 1262);
val = Y.Node.scrubVal(val, instance);
        }

        _yuitest_coverline("build/node-core/node-core.js", 1265);
ret.push(val);
    });

    _yuitest_coverline("build/node-core/node-core.js", 1268);
return (isNodeList) ? Y.all(ret) : ret;
};

_yuitest_coverline("build/node-core/node-core.js", 1271);
Y.NodeList = NodeList;

_yuitest_coverline("build/node-core/node-core.js", 1273);
Y.all = function(nodes) {
    _yuitest_coverfunc("build/node-core/node-core.js", "all", 1273);
_yuitest_coverline("build/node-core/node-core.js", 1274);
return new NodeList(nodes);
};

_yuitest_coverline("build/node-core/node-core.js", 1277);
Y.Node.all = Y.all;
/**
 * @module node
 * @submodule node-core
 */

_yuitest_coverline("build/node-core/node-core.js", 1283);
var Y_NodeList = Y.NodeList,
    ArrayProto = Array.prototype,
    ArrayMethods = {
        /** Returns a new NodeList combining the given NodeList(s)
          * @for NodeList
          * @method concat
          * @param {NodeList | Array} valueN Arrays/NodeLists and/or values to
          * concatenate to the resulting NodeList
          * @return {NodeList} A new NodeList comprised of this NodeList joined with the input.
          */
        'concat': 1,
        /** Removes the last from the NodeList and returns it.
          * @for NodeList
          * @method pop
          * @return {Node} The last item in the NodeList.
          */
        'pop': 0,
        /** Adds the given Node(s) to the end of the NodeList.
          * @for NodeList
          * @method push
          * @param {Node | DOMNode} nodes One or more nodes to add to the end of the NodeList.
          */
        'push': 0,
        /** Removes the first item from the NodeList and returns it.
          * @for NodeList
          * @method shift
          * @return {Node} The first item in the NodeList.
          */
        'shift': 0,
        /** Returns a new NodeList comprising the Nodes in the given range.
          * @for NodeList
          * @method slice
          * @param {Number} begin Zero-based index at which to begin extraction.
          As a negative index, start indicates an offset from the end of the sequence. slice(-2) extracts the second-to-last element and the last element in the sequence.
          * @param {Number} end Zero-based index at which to end extraction. slice extracts up to but not including end.
          slice(1,4) extracts the second element through the fourth element (elements indexed 1, 2, and 3).
          As a negative index, end indicates an offset from the end of the sequence. slice(2,-1) extracts the third element through the second-to-last element in the sequence.
          If end is omitted, slice extracts to the end of the sequence.
          * @return {NodeList} A new NodeList comprised of this NodeList joined with the input.
          */
        'slice': 1,
        /** Changes the content of the NodeList, adding new elements while removing old elements.
          * @for NodeList
          * @method splice
          * @param {Number} index Index at which to start changing the array. If negative, will begin that many elements from the end.
          * @param {Number} howMany An integer indicating the number of old array elements to remove. If howMany is 0, no elements are removed. In this case, you should specify at least one new element. If no howMany parameter is specified (second syntax above, which is a SpiderMonkey extension), all elements after index are removed.
          * {Node | DOMNode| element1, ..., elementN
          The elements to add to the array. If you don't specify any elements, splice simply removes elements from the array.
          * @return {NodeList} The element(s) removed.
          */
        'splice': 1,
        /** Adds the given Node(s) to the beginning of the NodeList.
          * @for NodeList
          * @method unshift
          * @param {Node | DOMNode} nodes One or more nodes to add to the NodeList.
          */
        'unshift': 0
    };


_yuitest_coverline("build/node-core/node-core.js", 1343);
Y.Object.each(ArrayMethods, function(returnNodeList, name) {
    _yuitest_coverfunc("build/node-core/node-core.js", "(anonymous 17)", 1343);
_yuitest_coverline("build/node-core/node-core.js", 1344);
Y_NodeList.prototype[name] = function() {
        _yuitest_coverfunc("build/node-core/node-core.js", "]", 1344);
_yuitest_coverline("build/node-core/node-core.js", 1345);
var args = [],
            i = 0,
            arg,
            ret;

        _yuitest_coverline("build/node-core/node-core.js", 1350);
while (typeof (arg = arguments[i++]) != 'undefined') { // use DOM nodes/nodeLists
            _yuitest_coverline("build/node-core/node-core.js", 1351);
args.push(arg._node || arg._nodes || arg);
        }

        _yuitest_coverline("build/node-core/node-core.js", 1354);
ret = ArrayProto[name].apply(this._nodes, args);

        _yuitest_coverline("build/node-core/node-core.js", 1356);
if (returnNodeList) {
            _yuitest_coverline("build/node-core/node-core.js", 1357);
ret = Y.all(ret);
        } else {
            _yuitest_coverline("build/node-core/node-core.js", 1359);
ret = Y.Node.scrubVal(ret);
        }

        _yuitest_coverline("build/node-core/node-core.js", 1362);
return ret;
    };
});
/**
 * @module node
 * @submodule node-core
 */

_yuitest_coverline("build/node-core/node-core.js", 1370);
Y.Array.each([
    /**
     * Passes through to DOM method.
     * @for Node
     * @method removeChild
     * @param {HTMLElement | Node} node Node to be removed
     * @return {Node} The removed node
     */
    'removeChild',

    /**
     * Passes through to DOM method.
     * @method hasChildNodes
     * @return {Boolean} Whether or not the node has any childNodes
     */
    'hasChildNodes',

    /**
     * Passes through to DOM method.
     * @method cloneNode
     * @param {Boolean} deep Whether or not to perform a deep clone, which includes
     * subtree and attributes
     * @return {Node} The clone
     */
    'cloneNode',

    /**
     * Passes through to DOM method.
     * @method hasAttribute
     * @param {String} attribute The attribute to test for
     * @return {Boolean} Whether or not the attribute is present
     */
    'hasAttribute',

    /**
     * Passes through to DOM method.
     * @method scrollIntoView
     * @chainable
     */
    'scrollIntoView',

    /**
     * Passes through to DOM method.
     * @method getElementsByTagName
     * @param {String} tagName The tagName to collect
     * @return {NodeList} A NodeList representing the HTMLCollection
     */
    'getElementsByTagName',

    /**
     * Passes through to DOM method.
     * @method focus
     * @chainable
     */
    'focus',

    /**
     * Passes through to DOM method.
     * @method blur
     * @chainable
     */
    'blur',

    /**
     * Passes through to DOM method.
     * Only valid on FORM elements
     * @method submit
     * @chainable
     */
    'submit',

    /**
     * Passes through to DOM method.
     * Only valid on FORM elements
     * @method reset
     * @chainable
     */
    'reset',

    /**
     * Passes through to DOM method.
     * @method select
     * @chainable
     */
     'select',

    /**
     * Passes through to DOM method.
     * Only valid on TABLE elements
     * @method createCaption
     * @chainable
     */
    'createCaption'

], function(method) {
    _yuitest_coverfunc("build/node-core/node-core.js", "(anonymous 18)", 1464);
_yuitest_coverline("build/node-core/node-core.js", 1465);
Y.Node.prototype[method] = function(arg1, arg2, arg3) {
        _yuitest_coverfunc("build/node-core/node-core.js", "]", 1465);
_yuitest_coverline("build/node-core/node-core.js", 1466);
var ret = this.invoke(method, arg1, arg2, arg3);
        _yuitest_coverline("build/node-core/node-core.js", 1467);
return ret;
    };
});

/**
 * Passes through to DOM method.
 * @method removeAttribute
 * @param {String} attribute The attribute to be removed
 * @chainable
 */
 // one-off implementation due to IE returning boolean, breaking chaining
_yuitest_coverline("build/node-core/node-core.js", 1478);
Y.Node.prototype.removeAttribute = function(attr) {
    _yuitest_coverfunc("build/node-core/node-core.js", "removeAttribute", 1478);
_yuitest_coverline("build/node-core/node-core.js", 1479);
var node = this._node;
    _yuitest_coverline("build/node-core/node-core.js", 1480);
if (node) {
        _yuitest_coverline("build/node-core/node-core.js", 1481);
node.removeAttribute(attr, 0); // comma zero for IE < 8 to force case-insensitive
    }

    _yuitest_coverline("build/node-core/node-core.js", 1484);
return this;
};

_yuitest_coverline("build/node-core/node-core.js", 1487);
Y.Node.importMethod(Y.DOM, [
    /**
     * Determines whether the node is an ancestor of another HTML element in the DOM hierarchy.
     * @method contains
     * @param {Node | HTMLElement} needle The possible node or descendent
     * @return {Boolean} Whether or not this node is the needle its ancestor
     */
    'contains',
    /**
     * Allows setting attributes on DOM nodes, normalizing in some cases.
     * This passes through to the DOM node, allowing for custom attributes.
     * @method setAttribute
     * @for Node
     * @chainable
     * @param {string} name The attribute name
     * @param {string} value The value to set
     */
    'setAttribute',
    /**
     * Allows getting attributes on DOM nodes, normalizing in some cases.
     * This passes through to the DOM node, allowing for custom attributes.
     * @method getAttribute
     * @for Node
     * @param {string} name The attribute name
     * @return {string} The attribute value
     */
    'getAttribute',

    /**
     * Wraps the given HTML around the node.
     * @method wrap
     * @param {String} html The markup to wrap around the node.
     * @chainable
     * @for Node
     */
    'wrap',

    /**
     * Removes the node's parent node.
     * @method unwrap
     * @chainable
     */
    'unwrap',

    /**
     * Applies a unique ID to the node if none exists
     * @method generateID
     * @return {String} The existing or generated ID
     */
    'generateID'
]);

_yuitest_coverline("build/node-core/node-core.js", 1539);
Y.NodeList.importMethod(Y.Node.prototype, [
/**
 * Allows getting attributes on DOM nodes, normalizing in some cases.
 * This passes through to the DOM node, allowing for custom attributes.
 * @method getAttribute
 * @see Node
 * @for NodeList
 * @param {string} name The attribute name
 * @return {string} The attribute value
 */

    'getAttribute',
/**
 * Allows setting attributes on DOM nodes, normalizing in some cases.
 * This passes through to the DOM node, allowing for custom attributes.
 * @method setAttribute
 * @see Node
 * @for NodeList
 * @chainable
 * @param {string} name The attribute name
 * @param {string} value The value to set
 */
    'setAttribute',

/**
 * Allows for removing attributes on DOM nodes.
 * This passes through to the DOM node, allowing for custom attributes.
 * @method removeAttribute
 * @see Node
 * @for NodeList
 * @param {string} name The attribute to remove
 */
    'removeAttribute',
/**
 * Removes the parent node from node in the list.
 * @method unwrap
 * @chainable
 */
    'unwrap',
/**
 * Wraps the given HTML around each node.
 * @method wrap
 * @param {String} html The markup to wrap around the node.
 * @chainable
 */
    'wrap',

/**
 * Applies a unique ID to each node if none exists
 * @method generateID
 * @return {String} The existing or generated ID
 */
    'generateID'
]);


}, '3.7.3', {"requires": ["dom-core", "selector"]});
