"use strict";

module.exports = function (t, a) {
	a.ok(t && typeof t === "object");
	a(typeof t.Array, "function");
	a("__global__" in Object.prototype, false);
};
