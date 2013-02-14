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
YUI.add('mojito-config-addon', function(Y, NAME) {

    function extract(bag, key, def) {
        if (!key) {
            return bag || {};
        }

        var keys = key.split('.'),
            cur = bag,
            i;

        for (i = 0; i < keys.length; i += 1) {
            if (cur.hasOwnProperty(keys[i])) {
                cur = cur[keys[i]];
            } else {
                return def;
            }
        }

        return cur;
    }


    /**
     * <strong>Access point:</strong> <em>ac.config.*</em>
     * Provides access to the Mojits configuration
     * @class Config.common
     */
    function Addon(command, adapter, ac) {
        this._ctx = command.context;
        this._config = command.instance.config;
        this._def = command.instance.definition;
        this._store = null;
    }


    Addon.prototype = {

        namespace: 'config',

        /**
         * Access config values.
         * @method get
         * @param {String} key A period separated key path to look for i.e.
         *     "get.my.value".
         * @param {Object|Array|String} def The default value to use if no match
         *     was found.
         * @return {Object|Array|String} The requested configuration value.
         */
        get: function(key, def) {
            return extract(this._config, key, def);
        },


        /**
         * Access definition values.
         * @method getDefinition
         * @param {String} key A period separated key path to look for i.e.
         *     "get.my.value".
         * @param {Object|Array|String} def The default value to use if no match
         *     was found.
         * @return {Object|Array|String} The requested definition values.
         */
        getDefinition: function(key, def) {
            return extract(this._def, key, def);
        },


        /**
         * returns the application config
         * @method getAppConfig
         * @return {object} the app config
         */
        getAppConfig: function() {
            return this._store.getAppConfig(this._ctx);
        },


        /**
         * returns the routes
         * @method getRoutes
         * @return {object} the routes
         */
        getRoutes: function() {
            return this._store.getRoutes(this._ctx);
        },


        /**
         * Internal method called by the Mojito framework.
         * @method setStore
         * @param {object} store the resource store
         * @return {nothing}
         */
        setStore: function(store) {
            this._store = store;
        }
    };

    Y.namespace('mojito.addons.ac').config = Addon;

}, '0.1.0', {requires: [
    'mojito'
]});
