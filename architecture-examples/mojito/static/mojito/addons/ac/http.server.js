/*
 * Copyright (c) 2011-2012, Yahoo! Inc.  All rights reserved.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */


/*jslint anon:true, sloppy:true, nomen:true*/
/*global YUI*/


/**
 * @module ActionContextAddon
 */
YUI.add('mojito-http-addon', function(Y, NAME) {

    var XHR_HDR = 'x-requested-with',
        XHR_HDR_REGEX = /^XMLHttpRequest$/i;


    /**
     * <strong>Access point:</strong> <em>ac.http.*</em>
     * This is a server-only utility plugin that makes many server side
     * resources available for mojit code that will never run on the client.
     * @class Http.server
     */
    function Addon(command, adapter, ac) {
        this.adapter = adapter;
        this.ac = ac;
        this._respHeaders = {};
    }


    Addon.prototype = {

        namespace: 'http',

        /**
         * Returns the HTTP request.
         * @method getRequest
         * @return {ServerRequest} The node.js http.ServerRequest instance.
         */
        getRequest: function() {
            return this.adapter.req;
        },


        /**
         * Returns the HTTP response object from the request.
         * @method getResponse
         * @return {ServerResponse} The node.js http.ServerResponse instance.
         */
        getResponse: function() {
            return this.adapter.res;
        },


        /**
         * Adds a header to the response without overriding previous values
         * @method addHeader
         * @param {String} key header name.
         * @param {String} val header value.
         */
        addHeader: function(k, v) {
            // multiline values are against HTTP spec, and a SECURITY RISK
            var key = (k || '').split('\n')[0].toLowerCase(),
                val = (v || '').split('\n')[0],
                dup = false,
                hdrs = this._respHeaders;

            if (!hdrs[key]) {
                hdrs[key] = [];
            }
            hdrs[key].forEach(function(i) {
                if (i === val) {
                    dup = true;
                }
            });
            if (!dup) {
                hdrs[key].push(val);
            }
        },


        /**
         * Adds a object of headers all at once, adding to previous values
         * @method addHeaders
         * @param {object} hdrs header values to add.
         */
        addHeaders: function(hdrs) {
            Y.Object.each(hdrs, function(val, key) {
                this.addHeader(key, val);
            }, this);
        },


        /**
         * Sets a header by key, overriding previous values
         * @method setHeader
         * @param {string} key header name.
         * @param {string} val header value.
         */
        setHeader: function(key, val) {
            this._respHeaders[key.toLowerCase()] = [val];
        },


        /**
         * Sets a object full of headers all at once, overriding previous values
         * @method setHeaders
         * @param {object} hdrs header values to set.
         */
        setHeaders: function(hdrs) {
            Y.Object.each(hdrs, function(val, key) {
                this.setHeader(key, val);
            }, this);
        },


        /**
         * Returns one request header value
         * @method getHeader
         * @param {string} name header name.
         * @return {object} header value.
         */
        getHeader: function(name) {
            var n = name.toLowerCase(),
                val;
            // have to loop through these because the header keys must be case
            // insensitive
            Y.Object.some(this.getHeaders(), function(v, k) {
                if (k.toLowerCase() === n) {
                    val = v;
                    return true;
                }
            });
            return val;
        },


        /**
         * Returns all request headers
         * @method getHeaders
         * @return {object} all headers.
         */
        getHeaders: function() {
            return this.adapter.req.headers;
        },


        /**
         * Helper to tell you if this is an XHR request. Checks specifically
         * for the 'x-requested-with' header.
         * @method isXhr
         * @return {boolean} True if the receiver is associated with an XHR
         *     request.
         */
        isXhr: function() {
            return XHR_HDR_REGEX.test(this.getHeader(XHR_HDR));
        },


        /**
         * This redirect is an external redirect. It causes an HTTP
         * status code 301 by default.
         * @method redirect
         * @param {string} uri the URI to redirect to.
         * @param {Number} code [optional] if not specifed, 301.
         */
        redirect: function(uri, code) {
            code = code || 301;
            var meta = {
                http: {
                    code: code
                }
            };
            Y.log('redirect(' + uri + ', ' + code + ')', 'debug', NAME);
            this._statusCode = code;
            this.addHeader('location', uri);
            this.addHeader('content-type', 'text/html');
            this.ac.done(null, meta);
        },


        mergeMetaInto: function(meta) {
            if (Object.keys(this._respHeaders).length === 0) {
                return meta;
            }
            if (!meta.http) {
                meta.http = {};
            }
            if (!meta.http.headers) {
                meta.http.headers = {};
            }
            Y.mojito.util.metaMerge(meta.http.headers, this._respHeaders);
            return meta;
        },


        getGlobal: function() {
            return global._mojito;
        }
    };

    Y.namespace('mojito.addons.ac').http = Addon;

}, '0.1.0', {requires: [
    'mojito-util'
]});
