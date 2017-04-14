/*
YUI 3.7.3 (build 5687)
Copyright 2012 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/
YUI.add('async-queue', function (Y, NAME) {

/**
 * <p>AsyncQueue allows you create a chain of function callbacks executed
 * via setTimeout (or synchronously) that are guaranteed to run in order.
 * Items in the queue can be promoted or removed.  Start or resume the
 * execution chain with run().  pause() to temporarily delay execution, or
 * stop() to halt and clear the queue.</p>
 *
 * @module async-queue
 */

/**
 * <p>A specialized queue class that supports scheduling callbacks to execute
 * sequentially, iteratively, even asynchronously.</p>
 *
 * <p>Callbacks can be function refs or objects with the following keys.  Only
 * the <code>fn</code> key is required.</p>
 *
 * <ul>
 * <li><code>fn</code> -- The callback function</li>
 * <li><code>context</code> -- The execution context for the callbackFn.</li>
 * <li><code>args</code> -- Arguments to pass to callbackFn.</li>
 * <li><code>timeout</code> -- Millisecond delay before executing callbackFn.
 *                     (Applies to each iterative execution of callback)</li>
 * <li><code>iterations</code> -- Number of times to repeat the callback.
 * <li><code>until</code> -- Repeat the callback until this function returns
 *                         true.  This setting trumps iterations.</li>
 * <li><code>autoContinue</code> -- Set to false to prevent the AsyncQueue from
 *                        executing the next callback in the Queue after
 *                        the callback completes.</li>
 * <li><code>id</code> -- Name that can be used to get, promote, get the
 *                        indexOf, or delete this callback.</li>
 * </ul>
 *
 * @class AsyncQueue
 * @extends EventTarget
 * @constructor
 * @param callback* {Function|Object} 0..n callbacks to seed the queue
 */
Y.AsyncQueue = function() {
    this._init();
    this.add.apply(this, arguments);
};

var Queue   = Y.AsyncQueue,
    EXECUTE = 'execute',
    SHIFT   = 'shift',
    PROMOTE = 'promote',
    REMOVE  = 'remove',

    isObject   = Y.Lang.isObject,
    isFunction = Y.Lang.isFunction;

/**
 * <p>Static default values used to populate callback configuration properties.
 * Preconfigured defaults include:</p>
 *
 * <ul>
 *  <li><code>autoContinue</code>: <code>true</code></li>
 *  <li><code>iterations</code>: 1</li>
 *  <li><code>timeout</code>: 10 (10ms between callbacks)</li>
 *  <li><code>until</code>: (function to run until iterations &lt;= 0)</li>
 * </ul>
 *
 * @property defaults
 * @type {Object}
 * @static
 */
Queue.defaults = Y.mix({
    autoContinue : true,
    iterations   : 1,
    timeout      : 10,
    until        : function () {
        this.iterations |= 0;
        return this.iterations <= 0;
    }
}, Y.config.queueDefaults || {});

