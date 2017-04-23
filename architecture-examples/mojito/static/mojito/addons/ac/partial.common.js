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
YUI.add('mojito-partial-addon', function(Y, NAME) {

    /**
    * <strong>Access point:</strong> <em>ac.partial.*</em>
    * Provides methods for working with "actions" and "views" on the current
    * Mojits.
    * @class Partial.common
    */
    function Addon(command, adapter, ac) {
        this.command = command;
        this.dispatch = ac._dispatch;
        this.ac = ac;
        this.adapter = adapter;
    }


    Addon.prototype = {

        namespace: 'partial',

        /**
         * This method renders the "data" provided into the "view" specified.
         * The "view" must be the name of one of the files in the current
         * Mojits "views" folder. Returns via the callback.
         * @method render
         * @param {object} data The object to be rendered.
         * @param {string} view The view name to be used for rendering.
         * @param {function} cb callback signature is function(error, result).
         */
        render: function(data, view, cb) {
            var renderer,
                mojitView,
                instance = this.command.instance,
                meta = {view: {}};

            if (!instance.views[view]) {
                cb('View "' + view + '" not found');
                return;
            }

            mojitView = instance.views[view];
            data = data || {}; // default null data to empty view template
            renderer = new Y.mojito.ViewRenderer(mojitView.engine);

            Y.log('Rendering "' + view + '" view for "' + (instance.id || '@' +
                instance.type) + '"', 'debug', NAME);

            renderer.render(data, instance.type, mojitView['content-path'], {
                buffer: '',

                flush: function(data) {
                    this.buffer += data;
                },

                done: function(data) {
                    this.buffer += data;
                    cb(null, this.buffer);
                }
            }, meta);
        },


        /**
         * This method calls the current mojit's controller with the "action"
         * given and returns its output via the callback.
         *
         * The <em>options</em> parameter is optional and may contain:
         * <dl>
         *     <dt>params</dt><dd>&lt;object&gt; must be broken out explicitly:
         *     <dl>
         *      <dt>route</dt><dd>&lt;object&gt; Map of key/value pairs.</dd>
         *      <dt>url</dt><dd>&lt;object&gt; Map of key/value pairs.</dd>
         *      <dt>body</dt><dd>&lt;object&gt; Map of key/value pairs.</dd>
         *      <dt>file</dt><dd>&lt;object&gt; Map of key/value pairs.</dd>
         *     </dl></dd>
         * </dl>
         * @method invoke
         * @param {string} action name of the action to invoke.
         * @param {object} options see above.
         * @param {function} cb callback function to be called on completion.
         */
        invoke: function(action, options, cb) {
            var command;

            // If there are no options use it as the callback
            if ('function' === typeof options) {
                cb = options;
                options = {};
            }

            command = {
                instance: {
                    base: this.command.instance.base,
                    type: this.command.instance.type
                },
                action: action,
                context: this.ac.context,
                params: options.params || this.ac.params.getAll()
            };


            this.dispatch(command, {
                data: '',

                meta: {},

                done: function(data, meta, more) {
                    Y.mojito.util.metaMerge(this.meta, meta);
                    this.data += data;

                    // Remove whatever "content-type" was set
                    delete meta.http.headers['content-type'];

                    // Remove whatever "view" was set
                    delete meta.view;

                    if (!more) {
                        cb(null, this.data, this.meta);
                    }
                },

                flush: function(data, meta) {
                    this.done(data, meta, true);
                }
            });
        }
    };

    Y.namespace('mojito.addons.ac').partial = Addon;

}, '0.1.0', {requires: [
    'mojito-util',
    'mojito-params-addon',
    'mojito-view-renderer'
]});
