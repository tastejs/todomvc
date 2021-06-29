"use strict";

var assert = require("chai").assert
  , ceil10 = require("../../math/ceil-10");

describe("math/ceil-10", function () {
	it("Should ceil", function () {
		assert.equal(ceil10(55.51, -1), 55.6);
		assert.equal(ceil10(51, 1), 60);
		assert.equal(ceil10(-55.59, -1), -55.5);
		assert.equal(ceil10(-59, 1), -50);
	});
});
