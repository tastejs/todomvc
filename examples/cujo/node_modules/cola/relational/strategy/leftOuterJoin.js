/** MIT License (c) copyright B Cavalier & J Hann */

(function(define) {
define(function (require) {

	"use strict";

	var hashJoin, createPropertiesKey, defaultProjection;

	hashJoin = require('../hashJoin');
	createPropertiesKey = require('../propertiesKey');
	defaultProjection = require('../../projection/inherit');

	/**
	 * Creates a join strategy that will perform a left outer hash join
	 * using the supplied options, using supplied key functions to generate
	 * hash keys for correlating items.
	 * @param options.leftKeyFunc {Function} function to create a join key
	 * for items on the left
	 * @param [options.rightKeyFunc] {Function} function to create a join key
	 * for items on the right.  If not provided, options.leftKeyFunc will be used
	 * @param [options.projection] {Function} function to project joined left
	 * and right values into a final join result
	 * @param [options.multiValue] {Boolean} if truthy, allows the projection to
	 * act on the complete set of correlated right-hand items, rather than on each
	 * distinct left-right pair.
	 */
	return function createLeftOuterJoinStrategy(options) {

		var leftKeyFunc, rightKeyFunc, projection, multiValue;

		if(!(options && options.leftKey)) {
			throw new Error('options.leftKeyFunc must be provided')
		}

		leftKeyFunc  = options.leftKey;
		if(typeof leftKeyFunc != 'function') {
			leftKeyFunc = createPropertiesKey(leftKeyFunc);
		}

		rightKeyFunc = options.rightKey || leftKeyFunc;
		if(typeof rightKeyFunc != 'function') {
			rightKeyFunc = createPropertiesKey(rightKeyFunc);
		}

		projection   = options.projection || defaultProjection;
		multiValue   = options.multiValue;

		// Return the join strategy
		return function outerHashJoin(left, right) {

			return hashJoin.leftOuterJoin(
				left, leftKeyFunc,
				right, rightKeyFunc,
				projection, multiValue
			);

		}
	};

});
})(
	typeof define == 'function'
		? define
		: function(factory) { module.exports = factory(require); }
);
