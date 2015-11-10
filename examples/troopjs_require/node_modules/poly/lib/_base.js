/** @license MIT License (c) copyright 2013 original authors */
/**
 * poly common functions
 *
 * @author Brian Cavalier
 * @author John Hann
 */
(function (define) {
define(function (require, exports) {

	var toString;

	toString = ({}).toString;

	exports.isFunction = function (o) {
		return typeof o == 'function';
	};

	exports.isString = function (o) {
		return toString.call(o) == '[object String]';
	};

	exports.isArray = function (o) {
		return toString.call(o) == '[object Array]';
	};

	exports.toString = function (o) {
		return toString.apply(o);
	};

	exports.createCaster = function (caster, name) {
		return function cast (o) {
			if (o == null) throw new TypeError(name + ' method called on null or undefined');
			return caster(o);
		}
	};

	exports.isElement = function(o){
		return typeof HTMLElement == 'undefined'
			? 'tagName' in o && 'nodeName' in o
			: o instanceof HTMLELEMENT;
	};

});
}(
	typeof define == 'function' && define.amd
		? define
		: function (factory) { factory(require, exports); }
));
