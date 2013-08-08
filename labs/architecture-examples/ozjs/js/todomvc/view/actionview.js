/*global define*/
define([
    'mo/lang',
    'dollar',
    'moui/actionview'
], function (_, $, actionView) {
	'use strict';

    var UID = '_todoActionViewUid',
    
        uid = 0,
        lib = {};

    function exports(elm, opt) {
        var id = elm;
        if (typeof elm === 'object') {
            elm = $(elm);
            id = elm[0][UID];
        } else {
            elm = false;
        }
        if (id && lib[id]) {
            return lib[id].set(opt);
        }
        if (elm) {
            id = elm[0][UID] = ++uid;
        }
        opt = opt || {};
        opt.className = 'todo-actionview';
        var view = lib[id] = actionView(opt);
        view.event.bind('prepareOpen', function (view) {
            exports.current = view;
        }).bind('cancelOpen', function () {
            exports.current = null;
        }).bind('close', function () {
            exports.current = null;
            view.event.unbind('confirmOnThis');
        }).bind('confirm', function (view) {
            view.event.fire('confirmOnThis', [view]);
        });
        return view;
    }

    return exports;

});

