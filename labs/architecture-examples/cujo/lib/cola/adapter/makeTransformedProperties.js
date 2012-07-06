/** MIT License (c) copyright B Cavalier & J Hann */

(function (define) {
define(function (require) {
"use strict";

	var SortedMap = require('./../SortedMap');

	/**
	 * Decorator that applies transforms to properties flowing in
	 * and out of an ObjectAdapter (or similar).
	 * @param adapter {Object}
	 * @param transforms {Object}
	 */
	function addPropertyTransforms (adapter, transforms) {
		var origGet, origAdd, origUpdate, origForEach, transformedItemMap;

		// only override if transforms has properties
		if (transforms && hasProperties(transforms)) {

			origGet = adapter.get;
			origAdd = adapter.add;
			origUpdate = adapter.update;
			origForEach = adapter.forEach;
			transformedItemMap = new SortedMap(adapter.identifier, adapter.comparator);

			if (origGet) {
				adapter.get = function transformedGet (id) {
					return untransformItem(origGet.call(adapter, id), transforms, transformedItemMap);
				};
			}

			if (origAdd) {
				adapter.add = function transformedAdd (item) {
					return origAdd.call(adapter, transformItem(item, transforms, transformedItemMap));
				};
			}

			if (origUpdate) {
				adapter.update = function transformedUpdate (item) {
					return origUpdate.call(adapter, transformItem(item, transforms, transformedItemMap));
				};
			}

			if (origForEach) {
				adapter.forEach = function transformedForEach (lambda) {
					// Note: potential performance improvement if we cache the
					// transformed lambdas in a hashmap.
					function transformedLambda (item, key) {
						var inverted = untransformItem(item, transforms, transformedItemMap);
						return lambda(inverted, key);
					}

					return origForEach.call(adapter, transformedLambda);
				};
			}

		}

		return adapter;
	}

	return addPropertyTransforms;

	function identity (val) { return val; }

	function hasProperties (obj) {
		for (var p in obj) return true;
	}

	function transformItem (item, transforms, map) {
		var transformed, name, transform;

		transformed = {};

		// direct transforms
		for (name in item) {
			transform = transforms[name] || identity;
			transformed[name] = transform(item[name], name, item);
		}

		// derived transforms
		for (name in transforms) {
			if (!(name in item)) {
				transformed[name] = transforms[name](null, name, item);
			}
		}

		// remove should be a noop if we don't already have it
		map.remove(transformed);
		map.add(transformed, item);

		return transformed;
	}

	function untransformItem (transformed, transforms, map) {
		var origItem, name, transform;

		// get original item
		origItem = map.get(transformed);

		for (name in origItem) {
			transform = transforms[name] && transforms[name].inverse;
			if (transform) {
				origItem[name] = transform(transformed[name], name, transformed);
			}
		}

		return origItem;
	}

});
}(
	typeof define == 'function'
		? define
		: function (factory) { module.exports = factory(require); }
));
