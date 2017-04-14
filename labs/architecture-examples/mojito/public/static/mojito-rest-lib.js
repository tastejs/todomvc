/*
 * Copyright (c) 2011-2013, Yahoo! Inc.  All rights reserved.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */


/*jslint anon:true, sloppy:true, nomen:true*/
/*global YUI*/


/**
 * Common Library
 * @module CommonLibs
 */
YUI.add('mojito-rest-lib', function(Y, NAME) {

    Y.namespace('mojito.lib');

    /**
     * @private
     */
    function ResponseObject(resp) {
        this._resp = resp;
    }


    ResponseObject.prototype = {
        getStatusCode: function() {
            return this._resp.status;
        },
        getStatusMessage: function() {
            return this._resp.statusText;
        },
        getHeader: function() {
            return this._resp.getResponseHeader.apply(this._resp, arguments);
        },
        getHeaders: function() {
            return this._resp.getAllResponseHeaders();
        },
        getBody: function() {
            return this._resp.responseText;
        }
    };


    /**
     * The Rest module for Mojito provides an easy way to make RESTful calls to
     * URLs without messing about with Y.io.
     * @class REST
     * @namespace Y.mojito.lib
     */
    Y.namespace('mojito.lib').REST = {

        /**
         * Calls IO. Provides mockability
         * @method _doRequest
         * @param url
         * @param config the IO configuration
         * @param callback
         * @private
         */
        _doRequest: function (url, config) {
            Y.io(url, config);
        },

        /**
         * Creates the configuration to be passed to the IO request
         * @method _makeRequest
         * @param {String} method HTTP method
         * @param {String} url HTTP location
         * @param {Object} params Params that are passed in the request
         * @param {Object} config Additional configuration
         * @param {Object} config.headers Headers to be sent with the request
         * @param {Number} config.timeout Timeout for the IO request
         * @param {Function} callback The handler for the response
         * @private
         */
        _makeRequest: function(method, url, params, config, callback) {
            // TODO: [Issue 72] Figure out why 'params' values are attaching
            // themselves to headers!
            var ioConfig = {
                method: method,
                on: {}
            };
            if (params) {
                if (Y.Lang.isObject(params)) {
                    params = Y.QueryString.stringify(params);
                }
                if ('GET' === method) {
                    if (-1 === url.indexOf('?')) {
                        url += '?' + params;
                    } else {
                        url += '&' + params;
                    }
                } else if ('POST' === method || 'PUT' === method) {
                    ioConfig.data = params;
                }
            }
            if (config) {
                ioConfig.headers = config.headers;
                ioConfig.timeout = config.timeout;
            }
            if (callback) {
                ioConfig.on.success = function(txid, resp) {
                    var responseObj = new ResponseObject(resp);
                    callback(null, responseObj);
                };
                ioConfig.on.failure = function(txid, resp) {
                    callback(resp);
                };
            }
            this._doRequest(url, ioConfig);
        },


        /**
         * Makes a RESTful GET request to specified URL
         * @method GET
         * @param {String} url RESTful URL to hit.
         * @param {Object} params parameters to add to the request.
         * @param {Object} config may contain 'headers' or 'timeout' values.
         * @param {Function} callback called with response or error.
         */
        GET: function() {
            var args = ['GET'].concat(Array.prototype.slice.call(arguments));
            this._makeRequest.apply(this, args);
        },


        /**
         * Makes a RESTful POST request to specified URL
         * @method POST
         * @param {String} url RESTful URL to hit.
         * @param {Object} params parameters to add to the request.
         * @param {Object} config may contain 'headers' or 'timeout' values.
         * @param {Function} callback called with response or error.
         */
        POST: function() {
            var args = ['POST'].concat(Array.prototype.slice.call(arguments));
            this._makeRequest.apply(this, args);
        },


        /**
         * Makes a RESTful PUT request to specified URL
         * @method PUT
         * @param {String} url RESTful URL to hit.
         * @param {Object} params parameters to add to the request.
         * @param {Object} config may contain 'headers' or 'timeout' values.
         * @param {Function} callback called with response or error.
         */
        PUT: function() {
            var args = ['PUT'].concat(Array.prototype.slice.call(arguments));
            this._makeRequest.apply(this, args);
        },


        /**
         * Makes a RESTful DELETE request to specified URL
         * @method DELETE
         * @param {String} url RESTful URL to hit.
         * @param {Object} params parameters to add to the request.
         * @param {Object} config may contain 'headers' or 'timeout' values.
         * @param {Function} callback called with response or error.
         */
        DELETE: function() {
            var args = ['DELETE'].concat(Array.prototype.slice.call(arguments));
            this._makeRequest.apply(this, args);
        },


        /**
         * Makes a RESTful HEAD request to specified URL
         * @method HEAD
         * @param {String} url RESTful URL to hit.
         * @param {Object} params parameters to add to the request.
         * @param {Object} config may contain 'headers' or 'timeout' values.
         * @param {Function} callback called with response or error.
         */
        HEAD: function() {
            var args = ['HEAD'].concat(Array.prototype.slice.call(arguments));
            this._makeRequest.apply(this, args);
        }
    };

}, '0.1.0', {requires: [
    'io-base',
    'querystring-stringify-simple',
    'mojito'
]});
