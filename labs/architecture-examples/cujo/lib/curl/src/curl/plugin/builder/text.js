/** MIT License (c) copyright B Cavalier & J Hann */

/**
 * curl text! loader builder plugin
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

	return {

		build: function (writer, fetcher, config) {
			// writer is a function used to output to the built file
			// fetcher is a function used to fetch a text file
			// config is the global config
			// returns a function that the build tool can use to tell this
			// plugin to write-out a resource
			return function write (pluginId, resource, resolver) {
				var url, absId, text, output;
				url = resolver['toUrl'](nameWithExt(resource, 'html'));
				absId = resolver['toAbsMid'](resource);
				if (!(absId in built)) {
					built[absId] = true;
					// fetch text
					text = jsEncode(fetcher(url));
					// write out a define
					output = 'define("' + pluginId + '!' + absId + '", function () {\n' +
						'\treturn "' + text + '";\n' +
						'});\n';
					writer(output);
				}
			};
		}


	};

});
