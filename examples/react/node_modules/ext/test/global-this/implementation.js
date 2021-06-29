"use strict";

var isObject   = require("type/object/is")
  , assert     = require("chai").assert
  , globalThis = require("../../global-this/implementation");

describe("global-this/implementation", function () {
	it("Should be an object", function () { assert(isObject(globalThis)); });
	it("Should be a global object", function () { assert.equal(globalThis.Array, Array); });
	it("Internal resolution should not introduce side-effects", function () {
		assert(!("__global__" in Object.prototype));
	});
});
