/** MIT License (c) copyright B Cavalier & J Hann */

(function (define, globalEval) {
define(function () {
"use strict";

	/**
	 * Transforms the supplied property value using the supplied expression
	 * @param value anything - the value to transform
	 * @param propName {String} the name of the property being transformed
	 * @param expression {String} the expression to execute.  It will have
	 * access to variables named "value" and "propName".
	 * @returns transformed value
	 */
	return function expressionTransform (value, propName, item, expression) {
		try {
			return globalEval.call(expression, value, propName, item);
		}
		catch (ex) {
			return ex.message;
		}
	};

});
}(
	typeof define == 'function'
		? define
		: function (factory) { module.exports = factory(); },
	function (value, propName, item) {
		var window, document;
		// the only variables in scope are value, propName, item, and any
		// globals not listed in the var statement above. we have to cast to
		// string because of "oddities" between `eval` and `this`.
		return eval('' + this);
	}
));