Y.extend(Queue, Y.EventTarget, {
    /**
     * Used to indicate the queue is currently executing a callback.
     *
     * @property _running
     * @type {Boolean|Object} true for synchronous callback execution, the
     *                        return handle from Y.later for async callbacks.
     *                        Otherwise false.
     * @protected
     */
    _running : false,

    /**
     * Initializes the AsyncQueue instance properties and events.
     *
     * @method _init
     * @protected
     */
    _init : function () {
        Y.EventTarget.call(this, { prefix: 'queue', emitFacade: true });

        this._q = [];

        /** 
         * Callback defaults for this instance.  Static defaults that are not
         * overridden are also included.
         *
         * @property defaults
         * @type {Object}
         */
        this.defaults = {};

        this._initEvents();
    },

    /**
     * Initializes the instance events.
     *
     * @method _initEvents
     * @protected
     */
    _initEvents : function () {
        this.publish({
            'execute' : { defaultFn : this._defExecFn,    emitFacade: true },
            'shift'   : { defaultFn : this._defShiftFn,   emitFacade: true },
            'add'     : { defaultFn : this._defAddFn,     emitFacade: true },
            'promote' : { defaultFn : this._defPromoteFn, emitFacade: true },
            'remove'  : { defaultFn : this._defRemoveFn,  emitFacade: true }
        });
    },

    /**
     * Returns the next callback needing execution.  If a callback is
     * configured to repeat via iterations or until, it will be returned until
     * the completion criteria is met.
     *
     * When the queue is empty, null is returned.
     *
     * @method next
     * @return {Function} the callback to execute
     */
    next : function () {
        var callback;

        while (this._q.length) {
            callback = this._q[0] = this._prepare(this._q[0]);
            if (callback && callback.until()) {
                this.fire(SHIFT, { callback: callback });
                callback = null;
            } else {
                break;
            }
        }

        return callback || null;
    },

    /**
     * Default functionality for the &quot;shift&quot; event.  Shifts the
     * callback stored in the event object's <em>callback</em> property from
     * the queue if it is the first item.
     *
     * @method _defShiftFn
     * @param e {Event} The event object
     * @protected
     */
    _defShiftFn : function (e) {
        if (this.indexOf(e.callback) === 0) {
            this._q.shift();
        }
    },

    /**
     * Creates a wrapper function to execute the callback using the aggregated 
     * configuration generated by combining the static AsyncQueue.defaults, the
     * instance defaults, and the specified callback settings.
     *
     * The wrapper function is decorated with the callback configuration as
     * properties for runtime modification.
     *
     * @method _prepare
     * @param callback {Object|Function} the raw callback
     * @return {Function} a decorated function wrapper to execute the callback
     * @protected
     */
    _prepare: function (callback) {
        if (isFunction(callback) && callback._prepared) {
            return callback;
        }

        var config = Y.merge(
            Queue.defaults,
            { context : this, args: [], _prepared: true },
            this.defaults,
            (isFunction(callback) ? { fn: callback } : callback)),
            
            wrapper = Y.bind(function () {
                if (!wrapper._running) {
                    wrapper.iterations--;
                }
                if (isFunction(wrapper.fn)) {
                    wrapper.fn.apply(wrapper.context || Y,
                                     Y.Array(wrapper.args));
                }
            }, this);
            
        return Y.mix(wrapper, config);
    },

    /**
     * Sets the queue in motion.  All queued callbacks will be executed in
     * order unless pause() or stop() is called or if one of the callbacks is
     * configured with autoContinue: false.
     *
     * @method run
     * @return {AsyncQueue} the AsyncQueue instance
     * @chainable
     */
    run : function () {
        var callback,
            cont = true;

        for (callback = this.next();
            cont && callback && !this.isRunning();
            callback = this.next())
        {
            cont = (callback.timeout < 0) ?
                this._execute(callback) :
                this._schedule(callback);
        }

        if (!callback) {
            /**
             * Event fired after the last queued callback is executed.
             * @event complete
             */
            this.fire('complete');
        }

        return this;
    },

    /**
     * Handles the execution of callbacks. Returns a boolean indicating
     * whether it is appropriate to continue running.
     *
     * @method _execute
     * @param callback {Object} the callback object to execute
     * @return {Boolean} whether the run loop should continue
     * @protected
     */
    _execute : function (callback) {
        this._running = callback._running = true;

        callback.iterations--;
        this.fire(EXECUTE, { callback: callback });

        var cont = this._running && callback.autoContinue;

        this._running = callback._running = false;

        return cont;
    },

    /**
     * Schedules the execution of asynchronous callbacks.
     *
     * @method _schedule
     * @param callback {Object} the callback object to execute
     * @return {Boolean} whether the run loop should continue
     * @protected
     */
    _schedule : function (callback) {
        this._running = Y.later(callback.timeout, this, function () {
            if (this._execute(callback)) {
                this.run();
            }
        });

        return false;
    },

    /**
     * Determines if the queue is waiting for a callback to complete execution.
     *
     * @method isRunning
     * @return {Boolean} true if queue is waiting for a 
     *                   from any initiated transactions
     */
    isRunning : function () {
        return !!this._running;
    },

    /**
     * Default functionality for the &quot;execute&quot; event.  Executes the
     * callback function
     *
     * @method _defExecFn
     * @param e {Event} the event object
     * @protected
     */
    _defExecFn : function (e) {
        e.callback();
    },

    /**
     * Add any number of callbacks to the end of the queue. Callbacks may be
     * provided as functions or objects.
     *
     * @method add
     * @param callback* {Function|Object} 0..n callbacks
     * @return {AsyncQueue} the AsyncQueue instance
     * @chainable
     */
    add : function () {
        this.fire('add', { callbacks: Y.Array(arguments,0,true) });

        return this;
    },

    /**
     * Default functionality for the &quot;add&quot; event.  Adds the callbacks
     * in the event facade to the queue. Callbacks successfully added to the
     * queue are present in the event's <code>added</code> property in the
     * after phase.
     *
     * @method _defAddFn
     * @param e {Event} the event object
     * @protected
     */
    _defAddFn : function(e) {
        var _q = this._q,
            added = [];

        Y.Array.each(e.callbacks, function (c) {
            if (isObject(c)) {
                _q.push(c);
                added.push(c);
            }
        });

        e.added = added;
    },

    /**
     * Pause the execution of the queue after the execution of the current
     * callback completes.  If called from code outside of a queued callback,
     * clears the timeout for the pending callback. Paused queue can be
     * restarted with q.run()
     *
     * @method pause
     * @return {AsyncQueue} the AsyncQueue instance
     * @chainable
     */
    pause: function () {
        if (isObject(this._running)) {
            this._running.cancel();
        }

        this._running = false;

        return this;
    },

    /**
     * Stop and clear the queue after the current execution of the
     * current callback completes.
     *
     * @method stop
     * @return {AsyncQueue} the AsyncQueue instance
     * @chainable
     */
    stop : function () { 
        this._q = [];

        return this.pause();
    },

    /** 
     * Returns the current index of a callback.  Pass in either the id or
     * callback function from getCallback.
     *
     * @method indexOf
     * @param callback {String|Function} the callback or its specified id
     * @return {Number} index of the callback or -1 if not found
     */
    indexOf : function (callback) {
        var i = 0, len = this._q.length, c;

        for (; i < len; ++i) {
            c = this._q[i];
            if (c === callback || c.id === callback) {
                return i;
            }
        }

        return -1;
    },

    /**
     * Retrieve a callback by its id.  Useful to modify the configuration
     * while the queue is running.
     *
     * @method getCallback
     * @param id {String} the id assigned to the callback
     * @return {Object} the callback object
     */
    getCallback : function (id) {
        var i = this.indexOf(id);

        return (i > -1) ? this._q[i] : null;
    },

    /**
     * Promotes the named callback to the top of the queue. If a callback is
     * currently executing or looping (via until or iterations), the promotion
     * is scheduled to occur after the current callback has completed.
     *
     * @method promote
     * @param callback {String|Object} the callback object or a callback's id
     * @return {AsyncQueue} the AsyncQueue instance
     * @chainable
     */
    promote : function (callback) {
        var payload = { callback : callback },e;

        if (this.isRunning()) {
            e = this.after(SHIFT, function () {
                    this.fire(PROMOTE, payload);
                    e.detach();
                }, this);
        } else {
            this.fire(PROMOTE, payload);
        }

        return this;
    },

    /**
     * <p>Default functionality for the &quot;promote&quot; event.  Promotes the
     * named callback to the head of the queue.</p>
     *
     * <p>The event object will contain a property &quot;callback&quot;, which
     * holds the id of a callback or the callback object itself.</p>
     *
     * @method _defPromoteFn
     * @param e {Event} the custom event
     * @protected
     */
    _defPromoteFn : function (e) {
        var i = this.indexOf(e.callback),
            promoted = (i > -1) ? this._q.splice(i,1)[0] : null;

        e.promoted = promoted;

        if (promoted) {
            this._q.unshift(promoted);
        }
    },

    /**
     * Removes the callback from the queue.  If the queue is active, the
     * removal is scheduled to occur after the current callback has completed.
     *
     * @method remove
     * @param callback {String|Object} the callback object or a callback's id
     * @return {AsyncQueue} the AsyncQueue instance
     * @chainable
     */
    remove : function (callback) {
        var payload = { callback : callback },e;

        // Can't return the removed callback because of the deferral until
        // current callback is complete
        if (this.isRunning()) {
            e = this.after(SHIFT, function () {
                    this.fire(REMOVE, payload);
                    e.detach();
                },this);
        } else {
            this.fire(REMOVE, payload);
        }

        return this;
    },

    /**
     * <p>Default functionality for the &quot;remove&quot; event.  Removes the
     * callback from the queue.</p>
     *
     * <p>The event object will contain a property &quot;callback&quot;, which
     * holds the id of a callback or the callback object itself.</p>
     *
     * @method _defRemoveFn
     * @param e {Event} the custom event
     * @protected
     */
    _defRemoveFn : function (e) {
        var i = this.indexOf(e.callback);

        e.removed = (i > -1) ? this._q.splice(i,1)[0] : null;
    },

    /**
     * Returns the number of callbacks in the queue.
     *
     * @method size
     * @return {Number}
     */
    size : function () {
        // next() flushes callbacks that have met their until() criteria and
        // therefore shouldn't count since they wouldn't execute anyway.
        if (!this.isRunning()) {
            this.next();
        }

        return this._q.length;
    }
});



}, '3.7.3', {"requires": ["event-custom"]});
