"use strict";

var assert = require("chai").assert
  , random = require("../../string/random");

var isValidFormat = RegExp.prototype.test.bind(/^[a-z0-9]+$/);

describe("string/random", function () {
	it("Should return string", function () { assert.equal(typeof random(), "string"); });
	it("Should return by default string of length 10", function () {
		assert.equal(random().length, 10);
	});
	it("Should support custom charset", function () {
		var charset = "abc";
		var result = random({ charset: charset });
		assert.equal(result.length, 10);
		for (var i = 0; i < result.length; ++i) {
			assert.isAtLeast(charset.indexOf(result.charAt(i)), 0);
		}
	});
	it("Should ensure unique string with `isUnique` option", function () {
		assert.notEqual(random({ isUnique: true }), random({ isUnique: true }));
	});
	it("Should contain only ascii chars", function () { assert(isValidFormat(random())); });
	it("Should support `length` option", function () {
		assert.equal(random({ length: 4 }).length, 4);
		assert.equal(random({ length: 100 }).length, 100);
		assert.equal(random({ length: 0 }).length, 0);
	});
	it("Should crash if unable to generate unique string with `isUnique` optin", function () {
		random({ length: 0, isUnique: true });
		assert["throws"](function () {
			random({ length: 0, isUnique: true });
		}, "Cannot generate random string");
	});
});
