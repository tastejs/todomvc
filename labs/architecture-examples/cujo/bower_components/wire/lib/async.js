/** @license MIT License (c) copyright B Cavalier & J Hann */

/**
 * Licensed under the MIT License at:
 * http://www.opensource.org/licenses/mit-license.php
 */

(function(define){
define(function(require) {
	"use strict";

	var when, array;

	when = require('when');
	array = require('./array');

	return {
		sequence: sequence,
		until: until
	};

	/**
	 * Run the supplied async tasks in sequence, with no overlap.
	 * @param tasks {Array} array of functions
	 * @return {Promise} promise that resolves when all tasks
	 * have completed
	 */
	function sequence(tasks /*, args... */) {
		var args = Array.prototype.slice.call(arguments, 1);
		return when.reduce(tasks, function(results, task) {
			return when(task.apply(null, args), function(result) {
				results.push(result);
				return results;
			});
		}, []);
	};

	function until(work, interval, verifier) {

		var deferred = when.defer();

		verifier = verifier || function () { return false; };

		function schedule() {
			setTimeout(vote, interval);
		}

		function vote() {
			when(work(),
				function (result) {
					when(verifier(result), handleNext, schedule);

					function handleNext(verification) {
						return verification ? deferred.resolve(result) : schedule();
					}
				},
				deferred.reject
			);
		}

		schedule();

		return deferred.promise;
	}


});
})(typeof define == 'function' && define.amd ? define : function(factory) { module.exports = factory(require); });