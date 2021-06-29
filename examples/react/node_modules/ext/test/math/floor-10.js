"use strict";

var assert  = require("chai").assert
  , floor10 = require("../../math/floor-10");

describe("math/floor-10", function () {
	it("Should floor", function () {
		assert.equal(floor10(55.59, -1), 55.5);
		assert.equal(floor10(59, 1), 50);
		assert.equal(floor10(-55.51, -1), -55.6);
		assert.equal(floor10(-51, 1), -60);
	});
});
