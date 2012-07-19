define(['curl'], function (curl) {
"use strict";

	return {

		assertEquals: function assertEquals (name, test, value) {
			return this.runTest(name, test, value);
		},

		assertTrue: function assertTrue (name, test) { return this.runTest(name, test, true); },

		assertFalse: function assertFalse (name, test) { return this.runTest(name, test, false); },

		runTest: function runTest (name, test, value) {

			try {
				var actual = test();
				this.output(name + ':', actual === value ? 'succeeded' :
					('failed: expected <<' + value + '>>, got <<' + actual + '>> **********'));
			}
			catch (ex) {
				this.fail(name + ':' + 'exception thrown: ' + ex.message + ' **********');
			}
		},

		fail: function fail (msg) {
			this.output(msg);
		},

		output: function output () {
			var logNode, args;
			args = [].slice.call(arguments);
			curl(['curl/domReady'], function () {
				var msgNode, message;
				logNode || (logNode = document.getElementById('output'));
				msgNode = document.createElement('div');
				message = args.join(' ');
				msgNode.appendChild(document.createTextNode(message));
				logNode.appendChild(msgNode);
			});
		}


	}
});