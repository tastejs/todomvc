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
_yuitest_coverage["build/io-nodejs/io-nodejs.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/io-nodejs/io-nodejs.js",
    code: []
};
_yuitest_coverage["build/io-nodejs/io-nodejs.js"].code=["YUI.add('io-nodejs', function (Y, NAME) {","","/*global Y: false, Buffer: false, clearInterval: false, clearTimeout: false, console: false, exports: false, global: false, module: false, process: false, querystring: false, require: false, setInterval: false, setTimeout: false, __filename: false, __dirname: false */","    /**","    * Node.js override for IO, methods are mixed into `Y.IO`","    * @module io-nodejs","    * @main io-nodejs","    */","    /**","    * Passthru to the NodeJS <a href=\"https://github.com/mikeal/request\">request</a> module.","    * This method is return of `require('request')` so you can use it inside NodeJS without","    * the IO abstraction.","    * @method request","    * @static","    * @for IO","    */","    if (!Y.IO.request) {","        // Default Request's cookie jar to `false`. This way cookies will not be","        // maintained across requests.","        Y.IO.request = require('request').defaults({jar: false});","    }","","    var codes = require('http').STATUS_CODES;","","    /**","    Flatten headers object","    @method flatten","    @protected","    @for IO","    @param {Object} o The headers object","    @return {String} The flattened headers object","    */","    var flatten = function(o) {","        var str = [];","        Object.keys(o).forEach(function(name) {","            str.push(name + ': ' + o[name]);","        });","        return str.join('\\n');","    };","","","    /**","    NodeJS IO transport, uses the NodeJS <a href=\"https://github.com/mikeal/request\">request</a>","    module under the hood to perform all network IO.","    @method transports.nodejs","    @for IO","    @static","    @return {Object} This object contains only a `send` method that accepts a","    `transaction object`, `uri` and the `config object`.","    @example","","        Y.io('https://somedomain.com/url', {","            method: 'PUT',","            data: '?foo=bar',","            //Extra request module config options.","            request: {","                maxRedirects: 100,","                strictSSL: true,","                multipart: [","                    {","                        'content-type': 'application/json',","                        body: JSON.stringify({","                            foo: 'bar',","                            _attachments: {","                                'message.txt': {","                                    follows: true,","                                    length: 18,","                                    'content_type': 'text/plain'","                                }","                            }","                        })","                    },","                    {","                        body: 'I am an attachment'","                    }","                ]","            },","            on: {","                success: function(id, e) {","                }","            }","        });","    */","","    Y.IO.transports.nodejs = function() {","        return {","            send: function (transaction, uri, config) {","","                config.notify('start', transaction, config);","                config.method = config.method || 'GET';","                config.method = config.method.toUpperCase();","","                var rconf = {","                    method: config.method,","                    uri: uri","                };","","                if (config.data) {","                    if (Y.Lang.isObject(config.data)) {","                        if (Y.QueryString && Y.QueryString.stringify) {","                            rconf.body = Y.QueryString.stringify(config.data);","                        } else {","                        }","                    } else if (Y.Lang.isString(config.data)) {","                        rconf.body = config.data;","                    }","                    if (rconf.method === 'GET') {","                        rconf.uri += (rconf.uri.indexOf('?') > -1 ? '&' : '?') + rconf.body;","                        rconf.body = '';","                    }","                }","                if (config.headers) {","                    rconf.headers = config.headers;","                }","                if (config.timeout) {","                    rconf.timeout = config.timeout;","                }","                if (config.request) {","                    Y.mix(rconf, config.request);","                }","                Y.IO.request(rconf, function(err, data) {","","                    if (err) {","                        transaction.c = err;","                        config.notify(((err.code === 'ETIMEDOUT') ? 'timeout' : 'failure'), transaction, config);","                        return;","                    }","                    if (data) {","                        transaction.c = {","                            status: data.statusCode,","                            statusCode: data.statusCode,","                            statusText: codes[data.statusCode],","                            headers: data.headers,","                            responseText: data.body,","                            responseXML: null,","                            getResponseHeader: function(name) {","                                return this.headers[name];","                            },","                            getAllResponseHeaders: function() {","                                return flatten(this.headers);","                            }","                        };","                    }","","                    config.notify('complete', transaction, config);","                    config.notify(((data && (data.statusCode >= 200 && data.statusCode <= 299)) ? 'success' : 'failure'), transaction, config);","                });","","                var ret = {","                    io: transaction","                };","                return ret;","            }","        };","    };","","    Y.IO.defaultTransport('nodejs');","","","","}, '3.7.3', {\"requires\": [\"io-base\"]});"];
_yuitest_coverage["build/io-nodejs/io-nodejs.js"].lines = {"1":0,"17":0,"20":0,"23":0,"33":0,"34":0,"35":0,"36":0,"38":0,"85":0,"86":0,"89":0,"90":0,"91":0,"93":0,"98":0,"99":0,"100":0,"101":0,"104":0,"105":0,"107":0,"108":0,"109":0,"112":0,"113":0,"115":0,"116":0,"118":0,"119":0,"121":0,"123":0,"124":0,"125":0,"126":0,"128":0,"129":0,"137":0,"140":0,"145":0,"146":0,"149":0,"152":0,"157":0};
_yuitest_coverage["build/io-nodejs/io-nodejs.js"].functions = {"(anonymous 2):35":0,"flatten:33":0,"getResponseHeader:136":0,"getAllResponseHeaders:139":0,"(anonymous 3):121":0,"send:87":0,"nodejs:85":0,"(anonymous 1):1":0};
_yuitest_coverage["build/io-nodejs/io-nodejs.js"].coveredLines = 44;
_yuitest_coverage["build/io-nodejs/io-nodejs.js"].coveredFunctions = 8;
_yuitest_coverline("build/io-nodejs/io-nodejs.js", 1);
YUI.add('io-nodejs', function (Y, NAME) {

/*global Y: false, Buffer: false, clearInterval: false, clearTimeout: false, console: false, exports: false, global: false, module: false, process: false, querystring: false, require: false, setInterval: false, setTimeout: false, __filename: false, __dirname: false */
    /**
    * Node.js override for IO, methods are mixed into `Y.IO`
    * @module io-nodejs
    * @main io-nodejs
    */
    /**
    * Passthru to the NodeJS <a href="https://github.com/mikeal/request">request</a> module.
    * This method is return of `require('request')` so you can use it inside NodeJS without
    * the IO abstraction.
    * @method request
    * @static
    * @for IO
    */
    _yuitest_coverfunc("build/io-nodejs/io-nodejs.js", "(anonymous 1)", 1);
_yuitest_coverline("build/io-nodejs/io-nodejs.js", 17);
if (!Y.IO.request) {
        // Default Request's cookie jar to `false`. This way cookies will not be
        // maintained across requests.
        _yuitest_coverline("build/io-nodejs/io-nodejs.js", 20);
Y.IO.request = require('request').defaults({jar: false});
    }

    _yuitest_coverline("build/io-nodejs/io-nodejs.js", 23);
var codes = require('http').STATUS_CODES;

    /**
    Flatten headers object
    @method flatten
    @protected
    @for IO
    @param {Object} o The headers object
    @return {String} The flattened headers object
    */
    _yuitest_coverline("build/io-nodejs/io-nodejs.js", 33);
var flatten = function(o) {
        _yuitest_coverfunc("build/io-nodejs/io-nodejs.js", "flatten", 33);
_yuitest_coverline("build/io-nodejs/io-nodejs.js", 34);
var str = [];
        _yuitest_coverline("build/io-nodejs/io-nodejs.js", 35);
Object.keys(o).forEach(function(name) {
            _yuitest_coverfunc("build/io-nodejs/io-nodejs.js", "(anonymous 2)", 35);
_yuitest_coverline("build/io-nodejs/io-nodejs.js", 36);
str.push(name + ': ' + o[name]);
        });
        _yuitest_coverline("build/io-nodejs/io-nodejs.js", 38);
return str.join('\n');
    };


    /**
    NodeJS IO transport, uses the NodeJS <a href="https://github.com/mikeal/request">request</a>
    module under the hood to perform all network IO.
    @method transports.nodejs
    @for IO
    @static
    @return {Object} This object contains only a `send` method that accepts a
    `transaction object`, `uri` and the `config object`.
    @example

        Y.io('https://somedomain.com/url', {
            method: 'PUT',
            data: '?foo=bar',
            //Extra request module config options.
            request: {
                maxRedirects: 100,
                strictSSL: true,
                multipart: [
                    {
                        'content-type': 'application/json',
                        body: JSON.stringify({
                            foo: 'bar',
                            _attachments: {
                                'message.txt': {
                                    follows: true,
                                    length: 18,
                                    'content_type': 'text/plain'
                                }
                            }
                        })
                    },
                    {
                        body: 'I am an attachment'
                    }
                ]
            },
            on: {
                success: function(id, e) {
                }
            }
        });
    */

    _yuitest_coverline("build/io-nodejs/io-nodejs.js", 85);
Y.IO.transports.nodejs = function() {
        _yuitest_coverfunc("build/io-nodejs/io-nodejs.js", "nodejs", 85);
_yuitest_coverline("build/io-nodejs/io-nodejs.js", 86);
return {
            send: function (transaction, uri, config) {

                _yuitest_coverfunc("build/io-nodejs/io-nodejs.js", "send", 87);
_yuitest_coverline("build/io-nodejs/io-nodejs.js", 89);
config.notify('start', transaction, config);
                _yuitest_coverline("build/io-nodejs/io-nodejs.js", 90);
config.method = config.method || 'GET';
                _yuitest_coverline("build/io-nodejs/io-nodejs.js", 91);
config.method = config.method.toUpperCase();

                _yuitest_coverline("build/io-nodejs/io-nodejs.js", 93);
var rconf = {
                    method: config.method,
                    uri: uri
                };

                _yuitest_coverline("build/io-nodejs/io-nodejs.js", 98);
if (config.data) {
                    _yuitest_coverline("build/io-nodejs/io-nodejs.js", 99);
if (Y.Lang.isObject(config.data)) {
                        _yuitest_coverline("build/io-nodejs/io-nodejs.js", 100);
if (Y.QueryString && Y.QueryString.stringify) {
                            _yuitest_coverline("build/io-nodejs/io-nodejs.js", 101);
rconf.body = Y.QueryString.stringify(config.data);
                        } else {
                        }
                    } else {_yuitest_coverline("build/io-nodejs/io-nodejs.js", 104);
if (Y.Lang.isString(config.data)) {
                        _yuitest_coverline("build/io-nodejs/io-nodejs.js", 105);
rconf.body = config.data;
                    }}
                    _yuitest_coverline("build/io-nodejs/io-nodejs.js", 107);
if (rconf.method === 'GET') {
                        _yuitest_coverline("build/io-nodejs/io-nodejs.js", 108);
rconf.uri += (rconf.uri.indexOf('?') > -1 ? '&' : '?') + rconf.body;
                        _yuitest_coverline("build/io-nodejs/io-nodejs.js", 109);
rconf.body = '';
                    }
                }
                _yuitest_coverline("build/io-nodejs/io-nodejs.js", 112);
if (config.headers) {
                    _yuitest_coverline("build/io-nodejs/io-nodejs.js", 113);
rconf.headers = config.headers;
                }
                _yuitest_coverline("build/io-nodejs/io-nodejs.js", 115);
if (config.timeout) {
                    _yuitest_coverline("build/io-nodejs/io-nodejs.js", 116);
rconf.timeout = config.timeout;
                }
                _yuitest_coverline("build/io-nodejs/io-nodejs.js", 118);
if (config.request) {
                    _yuitest_coverline("build/io-nodejs/io-nodejs.js", 119);
Y.mix(rconf, config.request);
                }
                _yuitest_coverline("build/io-nodejs/io-nodejs.js", 121);
Y.IO.request(rconf, function(err, data) {

                    _yuitest_coverfunc("build/io-nodejs/io-nodejs.js", "(anonymous 3)", 121);
_yuitest_coverline("build/io-nodejs/io-nodejs.js", 123);
if (err) {
                        _yuitest_coverline("build/io-nodejs/io-nodejs.js", 124);
transaction.c = err;
                        _yuitest_coverline("build/io-nodejs/io-nodejs.js", 125);
config.notify(((err.code === 'ETIMEDOUT') ? 'timeout' : 'failure'), transaction, config);
                        _yuitest_coverline("build/io-nodejs/io-nodejs.js", 126);
return;
                    }
                    _yuitest_coverline("build/io-nodejs/io-nodejs.js", 128);
if (data) {
                        _yuitest_coverline("build/io-nodejs/io-nodejs.js", 129);
transaction.c = {
                            status: data.statusCode,
                            statusCode: data.statusCode,
                            statusText: codes[data.statusCode],
                            headers: data.headers,
                            responseText: data.body,
                            responseXML: null,
                            getResponseHeader: function(name) {
                                _yuitest_coverfunc("build/io-nodejs/io-nodejs.js", "getResponseHeader", 136);
_yuitest_coverline("build/io-nodejs/io-nodejs.js", 137);
return this.headers[name];
                            },
                            getAllResponseHeaders: function() {
                                _yuitest_coverfunc("build/io-nodejs/io-nodejs.js", "getAllResponseHeaders", 139);
_yuitest_coverline("build/io-nodejs/io-nodejs.js", 140);
return flatten(this.headers);
                            }
                        };
                    }

                    _yuitest_coverline("build/io-nodejs/io-nodejs.js", 145);
config.notify('complete', transaction, config);
                    _yuitest_coverline("build/io-nodejs/io-nodejs.js", 146);
config.notify(((data && (data.statusCode >= 200 && data.statusCode <= 299)) ? 'success' : 'failure'), transaction, config);
                });

                _yuitest_coverline("build/io-nodejs/io-nodejs.js", 149);
var ret = {
                    io: transaction
                };
                _yuitest_coverline("build/io-nodejs/io-nodejs.js", 152);
return ret;
            }
        };
    };

    _yuitest_coverline("build/io-nodejs/io-nodejs.js", 157);
Y.IO.defaultTransport('nodejs');



}, '3.7.3', {"requires": ["io-base"]});
