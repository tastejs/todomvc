/*
YUI 3.7.3 (build 5687)
Copyright 2012 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/
(function () {
var GLOBAL_ENV = YUI.Env;

if (!GLOBAL_ENV._ready) {
    GLOBAL_ENV._ready = function() {
        GLOBAL_ENV.DOMReady = true;
        GLOBAL_ENV.remove(YUI.config.doc, 'DOMContentLoaded', GLOBAL_ENV._ready);
    };

    GLOBAL_ENV.add(YUI.config.doc, 'DOMContentLoaded', GLOBAL_ENV._ready);
}
})();
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
Y.publish('domready', {
    fireOnce: true,
    async: true
});

if (YUI.Env.DOMReady) {
    Y.fire('domready');
} else {
    Y.Do.before(function() { Y.fire('domready'); }, YUI.Env, '_ready');
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
        if (!n) {
            return n;
        }
        try {
            if (n && 3 == n.nodeType) {
                n = n.parentNode;
            }
        } catch(e) {
            return null;
        }

        return Y.one(n);
    },

    DOMEventFacade = function(ev, currentTarget, wrapper) {
        this._event = ev;
        this._currentTarget = currentTarget;
        this._wrapper = wrapper || EMPTY;

        // if not lazy init
        this.init();
    };

Y.extend(DOMEventFacade, Object, {

    init: function() {

        var e = this._event,
            overrides = this._wrapper.overrides,
            x = e.pageX,
            y = e.pageY,
            c,
            currentTarget = this._currentTarget;

        this.altKey   = e.altKey;
        this.ctrlKey  = e.ctrlKey;
        this.metaKey  = e.metaKey;
        this.shiftKey = e.shiftKey;
        this.type     = (overrides && overrides.type) || e.type;
        this.clientX  = e.clientX;
        this.clientY  = e.clientY;

        this.pageX = x;
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
        c = e.keyCode || e.charCode;

        if (ua.webkit && (c in webkitKeymap)) {
            c = webkitKeymap[c];
        }

        this.keyCode = c;
        this.charCode = c;
        // Fill in e.which for IE - implementers should always use this over
        // e.keyCode or e.charCode.
        this.which = e.which || e.charCode || c;
        // this.button = e.button;
        this.button = this.which;

        this.target = resolve(e.target);
        this.currentTarget = resolve(currentTarget);
        this.relatedTarget = resolve(e.relatedTarget);

        if (e.type == "mousewheel" || e.type == "DOMMouseScroll") {
            this.wheelDelta = (e.detail) ? (e.detail * -1) : Math.round(e.wheelDelta / 80) || ((e.wheelDelta < 0) ? -1 : 1);
        }

        if (this._touch) {
            this._touch(e, currentTarget, this._wrapper);
        }
    },

    stopPropagation: function() {
        this._event.stopPropagation();
        this._wrapper.stopped = 1;
        this.stopped = 1;
    },

    stopImmediatePropagation: function() {
        var e = this._event;
        if (e.stopImmediatePropagation) {
            e.stopImmediatePropagation();
        } else {
            this.stopPropagation();
        }
        this._wrapper.stopped = 2;
        this.stopped = 2;
    },

    preventDefault: function(returnValue) {
        var e = this._event;
        e.preventDefault();
        e.returnValue = returnValue || false;
        this._wrapper.prevented = 1;
        this.prevented = 1;
    },

    halt: function(immediate) {
        if (immediate) {
            this.stopImmediatePropagation();
        } else {
            this.stopPropagation();
        }

        this.preventDefault();
    }

});

DOMEventFacade.resolve = resolve;
Y.DOM2EventFacade = DOMEventFacade;
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

Y.Env.evt.dom_wrappers = {};
Y.Env.evt.dom_map = {};

var YDOM = Y.DOM,
    _eventenv = Y.Env.evt,
    config = Y.config,
    win = config.win,
    add = YUI.Env.add,
    remove = YUI.Env.remove,

    onLoad = function() {
        YUI.Env.windowLoaded = true;
        Y.Event._load();
        remove(win, "load", onLoad);
    },

    onUnload = function() {
        Y.Event._unload();
    },

    EVENT_READY = 'domready',

    COMPAT_ARG = '~yui|2|compat~',

    shouldIterate = function(o) {
        try {
            // TODO: See if there's a more performant way to return true early on this, for the common case
            return (o && typeof o !== "string" && Y.Lang.isNumber(o.length) && !o.tagName && !YDOM.isWindow(o));
        } catch(ex) {
            Y.log("collection check failure", "warn", "event");
            return false;
        }
    },

    // aliases to support DOM event subscription clean up when the last
    // subscriber is detached. deleteAndClean overrides the DOM event's wrapper
    // CustomEvent _delete method.
    _ceProtoDelete = Y.CustomEvent.prototype._delete,
    _deleteAndClean = function(s) {
        var ret = _ceProtoDelete.apply(this, arguments);

        if (!this.hasSubs()) {
            Y.Event._clean(this);
        }

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
            if (!Event._interval) {
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

            var a = Y.Array(id), i, availHandle;

            // Y.log('onAvailable registered for: ' + id);

            for (i=0; i<a.length; i=i+1) {
                _avail.push({
                    id:         a[i],
                    fn:         fn,
                    obj:        p_obj,
                    override:   p_override,
                    checkReady: checkContent,
                    compat:     compat
                });
            }
            _retryCount = this.POLL_RETRYS;

            // We want the first test to be immediate, but async
            setTimeout(Event._poll, 0);

            availHandle = new Y.EventHandle({

                _delete: function() {
                    // set by the event system for lazy DOM listeners
                    if (availHandle.handle) {
                        availHandle.handle.detach();
                        return;
                    }

                    var i, j;

                    // otherwise try to remove the onAvailable listener(s)
                    for (i = 0; i < a.length; i++) {
                        for (j = 0; j < _avail.length; j++) {
                            if (a[i] === _avail[j].id) {
                                _avail.splice(j, 1);
                            }
                        }
                    }
                }

            });

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
            return Event._attach(Y.Array(arguments, 0, true));
        },

        _createWrapper: function (el, type, capture, compat, facade) {

            var cewrapper,
                ek  = Y.stamp(el),
                key = 'event:' + ek + type;

            if (false === facade) {
                key += 'native';
            }
            if (capture) {
                key += 'capture';
            }


            cewrapper = _wrappers[key];


            if (!cewrapper) {
                // create CE wrapper
                cewrapper = Y.publish(key, {
                    silent: true,
                    bubbles: false,
                    contextFn: function() {
                        if (compat) {
                            return cewrapper.el;
                        } else {
                            cewrapper.nodeRef = cewrapper.nodeRef || Y.one(cewrapper.el);
                            return cewrapper.nodeRef;
                        }
                    }
                });

                cewrapper.overrides = {};

                // for later removeListener calls
                cewrapper.el = el;
                cewrapper.key = key;
                cewrapper.domkey = ek;
                cewrapper.type = type;
                cewrapper.fn = function(e) {
                    cewrapper.fire(Event.getEvent(e, el, (compat || (false === facade))));
                };
                cewrapper.capture = capture;

                if (el == win && type == "load") {
                    // window load happens once
                    cewrapper.fireOnce = true;
                    _windowLoadKey = key;
                }
                cewrapper._delete = _deleteAndClean;

                _wrappers[key] = cewrapper;
                _el_events[ek] = _el_events[ek] || {};
                _el_events[ek][key] = cewrapper;

                add(el, type, cewrapper.fn, capture);
            }

            return cewrapper;

        },

        _attach: function(args, conf) {

            var compat,
                handles, oEl, cewrapper, context,
                fireNow = false, ret,
                type = args[0],
                fn = args[1],
                el = args[2] || win,
                facade = conf && conf.facade,
                capture = conf && conf.capture,
                overrides = conf && conf.overrides;

            if (args[args.length-1] === COMPAT_ARG) {
                compat = true;
            }

            if (!fn || !fn.call) {
// throw new TypeError(type + " attach call failed, callback undefined");
Y.log(type + " attach call failed, invalid callback", "error", "event");
                return false;
            }

            // The el argument can be an array of elements or element ids.
            if (shouldIterate(el)) {

                handles=[];

                Y.each(el, function(v, k) {
                    args[2] = v;
                    handles.push(Event._attach(args.slice(), conf));
                });

                // return (handles.length === 1) ? handles[0] : handles;
                return new Y.EventHandle(handles);

            // If the el argument is a string, we assume it is
            // actually the id of the element.  If the page is loaded
            // we convert el to the actual element, otherwise we
            // defer attaching the event until the element is
            // ready
            } else if (Y.Lang.isString(el)) {

                // oEl = (compat) ? Y.DOM.byId(el) : Y.Selector.query(el);

                if (compat) {
                    oEl = YDOM.byId(el);
                } else {

                    oEl = Y.Selector.query(el);

                    switch (oEl.length) {
                        case 0:
                            oEl = null;
                            break;
                        case 1:
                            oEl = oEl[0];
                            break;
                        default:
                            args[2] = oEl;
                            return Event._attach(args, conf);
                    }
                }

                if (oEl) {

                    el = oEl;

                // Not found = defer adding the event until the element is available
                } else {

                    // Y.log(el + ' not found');
                    ret = Event.onAvailable(el, function() {
                        // Y.log('lazy attach: ' + args);

                        ret.handle = Event._attach(args, conf);

                    }, Event, true, false, compat);

                    return ret;

                }
            }

            // Element should be an html element or node
            if (!el) {
                Y.log("unable to attach event " + type, "warn", "event");
                return false;
            }

            if (Y.Node && Y.instanceOf(el, Y.Node)) {
                el = Y.Node.getDOMNode(el);
            }

            cewrapper = Event._createWrapper(el, type, capture, compat, facade);
            if (overrides) {
                Y.mix(cewrapper.overrides, overrides);
            }

            if (el == win && type == "load") {

                // if the load is complete, fire immediately.
                // all subscribers, including the current one
                // will be notified.
                if (YUI.Env.windowLoaded) {
                    fireNow = true;
                }
            }

            if (compat) {
                args.pop();
            }

            context = args[3];

            // set context to the Node if not specified
            // ret = cewrapper.on.apply(cewrapper, trimmedArgs);
            ret = cewrapper._on(fn, context, (args.length > 4) ? args.slice(4) : null);

            if (fireNow) {
                cewrapper.fire();
            }

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

            var args=Y.Array(arguments, 0, true), compat, l, ok, i,
                id, ce;

            if (args[args.length-1] === COMPAT_ARG) {
                compat = true;
                // args.pop();
            }

            if (type && type.detach) {
                return type.detach();
            }

            // The el argument can be a string
            if (typeof el == "string") {

                // el = (compat) ? Y.DOM.byId(el) : Y.all(el);
                if (compat) {
                    el = YDOM.byId(el);
                } else {
                    el = Y.Selector.query(el);
                    l = el.length;
                    if (l < 1) {
                        el = null;
                    } else if (l == 1) {
                        el = el[0];
                    }
                }
                // return Event.detach.apply(Event, args);
            }

            if (!el) {
                return false;
            }

            if (el.detach) {
                args.splice(2, 1);
                return el.detach.apply(el, args);
            // The el argument can be an array of elements or element ids.
            } else if (shouldIterate(el)) {
                ok = true;
                for (i=0, l=el.length; i<l; ++i) {
                    args[2] = el[i];
                    ok = ( Y.Event.detach.apply(Y.Event, args) && ok );
                }

                return ok;
            }

            if (!type || !fn || !fn.call) {
                return Event.purgeElement(el, false, type);
            }

            id = 'event:' + Y.stamp(el) + type;
            ce = _wrappers[id];

            if (ce) {
                return ce.detach(fn);
            } else {
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
            var ev = e || win.event;

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
            if (!_loadComplete) {
                // Y.log('Load Complete', 'info', 'event');
                _loadComplete = true;

                // Just in case DOMReady did not go off for some reason
                // E._ready();
                if (Y.fire) {
                    Y.fire(EVENT_READY);
                }

                // Available elements may not have been detected before the
                // window load event fires. Try to find them now so that the
                // the user is more likely to get the onAvailable notifications
                // before the window load notification
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
            if (Event.locked) {
                return;
            }

            if (Y.UA.ie && !YUI.Env.DOMReady) {
                // Hold off if DOMReady has not fired and check current
                // readyState to protect against the IE operation aborted
                // issue.
                Event.startInterval();
                return;
            }

            Event.locked = true;

            // Y.log.debug("poll");
            // keep trying until after the page is loaded.  We need to
            // check the page load state prior to trying to bind the
            // elements so that we can be certain all elements have been
            // tested appropriately
            var i, len, item, el, notAvail, executeItem,
                tryAgain = !_loadComplete;

            if (!tryAgain) {
                tryAgain = (_retryCount > 0);
            }

            // onAvailable
            notAvail = [];

            executeItem = function (el, item) {
                var context, ov = item.override;
                try {
                    if (item.compat) {
                        if (item.override) {
                            if (ov === true) {
                                context = item.obj;
                            } else {
                                context = ov;
                            }
                        } else {
                            context = el;
                        }
                        item.fn.call(context, item.obj);
                    } else {
                        context = item.obj || Y.one(el);
                        item.fn.apply(context, (Y.Lang.isArray(ov)) ? ov : []);
                    }
                } catch (e) {
                    Y.log("Error in available or contentReady callback", 'error', 'event');
                }
            };

            // onAvailable
            for (i=0,len=_avail.length; i<len; ++i) {
                item = _avail[i];
                if (item && !item.checkReady) {

                    // el = (item.compat) ? Y.DOM.byId(item.id) : Y.one(item.id);
                    el = (item.compat) ? YDOM.byId(item.id) : Y.Selector.query(item.id, null, true);

                    if (el) {
                        // Y.log('avail: ' + el);
                        executeItem(el, item);
                        _avail[i] = null;
                    } else {
                        // Y.log('NOT avail: ' + el);
                        notAvail.push(item);
                    }
                }
            }

            // onContentReady
            for (i=0,len=_avail.length; i<len; ++i) {
                item = _avail[i];
                if (item && item.checkReady) {

                    // el = (item.compat) ? Y.DOM.byId(item.id) : Y.one(item.id);
                    el = (item.compat) ? YDOM.byId(item.id) : Y.Selector.query(item.id, null, true);

                    if (el) {
                        // The element is available, but not necessarily ready
                        // @todo should we test parentNode.nextSibling?
                        if (_loadComplete || (el.get && el.get('nextSibling')) || el.nextSibling) {
                            executeItem(el, item);
                            _avail[i] = null;
                        }
                    } else {
                        notAvail.push(item);
                    }
                }
            }

            _retryCount = (notAvail.length === 0) ? 0 : _retryCount - 1;

            if (tryAgain) {
                // we may need to strip the nulled out items here
                Event.startInterval();
            } else {
                clearInterval(Event._interval);
                Event._interval = null;
            }

            Event.locked = false;

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
            var oEl = (Y.Lang.isString(el)) ?  Y.Selector.query(el, null, true) : el,
                lis = Event.getListeners(oEl, type), i, len, children, child;

            if (recurse && oEl) {
                lis = lis || [];
                children = Y.Selector.query('*', oEl);
                len = children.length;
                for (i = 0; i < len; ++i) {
                    child = Event.getListeners(children[i], type);
                    if (child) {
                        lis = lis.concat(child);
                    }
                }
            }

            if (lis) {
                for (i = 0, len = lis.length; i < len; ++i) {
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
            var key    = wrapper.key,
                domkey = wrapper.domkey;

            remove(wrapper.el, wrapper.type, wrapper.fn, wrapper.capture);
            delete _wrappers[key];
            delete Y._yuievt.events[key];
            if (_el_events[domkey]) {
                delete _el_events[domkey][key];
                if (!Y.Object.size(_el_events[domkey])) {
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
            var ek = Y.stamp(el, true), evts = _el_events[ek],
                results=[] , key = (type) ? 'event:' + ek + type : null,
                adapters = _eventenv.plugins;

            if (!evts) {
                return null;
            }

            if (key) {
                // look for synthetic events
                if (adapters[type] && adapters[type].eventDef) {
                    key += '_synth';
                }

                if (evts[key]) {
                    results.push(evts[key]);
                }

                // get native events as well
                key += 'native';
                if (evts[key]) {
                    results.push(evts[key]);
                }

            } else {
                Y.each(evts, function(v, k) {
                    results.push(v);
                });
            }

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
            Y.each(_wrappers, function(v, k) {
                if (v.type == 'unload') {
                    v.fire(e);
                }
                v.detachAll();
            });
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

Y.Event = Event;

if (config.injected || YUI.Env.windowLoaded) {
    onLoad();
} else {
    add(win, "load", onLoad);
}

// Process onAvailable/onContentReady items when when the DOM is ready in IE
if (Y.UA.ie) {
    Y.on(EVENT_READY, Event._poll);
}

try {
    add(win, "unload", onUnload);
} catch(e) {
    Y.log("Registering unload listener failed. This is known to happen in Chrome Packaged Apps and Extensions, which don't support unload, and don't provide a way to test for support", "warn", "event-base");
}

Event.Custom = Y.CustomEvent;
Event.Subscriber = Y.Subscriber;
Event.Target = Y.EventTarget;
Event.Handle = Y.EventHandle;
Event.Facade = Y.EventFacade;

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
Y.Env.evt.plugins.available = {
    on: function(type, fn, id, o) {
        var a = arguments.length > 4 ?  Y.Array(arguments, 4, true) : null;
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
Y.Env.evt.plugins.contentready = {
    on: function(type, fn, id, o) {
        var a = arguments.length > 4 ? Y.Array(arguments, 4, true) : null;
        return Y.Event.onContentReady.call(Y.Event, id, fn, o, a);
    }
};


}, '3.7.3', {"requires": ["event-custom-base"]});
