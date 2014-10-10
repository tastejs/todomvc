/*
	poly/strict

	(c) copyright 2011-2013 Brian Cavalier and John Hann

	This module is part of the cujo.js family of libraries (http://cujojs.com/).

	Licensed under the MIT License at:
		http://www.opensource.org/licenses/mit-license.php
*/
/**
 * @deprecated Please use poly/es5-strict
 */
define(['./object', './string', './date', './array', './function', './json', './xhr'], function (object, string, date) {

	var failTestRx;

	failTestRx = /^define|^prevent|descriptor$/i;

	function regexpShouldThrow (feature) {
		return failTestRx.test(feature);
	}

	// set unshimmable Object methods to be somewhat strict:
	object.failIfShimmed(regexpShouldThrow);
	// set strict whitespace
	string.setWhitespaceChars('\\s');

	return {
		failIfShimmed: object.failIfShimmed,
		setWhitespaceChars: string.setWhitespaceChars,
		setIsoCompatTest: date.setIsoCompatTest
	};

});
