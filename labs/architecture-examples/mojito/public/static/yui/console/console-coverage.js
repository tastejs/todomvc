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
_yuitest_coverage["build/console/console.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/console/console.js",
    code: []
};
_yuitest_coverage["build/console/console.js"].code=["YUI.add('console', function (Y, NAME) {","","/**"," * Console creates a visualization for messages logged through calls to a YUI"," * instance's <code>Y.log( message, category, source )</code> method.  The"," * debug versions of YUI modules will include logging statements to offer some"," * insight into the steps executed during that module's operation.  Including"," * log statements in your code will cause those messages to also appear in the"," * Console.  Use Console to aid in developing your page or application."," *"," * Entry categories &quot;info&quot;, &quot;warn&quot;, and &quot;error&quot;"," * are also referred to as the log level, and entries are filtered against the"," * configured logLevel."," *"," * @module console"," * @class Console"," * @extends Widget"," * @param conf {Object} Configuration object (see Configuration attributes)"," * @constructor"," */","var getCN = Y.ClassNameManager.getClassName,","    CHECKED        = 'checked',","    CLEAR          = 'clear',","    CLICK          = 'click',","    COLLAPSED      = 'collapsed',","    CONSOLE        = 'console',","    CONTENT_BOX    = 'contentBox',","    DISABLED       = 'disabled',","    ENTRY          = 'entry',","    ERROR          = 'error',","    HEIGHT         = 'height',","    INFO           = 'info',","    LAST_TIME      = 'lastTime',","    PAUSE          = 'pause',","    PAUSED         = 'paused',","    RESET          = 'reset',","    START_TIME     = 'startTime',","    TITLE          = 'title',","    WARN           = 'warn',","","    DOT = '.',","","    C_BUTTON           = getCN(CONSOLE,'button'),","    C_CHECKBOX         = getCN(CONSOLE,'checkbox'),","    C_CLEAR            = getCN(CONSOLE,CLEAR),","    C_COLLAPSE         = getCN(CONSOLE,'collapse'),","    C_COLLAPSED        = getCN(CONSOLE,COLLAPSED),","    C_CONSOLE_CONTROLS = getCN(CONSOLE,'controls'),","    C_CONSOLE_HD       = getCN(CONSOLE,'hd'),","    C_CONSOLE_BD       = getCN(CONSOLE,'bd'),","    C_CONSOLE_FT       = getCN(CONSOLE,'ft'),","    C_CONSOLE_TITLE    = getCN(CONSOLE,TITLE),","    C_ENTRY            = getCN(CONSOLE,ENTRY),","    C_ENTRY_CAT        = getCN(CONSOLE,ENTRY,'cat'),","    C_ENTRY_CONTENT    = getCN(CONSOLE,ENTRY,'content'),","    C_ENTRY_META       = getCN(CONSOLE,ENTRY,'meta'),","    C_ENTRY_SRC        = getCN(CONSOLE,ENTRY,'src'),","    C_ENTRY_TIME       = getCN(CONSOLE,ENTRY,'time'),","    C_PAUSE            = getCN(CONSOLE,PAUSE),","    C_PAUSE_LABEL      = getCN(CONSOLE,PAUSE,'label'),","","    RE_INLINE_SOURCE = /^(\\S+)\\s/,","    RE_AMP = /&(?!#?[a-z0-9]+;)/g,","    RE_GT  = />/g,","    RE_LT  = /</g,","","    ESC_AMP = '&#38;',","    ESC_GT  = '&#62;',","    ESC_LT  = '&#60;',","    ","    ENTRY_TEMPLATE_STR =","        '<div class=\"{entry_class} {cat_class} {src_class}\">'+","            '<p class=\"{entry_meta_class}\">'+","                '<span class=\"{entry_src_class}\">'+","                    '{sourceAndDetail}'+","                '</span>'+","                '<span class=\"{entry_cat_class}\">'+","                    '{category}</span>'+","                '<span class=\"{entry_time_class}\">'+","                    ' {totalTime}ms (+{elapsedTime}) {localTime}'+","                '</span>'+","            '</p>'+","            '<pre class=\"{entry_content_class}\">{message}</pre>'+","        '</div>',","","    L = Y.Lang,","    create     = Y.Node.create,","    isNumber   = L.isNumber,","    isString   = L.isString,","    merge      = Y.merge,","    substitute = Y.Lang.sub;","    ","","function Console() {","    Console.superclass.constructor.apply(this,arguments);","}","","Y.Console = Y.extend(Console, Y.Widget,","","// Y.Console prototype","{","    /**","     * Category to prefix all event subscriptions to allow for ease of detach","     * during destroy.","     *","     * @property _evtCat","     * @type string","     * @protected","     */","    _evtCat : null,","","    /**","     * Reference to the Node instance containing the header contents.","     *","     * @property _head","     * @type Node","     * @default null","     * @protected","     */","    _head    : null,","","    /**","     * Reference to the Node instance that will house the console messages.","     *","     * @property _body","     * @type Node","     * @default null","     * @protected","     */","    _body    : null,","","    /**","     * Reference to the Node instance containing the footer contents.","     *","     * @property _foot","     * @type Node","     * @default null","     * @protected","     */","    _foot    : null,","","    /**","     * Holds the object API returned from <code>Y.later</code> for the print","     * loop interval.","     *","     * @property _printLoop","     * @type Object","     * @default null","     * @protected","     */","    _printLoop : null,","","    /**","     * Array of normalized message objects awaiting printing.","     *","     * @property buffer","     * @type Array","     * @default null","     * @protected","     */","    buffer   : null,","","    /**","     * Wrapper for <code>Y.log</code>.","     *","     * @method log","     * @param arg* {MIXED} (all arguments passed through to <code>Y.log</code>)","     * @chainable","     */","    log : function () {","        Y.log.apply(Y,arguments);","","        return this;","    },","","    /**","     * Clear the console of messages and flush the buffer of pending messages.","     *","     * @method clearConsole","     * @chainable","     */","    clearConsole : function () {","        // TODO: clear event listeners from console contents","        this._body.empty();","","        this._cancelPrintLoop();","","        this.buffer = [];","","        return this;","    },","","    /**","     * Clears the console and resets internal timers.","     *","     * @method reset","     * @chainable","     */","    reset : function () {","        this.fire(RESET);","        ","        return this;","    },","","    /**","     * Collapses the body and footer.","     *","     * @method collapse","     * @chainable","     */","    collapse : function () {","        this.set(COLLAPSED, true);","","        return this;","    },","","    /**","     * Expands the body and footer if collapsed.","     *","     * @method expand","     * @chainable","     */","    expand : function () {","        this.set(COLLAPSED, false);","","        return this;","    },","","    /**","     * Outputs buffered messages to the console UI.  This is typically called","     * from a scheduled interval until the buffer is empty (referred to as the","     * print loop).  The number of buffered messages output to the Console is","     * limited to the number provided as an argument.  If no limit is passed,","     * all buffered messages are rendered.","     * ","     * @method printBuffer","     * @param limit {Number} (optional) max number of buffered entries to write","     * @chainable","     */","    printBuffer: function (limit) {","        var messages    = this.buffer,","            debug       = Y.config.debug,","            entries     = [],","            consoleLimit= this.get('consoleLimit'),","            newestOnTop = this.get('newestOnTop'),","            anchor      = newestOnTop ? this._body.get('firstChild') : null,","            i;","","        if (messages.length > consoleLimit) {","            messages.splice(0, messages.length - consoleLimit);","        }","","        limit = Math.min(messages.length, (limit || messages.length));","        ","        // turn off logging system","        Y.config.debug = false;","","        if (!this.get(PAUSED) && this.get('rendered')) {","","            for (i = 0; i < limit && messages.length; ++i) {","                entries[i] = this._createEntryHTML(messages.shift());","            }","","            if (!messages.length) {","                this._cancelPrintLoop();","            }","","            if (entries.length) {","                if (newestOnTop) {","                    entries.reverse();","                }","","                this._body.insertBefore(create(entries.join('')), anchor);","","                if (this.get('scrollIntoView')) {","                    this.scrollToLatest();","                }","","                this._trimOldEntries();","            }","        }","","        // restore logging system","        Y.config.debug = debug;","","        return this;","    },","","    ","    /**","     * Constructor code.  Set up the buffer and entry template, publish","     * internal events, and subscribe to the configured logEvent.","     * ","     * @method initializer","     * @protected","     */","    initializer : function () {","        this._evtCat = Y.stamp(this) + '|';","","        this.buffer = [];","","        this.get('logSource').on(this._evtCat +","            this.get('logEvent'),Y.bind(\"_onLogEvent\",this));","","        /**","         * Transfers a received message to the print loop buffer.  Default","         * behavior defined in _defEntryFn.","         *","         * @event entry","         * @param event {Event.Facade} An Event Facade object with the following attribute specific properties added:","         *  <dl>","         *      <dt>message</dt>","         *          <dd>The message data normalized into an object literal (see _normalizeMessage)</dd>","         *  </dl>","         * @preventable _defEntryFn","         */","        this.publish(ENTRY, { defaultFn: this._defEntryFn });","","        /**","         * Triggers the reset behavior via the default logic in _defResetFn.","         *","         * @event reset","         * @param event {Event.Facade} Event Facade object","         * @preventable _defResetFn","         */","        this.publish(RESET, { defaultFn: this._defResetFn });","","        this.after('rendered', this._schedulePrint);","    },","","    /**","     * Tears down the instance, flushing event subscriptions and purging the UI.","     *","     * @method destructor","     * @protected","     */","    destructor : function () {","        var bb = this.get('boundingBox');","","        this._cancelPrintLoop();","","        this.get('logSource').detach(this._evtCat + '*');","        ","        bb.purge(true);","    },","","    /**","     * Generate the Console UI.","     *","     * @method renderUI","     * @protected","     */","    renderUI : function () {","        this._initHead();","        this._initBody();","        this._initFoot();","","        // Apply positioning to the bounding box if appropriate","        var style = this.get('style');","        if (style !== 'block') {","            this.get('boundingBox').addClass(this.getClassName(style));","        }","    },","","    /**","     * Sync the UI state to the current attribute state.","     *","     * @method syncUI","     */","    syncUI : function () {","        this._uiUpdatePaused(this.get(PAUSED));","        this._uiUpdateCollapsed(this.get(COLLAPSED));","        this._uiSetHeight(this.get(HEIGHT));","    },","","    /**","     * Set up event listeners to wire up the UI to the internal state.","     *","     * @method bindUI","     * @protected","     */","    bindUI : function () {","        this.get(CONTENT_BOX).one('button.'+C_COLLAPSE).","            on(CLICK,this._onCollapseClick,this);","","        this.get(CONTENT_BOX).one('input[type=checkbox].'+C_PAUSE).","            on(CLICK,this._onPauseClick,this);","","        this.get(CONTENT_BOX).one('button.'+C_CLEAR).","            on(CLICK,this._onClearClick,this);","","        // Attribute changes","        this.after(this._evtCat + 'stringsChange',","            this._afterStringsChange);","        this.after(this._evtCat + 'pausedChange',","            this._afterPausedChange);","        this.after(this._evtCat + 'consoleLimitChange',","            this._afterConsoleLimitChange);","        this.after(this._evtCat + 'collapsedChange',","            this._afterCollapsedChange);","    },","","    ","    /**","     * Create the DOM structure for the header elements.","     *","     * @method _initHead","     * @protected","     */","    _initHead : function () {","        var cb   = this.get(CONTENT_BOX),","            info = merge(Console.CHROME_CLASSES, {","                        str_collapse : this.get('strings.collapse'),","                        str_title : this.get('strings.title')","                    });","","        this._head = create(substitute(Console.HEADER_TEMPLATE,info));","","        cb.insertBefore(this._head,cb.get('firstChild'));","    },","","    /**","     * Create the DOM structure for the console body&#8212;where messages are","     * rendered.","     *","     * @method _initBody","     * @protected","     */","    _initBody : function () {","        this._body = create(substitute(","                            Console.BODY_TEMPLATE,","                            Console.CHROME_CLASSES));","","        this.get(CONTENT_BOX).appendChild(this._body);","    },","","    /**","     * Create the DOM structure for the footer elements.","     *","     * @method _initFoot","     * @protected","     */","    _initFoot : function () {","        var info = merge(Console.CHROME_CLASSES, {","                id_guid   : Y.guid(),","                str_pause : this.get('strings.pause'),","                str_clear : this.get('strings.clear')","            });","","        this._foot = create(substitute(Console.FOOTER_TEMPLATE,info));","","        this.get(CONTENT_BOX).appendChild(this._foot);","    },","","    /**","     * Determine if incoming log messages are within the configured logLevel","     * to be buffered for printing.","     *","     * @method _isInLogLevel","     * @protected","     */","    _isInLogLevel : function (e) {","        var cat = e.cat, lvl = this.get('logLevel');","","        if (lvl !== INFO) {","            cat = cat || INFO;","","            if (isString(cat)) {","                cat = cat.toLowerCase();","            }","","            if ((cat === WARN && lvl === ERROR) ||","                (cat === INFO && lvl !== INFO)) {","                return false;","            }","        }","","        return true;","    },","","    /**","     * Create a log entry message from the inputs including the following keys:","     * <ul>","     *     <li>time - this moment</li>","     *     <li>message - leg message</li>","     *     <li>category - logLevel or custom category for the message</li>","     *     <li>source - when provided, the widget or util calling Y.log</li>","     *     <li>sourceAndDetail - same as source but can include instance info</li>","     *     <li>localTime - readable version of time</li>","     *     <li>elapsedTime - ms since last entry</li>","     *     <li>totalTime - ms since Console was instantiated or reset</li>","     * </ul>","     *","     * @method _normalizeMessage","     * @param e {Event} custom event containing the log message","     * @return Object the message object","     * @protected","     */","    _normalizeMessage : function (e) {","","        var msg = e.msg,","            cat = e.cat,","            src = e.src,","","            m = {","                time            : new Date(),","                message         : msg,","                category        : cat || this.get('defaultCategory'),","                sourceAndDetail : src || this.get('defaultSource'),","                source          : null,","                localTime       : null,","                elapsedTime     : null,","                totalTime       : null","            };","","        // Extract m.source \"Foo\" from m.sourceAndDetail \"Foo bar baz\"","        m.source          = RE_INLINE_SOURCE.test(m.sourceAndDetail) ?","                                RegExp.$1 : m.sourceAndDetail;","        m.localTime       = m.time.toLocaleTimeString ? ","                            m.time.toLocaleTimeString() : (m.time + '');","        m.elapsedTime     = m.time - this.get(LAST_TIME);","        m.totalTime       = m.time - this.get(START_TIME);","","        this._set(LAST_TIME,m.time);","","        return m;","    },","","    /**","     * Sets an interval for buffered messages to be output to the console.","     *","     * @method _schedulePrint","     * @protected","     */","    _schedulePrint : function () {","        if (!this._printLoop && !this.get(PAUSED) && this.get('rendered')) {","            this._printLoop = Y.later(","                                this.get('printTimeout'),","                                this, this.printBuffer,","                                this.get('printLimit'), true);","        }","    },","","    /**","     * Translates message meta into the markup for a console entry.","     *","     * @method _createEntryHTML","     * @param m {Object} object literal containing normalized message metadata","     * @return String","     * @protected","     */","    _createEntryHTML : function (m) {","        m = merge(","                this._htmlEscapeMessage(m),","                Console.ENTRY_CLASSES,","                {","                    cat_class : this.getClassName(ENTRY,m.category),","                    src_class : this.getClassName(ENTRY,m.source)","                });","","        return this.get('entryTemplate').replace(/\\{(\\w+)\\}/g,","            function (_,token) {","                return token in m ? m[token] : '';","            });","    },","","    /**","     * Scrolls to the most recent entry","     *","     * @method scrollToLatest","     * @chainable","     */","    scrollToLatest : function () {","        var scrollTop = this.get('newestOnTop') ?","                            0 :","                            this._body.get('scrollHeight');","","        this._body.set('scrollTop', scrollTop);","    },","","    /**","     * Performs HTML escaping on strings in the message object.","     *","     * @method _htmlEscapeMessage","     * @param m {Object} the normalized message object","     * @return Object the message object with proper escapement","     * @protected","     */","    _htmlEscapeMessage : function (m) {","        m.message         = this._encodeHTML(m.message);","        m.source          = this._encodeHTML(m.source);","        m.sourceAndDetail = this._encodeHTML(m.sourceAndDetail);","        m.category        = this._encodeHTML(m.category);","","        return m;","    },","","    /**","     * Removes the oldest message entries from the UI to maintain the limit","     * specified in the consoleLimit configuration.","     *","     * @method _trimOldEntries","     * @protected","     */","    _trimOldEntries : function () {","        // Turn off the logging system for the duration of this operation","        // to prevent an infinite loop","        Y.config.debug = false;","","        var bd = this._body,","            limit = this.get('consoleLimit'),","            debug = Y.config.debug,","            entries,e,i,l;","","        if (bd) {","            entries = bd.all(DOT+C_ENTRY);","            l = entries.size() - limit;","","            if (l > 0) {","                if (this.get('newestOnTop')) {","                    i = limit;","                    l = entries.size();","                } else {","                    i = 0;","                }","","                this._body.setStyle('display','none');","","                for (;i < l; ++i) {","                    e = entries.item(i);","                    if (e) {","                        e.remove();","                    }","                }","","                this._body.setStyle('display','');","            }","","        }","","        Y.config.debug = debug;","    },","","    /**","     * Returns the input string with ampersands (&amp;), &lt, and &gt; encoded","     * as HTML entities.","     *","     * @method _encodeHTML","     * @param s {String} the raw string","     * @return String the encoded string","     * @protected","     */","    _encodeHTML : function (s) {","        return isString(s) ?","            s.replace(RE_AMP,ESC_AMP).","              replace(RE_LT, ESC_LT).","              replace(RE_GT, ESC_GT) :","            s;","    },","","    /**","     * Clears the timeout for printing buffered messages.","     *","     * @method _cancelPrintLoop","     * @protected","     */","    _cancelPrintLoop : function () {","        if (this._printLoop) {","            this._printLoop.cancel();","            this._printLoop = null;","        }","    },","","    /**","     * Validates input value for style attribute.  Accepts only values 'inline',","     * 'block', and 'separate'.","     *","     * @method _validateStyle","     * @param style {String} the proposed value","     * @return {Boolean} pass/fail","     * @protected","     */","    _validateStyle : function (style) {","        return style === 'inline' || style === 'block' || style === 'separate';","    },","","    /**","     * Event handler for clicking on the Pause checkbox to update the paused","     * attribute.","     *","     * @method _onPauseClick","     * @param e {Event} DOM event facade for the click event","     * @protected","     */","    _onPauseClick : function (e) {","        this.set(PAUSED,e.target.get(CHECKED));","    },","","    /**","     * Event handler for clicking on the Clear button.  Pass-through to","     * <code>this.clearConsole()</code>.","     *","     * @method _onClearClick","     * @param e {Event} DOM event facade for the click event","     * @protected","     */","    _onClearClick : function (e) {","        this.clearConsole();","    },","","    /**","     * Event handler for clicking on the Collapse/Expand button. Sets the","     * &quot;collapsed&quot; attribute accordingly.","     *","     * @method _onCollapseClick","     * @param e {Event} DOM event facade for the click event","     * @protected","     */","    _onCollapseClick : function (e) {","        this.set(COLLAPSED, !this.get(COLLAPSED));","    },","","","    /**","     * Validator for logSource attribute.","     *","     * @method _validateLogSource","     * @param v {Object} the desired logSource","     * @return {Boolean} true if the input is an object with an <code>on</code>","     *                   method","     * @protected","     */","    _validateLogSource: function (v) {","        return v && Y.Lang.isFunction(v.on);","    },","","    /**","     * Setter method for logLevel attribute.  Acceptable values are","     * &quot;error&quot, &quot;warn&quot, and &quot;info&quot (case","     * insensitive).  Other values are treated as &quot;info&quot;.","     *","     * @method _setLogLevel","     * @param v {String} the desired log level","     * @return String One of Console.LOG_LEVEL_INFO, _WARN, or _ERROR","     * @protected","     */","    _setLogLevel : function (v) {","        if (isString(v)) {","            v = v.toLowerCase();","        }","        ","        return (v === WARN || v === ERROR) ? v : INFO;","    },","","    /**","     * Getter method for useBrowserConsole attribute.  Just a pass through to","     * the YUI instance configuration setting.","     *","     * @method _getUseBrowserConsole","     * @return {Boolean} or null if logSource is not a YUI instance","     * @protected","     */","    _getUseBrowserConsole: function () {","        var logSource = this.get('logSource');","        return logSource instanceof YUI ?","            logSource.config.useBrowserConsole : null;","    },","","    /**","     * Setter method for useBrowserConsole attributes.  Only functional if the","     * logSource attribute points to a YUI instance.  Passes the value down to","     * the YUI instance.  NOTE: multiple Console instances cannot maintain","     * independent useBrowserConsole values, since it is just a pass through to","     * the YUI instance configuration.","     *","     * @method _setUseBrowserConsole","     * @param v {Boolean} false to disable browser console printing (default)","     * @return {Boolean} true|false if logSource is a YUI instance","     * @protected","     */","    _setUseBrowserConsole: function (v) {","        var logSource = this.get('logSource');","        if (logSource instanceof YUI) {","            v = !!v;","            logSource.config.useBrowserConsole = v;","            return v;","        } else {","            return Y.Attribute.INVALID_VALUE;","        }","    },","","    /**","     * Set the height of the Console container.  Set the body height to the","     * difference between the configured height and the calculated heights of","     * the header and footer.","     * Overrides Widget.prototype._uiSetHeight.","     *","     * @method _uiSetHeight","     * @param v {String|Number} the new height","     * @protected","     */","    _uiSetHeight : function (v) {","        Console.superclass._uiSetHeight.apply(this,arguments);","","        if (this._head && this._foot) {","            var h = this.get('boundingBox').get('offsetHeight') -","                    this._head.get('offsetHeight') -","                    this._foot.get('offsetHeight');","","            this._body.setStyle(HEIGHT,h+'px');","        }","    },","","    /**","     * Over-ride default content box sizing to do nothing, since we're sizing","     * the body section to fill out height ourselves.","     * ","     * @method _uiSizeCB","     * @protected","     */","    _uiSizeCB : function() {","        // Do Nothing. Ideally want to move to Widget-StdMod, which accounts for","        // _uiSizeCB        ","    },","","    /**","     * Updates the UI if changes are made to any of the strings in the strings","     * attribute.","     *","     * @method _afterStringsChange","     * @param e {Event} Custom event for the attribute change","     * @protected","     */","    _afterStringsChange : function (e) {","        var prop   = e.subAttrName ? e.subAttrName.split(DOT)[1] : null,","            cb     = this.get(CONTENT_BOX),","            before = e.prevVal,","            after  = e.newVal;","","        if ((!prop || prop === TITLE) && before.title !== after.title) {","            cb.all(DOT+C_CONSOLE_TITLE).setHTML(after.title);","        }","","        if ((!prop || prop === PAUSE) && before.pause !== after.pause) {","            cb.all(DOT+C_PAUSE_LABEL).setHTML(after.pause);","        }","","        if ((!prop || prop === CLEAR) && before.clear !== after.clear) {","            cb.all(DOT+C_CLEAR).set('value',after.clear);","        }","    },","","    /**","     * Updates the UI and schedules or cancels the print loop.","     *","     * @method _afterPausedChange","     * @param e {Event} Custom event for the attribute change","     * @protected","     */","    _afterPausedChange : function (e) {","        var paused = e.newVal;","","        if (e.src !== Y.Widget.SRC_UI) {","            this._uiUpdatePaused(paused);","        }","","        if (!paused) {","            this._schedulePrint();","        } else if (this._printLoop) {","            this._cancelPrintLoop();","        }","    },","","    /**","     * Checks or unchecks the paused checkbox","     *","     * @method _uiUpdatePaused","     * @param on {Boolean} the new checked state","     * @protected","     */","    _uiUpdatePaused : function (on) {","        var node = this._foot.all('input[type=checkbox].'+C_PAUSE);","","        if (node) {","            node.set(CHECKED,on);","        }","    },","","    /**","     * Calls this._trimOldEntries() in response to changes in the configured","     * consoleLimit attribute.","     * ","     * @method _afterConsoleLimitChange","     * @param e {Event} Custom event for the attribute change","     * @protected","     */","    _afterConsoleLimitChange : function () {","        this._trimOldEntries();","    },","","","    /**","     * Updates the className of the contentBox, which should trigger CSS to","     * hide or show the body and footer sections depending on the new value.","     *","     * @method _afterCollapsedChange","     * @param e {Event} Custom event for the attribute change","     * @protected","     */","    _afterCollapsedChange : function (e) {","        this._uiUpdateCollapsed(e.newVal);","    },","","    /**","     * Updates the UI to reflect the new Collapsed state","     *","     * @method _uiUpdateCollapsed","     * @param v {Boolean} true for collapsed, false for expanded","     * @protected","     */","    _uiUpdateCollapsed : function (v) {","        var bb     = this.get('boundingBox'),","            button = bb.all('button.'+C_COLLAPSE),","            method = v ? 'addClass' : 'removeClass',","            str    = this.get('strings.'+(v ? 'expand' : 'collapse'));","","        bb[method](C_COLLAPSED);","","        if (button) {","            button.setHTML(str);","        }","","        this._uiSetHeight(v ? this._head.get('offsetHeight'): this.get(HEIGHT));","    },","","    /**","     * Makes adjustments to the UI if needed when the Console is hidden or shown","     *","     * @method _afterVisibleChange","     * @param e {Event} the visibleChange event","     * @protected","     */","    _afterVisibleChange : function (e) {","        Console.superclass._afterVisibleChange.apply(this,arguments);","","        this._uiUpdateFromHideShow(e.newVal);","    },","","    /**","     * Recalculates dimensions and updates appropriately when shown","     *","     * @method _uiUpdateFromHideShow","     * @param v {Boolean} true for visible, false for hidden","     * @protected","     */","    _uiUpdateFromHideShow : function (v) {","        if (v) {","            this._uiSetHeight(this.get(HEIGHT));","        }","    },","","    /**","     * Responds to log events by normalizing qualifying messages and passing","     * them along through the entry event for buffering etc.","     * ","     * @method _onLogEvent","     * @param msg {String} the log message","     * @param cat {String} OPTIONAL the category or logLevel of the message","     * @param src {String} OPTIONAL the source of the message (e.g. widget name)","     * @protected","     */","    _onLogEvent : function (e) {","","        if (!this.get(DISABLED) && this._isInLogLevel(e)) {","","            var debug = Y.config.debug;","","            /* TODO: needed? */","            Y.config.debug = false;","","            this.fire(ENTRY, {","                message : this._normalizeMessage(e)","            });","","            Y.config.debug = debug;","        }","    },","","    /**","     * Clears the console, resets the startTime attribute, enables and","     * unpauses the widget.","     *","     * @method _defResetFn","     * @protected","     */","    _defResetFn : function () {","        this.clearConsole();","        this.set(START_TIME,new Date());","        this.set(DISABLED,false);","        this.set(PAUSED,false);","    },","","    /**","     * Buffers incoming message objects and schedules the printing.","     *","     * @method _defEntryFn","     * @param e {Event} The Custom event carrying the message in its payload","     * @protected","     */","    _defEntryFn : function (e) {","        if (e.message) {","            this.buffer.push(e.message);","            this._schedulePrint();","        }","    }","","},","","// Y.Console static properties","{","    /**","     * The identity of the widget.","     *","     * @property NAME","     * @type String","     * @static","     */","    NAME : CONSOLE,","","    /**","     * Static identifier for logLevel configuration setting to allow all","     * incoming messages to generate Console entries.","     *","     * @property LOG_LEVEL_INFO","     * @type String","     * @static","     */","    LOG_LEVEL_INFO  : INFO,","","    /**","     * Static identifier for logLevel configuration setting to allow only","     * incoming messages of logLevel &quot;warn&quot; or &quot;error&quot;","     * to generate Console entries.","     *","     * @property LOG_LEVEL_WARN","     * @type String","     * @static","     */","    LOG_LEVEL_WARN  : WARN,","","    /**","     * Static identifier for logLevel configuration setting to allow only","     * incoming messages of logLevel &quot;error&quot; to generate","     * Console entries.","     *","     * @property LOG_LEVEL_ERROR","     * @type String","     * @static","     */","    LOG_LEVEL_ERROR : ERROR,","","    /**","     * Map (object) of classNames used to populate the placeholders in the","     * Console.ENTRY_TEMPLATE markup when rendering a new Console entry.","     *","     * <p>By default, the keys contained in the object are:</p>","     * <ul>","     *    <li>entry_class</li>","     *    <li>entry_meta_class</li>","     *    <li>entry_cat_class</li>","     *    <li>entry_src_class</li>","     *    <li>entry_time_class</li>","     *    <li>entry_content_class</li>","     * </ul>","     *","     * @property ENTRY_CLASSES","     * @type Object","     * @static","     */","    ENTRY_CLASSES   : {","        entry_class         : C_ENTRY,","        entry_meta_class    : C_ENTRY_META,","        entry_cat_class     : C_ENTRY_CAT,","        entry_src_class     : C_ENTRY_SRC,","        entry_time_class    : C_ENTRY_TIME,","        entry_content_class : C_ENTRY_CONTENT","    },","","    /**","     * Map (object) of classNames used to populate the placeholders in the","     * Console.HEADER_TEMPLATE, Console.BODY_TEMPLATE, and","     * Console.FOOTER_TEMPLATE markup when rendering the Console UI.","     *","     * <p>By default, the keys contained in the object are:</p>","     * <ul>","     *   <li>console_hd_class</li>","     *   <li>console_bd_class</li>","     *   <li>console_ft_class</li>","     *   <li>console_controls_class</li>","     *   <li>console_checkbox_class</li>","     *   <li>console_pause_class</li>","     *   <li>console_pause_label_class</li>","     *   <li>console_button_class</li>","     *   <li>console_clear_class</li>","     *   <li>console_collapse_class</li>","     *   <li>console_title_class</li>","     * </ul>","     *","     * @property CHROME_CLASSES","     * @type Object","     * @static","     */","    CHROME_CLASSES  : {","        console_hd_class       : C_CONSOLE_HD,","        console_bd_class       : C_CONSOLE_BD,","        console_ft_class       : C_CONSOLE_FT,","        console_controls_class : C_CONSOLE_CONTROLS,","        console_checkbox_class : C_CHECKBOX,","        console_pause_class    : C_PAUSE,","        console_pause_label_class : C_PAUSE_LABEL,","        console_button_class   : C_BUTTON,","        console_clear_class    : C_CLEAR,","        console_collapse_class : C_COLLAPSE,","        console_title_class    : C_CONSOLE_TITLE","    },","","    /**","     * Markup template used to generate the DOM structure for the header","     * section of the Console when it is rendered.  The template includes","     * these {placeholder}s:","     *","     * <ul>","     *   <li>console_button_class - contributed by Console.CHROME_CLASSES</li>","     *   <li>console_collapse_class - contributed by Console.CHROME_CLASSES</li>","     *   <li>console_hd_class - contributed by Console.CHROME_CLASSES</li>","     *   <li>console_title_class - contributed by Console.CHROME_CLASSES</li>","     *   <li>str_collapse - pulled from attribute strings.collapse</li>","     *   <li>str_title - pulled from attribute strings.title</li>","     * </ul>","     *","     * @property HEADER_TEMPLATE","     * @type String","     * @static","     */","    HEADER_TEMPLATE :","        '<div class=\"{console_hd_class}\">'+","            '<h4 class=\"{console_title_class}\">{str_title}</h4>'+","            '<button type=\"button\" class=\"'+","                '{console_button_class} {console_collapse_class}\">{str_collapse}'+","            '</button>'+","        '</div>',","","    /**","     * Markup template used to generate the DOM structure for the Console body","     * (where the messages are inserted) when it is rendered.  The template","     * includes only the {placeholder} &quot;console_bd_class&quot;, which is","     * constributed by Console.CHROME_CLASSES.","     *","     * @property BODY_TEMPLATE","     * @type String","     * @static","     */","    BODY_TEMPLATE : '<div class=\"{console_bd_class}\"></div>',","","    /**","     * Markup template used to generate the DOM structure for the footer","     * section of the Console when it is rendered.  The template includes","     * many of the {placeholder}s from Console.CHROME_CLASSES as well as:","     *","     * <ul>","     *   <li>id_guid - generated unique id, relates the label and checkbox</li>","     *   <li>str_pause - pulled from attribute strings.pause</li>","     *   <li>str_clear - pulled from attribute strings.clear</li>","     * </ul>","     *","     * @property FOOTER_TEMPLATE","     * @type String","     * @static","     */","    FOOTER_TEMPLATE :","        '<div class=\"{console_ft_class}\">'+","            '<div class=\"{console_controls_class}\">'+","                '<label class=\"{console_pause_label_class}\"><input type=\"checkbox\" class=\"{console_checkbox_class} {console_pause_class}\" value=\"1\" id=\"{id_guid}\"> {str_pause}</label>' +","                '<button type=\"button\" class=\"'+","                    '{console_button_class} {console_clear_class}\">{str_clear}'+","                '</button>'+","            '</div>'+","        '</div>',","","    /**","     * Default markup template used to create the DOM structure for Console","     * entries. The markup contains {placeholder}s for content and classes","     * that are replaced via Y.Lang.sub.  The default template contains","     * the {placeholder}s identified in Console.ENTRY_CLASSES as well as the","     * following placeholders that will be populated by the log entry data:","     *","     * <ul>","     *   <li>cat_class</li>","     *   <li>src_class</li>","     *   <li>totalTime</li>","     *   <li>elapsedTime</li>","     *   <li>localTime</li>","     *   <li>sourceAndDetail</li>","     *   <li>message</li>","     * </ul>","     *","     * @property ENTRY_TEMPLATE","     * @type String","     * @static","     */","    ENTRY_TEMPLATE : ENTRY_TEMPLATE_STR,","","    /**","     * Static property used to define the default attribute configuration of","     * the Widget.","     *","     * @property ATTRS","     * @Type Object","     * @static","     */","    ATTRS : {","","        /**","         * Name of the custom event that will communicate log messages.","         *","         * @attribute logEvent","         * @type String","         * @default \"yui:log\"","         */","        logEvent : {","            value : 'yui:log',","            writeOnce : true,","            validator : isString","        },","","        /**","         * Object that will emit the log events.  By default the YUI instance.","         * To have a single Console capture events from all YUI instances, set","         * this to the Y.Global object.","         *","         * @attribute logSource","         * @type EventTarget","         * @default Y","         */","        logSource : {","            value : Y,","            writeOnce : true,","            validator : function (v) {","                return this._validateLogSource(v);","            }","        },","","        /**","         * Collection of strings used to label elements in the Console UI.","         * Default collection contains the following name:value pairs:","         *","         * <ul>","         *   <li>title : &quot;Log Console&quot;</li>","         *   <li>pause : &quot;Pause&quot;</li>","         *   <li>clear : &quot;Clear&quot;</li>","         *   <li>collapse : &quot;Collapse&quot;</li>","         *   <li>expand : &quot;Expand&quot;</li>","         * </ul>","         *","         * @attribute strings","         * @type Object","         */","        strings : {","            valueFn: function() { return Y.Intl.get(\"console\"); }","        },","","        /**","         * Boolean to pause the outputting of new messages to the console.","         * When paused, messages will accumulate in the buffer.","         *","         * @attribute paused","         * @type boolean","         * @default false","         */","        paused : {","            value : false,","            validator : L.isBoolean","        },","","        /**","         * If a category is not specified in the Y.log(..) statement, this","         * category will be used. Categories &quot;info&quot;,","         * &quot;warn&quot;, and &quot;error&quot; are also called log level.","         *","         * @attribute defaultCategory","         * @type String","         * @default \"info\"","         */","        defaultCategory : {","            value : INFO,","            validator : isString","        },","","        /**","         * If a source is not specified in the Y.log(..) statement, this","         * source will be used.","         *","         * @attribute defaultSource","         * @type String","         * @default \"global\"","         */","        defaultSource   : {","            value : 'global',","            validator : isString","        },","","        /**","         * Markup template used to create the DOM structure for Console entries.","         *","         * @attribute entryTemplate","         * @type String","         * @default Console.ENTRY_TEMPLATE","         */","        entryTemplate : {","            value : ENTRY_TEMPLATE_STR,","            validator : isString","        },","","        /**","         * Minimum entry log level to render into the Console.  The initial","         * logLevel value for all Console instances defaults from the","         * Y.config.logLevel YUI configuration, or Console.LOG_LEVEL_INFO if","         * that configuration is not set.","         *","         * Possible values are &quot;info&quot;, &quot;warn&quot;,","         * &quot;error&quot; (case insensitive), or their corresponding statics","         * Console.LOG_LEVEL_INFO and so on.","         *","         * @attribute logLevel","         * @type String","         * @default Y.config.logLevel or Console.LOG_LEVEL_INFO","         */","        logLevel : {","            value : Y.config.logLevel || INFO,","            setter : function (v) {","                return this._setLogLevel(v);","            }","        },","","        /**","         * Millisecond timeout between iterations of the print loop, moving","         * entries from the buffer to the UI.","         *","         * @attribute printTimeout","         * @type Number","         * @default 100","         */","        printTimeout : {","            value : 100,","            validator : isNumber","        },","","        /**","         * Maximum number of entries printed in each iteration of the print","         * loop. This is used to prevent excessive logging locking the page UI.","         *","         * @attribute printLimit","         * @type Number","         * @default 50","         */","        printLimit : {","            value : 50,","            validator : isNumber","        },","","        /**","         * Maximum number of Console entries allowed in the Console body at one","         * time.  This is used to keep acquired messages from exploding the","         * DOM tree and impacting page performance.","         *","         * @attribute consoleLimit","         * @type Number","         * @default 300","         */","        consoleLimit : {","            value : 300,","            validator : isNumber","        },","","        /**","         * New entries should display at the top of the Console or the bottom?","         *","         * @attribute newestOnTop","         * @type Boolean","         * @default true","         */","        newestOnTop : {","            value : true","        },","","        /**","         * When new entries are added to the Console UI, should they be","         * scrolled into view?","         *","         * @attribute scrollIntoView","         * @type Boolean","         * @default true","         */","        scrollIntoView : {","            value : true","        },","","        /**","         * The baseline time for this Console instance, used to measure elapsed","         * time from the moment the console module is <code>use</code>d to the","         * moment each new entry is logged (not rendered).","         *","         * This value is reset by the instance method myConsole.reset().","         *","         * @attribute startTime","         * @type Date","         * @default The moment the console module is <code>use</code>d","         */","        startTime : {","            value : new Date()","        },","","        /**","         * The precise time the last entry was logged.  Used to measure elapsed","         * time between log messages.","         *","         * @attribute lastTime","         * @type Date","         * @default The moment the console module is <code>use</code>d","         */","        lastTime : {","            value : new Date(),","            readOnly: true","        },","","        /**","         * Controls the collapsed state of the Console","         *","         * @attribute collapsed","         * @type Boolean","         * @default false","         */","        collapsed : {","            value : false","        },","","        /**","        * String with units, or number, representing the height of the Console,","        * inclusive of header and footer. If a number is provided, the default","        * unit, defined by Widget's DEF_UNIT, property is used.","        *","        * @attribute height","        * @default \"300px\"","        * @type {String | Number}","        */","        height: {","            value: \"300px\"","        },","","        /**","        * String with units, or number, representing the width of the Console.","        * If a number is provided, the default unit, defined by Widget's","        * DEF_UNIT, property is used.","        *","        * @attribute width","        * @default \"300px\"","        * @type {String | Number}","        */","        width: {","            value: \"300px\"","        },","","        /**","         * Pass through to the YUI instance useBrowserConsole configuration.","         * By default this is set to false, which will disable logging to the","         * browser console when a Console instance is created.  If the","         * logSource is not a YUI instance, this has no effect.","         * ","         * @attribute useBrowserConsole","         * @type {Boolean}","         * @default false","         */","         useBrowserConsole : {","            lazyAdd: false,","            value: false,","            getter : function () {","                return this._getUseBrowserConsole();","            },","            setter : function (v) {","                return this._setUseBrowserConsole(v);","            }","         },","","         /**","          * Allows the Console to flow in the document.  Available values are","          * 'inline', 'block', and 'separate' (the default).  ","          *","          * @attribute style","          * @type {String}","          * @default 'separate'","          */","         style : {","            value : 'separate',","            writeOnce : true,","            validator : function (v) {","                return this._validateStyle(v);","            }","         }","    }","","});","","","}, '3.7.3', {\"requires\": [\"yui-log\", \"widget\"], \"skinnable\": true, \"lang\": [\"en\", \"es\", \"ja\"]});"];
_yuitest_coverage["build/console/console.js"].lines = {"1":0,"21":0,"94":0,"95":0,"98":0,"171":0,"173":0,"184":0,"186":0,"188":0,"190":0,"200":0,"202":0,"212":0,"214":0,"224":0,"226":0,"241":0,"249":0,"250":0,"253":0,"256":0,"258":0,"260":0,"261":0,"264":0,"265":0,"268":0,"269":0,"270":0,"273":0,"275":0,"276":0,"279":0,"284":0,"286":0,"298":0,"300":0,"302":0,"317":0,"326":0,"328":0,"338":0,"340":0,"342":0,"344":0,"354":0,"355":0,"356":0,"359":0,"360":0,"361":0,"371":0,"372":0,"373":0,"383":0,"386":0,"389":0,"393":0,"395":0,"397":0,"399":0,"411":0,"417":0,"419":0,"430":0,"434":0,"444":0,"450":0,"452":0,"463":0,"465":0,"466":0,"468":0,"469":0,"472":0,"474":0,"478":0,"501":0,"517":0,"519":0,"521":0,"522":0,"524":0,"526":0,"536":0,"537":0,"553":0,"561":0,"563":0,"574":0,"578":0,"590":0,"591":0,"592":0,"593":0,"595":0,"608":0,"610":0,"615":0,"616":0,"617":0,"619":0,"620":0,"621":0,"622":0,"624":0,"627":0,"629":0,"630":0,"631":0,"632":0,"636":0,"641":0,"654":0,"668":0,"669":0,"670":0,"684":0,"696":0,"708":0,"720":0,"734":0,"748":0,"749":0,"752":0,"764":0,"765":0,"782":0,"783":0,"784":0,"785":0,"786":0,"788":0,"803":0,"805":0,"806":0,"810":0,"835":0,"840":0,"841":0,"844":0,"845":0,"848":0,"849":0,"861":0,"863":0,"864":0,"867":0,"868":0,"869":0,"870":0,"882":0,"884":0,"885":0,"898":0,"911":0,"922":0,"927":0,"929":0,"930":0,"933":0,"944":0,"946":0,"957":0,"958":0,"974":0,"976":0,"979":0,"981":0,"985":0,"997":0,"998":0,"999":0,"1000":0,"1011":0,"1012":0,"1013":0,"1249":0,"1269":0,"1341":0,"1487":0,"1490":0,"1506":0};
_yuitest_coverage["build/console/console.js"].functions = {"Console:94":0,"log:170":0,"clearConsole:182":0,"reset:199":0,"collapse:211":0,"expand:223":0,"printBuffer:240":0,"initializer:297":0,"destructor:337":0,"renderUI:353":0,"syncUI:370":0,"bindUI:382":0,"_initHead:410":0,"_initBody:429":0,"_initFoot:443":0,"_isInLogLevel:462":0,"_normalizeMessage:499":0,"_schedulePrint:535":0,"(anonymous 2):562":0,"_createEntryHTML:552":0,"scrollToLatest:573":0,"_htmlEscapeMessage:589":0,"_trimOldEntries:605":0,"_encodeHTML:653":0,"_cancelPrintLoop:667":0,"_validateStyle:683":0,"_onPauseClick:695":0,"_onClearClick:707":0,"_onCollapseClick:719":0,"_validateLogSource:733":0,"_setLogLevel:747":0,"_getUseBrowserConsole:763":0,"_setUseBrowserConsole:781":0,"_uiSetHeight:802":0,"_afterStringsChange:834":0,"_afterPausedChange:860":0,"_uiUpdatePaused:881":0,"_afterConsoleLimitChange:897":0,"_afterCollapsedChange:910":0,"_uiUpdateCollapsed:921":0,"_afterVisibleChange:943":0,"_uiUpdateFromHideShow:956":0,"_onLogEvent:972":0,"_defResetFn:996":0,"_defEntryFn:1010":0,"validator:1248":0,"valueFn:1269":0,"setter:1340":0,"getter:1486":0,"setter:1489":0,"validator:1505":0,"(anonymous 1):1":0};
_yuitest_coverage["build/console/console.js"].coveredLines = 184;
_yuitest_coverage["build/console/console.js"].coveredFunctions = 52;
_yuitest_coverline("build/console/console.js", 1);
YUI.add('console', function (Y, NAME) {

/**
 * Console creates a visualization for messages logged through calls to a YUI
 * instance's <code>Y.log( message, category, source )</code> method.  The
 * debug versions of YUI modules will include logging statements to offer some
 * insight into the steps executed during that module's operation.  Including
 * log statements in your code will cause those messages to also appear in the
 * Console.  Use Console to aid in developing your page or application.
 *
 * Entry categories &quot;info&quot;, &quot;warn&quot;, and &quot;error&quot;
 * are also referred to as the log level, and entries are filtered against the
 * configured logLevel.
 *
 * @module console
 * @class Console
 * @extends Widget
 * @param conf {Object} Configuration object (see Configuration attributes)
 * @constructor
 */
_yuitest_coverfunc("build/console/console.js", "(anonymous 1)", 1);
_yuitest_coverline("build/console/console.js", 21);
var getCN = Y.ClassNameManager.getClassName,
    CHECKED        = 'checked',
    CLEAR          = 'clear',
    CLICK          = 'click',
    COLLAPSED      = 'collapsed',
    CONSOLE        = 'console',
    CONTENT_BOX    = 'contentBox',
    DISABLED       = 'disabled',
    ENTRY          = 'entry',
    ERROR          = 'error',
    HEIGHT         = 'height',
    INFO           = 'info',
    LAST_TIME      = 'lastTime',
    PAUSE          = 'pause',
    PAUSED         = 'paused',
    RESET          = 'reset',
    START_TIME     = 'startTime',
    TITLE          = 'title',
    WARN           = 'warn',

    DOT = '.',

    C_BUTTON           = getCN(CONSOLE,'button'),
    C_CHECKBOX         = getCN(CONSOLE,'checkbox'),
    C_CLEAR            = getCN(CONSOLE,CLEAR),
    C_COLLAPSE         = getCN(CONSOLE,'collapse'),
    C_COLLAPSED        = getCN(CONSOLE,COLLAPSED),
    C_CONSOLE_CONTROLS = getCN(CONSOLE,'controls'),
    C_CONSOLE_HD       = getCN(CONSOLE,'hd'),
    C_CONSOLE_BD       = getCN(CONSOLE,'bd'),
    C_CONSOLE_FT       = getCN(CONSOLE,'ft'),
    C_CONSOLE_TITLE    = getCN(CONSOLE,TITLE),
    C_ENTRY            = getCN(CONSOLE,ENTRY),
    C_ENTRY_CAT        = getCN(CONSOLE,ENTRY,'cat'),
    C_ENTRY_CONTENT    = getCN(CONSOLE,ENTRY,'content'),
    C_ENTRY_META       = getCN(CONSOLE,ENTRY,'meta'),
    C_ENTRY_SRC        = getCN(CONSOLE,ENTRY,'src'),
    C_ENTRY_TIME       = getCN(CONSOLE,ENTRY,'time'),
    C_PAUSE            = getCN(CONSOLE,PAUSE),
    C_PAUSE_LABEL      = getCN(CONSOLE,PAUSE,'label'),

    RE_INLINE_SOURCE = /^(\S+)\s/,
    RE_AMP = /&(?!#?[a-z0-9]+;)/g,
    RE_GT  = />/g,
    RE_LT  = /</g,

    ESC_AMP = '&#38;',
    ESC_GT  = '&#62;',
    ESC_LT  = '&#60;',
    
    ENTRY_TEMPLATE_STR =
        '<div class="{entry_class} {cat_class} {src_class}">'+
            '<p class="{entry_meta_class}">'+
                '<span class="{entry_src_class}">'+
                    '{sourceAndDetail}'+
                '</span>'+
                '<span class="{entry_cat_class}">'+
                    '{category}</span>'+
                '<span class="{entry_time_class}">'+
                    ' {totalTime}ms (+{elapsedTime}) {localTime}'+
                '</span>'+
            '</p>'+
            '<pre class="{entry_content_class}">{message}</pre>'+
        '</div>',

    L = Y.Lang,
    create     = Y.Node.create,
    isNumber   = L.isNumber,
    isString   = L.isString,
    merge      = Y.merge,
    substitute = Y.Lang.sub;
    

_yuitest_coverline("build/console/console.js", 94);
function Console() {
    _yuitest_coverfunc("build/console/console.js", "Console", 94);
_yuitest_coverline("build/console/console.js", 95);
Console.superclass.constructor.apply(this,arguments);
}

_yuitest_coverline("build/console/console.js", 98);
Y.Console = Y.extend(Console, Y.Widget,

// Y.Console prototype
{
    /**
     * Category to prefix all event subscriptions to allow for ease of detach
     * during destroy.
     *
     * @property _evtCat
     * @type string
     * @protected
     */
    _evtCat : null,

    /**
     * Reference to the Node instance containing the header contents.
     *
     * @property _head
     * @type Node
     * @default null
     * @protected
     */
    _head    : null,

    /**
     * Reference to the Node instance that will house the console messages.
     *
     * @property _body
     * @type Node
     * @default null
     * @protected
     */
    _body    : null,

    /**
     * Reference to the Node instance containing the footer contents.
     *
     * @property _foot
     * @type Node
     * @default null
     * @protected
     */
    _foot    : null,

    /**
     * Holds the object API returned from <code>Y.later</code> for the print
     * loop interval.
     *
     * @property _printLoop
     * @type Object
     * @default null
     * @protected
     */
    _printLoop : null,

    /**
     * Array of normalized message objects awaiting printing.
     *
     * @property buffer
     * @type Array
     * @default null
     * @protected
     */
    buffer   : null,

    /**
     * Wrapper for <code>Y.log</code>.
     *
     * @method log
     * @param arg* {MIXED} (all arguments passed through to <code>Y.log</code>)
     * @chainable
     */
    log : function () {
        _yuitest_coverfunc("build/console/console.js", "log", 170);
_yuitest_coverline("build/console/console.js", 171);
Y.log.apply(Y,arguments);

        _yuitest_coverline("build/console/console.js", 173);
return this;
    },

    /**
     * Clear the console of messages and flush the buffer of pending messages.
     *
     * @method clearConsole
     * @chainable
     */
    clearConsole : function () {
        // TODO: clear event listeners from console contents
        _yuitest_coverfunc("build/console/console.js", "clearConsole", 182);
_yuitest_coverline("build/console/console.js", 184);
this._body.empty();

        _yuitest_coverline("build/console/console.js", 186);
this._cancelPrintLoop();

        _yuitest_coverline("build/console/console.js", 188);
this.buffer = [];

        _yuitest_coverline("build/console/console.js", 190);
return this;
    },

    /**
     * Clears the console and resets internal timers.
     *
     * @method reset
     * @chainable
     */
    reset : function () {
        _yuitest_coverfunc("build/console/console.js", "reset", 199);
_yuitest_coverline("build/console/console.js", 200);
this.fire(RESET);
        
        _yuitest_coverline("build/console/console.js", 202);
return this;
    },

    /**
     * Collapses the body and footer.
     *
     * @method collapse
     * @chainable
     */
    collapse : function () {
        _yuitest_coverfunc("build/console/console.js", "collapse", 211);
_yuitest_coverline("build/console/console.js", 212);
this.set(COLLAPSED, true);

        _yuitest_coverline("build/console/console.js", 214);
return this;
    },

    /**
     * Expands the body and footer if collapsed.
     *
     * @method expand
     * @chainable
     */
    expand : function () {
        _yuitest_coverfunc("build/console/console.js", "expand", 223);
_yuitest_coverline("build/console/console.js", 224);
this.set(COLLAPSED, false);

        _yuitest_coverline("build/console/console.js", 226);
return this;
    },

    /**
     * Outputs buffered messages to the console UI.  This is typically called
     * from a scheduled interval until the buffer is empty (referred to as the
     * print loop).  The number of buffered messages output to the Console is
     * limited to the number provided as an argument.  If no limit is passed,
     * all buffered messages are rendered.
     * 
     * @method printBuffer
     * @param limit {Number} (optional) max number of buffered entries to write
     * @chainable
     */
    printBuffer: function (limit) {
        _yuitest_coverfunc("build/console/console.js", "printBuffer", 240);
_yuitest_coverline("build/console/console.js", 241);
var messages    = this.buffer,
            debug       = Y.config.debug,
            entries     = [],
            consoleLimit= this.get('consoleLimit'),
            newestOnTop = this.get('newestOnTop'),
            anchor      = newestOnTop ? this._body.get('firstChild') : null,
            i;

        _yuitest_coverline("build/console/console.js", 249);
if (messages.length > consoleLimit) {
            _yuitest_coverline("build/console/console.js", 250);
messages.splice(0, messages.length - consoleLimit);
        }

        _yuitest_coverline("build/console/console.js", 253);
limit = Math.min(messages.length, (limit || messages.length));
        
        // turn off logging system
        _yuitest_coverline("build/console/console.js", 256);
Y.config.debug = false;

        _yuitest_coverline("build/console/console.js", 258);
if (!this.get(PAUSED) && this.get('rendered')) {

            _yuitest_coverline("build/console/console.js", 260);
for (i = 0; i < limit && messages.length; ++i) {
                _yuitest_coverline("build/console/console.js", 261);
entries[i] = this._createEntryHTML(messages.shift());
            }

            _yuitest_coverline("build/console/console.js", 264);
if (!messages.length) {
                _yuitest_coverline("build/console/console.js", 265);
this._cancelPrintLoop();
            }

            _yuitest_coverline("build/console/console.js", 268);
if (entries.length) {
                _yuitest_coverline("build/console/console.js", 269);
if (newestOnTop) {
                    _yuitest_coverline("build/console/console.js", 270);
entries.reverse();
                }

                _yuitest_coverline("build/console/console.js", 273);
this._body.insertBefore(create(entries.join('')), anchor);

                _yuitest_coverline("build/console/console.js", 275);
if (this.get('scrollIntoView')) {
                    _yuitest_coverline("build/console/console.js", 276);
this.scrollToLatest();
                }

                _yuitest_coverline("build/console/console.js", 279);
this._trimOldEntries();
            }
        }

        // restore logging system
        _yuitest_coverline("build/console/console.js", 284);
Y.config.debug = debug;

        _yuitest_coverline("build/console/console.js", 286);
return this;
    },

    
    /**
     * Constructor code.  Set up the buffer and entry template, publish
     * internal events, and subscribe to the configured logEvent.
     * 
     * @method initializer
     * @protected
     */
    initializer : function () {
        _yuitest_coverfunc("build/console/console.js", "initializer", 297);
_yuitest_coverline("build/console/console.js", 298);
this._evtCat = Y.stamp(this) + '|';

        _yuitest_coverline("build/console/console.js", 300);
this.buffer = [];

        _yuitest_coverline("build/console/console.js", 302);
this.get('logSource').on(this._evtCat +
            this.get('logEvent'),Y.bind("_onLogEvent",this));

        /**
         * Transfers a received message to the print loop buffer.  Default
         * behavior defined in _defEntryFn.
         *
         * @event entry
         * @param event {Event.Facade} An Event Facade object with the following attribute specific properties added:
         *  <dl>
         *      <dt>message</dt>
         *          <dd>The message data normalized into an object literal (see _normalizeMessage)</dd>
         *  </dl>
         * @preventable _defEntryFn
         */
        _yuitest_coverline("build/console/console.js", 317);
this.publish(ENTRY, { defaultFn: this._defEntryFn });

        /**
         * Triggers the reset behavior via the default logic in _defResetFn.
         *
         * @event reset
         * @param event {Event.Facade} Event Facade object
         * @preventable _defResetFn
         */
        _yuitest_coverline("build/console/console.js", 326);
this.publish(RESET, { defaultFn: this._defResetFn });

        _yuitest_coverline("build/console/console.js", 328);
this.after('rendered', this._schedulePrint);
    },

    /**
     * Tears down the instance, flushing event subscriptions and purging the UI.
     *
     * @method destructor
     * @protected
     */
    destructor : function () {
        _yuitest_coverfunc("build/console/console.js", "destructor", 337);
_yuitest_coverline("build/console/console.js", 338);
var bb = this.get('boundingBox');

        _yuitest_coverline("build/console/console.js", 340);
this._cancelPrintLoop();

        _yuitest_coverline("build/console/console.js", 342);
this.get('logSource').detach(this._evtCat + '*');
        
        _yuitest_coverline("build/console/console.js", 344);
bb.purge(true);
    },

    /**
     * Generate the Console UI.
     *
     * @method renderUI
     * @protected
     */
    renderUI : function () {
        _yuitest_coverfunc("build/console/console.js", "renderUI", 353);
_yuitest_coverline("build/console/console.js", 354);
this._initHead();
        _yuitest_coverline("build/console/console.js", 355);
this._initBody();
        _yuitest_coverline("build/console/console.js", 356);
this._initFoot();

        // Apply positioning to the bounding box if appropriate
        _yuitest_coverline("build/console/console.js", 359);
var style = this.get('style');
        _yuitest_coverline("build/console/console.js", 360);
if (style !== 'block') {
            _yuitest_coverline("build/console/console.js", 361);
this.get('boundingBox').addClass(this.getClassName(style));
        }
    },

    /**
     * Sync the UI state to the current attribute state.
     *
     * @method syncUI
     */
    syncUI : function () {
        _yuitest_coverfunc("build/console/console.js", "syncUI", 370);
_yuitest_coverline("build/console/console.js", 371);
this._uiUpdatePaused(this.get(PAUSED));
        _yuitest_coverline("build/console/console.js", 372);
this._uiUpdateCollapsed(this.get(COLLAPSED));
        _yuitest_coverline("build/console/console.js", 373);
this._uiSetHeight(this.get(HEIGHT));
    },

    /**
     * Set up event listeners to wire up the UI to the internal state.
     *
     * @method bindUI
     * @protected
     */
    bindUI : function () {
        _yuitest_coverfunc("build/console/console.js", "bindUI", 382);
_yuitest_coverline("build/console/console.js", 383);
this.get(CONTENT_BOX).one('button.'+C_COLLAPSE).
            on(CLICK,this._onCollapseClick,this);

        _yuitest_coverline("build/console/console.js", 386);
this.get(CONTENT_BOX).one('input[type=checkbox].'+C_PAUSE).
            on(CLICK,this._onPauseClick,this);

        _yuitest_coverline("build/console/console.js", 389);
this.get(CONTENT_BOX).one('button.'+C_CLEAR).
            on(CLICK,this._onClearClick,this);

        // Attribute changes
        _yuitest_coverline("build/console/console.js", 393);
this.after(this._evtCat + 'stringsChange',
            this._afterStringsChange);
        _yuitest_coverline("build/console/console.js", 395);
this.after(this._evtCat + 'pausedChange',
            this._afterPausedChange);
        _yuitest_coverline("build/console/console.js", 397);
this.after(this._evtCat + 'consoleLimitChange',
            this._afterConsoleLimitChange);
        _yuitest_coverline("build/console/console.js", 399);
this.after(this._evtCat + 'collapsedChange',
            this._afterCollapsedChange);
    },

    
    /**
     * Create the DOM structure for the header elements.
     *
     * @method _initHead
     * @protected
     */
    _initHead : function () {
        _yuitest_coverfunc("build/console/console.js", "_initHead", 410);
_yuitest_coverline("build/console/console.js", 411);
var cb   = this.get(CONTENT_BOX),
            info = merge(Console.CHROME_CLASSES, {
                        str_collapse : this.get('strings.collapse'),
                        str_title : this.get('strings.title')
                    });

        _yuitest_coverline("build/console/console.js", 417);
this._head = create(substitute(Console.HEADER_TEMPLATE,info));

        _yuitest_coverline("build/console/console.js", 419);
cb.insertBefore(this._head,cb.get('firstChild'));
    },

    /**
     * Create the DOM structure for the console body&#8212;where messages are
     * rendered.
     *
     * @method _initBody
     * @protected
     */
    _initBody : function () {
        _yuitest_coverfunc("build/console/console.js", "_initBody", 429);
_yuitest_coverline("build/console/console.js", 430);
this._body = create(substitute(
                            Console.BODY_TEMPLATE,
                            Console.CHROME_CLASSES));

        _yuitest_coverline("build/console/console.js", 434);
this.get(CONTENT_BOX).appendChild(this._body);
    },

    /**
     * Create the DOM structure for the footer elements.
     *
     * @method _initFoot
     * @protected
     */
    _initFoot : function () {
        _yuitest_coverfunc("build/console/console.js", "_initFoot", 443);
_yuitest_coverline("build/console/console.js", 444);
var info = merge(Console.CHROME_CLASSES, {
                id_guid   : Y.guid(),
                str_pause : this.get('strings.pause'),
                str_clear : this.get('strings.clear')
            });

        _yuitest_coverline("build/console/console.js", 450);
this._foot = create(substitute(Console.FOOTER_TEMPLATE,info));

        _yuitest_coverline("build/console/console.js", 452);
this.get(CONTENT_BOX).appendChild(this._foot);
    },

    /**
     * Determine if incoming log messages are within the configured logLevel
     * to be buffered for printing.
     *
     * @method _isInLogLevel
     * @protected
     */
    _isInLogLevel : function (e) {
        _yuitest_coverfunc("build/console/console.js", "_isInLogLevel", 462);
_yuitest_coverline("build/console/console.js", 463);
var cat = e.cat, lvl = this.get('logLevel');

        _yuitest_coverline("build/console/console.js", 465);
if (lvl !== INFO) {
            _yuitest_coverline("build/console/console.js", 466);
cat = cat || INFO;

            _yuitest_coverline("build/console/console.js", 468);
if (isString(cat)) {
                _yuitest_coverline("build/console/console.js", 469);
cat = cat.toLowerCase();
            }

            _yuitest_coverline("build/console/console.js", 472);
if ((cat === WARN && lvl === ERROR) ||
                (cat === INFO && lvl !== INFO)) {
                _yuitest_coverline("build/console/console.js", 474);
return false;
            }
        }

        _yuitest_coverline("build/console/console.js", 478);
return true;
    },

    /**
     * Create a log entry message from the inputs including the following keys:
     * <ul>
     *     <li>time - this moment</li>
     *     <li>message - leg message</li>
     *     <li>category - logLevel or custom category for the message</li>
     *     <li>source - when provided, the widget or util calling Y.log</li>
     *     <li>sourceAndDetail - same as source but can include instance info</li>
     *     <li>localTime - readable version of time</li>
     *     <li>elapsedTime - ms since last entry</li>
     *     <li>totalTime - ms since Console was instantiated or reset</li>
     * </ul>
     *
     * @method _normalizeMessage
     * @param e {Event} custom event containing the log message
     * @return Object the message object
     * @protected
     */
    _normalizeMessage : function (e) {

        _yuitest_coverfunc("build/console/console.js", "_normalizeMessage", 499);
_yuitest_coverline("build/console/console.js", 501);
var msg = e.msg,
            cat = e.cat,
            src = e.src,

            m = {
                time            : new Date(),
                message         : msg,
                category        : cat || this.get('defaultCategory'),
                sourceAndDetail : src || this.get('defaultSource'),
                source          : null,
                localTime       : null,
                elapsedTime     : null,
                totalTime       : null
            };

        // Extract m.source "Foo" from m.sourceAndDetail "Foo bar baz"
        _yuitest_coverline("build/console/console.js", 517);
m.source          = RE_INLINE_SOURCE.test(m.sourceAndDetail) ?
                                RegExp.$1 : m.sourceAndDetail;
        _yuitest_coverline("build/console/console.js", 519);
m.localTime       = m.time.toLocaleTimeString ? 
                            m.time.toLocaleTimeString() : (m.time + '');
        _yuitest_coverline("build/console/console.js", 521);
m.elapsedTime     = m.time - this.get(LAST_TIME);
        _yuitest_coverline("build/console/console.js", 522);
m.totalTime       = m.time - this.get(START_TIME);

        _yuitest_coverline("build/console/console.js", 524);
this._set(LAST_TIME,m.time);

        _yuitest_coverline("build/console/console.js", 526);
return m;
    },

    /**
     * Sets an interval for buffered messages to be output to the console.
     *
     * @method _schedulePrint
     * @protected
     */
    _schedulePrint : function () {
        _yuitest_coverfunc("build/console/console.js", "_schedulePrint", 535);
_yuitest_coverline("build/console/console.js", 536);
if (!this._printLoop && !this.get(PAUSED) && this.get('rendered')) {
            _yuitest_coverline("build/console/console.js", 537);
this._printLoop = Y.later(
                                this.get('printTimeout'),
                                this, this.printBuffer,
                                this.get('printLimit'), true);
        }
    },

    /**
     * Translates message meta into the markup for a console entry.
     *
     * @method _createEntryHTML
     * @param m {Object} object literal containing normalized message metadata
     * @return String
     * @protected
     */
    _createEntryHTML : function (m) {
        _yuitest_coverfunc("build/console/console.js", "_createEntryHTML", 552);
_yuitest_coverline("build/console/console.js", 553);
m = merge(
                this._htmlEscapeMessage(m),
                Console.ENTRY_CLASSES,
                {
                    cat_class : this.getClassName(ENTRY,m.category),
                    src_class : this.getClassName(ENTRY,m.source)
                });

        _yuitest_coverline("build/console/console.js", 561);
return this.get('entryTemplate').replace(/\{(\w+)\}/g,
            function (_,token) {
                _yuitest_coverfunc("build/console/console.js", "(anonymous 2)", 562);
_yuitest_coverline("build/console/console.js", 563);
return token in m ? m[token] : '';
            });
    },

    /**
     * Scrolls to the most recent entry
     *
     * @method scrollToLatest
     * @chainable
     */
    scrollToLatest : function () {
        _yuitest_coverfunc("build/console/console.js", "scrollToLatest", 573);
_yuitest_coverline("build/console/console.js", 574);
var scrollTop = this.get('newestOnTop') ?
                            0 :
                            this._body.get('scrollHeight');

        _yuitest_coverline("build/console/console.js", 578);
this._body.set('scrollTop', scrollTop);
    },

    /**
     * Performs HTML escaping on strings in the message object.
     *
     * @method _htmlEscapeMessage
     * @param m {Object} the normalized message object
     * @return Object the message object with proper escapement
     * @protected
     */
    _htmlEscapeMessage : function (m) {
        _yuitest_coverfunc("build/console/console.js", "_htmlEscapeMessage", 589);
_yuitest_coverline("build/console/console.js", 590);
m.message         = this._encodeHTML(m.message);
        _yuitest_coverline("build/console/console.js", 591);
m.source          = this._encodeHTML(m.source);
        _yuitest_coverline("build/console/console.js", 592);
m.sourceAndDetail = this._encodeHTML(m.sourceAndDetail);
        _yuitest_coverline("build/console/console.js", 593);
m.category        = this._encodeHTML(m.category);

        _yuitest_coverline("build/console/console.js", 595);
return m;
    },

    /**
     * Removes the oldest message entries from the UI to maintain the limit
     * specified in the consoleLimit configuration.
     *
     * @method _trimOldEntries
     * @protected
     */
    _trimOldEntries : function () {
        // Turn off the logging system for the duration of this operation
        // to prevent an infinite loop
        _yuitest_coverfunc("build/console/console.js", "_trimOldEntries", 605);
_yuitest_coverline("build/console/console.js", 608);
Y.config.debug = false;

        _yuitest_coverline("build/console/console.js", 610);
var bd = this._body,
            limit = this.get('consoleLimit'),
            debug = Y.config.debug,
            entries,e,i,l;

        _yuitest_coverline("build/console/console.js", 615);
if (bd) {
            _yuitest_coverline("build/console/console.js", 616);
entries = bd.all(DOT+C_ENTRY);
            _yuitest_coverline("build/console/console.js", 617);
l = entries.size() - limit;

            _yuitest_coverline("build/console/console.js", 619);
if (l > 0) {
                _yuitest_coverline("build/console/console.js", 620);
if (this.get('newestOnTop')) {
                    _yuitest_coverline("build/console/console.js", 621);
i = limit;
                    _yuitest_coverline("build/console/console.js", 622);
l = entries.size();
                } else {
                    _yuitest_coverline("build/console/console.js", 624);
i = 0;
                }

                _yuitest_coverline("build/console/console.js", 627);
this._body.setStyle('display','none');

                _yuitest_coverline("build/console/console.js", 629);
for (;i < l; ++i) {
                    _yuitest_coverline("build/console/console.js", 630);
e = entries.item(i);
                    _yuitest_coverline("build/console/console.js", 631);
if (e) {
                        _yuitest_coverline("build/console/console.js", 632);
e.remove();
                    }
                }

                _yuitest_coverline("build/console/console.js", 636);
this._body.setStyle('display','');
            }

        }

        _yuitest_coverline("build/console/console.js", 641);
Y.config.debug = debug;
    },

    /**
     * Returns the input string with ampersands (&amp;), &lt, and &gt; encoded
     * as HTML entities.
     *
     * @method _encodeHTML
     * @param s {String} the raw string
     * @return String the encoded string
     * @protected
     */
    _encodeHTML : function (s) {
        _yuitest_coverfunc("build/console/console.js", "_encodeHTML", 653);
_yuitest_coverline("build/console/console.js", 654);
return isString(s) ?
            s.replace(RE_AMP,ESC_AMP).
              replace(RE_LT, ESC_LT).
              replace(RE_GT, ESC_GT) :
            s;
    },

    /**
     * Clears the timeout for printing buffered messages.
     *
     * @method _cancelPrintLoop
     * @protected
     */
    _cancelPrintLoop : function () {
        _yuitest_coverfunc("build/console/console.js", "_cancelPrintLoop", 667);
_yuitest_coverline("build/console/console.js", 668);
if (this._printLoop) {
            _yuitest_coverline("build/console/console.js", 669);
this._printLoop.cancel();
            _yuitest_coverline("build/console/console.js", 670);
this._printLoop = null;
        }
    },

    /**
     * Validates input value for style attribute.  Accepts only values 'inline',
     * 'block', and 'separate'.
     *
     * @method _validateStyle
     * @param style {String} the proposed value
     * @return {Boolean} pass/fail
     * @protected
     */
    _validateStyle : function (style) {
        _yuitest_coverfunc("build/console/console.js", "_validateStyle", 683);
_yuitest_coverline("build/console/console.js", 684);
return style === 'inline' || style === 'block' || style === 'separate';
    },

    /**
     * Event handler for clicking on the Pause checkbox to update the paused
     * attribute.
     *
     * @method _onPauseClick
     * @param e {Event} DOM event facade for the click event
     * @protected
     */
    _onPauseClick : function (e) {
        _yuitest_coverfunc("build/console/console.js", "_onPauseClick", 695);
_yuitest_coverline("build/console/console.js", 696);
this.set(PAUSED,e.target.get(CHECKED));
    },

    /**
     * Event handler for clicking on the Clear button.  Pass-through to
     * <code>this.clearConsole()</code>.
     *
     * @method _onClearClick
     * @param e {Event} DOM event facade for the click event
     * @protected
     */
    _onClearClick : function (e) {
        _yuitest_coverfunc("build/console/console.js", "_onClearClick", 707);
_yuitest_coverline("build/console/console.js", 708);
this.clearConsole();
    },

    /**
     * Event handler for clicking on the Collapse/Expand button. Sets the
     * &quot;collapsed&quot; attribute accordingly.
     *
     * @method _onCollapseClick
     * @param e {Event} DOM event facade for the click event
     * @protected
     */
    _onCollapseClick : function (e) {
        _yuitest_coverfunc("build/console/console.js", "_onCollapseClick", 719);
_yuitest_coverline("build/console/console.js", 720);
this.set(COLLAPSED, !this.get(COLLAPSED));
    },


    /**
     * Validator for logSource attribute.
     *
     * @method _validateLogSource
     * @param v {Object} the desired logSource
     * @return {Boolean} true if the input is an object with an <code>on</code>
     *                   method
     * @protected
     */
    _validateLogSource: function (v) {
        _yuitest_coverfunc("build/console/console.js", "_validateLogSource", 733);
_yuitest_coverline("build/console/console.js", 734);
return v && Y.Lang.isFunction(v.on);
    },

    /**
     * Setter method for logLevel attribute.  Acceptable values are
     * &quot;error&quot, &quot;warn&quot, and &quot;info&quot (case
     * insensitive).  Other values are treated as &quot;info&quot;.
     *
     * @method _setLogLevel
     * @param v {String} the desired log level
     * @return String One of Console.LOG_LEVEL_INFO, _WARN, or _ERROR
     * @protected
     */
    _setLogLevel : function (v) {
        _yuitest_coverfunc("build/console/console.js", "_setLogLevel", 747);
_yuitest_coverline("build/console/console.js", 748);
if (isString(v)) {
            _yuitest_coverline("build/console/console.js", 749);
v = v.toLowerCase();
        }
        
        _yuitest_coverline("build/console/console.js", 752);
return (v === WARN || v === ERROR) ? v : INFO;
    },

    /**
     * Getter method for useBrowserConsole attribute.  Just a pass through to
     * the YUI instance configuration setting.
     *
     * @method _getUseBrowserConsole
     * @return {Boolean} or null if logSource is not a YUI instance
     * @protected
     */
    _getUseBrowserConsole: function () {
        _yuitest_coverfunc("build/console/console.js", "_getUseBrowserConsole", 763);
_yuitest_coverline("build/console/console.js", 764);
var logSource = this.get('logSource');
        _yuitest_coverline("build/console/console.js", 765);
return logSource instanceof YUI ?
            logSource.config.useBrowserConsole : null;
    },

    /**
     * Setter method for useBrowserConsole attributes.  Only functional if the
     * logSource attribute points to a YUI instance.  Passes the value down to
     * the YUI instance.  NOTE: multiple Console instances cannot maintain
     * independent useBrowserConsole values, since it is just a pass through to
     * the YUI instance configuration.
     *
     * @method _setUseBrowserConsole
     * @param v {Boolean} false to disable browser console printing (default)
     * @return {Boolean} true|false if logSource is a YUI instance
     * @protected
     */
    _setUseBrowserConsole: function (v) {
        _yuitest_coverfunc("build/console/console.js", "_setUseBrowserConsole", 781);
_yuitest_coverline("build/console/console.js", 782);
var logSource = this.get('logSource');
        _yuitest_coverline("build/console/console.js", 783);
if (logSource instanceof YUI) {
            _yuitest_coverline("build/console/console.js", 784);
v = !!v;
            _yuitest_coverline("build/console/console.js", 785);
logSource.config.useBrowserConsole = v;
            _yuitest_coverline("build/console/console.js", 786);
return v;
        } else {
            _yuitest_coverline("build/console/console.js", 788);
return Y.Attribute.INVALID_VALUE;
        }
    },

    /**
     * Set the height of the Console container.  Set the body height to the
     * difference between the configured height and the calculated heights of
     * the header and footer.
     * Overrides Widget.prototype._uiSetHeight.
     *
     * @method _uiSetHeight
     * @param v {String|Number} the new height
     * @protected
     */
    _uiSetHeight : function (v) {
        _yuitest_coverfunc("build/console/console.js", "_uiSetHeight", 802);
_yuitest_coverline("build/console/console.js", 803);
Console.superclass._uiSetHeight.apply(this,arguments);

        _yuitest_coverline("build/console/console.js", 805);
if (this._head && this._foot) {
            _yuitest_coverline("build/console/console.js", 806);
var h = this.get('boundingBox').get('offsetHeight') -
                    this._head.get('offsetHeight') -
                    this._foot.get('offsetHeight');

            _yuitest_coverline("build/console/console.js", 810);
this._body.setStyle(HEIGHT,h+'px');
        }
    },

    /**
     * Over-ride default content box sizing to do nothing, since we're sizing
     * the body section to fill out height ourselves.
     * 
     * @method _uiSizeCB
     * @protected
     */
    _uiSizeCB : function() {
        // Do Nothing. Ideally want to move to Widget-StdMod, which accounts for
        // _uiSizeCB        
    },

    /**
     * Updates the UI if changes are made to any of the strings in the strings
     * attribute.
     *
     * @method _afterStringsChange
     * @param e {Event} Custom event for the attribute change
     * @protected
     */
    _afterStringsChange : function (e) {
        _yuitest_coverfunc("build/console/console.js", "_afterStringsChange", 834);
_yuitest_coverline("build/console/console.js", 835);
var prop   = e.subAttrName ? e.subAttrName.split(DOT)[1] : null,
            cb     = this.get(CONTENT_BOX),
            before = e.prevVal,
            after  = e.newVal;

        _yuitest_coverline("build/console/console.js", 840);
if ((!prop || prop === TITLE) && before.title !== after.title) {
            _yuitest_coverline("build/console/console.js", 841);
cb.all(DOT+C_CONSOLE_TITLE).setHTML(after.title);
        }

        _yuitest_coverline("build/console/console.js", 844);
if ((!prop || prop === PAUSE) && before.pause !== after.pause) {
            _yuitest_coverline("build/console/console.js", 845);
cb.all(DOT+C_PAUSE_LABEL).setHTML(after.pause);
        }

        _yuitest_coverline("build/console/console.js", 848);
if ((!prop || prop === CLEAR) && before.clear !== after.clear) {
            _yuitest_coverline("build/console/console.js", 849);
cb.all(DOT+C_CLEAR).set('value',after.clear);
        }
    },

    /**
     * Updates the UI and schedules or cancels the print loop.
     *
     * @method _afterPausedChange
     * @param e {Event} Custom event for the attribute change
     * @protected
     */
    _afterPausedChange : function (e) {
        _yuitest_coverfunc("build/console/console.js", "_afterPausedChange", 860);
_yuitest_coverline("build/console/console.js", 861);
var paused = e.newVal;

        _yuitest_coverline("build/console/console.js", 863);
if (e.src !== Y.Widget.SRC_UI) {
            _yuitest_coverline("build/console/console.js", 864);
this._uiUpdatePaused(paused);
        }

        _yuitest_coverline("build/console/console.js", 867);
if (!paused) {
            _yuitest_coverline("build/console/console.js", 868);
this._schedulePrint();
        } else {_yuitest_coverline("build/console/console.js", 869);
if (this._printLoop) {
            _yuitest_coverline("build/console/console.js", 870);
this._cancelPrintLoop();
        }}
    },

    /**
     * Checks or unchecks the paused checkbox
     *
     * @method _uiUpdatePaused
     * @param on {Boolean} the new checked state
     * @protected
     */
    _uiUpdatePaused : function (on) {
        _yuitest_coverfunc("build/console/console.js", "_uiUpdatePaused", 881);
_yuitest_coverline("build/console/console.js", 882);
var node = this._foot.all('input[type=checkbox].'+C_PAUSE);

        _yuitest_coverline("build/console/console.js", 884);
if (node) {
            _yuitest_coverline("build/console/console.js", 885);
node.set(CHECKED,on);
        }
    },

    /**
     * Calls this._trimOldEntries() in response to changes in the configured
     * consoleLimit attribute.
     * 
     * @method _afterConsoleLimitChange
     * @param e {Event} Custom event for the attribute change
     * @protected
     */
    _afterConsoleLimitChange : function () {
        _yuitest_coverfunc("build/console/console.js", "_afterConsoleLimitChange", 897);
_yuitest_coverline("build/console/console.js", 898);
this._trimOldEntries();
    },


    /**
     * Updates the className of the contentBox, which should trigger CSS to
     * hide or show the body and footer sections depending on the new value.
     *
     * @method _afterCollapsedChange
     * @param e {Event} Custom event for the attribute change
     * @protected
     */
    _afterCollapsedChange : function (e) {
        _yuitest_coverfunc("build/console/console.js", "_afterCollapsedChange", 910);
_yuitest_coverline("build/console/console.js", 911);
this._uiUpdateCollapsed(e.newVal);
    },

    /**
     * Updates the UI to reflect the new Collapsed state
     *
     * @method _uiUpdateCollapsed
     * @param v {Boolean} true for collapsed, false for expanded
     * @protected
     */
    _uiUpdateCollapsed : function (v) {
        _yuitest_coverfunc("build/console/console.js", "_uiUpdateCollapsed", 921);
_yuitest_coverline("build/console/console.js", 922);
var bb     = this.get('boundingBox'),
            button = bb.all('button.'+C_COLLAPSE),
            method = v ? 'addClass' : 'removeClass',
            str    = this.get('strings.'+(v ? 'expand' : 'collapse'));

        _yuitest_coverline("build/console/console.js", 927);
bb[method](C_COLLAPSED);

        _yuitest_coverline("build/console/console.js", 929);
if (button) {
            _yuitest_coverline("build/console/console.js", 930);
button.setHTML(str);
        }

        _yuitest_coverline("build/console/console.js", 933);
this._uiSetHeight(v ? this._head.get('offsetHeight'): this.get(HEIGHT));
    },

    /**
     * Makes adjustments to the UI if needed when the Console is hidden or shown
     *
     * @method _afterVisibleChange
     * @param e {Event} the visibleChange event
     * @protected
     */
    _afterVisibleChange : function (e) {
        _yuitest_coverfunc("build/console/console.js", "_afterVisibleChange", 943);
_yuitest_coverline("build/console/console.js", 944);
Console.superclass._afterVisibleChange.apply(this,arguments);

        _yuitest_coverline("build/console/console.js", 946);
this._uiUpdateFromHideShow(e.newVal);
    },

    /**
     * Recalculates dimensions and updates appropriately when shown
     *
     * @method _uiUpdateFromHideShow
     * @param v {Boolean} true for visible, false for hidden
     * @protected
     */
    _uiUpdateFromHideShow : function (v) {
        _yuitest_coverfunc("build/console/console.js", "_uiUpdateFromHideShow", 956);
_yuitest_coverline("build/console/console.js", 957);
if (v) {
            _yuitest_coverline("build/console/console.js", 958);
this._uiSetHeight(this.get(HEIGHT));
        }
    },

    /**
     * Responds to log events by normalizing qualifying messages and passing
     * them along through the entry event for buffering etc.
     * 
     * @method _onLogEvent
     * @param msg {String} the log message
     * @param cat {String} OPTIONAL the category or logLevel of the message
     * @param src {String} OPTIONAL the source of the message (e.g. widget name)
     * @protected
     */
    _onLogEvent : function (e) {

        _yuitest_coverfunc("build/console/console.js", "_onLogEvent", 972);
_yuitest_coverline("build/console/console.js", 974);
if (!this.get(DISABLED) && this._isInLogLevel(e)) {

            _yuitest_coverline("build/console/console.js", 976);
var debug = Y.config.debug;

            /* TODO: needed? */
            _yuitest_coverline("build/console/console.js", 979);
Y.config.debug = false;

            _yuitest_coverline("build/console/console.js", 981);
this.fire(ENTRY, {
                message : this._normalizeMessage(e)
            });

            _yuitest_coverline("build/console/console.js", 985);
Y.config.debug = debug;
        }
    },

    /**
     * Clears the console, resets the startTime attribute, enables and
     * unpauses the widget.
     *
     * @method _defResetFn
     * @protected
     */
    _defResetFn : function () {
        _yuitest_coverfunc("build/console/console.js", "_defResetFn", 996);
_yuitest_coverline("build/console/console.js", 997);
this.clearConsole();
        _yuitest_coverline("build/console/console.js", 998);
this.set(START_TIME,new Date());
        _yuitest_coverline("build/console/console.js", 999);
this.set(DISABLED,false);
        _yuitest_coverline("build/console/console.js", 1000);
this.set(PAUSED,false);
    },

    /**
     * Buffers incoming message objects and schedules the printing.
     *
     * @method _defEntryFn
     * @param e {Event} The Custom event carrying the message in its payload
     * @protected
     */
    _defEntryFn : function (e) {
        _yuitest_coverfunc("build/console/console.js", "_defEntryFn", 1010);
_yuitest_coverline("build/console/console.js", 1011);
if (e.message) {
            _yuitest_coverline("build/console/console.js", 1012);
this.buffer.push(e.message);
            _yuitest_coverline("build/console/console.js", 1013);
this._schedulePrint();
        }
    }

},

// Y.Console static properties
{
    /**
     * The identity of the widget.
     *
     * @property NAME
     * @type String
     * @static
     */
    NAME : CONSOLE,

    /**
     * Static identifier for logLevel configuration setting to allow all
     * incoming messages to generate Console entries.
     *
     * @property LOG_LEVEL_INFO
     * @type String
     * @static
     */
    LOG_LEVEL_INFO  : INFO,

    /**
     * Static identifier for logLevel configuration setting to allow only
     * incoming messages of logLevel &quot;warn&quot; or &quot;error&quot;
     * to generate Console entries.
     *
     * @property LOG_LEVEL_WARN
     * @type String
     * @static
     */
    LOG_LEVEL_WARN  : WARN,

    /**
     * Static identifier for logLevel configuration setting to allow only
     * incoming messages of logLevel &quot;error&quot; to generate
     * Console entries.
     *
     * @property LOG_LEVEL_ERROR
     * @type String
     * @static
     */
    LOG_LEVEL_ERROR : ERROR,

    /**
     * Map (object) of classNames used to populate the placeholders in the
     * Console.ENTRY_TEMPLATE markup when rendering a new Console entry.
     *
     * <p>By default, the keys contained in the object are:</p>
     * <ul>
     *    <li>entry_class</li>
     *    <li>entry_meta_class</li>
     *    <li>entry_cat_class</li>
     *    <li>entry_src_class</li>
     *    <li>entry_time_class</li>
     *    <li>entry_content_class</li>
     * </ul>
     *
     * @property ENTRY_CLASSES
     * @type Object
     * @static
     */
    ENTRY_CLASSES   : {
        entry_class         : C_ENTRY,
        entry_meta_class    : C_ENTRY_META,
        entry_cat_class     : C_ENTRY_CAT,
        entry_src_class     : C_ENTRY_SRC,
        entry_time_class    : C_ENTRY_TIME,
        entry_content_class : C_ENTRY_CONTENT
    },

    /**
     * Map (object) of classNames used to populate the placeholders in the
     * Console.HEADER_TEMPLATE, Console.BODY_TEMPLATE, and
     * Console.FOOTER_TEMPLATE markup when rendering the Console UI.
     *
     * <p>By default, the keys contained in the object are:</p>
     * <ul>
     *   <li>console_hd_class</li>
     *   <li>console_bd_class</li>
     *   <li>console_ft_class</li>
     *   <li>console_controls_class</li>
     *   <li>console_checkbox_class</li>
     *   <li>console_pause_class</li>
     *   <li>console_pause_label_class</li>
     *   <li>console_button_class</li>
     *   <li>console_clear_class</li>
     *   <li>console_collapse_class</li>
     *   <li>console_title_class</li>
     * </ul>
     *
     * @property CHROME_CLASSES
     * @type Object
     * @static
     */
    CHROME_CLASSES  : {
        console_hd_class       : C_CONSOLE_HD,
        console_bd_class       : C_CONSOLE_BD,
        console_ft_class       : C_CONSOLE_FT,
        console_controls_class : C_CONSOLE_CONTROLS,
        console_checkbox_class : C_CHECKBOX,
        console_pause_class    : C_PAUSE,
        console_pause_label_class : C_PAUSE_LABEL,
        console_button_class   : C_BUTTON,
        console_clear_class    : C_CLEAR,
        console_collapse_class : C_COLLAPSE,
        console_title_class    : C_CONSOLE_TITLE
    },

    /**
     * Markup template used to generate the DOM structure for the header
     * section of the Console when it is rendered.  The template includes
     * these {placeholder}s:
     *
     * <ul>
     *   <li>console_button_class - contributed by Console.CHROME_CLASSES</li>
     *   <li>console_collapse_class - contributed by Console.CHROME_CLASSES</li>
     *   <li>console_hd_class - contributed by Console.CHROME_CLASSES</li>
     *   <li>console_title_class - contributed by Console.CHROME_CLASSES</li>
     *   <li>str_collapse - pulled from attribute strings.collapse</li>
     *   <li>str_title - pulled from attribute strings.title</li>
     * </ul>
     *
     * @property HEADER_TEMPLATE
     * @type String
     * @static
     */
    HEADER_TEMPLATE :
        '<div class="{console_hd_class}">'+
            '<h4 class="{console_title_class}">{str_title}</h4>'+
            '<button type="button" class="'+
                '{console_button_class} {console_collapse_class}">{str_collapse}'+
            '</button>'+
        '</div>',

    /**
     * Markup template used to generate the DOM structure for the Console body
     * (where the messages are inserted) when it is rendered.  The template
     * includes only the {placeholder} &quot;console_bd_class&quot;, which is
     * constributed by Console.CHROME_CLASSES.
     *
     * @property BODY_TEMPLATE
     * @type String
     * @static
     */
    BODY_TEMPLATE : '<div class="{console_bd_class}"></div>',

    /**
     * Markup template used to generate the DOM structure for the footer
     * section of the Console when it is rendered.  The template includes
     * many of the {placeholder}s from Console.CHROME_CLASSES as well as:
     *
     * <ul>
     *   <li>id_guid - generated unique id, relates the label and checkbox</li>
     *   <li>str_pause - pulled from attribute strings.pause</li>
     *   <li>str_clear - pulled from attribute strings.clear</li>
     * </ul>
     *
     * @property FOOTER_TEMPLATE
     * @type String
     * @static
     */
    FOOTER_TEMPLATE :
        '<div class="{console_ft_class}">'+
            '<div class="{console_controls_class}">'+
                '<label class="{console_pause_label_class}"><input type="checkbox" class="{console_checkbox_class} {console_pause_class}" value="1" id="{id_guid}"> {str_pause}</label>' +
                '<button type="button" class="'+
                    '{console_button_class} {console_clear_class}">{str_clear}'+
                '</button>'+
            '</div>'+
        '</div>',

    /**
     * Default markup template used to create the DOM structure for Console
     * entries. The markup contains {placeholder}s for content and classes
     * that are replaced via Y.Lang.sub.  The default template contains
     * the {placeholder}s identified in Console.ENTRY_CLASSES as well as the
     * following placeholders that will be populated by the log entry data:
     *
     * <ul>
     *   <li>cat_class</li>
     *   <li>src_class</li>
     *   <li>totalTime</li>
     *   <li>elapsedTime</li>
     *   <li>localTime</li>
     *   <li>sourceAndDetail</li>
     *   <li>message</li>
     * </ul>
     *
     * @property ENTRY_TEMPLATE
     * @type String
     * @static
     */
    ENTRY_TEMPLATE : ENTRY_TEMPLATE_STR,

    /**
     * Static property used to define the default attribute configuration of
     * the Widget.
     *
     * @property ATTRS
     * @Type Object
     * @static
     */
    ATTRS : {

        /**
         * Name of the custom event that will communicate log messages.
         *
         * @attribute logEvent
         * @type String
         * @default "yui:log"
         */
        logEvent : {
            value : 'yui:log',
            writeOnce : true,
            validator : isString
        },

        /**
         * Object that will emit the log events.  By default the YUI instance.
         * To have a single Console capture events from all YUI instances, set
         * this to the Y.Global object.
         *
         * @attribute logSource
         * @type EventTarget
         * @default Y
         */
        logSource : {
            value : Y,
            writeOnce : true,
            validator : function (v) {
                _yuitest_coverfunc("build/console/console.js", "validator", 1248);
_yuitest_coverline("build/console/console.js", 1249);
return this._validateLogSource(v);
            }
        },

        /**
         * Collection of strings used to label elements in the Console UI.
         * Default collection contains the following name:value pairs:
         *
         * <ul>
         *   <li>title : &quot;Log Console&quot;</li>
         *   <li>pause : &quot;Pause&quot;</li>
         *   <li>clear : &quot;Clear&quot;</li>
         *   <li>collapse : &quot;Collapse&quot;</li>
         *   <li>expand : &quot;Expand&quot;</li>
         * </ul>
         *
         * @attribute strings
         * @type Object
         */
        strings : {
            valueFn: function() { _yuitest_coverfunc("build/console/console.js", "valueFn", 1269);
_yuitest_coverline("build/console/console.js", 1269);
return Y.Intl.get("console"); }
        },

        /**
         * Boolean to pause the outputting of new messages to the console.
         * When paused, messages will accumulate in the buffer.
         *
         * @attribute paused
         * @type boolean
         * @default false
         */
        paused : {
            value : false,
            validator : L.isBoolean
        },

        /**
         * If a category is not specified in the Y.log(..) statement, this
         * category will be used. Categories &quot;info&quot;,
         * &quot;warn&quot;, and &quot;error&quot; are also called log level.
         *
         * @attribute defaultCategory
         * @type String
         * @default "info"
         */
        defaultCategory : {
            value : INFO,
            validator : isString
        },

        /**
         * If a source is not specified in the Y.log(..) statement, this
         * source will be used.
         *
         * @attribute defaultSource
         * @type String
         * @default "global"
         */
        defaultSource   : {
            value : 'global',
            validator : isString
        },

        /**
         * Markup template used to create the DOM structure for Console entries.
         *
         * @attribute entryTemplate
         * @type String
         * @default Console.ENTRY_TEMPLATE
         */
        entryTemplate : {
            value : ENTRY_TEMPLATE_STR,
            validator : isString
        },

        /**
         * Minimum entry log level to render into the Console.  The initial
         * logLevel value for all Console instances defaults from the
         * Y.config.logLevel YUI configuration, or Console.LOG_LEVEL_INFO if
         * that configuration is not set.
         *
         * Possible values are &quot;info&quot;, &quot;warn&quot;,
         * &quot;error&quot; (case insensitive), or their corresponding statics
         * Console.LOG_LEVEL_INFO and so on.
         *
         * @attribute logLevel
         * @type String
         * @default Y.config.logLevel or Console.LOG_LEVEL_INFO
         */
        logLevel : {
            value : Y.config.logLevel || INFO,
            setter : function (v) {
                _yuitest_coverfunc("build/console/console.js", "setter", 1340);
_yuitest_coverline("build/console/console.js", 1341);
return this._setLogLevel(v);
            }
        },

        /**
         * Millisecond timeout between iterations of the print loop, moving
         * entries from the buffer to the UI.
         *
         * @attribute printTimeout
         * @type Number
         * @default 100
         */
        printTimeout : {
            value : 100,
            validator : isNumber
        },

        /**
         * Maximum number of entries printed in each iteration of the print
         * loop. This is used to prevent excessive logging locking the page UI.
         *
         * @attribute printLimit
         * @type Number
         * @default 50
         */
        printLimit : {
            value : 50,
            validator : isNumber
        },

        /**
         * Maximum number of Console entries allowed in the Console body at one
         * time.  This is used to keep acquired messages from exploding the
         * DOM tree and impacting page performance.
         *
         * @attribute consoleLimit
         * @type Number
         * @default 300
         */
        consoleLimit : {
            value : 300,
            validator : isNumber
        },

        /**
         * New entries should display at the top of the Console or the bottom?
         *
         * @attribute newestOnTop
         * @type Boolean
         * @default true
         */
        newestOnTop : {
            value : true
        },

        /**
         * When new entries are added to the Console UI, should they be
         * scrolled into view?
         *
         * @attribute scrollIntoView
         * @type Boolean
         * @default true
         */
        scrollIntoView : {
            value : true
        },

        /**
         * The baseline time for this Console instance, used to measure elapsed
         * time from the moment the console module is <code>use</code>d to the
         * moment each new entry is logged (not rendered).
         *
         * This value is reset by the instance method myConsole.reset().
         *
         * @attribute startTime
         * @type Date
         * @default The moment the console module is <code>use</code>d
         */
        startTime : {
            value : new Date()
        },

        /**
         * The precise time the last entry was logged.  Used to measure elapsed
         * time between log messages.
         *
         * @attribute lastTime
         * @type Date
         * @default The moment the console module is <code>use</code>d
         */
        lastTime : {
            value : new Date(),
            readOnly: true
        },

        /**
         * Controls the collapsed state of the Console
         *
         * @attribute collapsed
         * @type Boolean
         * @default false
         */
        collapsed : {
            value : false
        },

        /**
        * String with units, or number, representing the height of the Console,
        * inclusive of header and footer. If a number is provided, the default
        * unit, defined by Widget's DEF_UNIT, property is used.
        *
        * @attribute height
        * @default "300px"
        * @type {String | Number}
        */
        height: {
            value: "300px"
        },

        /**
        * String with units, or number, representing the width of the Console.
        * If a number is provided, the default unit, defined by Widget's
        * DEF_UNIT, property is used.
        *
        * @attribute width
        * @default "300px"
        * @type {String | Number}
        */
        width: {
            value: "300px"
        },

        /**
         * Pass through to the YUI instance useBrowserConsole configuration.
         * By default this is set to false, which will disable logging to the
         * browser console when a Console instance is created.  If the
         * logSource is not a YUI instance, this has no effect.
         * 
         * @attribute useBrowserConsole
         * @type {Boolean}
         * @default false
         */
         useBrowserConsole : {
            lazyAdd: false,
            value: false,
            getter : function () {
                _yuitest_coverfunc("build/console/console.js", "getter", 1486);
_yuitest_coverline("build/console/console.js", 1487);
return this._getUseBrowserConsole();
            },
            setter : function (v) {
                _yuitest_coverfunc("build/console/console.js", "setter", 1489);
_yuitest_coverline("build/console/console.js", 1490);
return this._setUseBrowserConsole(v);
            }
         },

         /**
          * Allows the Console to flow in the document.  Available values are
          * 'inline', 'block', and 'separate' (the default).  
          *
          * @attribute style
          * @type {String}
          * @default 'separate'
          */
         style : {
            value : 'separate',
            writeOnce : true,
            validator : function (v) {
                _yuitest_coverfunc("build/console/console.js", "validator", 1505);
_yuitest_coverline("build/console/console.js", 1506);
return this._validateStyle(v);
            }
         }
    }

});


}, '3.7.3', {"requires": ["yui-log", "widget"], "skinnable": true, "lang": ["en", "es", "ja"]});
