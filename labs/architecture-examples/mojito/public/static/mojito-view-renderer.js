/*
 * Copyright (c) 2011-2013, Yahoo! Inc.  All rights reserved.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */

/*jslint anon:true, nomen:true*/
/*global YUI*/

YUI.add('mojito-view-renderer', function (Y) {

    'use strict';

    var cache = {};

    /*
     * Mojito's view renderer abstraction. Will plugin in the specified view
     * plugin to do the rendering, depending on the 'type' specified.
     * @class ViewRenderer
     * @namespace Y.mojito
     * @constructor
     * @param {String} type view engine addon type to use
     * @param {Object} options View engines configuration.
     */
    function Renderer(type, options) {
        this._type = type || 'hb';
        this._options = options;
        this._renderer = cache[type];
    }


    Renderer.prototype = {

        /**
         * Attaches view engine yui module to render a view.
         * This is usually needed when running in the
         * client side and loading mojits on demand.
         * @method _createEngine
         * @protected
         * @async
         * @param {function} callback
         */
        _createEngine: function (callback) {
            var my = this,
                viewEngines = Y.mojito.addons.viewEngines,
                fn = function () {
                    callback(null, new (viewEngines[my._type])(my._options));
                };

            // some perf optimization to avoid calling Y.use when
            // the engine is already attached. this also help users
            // that are trying to create their own engines without
            // the "mojito-" prefix.
            if (viewEngines[my._type]) {
                fn();
            } else {
                // attaching the view engine yui module
                Y.use('mojito-' + this._type, function () {
                    if (!viewEngines[my._type]) {
                        callback(new Error('Invalid view engine: ' + my._type));
                        return;
                    }
                    fn();
                });
            }
        },

        /*
         * Renders a view
         * @method render
         * @param {Object} data data to push into the view.
         * @param {string} mojitType name of the mojit type.
         * @param {Object} tmpl some type of template identifier for the view
         *     engine.
         * @param {Object} adapter The output adapter.
         * @param {Object} meta Optional metadata to use.
         * @param {boolean} more Whether there will be more data to render
         *     later. (streaming)
         */
        render: function (data, mojitType, tmpl, adapter, meta, more) {
            var my = this;
            // HookSystem::StartBlock
            Y.mojito.hooks.hook('Render', adapter.hook, data, mojitType, tmpl, adapter, meta, more);
            // HookSystem::EndBlock
            /*
                TODO: this method should also do:
                    a) load template when needed
                    b) load compiled template when possible
                    c) any io logic related to the view
            */
            if (!this._renderer) {
                this._createEngine(function (err, engine) {
                    if (err) {
                        adapter.error(err);
                        return;
                    }
                    my._renderer = engine;
                    cache[my._type] = engine; // caching renderer instance
                    my._renderer.render(data, mojitType, tmpl, adapter, meta, more);
                });
            } else {
                this._renderer.render(data, mojitType, tmpl, adapter, meta, more);
            }
        }
    };

    Y.namespace('mojito').ViewRenderer = Renderer;

}, '0.1.0', {requires: [
    'mojito',
    'mojito-hooks'
]});
