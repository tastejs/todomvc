"use strict";

var microtaskDelay = require("../../../../function/#/microtask-delay");

if (typeof Promise !== "function") global.Promise = require("plain-promise");

module.exports = function (t, a) {
	return {
		Success: function (d) {
			var invoked;
			t.call(Promise.resolve("foo"), function () {
				invoked = true;
				return "bar";
			}).then(
				microtaskDelay.call(function (result) {
					a(result, "foo");
					a(invoked, true);
					d();
				}, microtaskDelay.call(d))
			);
		},
		Failure: function (d) {
			var invoked;
			var error = new Error("Some error");
			t.call(Promise.reject(error), function () {
				invoked = true;
				return "bar";
			}).then(
				microtaskDelay.call(function () {
					a.never();
					d();
				}),
				microtaskDelay.call(function (result) {
					a(result, error);
					a(invoked, true);
					d();
				})
			);
		},
		SuccessFinallyError: function (d) {
			var invoked, finallyError = new Error("Finally error");
			t.call(Promise.resolve("foo"), function () {
				invoked = true;
				throw finallyError;
			}).then(
				microtaskDelay.call(function () {
					a.never();
					d();
				}),
				microtaskDelay.call(function (result) {
					a(result, finallyError);
					a(invoked, true);
					d();
				})
			);
		},
		FailureFinallyError: function (d) {
			var invoked, finallyError = new Error("Finally error");
			t.call(Promise.reject(new Error("Some error")), function () {
				invoked = true;
				throw finallyError;
			}).then(
				microtaskDelay.call(function () {
					a.never();
					d();
				}),
				microtaskDelay.call(function (result) {
					a(result, finallyError);
					a(invoked, true);
					d();
				})
			);
		}
	};
};
