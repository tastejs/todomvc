/**
 * XHR polyfill / shims
 *
 * (c) copyright 2011-2013 Brian Cavalier and John Hann
 *
 * This module is part of the cujo.js family of libraries (http://cujojs.com/).
 *
 * Licensed under the MIT License at:
 * 		http://www.opensource.org/licenses/mit-license.php
 *
 */
define(function () {

	var progIds;

	// find XHR implementation
	if (typeof XMLHttpRequest == 'undefined') {
		// create xhr impl that will fail if called.
		assignCtor(function () { throw new Error("poly/xhr: XMLHttpRequest not available"); });
		// keep trying progIds until we find the correct one,
		progIds = ['Msxml2.XMLHTTP', 'Microsoft.XMLHTTP', 'Msxml2.XMLHTTP.4.0'];
		while (progIds.length && tryProgId(progIds.shift())) {}
	}

	function assignCtor (ctor) {
		// assign window.XMLHttpRequest function
		window.XMLHttpRequest = ctor;
	}

	function tryProgId (progId) {
		try {
			new ActiveXObject(progId);
			assignCtor(function () { return new ActiveXObject(progId); });
			return true;
		}
		catch (ex) {}
	}

});
