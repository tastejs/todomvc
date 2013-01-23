/*
* CanJS - 1.1.3 (2012-12-11)
* http://canjs.us/
* Copyright (c) 2012 Bitovi
* Licensed MIT
*/
define(['can/util/library'], function (can) {
	// ##string.js
	// _Miscellaneous string utility functions._  
	// Several of the methods in this plugin use code adapated from Prototype
	// Prototype JavaScript framework, version 1.6.0.1.
	// © 2005-2007 Sam Stephenson
	var undHash = /_|-/,
		colons = /\=\=/,
		words = /([A-Z]+)([A-Z][a-z])/g,
		lowUp = /([a-z\d])([A-Z])/g,
		dash = /([a-z\d])([A-Z])/g,
		replacer = /\{([^\}]+)\}/g,
		quote = /"/g,
		singleQuote = /'/g,

		// Returns the `prop` property from `obj`.
		// If `add` is true and `prop` doesn't exist in `obj`, create it as an 
		// empty object.
		getNext = function (obj, prop, add) {
			return prop in obj ? obj[prop] : (add && (obj[prop] = {}));
		},

		// Returns `true` if the object can have properties (no `null`s).
		isContainer = function (current) {
			return (/^f|^o/).test(typeof current);
		};

	can.extend(can, {
		// Escapes strings for HTML.
		esc: function (content) {
			// Convert bad values into empty strings
			var isInvalid = content === null || content === undefined || (isNaN(content) && ("" + content === 'NaN'));
			return ("" + (isInvalid ? '' : content)).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(quote, '&#34;').replace(singleQuote, "&#39;");
		},


		getObject: function (name, roots, add) {

			// The parts of the name we are looking up  
			// `['App','Models','Recipe']`
			var parts = name ? name.split('.') : [],
				length = parts.length,
				current, r = 0,
				ret, i;

			// Make sure roots is an `array`.
			roots = can.isArray(roots) ? roots : [roots || window];

			if (!length) {
				return roots[0];
			}

			// For each root, mark it as current.
			while (roots[r]) {
				current = roots[r];

				// Walk current to the 2nd to last object or until there 
				// is not a container.
				for (i = 0; i < length - 1 && isContainer(current); i++) {
					current = getNext(current, parts[i], add);
				}

				// If we can get a property from the 2nd to last object...
				if (isContainer(current)) {

					// Get (and possibly set) the property.
					ret = getNext(current, parts[i], add);

					// If there is a value, we exit.
					if (ret !== undefined) {
						// If `add` is `false`, delete the property
						if (add === false) {
							delete current[parts[i]];
						}
						return ret;

					}
				}
				r++;
			}
		},
		// Capitalizes a string.
		capitalize: function (s, cache) {
			// Used to make newId.
			return s.charAt(0).toUpperCase() + s.slice(1);
		},

		// Underscores a string.
		underscore: function (s) {
			return s.replace(colons, '/').replace(words, '$1_$2').replace(lowUp, '$1_$2').replace(dash, '_').toLowerCase();
		},
		// Micro-templating.
		sub: function (str, data, remove) {
			var obs = [];

			obs.push(str.replace(replacer, function (whole, inside) {

				// Convert inside to type.
				var ob = can.getObject(inside, data, remove === undefined ? remove : !remove);

				if (ob === undefined) {
					obs = null;
					return "";
				}

				// If a container, push into objs (which will return objects found).
				if (isContainer(ob) && obs) {
					obs.push(ob);
					return "";
				}

				return "" + ob;
			}));

			return obs === null ? obs : (obs.length <= 1 ? obs[0] : obs);
		},

		// These regex's are used throughout the rest of can, so let's make
		// them available.
		replacer: replacer,
		undHash: undHash
	});
	return can;
});