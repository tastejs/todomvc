/*
YUI 3.7.3 (build 5687)
Copyright 2012 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/
YUI.add('autocomplete-base', function (Y, NAME) {

/**
Provides automatic input completion or suggestions for text input fields and
textareas.

@module autocomplete
@main autocomplete
@since 3.3.0
**/

/**
`Y.Base` extension that provides core autocomplete logic (but no UI
implementation) for a text input field or textarea. Must be mixed into a
`Y.Base`-derived class to be useful.

@module autocomplete
@submodule autocomplete-base
**/

/**
Extension that provides core autocomplete logic (but no UI implementation) for a
text input field or textarea.

The `AutoCompleteBase` class provides events and attributes that abstract away
core autocomplete logic and configuration, but does not provide a widget
implementation or suggestion UI. For a prepackaged autocomplete widget, see
`AutoCompleteList`.

This extension cannot be instantiated directly, since it doesn't provide an
actual implementation. It's intended to be mixed into a `Y.Base`-based class or
widget.

`Y.Widget`-based example:

    YUI().use('autocomplete-base', 'widget', function (Y) {
        var MyAC = Y.Base.create('myAC', Y.Widget, [Y.AutoCompleteBase], {
            // Custom prototype methods and properties.
        }, {
            // Custom static methods and properties.
        });

        // Custom implementation code.
    });

`Y.Base`-based example:

    YUI().use('autocomplete-base', function (Y) {
        var MyAC = Y.Base.create('myAC', Y.Base, [Y.AutoCompleteBase], {
            initializer: function () {
                this._bindUIACBase();
                this._syncUIACBase();
            },

            // Custom prototype methods and properties.
        }, {
            // Custom static methods and properties.
        });

        // Custom implementation code.
    });

@class AutoCompleteBase
**/

var Escape  = Y.Escape,
    Lang    = Y.Lang,
    YArray  = Y.Array,
    YObject = Y.Object,

    isFunction = Lang.isFunction,
    isString   = Lang.isString,
    trim       = Lang.trim,

    INVALID_VALUE = Y.Attribute.INVALID_VALUE,

    _FUNCTION_VALIDATOR = '_functionValidator',
    _SOURCE_SUCCESS     = '_sourceSuccess',

    ALLOW_BROWSER_AC    = 'allowBrowserAutocomplete',
    INPUT_NODE          = 'inputNode',
    QUERY               = 'query',
    QUERY_DELIMITER     = 'queryDelimiter',
    REQUEST_TEMPLATE    = 'requestTemplate',
    RESULTS             = 'results',
    RESULT_LIST_LOCATOR = 'resultListLocator',
    VALUE               = 'value',
    VALUE_CHANGE        = 'valueChange',

    EVT_CLEAR   = 'clear',
    EVT_QUERY   = QUERY,
    EVT_RESULTS = RESULTS;

function AutoCompleteBase() {}

