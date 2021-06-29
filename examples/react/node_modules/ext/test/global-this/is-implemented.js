"use strict";

var assert        = require("chai").assert
  , isImplemented = require("../../global-this/is-implemented");

describe("global-this/is-implemented", function () {
	it("Should return boolean", function () { assert.equal(typeof isImplemented(), "boolean"); });
});
