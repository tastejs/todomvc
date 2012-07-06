/** MIT License (c) copyright B Cavalier & J Hann */

(function (define) {
define(function (require) {
	"use strict";

	var property = require('./property');

	return property('id');

});
}(
	typeof define == 'function'
		? define
		: function (factory) { module.exports = factory(require); }
));