/*
YUI 3.7.3 (build 5687)
Copyright 2012 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/
YUI.add('event-custom-base', function (Y, NAME) {

/**
 * Custom event engine, DOM event listener abstraction layer, synthetic DOM
 * events.
 * @module event-custom
 */

Y.Env.evt = {
    handles: {},
    plugins: {}
};


/**
 * Custom event engine, DOM event listener abstraction layer, synthetic DOM
 * events.
 * @module event-custom
 * @submodule event-custom-base
 */

/**
 * Allows for the insertion of methods that are executed before or after
 * a specified method
 * @class Do
 * @static
 */

var DO_BEFORE = 0,
    DO_AFTER = 1,

DO = {

    /**
     * Cache of objects touched by the utility
     * @property objs
     * @static
     * @deprecated Since 3.6.0. The `_yuiaop` property on the AOP'd object 
     * replaces the role of this property, but is considered to be private, and 
     * is only mentioned to provide a migration path.
     * 
     * If you have a use case which warrants migration to the _yuiaop property, 
     * please file a ticket to let us know what it's used for and we can see if 
     * we need to expose hooks for that functionality more formally.
     */
    objs: null,

    /**
     * <p>Execute the supplied method before the specified function.  Wrapping
     * function may optionally return an instance of the following classes to
     * further alter runtime behavior:</p>
     * <dl>
     *     <dt></code>Y.Do.Halt(message, returnValue)</code></dt>
     *         <dd>Immediatly stop execution and return
     *         <code>returnValue</code>.  No other wrapping functions will be
     *         executed.</dd>
     *     <dt></code>Y.Do.AlterArgs(message, newArgArray)</code></dt>
     *         <dd>Replace the arguments that the original function will be
     *         called with.</dd>
     *     <dt></code>Y.Do.Prevent(message)</code></dt>
     *         <dd>Don't execute the wrapped function.  Other before phase
     *         wrappers will be executed.</dd>
     * </dl>
     *
     * @method before
     * @param fn {Function} the function to execute
     * @param obj the object hosting the method to displace
     * @param sFn {string} the name of the method to displace
     * @param c The execution context for fn
     * @param arg* {mixed} 0..n additional arguments to supply to the subscriber
     * when the event fires.
     * @return {string} handle for the subscription
     * @static
     */
    before: function(fn, obj, sFn, c) {
        var f = fn, a;
        if (c) {
            a = [fn, c].concat(Y.Array(arguments, 4, true));
            f = Y.rbind.apply(Y, a);
        }

        return this._inject(DO_BEFORE, f, obj, sFn);
    },

    /**
     * <p>Execute the supplied method after the specified function.  Wrapping
     * function may optionally return an instance of the following classes to
     * further alter runtime behavior:</p>
     * <dl>
     *     <dt></code>Y.Do.Halt(message, returnValue)</code></dt>
     *         <dd>Immediatly stop execution and return
     *         <code>returnValue</code>.  No other wrapping functions will be
     *         executed.</dd>
     *     <dt></code>Y.Do.AlterReturn(message, returnValue)</code></dt>
     *         <dd>Return <code>returnValue</code> instead of the wrapped
     *         method's original return value.  This can be further altered by
     *         other after phase wrappers.</dd>
     * </dl>
     *
     * <p>The static properties <code>Y.Do.originalRetVal</code> and
     * <code>Y.Do.currentRetVal</code> will be populated for reference.</p>
     *
     * @method after
     * @param fn {Function} the function to execute
     * @param obj the object hosting the method to displace
     * @param sFn {string} the name of the method to displace
     * @param c The execution context for fn
     * @param arg* {mixed} 0..n additional arguments to supply to the subscriber
     * @return {string} handle for the subscription
     * @static
     */
    after: function(fn, obj, sFn, c) {
        var f = fn, a;
        if (c) {
            a = [fn, c].concat(Y.Array(arguments, 4, true));
            f = Y.rbind.apply(Y, a);
        }

        return this._inject(DO_AFTER, f, obj, sFn);
    },

    /**
     * Execute the supplied method before or after the specified function.
     * Used by <code>before</code> and <code>after</code>.
     *
     * @method _inject
     * @param when {string} before or after
     * @param fn {Function} the function to execute
     * @param obj the object hosting the method to displace
     * @param sFn {string} the name of the method to displace
     * @param c The execution context for fn
     * @return {string} handle for the subscription
     * @private
     * @static
     */
    _inject: function(when, fn, obj, sFn) {
        // object id
        var id = Y.stamp(obj), o, sid;

        if (!obj._yuiaop) {
            // create a map entry for the obj if it doesn't exist, to hold overridden methods
            obj._yuiaop = {};
        }

        o = obj._yuiaop;

        if (!o[sFn]) {
            // create a map entry for the method if it doesn't exist
            o[sFn] = new Y.Do.Method(obj, sFn);

            // re-route the method to our wrapper
            obj[sFn] = function() {
                return o[sFn].exec.apply(o[sFn], arguments);
            };
        }

        // subscriber id
        sid = id + Y.stamp(fn) + sFn;

        // register the callback
        o[sFn].register(sid, fn, when);

        return new Y.EventHandle(o[sFn], sid);
    },

    /**
     * Detach a before or after subscription.
     *
     * @method detach
     * @param handle {string} the subscription handle
     * @static
     */
    detach: function(handle) {
        if (handle.detach) {
            handle.detach();
        }
    },

    _unload: function(e, me) {
    }
};

Y.Do = DO;

//////////////////////////////////////////////////////////////////////////

/**
 * Contains the return value from the wrapped method, accessible
 * by 'after' event listeners.
 *
 * @property originalRetVal
 * @static
 * @since 3.2.0
 */

/**
 * Contains the current state of the return value, consumable by
 * 'after' event listeners, and updated if an after subscriber
 * changes the return value generated by the wrapped function.
 *
 * @property currentRetVal
 * @static
 * @since 3.2.0
 */

//////////////////////////////////////////////////////////////////////////

/**
 * Wrapper for a displaced method with aop enabled
 * @class Do.Method
 * @constructor
 * @param obj The object to operate on
 * @param sFn The name of the method to displace
 */
DO.Method = function(obj, sFn) {
    this.obj = obj;
    this.methodName = sFn;
    this.method = obj[sFn];
    this.before = {};
    this.after = {};
};

/**
 * Register a aop subscriber
 * @method register
 * @param sid {string} the subscriber id
 * @param fn {Function} the function to execute
 * @param when {string} when to execute the function
 */
DO.Method.prototype.register = function (sid, fn, when) {
    if (when) {
        this.after[sid] = fn;
    } else {
        this.before[sid] = fn;
    }
};

/**
 * Unregister a aop subscriber
 * @method delete
 * @param sid {string} the subscriber id
 * @param fn {Function} the function to execute
 * @param when {string} when to execute the function
 */
DO.Method.prototype._delete = function (sid) {
    delete this.before[sid];
    delete this.after[sid];
};

/**
 * <p>Execute the wrapped method.  All arguments are passed into the wrapping
 * functions.  If any of the before wrappers return an instance of
 * <code>Y.Do.Halt</code> or <code>Y.Do.Prevent</code>, neither the wrapped
 * function nor any after phase subscribers will be executed.</p>
 *
 * <p>The return value will be the return value of the wrapped function or one
 * provided by a wrapper function via an instance of <code>Y.Do.Halt</code> or
 * <code>Y.Do.AlterReturn</code>.
 *
 * @method exec
 * @param arg* {any} Arguments are passed to the wrapping and wrapped functions
 * @return {any} Return value of wrapped function unless overwritten (see above)
 */
