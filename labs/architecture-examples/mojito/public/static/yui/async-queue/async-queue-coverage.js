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
_yuitest_coverage["build/async-queue/async-queue.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/async-queue/async-queue.js",
    code: []
};
_yuitest_coverage["build/async-queue/async-queue.js"].code=["YUI.add('async-queue', function (Y, NAME) {","","/**"," * <p>AsyncQueue allows you create a chain of function callbacks executed"," * via setTimeout (or synchronously) that are guaranteed to run in order."," * Items in the queue can be promoted or removed.  Start or resume the"," * execution chain with run().  pause() to temporarily delay execution, or"," * stop() to halt and clear the queue.</p>"," *"," * @module async-queue"," */","","/**"," * <p>A specialized queue class that supports scheduling callbacks to execute"," * sequentially, iteratively, even asynchronously.</p>"," *"," * <p>Callbacks can be function refs or objects with the following keys.  Only"," * the <code>fn</code> key is required.</p>"," *"," * <ul>"," * <li><code>fn</code> -- The callback function</li>"," * <li><code>context</code> -- The execution context for the callbackFn.</li>"," * <li><code>args</code> -- Arguments to pass to callbackFn.</li>"," * <li><code>timeout</code> -- Millisecond delay before executing callbackFn."," *                     (Applies to each iterative execution of callback)</li>"," * <li><code>iterations</code> -- Number of times to repeat the callback."," * <li><code>until</code> -- Repeat the callback until this function returns"," *                         true.  This setting trumps iterations.</li>"," * <li><code>autoContinue</code> -- Set to false to prevent the AsyncQueue from"," *                        executing the next callback in the Queue after"," *                        the callback completes.</li>"," * <li><code>id</code> -- Name that can be used to get, promote, get the"," *                        indexOf, or delete this callback.</li>"," * </ul>"," *"," * @class AsyncQueue"," * @extends EventTarget"," * @constructor"," * @param callback* {Function|Object} 0..n callbacks to seed the queue"," */","Y.AsyncQueue = function() {","    this._init();","    this.add.apply(this, arguments);","};","","var Queue   = Y.AsyncQueue,","    EXECUTE = 'execute',","    SHIFT   = 'shift',","    PROMOTE = 'promote',","    REMOVE  = 'remove',","","    isObject   = Y.Lang.isObject,","    isFunction = Y.Lang.isFunction;","","/**"," * <p>Static default values used to populate callback configuration properties."," * Preconfigured defaults include:</p>"," *"," * <ul>"," *  <li><code>autoContinue</code>: <code>true</code></li>"," *  <li><code>iterations</code>: 1</li>"," *  <li><code>timeout</code>: 10 (10ms between callbacks)</li>"," *  <li><code>until</code>: (function to run until iterations &lt;= 0)</li>"," * </ul>"," *"," * @property defaults"," * @type {Object}"," * @static"," */","Queue.defaults = Y.mix({","    autoContinue : true,","    iterations   : 1,","    timeout      : 10,","    until        : function () {","        this.iterations |= 0;","        return this.iterations <= 0;","    }","}, Y.config.queueDefaults || {});","","Y.extend(Queue, Y.EventTarget, {","    /**","     * Used to indicate the queue is currently executing a callback.","     *","     * @property _running","     * @type {Boolean|Object} true for synchronous callback execution, the","     *                        return handle from Y.later for async callbacks.","     *                        Otherwise false.","     * @protected","     */","    _running : false,","","    /**","     * Initializes the AsyncQueue instance properties and events.","     *","     * @method _init","     * @protected","     */","    _init : function () {","        Y.EventTarget.call(this, { prefix: 'queue', emitFacade: true });","","        this._q = [];","","        /** ","         * Callback defaults for this instance.  Static defaults that are not","         * overridden are also included.","         *","         * @property defaults","         * @type {Object}","         */","        this.defaults = {};","","        this._initEvents();","    },","","    /**","     * Initializes the instance events.","     *","     * @method _initEvents","     * @protected","     */","    _initEvents : function () {","        this.publish({","            'execute' : { defaultFn : this._defExecFn,    emitFacade: true },","            'shift'   : { defaultFn : this._defShiftFn,   emitFacade: true },","            'add'     : { defaultFn : this._defAddFn,     emitFacade: true },","            'promote' : { defaultFn : this._defPromoteFn, emitFacade: true },","            'remove'  : { defaultFn : this._defRemoveFn,  emitFacade: true }","        });","    },","","    /**","     * Returns the next callback needing execution.  If a callback is","     * configured to repeat via iterations or until, it will be returned until","     * the completion criteria is met.","     *","     * When the queue is empty, null is returned.","     *","     * @method next","     * @return {Function} the callback to execute","     */","    next : function () {","        var callback;","","        while (this._q.length) {","            callback = this._q[0] = this._prepare(this._q[0]);","            if (callback && callback.until()) {","                this.fire(SHIFT, { callback: callback });","                callback = null;","            } else {","                break;","            }","        }","","        return callback || null;","    },","","    /**","     * Default functionality for the &quot;shift&quot; event.  Shifts the","     * callback stored in the event object's <em>callback</em> property from","     * the queue if it is the first item.","     *","     * @method _defShiftFn","     * @param e {Event} The event object","     * @protected","     */","    _defShiftFn : function (e) {","        if (this.indexOf(e.callback) === 0) {","            this._q.shift();","        }","    },","","    /**","     * Creates a wrapper function to execute the callback using the aggregated ","     * configuration generated by combining the static AsyncQueue.defaults, the","     * instance defaults, and the specified callback settings.","     *","     * The wrapper function is decorated with the callback configuration as","     * properties for runtime modification.","     *","     * @method _prepare","     * @param callback {Object|Function} the raw callback","     * @return {Function} a decorated function wrapper to execute the callback","     * @protected","     */","    _prepare: function (callback) {","        if (isFunction(callback) && callback._prepared) {","            return callback;","        }","","        var config = Y.merge(","            Queue.defaults,","            { context : this, args: [], _prepared: true },","            this.defaults,","            (isFunction(callback) ? { fn: callback } : callback)),","            ","            wrapper = Y.bind(function () {","                if (!wrapper._running) {","                    wrapper.iterations--;","                }","                if (isFunction(wrapper.fn)) {","                    wrapper.fn.apply(wrapper.context || Y,","                                     Y.Array(wrapper.args));","                }","            }, this);","            ","        return Y.mix(wrapper, config);","    },","","    /**","     * Sets the queue in motion.  All queued callbacks will be executed in","     * order unless pause() or stop() is called or if one of the callbacks is","     * configured with autoContinue: false.","     *","     * @method run","     * @return {AsyncQueue} the AsyncQueue instance","     * @chainable","     */","    run : function () {","        var callback,","            cont = true;","","        for (callback = this.next();","            cont && callback && !this.isRunning();","            callback = this.next())","        {","            cont = (callback.timeout < 0) ?","                this._execute(callback) :","                this._schedule(callback);","        }","","        if (!callback) {","            /**","             * Event fired after the last queued callback is executed.","             * @event complete","             */","            this.fire('complete');","        }","","        return this;","    },","","    /**","     * Handles the execution of callbacks. Returns a boolean indicating","     * whether it is appropriate to continue running.","     *","     * @method _execute","     * @param callback {Object} the callback object to execute","     * @return {Boolean} whether the run loop should continue","     * @protected","     */","    _execute : function (callback) {","        this._running = callback._running = true;","","        callback.iterations--;","        this.fire(EXECUTE, { callback: callback });","","        var cont = this._running && callback.autoContinue;","","        this._running = callback._running = false;","","        return cont;","    },","","    /**","     * Schedules the execution of asynchronous callbacks.","     *","     * @method _schedule","     * @param callback {Object} the callback object to execute","     * @return {Boolean} whether the run loop should continue","     * @protected","     */","    _schedule : function (callback) {","        this._running = Y.later(callback.timeout, this, function () {","            if (this._execute(callback)) {","                this.run();","            }","        });","","        return false;","    },","","    /**","     * Determines if the queue is waiting for a callback to complete execution.","     *","     * @method isRunning","     * @return {Boolean} true if queue is waiting for a ","     *                   from any initiated transactions","     */","    isRunning : function () {","        return !!this._running;","    },","","    /**","     * Default functionality for the &quot;execute&quot; event.  Executes the","     * callback function","     *","     * @method _defExecFn","     * @param e {Event} the event object","     * @protected","     */","    _defExecFn : function (e) {","        e.callback();","    },","","    /**","     * Add any number of callbacks to the end of the queue. Callbacks may be","     * provided as functions or objects.","     *","     * @method add","     * @param callback* {Function|Object} 0..n callbacks","     * @return {AsyncQueue} the AsyncQueue instance","     * @chainable","     */","    add : function () {","        this.fire('add', { callbacks: Y.Array(arguments,0,true) });","","        return this;","    },","","    /**","     * Default functionality for the &quot;add&quot; event.  Adds the callbacks","     * in the event facade to the queue. Callbacks successfully added to the","     * queue are present in the event's <code>added</code> property in the","     * after phase.","     *","     * @method _defAddFn","     * @param e {Event} the event object","     * @protected","     */","    _defAddFn : function(e) {","        var _q = this._q,","            added = [];","","        Y.Array.each(e.callbacks, function (c) {","            if (isObject(c)) {","                _q.push(c);","                added.push(c);","            }","        });","","        e.added = added;","    },","","    /**","     * Pause the execution of the queue after the execution of the current","     * callback completes.  If called from code outside of a queued callback,","     * clears the timeout for the pending callback. Paused queue can be","     * restarted with q.run()","     *","     * @method pause","     * @return {AsyncQueue} the AsyncQueue instance","     * @chainable","     */","    pause: function () {","        if (isObject(this._running)) {","            this._running.cancel();","        }","","        this._running = false;","","        return this;","    },","","    /**","     * Stop and clear the queue after the current execution of the","     * current callback completes.","     *","     * @method stop","     * @return {AsyncQueue} the AsyncQueue instance","     * @chainable","     */","    stop : function () { ","        this._q = [];","","        return this.pause();","    },","","    /** ","     * Returns the current index of a callback.  Pass in either the id or","     * callback function from getCallback.","     *","     * @method indexOf","     * @param callback {String|Function} the callback or its specified id","     * @return {Number} index of the callback or -1 if not found","     */","    indexOf : function (callback) {","        var i = 0, len = this._q.length, c;","","        for (; i < len; ++i) {","            c = this._q[i];","            if (c === callback || c.id === callback) {","                return i;","            }","        }","","        return -1;","    },","","    /**","     * Retrieve a callback by its id.  Useful to modify the configuration","     * while the queue is running.","     *","     * @method getCallback","     * @param id {String} the id assigned to the callback","     * @return {Object} the callback object","     */","    getCallback : function (id) {","        var i = this.indexOf(id);","","        return (i > -1) ? this._q[i] : null;","    },","","    /**","     * Promotes the named callback to the top of the queue. If a callback is","     * currently executing or looping (via until or iterations), the promotion","     * is scheduled to occur after the current callback has completed.","     *","     * @method promote","     * @param callback {String|Object} the callback object or a callback's id","     * @return {AsyncQueue} the AsyncQueue instance","     * @chainable","     */","    promote : function (callback) {","        var payload = { callback : callback },e;","","        if (this.isRunning()) {","            e = this.after(SHIFT, function () {","                    this.fire(PROMOTE, payload);","                    e.detach();","                }, this);","        } else {","            this.fire(PROMOTE, payload);","        }","","        return this;","    },","","    /**","     * <p>Default functionality for the &quot;promote&quot; event.  Promotes the","     * named callback to the head of the queue.</p>","     *","     * <p>The event object will contain a property &quot;callback&quot;, which","     * holds the id of a callback or the callback object itself.</p>","     *","     * @method _defPromoteFn","     * @param e {Event} the custom event","     * @protected","     */","    _defPromoteFn : function (e) {","        var i = this.indexOf(e.callback),","            promoted = (i > -1) ? this._q.splice(i,1)[0] : null;","","        e.promoted = promoted;","","        if (promoted) {","            this._q.unshift(promoted);","        }","    },","","    /**","     * Removes the callback from the queue.  If the queue is active, the","     * removal is scheduled to occur after the current callback has completed.","     *","     * @method remove","     * @param callback {String|Object} the callback object or a callback's id","     * @return {AsyncQueue} the AsyncQueue instance","     * @chainable","     */","    remove : function (callback) {","        var payload = { callback : callback },e;","","        // Can't return the removed callback because of the deferral until","        // current callback is complete","        if (this.isRunning()) {","            e = this.after(SHIFT, function () {","                    this.fire(REMOVE, payload);","                    e.detach();","                },this);","        } else {","            this.fire(REMOVE, payload);","        }","","        return this;","    },","","    /**","     * <p>Default functionality for the &quot;remove&quot; event.  Removes the","     * callback from the queue.</p>","     *","     * <p>The event object will contain a property &quot;callback&quot;, which","     * holds the id of a callback or the callback object itself.</p>","     *","     * @method _defRemoveFn","     * @param e {Event} the custom event","     * @protected","     */","    _defRemoveFn : function (e) {","        var i = this.indexOf(e.callback);","","        e.removed = (i > -1) ? this._q.splice(i,1)[0] : null;","    },","","    /**","     * Returns the number of callbacks in the queue.","     *","     * @method size","     * @return {Number}","     */","    size : function () {","        // next() flushes callbacks that have met their until() criteria and","        // therefore shouldn't count since they wouldn't execute anyway.","        if (!this.isRunning()) {","            this.next();","        }","","        return this._q.length;","    }","});","","","","}, '3.7.3', {\"requires\": [\"event-custom\"]});"];
_yuitest_coverage["build/async-queue/async-queue.js"].lines = {"1":0,"41":0,"42":0,"43":0,"46":0,"70":0,"75":0,"76":0,"80":0,"99":0,"101":0,"110":0,"112":0,"122":0,"142":0,"144":0,"145":0,"146":0,"147":0,"148":0,"150":0,"154":0,"167":0,"168":0,"186":0,"187":0,"190":0,"197":0,"198":0,"200":0,"201":0,"206":0,"219":0,"222":0,"226":0,"231":0,"236":0,"239":0,"252":0,"254":0,"255":0,"257":0,"259":0,"261":0,"273":0,"274":0,"275":0,"279":0,"290":0,"302":0,"315":0,"317":0,"331":0,"334":0,"335":0,"336":0,"337":0,"341":0,"355":0,"356":0,"359":0,"361":0,"373":0,"375":0,"387":0,"389":0,"390":0,"391":0,"392":0,"396":0,"408":0,"410":0,"424":0,"426":0,"427":0,"428":0,"429":0,"432":0,"435":0,"450":0,"453":0,"455":0,"456":0,"470":0,"474":0,"475":0,"476":0,"477":0,"480":0,"483":0,"498":0,"500":0,"512":0,"513":0,"516":0};
_yuitest_coverage["build/async-queue/async-queue.js"].functions = {"AsyncQueue:41":0,"until:74":0,"_init:98":0,"_initEvents:121":0,"next:141":0,"_defShiftFn:166":0,"(anonymous 2):196":0,"_prepare:185":0,"run:218":0,"_execute:251":0,"(anonymous 3):273":0,"_schedule:272":0,"isRunning:289":0,"_defExecFn:301":0,"add:314":0,"(anonymous 4):334":0,"_defAddFn:330":0,"pause:354":0,"stop:372":0,"indexOf:386":0,"getCallback:407":0,"(anonymous 5):427":0,"promote:423":0,"_defPromoteFn:449":0,"(anonymous 6):475":0,"remove:469":0,"_defRemoveFn:497":0,"size:509":0,"(anonymous 1):1":0};
_yuitest_coverage["build/async-queue/async-queue.js"].coveredLines = 95;
_yuitest_coverage["build/async-queue/async-queue.js"].coveredFunctions = 29;
_yuitest_coverline("build/async-queue/async-queue.js", 1);
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
_yuitest_coverfunc("build/async-queue/async-queue.js", "(anonymous 1)", 1);
_yuitest_coverline("build/async-queue/async-queue.js", 41);
Y.AsyncQueue = function() {
    _yuitest_coverfunc("build/async-queue/async-queue.js", "AsyncQueue", 41);
_yuitest_coverline("build/async-queue/async-queue.js", 42);
this._init();
    _yuitest_coverline("build/async-queue/async-queue.js", 43);
this.add.apply(this, arguments);
};

