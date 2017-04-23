/*
 * Copyright (c) 2011-2012, Yahoo! Inc.  All rights reserved.
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
        perfEnabled = false;


    function print(group, label) {
        Y.log(group + ':' + label + ' ' +
            (store[group][label].time - store.mojito.core.time) +
            'ms', 'mojito', NAME);
    }


    Y.namespace('mojito').perf = {

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
            store[group][label].time = new Date().getTime();

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
        }
    };
});
