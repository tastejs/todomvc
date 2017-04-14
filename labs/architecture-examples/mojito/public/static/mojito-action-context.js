/*
 * Copyright (c) 2011-2013, Yahoo! Inc.  All rights reserved.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */


/*jslint anon:true, nomen:true*/
/*global YUI, setTimeout, clearTimeout*/


/**
 * The Action Context is a key part of the Mojito framework. The <em>ac</em>,
 * for short, gives you access to the frameworks features from within a
 * controller function. The ac is an abstraction that allows you to execute
 * mojit actions within either a server or client context.
 * @module ActionContext
 */
YUI.add('mojito-action-context', function(Y, NAME) {

    'use strict';

    /**
     * This dispatch function is called one time per Mojito execution. It
     * creates a contextualized Y instance for all further internal dispatches
     * to use. It also creates the ActionContext for the mojit.
     *
     * The command has three main parts:  the "instance", the "context", and the
     * "params".
     * <pre>
     *  command: {
     *      instance: ...see below...
     *      context: ...see below...
     *      params: ...see below...
     *  }
     * </pre>
     *
     * The "instance" is a partial instance with details of the mojit instance.
     * See `ServerStore.expandInstance()` for details of the structure and which
     * fields are required.
     *
     * The "context" is the request context.  It is built by the
     * "contextualizer" middleware.
     *
     * The "params" is a structured set of parameters to pass to the mojit.
     * <pre>
     *  params: {
     *      route: {},
     *      url: {},
     *      body: {},
     *      file: {},
     *      ...
     *  }
     * </pre>
     *
     * <pre>
     * adapter: {
     *      flush: function(data, meta){},
     *      done: function(data, meta){},
     *      error: function(err){}
     * }
     * </pre>
     * @method dispatch
     * @param {map} command the "command" describing how to dispatch the mojit.
     *     See above.
     * @param {object} adapter the output adapter to pass to the mojit. See
     *     above.
     * @deprecated Use 'ac._dispatch()' instead. See https://github.com/yahoo/mojito/blob/develop/DEPRECATIONS.md
     * for details.
     */
     /**
     * This _dispatch function is called one time per Mojito execution. It
     * creates a contextualized Y instance for all further internal dispatches
     * to use. It also creates the ActionContext for the mojit.
     *
     * The command has three main parts:  the "instance", the "context", and the
     * "params".
     * <pre>
     *  command: {
     *      instance: ...see below...
     *      context: ...see below...
     *      params: ...see below...
     *  }
     * </pre>
     *
     * The "instance" is a partial instance with details of the mojit instance.
     * See `ServerStore.expandInstance()` for details of the structure and which
     * fields are required.
     *
     * The "context" is the request context.  It is built by the
     * "contextualizer" middleware.
     *
     * The "params" is a structured set of parameters to pass to the mojit.
     * <pre>
     *  params: {
     *      route: {},
     *      url: {},
     *      body: {},
     *      file: {},
     *      ...
     *  }
     * </pre>
     *
     * <pre>
     * adapter: {
     *      flush: function(data, meta){},
     *      done: function(data, meta){},
     *      error: function(err){}
     * }
     * </pre>
     * @method _dispatch
     * @param {map} command the "command" describing how to dispatch the mojit.
     *     See above.
     * @param {object} adapter the output adapter to pass to the mojit. See
     *     above.
     */


    var CHARSET = 'charset=utf-8',
        // the functions this core addon is going to attach to the
        // ActionContext
        flush,
        done,
        error,

        // serializer container
        serializer,
        CACHE = { renderers: { } };

    function sanitizeChildren(children) {
        if (!Y.Lang.isObject(children)) {
            return children;
        }
        Y.Object.each(children, function(v, k) {
            // We don't want child params to be included within a mojit's
            // configuration, because it can leak implemenation details out to
            // other execution environments. For example, the client runtime
            // does not need to have the parameters of the mojits that were used
            // to construct the initial client DOM.
            children[k].params = undefined;
        });
        return children;
    }


    function sanitizeConfigCopy(cfg) {
        var copy;
        if (!Y.Lang.isObject(cfg)) {
            return cfg;
        }
        copy = Y.mojito.util.copy(cfg);
        copy.children = sanitizeChildren(copy.children);
        return copy;
    }


    function attachChildViewIdsToMetaChildren(children, binders) {
        if (!children) {
            return;
        }
        Y.Object.each(binders, function(binderData, viewId) {
            Y.Object.each(children, function(childData) {
                if (binderData.instanceId === childData.instanceId) {
                    childData.viewId = viewId;
                }
            });
        });
    }


    serializer = {
        /*
         * @method json
         * @private
         * @param {object} data
         * @param {object} meta
         * @return {string}
         */
        json: function(data, meta) {
            meta.http.headers['content-type'] = ['application/json; ' + CHARSET];

            try {
                return Y.JSON.stringify(data);
            } catch (err) {
                throw new Error('Expected JSON data, but there was a parse error' +
                        ' on the string: \"' + data);
            }

        },
        /*
         * @method xml
         * @private
         * @param {object} data
         * @param {object} meta
         * @return {string}
         */
        xml: function(data, meta) {
            // A dirty XML function I found on the interwebs
            function simpleXml(js, wraptag) {
                if (js instanceof Object) {
                    return simpleXml(Y.Object.keys(js).map(function(key) {
                        return simpleXml(js[key], key);
                    }).join('\n'), wraptag);
                }

                return ((wraptag) ? '<' + wraptag + '>' : '') + js +
                    ((wraptag) ? '</' + wraptag + '>' : ''
                        );
            }

            meta.http.headers['content-type'] = ['application/xml; ' + CHARSET];
            if (Y.Lang.isObject) {
                try {
                    return simpleXml(data, 'xml');
                } catch (err) {
                    throw new Error('Expected XML data, but there was a parse' +
                            ' error on the string: \"' + err.message);
                }
            }

            return '';
        }
    };


    /**
     * Mixes all the Action Context addons into the Action Context
     * @private
     * @method attachActionContextAddons
     * @param {Array} addons The action context addons.
     * @param {object} command The command object.
     * @param {object} adapter The output adapter.
     * @param {Y.mojito.ActionContext} ac The action context.
     * @param {ResourceStore} store the resource store
     */
    function attachActionContextAddons(addons, command, adapter, ac, store) {

        var i,
            addon,
            addonName,
            acAddons = command.instance.acAddons || [];
        // HookSystem::StartBlock
        Y.mojito.hooks.hook('attachActionContext', adapter.hook, 'start', command);
        // HookSystem::EndBlock

        for (i = 0; i < acAddons.length; i += 1) {
            addonName = acAddons[i];
            if (addons[addonName]) {
                addon = new addons[addonName](command, adapter, ac);
                if (addon.namespace) {
                    ac[addon.namespace] = addon;
                    // TODO: this is a big hack to pass the store reference
                    // into the addon without changing the signature of ctor,
                    // instead we should pass an object with all the stuff that
                    // an addon will need as part of the ctor.
                    if (Y.Lang.isFunction(addon.setStore)) {
                        addon.setStore(store);
                    }
                }
            } else {
                Y.log('[' + addonName + '] addon was not found for mojit ' + command.instance.type,
                    'warn', NAME);
            }
        }

        // HookSystem::StartBlock
        Y.mojito.hooks.hook('attachActionContext', adapter.hook, 'end', command);
        // HookSystem::EndBlock

    }


    /**
     * The main point of entry for all mojits into Mojito. The Action Context is
     * passed to every mojit action during execution, either on the client or
     * server. This object is the API into Mojito, can can have many plugins
     * attached the provide extra functionality.
     * @class ActionContext
     */
    function ActionContext(opts) {

        var controller = opts.controller,
            command = opts.command,
            store = opts.store,
            actionFunction,
            error,
            my = this;

        // HookSystem::StartBlock
        Y.mojito.hooks.hook('actionContext', opts.adapter.hook, 'start', my, opts);
        // HookSystem::EndBlock

        // It's possible to setup a route that calls "foo.", which means that
        // the default action in the instance should be used instead.
        if (!command.action) {
            command.action = command.instance.action || 'index';
        }

        this.action = command.action;
        this.type = command.instance.type;
        this.context = command.context;
        this.dispatcher = opts.dispatcher;
        actionFunction = this.action;

        // These should not be on the ac object
        this.command = command;
        this.instance = command.instance;
        this._adapter = opts.adapter;

        // pathToRoot, viewEngine, amoung others will be available through this.
        this.staticAppConfig = store.getStaticAppConfig();

        // Create a function which will properly delegate to the dispatcher to
        // perform the actual processing.
        this._dispatch = function(command, adapter) {
            return my.dispatcher.dispatch(command, adapter);
        };

        attachActionContextAddons(Y.mojito.addons.ac, command, opts.adapter, this, store);

        // Check if the controller has the requested action
        if (!Y.Lang.isFunction(controller[actionFunction])) {
            // If the action is not found try the '__call' function
            if (Y.Lang.isFunction(controller.__call)) {
                actionFunction = '__call';
            } else {
                // If there is still no joy then die
                error = new Error("No method '" + command.action + "' on controller type '" + command.instance.type + "'");
                error.code = 404;
                throw error;
            }
        }

        // HookSystem::StartBlock
        Y.mojito.hooks.hook('actionContext', opts.adapter.hook, 'end1', my, opts);
        // HookSystem::EndBlock

        // Reap the request/ac process within the timeout. If ac.done or
        // ac.error is invoked by user code prior to the time limit this
        // timer will be cleared.
        if (this.staticAppConfig.actionTimeout) {
            this._timer = setTimeout(function() {
                var err,
                    msg = 'Killing potential zombie context for Mojit type: ' +
                        my.instance.type +
                        ', controller: ' + my.instance.controller +
                        ', action: ' + actionFunction;

                // Clear the timer reference so our invocation of error()
                // doesn't try to clear it.
                my._timer = null;

                // Create an HTTP Timeout error with controller/action info.
                err = new Error(msg);
                err.code = 408;

                my.error(err);

                my.done = function() {
                    Y.log('ac.done() called after timeout. results lost', 'warn', NAME);
                };

            }, this.staticAppConfig.actionTimeout);
        }

        controller[actionFunction](this);

        // HookSystem::StartBlock
        Y.mojito.hooks.hook('actionContext', opts.adapter.hook, 'end2', my, opts);
        // HookSystem::EndBlock

    }

    ActionContext.prototype = {
        /**
        * Returns data in the request and allows you to carry on execution.
        * @method flush
        * @param {object|string} data The data you want return by the request.
        * @param {object} meta Any meta-data required to service the request.
        */
        flush: function(data, meta) {
            return this.done(data, meta, true);
        },

        /**
        * Returns data and closes the request.
        * @method done
        * @param {object|string} data The data you want return by the request.
        * @param {object} meta Any meta-data required to service the request.
        */
        done: function(data, meta, more) {

            // If we have an active timer clear it immediately.
            if (this._timer) {
                clearTimeout(this._timer);
                this._timer = null;
            }

            var callbackFunc = more ? 'flush' : 'done',
                instance = this.command.instance,
                config = instance.config || {},
                context = this.command.context || {},
                adapter = this._adapter,
                action = this.command.action,
                mojitView,
                renderer = null,
                contentType;

            // HookSystem::StartBlock
            Y.mojito.hooks.hook('actionContextDone', adapter.hook, 'start', this);
            // HookSystem::EndBlock

            if (Y.Lang.isString(meta)) {
                // If the meta string is a serializer set it
                if (serializer[meta]) {
                    meta = {
                        serialize: meta
                    };
                } else {// Otherwise we think it is a template name
                    meta = {
                        view: {name: meta}
                    };
                }
            }

            meta = meta || {};
            meta.assets = meta.assets || {};
            meta.assets.bottom = meta.assets.bottom || {};
            meta.assets.bottom.js = meta.assets.bottom.js || [];
            meta.http = meta.http || {};
            meta.http.code = meta.http.code || 200;
            meta.http.headers = meta.http.headers || {};
            meta.view = meta.view || {};

            // Check to see we need to serialize the data
            if (meta.serialize && serializer[meta.serialize]) {
                // Warning: this metod can change the "meta" object
                data = serializer[meta.serialize].apply(this, [data, meta]);
                // Once we are done, invalidate the "serialize" option so others don't
                // use it by mistake
                meta.serialize = undefined;
            }

            // We want to know the view name, id, and binder used later so make sure
            // "meta" is up-to-date
            meta.view.name = meta.view.name || action;
            // TODO: Use a different binder
            meta.view.binder = meta.view.binder || meta.view.name;
            mojitView = instance.views[meta.view.name];
            if (!meta.view.id) {
                meta.view.id = Y.guid();
                //DEBUGGING:  meta.view.id += '-viewId-' +
                //  this.command.instance.type + '-' + this.command.action;
            }

            // If we are given "meta.view['content-path']" use it over what we got
            // from "instance.views"
            if (mojitView && meta.view['content-path']) {
                mojitView['content-path'] = meta.view['content-path'];
            }

            // If we are given "meta.view['engine']" use it over what we got from
            // "instance.views"
            if (mojitView && meta.view.engine) {
                mojitView.engine = meta.view.engine;
            }
            if (mojitView && mojitView.assets) {
                meta.assets = Y.mojito.util.metaMerge(meta.assets, mojitView.assets);
            }

            meta.assets = Y.mojito.util.metaMerge(meta.assets, config.assets || {});
            // Here we ask each "thing" attached to the AC if it wants to add view
            // "meta"
            Y.Object.each(this, function(item) {
                if (item && Y.Lang.isFunction(item.mergeMetaInto)) {
                    item.mergeMetaInto(meta);
                }
            });

            contentType = meta.http.headers['content-type'];

            attachChildViewIdsToMetaChildren(meta.children, meta.binders);

            if (!meta.binders) {
                meta.binders = {};
            }

            // Don't clobber an existing meta.binders[meta.view.id] entry
            if (!meta.binders[meta.view.id]) {
                // do not add binder meta if there is not binder available
                if (meta.view.binder && instance.binders && instance.binders[meta.view.binder]) {
                    meta.binders[meta.view.id] = {
                        base: instance.base,
                        name: instance.binders[meta.view.binder], // YUI Module name of the Binder
                        action: action,
                        config: sanitizeConfigCopy(instance.config),
                        type: instance.type,
                        viewId: meta.view.id,
                        instanceId: instance.instanceId,
                        // We don't use the actual config's children object, because
                        // that might not have been what was actually dispatched. We get
                        // the actual children config that was dispatched through the
                        // meta object.
                        children: sanitizeChildren(meta.children)
                    };

                }
            }

            /*
             * Here we provide an easy way to return a string
             * data == 'a string of chars'
             */
            if (Y.Lang.isString(data)) {
                // if the user didn't provided a content type, we'll make it plain
                // text
                if (!contentType) {
                    meta.http.headers['content-type'] = ['text/plain; ' + CHARSET];
                }
                //Y.log('pushing to native adapter', 'info', NAME);
                adapter[callbackFunc](data, meta);

                // HookSystem::StartBlock
                Y.mojito.hooks.hook('actionContextDone', adapter.hook, 'end1', this);
                // HookSystem::EndBlock

                return;
            }

            // there may not be a view if this is running on the client
            if (mojitView) {

                data = data || {}; // default null data to empty view template

                if (!contentType) {
                    meta.http.headers['content-type'] = ['text/html; ' + CHARSET];
                }

                data.mojit_guid = instance.instanceId;
                data.mojit_view_id = meta.view.id;
                data.mojit_assets = this.command.instance.assetsRoot;

                // Use engine to compile template view
                // Y.log('Rendering "' + meta.view.name + '" view for "' +
                //     (instance.id || '@' + instance.type) + '"', 'info', NAME);

                // TODO: we might want to use a view renderer factory
                // that can provide caching capabilities for better performance
                // instead of creating objects over and over again per mojit instance
                renderer = new Y.mojito.ViewRenderer(mojitView.engine, this.staticAppConfig.viewEngine);
                renderer.render(data, instance, mojitView, adapter, meta, more);

            } else {

                if (Y.Lang.isObject(data)) {
                    throw new Error("Missing view template: '" + meta.view.name +
                        "'");
                }
                adapter[callbackFunc](data, meta);
            }

            // HookSystem::StartBlock
            Y.mojito.hooks.hook('actionContextDone', adapter.hook, 'end2', this);
            // HookSystem::EndBlock
        },

        /**
        * Programatically report an error to Mojito, which will handle it
        * gracefully.
        * @method error
        * @param {Error} err A normal JavaScript Error object is expected, but you
        *     may add a "code" property to the error if you want the framework to
        *     report a certain HTTP status code for the error. For example, if the
        *     status code is 404, Mojito will generate a 404 page. Additionally you
        *     might provide a reasonPhrase property, to override the default human
        *     readable description for this status code with one specific to your
        *     application. For example for the status code 404 you could provide
        *     "This does not exist in my app".
        */
        error: function(err) {
            // If we have an active timer clear it immediately.
            if (this._timer) {
                clearTimeout(this._timer);
                this._timer = null;
            }

            this._adapter.error(err);
        }
    };

    Y.namespace('mojito').ActionContext = ActionContext;

}, '0.1.0', {requires: [
    'mojito',
    'json-stringify',
    'event-custom-base',
    'mojito-view-renderer',
    'mojito-util',
    'mojito-hooks'
]});
