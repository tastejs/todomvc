(function (define, global, document) {
define(function (require) {
"use strict";

	var has, doWatchNode, fireSimpleEvent, allUnwatches;

	has = require('./has');

	allUnwatches = [];

	/**
	 * Register a callback to be invoked when events with the supplied name
	 * occur on the supplied node.
	 * @param node {Node} DomNode on which to listen for events
	 * @param name {String} name of the event, e.g. "click"
	 * @param callback {Function} event handler function to invoke
	 */
	function watchNode(node, name, callback) {
		return doWatchNode(node, name, callback);
	}

	if (has('dom-addeventlistener')) {
		// standard way
		doWatchNode = function (node, name, callback) {
			node.addEventListener(name, callback, false);
			return function () {
				node && node.removeEventListener(name, callback, false);
			}
		};
	}
	else {
		// try IE way
		doWatchNode = function (node, name, callback) {
			var handlerName, unwatch;
			handlerName = 'on' + name;
			node.attachEvent(handlerName, callback);
			unwatch = function () {
				node && node.detachEvent(handlerName, callback);
			};
			// wish there was a way to has("dom-messedup-garbage-colector")
			// we're using inference here, but wth! it's IE 6-8
			allUnwatches.push(unwatch);
			return unwatch;
		};
		// oh IE, you pile o' wonder
		// set global unwatcher (only if we're in a browser environment)
		if ('onunload' in global) {
			watchNode(global, 'unload', function () {
				var unwatch;
				while ((unwatch = allUnwatches.pop())) squelchedUnwatch(unwatch);
			});
		}
	}

	if(has('dom-createevent')) {
		fireSimpleEvent = function (node, type, bubbles, data) {
			// don't bubble since most form events don't anyways
			var evt;

			evt = document.createEvent('HTMLEvents');
			evt.initEvent(type, bubbles, true);
			evt.data = data;
			node.dispatchEvent(evt);
		}
	}
	else {
		fireSimpleEvent = function (node, type, bubbles, data) {
			var evt;

			evt = document.createEventObject();
			evt.data = data;
			// FIXME: This does not work for custom event types. Need to use ondataavailable
			// or some other standard event type for IE and manage the handlers ourselves.
			node.fireEvent('on' + type, evt);
		}
	}

	function squelchedUnwatch (unwatch) {
		try { unwatch(); } catch (ex) {}
	}

	return {
		watchNode: watchNode,
		fireSimpleEvent: fireSimpleEvent
	};

});
}(
	typeof define == 'function'
		? define
		: function (factory) { module.exports = factory(require); },
	this,
	this.document
));