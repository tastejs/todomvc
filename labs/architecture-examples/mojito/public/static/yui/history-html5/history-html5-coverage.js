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
_yuitest_coverage["build/history-html5/history-html5.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/history-html5/history-html5.js",
    code: []
};
_yuitest_coverage["build/history-html5/history-html5.js"].code=["YUI.add('history-html5', function (Y, NAME) {","","/**"," * Provides browser history management using the HTML5 history API."," *"," * @module history"," * @submodule history-html5"," * @since 3.2.0"," */","","/**"," * <p>"," * Provides browser history management using the HTML5 history API."," * </p>"," *"," * <p>"," * When calling the <code>add()</code>, <code>addValue()</code>,"," * <code>replace()</code>, or <code>replaceValue()</code> methods on"," * <code>HistoryHTML5</code>, the following additional options are supported:"," * </p>"," *"," * <dl>"," *   <dt><strong>title (String)</strong></dt>"," *   <dd>"," *     Title to use for the new history entry. Browsers will typically display"," *     this title to the user in the detailed history window or in a dropdown"," *     menu attached to the back/forward buttons. If not specified, the title"," *     of the current document will be used."," *   </dd>"," *"," *   <dt><strong>url (String)</strong></dt>"," *   <dd>"," *     URL to display to the user for the new history entry. This URL will be"," *     visible in the browser's address bar and will be the bookmarked URL if"," *     the user bookmarks the page. It may be a relative path (\"foo/bar\"), an"," *     absolute path (\"/foo/bar\"), or a full URL (\"http://example.com/foo/bar\")."," *     If you specify a full URL, the origin <i>must</i> be the same as the"," *     origin of the current page, or an error will occur. If no URL is"," *     specified, the current URL will not be changed."," *   </dd>"," * </dl>"," *"," * @class HistoryHTML5"," * @extends HistoryBase"," * @constructor"," * @param {Object} config (optional) Configuration object."," */","","var HistoryBase     = Y.HistoryBase,","    Lang            = Y.Lang,","    win             = Y.config.win,","    useHistoryHTML5 = Y.config.useHistoryHTML5,","","    SRC_POPSTATE    = 'popstate',","    SRC_REPLACE     = HistoryBase.SRC_REPLACE;","","function HistoryHTML5() {","    HistoryHTML5.superclass.constructor.apply(this, arguments);","}","","Y.extend(HistoryHTML5, HistoryBase, {","    // -- Initialization -------------------------------------------------------","    _init: function (config) {","        var bookmarkedState = win.history.state;","","        // Treat empty state objects as `null` so they're not processed further.","        if (Y.Object.isEmpty(bookmarkedState)) {","            bookmarkedState = null;","        }","","        config || (config = {});","","        // If both the initial state and the bookmarked state are objects, merge","        // them (bookmarked state wins).","        if (config.initialState","                && Lang.type(config.initialState) === 'object'","                && Lang.type(bookmarkedState) === 'object') {","","            this._initialState = Y.merge(config.initialState, bookmarkedState);","        } else {","            // Otherwise, the bookmarked state always wins if there is one. If","            // there isn't a bookmarked state, history-base will take care of","            // falling back to config.initialState or null.","            this._initialState = bookmarkedState;","        }","","        Y.on('popstate', this._onPopState, win, this);","","        HistoryHTML5.superclass._init.apply(this, arguments);","    },","","    // -- Protected Methods ----------------------------------------------------","","    /**","     * Overrides HistoryBase's <code>_storeState()</code> and pushes or replaces","     * a history entry using the HTML5 history API when necessary.","     *","     * @method _storeState","     * @param {String} src Source of the changes.","     * @param {Object} newState New state to store.","     * @param {Object} options Zero or more options.","     * @protected","     */","    _storeState: function (src, newState, options) {","        if (src !== SRC_POPSTATE) {","            win.history[src === SRC_REPLACE ? 'replaceState' : 'pushState'](","                newState,","                options.title || Y.config.doc.title || '',","                options.url || null","            );","        }","","        HistoryHTML5.superclass._storeState.apply(this, arguments);","    },","","    // -- Protected Event Handlers ---------------------------------------------","","    /**","     * Handler for popstate events.","     *","     * @method _onPopState","     * @param {Event} e","     * @protected","     */","    _onPopState: function (e) {","        this._resolveChanges(SRC_POPSTATE, e._event.state || null);","    }","}, {","    // -- Public Static Properties ---------------------------------------------","    NAME: 'historyhtml5',","","    /**","     * Constant used to identify state changes originating from","     * <code>popstate</code> events.","     *","     * @property SRC_POPSTATE","     * @type String","     * @static","     * @final","     */","    SRC_POPSTATE: SRC_POPSTATE","});","","if (!Y.Node.DOM_EVENTS.popstate) {","    Y.Node.DOM_EVENTS.popstate = 1;","}","","Y.HistoryHTML5 = HistoryHTML5;","","/**"," * <p>"," * If <code>true</code>, the <code>Y.History</code> alias will always point to"," * <code>Y.HistoryHTML5</code> when the history-html5 module is loaded, even if"," * the current browser doesn't support HTML5 history."," * </p>"," *"," * <p>"," * If <code>false</code>, the <code>Y.History</code> alias will always point to"," * <code>Y.HistoryHash</code> when the history-hash module is loaded, even if"," * the current browser supports HTML5 history."," * </p>"," *"," * <p>"," * If neither <code>true</code> nor <code>false</code>, the"," * <code>Y.History</code> alias will point to the best available history adapter"," * that the browser supports. This is the default behavior."," * </p>"," *"," * @property useHistoryHTML5"," * @type boolean"," * @for config"," * @since 3.2.0"," */","","// HistoryHTML5 will always win over HistoryHash unless useHistoryHTML5 is false","// or HTML5 history is not supported.","if (useHistoryHTML5 === true || (useHistoryHTML5 !== false &&","        HistoryBase.html5)) {","    Y.History = HistoryHTML5;","}","","","}, '3.7.3', {\"optional\": [\"json\"], \"requires\": [\"event-base\", \"history-base\", \"node-base\"]});"];
_yuitest_coverage["build/history-html5/history-html5.js"].lines = {"1":0,"49":0,"57":0,"58":0,"61":0,"64":0,"67":0,"68":0,"71":0,"75":0,"79":0,"84":0,"87":0,"89":0,"105":0,"106":0,"113":0,"126":0,"144":0,"145":0,"148":0,"177":0,"179":0};
_yuitest_coverage["build/history-html5/history-html5.js"].functions = {"HistoryHTML5:57":0,"_init:63":0,"_storeState:104":0,"_onPopState:125":0,"(anonymous 1):1":0};
_yuitest_coverage["build/history-html5/history-html5.js"].coveredLines = 23;
_yuitest_coverage["build/history-html5/history-html5.js"].coveredFunctions = 5;
_yuitest_coverline("build/history-html5/history-html5.js", 1);
YUI.add('history-html5', function (Y, NAME) {

/**
 * Provides browser history management using the HTML5 history API.
 *
 * @module history
 * @submodule history-html5
 * @since 3.2.0
 */

/**
 * <p>
 * Provides browser history management using the HTML5 history API.
 * </p>
 *
 * <p>
 * When calling the <code>add()</code>, <code>addValue()</code>,
 * <code>replace()</code>, or <code>replaceValue()</code> methods on
 * <code>HistoryHTML5</code>, the following additional options are supported:
 * </p>
 *
 * <dl>
 *   <dt><strong>title (String)</strong></dt>
 *   <dd>
 *     Title to use for the new history entry. Browsers will typically display
 *     this title to the user in the detailed history window or in a dropdown
 *     menu attached to the back/forward buttons. If not specified, the title
 *     of the current document will be used.
 *   </dd>
 *
 *   <dt><strong>url (String)</strong></dt>
 *   <dd>
 *     URL to display to the user for the new history entry. This URL will be
 *     visible in the browser's address bar and will be the bookmarked URL if
 *     the user bookmarks the page. It may be a relative path ("foo/bar"), an
 *     absolute path ("/foo/bar"), or a full URL ("http://example.com/foo/bar").
 *     If you specify a full URL, the origin <i>must</i> be the same as the
 *     origin of the current page, or an error will occur. If no URL is
 *     specified, the current URL will not be changed.
 *   </dd>
 * </dl>
 *
 * @class HistoryHTML5
 * @extends HistoryBase
 * @constructor
 * @param {Object} config (optional) Configuration object.
 */

_yuitest_coverfunc("build/history-html5/history-html5.js", "(anonymous 1)", 1);
_yuitest_coverline("build/history-html5/history-html5.js", 49);
var HistoryBase     = Y.HistoryBase,
    Lang            = Y.Lang,
    win             = Y.config.win,
    useHistoryHTML5 = Y.config.useHistoryHTML5,

    SRC_POPSTATE    = 'popstate',
    SRC_REPLACE     = HistoryBase.SRC_REPLACE;

_yuitest_coverline("build/history-html5/history-html5.js", 57);
function HistoryHTML5() {
    _yuitest_coverfunc("build/history-html5/history-html5.js", "HistoryHTML5", 57);
_yuitest_coverline("build/history-html5/history-html5.js", 58);
HistoryHTML5.superclass.constructor.apply(this, arguments);
}

_yuitest_coverline("build/history-html5/history-html5.js", 61);
Y.extend(HistoryHTML5, HistoryBase, {
    // -- Initialization -------------------------------------------------------
    _init: function (config) {
        _yuitest_coverfunc("build/history-html5/history-html5.js", "_init", 63);
_yuitest_coverline("build/history-html5/history-html5.js", 64);
var bookmarkedState = win.history.state;

        // Treat empty state objects as `null` so they're not processed further.
        _yuitest_coverline("build/history-html5/history-html5.js", 67);
if (Y.Object.isEmpty(bookmarkedState)) {
            _yuitest_coverline("build/history-html5/history-html5.js", 68);
bookmarkedState = null;
        }

        _yuitest_coverline("build/history-html5/history-html5.js", 71);
config || (config = {});

        // If both the initial state and the bookmarked state are objects, merge
        // them (bookmarked state wins).
        _yuitest_coverline("build/history-html5/history-html5.js", 75);
if (config.initialState
                && Lang.type(config.initialState) === 'object'
                && Lang.type(bookmarkedState) === 'object') {

            _yuitest_coverline("build/history-html5/history-html5.js", 79);
this._initialState = Y.merge(config.initialState, bookmarkedState);
        } else {
            // Otherwise, the bookmarked state always wins if there is one. If
            // there isn't a bookmarked state, history-base will take care of
            // falling back to config.initialState or null.
            _yuitest_coverline("build/history-html5/history-html5.js", 84);
this._initialState = bookmarkedState;
        }

        _yuitest_coverline("build/history-html5/history-html5.js", 87);
Y.on('popstate', this._onPopState, win, this);

        _yuitest_coverline("build/history-html5/history-html5.js", 89);
HistoryHTML5.superclass._init.apply(this, arguments);
    },

    // -- Protected Methods ----------------------------------------------------

    /**
     * Overrides HistoryBase's <code>_storeState()</code> and pushes or replaces
     * a history entry using the HTML5 history API when necessary.
     *
     * @method _storeState
     * @param {String} src Source of the changes.
     * @param {Object} newState New state to store.
     * @param {Object} options Zero or more options.
     * @protected
     */
    _storeState: function (src, newState, options) {
        _yuitest_coverfunc("build/history-html5/history-html5.js", "_storeState", 104);
_yuitest_coverline("build/history-html5/history-html5.js", 105);
if (src !== SRC_POPSTATE) {
            _yuitest_coverline("build/history-html5/history-html5.js", 106);
win.history[src === SRC_REPLACE ? 'replaceState' : 'pushState'](
                newState,
                options.title || Y.config.doc.title || '',
                options.url || null
            );
        }

        _yuitest_coverline("build/history-html5/history-html5.js", 113);
HistoryHTML5.superclass._storeState.apply(this, arguments);
    },

    // -- Protected Event Handlers ---------------------------------------------

    /**
     * Handler for popstate events.
     *
     * @method _onPopState
     * @param {Event} e
     * @protected
     */
    _onPopState: function (e) {
        _yuitest_coverfunc("build/history-html5/history-html5.js", "_onPopState", 125);
_yuitest_coverline("build/history-html5/history-html5.js", 126);
this._resolveChanges(SRC_POPSTATE, e._event.state || null);
    }
}, {
    // -- Public Static Properties ---------------------------------------------
    NAME: 'historyhtml5',

    /**
     * Constant used to identify state changes originating from
     * <code>popstate</code> events.
     *
     * @property SRC_POPSTATE
     * @type String
     * @static
     * @final
     */
    SRC_POPSTATE: SRC_POPSTATE
});

_yuitest_coverline("build/history-html5/history-html5.js", 144);
if (!Y.Node.DOM_EVENTS.popstate) {
    _yuitest_coverline("build/history-html5/history-html5.js", 145);
Y.Node.DOM_EVENTS.popstate = 1;
}

_yuitest_coverline("build/history-html5/history-html5.js", 148);
Y.HistoryHTML5 = HistoryHTML5;

/**
 * <p>
 * If <code>true</code>, the <code>Y.History</code> alias will always point to
 * <code>Y.HistoryHTML5</code> when the history-html5 module is loaded, even if
 * the current browser doesn't support HTML5 history.
 * </p>
 *
 * <p>
 * If <code>false</code>, the <code>Y.History</code> alias will always point to
 * <code>Y.HistoryHash</code> when the history-hash module is loaded, even if
 * the current browser supports HTML5 history.
 * </p>
 *
 * <p>
 * If neither <code>true</code> nor <code>false</code>, the
 * <code>Y.History</code> alias will point to the best available history adapter
 * that the browser supports. This is the default behavior.
 * </p>
 *
 * @property useHistoryHTML5
 * @type boolean
 * @for config
 * @since 3.2.0
 */

// HistoryHTML5 will always win over HistoryHash unless useHistoryHTML5 is false
// or HTML5 history is not supported.
_yuitest_coverline("build/history-html5/history-html5.js", 177);
if (useHistoryHTML5 === true || (useHistoryHTML5 !== false &&
        HistoryBase.html5)) {
    _yuitest_coverline("build/history-html5/history-html5.js", 179);
Y.History = HistoryHTML5;
}


}, '3.7.3', {"optional": ["json"], "requires": ["event-base", "history-base", "node-base"]});
