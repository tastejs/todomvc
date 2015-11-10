/** @license MIT License (c) copyright 2013 original authors */
/**
 * Array -- a stand-alone module for using Javascript 1.6 array features
 * in lame-o browsers that don't support Javascript 1.6
 *
 * @author Jared Cacurak
 * @author Brian Cavalier
 * @author John Hann
 */
/*
	define(['poly!poly/array'], function () {
		var items = [1, 2, 3];
		items.forEach(function (item) {
			console.log(item);
		};
	});

	All of the wrapper API methods are shimmed and are reasonably close to
	the ES5 specification, but may vary slightly in unforeseen edge cases:

	var array = [1, 2, 3];

	array.forEach(lambda [, context]);
	array.every(lambda [, context]);
	array.some(lambda [, context]);
	array.filter(lambda [, context]);
	array.map(lambda [, context]);
	array.indexOf(item [, fromIndex]);
	array.lastIndexOf(item [, fromIndex]);
	array.reduce(reduceFunc [, initialValue]);
	array.reduceRight(reduceFunc [, initialValue]);
	Array.isArray(object)

 */
(function (define) {
define(function (require) {
"use strict";

	var base = require('./lib/_base');
	var array = require('./lib/_array');

	var proto = Array.prototype,
		featureMap,
		_reduce,
		_find;

	featureMap = {
		'array-foreach': 'forEach',
		'array-every': 'every',
		'array-some': 'some',
		'array-map': 'map',
		'array-filter': 'filter',
		'array-reduce': 'reduce',
		'array-reduceright': 'reduceRight',
		'array-indexof': 'indexOf',
		'array-lastindexof': 'lastIndexOf'
	};

	function has (feature) {
		var prop = featureMap[feature];
		return base.isFunction(proto[prop]);
	}

	function returnTruthy () {
		return 1;
	}

	/***** iterators *****/

	if (!has('array-foreach')) {
		proto.forEach = function forEach (lambda) {
			// arguments[+1] is to fool google closure compiler into NOT adding a function argument!
			array.iterate(this, lambda, returnTruthy, arguments[+1]);
		};
	}

	if (!has('array-every')) {
		proto.every = function every (lambda) {
			// arguments[+1] is to fool google closure compiler into NOT adding a function argument!
			return array.iterate(this, lambda, array.returnValue, arguments[+1]);
		};
	}

	if (!has('array-some')) {
		proto.some = function some (lambda) {
			// arguments[+1] is to fool google closure compiler into NOT adding a function argument!
			return array.iterate(this, lambda, function (val) { return !val; }, arguments[+1]);
		};
	}

	/***** mutators *****/

	if(!has('array-map')) {
		proto.map = function map (lambda) {
			var arr, result;

			arr = this;
			result = new Array(arr.length);

			// arguments[+1] is to fool google closure compiler into NOT adding a function argument!
			array.iterate(arr, lambda, function (val, i) { result[i] = val; return 1; }, arguments[+1]);

			return result;
		};
	}

	if (!has('array-filter')) {
		proto.filter = function filter (lambda) {
			var arr, result;

			arr = this;
			result = [];

			array.iterate(arr, lambda, function (val, i, orig) {
				// use a copy of the original value in case
				// the lambda function changed it
				if (val) {
					result.push(orig);
				}
				return 1;
			}, arguments[1]);

			return result;
		};
	}

	/***** reducers *****/

	if (!has('array-reduce') || !has('array-reduceright')) {

		_reduce = function _reduce (reduceFunc, inc, initialValue, hasInitialValue) {
			var reduced, startPos, initialValuePos;

			startPos = initialValuePos = inc > 0 ? -1 : array.toArrayLike(this).length >>> 0;

			// If no initialValue, use first item of array (we know length !== 0 here)
			// and adjust i to start at second item
			if (!hasInitialValue) {
				array.iterate(this, array.returnValue, function (val, i) {
					reduced = val;
					initialValuePos = i;
				}, null, startPos + inc, inc);
				if (initialValuePos == startPos) {
					// no intial value and no items in array!
					throw new TypeError();
				}
			}
			else {
				// If initialValue provided, use it
				reduced = initialValue;
			}

			// Do the actual reduce
			array.iterate(this, function (item, i, arr) {
				reduced = reduceFunc(reduced, item, i, arr);
			}, returnTruthy, null, initialValuePos + inc, inc);

			// we have a reduced value!
			return reduced;
		};

		if (!has('array-reduce')) {
			proto.reduce = function reduce (reduceFunc /*, initialValue */) {
				return _reduce.call(this, reduceFunc, 1, arguments[+1], arguments.length > 1);
			};
		}

		if (!has('array-reduceright')) {
			proto.reduceRight = function reduceRight (reduceFunc /*, initialValue */) {
				return _reduce.call(this, reduceFunc, -1, arguments[+1], arguments.length > 1);
			};
		}
	}

	/***** finders *****/

	if (!has('array-indexof') || !has('array-lastindexof')) {

		_find = function _find (arr, item, from, forward) {
			var len = array.toArrayLike(arr).length >>> 0, foundAt = -1;

			// convert to number, or default to start or end positions
			from = isNaN(from) ? (forward ? 0 : len - 1) : Number(from);
			// negative means it's an offset from the end position
			if (from < 0) {
				from = len + from - 1;
			}

			array.iterate(arr, array.returnValue, function (val, i) {
				if (val === item) {
					foundAt = i;
				}
				return foundAt == -1;
			}, null, from, forward ? 1 : -1);

			return foundAt;
		};

		if (!has('array-indexof')) {
			proto.indexOf = function indexOf (item) {
				// arguments[+1] is to fool google closure compiler into NOT adding a function argument!
				return _find(this, item, arguments[+1], true);
			};
		}

		if (!has('array-lastindexof')) {
			proto.lastIndexOf = function lastIndexOf (item) {
				// arguments[+1] is to fool google closure compiler into NOT adding a function argument!
				return _find(this, item, arguments[+1], false);
			};
		}
	}

	if (!Array.isArray) {
		Array.isArray = base.isArray;
	}

});
}(
	typeof define == 'function' && define.amd
		? define
		: function (factory) { module.exports = factory(require); }
));
