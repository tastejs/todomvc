/*
 * Copyright (c) 2011-2013, Yahoo! Inc.  All rights reserved.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */


/*jslint anon:true, sloppy:true, nomen:true*/
/*global YUI,MOJITO_INIT*/


YUI.add('mojito-perf', function(Y, NAME) {

    if (!YUI._mojito) {
        YUI._mojito = {};
    }

    if (!YUI._mojito._perf) {
        YUI._mojito._perf = {};
        YUI._mojito._perf.mojito = {};
        YUI._mojito._perf.mojito.core = {};
        YUI._mojito._perf.mojito.core.msg = 'Framework start time';
        YUI._mojito._perf.mojito.core.time =
            typeof MOJITO_INIT !== 'undefined' ?
                    MOJITO_INIT :
                    new Date().getTime();
    }

    var store = YUI._mojito._perf,
        perfEnabled = false,
        perf;

    function print(group, label) {
        Y.log(group + ':' + label + ' ' +
            (store[group][label].time - store.mojito.core.time) +
            'ms', 'mojito', NAME);
    }

    function timestamp() {
        return new Date().getTime();
    }

    perf = {

        mark: function(group, label, msg) {

            if (!perfEnabled) { // Global prod flag
                return;
            }

            if (!group || !label) {
                return;
            }

            if (!store[group]) {
                store[group] = {};
            }

            if (!msg) {
                msg = '';
            }

            store[group][label] = {};
            store[group][label].msg = msg;
            store[group][label].time = timestamp();

            print(group, label);
        },


        dump: function() {

            var group,
                label;

            //MOJITO_INIT;

            for (group in store) {
                if (store.hasOwnProperty(group)) {
                    for (label in store[group]) {
                        if (store[group].hasOwnProperty(label)) {
                            print(group, label);
                        }
                    }
                }
            }
        },

        /**
         * Starts a timeline metric, providing a way to call it done
         * at some point in the future. This is useful to measure the
         * time to execute a process in mojito.
         *
         * @method timeline
         * @param {string} group Event group.
         * @param {string} label Event identifier. Will be combined with group.
         * @param {string} msg Description of the mark.
         * @param {string} id Unique identifier of the mark, usually
         *      the requestId or the yuid().
         * @return {object} represents the timeline object that has a method
         *      called "done" that can be invoked when the process finish.
         **/
        timeline: function(group, label, msg, id) {
            var m = perf.mark(group, label, msg, id);
            return {
                done: function () {
                    if (m) {
                        m.ms = timestamp() - m.time;
                    }
                }
            };
        }
    };

    Y.mojito.hooks.registerHook(NAME, 'adapterBuffer', function(w, adapter) {
        if (w === 'start') {
            this.ab_perf = Y.mojito.perf.timeline('mojito-composite-addon', 'child', 'the whole child', adapter.id);
        } else {
            this.ab_perf.done();
        }
    });
    Y.mojito.hooks.registerHook(NAME, 'addon', function(w, addOn, cfg) {
        if (w === 'start') {
            this.ad_perf = Y.mojito.perf.timeline('mojito-composite-addon', 'execute', Y.Object.keys(cfg.children).join(','), addOn.ac.command);
        } else {
            this.ad_perf.done();
        }
    });
    Y.mojito.hooks.registerHook(NAME, 'attachActionContext', function(w, command) {
        if (w === 'start') {
            this.acc_perf = Y.mojito.perf.timeline('mojito', 'ac:addons', 'attaching addons to AC object', command);
        } else {
            this.acc_perf.done();
        }
    });
    Y.mojito.hooks.registerHook(NAME, 'actionContext', function(w, ac, opts) {
        if (w === 'start') {
            this.ac_perf = Y.mojito.perf.timeline('mojito', 'ac:init', 'set up AC object', opts.command);
        } else if (w === 'end1') {
            this.ac_perf.done();
            Y.mojito.perf.mark('mojito', 'action:start', 'before the action', opts.command);
            this.ac_perf = Y.mojito.perf.timeline('mojito', 'action:call', 'the initial syncronous part of the action', opts.command);
        } else {
            this.ac_perf.done();
        }
    });
    Y.mojito.hooks.registerHook(NAME, 'actionContextDone', function(w, ac) {
        if (w === 'start') {
            this.acd_perf = Y.mojito.perf.timeline('mojito', 'ac.done', 'time to execute ac.done process', ac.command);
        } else if (w === 'end1') {
            this.acd_perf.done();
        } else {
            this.acd_perf.done();
            Y.mojito.perf.mark('mojito', 'action:stop', 'after the action', ac.command);
        }
    });
    Y.mojito.hooks.registerHook(NAME, 'dispatchCreateAction', function(w, command) {
        if (w === 'start') {
            this.dac_perf = Y.mojito.perf.timeline('mojito', 'ac:ctor', 'create ControllerContext', command);
        } else {
            this.dac_perf.done();
        }
    });
    Y.mojito.hooks.registerHook(NAME, 'dispatch', function(w, command) {
        if (w === 'start') {
            this.dis_perf = Y.mojito.perf.timeline('mojito', 'dispatch:expandInstance', 'gather details about mojit', command);
        } else {
            this.dis_perf.done();
        }
    });
    Y.mojito.hooks.registerHook(NAME, 'mojitoClient', function(w, client) {
        if (w === 'start') {
            Y.mojito.perf.mark('mojito', 'core_client_start');
        } else {
            Y.mojito.perf.mark('mojito',
                'core_client_end', 'Mojito client library loaded');
        }
    });
    Y.mojito.hooks.registerHook(NAME, 'mojitoClientBind', function(w, client) {
        if (w === 'start') {
            Y.mojito.perf.mark('mojito', 'core_client_start');
        } else if (w === 'resume') {
            Y.mojito.perf.mark('mojito', 'core_binders_resume');
        } else {
            Y.mojito.perf.mark('mojito', 'core_binders_end');
        }
    });
    Y.mojito.hooks.registerHook(NAME, 'mojitoClientBindComplete', function(w, client) {
        if (w === 'start') {
            Y.mojito.perf.mark('mojito', 'core_binders_resume');
        } else {
            Y.mojito.perf.mark('mojito', 'core_binders_end');
        }
    });

    Y.namespace('mojito').perf = perf;

}, '0.1.0', {requires: [
    'mojito-hooks'
]});
