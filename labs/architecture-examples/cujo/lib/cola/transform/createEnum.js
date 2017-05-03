/** MIT License (c) copyright B Cavalier & J Hann */

(function (define) {
define(function () {
"use strict";

	var cleanPrototype = {};
	/**
	 * Creates a set of functions that will use the supplied options to
	 * transform (and reverse-transform) a string or array of strings into
	 * an object whose properties are the same as the properties in
	 * options.enumSet and whose values are true or false, depending
	 * on whether the supplied value matches property names on the
	 * enumSet.  The supplied value may be a string or an array of strings.
	 * If enumSet is an object and it's values are strings, it is also
	 * used as a map to transform the property names of the returned object.
	 *
	 * @param options {Object} a hashmap of options for the transform
	 * @param options.enumSet {Object} or {Array}
	 * @param options.multi {Boolean} optional. Set to true to allow multiple
	 *   values to be returned from reverse().  Typically, you don't need to
	 *   set this option unless reverse() may be called before transform().
	 *   If transform() is called with an array, multi is auto-set to true.
	 * @returns {Function} function (value) { returns newValue; }
	 *
	 * @description Given the following binding, the data will be converted
	 * as follows.
	 *  permissions: {
	 * 		node: 'myview',
	 * 		prop: 'classList',
	 * 		enumSet: {
	 * 			modify: 'can-edit-data',
	 * 			create: 'can-add-data',
	 * 			remove: 'can-delete-data'
	 * 		}
	 *  }
	 *  transform(['modify', 'create']) ==>
	 *  	{
	 *  		"can-edit-data": true,
	 *  		"can-add-data": true,
	 *  		"can-delete-data": false
	 *  	}
	 *  reverse({ "can-add-data": true }) ==> ['create']
	 */
	return function createEnumTransform (enumSet, options) {
		var map, unmap, emptySet, multiValued;

		// TODO: don't waste cpu using maps if the dev gave an array
		map = createMap(enumSet);
		unmap = createReverseMap(map);
		emptySet = createEmptySet(unmap);
		multiValued = options && options.multi;

		function enumTransform (value) {
			var set, values, i, len;
			// set multiValues for next reverse call
			multiValued = isArrayLike(value);
			set = beget(emptySet);
			values = [].concat(value);
			len = values.length;
			for (i = 0; i < len; i++) {
				if (values[i] in map) {
					set[map[values[i]]] = true;
				}
			}
			return set;
		}

		function enumReverse (set) {
			var values, p;
			values = [];
			for (p in set) {
				if (set[p] && p in unmap) {
					values.push(unmap[p]);
				}
			}
			return multiValued === false ? values[0] : values;
		}

		enumTransform.inverse = enumReverse;
		enumReverse.inverse = enumTransform;

		return enumTransform;

		function createMap (obj) {
			var map, i, len;
			if (isArrayLike(obj)) {
				map = {};
				len = obj.length;
				for (i = 0; i < len; i++) {
					map[obj[i]] = obj[i];
				}
			}
			else {
				map = beget(obj);
			}
			return map;
		}

		function createReverseMap (map) {
			var unmap, p;
			unmap = {};
			for (p in map) {
				unmap[map[p]] = p;
			}
			return unmap;
		}

		function createEmptySet (map) {
			var set, p;
			set = {};
			for (p in map) {
				set[p] = false;
			}
			return set;
		}

		function toString (o) { return Object.prototype.toString.apply(o); };

		function isString (obj) {
			return toString(obj) == '[object String]'
		}

		function isArrayLike (obj) {
			// IE doesn't have string[index]
			return obj && obj.length && !isString(obj);
		}

		function Begetter () {}
		function beget (obj) {
			var newObj;
			Begetter.prototype = obj;
			newObj = new Begetter();
			Begetter.prototype = cleanPrototype;
			return newObj;
		}

	};

});
}(
	typeof define == 'function'
		? define
		: function (factory) { module.exports = factory(); }
));