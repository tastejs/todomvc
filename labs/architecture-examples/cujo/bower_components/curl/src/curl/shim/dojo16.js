/** MIT License (c) copyright 2010-2013 B Cavalier & J Hann */

/**
 * curl dojo 1.6 shim
 *
 * Licensed under the MIT License at:
 * 		http://www.opensource.org/licenses/mit-license.php
 */

/**
 * Until AMD becomes well established, there will be issues with the various
 * libs.  This one overcomes some minor issues with dojo 1.6's initial
 * foray into AMD territory. :)
 *
 * usage:
 *  curl(['curl/shim/dojo16', 'curl/domReady'])
 *  	.next(['dojo/parser'])
 *  	.then(function (parser) {
 *  		parser.parse();
 *  	});
 *
 */
var require;
define(/*=='curl/shim/dojo16',==*/ ['curl/_privileged', 'curl/domReady'], function (priv, domReady) {
"use strict";

	var _curl = priv['_curl'],
		origCreateContext = priv['core'].createContext;

	function duckPunchRequire (req) {
		// create a ready method on `require`
		if (!req['ready']){
			req['ready'] = function (cb) {
				domReady(cb);
			};
		}
		// map non-standard nameToUrl to toUrl
		if (!req['nameToUrl']) {
			req['nameToUrl'] = function (name, ext) {
				return req['toUrl'](name + (ext || ''));
			};
		}
		// dojo 1.7 has a few unchecked `require.cache` usages
		if (!req['cache']) req['cache'] = {};
		return req;
	}

	// modify global curl cuz dojo doesn't always use local `require`
	// as a dependency
	duckPunchRequire(_curl);

	// dojo 1.7 still expects a global `require`, so make sure they've got one
	if (typeof require == 'undefined') {
		require = _curl;
	}

	// override createContext to override "local require"
	priv['core'].createContext = function () {
		var def = origCreateContext.apply(this, arguments);
		duckPunchRequire(def.require);
		return def;
	};

	return true;

});
