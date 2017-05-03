/**
 * JSON polyfill / shim
 *
 * (c) copyright 2011-2012 Brian Cavalier and John Hann
 *
 * poly is part of the cujo.js family of libraries (http://cujojs.com/)
 *
 * Licensed under the MIT License at:
 * 		http://www.opensource.org/licenses/mit-license.php
 */
(function (global) {
define(['require', 'curl/_privileged'], function (require, priv) {

	var cbs, ebs, promise;

	function has (feature) {
		return global.JSON;
	}

	if (!has('json')) {

		cbs = [];
		ebs = [];

		promise = {
			then: function (cb, eb) {
				if (cb) cbs.push(cb);
				if (eb) ebs.push(eb);
			}
		};

		function callback (list, val) {
			promise.then = list == cbs
				? function (cb, eb) { cb(val); }
				: function (cb, eb) { eb(val); }
			for (var i = 0; i < list.length; i++) list[i](val);
		}

		function resolve (val) {
			callback(cbs, val);
		}

		function reject (ex) {
			callback(ebs, ex);
		}

		require(['../support/json2'], resolve, reject);

		return promise;

	}

});
}(this));
