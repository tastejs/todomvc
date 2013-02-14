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
_yuitest_coverage["build/jsonp/jsonp.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/jsonp/jsonp.js",
    code: []
};
_yuitest_coverage["build/jsonp/jsonp.js"].code=["YUI.add('jsonp', function (Y, NAME) {","","var isFunction = Y.Lang.isFunction;","","/**"," * <p>Provides a JSONPRequest class for repeated JSONP calls, and a convenience"," * method Y.jsonp(url, callback) to instantiate and send a JSONP request.</p>"," *"," * <p>Both the constructor as well as the convenience function take two"," * parameters: a url string and a callback.</p>"," *"," * <p>The url provided must include the placeholder string"," * &quot;{callback}&quot; which will be replaced by a dynamically"," * generated routing function to pass the data to your callback function."," * An example url might look like"," * &quot;http://example.com/service?callback={callback}&quot;.</p>"," *"," * <p>The second parameter can be a callback function that accepts the JSON"," * payload as its argument, or a configuration object supporting the keys:</p>"," * <ul>"," *   <li>on - map of callback subscribers"," *      <ul>"," *         <li>success - function handler for successful transmission</li>"," *         <li>failure - function handler for failed transmission</li>"," *         <li>timeout - function handler for transactions that timeout</li>"," *      </ul>"," *  </li>"," *  <li>format  - override function for inserting the proxy name in the url</li>"," *  <li>timeout - the number of milliseconds to wait before giving up</li>"," *  <li>context - becomes <code>this</code> in the callbacks</li>"," *  <li>args    - array of subsequent parameters to pass to the callbacks</li>"," *  <li>allowCache - use the same proxy name for all requests? (boolean)</li>"," * </ul>"," *"," * @module jsonp"," * @class JSONPRequest"," * @constructor"," * @param url {String} the url of the JSONP service"," * @param callback {Object|Function} the default callback configuration or"," *                                   success handler"," */","function JSONPRequest() {","    this._init.apply(this, arguments);","}","","JSONPRequest.prototype = {","    /**","     * Set up the success and failure handlers and the regex pattern used","     * to insert the temporary callback name in the url.","     *","     * @method _init","     * @param url {String} the url of the JSONP service","     * @param callback {Object|Function} Optional success callback or config","     *                  object containing success and failure functions and","     *                  the url regex.","     * @protected","     */","    _init : function (url, callback) {","        this.url = url;","","        /**","         * Map of the number of requests currently pending responses per","         * generated proxy.  Used to ensure the proxy is not flushed if the","         * request times out and there is a timeout handler and success","         * handler, and used by connections configured to allowCache to make","         * sure the proxy isn't deleted until the last response has returned.","         *","         * @property _requests","         * @private","         * @type {Object}","         */","        this._requests = {};","","        /**","         * Map of the number of timeouts received from the destination url","         * by generated proxy.  Used to ensure the proxy is not flushed if the","         * request times out and there is a timeout handler and success","         * handler, and used by connections configured to allowCache to make","         * sure the proxy isn't deleted until the last response has returned.","         *","         * @property _timeouts","         * @private","         * @type {Object}","         */","        this._timeouts = {};","","        // Accept a function, an object, or nothing","        callback = (isFunction(callback)) ?","            { on: { success: callback } } :","            callback || {};","","        var subs = callback.on || {};","","        if (!subs.success) {","            subs.success = this._defaultCallback(url, callback);","        }","","        // Apply defaults and store","        this._config = Y.merge({","                context: this,","                args   : [],","                format : this._format,","                allowCache: false","            }, callback, { on: subs });","    },","","    /** ","     * Override this method to provide logic to default the success callback if","     * it is not provided at construction.  This is overridden by jsonp-url to","     * parse the callback from the url string.","     * ","     * @method _defaultCallback","     * @param url {String} the url passed at construction","     * @param config {Object} (optional) the config object passed at","     *                        construction","     * @return {Function}","     */","    _defaultCallback: function () {},","","    /** ","     * Issues the JSONP request.","     *","     * @method send","     * @param args* {any} any additional arguments to pass to the url formatter","     *              beyond the base url and the proxy function name","     * @chainable","     */","    send : function () {","        var self   = this,","            args   = Y.Array(arguments, 0, true),","            config = self._config,","            proxy  = self._proxy || Y.guid(),","            url;","            ","        // TODO: support allowCache as time value","        if (config.allowCache) {","            self._proxy = proxy;","        }","","        if (self._requests[proxy] === undefined) {","            self._requests[proxy] = 0;","        }","        if (self._timeouts[proxy] === undefined) {","            self._timeouts[proxy] = 0;","        }","        self._requests[proxy]++;","","","        args.unshift(self.url, 'YUI.Env.JSONP.' + proxy);","        url = config.format.apply(self, args);","","        if (!config.on.success) {","            return self;","        }","","        function wrap(fn, isTimeout) {","            return (isFunction(fn)) ?","                function (data) {","                    var execute = true,","                        counter = '_requests';","","                    //if (config.allowCache) {","                        // A lot of wrangling to make sure timeouts result in","                        // fewer success callbacks, but the proxy is properly","                        // cleaned up.","                        if (isTimeout) {","                            ++self._timeouts[proxy];","                            --self._requests[proxy];","                        } else {","                            if (!self._requests[proxy]) {","                                execute = false;","                                counter = '_timeouts';","                            }","                            --self[counter][proxy];","                        }","                    //}","","                    if (!self._requests[proxy] && !self._timeouts[proxy]) {","                        delete YUI.Env.JSONP[proxy];","                    }","","                    if (execute) {","                        fn.apply(config.context, [data].concat(config.args));","                    }","                } :","                null;","        }","","        // Temporary un-sandboxed function alias","        // TODO: queuing","        YUI.Env.JSONP[proxy] = wrap(config.on.success);","","        Y.Get.script(url, {","            onFailure : wrap(config.on.failure),","            onTimeout : wrap(config.on.timeout, true),","            timeout   : config.timeout,","            charset   : config.charset,","            attributes: config.attributes","        });","","        return self;","    },","","    /**","     * Default url formatter.  Looks for callback= in the url and appends it","     * if not present.  The supplied proxy name will be assigned to the query","     * param.  Override this method by passing a function as the","     * &quot;format&quot; property in the config object to the constructor.","     *","     * @method _format","     * @param url { String } the original url","     * @param proxy {String} the function name that will be used as a proxy to","     *      the configured callback methods.","     * @param args* {any} additional args passed to send()","     * @return {String} fully qualified JSONP url","     * @protected","     */","    _format: function (url, proxy) {","        return url.replace(/\\{callback\\}/, proxy);","    }","};","","Y.JSONPRequest = JSONPRequest;","","/**"," *"," * @method jsonp"," * @param url {String} the url of the JSONP service with the {callback}"," *          placeholder where the callback function name typically goes."," * @param c {Function|Object} Callback function accepting the JSON payload"," *          as its argument, or a configuration object (see above)."," * @param args* {any} additional arguments to pass to send()"," * @return {JSONPRequest}"," * @static"," * @for YUI"," */","Y.jsonp = function (url,c) {","    var req = new Y.JSONPRequest(url,c);","    return req.send.apply(req, Y.Array(arguments, 2, true));","};","","if (!YUI.Env.JSONP) {","    YUI.Env.JSONP = {};","}","","","}, '3.7.3', {\"requires\": [\"get\", \"oop\"]});"];
_yuitest_coverage["build/jsonp/jsonp.js"].lines = {"1":0,"3":0,"42":0,"43":0,"46":0,"59":0,"72":0,"85":0,"88":0,"92":0,"94":0,"95":0,"99":0,"129":0,"136":0,"137":0,"140":0,"141":0,"143":0,"144":0,"146":0,"149":0,"150":0,"152":0,"153":0,"156":0,"157":0,"159":0,"166":0,"167":0,"168":0,"170":0,"171":0,"172":0,"174":0,"178":0,"179":0,"182":0,"183":0,"191":0,"193":0,"201":0,"219":0,"223":0,"237":0,"238":0,"239":0,"242":0,"243":0};
_yuitest_coverage["build/jsonp/jsonp.js"].functions = {"JSONPRequest:42":0,"_init:58":0,"(anonymous 2):158":0,"wrap:156":0,"send:128":0,"_format:218":0,"jsonp:237":0,"(anonymous 1):1":0};
_yuitest_coverage["build/jsonp/jsonp.js"].coveredLines = 49;
_yuitest_coverage["build/jsonp/jsonp.js"].coveredFunctions = 8;
_yuitest_coverline("build/jsonp/jsonp.js", 1);
YUI.add('jsonp', function (Y, NAME) {

_yuitest_coverfunc("build/jsonp/jsonp.js", "(anonymous 1)", 1);
_yuitest_coverline("build/jsonp/jsonp.js", 3);
var isFunction = Y.Lang.isFunction;

/**
 * <p>Provides a JSONPRequest class for repeated JSONP calls, and a convenience
 * method Y.jsonp(url, callback) to instantiate and send a JSONP request.</p>
 *
 * <p>Both the constructor as well as the convenience function take two
 * parameters: a url string and a callback.</p>
 *
 * <p>The url provided must include the placeholder string
 * &quot;{callback}&quot; which will be replaced by a dynamically
 * generated routing function to pass the data to your callback function.
 * An example url might look like
 * &quot;http://example.com/service?callback={callback}&quot;.</p>
 *
 * <p>The second parameter can be a callback function that accepts the JSON
 * payload as its argument, or a configuration object supporting the keys:</p>
 * <ul>
 *   <li>on - map of callback subscribers
 *      <ul>
 *         <li>success - function handler for successful transmission</li>
 *         <li>failure - function handler for failed transmission</li>
 *         <li>timeout - function handler for transactions that timeout</li>
 *      </ul>
 *  </li>
 *  <li>format  - override function for inserting the proxy name in the url</li>
 *  <li>timeout - the number of milliseconds to wait before giving up</li>
 *  <li>context - becomes <code>this</code> in the callbacks</li>
 *  <li>args    - array of subsequent parameters to pass to the callbacks</li>
 *  <li>allowCache - use the same proxy name for all requests? (boolean)</li>
 * </ul>
 *
 * @module jsonp
 * @class JSONPRequest
 * @constructor
 * @param url {String} the url of the JSONP service
 * @param callback {Object|Function} the default callback configuration or
 *                                   success handler
 */
_yuitest_coverline("build/jsonp/jsonp.js", 42);
function JSONPRequest() {
    _yuitest_coverfunc("build/jsonp/jsonp.js", "JSONPRequest", 42);
_yuitest_coverline("build/jsonp/jsonp.js", 43);
this._init.apply(this, arguments);
}

_yuitest_coverline("build/jsonp/jsonp.js", 46);
JSONPRequest.prototype = {
    /**
     * Set up the success and failure handlers and the regex pattern used
     * to insert the temporary callback name in the url.
     *
     * @method _init
     * @param url {String} the url of the JSONP service
     * @param callback {Object|Function} Optional success callback or config
     *                  object containing success and failure functions and
     *                  the url regex.
     * @protected
     */
    _init : function (url, callback) {
        _yuitest_coverfunc("build/jsonp/jsonp.js", "_init", 58);
_yuitest_coverline("build/jsonp/jsonp.js", 59);
this.url = url;

        /**
         * Map of the number of requests currently pending responses per
         * generated proxy.  Used to ensure the proxy is not flushed if the
         * request times out and there is a timeout handler and success
         * handler, and used by connections configured to allowCache to make
         * sure the proxy isn't deleted until the last response has returned.
         *
         * @property _requests
         * @private
         * @type {Object}
         */
        _yuitest_coverline("build/jsonp/jsonp.js", 72);
this._requests = {};

        /**
         * Map of the number of timeouts received from the destination url
         * by generated proxy.  Used to ensure the proxy is not flushed if the
         * request times out and there is a timeout handler and success
         * handler, and used by connections configured to allowCache to make
         * sure the proxy isn't deleted until the last response has returned.
         *
         * @property _timeouts
         * @private
         * @type {Object}
         */
        _yuitest_coverline("build/jsonp/jsonp.js", 85);
this._timeouts = {};

        // Accept a function, an object, or nothing
        _yuitest_coverline("build/jsonp/jsonp.js", 88);
callback = (isFunction(callback)) ?
            { on: { success: callback } } :
            callback || {};

        _yuitest_coverline("build/jsonp/jsonp.js", 92);
var subs = callback.on || {};

        _yuitest_coverline("build/jsonp/jsonp.js", 94);
if (!subs.success) {
            _yuitest_coverline("build/jsonp/jsonp.js", 95);
subs.success = this._defaultCallback(url, callback);
        }

        // Apply defaults and store
        _yuitest_coverline("build/jsonp/jsonp.js", 99);
this._config = Y.merge({
                context: this,
                args   : [],
                format : this._format,
                allowCache: false
            }, callback, { on: subs });
    },

    /** 
     * Override this method to provide logic to default the success callback if
     * it is not provided at construction.  This is overridden by jsonp-url to
     * parse the callback from the url string.
     * 
     * @method _defaultCallback
     * @param url {String} the url passed at construction
     * @param config {Object} (optional) the config object passed at
     *                        construction
     * @return {Function}
     */
    _defaultCallback: function () {},

    /** 
     * Issues the JSONP request.
     *
     * @method send
     * @param args* {any} any additional arguments to pass to the url formatter
     *              beyond the base url and the proxy function name
     * @chainable
     */
    send : function () {
        _yuitest_coverfunc("build/jsonp/jsonp.js", "send", 128);
_yuitest_coverline("build/jsonp/jsonp.js", 129);
var self   = this,
            args   = Y.Array(arguments, 0, true),
            config = self._config,
            proxy  = self._proxy || Y.guid(),
            url;
            
        // TODO: support allowCache as time value
        _yuitest_coverline("build/jsonp/jsonp.js", 136);
if (config.allowCache) {
            _yuitest_coverline("build/jsonp/jsonp.js", 137);
self._proxy = proxy;
        }

        _yuitest_coverline("build/jsonp/jsonp.js", 140);
if (self._requests[proxy] === undefined) {
            _yuitest_coverline("build/jsonp/jsonp.js", 141);
self._requests[proxy] = 0;
        }
        _yuitest_coverline("build/jsonp/jsonp.js", 143);
if (self._timeouts[proxy] === undefined) {
            _yuitest_coverline("build/jsonp/jsonp.js", 144);
self._timeouts[proxy] = 0;
        }
        _yuitest_coverline("build/jsonp/jsonp.js", 146);
self._requests[proxy]++;


        _yuitest_coverline("build/jsonp/jsonp.js", 149);
args.unshift(self.url, 'YUI.Env.JSONP.' + proxy);
        _yuitest_coverline("build/jsonp/jsonp.js", 150);
url = config.format.apply(self, args);

        _yuitest_coverline("build/jsonp/jsonp.js", 152);
if (!config.on.success) {
            _yuitest_coverline("build/jsonp/jsonp.js", 153);
return self;
        }

        _yuitest_coverline("build/jsonp/jsonp.js", 156);
function wrap(fn, isTimeout) {
            _yuitest_coverfunc("build/jsonp/jsonp.js", "wrap", 156);
_yuitest_coverline("build/jsonp/jsonp.js", 157);
return (isFunction(fn)) ?
                function (data) {
                    _yuitest_coverfunc("build/jsonp/jsonp.js", "(anonymous 2)", 158);
_yuitest_coverline("build/jsonp/jsonp.js", 159);
var execute = true,
                        counter = '_requests';

                    //if (config.allowCache) {
                        // A lot of wrangling to make sure timeouts result in
                        // fewer success callbacks, but the proxy is properly
                        // cleaned up.
                        _yuitest_coverline("build/jsonp/jsonp.js", 166);
if (isTimeout) {
                            _yuitest_coverline("build/jsonp/jsonp.js", 167);
++self._timeouts[proxy];
                            _yuitest_coverline("build/jsonp/jsonp.js", 168);
--self._requests[proxy];
                        } else {
                            _yuitest_coverline("build/jsonp/jsonp.js", 170);
if (!self._requests[proxy]) {
                                _yuitest_coverline("build/jsonp/jsonp.js", 171);
execute = false;
                                _yuitest_coverline("build/jsonp/jsonp.js", 172);
counter = '_timeouts';
                            }
                            _yuitest_coverline("build/jsonp/jsonp.js", 174);
--self[counter][proxy];
                        }
                    //}

                    _yuitest_coverline("build/jsonp/jsonp.js", 178);
if (!self._requests[proxy] && !self._timeouts[proxy]) {
                        _yuitest_coverline("build/jsonp/jsonp.js", 179);
delete YUI.Env.JSONP[proxy];
                    }

                    _yuitest_coverline("build/jsonp/jsonp.js", 182);
if (execute) {
                        _yuitest_coverline("build/jsonp/jsonp.js", 183);
fn.apply(config.context, [data].concat(config.args));
                    }
                } :
                null;
        }

        // Temporary un-sandboxed function alias
        // TODO: queuing
        _yuitest_coverline("build/jsonp/jsonp.js", 191);
YUI.Env.JSONP[proxy] = wrap(config.on.success);

        _yuitest_coverline("build/jsonp/jsonp.js", 193);
Y.Get.script(url, {
            onFailure : wrap(config.on.failure),
            onTimeout : wrap(config.on.timeout, true),
            timeout   : config.timeout,
            charset   : config.charset,
            attributes: config.attributes
        });

        _yuitest_coverline("build/jsonp/jsonp.js", 201);
return self;
    },

    /**
     * Default url formatter.  Looks for callback= in the url and appends it
     * if not present.  The supplied proxy name will be assigned to the query
     * param.  Override this method by passing a function as the
     * &quot;format&quot; property in the config object to the constructor.
     *
     * @method _format
     * @param url { String } the original url
     * @param proxy {String} the function name that will be used as a proxy to
     *      the configured callback methods.
     * @param args* {any} additional args passed to send()
     * @return {String} fully qualified JSONP url
     * @protected
     */
    _format: function (url, proxy) {
        _yuitest_coverfunc("build/jsonp/jsonp.js", "_format", 218);
_yuitest_coverline("build/jsonp/jsonp.js", 219);
return url.replace(/\{callback\}/, proxy);
    }
};

_yuitest_coverline("build/jsonp/jsonp.js", 223);
Y.JSONPRequest = JSONPRequest;

/**
 *
 * @method jsonp
 * @param url {String} the url of the JSONP service with the {callback}
 *          placeholder where the callback function name typically goes.
 * @param c {Function|Object} Callback function accepting the JSON payload
 *          as its argument, or a configuration object (see above).
 * @param args* {any} additional arguments to pass to send()
 * @return {JSONPRequest}
 * @static
 * @for YUI
 */
_yuitest_coverline("build/jsonp/jsonp.js", 237);
Y.jsonp = function (url,c) {
    _yuitest_coverfunc("build/jsonp/jsonp.js", "jsonp", 237);
_yuitest_coverline("build/jsonp/jsonp.js", 238);
var req = new Y.JSONPRequest(url,c);
    _yuitest_coverline("build/jsonp/jsonp.js", 239);
return req.send.apply(req, Y.Array(arguments, 2, true));
};

_yuitest_coverline("build/jsonp/jsonp.js", 242);
if (!YUI.Env.JSONP) {
    _yuitest_coverline("build/jsonp/jsonp.js", 243);
YUI.Env.JSONP = {};
}


}, '3.7.3', {"requires": ["get", "oop"]});
