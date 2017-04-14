/*
* CanJS - 1.1.2 (2012-11-23)
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