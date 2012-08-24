/*
 * Copyright (c) 2011-2012, Yahoo! Inc.  All rights reserved.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */


/*jslint anon:true, sloppy:true, nomen:true*/
/*global YUI*/


YUI.add('mojito-controller-context', function(Y, NAME) {

    function ControllerContext(opts) {
        this.instance = opts.instance;
        this.dispatch = opts.dispatch;
        this.store = opts.store;
        this.Y = opts.Y;
        this.shareYUIInstance = opts.appShareYUIInstance &&
            this.instance.shareYUIInstance;
        this.init();
    }


    ControllerContext.prototype = {

        init: function() {
            var error,
                // Not really an instance...more like constructor options...see
                // controller.init() call below.
                instance = this.instance,
                controller,
                shareYUIInstance = this.shareYUIInstance,

                // do a shallow merge of app-level and mojit-level configs
                // mojit config properties take precedence
                configApp = this.store.getAppConfig({}, 'application').config,
                configCombo = Y.merge(configApp, instance.config),

                // Y.mojito.controller for legacy, multi-instance.
                // Y.mojito.controllers for shared instance
                c = this.Y.mojito.controller ||
                    this.Y.mojito.controllers[instance.controllerModuleName];

            if (!Y.Lang.isObject(c)) {
                error = new Error('Mojit controller prototype is not an' +
                    ' object! (mojit id: \'' + instance.id + '\')');

                // TODO: change this to a more appropriate error code.
                error.code = 404;
                throw error;
            }

            // we make a controller instance by using the heir() function, this
            // gives us proper function scope within the controller actions
            controller = this.controller = Y.mojito.util.heir(c);

            if (Y.Lang.isFunction(controller.init)) {
                // Use the instance data which isn't really an instance to
                // provide construction parameters for the controller init().
                controller.init(configCombo);
            }

            // mix in any (new) actions (the actions namespace here would be
            // populated by the resource store...but currently unused? Could
            // this be replaced by light inheritance to the controllers here).
            Y.Object.each(this.Y.mojito.actions, function(action, actionName) {
                this.Y.log('mixing action \'' + actionName +
                    '\' into controller...', 'debug', NAME);
                controller[actionName] = function() {
                    action.apply(controller, arguments);
                };
            });

            // stash the models this controller has available to be later
            // attached to the ActionContext
            this.models = {};

            Y.Object.each(this.Y.mojito.models, function(model, modelName) {

                if (!shareYUIInstance || (instance.modelYUIModuleNames &&
                        instance.modelYUIModuleNames[modelName])) {

                    // TODO: Why? There's no particular reason to inherit here.
                    var modelInstance = Y.mojito.util.heir(model);

                    if (Y.Lang.isFunction(modelInstance.init)) {
                        // NOTE that we use the same config here that we use to
                        // config the controller
                        modelInstance.init(configCombo);
                    }
                    this.models[modelName] = modelInstance;
                }
            }, this);
        },


        invoke: function(command, adapter) {

            this.Y.log('controller context invoke() for ' +
                this.instance.instanceId, 'mojito', 'qeperf');

            var instance = this.instance,
                config = command.instance.config,
                // this is the action that will be executed
                action = command.action,
                ac;

            // replace the non-expanded command instance with the proper
            // instance, that was already expanded when the controller context
            // was created

            // TODO: This may not be necessary...we did this in dispatch().
            command.instance = instance;

            // however! we want to use the most recent config, not the cached
            // config, because that can change between action executions!
            command.instance.config = config;

            // if there is no action, make 'index' the default
            // TODO: This may not be necessary...we did this in dispatch().
            if (!command.action) {
                // use instance config for default action or 'index'
                command.action = instance.action || 'index';
            }

            try {
                // Note: ac var is here to appease jslint.
                ac = new this.Y.mojito.ActionContext({
                    command: command,
                    controller: this.controller,
                    models: this.models,
                    dispatch: this.dispatch,
                    adapter: adapter,
                    store: this.store
                });

                // TODO: uncomment once above issue is repaired.
                // ac.invoke(command, adapter);  // do it this way ;)
            } catch (err) {
                if (adapter.error) {
                    adapter.error(err);
                } else {
                    this.Y.log('WARNING!! Uncaught error from dispatch on' +
                        ' instance \'' + (instance.id || '@' + instance.type) +
                        '\'', 'error', NAME);
                    this.Y.log(err.message, 'error', NAME);
                    this.Y.log(err.stack, 'error', NAME);
                }
                // TODO: should we be rethrowing the error here? We log but we
                // don't ensure callers know...but then again dispatch() may
                // need this level of isolation.
            }

            this.Y.mojito.perf.mark('mojito', 'core_dispatch_end[' +
                (instance.id || '@' + instance.type) + ':' + action + ']');
        }
    };

    Y.namespace('mojito').ControllerContext = ControllerContext;

}, '0.1.0', {requires: [
    'mojito-action-context',
    'mojito-util'
]});
