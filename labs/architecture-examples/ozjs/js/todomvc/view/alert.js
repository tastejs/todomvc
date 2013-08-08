/*global define*/
define([
    'mo/lang',
    './actionview'
], function (_, actionView) {
	'use strict';

    function exports(text, opt) {
        actionView('todoAlert', _.mix({
            title: '提示',
            content: text || '',
            cancelText: '关闭',
            multiselect: false
        }, opt)).open();
    }

    return exports;

});

