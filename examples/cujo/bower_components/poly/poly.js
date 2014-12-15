/**
 * polyfill / shim plugin for AMD loaders
 *
 * (c) copyright 2011-2013 Brian Cavalier and John Hann
 *
 * poly is part of the cujo.js family of libraries (http://cujojs.com/)
 *
 * Licensed under the MIT License at:
 * 		http://www.opensource.org/licenses/mit-license.php
 *
 */

define(['./all'], function (all) {

	var poly = {};

	// copy all
	for (var p in all) poly[p] = all[p];

	poly.version = '0.5.2';

	return poly;

});
