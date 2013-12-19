/*global define */
define([
    'sandbox!todo'
], function (
    sandbox
) {
    'use strict';

    return function (item) {
        var observable = sandbox.mvvm.observable,
            //properties
            title = observable(item.title),
            completed = observable(item.completed),
            editMode = observable(false);

        function beginEdit() {
            editMode(true);
        }

        function endEdit() {
            var newTitle = title().trim();
            if (newTitle) {
                title(newTitle);
                editMode(false);
            } else {
                //we need to remove the item
                //if the title is an empty string
            }
        }

        return {
            title: title,
            completed: completed,
            editMode: editMode,
            beginEdit: beginEdit,
            endEdit: endEdit
        };
    };
});
