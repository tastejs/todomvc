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

	/**
	 * Creates a dom class mapper (see mapClasses) that maps numbers to
	 * a cardinality class, such as 0 -> 'zero', 1 -> 'one', 2 -> 'many'.
	 * An optional prefix may be supplied to allow specialized class names,
	 * such as 0 -> 'items-in-cart-zero', 1 -> 'items-in-cart-one', 2 -> 'items-in-cart-many'
	 *
	 * @param options {Object|String} if a String, it is used directly as the prefix.
	 * @param [options.prefix] {String} Prefix to prepend to cardinality classes, a '-'
	 * will be appended to this when forming the cardinality class.
	 * @param [options.otherwise] {String} suffix to use when the input number
	 * is not 0 or 1, defaults to "many".  This should *not* already contain the prefix.
	 *
	 * @return {Function} function that will map a number to a css class name.
	 */
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
		options.map = classMap;

		return mapClasses(options);
	}

});
}(
	typeof define == 'function' && define.amd
		? define
		: function (factory) { module.exports = factory(require); }
));