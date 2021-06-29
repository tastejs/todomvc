"use strict";

var assert = require("chai").assert;

module.exports = function (includes) {
	it("Should return true when context contains search string", function () {
		assert.equal(includes.call("razdwatrzy", "dwa"), true);
	});
	it("Should return true when context starts with search string", function () {
		assert.equal(includes.call("razdwa", "raz"), true);
	});
	it("Should return true when context ends with search string", function () {
		assert.equal(includes.call("razdwa", "dwa"), true);
	});
	it("Should return false when string doesn't contain search string", function () {
		assert.equal(includes.call("razdwa", "trzy"), false);
	});
	it("Should return false when context is empty and search string is not", function () {
		assert.equal(includes.call("", "a"), false);
	});
	it("Should return false when search string is longer than context", function () {
		assert.equal(includes.call("raz", "razdwa"), false);
	});
	it("Should return true when search string is same as context ", function () {
		assert.equal(includes.call("raz", "raz"), true);
	});
	it("Should return true when context starts with search string", function () {
		assert.equal(includes.call("razdwa", "raz"), true);
	});
	it("Should return true when search string is empty", function () {
		assert.equal(includes.call("raz", ""), true);
	});
	it("Should return true when both context and search string are empty", function () {
		assert.equal(includes.call("", ""), true);
	});
	it("Should support position argument", function () {
		assert.equal(includes.call("razdwa", "raz", 1), false);
		assert.equal(includes.call("razdwa", "dwa", 1), true);
	});
};
