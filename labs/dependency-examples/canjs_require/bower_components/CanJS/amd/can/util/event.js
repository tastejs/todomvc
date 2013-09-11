/*!
* CanJS - 1.1.5 (2013-03-27)
* http://canjs.us/
* Copyright (c) 2013 Bitovi
* Licensed MIT
*/
define(['can/util/can'], function (can) {

    // event.js
    // ---------
    // _Basic event wrapper._
    can.addEvent = function (event, fn) {
        if (!this.__bindEvents) {
            this.__bindEvents = {};
        }
        var eventName = event.split(".")[0];

        if (!this.__bindEvents[eventName]) {
            this.__bindEvents[eventName] = [];
        }
        this.__bindEvents[eventName].push({
            handler: fn,
            name: event
        });
        return this;
    };
    can.removeEvent = function (event, fn) {
        if (!this.__bindEvents) {
            return;
        }
        var i = 0,
            events = this.__bindEvents[event.split(".")[0]],
            ev;
        while (i < events.length) {
            ev = events[i]
            if ((fn && ev.handler === fn) || (!fn && ev.name === event)) {
                events.splice(i, 1);
            } else {
                i++;
            }
        }
        return this;
    };
    can.dispatch = function (event) {
        if (!this.__bindEvents) {
            return;
        }

        var eventName = event.type.split(".")[0],
            handlers = (this.__bindEvents[eventName] || []).slice(0),
            self = this,
            args = [event].concat(event.data || []);

        can.each(handlers, function (ev) {
            event.data = args.slice(1);
            ev.handler.apply(self, args);
        });
    }

    return can;

});