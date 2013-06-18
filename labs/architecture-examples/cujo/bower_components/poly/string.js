/**
 * String polyfill / shims
 *
 * (c) copyright 2011-2013 Brian Cavalier and John Hann
 *
 * This module is part of the cujo.js family of libraries (http://cujojs.com/).
 *
 * Licensed under the MIT License at:
 * 		http://www.opensource.org/licenses/mit-license.php
 *
 * Adds str.trim(), str.trimRight(), and str.trimLeft()
 *
 * Note: we don't bother trimming all possible ES5 white-space characters.
 * If you truly need strict ES5 whitespace compliance in all browsers,
 * create your own trim function.
 * from http://perfectionkills.com/whitespace-deviations/
 * '\x09-\x0D\x20\xA0\u1680\u180E\u2000-\u200A\u202F\u205F\u3000\u2028\u2029'
 */
define (['./lib/_base'], function (base) {
	"use strict";

	var proto = String.prototype,
		featureMap,
		has,
		toString;

	featureMap = {
		'string-trim': 'trim',
		'string-trimleft': 'trimLeft',
		'string-trimright': 'trimRight'
	};

	function checkFeature (feature) {
		var prop = featureMap[feature];
		return base.isFunction(proto[prop]);
	}

	function neg () { return false; }

	has = checkFeature;

	// compressibility helper
	function remove (str, rx) {
		return str.replace(rx, '');
	}

	toString = base.createCaster(String, 'String');

	var trimRightRx, trimLeftRx;

	trimRightRx = /\s+$/;
	trimLeftRx = /^\s+/;

	function checkShims () {
		if (!has('string-trim')) {
			proto.trim = function trim () {
				return remove(remove(toString(this), trimLeftRx), trimRightRx);
			};
		}

		if (!has('string-trimleft')) {
			proto.trimLeft = function trimLeft () {
				return remove(toString(this), trimLeftRx);
			};
		}

		if (!has('string-trimright')) {
			proto.trimRight = function trimRight () {
				return remove(toString(this), trimRightRx);
			};
		}

	}

	checkShims();

	return {
		setWhitespaceChars: function (wsc) {
			trimRightRx = new RegExp(wsc + '$');
			trimLeftRx = new RegExp('^' + wsc);
			// fail all has() checks and check shims again
			has = neg;
			checkShims();
		}
	};

});
