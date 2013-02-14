/*
YUI 3.7.3 (build 5687)
Copyright 2012 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/
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
    

function Console() {
    Console.superclass.constructor.apply(this,arguments);
}

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
        Y.log.apply(Y,arguments);

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
        this._body.empty();

        this._cancelPrintLoop();

        this.buffer = [];

        return this;
    },

    /**
     * Clears the console and resets internal timers.
     *
     * @method reset
     * @chainable
     */
    reset : function () {
        this.fire(RESET);
        
        return this;
    },

    /**
     * Collapses the body and footer.
     *
     * @method collapse
     * @chainable
     */
    collapse : function () {
        this.set(COLLAPSED, true);

        return this;
    },

    /**
     * Expands the body and footer if collapsed.
     *
     * @method expand
     * @chainable
     */
    expand : function () {
        this.set(COLLAPSED, false);

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
        var messages    = this.buffer,
            debug       = Y.config.debug,
            entries     = [],
            consoleLimit= this.get('consoleLimit'),
            newestOnTop = this.get('newestOnTop'),
            anchor      = newestOnTop ? this._body.get('firstChild') : null,
            i;

        if (messages.length > consoleLimit) {
            messages.splice(0, messages.length - consoleLimit);
        }

        limit = Math.min(messages.length, (limit || messages.length));
        
        // turn off logging system
        Y.config.debug = false;

        if (!this.get(PAUSED) && this.get('rendered')) {

            for (i = 0; i < limit && messages.length; ++i) {
                entries[i] = this._createEntryHTML(messages.shift());
            }

            if (!messages.length) {
                this._cancelPrintLoop();
            }

            if (entries.length) {
                if (newestOnTop) {
                    entries.reverse();
                }

                this._body.insertBefore(create(entries.join('')), anchor);

                if (this.get('scrollIntoView')) {
                    this.scrollToLatest();
                }

                this._trimOldEntries();
            }
        }

        // restore logging system
        Y.config.debug = debug;

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
        this._evtCat = Y.stamp(this) + '|';

        this.buffer = [];

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
        this.publish(ENTRY, { defaultFn: this._defEntryFn });

        /**
         * Triggers the reset behavior via the default logic in _defResetFn.
         *
         * @event reset
         * @param event {Event.Facade} Event Facade object
         * @preventable _defResetFn
         */
        this.publish(RESET, { defaultFn: this._defResetFn });

        this.after('rendered', this._schedulePrint);
    },

    /**
     * Tears down the instance, flushing event subscriptions and purging the UI.
     *
     * @method destructor
     * @protected
     */
    destructor : function () {
        var bb = this.get('boundingBox');

        this._cancelPrintLoop();

        this.get('logSource').detach(this._evtCat + '*');
        
        bb.purge(true);
    },

    /**
     * Generate the Console UI.
     *
     * @method renderUI
     * @protected
     */
    renderUI : function () {
        this._initHead();
        this._initBody();
        this._initFoot();

        // Apply positioning to the bounding box if appropriate
        var style = this.get('style');
        if (style !== 'block') {
            this.get('boundingBox').addClass(this.getClassName(style));
        }
    },

    /**
     * Sync the UI state to the current attribute state.
     *
     * @method syncUI
     */
    syncUI : function () {
        this._uiUpdatePaused(this.get(PAUSED));
        this._uiUpdateCollapsed(this.get(COLLAPSED));
        this._uiSetHeight(this.get(HEIGHT));
    },

    /**
     * Set up event listeners to wire up the UI to the internal state.
     *
     * @method bindUI
     * @protected
     */
    bindUI : function () {
        this.get(CONTENT_BOX).one('button.'+C_COLLAPSE).
            on(CLICK,this._onCollapseClick,this);

        this.get(CONTENT_BOX).one('input[type=checkbox].'+C_PAUSE).
            on(CLICK,this._onPauseClick,this);

        this.get(CONTENT_BOX).one('button.'+C_CLEAR).
            on(CLICK,this._onClearClick,this);

        // Attribute changes
        this.after(this._evtCat + 'stringsChange',
            this._afterStringsChange);
        this.after(this._evtCat + 'pausedChange',
            this._afterPausedChange);
        this.after(this._evtCat + 'consoleLimitChange',
            this._afterConsoleLimitChange);
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
        var cb   = this.get(CONTENT_BOX),
            info = merge(Console.CHROME_CLASSES, {
                        str_collapse : this.get('strings.collapse'),
                        str_title : this.get('strings.title')
                    });

        this._head = create(substitute(Console.HEADER_TEMPLATE,info));

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
        this._body = create(substitute(
                            Console.BODY_TEMPLATE,
                            Console.CHROME_CLASSES));

        this.get(CONTENT_BOX).appendChild(this._body);
    },

    /**
     * Create the DOM structure for the footer elements.
     *
     * @method _initFoot
     * @protected
     */
    _initFoot : function () {
        var info = merge(Console.CHROME_CLASSES, {
                id_guid   : Y.guid(),
                str_pause : this.get('strings.pause'),
                str_clear : this.get('strings.clear')
            });

        this._foot = create(substitute(Console.FOOTER_TEMPLATE,info));

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
        var cat = e.cat, lvl = this.get('logLevel');

        if (lvl !== INFO) {
            cat = cat || INFO;

            if (isString(cat)) {
                cat = cat.toLowerCase();
            }

            if ((cat === WARN && lvl === ERROR) ||
                (cat === INFO && lvl !== INFO)) {
                return false;
            }
        }

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
        m.source          = RE_INLINE_SOURCE.test(m.sourceAndDetail) ?
                                RegExp.$1 : m.sourceAndDetail;
        m.localTime       = m.time.toLocaleTimeString ? 
                            m.time.toLocaleTimeString() : (m.time + '');
        m.elapsedTime     = m.time - this.get(LAST_TIME);
        m.totalTime       = m.time - this.get(START_TIME);

        this._set(LAST_TIME,m.time);

        return m;
    },

    /**
     * Sets an interval for buffered messages to be output to the console.
     *
     * @method _schedulePrint
     * @protected
     */
    _schedulePrint : function () {
        if (!this._printLoop && !this.get(PAUSED) && this.get('rendered')) {
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
        m = merge(
                this._htmlEscapeMessage(m),
                Console.ENTRY_CLASSES,
                {
                    cat_class : this.getClassName(ENTRY,m.category),
                    src_class : this.getClassName(ENTRY,m.source)
                });

        return this.get('entryTemplate').replace(/\{(\w+)\}/g,
            function (_,token) {
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
        var scrollTop = this.get('newestOnTop') ?
                            0 :
                            this._body.get('scrollHeight');

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
        m.message         = this._encodeHTML(m.message);
        m.source          = this._encodeHTML(m.source);
        m.sourceAndDetail = this._encodeHTML(m.sourceAndDetail);
        m.category        = this._encodeHTML(m.category);

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
        Y.config.debug = false;

        var bd = this._body,
            limit = this.get('consoleLimit'),
            debug = Y.config.debug,
            entries,e,i,l;

        if (bd) {
            entries = bd.all(DOT+C_ENTRY);
            l = entries.size() - limit;

            if (l > 0) {
                if (this.get('newestOnTop')) {
                    i = limit;
                    l = entries.size();
                } else {
                    i = 0;
                }

                this._body.setStyle('display','none');

                for (;i < l; ++i) {
                    e = entries.item(i);
                    if (e) {
                        e.remove();
                    }
                }

                this._body.setStyle('display','');
            }

        }

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
        if (this._printLoop) {
            this._printLoop.cancel();
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
        if (isString(v)) {
            v = v.toLowerCase();
        }
        
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
        var logSource = this.get('logSource');
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
        var logSource = this.get('logSource');
        if (logSource instanceof YUI) {
            v = !!v;
            logSource.config.useBrowserConsole = v;
            return v;
        } else {
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
        Console.superclass._uiSetHeight.apply(this,arguments);

        if (this._head && this._foot) {
            var h = this.get('boundingBox').get('offsetHeight') -
                    this._head.get('offsetHeight') -
                    this._foot.get('offsetHeight');

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
        var prop   = e.subAttrName ? e.subAttrName.split(DOT)[1] : null,
            cb     = this.get(CONTENT_BOX),
            before = e.prevVal,
            after  = e.newVal;

        if ((!prop || prop === TITLE) && before.title !== after.title) {
            cb.all(DOT+C_CONSOLE_TITLE).setHTML(after.title);
        }

        if ((!prop || prop === PAUSE) && before.pause !== after.pause) {
            cb.all(DOT+C_PAUSE_LABEL).setHTML(after.pause);
        }

        if ((!prop || prop === CLEAR) && before.clear !== after.clear) {
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
        var paused = e.newVal;

        if (e.src !== Y.Widget.SRC_UI) {
            this._uiUpdatePaused(paused);
        }

        if (!paused) {
            this._schedulePrint();
        } else if (this._printLoop) {
            this._cancelPrintLoop();
        }
    },

    /**
     * Checks or unchecks the paused checkbox
     *
     * @method _uiUpdatePaused
     * @param on {Boolean} the new checked state
     * @protected
     */
    _uiUpdatePaused : function (on) {
        var node = this._foot.all('input[type=checkbox].'+C_PAUSE);

        if (node) {
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
        var bb     = this.get('boundingBox'),
            button = bb.all('button.'+C_COLLAPSE),
            method = v ? 'addClass' : 'removeClass',
            str    = this.get('strings.'+(v ? 'expand' : 'collapse'));

        bb[method](C_COLLAPSED);

        if (button) {
            button.setHTML(str);
        }

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
        Console.superclass._afterVisibleChange.apply(this,arguments);

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
        if (v) {
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

        if (!this.get(DISABLED) && this._isInLogLevel(e)) {

            var debug = Y.config.debug;

            /* TODO: needed? */
            Y.config.debug = false;

            this.fire(ENTRY, {
                message : this._normalizeMessage(e)
            });

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
        this.clearConsole();
        this.set(START_TIME,new Date());
        this.set(DISABLED,false);
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
        if (e.message) {
            this.buffer.push(e.message);
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
            valueFn: function() { return Y.Intl.get("console"); }
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
                return this._getUseBrowserConsole();
            },
            setter : function (v) {
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
                return this._validateStyle(v);
            }
         }
    }

});


}, '3.7.3', {"requires": ["yui-log", "widget"], "skinnable": true, "lang": ["en", "es", "ja"]});
