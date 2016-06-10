(function (define, global, document) {
define(function () {
	"use strict";

	function has(feature) {
		var test = has.cache[feature];
		if (typeof test == 'function') {
			// run it now and cache result
			test = (has.cache[feature] = has.cache[feature]());
		}
		return test;
	}

	has.cache = {
		"dom-addeventlistener": function () {
			return document && 'addEventListener' in document || 'addEventListener' in global;
		},
		"dom-createevent": function () {
			return document && 'createEvent' in document;
		}
	};

	return has;

});
}(
	typeof define == 'function'
		? define
		: function (factory) { module.exports = factory(); },
	this,
	this.document
));