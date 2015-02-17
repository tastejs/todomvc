/*!
 * CanJS - 2.0.7
 * http://canjs.us/
 * Copyright (c) 2014 Bitovi
 * Wed, 26 Mar 2014 16:12:27 GMT
 * Licensed MIT
 * Includes: CanJS default build
 * Download from: http://canjs.us/
 */
define(["can/util/can"], function (can) {
	// event.js
	// ---------
	// _Basic event wrapper._
	can.addEvent = function (event, fn) {
		var allEvents = this.__bindEvents || (this.__bindEvents = {}),
			eventList = allEvents[event] || (allEvents[event] = []);
		eventList.push({
			handler: fn,
			name: event
		});
		return this;
	};
	// can.listenTo works without knowing how bind works
	// the API was heavily influenced by BackboneJS: 
	// http://backbonejs.org/
	can.listenTo = function (other, event, handler) {
		var idedEvents = this.__listenToEvents;
		if (!idedEvents) {
			idedEvents = this.__listenToEvents = {};
		}
		var otherId = can.cid(other);
		var othersEvents = idedEvents[otherId];
		if (!othersEvents) {
			othersEvents = idedEvents[otherId] = {
				obj: other,
				events: {}
			};
		}
		var eventsEvents = othersEvents.events[event];
		if (!eventsEvents) {
			eventsEvents = othersEvents.events[event] = [];
		}
		eventsEvents.push(handler);
		can.bind.call(other, event, handler);
	};
	can.stopListening = function (other, event, handler) {
		var idedEvents = this.__listenToEvents,
			iterIdedEvents = idedEvents,
			i = 0;
		if (!idedEvents) {
			return this;
		}
		if (other) {
			var othercid = can.cid(other);
			(iterIdedEvents = {})[othercid] = idedEvents[othercid];
			// you might be trying to listen to something that is not there
			if (!idedEvents[othercid]) {
				return this;
			}
		}
		for (var cid in iterIdedEvents) {
			var othersEvents = iterIdedEvents[cid],
				eventsEvents;
			other = idedEvents[cid].obj;
			if (!event) {
				eventsEvents = othersEvents.events;
			} else {
				(eventsEvents = {})[event] = othersEvents.events[event];
			}
			for (var eventName in eventsEvents) {
				var handlers = eventsEvents[eventName] || [];
				i = 0;
				while (i < handlers.length) {
					if (handler && handler === handlers[i] || !handler) {
						can.unbind.call(other, eventName, handlers[i]);
						handlers.splice(i, 1);
					} else {
						i++;
					}
				}
				// no more handlers?
				if (!handlers.length) {
					delete othersEvents.events[eventName];
				}
			}
			if (can.isEmptyObject(othersEvents.events)) {
				delete idedEvents[cid];
			}
		}
		return this;
	};
	can.removeEvent = function (event, fn) {
		if (!this.__bindEvents) {
			return this;
		}
		var events = this.__bindEvents[event] || [],
			i = 0,
			ev, isFunction = typeof fn === 'function';
		while (i < events.length) {
			ev = events[i];
			if (isFunction && ev.handler === fn || !isFunction && ev.cid === fn) {
				events.splice(i, 1);
			} else {
				i++;
			}
		}
		return this;
	};
	can.dispatch = function (event, args) {
		if (!this.__bindEvents) {
			return;
		}
		if (typeof event === 'string') {
			event = {
				type: event
			};
		}
		var eventName = event.type,
			handlers = (this.__bindEvents[eventName] || [])
				.slice(0),
			ev;
		args = [event].concat(args || []);
		for (var i = 0, len = handlers.length; i < len; i++) {
			ev = handlers[i];
			ev.handler.apply(this, args);
		}
	};
	return can;
});