DO.Method.prototype.exec = function () {

    var args = Y.Array(arguments, 0, true),
        i, ret, newRet,
        bf = this.before,
        af = this.after,
        prevented = false;

    // execute before
    for (i in bf) {
        if (bf.hasOwnProperty(i)) {
            ret = bf[i].apply(this.obj, args);
            if (ret) {
                switch (ret.constructor) {
                    case DO.Halt:
                        return ret.retVal;
                    case DO.AlterArgs:
                        args = ret.newArgs;
                        break;
                    case DO.Prevent:
                        prevented = true;
                        break;
                    default:
                }
            }
        }
    }

    // execute method
    if (!prevented) {
        ret = this.method.apply(this.obj, args);
    }

    DO.originalRetVal = ret;
    DO.currentRetVal = ret;

    // execute after methods.
    for (i in af) {
        if (af.hasOwnProperty(i)) {
            newRet = af[i].apply(this.obj, args);
            // Stop processing if a Halt object is returned
            if (newRet && newRet.constructor == DO.Halt) {
                return newRet.retVal;
            // Check for a new return value
            } else if (newRet && newRet.constructor == DO.AlterReturn) {
                ret = newRet.newRetVal;
                // Update the static retval state
                DO.currentRetVal = ret;
            }
        }
    }

    return ret;
};

//////////////////////////////////////////////////////////////////////////

/**
 * Return an AlterArgs object when you want to change the arguments that
 * were passed into the function.  Useful for Do.before subscribers.  An
 * example would be a service that scrubs out illegal characters prior to
 * executing the core business logic.
 * @class Do.AlterArgs
 * @constructor
 * @param msg {String} (optional) Explanation of the altered return value
 * @param newArgs {Array} Call parameters to be used for the original method
 *                        instead of the arguments originally passed in.
 */
DO.AlterArgs = function(msg, newArgs) {
    this.msg = msg;
    this.newArgs = newArgs;
};

/**
 * Return an AlterReturn object when you want to change the result returned
 * from the core method to the caller.  Useful for Do.after subscribers.
 * @class Do.AlterReturn
 * @constructor
 * @param msg {String} (optional) Explanation of the altered return value
 * @param newRetVal {any} Return value passed to code that invoked the wrapped
 *                      function.
 */
DO.AlterReturn = function(msg, newRetVal) {
    this.msg = msg;
    this.newRetVal = newRetVal;
};

/**
 * Return a Halt object when you want to terminate the execution
 * of all subsequent subscribers as well as the wrapped method
 * if it has not exectued yet.  Useful for Do.before subscribers.
 * @class Do.Halt
 * @constructor
 * @param msg {String} (optional) Explanation of why the termination was done
 * @param retVal {any} Return value passed to code that invoked the wrapped
 *                      function.
 */
DO.Halt = function(msg, retVal) {
    this.msg = msg;
    this.retVal = retVal;
};

/**
 * Return a Prevent object when you want to prevent the wrapped function
 * from executing, but want the remaining listeners to execute.  Useful
 * for Do.before subscribers.
 * @class Do.Prevent
 * @constructor
 * @param msg {String} (optional) Explanation of why the termination was done
 */
DO.Prevent = function(msg) {
    this.msg = msg;
};

/**
 * Return an Error object when you want to terminate the execution
 * of all subsequent method calls.
 * @class Do.Error
 * @constructor
 * @param msg {String} (optional) Explanation of the altered return value
 * @param retVal {any} Return value passed to code that invoked the wrapped
 *                      function.
 * @deprecated use Y.Do.Halt or Y.Do.Prevent
 */
DO.Error = DO.Halt;


//////////////////////////////////////////////////////////////////////////

// Y["Event"] && Y.Event.addListener(window, "unload", Y.Do._unload, Y.Do);


/**
 * Custom event engine, DOM event listener abstraction layer, synthetic DOM
 * events.
 * @module event-custom
 * @submodule event-custom-base
 */


// var onsubscribeType = "_event:onsub",
var YArray = Y.Array,

    AFTER = 'after',
    CONFIGS = [
        'broadcast',
        'monitored',
        'bubbles',
        'context',
        'contextFn',
        'currentTarget',
        'defaultFn',
        'defaultTargetOnly',
        'details',
        'emitFacade',
        'fireOnce',
        'async',
        'host',
        'preventable',
        'preventedFn',
        'queuable',
        'silent',
        'stoppedFn',
        'target',
        'type'
    ],

    CONFIGS_HASH = YArray.hash(CONFIGS),

    nativeSlice = Array.prototype.slice, 

    YUI3_SIGNATURE = 9,
    YUI_LOG = 'yui:log',

    mixConfigs = function(r, s, ov) {
        var p;

        for (p in s) {
            if (CONFIGS_HASH[p] && (ov || !(p in r))) { 
                r[p] = s[p];
            }
        }

        return r;
    };

/**
 * The CustomEvent class lets you define events for your application
 * that can be subscribed to by one or more independent component.
 *
 * @param {String} type The type of event, which is passed to the callback
 * when the event fires.
 * @param {object} o configuration object.
 * @class CustomEvent
 * @constructor
 */
Y.CustomEvent = function(type, o) {

    this._kds = Y.CustomEvent.keepDeprecatedSubs;

    o = o || {};

    this.id = Y.stamp(this);

    /**
     * The type of event, returned to subscribers when the event fires
     * @property type
     * @type string
     */
    this.type = type;

    /**
     * The context the the event will fire from by default.  Defaults to the YUI
     * instance.
     * @property context
     * @type object
     */
    this.context = Y;

    /**
     * Monitor when an event is attached or detached.
     *
     * @property monitored
     * @type boolean
     */
    // this.monitored = false;

    this.logSystem = (type == YUI_LOG);

    /**
     * If 0, this event does not broadcast.  If 1, the YUI instance is notified
     * every time this event fires.  If 2, the YUI instance and the YUI global
     * (if event is enabled on the global) are notified every time this event
     * fires.
     * @property broadcast
     * @type int
     */
    // this.broadcast = 0;

    /**
     * By default all custom events are logged in the debug build, set silent
     * to true to disable debug outpu for this event.
     * @property silent
     * @type boolean
     */
    this.silent = this.logSystem;

    /**
     * Specifies whether this event should be queued when the host is actively
     * processing an event.  This will effect exectution order of the callbacks
     * for the various events.
     * @property queuable
     * @type boolean
     * @default false
     */
    // this.queuable = false;

    /**
     * The subscribers to this event
     * @property subscribers
     * @type Subscriber {}
     * @deprecated
     */
    if (this._kds) {
        this.subscribers = {};
    }

    /**
     * The subscribers to this event
     * @property _subscribers
     * @type Subscriber []
     * @private
     */
    this._subscribers = [];

    /**
     * 'After' subscribers
     * @property afters
     * @type Subscriber {}
     */
    if (this._kds) {
        this.afters = {};
    }

    /**
     * 'After' subscribers
     * @property _afters
     * @type Subscriber []
     * @private
     */
    this._afters = [];

    /**
     * This event has fired if true
     *
     * @property fired
     * @type boolean
     * @default false;
     */
    // this.fired = false;

    /**
     * An array containing the arguments the custom event
     * was last fired with.
     * @property firedWith
     * @type Array
     */
    // this.firedWith;

    /**
     * This event should only fire one time if true, and if
     * it has fired, any new subscribers should be notified
     * immediately.
     *
     * @property fireOnce
     * @type boolean
     * @default false;
     */
    // this.fireOnce = false;

    /**
     * fireOnce listeners will fire syncronously unless async
     * is set to true
     * @property async
     * @type boolean
     * @default false
     */
    //this.async = false;

    /**
     * Flag for stopPropagation that is modified during fire()
     * 1 means to stop propagation to bubble targets.  2 means
     * to also stop additional subscribers on this target.
     * @property stopped
     * @type int
     */
    // this.stopped = 0;

    /**
     * Flag for preventDefault that is modified during fire().
     * if it is not 0, the default behavior for this event
     * @property prevented
     * @type int
     */
    // this.prevented = 0;

    /**
     * Specifies the host for this custom event.  This is used
     * to enable event bubbling
     * @property host
     * @type EventTarget
     */
    // this.host = null;

    /**
     * The default function to execute after event listeners
     * have fire, but only if the default action was not
     * prevented.
     * @property defaultFn
     * @type Function
     */
    // this.defaultFn = null;

    /**
     * The function to execute if a subscriber calls
     * stopPropagation or stopImmediatePropagation
     * @property stoppedFn
     * @type Function
     */
    // this.stoppedFn = null;

    /**
     * The function to execute if a subscriber calls
     * preventDefault
     * @property preventedFn
     * @type Function
     */
    // this.preventedFn = null;

    /**
     * Specifies whether or not this event's default function
     * can be cancelled by a subscriber by executing preventDefault()
     * on the event facade
     * @property preventable
     * @type boolean
     * @default true
     */
    this.preventable = true;

    /**
     * Specifies whether or not a subscriber can stop the event propagation
     * via stopPropagation(), stopImmediatePropagation(), or halt()
     *
     * Events can only bubble if emitFacade is true.
     *
     * @property bubbles
     * @type boolean
     * @default true
     */
    this.bubbles = true;

    /**
     * Supports multiple options for listener signatures in order to
     * port YUI 2 apps.
     * @property signature
     * @type int
     * @default 9
     */
    this.signature = YUI3_SIGNATURE;

    // this.subCount = 0;
    // this.afterCount = 0;

    // this.hasSubscribers = false;
    // this.hasAfters = false;

    /**
     * If set to true, the custom event will deliver an EventFacade object
     * that is similar to a DOM event object.
     * @property emitFacade
     * @type boolean
     * @default false
     */
    // this.emitFacade = false;

    this.applyConfig(o, true);


};

