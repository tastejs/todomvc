/*global define*/
/*jshint quotmark:false*/
define([
	'jquery'
], function EscapeModule($) {
	'use strict';

	var invert = function (obj) {
		var result = {};
		var key;

		for (key in obj) {
			if (obj.hasOwnProperty(key)) {
				result[obj[key]] = key;
			}
		}

		return result;
	};

	var fallbackKeys = function (obj) {
		var keys = [];
		var key;

		if (obj !== Object(obj)) {
			throw new TypeError('Invalid object');
		}

		for (key in obj) {
			if (obj.hasOwnProperty(key)) {
				keys[keys.length] = key;
			}
		}

		return keys;
	};

	var keys = Object.keys || fallbackKeys;

	var entityMap = {};

	entityMap.escape = {
		'&': '&amp;',
		'<': '&lt;',
		'>': '&gt;',
		'"': '&quot;',
		"'": '&#x27;',
		'/': '&#x2F;'
	};

	entityMap.unescape = invert(entityMap.escape);

	var entityRegexes = {
		escape: new RegExp('[' + keys(entityMap.escape).join('') + ']', 'g'),
		unescape: new RegExp('(' + keys(entityMap.unescape).join('|') + ')', 'g')
	};

	var exports = {};

	$.each(['escape', 'unescape'], function (i, method) {
		exports[method] = function (string) {
			if (string === null) {
				return '';
			}

			return ('' + string).replace(entityRegexes[method], function (match) {
				return entityMap[method][match];
			});
		};
	});

	return exports;
});
