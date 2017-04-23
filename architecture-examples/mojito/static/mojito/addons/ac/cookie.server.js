/*
 * Copyright (c) 2011-2012, Yahoo! Inc.  All rights reserved.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */


/*jslint anon:true, sloppy:true*/
/*global YUI*/


/**
 * @module ActionContextAddon
 */
YUI.add('mojito-cookie-addon', function(Y, NAME) {

    /**
     * <strong>Access point:</strong> <em>ac.cookie.*</em>
     * This server-side cookie add-on allows you to easily use cookies.
     * @class Cookie.server
     */
    function Addon(command, adapter, ac) {
        this.req = ac.http.getRequest();
        this.http = ac.http;
        this.ac = ac;
    }


    Addon.prototype = {

        namespace: 'cookie',

        /**
         * Returns the cookie for the given key or all the cookies if the key
	     * is not specified.
         * @method get
         * @param {string} [optional] key The key to look for.
	     * @return {string} the value of the cookie for the given key.
	     * @return {object} contains all the cookies if the key is not specified.
         */
        get: function(key) {
            if (key) {
                return this.req.cookies[key];
            }
            return this.req.cookies;
        },


        /**
         * Set a cookie on the given key with the given value
         * @method set
         * @param {string} key The key to use.
         * @param {string} val The value that will be set.
         */
        set: function(key, val, opts) {
            var c = key + '=' + val;

            opts = opts || {};
            if (opts.expires) {
                c = c + '; Expires=' + (new Date(opts.expires)).toUTCString();
            }
            if (opts.path) {
                c = c + '; Path=' + opts.path;
            }
            if (opts.domain) {
                c = c + '; Domain=' + opts.domain;
            }
            if (opts.secure) {
                c = c + '; Secure;';
            }
            if (opts.httpOnly) {
                c = c + '; HttpOnly';
            }
            this.http.addHeader('Set-Cookie', c);
        }
    };

    Addon.dependsOn = ['http'];

    Y.namespace('mojito.addons.ac').cookie = Addon;

}, '0.1.0', {requires: [
    'mojito',
    'mojito-http-addon'
]});
