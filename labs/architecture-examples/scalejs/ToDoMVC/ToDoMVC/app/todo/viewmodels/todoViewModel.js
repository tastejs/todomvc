/*global define */
define([
    'sandbox!todo'
], function (
    sandbox
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
            checkAll;

        function addItem() {
            var item = newItem();
            if (has(item, "trim") && item.trim()) {
                items.push({
                    title: item.trim(),
                    completed: observable(false)
                });
            }
            newItem("");
        }

        checkAll = computed({
            read: function () {
                return items().all("$.completed()");
            },
            write: function (value) {
                items().forEach(function (item) { item.completed(value); });
            }
        });

        return {
            items: items,
            newItem: newItem,
            addItem: addItem,
            checkAll: checkAll
        };
    };
});
