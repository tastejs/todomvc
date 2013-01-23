/*
* CanJS - 1.1.3 (2012-12-11)
* http://canjs.us/
* Copyright (c) 2012 Bitovi
* Licensed MIT
*/
define(function () {

	var can = window.can || {};
	if (typeof GLOBALCAN === 'undefined' || GLOBALCAN !== false) {
		window.can = can;
	}

	can.isDeferred = function (obj) {
		var isFunction = this.isFunction;
		// Returns `true` if something looks like a deferred.
		return obj && isFunction(obj.then) && isFunction(obj.pipe);
	};
	return can;
});