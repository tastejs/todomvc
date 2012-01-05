/**
 * curl domReady loader plugin
 *
 * (c) copyright 2011, unscriptable.com
 *
 * allows the curl/domReady module to be used like a plugin
 * this is for better compatibility with other loaders.
 *
 * Usage:
 *
 * curl(["domReady!"]).then(doSomething);
 *
 * TODO: use "../domReady" instead of "curl/domReady" when curl's make.sh is updated to use cram
 */

define(/*=='domReady',==*/ ['curl/domReady'], function (domReady) {

	return {

		'load': function (name, req, cb, cfg) {
			domReady(cb);
		}

	};

});