/**
 * Static flag to enable population of the <a href="#property_subscribers">`subscribers`</a>
 * and  <a href="#property_subscribers">`afters`</a> properties held on a `CustomEvent` instance.
 * 
 * These properties were changed to private properties (`_subscribers` and `_afters`), and 
 * converted from objects to arrays for performance reasons. 
 *
 * Setting this property to true will populate the deprecated `subscribers` and `afters` 
 * properties for people who may be using them (which is expected to be rare). There will
 * be a performance hit, compared to the new array based implementation.
 *
 * If you are using these deprecated properties for a use case which the public API
 * does not support, please file an enhancement request, and we can provide an alternate 
 * public implementation which doesn't have the performance cost required to maintiain the
 * properties as objects.
 *
 * @property keepDeprecatedSubs
 * @static
 * @for CustomEvent
 * @type boolean
 * @default false
 * @deprecated
 */
Y.CustomEvent.keepDeprecatedSubs = false;

Y.CustomEvent.mixConfigs = mixConfigs;

Y.CustomEvent.prototype = {

    constructor: Y.CustomEvent,

    /**
     * Returns the number of subscribers for this event as the sum of the on()
     * subscribers and after() subscribers.
     *
     * @method hasSubs
     * @return Number
     */
    hasSubs: function(when) {
        var s = this._subscribers.length, a = this._afters.length, sib = this.sibling;

        if (sib) {
            s += sib._subscribers.length;
            a += sib._afters.length;
        }

        if (when) {
            return (when == 'after') ? a : s;
        }

        return (s + a);
    },

    /**
     * Monitor the event state for the subscribed event.  The first parameter
     * is what should be monitored, the rest are the normal parameters when
     * subscribing to an event.
     * @method monitor
     * @param what {string} what to monitor ('detach', 'attach', 'publish').
     * @return {EventHandle} return value from the monitor event subscription.
     */
    monitor: function(what) {
        this.monitored = true;
        var type = this.id + '|' + this.type + '_' + what,
            args = nativeSlice.call(arguments, 0);
        args[0] = type;
        return this.host.on.apply(this.host, args);
    },

    /**
     * Get all of the subscribers to this event and any sibling event
     * @method getSubs
     * @return {Array} first item is the on subscribers, second the after.
     */
    getSubs: function() {
        var s = this._subscribers, a = this._afters, sib = this.sibling;

        s = (sib) ? s.concat(sib._subscribers) : s.concat();
        a = (sib) ? a.concat(sib._afters) : a.concat();

        return [s, a];
    },

    /**
     * Apply configuration properties.  Only applies the CONFIG whitelist
     * @method applyConfig
     * @param o hash of properties to apply.
     * @param force {boolean} if true, properties that exist on the event
     * will be overwritten.
     */
    applyConfig: function(o, force) {
        mixConfigs(this, o, force);
    },

    /**
     * Create the Subscription for subscribing function, context, and bound
     * arguments.  If this is a fireOnce event, the subscriber is immediately 
     * notified.
     *
     * @method _on
     * @param fn {Function} Subscription callback
     * @param [context] {Object} Override `this` in the callback
     * @param [args] {Array} bound arguments that will be passed to the callback after the arguments generated by fire()
     * @param [when] {String} "after" to slot into after subscribers
     * @return {EventHandle}
     * @protected
     */
    _on: function(fn, context, args, when) {


        var s = new Y.Subscriber(fn, context, args, when);

        if (this.fireOnce && this.fired) {
            if (this.async) {
                setTimeout(Y.bind(this._notify, this, s, this.firedWith), 0);
            } else {
                this._notify(s, this.firedWith);
            }
        }

        if (when == AFTER) {
            this._afters.push(s);
        } else {
            this._subscribers.push(s);
        }

        if (this._kds) {
            if (when == AFTER) {
                this.afters[s.id] = s;
            } else {
                this.subscribers[s.id] = s;
            }
        }

        return new Y.EventHandle(this, s);
    },

    /**
     * Listen for this event
     * @method subscribe
     * @param {Function} fn The function to execute.
     * @return {EventHandle} Unsubscribe handle.
     * @deprecated use on.
     */
    subscribe: function(fn, context) {
        var a = (arguments.length > 2) ? nativeSlice.call(arguments, 2) : null;
        return this._on(fn, context, a, true);
    },
 
    /**
     * Listen for this event
     * @method on
     * @param {Function} fn The function to execute.
     * @param {object} context optional execution context.
     * @param {mixed} arg* 0..n additional arguments to supply to the subscriber
     * when the event fires.
     * @return {EventHandle} An object with a detach method to detch the handler(s).
     */
    on: function(fn, context) {
        var a = (arguments.length > 2) ? nativeSlice.call(arguments, 2) : null;

        if (this.monitored && this.host) {
            this.host._monitor('attach', this, {
                args: arguments
            });
        }
        return this._on(fn, context, a, true);
    },

    /**
     * Listen for this event after the normal subscribers have been notified and
     * the default behavior has been applied.  If a normal subscriber prevents the
     * default behavior, it also prevents after listeners from firing.
     * @method after
     * @param {Function} fn The function to execute.
     * @param {object} context optional execution context.
     * @param {mixed} arg* 0..n additional arguments to supply to the subscriber
     * when the event fires.
     * @return {EventHandle} handle Unsubscribe handle.
     */
    after: function(fn, context) {
        var a = (arguments.length > 2) ? nativeSlice.call(arguments, 2) : null;
        return this._on(fn, context, a, AFTER);
    },

    /**
     * Detach listeners.
     * @method detach
     * @param {Function} fn  The subscribed function to remove, if not supplied
     *                       all will be removed.
     * @param {Object}   context The context object passed to subscribe.
     * @return {int} returns the number of subscribers unsubscribed.
     */
    detach: function(fn, context) {
        // unsubscribe handle
        if (fn && fn.detach) {
            return fn.detach();
        }
        
        var i, s,
            found = 0,
            subs = this._subscribers,
            afters = this._afters;

        for (i = subs.length; i >= 0; i--) {
            s = subs[i];
            if (s && (!fn || fn === s.fn)) {
                this._delete(s, subs, i);
                found++;
            }
        }

        for (i = afters.length; i >= 0; i--) {
            s = afters[i];
            if (s && (!fn || fn === s.fn)) {
                this._delete(s, afters, i);
                found++;
            }
        }

        return found;
    },

    /**
     * Detach listeners.
     * @method unsubscribe
     * @param {Function} fn  The subscribed function to remove, if not supplied
     *                       all will be removed.
     * @param {Object}   context The context object passed to subscribe.
     * @return {int|undefined} returns the number of subscribers unsubscribed.
     * @deprecated use detach.
     */
    unsubscribe: function() {
        return this.detach.apply(this, arguments);
    },

    /**
     * Notify a single subscriber
     * @method _notify
     * @param {Subscriber} s the subscriber.
     * @param {Array} args the arguments array to apply to the listener.
     * @protected
     */
    _notify: function(s, args, ef) {


        var ret;

        ret = s.notify(args, this);

        if (false === ret || this.stopped > 1) {
            return false;
        }

        return true;
    },

    /**
     * Logger abstraction to centralize the application of the silent flag
     * @method log
     * @param {string} msg message to log.
     * @param {string} cat log category.
     */
    log: function(msg, cat) {
    },

    /**
     * Notifies the subscribers.  The callback functions will be executed
     * from the context specified when the event was created, and with the
     * following parameters:
     *   <ul>
     *   <li>The type of event</li>
     *   <li>All of the arguments fire() was executed with as an array</li>
     *   <li>The custom object (if any) that was passed into the subscribe()
     *       method</li>
     *   </ul>
     * @method fire
     * @param {Object*} arguments an arbitrary set of parameters to pass to
     *                            the handler.
     * @return {boolean} false if one of the subscribers returned false,
     *                   true otherwise.
     *
     */
    fire: function() {
        if (this.fireOnce && this.fired) {
            return true;
        } else {

            var args = nativeSlice.call(arguments, 0);

            // this doesn't happen if the event isn't published
            // this.host._monitor('fire', this.type, args);

            this.fired = true;

            if (this.fireOnce) {
                this.firedWith = args;
            }

            if (this.emitFacade) {
                return this.fireComplex(args);
            } else {
                return this.fireSimple(args);
            }
        }
    },

    /**
     * Set up for notifying subscribers of non-emitFacade events.
     *
     * @method fireSimple
     * @param args {Array} Arguments passed to fire()
     * @return Boolean false if a subscriber returned false
     * @protected
     */
    fireSimple: function(args) {
        this.stopped = 0;
        this.prevented = 0;
        if (this.hasSubs()) {
            var subs = this.getSubs();
            this._procSubs(subs[0], args);
            this._procSubs(subs[1], args);
        }
        this._broadcast(args);
        return this.stopped ? false : true;
    },

    // Requires the event-custom-complex module for full funcitonality.
    fireComplex: function(args) {
        args[0] = args[0] || {};
        return this.fireSimple(args);
    },

    /**
     * Notifies a list of subscribers.
     *
     * @method _procSubs
     * @param subs {Array} List of subscribers
     * @param args {Array} Arguments passed to fire()
     * @param ef {}
     * @return Boolean false if a subscriber returns false or stops the event
     *              propagation via e.stopPropagation(),
     *              e.stopImmediatePropagation(), or e.halt()
     * @private
     */
    _procSubs: function(subs, args, ef) {
        var s, i, l;

        for (i = 0, l = subs.length; i < l; i++) {
            s = subs[i];
            if (s && s.fn) {
                if (false === this._notify(s, args, ef)) {
                    this.stopped = 2;
                }
                if (this.stopped == 2) {
                    return false;
                }
            }
        }

        return true;
    },

    /**
     * Notifies the YUI instance if the event is configured with broadcast = 1,
     * and both the YUI instance and Y.Global if configured with broadcast = 2.
     *
     * @method _broadcast
     * @param args {Array} Arguments sent to fire()
     * @private
     */
    _broadcast: function(args) {
        if (!this.stopped && this.broadcast) {

            var a = args.concat();
            a.unshift(this.type);

            if (this.host !== Y) {
                Y.fire.apply(Y, a);
            }

            if (this.broadcast == 2) {
                Y.Global.fire.apply(Y.Global, a);
            }
        }
    },

    /**
     * Removes all listeners
     * @method unsubscribeAll
     * @return {int} The number of listeners unsubscribed.
     * @deprecated use detachAll.
     */
    unsubscribeAll: function() {
        return this.detachAll.apply(this, arguments);
    },

    /**
     * Removes all listeners
     * @method detachAll
     * @return {int} The number of listeners unsubscribed.
     */
    detachAll: function() {
        return this.detach();
    },

    /**
     * Deletes the subscriber from the internal store of on() and after()
     * subscribers.
     *
     * @method _delete
     * @param s subscriber object.
     * @param subs (optional) on or after subscriber array
     * @param index (optional) The index found.
     * @private
     */
    _delete: function(s, subs, i) {
        var when = s._when;

        if (!subs) {
            subs = (when === AFTER) ? this._afters : this._subscribers; 
            i = YArray.indexOf(subs, s, 0);
        }

        if (s && subs[i] === s) {
            subs.splice(i, 1);
        }

        if (this._kds) {
            if (when === AFTER) {
                delete this.afters[s.id];
            } else {
                delete this.subscribers[s.id];
            }
        }

        if (this.monitored && this.host) {
            this.host._monitor('detach', this, {
                ce: this,
                sub: s
            });
        }

        if (s) {
            s.deleted = true;
        }
    }
};
/**
 * Stores the subscriber information to be used when the event fires.
 * @param {Function} fn       The wrapped function to execute.
 * @param {Object}   context  The value of the keyword 'this' in the listener.
 * @param {Array} args*       0..n additional arguments to supply the listener.
 *
 * @class Subscriber
 * @constructor
 */
