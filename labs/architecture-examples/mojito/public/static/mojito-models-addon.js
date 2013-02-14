/*
 * Copyright (c) 2011-2013, Yahoo! Inc.  All rights reserved.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */

/*jslint nomen:true*/
/*global YUI*/

/**
 * @module ActionContextAddon
 */
YUI.add('mojito-models-addon', function (Y, NAME) {

    'use strict';

    // global model cache when on the client to store
    // models at the page level, while running on the
    // server we store them on adapter.req object per
    // request.
    var _clientCache = {};

    // TODO:
    // - update tests
    // - update fixtures
    // - update documentation
    // - update examples

    /**
     * <strong>Access point:</strong> <em>ac.models.get()</em>
     * Addon that provides access to the models collection
     * @class Models.common
     */
    function Addon(command, adapter) {
        this._models = {};
        this._adapter = adapter;
        this._instance = command.instance;
    }

    Addon.prototype = {

        namespace: 'models',

        /**
         * Gets model instance
         * @method get
         * @param {string} modelName The name of the model.
         * @return {object} model instance, or null.
         */
        get: function (modelName) {

            var model = this._models[modelName] || _clientCache[modelName] ||
                        (this._adapter.req && this._adapter.req.models &&
                         this._adapter.req.models[modelName]);

            // instantanting the model once during the lifetime of
            // the ac object, this acts like an internal cache.
            if (!model && Y.mojito.models[modelName]) {

                // We have to heir() otherwise this.something in the model
                // will pollute other instances of the model.
                model = Y.mojito.util.heir(Y.mojito.models[modelName]);

                if (Y.Lang.isFunction(model.init)) {
                    // NOTE that we use the same config here that we use to
                    // config the controller
                    model.init(this._instance.config);
                }
                this._models[modelName] = model;

            }

            // returning from cache if exists
            return model;

        },

        /**
         * Set a model instance as global. On the server side
         * this means any mojit instance under a particular request
         * will have access to the model. On the client, any
         * mojit instance on the page will have access to
         * the model as well.
         * @method get
         * @param {string} name The model name.
         * @param {object} model The model instance
         */
        registerGlobal: function (name, model) {
            if (this._adapter.req) {
                // server side routine to store on the request
                // to avoid leaks.
                // NOTE: models on req object will be destroyed
                //       with the request lifecycle.
                this._adapter.req.models = this._adapter.req.models || {};
                this._adapter.req.models[name] = model;
                Y.log('Storing a global model on the server: ' + name, 'info', NAME);
            } else {
                // client side routine to store on a global
                // cache structure.
                // NOTE: there is no way to destroy this model at
                //       the moment, it is now tied to the page
                //       life cycle.
                _clientCache[name] = model;
                Y.log('Storing a global model on the client: ' + name, 'info', NAME);
            }
        }

    };

    Y.namespace('mojito.addons.ac').models = Addon;

}, '0.1.0', {requires: [
    'mojito',
    'mojito-util'
]});
