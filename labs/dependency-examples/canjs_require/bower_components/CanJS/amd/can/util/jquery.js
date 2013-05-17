/*!
* CanJS - 1.1.5 (2013-03-27)
* http://canjs.us/
* Copyright (c) 2013 Bitovi
* Licensed MIT
*/
define(['jquery', 'can/util/can', 'can/util/array/each'], function ($, can) {
    // _jQuery node list._
    $.extend(can, $, {
        trigger: function (obj, event, args) {
            if (obj.trigger) {
                obj.trigger(event, args);
            } else {
                $.event.trigger(event, args, obj, true);
            }
        },
        addEvent: function (ev, cb) {
            $([this]).bind(ev, cb);
            return this;
        },
        removeEvent: function (ev, cb) {
            $([this]).unbind(ev, cb);
            return this;
        },
        // jquery caches fragments, we always needs a new one
        buildFragment: function (elems, context) {
            var oldFragment = $.buildFragment,
                ret;

            elems = [elems];
            // Set context per 1.8 logic
            context = context || document;
            context = !context.nodeType && context[0] || context;
            context = context.ownerDocument || context;

            ret = oldFragment.call(jQuery, elems, context);

            return ret.cacheable ? $.clone(ret.fragment) : ret.fragment || ret;
        },
        $: $,
        each: can.each
    });

    // Wrap binding functions.
    $.each(['bind', 'unbind', 'undelegate', 'delegate'], function (i, func) {
        can[func] = function () {
            var t = this[func] ? this : $([this]);
            t[func].apply(t, arguments);
            return this;
        };
    });

    // Wrap modifier functions.
    $.each(["append", "filter", "addClass", "remove", "data", "get"], function (i, name) {
        can[name] = function (wrapped) {
            return wrapped[name].apply(wrapped, can.makeArray(arguments).slice(1));
        };
    });

    // Memory safe destruction.
    var oldClean = $.cleanData;

    $.cleanData = function (elems) {
        $.each(elems, function (i, elem) {
            if (elem) {
                can.trigger(elem, "destroyed", [], false);
            }
        });
        oldClean(elems);
    };

    return can;
});