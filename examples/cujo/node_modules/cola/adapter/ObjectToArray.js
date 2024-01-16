/** MIT License (c) copyright B Cavalier & J Hann */

(function(define) {
define(function (require) {

	"use strict";

	var ArrayAdapter, ObjectAdapter, when;

	ArrayAdapter = require('./Array');
	ObjectAdapter = require('./Object');
	when = require('when');

	/**
	 * Manages a collection of objects created by transforming the input Object
	 * (or Promise for an Object) into a collection using the supplied
	 * options.transform
	 * @constructor
	 * @param object {Object|Promise} Object or Promise for an Object
	 * @param options.identifier {Function} function that returns a key/id for
	 * a data item.
	 * @param options.comparator {Function} comparator function that will
	 * be propagated to other adapters as needed
	 * @param options.transform {Function} transform function that will
	 * transform the input object into a collection
	 */
	function WidenAdapter(object, options) {

		if (!(options && options.transform)) {
			throw new Error("options.transform must be provided");
		}

		this._transform = options.transform;
		delete options.transform;

		ArrayAdapter.call(this, object, options);
	}

	WidenAdapter.prototype = new ArrayAdapter();
	WidenAdapter.prototype._init = function(object) {
		ArrayAdapter.prototype._init.call(this, this._transform(object));
	};

	/**
	 * Tests whether the given object is a candidate to be handled by
	 * this adapter.  Returns true if the object is a promise or
	 * ArrayAdapter.canHandle returns true;
	 *
	 * WARNING: Testing for a promise is NOT sufficient, since the promise
	 * may result to something that this adapter cannot handle.
	 *
	 * @param it
	 * @return {Boolean}
	 */
	WidenAdapter.canHandle = function(it) {
		return when.isPromise(it) || ObjectAdapter.canHandle(it);
	};

	return WidenAdapter;
});

})(
	typeof define == 'function'
		? define
		: function(factory) { module.exports = factory(require); }
);