AutoCompleteBase.prototype = {
    // -- Lifecycle Methods ----------------------------------------------------
    initializer: function () {
        // AOP bindings.
        Y.before(this._bindUIACBase, this, 'bindUI');
        Y.before(this._syncUIACBase, this, 'syncUI');

        // -- Public Events ----------------------------------------------------

        /**
        Fires after the query has been completely cleared or no longer meets the
        minimum query length requirement.

        @event clear
        @param {String} prevVal Value of the query before it was cleared.
        @param {String} src Source of the event.
        @preventable _defClearFn
        **/
        this.publish(EVT_CLEAR, {
            defaultFn: this._defClearFn
        });

        /**
        Fires when the contents of the input field have changed and the input
        value meets the criteria necessary to generate an autocomplete query.

        @event query
        @param {String} inputValue Full contents of the text input field or
            textarea that generated the query.
        @param {String} query AutoComplete query. This is the string that will
            be used to request completion results. It may or may not be the same
            as `inputValue`.
        @param {String} src Source of the event.
        @preventable _defQueryFn
        **/
        this.publish(EVT_QUERY, {
            defaultFn: this._defQueryFn
        });

        /**
        Fires after query results are received from the source. If no source has
        been set, this event will not fire.

        @event results
        @param {Array|Object} data Raw, unfiltered result data (if available).
        @param {String} query Query that generated these results.
        @param {Object[]} results Array of filtered, formatted, and highlighted
            results. Each item in the array is an object with the following
            properties:

            @param {Node|HTMLElement|String} results.display Formatted result
                HTML suitable for display to the user. If no custom formatter is
                set, this will be an HTML-escaped version of the string in the
                `text` property.
            @param {String} [results.highlighted] Highlighted (but not
                formatted) result text. This property will only be set if a
                highlighter is in use.
            @param {Any} results.raw Raw, unformatted result in whatever form it
                was provided by the source.
            @param {String} results.text Plain text version of the result,
                suitable for being inserted into the value of a text input field
                or textarea when the result is selected by a user. This value is
                not HTML-escaped and should not be inserted into the page using
                `innerHTML` or `Node#setContent()`.

        @preventable _defResultsFn
        **/
        this.publish(EVT_RESULTS, {
            defaultFn: this._defResultsFn
        });
    },

    destructor: function () {
        this._acBaseEvents && this._acBaseEvents.detach();

        delete this._acBaseEvents;
        delete this._cache;
        delete this._inputNode;
        delete this._rawSource;
    },

    // -- Public Prototype Methods ---------------------------------------------

    /**
    Clears the result cache.

    @method clearCache
    @chainable
    @since 3.5.0
    **/
    clearCache: function () {
        this._cache && (this._cache = {});
        return this;
    },

    /**
    Sends a request to the configured source. If no source is configured, this
    method won't do anything.

    Usually there's no reason to call this method manually; it will be called
    automatically when user input causes a `query` event to be fired. The only
    time you'll need to call this method manually is if you want to force a
    request to be sent when no user input has occurred.

    @method sendRequest
    @param {String} [query] Query to send. If specified, the `query` attribute
        will be set to this query. If not specified, the current value of the
        `query` attribute will be used.
    @param {Function} [requestTemplate] Request template function. If not
        specified, the current value of the `requestTemplate` attribute will be
        used.
    @chainable
    **/
    sendRequest: function (query, requestTemplate) {
        var request,
            source = this.get('source');

        if (query || query === '') {
            this._set(QUERY, query);
        } else {
            query = this.get(QUERY) || '';
        }

        if (source) {
            if (!requestTemplate) {
                requestTemplate = this.get(REQUEST_TEMPLATE);
            }

            request = requestTemplate ?
                requestTemplate.call(this, query) : query;

            Y.log('sendRequest: ' + request, 'info', 'autocomplete-base');

            source.sendRequest({
                query  : query,
                request: request,

                callback: {
                    success: Y.bind(this._onResponse, this, query)
                }
            });
        }

        return this;
    },

    // -- Protected Lifecycle Methods ------------------------------------------

    /**
    Attaches event listeners and behaviors.

    @method _bindUIACBase
    @protected
    **/
    _bindUIACBase: function () {
        var inputNode  = this.get(INPUT_NODE),
            tokenInput = inputNode && inputNode.tokenInput;

        // If the inputNode has a node-tokeninput plugin attached, bind to the
        // plugin's inputNode instead.
        if (tokenInput) {
            inputNode = tokenInput.get(INPUT_NODE);
            this._set('tokenInput', tokenInput);
        }

        if (!inputNode) {
            Y.error('No inputNode specified.');
            return;
        }

        this._inputNode = inputNode;

        this._acBaseEvents = new Y.EventHandle([
            // This is the valueChange event on the inputNode, provided by the
            // event-valuechange module, not our own valueChange.
            inputNode.on(VALUE_CHANGE, this._onInputValueChange, this),
            inputNode.on('blur', this._onInputBlur, this),

            this.after(ALLOW_BROWSER_AC + 'Change', this._syncBrowserAutocomplete),
            this.after('sourceTypeChange', this._afterSourceTypeChange),
            this.after(VALUE_CHANGE, this._afterValueChange)
        ]);
    },

    /**
    Synchronizes the UI state of the `inputNode`.

    @method _syncUIACBase
    @protected
    **/
    _syncUIACBase: function () {
        this._syncBrowserAutocomplete();
        this.set(VALUE, this.get(INPUT_NODE).get(VALUE));
    },

    // -- Protected Prototype Methods ------------------------------------------

    /**
    Creates a DataSource-like object that simply returns the specified array as
    a response. See the `source` attribute for more details.

    @method _createArraySource
    @param {Array} source
    @return {Object} DataSource-like object.
    @protected
    **/
    _createArraySource: function (source) {
        var that = this;

        return {
            type: 'array',
            sendRequest: function (request) {
                that[_SOURCE_SUCCESS](source.concat(), request);
            }
        };
    },

    /**
    Creates a DataSource-like object that passes the query to a custom-defined
    function, which is expected to call the provided callback with an array of
    results. See the `source` attribute for more details.

    @method _createFunctionSource
    @param {Function} source Function that accepts a query and a callback as
      parameters, and calls the callback with an array of results.
    @return {Object} DataSource-like object.
    @protected
    **/
    _createFunctionSource: function (source) {
        var that = this;

        return {
            type: 'function',
            sendRequest: function (request) {
                var value;

                function afterResults(results) {
                    that[_SOURCE_SUCCESS](results || [], request);
                }

                // Allow both synchronous and asynchronous functions. If we get
                // a truthy return value, assume the function is synchronous.
                if ((value = source(request.query, afterResults))) {
                    afterResults(value);
                }
            }
        };
    },

    /**
    Creates a DataSource-like object that looks up queries as properties on the
    specified object, and returns the found value (if any) as a response. See
    the `source` attribute for more details.

    @method _createObjectSource
    @param {Object} source
    @return {Object} DataSource-like object.
    @protected
    **/
    _createObjectSource: function (source) {
        var that = this;

        return {
            type: 'object',
            sendRequest: function (request) {
                var query = request.query;

                that[_SOURCE_SUCCESS](
                    YObject.owns(source, query) ? source[query] : [],
                    request
                );
            }
        };
    },

    /**
    Returns `true` if _value_ is either a function or `null`.

    @method _functionValidator
    @param {Function|null} value Value to validate.
    @protected
    **/
    _functionValidator: function (value) {
        return value === null || isFunction(value);
    },

    /**
    Faster and safer alternative to `Y.Object.getValue()`. Doesn't bother
    casting the path to an array (since we already know it's an array) and
    doesn't throw an error if a value in the middle of the object hierarchy is
    neither `undefined` nor an object.

    @method _getObjectValue
    @param {Object} obj
    @param {Array} path
    @return {Any} Located value, or `undefined` if the value was
        not found at the specified path.
    @protected
    **/
    _getObjectValue: function (obj, path) {
        if (!obj) {
            return;
        }

        for (var i = 0, len = path.length; obj && i < len; i++) {
            obj = obj[path[i]];
        }

        return obj;
    },

    /**
    Parses result responses, performs filtering and highlighting, and fires the
    `results` event.

    @method _parseResponse
    @param {String} query Query that generated these results.
    @param {Object} response Response containing results.
    @param {Object} data Raw response data.
    @protected
    **/
    _parseResponse: function (query, response, data) {
        var facade = {
                data   : data,
                query  : query,
                results: []
            },

            listLocator = this.get(RESULT_LIST_LOCATOR),
            results     = [],
            unfiltered  = response && response.results,

            filters,
            formatted,
            formatter,
            highlighted,
            highlighter,
            i,
            len,
            maxResults,
            result,
            text,
            textLocator;

        if (unfiltered && listLocator) {
            unfiltered = listLocator.call(this, unfiltered);
        }

        if (unfiltered && unfiltered.length) {
            filters     = this.get('resultFilters');
            textLocator = this.get('resultTextLocator');

            // Create a lightweight result object for each result to make them
            // easier to work with. The various properties on the object
            // represent different formats of the result, and will be populated
            // as we go.
            for (i = 0, len = unfiltered.length; i < len; ++i) {
                result = unfiltered[i];

                text = textLocator ?
                        textLocator.call(this, result) :
                        result.toString();

                results.push({
                    display: Escape.html(text),
                    raw    : result,
                    text   : text
                });
            }

            // Run the results through all configured result filters. Each
            // filter returns an array of (potentially fewer) result objects,
            // which is then passed to the next filter, and so on.
            for (i = 0, len = filters.length; i < len; ++i) {
                results = filters[i].call(this, query, results.concat());

                if (!results) {
                    Y.log("Filter didn't return anything.", 'warn', 'autocomplete-base');
                    return;
                }

                if (!results.length) {
                    break;
                }
            }

            if (results.length) {
                formatter   = this.get('resultFormatter');
                highlighter = this.get('resultHighlighter');
                maxResults  = this.get('maxResults');

                // If maxResults is set and greater than 0, limit the number of
                // results.
                if (maxResults && maxResults > 0 &&
                        results.length > maxResults) {
                    results.length = maxResults;
                }

                // Run the results through the configured highlighter (if any).
                // The highlighter returns an array of highlighted strings (not
                // an array of result objects), and these strings are then added
                // to each result object.
                if (highlighter) {
                    highlighted = highlighter.call(this, query,
                            results.concat());

                    if (!highlighted) {
                        Y.log("Highlighter didn't return anything.", 'warn', 'autocomplete-base');
                        return;
                    }

                    for (i = 0, len = highlighted.length; i < len; ++i) {
                        result = results[i];
                        result.highlighted = highlighted[i];
                        result.display     = result.highlighted;
                    }
                }

                // Run the results through the configured formatter (if any) to
                // produce the final formatted results. The formatter returns an
                // array of strings or Node instances (not an array of result
                // objects), and these strings/Nodes are then added to each
                // result object.
                if (formatter) {
                    formatted = formatter.call(this, query, results.concat());

                    if (!formatted) {
                        Y.log("Formatter didn't return anything.", 'warn', 'autocomplete-base');
                        return;
                    }

                    for (i = 0, len = formatted.length; i < len; ++i) {
                        results[i].display = formatted[i];
                    }
                }
            }
        }

        facade.results = results;
        this.fire(EVT_RESULTS, facade);
    },

    /**
    Returns the query portion of the specified input value, or `null` if there
    is no suitable query within the input value.

    If a query delimiter is defined, the query will be the last delimited part
    of of the string.

    @method _parseValue
    @param {String} value Input value from which to extract the query.
    @return {String|null} query
    @protected
    **/
    _parseValue: function (value) {
        var delim = this.get(QUERY_DELIMITER);

        if (delim) {
            value = value.split(delim);
            value = value[value.length - 1];
        }

        return Lang.trimLeft(value);
    },

    /**
    Setter for the `enableCache` attribute.

    @method _setEnableCache
    @param {Boolean} value
    @protected
    @since 3.5.0
    **/
    _setEnableCache: function (value) {
        // When `this._cache` is an object, result sources will store cached
        // results in it. When it's falsy, they won't. This way result sources
        // don't need to get the value of the `enableCache` attribute on every
        // request, which would be sloooow.
        this._cache = value ? {} : null;
        Y.log('Cache ' + (value ? 'enabled' : 'disabled'), 'debug', 'autocomplete-base');
    },

    /**
    Setter for locator attributes.

    @method _setLocator
    @param {Function|String|null} locator
    @return {Function|null}
    @protected
    **/
    _setLocator: function (locator) {
        if (this[_FUNCTION_VALIDATOR](locator)) {
            return locator;
        }

        var that = this;

        locator = locator.toString().split('.');

        return function (result) {
            return result && that._getObjectValue(result, locator);
        };
    },

    /**
    Setter for the `requestTemplate` attribute.

    @method _setRequestTemplate
    @param {Function|String|null} template
    @return {Function|null}
    @protected
    **/
    _setRequestTemplate: function (template) {
        if (this[_FUNCTION_VALIDATOR](template)) {
            return template;
        }

        template = template.toString();

        return function (query) {
            return Lang.sub(template, {query: encodeURIComponent(query)});
        };
    },

    /**
    Setter for the `resultFilters` attribute.

    @method _setResultFilters
    @param {Array|Function|String|null} filters `null`, a filter
        function, an array of filter functions, or a string or array of strings
        representing the names of methods on `Y.AutoCompleteFilters`.
    @return {Function[]} Array of filter functions (empty if <i>filters</i> is
        `null`).
    @protected
    **/
    _setResultFilters: function (filters) {
        var acFilters, getFilterFunction;

        if (filters === null) {
            return [];
        }

        acFilters = Y.AutoCompleteFilters;

        getFilterFunction = function (filter) {
            if (isFunction(filter)) {
                return filter;
            }

            if (isString(filter) && acFilters &&
                    isFunction(acFilters[filter])) {
                return acFilters[filter];
            }

            return false;
        };

        if (Lang.isArray(filters)) {
            filters = YArray.map(filters, getFilterFunction);
            return YArray.every(filters, function (f) { return !!f; }) ?
                    filters : INVALID_VALUE;
        } else {
            filters = getFilterFunction(filters);
            return filters ? [filters] : INVALID_VALUE;
        }
    },

    /**
    Setter for the `resultHighlighter` attribute.

    @method _setResultHighlighter
    @param {Function|String|null} highlighter `null`, a highlighter function, or
        a string representing the name of a method on
        `Y.AutoCompleteHighlighters`.
    @return {Function|null}
    @protected
    **/
    _setResultHighlighter: function (highlighter) {
        var acHighlighters;

        if (this[_FUNCTION_VALIDATOR](highlighter)) {
            return highlighter;
        }

        acHighlighters = Y.AutoCompleteHighlighters;

        if (isString(highlighter) && acHighlighters &&
                isFunction(acHighlighters[highlighter])) {
            return acHighlighters[highlighter];
        }

        return INVALID_VALUE;
    },

    /**
    Setter for the `source` attribute. Returns a DataSource or a DataSource-like
    object depending on the type of _source_ and/or the value of the
    `sourceType` attribute.

    @method _setSource
    @param {Any} source AutoComplete source. See the `source` attribute for
        details.
    @return {DataSource|Object}
    @protected
    **/
    _setSource: function (source) {
        var sourceType = this.get('sourceType') || Lang.type(source),
            sourceSetter;

        if ((source && isFunction(source.sendRequest))
                || source === null
                || sourceType === 'datasource') {

            // Quacks like a DataSource instance (or null). Make it so!
            this._rawSource = source;
            return source;
        }

        // See if there's a registered setter for this source type.
        if ((sourceSetter = AutoCompleteBase.SOURCE_TYPES[sourceType])) {
            this._rawSource = source;
            return Lang.isString(sourceSetter) ?
                    this[sourceSetter](source) : sourceSetter(source);
        }

        Y.error("Unsupported source type '" + sourceType + "'. Maybe autocomplete-sources isn't loaded?");
        return INVALID_VALUE;
    },

    /**
    Shared success callback for non-DataSource sources.

    @method _sourceSuccess
    @param {Any} data Response data.
    @param {Object} request Request object.
    @protected
    **/
    _sourceSuccess: function (data, request) {
        request.callback.success({
            data: data,
            response: {results: data}
        });
    },

    /**
    Synchronizes the UI state of the `allowBrowserAutocomplete` attribute.

    @method _syncBrowserAutocomplete
    @protected
    **/
    _syncBrowserAutocomplete: function () {
        var inputNode = this.get(INPUT_NODE);

        if (inputNode.get('nodeName').toLowerCase() === 'input') {
            inputNode.setAttribute('autocomplete',
                    this.get(ALLOW_BROWSER_AC) ? 'on' : 'off');
        }
    },

    /**
    Updates the query portion of the `value` attribute.

    If a query delimiter is defined, the last delimited portion of the input
    value will be replaced with the specified _value_.

    @method _updateValue
    @param {String} newVal New value.
    @protected
    **/
    _updateValue: function (newVal) {
        var delim = this.get(QUERY_DELIMITER),
            insertDelim,
            len,
            prevVal;

        newVal = Lang.trimLeft(newVal);

        if (delim) {
            insertDelim = trim(delim); // so we don't double up on spaces
            prevVal     = YArray.map(trim(this.get(VALUE)).split(delim), trim);
            len         = prevVal.length;

            if (len > 1) {
                prevVal[len - 1] = newVal;
                newVal = prevVal.join(insertDelim + ' ');
            }

            newVal = newVal + insertDelim + ' ';
        }

        this.set(VALUE, newVal);
    },

    // -- Protected Event Handlers ---------------------------------------------

    /**
    Updates the current `source` based on the new `sourceType` to ensure that
    the two attributes don't get out of sync when they're changed separately.

    @method _afterSourceTypeChange
    @param {EventFacade} e
    @protected
    **/
    _afterSourceTypeChange: function (e) {
        if (this._rawSource) {
            this.set('source', this._rawSource);
        }
    },

    /**
    Handles change events for the `value` attribute.

    @method _afterValueChange
    @param {EventFacade} e
    @protected
    **/
    _afterValueChange: function (e) {
        var newVal   = e.newVal,
            self     = this,
            uiChange = e.src === AutoCompleteBase.UI_SRC,
            delay, fire, minQueryLength, query;

        // Update the UI if the value was changed programmatically.
        if (!uiChange) {
            self._inputNode.set(VALUE, newVal);
        }

        Y.log('valueChange: new: "' + newVal + '"; old: "' + e.prevVal + '"', 'info', 'autocomplete-base');

        minQueryLength = self.get('minQueryLength');
        query          = self._parseValue(newVal) || '';

        if (minQueryLength >= 0 && query.length >= minQueryLength) {
            // Only query on changes that originate from the UI.
            if (uiChange) {
                delay = self.get('queryDelay');

                fire = function () {
                    self.fire(EVT_QUERY, {
                        inputValue: newVal,
                        query     : query,
                        src       : e.src
                    });
                };

                if (delay) {
                    clearTimeout(self._delay);
                    self._delay = setTimeout(fire, delay);
                } else {
                    fire();
                }
            } else {
                // For programmatic value changes, just update the query
                // attribute without sending a query.
                self._set(QUERY, query);
            }
        } else {
            clearTimeout(self._delay);

            self.fire(EVT_CLEAR, {
                prevVal: e.prevVal ? self._parseValue(e.prevVal) : null,
                src    : e.src
            });
        }
    },

    /**
    Handles `blur` events on the input node.

    @method _onInputBlur
    @param {EventFacade} e
    @protected
    **/
    _onInputBlur: function (e) {
        var delim = this.get(QUERY_DELIMITER),
            delimPos,
            newVal,
            value;

        // If a query delimiter is set and the input's value contains one or
        // more trailing delimiters, strip them.
        if (delim && !this.get('allowTrailingDelimiter')) {
            delim = Lang.trimRight(delim);
            value = newVal = this._inputNode.get(VALUE);

            if (delim) {
                while ((newVal = Lang.trimRight(newVal)) &&
                        (delimPos = newVal.length - delim.length) &&
                        newVal.lastIndexOf(delim) === delimPos) {

                    newVal = newVal.substring(0, delimPos);
                }
            } else {
                // Delimiter is one or more space characters, so just trim the
                // value.
                newVal = Lang.trimRight(newVal);
            }

            if (newVal !== value) {
                this.set(VALUE, newVal);
            }
        }
    },

    /**
    Handles `valueChange` events on the input node and fires a `query` event
    when the input value meets the configured criteria.

    @method _onInputValueChange
    @param {EventFacade} e
    @protected
    **/
    _onInputValueChange: function (e) {
        var newVal = e.newVal;

        // Don't query if the internal value is the same as the new value
        // reported by valueChange.
        if (newVal !== this.get(VALUE)) {
            this.set(VALUE, newVal, {src: AutoCompleteBase.UI_SRC});
        }
    },

    /**
    Handles source responses and fires the `results` event.

    @method _onResponse
    @param {EventFacade} e
    @protected
    **/
    _onResponse: function (query, e) {
        // Ignore stale responses that aren't for the current query.
        if (query === (this.get(QUERY) || '')) {
            this._parseResponse(query || '', e.response, e.data);
        }
    },

    // -- Protected Default Event Handlers -------------------------------------

    /**
    Default `clear` event handler. Sets the `results` attribute to an empty
    array and `query` to null.

    @method _defClearFn
    @protected
    **/
    _defClearFn: function () {
        this._set(QUERY, null);
        this._set(RESULTS, []);
    },

    /**
    Default `query` event handler. Sets the `query` attribute and sends a
    request to the source if one is configured.

    @method _defQueryFn
    @param {EventFacade} e
    @protected
    **/
    _defQueryFn: function (e) {
        Y.log('query: "' + e.query + '"; inputValue: "' + e.inputValue + '"', 'info', 'autocomplete-base');
        this.sendRequest(e.query); // sendRequest will set the 'query' attribute
    },

    /**
    Default `results` event handler. Sets the `results` attribute to the latest
    results.

    @method _defResultsFn
    @param {EventFacade} e
    @protected
    **/
    _defResultsFn: function (e) {
        Y.log('results: ' + Y.dump(e.results), 'info', 'autocomplete-base');
        this._set(RESULTS, e[RESULTS]);
    }
};

