/**
 * Function polyfill / shims
 *
 * (c) copyright 2011-2013 Brian Cavalier and John Hann
 *
 * This module is part of the cujo.js family of libraries (http://cujojs.com/).
 *
 * Licensed under the MIT License at:
 * 		http://www.opensource.org/licenses/mit-license.php
 */
define (['./lib/_base'], function (base) {
"use strict";

	var bind,
		slice = [].slice,
		proto = Function.prototype,
		featureMap;

	featureMap = {
		'function-bind': 'bind'
	};

	function has (feature) {
		var prop = featureMap[feature];
		return base.isFunction(proto[prop]);
	}

	// check for missing features
	if (!has('function-bind')) {
		// adapted from Mozilla Developer Network example at
		// https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Function/bind
		bind = function bind (obj) {
			var args = slice.call(arguments, 1),
				self = this,
				nop = function () {},
				bound = function () {
				  return self.apply(this instanceof nop ? this : (obj || {}), args.concat(slice.call(arguments)));
				};
			nop.prototype = this.prototype || {}; // Firefox cries sometimes if prototype is undefined
			bound.prototype = new nop();
			return bound;
		};
		proto.bind = bind;
	}

	return {};

});
