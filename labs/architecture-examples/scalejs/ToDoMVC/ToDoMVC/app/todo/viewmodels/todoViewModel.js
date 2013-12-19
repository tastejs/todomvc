/*global define,localStorage */
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

        function toItem(itemVM) {
            return {
                title: itemVM.title(),
                completed: itemVM.completed()
            };
        }

        function toItemViewModel(item) {
            return itemViewModel(item, items);
        }

        function addItem() {
            var item = newItem();
            if (has(item, "trim") && item.trim()) {
                items.push(toItemViewModel({ title: item, completed: false }));
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

        if (has(localStorage['todos-scalejs'])) {
            items(JSON.parse(localStorage['todos-scalejs']).map(toItemViewModel));
        }

        computed(function () {
            localStorage['todos-scalejs'] = JSON.stringify(items().map(toItem));
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
