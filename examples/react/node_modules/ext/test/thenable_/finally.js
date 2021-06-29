"use strict";

var assert        = require("chai").assert
  , sinon         = require("sinon")
  , identity      = require("../../function/identity")
  , finallyMethod = require("../../thenable_/finally");

var throwUnexpected = function () { throw new Error("Unexpected"); };

describe("thenable_/finally", function () {
	describe("Successful on fulfilled", function () {
		var callback, input, result;

		before(function () {
			callback = sinon.fake();
			input = Promise.resolve("foo");
			result = finallyMethod.call(input, callback);
			return result;
		});

		it("Should invoke finally callback", function () { assert(callback.calledOnce); });

		it("Return promise should fulfill with original result", function () {
			return Promise.all([input, result]).then(function (results) {
				assert.equal(results[0], results[1]);
			});
		});
	});

	describe("Successful on rejected", function () {
		var callback, input, result;

		before(function () {
			var inputError = new Error("Rejected");
			callback = sinon.fake();
			input = Promise.reject(inputError);
			result = finallyMethod.call(input, callback);
			return result["catch"](function (error) { if (error !== inputError) throw error; });
		});

		it("Should invoke finally callback", function () { assert(callback.calledOnce); });

		it("Return promise should fulfill with original result", function () {
			return Promise.all([input["catch"](identity), result["catch"](identity)]).then(
				function (results) { assert.equal(results[0], results[1]); }
			);
		});
	});

	describe("Failed on fulfilled", function () {
		var callback, result, finallyError;

		before(function () {
			finallyError = new Error("Finally Rejected");
			callback = sinon.fake["throws"](finallyError);
			var input = Promise.resolve("foo");
			result = finallyMethod.call(input, callback);
			return result["catch"](function (error) { if (error !== finallyError) throw error; });
		});

		it("Should invoke finally callback", function () { assert(callback.calledOnce); });

		it("Return promise should be rejected with finally error", function () {
			return result.then(throwUnexpected, function (error) {
				assert.equal(finallyError, error);
			});
		});
	});

	describe("Failed on rejected", function () {
		var callback, result, finallyError;

		before(function () {
			finallyError = new Error("Finally Rejected");
			callback = sinon.fake["throws"](finallyError);
			var input = Promise.reject(new Error("Rejected"));
			result = finallyMethod.call(input, callback);
			return result["catch"](function (error) { if (error !== finallyError) throw error; });
		});

		it("Should invoke finally callback", function () { assert(callback.calledOnce); });

		it("Return promise should be rejected with finally error", function () {
			return result.then(throwUnexpected, function (error) {
				assert.equal(finallyError, error);
			});
		});
	});
});
