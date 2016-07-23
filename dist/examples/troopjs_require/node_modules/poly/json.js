/** @license MIT License (c) copyright 2013 original authors */
/**
 * JSON polyfill / shim
 *
 * @author Brian Cavalier
 * @author John Hann
 */
(function (define) {
define(function (require) {
"use strict";
	return require('./support/json3');
});
}(
	typeof define == 'function' && define.amd
		? define
		: function (factory) { module.exports = factory(require); }
));