_yuitest_coverline("build/async-queue/async-queue.js", 46);
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
_yuitest_coverline("build/async-queue/async-queue.js", 70);
Queue.defaults = Y.mix({
    autoContinue : true,
    iterations   : 1,
    timeout      : 10,
    until        : function () {
        _yuitest_coverfunc("build/async-queue/async-queue.js", "until", 74);
_yuitest_coverline("build/async-queue/async-queue.js", 75);
this.iterations |= 0;
        _yuitest_coverline("build/async-queue/async-queue.js", 76);
return this.iterations <= 0;
    }
}, Y.config.queueDefaults || {});

_yuitest_coverline("build/async-queue/async-queue.js", 80);
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
        _yuitest_coverfunc("build/async-queue/async-queue.js", "_init", 98);
_yuitest_coverline("build/async-queue/async-queue.js", 99);
Y.EventTarget.call(this, { prefix: 'queue', emitFacade: true });

        _yuitest_coverline("build/async-queue/async-queue.js", 101);
this._q = [];

        /** 
         * Callback defaults for this instance.  Static defaults that are not
         * overridden are also included.
         *
         * @property defaults
         * @type {Object}
         */
        _yuitest_coverline("build/async-queue/async-queue.js", 110);
this.defaults = {};

        _yuitest_coverline("build/async-queue/async-queue.js", 112);
