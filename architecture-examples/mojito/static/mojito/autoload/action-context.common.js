/*
 * Copyright (c) 2011-2012, Yahoo! Inc.  All rights reserved.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */


/*jslint anon:true, sloppy:true, nomen:true*/
/*global YUI*/


/**
 * The Action Context is a key part of the Mojito framework. The <em>ac</em>,
 * for short, gives you access to the frameworks features from within a
 * controller function. The ac is an abstraction that allows you to execute
 * mojit actions within either a server or client context.
 * @module ActionContext
 */
YUI.add('mojito-action-context', function(Y, NAME) {

    var CACHE;


    // -------------------------------------------------------------------------
    // Comments below are so generated comments for flush, done, etc. are found
    // on ActionContext even though they're not really done here.
    // -------------------------------------------------------------------------

    /**
     * Returns data in the request and allows you to carry on execution.
     * @method flush
     * @param {object|string} data The data you want return by the request.
     * @param {object} meta Any meta-data required to service the request.
     */

    /**
     * Returns data and closes the request.
     * @method done
     * @param {object|string} data The data you want return by the request.
     * @param {object} meta Any meta-data required to service the request.
     */

    /**
     * Programatically report an error to Mojito, which will handle it
     * gracefully.
     * @method error
     * @param {Error} err A normal JavaScript Error object is expected, but you
     *     may add a "code" property to the error if you want the framework to
     *     report a certain HTTP status code for the error. For example, if the
     *     status code is 404, Mojito will generate a 404 page.
     */

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

    // TODO: probably should move to mojito.common.js (namespace definitions).
    if (!YUI._mojito) {
        YUI._mojito = {};
    }

    if (!YUI._mojito._cache) {
        YUI._mojito._cache = {};
    }

    if (!YUI._mojito._cache.addons) {
        YUI._mojito._cache.addons = {};
    }

    CACHE = YUI._mojito._cache.addons;


    function calculateAddonDependencies(addon, addons, dependencies) {
        var dep,
            dependsOn = addon.dependsOn,
            i;

        if (!Y.Lang.isArray(dependsOn)) {
            return;
        }

        for (i = 0; i < dependsOn.length; i += 1) {
            dep = dependsOn[i];
            if (!dependencies[dep]) {
                if (!addons[dep]) {
                    throw new Error(addon.prototype.namespace +
                        " addon has invalid dependency: '" + dep + "'");
                }
                calculateAddonDependencies(addons[dep], addons, dependencies);
            }
            dependencies[dep] = true;
        }
    }


    /**
     * Mixes all the Action Context addons into the Action Context
     * @attachActionContextAddons
     * @param {Array} addons The action context addons.
     * @param {object} command The command object.
     * @param {object} adapter The output adapter.
     * @param {Y.mojito.ActionContext} ac The action context.
     */
    function attachActionContextAddons(addons, command, adapter, ac) {
        var addonName,
            addon,
            dependencies = {};

        if (CACHE[ac.type]) {
            dependencies = CACHE[ac.type];
        } else {
            for (addonName in addons) {
                if (addons.hasOwnProperty(addonName)) {
                    if (!dependencies[addonName]) {
                        calculateAddonDependencies(addons[addonName], addons,
                            dependencies);
                    }
                    dependencies[addonName] = true;
                }
            }
            CACHE[ac.type] = dependencies;
        }

        for (addonName in dependencies) {
            if (dependencies.hasOwnProperty(addonName)) {
                addon = new addons[addonName](command, adapter, ac);
                if (addon.namespace) {
                    ac[addon.namespace] = addon;
                }
            }
        }
    }


    /**
     * The main point of entry for all mojits into Mojito. The Action Context is
     * passed to every mojit action during execution, either on the client or
     * server. This object is the API into Mojito, can can have many plugins
     * attached the provide extra functionality.
     * @class ActionContext
     */
    function ActionContext(opts) {
        Y.log('constructing action context', 'mojito', 'qeperf');

        var self = this,
            command = opts.command,
            instance = command.instance,
            controller = opts.controller,
            models = opts.models,
            dispatch = opts.dispatch,
            adapter = opts.adapter,
            store = opts.store,
            actionFunction,
            error;

        // "init" is not an action
        if (command.action === 'init') {
            throw new Error('Cannot execute action \'init\' on any mojit.' +
                ' This name is reserved by the Mojito framework.');
        }

        // we want to make these easily accessible to any functions that addons
        // attach directly to the ac object.
        // TODO: These properties should be hidden behind accessor functions.
        this.command = command;
        this.instance = instance;
        this.action = command.action;
        this.type = instance.type;
        this.context = command.context;
        this.models = models;

        // identify this as internal... users probably won't want to use it, but
        // addons might need
        this._dispatch = dispatch;
        this._adapter = adapter;

        // deprecated this function for current users
        this.dispatch = function() {
            Y.log('ac.dispatch() will soon be deprecated to discourage' +
                ' usage from within controllers. If you want to dispatch' +
                ' a command from within an ActionContext addon, please use' +
                ' ac._dispatch().', 'warn', NAME);
            self._dispatch.apply(self, arguments);
        };

        // TODO: should rework to be 'getAppConfig()' and 'getAppRoutes()' and
        // not property access through a hash.
        this.app = {
            config: store.getAppConfig(this.context, 'application'),
            routes: store.getRoutes(this.context)
        };

        // this is where the addons list is injected onto the action
        // context...yay!
        attachActionContextAddons(Y.mojito.addons.ac, command, adapter, this);

        // There is only one addon that requires the store so check for it here.
        // TODO: how can we generalize this so it's not hard-coded to only the
        // deploy add-on. Oh, and note we don't make sure that setStore is a
        // callable function ;).
        if (this.deploy) {
            this.deploy.setStore(store);
        }

        Y.log('ActionContext created for "' + (instance.id || '@' +
            instance.type) + '/' + command.action + '"', 'mojito', NAME);

        // Grab the action here as me may change it
        actionFunction = command.action;

        // Check if the controller has the requested action
        if (!Y.Lang.isFunction(controller[actionFunction])) {
            // If the action is not found try the '__call' function
            if (Y.Lang.isFunction(controller.__call)) {
                actionFunction = '__call';
            } else {
                // If there is still no joy then die
                error = new Error("No method '" + command.action +
                    "' on controller type '" + instance.type + "'");
                error.code = 404;
                throw error;
            }
        }

        // Time marker
        Y.mojito.perf.mark('mojito', 'core_action_start[' + instance.type +
            ':' + command.action + ']', 'Calling the Mojit "' + instance.type +
            '" with action "' + command.action + '"');

        Y.log('action context created, executing action "' + actionFunction +
            '"', 'mojito', 'qeperf');

        controller[actionFunction](this);
    }

    Y.namespace('mojito').ActionContext = ActionContext;

}, '0.1.0', {requires: [
    // following are ACPs are always available
    'mojito-config-addon',
    'mojito-output-adapter-addon',
    'mojito-url-addon',
    'mojito-assets-addon',
    'mojito-cookie-addon',
    'mojito-params-addon',
    'mojito-composite-addon'
]});
