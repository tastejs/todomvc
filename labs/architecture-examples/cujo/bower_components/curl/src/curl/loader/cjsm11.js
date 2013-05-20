/** MIT License (c) copyright B Cavalier & J Hann */

/**
 * curl CommonJS Modules/1.1 loader
 *
 * Licensed under the MIT License at:
 * 		http://www.opensource.org/licenses/mit-license.php
 */

/**
 * @experimental
 */
(function (global, document, globalEval) {

define(/*=='curl/loader/cjsm11',==*/ function () {

	var head, insertBeforeEl /*, findRequiresRx, myId*/;

//	findRequiresRx = /require\s*\(\s*['"](\w+)['"]\s*\)/,

//	function nextId (index) {
//		var varname = '', part;
//		do {
//			part = index % 26;
//			varname += String.fromCharCode(part + 65);
//			index -= part;
//		}
//		while (index > 0);
//		return 'curl$' + varname;
//	}

//	/**
//	 * @description Finds the require() instances in the source text of a cjs
//	 * 	 module and collects them. If removeRequires is true, it also replaces
//	 * 	 them with a unique variable name. All unique require()'d module ids
//	 * 	 are assigned a unique variable name to be used in the define(deps)
//	 * 	 that will be constructed to wrap the cjs module.
//	 * @param source - source code of cjs module
//	 * @param moduleIds - hashMap (object) to receive pairs of moduleId /
//	 *   unique variable name
//	 * @param removeRequires - if truthy, replaces all require() instances with
//	 *   a unique variable
//	 * @return - source code of cjs module, possibly with require()s replaced
//	 */
//	function parseDepModuleIds (source, moduleIds, removeRequires) {
//		var index = 0;
//		// fast parse
//		source = source.replace(findRequiresRx, function (match, id) {
//			if (!moduleIds[id]) {
//				moduleIds[id] = nextId(index++);
//				moduleIds.push(id);
//			}
//			return removeRequires ? moduleIds[id] : match;
//		});
//		return source;
//	}

	head = document && (document['head'] || document.getElementsByTagName('head')[0]);
	// to keep IE from crying, we need to put scripts before any
	// <base> elements, but after any <meta>. this should do it:
	insertBeforeEl = head && head.getElementsByTagName('base')[0] || null;

	function wrapSource (source, resourceId, fullUrl) {
		var sourceUrl = fullUrl ? '////@ sourceURL=' + fullUrl.replace(/\s/g, '%20') + '.js' : '';
		return "define('" + resourceId + "'," +
			"['require','exports','module'],function(require,exports,module){" +
			source + "\n});\n" + sourceUrl + "\n";
	}

	var injectSource = function (el, source) {
		// got this from Stoyan Stefanov (http://www.phpied.com/dynamic-script-and-style-elements-in-ie/)
		injectSource = ('text' in el) ?
			function (el, source) { el.text = source; } :
			function (el, source) { el.appendChild(document.createTextNode(source)); };
		injectSource(el, source);
	};

	function injectScript (source) {
		var el = document.createElement('script');
		injectSource(el, source);
		el.charset = 'utf-8';
		head.insertBefore(el, insertBeforeEl);
	}

	return {
		'load': function (resourceId, require, callback, config) {
			// TODO: extract xhr from text! plugin and use that instead (after we upgrade to cram.js)
			require(['text!' + resourceId + '.js', 'curl/_privileged'], function (source, priv) {
				var moduleMap;

				// find (and replace?) dependencies
				moduleMap = priv['core'].extractCjsDeps(source);
				//source = parseDepModuleIds(source, moduleMap, config.replaceRequires);

				// get deps
				require(moduleMap, function () {

					// wrap source in a define
					source = wrapSource(source, resourceId, config['injectSourceUrl'] !== false && require.toUrl(resourceId));

					if (config['injectScript']) {
						injectScript(source);
					}
					else {
						//eval(source);
						globalEval(source);
					}

					// call callback now that the module is defined
					callback(require(resourceId));

				}, callback['error'] || function (ex) { throw ex; });

			});
		}
	};

});

}(this, this.document, function () { /* FB needs direct eval here */ eval(arguments[0]); }));
