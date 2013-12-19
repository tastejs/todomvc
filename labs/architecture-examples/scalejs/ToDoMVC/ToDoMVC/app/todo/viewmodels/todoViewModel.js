/*global define */
define([
    'sandbox!todo',
    'app/todo/viewmodels/itemViewModel'
], function (
    sandbox,
    itemViewModel
) {
    'use strict';

    return function () {
        var observableArray = sandbox.mvvm.observableArray,
            observable = sandbox.mvvm.observable,
            has = sandbox.object.has,
            computed = sandbox.mvvm.computed,
            //properties
            items = observableArray(),
            newItem = observable(),
            checkAll,
            completedItems;

        function addItem() {
            var item = newItem();
            if (has(item, "trim") && item.trim()) {
                items.push(itemViewModel({ title: item, completed: false }, items));
            }
            newItem("");
        }

        function removeCompletedItems() {
            completedItems().forEach(function (item) {
                item.remove();
            });
        }

        checkAll = computed({
            read: function () {
                return items().all("$.completed()");
            },
            write: function (value) {
                items().forEach(function (item) { item.completed(value); });
            }
        });

        completedItems = computed(function () {
            return items().where("$.completed()").toArray();
        });

        return {
            items: items,
            newItem: newItem,
            addItem: addItem,
            checkAll: checkAll,
            completedItems: completedItems,
            removeCompletedItems: removeCompletedItems
        };
    };
});
