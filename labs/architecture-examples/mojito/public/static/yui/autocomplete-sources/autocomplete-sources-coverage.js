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
_yuitest_coverage["build/autocomplete-sources/autocomplete-sources.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/autocomplete-sources/autocomplete-sources.js",
    code: []
};
_yuitest_coverage["build/autocomplete-sources/autocomplete-sources.js"].code=["YUI.add('autocomplete-sources', function (Y, NAME) {","","/**","Mixes support for JSONP and YQL result sources into AutoCompleteBase.","","@module autocomplete","@submodule autocomplete-sources","**/","","var ACBase = Y.AutoCompleteBase,","    Lang   = Y.Lang,","","    _SOURCE_SUCCESS = '_sourceSuccess',","","    MAX_RESULTS         = 'maxResults',","    REQUEST_TEMPLATE    = 'requestTemplate',","    RESULT_LIST_LOCATOR = 'resultListLocator';","","// Add prototype properties and methods to AutoCompleteBase.","Y.mix(ACBase.prototype, {","    /**","    Regular expression used to determine whether a String source is a YQL query.","","    @property _YQL_SOURCE_REGEX","    @type RegExp","    @protected","    @for AutoCompleteBase","    **/","    _YQL_SOURCE_REGEX: /^(?:select|set|use)\\s+/i,","","    /**","    Runs before AutoCompleteBase's `_createObjectSource()` method and augments","    it to support additional object-based source types.","","    @method _beforeCreateObjectSource","    @param {String} source","    @protected","    @for AutoCompleteBase","    **/","    _beforeCreateObjectSource: function (source) {","        // If the object is a <select> node, use the options as the result","        // source.","        if (source instanceof Y.Node &&","                source.get('nodeName').toLowerCase() === 'select') {","","            return this._createSelectSource(source);","        }","","        // If the object is a JSONPRequest instance, try to use it as a JSONP","        // source.","        if (Y.JSONPRequest && source instanceof Y.JSONPRequest) {","            return this._createJSONPSource(source);","        }","","        // Fall back to a basic object source.","        return this._createObjectSource(source);","    },","","    /**","    Creates a DataSource-like object that uses `Y.io` as a source. See the","    `source` attribute for more details.","","    @method _createIOSource","    @param {String} source URL.","    @return {Object} DataSource-like object.","    @protected","    @for AutoCompleteBase","    **/","    _createIOSource: function (source) {","        var ioSource = {type: 'io'},","            that     = this,","            ioRequest, lastRequest, loading;","","        // Private internal _sendRequest method that will be assigned to","        // ioSource.sendRequest once io-base and json-parse are available.","        function _sendRequest(request) {","            var cacheKey = request.request;","","            // Return immediately on a cached response.","            if (that._cache && cacheKey in that._cache) {","                that[_SOURCE_SUCCESS](that._cache[cacheKey], request);","                return;","            }","","            // Cancel any outstanding requests.","            if (ioRequest && ioRequest.isInProgress()) {","                ioRequest.abort();","            }","","            ioRequest = Y.io(that._getXHRUrl(source, request), {","                on: {","                    success: function (tid, response) {","                        var data;","","                        try {","                            data = Y.JSON.parse(response.responseText);","                        } catch (ex) {","                            Y.error('JSON parse error', ex);","                        }","","                        if (data) {","                            that._cache && (that._cache[cacheKey] = data);","                            that[_SOURCE_SUCCESS](data, request);","                        }","                    }","                }","            });","        }","","        ioSource.sendRequest = function (request) {","            // Keep track of the most recent request in case there are multiple","            // requests while we're waiting for the IO module to load. Only the","            // most recent request will be sent.","            lastRequest = request;","","            if (loading) { return; }","","            loading = true;","","            // Lazy-load the io-base and json-parse modules if necessary,","            // then overwrite the sendRequest method to bypass this check in","            // the future.","            Y.use('io-base', 'json-parse', function () {","                ioSource.sendRequest = _sendRequest;","                _sendRequest(lastRequest);","            });","        };","","        return ioSource;","    },","","    /**","    Creates a DataSource-like object that uses the specified JSONPRequest","    instance as a source. See the `source` attribute for more details.","","    @method _createJSONPSource","    @param {JSONPRequest|String} source URL string or JSONPRequest instance.","    @return {Object} DataSource-like object.","    @protected","    @for AutoCompleteBase","    **/","    _createJSONPSource: function (source) {","        var jsonpSource = {type: 'jsonp'},","            that        = this,","            lastRequest, loading;","","        function _sendRequest(request) {","            var cacheKey = request.request,","                query    = request.query;","","            if (that._cache && cacheKey in that._cache) {","                that[_SOURCE_SUCCESS](that._cache[cacheKey], request);","                return;","            }","","            // Hack alert: JSONPRequest currently doesn't support","            // per-request callbacks, so we're reaching into the protected","            // _config object to make it happen.","            //","            // This limitation is mentioned in the following JSONP","            // enhancement ticket:","            //","            // http://yuilibrary.com/projects/yui3/ticket/2529371","            source._config.on.success = function (data) {","                that._cache && (that._cache[cacheKey] = data);","                that[_SOURCE_SUCCESS](data, request);","            };","","            source.send(query);","        }","","        jsonpSource.sendRequest = function (request) {","            // Keep track of the most recent request in case there are multiple","            // requests while we're waiting for the JSONP module to load. Only","            // the most recent request will be sent.","            lastRequest = request;","","            if (loading) { return; }","","            loading = true;","","            // Lazy-load the JSONP module if necessary, then overwrite the","            // sendRequest method to bypass this check in the future.","            Y.use('jsonp', function () {","                // Turn the source into a JSONPRequest instance if it isn't","                // one already.","                if (!(source instanceof Y.JSONPRequest)) {","                    source = new Y.JSONPRequest(source, {","                        format: Y.bind(that._jsonpFormatter, that)","                    });","                }","","                jsonpSource.sendRequest = _sendRequest;","                _sendRequest(lastRequest);","            });","        };","","        return jsonpSource;","    },","","    /**","    Creates a DataSource-like object that uses the specified `<select>` node as","    a source.","","    @method _createSelectSource","    @param {Node} source YUI Node instance wrapping a `<select>` node.","    @return {Object} DataSource-like object.","    @protected","    @for AutoCompleteBase","    **/","    _createSelectSource: function (source) {","        var that = this;","","        return {","            type: 'select',","            sendRequest: function (request) {","                var options = [];","","                source.get('options').each(function (option) {","                    options.push({","                        html    : option.get('innerHTML'),","                        index   : option.get('index'),","                        node    : option,","                        selected: option.get('selected'),","                        text    : option.get('text'),","                        value   : option.get('value')","                    });","                });","","                that[_SOURCE_SUCCESS](options, request);","            }","        };","    },","","    /**","    Creates a DataSource-like object that calls the specified  URL or executes","    the specified YQL query for results. If the string starts with \"select \",","    \"use \", or \"set \" (case-insensitive), it's assumed to be a YQL query;","    otherwise, it's assumed to be a URL (which may be absolute or relative).","    URLs containing a \"{callback}\" placeholder are assumed to be JSONP URLs; all","    others will use XHR. See the `source` attribute for more details.","","    @method _createStringSource","    @param {String} source URL or YQL query.","    @return {Object} DataSource-like object.","    @protected","    @for AutoCompleteBase","    **/","    _createStringSource: function (source) {","        if (this._YQL_SOURCE_REGEX.test(source)) {","            // Looks like a YQL query.","            return this._createYQLSource(source);","        } else if (source.indexOf('{callback}') !== -1) {","            // Contains a {callback} param and isn't a YQL query, so it must be","            // JSONP.","            return this._createJSONPSource(source);","        } else {","            // Not a YQL query or JSONP, so we'll assume it's an XHR URL.","            return this._createIOSource(source);","        }","    },","","    /**","    Creates a DataSource-like object that uses the specified YQL query string to","    create a YQL-based source. See the `source` attribute for details. If no","    `resultListLocator` is defined, this method will set a best-guess locator","    that might work for many typical YQL queries.","","    @method _createYQLSource","    @param {String} source YQL query.","    @return {Object} DataSource-like object.","    @protected","    @for AutoCompleteBase","    **/","    _createYQLSource: function (source) {","        var that      = this,","            yqlSource = {type: 'yql'},","            lastRequest, loading, yqlRequest;","","        if (!that.get(RESULT_LIST_LOCATOR)) {","            that.set(RESULT_LIST_LOCATOR, that._defaultYQLLocator);","        }","","        function _sendRequest(request) {","            var query      = request.query,","                env        = that.get('yqlEnv'),","                maxResults = that.get(MAX_RESULTS),","                callback, opts, yqlQuery;","","            yqlQuery = Lang.sub(source, {","                maxResults: maxResults > 0 ? maxResults : 1000,","                request   : request.request,","                query     : query","            });","","            if (that._cache && yqlQuery in that._cache) {","                that[_SOURCE_SUCCESS](that._cache[yqlQuery], request);","                return;","            }","","            callback = function (data) {","                that._cache && (that._cache[yqlQuery] = data);","                that[_SOURCE_SUCCESS](data, request);","            };","","            opts = {proto: that.get('yqlProtocol')};","","            // Only create a new YQLRequest instance if this is the","            // first request. For subsequent requests, we'll reuse the","            // original instance.","            if (yqlRequest) {","                yqlRequest._callback   = callback;","                yqlRequest._opts       = opts;","                yqlRequest._params.q   = yqlQuery;","","                if (env) {","                    yqlRequest._params.env = env;","                }","            } else {","                yqlRequest = new Y.YQLRequest(yqlQuery, {","                    on: {success: callback},","                    allowCache: false // temp workaround until JSONP has per-URL callback proxies","                }, env ? {env: env} : null, opts);","            }","","            yqlRequest.send();","        }","","        yqlSource.sendRequest = function (request) {","            // Keep track of the most recent request in case there are multiple","            // requests while we're waiting for the YQL module to load. Only the","            // most recent request will be sent.","            lastRequest = request;","","            if (!loading) {","                // Lazy-load the YQL module if necessary, then overwrite the","                // sendRequest method to bypass this check in the future.","                loading = true;","","                Y.use('yql', function () {","                    yqlSource.sendRequest = _sendRequest;","                    _sendRequest(lastRequest);","                });","            }","        };","","        return yqlSource;","    },","","    /**","    Default resultListLocator used when a string-based YQL source is set and the","    implementer hasn't already specified one.","","    @method _defaultYQLLocator","    @param {Object} response YQL response object.","    @return {Array}","    @protected","    @for AutoCompleteBase","    **/","    _defaultYQLLocator: function (response) {","        var results = response && response.query && response.query.results,","            values;","","        if (results && Lang.isObject(results)) {","            // If there's only a single value on YQL's results object, that","            // value almost certainly contains the array of results we want. If","            // there are 0 or 2+ values, then the values themselves are most","            // likely the results we want.","            values  = Y.Object.values(results) || [];","            results = values.length === 1 ? values[0] : values;","","            if (!Lang.isArray(results)) {","                results = [results];","            }","        } else {","            results = [];","        }","","        return results;","    },","","    /**","    Returns a formatted XHR URL based on the specified base _url_, _query_, and","    the current _requestTemplate_ if any.","","    @method _getXHRUrl","    @param {String} url Base URL.","    @param {Object} request Request object containing `query` and `request`","      properties.","    @return {String} Formatted URL.","    @protected","    @for AutoCompleteBase","    **/","    _getXHRUrl: function (url, request) {","        var maxResults = this.get(MAX_RESULTS);","","        if (request.query !== request.request) {","            // Append the request template to the URL.","            url += request.request;","        }","","        return Lang.sub(url, {","            maxResults: maxResults > 0 ? maxResults : 1000,","            query     : encodeURIComponent(request.query)","        });","    },","","    /**","    URL formatter passed to `JSONPRequest` instances.","","    @method _jsonpFormatter","    @param {String} url","    @param {String} proxy","    @param {String} query","    @return {String} Formatted URL","    @protected","    @for AutoCompleteBase","    **/","    _jsonpFormatter: function (url, proxy, query) {","        var maxResults      = this.get(MAX_RESULTS),","            requestTemplate = this.get(REQUEST_TEMPLATE);","","        if (requestTemplate) {","            url += requestTemplate(query);","        }","","        return Lang.sub(url, {","            callback  : proxy,","            maxResults: maxResults > 0 ? maxResults : 1000,","            query     : encodeURIComponent(query)","        });","    }","});","","// Add attributes to AutoCompleteBase.","Y.mix(ACBase.ATTRS, {","    /**","    YQL environment file URL to load when the `source` is set to a YQL query.","    Set this to `null` to use the default Open Data Tables environment file","    (http://datatables.org/alltables.env).","","    @attribute yqlEnv","    @type String","    @default null","    @for AutoCompleteBase","    **/","    yqlEnv: {","        value: null","    },","","    /**","    URL protocol to use when the `source` is set to a YQL query.","","    @attribute yqlProtocol","    @type String","    @default 'http'","    @for AutoCompleteBase","    **/","    yqlProtocol: {","        value: 'http'","    }","});","","// Tell AutoCompleteBase about the new source types it can now support.","Y.mix(ACBase.SOURCE_TYPES, {","    io    : '_createIOSource',","    jsonp : '_createJSONPSource',","    object: '_beforeCreateObjectSource', // Run our version before the base version.","    select: '_createSelectSource',","    string: '_createStringSource',","    yql   : '_createYQLSource'","}, true);","","","}, '3.7.3', {\"optional\": [\"io-base\", \"json-parse\", \"jsonp\", \"yql\"], \"requires\": [\"autocomplete-base\"]});"];
_yuitest_coverage["build/autocomplete-sources/autocomplete-sources.js"].lines = {"1":0,"10":0,"20":0,"43":0,"46":0,"51":0,"52":0,"56":0,"70":0,"76":0,"77":0,"80":0,"81":0,"82":0,"86":0,"87":0,"90":0,"93":0,"95":0,"96":0,"98":0,"101":0,"102":0,"103":0,"110":0,"114":0,"116":0,"118":0,"123":0,"124":0,"125":0,"129":0,"143":0,"147":0,"148":0,"151":0,"152":0,"153":0,"164":0,"165":0,"166":0,"169":0,"172":0,"176":0,"178":0,"180":0,"184":0,"187":0,"188":0,"193":0,"194":0,"198":0,"212":0,"214":0,"217":0,"219":0,"220":0,"230":0,"250":0,"252":0,"253":0,"256":0,"259":0,"276":0,"280":0,"281":0,"284":0,"285":0,"290":0,"296":0,"297":0,"298":0,"301":0,"302":0,"303":0,"306":0,"311":0,"312":0,"313":0,"314":0,"316":0,"317":0,"320":0,"326":0,"329":0,"333":0,"335":0,"338":0,"340":0,"341":0,"342":0,"347":0,"361":0,"364":0,"369":0,"370":0,"372":0,"373":0,"376":0,"379":0,"395":0,"397":0,"399":0,"402":0,"420":0,"423":0,"424":0,"427":0,"436":0,"465":0};
_yuitest_coverage["build/autocomplete-sources/autocomplete-sources.js"].functions = {"_beforeCreateObjectSource:40":0,"success:92":0,"_sendRequest:76":0,"(anonymous 2):123":0,"sendRequest:110":0,"_createIOSource:69":0,"success:164":0,"_sendRequest:147":0,"(anonymous 3):184":0,"sendRequest:172":0,"_createJSONPSource:142":0,"(anonymous 4):219":0,"sendRequest:216":0,"_createSelectSource:211":0,"_createStringSource:249":0,"callback:301":0,"_sendRequest:284":0,"(anonymous 5):340":0,"sendRequest:329":0,"_createYQLSource:275":0,"_defaultYQLLocator:360":0,"_getXHRUrl:394":0,"_jsonpFormatter:419":0,"(anonymous 1):1":0};
_yuitest_coverage["build/autocomplete-sources/autocomplete-sources.js"].coveredLines = 110;
_yuitest_coverage["build/autocomplete-sources/autocomplete-sources.js"].coveredFunctions = 24;
_yuitest_coverline("build/autocomplete-sources/autocomplete-sources.js", 1);
YUI.add('autocomplete-sources', function (Y, NAME) {

/**
Mixes support for JSONP and YQL result sources into AutoCompleteBase.

@module autocomplete
@submodule autocomplete-sources
**/

_yuitest_coverfunc("build/autocomplete-sources/autocomplete-sources.js", "(anonymous 1)", 1);
_yuitest_coverline("build/autocomplete-sources/autocomplete-sources.js", 10);
var ACBase = Y.AutoCompleteBase,
    Lang   = Y.Lang,

    _SOURCE_SUCCESS = '_sourceSuccess',

    MAX_RESULTS         = 'maxResults',
    REQUEST_TEMPLATE    = 'requestTemplate',
    RESULT_LIST_LOCATOR = 'resultListLocator';

// Add prototype properties and methods to AutoCompleteBase.
_yuitest_coverline("build/autocomplete-sources/autocomplete-sources.js", 20);
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
        _yuitest_coverfunc("build/autocomplete-sources/autocomplete-sources.js", "_beforeCreateObjectSource", 40);
_yuitest_coverline("build/autocomplete-sources/autocomplete-sources.js", 43);
if (source instanceof Y.Node &&
                source.get('nodeName').toLowerCase() === 'select') {

            _yuitest_coverline("build/autocomplete-sources/autocomplete-sources.js", 46);
return this._createSelectSource(source);
        }

        // If the object is a JSONPRequest instance, try to use it as a JSONP
        // source.
        _yuitest_coverline("build/autocomplete-sources/autocomplete-sources.js", 51);
if (Y.JSONPRequest && source instanceof Y.JSONPRequest) {
            _yuitest_coverline("build/autocomplete-sources/autocomplete-sources.js", 52);
return this._createJSONPSource(source);
        }

        // Fall back to a basic object source.
        _yuitest_coverline("build/autocomplete-sources/autocomplete-sources.js", 56);
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
        _yuitest_coverfunc("build/autocomplete-sources/autocomplete-sources.js", "_createIOSource", 69);
_yuitest_coverline("build/autocomplete-sources/autocomplete-sources.js", 70);
var ioSource = {type: 'io'},
            that     = this,
            ioRequest, lastRequest, loading;

        // Private internal _sendRequest method that will be assigned to
        // ioSource.sendRequest once io-base and json-parse are available.
        _yuitest_coverline("build/autocomplete-sources/autocomplete-sources.js", 76);
function _sendRequest(request) {
            _yuitest_coverfunc("build/autocomplete-sources/autocomplete-sources.js", "_sendRequest", 76);
_yuitest_coverline("build/autocomplete-sources/autocomplete-sources.js", 77);
var cacheKey = request.request;

            // Return immediately on a cached response.
            _yuitest_coverline("build/autocomplete-sources/autocomplete-sources.js", 80);
if (that._cache && cacheKey in that._cache) {
                _yuitest_coverline("build/autocomplete-sources/autocomplete-sources.js", 81);
that[_SOURCE_SUCCESS](that._cache[cacheKey], request);
                _yuitest_coverline("build/autocomplete-sources/autocomplete-sources.js", 82);
return;
            }

            // Cancel any outstanding requests.
            _yuitest_coverline("build/autocomplete-sources/autocomplete-sources.js", 86);
if (ioRequest && ioRequest.isInProgress()) {
                _yuitest_coverline("build/autocomplete-sources/autocomplete-sources.js", 87);
ioRequest.abort();
            }

            _yuitest_coverline("build/autocomplete-sources/autocomplete-sources.js", 90);
ioRequest = Y.io(that._getXHRUrl(source, request), {
                on: {
                    success: function (tid, response) {
                        _yuitest_coverfunc("build/autocomplete-sources/autocomplete-sources.js", "success", 92);
_yuitest_coverline("build/autocomplete-sources/autocomplete-sources.js", 93);
var data;

                        _yuitest_coverline("build/autocomplete-sources/autocomplete-sources.js", 95);
try {
                            _yuitest_coverline("build/autocomplete-sources/autocomplete-sources.js", 96);
data = Y.JSON.parse(response.responseText);
                        } catch (ex) {
                            _yuitest_coverline("build/autocomplete-sources/autocomplete-sources.js", 98);
Y.error('JSON parse error', ex);
                        }

                        _yuitest_coverline("build/autocomplete-sources/autocomplete-sources.js", 101);
if (data) {
                            _yuitest_coverline("build/autocomplete-sources/autocomplete-sources.js", 102);
that._cache && (that._cache[cacheKey] = data);
                            _yuitest_coverline("build/autocomplete-sources/autocomplete-sources.js", 103);
that[_SOURCE_SUCCESS](data, request);
                        }
                    }
                }
            });
        }

        _yuitest_coverline("build/autocomplete-sources/autocomplete-sources.js", 110);
ioSource.sendRequest = function (request) {
            // Keep track of the most recent request in case there are multiple
            // requests while we're waiting for the IO module to load. Only the
            // most recent request will be sent.
            _yuitest_coverfunc("build/autocomplete-sources/autocomplete-sources.js", "sendRequest", 110);
_yuitest_coverline("build/autocomplete-sources/autocomplete-sources.js", 114);
lastRequest = request;

            _yuitest_coverline("build/autocomplete-sources/autocomplete-sources.js", 116);
if (loading) { return; }

            _yuitest_coverline("build/autocomplete-sources/autocomplete-sources.js", 118);
loading = true;

            // Lazy-load the io-base and json-parse modules if necessary,
            // then overwrite the sendRequest method to bypass this check in
            // the future.
            _yuitest_coverline("build/autocomplete-sources/autocomplete-sources.js", 123);
Y.use('io-base', 'json-parse', function () {
                _yuitest_coverfunc("build/autocomplete-sources/autocomplete-sources.js", "(anonymous 2)", 123);
_yuitest_coverline("build/autocomplete-sources/autocomplete-sources.js", 124);
ioSource.sendRequest = _sendRequest;
                _yuitest_coverline("build/autocomplete-sources/autocomplete-sources.js", 125);
_sendRequest(lastRequest);
            });
        };

        _yuitest_coverline("build/autocomplete-sources/autocomplete-sources.js", 129);
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
        _yuitest_coverfunc("build/autocomplete-sources/autocomplete-sources.js", "_createJSONPSource", 142);
_yuitest_coverline("build/autocomplete-sources/autocomplete-sources.js", 143);
var jsonpSource = {type: 'jsonp'},
            that        = this,
            lastRequest, loading;

        _yuitest_coverline("build/autocomplete-sources/autocomplete-sources.js", 147);
function _sendRequest(request) {
            _yuitest_coverfunc("build/autocomplete-sources/autocomplete-sources.js", "_sendRequest", 147);
_yuitest_coverline("build/autocomplete-sources/autocomplete-sources.js", 148);
var cacheKey = request.request,
                query    = request.query;

            _yuitest_coverline("build/autocomplete-sources/autocomplete-sources.js", 151);
if (that._cache && cacheKey in that._cache) {
                _yuitest_coverline("build/autocomplete-sources/autocomplete-sources.js", 152);
that[_SOURCE_SUCCESS](that._cache[cacheKey], request);
                _yuitest_coverline("build/autocomplete-sources/autocomplete-sources.js", 153);
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
            _yuitest_coverline("build/autocomplete-sources/autocomplete-sources.js", 164);
source._config.on.success = function (data) {
                _yuitest_coverfunc("build/autocomplete-sources/autocomplete-sources.js", "success", 164);
_yuitest_coverline("build/autocomplete-sources/autocomplete-sources.js", 165);
that._cache && (that._cache[cacheKey] = data);
                _yuitest_coverline("build/autocomplete-sources/autocomplete-sources.js", 166);
that[_SOURCE_SUCCESS](data, request);
            };

            _yuitest_coverline("build/autocomplete-sources/autocomplete-sources.js", 169);
source.send(query);
        }

        _yuitest_coverline("build/autocomplete-sources/autocomplete-sources.js", 172);
jsonpSource.sendRequest = function (request) {
            // Keep track of the most recent request in case there are multiple
            // requests while we're waiting for the JSONP module to load. Only
            // the most recent request will be sent.
            _yuitest_coverfunc("build/autocomplete-sources/autocomplete-sources.js", "sendRequest", 172);
_yuitest_coverline("build/autocomplete-sources/autocomplete-sources.js", 176);
lastRequest = request;

            _yuitest_coverline("build/autocomplete-sources/autocomplete-sources.js", 178);
if (loading) { return; }

            _yuitest_coverline("build/autocomplete-sources/autocomplete-sources.js", 180);
loading = true;

            // Lazy-load the JSONP module if necessary, then overwrite the
            // sendRequest method to bypass this check in the future.
            _yuitest_coverline("build/autocomplete-sources/autocomplete-sources.js", 184);
Y.use('jsonp', function () {
                // Turn the source into a JSONPRequest instance if it isn't
                // one already.
                _yuitest_coverfunc("build/autocomplete-sources/autocomplete-sources.js", "(anonymous 3)", 184);
_yuitest_coverline("build/autocomplete-sources/autocomplete-sources.js", 187);
if (!(source instanceof Y.JSONPRequest)) {
                    _yuitest_coverline("build/autocomplete-sources/autocomplete-sources.js", 188);
source = new Y.JSONPRequest(source, {
                        format: Y.bind(that._jsonpFormatter, that)
                    });
                }

                _yuitest_coverline("build/autocomplete-sources/autocomplete-sources.js", 193);
jsonpSource.sendRequest = _sendRequest;
                _yuitest_coverline("build/autocomplete-sources/autocomplete-sources.js", 194);
_sendRequest(lastRequest);
            });
        };

        _yuitest_coverline("build/autocomplete-sources/autocomplete-sources.js", 198);
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
        _yuitest_coverfunc("build/autocomplete-sources/autocomplete-sources.js", "_createSelectSource", 211);
_yuitest_coverline("build/autocomplete-sources/autocomplete-sources.js", 212);
var that = this;

        _yuitest_coverline("build/autocomplete-sources/autocomplete-sources.js", 214);
return {
            type: 'select',
            sendRequest: function (request) {
                _yuitest_coverfunc("build/autocomplete-sources/autocomplete-sources.js", "sendRequest", 216);
_yuitest_coverline("build/autocomplete-sources/autocomplete-sources.js", 217);
var options = [];

                _yuitest_coverline("build/autocomplete-sources/autocomplete-sources.js", 219);
source.get('options').each(function (option) {
                    _yuitest_coverfunc("build/autocomplete-sources/autocomplete-sources.js", "(anonymous 4)", 219);
_yuitest_coverline("build/autocomplete-sources/autocomplete-sources.js", 220);
options.push({
                        html    : option.get('innerHTML'),
                        index   : option.get('index'),
                        node    : option,
                        selected: option.get('selected'),
                        text    : option.get('text'),
                        value   : option.get('value')
                    });
                });

                _yuitest_coverline("build/autocomplete-sources/autocomplete-sources.js", 230);
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
        _yuitest_coverfunc("build/autocomplete-sources/autocomplete-sources.js", "_createStringSource", 249);
_yuitest_coverline("build/autocomplete-sources/autocomplete-sources.js", 250);
if (this._YQL_SOURCE_REGEX.test(source)) {
            // Looks like a YQL query.
            _yuitest_coverline("build/autocomplete-sources/autocomplete-sources.js", 252);
return this._createYQLSource(source);
        } else {_yuitest_coverline("build/autocomplete-sources/autocomplete-sources.js", 253);
if (source.indexOf('{callback}') !== -1) {
            // Contains a {callback} param and isn't a YQL query, so it must be
            // JSONP.
            _yuitest_coverline("build/autocomplete-sources/autocomplete-sources.js", 256);
return this._createJSONPSource(source);
        } else {
            // Not a YQL query or JSONP, so we'll assume it's an XHR URL.
            _yuitest_coverline("build/autocomplete-sources/autocomplete-sources.js", 259);
return this._createIOSource(source);
        }}
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
        _yuitest_coverfunc("build/autocomplete-sources/autocomplete-sources.js", "_createYQLSource", 275);
_yuitest_coverline("build/autocomplete-sources/autocomplete-sources.js", 276);
var that      = this,
            yqlSource = {type: 'yql'},
            lastRequest, loading, yqlRequest;

        _yuitest_coverline("build/autocomplete-sources/autocomplete-sources.js", 280);
if (!that.get(RESULT_LIST_LOCATOR)) {
            _yuitest_coverline("build/autocomplete-sources/autocomplete-sources.js", 281);
that.set(RESULT_LIST_LOCATOR, that._defaultYQLLocator);
        }

        _yuitest_coverline("build/autocomplete-sources/autocomplete-sources.js", 284);
function _sendRequest(request) {
            _yuitest_coverfunc("build/autocomplete-sources/autocomplete-sources.js", "_sendRequest", 284);
_yuitest_coverline("build/autocomplete-sources/autocomplete-sources.js", 285);
var query      = request.query,
                env        = that.get('yqlEnv'),
                maxResults = that.get(MAX_RESULTS),
                callback, opts, yqlQuery;

            _yuitest_coverline("build/autocomplete-sources/autocomplete-sources.js", 290);
yqlQuery = Lang.sub(source, {
                maxResults: maxResults > 0 ? maxResults : 1000,
                request   : request.request,
                query     : query
            });

            _yuitest_coverline("build/autocomplete-sources/autocomplete-sources.js", 296);
if (that._cache && yqlQuery in that._cache) {
                _yuitest_coverline("build/autocomplete-sources/autocomplete-sources.js", 297);
that[_SOURCE_SUCCESS](that._cache[yqlQuery], request);
                _yuitest_coverline("build/autocomplete-sources/autocomplete-sources.js", 298);
return;
            }

            _yuitest_coverline("build/autocomplete-sources/autocomplete-sources.js", 301);
callback = function (data) {
                _yuitest_coverfunc("build/autocomplete-sources/autocomplete-sources.js", "callback", 301);
_yuitest_coverline("build/autocomplete-sources/autocomplete-sources.js", 302);
that._cache && (that._cache[yqlQuery] = data);
                _yuitest_coverline("build/autocomplete-sources/autocomplete-sources.js", 303);
that[_SOURCE_SUCCESS](data, request);
            };

            _yuitest_coverline("build/autocomplete-sources/autocomplete-sources.js", 306);
opts = {proto: that.get('yqlProtocol')};

            // Only create a new YQLRequest instance if this is the
            // first request. For subsequent requests, we'll reuse the
            // original instance.
            _yuitest_coverline("build/autocomplete-sources/autocomplete-sources.js", 311);
if (yqlRequest) {
                _yuitest_coverline("build/autocomplete-sources/autocomplete-sources.js", 312);
yqlRequest._callback   = callback;
                _yuitest_coverline("build/autocomplete-sources/autocomplete-sources.js", 313);
yqlRequest._opts       = opts;
                _yuitest_coverline("build/autocomplete-sources/autocomplete-sources.js", 314);
yqlRequest._params.q   = yqlQuery;

                _yuitest_coverline("build/autocomplete-sources/autocomplete-sources.js", 316);
if (env) {
                    _yuitest_coverline("build/autocomplete-sources/autocomplete-sources.js", 317);
yqlRequest._params.env = env;
                }
            } else {
                _yuitest_coverline("build/autocomplete-sources/autocomplete-sources.js", 320);
yqlRequest = new Y.YQLRequest(yqlQuery, {
                    on: {success: callback},
                    allowCache: false // temp workaround until JSONP has per-URL callback proxies
                }, env ? {env: env} : null, opts);
            }

            _yuitest_coverline("build/autocomplete-sources/autocomplete-sources.js", 326);
yqlRequest.send();
        }

        _yuitest_coverline("build/autocomplete-sources/autocomplete-sources.js", 329);
yqlSource.sendRequest = function (request) {
            // Keep track of the most recent request in case there are multiple
            // requests while we're waiting for the YQL module to load. Only the
            // most recent request will be sent.
            _yuitest_coverfunc("build/autocomplete-sources/autocomplete-sources.js", "sendRequest", 329);
_yuitest_coverline("build/autocomplete-sources/autocomplete-sources.js", 333);
lastRequest = request;

            _yuitest_coverline("build/autocomplete-sources/autocomplete-sources.js", 335);
if (!loading) {
                // Lazy-load the YQL module if necessary, then overwrite the
                // sendRequest method to bypass this check in the future.
                _yuitest_coverline("build/autocomplete-sources/autocomplete-sources.js", 338);
loading = true;

                _yuitest_coverline("build/autocomplete-sources/autocomplete-sources.js", 340);
Y.use('yql', function () {
                    _yuitest_coverfunc("build/autocomplete-sources/autocomplete-sources.js", "(anonymous 5)", 340);
_yuitest_coverline("build/autocomplete-sources/autocomplete-sources.js", 341);
yqlSource.sendRequest = _sendRequest;
                    _yuitest_coverline("build/autocomplete-sources/autocomplete-sources.js", 342);
_sendRequest(lastRequest);
                });
            }
        };

        _yuitest_coverline("build/autocomplete-sources/autocomplete-sources.js", 347);
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
        _yuitest_coverfunc("build/autocomplete-sources/autocomplete-sources.js", "_defaultYQLLocator", 360);
_yuitest_coverline("build/autocomplete-sources/autocomplete-sources.js", 361);
var results = response && response.query && response.query.results,
            values;

        _yuitest_coverline("build/autocomplete-sources/autocomplete-sources.js", 364);
if (results && Lang.isObject(results)) {
            // If there's only a single value on YQL's results object, that
            // value almost certainly contains the array of results we want. If
            // there are 0 or 2+ values, then the values themselves are most
            // likely the results we want.
            _yuitest_coverline("build/autocomplete-sources/autocomplete-sources.js", 369);
values  = Y.Object.values(results) || [];
            _yuitest_coverline("build/autocomplete-sources/autocomplete-sources.js", 370);
results = values.length === 1 ? values[0] : values;

            _yuitest_coverline("build/autocomplete-sources/autocomplete-sources.js", 372);
if (!Lang.isArray(results)) {
                _yuitest_coverline("build/autocomplete-sources/autocomplete-sources.js", 373);
results = [results];
            }
        } else {
            _yuitest_coverline("build/autocomplete-sources/autocomplete-sources.js", 376);
results = [];
        }

        _yuitest_coverline("build/autocomplete-sources/autocomplete-sources.js", 379);
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
        _yuitest_coverfunc("build/autocomplete-sources/autocomplete-sources.js", "_getXHRUrl", 394);
_yuitest_coverline("build/autocomplete-sources/autocomplete-sources.js", 395);
var maxResults = this.get(MAX_RESULTS);

        _yuitest_coverline("build/autocomplete-sources/autocomplete-sources.js", 397);
if (request.query !== request.request) {
            // Append the request template to the URL.
            _yuitest_coverline("build/autocomplete-sources/autocomplete-sources.js", 399);
url += request.request;
        }

        _yuitest_coverline("build/autocomplete-sources/autocomplete-sources.js", 402);
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
        _yuitest_coverfunc("build/autocomplete-sources/autocomplete-sources.js", "_jsonpFormatter", 419);
_yuitest_coverline("build/autocomplete-sources/autocomplete-sources.js", 420);
var maxResults      = this.get(MAX_RESULTS),
            requestTemplate = this.get(REQUEST_TEMPLATE);

        _yuitest_coverline("build/autocomplete-sources/autocomplete-sources.js", 423);
if (requestTemplate) {
            _yuitest_coverline("build/autocomplete-sources/autocomplete-sources.js", 424);
url += requestTemplate(query);
        }

        _yuitest_coverline("build/autocomplete-sources/autocomplete-sources.js", 427);
return Lang.sub(url, {
            callback  : proxy,
            maxResults: maxResults > 0 ? maxResults : 1000,
            query     : encodeURIComponent(query)
        });
    }
});

// Add attributes to AutoCompleteBase.
_yuitest_coverline("build/autocomplete-sources/autocomplete-sources.js", 436);
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
_yuitest_coverline("build/autocomplete-sources/autocomplete-sources.js", 465);
Y.mix(ACBase.SOURCE_TYPES, {
    io    : '_createIOSource',
    jsonp : '_createJSONPSource',
    object: '_beforeCreateObjectSource', // Run our version before the base version.
    select: '_createSelectSource',
    string: '_createStringSource',
    yql   : '_createYQLSource'
}, true);


}, '3.7.3', {"optional": ["io-base", "json-parse", "jsonp", "yql"], "requires": ["autocomplete-base"]});
