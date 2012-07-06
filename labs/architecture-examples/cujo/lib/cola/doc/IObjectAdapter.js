/** MIT License (c) copyright B Cavalier & J Hann */

/**
 * Creates a cola adapter for interacting with a single object.
 * @constructor
 * @param object {Object}
 */
function IObjectAdapter (object) {}

IObjectAdapter.prototype = {

	/**
	 * Gets the options information that
	 * were provided to the adapter.
	 * @returns {Object}
	 */
	getOptions: function () {

	},

	/**
	 * Signals that one or more of the properties has changed.
	 * @param item {Object} the newly updated item
	 */
	update: function (item) {}

};

/**
 * Tests whether the given object is a candidate to be handled by
 * this adapter.
 * @param obj
 * @returns {Boolean}
 */
IObjectAdapter.canHandle = function (obj) {};
