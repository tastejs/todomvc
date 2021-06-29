"use strict";

var assert        = require("chai").assert
  , isImplemented = require("../../../string_/includes/is-implemented");

describe("string_/includes/is-implemented", function () {
	it("Should return boolean", function () { assert.equal(typeof isImplemented(), "boolean"); });
});
