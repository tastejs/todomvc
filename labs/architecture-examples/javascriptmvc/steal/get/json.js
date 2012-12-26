(function() {
	var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
		isArray = function( arr ) {
			return Object.prototype.toString.call(arr) === "[object Array]";
		};


	JSONparse = function( text, reviver ) {

			var j;

			function walk(holder, key) {
				var k, v, value = holder[key];
				if ( value && typeof value === 'object' ) {
					for ( k in value ) {
						if ( Object.hasOwnProperty.call(value, k) ) {
							v = walk(value, k);
							if ( v !== undefined ) {
								value[k] = v;
							} else {
								delete value[k];
							}
						}
					}
				}
				return reviver.call(holder, key, value);
			}

			cx.lastIndex = 0;
			if ( cx.test(text) ) {
				text = text.replace(cx, function( a ) {
					return '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
				});
			}
			if (/^[\],:{}\s]*$/
				.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@')
				.replace(/["'][^"\\\n\r]*["']|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
				.replace(/(?:^|:|,)(?:\s*\[)+/g, '')) ) {


				j = eval('(' + text + ')');

				// In the optional fourth stage, we recursively walk the new structure, passing
				// each name/value pair to a reviver function for possible transformation.
				return typeof reviver === 'function' ? walk({
					'': j
				}, '') : j;
			}

			// If the text is not JSON parseable, then a SyntaxError is thrown.
			throw new SyntaxError('JSONparse');
		};

	// Format integers to have at least two digits.
	var toIntegersAtLease = function( n )
	{
		return n < 10 ? '0' + n : n;
	};

	// Yes, it polutes the Date namespace, but we'll allow it here, as
	// it's damned usefull.
	Date.prototype.toJSON = function( date )
	{
		return this.getUTCFullYear() + '-' + toIntegersAtLease(this.getUTCMonth()) + '-' + toIntegersAtLease(this.getUTCDate());
	};

	var escapeable = /["\\\x00-\x1f\x7f-\x9f]/g;
	var meta = { // table of character substitutions
		'\b': '\\b',
		'\t': '\\t',
		'\n': '\\n',
		'\f': '\\f',
		'\r': '\\r',
		'"': '\\"',
		'\\': '\\\\'
	};

	var quoteString = function( string )
	// Places quotes around a string, inteligently.
	// If the string contains no control characters, no quote characters, and no
	// backslash characters, then we can safely slap some quotes around it.
	// Otherwise we must also replace the offending characters with safe escape
	// sequences.
	{
		if ( escapeable.test(string) ) {
			return '"' + string.replace(escapeable, function( a ) {
				var c = meta[a];
				if ( typeof c === 'string' ) {
					return c;
				}
				c = a.charCodeAt();
				return '\\u00' + Math.floor(c / 16).toString(16) + (c % 16).toString(16);
			}) + '"';
		}
		return '"' + string + '"';
	};
	var vtoJSON = null;
	var steal = steal;
	vtoJSON = function( o, compact ) {
		var type = typeof(o);

		if ( type == "undefined" ){
			return "undefined";
		} else if ( type == "number" || type == "boolean" ) {
			return o + "";
		} else if ( o === null ){
			return "null";
		}

		// Is it a string?
		if ( type == "string" ) {
			return quoteString(o);
		}

		// Does it have a .toJSON function?
		if ( type == "object" && typeof o.toJSON == "function" ) {
			return o.toJSON(compact);
		}

		// Is it an array?
		if ( isArray(o) ) {
			var ret = [];
			for ( var i = 0; i < o.length; i++ ) {
				ret.push(vtoJSON(o[i], compact));
			}
			if ( compact ) {
				return "[" + ret.join(",") + "]";
			}
			else {
				return "[" + ret.join(", ") + "]";
			}
		}

		// If it's a function, we have to warn somebody!
		if ( type == "function" ) {
			throw new TypeError("Unable to convert object of type 'function' to json.");
		}

		// It's probably an object, then.
		var ret = [];
		for ( var k in o ) {
			var name;
			type = typeof(k);

			if ( type == "number" ) {
				name = '"' + k + '"';
			}
			else if ( type == "string" ) {
				name = quoteString(k);
			}
			else {
				continue; //skip non-string or number keys
			}
			
			var val = vtoJSON(o[k], compact);
			if ( typeof(val) != "string" ) {
				// skip non-serializable values
				continue;
			}

			if ( compact ) {
				ret.push(name + ":" + val);
			}
			else {
				ret.push(name + ": " + val);
			}
		}
		return "{" + ret.join(", ") + "}";
	};
	toJSON = vtoJSON;

})();