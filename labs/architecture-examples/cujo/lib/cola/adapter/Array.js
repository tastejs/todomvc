/** MIT License (c) copyright B Cavalier & J Hann */

// TODO: Evaluate whether ArrayAdapter should use SortedMap internally to
// store items in sorted order based on its comparator

(function(define) {
define(function (require) {

	"use strict";

	var when, methods, undef;
	when = require('when');

	/**
	 * Manages a collection of objects taken from the supplied dataArray
	 * @param dataArray {Array} array of data objects to use as the initial
	 * population
	 * @param options.identifier {Function} function that returns a key/id for
	 * a data item.
	 * @param options.comparator {Function} comparator function that will
	 * be propagated to other adapters as needed
	 */
	function ArrayAdapter(dataArray, options) {

		if(!options) options = {};

		this._options = options;

		// Use the default comparator if none provided.
		// The consequences of this are that the default comparator will
		// be propagated to downstream adapters *instead of* an upstream
		// adapter's comparator
		this.comparator = options.comparator || this._defaultComparator;

		this.identifier = options.identifier || defaultIdentifier;

		if('provide' in options) {
			this.provide = options.provide;
		}

		this._array = dataArray;
		this.clear();

		var self = this;
		when(dataArray, function(array) {
			mixin(self, methods);
			self._init(array);
		});
	}

	ArrayAdapter.prototype = {

		provide: true,

		_init: function(dataArray) {
			if(dataArray && dataArray.length) {
				addAll(this, dataArray);
			}
		},

		/**
		 * Default comparator that uses an item's position in the array
		 * to order the items.  This is important when an input array is already
		 * in sorted order, so the user doesn't have to specify a comparator,
		 * and so the order can be propagated to other adapters.
		 * @param a
		 * @param b
		 * @return {Number} -1 if a is before b in the input array
		 *  1 if a is after b in the input array
		 *  0 iff a and b have the same symbol as returned by the configured identifier
		 */
		_defaultComparator: function(a, b) {
			var aIndex, bIndex;

			aIndex = this._index(this.identifier(a));
			bIndex = this._index(this.identifier(b));

			return aIndex - bIndex;
		},

		comparator: undef,

		identifier: undef,

		// just stubs for now
		getOptions: function () {
			return this._options;
		},

		forEach: function(lambda) { return this._forEach(lambda); },

		add: function(item) { return this._add(item); },

		remove: function(item) { return this._remove(item); },

		update: function(item) { return this._update(item); },

		clear: function() { return this._clear(); }
	};

	methods = {

		_forEach: function(lambda) {
			var i, data, len;

			i = 0;
			data = this._data;
			len = data.length;

			for(; i < len; i++) {
				// TODO: Should we catch exceptions here?
				lambda(data[i]);
			}
		},

		_add: function(item) {
			var key, index;

			key = this.identifier(item);
			index = this._index;

			if(key in index) return null;

			index[key] = this._data.push(item) - 1;

			return index[key];
		},

		_remove: function(itemOrId) {
			var key, at, index, data;

			key = this.identifier(itemOrId);
			index = this._index;

			if(!(key in index)) return null;

			data = this._data;

			at = index[key];
			data.splice(at, 1);

			// Rebuild index
			this._index = buildIndex(data, this.identifier);

			return at;
		},

		_update: function (item) {
			var key, at, index;

			key = this.identifier(item);
			index = this._index;

			at = index[key];

			if (at >= 0) {
				this._data[at] = item;
			}
			else {
				index[key] = this._data.push(item) - 1;
			}

			return at;
		},

		_clear: function() {
			this._data = [];
			this._index = {};
		}

	};

	mixin(ArrayAdapter.prototype, methods, makePromiseAware);

	/**
	 *
	 * @param to
	 * @param from
	 * @param [transform]
	 */
	function mixin(to, from, transform) {
		var name, func;
		for(name in from) {
			if(from.hasOwnProperty(name)) {
				func = from[name];
				to[name] = transform ? transform(func) : func;
			}
		}

		return to;
	}

	/**
	 * Returns a new function that will delay execution of the supplied
	 * function until this._resultSetPromise has resolved.
	 *
	 * @param func {Function} original function
	 * @return {Promise}
	 */
	function makePromiseAware(func) {
		return function promiseAware() {
			var self, args;

			self = this;
			args = Array.prototype.slice.call(arguments);

			return when(this._array, function() {
				return func.apply(self, args);
			});
		}
	}

	ArrayAdapter.canHandle = function(it) {
		return it && (when.isPromise(it) || Object.prototype.toString.call(it) == '[object Array]');
	};

	function defaultIdentifier(item) {
		return typeof item == 'object' ? item.id : item;
	}

	/**
	 * Adds all the items, starting at the supplied start index,
	 * to the supplied adapter.
	 * @param adapter
	 * @param items
	 */
	function addAll(adapter, items) {
		for(var i = 0, len = items.length; i < len; i++) {
			adapter.add(items[i]);
		}
	}

	function buildIndex(items, keyFunc) {
		var index, i, len;

		index = {};

		for(i = 0, len = items.length; i < len; i++) {
			index[keyFunc(items[i])] = i;
		}

		return index;
	}

	return ArrayAdapter;
});

})(
	typeof define == 'function'
		? define
		: function(factory) { module.exports = factory(require); }
);
