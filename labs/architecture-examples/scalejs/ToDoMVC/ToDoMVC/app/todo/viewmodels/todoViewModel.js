/*global define */
define([
    'sandbox!todo'
], function (
    sandbox
) {
    'use strict';

    return function () {
        var observableArray = sandbox.mvvm.observableArray,
            items = observableArray();

        return {
            items: items
        };
    };
});
