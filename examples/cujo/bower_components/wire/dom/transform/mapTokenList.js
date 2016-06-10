(function (define) {
define(function () {
"use strict";

	var parser = /(^|\s+)([\S]+)/g;

	/**
	 * Creates a function that will replace tokens using the supplied
	 * token map.
	 * @param map {Object} map of token -> replacement
	 * @param [options.otherwise] {String} replacement to use for tokens
	 * not found in map
	 * @return {Function}
	 */
	return function (map, options) {
		var fallbackToken;

		if (!options) options = {};

		fallbackToken = options.otherwise || '';

		/**
		 * Replaces tokens in tokenList using the configured map and options
		 * @param tokenList {String|*} String of space-separated tokens, or anything
		 * coercable thereto.
		 * @return {String} tokenList with tokens replaced
		 */
		return function translateTokenLists (tokenList) {
			tokenList = '' + tokenList;
			return tokenList.replace(parser, function (m, s, token) {
				// if there's a delimiter already (spaces, typically),
				// replace it. if a translated value exists, use it.
				// otherwise, use original token.
				var s2 = s + (token in map ? map[token] : fallbackToken);
				return s2 == s ? '' : s2;
			});
		}

	};

});
}(
	typeof define == 'function' && define.amd
		? define
		: function (factory) { module.exports = factory(); }
));