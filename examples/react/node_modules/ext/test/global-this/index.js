"use strict";

var isObject   = require("type/object/is")
  , assert     = require("chai").assert
  , globalThis = require("../../global-this");

describe("global-this", function () {
	it("Should be an object", function () { assert(isObject(globalThis)); });
	it("Should be a global object", function () { assert.equal(globalThis.Array, Array); });
});
