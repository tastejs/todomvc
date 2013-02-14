/*
 * Copyright (c) 2011-2013, Yahoo! Inc.  All rights reserved.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */


/*jslint anon:true, sloppy:true, nomen:true*/
/*global YUI*/

YUI.add('mojito-hb', function(Y, NAME) {

    'use strict';

    var HB = Y.Handlebars,
        cache = Y.namespace('Env.Mojito.Handlebars');

    /**
     * HandlerBars Adapter for the client runtime.
     * @class HandleBarsAdapterClient
     * @constructor
     * @param {object} options View engine configuration.
     * @private
     */
    function HandleBarsAdapter(options) {
        this.options = options || {};
    }

    HandleBarsAdapter.prototype = {

        /**
         * Renders the handlebars template using the data provided.
         * @param {object} data The data to render.
         * @param {object} instance The expanded mojit instance.
         * @param {object} template The view object from RS to render with format:
         * {'content-path': 'path to view', content: 'cached string'}.
         * @param {object} adapter The output adapter to use.
         * @param {object} meta Optional metadata.
         * @param {boolean} more Whether there is more to be rendered
         */
        render: function (data, instance, template, adapter, meta, more) {
            var cacheTemplates = (this.options.cacheTemplates === false ? false : true),
                handler = function (err, obj) {
                    var output;

                    if (err) {
                        adapter.error(err);
                        return;
                    }

                    output = obj.compiled(data, {
                        partials: obj.partials
                    });

                    if (more) {
                        adapter.flush(output, meta);
                    } else {
                        adapter.done(output, meta);
                    }
                },
                stack,
                cacheKey,
                fn,
                partial,
                partials;

            // support for legacy url instead of a view object
            if (Y.Lang.isString(template)) {
                Y.log('[view] argument in [render] method should be an object', 'warn', NAME);
                template = {
                    'content-path': template
                };
            }

            cacheKey = template['content-path'];

            if (cacheTemplates && cache[cacheKey]) {
                handler(null, cache[cacheKey]);
                return;
            }

            stack = new Y.Parallel();
            partials = {};

            // first item in the asyc queue is the actual view
            this._getTemplateObj(template, stack.add(function (err, obj) {
                if (err) {
                    Y.log('Error trying to compile view ' + cacheKey, 'error', NAME);
                    Y.log(err, 'error', NAME);
                    return;
                }
                cache[cacheKey] = obj;
            }));

            // after the first item, we just add any partial
            if (instance && instance.partials && Y.Object.keys(instance.partials).length > 0) {
                fn = function (partial, err, obj) {
                    if (err) {
                        Y.log('Error trying to compile partial [' + partial + '] on view ' +
                            cacheKey, 'error', NAME);
                        Y.log(err, 'error', NAME);
                        return;
                    }
                    partials[partial] = obj.compiled;
                };
                for (partial in instance.partials) {
                    if (instance.partials.hasOwnProperty(partial)) {
                        this._getTemplateObj(instance.partials[partial],
                            stack.add(Y.bind(fn, this, partial)));
                    }
                }
            }

            // finally, let's just put the compiled view and partials together
            stack.done(function () {
                if (!cache[cacheKey]) {
                    handler(new Error("Error trying to render view " + cacheKey));
                    return;
                }
                cache[cacheKey].partials = partials;
                handler(null, cache[cacheKey]);
            });

        },

        /**
         * Build a compiled handlebar template, plus
         * a raw string representation of the template.
         * @private
         * @param {object} template The view object from RS to render with format:
         * {'content-path': 'path to view', content: 'cached string'}.
         * @param {function} callback The function that is called with the compiled template
         * @return {object} literal object with the "raw" and "template" references.
         */
        _getTemplateObj: function (template, callback) {
            var fn = function (err, str) {
                    if (err) {
                        callback(err);
                        return;
                    }
                    callback(null, {
                        raw: str,
                        compiled: HB.compile(str)
                    });
                };
            if (template.content) {
                fn(null, template.content);
            } else {
                this._loadTemplate(template['content-path'], fn);
            }
        },

        /**
         * Loads a template from a remote location
         * @param tmpl The location of the template
         * @param cb The callback to call with the template response
         * @private
         */
        _loadTemplate: function (tmpl, cb) {
            Y.io(tmpl, {
                on: {
                    success: function (id, resp) {
                        cb(null, resp.responseText);
                    },
                    failure: function (id, resp) {
                        cb({
                            code: resp.status,
                            message: resp.statusText
                        });
                    }
                }
            });
        }
    };

    Y.namespace('mojito.addons.viewEngines').hb = HandleBarsAdapter;

}, '0.1.0', {requires: [
    'io-base',
    'parallel',
    'handlebars'
]});
