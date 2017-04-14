/*
 * Copyright (c) 2011-2013, Yahoo! Inc.  All rights reserved.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */


/*jslint anon:true, sloppy:true, nomen:true*/
/*global YUI*/


/**
 * @module ActionContextAddon
 */
YUI.add('mojito-params-addon', function(Y, NAME) {


    /**
     * <strong>Access point:</strong> <em>ac.params.*</em>
     * Addon that provides access to any parameters given to the system
     * @class Params.common
     */
    function Addon(command) {
        this.params = command.params || {};
        this._url = null;
        this._body = null;
        this._merged = null;
        this._route = null;
    }


    Addon.prototype = {

        namespace: 'params',

        /**
         * Gets all params, keyed by 'route', 'url', 'body', and 'file'.
         * @method getAll
         * @return {object} all params.
         */
        getAll: function() {

            return {
                route: this.getFromRoute(),
                url: this.getFromUrl(),
                body: this.getFromBody(),
                file: {} //this.getFromFiles()
            };
        },


        /**
         * Alias for 'getAll'.
         * @method all
         * @return {object} all params.
         */
        all: function() {
            return this.getAll.apply(this, arguments);
        },


        /**
         * Gets all params merged into one object. Route -> URL -> Body
         * precedence.
         * @method getFromMerged
         * @param {string} key The name of the parameter required.
         * @return {string|object} param value, or all params if no key
         *     specified.
         */
        getFromMerged: function(key) {

            if (!this._merged) {
                this._merged = Y.merge(/*this.getFromFiles(),*/
                    this.getFromBody(),
                    this.getFromUrl(),
                    this.getFromRoute()
                );
            }

            if (key) {
                return this._merged[key];
            }

            return this._merged;
        },


        /**
         * Alias for 'getFromMerged'.
         * @method merged
         * @param {string} key The name of the parameter required.
         * @return {string|object} param value, or all params if no key
         *     specified.
         */
        merged: function() {
            return this.getFromMerged.apply(this, arguments);
        },


        /**
         * Gets route parameters
         * @method getFromRoute
         * @param {string} key The name of the parameter.
         * @return {string|object} param value, or all params if no key
         *     specified.
         */
        getFromRoute: function(key) {

            if (!this._route) {
                this._route = Y.merge(this.params.route || {});
            }

            if (key) {
                return this._route[key];
            }

            return this._route;
        },


        /**
         * Alias for 'getFromRoute'.
         * @method route
         * @param {string} key The name of the parameter required.
         * @return {string|object} param value, or all params if no key
         *     specified.
         */
        route: function() {
            return this.getFromRoute.apply(this, arguments);
        },


        /**
         * Gets URL parameters
         * @method getFromUrl
         * @param {string} key The name of the parameter required.
         * @return {string|object} param value, or all params if no key
         *     specified.
         */
        getFromUrl: function(key) {

            if (!this._url) {
                this._url = Y.merge(this.params.url || {});
            }

            if (key) {
                return this._url[key];
            }

            return this._url;
        },


        /**
         * Alias for 'getFromUrl'.
         * @method url
         * @param {string} key The name of the parameter required.
         * @return {string|object} param value, or all params if no key
         *     specified.
         */
        url: function() {
            return this.getFromUrl.apply(this, arguments);
        },


        /**
         * Gets body parameters
         * @method getFromBody
         * @param {string} key The name of the parameter required.
         * @return {string|object} param value, or all params if no key
         *     specified.
         */
        getFromBody: function(key) {

            if (!this._body) {
                this._body = Y.merge(this.params.body || {});
            }

            if (key) {
                return this._body[key];
            }

            return this._body;
        },


        /**
         * Alias for 'getFromBody'.
         * @method body
         * @param {string} key The name of the parameter required.
         * @return {string|object} param value, or all params if no key
         *     specified.
         */
        body: function() {
            return this.getFromBody.apply(this, arguments);
        }

    };

    Y.namespace('mojito.addons.ac').params = Addon;

}, '0.1.0', {requires: [
    'mojito'
]});