AutoCompleteBase.ATTRS = {
    /**
    Whether or not to enable the browser's built-in autocomplete functionality
    for input fields.

    @attribute allowBrowserAutocomplete
    @type Boolean
    @default false
    **/
    allowBrowserAutocomplete: {
        value: false
    },

    /**
    When a `queryDelimiter` is set, trailing delimiters will automatically be
    stripped from the input value by default when the input node loses focus.
    Set this to `true` to allow trailing delimiters.

    @attribute allowTrailingDelimiter
    @type Boolean
    @default false
    **/
    allowTrailingDelimiter: {
        value: false
    },

    /**
    Whether or not to enable in-memory caching in result sources that support
    it.

    @attribute enableCache
    @type Boolean
    @default true
    @since 3.5.0
    **/
    enableCache: {
        lazyAdd: false, // we need the setter to run on init
        setter: '_setEnableCache',
        value: true
    },

    /**
    Node to monitor for changes, which will generate `query` events when
    appropriate. May be either an `<input>` or a `<textarea>`.

    @attribute inputNode
    @type Node|HTMLElement|String
    @initOnly
    **/
    inputNode: {
        setter: Y.one,
        writeOnce: 'initOnly'
    },

    /**
    Maximum number of results to return. A value of `0` or less will allow an
    unlimited number of results.

    @attribute maxResults
    @type Number
    @default 0
    **/
    maxResults: {
        value: 0
    },

    /**
    Minimum number of characters that must be entered before a `query` event
    will be fired. A value of `0` allows empty queries; a negative value will
    effectively disable all `query` events.

    @attribute minQueryLength
    @type Number
    @default 1
    **/
    minQueryLength: {
        value: 1
    },

    /**
    Current query, or `null` if there is no current query.

    The query might not be the same as the current value of the input node, both
    for timing reasons (due to `queryDelay`) and because when one or more
    `queryDelimiter` separators are in use, only the last portion of the
    delimited input string will be used as the query value.

    @attribute query
    @type String|null
    @default null
    @readonly
    **/
    query: {
        readOnly: true,
        value: null
    },

    /**
    Number of milliseconds to delay after input before triggering a `query`
    event. If new input occurs before this delay is over, the previous input
    event will be ignored and a new delay will begin.

    This can be useful both to throttle queries to a remote data source and to
    avoid distracting the user by showing them less relevant results before
    they've paused their typing.

    @attribute queryDelay
    @type Number
    @default 100
    **/
    queryDelay: {
        value: 100
    },

    /**
    Query delimiter string. When a delimiter is configured, the input value
    will be split on the delimiter, and only the last portion will be used in
    autocomplete queries and updated when the `query` attribute is
    modified.

    @attribute queryDelimiter
    @type String|null
    @default null
    **/
    queryDelimiter: {
        value: null
    },

    /**
    Source request template. This can be a function that accepts a query as a
    parameter and returns a request string, or it can be a string containing the
    placeholder "{query}", which will be replaced with the actual URI-encoded
    query. In either case, the resulting string will be appended to the request
    URL when the `source` attribute is set to a remote DataSource, JSONP URL, or
    XHR URL (it will not be appended to YQL URLs).

    While `requestTemplate` may be set to either a function or a string, it will
    always be returned as a function that accepts a query argument and returns a
    string.

    @attribute requestTemplate
    @type Function|String|null
    @default null
    **/
    requestTemplate: {
        setter: '_setRequestTemplate',
        value: null
    },

    /**
    Array of local result filter functions. If provided, each filter will be
    called with two arguments when results are received: the query and an array
    of result objects. See the documentation for the `results` event for a list
    of the properties available on each result object.

    Each filter is expected to return a filtered or modified version of the
    results array, which will then be passed on to subsequent filters, then the
    `resultHighlighter` function (if set), then the `resultFormatter` function
    (if set), and finally to subscribers to the `results` event.

    If no `source` is set, result filters will not be called.

    Prepackaged result filters provided by the autocomplete-filters and
    autocomplete-filters-accentfold modules can be used by specifying the filter
    name as a string, such as `'phraseMatch'` (assuming the necessary filters
    module is loaded).

    @attribute resultFilters
    @type Array
    @default []
    **/
    resultFilters: {
        setter: '_setResultFilters',
        value: []
    },

    /**
    Function which will be used to format results. If provided, this function
    will be called with two arguments after results have been received and
    filtered: the query and an array of result objects. The formatter is
    expected to return an array of HTML strings or Node instances containing the
    desired HTML for each result.

    See the documentation for the `results` event for a list of the properties
    available on each result object.

    If no `source` is set, the formatter will not be called.

    @attribute resultFormatter
    @type Function|null
    **/
    resultFormatter: {
        validator: _FUNCTION_VALIDATOR,
        value: null
    },

    /**
    Function which will be used to highlight results. If provided, this function
    will be called with two arguments after results have been received and
    filtered: the query and an array of filtered result objects. The highlighter
    is expected to return an array of highlighted result text in the form of
    HTML strings.

    See the documentation for the `results` event for a list of the properties
    available on each result object.

    If no `source` is set, the highlighter will not be called.

    @attribute resultHighlighter
    @type Function|null
    **/
    resultHighlighter: {
        setter: '_setResultHighlighter',
        value: null
    },

    /**
    Locator that should be used to extract an array of results from a non-array
    response.

    By default, no locator is applied, and all responses are assumed to be
    arrays by default. If all responses are already arrays, you don't need to
    define a locator.

    The locator may be either a function (which will receive the raw response as
    an argument and must return an array) or a string representing an object
    path, such as "foo.bar.baz" (which would return the value of
    `result.foo.bar.baz` if the response is an object).

    While `resultListLocator` may be set to either a function or a string, it
    will always be returned as a function that accepts a response argument and
    returns an array.

    @attribute resultListLocator
    @type Function|String|null
    **/
    resultListLocator: {
        setter: '_setLocator',
        value: null
    },

    /**
    Current results, or an empty array if there are no results.

    @attribute results
    @type Array
    @default []
    @readonly
    **/
    results: {
        readOnly: true,
        value: []
    },

    /**
    Locator that should be used to extract a plain text string from a non-string
    result item. The resulting text value will typically be the value that ends
    up being inserted into an input field or textarea when the user of an
    autocomplete implementation selects a result.

    By default, no locator is applied, and all results are assumed to be plain
    text strings. If all results are already plain text strings, you don't need
    to define a locator.

    The locator may be either a function (which will receive the raw result as
    an argument and must return a string) or a string representing an object
    path, such as "foo.bar.baz" (which would return the value of
    `result.foo.bar.baz` if the result is an object).

    While `resultTextLocator` may be set to either a function or a string, it
    will always be returned as a function that accepts a result argument and
    returns a string.

    @attribute resultTextLocator
    @type Function|String|null
    **/
    resultTextLocator: {
        setter: '_setLocator',
        value: null
    },

    /**
    Source for autocomplete results. The following source types are supported:

    <dl>
      <dt>Array</dt>
      <dd>
        <p>
        The full array will be provided to any configured filters for each
        query. This is an easy way to create a fully client-side autocomplete
        implementation.
        </p>

        <p>
        Example: `['first result', 'second result', 'etc']`
        </p>
      </dd>

      <dt>DataSource</dt>
      <dd>
        A `DataSource` instance or other object that provides a DataSource-like
        `sendRequest` method. See the `DataSource` documentation for details.
      </dd>

      <dt>Function</dt>
      <dd>
        <p>
        A function source will be called with the current query and a
        callback function as parameters, and should either return an array of
        results (for synchronous operation) or return nothing and pass an
        array of results to the provided callback (for asynchronous
        operation).
        </p>

        <p>
        Example (synchronous):
        </p>

        <pre>
        function (query) {
            return ['foo', 'bar'];
        }
        </pre>

        <p>
        Example (async):
        </p>

        <pre>
        function (query, callback) {
            callback(['foo', 'bar']);
        }
        </pre>
      </dd>

      <dt>Object</dt>
      <dd>
        <p>
        An object will be treated as a query hashmap. If a property on the
        object matches the current query, the value of that property will be
        used as the response.
        </p>

        <p>
        The response is assumed to be an array of results by default. If the
        response is not an array, provide a `resultListLocator` to
        process the response and return an array.
        </p>

        <p>
        Example: `{foo: ['foo result 1', 'foo result 2'], bar: ['bar result']}`
        </p>
      </dd>
    </dl>

    If the optional `autocomplete-sources` module is loaded, then
    the following additional source types will be supported as well:

    <dl>
      <dt>&lt;select&gt; Node</dt>
      <dd>
        You may provide a YUI Node instance wrapping a &lt;select&gt;
        element, and the options in the list will be used as results. You
        will also need to specify a `resultTextLocator` of 'text'
        or 'value', depending on what you want to use as the text of the
        result.

        Each result will be an object with the following properties:

        <dl>
          <dt>html (String)</dt>
          <dd>
            <p>HTML content of the &lt;option&gt; element.</p>
          </dd>

          <dt>index (Number)</dt>
          <dd>
            <p>Index of the &lt;option&gt; element in the list.</p>
          </dd>

          <dt>node (Y.Node)</dt>
          <dd>
            <p>Node instance referring to the original &lt;option&gt; element.</p>
          </dd>

          <dt>selected (Boolean)</dt>
          <dd>
            <p>Whether or not this item is currently selected in the
            &lt;select&gt; list.</p>
          </dd>

          <dt>text (String)</dt>
          <dd>
            <p>Text content of the &lt;option&gt; element.</p>
          </dd>

          <dt>value (String)</dt>
          <dd>
            <p>Value of the &lt;option&gt; element.</p>
          </dd>
        </dl>
      </dd>

      <dt>String (JSONP URL)</dt>
      <dd>
        <p>
        If a URL with a `{callback}` placeholder is provided, it will be used to
        make a JSONP request. The `{query}` placeholder will be replaced with
        the current query, and the `{callback}` placeholder will be replaced
        with an internally-generated JSONP callback name. Both placeholders must
        appear in the URL, or the request will fail. An optional `{maxResults}`
        placeholder may also be provided, and will be replaced with the value of
        the maxResults attribute (or 1000 if the maxResults attribute is 0 or
        less).
        </p>

        <p>
        The response is assumed to be an array of results by default. If the
        response is not an array, provide a `resultListLocator` to process the
        response and return an array.
        </p>

        <p>
        <strong>The `jsonp` module must be loaded in order for
        JSONP URL sources to work.</strong> If the `jsonp` module
        is not already loaded, it will be loaded on demand if possible.
        </p>

        <p>
        Example: `'http://example.com/search?q={query}&callback={callback}'`
        </p>
      </dd>

      <dt>String (XHR URL)</dt>
      <dd>
        <p>
        If a URL without a `{callback}` placeholder is provided, it will be used
        to make a same-origin XHR request. The `{query}` placeholder will be
        replaced with the current query. An optional `{maxResults}` placeholder
        may also be provided, and will be replaced with the value of the
        maxResults attribute (or 1000 if the maxResults attribute is 0 or less).
        </p>

        <p>
        The response is assumed to be a JSON array of results by default. If the
        response is a JSON object and not an array, provide a
        `resultListLocator` to process the response and return an array. If the
        response is in some form other than JSON, you will need to use a custom
        DataSource instance as the source.
        </p>

        <p>
        <strong>The `io-base` and `json-parse` modules
        must be loaded in order for XHR URL sources to work.</strong> If
        these modules are not already loaded, they will be loaded on demand
        if possible.
        </p>

        <p>
        Example: `'http://example.com/search?q={query}'`
        </p>
      </dd>

      <dt>String (YQL query)</dt>
      <dd>
        <p>
        If a YQL query is provided, it will be used to make a YQL request. The
        `{query}` placeholder will be replaced with the current autocomplete
        query. This placeholder must appear in the YQL query, or the request
        will fail. An optional `{maxResults}` placeholder may also be provided,
        and will be replaced with the value of the maxResults attribute (or 1000
        if the maxResults attribute is 0 or less).
        </p>

        <p>
        <strong>The `yql` module must be loaded in order for YQL
        sources to work.</strong> If the `yql` module is not
        already loaded, it will be loaded on demand if possible.
        </p>

        <p>
        Example: `'select * from search.suggest where query="{query}"'`
        </p>
      </dd>
    </dl>

    As an alternative to providing a source, you could simply listen for `query`
    events and handle them any way you see fit. Providing a source is optional,
    but will usually be simpler.

    @attribute source
    @type Array|DataSource|Function|Node|Object|String|null
    **/
    source: {
        setter: '_setSource',
        value: null
    },

    /**
    May be used to force a specific source type, overriding the automatic source
    type detection. It should almost never be necessary to do this, but as they
    taught us in the Boy Scouts, one should always be prepared, so it's here if
    you need it. Be warned that if you set this attribute and something breaks,
    it's your own fault.

    Supported `sourceType` values are: 'array', 'datasource', 'function', and
    'object'.

    If the `autocomplete-sources` module is loaded, the following additional
    source types are supported: 'io', 'jsonp', 'select', 'string', 'yql'

    @attribute sourceType
    @type String
    **/
    sourceType: {
        value: null
    },

    /**
    If the `inputNode` specified at instantiation time has a `node-tokeninput`
    plugin attached to it, this attribute will be a reference to the
    `Y.Plugin.TokenInput` instance.

    @attribute tokenInput
    @type Plugin.TokenInput
    @readonly
    **/
    tokenInput: {
        readOnly: true
    },

    /**
    Current value of the input node.

    @attribute value
    @type String
    @default ''
    **/
    value: {
        // Why duplicate this._inputNode.get('value')? Because we need a
        // reliable way to track the source of value changes. We want to perform
        // completion when the user changes the value, but not when we change
        // the value.
        value: ''
    }
};

// This tells Y.Base.create() to copy these static properties to any class
// AutoCompleteBase is mixed into.
AutoCompleteBase._buildCfg = {
    aggregates: ['SOURCE_TYPES'],
    statics   : ['UI_SRC']
};

/**
Mapping of built-in source types to their setter functions. DataSource instances
and DataSource-like objects are handled natively, so are not mapped here.

@property SOURCE_TYPES
@type {Object}
@static
**/
AutoCompleteBase.SOURCE_TYPES = {
    array     : '_createArraySource',
    'function': '_createFunctionSource',
    object    : '_createObjectSource'
};

AutoCompleteBase.UI_SRC = (Y.Widget && Y.Widget.UI_SRC) || 'ui';

Y.AutoCompleteBase = AutoCompleteBase;


}, '3.7.3', {"optional": ["autocomplete-sources"], "requires": ["array-extras", "base-build", "escape", "event-valuechange", "node-base"]});
