/*
YUI 3.7.3 (build 5687)
Copyright 2012 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/
YUI.add('console-filters', function (Y, NAME) {

/**
 * <p>Provides Plugin.ConsoleFilters plugin class.</p>
 *
 * <p>This plugin adds the ability to control which Console entries display by filtering on category and source. Two groups of checkboxes are added to the Console footer, one for categories and the other for sources.  Only those messages that match a checked category or source are displayed.</p>
 *
 * @module console-filters
 * @namespace Plugin
 * @class ConsoleFilters
 */

// Some common strings and functions
var getCN = Y.ClassNameManager.getClassName,
    CONSOLE = 'console',
    FILTERS = 'filters',
    FILTER  = 'filter',
    CATEGORY = 'category',
    SOURCE   = 'source',
    CATEGORY_DOT = 'category.',
    SOURCE_DOT   = 'source.',

    HOST     = 'host',
    CHECKED  = 'checked',
    DEF_VISIBILITY = 'defaultVisibility',

    DOT = '.',
    EMPTY   = '',

    C_BODY       = DOT + Y.Console.CHROME_CLASSES.console_bd_class,
    C_FOOT       = DOT + Y.Console.CHROME_CLASSES.console_ft_class,

    SEL_CHECK    = 'input[type=checkbox].',
    
    isString = Y.Lang.isString;

function ConsoleFilters() {
    ConsoleFilters.superclass.constructor.apply(this,arguments);
}

