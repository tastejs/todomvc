/** MIT License (c) copyright B Cavalier & J Hann */

(function(define) {
define(function (require) {
"use strict";

	var when, undef;

	when = require('when');

	/**
	 * Perform a left outer join on the supplied left and right iterables, returning
	 * a promise, which will resolve to an Array for the joined result.
	 *
	 * @param left {Iterable} anything with forEach. May be asynchronous
	 * @param leftKeyFunc {Function} function to generate a hash join key for left items
	 * @param right {Iterable} anything with forEach. May be asynchronous
	 * @param rightKeyFunc {Function} function to generate a hash join key for right items
	 * @param projectionFunc {Function} function to create a projected result from two joined items
	 * @param multiProjection {Boolean} by default (multiProjection is falsey), each left-right join pair will be passed
	 * to projectionFunc.  Thus, the projectionFunc may be invoked with the same left item
	 * many times.  if truthy, however, the left item and *all* its matching right items, as
	 * an Array, will be passed to projectionFunc.  Thus, the projectionFunc will be invoked
	 * only once per left item.
	 * @return {Promise} promise for the Array of joined results.
	 */
	function leftOuterJoin(left, leftKeyFunc, right, rightKeyFunc, projectionFunc, multiProjection) {

		var projectJoinResults = multiProjection ? projectMulti : projectEach;

		return when(buildJoinMap(right, rightKeyFunc),
			function(joinMap) {
				return doJoin(left, leftKeyFunc, joinMap, projectJoinResults, projectionFunc)
			}
		);
	}

	return {
		leftOuterJoin: leftOuterJoin
	};

	function buildJoinMap(items, keyFunc) {
		var joinMap = {};

		return when(items.forEach(function(item) {
			var rightKey;

			// Use joinMap as a multi-map, i.e. key -> array of values
			function addToMap(rightKey, item) {
				var rightItems = joinMap[rightKey];

				if(!rightItems) {
					rightItems = [];
					joinMap[rightKey] = rightItems;
				}

				rightItems.push(item);
			}

			rightKey = keyFunc(item);

			if(isArray(rightKey)) {
				forEach(rightKey, function(rightKey) {
					addToMap(rightKey, item);
				});
			} else {
				addToMap(rightKey, item);
			}
		})).then(function() {
			return joinMap;
		});

	}

	function doJoin(items, keyFunc, joinMap, projectJoinResults, projectionFunc) {
		var joined = [];

		return when(items.forEach(function(item) {
			var joinKey;

			function join(joinKey, item, map) {
				var joinMatches = map[joinKey];
				projectJoinResults(item, joinMatches, joinKey, projectionFunc, joined);
			}

			joinKey = keyFunc(item);
			if(isArray(joinKey)) {
				forEach(joinKey, function(joinKey) {
					join(joinKey, item, joinMap);
				});
			} else {
				join(joinKey, item, joinMap);
			}

		})).then(function() {
			return joined;
		});
	}

	function isArray(it) {
		return Object.prototype.toString.call(it) == '[object Array]';
	}

	function projectMulti(leftItem, rightMatches, joinKey, projectionFunc, results) {
		var items = projectionFunc(leftItem, rightMatches, joinKey);
		results.splice(results.length, 0, items);
	}

	function projectEach(leftItem, rightMatches, joinKey, projectionFunc, results) {
		function project(left, right, key) {
			var items = projectionFunc(left, right, key);
			results.push(items);
		}

		if(rightMatches) {
			rightMatches.forEach(function(rightItem) {
				project(leftItem, rightItem, joinKey);
			});
		} else {
			project(leftItem, undef, joinKey);
		}
	}

	function forEach(arr, lambda) {
		for(var i = 0, len = arr.length; i < len; i++) {
			lambda(arr[i], i, arr);
		}
	}
});
})(
typeof define == 'function'
	? define
	: function(factory) { module.exports = factory(require); }
);
