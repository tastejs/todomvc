/** @license MIT License (c) copyright B Cavalier & J Hann */

/*jshint devel: true*/
/*global console:true, setTimeout:true*/

/**
 * This is a drop-in replacement for the when module that sets up automatic
 * debug output for promises created or consumed by when.js.  Use this
 * instead of when to help with debugging.
 *
 * WARNING: This module **should never** be use this in a production environment.
 * It exposes details of the promise
 *
 * In an AMD environment, you can simply change your package mappings:
 *
 * packages: [
 *   // { name: 'when', location: 'path/to/when', main: 'when' }
 *   { name: 'when', location: 'path/to/when', main: 'debug' }
 * ]
 *
 * In a CommonJS environment, you can directly require this module where
 * you would normally require 'when':
 *
 * // var when = require('when');
 * var when = require('when/debug');
 *
 * Or you can temporarily modify the package.js to point main at debug.
 * For example, when/package.json:
 *
 * ...
 * "main": "./debug"
 * ...
 *
 * @author brian@hovercraftstudios.com
 */
(function(define) {
define(function(require) {
	/*global vertx,setTimeout*/
	var when, promiseId, pending, exceptionsToRethrow, own, warn, setTimer, undef;

	when = require('./when');
	promiseId = 0;
	pending = {};
	own = Object.prototype.hasOwnProperty;

	warn = (typeof console !== 'undefined' && typeof console.warn === 'function')
		? function(x) { console.warn(x); }
		: function() {};

	setTimer = typeof vertx === 'object'
		? function (f, ms) { return vertx.setTimer(ms, f); }
		: setTimeout;

	exceptionsToRethrow = {
		RangeError: 1,
		ReferenceError: 1,
		SyntaxError: 1,
		TypeError: 1
	};

	/**
	 * Replacement for when() that sets up debug logging on the
	 * returned promise.
	 */
	function whenDebug(promise, cb, eb, pb) {
		var args = [promise].concat(wrapCallbacks(promise, [cb, eb, pb]));
		return debugPromise(when.apply(null, args), when.resolve(promise));
	}

	/**
	 * Setup debug output handlers for the supplied promise.
	 * @param {Promise} p A trusted (when.js) promise
	 * @param {Promise?} parent promise from which p was created (e.g. via then())
	 * @return {Promise} a new promise that outputs debug info and
	 * has a useful toString
	 */
	function debugPromise(p, parent) {
		var id, origThen, newPromise, logReject;

		if(own.call(p, 'parent')) {
			return p;
		}

		promiseId++;
		id = (parent && 'id' in parent) ? (parent.id + '.' + promiseId) : promiseId;

		origThen = p.then;
		newPromise = beget(p);
		newPromise.id = id;
		newPromise.parent = parent;

		newPromise.toString = function() {
			return toString('Promise', id);
		};

		newPromise.then = function(cb, eb, pb) {
			checkCallbacks(cb, eb, pb);

			if(typeof eb === 'function') {
				var promise = newPromise;
				do {
					promise.handled = true;
				} while((promise = promise.parent) && !promise.handled);
			}

			return debugPromise(origThen.apply(p, wrapCallbacks(newPromise, arguments)), newPromise);
		};

		logReject = function() {
			console.error(newPromise.toString());
		};

		p.then(
			function(val) {
				newPromise.toString = function() {
					return toString('Promise', id, 'resolved', val);
				};
				return val;
			},
			wrapCallback(newPromise, function(err) {
				newPromise.toString = function() {
					return toString('Promise', id, 'REJECTED', err);
				};

				callGlobalHandler('reject', newPromise, err);

				if(!newPromise.handled) {
					logReject();
				}

				throw err;
			})
		);

		return newPromise;
	}

	/**
	 * Replacement for when.defer() that sets up debug logging
	 * on the created Deferred, its resolver, and its promise.
	 * @return {Deferred} a Deferred with debug logging
	 */
	function deferDebug(/* id */) {
		var d, err, status, value, origResolve, origReject, origNotify, origThen, origAlways, id;

		// Delegate to create a Deferred;
		d = when.defer();

		// TODO: Remove in >= 2.1
		// Add a noisy, failing then() to deferred to help people track
		// down leftover deferred.then() calls in 2.0
		try {
			throw new Error('deferred.then was removed, use deferred.promise.then');
		} catch (e) {
			err = e;
		}

		d.then = function deferredThenIsDeprecated() {
			throwUncatchable(err);
		};
		// End Remove 2.1

		status = 'pending';
		value = pending;

		// if no id provided, generate one.  Not sure if this is
		// useful or not.
		id = arguments[arguments.length - 1];
		if(id === undef) {
			id = ++promiseId;
		}

		// Promise and resolver are frozen, so have to delegate
		// in order to setup toString() on promise, resolver,
		// and deferred
		origThen = d.promise.then;
		d.id = id;
		d.promise = debugPromise(d.promise, d);

		origAlways = d.promise.always;
		d.promise.always = deprecated('promise.always', 'promise.ensure', origAlways, d.promise);

		d.resolver = beget(d.resolver);
		d.resolver.toString = function() {
			return toString('Resolver', id, status, value);
		};

		origNotify = d.resolver.notify;
		d.notify = d.resolver.notify = function(update) {
			// Notify global debug handler, if set
			callGlobalHandler('progress', d, update);

			return origNotify(update);
		};

		origResolve = d.resolver.resolve;
		d.resolve = d.resolver.resolve = function(val) {
			value = val;
			status = 'resolving';

			// Notify global debug handler, if set
			callGlobalHandler('resolve', d, val);

			return origResolve.apply(undef, arguments);
		};

		origReject = d.resolver.reject;
		d.reject = d.resolver.reject = function(err) {
			value = err;
			status = 'REJECTING';
			return origReject.apply(undef, arguments);
		};

		d.toString = function() {
			return toString('Deferred', id, status, value);
		};

		// Setup final state change handlers
		origThen(
			function(v) { status = 'resolved'; return v; },
			function(e) { status = 'REJECTED'; return when.reject(e); }
		);

		// Add an id to all directly created promises.  It'd be great
		// to find a way to propagate this id to promise created by .then()
		d.resolver.id = id;

		return d;
	}

	whenDebug.defer = deferDebug;
	whenDebug.isPromise = when.isPromise;

	makeDebugWithHandlers('all', when.all);
	makeDebugWithHandlers('any', when.any);
	makeDebugWithHandlers('some', when.some, 2);

	// For each method we haven't already replaced, replace it with
	// one that sets up debug logging on the returned promise
	for(var p in when) {
		if(when.hasOwnProperty(p) && !(p in whenDebug)) {
			makeDebug(p, when[p]);
		}
	}

	return whenDebug;

	// Wrap result of when[name] in a debug promise
	function makeDebug(name, func) {
		whenDebug[name] = function() {
			return debugPromise(func.apply(when, arguments));
		};
	}

	function makeDebugWithHandlers(name, func, offset) {
		makeDebug(name, function() {
			offset = offset || 1;
			if(typeof arguments[offset] === 'function' || typeof arguments[offset+1] === 'function' || typeof arguments[offset+2] === 'function') {
				warn(name + '() onFulfilled, onRejected, and onProgress are deprecated, use returnedPromise.then/otherwise/ensure instead');
			}
			return func.apply(when, arguments);
		});
	}

	// Wrap a promise callback to catch exceptions and log or
	// rethrow as uncatchable
	function wrapCallback(promise, cb) {
		return function(v) {
			try {
				return cb(v);
			} catch(err) {
				if(err) {
					var toRethrow = (whenDebug.debug && whenDebug.debug.exceptionsToRethrow) || exceptionsToRethrow;

					if (err.name in toRethrow) {
						throwUncatchable(err);
					}

					callGlobalHandler('reject', promise, err);
				}

				throw err;
			}
		};
	}

	// Wrap a callback, errback, progressback tuple
	function wrapCallbacks(promise, callbacks) {
		var cb, args, len, i;

		args = [];

		for(i = 0, len = callbacks.length; i < len; i++) {
			args[i] = typeof (cb = callbacks[i]) == 'function'
				? wrapCallback(promise, cb)
				: cb;
		}

		return args;
	}

	function callGlobalHandler(handler, promise, triggeringValue, auxValue) {
		/*jshint maxcomplexity:5*/
		var globalHandlers = whenDebug.debug;

		if(!(globalHandlers && typeof globalHandlers[handler] === 'function')) {
			return;
		}

		if(arguments.length < 4 && handler == 'reject') {
			try {
				throw new Error(promise.toString());
			} catch(e) {
				auxValue = e;
			}
		}

		try {
			globalHandlers[handler](promise, triggeringValue, auxValue);
		} catch(handlerError) {
			throwUncatchable(new Error('when.js global debug handler threw: ' + String(handlerError)));
		}
	}

	// Stringify a promise, deferred, or resolver
	function toString(name, id, status, value) {
		var s = '[object ' + name + ' ' + id + ']';

		if(arguments.length > 2) {
			s += ' ' + status;
			if(value !== pending) {
				s += ': ' + value;
			}
		}

		return s;
	}

	function throwUncatchable(err) {
		setTimer(function() {
			throw err;
		}, 0);
	}

	// Commented out until we need it, to appease JSHint
	function deprecated(name, preferred, f, context) {
		return function() {
			warn(new Error(name + ' is deprecated, use ' + preferred).stack);

			return f.apply(context, arguments);
		};
	}

	function checkCallbacks() {
		var i, len, a;
		for(i = 0, len = arguments.length; i < len; i++) {
			a = arguments[i];
			if(!checkFunction(a)) {
				warn(new Error('arg ' + i + ' must be a function, null, or undefined, but was a ' + typeof a).stack);
			}
		}
	}

	function checkFunction(f) {
		return typeof f === 'function' || f == null;
	}

	// The usual Crockford
	function F() {}
	function beget(o) {
		F.prototype = o;
		o = new F();
		F.prototype = undef;

		return o;
	}

});
})(
	typeof define === 'function' && define.amd ? define : function (factory) { module.exports = factory(require); }
	// Boilerplate for AMD and Node
);
