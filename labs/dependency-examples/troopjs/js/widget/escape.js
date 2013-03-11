define( ['jquery'], function EscapeModule($) {
	var entityMap = {
		escape: {
			'&': '&amp;',
			'<': '&lt;',
			'>': '&gt;',
			'"': '&quot;',
			"'": '&#x27;',
			'/': '&#x2F;'
		}
	},
		invert = function(obj) {
			var result = {};
			for (var key in obj) {
				if (obj.hasOwnProperty(key)) {
					result[obj[key]] = key;
				}
			}
			return result;
		},
		nativeKeys = Object.keys,
		keys = nativeKeys || function(obj) {
			if (obj !== Object(obj)) {
				throw new TypeError('Invalid object');
			}
			var keys = [];
			for (var key in obj) {
				if (obj.hasOwnProperty(key)) {
					keys[keys.length] = key;
				}
			}
			return keys;
		};
		exports = {};

	entityMap.unescape = invert(entityMap.escape);

	var entityRegexes = {
		escape: new RegExp('[' + keys(entityMap.escape).join('') + ']', 'g'),
		unescape: new RegExp('(' + keys(entityMap.unescape).join('|') + ')', 'g')
	};

	$.each(['escape', 'unescape'], function(i, method) {
		exports[method] = function(string) {
			if (string == null) {
				return '';
			}
			return ('' + string).replace(entityRegexes[method], function(match) {
				return entityMap[method][match];
			});
		};
	});

	return exports;
});
