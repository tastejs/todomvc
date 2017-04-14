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
_yuitest_coverage["build/history-base/history-base.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/history-base/history-base.js",
    code: []
};
_yuitest_coverage["build/history-base/history-base.js"].code=["YUI.add('history-base', function (Y, NAME) {","","/**"," * Provides browser history management functionality using a simple"," * add/replace/get paradigm. This can be used to ensure that the browser's back"," * and forward buttons work as the user expects and to provide bookmarkable URLs"," * that return the user to the current application state, even in an Ajax"," * application that doesn't perform full-page refreshes."," *"," * @module history"," * @main history"," * @since 3.2.0"," */","","/**"," * Provides global state management backed by an object, but with no browser"," * history integration. For actual browser history integration and back/forward"," * support, use the history-html5 or history-hash modules."," *"," * @module history"," * @submodule history-base"," * @class HistoryBase"," * @uses EventTarget"," * @constructor"," * @param {Object} config (optional) configuration object, which may contain"," *   zero or more of the following properties:"," *"," * <dl>"," *   <dt>force (Boolean)</dt>"," *   <dd>"," *     If `true`, a `history:change` event will be fired whenever the URL"," *     changes, even if there is no associated state change. Default is `false`."," *   </dd>"," *"," *   <dt>initialState (Object)</dt>"," *   <dd>"," *     Initial state to set, as an object hash of key/value pairs. This will be"," *     merged into the current global state."," *   </dd>"," * </dl>"," */","","var Lang      = Y.Lang,","    Obj       = Y.Object,","    GlobalEnv = YUI.namespace('Env.History'),","    YArray    = Y.Array,","","    doc       = Y.config.doc,","    docMode   = doc.documentMode,","    win       = Y.config.win,","","    DEFAULT_OPTIONS = {merge: true},","    EVT_CHANGE      = 'change',","    SRC_ADD         = 'add',","    SRC_REPLACE     = 'replace';","","function HistoryBase() {","    this._init.apply(this, arguments);","}","","Y.augment(HistoryBase, Y.EventTarget, null, null, {","    emitFacade : true,","    prefix     : 'history',","    preventable: false,","    queueable  : true","});","","if (!GlobalEnv._state) {","    GlobalEnv._state = {};","}","","// -- Private Methods ----------------------------------------------------------","","/**"," * Returns <code>true</code> if <i>value</i> is a simple object and not a"," * function or an array."," *"," * @method _isSimpleObject"," * @param {mixed} value"," * @return {Boolean}"," * @private"," */","function _isSimpleObject(value) {","    return Lang.type(value) === 'object';","}","","// -- Public Static Properties -------------------------------------------------","","/**"," * Name of this component."," *"," * @property NAME"," * @type String"," * @static"," */","HistoryBase.NAME = 'historyBase';","","/**"," * Constant used to identify state changes originating from the"," * <code>add()</code> method."," *"," * @property SRC_ADD"," * @type String"," * @static"," * @final"," */","HistoryBase.SRC_ADD = SRC_ADD;","","/**"," * Constant used to identify state changes originating from the"," * <code>replace()</code> method."," *"," * @property SRC_REPLACE"," * @type String"," * @static"," * @final"," */","HistoryBase.SRC_REPLACE = SRC_REPLACE;","","/**"," * Whether or not this browser supports the HTML5 History API."," *"," * @property html5"," * @type Boolean"," * @static"," */","","// All HTML5-capable browsers except Gecko 2+ (Firefox 4+) correctly return","// true for 'onpopstate' in win. In order to support Gecko 2, we fall back to a","// UA sniff for now. (current as of Firefox 4.0b2)","HistoryBase.html5 = !!(win.history && win.history.pushState &&","        win.history.replaceState && ('onpopstate' in win || Y.UA.gecko >= 2) &&","        (!Y.UA.android || Y.UA.android >= 2.4));","","/**"," * Whether or not this browser supports the <code>window.onhashchange</code>"," * event natively. Note that even if this is <code>true</code>, you may"," * still want to use HistoryHash's synthetic <code>hashchange</code> event"," * since it normalizes implementation differences and fixes spec violations"," * across various browsers."," *"," * @property nativeHashChange"," * @type Boolean"," * @static"," */","","// Most browsers that support hashchange expose it on the window. Opera 10.6+","// exposes it on the document (but you can still attach to it on the window).","//","// IE8 supports the hashchange event, but only in IE8 Standards","// Mode. However, IE8 in IE7 compatibility mode still defines the","// event but never fires it, so we can't just detect the event. We also can't","// just UA sniff for IE8, since other browsers support this event as well.","HistoryBase.nativeHashChange = ('onhashchange' in win || 'onhashchange' in doc) &&","        (!docMode || docMode > 7);","","Y.mix(HistoryBase.prototype, {","    // -- Initialization -------------------------------------------------------","","    /**","     * Initializes this HistoryBase instance. This method is called by the","     * constructor.","     *","     * @method _init","     * @param {Object} config configuration object","     * @protected","     */","    _init: function (config) {","        var initialState;","","        /**","         * Configuration object provided by the user on instantiation, or an","         * empty object if one wasn't provided.","         *","         * @property _config","         * @type Object","         * @default {}","         * @protected","         */","        config = this._config = config || {};","","        /**","         * If `true`, a `history:change` event will be fired whenever the URL","         * changes, even if there is no associated state change.","         *","         * @property force","         * @type Boolean","         * @default false","         */","         this.force = !!config.force;","","        /**","         * Resolved initial state: a merge of the user-supplied initial state","         * (if any) and any initial state provided by a subclass. This may","         * differ from <code>_config.initialState</code>. If neither the config","         * nor a subclass supplies an initial state, this property will be","         * <code>null</code>.","         *","         * @property _initialState","         * @type Object|null","         * @default {}","         * @protected","         */","        initialState = this._initialState = this._initialState ||","                config.initialState || null;","","        /**","         * Fired when the state changes. To be notified of all state changes","         * regardless of the History or YUI instance that generated them,","         * subscribe to this event on <code>Y.Global</code>. If you would rather","         * be notified only about changes generated by this specific History","         * instance, subscribe to this event on the instance.","         *","         * @event history:change","         * @param {EventFacade} e Event facade with the following additional","         *   properties:","         *","         * <dl>","         *   <dt>changed (Object)</dt>","         *   <dd>","         *     Object hash of state items that have been added or changed. The","         *     key is the item key, and the value is an object containing","         *     <code>newVal</code> and <code>prevVal</code> properties","         *     representing the values of the item both before and after the","         *     change. If the item was newly added, <code>prevVal</code> will be","         *     <code>undefined</code>.","         *   </dd>","         *","         *   <dt>newVal (Object)</dt>","         *   <dd>","         *     Object hash of key/value pairs of all state items after the","         *     change.","         *   </dd>","         *","         *   <dt>prevVal (Object)</dt>","         *   <dd>","         *     Object hash of key/value pairs of all state items before the","         *     change.","         *   </dd>","         *","         *   <dt>removed (Object)</dt>","         *   <dd>","         *     Object hash of key/value pairs of state items that have been","         *     removed. Values are the old values prior to removal.","         *   </dd>","         *","         *   <dt>src (String)</dt>","         *   <dd>","         *     The source of the event. This can be used to selectively ignore","         *     events generated by certain sources.","         *   </dd>","         * </dl>","         */","        this.publish(EVT_CHANGE, {","            broadcast: 2,","            defaultFn: this._defChangeFn","        });","","        // If initialState was provided, merge it into the current state.","        if (initialState) {","            this.replace(initialState);","        }","    },","","    // -- Public Methods -------------------------------------------------------","","    /**","     * Adds a state entry with new values for the specified keys. By default,","     * the new state will be merged into the existing state, and new values will","     * override existing values. Specifying a <code>null</code> or","     * <code>undefined</code> value will cause that key to be removed from the","     * new state entry.","     *","     * @method add","     * @param {Object} state Object hash of key/value pairs.","     * @param {Object} options (optional) Zero or more of the following options:","     *   <dl>","     *     <dt>merge (Boolean)</dt>","     *     <dd>","     *       <p>","     *       If <code>true</code> (the default), the new state will be merged","     *       into the existing state. New values will override existing values,","     *       and <code>null</code> or <code>undefined</code> values will be","     *       removed from the state.","     *       </p>","     *","     *       <p>","     *       If <code>false</code>, the existing state will be discarded as a","     *       whole and the new state will take its place.","     *       </p>","     *     </dd>","     *   </dl>","     * @chainable","     */","    add: function () {","        var args = YArray(arguments, 0, true);","        args.unshift(SRC_ADD);","        return this._change.apply(this, args);","    },","","    /**","     * Adds a state entry with a new value for a single key. By default, the new","     * value will be merged into the existing state values, and will override an","     * existing value with the same key if there is one. Specifying a","     * <code>null</code> or <code>undefined</code> value will cause the key to","     * be removed from the new state entry.","     *","     * @method addValue","     * @param {String} key State parameter key.","     * @param {String} value New value.","     * @param {Object} options (optional) Zero or more options. See","     *   <code>add()</code> for a list of supported options.","     * @chainable","     */","    addValue: function (key, value, options) {","        var state = {};","        state[key] = value;","        return this._change(SRC_ADD, state, options);","    },","","    /**","     * Returns the current value of the state parameter specified by <i>key</i>,","     * or an object hash of key/value pairs for all current state parameters if","     * no key is specified.","     *","     * @method get","     * @param {String} key (optional) State parameter key.","     * @return {Object|String} Value of the specified state parameter, or an","     *   object hash of key/value pairs for all current state parameters.","     */","    get: function (key) {","        var state    = GlobalEnv._state,","            isObject = _isSimpleObject(state);","","        if (key) {","            return isObject && Obj.owns(state, key) ? state[key] : undefined;","        } else {","            return isObject ? Y.mix({}, state, true) : state; // mix provides a fast shallow clone.","        }","    },","","    /**","     * Same as <code>add()</code> except that a new browser history entry will","     * not be created. Instead, the current history entry will be replaced with","     * the new state.","     *","     * @method replace","     * @param {Object} state Object hash of key/value pairs.","     * @param {Object} options (optional) Zero or more options. See","     *   <code>add()</code> for a list of supported options.","     * @chainable","     */","    replace: function () {","        var args = YArray(arguments, 0, true);","        args.unshift(SRC_REPLACE);","        return this._change.apply(this, args);","    },","","    /**","     * Same as <code>addValue()</code> except that a new browser history entry","     * will not be created. Instead, the current history entry will be replaced","     * with the new state.","     *","     * @method replaceValue","     * @param {String} key State parameter key.","     * @param {String} value New value.","     * @param {Object} options (optional) Zero or more options. See","     *   <code>add()</code> for a list of supported options.","     * @chainable","     */","    replaceValue: function (key, value, options) {","        var state = {};","        state[key] = value;","        return this._change(SRC_REPLACE, state, options);","    },","","    // -- Protected Methods ----------------------------------------------------","","    /**","     * Changes the state. This method provides a common implementation shared by","     * the public methods for changing state.","     *","     * @method _change","     * @param {String} src Source of the change, for inclusion in event facades","     *   to facilitate filtering.","     * @param {Object} state Object hash of key/value pairs.","     * @param {Object} options (optional) Zero or more options. See","     *   <code>add()</code> for a list of supported options.","     * @protected","     * @chainable","     */","    _change: function (src, state, options) {","        options = options ? Y.merge(DEFAULT_OPTIONS, options) : DEFAULT_OPTIONS;","","        if (options.merge && _isSimpleObject(state) &&","                _isSimpleObject(GlobalEnv._state)) {","            state = Y.merge(GlobalEnv._state, state);","        }","","        this._resolveChanges(src, state, options);","        return this;","    },","","    /**","     * Called by _resolveChanges() when the state has changed. This method takes","     * care of actually firing the necessary events.","     *","     * @method _fireEvents","     * @param {String} src Source of the changes, for inclusion in event facades","     *   to facilitate filtering.","     * @param {Object} changes Resolved changes.","     * @param {Object} options Zero or more options. See <code>add()</code> for","     *   a list of supported options.","     * @protected","     */","    _fireEvents: function (src, changes, options) {","        // Fire the global change event.","        this.fire(EVT_CHANGE, {","            _options: options,","            changed : changes.changed,","            newVal  : changes.newState,","            prevVal : changes.prevState,","            removed : changes.removed,","            src     : src","        });","","        // Fire change/remove events for individual items.","        Obj.each(changes.changed, function (value, key) {","            this._fireChangeEvent(src, key, value);","        }, this);","","        Obj.each(changes.removed, function (value, key) {","            this._fireRemoveEvent(src, key, value);","        }, this);","    },","","    /**","     * Fires a dynamic \"[key]Change\" event.","     *","     * @method _fireChangeEvent","     * @param {String} src source of the change, for inclusion in event facades","     *   to facilitate filtering","     * @param {String} key key of the item that was changed","     * @param {Object} value object hash containing <i>newVal</i> and","     *   <i>prevVal</i> properties for the changed item","     * @protected","     */","    _fireChangeEvent: function (src, key, value) {","        /**","         * <p>","         * Dynamic event fired when an individual history item is added or","         * changed. The name of this event depends on the name of the key that","         * changed. To listen to change events for a key named \"foo\", subscribe","         * to the <code>fooChange</code> event; for a key named \"bar\", subscribe","         * to <code>barChange</code>, etc.","         * </p>","         *","         * <p>","         * Key-specific events are only fired for instance-level changes; that","         * is, changes that were made via the same History instance on which the","         * event is subscribed. To be notified of changes made by other History","         * instances, subscribe to the global <code>history:change</code> event.","         * </p>","         *","         * @event [key]Change","         * @param {EventFacade} e Event facade with the following additional","         *   properties:","         *","         * <dl>","         *   <dt>newVal (mixed)</dt>","         *   <dd>","         *     The new value of the item after the change.","         *   </dd>","         *","         *   <dt>prevVal (mixed)</dt>","         *   <dd>","         *     The previous value of the item before the change, or","         *     <code>undefined</code> if the item was just added and has no","         *     previous value.","         *   </dd>","         *","         *   <dt>src (String)</dt>","         *   <dd>","         *     The source of the event. This can be used to selectively ignore","         *     events generated by certain sources.","         *   </dd>","         * </dl>","         */","        this.fire(key + 'Change', {","            newVal : value.newVal,","            prevVal: value.prevVal,","            src    : src","        });","    },","","    /**","     * Fires a dynamic \"[key]Remove\" event.","     *","     * @method _fireRemoveEvent","     * @param {String} src source of the change, for inclusion in event facades","     *   to facilitate filtering","     * @param {String} key key of the item that was removed","     * @param {mixed} value value of the item prior to its removal","     * @protected","     */","    _fireRemoveEvent: function (src, key, value) {","        /**","         * <p>","         * Dynamic event fired when an individual history item is removed. The","         * name of this event depends on the name of the key that was removed.","         * To listen to remove events for a key named \"foo\", subscribe to the","         * <code>fooRemove</code> event; for a key named \"bar\", subscribe to","         * <code>barRemove</code>, etc.","         * </p>","         *","         * <p>","         * Key-specific events are only fired for instance-level changes; that","         * is, changes that were made via the same History instance on which the","         * event is subscribed. To be notified of changes made by other History","         * instances, subscribe to the global <code>history:change</code> event.","         * </p>","         *","         * @event [key]Remove","         * @param {EventFacade} e Event facade with the following additional","         *   properties:","         *","         * <dl>","         *   <dt>prevVal (mixed)</dt>","         *   <dd>","         *     The value of the item before it was removed.","         *   </dd>","         *","         *   <dt>src (String)</dt>","         *   <dd>","         *     The source of the event. This can be used to selectively ignore","         *     events generated by certain sources.","         *   </dd>","         * </dl>","         */","        this.fire(key + 'Remove', {","            prevVal: value,","            src    : src","        });","    },","","    /**","     * Resolves the changes (if any) between <i>newState</i> and the current","     * state and fires appropriate events if things have changed.","     *","     * @method _resolveChanges","     * @param {String} src source of the changes, for inclusion in event facades","     *   to facilitate filtering","     * @param {Object} newState object hash of key/value pairs representing the","     *   new state","     * @param {Object} options Zero or more options. See <code>add()</code> for","     *   a list of supported options.","     * @protected","     */","    _resolveChanges: function (src, newState, options) {","        var changed   = {},","            isChanged,","            prevState = GlobalEnv._state,","            removed   = {};","","        newState || (newState = {});","        options  || (options  = {});","","        if (_isSimpleObject(newState) && _isSimpleObject(prevState)) {","            // Figure out what was added or changed.","            Obj.each(newState, function (newVal, key) {","                var prevVal = prevState[key];","","                if (newVal !== prevVal) {","                    changed[key] = {","                        newVal : newVal,","                        prevVal: prevVal","                    };","","                    isChanged = true;","                }","            }, this);","","            // Figure out what was removed.","            Obj.each(prevState, function (prevVal, key) {","                if (!Obj.owns(newState, key) || newState[key] === null) {","                    delete newState[key];","                    removed[key] = prevVal;","                    isChanged = true;","                }","            }, this);","        } else {","            isChanged = newState !== prevState;","        }","","        if (isChanged || this.force) {","            this._fireEvents(src, {","                changed  : changed,","                newState : newState,","                prevState: prevState,","                removed  : removed","            }, options);","        }","    },","","    /**","     * Stores the specified state. Don't call this method directly; go through","     * _resolveChanges() to ensure that changes are resolved and all events are","     * fired properly.","     *","     * @method _storeState","     * @param {String} src source of the changes","     * @param {Object} newState new state to store","     * @param {Object} options Zero or more options. See <code>add()</code> for","     *   a list of supported options.","     * @protected","     */","    _storeState: function (src, newState) {","        // Note: the src and options params aren't used here, but they are used","        // by subclasses.","        GlobalEnv._state = newState || {};","    },","","    // -- Protected Event Handlers ---------------------------------------------","","    /**","     * Default <code>history:change</code> event handler.","     *","     * @method _defChangeFn","     * @param {EventFacade} e state change event facade","     * @protected","     */","    _defChangeFn: function (e) {","        this._storeState(e.src, e.newVal, e._options);","    }","}, true);","","Y.HistoryBase = HistoryBase;","","","}, '3.7.3', {\"requires\": [\"event-custom-complex\"]});"];
_yuitest_coverage["build/history-base/history-base.js"].lines = {"1":0,"43":0,"57":0,"58":0,"61":0,"68":0,"69":0,"83":0,"84":0,"96":0,"107":0,"118":0,"131":0,"154":0,"157":0,"169":0,"180":0,"190":0,"204":0,"254":0,"260":0,"261":0,"296":0,"297":0,"298":0,"316":0,"317":0,"318":0,"332":0,"335":0,"336":0,"338":0,"354":0,"355":0,"356":0,"372":0,"373":0,"374":0,"393":0,"395":0,"397":0,"400":0,"401":0,"418":0,"428":0,"429":0,"432":0,"433":0,"489":0,"540":0,"560":0,"565":0,"566":0,"568":0,"570":0,"571":0,"573":0,"574":0,"579":0,"584":0,"585":0,"586":0,"587":0,"588":0,"592":0,"595":0,"596":0,"620":0,"633":0,"637":0};
_yuitest_coverage["build/history-base/history-base.js"].functions = {"HistoryBase:57":0,"_isSimpleObject:83":0,"_init:168":0,"add:295":0,"addValue:315":0,"get:331":0,"replace:353":0,"replaceValue:371":0,"_change:392":0,"(anonymous 2):428":0,"(anonymous 3):432":0,"_fireEvents:416":0,"_fireChangeEvent:448":0,"_fireRemoveEvent:506":0,"(anonymous 4):570":0,"(anonymous 5):584":0,"_resolveChanges:559":0,"_storeState:617":0,"_defChangeFn:632":0,"(anonymous 1):1":0};
_yuitest_coverage["build/history-base/history-base.js"].coveredLines = 70;
_yuitest_coverage["build/history-base/history-base.js"].coveredFunctions = 20;
_yuitest_coverline("build/history-base/history-base.js", 1);
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