Y.Subscriber = function(fn, context, args, when) {

    /**
     * The callback that will be execute when the event fires
     * This is wrapped by Y.rbind if obj was supplied.
     * @property fn
     * @type Function
     */
    this.fn = fn;

    /**
     * Optional 'this' keyword for the listener
     * @property context
     * @type Object
     */
    this.context = context;

    /**
     * Unique subscriber id
     * @property id
     * @type String
     */
    this.id = Y.stamp(this);

    /**
     * Additional arguments to propagate to the subscriber
     * @property args
     * @type Array
     */
    this.args = args;

    this._when = when;

    /**
     * Custom events for a given fire transaction.
     * @property events
     * @type {EventTarget}
     */
    // this.events = null;

    /**
     * This listener only reacts to the event once
     * @property once
     */
    // this.once = false;

};

Y.Subscriber.prototype = {
    constructor: Y.Subscriber,

    _notify: function(c, args, ce) {
        if (this.deleted && !this.postponed) {
            if (this.postponed) {
                delete this.fn;
                delete this.context;
            } else {
                delete this.postponed;
                return null;
            }
        }
        var a = this.args, ret;
        switch (ce.signature) {
            case 0:
                ret = this.fn.call(c, ce.type, args, c);
                break;
            case 1:
                ret = this.fn.call(c, args[0] || null, c);
                break;
            default:
                if (a || args) {
                    args = args || [];
                    a = (a) ? args.concat(a) : args;
                    ret = this.fn.apply(c, a);
                } else {
                    ret = this.fn.call(c);
                }
        }

        if (this.once) {
            ce._delete(this);
        }

        return ret;
    },

    /**
     * Executes the subscriber.
     * @method notify
     * @param args {Array} Arguments array for the subscriber.
     * @param ce {CustomEvent} The custom event that sent the notification.
     */
    notify: function(args, ce) {
        var c = this.context,
            ret = true;

        if (!c) {
            c = (ce.contextFn) ? ce.contextFn() : ce.context;
        }

        // only catch errors if we will not re-throw them.
        if (Y.config && Y.config.throwFail) {
            ret = this._notify(c, args, ce);
        } else {
            try {
                ret = this._notify(c, args, ce);
            } catch (e) {
                Y.error(this + ' failed: ' + e.message, e);
            }
        }

        return ret;
    },

    /**
     * Returns true if the fn and obj match this objects properties.
     * Used by the unsubscribe method to match the right subscriber.
     *
     * @method contains
     * @param {Function} fn the function to execute.
     * @param {Object} context optional 'this' keyword for the listener.
     * @return {boolean} true if the supplied arguments match this
     *                   subscriber's signature.
     */
    contains: function(fn, context) {
        if (context) {
            return ((this.fn == fn) && this.context == context);
        } else {
            return (this.fn == fn);
        }
    },
    
    valueOf : function() {
        return this.id;
    }

};
/**
 * Return value from all subscribe operations
 * @class EventHandle
 * @constructor
 * @param {CustomEvent} evt the custom event.
 * @param {Subscriber} sub the subscriber.
 */
