/*global define*/
define([
    'mo/lang',
    'dollar',
    'moui/picker'
], function (_, $, picker) {
	'use strict';

    var UID = '_todoPickerUid',
    
        uid = 0,
        lib = {};

    function exports(elm, opt) {
        elm = $(elm);
        var id = elm[0][UID];
        if (id && lib[id]) {
            return lib[id].set(opt);
        }
        id = elm[0][UID] = ++uid;
        opt = _.mix({
            options: '.todo-option'
        }, opt || {});
        var p = lib[id] = picker(elm, opt);

        p.event.bind('change', function (p) {
            elm.trigger('picker:change', {
                component: p
            });
        });

        return p;
    }

    return exports;

});