this._initEvents();
    },

    /**
     * Initializes the instance events.
     *
     * @method _initEvents
     * @protected
     */
    _initEvents : function () {
        _yuitest_coverfunc("build/async-queue/async-queue.js", "_initEvents", 121);
_yuitest_coverline("build/async-queue/async-queue.js", 122);
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
        _yuitest_coverfunc("build/async-queue/async-queue.js", "next", 141);
_yuitest_coverline("build/async-queue/async-queue.js", 142);
var callback;

        _yuitest_coverline("build/async-queue/async-queue.js", 144);
while (this._q.length) {
            _yuitest_coverline("build/async-queue/async-queue.js", 145);
callback = this._q[0] = this._prepare(this._q[0]);
            _yuitest_coverline("build/async-queue/async-queue.js", 146);
if (callback && callback.until()) {
                _yuitest_coverline("build/async-queue/async-queue.js", 147);
this.fire(SHIFT, { callback: callback });
                _yuitest_coverline("build/async-queue/async-queue.js", 148);
callback = null;
            } else {
                _yuitest_coverline("build/async-queue/async-queue.js", 150);
break;
            }
        }

        _yuitest_coverline("build/async-queue/async-queue.js", 154);
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
        _yuitest_coverfunc("build/async-queue/async-queue.js", "_defShiftFn", 166);
_yuitest_coverline("build/async-queue/async-queue.js", 167);
if (this.indexOf(e.callback) === 0) {
            _yuitest_coverline("build/async-queue/async-queue.js", 168);
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
        _yuitest_coverfunc("build/async-queue/async-queue.js", "_prepare", 185);
_yuitest_coverline("build/async-queue/async-queue.js", 186);
if (isFunction(callback) && callback._prepared) {
            _yuitest_coverline("build/async-queue/async-queue.js", 187);
return callback;
        }

        _yuitest_coverline("build/async-queue/async-queue.js", 190);
var config = Y.merge(
            Queue.defaults,
            { context : this, args: [], _prepared: true },
            this.defaults,
            (isFunction(callback) ? { fn: callback } : callback)),
            
            wrapper = Y.bind(function () {
                _yuitest_coverfunc("build/async-queue/async-queue.js", "(anonymous 2)", 196);
_yuitest_coverline("build/async-queue/async-queue.js", 197);
if (!wrapper._running) {
                    _yuitest_coverline("build/async-queue/async-queue.js", 198);
wrapper.iterations--;
                }
                _yuitest_coverline("build/async-queue/async-queue.js", 200);
if (isFunction(wrapper.fn)) {
                    _yuitest_coverline("build/async-queue/async-queue.js", 201);
wrapper.fn.apply(wrapper.context || Y,
                                     Y.Array(wrapper.args));
                }
            }, this);
            
        _yuitest_coverline("build/async-queue/async-queue.js", 206);
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
        _yuitest_coverfunc("build/async-queue/async-queue.js", "run", 218);
_yuitest_coverline("build/async-queue/async-queue.js", 219);
var callback,
            cont = true;

        _yuitest_coverline("build/async-queue/async-queue.js", 222);
for (callback = this.next();
            cont && callback && !this.isRunning();
            callback = this.next())
        {
            _yuitest_coverline("build/async-queue/async-queue.js", 226);
cont = (callback.timeout < 0) ?
                this._execute(callback) :
                this._schedule(callback);
        }

        _yuitest_coverline("build/async-queue/async-queue.js", 231);
if (!callback) {
            /**
             * Event fired after the last queued callback is executed.
             * @event complete
             */
            _yuitest_coverline("build/async-queue/async-queue.js", 236);
this.fire('complete');
        }

        _yuitest_coverline("build/async-queue/async-queue.js", 239);
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
        _yuitest_coverfunc("build/async-queue/async-queue.js", "_execute", 251);
_yuitest_coverline("build/async-queue/async-queue.js", 252);
this._running = callback._running = true;

        _yuitest_coverline("build/async-queue/async-queue.js", 254);
callback.iterations--;
        _yuitest_coverline("build/async-queue/async-queue.js", 255);
this.fire(EXECUTE, { callback: callback });

        _yuitest_coverline("build/async-queue/async-queue.js", 257);
var cont = this._running && callback.autoContinue;

        _yuitest_coverline("build/async-queue/async-queue.js", 259);
this._running = callback._running = false;

        _yuitest_coverline("build/async-queue/async-queue.js", 261);
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
        _yuitest_coverfunc("build/async-queue/async-queue.js", "_schedule", 272);
_yuitest_coverline("build/async-queue/async-queue.js", 273);
this._running = Y.later(callback.timeout, this, function () {
            _yuitest_coverfunc("build/async-queue/async-queue.js", "(anonymous 3)", 273);
_yuitest_coverline("build/async-queue/async-queue.js", 274);
if (this._execute(callback)) {
                _yuitest_coverline("build/async-queue/async-queue.js", 275);
this.run();
            }
        });

        _yuitest_coverline("build/async-queue/async-queue.js", 279);
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
        _yuitest_coverfunc("build/async-queue/async-queue.js", "isRunning", 289);
_yuitest_coverline("build/async-queue/async-queue.js", 290);
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
        _yuitest_coverfunc("build/async-queue/async-queue.js", "_defExecFn", 301);
_yuitest_coverline("build/async-queue/async-queue.js", 302);
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
        _yuitest_coverfunc("build/async-queue/async-queue.js", "add", 314);
_yuitest_coverline("build/async-queue/async-queue.js", 315);
this.fire('add', { callbacks: Y.Array(arguments,0,true) });

        _yuitest_coverline("build/async-queue/async-queue.js", 317);
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
        _yuitest_coverfunc("build/async-queue/async-queue.js", "_defAddFn", 330);
_yuitest_coverline("build/async-queue/async-queue.js", 331);
var _q = this._q,
            added = [];

        _yuitest_coverline("build/async-queue/async-queue.js", 334);
Y.Array.each(e.callbacks, function (c) {
            _yuitest_coverfunc("build/async-queue/async-queue.js", "(anonymous 4)", 334);
_yuitest_coverline("build/async-queue/async-queue.js", 335);
if (isObject(c)) {
                _yuitest_coverline("build/async-queue/async-queue.js", 336);
_q.push(c);
                _yuitest_coverline("build/async-queue/async-queue.js", 337);
added.push(c);
            }
        });

        _yuitest_coverline("build/async-queue/async-queue.js", 341);
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
        _yuitest_coverfunc("build/async-queue/async-queue.js", "pause", 354);
_yuitest_coverline("build/async-queue/async-queue.js", 355);
if (isObject(this._running)) {
            _yuitest_coverline("build/async-queue/async-queue.js", 356);
this._running.cancel();
        }

        _yuitest_coverline("build/async-queue/async-queue.js", 359);
this._running = false;

        _yuitest_coverline("build/async-queue/async-queue.js", 361);
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
        _yuitest_coverfunc("build/async-queue/async-queue.js", "stop", 372);
_yuitest_coverline("build/async-queue/async-queue.js", 373);
this._q = [];

        _yuitest_coverline("build/async-queue/async-queue.js", 375);
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
        _yuitest_coverfunc("build/async-queue/async-queue.js", "indexOf", 386);
_yuitest_coverline("build/async-queue/async-queue.js", 387);
var i = 0, len = this._q.length, c;

        _yuitest_coverline("build/async-queue/async-queue.js", 389);
for (; i < len; ++i) {
            _yuitest_coverline("build/async-queue/async-queue.js", 390);
c = this._q[i];
            _yuitest_coverline("build/async-queue/async-queue.js", 391);
if (c === callback || c.id === callback) {
                _yuitest_coverline("build/async-queue/async-queue.js", 392);
return i;
            }
        }

        _yuitest_coverline("build/async-queue/async-queue.js", 396);
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
        _yuitest_coverfunc("build/async-queue/async-queue.js", "getCallback", 407);
_yuitest_coverline("build/async-queue/async-queue.js", 408);
var i = this.indexOf(id);

        _yuitest_coverline("build/async-queue/async-queue.js", 410);
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
        _yuitest_coverfunc("build/async-queue/async-queue.js", "promote", 423);
_yuitest_coverline("build/async-queue/async-queue.js", 424);
var payload = { callback : callback },e;

        _yuitest_coverline("build/async-queue/async-queue.js", 426);
if (this.isRunning()) {
            _yuitest_coverline("build/async-queue/async-queue.js", 427);
e = this.after(SHIFT, function () {
                    _yuitest_coverfunc("build/async-queue/async-queue.js", "(anonymous 5)", 427);
_yuitest_coverline("build/async-queue/async-queue.js", 428);
this.fire(PROMOTE, payload);
                    _yuitest_coverline("build/async-queue/async-queue.js", 429);
e.detach();
                }, this);
        } else {
            _yuitest_coverline("build/async-queue/async-queue.js", 432);
this.fire(PROMOTE, payload);
        }

        _yuitest_coverline("build/async-queue/async-queue.js", 435);
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
        _yuitest_coverfunc("build/async-queue/async-queue.js", "_defPromoteFn", 449);
_yuitest_coverline("build/async-queue/async-queue.js", 450);
var i = this.indexOf(e.callback),
            promoted = (i > -1) ? this._q.splice(i,1)[0] : null;

        _yuitest_coverline("build/async-queue/async-queue.js", 453);
e.promoted = promoted;

        _yuitest_coverline("build/async-queue/async-queue.js", 455);
if (promoted) {
            _yuitest_coverline("build/async-queue/async-queue.js", 456);
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
        _yuitest_coverfunc("build/async-queue/async-queue.js", "remove", 469);
_yuitest_coverline("build/async-queue/async-queue.js", 470);
var payload = { callback : callback },e;

        // Can't return the removed callback because of the deferral until
        // current callback is complete
        _yuitest_coverline("build/async-queue/async-queue.js", 474);
if (this.isRunning()) {
            _yuitest_coverline("build/async-queue/async-queue.js", 475);
e = this.after(SHIFT, function () {
                    _yuitest_coverfunc("build/async-queue/async-queue.js", "(anonymous 6)", 475);
_yuitest_coverline("build/async-queue/async-queue.js", 476);
this.fire(REMOVE, payload);
                    _yuitest_coverline("build/async-queue/async-queue.js", 477);
e.detach();
                },this);
        } else {
            _yuitest_coverline("build/async-queue/async-queue.js", 480);
this.fire(REMOVE, payload);
        }

        _yuitest_coverline("build/async-queue/async-queue.js", 483);
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
        _yuitest_coverfunc("build/async-queue/async-queue.js", "_defRemoveFn", 497);
_yuitest_coverline("build/async-queue/async-queue.js", 498);
var i = this.indexOf(e.callback);

        _yuitest_coverline("build/async-queue/async-queue.js", 500);
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
        _yuitest_coverfunc("build/async-queue/async-queue.js", "size", 509);
_yuitest_coverline("build/async-queue/async-queue.js", 512);
if (!this.isRunning()) {
            _yuitest_coverline("build/async-queue/async-queue.js", 513);
this.next();
        }

        _yuitest_coverline("build/async-queue/async-queue.js", 516);
return this._q.length;
    }
});



}, '3.7.3', {"requires": ["event-custom"]});
