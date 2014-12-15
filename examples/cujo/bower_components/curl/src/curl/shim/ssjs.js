/** MIT License (c) copyright 2010-2013 B Cavalier & J Hann */

/**
 * curl ssjs shim
 * Modifies curl to work as an AMD loader function in server-side
 * environments such as RingoJS, Rhino, and NodeJS.
 *
 * Licensed under the MIT License at:
 * 		http://www.opensource.org/licenses/mit-license.php
 *
 * TODO: support environments that implement XMLHttpRequest such as Wakanda
 *
 * @experimental
 */
define['amd'].ssjs = true;
var require, load;
(function (freeRequire, globalLoad) {
define(/*=='curl/shim/ssjs',==*/ function (require, exports) {
"use strict";

	var priv, config, hasProtocolRx, extractProtocolRx, protocol,
		http, localLoadFunc, remoteLoadFunc,
		undef;

	// first, bail if we're in a browser!
	if (typeof window == 'object' && (window.clientInformation || window.navigator)) {
		return;
	}

	priv = require('curl/_privileged');
	config = priv.config();
    hasProtocolRx = /^\w+:/;
	extractProtocolRx = /(^\w+:)?.*$/;

    protocol = fixProtocol(config.defaultProtocol)
		|| extractProtocol(config.baseUrl)
		|| 'http:';

	// sniff for capabilities

	if (globalLoad) {
		// rhino & ringo make this so easy
		localLoadFunc = remoteLoadFunc = loadScriptViaLoad;
	}
	else if (freeRequire) {
		localLoadFunc = loadScriptViaRequire;
		// try to find an http client
		try {
			// node
			http = freeRequire('http');
			remoteLoadFunc = loadScriptViaNodeHttp;
		}
		catch (ex) {
			remoteLoadFunc = failIfInvoked;
		}

	}
	else {
		localLoadFunc = remoteLoadFunc = failIfInvoked;
	}

	if (typeof process === 'object' && process.nextTick) {
		priv.core.nextTurn = process.nextTick;
	}

	function stripExtension (url) {
		return url.replace(/\.js$/, '');
	}

	priv.core.loadScript = function (def, success, fail) {
		var urlOrPath;
		// figure out if this is local or remote and call appropriate function
		// remote urls always have a protocol or a // at the beginning
		urlOrPath = def.url;
		if (/^\/\//.test(urlOrPath)) {
			// if there's no protocol, use configured protocol
			def.url = protocol + def.url;
		}
		if (hasProtocolRx.test(def.url)) {
			return remoteLoadFunc(def, success, fail);
		}
		else {
			return localLoadFunc(def, success, fail);
		}
	};

	function loadScriptViaLoad (def, success, fail) {
		try {
			globalLoad(def.url);
			success();
		}
		catch (ex) {
			fail(ex);
		}
	}

	function loadScriptViaRequire (def, success, fail) {
		var modulePath;
		try {
			modulePath = stripExtension(def.url);
			freeRequire(modulePath);
			success();
		}
		catch (ex) {
			fail(ex);
		}
	}

	function loadScriptViaNodeHttp (def, success, fail) {
		var options, source;
		options = freeRequire('url').parse(def.url, false, true);
		source = '';
		http.get(options, function (response) {
			response
				.on('data', function (chunk) { source += chunk; })
				.on('end', function () { executeScript(source); success(); })
				.on('error', fail);
		}).on('error', fail);
	}

	function failIfInvoked (def) {
		throw new Error('ssjs: unable to load module in current environment: ' + def.url);
	}

	function executeScript (source) {
		eval(source);
	}

    function extractProtocol (url) {
        var protocol;
        protocol = url && url.replace(extractProtocolRx,
			function (m, p) { return p; }
		);
        return protocol;
    }

	function fixProtocol (protocol) {
		return protocol && protocol[protocol.length - 1] != ':'
			? protocol += ':'
			: protocol;
	}

	function _nextTick (func) {
		nextTick(func);
	}

});
}(require, load));
