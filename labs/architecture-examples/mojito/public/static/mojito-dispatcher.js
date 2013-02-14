/*
 * Copyright (c) 2011-2013, Yahoo! Inc.  All rights reserved.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */

/*jslint anon:true, nomen:true*/
/*global YUI*/


/**
 * This object is responsible for running mojits.
 * @class MojitoDispatcher
 * @static
 * @public
 */
YUI.add('mojito-dispatcher', function (Y, NAME) {

    'use strict';

    // on the server side, controllers are stateless, but on
    // the client, things are different, we can cache them by
    // instanceId to re-use them when possible.
    var _cacheInstances = {},
        _cacheControllers = {};

    Y.namespace('mojito').Dispatcher = {

        /**
         * Initializes the dispatcher instance.
         * @method init
         * @public
         * @param {Y.mojito.ResourceStore} resourceStore the store to use.
         * @param {Y.mojito.TunnelClient} rpcTunnel optional tunnel client for RPC calls
         * @return {Y.mojito.Dispatcher}
         */
        init: function (resourceStore, rpcTunnel) {

            if (!resourceStore) {
                throw new Error(
                    'Mojito cannot instantiate without a resource store.'
                );
            }

            // Cache parameters as instance variables for the dispatch() call to
            // reference.
            this.store = resourceStore;
            this.tunnel = rpcTunnel;

            Y.log('Dispatcher created', 'debug', NAME);

            return this;
        },

        /**
         * Attaches requirements to dispatch the current mojit when
         * position. This is usually needed when running in the
         * client side and loading mojits on demand.
         * @method _useController
         * @protected
         * @param {object} command the command to dispatch
         * @param {OutputAdapter} adapter the output adapter
         */
        _useController: function (command, adapter) {
            var my = this,
                controllers = Y.mojito.controllers,
                instance = command.instance;

            // TODO: part of the optimization here can be to
            // avoid calling use when the controller already exists.

            // use controller's yui module name to attach
            // the controller to Y ondemand
            Y.use(instance.controller, function () {
                if (controllers[instance.controller]) {
                    // continue with the workflow
                    my._createActionContext(command, adapter);
                } else {
                    // the controller was not found, we should halt
                    adapter.error(new Error('Invalid controller name [' +
                        instance.controller + '] for mojit [' +
                        instance.type + '].'));
                }
            });
        },

        /**
         * Create AC object for a particular controller.
         * @method _createActionContext
         * @protected
         * @param {object} command the command to dispatch
         * @param {OutputAdapter} adapter the output adapter
         */
        _createActionContext: function (command, adapter) {
            var ac;

            // HookSystem::StartBlock
            Y.mojito.hooks.hook('dispatchCreateAction', adapter.hook, 'start', command);
            // HookSystem::EndBlock

            // the controller is not stateless on the client, we
            // store it for re-use.
            // TODO: we need to find a way to clean this for apps
            // that attent to create and destroy mojits from the page
            // but maybe we can just wait for the YAF refactor.
            if (!_cacheControllers[command.instance.instanceId]) {
                _cacheControllers[command.instance.instanceId] =
                    Y.mojito.util.heir(Y.mojito.controllers[command.instance.controller]);
            }

            // Note that creation of an ActionContext current causes
            // immediate invocation of the dispatch() call.
            try {
                ac = new Y.mojito.ActionContext({
                    command: command,
                    controller: _cacheControllers[command.instance.instanceId],
                    dispatcher: this,         // NOTE passing dispatcher.
                    adapter: adapter,
                    store: this.store
                });
            } catch (e) {
                Y.log('Error from dispatch on instance \'' +
                    (command.instance.base || '@' + command.instance.type) +
                    '\':', 'error', NAME);
                Y.log(e.message, 'error', NAME);
                Y.log(e.stack, 'error', NAME);
                adapter.error(e);
            }
            // HookSystem::StartBlock
            Y.mojito.hooks.hook('dispatchCreateAction', adapter.hook, 'end', command);
            // HookSystem::EndBlock
        },

        /**
         * Executes a command in a remote runtime if possible.
         * @method rpc
         * @public
         * @param {object} command the command to dispatch
         * @param {OutputAdapter} adapter the output adapter
         */
        rpc: function (command, adapter) {
            if (this.tunnel) {

                // this prevents the server from trying to RPC itself
                // FUTURE:  might be a better place to do this
                command.rpc = false;

                Y.log('Dispatching instance "' + (command.instance.base || '@' +
                    command.instance.type) + '" through RPC tunnel.', 'info', NAME);
                this.tunnel.rpc(command, adapter);

            } else {

                adapter.error(new Error('RPC tunnel is not available in the [' +
                    command.context.runtime + '] runtime.'));

            }
        },

        /**
         * Dispatch a command in the current runtime, or fallback
         * to a remote runtime when posible.
         * @method dispatch
         * @public
         * @param {object} command the command to dispatch
         * @param {OutputAdapter} adapter the output adapter
         */
        dispatch: function (command, adapter) {

            var my = this,
                store = this.store;

            // HookSystem::StartBlock
            Y.mojito.hooks.hook('dispatch', adapter.hook, 'start', command);
            // HookSystem::EndBlock

            store.validateContext(command.context);

            if (command.rpc) {
                Y.log('Command with rpc flag, dispatching through RPC tunnel',
                    'info', NAME);
                this.rpc(command, adapter);
                return;
            }

            if (command.instance.instanceId && _cacheInstances[command.instance.instanceId]) {
                Y.log('Re-using instance with instanceId=' +
                    command.instance.instanceId, 'info', NAME);
                command.instance = _cacheInstances[command.instance.instanceId];
                this._useController(command, adapter);
                return;
            }

            // if no rpc flag and no instance cached, we try to
            // expand the instance before creating the ActionContext.
            store.expandInstance(command.instance, command.context,
                function (err, instance) {

                    // HookSystem::StartBlock
                    Y.mojito.hooks.hook('dispatch', adapter.hook, 'end', command);
                    // HookSystem::EndBlock

                    if (err || !instance || !instance.controller) {

                        // error expanding the instance, potentially
                        // a remote instance that can't be expanded in the
                        // current runtime and should be dispatched through RPC
                        Y.log('Cannot expand instance "' + (command.instance.base || '@' +
                            command.instance.type) + '". Trying with the tunnel in case ' +
                            'it is a remote mojit.', 'info', NAME);
                        if (err) {
                            // logging the error
                            Y.log(err, 'warn', NAME);
                        }

                        my.rpc(command, adapter);
                        return;

                    }

                    // the instance is not stateless on the client, we
                    // store it for re-use.
                    // TODO: we need to find a way to clean this for apps
                    // that attent to create and destroy mojits from the page
                    // but maybe we can just wait for the YAF refactor.
                    _cacheInstances[instance.instanceId] = instance;

                    // We replace the given instance with the expanded instance.
                    command.instance = instance;

                    // requiring the controller and its dependencies
                    // before dispatching AC
                    my._useController(command, adapter);

                });
        }

    };

}, '0.1.0', {requires: [
    'mojito-action-context',
    'mojito-util',
    'mojito-hooks'
]});
