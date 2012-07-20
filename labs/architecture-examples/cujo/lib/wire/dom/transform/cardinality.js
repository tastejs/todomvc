(function (define) {
define(function (require) {
	"use strict";

	var mapClasses, defaultClasses, defaultOtherwise;

	mapClasses = require('./mapClasses');

	defaultClasses = {
		0: 'zero',
		1: 'one'
	};

	defaultOtherwise = 'many';

	return function(options) {

		var classMap, prefix, key;

		classMap = {};
		prefix = '';

		if(!options) options = {};

		if(typeof options == 'string') {
			prefix = options + '-';
			options = {};
		} else if(options.prefix) {
			prefix = options.prefix + '-';
		}

		for(key in defaultClasses) {
			classMap[key] = prefix + defaultClasses[key];
		}

		options.otherwise = prefix + defaultOtherwise;

		return mapClasses(classMap, options);
	}

});
}(
	typeof define == 'function' && define.amd
		? define
		: function (factory) { module.exports = factory(require); }
));