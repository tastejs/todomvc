/**
 * polyfill / shim plugin for AMD loaders
 *
 * (c) copyright 2011-2013 Brian Cavalier and John Hann
 *
 * poly is part of the cujo.js family of libraries (http://cujojs.com/)
 *
 * Licensed under the MIT License at:
 * 		http://www.opensource.org/licenses/mit-license.php
 */

define(['./object', './string', './date', './array', './function', './json', './xhr'], function (object, string, date) {

	return {
		failIfShimmed: object.failIfShimmed,
		setWhitespaceChars: string.setWhitespaceChars,
		setIsoCompatTest: date.setIsoCompatTest
	};

});
