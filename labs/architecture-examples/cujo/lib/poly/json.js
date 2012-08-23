/**
 * JSON polyfill / shim
 *
 * (c) copyright 2011-2012 Brian Cavalier and John Hann
 *
 * poly is part of the cujo.js family of libraries (http://cujojs.com/)
 *
 * Licensed under the MIT License at:
 * 		http://www.opensource.org/licenses/mit-license.php
 *
 * TODO: document that JSON module is always downloaded st run-time unless
 * dev explicitly mentions it in build instructions
 */
define(['./lib/_async!./lib/_json'], function (JSON) {
	return JSON;
});
