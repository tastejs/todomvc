/** MIT License (c) copyright B Cavalier & J Hann */

(function(define) {
define(function (require) {

//	"use strict";

	var when, SortedMap, undef;

	when = require('when');
	SortedMap = require('./../SortedMap');

	/**
	 * Manages a collection of objects taken a queryable data source, which
	 * must provide query, add, and remove methods
	 * @constructor
	 * @param datasource {Object} queryable data source with query, add, put, remove methods
	 * @param [options.comparator] {Function} comparator function that will
	 * be propagated to other adapters as needed.  Note that QueryAdapter does not
	 * use this comparator internally.
	 */
	function QueryAdapter(datasource, options) {

		var identifier, dsQuery, self;

		if(!datasource) throw new Error('cola/QueryAdapter: datasource must be provided');

		this._datasource = datasource;

		if(!options) options = {};

		this._options = options;

		if('provide' in options) {
			this.provide = options.provide;
		}

		// Always use the datasource's identity as the identifier
		identifier = this.identifier =
			function(item) {
				// TODO: remove dojo-specific behavior
				return datasource.getIdentity(item);
			};

		// If no comparator provided, generate one that uses
		// the object identity
		this.comparator = this._options.comparator ||
			function(a, b) {
				var aKey, bKey;

				aKey = identifier(a);
				bKey = identifier(b);

				return aKey == bKey ? 0
					: aKey < bKey ? -1
					: 1;
			};

		this._items = new SortedMap(identifier, this.comparator);

		// override the store's query
		dsQuery = datasource.query;
		self = this;
		datasource.query = function(query) {
			return self._queue(function() {
				return when(dsQuery.call(datasource, arguments), function(results) {
					self._items = new SortedMap(self.identifier, self.comparator);
					self._initResultSet(results);
					return results;
				});
			});
		};

	}

	QueryAdapter.prototype = {

		provide: true,

		comparator: undef,

		identifier: undef,

		query: function(query) {
			return this._datasource.query.apply(this._datasource, arguments);
		},

		/**
		 * Adds op to the internal queue of async tasks to ensure that
		 * it will run in the order added and not overlap with other async tasks
		 * @param op {Function} async task (function that returns a promise) to add
		 *  to the internal queue
		 * @return {Promise} promise that will resolver/reject when op has completed
		 * @private
		 */
		_queue: function(op) {
			this._inflight = when(this._inflight, function() {
				return op();
			});

			return this._inflight;
		},

		/**
		 * Initialized the internal map of items
		 * @param results {Array} array of result items
		 * @private
		 */
		_initResultSet: function (results) {
			var map, i, len, item, self;

			map = this._items;
			map.clear();

			self = this;
			for(i = 0, len = results.length; i < len; i++) {
				item = results[i];
				map.add(item, item);
				self.add(item);
			}
		},

		getOptions: function() {
			return this._options;
		},

		forEach: function(lambda) {
			var self = this;
			return this._queue(function() {
				return self._items.forEach(lambda);
			});
		},

		add: function(item) {
			var items, added, self;

			items = this._items;
			added = items.add(item, item);

			if(added >= 0 && !this._dontCallDatasource) {

				self = this;

				// This is optimistic, maybe overly so.  It notifies listeners
				// that the item is added, even though there may be an inflight
				// async store.add().  If the add fails, it tries to revert
				// by removing the item from the local map, notifying listeners
				// that it is removed, and "rethrowing" the failure.
				// When we move all data to a central SortedMap, we can handle
				// this behavior with a strategy.
				return when(this._datasource.add(item),
					function(returned) {
						if (self._itemWasUpdatedByDatasource(returned)) {
							self._execMethodWithoutCallingDatasource('update', returned);
						}
					},
					function(err) {
						self._execMethodWithoutCallingDatasource('remove', item);
						throw err;
					}
				);
			}
		},

		// TODO: allow an item or an id to be provided
		remove: function(item) {
			var removed, items;

			items = this._items;
			removed = items.remove(item);

			if(removed >= 0 && !this._dontCallDatasource) {

				// TODO: remove dojo-specific behavior
				var id = this._datasource.getIdentity(item);

				// Similar to add() above, this should be replaced with a
				// central SortedMap and strategy.
				return when(this._datasource.remove(id),
					null, // If all goes according to plan, great, nothing to do
					function(err) {
						self._execMethodWithoutCallingDatasource('add', item);
						throw err;
					}
				);
			}
		},

		update: function(item) {
			var orig, items, self;

			items = this._items;
			orig = items.get(item);

			if(orig) {
				this._replace(orig, item);

				if (!this._dontCallDatasource) {
					self = this;

					// Similar to add() above, this should be replaced with a
					// central SortedMap and strategy.
					return when(this._datasource.put(item),
						function(returned) {
							if (self._itemWasUpdatedByDatasource(returned)) {
								self._execMethodWithoutCallingDatasource('update', returned);
							}
						},
						function(err) {
							self._execMethodWithoutCallingDatasource('update', orig);
							throw err;
						}
					);
				}
			}
		},

		_replace: function(oldItem, newItem) {
			this._items.remove(oldItem);
			this._items.add(newItem, newItem);
		},

		_itemWasUpdatedByDatasource: function(item) {
			return hasProperties(item);
		},

		_execMethodWithoutCallingDatasource: function(method, item) {
			this._dontCallDatasource = true;
			try {
				return this[method](item);
			}
			finally {
				this._dontCallDatasource = false;
			}
		},

		clear: function() {
			this._initResultSet([]);
		}
	};

	QueryAdapter.canHandle = function(it) {
		return it && typeof it.query == 'function' && !(it instanceof QueryAdapter);
	};

	return QueryAdapter;

	function hasProperties (o) {
		if (!o) return false;
		for (var p in o) return true;
	}

});

})(
	typeof define == 'function'
		? define
		: function(factory) { module.exports = factory(require); }
);
