/** MIT License (c) copyright B Cavalier & J Hann */

/**
 * curl domReady loader plugin
 *
 * Licensed under the MIT License at:
 * 		http://www.opensource.org/licenses/mit-license.php
 *
 */

/**
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
