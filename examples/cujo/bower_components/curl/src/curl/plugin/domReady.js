/** MIT License (c) copyright 2010-2013 B Cavalier & J Hann */

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

define(/*=='curl/plugin/domReady',==*/ ['../domReady'], function (domReady) {

	return {

		'load': function (name, req, cb, cfg) {
			domReady(cb);
		}

	};

});
