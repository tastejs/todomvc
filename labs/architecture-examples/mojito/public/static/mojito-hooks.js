/*
 * Copyright (c) 2011-2012, Yahoo! Inc.  All rights reserved.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */


/*jslint anon:true*/
/*global YUI*/


/**
 * The hook system provides a way for application or add on developers to access the inner working of mojito.
 * There are two steps to using an hook. First, an addon needs to register an interest in a hook by calling
 * registerHook with the name of the hook and a callback function. The second step involves enabling a hook
 * your addon to recieve hooks. You need to call the enableHookGroup with the name of your addon.
 *
 * @module MojitoHooks
 */


YUI.add('mojito-hooks', function (Y, NAME) {

    'use strict';

    var mapping = {};

    Y.mojito.hooks = {

        /**
         * Shim for the hooks trigger mechanism. Under normal conditions
         * the shim will do nothing, but if there is at least one hook
         * registered, and enabled, it will try to proces the hook.
         * @method hook
         * @param {String} name The name of the hook.
         * @param {Object} handler A placeholder for a collection of
         * hooks enabled during the runtime. Usually req.hook or
         * adapter.hook object.
         * @param {} hook specific data
         *
         * Example:
         * <pre>
         * Y.mojito.hooks.hook('test_hook', ctx, ...);
         * </pre>
         */
        hook: function (name, handler) {

            var group;

            if (!handler || !mapping[name]) {
                return;
            }

            Y.log("in hook handler: " + name, 'debug', NAME);

            for (group in mapping[name]) {
                if (mapping[name].hasOwnProperty(group) &&
                        handler.hasOwnProperty(group)) {
                    mapping[name][group].apply(handler[group], Y.Array(arguments, 2));
                }
            }
        },

        /**
         * A Mojito entity can register an interest in a hook. The call context for all groups
         * will be the same for all hooks registered for a group, and it will be new and unique for
         * each request. The params to the call back function are hook specific.
         *
         * @method registerhook
         * @param {String} group the name of the group for the hook
         * @param {String} name the hook name
         * @param {Function} fn the callback function that implements
         * the hook logic.
         *
         * Example:
         * <pre>
         * Y.mojito.hooks.registerHook('test_group', 'test_hook', function (reg, data) {});
         * </pre>
         */
        registerHook: function (group, name, fn) {
            if (!mapping[name]) {
                mapping[name] = {};
            }
            mapping[name][group] = fn;

            Y.log("register group: " + group + ", hook name: " + name, 'debug', NAME);
        },

        /**
         * Enable a group for a request.
         *
         * @method enableHookGroup
         * @param {Object} handler A placeholder for a collection of
         * hooks enabled during the runtime. Usually req.hook or
         * adapter.hook object.
         * @param {String} group The name of the group to enable
         *
         * Example:
         * <pre>
         * Y.mojito.hooks.enableHookGroup(req.hook, 'test_group');
         * </pre>
         */
        enableHookGroup: function (handler, group) {

            Y.log("enable group: " + group, 'debug', NAME);

            // TODO: what is we enable a group that is not defined
            if (!handler[group]) {
                handler[group] = {};
            }
        }

    };

}, '0.1.0', {requires: ['mojito']});
