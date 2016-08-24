/* global sap */

(function () {
	'use strict';

	// Polyfill for .bind()
	// taken from: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind
	if (!Function.prototype.bind) {
		Function.prototype.bind = function (oThis) {
			if (typeof this !== 'function') {
				// closest thing possible to the ECMAScript 5
				// internal IsCallable function
				throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
			}

			var aArgs = Array.prototype.slice.call(arguments, 1);
			var self = this;
			var	FNOP = function () {};
			var	fBound = function () {
					return self.apply(this instanceof FNOP ? this : oThis,
						aArgs.concat(Array.prototype.slice.call(arguments)));
				};

			if (this.prototype) {
				// native functions don't have a prototype
				FNOP.prototype = this.prototype;
			}
			fBound.prototype = new FNOP();

			return fBound;
		};
	}

	sap.ui.getCore().attachInit(function () {
		new sap.m.Shell({
			app: new sap.ui.core.ComponentContainer({
				height: '100%',
				name: 'ToDoMVC'
			})
		}).placeAt('openui5');
	});

})(window);
