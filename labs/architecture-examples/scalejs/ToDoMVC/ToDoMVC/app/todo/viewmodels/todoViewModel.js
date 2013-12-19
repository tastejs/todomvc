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
            //properties
            items = observableArray(),
            newItem = observable();

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

        return {
            items: items,
            newItem: newItem,
            addItem: addItem
        };
    };
});
