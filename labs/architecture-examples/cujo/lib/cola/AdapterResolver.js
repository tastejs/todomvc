(function (define) {
define(function () {
"use strict";

	var adapters;

	adapters = {};

	/**
	 * Finds an adapter for the given object and the role.
	 * This is overly simplistic for now. We can replace this
	 * resolver later.
	 * @param object {Object}
	 * @param type {String}
	 * @description Loops through all Adapters registered with
	 * AdapterResolver.register, calling each Adapter's canHandle
	 * method. Adapters added later are found first.
	 */
	function AdapterResolver (object, type) {
		var adaptersOfType, i, Adapter;
		adaptersOfType = adapters[type];
		if (adaptersOfType) {
			i = adaptersOfType.length;
			while ((Adapter = adaptersOfType[--i])) {
				if (Adapter.canHandle(object)) {
					return Adapter;
				}
			}
		}
	}

	AdapterResolver.register = function registerAdapter (Adapter, type) {
		if (!(type in adapters)) adapters[type] = [];
		adapters[type].push(Adapter);
	};

	return AdapterResolver;

});
}(
	typeof define == 'function'
		? define
		: function (factory) { module.exports = factory(); }
));
