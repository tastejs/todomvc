"use strict";

module.exports = function (t, a) {
	// Just sanity checks, as logic is tested at isPlainFunction
	var obj = {};
	a(t(obj), obj, "Reguar object instance");
	obj = Object.create(null);
	a(t(obj), obj, "Null prototype");
	a.throws(
		function () {
			t(function () {});
		},
		TypeError,
		"Error"
	);
};
