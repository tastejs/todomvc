/** MIT License (c) copyright B Cavalier & J Hann */

(function (define) {
define(function () {
"use strict";

	return function(transform, options) {
		var configuredArgs;

		configuredArgs = Array.prototype.slice.call(arguments, 1);

		function configured() {
			var args = Array.prototype.slice.call(arguments);
			return transform.apply(this, args.concat(configuredArgs));
		}

		var inverse = transform.inverse;

		if(typeof inverse == 'function') {
			configured.inverse = function() {
				var args = Array.prototype.slice.call(arguments);
				return inverse.apply(this, args.concat(configuredArgs));
			};

			configured.inverse.inverse = configured;
		}

		return configured;
	}

});
}(
	typeof define == 'function'
		? define
		: function (factory) { module.exports = factory(); }
));