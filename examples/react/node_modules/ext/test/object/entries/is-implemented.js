"use strict";

var assert        = require("chai").assert
  , isImplemented = require("../../../object/entries/is-implemented");

describe("object/entries/is-implemented", function () {
	assert.equal(typeof isImplemented(), "boolean");
});
