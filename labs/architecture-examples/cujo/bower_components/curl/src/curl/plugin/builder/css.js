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

	var
		// this actually tests for absolute urls and root-relative urls
		// they're both non-relative
		nonRelUrlRe = /^\/|^[^:]*:\/\//,
		// Note: this will fail if there are parentheses in the url
		findUrlRx = /url\s*\(['"]?([^'"\)]*)['"]?\)/g;

	function translateUrls (cssText, baseUrl) {
		return cssText.replace(findUrlRx, function (all, url) {
			return 'url("' + translateUrl(url, baseUrl) + '")';
		});
	}

	function translateUrl (url, parentPath) {
		// if this is a relative url
		if (!nonRelUrlRe.test(url)) {
			// append path onto it
			url = parentPath + url;
		}
		return url;
	}

	function createSheetProxy (sheet) {
		return {
			cssRules: function () {
				return sheet.cssRules || sheet.rules;
			},
			insertRule: sheet.insertRule || function (text, index) {
				var parts = text.split(/\{|\}/g);
				sheet.addRule(parts[0], parts[1], index);
				return index;
			},
			deleteRule: sheet.deleteRule || function (index) {
				sheet.removeRule(index);
				return index;
			},
			sheet: function () {
				return sheet;
			}
		};
	}

	/***** style element functions *****/

	var currentStyle;

	function createStyle (cssText) {
		clearTimeout(createStyle.debouncer);
		if (createStyle.accum) {
			createStyle.accum.push(cssText);
		}
		else {
			createStyle.accum = [cssText];
			currentStyle = doc.createStyleSheet ? doc.createStyleSheet() :
				head.appendChild(doc.createElement('style'));
		}

		createStyle.debouncer = setTimeout(function () {
			// Note: IE 6-8 won't accept the W3C method for inserting css text
			var style, allCssText;

			style = currentStyle;
			currentStyle = undef;

			allCssText = createStyle.accum.join('\n');
			createStyle.accum = undef;

			// for safari which chokes on @charset "UTF-8";
			allCssText = allCssText.replace(/.+charset[^;]+;/g, '');

			// TODO: hoist all @imports to the top of the file to follow w3c spec

			'cssText' in style ? style.cssText = allCssText :
				style.appendChild(doc.createTextNode(allCssText));

		}, 0);

		return currentStyle;
	}

/*
				// return the run-time API
				callback({
					'translateUrls': function (cssText, baseId) {
						var baseUrl;
						baseUrl = require['toUrl'](baseId);
						baseUrl = baseUrl.substr(0, baseUrl.lastIndexOf('/') + 1);
						return translateUrls(cssText, baseUrl);
					},
					'injectStyle': function (cssText) {
						return createStyle(cssText);
					},

					'proxySheet': function (sheet) {
						// for W3C, `sheet` is a reference to a <style> node so we need to
						// return the sheet property.
						if (sheet.sheet) sheet = sheet.sheet;
						return createSheetProxy(sheet);
					}
				});
*/

	return {

		'build': function (writer, fetcher, config) {
			// writer is a function used to output to the built file
			// fetcher is a function used to fetch a text file
			// config is the global config
			// returns a function that the build tool can use to tell this
			// plugin to write-out a resource
			return function write (pluginId, resource, resolver) {
				var opts, name, url, absId, text, output;
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
					// TODO: write out api calls from this plugin-builder
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
