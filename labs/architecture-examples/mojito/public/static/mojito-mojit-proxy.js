/*
 * Copyright (c) 2011-2013, Yahoo! Inc.  All rights reserved.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */


/*jslint anon:true, sloppy:true, nomen:true*/
/*global YUI*/


/**
 * Client side Mojito runtime
 * @module MojitoClient
 */
YUI.add('mojito-mojit-proxy', function(Y, NAME) {

    var MJT_EVT_PRFX = 'mojit:';

    /**
     * The object that is given to each mojit binder to be used to interact with
     * other mojits and the mojito framework.
     * @class MojitProxy
     */
    function MojitProxy(opts) {
        // "private"
        this._action = opts.action;
        this._binder = opts.binder;
        this._base = opts.base;
        this._node = opts.node;
        this._element = opts.element;
        this._viewId = opts.viewId;
        this._instanceId = opts.instanceId;
        this._client = opts.client;
        this._store = opts.store;


        /**
         * The mojit type
         * @type {String}
         */


        this.type = opts.type;
        /**
         * The mojit configuration for this binder
         * @type {Object}
         */
        this.config = opts.config;


        /**
         * The context used to generate this page
         * @type {Object}
         */
        this.context = opts.context;
    }


    MojitProxy.prototype = {

        /**
         * Used by mojit binders to broadcast a message between mojits.
         * @method broadcast
         * @param {String} name event name.
         * @param {Object} payload the payload for the event.
         * @param {Object} options currently only used to specify target for
         *      broadcast. For example, to target only one child mojit for
         *      broadcast, use:
         *          {target: {slot: 'slot name', viewId: 'DOM view id'}}.
         */
        broadcast: function(name, payload, options) {
            this._client.doBroadcast(MJT_EVT_PRFX + name,
                this._viewId,
                payload,
                options);
        },


        /**
         * Allows mojit binders to register to listen to other mojit events
         * @method listen
         * @param {String} name event name.
         * @param {Function} callback called when an event is broadcast with
         *     the event data.
         */
        listen: function(name, callback) {
            this._client.doListen(MJT_EVT_PRFX + name, this._viewId,
                function(evt) {
                    // prevent mojits from listening to their own events
                    if (evt.source !== this.id) {
                        callback(evt);
                    }
                });
        },


        /**
         * The opposite of the "listen" function. Deletes all callback functions
         * from the listener queue associated with this binder and event type.
         * If event name is not specified, all callbacks associated with this
         * binder are deleted.
         * @method unlisten
         * @param {String} [optional] name event name.
         */
        unlisten: function(name) {
            var eventName = name ? MJT_EVT_PRFX + name : null;
            this._client.doUnlisten(this._viewId, eventName);
        },


        /**
         * This method renders the "data" provided into the "View" specified.
         * The "view" must be the name of one of the files in the current
         * Mojits "views" folder. Returns via the callback.
         * @method render
         * @param {Object} data The data to render.
         * @param {String} view The view name to use for rendering.
         * @param {function(err,str)} cb The callback function.
         */
        render: function(data, view, cb) {
            this._client.doRender(this, data, view, cb);
        },


        /**
         * Used by the mojit binders to invoke actions on themselves within
         * Mojito.
         * The <em>options</em> parameter is optional and may contain:
         * <dl>
         *     <dt>params</dt><dd>&lt;object&gt; must be broken out explicitly:
         *     <dl>
         *      <dt>route</dt><dd>&lt;object&gt; Map of key/value pairs.</dd>
         *      <dt>url</dt><dd>&lt;object&gt; Map of key/value pairs.</dd>
         *      <dt>body</dt><dd>&lt;object&gt; Map of key/value pairs.</dd>
         *      <dt>file</dt><dd>&lt;object&gt; Map of key/value pairs.</dd>
         *     </dl></dd>
         *     <dt>rpc</dt><dd>&lt;boolean&gt; Means that we are immediately
         *     sending the request to the server to answer the invocation.</dd>
         * </dl>
         * @method invoke
         * @param {String} action name of the action to invoke.
         * @param {Object} options see above.
         * @param {Function} cb function to be called on completion.
         */
        invoke: function(action, options, cb) {
            var callback, command, instance;

            options = options || {};

            // If there are no options use it as the callback
            if ('function' === typeof options) {
                callback = options;
                options = {};
            } else {
                callback = cb;
            }

            // If we don't have a callback set an empty one
            if ('function' !== typeof callback) {
                // TODO: this can be a constant function...not created on each
                // invoke call.
                callback = function() {};
            }

            // Make sure we have a "params" key in our "options" object
            options.params = options.params || {};

            // This is the "partial instance" which isn't an "Object instance"
            // :). At least one of base or type must be defined.
            // TODO: we don't check base vs. type here...
            instance = {
                base: this._base,
                type: this.type,
                instanceId: this._instanceId,
                config: Y.mojito.util.copy(this.config)
            };

            // Create the command we will use to call executeAction() with
            command = {
                instance: instance,
                action: action,
                params: { // Explicitly map the params to there keys
                    route: options.params.route || {},
                    // NOTE the defaulting here to drive from URL if no explicit
                    // params are provided.
                    // TODO: we should have an explicit override option here and
                    // merge...
                    url: options.params.url || this.getFromUrl(),
                    body: options.params.body || {},
                    file: options.params.file || {}
                },
                // NOTE this isn't a standard command option.
                // TODO: not really "proper" to be part of command object,
                // should really be somewhere else...but where?
                rpc: options.rpc || false
            };

            this._client.executeAction(command, this.getId(), callback);
        },


        /**
         * Refreshes the current DOM view for this binder without recreating the
         * binder instance. Will call the binder's onRefreshView() function when
         * complete with the new Y.Node and HTMLElement objects.
         * @method refreshView
         * @param {Object} opts same as the options for invoke().
         * @param {Function} cb Called after replacement and onRefreshView have
         *     been called, sends data/meta.
         */
        refreshView: function(opts, cb) {
            opts = opts || {};
            if (Y.Lang.isFunction(opts)) {
                cb = opts;
                opts = {};
            }
            this._client.refreshMojitView(this, opts, cb);
        },


        /**
         * Gets URL parameters
         * @method getFromUrl
         * @param {String} key The name of the parameter required.
         * @return {String|Object} param value, or all params if no key
         *     specified.
         */
        getFromUrl: function(key) {
            if (!this.query) {
                this.query = Y.QueryString.parse(
                    window.location.href.split('?').pop()
                );
            }

            if (key) {
                return this.query[key];
            }

            return this.query;
        },


        /*
         * Returns the DOM Node ID for the current binder
         * @method getId
         * @return {String} YUI GUID
         */
        getId: function() {
            return this._viewId;
        },


        /**
         * Helper function to gather up details about a mojit's children from
         * the Mojito Client.
         * @method getChildren
         * @return {Object} slot &lt;String&gt;-->child information &lt;Object&gt;.
         */
        getChildren: function() {
            return this._client._mojits[this.getId()].children;
        },


        /**
         * Clears out a child's view, calling the appropriate life cycle
         * functions, then destroy's its binder and dereferences it. Will also
         * dereference the child from this mojit's children.
         * @method destroyChild
         * @param {String} id Either the slot key of the child, or the DOM
         *     view id of the child.
         * @param {Boolean} retainNode if true, the binder's node will remain in
         *     the dom.
         */
        destroyChild: function(id, retainNode) {
            var slot,
                doomed, // viewid/dom id
                children = this.getChildren(),
                child = children[id];

            if (child) {
                doomed = child.viewId;

            } else {
                //child key could be a random YUI Id
                for (slot in children) {
                    if (children.hasOwnProperty(slot) && children[slot].viewId === id) {
                        doomed = id;
                        break;
                    }
                }
            }
            if (!doomed) {
                throw new Error("Cannot destroy a child mojit with id '" +
                    id + "'. Are you sure this is your child?");
            }

            this._client.destroyMojitProxy(doomed, retainNode);

            if (child) {
                if (this.config.children) {
                    this.config.children[id] = undefined;
                }
                children[id] = undefined;
            }
        },


        /**
         * Destroys all children. (Calls destroyChild() for each child.)
         * @method destroyChildren
         * @param {Boolean} retainNode if true, the binder's node will remain in
         *     the dom.
         */
        destroyChildren: function(retainNode) {
            var children = this.getChildren(), child;
            for (child in children) {
                if (children.hasOwnProperty(child)) {
                    this.destroyChild(child, retainNode);
                }
            }
        },


        /**
         * Allows a binder to destroy itself and be removed from Mojito client
         * runtime entirely.
         * @method destroySelf
         * @param {Boolean} retainNode if true, the binder's node will remain in
         *     the dom.
         */
        destroySelf: function(retainNode) {
            this._client.destroyMojitProxy(this.getId(), retainNode);
        },


        _destroy: function(retainNode) {
            var binder = this._binder;
            Y.log('destroying binder ' + this._viewId, 'debug', NAME);
            this.destroyChildren(retainNode);
            if (Y.Lang.isFunction(binder.destroy)) {
                // this will de-register all this binder's callbacks from any
                // listener queues
                binder.destroy.call(binder);
            }
            if (!retainNode) {
                this._node.remove(true);
            }
            this._client.doUnlisten(this._viewId);
        },


        _pause: function() {
            var binder = this._binder;
            if (Y.Lang.isFunction(binder.onPause)) {
                binder.onPause();
            }
        },


        _resume: function() {
            var binder = this._binder;
            if (Y.Lang.isFunction(binder.onResume)) {
                binder.onResume();
            }
        }

    };

    Y.namespace('mojito').MojitProxy = MojitProxy;

}, '0.1.0', {requires: [
    'mojito',
    'mojito-util',
    'querystring'
]});
