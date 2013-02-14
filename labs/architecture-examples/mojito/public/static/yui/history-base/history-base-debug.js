/*
YUI 3.7.3 (build 5687)
Copyright 2012 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/
YUI.add('history-base', function (Y, NAME) {

/**
 * Provides browser history management functionality using a simple
 * add/replace/get paradigm. This can be used to ensure that the browser's back
 * and forward buttons work as the user expects and to provide bookmarkable URLs
 * that return the user to the current application state, even in an Ajax
 * application that doesn't perform full-page refreshes.
 *
 * @module history
 * @main history
 * @since 3.2.0
 */

/**
 * Provides global state management backed by an object, but with no browser
 * history integration. For actual browser history integration and back/forward
 * support, use the history-html5 or history-hash modules.
 *
 * @module history
 * @submodule history-base
 * @class HistoryBase
 * @uses EventTarget
 * @constructor
 * @param {Object} config (optional) configuration object, which may contain
 *   zero or more of the following properties:
 *
 * <dl>
 *   <dt>force (Boolean)</dt>
 *   <dd>
 *     If `true`, a `history:change` event will be fired whenever the URL
 *     changes, even if there is no associated state change. Default is `false`.
 *   </dd>
 *
 *   <dt>initialState (Object)</dt>
 *   <dd>
 *     Initial state to set, as an object hash of key/value pairs. This will be
 *     merged into the current global state.
 *   </dd>
 * </dl>
 */

var Lang      = Y.Lang,
    Obj       = Y.Object,
    GlobalEnv = YUI.namespace('Env.History'),
    YArray    = Y.Array,

    doc       = Y.config.doc,
    docMode   = doc.documentMode,
    win       = Y.config.win,

    DEFAULT_OPTIONS = {merge: true},
    EVT_CHANGE      = 'change',
    SRC_ADD         = 'add',
    SRC_REPLACE     = 'replace';

function HistoryBase() {
    this._init.apply(this, arguments);
}

Y.augment(HistoryBase, Y.EventTarget, null, null, {
    emitFacade : true,
    prefix     : 'history',
    preventable: false,
    queueable  : true
});

if (!GlobalEnv._state) {
    GlobalEnv._state = {};
}

// -- Private Methods ----------------------------------------------------------

/**
 * Returns <code>true</code> if <i>value</i> is a simple object and not a
 * function or an array.
 *
 * @method _isSimpleObject
 * @param {mixed} value
 * @return {Boolean}
 * @private
 */
function _isSimpleObject(value) {
    return Lang.type(value) === 'object';
}

// -- Public Static Properties -------------------------------------------------

/**
 * Name of this component.
 *
 * @property NAME
 * @type String
 * @static
 */
HistoryBase.NAME = 'historyBase';

/**
 * Constant used to identify state changes originating from the
 * <code>add()</code> method.
 *
 * @property SRC_ADD
 * @type String
 * @static
 * @final
 */
HistoryBase.SRC_ADD = SRC_ADD;

/**
 * Constant used to identify state changes originating from the
 * <code>replace()</code> method.
 *
 * @property SRC_REPLACE
 * @type String
 * @static
 * @final
 */
HistoryBase.SRC_REPLACE = SRC_REPLACE;

/**
 * Whether or not this browser supports the HTML5 History API.
 *
 * @property html5
 * @type Boolean
 * @static
 */

// All HTML5-capable browsers except Gecko 2+ (Firefox 4+) correctly return
// true for 'onpopstate' in win. In order to support Gecko 2, we fall back to a
// UA sniff for now. (current as of Firefox 4.0b2)
HistoryBase.html5 = !!(win.history && win.history.pushState &&
        win.history.replaceState && ('onpopstate' in win || Y.UA.gecko >= 2) &&
        (!Y.UA.android || Y.UA.android >= 2.4));

/**
 * Whether or not this browser supports the <code>window.onhashchange</code>
 * event natively. Note that even if this is <code>true</code>, you may
 * still want to use HistoryHash's synthetic <code>hashchange</code> event
 * since it normalizes implementation differences and fixes spec violations
 * across various browsers.
 *
 * @property nativeHashChange
 * @type Boolean
 * @static
 */

// Most browsers that support hashchange expose it on the window. Opera 10.6+
// exposes it on the document (but you can still attach to it on the window).
//
// IE8 supports the hashchange event, but only in IE8 Standards
// Mode. However, IE8 in IE7 compatibility mode still defines the
// event but never fires it, so we can't just detect the event. We also can't
// just UA sniff for IE8, since other browsers support this event as well.
HistoryBase.nativeHashChange = ('onhashchange' in win || 'onhashchange' in doc) &&
        (!docMode || docMode > 7);

