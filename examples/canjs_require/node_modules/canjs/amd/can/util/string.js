/*!
 * CanJS - 2.0.7
 * http://canjs.us/
 * Copyright (c) 2014 Bitovi
 * Wed, 26 Mar 2014 16:12:27 GMT
 * Licensed MIT
 * Includes: CanJS default build
 * Download from: http://canjs.us/
 */
define(["can/util/library"], function (can) {
	// ##string.js
	// _Miscellaneous string utility functions._  
	// Several of the methods in this plugin use code adapated from Prototype
	// Prototype JavaScript framework, version 1.6.0.1.
	// © 2005-2007 Sam Stephenson
	var strUndHash = /_|-/,
		strColons = /\=\=/,
		strWords = /([A-Z]+)([A-Z][a-z])/g,
		strLowUp = /([a-z\d])([A-Z])/g,
		strDash = /([a-z\d])([A-Z])/g,
		strReplacer = /\{([^\}]+)\}/g,
		strQuote = /"/g,
		strSingleQuote = /'/g,
		strHyphenMatch = /-+(.)?/g,
		strCamelMatch = /[a-z][A-Z]/g,
		// Returns the `prop` property from `obj`.
		// If `add` is true and `prop` doesn't exist in `obj`, create it as an
		// empty object.
		getNext = function (obj, prop, add) {
			var result = obj[prop];
			if (result === undefined && add === true) {
				result = obj[prop] = {};
			}
			return result;
		},
		// Returns `true` if the object can have properties (no `null`s).
		isContainer = function (current) {
			return /^f|^o/.test(typeof current);
		}, convertBadValues = function (content) {
			// Convert bad values into empty strings
			var isInvalid = content === null || content === undefined || isNaN(content) && '' + content === 'NaN';
			return '' + (isInvalid ? '' : content);
		};
	can.extend(can, {
		esc: function (content) {
			return convertBadValues(content)
				.replace(/&/g, '&amp;')
				.replace(/</g, '&lt;')
				.replace(/>/g, '&gt;')
				.replace(strQuote, '&#34;')
				.replace(strSingleQuote, '&#39;');
		},
		getObject: function (name, roots, add) {
			// The parts of the name we are looking up
			// `['App','Models','Recipe']`
			var parts = name ? name.split('.') : [],
				length = parts.length,
				current, r = 0,
				i, container, rootsLength;
			// Make sure roots is an `array`.
			roots = can.isArray(roots) ? roots : [roots || window];
			rootsLength = roots.length;
			if (!length) {
				return roots[0];
			}
			// For each root, mark it as current.
			for (r; r < rootsLength; r++) {
				current = roots[r];
				container = undefined;
				// Walk current to the 2nd to last object or until there
				// is not a container.
				for (i = 0; i < length && isContainer(current); i++) {
					container = current;
					current = getNext(container, parts[i]);
				}
				// If we found property break cycle
				if (container !== undefined && current !== undefined) {
					break;
				}
			}
			// Remove property from found container
			if (add === false && current !== undefined) {
				delete container[parts[i - 1]];
			}
			// When adding property add it to the first root
			if (add === true && current === undefined) {
				current = roots[0];
				for (i = 0; i < length && isContainer(current); i++) {
					current = getNext(current, parts[i], true);
				}
			}
			return current;
		},
		capitalize: function (s, cache) {
			// Used to make newId.
			return s.charAt(0)
				.toUpperCase() + s.slice(1);
		},
		camelize: function (str) {
			return convertBadValues(str)
				.replace(strHyphenMatch, function (match, chr) {
					return chr ? chr.toUpperCase() : '';
				});
		},
		hyphenate: function (str) {
			return convertBadValues(str)
				.replace(strCamelMatch, function (str, offset) {
					return str.charAt(0) + '-' + str.charAt(1)
						.toLowerCase();
				});
		},
		underscore: function (s) {
			return s.replace(strColons, '/')
				.replace(strWords, '$1_$2')
				.replace(strLowUp, '$1_$2')
				.replace(strDash, '_')
				.toLowerCase();
		},
		sub: function (str, data, remove) {
			var obs = [];
			str = str || '';
			obs.push(str.replace(strReplacer, function (whole, inside) {
				// Convert inside to type.
				var ob = can.getObject(inside, data, remove === true ? false : undefined);
				if (ob === undefined || ob === null) {
					obs = null;
					return '';
				}
				// If a container, push into objs (which will return objects found).
				if (isContainer(ob) && obs) {
					obs.push(ob);
					return '';
				}
				return '' + ob;
			}));
			return obs === null ? obs : obs.length <= 1 ? obs[0] : obs;
		},
		replacer: strReplacer,
		undHash: strUndHash
	});
	return can;
});