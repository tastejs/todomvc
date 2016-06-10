/*!
 * CanJS - 2.0.7
 * http://canjs.us/
 * Copyright (c) 2014 Bitovi
 * Wed, 26 Mar 2014 16:12:27 GMT
 * Licensed MIT
 * Includes: CanJS default build
 * Download from: http://canjs.us/
 */
define(["jquery", "can/util/can", "can/util/array/each", "can/util/inserted", "can/util/event"], function ($, can) {
	var isBindableElement = function (node) {
		// In IE8 window.window !== window.window, so we allow == here.
		/*jshint eqeqeq:false*/
		return ( node.nodeName && (node.nodeType === 1 || node.nodeType === 9) )|| node == window;
	};
	// _jQuery node list._
	$.extend(can, $, {
		trigger: function (obj, event, args) {
			if (isBindableElement( obj ) ) {
				$.event.trigger(event, args, obj, true);
			} else if (obj.trigger) {
				obj.trigger(event, args);
			} else {
				if (typeof event === 'string') {
					event = {
						type: event
					};
				}
				event.target = event.target || obj;
				can.dispatch.call(obj, event, args);
			}
		},
		addEvent: can.addEvent,
		removeEvent: can.removeEvent,
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
		each: can.each,
		bind: function (ev, cb) {
			// If we can bind to it...
			if (this.bind && this.bind !== can.bind) {
				this.bind(ev, cb);
			} else if (isBindableElement(this)) {
				$.event.add(this, ev, cb);
			} else {
				// Make it bind-able...
				can.addEvent.call(this, ev, cb);
			}
			return this;
		},
		unbind: function (ev, cb) {
			// If we can bind to it...
			if (this.unbind && this.unbind !== can.unbind) {
				this.unbind(ev, cb);
			} else if (isBindableElement(this)) {
				$.event.remove(this, ev, cb);
			} else {
				// Make it bind-able...
				can.removeEvent.call(this, ev, cb);
			}
			return this;
		},
		delegate: function (selector, ev, cb) {
			if (this.delegate) {
				this.delegate(selector, ev, cb);
			} else if (isBindableElement(this)) {
				$(this)
					.delegate(selector, ev, cb);
			} else {
				// make it bind-able ...
			}
			return this;
		},
		undelegate: function (selector, ev, cb) {
			if (this.undelegate) {
				this.undelegate(selector, ev, cb);
			} else if (isBindableElement(this)) {
				$(this)
					.undelegate(selector, ev, cb);
			} else {
				// make it bind-able ...

			}
			return this;
		},
		proxy: function (fn, context) {
			return function () {
				return fn.apply(context, arguments);
			};
		}
	});
	// Wrap binding functions.
	/*$.each(['bind','unbind','undelegate','delegate'],function(i,func){
		can[func] = function(){
			var t = this[func] ? this : $([this]);
			t[func].apply(t, arguments);
			return this;
		};
	});*/
	// Aliases
	can.on = can.bind;
	can.off = can.unbind;
	// Wrap modifier functions.
	$.each([
		'append',
		'filter',
		'addClass',
		'remove',
		'data',
		'get',
		'has'
	], function (i, name) {
		can[name] = function (wrapped) {
			return wrapped[name].apply(wrapped, can.makeArray(arguments)
				.slice(1));
		};
	});
	// Memory safe destruction.
	var oldClean = $.cleanData;
	$.cleanData = function (elems) {
		$.each(elems, function (i, elem) {
			if (elem) {
				can.trigger(elem, 'removed', [], false);
			}
		});
		oldClean(elems);
	};
	var oldDomManip = $.fn.domManip,
		cbIndex;
	// feature detect which domManip we are using
	$.fn.domManip = function (args, cb1, cb2) {
		for (var i = 1; i < arguments.length; i++) {
			if (typeof arguments[i] === 'function') {
				cbIndex = i;
				break;
			}
		}
		return oldDomManip.apply(this, arguments);
	};
	$(document.createElement('div'))
		.append(document.createElement('div'));
	$.fn.domManip = cbIndex === 2 ? function (args, table, callback) {
		return oldDomManip.call(this, args, table, function (elem) {
			var elems = elem.nodeType === 11 ? can.makeArray(elem.childNodes) : null;
			var ret = callback.apply(this, arguments);
			can.inserted(elems ? elems : [elem]);
			return ret;
		});
	} : function (args, callback) {
		return oldDomManip.call(this, args, function (elem) {
			var elems = elem.nodeType === 11 ? can.makeArray(elem.childNodes) : null;
			var ret = callback.apply(this, arguments);
			can.inserted(elems ? elems : [elem]);
			return ret;
		});
	};
	$.event.special.inserted = {};
	$.event.special.removed = {};
	return can;
});