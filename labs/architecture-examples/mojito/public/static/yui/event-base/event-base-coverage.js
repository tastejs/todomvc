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
_yuitest_coverage["build/event-base/event-base.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/event-base/event-base.js",
    code: []
};
_yuitest_coverage["build/event-base/event-base.js"].code=["(function () {","var GLOBAL_ENV = YUI.Env;","","if (!GLOBAL_ENV._ready) {","    GLOBAL_ENV._ready = function() {","        GLOBAL_ENV.DOMReady = true;","        GLOBAL_ENV.remove(YUI.config.doc, 'DOMContentLoaded', GLOBAL_ENV._ready);","    };","","    GLOBAL_ENV.add(YUI.config.doc, 'DOMContentLoaded', GLOBAL_ENV._ready);","}","})();","YUI.add('event-base', function (Y, NAME) {","","/*"," * DOM event listener abstraction layer"," * @module event"," * @submodule event-base"," */","","/**"," * The domready event fires at the moment the browser's DOM is"," * usable. In most cases, this is before images are fully"," * downloaded, allowing you to provide a more responsive user"," * interface."," *"," * In YUI 3, domready subscribers will be notified immediately if"," * that moment has already passed when the subscription is created."," *"," * One exception is if the yui.js file is dynamically injected into"," * the page.  If this is done, you must tell the YUI instance that"," * you did this in order for DOMReady (and window load events) to"," * fire normally.  That configuration option is 'injected' -- set"," * it to true if the yui.js script is not included inline."," *"," * This method is part of the 'event-ready' module, which is a"," * submodule of 'event'."," *"," * @event domready"," * @for YUI"," */","Y.publish('domready', {","    fireOnce: true,","    async: true","});","","if (YUI.Env.DOMReady) {","    Y.fire('domready');","} else {","    Y.Do.before(function() { Y.fire('domready'); }, YUI.Env, '_ready');","}","","/**"," * Custom event engine, DOM event listener abstraction layer, synthetic DOM"," * events."," * @module event"," * @submodule event-base"," */","","/**"," * Wraps a DOM event, properties requiring browser abstraction are"," * fixed here.  Provids a security layer when required."," * @class DOMEventFacade"," * @param ev {Event} the DOM event"," * @param currentTarget {HTMLElement} the element the listener was attached to"," * @param wrapper {Event.Custom} the custom event wrapper for this DOM event"," */","","    var ua = Y.UA,","","    EMPTY = {},","","    /**","     * webkit key remapping required for Safari < 3.1","     * @property webkitKeymap","     * @private","     */","    webkitKeymap = {","        63232: 38, // up","        63233: 40, // down","        63234: 37, // left","        63235: 39, // right","        63276: 33, // page up","        63277: 34, // page down","        25:     9, // SHIFT-TAB (Safari provides a different key code in","                   // this case, even though the shiftKey modifier is set)","        63272: 46, // delete","        63273: 36, // home","        63275: 35  // end","    },","","    /**","     * Returns a wrapped node.  Intended to be used on event targets,","     * so it will return the node's parent if the target is a text","     * node.","     *","     * If accessing a property of the node throws an error, this is","     * probably the anonymous div wrapper Gecko adds inside text","     * nodes.  This likely will only occur when attempting to access","     * the relatedTarget.  In this case, we now return null because","     * the anonymous div is completely useless and we do not know","     * what the related target was because we can't even get to","     * the element's parent node.","     *","     * @method resolve","     * @private","     */","    resolve = function(n) {","        if (!n) {","            return n;","        }","        try {","            if (n && 3 == n.nodeType) {","                n = n.parentNode;","            }","        } catch(e) {","            return null;","        }","","        return Y.one(n);","    },","","    DOMEventFacade = function(ev, currentTarget, wrapper) {","        this._event = ev;","        this._currentTarget = currentTarget;","        this._wrapper = wrapper || EMPTY;","","        // if not lazy init","        this.init();","    };","","Y.extend(DOMEventFacade, Object, {","","    init: function() {","","        var e = this._event,","            overrides = this._wrapper.overrides,","            x = e.pageX,","            y = e.pageY,","            c,","            currentTarget = this._currentTarget;","","        this.altKey   = e.altKey;","        this.ctrlKey  = e.ctrlKey;","        this.metaKey  = e.metaKey;","        this.shiftKey = e.shiftKey;","        this.type     = (overrides && overrides.type) || e.type;","        this.clientX  = e.clientX;","        this.clientY  = e.clientY;","","        this.pageX = x;","        this.pageY = y;","","        // charCode is unknown in keyup, keydown. keyCode is unknown in keypress.","        // FF 3.6 - 8+? pass 0 for keyCode in keypress events.","        // Webkit, FF 3.6-8+?, and IE9+? pass 0 for charCode in keydown, keyup.","        // Webkit and IE9+? duplicate charCode in keyCode.","        // Opera never sets charCode, always keyCode (though with the charCode).","        // IE6-8 don't set charCode or which.","        // All browsers other than IE6-8 set which=keyCode in keydown, keyup, and ","        // which=charCode in keypress.","        //","        // Moral of the story: (e.which || e.keyCode) will always return the","        // known code for that key event phase. e.keyCode is often different in","        // keypress from keydown and keyup.","        c = e.keyCode || e.charCode;","","        if (ua.webkit && (c in webkitKeymap)) {","            c = webkitKeymap[c];","        }","","        this.keyCode = c;","        this.charCode = c;","        // Fill in e.which for IE - implementers should always use this over","        // e.keyCode or e.charCode.","        this.which = e.which || e.charCode || c;","        // this.button = e.button;","        this.button = this.which;","","        this.target = resolve(e.target);","        this.currentTarget = resolve(currentTarget);","        this.relatedTarget = resolve(e.relatedTarget);","","        if (e.type == \"mousewheel\" || e.type == \"DOMMouseScroll\") {","            this.wheelDelta = (e.detail) ? (e.detail * -1) : Math.round(e.wheelDelta / 80) || ((e.wheelDelta < 0) ? -1 : 1);","        }","","        if (this._touch) {","            this._touch(e, currentTarget, this._wrapper);","        }","    },","","    stopPropagation: function() {","        this._event.stopPropagation();","        this._wrapper.stopped = 1;","        this.stopped = 1;","    },","","    stopImmediatePropagation: function() {","        var e = this._event;","        if (e.stopImmediatePropagation) {","            e.stopImmediatePropagation();","        } else {","            this.stopPropagation();","        }","        this._wrapper.stopped = 2;","        this.stopped = 2;","    },","","    preventDefault: function(returnValue) {","        var e = this._event;","        e.preventDefault();","        e.returnValue = returnValue || false;","        this._wrapper.prevented = 1;","        this.prevented = 1;","    },","","    halt: function(immediate) {","        if (immediate) {","            this.stopImmediatePropagation();","        } else {","            this.stopPropagation();","        }","","        this.preventDefault();","    }","","});","","DOMEventFacade.resolve = resolve;","Y.DOM2EventFacade = DOMEventFacade;","Y.DOMEventFacade = DOMEventFacade;","","    /**","     * The native event","     * @property _event","     * @type {Native DOM Event}","     * @private","     */","","    /**","    The name of the event (e.g. \"click\")","","    @property type","    @type {String}","    **/","","    /**","    `true` if the \"alt\" or \"option\" key is pressed.","","    @property altKey","    @type {Boolean}","    **/","","    /**","    `true` if the shift key is pressed.","","    @property shiftKey","    @type {Boolean}","    **/","","    /**","    `true` if the \"Windows\" key on a Windows keyboard, \"command\" key on an","    Apple keyboard, or \"meta\" key on other keyboards is pressed.","","    @property metaKey","    @type {Boolean}","    **/","","    /**","    `true` if the \"Ctrl\" or \"control\" key is pressed.","","    @property ctrlKey","    @type {Boolean}","    **/","","    /**","     * The X location of the event on the page (including scroll)","     * @property pageX","     * @type {Number}","     */","","    /**","     * The Y location of the event on the page (including scroll)","     * @property pageY","     * @type {Number}","     */","","    /**","     * The X location of the event in the viewport","     * @property clientX","     * @type {Number}","     */","","    /**","     * The Y location of the event in the viewport","     * @property clientY","     * @type {Number}","     */","","    /**","     * The keyCode for key events.  Uses charCode if keyCode is not available","     * @property keyCode","     * @type {Number}","     */","","    /**","     * The charCode for key events.  Same as keyCode","     * @property charCode","     * @type {Number}","     */","","    /**","     * The button that was pushed. 1 for left click, 2 for middle click, 3 for","     * right click.  This is only reliably populated on `mouseup` events.","     * @property button","     * @type {Number}","     */","","    /**","     * The button that was pushed.  Same as button.","     * @property which","     * @type {Number}","     */","","    /**","     * Node reference for the targeted element","     * @property target","     * @type {Node}","     */","","    /**","     * Node reference for the element that the listener was attached to.","     * @property currentTarget","     * @type {Node}","     */","","    /**","     * Node reference to the relatedTarget","     * @property relatedTarget","     * @type {Node}","     */","","    /**","     * Number representing the direction and velocity of the movement of the mousewheel.","     * Negative is down, the higher the number, the faster.  Applies to the mousewheel event.","     * @property wheelDelta","     * @type {Number}","     */","","    /**","     * Stops the propagation to the next bubble target","     * @method stopPropagation","     */","","    /**","     * Stops the propagation to the next bubble target and","     * prevents any additional listeners from being exectued","     * on the current target.","     * @method stopImmediatePropagation","     */","","    /**","     * Prevents the event's default behavior","     * @method preventDefault","     * @param returnValue {string} sets the returnValue of the event to this value","     * (rather than the default false value).  This can be used to add a customized","     * confirmation query to the beforeunload event).","     */","","    /**","     * Stops the event propagation and prevents the default","     * event behavior.","     * @method halt","     * @param immediate {boolean} if true additional listeners","     * on the current target will not be executed","     */","(function() {","/**"," * The event utility provides functions to add and remove event listeners,"," * event cleansing.  It also tries to automatically remove listeners it"," * registers during the unload event."," * @module event"," * @main event"," * @submodule event-base"," */","","/**"," * The event utility provides functions to add and remove event listeners,"," * event cleansing.  It also tries to automatically remove listeners it"," * registers during the unload event."," *"," * @class Event"," * @static"," */","","Y.Env.evt.dom_wrappers = {};","Y.Env.evt.dom_map = {};","","var YDOM = Y.DOM,","    _eventenv = Y.Env.evt,","    config = Y.config,","    win = config.win,","    add = YUI.Env.add,","    remove = YUI.Env.remove,","","    onLoad = function() {","        YUI.Env.windowLoaded = true;","        Y.Event._load();","        remove(win, \"load\", onLoad);","    },","","    onUnload = function() {","        Y.Event._unload();","    },","","    EVENT_READY = 'domready',","","    COMPAT_ARG = '~yui|2|compat~',","","    shouldIterate = function(o) {","        try {","            // TODO: See if there's a more performant way to return true early on this, for the common case","            return (o && typeof o !== \"string\" && Y.Lang.isNumber(o.length) && !o.tagName && !YDOM.isWindow(o));","        } catch(ex) {","            return false;","        }","    },","","    // aliases to support DOM event subscription clean up when the last","    // subscriber is detached. deleteAndClean overrides the DOM event's wrapper","    // CustomEvent _delete method.","    _ceProtoDelete = Y.CustomEvent.prototype._delete,","    _deleteAndClean = function(s) {","        var ret = _ceProtoDelete.apply(this, arguments);","","        if (!this.hasSubs()) {","            Y.Event._clean(this);","        }","","        return ret;","    },","","Event = function() {","","    /**","     * True after the onload event has fired","     * @property _loadComplete","     * @type boolean","     * @static","     * @private","     */","    var _loadComplete =  false,","","    /**","     * The number of times to poll after window.onload.  This number is","     * increased if additional late-bound handlers are requested after","     * the page load.","     * @property _retryCount","     * @static","     * @private","     */","    _retryCount = 0,","","    /**","     * onAvailable listeners","     * @property _avail","     * @static","     * @private","     */","    _avail = [],","","    /**","     * Custom event wrappers for DOM events.  Key is","     * 'event:' + Element uid stamp + event type","     * @property _wrappers","     * @type Y.Event.Custom","     * @static","     * @private","     */","    _wrappers = _eventenv.dom_wrappers,","","    _windowLoadKey = null,","","    /**","     * Custom event wrapper map DOM events.  Key is","     * Element uid stamp.  Each item is a hash of custom event","     * wrappers as provided in the _wrappers collection.  This","     * provides the infrastructure for getListeners.","     * @property _el_events","     * @static","     * @private","     */","    _el_events = _eventenv.dom_map;","","    return {","","        /**","         * The number of times we should look for elements that are not","         * in the DOM at the time the event is requested after the document","         * has been loaded.  The default is 1000@amp;40 ms, so it will poll","         * for 40 seconds or until all outstanding handlers are bound","         * (whichever comes first).","         * @property POLL_RETRYS","         * @type int","         * @static","         * @final","         */","        POLL_RETRYS: 1000,","","        /**","         * The poll interval in milliseconds","         * @property POLL_INTERVAL","         * @type int","         * @static","         * @final","         */","        POLL_INTERVAL: 40,","","        /**","         * addListener/removeListener can throw errors in unexpected scenarios.","         * These errors are suppressed, the method returns false, and this property","         * is set","         * @property lastError","         * @static","         * @type Error","         */","        lastError: null,","","","        /**","         * poll handle","         * @property _interval","         * @static","         * @private","         */","        _interval: null,","","        /**","         * document readystate poll handle","         * @property _dri","         * @static","         * @private","         */","         _dri: null,","","        /**","         * True when the document is initially usable","         * @property DOMReady","         * @type boolean","         * @static","         */","        DOMReady: false,","","        /**","         * @method startInterval","         * @static","         * @private","         */","        startInterval: function() {","            if (!Event._interval) {","Event._interval = setInterval(Event._poll, Event.POLL_INTERVAL);","            }","        },","","        /**","         * Executes the supplied callback when the item with the supplied","         * id is found.  This is meant to be used to execute behavior as","         * soon as possible as the page loads.  If you use this after the","         * initial page load it will poll for a fixed time for the element.","         * The number of times it will poll and the frequency are","         * configurable.  By default it will poll for 10 seconds.","         *","         * <p>The callback is executed with a single parameter:","         * the custom object parameter, if provided.</p>","         *","         * @method onAvailable","         *","         * @param {string||string[]}   id the id of the element, or an array","         * of ids to look for.","         * @param {function} fn what to execute when the element is found.","         * @param {object}   p_obj an optional object to be passed back as","         *                   a parameter to fn.","         * @param {boolean|object}  p_override If set to true, fn will execute","         *                   in the context of p_obj, if set to an object it","         *                   will execute in the context of that object","         * @param checkContent {boolean} check child node readiness (onContentReady)","         * @static","         * @deprecated Use Y.on(\"available\")","         */","        // @TODO fix arguments","        onAvailable: function(id, fn, p_obj, p_override, checkContent, compat) {","","            var a = Y.Array(id), i, availHandle;","","","            for (i=0; i<a.length; i=i+1) {","                _avail.push({","                    id:         a[i],","                    fn:         fn,","                    obj:        p_obj,","                    override:   p_override,","                    checkReady: checkContent,","                    compat:     compat","                });","            }","            _retryCount = this.POLL_RETRYS;","","            // We want the first test to be immediate, but async","            setTimeout(Event._poll, 0);","","            availHandle = new Y.EventHandle({","","                _delete: function() {","                    // set by the event system for lazy DOM listeners","                    if (availHandle.handle) {","                        availHandle.handle.detach();","                        return;","                    }","","                    var i, j;","","                    // otherwise try to remove the onAvailable listener(s)","                    for (i = 0; i < a.length; i++) {","                        for (j = 0; j < _avail.length; j++) {","                            if (a[i] === _avail[j].id) {","                                _avail.splice(j, 1);","                            }","                        }","                    }","                }","","            });","","            return availHandle;","        },","","        /**","         * Works the same way as onAvailable, but additionally checks the","         * state of sibling elements to determine if the content of the","         * available element is safe to modify.","         *","         * <p>The callback is executed with a single parameter:","         * the custom object parameter, if provided.</p>","         *","         * @method onContentReady","         *","         * @param {string}   id the id of the element to look for.","         * @param {function} fn what to execute when the element is ready.","         * @param {object}   obj an optional object to be passed back as","         *                   a parameter to fn.","         * @param {boolean|object}  override If set to true, fn will execute","         *                   in the context of p_obj.  If an object, fn will","         *                   exectute in the context of that object","         *","         * @static","         * @deprecated Use Y.on(\"contentready\")","         */","        // @TODO fix arguments","        onContentReady: function(id, fn, obj, override, compat) {","            return Event.onAvailable(id, fn, obj, override, true, compat);","        },","","        /**","         * Adds an event listener","         *","         * @method attach","         *","         * @param {String}   type     The type of event to append","         * @param {Function} fn        The method the event invokes","         * @param {String|HTMLElement|Array|NodeList} el An id, an element","         *  reference, or a collection of ids and/or elements to assign the","         *  listener to.","         * @param {Object}   context optional context object","         * @param {Boolean|object}  args 0..n arguments to pass to the callback","         * @return {EventHandle} an object to that can be used to detach the listener","         *","         * @static","         */","","        attach: function(type, fn, el, context) {","            return Event._attach(Y.Array(arguments, 0, true));","        },","","        _createWrapper: function (el, type, capture, compat, facade) {","","            var cewrapper,","                ek  = Y.stamp(el),","                key = 'event:' + ek + type;","","            if (false === facade) {","                key += 'native';","            }","            if (capture) {","                key += 'capture';","            }","","","            cewrapper = _wrappers[key];","","","            if (!cewrapper) {","                // create CE wrapper","                cewrapper = Y.publish(key, {","                    silent: true,","                    bubbles: false,","                    contextFn: function() {","                        if (compat) {","                            return cewrapper.el;","                        } else {","                            cewrapper.nodeRef = cewrapper.nodeRef || Y.one(cewrapper.el);","                            return cewrapper.nodeRef;","                        }","                    }","                });","","                cewrapper.overrides = {};","","                // for later removeListener calls","                cewrapper.el = el;","                cewrapper.key = key;","                cewrapper.domkey = ek;","                cewrapper.type = type;","                cewrapper.fn = function(e) {","                    cewrapper.fire(Event.getEvent(e, el, (compat || (false === facade))));","                };","                cewrapper.capture = capture;","","                if (el == win && type == \"load\") {","                    // window load happens once","                    cewrapper.fireOnce = true;","                    _windowLoadKey = key;","                }","                cewrapper._delete = _deleteAndClean;","","                _wrappers[key] = cewrapper;","                _el_events[ek] = _el_events[ek] || {};","                _el_events[ek][key] = cewrapper;","","                add(el, type, cewrapper.fn, capture);","            }","","            return cewrapper;","","        },","","        _attach: function(args, conf) {","","            var compat,","                handles, oEl, cewrapper, context,","                fireNow = false, ret,","                type = args[0],","                fn = args[1],","                el = args[2] || win,","                facade = conf && conf.facade,","                capture = conf && conf.capture,","                overrides = conf && conf.overrides;","","            if (args[args.length-1] === COMPAT_ARG) {","                compat = true;","            }","","            if (!fn || !fn.call) {","// throw new TypeError(type + \" attach call failed, callback undefined\");","                return false;","            }","","            // The el argument can be an array of elements or element ids.","            if (shouldIterate(el)) {","","                handles=[];","","                Y.each(el, function(v, k) {","                    args[2] = v;","                    handles.push(Event._attach(args.slice(), conf));","                });","","                // return (handles.length === 1) ? handles[0] : handles;","                return new Y.EventHandle(handles);","","            // If the el argument is a string, we assume it is","            // actually the id of the element.  If the page is loaded","            // we convert el to the actual element, otherwise we","            // defer attaching the event until the element is","            // ready","            } else if (Y.Lang.isString(el)) {","","                // oEl = (compat) ? Y.DOM.byId(el) : Y.Selector.query(el);","","                if (compat) {","                    oEl = YDOM.byId(el);","                } else {","","                    oEl = Y.Selector.query(el);","","                    switch (oEl.length) {","                        case 0:","                            oEl = null;","                            break;","                        case 1:","                            oEl = oEl[0];","                            break;","                        default:","                            args[2] = oEl;","                            return Event._attach(args, conf);","                    }","                }","","                if (oEl) {","","                    el = oEl;","","                // Not found = defer adding the event until the element is available","                } else {","","                    ret = Event.onAvailable(el, function() {","","                        ret.handle = Event._attach(args, conf);","","                    }, Event, true, false, compat);","","                    return ret;","","                }","            }","","            // Element should be an html element or node","            if (!el) {","                return false;","            }","","            if (Y.Node && Y.instanceOf(el, Y.Node)) {","                el = Y.Node.getDOMNode(el);","            }","","            cewrapper = Event._createWrapper(el, type, capture, compat, facade);","            if (overrides) {","                Y.mix(cewrapper.overrides, overrides);","            }","","            if (el == win && type == \"load\") {","","                // if the load is complete, fire immediately.","                // all subscribers, including the current one","                // will be notified.","                if (YUI.Env.windowLoaded) {","                    fireNow = true;","                }","            }","","            if (compat) {","                args.pop();","            }","","            context = args[3];","","            // set context to the Node if not specified","            // ret = cewrapper.on.apply(cewrapper, trimmedArgs);","            ret = cewrapper._on(fn, context, (args.length > 4) ? args.slice(4) : null);","","            if (fireNow) {","                cewrapper.fire();","            }","","            return ret;","","        },","","        /**","         * Removes an event listener.  Supports the signature the event was bound","         * with, but the preferred way to remove listeners is using the handle","         * that is returned when using Y.on","         *","         * @method detach","         *","         * @param {String} type the type of event to remove.","         * @param {Function} fn the method the event invokes.  If fn is","         * undefined, then all event handlers for the type of event are","         * removed.","         * @param {String|HTMLElement|Array|NodeList|EventHandle} el An","         * event handle, an id, an element reference, or a collection","         * of ids and/or elements to remove the listener from.","         * @return {boolean} true if the unbind was successful, false otherwise.","         * @static","         */","        detach: function(type, fn, el, obj) {","","            var args=Y.Array(arguments, 0, true), compat, l, ok, i,","                id, ce;","","            if (args[args.length-1] === COMPAT_ARG) {","                compat = true;","                // args.pop();","            }","","            if (type && type.detach) {","                return type.detach();","            }","","            // The el argument can be a string","            if (typeof el == \"string\") {","","                // el = (compat) ? Y.DOM.byId(el) : Y.all(el);","                if (compat) {","                    el = YDOM.byId(el);","                } else {","                    el = Y.Selector.query(el);","                    l = el.length;","                    if (l < 1) {","                        el = null;","                    } else if (l == 1) {","                        el = el[0];","                    }","                }","                // return Event.detach.apply(Event, args);","            }","","            if (!el) {","                return false;","            }","","            if (el.detach) {","                args.splice(2, 1);","                return el.detach.apply(el, args);","            // The el argument can be an array of elements or element ids.","            } else if (shouldIterate(el)) {","                ok = true;","                for (i=0, l=el.length; i<l; ++i) {","                    args[2] = el[i];","                    ok = ( Y.Event.detach.apply(Y.Event, args) && ok );","                }","","                return ok;","            }","","            if (!type || !fn || !fn.call) {","                return Event.purgeElement(el, false, type);","            }","","            id = 'event:' + Y.stamp(el) + type;","            ce = _wrappers[id];","","            if (ce) {","                return ce.detach(fn);","            } else {","                return false;","            }","","        },","","        /**","         * Finds the event in the window object, the caller's arguments, or","         * in the arguments of another method in the callstack.  This is","         * executed automatically for events registered through the event","         * manager, so the implementer should not normally need to execute","         * this function at all.","         * @method getEvent","         * @param {Event} e the event parameter from the handler","         * @param {HTMLElement} el the element the listener was attached to","         * @return {Event} the event","         * @static","         */","        getEvent: function(e, el, noFacade) {","            var ev = e || win.event;","","            return (noFacade) ? ev :","                new Y.DOMEventFacade(ev, el, _wrappers['event:' + Y.stamp(el) + e.type]);","        },","","        /**","         * Generates an unique ID for the element if it does not already","         * have one.","         * @method generateId","         * @param el the element to create the id for","         * @return {string} the resulting id of the element","         * @static","         */","        generateId: function(el) {","            return YDOM.generateID(el);","        },","","        /**","         * We want to be able to use getElementsByTagName as a collection","         * to attach a group of events to.  Unfortunately, different","         * browsers return different types of collections.  This function","         * tests to determine if the object is array-like.  It will also","         * fail if the object is an array, but is empty.","         * @method _isValidCollection","         * @param o the object to test","         * @return {boolean} true if the object is array-like and populated","         * @deprecated was not meant to be used directly","         * @static","         * @private","         */","        _isValidCollection: shouldIterate,","","        /**","         * hook up any deferred listeners","         * @method _load","         * @static","         * @private","         */","        _load: function(e) {","            if (!_loadComplete) {","                _loadComplete = true;","","                // Just in case DOMReady did not go off for some reason","                // E._ready();","                if (Y.fire) {","                    Y.fire(EVENT_READY);","                }","","                // Available elements may not have been detected before the","                // window load event fires. Try to find them now so that the","                // the user is more likely to get the onAvailable notifications","                // before the window load notification","                Event._poll();","            }","        },","","        /**","         * Polling function that runs before the onload event fires,","         * attempting to attach to DOM Nodes as soon as they are","         * available","         * @method _poll","         * @static","         * @private","         */","        _poll: function() {","            if (Event.locked) {","                return;","            }","","            if (Y.UA.ie && !YUI.Env.DOMReady) {","                // Hold off if DOMReady has not fired and check current","                // readyState to protect against the IE operation aborted","                // issue.","                Event.startInterval();","                return;","            }","","            Event.locked = true;","","            // keep trying until after the page is loaded.  We need to","            // check the page load state prior to trying to bind the","            // elements so that we can be certain all elements have been","            // tested appropriately","            var i, len, item, el, notAvail, executeItem,","                tryAgain = !_loadComplete;","","            if (!tryAgain) {","                tryAgain = (_retryCount > 0);","            }","","            // onAvailable","            notAvail = [];","","            executeItem = function (el, item) {","                var context, ov = item.override;","                try {","                    if (item.compat) {","                        if (item.override) {","                            if (ov === true) {","                                context = item.obj;","                            } else {","                                context = ov;","                            }","                        } else {","                            context = el;","                        }","                        item.fn.call(context, item.obj);","                    } else {","                        context = item.obj || Y.one(el);","                        item.fn.apply(context, (Y.Lang.isArray(ov)) ? ov : []);","                    }","                } catch (e) {","                }","            };","","            // onAvailable","            for (i=0,len=_avail.length; i<len; ++i) {","                item = _avail[i];","                if (item && !item.checkReady) {","","                    // el = (item.compat) ? Y.DOM.byId(item.id) : Y.one(item.id);","                    el = (item.compat) ? YDOM.byId(item.id) : Y.Selector.query(item.id, null, true);","","                    if (el) {","                        executeItem(el, item);","                        _avail[i] = null;","                    } else {","                        notAvail.push(item);","                    }","                }","            }","","            // onContentReady","            for (i=0,len=_avail.length; i<len; ++i) {","                item = _avail[i];","                if (item && item.checkReady) {","","                    // el = (item.compat) ? Y.DOM.byId(item.id) : Y.one(item.id);","                    el = (item.compat) ? YDOM.byId(item.id) : Y.Selector.query(item.id, null, true);","","                    if (el) {","                        // The element is available, but not necessarily ready","                        // @todo should we test parentNode.nextSibling?","                        if (_loadComplete || (el.get && el.get('nextSibling')) || el.nextSibling) {","                            executeItem(el, item);","                            _avail[i] = null;","                        }","                    } else {","                        notAvail.push(item);","                    }","                }","            }","","            _retryCount = (notAvail.length === 0) ? 0 : _retryCount - 1;","","            if (tryAgain) {","                // we may need to strip the nulled out items here","                Event.startInterval();","            } else {","                clearInterval(Event._interval);","                Event._interval = null;","            }","","            Event.locked = false;","","            return;","","        },","","        /**","         * Removes all listeners attached to the given element via addListener.","         * Optionally, the node's children can also be purged.","         * Optionally, you can specify a specific type of event to remove.","         * @method purgeElement","         * @param {HTMLElement} el the element to purge","         * @param {boolean} recurse recursively purge this element's children","         * as well.  Use with caution.","         * @param {string} type optional type of listener to purge. If","         * left out, all listeners will be removed","         * @static","         */","        purgeElement: function(el, recurse, type) {","            // var oEl = (Y.Lang.isString(el)) ? Y.one(el) : el,","            var oEl = (Y.Lang.isString(el)) ?  Y.Selector.query(el, null, true) : el,","                lis = Event.getListeners(oEl, type), i, len, children, child;","","            if (recurse && oEl) {","                lis = lis || [];","                children = Y.Selector.query('*', oEl);","                len = children.length;","                for (i = 0; i < len; ++i) {","                    child = Event.getListeners(children[i], type);","                    if (child) {","                        lis = lis.concat(child);","                    }","                }","            }","","            if (lis) {","                for (i = 0, len = lis.length; i < len; ++i) {","                    lis[i].detachAll();","                }","            }","","        },","","        /**","         * Removes all object references and the DOM proxy subscription for","         * a given event for a DOM node.","         *","         * @method _clean","         * @param wrapper {CustomEvent} Custom event proxy for the DOM","         *                  subscription","         * @private","         * @static","         * @since 3.4.0","         */","        _clean: function (wrapper) {","            var key    = wrapper.key,","                domkey = wrapper.domkey;","","            remove(wrapper.el, wrapper.type, wrapper.fn, wrapper.capture);","            delete _wrappers[key];","            delete Y._yuievt.events[key];","            if (_el_events[domkey]) {","                delete _el_events[domkey][key];","                if (!Y.Object.size(_el_events[domkey])) {","                    delete _el_events[domkey];","                }","            }","        },","","        /**","         * Returns all listeners attached to the given element via addListener.","         * Optionally, you can specify a specific type of event to return.","         * @method getListeners","         * @param el {HTMLElement|string} the element or element id to inspect","         * @param type {string} optional type of listener to return. If","         * left out, all listeners will be returned","         * @return {CustomEvent} the custom event wrapper for the DOM event(s)","         * @static","         */","        getListeners: function(el, type) {","            var ek = Y.stamp(el, true), evts = _el_events[ek],","                results=[] , key = (type) ? 'event:' + ek + type : null,","                adapters = _eventenv.plugins;","","            if (!evts) {","                return null;","            }","","            if (key) {","                // look for synthetic events","                if (adapters[type] && adapters[type].eventDef) {","                    key += '_synth';","                }","","                if (evts[key]) {","                    results.push(evts[key]);","                }","","                // get native events as well","                key += 'native';","                if (evts[key]) {","                    results.push(evts[key]);","                }","","            } else {","                Y.each(evts, function(v, k) {","                    results.push(v);","                });","            }","","            return (results.length) ? results : null;","        },","","        /**","         * Removes all listeners registered by pe.event.  Called","         * automatically during the unload event.","         * @method _unload","         * @static","         * @private","         */","        _unload: function(e) {","            Y.each(_wrappers, function(v, k) {","                if (v.type == 'unload') {","                    v.fire(e);","                }","                v.detachAll();","            });","            remove(win, \"unload\", onUnload);","        },","","        /**","         * Adds a DOM event directly without the caching, cleanup, context adj, etc","         *","         * @method nativeAdd","         * @param {HTMLElement} el      the element to bind the handler to","         * @param {string}      type   the type of event handler","         * @param {function}    fn      the callback to invoke","         * @param {boolen}      capture capture or bubble phase","         * @static","         * @private","         */","        nativeAdd: add,","","        /**","         * Basic remove listener","         *","         * @method nativeRemove","         * @param {HTMLElement} el      the element to bind the handler to","         * @param {string}      type   the type of event handler","         * @param {function}    fn      the callback to invoke","         * @param {boolen}      capture capture or bubble phase","         * @static","         * @private","         */","        nativeRemove: remove","    };","","}();","","Y.Event = Event;","","if (config.injected || YUI.Env.windowLoaded) {","    onLoad();","} else {","    add(win, \"load\", onLoad);","}","","// Process onAvailable/onContentReady items when when the DOM is ready in IE","if (Y.UA.ie) {","    Y.on(EVENT_READY, Event._poll);","}","","try {","    add(win, \"unload\", onUnload);","} catch(e) {","}","","Event.Custom = Y.CustomEvent;","Event.Subscriber = Y.Subscriber;","Event.Target = Y.EventTarget;","Event.Handle = Y.EventHandle;","Event.Facade = Y.EventFacade;","","Event._poll();","","}());","","/**"," * DOM event listener abstraction layer"," * @module event"," * @submodule event-base"," */","","/**"," * Executes the callback as soon as the specified element"," * is detected in the DOM.  This function expects a selector"," * string for the element(s) to detect.  If you already have"," * an element reference, you don't need this event."," * @event available"," * @param type {string} 'available'"," * @param fn {function} the callback function to execute."," * @param el {string} an selector for the element(s) to attach"," * @param context optional argument that specifies what 'this' refers to."," * @param args* 0..n additional arguments to pass on to the callback function."," * These arguments will be added after the event object."," * @return {EventHandle} the detach handle"," * @for YUI"," */","Y.Env.evt.plugins.available = {","    on: function(type, fn, id, o) {","        var a = arguments.length > 4 ?  Y.Array(arguments, 4, true) : null;","        return Y.Event.onAvailable.call(Y.Event, id, fn, o, a);","    }","};","","/**"," * Executes the callback as soon as the specified element"," * is detected in the DOM with a nextSibling property"," * (indicating that the element's children are available)."," * This function expects a selector"," * string for the element(s) to detect.  If you already have"," * an element reference, you don't need this event."," * @event contentready"," * @param type {string} 'contentready'"," * @param fn {function} the callback function to execute."," * @param el {string} an selector for the element(s) to attach."," * @param context optional argument that specifies what 'this' refers to."," * @param args* 0..n additional arguments to pass on to the callback function."," * These arguments will be added after the event object."," * @return {EventHandle} the detach handle"," * @for YUI"," */","Y.Env.evt.plugins.contentready = {","    on: function(type, fn, id, o) {","        var a = arguments.length > 4 ? Y.Array(arguments, 4, true) : null;","        return Y.Event.onContentReady.call(Y.Event, id, fn, o, a);","    }","};","","","}, '3.7.3', {\"requires\": [\"event-custom-base\"]});"];
_yuitest_coverage["build/event-base/event-base.js"].lines = {"1":0,"2":0,"4":0,"5":0,"6":0,"7":0,"10":0,"13":0,"42":0,"47":0,"48":0,"50":0,"69":0,"109":0,"110":0,"112":0,"113":0,"114":0,"117":0,"120":0,"124":0,"125":0,"126":0,"129":0,"132":0,"136":0,"143":0,"144":0,"145":0,"146":0,"147":0,"148":0,"149":0,"151":0,"152":0,"166":0,"168":0,"169":0,"172":0,"173":0,"176":0,"178":0,"180":0,"181":0,"182":0,"184":0,"185":0,"188":0,"189":0,"194":0,"195":0,"196":0,"200":0,"201":0,"202":0,"204":0,"206":0,"207":0,"211":0,"212":0,"213":0,"214":0,"215":0,"219":0,"220":0,"222":0,"225":0,"230":0,"231":0,"232":0,"378":0,"397":0,"398":0,"400":0,"408":0,"409":0,"410":0,"414":0,"422":0,"424":0,"426":0,"435":0,"437":0,"438":0,"441":0,"453":0,"496":0,"561":0,"562":0,"594":0,"597":0,"598":0,"607":0,"610":0,"612":0,"616":0,"617":0,"618":0,"621":0,"624":0,"625":0,"626":0,"627":0,"635":0,"661":0,"682":0,"687":0,"691":0,"692":0,"694":0,"695":0,"699":0,"702":0,"704":0,"708":0,"709":0,"711":0,"712":0,"717":0,"720":0,"721":0,"722":0,"723":0,"724":0,"725":0,"727":0,"729":0,"731":0,"732":0,"734":0,"736":0,"737":0,"738":0,"740":0,"743":0,"749":0,"759":0,"760":0,"763":0,"765":0,"769":0,"771":0,"773":0,"774":0,"775":0,"779":0,"786":0,"790":0,"791":0,"794":0,"796":0,"798":0,"799":0,"801":0,"802":0,"804":0,"805":0,"809":0,"811":0,"816":0,"818":0,"822":0,"828":0,"829":0,"832":0,"833":0,"836":0,"837":0,"838":0,"841":0,"846":0,"847":0,"851":0,"852":0,"855":0,"859":0,"861":0,"862":0,"865":0,"888":0,"891":0,"892":0,"896":0,"897":0,"901":0,"904":0,"905":0,"907":0,"908":0,"909":0,"910":0,"911":0,"912":0,"918":0,"919":0,"922":0,"923":0,"924":0,"926":0,"927":0,"928":0,"929":0,"930":0,"933":0,"936":0,"937":0,"940":0,"941":0,"943":0,"944":0,"946":0,"964":0,"966":0,"979":0,"1004":0,"1005":0,"1009":0,"1010":0,"1017":0,"1030":0,"1031":0,"1034":0,"1038":0,"1039":0,"1042":0,"1048":0,"1051":0,"1052":0,"1056":0,"1058":0,"1059":0,"1060":0,"1061":0,"1062":0,"1063":0,"1064":0,"1066":0,"1069":0,"1071":0,"1073":0,"1074":0,"1081":0,"1082":0,"1083":0,"1086":0,"1088":0,"1089":0,"1090":0,"1092":0,"1098":0,"1099":0,"1100":0,"1103":0,"1105":0,"1108":0,"1109":0,"1110":0,"1113":0,"1118":0,"1120":0,"1122":0,"1124":0,"1125":0,"1128":0,"1130":0,"1148":0,"1151":0,"1152":0,"1153":0,"1154":0,"1155":0,"1156":0,"1157":0,"1158":0,"1163":0,"1164":0,"1165":0,"1183":0,"1186":0,"1187":0,"1188":0,"1189":0,"1190":0,"1191":0,"1192":0,"1208":0,"1212":0,"1213":0,"1216":0,"1218":0,"1219":0,"1222":0,"1223":0,"1227":0,"1228":0,"1229":0,"1233":0,"1234":0,"1238":0,"1249":0,"1250":0,"1251":0,"1253":0,"1255":0,"1287":0,"1289":0,"1290":0,"1292":0,"1296":0,"1297":0,"1300":0,"1301":0,"1305":0,"1306":0,"1307":0,"1308":0,"1309":0,"1311":0,"1336":0,"1338":0,"1339":0,"1360":0,"1362":0,"1363":0};
_yuitest_coverage["build/event-base/event-base.js"].functions = {"_ready:5":0,"(anonymous 1):1":0,"(anonymous 3):50":0,"resolve:108":0,"DOMEventFacade:123":0,"init:134":0,"stopPropagation:193":0,"stopImmediatePropagation:199":0,"preventDefault:210":0,"halt:218":0,"onLoad:407":0,"onUnload:413":0,"shouldIterate:421":0,"_deleteAndClean:434":0,"startInterval:560":0,"_delete:614":0,"onAvailable:592":0,"onContentReady:660":0,"attach:681":0,"contextFn:707":0,"fn:724":0,"_createWrapper:685":0,"(anonymous 5):773":0,"(anonymous 6):816":0,"_attach:747":0,"detach:886":0,"getEvent:963":0,"generateId:978":0,"_load:1003":0,"executeItem:1058":0,"_poll:1029":0,"purgeElement:1146":0,"_clean:1182":0,"(anonymous 7):1233":0,"getListeners:1207":0,"(anonymous 8):1249":0,"_unload:1248":0,"Event:444":0,"(anonymous 4):378":0,"on:1337":0,"on:1361":0,"(anonymous 2):13":0};
_yuitest_coverage["build/event-base/event-base.js"].coveredLines = 324;
_yuitest_coverage["build/event-base/event-base.js"].coveredFunctions = 42;
_yuitest_coverline("build/event-base/event-base.js", 1);
(function () {
_yuitest_coverfunc("build/event-base/event-base.js", "(anonymous 1)", 1);
_yuitest_coverline("build/event-base/event-base.js", 2);
var GLOBAL_ENV = YUI.Env;

_yuitest_coverline("build/event-base/event-base.js", 4);
if (!GLOBAL_ENV._ready) {
    _yuitest_coverline("build/event-base/event-base.js", 5);
GLOBAL_ENV._ready = function() {
        _yuitest_coverfunc("build/event-base/event-base.js", "_ready", 5);
_yuitest_coverline("build/event-base/event-base.js", 6);
GLOBAL_ENV.DOMReady = true;
        _yuitest_coverline("build/event-base/event-base.js", 7);
GLOBAL_ENV.remove(YUI.config.doc, 'DOMContentLoaded', GLOBAL_ENV._ready);
    };

    _yuitest_coverline("build/event-base/event-base.js", 10);
GLOBAL_ENV.add(YUI.config.doc, 'DOMContentLoaded', GLOBAL_ENV._ready);
}
})();
_yuitest_coverline("build/event-base/event-base.js", 13);
YUI.add('event-base', function (Y, NAME) {

/*
 * DOM event listener abstraction layer
 * @module event
 * @submodule event-base
 */

/**
 * The domready event fires at the moment the browser's DOM is
 * usable. In most cases, this is before images are fully
 * downloaded, allowing you to provide a more responsive user
 * interface.
 *
 * In YUI 3, domready subscribers will be notified immediately if
 * that moment has already passed when the subscription is created.
 *
 * One exception is if the yui.js file is dynamically injected into
 * the page.  If this is done, you must tell the YUI instance that
 * you did this in order for DOMReady (and window load events) to
 * fire normally.  That configuration option is 'injected' -- set
 * it to true if the yui.js script is not included inline.
 *
 * This method is part of the 'event-ready' module, which is a
 * submodule of 'event'.
 *
 * @event domready
 * @for YUI
 */
_yuitest_coverfunc("build/event-base/event-base.js", "(anonymous 2)", 13);
_yuitest_coverline("build/event-base/event-base.js", 42);
Y.publish('domready', {
    fireOnce: true,
    async: true
});

_yuitest_coverline("build/event-base/event-base.js", 47);
if (YUI.Env.DOMReady) {
    _yuitest_coverline("build/event-base/event-base.js", 48);
Y.fire('domready');
} else {
    _yuitest_coverline("build/event-base/event-base.js", 50);
Y.Do.before(function() { _yuitest_coverfunc("build/event-base/event-base.js", "(anonymous 3)", 50);
Y.fire('domready'); }, YUI.Env, '_ready');
}

/**
 * Custom event engine, DOM event listener abstraction layer, synthetic DOM
 * events.
 * @module event
 * @submodule event-base
 */

/**
 * Wraps a DOM event, properties requiring browser abstraction are
 * fixed here.  Provids a security layer when required.
 * @class DOMEventFacade
 * @param ev {Event} the DOM event
 * @param currentTarget {HTMLElement} the element the listener was attached to
 * @param wrapper {Event.Custom} the custom event wrapper for this DOM event
 */

    _yuitest_coverline("build/event-base/event-base.js", 69);
var ua = Y.UA,

    EMPTY = {},

    /**
     * webkit key remapping required for Safari < 3.1
     * @property webkitKeymap
     * @private
     */
    webkitKeymap = {
        63232: 38, // up
        63233: 40, // down
        63234: 37, // left
        63235: 39, // right
        63276: 33, // page up
        63277: 34, // page down
        25:     9, // SHIFT-TAB (Safari provides a different key code in
                   // this case, even though the shiftKey modifier is set)
        63272: 46, // delete
        63273: 36, // home
        63275: 35  // end
    },

    /**
     * Returns a wrapped node.  Intended to be used on event targets,
     * so it will return the node's parent if the target is a text
     * node.
     *
     * If accessing a property of the node throws an error, this is
     * probably the anonymous div wrapper Gecko adds inside text
     * nodes.  This likely will only occur when attempting to access
     * the relatedTarget.  In this case, we now return null because
     * the anonymous div is completely useless and we do not know
     * what the related target was because we can't even get to
     * the element's parent node.
     *
     * @method resolve
     * @private
     */
    resolve = function(n) {
        _yuitest_coverfunc("build/event-base/event-base.js", "resolve", 108);
_yuitest_coverline("build/event-base/event-base.js", 109);
if (!n) {
            _yuitest_coverline("build/event-base/event-base.js", 110);
return n;
        }
        _yuitest_coverline("build/event-base/event-base.js", 112);
try {
            _yuitest_coverline("build/event-base/event-base.js", 113);
if (n && 3 == n.nodeType) {
                _yuitest_coverline("build/event-base/event-base.js", 114);
n = n.parentNode;
            }
        } catch(e) {
            _yuitest_coverline("build/event-base/event-base.js", 117);
return null;
        }

        _yuitest_coverline("build/event-base/event-base.js", 120);
return Y.one(n);
    },

    DOMEventFacade = function(ev, currentTarget, wrapper) {
        _yuitest_coverfunc("build/event-base/event-base.js", "DOMEventFacade", 123);
_yuitest_coverline("build/event-base/event-base.js", 124);
this._event = ev;
        _yuitest_coverline("build/event-base/event-base.js", 125);
this._currentTarget = currentTarget;
        _yuitest_coverline("build/event-base/event-base.js", 126);
this._wrapper = wrapper || EMPTY;

        // if not lazy init
        _yuitest_coverline("build/event-base/event-base.js", 129);
this.init();
    };

_yuitest_coverline("build/event-base/event-base.js", 132);
Y.extend(DOMEventFacade, Object, {

    init: function() {

        _yuitest_coverfunc("build/event-base/event-base.js", "init", 134);
_yuitest_coverline("build/event-base/event-base.js", 136);
var e = this._event,
            overrides = this._wrapper.overrides,
            x = e.pageX,
            y = e.pageY,
            c,
            currentTarget = this._currentTarget;

        _yuitest_coverline("build/event-base/event-base.js", 143);
this.altKey   = e.altKey;
        _yuitest_coverline("build/event-base/event-base.js", 144);
this.ctrlKey  = e.ctrlKey;
        _yuitest_coverline("build/event-base/event-base.js", 145);
this.metaKey  = e.metaKey;
        _yuitest_coverline("build/event-base/event-base.js", 146);
this.shiftKey = e.shiftKey;
        _yuitest_coverline("build/event-base/event-base.js", 147);
this.type     = (overrides && overrides.type) || e.type;
        _yuitest_coverline("build/event-base/event-base.js", 148);
this.clientX  = e.clientX;
        _yuitest_coverline("build/event-base/event-base.js", 149);
this.clientY  = e.clientY;

        _yuitest_coverline("build/event-base/event-base.js", 151);
this.pageX = x;
        _yuitest_coverline("build/event-base/event-base.js", 152);
this.pageY = y;

        // charCode is unknown in keyup, keydown. keyCode is unknown in keypress.
        // FF 3.6 - 8+? pass 0 for keyCode in keypress events.
        // Webkit, FF 3.6-8+?, and IE9+? pass 0 for charCode in keydown, keyup.
        // Webkit and IE9+? duplicate charCode in keyCode.
        // Opera never sets charCode, always keyCode (though with the charCode).
        // IE6-8 don't set charCode or which.
        // All browsers other than IE6-8 set which=keyCode in keydown, keyup, and 
        // which=charCode in keypress.
        //
        // Moral of the story: (e.which || e.keyCode) will always return the
        // known code for that key event phase. e.keyCode is often different in
        // keypress from keydown and keyup.
        _yuitest_coverline("build/event-base/event-base.js", 166);
c = e.keyCode || e.charCode;

        _yuitest_coverline("build/event-base/event-base.js", 168);
if (ua.webkit && (c in webkitKeymap)) {
            _yuitest_coverline("build/event-base/event-base.js", 169);
c = webkitKeymap[c];
        }

        _yuitest_coverline("build/event-base/event-base.js", 172);
this.keyCode = c;
        _yuitest_coverline("build/event-base/event-base.js", 173);
this.charCode = c;
        // Fill in e.which for IE - implementers should always use this over
        // e.keyCode or e.charCode.
        _yuitest_coverline("build/event-base/event-base.js", 176);
this.which = e.which || e.charCode || c;
        // this.button = e.button;
        _yuitest_coverline("build/event-base/event-base.js", 178);
this.button = this.which;

        _yuitest_coverline("build/event-base/event-base.js", 180);
this.target = resolve(e.target);
        _yuitest_coverline("build/event-base/event-base.js", 181);
this.currentTarget = resolve(currentTarget);
        _yuitest_coverline("build/event-base/event-base.js", 182);
this.relatedTarget = resolve(e.relatedTarget);

        _yuitest_coverline("build/event-base/event-base.js", 184);
if (e.type == "mousewheel" || e.type == "DOMMouseScroll") {
            _yuitest_coverline("build/event-base/event-base.js", 185);
this.wheelDelta = (e.detail) ? (e.detail * -1) : Math.round(e.wheelDelta / 80) || ((e.wheelDelta < 0) ? -1 : 1);
        }

        _yuitest_coverline("build/event-base/event-base.js", 188);
if (this._touch) {
            _yuitest_coverline("build/event-base/event-base.js", 189);
this._touch(e, currentTarget, this._wrapper);
        }
    },

    stopPropagation: function() {
        _yuitest_coverfunc("build/event-base/event-base.js", "stopPropagation", 193);
_yuitest_coverline("build/event-base/event-base.js", 194);
this._event.stopPropagation();
        _yuitest_coverline("build/event-base/event-base.js", 195);
this._wrapper.stopped = 1;
        _yuitest_coverline("build/event-base/event-base.js", 196);
this.stopped = 1;
    },

    stopImmediatePropagation: function() {
        _yuitest_coverfunc("build/event-base/event-base.js", "stopImmediatePropagation", 199);
_yuitest_coverline("build/event-base/event-base.js", 200);
var e = this._event;
        _yuitest_coverline("build/event-base/event-base.js", 201);
if (e.stopImmediatePropagation) {
            _yuitest_coverline("build/event-base/event-base.js", 202);
e.stopImmediatePropagation();
        } else {
            _yuitest_coverline("build/event-base/event-base.js", 204);
this.stopPropagation();
        }
        _yuitest_coverline("build/event-base/event-base.js", 206);
this._wrapper.stopped = 2;
        _yuitest_coverline("build/event-base/event-base.js", 207);
this.stopped = 2;
    },

    preventDefault: function(returnValue) {
        _yuitest_coverfunc("build/event-base/event-base.js", "preventDefault", 210);
_yuitest_coverline("build/event-base/event-base.js", 211);
var e = this._event;
        _yuitest_coverline("build/event-base/event-base.js", 212);
e.preventDefault();
        _yuitest_coverline("build/event-base/event-base.js", 213);
e.returnValue = returnValue || false;
        _yuitest_coverline("build/event-base/event-base.js", 214);
this._wrapper.prevented = 1;
        _yuitest_coverline("build/event-base/event-base.js", 215);
this.prevented = 1;
    },

    halt: function(immediate) {
        _yuitest_coverfunc("build/event-base/event-base.js", "halt", 218);
_yuitest_coverline("build/event-base/event-base.js", 219);
if (immediate) {
            _yuitest_coverline("build/event-base/event-base.js", 220);
this.stopImmediatePropagation();
        } else {
            _yuitest_coverline("build/event-base/event-base.js", 222);
this.stopPropagation();
        }

        _yuitest_coverline("build/event-base/event-base.js", 225);
this.preventDefault();
    }

});

_yuitest_coverline("build/event-base/event-base.js", 230);
DOMEventFacade.resolve = resolve;
_yuitest_coverline("build/event-base/event-base.js", 231);
Y.DOM2EventFacade = DOMEventFacade;
_yuitest_coverline("build/event-base/event-base.js", 232);
Y.DOMEventFacade = DOMEventFacade;

    /**
     * The native event
     * @property _event
     * @type {Native DOM Event}
     * @private
     */

    /**
    The name of the event (e.g. "click")

    @property type
    @type {String}
    **/

    /**
    `true` if the "alt" or "option" key is pressed.

    @property altKey
    @type {Boolean}
    **/

    /**
    `true` if the shift key is pressed.

    @property shiftKey
    @type {Boolean}
    **/

    /**
    `true` if the "Windows" key on a Windows keyboard, "command" key on an
    Apple keyboard, or "meta" key on other keyboards is pressed.

    @property metaKey
    @type {Boolean}
    **/

    /**
    `true` if the "Ctrl" or "control" key is pressed.

    @property ctrlKey
    @type {Boolean}
    **/

    /**
     * The X location of the event on the page (including scroll)
     * @property pageX
     * @type {Number}
     */

    /**
     * The Y location of the event on the page (including scroll)
     * @property pageY
     * @type {Number}
     */

    /**
     * The X location of the event in the viewport
     * @property clientX
     * @type {Number}
     */

    /**
     * The Y location of the event in the viewport
     * @property clientY
     * @type {Number}
     */

    /**
     * The keyCode for key events.  Uses charCode if keyCode is not available
     * @property keyCode
     * @type {Number}
     */

    /**
     * The charCode for key events.  Same as keyCode
     * @property charCode
     * @type {Number}
     */

    /**
     * The button that was pushed. 1 for left click, 2 for middle click, 3 for
     * right click.  This is only reliably populated on `mouseup` events.
     * @property button
     * @type {Number}
     */

    /**
     * The button that was pushed.  Same as button.
     * @property which
     * @type {Number}
     */

    /**
     * Node reference for the targeted element
     * @property target
     * @type {Node}
     */

    /**
     * Node reference for the element that the listener was attached to.
     * @property currentTarget
     * @type {Node}
     */

    /**
     * Node reference to the relatedTarget
     * @property relatedTarget
     * @type {Node}
     */

    /**
     * Number representing the direction and velocity of the movement of the mousewheel.
     * Negative is down, the higher the number, the faster.  Applies to the mousewheel event.
     * @property wheelDelta
     * @type {Number}
     */

    /**
     * Stops the propagation to the next bubble target
     * @method stopPropagation
     */

    /**
     * Stops the propagation to the next bubble target and
     * prevents any additional listeners from being exectued
     * on the current target.
     * @method stopImmediatePropagation
     */

    /**
     * Prevents the event's default behavior
     * @method preventDefault
     * @param returnValue {string} sets the returnValue of the event to this value
     * (rather than the default false value).  This can be used to add a customized
     * confirmation query to the beforeunload event).
     */

    /**
     * Stops the event propagation and prevents the default
     * event behavior.
     * @method halt
     * @param immediate {boolean} if true additional listeners
     * on the current target will not be executed
     */
_yuitest_coverline("build/event-base/event-base.js", 378);
(function() {
/**
 * The event utility provides functions to add and remove event listeners,
 * event cleansing.  It also tries to automatically remove listeners it
 * registers during the unload event.
 * @module event
 * @main event
 * @submodule event-base
 */

/**
 * The event utility provides functions to add and remove event listeners,
 * event cleansing.  It also tries to automatically remove listeners it
 * registers during the unload event.
 *
 * @class Event
 * @static
 */

_yuitest_coverfunc("build/event-base/event-base.js", "(anonymous 4)", 378);
_yuitest_coverline("build/event-base/event-base.js", 397);
Y.Env.evt.dom_wrappers = {};
_yuitest_coverline("build/event-base/event-base.js", 398);
Y.Env.evt.dom_map = {};

_yuitest_coverline("build/event-base/event-base.js", 400);
var YDOM = Y.DOM,
    _eventenv = Y.Env.evt,
    config = Y.config,
    win = config.win,
    add = YUI.Env.add,
    remove = YUI.Env.remove,

    onLoad = function() {
        _yuitest_coverfunc("build/event-base/event-base.js", "onLoad", 407);
_yuitest_coverline("build/event-base/event-base.js", 408);
YUI.Env.windowLoaded = true;
        _yuitest_coverline("build/event-base/event-base.js", 409);
Y.Event._load();
        _yuitest_coverline("build/event-base/event-base.js", 410);
remove(win, "load", onLoad);
    },

    onUnload = function() {
        _yuitest_coverfunc("build/event-base/event-base.js", "onUnload", 413);
_yuitest_coverline("build/event-base/event-base.js", 414);
Y.Event._unload();
    },

    EVENT_READY = 'domready',

    COMPAT_ARG = '~yui|2|compat~',

    shouldIterate = function(o) {
        _yuitest_coverfunc("build/event-base/event-base.js", "shouldIterate", 421);
_yuitest_coverline("build/event-base/event-base.js", 422);
try {
            // TODO: See if there's a more performant way to return true early on this, for the common case
            _yuitest_coverline("build/event-base/event-base.js", 424);
return (o && typeof o !== "string" && Y.Lang.isNumber(o.length) && !o.tagName && !YDOM.isWindow(o));
        } catch(ex) {
            _yuitest_coverline("build/event-base/event-base.js", 426);
return false;
        }
    },

    // aliases to support DOM event subscription clean up when the last
    // subscriber is detached. deleteAndClean overrides the DOM event's wrapper
    // CustomEvent _delete method.
    _ceProtoDelete = Y.CustomEvent.prototype._delete,
    _deleteAndClean = function(s) {
        _yuitest_coverfunc("build/event-base/event-base.js", "_deleteAndClean", 434);
_yuitest_coverline("build/event-base/event-base.js", 435);
var ret = _ceProtoDelete.apply(this, arguments);

        _yuitest_coverline("build/event-base/event-base.js", 437);
if (!this.hasSubs()) {
            _yuitest_coverline("build/event-base/event-base.js", 438);
Y.Event._clean(this);
        }

        _yuitest_coverline("build/event-base/event-base.js", 441);
return ret;
    },

Event = function() {

    /**
     * True after the onload event has fired
     * @property _loadComplete
     * @type boolean
     * @static
     * @private
     */
    _yuitest_coverfunc("build/event-base/event-base.js", "Event", 444);
_yuitest_coverline("build/event-base/event-base.js", 453);
var _loadComplete =  false,

    /**
     * The number of times to poll after window.onload.  This number is
     * increased if additional late-bound handlers are requested after
     * the page load.
     * @property _retryCount
     * @static
     * @private
     */
    _retryCount = 0,

    /**
     * onAvailable listeners
     * @property _avail
     * @static
     * @private
     */
    _avail = [],

    /**
     * Custom event wrappers for DOM events.  Key is
     * 'event:' + Element uid stamp + event type
     * @property _wrappers
     * @type Y.Event.Custom
     * @static
     * @private
     */
    _wrappers = _eventenv.dom_wrappers,

    _windowLoadKey = null,

    /**
     * Custom event wrapper map DOM events.  Key is
     * Element uid stamp.  Each item is a hash of custom event
     * wrappers as provided in the _wrappers collection.  This
     * provides the infrastructure for getListeners.
     * @property _el_events
     * @static
     * @private
     */
    _el_events = _eventenv.dom_map;

    _yuitest_coverline("build/event-base/event-base.js", 496);
return {

        /**
         * The number of times we should look for elements that are not
         * in the DOM at the time the event is requested after the document
         * has been loaded.  The default is 1000@amp;40 ms, so it will poll
         * for 40 seconds or until all outstanding handlers are bound
         * (whichever comes first).
         * @property POLL_RETRYS
         * @type int
         * @static
         * @final
         */
        POLL_RETRYS: 1000,

        /**
         * The poll interval in milliseconds
         * @property POLL_INTERVAL
         * @type int
         * @static
         * @final
         */
        POLL_INTERVAL: 40,

        /**
         * addListener/removeListener can throw errors in unexpected scenarios.
         * These errors are suppressed, the method returns false, and this property
         * is set
         * @property lastError
         * @static
         * @type Error
         */
        lastError: null,


        /**
         * poll handle
         * @property _interval
         * @static
         * @private
         */
        _interval: null,

        /**
         * document readystate poll handle
         * @property _dri
         * @static
         * @private
         */
         _dri: null,

        /**
         * True when the document is initially usable
         * @property DOMReady
         * @type boolean
         * @static
         */
        DOMReady: false,

        /**
         * @method startInterval
         * @static
         * @private
         */
        startInterval: function() {
            _yuitest_coverfunc("build/event-base/event-base.js", "startInterval", 560);
_yuitest_coverline("build/event-base/event-base.js", 561);
if (!Event._interval) {
_yuitest_coverline("build/event-base/event-base.js", 562);
Event._interval = setInterval(Event._poll, Event.POLL_INTERVAL);
            }
        },

        /**
         * Executes the supplied callback when the item with the supplied
         * id is found.  This is meant to be used to execute behavior as
         * soon as possible as the page loads.  If you use this after the
         * initial page load it will poll for a fixed time for the element.
         * The number of times it will poll and the frequency are
         * configurable.  By default it will poll for 10 seconds.
         *
         * <p>The callback is executed with a single parameter:
         * the custom object parameter, if provided.</p>
         *
         * @method onAvailable
         *
         * @param {string||string[]}   id the id of the element, or an array
         * of ids to look for.
         * @param {function} fn what to execute when the element is found.
         * @param {object}   p_obj an optional object to be passed back as
         *                   a parameter to fn.
         * @param {boolean|object}  p_override If set to true, fn will execute
         *                   in the context of p_obj, if set to an object it
         *                   will execute in the context of that object
         * @param checkContent {boolean} check child node readiness (onContentReady)
         * @static
         * @deprecated Use Y.on("available")
         */
        // @TODO fix arguments
        onAvailable: function(id, fn, p_obj, p_override, checkContent, compat) {

            _yuitest_coverfunc("build/event-base/event-base.js", "onAvailable", 592);
_yuitest_coverline("build/event-base/event-base.js", 594);
var a = Y.Array(id), i, availHandle;


            _yuitest_coverline("build/event-base/event-base.js", 597);
for (i=0; i<a.length; i=i+1) {
                _yuitest_coverline("build/event-base/event-base.js", 598);
_avail.push({
                    id:         a[i],
                    fn:         fn,
                    obj:        p_obj,
                    override:   p_override,
                    checkReady: checkContent,
                    compat:     compat
                });
            }
            _yuitest_coverline("build/event-base/event-base.js", 607);
_retryCount = this.POLL_RETRYS;

            // We want the first test to be immediate, but async
            _yuitest_coverline("build/event-base/event-base.js", 610);
setTimeout(Event._poll, 0);

            _yuitest_coverline("build/event-base/event-base.js", 612);
availHandle = new Y.EventHandle({

                _delete: function() {
                    // set by the event system for lazy DOM listeners
                    _yuitest_coverfunc("build/event-base/event-base.js", "_delete", 614);
_yuitest_coverline("build/event-base/event-base.js", 616);
if (availHandle.handle) {
                        _yuitest_coverline("build/event-base/event-base.js", 617);
availHandle.handle.detach();
                        _yuitest_coverline("build/event-base/event-base.js", 618);
return;
                    }

                    _yuitest_coverline("build/event-base/event-base.js", 621);
var i, j;

                    // otherwise try to remove the onAvailable listener(s)
                    _yuitest_coverline("build/event-base/event-base.js", 624);
for (i = 0; i < a.length; i++) {
                        _yuitest_coverline("build/event-base/event-base.js", 625);
for (j = 0; j < _avail.length; j++) {
                            _yuitest_coverline("build/event-base/event-base.js", 626);
if (a[i] === _avail[j].id) {
                                _yuitest_coverline("build/event-base/event-base.js", 627);
_avail.splice(j, 1);
                            }
                        }
                    }
                }

            });

            _yuitest_coverline("build/event-base/event-base.js", 635);
return availHandle;
        },

        /**
         * Works the same way as onAvailable, but additionally checks the
         * state of sibling elements to determine if the content of the
         * available element is safe to modify.
         *
         * <p>The callback is executed with a single parameter:
         * the custom object parameter, if provided.</p>
         *
         * @method onContentReady
         *
         * @param {string}   id the id of the element to look for.
         * @param {function} fn what to execute when the element is ready.
         * @param {object}   obj an optional object to be passed back as
         *                   a parameter to fn.
         * @param {boolean|object}  override If set to true, fn will execute
         *                   in the context of p_obj.  If an object, fn will
         *                   exectute in the context of that object
         *
         * @static
         * @deprecated Use Y.on("contentready")
         */
        // @TODO fix arguments
        onContentReady: function(id, fn, obj, override, compat) {
            _yuitest_coverfunc("build/event-base/event-base.js", "onContentReady", 660);
_yuitest_coverline("build/event-base/event-base.js", 661);
return Event.onAvailable(id, fn, obj, override, true, compat);
        },

        /**
         * Adds an event listener
         *
         * @method attach
         *
         * @param {String}   type     The type of event to append
         * @param {Function} fn        The method the event invokes
         * @param {String|HTMLElement|Array|NodeList} el An id, an element
         *  reference, or a collection of ids and/or elements to assign the
         *  listener to.
         * @param {Object}   context optional context object
         * @param {Boolean|object}  args 0..n arguments to pass to the callback
         * @return {EventHandle} an object to that can be used to detach the listener
         *
         * @static
         */

        attach: function(type, fn, el, context) {
            _yuitest_coverfunc("build/event-base/event-base.js", "attach", 681);
_yuitest_coverline("build/event-base/event-base.js", 682);
return Event._attach(Y.Array(arguments, 0, true));
        },

        _createWrapper: function (el, type, capture, compat, facade) {

            _yuitest_coverfunc("build/event-base/event-base.js", "_createWrapper", 685);
_yuitest_coverline("build/event-base/event-base.js", 687);
var cewrapper,
                ek  = Y.stamp(el),
                key = 'event:' + ek + type;

            _yuitest_coverline("build/event-base/event-base.js", 691);
if (false === facade) {
                _yuitest_coverline("build/event-base/event-base.js", 692);
key += 'native';
            }
            _yuitest_coverline("build/event-base/event-base.js", 694);
if (capture) {
                _yuitest_coverline("build/event-base/event-base.js", 695);
key += 'capture';
            }


            _yuitest_coverline("build/event-base/event-base.js", 699);
cewrapper = _wrappers[key];


            _yuitest_coverline("build/event-base/event-base.js", 702);
if (!cewrapper) {
                // create CE wrapper
                _yuitest_coverline("build/event-base/event-base.js", 704);
cewrapper = Y.publish(key, {
                    silent: true,
                    bubbles: false,
                    contextFn: function() {
                        _yuitest_coverfunc("build/event-base/event-base.js", "contextFn", 707);
_yuitest_coverline("build/event-base/event-base.js", 708);
if (compat) {
                            _yuitest_coverline("build/event-base/event-base.js", 709);
return cewrapper.el;
                        } else {
                            _yuitest_coverline("build/event-base/event-base.js", 711);
cewrapper.nodeRef = cewrapper.nodeRef || Y.one(cewrapper.el);
                            _yuitest_coverline("build/event-base/event-base.js", 712);
return cewrapper.nodeRef;
                        }
                    }
                });

                _yuitest_coverline("build/event-base/event-base.js", 717);
cewrapper.overrides = {};

                // for later removeListener calls
                _yuitest_coverline("build/event-base/event-base.js", 720);
cewrapper.el = el;
                _yuitest_coverline("build/event-base/event-base.js", 721);
cewrapper.key = key;
                _yuitest_coverline("build/event-base/event-base.js", 722);
cewrapper.domkey = ek;
                _yuitest_coverline("build/event-base/event-base.js", 723);
cewrapper.type = type;
                _yuitest_coverline("build/event-base/event-base.js", 724);
cewrapper.fn = function(e) {
                    _yuitest_coverfunc("build/event-base/event-base.js", "fn", 724);
_yuitest_coverline("build/event-base/event-base.js", 725);
cewrapper.fire(Event.getEvent(e, el, (compat || (false === facade))));
                };
                _yuitest_coverline("build/event-base/event-base.js", 727);
cewrapper.capture = capture;

                _yuitest_coverline("build/event-base/event-base.js", 729);
if (el == win && type == "load") {
                    // window load happens once
                    _yuitest_coverline("build/event-base/event-base.js", 731);
cewrapper.fireOnce = true;
                    _yuitest_coverline("build/event-base/event-base.js", 732);
_windowLoadKey = key;
                }
                _yuitest_coverline("build/event-base/event-base.js", 734);
cewrapper._delete = _deleteAndClean;

                _yuitest_coverline("build/event-base/event-base.js", 736);
_wrappers[key] = cewrapper;
                _yuitest_coverline("build/event-base/event-base.js", 737);
_el_events[ek] = _el_events[ek] || {};
                _yuitest_coverline("build/event-base/event-base.js", 738);
_el_events[ek][key] = cewrapper;

                _yuitest_coverline("build/event-base/event-base.js", 740);
add(el, type, cewrapper.fn, capture);
            }

            _yuitest_coverline("build/event-base/event-base.js", 743);
return cewrapper;

        },

        _attach: function(args, conf) {

            _yuitest_coverfunc("build/event-base/event-base.js", "_attach", 747);
_yuitest_coverline("build/event-base/event-base.js", 749);
var compat,
                handles, oEl, cewrapper, context,
                fireNow = false, ret,
                type = args[0],
                fn = args[1],
                el = args[2] || win,
                facade = conf && conf.facade,
                capture = conf && conf.capture,
                overrides = conf && conf.overrides;

            _yuitest_coverline("build/event-base/event-base.js", 759);
if (args[args.length-1] === COMPAT_ARG) {
                _yuitest_coverline("build/event-base/event-base.js", 760);
compat = true;
            }

            _yuitest_coverline("build/event-base/event-base.js", 763);
if (!fn || !fn.call) {
// throw new TypeError(type + " attach call failed, callback undefined");
                _yuitest_coverline("build/event-base/event-base.js", 765);
return false;
            }

            // The el argument can be an array of elements or element ids.
            _yuitest_coverline("build/event-base/event-base.js", 769);
if (shouldIterate(el)) {

                _yuitest_coverline("build/event-base/event-base.js", 771);
handles=[];

                _yuitest_coverline("build/event-base/event-base.js", 773);
Y.each(el, function(v, k) {
                    _yuitest_coverfunc("build/event-base/event-base.js", "(anonymous 5)", 773);
_yuitest_coverline("build/event-base/event-base.js", 774);
args[2] = v;
                    _yuitest_coverline("build/event-base/event-base.js", 775);
handles.push(Event._attach(args.slice(), conf));
                });

                // return (handles.length === 1) ? handles[0] : handles;
                _yuitest_coverline("build/event-base/event-base.js", 779);
return new Y.EventHandle(handles);

            // If the el argument is a string, we assume it is
            // actually the id of the element.  If the page is loaded
            // we convert el to the actual element, otherwise we
            // defer attaching the event until the element is
            // ready
            } else {_yuitest_coverline("build/event-base/event-base.js", 786);
if (Y.Lang.isString(el)) {

                // oEl = (compat) ? Y.DOM.byId(el) : Y.Selector.query(el);

                _yuitest_coverline("build/event-base/event-base.js", 790);
if (compat) {
                    _yuitest_coverline("build/event-base/event-base.js", 791);
oEl = YDOM.byId(el);
                } else {

                    _yuitest_coverline("build/event-base/event-base.js", 794);
oEl = Y.Selector.query(el);

                    _yuitest_coverline("build/event-base/event-base.js", 796);
switch (oEl.length) {
                        case 0:
                            _yuitest_coverline("build/event-base/event-base.js", 798);
oEl = null;
                            _yuitest_coverline("build/event-base/event-base.js", 799);
break;
                        case 1:
                            _yuitest_coverline("build/event-base/event-base.js", 801);
oEl = oEl[0];
                            _yuitest_coverline("build/event-base/event-base.js", 802);
break;
                        default:
                            _yuitest_coverline("build/event-base/event-base.js", 804);
args[2] = oEl;
                            _yuitest_coverline("build/event-base/event-base.js", 805);
return Event._attach(args, conf);
                    }
                }

                _yuitest_coverline("build/event-base/event-base.js", 809);
if (oEl) {

                    _yuitest_coverline("build/event-base/event-base.js", 811);
el = oEl;

                // Not found = defer adding the event until the element is available
                } else {

                    _yuitest_coverline("build/event-base/event-base.js", 816);
ret = Event.onAvailable(el, function() {

                        _yuitest_coverfunc("build/event-base/event-base.js", "(anonymous 6)", 816);
_yuitest_coverline("build/event-base/event-base.js", 818);
ret.handle = Event._attach(args, conf);

                    }, Event, true, false, compat);

                    _yuitest_coverline("build/event-base/event-base.js", 822);
return ret;

                }
            }}

            // Element should be an html element or node
            _yuitest_coverline("build/event-base/event-base.js", 828);
if (!el) {
                _yuitest_coverline("build/event-base/event-base.js", 829);
return false;
            }

            _yuitest_coverline("build/event-base/event-base.js", 832);
if (Y.Node && Y.instanceOf(el, Y.Node)) {
                _yuitest_coverline("build/event-base/event-base.js", 833);
el = Y.Node.getDOMNode(el);
            }

            _yuitest_coverline("build/event-base/event-base.js", 836);
cewrapper = Event._createWrapper(el, type, capture, compat, facade);
            _yuitest_coverline("build/event-base/event-base.js", 837);
if (overrides) {
                _yuitest_coverline("build/event-base/event-base.js", 838);
Y.mix(cewrapper.overrides, overrides);
            }

            _yuitest_coverline("build/event-base/event-base.js", 841);
if (el == win && type == "load") {

                // if the load is complete, fire immediately.
                // all subscribers, including the current one
                // will be notified.
                _yuitest_coverline("build/event-base/event-base.js", 846);
if (YUI.Env.windowLoaded) {
                    _yuitest_coverline("build/event-base/event-base.js", 847);
fireNow = true;
                }
            }

            _yuitest_coverline("build/event-base/event-base.js", 851);
if (compat) {
                _yuitest_coverline("build/event-base/event-base.js", 852);
args.pop();
            }

            _yuitest_coverline("build/event-base/event-base.js", 855);
context = args[3];

            // set context to the Node if not specified
            // ret = cewrapper.on.apply(cewrapper, trimmedArgs);
            _yuitest_coverline("build/event-base/event-base.js", 859);
ret = cewrapper._on(fn, context, (args.length > 4) ? args.slice(4) : null);

            _yuitest_coverline("build/event-base/event-base.js", 861);
if (fireNow) {
                _yuitest_coverline("build/event-base/event-base.js", 862);
cewrapper.fire();
            }

            _yuitest_coverline("build/event-base/event-base.js", 865);
return ret;

        },

        /**
         * Removes an event listener.  Supports the signature the event was bound
         * with, but the preferred way to remove listeners is using the handle
         * that is returned when using Y.on
         *
         * @method detach
         *
         * @param {String} type the type of event to remove.
         * @param {Function} fn the method the event invokes.  If fn is
         * undefined, then all event handlers for the type of event are
         * removed.
         * @param {String|HTMLElement|Array|NodeList|EventHandle} el An
         * event handle, an id, an element reference, or a collection
         * of ids and/or elements to remove the listener from.
         * @return {boolean} true if the unbind was successful, false otherwise.
         * @static
         */
        detach: function(type, fn, el, obj) {

            _yuitest_coverfunc("build/event-base/event-base.js", "detach", 886);
_yuitest_coverline("build/event-base/event-base.js", 888);
var args=Y.Array(arguments, 0, true), compat, l, ok, i,
                id, ce;

            _yuitest_coverline("build/event-base/event-base.js", 891);
if (args[args.length-1] === COMPAT_ARG) {
                _yuitest_coverline("build/event-base/event-base.js", 892);
compat = true;
                // args.pop();
            }

            _yuitest_coverline("build/event-base/event-base.js", 896);
if (type && type.detach) {
                _yuitest_coverline("build/event-base/event-base.js", 897);
return type.detach();
            }

            // The el argument can be a string
            _yuitest_coverline("build/event-base/event-base.js", 901);
if (typeof el == "string") {

                // el = (compat) ? Y.DOM.byId(el) : Y.all(el);
                _yuitest_coverline("build/event-base/event-base.js", 904);
if (compat) {
                    _yuitest_coverline("build/event-base/event-base.js", 905);
el = YDOM.byId(el);
                } else {
                    _yuitest_coverline("build/event-base/event-base.js", 907);
el = Y.Selector.query(el);
                    _yuitest_coverline("build/event-base/event-base.js", 908);
l = el.length;
                    _yuitest_coverline("build/event-base/event-base.js", 909);
if (l < 1) {
                        _yuitest_coverline("build/event-base/event-base.js", 910);
el = null;
                    } else {_yuitest_coverline("build/event-base/event-base.js", 911);
if (l == 1) {
                        _yuitest_coverline("build/event-base/event-base.js", 912);
el = el[0];
                    }}
                }
                // return Event.detach.apply(Event, args);
            }

            _yuitest_coverline("build/event-base/event-base.js", 918);
if (!el) {
                _yuitest_coverline("build/event-base/event-base.js", 919);
return false;
            }

            _yuitest_coverline("build/event-base/event-base.js", 922);
if (el.detach) {
                _yuitest_coverline("build/event-base/event-base.js", 923);
args.splice(2, 1);
                _yuitest_coverline("build/event-base/event-base.js", 924);
return el.detach.apply(el, args);
            // The el argument can be an array of elements or element ids.
            } else {_yuitest_coverline("build/event-base/event-base.js", 926);
if (shouldIterate(el)) {
                _yuitest_coverline("build/event-base/event-base.js", 927);
ok = true;
                _yuitest_coverline("build/event-base/event-base.js", 928);
for (i=0, l=el.length; i<l; ++i) {
                    _yuitest_coverline("build/event-base/event-base.js", 929);
args[2] = el[i];
                    _yuitest_coverline("build/event-base/event-base.js", 930);
ok = ( Y.Event.detach.apply(Y.Event, args) && ok );
                }

                _yuitest_coverline("build/event-base/event-base.js", 933);
return ok;
            }}

            _yuitest_coverline("build/event-base/event-base.js", 936);
if (!type || !fn || !fn.call) {
                _yuitest_coverline("build/event-base/event-base.js", 937);
return Event.purgeElement(el, false, type);
            }

            _yuitest_coverline("build/event-base/event-base.js", 940);
id = 'event:' + Y.stamp(el) + type;
            _yuitest_coverline("build/event-base/event-base.js", 941);
ce = _wrappers[id];

            _yuitest_coverline("build/event-base/event-base.js", 943);
if (ce) {
                _yuitest_coverline("build/event-base/event-base.js", 944);
return ce.detach(fn);
            } else {
                _yuitest_coverline("build/event-base/event-base.js", 946);
return false;
            }

        },

        /**
         * Finds the event in the window object, the caller's arguments, or
         * in the arguments of another method in the callstack.  This is
         * executed automatically for events registered through the event
         * manager, so the implementer should not normally need to execute
         * this function at all.
         * @method getEvent
         * @param {Event} e the event parameter from the handler
         * @param {HTMLElement} el the element the listener was attached to
         * @return {Event} the event
         * @static
         */
        getEvent: function(e, el, noFacade) {
            _yuitest_coverfunc("build/event-base/event-base.js", "getEvent", 963);
_yuitest_coverline("build/event-base/event-base.js", 964);
var ev = e || win.event;

            _yuitest_coverline("build/event-base/event-base.js", 966);
return (noFacade) ? ev :
                new Y.DOMEventFacade(ev, el, _wrappers['event:' + Y.stamp(el) + e.type]);
        },

        /**
         * Generates an unique ID for the element if it does not already
         * have one.
         * @method generateId
         * @param el the element to create the id for
         * @return {string} the resulting id of the element
         * @static
         */
        generateId: function(el) {
            _yuitest_coverfunc("build/event-base/event-base.js", "generateId", 978);
_yuitest_coverline("build/event-base/event-base.js", 979);
return YDOM.generateID(el);
        },

        /**
         * We want to be able to use getElementsByTagName as a collection
         * to attach a group of events to.  Unfortunately, different
         * browsers return different types of collections.  This function
         * tests to determine if the object is array-like.  It will also
         * fail if the object is an array, but is empty.
         * @method _isValidCollection
         * @param o the object to test
         * @return {boolean} true if the object is array-like and populated
         * @deprecated was not meant to be used directly
         * @static
         * @private
         */
        _isValidCollection: shouldIterate,

        /**
         * hook up any deferred listeners
         * @method _load
         * @static
         * @private
         */
        _load: function(e) {
            _yuitest_coverfunc("build/event-base/event-base.js", "_load", 1003);
_yuitest_coverline("build/event-base/event-base.js", 1004);
if (!_loadComplete) {
                _yuitest_coverline("build/event-base/event-base.js", 1005);
_loadComplete = true;

                // Just in case DOMReady did not go off for some reason
                // E._ready();
                _yuitest_coverline("build/event-base/event-base.js", 1009);
if (Y.fire) {
                    _yuitest_coverline("build/event-base/event-base.js", 1010);
Y.fire(EVENT_READY);
                }

                // Available elements may not have been detected before the
                // window load event fires. Try to find them now so that the
                // the user is more likely to get the onAvailable notifications
                // before the window load notification
                _yuitest_coverline("build/event-base/event-base.js", 1017);
Event._poll();
            }
        },

        /**
         * Polling function that runs before the onload event fires,
         * attempting to attach to DOM Nodes as soon as they are
         * available
         * @method _poll
         * @static
         * @private
         */
        _poll: function() {
            _yuitest_coverfunc("build/event-base/event-base.js", "_poll", 1029);
_yuitest_coverline("build/event-base/event-base.js", 1030);
if (Event.locked) {
                _yuitest_coverline("build/event-base/event-base.js", 1031);
return;
            }

            _yuitest_coverline("build/event-base/event-base.js", 1034);
if (Y.UA.ie && !YUI.Env.DOMReady) {
                // Hold off if DOMReady has not fired and check current
                // readyState to protect against the IE operation aborted
                // issue.
                _yuitest_coverline("build/event-base/event-base.js", 1038);
Event.startInterval();
                _yuitest_coverline("build/event-base/event-base.js", 1039);
return;
            }

            _yuitest_coverline("build/event-base/event-base.js", 1042);
Event.locked = true;

            // keep trying until after the page is loaded.  We need to
            // check the page load state prior to trying to bind the
            // elements so that we can be certain all elements have been
            // tested appropriately
            _yuitest_coverline("build/event-base/event-base.js", 1048);
var i, len, item, el, notAvail, executeItem,
                tryAgain = !_loadComplete;

            _yuitest_coverline("build/event-base/event-base.js", 1051);
if (!tryAgain) {
                _yuitest_coverline("build/event-base/event-base.js", 1052);
tryAgain = (_retryCount > 0);
            }

            // onAvailable
            _yuitest_coverline("build/event-base/event-base.js", 1056);
notAvail = [];

            _yuitest_coverline("build/event-base/event-base.js", 1058);
executeItem = function (el, item) {
                _yuitest_coverfunc("build/event-base/event-base.js", "executeItem", 1058);
_yuitest_coverline("build/event-base/event-base.js", 1059);
var context, ov = item.override;
                _yuitest_coverline("build/event-base/event-base.js", 1060);
try {
                    _yuitest_coverline("build/event-base/event-base.js", 1061);
if (item.compat) {
                        _yuitest_coverline("build/event-base/event-base.js", 1062);
if (item.override) {
                            _yuitest_coverline("build/event-base/event-base.js", 1063);
if (ov === true) {
                                _yuitest_coverline("build/event-base/event-base.js", 1064);
context = item.obj;
                            } else {
                                _yuitest_coverline("build/event-base/event-base.js", 1066);
context = ov;
                            }
                        } else {
                            _yuitest_coverline("build/event-base/event-base.js", 1069);
context = el;
                        }
                        _yuitest_coverline("build/event-base/event-base.js", 1071);
item.fn.call(context, item.obj);
                    } else {
                        _yuitest_coverline("build/event-base/event-base.js", 1073);
context = item.obj || Y.one(el);
                        _yuitest_coverline("build/event-base/event-base.js", 1074);
item.fn.apply(context, (Y.Lang.isArray(ov)) ? ov : []);
                    }
                } catch (e) {
                }
            };

            // onAvailable
            _yuitest_coverline("build/event-base/event-base.js", 1081);
for (i=0,len=_avail.length; i<len; ++i) {
                _yuitest_coverline("build/event-base/event-base.js", 1082);
item = _avail[i];
                _yuitest_coverline("build/event-base/event-base.js", 1083);
if (item && !item.checkReady) {

                    // el = (item.compat) ? Y.DOM.byId(item.id) : Y.one(item.id);
                    _yuitest_coverline("build/event-base/event-base.js", 1086);
el = (item.compat) ? YDOM.byId(item.id) : Y.Selector.query(item.id, null, true);

                    _yuitest_coverline("build/event-base/event-base.js", 1088);
if (el) {
                        _yuitest_coverline("build/event-base/event-base.js", 1089);
executeItem(el, item);
                        _yuitest_coverline("build/event-base/event-base.js", 1090);
_avail[i] = null;
                    } else {
                        _yuitest_coverline("build/event-base/event-base.js", 1092);
notAvail.push(item);
                    }
                }
            }

            // onContentReady
            _yuitest_coverline("build/event-base/event-base.js", 1098);
for (i=0,len=_avail.length; i<len; ++i) {
                _yuitest_coverline("build/event-base/event-base.js", 1099);
item = _avail[i];
                _yuitest_coverline("build/event-base/event-base.js", 1100);
if (item && item.checkReady) {

                    // el = (item.compat) ? Y.DOM.byId(item.id) : Y.one(item.id);
                    _yuitest_coverline("build/event-base/event-base.js", 1103);
el = (item.compat) ? YDOM.byId(item.id) : Y.Selector.query(item.id, null, true);

                    _yuitest_coverline("build/event-base/event-base.js", 1105);
if (el) {
                        // The element is available, but not necessarily ready
                        // @todo should we test parentNode.nextSibling?
                        _yuitest_coverline("build/event-base/event-base.js", 1108);
if (_loadComplete || (el.get && el.get('nextSibling')) || el.nextSibling) {
                            _yuitest_coverline("build/event-base/event-base.js", 1109);
executeItem(el, item);
                            _yuitest_coverline("build/event-base/event-base.js", 1110);
_avail[i] = null;
                        }
                    } else {
                        _yuitest_coverline("build/event-base/event-base.js", 1113);
notAvail.push(item);
                    }
                }
            }

            _yuitest_coverline("build/event-base/event-base.js", 1118);
_retryCount = (notAvail.length === 0) ? 0 : _retryCount - 1;

            _yuitest_coverline("build/event-base/event-base.js", 1120);
if (tryAgain) {
                // we may need to strip the nulled out items here
                _yuitest_coverline("build/event-base/event-base.js", 1122);
Event.startInterval();
            } else {
                _yuitest_coverline("build/event-base/event-base.js", 1124);
clearInterval(Event._interval);
                _yuitest_coverline("build/event-base/event-base.js", 1125);
Event._interval = null;
            }

            _yuitest_coverline("build/event-base/event-base.js", 1128);
Event.locked = false;

            _yuitest_coverline("build/event-base/event-base.js", 1130);
return;

        },

        /**
         * Removes all listeners attached to the given element via addListener.
         * Optionally, the node's children can also be purged.
         * Optionally, you can specify a specific type of event to remove.
         * @method purgeElement
         * @param {HTMLElement} el the element to purge
         * @param {boolean} recurse recursively purge this element's children
         * as well.  Use with caution.
         * @param {string} type optional type of listener to purge. If
         * left out, all listeners will be removed
         * @static
         */
        purgeElement: function(el, recurse, type) {
            // var oEl = (Y.Lang.isString(el)) ? Y.one(el) : el,
            _yuitest_coverfunc("build/event-base/event-base.js", "purgeElement", 1146);
_yuitest_coverline("build/event-base/event-base.js", 1148);
var oEl = (Y.Lang.isString(el)) ?  Y.Selector.query(el, null, true) : el,
                lis = Event.getListeners(oEl, type), i, len, children, child;

            _yuitest_coverline("build/event-base/event-base.js", 1151);
if (recurse && oEl) {
                _yuitest_coverline("build/event-base/event-base.js", 1152);
lis = lis || [];
                _yuitest_coverline("build/event-base/event-base.js", 1153);
children = Y.Selector.query('*', oEl);
                _yuitest_coverline("build/event-base/event-base.js", 1154);
len = children.length;
                _yuitest_coverline("build/event-base/event-base.js", 1155);
for (i = 0; i < len; ++i) {
                    _yuitest_coverline("build/event-base/event-base.js", 1156);
child = Event.getListeners(children[i], type);
                    _yuitest_coverline("build/event-base/event-base.js", 1157);
if (child) {
                        _yuitest_coverline("build/event-base/event-base.js", 1158);
lis = lis.concat(child);
                    }
                }
            }

            _yuitest_coverline("build/event-base/event-base.js", 1163);
if (lis) {
                _yuitest_coverline("build/event-base/event-base.js", 1164);
for (i = 0, len = lis.length; i < len; ++i) {
                    _yuitest_coverline("build/event-base/event-base.js", 1165);
lis[i].detachAll();
                }
            }

        },

        /**
         * Removes all object references and the DOM proxy subscription for
         * a given event for a DOM node.
         *
         * @method _clean
         * @param wrapper {CustomEvent} Custom event proxy for the DOM
         *                  subscription
         * @private
         * @static
         * @since 3.4.0
         */
        _clean: function (wrapper) {
            _yuitest_coverfunc("build/event-base/event-base.js", "_clean", 1182);
_yuitest_coverline("build/event-base/event-base.js", 1183);
var key    = wrapper.key,
                domkey = wrapper.domkey;

            _yuitest_coverline("build/event-base/event-base.js", 1186);
remove(wrapper.el, wrapper.type, wrapper.fn, wrapper.capture);
            _yuitest_coverline("build/event-base/event-base.js", 1187);
delete _wrappers[key];
            _yuitest_coverline("build/event-base/event-base.js", 1188);
delete Y._yuievt.events[key];
            _yuitest_coverline("build/event-base/event-base.js", 1189);
if (_el_events[domkey]) {
                _yuitest_coverline("build/event-base/event-base.js", 1190);
delete _el_events[domkey][key];
                _yuitest_coverline("build/event-base/event-base.js", 1191);
if (!Y.Object.size(_el_events[domkey])) {
                    _yuitest_coverline("build/event-base/event-base.js", 1192);
delete _el_events[domkey];
                }
            }
        },

        /**
         * Returns all listeners attached to the given element via addListener.
         * Optionally, you can specify a specific type of event to return.
         * @method getListeners
         * @param el {HTMLElement|string} the element or element id to inspect
         * @param type {string} optional type of listener to return. If
         * left out, all listeners will be returned
         * @return {CustomEvent} the custom event wrapper for the DOM event(s)
         * @static
         */
        getListeners: function(el, type) {
            _yuitest_coverfunc("build/event-base/event-base.js", "getListeners", 1207);
_yuitest_coverline("build/event-base/event-base.js", 1208);
var ek = Y.stamp(el, true), evts = _el_events[ek],
                results=[] , key = (type) ? 'event:' + ek + type : null,
                adapters = _eventenv.plugins;

            _yuitest_coverline("build/event-base/event-base.js", 1212);
if (!evts) {
                _yuitest_coverline("build/event-base/event-base.js", 1213);
return null;
            }

            _yuitest_coverline("build/event-base/event-base.js", 1216);
if (key) {
                // look for synthetic events
                _yuitest_coverline("build/event-base/event-base.js", 1218);
if (adapters[type] && adapters[type].eventDef) {
                    _yuitest_coverline("build/event-base/event-base.js", 1219);
key += '_synth';
                }

                _yuitest_coverline("build/event-base/event-base.js", 1222);
if (evts[key]) {
                    _yuitest_coverline("build/event-base/event-base.js", 1223);
results.push(evts[key]);
                }

                // get native events as well
                _yuitest_coverline("build/event-base/event-base.js", 1227);
key += 'native';
                _yuitest_coverline("build/event-base/event-base.js", 1228);
if (evts[key]) {
                    _yuitest_coverline("build/event-base/event-base.js", 1229);
results.push(evts[key]);
                }

            } else {
                _yuitest_coverline("build/event-base/event-base.js", 1233);
Y.each(evts, function(v, k) {
                    _yuitest_coverfunc("build/event-base/event-base.js", "(anonymous 7)", 1233);
_yuitest_coverline("build/event-base/event-base.js", 1234);
results.push(v);
                });
            }

            _yuitest_coverline("build/event-base/event-base.js", 1238);
return (results.length) ? results : null;
        },

        /**
         * Removes all listeners registered by pe.event.  Called
         * automatically during the unload event.
         * @method _unload
         * @static
         * @private
         */
        _unload: function(e) {
            _yuitest_coverfunc("build/event-base/event-base.js", "_unload", 1248);
_yuitest_coverline("build/event-base/event-base.js", 1249);
Y.each(_wrappers, function(v, k) {
                _yuitest_coverfunc("build/event-base/event-base.js", "(anonymous 8)", 1249);
_yuitest_coverline("build/event-base/event-base.js", 1250);
if (v.type == 'unload') {
                    _yuitest_coverline("build/event-base/event-base.js", 1251);
v.fire(e);
                }
                _yuitest_coverline("build/event-base/event-base.js", 1253);
v.detachAll();
            });
            _yuitest_coverline("build/event-base/event-base.js", 1255);
remove(win, "unload", onUnload);
        },

        /**
         * Adds a DOM event directly without the caching, cleanup, context adj, etc
         *
         * @method nativeAdd
         * @param {HTMLElement} el      the element to bind the handler to
         * @param {string}      type   the type of event handler
         * @param {function}    fn      the callback to invoke
         * @param {boolen}      capture capture or bubble phase
         * @static
         * @private
         */
        nativeAdd: add,

        /**
         * Basic remove listener
         *
         * @method nativeRemove
         * @param {HTMLElement} el      the element to bind the handler to
         * @param {string}      type   the type of event handler
         * @param {function}    fn      the callback to invoke
         * @param {boolen}      capture capture or bubble phase
         * @static
         * @private
         */
        nativeRemove: remove
    };

}();

_yuitest_coverline("build/event-base/event-base.js", 1287);
Y.Event = Event;

_yuitest_coverline("build/event-base/event-base.js", 1289);
if (config.injected || YUI.Env.windowLoaded) {
    _yuitest_coverline("build/event-base/event-base.js", 1290);
onLoad();
} else {
    _yuitest_coverline("build/event-base/event-base.js", 1292);
add(win, "load", onLoad);
}

// Process onAvailable/onContentReady items when when the DOM is ready in IE
_yuitest_coverline("build/event-base/event-base.js", 1296);
if (Y.UA.ie) {
    _yuitest_coverline("build/event-base/event-base.js", 1297);
Y.on(EVENT_READY, Event._poll);
}

_yuitest_coverline("build/event-base/event-base.js", 1300);
try {
    _yuitest_coverline("build/event-base/event-base.js", 1301);
add(win, "unload", onUnload);
} catch(e) {
}

_yuitest_coverline("build/event-base/event-base.js", 1305);
Event.Custom = Y.CustomEvent;
_yuitest_coverline("build/event-base/event-base.js", 1306);
Event.Subscriber = Y.Subscriber;
_yuitest_coverline("build/event-base/event-base.js", 1307);
Event.Target = Y.EventTarget;
_yuitest_coverline("build/event-base/event-base.js", 1308);
Event.Handle = Y.EventHandle;
_yuitest_coverline("build/event-base/event-base.js", 1309);
Event.Facade = Y.EventFacade;

_yuitest_coverline("build/event-base/event-base.js", 1311);
Event._poll();

}());

/**
 * DOM event listener abstraction layer
 * @module event
 * @submodule event-base
 */

/**
 * Executes the callback as soon as the specified element
 * is detected in the DOM.  This function expects a selector
 * string for the element(s) to detect.  If you already have
 * an element reference, you don't need this event.
 * @event available
 * @param type {string} 'available'
 * @param fn {function} the callback function to execute.
 * @param el {string} an selector for the element(s) to attach
 * @param context optional argument that specifies what 'this' refers to.
 * @param args* 0..n additional arguments to pass on to the callback function.
 * These arguments will be added after the event object.
 * @return {EventHandle} the detach handle
 * @for YUI
 */
_yuitest_coverline("build/event-base/event-base.js", 1336);
Y.Env.evt.plugins.available = {
    on: function(type, fn, id, o) {
        _yuitest_coverfunc("build/event-base/event-base.js", "on", 1337);
_yuitest_coverline("build/event-base/event-base.js", 1338);
var a = arguments.length > 4 ?  Y.Array(arguments, 4, true) : null;
        _yuitest_coverline("build/event-base/event-base.js", 1339);
return Y.Event.onAvailable.call(Y.Event, id, fn, o, a);
    }
};

/**
 * Executes the callback as soon as the specified element
 * is detected in the DOM with a nextSibling property
 * (indicating that the element's children are available).
 * This function expects a selector
 * string for the element(s) to detect.  If you already have
 * an element reference, you don't need this event.
 * @event contentready
 * @param type {string} 'contentready'
 * @param fn {function} the callback function to execute.
 * @param el {string} an selector for the element(s) to attach.
 * @param context optional argument that specifies what 'this' refers to.
 * @param args* 0..n additional arguments to pass on to the callback function.
 * These arguments will be added after the event object.
 * @return {EventHandle} the detach handle
 * @for YUI
 */
_yuitest_coverline("build/event-base/event-base.js", 1360);
Y.Env.evt.plugins.contentready = {
    on: function(type, fn, id, o) {
        _yuitest_coverfunc("build/event-base/event-base.js", "on", 1361);
_yuitest_coverline("build/event-base/event-base.js", 1362);
var a = arguments.length > 4 ? Y.Array(arguments, 4, true) : null;
        _yuitest_coverline("build/event-base/event-base.js", 1363);
return Y.Event.onContentReady.call(Y.Event, id, fn, o, a);
    }
};


}, '3.7.3', {"requires": ["event-custom-base"]});