_yuitest_coverfunc("build/history-base/history-base.js", "(anonymous 1)", 1);
_yuitest_coverline("build/history-base/history-base.js", 43);
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

_yuitest_coverline("build/history-base/history-base.js", 57);
function HistoryBase() {
    _yuitest_coverfunc("build/history-base/history-base.js", "HistoryBase", 57);
_yuitest_coverline("build/history-base/history-base.js", 58);
this._init.apply(this, arguments);
}

_yuitest_coverline("build/history-base/history-base.js", 61);
Y.augment(HistoryBase, Y.EventTarget, null, null, {
    emitFacade : true,
    prefix     : 'history',
    preventable: false,
    queueable  : true
});

_yuitest_coverline("build/history-base/history-base.js", 68);
if (!GlobalEnv._state) {
    _yuitest_coverline("build/history-base/history-base.js", 69);
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
_yuitest_coverline("build/history-base/history-base.js", 83);
function _isSimpleObject(value) {
    _yuitest_coverfunc("build/history-base/history-base.js", "_isSimpleObject", 83);
_yuitest_coverline("build/history-base/history-base.js", 84);
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
_yuitest_coverline("build/history-base/history-base.js", 96);
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
_yuitest_coverline("build/history-base/history-base.js", 107);
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
_yuitest_coverline("build/history-base/history-base.js", 118);
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
_yuitest_coverline("build/history-base/history-base.js", 131);
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
_yuitest_coverline("build/history-base/history-base.js", 154);
HistoryBase.nativeHashChange = ('onhashchange' in win || 'onhashchange' in doc) &&
        (!docMode || docMode > 7);

_yuitest_coverline("build/history-base/history-base.js", 157);
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
        _yuitest_coverfunc("build/history-base/history-base.js", "_init", 168);
_yuitest_coverline("build/history-base/history-base.js", 169);
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
        _yuitest_coverline("build/history-base/history-base.js", 180);
config = this._config = config || {};

        /**
         * If `true`, a `history:change` event will be fired whenever the URL
         * changes, even if there is no associated state change.
         *
         * @property force
         * @type Boolean
         * @default false
         */
         _yuitest_coverline("build/history-base/history-base.js", 190);
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
        _yuitest_coverline("build/history-base/history-base.js", 204);
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
        _yuitest_coverline("build/history-base/history-base.js", 254);
this.publish(EVT_CHANGE, {
            broadcast: 2,
            defaultFn: this._defChangeFn
        });

        // If initialState was provided, merge it into the current state.
        _yuitest_coverline("build/history-base/history-base.js", 260);
if (initialState) {
            _yuitest_coverline("build/history-base/history-base.js", 261);
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
        _yuitest_coverfunc("build/history-base/history-base.js", "add", 295);
_yuitest_coverline("build/history-base/history-base.js", 296);
var args = YArray(arguments, 0, true);
        _yuitest_coverline("build/history-base/history-base.js", 297);
args.unshift(SRC_ADD);
        _yuitest_coverline("build/history-base/history-base.js", 298);
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
        _yuitest_coverfunc("build/history-base/history-base.js", "addValue", 315);
_yuitest_coverline("build/history-base/history-base.js", 316);
var state = {};
        _yuitest_coverline("build/history-base/history-base.js", 317);
state[key] = value;
        _yuitest_coverline("build/history-base/history-base.js", 318);
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
        _yuitest_coverfunc("build/history-base/history-base.js", "get", 331);
_yuitest_coverline("build/history-base/history-base.js", 332);
var state    = GlobalEnv._state,
            isObject = _isSimpleObject(state);

        _yuitest_coverline("build/history-base/history-base.js", 335);
if (key) {
            _yuitest_coverline("build/history-base/history-base.js", 336);
return isObject && Obj.owns(state, key) ? state[key] : undefined;
        } else {
            _yuitest_coverline("build/history-base/history-base.js", 338);
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
        _yuitest_coverfunc("build/history-base/history-base.js", "replace", 353);
_yuitest_coverline("build/history-base/history-base.js", 354);
var args = YArray(arguments, 0, true);
        _yuitest_coverline("build/history-base/history-base.js", 355);
args.unshift(SRC_REPLACE);
        _yuitest_coverline("build/history-base/history-base.js", 356);
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
        _yuitest_coverfunc("build/history-base/history-base.js", "replaceValue", 371);
_yuitest_coverline("build/history-base/history-base.js", 372);
var state = {};
        _yuitest_coverline("build/history-base/history-base.js", 373);
state[key] = value;
        _yuitest_coverline("build/history-base/history-base.js", 374);
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
        _yuitest_coverfunc("build/history-base/history-base.js", "_change", 392);
_yuitest_coverline("build/history-base/history-base.js", 393);
options = options ? Y.merge(DEFAULT_OPTIONS, options) : DEFAULT_OPTIONS;

        _yuitest_coverline("build/history-base/history-base.js", 395);
if (options.merge && _isSimpleObject(state) &&
                _isSimpleObject(GlobalEnv._state)) {
            _yuitest_coverline("build/history-base/history-base.js", 397);
state = Y.merge(GlobalEnv._state, state);
        }

        _yuitest_coverline("build/history-base/history-base.js", 400);
this._resolveChanges(src, state, options);
        _yuitest_coverline("build/history-base/history-base.js", 401);
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
        _yuitest_coverfunc("build/history-base/history-base.js", "_fireEvents", 416);
_yuitest_coverline("build/history-base/history-base.js", 418);
this.fire(EVT_CHANGE, {
            _options: options,
            changed : changes.changed,
            newVal  : changes.newState,
            prevVal : changes.prevState,
            removed : changes.removed,
            src     : src
        });

        // Fire change/remove events for individual items.
        _yuitest_coverline("build/history-base/history-base.js", 428);
Obj.each(changes.changed, function (value, key) {
            _yuitest_coverfunc("build/history-base/history-base.js", "(anonymous 2)", 428);
_yuitest_coverline("build/history-base/history-base.js", 429);
this._fireChangeEvent(src, key, value);
        }, this);

        _yuitest_coverline("build/history-base/history-base.js", 432);
Obj.each(changes.removed, function (value, key) {
            _yuitest_coverfunc("build/history-base/history-base.js", "(anonymous 3)", 432);
_yuitest_coverline("build/history-base/history-base.js", 433);
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
        _yuitest_coverfunc("build/history-base/history-base.js", "_fireChangeEvent", 448);
_yuitest_coverline("build/history-base/history-base.js", 489);
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
        _yuitest_coverfunc("build/history-base/history-base.js", "_fireRemoveEvent", 506);
_yuitest_coverline("build/history-base/history-base.js", 540);
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
        _yuitest_coverfunc("build/history-base/history-base.js", "_resolveChanges", 559);
_yuitest_coverline("build/history-base/history-base.js", 560);
var changed   = {},
            isChanged,
            prevState = GlobalEnv._state,
            removed   = {};

        _yuitest_coverline("build/history-base/history-base.js", 565);
newState || (newState = {});
        _yuitest_coverline("build/history-base/history-base.js", 566);
options  || (options  = {});

        _yuitest_coverline("build/history-base/history-base.js", 568);
if (_isSimpleObject(newState) && _isSimpleObject(prevState)) {
            // Figure out what was added or changed.
            _yuitest_coverline("build/history-base/history-base.js", 570);
Obj.each(newState, function (newVal, key) {
                _yuitest_coverfunc("build/history-base/history-base.js", "(anonymous 4)", 570);
_yuitest_coverline("build/history-base/history-base.js", 571);
var prevVal = prevState[key];

                _yuitest_coverline("build/history-base/history-base.js", 573);
if (newVal !== prevVal) {
                    _yuitest_coverline("build/history-base/history-base.js", 574);
changed[key] = {
                        newVal : newVal,
                        prevVal: prevVal
                    };

                    _yuitest_coverline("build/history-base/history-base.js", 579);
isChanged = true;
                }
            }, this);

            // Figure out what was removed.
            _yuitest_coverline("build/history-base/history-base.js", 584);
Obj.each(prevState, function (prevVal, key) {
                _yuitest_coverfunc("build/history-base/history-base.js", "(anonymous 5)", 584);
_yuitest_coverline("build/history-base/history-base.js", 585);
if (!Obj.owns(newState, key) || newState[key] === null) {
                    _yuitest_coverline("build/history-base/history-base.js", 586);
delete newState[key];
                    _yuitest_coverline("build/history-base/history-base.js", 587);
removed[key] = prevVal;
                    _yuitest_coverline("build/history-base/history-base.js", 588);
isChanged = true;
                }
            }, this);
        } else {
            _yuitest_coverline("build/history-base/history-base.js", 592);
isChanged = newState !== prevState;
        }

        _yuitest_coverline("build/history-base/history-base.js", 595);
if (isChanged || this.force) {
            _yuitest_coverline("build/history-base/history-base.js", 596);
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
        _yuitest_coverfunc("build/history-base/history-base.js", "_storeState", 617);
_yuitest_coverline("build/history-base/history-base.js", 620);
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
        _yuitest_coverfunc("build/history-base/history-base.js", "_defChangeFn", 632);
_yuitest_coverline("build/history-base/history-base.js", 633);
this._storeState(e.src, e.newVal, e._options);
    }
}, true);

_yuitest_coverline("build/history-base/history-base.js", 637);
Y.HistoryBase = HistoryBase;


}, '3.7.3', {"requires": ["event-custom-complex"]});