Y.EventHandle = function(evt, sub) {

    /**
     * The custom event
     *
     * @property evt
     * @type CustomEvent
     */
    this.evt = evt;

    /**
     * The subscriber object
     *
     * @property sub
     * @type Subscriber
     */
    this.sub = sub;
};

Y.EventHandle.prototype = {
    batch: function(f, c) {
        f.call(c || this, this);
        if (Y.Lang.isArray(this.evt)) {
            Y.Array.each(this.evt, function(h) {
                h.batch.call(c || h, f);
            });
        }
    },

    /**
     * Detaches this subscriber
     * @method detach
     * @return {int} the number of detached listeners
     */
    detach: function() {
        var evt = this.evt, detached = 0, i;
        if (evt) {
            if (Y.Lang.isArray(evt)) {
                for (i = 0; i < evt.length; i++) {
                    detached += evt[i].detach();
                }
            } else {
                evt._delete(this.sub);
                detached = 1;
            }

        }

        return detached;
    },

    /**
     * Monitor the event state for the subscribed event.  The first parameter
     * is what should be monitored, the rest are the normal parameters when
     * subscribing to an event.
     * @method monitor
     * @param what {string} what to monitor ('attach', 'detach', 'publish').
     * @return {EventHandle} return value from the monitor event subscription.
     */
    monitor: function(what) {
        return this.evt.monitor.apply(this.evt, arguments);
    }
};

/**
 * Custom event engine, DOM event listener abstraction layer, synthetic DOM
 * events.
 * @module event-custom
 * @submodule event-custom-base
 */

/**
 * EventTarget provides the implementation for any object to
 * publish, subscribe and fire to custom events, and also
 * alows other EventTargets to target the object with events
 * sourced from the other object.
 * EventTarget is designed to be used with Y.augment to wrap
 * EventCustom in an interface that allows events to be listened to
 * and fired by name.  This makes it possible for implementing code to
 * subscribe to an event that either has not been created yet, or will
 * not be created at all.
 * @class EventTarget
 * @param opts a configuration object
 * @config emitFacade {boolean} if true, all events will emit event
 * facade payloads by default (default false)
 * @config prefix {String} the prefix to apply to non-prefixed event names
 */

var L = Y.Lang,
    PREFIX_DELIMITER = ':',
    CATEGORY_DELIMITER = '|',
    AFTER_PREFIX = '~AFTER~',
    WILD_TYPE_RE = /(.*?)(:)(.*?)/,

    _wildType = Y.cached(function(type) {
        return type.replace(WILD_TYPE_RE, "*$2$3");
    }),

    /**
     * If the instance has a prefix attribute and the
     * event type is not prefixed, the instance prefix is
     * applied to the supplied type.
     * @method _getType
     * @private
     */
    _getType = Y.cached(function(type, pre) {

        if (!pre || (typeof type !== "string") || type.indexOf(PREFIX_DELIMITER) > -1) {
            return type;
        }

        return pre + PREFIX_DELIMITER + type;
    }),

    /**
     * Returns an array with the detach key (if provided),
     * and the prefixed event name from _getType
     * Y.on('detachcategory| menu:click', fn)
     * @method _parseType
     * @private
     */
    _parseType = Y.cached(function(type, pre) {

        var t = type, detachcategory, after, i;

        if (!L.isString(t)) {
            return t;
        }

        i = t.indexOf(AFTER_PREFIX);

        if (i > -1) {
            after = true;
            t = t.substr(AFTER_PREFIX.length);
        }

        i = t.indexOf(CATEGORY_DELIMITER);

        if (i > -1) {
            detachcategory = t.substr(0, (i));
            t = t.substr(i+1);
            if (t == '*') {
                t = null;
            }
        }

        // detach category, full type with instance prefix, is this an after listener, short type
        return [detachcategory, (pre) ? _getType(t, pre) : t, after, t];
    }),

    ET = function(opts) {


        var o = (L.isObject(opts)) ? opts : {};

        this._yuievt = this._yuievt || {

            id: Y.guid(),

            events: {},

            targets: {},

            config: o,

            chain: ('chain' in o) ? o.chain : Y.config.chain,

            bubbling: false,

            defaults: {
                context: o.context || this,
                host: this,
                emitFacade: o.emitFacade,
                fireOnce: o.fireOnce,
                queuable: o.queuable,
                monitored: o.monitored,
                broadcast: o.broadcast,
                defaultTargetOnly: o.defaultTargetOnly,
                bubbles: ('bubbles' in o) ? o.bubbles : true
            }
        };
    };


