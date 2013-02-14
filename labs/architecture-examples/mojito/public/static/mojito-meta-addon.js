/*
 * Copyright (c) 2011-2013, Yahoo! Inc.  All rights reserved.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */


/*jslint anon:true, sloppy:true, nomen:true*/
/*global YUI*/


/**
 * @module ActionContextAddon
 */
YUI.add('mojito-meta-addon', function(Y, NAME) {

    var COMMON = 'common';


    /**
     * <strong>Access point:</strong> <em>ac.meta.*</em>
     * Allows the usage of the "meta" object as a storage device, which can pass
     * data from child mojits up towards parents.
     * @class Meta.common
     */
    function MetaAddon(command, adapter, ac) {
        // this is our instance cache
        this[COMMON] = {};
        this._callback = null;
        this._cbScope = null;
    }


    MetaAddon.prototype = {

        namespace: 'meta',

        /**
         * Stores a keyed value within the meta object of the current mojit
         * execution. You can call this as many times as you like, but
         * if you use the same key, you'll override previous data. Call this
         * within child mojits when you have some data you want to make
         * available for some reason to any parents up your hierarchy.
         * @method store
         * @param {string} key The key used as the index value.
         * @param {object} val The value to store.
         */
        store: function(key, val) {
            this[COMMON][key] = val;
        },


        /**
         * To retrieve stashed data that has been stored by child mojits, call
         * this function and provide a function, which will be called once the
         * children have been dispatched and all their meta data has been
         * merged.
         * @method retrieve
         * @param {function} cb callback will be called with the stored merged
         *     object.
         * @param {object} [optional] scope scope of the callback.
         */
        retrieve: function(cb, scope) {
            this._callback = cb;
            this._cbScope = scope;
        },


        mergeMetaInto: function(meta) {
            var scope = this._cbScope || this;
            if (!meta[COMMON]) {
                meta[COMMON] = this[COMMON];
            } else {
                meta[COMMON] = Y.mojito.util.metaMerge(meta[COMMON],
                        this[COMMON]);
            }
            if (this._callback) {
                this._callback.call(scope, meta[COMMON]);
            }
            return meta;
        }
    };

    Y.namespace('mojito.addons.ac').meta = MetaAddon;

}, '0.1.0', {requires: [
    'mojito-util'
]});
