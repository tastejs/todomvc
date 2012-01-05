/**
 * curl js plugin
 *
 * (c) copyright 2011, unscriptable.com / John Hann
 * Licensed under the MIT License at:
 * 		http://www.opensource.org/licenses/mit-license.php
 *
 * usage:
 *  require(['ModuleA', 'js!myNonAMDFile.js!order', 'js!anotherFile.js!order], function (ModuleA) {
 * 		var a = new ModuleA();
 * 		document.body.appendChild(a.domNode);
 * 	});
 *
 * Specify the !order suffix for files that must be evaluated in order.
 *
 * Async=false rules learned from @getify's LABjs!
 * http://wiki.whatwg.org/wiki/Dynamic_Script_Execution_Order
 *
 */
(function (global, doc) {
"use strict";
	var queue = [],
		supportsAsyncFalse = doc.createElement('script').async == true,
		readyStates = { 'loaded': 1, 'interactive': 1, 'complete': 1 },
		orsc = 'onreadystatechange',
		head = doc['head'] || doc.getElementsByTagName('head')[0],
		waitForOrderedScript;

	// TODO: find a way to reuse the loadScript from curl.js
	function loadScript (def, success, failure) {
		// script processing rules learned from RequireJS

		var deadline, el;

		// default deadline is very far in the future (5 min)
		// devs should set something reasonable if they want to use it
		deadline = new Date().valueOf() + (def.timeout || 300) * 1000;

		// insert script
		el = doc.createElement('script');

		// initial script processing
		function process (ev) {
			ev = ev || global.event;
			// detect when it's done loading
			if (ev.type == 'load' || readyStates[el.readyState]) {
				// release event listeners
				el.onload = el[orsc] = el.onerror = "";
				if (!def.test || testGlobalVar(def.test)) {
					success(el);
				}
				else {
					fail();
				}
			}
		}

		function fail (e) {
			// some browsers send an event, others send a string,
			// but none of them send anything useful, so just say we failed:
			el.onload = el[orsc] = el.onerror = "";
			if (failure) {
				failure(new Error('Script error or http error: ' + def.url));
			}
		}

		// some browsers (Opera and IE6-8) don't support onerror and don't fire
		// readystatechange if the script fails to load so we need to poll.
		// this poller only runs if def.test is specified and failure callback
		// is defined (see below)
		function poller () {
			// if the script loaded
			if (el.onload && readyStates[el.readyState]) {
				process({});
			}
			// if neither process or fail as run and our deadline is in the past
			else if (el.onload && deadline < new Date()) {
				fail();
			}
			else {
				setTimeout(poller, 10);
			}
		}
		if (failure && def.test) setTimeout(poller, 10);

		// set type first since setting other properties could
		// prevent us from setting this later
		el.type = def.mimetype || 'text/javascript';
		// using dom0 event handlers instead of wordy w3c/ms
		el.onload = el[orsc] = process;
		el.onerror = fail;
		el.charset = def.charset || 'utf-8';
		el.async = def.async;
		el.src = def.url;

		// use insertBefore to keep IE from throwing Operation Aborted (thx Bryan Forbes!)
		head.insertBefore(el, head.firstChild);

	}

	function fetch (def, promise) {

		loadScript(def,
			function (el) {
				// if there's another queued script
				var next = queue.shift();
				waitForOrderedScript = queue.length > 0;
				if (next) {
					// go get it (from cache hopefully)
					fetch.apply(null, next);
				}
				promise['resolve'](el);
			},
			function (ex) {
				promise['reject'](ex);
			}
		);

	}

	function testGlobalVar (varName) {
		try {
			eval('global.' + varName);
			return true;
		}
		catch (ex) {
			return false;
		}
	}

	define(/*=='js',==*/ {
		'load': function (name, require, callback, config) {

			var order, testPos, test, prefetch, def, promise;

			order = name.indexOf('!order') > 0; // can't be zero
			testPos = name.indexOf('!test=');
			test = testPos > 0 && name.substr(testPos + 6); // must be last option!
			prefetch = 'prefetch' in config ? config['prefetch'] : true;
			name = order || testPos > 0 ? name.substr(0, name.indexOf('!')) : name;
			def = {
				name: name,
				url: require['toUrl'](name),
				async: !order,
				order: order,
				test: test,
				timeout: config.timeout
			};
			promise = callback['resolve'] ? callback : {
				'resolve': function (o) { callback(o); },
				'reject': function (ex) { throw ex; }
			};

			// if this script has to wait for another
			// or if we're loading, but not executing it
			if (order && !supportsAsyncFalse && waitForOrderedScript) {
				// push onto the stack of scripts that will be fetched
				// from cache. do this before fetch in case IE has file cached.
				queue.push([def, promise]);
				// if we're prefetching
				if (prefetch) {
					// go get the file under an unknown mime type
					def.mimetype = 'text/cache';
					loadScript(def,
						// remove the fake script when loaded
						function (el) { el.parentNode.removeChild(el); },
						false
					);
					def.mimetype = '';
				}
			}
			// otherwise, just go get it
			else {
				waitForOrderedScript = waitForOrderedScript || order;
				fetch(def, promise);
			}

		}
	});

}(this, document));
