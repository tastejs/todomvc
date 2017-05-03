/**
 * curl text loader plugin
 *
 * (c) copyright 2011, unscriptable.com
 *
 * TODO: load xdomain text, too
 * 
 */

define(/*=='text',==*/ function () {

	var progIds = ['Msxml2.XMLHTTP', 'Microsoft.XMLHTTP', 'Msxml2.XMLHTTP.4.0'],
		// collection of modules that have been written to the built file
		built = {};

	function xhr () {
		if (typeof XMLHttpRequest !== "undefined") {
			// rewrite the getXhr method to always return the native implementation
			xhr = function () { return new XMLHttpRequest(); };
		}
		else {
			// keep trying progIds until we find the correct one, then rewrite the getXhr method
			// to always return that one.
			var noXhr = xhr = function () {
					throw new Error("getXhr(): XMLHttpRequest not available");
				};
			while (progIds.length > 0 && xhr === noXhr) (function (id) {
				try {
					new ActiveXObject(id);
					xhr = function () { return new ActiveXObject(id); };
				}
				catch (ex) {}
			}(progIds.shift()));
		}
		return xhr();
	}

	function fetchText (url, callback, errback) {
		var x = xhr();
		x.open('GET', url, true);
		x.onreadystatechange = function (e) {
			if (x.readyState === 4) {
				if (x.status < 400) {
					callback(x.responseText);
				}
				else {
					errback(new Error('fetchText() failed. status: ' + x.statusText));
				}
			}
		};
		x.send(null);
	}

	function nameWithExt (name, defaultExt) {
		return name.lastIndexOf('.') <= name.lastIndexOf('/') ?
			name + '.' + defaultExt : name;
	}

	function error (ex) {
		if (console) {
			console.error ? console.error(ex) : console.log(ex.message);
		}
	}

	function jsEncode (text) {
		// TODO: hoist the map and regex to the enclosing scope for better performance
		var map = { 34: '\\"', 13: '\\r', 12: '\\f', 10: '\\n', 9: '\\t', 8: '\\b' };
		return text.replace(/(["\n\f\t\r\b])/g, function (c) {
			return map[c.charCodeAt(0)];
		});
	}

	return {

		load: function (resourceName, req, callback, config) {
			// remove suffixes (future)
			// hook up callbacks
			var cb = callback.resolve || callback,
				eb = callback.reject || error;
			// get the text
			fetchText(req['toUrl'](resourceName), cb, eb);
		},

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
