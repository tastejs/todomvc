/*global define */
define([
    'sandbox!main'
], function (
    sandbox
) {
    'use strict';

    return function () {
        var // imports
            observable = sandbox.mvvm.observable,
            // properties
            todoItems = observable(),
            todoInput = observable();

        return {
            todoItems: todoItems,
            todoInput: todoInput
        };
    };
});
