/** @license MIT License (c) copyright B Cavalier & J Hann */

/**
 * Licensed under the MIT License at:
 * http://www.opensource.org/licenses/mit-license.php
 */

(function(define){
define(function() {
"use strict";

	var undef;

	/**
	 * Creates an object by either invoking ctor as a function and returning the result,
	 * or by calling new ctor().  It uses a simple heuristic to try to guess which approach
	 * is the "right" one.
	 *
	 * @param ctor {Function} function or constructor to invoke
	 * @param args {Array} array of arguments to pass to ctor in either case
	 *
	 * @returns The result of invoking ctor with args, with or without new, depending on
	 * the strategy selected.
	 */
	return function createComponent(ctor, args, forceConstructor) {

		var begotten;

		if (forceConstructor || isConstructor(ctor)) {
			WireComponent.prototype = ctor.prototype;
			WireComponent.prototype.constructor = ctor;
			begotten = new WireComponent(ctor, args);

			WireComponent.prototype = undef;

		} else {
			begotten = ctor.apply(undef, args);

		}

		return begotten === undef ? null : begotten;
	};

	/**
	 * Constructor used to beget objects that wire needs to create using new.
	 * @param ctor {Function} real constructor to be invoked
	 * @param args {Array} arguments to be supplied to ctor
	 */
	function WireComponent(ctor, args) {
		return ctor.apply(this, args);
	}

	/**
	 * Determines whether the supplied function should be invoked directly or
	 * should be invoked using new in order to create the object to be wired.
	 *
	 * @param func {Function} determine whether this should be called using new or not
	 *
	 * @returns true iff func should be invoked using new, false otherwise.
	 */
	function isConstructor(func) {
		var is = false, p;
		for (p in func.prototype) {
			if (p !== undef) {
				is = true;
				break;
			}
		}

		return is;
	}

});
})(typeof define == 'function'
	// AMD
	? define
	// CommonJS
	: function(factory) {
		module.exports = factory();
	}
);