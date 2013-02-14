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
_yuitest_coverage["build/node-base/node-base.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/node-base/node-base.js",
    code: []
};
_yuitest_coverage["build/node-base/node-base.js"].code=["YUI.add('node-base', function (Y, NAME) {","","/**"," * @module node"," * @submodule node-base"," */","","var methods = [","/**"," * Determines whether each node has the given className."," * @method hasClass"," * @for Node"," * @param {String} className the class name to search for"," * @return {Boolean} Whether or not the element has the specified class"," */"," 'hasClass',","","/**"," * Adds a class name to each node."," * @method addClass"," * @param {String} className the class name to add to the node's class attribute"," * @chainable"," */"," 'addClass',","","/**"," * Removes a class name from each node."," * @method removeClass"," * @param {String} className the class name to remove from the node's class attribute"," * @chainable"," */"," 'removeClass',","","/**"," * Replace a class with another class for each node."," * If no oldClassName is present, the newClassName is simply added."," * @method replaceClass"," * @param {String} oldClassName the class name to be replaced"," * @param {String} newClassName the class name that will be replacing the old class name"," * @chainable"," */"," 'replaceClass',","","/**"," * If the className exists on the node it is removed, if it doesn't exist it is added."," * @method toggleClass"," * @param {String} className the class name to be toggled"," * @param {Boolean} force Option to force adding or removing the class."," * @chainable"," */"," 'toggleClass'","];","","Y.Node.importMethod(Y.DOM, methods);","/**"," * Determines whether each node has the given className."," * @method hasClass"," * @see Node.hasClass"," * @for NodeList"," * @param {String} className the class name to search for"," * @return {Array} An array of booleans for each node bound to the NodeList."," */","","/**"," * Adds a class name to each node."," * @method addClass"," * @see Node.addClass"," * @param {String} className the class name to add to the node's class attribute"," * @chainable"," */","","/**"," * Removes a class name from each node."," * @method removeClass"," * @see Node.removeClass"," * @param {String} className the class name to remove from the node's class attribute"," * @chainable"," */","","/**"," * Replace a class with another class for each node."," * If no oldClassName is present, the newClassName is simply added."," * @method replaceClass"," * @see Node.replaceClass"," * @param {String} oldClassName the class name to be replaced"," * @param {String} newClassName the class name that will be replacing the old class name"," * @chainable"," */","","/**"," * If the className exists on the node it is removed, if it doesn't exist it is added."," * @method toggleClass"," * @see Node.toggleClass"," * @param {String} className the class name to be toggled"," * @chainable"," */","Y.NodeList.importMethod(Y.Node.prototype, methods);","/**"," * @module node"," * @submodule node-base"," */","","var Y_Node = Y.Node,","    Y_DOM = Y.DOM;","","/**"," * Returns a new dom node using the provided markup string."," * @method create"," * @static"," * @param {String} html The markup used to create the element"," * Use <a href=\"../classes/Escape.html#method_html\">`Y.Escape.html()`</a>"," * to escape html content."," * @param {HTMLDocument} doc An optional document context"," * @return {Node} A Node instance bound to a DOM node or fragment"," * @for Node"," */","Y_Node.create = function(html, doc) {","    if (doc && doc._node) {","        doc = doc._node;","    }","    return Y.one(Y_DOM.create(html, doc));","};","","Y.mix(Y_Node.prototype, {","    /**","     * Creates a new Node using the provided markup string.","     * @method create","     * @param {String} html The markup used to create the element.","     * Use <a href=\"../classes/Escape.html#method_html\">`Y.Escape.html()`</a>","     * to escape html content.","     * @param {HTMLDocument} doc An optional document context","     * @return {Node} A Node instance bound to a DOM node or fragment","     */","    create: Y_Node.create,","","    /**","     * Inserts the content before the reference node.","     * @method insert","     * @param {String | Node | HTMLElement | NodeList | HTMLCollection} content The content to insert","     * Use <a href=\"../classes/Escape.html#method_html\">`Y.Escape.html()`</a>","     * to escape html content.","     * @param {Int | Node | HTMLElement | String} where The position to insert at.","     * Possible \"where\" arguments","     * <dl>","     * <dt>Y.Node</dt>","     * <dd>The Node to insert before</dd>","     * <dt>HTMLElement</dt>","     * <dd>The element to insert before</dd>","     * <dt>Int</dt>","     * <dd>The index of the child element to insert before</dd>","     * <dt>\"replace\"</dt>","     * <dd>Replaces the existing HTML</dd>","     * <dt>\"before\"</dt>","     * <dd>Inserts before the existing HTML</dd>","     * <dt>\"before\"</dt>","     * <dd>Inserts content before the node</dd>","     * <dt>\"after\"</dt>","     * <dd>Inserts content after the node</dd>","     * </dl>","     * @chainable","     */","    insert: function(content, where) {","        this._insert(content, where);","        return this;","    },","","    _insert: function(content, where) {","        var node = this._node,","            ret = null;","","        if (typeof where == 'number') { // allow index","            where = this._node.childNodes[where];","        } else if (where && where._node) { // Node","            where = where._node;","        }","","        if (content && typeof content != 'string') { // allow Node or NodeList/Array instances","            content = content._node || content._nodes || content;","        }","        ret = Y_DOM.addHTML(node, content, where);","","        return ret;","    },","","    /**","     * Inserts the content as the firstChild of the node.","     * @method prepend","     * @param {String | Node | HTMLElement} content The content to insert","     * Use <a href=\"../classes/Escape.html#method_html\">`Y.Escape.html()`</a>","     * to escape html content.","     * @chainable","     */","    prepend: function(content) {","        return this.insert(content, 0);","    },","","    /**","     * Inserts the content as the lastChild of the node.","     * @method append","     * @param {String | Node | HTMLElement} content The content to insert","     * Use <a href=\"../classes/Escape.html#method_html\">`Y.Escape.html()`</a>","     * to escape html content.","     * @chainable","     */","    append: function(content) {","        return this.insert(content, null);","    },","","    /**","     * @method appendChild","     * @param {String | HTMLElement | Node} node Node to be appended","     * Use <a href=\"../classes/Escape.html#method_html\">`Y.Escape.html()`</a>","     * to escape html content.","     * @return {Node} The appended node","     */","    appendChild: function(node) {","        return Y_Node.scrubVal(this._insert(node));","    },","","    /**","     * @method insertBefore","     * @param {String | HTMLElement | Node} newNode Node to be appended","     * @param {HTMLElement | Node} refNode Node to be inserted before","     * Use <a href=\"../classes/Escape.html#method_html\">`Y.Escape.html()`</a>","     * to escape html content.","     * @return {Node} The inserted node","     */","    insertBefore: function(newNode, refNode) {","        return Y.Node.scrubVal(this._insert(newNode, refNode));","    },","","    /**","     * Appends the node to the given node.","     * @method appendTo","     * @param {Node | HTMLElement} node The node to append to","     * @chainable","     */","    appendTo: function(node) {","        Y.one(node).append(this);","        return this;","    },","","    /**","     * Replaces the node's current content with the content.","     * Note that this passes to innerHTML and is not escaped.","     * Use <a href=\"../classes/Escape.html#method_html\">`Y.Escape.html()`</a>","     * to escape html content or `set('text')` to add as text.","     * @method setContent","     * @deprecated Use setHTML","     * @param {String | Node | HTMLElement | NodeList | HTMLCollection} content The content to insert","     * @chainable","     */","    setContent: function(content) {","        this._insert(content, 'replace');","        return this;","    },","","    /**","     * Returns the node's current content (e.g. innerHTML)","     * @method getContent","     * @deprecated Use getHTML","     * @return {String} The current content","     */","    getContent: function(content) {","        return this.get('innerHTML');","    }","});","","/**"," * Replaces the node's current html content with the content provided."," * Note that this passes to innerHTML and is not escaped."," * Use `Y.Escape.html()` to escape HTML, or `set('text')` to add as text."," * @method setHTML"," * @param {String | HTML | Node | HTMLElement | NodeList | HTMLCollection} content The content to insert"," * @chainable"," */","Y.Node.prototype.setHTML = Y.Node.prototype.setContent;","","/**"," * Returns the node's current html content (e.g. innerHTML)"," * @method getHTML"," * @return {String} The html content"," */","Y.Node.prototype.getHTML = Y.Node.prototype.getContent;","","Y.NodeList.importMethod(Y.Node.prototype, [","    /**","     * Called on each Node instance","     * @for NodeList","     * @method append","     * @see Node.append","     */","    'append',","","    /**","     * Called on each Node instance","     * @for NodeList","     * @method insert","     * @see Node.insert","     */","    'insert',","","    /**","     * Called on each Node instance","     * @for NodeList","     * @method appendChild","     * @see Node.appendChild","     */","    'appendChild',","","    /**","     * Called on each Node instance","     * @for NodeList","     * @method insertBefore","     * @see Node.insertBefore","     */","    'insertBefore',","","    /**","     * Called on each Node instance","     * @for NodeList","     * @method prepend","     * @see Node.prepend","     */","    'prepend',","","    /**","     * Called on each Node instance","     * Note that this passes to innerHTML and is not escaped.","     * Use `Y.Escape.html()` to escape HTML, or `set('text')` to add as text.","     * @for NodeList","     * @method setContent","     * @deprecated Use setHTML","     */","    'setContent',","","    /**","     * Called on each Node instance","     * @for NodeList","     * @method getContent","     * @deprecated Use getHTML","     */","    'getContent',","","    /**","     * Called on each Node instance","     * Note that this passes to innerHTML and is not escaped.","     * Use `Y.Escape.html()` to escape HTML, or `set('text')` to add as text.","     * @for NodeList","     * @method setHTML","     * @see Node.setHTML","     */","    'setHTML',","","    /**","     * Called on each Node instance","     * @for NodeList","     * @method getHTML","     * @see Node.getHTML","     */","    'getHTML'","]);","/**"," * @module node"," * @submodule node-base"," */","","var Y_Node = Y.Node,","    Y_DOM = Y.DOM;","","/**"," * Static collection of configuration attributes for special handling"," * @property ATTRS"," * @static"," * @type object"," */","Y_Node.ATTRS = {","    /**","     * Allows for getting and setting the text of an element.","     * Formatting is preserved and special characters are treated literally.","     * @config text","     * @type String","     */","    text: {","        getter: function() {","            return Y_DOM.getText(this._node);","        },","","        setter: function(content) {","            Y_DOM.setText(this._node, content);","            return content;","        }","    },","","    /**","     * Allows for getting and setting the text of an element.","     * Formatting is preserved and special characters are treated literally.","     * @config for","     * @type String","     */","    'for': {","        getter: function() {","            return Y_DOM.getAttribute(this._node, 'for');","        },","","        setter: function(val) {","            Y_DOM.setAttribute(this._node, 'for', val);","            return val;","        }","    },","","    'options': {","        getter: function() {","            return this._node.getElementsByTagName('option');","        }","    },","","    /**","     * Returns a NodeList instance of all HTMLElement children.","     * @readOnly","     * @config children","     * @type NodeList","     */","    'children': {","        getter: function() {","            var node = this._node,","                children = node.children,","                childNodes, i, len;","","            if (!children) {","                childNodes = node.childNodes;","                children = [];","","                for (i = 0, len = childNodes.length; i < len; ++i) {","                    if (childNodes[i].tagName) {","                        children[children.length] = childNodes[i];","                    }","                }","            }","            return Y.all(children);","        }","    },","","    value: {","        getter: function() {","            return Y_DOM.getValue(this._node);","        },","","        setter: function(val) {","            Y_DOM.setValue(this._node, val);","            return val;","        }","    }","};","","Y.Node.importMethod(Y.DOM, [","    /**","     * Allows setting attributes on DOM nodes, normalizing in some cases.","     * This passes through to the DOM node, allowing for custom attributes.","     * @method setAttribute","     * @for Node","     * @for NodeList","     * @chainable","     * @param {string} name The attribute name","     * @param {string} value The value to set","     */","    'setAttribute',","    /**","     * Allows getting attributes on DOM nodes, normalizing in some cases.","     * This passes through to the DOM node, allowing for custom attributes.","     * @method getAttribute","     * @for Node","     * @for NodeList","     * @param {string} name The attribute name","     * @return {string} The attribute value","     */","    'getAttribute'","","]);","/**"," * @module node"," * @submodule node-base"," */","","var Y_Node = Y.Node;","var Y_NodeList = Y.NodeList;","/**"," * List of events that route to DOM events"," * @static"," * @property DOM_EVENTS"," * @for Node"," */","","Y_Node.DOM_EVENTS = {","    abort: 1,","    beforeunload: 1,","    blur: 1,","    change: 1,","    click: 1,","    close: 1,","    command: 1,","    contextmenu: 1,","    dblclick: 1,","    DOMMouseScroll: 1,","    drag: 1,","    dragstart: 1,","    dragenter: 1,","    dragover: 1,","    dragleave: 1,","    dragend: 1,","    drop: 1,","    error: 1,","    focus: 1,","    key: 1,","    keydown: 1,","    keypress: 1,","    keyup: 1,","    load: 1,","    message: 1,","    mousedown: 1,","    mouseenter: 1,","    mouseleave: 1,","    mousemove: 1,","    mousemultiwheel: 1,","    mouseout: 1,","    mouseover: 1,","    mouseup: 1,","    mousewheel: 1,","    orientationchange: 1,","    reset: 1,","    resize: 1,","    select: 1,","    selectstart: 1,","    submit: 1,","    scroll: 1,","    textInput: 1,","    unload: 1","};","","// Add custom event adaptors to this list.  This will make it so","// that delegate, key, available, contentready, etc all will","// be available through Node.on","Y.mix(Y_Node.DOM_EVENTS, Y.Env.evt.plugins);","","Y.augment(Y_Node, Y.EventTarget);","","Y.mix(Y_Node.prototype, {","    /**","     * Removes event listeners from the node and (optionally) its subtree","     * @method purge","     * @param {Boolean} recurse (optional) Whether or not to remove listeners from the","     * node's subtree","     * @param {String} type (optional) Only remove listeners of the specified type","     * @chainable","     *","     */","    purge: function(recurse, type) {","        Y.Event.purgeElement(this._node, recurse, type);","        return this;","    }","","});","","Y.mix(Y.NodeList.prototype, {","    _prepEvtArgs: function(type, fn, context) {","        // map to Y.on/after signature (type, fn, nodes, context, arg1, arg2, etc)","        var args = Y.Array(arguments, 0, true);","","        if (args.length < 2) { // type only (event hash) just add nodes","            args[2] = this._nodes;","        } else {","            args.splice(2, 0, this._nodes);","        }","","        args[3] = context || this; // default to NodeList instance as context","","        return args;","    },","","    /**","    Subscribe a callback function for each `Node` in the collection to execute","    in response to a DOM event.","","    NOTE: Generally, the `on()` method should be avoided on `NodeLists`, in","    favor of using event delegation from a parent Node.  See the Event user","    guide for details.","","    Most DOM events are associated with a preventable default behavior, such as","    link clicks navigating to a new page.  Callbacks are passed a","    `DOMEventFacade` object as their first argument (usually called `e`) that","    can be used to prevent this default behavior with `e.preventDefault()`. See","    the `DOMEventFacade` API for all available properties and methods on the","    object.","","    By default, the `this` object will be the `NodeList` that the subscription","    came from, <em>not the `Node` that received the event</em>.  Use","    `e.currentTarget` to refer to the `Node`.","","    Returning `false` from a callback is supported as an alternative to calling","    `e.preventDefault(); e.stopPropagation();`.  However, it is recommended to","    use the event methods.","","    @example","","        Y.all(\".sku\").on(\"keydown\", function (e) {","            if (e.keyCode === 13) {","                e.preventDefault();","","                // Use e.currentTarget to refer to the individual Node","                var item = Y.MyApp.searchInventory( e.currentTarget.get('value') );","                // etc ...","            }","        });","","    @method on","    @param {String} type The name of the event","    @param {Function} fn The callback to execute in response to the event","    @param {Object} [context] Override `this` object in callback","    @param {Any} [arg*] 0..n additional arguments to supply to the subscriber","    @return {EventHandle} A subscription handle capable of detaching that","                          subscription","    @for NodeList","    **/","    on: function(type, fn, context) {","        return Y.on.apply(Y, this._prepEvtArgs.apply(this, arguments));","    },","","    /**","     * Applies an one-time event listener to each Node bound to the NodeList.","     * @method once","     * @param {String} type The event being listened for","     * @param {Function} fn The handler to call when the event fires","     * @param {Object} context The context to call the handler with.","     * Default is the NodeList instance.","     * @return {EventHandle} A subscription handle capable of detaching that","     *                    subscription","     * @for NodeList","     */","    once: function(type, fn, context) {","        return Y.once.apply(Y, this._prepEvtArgs.apply(this, arguments));","    },","","    /**","     * Applies an event listener to each Node bound to the NodeList.","     * The handler is called only after all on() handlers are called","     * and the event is not prevented.","     * @method after","     * @param {String} type The event being listened for","     * @param {Function} fn The handler to call when the event fires","     * @param {Object} context The context to call the handler with.","     * Default is the NodeList instance.","     * @return {EventHandle} A subscription handle capable of detaching that","     *                    subscription","     * @for NodeList","     */","    after: function(type, fn, context) {","        return Y.after.apply(Y, this._prepEvtArgs.apply(this, arguments));","    },","","    /**","     * Applies an one-time event listener to each Node bound to the NodeList","     * that will be called only after all on() handlers are called and the","     * event is not prevented.","     *","     * @method onceAfter","     * @param {String} type The event being listened for","     * @param {Function} fn The handler to call when the event fires","     * @param {Object} context The context to call the handler with.","     * Default is the NodeList instance.","     * @return {EventHandle} A subscription handle capable of detaching that","     *                    subscription","     * @for NodeList","     */","    onceAfter: function(type, fn, context) {","        return Y.onceAfter.apply(Y, this._prepEvtArgs.apply(this, arguments));","    }","});","","Y_NodeList.importMethod(Y.Node.prototype, [","    /**","      * Called on each Node instance","      * @method detach","      * @see Node.detach","      * @for NodeList","      */","    'detach',","","    /** Called on each Node instance","      * @method detachAll","      * @see Node.detachAll","      * @for NodeList","      */","    'detachAll'","]);","","/**","Subscribe a callback function to execute in response to a DOM event or custom","event.","","Most DOM events are associated with a preventable default behavior such as","link clicks navigating to a new page.  Callbacks are passed a `DOMEventFacade`","object as their first argument (usually called `e`) that can be used to","prevent this default behavior with `e.preventDefault()`. See the","`DOMEventFacade` API for all available properties and methods on the object.","","If the event name passed as the first parameter is not a whitelisted DOM event,","it will be treated as a custom event subscriptions, allowing","`node.fire('customEventName')` later in the code.  Refer to the Event user guide","for the full DOM event whitelist.","","By default, the `this` object in the callback will refer to the subscribed","`Node`.","","Returning `false` from a callback is supported as an alternative to calling","`e.preventDefault(); e.stopPropagation();`.  However, it is recommended to use","the event methods.","","@example","","    Y.one(\"#my-form\").on(\"submit\", function (e) {","        e.preventDefault();","","        // proceed with ajax form submission instead...","    });","","@method on","@param {String} type The name of the event","@param {Function} fn The callback to execute in response to the event","@param {Object} [context] Override `this` object in callback","@param {Any} [arg*] 0..n additional arguments to supply to the subscriber","@return {EventHandle} A subscription handle capable of detaching that","                      subscription","@for Node","**/","","Y.mix(Y.Node.ATTRS, {","    offsetHeight: {","        setter: function(h) {","            Y.DOM.setHeight(this._node, h);","            return h;","        },","","        getter: function() {","            return this._node.offsetHeight;","        }","    },","","    offsetWidth: {","        setter: function(w) {","            Y.DOM.setWidth(this._node, w);","            return w;","        },","","        getter: function() {","            return this._node.offsetWidth;","        }","    }","});","","Y.mix(Y.Node.prototype, {","    sizeTo: function(w, h) {","        var node;","        if (arguments.length < 2) {","            node = Y.one(w);","            w = node.get('offsetWidth');","            h = node.get('offsetHeight');","        }","","        this.setAttrs({","            offsetWidth: w,","            offsetHeight: h","        });","    }","});","/**"," * @module node"," * @submodule node-base"," */","","var Y_Node = Y.Node;","","Y.mix(Y_Node.prototype, {","    /**","     * Makes the node visible.","     * If the \"transition\" module is loaded, show optionally","     * animates the showing of the node using either the default","     * transition effect ('fadeIn'), or the given named effect.","     * @method show","     * @for Node","     * @param {String} name A named Transition effect to use as the show effect.","     * @param {Object} config Options to use with the transition.","     * @param {Function} callback An optional function to run after the transition completes.","     * @chainable","     */","    show: function(callback) {","        callback = arguments[arguments.length - 1];","        this.toggleView(true, callback);","        return this;","    },","","    /**","     * The implementation for showing nodes.","     * Default is to toggle the style.display property.","     * @method _show","     * @protected","     * @chainable","     */","    _show: function() {","        this.setStyle('display', '');","","    },","","    _isHidden: function() {","        return Y.DOM.getStyle(this._node, 'display') === 'none';","    },","","    /**","     * Displays or hides the node.","     * If the \"transition\" module is loaded, toggleView optionally","     * animates the toggling of the node using either the default","     * transition effect ('fadeIn'), or the given named effect.","     * @method toggleView","     * @for Node","     * @param {Boolean} [on] An optional boolean value to force the node to be shown or hidden","     * @param {Function} [callback] An optional function to run after the transition completes.","     * @chainable","     */","    toggleView: function(on, callback) {","        this._toggleView.apply(this, arguments);","        return this;","    },","","    _toggleView: function(on, callback) {","        callback = arguments[arguments.length - 1];","","        // base on current state if not forcing","        if (typeof on != 'boolean') {","            on = (this._isHidden()) ? 1 : 0;","        }","","        if (on) {","            this._show();","        }  else {","            this._hide();","        }","","        if (typeof callback == 'function') {","            callback.call(this);","        }","","        return this;","    },","","    /**","     * Hides the node.","     * If the \"transition\" module is loaded, hide optionally","     * animates the hiding of the node using either the default","     * transition effect ('fadeOut'), or the given named effect.","     * @method hide","     * @param {String} name A named Transition effect to use as the show effect.","     * @param {Object} config Options to use with the transition.","     * @param {Function} callback An optional function to run after the transition completes.","     * @chainable","     */","    hide: function(callback) {","        callback = arguments[arguments.length - 1];","        this.toggleView(false, callback);","        return this;","    },","","    /**","     * The implementation for hiding nodes.","     * Default is to toggle the style.display property.","     * @method _hide","     * @protected","     * @chainable","     */","    _hide: function() {","        this.setStyle('display', 'none');","    }","});","","Y.NodeList.importMethod(Y.Node.prototype, [","    /**","     * Makes each node visible.","     * If the \"transition\" module is loaded, show optionally","     * animates the showing of the node using either the default","     * transition effect ('fadeIn'), or the given named effect.","     * @method show","     * @param {String} name A named Transition effect to use as the show effect.","     * @param {Object} config Options to use with the transition.","     * @param {Function} callback An optional function to run after the transition completes.","     * @for NodeList","     * @chainable","     */","    'show',","","    /**","     * Hides each node.","     * If the \"transition\" module is loaded, hide optionally","     * animates the hiding of the node using either the default","     * transition effect ('fadeOut'), or the given named effect.","     * @method hide","     * @param {String} name A named Transition effect to use as the show effect.","     * @param {Object} config Options to use with the transition.","     * @param {Function} callback An optional function to run after the transition completes.","     * @chainable","     */","    'hide',","","    /**","     * Displays or hides each node.","     * If the \"transition\" module is loaded, toggleView optionally","     * animates the toggling of the nodes using either the default","     * transition effect ('fadeIn'), or the given named effect.","     * @method toggleView","     * @param {Boolean} [on] An optional boolean value to force the nodes to be shown or hidden","     * @param {Function} [callback] An optional function to run after the transition completes.","     * @chainable","     */","    'toggleView'","]);","","if (!Y.config.doc.documentElement.hasAttribute) { // IE < 8","    Y.Node.prototype.hasAttribute = function(attr) {","        if (attr === 'value') {","            if (this.get('value') !== \"\") { // IE < 8 fails to populate specified when set in HTML","                return true;","            }","        }","        return !!(this._node.attributes[attr] &&","                this._node.attributes[attr].specified);","    };","}","","// IE throws an error when calling focus() on an element that's invisible, not","// displayed, or disabled.","Y.Node.prototype.focus = function () {","    try {","        this._node.focus();","    } catch (e) {","    }","","    return this;","};","","// IE throws error when setting input.type = 'hidden',","// input.setAttribute('type', 'hidden') and input.attributes.type.value = 'hidden'","Y.Node.ATTRS.type = {","    setter: function(val) {","        if (val === 'hidden') {","            try {","                this._node.type = 'hidden';","            } catch(e) {","                this.setStyle('display', 'none');","                this._inputType = 'hidden';","            }","        } else {","            try { // IE errors when changing the type from \"hidden'","                this._node.type = val;","            } catch (e) {","            }","        }","        return val;","    },","","    getter: function() {","        return this._inputType || this._node.type;","    },","","    _bypassProxy: true // don't update DOM when using with Attribute","};","","if (Y.config.doc.createElement('form').elements.nodeType) {","    // IE: elements collection is also FORM node which trips up scrubVal.","    Y.Node.ATTRS.elements = {","            getter: function() {","                return this.all('input, textarea, button, select');","            }","    };","}","","/**"," * Provides methods for managing custom Node data."," * "," * @module node"," * @main node"," * @submodule node-data"," */","","Y.mix(Y.Node.prototype, {","    _initData: function() {","        if (! ('_data' in this)) {","            this._data = {};","        }","    },","","    /**","    * @method getData","    * @for Node","    * @description Retrieves arbitrary data stored on a Node instance.","    * If no data is associated with the Node, it will attempt to retrieve","    * a value from the corresponding HTML data attribute. (e.g. node.getData('foo')","    * will check node.getAttribute('data-foo')).","    * @param {string} name Optional name of the data field to retrieve.","    * If no name is given, all data is returned.","    * @return {any | Object} Whatever is stored at the given field,","    * or an object hash of all fields.","    */","    getData: function(name) {","        this._initData();","        var data = this._data,","            ret = data;","","        if (arguments.length) { // single field","            if (name in data) {","                ret = data[name];","            } else { // initialize from HTML attribute","                ret = this._getDataAttribute(name);","            }","        } else if (typeof data == 'object' && data !== null) { // all fields","            ret = {};","            Y.Object.each(data, function(v, n) {","                ret[n] = v;","            });","","            ret = this._getDataAttributes(ret);","        }","","        return ret;","","    },","","    _getDataAttributes: function(ret) {","        ret = ret || {};","        var i = 0,","            attrs = this._node.attributes,","            len = attrs.length,","            prefix = this.DATA_PREFIX,","            prefixLength = prefix.length,","            name;","","        while (i < len) {","            name = attrs[i].name;","            if (name.indexOf(prefix) === 0) {","                name = name.substr(prefixLength);","                if (!(name in ret)) { // only merge if not already stored","                    ret[name] = this._getDataAttribute(name);","                }","            }","","            i += 1;","        }","","        return ret;","    },","","    _getDataAttribute: function(name) {","        var name = this.DATA_PREFIX + name,","            node = this._node,","            attrs = node.attributes,","            data = attrs && attrs[name] && attrs[name].value;","","        return data;","    },","","    /**","    * @method setData","    * @for Node","    * @description Stores arbitrary data on a Node instance.","    * This is not stored with the DOM node.","    * @param {string} name The name of the field to set. If no val","    * is given, name is treated as the data and overrides any existing data.","    * @param {any} val The value to be assigned to the field.","    * @chainable","    */","    setData: function(name, val) {","        this._initData();","        if (arguments.length > 1) {","            this._data[name] = val;","        } else {","            this._data = name;","        }","","       return this;","    },","","    /**","    * @method clearData","    * @for Node","    * @description Clears internally stored data.","    * @param {string} name The name of the field to clear. If no name","    * is given, all data is cleared.","    * @chainable","    */","    clearData: function(name) {","        if ('_data' in this) {","            if (typeof name != 'undefined') {","                delete this._data[name];","            } else {","                delete this._data;","            }","        }","","        return this;","    }","});","","Y.mix(Y.NodeList.prototype, {","    /**","    * @method getData","    * @for NodeList","    * @description Retrieves arbitrary data stored on each Node instance","    * bound to the NodeList.","    * @see Node","    * @param {string} name Optional name of the data field to retrieve.","    * If no name is given, all data is returned.","    * @return {Array} An array containing all of the data for each Node instance. ","    * or an object hash of all fields.","    */","    getData: function(name) {","        var args = (arguments.length) ? [name] : [];","        return this._invoke('getData', args, true);","    },","","    /**","    * @method setData","    * @for NodeList","    * @description Stores arbitrary data on each Node instance bound to the","    *  NodeList. This is not stored with the DOM node.","    * @param {string} name The name of the field to set. If no name","    * is given, name is treated as the data and overrides any existing data.","    * @param {any} val The value to be assigned to the field.","    * @chainable","    */","    setData: function(name, val) {","        var args = (arguments.length > 1) ? [name, val] : [name];","        return this._invoke('setData', args);","    },","","    /**","    * @method clearData","    * @for NodeList","    * @description Clears data on all Node instances bound to the NodeList.","    * @param {string} name The name of the field to clear. If no name","    * is given, all data is cleared.","    * @chainable","    */","    clearData: function(name) {","        var args = (arguments.length) ? [name] : [];","        return this._invoke('clearData', [name]);","    }","});","","","}, '3.7.3', {\"requires\": [\"event-base\", \"node-core\", \"dom-base\"]});"];
_yuitest_coverage["build/node-base/node-base.js"].lines = {"1":0,"8":0,"54":0,"97":0,"103":0,"117":0,"118":0,"119":0,"121":0,"124":0,"163":0,"164":0,"168":0,"171":0,"172":0,"173":0,"174":0,"177":0,"178":0,"180":0,"182":0,"194":0,"206":0,"217":0,"229":0,"239":0,"240":0,"254":0,"255":0,"265":0,"277":0,"284":0,"286":0,"368":0,"377":0,"386":0,"390":0,"391":0,"403":0,"407":0,"408":0,"414":0,"426":0,"430":0,"431":0,"432":0,"434":0,"435":0,"436":0,"440":0,"446":0,"450":0,"451":0,"456":0,"485":0,"486":0,"494":0,"543":0,"545":0,"547":0,"558":0,"559":0,"564":0,"567":0,"569":0,"570":0,"572":0,"575":0,"577":0,"625":0,"640":0,"657":0,"675":0,"679":0,"736":0,"739":0,"740":0,"744":0,"750":0,"751":0,"755":0,"760":0,"762":0,"763":0,"764":0,"765":0,"766":0,"769":0,"780":0,"782":0,"796":0,"797":0,"798":0,"809":0,"814":0,"829":0,"830":0,"834":0,"837":0,"838":0,"841":0,"842":0,"844":0,"847":0,"848":0,"851":0,"866":0,"867":0,"868":0,"879":0,"883":0,"924":0,"925":0,"926":0,"927":0,"928":0,"931":0,"938":0,"939":0,"940":0,"944":0,"949":0,"951":0,"952":0,"953":0,"955":0,"956":0,"959":0,"960":0,"964":0,"968":0,"974":0,"976":0,"978":0,"991":0,"993":0,"994":0,"1011":0,"1012":0,"1015":0,"1016":0,"1017":0,"1019":0,"1021":0,"1022":0,"1023":0,"1024":0,"1027":0,"1030":0,"1035":0,"1036":0,"1043":0,"1044":0,"1045":0,"1046":0,"1047":0,"1048":0,"1052":0,"1055":0,"1059":0,"1064":0,"1078":0,"1079":0,"1080":0,"1082":0,"1085":0,"1097":0,"1098":0,"1099":0,"1101":0,"1105":0,"1109":0,"1122":0,"1123":0,"1137":0,"1138":0,"1150":0,"1151":0};
_yuitest_coverage["build/node-base/node-base.js"].functions = {"create:117":0,"insert:162":0,"_insert:167":0,"prepend:193":0,"append:205":0,"appendChild:216":0,"insertBefore:228":0,"appendTo:238":0,"setContent:253":0,"getContent:264":0,"getter:385":0,"setter:389":0,"getter:402":0,"setter:406":0,"getter:413":0,"getter:425":0,"getter:445":0,"setter:449":0,"purge:557":0,"_prepEvtArgs:565":0,"on:624":0,"once:639":0,"after:656":0,"onceAfter:674":0,"setter:738":0,"getter:743":0,"setter:749":0,"getter:754":0,"sizeTo:761":0,"show:795":0,"_show:808":0,"_isHidden:813":0,"toggleView:828":0,"_toggleView:833":0,"hide:865":0,"_hide:878":0,"hasAttribute:925":0,"focus:938":0,"setter:950":0,"getter:967":0,"getter:977":0,"_initData:992":0,"(anonymous 2):1023":0,"getData:1010":0,"_getDataAttributes:1034":0,"_getDataAttribute:1058":0,"setData:1077":0,"clearData:1096":0,"getData:1121":0,"setData:1136":0,"clearData:1149":0,"(anonymous 1):1":0};
_yuitest_coverage["build/node-base/node-base.js"].coveredLines = 178;
_yuitest_coverage["build/node-base/node-base.js"].coveredFunctions = 52;
_yuitest_coverline("build/node-base/node-base.js", 1);
YUI.add('node-base', function (Y, NAME) {

/**
 * @module node
 * @submodule node-base
 */

_yuitest_coverfunc("build/node-base/node-base.js", "(anonymous 1)", 1);
_yuitest_coverline("build/node-base/node-base.js", 8);
var methods = [
/**
 * Determines whether each node has the given className.
 * @method hasClass
 * @for Node
 * @param {String} className the class name to search for
 * @return {Boolean} Whether or not the element has the specified class
 */
 'hasClass',

/**
 * Adds a class name to each node.
 * @method addClass
 * @param {String} className the class name to add to the node's class attribute
 * @chainable
 */
 'addClass',

/**
 * Removes a class name from each node.
 * @method removeClass
 * @param {String} className the class name to remove from the node's class attribute
 * @chainable
 */
 'removeClass',

/**
 * Replace a class with another class for each node.
 * If no oldClassName is present, the newClassName is simply added.
 * @method replaceClass
 * @param {String} oldClassName the class name to be replaced
 * @param {String} newClassName the class name that will be replacing the old class name
 * @chainable
 */
 'replaceClass',

/**
 * If the className exists on the node it is removed, if it doesn't exist it is added.
 * @method toggleClass
 * @param {String} className the class name to be toggled
 * @param {Boolean} force Option to force adding or removing the class.
 * @chainable
 */
 'toggleClass'
];

_yuitest_coverline("build/node-base/node-base.js", 54);
Y.Node.importMethod(Y.DOM, methods);
/**
 * Determines whether each node has the given className.
 * @method hasClass
 * @see Node.hasClass
 * @for NodeList
 * @param {String} className the class name to search for
 * @return {Array} An array of booleans for each node bound to the NodeList.
 */

/**
 * Adds a class name to each node.
 * @method addClass
 * @see Node.addClass
 * @param {String} className the class name to add to the node's class attribute
 * @chainable
 */

/**
 * Removes a class name from each node.
 * @method removeClass
 * @see Node.removeClass
 * @param {String} className the class name to remove from the node's class attribute
 * @chainable
 */

/**
 * Replace a class with another class for each node.
 * If no oldClassName is present, the newClassName is simply added.
 * @method replaceClass
 * @see Node.replaceClass
 * @param {String} oldClassName the class name to be replaced
 * @param {String} newClassName the class name that will be replacing the old class name
 * @chainable
 */

/**
 * If the className exists on the node it is removed, if it doesn't exist it is added.
 * @method toggleClass
 * @see Node.toggleClass
 * @param {String} className the class name to be toggled
 * @chainable
 */
_yuitest_coverline("build/node-base/node-base.js", 97);
Y.NodeList.importMethod(Y.Node.prototype, methods);
/**
 * @module node
 * @submodule node-base
 */

_yuitest_coverline("build/node-base/node-base.js", 103);
var Y_Node = Y.Node,
    Y_DOM = Y.DOM;

/**
 * Returns a new dom node using the provided markup string.
 * @method create
 * @static
 * @param {String} html The markup used to create the element
 * Use <a href="../classes/Escape.html#method_html">`Y.Escape.html()`</a>
 * to escape html content.
 * @param {HTMLDocument} doc An optional document context
 * @return {Node} A Node instance bound to a DOM node or fragment
 * @for Node
 */
_yuitest_coverline("build/node-base/node-base.js", 117);
Y_Node.create = function(html, doc) {
    _yuitest_coverfunc("build/node-base/node-base.js", "create", 117);
_yuitest_coverline("build/node-base/node-base.js", 118);
if (doc && doc._node) {
        _yuitest_coverline("build/node-base/node-base.js", 119);
doc = doc._node;
    }
    _yuitest_coverline("build/node-base/node-base.js", 121);
return Y.one(Y_DOM.create(html, doc));
};

_yuitest_coverline("build/node-base/node-base.js", 124);
Y.mix(Y_Node.prototype, {
    /**
     * Creates a new Node using the provided markup string.
     * @method create
     * @param {String} html The markup used to create the element.
     * Use <a href="../classes/Escape.html#method_html">`Y.Escape.html()`</a>
     * to escape html content.
     * @param {HTMLDocument} doc An optional document context
     * @return {Node} A Node instance bound to a DOM node or fragment
     */
    create: Y_Node.create,

    /**
     * Inserts the content before the reference node.
     * @method insert
     * @param {String | Node | HTMLElement | NodeList | HTMLCollection} content The content to insert
     * Use <a href="../classes/Escape.html#method_html">`Y.Escape.html()`</a>
     * to escape html content.
     * @param {Int | Node | HTMLElement | String} where The position to insert at.
     * Possible "where" arguments
     * <dl>
     * <dt>Y.Node</dt>
     * <dd>The Node to insert before</dd>
     * <dt>HTMLElement</dt>
     * <dd>The element to insert before</dd>
     * <dt>Int</dt>
     * <dd>The index of the child element to insert before</dd>
     * <dt>"replace"</dt>
     * <dd>Replaces the existing HTML</dd>
     * <dt>"before"</dt>
     * <dd>Inserts before the existing HTML</dd>
     * <dt>"before"</dt>
     * <dd>Inserts content before the node</dd>
     * <dt>"after"</dt>
     * <dd>Inserts content after the node</dd>
     * </dl>
     * @chainable
     */
    insert: function(content, where) {
        _yuitest_coverfunc("build/node-base/node-base.js", "insert", 162);
_yuitest_coverline("build/node-base/node-base.js", 163);
this._insert(content, where);
        _yuitest_coverline("build/node-base/node-base.js", 164);
return this;
    },

    _insert: function(content, where) {
        _yuitest_coverfunc("build/node-base/node-base.js", "_insert", 167);
_yuitest_coverline("build/node-base/node-base.js", 168);
var node = this._node,
            ret = null;

        _yuitest_coverline("build/node-base/node-base.js", 171);
if (typeof where == 'number') { // allow index
            _yuitest_coverline("build/node-base/node-base.js", 172);
where = this._node.childNodes[where];
        } else {_yuitest_coverline("build/node-base/node-base.js", 173);
if (where && where._node) { // Node
            _yuitest_coverline("build/node-base/node-base.js", 174);
where = where._node;
        }}

        _yuitest_coverline("build/node-base/node-base.js", 177);
if (content && typeof content != 'string') { // allow Node or NodeList/Array instances
            _yuitest_coverline("build/node-base/node-base.js", 178);
content = content._node || content._nodes || content;
        }
        _yuitest_coverline("build/node-base/node-base.js", 180);
ret = Y_DOM.addHTML(node, content, where);

        _yuitest_coverline("build/node-base/node-base.js", 182);
return ret;
    },

    /**
     * Inserts the content as the firstChild of the node.
     * @method prepend
     * @param {String | Node | HTMLElement} content The content to insert
     * Use <a href="../classes/Escape.html#method_html">`Y.Escape.html()`</a>
     * to escape html content.
     * @chainable
     */
    prepend: function(content) {
        _yuitest_coverfunc("build/node-base/node-base.js", "prepend", 193);
_yuitest_coverline("build/node-base/node-base.js", 194);
return this.insert(content, 0);
    },

    /**
     * Inserts the content as the lastChild of the node.
     * @method append
     * @param {String | Node | HTMLElement} content The content to insert
     * Use <a href="../classes/Escape.html#method_html">`Y.Escape.html()`</a>
     * to escape html content.
     * @chainable
     */
    append: function(content) {
        _yuitest_coverfunc("build/node-base/node-base.js", "append", 205);
_yuitest_coverline("build/node-base/node-base.js", 206);
return this.insert(content, null);
    },

    /**
     * @method appendChild
     * @param {String | HTMLElement | Node} node Node to be appended
     * Use <a href="../classes/Escape.html#method_html">`Y.Escape.html()`</a>
     * to escape html content.
     * @return {Node} The appended node
     */
    appendChild: function(node) {
        _yuitest_coverfunc("build/node-base/node-base.js", "appendChild", 216);
_yuitest_coverline("build/node-base/node-base.js", 217);
return Y_Node.scrubVal(this._insert(node));
    },

    /**
     * @method insertBefore
     * @param {String | HTMLElement | Node} newNode Node to be appended
     * @param {HTMLElement | Node} refNode Node to be inserted before
     * Use <a href="../classes/Escape.html#method_html">`Y.Escape.html()`</a>
     * to escape html content.
     * @return {Node} The inserted node
     */
    insertBefore: function(newNode, refNode) {
        _yuitest_coverfunc("build/node-base/node-base.js", "insertBefore", 228);
_yuitest_coverline("build/node-base/node-base.js", 229);
return Y.Node.scrubVal(this._insert(newNode, refNode));
    },

    /**
     * Appends the node to the given node.
     * @method appendTo
     * @param {Node | HTMLElement} node The node to append to
     * @chainable
     */
    appendTo: function(node) {
        _yuitest_coverfunc("build/node-base/node-base.js", "appendTo", 238);
_yuitest_coverline("build/node-base/node-base.js", 239);
Y.one(node).append(this);
        _yuitest_coverline("build/node-base/node-base.js", 240);
return this;
    },

    /**
     * Replaces the node's current content with the content.
     * Note that this passes to innerHTML and is not escaped.
     * Use <a href="../classes/Escape.html#method_html">`Y.Escape.html()`</a>
     * to escape html content or `set('text')` to add as text.
     * @method setContent
     * @deprecated Use setHTML
     * @param {String | Node | HTMLElement | NodeList | HTMLCollection} content The content to insert
     * @chainable
     */
    setContent: function(content) {
        _yuitest_coverfunc("build/node-base/node-base.js", "setContent", 253);
_yuitest_coverline("build/node-base/node-base.js", 254);
this._insert(content, 'replace');
        _yuitest_coverline("build/node-base/node-base.js", 255);
return this;
    },

    /**
     * Returns the node's current content (e.g. innerHTML)
     * @method getContent
     * @deprecated Use getHTML
     * @return {String} The current content
     */
    getContent: function(content) {
        _yuitest_coverfunc("build/node-base/node-base.js", "getContent", 264);
_yuitest_coverline("build/node-base/node-base.js", 265);
return this.get('innerHTML');
    }
});

/**
 * Replaces the node's current html content with the content provided.
 * Note that this passes to innerHTML and is not escaped.
 * Use `Y.Escape.html()` to escape HTML, or `set('text')` to add as text.
 * @method setHTML
 * @param {String | HTML | Node | HTMLElement | NodeList | HTMLCollection} content The content to insert
 * @chainable
 */
_yuitest_coverline("build/node-base/node-base.js", 277);
Y.Node.prototype.setHTML = Y.Node.prototype.setContent;

/**
 * Returns the node's current html content (e.g. innerHTML)
 * @method getHTML
 * @return {String} The html content
 */
_yuitest_coverline("build/node-base/node-base.js", 284);
Y.Node.prototype.getHTML = Y.Node.prototype.getContent;

_yuitest_coverline("build/node-base/node-base.js", 286);
Y.NodeList.importMethod(Y.Node.prototype, [
    /**
     * Called on each Node instance
     * @for NodeList
     * @method append
     * @see Node.append
     */
    'append',

    /**
     * Called on each Node instance
     * @for NodeList
     * @method insert
     * @see Node.insert
     */
    'insert',

    /**
     * Called on each Node instance
     * @for NodeList
     * @method appendChild
     * @see Node.appendChild
     */
    'appendChild',

    /**
     * Called on each Node instance
     * @for NodeList
     * @method insertBefore
     * @see Node.insertBefore
     */
    'insertBefore',

    /**
     * Called on each Node instance
     * @for NodeList
     * @method prepend
     * @see Node.prepend
     */
    'prepend',

    /**
     * Called on each Node instance
     * Note that this passes to innerHTML and is not escaped.
     * Use `Y.Escape.html()` to escape HTML, or `set('text')` to add as text.
     * @for NodeList
     * @method setContent
     * @deprecated Use setHTML
     */
    'setContent',

    /**
     * Called on each Node instance
     * @for NodeList
     * @method getContent
     * @deprecated Use getHTML
     */
    'getContent',

    /**
     * Called on each Node instance
     * Note that this passes to innerHTML and is not escaped.
     * Use `Y.Escape.html()` to escape HTML, or `set('text')` to add as text.
     * @for NodeList
     * @method setHTML
     * @see Node.setHTML
     */
    'setHTML',

    /**
     * Called on each Node instance
     * @for NodeList
     * @method getHTML
     * @see Node.getHTML
     */
    'getHTML'
]);
/**
 * @module node
 * @submodule node-base
 */

_yuitest_coverline("build/node-base/node-base.js", 368);
var Y_Node = Y.Node,
    Y_DOM = Y.DOM;

/**
 * Static collection of configuration attributes for special handling
 * @property ATTRS
 * @static
 * @type object
 */
_yuitest_coverline("build/node-base/node-base.js", 377);
Y_Node.ATTRS = {
    /**
     * Allows for getting and setting the text of an element.
     * Formatting is preserved and special characters are treated literally.
     * @config text
     * @type String
     */
    text: {
        getter: function() {
            _yuitest_coverfunc("build/node-base/node-base.js", "getter", 385);
_yuitest_coverline("build/node-base/node-base.js", 386);
return Y_DOM.getText(this._node);
        },

        setter: function(content) {
            _yuitest_coverfunc("build/node-base/node-base.js", "setter", 389);
_yuitest_coverline("build/node-base/node-base.js", 390);
Y_DOM.setText(this._node, content);
            _yuitest_coverline("build/node-base/node-base.js", 391);
return content;
        }
    },

    /**
     * Allows for getting and setting the text of an element.
     * Formatting is preserved and special characters are treated literally.
     * @config for
     * @type String
     */
    'for': {
        getter: function() {
            _yuitest_coverfunc("build/node-base/node-base.js", "getter", 402);
_yuitest_coverline("build/node-base/node-base.js", 403);
return Y_DOM.getAttribute(this._node, 'for');
        },

        setter: function(val) {
            _yuitest_coverfunc("build/node-base/node-base.js", "setter", 406);
_yuitest_coverline("build/node-base/node-base.js", 407);
Y_DOM.setAttribute(this._node, 'for', val);
            _yuitest_coverline("build/node-base/node-base.js", 408);
return val;
        }
    },

    'options': {
        getter: function() {
            _yuitest_coverfunc("build/node-base/node-base.js", "getter", 413);
_yuitest_coverline("build/node-base/node-base.js", 414);
return this._node.getElementsByTagName('option');
        }
    },

    /**
     * Returns a NodeList instance of all HTMLElement children.
     * @readOnly
     * @config children
     * @type NodeList
     */
    'children': {
        getter: function() {
            _yuitest_coverfunc("build/node-base/node-base.js", "getter", 425);
_yuitest_coverline("build/node-base/node-base.js", 426);
var node = this._node,
                children = node.children,
                childNodes, i, len;

            _yuitest_coverline("build/node-base/node-base.js", 430);
if (!children) {
                _yuitest_coverline("build/node-base/node-base.js", 431);
childNodes = node.childNodes;
                _yuitest_coverline("build/node-base/node-base.js", 432);
children = [];

                _yuitest_coverline("build/node-base/node-base.js", 434);
for (i = 0, len = childNodes.length; i < len; ++i) {
                    _yuitest_coverline("build/node-base/node-base.js", 435);
if (childNodes[i].tagName) {
                        _yuitest_coverline("build/node-base/node-base.js", 436);
children[children.length] = childNodes[i];
                    }
                }
            }
            _yuitest_coverline("build/node-base/node-base.js", 440);
return Y.all(children);
        }
    },

    value: {
        getter: function() {
            _yuitest_coverfunc("build/node-base/node-base.js", "getter", 445);
_yuitest_coverline("build/node-base/node-base.js", 446);
return Y_DOM.getValue(this._node);
        },

        setter: function(val) {
            _yuitest_coverfunc("build/node-base/node-base.js", "setter", 449);
_yuitest_coverline("build/node-base/node-base.js", 450);
Y_DOM.setValue(this._node, val);
            _yuitest_coverline("build/node-base/node-base.js", 451);
return val;
        }
    }
};

_yuitest_coverline("build/node-base/node-base.js", 456);
Y.Node.importMethod(Y.DOM, [
    /**
     * Allows setting attributes on DOM nodes, normalizing in some cases.
     * This passes through to the DOM node, allowing for custom attributes.
     * @method setAttribute
     * @for Node
     * @for NodeList
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
     * @for NodeList
     * @param {string} name The attribute name
     * @return {string} The attribute value
     */
    'getAttribute'

]);
/**
 * @module node
 * @submodule node-base
 */

_yuitest_coverline("build/node-base/node-base.js", 485);
var Y_Node = Y.Node;
_yuitest_coverline("build/node-base/node-base.js", 486);
var Y_NodeList = Y.NodeList;
/**
 * List of events that route to DOM events
 * @static
 * @property DOM_EVENTS
 * @for Node
 */

_yuitest_coverline("build/node-base/node-base.js", 494);
Y_Node.DOM_EVENTS = {
    abort: 1,
    beforeunload: 1,
    blur: 1,
    change: 1,
    click: 1,
    close: 1,
    command: 1,
    contextmenu: 1,
    dblclick: 1,
    DOMMouseScroll: 1,
    drag: 1,
    dragstart: 1,
    dragenter: 1,
    dragover: 1,
    dragleave: 1,
    dragend: 1,
    drop: 1,
    error: 1,
    focus: 1,
    key: 1,
    keydown: 1,
    keypress: 1,
    keyup: 1,
    load: 1,
    message: 1,
    mousedown: 1,
    mouseenter: 1,
    mouseleave: 1,
    mousemove: 1,
    mousemultiwheel: 1,
    mouseout: 1,
    mouseover: 1,
    mouseup: 1,
    mousewheel: 1,
    orientationchange: 1,
    reset: 1,
    resize: 1,
    select: 1,
    selectstart: 1,
    submit: 1,
    scroll: 1,
    textInput: 1,
    unload: 1
};

// Add custom event adaptors to this list.  This will make it so
// that delegate, key, available, contentready, etc all will
// be available through Node.on
_yuitest_coverline("build/node-base/node-base.js", 543);
Y.mix(Y_Node.DOM_EVENTS, Y.Env.evt.plugins);

_yuitest_coverline("build/node-base/node-base.js", 545);
Y.augment(Y_Node, Y.EventTarget);

_yuitest_coverline("build/node-base/node-base.js", 547);
Y.mix(Y_Node.prototype, {
    /**
     * Removes event listeners from the node and (optionally) its subtree
     * @method purge
     * @param {Boolean} recurse (optional) Whether or not to remove listeners from the
     * node's subtree
     * @param {String} type (optional) Only remove listeners of the specified type
     * @chainable
     *
     */
    purge: function(recurse, type) {
        _yuitest_coverfunc("build/node-base/node-base.js", "purge", 557);
_yuitest_coverline("build/node-base/node-base.js", 558);
Y.Event.purgeElement(this._node, recurse, type);
        _yuitest_coverline("build/node-base/node-base.js", 559);
return this;
    }

});

_yuitest_coverline("build/node-base/node-base.js", 564);
Y.mix(Y.NodeList.prototype, {
    _prepEvtArgs: function(type, fn, context) {
        // map to Y.on/after signature (type, fn, nodes, context, arg1, arg2, etc)
        _yuitest_coverfunc("build/node-base/node-base.js", "_prepEvtArgs", 565);
_yuitest_coverline("build/node-base/node-base.js", 567);
var args = Y.Array(arguments, 0, true);

        _yuitest_coverline("build/node-base/node-base.js", 569);
if (args.length < 2) { // type only (event hash) just add nodes
            _yuitest_coverline("build/node-base/node-base.js", 570);
args[2] = this._nodes;
        } else {
            _yuitest_coverline("build/node-base/node-base.js", 572);
args.splice(2, 0, this._nodes);
        }

        _yuitest_coverline("build/node-base/node-base.js", 575);
args[3] = context || this; // default to NodeList instance as context

        _yuitest_coverline("build/node-base/node-base.js", 577);
return args;
    },

    /**
    Subscribe a callback function for each `Node` in the collection to execute
    in response to a DOM event.

    NOTE: Generally, the `on()` method should be avoided on `NodeLists`, in
    favor of using event delegation from a parent Node.  See the Event user
    guide for details.

    Most DOM events are associated with a preventable default behavior, such as
    link clicks navigating to a new page.  Callbacks are passed a
    `DOMEventFacade` object as their first argument (usually called `e`) that
    can be used to prevent this default behavior with `e.preventDefault()`. See
    the `DOMEventFacade` API for all available properties and methods on the
    object.

    By default, the `this` object will be the `NodeList` that the subscription
    came from, <em>not the `Node` that received the event</em>.  Use
    `e.currentTarget` to refer to the `Node`.

    Returning `false` from a callback is supported as an alternative to calling
    `e.preventDefault(); e.stopPropagation();`.  However, it is recommended to
    use the event methods.

    @example

        Y.all(".sku").on("keydown", function (e) {
            if (e.keyCode === 13) {
                e.preventDefault();

                // Use e.currentTarget to refer to the individual Node
                var item = Y.MyApp.searchInventory( e.currentTarget.get('value') );
                // etc ...
            }
        });

    @method on
    @param {String} type The name of the event
    @param {Function} fn The callback to execute in response to the event
    @param {Object} [context] Override `this` object in callback
    @param {Any} [arg*] 0..n additional arguments to supply to the subscriber
    @return {EventHandle} A subscription handle capable of detaching that
                          subscription
    @for NodeList
    **/
    on: function(type, fn, context) {
        _yuitest_coverfunc("build/node-base/node-base.js", "on", 624);
_yuitest_coverline("build/node-base/node-base.js", 625);
return Y.on.apply(Y, this._prepEvtArgs.apply(this, arguments));
    },

    /**
     * Applies an one-time event listener to each Node bound to the NodeList.
     * @method once
     * @param {String} type The event being listened for
     * @param {Function} fn The handler to call when the event fires
     * @param {Object} context The context to call the handler with.
     * Default is the NodeList instance.
     * @return {EventHandle} A subscription handle capable of detaching that
     *                    subscription
     * @for NodeList
     */
    once: function(type, fn, context) {
        _yuitest_coverfunc("build/node-base/node-base.js", "once", 639);
_yuitest_coverline("build/node-base/node-base.js", 640);
return Y.once.apply(Y, this._prepEvtArgs.apply(this, arguments));
    },

    /**
     * Applies an event listener to each Node bound to the NodeList.
     * The handler is called only after all on() handlers are called
     * and the event is not prevented.
     * @method after
     * @param {String} type The event being listened for
     * @param {Function} fn The handler to call when the event fires
     * @param {Object} context The context to call the handler with.
     * Default is the NodeList instance.
     * @return {EventHandle} A subscription handle capable of detaching that
     *                    subscription
     * @for NodeList
     */
    after: function(type, fn, context) {
        _yuitest_coverfunc("build/node-base/node-base.js", "after", 656);
_yuitest_coverline("build/node-base/node-base.js", 657);
return Y.after.apply(Y, this._prepEvtArgs.apply(this, arguments));
    },

    /**
     * Applies an one-time event listener to each Node bound to the NodeList
     * that will be called only after all on() handlers are called and the
     * event is not prevented.
     *
     * @method onceAfter
     * @param {String} type The event being listened for
     * @param {Function} fn The handler to call when the event fires
     * @param {Object} context The context to call the handler with.
     * Default is the NodeList instance.
     * @return {EventHandle} A subscription handle capable of detaching that
     *                    subscription
     * @for NodeList
     */
    onceAfter: function(type, fn, context) {
        _yuitest_coverfunc("build/node-base/node-base.js", "onceAfter", 674);
_yuitest_coverline("build/node-base/node-base.js", 675);
return Y.onceAfter.apply(Y, this._prepEvtArgs.apply(this, arguments));
    }
});

_yuitest_coverline("build/node-base/node-base.js", 679);
Y_NodeList.importMethod(Y.Node.prototype, [
    /**
      * Called on each Node instance
      * @method detach
      * @see Node.detach
      * @for NodeList
      */
    'detach',

    /** Called on each Node instance
      * @method detachAll
      * @see Node.detachAll
      * @for NodeList
      */
    'detachAll'
]);

/**
Subscribe a callback function to execute in response to a DOM event or custom
event.

Most DOM events are associated with a preventable default behavior such as
link clicks navigating to a new page.  Callbacks are passed a `DOMEventFacade`
object as their first argument (usually called `e`) that can be used to
prevent this default behavior with `e.preventDefault()`. See the
`DOMEventFacade` API for all available properties and methods on the object.

If the event name passed as the first parameter is not a whitelisted DOM event,
it will be treated as a custom event subscriptions, allowing
`node.fire('customEventName')` later in the code.  Refer to the Event user guide
for the full DOM event whitelist.

By default, the `this` object in the callback will refer to the subscribed
`Node`.

Returning `false` from a callback is supported as an alternative to calling
`e.preventDefault(); e.stopPropagation();`.  However, it is recommended to use
the event methods.

@example

    Y.one("#my-form").on("submit", function (e) {
        e.preventDefault();

        // proceed with ajax form submission instead...
    });

@method on
@param {String} type The name of the event
@param {Function} fn The callback to execute in response to the event
@param {Object} [context] Override `this` object in callback
@param {Any} [arg*] 0..n additional arguments to supply to the subscriber
@return {EventHandle} A subscription handle capable of detaching that
                      subscription
@for Node
**/

_yuitest_coverline("build/node-base/node-base.js", 736);
Y.mix(Y.Node.ATTRS, {
    offsetHeight: {
        setter: function(h) {
            _yuitest_coverfunc("build/node-base/node-base.js", "setter", 738);
_yuitest_coverline("build/node-base/node-base.js", 739);
Y.DOM.setHeight(this._node, h);
            _yuitest_coverline("build/node-base/node-base.js", 740);
return h;
        },

        getter: function() {
            _yuitest_coverfunc("build/node-base/node-base.js", "getter", 743);
_yuitest_coverline("build/node-base/node-base.js", 744);
return this._node.offsetHeight;
        }
    },

    offsetWidth: {
        setter: function(w) {
            _yuitest_coverfunc("build/node-base/node-base.js", "setter", 749);
_yuitest_coverline("build/node-base/node-base.js", 750);
Y.DOM.setWidth(this._node, w);
            _yuitest_coverline("build/node-base/node-base.js", 751);
return w;
        },

        getter: function() {
            _yuitest_coverfunc("build/node-base/node-base.js", "getter", 754);
_yuitest_coverline("build/node-base/node-base.js", 755);
return this._node.offsetWidth;
        }
    }
});

_yuitest_coverline("build/node-base/node-base.js", 760);
Y.mix(Y.Node.prototype, {
    sizeTo: function(w, h) {
        _yuitest_coverfunc("build/node-base/node-base.js", "sizeTo", 761);
_yuitest_coverline("build/node-base/node-base.js", 762);
var node;
        _yuitest_coverline("build/node-base/node-base.js", 763);
if (arguments.length < 2) {
            _yuitest_coverline("build/node-base/node-base.js", 764);
node = Y.one(w);
            _yuitest_coverline("build/node-base/node-base.js", 765);
w = node.get('offsetWidth');
            _yuitest_coverline("build/node-base/node-base.js", 766);
h = node.get('offsetHeight');
        }

        _yuitest_coverline("build/node-base/node-base.js", 769);
this.setAttrs({
            offsetWidth: w,
            offsetHeight: h
        });
    }
});
/**
 * @module node
 * @submodule node-base
 */

_yuitest_coverline("build/node-base/node-base.js", 780);
var Y_Node = Y.Node;

_yuitest_coverline("build/node-base/node-base.js", 782);
Y.mix(Y_Node.prototype, {
    /**
     * Makes the node visible.
     * If the "transition" module is loaded, show optionally
     * animates the showing of the node using either the default
     * transition effect ('fadeIn'), or the given named effect.
     * @method show
     * @for Node
     * @param {String} name A named Transition effect to use as the show effect.
     * @param {Object} config Options to use with the transition.
     * @param {Function} callback An optional function to run after the transition completes.
     * @chainable
     */
    show: function(callback) {
        _yuitest_coverfunc("build/node-base/node-base.js", "show", 795);
_yuitest_coverline("build/node-base/node-base.js", 796);
callback = arguments[arguments.length - 1];
        _yuitest_coverline("build/node-base/node-base.js", 797);
this.toggleView(true, callback);
        _yuitest_coverline("build/node-base/node-base.js", 798);
return this;
    },

    /**
     * The implementation for showing nodes.
     * Default is to toggle the style.display property.
     * @method _show
     * @protected
     * @chainable
     */
    _show: function() {
        _yuitest_coverfunc("build/node-base/node-base.js", "_show", 808);
_yuitest_coverline("build/node-base/node-base.js", 809);
this.setStyle('display', '');

    },

    _isHidden: function() {
        _yuitest_coverfunc("build/node-base/node-base.js", "_isHidden", 813);
_yuitest_coverline("build/node-base/node-base.js", 814);
return Y.DOM.getStyle(this._node, 'display') === 'none';
    },

    /**
     * Displays or hides the node.
     * If the "transition" module is loaded, toggleView optionally
     * animates the toggling of the node using either the default
     * transition effect ('fadeIn'), or the given named effect.
     * @method toggleView
     * @for Node
     * @param {Boolean} [on] An optional boolean value to force the node to be shown or hidden
     * @param {Function} [callback] An optional function to run after the transition completes.
     * @chainable
     */
    toggleView: function(on, callback) {
        _yuitest_coverfunc("build/node-base/node-base.js", "toggleView", 828);
_yuitest_coverline("build/node-base/node-base.js", 829);
this._toggleView.apply(this, arguments);
        _yuitest_coverline("build/node-base/node-base.js", 830);
return this;
    },

    _toggleView: function(on, callback) {
        _yuitest_coverfunc("build/node-base/node-base.js", "_toggleView", 833);
_yuitest_coverline("build/node-base/node-base.js", 834);
callback = arguments[arguments.length - 1];

        // base on current state if not forcing
        _yuitest_coverline("build/node-base/node-base.js", 837);
if (typeof on != 'boolean') {
            _yuitest_coverline("build/node-base/node-base.js", 838);
on = (this._isHidden()) ? 1 : 0;
        }

        _yuitest_coverline("build/node-base/node-base.js", 841);
if (on) {
            _yuitest_coverline("build/node-base/node-base.js", 842);
this._show();
        }  else {
            _yuitest_coverline("build/node-base/node-base.js", 844);
this._hide();
        }

        _yuitest_coverline("build/node-base/node-base.js", 847);
if (typeof callback == 'function') {
            _yuitest_coverline("build/node-base/node-base.js", 848);
callback.call(this);
        }

        _yuitest_coverline("build/node-base/node-base.js", 851);
return this;
    },

    /**
     * Hides the node.
     * If the "transition" module is loaded, hide optionally
     * animates the hiding of the node using either the default
     * transition effect ('fadeOut'), or the given named effect.
     * @method hide
     * @param {String} name A named Transition effect to use as the show effect.
     * @param {Object} config Options to use with the transition.
     * @param {Function} callback An optional function to run after the transition completes.
     * @chainable
     */
    hide: function(callback) {
        _yuitest_coverfunc("build/node-base/node-base.js", "hide", 865);
_yuitest_coverline("build/node-base/node-base.js", 866);
callback = arguments[arguments.length - 1];
        _yuitest_coverline("build/node-base/node-base.js", 867);
this.toggleView(false, callback);
        _yuitest_coverline("build/node-base/node-base.js", 868);
return this;
    },

    /**
     * The implementation for hiding nodes.
     * Default is to toggle the style.display property.
     * @method _hide
     * @protected
     * @chainable
     */
    _hide: function() {
        _yuitest_coverfunc("build/node-base/node-base.js", "_hide", 878);
_yuitest_coverline("build/node-base/node-base.js", 879);
this.setStyle('display', 'none');
    }
});

_yuitest_coverline("build/node-base/node-base.js", 883);
Y.NodeList.importMethod(Y.Node.prototype, [
    /**
     * Makes each node visible.
     * If the "transition" module is loaded, show optionally
     * animates the showing of the node using either the default
     * transition effect ('fadeIn'), or the given named effect.
     * @method show
     * @param {String} name A named Transition effect to use as the show effect.
     * @param {Object} config Options to use with the transition.
     * @param {Function} callback An optional function to run after the transition completes.
     * @for NodeList
     * @chainable
     */
    'show',

    /**
     * Hides each node.
     * If the "transition" module is loaded, hide optionally
     * animates the hiding of the node using either the default
     * transition effect ('fadeOut'), or the given named effect.
     * @method hide
     * @param {String} name A named Transition effect to use as the show effect.
     * @param {Object} config Options to use with the transition.
     * @param {Function} callback An optional function to run after the transition completes.
     * @chainable
     */
    'hide',

    /**
     * Displays or hides each node.
     * If the "transition" module is loaded, toggleView optionally
     * animates the toggling of the nodes using either the default
     * transition effect ('fadeIn'), or the given named effect.
     * @method toggleView
     * @param {Boolean} [on] An optional boolean value to force the nodes to be shown or hidden
     * @param {Function} [callback] An optional function to run after the transition completes.
     * @chainable
     */
    'toggleView'
]);

_yuitest_coverline("build/node-base/node-base.js", 924);
if (!Y.config.doc.documentElement.hasAttribute) { // IE < 8
    _yuitest_coverline("build/node-base/node-base.js", 925);
Y.Node.prototype.hasAttribute = function(attr) {
        _yuitest_coverfunc("build/node-base/node-base.js", "hasAttribute", 925);
_yuitest_coverline("build/node-base/node-base.js", 926);
if (attr === 'value') {
            _yuitest_coverline("build/node-base/node-base.js", 927);
if (this.get('value') !== "") { // IE < 8 fails to populate specified when set in HTML
                _yuitest_coverline("build/node-base/node-base.js", 928);
return true;
            }
        }
        _yuitest_coverline("build/node-base/node-base.js", 931);
return !!(this._node.attributes[attr] &&
                this._node.attributes[attr].specified);
    };
}

// IE throws an error when calling focus() on an element that's invisible, not
// displayed, or disabled.
_yuitest_coverline("build/node-base/node-base.js", 938);
Y.Node.prototype.focus = function () {
    _yuitest_coverfunc("build/node-base/node-base.js", "focus", 938);
_yuitest_coverline("build/node-base/node-base.js", 939);
try {
        _yuitest_coverline("build/node-base/node-base.js", 940);
this._node.focus();
    } catch (e) {
    }

    _yuitest_coverline("build/node-base/node-base.js", 944);
return this;
};

// IE throws error when setting input.type = 'hidden',
// input.setAttribute('type', 'hidden') and input.attributes.type.value = 'hidden'
_yuitest_coverline("build/node-base/node-base.js", 949);
Y.Node.ATTRS.type = {
    setter: function(val) {
        _yuitest_coverfunc("build/node-base/node-base.js", "setter", 950);
_yuitest_coverline("build/node-base/node-base.js", 951);
if (val === 'hidden') {
            _yuitest_coverline("build/node-base/node-base.js", 952);
try {
                _yuitest_coverline("build/node-base/node-base.js", 953);
this._node.type = 'hidden';
            } catch(e) {
                _yuitest_coverline("build/node-base/node-base.js", 955);
this.setStyle('display', 'none');
                _yuitest_coverline("build/node-base/node-base.js", 956);
this._inputType = 'hidden';
            }
        } else {
            _yuitest_coverline("build/node-base/node-base.js", 959);
try { // IE errors when changing the type from "hidden'
                _yuitest_coverline("build/node-base/node-base.js", 960);
this._node.type = val;
            } catch (e) {
            }
        }
        _yuitest_coverline("build/node-base/node-base.js", 964);
return val;
    },

    getter: function() {
        _yuitest_coverfunc("build/node-base/node-base.js", "getter", 967);
_yuitest_coverline("build/node-base/node-base.js", 968);
return this._inputType || this._node.type;
    },

    _bypassProxy: true // don't update DOM when using with Attribute
};

_yuitest_coverline("build/node-base/node-base.js", 974);
if (Y.config.doc.createElement('form').elements.nodeType) {
    // IE: elements collection is also FORM node which trips up scrubVal.
    _yuitest_coverline("build/node-base/node-base.js", 976);
Y.Node.ATTRS.elements = {
            getter: function() {
                _yuitest_coverfunc("build/node-base/node-base.js", "getter", 977);
_yuitest_coverline("build/node-base/node-base.js", 978);
return this.all('input, textarea, button, select');
            }
    };
}

/**
 * Provides methods for managing custom Node data.
 * 
 * @module node
 * @main node
 * @submodule node-data
 */

_yuitest_coverline("build/node-base/node-base.js", 991);
Y.mix(Y.Node.prototype, {
    _initData: function() {
        _yuitest_coverfunc("build/node-base/node-base.js", "_initData", 992);
_yuitest_coverline("build/node-base/node-base.js", 993);
if (! ('_data' in this)) {
            _yuitest_coverline("build/node-base/node-base.js", 994);
this._data = {};
        }
    },

    /**
    * @method getData
    * @for Node
    * @description Retrieves arbitrary data stored on a Node instance.
    * If no data is associated with the Node, it will attempt to retrieve
    * a value from the corresponding HTML data attribute. (e.g. node.getData('foo')
    * will check node.getAttribute('data-foo')).
    * @param {string} name Optional name of the data field to retrieve.
    * If no name is given, all data is returned.
    * @return {any | Object} Whatever is stored at the given field,
    * or an object hash of all fields.
    */
    getData: function(name) {
        _yuitest_coverfunc("build/node-base/node-base.js", "getData", 1010);
_yuitest_coverline("build/node-base/node-base.js", 1011);
this._initData();
        _yuitest_coverline("build/node-base/node-base.js", 1012);
var data = this._data,
            ret = data;

        _yuitest_coverline("build/node-base/node-base.js", 1015);
if (arguments.length) { // single field
            _yuitest_coverline("build/node-base/node-base.js", 1016);
if (name in data) {
                _yuitest_coverline("build/node-base/node-base.js", 1017);
ret = data[name];
            } else { // initialize from HTML attribute
                _yuitest_coverline("build/node-base/node-base.js", 1019);
ret = this._getDataAttribute(name);
            }
        } else {_yuitest_coverline("build/node-base/node-base.js", 1021);
if (typeof data == 'object' && data !== null) { // all fields
            _yuitest_coverline("build/node-base/node-base.js", 1022);
ret = {};
            _yuitest_coverline("build/node-base/node-base.js", 1023);
Y.Object.each(data, function(v, n) {
                _yuitest_coverfunc("build/node-base/node-base.js", "(anonymous 2)", 1023);
_yuitest_coverline("build/node-base/node-base.js", 1024);
ret[n] = v;
            });

            _yuitest_coverline("build/node-base/node-base.js", 1027);
ret = this._getDataAttributes(ret);
        }}

        _yuitest_coverline("build/node-base/node-base.js", 1030);
return ret;

    },

    _getDataAttributes: function(ret) {
        _yuitest_coverfunc("build/node-base/node-base.js", "_getDataAttributes", 1034);
_yuitest_coverline("build/node-base/node-base.js", 1035);
ret = ret || {};
        _yuitest_coverline("build/node-base/node-base.js", 1036);
var i = 0,
            attrs = this._node.attributes,
            len = attrs.length,
            prefix = this.DATA_PREFIX,
            prefixLength = prefix.length,
            name;

        _yuitest_coverline("build/node-base/node-base.js", 1043);
while (i < len) {
            _yuitest_coverline("build/node-base/node-base.js", 1044);
name = attrs[i].name;
            _yuitest_coverline("build/node-base/node-base.js", 1045);
if (name.indexOf(prefix) === 0) {
                _yuitest_coverline("build/node-base/node-base.js", 1046);
name = name.substr(prefixLength);
                _yuitest_coverline("build/node-base/node-base.js", 1047);
if (!(name in ret)) { // only merge if not already stored
                    _yuitest_coverline("build/node-base/node-base.js", 1048);
ret[name] = this._getDataAttribute(name);
                }
            }

            _yuitest_coverline("build/node-base/node-base.js", 1052);
i += 1;
        }

        _yuitest_coverline("build/node-base/node-base.js", 1055);
return ret;
    },

    _getDataAttribute: function(name) {
        _yuitest_coverfunc("build/node-base/node-base.js", "_getDataAttribute", 1058);
_yuitest_coverline("build/node-base/node-base.js", 1059);
var name = this.DATA_PREFIX + name,
            node = this._node,
            attrs = node.attributes,
            data = attrs && attrs[name] && attrs[name].value;

        _yuitest_coverline("build/node-base/node-base.js", 1064);
return data;
    },

    /**
    * @method setData
    * @for Node
    * @description Stores arbitrary data on a Node instance.
    * This is not stored with the DOM node.
    * @param {string} name The name of the field to set. If no val
    * is given, name is treated as the data and overrides any existing data.
    * @param {any} val The value to be assigned to the field.
    * @chainable
    */
    setData: function(name, val) {
        _yuitest_coverfunc("build/node-base/node-base.js", "setData", 1077);
_yuitest_coverline("build/node-base/node-base.js", 1078);
this._initData();
        _yuitest_coverline("build/node-base/node-base.js", 1079);
if (arguments.length > 1) {
            _yuitest_coverline("build/node-base/node-base.js", 1080);
this._data[name] = val;
        } else {
            _yuitest_coverline("build/node-base/node-base.js", 1082);
this._data = name;
        }

       _yuitest_coverline("build/node-base/node-base.js", 1085);
return this;
    },

    /**
    * @method clearData
    * @for Node
    * @description Clears internally stored data.
    * @param {string} name The name of the field to clear. If no name
    * is given, all data is cleared.
    * @chainable
    */
    clearData: function(name) {
        _yuitest_coverfunc("build/node-base/node-base.js", "clearData", 1096);
_yuitest_coverline("build/node-base/node-base.js", 1097);
if ('_data' in this) {
            _yuitest_coverline("build/node-base/node-base.js", 1098);
if (typeof name != 'undefined') {
                _yuitest_coverline("build/node-base/node-base.js", 1099);
delete this._data[name];
            } else {
                _yuitest_coverline("build/node-base/node-base.js", 1101);
delete this._data;
            }
        }

        _yuitest_coverline("build/node-base/node-base.js", 1105);
return this;
    }
});

_yuitest_coverline("build/node-base/node-base.js", 1109);
Y.mix(Y.NodeList.prototype, {
    /**
    * @method getData
    * @for NodeList
    * @description Retrieves arbitrary data stored on each Node instance
    * bound to the NodeList.
    * @see Node
    * @param {string} name Optional name of the data field to retrieve.
    * If no name is given, all data is returned.
    * @return {Array} An array containing all of the data for each Node instance. 
    * or an object hash of all fields.
    */
    getData: function(name) {
        _yuitest_coverfunc("build/node-base/node-base.js", "getData", 1121);
_yuitest_coverline("build/node-base/node-base.js", 1122);
var args = (arguments.length) ? [name] : [];
        _yuitest_coverline("build/node-base/node-base.js", 1123);
return this._invoke('getData', args, true);
    },

    /**
    * @method setData
    * @for NodeList
    * @description Stores arbitrary data on each Node instance bound to the
    *  NodeList. This is not stored with the DOM node.
    * @param {string} name The name of the field to set. If no name
    * is given, name is treated as the data and overrides any existing data.
    * @param {any} val The value to be assigned to the field.
    * @chainable
    */
    setData: function(name, val) {
        _yuitest_coverfunc("build/node-base/node-base.js", "setData", 1136);
_yuitest_coverline("build/node-base/node-base.js", 1137);
var args = (arguments.length > 1) ? [name, val] : [name];
        _yuitest_coverline("build/node-base/node-base.js", 1138);
return this._invoke('setData', args);
    },

    /**
    * @method clearData
    * @for NodeList
    * @description Clears data on all Node instances bound to the NodeList.
    * @param {string} name The name of the field to clear. If no name
    * is given, all data is cleared.
    * @chainable
    */
    clearData: function(name) {
        _yuitest_coverfunc("build/node-base/node-base.js", "clearData", 1149);
_yuitest_coverline("build/node-base/node-base.js", 1150);
var args = (arguments.length) ? [name] : [];
        _yuitest_coverline("build/node-base/node-base.js", 1151);
return this._invoke('clearData', [name]);
    }
});


}, '3.7.3', {"requires": ["event-base", "node-core", "dom-base"]});
