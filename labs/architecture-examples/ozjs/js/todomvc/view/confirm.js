/*global define*/
define([
    'mo/lang',
    './actionview'
], function (_, actionView) {
	'use strict';

    function exports(text, cb, opt) {
        var view = actionView('todoAlert', _.mix({
            title: '提示',
            content: text || '',
            confirmText: '确认',
            cancelText: '取消',
            multiselect: true
        }, opt)).open();
        view.event.bind('confirmOnThis', cb);
    }

    return exports;

});

