/*
YUI 3.7.3 (build 5687)
Copyright 2012 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/
YUI.add('autocomplete-sources', function (Y, NAME) {

/**
Mixes support for JSONP and YQL result sources into AutoCompleteBase.

@module autocomplete
@submodule autocomplete-sources
**/

var ACBase = Y.AutoCompleteBase,
    Lang   = Y.Lang,

    _SOURCE_SUCCESS = '_sourceSuccess',

    MAX_RESULTS         = 'maxResults',
    REQUEST_TEMPLATE    = 'requestTemplate',
    RESULT_LIST_LOCATOR = 'resultListLocator';

// Add prototype properties and methods to AutoCompleteBase.
Y.mix(ACBase.prototype, {
    /**
    Regular expression used to determine whether a String source is a YQL query.

    @property _YQL_SOURCE_REGEX
    @type RegExp
    @protected
    @for AutoCompleteBase
    **/
    _YQL_SOURCE_REGEX: /^(?:select|set|use)\s+/i,

    /**
    Runs before AutoCompleteBase's `_createObjectSource()` method and augments
    it to support additional object-based source types.

    @method _beforeCreateObjectSource
    @param {String} source
    @protected
    @for AutoCompleteBase
    **/
    _beforeCreateObjectSource: function (source) {
        // If the object is a <select> node, use the options as the result
        // source.
        if (source instanceof Y.Node &&
                source.get('nodeName').toLowerCase() === 'select') {

            return this._createSelectSource(source);
        }

        // If the object is a JSONPRequest instance, try to use it as a JSONP
        // source.
        if (Y.JSONPRequest && source instanceof Y.JSONPRequest) {
            return this._createJSONPSource(source);
        }

        // Fall back to a basic object source.
        return this._createObjectSource(source);
    },

    /**
    Creates a DataSource-like object that uses `Y.io` as a source. See the
    `source` attribute for more details.

    @method _createIOSource
    @param {String} source URL.
    @return {Object} DataSource-like object.
    @protected
    @for AutoCompleteBase
    **/
    _createIOSource: function (source) {
        var ioSource = {type: 'io'},
            that     = this,
            ioRequest, lastRequest, loading;

        // Private internal _sendRequest method that will be assigned to
        // ioSource.sendRequest once io-base and json-parse are available.
        function _sendRequest(request) {
            var cacheKey = request.request;

            // Return immediately on a cached response.
            if (that._cache && cacheKey in that._cache) {
                that[_SOURCE_SUCCESS](that._cache[cacheKey], request);
                return;
            }

            // Cancel any outstanding requests.
            if (ioRequest && ioRequest.isInProgress()) {
                ioRequest.abort();
            }

            ioRequest = Y.io(that._getXHRUrl(source, request), {
                on: {
                    success: function (tid, response) {
                        var data;

                        try {
                            data = Y.JSON.parse(response.responseText);
                        } catch (ex) {
                            Y.error('JSON parse error', ex);
                        }

                        if (data) {
                            that._cache && (that._cache[cacheKey] = data);
                            that[_SOURCE_SUCCESS](data, request);
                        }
                    }
                }
            });
        }

        ioSource.sendRequest = function (request) {
            // Keep track of the most recent request in case there are multiple
            // requests while we're waiting for the IO module to load. Only the
            // most recent request will be sent.
            lastRequest = request;

            if (loading) { return; }

            loading = true;

            // Lazy-load the io-base and json-parse modules if necessary,
            // then overwrite the sendRequest method to bypass this check in
            // the future.
            Y.use('io-base', 'json-parse', function () {
                ioSource.sendRequest = _sendRequest;
                _sendRequest(lastRequest);
            });
        };

        return ioSource;
    },

    /**
    Creates a DataSource-like object that uses the specified JSONPRequest
    instance as a source. See the `source` attribute for more details.

    @method _createJSONPSource
    @param {JSONPRequest|String} source URL string or JSONPRequest instance.
    @return {Object} DataSource-like object.
    @protected
    @for AutoCompleteBase
    **/
    _createJSONPSource: function (source) {
        var jsonpSource = {type: 'jsonp'},
            that        = this,
            lastRequest, loading;

        function _sendRequest(request) {
            var cacheKey = request.request,
                query    = request.query;

            if (that._cache && cacheKey in that._cache) {
                that[_SOURCE_SUCCESS](that._cache[cacheKey], request);
                return;
            }

            // Hack alert: JSONPRequest currently doesn't support
            // per-request callbacks, so we're reaching into the protected
            // _config object to make it happen.
            //
            // This limitation is mentioned in the following JSONP
            // enhancement ticket:
            //
            // http://yuilibrary.com/projects/yui3/ticket/2529371
            source._config.on.success = function (data) {
                that._cache && (that._cache[cacheKey] = data);
                that[_SOURCE_SUCCESS](data, request);
            };

            source.send(query);
        }

        jsonpSource.sendRequest = function (request) {
            // Keep track of the most recent request in case there are multiple
            // requests while we're waiting for the JSONP module to load. Only
            // the most recent request will be sent.
            lastRequest = request;

            if (loading) { return; }

            loading = true;

            // Lazy-load the JSONP module if necessary, then overwrite the
            // sendRequest method to bypass this check in the future.
            Y.use('jsonp', function () {
                // Turn the source into a JSONPRequest instance if it isn't
                // one already.
                if (!(source instanceof Y.JSONPRequest)) {
                    source = new Y.JSONPRequest(source, {
                        format: Y.bind(that._jsonpFormatter, that)
                    });
                }

                jsonpSource.sendRequest = _sendRequest;
                _sendRequest(lastRequest);
            });
        };

        return jsonpSource;
    },

    /**
    Creates a DataSource-like object that uses the specified `<select>` node as
    a source.

    @method _createSelectSource
    @param {Node} source YUI Node instance wrapping a `<select>` node.
    @return {Object} DataSource-like object.
    @protected
    @for AutoCompleteBase
    **/
    _createSelectSource: function (source) {
        var that = this;

        return {
            type: 'select',
            sendRequest: function (request) {
                var options = [];

                source.get('options').each(function (option) {
                    options.push({
                        html    : option.get('innerHTML'),
                        index   : option.get('index'),
                        node    : option,
                        selected: option.get('selected'),
                        text    : option.get('text'),
                        value   : option.get('value')
                    });
                });

                that[_SOURCE_SUCCESS](options, request);
            }
        };
    },

    /**
    Creates a DataSource-like object that calls the specified  URL or executes
    the specified YQL query for results. If the string starts with "select ",
    "use ", or "set " (case-insensitive), it's assumed to be a YQL query;
    otherwise, it's assumed to be a URL (which may be absolute or relative).
    URLs containing a "{callback}" placeholder are assumed to be JSONP URLs; all
    others will use XHR. See the `source` attribute for more details.

    @method _createStringSource
    @param {String} source URL or YQL query.
    @return {Object} DataSource-like object.
    @protected
    @for AutoCompleteBase
    **/
    _createStringSource: function (source) {
        if (this._YQL_SOURCE_REGEX.test(source)) {
            // Looks like a YQL query.
            return this._createYQLSource(source);
        } else if (source.indexOf('{callback}') !== -1) {
            // Contains a {callback} param and isn't a YQL query, so it must be
            // JSONP.
            return this._createJSONPSource(source);
        } else {
            // Not a YQL query or JSONP, so we'll assume it's an XHR URL.
            return this._createIOSource(source);
        }
    },

    /**
    Creates a DataSource-like object that uses the specified YQL query string to
    create a YQL-based source. See the `source` attribute for details. If no
    `resultListLocator` is defined, this method will set a best-guess locator
    that might work for many typical YQL queries.

    @method _createYQLSource
    @param {String} source YQL query.
    @return {Object} DataSource-like object.
    @protected
    @for AutoCompleteBase
    **/
    _createYQLSource: function (source) {
        var that      = this,
            yqlSource = {type: 'yql'},
            lastRequest, loading, yqlRequest;

        if (!that.get(RESULT_LIST_LOCATOR)) {
            that.set(RESULT_LIST_LOCATOR, that._defaultYQLLocator);
        }

        function _sendRequest(request) {
            var query      = request.query,
                env        = that.get('yqlEnv'),
                maxResults = that.get(MAX_RESULTS),
                callback, opts, yqlQuery;

            yqlQuery = Lang.sub(source, {
                maxResults: maxResults > 0 ? maxResults : 1000,
                request   : request.request,
                query     : query
            });

            if (that._cache && yqlQuery in that._cache) {
                that[_SOURCE_SUCCESS](that._cache[yqlQuery], request);
                return;
            }

            callback = function (data) {
                that._cache && (that._cache[yqlQuery] = data);
                that[_SOURCE_SUCCESS](data, request);
            };

            opts = {proto: that.get('yqlProtocol')};

            // Only create a new YQLRequest instance if this is the
            // first request. For subsequent requests, we'll reuse the
            // original instance.
            if (yqlRequest) {
                yqlRequest._callback   = callback;
                yqlRequest._opts       = opts;
                yqlRequest._params.q   = yqlQuery;

                if (env) {
                    yqlRequest._params.env = env;
                }
            } else {
                yqlRequest = new Y.YQLRequest(yqlQuery, {
                    on: {success: callback},
                    allowCache: false // temp workaround until JSONP has per-URL callback proxies
                }, env ? {env: env} : null, opts);
            }

            yqlRequest.send();
        }

        yqlSource.sendRequest = function (request) {
            // Keep track of the most recent request in case there are multiple
            // requests while we're waiting for the YQL module to load. Only the
            // most recent request will be sent.
            lastRequest = request;

            if (!loading) {
                // Lazy-load the YQL module if necessary, then overwrite the
                // sendRequest method to bypass this check in the future.
                loading = true;

                Y.use('yql', function () {
                    yqlSource.sendRequest = _sendRequest;
                    _sendRequest(lastRequest);
                });
            }
        };

        return yqlSource;
    },

    /**
    Default resultListLocator used when a string-based YQL source is set and the
    implementer hasn't already specified one.

    @method _defaultYQLLocator
    @param {Object} response YQL response object.
    @return {Array}
    @protected
    @for AutoCompleteBase
    **/
    _defaultYQLLocator: function (response) {
        var results = response && response.query && response.query.results,
            values;

        if (results && Lang.isObject(results)) {
            // If there's only a single value on YQL's results object, that
            // value almost certainly contains the array of results we want. If
            // there are 0 or 2+ values, then the values themselves are most
            // likely the results we want.
            values  = Y.Object.values(results) || [];
            results = values.length === 1 ? values[0] : values;

            if (!Lang.isArray(results)) {
                results = [results];
            }
        } else {
            results = [];
        }

        return results;
    },

    /**
    Returns a formatted XHR URL based on the specified base _url_, _query_, and
    the current _requestTemplate_ if any.

    @method _getXHRUrl
    @param {String} url Base URL.
    @param {Object} request Request object containing `query` and `request`
      properties.
    @return {String} Formatted URL.
    @protected
    @for AutoCompleteBase
    **/
    _getXHRUrl: function (url, request) {
        var maxResults = this.get(MAX_RESULTS);

        if (request.query !== request.request) {
            // Append the request template to the URL.
            url += request.request;
        }

        return Lang.sub(url, {
            maxResults: maxResults > 0 ? maxResults : 1000,
            query     : encodeURIComponent(request.query)
        });
    },

    /**
    URL formatter passed to `JSONPRequest` instances.

    @method _jsonpFormatter
    @param {String} url
    @param {String} proxy
    @param {String} query
    @return {String} Formatted URL
    @protected
    @for AutoCompleteBase
    **/
    _jsonpFormatter: function (url, proxy, query) {
        var maxResults      = this.get(MAX_RESULTS),
            requestTemplate = this.get(REQUEST_TEMPLATE);

        if (requestTemplate) {
            url += requestTemplate(query);
        }

        return Lang.sub(url, {
            callback  : proxy,
            maxResults: maxResults > 0 ? maxResults : 1000,
            query     : encodeURIComponent(query)
        });
    }
});

// Add attributes to AutoCompleteBase.
Y.mix(ACBase.ATTRS, {
    /**
    YQL environment file URL to load when the `source` is set to a YQL query.
    Set this to `null` to use the default Open Data Tables environment file
    (http://datatables.org/alltables.env).

    @attribute yqlEnv
    @type String
    @default null
    @for AutoCompleteBase
    **/
    yqlEnv: {
        value: null
    },

    /**
    URL protocol to use when the `source` is set to a YQL query.

    @attribute yqlProtocol
    @type String
    @default 'http'
    @for AutoCompleteBase
    **/
    yqlProtocol: {
        value: 'http'
    }
});

// Tell AutoCompleteBase about the new source types it can now support.
Y.mix(ACBase.SOURCE_TYPES, {
    io    : '_createIOSource',
    jsonp : '_createJSONPSource',
    object: '_beforeCreateObjectSource', // Run our version before the base version.
    select: '_createSelectSource',
    string: '_createStringSource',
    yql   : '_createYQLSource'
}, true);


}, '3.7.3', {"optional": ["io-base", "json-parse", "jsonp", "yql"], "requires": ["autocomplete-base"]});
