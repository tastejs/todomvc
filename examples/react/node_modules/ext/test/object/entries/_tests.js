"use strict";

var assert = require("chai").assert;

module.exports = function (entries) {
	it("Should resolve entries array for an object", function () {
		assert.deepEqual(entries({ foo: "bar" }), [["foo", "bar"]]);
	});
	it("Should resolve entries array for a primitive", function () {
		assert.deepEqual(entries("raz"), [["0", "r"], ["1", "a"], ["2", "z"]]);
	});
	it("Should throw on non-value", function () {
		assert["throws"](function () { entries(null); }, TypeError);
	});
};
