/*global define*/
define([
    'mo/lang',
    'nerv',
    './item'
], function (_, nerv, itemModel) {
    'use strict';

    return nerv.collection({

        init: function () {
            this._completed = false;
        },

        addItem: function (item) {
            item = itemModel(item);
            this.add(item);
        },

        removeItem: function (iid) {
            this.remove(this.findItemById(iid));
        },

        removeCompleted: function () {
            this.set(function (listAgent) {
                var newlist = [];
                listAgent.forEach(function (item) {
                    if (!item.get('completed')) {
                        this.push(item);
                    }
                }, newlist);
                return newlist;
            }, this);
        },

        findItemById: function (iid) {
            var re = -1;
            this.each(function (item, i) {
                if (item.get('iid') === parseInt(iid, 10)) {
                    re = i;
                    return false;
                }
            }, this);
            return re;
        },

        toggle: function () {
            var completed = this._completed = !this._completed;
            this.set(function (listAgent) {
                listAgent.forEach(function (item) {
                    item.set('completed', completed);
                });
            });
        },

        completedData: function () {
            return this.data().filter(function (item) {
                return item.completed;
            });
        },

        remainingData: function () {
            return this.data().filter(function (item) {
                return !item.completed;
            });
        }

    });

});