Y.namespace('Plugin').ConsoleFilters = Y.extend(ConsoleFilters, Y.Plugin.Base,

// Y.Plugin.ConsoleFilters prototype
{
    /**
     * Collection of all log messages passed through since the plugin's
     * instantiation.  This holds all messages regardless of filter status.
     * Used as a single source of truth for repopulating the Console body when
     * filters are changed.
     *
     * @property _entries
     * @type Array
     * @protected
     */
    _entries : null,

    /**
     * Maximum number of entries to store in the message cache.
     *
     * @property _cacheLimit
     * @type {Number}
     * @default Infinity
     * @protected
     */
    _cacheLimit : Number.POSITIVE_INFINITY,

    /**
     * The container node created to house the category filters.
     *
     * @property _categories
     * @type Node
     * @protected
     */
    _categories : null,

    /**
     * The container node created to house the source filters.
     *
     * @property _sources
     * @type Node
     * @protected
     */
    _sources : null,

    /**
     * Initialize entries collection and attach listeners to host events and
     * methods.
     *
     * @method initializer
     * @protected
     */
    initializer : function () {
        this._entries = [];

        this.get(HOST).on("entry", this._onEntry, this);

        this.doAfter("renderUI", this.renderUI);
        this.doAfter("syncUI", this.syncUI);
        this.doAfter("bindUI", this.bindUI);

        this.doAfter("clearConsole", this._afterClearConsole);

        if (this.get(HOST).get('rendered')) {
            this.renderUI();
            this.syncUI();
            this.bindUI();
        }

        this.after("cacheLimitChange", this._afterCacheLimitChange);
    },

    /**
     * Removes the plugin UI and unwires events.
     *
     * @method destructor
     * @protected
     */
    destructor : function () {
        //TODO: grab last {consoleLimit} entries and update the console with
        //them (no filtering)
        this._entries = [];

        if (this._categories) {
            this._categories.remove();
        }
        if (this._sources) {
            this._sources.remove();
        }
    },

    /**
     * Adds the category and source filter sections to the Console footer.
     *
     * @method renderUI
     * @protected
     */
    renderUI : function () {
        var foot = this.get(HOST).get('contentBox').one(C_FOOT),
            html;

        if (foot) {
            html = Y.Lang.sub(
                        ConsoleFilters.CATEGORIES_TEMPLATE,
                        ConsoleFilters.CHROME_CLASSES);

            this._categories = foot.appendChild(Y.Node.create(html));

            html = Y.Lang.sub(
                        ConsoleFilters.SOURCES_TEMPLATE,
                        ConsoleFilters.CHROME_CLASSES);

            this._sources = foot.appendChild(Y.Node.create(html));
        }
    },

    /**
     * Binds to checkbox click events and internal attribute change events to
     * maintain the UI state.
     *
     * @method bindUI
     * @protected
     */
    bindUI : function () {
        this._categories.on('click', Y.bind(this._onCategoryCheckboxClick, this));

        this._sources.on('click', Y.bind(this._onSourceCheckboxClick, this));
            
        this.after('categoryChange',this._afterCategoryChange);
        this.after('sourceChange',  this._afterSourceChange);
    },

    /**
     * Updates the UI to be in accordance with the current state of the plugin.
     *
     * @method syncUI
     */
    syncUI : function () {
        Y.each(this.get(CATEGORY), function (v, k) {
            this._uiSetCheckbox(CATEGORY, k, v);
        }, this);

        Y.each(this.get(SOURCE), function (v, k) {
            this._uiSetCheckbox(SOURCE, k, v);
        }, this);

        this.refreshConsole();
    },

    /**
     * Ensures a filter is set up for any new categories or sources and
     * collects the messages in _entries.  If the message is stamped with a
     * category or source that is currently being filtered out, the message
     * will not pass to the Console's print buffer.
     *
     * @method _onEntry
     * @param e {Event} the custom event object
     * @protected
     */
    _onEntry : function (e) {
        this._entries.push(e.message);
        
        var cat = CATEGORY_DOT + e.message.category,
            src = SOURCE_DOT + e.message.source,
            cat_filter = this.get(cat),
            src_filter = this.get(src),
            overLimit  = this._entries.length - this._cacheLimit,
            visible;

        if (overLimit > 0) {
            this._entries.splice(0, overLimit);
        }

        if (cat_filter === undefined) {
            visible = this.get(DEF_VISIBILITY);
            this.set(cat, visible);
            cat_filter = visible;
        }

        if (src_filter === undefined) {
            visible = this.get(DEF_VISIBILITY);
            this.set(src, visible);
            src_filter = visible;
        }
        
        if (!cat_filter || !src_filter) {
            e.preventDefault();
        }
    },

    /**
     * Flushes the cached entries after a call to the Console's clearConsole().
     *
     * @method _afterClearConsole
     * @protected
     */
    _afterClearConsole : function () {
        this._entries = [];
    },

    /**
     * Triggers the Console to update if a known category filter
     * changes value (e.g. visible => hidden).  Updates the appropriate
     * checkbox's checked state if necessary.
     *
     * @method _afterCategoryChange
     * @param e {Event} the attribute change event object
     * @protected
     */
    _afterCategoryChange : function (e) {
        var cat    = e.subAttrName.replace(/category\./, EMPTY),
            before = e.prevVal,
            after  = e.newVal;

        // Don't update the console for new categories
        if (!cat || before[cat] !== undefined) {
            this.refreshConsole();

            this._filterBuffer();
        }

        if (cat && !e.fromUI) {
            this._uiSetCheckbox(CATEGORY, cat, after[cat]);
        }
    },

    /**
     * Triggers the Console to update if a known source filter
     * changes value (e.g. visible => hidden).  Updates the appropriate
     * checkbox's checked state if necessary.
     *
     * @method _afterSourceChange
     * @param e {Event} the attribute change event object
     * @protected
     */
    _afterSourceChange : function (e) {
        var src     = e.subAttrName.replace(/source\./, EMPTY),
            before = e.prevVal,
            after  = e.newVal;

        // Don't update the console for new sources
        if (!src || before[src] !== undefined) {
            this.refreshConsole();

            this._filterBuffer();
        }

        if (src && !e.fromUI) {
            this._uiSetCheckbox(SOURCE, src, after[src]);
        }
    },

    /**
     * Flushes the Console's print buffer of any entries that have a category
     * or source that is currently being excluded.
     *
     * @method _filterBuffer
     * @protected
     */
    _filterBuffer : function () {
        var cats = this.get(CATEGORY),
            srcs = this.get(SOURCE),
            buffer = this.get(HOST).buffer,
            start = null,
            i;

        for (i = buffer.length - 1; i >= 0; --i) {
            if (!cats[buffer[i].category] || !srcs[buffer[i].source]) {
                start = start || i;
            } else if (start) {
                buffer.splice(i,(start - i));
                start = null;
            }
        }
        if (start) {
            buffer.splice(0,start + 1);
        }
    },

    /**
     * Trims the cache of entries to the appropriate new length.
     *
     * @method _afterCacheLimitChange 
     * @param e {Event} the attribute change event object
     * @protected
     */
    _afterCacheLimitChange : function (e) {
        if (isFinite(e.newVal)) {
            var delta = this._entries.length - e.newVal;

            if (delta > 0) {
                this._entries.splice(0,delta);
            }
        }
    },

    /**
     * Repopulates the Console with entries appropriate to the current filter
     * settings.
     *
     * @method refreshConsole
     */
    refreshConsole : function () {
        var entries   = this._entries,
            host      = this.get(HOST),
            body      = host.get('contentBox').one(C_BODY),
            remaining = host.get('consoleLimit'),
            cats      = this.get(CATEGORY),
            srcs      = this.get(SOURCE),
            buffer    = [],
            i,e;

        if (body) {
            host._cancelPrintLoop();

            // Evaluate all entries from latest to oldest
            for (i = entries.length - 1; i >= 0 && remaining >= 0; --i) {
                e = entries[i];
                if (cats[e.category] && srcs[e.source]) {
                    buffer.unshift(e);
                    --remaining;
                }
            }

            body.setHTML(EMPTY);
            host.buffer = buffer;
            host.printBuffer();
        }
    },

    /**
     * Updates the checked property of a filter checkbox of the specified type.
     * If no checkbox is found for the input params, one is created.
     *
     * @method _uiSetCheckbox
     * @param type {String} 'category' or 'source'
     * @param item {String} the name of the filter (e.g. 'info', 'event')
     * @param checked {Boolean} value to set the checkbox's checked property
     * @protected
     */
    _uiSetCheckbox : function (type, item, checked) {
        if (type && item) {
            var container = type === CATEGORY ?
                                this._categories :
                                this._sources,
                sel      = SEL_CHECK + getCN(CONSOLE,FILTER,item),
                checkbox = container.one(sel),
                host;
                
            if (!checkbox) {
                host = this.get(HOST);

                this._createCheckbox(container, item);

                checkbox = container.one(sel);

                host._uiSetHeight(host.get('height'));
            }
            
            checkbox.set(CHECKED, checked);
        }
    },

    /**
     * Passes checkbox clicks on to the category attribute.
     *
     * @method _onCategoryCheckboxClick
     * @param e {Event} the DOM event
     * @protected
     */
    _onCategoryCheckboxClick : function (e) {
        var t = e.target, cat;

        if (t.hasClass(ConsoleFilters.CHROME_CLASSES.filter)) {
            cat = t.get('value');
            if (cat && cat in this.get(CATEGORY)) {
                this.set(CATEGORY_DOT + cat, t.get(CHECKED), { fromUI: true });
            }
        }
    },

    /**
     * Passes checkbox clicks on to the source attribute.
     *
     * @method _onSourceCheckboxClick
     * @param e {Event} the DOM event
     * @protected
     */
    _onSourceCheckboxClick : function (e) {
        var t = e.target, src;

        if (t.hasClass(ConsoleFilters.CHROME_CLASSES.filter)) {
            src = t.get('value');
            if (src && src in this.get(SOURCE)) {
                this.set(SOURCE_DOT + src, t.get(CHECKED), { fromUI: true });
            }
        }
    },

    /**
     * Hides any number of categories from the UI.  Convenience method for
     * myConsole.filter.set('category.foo', false); set('category.bar', false);
     * and so on.
     *
     * @method hideCategory
     * @param cat* {String} 1..n categories to filter out of the UI
     */
    hideCategory : function (cat, multiple) {
        if (isString(multiple)) {
            Y.Array.each(arguments, this.hideCategory, this);
        } else {
            this.set(CATEGORY_DOT + cat, false);
        }
    },

    /**
     * Shows any number of categories in the UI.  Convenience method for
     * myConsole.filter.set('category.foo', true); set('category.bar', true);
     * and so on.
     *
     * @method showCategory
     * @param cat* {String} 1..n categories to allow to display in the UI
     */
    showCategory : function (cat, multiple) {
        if (isString(multiple)) {
            Y.Array.each(arguments, this.showCategory, this);
        } else {
            this.set(CATEGORY_DOT + cat, true);
        }
    },

    /**
     * Hides any number of sources from the UI.  Convenience method for
     * myConsole.filter.set('source.foo', false); set('source.bar', false);
     * and so on.
     *
     * @method hideSource
     * @param src* {String} 1..n sources to filter out of the UI
     */
    hideSource : function (src, multiple) {
        if (isString(multiple)) {
            Y.Array.each(arguments, this.hideSource, this);
        } else {
            this.set(SOURCE_DOT + src, false);
        }
    },

    /**
     * Shows any number of sources in the UI.  Convenience method for
     * myConsole.filter.set('source.foo', true); set('source.bar', true);
     * and so on.
     *
     * @method showSource
     * @param src* {String} 1..n sources to allow to display in the UI
     */
    showSource : function (src, multiple) {
        if (isString(multiple)) {
            Y.Array.each(arguments, this.showSource, this);
        } else {
            this.set(SOURCE_DOT + src, true);
        }
    },

    /**
     * Creates a checkbox and label from the ConsoleFilters.FILTER_TEMPLATE for
     * the provided type and name.  The checkbox and label are appended to the
     * container node passes as the first arg.
     *
     * @method _createCheckbox
     * @param container {Node} the parentNode of the new checkbox and label
     * @param name {String} the identifier of the filter
     * @protected
     */
    _createCheckbox : function (container, name) {
        var info = Y.merge(ConsoleFilters.CHROME_CLASSES, {
                        filter_name  : name,
                        filter_class : getCN(CONSOLE, FILTER, name)
                   }),
            node = Y.Node.create(
                        Y.Lang.sub(ConsoleFilters.FILTER_TEMPLATE, info));

        container.appendChild(node);
    },

    /**
     * Validates category updates are objects and the subattribute is not too
     * deep.
     *
     * @method _validateCategory
     * @param cat {String} the new category:visibility map
     * @param v {String} the subattribute path updated
     * @return Boolean
     * @protected
     */
    _validateCategory : function (cat, v) {
        return Y.Lang.isObject(v,true) && cat.split(/\./).length < 3;
    },

    /**
     * Validates source updates are objects and the subattribute is not too
     * deep.
     *
     * @method _validateSource
     * @param cat {String} the new source:visibility map
     * @param v {String} the subattribute path updated
     * @return Boolean
     * @protected
     */
    _validateSource : function (src, v) {
        return Y.Lang.isObject(v,true) && src.split(/\./).length < 3;
    },

    /**
     * Setter method for cacheLimit attribute.  Basically a validator to ensure
     * numeric input.
     *
     * @method _setCacheLimit
     * @param v {Number} Maximum number of entries
     * @return {Number}
     * @protected
     */
    _setCacheLimit: function (v) {
        if (Y.Lang.isNumber(v)) {
            this._cacheLimit = v;
            return v;
        } else {
            return Y.Attribute.INVALID_VALUE;
        }
    }
},

// Y.Plugin.ConsoleFilters static properties
{
    /**
     * Plugin name.
     *
     * @property NAME
     * @type String
     * @static
     * @default 'consoleFilters'
     */
    NAME : 'consoleFilters',

    /**
     * The namespace hung off the host object that this plugin will inhabit.
     *
     * @property NS
     * @type String
     * @static
     * @default 'filter'
     */
    NS : FILTER,

    /**
     * Markup template used to create the container for the category filters.
     *
     * @property CATEGORIES_TEMPLATE
     * @type String
     * @static
     */
    CATEGORIES_TEMPLATE :
        '<div class="{categories}"></div>',

    /**
     * Markup template used to create the container for the source filters.
     *
     * @property SOURCES_TEMPLATE
     * @type String
     * @static
     */
    SOURCES_TEMPLATE :
        '<div class="{sources}"></div>',

    /**
     * Markup template used to create the category and source filter checkboxes.
     *
     * @property FILTER_TEMPLATE
     * @type String
     * @static
     */
    FILTER_TEMPLATE :
        // IE8 and FF3 don't permit breaking _between_ nowrap elements.  IE8
        // doesn't understand (non spec) wbr tag, nor does it create text nodes
        // for spaces in innerHTML strings.  The thin-space entity suffices to
        // create a breakable point.
        '<label class="{filter_label}">'+
            '<input type="checkbox" value="{filter_name}" '+
                'class="{filter} {filter_class}"> {filter_name}'+
        '</label>&#8201;',

    /** 
     * Classnames used by the templates when creating nodes.
     *
     * @property CHROME_CLASSES
     * @type Object
     * @static
     * @protected
     */
    CHROME_CLASSES : {
        categories   : getCN(CONSOLE,FILTERS,'categories'),
        sources      : getCN(CONSOLE,FILTERS,'sources'),
        category     : getCN(CONSOLE,FILTER,CATEGORY),
        source       : getCN(CONSOLE,FILTER,SOURCE),
        filter       : getCN(CONSOLE,FILTER),
        filter_label : getCN(CONSOLE,FILTER,'label')
    },

    ATTRS : {
        /**
         * Default visibility applied to new categories and sources.
         *
         * @attribute defaultVisibility
         * @type {Boolean}
         * @default true
         */
        defaultVisibility : {
            value : true,
            validator : Y.Lang.isBoolean
        },

        /**
         * <p>Map of entry categories to their visibility status.  Update a
         * particular category's visibility by setting the subattribute to true
         * (visible) or false (hidden).</p>
         *
         * <p>For example, yconsole.filter.set('category.info', false) to hide
         * log entries with the category/logLevel of 'info'.</p>
         *
         * <p>Similarly, yconsole.filter.get('category.warn') will return a
         * boolean indicating whether that category is currently being included
         * in the UI.</p>
         *
         * <p>Unlike the YUI instance configuration's logInclude and logExclude
         * properties, filtered entries are only hidden from the UI, but
         * can be made visible again.</p>
         *
         * @attribute category
         * @type Object
         */
        category : {
            value : {},
            validator : function (v,k) {
                return this._validateCategory(k,v);
            }
        },

        /**
         * <p>Map of entry sources to their visibility status.  Update a
         * particular sources's visibility by setting the subattribute to true
         * (visible) or false (hidden).</p>
         *
         * <p>For example, yconsole.filter.set('sources.slider', false) to hide
         * log entries originating from Y.Slider.</p>
         *
         * @attribute source
         * @type Object
         */
        source : {
            value : {},
            validator : function (v,k) {
                return this._validateSource(k,v);
            }
        },

        /**
         * Maximum number of entries to store in the message cache.  Use this to
         * limit the memory footprint in environments with heavy log usage.
         * By default, there is no limit (Number.POSITIVE_INFINITY).
         *
         * @attribute cacheLimit
         * @type {Number}
         * @default Number.POSITIVE_INFINITY
         */
        cacheLimit : {
            value : Number.POSITIVE_INFINITY,
            setter : function (v) {
                return this._setCacheLimit(v);
            }
        }
    }
});


}, '3.7.3', {"requires": ["plugin", "console"], "skinnable": true});
