/*
 * Copyright (c) 2011-2013, Yahoo! Inc.  All rights reserved.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */


/*jslint anon:true, sloppy:true*/
/*global YUI*/


/**
 * The <strong>Action Context</strong> uses a mechanism called
 * <strong><em>Addons</em></strong> to provide functionality that lives both on
 * the server and/or client. Each Addon provides additional functions through a
 * namespace that is attached directly to the ac argument available in every
 * controller function.
 * @module ActionContextAddon
 */


/**
 * @module ActionContextAddon
 */
YUI.add('mojito-analytics-addon', function(Y, NAME) {

    var ANALYTICS = 'analytics';

    /**
     * <strong>Access point:</strong> <em>ac.analytics.*</em>
     * Provides an easy way to stash analytics information within child mojits
     * and retrieve them within parent after the children have been executed.
     * Data handled by this addon, however, cannot be used to augment the
     * normal data flow. IE: you cannot retrieve analytics data and then call
     * ac.done().
     * @class Analytics.common
     */
    function AnalyticsAddon(command, adapter, ac) {
        this.ac = ac;
        // our personal analytics cache
        this[ANALYTICS] = {};
        // so following addons can override (see comment below)
        this.mergeFunction = Y.mojito.util.metaMerge;
    }


    AnalyticsAddon.prototype = {

        namespace: 'analytics',

        /**
         * Allows a way for addons mixed in after this one to set an alternate
         * data merge function when analytics from multiple children are
         * combined. The default merge function is the same one used internally
         * by Mojito to merge meta data, and will be sufficient for most use
         * cases.
         * @method setmergeFunction
         * @param {function} fn user-defined merge function, which should accept
         * two objects, the first is "to", and the second is "from". this
         * function should return the merged object.
         */
        setMergeFunction: function(fn) {
            this.mergeFunction = fn;
        },


        /**
         * Store an analytic value. This function can be called multiple times
         * within a mojit, and uses a merging function to combine objects.
         * @method store
         * @param {object} val An object bag full of whatever you wish.
         */
        store: function(val) {
            // if you don't like using our internal meta merge function,
            // you can supply an AC addon that requires this one, and call
            // ac.analytics.setMergeFunction(fn) within the initializer.
            this[ANALYTICS] = this.mergeFunction(this[ANALYTICS], val);
            this.ac.meta.store(ANALYTICS, this[ANALYTICS]);
        },


        /**
         * To retrieve analytics data that has been stored by child mojits, call
         * this function and provide a function, which will be called once the
         * children have been dispatched and all their analytics data has been
         * merged.
         * @method retrieve
         * @param {function} cb callback invoked with the analytics object.
         * @param {object} [optional] scope scope of the callback.
         */
        retrieve: function(cb, scope) {
            // mostly just deferring to the meta addon, but specifying that we
            // only want the ANALYTICS stuff off the meta
            this.ac.meta.retrieve(function(metaStash) {
                cb.call(this, metaStash[ANALYTICS]);
            }, scope);
        }
    };

    Y.namespace('mojito.addons.ac').analytics = AnalyticsAddon;

}, '0.1.0', {requires: [
    'mojito',
    'mojito-util',
    'mojito-meta-addon'
]});