ET.prototype = {
    constructor: ET,

    /**
     * Listen to a custom event hosted by this object one time.
     * This is the equivalent to <code>on</code> except the
     * listener is immediatelly detached when it is executed.
     * @method once
     * @param {String} type The name of the event
     * @param {Function} fn The callback to execute in response to the event
     * @param {Object} [context] Override `this` object in callback
     * @param {Any} [arg*] 0..n additional arguments to supply to the subscriber
     * @return {EventHandle} A subscription handle capable of detaching the
     *                       subscription
     */
    once: function() {
        var handle = this.on.apply(this, arguments);
        handle.batch(function(hand) {
            if (hand.sub) {
                hand.sub.once = true;
            }
        });
        return handle;
    },

    /**
     * Listen to a custom event hosted by this object one time.
     * This is the equivalent to <code>after</code> except the
     * listener is immediatelly detached when it is executed.
     * @method onceAfter
     * @param {String} type The name of the event
     * @param {Function} fn The callback to execute in response to the event
     * @param {Object} [context] Override `this` object in callback
     * @param {Any} [arg*] 0..n additional arguments to supply to the subscriber
     * @return {EventHandle} A subscription handle capable of detaching that
     *                       subscription
     */
    onceAfter: function() {
        var handle = this.after.apply(this, arguments);
        handle.batch(function(hand) {
            if (hand.sub) {
                hand.sub.once = true;
            }
        });
        return handle;
    },

    /**
     * Takes the type parameter passed to 'on' and parses out the
     * various pieces that could be included in the type.  If the
     * event type is passed without a prefix, it will be expanded
     * to include the prefix one is supplied or the event target
     * is configured with a default prefix.
     * @method parseType
     * @param {String} type the type
     * @param {String} [pre=this._yuievt.config.prefix] the prefix
     * @since 3.3.0
     * @return {Array} an array containing:
     *  * the detach category, if supplied,
     *  * the prefixed event type,
     *  * whether or not this is an after listener,
     *  * the supplied event type
     */
    parseType: function(type, pre) {
        return _parseType(type, pre || this._yuievt.config.prefix);
    },

    /**
     * Subscribe a callback function to a custom event fired by this object or
     * from an object that bubbles its events to this object.
     *
     * Callback functions for events published with `emitFacade = true` will
     * receive an `EventFacade` as the first argument (typically named "e").
     * These callbacks can then call `e.preventDefault()` to disable the
     * behavior published to that event's `defaultFn`.  See the `EventFacade`
     * API for all available properties and methods. Subscribers to
     * non-`emitFacade` events will receive the arguments passed to `fire()`
     * after the event name.
     *
     * To subscribe to multiple events at once, pass an object as the first
     * argument, where the key:value pairs correspond to the eventName:callback,
     * or pass an array of event names as the first argument to subscribe to
     * all listed events with the same callback.
     *
     * Returning `false` from a callback is supported as an alternative to
     * calling `e.preventDefault(); e.stopPropagation();`.  However, it is
     * recommended to use the event methods whenever possible.
     *
     * @method on
     * @param {String} type The name of the event
     * @param {Function} fn The callback to execute in response to the event
     * @param {Object} [context] Override `this` object in callback
     * @param {Any} [arg*] 0..n additional arguments to supply to the subscriber
     * @return {EventHandle} A subscription handle capable of detaching that
     *                       subscription
     */
    on: function(type, fn, context) {

        var yuievt = this._yuievt,
            parts = _parseType(type, yuievt.config.prefix), f, c, args, ret, ce,
            detachcategory, handle, store = Y.Env.evt.handles, after, adapt, shorttype,
            Node = Y.Node, n, domevent, isArr;

        // full name, args, detachcategory, after
        this._monitor('attach', parts[1], {
            args: arguments,
            category: parts[0],
            after: parts[2]
        });

        if (L.isObject(type)) {

            if (L.isFunction(type)) {
                return Y.Do.before.apply(Y.Do, arguments);
            }

            f = fn;
            c = context;
            args = nativeSlice.call(arguments, 0);
            ret = [];

            if (L.isArray(type)) {
                isArr = true;
            }

            after = type._after;
            delete type._after;

            Y.each(type, function(v, k) {

                if (L.isObject(v)) {
                    f = v.fn || ((L.isFunction(v)) ? v : f);
                    c = v.context || c;
                }

                var nv = (after) ? AFTER_PREFIX : '';

                args[0] = nv + ((isArr) ? v : k);
                args[1] = f;
                args[2] = c;

                ret.push(this.on.apply(this, args));

            }, this);

            return (yuievt.chain) ? this : new Y.EventHandle(ret);
        }

        detachcategory = parts[0];
        after = parts[2];
        shorttype = parts[3];

        // extra redirection so we catch adaptor events too.  take a look at this.
        if (Node && Y.instanceOf(this, Node) && (shorttype in Node.DOM_EVENTS)) {
            args = nativeSlice.call(arguments, 0);
            args.splice(2, 0, Node.getDOMNode(this));
            return Y.on.apply(Y, args);
        }

        type = parts[1];

        if (Y.instanceOf(this, YUI)) {

            adapt = Y.Env.evt.plugins[type];
            args  = nativeSlice.call(arguments, 0);
            args[0] = shorttype;

            if (Node) {
                n = args[2];

                if (Y.instanceOf(n, Y.NodeList)) {
                    n = Y.NodeList.getDOMNodes(n);
                } else if (Y.instanceOf(n, Node)) {
                    n = Node.getDOMNode(n);
                }

                domevent = (shorttype in Node.DOM_EVENTS);

                // Captures both DOM events and event plugins.
                if (domevent) {
                    args[2] = n;
                }
            }

            // check for the existance of an event adaptor
            if (adapt) {
                handle = adapt.on.apply(Y, args);
            } else if ((!type) || domevent) {
                handle = Y.Event._attach(args);
            }

        }

        if (!handle) {
            ce = yuievt.events[type] || this.publish(type);
            handle = ce._on(fn, context, (arguments.length > 3) ? nativeSlice.call(arguments, 3) : null, (after) ? 'after' : true);
        }

        if (detachcategory) {
            store[detachcategory] = store[detachcategory] || {};
            store[detachcategory][type] = store[detachcategory][type] || [];
            store[detachcategory][type].push(handle);
        }

        return (yuievt.chain) ? this : handle;

    },

    /**
     * subscribe to an event
     * @method subscribe
     * @deprecated use on
     */
    subscribe: function() {
        return this.on.apply(this, arguments);
    },

    /**
     * Detach one or more listeners the from the specified event
     * @method detach
     * @param type {string|Object}   Either the handle to the subscriber or the
     *                        type of event.  If the type
     *                        is not specified, it will attempt to remove
     *                        the listener from all hosted events.
     * @param fn   {Function} The subscribed function to unsubscribe, if not
     *                          supplied, all subscribers will be removed.
     * @param context  {Object}   The custom object passed to subscribe.  This is
     *                        optional, but if supplied will be used to
     *                        disambiguate multiple listeners that are the same
     *                        (e.g., you subscribe many object using a function
     *                        that lives on the prototype)
     * @return {EventTarget} the host
     */
    detach: function(type, fn, context) {
        var evts = this._yuievt.events, i,
            Node = Y.Node, isNode = Node && (Y.instanceOf(this, Node));

        // detachAll disabled on the Y instance.
        if (!type && (this !== Y)) {
            for (i in evts) {
                if (evts.hasOwnProperty(i)) {
                    evts[i].detach(fn, context);
                }
            }
            if (isNode) {
                Y.Event.purgeElement(Node.getDOMNode(this));
            }

            return this;
        }

        var parts = _parseType(type, this._yuievt.config.prefix),
        detachcategory = L.isArray(parts) ? parts[0] : null,
        shorttype = (parts) ? parts[3] : null,
        adapt, store = Y.Env.evt.handles, detachhost, cat, args,
        ce,

        keyDetacher = function(lcat, ltype, host) {
            var handles = lcat[ltype], ce, i;
            if (handles) {
                for (i = handles.length - 1; i >= 0; --i) {
                    ce = handles[i].evt;
                    if (ce.host === host || ce.el === host) {
                        handles[i].detach();
                    }
                }
            }
        };

        if (detachcategory) {

            cat = store[detachcategory];
            type = parts[1];
            detachhost = (isNode) ? Y.Node.getDOMNode(this) : this;

            if (cat) {
                if (type) {
                    keyDetacher(cat, type, detachhost);
                } else {
                    for (i in cat) {
                        if (cat.hasOwnProperty(i)) {
                            keyDetacher(cat, i, detachhost);
                        }
                    }
                }

                return this;
            }

        // If this is an event handle, use it to detach
        } else if (L.isObject(type) && type.detach) {
            type.detach();
            return this;
        // extra redirection so we catch adaptor events too.  take a look at this.
        } else if (isNode && ((!shorttype) || (shorttype in Node.DOM_EVENTS))) {
            args = nativeSlice.call(arguments, 0);
            args[2] = Node.getDOMNode(this);
            Y.detach.apply(Y, args);
            return this;
        }

        adapt = Y.Env.evt.plugins[shorttype];

        // The YUI instance handles DOM events and adaptors
        if (Y.instanceOf(this, YUI)) {
            args = nativeSlice.call(arguments, 0);
            // use the adaptor specific detach code if
            if (adapt && adapt.detach) {
                adapt.detach.apply(Y, args);
                return this;
            // DOM event fork
            } else if (!type || (!adapt && Node && (type in Node.DOM_EVENTS))) {
                args[0] = type;
                Y.Event.detach.apply(Y.Event, args);
                return this;
            }
        }

        // ce = evts[type];
        ce = evts[parts[1]];
        if (ce) {
            ce.detach(fn, context);
        }

        return this;
    },

    /**
     * detach a listener
     * @method unsubscribe
     * @deprecated use detach
     */
    unsubscribe: function() {
        return this.detach.apply(this, arguments);
    },

    /**
     * Removes all listeners from the specified event.  If the event type
     * is not specified, all listeners from all hosted custom events will
     * be removed.
     * @method detachAll
     * @param type {String}   The type, or name of the event
     */
    detachAll: function(type) {
        return this.detach(type);
    },

    /**
     * Removes all listeners from the specified event.  If the event type
     * is not specified, all listeners from all hosted custom events will
     * be removed.
     * @method unsubscribeAll
     * @param type {String}   The type, or name of the event
     * @deprecated use detachAll
     */
    unsubscribeAll: function() {
        return this.detachAll.apply(this, arguments);
    },

    /**
     * Creates a new custom event of the specified type.  If a custom event
     * by that name already exists, it will not be re-created.  In either
     * case the custom event is returned.
     *
     * @method publish
     *
     * @param type {String} the type, or name of the event
     * @param opts {object} optional config params.  Valid properties are:
     *
     *  <ul>
     *    <li>
     *   'broadcast': whether or not the YUI instance and YUI global are notified when the event is fired (false)
     *    </li>
     *    <li>
     *   'bubbles': whether or not this event bubbles (true)
     *              Events can only bubble if emitFacade is true.
     *    </li>
     *    <li>
     *   'context': the default execution context for the listeners (this)
     *    </li>
     *    <li>
     *   'defaultFn': the default function to execute when this event fires if preventDefault was not called
     *    </li>
     *    <li>
     *   'emitFacade': whether or not this event emits a facade (false)
     *    </li>
     *    <li>
     *   'prefix': the prefix for this targets events, e.g., 'menu' in 'menu:click'
     *    </li>
     *    <li>
     *   'fireOnce': if an event is configured to fire once, new subscribers after
     *   the fire will be notified immediately.
     *    </li>
     *    <li>
     *   'async': fireOnce event listeners will fire synchronously if the event has already
     *    fired unless async is true.
     *    </li>
     *    <li>
     *   'preventable': whether or not preventDefault() has an effect (true)
     *    </li>
     *    <li>
     *   'preventedFn': a function that is executed when preventDefault is called
     *    </li>
     *    <li>
     *   'queuable': whether or not this event can be queued during bubbling (false)
     *    </li>
     *    <li>
     *   'silent': if silent is true, debug messages are not provided for this event.
     *    </li>
     *    <li>
     *   'stoppedFn': a function that is executed when stopPropagation is called
     *    </li>
     *
     *    <li>
     *   'monitored': specifies whether or not this event should send notifications about
     *   when the event has been attached, detached, or published.
     *    </li>
     *    <li>
     *   'type': the event type (valid option if not provided as the first parameter to publish)
     *    </li>
     *  </ul>
     *
     *  @return {CustomEvent} the custom event
     *
     */
    publish: function(type, opts) {
        var events, ce, ret, defaults,
            edata = this._yuievt,
            pre = edata.config.prefix;

        if (L.isObject(type)) {
            ret = {};
            Y.each(type, function(v, k) {
                ret[k] = this.publish(k, v || opts);
            }, this);

            return ret;
        }

        type = (pre) ? _getType(type, pre) : type;

        events = edata.events;
        ce = events[type];

        this._monitor('publish', type, {
            args: arguments
        });

        if (ce) {
            // ce.log("publish applying new config to published event: '"+type+"' exists", 'info', 'event');
            if (opts) {
                ce.applyConfig(opts, true);
            }
        } else {
            // TODO: Lazy publish goes here.
            defaults = edata.defaults;

            // apply defaults
            ce = new Y.CustomEvent(type, defaults);
            if (opts) {
                ce.applyConfig(opts, true);
            }

            events[type] = ce;
        }

        // make sure we turn the broadcast flag off if this
        // event was published as a result of bubbling
        // if (opts instanceof Y.CustomEvent) {
          //   events[type].broadcast = false;
        // }

        return events[type];
    },

    /**
     * This is the entry point for the event monitoring system.
     * You can monitor 'attach', 'detach', 'fire', and 'publish'.
     * When configured, these events generate an event.  click ->
     * click_attach, click_detach, click_publish -- these can
     * be subscribed to like other events to monitor the event
     * system.  Inividual published events can have monitoring
     * turned on or off (publish can't be turned off before it
     * it published) by setting the events 'monitor' config.
     *
     * @method _monitor
     * @param what {String} 'attach', 'detach', 'fire', or 'publish'
     * @param eventType {String|CustomEvent} The prefixed name of the event being monitored, or the CustomEvent object.
     * @param o {Object} Information about the event interaction, such as
     *                  fire() args, subscription category, publish config
     * @private
     */
    _monitor: function(what, eventType, o) {
        var monitorevt, ce, type;

        if (eventType) {
            if (typeof eventType === "string") {
                type = eventType;
                ce = this.getEvent(eventType, true);
            } else {
                ce = eventType;
                type = eventType.type;
            }

            if ((this._yuievt.config.monitored && (!ce || ce.monitored)) || (ce && ce.monitored)) {
                monitorevt = type + '_' + what;
                o.monitored = what;
                this.fire.call(this, monitorevt, o);
            }
        }
    },

   /**
     * Fire a custom event by name.  The callback functions will be executed
     * from the context specified when the event was created, and with the
     * following parameters.
     *
     * If the custom event object hasn't been created, then the event hasn't
     * been published and it has no subscribers.  For performance sake, we
     * immediate exit in this case.  This means the event won't bubble, so
     * if the intention is that a bubble target be notified, the event must
     * be published on this object first.
     *
     * The first argument is the event type, and any additional arguments are
     * passed to the listeners as parameters.  If the first of these is an
     * object literal, and the event is configured to emit an event facade,
     * that object is mixed into the event facade and the facade is provided
     * in place of the original object.
     *
     * @method fire
     * @param type {String|Object} The type of the event, or an object that contains
     * a 'type' property.
     * @param arguments {Object*} an arbitrary set of parameters to pass to
     * the handler.  If the first of these is an object literal and the event is
     * configured to emit an event facade, the event facade will replace that
     * parameter after the properties the object literal contains are copied to
     * the event facade.
     * @return {EventTarget} the event host
     */
    fire: function(type) {

        var typeIncluded = L.isString(type),
            t = (typeIncluded) ? type : (type && type.type),
            yuievt = this._yuievt,
            pre = yuievt.config.prefix, 
            ce, ret, 
            ce2,
            args = (typeIncluded) ? nativeSlice.call(arguments, 1) : arguments;

        t = (pre) ? _getType(t, pre) : t;

        ce = this.getEvent(t, true);
        ce2 = this.getSibling(t, ce);

        if (ce2 && !ce) {
            ce = this.publish(t);
        }

        this._monitor('fire', (ce || t), {
            args: args
        });

        // this event has not been published or subscribed to
        if (!ce) {
            if (yuievt.hasTargets) {
                return this.bubble({ type: t }, args, this);
            }

            // otherwise there is nothing to be done
            ret = true;
        } else {
            ce.sibling = ce2;
            ret = ce.fire.apply(ce, args);
        }

        return (yuievt.chain) ? this : ret;
    },

    getSibling: function(type, ce) {
        var ce2;
        // delegate to *:type events if there are subscribers
        if (type.indexOf(PREFIX_DELIMITER) > -1) {
            type = _wildType(type);
            // console.log(type);
            ce2 = this.getEvent(type, true);
            if (ce2) {
                // console.log("GOT ONE: " + type);
                ce2.applyConfig(ce);
                ce2.bubbles = false;
                ce2.broadcast = 0;
                // ret = ce2.fire.apply(ce2, a);
            }
        }

        return ce2;
    },

    /**
     * Returns the custom event of the provided type has been created, a
     * falsy value otherwise
     * @method getEvent
     * @param type {String} the type, or name of the event
     * @param prefixed {String} if true, the type is prefixed already
     * @return {CustomEvent} the custom event or null
     */
    getEvent: function(type, prefixed) {
        var pre, e;
        if (!prefixed) {
            pre = this._yuievt.config.prefix;
            type = (pre) ? _getType(type, pre) : type;
        }
        e = this._yuievt.events;
        return e[type] || null;
    },

    /**
     * Subscribe to a custom event hosted by this object.  The
     * supplied callback will execute after any listeners add
     * via the subscribe method, and after the default function,
     * if configured for the event, has executed.
     *
     * @method after
     * @param {String} type The name of the event
     * @param {Function} fn The callback to execute in response to the event
     * @param {Object} [context] Override `this` object in callback
     * @param {Any} [arg*] 0..n additional arguments to supply to the subscriber
     * @return {EventHandle} A subscription handle capable of detaching the
     *                       subscription
     */
    after: function(type, fn) {

        var a = nativeSlice.call(arguments, 0);

        switch (L.type(type)) {
            case 'function':
                return Y.Do.after.apply(Y.Do, arguments);
            case 'array':
            //     YArray.each(a[0], function(v) {
            //         v = AFTER_PREFIX + v;
            //     });
            //     break;
            case 'object':
                a[0]._after = true;
                break;
            default:
                a[0] = AFTER_PREFIX + type;
        }

        return this.on.apply(this, a);

    },

    /**
     * Executes the callback before a DOM event, custom event
     * or method.  If the first argument is a function, it
     * is assumed the target is a method.  For DOM and custom
     * events, this is an alias for Y.on.
     *
     * For DOM and custom events:
     * type, callback, context, 0-n arguments
     *
     * For methods:
     * callback, object (method host), methodName, context, 0-n arguments
     *
     * @method before
     * @return detach handle
     */
    before: function() {
        return this.on.apply(this, arguments);
    }

};

