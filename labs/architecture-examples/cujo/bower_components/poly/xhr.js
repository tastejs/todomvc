/**
 * XHR polyfill / shims
 *
 * (c) copyright 2011-2012 Brian Cavalier and John Hann
 *
 * This module is part of the cujo.js family of libraries (http://cujojs.com/).
 *
 * Licensed under the MIT License at:
 * 		http://www.opensource.org/licenses/mit-license.php
 *
 */
define(['./lib/_base'], function (base) {

	var progIds, xhrCtor;

	progIds = ['Msxml2.XMLHTTP', 'Microsoft.XMLHTTP', 'Msxml2.XMLHTTP.4.0'];

	// find XHR implementation
	if (typeof XMLHttpRequest != 'undefined') {
		xhrCtor = XMLHttpRequest;
	}
	else {
		var noXhr;
		// keep trying progIds until we find the correct one, then rewrite the getXhr method
		// to always return that one.
		noXhr = xhrCtor = function () {
			throw new Error("poly/xhr: XMLHttpRequest not available");
		};
		while (progIds.length > 0 && xhrCtor == noXhr) (function (progId) {
			try {
				new ActiveXObject(progId);
				xhrCtor = function () { return new ActiveXObject(progId); };
			}
			catch (ex) {}
		}(progIds.shift()));
	}

	if (!window.XMLHttpRequest) {
		window.XMLHttpRequest = xhrCtor;
	}

});
