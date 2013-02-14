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
_yuitest_coverage["build/jsonp-url/jsonp-url.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/jsonp-url/jsonp-url.js",
    code: []
};
_yuitest_coverage["build/jsonp-url/jsonp-url.js"].code=["YUI.add('jsonp-url', function (Y, NAME) {","","var JSONPRequest = Y.JSONPRequest,","    getByPath    = Y.Object.getValue,","    noop         = function () {};","","/**"," * Adds support for parsing complex callback identifiers from the jsonp url."," * This includes callback=foo[1]bar.baz[\"goo\"] as well as referencing methods"," * in the YUI instance."," *"," * @module jsonp"," * @submodule jsonp-url"," * @for JSONPRequest"," */","","Y.mix(JSONPRequest.prototype, {","    /**","     * RegExp used by the default URL formatter to insert the generated callback","     * name into the JSONP url.  Looks for a query param callback=.  If a value","     * is assigned, it will be clobbered.","     *","     * @property _pattern","     * @type RegExp","     * @default /\\bcallback=.*?(?=&|$)/i","     * @protected","     */","    _pattern: /\\bcallback=(.*?)(?=&|$)/i,","","    /**","     * Template used by the default URL formatter to add the callback function","     * name to the url.","     *","     * @property _template","     * @type String","     * @default \"callback={callback}\"","     * @protected","     */","    _template: \"callback={callback}\",","","    /**","     * <p>Parses the url for a callback named explicitly in the string.","     * Override this if the target JSONP service uses a different query","     * parameter or url format.</p>","     *","     * <p>If the callback is declared inline, the corresponding function will","     * be returned.  Otherwise null.</p>","     *","     * @method _defaultCallback","     * @param url {String} the url to search in","     * @return {Function} the callback function if found, or null","     * @protected","     */","    _defaultCallback: function (url) {","        var match = url.match(this._pattern),","            keys  = [],","            i = 0,","            locator, path, callback;","","        if (match) {","            // Strip the [\"string keys\"] and [1] array indexes","            locator = match[1]","                .replace(/\\[(['\"])(.*?)\\1\\]/g,","                    function (x, $1, $2) {","                        keys[i] = $2;","                        return '.@' + (i++);","                    })","                .replace(/\\[(\\d+)\\]/g,","                    function (x, $1) {","                        keys[i] = parseInt($1, 10) | 0;","                        return '.@' + (i++);","                    })","                .replace(/^\\./, ''); // remove leading dot","","            // Validate against problematic characters.","            if (!/[^\\w\\.\\$@]/.test(locator)) {","                path = locator.split('.');","                for (i = path.length - 1; i >= 0; --i) {","                    if (path[i].charAt(0) === '@') {","                        path[i] = keys[parseInt(path[i].substr(1), 10)];","                    }","                }","","                // First look for a global function, then the Y, then try the Y","                // again from the second token (to support \"callback=Y.handler\")","                callback = getByPath(Y.config.win, path) ||","                           getByPath(Y, path) ||","                           getByPath(Y, path.slice(1));","            }","        }","","        return callback || noop;","    },","","    /**","     * URL formatter that looks for callback= in the url and appends it","     * if not present.  The supplied proxy name will be assigned to the query","     * param.  Override this method by passing a function as the","     * &quot;format&quot; property in the config object to the constructor.","     *","     * @method _format","     * @param url { String } the original url","     * @param proxy {String} the function name that will be used as a proxy to","     *      the configured callback methods.","     * @return {String} fully qualified JSONP url","     * @protected","     */","    _format: function (url, proxy) {","        var callback = this._template.replace(/\\{callback\\}/, proxy),","            lastChar;","","        if (this._pattern.test(url)) {","            return url.replace(this._pattern, callback);","        } else {","            lastChar = url.slice(-1);","            if (lastChar !== '&' && lastChar !== '?') {","                url += (url.indexOf('?') > -1) ? '&' : '?';","            }","            return url + callback;","        }","    }","","}, true);","","","}, '3.7.3', {\"requires\": [\"jsonp\"]});"];
_yuitest_coverage["build/jsonp-url/jsonp-url.js"].lines = {"1":0,"3":0,"17":0,"55":0,"60":0,"62":0,"65":0,"66":0,"70":0,"71":0,"76":0,"77":0,"78":0,"79":0,"80":0,"86":0,"92":0,"109":0,"112":0,"113":0,"115":0,"116":0,"117":0,"119":0};
_yuitest_coverage["build/jsonp-url/jsonp-url.js"].functions = {"(anonymous 2):64":0,"(anonymous 3):69":0,"_defaultCallback:54":0,"_format:108":0,"(anonymous 1):1":0};
_yuitest_coverage["build/jsonp-url/jsonp-url.js"].coveredLines = 24;
_yuitest_coverage["build/jsonp-url/jsonp-url.js"].coveredFunctions = 5;
_yuitest_coverline("build/jsonp-url/jsonp-url.js", 1);
YUI.add('jsonp-url', function (Y, NAME) {

_yuitest_coverfunc("build/jsonp-url/jsonp-url.js", "(anonymous 1)", 1);
_yuitest_coverline("build/jsonp-url/jsonp-url.js", 3);
var JSONPRequest = Y.JSONPRequest,
    getByPath    = Y.Object.getValue,
    noop         = function () {};

/**
 * Adds support for parsing complex callback identifiers from the jsonp url.
 * This includes callback=foo[1]bar.baz["goo"] as well as referencing methods
 * in the YUI instance.
 *
 * @module jsonp
 * @submodule jsonp-url
 * @for JSONPRequest
 */

_yuitest_coverline("build/jsonp-url/jsonp-url.js", 17);
Y.mix(JSONPRequest.prototype, {
    /**
     * RegExp used by the default URL formatter to insert the generated callback
     * name into the JSONP url.  Looks for a query param callback=.  If a value
     * is assigned, it will be clobbered.
     *
     * @property _pattern
     * @type RegExp
     * @default /\bcallback=.*?(?=&|$)/i
     * @protected
     */
    _pattern: /\bcallback=(.*?)(?=&|$)/i,

    /**
     * Template used by the default URL formatter to add the callback function
     * name to the url.
     *
     * @property _template
     * @type String
     * @default "callback={callback}"
     * @protected
     */
    _template: "callback={callback}",

    /**
     * <p>Parses the url for a callback named explicitly in the string.
     * Override this if the target JSONP service uses a different query
     * parameter or url format.</p>
     *
     * <p>If the callback is declared inline, the corresponding function will
     * be returned.  Otherwise null.</p>
     *
     * @method _defaultCallback
     * @param url {String} the url to search in
     * @return {Function} the callback function if found, or null
     * @protected
     */
    _defaultCallback: function (url) {
        _yuitest_coverfunc("build/jsonp-url/jsonp-url.js", "_defaultCallback", 54);
_yuitest_coverline("build/jsonp-url/jsonp-url.js", 55);
var match = url.match(this._pattern),
            keys  = [],
            i = 0,
            locator, path, callback;

        _yuitest_coverline("build/jsonp-url/jsonp-url.js", 60);
if (match) {
            // Strip the ["string keys"] and [1] array indexes
            _yuitest_coverline("build/jsonp-url/jsonp-url.js", 62);
locator = match[1]
                .replace(/\[(['"])(.*?)\1\]/g,
                    function (x, $1, $2) {
                        _yuitest_coverfunc("build/jsonp-url/jsonp-url.js", "(anonymous 2)", 64);
_yuitest_coverline("build/jsonp-url/jsonp-url.js", 65);
keys[i] = $2;
                        _yuitest_coverline("build/jsonp-url/jsonp-url.js", 66);
return '.@' + (i++);
                    })
                .replace(/\[(\d+)\]/g,
                    function (x, $1) {
                        _yuitest_coverfunc("build/jsonp-url/jsonp-url.js", "(anonymous 3)", 69);
_yuitest_coverline("build/jsonp-url/jsonp-url.js", 70);
keys[i] = parseInt($1, 10) | 0;
                        _yuitest_coverline("build/jsonp-url/jsonp-url.js", 71);
return '.@' + (i++);
                    })
                .replace(/^\./, ''); // remove leading dot

            // Validate against problematic characters.
            _yuitest_coverline("build/jsonp-url/jsonp-url.js", 76);
if (!/[^\w\.\$@]/.test(locator)) {
                _yuitest_coverline("build/jsonp-url/jsonp-url.js", 77);
path = locator.split('.');
                _yuitest_coverline("build/jsonp-url/jsonp-url.js", 78);
for (i = path.length - 1; i >= 0; --i) {
                    _yuitest_coverline("build/jsonp-url/jsonp-url.js", 79);
if (path[i].charAt(0) === '@') {
                        _yuitest_coverline("build/jsonp-url/jsonp-url.js", 80);
path[i] = keys[parseInt(path[i].substr(1), 10)];
                    }
                }

                // First look for a global function, then the Y, then try the Y
                // again from the second token (to support "callback=Y.handler")
                _yuitest_coverline("build/jsonp-url/jsonp-url.js", 86);
callback = getByPath(Y.config.win, path) ||
                           getByPath(Y, path) ||
                           getByPath(Y, path.slice(1));
            }
        }

        _yuitest_coverline("build/jsonp-url/jsonp-url.js", 92);
return callback || noop;
    },

    /**
     * URL formatter that looks for callback= in the url and appends it
     * if not present.  The supplied proxy name will be assigned to the query
     * param.  Override this method by passing a function as the
     * &quot;format&quot; property in the config object to the constructor.
     *
     * @method _format
     * @param url { String } the original url
     * @param proxy {String} the function name that will be used as a proxy to
     *      the configured callback methods.
     * @return {String} fully qualified JSONP url
     * @protected
     */
    _format: function (url, proxy) {
        _yuitest_coverfunc("build/jsonp-url/jsonp-url.js", "_format", 108);
_yuitest_coverline("build/jsonp-url/jsonp-url.js", 109);
var callback = this._template.replace(/\{callback\}/, proxy),
            lastChar;

        _yuitest_coverline("build/jsonp-url/jsonp-url.js", 112);
if (this._pattern.test(url)) {
            _yuitest_coverline("build/jsonp-url/jsonp-url.js", 113);
return url.replace(this._pattern, callback);
        } else {
            _yuitest_coverline("build/jsonp-url/jsonp-url.js", 115);
lastChar = url.slice(-1);
            _yuitest_coverline("build/jsonp-url/jsonp-url.js", 116);
if (lastChar !== '&' && lastChar !== '?') {
                _yuitest_coverline("build/jsonp-url/jsonp-url.js", 117);
url += (url.indexOf('?') > -1) ? '&' : '?';
            }
            _yuitest_coverline("build/jsonp-url/jsonp-url.js", 119);
return url + callback;
        }
    }

}, true);


}, '3.7.3', {"requires": ["jsonp"]});
