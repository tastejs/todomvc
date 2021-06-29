"use strict";

var assert  = require("chai").assert
  , round10 = require("../../math/round-10");

describe("math/round-10", function () {
	it("Should round", function () {
		assert.equal(round10(55.55, -1), 55.6);
		assert.equal(round10(55.549, -1), 55.5);
		assert.equal(round10(55, 1), 60);
		assert.equal(round10(54.9, 1), 50);
		assert.equal(round10(-55.55, -1), -55.5);
		assert.equal(round10(-55.551, -1), -55.6);
		assert.equal(round10(-55, 1), -50);
		assert.equal(round10(-55.1, 1), -60);
		assert.equal(round10(1.005, -2), 1.01);
		assert.equal(round10(-1.005, -2), -1.0);
	});
});
