/** @license MIT License (c) copyright B Cavalier & J Hann */

/**
 * unfold
 * @author: brian@hovercraftstudios.com
 */
(function(define) {
define(function(require) {

	var when;

	when = require('./when');

	/**
	 * Anamorphic unfold/map that generates values by applying
	 * handler(generator(seed)) iteratively until condition(seed)
	 * returns true.
	 * @param {function} unspool function that generates a [value, newSeed]
	 *  given a seed.
	 * @param {function} condition function that, given the current seed, returns
	 *  truthy when the unfold should stop
	 * @param {function} handler function to handle the value produced by generator
	 * @param seed {*|Promise} any value or promise
	 * @return {Promise} the result of the unfold
	 */
	return function unfold(unspool, condition, handler, seed) {
		return when(seed, function(seed) {

			return when(condition(seed), function(done) {
				return done ? seed : when.resolve(unspool(seed)).spread(next);
			});

			function next(item, newSeed) {
				return when(handler(item), function() {
					return unfold(unspool, condition, handler, newSeed);
				});
			}
		});
	};

});
})(
	typeof define === 'function' && define.amd ? define : function (factory) { module.exports = factory(require); }
	// Boilerplate for AMD and Node
);
