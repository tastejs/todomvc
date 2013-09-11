/** MIT License (c) copyright 2010-2013 B Cavalier & J Hann */

/**
 * curl debug plugin
 *
 * Licensed under the MIT License at:
 * 		http://www.opensource.org/licenses/mit-license.php
 *
 */

/**
 * usage:
 *  curl({ preloads: ['curl/debug'] }, ['my/app'], function (myApp) {
 * 		// do stuff while logging debug messages
 * 	});
 *
 * TODO: warn when main module still has leading dots (normalizePackageDescriptor)
 * TODO: warn when a module id still has leading dots (toAbsId)
 * TODO: use curl/tdd/undefine module instead of quick-and-dirty method below
 * TODO: only add logging to some of the useful core functions
 *
 */
define(['require', 'curl/_privileged'], function (require, priv) {
"use strict";

	var cache, totalWaiting, prevTotal, origDefine;

	if (typeof console == 'undefined') {
		throw new Error('`console` object must be defined to use debug module.');
	}

	priv._curl['undefine'] = function (moduleId) { delete cache[moduleId]; };

	cache = priv['cache'];

	// add logging to core functions
	for (var p in priv['core']) (function (name, orig) {
		priv['core'][name] = function () {
			var result;
			console.log('curl ' + name + ' arguments:', arguments);
			result = orig.apply(this, arguments);
			console.log('curl ' + name + ' return:', result);
			return result;
		};
	}(p, priv['core'][p]));

	// add logging to define
	origDefine = priv._define;
	priv._define = function () {
		console.log('curl define:', arguments);
		return origDefine.apply(this, arguments);
	};

	// log cache stats periodically
	totalWaiting = 0;

	function count () {
		totalWaiting = 0;
		for (var p in cache) {
			if (cache[p] instanceof priv['Promise']) totalWaiting++;
		}
	}
	count();

	function periodicLogger () {
		count();
		if (prevTotal != totalWaiting) {
			console.log('curl: ********** modules waiting: ' + totalWaiting);
			for (var p in cache) {
				if (cache[p] instanceof priv['Promise']) {
					console.log('curl: ********** module waiting: ' + p);
				}
			}
		}
		prevTotal = totalWaiting;
		setTimeout(periodicLogger, 500);
	}
	periodicLogger();

	return true;

});
