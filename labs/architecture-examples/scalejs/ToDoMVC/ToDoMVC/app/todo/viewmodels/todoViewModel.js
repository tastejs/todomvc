/*global define */
define([
    'sandbox!todo'
], function (
    sandbox
) {
    'use strict';

    return function () {
        var observable = sandbox.mvvm.observable,
            text = observable();

        return {
            text: text
        };
    };
});
