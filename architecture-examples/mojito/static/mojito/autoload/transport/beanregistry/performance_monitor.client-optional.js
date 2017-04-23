/*
 * Copyright (c) 2011-2012, Yahoo! Inc.  All rights reserved.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */


/*jslint anon:true, sloppy:true*/
/*global YUI*/


YUI.add('bean-performance-watcher', function(Y) {

    var NAME = 'Bean Performance Monitor',
        b = Y.Dali.beanRegistry,
        BEAN_REGISTRY_STARTED = 'rstart',
        REGISTRATION_COMPLETE = 'rdone',
        REINITIALIZING_BEAN = 'reinits',
        REINITIALIZED_BEAN = 'reinitd',
        INITIALIZATION_COMPLETE = 'initd',
        INJECTION_COMPLETE = 'injd',
        t = {},
        PerformanceMonitor;


    PerformanceMonitor = function() {

        function watcher(e) {
            var key = e.type.split(':')[1],
                stamp = new Date().getTime();

            if (key === REINITIALIZING_BEAN) {
                t[key] = {};
                t[key][e.bean] = stamp;
            } else {
                t[key] = stamp;
            }
            if (key === REINITIALIZED_BEAN) {
                delete t[REINITIALIZING_BEAN][e.bean];
            }
        }


        function countObjectProperties(o) {
            var count = 0,
                k;

            for (k in o) {
                if (o.hasOwnProperty(k)) {
                    count += 1;
                }
            }
            return count;
        }


        function report() {
            var total = t[INJECTION_COMPLETE] - t[BEAN_REGISTRY_STARTED],
                registration = t[REGISTRATION_COMPLETE] -
                    t[BEAN_REGISTRY_STARTED],
                initialization = t[INITIALIZATION_COMPLETE] -
                    t[REGISTRATION_COMPLETE],
                injection = t[INJECTION_COMPLETE] -
                    t[INITIALIZATION_COMPLETE],
                numBeans;
            // Y.log('Registration time: ' + registration + ' ms',
            //     'info', NAME);
            // Y.log('Initialization time: ' + initialization + ' ms',
            //     'info', NAME);
            // Y.log('Injection time: ' + injection + ' ms (' +
            //     (injection / b._getNumberOfInjections()) +
            //     ' per injection for ' + b._getNumberOfInjections() +
            //     ' injections)', 'info', NAME);
            // Y.log('== > Total bean startup time: ' + total + ' ms',
            //     'info', '***' + NAME + '***');
            t.total = total;
            numBeans = countObjectProperties(b.getBeans());
            // Y.log((total / numBeans) + 'ms per bean for ' + numBeans +
            //     ' beans', 'info', NAME);
        }

        watcher({
            type: 'blah:' + BEAN_REGISTRY_STARTED
        });

        b.on(REGISTRATION_COMPLETE, watcher);
        b.on(INITIALIZATION_COMPLETE, watcher);
        b.on(INJECTION_COMPLETE, watcher);
        b.on(REINITIALIZING_BEAN, watcher);
        b.on(REINITIALIZED_BEAN, watcher);
        b.on(INJECTION_COMPLETE, report);

        return {

            getTime: function(name) {
                return t[name];
            },

            destroy: function() {
                b.detach();
            }
        };
    };

    PerformanceMonitor.NAME = NAME;

    Y.namespace('Dali.beans');
    Y.Dali.beans.PerformanceMonitor = PerformanceMonitor;

}, '1.6.3', {requires: [
    'breg'
]});
