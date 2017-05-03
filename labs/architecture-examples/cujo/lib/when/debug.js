/** @license MIT License (c) copyright B Cavalier & J Hann */

/**
 * This is a drop-in replacement for the when module that sets up automatic
 * debug output for promises created or consumed by when.js.  Use this
 * instead of when to help with debugging.
 *
 * WARNING: This module **should never** be use this in a production environment.
 * It exposes details of the promise
 *
 * In an AMD environment, you can simply change your path or package mappings:
 *
 * paths: {
 *   // 'when': 'path/to/when/when'
 *   'when': 'path/to/when/debug'
 * }
 *
 * or
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
define(['./when'], function(when) {

	var promiseId, freeze, pending, exceptionsToRethrow, undef;

	promiseId = 0;
	freeze = Object.freeze || function(o) { return o; };
	pending = {};

	exceptionsToRethrow = {
		RangeError: 1,
		ReferenceError: 1,
		SyntaxError: 1,
		TypeError: 1
	};

	/**
	 * Setup debug output handlers for the supplied promise.
	 * @param p {Promise} A trusted (when.js) promise
	 * @return p
	 */
	function debugPromise(p) {
		// TODO: Need to find a way for promises returned by .then()
		// to also be debug promises.
		p.then(
			undef,
			function(err) {
				if(p.id) {
					console.error(p.toString());
				} else {
					console.error('[object Promise] REJECTED:', err);
				}
			}
		);

		return p;
	}

	function wrapCallback(cb) {
		if(typeof cb != 'function') return cb;

		return function(v) {
			try {
				return cb(v);
			} catch(err) {
				if(err) {
					if (err.name in exceptionsToRethrow) {
						setTimeout(function() {
							throw err;
						}, 0);
					} else if (err.stack) {
						console.error(err.stack);
					}
				}

				throw err;
			}
		}
	}

	/**
	 * Helper to form debug string for promises depending on their
	 * current state
	 * @param name
	 * @param id
	 * @param status
	 * @param value
	 */
	function toString(name, id, status, value) {
		var s = '[object ' + name + ' ' + id + '] ' + status;
		if(value !== pending) s += ': ' + value;
		return s;
	}

	function F() {}
	function beget(o) {
		F.prototype = o;
		o = new F();
		F.prototype = undef;

		return o;
	}

	/**
	 * Replacement for when() that sets up debug logging on the
	 * returned promise.
	 */
	function whenDebug() {
		return debugPromise(when.apply(null, arguments));
	}

	/**
	 * Replacement for when.defer() that sets up debug logging
	 * on the created Deferred, its resolver, and its promise.
	 * @param [id] anything optional identifier for this Deferred that will show
	 * up in debug output
	 * @return {Deferred} a Deferred with debug logging
	 */
	function deferDebug() {
		var d, status, value, origResolve, origReject, origThen, id;

		// Delegate to create a Deferred;
		d = when.defer();

		status = 'pending';
		value = pending;

		// if no id provided, generate one.  Not sure if this is
		// useful or not.
		id = arguments[arguments.length - 1];
		if(id === undef) id = ++promiseId;

		// Promise and resolver are frozen, so have to delegate
		// in order to setup toString() on promise, resolver,
		// and deferred
		d.promise = beget(d.promise);
		d.promise.toString = function() {
			return toString('Promise', id, status, value);
		};

		d.resolver = beget(d.resolver);
		d.resolver.toString = function() {
			return toString('Resolver', id, status, value);
		};

		origResolve = d.resolver.resolve;
		d.resolve = d.resolver.resolve = function(val) {
			value = val;
			status = 'resolving';
//			console.log(d.resolver.toString());
			return origResolve.apply(undef, arguments);
		};

		origReject = d.resolver.reject;
		d.reject = d.resolver.reject = function(err) {
			value = err;
			status = 'REJECTING';
//			console.error(d.resolver.toString());
			return origReject.apply(undef, arguments);
		};

		d.toString = function() {
			return toString('Deferred', id, status, value);
		};

		// Setup final state change handlers
		d.then(
			function(v) { status = 'resolved'; return v; },
			function(e) { status = 'REJECTED'; throw e; }
		);

		// Experimenting with setting up ways to also debug promises returned
		// by .then().  Also need to find a way to extend the id in a way that
		// makes it obvious the returned promise is NOT the original, but is
		// related to it--it's downstream in the promise chain.
		origThen = d.promise.then;
		d.then = d.promise.then = function(cb, eb, pb) {
			var args, p, id;

			id = d.id + '+';

			args = [];

			if(arguments.length > 0) args[0] = wrapCallback(cb, id);
			if(arguments.length > 1) args[1] = wrapCallback(eb, id);
			if(arguments.length > 2) args[2] = wrapCallback(pb, id);

			var p = origThen.apply(null, args);

			p.id = id;
			p = beget(p);
			p.toString = function() {
				return toString('Promise', p.id, status, value);
			};
			
			// See below. Not sure if debug promises should be frozen
			return freeze(p);
		};

		// Add an id to all directly created promises.  It'd be great
		// to find a way to propagate this id to promise created by .then()
		d.id = d.promise.id = d.resolver.id = id;

		// Attach debug handlers after the substitute promise
		// has been setup, so the id can be logged.
		debugPromise(d.promise);

		// TODO: Should we still freeze these?
		// Seems safer for now to err on the side of caution and freeze them,
		// but it could be useful to all them to be modified during debugging.
		freeze(d.promise);
		freeze(d.resolver);

		return d;
	}

	whenDebug.defer = deferDebug;
	whenDebug.isPromise = when.isPromise;

	// For each method we haven't already replaced, replace it with
	// one that sets up debug logging on the returned promise
	for(var p in when) {
		if(when.hasOwnProperty(p) && !(p in whenDebug)) {
			(function(p, orig) {
				whenDebug[p] = function() {
					return debugPromise(orig.apply(when, arguments));
				};
			})(p, when[p]);
		}
	}

	return whenDebug;

});
})(typeof define == 'function'
	? define
	: function (deps, factory) { typeof module != 'undefined'
		? (module.exports = factory(require('./when')))
		: (this.when      = factory(this.when));
	}
	// Boilerplate for AMD, Node, and browser global
);