Y.mix(HistoryBase.prototype, {
    // -- Initialization -------------------------------------------------------

    /**
     * Initializes this HistoryBase instance. This method is called by the
     * constructor.
     *
     * @method _init
     * @param {Object} config configuration object
     * @protected
     */
    _init: function (config) {
        var initialState;

        /**
         * Configuration object provided by the user on instantiation, or an
         * empty object if one wasn't provided.
         *
         * @property _config
         * @type Object
         * @default {}
         * @protected
         */
        config = this._config = config || {};

        /**
         * If `true`, a `history:change` event will be fired whenever the URL
         * changes, even if there is no associated state change.
         *
         * @property force
         * @type Boolean
         * @default false
         */
         this.force = !!config.force;

        /**
         * Resolved initial state: a merge of the user-supplied initial state
         * (if any) and any initial state provided by a subclass. This may
         * differ from <code>_config.initialState</code>. If neither the config
         * nor a subclass supplies an initial state, this property will be
         * <code>null</code>.
         *
         * @property _initialState
         * @type Object|null
         * @default {}
         * @protected
         */
        initialState = this._initialState = this._initialState ||
                config.initialState || null;

        /**
         * Fired when the state changes. To be notified of all state changes
         * regardless of the History or YUI instance that generated them,
         * subscribe to this event on <code>Y.Global</code>. If you would rather
         * be notified only about changes generated by this specific History
         * instance, subscribe to this event on the instance.
         *
         * @event history:change
         * @param {EventFacade} e Event facade with the following additional
         *   properties:
         *
         * <dl>
         *   <dt>changed (Object)</dt>
         *   <dd>
         *     Object hash of state items that have been added or changed. The
         *     key is the item key, and the value is an object containing
         *     <code>newVal</code> and <code>prevVal</code> properties
         *     representing the values of the item both before and after the
         *     change. If the item was newly added, <code>prevVal</code> will be
         *     <code>undefined</code>.
         *   </dd>
         *
         *   <dt>newVal (Object)</dt>
         *   <dd>
         *     Object hash of key/value pairs of all state items after the
         *     change.
         *   </dd>
         *
         *   <dt>prevVal (Object)</dt>
         *   <dd>
         *     Object hash of key/value pairs of all state items before the
         *     change.
         *   </dd>
         *
         *   <dt>removed (Object)</dt>
         *   <dd>
         *     Object hash of key/value pairs of state items that have been
         *     removed. Values are the old values prior to removal.
         *   </dd>
         *
         *   <dt>src (String)</dt>
         *   <dd>
         *     The source of the event. This can be used to selectively ignore
         *     events generated by certain sources.
         *   </dd>
         * </dl>
         */
        this.publish(EVT_CHANGE, {
            broadcast: 2,
            defaultFn: this._defChangeFn
        });

        // If initialState was provided, merge it into the current state.
        if (initialState) {
            this.replace(initialState);
        }
    },

    // -- Public Methods -------------------------------------------------------

    /**
     * Adds a state entry with new values for the specified keys. By default,
     * the new state will be merged into the existing state, and new values will
     * override existing values. Specifying a <code>null</code> or
     * <code>undefined</code> value will cause that key to be removed from the
     * new state entry.
     *
     * @method add
     * @param {Object} state Object hash of key/value pairs.
     * @param {Object} options (optional) Zero or more of the following options:
     *   <dl>
     *     <dt>merge (Boolean)</dt>
     *     <dd>
     *       <p>
     *       If <code>true</code> (the default), the new state will be merged
     *       into the existing state. New values will override existing values,
     *       and <code>null</code> or <code>undefined</code> values will be
     *       removed from the state.
     *       </p>
     *
     *       <p>
     *       If <code>false</code>, the existing state will be discarded as a
     *       whole and the new state will take its place.
     *       </p>
     *     </dd>
     *   </dl>
     * @chainable
     */
    add: function () {
        var args = YArray(arguments, 0, true);
        args.unshift(SRC_ADD);
        return this._change.apply(this, args);
    },

    /**
     * Adds a state entry with a new value for a single key. By default, the new
     * value will be merged into the existing state values, and will override an
     * existing value with the same key if there is one. Specifying a
     * <code>null</code> or <code>undefined</code> value will cause the key to
     * be removed from the new state entry.
     *
     * @method addValue
     * @param {String} key State parameter key.
     * @param {String} value New value.
     * @param {Object} options (optional) Zero or more options. See
     *   <code>add()</code> for a list of supported options.
     * @chainable
     */
    addValue: function (key, value, options) {
        var state = {};
        state[key] = value;
        return this._change(SRC_ADD, state, options);
    },

    /**
     * Returns the current value of the state parameter specified by <i>key</i>,
     * or an object hash of key/value pairs for all current state parameters if
     * no key is specified.
     *
     * @method get
     * @param {String} key (optional) State parameter key.
     * @return {Object|String} Value of the specified state parameter, or an
     *   object hash of key/value pairs for all current state parameters.
     */
    get: function (key) {
        var state    = GlobalEnv._state,
            isObject = _isSimpleObject(state);

        if (key) {
            return isObject && Obj.owns(state, key) ? state[key] : undefined;
        } else {
            return isObject ? Y.mix({}, state, true) : state; // mix provides a fast shallow clone.
        }
    },

    /**
     * Same as <code>add()</code> except that a new browser history entry will
     * not be created. Instead, the current history entry will be replaced with
     * the new state.
     *
     * @method replace
     * @param {Object} state Object hash of key/value pairs.
     * @param {Object} options (optional) Zero or more options. See
     *   <code>add()</code> for a list of supported options.
     * @chainable
     */
    replace: function () {
        var args = YArray(arguments, 0, true);
        args.unshift(SRC_REPLACE);
        return this._change.apply(this, args);
    },

    /**
     * Same as <code>addValue()</code> except that a new browser history entry
     * will not be created. Instead, the current history entry will be replaced
     * with the new state.
     *
     * @method replaceValue
     * @param {String} key State parameter key.
     * @param {String} value New value.
     * @param {Object} options (optional) Zero or more options. See
     *   <code>add()</code> for a list of supported options.
     * @chainable
     */
    replaceValue: function (key, value, options) {
        var state = {};
        state[key] = value;
        return this._change(SRC_REPLACE, state, options);
    },

    // -- Protected Methods ----------------------------------------------------

    /**
     * Changes the state. This method provides a common implementation shared by
     * the public methods for changing state.
     *
     * @method _change
     * @param {String} src Source of the change, for inclusion in event facades
     *   to facilitate filtering.
     * @param {Object} state Object hash of key/value pairs.
     * @param {Object} options (optional) Zero or more options. See
     *   <code>add()</code> for a list of supported options.
     * @protected
     * @chainable
     */
    _change: function (src, state, options) {
        options = options ? Y.merge(DEFAULT_OPTIONS, options) : DEFAULT_OPTIONS;

        if (options.merge && _isSimpleObject(state) &&
                _isSimpleObject(GlobalEnv._state)) {
            state = Y.merge(GlobalEnv._state, state);
        }

        this._resolveChanges(src, state, options);
        return this;
    },

    /**
     * Called by _resolveChanges() when the state has changed. This method takes
     * care of actually firing the necessary events.
     *
     * @method _fireEvents
     * @param {String} src Source of the changes, for inclusion in event facades
     *   to facilitate filtering.
     * @param {Object} changes Resolved changes.
     * @param {Object} options Zero or more options. See <code>add()</code> for
     *   a list of supported options.
     * @protected
     */
    _fireEvents: function (src, changes, options) {
        // Fire the global change event.
        this.fire(EVT_CHANGE, {
            _options: options,
            changed : changes.changed,
            newVal  : changes.newState,
            prevVal : changes.prevState,
            removed : changes.removed,
            src     : src
        });

        // Fire change/remove events for individual items.
        Obj.each(changes.changed, function (value, key) {
            this._fireChangeEvent(src, key, value);
        }, this);

        Obj.each(changes.removed, function (value, key) {
            this._fireRemoveEvent(src, key, value);
        }, this);
    },

    /**
     * Fires a dynamic "[key]Change" event.
     *
     * @method _fireChangeEvent
     * @param {String} src source of the change, for inclusion in event facades
     *   to facilitate filtering
     * @param {String} key key of the item that was changed
     * @param {Object} value object hash containing <i>newVal</i> and
     *   <i>prevVal</i> properties for the changed item
     * @protected
     */
    _fireChangeEvent: function (src, key, value) {
        /**
         * <p>
         * Dynamic event fired when an individual history item is added or
         * changed. The name of this event depends on the name of the key that
         * changed. To listen to change events for a key named "foo", subscribe
         * to the <code>fooChange</code> event; for a key named "bar", subscribe
         * to <code>barChange</code>, etc.
         * </p>
         *
         * <p>
         * Key-specific events are only fired for instance-level changes; that
         * is, changes that were made via the same History instance on which the
         * event is subscribed. To be notified of changes made by other History
         * instances, subscribe to the global <code>history:change</code> event.
         * </p>
         *
         * @event [key]Change
         * @param {EventFacade} e Event facade with the following additional
         *   properties:
         *
         * <dl>
         *   <dt>newVal (mixed)</dt>
         *   <dd>
         *     The new value of the item after the change.
         *   </dd>
         *
         *   <dt>prevVal (mixed)</dt>
         *   <dd>
         *     The previous value of the item before the change, or
         *     <code>undefined</code> if the item was just added and has no
         *     previous value.
         *   </dd>
         *
         *   <dt>src (String)</dt>
         *   <dd>
         *     The source of the event. This can be used to selectively ignore
         *     events generated by certain sources.
         *   </dd>
         * </dl>
         */
        this.fire(key + 'Change', {
            newVal : value.newVal,
            prevVal: value.prevVal,
            src    : src
        });
    },

    /**
     * Fires a dynamic "[key]Remove" event.
     *
     * @method _fireRemoveEvent
     * @param {String} src source of the change, for inclusion in event facades
     *   to facilitate filtering
     * @param {String} key key of the item that was removed
     * @param {mixed} value value of the item prior to its removal
     * @protected
     */
    _fireRemoveEvent: function (src, key, value) {
        /**
         * <p>
         * Dynamic event fired when an individual history item is removed. The
         * name of this event depends on the name of the key that was removed.
         * To listen to remove events for a key named "foo", subscribe to the
         * <code>fooRemove</code> event; for a key named "bar", subscribe to
         * <code>barRemove</code>, etc.
         * </p>
         *
         * <p>
         * Key-specific events are only fired for instance-level changes; that
         * is, changes that were made via the same History instance on which the
         * event is subscribed. To be notified of changes made by other History
         * instances, subscribe to the global <code>history:change</code> event.
         * </p>
         *
         * @event [key]Remove
         * @param {EventFacade} e Event facade with the following additional
         *   properties:
         *
         * <dl>
         *   <dt>prevVal (mixed)</dt>
         *   <dd>
         *     The value of the item before it was removed.
         *   </dd>
         *
         *   <dt>src (String)</dt>
         *   <dd>
         *     The source of the event. This can be used to selectively ignore
         *     events generated by certain sources.
         *   </dd>
         * </dl>
         */
        this.fire(key + 'Remove', {
            prevVal: value,
            src    : src
        });
    },

    /**
     * Resolves the changes (if any) between <i>newState</i> and the current
     * state and fires appropriate events if things have changed.
     *
     * @method _resolveChanges
     * @param {String} src source of the changes, for inclusion in event facades
     *   to facilitate filtering
     * @param {Object} newState object hash of key/value pairs representing the
     *   new state
     * @param {Object} options Zero or more options. See <code>add()</code> for
     *   a list of supported options.
     * @protected
     */
    _resolveChanges: function (src, newState, options) {
        var changed   = {},
            isChanged,
            prevState = GlobalEnv._state,
            removed   = {};

        newState || (newState = {});
        options  || (options  = {});

        if (_isSimpleObject(newState) && _isSimpleObject(prevState)) {
            // Figure out what was added or changed.
            Obj.each(newState, function (newVal, key) {
                var prevVal = prevState[key];

                if (newVal !== prevVal) {
                    changed[key] = {
                        newVal : newVal,
                        prevVal: prevVal
                    };

                    isChanged = true;
                }
            }, this);

            // Figure out what was removed.
            Obj.each(prevState, function (prevVal, key) {
                if (!Obj.owns(newState, key) || newState[key] === null) {
                    delete newState[key];
                    removed[key] = prevVal;
                    isChanged = true;
                }
            }, this);
        } else {
            isChanged = newState !== prevState;
        }

        if (isChanged || this.force) {
            this._fireEvents(src, {
                changed  : changed,
                newState : newState,
                prevState: prevState,
                removed  : removed
            }, options);
        }
    },

    /**
     * Stores the specified state. Don't call this method directly; go through
     * _resolveChanges() to ensure that changes are resolved and all events are
     * fired properly.
     *
     * @method _storeState
     * @param {String} src source of the changes
     * @param {Object} newState new state to store
     * @param {Object} options Zero or more options. See <code>add()</code> for
     *   a list of supported options.
     * @protected
     */
    _storeState: function (src, newState) {
        // Note: the src and options params aren't used here, but they are used
        // by subclasses.
        GlobalEnv._state = newState || {};
    },

    // -- Protected Event Handlers ---------------------------------------------

    /**
     * Default <code>history:change</code> event handler.
     *
     * @method _defChangeFn
     * @param {EventFacade} e state change event facade
     * @protected
     */
    _defChangeFn: function (e) {
        this._storeState(e.src, e.newVal, e._options);
    }
}, true);

Y.HistoryBase = HistoryBase;


}, '3.7.3', {"requires": ["event-custom-complex"]});
