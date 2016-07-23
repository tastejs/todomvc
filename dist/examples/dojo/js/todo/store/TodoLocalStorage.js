// TODO: Remove this file once Dojo provides this feature out-of-the-box.
define([
	'dojo/_base/declare',
	'dojo/_base/lang',
	'dojo/has',
	'dojo/json',
	'dojo/store/util/QueryResults',
	'dojo/store/util/SimpleQueryEngine'
], function (declare, lang, has, json, QueryResults, SimpleQueryEngine) {
	'use strict';

	has.add('array-findindex-api', typeof Array.prototype.findIndex === 'function');

	function findIndex(a, callback, thisObject) {
		if (has('array-findindex-api')) {
			return a.findIndex(callback, thisObject);
		} else {
			for (var i = 0; i < a.length; i++) {
				if (callback.call(thisObject, a[i])) {
					return i;
				}
			}
			return -1;
		}
	}

	/**
	 * Dojo Object Store ({@link http://dojotoolkit.org/reference-guide/dojo/store.html})
	 * implementation of local storage for todo.
	 * @class TodoLocalStorage
	 */
	return declare(null, /** @lends TodoLocalStorage# */ {
		/**
		 * The ID of local storage.
		 * @type {string}
		 */
		storageId: 'todos-dojo',

		/**
		 * If the store has a single primary key, this indicates the property to use as the identity property.
		 * The values of this property should be unique.
		 */
		idProperty: 'id',

		/**
		 * Defines the query engine to use for querying the data store.
		 * @type {Function}
		 */
		queryEngine: SimpleQueryEngine,

		_loadStorage: function () {
			return json.parse(localStorage.getItem(this.storageId) || '[]');
		},

		_saveStorage: function (data) {
			localStorage.setItem(this.storageId, json.stringify(data));
		},

		/**
		 * dojo/_base/declare callback to mix parameter list into this instance.
		 * @param {Object} props The proerties to mix into this instance.
		 */
		postscript: function (props) {
			lang.mixin(this, props);
		},

		/**
		 * Retrieves an object by its identity.
		 * @param {number} id The identity to use to lookup the object
		 * @returns {Object} The object in the store that matches the given id.
		 */
		get: function (id) {
			var data = this._loadStorage();
			var index = findIndex(data, function (item) {
				return this.getIdentity(item) === id;
			}, this);
			if (index >= 0) {
				return data[index];
			}
		},

		/**
		 * @param {Object} object The object to get the identity from.
		 * @returns {number} The identify of the given object.
		 */
		getIdentity: function (object) {
			return object[this.idProperty];
		},

		/**
		 * Stores an object.
		 * @param {Object} object The object to store.
		 * @param {Object} [options]
		 *     Additional metadata for storing the data.
		 *     Includes an `id` property if a specific id is to be used.
		 * @returns {number} The ID of the stored object.
		 */
		put: function (object, options) {
			var id = options && options.id || this.getIdentity(object) || Math.random();
			var data = this._loadStorage();
			var index = findIndex(data, function (item) {
				return this.getIdentity(item) === id;
			}, this);
			data[index >= 0 ? index : data.length] = object;
			object[this.idProperty] = id;
			this._saveStorage(data);
			return id;
		},

		/**
		 * Creates an object, throws an error if the object already exists.
		 * @param {Object} object The object to store.
		 * @param {Object} [options]
		 *     Additional metadata for storing the data.
		 *     Includes an `id` property if a specific id is to be used.
		 */
		add: function (object, options) {
			if (this.get(this.getIdentity(object))) {
				throw new Error('Object already exists.');
			}
			return this.put(object, options);
		},

		/**
		 * Deletes an object by its identity.
		 * @param {number} id The identity to use to delete the object.
		 */
		remove: function (id) {
			var data = this._loadStorage();
			var index = findIndex(data, function (item) {
				return this.getIdentity(item) === id;
			}, this);
			if (index < 0) {
				throw new Error('Object not found.');
			}
			data.splice(index, 1);
			this._saveStorage(data);
		},

		/**
		 * Queries the store for objects.
		 * @param {Object} query The query to use for retrieving objects from the store.
		 * @param {dojo/store/util/SimpleQueryEngine.__queryOptions} [options]
		 *     The optional arguments to apply to the resultset.
		 * @returns {dojo/store/util/QueryResults} The results of the query, extended with iterative methods.
		 * @example
		 * <caption>
		 *     Find all completed items.
		 * </caption>
		 * var results = store.query({completed: true});
		 */
		query: function (query, options) {
			/*jshint newcap:false*/
			return QueryResults(this.queryEngine(query, options)(this._loadStorage()));
		}
	});
});
