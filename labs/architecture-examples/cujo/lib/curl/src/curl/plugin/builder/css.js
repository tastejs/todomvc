/** MIT License (c) copyright B Cavalier & J Hann */

/**
 * curl css! plugin build-time module
 *
 * Licensed under the MIT License at:
 * 		http://www.opensource.org/licenses/mit-license.php
 */
define(function () {
"use strict";

	// collection of modules that have been written to the built file
	var built = {};

	function nameWithExt (name, defaultExt) {
		return name.lastIndexOf('.') <= name.lastIndexOf('/') ?
			name + '.' + defaultExt : name;
	}

	function jsEncode (text) {
		// TODO: hoist the map and regex to the enclosing scope for better performance
		var map = { 34: '\\"', 13: '\\r', 12: '\\f', 10: '\\n', 9: '\\t', 8: '\\b' };
		return text.replace(/(["\n\f\t\r\b])/g, function (c) {
			return map[c.charCodeAt(0)];
		});
	}

	function parseSuffixes (name) {
		// creates a dual-structure: both an array and a hashmap
		// suffixes[0] is the actual name
		var parts = name.split('!'),
			suf, i = 1, pair;
		while ((suf = parts[i++])) { // double-parens to avoid jslint griping
			pair = suf.split('=', 2);
			parts[pair[0]] = pair.length == 2 ? pair[1] : true;
		}
		return parts;
	}

	return {

		'build': function (writer, fetcher, config) {
			// writer is a function used to output to the built file
			// fetcher is a function used to fetch a text file
			// config is the global config
			// returns a function that the build tool can use to tell this
			// plugin to write-out a resource
			return function write (pluginId, resource, resolver) {
				var opts, name, url, absId, text, output;
				// TODO: implement !nowait and comma-sep files!
				opts = parseSuffixes(resource);
				name = opts.shift();
				absId = resolver['toAbsMid'](name);
				if (!(absId in built)) {
					built[absId] = true;
					url = resolver['toUrl'](nameWithExt(absId, 'css'));
					// fetch text
					text = jsEncode(fetcher(url));
					// write out a define
					// TODO: wait until sheet's rules are active before returning (use an amd promise)
					// TODO: fix parser so that it doesn't choke on the word define( in a string
					output = 'def' + 'ine("' + pluginId + '!' + absId + '", ["' + pluginId + '!"], function (api) {\n' +
						// translate urls
						'\tvar cssText = "' + text + '";\n' +
						'\tcssText = api.translateUrls(cssText, "' + absId + '");\n' +
						// call the injectStyle function
						'\treturn api.proxySheet(api.injectStyle(cssText));\n' +
					'});\n';
					writer(output);
				}
			};
		}

	};

});
