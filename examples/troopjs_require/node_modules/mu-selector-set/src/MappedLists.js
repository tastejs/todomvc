(function(global) {
    'use strict';

    /* istanbul ignore next */
    if (typeof define === 'function' && define.amd) {
        define(factory);
    } else if (typeof exports === 'object') {
        module.exports = factory();
    } else {
        throw Error("no module loader found");
    }

    function factory() {

        /**
         * A simple construct to manage lists by keys. Much like a hash map
         * with key-value pairs, this map has key-list pairs.
         * @constructor
         */
        function MappedLists() {
            this.lists = {};
        }

        /**
         * Add data to the list in `key`
         * @param key The key of the list
         * @param data Data to add
         * @returns {MappedLists}
         */
        MappedLists.prototype.add = function(key, data) {
            key += " ";
            this.lists[key] = this.lists[key] || [];
            this.lists[key].push(data);
            return this;
        };

        /**
         * Remove data from the list in `key`
         * @param key The key of the list
         * @param data Data to add
         * @param {Function} comp custom comparator to determine which items to remove
         * @returns {MappedLists}
         */
        MappedLists.prototype.remove = function(key, data, comp) {
            key += " ";
            comp = comp || eqComp;
            var i, list = this.lists[key];
            if (!list) return this;
            if (!data){
                delete this.lists[key];
                return this;
            }
            i = list.length;
            while(i--) if (comp(data, list[i])) list.splice(i, 1);
            return this;
        };

        /**
         * Get the list associated with 'key', or an empty list
         * if not found.
         * @param key
         * @returns {Array}
         */
        MappedLists.prototype.get = function(key) {
            key += " ";
            if (!this.lists[key]) this.lists[key] = [];
            return this.lists[key];
        };

        return MappedLists;
    }

    function eqComp(o1, o2){
        return o1 === o2;
    }
}(this));