Y.EventTarget = ET;

// make Y an event target
Y.mix(Y, ET.prototype);
ET.call(Y, { bubbles: false });

YUI.Env.globalEvents = YUI.Env.globalEvents || new ET();

/**
 * Hosts YUI page level events.  This is where events bubble to
 * when the broadcast config is set to 2.  This property is
 * only available if the custom event module is loaded.
 * @property Global
 * @type EventTarget
 * @for YUI
 */
Y.Global = YUI.Env.globalEvents;

// @TODO implement a global namespace function on Y.Global?

/**
`Y.on()` can do many things:

<ul>
    <li>Subscribe to custom events `publish`ed and `fire`d from Y</li>
    <li>Subscribe to custom events `publish`ed with `broadcast` 1 or 2 and
        `fire`d from any object in the YUI instance sandbox</li>
    <li>Subscribe to DOM events</li>
    <li>Subscribe to the execution of a method on any object, effectively
    treating that method as an event</li>
</ul>

For custom event subscriptions, pass the custom event name as the first argument and callback as the second. The `this` object in the callback will be `Y` unless an override is passed as the third argument.

    Y.on('io:complete', function () {
        Y.MyApp.updateStatus('Transaction complete');
    });

To subscribe to DOM events, pass the name of a DOM event as the first argument
and a CSS selector string as the third argument after the callback function.
Alternately, the third argument can be a `Node`, `NodeList`, `HTMLElement`,
array, or simply omitted (the default is the `window` object).

    Y.on('click', function (e) {
        e.preventDefault();

        // proceed with ajax form submission
        var url = this.get('action');
        ...
    }, '#my-form');

The `this` object in DOM event callbacks will be the `Node` targeted by the CSS
selector or other identifier.

`on()` subscribers for DOM events or custom events `publish`ed with a
`defaultFn` can prevent the default behavior with `e.preventDefault()` from the
event object passed as the first parameter to the subscription callback.

To subscribe to the execution of an object method, pass arguments corresponding to the call signature for 
<a href="../classes/Do.html#methods_before">`Y.Do.before(...)`</a>.

NOTE: The formal parameter list below is for events, not for function
injection.  See `Y.Do.before` for that signature.

@method on
@param {String} type DOM or custom event name
@param {Function} fn The callback to execute in response to the event
@param {Object} [context] Override `this` object in callback
@param {Any} [arg*] 0..n additional arguments to supply to the subscriber
@return {EventHandle} A subscription handle capable of detaching the
                      subscription
@see Do.before
@for YUI
**/

