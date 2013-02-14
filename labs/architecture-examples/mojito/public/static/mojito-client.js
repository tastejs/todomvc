/*
 * Copyright (c) 2011-2013, Yahoo! Inc.  All rights reserved.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */


/*jslint anon:true, sloppy:true, nomen:true*/
/*global YUI*/


// Set up a global client-side Mojito namespace
if (!YUI._mojito) {

    /**
     * The top-level Mojito namespace.
     * @type {Object}
     */
    YUI._mojito = {
        // A general cache object to be used by internal mojito only
        _cache: {},
        _clientY: null,
        _clientYlog: null
    };
}


YUI.add('mojito-client', function(Y, NAME) {

    // These methods are methods that potentially make XHR calls to retrieve
    // data from the server. When the Mojito client is "paused" by calling the
    // pause() function, all the methods below are queued as they are executed
    // instead of being fully executed. When the resume() function is called,
    // the pause queue is flushed and all the intercepted actions are taken at
    // that time.
    var PAUSEABLE = [
            'executeAction',
            'doRender',
            'doBroadcast',
            'doListen',
            'doUnlisten'
        ],
        log,
        lifecycleEvents,
        State = {
            PAUSED: 'paused',
            ACTIVE: 'active'
        },
        // hook system handler
        globalHookHandler;


    // because there is a moment during startup when we need it, cache the
    // original Y instance for use as the log platform
    // And don't clobber the global
    if (!YUI._mojito._clientY) {
        YUI._mojito._clientY = Y;
    }

    // this is the heart of mojitProxy.render(), but it needs to be a separate
    // function called once we have mojit type details
    function privateRender(mp, data, view, viewEngine, cb) {
        var mojitView,
            renderer;

        if (!mp._views || !mp._views[view]) {
            cb(new Error('View "' + view + '" not found'));
            return;
        }

        data = data || {};
        // this is presumed to be useful enough that we'll set it up for them
        data.mojit_assets = data.mojit_assets || mp._assetsRoot;

        mojitView = mp._views[view];
        renderer = new Y.mojito.ViewRenderer(mojitView.engine, viewEngine);

        Y.log('Rendering "' + view + '" in Binder', 'debug', NAME);
        renderer.render(data, mp.type, mojitView['content-path'], {
            buffer: '',
            error: function(err) {
                cb(err);
            },
            flush: function(data) {
                this.buffer += data;
            },
            done: function(data) {
                this.buffer += data;
                cb(null, this.buffer);
            }
        });
    }


    function setNewMojitView(viewData, mp) {

        Y.log('setting new view on mojit ' + mp._instanceId, 'debug', NAME);

        var newNode = Y.Node.create(viewData);
        mp._node.replace(newNode);
        mp._element = document.getElementById(mp._viewId);
        mp._node = new Y.Node(mp._element);

        if (Y.Lang.isFunction(mp._binder.onRefreshView)) {
            mp._binder.onRefreshView(mp._node, mp._element);
        }
    }

    // we have to match the children by instanceId to identify them and replace
    // their viewId with the actual viewId for the binder that should be
    // attached.
    function processChildren(children, binderMap) {
        var name,
            viewId,
            found;

        for (name in children) {
            if (children.hasOwnProperty(name)) {
                for (viewId in binderMap) {
                    if (binderMap.hasOwnProperty(viewId) && !found) {
                        if (binderMap[viewId].instanceId ===
                                children[name].instanceId) {
                            children[name].viewId = viewId;
                            found = true;
                        }
                    }
                }
                found = false;
            }
        }
        return children;
    }


    function bindNode(binder, node, element) {
        var handles = [];

        if (Y.Lang.isFunction(binder.bind)) {
            // Pass the "node" to the bind method
            binder.bind(node, element);
        }
        // all automatic event delegation
        if (Y.Lang.isFunction(binder.handleClick)) {
            // This code should be deferred till after the page has visibly
            // loaded
            handles.push(Y.delegate('click', binder.handleClick, node,
                function() { return true; },
                binder));
        }

        // TODO: add all the event delegation magic here.
        Y.log('Attached ' + handles.length + ' event delegates', 'debug', NAME);
        return handles;
    }


    // TODO: complete work to call this in the destroyMojitProxy function().
    // this function is never called /iy
    function unbindNode(binder, handles) {
        var retainBinder = false;

        if (Y.Lang.isFunction(binder.unbind)) {
            // let the binder decide whether it wants to stick around in case
            // its node is reattached at some point in the future
            retainBinder = binder.unbind.call(binder);
        }

        if (handles) {
            Y.Array.each(handles, function(handle) {
                Y.log('Detaching event handle from binder', 'debug', NAME);
                handle.detach();
            });
        }
        return retainBinder;
    }


    function findParentProxy(mojits, childId) {
        var p;

        Y.Object.some(mojits, function(mojit) {
            Y.Object.some(mojit.children, function(child) {
                if (child.viewId === childId) {
                    p = mojit.proxy;
                    return true;
                }
            });
            if (p) {
                return true;
            }
        });
        return p;
    }

    function recordBoundMojit(mojits, parentid, newid, type) {
        if (parentid && mojits[parentid]) {
            if (!mojits[parentid].children) {
                mojits[parentid].children = {};
            }
            mojits[parentid].children[newid] = {
                type: type,
                viewId: newid
            };
            //console.log('recorded %s child of %s', newid, parentid);
        }
    }


    /**
     * The starting point for mojito to run in the browser. You can access one
     * instance of the Mojito Client running within the browser environment
     * through window.YMojito.client.
     * @module MojitoClient
     * @class Client
     * @constructor
     * @namespace Y.mojito
     * @param {Object} config The entire configuration object written by the
     *     server to start up mojito.
     */
    function MojitoClient(config) {
        this.timeLogStack = [];
        this.yuiConsole = null;
        this._pauseQueue = [];

        if (config) {
            // HookSystem::StartBlock
            // TODO: validate that config.perf could be set for client.
            if (config.perf) {
                globalHookHandler = {};
                // enabling perf group
                // TODO: this should not be executed here.
                Y.mojito.hooks.enableHookGroup(globalHookHandler, 'mojito-perf');
            }
            // HookSystem::EndBlock

            // Note the server sends cleased config data directly to the
            // constructor from the deploy.server.js initializer to allow markup
            // to move over the wire in config strings without triggering
            // injection attacks. We need to undo that here so the strings
            // return to their original format before we try to use them.
            this.init(Y.mojito.util.uncleanse(config));
        }
    }


    lifecycleEvents = {};


    /**
     * Subscribe to a MojitoClient lifecycle event.
     * @method subscribe
     * @param {string} evt name of event to subscribe to.
     * @param {function(data)} cb callback called when the event fires.
     */
    MojitoClient.subscribe = function(evt, cb) {
        // Subscribe works only in appLevel
        if (Y && YUI._mojito._clientY &&
                (Y._yuid !== YUI._mojito._clientY._yuid)) {
            // Y.log('Applevel subscribe ?  ' + Y._yuid + " ==== " +
            //     YUI._mojito._clientY._yuid, 'error', NAME);
            return;
        }
        if (!lifecycleEvents[evt]) {
            lifecycleEvents[evt] = [];
        }
        lifecycleEvents[evt].push(cb);
    };


    /**
     * Fires a lifecycle event.
     * @method fireLifecycle
     * @param {string} evt The name of event to fire.
     * @param {Object} data The data to pass to listeners.
     * @private
     */
    function fireLifecycle(evt, data) {
        var cbs = lifecycleEvents[evt],
            c;
        if (!cbs || !cbs.length) {
            return;
        }
        for (c = 0; c < cbs.length; c += 1) {
            cbs[c](data);
        }
    }


    /**
     * Fired at the beginning of the startup of MojitoClient.
     *
     * The data contains the following:
     * <dl>
     *  <dt><code>config</code></dt>
     *  <dd>the config object used to initialize the MojitoClient</dd>
     * </dl>
     *
     * Any change to the config will be picked up and used by MojitoClient.
     * @param {Object} data The data for the event.
     */

    /**
     * Fired at the end of the startup of MojitoClient.
     * @param {Object} data The data for the event. (Empty in this case).
     */

    /**
     * Fired before the binders are attached to the page.
     *
     * The data contains the following:
     * <dl>
     *  <dt><code>binderMap</code></dt>
     *  <dd>the details of the binders to attach to the page</dd>
     *  <dt><code>parentId</code></dt>
     *  <dd>[optional] the parent binder view id to attach any children</dd>
     *  <dt><code>topLevelMojitViewId</code></dt>
     *  <dd>[optional] the topmost (root) binder view id to attach as a child to
     *      the parent</dd>
     * </dl>
     *
     * Any change to the data will be picked up and used by MojitoClient.
     * @param {Object} data The data for the event.
     */

    /**
     * Fired after the binders are attached to the page.
     * @param {Object} data The data for the event. (Empty in this case).
     */

    MojitoClient.prototype = {

        init: function(config) {
            fireLifecycle('pre-init', {config: config});
            // HookSystem::StartBlock
            Y.mojito.hooks.hook('mojitoClient', globalHookHandler, 'start', this);
            // HookSystem::EndBlock
            var that = this,
                appConfig = config.appConfig;

            // YUI Console
            if (appConfig && appConfig.yui &&
                    appConfig.yui.showConsoleInClient && !that.yuiConsole) {
                YUI().use('console-filters', function(Y) {
                    Y.one('body').addClass('yui3-skin-sam');
                    that.yuiConsole = new Y.Console({
                        plugins: [Y.Plugin.ConsoleFilters],
                        logSource: Y.Global,
                        height: 600
                    });
                    that.yuiConsole.render();
                    that.init(config);
                });
                return;
            }

            if (Y.mojito.TunnelClient) {
                this.tunnel = new Y.mojito.TunnelClient(config.appConfig);
            }

            // Note this is the client-store, not the server-store.
            this.resourceStore = new Y.mojito.ResourceStore(config);
            this.dispatcher = Y.mojito.Dispatcher.init(this.resourceStore, this.tunnel);

            // request context from server
            this.context = config.context;
            // application configuration
            this.config = config;

            // create listener bag for mojit comms
            this._listeners = {};
            // the mojits represented in the current DOM, keyed by DOM element
            // id
            this._mojits = {};

            // HookSystem::StartBlock
            Y.mojito.hooks.hook('mojitoClient', globalHookHandler, 'end', this);
            // HookSystem::EndBlock
            /* FUTURE -- perhaps only do this once a user needs it
            var singletons;
            singletons = {
                tunnel:         this.tunnel,
                resourceStore:  this.resourceStore,
                dispatcher:     this.dispatcher
            }
            fireLifecycle('made-singletons', singletons);
            // allow the event listeners to modify the singletons
            this.tunnel         = singletons.tunnel;
            this.resourceStore  = singletons.resourceStore;
            this.dispatcher     = singletons.dispatcher;
            */

            this.attachBinders(config.binderMap);

            // wrap pause-able methods
            Y.Array.each(PAUSEABLE, function(mName) {
                var me = this,
                    originalMethod = me[mName];

                this[mName] = function() {
                    // during execution of these pauseable function, we'll check
                    // to see if the client is in a paused state
                    if (me._state === State.PAUSED) {
                        // now just queue the method call with original function
                        // and args for execution on resume()
                        me._pauseQueue.push({
                            fn: originalMethod,
                            args: arguments
                        });
                    } else {
                        // not paused, so go ahead and apply the function
                        originalMethod.apply(me, arguments);
                    }
                };
            }, this);

            this._state = State.ACTIVE;
            fireLifecycle('post-init', {});
        },


        /**
         * Given a set of binder information, initialize binder instances and
         * bind them to the page.
         * @method attachBinders
         * @private
         * @param {Object} binderMap viewId ==> binder data, contains all we
         *     need from the mojit dispatch's meta object about all the binders
         *     that were executed to create the DOM addition recently added to
         *     the document.
         * @param {string} parentId the parent binder view id to attach any
         *     children.
         * @param {string} topLevelMojitViewId the topmost (root) binder view
         *     id to attach as a child to the parent.
         */
        attachBinders: function(binderMap, parentId, topLevelMojitViewId) {
            var context = this.context,
                me = this,
                newMojitProxies = [],
                parent,
                topLevelMojitObj,
                totalBinders = Y.Object.size(binderMap),
                bindersComplete = 0,
                onBinderComplete,
                // Note: This here so we can get access view meta data for
                // each binder
                store = this.resourceStore,
                eventData = {
                    binderMap: binderMap,
                    parentId: parentId,
                    topLevelMojitViewId: topLevelMojitViewId
                };

            fireLifecycle('pre-attach-binders', eventData);
            this.pause();
            binderMap = eventData.binderMap;
            parentId = eventData.parentId;
            topLevelMojitViewId = eventData.topLevelMojitViewId;
            // HookSystem::StartBlock
            Y.mojito.hooks.hook('mojitoClientBind', globalHookHandler, 'start', this);
            // HookSystem::EndBlock

            if (!totalBinders) {
                // HookSystem::StartBlock
                Y.mojito.hooks.hook('mojitoClientBind', globalHookHandler, 'resume', this);
                // HookSystem::EndBlock
                me.resume();
                // HookSystem::StartBlock
                Y.mojito.hooks.hook('mojitoClientBind', globalHookHandler, 'end', this);
                // HookSystem::EndBlock
                fireLifecycle('post-attach-binders', {});
                return;
            }

            onBinderComplete = function() {

                // only run the function when all binders have completed
                bindersComplete += 1;
                if (bindersComplete < totalBinders) {
                    return;
                }

                // now that all binders have been initialized and accounted
                // for...

                // first, we must create the MojitClient's state of the binders
                // before binding, in case the binders' bind() function tries to
                // do anything that includes children
                Y.Array.each(newMojitProxies, function(item) {
                    var proxy = item.proxy,
                        children = item.children;

                    // 'me' here is the MojitoClient instance.
                    me._mojits[proxy._viewId] = {
                        proxy: proxy,
                        children: children
                    };
                });

                // now we'll loop through again and do the binding, saving the
                // handles
                Y.Array.each(newMojitProxies, function(item) {
                    var viewid = item.proxy.getId(),
                        mojit = me._mojits[viewid],
                        proxy = item.proxy;

                    mojit.handles = bindNode(proxy._binder, proxy._node,
                        proxy._element);

                    recordBoundMojit(me._mojits, parentId, viewid, proxy.type);
                });

                // HookSystem::StartBlock
                Y.mojito.hooks.hook('mojitoClientBindComplete', globalHookHandler, 'start', this);
                // HookSystem::EndBlock
                me.resume();
                // HookSystem::StartBlock
                Y.mojito.hooks.hook('mojitoClientBindComplete', globalHookHandler, 'end', this);
                // HookSystem::EndBlock
                fireLifecycle('post-attach-binders', {});
            };

            // loop over the binder map, load, use, and instantiate them
            Y.Object.each(binderMap, function(binderData, viewId) {

                var config,
                    type = binderData.type,
                    base = binderData.base,
                    binderName = binderData.name,
                    instanceId = binderData.instanceId,
                    mojitProxy,
                    binderClass,
                    children,
                    binder,
                    mojitNode,
                    element;

                // Make sure viewIds's are not bound to more than once
                if (me._mojits[viewId]) {
                    Y.log('Not rebinding binder for ' + type +
                          ' for DOM node ' + viewId, 'info', NAME);
                    onBinderComplete();
                    return;
                }

                if (!binderName) {
                    Y.log('No binder for ' + type + '.' +
                          binderData.action, 'info', NAME);
                    onBinderComplete();
                    return;
                }

                // "Y.mojito.binders" is blind to all new "binders" added to
                // the page we have to "use()" any binder name we are given
                // to have access to it.
                Y.use(binderData.name, function(Y) {

                    // Check again to make sure viewIds's are not bound
                    // more than once, just in case they were bound during
                    // the async fetch for the binder
                    if (me._mojits[viewId]) {
                        Y.log('Not rebinding binder for ' + binderData.type +
                              ' for DOM node ' + viewId, 'info', NAME);
                        onBinderComplete();
                        return;
                    }

                    config = Y.mojito.util.copy(binderData.config);

                    element = document.getElementById(viewId);

                    if (!element) {
                        Y.log('Did not find DOM node "' + viewId +
                            '" for binder "' + binderName + '"',
                            'warn', NAME);
                        onBinderComplete();
                        return;
                    }

                    mojitNode = new Y.Node(element);

                    // BY reference here is the 'use()' return value...the
                    // Binder class we need to access.
                    binderClass = Y.mojito.binders[binderName];

                    binder = Y.mojito.util.heir(binderClass);

                    Y.log('Created binder "' + binderName +
                          '" for DOM node "' + viewId + '"', 'info', NAME);

                    if (binderData.children) {
                        children = processChildren(binderData.children,
                            binderMap);
                    }

                    // One mojitProxy per binder. The mp is how client code
                    // gets to the binder...they don't hold refs to anything
                    // but the mp. (close enough).
                    mojitProxy = new Y.mojito.MojitProxy({
                        // private
                        action: binderData.action,
                        binder: binder,
                        base: base,
                        node: mojitNode,
                        element: element,
                        viewId: viewId,
                        instanceId: instanceId,
                        client: me,
                        store: store,
                        // public
                        type: type,
                        config: config,
                        context: context
                    });
                    // If client is paused, proxy must be paused
                    if (me._state === State.PAUSED) {
                        mojitProxy._pause();
                    }

                    newMojitProxies.push({
                        proxy: mojitProxy,
                        children: children
                    });

                    if (Y.Lang.isFunction(binder.init)) {
                        binder.init(mojitProxy);
                    }

                    onBinderComplete();

                });

            }, this);

        },


        /**
         * Used for binders to execute their actions through the Mojito
         * framework through their proxies.
         * @method executeAction
         * @param {Object} command must contain mojit id and action to execute.
         * @param {String} viewId the view id of the current mojit, which is
         *     executing the action.
         * @param {Function} cb callback to run when complete.
         * @private
         */
        executeAction: function(command, viewId, cb) {
            var outputHandler;

            // Sending a command to dispatcher that defines our action execution
            Y.log('Executing "' + (command.instance.base || '@' +
                command.instance.type) + '/' + command.action +
                '" on the client.', 'mojito', NAME);

            command.context = this.context;

            outputHandler = new Y.mojito.OutputHandler(viewId, cb, this);

            // HookSystem::StartBlock
            if (Y.mojito.hooks) {
                outputHandler.hook = globalHookHandler;
            }
            // HookSystem::EndBlock

            this.dispatcher.dispatch(command, outputHandler);
        },


        doRender: function(mp, data, view, cb) {
            var viewEngine = this.config.appConfig.viewEngine;
            if (!mp._views || !mp._assetsRoot) {
                this.resourceStore.expandInstance({type: mp.type}, mp.context,
                    function(err, typeInfo) {
                        if (err) {
                            cb(new Error(
                                'Failed to load mojit information for ' +
                                    mp.type
                            ));
                            return;
                        }
                        mp._views = typeInfo.views;
                        mp._assetsRoot = typeInfo.assetsRoot;
                        privateRender(mp, data, view, viewEngine, cb);
                    });
            } else {
                privateRender(mp, data, view, viewEngine, cb);
            }
        },


        doBroadcast: function(eventId, source, payload, opts) {
            opts = opts || {};
            var tgtInstId,
                tgtViewId,
                child = opts.target ?
                        this._mojits[source].children[opts.target.slot] : null;
            if (opts && opts.target) {
                if (opts.target.slot && child) {
                    tgtInstId = child.instanceId;
                    // find the target of the message
                    Y.Object.each(this._mojits, function(v, k) {
                        if (v.proxy._instanceId === tgtInstId) {
                            tgtViewId = k;
                        }
                    });
                    // if there was no target found, give an error and return
                    if (!tgtViewId) {
                        Y.log('No broadcast target found for ' +
                            opts.target.slot + ':' + tgtInstId, 'warn', NAME);
                        return;
                    }
                } else if (opts.target.viewId) {
                    tgtViewId = opts.target.viewId;
                }
            }
            if (this._listeners[eventId]) {
                Y.Array.each(this._listeners[eventId], function(listener) {
                    if (!tgtViewId || tgtViewId === listener.viewId) {
                        listener.cb({
                            data: payload,
                            source: source
                        });
                    }
                });
            }
        },


        doListen: function(eventId, viewId, callback) {
            if (!this._listeners[eventId]) {
                this._listeners[eventId] = [];
            }
            this._listeners[eventId].push({
                viewId: viewId,
                cb: callback
            });
        },


        doUnlisten: function(viewId, needleEvent) {
            var listeners = this._listeners,
                eventType;

            function processListenerArray(arr, id) {
                var i = 0;

                while (i < arr.length) {
                    if (arr[i].viewId === id) {
                        arr.splice(i, 1);
                        // no increment. i is now the "next" index
                    } else {
                        i += 1;
                    }
                }
                return arr;
            }

            // if there is only one event to unlisten, do it quickly
            if (needleEvent) {
                processListenerArray(listeners[needleEvent], viewId);
            } else {
                // but if we need to unlisten to all callbacks registered by
                // this binder, we must loop over the entire listener object
                for (eventType in listeners) {
                    if (listeners.hasOwnProperty(eventType)) {
                        processListenerArray(listeners[eventType], viewId);
                    }
                }
            }
        },

        /**
         * @method destroyMojitProxy
         * @param {String} id The mojit's viewId to destroy
         * @param {Boolean} retainNode
         */
        destroyMojitProxy: function(viewId, retainNode) {
            var mojits = this._mojits, parent, instanceId;

            if (mojits[viewId] && mojits[viewId].proxy) {
                // lookup instanceId for this viewId
                instanceId = mojits[viewId].proxy._instanceId;

                // TODO: activate call to unbindNode below:
                // unbindNode(mojits[viewId].proxy._binder,
                //      mojits[viewId].handles);
                mojits[viewId].proxy._destroy(retainNode);
                // is there a better alternative for this delete?
                // maybe not, but it might introduce a perf penalty
                // if a lot of mojits are created and destroyed,
                // and we can't use the undefined trick because
                // viewId has an infinite domain
                delete mojits[viewId];

                // We don't manage binder children automatically, but any time a
                // new child is added or removed, we should at least give the
                // application code a chance to stay up to date if they want to.
                // The only gap is when a mojit destroys itself.
                // onChildDestroyed is called whenever a binder is destroyed so
                // any parents can be notified.
                parent = findParentProxy(mojits, viewId);
                if (parent && parent._binder.onChildDestroyed &&
                        Y.Lang.isFunction(parent._binder.onChildDestroyed)) {
                    parent._binder.onChildDestroyed({ id: viewId });
                }
            }
        },


        /**
         * Pause the Mojito Client and all mojits that are running. This will
         * notify all binders that they have been paused by calling their
         * onPause() functions. It will prevent the immediate execution of
         * several mojit proxy operations that might cause a long process to
         * begin (especially things that might go to the server).
         *
         * To resume, simply call .resume(). This will immediately execute all
         * actions that occurred while Mojito was paused.
         * @method pause
         */
        pause: function() {
            if (this._state === State.PAUSED) {
                Y.log('Cannot "pause" the mojito client because it has' +
                    ' already been paused.', 'warn', NAME);
                return;
            }
            this._state = State.PAUSED;
            Y.Object.each(this._mojits, function(moj) {
                moj.proxy._pause();
            });
            Y.log('Mojito Client state: ' + this._state + '.', 'info', NAME);
        },


        /**
         * Resumes the Mojito client after it has been paused (see method
         * "pause"). If there are any queued actions that were executed and
         * cached during the pause, calling resume() will immediately execute
         * them. All binders are notified through their onResume() function that
         * they are been resumed.
         * @method resume
         */
        resume: function() {
            if (this._state !== State.PAUSED) {
                Y.log('Cannot "resume" the mojito client because it was' +
                    ' never paused.', 'warn', NAME);
                return;
            }
            this._state = State.ACTIVE;
            Y.Object.each(this._mojits, function(moj) {
                moj.proxy._resume();
            });
            Y.Array.each(this._pauseQueue, function(queuedItem) {
                var fn = queuedItem.fn,
                    args = queuedItem.args;

                fn.apply(this, args);
            }, this);
            this._pauseQueue = [];
            Y.log('Mojito Client state: ' + this._state + '.', 'info', NAME);
        },


        refreshMojitView: function(mp, opts, cb) {
            var my = this;

            mp.invoke(mp._action, opts, function(err, data, meta) {

                if (err) {
                    if (typeof cb === 'function') {
                        cb(new Error(err));
                        return;
                    }
                    throw new Error(err);
                }

                /*
                 * The new markup returned from the server has all new DOM ids
                 * within it, but we don't want to use them. Before doing any
                 * DOM stuff, we are going to replace all the new view ids with
                 * our current view ids for this mojit view as well as any
                 * children that have come along for the ride.
                 */

                var idReplacements = {}, // from: to
                    metaBinderViewId,
                    mBinder,
                    freshBinders = {},
                    clientMojitViewId,
                    clientMojit,
                    processMojitChildrenForIdReplacements;

                /*
                 * Recursive function used to walk down the hierarchy of
                 * children in order to replace every view id within the meta
                 * data
                 */
                processMojitChildrenForIdReplacements =
                    function(clientChildren, metaChildren, idRepls) {
                        var metaChild,
                            childMojitProxy,
                            metaSubChildren,
                            slot;

                        if (!metaChildren || !clientChildren) {
                            return;
                        }
                        for (slot in metaChildren) {
                            if (metaChildren.hasOwnProperty(slot)) {
                                metaChild = metaChildren[slot];
                                if (clientChildren && clientChildren[slot]) {
                                    childMojitProxy =
                                        clientChildren[slot].proxy;
                                }
                                if (childMojitProxy) {
                                    metaSubChildren = meta.binders[
                                        metaChild.viewId
                                    ].config.children;
                                    idRepls[metaChild.viewId] =
                                        childMojitProxy.getId();
                                    if (metaSubChildren) {
                                        processMojitChildrenForIdReplacements(
                                            my.mojits[childMojitProxy.getId()].
                                                children,
                                            metaSubChildren,
                                            idRepls
                                        );
                                    }
                                }
                            }
                        }
                    };

                for (clientMojitViewId in my._mojits) {
                    if (my._mojits.hasOwnProperty(clientMojitViewId)) {
                        clientMojit = my._mojits[clientMojitViewId];
                        for (metaBinderViewId in meta.binders) {
                            if (meta.binders.hasOwnProperty(metaBinderViewId)) {
                                mBinder = meta.binders[metaBinderViewId];
                                if (mBinder.instanceId ===
                                        clientMojit.proxy._instanceId) {
                                    Y.log('matched instanceId ' +
                                        mBinder.instanceId,
                                        'debug',
                                        NAME
                                        );
                                    idReplacements[metaBinderViewId] =
                                        clientMojitViewId;
                                    processMojitChildrenForIdReplacements(
                                        my._mojits[clientMojit.proxy.getId()].
                                            children,
                                        mBinder.children,
                                        idReplacements
                                    );
                                }
                            }
                        }
                    }
                }

                Y.Object.each(idReplacements, function(to, from) {
                    var regex = new RegExp(from, 'g');

                    data = data.replace(regex, to);
                });

                setNewMojitView(data, mp);

                // Do a "light bind" for each child, keeping track of any
                // binders that need a "full bind". We'll bind those in the
                // attachBinders call below this loop.
                Y.Object.each(meta.children, function(child, slot) {

                    var childViewId = idReplacements[child.viewId],
                        childMojit = my._mojits[childViewId],
                        childProxy,
                        childNode,
                        childElement,
                        childBinder;

                    // may not be a binder for this mojit child, so there would
                    // be no mojit proxy yet
                    if (!childMojit) {
                        // this must be a new binder instance that we need to
                        // instantiate
                        freshBinders[child.viewId] = meta.binders[child.viewId];
                        return;
                    }

                    childProxy = my._mojits[childViewId].proxy;
                    childNode = mp._node.one('#' + childViewId);
                    childElement = childNode._node;
                    childBinder = childProxy._binder;

                    // set new node and element into the mojit proxy object
                    childProxy._node = childNode;
                    childProxy._element = childElement;

                    if (Y.Lang.isFunction(childBinder.onRefreshView)) {
                        childBinder.onRefreshView(childNode, childElement);
                    } else if (Y.Lang.isFunction(childBinder.bind)) {
                        childBinder.bind(childNode, childElement);
                    }
                });

                // Do a "full bind" on the new binders we tracked in the loop
                // above. These need the full treatment.
                my.attachBinders(freshBinders);

                if (cb) {
                    cb(data, meta);
                }
            });
        }
    };

    Y.namespace('mojito').Client = MojitoClient;

}, '0.1.0', {requires: [
    'io-base',
    'event-delegate',
    'node-base',
    'querystring-stringify-simple',
    'mojito',
    'mojito-dispatcher',
    'mojito-route-maker',
    'mojito-client-store',
    'mojito-mojit-proxy',
    'mojito-tunnel-client',
    'mojito-output-handler',
    'mojito-util',
    'mojito-hooks'
]});
