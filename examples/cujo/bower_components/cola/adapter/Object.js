/** MIT License (c) copyright B Cavalier & J Hann */

(function (define) {
define(function (require) {
"use strict";

	var when = require('when');

	/**
	 * Adapter that handles a plain object or a promise for a plain object
	 * @constructor
	 * @param obj {Object|Promise}
	 * @param options {Object}
	 */
	function ObjectAdapter(obj, options) {

		if(!options) {
			options = {};
		}

		this._obj = obj;
		this._options = options;

		if('provide' in options) {
			this.provide = options.provide;
		}

	}

	ObjectAdapter.prototype = {

		provide: true,

		update: function (item) {
			var self = this;

			return when(this._obj, function(obj) {
				function updateSynchronously(item) {
					// don't replace item in case we got a partial object
					for (var p in item) {
						obj[p] = item[p];
					}
				}

				self.update = updateSynchronously;

				return updateSynchronously(item);
			});

		},

		properties: function(lambda) {
			var self = this;
			return when(this._obj, function(obj) {
				function properties(l) {
					l(obj);
				}
				self.properties = properties;

				return properties(lambda);
			});
		},

		getOptions: function () {
			return this._options;
		}

	};

	/**
	 * Tests whether the given object is a candidate to be handled by
	 * this adapter.  Returns true if the object is of type 'object'.
	 * @param obj
	 * @returns {Boolean}
	 */
	ObjectAdapter.canHandle = function (obj) {
		// this seems close enough to ensure that instanceof works.
		// a RegExp will pass as a valid prototype, but I am not sure
		// this is a bad thing even if it is unusual.
		// IMPORTANT: since promises *are* objects, the check for isPromise
		// must come first in the OR
		return obj && (when.isPromise(obj) || Object.prototype.toString.call(obj) == '[object Object]');
	};

	return ObjectAdapter;

});
}(
	typeof define == 'function'
		? define
		: function (factory) { module.exports = factory(require); }
));