/**
Listen for an event one time.  Equivalent to `on()`, except that
the listener is immediately detached when executed.

See the <a href="#methods_on">`on()` method</a> for additional subscription
options.

@see on
@method once
@param {String} type DOM or custom event name
@param {Function} fn The callback to execute in response to the event
@param {Object} [context] Override `this` object in callback
@param {Any} [arg*] 0..n additional arguments to supply to the subscriber
@return {EventHandle} A subscription handle capable of detaching the
                      subscription
@for YUI
**/

/**
Listen for an event one time.  Equivalent to `once()`, except, like `after()`,
the subscription callback executes after all `on()` subscribers and the event's
`defaultFn` (if configured) have executed.  Like `after()` if any `on()` phase
subscriber calls `e.preventDefault()`, neither the `defaultFn` nor the `after()`
subscribers will execute.

The listener is immediately detached when executed.

See the <a href="#methods_on">`on()` method</a> for additional subscription
options.

@see once
@method onceAfter
@param {String} type The custom event name
@param {Function} fn The callback to execute in response to the event
@param {Object} [context] Override `this` object in callback
@param {Any} [arg*] 0..n additional arguments to supply to the subscriber
@return {EventHandle} A subscription handle capable of detaching the
                      subscription
@for YUI
**/

/**
Like `on()`, this method creates a subscription to a custom event or to the
execution of a method on an object.

For events, `after()` subscribers are executed after the event's
`defaultFn` unless `e.preventDefault()` was called from an `on()` subscriber.

See the <a href="#methods_on">`on()` method</a> for additional subscription
options.

NOTE: The subscription signature shown is for events, not for function
injection.  See <a href="../classes/Do.html#methods_after">`Y.Do.after`</a>
for that signature.

@see on
@see Do.after
@method after
@param {String} type The custom event name
@param {Function} fn The callback to execute in response to the event
@param {Object} [context] Override `this` object in callback
@param {Any} [args*] 0..n additional arguments to supply to the subscriber
@return {EventHandle} A subscription handle capable of detaching the
                      subscription
@for YUI
**/


}, '3.7.3', {"requires": ["oop"]});
