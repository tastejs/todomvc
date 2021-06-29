"use strict";

var ensureValue = require("type/value/ensure");

var objHasOwnProperty = Object.prototype.hasOwnProperty;

module.exports = function (object) {
	object = Object(ensureValue(object));
	var result = [];
	for (var key in object) {
		if (!objHasOwnProperty.call(object, key)) continue;
		result.push([key, object[key]]);
	}
	return result;
};
