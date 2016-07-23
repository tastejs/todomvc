/*global define */
'use strict';

// tmpl function scooped from underscore.
// http://documentcloud.github.com/underscore/#template
define(function () {
	var _ = {};

	// List of HTML entities for escaping.
	var entityMap = {
		escape: {
			'&': '&amp;',
			'<': '&lt;',
			'>': '&gt;',
			'"': '&quot;',
			/*jshint quotmark:false */
			"'": '&#x27;',
			'/': '&#x2F;'
		}
	};

	var escapeKeys = '&<>"\'/';
	var unescapeKeys = '&amp;|&lt;|&gt;|&quot;|&#x27;|&#x2F;';

	// Regexes containing the keys and values listed immediately above.
	var entityRegexes = {
		escape:   new RegExp('[' + escapeKeys + ']', 'g'),
		unescape: new RegExp('(' + unescapeKeys + ')', 'g')
	};

	// Functions for escaping and unescaping strings to/from HTML interpolation.
	['escape', 'unescape'].forEach(function (method) {
		_[method] = function (string) {
			if (string === null || string === undefined) {
				return '';
			}

			return ('' + string).replace(entityRegexes[method], function (match) {
				return entityMap[method][match];
			});
		};
	});

	var settings = {
		evaluate: /<%([\s\S]+?)%>/g,
		interpolate: /<%=([\s\S]+?)%>/g,
		escape: /<%-([\s\S]+?)%>/g
	};

	var noMatch = /(.)^/;
	var escapes = {
		/*jshint quotmark:false */
		"'": "'",
		'\\': '\\',
		'\r': 'r',
		'\n': 'n',
		'\t': 't',
		'\u2028': 'u2028',
		'\u2029': 'u2029'
	};

	var escaper = /\\|'|\r|\n|\t|\u2028|\u2029/g;

	// JavaScript micro-templating, similar to John Resig's implementation.
	// Underscore templating handles arbitrary delimiters, preserves whitespace,
	// and correctly escapes quotes within interpolated code.
	var template = function (text, data) {
		var render;

		// Combine delimiters into one regular expression via alternation.
		var matcher = new RegExp([
			(settings.escape || noMatch).source,
			(settings.interpolate || noMatch).source,
			(settings.evaluate || noMatch).source
		].join('|') + '|$', 'g');

		// Compile the template source, escaping string literals appropriately.
		var index = 0;
		var source = "__p+='";
		text.replace(matcher, function (match, escape, interpolate, evaluate, offset) {
			source += text.slice(index, offset)
			.replace(escaper, function (match) {
				return '\\' + escapes[match];
			});

			if (escape) {
				source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'";
			}
			if (interpolate) {
				source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
			}
			if (evaluate) {
				source += "';\n" + evaluate + "\n__p+='";
			}
			index = offset + match.length;
			return match;
		});
		source += "';\n";

		// If a variable is not specified, place data values in local scope.
		if (!settings.variable) {
			source = 'with(obj||{}){\n' + source + '}\n';
		}

		source = "var __t,__p='',__j=Array.prototype.join," +
			"print=function(){__p+=__j.call(arguments,'');};\n" +
			source + "return __p;\n";

		try {
			/*jshint evil:true */
			render = new Function(settings.variable || 'obj', '_', source);
		} catch (err) {
			err.source = source;
			throw err;
		}

		if (data) {
			return render(data, _);
		}

		var template = function (data) {
			return render.call(this, data, _);
		};

		// Provide the compiled function source as a convenience for precompilation.
		template.source = 'function(' + (settings.variable || 'obj') + '){\n' + source + '}';

		return template;
	};

	return {
		tmpl: template
	};
});
