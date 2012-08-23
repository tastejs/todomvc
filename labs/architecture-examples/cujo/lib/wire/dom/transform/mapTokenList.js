(function (define) {
define(function () {
"use strict";

	var parser = /(^|\s+)([^\s]+)/g;

	return function (map, options) {
		var fallbackToken;

		if (!options) options = {};

		fallbackToken = options.otherwise || '';

		return function translateTokenLists (tokenList) {
			tokenList = '' + tokenList;
			return tokenList.replace(parser, function (m, s, token) {
				var trans = map[token];
				// if there's a delimiter already (spaces, typically),
				// replace it. if a translated value exists, use it.
				// otherwise, use original token.
				return (s ? ' ' : s) + (trans ? trans : fallbackToken);
			});
		}

	};

});
}(
	typeof define == 'function' && define.amd
		? define
		: function (factory) { module.exports = factory(); }
));
