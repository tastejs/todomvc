/** @license MIT License (c) copyright B Cavalier & J Hann */

(function (define) {
define(function () {
	"use strict";

	/**
	 * Creates a composite validator from the supplied array of validators.
	 * The composite validator will run each validator and merge the validation
	 * results into a final, composite validation results object.
	 *
	 * @param validators {Array} array of validator functions
	 *
	 * @return {Object} composite validation results
	 */
	return function composeValidators(validators) {
		return function compositeValidator(object) {
			var validator, i, compositeResults;

			i = 0;
			compositeResults = { valid: true };

			while(validator = validators[i++]) {
				mergeResults(compositeResults, validator(object));
			}

			return compositeResults;
		}
	};

	/**
	 * Merge validation results from a single validator into composite results
	 * @param merged {Object} composite validation results so far
	 * @param results {Object} validation results from one validator
	 */
	function mergeResults(merged, results) {
		if(results) {
			merged.valid = merged.valid && results.valid;

			if(results.errors) {
				merged.errors = (merged.errors || []).concat(results.errors);
			}
		}

	}

});
}(
typeof define == 'function'
	? define
	: function (factory) { module.exports = factory(); }
));