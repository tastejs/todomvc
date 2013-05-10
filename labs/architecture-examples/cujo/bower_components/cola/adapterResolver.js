(function (define) {
define(function () {
"use strict";

	return {
		/**
		 * Finds an adapter for the given object and the role.
		 * This is overly simplistic for now. We can replace this
		 * resolver later.
		 * @param object {Object}
		 * @description Loops through all Adapters registered with
		 * AdapterResolver.register, calling each Adapter's canHandle
		 * method. Adapters added later are found first.
		 */
		resolve: function(object) {
			var adapters, i, Adapter;

			adapters = this.adapters;

			if (adapters) {
				i = adapters.length;
				while ((Adapter = adapters[--i])) {
					if (Adapter.canHandle(object)) {
						return Adapter;
					}
				}
			}
		},

		register: function(Adapter) {
			var adapters = this.adapters;
			if(adapters.indexOf(Adapter) === -1) {
				adapters.push(Adapter);
			}
		}
	};

});
}(
	typeof define == 'function'
		? define
		: function (factory) { module.exports = factory(); }
));