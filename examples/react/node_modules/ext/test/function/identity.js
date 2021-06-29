"use strict";

var assert   = require("chai").assert
  , identity = require("../../function/identity");

describe("function/identity", function () {
	it("Should return first argument", function () {
		assert.equal(identity("foo"), "foo");
		var object = {};
		assert.equal(identity(object), object);
		assert.equal(identity(), undefined);
		assert.equal(identity(1, 2, 3), 1);
	});
});
