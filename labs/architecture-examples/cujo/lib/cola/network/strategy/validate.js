(function (define) {
define(function () {
	"use strict";

	/**
	 * Executes a configured validator and issues a validation event
	 * with the results in response to an add or update event.
	 * *Cancels* the add or update if validation fails
	 * @param [options.validator] {Function} validator function
	 * @return {Function} a network strategy function.
	 */
	return function configure (options) {

		var validator = (options && options.validator) || defaultValidator;

		return function validate (source, dest, data, type, api) {
			// Run validator on items before add or update
			var result;

			if (api.isBefore() && ('add' == type || 'update' == type)) {
				result = validator(data);

				if (!result.valid) api.cancel();

				api.queueEvent(source, result, 'validate');
			}
		};

	};

	function defaultValidator(item) {
		return { valid: item != null };
	}

});
}(
	typeof define == 'function' && define.amd
		? define
		: function (factory) { module.exports = factory(); }
));