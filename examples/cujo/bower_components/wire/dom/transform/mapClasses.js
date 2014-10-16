(function (define) {
define(function (require) {
"use strict";

	var mapTokenList, replaceClasses;

	mapTokenList = require('./mapTokenList');
	replaceClasses = require('./replaceClasses');

	return function (options) {
		var mapper, replacer;

		if(!options) options = {};

		if (!options.group) options.group = mapToGroup(options.map);

		mapper = options.mapper || mapTokenList(options.map, options);
		replacer = options.replacer || replaceClasses(options);

		return options.node
			? function (val) { return replacer(mapper(val)); }
			: function (node, val) { return replacer(node, mapper(val)); };
	};

	function mapToGroup (map) {
		return Object.keys(map).reduce(function (group, p) {
			var str = '' + map[p];
			if (str) group.push(str);
			return group;
		}, []);
	}

});
}(
	typeof define == 'function' && define.amd
		? define
		: function (factory) { module.exports = factory(require); }
));