/** MIT License (c) copyright 2010-2013 B Cavalier & J Hann */

/**
 * curl createContext module
 *
 * Licensed under the MIT License at:
 * 		http://www.opensource.org/licenses/mit-license.php
 *
 */

define(['curl/_privileged', 'require'], function (priv, require) {
	var cache, cleanupScript, loadScript;

	cache = priv['cache'];

	cleanupScript = noop;

	if (typeof document != 'undefined') {
		cleanupScript = removeScript;
		loadScript = priv['core'].loadScript;
		priv['core'].loadScript = function (def) {
			var el = loadScript.apply(this, arguments);
			el._curl_id = def.id;
		}
	}

	/**
	 * Removes a module from curl.js's cache so that it can
	 * be re-defined or re-required.  Provide an array of moduleIds
	 * instead of a single moduleId to delete many at a time.
	 * @param moduleId {String|Array} the id of a module (or modules)
	 */
	return function undefine (moduleId) {
		var ids, id;
		ids = [].concat(moduleId);
		while ((id = ids.pop())) {
			delete cache[id];
			cleanupScript(id);
		}
	};

	function removeScript (id) {
		var scripts, i, script;
		scripts = document.getElementsByTagName('script');
		i = 0;
		while ((script = scripts[i++])) {
			if (script._curl_id == id) {
				script.parentNode.removeChild(script);
				return; // all done!
			}
		}
	}

	function noop () {}

});
